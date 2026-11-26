// Hotcoin dot 3D runner test. Deterministic: everything is a function of t via window.setT(t).
// Original world (procedural night city), Hotcoin marks only from official files:
//   rings: hotcoin-tradfi/public/brand/symbol-official-white.png
//   ending: brand-kit/logo/hotcoin-logo-white.svg with its green dot path hidden (the mascot lands there),
//           then hotcoin-tradfi/public/brand/logo-official-white.png crossfades in (the exact mark).
// URL params: w, h (frame size), arms=1 (add stubby arms; off by default per the character board).
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {Reflector} from 'three/addons/objects/Reflector.js';

const P = new URLSearchParams(location.search);
const W = +P.get('w') || 1080, H = +P.get('h') || 1350, ASPECT = W / H, ARMS = P.get('arms') === '1';
const TALL = ASPECT < 0.7; // 9:16 cut
// v2 (?v=2): speed aura, afterimages, cheeky butt gag on the rooftop, smoothed camera; beat grid of the hip-hop score
const VER = +(P.get('v') || 1), V2 = VER >= 2, INK = VER >= 3; // v3: ink palette (#0B0E11 world, white + lime light only), lens pass
const MB = +P.get('mb') || 1; // motion-blur sub-frames per frame
const STYLE = P.get('style') || ''; // ink painting looks: shuimo | guofeng | nightink (post-process on the same 3D scene)
const BEAT = 60 / 92.75, DROP = 2.95 + 16 * BEAT; // drop lands on the rooftop landing (13.30 s)
const DUR = 20;

// ---------- helpers ----------
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => cl((t - a) / (b - a));
const sm = (v) => { v = cl(v); return v * v * (3 - 2 * v); };
const ease = (v) => { v = cl(v); return v < .5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };
const eo = (v) => 1 - Math.pow(1 - cl(v), 3);
const ei = (v) => Math.pow(cl(v), 3);
const lerp = (a, b, k) => a + (b - a) * k;
const bump = (t, a, b) => Math.sin(Math.PI * seg(t, a, b)); // 0..1..0
let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
function mono(keys) { // monotone cubic interpolation (no overshoot)
  const n = keys.length, xs = keys.map((k) => k[0]), ys = keys.map((k) => k[1]), d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0;
    else { const h0 = xs[i] - xs[i - 1], h1 = xs[i + 1] - xs[i], w1 = 2 * h1 + h0, w2 = h1 + 2 * h0; m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]); }
  }
  return (t) => {
    if (t <= xs[0]) return ys[0]; if (t >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (t > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], s = (t - xs[i]) / h, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * ys[i] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * ys[i + 1] + (s3 - s2) * h * m[i + 1];
  };
}
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function ctex(c, srgb = true) { const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }

// ---------- colours ----------
const LIME = new THREE.Color('#B8F26A'), GREEN = new THREE.Color('#7EC25A'), UPC = '#17A86B', DNC = '#E5484D';
const neon = (c, k) => new THREE.Color(c).multiplyScalar(k);

// ---------- path of the dot (feet point) ----------
const RINGS = [5.0, 6.6, 11.2];
function speed(t) {
  if (t < 2.95 || t > 13.9) return 0;
  let v = 16 * eo(seg(t, 2.95, 3.45));
  for (const r of RINGS) if (t > r) v += 9 * Math.exp(-(t - r) / 0.55) * sm(seg(t, r, r + .08));
  if (t > 13.3) v *= 1 - eo(seg(t, 13.3, 13.85));
  return v;
}
const DT = 1 / 600, ZT = [0];
for (let i = 1; i <= (DUR + 1) * 600; i++) { const t = i * DT; ZT.push(ZT[i - 1] - speed(t - DT / 2) * DT); }
const zAt = (t) => { if (t <= 0) return 0; const f = t / DT, i = Math.floor(f); if (i >= ZT.length - 1) return ZT[ZT.length - 1]; return lerp(ZT[i], ZT[i + 1], f - i); };
const WALLX = 13;
const fx = mono([[0, 0], [4.2, 0], [5.0, 0], [5.8, -1.6], [6.6, 0], [7.25, 1.2], [7.65, 7], [7.95, WALLX], [9.3, WALLX], [9.55, 9], [9.85, 3], [10.2, -3.3], [10.65, -2.4], [11.2, 0], [20, 0]]);
const fy = mono([[0, 0], [7.55, 0], [7.75, 1.0], [7.95, 2.4], [8.6, 4.9], [9.3, 4.3], [9.55, 2.6], [9.85, 0], [12.12, 0], [12.55, 6.0], [12.9, 9.0], [13.05, 9.3], [13.18, 8.6], [13.3, 7], [20, 7]]);
const froll = (t) => (Math.PI / 2) * (sm(seg(t, 7.65, 7.95)) - sm(seg(t, 9.3, 9.62)));
const ROOFY = 7, Z_EDGE = zAt(12.8), Z_LAND = zAt(13.4), Z_T = Z_LAND - 32; // rooftop edge, landing spot, sign tower face
const BODY_H = 1.18; // body centre above the feet
function upAt(t) { const r = froll(t); return V(-Math.sin(r), Math.cos(r), 0); }
const ringHop = (t) => RINGS.reduce((a, r) => a + .85 * bump(t, r - .34, r + .3), 0);
function feetAt(t) { return V(fx(t), fy(t) + ringHop(t), zAt(t)); }

// ending: logo geometry (official SVG viewBox 2005x328, green dot centre (258.5,261), r 59)
const LOGO_W = 24, LOGO_H = LOGO_W * 328 / 2005, LOGO_Y = 31, SIGN_Y = 23.6;
const LOGO_DOT = V(-LOGO_W / 2 + LOGO_W * 258.5 / 2005, LOGO_Y + LOGO_H / 2 - LOGO_H * 261 / 328, Z_T + 0.35);
const DOT_R_LOGO = LOGO_W * 59 / 2005; // world radius of the logo's dot
const CAM_END = V(0, 25.5, Z_T + 40), LOOK_END = V(0, 27.2, Z_T);
// mascot target on the ray from the final camera so its silhouette sits exactly on the logo dot
const toCam = CAM_END.clone().sub(LOGO_DOT).normalize();
const DOT_TARGET = LOGO_DOT.clone().addScaledVector(toCam, DOT_R_LOGO * 1.05);
const SCALE_TARGET = DOT_R_LOGO * (CAM_END.distanceTo(DOT_TARGET) / CAM_END.distanceTo(LOGO_DOT));
const ROOF_SPOT = V(0, ROOFY, Z_LAND);
function wig(t) { return V2 ? sm(seg(t, 13.42, 13.55)) - sm(seg(t, 14.05, 14.2)) : 0; } // rooftop butt wiggle window
const wigS = (t) => Math.sin((t - DROP) / BEAT * 2 * Math.PI);

// body centre in world space at time t (including the ending flight)
function flightK(t) { return seg(t, 16.85, 18.2); }
function centerAt(t) {
  if (t < 16.85) {
    const f = feetAt(t), u = upAt(t);
    let hop = 0;
    if (t > 15.4) hop += 0.5 * bump(t, 15.4, 15.85);
    return f.addScaledVector(u, BODY_H + hop);
  }
  const k = flightK(t), e = ease(k);
  const a = ROOF_SPOT.clone().add(V(0, BODY_H, 0));
  const p = a.clone().lerp(DOT_TARGET, e);
  p.y += 9 * Math.sin(Math.PI * Math.min(1, k * 1.05)) * (1 - k * .35);
  return p;
}

// ---------- renderer ----------
const renderer = new THREE.WebGLRenderer({antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance'});
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const FOG = new THREE.Color(INK ? '#0B0E11' : '#0c1613');
scene.fog = new THREE.FogExp2(FOG, INK ? 0.0105 : 0.0085);
{ const c = canvas(8, 512), g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 512);
  if (INK) { gr.addColorStop(0, '#050607'); gr.addColorStop(.55, '#0A0C0F'); gr.addColorStop(.8, '#14181c'); gr.addColorStop(1, '#0B0E11'); }
  else { gr.addColorStop(0, '#030605'); gr.addColorStop(.5, '#08110e'); gr.addColorStop(.78, '#13241d'); gr.addColorStop(1, '#0c1613'); }
  g.fillStyle = gr; g.fillRect(0, 0, 8, 512); scene.background = ctex(c); }
const camera = new THREE.PerspectiveCamera(50, ASPECT, 0.1, 900);
scene.add(camera);

// environment map: dark room with neon panels, for gloss on the dot, glass and wet roof
const pmrem = new THREE.PMREMGenerator(renderer);
{
  const es = new THREE.Scene();
  es.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.MeshBasicMaterial({color: '#0a1411', side: THREE.BackSide})));
  const pan = (c, k, x, y, z, w, h) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({color: neon(c, k), side: THREE.DoubleSide})); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); };
  pan('#ffffff', 3, -18, 26, 14, 20, 10); pan('#B8F26A', 4, 25, 8, -10, 4, 18); pan('#B8F26A', 3, -25, 6, -16, 3, 14);
  pan(INK ? '#ffffff' : '#cfe9ff', 1.2, 10, 4, 28, 18, 6); pan(INK ? '#ffffff' : '#ffd9a8', 1.2, -30, 3, 5, 10, 4); pan('#7EC25A', 2, 0, -6, -30, 30, 3);
  scene.environment = pmrem.fromScene(es, 0.03).texture;
}
scene.environmentIntensity = 0.9;

// lights (key and rim follow the camera / dot each frame)
const hemi = new THREE.HemisphereLight(INK ? '#e6ebe8' : '#d8f0e0', INK ? '#15181b' : '#1c2a20', 1.15); scene.add(hemi);
const key = new THREE.DirectionalLight('#fffaf0', 2.3); scene.add(key); scene.add(key.target);
const rim = new THREE.PointLight('#B8F26A', 9, 9, 2); scene.add(rim);

