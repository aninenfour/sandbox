// "Marketplace · opening soon" promo (1080x1080, dark storefront). Items are teasers (??? PTS): the real
// marketplace catalogue is not public yet. Earn points now with Engage.
// Run: PW_PATH=$(npm root -g)/playwright node social/discord/join/market.mjs <scratch-dir>
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const OUT = ROOT + '/social/discord/join';
const SCR = process.argv[2];
const LOGO = 'file://' + ROOT + '/hotcoin-tradfi/public/brand/logo-official-white.png';
const SYM = 'file://' + ROOT + '/hotcoin-tradfi/public/brand/symbol-official-white.png';
const DISCORD_PATH = fs.readFileSync(ROOT + '/social/discord/engage/tutorial.mjs', 'utf8').match(/const DISCORD_PATH = '([^']+)'/)[1];
const dc = (s, c = '#5865F2') => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" style="flex:none"><path fill="${c}" d="${DISCORD_PATH}"/></svg>`;
const tape = 'OPENING SOON ✦ '.repeat(8);

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800;900&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=block');
:root{--ink:#07090A;--lime:#B8F26A;--green:#7EC25A;--muted:#8A938C;--blurple:#5865F2}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1080px;background:var(--ink);color:#F4F6F1;font-family:'Inter Tight','Noto Color Emoji',sans-serif;overflow:hidden}
.s{position:relative;width:1080px;height:1080px;overflow:hidden}
.glow{position:absolute;inset:0;background:radial-gradient(55% 45% at 50% 42%,rgba(184,242,106,.22),rgba(184,242,106,0) 70%),radial-gradient(40% 30% at 100% 0%,rgba(88,101,242,.25),rgba(88,101,242,0) 70%)}
/* perspective floor */
.floor{position:absolute;left:-40%;right:-40%;bottom:-120px;height:560px;transform:perspective(600px) rotateX(62deg);transform-origin:50% 0;
  background-image:linear-gradient(rgba(184,242,106,.22) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(184,242,106,.22) 1.5px,transparent 1.5px);background-size:70px 70px;
  mask-image:linear-gradient(180deg,transparent,#000 35%)}
.top{position:absolute;left:64px;right:64px;top:56px;display:flex;justify-content:space-between;align-items:center;z-index:5}
.tag{font-family:'JetBrains Mono';font-weight:700;font-size:17px;letter-spacing:3px;color:#fff;background:var(--blurple);padding:8px 30px 8px 14px;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 100%,0 100%)}
.logo{width:180px}
/* storefront */
.shop{position:absolute;left:110px;right:110px;top:150px;height:560px}
.awn{position:absolute;left:-30px;right:-30px;top:0;height:120px;border-radius:14px 14px 0 0;
  background:repeating-linear-gradient(90deg,var(--lime) 0 60px,#EAFBD2 60px 120px);box-shadow:0 20px 40px rgba(0,0,0,.45)}
.awn:after{content:'';position:absolute;left:0;right:0;bottom:-30px;height:30px;
  background:radial-gradient(circle at 30px 0,var(--lime) 29px,transparent 30px) 0 0/120px 30px repeat-x,radial-gradient(circle at 90px 0,#EAFBD2 29px,transparent 30px) 0 0/120px 30px repeat-x}
.awn .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.25),rgba(0,0,0,.18));border-radius:inherit}
.frame{position:absolute;left:0;right:0;top:120px;bottom:0;border:3px solid rgba(184,242,106,.55);border-top:none;border-radius:0 0 26px 26px;
  background:linear-gradient(180deg,rgba(20,32,16,.85),rgba(10,14,11,.92));box-shadow:inset 0 0 80px rgba(184,242,106,.10),0 40px 80px rgba(0,0,0,.6)}
.sign{position:absolute;left:0;right:0;top:160px;text-align:center;font-family:Unbounded;font-weight:900;font-size:76px;letter-spacing:-2px;color:#F6FFE9;
  text-shadow:0 0 18px rgba(184,242,106,.85),0 0 46px rgba(184,242,106,.55),0 0 90px rgba(184,242,106,.35)}
.sub{position:absolute;left:0;right:0;top:262px;text-align:center;font-family:'JetBrains Mono';font-weight:700;font-size:18px;letter-spacing:6px;color:var(--lime)}
.shelf{position:absolute;left:44px;right:44px;top:470px;height:16px;border-radius:8px;background:linear-gradient(180deg,#2c3a23,#151d12);box-shadow:0 14px 26px rgba(0,0,0,.6)}
.items{position:absolute;left:60px;right:60px;top:318px;height:152px;display:flex;justify-content:space-between;align-items:flex-end}
.it{position:relative;display:flex;flex-direction:column;align-items:center}
.ptag{position:absolute;top:-14px;right:-34px;transform:rotate(12deg);background:#F6FFE9;color:var(--ink);font-family:'JetBrains Mono';font-weight:700;font-size:15px;padding:6px 10px 6px 18px;border-radius:6px;
  clip-path:polygon(10px 0,100% 0,100% 100%,10px 100%,0 50%);box-shadow:0 6px 14px rgba(0,0,0,.4)}
/* item 1: gift box */
.box{width:130px;height:104px;position:relative;border-radius:10px;background:linear-gradient(160deg,#CFFF8A,#8FD84E);box-shadow:0 18px 30px rgba(0,0,0,.5),inset 0 -8px 16px rgba(0,0,0,.15)}
.box:before{content:'';position:absolute;left:56px;top:0;bottom:0;width:18px;background:var(--ink)}
.lid{position:absolute;left:-8px;right:-8px;top:-26px;height:30px;border-radius:8px;background:linear-gradient(160deg,#DFFFAE,#9FE05A);box-shadow:0 6px 12px rgba(0,0,0,.35)}
.lid:before{content:'';position:absolute;left:64px;top:0;bottom:0;width:18px;background:var(--ink)}
.bow{position:absolute;left:44px;top:-56px;width:58px;height:34px}
.bow:before,.bow:after{content:'';position:absolute;top:0;width:30px;height:30px;border:7px solid var(--ink);border-radius:50% 50% 0 50%}
.bow:before{left:-2px;transform:rotate(20deg)}.bow:after{right:-2px;transform:scaleX(-1) rotate(20deg)}
/* item 2: ticket */
.tk{width:250px;height:108px;border-radius:14px;position:relative;background:linear-gradient(135deg,#F6FFE9,#D7F7B0);color:var(--ink);transform:rotate(-6deg);box-shadow:0 18px 30px rgba(0,0,0,.5);
  -webkit-mask:radial-gradient(circle at 0 50%,transparent 15px,#000 16px) left/51% 100% no-repeat,radial-gradient(circle at 100% 50%,transparent 15px,#000 16px) right/51% 100% no-repeat;
  display:flex;flex-direction:column;justify-content:center;padding-left:34px}
.tk .a{font-family:'JetBrains Mono';font-weight:700;font-size:13px;letter-spacing:3px;opacity:.6}
.tk .b{font-family:Unbounded;font-weight:900;font-size:30px;letter-spacing:-1px}
.tk:after{content:'';position:absolute;right:40px;top:12px;bottom:12px;border-left:2px dashed rgba(7,9,10,.35)}
/* item 3: mystery orb with the Hotcoin symbol */
.orb{width:120px;height:120px;border-radius:50%;position:relative;background:radial-gradient(circle at 35% 30%,#3a4a33,#0d130b 70%);box-shadow:0 18px 30px rgba(0,0,0,.6),inset 0 0 0 2px rgba(184,242,106,.5),0 0 40px rgba(184,242,106,.25);
  display:flex;align-items:center;justify-content:center}
.orb img{width:58px;opacity:.95}
.orb:after{content:'';position:absolute;left:22px;top:14px;width:40px;height:22px;border-radius:50%;background:rgba(255,255,255,.28);filter:blur(3px)}
.lbl{margin-top:14px;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:3px;color:var(--muted)}
/* tape */
.tape{position:absolute;left:-60px;right:-60px;top:676px;height:72px;transform:rotate(-6deg);background:var(--lime);color:var(--ink);display:flex;align-items:center;white-space:nowrap;overflow:hidden;
  font-family:Unbounded;font-weight:900;font-size:34px;letter-spacing:1px;box-shadow:0 18px 40px rgba(0,0,0,.55);z-index:4}
.tape span{padding-left:20px}
.tape2{position:absolute;left:-60px;right:-60px;top:690px;height:60px;transform:rotate(4deg);background:#1a2416;border-top:2px solid rgba(184,242,106,.4);border-bottom:2px solid rgba(184,242,106,.4);z-index:3;
  display:flex;align-items:center;white-space:nowrap;overflow:hidden;font-family:'JetBrains Mono';font-weight:700;font-size:20px;letter-spacing:4px;color:rgba(184,242,106,.7)}
/* bottom */
.bot{position:absolute;left:64px;right:64px;bottom:48px;z-index:5}
.h{font-family:Unbounded;font-weight:800;font-size:40px;line-height:1.08;letter-spacing:-1px}
.h em{font-style:normal;color:var(--lime)}
.steps{display:flex;gap:12px;margin-top:18px;font-size:20px;font-weight:600;align-items:center}
.steps span.c{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:9px 16px}
.steps .ar{color:var(--muted)}
.cta{display:flex;align-items:center;gap:14px;margin-top:22px;font-family:'JetBrains Mono';font-size:18px;color:var(--muted);letter-spacing:1px}
.cta b{color:#fff;font-weight:700;font-size:22px}
.cta .go{margin-left:auto;background:var(--lime);color:var(--ink);font-family:Unbounded;font-weight:800;font-size:20px;letter-spacing:0;border-radius:12px;padding:12px 18px}
</style></head><body><div class="s"><div class="glow"></div><div class="floor"></div>
<div class="top"><div class="tag">HOTCOIN DISCORD · MARKETPLACE</div><img class="logo" src="${LOGO}"></div>
<div class="shop">
 <div class="awn"><div class="shade"></div></div>
 <div class="frame"></div>
 <div class="sign">MARKETPLACE</div>
 <div class="sub">SPEND YOUR ENGAGE POINTS</div>
 <div class="items">
  <div class="it"><div class="box"><div class="lid"></div><div class="bow"></div></div><div class="ptag">??? PTS</div></div>
  <div class="it"><div class="tk"><span class="a">HOTCOIN</span><span class="b">REWARD</span></div><div class="ptag" style="right:-20px">??? PTS</div></div>
  <div class="it"><div class="orb"><img src="${SYM}"></div><div class="ptag" style="right:-40px">??? PTS</div></div>
 </div>
 <div class="shelf"></div>
</div>
<div class="tape2">${'EARN NOW · SPEND SOON · '.repeat(8)}</div>
<div class="tape"><span>${tape}</span></div>
<div class="bot">
 <div class="h">Start stacking <em>points</em> now.<br>Shop drops soon.</div>
 <div class="steps"><span class="c">🔗 Connect X</span><span class="ar">→</span><span class="c">💬 Engage on Hotcoin posts</span><span class="ar">→</span><span class="c">💠 Collect points</span></div>
 <div class="cta">${dc(30)}<b>discord.gg/hotcoin</b><span class="go">Join →</span></div>
</div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1080, height: 1080}, deviceScaleFactor: 2});
const f = `${SCR}/market.html`; fs.writeFileSync(f, html);
await page.goto('file://' + f, {waitUntil: 'networkidle'});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({path: `${OUT}/02-marketplace-opening-soon.png`});
console.log('ok');
await browser.close();
