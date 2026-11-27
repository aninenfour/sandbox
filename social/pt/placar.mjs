// PT "Placar do dia" (top coin vs BTC). Owner feedback 27/11: vary the background day to day (not always the football field) and use the
// clean official BTC logo (CoinGecko image, art/news/btc.png), not a text glyph.
// Usage: PW_PATH=$(npm root -g)/playwright node social/pt/placar.mjs <config.json> [variant]
//   config: {coin, logo (file in art/news), pct, btc, stamp, title, sub, out}; variant: field | lights | led | podium (default: rotates by day of year)
// Data sources live in the config file next to each render (publish/<date>/placar.json): Hotcoin ticker + CoinGecko check.
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const VARS = ['field', 'lights', 'led', 'podium'];
const doy = Math.floor((Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 864e5);
const variant = process.argv[3] || VARS[doy % VARS.length];
const L = 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png').toString('base64');
const N = (f) => `data:image/${f.endsWith('png') ? 'png' : 'jpeg'};base64,` + fs.readFileSync(`${DIR}/art/news/${f}`).toString('base64');
const LIME = '#B8F26A', UP = '#2DBD85', DOWN = '#F6465D';
const col = (v) => (v.trim().startsWith('-') || v.trim().startsWith('−')) ? DOWN : UP;
const glow = (c) => c === DOWN ? 'rgba(246,70,93,.35)' : c === UP ? 'rgba(45,189,133,.35)' : 'rgba(184,242,106,.45)';
let seed = doy; const R = () => (seed = (seed * 16807 + 7) % 2147483647) / 2147483647;

const BG = {
  field: `<div style="position:absolute;inset:0;background:radial-gradient(500px 300px at 12% -4%,rgba(255,255,255,.22),transparent 70%),radial-gradient(500px 300px at 88% -4%,rgba(255,255,255,.22),transparent 70%),linear-gradient(180deg,#10151A,#07090A 60%)"></div>
<div style="position:absolute;left:0;right:0;bottom:0;height:330px;background:repeating-linear-gradient(90deg,#123017 0 90px,#173A1C 90px 180px);opacity:.9"></div>
<div style="position:absolute;left:0;right:0;bottom:330px;height:3px;background:rgba(255,255,255,.5)"></div>
<div style="position:absolute;left:539px;bottom:0;width:3px;height:330px;background:rgba(255,255,255,.4)"></div>
<div style="position:absolute;left:390px;bottom:15px;width:300px;height:300px;border:3px solid rgba(255,255,255,.4);border-radius:50%"></div>`,
  // stadium floodlights: two lime-white beams from the top corners over a halftone crowd
  lights: `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#0A0E11,#05070A)"></div>
<svg style="position:absolute;inset:0" width="1080" height="1350"><defs><linearGradient id="bm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF8D4" stop-opacity=".34"/><stop offset="1" stop-color="#B8F26A" stop-opacity="0"/></linearGradient>
<filter id="bl"><feGaussianBlur stdDeviation="14"/></filter></defs>
<polygon points="-60,-20 40,-20 760,1350 180,1350" fill="url(#bm)" filter="url(#bl)"/><polygon points="1040,-20 1140,-20 900,1350 320,1350" fill="url(#bm)" filter="url(#bl)"/>

${Array.from({length: 520}, () => { const x = R() * 1080, y = 1060 + R() * 290; return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(3 + R() * 5).toFixed(1)}" fill="#1B2228"/>`; }).join('')}</svg>
<div style="position:absolute;left:0;right:0;bottom:0;height:330px;background:linear-gradient(180deg,rgba(5,7,10,0),rgba(5,7,10,.85) 60%)"></div>`,
  // LED wall: full-frame dot matrix, a few dots lit lime like a stadium screen
  led: `<div style="position:absolute;inset:0;background:#06080A"></div>
<div style="position:absolute;inset:0;background-image:radial-gradient(#1A2026 2.6px,transparent 3px);background-size:18px 18px"></div>
<svg style="position:absolute;inset:0" width="1080" height="1350">${Array.from({length: 60}, () => { const x = Math.round(R() * 60) * 18 + 9, y = Math.round(R() * 75) * 18 + 9; return `<circle cx="${x}" cy="${y}" r="3" fill="${LIME}" opacity="${(.25 + R() * .5).toFixed(2)}"/>`; }).join('')}
${Array.from({length: 24}, (_, i) => `<rect x="${i * 45}" y="${1350 - 60 - Math.round((Math.sin(i * .7 + doy) * .5 + .5) * 160)}" width="36" height="${60 + Math.round((Math.sin(i * .7 + doy) * .5 + .5) * 160)}" fill="${LIME}" opacity=".08"/>`).join('')}</svg>`,
  // podium: winner's podium silhouette with a lime spotlight
  podium: `<div style="position:absolute;inset:0;background:radial-gradient(520px 760px at 50% 0%,rgba(184,242,106,.16),transparent 70%),linear-gradient(180deg,#0C1013,#06080A)"></div>
