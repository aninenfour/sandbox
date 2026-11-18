# Daily ongoing-events carousel

Posted on X (main) and Facebook every day around 14:00 UTC+8 (time varies, roughly 13:40 to 14:25).

1. `PW_PATH=$(npm root -g)/playwright node social/events-daily/render.mjs` reads the hotcoin.com Activities list, keeps campaigns
   running now and picks the 2 ending soonest. `--skip=slug,...` / `--pick=slug,...` override; `--layout=stack|flip` (alternates daily).
2. Slide copy comes from `events.json` (curated from each campaign page; always name the reward type and say when tiers don't stack).
   A campaign with no entry renders with a red NEEDS REVIEW line. `rewardTypeUnclear: true` = check with the team before posting.
3. Art: `python3 social/events-daily/prepare-art.py <slug>` crops the 3D key art from the official banner; upscale with fal
   `fal-ai/recraft/upscale/crisp` (~$0.004) and save as `art/hero-<slug>.png` (art/ is gitignored).
4. Avoid posting the same pair two days in a row (see `posted.json`); swap one campaign when another is running.
5. Captions: `out/<date>/caption-x.txt` (links go in the first reply) and `caption-fb.txt`. Futures campaigns carry
   "Futures trading is high risk", others "Not financial advice".
