# Hotcoin Português (X): Runbook

Channel: **Hotcoin Português** on X, Publer account id `6af6e3c91740237b1cdd90c0` (workspace "hotcoin").
**Post ONLY to this account.** Never to the main Hotcoin, Research, IG, FB, LinkedIn or TikTok accounts. Single exception: the daily English **Learn do dia** copy also goes to Hotcoin Facebook and Hotcoin Research X (owner, 17/11/2026, section 2).
Audience: **Brazil**. Copy in **pt-BR**. Times in **Brasília (America/Sao_Paulo, UTC-3)**. Hotcoin pages publish UTC+8: subtract 11 h.
Approval: full green light from the owner (14 Nov 2026) to publish on this channel without asking each time. Still ask before spending money (image API, Canva credits).

## 0. Start of every run
```bash
cd /home/user/sandbox && git pull -q origin claude/modest-davinci-f0eab9
pip install -q --break-system-packages rembg onnxruntime qrcode 2>/dev/null || pip install -q rembg onnxruntime qrcode
node social/pt/tracker/plan.mjs          # event status now, Brasília time
node social/pt/tracker/schedule.mjs $(TZ=America/Sao_Paulo date +%F) 1   # today's humanised slot times
```
Then check what is already queued AND published today: Publer `list_publer_posts` (states published + scheduled, days 2), filtered to Hotcoin Português. The team also posts here (GM, Nvidia/TradFi news, What to Watch PT, listings): never double-post a topic, and if the team has a GM queued, skip ours that day. Lesson 18/11: our Nvidia results text duplicated a team post from 05:41.
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
- **Meme of the day**, alternate two kinds (never the same kind two days running, skip some days):
  - *Real meme templates* (owner rule, 15 Nov 2026): use the actual well-known templates (imgflip / knowyourmeme classics, including the people and products in them) and re-caption them in pt-BR with crypto/market jokes. Example: `meme_regret.mjs` ("não vou comprar esse mico" carousel built on the "why didn't I buy / ain't buying that brick" template). Keep a library in `art/meme/` (`template-*.jpg`).
  - *Serious photo + unhinged caption*: mono photo, lowercase X-style caption, Brazilian life (churrasco, miojo, gerente do banco, 0800, Pix, fim do mês).
  - Hard lines that stay: no fake endorsement (never make a celebrity or brand look like they use, recommend or partner with Hotcoin), no fake Hotcoin logo use on other brands, no politics, no club bashing, no hate. Prices in memes are real and dated (script comments + caption).
- **Learn do dia** (max 1 per day, owner request 17/11): at check 1, re-read hotcoin.com/en_US/learn/ for new articles, add them to `tracker/learn.json` (newest first, skip dated news, outdated data, EU-only and political topics), post the next `queued` one, mark it `posted`. Nothing left → skip the day. Cover image = the article's official cover (img.hotbtech.cn). PT X: pt-BR hook + `/pt_PT/learn/<slug>/` link in first reply (note: pt_PT pages are UI-translated only, body is English). **Exception to PT-only:** the same article in English also goes to **Hotcoin Facebook** (`6a72f281aed075b6f35a33c0`, link in post) and **Hotcoin Research X** (`6ae9c2c6fae3382e748574da`, link in first reply), `/en_US/learn/<slug>/`. Nothing else ever goes to those accounts from this runbook.
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
- Links: event page `https://www.hotcoin.com/en_US/announcement/<slug>/`, posted as the first reply (`follow_up_comments`, delay 0), not in the main post (review 16/11: link posts got 0 engagement).

## 5. After each run
- Update the Google Sheet **Hotcoin Português · Post log** (id `1s304pmU3-ZIR_JUkyjMXC3ec2gCClxQeApF2IqHXct0`): one row per post (Data, Hora, Formato, Tema, Primeira imagem URL, Legenda 1ª linha, Status, Link no X, Notas), flip Agendado to Publicado with the X link once live, and rewrite row 1 (TOTAL: posts, publicados/agendados, dias ativo desde 14/11/2026, última revisão completa, data de atualização). Editing needs the Google Sheets connector; if it is not available, keep `LOG.md` current and tell the owner the sheet is behind.
- Append to `LOG.md`: date, time, format, topic, caption first line, status (scheduled / published / failed).
- Log new photos in `hotcoin-tradfi/FOOTAGE_CREDITS.md`.
- Commit and push.
- Message the owner only if something failed or needs a decision.

## If something breaks
- Publer error: retry once after checking `list_publer_posts` (avoid duplicates). Still failing → skip that post, note it in LOG.md, tell the owner.
- Website unreachable: post nothing event-related that day; GM/meme/text can still go.
- Unsure about a fact: do not post it.

## Full review (every Monday at check 1, and after any rule change)
- Pull last 7 days from Publer (`analyze_recent_performance` / `get_recent_posts`, Hotcoin Português only): best and worst posts, formats, times.
- Check tracker accuracy, runbook rules, meme library, photo log; drop what underperformed, add one new format idea.
- Write the date into row 1 of the Post log ("Última revisão completa") and a short note in LOG.md.
