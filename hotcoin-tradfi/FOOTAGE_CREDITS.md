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

## Gold Rush logo film (`src/goldrush/GoldRush.tsx`)
Music: "Head Bang" (Mixkit, free licence). Images are graded and strobed behind the Hotcoin symbol.

- 000.jpg: Pexels photo 5805712 by Wilson Ren
- 001.jpg: Wikimedia Commons, Ocho reales de plata 1759 (reverso).jpg (CC BY-SA 4.0)
- 002.jpg: Pexels photo 25913209 by Orhan Pergel
- 003.jpg: Pexels photo 342946 by Michael Steinberg
- 004.jpg: Pexels photo 8442328 by Zlaťáky.cz
- 005.jpg: Pexels photo 7947742 by RDNE Stock project
- 006.jpg: Pexels photo 19882101 by wutthichai charoenburi
- 007.jpg: Pexels photo 8442325 by Zlaťáky.cz
- 008.jpg: Pexels photo 318820 by Michael Steinberg
- 009.jpg: Pexels photo 36351445 by Andaru Firmansyah
- 010.jpg: Pexels photo 14866072 by Connor Scott McManus
- 011.jpg: Pexels photo 30971750 by Daggash Farhan
- 012.jpg: Wikimedia Commons, Gold Mining dredge at Cripple Creek, Alaska mining cut circa 1942.jpg (Public domain)
- 013.jpg: Pexels photo 16594724 by Rômulo Queiroz
- 014.jpg: Pexels photo 6590651 by Sergei Starostin
- 015.jpg: Pexels photo 30754336 by Wellington Cruz
- 016.jpg: Pexels photo 39494584 by Rafael Minguet Delgado
- 017.jpg: Pexels photo 19613743 by William Warby
- 018.jpg: Pexels photo 10920552 by Currency Universe
- 019.jpg: Wikimedia Commons, MSR-2000-14-140-DM-D.jpg (Public domain)
- 020.jpg: Pexels photo 12685323 by Kübra Aydın
- 021.jpg: Pexels photo 11662018 by Emil Vierhaus
- 022.jpg: Pexels photo 31513716 by Gizemtoş 🕊️
- 023.jpg: Wikimedia Commons, Gold stater. Lydia. ca. 560–546 B.C. The Metropolitan Museum of Art.jpg (CC BY-SA 4.0)
- 024.jpg: Pexels photo 15166497 by Ikrash Muhammad
- 025.jpg: Wikimedia Commons, Mexico Carlos III Pillar Dollar of 8 Reales 1771 (rev).jpg (Public domain)
- 026.jpg: Pexels photo 342950 by Michael Steinberg
- 027.jpg: Pexels photo 33539242 by 3D Render
- 028.jpg: Wikimedia Commons, Lydia - king Kroisos - 560-547 BC - gold stater - foreparts of lion and bull - two quadrata incusa - London BM.jpg (CC BY-SA 4.0)
- 029.jpg: Pexels photo 4480232 by Nothing Ahead
- 030.jpg: Pexels photo 33539240 by 3D Render
- 031.jpg: Pexels photo 5301351 by Naresh Babu
- 032.jpg: Pexels photo 8706581 by Ron Lach
- 033.jpg: Pexels photo 32570273 by Calvin Seng
- 034.jpg: Pexels photo 19266676 by Jason Deines
- 035.jpg: Pexels photo 5980599 by https://kaboompics.com/
- 036.jpg: Pexels photo 4386475 by https://kaboompics.com/
- 037.jpg: Pexels photo 10531120 by Zucker Pop
- 038.jpg: Pexels photo 30795043 by dumitru bumbu
- 039.jpg: Pexels photo 19673920 by William Warby
- 040.jpg: Pexels photo 14976413 by Nikola Tomašić
- 041.jpg: Pexels photo 106152 by Pixabay
- 042.jpg: Pexels photo 29336321 by Sergei Starostin
- 043.jpg: Pexels photo 5980213 by https://kaboompics.com/
- 044.jpg: Pexels photo 9316983 by kevser
- 045.jpg: Pexels photo 29927968 by Magda Ehlers
- 046.jpg: Wikimedia Commons, Electrum trite, Alyattes II, Lydia, 610-560 BC.jpg (CC BY-SA 3.0)
- 047.jpg: Pexels photo 16886248 by Саша Алалыкин
- 048.jpg: Pexels photo 6764554 by Alesia  Kozik
- 049.jpg: Pexels photo 28171523 by Yaşar Başkurt
- 050.jpg: Wikimedia Commons, Photograph of rolling bullion into strips - NARA - 296605.jpg (Public domain)
- 051.jpg: Pexels photo 19590480 by William Warby
- 052.jpg: Pexels photo 7111543 by Tara Winstead
- 053.jpg: Pexels photo 33588626 by Fer ID
- 054.jpg: Pexels photo 19920920 by Berna
- 055.jpg: Pexels photo 16055831 by Robert Lens
- 056.jpg: Pexels photo 64824 by Jeff Weese
- 057.jpg: Pexels photo 16584082 by Shamim Hossain
- 058.jpg: Pexels photo 33145251 by Sóc Năng Động
- 059.jpg: Pexels photo 589038 by david martins
- 060.jpg: Pexels photo 8442352 by Zlaťáky.cz
- 061.jpg: Pexels photo 102152 by Markus Spiske
- 062.jpg: Pexels photo 346547 by Michael Steinberg
- 063.jpg: Pexels photo 8442351 by Zlaťáky.cz
- 064.jpg: Wikimedia Commons, Lydia - king Kroisos - 561-520 BC - gold stater - foreparts of lion and bull - two quadrata incusa - London BM.jpg (CC BY-SA 4.0)
- 065.jpg: Wikimedia Commons, Athens - 200-100 BC - silver tetradrachm - head of Athena - owl - Athens Agora Museum.jpg (CC BY-SA 4.0)
- 066.jpg: Wikimedia Commons, Athens - 300-200 BC - silver tetradrachm - head of Athena - owl - Athens Agora Museum.jpg (CC BY-SA 4.0)
- 067.jpg: Wikimedia Commons, Lydian electrum Lion coins - Flickr - brewbooks.jpg (CC BY-SA 2.0)
- 068.jpg: Pexels photo 11624826 by adrian vieriu
- 069.jpg: Pexels photo 6764687 by Alesia  Kozik
- 070.jpg: Pexels photo 33539235 by 3D Render
- 071.jpg: Wikimedia Commons, Aureus, Auguste, Lyon, btv1b104440369.jpg (CC0)
- 072.jpg: Pexels photo 5912581 by Tima Miroshnichenko
- 073.jpg: Wikimedia Commons, SPANISH PILLAR DOLLAR, PIECE OF EIGHT, CHARLES IV of SPAIN 1803 a - Flickr - woody1778a.jpg (CC BY-SA 2.0)
- 074.jpg: Pexels photo 10628030 by Vito Goričan
- 075.jpg: Pexels photo 20843727 by Ivan Vi
- 076.jpg: Pexels photo 8442429 by Zlaťáky.cz
- 077.jpg: Wikimedia Commons, Chinese Banknote Ming Dynasty CarterInventionPrintingChina 0126.jpg (CC BY-SA 4.0)
- 078.jpg: Pexels photo 8442329 by Zlaťáky.cz
- 079.jpg: Pexels photo 7367861 by Maria Pop
- 080.jpg: Pexels photo 8442324 by Zlaťáky.cz
- 081.jpg: Pexels photo 39353380 by Rafael Minguet Delgado
- 082.jpg: Pexels photo 8442421 by Zlaťáky.cz
- 083.jpg: Pexels photo 12920766 by crazy motions
- 084.jpg: Pexels photo 13695813 by Kris Møklebust
- 085.jpg: Pexels photo 6764682 by Alesia  Kozik
- 086.jpg: Pexels photo 534216 by Pixabay
- 087.jpg: Pexels photo 9539616 by Lukasz Radziejewski
- 088.jpg: Pexels photo 3790639 by Dmitry Demidov
- 089.jpg: Pexels photo 6468225 by Tony Began
- 090.jpg: Pexels photo 35431751 by Tolga deniz Aran

