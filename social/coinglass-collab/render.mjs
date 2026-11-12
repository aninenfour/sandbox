// Renders the Hotcoin x CoinGlass statics and video frames (HTML in headless Chromium, encoded with ffmpeg).
// Run: PW_PATH=$(npm root -g)/playwright node social/coinglass-collab/render.mjs [stills|sheet|video]
import {createRequire} from 'module';
import fs from 'fs';
import {spawn} from 'child_process';
import {wide, feed, DUR} from './scene.mjs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/coinglass-collab', OUT = DIR + '/out';
const mode = process.argv[2] || 'stills';
const L = process.env.L || 'en', SUF = L === 'en' ? '' : '-' + L;   // L=zh for Chinese
fs.mkdirSync(OUT, {recursive: true});
const browser = await chromium.launch();
async function open(html, w, h, scale) {
  const pg = await (await browser.newContext({viewport: {width: w, height: h}, deviceScaleFactor: scale})).newPage();
  const f = `${DIR}/_${w}x${h}.html`; fs.writeFileSync(f, html);
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); fs.unlinkSync(f);
  return pg;
}
if (mode === 'stills') {
  // Supersampled: render at 4x, downscale with Lanczos to 2x (16:9, 3840x2160) and 3x (4:5, 3240x4050) for crisp zoom.
  const shot = async (pg, name, w, h) => { const raw = `${OUT}/_raw.png`; await pg.screenshot({path: raw});
    await new Promise((r) => spawn('/usr/bin/ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-vf', `scale=${w}:${h}:flags=lanczos`, `${OUT}/${name}`]).on('close', r)); fs.unlinkSync(raw); };
  let pg = await open(wide(), 1920, 1080, 4); await shot(pg, 'collab-16x9.png', 3840, 2160);
  pg = await open(feed(L), 1080, 1350, 4);
  await pg.evaluate(() => setT(1.6)); await shot(pg, `collab-4x5${SUF}.png`, 3240, 4050);
  await pg.evaluate(() => setT(13)); await shot(pg, `rank-end-4x5${SUF}.png`, 3240, 4050);
}
if (mode === 'sheet') {
  const pg = await open(feed(L), 1080, 1350, 1);
  for (const t of (process.argv[3] || '0,3.2,3.7,4.5,5.5,6.5,7.5,8.2,9.3,10,10.5,13').split(',')) {
    await pg.evaluate((x) => setT(x), +t); await pg.screenshot({path: `${OUT}/sheet${SUF}-${t}.jpg`, type: 'jpeg', quality: 80});
  }
}
if (mode === 'video') {
  const FPS = 60, pg = await open(feed(L), 1080, 1350, 2); // 2x frames, downscaled by ffmpeg (supersampled, sharper edges)
  const ff = spawn('/usr/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-vf', 'scale=1080:1350:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', `${OUT}/silent${SUF}.mp4`], {stdio: ['pipe', 'inherit', 'inherit']});
  for (let i = 0; i < DUR * FPS; i++) {
    await pg.evaluate((x) => setT(x), i / FPS);
    const buf = await pg.screenshot({type: 'jpeg', quality: 95});
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
}
await browser.close(); console.log('done', mode);
