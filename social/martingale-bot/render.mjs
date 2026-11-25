// Futures Martingale Bot: 4-slide Q&A thread, 4:5 (1080x1350 @2x).
// Facts: Hotcoin guide "Futures Martingale Bot User Guide"
//   https://www.hotcoin.com/en_US/support/Guide-to-Using-the-MartingaleStrategy-for-ContractTrading/ (read Nov 25, 2026)
//   BTC example from the guide: 60,000 / 58,800 / 57,600 USDT, 0.01 BTC each, average entry 58,800 (before fees).
// Art: Nano Banana 2 edit with brand-kit/mascot/mascot-101-reference.png (green dot head: one eye, no mouth), charcoal style. assets/dot-1..4.png
// (first android version kept in assets/v1/)
// Run: PW_PATH=$(npm root -g)/playwright node social/martingale-bot/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const BR = 'file://' + DIR + '../../hotcoin-tradfi/public/brand/';
const LIME = '#b8f26a';

const SLIDES = [
  {art: 'dot-1.png', pos: 'top', k: 'New on Hotcoin · Futures bot',
   q: 'What is the Futures <span>Martingale Bot</span>?',
   a: 'A bot that adds to your futures position in steps when price moves against you, lowers your average entry, and takes profit on the rebound.'},
  {art: 'dot-2.png', pos: 'right', dx: -250, dy: 70, k: 'Q2 · How does it work?',
   q: 'It buys the dip <span>in steps</span>',
   a: 'Long example: BTC at 60,000, then adds at 58,800 and 57,600. Average entry drops to 58,800, so it can take profit before price gets back to 60,000.',
   strip: ['60,000', '58,800', '57,600', 'avg 58,800']},
  {art: 'dot-3.png', pos: 'top', k: 'Q3 · When does it work best?',
   q: 'Made for <span>choppy</span> markets',
   a: 'Range-bound and pullback-and-rebound markets, long or short. Strong one-way trends and extreme volatility are not its game.'},
  {art: 'dot-4.png', pos: 'top', dy: 130, k: 'Q4 · What are the risks?',
   q: 'Know your <span>limits</span>',
   a: 'If the trend keeps going, the bot keeps adding: more exposure and, with leverage, liquidation risk. Set max orders, leverage and a stop-loss you can afford.',
   cta: 'Try it: Trading Bot on hotcoin.com'},
];

const page = (s, i) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Russo+One&family=Inter+Tight:wght@600;700;800&family=JetBrains+Mono:wght@500;700&display=block">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#07090a;color:#fff;font-family:'Inter Tight'}
.art{position:absolute;inset:0;width:1080px;height:1350px;object-fit:cover}
.scr{position:absolute;inset:0;background:${s.pos === 'right' ? 'linear-gradient(270deg,rgba(7,9,10,.9) 0%,rgba(7,9,10,.6) 38%,rgba(7,9,10,0) 55%),linear-gradient(180deg,rgba(7,9,10,.75) 0%,rgba(7,9,10,0) 14%)' : s.pos === 'top'
  ? 'linear-gradient(180deg,rgba(7,9,10,.92) 0%,rgba(7,9,10,.75) 32%,rgba(7,9,10,0) 52%)'
  : 'linear-gradient(0deg,rgba(7,9,10,.95) 0%,rgba(7,9,10,.8) 28%,rgba(7,9,10,0) 48%),linear-gradient(180deg,rgba(7,9,10,.7) 0%,rgba(7,9,10,0) 14%)'}}
.logo{position:absolute;left:64px;top:60px;height:40px}.pg{position:absolute;right:64px;top:68px;font:700 20px 'JetBrains Mono';letter-spacing:3px;color:rgba(255,255,255,.75)}
.box{position:absolute;${s.pos === 'right' ? 'left:600px;right:56px;top:170px' : s.pos === 'top' ? 'left:64px;right:64px;top:150px' : 'left:64px;right:64px;bottom:72px'}}
${s.pos === 'right' ? '.q{font-size:58px!important}.a{font-size:28px!important}.strip{flex-direction:column;align-items:flex-start;gap:10px!important}' : ''}
.k{font:700 22px 'JetBrains Mono';letter-spacing:4px;text-transform:uppercase;color:${LIME}}
.q{margin-top:18px;font:400 70px/1.02 'Russo One';letter-spacing:-1px}.q span{color:${LIME}}
.a{margin-top:22px;font-size:32px;font-weight:600;line-height:1.32;color:rgba(255,255,255,.9);max-width:930px}
.strip{display:flex;gap:14px;margin-top:26px}
.strip div{padding:12px 20px;border-radius:14px;border:1.5px solid rgba(255,255,255,.25);background:rgba(17,21,26,.7);font:700 26px 'JetBrains Mono'}
.strip div:last-child{border-color:${LIME};color:${LIME}}
.cta{display:inline-block;margin-top:28px;background:${LIME};color:#0b0e11;font-weight:800;font-size:30px;padding:18px 34px;border-radius:99px}
</style></head><body>
<img class="art" src="assets/${s.art}" style="top:${s.dy || 0}px;left:${s.dx || 0}px;${s.dx && s.dy ? "-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 120px),linear-gradient(270deg,transparent 0,#000 200px);-webkit-mask-composite:source-in" : s.dy ? "-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 160px)" : s.dx ? "-webkit-mask-image:linear-gradient(270deg,transparent 0,#000 200px)" : ""}"><div class="scr"></div>
<img class="logo" src="${BR}logo-official-white.png"><div class="pg">${i + 1} / 4</div>
<div class="box"><div class="k">${s.k}</div><div class="q">${s.q}</div><div class="a">${s.a}</div>
${s.strip ? `<div class="strip">${s.strip.map((x) => `<div>${x}</div>`).join('')}</div>` : ''}
${s.cta ? `<div class="cta">${s.cta}</div>` : ''}</div>
</body></html>`;

const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
fs.mkdirSync(DIR + 'out', {recursive: true});
for (const [i, s] of SLIDES.entries()) {
  const f = DIR + `_m-${process.pid}.html`;
  fs.writeFileSync(f, page(s, i));
  await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  await p.screenshot({path: DIR + `out/martingale-${i + 1}.png`}); fs.unlinkSync(f);
}
await b.close(); console.log('ok');
