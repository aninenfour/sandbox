// PT GM 15/11: Pão de Açúcar from Botafogo/Urca beach, mono. The lime line follows the real skyline and climbs the
// Sugarloaf flank to the summit. Photo: Jonathan Borba (Unsplash j_ibL7ytVBY), Unsplash License. No data claims.
// Run: PW_PATH=$(npm root -g)/playwright node social/pt/gm_rio.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const P = 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/rio-m.jpg`).toString('base64');
const L = 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png').toString('base64');
const LIME = '#B8F26A', INK = '#0B0E11';
// skyline points (1080x1350 frame, image 1080 wide, centre crop offset -45px)
const pts = [[-10, 713], [80, 708], [160, 712], [240, 700], [300, 690], [334, 680], [350, 660], [366, 636], [381, 612], [394, 592], [406, 578], [415, 571], [420, 569]];
const d = 'M' + pts.map((p) => p.join(',')).join(' L'), e = pts[pts.length - 1];
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&display=block');
*{margin:0;padding:0}body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#ddd;font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}
</style></head><body>
<div style="position:absolute;inset:0;background:url(${P}) 0 -45px/1080px auto no-repeat"></div>
<svg style="position:absolute;inset:0" width="1080" height="1350"><defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter></defs>
<path d="${d}" fill="none" stroke="${LIME}" stroke-width="13" opacity=".55" filter="url(#gl)"/><path d="${d}" fill="none" stroke="${LIME}" stroke-width="5" stroke-linejoin="round"/>
<circle cx="${e[0]}" cy="${e[1]}" r="12" fill="${LIME}"/><circle cx="${e[0]}" cy="${e[1]}" r="28" fill="none" stroke="${LIME}" stroke-width="3" opacity=".7"/></svg>
<div style="position:absolute;left:72px;top:72px;color:${INK}">
  <div style="font-size:250px;font-weight:800;letter-spacing:-4px;line-height:.85;font-variation-settings:'opsz' 96,'wdth' 80">GM.</div>
  <div style="font-size:44px;font-weight:600;line-height:1.15;margin-top:18px">Domingo é dia de subir<br>sem pressa.</div>
</div>
<img src="${L}" style="position:absolute;right:64px;bottom:60px;height:36px">
</body></html>`;
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await pg.setContent(html, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
fs.mkdirSync(`${DIR}/publish/2026-11-15`, {recursive: true});
await pg.screenshot({path: `${DIR}/day-2026-11-15-br/gm-rio.png`}); await br.close(); console.log('ok');
