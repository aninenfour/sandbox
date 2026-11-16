import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const root = '/opt/pw-browsers';
const d = fs.readdirSync(root).filter((n) => n.startsWith('chromium_headless_shell')).sort().reverse()[0];
const browserExecutable = path.join(root, d, 'chrome-headless-shell-linux64/chrome-headless-shell');
const serveUrl = path.resolve('bundle-thumbs');
const b = await openBrowser('chrome', {browserExecutable});
const jobs = [
  ...['neutral','happy','delight','curious','skeptical','surprised','worried','focused','sleepy','excited'].map((m) => ({name: m, p: {mood: m, ground: 'paper'}})),
  {name: 'closed', p: {mood: 'neutral', ground: 'paper', closed: true}},
  {name: 'plain', p: {mood: 'neutral', ground: 'paper', plain: true}},
  {name: 'look-left', p: {mood: 'curious', ground: 'paper', lx: -400, ly: 270}},
  {name: 'look-up', p: {mood: 'curious', ground: 'paper', lx: 400, ly: -500}},
  {name: 'ink-happy', p: {mood: 'happy', ground: 'ink'}},
  {name: 'ink-surprised', p: {mood: 'surprised', ground: 'ink'}},
];
for (const j of jobs) {
  const composition = await selectComposition({serveUrl, id: 'board-mood', inputProps: j.p, puppeteerInstance: b});
  await renderStill({serveUrl, composition, frame: 0, inputProps: j.p, output: `out/board/${j.name}.png`, puppeteerInstance: b, overwrite: true});
  process.stdout.write(j.name + ' ');
}
await b.close({silent: true});
