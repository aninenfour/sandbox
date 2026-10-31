// Daily Top Gainers TOP5, square (2000x2000), redesign of the glass-podium post.
//   sq-white   white, top-3 cards with gold/silver/bronze bezel coins, 4-5 rows
//   sq-black   same layout, dark
//   sq-mark    light grey, giant Hotcoin mark, five coins in a podium row
//   sq-cards   collectible-card fan
//   node social/daily/square.mjs [names...]
import {createRequire} from 'module';
import {spawn} from 'child_process';
import fs from 'fs';
const require = createRequire('/opt/node-tools/node_modules/');
const {chromium} = require(process.env.PW_PATH || 'playwright');
const ROOT = '/home/user/sandbox';
const DIR = ROOT + '/social/daily';
const PORT = 8768;

const D = {
  window: 'Oct 29 17:00 – Oct 30 17:00 (UTC+8)', date: 'OCT 30',
  gainers: [
    {sym: 'Q', name: 'Quack AI', ch: 38.02, logo: 'q', bg: '#141414', glow: '#FFD400'},
    {sym: 'HYPE', name: 'Hyperliquid', ch: 15.23, logo: 'hype', bg: '#0F2A24', glow: '#50E3C2'},
    {sym: 'SOXSB', name: 'Direxion SOXS · bStocks', ch: 14.14, logo: 'soxsb', bg: '#fff', glow: '#1A5DA6'},
    {sym: 'RUNE', name: 'THORChain', ch: 10.02, logo: 'rune', bg: '#0B0E11', glow: '#23DCC8'},
    {sym: 'UAI', name: 'UnifAI Network', ch: 8.66, logo: 'uai', bg: '#1E1E2E', glow: '#8B7CF6'},
  ],
};
// live runs (live.py) pass the day's data and an output folder
if (process.env.DATA) Object.assign(D, JSON.parse(fs.readFileSync(process.env.DATA, 'utf8')));
const OUT = process.env.OUT_DIR || DIR + '/img';
const pct = (v) => (v > 0 ? '+' : '') + v.toFixed(2) + '%';
const logo = (k) => `/social/daily/logos/${k}.png`;
const MARK_SLASH = 'M2.28588 5.14427L5.12855 2.3016C6.54988 3.24916 7.97122 5.14427 12.5906 5.49962C16.842 5.82668 19.3419 3.24917 21.1186 1.94628L24.3166 5.14429L5.12855 24.3323L1.93054 21.1343L13.3012 9.76362C7.97121 10.119 4.41787 7.2763 2.28588 5.14427Z';
const MARK_DOT = 'M23.6 19.7892C23.6 22.0094 21.8001 23.8093 19.5798 23.8093C17.3595 23.8093 15.5597 22.0094 15.5597 19.7892C15.5597 17.5689 17.3595 15.769 19.5798 15.769C21.8001 15.769 23.6 17.5689 23.6 19.7892Z';
const mark = (size, x, y, slash, dot, op) => `<svg viewBox="0 0 26 26" width="${size}" height="${size}" style="position:absolute;left:${x}px;top:${y}px;opacity:${op}"><path d="${MARK_SLASH}" fill="${slash}"/><path d="${MARK_DOT}" fill="${dot}"/></svg>`;

const METAL = {
  gold: 'conic-gradient(from 200deg,#FFF6C9,#D9A936,#FFF0A6,#9C7314,#F7D774,#B8891F,#FFF6C9)',
  silver: 'conic-gradient(from 200deg,#FFFFFF,#B9BEC4,#F4F6F8,#7D848C,#E9ECEF,#A4ABB2,#FFFFFF)',
  bronze: 'conic-gradient(from 200deg,#FFE0C2,#B86B34,#FFC48F,#7A4220,#E39A5E,#9A5526,#FFE0C2)',
  steel: 'conic-gradient(from 200deg,#E6E9EC,#6E757D,#C9CED3,#4A5058,#B3B9BF,#5D646C,#E6E9EC)',
};
const metalFor = (rank) => ['gold', 'silver', 'bronze'][rank - 1] || 'steel';
// no verified logo: the ticker letters stand in for it
const face = (g, size) => g.logo === 'missing'
  ? `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0B0E11;color:#B8F26A;font-family:Unbounded;font-weight:900;font-size:${size * (g.sym.length > 3 ? 0.18 : 0.3)}px;letter-spacing:-1px">${g.sym}</div>`
  : `<img src="${logo(g.logo)}">`;
