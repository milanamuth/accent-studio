# Accent Studio: build notes, repo workflow, and deployment

This covers what changed in this refactor, where every file goes, how to run the repo without the nested-folder and cache headaches you hit before, and what to set in Vercel so scoring and AI feedback actually work. No fluff, just the parts that bite.

## What changed and why

The whole app used to live in one 2,400 line `index.html` with a single inline script. That is fine until you need to edit the 60 day plan, add drill content, or fix the sync bug without scrolling past everything else. So three things happened here.

First, the static data moved out into `data/`. The 60 day curriculum, the skill list, the spaced repetition config, and the benchmark passage now sit in `data/plan.js`. Editing a day or adding a skill no longer means surgery on the app logic.

Second, every weak spot now has real practice content in `data/drills.js`, and there is a new interactive practice modal in `js/drill-engine.js`. This is the headline addition. Before, a weak spot was just a label with a "done" button on the honor system. Now each of the 19 common weak spots opens a session: hear the minimal pairs spoken in a US voice, run a quick listening check, then record yourself reading target sentences and get objective Azure scores per line. Marking it practiced from inside the modal advances the spaced repetition schedule.

Third, the cross device sync data loss bug is fixed in `js/sync.js`. More on that below because it is the most important behavioral change.

## File layout

Everything is relative to `index.html` at the repo root. Keep this structure:

```
index.html
data/plan.js          curriculum, skills, SR config, rainbow passage
data/drills.js        DRILL_PACKS for all 19 weak spots + getDrillPack()
js/sync.js            IndexedDB + state + Supabase cloud sync (patched)
js/drill-engine.js    interactive practice modal
api/score.js          Azure pronunciation assessment (already in your repo)
api/feedback.js       Gemini coach (already in your repo)
```

