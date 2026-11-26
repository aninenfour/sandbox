// Daily Top Gainers TOP5, square (2000x2000), redesign of the glass-podium post.
//   sq-white   white, top-3 cards with gold/silver/bronze bezel coins, 4-5 rows
//   sq-black   same layout, dark
//   sq-mark    light grey, giant Hotcoin mark, five coins in a podium row
//   sq-cards   collectible-card fan
//   sq-orbit   ink, coins climbing a lime trajectory, few numbers (daily rotation)
//   sq-race    off-white race track, coins speeding to a checkered finish, few numbers (daily rotation)
// What to Watch (watch.py rotates these five, never one of the last two posted days):
//   sq-watch (list, white rows) · sq-watch-ink (black hairline watchlist) · sq-watch-bento (hero + 2x2 cards)
//   sq-watch-board (lime page, split-flap departure board) · sq-watch-paper (editorial front page)
//   node social/daily/square.mjs [names...]
import {createRequire} from 'module';
import {spawn} from 'child_process';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const require = createRequire(import.meta.url);
let chromium;
for (const p of [process.env.PW_PATH, 'playwright', '/opt/node-tools/node_modules/playwright'].filter(Boolean)) { try { ({chromium} = require(p)); break; } catch {} }
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
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
  ? `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0B0E11;color:#B8F26A;font-family:Unbounded;font-weight:900;font-size:${size * (g.sym.length > 3 ? 0.17 : 0.25)}px;letter-spacing:-1px">${g.sym}</div>`
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

// ---------- morning: what to watch today (5 rows, crypto + tradfi) ----------
const WATCH = () => {
  const it = D.items || [];
  const price = (v) => v >= 1 ? '$' + v.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '$' + Number(v.toPrecision(4));
  const chg = (v) => `<span style="color:${v >= 0 ? '#14A04B' : '#D64545'}">${v >= 0 ? '▲' : '▼'}${Math.abs(v).toFixed(2)}%</span>`;
  return `${HEAD}<style>
body{background:#fff;color:#0B0E11}
.pill{background:#F3F4F0;color:#0B0E11}
.head h1 .t5{font-size:50px}
.list{position:relative;flex:1;display:flex;flex-direction:column;gap:14px;margin-top:30px}
.r{flex:1;display:flex;align-items:center;gap:22px;border-radius:26px;background:#F6F7F4;border:1.5px solid #ECEDEA;padding:0 30px 0 22px;position:relative;overflow:hidden}
.r::before{content:'';position:absolute;left:0;top:0;bottom:0;width:7px;background:var(--g)}
.r .mid{flex:1;min-width:0}
.r .top{display:flex;align-items:baseline;gap:12px}
.r .sym{font-family:Unbounded;font-weight:900;font-size:32px;letter-spacing:-.5px}
.r .nm{font-size:16px;color:#6B7280;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.r .k{font-family:'JetBrains Mono';font-weight:800;font-size:12px;letter-spacing:2px;border-radius:999px;padding:5px 10px;margin-left:auto;flex:none}
.r .k.crypto{background:#B8F26A;color:#0B0E11}.r .k.tradfi{background:#0B0E11;color:#fff}
.r .why{font-size:21px;font-weight:600;margin-top:6px;line-height:1.25;color:#1F2328;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.r .px{text-align:right;flex:none;width:200px}
.r .px b{display:block;font-family:Unbounded;font-weight:800;font-size:26px;letter-spacing:-.5px}
.r .px span{font-family:Unbounded;font-weight:900;font-size:22px}
.ft{position:relative;display:flex;justify-content:space-between;margin-top:22px;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:#6B7280}
</style></head><body><div class="s">
${mark(980, 420, -170, '#0B0E11', '#7EC25A', 0.045)}
<div class="head"><img src="/hotcoin-tradfi/public/brand/logo-official-black.png"><h1>What to Watch<span class="t5">TODAY</span></h1><div class="pill"><span class="dot"></span>${D.window}</div></div>
<div class="list">${it.map((g) => `<div class="r" style="--g:${g.glow}">${bezel(g, 96, 'steel')}
  <div class="mid"><div class="top"><span class="sym" style="${g.sym.length > 6 ? 'font-size:26px' : ''}">${g.sym}</span><span class="nm">${g.name}</span><span class="k ${g.kind}">${g.kind === 'crypto' ? 'CRYPTO' : 'TRADFI'}</span></div>
  <div class="why">${g.why}</div></div>
  <div class="px"><b>${price(g.last)}</b>${chg(g.ch)}</div></div>`).join('')}</div>
<div class="ft"><span>${D.date} · CRYPTO + TRADFI · 24H</span><span>HOTCOIN.COM</span></div>
</div></body></html>`;
};

