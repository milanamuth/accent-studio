// api/feedback.js
// Serverless function: receives a WAV recording + context, asks an LLM to
// assess the user's American accent, and returns structured JSON.
//
// Provider-agnostic: set PROVIDER=gemini (default) or PROVIDER=qwen in Vercel.
// Required env var for Gemini: GEMINI_API_KEY
// Optional: GEMINI_MODEL (default gemini-2.5-flash)
// For Qwen (phase 2 / optional): DASHSCOPE_API_KEY, QWEN_MODEL

export const config = { maxDuration: 60 };

const SKILL_KEYS = ['r', 'vowels', 't', 'rhythm', 'intonation', 'fluency'];

function buildPrompt({ day, title, referenceText, weakSpots, azure }) {
  const focusLine = title ? `Today they are working on: "${title}".` : '';
  const refLine = referenceText
    ? `They are reading this exact passage, so judge accuracy against it:\n"""${referenceText}"""`
    : `There is no reference script; they are speaking freely. Judge their general American accent.`;
  const weakLine = (weakSpots && weakSpots.length)
    ? `They are already drilling these weak spots, so comment on progress where you can hear them: ${weakSpots.join('; ')}.`
    : '';

  // If Azure pronunciation assessment ran, give the coach the hard numbers so its
  // advice is grounded in objective phoneme data, not impression alone.
  let azureLine = '';
  if (azure && azure.ok) {
    const a = azure.azure || {};
    const ww = (azure.weakestWords || []).map(w => `${w.word}(${Math.round(w.score)})`).join(', ');
    const wp = (azure.weakestPhonemes || []).map(p => `${p.phoneme}(${Math.round(p.score)})`).join(', ');
    azureLine = [
      `An objective speech engine (Azure) scored this same recording on a 0-100 scale:`,
      `accuracy ${a.accuracy ?? '?'}, fluency ${a.fluency ?? '?'}, completeness ${a.completeness ?? '?'}, prosody ${a.prosody ?? '?'}, overall ${a.overall ?? '?'}.`,
      ww ? `Lowest-scoring words: ${ww}.` : '',
      wp ? `Lowest-scoring phonemes: ${wp}.` : '',
      `Treat these numbers as ground truth for pronunciation accuracy and rhythm. Align your 0-10 scores with them and focus your fixes on the specific low-scoring words and phonemes above.`
    ].filter(Boolean).join(' ');
  }

  return [
    `You are an expert General American (GenAm) accent coach giving feedback to an adult learner.`,
    `They are on day ${day || '?'} of a 60-day accent program. ${focusLine}`,
    refLine,
    weakLine,
    azureLine,
    `Listen to the attached audio of the learner speaking. Assess their American accent honestly but encouragingly.`,
    `Score each dimension from 0 to 10, where 10 means indistinguishable from a native GenAm speaker and 5 means clearly non-native but understandable.`,
    `Focus your written advice on the highest-impact corrections first (rhoticity, flap T, vowel reduction, stress-timing, intonation).`,
    `Return ONLY valid minified JSON, no markdown, no commentary, with exactly this shape:`,
    `{"scores":{"r":int,"vowels":int,"t":int,"rhythm":int,"intonation":int,"fluency":int},`,
    `"overall":int,`,
    `"summary":"2-3 sentence plain-language summary of where they are",`,
    `"strengths":["short phrase", "short phrase"],`,
    `"fixes":[{"issue":"short label","detail":"what is wrong and exactly how to fix it, with a concrete drill","skill":"one of r|vowels|t|rhythm|intonation|fluency"}],`,
    `"drills":["short drill label max 6 words"]}`,
    `Give at most 4 fixes and at most 3 drills. The "drills" must be the single most important sounds to practice next.`,
    `If the audio is silent, unintelligible, or not English, set every score to 0 and explain that in "summary".`
  ].filter(Boolean).join('\n');
}

function coerceFeedback(obj) {
  // Defensive normalisation so the front end always gets a safe shape.
  const out = { scores: {}, overall: 0, summary: '', strengths: [], fixes: [], drills: [] };
  const s = (obj && obj.scores) || {};
  let sum = 0, n = 0;
  for (const k of SKILL_KEYS) {
    let v = Number(s[k]);
    if (!Number.isFinite(v)) v = 0;
    v = Math.max(0, Math.min(10, Math.round(v)));
    out.scores[k] = v; sum += v; n++;
  }
  out.overall = Number.isFinite(Number(obj && obj.overall))
    ? Math.max(0, Math.min(10, Math.round(Number(obj.overall))))
    : Math.round(sum / Math.max(1, n));
  out.summary = String((obj && obj.summary) || '').slice(0, 600);
  if (Array.isArray(obj && obj.strengths)) out.strengths = obj.strengths.map(x => String(x).slice(0, 160)).slice(0, 5);
  if (Array.isArray(obj && obj.fixes)) {
    out.fixes = obj.fixes.slice(0, 4).map(f => ({
      issue: String((f && f.issue) || '').slice(0, 120),
      detail: String((f && f.detail) || '').slice(0, 600),
      skill: SKILL_KEYS.includes(f && f.skill) ? f.skill : ''
    }));
  }
  if (Array.isArray(obj && obj.drills)) out.drills = obj.drills.map(x => String(x).slice(0, 60)).slice(0, 3);
  return out;
}

