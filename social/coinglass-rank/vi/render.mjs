// Hotcoin on CoinGlass, #13 (Vietnamese), 1080x1080 @2x. Redo of the team's square post, same copy and QR target.
// Fact: Hotcoin ranked #13 in CoinGlass's derivatives exchange ranking (screenshot Nov 12, 2026, see social/coinglass-rank/render.mjs).
// QR: https://www.coinglass.com/vi/exchanges/Hotcoin (decoded from the team's draft, re-encoded clean).
// Background: AI generated (fal, fal-ai/flux/schnell), glass staircase. CoinGlass logo: official SVG from coinglass.com.
// Run: PW_PATH=$(npm root -g)/playwright node render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png';
const CG = 'file:///home/user/sandbox/social/coinglass-collab/assets/coinglass-logo.svg';
const LIME = '#B8F26A', INK = '#07090A';

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&subset=vietnamese&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;background:${INK};color:#fff;font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
.bg{position:absolute;left:40px;top:0;width:1080px;height:1080px}
.shade{position:absolute;inset:0;background:
  linear-gradient(90deg,rgba(7,9,10,.96) 0%,rgba(7,9,10,.82) 34%,rgba(7,9,10,0) 62%),
  linear-gradient(180deg,rgba(7,9,10,.85) 0%,rgba(7,9,10,0) 18%),
  linear-gradient(0deg,rgba(7,9,10,.97) 0%,rgba(7,9,10,.85) 15%,rgba(7,9,10,0) 32%)}
.top{position:absolute;left:64px;top:60px;display:flex;align-items:center;gap:26px}
.top i{width:1.5px;height:34px;background:rgba(255,255,255,.4)}
.kick{position:absolute;left:66px;top:168px;font-family:'JetBrains Mono';font-weight:700;font-size:19px;letter-spacing:4px;color:${LIME}}
h1{position:absolute;left:62px;top:206px;font-weight:800;font-size:70px;letter-spacing:-2.6px;line-height:1.04}
h1 span{color:${LIME}}
.rank{position:absolute;left:58px;top:445px;display:flex;align-items:flex-end;gap:22px}
.rank .n{font-weight:900;font-size:300px;letter-spacing:-16px;line-height:.8;background:linear-gradient(180deg,#fff 20%,${LIME} 140%);-webkit-background-clip:text;color:transparent;padding-right:16px}
.rank .h{font-family:'JetBrains Mono';font-weight:700;font-size:34px;color:${LIME};margin-bottom:180px;margin-left:-6px}
.cap{position:absolute;left:66px;top:712px;width:470px;font-size:27px;font-weight:600;line-height:1.3;color:rgba(255,255,255,.88)}
.cap b{color:#fff;font-weight:800}
.foot{position:absolute;left:64px;right:64px;bottom:60px;display:flex;align-items:flex-end;justify-content:space-between}
.foot .t{font-size:26px;font-weight:600;line-height:1.3;color:rgba(255,255,255,.85);padding-bottom:6px}
.foot .t em{font-style:normal;color:${LIME}}
.qr{width:188px;height:188px;background:#fff;border-radius:22px;padding:16px;box-shadow:0 0 0 4px ${LIME},0 0 60px rgba(184,242,106,.35)}
.qr img{width:100%;height:100%;display:block;image-rendering:pixelated}
</style></head><body>
<img class="bg" src="file://${DIR}bg2.png">
<div class="shade"></div>
<div class="top"><img src="${LOGO}" style="height:38px"><i></i><img src="${CG}" style="height:38px"></div>
<div class="kick">COINGLASS · 12/11/2026</div>
<h1>Hotcoin đã có mặt<br>trên <span>CoinGlass</span></h1>
<div class="rank"><div class="n">13</div></div>
<div class="cap"><b>Xếp hạng thứ 13</b> trong Bảng xếp hạng các sàn giao dịch phái sinh tiền mã hóa</div>
<div class="foot"><div class="t">Quét mã để xem dữ liệu<br>Hotcoin trên CoinGlass <em>→</em></div><div class="qr"><img src="file://${DIR}qr.png"></div></div>
</body></html>`;

const f = `${DIR}_poster-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1080}, deviceScaleFactor: 2});
await p.goto('file://' + f);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);
await p.screenshot({path: `${DIR}hotcoin-coinglass-13-vi.png`});
await b.close();
fs.unlinkSync(f);
console.log('ok');
