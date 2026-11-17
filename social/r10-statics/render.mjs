// Six 16:9 statics for the Ronaldinho ambassador announcement (1920x1080, rendered at 2x).
// Portraits: real frames from the original Hotcoin green-screen shoot (MAIN_0004, t = 0.02 / 2.56 / 5.62 s), keyed by
// hotcoin-tradfi/scripts/make-r10-key.py --cutout, styled by social/r10-statics/make-assets.py. Nothing generated.
// Required on every asset (team rule): "Hotcoin Ambassador (Brazil)" + "Embaixador da Hotcoin (Brasil)", together.
// Run: PW_PATH=$(npm root -g)/playwright node social/r10-statics/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH || 'playwright');
const DIR = '/home/user/sandbox/social/r10-statics';
const A = (f) => 'file://' + DIR + '/assets/' + f;
const BRAND = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const GRAIN = 'file:///home/user/sandbox/hotcoin-tradfi/public/grain.png';
const W = 1920, H = 1080;
const INK = '#0B0E11', INK2 = '#07090A', LIME = '#B8F26A', GREEN = '#7EC25A';
const EN = 'Hotcoin Ambassador (Brazil)', PT = 'Embaixador da Hotcoin (Brasil)';
// portrait aspect (w/h) of the trimmed cutouts
const AR = {'0.02': 1624 / 1906, '2.56': 1670 / 1978, '5.62': 1637 / 1964};

const base = (bg, body) => `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Instrument+Serif:ital@0;1&display=block');
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${bg}}
.abs{position:absolute}
.sans{font-family:'Inter Tight',sans-serif}.mono{font-family:'JetBrains Mono',monospace}.serif{font-family:'Instrument Serif',serif}
.it{font-style:italic}
.grain{position:absolute;inset:0;background:url(${GRAIN});background-size:256px;pointer-events:none}
</style></head><body><div class="abs" style="inset:0;overflow:hidden">${body}</div></body></html>`;

const img = (f, {x, y, h, extra = ''}) => `<img class="abs" src="${A(f)}" style="left:${x}px;top:${y}px;height:${h}px;${extra}">`;
const portraitW = (t, h) => Math.round(AR[t] * h);

// ---------------------------------------------------------------- 1. Swiss grid
const swiss = () => {
  const ph = 1010, pw = portraitW('2.56', ph), px = 1150;
  return base('#EFEDE6', `
  <div class="abs" style="left:${px + 150}px;top:250px;width:${W - px - 150 - 80}px;height:${H - 250}px;background:${LIME}"></div>
  ${img('bw_2.56.png', {x: px, y: H - ph + 10, h: ph})}
  <img class="abs" src="${BRAND}logo-official-black.png" style="left:80px;top:72px;height:44px">
  <div class="abs mono" style="right:80px;top:72px;font-size:22px;font-weight:700;color:${INK};letter-spacing:2px;line-height:1.5;text-align:right">Nº 10<br>BRASIL</div>
  <div class="abs" style="left:80px;top:168px;width:1010px;height:3px;background:${INK}"></div>
  <div class="abs sans" style="left:80px;top:198px;font-size:62px;font-weight:800;color:${INK};letter-spacing:-1.5px;line-height:1.02">${EN}</div>
  <div class="abs serif it" style="left:80px;top:270px;font-size:74px;color:${INK};line-height:1">${PT}</div>
  <div class="abs sans" style="left:42px;top:300px;font-size:880px;font-weight:900;color:${INK};letter-spacing:-62px;line-height:1">10</div>
  <div class="grain" style="opacity:.05;mix-blend-mode:multiply"></div>`);
};

