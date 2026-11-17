// Hotcoin eFootball Cup (Discord community event) poster, 1080x1350 @2x. Full redo of the team's draft.
// Copy from the draft poster (Nov 17, 2026), minus the "32 max players" stat and the "Register with your eFootball UID" line (per user).
// Background: AI generated (fal, fal-ai/nano-banana-2/edit, 1K) from the green 101 mascot; type set here in code.
// Run: PW_PATH=$(npm root -g)/playwright node render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png';
const LIME = '#B8F26A', INK = '#07090A';

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:${INK};color:#fff;font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative;text-align:center}
.bg{position:absolute;left:0;top:44px;width:1080px;height:1341px}
.shade{position:absolute;inset:0;background:
  linear-gradient(180deg,${INK} 0%,${INK} 4%,rgba(7,9,10,.75) 18%,rgba(7,9,10,0) 32%),
  linear-gradient(0deg,${INK} 0%,rgba(7,9,10,.92) 22%,rgba(7,9,10,0) 36%)}
.top{position:absolute;left:64px;right:64px;top:58px;display:flex;justify-content:space-between;align-items:center}
.pill{font-family:'JetBrains Mono';font-weight:700;font-size:16px;letter-spacing:2.2px;padding:10px 18px;border-radius:99px;border:1.5px solid ${LIME};color:${LIME}}
.kick{position:absolute;left:0;right:0;top:150px;font-family:'JetBrains Mono';font-weight:700;font-size:24px;letter-spacing:9px;color:${LIME}}
h1{position:absolute;left:0;right:0;top:184px;font-weight:900;font-size:128px;letter-spacing:-5px;line-height:1}
.sub{position:absolute;left:0;right:0;top:322px;font-size:30px;font-weight:500;color:rgba(255,255,255,.78);letter-spacing:-.3px}
.stats{position:absolute;left:150px;right:150px;top:1000px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
.st{border:1.5px solid rgba(184,242,106,.55);border-radius:20px;padding:18px 0 20px;background:rgba(7,9,10,.55);backdrop-filter:blur(8px)}
.st .l{font-family:'JetBrains Mono';font-weight:500;font-size:15px;letter-spacing:2px;color:${LIME}}
.st .n{font-weight:800;font-size:44px;letter-spacing:-1.4px;margin-top:6px}
.prize{position:absolute;left:0;right:0;top:1136px}
.prize .a{font-weight:700;font-size:28px;letter-spacing:-.4px}
.prize .a span{color:${LIME}}
.prize .b{font-size:22px;font-weight:500;color:rgba(255,255,255,.66);margin-top:8px}
.btn{position:absolute;left:250px;right:250px;top:1232px;height:76px;border-radius:99px;background:${LIME};color:${INK};font-weight:800;font-size:30px;letter-spacing:-.4px;display:flex;align-items:center;justify-content:center;gap:14px;box-shadow:0 0 70px rgba(184,242,106,.35)}
</style></head><body>
<img class="bg" src="file://${DIR}bg.png">
<div class="shade"></div>
<div class="top"><img src="${LOGO}" style="height:38px"><div class="pill">DISCORD COMMUNITY EVENT</div></div>
<div class="kick">HOTCOIN</div>
<h1>eFootball Cup</h1>
<div class="sub">Hotcoin is entering its football era</div>
<div class="stats">
  <div class="st"><div class="l">REGISTRATION</div><div class="n">Open now</div></div>
  <div class="st"><div class="l">TIME TO REGISTER</div><div class="n">7 days</div></div>
</div>
<div class="prize"><div class="a">The more players join, <span>the bigger the prize pool</span></div>
  <div class="b">Up to 500 USDT in Hotcoin rewards · Prizes for the top 5</div></div>
<div class="btn">Register on Discord<svg width="22" height="22" viewBox="0 0 22 22"><path d="M5 11h12M12 5l6 6-6 6" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
</body></html>`;

const f = `${DIR}_poster-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await p.goto('file://' + f);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);
await p.screenshot({path: `${DIR}hotcoin-efootball-cup.png`});
await b.close();
fs.unlinkSync(f);
console.log('ok');
