/* =====================================================================
   data/plan.js  —  Curriculum + static config (no logic, no deps)
   ---------------------------------------------------------------------
   Extracted verbatim from the original index.html so the 60-day plan,
   skill list, spaced-repetition config and benchmark passage live in
   one editable place. Loaded as a classic script BEFORE the main app,
   so every const below is a shared global the rest of the code reads.
   ===================================================================== */

const PHASES = [
  {id:1,name:"Foundation & The American R",range:[1,7],
   blurb:"Set a baseline and master rhoticity — the single biggest tell of an American accent."},
  {id:2,name:"The Vowel System",range:[8,14],
   blurb:"Rebuild your vowels. American English vowels sit in different places than most other accents."},
  {id:3,name:"Consonants & Connected Speech",range:[15,21],
   blurb:"Flap T, glottal T, dark L and the linking that makes speech flow."},
  {id:4,name:"Rhythm, Stress & Music",range:[22,30],
   blurb:"Stress-timing and intonation — the melody that makes you sound native, not just correct."},
  {id:5,name:"Refinement & Real-World Application",range:[31,60],
   blurb:"Move from drills to spontaneous, conversational speech under real conditions."},
];

/* helper to build an exercise */
const x=(t,d,min)=>({t,d,min});

/* The 60-day curriculum. Each day: phase, title, why, exercises[], listen */
const PLAN=[
/* ---------- PHASE 1 ---------- */
{p:1,title:"Baseline & The American Mouth",
 why:"You cannot improve what you have not measured. Today you capture your starting point.",
 ex:[
  x("Record your baseline","Read the 'Rainbow Passage' (search it — public domain) aloud at natural pace. Save the audio. This is your Day 1 fingerprint.",8),
  x("Mouth posture reset","Americans speak with a slightly relaxed jaw and the tongue held a touch further back. Say 'aaah' then settle into a neutral, loose-jaw resting position. Hold 60s.",5),
  x("Vowel sweep","Slowly glide through: heed–hid–hayed–head–had–hod–hawed–hoed–hood–who'd. Feel each mouth shape. Repeat 5x.",7),
  x("Self-assessment","Listen back to your recording. Note your 3 most obvious non-American features (often the R, the T, or flat rhythm).",5),
 ],
 listen:"Pick ONE American voice to be your model for 60 days — a podcaster, actor or YouTuber whose voice you like. Consistency of model beats variety."},

{p:1,title:"Finding the American R",
 why:"The American R is a constriction, not a tongue tap or trill. Build it once, use it everywhere.",
 ex:[
  x("The bunched R","Pull the back/sides of your tongue up toward your back teeth, tongue tip down and floating. Make a low growl: 'rrrrr'. No tip contact, no trill.",6),
  x("R sustain","Hold a clean 'rrrr' for 8 seconds, 6 times. It should feel like a vowel you can sing.",5),
  x("R + vowel glides","rrr-ah, rrr-ee, rrr-oh, rrr-oo. Keep the R constriction, then open into the vowel. 8 reps each.",8),
  x("Mirror check","Watch your mouth. Your tongue tip should NOT touch the roof or teeth. Record 'red, right, around' and verify.",6),
 ],
 listen:"Listen for the R in your model's speech. Notice it appears even where your accent might drop it."},

{p:1,title:"R at the Start of Words",
 why:"Initial R sets the tone of a word. Lock it in before stacking complexity.",
 ex:[
  x("Warm-up R sustain","30 seconds of clean bunched 'rrrr' to re-find the position.",3),
  x("Initial-R word ladder","red, run, right, road, rain, real, rich, room, rest, ready. 3 slow passes, then 2 at speed.",8),
  x("R in phrases","'a red road', 'run right round', 'really rich rooms'. Keep every R constricted.",7),
  x("Shadow & record","Shadow 2 minutes of your model. Then record yourself reading the word ladder; compare the R quality.",7),
 ],
 listen:"Count initial-R words in 1 minute of your model. Note how effortless their R sounds."},

{p:1,title:"The NURSE Vowel — Stressed ER",
 why:"Words like 'bird' and 'work' use an R-colored vowel. Mastering it removes a major accent tell.",
 ex:[
  x("Build the ER","From the bunched R, add voice and a tiny bit of mouth opening: 'errrr'. This single sound IS the vowel in 'bird'.",6),
  x("NURSE word set","bird, word, work, her, first, learn, turn, world, nurse, early. Each one is just 'ER' wrapped in consonants. 3 passes.",8),
  x("Minimal contrast","Compare a non-rhotic 'er' (cut short) vs full American ER. Exaggerate the American version 5x per word.",6),
  x("Shadow & record","Shadow 2 min of model speech, then record the NURSE set. Confirm the R-color lasts the whole vowel.",6),
 ],
 listen:"Track every 'bird/work/her'-type word in your model for 2 minutes."},

{p:1,title:"The Schwa-R — Unstressed ER",
 why:"Endings like 'water' and 'mother' use a quick, light R-colored schwa. Get this and you sound natural instantly.",
 ex:[
  x("Light ER","Same R-color as NURSE but shorter, lower energy, unstressed: the end of 'teacher'.",5),
  x("lettER word set","water, mother, better, after, never, under, doctor, dollar, sister, summer. Light, quick final ER. 3 passes.",8),
  x("Two-syllable rhythm","Say each word as STRONG-weak: 'WA-ter', not 'wa-TER'. The ER must stay unstressed but still R-colored.",6),
  x("Shadow & record","Shadow 2 min, then record the set. The final ER should be present but never heavy.",6),
 ],
 listen:"Notice how your model's word-final ER is quick and light, never dropped, never stressed."},

{p:1,title:"R After Vowels",
 why:"'car', 'hard', 'more', 'here' — post-vowel R is where non-rhotic accents most often slip.",
 ex:[
  x("Warm-up","20s R sustain + 'water/bird' to re-find both ER types.",3),
  x("R-cluster ladder","car, hard, far, more, four, here, near, fear, hair, care, fire, hour. Glide vowel INTO the R, do not drop it.",9),
  x("Sentence drill","'The car is parked far from here.' 'There are four more hours.' Hit every R.",7),
  x("Shadow & record","Shadow 3 min of model, record the sentences, compare every R.",6),
 ],
 listen:"Pick any sentence your model says with 3+ R's and replay it 5 times."},

{p:1,title:"R Consolidation + Re-record",
 why:"End of week 1. Prove your rhoticity has improved against a fresh measurement.",
 ex:[
  x("Full R review","Run through: initial R, NURSE, lettER, post-vowel R. 2 minutes total, all word sets.",8),
  x("R-loaded passage","Read aloud: 'Rural travelers rarely return early — they prefer warmer mornings near the harbor.' 5 slow, 3 fast.",7),
  x("Re-record baseline","Record the Rainbow Passage again. Compare directly with your Day 1 audio.",8),
  x("Progress note","Rate your R alone vs Day 1. Log a tracker session and rate all six skills honestly.",4),
 ],
 listen:"Listen to Day 1 and Day 7 recordings back to back. The R difference should be audible."},

/* ---------- PHASE 2 ---------- */
{p:2,title:"The Bright TRAP Vowel",
 why:"The American 'a' in 'cat' is brighter and more open than in most accents. It is highly recognizable.",
 ex:[
  x("Open the TRAP","Drop your jaw, spread slightly, raise the tongue front: a bright 'æ' as in 'cat'. Exaggerate it.",5),
  x("TRAP word set","cat, bad, man, hand, ask, last, dance, can, family, happy. Keep that bright open vowel. 3 passes.",8),
  x("The nasal lift","Before n/m the TRAP vowel lifts and tenses ('man', 'hand', 'can'). Practice this slight glide.",7),
  x("Shadow & record","Shadow 3 min, record the set, confirm the vowel is bright and forward, not dull.",7),
 ],
 listen:"Catch every 'cat/man/dance' vowel in 2 minutes of your model."},

{p:2,title:"The Merged LOT–THOUGHT Vowel",
 why:"Most General American speakers pronounce 'cot' and 'caught' identically — one open back vowel.",
 ex:[
  x("Find the vowel","An open, relaxed 'ah' with the jaw low: the vowel in 'hot' and 'dog'.",5),
  x("Merged word set","hot, dog, on, off, lost, talk, call, want, thought, coffee — all share one open 'ah'-ish vowel. 3 passes.",8),
  x("No rounding","Avoid heavy lip-rounding on 'caught/thought'. Keep it open and relaxed like 'cot'.",6),
  x("Shadow & record","Shadow 3 min, record the set, verify cot=caught for you.",7),
 ],
 listen:"Notice your model does not distinguish 'cot' and 'caught' — most Americans do not."},

{p:2,title:"Tense vs Lax — sheep / ship",
 why:"American English contrasts long-tense and short-lax vowels. Mixing them up is a clear accent marker.",
 ex:[
  x("FLEECE vs KIT","'sheep' (long, smiley, tense) vs 'ship' (short, relaxed). Exaggerate the difference 10x.",6),
  x("GOOSE vs FOOT","'pool' (long, rounded) vs 'pull' (short, relaxed). 10 contrast reps.",6),
  x("Minimal pair drill","sheep/ship, feel/fill, leave/live, pool/pull, fool/full. Say each pair 5x, partner cannot guess wrongly.",8),
  x("Shadow & record","Shadow 3 min, record the pairs, confirm clear length + quality contrast.",6),
 ],
 listen:"Listen for tense vs lax pairs in your model — the difference is length AND mouth shape."},

{p:2,title:"The Schwa — Engine of Rhythm",
 why:"The schwa is the most common sound in English. Reducing unstressed vowels to schwa is THE secret to American rhythm.",
 ex:[
  x("Pure schwa","A tiny, neutral, lazy 'uh' — zero effort. The first sound of 'about', last of 'sofa'.",5),
  x("Reduce unstressed vowels","banana → buh-NAN-uh. photograph → PHO-tuh-graf. Every unstressed vowel collapses to schwa.",8),
  x("Function-word reduction","'to, of, for, the, a, and, can' all reduce: 'I want to go' → 'I wanna go', 'cup of tea' → 'cup-uh-tea'.",8),
  x("Shadow & record","Shadow 3 min focusing only on reduced syllables. Record a paragraph and check your schwas.",6),
 ],
 listen:"This is the big one. Notice how MUCH of your model's speech is unstressed schwa."},

{p:2,title:"GOAT & FACE Glides",
 why:"American 'go' and 'day' are gliding diphthongs. Flattening them into pure vowels sounds non-native.",
 ex:[
  x("FACE glide","'day' = eh→ee glide. Slow it: 'eh-ee'. Then natural speed. Words: day, make, play, name, late.",6),
  x("GOAT glide","'go' = oh→oo glide, starting more central in American English. Words: go, no, know, home, boat, slow.",7),
  x("Glide vs flat","Say 'go' flat (non-American) then with the full glide. Exaggerate the glide 8x.",6),
  x("Shadow & record","Shadow 3 min, record the GOAT/FACE sets, confirm audible glides.",6),
 ],
 listen:"Hear the movement inside 'no' and 'day' — these are never single static vowels."},

{p:2,title:"PRICE, MOUTH & CHOICE",
 why:"Three more gliding diphthongs. Clean glides keep your speech crisp and native.",
 ex:[
  x("PRICE","'I, my, time, like, five, night' — ah→ee glide. 3 passes.",6),
  x("MOUTH","'now, how, out, down, about, house' — ah→oo glide. 3 passes.",6),
  x("CHOICE","'boy, toy, voice, point, enjoy, noise' — aw→ee glide. 3 passes.",6),
  x("Shadow & record","Shadow 3 min, record all three sets, verify each diphthong moves cleanly.",7),
 ],
 listen:"Track diphthongs in your model — they are quick but always complete."},

{p:2,title:"Vowel Consolidation + Minimal Pairs",
 why:"End of week 2. Stress-test your whole vowel system under pressure.",
 ex:[
  x("Vowel sweep review","Run the heed–hid–...–who'd sweep, plus TRAP, LOT-THOUGHT, all diphthongs. 3 minutes.",8),
  x("Minimal pair gauntlet","sheep/ship, cot/caught, bat/bet, full/fool, cap/cup. 5 reps each pair, fast.",7),
  x("Vowel-rich passage","Read the Rainbow Passage again — this time focus only on vowel quality.",7),
  x("Re-record & log","Record the passage, compare to Day 1 and Day 7. Log a tracker session.",6),
 ],
 listen:"Compare your three recordings so far. Vowels should be noticeably more American."},

/* ---------- PHASE 3 ---------- */
{p:3,title:"The Flap T",
 why:"'water' sounds like 'wadder' in American English. The flap T is everywhere and instantly American.",
 ex:[
  x("Make the flap","A T or D between vowels becomes a quick tongue tap — like a fast 'd'. Say 'water' as 'wadder'.",6),
  x("Flap-T word set","water, better, city, letter, butter, party, little, matter, pretty, daughter. 3 passes.",8),
  x("Flap across words","'get it', 'put it on', 'a lot of' → 'gerit', 'purit on', 'a lodda'. The flap crosses word boundaries.",8),
  x("Shadow & record","Shadow 3 min, record the set + phrases, confirm every medial T flaps.",6),
 ],
 listen:"Count flap-T words in 1 minute of your model — there will be many."},

{p:3,title:"The Glottal T",
 why:"In 'button' and 'mountain' the T becomes a glottal stop. Knowing when to flap vs glottalize is key.",
 ex:[
  x("Make the glottal stop","Close your throat briefly — the catch in 'uh-oh'. That replaces the T in 'button'.",5),
  x("Glottal-T word set","button, mountain, kitten, cotton, certain, important, fountain, written. T → throat catch + N.",8),
  x("Flap vs glottal sort","Sort 10 words: medial T before a vowel = flap (water); T before syllabic N = glottal (button).",8),
  x("Shadow & record","Shadow 3 min, record both sets, confirm correct choice for each word.",6),
 ],
 listen:"Notice your model never fully releases the T in 'important' or 'mountain'."},

{p:3,title:"Final T & T-Clusters",
 why:"Word-final and clustered T's behave specially in American speech — often held, glottalized, or dropped.",
 ex:[
  x("Held final T","'cat', 'right', 'what' — the T is often unreleased: tongue goes up, no puff of air.",6),
  x("T in clusters","'don't know' → 'dono', 'want to' → 'wanna', 'first time' the first T may vanish.",8),
  x("Sentence drill","'I don't want to', 'what did you get', 'right at the start'. Apply held/dropped/flapped T correctly.",8),
  x("Shadow & record","Shadow 3 min, record the sentences, check natural T behavior.",6),
 ],
 listen:"Listen for how often final T is NOT a crisp released sound in casual American speech."},

{p:3,title:"The Dark L",
 why:"American L is 'dark' (velarized) in most positions — the back of the tongue lifts. This thickens your L.",
 ex:[
  x("Make the dark L","Tip touches the ridge, but lift the BACK of the tongue too. Say 'full' — feel the back lift.",6),
  x("Dark-L word set","ball, milk, feel, cold, help, all, well, real, school, people. 3 passes.",8),
  x("Light vs dark","Initial L can be lighter ('like'); final/coda L is dark ('feel'). Contrast 6 word pairs.",7),
  x("Shadow & record","Shadow 3 min, record the dark-L set, confirm the thicker back-of-tongue quality.",6),
 ],
 listen:"Notice how 'thick' your model's L sounds in 'well', 'all', 'cold'."},

{p:3,title:"TH Sounds & Yod-Dropping",
 why:"Clean TH plus 'yod-dropping' ('Tuesday' = 'Toozday') sharpen your American profile.",
 ex:[
  x("Two TH sounds","Voiced 'this/that/the' vs voiceless 'think/thanks/three'. Tongue tip lightly between teeth.",6),
  x("TH word set","the, this, that, they, think, three, thanks, breathe, mother, with. 3 passes.",6),
  x("Yod-dropping","After t/d/n, Americans drop the 'y': Tuesday→Toozday, news→nooz, student→stoodent, duty→dooty.",8),
  x("Shadow & record","Shadow 3 min, record both sets, confirm clean TH and dropped yods.",6),
 ],
 listen:"Catch 'new', 'Tuesday', 'student' in your model — listen for the missing 'y'."},

{p:3,title:"Linking & Connected Speech",
 why:"Native speech connects words into smooth chunks. Choppy word-by-word speech sounds foreign.",
 ex:[
  x("Consonant-to-vowel linking","'an apple' → 'a-napple', 'pick it up' → 'pi-ki-tup'. Final consonant joins the next vowel.",7),
  x("Linking with R and W/Y","'I am' → 'I-yam', 'go away' → 'go-waway', 'far away' → 'fa-raway'.",7),
  x("Chunked sentences","Read 3 sentences as connected blocks, no gaps between words within a thought group.",8),
  x("Shadow & record","Shadow 3 min, record the sentences, confirm smooth linking.",6),
 ],
 listen:"Notice your model speaks in connected chunks, not separated words."},

{p:3,title:"Consonant Consolidation",
 why:"End of week 3. Integrate flap T, glottal T, dark L and linking into running speech.",
 ex:[
  x("Consonant review","Run flap-T, glottal-T, dark-L, TH and yod sets. 3 minutes.",8),
  x("Connected-speech passage","Read a paragraph applying ALL consonant rules + linking simultaneously.",8),
  x("Re-record baseline","Record the Rainbow Passage. Compare with Days 1, 7, 14.",7),
  x("Progress log","Log a tracker session, rate all six skills.",4),
 ],
 listen:"Your week 3 recording should sound markedly smoother and more connected."},

/* ---------- PHASE 4 ---------- */
{p:4,title:"Word Stress",
 why:"Every multi-syllable word has one strong syllable. Wrong stress is one of the hardest accent tells to hear in yourself.",
 ex:[
  x("Hear the stress","Tap the table on the strong syllable: 'a-MER-i-can', 'PHO-to-graph', 'pho-TOG-ra-phy'.",6),
  x("Stress-shift pairs","Note how stress moves: 'PHOtograph / phoTOGraphy / photoGRAPHic'. Practice 6 such families.",8),
  x("Noun vs verb stress","'REcord (noun) / reCORD (verb)', 'PREsent / preSENT'. Drill 6 pairs.",7),
  x("Shadow & record","Shadow 3 min, record a word list, verify correct stress placement.",6),
 ],
 listen:"When unsure of a word's stress, look it up — do not guess."},

{p:4,title:"Content vs Function Words",
 why:"Americans stress content words (nouns, verbs) and swallow function words (the, of, to). This creates the rhythm.",
 ex:[
  x("Identify the two types","In any sentence, mark CONTENT (carry meaning) vs FUNCTION (grammar glue) words.",6),
  x("Stress only content","'I went TO the STORE to BUY some BREAD' — only caps get stress, rest reduces.",8),
  x("Reduction practice","Read 3 sentences hitting only content words hard, reducing all function words to schwa.",8),
  x("Shadow & record","Shadow 3 min, record the sentences, confirm the strong-weak pattern.",6),
 ],
 listen:"Hear how your model almost throws away function words."},

{p:4,title:"Stress-Timed Rhythm",
 why:"English is stress-timed: stressed syllables fall at regular beats, and everything between gets compressed.",
 ex:[
  x("The beat","Clap a steady beat. Fit each sentence so stressed syllables land ON the claps, regardless of how many weak syllables sit between.",7),
  x("Compression drill","'CATS eat MICE' vs 'the CATS will have EATen the MICE' — both take the same time. Drill 5 such pairs.",8),
  x("Rhythmic reading","Read a paragraph to a metronome at 60 bpm, one stress per beat.",8),
  x("Shadow & record","Shadow 3 min, record the paragraph, check for even stress timing.",6),
 ],
 listen:"Feel the underlying pulse in your model's speech — it is almost musical."},

{p:4,title:"Intonation Contours",
 why:"Pitch movement carries meaning and attitude. Flat or wrongly-shaped intonation sounds non-native or robotic.",
 ex:[
  x("Statement fall","Statements glide DOWN at the end. 'I live in New York.' Exaggerate the final fall 8x.",6),
  x("Yes/no rise vs Wh-fall","'Are you coming?' rises. 'Where are you going?' falls. Drill 6 of each.",8),
  x("List intonation","'red, green, blue, and yellow' — rises on each item, falls on the last.",6),
  x("Shadow & record","Shadow 3 min copying pitch exactly, record 6 sentences, check contours.",7),
 ],
 listen:"Trace the pitch line of your model's sentences with your hand in the air."},

{p:4,title:"Thought Groups & Pausing",
 why:"Native speakers chunk speech into thought groups with deliberate pauses. This adds clarity and a natural feel.",
 ex:[
  x("Mark the chunks","Take a paragraph; mark / where a natural pause belongs. Each chunk is one idea.",6),
  x("One contour per chunk","Each thought group gets its own intonation arc — usually rising mid-sentence, falling at the end.",8),
  x("Paced reading","Read the paragraph honoring every pause. Do not rush through chunk boundaries.",8),
  x("Shadow & record","Shadow 3 min noting where the model pauses, record your paragraph.",6),
 ],
 listen:"Notice your model's pauses are purposeful, not random gasps for air."},

{p:4,title:"Contrastive & Emphatic Stress",
 why:"Americans move stress to the word that carries the key contrast. It signals meaning precisely.",
 ex:[
  x("Shift the focus","'I didn't say HE stole it' vs 'I didn't say he STOLE it' — same words, stress changes meaning. Drill 6.",8),
  x("Emphasis for emotion","Stretch and raise pitch on the emphasized word: 'That was AMAZING.'",6),
  x("Mini-dialogue","Perform a 4-line dialogue, choosing the right contrastive stress in each line.",8),
  x("Shadow & record","Shadow 3 min of expressive speech, record the dialogue.",6),
 ],
 listen:"Hear how your model spotlights one key word per sentence."},

{p:4,title:"Casual Reductions",
 why:"'gonna, wanna, gotta, kinda, lemme' — relaxed forms are not lazy, they are native. Avoiding them sounds stiff.",
 ex:[
  x("Core reductions","gonna (going to), wanna (want to), gotta (got to), kinda (kind of), lemme (let me), gimme (give me).",6),
  x("'Did you / what are you'","'whatcha doing', 'didja see', 'whaddaya want'. Drill 6 reduced question forms.",8),
  x("Reduced conversation","Read a casual dialogue using natural reductions throughout.",8),
  x("Shadow & record","Shadow 3 min of casual speech, record the dialogue, confirm relaxed forms.",6),
 ],
 listen:"Casual American speech is FULL of these — count them in 1 minute of relaxed talk."},

{p:4,title:"Integration Monologue",
 why:"Drills work in isolation. Today you fuse everything into continuous, self-generated speech.",
 ex:[
  x("Full warm-up","R sustain, vowel sweep, flap-T set, intonation glides. 5 minutes.",5),
  x("Plan a 2-minute talk","Pick a topic you know well. Outline 4 points. You will speak, not read.",6),
  x("Deliver the monologue","Record yourself speaking for 2 minutes, applying every skill consciously.",8),
  x("Self-review","Listen back. Note 2 things that improved and 2 weak spots for the next phase.",6),
 ],
 listen:"Self-generated speech is harder than reading — that gap is your real progress target."},

{p:4,title:"30-Day Milestone Assessment",
 why:"Halfway point. Measure hard, celebrate honestly, and set the focus for phase 5.",
 ex:[
  x("Full re-record","Record the Rainbow Passage AND your 2-minute monologue.",8),
  x("Day 1 vs Day 30","Listen to Day 1 and today back to back. Write down every audible improvement.",7),
  x("Score yourself","Rate all six skills 1–10. Be specific about your weakest two — they drive phase 5.",6),
  x("Log the milestone","Save a full tracker session. Take a moment — you are halfway to the goal.",4),
 ],
 listen:"This comparison is the most motivating thing you will do. Do not skip it."},

/* ---------- PHASE 5 : 31-60 ---------- */
{p:5,title:"Conversational Shadowing",
 why:"Phase 5 shifts from drills to real speech. Start by shadowing natural dialogue, not scripted reading.",
 ex:[
  x("Warm-up","3-min full warm-up: R, vowels, flap-T, intonation.",3),
  x("Close shadowing","Shadow 5 minutes of conversational content (podcast/interview), staying within 1 second of the speaker.",8),
  x("Echo shadowing","Replay 5 short lines; reproduce each from memory with identical melody.",8),
  x("Record & compare","Record one shadowed minute, compare side-by-side with the original.",6),
 ],
 listen:"Conversational speech is faster and messier than scripted — match its texture."},

{p:5,title:"Self-Talk Narration",
 why:"Narrating your own actions builds spontaneous fluency with zero translation lag.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Narrate your morning","Out loud, describe what you are doing as you do it, in American accent, for 5 minutes.",7),
  x("Describe a photo","Pick any photo; describe it in detail for 2 minutes without stopping.",7),
  x("Record & flag","Record 2 minutes of free narration, flag the 3 weakest sounds.",6),
 ],
 listen:"Notice which sounds collapse when you stop concentrating — those are your real targets."},

