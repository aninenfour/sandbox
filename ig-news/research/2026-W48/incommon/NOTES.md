# IN COMMON: template test (owner request, Nov 28)

New 21:30 Reel format: "What do X and Y have in common?" parallel-story paper collage with a voiceover, ending on a real
price chart. Renderer: `ig-news/incommon.py` + `ig-news/stories/incommon.js` (Playwright/Chromium, 1080x1920, 30 fps).
How to run it, scene list and rules: PLAYBOOK §7f. Nothing here is scheduled or published.

## Reference study (owner's video, 810x720, 26 s, two 9:16 versions side by side)
- **It uses a voiceover.** Continuous narration (the audio track is the Portuguese version: transcribed with fal
  `elevenlabs/speech-to-text/scribe-v2`: "O que Santos Dumont e os irmãos Wright têm em comum? Os Wright voaram por 12
  segundos e só cinco pessoas viram ..."), about 3 words per second, sentence pauses of 0.3-0.5 s (silencedetect at
  6.4 s and 25.4 s, loudness dips at every sentence end), a quiet music bed under it (steady low tone in the spectrogram).
  Captions are the VO itself, word by word, small at the top of the frame.
- Technique: hook with both people cut out side by side + the question; beats of 1-1.5 s alternating between the two
  stories; solid colour panels (blue) alternating with cream paper; red date stickers ("1995", "1906"); giant numbers
  ("17", "11 DAYS", "5 PESSOAS"); archive photos, a newspaper, a patent drawing, a rubber stamp ("PROCESSADO"), a hand
  writing with a pen; the shared twist in huge type ("SECOND CHANCE"); money ending with a simple dip-then-rise chart
  with % chips; the person cut-out stays next to the chart.
- What we copied: the structure, the pacing, the alternating panels, stickers/stamps/numbers/hand, VO-synced captions.
  What we changed: Hotcoin green + graphite + warm cream paper, Archivo/Manrope type, white-border photo prints with
  tape, torn-paper cards behind the hook cut-outs, a real chart with real data on a paper card, our end card.

## Test episode: Steve Jobs and Winston Churchill (twist: both pushed out, both called back)
Script (VO, 92 words + CTA, ElevenLabs v4 voice "Brian" via fal, ~$0.04):
> What do Steve Jobs and Winston Churchill have in common? In 1985, Apple pushed out its own co-founder. In 1915,
> Churchill was blamed for Gallipoli and lost his Navy job. Jobs stayed away for eleven years. Churchill spent ten years
> out of power. In 1997, Apple lost a billion dollars. In 1940, Hitler invaded France. And both men got called back.
> Churchill became Prime Minister. Jobs ran Apple again. By 1997, Apple stock had lost 82 percent. Since then, it is up
> over three thousand times. / (reel only) Trade stocks and crypto on Hotcoin.

Length: reel 34.7 s (spoken CTA + end card), TikTok / X cut 33.0 s (no CTA). Audio -14 LUFS.

