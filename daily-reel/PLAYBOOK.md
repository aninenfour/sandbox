# Daily Finance Reel: Playbook

## Locked format
→ 9:16, 1080×1920, 60 fps, about 50 to 58 s in total (voice about 48 to 53 s, then the 2 s lesson hold and the 3 s end card). Running a bit over is fine, the owner is happy with this length.
→ Hook in the first 3 s that promises a payoff
→ Story in 4 numbered steps, each with a "Step N" card (number in brand green). A bridge line right before Step one announces the steps ("So here's how it happened, in four steps.")
→ Visuals: 18 to 22 fresh images per video, a new image on most cuts. Canva first; the shots Canva can't deliver in ~75 min come from Seedream 4 on fal (max 12 per run, owner 2026-11-25, see RUNBOOK step 4)
→ One-line lesson, then a 2 s hold: the whole lesson line stays on screen over the last image so it sinks in (build.py `HOLD_SECONDS`, owner request 2026-11-03), then the Hotcoin logo end card "Follow Hotcoin for more" (3 s)
→ Captions: 1 to 3 words, white with a heavy black outline, key words in brand green #7EC25A
→ Cover (scripts/thumb.sh): zoomed-in scene with the main character's face in the upper half, hook text in the lower third (Hand font, key words green), no logo
→ Sound: free TTS voice, whoosh on cuts, pop on Step cards, quiet Mixkit music bed (rotates daily), mastered to -14 LUFS
→ Post every 3 days (owner, 2026-11-23; was every 2 days) to Instagram Reel, TikTok, Facebook Reel. Same caption, dot keywords (TikTok gets #). Never name the account handle.

## Image style block (paste into every Canva prompt)
"Same illustration style as the reference image. Hand-drawn editorial cartoon in ink with fine crosshatching and textured paper grain. Muted palette of warm sepia, ochre, cream and warm grey, with ONE accent colour: a soft fresh green (like #7EC25A, slightly muted to sit with the ink). Characters are simple stick figures with large round plain white heads, small black dot eyes, expressive eyebrows, rounded egg-shaped bodies, thin black stick arms and legs. The main character wears green (a sweater, coat or vest); background characters wear sepia, brown or grey. Green also appears on one or two props per scene, never everywhere. No red bodies. Vertical composition, main subject in the middle third. No text, no letters, no words, no numbers, no watermark."
→ Style reference media id: MAHZNJ0bV8g (always pass it)
→ Historical figures get period costume in green (green coat, green dress, green waistcoat) and a recognisable but cartoonish trait (wig, hat), never a realistic likeness.

## Voice
→ edge-tts `en-US-AndrewMultilingualNeural`, rate +8%

## Script rules
→ Snappy, spoken, contractions, connectives ("so", "and", "but")
→ Real, checkable facts only; "legend says" for apocryphal bits
→ No price predictions, no "buy X", no first-person brand voice, no em dashes
→ Always a bridge line before "Step one" (a question or "here's how it happened"), never jump straight into Step one

## Posting time
→ No fixed posting time (owner, 2026-11-03). Post whenever the run is ready, but first check Publer for anything already scheduled on Instagram, TikTok or Facebook around that moment and don't collide with it (see RUNBOOK step 6).

## Topic bank (rotate history / crypto / markets / psychology; strike through when used)
→ ~~Newton and the South Sea Bubble~~ (2026-10-27)
→ ~~The Bitcoin pizza~~ (2026-10-27)
→ ~~The 1929 crash in 4 steps~~ (2026-10-29)
→ ~~Satoshi's whitepaper and disappearance~~ (2026-11-01)
→ ~~The man who sold the Eiffel Tower~~ (2026-11-03)
→ ~~The FTX collapse in nine days~~ (2026-11-05)
→ ~~The Mississippi Bubble (John Law)~~ (2026-11-07)
→ ~~James Howells and the landfill bitcoin~~ (2026-11-11)
→ ~~Ronald Read, the janitor with a secret $8 million~~ (2026-11-13)
Sorted by next anniversary (see Learnings: anniversary hooks win). Use the dated one when a posting day lands on or a day after its date; fill the gaps with the evergreen list. Fact-check the date in the run as always.
→ ~~Nov 15, 1923: Weimar hyperinflation ends (Rentenmark introduced)~~ (2026-11-15)
→ ~~Nov 21, 1834: Hetty Green, the witch of Wall Street, is born~~ (2026-11-22)
→ Dec 2, 2001: Enron files for bankruptcy
→ Jan 2009: Zimbabwe's 100 trillion dollar note
→ Jan 28, 2021: GameStop short squeeze peak
→ Feb 1637: Tulip mania collapses
→ Feb 2014: Mt. Gox halts withdrawals and goes bankrupt
→ Mar 20, 1602: The Dutch East India Company, first stock
→ Mar 27, 1980: The Hunt brothers and Silver Thursday
→ Jun 17, 2016: The DAO hack
→ Jun 18, 1815: The Rothschild Waterloo legend (as "legend says")
→ Aug 1920: Ponzi's postage stamps scheme collapses
→ Aug 15, 1971: Nixon ends the gold standard
→ Sep 16, 1992: Black Wednesday
→ Sep 23, 1998: LTCM bailout
→ Evergreen (no fixed date, use between anniversaries; person-led first, crypto + person at the top, see Learnings 2026-11-09 and 2026-11-16):
  → Satoshi's lost coins
  → ~~Kristoffer Koch: $27 of bitcoin bought in 2009, forgotten, found in 2013 worth ~$886k, bought an Oslo apartment~~ (2026-11-24)
  → Gregor MacGregor sells shares in Poyais, a country that didn't exist (1822, scam/psychology, same angle as the Eiffel con)
  → ~~Stefan Thomas and the IronKey: 7,002 BTC behind a password he forgot, 2 guesses left~~ (2026-11-17)
  → ~~Gerald Cotten and QuadrigaCX: the exchange boss who died holding the only keys~~ (2026-11-19)

## Hook bank (first line of every script; rotate types, log the type used)
Adapted for third-person money stories. Never first person, never a price prediction.
→ Curiosity: "Nobody talks about this, but the richest man in history..."
→ Contrarian: "The smartest investor of 1720 was the worst one."
→ Number: "One man turned $100 into $1 billion in a single day. Here's how." (only with a person in the line; number-on-a-company hooks were the 2 worst IG reels, see Learnings 2026-11-09)
→ Story: "In 1636, a single flower cost more than a house."
→ Mistake: "This was the biggest money mistake of the 20th century."
→ Warning: "If you've ever chased a pump, this story is for you."
→ Secret: "Here's what nobody tells you about the 1929 crash."
→ Comparison: "Most people panic-sold. One woman bought everything."
→ Direct callout: "If you're new to crypto, learn this story first."
→ FOMO: "Everyone in London wanted in. That was the problem."
→ Myth-busting: "You don't need to be a genius to beat the market. Newton proved it."
→ Open loop: "He almost gave up, until this happened." (pay it off before the end)
→ Skip: Prediction ("X will change everything"), Proof/Transformation ("I went from X to Y"): first-person or forecast, off-brand for Hotcoin.

## Learnings (updated by the weekly review)
Week of 2026-11-03 (4 reels, small sample, no watch-time data from Publer):
→ Anniversary hooks win. The two "on this day" reels (Satoshi 1,574 views across 3 networks, 1929 914) beat the two evergreen ones (Newton 646, pizza 438), and Satoshi had 4x the next-best IG views despite being the newest. Prefer a topic whose anniversary falls on or within a day of posting, and say the date in the first line.
→ Instagram is where these reels work: Satoshi (1,176) and 1929 (285) were the account's #1 and #2 IG videos of the week, ahead of the Binance-hack news reel (232). On TikTok they sit mid-pack (~330 to 400) behind news and "$X on product vs $X in stock" videos (480 to 2,270).
→ Never post two story reels the same day: the pizza reel went out ~6 h after Newton and reached 7 people on TikTok (vs 330 to 400 for the others).
→ IG reels get likes and saves but almost no comments (0 on all four). The closing question isn't pulling replies yet.

Week of 2026-11-09 (3 reels; Publer still returns no watch time, completion or saves):
→ Hook with a person doing something impossible-sounding, not a number. On Instagram the two breakouts are both "a person + a paradox" first lines: Satoshi ("a stranger sent one email, then vanished", now 1,267 IG views) and the Eiffel Tower con ("a con man sold the Eiffel Tower", 1,206). The two Number hooks are the two worst IG reels so far: FTX ("a $32 billion exchange died in nine days", 146) and pizza (156). Put a named or described person in line one; if a number is the hook, attach it to that person, not to a company or market.
→ Anniversary is a bonus, not the driver (revises last week's learning). The evergreen Eiffel reel matched Satoshi on IG, while the FTX anniversary-week reel was the weakest IG reel of the run. Still use the dated topic when it lands, but between dates pick the strongest person-led story rather than forcing a weak date tie-in.
→ TikTok leans crypto: FTX (668) is the best story reel on TikTok yet and #2 on the account's TikTok that week, behind only the Nvidia console-vs-chip comparison (865); Satoshi 453. History-only reels sit at 220 to 400. Instagram is the opposite: crypto FTX flopped there.
→ Comments are still 0 on every Instagram reel (7 of 7) and 0 on TikTok for these 3; Facebook views fell to 67 to 99 (from ~300 for 1929/pizza). Mississippi got the series' first IG shares (7) within a day.

Week of 2026-11-16 (4 reels; Weimar too new for data; Publer still has no watch time, completion or saves, and no TikTok views, only reach):
→ Crypto + a person wins across all three networks. Howells (landfill bitcoin, "one man threw away 8,000 bitcoin...") was the account's #1 Instagram video of the week (150), its best Facebook video (202) and the best TikTok story reel so far (695 reach, 25 likes), #2 on the account's TikTok behind only the Minecraft "game vs stock" video (720). FTX (crypto, no person) flopped on IG, so it's the person + crypto mix, not crypto alone. Between dated topics, pick crypto person-led stories first (topic bank evergreen list reordered and two added).
→ TikTok story reels are climbing: Howells 695 and Read 604 reach with 20 to 25 likes each, vs 220 to 400 and 0 to 9 likes for earlier history reels. Read (stocks, person + paradox) shows person-led non-crypto works on TikTok too.
→ Instagram reach fell account-wide, not just for stories: every IG video Nov 9 to 16 got 88 to 150 views (vs 1,200 for Satoshi/Eiffel two weeks ago), so the story reels still lead IG. Exception: Read got only 17 IG views (reach 16) after 2.5 days while the same video did 604 on TikTok; looks like an IG distribution problem with that one post, not the story. Watch next week whether it repeats.
→ Slow burners: Mississippi kept growing on IG (375 to 500 views, 8 shares) a week after posting, the series' most-shared IG reel. Contrarian hooks about a person ("the man hired to save France's money ended up breaking it") earn shares.
→ Comments are still 0 on IG and TikTok for every story reel (10 of 10 on IG). Likes and shares move; the closing question doesn't. No change shipped (nothing in the data says what would work yet).
→ No signal from length (51 to 58 s) or music track; the sample is too small and confounded with topic.

Week of 2026-11-23 (4 reels: Weimar, Thomas, Cotten, Hetty; Hetty only ~1.5 days old; Publer still has no watch time or completion, and its IG view count broke from Nov 16, so IG is compared on reach):
→ Person + paradox keeps leading. Best total reach: Thomas (IronKey, "ten guesses, he's already used eight", 814 across 3 networks), the account's #7 of 22 TikTok videos (608) and above every product-vs-stock video posted that week except the Nvidia card (858) and AirPods (671). On Instagram, Weimar ("a German worker got paid twice a day and still couldn't afford bread", 362 reach, 7 likes) was the account's #1 IG post of Nov 15 to 22 by reach, ahead of the Nvidia card video (322); Hetty (282 after 1.5 days) was #3, ahead of the GTA meme (183) and the other product-vs-stock videos (126 to 145). Same pattern as Nov 9 and Nov 16: a number works when it belongs to a person.
→ Bottom: Cotten (QuadrigaCX), 450 total, TikTok reach only 219. But it got 24 TikTok likes (11% of reach, the series' best like rate), so the story landed with the people who saw it; low distribution, not a weak story. Don't drop crypto + person on one reel.
→ Comments are 0 on all 4 again (0 of 13 IG story reels ever, 0 of 10 on TikTok since Nov 1). The account's other posts that end with a two-option choice ("Shoes or Nike stock? 👟/📈", "Would you buy at 10? Yes/No") do get 1 to 2 comments each on IG and TikTok. Change shipped: the closing caption question is now a two-option pick (see RUNBOOK step 2). Check next week whether story reels get any comments.
→ Fewer images didn't hurt: all 4 reels had only 13 to 15 images (Canva quota) vs 18 to 21 before, and Thomas (13) still had the best total reach. Weimar did 337 on TikTok vs 220 to 400 for earlier history reels. No length (52 to 58 s) or music signal.
→ Facebook keeps shrinking for story reels: 13 to 72 views this week vs 82 to 202 the week before. The account's other FB videos are low too (3 to 265), so it's the page, not the format.

## Results log
| Date | Topic | Hook type | Instagram | TikTok | Facebook | IG views | TT views | FB views | Notes |
<!-- Views as of the weekly review (IG/FB = video views, TT = reach, Publer has no TikTok view count). L/C/S = likes/comments/saves; Sh = shares (from 2026-11-09 Publer returns shares, not saves). From 2026-11-23 the IG column is REACH: Publer's IG video_views jumped to a flat 9,300 to 11,300 on every IG video posted from the evening of Nov 16 (story reels, product-vs-stock videos and memes alike, while reach stayed 126 to 322), so that number no longer means anything. -->
|---|---|---|---|---|---|---|---|---|---|
| 2026-10-27 | Newton FOMO (South Sea Bubble) | Curiosity / superlative | https://www.instagram.com/reel/De_t0laFPxt/ | @hotcoin.com | https://www.facebook.com/reel/4635565790054485 | 160 (3L 0C 1S) | 403 (9L 3C) | 83 (0L) | first episode, red bodies (pre-green style); ~48 s; music curiosity (inferred from day rotation); posted 19:09 Beijing |
| 2026-10-27 | Bitcoin pizza (10,000 BTC, 2010) | Number | https://www.instagram.com/reel/DfAVZruDOJM/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/1110473388296151 | 152 (8L 0C 2S) | 7 (1L) | 279 (2L) | second post of the day (first scheduled run); green style, 53.6 s, BTC ~$80k tie-in; music curiosity (inferred); posted 00:55 Beijing, ~6 h after Newton |
| 2026-10-29 | 1929 crash (Black Tuesday anniversary, margin buying) | Story (date) | https://www.instagram.com/reel/DfFei4DCl2y/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/4101410140161216 | 285 (8L 0C 2S) | 335 (5L) | 294 (1L) | posted on the 97th anniversary; 21 images, 51.9 s, cover set; music lofi-01 (inferred); posted 00:51 Beijing |
| 2026-11-01 | Satoshi's whitepaper (18th anniversary, Oct 31 2008) and disappearance | Open loop | https://www.instagram.com/reel/DfNLW5MAkBp/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/1434494208229883 | 1,176 (25L 0C 1S) | 328 (4L) | 70 (1L 1C) | whitepaper turned 18 the day before; 20 images, 54.6 s, cover set; music dreamy-jazz (inferred); posted 00:38 Beijing |
| 2026-11-03 | The man who sold the Eiffel Tower (Victor Lustig, 1925) | Warning | https://www.instagram.com/reel/DfSWLmrk-gR/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/1804114520643768 | 1,206 (14L 0C 0Sh) | 353 (3L) | 72 (0L) | evergreen gap-filler (no anniversary near), psychology/scam angle; 20 images (Canva quota cooldowns, s21 dropped), 53.7 s, cover set; music lofi-02; posted 00:53 Beijing |
| 2026-11-05 | FTX collapse in nine days (4th anniversary week, Nov 2 to 11, 2022) | Number (date) | https://www.instagram.com/reel/DfXexwegDct/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/2377635742996935 | 146 (2L 0C 0Sh) | 668 (8L) | 67 (0L) | trend tie-in to the Binance hack / exchange-trust news; crypto category; 21 images, 58.6 s, cover set (s14 shocked face); music sleepy-cat; posted 00:38 Beijing (Nov 6) |
| 2026-11-07 | The Mississippi Bubble (John Law, 1716 to 1720) | Contrarian | https://www.instagram.com/reel/DfcnXAgjY6X/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/2293992411441617 | 500 (5L 0C 8Sh) | 381 (0L 0C) | 118 (0L) | evergreen gap-filler (Weimar anniversary Nov 15 next), history/markets, ties to the market-down-37% mood; 21 images (s17 regenerated to remove an anachronistic Eiffel Tower), 56.2 s, cover set (s01 Law face); music sweet-september; posted 00:36 Beijing (Nov 8) |
| 2026-11-11 | James Howells and the landfill bitcoin (8,000 BTC, 2013 to 2025) | Curiosity (person + paradox) | https://www.instagram.com/reel/Dfm7okxmcof/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/1410957558769903 | 150 (4L 0C 0Sh) | 695 (25L 0C) | 202 (0L) | evergreen gap-filler (Weimar anniversary Nov 15 next), crypto + person per 2026-11-09 learning; value at BTC ~$74k (CoinGecko, Nov 11); 21 images, 51.0 s, cover set (s13 shocked face); music lofi-02; posted 00:45 Beijing (Nov 12) |
| 2026-11-13 | Ronald Read, the Vermont janitor with a secret $8 million (died 2014) | Story (person + paradox) | https://www.instagram.com/reel/DfsKSpVCS7l/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/2240434066502230 | 17 (2L 0C 0Sh) | 604 (20L 0C) | 82 (0L) | evergreen gap-filler (Weimar anniversary Nov 15 is next run), psychology/markets, person-led, patience angle for the -37% drawdown mood; 18 images (heavy Canva quota cooldowns; reused the Nov 11 scratch design for export), 54.3 s, cover set (s01 face); music sleepy-cat; posted 01:23 Beijing (Nov 14) |
| 2026-11-15 | Weimar hyperinflation ends (Rentenmark, Nov 15 to 16, 1923), told through a worker paid twice a day | Curiosity (person + paradox, date) | https://www.instagram.com/reel/DfxW9XBkqkD/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/1760307168406433 | 362 reach, 425 views (7L 0C 0Sh) | 337 (8L 0C) | 13 (0L) | anniversary run (103rd), history/markets; only 13 images (Canva quota cooldown allowed ~1 image per 10 to 15 min; heavier close-crop reuse, 30 scenes); reused the Nov 11 scratch design for export; 58.2 s, cover set (s06 face); music sweet-september; posted 01:50 Beijing (Nov 16); filled at the 2026-11-23 review |
| 2026-11-17 | Stefan Thomas and the IronKey (7,002 BTC, 2 of 10 password guesses left) | Number (person + paradox) | https://www.instagram.com/reel/Df2quQAk6QS/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/4667300033553762 | 145 reach (4L 0C 0Sh) | 608 (11L 0C) | 61 (0L) | evergreen gap-filler (Hetty Green anniversary Nov 21 is 4 days out), crypto + person per 2026-11-16 learning; value at BTC ~$64.2k (Binance, Nov 17): ~$450M; only 13 images (Canva quota cooldown again, ~1 image per 15 min; heavier close-crop reuse, 28 scenes); edge-tts dropped the full-script request repeatedly, so the voice was made line by line and joined; reused the Nov 11 scratch design for export; 54.2 s, cover set (s08 face); music dreamy-jazz; posted 03:18 Beijing (Nov 18) |
| 2026-11-19 | Gerald Cotten and QuadrigaCX (died Dec 2018 holding the only wallet passwords; ~US$190M owed to ~115,000 customers; cold wallets empty since Apr 2018; OSC called it fraud, 2020) | Curiosity (person + paradox) | https://www.instagram.com/reel/Df7zIw8gGsE/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/1834090164502273 | 174 reach (2L 0C 0Sh) | 219 (24L 0C) | 57 (0L) | evergreen gap-filler (Hetty Green anniversary Nov 21 is next run), crypto + person per 2026-11-16 learning; 15 images (Canva quota cooldown, ~1 image per 10 to 15 min over ~3 h; close-crop reuse, 28 scenes); edge-tts dropped full-script and some single-line requests, so voice made line by line with retries; reused the Nov 11 scratch design for export; 57.4 s, cover set (s01 face); music lofi-02; posted 03:15 Beijing (Nov 20) |
| 2026-11-22 | Hetty Green, the Witch of Wall Street (born Nov 21, 1834; lent NYC $1.1M in the 1907 panic; died 1916 worth $100M+) | Comparison (person + paradox, date) | https://www.instagram.com/reel/DgA7Io1Dnqn/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/1685097989955704 | 282 reach (2L 0C 0Sh) | 72 (2L 0C) | 72 (0L) | anniversary run (192nd birthday was the day before), history/markets, person-led, cash-in-a-panic angle for the fear-index-12 mood; 14 images (Canva quota cooldown, ~1 image per 10 to 15 min over ~2.5 h; close-crop reuse, 26 scenes); edge-tts dropped the full script and some lines ("Her name was Hetty Green." failed every time, reworded to "Her name? Hetty Green,"), so voice made line by line with retries; reused the Nov 11 scratch design for export (pages 67 to 80); 52.1 s, cover set (s01 face); music slow-walk; posted 03:01 Beijing (Nov 22); only ~1.5 days old at the 2026-11-23 review |
| 2026-11-24 | Kristoffer Koch's forgotten $27 of bitcoin (5,000 BTC for NOK 150 in 2009 while writing an encryption thesis; April 2013 news reminded him; a full day to recall the password; ~$886,000; sold one fifth, bought an Oslo apartment) | Story (person + paradox) | https://www.instagram.com/reel/DgI14HHGRqw/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/1485126536891806 | | | | evergreen gap-filler (Enron Dec 2 is next dated topic), crypto + person per 2026-11-16 learning, patience angle for the BTC ~$60k drawdown mood; facts from PBS NewsHour (Oct 29, 2013), CoinDesk and SCMP; only 9 images (Canva quota cooldown plus ~50% SERVER_GENERIC failures over ~4.5 h: 9 of 19 jobs succeeded; heavier close-crop reuse, 30 scenes); edge-tts dropped the full script, voice made line by line and joined; reused the Nov 11 scratch design for export (pages 81 to 89); 53.6 s, cover set (s15 shocked face); music dreamy-jazz; posted 04:50 Beijing (Nov 25) |