{p:5,title:"The Phone Voice",
 why:"Phone audio strips visual cues, so pronunciation alone must carry. Great training pressure.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Voicemail drill","Record a 45-second 'voicemail' three times, improving clarity and rhythm each take.",7),
  x("Numbers & spelling","Say phone numbers, dates and spell names aloud — clarity under American intonation.",7),
  x("Mock call","Improvise a 3-minute phone conversation, both sides, switching naturally.",7),
 ],
 listen:"Phone speech is slightly clearer and more deliberate — but still rhythmic."},

{p:5,title:"Dialogue Role-Play",
 why:"Switching between speakers trains flexible intonation and quick reset of mouth posture.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Two-voice scene","Perform a short dialogue playing BOTH characters with distinct but American delivery.",8),
  x("Reaction lines","Drill quick reactions: 'No way!', 'Are you serious?', 'That's awesome.' — full melody.",6),
  x("Record the scene","Record the full dialogue, check that each line lands naturally.",7),
 ],
 listen:"Conversational reactions carry strong, fast intonation — copy that energy."},

{p:5,title:"Question Intonation in Conversation",
 why:"Real conversation is full of questions. Their melody must be automatic, not calculated.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Question marathon","Ask 20 varied questions aloud — yes/no, wh-, tag, echo — each with correct contour.",8),
  x("Uptalk awareness","Practice mild statement-uptalk where natural, but keep most statements falling.",6),
  x("Record interview","Record yourself asking and answering 6 interview questions.",7),
 ],
 listen:"Notice the variety of question melodies in a real interview."},

