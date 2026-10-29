// Daily poster, round 3: bright backgrounds. Tokens + logos lead, events are tickets (their own shape and colour).
//   w1-cards-white   pure white, top-3 coin cards + rows, events column of vertical tickets
//   w2-cards-logo    light grey with a giant Hotcoin mark, five coin cards in a row, ticket band
//   w3-tech-light    tech/terminal layout on white, outlined giant mark, black tickets
//   w4-3d-white      three.js podium in a white studio, giant mark behind
// Renders 2000x1125 PNGs to social/daily/img.   node social/daily/light.mjs [names...]
import {createRequire} from 'module';
import {spawn} from 'child_process';
import fs from 'fs';
const require = createRequire('/opt/node-tools/node_modules/');
const {chromium} = require(process.env.PW_PATH || 'playwright');
const ROOT = '/home/user/sandbox';
const DIR = ROOT + '/social/daily';
const PORT = 8766;
const SPARK = JSON.parse(fs.readFileSync(DIR + '/spark.json', 'utf8'));

const D = {
  date: 'OCT 29', wk: 'THU',
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
    {tag: 'ALPHA TRADING REWARDS #6', big: '100,000 USDT', line: 'Trade, climb the leaderboard, share the pool', ends: 'NOV 6', left: 8, total: 14, bg: '#B8F26A', fg: '#0B0E11', icon: '🏆'},
    {tag: 'HALLOWEEN MYSTERY BOX', big: 'Every draw wins', line: 'MacBook Pro, iPhone 18 Pro Max & more', ends: 'NOV 5', left: 7, total: 14, bg: '#FF7A1A', fg: '#0B0E11', icon: '🎃'},
  ],
};
const pct = (v) => (v > 0 ? '+' : '') + v.toFixed(2) + '%';
const cls = (v) => (v >= 0 ? 'up' : 'dn');
const logo = (k) => `/social/daily/logos/${k}.png`;
const LOGO_B = '/hotcoin-tradfi/public/brand/logo-official-black.png';
// the Hotcoin mark (slash + dot) from brand/logo-v3.svg, viewBox 0 0 26 26
const MARK_SLASH = 'M2.28588 5.14427L5.12855 2.3016C6.54988 3.24916 7.97122 5.14427 12.5906 5.49962C16.842 5.82668 19.3419 3.24917 21.1186 1.94628L24.3166 5.14429L5.12855 24.3323L1.93054 21.1343L13.3012 9.76362C7.97121 10.119 4.41787 7.2763 2.28588 5.14427Z';
const MARK_DOT = 'M23.6 19.7892C23.6 22.0094 21.8001 23.8093 19.5798 23.8093C17.3595 23.8093 15.5597 22.0094 15.5597 19.7892C15.5597 17.5689 17.3595 15.769 19.5798 15.769C21.8001 15.769 23.6 17.5689 23.6 19.7892Z';
const mark = ({size, x, y, slash = '#0B0E11', dot = '#7EC25A', op = 0.05, stroke = null, rot = 0}) =>
  `<svg class="mark" viewBox="0 0 26 26" width="${size}" height="${size}" style="position:absolute;left:${x}px;top:${y}px;opacity:${op};transform:rotate(${rot}deg)">
  <path d="${MARK_SLASH}" ${stroke ? `fill="none" stroke="${stroke}" stroke-width="${26 / size * 3}"` : `fill="${slash}"`}/>
  <path d="${MARK_DOT}" ${stroke ? `fill="none" stroke="${dot}" stroke-width="${26 / size * 3}"` : `fill="${dot}"`}/></svg>`;