// ---------------------------------------------------------------- 2. Editorial
const editorial = () => {
  const ph = 1060, pw = portraitW('0.02', ph), px = W - pw - 40;
  return base('#ECE5D8', `
  <div class="abs" style="left:80px;right:80px;top:66px;height:2px;background:${INK}"></div>
  <div class="abs mono" style="left:80px;top:82px;font-size:20px;font-weight:500;color:${INK};letter-spacing:1px">HOTCOIN × RONALDINHO</div>
  <div class="abs mono" style="left:${px - 40}px;top:82px;font-size:20px;font-weight:500;color:${INK};letter-spacing:1px">Nº 10</div>
  ${img('col_0.02.png', {x: px, y: H - ph + 20, h: ph, extra: 'filter:saturate(.9) contrast(1.02)'})}
  <div class="abs serif it" style="left:72px;top:150px;font-size:236px;line-height:.86;color:${INK};letter-spacing:-3px">Play your<br><span style="position:relative;z-index:1">way.</span></div>
  <div class="abs" style="left:80px;top:440px;width:448px;height:84px;background:${LIME};z-index:0;mix-blend-mode:multiply"></div>
  <div class="abs" style="left:80px;top:640px;width:860px;height:2px;background:${INK}"></div>
  <div class="abs sans" style="left:80px;top:668px;font-size:50px;font-weight:800;color:${INK};letter-spacing:-1px;line-height:1.1">${EN}</div>
  <div class="abs serif it" style="left:80px;top:732px;font-size:62px;color:${INK};line-height:1.05">${PT}</div>
  <div class="abs sans" style="left:80px;top:872px;width:560px;font-size:24px;font-weight:500;color:${INK};line-height:1.45">Ronaldinho, the 2002 World Cup winner and 2005 Ballon d'Or, joins Hotcoin as its ambassador in Brazil.</div>
  <img class="abs" src="${BRAND}logo-official-black.png" style="left:80px;top:990px;height:36px">
  <div class="grain" style="opacity:.06;mix-blend-mode:multiply"></div>`);
};

// ---------------------------------------------------------------- 3. Matchday screen print
const matchday = () => {
  const ph = 1120, pw = portraitW('2.56', ph), px = W - pw + 30;
  const reg = (x, y) => `<svg class="abs" style="left:${x - 18}px;top:${y - 18}px" width="36" height="36"><circle cx="18" cy="18" r="10" fill="none" stroke="${LIME}" stroke-width="2"/><path d="M18 0V36M0 18H36" stroke="${LIME}" stroke-width="2"/></svg>`;
  const perf = Array.from({length: 9}).map((_, i) => `<div style="position:absolute;left:-11px;top:${22 + i * 30}px;width:22px;height:14px;border-radius:7px;background:${INK}"></div>`).join('');
  return base(INK, `
  <img class="abs" src="${A('ht_2.56.png')}" style="left:${px + 7}px;top:${H - ph + 46}px;height:${ph}px;filter:hue-rotate(-25deg) brightness(.7);opacity:.55">
  ${img('ht_2.56.png', {x: px, y: H - ph + 40, h: ph})}
  ${reg(60, 60)}${reg(W - 60, 60)}${reg(60, H - 60)}
  <img class="abs" src="${BRAND}logo-official-white.png" style="left:110px;top:92px;height:46px">
  <div class="abs sans" style="left:96px;top:150px;font-size:420px;font-weight:900;color:#F3F5F1;letter-spacing:-26px;line-height:1">Nº10</div>
  <div class="abs" style="left:110px;top:660px;width:1000px;height:300px;background:${LIME};border-radius:14px;overflow:hidden">
    <div style="position:absolute;right:190px;top:0;bottom:0;border-left:3px dashed ${INK};opacity:.7"></div>
    ${perf}
    <div class="mono" style="position:absolute;left:46px;top:30px;font-size:21px;font-weight:700;color:${INK};letter-spacing:3px">ADMIT ONE · HOTCOIN.COM</div>
    <div class="sans" style="position:absolute;left:46px;top:96px;width:780px;font-size:46px;font-weight:800;color:${INK};letter-spacing:-1px;line-height:1.08">${EN}</div>
    <div class="sans" style="position:absolute;left:46px;top:170px;width:780px;font-size:46px;font-weight:800;color:${INK};letter-spacing:-1px;line-height:1.08;opacity:.82">${PT}</div>
    <div class="sans" style="position:absolute;right:0;width:190px;top:0;bottom:0;display:flex;align-items:center;justify-content:center"><div style="transform:rotate(-90deg);font-size:64px;font-weight:900;color:${INK};letter-spacing:2px">R10</div></div>
  </div>
  <div class="grain" style="opacity:.10;mix-blend-mode:screen"></div>`);
};