// ---------- What to Watch: four more styles that rotate with sq-watch (watch.py picks one per day) ----------
const SERIF = '<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=block" rel="stylesheet">';
const wprice = (v) => v >= 1 ? '$' + v.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '$' + Number(v.toPrecision(4));
const wchg = (v, up, dn) => `<span style="color:${v >= 0 ? up : dn}">${v >= 0 ? '▲' : '▼'}${Math.abs(v).toFixed(2)}%</span>`;
const kindLabel = (g) => g.kind === 'crypto' ? 'CRYPTO' : 'TRADFI';
const symSize = (g, base) => g.sym.length > 6 ? base * 0.72 : g.sym.length > 5 ? base * 0.85 : base;

// ink: black, dot field, numbered hairline watchlist, serif italic "today"
const W_INK = () => {
  const it = D.items || [];
  return `${HEAD}${SERIF}<style>
body{background:#07090A;color:#F2F4EF}
.bgl{position:absolute;inset:0;background:radial-gradient(50% 40% at 92% 6%,#B8F26A2a,transparent 70%),radial-gradient(40% 35% at 0% 100%,#7EC25A1e,transparent 70%)}
.dots{position:absolute;inset:0;background-image:radial-gradient(#ffffff1a 1.4px,transparent 1.6px);background-size:22px 22px;-webkit-mask:linear-gradient(200deg,#000 0%,transparent 45%);mask:linear-gradient(200deg,#000 0%,transparent 45%)}
.head h1{font-size:60px;margin-top:32px}
.head h1 em{font-family:'Instrument Serif';font-style:italic;font-weight:400;font-size:82px;letter-spacing:-1px;color:#B8F26A;margin-left:14px}
.pill{background:#15181B;color:#C9CDD2;margin-top:18px}
.list{position:relative;flex:1;display:flex;flex-direction:column;margin-top:24px;border-top:1.5px solid #ffffff22}
.r{flex:1;display:flex;align-items:center;gap:20px;border-bottom:1.5px solid #ffffff22;padding:0 2px}
.r .n{font-family:'JetBrains Mono';font-weight:800;font-size:18px;color:#5E656D;width:30px;flex:none}
.r .bz{box-shadow:0 0 0 1px #ffffff22,0 0 34px var(--g),0 12px 24px rgba(0,0,0,.5)}
.r .mid{flex:1;min-width:0}
.r .top{display:flex;align-items:center;gap:12px}
.r .sym{font-family:Unbounded;font-weight:900;font-size:30px;letter-spacing:-.5px}
.r .nm{font-size:15px;color:#8A919C;font-weight:600;white-space:nowrap}
.r .k{font-family:'JetBrains Mono';font-weight:800;font-size:11px;letter-spacing:2px;color:#B8F26A;border:1.5px solid #B8F26A66;border-radius:999px;padding:3px 9px;flex:none}
.r .k.tradfi{color:#C9CDD2;border-color:#ffffff40}
.r .why{font-size:20px;font-weight:500;color:#C9CDD2;margin-top:7px;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.r .px{text-align:right;flex:none;width:190px}
.r .px b{display:block;font-family:Unbounded;font-weight:800;font-size:25px;letter-spacing:-.5px}
.r .px span{font-family:'JetBrains Mono';font-weight:800;font-size:20px}
.ft{position:relative;display:flex;justify-content:space-between;margin-top:20px;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:#8A919C}
</style></head><body><div class="s"><div class="bgl"></div><div class="dots"></div>
${mark(760, 560, 420, '#ffffff', '#7EC25A', 0.035)}
<div class="head"><img src="/hotcoin-tradfi/public/brand/logo-official-white.png"><h1>What to Watch<em>today</em></h1><div class="pill"><span class="dot"></span>${D.window}</div></div>
<div class="list">${it.map((g, i) => `<div class="r" style="--g:${g.glow}66"><span class="n">0${i + 1}</span>${bezel(g, 80, 'steel')}
  <div class="mid"><div class="top"><span class="sym" style="font-size:${symSize(g, 30)}px">${g.sym}</span><span class="nm">${g.name}</span><span class="k ${g.kind}">${kindLabel(g)}</span></div>
  <div class="why">${g.why}</div></div>
  <div class="px"><b>${wprice(g.last)}</b>${wchg(g.ch, '#2DBD85', '#F6465D')}</div></div>`).join('')}</div>
<div class="ft"><span>${D.date} · CRYPTO + TRADFI · 24H</span><span>HOTCOIN.COM</span></div>
</div></body></html>`;
};

