// Engage bot 2x points, mascot version: the green Hotcoin 101 mascot juggling doubled coins (solo). 1080x1350 @2x.
// Same facts as render.mjs. Background: fal-ai/nano-banana-2/edit (1K) with the 101 mascot as reference (one eye, no mouth).
// Run: PW_PATH=$(npm root -g)/playwright node render-mascot.mjs
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
.bg{position:absolute;left:150px;top:186px;width:780px;height:968px;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 70%,transparent 100%)}
.shade{position:absolute;inset:0;background:linear-gradient(0deg,${INK} 0%,rgba(7,9,10,.96) 22%,rgba(7,9,10,0) 30%)}
.top{position:absolute;left:64px;right:64px;top:62px;display:flex;justify-content:space-between;align-items:center}
.pill{font-family:'JetBrains Mono';font-weight:700;font-size:16px;letter-spacing:2.2px;padding:10px 18px;border-radius:99px;border:1.5px solid ${LIME};color:${LIME}}

.h{position:absolute;left:0;right:0;top:158px;text-align:center;font-weight:800;font-size:78px;letter-spacing:-3px;line-height:1.02}
.h span{color:${LIME}}
.badge{position:absolute;left:0;right:0;top:336px;text-align:center}
.badge div{display:inline-block;transform:rotate(-3deg);background:${LIME};color:${INK};font-weight:900;font-size:40px;letter-spacing:-.5px;padding:10px 28px 12px;border-radius:14px;box-shadow:0 0 60px rgba(184,242,106,.4)}
.rows{position:absolute;left:64px;right:64px;top:1030px;display:grid;grid-template-columns:1fr 1fr 1fr 1.15fr;border-top:1.5px solid rgba(255,255,255,.22)}
.c{padding-top:22px}
.c + .c{padding-left:26px;border-left:1.5px solid rgba(255,255,255,.22)}
.c .k{display:flex;align-items:center;gap:10px;font-family:'JetBrains Mono';font-weight:500;font-size:16px;letter-spacing:1.6px;color:rgba(255,255,255,.65)}
.c .v{display:flex;align-items:baseline;gap:12px;margin-top:12px;font-weight:800;font-size:58px;letter-spacing:-2px;line-height:1}
.c .v .o{font-size:36px;font-weight:700;color:rgba(255,255,255,.4)}
.c .v .ar{font-size:28px;font-weight:600;color:rgba(255,255,255,.4);margin:0 -2px}
.c .v small{font-size:22px;font-weight:700;color:rgba(255,255,255,.6);letter-spacing:0}
.c.t .v{color:${LIME}}
.cta{position:absolute;left:64px;right:64px;bottom:64px;display:flex;align-items:center;justify-content:space-between;gap:30px}
.cta .t{font-size:25px;font-weight:600;line-height:1.3;color:rgba(255,255,255,.85);letter-spacing:-.3px}
.cta .t b{color:#fff;font-weight:800}
.btn{flex:none;display:flex;align-items:center;gap:14px;background:${LIME};color:${INK};font-weight:800;font-size:28px;letter-spacing:-.4px;padding:22px 32px;border-radius:99px;box-shadow:0 0 70px rgba(184,242,106,.35)}
.btn span{font-family:'JetBrains Mono';font-weight:700;font-size:20px;opacity:.75}
</style></head><body>
<img class="bg" src="file://${DIR}bg-mascot-solo.png"><div class="shade"></div>
<div class="top"><img src="${LOGO}" style="height:38px"><div class="pill">LIMITED TIME</div></div>
<div class="h">Earn <span>vouchers</span> just by<br>reacting on Discord</div>
<div class="badge"><div>NOW DOUBLED · 2× POINTS</div></div>
<div class="rows">
  ${cols.map(([ic, k]) => `<div class="c"><div class="k"><svg width="22" height="22" viewBox="0 0 24 24">${I[ic]}</svg>${k}</div><div class="v"><span class="o">1</span><span class="ar">→</span>2</div></div>`).join('')}
  <div class="c t"><div class="k">PER POST</div><div class="v">6<small>pts</small></div></div>
</div>
<div class="cta"><div class="t">Swap points for <b>futures vouchers</b>,<br>from $5 at 300 pts</div><div class="btn">discord.gg/hotcoin<svg width="22" height="22" viewBox="0 0 22 22"><path d="M5 11h12M12 5l6 6-6 6" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>
</body></html>`;

const f = `${DIR}_poster-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await p.goto('file://' + f);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);
await p.screenshot({path: `${DIR}hotcoin-engage-x2-mascot-solo.png`});
await b.close();
fs.unlinkSync(f);
console.log('ok');
