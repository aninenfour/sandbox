// "Since GTA 6 came out": 3 style variants (cover + one item frame each) for the user to choose from. 4:5, rendered at 2x.
// GTA 6 launch: Nov 19, 2026 (Rockstar Newswire). NVDA closes: Yahoo Finance chart API, cross-checked with press (Nov 20 close $125.53, -14.0% on the day).
// Baseline = last price before launch: stocks Nov 18 close; crypto Binance Nov 19 00:00 UTC open. "Now": stocks Nov 20 close, crypto Nov 22.
// BTC logo: CoinGecko. Miami photo: Valeriia Neganova, Unsplash dEvKYQWc3Qw (mono, hotel sign removed).
// Run: PW_PATH=$(npm root -g)/playwright node social/gta6-cheaper/variants.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const A = 'file://' + DIR + 'assets/';
const BR = 'file://' + DIR + '../../hotcoin-tradfi/public/brand/';
const NV = [['Nov 4', 200.13], ['5', 181.6], ['6', 186.64], ['9', 178.67], ['10', 168.89], ['11', 173.73], ['12', 166.19], ['13', 162.85], ['16', 156.14], ['17', 155.46], ['18', 150.96], ['19', 145.98], ['20', 125.53]];
const LIST = [['NVDA', 'Nvidia', -16.8], ['TSLA', 'Tesla', -9.9], ['DOGE', 'Dogecoin', -6.4], ['GOLD', 'Gold', -6.1], ['SPX', 'S&P 500', -5.6], ['SOL', 'Solana', -4.8], ['ETH', 'Ether', -4.2], ['BTC', 'Bitcoin', -3.8]];

function chart(w, h, {stroke, fill, grid, text, mark, pad = 0}) {
  const vals = NV.map((d) => d[1]); const mn = 115, mx = 205;
  const X = (i) => (i / (NV.length - 1)) * (w - 100), Y = (v) => h - ((v - mn) / (mx - mn)) * h;
  const pts = NV.map((d, i) => `${X(i).toFixed(1)},${Y(d[1]).toFixed(1)}`).join(' ');
  const li = 11; const lx = (X(10) + X(11)) / 2;
  return `<svg width="${w}" height="${h + 60}" viewBox="0 0 ${w} ${h + 60}" style="overflow:visible">
   ${[125, 150, 175, 200].map((v) => `<line x1="0" x2="${w - 90}" y1="${Y(v)}" y2="${Y(v)}" stroke="${grid}" stroke-width="1.5"/><text x="${w}" y="${Y(v) + 7}" text-anchor="end" font-family="JetBrains Mono" font-size="20" fill="${text}">$${v}</text>`).join('')}
   <polygon points="${X(0)},${h} ${pts} ${X(NV.length - 1)},${h}" fill="${fill}"/>
   <polyline points="${pts}" fill="none" stroke="${stroke}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
   <line x1="${lx}" x2="${lx}" y1="-10" y2="${h}" stroke="${mark}" stroke-width="2.5" stroke-dasharray="8 8"/>
   <text x="${lx - 14}" y="10" text-anchor="end" font-family="JetBrains Mono" font-weight="700" font-size="21" fill="${mark}">GTA 6 OUT · NOV 19</text>
   <circle cx="${X(NV.length - 1)}" cy="${Y(125.53)}" r="11" fill="${stroke}"/>
   <text x="0" y="${h + 44}" font-family="JetBrains Mono" font-size="20" fill="${text}">NOV 4</text>
   <text x="${w - 100}" y="${h + 44}" text-anchor="end" font-family="JetBrains Mono" font-size="20" fill="${text}">NOV 20</text></svg>`;
}

