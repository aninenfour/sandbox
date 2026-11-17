// Engage bot: double points for a limited time. 1080x1350 @2x.
// Facts from the bot dashboard (Nov 17, 2026): points per like / retweet / reply raised from 1 / 1 / 1 to 2 / 2 / 2
// (so 6 points per post if you do all three). Shop: $5 futures voucher 300 pts, $10 600 pts, 2 x $20 1,200 pts,
// "hotcoin legend" 10 x $30 10,000 pts; vouchers are futures trial vouchers, verified members only. Auto-farm toggle not shown.
// Background: AI generated (fal, fal-ai/flux/schnell). Run: PW_PATH=$(npm root -g)/playwright node render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png';
const LIME = '#B8F26A', INK = '#07090A';
const I = {
  like: `<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="${LIME}" stroke-width="2" stroke-linejoin="round"/>`,
  repost: `<path d="M7 7h10l-3-3M17 17H7l3 3M17 7v5M7 17v-5" fill="none" stroke="${LIME}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  reply: `<path d="M5 6h14v10H10l-5 4z" fill="none" stroke="${LIME}" stroke-width="2" stroke-linejoin="round"/>`,
};
const cols = [['like', 'LIKE'], ['repost', 'REPOST'], ['reply', 'REPLY']];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:${INK};color:#fff;font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
.bg{position:absolute;left:330px;top:-50px;width:900px;height:1125px;-webkit-mask-image:radial-gradient(ellipse 46% 40% at 50% 52%,#000 60%,transparent 100%)}
.shade{position:absolute;inset:0;background:linear-gradient(0deg,${INK} 0%,rgba(7,9,10,.94) 30%,rgba(7,9,10,0) 46%)}
.top{position:absolute;left:64px;right:64px;top:62px;display:flex;justify-content:space-between;align-items:center}
.pill{font-family:'JetBrains Mono';font-weight:700;font-size:16px;letter-spacing:2.2px;padding:10px 18px;border-radius:99px;border:1.5px solid ${LIME};color:${LIME}}
.kick{position:absolute;left:68px;top:176px;font-family:'JetBrains Mono';font-weight:700;font-size:22px;letter-spacing:6px;color:${LIME}}
.x2{position:absolute;left:52px;top:200px;font-weight:900;font-size:330px;letter-spacing:-16px;line-height:1;background:linear-gradient(180deg,#fff 25%,${LIME} 130%);-webkit-background-clip:text;color:transparent}
.h{position:absolute;left:66px;top:540px;width:520px;font-weight:800;font-size:60px;letter-spacing:-2.2px;line-height:1.04}
.h span{color:${LIME}}
.rows{position:absolute;left:64px;right:64px;top:850px;display:grid;grid-template-columns:1fr 1fr 1fr 1.15fr;border-top:1.5px solid rgba(255,255,255,.22)}
.c{padding-top:24px}
.c + .c{padding-left:26px;border-left:1.5px solid rgba(255,255,255,.22)}
.c .k{display:flex;align-items:center;gap:10px;font-family:'JetBrains Mono';font-weight:500;font-size:16px;letter-spacing:1.6px;color:rgba(255,255,255,.65)}
.c .v{display:flex;align-items:baseline;gap:12px;margin-top:14px;font-weight:800;font-size:64px;letter-spacing:-2px;line-height:1}
.c .v .o{font-size:40px;font-weight:700;color:rgba(255,255,255,.4)}
.c .v .ar{font-size:30px;font-weight:600;color:rgba(255,255,255,.4);margin:0 -2px}
.c .v small{font-size:22px;font-weight:700;color:rgba(255,255,255,.6);letter-spacing:0}
.c.t .v{color:${LIME}}
.swap{position:absolute;left:64px;right:64px;top:1062px;font-size:27px;font-weight:600;line-height:1.35;color:rgba(255,255,255,.86);letter-spacing:-.3px}
.swap b{color:#fff;font-weight:800}
.cta{position:absolute;left:64px;right:64px;bottom:72px;display:flex;align-items:center;justify-content:space-between}
.btn{display:flex;align-items:center;gap:14px;background:${LIME};color:${INK};font-weight:800;font-size:30px;letter-spacing:-.4px;padding:22px 34px;border-radius:99px;box-shadow:0 0 70px rgba(184,242,106,.35)}
.url{font-family:'JetBrains Mono';font-weight:700;font-size:24px;letter-spacing:1px;color:rgba(255,255,255,.85)}
</style></head><body>
<img class="bg" src="file://${DIR}bg-b.png"><div class="shade"></div>
<div class="top"><img src="${LOGO}" style="height:38px"><div class="pill">LIMITED TIME</div></div>
<div class="kick">DISCORD ENGAGE BOT</div>
<div class="x2">2×</div>
<div class="h">Points are <span>doubled</span> on every post</div>
<div class="rows">
  ${cols.map(([ic, k]) => `<div class="c"><div class="k"><svg width="22" height="22" viewBox="0 0 24 24">${I[ic]}</svg>${k}</div><div class="v"><span class="o">1</span><span class="ar">→</span>2</div></div>`).join('')}
  <div class="c t"><div class="k">PER POST</div><div class="v">6<small>pts</small></div></div>
</div>
<div class="swap">Swap your points for <b>Hotcoin futures vouchers</b>, from a $5 voucher at 300 pts.</div>
<div class="cta"><div class="btn">Start earning on Discord<svg width="22" height="22" viewBox="0 0 22 22"><path d="M5 11h12M12 5l6 6-6 6" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="url">discord.gg/hotcoin</div></div>
</body></html>`;

const f = `${DIR}_poster-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await p.goto('file://' + f);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);
await p.screenshot({path: `${DIR}hotcoin-engage-x2.png`});
await b.close();
fs.unlinkSync(f);
console.log('ok');
