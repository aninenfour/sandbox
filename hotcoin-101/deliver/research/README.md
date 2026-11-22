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
- **Type:** Noto Sans SC Black for Chinese, JetBrains Mono for numbers.
  Numbers count up in lime.
- **Texture:** film grain + vignette on every frame; thin letterbox bars on 16:9.
- **End card:** the Hotcoin lockup assembles, the dot lands on the logo's dot, `RESEARCH` in mono.
- **Sound:** Mandarin voice (Gemini TTS "Charon", one take per line) over a film-score bed from
  Mixkit (free licence), ducked under the voice. Credits in `public/research/CREDITS.md`.
- **No case-number labels** on screen (removed after review: noise).

## Render

```bash
export REMOTION_CHROME=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
npx remotion bundle src/index.ts --out-dir=bundle
npx remotion render bundle research-trailer-horizontal out/research-trailer-16x9.mp4 --gl=swangle --concurrency=3
GL=swangle node scripts/stills.mjs research-mtgox-vertical out/check 100,500,900
```

## Status

Visual approved. Line timings in `TR_LINES` / `SH_LINES` come from the real voice takes
(start + clip length); a new take means updating those numbers.
