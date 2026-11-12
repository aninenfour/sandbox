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
fs.mkdirSync(OUT, {recursive: true});
const browser = await chromium.launch();
async function open(html, w, h, scale) {
  const pg = await (await browser.newContext({viewport: {width: w, height: h}, deviceScaleFactor: scale})).newPage();
  const f = `${DIR}/_${w}x${h}.html`; fs.writeFileSync(f, html);
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); fs.unlinkSync(f);
  return pg;
}
if (mode === 'stills') {
  let pg = await open(wide(), 1920, 1080, 2); await pg.screenshot({path: `${OUT}/collab-16x9.png`});
  pg = await open(feed(), 1080, 1350, 2);
  await pg.evaluate(() => setT(1.6)); await pg.screenshot({path: `${OUT}/collab-4x5.png`});
  await pg.evaluate(() => setT(13)); await pg.screenshot({path: `${OUT}/rank-end-4x5.png`});
}
if (mode === 'sheet') {
  const pg = await open(feed(), 1080, 1350, 1);
  for (const t of (process.argv[3] || '0,3.2,3.7,4.5,5.5,6.5,7.5,8.2,9.3,10,10.5,13').split(',')) {
    await pg.evaluate((x) => setT(x), +t); await pg.screenshot({path: `${OUT}/sheet-${t}.jpg`, type: 'jpeg', quality: 80});
  }
}
if (mode === 'video') {
  const FPS = 60, pg = await open(feed(), 1080, 1350, 1);
  const ff = spawn('/usr/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', `${OUT}/silent.mp4`], {stdio: ['pipe', 'inherit', 'inherit']});
  for (let i = 0; i < DUR * FPS; i++) {
    await pg.evaluate((x) => setT(x), i / FPS);
    const buf = await pg.screenshot({type: 'jpeg', quality: 95});
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
}
await browser.close(); console.log('done', mode);
