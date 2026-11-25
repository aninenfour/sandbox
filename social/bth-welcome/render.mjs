// Hotcoin x BTH welcome giveaway, X post graphic 1:1 (1080x1080 @2x).
// BTH logo: supplied by the user (from the BTH team), assets/bth-logo-src.png. Listing date Dec 2 taken from the
// promoter's X bio (@bigmiracle777, "(12/2) BTH Hotcoin"): CONFIRM with the listing team.
// PRIZE / WINNERS / END DATE are proposals (mirrors the earlier $MOUSE and PT giveaways): edit CONFIG and re-render.
// Run: PW_PATH=$(npm root -g)/playwright node social/bth-welcome/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const BR = 'file://' + DIR + '../../hotcoin-tradfi/public/brand/';
const CONFIG = {listing: 'Dec 2', pool: '500 USDT', winners: 50, each: '10 USDT', ends: 'Dec 9', partner: '@bigmiracle777'};
const PINK = '#ff2d9b';

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Russo+One&family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;position:relative;background:#07090a;color:#fff;font-family:'Inter Tight'}
.glow{position:absolute;right:-380px;top:50px;width:1100px;height:1100px;background:radial-gradient(circle,rgba(255,45,155,.42) 0%,rgba(255,45,155,.12) 38%,rgba(255,45,155,0) 66%)}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.06) 1.5px,transparent 1.8px);background-size:30px 30px;
 -webkit-mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.4) 60%,transparent 100%)}
.ring{position:absolute;border-radius:50%;border:1.5px solid rgba(255,45,155,.28)}
.orb{position:absolute;right:-70px;top:350px;width:500px;filter:drop-shadow(0 30px 70px rgba(255,45,155,.55))}
.hd{position:absolute;left:64px;top:60px;display:flex;align-items:center;gap:22px}
.hd .hc{height:40px}.hd .x{font:400 30px 'Russo One';color:rgba(255,255,255,.55)}.hd .bth{height:64px;margin:-12px 0}
.hd .bt{font:400 34px 'Russo One'}
.k{position:absolute;left:64px;top:168px;font:700 22px 'JetBrains Mono';letter-spacing:4px;color:#b8f26a}
h1{position:absolute;left:64px;top:206px;font:400 118px/0.92 'Russo One';letter-spacing:-2px}
h1 span{color:${PINK};text-shadow:0 0 40px rgba(255,45,155,.55)}
.prize{position:absolute;left:64px;top:440px}
.prize .v{font:400 84px 'Russo One';color:#b8f26a;letter-spacing:-1px}.prize .t{font-size:32px;font-weight:800;margin-top:2px}
.steps{position:absolute;left:64px;top:616px;width:560px;display:flex;flex-direction:column;gap:16px}
.st{display:flex;align-items:center;gap:20px;padding:18px 22px;border-radius:20px;background:rgba(17,21,26,.82);border:1.5px solid rgba(255,255,255,.12);backdrop-filter:blur(6px)}
.st .n{flex:none;width:50px;height:50px;border-radius:50%;background:#b8f26a;color:#0b0e11;display:flex;align-items:center;justify-content:center;font:400 26px 'Russo One'}
.st .s{font-size:28px;font-weight:700;line-height:1.15}.st .s b{color:${PINK};font-weight:800}
.ft{position:absolute;left:64px;right:64px;bottom:56px;display:flex;align-items:center;justify-content:space-between}
.pill{display:flex;align-items:center;gap:14px;padding:16px 26px;border-radius:99px;border:1.5px solid ${PINK};background:rgba(255,45,155,.12);font-size:26px;font-weight:800}
.pill i{width:12px;height:12px;border-radius:50%;background:${PINK};box-shadow:0 0 12px ${PINK}}
.ft .e{font:700 22px 'JetBrains Mono';letter-spacing:3px;color:rgba(255,255,255,.78)}
</style></head><body>
<div class="glow"></div><div class="dots"></div>
<div class="ring" style="right:-210px;top:200px;width:780px;height:780px"></div>
<div class="ring" style="right:-230px;top:40px;width:980px;height:980px;border-color:rgba(255,45,155,.14)"></div>
<img class="orb" src="assets/bth-logo-src.png">
<div class="hd"><img class="hc" src="${BR}logo-official-white.png"><div class="x">×</div><img class="bth" src="assets/bth-logo-src.png"></div>
<div class="k">NEW ON HOTCOIN · ${CONFIG.listing.toUpperCase()}</div>
<h1>Welcome<br><span>$BTH</span></h1>
<div class="prize"><div class="v">${CONFIG.pool}</div><div class="t">in $BTH · welcome giveaway</div></div>
<div class="steps">
 <div class="st"><div class="n">1</div><div class="s">Follow <b>@HotcoinGlobal</b><br>and <b>${CONFIG.partner}</b></div></div>
 <div class="st"><div class="n">2</div><div class="s">Like and repost this post</div></div>
 <div class="st"><div class="n">3</div><div class="s">Reply with your Hotcoin UID</div></div>
</div>
<div class="ft"><div class="pill"><i></i>${CONFIG.winners} winners × ${CONFIG.each} in $BTH</div><div class="e">ENDS ${CONFIG.ends.toUpperCase()}</div></div>
</body></html>`;
const f = DIR + `_b-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1080}, deviceScaleFactor: 2});
await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
await p.screenshot({path: DIR + 'hotcoin-bth-welcome.png'});
await b.close(); fs.unlinkSync(f); console.log('ok');