// bento: warm off-white, pick #1 as a dark hero card, the other four in a 2x2 grid
const W_BENTO = () => {
  const [h, ...rest] = D.items || [];
  return `${HEAD}<style>
body{background:#F4F1EA;color:#0B0E11}
.pill{background:#fff;color:#0B0E11;box-shadow:0 6px 16px rgba(11,14,17,.06)}
.head h1 .t5{font-size:50px}
.grid{position:relative;flex:1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1.2fr 1fr 1fr;gap:16px;margin-top:28px}
.c{position:relative;background:#fff;border-radius:28px;box-shadow:0 14px 34px rgba(11,14,17,.07);border:1.5px solid #0B0E110f;padding:20px 22px;display:flex;flex-direction:column;justify-content:center;overflow:hidden}
.c .gl{position:absolute;inset:0;opacity:.16;background:radial-gradient(70% 90% at 0% 0%,var(--g),transparent 70%)}
.c .top{position:relative;display:flex;align-items:center;gap:16px}
.c .id{flex:1;min-width:0}
.c .sym{font-family:Unbounded;font-weight:900;font-size:26px;letter-spacing:-.5px;line-height:1.1}
.c .sub{display:flex;align-items:center;gap:8px;margin-top:5px}
.c .nm{font-size:14px;color:#6B7280;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.k{font-family:'JetBrains Mono';font-weight:800;font-size:11px;letter-spacing:2px;border-radius:999px;padding:4px 9px;flex:none}
.k.crypto{background:#B8F26A;color:#0B0E11}.k.tradfi{background:#0B0E11;color:#fff}
.c .px{text-align:right;flex:none}
.c .px b{display:block;font-family:Unbounded;font-weight:800;font-size:21px;letter-spacing:-.5px}
.c .px span{font-family:Unbounded;font-weight:900;font-size:17px}
.c .why{position:relative;font-size:19px;font-weight:600;color:#1F2328;line-height:1.28;margin-top:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.c.hero{grid-column:1/3;background:#0B0E11;color:#F2F4EF;border:none;padding:24px 34px;box-shadow:0 24px 50px rgba(11,14,17,.22)}
.c.hero .gl{opacity:.32;background:radial-gradient(60% 120% at 0% 50%,var(--g),transparent 70%)}
.c.hero .top{gap:26px}
.c.hero .kick{font-family:'JetBrains Mono';font-weight:800;font-size:13px;letter-spacing:3px;color:#B8F26A}
.c.hero .sym{font-size:44px;margin-top:6px}
.c.hero .nm{color:#8A919C;font-size:16px}
.c.hero .why{color:#E4E7E2;font-size:23px;margin-top:8px}
.c.hero .px b{font-size:32px}.c.hero .px span{font-size:22px}
.ft{position:relative;display:flex;justify-content:space-between;margin-top:22px;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:#6B7280}
</style></head><body><div class="s">
${mark(760, 600, -150, '#0B0E11', '#7EC25A', 0.045)}
<div class="head"><img src="/hotcoin-tradfi/public/brand/logo-official-black.png"><h1>What to Watch<span class="t5">TODAY</span></h1><div class="pill"><span class="dot"></span>${D.window}</div></div>
<div class="grid">
 <div class="c hero" style="--g:${h.glow}"><div class="gl"></div><div class="top">${bezel(h, 132, 'gold')}
  <div class="id"><div class="kick">01 · ${kindLabel(h)}</div><div class="sym" style="font-size:${symSize(h, 44)}px">${h.sym} <span class="nm">${h.name}</span></div><div class="why">${h.why}</div></div>
  <div class="px"><b>${wprice(h.last)}</b>${wchg(h.ch, '#2DBD85', '#F6465D')}</div></div></div>
 ${rest.map((g) => `<div class="c" style="--g:${g.glow}"><div class="gl"></div><div class="top">${bezel(g, 62, 'steel')}
  <div class="id"><div class="sym" style="font-size:${symSize(g, 26)}px">${g.sym}</div><div class="sub"><span class="k ${g.kind}">${kindLabel(g)}</span><span class="nm">${g.name}</span></div></div>
  <div class="px"><b>${wprice(g.last)}</b>${wchg(g.ch, '#14A04B', '#D64545')}</div></div>
  <div class="why">${g.why}</div></div>`).join('')}
</div>
<div class="ft"><span>${D.date} · CRYPTO + TRADFI · 24H</span><span>HOTCOIN.COM</span></div>
</div></body></html>`;
};

