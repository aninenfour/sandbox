// Hotcoin x BTH welcome giveaway on AI candy backgrounds (Nano Banana 2 edit with the BTH logo as reference, Nov 25).
// A = pink backdrop, candies pouring on the right. B = lime surface, candies spilling from a jar, bottom right.
// Rewards: $500 in futures trial vouchers = 10 random x $20 + first 60 new users x $5.
// Run: PW_PATH=$(npm root -g)/playwright node social/bth-welcome/render-candy.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const BR = 'file://' + DIR + '../../hotcoin-tradfi/public/brand/';
const PINK = '#e0087a', INK = '#0b0e11';

const V = {
  A: {bg: 'candy-a.png', sx: 300, sy: 0, base: 'linear-gradient(180deg,#f6c6d8 0%,#f3c9da 60%,#e4f1c6 100%)', bigColor: INK, hl: PINK, subC: INK, top: {h1: 180, big: 380, sub: 600, row: 700}},
  B: {bg: 'candy-b.png', sx: 270, sy: 210, base: '#c9ec7a', bigColor: PINK, hl: PINK, subC: INK, top: {h1: 180, big: 380, sub: 600, row: 700}},
};
const page = (v) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Russo+One&family=Inter+Tight:wght@600;700;800&display=block">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;position:relative;color:${INK};font-family:'Inter Tight';background:${v.base}}
.bg{position:absolute;left:${v.sx}px;top:${v.sy}px;width:1080px;height:1080px;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 160px),linear-gradient(180deg,transparent 0,#000 ${v.sy ? 160 : 0}px);-webkit-mask-composite:source-in;mask-composite:intersect}
.hd{position:absolute;left:72px;top:68px;display:flex;align-items:center;gap:22px}
.hd .hc{height:44px}.hd .x{font:400 30px 'Russo One';color:rgba(11,14,17,.5)}.hd .bth{height:74px;margin:-14px 0}
h1{position:absolute;left:72px;top:${v.top.h1}px;font:400 84px/0.98 'Russo One';letter-spacing:-1.5px}
h1 span{color:${v.hl}}
.big{position:absolute;left:66px;top:${v.top.big}px;font:400 210px/0.9 'Russo One';letter-spacing:-7px;color:${v.bigColor}}
.sub{position:absolute;left:72px;top:${v.top.sub}px;font-size:44px;font-weight:800;letter-spacing:-.5px;color:${v.subC}}
.rows{position:absolute;left:72px;top:${v.top.row}px;display:flex;flex-direction:column;gap:18px}
.r{display:flex;align-items:baseline;gap:18px}.r .v{font:400 54px 'Russo One';letter-spacing:-1px;min-width:220px}.r .v b{font-weight:400;color:${PINK}}
.r .l{font-size:32px;font-weight:700}
</style></head><body>
<img class="bg" src="assets/${v.bg}">
<div class="hd"><img class="hc" src="${BR}logo-official-black.png"><div class="x">×</div><img class="bth" src="assets/bth-logo-src.png"></div>
<h1>Welcome <span>$BTH</span><br>to Hotcoin</h1>
<div class="big">$500</div>
<div class="sub">in futures trial vouchers</div>
<div class="rows"><div class="r"><div class="v">10 <b>×</b> $20</div><div class="l">random winners</div></div>
<div class="r"><div class="v">60 <b>×</b> $5</div><div class="l">new users, first come</div></div></div>
</body></html>`;

const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1080}, deviceScaleFactor: 2});
for (const [k, v] of Object.entries(V)) {
  const f = DIR + `_b-${process.pid}.html`;
  fs.writeFileSync(f, page(v));
  await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  await p.screenshot({path: DIR + `hotcoin-bth-candy-${k}.png`}); fs.unlinkSync(f);
}
await b.close(); console.log('ok');