{p:5,title:"Listening Discrimination Day",
 why:"You can only produce what you can hear. Sharpening perception accelerates production.",
 ex:[
  x("Minimal-pair listening","Have a tool/app play minimal pairs; identify which you heard. 20 rounds.",7),
  x("Transcribe a clip","Transcribe 60 seconds of fast speech exactly, including reductions ('wanna', 'gonna').",9),
  x("Shadow the same clip","Shadow the clip you transcribed, now that you know every word.",7),
  x("Note blind spots","Write the contrasts you struggle to HEAR — they need extra production drilling.",4),
 ],
 listen:"Perception gaps cause production gaps. Find yours today."},

{p:5,title:"Week 5 Review + Record",
 why:"Checkpoint. Confirm conversational skills are consolidating.",
 ex:[
  x("Skill review","Run a fast pass of all four phase-1-to-4 skill areas. 6 minutes.",6),
  x("Free monologue","Record a 3-minute unscripted talk on any topic.",8),
  x("Compare","Compare with your Day 30 monologue.",6),
  x("Log session","Rate all six skills, note the gap to native.",4),
 ],
 listen:"Track the trend line across your weekly recordings."},

{p:5,title:"Speed Shadowing",
 why:"Native speech is fast. Training at speed builds the muscle memory to keep up without distortion.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Fast shadowing","Shadow rapid speech (fast podcast/standup) for 6 minutes. Accuracy over completeness.",8),
  x("0.9x then 1.0x","Shadow a clip at 0.9x, then full speed. Keep all flaps and reductions intact.",7),
  x("Record fast read","Record a paragraph at brisk pace, confirm rhythm survives the speed.",7),
 ],
 listen:"At speed, only rhythm and reductions keep speech intelligible — protect them."},