## TOKEN2049 teaser (`src/t49/T49.tsx`, `src/t49/Booth.tsx`)
**Music:** "Deep Urban" (Mixkit, free licence), 124 BPM.

**Clips:** Pexels videos, fetched by `scripts/fetch-t49.mjs`:
- mbsv: 34186550 by Madhu
- mbs: 35061518 by Nirjhar Basak
- bay: 33279610 by Ken Cheung
- city: 32047106 by David Pickup
- stage: 36408715 by Nino Souza
- screens: 19197406 by Nino Souza
- lights: 35451425 by JD MONTORO
- face: 20320583 by Luis Quintero
- audience: 11060088 by Luis Quintero
- expo: 34804768 by Airam Dato-on
- party: 34059053 by WeStarMoney Rec
- concert: 13641378 by Roman Skrypnyk

**Booth:** built in three.js.

**Event facts:** from token2049.com and its Aug 2026 press release. TOKEN2049 appears as text only, with no event logo and no speaker likenesses.

## Hotcoin story film (`src/hist/History.tsx`)
**Music:** "Deep Urban" (Mixkit). **Fonts:** Unbounded, Instrument Serif, JetBrains Mono (OFL).

**Clips:** Pexels videos, fetched by `scripts/fetch-hist.mjs`:
- server: 1085656 by Dima Krivoy
- red: 38736274 by Rafael Minguet Delgado
- screens: 39212846 by Rafael Minguet Delgado
- dubai: 34529274 by Mohammed Resan
- globe: 3129785 by Pressmaster
- arc: 3125427 by Pressmaster
- sgv: 34364038 by Şeyhmus Kino
- mbs: 17715709 by Ray

**Facts and their sources:**
- hotcoin.com
- CoinMarketCap / BitDegree exchange profiles: founded 2017, user base +200% in 2021–22, Dubai EMEA office in Apr 2022, AUSTRAC registration
- TechFlow: TOKEN2049 Dubai 2025, booth M2
- Newsfile, 7 Sep 2026: TradFi launch
