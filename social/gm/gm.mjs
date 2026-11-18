// Daily GM planner + photo framer, built on the Nov 18, 2026 peer benchmark (Crypto_Exchange_GM_Posts_Research.docx):
// 411 GM posts from 14 exchange accounts on X, 90 days. Key findings used here:
//  - text-only GMs: 1.22x views vs account median; promo/CTA/link inside a GM: 0.49x replies -> no links, no rewards in GM.
//  - lowercase, under ~40 chars, one idea; 1-second reply prompts lift replies (1.09x to 1.19x).
//  - real photos and one ownable visual series protect reach -> "green thing of the day" real photo + small symbol tile.
//  - fixed slot: 11:00 JST (= 10:00 UTC+8) for 4 weeks; test 20:30 JST on Tue/Thu.
// Market mood uses CoinGecko BTC 24h change (no prices in copy, so no price post / risk line needed).
// Usage:
//   PW_PATH=$(npm root -g)/playwright node social/gm/gm.mjs [YYYY-MM-DD]
// Photo days: drop the team's phone photo at social/gm/inbox/<date>.jpg (or .png). No photo -> falls back to text-only.
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const ROOT = '/home/user/sandbox', DIR = `${ROOT}/social/gm`;
const args = process.argv.slice(2);
const date = args.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a)) || new Date(Date.now() + 864e5).toISOString().slice(0, 10); // default: tomorrow
const opt = k => (args.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1];
const d = new Date(date + 'T00:00:00Z'), dow = d.getUTCDay(), n = Math.round(d / 864e5);
const pick = (arr, salt = 0) => arr[(n + salt) % arr.length];