// ---------- textures ----------
function windowTex(variant) {
  const s = 512, c = canvas(s, s), g = c.getContext('2d'); seed = 101 + variant * 17;
  g.fillStyle = INK ? '#050608' : '#04070a'; g.fillRect(0, 0, s, s);
  const n = 8, cs = s / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const lit = rnd() < (INK ? (variant === 1 ? .2 : .28) : variant === 1 ? .38 : .5), r = rnd();
    let col = INK ? (lit ? (r < .9 ? `rgba(236,240,238,${.3 + rnd() * .45})` : `rgba(184,242,106,${.55 + rnd() * .35})`) : `rgb(${9 + rnd() * 6},${11 + rnd() * 6},${14 + rnd() * 6})`) : lit ? (r < .55 ? `rgba(255,214,160,${.55 + rnd() * .4})` : r < .9 ? `rgba(205,232,255,${.45 + rnd() * .4})` : `rgba(206,255,170,${.6 + rnd() * .3})`) : `rgb(${10 + rnd() * 8},${16 + rnd() * 8},${20 + rnd() * 10})`;
    g.fillStyle = col; g.fillRect(i * cs + 10, j * cs + 9, cs - 20, cs - 16);
    if (lit && rnd() < .5) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(i * cs + 10, j * cs + 9 + (cs - 16) * .55, cs - 20, (cs - 16) * .45); }
  }
  const t = ctex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
function glassTex() {
  const s = 512, c = canvas(s, s), g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, s, s);
  g.strokeStyle = INK ? 'rgba(225,232,228,.32)' : 'rgba(150,230,200,.55)'; g.lineWidth = 3;
  for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, s); g.stroke(); }
  g.strokeStyle = INK ? 'rgba(225,232,228,.14)' : 'rgba(150,230,200,.28)'; g.lineWidth = 2;
  for (let j = 0; j <= 16; j++) { g.beginPath(); g.moveTo(0, j * 32); g.lineTo(s, j * 32); g.stroke(); }
  seed = 7; for (let k = 0; k < 18; k++) { g.fillStyle = `rgba(230,255,210,${.15 + rnd() * .25})`; g.fillRect(Math.floor(rnd() * 8) * 64 + 3, Math.floor(rnd() * 16) * 32 + 2, 58, 28); }
  const t = ctex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
function sprite() { const c = canvas(64, 64), g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.35, 'rgba(255,255,255,.6)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return ctex(c); }
const SPRITE = sprite();
function blobShadowTex() { const c = canvas(128, 128), g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(0,0,0,.85)'); r.addColorStop(.5, 'rgba(0,0,0,.45)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return ctex(c, false); }

// candlestick chart drawn in code
function drawChart(g, w, h, sd, opts = {}) {
  seed = sd; g.fillStyle = '#050b08'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(126,194,90,.16)'; g.lineWidth = 2;
  for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, h * i / 6); g.lineTo(w, h * i / 6); g.stroke(); }
  const n = opts.n || 18, cw = w / (n + 1); let p = h * (opts.start || .62);
  for (let i = 0; i < n; i++) {
    const drift = opts.bias ?? -.012, mv = (rnd() - .5 + drift * 10) * h * .12, o = p, c = Math.max(h * .08, Math.min(h * .92, p + mv));
    const up = c < o, x = cw * (i + .5) + cw * .2, top = Math.min(o, c), bot = Math.max(o, c);
    g.strokeStyle = g.fillStyle = up ? UPC : DNC; g.lineWidth = Math.max(2, cw * .08);
    g.beginPath(); g.moveTo(x + cw * .3, top - rnd() * h * .05); g.lineTo(x + cw * .3, bot + rnd() * h * .05); g.stroke();
    g.fillRect(x, top, cw * .6, Math.max(3, bot - top)); p = c;
  }
  g.strokeStyle = '#B8F26A'; g.lineWidth = Math.max(6, w * .012); g.strokeRect(g.lineWidth / 2, g.lineWidth / 2, w - g.lineWidth, h - g.lineWidth);
}
// giant board: small candles then one huge green candle that grows (0.2 to 2.2 s)
const giantC = canvas(512, 640), giantG = giantC.getContext('2d'), giantT = ctex(giantC);
function drawGiant(t) {
  const g = giantG, w = 512, h = 640; seed = 404; g.fillStyle = '#050b08'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(126,194,90,.16)'; g.lineWidth = 2;
  for (let i = 1; i < 8; i++) { g.beginPath(); g.moveTo(0, h * i / 8); g.lineTo(w, h * i / 8); g.stroke(); }
  let p = h * .74; const cw = 40;
  for (let i = 0; i < 7; i++) { const mv = (rnd() - .55) * 60, o = p, c = p + mv, up = c < o, x = 26 + i * 44, top = Math.min(o, c), bot = Math.max(o, c);
    g.fillStyle = g.strokeStyle = up ? UPC : DNC; g.lineWidth = 3; g.beginPath(); g.moveTo(x + cw * .3, top - 14); g.lineTo(x + cw * .3, bot + 12); g.stroke(); g.fillRect(x, top, cw * .6, Math.max(4, bot - top)); p = c; }
  const k = eo(seg(t, 0.2, 2.2)), base = p, top = lerp(base - 20, h * .1, k);
  g.fillStyle = g.strokeStyle = UPC; g.lineWidth = 5; g.beginPath(); g.moveTo(400, top - 22); g.lineTo(400, base + 26); g.stroke();
  g.shadowColor = '#2DBD85'; g.shadowBlur = 30; g.fillRect(352, top, 96, base - top); g.shadowBlur = 0;
  g.strokeStyle = '#B8F26A'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10);
  giantT.needsUpdate = true;
}
function neonWordTex(text, vertical, color = '#B8F26A', w = 256, h = 1024) {
  const c = canvas(vertical ? w : h, vertical ? h : w), g = c.getContext('2d');
  g.fillStyle = '#050907'; g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = color; g.lineWidth = 8; g.shadowColor = color; g.shadowBlur = 18; g.strokeRect(10, 10, c.width - 20, c.height - 20);
  g.font = `800 ${vertical ? 170 : 190}px "Inter Tight"`; g.textAlign = 'center'; g.textBaseline = 'middle';
  const draw = (s, x, y) => { g.lineWidth = 14; g.strokeStyle = color; g.shadowBlur = 26; g.strokeText(s, x, y); g.lineWidth = 5; g.strokeStyle = '#fbfff2'; g.shadowBlur = 0; g.strokeText(s, x, y); };
  if (vertical) { const L = [...text], step = (h - 80) / L.length; L.forEach((ch, i) => draw(ch, w / 2, 40 + step * (i + .5))); }
  else draw(text, c.width / 2, c.height / 2 + 8);
  return ctex(c);
}

// ---------- world ----------
const MATS = [0, 1].map((v) => new THREE.MeshStandardMaterial({color: INK ? '#0B0E11' : '#0b1114', roughness: INK ? .5 : .62, metalness: INK ? .5 : .35, emissive: '#ffffff', emissiveMap: windowTex(v), emissiveIntensity: .95}));
const roofDark = new THREE.MeshStandardMaterial({color: '#0a0f0e', roughness: .5, metalness: .3});
const NEON_LIME = new THREE.MeshBasicMaterial({color: neon('#B8F26A', 5)});
const NEON_WHITE = new THREE.MeshBasicMaterial({color: neon('#e9fff0', 3.2)});
function boxGeo(w, h, d, tile = 13) {
  const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv, uo = Math.floor(rnd() * 8) / 8, vo = Math.floor(rnd() * 8) / 8;
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
    const i = f * 4 + k; let u = uv.getX(i), v = uv.getY(i);
    if (f === 2 || f === 3) { u = .002; v = .002; } else { const fw = f < 2 ? d : w; u = uo + u * fw / tile; v = vo + v * h / tile; }
    uv.setXY(i, u, v);
  }
  return g;
}
function building(cx, cz, w, d, h, opts = {}) {
  const m = new THREE.Mesh(boxGeo(w, h, d), opts.mat || MATS[rnd() < .5 ? 0 : 1]);
  m.position.set(cx, h / 2, cz); scene.add(m);
  if (opts.trim ?? rnd() < .4) { // lime roof trim
    const t = new THREE.Mesh(new THREE.BoxGeometry(w + .1, .18, .18), rnd() < .7 ? NEON_LIME : NEON_WHITE); t.position.set(cx, h + .1, cz + d / 2); scene.add(t);
  }
  return m;
}
seed = 5;
const GLASS_Z0 = zAt(7.6) + 4, GLASS_Z1 = zAt(9.5) - 6;
for (const side of [-1, 1]) {
  let z = 70;
  while (z > Z_EDGE + 1) {
    const d = 9 + rnd() * 13, w = 10 + rnd() * 10;
    let z0 = z, z1 = Math.max(z - d, Z_EDGE + 1);
    if (z0 > 6 && z1 < 22) { z = 5; continue; } // cross street behind the start corner
    if (side === 1 && z0 > GLASS_Z1 && z1 < GLASS_Z0) { z = GLASS_Z1 - 1; continue; }
    const h = side === 1 && z0 > -55 && z1 < -28 ? 13 : 18 + rnd() * 50;
    const x0 = 13.5 + rnd() * 1.5;
    building(side * (x0 + w / 2), (z0 + z1) / 2, w, z0 - z1 - .6, h);
    // second row skyline
    if (rnd() < .8) building(side * (x0 + w + 6 + rnd() * 8), (z0 + z1) / 2 - rnd() * 6, 12 + rnd() * 10, 12, 40 + rnd() * 70, {trim: rnd() < .3});
    z = z1 - (rnd() < .3 ? 3 : .4);
  }
}
// far skyline ring
for (let i = 0; i < 70; i++) { const a = rnd() * Math.PI * 2, r = 140 + rnd() * 140; building(Math.cos(a) * r, Z_LAND * .5 + Math.sin(a) * r, 16 + rnd() * 20, 16 + rnd() * 20, 50 + rnd() * 120, {trim: rnd() < .25}); }
// glass tower (wall-run surface at x = WALLX)
{
  const h = 80, w = 18, d = GLASS_Z0 - GLASS_Z1;
  const gt = glassTex(); gt.repeat.set(d / 24, h / 24);
  const glass = new THREE.MeshPhysicalMaterial({color: INK ? '#0B0E11' : '#0a1916', metalness: .95, roughness: .07, emissive: '#ffffff', emissiveMap: gt, emissiveIntensity: .8, envMapIntensity: 1.4});
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), glass); m.position.set(WALLX + w / 2, h / 2, (GLASS_Z0 + GLASS_Z1) / 2); scene.add(m);
  const dimLime = new THREE.MeshBasicMaterial({color: neon('#B8F26A', 2.1)});
  for (const yy of [0.3, h]) { const s = new THREE.Mesh(new THREE.BoxGeometry(.12, .14, d), dimLime); s.position.set(WALLX - .05, yy, m.position.z); scene.add(s); }
}
// rooftop building at the end of the street, and the sign tower behind it
{
  const d = Z_EDGE - (Z_T + 5);
  const rb = new THREE.Mesh(boxGeo(60, ROOFY, d), MATS[0]); rb.position.set(0, ROOFY / 2, Z_EDGE - d / 2); scene.add(rb);
  const roof = new THREE.Mesh(new THREE.PlaneGeometry(60, d), new THREE.MeshStandardMaterial({color: '#0d1312', roughness: .3, metalness: .25, envMapIntensity: 1.1}));
  roof.rotation.x = -Math.PI / 2; roof.position.set(0, ROOFY + .01, Z_EDGE - d / 2); scene.add(roof);
  const lip = new THREE.Mesh(new THREE.BoxGeometry(60, .5, .4), roofDark); lip.position.set(0, ROOFY + .25, Z_EDGE - .2); scene.add(lip);
  const strip = new THREE.Mesh(new THREE.BoxGeometry(60, .12, .12), NEON_LIME); strip.position.set(0, ROOFY + .52, Z_EDGE - .2); scene.add(strip);
  seed = 77;
  for (let i = 0; i < 9; i++) { const ac = new THREE.Mesh(new THREE.BoxGeometry(1.6 + rnd() * 2, 1 + rnd() * 1.2, 1.6 + rnd() * 2), roofDark); const sx = (rnd() < .5 ? -1 : 1) * (6 + rnd() * 20); ac.position.set(sx, ROOFY + .6, Z_EDGE - 4 - rnd() * (d - 8)); scene.add(ac); }
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 3, 20), roofDark); tank.position.set(-14, ROOFY + 3.5, Z_LAND - 6); scene.add(tank);
  for (const lx of [-15, -13]) { const l = new THREE.Mesh(new THREE.BoxGeometry(.15, 2, .15), roofDark); l.position.set(lx, ROOFY + 1, Z_LAND - 6); scene.add(l); }
  // sign tower
  const tw = new THREE.Mesh(boxGeo(40, 42, 24), MATS[1]); tw.position.set(0, 21, Z_T - 12); scene.add(tw);
  for (const xx of [-20.05, 20.05]) { const s = new THREE.Mesh(new THREE.BoxGeometry(.18, 42, .18), NEON_LIME); s.position.set(xx, 21, Z_T + .05); scene.add(s); }
  // low blocks around the tower
  seed = 91; for (let i = 0; i < 14; i++) { const sx = (rnd() < .5 ? -1 : 1) * (24 + rnd() * 30); building(sx, Z_T + 10 - rnd() * 50, 10 + rnd() * 10, 10 + rnd() * 10, 10 + rnd() * 30, {trim: rnd() < .4}); }
}
// sign panel + hotcoin.com neon tubes (off until the reveal)
const signPanel = new THREE.Mesh(new THREE.PlaneGeometry(31, 16.5), new THREE.MeshStandardMaterial({color: '#030605', roughness: .8, metalness: .2}));
signPanel.position.set(0, 27.3, Z_T + .12); scene.add(signPanel);
let signMat, logoNoDotMat, logoFullMat, logoNoDotCanvas, logoNoDotG, logoNoDotImg;

