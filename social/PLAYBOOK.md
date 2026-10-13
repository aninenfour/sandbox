# Hotcoin text-post playbook (Publer)

Working rules for drafting and scheduling Hotcoin's text-only social posts through the
Publer connector. Read this before cooking a new batch.

## Defaults

- **Workspace:** `hotcoin` (only one; already locked).
- **Accounts:** every text post goes to **Hotcoin 🟩 (X)** and **Hotcoin (Facebook)**,
  same caption, same time. Instagram and LinkedIn only when asked.
- **Flow:** research → show the list → user approves or edits → schedule right away.
  Never schedule before an explicit approve.
- **After a Publer error/timeout:** list scheduled posts first, never resubmit blindly
  (the 2026-09-29 batch was created despite a "session expired" error).

## Time slots

Publer shows times in UTC+8. The audience for the main slots is the Americas (US Eastern).

| Slot | US Eastern | UTC+8 |
|---|---|---|
| Americas morning | 8:30 AM | 8:30 PM same day |
| Americas lunch | 12:30 PM | 12:30 AM next day |
| US pre-close | 3:50 PM | 3:50 AM next day |
| Asia afternoon (extra) | 2–7 AM | 2–7 PM |
| Early slot (used from Oct 13) | 7:00 AM | 7:00 PM same day |

Always check the current date in **both** zones (`TZ=Asia/Shanghai date`,
`TZ=America/New_York date`) and label every post with both.

## Copy rules

- Voice: lowercase, short, dry; 🟩 as the brand sign-off. Cashtags welcome.
- **No day- or minute-relative claims that drift across time zones** ("on a sunday",
  "close in 10 minutes"). The team edited both out of the first batch. Only use them
  when true in both UTC+8 and ET at the post time ("day 2 of 31", "next week").
- Mix per day: narrative push · cool line · HOT update.
- Rotate formats so no two posts in a day share one: `○/◉` pick lists, `▰▱` progress bars,
  `☐/☑` checklists, `✓` lists, `> terminal` lines, `→` arrows, plain lines.
- Only state Hotcoin facts that are verified (own posts, press releases). Don't claim a
  coin is listed on Hotcoin unless confirmed. Don't invent promos.
- **No "gm" posts.** The user rejected them (Oct 13). Avoid generic motivational lines that read
  like filler ("your plan shouldn't change every time a number does" was called weird).
- **ASCII art for X:** use braille characters (U+2800 block); they stay aligned in X's proportional
  font, unlike spaces or box drawing. Generate them with a script, never by hand. X counts each braille
  character as 2, so art posts run over 280 and rely on the account's long-post support. Charts must
  tell an obvious story (e.g. buy at 8:29 → parabolic dump at 8:30). Plain emoji grids were "too simple".
- Memecoin posts: use the current narrative (late Sep 2026: "rotating, not rallying")
  and several cashtags.

## Used so far (don't repeat)

- 2026-09-29 → 10-01: rektember / uptober loading 97% · current mood ○◉ · US markets close /
  tradfi doesn't · last day of september · > open chart · crypto vs stocks line ·
  it's uptober ○ BTC/ETH/SOL/NVDA · things that never close · $TSLA dip at 3am
- 2026-10-02: TOKEN2049 packing list (67 RSVPs, #TOKEN2049Singapore) · memes rotating
  ($PENGU $FARTCOIN $PEPE $DOGE $MARSCOIN) · uptober progress day 2/31 · weekend checklist ☐☑ ·
  wall street logging off for the weekend

- 2026-10-13 → 10-16: see `queue-2026-10-13.md` (CPI week: ETF outflows/range question, CPI-day preview,
  braille buy-the-top crash, braille zoom-out mountain, sideways ○◉ poll, Fed two-weeks-out, weekly
  check-in, weekend ☐☑ plans)

## What performed

- Best text post of batch 1: the `▰▱` uptober progress bar (10 likes, 4 replies, ~1.9k reach).
- Weakest: plain "gm. last day of september" and "> open chart".
- Account-wide winners that week were the Newcomer Level-Up campaign (265 link clicks)
  and the TOKEN2049 teaser — campaigns and events beat generic lines.

## Upcoming hooks

- TOKEN2049 Singapore: Oct 7–8, 2026 (week of side events Oct 5–11).
- Newcomer Level-Up Week #2 runs until Oct 9, 15:59 UTC.
- Follow-up idea: announce the "winner" of the Oct 2 memecoin pick.
