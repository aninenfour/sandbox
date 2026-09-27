# Hotcoin TradFi short: beat map (v2, as built)

- 120 BPM at 60 fps, so one beat = 30 frames = 0.5 s.
- The film is 1110 frames (18.5 s).
- Text stays inside y 250 to 1500 on 1080x1920.
- Scene changes are shape morphs or cuts on the beat. There are no fades.

**The thread:** each scene is built out of the one before it:
- A click dot opens into the skyline card.
- The USDT pill floods the frame with ink.
- The ink contracts into the app window.
- The camera zooms through into the order panel.
- The real **Open Long** button floods the frame green.
- The green contracts into the "0" of "10".
- The "0" shrinks to a dot, which floods the frame with ink for the end card.

| Frames | Time | Beat | What happens | Text on screen (hold) | SFX (uisfx `studio`) |
|---|---|---|---|---|---|
| 0-30 | 0.0-0.5 | 1 | The cursor enters from the bottom right and clicks the center of the paper | none | press |
| 30-90 | 0.5-1.5 | 2-3 | A green dot pops, stretches into a pill, then opens into a card. The **Pexels night skyline** plays inside it behind a circular hard-edge mask | **Trade** | expand, select |
| 90-150 | 1.5-2.5 | 4-5 | The ticker slot and the green **USDT** pill pop in | **Trade AAPL with USDT** (1.0 s) | select, toggle-on |
| 140-250 | 2.3-4.2 | 5-8 | The cursor grabs the card and drags it like a wheel. The ticker rolls on each beat with overshoot | NVDA, TSLA, GOLD, **ETFs** (1.0 s). The full sentence is on screen for 3.2 s | drag-start, seek x4, drop |
| 270-300 | 4.5-5.0 | 10 | The cursor clicks USDT. The pill turns ink and floods the frame | none | press, swipe |
| 300-330 | 5.0-5.5 | 11 | The ink contracts into a rounded window showing the **real Hotcoin recording** | none | collapse |
| 330-420 | 5.5-7.0 | 12-14 | Screen-studio zoom onto the real Futures (1) / Spot (0) tabs and the Stocks category | **Spot and Futures.** (1.5 s) | select |
| 420-510 | 7.0-8.5 | 15-17 | The recording types **AAPLX**. The camera follows the search box, then the Apple / Stocks result | **One account.** (1.5 s) | select |
| 510-600 | 8.5-10.0 | 18-20 | The recording's cursor clicks AAPLX/USDT. The camera lands on the pair header (Apple, Stock, Market Open), then zooms through | **No moving funds.** (1.5 s) | select, swipe |
| 600-690 | 10.0-11.5 | 21-23 | Coming out of the zoom: the order panel (Avail 58,030.71 USDT), then a pan down to **Open Long** | **No separate fiat account.** (1.9 s) | select |
| 690-720 | 11.5-12.0 | 24 | The cursor presses the real Open Long button. The button grows to fill the frame as it shifts from UI green to brand green | none | press, expand |
| 720-930 | 12.0-15.5 | 25-31 | The green contracts into a stadium-shaped "0", its hole opens, and **1** lands beside it | **From 10 USDT** (2.2 s). Footnote: *on selected TradFi products* | collapse, snap, select |
| 930-990 | 15.5-16.5 | 32-33 | The text drops out and the 0 closes into a dot. The cursor clicks the dot, which turns ink and floods the frame | none | collapse, press, expand |
| 990-1110 | 16.5-18.5 | 34-37 | End card: the Hotcoin logo (keyed out of the recording, not redrawn) wipes in, then the URL and a green underline pill. The cursor parks | **hotcoin.com/en_US/tradFi** (1.8 s) | success |

## Sources
- **UI:** `09164a41-hero-pc-en.mp4` (the Hotcoin screen recording). The film uses 1.25 to 6.25 s and 10.6 to 12.8 s.
- **Plate:** Pexels 29025308, night aerial skyline by JeetsVids. `npm run fetch-plates` downloads it with `PEXELS_API_KEY` from the environment.
- **SFX:** uisfx 0.4.0, `studio` pack (CC0). `npm run sfx` copies it into `public/sfx`.
- **Music:** still needed. Pixabay Music refuses requests from this environment (403).

## 1:1 version
Same timeline and audio. `layoutFor()` holds a separate square layout: type on the left, and the card and app window on the right.