// board: lime page, ink departure board with split-flap ticker tiles
const W_BOARD = () => {
  const it = D.items || [];
  const tiles = (s) => [...s].map((ch) => `<i>${ch}</i>`).join('');
  return `${HEAD}<style>
body{background:#B8F26A;color:#0B0E11}
.head h1 .t5{background:#0B0E11;color:#B8F26A;font-size:50px}
.pill{background:#0B0E11;color:#B8F26A}
.pill .dot{background:#B8F26A;box-shadow:0 0 0 4px #B8F26A44}
.bd{position:relative;flex:1;margin-top:28px;border-radius:30px;background:#0B0E11;padding:12px 28px 8px;display:flex;flex-direction:column;box-shadow:0 30px 60px rgba(11,14,17,.28)}
.bd .tex{position:absolute;inset:0;border-radius:30px;background-image:radial-gradient(#ffffff0d 1.3px,transparent 1.5px);background-size:18px 18px}
.hr{position:relative;display:grid;grid-template-columns:262px 1fr 168px;gap:20px;padding:14px 0 12px;border-bottom:1.5px solid #ffffff1c;font-family:'JetBrains Mono';font-weight:800;font-size:12px;letter-spacing:3px;color:#5E656D}
.hr span:last-child{text-align:right}
.r{position:relative;flex:1;display:grid;grid-template-columns:262px 1fr 168px;gap:20px;align-items:center;border-bottom:1.5px dashed #ffffff18}
.r:last-child{border-bottom:none}
.a{display:flex;align-items:center;gap:14px}
.a .bz{box-shadow:0 0 0 1px #ffffff22,0 8px 18px rgba(0,0,0,.5)}
.tl{display:flex;gap:3px}
.tl i{position:relative;font-style:normal;width:var(--w);height:44px;border-radius:6px;background:linear-gradient(180deg,#22272C 0 49%,#191D21 51% 100%);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono';font-weight:800;font-size:var(--f);color:#B8F26A;box-shadow:inset 0 0 0 1px #ffffff10}
.tl i::after{content:'';position:absolute;left:0;right:0;top:50%;height:1.5px;background:#0B0E11}
.a .nm{font-size:13px;color:#8A919C;font-weight:600;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}
.a .nm b{font-family:'JetBrains Mono';font-weight:800;font-size:10px;letter-spacing:2px;color:#5E656D;margin-right:6px}
.why{font-size:19px;font-weight:500;color:#D9DCD6;line-height:1.28;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.px{text-align:right;font-family:'JetBrains Mono';font-weight:800}
.px b{display:block;font-size:22px;color:#F2F4EF}
.px span{font-size:18px}
.ft{position:relative;display:flex;justify-content:space-between;margin-top:20px;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:#0B0E11aa}
</style></head><body><div class="s">
${mark(820, 520, -230, '#0B0E11', '#0B0E11', 0.06)}
<div class="head"><img src="/hotcoin-tradfi/public/brand/logo-official-black.png"><h1>What to Watch<span class="t5">TODAY</span></h1><div class="pill"><span class="dot"></span>${D.window}</div></div>
<div class="bd"><div class="tex"></div>
 <div class="hr"><span>ASSET</span><span>WHY TODAY</span><span>LAST · 24H</span></div>
 ${it.map((g) => {
    const n = g.sym.length, w = n > 5 ? Math.floor(150 / n) : 30, f = n > 5 ? 20 : 24;
    return `<div class="r"><div class="a">${bezel(g, 56, 'steel')}<div><div class="tl" style="--w:${w}px;--f:${f}px">${tiles(g.sym)}</div><div class="nm"><b>${kindLabel(g)}</b>${g.name}</div></div></div>
  <div class="why">${g.why}</div>
  <div class="px"><b>${wprice(g.last)}</b>${wchg(g.ch, '#2DBD85', '#F6465D')}</div></div>`;
  }).join('')}
</div>
<div class="ft"><span>${D.date} · CRYPTO + TRADFI · 24H</span><span>HOTCOIN.COM</span></div>
</div></body></html>`;
};

