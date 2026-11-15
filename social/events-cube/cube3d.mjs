// Events cube v2: a real 3D rounded cube (three.js, clearcoat, studio environment light) wearing the four event faces
// from faces.mjs, over a flowing dot-matrix field that takes each event's colour. 1:1, 1080x1080, 30 fps, 24 s.
// Data: see render.mjs header. Run faces.mjs first. Run: PW_PATH=$(npm root -g)/playwright node social/events-cube/cube3d.mjs [sheet|video]
import {createRequire} from 'module';
import fs from 'fs';
import {spawn} from 'child_process';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/events-cube', OUT = 'file://' + DIR + '/out/', BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const THREE = 'file:///home/user/sandbox/hotcoin-tradfi/node_modules/three/';
const FPS = 30, DUR = 24, S = 1080;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:${S}px;height:${S}px;overflow:hidden;background:#05070A;font-family:'Inter Tight',sans-serif;color:#fff}
canvas{position:absolute;left:0;top:0;width:${S}px;height:${S}px}.m{font-family:'JetBrains Mono',monospace}
.ov{position:absolute;left:0;right:0;text-align:center}
.pill{display:inline-flex;align-items:center;gap:12px;font-family:'JetBrains Mono';font-weight:700;font-size:18px;letter-spacing:4px;color:#E9F7DD;
  padding:12px 20px;border-radius:99px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(8px)}
.pill i{width:11px;height:11px;border-radius:50%;background:#B8F26A;box-shadow:0 0 0 5px rgba(184,242,106,.18),0 0 16px rgba(184,242,106,.9)}
.grain{position:absolute;inset:0;opacity:.12;mix-blend-mode:overlay;pointer-events:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
</style>
<script type="importmap">{"imports":{"three":"${THREE}build/three.module.js","three/addons/":"${THREE}examples/jsm/"}}</script></head><body>
<canvas id="bg" width="${S * 2}" height="${S * 2}"></canvas>
<canvas id="gl"></canvas>
<div id="intro" class="ov" style="top:70px"><span class="pill"><i></i>LIVE NOW</span>
  <div style="font-size:64px;font-weight:900;letter-spacing:-3px;margin-top:22px">4 live events on Hotcoin</div></div>
<div id="outro" class="ov" style="top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0">
  <span class="pill"><i></i>4 LIVE EVENTS</span>
  <div style="font-size:96px;font-weight:900;letter-spacing:-5px;line-height:.95;margin-top:26px">Earn with Hotcoin.<br><span style="color:#B8F26A">No matter the market.</span></div>
  <div id="dl" style="display:flex;gap:14px;margin-top:40px"></div>
  <div class="m" style="margin-top:44px;font-size:26px;font-weight:700;color:#06120A;background:#B8F26A;border-radius:99px;padding:16px 34px;box-shadow:0 0 40px rgba(184,242,106,.45)">hotcoin.com</div></div>
<img id="logo" src="${BR}logo-official-white.png" style="position:absolute;left:50%;bottom:54px;height:34px;transform:translateX(-50%)">
<div class="grain"></div>
<script type="module">
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
const S = ${S}, cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), seg = (t, a, b) => cl((t - a) / (b - a)), mix = (a, b, u) => a + (b - a) * u;
const io = (u) => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, oc = (u) => 1 - Math.pow(1 - u, 3), ex = (u) => u === 1 ? 1 : 1 - Math.pow(2, -10 * u);
const T0 = 2.4, SEG = 4.5, NF = 4, TOUT = T0 + NF * SEG;
const PAL = [[184, 242, 106], [243, 233, 210], [255, 196, 77], [214, 170, 255]];   // dot-field tint per face
const BGC = [[6, 30, 22], [10, 18, 42], [30, 19, 4], [30, 10, 46]];
// deadlines for the outro
document.getElementById('dl').innerHTML = [['NOV 16', 'Earn Boost', '#FFC94D'], ['NOV 19', 'Wall Street', '#F3E9D2'], ['NOV 20', 'Futures cover', '#B8F26A']]
  .map(([d, n, c]) => '<div style="padding:16px 22px;border-radius:18px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);text-align:left"><div class=m style="font-size:17px;font-weight:700;letter-spacing:2px;color:' + c + '">' + d + '</div><div style="font-size:24px;font-weight:700;margin-top:6px">' + n + '</div></div>').join('');

// renderer
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('gl'), antialias: true, alpha: true, preserveDrawingBuffer: true});
renderer.setPixelRatio(2); renderer.setSize(S, S, false); renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
const scene = new THREE.Scene(); const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
const camera = new THREE.PerspectiveCamera(30, 1, .1, 100);
const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 4, 5); scene.add(key);
const rim = new THREE.DirectionalLight(0xB8F26A, 1.2); rim.position.set(-4, 2, -3); scene.add(rim);
const loader = new THREE.TextureLoader();
const tex = (u) => new Promise((r) => loader.load(u, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; r(t); }));
const faceTex = await Promise.all(['face-1-futures', 'face-2-tradfi', 'face-3-earn', 'face-4-nefe'].map((n) => tex('${OUT}' + n + '.png')));
// cap texture: ink with lime dot grid and the Hotcoin symbol
const capC = document.createElement('canvas'); capC.width = capC.height = 1024; const cx = capC.getContext('2d');
cx.fillStyle = '#0B0E11'; cx.fillRect(0, 0, 1024, 1024); cx.fillStyle = 'rgba(184,242,106,.22)';
for (let y = 16; y < 1024; y += 32) for (let x = 16; x < 1024; x += 32) { cx.beginPath(); cx.arc(x, y, 3, 0, 7); cx.fill(); }
const sym = await new Promise((r) => { const im = new Image(); im.onload = () => r(im); im.src = '${BR}symbol-official-white.png'; });
cx.drawImage(sym, 312, 312, 400, 400);
const capTex = new THREE.CanvasTexture(capC); capTex.colorSpace = THREE.SRGBColorSpace;
// self-lit face art (true colours) + a clearcoat layer for glossy reflections
const mat = (map) => new THREE.MeshBasicMaterial({map});
// BoxGeometry groups: +x, -x, +y, -y, +z, -z. Turning the cube by -90deg steps brings +z, +x, -z, -x to the front.
const mats = [mat(faceTex[1]), mat(faceTex[3]), mat(capTex), mat(capTex), mat(faceTex[0]), mat(faceTex[2])];
const geo = new RoundedBoxGeometry(2, 2, 2, 8, .14);
const cube = new THREE.Mesh(geo, mats); scene.add(cube);
// gloss overlay: additive fresnel rim on edges + a soft specular highlight that sweeps as the cube turns (keeps face colours exact)
const gloss = new THREE.Mesh(geo, new THREE.ShaderMaterial({transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
  uniforms: {L: {value: new THREE.Vector3(.5, .75, .45).normalize()}},
  vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 wp = modelMatrix * vec4(position,1.); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }',
  fragmentShader: 'uniform vec3 L; varying vec3 vN; varying vec3 vV; void main(){ vec3 n = normalize(vN), v = normalize(vV); float f = pow(1. - max(dot(n, v), 0.), 3.2); float sp = pow(max(dot(reflect(-L, n), v), 0.), 60.); vec3 c = vec3(1.) * (f * .55 + sp * .35) + vec3(.72, .95, .42) * f * .12; gl_FragColor = vec4(c, 1.); }'}));