// ground: wet asphalt = planar reflector under a dark asphalt layer with puddle holes
const GROUND_LEN = 70 - Z_EDGE + 10;
const reflector = new Reflector(new THREE.PlaneGeometry(80, GROUND_LEN), {textureWidth: Math.round(W * .5), textureHeight: Math.round(H * .5), color: INK ? '#5e6367' : '#66746f', clipBias: .003});
reflector.rotation.x = -Math.PI / 2; reflector.position.set(0, 0, 70 - GROUND_LEN / 2); scene.add(reflector);
{
  const s = 1024, c = canvas(s, s), g = c.getContext('2d'); seed = 31;
  g.fillStyle = INK ? '#111316' : '#121714'; g.fillRect(0, 0, s, s);
  for (let i = 0; i < 26000; i++) { const v = 12 + rnd() * 22; g.fillStyle = INK ? `rgb(${v},${v + 1},${v + 2})` : `rgb(${v},${v + 3},${v + 1})`; g.fillRect(rnd() * s, rnd() * s, 2, 2); }
  const a = canvas(s, s), ga = a.getContext('2d'); ga.fillStyle = 'rgb(205,205,205)'; ga.fillRect(0, 0, s, s);
  for (let i = 0; i < 38; i++) { const x = rnd() * s, y = rnd() * s, r = 40 + rnd() * 150, gr = ga.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgb(25,25,25)'); gr.addColorStop(.7, 'rgb(60,60,60)'); gr.addColorStop(1, 'rgba(205,205,205,0)'); ga.fillStyle = gr; ga.beginPath(); ga.ellipse(x, y, r, r * (.4 + rnd() * .5), rnd() * 3, 0, 7); ga.fill(); }
  const map = ctex(c), am = ctex(a, false); for (const t of [map, am]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, GROUND_LEN / 40); }
  const asphalt = new THREE.Mesh(new THREE.PlaneGeometry(80, GROUND_LEN), new THREE.MeshStandardMaterial({map, alphaMap: am, transparent: true, roughness: .55, metalness: .1, depthWrite: false}));
  asphalt.rotation.x = -Math.PI / 2; asphalt.position.set(0, .01, reflector.position.z); scene.add(asphalt);
  // lane dashes and the corner crosswalk
  const paint = new THREE.MeshStandardMaterial({color: '#cfd6cf', roughness: .5, transparent: true, opacity: .55, depthWrite: false});
  for (let z = 60; z > Z_EDGE; z -= 9) { const m = new THREE.Mesh(new THREE.PlaneGeometry(.25, 4), paint); m.rotation.x = -Math.PI / 2; m.position.set(0, .02, z); if (z > 4 || z < -3) scene.add(m); }
  for (let i = -8; i <= 8; i += 1.6) { const m = new THREE.Mesh(new THREE.PlaneGeometry(.9, 4.5), paint); m.rotation.x = -Math.PI / 2; m.position.set(i, .02, 4.4); scene.add(m); }
  // sidewalks
  for (const sd of [-1, 1]) { const sw = new THREE.Mesh(new THREE.BoxGeometry(4.5, .22, 70 - Z_EDGE), new THREE.MeshStandardMaterial({color: INK ? '#121417' : '#151b19', roughness: .3, metalness: .1})); sw.position.set(sd * 11.25, .11, (70 + Z_EDGE) / 2); scene.add(sw); }
}
// street lamps
{
  const pole = new THREE.MeshStandardMaterial({color: '#0b0f0e', roughness: .5, metalness: .6});
  for (let z = 52; z > Z_EDGE + 6; z -= 21) for (const sd of [-1, 1]) {
    if (sd === 1 && z < GLASS_Z0 && z > GLASS_Z1) continue;
    const p = new THREE.Mesh(new THREE.CylinderGeometry(.09, .12, 7.5, 8), pole); p.position.set(sd * 10.2, 3.75, z); scene.add(p);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.8, .1, .1), pole); arm.position.set(sd * 9.4, 7.45, z); scene.add(arm);
    const head = new THREE.Mesh(new THREE.BoxGeometry(.9, .12, .35), NEON_WHITE); head.position.set(sd * 8.7, 7.36, z); scene.add(head);
  }
}
// billboards with candle charts and vertical neon blade signs (no real brands)
const giant = new THREE.Mesh(new THREE.PlaneGeometry(13, 16.25), new THREE.MeshBasicMaterial({map: giantT, color: neon('#ffffff', 1.6)}));
giant.position.set(11, 23, -40); giant.lookAt(0, 8, 8); scene.add(giant);
{ const fr = new THREE.Mesh(new THREE.BoxGeometry(13.6, 16.9, .4), roofDark); fr.position.copy(giant.position); fr.quaternion.copy(giant.quaternion); fr.translateZ(-.25); scene.add(fr);
  for (const dx of [-4, 4]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(.4, 10, .4), roofDark); leg.position.set(giant.position.x + dx, 11, giant.position.z - 1); scene.add(leg); } }
const boardSpots = [[-1, -14, 12], [1, -78, 15], [-1, -108, 11], [1, -150, 13], [-1, -190, 16], [-1, -60, 21]];
boardSpots.forEach(([sd, z, y], i) => {
  if (z < Z_EDGE + 8) return;
  const c = canvas(512, 320), g = c.getContext('2d'); drawChart(g, 512, 320, 900 + i * 13, {bias: i % 3 === 2 ? .02 : -.015});
  const m = new THREE.Mesh(new THREE.PlaneGeometry(10, 6.25), new THREE.MeshBasicMaterial({map: ctex(c), color: neon('#ffffff', 1.5)}));
  m.position.set(sd * 13.2, y, z); m.rotation.y = -sd * 0.95; scene.add(m);
});
const WORDS = ['HODL', 'OPEN', '24H', 'GM', 'DOT', '101', 'BUY', 'WAGMI'];
function makeBlades() {
seed = 61;
for (let i = 0; i < 14; i++) {
  const z = 40 - i * ((40 - Z_EDGE - 10) / 13), sd = i % 2 ? 1 : -1;
  if (sd === 1 && z < GLASS_Z0 + 2 && z > GLASS_Z1 - 2) continue;
  const word = WORDS[i % WORDS.length], col = i % 3 === 0 ? '#ffffff' : '#B8F26A';
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5 * Math.max(3, word.length)), new THREE.MeshBasicMaterial({map: neonWordTex(word, true, col, 256, 256 * Math.max(3, word.length)), color: neon('#ffffff', 2.6), side: THREE.DoubleSide}));
  m.position.set(sd * 12.6, 5 + rnd() * 6, z); scene.add(m);
}
}

// ---------- Hotcoin rings (official symbol inside a glowing torus) ----------
const symTex = new THREE.TextureLoader().load('/hotcoin-tradfi/public/brand/symbol-official-white.png'); symTex.colorSpace = THREE.SRGBColorSpace;
const rings = RINGS.map((rt) => {
  const g = new THREE.Group(), c = V(fx(rt), fy(rt) + 2.15, zAt(rt));
  g.position.copy(c);
  const torusMat = new THREE.MeshBasicMaterial({color: neon('#B8F26A', 5)});
  const torus = new THREE.Mesh(new THREE.TorusGeometry(2.05, .11, 12, 64), torusMat); g.add(torus);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(2.05, .32, 8, 64), new THREE.MeshBasicMaterial({color: neon('#B8F26A', .6), transparent: true, opacity: .35, blending: THREE.AdditiveBlending, depthWrite: false})); g.add(halo);
  const symMat = new THREE.MeshBasicMaterial({map: symTex, transparent: true, opacity: .9, depthWrite: false, color: neon('#ffffff', 1.0), side: THREE.DoubleSide});
  const sym = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3), symMat); g.add(sym);
  scene.add(g); return {t: rt, g, torus, torusMat, halo, sym, symMat, c};
});