const sparkSvg = (sym, w, h, color, id) => {
  const s = SPARK[sym]?.spark;
  if (!s) return '';
  const lo = Math.min(...s), hi = Math.max(...s);
  const pts = s.map((v, i) => [i / (s.length - 1) * w, h - 4 - (v - lo) / (hi - lo || 1) * (h - 8)]);
  const line = pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block">
  <defs><linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
  <polygon points="0,${h} ${line} ${w},${h}" fill="url(#g${id})"/><polyline points="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="${pts.at(-1)[0] - 1}" cy="${pts.at(-1)[1]}" r="4.5" fill="${color}"/></svg>`;
};
const coin = (g, size, ring = true) => `<div class="coin" style="width:${size}px;height:${size}px;background:${g.bg};${ring ? `box-shadow:0 ${size / 10}px ${size / 4}px ${g.glow}55,0 0 0 ${Math.max(3, size / 30)}px #fff,0 0 0 ${Math.max(4, size / 26)}px #0B0E1112` : ''}"><img src="${logo(g.logo)}"></div>`;

const HEAD = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800;900&family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=block" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}
body{width:1600px;height:900px;overflow:hidden;font-family:'Inter Tight',sans-serif;background:#fff;color:#0B0E11}
.coin{border-radius:50%;overflow:hidden;flex:none;display:flex;align-items:center;justify-content:center}
.coin img{width:100%;height:100%;object-fit:cover;display:block}
.up{color:#14A04B}.dn{color:#E03131}
i{font-style:normal}
.s{position:relative;width:1600px;height:900px;overflow:hidden}
.top{position:relative;display:flex;justify-content:space-between;align-items:center}
.top img{height:38px}
.top .d{font-family:'JetBrains Mono';font-weight:700;font-size:18px;letter-spacing:3px;color:#6B7280}.top .d b{color:#0B0E11}
.mk{position:relative;display:flex;gap:34px;align-items:center;font-family:'JetBrains Mono';font-weight:700;font-size:18px;color:#0B0E11;white-space:nowrap}
.mk span{color:#8A919C;font-weight:500;margin-right:6px}.mk img{width:22px;height:22px;vertical-align:-5px;margin-right:6px}
.lbl{display:inline-flex;align-items:center;gap:10px;font-family:'JetBrains Mono';font-weight:800;font-size:16px;letter-spacing:3px}
.lbl .dot{width:10px;height:10px;border-radius:50%;background:#FF3B30;box-shadow:0 0 0 4px #FF3B3022}

/* tickets: coloured, notched, dashed tear line, stub with the countdown */
.tk{position:relative;display:flex;border-radius:22px;color:#0B0E11;overflow:visible}
.tk .body{flex:1;padding:22px 26px;display:flex;flex-direction:column;justify-content:center;min-width:0}
.tk .tg{font-family:'JetBrains Mono';font-weight:800;font-size:14px;letter-spacing:2px;opacity:.75}
.tk .bg{font-family:Unbounded;font-weight:900;letter-spacing:-1px;line-height:1;margin-top:10px}
.tk .ln{font-weight:600;margin-top:8px;opacity:.8}
.tk .stub{flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;border-left:2.5px dashed #0B0E1155;position:relative;padding:0 22px}
.tk .stub b{font-family:Unbounded;font-weight:900;line-height:.9}
.tk .stub span{font-family:'JetBrains Mono';font-weight:800;font-size:13px;letter-spacing:2px;margin-top:6px}
.tk .stub i{font-family:'JetBrains Mono';font-weight:600;font-size:12px;letter-spacing:1px;opacity:.7;margin-top:3px}
.tk .stub::before,.tk .stub::after{content:'';position:absolute;left:-15px;width:28px;height:28px;border-radius:50%;background:var(--hole,#fff)}
.tk .stub::before{top:-14px}.tk .stub::after{bottom:-14px}
.tk .ic{position:absolute;right:-10px;top:-22px;font-size:46px;transform:rotate(12deg);filter:drop-shadow(0 6px 10px rgba(0,0,0,.18))}
</style>`;
const ticket = (e, {big = 40, line = 18, num = 70, hole = '#fff', dark = false} = {}) => `<div class="tk" style="background:${dark ? '#0B0E11' : e.bg};${dark ? 'color:#fff' : ''};--hole:${hole}">
 <div class="body"><div class="tg" style="${dark ? `color:${e.bg};opacity:1` : ''}">${e.tag}</div><div class="bg" style="font-size:${big}px">${e.big}</div><div class="ln" style="font-size:${line}px">${e.line}</div></div>
 <div class="stub" style="${dark ? `border-left-color:#ffffff40;color:${e.bg}` : ''}"><b style="font-size:${num}px">${e.left}</b><span>DAYS LEFT</span><i>ENDS ${e.ends}</i></div>
 <div class="ic">${e.icon}</div></div>`;
const market = () => `<div class="mk"><div><span>MKT</span>${D.cap} <i class="${cls(D.capCh)}">${pct(D.capCh)}</i></div>
 <div><img src="${logo('btc')}">${D.btc} <i class="${cls(D.btcCh)}">${pct(D.btcCh)}</i></div>
 <div><img src="${logo('eth')}">${D.eth} <i class="${cls(D.ethCh)}">${pct(D.ethCh)}</i></div>
 <div><span>FEAR &amp; GREED</span>${D.fg} ${D.fgLabel}</div></div>`;

// ---------- W1: pure white, coin cards + events column ----------
const W1 = () => {
  const top = [D.gainers[1], D.gainers[0], D.gainers[2]];
  return `${HEAD}<style>
.s{padding:44px 52px 34px;display:flex;flex-direction:column}
.main{flex:1;display:grid;grid-template-columns:1fr 420px;gap:34px;margin-top:26px}
.tok{display:flex;flex-direction:column}
.pod{flex:1;display:grid;grid-template-columns:1fr 1.12fr 1fr;gap:18px;align-items:stretch;margin-top:14px}
.p{position:relative;border-radius:28px;background:#fff;border:1.5px solid #ECEDEA;box-shadow:0 18px 40px rgba(11,14,17,.07);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 16px 24px;overflow:hidden}
.p:not(.one){margin-top:44px}
.p .gl{position:absolute;inset:0;opacity:.22}
.p .rk{position:absolute;top:18px;left:20px;font-family:Unbounded;font-weight:900;font-size:22px;color:#B4BAC2}
.p.one .rk{color:#0B0E11;background:#B8F26A;border-radius:10px;padding:4px 10px}
.p .sym{position:relative;font-family:Unbounded;font-weight:900;font-size:34px;margin-top:24px;letter-spacing:-.5px}
.p .nm{position:relative;font-size:16px;color:#6B7280;font-weight:600;margin-top:2px}
.p .ch{position:relative;font-family:Unbounded;font-weight:900;font-size:50px;letter-spacing:-1.5px;margin-top:12px}
.p.one .sym{font-size:52px}.p.one .ch{font-size:68px}
.rows{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}
.r{display:flex;align-items:center;gap:16px;border-radius:20px;background:#F6F7F4;padding:16px 22px 16px 16px}
.r .n{font-family:Unbounded;font-weight:900;font-size:20px;color:#B4BAC2;width:24px;text-align:center}
.r .sym{font-family:Unbounded;font-weight:900;font-size:24px}
.r .nm{font-size:14px;color:#6B7280;font-weight:600}
.r .ch{margin-left:auto;font-family:Unbounded;font-weight:900;font-size:30px}
.evc{display:flex;flex-direction:column;gap:22px;padding-left:34px;border-left:2px solid #F0F1EE}
.evc .tk{flex:1;flex-direction:column}
.evc .tk .stub{flex-direction:row;gap:14px;border-left:none;border-top:2.5px dashed #0B0E1155;padding:16px 26px;justify-content:flex-start}
.evc .tk .stub::before,.evc .tk .stub::after{top:-15px;bottom:auto;left:auto}
.evc .tk .stub::before{left:-14px}.evc .tk .stub::after{right:-14px}
.evc .tk .stub div{display:flex;flex-direction:column}
.foot{display:flex;justify-content:space-between;align-items:center;margin-top:24px;padding-top:18px;border-top:2px solid #F0F1EE}
</style></head><body><div class="s">
<div class="top"><img src="${LOGO_B}"><div class="d">DAILY · <b>${D.date}</b> · UTC+8</div></div>
<div class="main"><div class="tok"><div class="lbl">TOP GAINERS · 24H</div>
 <div class="pod">${top.map((g) => {
    const r = D.gainers.indexOf(g) + 1, one = r === 1;
    return `<div class="p${one ? ' one' : ''}"><div class="gl" style="background:radial-gradient(90% 60% at 50% 0%,${g.glow},transparent 75%)"></div><div class="rk">#${r}</div>
  ${coin(g, one ? 220 : 160)}<div class="sym" style="${g.sym.length > 8 ? 'font-size:26px' : ''}">${g.sym}</div><div class="nm">${g.name}</div><div class="ch up">${pct(g.ch)}</div></div>`;
  }).join('')}</div>
 <div class="rows">${D.gainers.slice(3).map((g, i) => `<div class="r"><div class="n">${i + 4}</div>${coin(g, 54, false)}<div><div class="sym">${g.sym}</div><div class="nm">${g.name}</div></div><div class="ch up">${pct(g.ch)}</div></div>`).join('')}</div>
</div>
<div class="evc"><div class="lbl"><span class="dot"></span>LIVE EVENTS</div>
 ${D.events.map((e) => `<div class="tk" style="background:${e.bg}"><div class="body"><div class="tg">${e.tag}</div><div class="bg" style="font-size:${e.big.length > 13 ? 34 : 38}px">${e.big}</div><div class="ln" style="font-size:16px">${e.line}</div></div>
  <div class="stub"><b style="font-size:54px">${e.left}</b><div><span style="margin-top:0">DAYS LEFT</span><i>ENDS ${e.ends}</i></div></div><div class="ic">${e.icon}</div></div>`).join('')}
</div></div>
<div class="foot">${market()}</div>
</div></body></html>`;
};

// ---------- W2: giant mark, five coins in a row, ticket band ----------
const W2 = () => `${HEAD}<style>
body{background:#F3F4F0}
.s{padding:44px 52px 30px;display:flex;flex-direction:column}
.row5{position:relative;flex:1;display:grid;grid-template-columns:1fr 1fr 1.25fr 1fr 1fr;gap:16px;align-items:stretch;margin-top:4px}
.c{position:relative;background:#ffffffd9;backdrop-filter:blur(6px);border-radius:26px;border:1.5px solid #fff;box-shadow:0 14px 36px rgba(11,14,17,.08);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 10px 22px;overflow:hidden}
.c:not(.one){margin-top:50px}
.c .gl{position:absolute;left:0;right:0;bottom:0;height:8px}
.c .rk{position:absolute;top:14px;left:16px;font-family:Unbounded;font-weight:900;font-size:18px;color:#B4BAC2}
.c.one .rk{color:#0B0E11;background:#B8F26A;border-radius:9px;padding:3px 9px}
.c .sym{font-family:Unbounded;font-weight:900;font-size:24px;margin-top:22px;letter-spacing:-.5px;white-space:nowrap}
.c .nm{font-size:14px;color:#6B7280;font-weight:600;margin-top:2px}
.c .ch{font-family:Unbounded;font-weight:900;font-size:36px;letter-spacing:-1px;margin-top:10px}
.c.one .sym{font-size:44px}.c.one .ch{font-size:54px}
.band{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:24px}
.bl{position:relative;display:flex;justify-content:space-between;align-items:center;margin:22px 0 14px}
.foot{position:relative;display:flex;justify-content:center;margin-top:20px}
</style></head><body><div class="s">
${mark({size: 1250, x: 640, y: -230, slash: '#0B0E11', dot: '#7EC25A', op: 0.055, rot: 0})}
${mark({size: 1250, x: 640, y: -230, slash: 'transparent', dot: '#7EC25A', op: 0.35})}
<div class="top"><img src="${LOGO_B}"><div class="d">DAILY · <b>${D.date}</b> · UTC+8</div></div>
<div class="bl" style="margin-top:24px"><div class="lbl">TOP GAINERS · 24H</div></div>
<div class="row5">${[3, 1, 0, 2, 4].map((gi) => {
  const g = D.gainers[gi], one = gi === 0;
  return `<div class="c${one ? ' one' : ''}" style="padding-top:${one ? 30 : 24}px"><div class="rk">#${gi + 1}</div>${coin(g, one ? 210 : 140)}
  <div class="sym">${g.sym}</div><div class="nm">${g.name}</div><div class="ch up">${pct(g.ch)}</div><div class="gl" style="background:${g.glow}"></div></div>`;
}).join('')}</div>
<div class="bl"><div class="lbl"><span class="dot"></span>LIVE EVENTS</div>${market()}</div>
<div class="band">${D.events.map((e) => ticket(e, {big: 44, line: 18, num: 72, hole: '#F3F4F0'})).join('')}</div>
</div></body></html>`;

// ---------- W3: tech on white, outlined giant mark, black tickets ----------
const W3 = () => {
  const [g1, ...rest] = D.gainers;
  return `${HEAD}<style>
body{font-family:'JetBrains Mono',monospace}
.s{padding:40px 52px 32px;display:flex;flex-direction:column}
.gridbg{position:absolute;inset:0;background-image:linear-gradient(rgba(11,14,17,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(11,14,17,.05) 1px,transparent 1px);background-size:40px 40px}
.hd{position:relative;display:flex;justify-content:space-between;align-items:center;font-size:18px;color:#8A919C;padding-bottom:16px;border-bottom:2px solid #0B0E11}
.hd img{height:32px}.hd b{color:#0B0E11}
.cur{display:inline-block;width:12px;height:22px;background:#7EC25A;vertical-align:-4px;margin-left:6px}
.tick{position:relative;padding:12px 0;border-bottom:1.5px dashed #0B0E1133}
.k{color:#8A919C;font-size:15px;letter-spacing:2px}
.main{position:relative;flex:1;display:grid;grid-template-columns:560px 1fr;gap:20px;padding:20px 0}
.box{position:relative;background:#ffffffe6;border:2px solid #0B0E11;border-radius:4px}
.hero{padding:24px 28px;display:flex;flex-direction:column;box-shadow:8px 8px 0 #B8F26A}
.hero .row{display:flex;align-items:center;gap:26px;margin-top:14px}
.hero .sym{font-family:Unbounded;font-weight:900;font-size:110px;line-height:.9}
.hero .nm{font-size:18px;color:#6B7280;margin-top:8px}
.hero .ch{font-family:Unbounded;font-weight:900;font-size:80px;letter-spacing:-3px;margin-top:auto;line-height:1;white-space:nowrap}
.g4{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:16px}
.c{padding:16px 20px;display:grid;grid-template-columns:auto 1fr;column-gap:16px;align-content:space-between}
.c .sym{font-family:Unbounded;font-weight:900;font-size:26px;margin-top:2px}
.c .nm{font-size:14px;color:#6B7280;margin-top:2px}
.c .bt{grid-column:1/3;display:flex;justify-content:space-between;align-items:flex-end;margin-top:8px}
.c .bt b{font-family:Unbounded;font-weight:900;font-size:34px}
.evs{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:22px}
</style></head><body><div class="s"><div class="gridbg"></div>
${mark({size: 980, x: 830, y: -60, stroke: '#0B0E11', dot: '#7EC25A', op: 0.12})}
<div class="hd"><img src="${LOGO_B}"><div>~/hotcoin/daily <b>$</b> top --gainers --24h<span class="cur"></span></div><div><b>${D.date}</b> · UTC+8</div></div>
<div class="tick">${market()}</div>
<div class="main">
 <div class="box hero"><div class="k">[ RANK_01 ] // TOP_GAINER_24H</div>
  <div class="row">${coin(g1, 180)}<div><div class="sym">${g1.sym}</div><div class="nm">${g1.name}</div></div></div>
  <div class="ch up">${pct(g1.ch)}<span style="font-size:40px;margin-left:12px;vertical-align:12px">▲</span></div>
  <div style="margin-top:10px">${sparkSvg(g1.sym, 500, 62, '#14A04B', 'h')}</div><div class="k" style="margin-top:4px">7D_PRICE</div></div>
 <div class="g4">${rest.map((g, i) => `<div class="box c">${coin(g, 76, false)}<div><div class="k">RANK_0${i + 2}</div><div class="sym">${g.sym}</div><div class="nm">${g.name}</div></div>
  <div class="bt"><b class="up">${pct(g.ch)}</b>${sparkSvg(g.sym, 190, 40, '#14A04B', 'c' + i)}</div></div>`).join('')}</div>
</div>
<div class="evs">${D.events.map((e) => ticket(e, {big: 34, line: 15, num: 58, dark: true})).join('')}</div>
</div></body></html>`;
};

// ---------- W4: 3D podium, white studio ----------
const W4 = () => `${HEAD}
<script type="importmap">{"imports":{"three":"/hotcoin-tradfi/node_modules/three/build/three.module.js","three/addons/":"/hotcoin-tradfi/node_modules/three/examples/jsm/"}}</script>
<style>
body{background:radial-gradient(80% 70% at 50% 40%,#ffffff,#EEF0EB 80%)}
canvas{position:absolute;inset:0;width:1600px!important;height:900px!important;z-index:1}
.s{z-index:2;padding:40px 52px 30px;display:flex;flex-direction:column;pointer-events:none}
.sp{flex:1}
.band{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.bl{display:flex;justify-content:space-between;align-items:center;margin:0 0 12px}
</style></head><body>
<div style="position:absolute;inset:0;z-index:0">${mark({size: 1150, x: 225, y: -170, slash: '#0B0E11', dot: '#7EC25A', op: 0.06})}</div>
<canvas id="c"></canvas><div class="s">
<div class="top"><img src="${LOGO_B}"><div class="d">TOP GAINERS · 24H · <b>${D.date}</b></div></div>
<div class="sp"></div>
<div class="bl"><div class="lbl"><span class="dot"></span>LIVE EVENTS</div>${market()}</div>
<div class="band">${D.events.map((e) => ticket(e, {big: 34, line: 15, num: 56, hole: '#EEF0EB'})).join('')}</div></div>
<script type="module">
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
const G = ${JSON.stringify(D.gainers)};
await Promise.all(['900 80px Unbounded', '800 40px "JetBrains Mono"'].map((f) => document.fonts.load(f)));
const W = 1600, H = 900;
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('c'), antialias: true, alpha: true, preserveDrawingBuffer: true});
renderer.setPixelRatio(1.25); renderer.setSize(W, H); renderer.setClearColor(0, 0);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.VSMShadowMap;
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.9;
const camera = new THREE.PerspectiveCamera(27, W / H, 0.1, 100);
camera.position.set(0, 3.6, 23); camera.lookAt(0, 2.2, 0);
const img = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
const faceTex = async (g) => {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d');
  x.fillStyle = g.bg; x.fillRect(0, 0, 512, 512);
  x.save(); x.beginPath(); x.arc(256, 256, 236, 0, Math.PI * 2); x.clip();
  x.drawImage(await img('/social/daily/logos/' + g.logo + '.png'), 20, 20, 472, 472); x.restore();
  const t = new THREE.CanvasTexture(c); t.center.set(0.5, 0.5); t.rotation = -Math.PI / 2; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const frontTex = (g, rank, w, h) => {
  const c = document.createElement('canvas'); c.width = w * 220; c.height = h * 220; const x = c.getContext('2d');
  x.textAlign = 'center';
  x.fillStyle = rank === 1 ? '#14A04B' : '#9AA0A8'; x.font = '800 32px "JetBrains Mono"'; x.fillText('#' + rank, c.width / 2, 64);
  let fs = 70; x.font = '900 ' + fs + 'px Unbounded';
  while (x.measureText(g.sym).width > c.width * 0.86) { fs -= 3; x.font = '900 ' + fs + 'px Unbounded'; }
  x.fillStyle = '#0B0E11'; x.fillText(g.sym, c.width / 2, 92 + fs);
  x.fillStyle = '#14A04B'; x.font = '900 60px Unbounded'; x.fillText('+' + g.ch.toFixed(2) + '%', c.width / 2, 92 + fs + 80);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const order = [3, 1, 0, 2, 4];
const SP = 3.15, PW = 2.75, PD = 1.8, R = 1.12;
const white = new THREE.MeshPhysicalMaterial({color: 0xf7f8f5, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.15});
const rimMat = new THREE.MeshPhysicalMaterial({color: 0xdfe3df, metalness: 1, roughness: 0.18});
for (let k = 0; k < 5; k++) {
  const gi = order[k], g = G[gi], rank = gi + 1;
  const x = (k - 2) * SP, z = -Math.abs(k - 2) * 0.55;
  const h = 1.5 + g.ch / G[0].ch * 2.0;
  const p = new THREE.Mesh(new THREE.BoxGeometry(PW, h, PD), white); p.position.set(x, h / 2, z); p.castShadow = p.receiveShadow = true; scene.add(p);
  const fh = Math.min(h - 0.1, 2.2);
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(PW, fh), new THREE.MeshBasicMaterial({map: frontTex(g, rank, PW, fh), transparent: true, toneMapped: false}));
  lab.position.set(x, h - fh / 2 - 0.08, z + PD / 2 + 0.003); scene.add(lab);
  if (rank === 1) { const e = new THREE.Mesh(new THREE.BoxGeometry(PW + 0.02, 0.07, PD + 0.02), new THREE.MeshBasicMaterial({color: 0xb8f26a, toneMapped: false})); e.position.set(x, h, z); scene.add(e); }
  const coin = new THREE.Group();
  const face = new THREE.MeshPhysicalMaterial({map: await faceTex(g), roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.05});
  const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.26, 96), [rimMat, face, face]);
  body.rotation.x = Math.PI / 2; body.rotation.y = Math.PI; body.castShadow = true; coin.add(body);
  for (const zz of [0.13, -0.13]) { const b = new THREE.Mesh(new THREE.TorusGeometry(R, 0.07, 24, 120), rimMat); b.position.z = zz; b.castShadow = true; coin.add(b); }
  coin.position.set(x, h + R + 0.12, z + 0.1); coin.rotation.y = -(k - 2) * 0.16; coin.rotation.z = (k - 2) * 0.03;
  if (rank === 1) coin.scale.setScalar(1.12), coin.position.y += 0.14;
  scene.add(coin);
}
scene.add(new THREE.HemisphereLight(0xffffff, 0xe6e9e2, 1.2));
const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-6, 12, 9); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 10; key.shadow.blurSamples = 20; Object.assign(key.shadow.camera, {left: -12, right: 12, top: 12, bottom: -12});
scene.add(key);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({opacity: 0.12}));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
renderer.render(scene, camera);
document.title = 'ready';
</script></body></html>`;

const PAGES = {'w1-cards-white': W1, 'w2-cards-logo': W2, 'w3-tech-light': W3, 'w4-3d-white': W4};
const want = process.argv.slice(2);
fs.mkdirSync(DIR + '/build', {recursive: true});
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', ROOT], {stdio: 'ignore'});
await new Promise((r) => setTimeout(r, 800));
const browser = await chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
try {
  const page = await browser.newPage({viewport: {width: 1600, height: 900}, deviceScaleFactor: 1.25});
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  for (const [name, html] of Object.entries(PAGES)) {
    if (want.length && !want.includes(name)) continue;
    fs.writeFileSync(`${DIR}/build/${name}.html`, html());
    await page.goto(`http://localhost:${PORT}/social/daily/build/${name}.html`, {waitUntil: 'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    if (name.includes('3d')) await page.waitForFunction(() => document.title === 'ready', null, {timeout: 180000});
    await page.screenshot({path: `${DIR}/img/${name}.png`});
    console.log(name);
  }
} finally {
  await browser.close();
  server.kill();
}
