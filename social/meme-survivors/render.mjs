// "Memecoins that survived" logo wall, 4:5, rendered at 2x.
// Data: CoinGecko /coins/markets?category=meme-token (fetched Nov 24, 2026), saved in sel.json; chain = asset_platform_id
// from /coins/{id} (detail.json). "Survived" = market cap >= $10M AND 24h volume >= $1M; bridged "binance-peg" copies removed.
// Logos: CoinGecko image URLs only (logos/). Hotcoin listing status is not considered.
// Run: PW_PATH=$(npm root -g)/playwright node social/meme-survivors/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const sel = JSON.parse(fs.readFileSync(DIR + 'sel.json', 'utf8'));
const det = JSON.parse(fs.readFileSync(DIR + 'detail.json', 'utf8'));
const BR = 'file://' + DIR + '../../hotcoin-tradfi/public/brand/';

const CH = {
  solana: {name: 'Solana', c1: '#9945FF', c2: '#14F195'},
  ethereum: {name: 'Ethereum', c1: '#627EEA', c2: '#8FA4F5'},
  bnb: {name: 'BNB Chain', c1: '#F0B90B', c2: '#F8D33A'},
  base: {name: 'Base', c1: '#0052FF', c2: '#3C7BFF'},
  ton: {name: 'TON', c1: '#0098EA', c2: '#45C0FF'},
  own: {name: 'Own chain', c1: '#C9C5B8', c2: '#8E8A7E'},
  other: {name: 'Other L2s', c1: '#5B636B', c2: '#3A4148'},
};
const chainOf = (id) => {
  const ap = det[id].ap;
  if (ap === 'solana') return 'solana';
  if (ap === 'ethereum') return 'ethereum';
  if (ap === 'binance-smart-chain') return 'bnb';
  if (ap === 'base') return 'base';
  if (ap === 'the-open-network') return 'ton';
  if (!ap || ap === 'ordinals') return 'own'; // Dogecoin, MemeCore, ORDI on Bitcoin
  return 'other'; // Robinhood Chain, Polygon, Hyperliquid, Arbitrum
};
const ORDER = ['solana', 'ethereum', 'bnb', 'base', 'ton', 'own', 'other'];
const coins = sel.map((c) => ({id: c.id, sym: c.symbol.toUpperCase().replace(/^\$/, ''), mc: c.market_cap, ch: chainOf(c.id)}));
const hero = coins.find((c) => c.id === 'dogecoin');
const rest = coins.filter((c) => c !== hero).sort((a, b) => ORDER.indexOf(a.ch) - ORDER.indexOf(b.ch) || b.mc - a.mc);
const counts = Object.fromEntries(ORDER.map((k) => [k, coins.filter((c) => c.ch === k).length]));

const tile = (c, big) => {
  const ch = CH[c.ch];
  return `<div class="t${big ? ' big' : ''}"><div class="sq" style="background:linear-gradient(150deg,${ch.c1}c0,${ch.c2}55 75%),#11151a;border-color:${ch.c1}">
   <img src="logos/${c.id}.png"></div><div class="lb">${big ? 'Dogecoin' : c.sym}</div></div>`;
};
const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Russo+One&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+SC:wght@600&display=block">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#07090a;color:#fff;font-family:'Inter Tight','Noto Sans SC';position:relative}
.logo{position:absolute;left:44px;top:40px;height:34px}.dt{position:absolute;right:44px;top:44px;font:700 18px 'JetBrains Mono';letter-spacing:3px;color:rgba(255,255,255,.75)}
h1{position:absolute;left:0;right:0;top:100px;text-align:center;font:400 66px 'Russo One';letter-spacing:-1px}
h1 span{color:#b8f26a}.ul{position:absolute;left:470px;width:140px;top:186px;height:4px;border-radius:2px;background:#b8f26a}
.sub{position:absolute;left:0;right:0;top:204px;text-align:center;font-size:22px;font-weight:600;color:rgba(255,255,255,.72)}
.grid{position:absolute;left:40px;right:40px;top:262px;display:grid;grid-template-columns:repeat(9,1fr);column-gap:12px;row-gap:10px;grid-auto-flow:dense}
.t{display:flex;flex-direction:column;align-items:center}
.sq{width:100%;aspect-ratio:1;border-radius:18px;border:1.5px solid;display:flex;align-items:center;justify-content:center}
.sq img{width:62%;height:62%;border-radius:50%;object-fit:cover;box-shadow:0 6px 18px rgba(0,0,0,.45)}
.lb{margin-top:6px;font-size:14px;font-weight:700;color:rgba(255,255,255,.88);white-space:nowrap;max-width:110px;overflow:hidden;text-overflow:ellipsis}
.t.big{grid-column:span 2;grid-row:span 2}.t.big .sq{border-radius:26px}.t.big .sq img{width:66%;height:66%}.t.big .lb{font-size:17px}
.leg{position:absolute;left:30px;right:30px;bottom:44px;display:flex;justify-content:center;gap:8px}
.chip{display:flex;align-items:center;gap:8px;padding:9px 13px;border-radius:99px;background:#11151a;border:1.5px solid;font-size:15px;font-weight:700;white-space:nowrap}
.chip i{width:16px;height:16px;border-radius:50%}.chip b{font:700 14px 'JetBrains Mono';color:rgba(255,255,255,.6)}
</style></head><body>
<img class="logo" src="${BR}logo-official-white.png"><div class="dt">NOV 24, 2026</div>
<h1>Memecoins that <span>survived</span></h1>
<div class="sub">Still alive: market cap above $10M and $1M+ traded in the last 24h</div>
<div class="grid">${tile(hero, true)}${rest.map((c) => tile(c)).join('')}</div>
<div class="leg">${ORDER.map((k) => `<div class="chip" style="border-color:${CH[k].c1}"><i style="background:linear-gradient(135deg,${CH[k].c1},${CH[k].c2})"></i>${CH[k].name}<b>${counts[k]}</b></div>`).join('')}</div>
</body></html>`;
const f = DIR + `_m-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
const gb = await p.evaluate(() => { const g = document.querySelector('.grid').getBoundingClientRect(); const l = document.querySelector('.leg').getBoundingClientRect(); return [g.bottom, l.top]; });
console.log('grid bottom / legend top', gb);
await p.screenshot({path: DIR + 'memecoins-survived.png'});
await b.close(); fs.unlinkSync(f); console.log('ok', coins.length, counts);