{p:5,title:"Impromptu Speaking",
 why:"Spontaneous speech with no prep is the truest test of an internalized accent.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("60-second topics","Draw 5 random topics; speak 60 seconds on each with no prep.",9),
  x("No-filler challenge","Repeat one topic trying to minimize 'um' — replace with American fillers ('like', 'you know').",6),
  x("Record best take","Record your strongest 90-second impromptu, review it.",7),
 ],
 listen:"Spontaneous speech reveals your true default accent — that is what we are reshaping."},

{p:5,title:"Reductions at Speed",
 why:"Under spontaneous pressure, reductions are the first thing to disappear. Reinforce them.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Reduction sprints","Speed-read sentences loaded with gonna/wanna/gotta/whatcha. 3 fast passes.",7),
  x("Connected-speech paragraph","Read a paragraph applying every linking + reduction rule at conversational pace.",8),
  x("Record & verify","Record 2 minutes of fast speech, confirm reductions held up.",7),
 ],
 listen:"Fast native speech is mostly reductions and links — embrace it."},

{p:5,title:"Reading Aloud at Pace",
 why:"Fluent expressive reading transfers directly to confident speaking.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Cold read","Read an unfamiliar article aloud — accent, rhythm and intonation correct on the first pass.",8),
  x("Expressive re-read","Re-read the same text with full expression and emphasis.",7),
  x("Record best version","Record your most natural read, review for any robotic stretches.",7),
 ],
 listen:"Compare professional audiobook narration with your read."},

