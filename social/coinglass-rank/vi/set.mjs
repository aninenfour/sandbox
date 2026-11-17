// Hotcoin x CoinGlass, Vietnamese set, posts 2 and 3 (post 1 is render.mjs). 1080x1080 @2x, same look as post 1.
// Facts from the real CoinGlass page (screenshot cg-ui.webp, Nov 17, 2026, coinglass.com/vi/exchanges/Hotcoin):
//   score 60, 24h futures volume $6.69B, open interest $2.44B, total assets $124.33M, 715 futures pairs.
//   Vietnamese number format: comma decimal ("6,69 tỷ USD"). OI label "Hợp đồng mở" (the draft's "Lãi suất mở" means interest rate).
//   Dates only on post 2 (under the numbers), per the user.
// Backgrounds: bg3.png (fal flux schnell, same batch as post 1). Run: PW_PATH=$(npm root -g)/playwright node set.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const CG = 'file:///home/user/sandbox/social/coinglass-collab/assets/coinglass-logo.svg';
const LIME = '#B8F26A', INK = '#07090A';

const base = `@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&subset=vietnamese&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;background:${INK};color:#fff;font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
.m{font-family:'JetBrains Mono',monospace}
.top{position:absolute;left:64px;top:60px;display:flex;align-items:center;gap:26px;z-index:5}
.top i{width:1.5px;height:34px;background:rgba(255,255,255,.4)}
.kick{position:absolute;left:66px;top:168px;font-family:'JetBrains Mono';font-weight:700;font-size:19px;letter-spacing:4px;color:${LIME}}
h1{position:absolute;left:62px;top:206px;font-weight:800;letter-spacing:-2.4px;line-height:1.06}
h1 span{color:${LIME}}`;
const head = `<div class="top"><img src="${BR}logo-official-white.png" style="height:38px"><i></i><img src="${CG}" style="height:38px"></div>`;
const page = (css, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${base}${css}</style></head><body>${head}${body}</body></html>`;

// Post 2: 715 pairs, three stats
const P2 = page(`
.bg{position:absolute;left:580px;top:130px;width:860px;height:860px;opacity:.95;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 42% 52%,#000 55%,transparent 100%)}
.shade{position:absolute;inset:0;background:
  linear-gradient(90deg,rgba(7,9,10,.97) 0%,rgba(7,9,10,.85) 38%,rgba(7,9,10,0) 66%),
  linear-gradient(180deg,rgba(7,9,10,.85) 0%,rgba(7,9,10,0) 18%),
  linear-gradient(0deg,rgba(7,9,10,1) 0%,rgba(7,9,10,.94) 26%,rgba(7,9,10,0) 46%)}
.hero{position:absolute;left:56px;top:420px;display:flex;align-items:flex-end;gap:26px}
.hero .n{font-weight:900;font-size:220px;letter-spacing:-12px;line-height:.8;background:linear-gradient(180deg,#fff 20%,${LIME} 140%);-webkit-background-clip:text;color:transparent;padding-right:12px}
.hero .l{font-size:36px;font-weight:700;line-height:1.15;letter-spacing:-.8px;padding-bottom:10px}
.stats{position:absolute;left:64px;right:64px;bottom:120px;display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1.5px solid rgba(255,255,255,.22)}
.st{padding-top:26px}
.st + .st{padding-left:30px;border-left:1.5px solid rgba(255,255,255,.22)}
.st .k{font-family:'JetBrains Mono';font-weight:500;font-size:16px;letter-spacing:1.4px;color:rgba(255,255,255,.62);line-height:1.4}
.st .v{font-weight:800;font-size:54px;letter-spacing:-2px;line-height:1;margin-top:14px}
.st .v small{font-size:24px;font-weight:700;letter-spacing:-.4px;margin-left:8px;color:${LIME}}
.date{position:absolute;left:64px;bottom:62px;font-family:'JetBrains Mono';font-size:16px;letter-spacing:1.6px;color:rgba(255,255,255,.55)}`, `
<img class="bg" src="file://${DIR}bg3.png"><div class="shade"></div>
<div class="kick">DỮ LIỆU HỢP ĐỒNG · COINGLASS</div>
<h1 style="font-size:58px">CoinGlass đã ghi nhận<br>dữ liệu thị trường hợp đồng<br>của <span>Hotcoin</span></h1>
<div class="hero"><div class="n">715</div><div class="l">cặp giao dịch<br>hợp đồng</div></div>
<div class="stats">
  <div class="st"><div class="k">KHỐI LƯỢNG<br>HỢP ĐỒNG 24H</div><div class="v">6,69<small>tỷ USD</small></div></div>
  <div class="st"><div class="k">HỢP ĐỒNG MỞ<br>(OPEN INTEREST)</div><div class="v">2,44<small>tỷ USD</small></div></div>
  <div class="st"><div class="k">TỔNG TÀI SẢN<br>&nbsp;</div><div class="v">124<small>triệu USD</small></div></div>
</div>
<div class="date">DỮ LIỆU NGÀY 17/11/2026 (UTC+8)</div>`);

// Post 3: dedicated data page launched, real CoinGlass UI (cg-ui.webp, left panel) + four features
const icon = {
  layers: `<path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" fill="none" stroke="${LIME}" stroke-width="2" stroke-linejoin="round"/>`,
  bars: `<path d="M5 20V12M12 20V6M19 20V9" stroke="${LIME}" stroke-width="2.6" stroke-linecap="round"/>`,
  trend: `<path d="M3 17l6-6 4 4 8-8M15 7h6v6" fill="none" stroke="${LIME}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  pct: `<path d="M19 5L5 19" stroke="${LIME}" stroke-width="2.2" stroke-linecap="round"/><circle cx="7" cy="7" r="2.6" fill="none" stroke="${LIME}" stroke-width="2"/><circle cx="17" cy="17" r="2.6" fill="none" stroke="${LIME}" stroke-width="2"/>`,
};
const feats = [['layers', 'Lịch sử hợp đồng mở'], ['bars', 'Xu hướng khối lượng'], ['trend', 'Biến động hợp đồng mở'], ['pct', 'Biến động Funding Rate']];
const P3 = page(`
.glow{position:absolute;left:140px;right:140px;top:560px;height:420px;background:radial-gradient(ellipse at 50% 50%,rgba(184,242,106,.28),rgba(184,242,106,0) 68%);filter:blur(10px)}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.06) 1px,transparent 1.3px);background-size:6px 6px}
.win{position:absolute;left:54px;right:54px;top:416px;border-radius:22px;border:1.5px solid rgba(184,242,106,.5);box-shadow:0 40px 90px rgba(0,0,0,.65),0 0 0 8px rgba(184,242,106,.06),0 0 90px rgba(184,242,106,.18);overflow:hidden;line-height:0}
.win img{width:100%;display:block}
.feats{position:absolute;left:64px;right:64px;bottom:58px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.f{display:flex;align-items:center;gap:12px;font-weight:700;font-size:19px;line-height:1.2;letter-spacing:-.2px}
.f .i{flex:none;width:44px;height:44px;border-radius:12px;border:1.5px solid rgba(184,242,106,.5);display:flex;align-items:center;justify-content:center}`, `
<div class="dots"></div><div class="glow"></div>
<div class="kick">TRANG DỮ LIỆU · COINGLASS</div>
<h1 style="font-size:56px">Trang dữ liệu riêng của Hotcoin<br>trên CoinGlass <span>đã chính thức<br>ra mắt</span></h1>
<div class="win"><img src="file://${DIR}cg-ui-crop.png"></div>
<div class="feats">${feats.map(([ic, t]) => `<div class="f"><div class="i"><svg width="24" height="24" viewBox="0 0 24 24">${icon[ic]}</svg></div>${t}</div>`).join('')}</div>`);

const b = await chromium.launch({args: ['--allow-file-access-from-files']});
for (const [name, html] of [['hotcoin-coinglass-data-vi', P2], ['hotcoin-coinglass-page-vi', P3]]) {
  const f = `${DIR}_${name}-${process.pid}.html`;
  fs.writeFileSync(f, html);
  const p = await b.newPage({viewport: {width: 1080, height: 1080}, deviceScaleFactor: 2});
  await p.goto('file://' + f);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({path: `${DIR}${name}.png`});
  await p.close();
  fs.unlinkSync(f);
}
await b.close();
console.log('ok');
