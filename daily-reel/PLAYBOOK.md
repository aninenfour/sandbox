# Daily Finance Reel: Playbook

## Locked format
→ 9:16, 1080×1920, 60 fps, about 50 to 58 s in total (voice about 48 to 53 s, then the 2 s lesson hold and the 3 s end card). Running a bit over is fine, the owner is happy with this length.
→ Hook in the first 3 s that promises a payoff
→ Story in 4 numbered steps, each with a "Step N" card (number in brand green). A bridge line right before Step one announces the steps ("So here's how it happened, in four steps.")
→ Visuals: 18 to 22 fresh images per video, a new image on most cuts
→ One-line lesson, then a 2 s hold: the whole lesson line stays on screen over the last image so it sinks in (build.py `HOLD_SECONDS`, owner request 2026-11-03), then the Hotcoin logo end card "Follow Hotcoin for more" (3 s)
→ Captions: 1 to 3 words, white with a heavy black outline, key words in brand green #7EC25A
→ Cover (scripts/thumb.sh): zoomed-in scene with the main character's face in the upper half, hook text in the lower third (Hand font, key words green), no logo
→ Sound: free TTS voice, whoosh on cuts, pop on Step cards, quiet Mixkit music bed (rotates daily), mastered to -14 LUFS
→ Post every 2 days to Instagram Reel, TikTok, Facebook Reel. Same caption, dot keywords (TikTok gets #). Never name the account handle.

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
Sorted by next anniversary (see Learnings: anniversary hooks win). Use the dated one when a posting day lands on or a day after its date; fill the gaps with the evergreen list. Fact-check the date in the run as always.
→ Nov 15, 1923: Weimar hyperinflation ends (Rentenmark introduced)
→ Nov 21, 1834: Hetty Green, the witch of Wall Street, is born
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
→ Evergreen (no fixed date, use between anniversaries): The Mississippi Bubble · Satoshi's lost coins

## Hook bank (first line of every script; rotate types, log the type used)
Adapted for third-person money stories. Never first person, never a price prediction.
→ Curiosity: "Nobody talks about this, but the richest man in history..."
→ Contrarian: "The smartest investor of 1720 was the worst one."
→ Number: "One man turned $100 into $1 billion in a single day. Here's how."
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

## Results log
| Date | Topic | Hook type | Instagram | TikTok | Facebook | IG views | TT views | FB views | Notes |
<!-- Views as of the weekly review (IG/FB = video views, TT = reach, Publer has no TikTok view count). L/C/S = likes/comments/saves. -->
|---|---|---|---|---|---|---|---|---|---|
| 2026-10-27 | Newton FOMO (South Sea Bubble) | Curiosity / superlative | https://www.instagram.com/reel/De_t0laFPxt/ | @hotcoin.com | https://www.facebook.com/reel/4635565790054485 | 160 (3L 0C 1S) | 403 (9L 3C) | 83 (0L) | first episode, red bodies (pre-green style); ~48 s; music curiosity (inferred from day rotation); posted 19:09 Beijing |
| 2026-10-27 | Bitcoin pizza (10,000 BTC, 2010) | Number | https://www.instagram.com/reel/DfAVZruDOJM/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/1110473388296151 | 152 (8L 0C 2S) | 7 (1L) | 279 (2L) | second post of the day (first scheduled run); green style, 53.6 s, BTC ~$80k tie-in; music curiosity (inferred); posted 00:55 Beijing, ~6 h after Newton |
| 2026-10-29 | 1929 crash (Black Tuesday anniversary, margin buying) | Story (date) | https://www.instagram.com/reel/DfFei4DCl2y/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/4101410140161216 | 285 (8L 0C 2S) | 335 (5L) | 294 (1L) | posted on the 97th anniversary; 21 images, 51.9 s, cover set; music lofi-01 (inferred); posted 00:51 Beijing |
| 2026-11-01 | Satoshi's whitepaper (18th anniversary, Oct 31 2008) and disappearance | Open loop | https://www.instagram.com/reel/DfNLW5MAkBp/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/1434494208229883 | 1,176 (25L 0C 1S) | 328 (4L) | 70 (1L 1C) | whitepaper turned 18 the day before; 20 images, 54.6 s, cover set; music dreamy-jazz (inferred); posted 00:38 Beijing |
| 2026-11-03 | The man who sold the Eiffel Tower (Victor Lustig, 1925) | Warning | https://www.instagram.com/reel/DfSWLmrk-gR/ | @hotcoin.com (published, no link returned) | https://www.facebook.com/reel/1804114520643768 | | | | evergreen gap-filler (no anniversary near), psychology/scam angle; 20 images (Canva quota cooldowns, s21 dropped), 53.7 s, cover set; music lofi-02; posted 00:53 Beijing |
