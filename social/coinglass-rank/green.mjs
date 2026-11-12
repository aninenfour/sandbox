// CoinGlass #13, style B on Hotcoin green: three experiments (white sculpted 13 on brand green). 1080x1350 @2x.
// Same facts as render.mjs. Run: PW_PATH=$(npm root -g)/playwright node social/coinglass-rank/green.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/coinglass-rank';
const BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A', DEEP = '#2F5A17';
const base = `@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;font-family:'Inter Tight',sans-serif;color:#fff}.m{font-family:'JetBrains Mono',monospace}`;
const page = (bg, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${base}body{background:${bg}}</style></head><body>
<div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.3px);background-size:5px 5px"></div>${body}</body></html>`;
const stats = [['24H VOLUME', '$6.17B'], ['OPEN INTEREST', '$155.44M'], ['TAKER / MAKER', '0.06% / 0.02%']];
const strip = (line = 'rgba(255,255,255,.3)', label = 'rgba(255,255,255,.75)') => `<div style="position:absolute;left:72px;right:72px;bottom:80px;display:flex;border-top:1.5px solid ${line};padding-top:28px">${stats.map(([k, v], i) => `<div style="flex:1;${i ? `border-left:1.5px solid ${line};padding-left:28px` : ''}"><div class="m" style="font-size:15px;letter-spacing:2px;color:${label}">${k}</div><div style="font-weight:700;font-size:${v.length > 9 ? 32 : 44}px;margin-top:8px">${v}</div></div>`).join('')}</div>`;
const head = (logo = 'white', tag = 'COINGLASS · RANKING', tc = '#fff') => `<img src="${BR}${logo === "white" ? "logo-mono-white.png" : "logo-official-" + logo + ".png"}" style="position:absolute;left:72px;top:72px;height:40px">
  <div class="m" style="position:absolute;right:72px;top:80px;font-size:18px;letter-spacing:3px;color:${tc}">${tag}</div>`;
const chrome = `background:linear-gradient(170deg,#FFFFFF 0%,#F4F7EF 30%,#C9D3BE 52%,#FFFFFF 70%,#DDE5D3 100%);-webkit-background-clip:text;color:transparent`;

// 1: brand green field, white chrome 13, deep green shadow
const G1 = page(`radial-gradient(ellipse 80% 60% at 50% 32%, #8FD066 0%, ${GREEN} 45%, #5E9B3F 100%)`, `
  ${head()}
  <div style="position:absolute;left:0;right:0;top:140px;text-align:center;font-weight:800;font-size:560px;letter-spacing:-42px;line-height:1;${chrome};filter:drop-shadow(0 34px 0 rgba(47,90,23,.45)) drop-shadow(0 60px 70px rgba(20,40,8,.45))">13</div>
  <div style="position:absolute;left:0;right:0;top:760px;text-align:center">
    <div style="display:inline-block;font-weight:700;font-size:26px;background:#fff;color:${DEEP};padding:10px 22px;border-radius:999px">Top derivatives exchanges</div>
    <div style="font-weight:800;font-size:82px;letter-spacing:-3px;line-height:1.02;margin-top:28px">Hotcoin is live<br>on CoinGlass.</div></div>
  ${strip()}`);

// 2: deep-to-lime gradient, frosted glass card holding the 13
const G2 = page(`linear-gradient(160deg, ${LIME} 0%, ${GREEN} 40%, ${DEEP} 100%)`, `
  <div style="position:absolute;right:-200px;top:-160px;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.45),rgba(255,255,255,0) 65%)"></div>
  ${head()}
  <div style="position:absolute;left:110px;right:110px;top:180px;height:600px;border-radius:48px;background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.55);backdrop-filter:blur(24px);box-shadow:0 40px 90px rgba(20,40,8,.35),inset 0 1px 0 rgba(255,255,255,.7)">
    <div class="m" style="position:absolute;left:44px;top:40px;font-size:18px;letter-spacing:3px">RANK</div>
    <div class="m" style="position:absolute;right:44px;top:40px;font-size:18px;letter-spacing:3px">DERIVATIVES</div>
    <div style="position:absolute;left:0;right:0;top:40px;text-align:center;font-weight:800;font-size:470px;letter-spacing:-34px;line-height:1.1;color:#fff;text-shadow:0 20px 50px rgba(20,40,8,.35)">13</div>
  </div>
  <div style="position:absolute;left:72px;right:72px;top:840px;text-align:center">
    <div style="font-weight:800;font-size:78px;letter-spacing:-3px;line-height:1.02">Ranked #13 on CoinGlass.</div>
    <div style="font-size:30px;font-weight:500;color:rgba(255,255,255,.85);margin-top:16px">Among the top crypto derivatives exchanges.</div></div>
  ${strip('rgba(255,255,255,.4)', 'rgba(255,255,255,.85)')}`);

// 3: solid brand green, outlined giant 13 cropped off the edge, white podium bar
const G3 = page(GREEN, `
  ${head()}
  <div style="position:absolute;left:-40px;top:110px;font-weight:800;font-size:860px;letter-spacing:-60px;line-height:1;color:transparent;-webkit-text-stroke:5px rgba(255,255,255,.9)">13</div>
  <div style="position:absolute;left:-40px;top:110px;font-weight:800;font-size:860px;letter-spacing:-60px;line-height:1;color:rgba(255,255,255,.12)">13</div>
  <div style="position:absolute;left:72px;right:72px;top:820px">
    <div style="display:flex;align-items:center;height:120px;background:#fff;border-radius:24px;padding:0 40px;color:${INK};box-shadow:0 30px 60px rgba(20,40,8,.35)">
      <div class="m" style="font-size:34px;font-weight:700;width:80px;color:${DEEP}">#13</div>
      <img src="${BR}logo-official-black.png" style="height:40px"><div style="flex:1"></div>
      <div class="m" style="font-size:28px;font-weight:700">$6.17B</div></div>
    <div style="font-weight:800;font-size:64px;letter-spacing:-2px;line-height:1.05;margin-top:36px">Now ranked on CoinGlass.</div></div>
  ${strip()}`);

const browser = await chromium.launch();
const pg = await (await browser.newContext({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2})).newPage();
for (const [n, h] of [['green-1-chrome', G1], ['green-2-glass-card', G2], ['green-3-outline', G3]]) {
  const f = `${DIR}/_${n}.html`; fs.writeFileSync(f, h);
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({path: `${DIR}/${n}.png`}); fs.unlinkSync(f);
}
await browser.close(); console.log('done');
