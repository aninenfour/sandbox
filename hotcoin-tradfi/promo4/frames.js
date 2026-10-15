// Renders promo4/<page>.html frame by frame (window.renderFrame) to transparent PNGs.
// usage: node promo4/frames.js <page> <outDir> <from> <to> [query]
const fs = require('fs');
const {chromium} = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const [, , page, out, from, to, query = ''] = process.argv;
  fs.mkdirSync(out, {recursive: true});
  const b = await chromium.launch({executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
  const p = await b.newPage({viewport: {width: 1920, height: 1080}});
  p.on('pageerror', (e) => console.log('pageerror:', e.message));
  await p.goto(`http://127.0.0.1:8765/promo4/${page}.html?${query}`, {waitUntil: 'load'});
  await p.waitForFunction(() => document.title === 'ready', null, {timeout: 120000});
  for (let f = +from; f <= +to; f++) {
    const data = await p.evaluate((fr) => { window.renderFrame(fr); return document.querySelector('canvas').toDataURL('image/png'); }, f);
    fs.writeFileSync(`${out}/${String(f).padStart(4, '0')}.png`, Buffer.from(data.split(',')[1], 'base64'));
  }
  await b.close();
})();
