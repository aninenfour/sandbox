// PT GM 19/11: Belo Horizonte and the Serra do Curral at first light, mono. The lime line traces the real ridge line (detected from the photo) and ends on its highest point.
// Photo: Alvaro Guerrero (Unsplash mGUHn-CBB6c), Unsplash License. No data claims. Run: PW_PATH=$(npm root -g)/playwright node social/pt/gm_sp.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const P = 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/bh-m.jpg`).toString('base64');
const L = 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png').toString('base64');
const LIME = '#B8F26A';
let seed = 5; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pts = [[1090, 950.3], [1068.0, 950.3], [1056.0, 950.5], [1044.0, 950.8], [1032.0, 950.9], [1020.0, 950.3], [1008.0, 948.5], [996.0, 946.3], [984.0, 943.9], [972.0, 941.5], [960.0, 940.1], [948.0, 938.9], [936.0, 936.6], [924.0, 934.2], [912.0, 932.0], [900.0, 929.3], [888.0, 927.2], [876.0, 926.0], [864.0, 925.1], [852.0, 924.6], [840.0, 925.1], [828.0, 925.8], [816.0, 926.7], [804.0, 928.1], [792.0, 929.7], [780.0, 931.8], [768.0, 934.2], [756.0, 936.8], [744.0, 938.9], [732.0, 940.4], [720.0, 941.7], [708.0, 942.8], [696.0, 943.7], [684.0, 943.6], [672.0, 943.3], [660.0, 942.2], [648.0, 940.8], [636.0, 939.1], [624.0, 938.3], [612.0, 937.9], [600.0, 937.4], [588.0, 937.0], [576.0, 937.0], [564.0, 936.9], [552.0, 936.4], [540.0, 935.4], [528.0, 934.0], [516.0, 932.2], [504.0, 930.7], [492.0, 929.1], [480.0, 928.2], [468.0, 927.0], [456.0, 925.4], [444.0, 923.3], [432.0, 921.5], [420.0, 920.0], [408.0, 919.5]]; const N = pts.length - 1;
const d = 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' L'), e = pts[N];
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&display=block');
*{margin:0;padding:0}body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#111;color:#fff;font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}
</style></head><body>
<div style="position:absolute;inset:0;background:url(${P}) 0 -90px/1080px auto no-repeat"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,14,17,.7) 0%,rgba(11,14,17,.3) 24%,rgba(11,14,17,0) 36%)"></div>
<svg style="position:absolute;inset:0" width="1080" height="1350"><defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter></defs>
<path d="${d}" fill="none" stroke="${LIME}" stroke-width="13" opacity=".55" filter="url(#gl)"/><path d="${d}" fill="none" stroke="${LIME}" stroke-width="5" stroke-linejoin="round"/>
<circle cx="${e[0]}" cy="${e[1]}" r="12" fill="${LIME}"/><circle cx="${e[0]}" cy="${e[1]}" r="28" fill="none" stroke="${LIME}" stroke-width="3" opacity=".7"/></svg>
<div style="position:absolute;left:64px;top:64px">
  <div style="font-size:230px;font-weight:800;letter-spacing:-4px;line-height:.85;font-variation-settings:'opsz' 96,'wdth' 80">GM.</div>
  <div style="font-size:42px;font-weight:600;line-height:1.15;margin-top:18px">Quinta em BH.<br>Até a serra já acordou em gráfico.</div>
</div>
<img src="${L}" style="position:absolute;right:56px;bottom:56px;height:34px">
</body></html>`;
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await pg.setContent(html, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
fs.mkdirSync(`${DIR}/day-2026-11-19-br`, {recursive: true}); await pg.screenshot({path: `${DIR}/day-2026-11-19-br/gm-bh.png`}); await br.close(); console.log('ok');
