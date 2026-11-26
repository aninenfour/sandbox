// LinkedIn covers, week of Nov 26 to Dec 1, 2026. Grainy collage family (owner approved the grain look Nov 24, see
// origin/claude/beautiful-noether-8uelys social/events-daily): organic brand-green shapes, stippled Hotcoin symbol,
// chrome candlesticks, film grain, plus stippled real-object cutouts (linkedin/covers/cutouts.py) and a chrome hero number.
// Layouts are our own; the grain pattern is inspired by a reference, not copied. Title + headline only, no italics.
// Logo: official PNGs only (white wordmark on dark, black on lime/white). Fonts: Inter Tight + JetBrains Mono (Google, display=block).
// Sources for numbers: Birdeye bot estimate via BeInCrypto (Nov 2026); campaign terms from Hotcoin's published campaign posts;
// PoR snapshot Oct 29, 2026 10:00 UTC+8 (hotcoin.com reserve page); BTC Nov 1 to Nov 25: CoinGecko ($77,499 to $59,138).
// Photos: Unsplash, credited in hotcoin-tradfi/FOOTAGE_CREDITS.md. TOKEN2049 fact: held at Marina Bay Sands, Oct 7 to 8, 2026 (TOKEN2049 press release, Aug 2026).
// Run: node linkedin/covers/render.mjs [id,id]   -> linkedin/covers/out/<id>.png (2160x2700)
import fs from 'fs'; import path from 'path'; import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH || 'playwright');
const DIR = path.dirname(new URL(import.meta.url).pathname), ROOT = path.resolve(DIR, '../..');
const b64 = (f) => `data:image/png;base64,` + fs.readFileSync(f).toString('base64');
const b64j = (f) => `data:image/jpeg;base64,` + fs.readFileSync(f).toString('base64');
const BRAND = `${ROOT}/hotcoin-tradfi/public/brand`;
const LOGO = {white: b64(`${BRAND}/logo-official-white.png`), black: b64(`${BRAND}/logo-official-black.png`)};
const SYM = b64(`${BRAND}/symbol-mono-white.png`);
const cut = (n, ink) => b64(`${DIR}/cut/${n}${ink ? '-ink' : ''}.png`);

const THEMES = {
  dark:  {bg: '#07090A', fg: '#F2F4EF', sub: 'rgba(242,244,239,.86)', blobs: ['#163F26', '#0E2A19', '#B8F26A'], blobOp: [1, 1, .9], stip: '255,255,255', stipOp: .5, logo: 'white', grain: .22, ink: false, chromeEdge: '#3F7A2A'},
  lime:  {bg: '#B8F26A', fg: '#0B0E11', sub: 'rgba(11,14,17,.82)', blobs: ['#7EC25A', '#0B0E11', '#2DBD85'], blobOp: [.85, 1, 0], stip: '11,14,17', stipOp: .45, logo: 'black', grain: .18, ink: true, chromeEdge: '#0B0E11'},
  white: {bg: '#FFFFFF', fg: '#0B0E11', sub: 'rgba(11,14,17,.78)', blobs: ['#EEF4E8', '#E3EEDA', '#B8F26A'], blobOp: [1, 1, .9], stip: '11,14,17', stipOp: .09, logo: 'black', grain: .12, ink: true, chromeEdge: '#7EC25A'},
};