// paper: editorial front page, serif numerals, hairline rules
const W_PAPER = () => {
  const it = D.items || [];
  return `${HEAD}${SERIF}<style>
body{background:#FAF8F3;color:#0B0E11}
.mast{position:relative;display:flex;justify-content:space-between;align-items:center;padding-bottom:18px;border-bottom:4px double #0B0E11}
.mast img{height:40px}
.mast span{font-family:'JetBrains Mono';font-weight:800;font-size:15px;letter-spacing:3px}
.ttl{position:relative;display:flex;align-items:flex-end;justify-content:space-between;margin-top:26px}
.ttl h1{font-family:'Inter Tight';font-weight:800;font-size:76px;letter-spacing:-3px;line-height:.95}
.ttl h1 em{font-family:'Instrument Serif';font-style:italic;font-weight:400;letter-spacing:-1px;color:#4E8F2E;font-size:92px}
.ttl .tm{font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:1px;color:#6B7280;text-align:right;line-height:1.5;padding-bottom:10px}
.list{position:relative;flex:1;display:flex;flex-direction:column;margin-top:24px;border-top:1.5px solid #0B0E11}
.r{flex:1;display:flex;align-items:center;gap:22px;border-bottom:1px solid #0B0E1126}
.r:last-child{border-bottom:1.5px solid #0B0E11}
.r .n{font-family:'Instrument Serif';font-size:76px;line-height:1;width:44px;text-align:center;flex:none;color:#0B0E11}
.r .mid{flex:1;min-width:0}
.r .top{display:flex;align-items:baseline;gap:10px}
.r .sym{font-family:'Inter Tight';font-weight:800;font-size:30px;letter-spacing:-.5px}
.r .nm{font-family:'Instrument Serif';font-style:italic;font-size:23px;color:#4B5058}
.r .k{font-family:'JetBrains Mono';font-weight:800;font-size:11px;letter-spacing:2px;color:#6B7280;margin-left:auto;flex:none}
.r .why{font-size:20px;font-weight:500;margin-top:5px;line-height:1.28;color:#1F2328;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.r .px{text-align:right;flex:none;width:182px}
.r .px b{display:block;font-family:'Inter Tight';font-weight:800;font-size:27px;letter-spacing:-.5px}
.r .px span{font-family:'JetBrains Mono';font-weight:800;font-size:19px}
.ft{position:relative;display:flex;justify-content:space-between;margin-top:18px;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:#6B7280}
</style></head><body><div class="s">
<div class="mast"><img src="/hotcoin-tradfi/public/brand/logo-official-black.png"><span>${D.dow ? D.dow + ' · ' : ''}${D.date}</span></div>
<div class="ttl"><h1>What to Watch <em>today</em></h1><div class="tm">${D.window.replace(' (UTC+8)', '<br>UTC+8')}</div></div>
<div class="list">${it.map((g, i) => `<div class="r"><span class="n">${i + 1}</span>${bezel(g, 74, 'steel')}
  <div class="mid"><div class="top"><span class="sym" style="font-size:${symSize(g, 30)}px">${g.sym}</span><span class="nm">${g.name}</span><span class="k">${kindLabel(g)}</span></div>
  <div class="why">${g.why}</div></div>
  <div class="px"><b>${wprice(g.last)}</b>${wchg(g.ch, '#17A86B', '#E5484D')}</div></div>`).join('')}</div>
<div class="ft"><span>CRYPTO + TRADFI · 24H CHANGE</span><span>HOTCOIN.COM</span></div>
</div></body></html>`;
};

