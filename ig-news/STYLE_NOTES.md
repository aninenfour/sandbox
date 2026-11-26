# Style notes (living rules from the daily review)

Every news/tutorial run reads this file and follows it. The daily review (REVIEW.md) adds or updates rules here.
Newest rules win over older ones and over PLAYBOOK.md wording where they conflict on style (not on facts or safety).

## OWNER FEEDBACK, Oct 28 (full revision due Thu Oct 29 morning, then checked every week)
- **News carousels look ugly**: the black background must go, the fonts can be better, slides must be **graphic-led, not text-led**, and must stop looking the same every day.
- **Stats must look modern, like Hotcoin's own X posts: the graphic on top** (big chart/visual first, short text under it). Look at the X account's recent posts in Publer before redesigning.
- **Hooks must be instantly clear.** Bad: "$1,000 since 2020. Who won?" (owner: weird, doesn't understand it, not interesting). A hook names the concrete thing and the payoff in plain words, e.g. "Bitcoin turned $1,000 into $8,648. Gold: $2,572." Read it as a stranger: if it needs the next slide to make sense, rewrite it.
- **Style review every week** (owner: "you seem to forget it"): the Monday learning run must look at our last 7 days of slides next to top accounts and Hotcoin's X posts and ship at least one visual upgrade, with before/after renders.
- Don't touch posts that are already scheduled or published.
- Done Oct 29: news v2 (news2.py) + Academy v2. See PLAYBOOK §4/§6. Before/after: research/2026-W44/style-revision-before-after.jpg.

## OWNER FEEDBACK, Nov 12 (mandatory)
- **No empty space on Academy slides.** We are a visual account: every chapter slide that has room left gets a related photo
  (`"photo"`, `"photo_cap"` on a tslide). The renderer only shows it when there is >= 200 px free.
- **Two Academy layouts, alternate between posts** (`"variant": "a"` or `"b"` in post.json): A = chart, text, photo fills the
  bottom; B = photo header band with the title on it, chart card overlapping. Never two posts in a row with the same variant.
  Pick 3 different related photos per post (Unsplash / Wikimedia), never reuse last week's.
- **Talk like a person, not a press release.** Academy covers can open a question the slides answer ("Alibaba stock: $68, then
  $310, now $103. What happened?"), slide 2 starts the walk-through ("So, let's break it down"). Banned: slogan triplets,
  "Here's the thing", "the X was the product", "paid the owners", words nobody says out loud.
- **Reels: length follows the story.** WHAT IF chart time = ~2.2 s per year (14-60 s), so a 12-year story is ~50 s and a
  20-year one can run 70-90 s. Override with `"chart_secs"` when needed.
- **Reel closing lines: plain spoken sentences**, max ~4 words each, e.g. "SO, GOOD BUY?" / "SELL IN 2020: 3.3x." /
  "HOLD TILL NOW: 1.1x." They now appear word by word and stay (no typewriter, no cursor).
- **Hooks that work in finance short video (Nov 12 scan):** a concrete number, a mistake ("Never buy X without..."), a contrarian
  claim, or a direct question to the viewer. Prefer these over a date + fact line.
- Comment replies: parked by the owner (later).

## WEEKLY LEARNING W46 (Nov 16): visual first, single-thing hooks
- **New slide kind `ngrid` (visual-first photo grid), from the GTA V/VI grid the owner asked for on Nov 14.** 2-4 full-bleed
  real photos fill the slide. Each cell has one green label block ("S&P 500", "1 Bitcoin, Dec 31") and ONE big number. Optional:
  a result pill where the cells meet (`"pill": "506x"`, `"pill_neg": true` for a loss), a short `title` (max ~6 words) and one
  bottom line `text` (max ~12 words). The photo is the slide; the number is the second thing you read. No tables, no paragraphs.
  - 2 cells = then / now (same thing, two dates). 3 cells = the winner big on top + 2 below. 4 cells = 2x2 comparison.
  - Photos: a different real photo per cell (Unsplash / Commons / press), recognisable at thumbnail size (coin, gold bars,
    the exchange floor, the product). Logos only as the small round `logo` in the cell.
  - Before/after: research/2026-W46/before_after.jpg (Nov 12 Academy table vs the same numbers as ngrid).
- **Hook rules from the W46 viral check** (YouTube Shorts scan + our own TikTok numbers):
  1. **Then vs now price of one thing everyone knows** ("1990 vs 2026 McDonald's prices", Mark Tilbury, 14M views; our GTA grid,
     915 TikTok reach, best post of the week). WHAT IF hook = the thing + year + price, then the stock:
     Before: "$10 A MONTH SINCE 2018 / MUSIC OR STOCK?" After: "PS5 IN 2020: $499. / SAME $499 IN SONY?"
  2. **One object, one story, never a subscription.** Single purchases did 113-131 IG reach (PS5, Minecraft, landfill BTC);
     DCA / subscription WHAT IFs did 8-48 (Netflix, Spotify) and the "bought the top" downside one did 29. DCA WHAT IFs are
     retired from the 21:30 slot until a test says otherwise. Show the object close up in the first frame (Diet Coke silver bar
     reveal, humphrey, 1.7M).
  3. **"Ranking X" of things people use** (Graham Stephan: credit cards 2.2M, money books 453K, money habits 284K). For the
     Saturday tier list and Academy: rank familiar products or habits, not only tickers. Cover: "Ranking 6 ways to hold Bitcoin".
- Academy / news covers keep the face + one number + short question pattern ("Binance hacked for $6B?", "$800K bottom?"),
  answered with past data only.

## WEEKLY LEARNING W48 (Nov 23): people first, the joke gets shared
- **Our numbers, Nov 15-22.** Shares came only from jokes: rice vs Bitcoin MEME REACT 6 IG + 12 TikTok shares, the team's
  "Anthropic IPO and GTA 6 on the same day" Reel 5. The Nvidia MEME REACT (a stat, no joke) got 0. WHAT IF Reels got 0-1 shares
  and faded: TikTok 858 (GTX 1080) > 671 > 153 > 130 > 38; IG 322 > 66-129. Faces won the carousels: CZ news IG 81 / TikTok 789,
  Trump Media IG 50, Nvidia IG 41 / TikTok 705 vs 21-27 for Zelle, Fed, Kalshi.
- **New slide kind `nquote` (people-first quote slide).** When the news is what someone said, show the person and their words,
  then the numbers that check them. Before: a white card with 4 emoji rows ("What CZ blames instead"). After: CZ full-bleed,
  bubble "No, Binance did not sell crypto.", band "WHAT THE DATA SAYS: 7 days of ETF outflows / $62K Sunday low".
  Before/after: research/2026-W48/before_after.jpg. PLAYBOOK §4 has the spec and rotation rule.
- **Hooks for next week (W48 viral check: what the most viewed finance shorts opened with):**
  1. **A feeling, then the number** (shock statement: "This is actually starting to scare me. $1.3 trillion erased from the
     Chinese stock market", 636K views, 25 s; shock hooks had the best breakout rate in Virlo's money news sample, 37.5%).
     MEME REACT title = the joke or feeling in 3-5 spoken words + the numbers.
     Before: "NVIDIA SALES +103% / NVIDIA STOCK -35%". After: "MADE A RECORD. / STOCK STILL -35%." (bubble: "Why is my NVDA still red?")
  2. **Put a person in the purchase** (famous face or "you"): "1990 vs 2026 McDonald's prices" (15M, he eats the meal with the
     receipt), our Musk/Twitter cover. WHAT IF hook = who + what they paid, then the stock.
     Before: "BACK IN 2016 / AIR JORDAN 11S $220". After: "YOU PAID $220 / FOR JORDANS IN 2016." / "SAME $220 IN NIKE?"
  3. **"How to" promise in big text on frame 0, no face needed** ("HOW TO: SAVE FOR A $5,000 GOAL", 2.2M, 5 s; "Ranking the
     best credit cards", 2.3M). Academy cover can promise the skill in plain words.
     Before: "Crypto fear hit 10 out of 100. Time to buy?". After: "How to read the fear index in 3 numbers".
  All three: spoken words, no slogans, no em dashes, numbers verified, answered with past data only.

## Hooks (cover headline + caption first line)
- **CLEAR FIRST (owner, Oct 28).** A stranger must understand the cover with no other slide: name the thing + the result/number in plain words. Riddles and teasers that hide the answer are banned.
  - Bad: "$1,000 since 2020. Who won?" · "Is this the end?" · "Robinhood just did something wild"
  - Good: "Bitcoin turned $1,000 into $8,648" · "Robinhood now makes more from prediction markets than from crypto" · "Nvidia: $50 in 2004 is $90,244 today"
  - Test: read it aloud to someone who doesn't trade. If they ask "what?", rewrite.
- Simple words a trader would say out loud. One idea per cover. If it needs a comma, it's too long.
- Lead with the **thing people know** (Bitcoin, Ledger, Russia, BlackRock, a famous name) in line 1 or 2.
- Put a **number** on the cover when there is one ($86M, July 2027, 1 of 45). Numbers stop the scroll.
- The red line is the twist or the stakes, max ~4 words when possible ("and it's not a fix yet", "then it's illegal").
- Each cover line ≤ 22 characters; 4–5 lines total. The big line is 1–3 words.
- Catchy, never false: no "hacked" unless it was a hack, no "banned" unless it is banned, "suspected" stays if the number is unconfirmed.
- Caption line 1 = the cover hook rewritten as one sentence, ending with 👇.
- The closing question must be **easy and personal, answerable in one word or one emoji**: "Bullish or bearish? 🟢/🔴", "Would you hold it? Yes/No", "Which one got you? 1–5". Not abstract ("Can P2P really be shut down?"). Hotcoin's "what's your reason to trade?" got 49 comments on 161 reach; the desk's abstract questions got 0–1.
  - **Review Nov 10: the desk drifted back to abstract questions** ("Should exchanges be held to bank-level rules?", "Who should guard seized crypto?", "Is ETH a store of value like Bitcoin?"): all 0 comments. Before scheduling, rewrite to a one-tap answer: "Would you still use MEXC? Yes/No", "Trust the FBI with your coins? 👍/👎", "ETH: store of value? 🟢/🔴".

- Reels may also hook with a **bold claim plus a number** instead of a list promise ("Bitcoin lost 24% in a year. Apple made 36%."), as long as the number is verified (weekly scan W42: "$140K is the new poor", "Bitcoin won't 100x anymore").

- **Name + number** hooks work across channels (W43 scan: "Arthur Hayes predicts $10K ETH" 6.9x, "Bitcoin's $800K bottom? A Bitcoin exec explains" 31x, "Will Bitcoin hit $150K this year?" 5.9x). Use them only as **reported, attributed** claims from real news ("Arthur Hayes: $10K ETH by year-end?"), never as our own forecast, and say in the slides who said it and why it's uncertain.
- Tier lists: mix **household names across markets** (Apple, NVIDIA, gold, S&P 500 next to Bitcoin/ETH) so viewers argue the ranking. The stocks-vs-crypto 1-year tier list got 43 comments; the crypto-only ATH tier list got 0 (Oct 21 review).
- Reels: mark 1–2 keywords per slide as [yellow] (`[word]` in reel.json); never more than one per line.

Examples (before → better):
- "Ledger's answer to / tampered wallets / is an Android / $849 phone / that ships in 2027" → "Ledger's fix for / $86M wallet drain? / A $849 / PHONE / shipping in 2027"
- "Russia just set / an expiry date on / peer-to-peer crypto / July 1, 2027 / then only licensed rails" → "Russia sets a / deadline for / P2P crypto / JULY 2027 / after that: banks only"

## Visuals
- Cover photo: a face or a recognisable object, cropped tight; no empty sky taking half the photo.
- Max 2 round insets on a cover; never over a face or the main object.
- Text slides: 3–4 short paragraphs, one underline, one green highlight, one red line max.
- No faded background graphics behind body text (they hurt readability).
- Stats tiles only with real numbers worth remembering; never filler like "1 reseller".

- Number + question hooks (W44 trend: "$800K bottom?", "Will Bitcoin hit $150K this year?", "The next Bitcoin crash?" across Cointelegraph, Altcoin Daily, Crypto Casey) are allowed only when the slides answer them with past data, never a forecast of our own.
  Before: "Microsoft: +50% since June". After: "+50% since June. Can Microsoft keep it?", with the slides answering from history (past earnings-week moves, distance to the record).

## Changelog
- 2026-11-27 (daily review): line chart marks (`tslide` visual `line`, `marks`): the label now sits above the line wherever it crosses the label's width, with a white halo, and the right-hand scale no longer repeats a min/max that a mark already names (BTC discount Academy: line through "$15.8K low" plus a stray "$15,787"). extra_templates.py; before/after: research/2026-W48/line_mark_label_before_after.jpg.
- 2026-11-26 (daily review): render.py prints `WARNING slide 1 hook:` when the nhero cover headline has a comma or more than 10 words (existing rules: "a comma = too long", PLAYBOOK §4 <= 10 words). Dividends (Nov 24) and market-holiday (Nov 26) Academy covers both shipped "How to X, in 3 numbers". Fix the copy before scheduling, e.g. "TRADE A MARKET HOLIDAY: 3 NUMBERS". Before/after: research/2026-W48/hook_comma_lint_before_after.jpg.
- 2026-11-25 (daily review): Reels over 59 s get `story_ig.mp4` from story.py (first ~44 s + 0.4 s fade + the last 15 s: reveal, lesson, end card; 58.8 s for Gates) for the 21:35 IG Story; IG rejected the 66.8 s Kindle and 84.4 s Gates Stories. PLAYBOOK §7b. Test: Gates cut checked frame by frame in scratch.
- 2026-11-24 (daily review): line chart (`tslide` visual `line`): the start value is labelled at the first point, not on the right-hand scale under the end value (dividends: grey "$0.56" under "$2.04" read as the 2025 value); a falling line no longer prints the scale min over its end label. extra_templates.py; before/after: research/2026-W48/line_first_label_before_after.jpg.
- 2026-11-23 (weekly learning W48): `nquote` people-first quote slide (news2.py) replaces the white rows card for "what X said" slides; W48 hook rules (feeling then number, a person in the purchase, how-to promise). Before/after: research/2026-W48/before_after.jpg.
- 2026-11-22 (daily review): WHAT IF reveal (lump mode): the price paid is shown as is (no count-up; Costco showed $1.32 -> $1.50, Jordans $219 -> $220 as if the price moved) and the stock counts from what you paid to what it is worth (Jordans: $220 down to $146 in red, Costco $1.50 up to $290). DCA keeps the old count-up. whatif2.js; after: research/2026-W47/whatif_reveal_count_after.jpg.
- 2026-11-19 (daily review): MEME REACT stat row: equal columns with a 64 px gap (`"row_gap"`), and memereact.py shrinks the big values to fit their column, all at one size, so two numbers never read as one ("$115.8B -35%" on the Nvidia cover, "-49% +63%" on rice). Before/after: research/2026-W47/memereact_numbers_before_after.jpg.
- 2026-11-18 (daily review): ngrid cells get `"place": "top"|"bottom"` so the label + number clear a face (the centered block covered SBF's eyes on the Nov 18 Academy grid). PLAYBOOK §4 ngrid. Before/after: research/2026-W47/ngrid_place_before_after.jpg.
- 2026-11-16 (owner: "the new visual for WHAT IF" + "TikTok has no thumbnail"): WHAT IF Reels go photo-first (`"look": "photo"`, default for new ones): 2-photo split cover with big label pills and the number, dimmed photo backdrops on every scene, photo end card with the result pill. Dark photo frames also fix the blank TikTok thumbnails (the light Reels were almost all white). PLAYBOOK §7b/§7c.
- 2026-11-16 (weekly learning W46): `ngrid` visual-first photo grid slide added (news + Academy); WHAT IF slot = single purchases only (DCA retired); then-vs-now and "Ranking X" hook rules.
- 2026-10-31 (daily review): "on this exact day" anniversary hooks win. The team's 1929 Black Tuesday Reel (posted on Oct 29) reached 162 IG / 263 FB, the best of the week. When a story, launch or crash has an anniversary in the next 7 days, post it ON that day and open with "On this exact day in YEAR..." (e.g. Xbox 360 launch Nov 22, PS5 Nov 12, ChatGPT Nov 30, Bitcoin whitepaper Oct 31).
- 2026-10-30 (owner): WHAT IF dots/cards must be instantly readable: brand logos or clean product cut-outs, never dark photo crops.
- 2026-10-29 (owner): covers use real faces of the people behind the story (CEOs, officials, founders) with the company logo badge; place/product photos only when no person fits.
- 2026-10-29 (owner, Kalshi reference): first slide is now `nhero`: full-bleed photo, round logo badge, small BREAKING/TRENDING tag, one big plain statement in condensed caps. Clear objective in one glance.
- 2026-10-29 (owner: "new design is much better"): no source line on slides (sources go in the caption/first comment); automatic collision check in render.py, every WARNING must be fixed before scheduling.
- 2026-10-29 (owner feedback Oct 28): full style revision. News v2: light background, Archivo + Manrope, graphic-first slides with 5 rotating layouts (ncover, nbars, nbig, nrows, nphoto), modern stat cards like Hotcoin's X posts. Academy v2: new fonts, chart on top and enlarged. Hooks must be instantly clear (no riddles). Weekly learning run now has a mandatory visual style review.
- 2026-10-26 (weekly learning W44): tier lists capped at 1 per week (fatigue); number + question hooks answered with past data.
- 2026-10-22 (daily review): tier lists should mix stocks/gold with crypto (comment data).
- 2026-10-19 (daily review): Story tag now matches the post type (Hotcoin News / Hotcoin Academy / This week).
- 2026-10-19 (weekly learning W43): yellow keyword highlight in Reels ([word]); attributed name + number hooks.
- 2026-10-18 (weekly learning W42): tier-list Reel format and persistent title pill added to reel.py; bold-claim-with-number hook allowed for Reels.
- 2026-10-18: closing question must be one-word/emoji answerable (comments data). Tutorial cover subtitle now auto-placed under the title and kept clear of the hero circle (sub_top optional).
- 2026-10-16: initial rules from the first two days (hook simplification, no background graphics behind text, 2x render, CTA end card with live app UI, follow line, Story + Facebook).

- Oct 20 (owner): Reels were too fast to read. Shots now 4–4.5 s with 0.8 s soft fades and the promo card slides up at the end, same length as other shots. Keep text short enough to read twice in one shot. One news post per day only.
