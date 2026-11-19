// Giveaway poster, Portuguese first with English, 1080x1350 @2x. Style: R10 Zealy poster (dark, lime, Inter Tight / JetBrains Mono).
// Brief (Nov 19, 2026): follow @HotcoinGlobal and @Hotcoin_PT (handles checked via the accounts' own posts), submit Hotcoin UID,
//   US$500 in futures trial vouchers, random draw, new users only, register via https://www.hotcoin.com/r/Collab.
// Background: AI generated (fal, fal-ai/flux/schnell), lime gift box, no logos. Run: PW_PATH=$(npm root -g)/playwright node render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png';
const LIME = '#B8F26A', INK = '#07090A';
const steps = [
  ['Siga <b>@HotcoinGlobal</b> e <b>@Hotcoin_PT</b>', 'Follow @HotcoinGlobal and @Hotcoin_PT', ''],
  ['Cadastre-se em <b>hotcoin.com/r/Collab</b>', 'Register at hotcoin.com/r/Collab', 'SÓ NOVOS USUÁRIOS · NEW USERS ONLY'],
  ['Envie seu <b>UID da Hotcoin</b>', 'Submit your Hotcoin UID', ''],
];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:${INK};color:#fff;font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
.bg{position:absolute;left:330px;top:-90px;width:960px;height:1200px;-webkit-mask-image:radial-gradient(ellipse 48% 46% at 52% 50%,#000 62%,transparent 100%)}
.shade{position:absolute;inset:0;background:linear-gradient(0deg,${INK} 0%,rgba(7,9,10,.97) 34%,rgba(7,9,10,0) 48%)}
.top{position:absolute;left:64px;right:64px;top:62px;display:flex;justify-content:space-between;align-items:center}
.pill{font-family:'JetBrains Mono';font-weight:700;font-size:16px;letter-spacing:2.2px;padding:10px 18px;border-radius:99px;border:1.5px solid ${LIME};color:${LIME}}
.hi{position:absolute;left:64px;top:168px}
.hi .pt{font-weight:800;font-size:84px;letter-spacing:-3px;line-height:1}
.hi .en{font-family:'JetBrains Mono';font-weight:500;font-size:22px;letter-spacing:3px;color:rgba(255,255,255,.55);margin-top:14px}
.prize{position:absolute;left:58px;top:330px}
.prize .n{font-weight:900;font-size:190px;letter-spacing:-9px;line-height:.9;background:linear-gradient(180deg,#fff 25%,${LIME} 130%);-webkit-background-clip:text;color:transparent;padding-right:10px}
.prize .n small{font-size:80px;letter-spacing:-3px;margin-right:6px}
.prize .pt{font-size:34px;font-weight:700;letter-spacing:-.6px;margin:18px 0 0 6px;line-height:1.15}
.prize .pt span{color:${LIME}}
.prize .en{font-size:22px;font-weight:500;color:rgba(255,255,255,.55);margin:8px 0 0 6px}
.steps{position:absolute;left:64px;right:64px;top:820px}
.s{display:flex;gap:26px;align-items:flex-start;padding:22px 0;border-top:1.5px solid rgba(255,255,255,.16)}
.s .i{flex:none;width:52px;height:52px;border-radius:50%;background:${LIME};color:${INK};font-weight:900;font-size:26px;display:flex;align-items:center;justify-content:center}
.s .pt{font-size:31px;font-weight:600;letter-spacing:-.4px;line-height:1.2}
.s .pt b{font-weight:800}
.s .en{font-size:21px;font-weight:500;color:rgba(255,255,255,.55);margin-top:5px}
.s .tag{display:inline-block;margin-top:10px;font-family:'JetBrains Mono';font-weight:700;font-size:14px;letter-spacing:1.6px;color:${LIME};border:1.5px solid rgba(184,242,106,.6);border-radius:99px;padding:5px 12px}
.foot{position:absolute;left:64px;right:64px;bottom:64px;display:flex;justify-content:space-between;align-items:center}
.foot .t{font-family:'JetBrains Mono';font-weight:700;font-size:18px;letter-spacing:2px;color:rgba(255,255,255,.7);line-height:1.6}
.btn{display:flex;align-items:center;gap:12px;background:${LIME};color:${INK};font-weight:800;font-size:28px;letter-spacing:-.4px;padding:20px 30px;border-radius:99px;box-shadow:0 0 70px rgba(184,242,106,.35)}
</style></head><body>
<img class="bg" src="file://${DIR}bg-b.png"><div class="shade"></div>
<div class="top"><img src="${LOGO}" style="height:38px"><div class="pill">SORTEIO · GIVEAWAY</div></div>
<div class="hi"><div class="pt">Olá a todos!</div><div class="en">HI EVERYONE</div></div>
<div class="prize"><div class="n"><small>US$</small>500</div>
  <div class="pt">em <span>vouchers de teste</span><br>para futuros</div><div class="en">in futures trial vouchers</div></div>
<div class="steps">${steps.map(([pt, en, tag], i) => `<div class="s"><div class="i">${i + 1}</div><div><div class="pt">${pt}</div><div class="en">${en}</div>${tag ? `<div class="tag">${tag}</div>` : ''}</div></div>`).join('')}</div>
<div class="foot"><div class="t">SORTEIO ALEATÓRIO<br>RANDOM DRAW</div><div class="btn">hotcoin.com/r/Collab<svg width="22" height="22" viewBox="0 0 22 22"><path d="M5 11h12M12 5l6 6-6 6" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>
</body></html>`;

const f = `${DIR}_poster-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await p.goto('file://' + f);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);
await p.screenshot({path: `${DIR}hotcoin-giveaway-pt.png`});
await b.close();
fs.unlinkSync(f);
console.log('ok');