// ---------- orbit: visual, low on numbers. Ink, coins climbing a lime trajectory ----------
// #5 bottom left to #1 top right; coin size by rank; only a small % chip per coin.
const ORBIT = () => {
  const P = [
    {x: 890, y: 400, s: 250}, {x: 670, y: 540, s: 196}, {x: 470, y: 660, s: 164},
    {x: 290, y: 760, s: 136}, {x: 112, y: 840, s: 116},
  ];
  const curve = `M -20 900 C 200 850, 380 760, 540 630 S 840 360, 1100 200`;
  return `${HEAD}<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=block" rel="stylesheet"><style>
body{background:#07090A;color:#F2F4EF}
.bgl{position:absolute;inset:0;background:radial-gradient(45% 40% at 84% 44%,#B8F26A30,transparent 70%),radial-gradient(40% 35% at 10% 95%,#7EC25A22,transparent 70%)}
.dots{position:absolute;inset:0;background-image:radial-gradient(#ffffff1c 1.4px,transparent 1.6px);background-size:22px 22px;-webkit-mask:linear-gradient(160deg,transparent 30%,#000 75%);mask:linear-gradient(160deg,transparent 30%,#000 75%)}
.head h1{font-size:60px;margin-top:30px;line-height:1.05}
.head h1 em{display:block;font-family:'Instrument Serif';font-style:italic;font-weight:400;font-size:72px;letter-spacing:-1px;color:#B8F26A;margin-top:2px}
.pill{background:#15181B;color:#C9CDD2}
.co{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center}
.co .bz{box-shadow:0 0 0 1px #ffffff22,0 0 60px var(--g),0 20px 40px rgba(0,0,0,.6)}
.lb{position:absolute;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;white-space:nowrap}
.lb .t{display:flex;align-items:baseline;gap:8px}
.lb .sym{font-family:Unbounded;font-weight:900;letter-spacing:-.5px}
.lb .chip{font-family:'JetBrains Mono';font-weight:800;border-radius:999px;background:#B8F26A;color:#0B0E11;padding:5px 12px}
.lb .rk{font-family:'JetBrains Mono';font-weight:800;color:#8A919C}
.ft{position:absolute;left:64px;right:64px;bottom:52px;display:flex;justify-content:space-between;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:#8A919C}
</style></head><body><div class="s"><div class="bgl"></div><div class="dots"></div>
<svg width="1080" height="1080" style="position:absolute;inset:0"><path d="${curve}" fill="none" stroke="#B8F26A" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" opacity=".7"/></svg>
<div class="head"><img src="/hotcoin-tradfi/public/brand/logo-official-white.png"><h1>Top 5 Gainers<em>climbing today</em></h1><div class="pill"><span class="dot"></span>${D.window}</div></div>
${D.gainers.map((g, i) => {
    const p = P[i], one = i === 0, fs = one ? 40 : 26, cs = one ? 22 : 17;
    return `<div class="co" style="left:${p.x}px;top:${p.y}px;--g:${g.glow}88">${bezel(g, p.s, metalFor(i + 1))}
  <div class="lb" style="top:${p.s + 12}px"><div class="t"><span class="rk" style="font-size:${cs}px">#${i + 1}</span><span class="sym" style="font-size:${g.sym.length > 6 ? fs * 0.75 : fs}px">${g.sym}</span></div><span class="chip" style="font-size:${cs}px">${pct(g.ch)}</span></div></div>`;
  }).join('')}
