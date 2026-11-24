// Design options for the daily events slides (Nov 24 request): keep key art + title + subtitle only,
// new backgrounds, no italics, no detail rows/chips/footers. Renders out/proto/<opt>-<slug>.png
import fs from 'fs'; import path from 'path'; import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH || 'playwright');
const DIR = path.dirname(new URL(import.meta.url).pathname) + '/..', ROOT = DIR + '/../..';
const DATA = JSON.parse(fs.readFileSync(`${DIR}/events.json`, 'utf8'));
const b64 = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const WM = b64(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-white.png`);
const INK = '#07090A', LIME = '#B8F26A';
const slugs = (process.argv[2] || 'HotcoinFixed-TermEarnExclusive,tradfi-0-fee-carnival').split(',');
const head = `<meta charset="utf-8"><style>@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;color:#fff;font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}</style>`;
const logo = `<img src="${WM}" style="position:absolute;left:72px;top:68px;height:40px;z-index:5">`;
const OPT = {
  // A: spotlight. Near-black, one soft lime glow behind the art, floor shadow, text bottom-left.
  spotlight: (c, art) => `${head}<body style="background:${INK}">
<div style="position:absolute;inset:0;background:radial-gradient(ellipse 560px 460px at 540px 520px,rgba(184,242,106,.34),rgba(184,242,106,.09) 55%,transparent 75%)"></div>
<div style="position:absolute;left:190px;right:190px;top:850px;height:60px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.75),transparent)"></div>
${logo}<img src="${art}" style="position:absolute;left:50%;top:170px;transform:translateX(-50%);width:820px;height:700px;object-fit:contain">
<div style="position:absolute;left:72px;right:72px;bottom:96px">
 <div style="font-weight:600;font-size:52px;letter-spacing:-1px;color:rgba(255,255,255,.92)">${c.short}</div>
 <div style="font-weight:800;font-size:112px;letter-spacing:-4px;line-height:1;color:${LIME};margin-top:14px">${c.headline}</div></div></body>`,
  // B: lime block. Art on ink, bottom third solid brand lime with ink type.
  limeblock: (c, art) => `${head}<body style="background:linear-gradient(#0B0E11,#14181C 70%)">
<div style="position:absolute;inset:0;background:radial-gradient(ellipse 520px 380px at 540px 560px,rgba(255,255,255,.07),transparent 70%)"></div>
${logo}<img src="${art}" style="position:absolute;left:50%;top:150px;transform:translateX(-50%);width:860px;height:740px;object-fit:contain;z-index:2">
<div style="position:absolute;left:0;right:0;bottom:0;height:410px;background:${LIME};padding:70px 72px 0;color:#0B0E11">
 <div style="font-weight:600;font-size:50px;letter-spacing:-1px">${c.short}</div>
 <div style="font-weight:800;font-size:116px;letter-spacing:-4.5px;line-height:1;margin-top:18px">${c.headline}</div></div></body>`,
  // C: orbit. Dark gradient, thin concentric lime rings + fine dot grid behind the art, centred type on top.
  orbit: (c, art) => `${head}<body style="background:radial-gradient(ellipse at 50% 62%,#151A1E,#07090A 70%)">
<div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.6px);background-size:28px 28px;-webkit-mask-image:radial-gradient(ellipse 520px 470px at 540px 840px,#000,transparent)"></div>
<svg style="position:absolute;left:0;top:0" width="1080" height="1350">${[200, 300, 400, 500].map((r, i) => `<circle cx="540" cy="840" r="${r}" fill="none" stroke="${LIME}" stroke-opacity="${[.8, .5, .3, .16][i]}" stroke-width="2"/>`).join('')}</svg>
${logo}<div style="position:absolute;left:72px;right:72px;top:190px;text-align:center">
 <div style="font-weight:600;font-size:50px;letter-spacing:-1px;color:rgba(255,255,255,.92)">${c.short}</div>
 <div style="font-weight:800;font-size:112px;letter-spacing:-4px;line-height:1;color:${LIME};margin-top:16px">${c.headline}</div></div>
<img src="${art}" style="position:absolute;left:50%;top:500px;transform:translateX(-50%);width:800px;height:680px;object-fit:contain"></body>`,
};
const out = `${DIR}/out/proto`; fs.mkdirSync(out, {recursive: true});
const br = await chromium.launch(); const p = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [name, fn] of Object.entries(OPT)) for (const s of slugs) {
  await p.setContent(`<!doctype html><html>${fn(DATA[s], b64(`${DIR}/art/cut-${s}.png`))}</html>`, {waitUntil: 'networkidle'}); await p.waitForTimeout(300);
  await p.screenshot({path: `${out}/${name}-${s}.png`}); console.log(`${out}/${name}-${s}.png`);
}
await br.close();