cube.add(gloss);
// soft contact shadow
const shC = document.createElement('canvas'); shC.width = shC.height = 256; const sx = shC.getContext('2d');
const g = sx.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(0,0,0,.65)'); g.addColorStop(1, 'rgba(0,0,0,0)'); sx.fillStyle = g; sx.fillRect(0, 0, 256, 256);
const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(shC), transparent: true, depthWrite: false}));
shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.55; scene.add(shadow);

// dot-matrix background field (2D canvas), tinted per event
const bg = document.getElementById('bg'), b = bg.getContext('2d'); b.scale(2, 2);
function field(t, ci, cj, w) {
  const c = PAL[ci].map((v, k) => mix(v, PAL[cj][k], w)), d = BGC[ci].map((v, k) => mix(v, BGC[cj][k], w));
  const gr = b.createRadialGradient(S / 2, S * .48, 0, S / 2, S * .48, S * .75); gr.addColorStop(0, 'rgb(' + d.join(',') + ')'); gr.addColorStop(1, '#05070A');
  b.fillStyle = gr; b.fillRect(0, 0, S, S);
  const step = 22;
  for (let y = step / 2; y < S; y += step) for (let x = step / 2; x < S; x += step) {
    const n = Math.sin(x * .011 + t * .7) * Math.cos(y * .013 - t * .5) + Math.sin((x + y) * .006 + t * .35);
    const rr = Math.hypot(x - S / 2, y - S * .48) / (S * .62), fall = cl(1 - rr);
    const rad = cl((n + 1.2) / 3.2) * 3.8 * fall; if (rad < .35) continue;
    b.fillStyle = 'rgba(' + c.map(Math.round).join(',') + ',' + (.18 + .5 * fall * cl((n + 1) / 2)) + ')'; b.beginPath(); b.arc(x, y, rad, 0, 6.283); b.fill(); }
}

