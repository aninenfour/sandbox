# Hotcoin 101 — project brief for Claude Code

Educational video series for Hotcoin social (X, Instagram @hotcoinex, YouTube, LinkedIn, Telegram), built in Remotion. Episodes are standalone, around 60 to 70 seconds, in both 9:16 and 16:9. Owner: Alex (Social Media, Ads & Operations Lead, Hotcoin Global).

Read this before touching anything. Every rule below came from real feedback.

---

## Deliverables per episode

Exactly four files, nothing else:

1. `hotcoin-101-epNN-<slug>-9x16.mp4` · 60fps, with voiceover and music (from FILE 013; 001 to 012 were silent)
2. `hotcoin-101-epNN-<slug>-16x9.mp4` · 60fps, with voiceover and music
3. `hotcoin-101-epNN-voiceover.md` — only the copy-paste block, no timecodes, no direction notes
4. `hotcoin-101-epNN-posts.md` — X (main post + reply), Instagram (caption + first-comment hashtags), LinkedIn, Telegram, YouTube (16:9 title, Shorts title under 40 chars, description with footer, tags, pinned comment)

From FILE 013 the videos ship finished, with voice and a quiet music bed.

- **Voice:** ElevenLabs, voice "Will" (`bIHbv24MWmeRgasZH58o`), model `eleven_v3`, stability 0.5. Set in `.env` (gitignored, never commit the key). The key is on the free plan, so only ElevenLabs' default voices work through the API; library voices need a paid plan.
- `npm run vo -- <file> --out epNN-part` writes `public/vo/*.mp3` plus `*.words.json` with every word's start in 30fps clock units. Generate the cold open and the body as separate takes so the title card can sit in silence between them. Will reads at about 2.3 words a second; the body is stretched 5% with ffmpeg `atempo=1.05` (words.json rescaled to match), then both parts are mastered to -16 LUFS.
- Episodes place scenes and narrator moves on words (`src/ep13/timeline.ts`: `w('word', n)`), so a new take re-times the edit.
- **Music:** one track for the series, "Serene View" (Mixkit, free licence), `public/music/serene-view-bed.mp3`, normalised to about -31 LUFS so it sits well under the voice. No beat-driven tracks: Alex found them too busy.
---

## Current look: Beyond the Green / Terminal (FILE 009 onward)

Set with `look: 'terminal'` and `verticalLayout: 'reels'` in the episode script.

- Black ground, looping code rain (seamless, `src/design/Rain.tsx`), centre vignette, scanlines
- Pages swap through a horizontal slit of light at centre screen (`SceneSlit` in `src/design/Scene.tsx`)
- Reversed white "Hotcoin" lockup in the header rail (`public/hotcoin-lockup-dark.png`)
- Heavy Inter 700 headings, mono labels, brand green `#7EC25A` as the only accent
- The end card prints the lockup in with a light sweep; the narrator dot lands exactly on the logo's dot (geometry in `LOCKUP_DARK`, `src/design/Dot.tsx`)

Older looks (`flat` paper, `cutPaper`, `white`) still exist for episodes 001 to 008. Don't change them.

---

## New look: Notebook (FILE 013 onward, in review)

A motion designer's notebook, after the references Alex picked. Prototype lives in `src/lab/` (compositions `lab-style-*`, `lab-eye-*`); episode code will use the same pieces.

- Two grounds that alternate page to page: paper `#EDECE7` with static grain, charcoal `#15171A` with a faint dot grid. Tokens in `src/design/tokens.ts`.
- Display type is Anton (condensed, uppercase). Handwritten notes in Caveat, mono labels in JetBrains Mono. Brand green is the accent, red `#F0453F` only for "down / wrong / careful".
- Notes write on and draw an arrow to what they explain (`Note` in `src/design/Notebook.tsx`). They replace most on-screen body text.
- Chrome stays subordinate: small lockup + file number top left, timecode top right, keyframe timeline along the bottom with a section label, registration marks.
- Page changes are an iris wipe out of the narrator's position, led by two thin rings (`Wipe`).
- Headlines drop in letter by letter (about 45ms stagger) and land at exactly zero offset (`Headline`). The narrator can land as the headline's full stop.
- No dithering, no reduced palette. Considered and rejected: it fights the brand green and the clean diagram look.

Older looks (`terminal`, `flat`, `cutPaper`, `white`) stay as they are for 001 to 012.

---

## Motion rules (important)

