// "GTA VI is out. Almost everything else went on sale." 10-slide carousel, 4:5, rendered at 2x.
// Comparison: last price before launch vs LOWEST price since launch (Nov 19 00:00 UTC to Nov 22, 2026).
//  - Stocks / gold / S&P: Nov 18 close vs lowest intraday low on Nov 19 to 20 (Yahoo Finance daily bars). Markets closed Nov 21 to 22.
//  - Crypto: Binance 1h klines, Nov 19 00:00 UTC open vs lowest 1h low since (all crypto lows on Nov 21, 04:00 to 06:00 UTC).
// GTA VI launch Nov 19, 2026: rockstargames.com Newswire. NVDA Nov 20 -14% day: press (Motley Fool, Nov 20).
// GTA VI logo: official file from rockstargames.com/VI (trademark of Take-Two/Rockstar; used to name the event only).
// Coin logos: CoinGecko. Backgrounds: FLUX schnell (fal), garbled signage blurred, mostly black and white.
// Run: PW_PATH=$(npm root -g)/playwright node social/gta6-cheaper/carousel.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const A = 'file://' + DIR + 'assets/';
const BR = 'file://' + DIR + '../../hotcoin-tradfi/public/brand/';
const D = JSON.parse(fs.readFileSync(DIR + 'data.json', 'utf8'));
const RED = '#ff5a5f', GREEN = '#2dbd85';
const GTA = `<img class="gta" src="${A}gta6-logo.png" alt="GTA VI">`;

const ITEMS = [
  {k: 'BTC', name: 'Bitcoin', logo: 'btc.png', bg: 'bg-4.jpg', b: '$63,068', l: '$55,130', when: 'Nov 21'},
  {k: 'NVDA', name: 'Nvidia', bg: 'bg-6.jpg', b: '$150.96', l: '$124.50', when: 'Nov 20'},
  {k: 'ETH', name: 'Ether', logo: 'eth.png', bg: 'bg-3.jpg', b: '$1,777', l: '$1,538', when: 'Nov 21'},
  {k: 'DOGE', name: 'Dogecoin', logo: 'doge.png', bg: 'bg-5.jpg', b: '$0.0588', l: '$0.0508', when: 'Nov 21'},
  {k: 'SOL', name: 'Solana', logo: 'sol.png', bg: 'bg-1.jpg', b: '$73.63', l: '$64.87', when: 'Nov 21'},
  {k: 'TSLA', name: 'Tesla', bg: 'bg-2.jpg', b: '$383.72', l: '$344.33', when: 'Nov 20'},
  {k: 'GOLD', name: 'Gold futures', bg: 'bg-7.jpg', b: '$3,741.90', l: '$3,502.90', when: 'Nov 20'},
  {k: 'TTWO', name: 'Take-Two', bg: 'bg-5.jpg', flip: true, b: '$216.61', l: '$200.01', when: 'Nov 20', head: 'Even the publisher of'},
];
const pct = (k) => (D[k].low / D[k].base - 1) * 100;
const fmt = (p) => `<span style="margin-right:.07em">${p < 0 ? '−' : '+'}</span>` + Math.abs(p).toFixed(1) + '%';

function chart(k, w, h, color) {
  const {pts, base, low, launch} = D[k];
  const vals = pts.map((p) => p[1]).concat([low, base]);
  const mn = Math.min(...vals), mx = Math.max(...vals), padv = (mx - mn) * 0.08;
  const X = (i) => (i / (pts.length - 1)) * w, Y = (v) => 14 + (1 - (v - (mn - padv)) / (mx - mn + 2 * padv)) * (h - 28);
  const li = pts.findIndex((p) => p[0] >= launch);
  const after = pts.slice(li); const mi = li + after.reduce((b, p, i) => (p[1] < after[b][1] ? i : b), 0);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(p[1]).toFixed(1)}`).join(' ');
  const lx = X(li), dx = X(mi), dy = Y(low), anchor = dx > w * 0.7 ? 'end' : 'start', tx = anchor === 'end' ? dx - 24 : dx + 24;
  return `<svg width="${w}" height="${h}" style="overflow:visible">
   <defs><linearGradient id="fa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient>
   <filter id="gl"><feGaussianBlur stdDeviation="7"/></filter></defs>
   <path d="${d} L${w} ${h} L0 ${h} Z" fill="url(#fa)"/>
   <line x1="0" x2="${w}" y1="${Y(base)}" y2="${Y(base)}" stroke="rgba(255,255,255,.35)" stroke-width="2" stroke-dasharray="3 9"/>
   <line x1="${lx}" x2="${lx}" y1="-30" y2="${h}" stroke="rgba(255,255,255,.75)" stroke-width="2.5" stroke-dasharray="9 9"/>
   <text x="${lx - 14}" y="-12" text-anchor="end" font-family="JetBrains Mono" font-weight="700" font-size="20" fill="#fff" letter-spacing="2">LAUNCH</text>
   <path d="${d}" fill="none" stroke="${color}" stroke-width="12" opacity=".45" filter="url(#gl)"/>
   <path d="${d}" fill="none" stroke="${color}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
   <circle cx="${dx}" cy="${dy}" r="13" fill="${color}"/><circle cx="${dx}" cy="${dy}" r="26" fill="none" stroke="${color}" stroke-width="3" opacity=".6"/>
   <text x="${tx}" y="${dy + 8}" text-anchor="${anchor}" font-family="JetBrains Mono" font-weight="700" font-size="22" fill="#fff" letter-spacing="2">LOW</text></svg>`;
}

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#07090a;color:#fff;font-family:'Inter Tight'}
.mono{font-family:'JetBrains Mono';letter-spacing:3px;text-transform:uppercase}
.bri{font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96,'wdth' 78;font-weight:800}
.ph{position:absolute;left:0;top:0;width:1080px;height:1350px;object-fit:cover}
.scr{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,9,10,.95) 0%,rgba(7,9,10,.88) 45%,rgba(7,9,10,.62) 56%,rgba(7,9,10,.35) 66%,rgba(7,9,10,.6) 84%,rgba(7,9,10,.92) 100%)}
.logo{position:absolute;left:64px;top:60px;height:40px}.pg{position:absolute;right:64px;top:68px;font-size:20px;color:rgba(255,255,255,.75)}
.kick{position:absolute;left:64px;top:160px;display:flex;align-items:center;gap:16px;font-size:24px;font-weight:700}
.kick img{width:44px;height:44px}
.since{position:absolute;left:64px;top:218px;display:flex;align-items:center;gap:20px;font-size:58px;letter-spacing:-1px}
.since .gta{height:110px}
.big{position:absolute;left:52px;top:330px;font-size:280px;line-height:.9;letter-spacing:-12px}
.prices{position:absolute;left:64px;right:64px;top:640px;display:flex;gap:0}
.prices>div{flex:1}.prices>div+div{padding-left:44px;border-left:2px solid rgba(255,255,255,.22)}
.prices .lb{font-size:20px;color:rgba(255,255,255,.72)}.prices .v{font-size:58px;font-weight:800;letter-spacing:-1.5px;margin-top:6px}
.chart{position:absolute;left:64px;top:880px}`;
const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block">`;
const frame = (n, body) => `${body}<img class="logo" src="${BR}logo-official-white.png"><div class="pg mono">${String(n).padStart(2, '0')} / 10</div>`;
const bg = (f, flip, pos = 'center') => `<img class="ph" src="${A}${f}" style="object-position:${pos};${flip ? 'transform:scaleX(-1)' : ''}"><div class="scr"></div>`;

