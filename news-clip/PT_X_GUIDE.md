# News-clip videos on Hotcoin Português (X): how they work and how to post them

Written Nov 23, 2026 for the PT branch (`claude/modest-davinci-f0eab9`). The tool lives on
`claude/pexels-pixabay-api-access-7iwjqa` in `news-clip/`. All the rules in `social/pt/RUNBOOK.md` still apply
(PT account only, pt-BR, Brasília time, schedule.mjs slots, risk lines, no competitor names, no em dashes).

## 1. What a news clip is
A short video (15 to 45 s) of a **real person speaking**, cut from real footage, with:
- the footage on top,
- a black panel below with a white line and the Hotcoin logo,
- a small lime line with **date · place** (e.g. `8 OUT 2014 · SENADO DO CANADÁ`),
- a big uppercase headline in plain words, 1 or 2 key words in lime, ending with a **"Veja..." hook**
  ("Veja o que este homem disse ao Senado do Canadá em 2014", "Veja o que aconteceu depois"),
- subtitles of what the person says, in **pt-BR**, timed to the speech,
- the original voice, loudness-normalised. No music.

Frame 1 already shows everything (footage, panel, headline), so the X preview is never blank.

Owner rules (Nov 23): plain words a broad audience gets at once (no idioms or insider phrases); a face on screen most of
the time; real footage only; clip like news accounts do, and credit the source in the post's comment and in
`hotcoin-tradfi/FOOTAGE_CREDITS.md`. Never make the person look like they endorse Hotcoin.

Example made from the English reel: `news-clip/clips/fed-shock-antonopoulos/clip_pt_x.json` + `lines_pt.json`
(this week's Fed "shock" rate-hike talk, tied to Andreas Antonopoulos at Canada's Senate on Oct 8, 2014).

## 2. Get the tool into the PT branch
```bash
cd /home/user/sandbox && git checkout claude/modest-davinci-f0eab9 && git pull -q
git fetch -q origin claude/pexels-pixabay-api-access-7iwjqa
git checkout origin/claude/pexels-pixabay-api-access-7iwjqa -- news-clip/make.py news-clip/transcribe.py news-clip/.gitignore
pip install -q --break-system-packages faster-whisper soundfile
```
Needs: `/usr/bin/ffmpeg`, Playwright (preinstalled), the logo at `hotcoin-tradfi/public/brand/logo-official-white.png`
(re-create it from the brand files if `public/` is empty after a container reset).
Keep PT clips in `news-clip/clips/<slug>-pt/` so they never clash with the English ones.

