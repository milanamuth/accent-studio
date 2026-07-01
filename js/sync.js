/* =====================================================================
   js/sync.js  —  Storage (IndexedDB) + state + Supabase cloud sync
   ---------------------------------------------------------------------
   Extracted from index.html and PATCHED to fix the cross-device data
   loss bug described in the handover. Three behaviour changes vs the
   original:

     1. loadState() no longer stamps a fresh startDate + saveState() on
        boot. Creating "today" state with a NOW timestamp before the
        cloud pull was what let an empty new device overwrite real
        cloud data under last-write-wins. startDate is now set after
        reconciliation (ensureStarted), and the auto-push is gone.

     2. Auth-driven pulls are gated behind _bootDone. Boot itself does
        the first cloud reconcile (bootSync) so the pull cannot race
        the initial local load.

     3. cloudPull MERGES instead of overwriting. mergeState() unions
        recordings / weakSpots / logs / earned by id and keeps the
        earliest real startDate, so two devices converge instead of
        clobbering each other. Sync failures now surface in a toast.

   Load order: this file loads AFTER data/plan.js (it needs no plan
   data) and BEFORE the main inline script, which calls loadState,
   saveState, queueSave, audio*, cloudPull, signInEmail, signOutCloud,
   cloudUser and bootSync as globals.
   ===================================================================== */

/* ---------------- Supabase client + DB constants ---------------- */
const SB_URL  = 'https://uevoftnxdbrtmsgmfvbp.supabase.co';
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVldm9mdG54ZGJydG1zZ21mdmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDQ0NjIsImV4cCI6MjA5NjU4MDQ2Mn0.P6JX8AMstBd1QEAFlCj4nKVQcua0SDh4jfAeaipR52k';
const sb = window.supabase.createClient(SB_URL, SB_ANON);
const _deviceId = (crypto.randomUUID && crypto.randomUUID()) || ('d'+Date.now());
const DB_NAME='accentStudioDB', DB_VER=1, STATE_KEY='state';
let _db=null, _mem={}, _idbOk=true;
let _bootDone=false;   // gates auth-event pulls until first boot reconcile

