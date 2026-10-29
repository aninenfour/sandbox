// Daily poster, round 2: tokens and their logos lead. Three directions:
//   t1-tech      terminal / tech style, #1 gainer as the hero, 2-5 in a grid, 7d sparklines
//   t2-glow      dark cards, big logos with a glow in each logo's own colour
//   t3-3d        three.js: logo coins standing on glass pillars sized by % gain, tech overlay
// Renders 2000x1125 PNGs to social/daily/img. Serves the repo over http so pages can load three.js and logos.
//   node social/daily/tokens.mjs [t1-tech t2-glow t3-3d]
import {createRequire} from 'module';
import {spawn} from 'child_process';
import fs from 'fs';
const require = createRequire('/opt/node-tools/node_modules/');
const {chromium} = require(process.env.PW_PATH || 'playwright');
const ROOT = '/home/user/sandbox';
const DIR = ROOT + '/social/daily';
const PORT = 8765;
const URL = `http://localhost:${PORT}`;
const SPARK = JSON.parse(fs.readFileSync(DIR + '/spark.json', 'utf8'));

const D = {
  date: 'OCT 29', dateLong: 'october-29-2026', wk: 'THU',
  cap: '$2.65T', capCh: -0.60, fg: 51, fgLabel: 'Neutral',
  btc: '$79,970', btcCh: -1.24, eth: '$2,307', ethCh: -2.09,
  gainers: [
    {sym: 'Q', name: 'Quack AI', ch: 21.62, logo: 'q', bg: '#141414', glow: '#FFD400'},
    {sym: 'STONKBROKER', name: 'StonkBroker', ch: 20.70, logo: 'stonkbroker', bg: '#FF7A00', glow: '#FF7A00'},
    {sym: 'HUMA', name: 'Huma Finance', ch: 10.04, logo: 'huma', bg: '#000', glow: '#B44CFF'},
    {sym: 'LITEB', name: 'Lumentum · bStocks', ch: 7.63, logo: 'liteb', bg: '#fff', glow: '#E8E8E8'},
    {sym: 'ORCLB', name: 'Oracle · bStocks', ch: 6.34, logo: 'orclb', bg: '#E2231A', glow: '#E2231A'},
  ],
  events: [
    {tag: 'ALPHA TRADING REWARDS #6', big: '100,000 USDT', line: 'Trade, climb the leaderboard, share the pool', ends: 'NOV 6', left: 8, total: 14},
    {tag: 'HALLOWEEN MYSTERY BOX', big: 'Every draw wins', line: 'MacBook Pro, iPhone 18 Pro Max & more', ends: 'NOV 5', left: 7, total: 14},
  ],
};
const pct = (v) => (v > 0 ? '+' : '') + v.toFixed(2) + '%';
const cls = (v) => (v >= 0 ? 'up' : 'dn');
const logo = (k) => `/social/daily/logos/${k}.png`;
const LOGO_W = '/hotcoin-tradfi/public/brand/logo-official-white.png';
const GRAIN = '/hotcoin-tradfi/public/grain.png';

const sparkSvg = (sym, w, h, color = '#B8F26A', id = sym) => {
  const s = SPARK[sym]?.spark;
  if (!s) return '';
  const lo = Math.min(...s), hi = Math.max(...s);
  const pts = s.map((v, i) => [i / (s.length - 1) * w, h - 4 - (v - lo) / (hi - lo || 1) * (h - 8)]);
  const line = pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block">
  <defs><linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".35"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
  <polygon points="0,${h} ${line} ${w},${h}" fill="url(#g${id})"/><polyline points="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="${pts.at(-1)[0] - 1}" cy="${pts.at(-1)[1]}" r="4.5" fill="${color}"/></svg>`;
};
const coin = (g, size, extra = '') => `<div class="coin" style="width:${size}px;height:${size}px;background:${g.bg};${extra}"><img src="${logo(g.logo)}"></div>`;