// ---------- red candle obstacle ----------
const CANDLE_T = 9.95, CANDLE_X = 3.8, CANDLE_Z = zAt(10.22);
const candle = new THREE.Group();
{
  const red = new THREE.MeshStandardMaterial({color: '#4a0a0d', emissive: DNC, emissiveIntensity: .85, roughness: .3});
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.7, 4.6, 1.7), red); body.position.y = 3.5; candle.add(body);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry), new THREE.LineBasicMaterial({color: neon('#ff6a70', 2.4)})); edges.position.y = 3.5; candle.add(edges);
  for (const [y, h] of [[.6, 1.2], [6.8, 1.8]]) { const w = new THREE.Mesh(new THREE.BoxGeometry(.3, h, .3), red); w.position.y = y; candle.add(w); }
  candle.position.set(CANDLE_X, 0, CANDLE_Z); scene.add(candle);
}
const shock = new THREE.Mesh(new THREE.RingGeometry(.8, 1.2, 48), new THREE.MeshBasicMaterial({color: neon(DNC, 3), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false}));
shock.rotation.x = -Math.PI / 2; shock.position.set(CANDLE_X, .05, CANDLE_Z); scene.add(shock);

// ---------- the dot ----------
const dotRoot = new THREE.Group(), yawG = new THREE.Group(), leanG = new THREE.Group(), bodyG = new THREE.Group();
dotRoot.add(yawG); yawG.add(leanG); leanG.add(bodyG); scene.add(dotRoot);
const bodyMat = new THREE.MeshPhysicalMaterial({color: GREEN, roughness: .34, metalness: 0, clearcoat: 1, clearcoatRoughness: .06, emissive: '#2c5a14', emissiveIntensity: .45, envMapIntensity: .8, transparent: true});
const body = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), bodyMat); bodyG.add(body);
const butt = []; // v2 gag: two small cheeks on the lower back (from the front the dot stays a perfect circle)
if (V2) for (const sd of [-1, 1]) { const m = new THREE.Mesh(new THREE.SphereGeometry(.31, 32, 24), bodyMat); m.scale.set(1, .95, .7); m.position.set(sd * .19, -.4, -.84); bodyG.add(m); butt.push(m); }
// eye: flattened ellipsoid with a canvas-drawn face, planar UVs so the drawing maps like the 2D character
const eyeC = canvas(512, 512), eyeG = eyeC.getContext('2d'), eyeT = ctex(eyeC);
const eyeGeo = new THREE.SphereGeometry(1, 64, 48);
{ const p = eyeGeo.attributes.position, uv = eyeGeo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) * .5 + .5, p.getY(i) * .5 + .5); }
const eyeMat = new THREE.MeshPhysicalMaterial({map: eyeT, roughness: .22, clearcoat: 1, clearcoatRoughness: .05, emissive: '#ffffff', emissiveMap: eyeT, emissiveIntensity: .18, envMapIntensity: .6, transparent: true});
const eye = new THREE.Mesh(eyeGeo, eyeMat); eye.scale.set(.56, .62, .3); eye.position.set(0, .03, .755); bodyG.add(eye);
const rimMat = new THREE.MeshPhysicalMaterial({color: '#5f9f3f', roughness: .4, clearcoat: .6, transparent: true});
const eyeRim = {visible: false};
// loop on top (thin arc)
const loopMat = new THREE.MeshPhysicalMaterial({color: '#4f9a30', roughness: .35, clearcoat: 1, transparent: true});
const loop = new THREE.Mesh(new THREE.TorusGeometry(.22, .042, 12, 32, Math.PI), loopMat); loop.position.set(0, .95, 0); bodyG.add(loop);
// legs (and optional arms)
const limbMat = new THREE.MeshPhysicalMaterial({color: '#5a9e38', roughness: .4, clearcoat: .8, transparent: true});
const legs = [-1, 1].map((sd) => { const piv = new THREE.Group(); piv.position.set(sd * .36, -.78, 0); const m = new THREE.Mesh(new THREE.CapsuleGeometry(.13, .2, 6, 14), limbMat); m.position.y = -.22; piv.add(m); bodyG.add(piv); return piv; });
const arms = ARMS ? [-1, 1].map((sd) => { const piv = new THREE.Group(); piv.position.set(sd * .92, .02, 0); const m = new THREE.Mesh(new THREE.CapsuleGeometry(.1, .24, 6, 12), limbMat); m.position.y = -.22; piv.add(m); bodyG.add(piv); return piv; }) : [];
// ---------- v2 speed aura ----------
const AURA_VS = `uniform float uT, uS; varying vec3 vN, vV; varying float vK;
void main(){ vec3 p = position, n = normal; float a = atan(p.x, p.y);
 float f1 = .5 + .5 * sin(a * 6. + uT * 9. + p.z * 4.), f2 = .5 + .5 * sin(a * 11. - uT * 13. + p.y * 3.);
 float back = clamp(-p.z, 0., 1.);
 p += n * (.04 + .1 * f1 * f2 + .22 * back * f1 * uS); p.z -= back * back * uS * 1.7 * (.65 + .35 * f2);
 vK = back; vec4 mv = modelViewMatrix * vec4(p, 1.); vN = normalize(normalMatrix * n); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`;
const AURA_FS = `uniform vec3 uC; uniform float uI, uP; varying vec3 vN, vV; varying float vK;
void main(){ float f = pow(1. - abs(dot(vN, vV)), uP); gl_FragColor = vec4(uC * uI * f * (1. - .45 * vK), 1.); }`;
const auraMats = [], ghosts = [], machs = [];
let auraSparks = null;
const MACH_T = [2.95, 5.0, 6.6, 11.2]; // no shock ring on the rooftop jump: it tilts into the lens
if (V2) {
  for (const [r, pw, col] of [[1.08, 3.0, '#e9ffd0'], [1.24, 2.2, '#B8F26A']]) {
    const m = new THREE.ShaderMaterial({uniforms: {uT: {value: 0}, uS: {value: 0}, uI: {value: 0}, uP: {value: pw}, uC: {value: new THREE.Color(col)}}, vertexShader: AURA_VS, fragmentShader: AURA_FS, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide});
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 64, 40), m); bodyG.add(mesh); auraMats.push(m);
  }
  for (let k = 0; k < 4; k++) { const g = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), new THREE.MeshBasicMaterial({color: neon('#B8F26A', 1.4), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false})); scene.add(g); ghosts.push(g); }
  for (const mt of MACH_T) { const m = new THREE.Mesh(new THREE.RingGeometry(.92, 1.0, 72), new THREE.MeshBasicMaterial({color: neon('#f0ffe0', 3), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide})); scene.add(m); machs.push({t: mt, m}); }
  const AS = 140, ag = new THREE.BufferGeometry();
  ag.setAttribute('position', new THREE.BufferAttribute(new Float32Array(AS * 3), 3)); ag.setAttribute('color', new THREE.BufferAttribute(new Float32Array(AS * 3), 3));
  auraSparks = new THREE.Points(ag, new THREE.PointsMaterial({size: .2, map: SPRITE, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false}));
  auraSparks.frustumCulled = false; scene.add(auraSparks);
}
function auraAmt(t) {
  if (!V2) return 0;
  const run = cl(speed(t) / 16) * .45, charge = .9 * ease(seg(t, 2.3, 2.95)) * (1 - seg(t, 3.6, 4.3)), fly = .75 * (sm(seg(t, 16.85, 17.1)) - sm(seg(t, 18.0, 18.3)));
  return cl(run + (INK ? .3 : .5) * boost(t) + .8 * charge + fly);
}
function updateAura(t, scl) {
  if (!V2) return;
  const a = auraAmt(t), sp = cl(speed(t) / 16);
  auraMats.forEach((m, i) => { m.uniforms.uT.value = t; m.uniforms.uS.value = sp * (.6 + .6 * boost(t)); m.uniforms.uI.value = a * (i ? 1.7 : 1.2) * (.85 + .15 * Math.sin(t * 23 + i)); });
  ghosts.forEach((g, k) => { const tt = Math.max(0, t - .04 * (k + 1)); g.position.copy(centerAt(tt)); g.scale.setScalar(scl); g.material.opacity = .11 * a * sp * (1 - k / 4.5); g.visible = g.material.opacity > .003; });
  machs.forEach(({t: mt, m}) => { const k = seg(t, mt, mt + .42); m.visible = t > mt && k < 1; if (!m.visible) return;
    const p = centerAt(mt), q = centerAt(mt + .03); m.position.copy(p); m.lookAt(q); m.scale.setScalar(1.2 + 4.5 * eo(k)); m.material.opacity = (1 - k) * .9; });
  const pa = auraSparks.geometry.attributes.position.array, ca = auraSparks.geometry.attributes.color.array, AS = pa.length / 3, life = .55;
  for (let i = 0; i < AS; i++) {
    const ph = hash(i * 1.7) * life, cyc = Math.floor((t - ph) / life), t0 = cyc * life + ph, age = t - t0, h1 = hash(i * 3.3 + cyc * 7.1), h2 = hash(i * 5.9 + cyc * 2.3);
    const th = h1 * Math.PI * 2, phi = Math.acos(2 * h2 - 1), dir = V(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th));
    const c0 = centerAt(Math.max(0, t0)), p = c0.addScaledVector(dir, 1.15 * scl + .9 * age).add(V(0, 1.2 * age, 0));
    pa.set([p.x, p.y, p.z], i * 3); const k = 2 * auraAmt(Math.max(0, t0)) * (1 - age / life) * (t0 < 0 ? 0 : 1);
    ca.set([LIME.r * k, LIME.g * k, LIME.b * k], i * 3);
  }
  auraSparks.geometry.attributes.position.needsUpdate = true; auraSparks.geometry.attributes.color.needsUpdate = true;
}
const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({map: blobShadowTex(), transparent: true, depthWrite: false, opacity: .6}));
scene.add(shadow);

