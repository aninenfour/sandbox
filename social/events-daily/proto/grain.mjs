// Grain collage concept (Nov 24): solid cutout of the official key art (art/solid-<slug>.png, rembg + bg-diff mask with holes filled),
// big organic brand-green shapes, a huge stippled Hotcoin symbol (grainy, airbrush-like), floating chrome candlesticks, film grain.
// Pattern inspired by a grainy collage reference; layout and elements are our own. Title + subtitle only, no italics.
import fs from 'fs'; import path from 'path'; import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH || 'playwright');
const DIR = path.dirname(new URL(import.meta.url).pathname) + '/..', ROOT = DIR + '/../..';
const DATA = JSON.parse(fs.readFileSync(`${DIR}/events.json`, 'utf8'));
const b64 = (f, t = 'image/png') => `data:${t};base64,` + fs.readFileSync(f).toString('base64');
const WM_W = b64(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-white.png`), WM_K = b64(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-black.png`);
const SYM = b64(`${ROOT}/hotcoin-tradfi/public/brand/symbol-mono-white.svg`, 'image/svg+xml');
const slugs = (process.argv[2] || 'HotcoinFixed-TermEarnExclusive,tradfi-0-fee-carnival').split(',');
const THEMES = {
  dark: {bg: '#07090A', blobs: ['#163F26', '#0E2A19', '#B8F26A'], blobOp: [1, 1, .9], stip: '255,255,255', stipOp: .55, title: 'rgba(255,255,255,.92)', head: '#B8F26A', wm: WM_W, grain: .22},
  lime: {bg: '#B8F26A', blobs: ['#7EC25A', '#0B0E11', '#2DBD85'], blobOp: [.9, 1, .0], stip: '11,14,17', stipOp: .5, title: '#0B0E11', head: '#0B0E11', wm: WM_K, grain: .18},
};
// chrome candlestick: body + wicks with metallic gradient
const candle = (x, y, h, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="13" y="-34" width="4" height="${h + 68}" fill="url(#chr)"/><rect x="0" y="0" width="30" height="${h}" rx="3" fill="url(#chr)"/><rect x="0" y="0" width="30" height="${h}" rx="3" fill="url(#hl)"/></g>`;
const page = (c, art, T, v) => `<!doctype html><html><head><meta charset="utf-8"><style>@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;background:${T.bg};font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
canvas,svg,img{position:absolute}</style></head><body>
<svg width="1080" height="1350" style="left:0;top:0">
 <defs><linearGradient id="chr" x1="0" x2="1"><stop offset="0" stop-color="#8d9196"/><stop offset=".35" stop-color="#f4f6f7"/><stop offset=".6" stop-color="#b9bdc1"/><stop offset="1" stop-color="#6f7378"/></linearGradient>
 <linearGradient id="hl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
 ${v === 0
   ? `<circle cx="-40" cy="1180" r="520" fill="${T.blobs[0]}" opacity="${T.blobOp[0]}"/><circle cx="1000" cy="720" r="320" fill="${T.blobs[1]}" opacity="${T.blobOp[1]}"/><circle cx="930" cy="1270" r="120" fill="${T.blobs[2]}" opacity="${T.blobOp[2]}"/>`
   : `<circle cx="1120" cy="1150" r="560" fill="${T.blobs[0]}" opacity="${T.blobOp[0]}"/><circle cx="40" cy="760" r="300" fill="${T.blobs[1]}" opacity="${T.blobOp[1]}"/><circle cx="150" cy="1240" r="90" fill="${T.blobs[2]}" opacity="${T.blobOp[2]}"/>`}
</svg>
<canvas id="stip" width="1080" height="1350" style="left:0;top:0"></canvas>
<svg width="1080" height="1350" style="left:0;top:0">
 ${[[120, 560, 120, .9], [190, 640, 80, .75], [860, 500, 150, .95], [940, 430, 100, .8], [990, 600, 70, .65]].map(a => candle(...a)).join('')}
</svg>
<div style="position:absolute;left:50%;top:1215px;width:760px;height:70px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.6),transparent)"></div>
<img src="${art}" style="left:50%;top:440px;transform:translateX(-50%);width:840px;height:800px;object-fit:contain;filter:drop-shadow(0 30px 40px rgba(0,0,0,.45))">
<img src="${T.wm}" style="left:72px;top:68px;height:40px">
<div style="position:absolute;left:72px;right:72px;top:150px">
 <div style="font-weight:600;font-size:50px;letter-spacing:-1px;color:${T.title}">${c.short}</div>
 <div style="font-weight:800;font-size:118px;letter-spacing:-4.5px;line-height:1;color:${T.head};margin-top:14px">${c.headline}</div></div>
<canvas id="grain" width="1080" height="1350" style="left:0;top:0;mix-blend-mode:overlay;opacity:${T.grain}"></canvas>
<script>
(async () => {
  // stippled giant symbol: dots kept with a probability that fades diagonally (airbrush grain)
  const im = new Image(); im.src = '${SYM}'; await im.decode();
  const S = 1250, ox = ${v === 0 ? 260 : -300}, oy = ${v === 0 ? 300 : 260};
  const t = document.createElement('canvas'); t.width = t.height = S; const tc = t.getContext('2d'); tc.drawImage(im, 0, 0, S, S);
  const src = tc.getImageData(0, 0, S, S).data, c = document.getElementById('stip').getContext('2d'), out = c.createImageData(1080, 1350), o = out.data;
  for (let y = 0; y < 1350; y++) for (let x = 0; x < 1080; x++) {
    const sx = x - ox, sy = y - oy; if (sx < 0 || sy < 0 || sx >= S || sy >= S) continue;
    if (src[(sy * S + sx) * 4 + 3] < 128) continue;
    const d = Math.min(1, Math.max(0, ${v === 0 ? '1.15 - (sx + sy) / S' : '(sx + sy) / S - .15'})) ;
    if (Math.random() < d * d * .9) { const i = (y * 1080 + x) * 4; o[i] = ${T.stip.split(',')[0]}; o[i+1] = ${T.stip.split(',')[1]}; o[i+2] = ${T.stip.split(',')[2]}; o[i+3] = 255 * ${T.stipOp}; }
  }
  c.putImageData(out, 0, 0);
  const g = document.getElementById('grain').getContext('2d'), gd = g.createImageData(1080, 1350);
  for (let i = 0; i < gd.data.length; i += 4) { const n = Math.random() * 255; gd.data[i] = gd.data[i+1] = gd.data[i+2] = n; gd.data[i+3] = 255; }
  g.putImageData(gd, 0, 0); document.body.dataset.done = 1;
})();
</script></body></html>`;
const out = `${DIR}/out/proto`; fs.mkdirSync(out, {recursive: true});
const br = await chromium.launch(); const p = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const th of Object.keys(THEMES)) for (const [i, s] of slugs.entries()) {
  await p.setContent(page(DATA[s], b64(`${DIR}/art/solid-${s}.png`), THEMES[th], i % 2), {waitUntil: 'networkidle'});
  await p.waitForSelector('body[data-done]'); await p.waitForTimeout(200);
  await p.screenshot({path: `${out}/grain-${th}-${s}.png`});
}
await br.close();
