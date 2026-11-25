# Daily Finance Reel: Runbook

One run = one finished video posted to Instagram (Reel), TikTok and Facebook (Reel). Cadence: one video every 3 days (owner, 2026-11-23). News-clip reels (news-clip/) run every 3 days, the day after each story reel, so check Publer and never post two reels within ~6 h.
Read `PLAYBOOK.md` first: it holds the locked format, the style rules, the topic bank, what already ran, and what the weekly review learned.

## 0. Setup (fresh session)
```bash
cd /home/claude/sandbox/daily-reel   # clone aninenfour/sandbox first if missing (add_repo with push access)
npm install --silent
pip install --break-system-packages -q edge-tts numpy
```

## 1. Decide
- Check what worked: Publer `analyze_recent_performance` / `get_recent_posts` for the last week (Instagram + TikTok), plus the PLAYBOOK results log and "Learnings".
- Check trends: a quick web search for what finance/crypto story is in the news this week. A trend-linked historical parallel beats a random one.
- Pick ONE story that has not run before (check `episodes/`). If a dated topic in the PLAYBOOK topic bank has its anniversary today or yesterday, pick it and open the hook with the date ("On this exact day in...", "Eighteen years ago..."); otherwise rotate categories (history / crypto / markets / psychology). It must be true and checkable.

