# Hotcoin Research (YouTube, 中文) · look test

Channel: @Hotcoin_Research, Chinese (simplified). Long case videos weekly, Shorts every 2 days.
Code: `src/research/` (`kit.tsx` look + 3D Green Dot, `sets.tsx` 3D sets, `Research.tsx` compositions).
Compositions: `research-trailer-horizontal` (1920x1080, 30 fps), `research-mtgox-vertical` (1080x1920, 30 fps).

## The look: "Night Files" (夜间档案)

- **World:** small noir sets built in three.js: a night mail train in the snow, a carriage desk with
  a case folder, a vault, an evidence board, a single object under a spotlight. No AI video, so every
  shot is consistent and free to re-render.
- **Light:** ink black (`#07090A`) with fog. One cool moonlight key per set, plus the Green Dot,
  which glows lime (`#B8F26A`) and lights what it looks at. Blinds stripes for the noir feel.
- **The Green Dot:** the Hotcoin 101 narrator, rebuilt in 3D: one eye, lids, brow, no mouth, no limbs.
  Uses the same 10 moods as 101 (`src/companion/moods.ts`), seeded blinks, breathing.
- **Type:** Noto Sans SC Black for Chinese, JetBrains Mono for numbers and case labels.
  Numbers count up in lime. Case label top left: `档案 002 · 门头沟 · 2014`.
- **Texture:** film grain + vignette on every frame; thin letterbox bars on 16:9.
- **End card:** the Hotcoin lockup assembles, the dot lands on the logo's dot, `RESEARCH` in mono.
- **Sound:** original noir bed (`audio/make_noir.py`): plucked walking bass, brushes, train wheels,
  bell accents on cuts. No samples.

## Render

```bash
export REMOTION_CHROME=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
python3 audio/make_noir.py /tmp/tr.wav 35.5 --hits 4.3,8.0,12.5,17.3,23.1 --boom 30.4 --train 0-8.2,23.1-30.4 --stop 30.4
ffmpeg -i /tmp/tr.wav -af loudnorm=I=-20:TP=-2 public/research/noir-trailer.wav
npx remotion bundle src/index.ts --out-dir=bundle
npx remotion render bundle research-trailer-horizontal out/research-trailer-16x9.mp4 --gl=swangle --concurrency=3
GL=swangle node scripts/stills.mjs research-mtgox-vertical out/check 100,500,900
```

## Status

Visual test only. Timings are estimated from the script length; once the voice takes exist,
replace `at/end` in `TR_LINES` and `SH_LINES` with the real cue times.
