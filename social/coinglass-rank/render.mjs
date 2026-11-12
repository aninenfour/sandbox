// CoinGlass listing: Hotcoin ranked #13 among top crypto derivatives exchanges (CoinGlass "Exchanges" ranking, screenshot Nov 12, 2026).
// Hotcoin row: 24h volume $6.17B, open interest $155.44M, taker 0.06%, maker 0.02%, score 60.
// Three style directions (static), 1080x1350 @2x. Other exchanges are not named (neighbour rows are anonymous bars).
// CoinGlass appears as a text wordmark only (no logo file). Run: PW_PATH=$(npm root -g)/playwright node social/coinglass-rank/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/coinglass-rank';
const BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A', GRAY = '#6B7280';
const base = `@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Instrument+Serif:ital@0;1&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;font-family:'Inter Tight',sans-serif}.m{font-family:'JetBrains Mono',monospace}`;
const page = (css, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${base}${css}</style></head><body>${body}</body></html>`;
const stats = [['24H VOLUME', '$6.17B'], ['OPEN INTEREST', '$155.44M'], ['TAKER / MAKER', '0.06% / 0.02%']];

// A: white data post, CoinGlass-style table with our row lifted out
const rowsA = [11, 12, 13, 14, 15].map((n) => n === 13
  ? `<div style="position:relative;z-index:3;margin:14px -28px;display:flex;align-items:center;height:118px;padding:0 44px;background:#fff;border:3px solid ${INK};border-radius:22px;box-shadow:0 30px 60px rgba(11,14,17,.18),0 0 0 10px rgba(184,242,106,.55)">
      <div class="m" style="width:90px;font-size:34px;font-weight:700">13</div>
      <div style="font-size:38px;font-weight:800;flex:1">Hotcoin</div><div class="m" style="font-size:30px;font-weight:700">$6.17B</div></div>`
  : `<div style="display:flex;align-items:center;height:84px;padding:0 16px;border-bottom:1.5px solid #E6E8EB;opacity:.55">
      <div class="m" style="width:90px;font-size:26px;color:${GRAY}">${n}</div><div style="width:40px;height:40px;border-radius:99px;background:#E6E8EB;margin-right:18px"></div>
      <div style="width:${160 + (n * 37) % 90}px;height:20px;border-radius:10px;background:#E6E8EB;flex:none"></div><div style="flex:1"></div><div style="width:120px;height:20px;border-radius:10px;background:#E6E8EB"></div></div>`).join('');
const A = page(`body{background:#fff;color:${INK}}`, `
  <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(11,14,17,.06) 1px,transparent 1.3px);background-size:6px 6px;opacity:.5"></div>
  <div style="position:absolute;left:72px;right:72px;top:68px;display:flex;justify-content:space-between;align-items:center">
    <img src="${BR}logo-official-black.png" style="height:42px"><div class="m" style="font-size:18px;letter-spacing:2px;border:1.5px solid ${INK};border-radius:99px;padding:9px 18px">NOW LISTED ON COINGLASS</div></div>
  <div style="position:absolute;left:72px;top:180px">
    <div class="m" style="font-size:20px;letter-spacing:3px;color:${GRAY}">TOP DERIVATIVES EXCHANGES</div>
    <div style="font-weight:800;font-size:220px;letter-spacing:-12px;line-height:.9;color:#17A86B">#13</div>
    <div style="font-weight:700;font-size:52px;letter-spacing:-1.8px;line-height:1.08;margin-top:16px">Ranked on CoinGlass.<br><span style="color:${GRAY}">Day one of the listing.</span></div></div>
  <div style="position:absolute;left:72px;right:72px;top:640px">${rowsA}</div>
  <div style="position:absolute;left:72px;right:72px;bottom:72px;display:flex;gap:18px">${stats.map(([k, v]) => `<div style="flex:1;border:1.5px solid #E6E8EB;border-radius:20px;padding:20px 22px;background:#fff"><div class="m" style="font-size:15px;letter-spacing:2px;color:${GRAY}">${k}</div><div style="font-weight:800;font-size:${v.length > 9 ? 30 : 40}px;letter-spacing:-1px;margin-top:8px">${v}</div></div>`).join('')}</div>`);

// B: dark premium, glowing glass "13" with a lime accent
const B = page(`body{background:#050606;color:#F2F3EF}`, `
  <div style="position:absolute;left:140px;top:120px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(184,242,106,.28),rgba(126,194,90,.08) 45%,rgba(0,0,0,0) 70%)"></div>
  <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:72px 72px;mask-image:radial-gradient(ellipse 60% 55% at 50% 42%,#000,transparent)"></div>
  <img src="${BR}logo-official-white.png" style="position:absolute;left:72px;top:72px;height:40px">
  <div class="m" style="position:absolute;right:72px;top:80px;font-size:18px;letter-spacing:3px;color:${LIME}">COINGLASS · RANKING</div>
  <div style="position:absolute;left:0;right:0;top:170px;text-align:center;font-weight:800;font-size:560px;letter-spacing:-40px;line-height:1;
    background:linear-gradient(170deg,#FFFFFF 0%,#B8BDB4 35%,#2A2D2B 62%,#9FA39C 80%,#1A1C1B 100%);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 40px 60px rgba(0,0,0,.6))">13</div>
  <div style="position:absolute;left:0;right:0;top:700px;text-align:center">
    <div style="display:inline-block;font-weight:700;font-size:26px;background:${LIME};color:${INK};padding:10px 22px;border-radius:999px">Top derivatives exchanges</div>
    <div style="font-weight:700;font-size:80px;letter-spacing:-3px;line-height:1.02;margin-top:30px">Hotcoin is live<br>on <span style="color:${LIME}">CoinGlass.</span></div></div>
  <div style="position:absolute;left:72px;right:72px;bottom:80px;display:flex;border-top:1.5px solid rgba(255,255,255,.14);padding-top:28px">${stats.map(([k, v], i) => `<div style="flex:1;${i ? 'border-left:1.5px solid rgba(255,255,255,.14);padding-left:28px' : ''}"><div class="m" style="font-size:15px;letter-spacing:2px;color:rgba(242,243,239,.55)">${k}</div><div style="font-weight:700;font-size:${v.length > 9 ? 32 : 44}px;margin-top:8px">${v}</div></div>`).join('')}</div>`);

// C: dots / editorial, "13" in halftone dots, serif headline
const C = page(`body{background:#030404;color:#F2F3EF}`, `
  <canvas id="c" width="2160" height="2700" style="position:absolute;inset:0;width:1080px;height:1350px"></canvas>
  <img src="${BR}logo-official-white.png" style="position:absolute;left:72px;top:72px;height:38px">
  <div class="m" style="position:absolute;right:72px;top:80px;font-size:18px;letter-spacing:3px;color:rgba(242,243,239,.6)">NOV 2026</div>
  <div style="position:absolute;left:72px;right:72px;top:860px;text-align:center">
    <div class="m" style="font-size:20px;letter-spacing:5px;color:${LIME}">COINGLASS · TOP DERIVATIVES EXCHANGES</div>
    <div style="font-family:'Instrument Serif',serif;font-style:italic;font-size:110px;line-height:1;margin-top:22px">Ranked thirteenth.</div>
    <div style="font-size:30px;color:rgba(242,243,239,.6);margin-top:22px">$6.17B in 24h volume. Now tracked on CoinGlass.</div></div>
  <script>
    document.fonts.ready.then(()=>{const c=document.getElementById('c'),g=c.getContext('2d'),W=2160,H=2700;
      const o=document.createElement('canvas');o.width=W;o.height=H;const q=o.getContext('2d');q.fillStyle='#fff';q.font='800 1180px "Inter Tight"';q.textAlign='center';q.textBaseline='middle';q.fillText('13',W/2,H*0.36);
      const d=q.getImageData(0,0,W,H).data;
      for(let y=10;y<H;y+=20)for(let x=10;x<W;x+=20){const a=d[(y*W+x)*4+3];const r=Math.hypot(x-W/2,y-H*.36);
        if(a>120){const lime=((x*7+y*13)%9)===0;g.fillStyle=lime?'#B8F26A':'rgba(242,243,239,.92)';g.beginPath();g.arc(x+(Math.sin(y)*2),y,lime?6:5,0,6.283);g.fill();}
        else{const k=Math.max(0,1-r/1500)*.18;if(k>.02){g.fillStyle='rgba(242,243,239,'+k+')';g.beginPath();g.arc(x,y,2,0,6.283);g.fill();}}}
      document.body.dataset.ready=1;});
  </script>`);

const browser = await chromium.launch();
const pg = await (await browser.newContext({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2})).newPage();
for (const [n, h] of [['style-a-white-table', A], ['style-b-dark-glass', B], ['style-c-dots', C]]) {
  const f = `${DIR}/_${n}.html`; fs.writeFileSync(f, h);
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
  await pg.screenshot({path: `${DIR}/${n}.png`}); fs.unlinkSync(f);
}
await browser.close(); console.log('done');
