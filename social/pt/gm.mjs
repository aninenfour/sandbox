// PT channel GM posts v3 + falling-letters post. Mono photos (tram treatment), one lime line that follows a real path.
// Photos: Joakim Kingstrom (nT4yhOd5SF4, park path), Bart ter Haar (C5HHKkfquJo, Lisbon street), Unsplash License.
// No data claims. Run: PW_PATH=$(npm root -g)/playwright node social/pt/gm.mjs
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
let seed = 7; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
// chart-like path between two points, wiggle shrinking with distance (perspective)
function chart(a, b, n, amp, dir) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const f = i / n; const w = i && i < n ? (R() - .5) * 2 * amp * (dir > 0 ? 1 - f : f + .25) : 0;
    pts.push([a[0] + (b[0] - a[0]) * f + w * .6, a[1] + (b[1] - a[1]) * f + (i && i < n ? (R() - .3) * amp * .5 * (dir > 0 ? 1 - f : f + .25) : 0)]); }
  return pts;
}
const svgLine = (pts) => { const d = 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' L'); const e = pts[pts.length - 1];
  return `<svg style="position:absolute;inset:0" width="1080" height="1350"><defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>
  <path d="${d}" fill="none" stroke="${LIME}" stroke-width="13" opacity=".5" filter="url(#gl)"/>
  <path d="${d}" fill="none" stroke="${LIME}" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="${e[0]}" cy="${e[1]}" r="12" fill="${LIME}"/><circle cx="${e[0]}" cy="${e[1]}" r="28" fill="none" stroke="${LIME}" stroke-width="3" opacity=".6"/></svg>`; };

// 1) touching grass: the line climbs the mown path to the walker
const park = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('park-m.jpg')});background-position:0 -135px"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,14,17,.75) 0%,rgba(11,14,17,.35) 26%,rgba(11,14,17,0) 40%)"></div>
${svgLine(chart([590, 1360], [546, 846], 18, 70, 1))}
<div style="position:absolute;left:72px;top:72px">
  <div class="b" style="font-size:250px;font-weight:800;letter-spacing:-4px;line-height:.85;font-variation-settings:'opsz' 96,'wdth' 80">GM.</div>
  <div class="b" style="font-size:44px;font-weight:500;letter-spacing:-.5px;line-height:1.15;margin-top:18px;color:rgba(255,255,255,.85)">Hoje o caminho é relva.</div>
</div>
<img src="${L('logo-official-white.png')}" style="position:absolute;right:64px;bottom:60px;height:36px">
</body></html>`;

// 2) market down, GM anyway: the line falls down the alley and lands in the morning sun
const street = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('sunstreet-m.jpg')});background-position:0 100%"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,14,17,.85) 0%,rgba(11,14,17,.5) 22%,rgba(11,14,17,0) 36%)"></div>
<div style="position:absolute;left:594px;top:1219px;width:420px;height:420px;margin:-210px 0 0 -210px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.45),rgba(255,255,255,0) 60%);mix-blend-mode:screen"></div>
${svgLine(chart([548, 330], [594, 1219], 16, 60, -1))}
<div style="position:absolute;left:72px;top:72px">
  <div class="b" style="font-size:150px;font-weight:800;letter-spacing:-3px;line-height:.88;font-variation-settings:'opsz' 96,'wdth' 80">GM,<br>na mesma.</div>
</div>
<div class="b" style="position:absolute;left:72px;bottom:70px;width:330px;font-size:36px;font-weight:500;line-height:1.2;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,.6)">Lá em baixo também nasce o sol.</div>
<img src="${L('logo-official-white.png')}" style="position:absolute;right:64px;top:80px;height:36px">
</body></html>`;

// 3) falling letters: PORTFÓLIO loses three letters to the footer
const word = [['P'], ['O', 1], ['R'], ['T'], ['F'], ['Ó', 1], ['L'], ['I', 1], ['O']];
const fallen = [
  {ch: 'O', x: 150, rot: -12},
  {ch: 'Ó', x: 430, rot: 24},
  {ch: 'I', x: 760, rot: 90, dy: -12},
];
const FLOOR = 1190;
const letters = `<!doctype html><html><head>${head}</head><body style="background:#F3F1EC;color:${INK}">
<img src="${L('logo-official-black.png')}" style="position:absolute;left:72px;top:72px;height:36px">
<div class="b" style="position:absolute;left:0;right:0;top:400px;text-align:center;font-size:178px;font-weight:800;letter-spacing:-2px;font-variation-settings:'opsz' 96,'wdth' 82;white-space:nowrap">${word.map(([c, gone], i) => gone ? `<span class="gap" style="color:transparent;-webkit-text-stroke:2px #C9C5BC">${c}</span>` : c).join('')}</div>
<div class="b" style="position:absolute;left:0;right:0;top:190px;text-align:center;font-size:48px;font-weight:600;letter-spacing:-.5px;line-height:1.2;color:${INK}">O seu também perdeu<br><span style="color:#8A8F95">letras esta semana?</span></div>
<svg id="trails" style="position:absolute;inset:0" width="1080" height="1350"></svg>
<div style="position:absolute;left:72px;right:72px;top:${FLOOR}px;border-top:2px solid ${INK}"></div>
${fallen.map((f) => `<div class="b fall" style="position:absolute;left:${f.x}px;top:${FLOOR - 152 + (f.dy || 0)}px;font-size:178px;line-height:152px;font-weight:800;font-variation-settings:'opsz' 96,'wdth' 82;transform-origin:50% 100%;transform:rotate(${f.rot}deg)">${f.ch}</div>`).join('')}
<script>
const gaps=[...document.querySelectorAll('.gap')], falls=[...document.querySelectorAll('.fall')], sv=document.getElementById('trails');
gaps.forEach((g,i)=>{const a=g.getBoundingClientRect(), b=falls[i].getBoundingClientRect();
  const x1=a.left+a.width/2, y1=a.bottom-20, x2=b.left+b.width/2, y2=b.top+10;
  sv.insertAdjacentHTML('beforeend','<path d="M'+x1+','+y1+' C'+x1+','+(y1+260)+' '+x2+','+(y2-260)+' '+x2+','+y2+'" fill="none" stroke="#C9C5BC" stroke-width="2" stroke-dasharray="3 12" stroke-linecap="round"/>');});
</script>
</body></html>`;

const br = await chromium.launch();
const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [n, h] of [['gm-01-relva', park], ['gm-02-sol', street], ['letras-portfolio', letters]]) {
  await pg.setContent(h, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
  await pg.screenshot({path: `${DIR}/${n}.png`}); console.log('ok', n);
}
await br.close();