The four new script files load in this exact order, right after the Supabase CDN and before the main inline script:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="data/plan.js?v=1"></script>
<script src="data/drills.js?v=1"></script>
<script src="js/sync.js?v=1"></script>
<script src="js/drill-engine.js?v=1"></script>
<script> ... main app ... </script>
```

Order matters. These are plain classic scripts, not ES modules, so they all share one global scope. `plan.js` and `drills.js` define the data the rest of the code reads. `sync.js` defines state and storage. `drill-engine.js` defines the modal. The inline script consumes all of it and boots last. If you ever reorder these, things will load as undefined.

## The sync fix, in plain terms

The old flow lost data when you signed in on a second device. Here is the sequence that broke it. A fresh device boots, creates empty local state stamped with the current time, and saves. Then the cloud pull arrives. The old code compared timestamps and, because the empty new state was "newer," treated it as the truth and pushed the blank slate up to the cloud. Your real history on the other device was overwritten. Classic last write wins on a document that should never have been treated as a single atomic value.

The patch does three things. Boot no longer stamps a fresh start date and saves before the cloud has been consulted, so an empty device cannot look "newer" than real history. Auth driven pulls are gated until the first boot reconcile finishes, so the pull cannot race the local load. And the pull now merges instead of overwriting: recordings, weak spots, logs, and achievements union by id, the completed days maps merge, scalars take the newer value, and the start date keeps the earliest real date because you only start the program once. Both devices converge instead of clobbering each other.

This was unit tested against the exact bug scenario and against true concurrent edits where both sides have unique data. The empty newer device no longer wipes the cloud, distinct recordings union, and the same weak spot dedupes to the copy with more progress.

Two related cleanups are in there too. Signing out now wipes local IndexedDB and resets state, so the next account on a shared device does not inherit the previous person's history. And sync failures surface in a toast instead of failing silently.

## Required environment variables in Vercel

The front end works offline as a static site. The two API functions are what need keys, and a missing key is the usual reason scoring or feedback "does nothing."

For `api/feedback.js` (the AI coach), set `GEMINI_API_KEY`. A 404 on the feedback call almost always means the function is not deployed; a different error usually means this key is missing.

For `api/score.js` (objective pronunciation scores), set your Azure Speech credentials, typically `SPEECH_KEY` and `SPEECH_REGION`. Match the variable names to whatever your `api/score.js` actually reads. Until these are set, the drill modal records fine but shows a friendly "scoring runs when deployed with Azure configured" message instead of numbers. That is expected, not a bug.

Set these under Project Settings, Environment Variables, for Production and Preview both, then redeploy. Env var changes do not apply to existing deployments.

## Magic link sign in

You are on Supabase magic links for auth. Two things keep that smooth. Pin the Supabase client so a future major version cannot silently change behavior: change the CDN tag from `@supabase/supabase-js@2` to a specific version like `@supabase/supabase-js@2.45.4` once you confirm it works. And if you hit magic link rate limits on the default Supabase email, point Supabase at your own SMTP. Resend works well here: host `smtp.resend.com`, port `465`, username `resend`, password is your Resend API key. Set it under Supabase, Authentication, SMTP settings.

## Repo workflow that avoids the mess from last time

The nested folder problem you fixed came from committing a subfolder as if it were the root. Keep `index.html` at the repo root and let Vercel serve the root. Do not nest the project inside a folder unless you also set the Vercel root directory to match.

Branch per change. Work on a branch like `feat/drill-engine` or `fix/sync-merge`, push it, and Vercel gives you a preview URL automatically. Test on the preview, not on production. When it looks right, merge to your main branch and production deploys.

Keep commits small and named for what they do, not what files changed. "fix: merge cloud state instead of overwrite" tells future you more than "update sync.js." Tag a known good state before any risky change so you can roll production back in one click from the Vercel dashboard.

## Cache busting

Browsers cache JS hard, which is why an edit can look like it "did nothing" until a hard refresh. The script tags carry a `?v=1` query for this reason. Whenever you change any of the four files, bump the number on that tag, for example `js/sync.js?v=2`. The URL changes, the browser refetches, and users get the new code without being told to clear anything. Bump all four together if you are unsure; it is cheap.

## How weak spots map to drills

`data/drills.js` is keyed by the exact 19 labels in `COMMON_SPOTS`. When someone picks a weak spot from the dropdown, it matches exactly. When they type a custom label, `getDrillPack()` tries an exact match, then checks whether a known label appears inside their text, then checks a small set of keyword aliases per pack. If nothing matches, the modal still opens with a record and listen fallback, so a custom label is never a dead end. To add or edit content, find the pack by its label key and edit the `pairs`, `sentences`, `paragraph`, `tips`, and `perception` arrays. To support a new common spot, add the label to `COMMON_SPOTS` in `data/plan.js` and add a matching pack in `data/drills.js`.

## Testing checklist

Before you push, syntax check each file with `node --check data/plan.js`, and the same for the other three. Then concatenate all four plus the inline script into one file and `node --check` that too; it catches the one thing per-file checks miss, which is two files declaring the same top level name and colliding in the shared global scope.

Then a two minute manual pass on a preview deploy. Open the app, confirm the dashboard and the 60 day plan render. Add a weak spot, open Practice, tap a pair to hear it, run the listening check, record a sentence, and confirm you either get scores or the Azure not configured message. Sign in on one browser, add a recording, sign in on a second browser, and confirm the recording shows up rather than the second browser wiping the first. Sign out and confirm the device is empty.

## Roadmap, in priority order

These came out of the earlier gap analysis and are the highest leverage next steps.

The biggest product unlock is auto detecting weak spots from the Azure per phoneme scores instead of asking people to name them. Azure already returns phoneme level detail on benchmark days; surfacing the worst phonemes as suggested drills closes the loop between scoring and practice.

After that, raise the integrity of the scores. Scripted reading flatters everyone, so add a short daily spontaneous speaking task and track the gap between scripted and spontaneous performance. That gap is the honest progress signal.

For retention, build a Day 1 versus Day N comparison player so people can hear their own improvement, add a weekly Gemini review of the week's recordings, and a shareable progress card. Streak reminders via a scheduled function help, but only once the comparison player gives people a reason to come back.

A reasonable sequence: week one, ship the sync fix and sign out wipe that are already done here and add Google sign in alongside magic links. Week two, the drill content and record and score that are also done here. Week three, per phoneme weak spot detection and the listening discrimination upgrades. Week four, the spontaneous task, the comparison player, and the weekly review.