function idbOpen(){
  return new Promise((res,rej)=>{
    let req;
    try{ req=indexedDB.open(DB_NAME,DB_VER); }catch(e){ return rej(e); }
    req.onupgradeneeded=()=>{ const db=req.result;
      if(!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
      if(!db.objectStoreNames.contains('audio')) db.createObjectStore('audio');
    };
    req.onsuccess=()=>res(req.result);
    req.onerror=()=>rej(req.error);
  });
}
async function idbReady(){
  if(_db) return _db;
  if(!_idbOk) return null;
  try{ _db=await idbOpen(); }catch(e){ _idbOk=false; _db=null; }
  return _db;
}
function idbDo(store,mode,fn){
  return new Promise(async (res,rej)=>{
    const db=await idbReady();
    if(!db) return rej(new Error('no-idb'));
    let out;
    const tx=db.transaction(store,mode); const st=tx.objectStore(store);
    const r=fn(st); if(r) r.onsuccess=()=>{ out=r.result; };
    tx.oncomplete=()=>res(out); tx.onerror=()=>rej(tx.error);
  });
}
async function kvGet(k){ try{ return await idbDo('kv','readonly',st=>st.get(k)); }catch(e){ return _mem[k]; } }
async function kvSet(k,v){ try{ await idbDo('kv','readwrite',st=>st.put(v,k)); }catch(e){ _mem[k]=v; } }
async function kvClear(){ try{ await idbDo('kv','readwrite',st=>st.clear()); }catch(e){} }
async function audioPut(id,blob){ try{ await idbDo('audio','readwrite',st=>st.put(blob,id)); }catch(e){ _mem['a:'+id]=blob; } }
async function audioGet(id){ try{ const b=await idbDo('audio','readonly',st=>st.get(id)); return b||_mem['a:'+id]; }catch(e){ return _mem['a:'+id]; } }
async function audioDel(id){ try{ await idbDo('audio','readwrite',st=>st.delete(id)); }catch(e){} delete _mem['a:'+id]; }
async function audioClear(){ try{ await idbDo('audio','readwrite',st=>st.clear()); }catch(e){} _mem={}; }

/* ---------------- in-memory state ---------------- */
let STATE={ startDate:null, completed:{}, logs:[], viewDay:1, recordings:[], weakSpots:[],
  baseline:null, earned:[], targetScore:85 };

function _normalizeState(){
  if(!Array.isArray(STATE.recordings)) STATE.recordings=[];
  if(!Array.isArray(STATE.weakSpots)) STATE.weakSpots=[];
  if(!Array.isArray(STATE.logs)) STATE.logs=[];
  if(!Array.isArray(STATE.earned)) STATE.earned=[];
  if(!STATE.completed) STATE.completed={};
  if(typeof STATE.targetScore!=='number') STATE.targetScore=85;
}

/* PATCH: load local state ONLY. Do not invent a startDate and do not
   push. Reconciliation + startDate creation happen in bootSync. */
async function loadState(){
  try{ const s=await kvGet(STATE_KEY); if(s&&typeof s==='object') STATE=Object.assign(STATE,s); }catch(e){}
  _normalizeState();
}

/* Set the program start date once, after cloud reconcile, and persist. */
async function ensureStarted(){
  if(!STATE.startDate){ STATE.startDate=todayStr(); await saveState(); }
}

let saveTimer=null;
let _suppressPush=false;
async function saveState(){
  STATE.updatedAt = Date.now();
  try{ await kvSet(STATE_KEY,STATE); }catch(e){ console.error('save failed',e); }
  cloudQueuePush();
}
function queueSave(){ clearTimeout(saveTimer); saveTimer=setTimeout(saveState,400); }

/* ---------------- cloud sync ---------------- */
let _cloudTimer=null;
function cloudQueuePush(){
  if(_suppressPush) return;
  clearTimeout(_cloudTimer);
  _cloudTimer=setTimeout(cloudPush, 800);
}
async function cloudUser(){ try{ return (await sb.auth.getUser()).data.user; }catch(e){ return null; } }

async function cloudPush(){
  const u=await cloudUser(); if(!u) return;
  try{
    const { error } = await sb.from('app_state').upsert({
      user_id:u.id, state:STATE,
      updated_at:STATE.updatedAt||Date.now(), device:_deviceId
    });
    if(error){ console.warn('cloud push failed', error); toast && toast('Sync paused: could not save to the cloud.'); }
  }catch(e){ console.warn('cloud push failed', e); toast && toast('Sync paused: could not reach the cloud.'); }
}

/* union an array of objects by a key, newest entry wins on collision */
function _unionBy(a, b, keyFn, tsFn){
  a=Array.isArray(a)?a:[]; b=Array.isArray(b)?b:[];
  const map=new Map();
  const add=(arr)=>arr.forEach(item=>{
    const k=keyFn(item);
    const prev=map.get(k);
    if(!prev){ map.set(k,item); return; }
    if((tsFn(item)||0) >= (tsFn(prev)||0)) map.set(k,item);
  });
  add(a); add(b);
  return Array.from(map.values());
}

/* PATCH: merge local + cloud rather than overwrite. */
function mergeState(local, cloud){
  local=local||{}; cloud=cloud||{};
  const out=Object.assign({}, local, cloud);

  out.recordings=_unionBy(local.recordings, cloud.recordings,
    r=>r.id||('r:'+r.ts), r=>r.ts||0);
  out.weakSpots=_unionBy(local.weakSpots, cloud.weakSpots,
    w=>w.id||('w:'+w.label+w.created), w=>{
      const h=w.history&&w.history.length?w.history[w.history.length-1]:'';
      return (w.reps||0)*1e12 + (Date.parse(h)||0);   // more reps / later practice wins
    });
  out.logs=_unionBy(local.logs, cloud.logs,
    l=>l.id||('l:'+(l.ts||l.date||JSON.stringify(l))), l=>l.ts||Date.parse(l.date)||0);

  // earned achievements: simple set union of ids/strings
  const earnedSet=new Set([...(local.earned||[]), ...(cloud.earned||[])]);
  out.earned=Array.from(earnedSet);

  // completed days: merge maps, a completion in either side counts
  out.completed=Object.assign({}, local.completed||{}, cloud.completed||{});

  // scalars: newest updatedAt wins, except startDate = earliest real date
  const newer=(cloud.updatedAt||0)>=(local.updatedAt||0)?cloud:local;
  const older=newer===cloud?local:cloud;
  ['viewDay','baseline','targetScore'].forEach(k=>{
    out[k]=(newer[k]!=null?newer[k]:older[k]);
  });
  const sdA=local.startDate, sdB=cloud.startDate;
  if(sdA&&sdB) out.startDate=(sdA<sdB?sdA:sdB);
  else out.startDate=sdA||sdB||null;

  out.updatedAt=Math.max(local.updatedAt||0, cloud.updatedAt||0);
  return out;
}

/* PATCH: pull = merge both ways so devices converge. */
async function cloudPull(){
  const u=await cloudUser(); if(!u) return;
  let data, error;
  try{
    ({ data, error } = await sb.from('app_state')
      .select('state,updated_at').eq('user_id',u.id).maybeSingle());
  }catch(e){ error=e; }
  if(error){ console.warn('cloud pull failed', error); toast && toast('Sync paused: could not read from the cloud.'); return; }

  if(!data){ await cloudPush(); return; }        // first device seeds the cloud

  const cloudState=data.state||{};
  const before=JSON.stringify(STATE);
  const merged=mergeState(STATE, cloudState);

  _suppressPush=true;
  STATE=merged;
  _normalizeState();
  try{ await kvSet(STATE_KEY, STATE); }catch(e){}  // local write, no timestamp bump beyond merge
  _suppressPush=false;

  // push the merged result up so the other device's cloud row converges too
  await cloudPush();

  if(JSON.stringify(STATE)!==before){
    (typeof render==='function') && render();
    toast && toast('Synced across your devices.');
  }
}

async function signInEmail(email){
  const { error } = await sb.auth.signInWithOtp({
    email, options:{ emailRedirectTo: location.origin }
  });
  return error;
}

/* PATCH (multi-account hygiene): wipe local data on sign-out so the next
   account that signs in on this device does not inherit it. */
async function signOutCloud(){
  try{ await sb.auth.signOut(); }catch(e){}
  await kvClear(); await audioClear();
  STATE={ startDate:null, completed:{}, logs:[], viewDay:1, recordings:[], weakSpots:[],
    baseline:null, earned:[], targetScore:85 };
  await ensureStarted();
  (typeof renderSyncUI==='function') && renderSyncUI();
  (typeof render==='function') && render();
  toast && toast('Signed out. This device is now empty.');
}

sb.auth.onAuthStateChange((_evt, session)=>{
  if(session && _bootDone) cloudPull();   // boot handles the first reconcile itself
  (typeof renderSyncUI==='function') && renderSyncUI();
});

/* ---------------- BOOT reconcile (cloud-first, then start) ---------------- */
async function bootSync(){
  try{ navigator.storage && navigator.storage.persist && navigator.storage.persist(); }catch(e){}
  await loadState();
  const u=await cloudUser();
  if(u) await cloudPull();   // merge cloud into freshly loaded local before first paint
  await ensureStarted();
  _bootDone=true;
}

// Expose functions explicitly. STATE and sb are intentionally NOT copied
// here: STATE is a reassigned `let`, so a window snapshot would go stale.
// All sibling classic scripts read STATE / sb as shared bare globals.
Object.assign(window, {
  loadState, saveState, queueSave, ensureStarted, bootSync,
  audioPut, audioGet, audioDel, audioClear,
  cloudUser, cloudPull, cloudPush, signInEmail, signOutCloud, mergeState
});
