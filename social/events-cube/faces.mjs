// Event faces for the cube: four standalone art cards (1600x1600), each with its own palette and one hero visual.
// Used as textures by cube3d.mjs. Data: see render.mjs header (announcement center, checked Nov 15, 2026).
// NEFE logo: CoinGecko image, silhouette upscaled (assets/nefe-mask.png). Wall Street photo: public-domain 1932 film frame.
// Run: PW_PATH=$(npm root -g)/playwright node social/events-cube/faces.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/events-cube', A = 'file://' + DIR + '/assets/';
const BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';

const base = `@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:800px;height:800px;overflow:hidden;position:relative;font-family:'Inter Tight',sans-serif}
.m{font-family:'JetBrains Mono',monospace}.abs{position:absolute}
.grain{position:absolute;inset:0;opacity:.18;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.tag{position:absolute;left:48px;top:44px;display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:3px}
.tag i{width:12px;height:12px;border-radius:50%;background:#B8F26A;box-shadow:0 0 0 5px rgba(184,242,106,.18),0 0 18px rgba(184,242,106,.9)}
.foot{position:absolute;left:48px;right:48px;bottom:40px;display:flex;justify-content:space-between;align-items:center;font-family:'JetBrains Mono';font-weight:700;font-size:14px;letter-spacing:2px}
.dots{position:absolute;inset:0;background-image:radial-gradient(currentColor 1.4px,transparent 1.8px);background-size:14px 14px}`;
const page = (body, css = '') => `<!doctype html><html><head><meta charset="utf-8"><style>${base}${css}</style></head><body>${body}<div class="grain"></div></body></html>`;

// 1. Futures protection: emerald, glossy shield catching falling red candles
const candles = Array.from({length: 9}, (_, k) => { const x = 70 + k * 78, h = 40 + ((k * 37) % 70), y = 120 + k * 34 + ((k * 13) % 30), red = k < 5;
  return `<g opacity="${red ? .9 : .55}"><line x1="${x}" x2="${x}" y1="${y - 20}" y2="${y + h + 20}" stroke="${red ? '#FF5468' : '#B8F26A'}" stroke-width="3"/><rect x="${x - 13}" y="${y}" width="26" height="${h}" rx="3" fill="${red ? '#FF5468' : '#B8F26A'}"/></g>`; }).join('');
const F1 = page(`
  <div class="abs" style="inset:0;background:radial-gradient(ellipse 80% 70% at 60% 35%,#0F5A40 0%,#06291E 55%,#021510 100%)"></div>
  <div class="dots" style="color:rgba(184,242,106,.10);mask-image:radial-gradient(ellipse 70% 60% at 70% 30%,#000,transparent)"></div>
  <svg class="abs" style="left:0;top:0" width="800" height="560" viewBox="0 0 800 560">${candles}</svg>
  <svg class="abs" style="left:420px;top:90px;filter:drop-shadow(0 30px 50px rgba(0,0,0,.55)) drop-shadow(0 0 40px rgba(184,242,106,.35))" width="300" height="348" viewBox="0 0 100 116">
    <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9FFD0"/><stop offset=".35" stop-color="#B8F26A"/><stop offset=".75" stop-color="#5FA73A"/><stop offset="1" stop-color="#2E6B1C"/></linearGradient>
      <linearGradient id="sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <path d="M50 3l43 15v34c0 30-19 50-43 61C26 102 7 82 7 52V18z" fill="url(#sg)"/>
    <path d="M50 10l36 12.5v29c0 25-16 42-36 51.5C30 93.5 14 76.5 14 51.5v-29z" fill="#0A3B2C"/>
    <path d="M50 10l36 12.5v29c0 6-1 11-3 16H17c-2-5-3-10-3-16v-29z" fill="url(#sh)" opacity=".25"/>
    <text x="50" y="66" text-anchor="middle" font-family="Inter Tight" font-weight="900" font-size="26" fill="#B8F26A" letter-spacing="-1">100%</text>
  </svg>
  <div class="tag" style="color:#B8F26A"><i></i>FUTURES PROTECTION</div>
  <div class="abs" style="left:48px;bottom:118px;color:#F2FFF7">
    <div style="font-size:92px;font-weight:900;letter-spacing:-4.5px;line-height:.9">Losses<br>covered.</div>
    <div style="font-size:24px;font-weight:600;margin-top:16px;color:rgba(242,255,247,.75)">Futures loss compensation, up to 500 USDT</div></div>
  <div class="foot" style="color:#B8F26A"><span>200,000 USDT POOL</span><span>ENDS NOV 20</span></div>`);