### Facts (two sources each)
| Claim | Sources |
|---|---|
| 1985: Jobs pushed out of Apple (board sided with Sculley, his operating role removed in May; resigned Sep 16-17, 1985) | [Wikipedia: Steve Jobs](https://en.wikipedia.org/wiki/Steve_Jobs); [Fortune, Aug 5 1985 (CNN Money archive)](https://money.cnn.com/magazines/fortune/fortune_archive/1985/08/05/66254/index.htm); [TechRadar, 40 years ago](https://techradar.com/computing/40-years-ago-steve-jobs-was-fired-from-apple-but-it-made-macs-better-than-ever) |
| 1915: Churchill lost the Admiralty (head of the Navy) after the Dardanelles / Gallipoli failure (May 1915, demoted to Duchy of Lancaster) | [History.com: Churchill's World War disaster](https://www.history.com/news/winston-churchills-world-war-disaster); [History Hit: why Churchill resigned in 1915](https://www.historyhit.com/1915-winston-churchill-resigns-government/); [International Churchill Society, Spring 1915](https://winstonchurchill.org/the-life-of-churchill/rising-politician/1910-1919/spring-1915-age-40/) |
| Jobs away 11 years (Sep 1985 to the NeXT deal, Dec 1996 / Feb 1997) | [Wikipedia: Steve Jobs](https://en.wikipedia.org/wiki/Steve_Jobs) ("the deal was finalized in February 1997, bringing Jobs back"); [TidBITS, Sep 22 1997](https://tidbits.com/1997/09/22/jobs-named-interim-ceo-2/) (adviser for several months before interim CEO) |
| Churchill ten years out of office (June 1929 to Sep 1939, the "wilderness years") | [Wikipedia: Churchill's "Wilderness" years, 1929-1939](https://en.wikipedia.org/wiki/Winston_Churchill%27s_%22Wilderness%22_years,_1929%E2%80%931939); [International Churchill Society: the wilderness years](https://winstonchurchill.org/the-life-of-churchill/wilderness-years) |
| Apple lost $1.0 billion in fiscal 1997 (revenue $7.1 billion) | [CNN Money, Oct 15 1997](https://money.cnn.com/1997/10/15/companies/apple/); [Apple Q4 1997 release (MacTech)](https://www.mactech.com/1997/10/15/md1-apple-reports-fourth-fiscal-quarter-results/); [TidBITS](https://tidbits.com/1997/10/16/apple-posts-161-million-fourth-quarter-loss/) |
| 10 May 1940: Germany invaded France and the Low Countries; Churchill became Prime Minister that evening | [International Churchill Society, May 10 1940](https://winstonchurchill.org/the-life-of-churchill/war-leader/churchill-becomes-prime-minister-and-minister-of-defence); [UK National Archives blog](https://blog.nationalarchives.gov.uk/10-may-1940-a-day-to-remember/); [History.com](https://www.history.com/this-day-in-history/may-10/churchill-becomes-prime-minister) |
| Jobs ran Apple again (interim CEO Sep 16 1997) | [Apple release via MacTech](https://www.mactech.com/1997/09/16/md1-jobs-interim-ceo/); [Wikipedia: Steve Jobs](https://en.wikipedia.org/wiki/Steve_Jobs) |
| AAPL -82% (close Apr 2 1991 $0.6496 to Dec 23 1997 $0.1155, split-adjusted; $72.75 to $12.94 before the 2000-2020 splits) and 3,104x since (Nov 27 2026 close $358.54) | Yahoo Finance daily closes (`whatif_b2.closes('AAPL', ...)`); [StatMuse](https://www.statmuse.com/money/ask/apple-stock-lowest-close-in-1997): 1991 high close Apr 2 1991, 1997 low close Dec 23 1997 (same dates, dividend-adjusted -81%); Nasdaq API Nov 25 2026 close $355.58 = Yahoo $355.58. Price only, not dividends. |

### Photos (free licences) and other credits
| File | Source | Licence |
|---|---|---|
| jobs2010_cut.png (hook, split) | [Steve Jobs Headshot 2010.JPG](https://commons.wikimedia.org/wiki/File:Steve_Jobs_Headshot_2010.JPG), Matthew Yohe | CC BY-SA 3.0 (cut-out = adaptation, same licence) |
| jobs84.jpg, jobs84_cut.png | [Steve Jobs and Macintosh computer, January 1984, by Bernard Gotfryd](https://commons.wikimedia.org/wiki/File:Steve_Jobs_and_Macintosh_computer,_January_1984,_by_Bernard_Gotfryd_-_edited.jpg) (Library of Congress) | Public domain |
| ch1940desk.jpg, ch1940_cut.png, ch1940_hook_cut.png | [Winston Churchill As Prime Minister 1940-1945 MH26392](https://commons.wikimedia.org/wiki/File:Winston_Churchill_As_Prime_Minister_1940-1945_MH26392.jpg), Cecil Beaton (IWM) | Public domain |
| ch1929_cut.png | [ChurchillChaplin0001.jpg](https://commons.wikimedia.org/wiki/File:ChurchillChaplin0001.jpg), T. Garrett, 1929 (Churchill only) | Public domain |
| ch1914madrid.jpg | [Lord Winston S. Churchill en Madrid, Nuevo Mundo, 16 April 1914](https://commons.wikimedia.org/wiki/File:Lord_Winston_S._Churchill_en_Madrid,_de_Go%C3%B1i,_Nuevo_Mundo,_16_de_abril_de_1914_.jpg), Francisco Goñi | Public domain |
| gallipoli.jpg | [SS River Clyde at Cape Helles, Gallipoli, 1915](https://commons.wikimedia.org/wiki/File:SS_River_Clyde_at_Cape_Helles,_Gallipoli,_1915.jpg), Ernest Brooks | Public domain |
| infloop.jpg | [Apple 1 Infinite Loop.JPG](https://commons.wikimedia.org/wiki/File:Apple_1_Infinite_Loop.JPG), Nurmib | CC BY 3.0 |
| hand_cut.png | [Unsplash z1ee8rnVqbU](https://unsplash.com/photos/a-person-holding-a-pen-in-their-left-hand-z1ee8rnVqbU), Giorgio Trovato | Unsplash licence |
| AAPL logo | ig-news/assets/logos/AAPL.png (real logo, small, chart header only) | |
| Music | "Curiosity" by Diego Nava (Mixkit, free licence) | Mixkit |
| Voice | ElevenLabs v4 "Brian" via fal (`elevenlabs/tts/eleven-v4`) | synthetic VO |

## Files
- `reel.mp4` (IG/FB Reel, 34.7 s, spoken CTA + end card with Download pill), `story.mp4` (same file), `tiktok.mp4`
  (33.0 s, no CTA line, no pill, no spoken CTA), `story_x45.mp4` (4:5 for X, no CTA), `cover.jpg` (= frame 0),
  `cover_45.jpg`, `thumb_tiktok.jpg`, `contact.jpg` (one frame per 0.5 s), `safezones.jpg`.
- `episode/` = the spec (`incommon.json`), photos and cut-outs, `vo/` (vo.mp3, cta.mp3, word timings).
- Re-render: `python3 ig-news/incommon.py ig-news/research/2026-W48/incommon/episode/incommon.json --out ig-news/research/2026-W48/incommon`

## Weak spots / next steps
- The VO is synthetic (ElevenLabs "Brian"); a warmer or faster voice may test better. Year words ("nineteen
  eighty-five") are slow, so those beats hold ~1.5 s on the date sticker before the rest of the sentence.
- Wikimedia rate-limits this sandbox hard (HTTP 429): use the standard thumbnail sizes (960/1280 px) only.
- rembg cut-outs of old B&W photos can lose heads/hats (u2net_human_seg dropped Churchill's hat): crop tight around
  the person and check the PNG on a coloured background before rendering.
- The hand with the pen covers part of the document while it circles the figure (as in the reference); keep the
  circled figure on the right of the card.
- End card is plain (same family as WHAT IF B2); a variant with both cut-outs could test later.