function parseModelJson(text) {
  if (!text) throw new Error('empty model response');
  // Strip code fences if the model added them despite instructions.
  let t = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(t); } catch (e) {}
  // Extract the outermost JSON object.
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) {
    try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {}
  }
  // Last resort: try to repair a truncated object by closing open braces.
  if (a >= 0) {
    let s = t.slice(a);
    // drop a trailing incomplete fragment after the last complete value
    s = s.replace(/,\s*"[^"]*"\s*:?\s*[^,}\]]*$/, '');
    const opens = (s.match(/{/g) || []).length, closes = (s.match(/}/g) || []).length;
    s += '}'.repeat(Math.max(0, opens - closes));
    try { return JSON.parse(s); } catch (e) {}
  }
  throw new Error('could not parse model JSON');
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function callGemini({ prompt, audioBase64, mimeType }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw httpError(500, 'GEMINI_API_KEY is not set. Add it in Vercel → Settings → Environment Variables, then redeploy.');
  const primary = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  // Try the chosen model first, then fall back to others if it is overloaded/down.
  const models = [...new Set([primary, 'gemini-flash-latest', 'gemini-2.0-flash'])];

  function buildBody(model) {
    const gen = { responseMimeType: 'application/json', temperature: 0.4, maxOutputTokens: 2048 };
    // 2.5 / 3.x models "think" by default, which can eat the output budget and
    // truncate the JSON. Disable it so the full budget goes to the answer.
    if (/gemini-(2\.5|3)/.test(model) || model === 'gemini-flash-latest') {
      gen.thinkingConfig = { thinkingBudget: 0 };
    }
    return {
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: mimeType || 'audio/wav', data: audioBase64 } }
        ]
      }],
      generationConfig: gen
    };
  }

  let lastErr = null;
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const body = buildBody(model);
    for (let attempt = 0; attempt < 2; attempt++) {
      let r;
      try {
        r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      } catch (e) {
        lastErr = httpError(502, 'Network error reaching Gemini.');
        await sleep(700 * (attempt + 1));
        continue;
      }
      if (r.ok) {
        const data = await r.json();
        const text = data && data.candidates && data.candidates[0]
          && data.candidates[0].content && data.candidates[0].content.parts
          && data.candidates[0].content.parts.map(p => p.text || '').join('');
        try {
          return parseModelJson(text);
        } catch (e) {
          // Model returned 200 but the JSON was malformed or truncated.
          // Retry this model once, then fall through to the next model.
          lastErr = httpError(502, 'The model returned an incomplete assessment. Trying again.');
          await sleep(300);
          continue;
        }
      }
      const errTxt = await r.text().catch(() => '');
      // Hard errors: do not retry, surface immediately.
      if (r.status === 400 && /API key not valid/i.test(errTxt)) {
        throw httpError(500, 'Your Gemini API key was rejected. Check the GEMINI_API_KEY value in Vercel.');
      }
      // Transient errors: retry this model, then fall through to the next model.
      if (r.status === 503 || r.status === 500 || r.status === 429) {
        lastErr = httpError(r.status, 'transient');
        await sleep(1000 * (attempt + 1));
        continue;
      }
      // Other errors: stop retrying this model, try the next one.
      lastErr = httpError(502, 'Gemini request failed (' + r.status + '). ' + errTxt.slice(0, 160));
      break;
    }
  }
  // Everything was overloaded.
  const status = (lastErr && lastErr.status) || 503;
  if (status === 503 || status === 500) throw httpError(503, 'Gemini is overloaded right now on Google\u2019s side (not your setup). Wait 10 to 20 seconds and tap AI feedback again.');
  if (status === 429) throw httpError(429, 'You have hit the Gemini free-tier rate limit. Wait a minute, then try again.');
  throw lastErr || httpError(502, 'Gemini request failed. Try again shortly.');
}

async function callQwen({ prompt, audioBase64, mimeType }) {
  // Optional alternative provider (Alibaba DashScope, OpenAI-compatible endpoint).
  const key = process.env.DASHSCOPE_API_KEY;
  if (!key) throw httpError(500, 'DASHSCOPE_API_KEY is not set. Add it in Vercel to use the Qwen provider.');
  const model = process.env.QWEN_MODEL || 'qwen3-omni-flash';
  const url = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';
  const dataUrl = `data:${mimeType || 'audio/wav'};base64,${audioBase64}`;
  const body = {
    model,
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'input_audio', input_audio: { data: dataUrl, format: 'wav' } }
      ]
    }]
  };
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const errTxt = await r.text().catch(() => '');
    throw httpError(502, 'Qwen request failed (' + r.status + '). ' + errTxt.slice(0, 200));
  }
  const data = await r.json();
  const text = data && data.choices && data.choices[0] && data.choices[0].message
    && (typeof data.choices[0].message.content === 'string'
      ? data.choices[0].message.content
      : (data.choices[0].message.content || []).map(c => c.text || '').join(''));
  return parseModelJson(text);
}

function httpError(status, message) { const e = new Error(message); e.status = status; return e; }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { audioBase64, mimeType, day, title, referenceText, weakSpots, azure } = body;
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      res.status(400).json({ error: 'No audio was received.' });
      return;
    }
    // Guard against oversized payloads (Vercel body limit ~4.5MB).
    if (audioBase64.length > 4_300_000) {
      res.status(413).json({ error: 'Recording is too long to analyze. Keep analyzed clips under about 90 seconds.' });
      return;
    }
    const prompt = buildPrompt({ day, title, referenceText, weakSpots, azure });
    const provider = (process.env.PROVIDER || 'gemini').toLowerCase();
    const raw = provider === 'qwen'
      ? await callQwen({ prompt, audioBase64, mimeType })
      : await callGemini({ prompt, audioBase64, mimeType });
    const out = coerceFeedback(raw);
    if (azure && azure.ok) out.azure = azure.azure; // surface objective numbers to the UI
    res.status(200).json(out);
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    res.status(status).json({ error: (err && err.message) || 'Unexpected server error.' });
  }
}