const HEAD = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800;900&family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=block" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}
body{width:1600px;height:900px;overflow:hidden;font-family:'Inter Tight',sans-serif;background:#050605}
.mono{font-family:'JetBrains Mono',monospace}
.coin{border-radius:50%;overflow:hidden;flex:none;display:flex;align-items:center;justify-content:center}
.coin img{width:100%;height:100%;object-fit:cover;display:block}
.up{color:#B8F26A}.dn{color:#FF5C6C}
i{font-style:normal}
</style>`;

// shared tech chrome: header + ticker
const TECH_CSS = `
.s{position:relative;width:1600px;height:900px;padding:40px 56px 36px;display:flex;flex-direction:column;color:#C8D3C4;font-family:'JetBrains Mono',monospace}
.scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.022) 0 1px,transparent 1px 4px);pointer-events:none;z-index:5}
.vig{position:absolute;inset:0;background:radial-gradient(80% 80% at 50% 50%,transparent 55%,rgba(0,0,0,.65));pointer-events:none}
.hd{position:relative;display:flex;justify-content:space-between;align-items:center;font-size:19px;color:#6C7A68;padding-bottom:18px;border-bottom:1.5px dashed #2A3328}
.hd img{height:32px}.hd b{color:#B8F26A}
.cur{display:inline-block;width:13px;height:24px;background:#B8F26A;vertical-align:-4px;margin-left:6px}
.tick{position:relative;display:flex;gap:40px;align-items:center;font-size:20px;font-weight:700;padding:14px 0;border-bottom:1.5px dashed #2A3328;white-space:nowrap}
.tick span{color:#5E6B5A;font-weight:500;margin-right:6px}
.tick .ic{width:26px;height:26px;vertical-align:-6px;margin-right:8px}
.k{color:#5E6B5A;font-size:16px;letter-spacing:2px}
.brk{position:absolute;width:18px;height:18px;border-color:#B8F26A;border-style:solid}
.brk.tl{top:-1px;left:-1px;border-width:2px 0 0 2px}.brk.tr{top:-1px;right:-1px;border-width:2px 2px 0 0}
.brk.bl{bottom:-1px;left:-1px;border-width:0 0 2px 2px}.brk.br{bottom:-1px;right:-1px;border-width:0 2px 2px 0}
.evs{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:24px}
.ev{border:1.5px solid #2A3328;padding:16px 22px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:6px 18px}
.ev .t{font-size:15px;font-weight:800;letter-spacing:2px;color:#B8F26A}
.ev .b{font-family:Unbounded;font-weight:900;font-size:30px;color:#F2F6EE;letter-spacing:-.5px}
.ev .p{grid-column:2;grid-row:1/3;text-align:right;font-size:17px;font-weight:700;color:#B8F26A;letter-spacing:1px;white-space:nowrap}
.ev .p span{display:block;color:#5E6B5A;font-weight:500;margin-top:6px}
.ev.o .t,.ev.o .p{color:#FF8A3D}
`;
const header = (cmd) => `<div class="hd"><img src="${LOGO_W}"><div>~/hotcoin/daily <b>$</b> ${cmd}<span class="cur"></span></div><div><b>${D.date}</b> · UTC+8</div></div>`;
const ticker = () => `<div class="tick">
 <div><span>MKT_CAP</span>${D.cap} <i class="${cls(D.capCh)}">${pct(D.capCh)}</i></div>
 <div><img class="ic" src="${logo('btc')}">${D.btc} <i class="${cls(D.btcCh)}">${pct(D.btcCh)}</i></div>
 <div><img class="ic" src="${logo('eth')}">${D.eth} <i class="${cls(D.ethCh)}">${pct(D.ethCh)}</i></div>
 <div><span>FEAR_GREED</span>${D.fg} ${D.fgLabel.toUpperCase()}</div></div>`;
const bar = (e, n = 14) => '█'.repeat(e.total - e.left) + '░'.repeat(e.left);
const events = () => `<div class="evs">${D.events.map((e, i) => `<div class="ev${i ? ' o' : ''}"><div class="t">[ EVENT_0${i + 1} ] ${e.tag}</div>
 <div class="p">${bar(e)}<span>T-${e.left}D · ENDS ${e.ends}</span></div><div class="b">${e.big}</div></div>`).join('')}</div>`;

// ---------- T1 tech ----------
const T1 = () => {
  const [g1, ...rest] = D.gainers;
  return `${HEAD}<style>${TECH_CSS}
.main{position:relative;flex:1;display:grid;grid-template-columns:600px 1fr;gap:24px;padding:22px 0}
.hero{position:relative;border:1.5px solid #2A3328;padding:26px 30px;display:flex;flex-direction:column;background:radial-gradient(70% 60% at 30% 35%,rgba(255,212,0,.08),transparent 70%)}
.hero .row{display:flex;align-items:center;gap:30px;margin-top:16px}
.hero .ring{position:relative;padding:10px;border-radius:50%;border:2px dashed #B8F26A}
.hero .sym{font-family:Unbounded;font-weight:900;font-size:120px;line-height:.9;color:#F2F6EE}
.hero .nm{font-size:19px;color:#9FAA9B;margin-top:8px}
.hero .ch{font-family:Unbounded;font-weight:900;font-size:88px;letter-spacing:-3px;margin-top:auto;line-height:1}
.hero .sp{margin-top:12px}
.grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:20px}
.c{position:relative;border:1.5px solid #2A3328;padding:20px 22px;display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto 1fr auto;column-gap:18px}
.c .coin{grid-row:1/3}
.c .n{font-size:15px;color:#5E6B5A;letter-spacing:2px}
.c .sym{font-family:Unbounded;font-weight:900;font-size:30px;color:#F2F6EE;margin-top:4px;letter-spacing:-.5px}
.c .nm{font-size:15px;color:#9FAA9B;margin-top:4px}
.c .ch{grid-column:1/3;display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px}
.c .ch b{font-family:Unbounded;font-weight:900;font-size:40px;letter-spacing:-1px;color:#B8F26A}
</style></head><body><div class="s"><div class="scan"></div><div class="vig"></div>
${header('top --gainers --24h')}${ticker()}
<div class="main">
 <div class="hero"><i class="brk tl"></i><i class="brk tr"></i><i class="brk bl"></i><i class="brk br"></i>
  <div class="k">[ RANK_01 ] // TOP_GAINER_24H</div>
  <div class="row"><div class="ring">${coin(g1, 190)}</div><div><div class="sym">${g1.sym}</div><div class="nm">${g1.name}</div></div></div>
  <div class="ch up" style="white-space:nowrap">${pct(g1.ch)}<span style="font-size:44px;margin-left:14px;vertical-align:14px">▲</span></div>
  <div class="sp">${sparkSvg(g1.sym, 538, 70)}</div><div class="k" style="margin-top:6px">7D_PRICE</div>
 </div>
 <div class="grid">${rest.map((g, i) => `<div class="c">${coin(g, 92)}<div class="n">RANK_0${i + 2}</div><div><div class="sym">${g.sym}</div><div class="nm">${g.name}</div></div>
  <div class="ch"><b>${pct(g.ch)}</b>${sparkSvg(g.sym, 200, 44, '#B8F26A', 'c' + i)}</div></div>`).join('')}</div>
</div>
${events()}</div></body></html>`;
};

// ---------- T2 glow cards ----------
const T2 = () => {
  const top = [D.gainers[1], D.gainers[0], D.gainers[2]];
  return `${HEAD}<style>
.s{position:relative;width:1600px;height:900px;padding:44px 56px 36px;display:flex;flex-direction:column;color:#F2F4EF;background:#07090B}
.grain{position:absolute;inset:0;background:url(${GRAIN});opacity:.06;mix-blend-mode:screen}
.top{position:relative;display:flex;justify-content:space-between;align-items:center}
.top img{height:38px}
.top .d{font-family:'JetBrains Mono';font-weight:700;font-size:19px;letter-spacing:3px;color:#9AA39A}.top .d b{color:#B8F26A}
.pod{position:relative;display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:22px;margin-top:30px;align-items:end}
.p{position:relative;border-radius:30px;background:linear-gradient(180deg,#14171A,#0C0E10);border:1.5px solid #22272B;display:flex;flex-direction:column;align-items:center;padding:30px 20px 26px;overflow:hidden}
.p .gl{position:absolute;top:-40px;left:50%;width:360px;height:360px;transform:translateX(-50%);border-radius:50%;filter:blur(70px);opacity:.45}
.p .coin{position:relative;box-shadow:0 18px 40px rgba(0,0,0,.6),0 0 0 6px rgba(255,255,255,.06)}
.p .rk{position:absolute;top:22px;left:24px;font-family:Unbounded;font-weight:900;font-size:26px;color:#5B636A}
.p.one .rk{color:#B8F26A}
.p .sym{position:relative;font-family:Unbounded;font-weight:900;font-size:40px;margin-top:22px;letter-spacing:-.5px}
.p .nm{position:relative;font-size:19px;color:#9AA39A;font-weight:600;margin-top:4px}
.p .ch{position:relative;font-family:Unbounded;font-weight:900;font-size:58px;color:#B8F26A;letter-spacing:-2px;margin-top:10px}
.p.one{border-color:#B8F26A55}
.p.one .sym{font-size:56px}.p.one .ch{font-size:80px}
.rows{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:20px}
.r{display:flex;align-items:center;gap:20px;border-radius:22px;background:#0F1214;border:1.5px solid #22272B;padding:14px 26px 14px 16px}
.r .n{font-family:Unbounded;font-weight:900;font-size:24px;color:#5B636A;width:30px;text-align:center}
.r .sym{font-family:Unbounded;font-weight:900;font-size:30px}
.r .nm{font-size:16px;color:#9AA39A;font-weight:600}
.r .ch{margin-left:auto;font-family:Unbounded;font-weight:900;font-size:36px;color:#B8F26A}
.foot{position:relative;margin-top:auto;display:flex;gap:16px;align-items:center}
.ev{flex:1;display:flex;align-items:center;gap:16px;border-radius:999px;padding:12px 14px 12px 26px;background:#B8F26A;color:#07090B}
.ev.o{background:#FF8A3D}
.ev .t{font-family:'JetBrains Mono';font-weight:800;font-size:14px;letter-spacing:2px;opacity:.7}
.ev .b{font-family:Unbounded;font-weight:900;font-size:24px}
.ev .l{margin-left:auto;font-family:'JetBrains Mono';font-weight:800;font-size:16px;letter-spacing:1px;background:#07090B;color:#fff;border-radius:999px;padding:9px 16px}
.mk{position:relative;display:flex;justify-content:space-between;margin-top:16px;font-family:'JetBrains Mono';font-weight:700;font-size:18px;color:#C9CEC6}
.mk span{color:#6E766C;font-weight:500;margin-right:6px}.mk img{width:22px;height:22px;vertical-align:-5px;margin-right:6px}
</style></head><body><div class="s"><div class="grain"></div>
<div class="top"><img src="${LOGO_W}"><div class="d">TOP GAINERS 24H · <b>${D.date}</b></div></div>
<div class="pod">${top.map((g) => {
    const r = D.gainers.indexOf(g) + 1, one = r === 1;
    return `<div class="p${one ? ' one' : ''}" style="padding-top:${one ? 34 : 30}px"><div class="gl" style="background:${g.glow}"></div><div class="rk">#${r}</div>
  ${coin(g, one ? 200 : 150)}<div class="sym">${g.sym}</div><div class="nm">${g.name}</div><div class="ch">${pct(g.ch)}</div></div>`;
  }).join('')}</div>
<div class="rows">${D.gainers.slice(3).map((g, i) => `<div class="r"><div class="n">${i + 4}</div>${coin(g, 64)}<div><div class="sym">${g.sym}</div><div class="nm">${g.name}</div></div><div class="ch">${pct(g.ch)}</div></div>`).join('')}</div>
<div class="foot">${D.events.map((e, i) => `<div class="ev${i ? ' o' : ''}"><div><div class="t">${e.tag}</div><div class="b">${e.big}</div></div><div class="l">${e.left} DAYS LEFT</div></div>`).join('')}</div>
<div class="mk"><div><span>MKT</span>${D.cap} <i class="${cls(D.capCh)}">${pct(D.capCh)}</i></div><div><img src="${logo('btc')}">${D.btc} <i class="${cls(D.btcCh)}">${pct(D.btcCh)}</i></div>
<div><img src="${logo('eth')}">${D.eth} <i class="${cls(D.ethCh)}">${pct(D.ethCh)}</i></div><div><span>FEAR &amp; GREED</span>${D.fg} ${D.fgLabel}</div></div>
</div></body></html>`;
};

// ---------- T3 3D ----------
const T3 = () => `${HEAD}
<script type="importmap">{"imports":{"three":"/hotcoin-tradfi/node_modules/three/build/three.module.js","three/addons/":"/hotcoin-tradfi/node_modules/three/examples/jsm/"}}</script>
<style>${TECH_CSS}
body{background:radial-gradient(70% 70% at 50% 45%,#121812,#050605 75%)}
canvas{position:absolute;inset:0;width:1600px!important;height:900px!important}
.fade{position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(#05060500,#050605 70%);z-index:1}
.s{z-index:2}
.spacer{flex:1}
.hd,.tick{background:linear-gradient(#050605ee,#05060500)}
.evs{background:#050605}.ev{background:#070907}
</style></head><body><canvas id="c"></canvas><div class="fade"></div><div class="s"><div class="scan"></div>
${header('top --gainers --24h --render=3d')}${ticker()}<div class="spacer"></div>${events()}</div>
<script type="module">
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
const G = ${JSON.stringify(D.gainers)};
await Promise.all(['900 80px Unbounded', '800 40px "JetBrains Mono"', '500 40px "JetBrains Mono"'].map((f) => document.fonts.load(f)));
const W = 1600, H = 900, DPR = 1.25;
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('c'), antialias: true, alpha: true, preserveDrawingBuffer: true});
renderer.setPixelRatio(DPR); renderer.setSize(W, H); renderer.setClearColor(0, 0);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;
const camera = new THREE.PerspectiveCamera(28, W / H, 0.1, 100);
camera.position.set(0, 4.6, 21.5); camera.lookAt(0, 3.55, 0);

const img = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
const faceTex = async (g) => {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d');
  x.fillStyle = g.bg; x.fillRect(0, 0, 512, 512);
  x.save(); x.beginPath(); x.arc(256, 256, 236, 0, Math.PI * 2); x.clip();
  const im = await img('/social/daily/logos/' + g.logo + '.png'); x.drawImage(im, 20, 20, 472, 472); x.restore();
  x.lineWidth = 16; x.strokeStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.arc(256, 256, 244, 0, Math.PI * 2); x.stroke();
  const t = new THREE.CanvasTexture(c); t.center.set(0.5, 0.5); t.rotation = -Math.PI / 2; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const frontTex = (g, rank, w, h) => {
  const c = document.createElement('canvas'); const S = 220; c.width = w * S; c.height = h * S; const x = c.getContext('2d');
  x.fillStyle = 'rgba(0,0,0,0)'; x.clearRect(0, 0, c.width, c.height);
  x.textAlign = 'center';
  x.fillStyle = rank === 1 ? '#B8F26A' : '#6C7A68'; x.font = '800 34px "JetBrains Mono"'; x.fillText('RANK_0' + rank, c.width / 2, 70);
  let fs = 74; x.font = '900 ' + fs + 'px Unbounded';
  while (x.measureText(g.sym).width > c.width * 0.88) { fs -= 3; x.font = '900 ' + fs + 'px Unbounded'; }
  x.fillStyle = '#F2F6EE'; x.fillText(g.sym, c.width / 2, 70 + 30 + fs);
  x.fillStyle = '#B8F26A'; x.font = '900 64px Unbounded'; x.fillText('+' + g.ch.toFixed(2) + '%', c.width / 2, 70 + 30 + fs + 86);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};

const order = [3, 1, 0, 2, 4]; // podium: #4 #2 #1 #3 #5
const SP = 3.15, PW = 2.75, PD = 1.8, R = 1.12;
const glass = new THREE.MeshPhysicalMaterial({color: 0x060807, roughness: 0.18, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.6});
const lineMat = (c) => new THREE.MeshBasicMaterial({color: c, toneMapped: false});
const rimMat = new THREE.MeshPhysicalMaterial({color: 0x2c312d, metalness: 1, roughness: 0.28});
for (let k = 0; k < 5; k++) {
  const gi = order[k], g = G[gi], rank = gi + 1;
  const x = (k - 2) * SP, z = -Math.abs(k - 2) * 0.55;
  const h = 1.3 + g.ch / G[0].ch * 2.3;
  // pillar
  const p = new THREE.Mesh(new THREE.BoxGeometry(PW, h, PD), glass); p.position.set(x, h / 2, z); p.castShadow = p.receiveShadow = true; scene.add(p);
  const fh = Math.min(h - 0.1, 2.3);
  const label = new THREE.Mesh(new THREE.PlaneGeometry(PW, fh), new THREE.MeshBasicMaterial({map: frontTex(g, rank, PW, fh), transparent: true, toneMapped: false}));
  label.position.set(x, h - fh / 2 - 0.08, z + PD / 2 + 0.003); scene.add(label);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(PW + 0.02, 0.05, PD + 0.02), new THREE.MeshBasicMaterial({color: rank === 1 ? 0xb8f26a : 0x3a4238, toneMapped: false}));
  edge.position.set(x, h, z); scene.add(edge);
  for (const sx of [-1, 1]) { const v = new THREE.Mesh(new THREE.BoxGeometry(0.03, h, 0.03), lineMat(rank === 1 ? 0x6f9a3c : 0x222a22)); v.position.set(x + sx * PW / 2, h / 2, z + PD / 2); scene.add(v); }
  // coin standing on the pillar, face to camera with a slight turn
  const coin = new THREE.Group();
  const face = new THREE.MeshPhysicalMaterial({map: await faceTex(g), roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06});
  const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.26, 96), [rimMat, face, face]);
  body.rotation.x = Math.PI / 2; body.rotation.y = Math.PI; body.castShadow = true; coin.add(body);
  const bez = new THREE.Mesh(new THREE.TorusGeometry(R, 0.07, 24, 120), rimMat); bez.position.z = 0.13; coin.add(bez);
  const bez2 = bez.clone(); bez2.position.z = -0.13; coin.add(bez2);
  coin.position.set(x, h + R + 0.12, z + 0.1); coin.rotation.y = -(k - 2) * 0.16; coin.rotation.z = (k - 2) * 0.03;
  if (rank === 1) coin.scale.setScalar(1.12), coin.position.y += 0.14;
  scene.add(coin);
}
const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(-4, 10, 8); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, {left: -10, right: 10, top: 10, bottom: -10}); scene.add(key);
const rim = new THREE.PointLight(0xb8f26a, 160, 40, 1.4); rim.position.set(7, 6, -5); scene.add(rim);
const rim2 = new THREE.PointLight(0xb8f26a, 90, 40, 1.4); rim2.position.set(-8, 5, -4); scene.add(rim2);
const top = new THREE.SpotLight(0xffffff, 140, 30, 0.3, 0.6, 1.2); top.position.set(0, 14, 2); top.target.position.set(0, 6, 0); scene.add(top, top.target);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({color: 0x040504, roughness: 0.95, metalness: 0, envMapIntensity: 0.05}));
scene.fog = new THREE.Fog(0x050605, 18, 34);
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
const grid = new THREE.GridHelper(60, 40, 0x24301f, 0x141a12); grid.position.y = 0.002; scene.add(grid);
renderer.render(scene, camera);
document.title = 'ready';
</script></body></html>`;

const PAGES = {'t1-tech': T1, 't2-glow': T2, 't3-3d': T3};
const want = process.argv.slice(2);
fs.mkdirSync(DIR + '/build', {recursive: true});
fs.mkdirSync(DIR + '/img', {recursive: true});
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', ROOT], {stdio: 'ignore'});
await new Promise((r) => setTimeout(r, 800));
const browser = await chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
try {
  const page = await browser.newPage({viewport: {width: 1600, height: 900}, deviceScaleFactor: 1.25});
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  for (const [name, html] of Object.entries(PAGES)) {
    if (want.length && !want.includes(name)) continue;
    fs.writeFileSync(`${DIR}/build/${name}.html`, html());
    await page.goto(`${URL}/social/daily/build/${name}.html`, {waitUntil: 'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    if (name === 't3-3d') await page.waitForFunction(() => document.title === 'ready', null, {timeout: 180000});
    await page.screenshot({path: `${DIR}/img/${name}.png`});
    console.log(name);
  }
} finally {
  await browser.close();
  server.kill();
}