// ---------------------------------------------------------------- 4. Riso zine collage
const riso = () => {
  const ph = 1060, pw = portraitW('5.62', ph), px = 1010;
  const tape = (x, y, w, r) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:46px;background:rgba(235,226,200,.78);transform:rotate(${r}deg);box-shadow:0 1px 2px rgba(0,0,0,.12)"></div>`;
  const label = (txt, x, y, r, size) => `<div class="abs sans" style="left:${x}px;top:${y}px;transform:rotate(${r}deg);background:${INK};color:#F3EFE6;font-size:${size}px;font-weight:800;letter-spacing:.5px;padding:14px 26px 16px;box-shadow:3px 4px 0 rgba(126,194,90,.9)">${txt}</div>`;
  return base('#F1ECE1', `
  <svg class="abs" style="left:880px;top:0" width="1040" height="1080"><path d="M120 0 L1040 0 L1040 1080 L40 1080 L60 1010 L30 950 L70 880 L45 800 L80 730 L50 660 L95 590 L60 520 L100 450 L70 380 L110 300 L80 230 L125 160 L90 90 Z" fill="#DCEBC6"/></svg>
  <img class="abs" src="${A('riso2_5.62.png')}" style="left:${px + 12}px;top:${H - ph + 34}px;height:${ph}px;mix-blend-mode:multiply">
  <img class="abs" src="${A('riso_5.62.png')}" style="left:${px}px;top:${H - ph + 28}px;height:${ph}px;mix-blend-mode:multiply">
  ${tape(px + 300, 30, 170, -14)}${tape(px + 640, 46, 150, 11)}
  <img class="abs" src="${BRAND}logo-official-black.png" style="left:84px;top:78px;height:42px">
  <div class="abs mono" style="left:86px;top:146px;font-size:20px;font-weight:700;color:${INK};letter-spacing:3px">ZINE Nº 10 · BRASIL</div>
  <div class="abs serif" style="left:78px;top:196px;font-size:200px;line-height:.9;color:${GREEN};letter-spacing:-2px;transform:translate(7px,5px);mix-blend-mode:multiply">Make it<br><span class="it">magic.</span></div>
  <div class="abs serif" style="left:78px;top:196px;font-size:200px;line-height:.9;color:${INK};letter-spacing:-2px;mix-blend-mode:multiply">Make it<br><span class="it">magic.</span></div>
  ${label(EN, 86, 640, -2, 46)}
  ${label(PT, 120, 760, 1.5, 46)}
  <div class="abs mono" style="left:90px;top:930px;font-size:22px;font-weight:700;color:${INK};letter-spacing:2px">RONALDINHO × HOTCOIN</div>
  <div class="grain" style="opacity:.16;mix-blend-mode:multiply"></div>`);
};

