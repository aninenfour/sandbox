# Footage and music in the v2 "Launch" film

All footage is pulled by script, never hand-downloaded; the files themselves are git-ignored.

| Clip | Source | Licence |
|---|---|---|
| Saturn V ignition, liftoff, ascent + launch audio | NASA, "Ultimate Saturn V Launch w Enhanced Sound" (images.nasa.gov) | NASA media, public domain (no endorsement implied) |
| Apollo 11 on the pad, 16 Jul 1969 | NASA, KSC_69-71212 | NASA media, public domain |
| "Work of the Stock Exchange" (1941): calendar, ticker board | Internet Archive, Prelinger collection 0552 | Prelinger Archives, public domain; confirm before paid media |
| New York Stock Exchange trading floor, 1960s | Internet Archive, Prelinger collection 0803 "Vista Stock Shots" | Prelinger Archives; confirm licence before paid media |
| Coin spinning (30882814), molten gold fire (33938968), city night (10433645), crucible (30342459), wildfire (7533265), flames (5485149) | Pexels | Pexels licence, free for commercial use |
| Lightning (28067), cash counter (59138) | Pixabay | Pixabay content licence |
| Countdown voice, "ignition sequence start … liftoff, we have a liftoff" | NASA, Apollo 11 launch film with Jack King (Apollo launch control) narration, KSC 16 Jul 1969 | NASA media, public domain |
| Music: "Rising Forest" by Diego Nava | Mixkit | Mixkit free licence |
| Clicks/ticks | uisfx `mechanical` | CC0 |

Scripts: `scripts/fetch-v2.mjs` (Pexels and Pixabay, keys from the environment). The NASA and Internet Archive clips come from their public APIs (images-api.nasa.gov, archive.org/metadata).

## Memecoin history film (`src/meme/Meme.tsx`)
**Coin logos:** downloaded from CoinGecko (coin-images.coingecko.com) by `scripts/fetch-logos.mjs` into `public/meme/logos/` (gitignored). For each ticker the script takes the best-ranked CoinGecko coin with an exact symbol match. The logos are trademarks of their respective projects and are shown only to identify each coin.

**Music:** "Head Bang" by Arulo (Mixkit, free license), 148 BPM. The film starts at track bar 12, so the track's drop lands on film beat 16 (the 2021 peak).

**Everything else** is drawn in code: the white timeline, the green line, type, and the colour seasons. There's no stock footage and no real people.

## Uptober explainer (`src/uptober/Uptober.tsx`)
**Narration:** Kokoro TTS v1.0 (open-source, Apache 2.0), voice `af_heart`, made by `scripts/make-vo.py`.

**Music:** "Curiosity" (Mixkit, free licence, assets.mixkit.co/music/480).

**Data:** Coin Metrics community API, BTC daily reference rate (PriceUSD). Monthly return = month-end close vs the previous month-end close, Jan 2013 to Sep 2026.

**Photos:** Pexels, turned into halftones by `scripts/halftone.py`.
- y2013: 37732199 by SHOX ART
- y2017: 7156480 by Gustavo Fring
- y2019: 25020077 by JC Terry
- y2020: 4199524 by Jack Sparrow
- y2021: 28962712 by Vincent Rivaud
- y2023: 15914821 by carcdann
- y2025: 33587048 by thorl5

**Headlines:** paraphrased from contemporary reports and shown with their source and date:
- Silk Road seizure (2 Oct 2013)
- CME Group press release (31 Oct 2017)
- Xi's blockchain remarks (25 Oct 2019)
- PayPal (Reuters, 21 Oct 2020)
- ProShares BITO debut (19 Oct 2021)
- BlackRock's fund on the DTCC list (Oct 2023)
- The 10 Oct 2025 liquidations