window.setT = (t) => {
  // which face, and how far into its segment
  const k = Math.max(0, Math.min(NF - 1, Math.floor((t - T0) / SEG))), l = t - T0 - k * SEG;
  let ry, rx, dist, y = 0, lift = 0;
  if (t < T0) { const u = ex(seg(t, 0, T0)); ry = mix(-2.4, -.42, u); rx = mix(.5, .3, u); dist = mix(13, 9.2, u); }
  else if (t < TOUT) {
    const turn = io(seg(l, 0, .85)), zin = io(seg(l, .55, 1.25)), zout = io(seg(l, SEG - .7, SEG)), read = zin * (1 - zout);
    const from = k === 0 ? -.42 : -(k - 1) * Math.PI / 2 - .32, to = -k * Math.PI / 2;
    ry = mix(from, to, turn) - .32 * (1 - read) + Math.sin(l * .9) * .035 * read;
    rx = mix(.3, .05, read) + Math.sin(l * 1.1) * .02 * read; dist = mix(9.2, 5.05, read); lift = read * .02;
  } else { const u = io(seg(t, TOUT, TOUT + 1.6)); ry = -(NF - 1) * Math.PI / 2 - .32 - u * Math.PI * 2.2; rx = mix(.3, .55, u); dist = mix(9.2, 80, Math.pow(u, 2.2)); }
  cube.rotation.set(rx, ry, 0); cube.visible = shadow.visible = t < TOUT + 1.3; cube.position.y = Math.sin(t * 1.3) * .05 + lift;
  camera.position.set(0, .15, dist); camera.lookAt(0, 0, 0);
  shadow.material.opacity = cl(1.4 - dist / 12);
  renderer.render(scene, camera);
  // background follows the face in front
  const fi = t < T0 ? 0 : t < TOUT ? k : 3, nx = Math.min(NF - 1, fi + 1), w = t >= T0 && t < TOUT ? io(seg(l, SEG - .5, SEG)) * (fi < NF - 1 ? 1 : 0) : 0;
  field(t, fi, nx, w);
  // overlays
  const zoom = t >= T0 && t < TOUT ? io(seg(l, .5, 1.1)) * (1 - io(seg(l, SEG - .8, SEG - .2))) : 0;
  const far = cl((dist - 8.2) / 1.0);   // overlays only when the cube is pulled back
  document.getElementById('intro').style.opacity = t < TOUT ? far : 1 - seg(t, TOUT, TOUT + .5);
  document.getElementById('intro').style.transform = 'translateY(' + (-zoom * 30) + 'px)';
  document.getElementById('logo').style.opacity = t < TOUT ? far : 1;
  const e = oc(seg(t, TOUT + 1.2, TOUT + 1.9)); const o = document.getElementById('outro'); o.style.opacity = e; o.style.transform = 'scale(' + (.96 + .04 * e) + ')';
};
window.ready = true; window.setT(0);
</script></body></html>`;

const mode = process.argv[2] || 'sheet';
const f = DIR + '/_cube-' + process.pid + '.html'; fs.writeFileSync(f, html);
const browser = await chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--allow-file-access-from-files']});
const pg = await (await browser.newContext({viewport: {width: S, height: S}, deviceScaleFactor: 1})).newPage();
pg.on('pageerror', (e) => console.error('page error', e.message)); pg.on('console', (m) => m.type() === 'error' && console.error('console', m.text()));
await pg.goto('file://' + f, {waitUntil: 'load'}); await pg.waitForFunction(() => window.ready === true, null, {timeout: 60000}); await pg.evaluate(() => document.fonts.ready);
if (mode === 'sheet') {
  for (const t of (process.argv[3] || '0,1.2,2.4,4.6,7.3,9.4,11.8,14.0,16.3,18.5,20.8,23.5').split(',').map(Number)) { await pg.evaluate((v) => window.setT(v), t); await pg.screenshot({path: `${DIR}/out/c-${t}.jpg`, type: 'jpeg', quality: 90}); }
} else {
  const ff = spawn('/usr/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', `${DIR}/out/silent3d.mp4`], {stdio: ['pipe', 'inherit', 'inherit']});
  for (let i = 0; i < DUR * FPS; i++) { await pg.evaluate((v) => window.setT(v), i / FPS); const bf = await pg.screenshot({type: 'jpeg', quality: 94}); if (!ff.stdin.write(bf)) await new Promise((r) => ff.stdin.once('drain', r)); if (i % 90 === 0) console.log('frame', i); }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
}
await browser.close(); fs.unlinkSync(f); console.log('done', mode);