// ---------------------------------------------------------------- 5. Stadium scoreboard (LED)
const scoreboard = () => {
  const ph = 1000, pw = portraitW('2.56', ph), px = 70;
  const ledText = (txt, size, color, pitch, glow = true) => `<span style="font-family:'Inter Tight';font-weight:${glow ? 900 : 800};font-size:${size}px;letter-spacing:${size * 0.02}px;color:${color};
    -webkit-mask-image:radial-gradient(circle, #000 ${pitch * 0.40}px, transparent ${pitch * 0.47}px);-webkit-mask-size:${pitch}px ${pitch}px;
    ${glow ? `text-shadow:0 0 18px ${color}` : ''}">${txt}</span>`;
  return base('#050605', `
  <div class="abs" style="inset:0;background-image:radial-gradient(circle, rgba(126,194,90,.10) 3px, transparent 3.6px);background-size:18px 18px"></div>
  <div class="abs" style="left:${px - 30}px;top:${H - ph - 10}px;width:${pw + 60}px;height:${ph + 10}px;background:radial-gradient(60% 55% at 50% 45%, rgba(184,242,106,.12), transparent 70%)"></div>
  ${img('led_2.56.png', {x: px, y: H - ph, h: ph})}
  <div class="abs" style="left:1000px;top:90px;width:840px;height:900px;border:3px solid #1E2A1A;border-radius:10px;background:rgba(10,14,9,.6)"></div>
  <div class="abs mono" style="left:1040px;top:120px;font-size:22px;font-weight:700;color:${GREEN};letter-spacing:4px">HOTCOIN · BRASIL</div>
  <div class="abs" style="left:1030px;top:150px;line-height:1">${ledText('R10', 360, LIME, 12)}</div>
  <div class="abs" style="left:1040px;top:560px;width:760px;height:3px;background:#1E2A1A"></div>
  <div class="abs" style="left:1040px;top:600px;width:770px;line-height:1.12">${ledText(EN, 62, '#F3F5F1', 3.2, false)}</div>
  <div class="abs" style="left:1040px;top:760px;width:770px;line-height:1.12">${ledText(PT, 62, LIME, 3.2, false)}</div>
  <img class="abs" src="${BRAND}logo-official-white.png" style="left:1040px;top:920px;height:40px;opacity:.95">`);
};

// ---------------------------------------------------------------- 6. Fashion campaign
const campaign = () => {
  const ph = 1720, pw = portraitW('5.62', ph), px = W - pw + 200;
  return base('#0D2418', `
  <div class="abs" style="inset:0;background:radial-gradient(70% 90% at 75% 40%, #16402A 0%, #0D2418 55%, #081710 100%)"></div>
  ${img('col_5.62.png', {x: px, y: -150, h: ph, extra: 'filter:saturate(.85) contrast(1.04)'})}
  <div class="abs" style="inset:0;background:linear-gradient(90deg, rgba(8,23,16,.96) 0%, rgba(8,23,16,.75) 34%, rgba(8,23,16,0) 52%)"></div>
  <img class="abs" src="${BRAND}logo-official-white.png" style="left:96px;top:90px;height:36px">
  <div class="abs mono" style="left:98px;top:640px;font-size:21px;font-weight:500;color:rgba(243,245,241,.82);letter-spacing:4px">RONALDINHO · Nº 10</div>
  <div class="abs" style="left:98px;top:684px;width:64px;height:2px;background:${LIME}"></div>
  <div class="abs serif" style="left:92px;top:712px;width:820px;font-size:100px;line-height:.98;color:#F3F5F1">${PT}</div>
  <div class="abs sans" style="left:98px;top:930px;font-size:40px;font-weight:600;color:${LIME};letter-spacing:.5px">${EN}</div>
  <div class="grain" style="opacity:.07;mix-blend-mode:screen"></div>`);
};

// ---------------------------------------------------------------- 7. Campaign B (mirrored: photo left, text right; cooperation-led)
const campaign2 = () => {
  const ph = 1640, pw = portraitW('0.02', ph), px = -330;
  return base('#0D2418', `
  <div class="abs" style="inset:0;background:radial-gradient(70% 90% at 25% 40%, #16402A 0%, #0D2418 55%, #081710 100%)"></div>
  ${img('col_0.02.png', {x: px, y: -110, h: ph, extra: 'filter:saturate(.85) contrast(1.04)'})}
  <div class="abs" style="inset:0;background:linear-gradient(270deg, rgba(8,23,16,.97) 0%, rgba(8,23,16,.8) 36%, rgba(8,23,16,0) 54%)"></div>
  <img class="abs" src="${BRAND}logo-official-white.png" style="right:96px;top:90px;height:36px">
  <div class="abs" style="right:96px;top:300px;width:820px;text-align:right">
    <div class="mono" style="font-size:21px;font-weight:500;color:rgba(243,245,241,.82);letter-spacing:4px">OFFICIAL AMBASSADOR · BRASIL</div>
    <div style="margin:22px 0 0 auto;width:64px;height:2px;background:${LIME}"></div>
    <div class="serif" style="margin-top:26px;font-size:138px;line-height:.92;color:#F3F5F1">Hotcoin<br><span class="it" style="color:${LIME}">×</span> Ronaldinho</div>
    <div class="sans" style="margin-top:56px;font-size:44px;font-weight:700;color:#F3F5F1;line-height:1.2">${EN}</div>
    <div class="sans" style="font-size:44px;font-weight:700;color:${LIME};line-height:1.2">${PT}</div>
  </div>
  <div class="grain" style="opacity:.07;mix-blend-mode:screen"></div>`);
};

