# Hotcoin Português (X): Runbook

Channel: **Hotcoin Português** on X, Publer account id `6af6e3c91740237b1cdd90c0` (workspace "hotcoin").
**Post ONLY to this account.** Never to the main Hotcoin, Research, IG, FB, LinkedIn or TikTok accounts.
Audience: **Brazil**. Copy in **pt-BR**. Times in **Brasília (America/Sao_Paulo, UTC-3)**. Hotcoin pages publish UTC+8: subtract 11 h.
Approval: full green light from the owner (14 Nov 2026) to publish on this channel without asking each time. Still ask before spending money (image API, Canva credits).

## 0. Start of every run
```bash
cd /home/user/sandbox && git pull -q origin claude/modest-davinci-f0eab9
pip install -q --break-system-packages rembg onnxruntime qrcode 2>/dev/null || pip install -q rembg onnxruntime qrcode
node social/pt/tracker/plan.mjs          # event status now, Brasília time
node social/pt/tracker/schedule.mjs $(TZ=America/Sao_Paulo date +%F) 1   # today's humanised slot times
```
Then check what is already queued: Publer `list_publer_posts` state "scheduled", days 2, filtered to Hotcoin Português. Never double-post a topic.
Read `LOG.md` (what ran, what is queued) before planning.

## 1. The three daily checks (scheduled tasks fire these)
| Check | Brasília | Do |
|---|---|---|
| 1 | ~07:40 | Fetch both announcement lists (events: `hotcoin.com/en_US/support/nav/2/?code=11675154291494913&id=11675178963439616`, official notices: `hotcoin.com/en_US/support/nav/2/?id=11675178853076992&code=11675154155966465`). New items → read the page, add to `tracker/events.json` (UTC+8 times as published). Run plan.mjs. Build and schedule today's posts. |
| 2 | ~12:05 | Re-check lists. Post **Placar do dia** with fresh data (section 3). Launch posts for anything new. Mark ended events. |
| 3 | ~16:10 | Re-check closing times for tonight's posts, caps, sold-out pools. Schedule evening posts. Update LOG.md, commit, push. |

## 2. What to post (a normal day is 5 to 7 posts, vary it)
- **GM** (morning): real photo, mono + grain, ONE lime line that follows a real path in the photo and points at something (rail, path, street). Brazilian places from now on (São Paulo, Rio, Floripa, BH, Salvador). Morning light only. No recolouring photos. Short text, logo small.
- **Event key visual** (`day_br.mjs` `keyVisual()`): hero = 3D object cut from the event's official banner (`art/official/cut.py`, banners from `img.hotbtech.cn` on the event page), hook line, pool or reward as big number, 3 facts naming the reward type (Futures Trial Funds / Earn Trial Funds / futures fee voucher / USDT), deadline in Brasília, QR to event page.
- **Milestones from plan.mjs**: LAUNCH, MIDTERM, 48H, LAST DAY, ENDED, results (+7 business days). Last-day and last-call posts go out the evening before if the event closes early morning Brasília.
- **Anúncio oficial** card for delistings, splits, rebrands, maintenance (`anuncio` in `day_br.mjs`).
- **Agenda da semana** (Sun or Mon): week calendar with Brasília times, market dates verified.
- **Recibo** (Earn worked example, green cup, `talao`).
- **Placar do dia** (top coin vs BTC, `news_br.mjs`), **Raio-X da rede** (one chain a week, DefiLlama), **Raio-X TradFi** (stock news; real person photo allowed ONLY here, licensed CC/press, credit in caption, facts only, no allegations).
- **Meme of the day**: serious mono photo + lowercase X-style caption, Brazilian life (churrasco, miojo, gerente do banco, 0800, Pix, fim do mês). No copyrighted meme templates, no real people, no politics, no club bashing, no product pitch.
- **Text posts / polls**: city rivalry, quick questions, Sunday-night humour.

## 3. Data rules
- Every number verified at posting time; put the data time in the caption ("24h até 12:07, Brasília").
- Top coin: `curl -s https://api.hotcoinfin.com/v1/market/ticker` → USDT pairs with amount > 200k, sort by `change`. Logo from CoinGecko only (`/api/v3/search?query=`). Skip leveraged ETF tokens (SOXSB, SQQQB...) and anything unclear.
- Chains: DefiLlama (`/v2/historicalChainTvl/<chain>`, `/overview/dexs/<chain>`, `/overview/fees/<chain>`). Do not feature chains run by competitor exchanges.
- Never name competitors. Never fake a logo. Sources go in script comments, not on graphics.

## 4. Posting mechanics
- Render at 2x, convert to JPEG 1080 wide (`ffmpeg -vf scale=1080:-1 -q:v 3`), put in `social/pt/publish/<date>/`, commit and push. The repo is **public**, so Publer can fetch `https://raw.githubusercontent.com/aninenfour/sandbox/claude/modest-davinci-f0eab9/social/pt/publish/<date>/<file>.jpg`. Never commit keys or private data.
- Publer `submit_publer_posts`, `when: "schedule"`, account `6af6e3c91740237b1cdd90c0`, platform `twitter`, one post per call. Polls: `poll_options` (2 to 4) + `poll_duration_days`.
- **Captions ≤ 280 characters** (a URL counts as 23) unless we learn the account has X Premium.
- Times: from `schedule.mjs`; never :00/:15/:30/:45; at least 60 min between posts; skip or add a post some days.
- Risk lines in caption: futures → "Futuros envolvem alto risco."; earn/price → "Não é recomendação de investimento." No em dashes anywhere.
- Links: event page `https://www.hotcoin.com/en_US/announcement/<slug>/`.

## 5. After each run
- Append to `LOG.md`: date, time, format, topic, caption first line, status (scheduled / published / failed).
- Log new photos in `hotcoin-tradfi/FOOTAGE_CREDITS.md`.
- Commit and push.
- Message the owner only if something failed or needs a decision.

## If something breaks
- Publer error: retry once after checking `list_publer_posts` (avoid duplicates). Still failing → skip that post, note it in LOG.md, tell the owner.
- Website unreachable: post nothing event-related that day; GM/meme/text can still go.
- Unsure about a fact: do not post it.
