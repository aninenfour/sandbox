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
All via the Pexels license (free for commercial use). Fetched by `scripts/fetch-meme.mjs` into `public/meme/` (gitignored).

**Photos**
- doge: 35526496 by Moonther Aga
- shib: 39402606 by Chris F
- shades (cut out): 4588005 by Anna Shvets
- wif (cut out): 4588052 by Anna Shvets
- floki: 11938539 by William Sutherland
- frog: 6780339 by Petr Ganaj
- popcat: 39877645 by Buğra Yavaş
- pnut: 36387021 by DANNIEL CORBIT
- moodeng: 37121730 by Magda Ehlers
- goat: 28607441 by Christina & Peter
- malinois: 30211148 by Diana
- toshi: 29020872 by Bar zy

**Videos**
- laser: 35323935 by setengah lima sore
- fireworks: 10228856 by R Λ F O
- candles: 38182555 by Damir K
- slots: 9807887 by Petkevich Evgeniy

**Music:** "Head Bang" by Arulo (Mixkit, free license), 148 BPM. The film starts at track bar 12, so the track's drop lands on film beat 16.

**Rights:** coins appear as ticker text only. There are no meme artworks, coin logos or real people. The two cutouts were made with a white-background key in Python.
