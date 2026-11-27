// "Welcome $BLZ to Hotcoin" giveaway posters, 4:5 (1080x1350 @2x). Two looks, neither reuses the BTH candy style.
//   A "dog tag": blank lime tag on a blue collar (FLUX schnell, assets/tag-1.jpg), the reward engraved on it in CSS.
//   B "boarding pass": pure HTML ticket on lime, BLZ -> HOT route, reward fields, perforated lucky-draw stub.
// BLZ logo: CoinGecko coin image (bluzo, "original" size), assets/blz-original.jpg. Hotcoin logos: hotcoin-tradfi/public/brand.
// Facts: Bluzo is a Solana memecoin, contract B79vBm5GccEPLFkxs1X6ibL2BxeqHhY54E2VKBz158V7, X @Bluzo_Token (CoinGecko, Nov 27, 2026).
// Rewards (from Alex, Nov 27, 2026): $500 in futures trial vouchers = 10 random UIDs x $20 + first 60 new users x $5
// via https://www.hotcoin.com/r/Collab. BLZ was not yet listed on Hotcoin on Nov 27 (no pair in api.hotcoinfin.com symbols).
// Run: PW_PATH=$(npm root -g)/playwright node social/blz-welcome/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const BR = 'file://' + DIR + '../../hotcoin-tradfi/public/brand/';
const HEAD = `<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Russo+One&family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=block">`;
const BASE = `*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;font-family:'Inter Tight'}
.coin{border-radius:50%;object-fit:cover;transform:scale(1.03)}`;

const tag = `<!doctype html><html><head>${HEAD}<style>${BASE}
body{background:#04070d;color:#fff}
.art{position:absolute;left:0;top:0;width:1080px;height:1340px;object-fit:cover}
.scr{position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,7,13,0) 70%,rgba(4,7,13,.85) 82%,#04070d 92%)}
.logo{position:absolute;left:60px;top:58px;height:40px}
.cb{position:absolute;right:52px;top:30px;display:flex;align-items:center;gap:14px;font:700 20px 'JetBrains Mono';letter-spacing:3px;color:rgba(255,255,255,.85)}
.cb img{width:100px;height:100px;box-shadow:0 0 0 3px rgba(255,255,255,.14),0 8px 24px rgba(0,0,0,.5)}
.eng{position:absolute;left:384px;width:322px;top:715px;text-align:center;color:rgba(28,70,4,.82);text-shadow:0 1.5px 0 rgba(235,255,190,.45),0 -1px 0 rgba(0,0,0,.18)}
.eng .s{font:800 26px 'JetBrains Mono';letter-spacing:6px}
.eng .n{font:400 118px/1 'Russo One';letter-spacing:-3px;margin-top:16px}
.eng .u{font:800 20px/1.35 'JetBrains Mono';letter-spacing:2px;margin-top:14px}
.eng .ln{width:120px;height:3px;border-radius:2px;background:rgba(28,70,4,.55);margin:26px auto 0;box-shadow:0 1.5px 0 rgba(235,255,190,.4)}
.eng .x{font:800 22px 'JetBrains Mono';letter-spacing:3px;margin-top:22px}
h1{position:absolute;left:0;right:0;top:1086px;text-align:center;font:400 74px/1 'Russo One';letter-spacing:-1.5px}
h1 span{color:#b8f26a}
.pills{position:absolute;left:0;right:0;top:1196px;display:flex;justify-content:center;gap:16px}
.pill{display:flex;align-items:center;gap:12px;padding:16px 26px;border-radius:99px;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.2);font-size:28px;font-weight:700}
.pill b{font:800 28px 'JetBrains Mono';color:#b8f26a}
</style></head><body>
<img class="art" src="assets/tag-1.jpg"><div class="scr"></div>
<img class="logo" src="${BR}logo-official-white.png">
<div class="cb"><span>HOTCOIN × BLUZO</span><img class="coin" src="assets/blz-original.jpg"></div>
<div class="eng"><div class="s">GIVEAWAY</div><div class="n">$500</div><div class="u">FUTURES TRIAL<br>VOUCHERS</div></div>
<h1>Welcome <span>$BLZ</span> to Hotcoin</h1>
<div class="pills"><div class="pill"><b>10 × $20</b>lucky draw</div><div class="pill"><b>60 × $5</b>first new users</div></div>
</body></html>`;

