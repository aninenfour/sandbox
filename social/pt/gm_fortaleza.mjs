// PT GM 26/11: Fortaleza, kite over the beach, mono. The lime line is the kite string, rising from the beach to the kite.
// Photo: Rafael Oliveira (Unsplash 5VQh0sQGG8M), Unsplash License. No data claims. Run: PW_PATH=$(npm root -g)/playwright node social/pt/gm_sp.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const P = 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/fortaleza-m.jpg`).toString('base64');
const L = 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png').toString('base64');
const LIME = '#B8F26A';
let seed = 5; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pts = [[1018.3, 1509.3], [995.1, 1464.1], [972.0, 1418.4], [948.9, 1371.8], [925.7, 1323.9], [902.6, 1274.4], [879.4, 1222.8], [856.3, 1168.8], [833.1, 1112.3], [810.0, 1053.0], [786.9, 990.9], [763.7, 925.9], [740.6, 858.0], [717.4, 787.4], [694.3, 714.2], [671.1, 638.7], [648.0, 561.2], [624.9, 481.9], [601.7, 401.3], [578.6, 319.9], [555.4, 238.0]]; const N = pts.length - 1;
const d = 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' L'), e = pts[N];
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&display=block');
*{margin:0;padding:0}body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#111;color:#fff;font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}
</style></head><body>
<div style="position:absolute;inset:0;background:url(${P}) 0 -157px/1080px auto no-repeat"></div>
<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(11,14,17,.55) 0%,rgba(11,14,17,.2) 45%,rgba(11,14,17,0) 60%)"></div>
<svg style="position:absolute;inset:0" width="1080" height="1350"><defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter></defs>
<path d="${d}" fill="none" stroke="${LIME}" stroke-width="13" opacity=".55" filter="url(#gl)"/><path d="${d}" fill="none" stroke="${LIME}" stroke-width="5" stroke-linejoin="round"/>
<circle cx="${e[0]}" cy="${e[1]}" r="12" fill="${LIME}"/><circle cx="${e[0]}" cy="${e[1]}" r="28" fill="none" stroke="${LIME}" stroke-width="3" opacity=".7"/></svg>
<div style="position:absolute;left:64px;top:560px">
  <div style="font-size:230px;font-weight:800;letter-spacing:-4px;line-height:.85;font-variation-settings:'opsz' 96,'wdth' 80">GM.</div>
  <div style="font-size:42px;font-weight:600;line-height:1.15;margin-top:18px">Quinta em Fortaleza.<br>Vento a favor, linha firme.</div>
</div>
<img src="${L}" style="position:absolute;right:56px;bottom:56px;height:34px">
</body></html>`;
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await pg.setContent(html, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
fs.mkdirSync(`${DIR}/day-2026-11-26-br`, {recursive: true}); await pg.screenshot({path: `${DIR}/day-2026-11-26-br/gm-fortaleza.png`}); await br.close(); console.log('ok');
