// PT channel GM posts (no data claims). Photos: Liana S (a-YCd5VqGuk), Artem Shuba (3mGBTIOdeyY), Unsplash License,
// treated in art/treat_gm.py (mono + selected hues remapped to brand greens). Rain with red mini candles is drawn here.
// Run: PW_PATH=$(npm root -g)/playwright node social/pt/gm.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const L = (f) => 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/' + f).toString('base64');
const P = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/${f}`).toString('base64');
const INK = '#0B0E11', LIME = '#B8F26A', RED = '#F6465D';
const head = `<meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Martian+Mono:wdth,wght@75..112.5,300..700&family=Doto:wght@500..900&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:${INK};color:#fff}
.b{font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}.mm{font-family:'Martian Mono'}.d{font-family:'Doto';font-weight:800}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
</style>`;
const top = (right) => `<div style="position:absolute;left:72px;right:72px;top:72px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-white.png')}" style="height:42px"><div class="mm" style="font-size:17px;letter-spacing:2px;color:rgba(255,255,255,.8)">${right}</div></div>`;

// 1) touching grass
const grass = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('grass-t.jpg')});background-position:50% 30%"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,14,17,.55),rgba(11,14,17,0) 22%,rgba(11,14,17,0) 52%,rgba(11,14,17,.9) 82%)"></div>
${top('SÁBADO DE MANHÃ')}
<div style="position:absolute;left:72px;right:72px;bottom:80px">
  <div class="d" style="display:inline-block;font-size:30px;color:${INK};background:${LIME};padding:10px 18px 8px;border-radius:8px">MODO RELVA: ON</div>
  <div class="b" style="font-size:300px;font-weight:800;letter-spacing:-3px;line-height:.82;margin-top:26px;font-variation-settings:'opsz' 96,'wdth' 80">GM.</div>
  <div class="b" style="font-size:52px;font-weight:600;letter-spacing:-1px;line-height:1.1;margin-top:26px">Ecrã desligado. <span style="color:${LIME}">Relva ligada.</span></div>
</div>
</body></html>`;

// 2) market down, GM anyway: rain of tiny red candles
let seed = 21; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
let rain = '';
for (let i = 0; i < 170; i++) { const x = R() * 1100 - 10, y = R() * 1350, l = 30 + R() * 70; rain += `<line x1="${x}" y1="${y}" x2="${x - l * .18}" y2="${y + l}" stroke="#fff" stroke-width="${1 + R() * 1.2}" opacity="${.12 + R() * .2}"/>`; }
for (let i = 0; i < 26; i++) { const x = 40 + R() * 1000, y = 120 + R() * 1150, s = .7 + R() * .8, bh = 22 * s, w = 9 * s, wick = 12 * s;
  rain += `<g transform="translate(${x} ${y}) rotate(10)" opacity="${.55 + R() * .4}"><line x1="0" y1="${-wick}" x2="0" y2="${bh + wick}" stroke="${RED}" stroke-width="${1.6 * s}"/><rect x="${-w / 2}" y="0" width="${w}" height="${bh}" rx="1.5" fill="${RED}"/></g>`; }
const rainy = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('umb-t.jpg')});background-position:50% 50%"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,9,10,.92) 0%,rgba(7,9,10,.75) 30%,rgba(7,9,10,0) 48%,rgba(7,9,10,0) 60%,rgba(7,9,10,.85) 100%)"></div>
<svg style="position:absolute;inset:0" width="1080" height="1350">${rain}</svg>
${top('PREVISÃO: CHUVA VERMELHA')}
<div style="position:absolute;left:72px;top:150px">
  <div class="b" style="font-size:300px;font-weight:800;letter-spacing:-3px;line-height:.82;font-variation-settings:'opsz' 96,'wdth' 80">GM</div>
  <div class="b" style="font-size:96px;font-weight:800;letter-spacing:-2px;line-height:1;color:${LIME};margin-top:10px;font-variation-settings:'opsz' 96,'wdth' 85">na mesma.</div>
</div>
<div style="position:absolute;left:72px;right:72px;bottom:80px">
  <div class="b" style="font-size:52px;font-weight:600;letter-spacing:-1px;line-height:1.12">O mercado chove vermelho.<br><span style="color:rgba(255,255,255,.6)">Nós abrimos o guarda-chuva.</span></div>
</div>
</body></html>`;

const br = await chromium.launch();
const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [n, h] of [['gm-01-relva', grass], ['gm-02-chuva', rainy]]) {
  await pg.setContent(h, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
  await pg.screenshot({path: `${DIR}/${n}.png`}); console.log('ok', n);
}
await br.close();
