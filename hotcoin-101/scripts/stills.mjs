// Render many stills in one browser session.
//   node scripts/stills.mjs <composition-id> <outdir> <frame,frame,...>
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [id, outDir, list] = process.argv.slice(2);
const frames = list.split(',').map(Number);
const serveUrl = path.resolve('bundle');
const browserExecutable = process.env.REMOTION_CHROME || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
fs.mkdirSync(outDir, {recursive: true});
const puppeteerInstance = await openBrowser('chrome', {browserExecutable});
const composition = await selectComposition({serveUrl, id, puppeteerInstance});
for (const frame of frames) {
  const output = path.join(outDir, `${id}-${String(frame).padStart(5, '0')}.png`);
  await renderStill({serveUrl, composition, frame, output, puppeteerInstance, overwrite: true});
  process.stdout.write(`${frame} `);
}
await puppeteerInstance.close({silent: true});
console.log('done');
