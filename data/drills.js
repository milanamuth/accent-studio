/* =====================================================================
   data/drills.js  —  Drill content for every weak spot
   ---------------------------------------------------------------------
   DRILL_PACKS is keyed by the EXACT label strings in COMMON_SPOTS
   (see data/plan.js). Each pack is pure data, no logic, so this file
   has zero dependencies and can load before everything else.

   Pack shape:
     skill       one of the SKILLS keys: r | vowels | t | rhythm | intonation | fluency
     ipa         short IPA hint shown in the header
     why         one line on why it matters for the India to US transition
     pairs       minimal pairs [[a,b], ...]  (may be [] for prosody packs)
     sentences   8 to 10 target loaded practice sentences
     paragraph   one short passage saturated with the target
     tips        2 to 4 articulation cues
     perception  listening discrimination pairs, a true minimal contrast subset (may be [])
     speak       'a' (default) or 'b' — which token of a pair the TTS should voice.
                 'b' is used for reduction packs where token B is the natural spoken form.
     aliases     lowercase keywords used to fuzzy match custom weak spot labels

   getDrillPack(label) resolves a weak spot label (exact or custom) to a pack.
   ===================================================================== */

const DRILL_PACKS = {

  "The R sound (general)": {
    skill: "r", ipa: "/\u0279/",
    why: "The American R is the single biggest tell. It is bunched and lip rounded, never tapped or trilled.",
    pairs: [["red","led"],["right","light"],["road","load"],["rate","late"],["rock","lock"],
      ["rip","lip"],["grass","glass"],["correct","collect"],["pray","play"],["fry","fly"],
      ["berry","belly"],["arrive","alive"],["red","wed"],["right","white"],["rake","wake"],["ring","wing"]],
    sentences: [
      "The red car raced around the track.",
      "Rural roads are rarely repaired right away.",
      "Her brother wrote a remarkable report.",
      "Roaring rivers run from the rugged mountains.",
      "Robert really preferred fresh strawberries.",
      "Three grey rabbits ran across the road.",
      "Practice your R every morning in the mirror.",
      "Drivers turned right at the railroad crossing.",
      "The librarian arranged the rare books.",
      "Bright orange flowers grew in the garden."],
    paragraph: "Around the corner, a row of red brick houses ran the length of Riverside Road. Every morning, Rachel rode her bright orange bike to her brother's repair shop, where rows of rare records were arranged by year. The work rewarded her: real progress, recording after recording.",
    tips: [
      "Curl or bunch the tongue so the tip points up and back without touching the roof of the mouth.",
      "Round your lips slightly, like the start of a w.",
      "Keep the tongue tip floating, no tap and no trill.",
      "Hold the R longer than feels natural at first: rrrred, rrrroad."],
    perception: [["red","led"],["right","light"],["road","load"],["rake","wake"],["ring","wing"],["grass","glass"]],
    aliases: ["r sound","the r","initial r","american r","r general"]
  },

  "R after vowels": {
    skill: "r", ipa: "/\u025a, \u0251r, \u0254r/",
    why: "American English is rhotic. The R at the end of car, hard and more must be pronounced, not dropped.",
    pairs: [["card","cod"],["heart","hot"],["born","bon"],["bird","bud"],["more","mow"],
      ["store","stow"],["four","foe"],["hair","hay"],["care","Kay"],["fear","fee"],
      ["here","he"],["poor","Poe"],["far","fa"],["fort","fought"],["court","caught"],["sure","shoe"]],
    sentences: [
      "Park the dark car far from the yard.",
      "The farmer's daughter works hard all year.",
      "Mark ordered shorter shorts for the summer.",
      "Her heart hurt after the hard workout.",
      "More corn is stored in the northern barn.",
      "The nurse heard the bird chirp near the curb.",
      "Four sharp forks were on the corner counter.",
      "Carla wore a warm scarf in the harsh storm.",
      "The reporter covered the fire at the harbor.",
      "Are you sure the tour starts here at four?"],
    paragraph: "The harbor was darker than Mark remembered. Cars were parked in a row near the corner store, and the cold air carried the sharp smell of tar and saltwater. He pulled his scarf tighter, turned toward the pier, and started the long, hard walk, hoping for warmer weather before nightfall.",
    tips: [
      "Do not drop the R at the end of words: car is not cah.",
      "Let the R color the whole vowel, the tongue pulls back during the vowel, not just after it.",
      "For er, ir and ur (bird, her, fur) hold one steady r colored vowel.",
      "Link a final R into a following vowel: far away becomes fa r away."],
    perception: [["card","cod"],["heart","hot"],["born","bon"],["bird","bud"],["more","mow"],["here","he"]],
    aliases: ["post vocalic r","rhotic","r after vowel","r coloring","r colouring","ending r","final r"]
  },

  "NURSE / ER vowel": {
    skill: "vowels", ipa: "/\u025d/",
    why: "The NURSE vowel is one steady r colored sound. Spelling changes across her, sir, fur and word, the sound does not.",
    pairs: [["heard","hard"],["bird","bard"],["burn","barn"],["fur","far"],["stir","star"],
      ["hurt","heart"],["word","ward"],["shirt","short"],["turn","torn"],["curt","cart"],
      ["her","hair"],["were","wear"],["firm","farm"],["girl","gull"]],
    sentences: [
      "The early bird heard the first words.",
      "Her thirty third birthday is on Thursday.",
      "The nurse turned and searched the dark church.",
      "Curtis preferred to work in person.",
      "A purple bird perched on the curved fern.",
      "The German learner certainly worked hard.",
      "Were the words worth learning by heart?",
      "She earns her living serving curry.",
      "Pearl wore a fur shirt to the concert.",
      "First, stir the herbs, then serve it warm."],
    paragraph: "Thursday was the worst day to learn anything, but Pearl persevered. She heard the early birds, turned off her alarm, and worked on the same thirty words she kept slurring. Her teacher's one rule: hold the er steady, word, heard, serve, no glide and no break. Word by word, it got better.",
    tips: [
      "Hold one steady r colored sound, do not glide into a separate vowel plus R.",
      "Tongue bunched in the centre, lips relaxed and slightly spread.",
      "Same vowel in her, sir, fur and word: spelling changes, sound does not.",
      "The unstressed version (butter, doctor) is shorter but the same colour."],
    perception: [["heard","hard"],["bird","bard"],["burn","barn"],["hurt","heart"],["shirt","short"],["turn","torn"]],
    aliases: ["nurse vowel","er vowel"," ir vowel","ur vowel","schwar","stressed schwa"]
  },

  "TRAP vowel /ae/": {
    skill: "vowels", ipa: "/\u00e6/",
    why: "The TRAP vowel is wide, front and long in American English. Letting it collapse into uh or ah blurs cat, cut and cot.",
    pairs: [["bad","bed"],["man","men"],["pan","pen"],["had","head"],["bag","beg"],
      ["sat","set"],["cat","cut"],["bad","bud"],["ran","run"],["cap","cup"],
      ["match","much"],["cat","cot"],["hat","hot"],["sack","sock"],["lack","lock"],["ankle","uncle"]],
    sentences: [
      "The cat sat on a flat black mat.",
      "Dad packed ham and jam in a bag.",
      "That man can plan the annual gala.",
      "Pat had a bad headache after the match.",
      "Sam grabbed a cab back to the campus.",
      "The angry cat scratched the fabric chair.",
      "Hand me that map of the national park.",
      "Fran laughed and clapped at the band.",
      "Adam ran past the tall grass at last.",
      "A happy hamster sat in a plastic tank."],
    paragraph: "Saturday at the animal sanctuary, Sam managed the cat pavilion. A black and tan tabby named Max sat on the mat, batting at a tangle of yarn. Sam grabbed his camera, snapped a candid shot, and added it to the gallery. Visitors clapped, the cat had a knack for landing the perfect pose.",
    tips: [
      "Open the jaw wider than for bed and spread the lips.",
      "It is a front vowel, keep the tongue forward and low.",
      "Do not let it collapse into uh (bad is not bud) or ah (cat is not cot).",
      "In American English it is longer and slightly raised: maaan, baaad."],
    perception: [["bad","bed"],["man","men"],["cat","cut"],["cat","cot"],["ran","run"],["hat","hot"]],
    aliases: ["trap vowel","ae vowel","short a","cat vowel","ash vowel"]
  },

  "LOT-THOUGHT vowel": {
    skill: "vowels", ipa: "/\u0251 ~ \u0254/",
    why: "LOT words use an open ah and rounding LOT into oh turns cot into coat and not into note.",
    pairs: [["cot","cut"],["lock","luck"],["shot","shut"],["hot","hut"],["dock","duck"],
      ["rob","rub"],["cot","coat"],["got","goat"],["not","note"],["rod","road"],
      ["hop","hope"],["cost","coast"],["cot","caught"],["stock","stalk"],["don","dawn"],["boss","bus"]],
    sentences: [
      "Tom got a lot of hot coffee.",
      "The boss locked the office across the lot.",
      "Bob dropped the box on the rocks.",
      "Dawn bought a small box of chalk.",
      "The dog ran off after a soggy log.",
      "Otto solved the problem on the spot.",
      "Don jogged along the foggy dock at dawn.",
      "Stop the clock, the concert starts at four.",
      "The honest cop watched the odd shop.",
      "Polly wants a soft cloth, not a long one."],
    paragraph: "Across the parking lot, Tom spotted a small coffee shop. He stopped, got a hot espresso, and sat by the wall to watch the morning crowd. A stray dog trotted past a row of potted plants. It was an odd, calm sort of morning, not a lot going on, and honestly, that was the draw.",
    tips: [
      "For LOT (hot, stop) drop the jaw and keep the lips unrounded, close to ah.",
      "For THOUGHT (caught, dawn) round the lips a little and raise the back slightly.",
      "Do not round LOT into oh: cot is not coat, not is not note.",
      "Many Americans merge cot and caught, pick one and stay consistent."],
    perception: [["cot","cut"],["cot","coat"],["not","note"],["cot","caught"],["don","dawn"],["hop","hope"]],
    aliases: ["lot vowel","thought vowel","short o","cot caught","open o"]
  },

  "Tense vs lax vowels": {
    skill: "vowels", ipa: "/i \u026a/, /u \u028a/",
    why: "Tense vowels are longer and higher, lax vowels are shorter and more central. Sheep and ship are different words.",
    pairs: [["sheep","ship"],["heat","hit"],["feel","fill"],["leave","live"],["seat","sit"],
      ["beat","bit"],["reach","rich"],["green","grin"],["peak","pick"],["pool","pull"],
      ["fool","full"],["Luke","look"],["suit","soot"],["late","let"],["wait","wet"],["taste","test"]],
    sentences: [
      "These three sheep will sleep on the ship.",
      "Please fill each green bin to the brim.",
      "He will live to leave the city next week.",
      "Pull the full pool cover over the pit.",
      "Did you eat the sweet treat she picked?",
      "Pete will sit in the seat near the screen.",
      "The team needs a quick win this evening.",
      "Do not slip, the steep steps are still wet.",
      "Keep the cheap chips in this big dish.",
      "Luke took a good look at the new book."],
    paragraph: "Each evening, Pete and his team would meet on the ship's deck. The sea breeze felt cool, and the steep steps were a bit slick, so they would sit and sip tea while the green hills slipped past. It was a simple routine, but it filled the week with small, steady wins.",
    tips: [
      "Tense vowels (sheep, pool, late) are longer and the tongue reaches higher.",
      "Lax vowels (ship, pull, let) are shorter and the tongue relaxes lower and more central.",
      "Do not just shorten the tense vowel, change the tongue position too.",
      "Smile slightly for the sheep vowel, relax the lips for the ship vowel."],
    perception: [["sheep","ship"],["feel","fill"],["pool","pull"],["Luke","look"],["late","let"],["wait","wet"]],
    aliases: ["tense lax","long short vowel","sheep ship","ee vs ih","vowel length"]
  },

  "Flap T": {
    skill: "t", ipa: "/\u027e/",
    why: "Between vowels the American T becomes a fast D like tap. Water sounds like wader and city like ciddy.",
    pairs: [["latter","ladder"],["writer","rider"],["metal","medal"],["atom","Adam"],["bitter","bidder"],
      ["seating","seeding"],["petal","pedal"],["coating","coding"],["liter","leader"],["waiting","wading"],
      ["hearty","hardy"],["matter","madder"],["betting","bedding"],["putting","pudding"],["batting","badding"]],
    sentences: [
      "Betty bought a little bottle of water.",
      "The writer sat in the city, getting better.",
      "Pretty soon the water in the kettle got hotter.",
      "Put the butter and batter on the counter.",
      "Peter ate a plate of potatoes at noon.",
      "It matters that the meeting started later.",
      "The waiter brought a latte and a bottle.",
      "Katie's daughter is meeting her at the party.",
      "Forty letters were waiting in the data folder.",
      "A bit of patience, and it will all sort out."],
    paragraph: "Better late than never, Katie thought, settling into a little cafe in the city center. She ordered water and a latte, set her laptop on the counter, and started editing. The writing was getting better, sentence after sentence, the letters fitting together. Outside, the afternoon traffic chattered on.",
    tips: [
      "Between two vowels before an unstressed vowel, T turns into a quick tongue tap, almost a D: water becomes wader.",
      "The tap is fast and light, the tongue just brushes the ridge behind the teeth.",
      "It also happens across words: get it becomes geddit, put a becomes puda.",
      "A real T stays in stressed starts and clusters: return and stop keep a clear T."],
    perception: [["latter","ladder"],["writer","rider"],["metal","medal"],["atom","Adam"],["petal","pedal"],["seating","seeding"]],
    aliases: ["flap t","tap t","intervocalic t","d sound t","alveolar flap","t to d"]
  },

  "Glottal T": {
    skill: "t", ipa: "/\u0294/",
    why: "Before a syllabic n the T becomes a glottal stop. Button is buh n, mountain is moun n, with a catch in the throat.",
    pairs: [["button","mutton"],["cotton","rotten"],["kitten","mitten"],["written","bitten"],["certain","curtain"],
      ["mountain","fountain"],["Latin","satin"],["Britain","brighten"],["gotten","forgotten"],["threaten","sweeten"]],
    sentences: [
      "I have forgotten the cotton mittens again.",
      "It is certain the kitten sat on the curtain.",
      "She has written a sentence about the mountain.",
      "Press the button, the fountain is broken.",
      "That is important, do not shorten it.",
      "Martin could not fasten the wooden gate.",
      "The kitten had bitten the cotton button.",
      "A certain captain climbed the steep mountain.",
      "Brighten up, you have gotten the hardest part.",
      "He read the Latin sentence in an instant."],
    paragraph: "Martin had forgotten how steep the mountain trail was. Halfway up, near a small fountain, he stopped to fasten his boot and catch his breath. A kitten, someone's, certainly, sat on a cotton blanket by the gate. It was important to keep going, so he straightened up and kept the rhythm: step, button, breathe.",
    tips: [
      "Before a syllabic n (button, mountain) stop the air in the throat instead of releasing the T: bu n.",
      "Hold the tongue still and cut the sound off in the glottis, then release into the n.",
      "Do not insert a vowel, it is moun n, not moun ten.",
      "The T is felt as a tiny catch, not a tapped or puffed sound."],
    perception: [["button","mutton"],["cotton","rotten"],["kitten","mitten"],["certain","curtain"],["mountain","fountain"],["written","bitten"]],
    aliases: ["glottal t","glottal stop","button t","held t","syllabic n"]
  },

  "Final / dropped T": {
    skill: "t", ipa: "/t/ (unreleased)",
    why: "A final T is usually held rather than puffed out, but it must stay present so seat does not become seed or bet become bed.",
    pairs: [["seat","seed"],["bat","bad"],["wait","wade"],["sent","send"],["bent","bend"],
      ["hat","had"],["white","wide"],["light","lied"],["cart","card"],["heart","hard"],
      ["note","node"],["great","grade"],["bet","bed"],["mate","made"],["built","build"],["set","said"]],
    sentences: [
      "Wait, do not forget the white coat.",
      "He kept the receipt in his right pocket.",
      "That is a great point about the latest project.",
      "Cut the bright light at eight o'clock.",
      "I doubt he meant to forget it.",
      "Put it on the left side of the cart.",
      "She felt the cold wind at midnight.",
      "The contract was signed and sent last night.",
      "It is not what I expect, it is what I want.",
      "Do not shout, just point at the right spot."],
    paragraph: "It was almost midnight when Scott got the last text. He set down his coat, put the receipt on the desk, and read it twice. The contract was sent, the project he had fought for all August. He let out a quiet breath, kept his reaction in check, and made a short note: start the next part Monday.",
    tips: [
      "A final T is often held, close the tongue to the ridge and stop the air, but do not puff it out.",
      "Keep the T present though: cat is not cad, seat is not seed (a final D is longer and voiced).",
      "Before a consonant, T can be just a stop: that man becomes tha(t) man.",
      "Do not drop it entirely or add a vowel after it, and is not an duh."],
    perception: [["seat","seed"],["bat","bad"],["wait","wade"],["sent","send"],["white","wide"],["bet","bed"]],
    aliases: ["final t","dropped t","ending t","unreleased t","held t","t at end"]
  },

  "Dark L": {
    skill: "t", ipa: "/\u026b/",
    why: "At the end of a syllable the L is dark, made with the back of the tongue. Replacing it with a w turns milk into miwk.",
    pairs: [["light","right"],["lock","rock"],["load","road"],["lane","rain"],["glass","grass"],
      ["play","pray"],["light","night"],["low","no"],["lap","nap"],["life","knife"],
      ["bowl","bow"],["cold","code"],["told","toad"],["gold","goad"],["feel","fear"],["pool","poor"]],
    sentences: [
      "Bill will fill the small yellow bowl.",
      "Call Phil, the cold milk is still chilled.",
      "All the girls felt well and fully filled.",
      "Build a tall wall around the field.",
      "I will pull the wool blanket off the shelf.",
      "The bell rang twelve times at the old school.",
      "Hold the gold ball, then roll it slowly.",
      "The little eagle fell and rolled downhill.",
      "Will you help Bill pull the full pail?",
      "Tell Paul the meal will be cold by twelve."],
    paragraph: "The old hotel sat on a small hill at the end of Mill Road. Phil pulled the heavy oak door, and the bell on the wall rang twice. Inside, all was still, pale yellow walls, a cold tile floor, twelve gold framed photos in a single row. He felt, oddly, fully at home, and he had only just pulled in.",
    tips: [
      "At the end of a syllable (feel, milk, cold) pull the BACK of the tongue up and back, that is the dark L.",
      "The tongue tip can still touch the ridge, but the back lift is what makes it sound American.",
      "Do not replace dark L with a w or oo, milk is not miwk.",
      "An onset L (light, leaf) is light: tip up, back relaxed. A coda L is dark."],
    perception: [["light","right"],["lock","rock"],["low","no"],["lap","nap"],["cold","code"],["gold","goad"]],
    aliases: ["dark l","velar l","coda l","l vocalization","milk l","final l"]
  },

  "Schwa & vowel reduction": {
    skill: "rhythm", ipa: "/\u0259/",
    why: "Unstressed syllables collapse to a quick uh. Giving every syllable a full clear vowel is the loudest non native tell.",
    pairs: [["photograph","photography"],["atom","atomic"],["metal","metallic"],["Canada","Canadian"],
      ["family","familiar"],["history","historic"],["define","definition"],["prefer","preference"],
      ["compete","competition"],["telegraph","telegraphy"]],
    sentences: [
      "I was about to ask for a banana.",
      "The teacher gave a lesson on the seven oceans.",
      "A photograph of the family was in the album.",
      "They traveled around the seven continents.",
      "It was a problem of balance and patience.",
      "The doctor and the actor support the program.",
      "We can support the children at the moment.",
      "Tell them about the level of the data.",
      "The pencil and the paper are on the table.",
      "Around seven, the children woke up again."],
    paragraph: "It was about seven in the morning, and the apartment was quiet. Amanda poured a cup of coffee, opened the camera, and looked at the photographs from the weekend, a banana stand, a couple of pigeons, the harbor at sunrise. None of it was perfect, but the balance of light was lovely, and that was reason enough.",
    tips: [
      "Unstressed syllables collapse to a quick lazy uh: banana becomes buh NAN uh.",
      "Function words (a, of, the, to, for, can, and) almost always reduce in connected speech.",
      "Do not give every syllable a full clear vowel, that is the biggest non native tell.",
      "Reduce hard: the contrast between strong and weak syllables is the American rhythm."],
    perception: [["photograph","photography"],["atom","atomic"],["Canada","Canadian"],["define","definition"],["prefer","preference"],["compete","competition"]],
    aliases: ["schwa","vowel reduction","reduced vowel","weak vowel","unstressed vowel"]
  },

  "Word stress": {
    skill: "rhythm", ipa: "stress",
    why: "Stress placement carries meaning. REcord and reCORD are different words, and wrong stress hurts clarity more than wrong sounds.",
    pairs: [["REcord","reCORD"],["PREsent","preSENT"],["OBject","obJECT"],["CONtract","conTRACT"],
      ["PERmit","perMIT"],["REbel","reBEL"],["CONduct","conDUCT"],["INcrease","inCREASE"],
      ["PROduce","proDUCE"],["PROtest","proTEST"],["SUSpect","susPECT"],["EXport","exPORT"]],
    sentences: [
      "Please record a record of the meeting.",
      "They present the present to the winner.",
      "I object to that object on the table.",
      "The rebels rebel against the leaders.",
      "We need to increase the annual increase.",
      "The desert is no place to desert a friend.",
      "He will conduct himself with good conduct.",
      "Farmers produce a lot of fresh produce.",
      "The permit lets you permit one guest.",
      "Did you suspect the main suspect?"],
    paragraph: "At the morning meeting, Dana had to present the quarterly presentation and record a clean record of the decisions. The team wanted to increase output, but the new contract would contract their timeline. She decided to object, politely, to one object on the agenda, and let the rest proceed.",
    tips: [
      "In two syllable noun and verb pairs, stress the first syllable for the noun (REcord) and the second for the verb (reCORD).",
      "A stressed syllable is louder, longer and higher in pitch, with a full vowel.",
      "The unstressed syllable reduces to schwa, do not give it equal weight.",
      "When unsure, learn the stress with the word, wrong stress hurts clarity more than wrong sounds."],
    perception: [["REcord","reCORD"],["PREsent","preSENT"],["OBject","obJECT"],["INcrease","inCREASE"],["PROduce","proDUCE"],["CONduct","conDUCT"]],
    aliases: ["word stress","syllable stress","lexical stress","noun verb stress","stress placement"]
  },

  "Sentence rhythm": {
    skill: "rhythm", ipa: "stress timed",
    why: "English is stress timed. Hit the content words hard and let the little words slide by so the beat stays even.",
    pairs: [["GREENhouse","green house"],["BLACKboard","black board"],["HOTdog","hot dog"],
      ["DARKroom","dark room"],["BLUEbird","blue bird"],["HIGHchair","high chair"],
      ["REDhead","red head"],["SHORTcake","short cake"]],
    sentences: [
      "I will MEET you at the STAtion at NINE.",
      "She WANTS to GO to the BEACH toDAY.",
      "We have been WAITing for an HOUR and a HALF.",
      "Can you GIVE me a CALL when you are DONE?",
      "The MOST imPORtant THING is to KEEP GOing.",
      "They were supPOSED to FInish it by FRIday.",
      "I would have CALLED you, but I LOST my PHONE.",
      "It is NOT about the MOney, it is about the TIME.",
      "He RAN to the STORE and BOUGHT some BREAD.",
      "We could TRY again toMORrow if you LIKE."],
    paragraph: "READ this at a STEAdy beat, TAPping the STRESSED words. The TRICK with English RHYthm is SIMple: HIT the imPORtant words HARD, and let the LITtle words, a, the, of, to and and, SLIDE by alMOST unHEARD. Do THAT, and even a SHORT senTENCE starts to SOUND like a NAtive SPEAker SAID it.",
    tips: [
      "Stress content words (nouns, verbs, adjectives) and reduce function words (a, the, of, to, and).",
      "Keep roughly even time between stressed beats, squeeze the weak syllables to fit.",
      "Tap the stresses with your finger while you read.",
      "It is a rhythm, not a list, do not pause between every word."],
    perception: [["GREENhouse","green house"],["BLACKboard","black board"],["HOTdog","hot dog"],["BLUEbird","blue bird"],["REDhead","red head"],["HIGHchair","high chair"]],
    aliases: ["sentence rhythm","stress timing","prosody rhythm","compound stress","rhythm flow","beat"]
  },

  "Intonation contours": {
    skill: "intonation", ipa: "pitch",
    why: "Pitch carries the melody. Statements fall, yes or no questions rise, and the right tune makes people stop hearing an accent.",
    pairs: [],
    sentences: [
      "You are coming, are you not? (rising, checking)",
      "You are coming. (falling, telling)",
      "Wow, that is amazing. (falling)",
      "Could you help me for a second? (rising)",
      "I do not know what to do. (falling)",
      "Really? You saw her there? (rising)",
      "First we eat (rising), then we leave (falling).",
      "It is not the worst idea I have heard. (falling)",
      "Are you sure about that? (rising)",
      "Let us go, it is getting late. (falling)"],
    paragraph: "Listen for the melody, not just the words. A statement falls at the end, I will see you tomorrow. A yes or no question rises, will I see you tomorrow? When you list things, each item rises until the last one falls, milk, eggs, and bread. Get the tune right and people stop hearing an accent and start hearing you.",
    tips: [
      "Statements and wh questions (what, where, why) fall at the end.",
      "Yes or no questions rise at the end.",
      "In lists, rise on each item and fall on the last.",
      "Step the pitch up on the most important word, then glide down."],
    perception: [],
    aliases: ["intonation","pitch","melody","tone","contour","rising falling","question intonation"]
  },

  "Linking & connected speech": {
    skill: "fluency", ipa: "liaison",
    why: "Native speakers glue words together. Final consonants reach into the next vowel so turn it off becomes one smooth ribbon.",
    pairs: [["turn it off","tur ni toff"],["an apple","a napple"],["pick it up","pi ki tup"],
      ["far away","fa raway"],["this evening","thi sevening"],["let it go","le ti go"],
      ["half an hour","ha fa nour"],["not at all","no ta tall"],["come on in","co mo nin"],
      ["give it a try","gi vi ta try"],["law and order","law ran order"],["go away","go waway"]],
    sentences: [
      "Turn it off and put it away.",
      "Give it a try, it is not at all hard.",
      "I will pick it up on my way over.",
      "Half an hour ago she was right here.",
      "Come on in and make yourself at home.",
      "Let it go, it is water under the bridge.",
      "We ran out of eggs an hour ago.",
      "Is it okay if I bring a friend along?",
      "He looked at it and walked away.",
      "Wait a minute, I think I left it on."],
    paragraph: "Native speakers do not say each word on its own, they glue them together. What are you doing becomes whaddaya doin. I am going to eat turns into I am gonna eat. Final consonants reach forward into the next vowel, an apple is a napple, turn it off is tur ni toff. Read it smooth, like one long ribbon of sound, and the fluency follows.",
    tips: [
      "A final consonant plus the next word's vowel link together: turn it off becomes tur ni toff.",
      "Insert a tiny w or y between vowels: go away becomes go waway, I am becomes I yam.",
      "An r at a word end links into a following vowel: far away becomes fa raway.",
      "Aim for one smooth stream per phrase, not word, word, word."],
    perception: [],
    speak: "a",
    aliases: ["linking","connected speech","liaison","blending","catenation","word linking"]
  },

  "Diphthong glides": {
    skill: "vowels", ipa: "/e\u026a a\u026a o\u028a/",
    why: "Diphthongs move from one vowel to another. Flattening them into a single short vowel turns late into let and go into gaw.",
    pairs: [["late","let"],["pain","pen"],["wait","wet"],["sale","sell"],["boat","bought"],
      ["coat","caught"],["low","law"],["so","saw"],["bowl","ball"],["phone","fawn"],
      ["know","gnaw"],["goes","gauze"],["code","cod"],["road","rod"],["note","not"],["mode","mod"]],
    sentences: [
      "Wait by the gate while I make the cake.",
      "They played a game in the rain all day.",
      "The boat floated slowly toward the coast.",
      "I know the road home goes by the coast.",
      "Mike's bright kite flew high in the sky.",
      "How about a round trip downtown now?",
      "Joan wrote a note and rode home alone.",
      "The loud crowd gathered around the fountain.",
      "Stay and play, the day is still young.",
      "Do not go slow, the show will not wait for us."],
    paragraph: "The day we drove out to the coast, the sky was a pale, bright blue. Kate played her favorite songs while Mike steered the old boat trailer down the winding road. We made it by eight, set up by the bay, and watched the slow gold light fade. No phone, no rush, just the sound of the waves rolling in.",
    tips: [
      "Diphthongs move: start in one vowel and glide to another, day is deh ee, go is goh oo.",
      "Do not flatten them into a single short vowel, late is not let.",
      "Five core glides: the day vowel, the my vowel, the boy vowel, the now vowel and the go vowel.",
      "Let the second half of the glide be lighter and shorter than the first."],
    perception: [["late","let"],["pain","pen"],["boat","bought"],["low","law"],["code","cod"],["note","not"]],
    aliases: ["diphthong","glide","gliding vowel","long vowel glide","face vowel","goat vowel"]
  },

  "TH sounds": {
    skill: "t", ipa: "/\u03b8 \u00f0/",
    why: "TH is made with the tongue at the teeth and airflow. Stopping the air turns think into tink and this into dis.",
    pairs: [["thin","tin"],["thick","tick"],["thought","taught"],["three","tree"],["bath","bat"],
      ["thing","sing"],["thick","sick"],["mouth","mouse"],["think","sink"],["thumb","sum"],
      ["they","day"],["then","den"],["though","dough"],["there","dare"],["breathe","breeze"],
      ["other","udder"],["path","pass"],["teeth","teas"]],
    sentences: [
      "Both brothers thought the path was thin.",
      "They threw three things over there.",
      "Thank them for the thick leather gloves.",
      "This is the third Thursday this month.",
      "The author thinks the theory is worth it.",
      "Breathe through your mouth, then hold it.",
      "There is nothing further to think about.",
      "The weather in the south is rather mild.",
      "My mother and father bathe the dog together.",
      "Theo's birthday is the thirteenth of the month."],
    paragraph: "Theo thought thoroughly about the theme. The thing was, both of his brothers had the same birthday, the thirteenth, and they would rather throw one big gathering than three small ones. So they gathered there, beneath the old oak, and weathered the thunder together. Nothing, they thought, was worth more than that.",
    tips: [
      "Put the tongue tip lightly between or just behind the teeth and push air through, th, not t or s.",
      "Voiceless th (think, bath) is just airflow. Voiced th (this, mother) adds voice and a buzz.",
      "Do not stop the air with the tongue, that makes t or d, let it leak out.",
      "A little tongue showing is fine, it is a soft breathy sound."],
    perception: [["thin","tin"],["think","sink"],["they","day"],["though","dough"],["path","pass"],["breathe","breeze"]],
    aliases: ["th","th sound","theta","interdental","this think","voiced th","voiceless th"]
  },

  "Yod-dropping": {
    skill: "t", ipa: "/u/ vs /ju/",
    why: "After t, d, n, s and l Americans drop the y glide. New is noo and Tuesday is toozday, but cute and few keep the y.",
    pairs: [["new","knew"],["do","due"],["do","dew"],["loot","lute"],["tune","toon"],
      ["cute","coot"],["cue","coo"],["mute","moot"]],
    sentences: [
      "On Tuesday the new student studied the news.",
      "It is my duty to tune the new tube radio.",
      "The avenue is due for a new attitude.",
      "Few knew the tune the duke produced.",
      "The nurse knew the numerous new duties.",
      "Sue assumed the suit was a new style.",
      "During the interview he introduced the institute.",
      "The stewardess due at noon resumed her duties.",
      "A new tulip grew next to the dune.",
      "Students duly noted the due dates on Tuesday."],
    paragraph: "On Tuesday, the new students reported to the institute. Their first duty was to tune in to a news broadcast and write down the numerous new terms. Sue assumed it would be dull, but the duke who produced the show had a knack for it, and by noon, even the dune dry topic of tax duties sounded almost new.",
    tips: [
      "After t, d, n, s and l, Americans drop the y glide: new is noo, duty is doo tee, Tuesday is TOOZ day.",
      "But keep the y after other consonants: cute, few, music, beauty, huge.",
      "So do and dew sound the same, but cute and coot do not.",
      "Do not over correct and drop the y everywhere, only after the coronal consonants."],
    perception: [["new","knew"],["do","due"],["loot","lute"],["cute","coot"],["cue","coo"],["mute","moot"]],
    aliases: ["yod dropping","yod","new noo","tuesday toosday","glide dropping","u sound"]
  },

  "Casual reductions": {
    skill: "fluency", ipa: "spoken forms",
    why: "Casual speech contracts hard. Going to is gonna and want to is wanna, and over pronouncing them sounds odder than not using them.",
    pairs: [["going to","gonna"],["want to","wanna"],["got to","gotta"],["give me","gimme"],
      ["let me","lemme"],["kind of","kinda"],["sort of","sorta"],["have to","hafta"],
      ["don't know","dunno"],["what are you","whatcha"],["a lot of","lotta"],["ought to","oughta"],
      ["did you","didja"],["would you","wouldja"],["out of","outta"],["trying to","tryna"]],
    sentences: [
      "I am gonna grab a coffee, you want one?",
      "We gotta leave soon or we will be late.",
      "Lemme know what you wanna do tonight.",
      "I dunno, it is kinda far, sorta out of the way.",
      "Whatcha doing later? Wanna hang out?",
      "You oughta try it, it is a lotta fun.",
      "I hafta finish this, then I am outta here.",
      "Didja see what they did? Kinda wild.",
      "Gimme a sec, I am tryna find my keys.",
      "Come on, it is gonna be fine, trust me."],
    paragraph: "Honestly? I am gonna keep this casual. When friends talk, they do not say I am going to give you the information, they say lemme give ya the info. What are you doing turns into whatcha doin. I have got to go is just I gotta go. It sounds lazy on paper, but outta the mouth it is exactly how Americans actually sound.",
    tips: [
      "These are spoken only reductions, natural in speech and not in formal writing.",
      "going to becomes gonna, want to becomes wanna, got to becomes gotta (only before a verb).",
      "Keep them light and fast, over pronouncing them sounds odder than not using them.",
      "Use them in casual talk and switch back to full forms in formal or stressed speech."],
    perception: [],
    speak: "b",
    aliases: ["casual reductions","gonna","wanna","gotta","contractions","reduced forms","relaxed speech"]
  }

};

/* Resolve a weak spot label (exact COMMON_SPOTS match, or a custom user
   label) to a drill pack. Returns {label, pack} or null. */
function getDrillPack(label){
  if(!label) return null;
  if(DRILL_PACKS[label]) return { label, pack: DRILL_PACKS[label] };
  const q = String(label).toLowerCase();
  // exact-ish: a known label is contained in the custom text
  for(const key in DRILL_PACKS){
    if(q.includes(key.toLowerCase())) return { label: key, pack: DRILL_PACKS[key] };
  }
  // keyword / alias match
  for(const key in DRILL_PACKS){
    const al = DRILL_PACKS[key].aliases || [];
    for(const a of al){ if(q.includes(a)) return { label: key, pack: DRILL_PACKS[key] }; }
  }
  return null;
}

// expose globally for the (classic, non-module) drill engine + main script
window.DRILL_PACKS = DRILL_PACKS;
window.getDrillPack = getDrillPack;
