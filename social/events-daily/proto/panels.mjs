// Panel concept (Nov 24): original key art untouched inside its own grey (#262626) panel, title + subtitle only, no italics.
import fs from 'fs'; import path from 'path'; import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH || 'playwright');
const DIR = path.dirname(new URL(import.meta.url).pathname) + '/..', ROOT = DIR + '/../..';
const DATA = JSON.parse(fs.readFileSync(`${DIR}/events.json`, 'utf8'));
const b64 = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const WM_W = b64(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-white.png`), WM_K = b64(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-black.png`);
const svg = f => 'data:image/svg+xml;base64,' + fs.readFileSync(f).toString('base64');
const SYM_W = svg(`${ROOT}/hotcoin-tradfi/public/brand/symbol-mono-white.svg`), SYM_K = svg(`${ROOT}/hotcoin-tradfi/public/brand/symbol-black.svg`);
// Huge brand symbol watermark behind everything, bleeding off the canvas.
const big = (src, {l, t, size, op}) => `<img src="${src}" style="position:absolute;left:${l}px;top:${t}px;width:${size}px;height:${size}px;opacity:${op}">`;
const INK = '#0B0E11', LIME = '#B8F26A', GREY = '#262626';
const slugs = (process.argv[2] || 'HotcoinFixed-TermEarnExclusive,tradfi-0-fee-carnival').split(',');
const head = `<meta charset="utf-8"><style>@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
.feather{-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent),linear-gradient(transparent,#000 6%,#000 94%,transparent);-webkit-mask-composite:source-in}</style>`;
const panel = (art, {l, t, w, h, r = 36, extra = ''}) => `<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;border-radius:${r}px;background:${GREY};overflow:hidden;${extra}">
<img class="feather" src="${art}" style="position:absolute;inset:24px;width:calc(100% - 48px);height:calc(100% - 48px);object-fit:contain"></div>`;
// iOS-style glass: frosted see-through bezel (backdrop blur shows the watermark behind), specular rim + diagonal sheen over the art.
const glass = (art, {l, t, w, h, tint = 'rgba(255,255,255,.10)', rim = 'rgba(255,255,255,.45)', shadow = 'rgba(0,0,0,.45)'}) => `
<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;border-radius:48px;background:${tint};backdrop-filter:blur(28px) saturate(170%);-webkit-backdrop-filter:blur(28px) saturate(170%);border:1.5px solid ${rim};box-shadow:inset 0 2px 0 rgba(255,255,255,.55),inset 0 -1px 0 rgba(255,255,255,.15),0 40px 90px ${shadow}"></div>
<div style="position:absolute;left:${l + 22}px;top:${t + 22}px;width:${w - 44}px;height:${h - 44}px;border-radius:30px;background:${GREY};overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)">
 <img class="feather" src="${art}" style="position:absolute;inset:22px;width:calc(100% - 44px);height:calc(100% - 44px);object-fit:contain">
 <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.20) 0%,rgba(255,255,255,.06) 28%,transparent 45%),linear-gradient(180deg,rgba(255,255,255,.10),transparent 18%)"></div></div>
<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;border-radius:48px;pointer-events:none;background:linear-gradient(120deg,rgba(255,255,255,.35),transparent 22%,transparent 78%,rgba(255,255,255,.18));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;padding:2px"></div>`;
const OPT = {
  // 1. Ink page, art panel on top with a thin lime hairline, type below.
  ink: (c, art) => `${head}<body style="background:${INK};color:#fff">
${big(SYM_W, {l: 380, t: 520, size: 820, op: .10})}
<img src="${WM_W}" style="position:absolute;left:72px;top:68px;height:40px">
${glass(art, {l: 60, t: 140, w: 960, h: 820, tint: 'rgba(255,255,255,.07)', rim: 'rgba(255,255,255,.28)'})}
<div style="position:absolute;left:72px;right:72px;top:1010px">
 <div style="font-weight:600;font-size:50px;letter-spacing:-1px;color:rgba(255,255,255,.9)">${c.short}</div>
 <div style="font-weight:800;font-size:112px;letter-spacing:-4px;line-height:1;color:${LIME};margin-top:16px">${c.headline}</div></div></body>`,
  // 2. Lime page, grey art panel inset, ink type.
  lime: (c, art) => `${head}<body style="background:${LIME};color:${INK}">
${big(SYM_K, {l: 560, t: 60, size: 640, op: .14})}
<img src="${WM_K}" style="position:absolute;left:72px;top:68px;height:40px">
<div style="position:absolute;left:72px;right:72px;top:150px">
 <div style="font-weight:600;font-size:50px;letter-spacing:-1px">${c.short}</div>
 <div style="font-weight:800;font-size:112px;letter-spacing:-4px;line-height:1;margin-top:14px">${c.headline}</div></div>
${glass(art, {l: 60, t: 460, w: 960, h: 830, tint: 'rgba(255,255,255,.28)', rim: 'rgba(255,255,255,.75)', shadow: 'rgba(11,14,17,.30)'})}</body>`,
  // 3. Full-bleed grey poster: art fills the top, ink type bar slides over the panel's lower edge with a lime tab.
  tab: (c, art) => `${head}<body style="background:${INK};color:#fff">
${panel(art, {l: 0, t: 150, w: 1080, h: 810, r: 0})}
<img src="${WM_W}" style="position:absolute;left:72px;top:68px;height:40px">
<div style="position:absolute;left:72px;top:900px;background:${LIME};color:${INK};font-weight:700;font-size:34px;letter-spacing:-.5px;padding:16px 26px;border-radius:14px">${c.short}</div>
<div style="position:absolute;left:72px;right:72px;top:1040px;font-weight:800;font-size:124px;letter-spacing:-4.5px;line-height:1;color:#fff">${c.headline}</div></body>`,
};
const out = `${DIR}/out/proto`; fs.mkdirSync(out, {recursive: true});
const br = await chromium.launch(); const p = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [name, fn] of Object.entries(OPT)) for (const s of slugs) {
  await p.setContent(`<!doctype html><html>${fn(DATA[s], b64(`${DIR}/art/hero-${s}.png`))}</html>`, {waitUntil: 'networkidle'}); await p.waitForTimeout(300);
  await p.screenshot({path: `${out}/panel-${name}-${s}.png`});
}
await br.close();