<svg style="position:absolute;left:0;top:846px" width="1080" height="240"><g fill="#182026" stroke="#34404A" stroke-width="3">
<rect x="390" y="0" width="300" height="240" rx="6"/><rect x="100" y="70" width="290" height="170" rx="6"/><rect x="690" y="110" width="290" height="130" rx="6"/></g>
<text x="540" y="150" text-anchor="middle" font-family="Doto" font-weight="900" font-size="110" fill="${LIME}" opacity=".75">1</text>
<text x="245" y="185" text-anchor="middle" font-family="Doto" font-weight="900" font-size="72" fill="#3F4A53">2</text><text x="835" y="205" text-anchor="middle" font-family="Doto" font-weight="900" font-size="72" fill="#3F4A53">3</text>
<line x1="0" y1="239" x2="1080" y2="239" stroke="#34404A" stroke-width="3"/></svg>`,
};
const c1 = col(cfg.pct), c2 = col(cfg.btc);
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Inter+Tight:wght@400;500;600;700&family=Martian+Mono:wght@400;700&family=Doto:wght@500..900&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0B0E11;color:#fff}
.b{font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}.mm{font-family:'Martian Mono'}.d{font-family:'Doto';font-weight:900}.i{font-family:'Inter Tight'}
</style></head><body>
${BG[variant]}
<img src="${L}" style="position:absolute;left:72px;top:64px;height:38px">
<div class="b" style="position:absolute;left:72px;right:72px;top:150px;font-size:88px;font-weight:800;letter-spacing:-2px;line-height:.95;font-variation-settings:'opsz' 96,'wdth' 85">Placar do dia.</div>
<div style="position:absolute;left:60px;right:60px;top:330px;background:#050607;border:6px solid #1C2227;border-radius:22px;padding:36px 40px 40px;box-shadow:0 30px 80px rgba(0,0,0,.6),inset 0 0 40px rgba(0,0,0,.8)">
  <div class="mm" style="display:flex;justify-content:space-between;font-size:18px;letter-spacing:3px;color:#7D868E"><span>HOTCOIN · 24H</span><span>${cfg.stamp}</span></div>
  <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;margin-top:30px;gap:10px">
    <div style="text-align:center"><img src="${N(cfg.logo)}" style="width:120px;height:120px;border-radius:50%"><div class="d" style="font-size:54px;margin-top:14px">${cfg.coin}</div></div>
    <div class="d" style="font-size:44px;color:#5B636B">×</div>
    <div style="text-align:center"><img src="${N('btc.png')}" style="width:120px;height:120px;border-radius:50%"><div class="d" style="font-size:54px;margin-top:14px;color:#C9CED2">BTC</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;margin-top:24px">
    <div class="d" style="text-align:center;font-size:100px;color:${LIME};text-shadow:0 0 30px ${glow(LIME)}">${cfg.pct}</div>
    <div class="d" style="font-size:60px;color:#5B636B">:</div>
    <div class="d" style="text-align:center;font-size:100px;color:${c2};text-shadow:0 0 30px ${glow(c2)}">${cfg.btc}</div>
  </div>
  <div class="mm" style="text-align:center;font-size:18px;letter-spacing:3px;color:#7D868E;margin-top:8px">VARIAÇÃO EM %</div>
</div>
<div style="position:absolute;left:72px;right:72px;bottom:96px">
  <div class="b" style="font-size:44px;font-weight:700;letter-spacing:-.5px">${cfg.title}</div>
  <div class="i" style="font-size:27px;color:rgba(255,255,255,.75);margin-top:8px">${cfg.sub}</div>
</div>
</body></html>`;
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await pg.setContent(html, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
const out = cfg.out.replace('{v}', variant); fs.mkdirSync(out.replace(/\/[^/]+$/, ''), {recursive: true});
await pg.screenshot({path: out}); await br.close(); console.log(variant, out);
