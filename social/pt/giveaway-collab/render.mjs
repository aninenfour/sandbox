// Giveaway poster, Portuguese first with English, 1080x1080 @2x. Brazilian look (Copacabana waves, palms), lime + yellow accent.
// Brief (Nov 19, 2026): follow @HotcoinGlobal and @Hotcoin_PT (handles checked via the accounts' own posts), submit Hotcoin UID,
//   US$500 in futures trial vouchers, random draw, new users only, register via https://www.hotcoin.com/r/Collab.
// Background: AI generated (fal, fal-ai/flux/schnell), bg-br-a.png mirrored, no logos or flags. Run: PW_PATH=$(npm root -g)/playwright node render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png';
const LIME = '#B8F26A', INK = '#07090A';
const steps = [
  ['Siga <b>@HotcoinGlobal</b> e <b>@Hotcoin_PT</b>', 'Follow @HotcoinGlobal and @Hotcoin_PT', ''],
  ['Cadastre-se em <b>hotcoin.com/r/Collab</b>', '<em>Só novos usuários</em> · Register, new users only', ''],
  ['Envie seu <b>UID da Hotcoin</b>', 'Submit your Hotcoin UID', ''],
];

const YEL = '#FFD84A', EM = '#03190C';
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;background:${EM};color:#fff;font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
.bg{position:absolute;left:200px;top:-60px;width:1178px;height:1178px;transform:scaleX(-1)}
.shade{position:absolute;inset:0;background:
  linear-gradient(90deg,rgba(3,25,12,.96) 0%,rgba(3,25,12,.9) 40%,rgba(3,25,12,.35) 58%,rgba(3,25,12,0) 70%),
  linear-gradient(180deg,rgba(3,25,12,.75) 0%,rgba(3,25,12,0) 16%)}
.top{position:absolute;left:60px;right:60px;top:56px;display:flex;justify-content:space-between;align-items:center}
.pill{font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;padding:9px 16px;border-radius:99px;background:${YEL};color:${EM}}
.hi{position:absolute;left:60px;top:140px}
.hi .pt{font-weight:900;font-size:76px;letter-spacing:-3px;line-height:1;color:${YEL}}
.hi .en{font-family:'JetBrains Mono';font-weight:500;font-size:19px;letter-spacing:3px;color:rgba(255,255,255,.6);margin-top:10px}
.prize{position:absolute;left:54px;top:262px}
.prize .n{font-weight:900;font-size:168px;letter-spacing:-8px;line-height:.9;background:linear-gradient(180deg,#fff 20%,${LIME} 110%);-webkit-background-clip:text;color:transparent;padding-right:10px}
.prize .n small{font-size:68px;letter-spacing:-3px;margin-right:6px}
.prize .pt{font-size:31px;font-weight:800;letter-spacing:-.6px;margin:14px 0 0 6px;line-height:1.12}
.prize .pt span{color:${LIME}}
.prize .en{font-size:20px;font-weight:500;color:rgba(255,255,255,.62);margin:6px 0 0 6px}
.steps{position:absolute;left:60px;width:540px;top:585px}
.s{display:flex;gap:18px;align-items:flex-start;padding:15px 0;border-top:1.5px solid rgba(255,255,255,.16)}
.s .i{flex:none;width:42px;height:42px;border-radius:50%;background:${LIME};color:${EM};font-weight:900;font-size:22px;display:flex;align-items:center;justify-content:center}
.s .pt{font-size:25px;font-weight:600;letter-spacing:-.3px;line-height:1.2}
.s .pt b{font-weight:800}
.s .en{font-size:17px;font-weight:500;color:rgba(255,255,255,.6);margin-top:4px}
.s .en em{font-style:normal;color:${YEL};font-weight:700}
.foot{position:absolute;left:60px;bottom:56px;display:flex;align-items:center;gap:22px}
.foot .t{font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:1.8px;color:rgba(255,255,255,.75);line-height:1.6}
.btn{display:flex;align-items:center;gap:12px;background:${LIME};color:${EM};font-weight:800;font-size:25px;letter-spacing:-.4px;padding:17px 26px;border-radius:99px;box-shadow:0 0 60px rgba(184,242,106,.4)}
</style></head><body>
<img class="bg" src="file://${DIR}bg-br-a.png"><div class="shade"></div>
<div class="top"><img src="${LOGO}" style="height:36px"><div class="pill">SORTEIO · GIVEAWAY</div></div>
<div class="hi"><div class="pt">Olá a todos!</div><div class="en">HI EVERYONE</div></div>
<div class="prize"><div class="n"><small>US$</small>500</div>
  <div class="pt">em <span>vouchers de teste</span><br>para futuros</div><div class="en">in futures trial vouchers</div></div>
<div class="steps">${steps.map(([pt, en, tag], i) => `<div class="s"><div class="i">${i + 1}</div><div><div class="pt">${pt}</div><div class="en">${en}${tag ? ` · <em>${tag}</em>` : ''}</div></div></div>`).join('')}</div>
<div class="foot"><div class="btn">hotcoin.com/r/Collab<svg width="20" height="20" viewBox="0 0 22 22"><path d="M5 11h12M12 5l6 6-6 6" fill="none" stroke="${EM}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="t">SORTEIO ALEATÓRIO<br>RANDOM DRAW</div></div>
</body></html>`;

const f = `${DIR}_poster-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1080}, deviceScaleFactor: 2});
await p.goto('file://' + f);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);
await p.screenshot({path: `${DIR}hotcoin-giveaway-pt-1x1.png`});
await b.close();
fs.unlinkSync(f);
console.log('ok');
