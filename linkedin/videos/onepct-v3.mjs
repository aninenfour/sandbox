// "The 1% rule" v3 (owner feedback Nov 27 on v2: pixel figures unreadable and unrelated to the line, empty bottom,
// dotted chart hard to read, too slow, one style everywhere). v3 mixes styles on the brand green: readable duotone
// photo cutouts that act out the line (trader on phone + liquidation card; walker climbing the outro stairs), a
// 100-square account grid for "1%", a candle chart with entry and stop, a big equation, a clean line chart, bars.
// A trade-plan panel fills the bottom and fills in as the rule unfolds. 40.5 s, a new beat every 5 to 8 s.
// Math (checked): 1% of 10,000 = 100; 100 / 5% = 2,000; 2,000 x 5% = 100.
//   10,000 x 0.99^10 = 9,043.82 (-9.56%); 10,000 x 0.90^10 = 3,486.78 (-65.13%).
//   Way back: 10,000 / 9,043.82 - 1 = +10.57%; 10,000 / 3,486.78 - 1 = +186.80%.
// Figures: Unsplash phoneman hEY14e_tDgI (Victor Puerta), stairs 1jQLyh4h1MQ (Khiet Tam); see FOOTAGE_CREDITS.md.
// The liquidation card is an illustrative UI mock, not a real account.
// Run: node linkedin/videos/onepct-v3.mjs   (TEST=1,3.5,7 renders stills to out/v3frames/test-*.jpg)
// Music: DUR=40.5 BPM=112 KICK_FROM=0 HAT_FROM=2 python3 linkedin/videos/onepct-beat.py linkedin/videos/out/onepct-beat-v3.wav
import fs from 'fs'; import path from 'path'; import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH || 'playwright');
const DIR = path.dirname(new URL(import.meta.url).pathname), ROOT = path.resolve(DIR, '../..');
const OUT = `${DIR}/out/v3frames`; fs.mkdirSync(OUT, {recursive: true});
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const IMG = {
  logo: b64(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-white.png`),
  man: b64(`${ROOT}/linkedin/covers/cut/phoneman-raw.png`),
  walk: b64(`${ROOT}/linkedin/covers/cut/stairs-raw.png`),
};
const FPS = 30, DUR = 40.5, N = Math.round(FPS * DUR);
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=block');
html,body{margin:0;background:#0E5A31}canvas{display:block}</style></head><body>
<canvas id="c" width="1080" height="1350"></canvas>
<script>window.IMG=${JSON.stringify(IMG)};</script><script>${fs.readFileSync(`${DIR}/onepct-v3.page.js`, 'utf8')}</script></body></html>`;
const br = await chromium.launch(); const p = await br.newPage({viewport: {width: 1080, height: 1350}});
await p.setContent(html, {waitUntil: 'networkidle'});
await p.evaluate(async () => { for (const f of ['500 50px "Inter Tight"','600 50px "Inter Tight"','700 50px "Inter Tight"','800 50px "Inter Tight"','900 50px "Inter Tight"','700 20px "JetBrains Mono"','500 20px "JetBrains Mono"']) await document.fonts.load(f); await document.fonts.ready; await window.build(); });
const ok = await p.evaluate(() => ['900 50px "Inter Tight"', '800 50px "Inter Tight"', '700 20px "JetBrains Mono"'].every(f => document.fonts.check(f)));
if (!ok) throw new Error('fonts not loaded');
const TEST = (process.env.TEST || '').split(',').filter(Boolean).map(Number);
const list = TEST.length ? TEST.map(t => Math.round(t * FPS)) : [...Array(N).keys()];
if (!TEST.length) for (const f of fs.readdirSync(OUT)) fs.unlinkSync(`${OUT}/${f}`);
for (const i of list) {
  const b = await p.evaluate((t) => { window.draw(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93).split(',')[1]; }, i / FPS);
  fs.writeFileSync(`${OUT}/${TEST.length ? 'test-' : ''}${String(i).padStart(5, '0')}.jpg`, Buffer.from(b, 'base64'));
}
await br.close(); console.log('frames', list.length);