function drawEye(st) {
  const g = eyeG, s = 512, c = s / 2, LID = '#7EC25A';
  g.fillStyle = '#fbfff4'; g.fillRect(0, 0, s, s);
  const sh = g.createRadialGradient(c, c * .8, s * .25, c, c, s * .55); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(60,90,40,.22)'); g.fillStyle = sh; g.fillRect(0, 0, s, s);
  const ix = c + st.lx * s * .15, iy = c + st.ly * s * .13, ir = s * .2 * (st.pupil || 1);
  g.fillStyle = '#3b8f2a'; g.beginPath(); g.arc(ix, iy, ir, 0, 7); g.fill();
  g.fillStyle = '#1f5a17'; g.beginPath(); g.arc(ix, iy, ir * .86, 0, 7); g.fill();
  g.fillStyle = '#07120a'; g.beginPath(); g.arc(ix, iy, ir * .7, 0, 7); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(ix - ir * .3, iy - ir * .33, ir * .22, 0, 7); g.fill(); g.beginPath(); g.arc(ix + ir * .25, iy + ir * .22, ir * .1, 0, 7); g.fill();
  g.strokeStyle = 'rgba(70,130,45,.9)'; g.lineWidth = 16; g.beginPath(); g.arc(c, c, s * .468, 0, 7); g.stroke();
  // top lid: closes from the top; "narrow" lowers it with a determined tilt
  const lidY = s * (1 - st.open) + s * .42 * st.narrow * st.open, tilt = st.narrow * s * .08;
  g.fillStyle = LID; g.beginPath(); g.moveTo(-5, -5); g.lineTo(s + 5, -5); g.lineTo(s + 5, lidY - tilt); g.lineTo(-5, lidY + tilt); g.closePath(); g.fill();
  if (st.open < .98 || st.narrow > .02) { g.strokeStyle = '#3c7a26'; g.lineWidth = 9; g.beginPath(); g.moveTo(-5, lidY + tilt); g.lineTo(s + 5, lidY - tilt); g.stroke(); }
  // happy: lower lid rises in a curve
  if (st.happy > .01) { const hy = s * (1 - .38 * st.happy); g.fillStyle = LID; g.beginPath(); g.moveTo(-5, s + 5); g.lineTo(-5, hy + s * .06); g.quadraticCurveTo(c, hy - s * .16 * st.happy, s + 5, hy + s * .06); g.lineTo(s + 5, s + 5); g.fill();
    g.strokeStyle = '#3c7a26'; g.lineWidth = 8; g.beginPath(); g.moveTo(-5, hy + s * .06); g.quadraticCurveTo(c, hy - s * .16 * st.happy, s + 5, hy + s * .06); g.stroke(); }
  // plain: the face fades into the body colour (logo mode)
  if (st.plain > 0) { g.globalAlpha = st.plain; g.fillStyle = LID; g.fillRect(0, 0, s, s); g.globalAlpha = 1; }
  eyeT.needsUpdate = true;
}

// ---------- trail, sparks, speed lines, rain ----------
const TN = 56;
const trailGeo = new THREE.BufferGeometry();
trailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TN * 2 * 3), 3));
trailGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(TN * 2 * 3), 3));
{ const idx = []; for (let i = 0; i < TN - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } trailGeo.setIndex(idx); }
const trail = new THREE.Mesh(trailGeo, new THREE.MeshBasicMaterial({vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false}));
trail.frustumCulled = false; scene.add(trail);
const SPK = 48, sparkGeo = new THREE.BufferGeometry();
sparkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(RINGS.length * SPK * 3), 3));
sparkGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(RINGS.length * SPK * 3), 3));
const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({size: .32, map: SPRITE, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false}));
sparks.frustumCulled = false; scene.add(sparks);
const SL = 44, speedLines = new THREE.InstancedMesh(new THREE.BoxGeometry(.035, .035, 1), new THREE.MeshBasicMaterial({color: neon('#eaffd6', 2.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false}), SL);
speedLines.frustumCulled = false; camera.add(speedLines);
const RN = 2600, rainPos = new Float32Array(RN * 6), rainGeo = new THREE.BufferGeometry();
rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({color: INK ? '#c9cfcc' : '#b9d6c8', transparent: true, opacity: INK ? .32 : .38, depthWrite: false}));
rain.frustumCulled = false; scene.add(rain);

