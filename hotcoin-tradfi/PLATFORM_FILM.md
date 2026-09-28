# Hotcoin platform film: state list on the beat grid (for approval, no code yet)

**Basics**
- **Length:** 40 s, 120 BPM, 20 bars. Something happens on every beat.
- **Format:** 4:5 (1080x1350). The 9:16 and 1:1 versions reuse the same timeline.
- **Showcase style:** an Apple-style product showcase. A laptop and a phone, both drawn as clean, unbranded device frames, float on a warm-gray canvas. The Hotcoin UI inside them is rebuilt in code from hotcoin.com's own tokens:
  - Font: Roboto, with tabular figures for prices (the site's DINPro is a paid font, so it isn't used).
  - Call-to-action green `#97E763`, text-accent green `#7EC25A`, and red only for price moves.
  - Card radius 24 px, button radius 8 px.
- **One shape, never cut:** each state is the previous element morphing. The cursor on the laptop and a fingertip dot on the phone drive every change.

**Music:** "Your Breath" by Eugenio Mininni, Mixkit (free for commercial use). Measured at **119.98 BPM**; the film uses bars 28 to 48 of the track.
- Film bars 13 to 16 fall on the track's breakdown, which is the quiet middle.
- Film bar 17 falls where the track comes back full, which drives the finale.
- The alternatives, with 40 s previews in `music-previews/`:
  - "Autofahren" (117 BPM, hypnotic deep house)
  - "Hazy After Hours" (121 BPM, lush electronica)

| Bar | Time | Device | The shape becomes | On-screen type (site copy where possible) |
|---|---|---|---|---|
| 1 | 0-2 s | none | The **Trade Now** pill sits alone on the canvas. The cursor clicks and the pill stretches into a screen as the laptop body rises beneath it | none |
| 2 | 2-4 s | Laptop | The Hotcoin **homepage hero** draws in: nav, sign-up field, green CTA | **9 Years of Focus. Built for Traders.** |
| 3-4 | 4-8 s | Laptop | The camera pushes onto the **four asset cards** (Crypto BTC, Stocks TSLA, Precious Metals XAU, ETFs SPY). The cursor hovers each one on the beat and its sparkline draws | **Crypto. Stocks. Metals. ETFs.** (one word per beat) |
| 5 | 8-10 s | Laptop | The ETF card collapses into a USDT pill | **All with stablecoins.** |
| 6-7 | 10-14 s | Laptop | The pill opens into the **BTC/USDT trade screen**: the chart draws itself, a crosshair tooltip rides it, and the Spot/Futures switch flips | **Spot and Futures. One account.** |
| 8 | 14-16 s | Laptop | **Open Long** is pressed → loader → toast "Order placed successfully" | **0 fees on Spot** (only if confirmed, see below) |
| 9 | 16-18 s | Laptop → phone | The toast slides off the laptop and becomes the top of a **phone**, which glides in beside the laptop. The laptop dollies back into a two-device shot | none |
| 10-12 | 18-24 s | Phone | App **Markets**: the Spot / Futures / **TradFi** tabs, with the indicator stretching ahead → tap TradFi → US stocks list (AAPLX, TSLAX, NVDAX) → one row grows into a "From 10 USDT" pill | **US stocks, from 10 USDT.** |
| 13-14 | 24-28 s | Phone (breakdown) | The pill opens into a **Prediction Market** card, "BTC Up or Down · 15m". The finger taps **Up** and the probability bar fills | **Predict the market.** |
| 15-16 | 28-32 s | Phone (breakdown) | The card flips to **"Fed rate hike in 2026?"** and its gauge sweeps. Only neutral markets are shown: no politics, no faces | none, held quiet |
| 17 | 32-34 s | Both (return) | The laptop and phone come back to center. The site's trust stats count up | **8.1M+ users · 120+ countries · since 2017** |
| 18-19 | 34-38 s | Both | Platform chips drop in on the beat: **iOS · Android · Mac · Windows**. Both screens then fold into one green **Trade Now** pill | **Trade anywhere.** |
| 20 | 38-40 s | none | End card: the Hotcoin logo (keyed out of your recording) and hotcoin.com. The last frame matches the first, so it loops | **Built for Traders.** |

## Sound design (music on top, three layers under it)
1. **Interaction foley**, placed on measured transients:
   - Laptop clicks come from the uisfx `mechanical` pack, dry and short.
   - Phone taps get a softer glass-tap variant.
   - Tab switches get a tiny tick.
2. **Motion air:** pitch-free whooshes that follow the camera. Their length matches each move, and their stereo position pans with it (for example, left to right as the phone slides in).
3. **Punctuation:**
   - A soft riser into bar 17, where the music comes back full.
   - A low sub hit under the end card.
   - Under each headline, a whisper of air rather than a click.

**Mix:** the music ducks about 3 dB under the foley for 150 ms at each click, so clicks stay audible without being loud. Target −16 LUFS for social with −1 dBTP peaks. The mix is checked by measurement, and your ears get the final say.

## Before I build
1. **0 fees on Spot:** hotcoin.com's fee page lists 0.2% maker/taker at VIP0, and the only "Fees from 0" I found is on the TradFi page. Send me the source (a campaign, zero-fee pairs, or a new schedule) and I'll show it at bar 8. Otherwise that line becomes "Spot and Futures. One account." and bar 8 plays without text.
2. **Numbers:** prices, the 8.1M+ user count and the country count come from the site today (28 Sep). Tell me if compliance wants neutral prices instead.
3. **Format:** I'm assuming 4:5 first. Say if you want 16:9 for X or YouTube.
4. **Music:** pick one of the three previews. My recommendation is "Your Breath".
