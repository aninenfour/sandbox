// Hotcoin platform announcement image, 1600x900, lime halftone background.
// Writes <slug>.png, <slug>-footer.png (lime) and <slug>-dark.png, <slug>-dark-footer.png (black, symbol at the bottom).
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

const page = (footer, theme) => {
 const dark = theme === 'dark';
 return `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=block');
*{box-sizing:border-box;margin:0;padding:0}
body{width:1600px;height:900px;overflow:hidden;font-family:'Inter Tight',sans-serif;color:${dark ? '#F2F3EE' : '#0B0E11'}}
.s{position:relative;width:1600px;height:900px;background:url(${f(T + `/bg-${theme}-1600x900.png`)}) center/cover;display:flex;flex-direction:column;align-items:center}
.logo{margin-top:48px;height:64px}
.main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 80px;${footer ? (A.cards ? 'padding-bottom:110px' : 'margin-bottom:6px') : ''}}
.tag{font-family:'JetBrains Mono';font-weight:700;font-size:17px;letter-spacing:4px;text-transform:uppercase;background:${dark ? '#B8F26A' : '#0B0E11'};color:${dark ? '#0B0E11' : '#B8F26A'};border-radius:999px;padding:7px 18px}
h1{font-weight:900;font-size:${footer ? 70 : 80}px;letter-spacing:-1.5px;line-height:1.02;margin-top:${footer ? 18 : 22}px}
h2{font-weight:800;font-size:${footer ? 38 : 44}px;letter-spacing:-1px;line-height:1.1;margin-top:10px}
.sub{font-weight:600;font-size:${footer ? 22 : 25}px;margin-top:${footer ? 16 : 20}px;opacity:.9}
.rows{margin-top:${footer ? 18 : 26}px;display:flex;flex-direction:column;gap:8px;background:${dark ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.55)'};border:1px solid ${dark ? 'rgba(184,242,106,.25)' : 'transparent'};border-radius:14px;padding:14px 24px}
.r{display:flex;gap:18px;align-items:baseline;font-size:${footer ? 17 : 19}px}
.r b{font-weight:700;width:210px;text-align:right;color:${dark ? '#B8F26A' : '#1F3A12'}}
.r code{font-family:'JetBrains Mono';font-weight:700;letter-spacing:.3px}
.bsym{height:46px;margin-bottom:40px}
.cards{display:flex;gap:22px;margin-top:${footer ? 20 : 28}px}
.card{width:560px;text-align:left;border-radius:16px;padding:${footer ? '16px 22px' : '20px 24px'};background:${dark ? 'rgba(16,20,17,.94)' : 'rgba(255,255,255,.82)'};border:1px solid ${dark ? 'rgba(184,242,106,.28)' : 'rgba(11,14,17,.08)'}}
.ch{font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:3px;text-transform:uppercase;color:${dark ? '#B8F26A' : '#1F3A12'}}
.ci{font-weight:800;font-size:${footer ? 24 : 27}px;margin:6px 0 10px;letter-spacing:-.3px}
.cr{display:flex;justify-content:space-between;font-size:${footer ? 18 : 20}px;padding:${footer ? 5 : 7}px 0;border-top:1px solid ${dark ? 'rgba(255,255,255,.1)' : 'rgba(11,14,17,.1)'}}
.cr span{opacity:.75}
.cr b{font-family:'JetBrains Mono';font-weight:700}
.url{font-family:'JetBrains Mono';font-weight:700;font-size:18px;letter-spacing:3px;margin-bottom:36px;opacity:.75}
.ftw{position:relative;width:100%;height:150px}
.ft{position:absolute;left:0;right:0;bottom:0;height:150px;background:${dark ? 'linear-gradient(90deg,#141A12,#1A2216 60%,#1F2A15)' : 'linear-gradient(90deg,#050706,#0B0E11 60%,#111A0B)'};display:flex;align-items:center;color:#fff;border-top:2px solid rgba(214,180,90,.55)}
.rd{position:absolute;left:70px;bottom:0;height:330px;filter:drop-shadow(0 10px 24px rgba(0,0,0,.35));z-index:2}
.ft .tx{margin-left:420px;display:flex;flex-direction:column;gap:6px}
.ft .pill{align-self:flex-start;font-weight:700;font-size:16px;color:#1A1405;background:linear-gradient(90deg,#F7E7B0,#D9B45A);border-radius:999px;padding:5px 16px}
.ft .big{font-weight:900;font-size:40px;letter-spacing:-1px;line-height:1}
.ft .big span{color:#8EE04E}
.ft .sm{font-size:20px;color:#C9CDD2;font-weight:600}
.ft .lg{position:absolute;right:56px;bottom:34px;height:34px}
.ft .em{position:absolute;right:56px;top:30px;font-size:14px;color:#8B9097}
</style></head><body><div class="s">
${dark ? '<div style="height:60px"></div>' : `<img class="logo" src="${f(T + '/symbol-black.png')}">`}
<div class="main">
 <span class="tag">${A.tag}</span>
 <h1>${A.title}</h1>
 <h2>${A.title2}</h2>
 <div class="sub">${A.sub}</div>
 ${A.cards ? `<div class="cards">${A.cards.map((c) => `<div class="card"><div class="ch">${c.head}</div><div class="ci">${c.items}</div>${c.rows.map(([k, v]) => `<div class="cr"><span>${k}</span><b>${v}</b></div>`).join('')}</div>`).join('')}</div>` : ''}
 ${A.rows && A.rows.length ? `<div class="rows">${A.rows.map(([k, v]) => `<div class="r"><b>${k}</b><code>${v}</code></div>`).join('')}</div>` : ''}
</div>
${footer ? `<div class="ftw"><div class="ft">
 <div class="tx"><span class="pill">9th Anniversary</span><div class="big"><span>6,000,000 USDT</span> in rewards</div><div class="sm">Celebrate 9 years with Ronaldinho</div></div>
 <span class="em">Embaixador da Hotcoin (Brasil)</span>
 <img class="lg" src="${f(ROOT + '/hotcoin-tradfi/public/brand/logo-official-white.png')}">
</div><img class="rd" src="${f(T + '/ronaldinho-cutout.png')}"></div>` : (dark ? `<img class="bsym" src="${f(ROOT + '/hotcoin-tradfi/public/brand/symbol-official-white.png')}">` : `<div class="url">hotcoin.com</div>`)}
</div></body></html>`;
};

const browser = await chromium.launch();
const p = await browser.newPage({viewport: {width: 1600, height: 900}});
for (const theme of ['lime', 'dark']) for (const footer of [false, true]) {
  const name = A.slug + (theme === 'dark' ? '-dark' : '') + (footer ? '-footer' : '');
  const h = `${SCR}/${name}.html`; fs.writeFileSync(h, page(footer, theme));
  await p.goto('file://' + h, {waitUntil: 'networkidle'});
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({path: `${DIR}/${name}.png`}); console.log('ok', name);
}
await browser.close();
