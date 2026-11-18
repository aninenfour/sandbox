# Hotcoin daily GM strategy (draft for approval)

Research date: 2026-11-18. Internal doc. Public copy never names other exchanges.

## What the reference posts show (your 5 screenshots)
| Pattern | What they do | Why it likely works |
|---|---|---|
| One branded object in a real scene | Product-like prop (hat, cube) placed in a photo | Brand mark appears without a logo slap; instantly recognisable in a feed |
| Anonymous human | Back view or face covered | Human warmth, no endorsement issue (matches our rule) |
| 4:5 portrait, one hero | Nothing else in frame | Fills the feed, stops the scroll |
| 3 to 8 word caption, no CTA, no link | "brb, touching sand", "looking powerful" | Reads as a person, not an ad; replies and quotes come from curiosity |
| Same slot, same format family | Posts on consecutive days (Oct 17, 18, 19) | Ritual: audience expects it. Reach in screenshots is roughly 176K to 226K views per post, 650 to 1.1K likes |
| Art-history twist | Painting style version of the brand cap | Shareable "what is this" moment |

Takeaway: the win is a recognisable character/prop plus a daily ritual, not a clever caption. We take the structure, not the look (no yellow, no hats copied).

## What we could and could not verify
- Web research found only generic crypto X guidance: daily GM is a low-effort habit; replies in the first hour and consistency matter more than volume. Sources are marketing blogs, weak evidence.
- One source says plain "GM" farming posts may be down-ranked after X's anti-spam changes (Dec 2025). Treat as unverified, but it supports making each GM carry a visual or a question.
- I cannot open X from here, so I could not audit competitor feeds directly. Publer has no competitors tracked yet. **Action:** add 8 to 10 exchange accounts to Publer competitor tracking, then run `get_post_insights competitors:true sort_by:likes` after 2 weeks to see which GM formats win.
- Your own last 90 days on the main X account: top posts are giveaways (reach 6K to 7K, 200 to 300 likes, 200+ replies). Zero GM posts in the top 10, so there is no baseline yet. The GM series will be measured against that.

## The system: 4 formats, rotated so no layout repeats two days running
| Day | Format | Template (built) | Notes |
|---|---|---|---|
| Mon | Market GM (white data post, our best performer style) | `data` | Live BTC/ETH/SOL from CoinGecko, dated on card, risk line in caption |
| Tue | Serif "gm" on ink | `serif` | Pure brand ritual |
| Wed | Dots GM (dots morph style) | `dots` | Reuses approved dots look |
| Thu | Streak counter | `streak` | "Day N. GM." The streak itself becomes the hook |
| Fri | Market GM | `data` | Weekend lead in |
| Sat | Follow board (floating card) | `follow` | The "hit follow" post you described, once a week only |
| Sun | Reset / plan the week | `lime` | Soft, human tone |

Photo/object variant (the reference style, needs your decision): a green Hotcoin cap or symbol object in a real scene (beach, mountain, desk), anonymous back view. Two ways:
1. **AI generated** with fal or Canva AI. This is paid, so I will not run it without your yes each time.
2. **Real photo + our symbol**: Unsplash photos (free licence) with the official symbol composited on a cap or object. Logged in `hotcoin-tradfi/FOOTAGE_CREDITS.md`. Slower, zero cost.
Suggested cadence: 2 photo days per week (Wed, Sun), replacing `dots` and `lime`.

## Caption rules
- 3 to 12 words, GM first, one question max, rotating (bank in `render.mjs`, 7 questions).
- No link on the Mon to Fri posts (links lower reach); put hotcoin.com only on Mon data and Sat follow.
- Data days: "Not financial advice." Rewards are never mentioned in GM posts.
- Chinese: `--lang=zh`, hotcoinv5.com. Run for the Chinese account on the same day.

## Posting and engagement
- Time: pick one slot and keep it (Asia morning 08:00 UTC+8 fits your audience; confirm with Publer `get_best_times_to_post` for the X account).
- First hour: reply to every comment, quote 3 to 5 community accounts' GM. Replies, not the post, drive reach.
- Weekly: 1 giveaway-style GM (your proven reply driver): "Reply GM + your coin for a 5 USDT futures trial fund draw" with the exact reward type and tier rules.
- KPIs after 30 days: replies per GM, reach vs the 90-day giveaway baseline, follower growth on Saturdays.

## Automation (what exists and what is next)
Built now: `social/gm/render.mjs`. One command renders the card at 1080x1350 @2x and writes the caption `.txt`.
```bash
PW_PATH=$(npm root -g)/playwright node social/gm/render.mjs            # today, auto theme by weekday
PW_PATH=$(npm root -g)/playwright node social/gm/render.mjs 2026-11-22 --lang=zh
```
Next (needs your OK, nothing is scheduled yet):
1. A scheduled job each evening renders tomorrow's card and saves it to Publer as a **draft** for the Hotcoin X account (human taps approve), then optionally publishes on a recurring slot.
2. Optional: fal image generation for the photo variant, with a fixed prompt template and per-day approval.
3. Weekly report from Publer insights ranking formats by replies.
