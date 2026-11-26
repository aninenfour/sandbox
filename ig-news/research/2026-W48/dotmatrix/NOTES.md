# Dot-matrix / LED-board exploration (W48)

Owner inspo: competitor campaign with figures rendered as a dot-matrix on solid blue. We copied the
technique only: our own subjects, copy, colours (brand green #7EC25A from assets/symbol.svg, graphite
background), fonts (Archivo) and the real Hotcoin wordmark / symbol from assets/.

Files
- concept_1..5.png (1080x1350), overview.jpg (5 x 360 px), concept_3_alt_green.png (alt background: dark dots on brand green)
- anim.mp4 (4 s, 1080x1920, 30 fps; bull LEDs switch on with a white flash, then the line fades in) + anim_preview.gif
- Tool: ig-news/tools/dotmatrix.py (library + CLI). Rebuild: `python3 ig-news/research/2026-W48/dotmatrix/make_concepts.py`, `make_anim.py`

| # | Subject | Copy | Trading element |
|---|---|---|---|
| 1 | Man holding a phone | Trade it from your phone | screen lights up with a white-hot rising price line |
| 2 | Bull (bronze statue) | Bull or bear? You pick. | (the bull is the icon) |
| 3 | Bitcoin coin from assets/logos/BTC.svg | Start with a little Bitcoin | coin, B in white-hot LEDs |
| 4 | Basketball player dribbling (no logos, not a celebrity) | Move fast when the market does | dim speed streaks |
| 5 | Candles breaking a dotted resistance line | It broke out. Did you see it? | full chart; Hotcoin symbol bottom right |

Look: round LEDs on a 12 px grid (14 px for the coin), dot size + brightness from subject luminance
(rank-equalised so dark clothes/skin still read), 6 brightness steps, faint "off" LEDs across the whole
board, two-radius bloom, a few white "hot" LEDs on the highlights. Copy stays crisp (not dotted) with a soft dark halo.

Not for posting as-is: exploration only, nothing scheduled.

## Photo credits (Unsplash, free licence; download tracked via the Unsplash API)
- Concept 1: Victor Puerta, "Man holding a smartphone with a blank screen", https://unsplash.com/photos/eAFjMuPUIYk
- Concept 2 + anim: Hans Eiskonen, "Bull statue", https://unsplash.com/photos/wn57cSQ7VzI
- Concept 4: Eze Joseph, "Young basketball player dribbling a ball on court", https://unsplash.com/photos/Hs8Pzy36qic
- Concept 3 / 5: no photo (BTC.svg and drawn chart).
