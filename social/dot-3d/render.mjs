// Hotcoin dot 3D runner test: renders scene.html (three.js) frame by frame with Playwright and pipes JPEGs to ffmpeg.
// Sources / assets: all procedural; Hotcoin marks from official files only (see scene.js header). Music: make-music.py.
// Usage (from repo root):
//   node social/dot-3d/render.mjs stills [45|916] [t1,t2,...]   -> out/still-*.jpg + out/contact-sheet[-916].jpg
//   node social/dot-3d/render.mjs video  [45|916]               -> out/dot-3d-silent[-916].mp4
// V=3 renders the ink cut, V=2 (or V2=1) the v2 cut; MB=2 adds 2-sub-frame motion blur. V2=1 renders the v2 cut (aura, butt gag, smoothed camera; files get -v2), FPS=60 for 60 fps.
// GPU=metal uses the Mac GPU (--enable-gpu --use-angle=metal); default is SwiftShader (software WebGL, works anywhere).
import {createRequire} from 'module';
import {spawn, execSync} from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const DIR = path.dirname(new URL(import.meta.url).pathname), ROOT = path.resolve(DIR, '../..'), OUT = path.join(DIR, 'out');
const MODE = process.argv[2] || 'stills', FMT = process.argv[3] || '45';
const VER = +process.env.V || (process.env.V2 ? 2 : 1), MB = +process.env.MB || 1;
const STYLE = process.env.STYLE || '';
const [W, H] = FMT === '916' ? [1080, 1920] : [1080, 1350], SUF = (FMT === '916' ? '-916' : '') + (VER > 1 ? '-v' + VER : '') + (STYLE ? '-' + STYLE : '');
const FPS = +process.env.FPS || 30, DUR = 20;
const FFMPEG = fs.existsSync('/usr/bin/ffmpeg') ? '/usr/bin/ffmpeg' : 'ffmpeg';
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json'};
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, {'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream'}); fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const args = process.env.GPU === 'metal' ? ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist']
  : ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
// on the Mac, the full Chromium build (new headless) uses the GPU; the log prints the GL renderer so you can check it says Metal/Apple
const browser = await pw.chromium.launch(process.env.GPU === 'metal' ? {args, channel: 'chromium'} : {args});
const page = await browser.newPage({viewport: {width: W, height: H}});
page.on('pageerror', (e) => console.error('PAGE ERROR', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.error('console:', m.text()); });
await page.goto(`http://127.0.0.1:${port}/social/dot-3d/scene.html?w=${W}&h=${H}${process.env.ARMS ? '&arms=1' : ''}&v=${VER}&mb=${MB}${STYLE ? '&style=' + STYLE : ''}`);
const info = await page.evaluate(() => window.READY);
console.log('ready', JSON.stringify(info), 'gl:', await page.evaluate(() => { const g = document.querySelector('canvas').getContext('webgl2'); const d = g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : '?'; }));
fs.mkdirSync(OUT, {recursive: true});
const shot = () => page.screenshot({type: 'jpeg', quality: 93});
if (MODE === 'stills') {
  const times = (process.argv[4] || '0,1.9,5.05,8.4,10.05,12.7,14.6,16.2,18.4,19.8').split(',').map(Number);
  const files = [];
  for (const t of times) {
    const t0 = Date.now(); await page.evaluate(([t, sh]) => window.renderFrame(t, sh), [t, 1 / (2 * FPS)]);
    const f = path.join(OUT, `still${SUF}-${t.toFixed(2)}.jpg`); fs.writeFileSync(f, await shot()); files.push(f);
    console.log('still', t, (Date.now() - t0) + 'ms');
  }
  // contact sheet: 5 columns, labelled with the time
  const cols = 5, tw = 360, th = Math.round(tw * H / W);
  const inputs = files.flatMap((f) => ['-i', f]);
  const n = files.length, rows = Math.ceil(n / cols);
  let fc = files.map((_, i) => `[${i}:v]scale=${tw}:${th},drawtext=text='${times[i].toFixed(2)}s':x=12:y=10:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=6[v${i}]`).join(';');
  const layout = files.map((_, i) => `${(i % cols) * tw}_${Math.floor(i / cols) * th}`).join('|');
  fc += ';' + files.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${n}:layout=${layout}:fill=black[out]`;
  execSync(`${FFMPEG} -loglevel error -y ${inputs.map((a) => (a === '-i' ? a : `"${a}"`)).join(' ')} -filter_complex "${fc}" -map "[out]" -q:v 3 "${path.join(OUT, `contact-sheet${SUF}.jpg`)}"`);
  console.log('contact sheet', rows, 'rows');
} else {
  const out = path.join(OUT, `dot-3d-silent${SUF}${process.env.F0 ? '-patch' : ''}.mp4`);
  const ff = spawn(FFMPEG, ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], {stdio: ['pipe', 'inherit', 'inherit']});
  const N = DUR * FPS, t0 = Date.now(), F0 = +process.env.F0 || 0, F1 = +process.env.F1 || N; // F0/F1: re-render a frame range
  for (let i = F0; i < F1; i++) {
    await page.evaluate(([t, sh]) => window.renderFrame(t, sh), [i / FPS, 1 / (2 * FPS)]);
    const buf = await shot();
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 30 === 0) console.log(`frame ${i}/${N} ${((Date.now() - t0) / (i + 1)).toFixed(0)}ms/f`);
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
  console.log('wrote', out);
}
await browser.close(); server.close();
