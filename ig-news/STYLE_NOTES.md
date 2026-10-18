# Style notes (living rules from the daily review)

Every news/tutorial run reads this file and follows it. The daily review (REVIEW.md) adds or updates rules here.
Newest rules win over older ones and over PLAYBOOK.md wording where they conflict on style (not on facts or safety).

## Hooks (cover headline + caption first line)
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

## Changelog
- 2026-10-19 (daily review): Story tag now matches the post type (Hotcoin News / Hotcoin Academy / This week).
- 2026-10-19 (weekly learning W43): yellow keyword highlight in Reels ([word]); attributed name + number hooks.
- 2026-10-18 (weekly learning W42): tier-list Reel format and persistent title pill added to reel.py; bold-claim-with-number hook allowed for Reels.
- 2026-10-18: closing question must be one-word/emoji answerable (comments data). Tutorial cover subtitle now auto-placed under the title and kept clear of the hero circle (sub_top optional).
- 2026-10-16: initial rules from the first two days (hook simplification, no background graphics behind text, 2x render, CTA end card with live app UI, follow line, Story + Facebook).
