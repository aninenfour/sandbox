// "Marketplace is open" poster (1080x1350): the sequel to 02-marketplace-opening-soon. Real catalogue from the
// Discord marketplace admin (Oct 2026): 300 pts $5, 600 pts $10, 1,200 pts 2 x $20, 10,000 pts Hotcoin Legend.
// Run: PW_PATH=$(npm root -g)/playwright node social/discord/join/open.mjs <scratch-dir>
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const OUT = ROOT + '/social/discord/join';
const SCR = process.argv[2];
const LOGO = 'file://' + ROOT + '/hotcoin-tradfi/public/brand/logo-official-white.png';
const DISCORD_PATH = fs.readFileSync(ROOT + '/social/discord/engage/tutorial.mjs', 'utf8').match(/const DISCORD_PATH = '([^']+)'/)[1];
const dc = (s, c = '#5865F2') => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" style="flex:none"><path fill="${c}" d="${DISCORD_PATH}"/></svg>`;

const ITEMS = [
  ['300', '$5', 'futures voucher', ''],
  ['600', '$10', 'futures voucher', ''],
  ['1,200', '2 × $20', 'futures vouchers', ''],
  ['10,000', '10 × $30', 'vouchers + goodies + Legend role', 'HOTCOIN LEGEND'],
];
const EARN = [['+3', 'Like, repost + reply', 'every new Hotcoin tweet, within 24h'], ['+2', '/claim', 'every day'], ['+30', 'Platinum role', 'one-time boost']];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800;900&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=block');
:root{--ink:#07090A;--lime:#B8F26A;--green:#7EC25A;--muted:#8A938C;--blurple:#5865F2}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1350px;background:var(--ink);color:#F4F6F1;font-family:'Inter Tight',sans-serif;overflow:hidden}
.s{position:relative;width:1080px;height:1350px;overflow:hidden}
.glow{position:absolute;inset:0;background:radial-gradient(60% 30% at 50% 22%,rgba(184,242,106,.20),rgba(184,242,106,0) 70%),radial-gradient(40% 25% at 100% 0%,rgba(88,101,242,.22),rgba(88,101,242,0) 70%)}
.top{position:absolute;left:64px;right:64px;top:56px;display:flex;justify-content:space-between;align-items:center}
.tag{font-family:'JetBrains Mono';font-weight:700;font-size:17px;letter-spacing:3px;color:#fff;background:var(--blurple);padding:8px 30px 8px 14px;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 100%,0 100%)}
.logo{width:180px}
/* awning + neon */
.awn{position:absolute;left:64px;right:64px;top:140px;height:74px;border-radius:14px 14px 0 0;background:repeating-linear-gradient(90deg,var(--lime) 0 60px,#EAFBD2 60px 120px);box-shadow:0 18px 36px rgba(0,0,0,.45)}
.awn:after{content:'';position:absolute;left:0;right:0;bottom:-26px;height:26px;
  background:radial-gradient(circle at 30px 0,var(--lime) 29px,transparent 30px) 0 0/120px 26px repeat-x,radial-gradient(circle at 90px 0,#EAFBD2 29px,transparent 30px) 0 0/120px 26px repeat-x}
.awn .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.25),rgba(0,0,0,.18));border-radius:inherit}
.hero{position:absolute;left:0;right:0;top:262px;text-align:center}
.open{display:inline-flex;align-items:center;gap:12px;font-family:'JetBrains Mono';font-weight:700;font-size:20px;letter-spacing:6px;color:var(--lime);border:2px solid var(--lime);border-radius:999px;padding:9px 22px;
  box-shadow:0 0 22px rgba(184,242,106,.45),inset 0 0 14px rgba(184,242,106,.25)}
.open i{width:12px;height:12px;border-radius:50%;background:var(--lime);box-shadow:0 0 12px var(--lime)}
.sign{margin-top:22px;font-family:Unbounded;font-weight:900;font-size:96px;line-height:.95;letter-spacing:-3px;color:#F6FFE9;
  text-shadow:0 0 18px rgba(184,242,106,.8),0 0 46px rgba(184,242,106,.5),0 0 90px rgba(184,242,106,.3)}
.lead{margin-top:20px;font-size:28px;font-weight:600;color:#C9D0CB}
.lead b{color:#fff}
/* price list */
.list{position:absolute;left:64px;right:64px;top:540px;display:flex;flex-direction:column;gap:12px}
.row{display:flex;align-items:center;height:84px;border-radius:18px;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.10);padding:0 28px}
.pts{width:250px;font-family:Unbounded;font-weight:800;font-size:34px;letter-spacing:-1px;color:var(--lime)}
.pts small{font-family:'JetBrains Mono';font-weight:700;font-size:16px;letter-spacing:2px;color:var(--muted);margin-left:8px}
.ar{color:var(--muted);font-size:28px;width:54px}
.rw{font-size:28px;font-weight:700}
.rw span{font-weight:500;color:#C9D0CB}
.row.leg{height:104px;background:linear-gradient(100deg,rgba(184,242,106,.20),rgba(184,242,106,.06));border:2px solid var(--lime);box-shadow:0 0 40px rgba(184,242,106,.18)}
.row.leg .rw{display:flex;flex-direction:column;gap:4px}
.rw .badge{font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:3px;color:var(--ink);background:var(--lime);border-radius:6px;padding:3px 9px;align-self:flex-start}
/* earn */
.eh{position:absolute;left:64px;top:1000px;font-family:'JetBrains Mono';font-weight:700;font-size:16px;letter-spacing:4px;color:var(--muted)}
.earn{position:absolute;left:64px;right:64px;top:1034px;display:flex;gap:12px}
.e{flex:1;border-radius:16px;border:1.5px dashed rgba(184,242,106,.35);padding:16px 18px}
.e .n{font-family:Unbounded;font-weight:800;font-size:30px;color:var(--lime)}
.e .t{font-size:21px;font-weight:700;margin-top:4px}
.e .d{font-size:16px;color:var(--muted);margin-top:2px}
/* bottom */
.cta{position:absolute;left:64px;right:64px;top:1186px;display:flex;align-items:center;gap:14px}
.cta b{font-family:'JetBrains Mono';font-size:24px;color:#fff}
.cta .pill{font-size:18px;color:#C9D0CB;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:8px 14px}
.cta .go{margin-left:auto;background:var(--lime);color:var(--ink);font-family:Unbounded;font-weight:800;font-size:22px;border-radius:12px;padding:14px 22px}
.fine{position:absolute;left:64px;right:64px;bottom:40px;font-family:'JetBrains Mono';font-size:13.5px;line-height:1.5;color:#6E766F}
</style></head><body><div class="s"><div class="glow"></div>
<div class="top"><div class="tag">HOTCOIN DISCORD · MARKETPLACE</div><img class="logo" src="${LOGO}"></div>
<div class="awn"><div class="shade"></div></div>
<div class="hero">
 <div class="open"><i></i>NOW OPEN</div>
 <div class="sign">MARKETPLACE</div>
 <div class="lead">Swap your <b>Engage points</b> for <b>futures vouchers</b>.</div>
</div>
<div class="list">
${ITEMS.map(([p, v, d, leg]) => leg
  ? `<div class="row leg"><div class="pts">${p}<small>PTS</small></div><div class="ar">→</div><div class="rw"><span class="badge">${leg}</span><div>${v} <span>${d}</span></div></div></div>`
  : `<div class="row"><div class="pts">${p}<small>PTS</small></div><div class="ar">→</div><div class="rw">${v} <span>${d}</span></div></div>`).join('\n')}
</div>
<div class="eh">HOW TO EARN</div>
<div class="earn">${EARN.map(([n, t, d]) => `<div class="e"><div class="n">${n}</div><div class="t">${t}</div><div class="d">${d}</div></div>`).join('')}</div>
<div class="cta">${dc(40)}<b>discord.gg/hotcoin</b><span class="pill">Points never expire</span><span class="go">Redeem →</span></div>
<div class="fine">Hotcoin Verified role required (UID + KYC). Rewards arrive within 24h. Limited monthly stock.<br>Futures trading is high risk. Vouchers are promotional trial funds.</div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
const f = `${SCR}/open.html`; fs.writeFileSync(f, html);
await page.goto('file://' + f, {waitUntil: 'networkidle'});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({path: `${OUT}/03-marketplace-open.png`});
console.log('ok');
await browser.close();
