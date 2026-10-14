// Renders an art2 page with headless Chromium (WebGL) and saves a transparent PNG.
const {chromium} = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const [, , url, out, w = '1080', h = '1350', dpr = '2'] = process.argv;
  const b = await chromium.launch({executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
  const p = await b.newPage({viewport: {width: +w, height: +h}, deviceScaleFactor: 1});
  p.on('console', (m) => console.log('console:', m.text()));
  p.on('pageerror', (e) => console.log('pageerror:', e.message));
  await p.goto(url, {waitUntil: 'load'});
  await p.waitForFunction(() => document.title === 'ready', null, {timeout: 120000});
  const data = await p.evaluate(() => document.querySelector('canvas').toDataURL('image/png'));
  require('fs').writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
  await b.close();
})();