{p:5,title:"Storytelling",
 why:"Stories demand dynamic pitch, pacing and emphasis — the full expressive range of native speech.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Tell a 3-minute story","Recount a real personal story with deliberate pacing, suspense and pitch variety.",8),
  x("Punchline timing","Practice landing the key moment with a pause and pitch shift.",6),
  x("Record & review","Record the story, check that intonation carries the drama.",7),
 ],
 listen:"Notice how skilled storytellers vary pace and pitch constantly."},

{p:5,title:"Fillers & Natural Hesitation",
 why:"Native speakers hesitate in characteristic ways. The right fillers make pauses sound native, not nervous.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("American fillers","Practice 'like', 'you know', 'I mean', 'kind of', 'so' as natural connective hesitation.",6),
  x("Hesitation with rhythm","Insert fillers without breaking your sentence rhythm or dropping the accent.",7),
  x("Record casual talk","Record 2 minutes of relaxed talk using fillers naturally, not excessively.",7),
 ],
 listen:"Catch the fillers in casual American speech — they are everywhere and they sound easy."},

{p:5,title:"Week 6 Review + Record",
 why:"Checkpoint. Speed and spontaneity should be stabilizing.",
 ex:[
  x("Skill review","Fast review pass of all skill areas. 6 minutes.",6),
  x("Impromptu recording","Record a 3-minute fully spontaneous talk.",8),
  x("Compare","Compare with Day 37.",6),
  x("Log session","Rate all six skills.",4),
 ],
 listen:"Your spontaneous speech should be closing in on your read-aloud quality."},