// chrome candlestick (body + wick), optional tint for up/down
const candle = ([x, y, h, s = 1, tint]) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="13" y="-34" width="4" height="${h + 68}" fill="url(#chr)"/><rect x="0" y="0" width="30" height="${h}" rx="3" fill="url(#chr)"/>${tint ? `<rect x="0" y="0" width="30" height="${h}" rx="3" fill="${tint}" opacity=".55"/>` : ''}<rect x="0" y="0" width="30" height="${h}" rx="3" fill="url(#hl)"/></g>`;

const COVERS = [
  {id: 'thu-bots', theme: 'dark', v: 0, title: 'Who trades crypto on-chain?', head: 'Bots make <b class="ch">2/3</b><br>of the trades',
   obj: {n: 'robot', x: 300, y: 690, w: 900}, candles: [[96, 760, 110, .9], [168, 850, 70, .7]], swipe: true},
  {id: 'thu-careers', photo: {f: 'crowd.jpg', pos: '100% 50%'}, kicker: 'CAREERS IN CRYPTO', title: 'Who runs a crypto exchange?', head: '8 teams behind<br>every exchange', swipe: true},
  {id: 'thu-hiring', photo: {f: 'mbs-night.jpg', pos: '50% 30%'}, kicker: 'WE\'RE HIRING · MOSTLY REMOTE', title: 'Join Hotcoin, 9 years in crypto', head: '16 open<br>roles', swipe: true},
  {id: 'fri-autumn', photo: {f: 'mbs-bay.jpg', pos: '50% 8%'}, kicker: 'TOKEN2049 · MARINA BAY SANDS · OCT 7 TO 8', title: 'Hotcoin, since 2017 · our autumn', head: 'Year 9.<br>What we shipped', swipe: false},
  {id: 'fri-earn', theme: 'lime', v: 0, title: 'Fixed-Term Earn · ends Nov 28', head: 'Up to <b class="ch">6.00%</b><br>APR',
   obj: {n: 'jar', x: 180, y: 760, w: 980, rot: -4}, candles: [[90, 620, 120, .85], [170, 700, 80, .7]], swipe: false},
  {id: 'fri-1pct', theme: 'dark', v: 0, title: 'Hotcoin 101 · 80-second video', head: 'The <b class="ch">1%</b><br>rule',
   obj: {n: 'hand', x: 520, y: 520, w: 640, rot: 6}, candles: [[110, 860, 90, .85, '#E5484D'], [190, 940, 60, .7, '#E5484D']], swipe: false},
  {id: 'mon-funding', theme: 'lime', v: 1, title: 'Hotcoin 101 · 6 slides', head: 'Funding rate:<br>who pays whom?',
   obj: {n: 'scale', x: 330, y: 560, w: 760}, candles: [[90, 760, 110, .85], [170, 850, 70, .7]], swipe: true},
  {id: 'mon-tradfi', theme: 'dark', v: 1, title: 'TradFi 0 Fee Carnival · ends Dec 4', head: '<b class="ch">100%</b><br>of fees back',
   obj: {n: 'terminal', x: 470, y: 600, w: 640, rot: 10}, candles: [[110, 880, 110, .85], [190, 960, 70, .7]], swipe: false},
  {id: 'tue-datadesk', theme: 'white', v: 0, title: 'Bitcoin in November', head: '<b class="red">−23.7%</b>',
   sub: '$77,499 to $59,138 · Nov 1 to 25 preview', obj: null,
   candles: [[560, 640, 160, 1.5, '#E5484D'], [660, 760, 140, 1.5, '#E5484D'], [760, 700, 110, 1.5, '#17A86B'], [860, 860, 170, 1.5, '#E5484D'], [960, 980, 120, 1.5, '#E5484D']], swipe: true},
  {id: 'tue-reserves', theme: 'dark', v: 0, title: 'For every 1 BTC users hold, we hold', head: '<b class="ch">1.05</b> BTC',
   obj: {n: 'vault', x: 300, y: 640, w: 760, disc: '105%'}, candles: [[100, 820, 110, .85], [180, 900, 70, .7]], swipe: false},
];


// Photo style (Nov 25, owner: mix real event photos so not every cover is the grain look): full-bleed licensed photo,
// light ink grade for legibility, thin lime frame with corner ticks, mono kicker, light grain for texture.
const pagePhoto = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800;900&family=JetBrains+Mono:wght@700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:#07090A;color:#F2F4EF;font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
.ph{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${c.photo.pos};filter:saturate(.9) contrast(1.05)}
.grade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,9,10,.88) 0%,rgba(7,9,10,.55) 34%,rgba(7,9,10,0) 58%,rgba(7,9,10,.35) 100%)}
.frame{position:absolute;inset:28px;border:2px solid rgba(184,242,106,.85);border-radius:6px}
.tick{position:absolute;width:44px;height:44px;border-color:#B8F26A;border-style:solid}
.kick{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:20px;letter-spacing:4px;color:#B8F26A}
.title{font-weight:600;font-size:44px;letter-spacing:-1px;color:rgba(242,244,239,.88);margin-top:22px}
.head{font-weight:800;font-size:112px;letter-spacing:-4.5px;line-height:.98;margin-top:12px;text-shadow:0 6px 30px rgba(0,0,0,.45)}
.swipe{position:absolute;right:64px;bottom:60px;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:24px;letter-spacing:4px;color:#0B0E11;background:#B8F26A;padding:12px 20px;border-radius:99px}
</style></head><body>
<img class="ph" src="${b64j(`${DIR}/src/${c.photo.f}`)}">
<div class="grade"></div>
<div class="frame"></div>
<div class="tick" style="left:20px;top:20px;border-width:6px 0 0 6px"></div><div class="tick" style="right:20px;top:20px;border-width:6px 6px 0 0"></div>
<div class="tick" style="left:20px;bottom:20px;border-width:0 0 6px 6px"></div><div class="tick" style="right:20px;bottom:20px;border-width:0 6px 6px 0"></div>
<img src="${LOGO.white}" style="position:absolute;left:72px;top:72px;height:40px">
<div style="position:absolute;left:72px;right:72px;top:168px">
  <div class="kick">${c.kicker}</div><div class="title">${c.title}</div><div class="head">${c.head}</div>
</div>
${c.swipe ? '<div class="swipe">SWIPE →</div>' : ''}
<canvas id="grain" width="1080" height="1350" style="position:absolute;left:0;top:0;mix-blend-mode:overlay;opacity:.12"></canvas>
<script>(async()=>{await document.fonts.ready;const g=document.getElementById('grain').getContext('2d'),d=g.createImageData(1080,1350);let s=5;const r=()=>(s=(s*16807)%2147483647)/2147483647;
for(let i=0;i<d.data.length;i+=4){const n=r()*255;d.data[i]=d.data[i+1]=d.data[i+2]=n;d.data[i+3]=255}g.putImageData(d,0,0);document.body.dataset.done=1})();</script>
</body></html>`;

