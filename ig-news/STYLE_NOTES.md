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