// ---------- post ----------
const rt = new THREE.WebGLRenderTarget(W, H, {type: THREE.HalfFloatType, samples: +P.get('msaa') || 4});
const composer = new EffectComposer(renderer, rt);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), .6, .5, 2.0); composer.addPass(bloom);
composer.addPass(new OutputPass());
// v3 lens: soft vignette, fine grain, chromatic edge that opens up on boosts
const lens = new ShaderPass({uniforms: {tDiffuse: {value: null}, uT: {value: 0}, uAmt: {value: 1}},
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uT, uAmt; varying vec2 vUv;
  void main(){ vec2 d = vUv - .5; float r = dot(d, d); vec2 off = d * r * .012 * uAmt;
   vec3 c = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
   c *= 1. - .5 * smoothstep(.1, .55, r);
   float n = fract(sin(dot(floor(vUv * vec2(${W}., ${H}.)) + uT * 61.7, vec2(12.9898, 78.233))) * 43758.5453);
   gl_FragColor = vec4(c + (n - .5) * .028, 1.); }`});
if (INK) composer.addPass(lens);

// ---------- timeline ----------
function boost(t) { let b = 0; for (const r of RINGS) b += Math.exp(-Math.max(0, t - r) / .5) * sm(seg(t, r - .05, r + .05)); b += .7 * bump(t, 2.95, 3.9) + .6 * bump(t, 12.1, 12.9); return cl(b); }
function yawAt(t) {
  if (t < 0.9) return 2.72 + .06 * Math.sin(t * 2.2);
  if (t < 2.95) return lerp(2.72, 2.95, ease(seg(t, .9, 1.6))) + (Math.PI - 2.95) * ease(seg(t, 2.2, 2.9));
  if (t < 13.5) { // follow the ground direction of travel, capped
    const a = feetAt(t - .03), b = feetAt(t + .03), dx = b.x - a.x, dz = b.z - a.z;
    const off = froll(t) > .3 ? 0 : cl(Math.atan2(dx, -dz) * .6, -.5, .5);
    return Math.PI - off;
  }
  if (t < 16.85) {
    if (!V2) return lerp(Math.PI, 0.32, ease(seg(t, 13.55, 14.35)));
    // lands facing away, wiggles on the beat, smug look back over the shoulder, then turns round
    let y = lerp(Math.PI, 1.35, ease(seg(t, 14.15, 14.42))); y = lerp(y, .32, ease(seg(t, 14.6, 14.95)));
    return y + .16 * wigS(t) * wig(t);
  }
  const k = flightK(t); return lerp(.32, 0, ease(k));
}
// chase-camera spherical offset around the dot
function chase(t) {
  const wall = ease(seg(t, 7.45, 8.05)) - ease(seg(t, 9.05, 9.8)), jump = sm(seg(t, 11.9, 12.5)) - sm(seg(t, 13.2, 13.6)), b = boost(t);
  const dodge = ease(seg(t, 9.0, 9.8)) - ease(seg(t, 10.6, 11.2));
  let az = lerp(lerp(.24, -.45, dodge), -.78, wall), el = lerp(.29, .16, wall), d = lerp(7.2 + 1.8 * dodge, 10.5, wall) + 1.3 * b, fov = 52 + 9 * b;
  el = lerp(el, .42, jump); d = lerp(d, 9.5, jump);
  const look = V(0, lerp(1.0, .4, wall), lerp(-8, -4, wall)); look.y = lerp(look.y, 1.6, jump); look.z = lerp(look.z, -5, jump);
  return {az, el, d, fov, look};
}
const sph = (az, el, d) => V(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d);
function anchorAt(t) { // lagged dot centre for a smooth chase
  const c = centerAt(t); let ax = 0, ay = 0; const N = 8;
  for (let i = 0; i < N; i++) { const p = centerAt(Math.max(0, t - .3 * i / N)); ax += p.x; ay += p.y; }
  return V(ax / N, ay / N, c.z);
}
function camRaw(t) {
  const C0 = V(0, BODY_H, 0);
  // opening: front three-quarter, then orbit round the right side to a low over-the-shoulder shot of the billboard
  const kB = ease(seg(t, .95, 1.85));
  const az0 = lerp(2.72, .05, kB), el0 = lerp(.12, .06, kB) + .015 * Math.sin(t), d0 = lerp(8.4, 8.6, kB) - .5 * seg(t, 0, .95);
  const posA = C0.clone().add(sph(az0, el0, d0)), lookA = C0.clone().add(V(0, .9, 0)).lerp(V(2.2, 5.6, -16), .6 * ease(seg(t, 1.15, 2.4)));
  let fov = lerp(42, 50, kB);
  let pos = posA, look = lookA;
  if (t > 2.9) {
    const ch = chase(t), an = anchorAt(t), w = ease(seg(t, 2.9, 4.0));
    const posC = an.clone().add(sph(ch.az, ch.el, ch.d)), lookC = an.clone().add(ch.look);
    pos = posA.clone().lerp(posC, w); look = lookA.clone().lerp(lookC, w); fov = lerp(fov, ch.fov, w);
  }
  if (t > 13.2) { // landed: swing in for the look at camera
    const w = INK ? ease(seg(t, 13.2, 13.8)) : ease(seg(t, 13.3, 14.4)), D = ROOF_SPOT.clone().add(V(0, BODY_H, 0));
    const posL = D.clone().add(sph(.36, V2 ? .1 : .16, V2 ? 5.0 : 5.4)), lookL = D.clone().add(V(0, V2 ? .08 : .35, 0));
    pos = pos.clone().lerp(posL, w); look = look.clone().lerp(lookL, w); fov = lerp(fov, 44, w);
    // pull back to reveal the sign
    const w2 = ease(seg(t, 15.0, 16.7));
    const posR = V(2.2, 11.2, Z_LAND + 18), lookR = V(0, 17.5, Z_T);
    pos = pos.lerp(posR, w2); look = look.lerp(lookR, w2); fov = lerp(fov, 50, w2);
    // follow the dot home, settle on the logo
    const w3 = ease(seg(t, 16.8, 18.5));
    pos.lerp(CAM_END, w3); look.lerp(LOOK_END, w3); fov = lerp(fov, 50, w3);
  }
  return {pos, look, fov};
}
function camAt(t) {
  let pos, look, fov;
  if (V2) { // weighted average of the recent camera path: removes snaps in the swings
    pos = V(); look = V(); fov = 0; let ws = 0;
    const CK = INK ? 10 : 7, CS = INK ? .032 : .03;
    for (let i = 0; i < CK; i++) { const w = 1 - i / CK, r = camRaw(Math.max(0, t - i * CS)); pos.addScaledVector(r.pos, w); look.addScaledVector(r.look, w); fov += r.fov * w; ws += w; }
    pos.divideScalar(ws); look.divideScalar(ws); fov /= ws;
  } else ({pos, look, fov} = camRaw(t));
  // impact shakes
  const sk = .16 * Math.exp(-Math.max(0, t - CANDLE_T) * 7) * (t > CANDLE_T ? 1 : 0) + .12 * Math.exp(-Math.max(0, t - 13.3) * 8) * (t > 13.3 ? 1 : 0);
  pos.x += sk * Math.sin(t * 91); pos.y += sk * Math.sin(t * 73 + 1);
  if (TALL) fov = 2 * Math.atan(Math.tan(fov * Math.PI / 360) * lerp(1.22, 1.5, ease(seg(t, 15.0, 18.5)))) * 180 / Math.PI;
  return {pos, look, fov};
}
function eyeState(t) {
  const blink = (a, d = .2) => bump(t, a, a + d);
  let open = 1 - Math.max(blink(.5), blink(2.3, .14), blink(6.1, .16), blink(14.7), blink(16.3, .16));
  let lx = .08 * Math.sin(t * 1.3), ly = 0, narrow = 0, happy = 0, plain = 0, pupil = 1;
  const up = ease(seg(t, .95, 1.4)) - ease(seg(t, 2.15, 2.45)); ly = lerp(ly, -.85, up); lx = lerp(lx, .12, up);
  narrow = .38 * (ease(seg(t, 2.3, 2.6)) - ease(seg(t, 13.3, 13.7)));
  const dodge = ease(seg(t, 9.8, 9.95)) - ease(seg(t, 10.45, 10.8)); narrow *= 1 - dodge; lx = lerp(lx, .65, dodge); pupil = 1 - .18 * dodge;
  // at the camera after landing, then a glance back at the sign lighting up, then delighted
  const glance = ease(seg(t, 15.1, 15.3)) - ease(seg(t, 15.7, 15.95)); lx = lerp(lx, .55, glance); ly = lerp(ly, -.45, glance);
  if (V2) { const smug = ease(seg(t, 14.12, 14.3)) - ease(seg(t, 14.62, 14.85)); narrow = lerp(narrow, .42, smug); lx = lerp(lx, -.78, smug); ly = lerp(ly, .05, smug); open = Math.min(open, 1 - bump(t, 14.4, 14.52)); }
  happy = .5 * ease(seg(t, 15.9, 16.3)) * (1 - .6 * bump(t, 16.85, 17.6));
  if (t > 18.2) happy = lerp(happy, .55, ease(seg(t, 18.25, 18.55)));
  plain = ease(seg(t, 18.95, 19.35));
  return {open, lx, ly, narrow, happy, plain, pupil};
}
function bodyState(t) { // squash/stretch, lean, run cycle
  let sx = 1, sy = 1, lean = 0, bob = 0, leg = 0, legTuck = 0;
  const br = 1 + .02 * Math.sin(t * 3.1); sy *= br; sx /= Math.sqrt(br);
  lean -= .28 * (ease(seg(t, .95, 1.4)) - ease(seg(t, 2.15, 2.5))); // looks up
  const ant = ease(seg(t, 2.45, 2.9)) * (1 - seg(t, 2.95, 3.0)); sy -= .22 * ant; sx += .14 * ant; lean += .2 * ant;
  const rel = bump(t, 2.95, 3.4); sy += .2 * rel; sx -= .1 * rel;
  const sp = speed(t), runA = cl(sp / 8);
  const air = cl(sm(seg(t, 7.6, 7.72)) - sm(seg(t, 7.9, 8.0)) + sm(seg(t, 9.28, 9.4)) - sm(seg(t, 9.75, 9.85)) + sm(seg(t, 12.05, 12.2)) - sm(seg(t, 13.22, 13.3)));
  const dist = -zAt(t), ph = dist / 2.3 * Math.PI;
  leg = Math.sin(ph) * 1.0 * runA * (1 - air); bob = Math.abs(Math.sin(ph)) * .13 * runA * (1 - air);
  const step = Math.cos(2 * ph) * .05 * runA * (1 - air); sy += step; sx -= step * .5;
  lean += .3 * runA; legTuck = air;
  for (const r of RINGS) { const k = bump(t, r - .05, r + .3); sy += .14 * k; sx -= .08 * k; }
  const crouch = bump(t, 11.95, 12.18); sy -= .2 * crouch; sx += .12 * crouch;
  const land = t > 13.3 ? Math.exp(-(t - 13.3) * 6) * Math.cos((t - 13.3) * 18) : 0; sy -= .3 * land; sx += .2 * land;
  const hop = bump(t, 15.4, 15.85); sy += .08 * hop;
  const hl = bump(t, 15.85, 16.05); sy -= .12 * hl; sx += .08 * hl;
  const fa = bump(t, 16.55, 16.85); sy -= .2 * fa; sx += .12 * fa; // wind-up for the flight home
  if (t > 16.85) { const k = flightK(t); legTuck = cl(1 - seg(t, 18.0, 18.2)); const st = bump(t, 16.85, 17.4); sy += .16 * st; sx -= .08 * st; }
  const ld = t > 18.2 ? Math.exp(-(t - 18.2) * 9) * Math.cos((t - 18.2) * 24) : 0; sy -= .14 * ld; sx += .1 * ld;
  if (V2) { const w = wig(t); sy -= .05 * w * Math.abs(wigS(t)); }
  return {sx, sy, lean, bob, leg, legTuck, ph, runA, air};
}

let fontsReady = false;
window.setT = (t) => {
  // dot transform
  const c = centerAt(t), up = t < 16.85 ? upAt(t) : V(0, 1, 0), roll = t < 16.85 ? froll(t) : 0;
  const bs = bodyState(t), es = eyeState(t);
  let scl = 1; if (t > 16.85) scl = lerp(1, SCALE_TARGET, ease(seg(t, 17.2, 18.2)));
  dotRoot.position.copy(c).addScaledVector(up, -BODY_H * scl);
  dotRoot.rotation.set(0, 0, roll); dotRoot.scale.setScalar(scl);
  yawG.rotation.y = yawAt(t); leanG.rotation.x = bs.lean; leanG.rotation.z = V2 ? .2 * wigS(t) * wig(t) : 0;
  butt.forEach((m, i) => { const sd = i ? 1 : -1; m.position.y = -.4 + sd * .04 * Math.sin(bs.ph) * bs.runA * (1 - bs.air) + .03 * wig(t) * sd * wigS(t); m.scale.y = .95 + .06 * wig(t) * Math.abs(wigS(t)); });
  bodyG.position.y = BODY_H + bs.bob; bodyG.scale.set(bs.sx, bs.sy, bs.sx);
  legs.forEach((l, i) => { l.rotation.x = (i ? 1 : -1) * bs.leg - bs.legTuck * .9; l.scale.setScalar(1 - .35 * bs.legTuck * (t > 16.85 ? 1 : 0)); });
  arms.forEach((a, i) => { a.rotation.x = (i ? -1 : 1) * bs.leg * .8 - bs.legTuck * 1.4; a.rotation.z = (i ? 1 : -1) * .45; });
  drawEye(es);
  // the face goes plain, the limbs and loop fade, then the official full mark crossfades in
  const fade = ease(seg(t, 19.0, 19.45));
  for (const m of [loopMat, limbMat]) { m.opacity = 1 - ease(seg(t, 17.6, 18.1)); m.visible = m.opacity > .01; }
  bodyMat.opacity = eyeMat.opacity = 1 - fade;
  dotRoot.visible = fade < .999;
  { const k = ease(seg(t, 17.8, 18.7)); bodyMat.emissive.set('#2c5a14').lerp(GREEN, k); bodyMat.emissiveIntensity = lerp(.45, .75, k); bodyMat.clearcoat = 1 - .7 * k; }
  // blob shadow on ground / wall / roof
  const f = feetAt(t), onWall = roll > .7, roofZ = f.z < Z_EDGE;
  if (t < 16.85) {
    if (onWall) { shadow.position.set(WALLX - .03, f.y + BODY_H * .2, f.z); shadow.rotation.set(0, -Math.PI / 2, 0); }
    else { const gy = roofZ ? ROOFY + .03 : .03; shadow.position.set(c.x, gy, c.z); shadow.rotation.set(-Math.PI / 2, 0, 0); }
    const hgt = onWall ? 0 : c.y - BODY_H - (roofZ ? ROOFY : 0);
    shadow.material.opacity = .6 * cl(1 - hgt / 5); shadow.scale.setScalar(1 + hgt * .08);
  } else shadow.material.opacity = .6 * (1 - ease(seg(t, 16.85, 17.2)));
  // camera
  const cam = camAt(t); camera.position.copy(cam.pos); camera.fov = cam.fov; camera.updateProjectionMatrix(); camera.lookAt(cam.look);
  camera.updateMatrixWorld();
  // lights relative to camera
  const right = V(1, 0, 0).applyQuaternion(camera.quaternion), fwd = V(0, 0, -1).applyQuaternion(camera.quaternion);
  key.position.copy(c).addScaledVector(right, -4).add(V(0, 5, 0)).addScaledVector(fwd, -3); key.target.position.copy(c);
  rim.position.copy(c).addScaledVector(fwd, 2.2).addScaledVector(right, 1.4).add(V(0, 2.6, 0));
  // giant board
  if (t < 2.4 || !giant.userData.done) { drawGiant(Math.min(t, 2.4)); giant.userData.done = t >= 2.4; }
  // rings
  for (const r of rings) {
    const k = seg(t, r.t, r.t + .3), pass = t > r.t;
    r.g.position.y = r.c.y + .12 * Math.sin(t * 2 + r.t);
    r.g.scale.setScalar(1 + .45 * eo(k) * (pass ? 1 : 0));
    const flash = pass ? Math.exp(-(t - r.t) * 6) : 0;
    r.torusMat.color.copy(LIME).multiplyScalar(INK ? 2.3 + 1.2 * flash : 2.6 + 2.5 * flash);
    const vis = (pass ? 1 - eo(k) : 1) * cl((camera.position.distanceTo(r.g.position) - (INK ? 4 : 2)) / (INK ? 6 : 5)); r.torusMat.transparent = true; r.torusMat.opacity = vis; r.halo.material.opacity = .35 * vis; r.symMat.opacity = .9 * vis * (1 - .8 * bump(t, r.t - .1, r.t + .1));
    r.g.visible = vis > .01;
  }
  // red candle drop + shockwave
  const dk = seg(t, CANDLE_T - .4, CANDLE_T); candle.position.y = t < CANDLE_T ? lerp(42, 0, ei(dk)) : .3 * Math.exp(-(t - CANDLE_T) * 9) * Math.sin((t - CANDLE_T) * 40);
  candle.visible = t > CANDLE_T - .42;
  const sw = seg(t, CANDLE_T, CANDLE_T + .6); shock.visible = t > CANDLE_T && sw < 1; shock.scale.setScalar(1 + 5 * eo(sw)); shock.material.opacity = .7 * (1 - sw);
  // trail: ribbon through the dot's past positions
  {
    const pos = trailGeo.attributes.position.array, col = trailGeo.attributes.color.array;
    let burst = 0; for (const r of RINGS) burst += Math.exp(-Math.max(0, t - r) / .45) * (t > r ? 1 : 0);
    const flying = t > 16.85 && t < 18.25 ? 1 : 0;
    const len = .2 + .28 * cl(burst) + .25 * flying, amt = cl(Math.max(speed(t) / 7, flying * 1.2)) * (1 - ease(seg(t, 18.2, 18.6)));
    const toCamV = V();
    for (let i = 0; i < TN; i++) {
      const u = i / (TN - 1), tt = Math.max(0, t - u * len), p = centerAt(tt), p2 = centerAt(Math.max(0, tt - .01));
      const tan = p.clone().sub(p2); if (tan.lengthSq() < 1e-8) tan.set(0, 0, 1); tan.normalize();
      toCamV.copy(camera.position).sub(p).normalize();
      const side = tan.clone().cross(toCamV); if (side.lengthSq() < 1e-6) side.set(1, 0, 0); side.normalize();
      const wdt = (.13 + .2 * cl(burst)) * (1 - u * .7) * (t > 16.85 ? scl : 1);
      p.addScaledVector(up, -.78);
      pos.set([p.x + side.x * wdt, p.y + side.y * wdt, p.z + side.z * wdt, p.x - side.x * wdt, p.y - side.y * wdt, p.z - side.z * wdt], i * 6);
      const fadeU = Math.pow(1 - u, 1.6) * amt * (u < .06 ? u / .06 : 1);
      const near = cl((camera.position.distanceTo(p) - 4) / 4); // fade where it passes the lens
      const k = (2.6 + (INK ? 1 : 2) * cl(burst)) * fadeU * near;
      col.set([LIME.r * k, LIME.g * k, LIME.b * k, LIME.r * k, LIME.g * k, LIME.b * k], i * 6);
    }
    trailGeo.attributes.position.needsUpdate = true; trailGeo.attributes.color.needsUpdate = true;
  }
  // sparks from each ring pass
  {
    const pa = sparkGeo.attributes.position.array, ca = sparkGeo.attributes.color.array;
    rings.forEach((r, ri) => {
      const dtt = t - r.t;
      for (let i = 0; i < SPK; i++) {
        const j = (ri * SPK + i) * 3, a = hash(ri * 100 + i) * Math.PI * 2, v = 4 + hash(ri * 77 + i) * 9, vz = 6 + hash(ri * 31 + i) * 10;
        if (dtt < 0 || dtt > 1.1) { pa[j] = pa[j + 1] = pa[j + 2] = 0; ca[j] = ca[j + 1] = ca[j + 2] = 0; continue; }
        pa[j] = r.c.x + Math.cos(a) * v * dtt * .6; pa[j + 1] = r.c.y + Math.sin(a) * v * dtt * .6 - 5 * dtt * dtt; pa[j + 2] = r.c.z + vz * dtt * .5;
        const k = 3 * (1 - dtt / 1.1); ca[j] = LIME.r * k; ca[j + 1] = LIME.g * k; ca[j + 2] = LIME.b * k;
      }
    });
    sparkGeo.attributes.position.needsUpdate = true; sparkGeo.attributes.color.needsUpdate = true;
  }
  // speed lines in camera space
  {
    const b = boost(t), m = new THREE.Matrix4(), q = new THREE.Quaternion();
    speedLines.material.opacity = cl(b * 1.2) * .8; speedLines.visible = b > .02;
    for (let i = 0; i < SL; i++) {
      const a = hash(i * 3.1) * Math.PI * 2, r = 2.2 + hash(i * 7.7) * 3.2, L = 2.5 + hash(i * 5.3) * 4;
      const z = -((t * 70 + hash(i * 9.1) * 40) % 40) - 2;
      m.compose(V(Math.cos(a) * r * ASPECT * 1.1, Math.sin(a) * r, z), q, V(1, 1, L)); speedLines.setMatrixAt(i, m);
    }
    speedLines.instanceMatrix.needsUpdate = true;
  }
  // rain around the camera, world-anchored
  {
    const cp = camera.position;
    for (let i = 0; i < RN; i++) {
      const bx = hash(i * 1.37) * 60, bz = hash(i * 2.11) * 60, by = hash(i * 3.73) * 34;
      const x = cp.x - 30 + ((bx - cp.x) % 60 + 60) % 60, z = cp.z - 45 + ((bz - cp.z) % 60 + 60) % 60;
      const y = cp.y - 12 + (((by - t * 24) % 34) + 34) % 34;
      rainPos.set([x, y, z, x - .08, y - .9, z + .05], i * 6);
    }
    rainGeo.attributes.position.needsUpdate = true;
  }
  // hotcoin.com sign: flicker on at 15.1
  if (signMat) {
    const on = t < 15.1 ? 0 : t < 15.16 ? 1 : t < 15.26 ? .1 : t < 15.34 ? 1 : t < 15.4 ? .35 : 1;
    signMat.color.copy(LIME).multiplyScalar(.05 + 2.1 * on).lerp(neon('#f4ffe6', .05 + 2.1 * on), .4);
  }
  // logo: writes on missing its dot (official SVG, dot path hidden), then the full official PNG takes over
  if (logoNoDotMat) {
    const k = seg(t, 15.8, 16.7);
    drawLogoReveal(k);
    logoNoDotMat.opacity = t < 15.8 ? 0 : 1 - ease(seg(t, 19.0, 19.45)) * 0; // stays; full logo is drawn on top
    logoFullMat.opacity = ease(seg(t, 19.05, 19.45));
  }
  updateAura(t, scl);
  lens.uniforms.uT.value = t; lens.uniforms.uAmt.value = 1 + .8 * boost(t);
  renderer.setRenderTarget(null);
  if (STYLE) inkRender(t); else composer.render();
};
const outC = canvas(W, H), oc = outC.getContext('2d');
if (MB > 1) { outC.style.cssText = 'position:absolute;left:0;top:0'; document.body.appendChild(outC); }
window.renderFrame = (t, shutter) => {
  if (MB <= 1) { window.setT(t); return; }
  for (let k = 0; k < MB; k++) { window.setT(Math.max(0, t - shutter * k / (MB - 1))); oc.globalAlpha = 1 / (k + 1); oc.drawImage(renderer.domElement, 0, 0); }
  oc.globalAlpha = 1;
};
let lastK = -1;
function drawLogoReveal(k) {
  if (Math.abs(k - lastK) < 1e-4) return; lastK = k;
  const g = logoNoDotG, w = logoNoDotCanvas.width, h = logoNoDotCanvas.height;
  g.clearRect(0, 0, w, h); if (k <= 0) { logoNoDotMat.map.needsUpdate = true; return; }
  const edge = k * (w + 300) - 150;
  g.save(); g.beginPath(); g.rect(0, 0, Math.max(0, edge), h); g.clip(); g.drawImage(logoNoDotImg, 0, 0, w, h); g.restore();
  if (k < 1) { // green light pass over the letters
    g.save(); g.globalCompositeOperation = 'source-atop';
    const gr = g.createLinearGradient(edge - 260, 0, edge, 0); gr.addColorStop(0, 'rgba(184,242,106,0)'); gr.addColorStop(.75, 'rgba(184,242,106,.95)'); gr.addColorStop(1, 'rgba(240,255,220,1)');
    g.fillStyle = gr; g.fillRect(edge - 260, 0, 260, h); g.restore();
  }
  logoNoDotMat.map.needsUpdate = true;
}

// ---------- async assets (fonts, logo, sign) ----------
// ---------- ink painting styles (水墨 / 国风 / 墨夜) ----------
// G-buffer pass (view normals, depth, dot mask) + colour pass, composited into brush outlines, stepped ink washes,
// paper grain and spot colour (lime, red); the dot keeps its colour with cel steps.
const SIDX = {shuimo: 0, guofeng: 1, nightink: 2}[STYLE] ?? 0;
let rtC, rtG, gMat, postScene, postCam, postMat, gHide = null;
if (STYLE) {
  reflector.visible = false;
  const sky = (stops) => { const c = canvas(8, 512), g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 512); stops.forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, 8, 512); return ctex(c); };
  if (SIDX === 0) {
    scene.background = sky([[0, '#e9e3d4'], [1, '#f1ece0']]); scene.fog = new THREE.FogExp2('#ece6d8', .0085);
    hemi.color.set('#ffffff'); hemi.groundColor.set('#6f6a60'); hemi.intensity = 1.9; key.intensity = 2.6;
    MATS.forEach((m) => { m.color.set('#9aa0a2'); m.emissiveIntensity = .03; m.metalness = .1; m.roughness = .85; });
    rain.material.color.set('#3a3d40'); rain.material.opacity = .22;
  } else if (SIDX === 1) {
    scene.background = sky([[0, '#203f4a'], [.45, '#5f8f92'], [.8, '#e9d6b4'], [1, '#f3e6c9']]); scene.fog = new THREE.FogExp2('#d9c9a8', .0075);
    hemi.color.set('#ffe9c8'); hemi.groundColor.set('#2c3a40'); hemi.intensity = 1.6; key.color.set('#ffe0b0'); key.intensity = 2.6;
    MATS.forEach((m) => { m.color.set('#3e5157'); m.emissiveIntensity = .55; m.metalness = .2; m.roughness = .7; });
    rain.material.color.set('#e8dcc4'); rain.material.opacity = .25;
  } else {
    scene.background = sky([[0, '#060708'], [1, '#0d1013']]); scene.fog = new THREE.FogExp2('#0B0E11', .009);
    MATS.forEach((m) => { m.color.set('#2a2f33'); m.emissiveIntensity = .7; });
  }
  rtC = new THREE.WebGLRenderTarget(W, H, {type: THREE.HalfFloatType, samples: 4});
  rtG = new THREE.WebGLRenderTarget(W, H, {type: THREE.HalfFloatType, samples: 0});
  gMat = new THREE.ShaderMaterial({uniforms: {uDot: {value: 0}},
    vertexShader: 'varying vec3 vN; varying float vD; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vD = -mv.z; gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform float uDot; varying vec3 vN; varying float vD; void main(){ vec3 n = normalize(vN); gl_FragColor = vec4(n.xy * .5 + .5, clamp(vD / 400., 0., 1.), uDot); }'});
  dotRoot.traverse((o) => { if (o.isMesh && !o.material.isShaderMaterial) {
    o.onBeforeRender = (r, sc, c, g, m) => { if (m === gMat) { m.uniforms.uDot.value = 1; m.uniformsNeedUpdate = true; } };
    o.onAfterRender = (r, sc, c, g, m) => { if (m === gMat) { m.uniforms.uDot.value = 0; m.uniformsNeedUpdate = true; } }; o.userData.isDot = true; } });
  postMat = new THREE.ShaderMaterial({
    uniforms: {tC: {value: rtC.texture}, tG: {value: rtG.texture}, uRes: {value: new THREE.Vector2(W, H)}, uS: {value: SIDX}, uT: {value: 0},
      uPaper: {value: new THREE.Color(SIDX === 2 ? '#e8e2d2' : '#f1ebdd')}, uInk: {value: new THREE.Color(SIDX === 2 ? '#0B0E11' : SIDX === 1 ? '#1d1712' : '#15171A')}},
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
    fragmentShader: `uniform sampler2D tC, tG; uniform vec2 uRes; uniform int uS; uniform float uT; uniform vec3 uPaper, uInk; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 5; i++) { s += a * n2(p); p = p * 2.03 + 1.7; a *= .5; } return s; }
