// Hotcoin x BTH welcome giveaway, X post graphic 1:1 (1080x1080 @2x). Clean version: title + subtitles only.
// Rewards (from the user, Nov 25): $500 total in futures trial vouchers =
//   10 random UIDs x $20 ($200) + first 60 new users registering via the referral link x $5 ($300, first come first served).
// BTH logo: supplied by the user (from the BTH team), assets/bth-logo-src.png.
// Run: PW_PATH=$(npm root -g)/playwright node social/bth-welcome/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const BR = 'file://' + DIR + '../../hotcoin-tradfi/public/brand/';
const PINK = '#ff2d9b', LIME = '#b8f26a';

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Russo+One&family=Inter+Tight:wght@600;700;800&display=block">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;position:relative;background:#07090a;color:#fff;font-family:'Inter Tight'}
.glow{position:absolute;right:-420px;top:60px;width:1200px;height:1200px;background:radial-gradient(circle,rgba(255,45,155,.45) 0%,rgba(255,45,155,.12) 38%,rgba(255,45,155,0) 66%)}
.ring{position:absolute;border-radius:50%;border:1.5px solid rgba(255,45,155,.22)}
.orb{position:absolute;right:-190px;top:330px;width:580px;filter:drop-shadow(0 30px 80px rgba(255,45,155,.6))}
.hd{position:absolute;left:72px;top:68px;display:flex;align-items:center;gap:24px}
.hd .hc{height:46px}.hd .x{font:400 32px 'Russo One';color:rgba(255,255,255,.5)}.hd .bth{height:76px;margin:-14px 0}
h1{position:absolute;left:72px;top:190px;font:400 104px/0.95 'Russo One';letter-spacing:-2px}
h1 span{color:${PINK};text-shadow:0 0 44px rgba(255,45,155,.6)}
.big{position:absolute;left:64px;top:420px;font:400 260px/0.9 'Russo One';letter-spacing:-9px;color:${LIME};text-shadow:0 0 60px rgba(184,242,106,.25)}
.sub{position:absolute;left:72px;top:670px;width:620px;line-height:1.1;font-size:46px;font-weight:800;letter-spacing:-.5px}
.row{position:absolute;left:72px;right:72px;bottom:72px;display:flex}
.row>div{flex:1}.row>div+div{padding-left:44px;border-left:2px solid rgba(255,255,255,.22)}
.row .v{font:400 58px 'Russo One';letter-spacing:-1px}.row .v b{font-weight:400;color:${PINK}}
.row .l{font-size:30px;font-weight:700;color:rgba(255,255,255,.82);margin-top:6px}
</style></head><body>
<div class="glow"></div>
<div class="ring" style="right:-360px;top:190px;width:860px;height:860px"></div>
<div class="ring" style="right:-420px;top:0;width:1100px;height:1100px;border-color:rgba(255,45,155,.12)"></div>
<img class="orb" src="assets/bth-logo-src.png">
<div class="hd"><img class="hc" src="${BR}logo-official-white.png"><div class="x">×</div><img class="bth" src="assets/bth-logo-src.png"></div>
<h1>Welcome <span>$BTH</span><br>to Hotcoin</h1>
<div class="big">$500</div>
<div class="sub">in futures trial vouchers</div>
<div class="row">
 <div><div class="v">10 <b>×</b> $20</div><div class="l">Random winners</div></div>
 <div><div class="v">60 <b>×</b> $5</div><div class="l">New users, first come</div></div>
</div>
</body></html>`;
const f = DIR + `_b-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1080}, deviceScaleFactor: 2});
await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
await p.screenshot({path: DIR + 'hotcoin-bth-welcome.png'});
await b.close(); fs.unlinkSync(f); console.log('ok');
