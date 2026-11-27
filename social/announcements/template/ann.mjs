// Hotcoin platform announcement image, 1600x900, lime halftone background.
// Writes <dir>/<slug>.png (no footer) and <dir>/<slug>-footer.png (9th anniversary footer with Ronaldinho).
// Run: PW_PATH=$(npm root -g)/playwright node template/ann.mjs <announcement-dir> <scratch-dir>
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const T = ROOT + '/social/announcements/template';
const [DIR, SCR] = process.argv.slice(2);
const A = JSON.parse(fs.readFileSync(DIR + '/ann.json', 'utf8'));
const f = (p) => 'file://' + p;

const page = (footer) => `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=block');
*{box-sizing:border-box;margin:0;padding:0}
body{width:1600px;height:900px;overflow:hidden;font-family:'Inter Tight',sans-serif;color:#0B0E11}
.s{position:relative;width:1600px;height:900px;background:url(${f(T + '/bg-lime-1600x900.png')}) center/cover;display:flex;flex-direction:column;align-items:center}
.logo{margin-top:52px;height:52px}
.main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 80px;${footer ? 'margin-bottom:6px' : ''}}
.tag{font-family:'JetBrains Mono';font-weight:700;font-size:20px;letter-spacing:4px;text-transform:uppercase;background:#0B0E11;color:#B8F26A;border-radius:999px;padding:8px 20px}
h1{font-weight:900;font-size:${footer ? 96 : 112}px;letter-spacing:-2px;line-height:1;margin-top:${footer ? 20 : 26}px}
h2{font-weight:800;font-size:${footer ? 54 : 62}px;letter-spacing:-1px;line-height:1.1;margin-top:10px}
.sub{font-weight:700;font-size:${footer ? 28 : 32}px;margin-top:${footer ? 18 : 26}px}
.rows{margin-top:${footer ? 18 : 30}px;display:flex;flex-direction:column;gap:8px;background:rgba(255,255,255,.55);border-radius:14px;padding:14px 24px}
.r{display:flex;gap:18px;align-items:baseline;font-size:${footer ? 19 : 21}px}
.r b{font-weight:700;width:230px;text-align:right;color:#1F3A12}
.r code{font-family:'JetBrains Mono';font-weight:700;letter-spacing:.3px}
.sym{height:34px;margin-bottom:34px;opacity:.9}
.ft{position:relative;width:100%;height:230px;background:linear-gradient(90deg,#050706,#0B0E11 60%,#111A0B);display:flex;align-items:center;overflow:hidden;color:#fff}
.ft .rd{position:absolute;left:60px;bottom:0;height:230px}
.ft .tx{margin-left:330px;display:flex;flex-direction:column;gap:8px}
.ft .pill{align-self:flex-start;font-weight:700;font-size:20px;color:#1A1405;background:linear-gradient(90deg,#F7E7B0,#D9B45A);border-radius:999px;padding:5px 16px}
.ft .big{font-weight:900;font-size:50px;letter-spacing:-1px;line-height:1}
.ft .big span{color:#8EE04E}
.ft .sm{font-size:24px;color:#C9CDD2;font-weight:600}
.ft .lg{position:absolute;right:56px;bottom:40px;height:40px}
.ft .em{position:absolute;right:56px;top:36px;font-size:15px;color:#8B9097}
</style></head><body><div class="s">
<img class="logo" src="${f(ROOT + '/hotcoin-tradfi/public/brand/logo-official-black.png')}">
<div class="main">
 <span class="tag">${A.tag}</span>
 <h1>${A.title}</h1>
 <h2>${A.title2}</h2>
 <div class="sub">${A.sub}</div>
 ${A.rows && A.rows.length ? `<div class="rows">${A.rows.map(([k, v]) => `<div class="r"><b>${k}</b><code>${v}</code></div>`).join('')}</div>` : ''}
</div>
${footer ? `<div class="ft">
 <img class="rd" src="${f(T + '/ronaldinho-footer.png')}">
 <div class="tx"><span class="pill">9th Anniversary</span><div class="big"><span>6,000,000 USDT</span> in rewards</div><div class="sm">Celebrate 9 years with Ronaldinho</div></div>
 <span class="em">Embaixador da Hotcoin (Brasil)</span>
 <img class="lg" src="${f(ROOT + '/hotcoin-tradfi/public/brand/logo-official-white.png')}">
</div>` : `<img class="sym" src="${f(T + '/symbol-black.png')}">`}
</div></body></html>`;

const browser = await chromium.launch();
const p = await browser.newPage({viewport: {width: 1600, height: 900}});
for (const footer of [false, true]) {
  const name = A.slug + (footer ? '-footer' : '');
  const h = `${SCR}/${name}.html`; fs.writeFileSync(h, page(footer));
  await p.goto('file://' + h, {waitUntil: 'networkidle'});
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({path: `${DIR}/${name}.png`}); console.log('ok', name);
}
await browser.close();
