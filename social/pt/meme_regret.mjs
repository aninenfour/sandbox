// PT (Brazil) meme carousel "Sou um idiota / não vou comprar esse mico" (regret-then-smug format, rebuilt from scratch, no copied template).
// Prices (weekly closes unless noted):
//  BTC: Binance BTCUSDT weekly close w/c 2026-09-28 86,530; July 2026 closes 63,650 to 65,400 (~64k); spot 2026-11-15 01:41 UTC 62,239.
//  ETH: Binance ETHUSDT weekly close w/c 2026-09-28 2,727; July 2026 ~1,786 to 1,955 (~1,800); spot 2026-11-15 01:41 UTC 1,719.
//  NVDA: Yahoo Finance weekly close w/c 2026-09-28 233.95; w/c 2026-03-23 167.52; close 2026-11-13 162.85.
//  Pokemon Destined Rivals booster box (approx, trackers disagree): ~US$ 390 early Jan 2026 and ~US$ 564 Feb 2026 (TCGTalk, Feb 2026, TCGPlayer/eBay);
//  ~US$ 423 Sep 2026 (TCGTalk citing PriceCharting). Box image cropped from the same meme template.
// People: the well-known "why didn't I buy / ain't buying that brick" meme template (supplied by the owner, art/meme/template-regret.jpg), allowed by the meme-template rule.
// GPU photo: Thomas Foster (Unsplash, vWgoeEYdtIY).
// Coin logos: CoinGecko. Run: PW_PATH=$(npm root -g)/playwright node social/pt/meme_regret.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const OUT = `${DIR}/meme-regret`; fs.mkdirSync(OUT, {recursive: true});
const M = (f) => `data:image/${f.endsWith('png') ? 'png' : 'jpeg'};base64,` + fs.readFileSync(`${DIR}/art/meme/${f}`).toString('base64');
const L = (f) => 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/' + f).toString('base64');
const INK = '#0B0E11', LIME = '#B8F26A';
const head = `<meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,600..800&family=Martian+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#fff;color:${INK};font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}
.panel{position:absolute;left:0;right:0;height:675px;overflow:hidden}
.person{position:absolute;left:0;top:0;width:470px;height:675px;overflow:hidden}
.person img{position:absolute}
.quote{position:absolute;left:470px;top:56px;width:300px;font-size:44px;font-weight:800;line-height:1.06;letter-spacing:-.5px}
.month{position:absolute;left:470px;bottom:40px;font-family:'Martian Mono';font-weight:700;font-size:40px;letter-spacing:1px}
.item{position:absolute;right:40px;top:150px;width:300px;height:340px;display:grid;place-items:center}
.tag{position:absolute;right:30px;top:70px;transform:rotate(14deg);background:#F1E8D4;border:2px solid #8B7A55;border-radius:10px 18px 18px 10px;padding:12px 22px 12px 34px;font-weight:800;font-size:40px;box-shadow:0 6px 14px rgba(0,0,0,.15)}
.tag::before{content:"";position:absolute;left:12px;top:50%;width:12px;height:12px;margin-top:-6px;border-radius:50%;background:#fff;border:2px solid #8B7A55}
</style>`;
const face = `<div style="position:absolute;inset:0;background:#fff url(${M('tpl-regret.png')}) 0 0/cover no-repeat"></div>`;
const grin = `<div style="position:absolute;inset:0;background:#fff url(${M('tpl-smug.png')}) 0 0/cover no-repeat"></div>`;
const coin = (f) => `<img src="${M(f)}" style="width:260px;height:260px;filter:drop-shadow(0 18px 24px rgba(0,0,0,.25))">`;
const gpu = `<div style="width:320px;height:240px;border-radius:18px;overflow:hidden;box-shadow:0 18px 30px rgba(0,0,0,.25)"><img src="${M('gpu.jpg')}" style="width:420px;margin-left:-50px;margin-top:-20px"></div>`;
const cards = `<img src="${M('tpl-box.png')}" style="width:330px">`;
function slide({m1, p1, q1, m2, p2, q2, obj, n}) {
  return `<!doctype html><html><head>${head}</head><body>
<div class="panel" style="top:0"><div class="person">${face}</div><div class="quote">${q1}</div><div class="item">${obj}</div><div class="tag">${p1}</div><div class="month">${m1}</div></div>
<div style="position:absolute;left:0;right:0;top:673px;height:5px;background:${INK}"></div>
<div class="panel" style="top:678px"><div class="person">${grin}</div><div class="quote">${q2}</div><div class="item">${obj}</div><div class="tag">${p2}</div><div class="month">${m2}</div></div>
<img src="${L('logo-official-black.png')}" style="position:absolute;right:36px;bottom:30px;height:28px">
<div style="position:absolute;right:36px;top:24px;font-family:'Martian Mono';font-size:18px;font-weight:700;color:#8A9096">${n}/4</div>
</body></html>`;
}
const slides = [
  ['1-btc', {m1: 'SET 2026', p1: 'US$ 86,5 mil', q1: 'Sou um idiota. Por que não comprei a US$ 64 mil?', m2: 'NOV 2026', p2: 'US$ 62 mil', q2: 'KKKKK não vou comprar esse mico', obj: coin('bitcoin.png'), n: 1}],
  ['2-nvda', {m1: 'SET 2026', p1: 'US$ 234', q1: 'Sou um idiota. Por que não comprei a US$ 168?', m2: 'NOV 2026', p2: 'US$ 163', q2: 'KKKKK não vou comprar esse mico', obj: gpu, n: 2}],
  ['3-eth', {m1: 'SET 2026', p1: 'US$ 2.727', q1: 'Sou um idiota. Por que não comprei a US$ 1.800?', m2: 'NOV 2026', p2: 'US$ 1.719', q2: 'KKKKK não vou comprar esse mico', obj: coin('ethereum.png'), n: 3}],
  ['4-cartas', {m1: 'FEV 2026', p1: '~US$ 564', q1: 'Sou um idiota. Por que não comprei a caixa a US$ 390?', m2: 'SET 2026', p2: '~US$ 423', q2: 'KKKKK não vou comprar esse mico de papelão', obj: cards, n: 4}],
];
const br = await chromium.launch();
const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [n, s] of slides) { await pg.setContent(slide(s), {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400); await pg.screenshot({path: `${OUT}/${n}.png`}); }
await br.close(); console.log('ok');