const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block">`;
const BASE = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;font-family:'Inter Tight'}
.mono{font-family:'JetBrains Mono';letter-spacing:3px;text-transform:uppercase}.bri{font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96,'wdth' 78;font-weight:800}
.logo{position:absolute;left:64px;top:60px;height:40px}.pg{position:absolute;right:64px;top:68px;font-size:20px}`;

// ---------- A: price tags on warm paper ----------
function tag({sym, name, old, now, pct, rot = -4, scale = 1, x, y, logo}) {
  return `<div class="tag" style="left:${x}px;top:${y}px;transform:rotate(${rot}deg) scale(${scale})">
   <div class="str"></div><div class="hole"></div>
   <div class="tsym mono">${logo ? `<img src="${logo}">` : ''}${sym} · ${name}</div>
   <div class="old">$${old}</div><div class="now bri">$${now}</div>
   <div class="stk bri">${pct}%</div></div>`;
}
const A_CSS = `body{background:#f3f1ec;color:#0b0e11}
.tag{position:absolute;width:560px;height:330px;background:#fff;border-radius:28px 28px 28px 28px;box-shadow:0 30px 60px rgba(40,30,10,.14),0 2px 0 rgba(0,0,0,.04);padding:70px 56px 0 96px;transform-origin:20px 165px;
 clip-path:polygon(70px 0,100% 0,100% 100%,70px 100%,0 75%,0 25%)}
.hole{position:absolute;left:40px;top:150px;width:30px;height:30px;border-radius:50%;background:#f3f1ec;box-shadow:inset 0 2px 4px rgba(0,0,0,.15)}
.str{display:none}
.tsym{font-size:22px;color:#59606a;display:flex;align-items:center;gap:12px}.tsym img{width:34px;height:34px}
.old{margin-top:22px;font-size:46px;font-weight:600;color:#9aa0a6;text-decoration:line-through;text-decoration-thickness:4px;text-decoration-color:#e5484d}
.now{font-size:118px;letter-spacing:-3px;line-height:1;margin-top:2px}
.stk{position:absolute;right:-30px;top:-34px;width:170px;height:170px;border-radius:50%;background:#e5484d;color:#fff;display:flex;align-items:center;justify-content:center;font-size:52px;letter-spacing:-1px;transform:rotate(10deg)}
.k{position:absolute;left:64px;top:170px;font-size:22px;color:#e5484d;font-weight:700}
.h{position:absolute;left:64px;top:214px;width:950px;font-size:104px;line-height:.92;letter-spacing:-3px}
.sub{position:absolute;left:64px;font-size:32px;font-weight:600;color:#59606a}
.twine{position:absolute;pointer-events:none}`;
function variantA() {
  const cover = `<div class="k mono">Since Nov 19, 2026</div>
   <div class="h bri">GTA 6 is out.<br>Almost everything else went on sale.</div>
   ${tag({sym: 'BTC', name: 'Bitcoin', old: '63,068', now: '60,677', pct: '−3.8', rot: -6, x: 70, y: 690, logo: A + 'btc.png'})}
   ${tag({sym: 'NVDA', name: 'Nvidia', old: '150.96', now: '125.53', pct: '−16.8', rot: 5, x: 440, y: 960})}
   <div class="sub mono" style="top:1270px;font-size:20px;letter-spacing:3px">Swipe for the full sale →</div>`;
  const item = `<div class="k mono">Since GTA 6 · Nov 19</div>
   <div class="h bri" style="font-size:96px">Nvidia got<br><span style="color:#e5484d">16.8% cheaper.</span></div>
   ${tag({sym: 'NVDA', name: 'Nvidia', old: '150.96', now: '125.53', pct: '−16.8', rot: -3, scale: 1.5, x: 200, y: 680})}
   <div class="sub mono" style="top:1226px;font-size:20px;letter-spacing:3px">Nov 18 close → Nov 20 close</div>`;
  return [cover, item].map((b, i) => `<style>${BASE}${A_CSS}</style><img class="logo" src="${BR}logo-official-black.png"><div class="pg mono">${['01', '02'][i]} / 10</div>${b}`);
}

// ---------- B: white data post ----------
const B_CSS = `body{background:#fff;color:#0b0e11}
.k{position:absolute;left:64px;top:170px;font-size:22px;color:#59606a;font-weight:700}
.big{position:absolute;left:58px;top:205px;font-size:300px;letter-spacing:-10px;line-height:1;color:#e5484d}
.l1{position:absolute;left:64px;top:520px;font-size:46px;font-weight:800;letter-spacing:-1px}
.l2{position:absolute;left:64px;top:578px;font-size:36px;font-weight:600;color:#8a9096}
.ch{position:absolute;left:64px;top:700px}
.tb{position:absolute;left:64px;right:64px;top:1150px;display:flex;border-top:1.5px solid #e3e5e8}
.tb div{flex:1;padding-top:22px}.tb .lb{font-size:18px;color:#8a9096}.tb .v{font-size:44px;font-weight:800;margin-top:8px;letter-spacing:-1px}
.row{display:flex;align-items:center;height:72px;border-top:1.5px solid #eceef0;font-size:32px;font-weight:700}
.row .s{width:110px;font-family:'JetBrains Mono';font-size:22px;color:#8a9096}.row .n{width:230px}.row .bar{flex:1;height:22px;position:relative}
.row .bar i{position:absolute;left:0;top:0;bottom:0;background:#e5484d;border-radius:3px}.row .p{width:150px;text-align:right;color:#e5484d;font-weight:800}`;
function variantB() {
  const rows = LIST.map(([s, n, p]) => `<div class="row"><div class="s">${s}</div><div class="n">${n}</div><div class="bar"><i style="width:${(-p / 16.8) * 100}%"></i></div><div class="p">${p.toFixed(1).replace('-', '−')}%</div></div>`).join('');
  const cover = `<div class="k mono">Since GTA 6 came out · Nov 19</div>
   <div class="bri" style="position:absolute;left:64px;top:214px;width:950px;font-size:100px;line-height:.92;letter-spacing:-3px">GTA 6 is out.<br>Almost everything<br>else went <span style="color:#e5484d">on sale.</span></div>
   <div style="position:absolute;left:64px;right:64px;top:640px">${rows}<div style="border-top:1.5px solid #eceef0"></div></div>
   <div class="mono" style="position:absolute;left:64px;top:1262px;font-size:18px;color:#8a9096">Stocks: Nov 18 → Nov 20 close · Crypto: Nov 19 → Nov 22 (UTC)</div>`;
  const item = `<div class="k mono">Nvidia · NVDA</div><div class="big bri">−16.8%</div>
   <div class="l1">Nvidia since GTA 6 came out.</div><div class="l2">$150.96 → $125.53 in two trading days.</div>
   <div class="ch">${chart(952, 340, {stroke: '#e5484d', fill: 'rgba(229,72,77,.08)', grid: '#eceef0', text: '#9aa0a6', mark: '#0b0e11'})}</div>
   <div class="tb"><div><div class="lb mono">Before launch</div><div class="v">$150.96</div></div><div><div class="lb mono">Now</div><div class="v">$125.53</div></div><div><div class="lb mono">Change</div><div class="v" style="color:#e5484d">−$25.43</div></div></div>`;
  return [cover, item].map((b, i) => `<style>${BASE}${B_CSS}</style><img class="logo" src="${BR}logo-official-black.png"><div class="pg mono" style="color:#8a9096">${['01', '02'][i]} / 10</div>${b}`);
}

// ---------- C: Miami at night, red line ----------
const C_CSS = `body{background:#07090a;color:#fff}
.ph{position:absolute;inset:0;width:1080px;height:1350px;object-fit:cover;object-position:center 60%;opacity:.9}
.sc{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,9,10,.96) 0%,rgba(7,9,10,.85) 40%,rgba(7,9,10,.35) 62%,rgba(7,9,10,.85) 100%)}
.k{position:absolute;left:64px;top:170px;font-size:22px;color:#ff6b6f;font-weight:700}`;
function variantC() {
  const cover = `<img class="ph" src="${A}miami-m.jpg"><div class="sc"></div>
   <div class="k mono">Nov 19, 2026</div>
   <div class="bri" style="position:absolute;left:64px;top:212px;font-size:178px;line-height:.86;letter-spacing:-6px">GTA 6<br>is out.</div>
   <div class="bri" style="position:absolute;left:64px;top:560px;width:900px;font-size:70px;line-height:.95;letter-spacing:-2px;color:#ff6b6f">Almost everything else went on sale.</div>
   <div style="position:absolute;left:64px;right:64px;bottom:72px;display:flex;justify-content:space-between">${LIST.slice(0, 4).map(([s, , p]) => `<div><div class="mono" style="font-size:20px;color:rgba(255,255,255,.75)">${s}</div><div class="bri" style="font-size:66px;color:#ff6b6f;letter-spacing:-2px">${p.toFixed(1).replace('-', '−')}%</div></div>`).join('')}</div>`;
  const item = `<img class="ph" src="${A}miami-m.jpg"><div class="sc"></div>
   <div class="k mono">Nvidia · NVDA · since GTA 6</div>
   <div class="bri" style="position:absolute;left:52px;top:200px;font-size:290px;line-height:1;letter-spacing:-12px;color:#ff6b6f">−16.8%</div>
   <div style="position:absolute;left:64px;top:510px;font-size:40px;font-weight:700">$150.96 <span style="color:rgba(255,255,255,.55)">→</span> $125.53</div>
   <div style="position:absolute;left:64px;top:640px">${chart(952, 330, {stroke: '#ff6b6f', fill: 'rgba(255,107,111,.10)', grid: 'rgba(255,255,255,.14)', text: 'rgba(255,255,255,.7)', mark: '#fff'})}</div>`;
  return [cover, item].map((b, i) => `<style>${BASE}${C_CSS}</style>${b}<img class="logo" src="${BR}logo-official-white.png"><div class="pg mono" style="color:rgba(255,255,255,.75)">${['01', '02'][i]} / 10</div>`);
}

const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
fs.mkdirSync(DIR + 'out', {recursive: true});
const sets = {A: variantA(), B: variantB(), C: variantC()};
for (const [k, frames] of Object.entries(sets)) for (const [i, body] of frames.entries()) {
  const f = DIR + `_v-${process.pid}.html`;
  fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8">${FONTS}</head><body>${body}</body></html>`);
  await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  await p.screenshot({path: DIR + `out/var-${k}-${i + 1}.png`}); fs.unlinkSync(f);
}
await b.close(); console.log('ok');
