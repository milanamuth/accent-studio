// api/score.js
// Serverless function: Azure Pronunciation Assessment.
// Receives a WAV recording (16kHz mono PCM) + the reference text the user read,
// and returns objective accuracy / fluency / completeness / prosody scores,
// plus the lowest-scoring words and phonemes.
//
// Required env vars (set in Vercel):
//   AZURE_SPEECH_KEY     - Key 1 from your Speech resource
//   AZURE_SPEECH_REGION  - e.g. centralindia
//
// The Azure short-audio REST endpoint is limited to ~60s of audio, so callers
// should send a clip under ~58 seconds (the Rainbow Passage read is ~35s).

export const config = { maxDuration: 60 };

function httpError(status, message) { const e = new Error(message); e.status = status; return e; }

function b64ToBuffer(b64) {
  return Buffer.from(b64, 'base64');
}

// Map Azure's 0-100 scores onto the app's 0-10 skill scale.
function to10(v) {
  if (!Number.isFinite(v)) return null;
  return Math.max(0, Math.min(10, Math.round(v / 10)));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }
  try {
    const key = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION;
    if (!key || !region) {
      throw httpError(500, 'Azure is not configured. Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in Vercel, then redeploy.');
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { audioBase64, referenceText } = body;
    if (!audioBase64) { res.status(400).json({ error: 'No audio was received.' }); return; }
    if (!referenceText || !referenceText.trim()) {
      res.status(400).json({ error: 'Azure scoring needs the reference text you read. Use a benchmark day so the passage is known.' });
      return;
    }
    if (audioBase64.length > 4_300_000) {
      res.status(413).json({ error: 'Recording is too long for phoneme scoring. Keep it under about 55 seconds.' });
      return;
    }

    const audio = b64ToBuffer(audioBase64);

    // Pronunciation assessment config goes in a base64-encoded JSON header.
    const paConfig = {
      ReferenceText: referenceText,
      GradingSystem: 'HundredMark',
      Granularity: 'Phoneme',
      Dimension: 'Comprehensive',
      EnableProsodyAssessment: true
    };
    const paHeader = Buffer.from(JSON.stringify(paConfig), 'utf8').toString('base64');

    const url = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`
      + `?language=en-US`;

    let r;
    try {
      r = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Pronunciation-Assessment': paHeader,
          'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
          'Accept': 'application/json'
        },
        body: audio
      });
    } catch (e) {
      throw httpError(502, 'Could not reach Azure Speech. Check the region value.');
    }

    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      if (r.status === 401 || r.status === 403) throw httpError(500, 'Azure rejected the key. Check AZURE_SPEECH_KEY in Vercel.');
      throw httpError(502, 'Azure scoring failed (' + r.status + '). ' + txt.slice(0, 160));
    }

    const data = await r.json();
    // RecognitionStatus can be "Success" with NBest[], or "InitialSilenceTimeout" etc.
    const nb = data && data.NBest && data.NBest[0];
    if (!nb || !nb.PronunciationAssessment) {
      res.status(200).json({
        ok: false,
        reason: (data && data.RecognitionStatus) || 'NoMatch',
        message: 'Azure could not assess this audio. Make sure you read the passage clearly and the recording is not silent.'
      });
      return;
    }

    const pa = nb.PronunciationAssessment;
    const words = Array.isArray(nb.Words) ? nb.Words : [];

    // Collect the weakest words (by accuracy) and weakest phonemes for targeted drills.
    const scoredWords = words
      .filter(w => w.PronunciationAssessment && Number.isFinite(w.PronunciationAssessment.AccuracyScore))
      .map(w => ({ word: w.Word, score: w.PronunciationAssessment.AccuracyScore,
        error: w.PronunciationAssessment.ErrorType }));
    const weakestWords = [...scoredWords].sort((a, b) => a.score - b.score).slice(0, 6);

    const phonemes = [];
    for (const w of words) {
      if (Array.isArray(w.Phonemes)) {
        for (const p of w.Phonemes) {
          if (p.PronunciationAssessment && Number.isFinite(p.PronunciationAssessment.AccuracyScore)) {
            phonemes.push({ phoneme: p.Phoneme, score: p.PronunciationAssessment.AccuracyScore, word: w.Word });
          }
        }
      }
    }
    const weakestPhonemes = [...phonemes].sort((a, b) => a.score - b.score).slice(0, 8);

    res.status(200).json({
      ok: true,
      // raw Azure 0-100 dimensions
      azure: {
        accuracy: pa.AccuracyScore ?? null,
        fluency: pa.FluencyScore ?? null,
        completeness: pa.CompletenessScore ?? null,
        prosody: pa.ProsodyScore ?? null,
        overall: pa.PronScore ?? null
      },
      // mapped onto the app's six-skill 0-10 scale where Azure has a signal
      mapped: {
        vowels: to10(pa.AccuracyScore),
        t: to10(pa.AccuracyScore),
        rhythm: to10(pa.ProsodyScore),
        intonation: to10(pa.ProsodyScore),
        fluency: to10(pa.FluencyScore)
        // 'r' is left to the AI coach; Azure does not isolate rhoticity
      },
      recognizedText: nb.Display || nb.Lexical || '',
      weakestWords,
      weakestPhonemes
    });
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    res.status(status).json({ error: (err && err.message) || 'Unexpected server error.' });
  }
}