const bezel = (g, size, metal) => `<div class="bz" style="width:${size}px;height:${size}px;padding:${Math.round(size * 0.075)}px;background:repeating-conic-gradient(rgba(0,0,0,.13) 0 1.2deg,transparent 1.2deg 2.4deg),${METAL[metal]}">
  <div class="in" style="background:${g.bg}">${face(g, size)}</div></div>`;
const medal = (rank) => `<span class="md md${rank}">${rank}</span>`;

const HEAD = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800;900&family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=block" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1080px;overflow:hidden;font-family:'Inter Tight',sans-serif}
.s{position:relative;width:1080px;height:1080px;overflow:hidden;padding:64px 64px 52px;display:flex;flex-direction:column}
.bz{position:relative;border-radius:50%;flex:none;box-shadow:0 14px 30px rgba(0,0,0,.28),inset 0 0 0 1px rgba(255,255,255,.55)}
.bz .in{position:relative;width:100%;height:100%;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2px rgba(0,0,0,.35)}
.bz .in img{width:100%;height:100%;object-fit:cover;display:block}
.bz .in::after{content:'';position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 4px 10px rgba(0,0,0,.45);background:radial-gradient(70% 45% at 35% 18%,rgba(255,255,255,.38),transparent 60%)}
.md{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;font-family:Unbounded;font-weight:900;font-size:16px;color:#3a2a00;box-shadow:0 3px 8px rgba(0,0,0,.25),inset 0 0 0 2px rgba(255,255,255,.5)}
.md1{background:${METAL.gold}}.md2{background:${METAL.silver};color:#2b3036}.md3{background:${METAL.bronze};color:#3a1c08}
.head{position:relative}
.head img{height:44px}
.head h1{font-family:Unbounded;font-weight:900;font-size:62px;letter-spacing:-2px;line-height:1;margin-top:34px}
.head h1 .t5{display:inline-block;background:#B8F26A;color:#0B0E11;border-radius:16px;padding:6px 18px 8px;margin-left:12px;font-size:54px;transform:rotate(-3deg)}
.pill{display:inline-flex;align-items:center;gap:10px;margin-top:22px;font-family:'JetBrains Mono';font-weight:700;font-size:19px;letter-spacing:.5px;border-radius:999px;padding:11px 20px}
.pill .dot{width:9px;height:9px;border-radius:50%;background:#14A04B;box-shadow:0 0 0 4px #14A04B33}
</style>`;

// ---------- white / black: top-3 cards + rows ----------
const POD = (dark) => {
  const T = dark
    ? {bg: '#07090B', ink: '#F2F4EF', mute: '#8A919C', card: 'linear-gradient(180deg,#15181B,#0D0F11)', line: '#23282C', row: '#101315', up: '#B8F26A', pill: '#15181B', logo: '/hotcoin-tradfi/public/brand/logo-official-white.png', mark: '#ffffff', mop: 0.04, shadow: 0.45, glow: 0.3}
    : {bg: '#FFFFFF', ink: '#0B0E11', mute: '#6B7280', card: '#FFFFFF', line: '#ECEDEA', row: '#F6F7F4', up: '#14A04B', pill: '#F3F4F0', logo: '/hotcoin-tradfi/public/brand/logo-official-black.png', mark: '#0B0E11', mop: 0.045, shadow: 0.08, glow: 0.22};
  const top = [D.gainers[1], D.gainers[0], D.gainers[2]];
  return `${HEAD}<style>
body{background:${T.bg};color:${T.ink}}
.pill{background:${T.pill};color:${T.ink}}
.pod{position:relative;flex:1;min-height:0;display:grid;grid-template-columns:1fr 1.14fr 1fr;gap:18px;align-items:stretch;margin-top:30px}
.p{position:relative;border-radius:30px;background:${T.card};border:1.5px solid ${T.line};box-shadow:0 20px 44px rgba(0,0,0,${T.shadow});display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px 12px 24px;overflow:hidden}
.p:not(.one){margin-top:46px}
.p .gl{position:absolute;inset:0;opacity:${T.glow}}
.p .md{position:absolute;top:18px;left:18px}
.p .sym{position:relative;font-family:Unbounded;font-weight:900;font-size:36px;margin-top:24px;letter-spacing:-.5px}
.p .nm{position:relative;font-size:15px;color:${T.mute};font-weight:600;margin-top:4px;text-align:center}
.p .ch{position:relative;font-family:Unbounded;font-weight:900;font-size:44px;letter-spacing:-1.5px;margin-top:12px;color:${T.up}}
.p.one .sym{font-size:48px}.p.one .ch{font-size:50px}
.rows{position:relative;display:flex;flex-direction:column;gap:12px;margin-top:18px}
.r{display:flex;align-items:center;gap:20px;border-radius:24px;background:${T.row};border:1.5px solid ${T.line};padding:10px 30px 10px 22px}
.r .n{font-family:Unbounded;font-weight:900;font-size:26px;color:${T.mute};width:28px;text-align:center}
.r .sym{font-family:Unbounded;font-weight:900;font-size:32px}
.r .nm{font-size:15px;color:${T.mute};font-weight:600}
.r .ch{margin-left:auto;font-family:Unbounded;font-weight:900;font-size:40px;color:${T.up}}
.ft{position:relative;display:flex;justify-content:space-between;margin-top:22px;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:${T.mute}}
</style></head><body><div class="s">
${mark(980, 420, -170, T.mark, '#7EC25A', T.mop)}
<div class="head"><img src="${T.logo}"><h1>Daily Top Gainers<span class="t5">TOP 5</span></h1><div class="pill"><span class="dot"></span>${D.window}</div></div>
<div class="pod">${top.map((g) => {
    const r = D.gainers.indexOf(g) + 1, one = r === 1;
    return `<div class="p${one ? ' one' : ''}"><div class="gl" style="background:radial-gradient(90% 60% at 50% 0%,${g.glow},transparent 75%)"></div>${medal(r)}
  ${bezel(g, one ? 212 : 158, metalFor(r))}<div class="sym" style="${g.sym.length > 7 ? 'font-size:26px' : ''}">${g.sym}</div><div class="nm">${g.name}</div><div class="ch">${pct(g.ch)}</div></div>`;
  }).join('')}</div>
<div class="rows">${D.gainers.slice(3).map((g, i) => `<div class="r"><div class="n">${i + 4}</div>${bezel(g, 68, 'steel')}<div><div class="sym">${g.sym}</div><div class="nm">${g.name}</div></div><div class="ch">${pct(g.ch)}</div></div>`).join('')}</div>
<div class="ft"><span>24H CHANGE · SPOT</span><span>HOTCOIN.COM</span></div>
</div></body></html>`;
};

// ---------- giant mark, five-coin podium row ----------
const MARK = () => {
  const order = [3, 1, 0, 2, 4];
  return `${HEAD}<style>
body{background:#F3F4F0;color:#0B0E11}
.pill{background:#fff;color:#0B0E11;box-shadow:0 6px 16px rgba(11,14,17,.06)}
.row{position:relative;flex:1;display:grid;grid-template-columns:1fr 1fr 1.3fr 1fr 1fr;gap:12px;align-items:end;margin-top:30px}
.c{position:relative;display:flex;flex-direction:column;align-items:center}
.c .bz{margin-bottom:-36px;z-index:2}
.c .col{width:100%;border-radius:24px 24px 10px 10px;background:#ffffffe0;box-shadow:0 18px 40px rgba(11,14,17,.09);border:1.5px solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:54px 6px 20px;position:relative;overflow:hidden}
.c .col::before{content:'';position:absolute;left:0;right:0;top:0;height:6px;background:var(--g)}
.c .md{margin-bottom:10px}
.c .sym{font-family:Unbounded;font-weight:900;font-size:24px;letter-spacing:-.5px}
.c .nm{font-size:12px;color:#6B7280;font-weight:600;margin-top:3px;text-align:center;padding:0 4px}
.c .ch{font-family:Unbounded;font-weight:900;font-size:27px;color:#14A04B;letter-spacing:-1px;margin-top:10px}
.c.one .sym{font-size:38px}.c.one .ch{font-size:40px}
.c .n{font-family:Unbounded;font-weight:900;font-size:18px;color:#B4BAC2;margin-bottom:10px}
.ft{position:relative;display:flex;justify-content:space-between;margin-top:24px;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:#6B7280}
</style></head><body><div class="s">
${mark(1300, 260, -40, '#0B0E11', '#7EC25A', 0.055)}
${mark(1300, 260, -40, 'transparent', '#7EC25A', 0.4)}
<div class="head"><img src="/hotcoin-tradfi/public/brand/logo-official-black.png"><h1>Daily Top Gainers<span class="t5">TOP 5</span></h1><div class="pill"><span class="dot"></span>${D.window}</div></div>
<div class="row">${order.map((gi) => {
    const g = D.gainers[gi], r = gi + 1, one = r === 1;
    const h = 230 + g.ch / D.gainers[0].ch * 170;
    return `<div class="c${one ? ' one' : ''}">${bezel(g, one ? 200 : 142, metalFor(r))}
  <div class="col" style="height:${h}px;--g:${g.glow}">${r <= 3 ? medal(r) : `<div class="n">#${r}</div>`}<div class="sym">${g.sym}</div><div class="nm">${g.name}</div><div class="ch">${pct(g.ch)}</div></div></div>`;
  }).join('')}</div>
<div class="ft"><span>24H CHANGE · SPOT</span><span>HOTCOIN.COM</span></div>
</div></body></html>`;
};

// ---------- collectible-card fan ----------
const CARDS = () => {
  const fan = [
    {gi: 4, rot: -8, x: 0, y: 110, z: 1, s: 0.9},
    {gi: 2, rot: -4, x: 180, y: 66, z: 2, s: 0.96},
    {gi: 0, rot: 0, x: 366, y: 30, z: 5, s: 1.06},
    {gi: 1, rot: 4, x: 552, y: 66, z: 3, s: 0.96},
    {gi: 3, rot: 8, x: 732, y: 110, z: 1, s: 0.9},
  ];
  const card = (f) => {
    const g = D.gainers[f.gi], r = f.gi + 1;
    return `<div class="cd" style="left:${f.x}px;top:${f.y}px;z-index:${f.z};transform:rotate(${f.rot}deg) scale(${f.s})">
  <div class="hd" style="background:linear-gradient(160deg,${g.glow},${g.glow}66)"><span class="rk">#${r}</span></div><div class="holo"></div>
  <div class="cn">${bezel(g, 150, metalFor(r))}</div>
  <div class="sym">${g.sym}</div><div class="nm">${g.name}</div>
  <div class="st"><span>24H</span><b>${pct(g.ch)}</b></div>
  <div class="ftc">${D.date} · No. ${String(r).padStart(2, '0')}/05</div></div>`;
  };
  return `${HEAD}<style>
body{background:#F4F1EA;color:#0B0E11}
.pill{background:#fff;color:#0B0E11;box-shadow:0 6px 16px rgba(11,14,17,.06)}
.glowbg{position:absolute;inset:0;background:radial-gradient(55% 45% at 50% 66%,#ffffff,transparent 70%),radial-gradient(35% 30% at 92% 6%,#B8F26A55,transparent 70%)}
.fan{position:relative;flex:1;margin-top:20px;margin-left:-4px}
.cd{position:absolute;width:216px;height:460px;border-radius:24px;background:#fff;box-shadow:0 30px 60px rgba(11,14,17,.18),0 0 0 1.5px #0B0E1114;overflow:hidden;transform-origin:50% 120%;display:flex;flex-direction:column;align-items:center}
.cd .hd{width:100%;height:118px;padding:14px 16px}
.cd .rk{font-family:Unbounded;font-weight:900;font-size:26px;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.25)}
.cd .holo{position:absolute;inset:0;background:conic-gradient(from 120deg at 30% 30%,#ff7ad966,#7af4ff66,#b8f26a66,#ffe17a66,#ff7ad966);mix-blend-mode:soft-light;opacity:.55;pointer-events:none}
.cd .cn{margin-top:-72px;position:relative}
.cd .sym{font-family:Unbounded;font-weight:900;font-size:32px;margin-top:16px;letter-spacing:-.5px}
.cd .nm{font-size:14px;color:#6B7280;font-weight:600;text-align:center;padding:0 12px}
.cd .st{margin-top:auto;text-align:center}
.cd .st span{display:block;font-family:'JetBrains Mono';font-weight:800;font-size:12px;letter-spacing:2px;color:#9AA0A8}
.cd .st b{font-family:Unbounded;font-weight:900;font-size:30px;color:#14A04B;letter-spacing:-1px}
.cd .ftc{width:100%;margin-top:14px;padding:11px 10px;border-top:1.5px dashed #0B0E1122;font-family:'JetBrains Mono';font-weight:700;font-size:12px;letter-spacing:2px;color:#9AA0A8;text-align:center}
.ft{position:relative;display:flex;justify-content:space-between;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:#6B7280}
</style></head><body><div class="s"><div class="glowbg"></div>
${mark(700, 560, 520, '#0B0E11', '#7EC25A', 0.05)}
<div class="head"><img src="/hotcoin-tradfi/public/brand/logo-official-black.png"><h1>Daily Top Gainers<span class="t5">TOP 5</span></h1><div class="pill"><span class="dot"></span>${D.window}</div></div>
<div class="fan">${fan.map(card).join('')}</div>
<div class="ft"><span>24H CHANGE · SPOT</span><span>HOTCOIN.COM</span></div>
</div></body></html>`;
};


// ---------- #1 spotlight ----------
const TOP1 = () => {
  const g = D.gainers[0];
  return `${HEAD}<style>
body{background:#fff;color:#0B0E11}
.pill{background:#F3F4F0;color:#0B0E11}
.glow{position:absolute;left:50%;top:560px;width:900px;height:900px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,${g.glow}55,${g.glow}00 65%)}
.rays{position:absolute;left:50%;top:560px;width:1500px;height:1500px;transform:translate(-50%,-50%);background:repeating-conic-gradient(${g.glow}22 0 6deg,transparent 6deg 18deg);-webkit-mask:radial-gradient(circle,#000 10%,transparent 60%);mask:radial-gradient(circle,#000 10%,transparent 60%)}
.hero{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-top:10px}
.rk{display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono';font-weight:800;font-size:20px;letter-spacing:4px;margin-bottom:26px}
.rk .md{width:46px;height:46px;font-size:22px}
.sym{font-family:Unbounded;font-weight:900;font-size:96px;letter-spacing:-3px;line-height:1;margin-top:30px}
.nm{font-size:24px;font-weight:600;color:#6B7280;margin-top:8px}
.ch{font-family:Unbounded;font-weight:900;font-size:150px;letter-spacing:-7px;color:#14A04B;line-height:1;margin-top:18px}
.ch small{font-size:30px;letter-spacing:2px;font-family:'JetBrains Mono';font-weight:800;color:#6B7280;margin-left:12px;vertical-align:middle}
.ft{position:relative;display:flex;justify-content:space-between;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:#6B7280}
.head h1{font-size:54px}
</style></head><body><div class="s"><div class="rays"></div><div class="glow"></div>
${mark(980, 420, -170, '#0B0E11', '#7EC25A', 0.045)}
<div class="head"><img src="/hotcoin-tradfi/public/brand/logo-official-black.png"><h1>Top Gainer of the Day<span class="t5">#1</span></h1><div class="pill"><span class="dot"></span>${D.window}</div></div>
<div class="hero"><div class="rk">${medal(1)}DAILY TOP GAINER</div>
 ${bezel(g, 330, 'gold')}
 <div class="sym">$${g.sym}</div><div class="nm">${g.name}</div>
 <div class="ch">${pct(g.ch)}<small>24H</small></div></div>
<div class="ft"><span>24H CHANGE · SPOT</span><span>HOTCOIN.COM</span></div>
</div></body></html>`;
};

const PAGES = {'sq-white': () => POD(false), 'sq-black': () => POD(true), 'sq-mark': MARK, 'sq-cards': CARDS, 'sq-top1': TOP1};
const want = process.argv.slice(2);
fs.mkdirSync(DIR + '/build', {recursive: true});
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', ROOT], {stdio: 'ignore'});
await new Promise((r) => setTimeout(r, 800));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport: {width: 1080, height: 1080}, deviceScaleFactor: 2000 / 1080});
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  for (const [name, html] of Object.entries(PAGES)) {
    if (want.length && !want.includes(name)) continue;
    fs.writeFileSync(`${DIR}/build/${name}.html`, html());
    await page.goto(`http://localhost:${PORT}/social/daily/build/${name}.html`, {waitUntil: 'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({path: `${OUT}/${name}.png`});
    console.log(name);
  }
} finally {
  await browser.close();
  server.kill();
}
