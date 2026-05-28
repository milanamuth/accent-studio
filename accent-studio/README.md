# The Accent Studio

A 60-day American-accent training program with a built-in voice recorder, progress
dashboard, spaced-repetition drills, and AI coaching feedback powered by Gemini.

Everything the learner does (progress, ratings, drills, audio) is stored privately in
their own browser. The only server-side piece is one small function that forwards a
recording to Gemini and returns a coached assessment.

---

## What you need (Phase 1)

1. A **GitHub** account — https://github.com
2. A **Vercel** account, signed in with GitHub — https://vercel.com
3. A **Gemini API key** — https://aistudio.google.com (Get API key → Create API key)

You do **not** put the key in any file. It goes into Vercel's encrypted Environment
Variables in step 4 below.

---

## Deploy in 4 steps (about 15 minutes)

### Step 1 — Put these files in a GitHub repo

Option A, web upload (easiest, no tools):
1. On GitHub click **New** to create a repository. Name it `accent-studio`. Leave it Public or Private. Click **Create repository**.
2. On the new repo page click **uploading an existing file**.
3. Drag in **all** the files from this folder, keeping the structure:
   ```
   index.html
   package.json
   vercel.json
   .gitignore
   .env.example
   api/feedback.js        <-- the api folder must come along
   README.md
   ```
   Tip: drag the whole unzipped folder's contents. The `api` folder with `feedback.js` inside must be preserved.
4. Click **Commit changes**.

Option B, command line (if you use git):
```bash
git init
git add .
git commit -m "Accent Studio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/accent-studio.git
git push -u origin main
```

### Step 2 — Import the repo into Vercel

1. Go to https://vercel.com/new
2. Find `accent-studio` in your repo list and click **Import**.
3. Framework Preset: leave as **Other**. Build & Output settings: leave **default/empty** (this is a static site plus one function; no build step is needed).
4. Click **Deploy**. Wait for it to finish.

The app is now live, but AI feedback will not work yet until you add the key.

### Step 3 — Add your Gemini key as an environment variable

1. In Vercel open your project → **Settings** → **Environment Variables**.
2. Add a variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** paste the key from Google AI Studio (starts with `AIza`)
   - Environments: tick **Production**, **Preview**, **Development**.
3. Click **Save**.
4. (Optional) Add `PROVIDER` = `gemini` and `GEMINI_MODEL` = `gemini-2.5-flash`. These are the defaults, so you can skip them.

### Step 4 — Redeploy so the key takes effect

1. Go to the **Deployments** tab.
2. On the latest deployment click the **⋯** menu → **Redeploy** → confirm.

Done. Open your live URL, go to the **Today** tab, record a take, then tap
**AI feedback** on it. You should get scores, strengths, fixes, and one-tap drills.

---

## How to use it

- **Today** — the day's exercises with checkboxes, plus the Studio Recorder.
- **AI feedback** — appears on every saved recording. On benchmark days it compares you to the Rainbow Passage; on other days it assesses your general accent. You can push the AI's suggested drills straight into your spaced-repetition queue, and save its scores to the tracker.
- **Recordings** — your audio library and an A/B player to compare Day 1 against later takes.
- **Drills** — weak spots resurface on a 1 → 3 → 7 → 14 day schedule, then retire as mastered.
- **Settings** — export a JSON backup of your progress (audio is not included in backups).

---

## Cost

- **Vercel Hobby:** free for personal use.
- **Gemini:** audio analysis of a 1–2 minute clip costs roughly a cent; there is also a free tier. Realistically a few cents to a couple of dollars a month at daily use.

To stay efficient, the app downsamples each recording to 16 kHz mono WAV before sending,
and caps analyzed clips at about 2.5 minutes.

---

## Switching to Qwen (optional, later)

The function already supports Alibaba's Qwen as an alternative coach. To use it:
1. Get a DashScope API key (International region) — https://dashscope.console.aliyun.com
2. In Vercel set `PROVIDER=qwen` and `DASHSCOPE_API_KEY=your_key` (optionally `QWEN_MODEL`).
3. Redeploy.

---

## Adding Azure phoneme scoring (Phase 2, optional)

Not included yet by design. When you are ready, create an Azure Speech resource (free F0
tier), then ask for the `api/score.js` function and the front-end wiring. Azure returns
objective per-phoneme accuracy that complements the LLM's coaching.

---

## Security notes

- Your API key is a password. It lives only in Vercel's Environment Variables, never in the code or the repo. `.gitignore` already excludes `.env`.
- If a key ever leaks, delete it in Google AI Studio / DashScope and create a new one. It takes one click.
- All learner data is local to the browser. Clearing browser data erases it, so use Settings → Export periodically.

---

## Troubleshooting

- **"Feedback function not found" / 404:** the `api/feedback.js` file was not uploaded inside an `api` folder, or you have not redeployed since adding it.
- **"GEMINI_API_KEY is not set":** add the variable in Vercel Settings and redeploy.
- **"Your Gemini API key was rejected":** the key value is wrong; re-copy it from AI Studio.
- **Microphone does nothing:** recording needs HTTPS. Your Vercel URL is HTTPS, so use that, not a local `file://` open.
- **Rate limit (429):** wait a minute; the Gemini free tier limits requests per minute.