## 3. Step by step
1. **Pick the story.** This week's finance/crypto news that Brazilians care about, tied to footage of a real person
   speaking, or a pure archive moment (early Bitcoin talks, hearings, interviews). If the English channel already ran a
   clip, the PT channel can reuse the same footage and cut (it's a different audience), but check `social/pt/LOG.md`
   so the PT account doesn't repeat itself.
2. **Get the footage.** From the cloud, archive.org works (search `https://archive.org/advancedsearch.php`, many
   `youtube-<id>` mirrors and conference uploads). YouTube itself is blocked (bot wall). Don't use TV News Archive items
   (access-restricted), and never try to get around a blocked source. Download only what you need:
   `/usr/bin/ffmpeg -t 900 -i "<archive mp4 url>" -c copy news-clip/src/x.mp4`
3. **Transcribe** (English speech, word timings):
   `/usr/bin/ffmpeg -i news-clip/src/x.mp4 -ac 1 -ar 16000 news-clip/src/x.wav && python3 news-clip/transcribe.py news-clip/src/x.wav news-clip/src/x.txt base.en`
   Read `x.txt`, pick 15 to 45 s with one clear point (several segments are fine, they're joined with hard cuts).
4. **Write `clip.json`** (in `news-clip/clips/<slug>-pt/`):
   ```json
   {
     "src": "src/x.mp4",
     "segments": [[541.9, 558.9]],
     "transcript": "src/x.txt.json",
     "crop": "ih*0.70*1.42:ih*0.70:(iw-ow)/2:0",
     "format": "x45",
     "name": "<slug>-pt-x",
     "subs_lines": "lines_pt.json",
     "kicker": "8 OUT 2014 · SENADO DO CANADÁ",
     "headline": "Um diretor do Fed defende uma alta de juros maior para dar um “choque”. Veja o que este homem disse ao Senado do Canadá em 2014",
     "hi": ["choque", "2014"]
   }
   ```
   - `format: "x45"` = 1080x1350 (4:5), the size X shows biggest in the feed. Footage box is 1080x760 (about 1.42:1).
   - `crop` is applied before scaling: keep the face in frame and **cut out TV lower-thirds, tickers and channel logos**
     (the Senate clip needs the top 70% only). Paths are relative to `news-clip/`; run make.py from there.
   - Headline: 12 to 22 words, plain pt-BR, ends with the "Veja..." hook. Dates in pt-BR style (`8 OUT 2014`).
5. **Translate the subtitles (the important part).**
   - `cd news-clip && python3 make.py clips/<slug>-pt/clip.json --lines` writes `lines_en.json`: every spoken line with
     its start/end on the final video's timeline.
   - Copy it to `lines_pt.json` and replace each English text with pt-BR. **Keep every start/end as it is**, keep one
     entry per line, and translate line by line so the words appear while the person says them. Lines can break
     mid-sentence (whisper splits that way): translate so each line still ends where the speaker pauses.
   - Translate meaning, not word for word, in simple spoken pt-BR (`você`, not `tu`). Numbers in Brazilian style
     (`30 anos`, `US$ 1,1 milhão`, `4,2 trilhões`). Keep names as they are. If a phrase is hard to follow, simplify it
     ("monetary velocity a week hence" → "o rumo do dinheiro de um país inteiro em uma semana").
   - Have the translation re-read once against the audio (listen with the English transcript open). A subtitle that
     says something the person didn't say is a factual error.
   - make.py splits each line into short chunks (max 26 characters, `sub_chars` to change) and shares the line's time
     out by length, folding tiny pieces into a neighbour so nothing flashes.
6. **Build:** `python3 make.py clips/<slug>-pt/clip.json` → `news-clip/out/<slug>-pt-x.mp4`.
   Check: frame 1 (`/usr/bin/ffmpeg -i out/<slug>-pt-x.mp4 -frames:v 1 /tmp/f1.png`) and a contact sheet
   (`-vf "fps=4/<dur>,scale=500:-1,tile=4x1"`): face visible, no TV graphics, subtitles readable and in sync, headline
   not cut off, accents (ã, ç, é) render correctly. The generated chunks are saved as `subs-<name>.json` next to the
   clip json; read them once.
7. **Fact-check** every claim in the headline and caption with two sources; check quotes against an official transcript
   when there is one (e.g. the Senate of Canada publishes committee transcripts). Sources go in a comment at the top
   of `caption.md`, never on the video.

## 4. Posting on X (Hotcoin Português)
- Copy the mp4 to `social/pt/publish/<date>/`, commit and push (the repo is public), then import it into Publer from
  `https://raw.githubusercontent.com/aninenfour/sandbox/claude/modest-davinci-f0eab9/social/pt/publish/<date>/<file>.mp4`
  with `upload_publer_media_from_url`. Keep the file under ~15 MB (the 17 s example is 2.8 MB; if a clip is bigger, re-encode with
  `/usr/bin/ffmpeg -i in.mp4 -c:v libx264 -crf 23 -c:a copy out.mp4`). The first
  time, check in Publer that the video imported and plays.
- `submit_publer_posts`, `when: "schedule"`, account `6af6e3c91740237b1cdd90c0`, platform `twitter`,
  `post_type: "video"`, one post per call, time from `schedule.mjs`.
- Caption ≤ 280 characters: the hook line, one line of context with the date, a two-option question, the risk line
  when markets/prices are involved. Source credit and any link go in the first reply (`follow_up_comments`, delay 0).
  Example (about 276 characters with emoji counted as 2, right at the limit):
  ```
  Um diretor do Fed defende uma alta de juros maior para dar um “choque” 👇

  Em 2014, Andreas Antonopoulos disse ao Senado do Canadá que quem tem Bitcoin sabe quantas moedas vão existir daqui a 30 anos.

  Regras fixas ou um Fed flexível? 🟧/🏦
  Não é recomendação de investimento.
  ```
  First reply: `Vídeo: Senado do Canadá, Comitê de Bancos, 8/10/2014.`
- X limits: up to 2:20 per video (we stay at 15 to 45 s), mp4 H.264 + AAC (make.py already outputs this).

## 5. Cadence and logging
- Suggested: one PT clip every 3 days, as its own slot in `schedule.mjs`, at least 60 min from other PT posts.
- Log it like every PT post: `social/pt/LOG.md`, the Google Sheet post log, and `hotcoin-tradfi/FOOTAGE_CREDITS.md`
  (source, timecodes).
- Commit `news-clip/clips/<slug>-pt/` (json + captions only; `src/` and `out/` are gitignored) and the published mp4 in
  `social/pt/publish/<date>/`.

## 6. If something goes wrong
- Footage you can't get, or a quote you can't verify: don't post; pick another story.
- Subtitles out of sync: fix the start/end in `lines_pt.json` (or the `segments`), rebuild, re-check.
- Headline too long: make.py shrinks it to fit; if it drops below ~50 px, shorten the text instead.
