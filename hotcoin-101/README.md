# Hotcoin 101 — series engine

Paper-documentary educational series for Hotcoin social. Remotion. Renders 9:16 and 16:9 from one script.

## Run it

```bash
npm install
npm run studio            # opens Remotion Studio at localhost:3000
```

Render:

```bash
npx remotion render history-of-investment-vertical   out/ep01-9x16.mp4
npx remotion render history-of-investment-horizontal out/ep01-16x9.mp4
```

Stills (seconds instead of minutes, use these to check a look before rendering):

```bash
npx remotion still history-of-investment-vertical out/check.png --frame=360
```

## How the project is laid out

```
src/
  design/tokens.ts      colours, fonts, formats, fps        <- change the series look here
  design/layout.ts      safe areas and the type ramp
  design/fonts.ts       locally bundled typefaces (no CDN at render time)
  design/Paper.tsx      the paper surface: grain, fibre, grid, registration marks
  design/Chrome.tsx     the header rail and progress bar carried by every frame
  design/Scene.tsx      page enter/exit and the standard content column
  design/Type.tsx       Title / Body / Kicker / Mono / InkRule / Highlight
  design/Figures.tsx    procedural line engravings + the FIG. plate
  blocks/index.tsx      beat types: coldOpen, title, figure, stat, compare, term, list, quote, timeline, outro
  Episode.tsx           turns a script into a video
  episodes/*.ts         one data file per episode           <- writing an episode happens here
  Root.tsx              registers a vertical and horizontal composition per episode
```

Writing a new episode means adding one file to `src/episodes/` and one line to `Root.tsx`. No layout work.

## Series rules

- Every frame carries the same header rail and green progress rule. That is the recognisability.
- Green is used sparingly: logo dot, one rule per page, figure numbers, highlight marker, progress bar, up candles.
- Illustrations are drawn procedurally in SVG. No stock, no 3D, no glow.
- Episodes are standalone. Nothing references another episode, so posting order does not matter.
- One Hotcoin line on the end card, at most one product mention in the body. No first-person brand voice.
- Rendered silent by design. Music and VO go on in CapCut.

## Vertical safe area

`verticalLayout: 'reels'` on an episode script pulls the 9:16 cut into the band that platform UI leaves visible: clear of the top 13% (status bar and nav), the bottom 21% (username, caption, tab bar) and the right-hand action rail below the halfway line. The header rail and progress rule move with it, and the type ramp tightens 5% to suit the shorter band. Horizontal ignores the setting. Episodes 001 to 003 use the original `standard` layout.

## Brand assets

- `public/hotcoin-mark.png` — the glyph, used in the header rail and title card
- `public/hotcoin-lockup.png` — the horizontal mark plus wordmark, used on the end card
- `COLOR.green` is `#7EC25A`, sampled from the logo. `COLOR.greenDeep` (`#4C8A2F`) is the darkened version used for small type on paper.

Every episode closes on the same end card: lockup, green rule, "Learn more at hotcoin.com".

## Render cost

Roughly 6 minutes per 70-second vertical episode on 2 cores. Both formats of one episode is about 12 minutes.