const bars = Array.from({length: 40}, (_, i) => `<i style="width:${[3, 6, 2, 4, 8, 3, 5][(i * 7 + 3) % 7]}px"></i>`).join('');
const pass = `<!doctype html><html><head>${HEAD}<style>${BASE}
body{background:#b8f26a;color:#0b0e11}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(11,14,17,.13) 1.6px,transparent 1.8px);background-size:22px 22px;-webkit-mask-image:radial-gradient(ellipse at 50% 62%,transparent 30%,#000 75%)}
.logo{position:absolute;left:60px;top:58px;height:40px}
.k{position:absolute;left:62px;top:70px;font:800 20px 'JetBrains Mono';letter-spacing:4px}
h1{position:absolute;left:60px;right:60px;top:150px;font:400 104px/0.98 'Russo One';letter-spacing:-2.5px}
h1 span{display:inline-block;background:#0b0e11;color:#b8f26a;padding:0 18px 6px;border-radius:18px}
.sub{position:absolute;left:62px;top:390px;font-size:34px;font-weight:700}
.sub b{font-weight:800}
.tk{position:absolute;left:60px;right:60px;top:500px;height:740px;background:#fff;border-radius:34px;box-shadow:0 30px 60px rgba(30,60,0,.28);overflow:hidden}
.tk::before,.tk::after{content:'';position:absolute;top:472px;width:56px;height:56px;border-radius:50%;background:#b8f26a}
.tk::before{left:-28px}.tk::after{right:-28px}
.hd{display:flex;justify-content:space-between;align-items:center;padding:34px 48px 0}
.hd img{height:40px}.hd span{font:800 18px 'JetBrains Mono';letter-spacing:4px;color:#5b636b}
.rt{display:flex;align-items:center;justify-content:space-between;padding:34px 48px 0}
.ap{display:flex;align-items:center;gap:20px}
.ap .c{width:104px;height:104px}
.ap .h{width:104px;height:104px;border-radius:50%;background:#0b0e11;display:flex;align-items:center;justify-content:center}
.ap .h img{width:56px}
.ap .t{font:400 76px/1 'Russo One'}.ap .l{font:700 16px 'JetBrains Mono';letter-spacing:2px;color:#5b636b;margin-top:6px}
.fl{flex:1;margin:0 26px;position:relative;height:4px;background:repeating-linear-gradient(90deg,#0b0e11 0 12px,transparent 12px 22px)}
.fl::after{content:'';position:absolute;right:-6px;top:-11px;border-left:22px solid #0b0e11;border-top:13px solid transparent;border-bottom:13px solid transparent}
.gr{display:grid;grid-template-columns:1fr 1fr;gap:30px 40px;padding:40px 48px 0}
.f .l{font:700 16px 'JetBrains Mono';letter-spacing:3px;color:#5b636b}
.f .v{font-size:36px;font-weight:800;margin-top:8px;letter-spacing:-.5px}
.f .v em{font-style:normal;color:#17a86b}
.cut{position:absolute;left:44px;right:44px;top:499px;border-top:4px dashed #d5dad0}
.stub{position:absolute;left:48px;right:48px;top:548px;display:flex;align-items:center;justify-content:space-between}
.stub .l{font:700 16px 'JetBrains Mono';letter-spacing:3px;color:#5b636b}
.stub .v{font:400 48px/1 'Russo One';margin-top:10px}.stub .v span{color:#17a86b}
.stub .d{font-size:24px;font-weight:600;color:#3a4148;margin-top:12px}
.bc{display:flex;gap:4px;height:118px;align-items:stretch}.bc i{background:#0b0e11;display:block}
</style></head><body>
<div class="dots"></div>
<div class="k">BLZ × HOTCOIN · WELCOME GIVEAWAY</div>
<h1>Welcome aboard,<br><span>$BLZ</span></h1>
<div class="sub"><b>$500</b> in futures trial vouchers for the pack</div>
<div class="tk">
 <div class="hd"><img src="${BR}logo-official-black.png"><span>BOARDING PASS</span></div>
 <div class="rt">
  <div class="ap"><img class="coin c" src="assets/blz-original.jpg"><div><div class="t">BLZ</div><div class="l">BLUZO · SOLANA</div></div></div>
  <div class="fl"></div>
  <div class="ap"><div><div class="t" style="text-align:right">HOT</div><div class="l" style="text-align:right">HOTCOIN</div></div><div class="h"><img src="${BR}symbol-official-white.png"></div></div>
 </div>
 <div class="gr">
  <div class="f"><div class="l">PASSENGER</div><div class="v">New Hotcoin users</div></div>
  <div class="f"><div class="l">SEATS</div><div class="v">First 60</div></div>
  <div class="f"><div class="l">REWARD</div><div class="v"><em>$5</em> futures trial voucher</div></div>
  <div class="f"><div class="l">GATE</div><div class="v">hotcoin.com/r/Collab</div></div>
 </div>
 <div class="cut"></div>
 <div class="stub"><div><div class="l">LUCKY DRAW</div><div class="v"><span>10 × $20</span> vouchers</div><div class="d">Follow, repost, reply with your UID</div></div><div class="bc">${bars}</div></div>
</div>
</body></html>`;

const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [name, html] of [['hotcoin-blz-tag', tag], ['hotcoin-blz-pass', pass]]) {
  const f = DIR + `_b-${process.pid}.html`;
  fs.writeFileSync(f, html);
  await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  await p.screenshot({path: DIR + name + '.png'});
  await p.screenshot({path: DIR + name + '.jpg', type: 'jpeg', quality: 92});
  fs.unlinkSync(f);
}
await b.close(); console.log('ok');