## 2. Write
Create `episodes/<YYYY-MM-DD>-<slug>/` with:
- `script.txt`: one sentence per line, 110 to 135 words (about 48 to 53 s of voice; build.py adds a 2 s hold on the last line and the 3 s end card). Hook line first, picked from the PLAYBOOK hook bank (rotate types; avoid the type used last time), then 1 or 2 lines of setup, then a **bridge line that announces the steps** so they don't come out of nowhere (e.g. "So here's how the first bitcoin purchase actually happened." / "Here's how it went wrong, in four steps." / "So how do you lose a fortune to a pizza? Four steps."), then "Step one." to "Step four." each starting its own line, then a one-line lesson. Never start a step without that bridge line right before Step one. Spoken rhythm, contractions, connectives. Say "legend says" for anything apocryphal. No price predictions, no "buy X", no em dashes.
- `caption.md`: hook sentence, 2 short lines of story, 3 arrow (→) lessons, a two-option question for comments (a pick between two things with two emoji or Yes/No, e.g. "Lose the password or lose the drive? 🔑/💾", "Would you have bought in the panic? Yes/No"; open questions got 0 comments on 13 of 13 IG story reels, two-option picks on the account's other posts get 1 to 2, see PLAYBOOK Learnings 2026-11-23), "Follow Hotcoin for more money stories.", then dot keywords (•finance •investing ...). Never name the account handle.
- Fact-check every number and date in the script with a web search before going on.

## 3. Voice
```bash
python3 scripts/tts.py episodes/<dir>     # writes public/vo.mp3 + episodes/<dir>/words.json
```
Then write `episodes/<dir>/episode.json` (see `scripts/build.py` docstring): about 26 to 30 scenes so cuts land about every 1.5 to 2 s. Use a fresh image for most cuts; reuse an image (wide, then a close crop) only where it helps; a `{"at": "Step one", "step": 1}` entry for each step; `highlight` = 8 to 12 key words (numbers, the punchline words).

## 4. Images (Canva first, Seedream 4 on fal for the missing shots)
Owner, 2026-11-25: Canva is free but slow (quota cooldown, about 1 image per 10 to 15 min, ~50% SERVER_GENERIC failures on Nov 24), so use Canva first and fill the shots it can't deliver in time with Seedream 4 on fal (paid, about 3¢ per 1088×1920 image). This is the owner's standing approval for Seedream 4 in this routine only, capped at **12 Seedream images per run** (about 36¢). No other paid model (Nano Banana etc.) without asking.
Plan the 18 to 22 scenes up front (varied shots: close-ups of faces and hands, wide establishing shots, props, crowds, visual metaphors) and rank them: the hero, the thumbnail face, then the shots that carry the story.
1. **Canva, up to ~75 minutes.** `generate-image`, `PORTRAIT_9_16`. Every prompt passes the style reference `imageReferences: [{"type":"MEDIA","id":"MAHZNJ0bV8g"}]` and uses the style block in PLAYBOOK. Generate the main character's hero image first, then pass BOTH the style ref and the hero's media id for the other scenes so the character stays consistent. Canva accepts one job at a time under the cooldown: fire the next prompt when the last one finishes; on `quota_cooldown` wait ~5 min and retry; a job that fails twice goes to the Seedream list. If even the hero fails twice, make the hero with Seedream too (text prompt plus the style block, no reference) and use it as the character reference.
2. **Seedream 4 for the rest.** After ~75 min (or as soon as Canva clearly stalls), make every scene still missing, up to the cap, with fal `fal-ai/bytedance/seedream/v4/edit`:
   - `image_urls`: the hero image (Canva export URL from step 3 below, or a fal CDN URL from `upload_file`), plus one more finished scene in the same style if available. Canva export URLs are public signed URLs and work directly.
   - `image_size: {"width": 1088, "height": 1920}`, `num_images: 1`. Fire them all in parallel with `submit_job`, then read them with `wait_for_jobs`.
   - Prompt: start with "Use the same character, same drawing style and same colour palette as the reference images (hand-drawn ink cartoon, crosshatching, cream paper grain, warm sepia with a soft green accent)." then the scene, then "Plain round white head, two small black dot eyes centred behind the glasses lenses, thin black stick arms and hands. No border, no frame, no text, no letters, no numbers." Spell out the facial expression in words (Seedream drifted to angry eyebrows when asked for shock).
   - `curl` each result, then crop/scale to 1080×1920 into `public/img/<scene>.png`: `ffmpeg -i in -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" public/img/<scene>.png`.
3. Look at every image (Canva and Seedream). Regenerate any with text/letters, extra limbs or hands, eyes outside the face or glasses, wrong colours (red bodies), a frame/border, or off-style. Use Seedream (within the cap) for a redo once Canva's 75 minutes are up.
4. Log in the PLAYBOOK Notes how many images came from Canva and how many from Seedream.
5. Full-res export of the Canva images (thumbnails are too small; Seedream files are already full size). Reuse the scratch design `DAHaoPR57xg` ("Blank vertical Instagram Story", add pages after the last one) or create one: `create-design` (brief "plain blank vertical story page", format "Instagram Story") → `read-design` with `open_transaction: true` → `edit-design` `add_page` ×N (1080×1920, title = scene name) → `read-design` with the transaction and `page_indices` 2..N+1 for page ids → `edit-design` `insert_fill` per page (left 0, top 0, width 1080, height 1922) → `edit-design` `finalize: commit` → `export-design` png, pages 2..N+1, 1080×1920, pro quality → `curl` each URL to `public/img/<scene>.png`.

## 5. Build and render
```bash
python3 scripts/build.py episodes/<dir>
npx remotion still src/index.ts Reel /tmp/check.png --frame=200   # spot-check a few frames (captions, step card, end card)
scripts/finish.sh <slug>          # renders 60 fps, adds the day's music track at a low level, masters to -14 LUFS → out/<slug>.mp4
scripts/thumb.sh episodes/<dir>   # cover: character's face + hook text, no logo → out/<slug>-thumb.jpg (look at it)
```
Thumbnail: add `"thumb": {"text": "...", "hi": [...], "kicker": "True story", "img": "s06", "zoom": 1.5, "fx": 65, "fy": 22}` to episode.json. Pick the scene where the main character's face is biggest and most expressive; zoom 1.4 to 1.6 with fx/fy on the face so the face fills the upper half (the text sits in the lower third on a dark fade). Text = the hook in 4 to 7 words, 1 or 2 key words in `hi` (shown green), kicker optional (2 to 3 words). Face must not be covered by text. No logo, no em dashes, no price predictions.

Check: make a contact sheet with ffmpeg (`fps=14/<dur>,scale=300:-1,tile=7x2`) and look at it. Captions readable, no text in images, the full lesson line holds on screen for about 2 s after the voice stops, end card says "Follow Hotcoin for more".

## 6. Publish
Before posting, check Publer for scheduled posts (`list_publer_posts` with state "scheduled", days 1) on the Hotcoin Instagram, TikTok and Facebook accounts. If anything is due within about 15 minutes of now, wait until it has gone out (plus a few minutes) before running publish.py, so the reel never lands on top of another post.
```bash
PUBLER_API_KEY=<from the task prompt> python3 scripts/publish.py out/<slug>.mp4 episodes/<dir>/caption.md out/<slug>-thumb.jpg
```
The third argument sets the cover on all three networks (if the cover upload fails it posts with the default frame and says so). Posts Instagram Reel (also on grid), TikTok (public) and Facebook Reel, spaced a minute apart, retrying on Publer's "one minute gap" clash. Writes `published.json` with the links.

## 7. Log and save
- Add a row to the PLAYBOOK results log (date, topic, hook type, links; leave views blank for the weekly review). In Notes always write the music track `finish.sh` printed (`music: ...`), the final length in seconds, and the posting time in Beijing time, so the weekly review can compare them.
- Commit the episode folder and PLAYBOOK changes (NOT images, audio or video; .gitignore covers them) and push.
- Send the user one short message: topic, the three links, anything that went wrong.

## If something breaks
- Canva or the render fails: retry once, then stop and message the user what failed. Never post a broken video.
- A network fails to publish after retries: post to the others, report the failed one with Publer's error.