// 2. Wall Street: navy duotone halftone photo + ticker tape
const tick = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'META', 'GOOGL', 'AAPL', 'NVDA', 'TSLA'];
const F2 = page(`
  <div class="abs" style="inset:0;background:#0B1530"></div>
  <div class="abs" style="left:0;right:0;top:0;height:430px;background:url(${A}nyse-street.jpg) center 40%/cover;filter:grayscale(1) contrast(1.35) brightness(.95)"></div>
  <div class="abs" style="left:0;right:0;top:0;height:430px;background:#0B1530;mix-blend-mode:color"></div>
  <div class="abs" style="left:0;right:0;top:0;height:430px;background-image:radial-gradient(#0B1530 1.6px,transparent 2.2px);background-size:6px 6px;opacity:.55"></div>
  <div class="abs" style="left:0;right:0;top:0;height:430px;background:linear-gradient(180deg,rgba(11,21,48,.15) 0%,rgba(11,21,48,0) 40%,#0B1530 100%)"></div>
  <div class="abs" style="left:0;right:0;top:380px;height:58px;background:#F3E9D2;display:flex;align-items:center;gap:30px;padding-left:24px;white-space:nowrap;overflow:hidden;transform:rotate(-2deg);box-shadow:0 14px 30px rgba(0,0,0,.4)">
    ${tick.map((s) => `<span class="m" style="font-size:22px;font-weight:700;color:#0B1530">${s} <span style="color:#1F9D61">▲</span></span>`).join('')}</div>
  <div class="tag" style="color:#F3E9D2"><i></i>TRADFI · US STOCKS</div>
  <div class="abs" style="left:48px;bottom:118px;color:#F3E9D2">
    <div style="font-size:84px;font-weight:900;letter-spacing:-4px;line-height:.92">Trade<br>Wall Street.</div>
    <div style="font-size:24px;font-weight:600;margin-top:16px;color:rgba(243,233,210,.75)">Earn up to <b style="color:#B8F26A">1,060 USDT</b> in futures trial funds</div></div>
  <div class="foot" style="color:#F3E9D2"><span>EARNINGS SEASON</span><span>ENDS NOV 19</span></div>`);

// 3. Earn boost: warm amber, stacked 3D coins
const coin = (cx, cy, r, k) => `<g transform="translate(${cx},${cy})">${Array.from({length: k}, (_, i) => `<g transform="translate(0,${-i * 16})">
  <ellipse cx="0" cy="10" rx="${r}" ry="${r * .32}" fill="#8A5A12"/><rect x="${-r}" y="0" width="${2 * r}" height="10" fill="#A86E18"/>
  <ellipse cx="0" cy="0" rx="${r}" ry="${r * .32}" fill="url(#cg)"/><ellipse cx="0" cy="0" rx="${r * .72}" ry="${r * .22}" fill="none" stroke="#FFF1C2" stroke-width="2" opacity=".7"/></g>`).join('')}</g>`;