- **60fps.** `SERIES.fps = 60`. All timings are authored in 30fps units via `src/design/clock.ts` (`useFrame`, `CLOCK_FPS`). Components read `useFrame()`, never `useCurrentFrame()` directly, except Scene, Chrome progress bar, Episode and motion.ts, which deliberately use real frames.
- **Motion is distributed across the whole page**, not finished in the first second. Use `src/design/motion.ts`: `useStagger` (entrances spread from about 6% to 45% of the beat), `useReadthrough` (a highlight travelling down rows in the back half), `useSecondAct`, `useSweep`.
- **Text must never drift.** Text animates in, then stays pixel-still. No slow zoom, no page drift, no sub-pixel creep. `useInk` and the `snap()` helper in the blocks force landed text to exactly zero offset. Second-act effects change colour, glow and backgrounds only, never the position or scale of text. This was tested: letter pixels must be identical between two late frames of the same page.
- Diagrams and figures may keep moving for the whole page. That is the point of them.
- Pacing should stay readable. Earlier pacing was about right; the problem was static frames, not page length.

---

## Content and elements

- Prefer bespoke visuals over text pages. Less on-screen text, more diagrams.
- Don't reuse the same element run every episode. Rotate: `visual`, `cards`, `callout`, `pickTwo`, block `compare`, block `list`, figures.
- Tables in the dark look are filled blocks with a 2px gutter, conclusion row solid green (`TerminalCompare`). Never ruled rows.
- Full-page visuals register in `src/design/Visuals.ts` (index figures, leverage figures). Add new episode figures there.
- Numbers on screen must be defensible. If a live figure can't be verified, show the shape, not a number. Label approximations and illustrative charts on screen.
- Promotion stays minimal: logo, colours, a light "on Hotcoin" CTA line.
- Episode list and topics: `schedule/build_schedule.py` (`EP` list, 60 episodes).

---

## The narrator dot

The logo's green dot, alone. From FILE 013 it is a proper character (`src/companion/Companion.tsx`):

- One eye with skin-coloured upper and lower lids, a crease line, iris ring, pupil with two catchlights, and a brow. Ten moods in `src/companion/moods.ts` (neutral, happy, delight, curious, skeptical, surprised, worried, focused, sleepy, excited) that blend numerically, so any mood can turn into any other.
- Alive on its own: seeded blinks (sometimes double), micro saccades, breathing, pupil tremble when worried. Eyes lead a move: it looks where it's going before it goes.
- Moves with anticipation and overshoot (`glide`), ballistic `hop` and `drop` with landing squash, `linear` for riding a chart line, `cut` for a hold. Stretch and directional motion blur at speed, onion-skin ghosts, contact shadow on a floor line.
- `plain: true` is the bare logo dot (no face); `closed: true` shuts the lids. The end card lands it on the lockup's dot (geometry in `LOCKUP`, `src/design/tokens.ts`) and goes plain.
- Driven by a list of beats `{at, x, y, r, path, mood, look}` in clock units. It is a figure, not text, so it may keep moving for the whole page.

---

## Writing rules

- Never use em dashes, anywhere.
- Voiceover: human, spoken rhythm, loose like a YouTuber talking ("and iron is... well, heavy"). Contractions. Fewer full stops, more connectives ("and so", "which is why", "because"). At most one or two "uhm"s in a whole episode, never at the start. Avoid clean parallel declaratives like "X is A. Y is B." About 2.5 words per second, silence on the title card and the end card.
- The voice tells the story; the screen shows it. Don't put the narration on screen as text. One key word or number per scene, plus short handwritten notes.
- Never mention that the video is made in code.
- Social copy: human, one or two emoji per post at most, arrow lists (→) not bullets, cashtags on X ($BTC), no first-person brand voice.
- Instagram captions end with "Follow @hotcoinex for the rest of the series." then "Hotcoin 101 · File NNN · Money, explained". Hashtags go in the first comment and include #hotcoin #hotcoinex.

---

## Rendering

```bash
# in this cloud container, point Remotion at the preinstalled Chromium:
export REMOTION_CHROME=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
npx remotion bundle src/index.ts --out-dir=bundle
npx remotion render bundle <slug>-vertical out/<name>-9x16.mp4 --concurrency=<cores>
npx remotion render bundle <slug>-horizontal out/<name>-16x9.mp4 --concurrency=<cores>
# delivery: keep the audio, check loudness (about -16 LUFS), move the index to the front
ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4
```

Composition ids are `${slug}-vertical` and `${slug}-horizontal` (see `src/Root.tsx`). FILE 013 is `paper-money-invented-twice`. Always re-bundle after source changes. Check stills at several points of each page in both formats before a full render: `node scripts/stills.mjs <comp-id> out/check 300,900,1500` renders many frames in one browser session.
