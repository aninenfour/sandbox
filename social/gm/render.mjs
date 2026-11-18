// Daily GM generator. One command renders the GM card + caption for a date.
// Usage: PW_PATH=$(npm root -g)/playwright node social/gm/render.mjs [YYYY-MM-DD] [--theme=data|serif|dots|streak|follow|lime] [--lang=en|zh]
// Data theme: live prices from CoinGecko (api.coingecko.com/api/v3/simple/price), date-stamped on the card. Logos: brand files only.
// Falls back to a non-data theme if CoinGecko is unreachable. 1080x1350 @2x. No em dashes, no competitor names.
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const OUT = `${ROOT}/social/gm/out`; fs.mkdirSync(OUT, {recursive: true});
const args = process.argv.slice(2);
const date = args.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a)) || new Date().toISOString().slice(0, 10);
const opt = k => (args.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1];
const lang = opt('lang') || 'en';
const d = new Date(date + 'T00:00:00Z');
const dow = d.getUTCDay(); // 0 Sun
const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
// Weekly rotation: never the same layout two days running.
const ROTATION = {1: 'data', 2: 'serif', 3: 'dots', 4: 'streak', 5: 'data', 6: 'follow', 0: 'lime'};
let theme = opt('theme') || ROTATION[dow];
const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A', UP = '#17A86B', DOWN = '#E5484D', GRAY = '#6B7280';
const img64 = f => 'data:image/png;base64,' + fs.readFileSync(`${ROOT}/hotcoin-tradfi/public/brand/${f}`).toString('base64');
const LOGO_W = img64('logo-official-white.png'), LOGO_B = img64('logo-official-black.png'), SYM = img64('symbol-official-white.png');
const HANDLE = '@HotcoinGlobal';
const GM = lang === 'zh' ? '早安' : 'GM';
const URL = lang === 'zh' ? 'hotcoinv5.com' : 'hotcoin.com';

// Day counter for the streak theme (days since the series start).
const START = new Date('2026-11-19T00:00:00Z');
const dayNo = Math.max(1, Math.round((d - START) / 864e5) + 1);

let coins = null;
if (theme === 'data') {
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true', {signal: AbortSignal.timeout(15000)});
    const j = await r.json();
    coins = [['BTC', 'bitcoin'], ['ETH', 'ethereum'], ['SOL', 'solana']].map(([t, id]) => ({t, p: j[id].usd, c: j[id].usd_24h_change}));
  } catch (e) { console.warn('CoinGecko failed, falling back to serif theme:', e.message); theme = 'serif'; }
}
const fmt = p => p >= 1000 ? '$' + Math.round(p).toLocaleString('en-US') : '$' + p.toFixed(2);
const pct = c => (c >= 0 ? '+' : '') + c.toFixed(1) + '%';