// ---------------------------------------------------------------- 8. Editorial B (welcome headline, Hotcoin facts instead of his titles)
// Facts: hotcoin.com/en_US/about, checked 2026-11-17 (2017 Year Founded, 8.1M+ Registered Users, 120+ Countries and Regions).
const editorial2 = () => {
  const ph = 1060, pw = portraitW('5.62', ph), px = W - pw - 50;
  const stat = (n, l) => `<div><div class="sans" style="font-size:70px;font-weight:800;color:${INK};letter-spacing:-2px;line-height:1">${n}</div><div class="sans" style="font-size:30px;font-weight:600;color:${INK};margin-top:8px">${l}</div></div>`;
  return base('#ECE5D8', `
  <div class="abs" style="left:80px;right:80px;top:66px;height:2px;background:${INK}"></div>
  <div class="abs mono" style="left:80px;top:82px;font-size:20px;font-weight:500;color:${INK};letter-spacing:1px">HOTCOIN × RONALDINHO</div>
  <div class="abs mono" style="left:${px - 60}px;top:82px;font-size:20px;font-weight:500;color:${INK};letter-spacing:1px">BRASIL</div>
  ${img('col_5.62.png', {x: px, y: H - ph + 20, h: ph, extra: 'filter:saturate(.9) contrast(1.02)'})}
  <div class="abs" style="left:80px;top:404px;width:610px;height:84px;background:${LIME};mix-blend-mode:multiply"></div>
  <div class="abs serif" style="left:72px;top:150px;font-size:210px;line-height:.9;color:${INK};letter-spacing:-3px">Welcome,<br><span class="it">Ronaldinho.</span></div>
  <div class="abs" style="left:80px;top:610px;width:880px;height:2px;background:${INK}"></div>
  <div class="abs sans" style="left:80px;top:636px;font-size:50px;font-weight:800;color:${INK};letter-spacing:-1px;line-height:1.1">${EN}</div>
  <div class="abs serif it" style="left:80px;top:700px;font-size:62px;color:${INK};line-height:1.05">${PT}</div>
  <div class="abs" style="left:80px;top:828px;display:flex;gap:70px">${stat('2017', 'Founded')}${stat('8.1M+', 'Registered users')}${stat('120+', 'Countries and regions')}</div>
  <img class="abs" src="${BRAND}logo-official-black.png" style="left:80px;top:1000px;height:34px">
  <div class="grain" style="opacity:.06;mix-blend-mode:multiply"></div>`);
};

const STYLES = {swiss, editorial, matchday, riso, scoreboard, campaign, campaign2, editorial2};
fs.mkdirSync(DIR + '/out', {recursive: true});
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: W, height: H}, deviceScaleFactor: 2});
const only = process.argv[2];
let i = 0;
for (const [name, fn] of Object.entries(STYLES)) {
  i++;
  if (only && only !== name) continue;
  const html = DIR + `/out/${name}.html`;
  fs.writeFileSync(html, fn());
  await page.goto('file://' + html, {waitUntil: 'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({path: DIR + `/out/${String(i).padStart(2, '0')}-${name}.png`});
  console.log('rendered', name);
}
await browser.close();
