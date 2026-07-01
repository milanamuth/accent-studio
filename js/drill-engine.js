/* =====================================================================
   js/drill-engine.js  —  Interactive practice modal for a weak spot
   ---------------------------------------------------------------------
   Headline feature. Turns a tracked weak spot into a real practice
   session: hear minimal pairs (en-US TTS), run a quick listening
   discrimination quiz, then record yourself reading target sentences
   and get objective Azure scores per line.

   It reuses these existing globals from the main inline script:
     escapeHtml, toast, blobToWavB64, STATE, practiceSpot, closeModal
   and the modal shell (#modalBg / #modalBox). It does NOT touch the
   page recorder (Rec / renderRecorder); it runs its own MediaRecorder
   so opening the modal never repaints the page behind it.

   Data comes from getDrillPack() in data/drills.js.

   Entry point:  openDrillPack(label, weakSpotId?)
   ===================================================================== */

(function(){

  const SCORE_ENDPOINT = '/api/score';

  // ---- module state for the open session ----
  const DP = {
    label:null, pack:null, weakSpotId:null,
    sIdx:0,                 // current sentence index
    rec:null, stream:null, chunks:[], mime:'', active:false,
    quiz:{ side:null, pair:null, right:0, total:0 }
  };

  /* ---------------- text to speech ---------------- */
  let _voice = null;
  function pickVoice(){
    if(_voice) return _voice;
    const all = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    _voice = all.find(v=>/en[-_]US/i.test(v.lang) && /Google|Samantha|Microsoft/i.test(v.name))
          || all.find(v=>/en[-_]US/i.test(v.lang))
          || all.find(v=>/^en/i.test(v.lang)) || null;
    return _voice;
  }
  if(window.speechSynthesis){
    try{ speechSynthesis.onvoiceschanged = ()=>{ _voice=null; pickVoice(); }; }catch(e){}
  }
  function speak(text){
    if(!window.speechSynthesis){ toast && toast('Your browser cannot play example audio.'); return; }
    try{
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      const v = pickVoice(); if(v) u.voice = v;
      u.lang = 'en-US'; u.rate = 0.95;
      speechSynthesis.speak(u);
    }catch(e){ /* ignore */ }
  }

  /* ---------------- markup ---------------- */
  function el(id){ return document.getElementById(id); }

  function pairGridHtml(pairs){
    if(!pairs || !pairs.length) return '';
    const rows = pairs.map((p,i)=>`
      <div class="dp-pair">
        <button class="dp-word" data-say="${escapeHtml(p[0])}">${escapeHtml(p[0])}</button>
        <span class="dp-vs">/</span>
        <button class="dp-word" data-say="${escapeHtml(p[1])}">${escapeHtml(p[1])}</button>
      </div>`).join('');
    return `<div class="dp-section">
      <div class="section-label">Hear the contrast · tap any word</div>
      <div class="dp-grid">${rows}</div>
    </div>`;
  }

  function quizHtml(pack){
    if(!pack.perception || !pack.perception.length) return '';
    return `<div class="dp-section">
      <div class="section-label">Listening check</div>
      <p class="dp-quiz-help">Play a word, then pick the one you heard.</p>
      <div class="dp-quiz-row">
        <button class="btn ghost mini" id="dpQuizPlay">\u25B6 Play a word</button>
        <span id="dpQuizScore" class="dp-quiz-score"></span>
      </div>
      <div class="dp-quiz-opts" id="dpQuizOpts" style="display:none">
        <button class="btn ghost mini" id="dpQuizA"></button>
        <button class="btn ghost mini" id="dpQuizB"></button>
      </div>
    </div>`;
  }

  function recordHtml(pack){
    const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
    const first = (pack.sentences && pack.sentences[0]) || pack.paragraph || '';
    if(!supported){
      return `<div class="dp-section">
        <div class="section-label">Say it and score it</div>
        <p class="dp-quiz-help">Recording needs a modern browser served over HTTPS.</p>
      </div>`;
    }
    return `<div class="dp-section">
      <div class="section-label">Say it and score it</div>
      <div class="dp-target" id="dpTarget">${escapeHtml(first)}</div>
      <div class="dp-rec-row">
        <button class="btn ghost mini" id="dpHear">\u25B6 Hear it</button>
        <button class="btn primary mini" id="dpRec">\u25CF Record</button>
        <button class="btn ghost mini" id="dpNext">Next line \u2192</button>
      </div>
      <div id="dpScore" class="dp-score"></div>
    </div>`;
  }

  function tipsHtml(pack){
    if(!pack.tips || !pack.tips.length) return '';
    const lis = pack.tips.map(t=>`<li>${escapeHtml(t)}</li>`).join('');
    return `<div class="dp-section">
      <div class="section-label">How to make the sound</div>
      <ul class="dp-tips">${lis}</ul>
    </div>`;
  }

  function paragraphHtml(pack){
    if(!pack.paragraph) return '';
    return `<div class="dp-section">
      <div class="section-label">Read the passage</div>
      <p class="dp-para" id="dpPara">${escapeHtml(pack.paragraph)}</p>
      <button class="btn ghost mini" id="dpHearPara">\u25B6 Hear the passage</button>
    </div>`;
  }

  function injectStyles(){
    if(el('dpStyles')) return;
    const css = `
      #modalBox .dp-head h3{margin-bottom:2px}
      .dp-ipa{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--amber);margin:0 0 6px}
      .dp-why{color:var(--ink-soft);font-size:13.5px;line-height:1.55;margin-bottom:4px}
      .dp-section{margin-top:18px;padding-top:16px;border-top:1px solid var(--line-solid)}
      .dp-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      @media (max-width:520px){ .dp-grid{grid-template-columns:1fr} }
      .dp-pair{display:flex;align-items:center;gap:8px;background:var(--panel-2);
        border:1px solid var(--line-solid);border-radius:10px;padding:6px 10px}
      .dp-vs{color:var(--ink-faint);font-size:13px}
      .dp-word{flex:1;background:transparent;border:none;color:var(--ink);font-family:'Hanken Grotesk',sans-serif;
        font-size:14px;font-weight:600;cursor:pointer;padding:5px 4px;border-radius:7px;text-align:center}
      .dp-word:hover{background:var(--bg);color:var(--amber)}
      .dp-quiz-help{color:var(--ink-soft);font-size:13px;margin-bottom:10px;line-height:1.5}
      .dp-quiz-row{display:flex;align-items:center;gap:12px}
      .dp-quiz-score{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ink-faint)}
      .dp-quiz-opts{display:flex;gap:8px;margin-top:10px}
      .dp-target{background:var(--panel-2);border:1px solid var(--line-solid);border-left:3px solid var(--sky);
        border-radius:0 11px 11px 0;padding:13px 15px;font-size:15.5px;line-height:1.5;color:var(--ink);
        font-family:'Fraunces',serif;margin-bottom:12px}
      .dp-rec-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
      .dp-rec-row .recording{background:var(--coral)!important;border-color:var(--coral)!important;color:#1a140c!important}
      .dp-score{margin-top:14px}
      .dp-tiles{display:flex;gap:8px;flex-wrap:wrap}
      .dp-tile{background:var(--panel-2);border:1px solid var(--line-solid);border-radius:10px;
        padding:8px 12px;text-align:center;min-width:72px}
      .dp-tile .n{font-family:'Fraunces',serif;font-size:22px;font-weight:600;color:var(--sky)}
      .dp-tile .k{font-size:10.5px;color:var(--ink-faint);font-family:'JetBrains Mono',monospace;letter-spacing:.04em}
      .dp-tips{margin:0;padding-left:20px;color:var(--ink-soft);font-size:13.5px;line-height:1.6}
      .dp-tips li{margin-bottom:6px}
      .dp-para{background:var(--panel-2);border:1px solid var(--line-solid);border-radius:11px;
        padding:14px 16px;font-size:14.5px;line-height:1.7;color:var(--ink-soft);margin-bottom:12px}
      .dp-note{color:var(--ink-faint);font-size:12px;margin-top:8px}`;
    const s = document.createElement('style');
    s.id='dpStyles'; s.textContent=css;
    document.head.appendChild(s);
  }

  /* ---------------- scoring ---------------- */
  function tileRow(scores){
    const order = [['Accuracy','accuracy'],['Fluency','fluency'],['Prosody','prosody'],
      ['Complete','completeness'],['Overall','overall']];
    const tiles = order.filter(o=>scores[o[1]]!=null)
      .map(o=>`<div class="dp-tile"><div class="n">${Math.round(scores[o[1]])}</div><div class="k">${o[0]}</div></div>`)
      .join('');
    return `<div class="dp-tiles">${tiles}</div>`;
  }

  async function scoreBlob(blob, referenceText){
    const box = el('dpScore'); if(!box) return;
    box.innerHTML = `<p class="dp-quiz-help">Measuring your pronunciation\u2026</p>`;
    let wav;
    try{ wav = await blobToWavB64(blob); }
    catch(e){ box.innerHTML = `<p class="dp-quiz-help">That clip could not be processed in this browser. Record again here.</p>`; return; }
    let res, data;
    try{
      res = await fetch(SCORE_ENDPOINT, {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ audioBase64: wav, referenceText })});
    }catch(e){
      box.innerHTML = `<p class="dp-quiz-help">Scoring runs when the app is deployed to Vercel with Azure speech configured. The recording itself worked.</p>`;
      return;
    }
    if(!res.ok){
      let msg = 'The scoring service returned an error ('+res.status+').';
      try{ const j = await res.json(); if(j && j.error) msg = j.error; }catch(e){}
      if(res.status===404) msg = 'Scoring needs the /api/score function deployed with Azure speech keys set in Vercel.';
      if(res.status===413) msg = 'That take was too long. Try one sentence at a natural pace.';
      box.innerHTML = `<p class="dp-quiz-help">${escapeHtml(msg)}</p>`;
      return;
    }
    try{ data = await res.json(); }catch(e){ data=null; }
    if(!data || !data.ok){
      const msg = (data && (data.message || data.error)) || 'No usable score came back. Try again.';
      box.innerHTML = `<p class="dp-quiz-help">${escapeHtml(msg)}</p>`;
      return;
    }
    const overall = data.overall!=null ? Math.round(data.overall) : null;
    const head = overall!=null
      ? `<div class="section-label" style="margin-bottom:9px">Your score \u00b7 ${overall}/100</div>`
      : `<div class="section-label" style="margin-bottom:9px">Your score</div>`;
    box.innerHTML = head + tileRow(data) + `<div class="dp-note">Measured against the target line by the Azure speech engine.</div>`;
  }

  /* ---------------- recording (self-contained) ---------------- */
  function pickMime(){
    const opts=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'];
    for(const o of opts){ try{ if(MediaRecorder.isTypeSupported(o)) return o; }catch(e){} }
    return '';
  }
  async function toggleRecord(){
    const btn = el('dpRec'); if(!btn) return;
    if(DP.active){ try{ DP.rec && DP.rec.stop(); }catch(e){} return; }
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ toast && toast('Recording is not supported here.'); return; }
    try{ DP.stream = await navigator.mediaDevices.getUserMedia({audio:true}); }
    catch(e){ toast && toast('Microphone access was blocked.'); return; }
    const mime = pickMime();
    try{ DP.rec = mime ? new MediaRecorder(DP.stream,{mimeType:mime}) : new MediaRecorder(DP.stream); }
    catch(e){ try{ DP.rec = new MediaRecorder(DP.stream); }catch(e2){ toast && toast('Recording not supported.'); return; } }
    DP.chunks=[]; DP.mime = DP.rec.mimeType || mime || 'audio/webm';
    DP.rec.ondataavailable = e=>{ if(e.data && e.data.size) DP.chunks.push(e.data); };
    DP.rec.onstop = ()=>{
      DP.active=false;
      btn.classList.remove('recording'); btn.textContent='\u25CF Record';
      (DP.stream ? DP.stream.getTracks() : []).forEach(t=>t.stop());
      const blob = new Blob(DP.chunks, {type:DP.mime});
      const ref = (el('dpTarget') && el('dpTarget').textContent) || '';
      scoreBlob(blob, ref);
    };
    try{ DP.rec.start(); }catch(e){ toast && toast('Could not start recording.'); return; }
    DP.active=true; btn.classList.add('recording'); btn.textContent='\u25A0 Stop';
  }

  function stopMic(){
    try{ if(DP.rec && DP.active) DP.rec.stop(); }catch(e){}
    try{ (DP.stream ? DP.stream.getTracks() : []).forEach(t=>t.stop()); }catch(e){}
    try{ window.speechSynthesis && speechSynthesis.cancel(); }catch(e){}
    DP.active=false; DP.rec=null; DP.stream=null; DP.chunks=[];
  }

  /* ---------------- quiz wiring ---------------- */
  function newQuizRound(){
    const pack = DP.pack; if(!pack.perception || !pack.perception.length) return;
    const pair = pack.perception[Math.floor(Math.random()*pack.perception.length)];
    const side = Math.random()<0.5 ? 0 : 1;
    DP.quiz.pair = pair; DP.quiz.side = side;
    const a = el('dpQuizA'), b = el('dpQuizB'), opts = el('dpQuizOpts');
    if(a&&b&&opts){ a.textContent = pair[0]; b.textContent = pair[1]; opts.style.display='flex'; }
    speak(pair[side]);
  }
  function answerQuiz(choice){
    if(DP.quiz.side==null) return;
    DP.quiz.total++;
    const correct = (choice===DP.quiz.side);
    if(correct) DP.quiz.right++;
    const sc = el('dpQuizScore');
    if(sc) sc.textContent = `${correct?'\u2713 right':'\u2717 it was \u201C'+DP.quiz.pair[DP.quiz.side]+'\u201D'}  \u00b7  ${DP.quiz.right}/${DP.quiz.total}`;
    speak(DP.quiz.pair[DP.quiz.side]);
    DP.quiz.side=null;
  }

  /* ---------------- open / close ---------------- */
  function bind(){
    // pair words
    document.querySelectorAll('#modalBox .dp-word').forEach(b=>{
      b.addEventListener('click', ()=>speak(b.dataset.say));
    });
    // quiz
    const qp = el('dpQuizPlay'); if(qp) qp.addEventListener('click', newQuizRound);
    const qa = el('dpQuizA'); if(qa) qa.addEventListener('click', ()=>answerQuiz(0));
    const qb = el('dpQuizB'); if(qb) qb.addEventListener('click', ()=>answerQuiz(1));
    // record + hear
    const rec = el('dpRec'); if(rec) rec.addEventListener('click', toggleRecord);
    const hear = el('dpHear'); if(hear) hear.addEventListener('click', ()=>{ const t=el('dpTarget'); if(t) speak(t.textContent); });
    const hp = el('dpHearPara'); if(hp) hp.addEventListener('click', ()=>{ const p=el('dpPara'); if(p) speak(p.textContent); });
    const next = el('dpNext'); if(next) next.addEventListener('click', ()=>{
      const pack = DP.pack; const list = pack.sentences || [];
      if(!list.length) return;
      DP.sIdx = (DP.sIdx+1) % list.length;
      const t = el('dpTarget'); if(t) t.textContent = list[DP.sIdx];
      const sc = el('dpScore'); if(sc) sc.innerHTML='';
    });
    // footer
    const done = el('dpDone'); if(done) done.addEventListener('click', closeDrillPack);
    const mark = el('dpMark'); if(mark) mark.addEventListener('click', ()=>{
      if(DP.weakSpotId && typeof practiceSpot==='function') practiceSpot(DP.weakSpotId);
      closeDrillPack();
    });
  }

  function openDrillPack(label, weakSpotId){
    const found = (typeof getDrillPack==='function') ? getDrillPack(label) : null;
    const box = el('modalBox'), bg = el('modalBg');
    if(!box || !bg) return;
    injectStyles();

    if(!found){
      // no structured pack: still offer a record-and-read fallback against the label
      box.style.maxWidth = '560px';
      box.innerHTML = `
        <div class="dp-head"><h3>${escapeHtml(label||'Practice')}</h3></div>
        <p class="dp-why">No guided drill for this one yet. Record yourself saying the sound in a few words and listen back critically.</p>
        <div class="modal-actions">
          ${weakSpotId?'<button class="btn primary" id="dpMark">Mark practiced</button>':''}
          <button class="btn ghost" id="dpDone">Close</button>
        </div>`;
      DP.label=label; DP.pack=null; DP.weakSpotId=weakSpotId||null;
      bind(); bg.classList.add('show');
      return;
    }

    const pack = found.pack;
    DP.label = found.label; DP.pack = pack; DP.weakSpotId = weakSpotId||null;
    DP.sIdx = 0; DP.quiz = { side:null, pair:null, right:0, total:0 };

    box.style.maxWidth = '560px';
    box.innerHTML = `
      <div class="dp-head"><h3>${escapeHtml(found.label)}</h3></div>
      ${pack.ipa?`<div class="dp-ipa">${escapeHtml(pack.ipa)}</div>`:''}
      ${pack.why?`<p class="dp-why">${escapeHtml(pack.why)}</p>`:''}
      ${pairGridHtml(pack.pairs)}
      ${quizHtml(pack)}
      ${recordHtml(pack)}
      ${paragraphHtml(pack)}
      ${tipsHtml(pack)}
      <div class="modal-actions" style="margin-top:20px">
        ${weakSpotId?'<button class="btn primary" id="dpMark">\u2713 Mark practiced</button>':''}
        <button class="btn ghost" id="dpDone">Done</button>
      </div>`;
    bind();
    bg.classList.add('show');
    // warm up the voice list
    pickVoice();
  }

  function closeDrillPack(){
    stopMic();
    if(typeof closeModal==='function') closeModal();
    else { const bg=el('modalBg'); if(bg) bg.classList.remove('show'); }
    const box=el('modalBox'); if(box) box.style.maxWidth='';
  }

  // expose
  window.openDrillPack = openDrillPack;
  window.closeDrillPack = closeDrillPack;

})();
