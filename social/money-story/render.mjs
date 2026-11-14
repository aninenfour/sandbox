// "When markets fall" money story: 28 s, 1080x1350 (4:5), 30 fps. Collage style: halftone archive footage, flat brand blocks,
// italic word strips, banknote paper planes, film grain. Rendered from one canvas page in headless Chromium, encoded with ffmpeg.
// Footage: public domain, Prelinger Archives (archive.org): "Nation's Market Place" (1932, NYSE trading floor, presses) and
// "Doubtful Dollars" (1945, currency printing, hands and a $1 bill). Logged in hotcoin-tradfi/FOOTAGE_CREDITS.md. Run ./prep.sh first.
// Data: Binance BTCUSDT daily (data-api.binance.vision), pulled Nov 14, 2026: high $87,395.67 (Sep 21), low $66,456 (Nov 14) = -24.0%.
//   NVDA: Yahoo Finance daily, record $243.37 (Oct 6) to $148.80 intraday low (Nov 12) = -38.9%.
//   Quick drops, peak to low: ETH -33.1% (Sep 21 to Nov 14), SOL -40.1% (Sep 27), XRP -40.9% (Sep 23), Binance daily;
//   Nasdaq Composite -12.5% (Oct 6 to Nov 5), Yahoo Finance daily.
// Run: PW_PATH=$(npm root -g)/playwright node social/money-story/render.mjs [sheet|video] [t1,t2,...]
import {createRequire} from 'module';
import fs from 'fs';
import {spawn} from 'child_process';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/money-story', A = 'file://' + DIR + '/assets/clips/';
const BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const FPS = 30, DUR = 29;
const btc = JSON.parse(fs.readFileSync(DIR + '/assets/btc1d.json', 'utf8')).map((k) => +k[4]);
const COUNT = Object.fromEntries(['street', 'floor', 'brokers', 'clock', 'floor2', 'crowd', 'press', 'money', 'hands'].map((n) => [n, fs.readdirSync(DIR + '/assets/clips/' + n).length]));

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;800&family=JetBrains+Mono:wght@500;700&family=Instrument+Serif:ital@0;1&display=block');
*{margin:0;padding:0}body{width:1080px;height:1350px;overflow:hidden;background:#0B0E11}canvas{display:block;width:1080px;height:1350px}
.f1{font-family:'Instrument Serif';font-style:italic}.f2{font-family:'Inter Tight';font-weight:800}.f3{font-family:'JetBrains Mono';font-weight:700}
</style></head><body><canvas id="c" width="2160" height="2700"></canvas><span class="f1">a</span><span class="f2">a</span><span class="f3">a</span>
<script>
const W = 1080, H = 1350, K = 2, A = ${JSON.stringify(A)}, BR = ${JSON.stringify(BR)}, COUNT = ${JSON.stringify(COUNT)}, BTC = ${JSON.stringify(btc)};
const INK = '#0B0E11', CREAM = '#F1EDE2', LIME = '#B8F26A', GREEN = '#7EC25A', RED = '#E5484D';
const c = document.getElementById('c'), x = c.getContext('2d'); x.scale(K, K);
const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), seg = (t, a, b) => cl((t - a) / (b - a)), mix = (a, b, u) => a + (b - a) * u;
const io = (u) => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, oc = (u) => 1 - Math.pow(1 - u, 3), ob = (u) => 1 + 2.4 * Math.pow(u - 1, 3) + 1.4 * Math.pow(u - 1, 2);
const st = (t, f = 12) => Math.floor(t * f) / f;                // stop-motion time (12 fps) for collage pieces
const rnd = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const jit = (t, i, a = 2) => (rnd(Math.floor(t * 12) * 7 + i) - .5) * a;   // small 12 fps paper jitter

// ---------- image cache ----------
const cache = new Map();
const img = (src) => { if (!cache.has(src)) cache.set(src, new Promise((r) => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = src; })); return cache.get(src); };
const frame = (name, t, speed = 1) => { const n = COUNT[name]; const i = Math.min(n, Math.max(1, Math.floor(t * 30 * speed) + 1)); return A + name + '/' + String(i).padStart(4, '0') + '.jpg'; };

