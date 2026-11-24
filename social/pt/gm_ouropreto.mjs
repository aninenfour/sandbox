// PT GM 24/11: Ouro Preto cobblestone ladeira, mono (photo is already B&W). The lime line climbs the curve of the lane to where it turns at the steps.
// Photo: Andre Antonelli (Unsplash H95h9znF6zc), Unsplash License. No data claims. Run: PW_PATH=$(npm root -g)/playwright node social/pt/gm_sp.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const P = 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/ouropreto-m.jpg`).toString('base64');
const L = 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png').toString('base64');
const LIME = '#B8F26A';
let seed = 5; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pts = [[510, 1545], [534, 1365], [576, 1215], [636, 1095], [696, 990], [738, 900], [756, 855]]; const N = pts.length - 1;
const d = 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' L'), e = pts[N];
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&display=block');
*{margin:0;padding:0}body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#111;color:#fff;font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}
</style></head><body>
<div style="position:absolute;inset:0;background:url(${P}) 0 -135px/1080px auto no-repeat"></div>
<div style="position:absolute;inset:0;background:linear-gradient(0deg,rgba(11,14,17,.8) 0%,rgba(11,14,17,.45) 22%,rgba(11,14,17,0) 40%)"></div>
<svg style="position:absolute;inset:0" width="1080" height="1350"><defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter></defs>
<path d="${d}" fill="none" stroke="${LIME}" stroke-width="13" opacity=".55" filter="url(#gl)"/><path d="${d}" fill="none" stroke="${LIME}" stroke-width="5" stroke-linejoin="round"/>
<circle cx="${e[0]}" cy="${e[1]}" r="12" fill="${LIME}"/><circle cx="${e[0]}" cy="${e[1]}" r="28" fill="none" stroke="${LIME}" stroke-width="3" opacity=".7"/></svg>
<div style="position:absolute;left:64px;bottom:72px">
  <div style="font-size:230px;font-weight:800;letter-spacing:-4px;line-height:.85;font-variation-settings:'opsz' 96,'wdth' 80">GM.</div>
  <div style="font-size:42px;font-weight:600;line-height:1.15;margin-top:18px">Terça em Ouro Preto.<br>Ladeira acima, como deve ser.</div>
</div>
<img src="${L}" style="position:absolute;right:56px;top:56px;height:34px">
</body></html>`;
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await pg.setContent(html, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
fs.mkdirSync(`${DIR}/day-2026-11-24-br`, {recursive: true}); await pg.screenshot({path: `${DIR}/day-2026-11-24-br/gm-ouropreto.png`}); await br.close(); console.log('ok');