const page = (c) => {
  const T = THEMES[c.theme], v = c.v;
  const blobs = v === 0
    ? `<circle cx="-40" cy="1180" r="520" fill="${T.blobs[0]}" opacity="${T.blobOp[0]}"/><circle cx="1010" cy="760" r="300" fill="${T.blobs[1]}" opacity="${T.blobOp[1]}"/><circle cx="960" cy="1280" r="110" fill="${T.blobs[2]}" opacity="${T.blobOp[2]}"/>`
    : `<circle cx="1120" cy="1150" r="560" fill="${T.blobs[0]}" opacity="${T.blobOp[0]}"/><circle cx="40" cy="780" r="290" fill="${T.blobs[1]}" opacity="${T.blobOp[1]}"/><circle cx="140" cy="1250" r="90" fill="${T.blobs[2]}" opacity="${T.blobOp[2]}"/>`;
  const o = c.obj;
  const objHtml = o ? `<div style="position:absolute;left:${o.x}px;top:${o.y}px;width:${o.w}px;transform:rotate(${o.rot || 0}deg);filter:drop-shadow(0 30px 40px rgba(0,0,0,${T.ink ? .18 : .5}))">
      <img src="${cut(o.n, T.ink)}" style="width:100%;display:block">
      ${o.disc ? `<div class="disc"><b class="ch">${o.disc}</b></div>` : ''}</div>` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800;900&family=JetBrains+Mono:wght@700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:${T.bg};color:${T.fg};font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
canvas,svg{position:absolute;left:0;top:0}
.title{font-weight:600;font-size:46px;letter-spacing:-1px;color:${T.sub}}
.head{font-weight:800;font-size:122px;letter-spacing:-5px;line-height:.98;margin-top:16px;text-wrap:balance}
.ch{font-weight:900;background:${T.ink && c.theme === 'lime' ? 'linear-gradient(180deg,#3A4148 0%,#0B0E11 45%,#4A525A 58%,#0B0E11 80%)' : 'linear-gradient(180deg,#FFFFFF 0%,#D9DDE0 38%,#8E9499 52%,#F4F6F7 66%,#B8F26A 120%)'};-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(3px 3px 0 ${c.theme === 'lime' ? '#F2F4EF' : T.chromeEdge}) drop-shadow(3px 3px 0 ${c.theme === 'lime' ? '#F2F4EF' : T.chromeEdge}) drop-shadow(0 18px 24px rgba(0,0,0,.35));padding-right:6px}
.red{color:#E5484D;font-weight:900;font-size:220px;letter-spacing:-10px}
.sub{font-weight:700;font-size:40px;letter-spacing:-.6px;margin-top:18px}
.swipe{position:absolute;right:64px;bottom:60px;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:24px;letter-spacing:4px;color:${T.fg};background:${T.bg};padding:12px 20px;border-radius:99px;z-index:2}
.disc{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:46%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%,#1C4A2C,#07090A 70%);
  display:grid;place-items:center;box-shadow:0 0 0 10px rgba(184,242,106,.18),0 20px 40px rgba(0,0,0,.5)}
.disc b{font-size:112px;letter-spacing:-5px}
</style></head><body>
<svg width="1080" height="1350">
 <defs><linearGradient id="chr" x1="0" x2="1"><stop offset="0" stop-color="#8d9196"/><stop offset=".35" stop-color="#f4f6f7"/><stop offset=".6" stop-color="#b9bdc1"/><stop offset="1" stop-color="#6f7378"/></linearGradient>
 <linearGradient id="hl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
 ${blobs}
</svg>
<canvas id="stip" width="1080" height="1350"></canvas>
<svg width="1080" height="1350">${(c.candles || []).map(candle).join('')}</svg>
${objHtml}
<img src="${LOGO[T.logo]}" style="position:absolute;left:72px;top:68px;height:40px">
<div style="position:absolute;left:72px;right:72px;top:160px">
  <div class="title">${c.title}</div>
  <div class="head">${c.head}</div>
  ${c.sub ? `<div class="sub">${c.sub}</div>` : ''}
</div>
${c.swipe ? '<div class="swipe">SWIPE →</div>' : ''}
<canvas id="grain" width="1080" height="1350" style="mix-blend-mode:overlay;opacity:${T.grain}"></canvas>
<script>
(async () => {
  await document.fonts.ready;
  const im = new Image(); im.src = '${SYM}'; await im.decode();
  const S = 1250, ox = ${v === 0 ? 260 : -300}, oy = ${v === 0 ? 300 : 260};
  const t = document.createElement('canvas'); t.width = t.height = S; const tc = t.getContext('2d'); tc.drawImage(im, 0, 0, S, S);
  const src = tc.getImageData(0, 0, S, S).data, cx = document.getElementById('stip').getContext('2d'), out = cx.createImageData(1080, 1350), o = out.data;
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let y = 0; y < 1350; y++) for (let x = 0; x < 1080; x++) {
    const sx = x - ox, sy = y - oy; if (sx < 0 || sy < 0 || sx >= S || sy >= S) continue;
    if (src[(sy * S + sx) * 4 + 3] < 128) continue;
    const d = Math.min(1, Math.max(0, ${v === 0 ? '1.15 - (sx + sy) / S' : '(sx + sy) / S - .15'}));
    if (rnd() < d * d * .9) { const i = (y * 1080 + x) * 4; o[i] = ${T.stip.split(',')[0]}; o[i+1] = ${T.stip.split(',')[1]}; o[i+2] = ${T.stip.split(',')[2]}; o[i+3] = 255 * ${T.stipOp}; }
  }
  cx.putImageData(out, 0, 0);
  const g = document.getElementById('grain').getContext('2d'), gd = g.createImageData(1080, 1350);
  for (let i = 0; i < gd.data.length; i += 4) { const n = rnd() * 255; gd.data[i] = gd.data[i+1] = gd.data[i+2] = n; gd.data[i+3] = 255; }
  g.putImageData(gd, 0, 0); document.body.dataset.done = 1;
})();
</script></body></html>`;
};

const only = (process.argv[2] || '').split(',').filter(Boolean);
const OUT = `${DIR}/out`; fs.mkdirSync(OUT, {recursive: true});
const br = await chromium.launch(); const p = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const c of COVERS) {
  if (only.length && !only.includes(c.id)) continue;
  await p.setContent(c.photo ? pagePhoto(c) : page(c), {waitUntil: 'networkidle'});
  await p.waitForSelector('body[data-done]', {timeout: 60000}); await p.waitForTimeout(150);
  const fontsOk = await p.evaluate(() => ['800 50px "Inter Tight"', '700 20px "JetBrains Mono"'].every(f => document.fonts.check(f)));
  if (!fontsOk) throw new Error('fonts not loaded for ' + c.id);
  await p.screenshot({path: `${OUT}/${c.id}.png`});
  console.log(c.id);
}
await br.close();