// ---------- WebGL halftone ----------
const gc = document.createElement('canvas'), gl = gc.getContext('webgl', {preserveDrawingBuffer: true, premultipliedAlpha: false});
const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const fs = \`precision highp float;uniform sampler2D tx;uniform vec2 res;uniform vec4 crop;uniform float cell,ang,con,bri,inv;uniform vec3 ink,pap;
float lum(vec2 fc){vec2 uv=fc/res;uv.y=1.-uv.y;vec2 s=mix(crop.xy,crop.zw,uv);return texture2D(tx,s).r;}
void main(){vec2 fc=gl_FragCoord.xy;mat2 R=mat2(cos(ang),-sin(ang),sin(ang),cos(ang));mat2 Ri=mat2(cos(ang),sin(ang),-sin(ang),cos(ang));vec2 q=R*fc;vec2 cc=(floor(q/cell)+.5)*cell;
 float l=clamp((lum(Ri*cc)-.5)*con+.5+bri,0.,1.);float d=inv>.5?l:1.-l;float r=cell*.5*sqrt(d)*1.42;float dist=length(q-cc);
 float a=smoothstep(r+.8,r-.8,dist);gl_FragColor=vec4(mix(pap,ink,a),1.);}\`;
const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(o); return o; };
const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr); gl.useProgram(pr);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
const lp = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
[gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((p) => gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE));
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
const U = (n) => gl.getUniformLocation(pr, n);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
// draw image im halftoned into rect (dx,dy,dw,dh) on the main canvas. zoom >= 1, pan in [-1,1].
function ht(im, dx, dy, dw, dh, o = {}) {
  if (!im) return; const {zoom = 1, px = 0, py = 0, cell = 4.2, ink = INK, pap = CREAM, inv = 0, con = 1.5, bri = 0, ang = .6, src} = o;
  const pw = Math.round(dw * K), ph = Math.round(dh * K); gc.width = pw; gc.height = ph; gl.viewport(0, 0, pw, ph);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
  const [sx0, sy0, sx1, sy1] = src || [0, 0, im.width, im.height], sw = sx1 - sx0, sh2 = sy1 - sy0;
  let cw = sw, ch = sw * dh / dw; if (ch > sh2) { ch = sh2; cw = sh2 * dw / dh; } cw /= zoom; ch /= zoom;
  const cx = sx0 + sw / 2 + px * (sw - cw) / 2, cy = sy0 + sh2 / 2 + py * (sh2 - ch) / 2;
  gl.uniform4f(U('crop'), (cx - cw / 2) / im.width, (cy - ch / 2) / im.height, (cx + cw / 2) / im.width, (cy + ch / 2) / im.height);
  gl.uniform2f(U('res'), pw, ph); gl.uniform1f(U('cell'), cell * K); gl.uniform1f(U('ang'), ang); gl.uniform1f(U('con'), con); gl.uniform1f(U('bri'), bri); gl.uniform1f(U('inv'), inv);
  gl.uniform3fv(U('ink'), hex(ink)); gl.uniform3fv(U('pap'), hex(pap));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); x.drawImage(gc, dx, dy, dw, dh);
}

// ---------- paper plane (banknote texture mapped onto 3 triangles) ----------
let billC = null;
async function prepBill() {
  const b = await img(A + 'bill.png'); billC = document.createElement('canvas'); billC.width = 1164; billC.height = 518;
  const s = x; const tmp = document.createElement('canvas'); tmp.width = 1164; tmp.height = 518;
  // halftone the bill into its own canvas (finer cell)
  const keep = [c.width, c.height]; const bx = tmp.getContext('2d');
  const pw = 1164, ph = 518; gc.width = pw; gc.height = ph; gl.viewport(0, 0, pw, ph); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, b);
  gl.uniform4f(U('crop'), 8 / 640, 203 / 480, 590 / 640, 462 / 480); gl.uniform2f(U('res'), pw, ph); gl.uniform1f(U('cell'), 5.2); gl.uniform1f(U('ang'), .6);
  gl.uniform1f(U('con'), 1.25); gl.uniform1f(U('bri'), .05); gl.uniform1f(U('inv'), 0); gl.uniform3fv(U('ink'), hex('#1A1D1F')); gl.uniform3fv(U('pap'), hex('#F4F1E8'));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); billC.getContext('2d').drawImage(gc, 0, 0);
}
function tri(s, d, shade) {   // affine-map a source triangle of the bill onto a destination triangle
  const [[x0, y0], [x1, y1], [x2, y2]] = s, [[u0, v0], [u1, v1], [u2, v2]] = d;
  x.save(); x.beginPath(); x.moveTo(u0, v0); x.lineTo(u1, v1); x.lineTo(u2, v2); x.closePath(); x.clip();
  const den = x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1);
  const a = (u0 * (y1 - y2) + u1 * (y2 - y0) + u2 * (y0 - y1)) / den, b2 = (v0 * (y1 - y2) + v1 * (y2 - y0) + v2 * (y0 - y1)) / den;
  const cc = (u0 * (x2 - x1) + u1 * (x0 - x2) + u2 * (x1 - x0)) / den, dd = (v0 * (x2 - x1) + v1 * (x0 - x2) + v2 * (x1 - x0)) / den;
  const e = (u0 * (x1 * y2 - x2 * y1) + u1 * (x2 * y0 - x0 * y2) + u2 * (x0 * y1 - x1 * y0)) / den, f = (v0 * (x1 * y2 - x2 * y1) + v1 * (x2 * y0 - x0 * y2) + v2 * (x0 * y1 - x1 * y0)) / den;
  x.transform(a, b2, cc, dd, e, f); x.drawImage(billC, 0, 0); x.restore();
  if (shade) { x.save(); x.beginPath(); x.moveTo(u0, v0); x.lineTo(u1, v1); x.lineTo(u2, v2); x.closePath(); x.fillStyle = shade; x.fill(); x.restore(); }
}
// plane at (px,py), heading angle a (radians, 0 = pointing right), length L, bank b in [-1,1] (flattens the wings)
function plane(px, py, a, L, b = 0, shadow = true) {
  const BW = 1164, BH = 518, ca = Math.cos(a), sa = Math.sin(a), w = 0.42 * (1 - Math.abs(b) * .45);
  const P = (u, v) => [px + (u * ca - v * sa) * L, py + (u * sa + v * ca) * L];
  const N = P(.55, 0), Lw = P(-.45, -w), Rw = P(-.45, w * .72), C = P(-.38, -.02), Kl = P(-.32, .1);
  if (shadow) { x.save(); x.globalAlpha = .28; x.fillStyle = '#000'; x.beginPath(); const o = L * .06; [N, Lw, C, Rw].forEach(([u, v], i) => (i ? x.lineTo(u + o, v + o * 1.4) : x.moveTo(u + o, v + o * 1.4))); x.fill(); x.restore(); }
  tri([[BW, BH / 2], [0, 0], [0, BH / 2]], [N, Lw, C], null);
  tri([[BW, BH / 2], [0, BH / 2], [0, BH]], [N, C, Rw], 'rgba(0,0,0,.10)');
  tri([[BW, BH * .45], [0, BH * .4], [0, BH * .62]], [N, C, Kl], 'rgba(0,0,0,.32)');
  x.save(); x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(...N); x.lineTo(...C); x.stroke(); x.restore();
}

// ---------- type and pieces ----------
const T = (s, px, py, size, o = {}) => { const {f = 'serif', color = CREAM, align = 'left', ls = 0, a = 1} = o;
  x.save(); x.globalAlpha = a; x.fillStyle = color; x.textAlign = align; x.textBaseline = 'alphabetic';
  x.font = f === 'serif' ? \`800 \${size}px 'Inter Tight'\` : f === 'sans' ? \`800 \${size}px 'Inter Tight'\` : \`700 \${size}px 'JetBrains Mono'\`;
  x.letterSpacing = (ls || (f === 'mono' ? 0 : -size * .035)) + 'px'; x.fillText(s, px, py); x.restore(); };
const rect = (px, py, w, h, col, rot = 0) => { x.save(); x.translate(px + w / 2, py + h / 2); x.rotate(rot); x.fillStyle = col; x.fillRect(-w / 2, -h / 2, w, h); x.restore(); };
const label = (s, px, py, size, bg, fg, rot, t, i, pad = .28) => {   // text on a cut-paper label, pops in at 12 fps
  x.save(); x.font = \`800 \${size}px 'Inter Tight'\`; x.letterSpacing = -size * .035 + 'px'; const w = x.measureText(s).width + size * pad * 2, h = size * 1.12;
  x.translate(px + jit(t, i, 3), py + jit(t, i + 9, 3)); x.rotate(rot); x.fillStyle = bg; x.fillRect(0, -h * .78, w, h); T(s, size * pad, 0, size, {color: fg}); x.restore(); };
function strip(words, px, py, w, h, rot, t, speed, size = 64, col = CREAM, bg = INK) {   // scrolling italic word rows inside a panel
  x.save(); x.beginPath(); x.rect(px, py, w, h); x.clip(); x.fillStyle = bg; x.fillRect(px, py, w, h);
  x.translate(px + w / 2, py + h / 2); x.rotate(rot); const lh = size * 1.45, rows = Math.ceil(h / lh) + 4, line = words.join('  *  ') + '  *  ';
  x.font = \`800 \${size}px 'Inter Tight'\`; x.letterSpacing = -size * .035 + 'px'; const lw = x.measureText(line).width;
  for (let r = -rows / 2; r < rows / 2; r++) { const off = ((t * speed * (r % 2 ? 1 : -.7) + r * 237) % lw + lw) % lw;
    for (let k = -2; k < 3; k++) T(line, -w + k * lw - off, r * lh, size, {color: col}); }
  x.restore(); }
const lines = (px, py, w, h, a = 1) => { x.save(); x.globalAlpha = a; x.strokeStyle = '#fff'; x.lineWidth = 2; x.strokeRect(px, py, w, h); x.restore(); };
let grains = [];
function makeGrain() { for (let g = 0; g < 4; g++) { const n = document.createElement('canvas'); n.width = 540; n.height = 675; const nx = n.getContext('2d'), id = nx.createImageData(540, 675);
  for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } nx.putImageData(id, 0, 0); grains.push(n); } }
const grain = (t) => { x.save(); x.globalAlpha = .075; x.globalCompositeOperation = 'overlay'; x.drawImage(grains[Math.floor(t * 12) % 4], 0, 0, W, H); x.restore(); };

// BTC daily chart on a cream card
function chart(px, py, w, h, prog) {
  const lo = 64000, hi = 90000, n = BTC.length, X = (i) => px + 40 + (i / (n - 1)) * (w - 80), Y = (v) => py + h - 60 - ((v - lo) / (hi - lo)) * (h - 190);
  x.save(); x.fillStyle = CREAM; x.fillRect(px, py, w, h); T('BTC · LAST 75 DAYS', px + 40, py + 62, 24, {f: 'mono', color: INK, ls: 2});
  x.strokeStyle = 'rgba(11,14,17,.12)'; x.lineWidth = 1.5; [70000, 80000, 90000].forEach((v) => { x.beginPath(); x.moveTo(px + 40, Y(v)); x.lineTo(px + w - 40, Y(v)); x.stroke(); T('$' + v / 1000 + 'K', px + w - 40, Y(v) - 8, 18, {f: 'mono', color: 'rgba(11,14,17,.45)', align: 'right'}); });
  const m = Math.max(2, Math.floor(n * prog)); x.strokeStyle = INK; x.lineWidth = 4.5; x.lineJoin = 'round'; x.beginPath();
  for (let i = 0; i < m; i++) i ? x.lineTo(X(i), Y(BTC[i])) : x.moveTo(X(i), Y(BTC[i])); x.stroke();
  const pk = BTC.indexOf(Math.max(...BTC)); if (m > pk) { x.fillStyle = INK; x.beginPath(); x.arc(X(pk), Y(BTC[pk]), 8, 0, 7); x.fill(); }
  if (prog >= 1) { x.fillStyle = RED; x.beginPath(); x.arc(X(n - 1), Y(BTC[n - 1]), 11, 0, 7); x.fill(); }
  x.restore(); }

// ---------- the timeline ----------
const W1 = ['panic', 'sell-off', 'red candles', 'fear', 'margin calls', 'liquidations'];
const W2 = ['opportunity', 'patience', 'a plan', 'discipline', 'a better entry'];
// quick drops (peak to low): Binance daily (crypto, Nov 14, 2026), Yahoo Finance daily (stocks)
const DROPS = [['ETHEREUM', '-33.1%', 'SEP 21 → NOV 14'], ['SOLANA', '-40.1%', 'SEP 27 → NOV 14'], ['XRP', '-40.9%', 'SEP 23 → NOV 14'],
  ['NVIDIA', '-38.9%', 'OCT 6 → NOV 12'], ['NASDAQ', '-12.5%', 'OCT 6 → NOV 5']];
const DROP_POS = [[790, 330, .04], [290, 610, -.03], [790, 830, .03], [290, 1060, -.04], [790, 1180, .02]];
const dropCard = (d, cx, cy, rot, p) => { x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(p * .9, p * .9); rect(-250, -120, 500, 240, CREAM);
  T(d[0], -215, -55, 22, {f: 'mono', color: INK, ls: 3}); T(d[1], -220, 50, 108, {f: 'sans', color: RED}); T(d[2], -215, 94, 18, {f: 'mono', color: 'rgba(11,14,17,.6)', ls: 2}); x.restore(); };
// the V: plane dives to the bottom and climbs out
const VX0 = -160, VY0 = 560, VBX = 540, VBY = 1090, VX1 = 1240, VY1 = 470, VB = 16.0;
const vpos = (t) => { if (t < VB) { const u = io(seg(t, 14.9, VB)); return [mix(VX0, VBX, u), mix(VY0, VBY, Math.pow(u, .8)), mix(.55, 1.0, u)]; }
  const u = seg(t, VB, 18.9), e = u * .55 + oc(u) * .45; return [mix(VBX, VX1, e), mix(VBY, VY1, Math.pow(e, .85)), .8]; };
let logoW = null;
window.draw = async (t) => {
  const at = (name, t0, sp = 1) => frame(name, Math.max(0, t - t0), sp);
  const F = {street: at('street', 0, .8), floor: at('floor', 3.2), brokers: at('brokers', 6.0, 1.1), clock: at('clock', 6.7, .45), crowd: at('floor2', 8.6, .8),
    press: at('press', 13.2), money: at('money', 19.2), hands: at('hands', 21.2, .9)};
  const im = {}; await Promise.all(Object.entries(F).map(async ([k, s]) => { im[k] = await img(s); }));
  x.clearRect(0, 0, W, H);

  if (t < 3.45) {                               // S1 red collage opener
    const e = io(seg(t, 2.9, 3.45));
    rect(0, 0, W, H, RED);
    x.save(); x.globalAlpha = 1 - e; strip(W1, 70 + jit(t, 1), 250, 600, 820, -.12, t, 40, 58); x.restore();
    const bx = mix(600, 0, e), by = mix(150, 0, e), bw = mix(410, W, e), bh = mix(830, H, e);
    rect(bx, by, bw, bh, CREAM); ht(im.street, bx + mix(26, 0, e), by + mix(26, 0, e), bw - mix(52, 0, e), bh - mix(52, 0, e), {zoom: 1.05 + t * .03, ink: INK, pap: CREAM, con: 1.5, bri: .15, cell: 4.4});
    x.save(); x.globalAlpha = 1 - e; rect(470 + jit(t, 3), 1000, 560, 120, '#fff'); T('MARKET NOTES · NOV 2026', 506, 1074, 24, {f: 'mono', color: INK, ls: 3}); x.drawImage(logoW, 72, 72, 236, 42); x.restore();
    const u = oc(seg(t, .15, 2.9)); plane(mix(-180, 820, u), mix(520, 820, u) + Math.sin(t * 3) * 12, .32 + Math.sin(t * 2.2) * .05, 420, 0);
  } else if (t < 6.0) {                         // S2 trading floor
    ht(im.floor, 0, 0, W, H, {zoom: 1.05 + (t - 3.2) * .035, ink: CREAM, pap: INK, inv: 1, con: 1.6, cell: 4.6});
    lines(250, 455, 580, 440, oc(seg(t, 3.5, 4.0)));
    if (t > 3.8) label('When markets', 92, 700, 96, RED, CREAM, -.04, t, 1);
    if (t > 4.4) label('fall,', 560, 830, 96, CREAM, INK, .03, t, 2);
    T('NYSE FLOOR · 1932', 72, 1278, 20, {f: 'mono', color: CREAM, ls: 3, a: .8});
  } else if (t < 8.6) {                         // S3 brokers rushing + clock card
    ht(im.brokers, 0, 0, W, H, {zoom: 1.12 - (t - 6.0) * .02, px: -.3, ink: CREAM, pap: INK, inv: 1, con: 1.6, cell: 4.6});
    if (t > 6.7) { const p = ob(seg(st(t), 6.7, 7.1)); x.save(); x.translate(800, 380); x.rotate(.06); x.scale(p, p); rect(-190, -190, 380, 380, CREAM); ht(im.clock, -172, -172, 344, 344, {ink: INK, pap: CREAM, con: 1.8, cell: 3.6, zoom: 1.25}); x.restore(); }
    if (t > 7.3) label('panic spreads.', 90, 1060, 96, RED, CREAM, -.03, t, 4);
    lines(60, 60, W - 120, H - 120, .55);
  } else if (t < 13.2) {                        // S4 money drops: falling planes, BTC, then quick drops slam in
    ht(im.crowd, 0, 0, W, H, {zoom: 1.1, ink: CREAM, pap: INK, inv: 1, con: 1.4, bri: -.12, cell: 4.6});
    x.save(); x.globalAlpha = .28 * seg(t, 8.6, 9.0); rect(0, 0, W, H, RED); x.restore();
    for (let i = 0; i < 6; i++) { const s = t - 8.6 - i * .26; if (s < 0) continue; const y = -200 + s * (420 + i * 60) + s * s * 110;
      plane(120 + i * 170 + Math.sin(s * 2 + i) * 30, y, 1.25 + Math.sin(s * 3 + i) * .25, 200 + (i % 3) * 60, Math.sin(s * 4 + i) * .6); }
    const bOut = seg(t, 10.0, 10.25);
    if (t > 8.9 && bOut < 1) { const p = ob(seg(st(t), 8.9, 9.3)) * (1 - bOut * .45); x.save(); x.translate(540 - bOut * 250, 700 - bOut * 440); x.rotate(-.025); x.scale(p, p);
      rect(-400, -250, 800, 470, CREAM); T('BITCOIN', -350, -170, 26, {f: 'mono', color: INK, ls: 4});
      T('-24.0%', -360, 20, 200, {f: 'sans', color: RED}); T('$87,396 → $66,456', -352, 110, 34, {f: 'mono', color: INK});
      T('SEP 21 → NOV 14, 2026', -352, 170, 24, {f: 'mono', color: 'rgba(11,14,17,.6)', ls: 2}); x.restore(); }
    if (bOut >= 1) { x.save(); x.translate(290, 260); x.rotate(-.04); x.scale(.55, .55); rect(-400, -250, 800, 470, CREAM); T('BITCOIN', -350, -170, 26, {f: 'mono', color: INK, ls: 4}); T('-24.0%', -360, 20, 200, {f: 'sans', color: RED}); x.restore(); }
    DROPS.forEach((d, k) => { const t0 = 10.25 + k * .5; if (t < t0) return; const [cx, cy, r] = DROP_POS[k]; dropCard(d, cx + jit(t, k * 3, 2), cy, r, ob(seg(st(t, 15), t0, t0 + .22))); });
  } else if (t < 14.9) {                        // S5 BTC chart over the presses
    ht(im.press, 0, 0, W, H, {zoom: 1.08 + (t - 13.2) * .03, ink: CREAM, pap: INK, inv: 1, con: 1.5, cell: 4.6});
    const p = ob(seg(st(t), 13.25, 13.6)); x.save(); x.translate(540 + jit(t, 5), 640); x.rotate(.02); x.scale(p, p); chart(-430, -300, 860, 560, io(seg(t, 13.4, 14.5))); x.restore();
  } else if (t < 19.2) {                        // S6 THE V: red dive to the bottom, lime bursts out of it, plane climbs
    rect(0, 0, W, H, RED);
    const lr = io(seg(t, VB, VB + .7)) * 1900; if (lr > 0) { x.save(); x.fillStyle = LIME; x.beginPath(); x.arc(VBX, VBY, lr, 0, 7); x.fill(); x.restore(); }
    // trail: the path the plane has flown, drawn like a chart line (down in cream on red, up in ink on lime)
    x.save(); x.lineWidth = 9; x.lineCap = 'round'; x.lineJoin = 'round';
    const pts = []; for (let k = 14.9; k <= Math.min(t, 18.9); k += 1 / 60) pts.push(vpos(k));
    const down = pts.filter((_, k) => 14.9 + k / 60 <= VB), up = pts.filter((_, k) => 14.9 + k / 60 >= VB);
    x.strokeStyle = t < VB + .3 ? CREAM : INK; x.beginPath(); down.forEach(([a, b], k) => (k ? x.lineTo(a, b) : x.moveTo(a, b))); x.stroke();
    x.strokeStyle = INK; x.beginPath(); up.forEach(([a, b], k) => (k ? x.lineTo(a, b) : x.moveTo(a, b))); x.stroke(); x.restore();
    if (t > VB - .05) { const q = 1 - seg(t, VB, VB + .45); x.save(); x.strokeStyle = INK; x.lineWidth = 4; x.globalAlpha = q; x.beginPath(); x.arc(VBX, VBY, 30 + (1 - q) * 160, 0, 7); x.stroke(); x.restore(); }
    const [px, py, sc] = vpos(Math.min(t, 18.9)); const ang = t < VB ? .95 : mix(.95, -.78, io(seg(t, VB, VB + .45)));
    const shake = t > VB && t < VB + .25 ? (rnd(Math.floor(t * 30)) - .5) * 14 : 0;
    if (t < 18.9) plane(px + shake, py + shake * .6, ang, 460 * sc, Math.sin(t * 3) * .15);
    if (t < VB) T('-24%  -33%  -40%  -39%', 72, 320, 70, {f: 'sans', color: CREAM, a: .9 * seg(t, 14.95, 15.2)});
    if (t > 16.7) T('But every fall', 72, 300, 92, {color: INK});
    if (t > 17.3) T('makes room for', 72, 410, 92, {color: INK});
  } else if (t < 23.4) {                        // S7 money printing, opportunity
    ht(im.money, 0, 0, W, H, {zoom: 1.1 + (t - 19.2) * .03, ink: CREAM, pap: INK, inv: 1, con: 1.4, cell: 4.6});
    if (t > 21.2) { const p = ob(seg(st(t), 21.2, 21.6)); x.save(); x.translate(800, 340); x.rotate(.05); x.scale(p, p); rect(-210, -170, 420, 340, LIME); ht(im.hands, -190, -150, 380, 300, {ink: INK, pap: LIME, con: 1.6, cell: 3.8}); x.restore(); }
    strip(W2, 0, 880, W, 150, 0, t, 70, 48, LIME, INK);
    lines(150, 560, 780, 240, oc(seg(t, 19.4, 19.8)));
    if (t > 19.7) { rect(150, 560, 780, 240, INK); lines(162, 572, 756, 216, 1); T('opportunity.', 540, 712, 112, {align: 'center', color: LIME}); }
  } else {                                      // S8 end card
    rect(0, 0, W, H, INK);
    const p = oc(seg(t, 23.4, 24.0));
    rect(580 + jit(t, 7), mix(-900, 540, p), 420, 520, LIME); ht(im.hands, 604, mix(-876, 564, p), 372, 472, {ink: INK, pap: LIME, con: 1.6, cell: 4, zoom: 1.2});
    x.save(); x.globalAlpha = oc(seg(t, 23.7, 24.3)); strip(['markets move', 'stay ready', 'markets move', 'stay ready'], 72, 560, 460, 500, -.12, t, 30, 40); x.restore();
    if (t > 24.1) T('Markets move.', 72, 300, 100, {color: CREAM});
    if (t > 24.6) T('Be ready.', 72, 410, 100, {color: LIME});
    const lp = oc(seg(t, 25.2, 25.8)); x.save(); x.globalAlpha = lp; rect(470, 1130, 560, 120, '#fff'); T('hotcoin.com', 506, 1208, 44, {f: 'mono', color: INK}); x.drawImage(logoW, 72, 1160, 300, 54); x.restore();
    const u = oc(seg(t, 23.5, 25.4)); plane(mix(-200, 700, u), mix(1150, 560, u) + Math.sin(t * 2.5) * 10, mix(-.6, -.25, u), 330, 0);
  }
  grain(t);
  return true;
};
window.init = async () => { await document.fonts.load("800 64px 'Inter Tight'"); await document.fonts.load("700 24px 'JetBrains Mono'");
  logoW = await img(BR + 'logo-mono-white.png'); await prepBill(); makeGrain(); return true; };
</script></body></html>`;

