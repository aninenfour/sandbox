# Hotcoin daily GM strategy (v2, Nov 18, 2026)

Internal doc. Built on the peer benchmark "Crypto_Exchange_GM_Posts_Research.docx" (411 GM posts from 14 exchange accounts on X,
Aug 20 to Nov 18, 2026, pulled from the X API). Public copy never names other exchanges.

## Where we stand (from the report)
- 77 GM posts in 90 days, avg 1.8K views, 10 likes, about 7 replies, 0.56% likes/views. Median views fell from about 2.1K (Aug to Sep) to 933 (Nov).
- Reach per follower is normal for our tier. **The gap is conversation**: peers get 0.93% to 2.29% likes/views.
- Our GM slot drifts 11:00 to 14:00 JST, visuals change every day (CGI, memes, app recordings, car photos), and many GMs carry campaign CTAs.

## What the data says works (views / replies vs each account's own median)
| Feature | Views | Replies |
|---|---|---|
| Text-only | 1.22x | 1.10x |
| Explicit reply prompt ("say it back", "rate this") | 0.77x | 1.19x |
| Contains a question | 1.01x | 1.09x |
| Promo, CTA or reward link in the GM | 0.86x | **0.49x** |

Plus: market self-awareness wins the biggest posts; one ownable, real-photo look held reach while everyone else fell 36% to 62%.

## The rules
1. **One series, real photos:** "green thing of the day" 🟩. Team phone photo of something green, hand-held POV, nothing written on it,
   one small green Hotcoin tile bottom-right (same spot every time). No CGI, no AI images.
2. **Copy:** lowercase, under about 40 characters, one idea. Two or three times a week end with a 1-second prompt (ticker, emoji, 1 to 10, gm back).
3. **No promos in GM.** Campaigns, prize pools and links go in a separate post or the first reply.
4. **Market-mood humour:** react to the day like a trader. No prices in GM copy (keeps it out of "price post" territory).
5. **Fixed slot:** 11:00 JST (10:00 UTC+8) for 4 weeks. Test a second GM at 20:30 JST on Tue and Thu for the EU/US morning.
6. **First 30 to 60 minutes:** reply to gm-ers by name, quote the funniest reply, shout out regulars.
7. **Measure weekly:** replies per 1K views and likes/views per format. Kill a format under 0.5% likes/views for 3 weeks.

## Weekly calendar (automated by `gm.mjs`)
| Day | Format | Needs |
|---|---|---|
| Mon | text-only market mood (BTC 24h picks the green / red / flat line) | nothing |
| Tue | green thing of the day | photo in `inbox/` |
| Wed | reply prompt, text-only | nothing |
| Thu | desk / setup photo, "rate this setup 1 to 10" | photo |
| Fri | kaomoji gm, text-only | nothing |
| Sat | merch or team-pet photo | photo |
| Sun | touch-grass outdoor photo | photo |

Missing photo means the script falls back to a text-only line, so a GM never gets skipped.

## How to run
```bash
PW_PATH=$(npm root -g)/playwright node social/gm/gm.mjs 2026-11-24
```
Writes `social/gm/out/<date>/plan.json`, `caption.txt` and, on photo days, `gm-<date>.png` (1080x1350 @2x).
Photo inbox: `social/gm/inbox/<date>.jpg`. Team photos only for live posts; stock is for testing (log any stock in `hotcoin-tradfi/FOOTAGE_CREDITS.md`).
No third-party brands or faces in the photo.

## The v1 rendered cards (`render.mjs`)
The report shows rendered/CGI GMs underperform real photos, so these are **not** the daily format any more. Keep them for one-off moments
(GM streak milestones like day 100, Chinese account, event mornings).

## Next steps (need approval)
1. Nightly job: run `gm.mjs` for tomorrow and save a Publer **draft** on the Hotcoin X account at 10:00 UTC+8. A human approves.
2. Team photo routine: one person drops 3 or 4 green photos a week into the inbox (or a shared Drive folder the job reads).
3. Add the 13 peer accounts to Publer competitor tracking so the weekly numbers refresh without a new report.
