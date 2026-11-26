// Happy Thanksgiving 2026 (Nov 26) post, 4:5 1080x1350 @2x.
// Art: Nano Banana 2 edit with brand-kit/mascot/mascot-101-reference.png (the 101 dot: one eye, no mouth).
// The generated sky had a hard seam at ~36% height; a blurred, masked copy of the art hides it.
// Run: PW_PATH=$(npm root -g)/playwright node social/thanksgiving-2026/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const BR = 'file://' + DIR + '../../hotcoin-tradfi/public/brand/';
const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Russo+One&family=Inter+Tight:wght@600;700;800&family=JetBrains+Mono:wght@700&display=block">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#2a1606;color:#fff;font-family:'Inter Tight'}
.art,.blur{position:absolute;inset:0;width:1080px;height:1350px;object-fit:cover}
.blur{filter:blur(40px) saturate(1.05);transform:scale(1.08);-webkit-mask-image:linear-gradient(180deg,#000 0,#000 41%,transparent 54%)}
.scr{position:absolute;inset:0;background:linear-gradient(180deg,rgba(40,18,4,.55) 0%,rgba(40,18,4,.2) 30%,rgba(40,18,4,0) 45%,rgba(30,12,2,0) 80%,rgba(30,12,2,.45) 100%)}
.logo{position:absolute;left:64px;top:60px;height:42px}
h1{position:absolute;left:0;right:0;top:170px;text-align:center;font:400 112px/0.95 'Russo One';letter-spacing:-2px;text-shadow:0 6px 40px rgba(80,30,0,.45)}
h1 span{color:#b8f26a}
.sub{position:absolute;left:0;right:0;top:410px;text-align:center;font-size:36px;font-weight:700;color:#fff6e4;text-shadow:0 2px 18px rgba(60,20,0,.5)}
</style></head><body>
<img class="art" src="assets/dot-autumn.png"><img class="blur" src="assets/dot-autumn.png"><div class="scr"></div>
<img class="logo" src="${BR}logo-official-white.png">
<h1>Happy<br><span>Thanksgiving</span></h1>
<div class="sub">Thank you for trading with us.</div>
</body></html>`;
const f = DIR + `_t-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
await p.screenshot({path: DIR + 'hotcoin-thanksgiving-2026.png'});
await p.screenshot({path: DIR + 'hotcoin-thanksgiving-2026.jpg', type: 'jpeg', quality: 92});
await b.close(); fs.unlinkSync(f); console.log('ok');
