// PT channel GM posts v2: plain mono photos, one minimal lime line as the brand touch, no labels. No data claims.
// Photos: Liana S (a-YCd5VqGuk), Artem Shuba (3mGBTIOdeyY), Unsplash License; mono + grain in art/treat_gm2.py.
// Run: PW_PATH=$(npm root -g)/playwright node social/pt/gm.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const L = (f) => 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/' + f).toString('base64');
const P = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/${f}`).toString('base64');
const INK = '#0B0E11', LIME = '#B8F26A';
const head = `<meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:${INK};color:#fff}
.b{font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}
.bg{position:absolute;inset:0;background-size:1080px auto;background-repeat:no-repeat}
</style>`;
const glowLine = (d, end) => `<svg style="position:absolute;inset:0" width="1080" height="1350">
  <defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter></defs>
  <path d="${d}" fill="none" stroke="${LIME}" stroke-width="12" opacity=".5" filter="url(#gl)"/>
  <path d="${d}" fill="none" stroke="${LIME}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="${end[0]}" cy="${end[1]}" r="11" fill="${LIME}"/><circle cx="${end[0]}" cy="${end[1]}" r="26" fill="none" stroke="${LIME}" stroke-width="2.5" opacity=".55"/>
</svg>`;

// 1) touching grass: a blade of grass that grows like a chart
const blade = [[640, 820], [622, 745], [606, 700], [592, 640], [574, 585], [566, 520], [548, 455], [536, 400], [527, 330], [513, 262], [503, 190]];
const grassD = 'M' + blade.map((p) => p.join(',')).join(' L');
const grass = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('grass-m.jpg')});background-position:0 -81px"></div>
<div style="position:absolute;inset:0;background:radial-gradient(900px 700px at 0% 0%,rgba(11,14,17,.75),rgba(11,14,17,0) 60%)"></div>
${glowLine(grassD, blade[blade.length - 1])}
<div style="position:absolute;left:72px;top:64px">
  <div class="b" style="font-size:260px;font-weight:800;letter-spacing:-4px;line-height:.85;font-variation-settings:'opsz' 96,'wdth' 80">GM.</div>
  <div class="b" style="font-size:44px;font-weight:500;letter-spacing:-.5px;line-height:1.15;margin-top:20px;color:rgba(255,255,255,.85)">Fui tocar na relva.<br>O gráfico espera.</div>
</div>
<img src="${L('logo-official-black.png')}" style="position:absolute;right:64px;bottom:60px;height:36px">
</body></html>`;

// 2) market down, GM anyway: the street lamp's light runs down the wet stones
let seed = 21; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
let rain = ''; for (let i = 0; i < 140; i++) { const x = R() * 1100 - 10, y = R() * 1350, l = 30 + R() * 70; rain += `<line x1="${x}" y1="${y}" x2="${x - l * .15}" y2="${y + l}" stroke="#fff" stroke-width="${1 + R()}" opacity="${.08 + R() * .16}"/>`; }
const lampD = 'M810,532 L812,640 L806,720 L816,800 L808,880 L818,960 L814,1050';
const rainy = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('umb-m.jpg')});background-position:0 0"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,9,10,0) 55%,rgba(7,9,10,.88) 88%)"></div>
<svg style="position:absolute;inset:0" width="1080" height="1350">${rain}</svg>
${glowLine(lampD, [810, 520])}
<img src="${L('logo-official-white.png')}" style="position:absolute;right:64px;top:60px;height:36px">
<div style="position:absolute;left:72px;right:72px;bottom:76px">
  <div class="b" style="font-size:150px;font-weight:800;letter-spacing:-3px;line-height:.9;font-variation-settings:'opsz' 96,'wdth' 80">GM, na mesma.</div>
  <div class="b" style="font-size:42px;font-weight:500;letter-spacing:-.5px;line-height:1.2;margin-top:20px;color:rgba(255,255,255,.75)">Mercado em vermelho, luz acesa na rua.</div>
</div>
</body></html>`;

const br = await chromium.launch();
const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [n, h] of [['gm-01-relva', grass], ['gm-02-chuva', rainy]]) {
  await pg.setContent(h, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
  await pg.screenshot({path: `${DIR}/${n}.png`}); console.log('ok', n);
}
await br.close();