{p:5,title:"Weak-Spot Diagnostic",
 why:"By now your two or three persistent weak spots are clear. The next days target them surgically.",
 ex:[
  x("Diagnostic recording","Record a varied 4-minute sample: reading, monologue, dialogue.",8),
  x("Pinpoint failures","List every recurring slip — specific sounds, specific contexts.",8),
  x("Rank top 3","Rank your three biggest issues. These are the focus of days 46–48.",5),
  x("Targeted word list","Build a personal 20-word drill list around your weak spots.",6),
 ],
 listen:"Be brutally specific. 'My R' is too vague — 'my R after vowels' is actionable."},

{p:5,title:"Weak-Spot Drill A",
 why:"Day one of focused remediation — attack weak spot #1 with high-rep precision.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Isolation drill","Drill weak spot #1 in isolation, then in your personal word list. 30+ reps.",9),
  x("In-context drill","Use the target sound in 10 sentences you build yourself.",8),
  x("Record & verify","Record the sentences, confirm measurable improvement on spot #1.",6),
 ],
 listen:"High repetition on one narrow target produces fast, visible gains."},

{p:5,title:"Weak-Spot Drill B",
 why:"Attack weak spot #2 with the same precision.",
 ex:[
  x("Warm-up + review A","3-min warm-up plus a quick check of yesterday's target.",4),
  x("Isolation drill","Drill weak spot #2 in isolation and in your word list. 30+ reps.",9),
  x("In-context drill","Build and read 10 sentences featuring spot #2.",8),
  x("Record & verify","Record and confirm improvement.",6),
 ],
 listen:"Keep the previous day's gain alive while building the new one."},