const slides = [];
// 1 cover: no numbers (no spoilers), just the hook and a teaser line (S&P 500 hourly path, unlabelled values)
slides.push(frame(1, `${bg('bg-0.jpg')}
 <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,9,10,.92) 0%,rgba(7,9,10,.7) 50%,rgba(7,9,10,.35) 66%,rgba(7,9,10,.85) 100%)"></div>
 <div class="mono" style="position:absolute;left:64px;top:160px;font-size:24px;font-weight:700;color:${RED}">Nov 19, 2026</div>
 <div style="position:absolute;left:64px;top:222px;display:flex;align-items:flex-end;gap:34px"><img src="${A}gta6-logo.png" style="height:300px"><div class="bri" style="font-size:176px;line-height:.82;letter-spacing:-6px;padding-bottom:6px">is<br>out.</div></div>
 <div class="bri" style="position:absolute;left:64px;top:575px;width:960px;font-size:150px;line-height:.86;letter-spacing:-5px;color:${RED}">The market<br>crashed.</div>
 <div class="chart" style="top:940px">${chart('SPX', 952, 230, RED)}</div>
 <div class="mono" style="position:absolute;right:64px;bottom:70px;font-size:22px;font-weight:700">How hard? Swipe →</div>`));
// 2 to 9 items
ITEMS.forEach((it, i) => {
  const p = pct(it.k);
  slides.push(frame(i + 2, `${bg(it.bg, it.flip)}
   <div class="kick mono" style="color:${RED}">${it.logo ? `<img src="${A}${it.logo}">` : ''}${it.name} · ${it.k}</div>
   <div class="since bri">${it.head || 'Lowest since'} ${GTA}</div>
   <div class="big bri" style="color:${RED}">${fmt(p)}</div>
   <div class="prices"><div><div class="lb mono">Before launch</div><div class="v">${it.b}</div></div><div><div class="lb mono">Lowest · ${it.when}</div><div class="v" style="color:${RED}">${it.l}</div></div></div>
   <div class="chart">${chart(it.k, 952, 300, RED)}</div>`));
});
// 10 CTA (GTA V came out Sep 17, 2013; GTA VI Nov 19, 2026: 13 years)
slides.push(frame(10, `${bg('bg-4.jpg', true)}
 <div class="mono" style="position:absolute;left:64px;top:160px;font-size:24px;font-weight:700;color:#b8f26a">2013 → 2026</div>
 <div style="position:absolute;left:64px;top:222px;display:flex;align-items:flex-end;gap:30px"><img src="${A}gta6-logo.png" style="height:230px"><div class="bri" style="font-size:120px;line-height:.86;letter-spacing:-4px;padding-bottom:4px">took<br>13 years.</div></div>
 <div class="bri" style="position:absolute;left:64px;top:520px;width:960px;font-size:120px;line-height:.88;letter-spacing:-4px">Your next trade<br>takes <span style="color:#b8f26a">seconds.</span></div>
 <div style="position:absolute;left:64px;right:64px;bottom:72px;display:flex;align-items:center;justify-content:space-between">
  <div style="font-size:32px;font-weight:700;line-height:1.2">Crypto and U.S. stocks<br><span style="color:rgba(255,255,255,.7)">in one app.</span></div>
  <div style="background:#b8f26a;color:#0b0e11;font-weight:800;font-size:38px;padding:24px 46px;border-radius:99px">hotcoin.com</div></div>`));

const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const pg = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
fs.mkdirSync(DIR + 'out', {recursive: true});
for (const [i, body] of slides.entries()) {
  const f = DIR + `_c-${process.pid}.html`;
  fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${CSS}</style></head><body>${body}</body></html>`);
  await pg.goto('file://' + f); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(350);
  await pg.screenshot({path: DIR + `out/gta6-${String(i + 1).padStart(2, '0')}.png`}); fs.unlinkSync(f);
}
await b.close(); console.log('ok', slides.length);
