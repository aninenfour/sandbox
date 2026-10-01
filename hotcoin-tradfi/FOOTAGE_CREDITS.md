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
