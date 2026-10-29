// Daily poster, round 4.
//   x1-bezel-white / x1-bezel-black  coins with metal bezels (gold #1, silver #2, bronze #3, steel 4-5),
//                                    right column with BTC, ETH and Fear & Greed, events as tickets
//   x2-cards                         new concept: gainers as holographic collectible cards, fanned out
// Renders 2000x1125 PNGs to social/daily/img.   node social/daily/bezel.mjs [names...]
import {createRequire} from 'module';
import {spawn} from 'child_process';
import fs from 'fs';
const require = createRequire('/opt/node-tools/node_modules/');
const {chromium} = require(process.env.PW_PATH || 'playwright');
const ROOT = '/home/user/sandbox';
const DIR = ROOT + '/social/daily';
const PORT = 8767;
const SPARK = JSON.parse(fs.readFileSync(DIR + '/spark.json', 'utf8'));

const D = {
  date: 'OCT 29',
  cap: '$2.65T', capCh: -0.60, fg: 51, fgLabel: 'Neutral',
  btc: '$79,970', btcCh: -1.24, eth: '$2,307', ethCh: -2.09,
  gainers: [
    {sym: 'Q', name: 'Quack AI', ch: 21.62, logo: 'q', bg: '#141414', glow: '#FFD400'},
    {sym: 'STONKBROKER', name: 'StonkBroker', ch: 20.70, logo: 'stonkbroker', bg: '#FF7A00', glow: '#FF7A00'},
    {sym: 'HUMA', name: 'Huma Finance', ch: 10.04, logo: 'huma', bg: '#000', glow: '#B44CFF'},
    {sym: 'LITEB', name: 'Lumentum · bStocks', ch: 7.63, logo: 'liteb', bg: '#fff', glow: '#9AA3B5'},
    {sym: 'ORCLB', name: 'Oracle · bStocks', ch: 6.34, logo: 'orclb', bg: '#E2231A', glow: '#E2231A'},
  ],
  events: [
    {tag: 'ALPHA TRADING REWARDS #6', big: '100,000 USDT', line: 'Trade, climb the leaderboard, share the pool', ends: 'NOV 6', left: 8, bg: '#B8F26A', icon: '🏆'},
    {tag: 'HALLOWEEN MYSTERY BOX', big: 'Every draw wins', line: 'MacBook Pro, iPhone 18 Pro Max & more', ends: 'NOV 5', left: 7, bg: '#FF7A1A', icon: '🎃'},
  ],
};
const pct = (v) => (v > 0 ? '+' : '') + v.toFixed(2) + '%';
const logo = (k) => `/social/daily/logos/${k}.png`;
const MARK_SLASH = 'M2.28588 5.14427L5.12855 2.3016C6.54988 3.24916 7.97122 5.14427 12.5906 5.49962C16.842 5.82668 19.3419 3.24917 21.1186 1.94628L24.3166 5.14429L5.12855 24.3323L1.93054 21.1343L13.3012 9.76362C7.97121 10.119 4.41787 7.2763 2.28588 5.14427Z';
const MARK_DOT = 'M23.6 19.7892C23.6 22.0094 21.8001 23.8093 19.5798 23.8093C17.3595 23.8093 15.5597 22.0094 15.5597 19.7892C15.5597 17.5689 17.3595 15.769 19.5798 15.769C21.8001 15.769 23.6 17.5689 23.6 19.7892Z';
const mark = (size, x, y, slash, dot, op) => `<svg viewBox="0 0 26 26" width="${size}" height="${size}" style="position:absolute;left:${x}px;top:${y}px;opacity:${op}"><path d="${MARK_SLASH}" fill="${slash}"/><path d="${MARK_DOT}" fill="${dot}"/></svg>`;

