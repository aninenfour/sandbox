# Daily X / FB posts: runbook

Two posts a day, fully automatic (the owner approved the format on Nov 3, 2026):

| Slot (UTC+8) | Post | Script |
|---|---|---|
| 12:01 (Sat/Sun 13:00) | **What to Watch Today**: 5 assets, crypto + TradFi, all live on Hotcoin, one reason each | `watch.py` |
| 22:05 | **Daily Top Gainers TOP 5** on Hotcoin, live 24h ranking | `live.py top5` |

Both go to **X (with @handles) and Facebook (no @handles)** through `publish.py`.

**LinkedIn is paused** (owner, Nov 19, 2026): no Top 5, What to Watch or similar updates on LinkedIn until the team decides a new LinkedIn strategy. `publish.py` refuses `linkedin`.

**Every post carries exactly one Hotcoin page link** (social linkage plan, owner Nov 17). `links.py` adds it automatically:
- **What to Watch**: the **Converter page (to USD)** of the first pick that has one (falling back down the picks), else BTC to USD.
  `https://www.hotcoin.com/en_US/converter/<sym>/usd/`
- **Top 5 Gainers**: the **Price page** of the #1 gainer (falling back to #2, #3, ...), else BTC's Price page.
  `https://www.hotcoin.com/en_US/price/<slug>/`
No Academy links. Pages come from Hotcoin's en_US sitemaps, and a page is used only if its title names the right ticker.
Check the link line in the caption before publishing.

## 0. Setup (fresh session)
```bash
cd <repo>   # aninenfour/sandbox, branch claude/great-euler-ey4t71
pip install --break-system-packages -q pillow
```
Playwright/Chromium is preinstalled; `square.mjs` finds it on its own.

## 1. Morning: What to Watch (run starts ~11:40, posts at 12:01)
1. Research today (web search, standard mode): US earnings before open / after close today, macro data (CPI, jobs, Fed speakers, FOMC), elections and policy events, big crypto events (ETF flows, unlocks, upgrades, listings, hacks), and what is moving on Hotcoin (`live.py`'s ticker: biggest 24h movers with real volume).
2. Pick **5** assets: at least 2 crypto and at least 2 TradFi (tokenized stocks end in `B` on Hotcoin, e.g. `NVDAB`, `AAPLB`, `SPYB`; gold = `XAUT` / `PAXG`). Each must have a concrete, dated reason to watch **today**. Prefer big names with real catalysts; one "top mover" momentum pick is fine. Don't repeat yesterday's exact five (see `watch/<yesterday>/picks.json`). Example: `watch/_example/picks.json`.
   - **Weekends (Sat/Sun):** post at **13:00** UTC+8, not 12:01 (owner, Nov 14); rerun `watch.py` a few minutes before so prices are fresh. US stocks are closed. Lead with crypto (3 picks) and frame the 2 TradFi picks as "week ahead" (earnings, data or events coming Mon to Fri), e.g. "Reports Tuesday after the US close".
   - No separate #1 Top Gainer post: the owner dropped it (Nov 3).
3. Write `social/daily/watch/<YYYY-MM-DD>/picks.json` (format in the `watch.py` docstring). `why` lines: max ~60 characters, facts only, every number and date checked with a source. Times in UTC+8 when you give one. No price targets, no "buy/sell", no political opinions, no em dashes.
4. Handles: crypto handles come from CoinGecko automatically; TradFi from the `TRADFI` map in `watch.py`. For a company not in the map, look up its official X handle and pass `"handle"` (or `"handle": ""` for none). Never tag an exchange or an issuer that isn't the asset (BTC has no handle).
5. `python3 social/daily/watch.py social/daily/watch/<date>/picks.json` . It exits with an error if a symbol isn't listed on Hotcoin: swap that pick and rerun.
6. Look at `sq-watch.png`; also read `x-short.txt` (the fallback): text fits (no clipped "why"), logos right, prices sane. Spot-check one stock price against Yahoo (`query1.finance.yahoo.com/v8/finance/chart/<T>`). Read `x.txt`.
7. Wait until **12:01** UTC+8 (weekends **13:00**), then publish (step 3 below) with `x.txt`.

## 2. Evening: Top 5 Gainers (run starts ~21:55, posts at 22:05)
Three templates rotate so the same slot doesn't look identical every day (owner, Nov 16). `live.py` picks one at random,
never the same as the last posted day (override with `--template podium|orbit|race`):
- **podium** (`sq-white.png`): white cards, big numbers, the original.
- **orbit** (`sq-orbit.png`): ink background, coins climbing a lime trajectory, "climbing today".
- **race** (`sq-race.png`): race track, coins speeding to a checkered finish, "racing ahead today".
Copy says "today", never "tonight": readers see it at any hour.

1. Wait until **22:04** UTC+8 so the 24h window ends at post time, then `python3 social/daily/live.py top5`.
2. Look at the PNG (path in `image`) and `caption.txt`. If a handle looks wrong (same ticker, different project), fix it in
   `coins.json` (set `"twitter"`, or `"pinned": true`) and run `python3 social/daily/live.py top5 --rerender <dir>`
   (same numbers and template, new caption/render). A coin with no handle is fine untagged.
3. Publish at **22:05** with the `image` PNG and `caption.txt`.

## 3. Publish
```bash
PUBLER_API_KEY=<from the task prompt> python3 social/daily/publish.py <png> <x caption file>
```
X gets the caption as is. Over 280 weighted chars (emoji count 2) it goes out as an X Premium **long post** (`details.type: long_post`; @HotcoinGlobal has the gold badge, Publer shows `premium: true`). If the account ever loses Premium, X gets `x-short.txt` (watch.py writes it, always <= 280) or is skipped, never cut. After posting, publish.py reads the live post back from X and sets `verified_full_text`; a cut caption is reported as an X error (exit 1): edit the post on X and report. Facebook and LinkedIn get `facebook.txt` / `linkedin.txt` if present, otherwise the caption with @handles stripped. It retries other errors with a 75 s gap but never retries a "duplicate" error (that post already exists). Exit code 1 = at least one network failed; the others still post.

## 4. Log
Commit the day's folder (`watch/<date>/` or `live/<stamp>-top5/`, including `published.json`) and `coins.json`, push to `claude/great-euler-ey4t71`. End with at most 3 lines: what posted, links, anything that failed.

## If something breaks
- Hotcoin ticker or render fails: retry once, then stop and report. Never post a broken image or a wrong price.
- Running late: the morning post can go out up to 13:00 (weekends 14:00) and the evening one up to 23:00. After that, skip and report.
- Never write the API key into a file, commit or message.