vec3 tone(vec3 c){ c = 1. - exp(-c * 1.15); return pow(c, vec3(1. / 2.2)); }
vec3 srgb(vec3 c){ return pow(c, vec3(1. / 2.2)); }
vec3 cel(vec3 c){ float L = dot(c, vec3(.3, .59, .11)); float q = floor(L * 3. + .55) / 3.; return mix(c, c / max(L, .001) * q, .65); }
void main(){
  vec2 px = 1. / uRes, A = vec2(uRes.x / uRes.y, 1.);
  vec2 wob = (vec2(fbm(vUv * A * 7.), fbm(vUv * A * 7. + 5.3)) - .5) * px * 7.;
  vec2 uv = vUv + wob;
  vec4 g0 = texture2D(tG, uv);
  float r = 1.3 + 1.6 * fbm(vUv * A * 24.);
  float ed = 0., en = 0.;
  for (int i = 0; i < 8; i++) { float a = float(i) * .785398; vec4 g = texture2D(tG, uv + vec2(cos(a), sin(a)) * px * r); ed += abs(g.b - g0.b); en += length(g.rg - g0.rg); }
  float far = g0.b;
  float edge = clamp(smoothstep(.25, .9, ed / (g0.b + .003)) + smoothstep(.5, 1.3, en), 0., 1.);
  edge *= (1. - smoothstep(.12, .6, far)) * (.6 + .5 * fbm(vUv * A * 90.));
  vec3 c = tone(texture2D(tC, vUv).rgb);
  float L = dot(c, vec3(.3, .59, .11)), mx = max(c.r, max(c.g, c.b)), sat = mx - min(c.r, min(c.g, c.b));
  float lime = smoothstep(.22, .42, sat) * step(c.r, c.g) * step(c.b * 1.4, c.g);
  float red = smoothstep(.25, .45, sat) * step(c.g * 1.5, c.r);
  float isDot = texture2D(tG, vUv).a;
  float grain = .9 + .1 * fbm(vUv * A * 160.) + .03 * (h(floor(vUv * uRes) + uT) - .5);
  float sky = step(.999, texture2D(tG, vUv).b);
  vec3 o;
  if (uS == 0) {
    float wash = 1. - smoothstep(.08, .88, L);
    wash = floor(wash * 4. + .55 * fbm(vUv * A * 10.)) / 4.;
    wash *= 1. - .85 * smoothstep(.08, .75, far);
    vec3 paper = uPaper * grain;
    o = mix(paper, uInk, clamp(wash, 0., 1.) * .8);
    // distant ink mountains in the sky
    float x = vUv.x;
    float m1 = .52 + .16 * fbm(vec2(x * 2.2, 1.3)) , m2 = .46 + .12 * fbm(vec2(x * 3.7 + 4., 2.1));
    float mtn = max(smoothstep(m1 + .004, m1 - .004, vUv.y) * .32, smoothstep(m2 + .004, m2 - .004, vUv.y) * .5);
    mtn *= .6 + .4 * fbm(vUv * A * vec2(6., 18.));
    if (sky > .5) o = mix(paper, uInk, mtn * smoothstep(.25, .6, vUv.y) * .75);
    o = mix(o, srgb(vec3(.48, .75, .28)) * grain * (.75 + .5 * L), lime * .9);
    o = mix(o, srgb(vec3(.79, .07, .09)) * grain, red * .9);
    if (isDot > .5) o = cel(c);
    o = mix(o, uInk, edge * .92);
  } else if (uS == 1) {
    vec3 q = c / max(L, .001) * (floor(L * 4. + .5) / 4.);
    o = mix(c, q, .75) * mix(1., grain, .6);
    if (isDot > .5) o = cel(c);
    o = mix(o, uInk, edge * .88);
  } else {
    float wash = smoothstep(.03, .75, L); wash = floor(wash * 4. + .55 * fbm(vUv * A * 10.)) / 4.;
    wash *= 1. - .7 * smoothstep(.08, .75, far);
    o = mix(uInk * (.85 + .3 * fbm(vUv * A * 160.)), uPaper, clamp(wash, 0., 1.) * .5);
    o = mix(o, c, max(lime, red));
    if (isDot > .5) o = cel(c);
    o = mix(o, uPaper * .82, edge * .75);
  }
  gl_FragColor = vec4(o, 1.);
}`});
  postScene = new THREE.Scene(); postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));
}
function inkRender(t) {
  if (!gHide) { gHide = []; scene.traverse((o) => { if (o.userData.isDot) return; const m = o.material;
    if (o.isPoints || o.isLine || o.isInstancedMesh || (m && (m.transparent || m.isShaderMaterial || m.blending === THREE.AdditiveBlending))) gHide.push(o); }); }
  renderer.setRenderTarget(rtC); renderer.clear(); renderer.render(scene, camera);
  const vis = gHide.map((o) => o.visible); gHide.forEach((o) => { o.visible = false; });
  const bg = scene.background, fog = scene.fog; scene.background = null; scene.fog = null; scene.overrideMaterial = gMat;
  renderer.setClearColor(new THREE.Color(.5, .5, 1), 0); renderer.setRenderTarget(rtG); renderer.clear(); renderer.render(scene, camera);
  scene.overrideMaterial = null; scene.background = bg; scene.fog = fog; renderer.setClearColor(0x000000, 0);
  gHide.forEach((o, i) => { o.visible = vis[i]; });
  postMat.uniforms.uT.value = t; renderer.setRenderTarget(null); renderer.render(postScene, postCam);
}

window.READY = (async () => {
  const ff = [['Inter Tight', '800', 'inter-tight-latin-800-normal.woff2'], ['Inter Tight', '700', 'inter-tight-latin-700-normal.woff2']];
  for (const [fam, wt, file] of ff) { const f = new FontFace(fam, `url(/social/dot-3d/node_modules/@fontsource/inter-tight/files/${file})`, {weight: wt}); await f.load(); document.fonts.add(f); }
  fontsReady = true;
  makeBlades();
  // hotcoin.com neon sign (typed domain, not the logo)
  { const c = canvas(2048, 420), g = c.getContext('2d'); g.font = '800 250px "Inter Tight"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineJoin = 'round'; g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 18; g.shadowColor = '#ffffff'; g.shadowBlur = 20; g.strokeText('hotcoin.com', 1024, 220);
    g.shadowBlur = 0; g.lineWidth = 7; g.strokeStyle = '#ffffff'; g.strokeText('hotcoin.com', 1024, 220);
    signMat = new THREE.MeshBasicMaterial({map: ctex(c), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false});
    const m = new THREE.Mesh(new THREE.PlaneGeometry(26, 26 * 420 / 2048), signMat); m.position.set(0, SIGN_Y, Z_T + .25); scene.add(m); }
  // official logo SVG with the green dot path hidden
  const svg = await (await fetch('/brand-kit/logo/hotcoin-logo-white.svg')).text();
  const noDot = svg.replace(/<path fill="#7ec25a"[^>]*\/>/i, '').replace('<svg ', '<svg width="4010" height="656" ');
  if (noDot === svg) throw new Error('green dot path not found in logo svg');
  logoNoDotImg = new Image(); logoNoDotImg.src = URL.createObjectURL(new Blob([noDot], {type: 'image/svg+xml'})); await logoNoDotImg.decode();
  logoNoDotCanvas = canvas(4010, 656); logoNoDotG = logoNoDotCanvas.getContext('2d');
  logoNoDotMat = new THREE.MeshBasicMaterial({map: ctex(logoNoDotCanvas), transparent: true, depthWrite: false, fog: false, color: neon('#ffffff', 1.25)});
  const ln = new THREE.Mesh(new THREE.PlaneGeometry(LOGO_W, LOGO_H), logoNoDotMat); ln.position.set(0, LOGO_Y, Z_T + .35); scene.add(ln);
  const full = await new THREE.TextureLoader().loadAsync('/hotcoin-tradfi/public/brand/logo-official-white.png'); full.colorSpace = THREE.SRGBColorSpace; full.anisotropy = 8;
  logoFullMat = new THREE.MeshBasicMaterial({map: full, transparent: true, opacity: 0, depthWrite: false, fog: false, color: neon('#ffffff', 1.25)});
  const lf = new THREE.Mesh(new THREE.PlaneGeometry(LOGO_W, LOGO_H), logoFullMat); lf.position.set(0, LOGO_Y, Z_T + .5); lf.renderOrder = 5; scene.add(lf);
  await new Promise((r) => { if (symTex.image) r(); else symTex.onUpdate = r; setTimeout(r, 1500); });
  window.setT(0);
  return {W, H, DUR, zEdge: Z_EDGE, zLand: Z_LAND, scaleTarget: SCALE_TARGET};
})();