// metal bezels: conic sheen + reeded edge + inner shadow + gloss
const METAL = {
  gold: 'conic-gradient(from 200deg,#FFF6C9,#D9A936,#FFF0A6,#9C7314,#F7D774,#B8891F,#FFF6C9)',
  silver: 'conic-gradient(from 200deg,#FFFFFF,#B9BEC4,#F4F6F8,#7D848C,#E9ECEF,#A4ABB2,#FFFFFF)',
  bronze: 'conic-gradient(from 200deg,#FFE0C2,#B86B34,#FFC48F,#7A4220,#E39A5E,#9A5526,#FFE0C2)',
  steel: 'conic-gradient(from 200deg,#E6E9EC,#6E757D,#C9CED3,#4A5058,#B3B9BF,#5D646C,#E6E9EC)',
};
const metalFor = (rank) => ['gold', 'silver', 'bronze'][rank - 1] || 'steel';
const bezel = (g, size, metal) => {
  const b = Math.round(size * 0.075);
  return `<div class="bz" style="width:${size}px;height:${size}px;padding:${b}px;background:repeating-conic-gradient(rgba(0,0,0,.13) 0 1.2deg,transparent 1.2deg 2.4deg),${METAL[metal]}">
  <div class="in" style="background:${g.bg}"><img src="${logo(g.logo)}"></div></div>`;
};

const sparkSvg = (sym, w, h, color, id) => {
  const s = SPARK[sym]?.spark;
  if (!s) return '';
  const lo = Math.min(...s), hi = Math.max(...s);
  const pts = s.map((v, i) => [i / (s.length - 1) * w, h - 4 - (v - lo) / (hi - lo || 1) * (h - 8)]);
  const line = pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block">
  <defs><linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".25"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
  <polygon points="0,${h} ${line} ${w},${h}" fill="url(#g${id})"/><polyline points="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
};

// Fear & Greed semicircle gauge
const gauge = (v, w, track) => {
  const r = w / 2 - 14, cx = w / 2, cy = w / 2;
  const a = Math.PI * (1 - v / 100), nx = cx + Math.cos(a) * (r - 4), ny = cy - Math.sin(a) * (r - 4);
  return `<svg width="${w}" height="${w / 2 + 14}" viewBox="0 0 ${w} ${w / 2 + 14}">
  <defs><linearGradient id="fg" x1="0" x2="1"><stop offset="0" stop-color="#E03131"/><stop offset=".3" stop-color="#FF8A3D"/><stop offset=".55" stop-color="#F5C518"/><stop offset=".8" stop-color="#9BD45A"/><stop offset="1" stop-color="#14A04B"/></linearGradient></defs>
  <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${track}" stroke-width="20" stroke-linecap="round"/>
  <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="url(#fg)" stroke-width="20" stroke-linecap="round"/>
  <circle cx="${nx}" cy="${ny}" r="13" fill="#fff" stroke="#0B0E11" stroke-width="5"/></svg>`;
};

