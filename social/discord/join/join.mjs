// "Join the Hotcoin Discord" card (1080x1350, white): earn points with Engage, spend them in the marketplace.
// No dates, so it can be reused any week.
// Run: PW_PATH=$(npm root -g)/playwright node social/discord/join/join.mjs <scratch-dir>
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const OUT = ROOT + '/social/discord/join';
const SCR = process.argv[2];
const LOGO = 'file://' + ROOT + '/hotcoin-tradfi/public/brand/logo-official-black.png';
const DISCORD_PATH = fs.readFileSync(ROOT + '/social/discord/engage/tutorial.mjs', 'utf8').match(/const DISCORD_PATH = '([^']+)'/)[1];
const dc = (s, c = '#5865F2') => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" style="flex:none"><path fill="${c}" d="${DISCORD_PATH}"/></svg>`;
const chan = (name) => `<span class="ch">💠 | ${name}</span>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800;900&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=block');
:root{--ink:#0B0E11;--panel:#F4F5F2;--line:#E3E6E0;--lime:#B8F26A;--green:#2F9E44;--muted:#6B7280;--blurple:#5865F2;--d1:#2B2D31;--d2:#313338;--d3:#383A40;--dt:#DBDEE1;--dm:#949BA4}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1350px;background:#fff;color:var(--ink);font-family:'Inter Tight','Noto Color Emoji',sans-serif;overflow:hidden}
.s{position:relative;width:1080px;height:1350px;padding:60px 64px 48px;display:flex;flex-direction:column}
.bg1{position:absolute;inset:0;background:radial-gradient(60% 40% at 100% 0%,rgba(88,101,242,.16),rgba(88,101,242,0) 70%),radial-gradient(60% 35% at 0% 100%,rgba(184,242,106,.28),rgba(184,242,106,0) 70%)}
.bg2{position:absolute;inset:0;background-image:linear-gradient(rgba(11,14,17,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(11,14,17,.045) 1px,transparent 1px);background-size:60px 60px}
.top,.body{position:relative}
.top{display:flex;justify-content:space-between;align-items:center}
.tag{font-family:'JetBrains Mono';font-weight:700;font-size:17px;letter-spacing:3px;color:#fff;background:var(--blurple);padding:8px 30px 8px 14px;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 100%,0 100%)}
.logo{width:180px}
.body{flex:1;display:flex;flex-direction:column}
h1{font-family:Unbounded;font-weight:900;letter-spacing:-1.5px;line-height:1.02;font-size:74px;margin-top:38px}
.hl{background:linear-gradient(transparent 58%,var(--lime) 58%,var(--lime) 92%,transparent 92%);padding:0 6px;margin:0 -6px}
.lead{font-size:27px;color:var(--muted);font-weight:500;margin-top:18px;line-height:1.35}
.ch{display:inline-flex;align-items:center;gap:6px;background:#E8EAFE;color:#3B45C4;border-radius:7px;padding:1px 10px 2px;font-weight:700}
code{font-family:'JetBrains Mono';font-weight:700;background:var(--panel);border:1px solid var(--line);border-radius:7px;padding:1px 9px;font-size:.9em}
/* flow */
.flow{display:grid;grid-template-columns:1fr 48px 1fr 48px 1fr;align-items:stretch;margin-top:32px}
.st{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:24px 22px;display:flex;flex-direction:column;gap:12px}
.st.on{background:var(--lime);border-color:var(--lime);box-shadow:0 14px 40px rgba(120,190,60,.28)}
.n{width:42px;height:42px;border-radius:50%;background:var(--ink);color:var(--lime);font-family:'JetBrains Mono';font-weight:700;font-size:20px;display:flex;align-items:center;justify-content:center}
.st .t{font-family:Unbounded;font-weight:800;font-size:27px;line-height:1.1}
.st .d{font-size:19px;font-weight:500;color:var(--muted);line-height:1.35}
.st.on .d{color:#2c3a1c}
.ar{display:flex;align-items:center;justify-content:center;font-size:30px;color:var(--muted);font-weight:700}
/* discord mock */
.dw{margin-top:26px;background:var(--d2);border-radius:20px;overflow:hidden;box-shadow:0 18px 50px rgba(11,14,17,.22);color:var(--dt)}
.dh{display:flex;align-items:center;gap:10px;padding:15px 24px;border-bottom:1px solid #26282C;font-weight:700;font-size:20px;color:#F2F3F5}
.dh .hs{color:var(--dm);font-size:24px;font-weight:500}
.dh .sub{color:var(--dm);font-weight:500;font-size:16px;margin-left:10px}
.msg{display:flex;gap:16px;padding:16px 24px 20px}
.av{flex:none;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:22px;background:#1B2B5A}
.nm{font-weight:700;font-size:19px;color:#F2F3F5;display:flex;align-items:center;gap:8px}
.app{font-size:12px;font-weight:700;background:var(--blurple);color:#fff;border-radius:4px;padding:1px 5px;letter-spacing:.5px}
.tx{font-size:20px;margin-top:6px;line-height:1.4}
.pts{display:flex;gap:14px;margin-top:14px}
.pill{background:var(--d1);border:1px solid #3F4147;border-radius:12px;padding:12px 16px;font-size:17px;color:var(--dm)}
.pill b{display:block;font-family:'JetBrains Mono';font-size:24px;color:#F2F3F5;margin-top:4px}
.pill.g b{color:var(--lime)}
.shop{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.shop span{background:#3C45A5;color:#fff;border-radius:8px;padding:6px 12px;font-weight:700;font-size:17px}
.ex{font-size:14px;color:var(--dm);padding:0 24px 16px}
/* extras + cta */
.more{margin-top:22px;display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.more .k{font-family:'JetBrains Mono';font-weight:700;font-size:14px;letter-spacing:2px;color:var(--green);margin-right:2px}
.chip{font-size:18px;font-weight:600;padding:8px 15px;border-radius:999px;border:1.5px solid var(--line);background:#fff}
.cta{margin-top:auto;margin-bottom:6px;display:flex;align-items:center;gap:24px;padding:26px 30px;border-radius:24px;background:var(--ink);color:#fff}
.cta .t{font-family:Unbounded;font-weight:800;font-size:32px;line-height:1.05}
.cta .u{font-family:'JetBrains Mono';font-weight:700;font-size:24px;color:var(--lime);margin-top:10px}
.cta .go{margin-left:auto;background:var(--lime);color:var(--ink);font-family:Unbounded;font-weight:800;font-size:24px;border-radius:16px;padding:18px 24px;white-space:nowrap}
</style></head><body><div class="s"><div class="bg1"></div><div class="bg2"></div>
<div class="top"><div class="tag">HOTCOIN DISCORD · ENGAGE</div><img class="logo" src="${LOGO}"></div>
<div class="body">
<h1>Earn <span class="hl">points.</span><br>Spend them in<br>the <span class="hl">marketplace.</span></h1>
<div class="lead">Engage with Hotcoin on X, collect points on Discord, spend them on rewards.</div>

<div class="flow">
 <div class="st"><span class="n">1</span><div class="t">Connect X</div><div class="d">Type <code>/set twitter</code> once in ${chan('engage-logs')}</div></div>
 <div class="ar">→</div>
 <div class="st"><span class="n">2</span><div class="t">Engage</div><div class="d">Like, repost and reply to quests in ${chan('engage')}</div></div>
 <div class="ar">→</div>
 <div class="st on"><span class="n">3</span><div class="t">Earn &amp; spend</div><div class="d">Points land on your profile. Spend them in the marketplace.</div></div>
</div>

<div class="dw">
 <div class="dh"><span class="hs">#</span>💠 | engage-logs<span class="sub">Track all Engage activity and points</span></div>
 <div class="msg"><div class="av">E</div><div style="flex:1">
  <div class="nm">The Engage <span class="app">APP</span></div>
  <div class="tx">✅ Quest complete. Points collected!</div>
  <div class="pts"><div class="pill g">This quest<b>+ points</b></div><div class="pill">Check them<b>/rank</b></div><div class="pill">Top members<b>/leaderboard</b></div></div>
  <div class="tx" style="margin-top:16px;color:var(--dm);font-size:18px">Use your points in</div>
  <div class="shop"><span>💠 | marketplace</span><span>💠 | giveaway</span><span>💠 | arena</span></div>
 </div></div>
</div>

<div class="more"><span class="k">ALSO ON DISCORD</span><span class="chip">🧠 Quizzes &amp; challenges</span><span class="chip">⚽ DLS &amp; eFootball tournaments</span><span class="chip">🎙️ Weekly AMA</span></div>

<div class="cta">${dc(58, '#fff')}<div><div class="t">Join the Hotcoin Discord</div><div class="u">discord.gg/hotcoin</div></div><div class="go">Join →</div></div>
</div></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
const f = `${SCR}/join.html`; fs.writeFileSync(f, html);
await page.goto('file://' + f, {waitUntil: 'networkidle'});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({path: `${OUT}/join-discord-earn-points.png`});
console.log('ok');
await browser.close();
