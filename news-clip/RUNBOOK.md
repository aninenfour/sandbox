# News-clip reels: Runbook

One run = one finished news-clip reel posted to Instagram (Reel), TikTok and Facebook (Reel). Cadence: every 3 days
(owner, Nov 23, 2026; runs the day after each story reel, at about 11:40 Beijing). Format approved by the owner on Nov 23 ("Looks good ... lets push"). See README.md for the format.

## Owner rules (Nov 23)
- Plain words only. We post for a broad audience: everyone must get the point at once. No idioms or insider phrases in the
  headline or caption (bad: "the CFO turned kind of white"; good: "his finance chief said no at first").
  The subtitles still show exactly what the person says.
- Keep the "watch" hook: the headline ends with a line that makes people keep watching ("Watch what this man told
  Canada's Senate in 2014", "Watch what happened next"). The owner liked this on the first test.
- Human-centric: a real person's face on screen for most of the clip. We lack faces on the channel; that is the point.
- Real footage only (no AI images). Clip like news accounts do; credit the source in the caption comment and in
  hotcoin-tradfi/FOOTAGE_CREDITS.md.

## 1. Pick
- Check this week's finance/crypto news (web search) and Publer (what the account posted, what worked).
- Find real footage of people that a viewer will care about: the person in the news, or an archive moment that this week's
  news makes interesting again (the Nov 23 pattern: this week's Fed "shock" hike talk + Antonopoulos at Canada's Senate in
  2014 on central bankers). Early crypto talks, hearings, interviews and conference talks work well.
- Footage access from the cloud: archive.org works (search with advancedsearch.php; `youtube-<id>` mirrors, conference
  uploads). YouTube itself is blocked (bot wall). Do NOT use TV News Archive items (access-restricted) and do not try to
  get around a blocked or denied source.
- Never name competitors (Binance, OKX...) on screen or in the caption.
- Rotate: alternate a this-week-news tie-in and a pure archive story where possible.

## 2. Cut
- Download only the part you need: `/usr/bin/ffmpeg -t <sec> -i <archive mp4 url> -c copy src/x.mp4`.
- Transcribe: `/usr/bin/ffmpeg -i src/x.mp4 -ac 1 -ar 16000 src/x.wav && python3 transcribe.py src/x.wav src/x.txt base.en` (pip install faster-whisper soundfile first) -> `src/x.txt` + `.json`, read it, pick 15 to 45 s
  with one clear point. Several segments are fine (hard cuts).
- Write `clips/<slug>/clip.json` (see make.py docstring): segments, crop (keep the face in frame, crop out TV
  lower-thirds/logos), kicker "DATE · PLACE", headline (plain words, ends with the watch hook, 12 to 20 words), 1 or 2
  lime highlights.
- Fact-check every claim in the headline and caption with two sources; check quotes against an official transcript when
  one exists. Put sources in an HTML comment at the top of caption.md.

## 3. Build and check
```bash
cd news-clip && python3 make.py clips/<slug>/clip.json        # -> out/<slug>.mp4
/usr/bin/ffmpeg -i out/<slug>.mp4 -frames:v 1 -q:v 2 out/<slug>-thumb.jpg   # cover = frame 1 (full design)
```
Look at frame 1 and a contact sheet: face visible, no TV logos or tickers, subtitles readable, headline not cut off and
above the Reels caption zone, no em dashes.

## 4. Publish
- Captions: `clips/<slug>/caption.txt` = headline-style first line ending with 👇, 2 short lines of context with the date,
  a two-option question (emoji pair or Yes/No), "Follow Hotcoin for more", "Not financial advice." when prices/markets
  are involved, 4 to 5 hashtags. Never name the account handle. X version in caption.md (not posted by this run).
- Check Publer for anything posted or scheduled on the Hotcoin IG/TikTok/FB within ±2 h (and the story reel within ±6 h);
  move your post time if needed.
- Post now: `PUBLER_API_KEY=<from the task prompt> python3 ../daily-reel/scripts/publish.py out/<slug>.mp4 clips/<slug>/caption.txt out/<slug>-thumb.jpg`
  (`--at <ISO time>` schedules instead; it uses Publer's /posts/schedule; check the queue afterwards.)

## 5. Log
Add a row to LOG.md (date, slug, source, hook, links). Commit clips/<slug>/ (no media) and push.

## If something breaks
Footage you can't get, a quote you can't verify, or a render that looks wrong: don't post. Pick another story or stop and
report. Never post the same clip twice.
