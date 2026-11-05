// "The market's on sale" carousel: 4 slides, 1080x1350, rendered at 2x.
// Prices: CoinGecko /coins/markets (Nov 5, 2026 15:13 UTC) in prices.json. Total market cap: CoinMarketCap global metrics
// (peak $4.28T on Oct 7, 2025; $2.69T on Nov 5, 2026). Coin logos: CoinGecko. Bitcoin photo: Kanchanara on Unsplash.
// Catalysts (checked Nov 5, 2026):
//  ETH  Glamsterdam on Sepolia testnet since Oct 6; mainnet date not set (crypto.news, Christine Kim ACDE notes)
//  SOL  Alpenglow (Votor) live on mainnet Oct 21, epoch 1064, ~150ms finality target (solana.com/upgrades/alpenglow); Breakpoint London Nov 15-17
//  LINK CCIP 2.0 launched Sep 28 at Sibos with ANZ, SBI, Bottomline; Bottomline (Swift provider) brings CCIP to 600+ banks (chain.link)
//  ONDO TVL above $4B; first tokenization company on DTCC Fund/SERV, Oct 28 (TheStreet); 450+ US stocks and ETFs (ondo.finance)
//  ZEC  NU7 mainnet at block 3,543,405, expected Nov 5: block time 75s -> 25s (Cointelegraph, crypto.news)
//  XLM  Bell (Protocol 30): mainnet validator vote Nov 23; ML-DSA post-quantum signature checks in contracts (crypto.com)
// Run: PW_PATH=$(npm root -g)/playwright node social/dips/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/dips';
const A = (f) => 'file://' + DIR + '/assets/' + f;
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png';
const P = JSON.parse(fs.readFileSync(DIR + '/prices.json', 'utf8'));
const W = 1080, H = 1350, N = 4;
const INK = '#0B0E11', LIME = '#B8F26A', RED = '#F6465D', GRAY = '#6B7280';
const usd = (v) => v >= 1000 ? '$' + Math.round(v).toLocaleString('en-US') : v >= 1 ? '$' + v.toFixed(2) : '$' + v.toFixed(3);

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Instrument+Serif:ital@0;1&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;background:#F3F4EE;font-family:'Inter Tight',sans-serif;color:${INK};overflow:hidden;position:relative}
.grain{position:absolute;inset:0;background-image:radial-gradient(rgba(11,14,17,.06) 1px,transparent 1.2px);background-size:22px 22px}
header{position:absolute;top:56px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center;z-index:5}
header img{height:40px}
.pill{font-family:'JetBrains Mono';font-weight:500;font-size:19px;letter-spacing:2.5px;border:1.5px solid ${INK};border-radius:99px;padding:9px 18px;background:#F3F4EE}
em{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;letter-spacing:-1px}
.tag{display:inline-block;font-family:'JetBrains Mono';font-weight:700;font-size:21px;letter-spacing:3px;background:${LIME};padding:6px 12px;border-radius:8px}
/* metallic coin */
.coin{position:absolute;border-radius:50%;background:conic-gradient(from 210deg,#f4f5f1,#a9ada6,#ffffff,#8d918a,#e9ebe6,#9a9e97,#f4f5f1);
  box-shadow:0 0 0 3px rgba(11,14,17,.08), 14px 22px 0 -2px #b9bdb4, 14px 22px 0 0 rgba(11,14,17,.08), 30px 50px 60px rgba(11,14,17,.28)}
.coin .face{position:absolute;inset:7%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffffff,#eef0ea 60%,#d9dcd3);display:flex;align-items:center;justify-content:center;
  box-shadow:inset 0 6px 14px rgba(11,14,17,.18), inset 0 -4px 10px rgba(255,255,255,.9)}
.coin .face img{width:64%;height:64%;object-fit:contain;border-radius:50%}
.coin .ring{position:absolute;inset:3.2%;border-radius:50%;border:2px dashed rgba(11,14,17,.16)}
.coin .gloss{position:absolute;inset:7%;border-radius:50%;background:linear-gradient(130deg,rgba(255,255,255,.55) 0%,rgba(255,255,255,0) 38%,rgba(255,255,255,0) 70%,rgba(255,255,255,.25) 100%)}
.price-tag{position:absolute;background:${INK};color:${LIME};font-family:'Inter Tight';font-weight:800;letter-spacing:-2px;padding:14px 26px 14px 44px;border-radius:14px;z-index:4;
  clip-path:polygon(22px 0,100% 0,100% 100%,22px 100%,0 50%)}
.price-tag:before{content:'';position:absolute;left:14px;top:50%;width:12px;height:12px;margin-top:-6px;border-radius:99px;background:#F3F4EE}
.card{position:absolute;left:44px;right:44px;height:470px;background:#fff;border-radius:34px;box-shadow:0 1px 0 #E1E4DA,0 24px 60px rgba(11,14,17,.07);overflow:visible}
.k{font-family:'JetBrains Mono';font-size:18px;letter-spacing:2.5px;color:${GRAY}}
`;
const page = (i, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="grain"></div>
<header><img src="${LOGO}"><div class="pill">ON SALE · ${String(i).padStart(2, '0')}/${String(N).padStart(2, '0')}</div></header>${body}</body></html>`;

const coin = (sym, size, x, y, rot = 0) => `<div class="coin" style="width:${size}px;height:${size}px;left:${x}px;top:${y}px;transform:rotate(${rot}deg)">
  <div class="ring"></div><div class="face"><img src="${A(sym + '.png')}"></div><div class="gloss"></div></div>`;

// one coin card: coin art on one side, copy on the other
function card(c, top, flip) {
  const p = P[c.sym];
  const off = Math.round(-p.off);
  const coinX = flip ? 650 : -40, textL = flip ? 50 : 360;
  return `<div class="card" style="top:${top}px">
    ${coin(c.sym, 360, coinX, 52, flip ? 8 : -8)}
    <div class="price-tag" style="font-size:54px;${flip ? 'left:560px' : 'left:150px'};top:-26px;transform:rotate(${flip ? 4 : -4}deg)">-${off}%</div>
    <div style="position:absolute;left:${textL}px;width:${flip ? 600 : 610}px;top:52px">
      <div style="display:flex;align-items:baseline;gap:18px"><div style="font-size:72px;font-weight:800;letter-spacing:-3px">${c.name}</div><div style="font-family:'JetBrains Mono';font-size:26px;color:${GRAY}">${c.sym.toUpperCase()}</div></div>
      <div style="display:flex;gap:28px;margin-top:10px;font-family:'JetBrains Mono';font-size:24px">
        <div><span style="color:${GRAY}">NOW</span> <b>${usd(p.price)}</b></div><div><span style="color:${GRAY}">ATH</span> <s style="text-decoration-thickness:2px">${usd(p.ath)}</s></div></div>
      <div style="margin-top:30px" class="k">WHAT'S COMING</div>
      <div style="font-size:33px;font-weight:700;letter-spacing:-.6px;line-height:1.18;margin-top:10px">${c.what}</div>
      <div style="font-size:25px;color:${GRAY};line-height:1.35;margin-top:14px">${c.why}</div>
    </div></div>`;
}

const pair = (i, kicker, title, a, b) => page(i, `
  <div style="position:absolute;left:64px;top:140px;z-index:2"><div class="tag">${kicker}</div>
  <div style="font-size:74px;font-weight:700;letter-spacing:-3.5px;line-height:1;margin-top:16px">${title}</div></div>
  ${card(a, 330, false)}${card(b, 840, true)}`);

const slides = [];
// 1 cover
slides.push(page(1, `
  <div style="position:absolute;right:-280px;top:440px;width:980px;height:980px;border-radius:999px;background:${LIME}"></div>
  <img src="${A('bitcoin-photo.png')}" style="position:absolute;width:800px;right:-260px;top:520px;transform:rotate(-14deg);filter:drop-shadow(40px 60px 50px rgba(11,14,17,.35))">
  <div class="price-tag" style="font-size:120px;padding:22px 44px 22px 76px;clip-path:polygon(40px 0,100% 0,100% 100%,40px 100%,0 50%);left:560px;top:640px;transform:rotate(-9deg)">-37%</div>
  <div style="position:absolute;left:64px;top:160px;z-index:3;width:1000px">
    <div style="font-weight:800;font-size:150px;letter-spacing:-8px;line-height:.9">The market<br>is <em style="font-size:172px;letter-spacing:-3px">on sale.</em></div>
  </div>
  <div style="position:absolute;left:64px;top:760px;z-index:3;width:470px">
    <div class="k">TOTAL CRYPTO MARKET CAP</div>
    <div style="display:flex;align-items:baseline;gap:16px;margin-top:10px"><div style="font-size:84px;font-weight:800;letter-spacing:-4px">$2.69T</div></div>
    <div style="font-family:'JetBrains Mono';font-size:24px;margin-top:6px"><span style="color:${GRAY}">PEAK</span> <s>$4.28T</s> <span style="color:${GRAY}">· OCT 2025</span></div>
    <div style="font-size:34px;font-weight:700;letter-spacing:-.8px;line-height:1.2;margin-top:34px">$1.59 trillion wiped out.<br><span style="color:${GRAY};font-weight:600">Every crash leaves a few coins on discount.</span></div>
  </div>
  <div style="position:absolute;left:64px;bottom:64px;z-index:4;font-size:30px;font-weight:600">6 coins worth a look <span style="font-size:36px">↓</span></div>`));

slides.push(pair(2, 'THE MAJORS', 'Blue chips, <em>half price.</em>',
  {sym: 'eth', name: 'Ethereum', what: 'Glamsterdam, the next big upgrade, is in public testing.', why: 'Built for parallel execution and much bigger blocks. Mainnet date still to be set.'},
  {sym: 'sol', name: 'Solana', what: 'Alpenglow went live Oct 21: its biggest consensus overhaul yet.', why: 'Targets ~150ms finality. Breakpoint conference hits London Nov 15 to 17.'}));
slides.push(pair(3, 'THE COLLABS PEOPLE FORGOT', 'Wall Street <em>is building here.</em>',
  {sym: 'link', name: 'Chainlink', what: 'CCIP 2.0 launched with ANZ, SBI and Bottomline.', why: 'Bottomline, a Swift service provider, brings it to 600+ banks for cross-border payments.'},
  {sym: 'ondo', name: 'Ondo', what: 'First tokenization firm plugged into DTCC\'s Fund/SERV.', why: '$4B+ in tokenized assets, including 450+ US stocks and ETFs on-chain.'}));
slides.push(pair(4, 'UPGRADES THIS MONTH', 'Fresh code, <em>old prices.</em>',
  {sym: 'zec', name: 'Zcash', what: 'NU7 upgrade, scheduled Nov 5: blocks 3x faster.', why: 'Block time drops from 75 to 25 seconds, with the same daily supply.'},
  {sym: 'xlm', name: 'Stellar', what: 'Bell upgrade goes to a mainnet vote Nov 23.', why: 'Adds post-quantum signature checks to smart contracts. Franklin Templeton runs a tokenized fund on Stellar.'}));

const browser = await chromium.launch();
const ctx = await browser.newContext({viewport: {width: W, height: H}, deviceScaleFactor: 2});
const pg = await ctx.newPage();
fs.mkdirSync(DIR + '/out', {recursive: true});
for (let i = 0; i < slides.length; i++) {
  const f = `${DIR}/out/_s${i + 1}.html`; fs.writeFileSync(f, slides[i]);
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({path: `${DIR}/out/on-sale-${String(i + 1).padStart(2, '0')}.png`}); fs.unlinkSync(f);
}
await browser.close();
console.log('done', slides.length);
