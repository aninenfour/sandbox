// Viral-format test 3: hand-drawn whiteboard flowchart meme ("totally accurate").
// No data, no claims, no advice. Marker style with red arrows, our lime only in the end node.
import fs from 'fs'; import path from 'path'; import {createRequire} from 'module';
const require = createRequire(import.meta.url); const {chromium} = require(process.env.PW_PATH || 'playwright');
const DIR = path.dirname(new URL(import.meta.url).pathname);
const W = 1600, H = 1110, RED = '#D4272B', INK = '#1B1B1B', LIME = '#B8F26A';
// nodes: [id, x, y, w, h, text, shape]  shape: box | diamond | cloud | end
const N = [
  ['start', 70, 120, 230, 110, 'You just<br>woke up', 'box'],
  ['q1', 385, 90, 290, 170, 'Is the market<br>open?', 'diamond'],
  ['yes1', 720, 70, 260, 120, 'It is crypto.<br>It is always open.', 'cloud'],
  ['q2', 1040, 75, 300, 170, 'Have you had<br>coffee yet?', 'diamond'],
  ['coffee', 1370, 110, 190, 100, 'Go make<br>coffee', 'box'],
  ['q3', 1015, 350, 330, 190, 'Are you about<br>to check the chart<br>in bed?', 'diamond'],
  ['bed', 1370, 400, 200, 100, 'Get up<br>first', 'box'],
  ['q4', 640, 380, 270, 160, 'Is it green?', 'diamond'],
  ['green', 640, 620, 260, 110, 'Say gm<br>to everyone', 'box'],
  ['red', 300, 400, 240, 120, 'Zoom out<br>(further)', 'cloud'],
  ['q5', 230, 640, 320, 180, 'Still red on<br>the yearly?', 'diamond'],
  ['grass', 120, 900, 300, 100, 'Touch grass', 'box'],
  ['dca', 560, 880, 300, 110, 'Same plan as<br>yesterday', 'box'],
  ['end', 1010, 760, 470, 190, 'gm. now close the app<br>and live your life', 'end'],
];
const node = ([id, x, y, w, h, t, s]) => {
  const base = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:${s === 'end' ? 40 : s === 'diamond' ? 25 : 30}px;line-height:1.1;color:${INK}`;
  if (s === 'diamond') return `<div style="${base}"><svg style="position:absolute;inset:0" viewBox="0 0 ${w} ${h}"><path d="M${w / 2} 4 L${w - 4} ${h / 2} L${w / 2} ${h - 4} L4 ${h / 2} Z" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></svg><span style="position:relative;padding:0 44px">${t}</span></div>`;
  if (s === 'cloud') return `<div style="${base};border:3.5px solid ${INK};border-radius:50% 46% 52% 44% / 60% 50% 56% 48%;background:#fff">${t}</div>`;
  if (s === 'end') return `<div style="${base};border:4px solid ${INK};border-radius:14px;background:${LIME};transform:rotate(-1.5deg)">${t}</div>`;
  return `<div style="${base};border:3.5px solid ${INK};border-radius:6px;background:#fff;transform:rotate(${(x % 3) - 1}deg)">${t}</div>`;
};
// arrows: [x1,y1,x2,y2,label]
const A = [
  [300, 175, 400, 175], [650, 175, 720, 140, 'Yes'], [980, 140, 1060, 160], [1320, 160, 1370, 160, 'No'],
  [1190, 240, 1190, 360, 'Yes'], [1465, 210, 1290, 410], [1330, 445, 1370, 450, 'Yes'], [1040, 445, 910, 455, 'No'],
  [775, 540, 775, 620, 'Yes'], [640, 460, 540, 460, 'No'], [420, 520, 400, 640], [270, 810, 260, 900, 'Yes'],
  [480, 790, 620, 880, 'No'], [900, 675, 1010, 760], [860, 935, 1010, 905], [420, 950, 560, 935, 'then'],
];
const arrow = ([x1, y1, x2, y2, l]) => {
  const ang = Math.atan2(y2 - y1, x2 - x1), hx = x2 - 22 * Math.cos(ang - .45), hy = y2 - 22 * Math.sin(ang - .45), kx = x2 - 22 * Math.cos(ang + .45), ky = y2 - 22 * Math.sin(ang + .45);
  const mx = (x1 + x2) / 2 + (y2 - y1) * .06, my = (y1 + y2) / 2 - (x2 - x1) * .06;
  return `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="${RED}" stroke-width="4.5" stroke-linecap="round"/><path d="M${hx} ${hy} L${x2} ${y2} L${kx} ${ky}" fill="none" stroke="${RED}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`
    + (l ? `<text x="${mx}" y="${my - 10}" text-anchor="middle" font-family="Gochi Hand" font-size="28" fill="${RED}">${l}</text>` : '');
};
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Gochi+Hand&display=block');
body{margin:0;width:${W}px;height:${H}px;background:#F4F2EC;font-family:'Gochi Hand',cursive;position:relative;overflow:hidden}
</style></head><body>
<div style="position:absolute;inset:26px;background:#fff;border-radius:18px;box-shadow:0 2px 0 #ddd"></div>
<div style="position:absolute;left:0;right:0;top:34px;text-align:center;font-size:46px;color:${INK}">Should You Check The Chart Right Now?</div>
<div style="position:absolute;left:0;right:0;top:84px;text-align:center;font-size:30px;color:${INK}">(totally accurate)</div>
<div style="position:absolute;left:0;top:70px;width:${W}px;height:${H - 70}px"><svg width="${W}" height="${H}" style="position:absolute;inset:0;overflow:visible">${A.map(arrow).join('')}</svg>
${N.map(node).join('')}</div>
</body></html>`;
const br = await chromium.launch(); const p = await br.newPage({viewport: {width: W, height: H}, deviceScaleFactor: 2});
await p.setContent(html, {waitUntil: 'networkidle'}); await p.waitForTimeout(500);
fs.mkdirSync(`${DIR}/out`, {recursive: true}); await p.screenshot({path: `${DIR}/out/flowchart.png`}); await br.close();
console.log('ok');
