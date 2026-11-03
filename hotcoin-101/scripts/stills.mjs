// Render many stills in one browser session.
//   node scripts/stills.mjs <composition-id> <outdir> <frame,frame,...>
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [id, outDir, list] = process.argv.slice(2);
const frames = list.split(',').map(Number);
const serveUrl = path.resolve('bundle');
// the preinstalled headless shell moves between container images, so look for it
const findShell = () => {
  const root = '/opt/pw-browsers';
  for (const d of fs.existsSync(root) ? fs.readdirSync(root).filter((n) => n.startsWith('chromium_headless_shell')).sort().reverse() : []) {
    for (const rel of ['chrome-headless-shell-linux64/chrome-headless-shell', 'chrome-linux/headless_shell']) {
      const p = path.join(root, d, rel);
      if (fs.existsSync(p)) return p;
    }
  }
  return undefined;
};
const browserExecutable = process.env.REMOTION_CHROME || findShell();
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