const HEAD = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800;900&family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=block" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}
body{width:1600px;height:900px;overflow:hidden;font-family:'Inter Tight',sans-serif}
i{font-style:normal}
.bz{position:relative;border-radius:50%;flex:none;box-shadow:0 12px 26px rgba(0,0,0,.28),inset 0 0 0 1px rgba(255,255,255,.55)}
.bz .in{position:relative;width:100%;height:100%;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2px rgba(0,0,0,.35)}
.bz .in img{width:100%;height:100%;object-fit:cover;display:block}
.bz .in::after{content:'';position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 4px 10px rgba(0,0,0,.45);background:radial-gradient(70% 45% at 35% 18%,rgba(255,255,255,.38),transparent 60%)}
.tk{position:relative;display:flex;border-radius:22px;color:#0B0E11}
.tk .body{flex:1;padding:18px 24px;display:flex;flex-direction:column;justify-content:center;min-width:0}
.tk .tg{font-family:'JetBrains Mono';font-weight:800;font-size:13px;letter-spacing:2px;opacity:.75}
.tk .bgt{font-family:Unbounded;font-weight:900;font-size:34px;letter-spacing:-1px;line-height:1;margin-top:8px}
.tk .ln{font-weight:600;font-size:15px;margin-top:6px;opacity:.8}
.tk .stub{flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;border-left:2.5px dashed #0B0E1155;position:relative;padding:0 20px}
.tk .stub b{font-family:Unbounded;font-weight:900;font-size:54px;line-height:.9}
.tk .stub span{font-family:'JetBrains Mono';font-weight:800;font-size:12px;letter-spacing:2px;margin-top:6px}
.tk .stub i{font-family:'JetBrains Mono';font-weight:600;font-size:11px;letter-spacing:1px;opacity:.7;margin-top:3px}
.tk .stub::before,.tk .stub::after{content:'';position:absolute;left:-15px;width:28px;height:28px;border-radius:50%;background:var(--hole)}
.tk .stub::before{top:-14px}.tk .stub::after{bottom:-14px}
.tk .ic{position:absolute;right:-8px;top:-22px;font-size:42px;transform:rotate(12deg);filter:drop-shadow(0 6px 10px rgba(0,0,0,.2))}
.lbl{display:inline-flex;align-items:center;gap:10px;font-family:'JetBrains Mono';font-weight:800;font-size:15px;letter-spacing:3px}
.lbl .dot{width:10px;height:10px;border-radius:50%;background:#FF3B30;box-shadow:0 0 0 4px #FF3B3022}
</style>`;
const ticket = (e, hole) => `<div class="tk" style="background:${e.bg};--hole:${hole}">
 <div class="body"><div class="tg">${e.tag}</div><div class="bgt">${e.big}</div><div class="ln">${e.line}</div></div>
 <div class="stub"><b>${e.left}</b><span>DAYS LEFT</span><i>ENDS ${e.ends}</i></div><div class="ic">${e.icon}</div></div>`;

// ---------- X1: bezel coins + market column, white or black ----------
const X1 = (dark) => {
  const T = dark
    ? {bg: '#07090B', card: 'linear-gradient(180deg,#15181B,#0D0F11)', line: '#23282C', ink: '#F2F4EF', mute: '#8A919C', col: '#0F1214', up: '#B8F26A', dn: '#FF5C6C', track: '#23282C', logo: '/hotcoin-tradfi/public/brand/logo-official-white.png', markS: '#ffffff', markOp: 0.035, row: '#101315'}
    : {bg: '#FFFFFF', card: '#FFFFFF', line: '#ECEDEA', ink: '#0B0E11', mute: '#6B7280', col: '#F5F6F2', up: '#14A04B', dn: '#E03131', track: '#E6E8E3', logo: '/hotcoin-tradfi/public/brand/logo-official-black.png', markS: '#0B0E11', markOp: 0.04, row: '#F6F7F4'};
  const top = [D.gainers[1], D.gainers[0], D.gainers[2]];
  const mkRow = (sym, k, price, ch, name) => `<div class="mr">${bezel({bg: '#fff', logo: k}, 64, 'steel')}<div><div class="ms">${sym}</div><div class="mn">${name}</div></div>
   <div class="mv"><div>${price}</div><i style="color:${ch >= 0 ? T.up : T.dn}">${pct(ch)}</i></div>
   <div class="msp">${sparkSvg(sym, 300, 44, ch >= 0 ? T.up : T.dn, sym + dark)}</div></div>`;
  return `${HEAD}<style>
body{background:${T.bg};color:${T.ink}}
.s{position:relative;width:1600px;height:900px;display:grid;grid-template-columns:1fr 380px}
.l{position:relative;padding:40px 40px 34px 52px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center}
.top img{height:36px}
.top .d{font-family:'JetBrains Mono';font-weight:700;font-size:17px;letter-spacing:3px;color:${T.mute}}.top .d b{color:${T.ink}}
.pod{flex:1;display:grid;grid-template-columns:1fr 1.14fr 1fr;gap:18px;align-items:stretch;margin-top:18px}
.p{position:relative;border-radius:28px;background:${T.card};border:1.5px solid ${T.line};box-shadow:0 18px 40px rgba(0,0,0,${dark ? 0.4 : 0.07});display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px 14px 20px;overflow:hidden}
.p:not(.one){margin-top:40px}
.p .gl{position:absolute;inset:0;opacity:${dark ? 0.28 : 0.2}}
.p .rk{position:absolute;top:16px;left:18px;font-family:Unbounded;font-weight:900;font-size:20px;color:${T.mute}}
.p.one .rk{color:#0B0E11;background:#B8F26A;border-radius:10px;padding:4px 10px}
.p .sym{position:relative;font-family:Unbounded;font-weight:900;font-size:32px;margin-top:22px;letter-spacing:-.5px}
.p .nm{position:relative;font-size:15px;color:${T.mute};font-weight:600;margin-top:2px}
.p .ch{position:relative;font-family:Unbounded;font-weight:900;font-size:46px;letter-spacing:-1.5px;margin-top:10px;color:${T.up}}
.p.one .sym{font-size:48px}.p.one .ch{font-size:64px}
.rows{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:16px}
.r{display:flex;align-items:center;gap:14px;border-radius:20px;background:${T.row};border:1.5px solid ${T.line};padding:12px 22px 12px 14px}
.r .n{font-family:Unbounded;font-weight:900;font-size:18px;color:${T.mute};width:22px;text-align:center}
.r .sym{font-family:Unbounded;font-weight:900;font-size:22px}
.r .nm{font-size:13px;color:${T.mute};font-weight:600}
.r .ch{margin-left:auto;font-family:Unbounded;font-weight:900;font-size:28px;color:${T.up}}
.evl{display:flex;justify-content:space-between;margin:20px 0 12px}
.evs{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.col{position:relative;background:${T.col};border-left:1.5px solid ${T.line};padding:40px 34px 34px;display:flex;flex-direction:column;overflow:hidden}
.col h4{font-family:'JetBrains Mono';font-weight:800;font-size:15px;letter-spacing:3px;color:${T.mute};margin-top:6px}
.mr{display:grid;grid-template-columns:auto 1fr auto;column-gap:14px;align-items:center;padding:20px 0;border-bottom:1.5px solid ${T.line}}
.ms{font-family:Unbounded;font-weight:900;font-size:24px}
.mn{font-size:13px;color:${T.mute};font-weight:600}
.mv{text-align:right;font-family:'JetBrains Mono';font-weight:800;font-size:21px}
.mv i{display:block;font-size:17px;margin-top:2px}
.msp{grid-column:1/4;margin-top:12px}
.fgw{margin-top:22px;display:flex;flex-direction:column;align-items:center}
.fgw .v{font-family:Unbounded;font-weight:900;font-size:54px;margin-top:-62px;line-height:1}
.fgw .t{font-family:'JetBrains Mono';font-weight:800;font-size:15px;letter-spacing:3px;color:${T.mute};margin-top:8px}
.cap{margin-top:auto;display:flex;justify-content:space-between;align-items:baseline;border-top:1.5px solid ${T.line};padding-top:16px;font-family:'JetBrains Mono';font-weight:800;font-size:19px}
.cap span{font-size:13px;letter-spacing:2px;color:${T.mute}}
</style></head><body><div class="s">
<div class="l">${mark(900, 260, -120, T.markS, '#7EC25A', T.markOp)}
 <div class="top" style="position:relative"><img src="${T.logo}"><div class="d">TOP GAINERS · 24H · <b>${D.date}</b></div></div>
 <div class="pod" style="position:relative">${top.map((g) => {
    const r = D.gainers.indexOf(g) + 1, one = r === 1;
    return `<div class="p${one ? ' one' : ''}"><div class="gl" style="background:radial-gradient(90% 60% at 50% 0%,${g.glow},transparent 75%)"></div><div class="rk">#${r}</div>
   ${bezel(g, one ? 210 : 158, metalFor(r))}<div class="sym" style="${g.sym.length > 8 ? 'font-size:24px' : ''}">${g.sym}</div><div class="nm">${g.name}</div><div class="ch">${pct(g.ch)}</div></div>`;
  }).join('')}</div>
 <div class="rows" style="position:relative">${D.gainers.slice(3).map((g, i) => `<div class="r"><div class="n">${i + 4}</div>${bezel(g, 56, 'steel')}<div><div class="sym">${g.sym}</div><div class="nm">${g.name}</div></div><div class="ch">${pct(g.ch)}</div></div>`).join('')}</div>
 <div class="evl" style="position:relative"><div class="lbl"><span class="dot"></span>LIVE EVENTS</div></div>
 <div class="evs" style="position:relative">${D.events.map((e) => ticket(e, T.bg)).join('')}</div>
</div>
<div class="col"><h4>MARKET · 24H</h4>
 ${mkRow('BTC', 'btc', D.btc, D.btcCh, 'Bitcoin')}
 ${mkRow('ETH', 'eth', D.eth, D.ethCh, 'Ethereum')}
 <div class="fgw"><h4 style="align-self:flex-start;margin-bottom:18px">FEAR &amp; GREED</h4>${gauge(D.fg, 280, T.track)}<div class="v">${D.fg}</div><div class="t">${D.fgLabel.toUpperCase()}</div></div>
 <div class="cap"><span>TOTAL MKT CAP</span><div>${D.cap} <i style="color:${D.capCh >= 0 ? T.up : T.dn}">${pct(D.capCh)}</i></div></div>
</div></div></body></html>`;
};

// ---------- X2: holographic collectible cards, fanned ----------
const X2 = () => {
  // fan order left→right: #5 #3 #1 #2 #4 ; #1 front and biggest
  const fan = [
    {gi: 4, rot: -9, x: 0, y: 92, z: 1, s: 0.9},
    {gi: 2, rot: -4.5, x: 198, y: 58, z: 2, s: 0.96},
    {gi: 0, rot: 0, x: 410, y: 30, z: 5, s: 1.0},
    {gi: 1, rot: 4.5, x: 622, y: 58, z: 3, s: 0.96},
    {gi: 3, rot: 9, x: 816, y: 92, z: 1, s: 0.9},
  ];
  const card = (f) => {
    const g = D.gainers[f.gi], rank = f.gi + 1;
    return `<div class="cd" style="left:${f.x}px;top:${f.y}px;z-index:${f.z};transform:rotate(${f.rot}deg) scale(${f.s})">
   <div class="hd" style="background:linear-gradient(160deg,${g.glow},${g.glow}66)"><span class="rk">#${rank}</span><span class="tp">TOP GAINER</span></div>
   <div class="holo"></div>
   <div class="cn">${bezel(g, 168, metalFor(rank))}</div>
   <div class="sym" style="${g.sym.length > 8 ? 'font-size:21px' : ''}">${g.sym}</div><div class="nm">${g.name}</div>
   <div class="st"><div><span>24H</span><b>${pct(g.ch)}</b></div><div class="sp">${sparkSvg(g.sym, 204, 36, '#14A04B', 'x' + rank)}</div></div>
   <div class="ft">${D.date} · No. ${String(rank).padStart(2, '0')}/05</div></div>`;
  };
  return `${HEAD}<style>
body{background:#F4F1EA;color:#0B0E11}
.s{position:relative;width:1600px;height:900px;overflow:hidden}
.bg{position:absolute;inset:0;background:radial-gradient(60% 70% at 36% 55%,#FFFFFF,transparent 70%),radial-gradient(40% 40% at 90% 10%,#B8F26A44,transparent 70%)}
.top{position:absolute;left:52px;top:40px;right:52px;display:flex;justify-content:space-between;align-items:center}
.top img{height:36px}
.top .d{font-family:'JetBrains Mono';font-weight:700;font-size:17px;letter-spacing:3px;color:#6B7280}.top .d b{color:#0B0E11}
.h1{position:absolute;left:52px;top:96px;font-family:Unbounded;font-weight:900;font-size:22px;letter-spacing:1px}
.h1 span{background:#0B0E11;color:#B8F26A;padding:6px 12px;border-radius:8px;margin-right:10px}
.fan{position:absolute;left:64px;top:160px;width:1110px;height:720px}
.cd{position:absolute;width:240px;height:470px;border-radius:24px;background:#fff;box-shadow:0 30px 60px rgba(11,14,17,.18),0 0 0 1.5px #0B0E1114;overflow:hidden;transform-origin:50% 120%;display:flex;flex-direction:column;align-items:center}
.cd .hd{width:100%;height:116px;display:flex;justify-content:space-between;align-items:flex-start;padding:14px 16px}
.cd .rk{font-family:Unbounded;font-weight:900;font-size:24px;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.25)}
.cd .tp{font-family:'JetBrains Mono';font-weight:800;font-size:11px;letter-spacing:2px;color:#0B0E11;background:#ffffffcc;border-radius:999px;padding:5px 9px}
.cd .holo{position:absolute;inset:0;background:conic-gradient(from 120deg at 30% 30%,#ff7ad966,#7af4ff66,#b8f26a66,#ffe17a66,#ff7ad966);mix-blend-mode:soft-light;opacity:.55;pointer-events:none}
.cd .cn{margin-top:-70px;position:relative}
.cd .sym{font-family:Unbounded;font-weight:900;font-size:34px;margin-top:14px;letter-spacing:-.5px}
.cd .nm{font-size:14px;color:#6B7280;font-weight:600}
.cd .st{width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:0 18px 0 26px;margin-top:auto}
.cd .st span{display:block;font-family:'JetBrains Mono';font-weight:800;font-size:11px;letter-spacing:2px;color:#9AA0A8}
.cd .st b{font-family:Unbounded;font-weight:900;font-size:30px;color:#14A04B;letter-spacing:-1px}
.cd .ft{width:100%;margin-top:12px;padding:10px 18px;border-top:1.5px dashed #0B0E1122;font-family:'JetBrains Mono';font-weight:700;font-size:11px;letter-spacing:2px;color:#9AA0A8}
.side{position:absolute;right:44px;top:110px;width:350px;bottom:36px;display:flex;flex-direction:column;gap:18px}
.side .tk{flex:none;flex-direction:column}
.side .tk .body{flex:none}
.side .tk .stub{flex-direction:row;gap:14px;border-left:none;border-top:2.5px dashed #0B0E1155;padding:12px 24px;justify-content:flex-start}
.side .tk .stub::before{top:-15px;left:-14px}.side .tk .stub::after{top:-15px;bottom:auto;left:auto;right:-14px}
.side .tk .stub b{font-size:44px}
.side .tk .stub div{display:flex;flex-direction:column}
.mk{margin-top:auto;background:#0B0E11;color:#F2F4EF;border-radius:22px;padding:18px 22px;display:grid;grid-template-columns:1fr 1fr;gap:12px 18px;font-family:'JetBrains Mono';font-weight:800;font-size:16px;white-space:nowrap}
.mk span{display:block;font-size:11px;letter-spacing:2px;color:#8A919C;font-weight:700;margin-bottom:3px}
.mk img{width:18px;height:18px;vertical-align:-3px;margin-right:6px}
.mk i{color:#FF5C6C;margin-left:5px;font-size:14px}
</style></head><body><div class="s"><div class="bgt"></div>
${mark(760, 840, 300, '#0B0E11', '#7EC25A', 0.05)}
<div class="top"><img src="/hotcoin-tradfi/public/brand/logo-official-black.png"><div class="d">DAILY DROP · <b>${D.date}</b></div></div>
<div class="h1"><span>TOP 5</span>Today's hottest pulls</div>
<div class="fan">${fan.map(card).join('')}</div>
<div class="side"><div class="lbl"><span class="dot"></span>LIVE EVENTS</div>
 ${D.events.map((e) => `<div class="tk" style="background:${e.bg};--hole:#F4F1EA"><div class="body"><div class="tg">${e.tag}</div><div class="bgt" style="font-size:32px">${e.big}</div><div class="ln">${e.line}</div></div>
  <div class="stub"><b>${e.left}</b><div><span style="margin-top:0">DAYS LEFT</span><i>ENDS ${e.ends}</i></div></div><div class="ic">${e.icon}</div></div>`).join('')}
 <div class="mk"><div><span>BTC</span><img src="${logo('btc')}">${D.btc}<i>${pct(D.btcCh)}</i></div><div><span>ETH</span><img src="${logo('eth')}">${D.eth}<i>${pct(D.ethCh)}</i></div>
 <div><span>MKT CAP</span>${D.cap}<i>${pct(D.capCh)}</i></div><div><span>FEAR &amp; GREED</span>${D.fg} ${D.fgLabel}</div></div>
</div></div></body></html>`;
};

const PAGES = {'x1-bezel-white': () => X1(false), 'x1-bezel-black': () => X1(true), 'x2-cards': X2};
const want = process.argv.slice(2);
fs.mkdirSync(DIR + '/build', {recursive: true});
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', ROOT], {stdio: 'ignore'});
await new Promise((r) => setTimeout(r, 800));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport: {width: 1600, height: 900}, deviceScaleFactor: 1.25});
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  for (const [name, html] of Object.entries(PAGES)) {
    if (want.length && !want.includes(name)) continue;
    fs.writeFileSync(`${DIR}/build/${name}.html`, html());
    await page.goto(`http://localhost:${PORT}/social/daily/build/${name}.html`, {waitUntil: 'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({path: `${DIR}/img/${name}.png`});
    console.log(name);
  }
} finally {
  await browser.close();
  server.kill();
}