const mode = process.argv[2] || 'sheet';
fs.mkdirSync(DIR + '/out', {recursive: true});
const f = DIR + '/_page.html'; fs.writeFileSync(f, html);
const browser = await chromium.launch({args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--allow-file-access-from-files', '--disable-web-security']});
const pg = await (await browser.newContext({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 1})).newPage();
pg.on('pageerror', (e) => console.error('page error', e.message));
await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => window.init());
const shot = async () => Buffer.from((await pg.evaluate(() => document.getElementById('c').toDataURL('image/jpeg', .93))).split(',')[1], 'base64');
if (mode === 'sheet') {
  const ts = (process.argv[3] || '1.5,4.8,7.6,9.6,10.6,12.9,14.2,15.5,16.2,17.8,20.4,26').split(',').map(Number);
  for (const t of ts) { await pg.evaluate((v) => window.draw(v), t); fs.writeFileSync(`${DIR}/out/s-${t}.jpg`, await shot()); }
} else {
  const [a0, a1] = mode === 'range' ? process.argv[3].split(',').map(Number) : [0, DUR], out = mode === 'range' ? 'part.mp4' : 'silent.mp4';
  const ff = spawn('/usr/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-vf', 'scale=1080:1350:flags=lanczos',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', `${DIR}/out/${out}`], {stdio: ['pipe', 'inherit', 'inherit']});
  for (let i = Math.round(a0 * FPS); i < Math.round(a1 * FPS); i++) { await pg.evaluate((v) => window.draw(v), i / FPS); const b = await shot(); if (!ff.stdin.write(b)) await new Promise((r) => ff.stdin.once('drain', r)); if (i % 60 === 0) console.log('frame', i); }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
}
await browser.close(); fs.unlinkSync(f); console.log('done', mode);
