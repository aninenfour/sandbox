# Hotcoin TradFi short: beat map (v4, 4:5 feed first)

- **Formats:** 4:5 (1080x1350) is the lead. 9:16 and 1:1 share the timeline and have their own layouts in `layoutFor()`.
- **Timing:** 60 fps, 120 BPM, so one beat = 30 frames. The film is 1190 frames (19.8 s).
- **Look:** a dark stage with soft top light and film grain. Pexels media are graded like film. The depth comes from 3D cards, a floating window and a spinning coin.
- **Transitions:** every scene is built from the previous one by a shape morph or a cut on the beat. There are no fades.

| Frames | Time | What happens | Text on screen | SFX (uisfx `studio`) |
|---|---|---|---|---|
| 0-60 | 0.0-1.0 | **Car in night rain** (Pexels video). The cursor clicks, a green dot pops and opens into a card | **Trade** | press, expand, select |
| 60-250 | 1.0-4.2 | A 3D stack of film photo cards: AAPL (cash), NVDA (circuit board), TSLA (headlights in fog), GOLD (bars), ETFs (stock board). The cursor drags and a card flips up on each beat | **Trade [ticker] with USDT** (the full line stays for 3 s) | toggle-on, drag-start, seek x4, drop |
| 250-280 | 4.2-4.7 | The cursor clicks the USDT pill. It turns ink and floods the frame | none | press, swipe |
| 280-400 | 4.7-6.7 | The ink contracts into a wide window showing the **real hotcoin.com TradFi asset tabs**. The cursor clicks **Metal** (the Gold and Silver cards appear), then **ETF** (the ETF cards appear) | The site's own heading: "Trade the World's Leading Futures" | collapse, press, press |
| 384-400 | 6.4-6.7 | Zoom through the ETF tab. The window stretches into the app window | none | swipe |
| 400-700 | 6.7-11.7 | The **real app recording** floats in 3D: Futures/Spot tabs, typing AAPLX, the Apple Stock row, the pair header | **Spot and Futures.** / **One account.** / **No moving funds.** (1.5 s each) | select x3, swipe |
| 700-790 | 11.7-13.2 | Zoom through to the order panel (Avail USDT). The window turns to face the camera | **No separate fiat account.** (1.9 s) | select |
| 790-820 | 13.2-13.7 | The cursor presses the real **Open Long** button, which floods the frame green | none | press, expand |
| 820-1030 | 13.7-17.2 | The green contracts into a **3D coin** stamped "10 USDT" that spins in over the coins photo | **From 10 USDT** (2.2 s). Footnote: *on selected TradFi products* | collapse, reward, select |
| 1030-1090 | 17.2-18.2 | The coin turns edge-on into a bar. The cursor clicks it and ink floods the frame | none | collapse, press, expand |
| 1090-1190 | 18.2-19.8 | End card: the Hotcoin logo (keyed out of the recording) and the URL | **hotcoin.com/en_US/tradFi** (1.4 s) | success |

## Sources
- **App UI:** the Hotcoin screen recording (`public/rec/hero.mp4`). Frames are only cropped and zoomed.
- **Website UI:** hotcoin.com/en_US/tradFi, captured at 3x by `scripts/capture-site.cjs` into `public/site`.
- **Pexels:** `npm run fetch-plates` downloads the media using `PEXELS_API_KEY` from the environment. Credits are written to `public/photos/credits.json`.
  - Road video 13643100 (Erik Mclean).
  - Photos:
    - 6266516 (Tima Miroshnichenko)
    - 2182863 (TimSon Foox)
    - 17245109 (Erik Mclean)
    - 33539242 (3D Render)
    - 36790143 (Bor Jinson)
    - 39076662 (NEW VISION PRODUCTION)
    - 5805712 (Wilson Ren)
- **SFX:** uisfx 0.4.0 `studio` pack (CC0).
- **Music:** still needed. Pixabay Music refuses requests from this environment.