const F3 = page(`
  <div class="abs" style="inset:0;background:radial-gradient(ellipse 80% 70% at 65% 40%,#5A3A0A 0%,#2A1A04 55%,#140C02 100%)"></div>
  <div class="dots" style="color:rgba(255,196,77,.12);mask-image:radial-gradient(ellipse 70% 60% at 70% 35%,#000,transparent)"></div>
  <svg class="abs" style="left:250px;top:90px;filter:drop-shadow(0 30px 40px rgba(0,0,0,.6)) drop-shadow(0 0 50px rgba(255,190,70,.25))" width="520" height="430" viewBox="0 0 520 430">
    <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4CC"/><stop offset=".4" stop-color="#FFC94D"/><stop offset="1" stop-color="#C98A1E"/></linearGradient></defs>
    ${coin(110, 380, 70, 5)}${coin(260, 380, 70, 9)}${coin(410, 380, 70, 14)}
    <circle cx="430" cy="70" r="12" fill="#B8F26A"/><circle cx="430" cy="70" r="24" fill="none" stroke="#B8F26A" stroke-width="2" opacity=".5"/></svg>
  <div class="tag" style="color:#FFD36B"><i></i>EARN BOOST</div>
  <div class="abs" style="left:48px;bottom:118px;color:#FFF6E0">
    <div style="font-size:120px;font-weight:900;letter-spacing:-6px;line-height:.9">+20 <span style="font-size:54px;letter-spacing:-2px">USDT</span></div>
    <div style="font-size:24px;font-weight:600;margin-top:14px;color:rgba(255,246,224,.78)">Futures trial funds on your first fixed-term Earn</div></div>
  <div class="foot" style="color:#FFD36B"><span style="background:#FF5A3C;color:#fff;padding:6px 12px;border-radius:6px">LAST CALL</span><span>ENDS NOV 16 · 12:00</span></div>`);

// 4. NEFE Earn: royal purple, gold NEFE coin
const F4 = page(`
  <div class="abs" style="inset:0;background:radial-gradient(ellipse 80% 70% at 60% 40%,#6B2FA0 0%,#33124F 55%,#180826 100%)"></div>
  <svg class="abs" style="left:0;top:0;opacity:.18" width="800" height="800" viewBox="0 0 800 800"><g fill="none" stroke="#F3E3A0" stroke-width="1.5">
    ${Array.from({length: 12}, (_, k) => `<path d="M${400 - k * 60} 640 L400 ${200 - k * 20} L${400 + k * 60} 640"/>`).join('')}</g></svg>
  <div class="abs" style="left:300px;top:96px;width:380px;height:380px;border-radius:50%;background:conic-gradient(from 210deg,#FFF3C4,#D9B45A,#8C6A22,#E9CF7E,#FFF3C4);
    box-shadow:0 40px 70px rgba(0,0,0,.55),0 0 80px rgba(243,227,160,.35),inset 0 0 0 10px rgba(255,255,255,.15)">
    <div class="abs" style="inset:22px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#7B3CB0,#4A1C70 70%);box-shadow:inset 0 6px 20px rgba(0,0,0,.45)"></div>
    <img class="abs" src="${A}nefe-gold.png" style="left:40px;top:40px;width:300px;height:300px;filter:drop-shadow(0 4px 6px rgba(0,0,0,.35))"></div>
  <div class="tag" style="color:#F3E3A0"><i></i>NEFE EARN</div>
  <div class="abs" style="left:48px;bottom:118px;color:#FFF8E4">
    <div style="font-size:150px;font-weight:900;letter-spacing:-8px;line-height:.85">15<span style="color:#F3E3A0">%</span></div>
    <div style="font-size:24px;font-weight:600;margin-top:16px;color:rgba(255,248,228,.78)">Est. APR on NEFE, 180-day fixed term</div></div>
  <div class="foot" style="color:#F3E3A0"><span>LIMITED QUOTA</span><span>FIRST COME, FIRST SERVED</span></div>`);

const browser = await chromium.launch();
const pg = await (await browser.newContext({viewport: {width: 800, height: 800}, deviceScaleFactor: 2})).newPage();
fs.mkdirSync(DIR + '/out', {recursive: true});
for (const [n, h] of [['face-1-futures', F1], ['face-2-tradfi', F2], ['face-3-earn', F3], ['face-4-nefe', F4]]) {
  const f = `${DIR}/_${n}.html`; fs.writeFileSync(f, h);
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({path: `${DIR}/out/${n}.png`}); fs.unlinkSync(f);
}
await browser.close(); console.log('done');
