# Daily Finance Reel: Runbook

One run = one finished video posted to Instagram (Reel), TikTok and Facebook (Reel). Cadence: one video every 2 days.
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
- Pick ONE story that has not run before (check `episodes/`). Rotate categories (history / crypto / markets / psychology). It must be true and checkable.

## 2. Write
Create `episodes/<YYYY-MM-DD>-<slug>/` with:
- `script.txt`: one sentence per line, 110 to 135 words (45 to 52 s). Hook line first, picked from the PLAYBOOK hook bank (rotate types; avoid the type used yesterday), then "Step one." to "Step four." each starting its own line, then a one-line lesson. Spoken rhythm, contractions, connectives. Say "legend says" for anything apocryphal. No price predictions, no "buy X", no em dashes.
- `caption.md`: hook sentence, 2 short lines of story, 3 arrow (→) lessons, a question for comments, "Follow Hotcoin for more money stories.", then dot keywords (•finance •investing ...). Never name the account handle.
- Fact-check every number and date in the script with a web search before going on.

## 3. Voice
```bash
python3 scripts/tts.py episodes/<dir>     # writes public/vo.mp3 + episodes/<dir>/words.json
```
Then write `episodes/<dir>/episode.json` (see `scripts/build.py` docstring): about 26 scenes, each image used twice (wide, then a close crop) so cuts land about every 2 s; a `{"at": "Step one", "step": 1}` entry for each step; `highlight` = 8 to 12 key words (numbers, the punchline words).

## 4. Images (Canva)
1. `generate-image`, `PORTRAIT_9_16`, about 11 scenes. Every prompt passes the style reference `imageReferences: [{"type":"MEDIA","id":"MAHZNJ0bV8g"}]` and uses the style block in PLAYBOOK. Generate the main character's hero image first, then pass BOTH the style ref and the hero's media id for the other scenes so the character stays consistent. Fire them all in parallel, then poll `get-generate-image-job`.
2. Look at every image. Regenerate any with text/letters, extra limbs, wrong colours (red bodies), or off-style.
3. Full-res export (thumbnails are too small): `create-design` (brief "plain blank vertical story page", format "Instagram Story") → `read-design` with `open_transaction: true` → `edit-design` `add_page` ×N (1080×1920, title = scene name) → `read-design` with the transaction and `page_indices` 2..N+1 for page ids → `edit-design` `insert_fill` per page (left 0, top 0, width 1080, height 1922) → `edit-design` `finalize: commit` → `export-design` png, pages 2..N+1, 1080×1920, pro quality → `curl` each URL to `public/img/<scene>.png`.

## 5. Build and render
```bash
python3 scripts/build.py episodes/<dir>
npx remotion still src/index.ts Reel /tmp/check.png --frame=200   # spot-check a few frames (captions, step card, end card)
scripts/finish.sh <slug>          # renders 60 fps, adds the day's music track at a low level, masters to -14 LUFS → out/<slug>.mp4
scripts/thumb.sh episodes/<dir>   # cover: character's face + hook text, no logo → out/<slug>-thumb.jpg (look at it)
```
Thumbnail: add `"thumb": {"text": "...", "hi": [...], "kicker": "True story", "img": "s06", "zoom": 1.5, "fx": 65, "fy": 22}` to episode.json. Pick the scene where the main character's face is biggest and most expressive; zoom 1.4 to 1.6 with fx/fy on the face so the face fills the upper half (the text sits in the lower third on a dark fade). Text = the hook in 4 to 7 words, 1 or 2 key words in `hi` (shown green), kicker optional (2 to 3 words). Face must not be covered by text. No logo, no em dashes, no price predictions.

Check: make a contact sheet with ffmpeg (`fps=14/<dur>,scale=300:-1,tile=7x2`) and look at it. Captions readable, no text in images, end card says "Follow Hotcoin for more".

## 6. Publish
```bash
PUBLER_API_KEY=<from the task prompt> python3 scripts/publish.py out/<slug>.mp4 episodes/<dir>/caption.md out/<slug>-thumb.jpg
```
The third argument sets the cover on all three networks (if the cover upload fails it posts with the default frame and says so). Posts Instagram Reel (also on grid), TikTok (public) and Facebook Reel, spaced a minute apart, retrying on Publer's "one minute gap" clash. Writes `published.json` with the links.

## 7. Log and save
- Add a row to the PLAYBOOK results log (date, topic, hook type, links; leave views blank for the weekly review).
- Commit the episode folder and PLAYBOOK changes (NOT images, audio or video; .gitignore covers them) and push.
- Send the user one short message: topic, the three links, anything that went wrong.

## If something breaks
- Canva or the render fails: retry once, then stop and message the user what failed. Never post a broken video.
- A network fails to publish after retries: post to the others, report the failed one with Publer's error.
