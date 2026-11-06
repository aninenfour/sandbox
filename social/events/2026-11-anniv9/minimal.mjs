// Minimal key-visual directions for the 9th Anniversary Relay · Round 1 (1600x900, 2x).
// A: Swiss / International Typographic Style. B: Bauhaus construction (9 from a ring + a bar).
// Same facts as render.mjs. Run: PW_PATH=$(npm root -g)/playwright node social/events/2026-11-anniv9/minimal.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/events/2026-11-anniv9';
const BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const INK = '#0B0E11', LIME = '#B8F26A', PAPER = '#F1F0EA';
const head = `<meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+SC:wght@500;700;900&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1600px;height:900px;overflow:hidden;position:relative;font-family:'Inter Tight','Noto Sans SC',sans-serif}
.m{font-family:'JetBrains Mono','Noto Sans SC',monospace}
</style>`;

const rowsEN = [['Register via the link', '5 USDT', 'fee coupon'], ['Register + KYC', '9 USDT', 'trial funds'], ['First futures trade ≥ 99 USDT', '+9 USDT', 'trial funds'], ['Lucky draw, just register', '9 × 99 USDT', '9 winners']];

const A = `<!doctype html><html><head>${head}</head><body style="background:${PAPER};color:${INK}">
  <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(11,14,17,.07) 1px,transparent 1.3px);background-size:5px 5px;opacity:.5"></div>
  <!-- giant cropped 9 -->
  <div style="position:absolute;left:960px;top:-300px;font-weight:800;font-size:1360px;line-height:1;letter-spacing:-60px;color:${INK}">9</div>
  <!-- grid -->
  <img src="${BR}logo-official-black.png" style="position:absolute;left:80px;top:72px;height:38px">
  <div class="m" style="position:absolute;left:80px;top:150px;font-size:19px;letter-spacing:2.5px;font-weight:500">9TH ANNIVERSARY RELAY — ROUND 01</div>
  <div style="position:absolute;left:80px;top:190px;font-weight:700;font-size:104px;line-height:.94;letter-spacing:-5px">Newcomer<br>kickoff.</div>
  <div style="position:absolute;left:80px;top:414px;display:flex;align-items:flex-end;gap:18px">
    <div style="font-weight:600;font-size:30px;letter-spacing:-.5px;margin-bottom:16px">Up to</div>
    <div style="position:relative;font-weight:800;font-size:150px;line-height:.8;letter-spacing:-8px"><span style="position:absolute;left:-10px;right:-14px;top:46%;bottom:-8px;background:${LIME};z-index:-1"></span>18</div>
    <div style="font-weight:700;font-size:44px;letter-spacing:-1px;margin-bottom:6px">USDT</div>
  </div>
  <div style="position:absolute;left:80px;top:568px;width:720px">
    ${rowsEN.map(([a, v, u]) => `<div style="display:flex;align-items:baseline;border-top:1.5px solid ${INK};padding:8px 0 7px">
      <div style="flex:1;font-weight:600;font-size:22px">${a}</div>
      <div class="m" style="font-weight:700;font-size:21px;width:160px;text-align:right">${v}</div>
      <div class="m" style="font-size:17px;width:140px;text-align:right;opacity:.6">${u}</div></div>`).join('')}
    <div style="border-top:1.5px solid ${INK}"></div>
  </div>
  <div class="m" style="position:absolute;left:1238px;top:196px;width:300px;font-size:19px;letter-spacing:2px;font-weight:700;text-align:center;color:${INK}">11.06 — 11.16<br><span style="font-weight:500;opacity:.6">2026</span></div>
  <div style="position:absolute;left:80px;bottom:62px;display:flex;align-items:center;gap:22px">
    <div style="font-weight:700;font-size:24px;background:${INK};color:${LIME};padding:16px 30px;border-radius:999px">Join now →</div>
    <div class="m" style="font-size:19px;opacity:.7">Nov 6 – Nov 16, 23:59 (UTC+8) · 19,999 USDT pool</div>
  </div>
</body></html>`;

// B: the 9 constructed from a ring + a bar, with a baton dot
const cx = 1170, cy = 360, r = 215, sw = 110;
const B = `<!doctype html><html><head>${head}</head><body style="background:${INK};color:#fff">
  <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.06) 1px,transparent 1.3px);background-size:5px 5px"></div>
  <svg width="1600" height="900" style="position:absolute;inset:0">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${LIME}" stroke-width="${sw}"/>
    <path d="M ${cx + r - sw / 2} ${cy} L ${cx + r + sw / 2} ${cy} L ${cx + 40} ${980} L ${cx + 40 - sw * 1.15} ${980} Z" fill="${LIME}"/>
    <circle cx="${cx}" cy="${cy}" r="${r - sw / 2 - 26}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1.5" stroke-dasharray="3 9"/>
    <circle cx="${cx - r - 2}" cy="${cy + 160}" r="22" fill="#fff"/>
  </svg>
  <div style="position:absolute;left:${cx - 150}px;top:${cy - 70}px;width:300px;text-align:center">
    <div class="m" style="font-size:17px;letter-spacing:3px;color:rgba(255,255,255,.6)">LUCKY DRAW</div>
    <div style="font-weight:800;font-size:66px;letter-spacing:-3px;line-height:1.05;margin-top:6px">9 × 99</div>
    <div class="m" style="font-size:18px;letter-spacing:2px;color:${LIME}">USDT · JUST REGISTER</div>
  </div>
  <img src="${BR}logo-official-white.png" style="position:absolute;left:80px;top:72px;height:38px">
  <div class="m" style="position:absolute;left:80px;top:220px;font-size:19px;letter-spacing:3px;color:${LIME}">HOTCOIN TURNS 9 · RELAY 01</div>
  <div style="position:absolute;left:80px;top:262px;font-weight:700;font-size:112px;line-height:.94;letter-spacing:-5px">Newcomer<br>kickoff.</div>
  <div style="position:absolute;left:80px;top:500px;font-weight:600;font-size:40px;letter-spacing:-1px;color:rgba(255,255,255,.75)">Register, verify, trade.<br><span style="color:#fff;font-weight:800">Up to <span style="color:${LIME}">18 USDT</span>.</span></div>
  <div style="position:absolute;left:80px;bottom:62px;display:flex;align-items:center;gap:22px">
    <div style="font-weight:700;font-size:24px;background:${LIME};color:${INK};padding:16px 30px;border-radius:999px">Join now →</div>
    <div class="m" style="font-size:19px;color:rgba(255,255,255,.6)">Nov 6 – 16 · 19,999 USDT pool</div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({viewport: {width: 1600, height: 900}, deviceScaleFactor: 2});
const pg = await ctx.newPage();
for (const [n, h] of [['kv-min-a-en', A], ['kv-min-b-en', B]]) {
  const f = `${DIR}/_${n}.html`; fs.writeFileSync(f, h);
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({path: `${DIR}/${n}.png`}); fs.unlinkSync(f);
}
await browser.close(); console.log('done');
