// PT meme 23/11 (Monday): real template "Drake Hotline Bling" (imgflip 30b1gx), re-captioned in pt-BR (owner rule 15/11). Callback to the 22/11 21:13 text post.
// No prices/data. Run: PW_PATH=$(npm root -g)/playwright node social/pt/meme_drake.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const T = 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/meme/template-drake.jpg`).toString('base64');
const L = 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png').toString('base64');
const S = 984 / 1200, X = 48, Y = 48;
const cell = (top, txt) => `<div style="position:absolute;left:${X + 600 * S + 36}px;top:${Y + top * S}px;width:${600 * S - 72}px;height:${600 * S}px;display:flex;align-items:center;font-family:'Inter Tight';font-size:46px;font-weight:600;line-height:1.18;color:#0B0E11;letter-spacing:-.3px">${txt}</div>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1080px;overflow:hidden;position:relative;background:#fff}
</style></head><body>
<img src="${T}" style="position:absolute;left:${X}px;top:${Y}px;width:984px">
${cell(0, 'usar stop loss')}
${cell(600, 'jurar no domingo que começa a usar na segunda')}
<img src="${L}" style="position:absolute;right:60px;bottom:36px;height:26px">
</body></html>`;
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1080}, deviceScaleFactor: 2});
await pg.setContent(html, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
fs.mkdirSync(`${DIR}/day-2026-11-23-br`, {recursive: true}); await pg.screenshot({path: `${DIR}/day-2026-11-23-br/meme-drake.png`}); await br.close(); console.log('ok');