<div class="ft"><span>${D.date} · 24H · SPOT</span><span>HOTCOIN.COM</span></div>
</div></body></html>`;
};

// ---------- race: five lanes, coins speeding to a checkered finish ----------
// Lane order = rank. #1 touches the finish line; the rest sit back in rank order (visual, not to scale).
const RACE = () => {
  const X0 = 470, X1 = 896, max = D.gainers[0].ch;
  const xs = D.gainers.map((g) => X0 + (X1 - X0) * Math.max(0, g.ch) / max);
  return `${HEAD}<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=block" rel="stylesheet"><style>
body{background:#F4F1EA;color:#0B0E11}
.head h1{font-size:60px;margin-top:30px;line-height:1.05}
.head h1 em{display:block;font-family:'Instrument Serif';font-style:italic;font-weight:400;font-size:72px;letter-spacing:-1px;color:#4E8F2E;margin-top:2px}
.pill{background:#fff;color:#0B0E11}
.track{position:absolute;left:64px;right:64px;top:400px;height:580px;border-radius:28px;background:#0B0E11;overflow:hidden;box-shadow:0 30px 60px rgba(11,14,17,.18)}
.track .tex{position:absolute;inset:0;background-image:radial-gradient(#ffffff10 1.3px,transparent 1.5px);background-size:18px 18px}
.fin{position:absolute;top:0;bottom:0;left:${X1 + 40 - 64}px;width:28px;background:conic-gradient(#fff 25%,#0B0E11 0 50%,#fff 0 75%,#0B0E11 0) 0 0/28px 28px;opacity:.9}
.ln{position:absolute;left:0;right:0;height:116px;display:flex;align-items:center}
.ln + .ln{border-top:2px dashed #ffffff1f}
.ln .n{position:absolute;left:26px;font-family:'JetBrains Mono';font-weight:800;font-size:18px;color:#8A919C}
.ln .sym{position:absolute;left:68px;font-family:Unbounded;font-weight:900;font-size:28px;color:#F2F4EF;letter-spacing:-.5px}
.ln .tr{position:absolute;height:16px;border-radius:999px;top:50px}
.ln .cn{position:absolute;top:16px}
.ln .chip{position:absolute;top:36px;font-family:'JetBrains Mono';font-weight:800;font-size:18px;border-radius:999px;background:#B8F26A;color:#0B0E11;padding:5px 11px;white-space:nowrap;margin-top:4px}
.ln.one .chip{background:#fff}
.ft{position:absolute;left:64px;right:64px;bottom:44px;display:flex;justify-content:space-between;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:#6B7280}
</style></head><body><div class="s">
${mark(640, 640, -120, '#0B0E11', '#7EC25A', 0.04)}
<div class="head"><img src="/hotcoin-tradfi/public/brand/logo-official-black.png"><h1>Top 5 Gainers<em>racing ahead today</em></h1><div class="pill"><span class="dot"></span>${D.window}</div></div>
<div class="track"><div class="tex"></div><div class="fin"></div>
${D.gainers.map((g, i) => {
    const cx = xs[i] - 64, start = 200;
    return `<div class="ln${i === 0 ? ' one' : ''}" style="top:${i * 116}px"><span class="n">0${i + 1}</span><span class="sym" style="${g.sym.length > 6 ? 'font-size:20px' : g.sym.length > 4 ? 'font-size:23px' : ''}">${g.sym}</span>
  <div class="tr" style="left:${start}px;width:${cx - start}px;background:linear-gradient(90deg,transparent,${g.glow}cc)"></div>
  <span class="chip" style="right:${1016 - 64 - cx + 52}px">${pct(g.ch)}</span>
  <div class="cn" style="left:${cx - 42}px">${bezel(g, 84, metalFor(i + 1))}</div></div>`;
  }).join('')}</div>
<div class="ft"><span>${D.date} · 24H CHANGE · SPOT</span><span>HOTCOIN.COM</span></div>
</div></body></html>`;
};

const PAGES = {'sq-orbit': ORBIT, 'sq-race': RACE, 'sq-watch': WATCH, 'sq-watch-ink': W_INK, 'sq-watch-bento': W_BENTO, 'sq-watch-board': W_BOARD, 'sq-watch-paper': W_PAPER, 'sq-white': () => POD(false), 'sq-black': () => POD(true), 'sq-mark': MARK, 'sq-cards': CARDS, 'sq-top1': TOP1};
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