{p:5,title:"Weak-Spot Drill C",
 why:"Attack weak spot #3, then briefly integrate all three.",
 ex:[
  x("Warm-up + review A&B","4-min warm-up plus a check of the two prior targets.",5),
  x("Isolation drill","Drill weak spot #3 in isolation and in context. 30+ reps.",8),
  x("Triple integration","Read 6 sentences that combine all three weak spots.",7),
  x("Record & verify","Record the integration set, confirm all three improved.",6),
 ],
 listen:"Integration is where remediation becomes permanent."},

{p:5,title:"Minimal Pairs Gauntlet",
 why:"Rapid contrast drilling sharpens both perception and production of your hardest distinctions.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Personal pair set","Build minimal pairs around YOUR weak spots; drill 12 pairs, 5 reps each.",8),
  x("Speed round","Run the full set fast — listener must never mishear you.",7),
  x("Record & self-test","Record the set, play back blind, check you can tell the pairs apart.",7),
 ],
 listen:"If you can produce a clean contrast at speed, the distinction is learned."},

{p:5,title:"Tongue Twisters at Speed",
 why:"Twisters force articulator precision and stamina — accent under maximum mechanical load.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Targeted twisters","Pick twisters loaded with your weak sounds; slow first, then accelerate.",8),
  x("Accent-intact challenge","Speed up only as fast as you can keep flaps, R's and rhythm correct.",7),
  x("Record fastest clean take","Record your fastest version with the accent fully intact.",7),
 ],
 listen:"Speed without accuracy is noise — accuracy first, then pace."},

{p:5,title:"Week 7 Review + Record",
 why:"Checkpoint. Confirm your weak spots have genuinely closed.",
 ex:[
  x("Skill review","Fast review of all skill areas. 6 minutes.",6),
  x("Weak-spot re-test","Re-record the Day 45 diagnostic sample.",8),
  x("Compare","Compare with Day 45 — the weak spots should be measurably better.",6),
  x("Log session","Rate all six skills.",4),
 ],
 listen:"Your three weak spots should no longer be the first thing you hear."},

{p:5,title:"Emotional Range",
 why:"Native speech changes shape with emotion. A one-tone accent, however accurate, still sounds non-native.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Same line, six emotions","Say one sentence as excited, bored, angry, sad, surprised, sarcastic.",7),
  x("Emotional monologue","Deliver a 2-minute monologue with a genuine emotional arc.",8),
  x("Record & review","Record it; confirm the accent holds across all emotions.",7),
 ],
 listen:"Notice how pitch range widens with emotion in native speech."},

{p:5,title:"Register Shifting",
 why:"Americans shift between formal and casual registers fluidly. Command of both signals true fluency.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Formal version","Deliver a topic in formal register — fuller forms, measured pace.",7),
  x("Casual version","Deliver the SAME topic casually — heavy reductions, relaxed rhythm, fillers.",7),
  x("Record both","Record both versions, confirm each sounds natively appropriate.",8),
 ],
 listen:"Hear how the same person sounds different in an interview vs with friends."},

