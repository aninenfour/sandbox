# Hotcoin TradFi short: beat map (draft v1, 9:16 master)

120 BPM = 1 beat every 0.5 s = 30 frames at 60 fps. The film is 18.0 s long: 36 beats, 9 bars, 1080 frames.
On-screen text stays inside y 250 to 1500 on 1080x1920. Every change is a cut on the beat or a morph. There are no fades.

**The thread:** one green shape runs through the whole film. It starts as a click dot, becomes the USDT pill, then the
Spot/Futures toggle, then the "0" in "10", then the real **Trade Now** button in the recording, and finally floods the frame into the end card.

| Bar | Beat | Time | Cursor / camera | Shape morph | On-screen text (hold) | SFX |
|---|---|---|---|---|---|---|
| 1 | 1 | 0.0 | Cursor enters from bottom right and clicks the center of an ink frame | A green dot pops in (spring) | none | click |
| | 2 | 0.5 | none | The dot stretches into a pill, then into a tall rounded window. **Pexels plate 1** (night skyline) plays inside it with a hard edge | none | morph |
| | 3 | 1.0 | The window snaps to full bleed. Slow push-in | none | **Trade** (paper, Archivo Black) | pop |
| | 4 | 1.5 | none | A ticker slot opens between the words | **Trade TSLA with USDT** (USDT in green) | pop |
| 2 | 5 | 2.0 | The cursor grabs the slot and drags it up like a wheel | none | TSLA holds 1.0 s | tick |
| | 6 | 2.5 | Drag continues | The slot rolls | **NVDA** | tick |
| | 7 | 3.0 | Drag continues | The slot rolls | **AAPL** | tick |
| | 8 | 3.5 | Drag continues | The slot rolls | **GOLD** | tick |
| 3 | 9 | 4.0 | The cursor releases | The slot settles with an overshoot | **ETFs** (holds 1.0 s, full line on screen 3.0 s) | tick + pop |
| | 10 | 4.5 | The cursor clicks **USDT** | The USDT word swells into a solid green pill | none | click |
| | 11 | 5.0 | none | Ink floods out from behind the pill and covers the skyline | none | morph |
| | 12 | 5.5 | Screen Studio zoom into the recording's market list | The ink contracts into a rounded app window that holds the **real Hotcoin recording** | none | morph |
| 4 | 13 | 6.0 | The cursor moves to the recording's real **Stocks** tab and clicks | none | **Spot** (big type above the UI) | click |
| | 14 | 6.5 | Camera eases onto the price rows (XAU/USDT is in the list) | none | Spot holds 1.0 s | none |
| | 15 | 7.0 | The cursor clicks the segmented control (the recording's Basic / Trading switch) | The green pill knob slides across | **Futures** | click + slide |
| | 16 | 7.5 | Camera pulls back slightly | none | Futures holds 1.0 s | none |
| 5 | 17 | 8.0 | none | The two-part toggle collapses into a single rounded square | **One account.** | morph |
| | 18-20 | 8.5 | The camera zooms out of the recording and the app window shrinks into that square | none | One account. holds 2.0 s | none |
| 6 | 21 | 10.0 | The cursor drags a transfer arrow between two cards. The arrow snaps back (red) | The two cards merge into one | **No moving funds.** (1.0 s) | drag + snap |
| | 23 | 11.0 | The cursor presses the card | The card flattens into a green coin | **No separate fiat account.** (1.0 s) | press |
| 7 | 25 | 12.0 | The cursor clicks the coin | The coin becomes the "0" of a giant **10**. **Pexels plate 2** (a hand holding a phone) is masked inside the 0 | **From 10 USDT** | click + pop |
| | 26-28 | 12.5 | Slow push-in | none | Holds 2.0 s. Footnote in Plex Mono: *on selected TradFi products* | none |
| 8 | 29 | 14.0 | Match cut: the 0 becomes the **real Trade Now button** in the recording. Camera zooms out to show the chart | none | none | morph |
| | 30 | 14.5 | The cursor presses Trade Now (visible press-in) | none | none | click |
| | 31 | 15.0 | none | The button floods the frame green | none | morph |
| | 32 | 15.5 | none | The green contracts into a centered bar | none | morph |
| 9 | 33 | 16.0 | none | The bar splits and reveals the end card on ink | **Hotcoin logo** (cropped from the recording, never redrawn) | pop |
| | 34-36 | 16.5 | Cursor parks | none | **hotcoin.com/en_US/tradFi** (Plex Mono) holds 2.0 s | final hit |

## The 4 proposed stills
1. **Beat 4 (1.5 s):** "Trade TSLA with USDT" over the skyline plate, with the cursor on the slot.
2. **Beat 13 (6.0 s):** the zoomed real recording, the cursor clicking Stocks, and "Spot" above it.
3. **Beat 26 (12.5 s):** a giant "From 10 USDT" with the phone plate inside the 0 and the footnote.
4. **Beat 34 (17.0 s):** the end card with the logo crop and the URL.

## 1:1 version
Same timeline and audio. The type is re-laid out for 1080x1080, the recording window becomes landscape, and the plates are re-cropped.

## Pexels plates (candidates found with the API, portrait and license-free)
- Plate 1, night skyline: pexels.com/video/dynamic-night-aerial-view-of-city-skyline-29025308 (2160x3840)
- Plate 2, hand and phone: pexels.com/video/a-person-touching-a-cellphone-screen-7247828 (1080x1920). Only the hand and phone show inside the 0, so no third-party app UI reads on screen.

## Sound
One uisfx style pack for every event: click, tick, pop, morph, slide, press, drag, snap, final hit. The music is a 120 BPM track aligned so that beat 1 lands on frame 0.