// Copy bank. Lowercase, short, no links, no em dashes, no rewards. Lines from the report are marked (r).
const BANK = {
  green: ['gm. green day, act normal', 'gm. we are so back (for now)', 'gm. it\'s green somewhere 🟩', 'gm. charts woke up happy', 'gm. don\'t screenshot too early'],
  red: ['gm. still here. still building', 'gm to the ones who held through the boring part', 'gm. red candles, green tea 🍵', 'say gm if you\'re still here after that candle', 'gm. coffee first, charts later ☕'],
  flat: ['gm. new week, same chart addiction', 'gm. the chart is up before you, again', 'gm. sideways is a lifestyle', 'gm. boring market, great coffee', 'gm. if you\'re reading this before checking your pnl, you\'re stronger than most'],
  prompt: ['gm, what\'s the ticker?', 'gm. reply with the first ticker you checked today. no lying', 'gm. rate your sleep vs your portfolio, 1 to 10 👇', 'gm. one emoji for your week so far 👇', 'if i say gm, you say gm back'],
  greenThing: ['gm. found today\'s green 🟩', 'gm. today\'s green 🟩', 'gm. green thing of the day 🟩', 'gm. spotted some green 🟩'],
  setup: ['gm. rate this setup 1 to 10 👇', 'gm. show us yours 👇', 'gm from the desk. rate it 👇'],
  kaomoji: ['(｡•̀ᴗ-)✧ gm', 'ʕ•ᴥ•ʔ gm', '( ˘▽˘)っ☕ gm', '(•̀ᴗ•́)و gm', '(￣ω￣) gm'],
  merch: ['gm from the hotcoin office', 'gm from team hotcoin 🟩', 'gm. office morning, green as usual'],
  grass: ['gm. charts can wait 10 min', 'gm. touch grass first 🌱', 'gm. sunday reset'],
};
// Weekly calendar (report section 5). photo:true = needs a real photo in inbox/.
const CAL = {
  1: {fmt: 'text-only market mood', key: 'mood'},
  2: {fmt: 'green thing of the day (real photo)', key: 'greenThing', photo: true, testSlot: true},
  3: {fmt: 'reply prompt (text-only)', key: 'prompt'},
  4: {fmt: 'desk / setup photo', key: 'setup', photo: true, testSlot: true},
  5: {fmt: 'kaomoji gm (text-only)', key: 'kaomoji'},
  6: {fmt: 'merch or team-pet photo', key: 'merch', photo: true},
  0: {fmt: 'touch-grass outdoor photo', key: 'grass', photo: true},
};
const day = CAL[dow];
let key = day.key, mood = null;
if (key === 'mood') {
  try {
    const j = await (await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true', {signal: AbortSignal.timeout(15000)})).json();
    const c = j.bitcoin.usd_24h_change; mood = c; key = c > 2 ? 'green' : c < -2 ? 'red' : 'flat';
  } catch { key = 'flat'; }
}
// <date>.branded.jpg = logo already built into the scene (AI with official mark as reference): no corner tile.
const photo = ['branded.jpg', 'jpg', 'jpeg', 'png'].map(e => `${DIR}/inbox/${date}.${e}`).find(f => fs.existsSync(f));
const branded = !!photo && photo.includes('.branded.');
const caption = pick(BANK[key]);
const out = `${DIR}/out/${date}`; fs.mkdirSync(out, {recursive: true});
let image = null, look;
if (day.photo && photo) {
  const {chromium} = require(process.env.PW_PATH);
  const b64 = f => `data:image/${f.endsWith('png') ? 'png' : 'jpeg'};base64,` + fs.readFileSync(f).toString('base64');
  // Avatar-style mark: official symbol SVG with the dot in white too (matches the X profile tile).
  const sym = 'data:image/svg+xml;base64,' + Buffer.from(fs.readFileSync(`${ROOT}/hotcoin-tradfi/public/brand/symbol-lime-dot.svg`, 'utf8').replace(/#B8F26A/g, '#FFFFFF')).toString('base64');
  // Look = layout x tone, rotated by series day so consecutive GMs never match (override per day in inbox/<date>.json).
  // Layouts: viewfinder (focus corners + GM chip), ruler (tick ruler + date + format), side (vertical lime ruler), chip (one GM label),
  // clean (photo only). Tones: mono (B&W, only lime/green keeps colour) or color. Wordmark + time/event bar ONLY when meta.event is set.
  const meta = fs.existsSync(`${DIR}/inbox/${date}.json`) ? JSON.parse(fs.readFileSync(`${DIR}/inbox/${date}.json`, 'utf8')) : {};
  const n = Math.max(0, Math.round((d - new Date('2026-11-24T00:00:00Z')) / 864e5));
  // rotate by photo-day index (Tue/Thu/Sat/Sun), so every 4-post week mixes looks and includes a clean photo
  let pi = 0; for (let t = new Date('2026-11-24T00:00:00Z'); t < d; t = new Date(+t + 864e5)) if (CAL[t.getUTCDay()].photo) pi++;
  const LAYOUTS = ['viewfinder', 'ruler', 'clean', 'side', 'chip', 'viewfinder', 'clean', 'ruler', 'side', 'chip', 'clean', 'viewfinder'];
  const layout = opt('layout') || meta.layout || LAYOUTS[pi % LAYOUTS.length];
  const tone = opt('tone') || meta.tone || (layout === 'clean' ? 'color' : pi % 2 ? 'mono' : 'color');
  const style = tone; // used by the pixel filter below
  const [fx, fy, fw, fh] = meta.focus || [190, 300, 700, 760];
  const seriesNo = String(n + 1).padStart(3, '0');
  const wm = b64(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-white.png`);
  const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][d.getUTCMonth()];
  const dayLabel = `${['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dow]} ${String(d.getUTCDate()).padStart(2, '0')} ${MON}`;
  const fmtLabel = (meta.label || day.fmt.replace(/\s*\(.*\)/, '')).toUpperCase();
  const L = '#B8F26A', C = 46, T = 4;
  const M = (css, txt, col = '#fff') => `<div class="m" style="position:absolute;${css};color:${col};font-size:22px;letter-spacing:3px">${txt}</div>`;
  const chip = (css) => `<div class="m" style="position:absolute;${css};color:${L};font-size:22px;letter-spacing:3px;background:rgba(11,14,17,.78);padding:5px 10px 4px">GM / ${seriesNo}</div>`;
  const grad = (top) => `<div style="position:absolute;left:0;right:0;${top ? 'top' : 'bottom'}:0;height:230px;background:linear-gradient(${top ? 'rgba(0,0,0,.45),transparent' : 'transparent,rgba(0,0,0,.5)'})"></div>`;
  const corners = [[fx, fy, 'top', 'left'], [fx + fw, fy, 'top', 'right'], [fx, fy + fh, 'bottom', 'left'], [fx + fw, fy + fh, 'bottom', 'right']]
    .map(([x, y, v, h]) => `<div style="position:absolute;${h}:${h === 'left' ? x : 1080 - x}px;${v}:${v === 'top' ? y : 1350 - y}px;width:${C}px;height:${C}px;border-${v}:${T}px solid ${L};border-${h}:${T}px solid ${L}"></div>`).join('');
  const cross = `<div style="position:absolute;left:${fx + fw / 2 - 9}px;top:${fy + fh / 2 - 1}px;width:18px;height:2px;background:rgba(255,255,255,.7)"></div><div style="position:absolute;left:${fx + fw / 2 - 1}px;top:${fy + fh / 2 - 9}px;width:2px;height:18px;background:rgba(255,255,255,.7)"></div>`;
  const hTicks = Array.from({length: 25}, (_, i) => `<div style="position:absolute;left:${64 + i * 39.67}px;top:${i % 6 === 0 ? -10 : -5}px;width:1.5px;height:${i % 6 === 0 ? 20 : 10}px;background:rgba(255,255,255,${i % 6 === 0 ? .9 : .55})"></div>`).join('');
  const vTicks = Array.from({length: 31}, (_, i) => `<div style="position:absolute;top:${i * 30}px;left:${i % 5 === 0 ? -12 : -6}px;height:2px;width:${i % 5 === 0 ? 24 : 12}px;background:${i % 5 === 0 ? L : 'rgba(255,255,255,.6)'}"></div>`).join('');
  const LAY = {
    clean: '',
    viewfinder: corners + cross + chip(`left:${fx}px;top:${fy - 46}px`),
    ruler: grad(false) + `<div style="position:absolute;left:0;right:0;top:1262px;height:1.5px;background:linear-gradient(90deg,transparent 64px,rgba(255,255,255,.6) 64px,rgba(255,255,255,.6) 1016px,transparent 1016px)">${hTicks}</div>`
      + M('left:64px;top:1284px', dayLabel) + M('right:64px;top:1284px', fmtLabel) + chip('left:64px;top:1196px'),
    side: `<div style="position:absolute;left:58px;top:220px;width:2px;height:900px;background:rgba(255,255,255,.55)">${vTicks}</div>`
      + `<div class="m" style="position:absolute;left:96px;top:220px;writing-mode:vertical-rl;color:#fff;font-size:22px;letter-spacing:4px;background:rgba(11,14,17,.78);padding:12px 5px"><span style="color:${L}">GM / ${seriesNo}</span> &nbsp; ${dayLabel}</div>`,
    chip: grad(false) + chip('left:64px;bottom:64px') + `<div style="position:absolute;left:64px;right:64px;bottom:52px;height:2px;background:${L};opacity:.9"></div>`,
  };
  // Event days only: wordmark + event/time bar on top.
  const eventBar = meta.event ? grad(true) + `<img src="${wm}" style="position:absolute;left:64px;top:60px;height:34px">` + M('right:64px;top:64px', `${meta.event} <span style="color:${L}">●</span> ${meta.time || ''}`) : '';
  const overlay = (LAY[layout] ?? '') + eventBar;
  look = `${layout} / ${tone}${meta.event ? ' / event' : ''}`;
  const html = `<!doctype html><html><head><style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=block');.m{font-family:'JetBrains Mono',monospace}</style></head>
  <body style="margin:0;width:1080px;height:1350px;overflow:hidden;position:relative;background:#000">
  <canvas id="c" width="2160" height="2700" style="position:absolute;inset:0;width:1080px;height:1350px"></canvas>
  ${overlay}
  <div style="display:${branded ? 'none' : 'flex'};position:absolute;right:48px;bottom:${layout === 'clean' ? 48 : 130}px;width:104px;height:104px;border-radius:26px;background:#7EC25A;align-items:center;justify-content:center;box-shadow:0 8px 30px rgba(0,0,0,.25)">
  <img src="${sym}" style="width:62px"></div>
  <script>
  const im = new Image(); im.onload = () => {
    const c = document.getElementById('c'), x = c.getContext('2d');
    const s = Math.max(2160 / im.width, 2700 / im.height), w = im.width * s, h = im.height * s;
    x.drawImage(im, (2160 - w) / 2, (2700 - h) / 2, w, h);
    if (${style === 'mono'}) {
      const D = x.getImageData(0, 0, 2160, 2700), a = D.data;
      for (let i = 0; i < a.length; i += 4) {
        const r = a[i] / 255, g = a[i + 1] / 255, b = a[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), dl = mx - mn;
        let hue = 0; if (dl) hue = mx === r ? 60 * (((g - b) / dl) % 6) : mx === g ? 60 * ((b - r) / dl + 2) : 60 * ((r - g) / dl + 4); if (hue < 0) hue += 360;
        const sat = mx ? dl / mx : 0;
        // keep lime/green (hue 60 to 170, saturated); everything else goes to contrasty B&W
        const k = Math.min(1, Math.max(0, (sat - .12) / .12)) * Math.min(1, Math.max(0, Math.min(hue - 52, 175 - hue) / 12));
        let y = .3 * r + .59 * g + .11 * b; y = Math.min(1, Math.max(0, (y - .5) * 1.18 + .5));
        a[i] = 255 * (y + (r - y) * k); a[i + 1] = 255 * (y + (g - y) * k); a[i + 2] = 255 * (y + (b - y) * k);
      }
      x.putImageData(D, 0, 0);
    }
    document.body.dataset.ready = 1;
  }; im.src = '${b64(photo)}';
  </script></body></html>`;
  const br = await chromium.launch(); const p = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
  await p.setContent(html, {waitUntil: 'networkidle'}); await p.waitForSelector('body[data-ready]'); await p.waitForTimeout(300);
  image = `${out}/gm-${date}${opt('layout') || opt('tone') ? `-${layout}-${tone}` : ''}.png`; await p.screenshot({path: image}); await br.close();
}
const fallback = day.photo && !photo;
const finalCaption = fallback ? pick([...BANK.flat, ...BANK.prompt], 3) : caption;
const plan = {
  date, weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow], format: fallback ? 'text-only (photo missing)' : day.fmt,
  caption: finalCaption, chars: [...finalCaption].length, image, look,
  btc24h: mood == null ? undefined : +mood.toFixed(2),
  slot: '11:00 JST (10:00 UTC+8)', testSlot: day.testSlot ? '20:30 JST (19:30 UTC+8), second GM for the EU/US test' : undefined,
  firstHour: 'reply to every gm by name, quote the funniest reply, shout out a regular',
};
if (fallback) console.warn(`No photo in social/gm/inbox/${date}.jpg, posting text-only instead.`);
fs.writeFileSync(`${out}/plan.json`, JSON.stringify(plan, null, 2) + '\n');
fs.writeFileSync(`${out}/caption.txt`, finalCaption + '\n');
console.log(JSON.stringify(plan, null, 2));