{p:5,title:"Presentation Voice",
 why:"Public-facing speech needs projection and clarity while keeping a natural accent.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Deliver a 3-min talk","Present a prepared topic with projection, clear structure and confident pacing.",8),
  x("Emphasis mapping","Mark and hit the key emphasized words in your talk.",6),
  x("Record & review","Record the presentation, check clarity plus natural rhythm.",7),
 ],
 listen:"Study a strong public speaker — clear, projected, still conversational."},

{p:5,title:"Accent Under Pressure",
 why:"The final test: keeping your accent while your attention is split. This is real-world readiness.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Speak while distracted","Speak on a topic while doing a simple task (walking, tidying). Keep the accent.",7),
  x("Quick-fire Q&A","Have someone fire rapid questions; answer instantly in accent.",8),
  x("Record pressure test","Record a pressured speaking sample, review for accent slippage.",7),
 ],
 listen:"Slippage under pressure shows what is automatic vs still effortful."},

{p:5,title:"Long-Form Shadowing",
 why:"Sustained shadowing builds the endurance to hold the accent across long, real conversations.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("12-minute shadow","Shadow a continuous 12-minute clip without breaks. Hold quality to the end.",13),
  x("Stamina check","Note where fatigue degrades the accent; that marks your endurance ceiling.",4),
  x("Record final 2 minutes","Record the last 2 minutes of shadowing — confirm quality held.",5),
 ],
 listen:"Endurance matters: real conversations are not 2 minutes long."},

{p:5,title:"Mock Conversation Marathon",
 why:"A long unscripted conversation is the closest thing to the real world. Today you simulate it end to end.",
 ex:[
  x("Warm-up","3-min warm-up.",3),
  x("Two-sided conversation","Improvise a 6-minute conversation playing both speakers — questions, answers, reactions, all in accent.",8),
  x("Topic switching","Mid-conversation, switch topics three times without dropping rhythm or accent.",7),
  x("Record & audit","Record the full conversation, then audit it for any sound that consistently slips.",7),
 ],
 listen:"Real conversation mixes every skill at once — this is the integration test."},

{p:5,title:"Week 8 Review + Record",
 why:"Final checkpoint before assessment. Confirm advanced prosody is in place.",
 ex:[
  x("Skill review","Fast review of all skill areas. 6 minutes.",6),
  x("Expressive monologue","Record a 4-minute expressive, register-aware monologue.",9),
  x("Compare","Compare with every prior weekly recording.",6),
  x("Log session","Rate all six skills.",4),
 ],
 listen:"You should now sound dynamic and natural, not just accurate."},

{p:5,title:"Final Assessment Recording",
 why:"Capture the definitive 'after' sample to set beside Day 1.",
 ex:[
  x("Full warm-up","5-min complete warm-up across all skills.",5),
  x("Re-record the passage","Record the Rainbow Passage one final time.",6),
  x("Final monologue","Record a 4-minute monologue covering reading, narration and emotion.",9),
  x("Mock conversation","Record a 5-minute improvised conversation, both sides.",8),
 ],
 listen:"This is your graduation tape. Give it your best."},

{p:5,title:"Compare, Celebrate & Maintain",
 why:"Measure the full transformation and build the routine that keeps the accent for life.",
 ex:[
  x("Day 1 vs Day 60","Listen to your first and final recordings back to back. Write down every change.",8),
  x("Final scorecard","Rate all six skills. Compare against Day 1 and Day 30.",6),
  x("Build a maintenance plan","Design a 15-minute, 3x-per-week upkeep routine: shadowing + weak-spot drill + recording.",7),
  x("Celebrate","You completed a 60-day transformation. Acknowledge the work — then keep speaking.",4),
 ],
 listen:"Accent is a skill, not a switch. Maintenance keeps it sharp."},
];

const SKILLS=[
  {k:'r',label:'The R Sound',color:'#e9a23b'},
  {k:'vowels',label:'Vowels',color:'#e0734a'},
  {k:'t',label:'T & Consonants',color:'#8fae6e'},
  {k:'rhythm',label:'Rhythm & Stress',color:'#7fa8c4'},
  {k:'intonation',label:'Intonation',color:'#c98bb9'},
  {k:'fluency',label:'Fluency & Flow',color:'#d9b86a'},
];

/* ---------------- spaced-repetition config ---------------- */
const SR_INTERVALS=[1,3,7,14]; // days until next review after each practice
const COMMON_SPOTS=["The R sound (general)","R after vowels","NURSE / ER vowel","TRAP vowel /ae/",
  "LOT-THOUGHT vowel","Tense vs lax vowels","Flap T","Glottal T","Final / dropped T","Dark L",
  "Schwa & vowel reduction","Word stress","Sentence rhythm","Intonation contours",
  "Linking & connected speech","Diphthong glides","TH sounds","Yod-dropping","Casual reductions"];
const BENCH_DAYS=[1,7,14,21,30,37,44,51,57,59];

/* Public-domain reference text used on benchmark days so the model can compare. */
const RAINBOW="When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow. The rainbow is a division of white light into many beautiful colors. These take the shape of a long round arch, with its path high above, and its two ends apparently beyond the horizon.";


/* expose as globals (classic scripts already share scope, but this makes
   the contract explicit and survives any future module wrapping) */
Object.assign(window, { PHASES, PLAN, SKILLS, SR_INTERVALS, COMMON_SPOTS, BENCH_DAYS, RAINBOW });