const HEAD = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Instrument+Serif:ital@1&family=Noto+Sans+SC:wght@700;900&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;font-family:'Inter Tight','Noto Sans SC',sans-serif}
.m{font-family:'JetBrains Mono',monospace}.s{font-family:'Instrument Serif','Noto Sans SC',serif;font-style:italic;font-weight:400}
.top{position:absolute;left:72px;right:72px;top:68px;display:flex;justify-content:space-between;align-items:center}
</style></head><body>`;
const dateTag = `${DAYS[dow]} · ${date}`;

const T = {
  data: () => `<div style="position:absolute;inset:0;background:#fff;color:${INK}"></div>
  <svg width="1080" height="1350" style="position:absolute;inset:0"><defs><pattern id="p" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.6" fill="${INK}"/></pattern>
  <radialGradient id="g"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><mask id="mk"><circle cx="880" cy="1050" r="420" fill="url(#g)"/></mask></defs>
  <rect width="1080" height="1350" fill="url(#p)" mask="url(#mk)" opacity=".07"/></svg>
  <div class="top"><img src="${LOGO_B}" style="height:42px"><div class="m" style="font-size:18px;letter-spacing:2px;border:1.5px solid ${INK};border-radius:999px;padding:9px 18px">${dateTag}</div></div>
  <div style="position:absolute;left:72px;top:190px;color:${INK}">
    <div class="m" style="font-size:20px;letter-spacing:3px;color:${GRAY}">MARKET CHECK</div>
    <div style="font-weight:800;font-size:300px;letter-spacing:-14px;line-height:.9;margin-top:8px">${GM}.</div>
    <div style="font-weight:700;font-size:46px;letter-spacing:-1.5px;line-height:1.1;margin-top:26px">${coins[0].c >= 0 ? 'Green start.' : 'Red start.'}<br><span style="color:${GRAY}">Here is where the majors sit.</span></div></div>
  <div style="position:absolute;left:72px;right:72px;top:830px">
    <div class="m" style="display:flex;font-size:16px;letter-spacing:2.5px;color:${GRAY};padding-bottom:12px;border-bottom:1.5px solid ${INK}"><div style="flex:1">ASSET</div><div style="width:260px;text-align:right">PRICE</div><div style="width:200px;text-align:right">24H</div></div>
    ${coins.map(c => `<div style="display:flex;align-items:center;padding:26px 0;border-bottom:1px solid #E6E8EB;font-size:44px;font-weight:700"><div style="flex:1">${c.t}</div><div style="width:260px;text-align:right">${fmt(c.p)}</div><div class="m" style="width:200px;text-align:right;color:${c.c >= 0 ? UP : DOWN}">${pct(c.c)}</div></div>`).join('')}
  </div>`,
  serif: () => `<div style="position:absolute;inset:0;background:${INK}"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(900px 700px at 50% 55%,rgba(184,242,106,.16),transparent 70%)"></div>
  <div class="top"><img src="${LOGO_W}" style="height:42px"><div class="m" style="font-size:18px;letter-spacing:2px;color:${LIME}">${dateTag}</div></div>
  <div class="s" style="position:absolute;left:0;right:0;top:340px;text-align:center;font-size:${lang === 'zh' ? 380 : 520}px;line-height:1;color:${LIME}">${lang === 'zh' ? '早安' : 'gm'}</div>
  <div style="position:absolute;left:0;right:0;top:960px;text-align:center;color:#fff;font-weight:600;font-size:46px;letter-spacing:-1px">${lang === 'zh' ? '今天也要稳稳前进。' : 'Another day. Same plan. Stay sharp.'}</div>`,
  dots: () => `<div style="position:absolute;inset:0;background:#000"></div><canvas id="c" width="1080" height="1350" style="position:absolute;inset:0"></canvas>
  <div class="top"><img src="${LOGO_W}" style="height:42px"><div class="m" style="font-size:18px;letter-spacing:2px;color:${LIME}">${dateTag}</div></div>
  <div class="s" style="position:absolute;left:72px;bottom:130px;color:#fff;font-size:76px;line-height:1.05">${lang === 'zh' ? '每天的点点滴滴，<br>汇成大图。' : 'Small moves,<br>every single day.'}</div>
  <script>document.fonts.load("800 560px 'Inter Tight'").then(()=>document.fonts.load("800 560px 'Noto Sans SC'")).then(()=>{const c=document.getElementById('c'),x=c.getContext('2d');const o=document.createElement('canvas');o.width=1080;o.height=1350;const q=o.getContext('2d');
  q.fillStyle='#fff';q.font="800 560px 'Inter Tight','Noto Sans SC'";q.textAlign='center';q.textBaseline='middle';q.fillText('${GM}',540,560);
  const im=q.getImageData(0,0,1080,1350).data;let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  for(let y=0;y<1350;y+=16)for(let xx=0;xx<1080;xx+=16){const on=im[((y*1080)+xx)*4+3]>128;x.beginPath();x.arc(xx+8,y+8,on?5.2:1.4+r()*.8,0,7);x.fillStyle=on?'${LIME}':'rgba(255,255,255,.22)';x.fill();}
  });</script>`,
  streak: () => `<div style="position:absolute;inset:0;background:${LIME}"></div>
  <div class="top"><img src="${LOGO_B}" style="height:42px"><div class="m" style="font-size:18px;letter-spacing:2px;color:${INK}">${dateTag}</div></div>
  <div class="m" style="position:absolute;left:72px;top:230px;font-size:26px;letter-spacing:4px;color:${INK}">${lang === 'zh' ? '连续早安' : 'GM STREAK'}</div>
  <div style="position:absolute;left:62px;top:250px;font-weight:800;font-size:640px;letter-spacing:-30px;line-height:1;color:${INK}">${dayNo}</div>
  <div style="position:absolute;left:72px;top:960px;color:${INK};font-weight:800;font-size:74px;letter-spacing:-2.5px;line-height:1">${lang === 'zh' ? `第${dayNo}天，早安。` : `Day ${dayNo}. GM.`}</div>
  <div class="s" style="position:absolute;left:72px;top:1060px;color:${INK};font-size:58px">${lang === 'zh' ? '没有一天缺席。' : 'We showed up. Did you?'}</div>`,
  follow: () => `<div style="position:absolute;inset:0;background:${INK}"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(700px 700px at 50% 45%,rgba(184,242,106,.18),transparent 70%)"></div>
  <div class="top"><img src="${LOGO_W}" style="height:42px"><div class="m" style="font-size:18px;letter-spacing:2px;color:${LIME}">${dateTag}</div></div>
  <div style="position:absolute;left:0;right:0;top:230px;text-align:center;color:#fff;font-weight:800;font-size:150px;letter-spacing:-6px">${GM}</div>
  <div style="position:absolute;left:150px;right:150px;top:470px;perspective:1400px">
    <div style="transform:rotateX(14deg) rotateY(-10deg) rotate(-2deg);background:rgba(255,255,255,.06);border:1.5px solid rgba(184,242,106,.5);border-radius:36px;padding:56px;box-shadow:0 60px 120px rgba(184,242,106,.18);backdrop-filter:blur(8px)">
      <div style="display:flex;align-items:center;gap:30px"><div style="width:130px;height:130px;border-radius:30px;background:${GREEN};display:flex;align-items:center;justify-content:center"><img src="${SYM}" style="width:80px"></div>
      <div><div style="color:#fff;font-weight:800;font-size:58px;letter-spacing:-1.5px">Hotcoin</div><div class="m" style="color:${LIME};font-size:28px;margin-top:6px">${HANDLE}</div></div></div>
      <div style="margin-top:44px;background:${LIME};color:${INK};text-align:center;font-weight:800;font-size:54px;border-radius:999px;padding:26px 0">${lang === 'zh' ? '关注我们' : 'Follow'}</div></div></div>
  <div class="s" style="position:absolute;left:0;right:0;top:1030px;text-align:center;color:#fff;font-size:74px;line-height:1.1">${lang === 'zh' ? '每天一起，<br>早安从这里开始。' : 'Start every morning<br>with us.'}</div>`,
  lime: () => `<div style="position:absolute;inset:0;background:#fff"></div>
  <div style="position:absolute;right:-160px;bottom:-160px;width:520px;height:520px;border-radius:50%;background:${LIME}"></div>
  <div class="top"><img src="${LOGO_B}" style="height:42px"><div class="m" style="font-size:18px;letter-spacing:2px;color:${INK}">${dateTag}</div></div>
  <div class="s" style="position:absolute;left:72px;top:250px;color:${INK};font-size:${lang === 'zh' ? 330 : 440}px;line-height:1">${lang === 'zh' ? '早安' : 'gm,'}</div>
  <div style="position:absolute;left:72px;top:760px;color:${INK};font-weight:800;font-size:96px;letter-spacing:-3.5px;line-height:1">${lang === 'zh' ? '周日放松，<br>周一再战。' : 'Sunday reset.<br>Plan the week.'}</div>`,
};

const html = HEAD + T[theme]() + '</body></html>';
const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await p.setContent(html, {waitUntil: 'networkidle'}); await p.waitForTimeout(800);
const file = `${OUT}/gm-${date}-${theme}${lang === 'zh' ? '-zh' : ''}.png`;
await p.screenshot({path: file}); await b.close();

// Caption (X). Risk line only on the data theme. Rotated openers so replies stay fresh.
const Q = ['What are you building today?', 'One goal for today?', 'Coffee or green candles?', 'What is on your watchlist this morning?', 'Drop your first trade or task of the day.', 'Early bird or night owl trader?', 'What is the one thing you ship today?'];
const q = Q[Math.round(d / 864e5) % Q.length];
const cap = lang === 'zh' ? `早安 ☀️\n今天想做的第一件事是什么？评论区聊聊。\n\n${URL}` : `GM ☕🟩\n${q} Tell us below.\n${theme === 'follow' ? `\nFollow ${HANDLE} for a daily GM.\n` : ''}\n${theme === 'data' ? `BTC ${fmt(coins[0].p)}, ETH ${fmt(coins[1].p)}, SOL ${fmt(coins[2].p)} (CoinGecko, ${date}). Not financial advice.\n\n` : ''}${URL}`;
fs.writeFileSync(file.replace('.png', '.txt'), cap + '\n');
console.log(file); console.log(cap);
