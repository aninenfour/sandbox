// PT meme 21/11: real template "This is fine" (KC Green, Gunshow #648), re-captioned in pt-BR (owner rule 15/11: real templates allowed).
// Data: BTC/USDT 60,315.62 (-1.76% 24h), Hotcoin ticker 21/11 12:09 Brasília; Crypto Fear & Greed 12 (Extreme Fear), api.alternative.me/fng 21/11.
// Template file: art/meme/template-thisisfine.jpg (imgflip). Run: PW_PATH=$(npm root -g)/playwright node social/pt/meme_fine.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const T = 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/meme/template-thisisfine.jpg`).toString('base64');
const L = 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png').toString('base64');
const k = 984 / 580, top = 240;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;800&family=Patrick+Hand&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1080px;overflow:hidden;position:relative;background:#fff}
</style></head><body>
<div style="position:absolute;left:72px;right:72px;top:64px;font-family:'Inter Tight';font-size:50px;font-weight:600;line-height:1.2;color:#0B0E11;letter-spacing:-.5px">eu no sábado com BTC a US$ 60 mil e o índice de medo em 12</div>
<img src="${T}" style="position:absolute;left:48px;top:${top}px;width:984px;image-rendering:auto">
<div style="position:absolute;left:${48 + 366 * k}px;top:${top + 22 * k}px;width:${172 * k}px;height:${40 * k}px;background:#fff;display:flex;align-items:center;justify-content:center;font-family:'Patrick Hand';font-size:40px;color:#222;letter-spacing:1px">TÁ TUDO ÓTIMO.</div>
<img src="${L}" style="position:absolute;right:72px;bottom:64px;height:30px">
</body></html>`;
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1080}, deviceScaleFactor: 2});
await pg.setContent(html, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
fs.mkdirSync(`${DIR}/day-2026-11-21-br`, {recursive: true}); await pg.screenshot({path: `${DIR}/day-2026-11-21-br/meme-fine.png`}); await br.close(); console.log('ok');
