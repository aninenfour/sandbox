// PT meme 25/11: serious photo + unhinged caption, no data claims.
// Photo: atelierbyvineeth (Unsplash d2f6fMwGvvA), Unsplash License, anonymous (hands and phone only). Run: PW_PATH=$(npm root -g)/playwright node social/pt/meme_celular.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const P = 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/meme/phoneback-m.jpg`).toString('base64');
const L = 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png').toString('base64');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#fff}
</style></head><body>
<div style="position:absolute;left:0;right:0;top:0;height:290px;padding:60px 72px 0;font-family:'Inter Tight';font-size:50px;font-weight:600;line-height:1.2;color:#0B0E11;letter-spacing:-.5px">eu na ceia de Natal quando a tia pergunta &ldquo;e aquele bitcoin, tá rendendo?&rdquo;</div>
<div style="position:absolute;left:0;right:0;top:290px;bottom:0;background:url(${P}) 50% 45%/cover no-repeat"></div>
<img src="${L}" style="position:absolute;left:52px;bottom:48px;height:30px;filter:drop-shadow(0 2px 8px rgba(0,0,0,.5))">
</body></html>`;
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await pg.setContent(html, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
await pg.screenshot({path: `${DIR}/day-2026-11-25-br/meme-celular.png`}); await br.close(); console.log('ok');
