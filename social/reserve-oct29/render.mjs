// Proof of Reserves update (snapshot 2026-10-29 10:00 UTC+8): BTC 105%, ETH 109%, USDT 113%, from Hotcoin's PoR post.
// Reserve ratio = platform reserves ÷ user assets (hotcoin.com/en_US/reserve-fund/certificate). White data style, 1080x1080 @2x.
// Coin logos: CoinGecko. Run: PW_PATH=$(npm root -g)/playwright node social/reserve-oct29/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/reserve-oct29';
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png';
const SYM = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/symbol-official-white.png';
const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A', UP = '#17A86B', GRAY = '#6B7280', LINE = '#E6E8EB';
const rows = [['BTC', 'Bitcoin', 105, 'btc'], ['ETH', 'Ethereum', 109, 'eth'], ['USDT', 'Tether', 113, 'usdt']];
const MAX = 120, X = (v) => (v / MAX) * 100;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;background:#fff;color:${INK};font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
.m{font-family:'JetBrains Mono',monospace}
</style></head><body>
<!-- background art: giant faint shield built from the brand symbol ring -->
<svg width="1080" height="1080" style="position:absolute;inset:0">
  <defs><pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.6" fill="${INK}"/></pattern>
  <mask id="sh"><path d="M820 70 L1080 150 L1080 420 C1080 600 960 720 820 790 C680 720 560 600 560 420 L560 150 Z" fill="#fff"/></mask></defs>
  <rect width="1080" height="1080" fill="url(#dots)" mask="url(#sh)" opacity=".07"/>
  <path d="M760 360 l45 45 l95 -100" fill="none" stroke="${INK}" stroke-opacity=".08" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<div style="position:absolute;left:72px;right:72px;top:68px;display:flex;justify-content:space-between;align-items:center">
  <img src="${LOGO}" style="height:42px">
  <div class="m" style="font-size:18px;letter-spacing:2px;border:1.5px solid ${INK};border-radius:999px;padding:9px 18px;background:#fff">PROOF OF RESERVES · OCT 29, 2026</div>
</div>
<div style="position:absolute;left:72px;top:165px">
  <div class="m" style="font-size:20px;letter-spacing:3px;color:${GRAY}">EVERY RESERVE RATIO ABOVE</div>
  <div style="display:flex;align-items:flex-end;gap:22px;margin-top:4px">
    <div style="font-weight:800;font-size:170px;letter-spacing:-8px;line-height:.9;color:${UP}">100%</div>
  </div>
  <div style="font-weight:700;font-size:46px;letter-spacing:-1.5px;line-height:1.1;margin-top:20px">Every asset, fully backed.<br><span style="color:${GRAY}">Traceable and verifiable anytime.</span></div>
</div>
<div style="position:absolute;left:72px;right:72px;top:545px">
  <div class="m" style="display:flex;font-size:16px;letter-spacing:2.5px;color:${GRAY};padding-bottom:12px"><div style="width:250px">ASSET</div><div style="flex:1">COVERAGE</div><div style="width:150px;text-align:right">RATIO</div></div>
  ${rows.map(([s, n, v, f]) => `<div style="display:flex;align-items:center;padding:16px 0;border-top:1.5px solid ${LINE}">
    <div style="width:250px;display:flex;align-items:center;gap:16px"><img src="file://${DIR}/assets/${f}.png" style="width:52px;height:52px;border-radius:99px">
      <div><div style="font-weight:800;font-size:30px;letter-spacing:-.5px">${s}</div><div style="font-size:18px;color:${GRAY}">${n}</div></div></div>
    <div style="flex:1;position:relative;height:30px;margin-right:30px">
      <div style="position:absolute;inset:0;border-radius:99px;background:#F1F3EE"></div>
      <div style="position:absolute;left:0;top:0;bottom:0;width:${X(100)}%;border-radius:99px 0 0 99px;background:${INK}"></div>
      <div style="position:absolute;left:${X(100)}%;top:0;bottom:0;width:${X(v) - X(100)}%;border-radius:0 99px 99px 0;background:${LIME};box-shadow:0 0 0 2px ${GREEN} inset"></div>
      <div style="position:absolute;left:${X(100)}%;top:-10px;bottom:-10px;width:3px;background:${INK}"></div>
    </div>
    <div style="width:150px;text-align:right;font-weight:800;font-size:54px;letter-spacing:-2px;color:${INK}">${v}<span style="font-size:32px">%</span></div>
  </div>`).join('')}
  <div style="border-top:1.5px solid ${LINE};display:flex;justify-content:space-between;align-items:center;padding-top:16px">
    <div class="m" style="font-size:16px;color:${GRAY};letter-spacing:1px">
      <span style="display:inline-block;width:14px;height:14px;background:${INK};border-radius:3px;vertical-align:-2px"></span> 100% = USER ASSETS &nbsp;
      <span style="display:inline-block;width:14px;height:14px;background:${LIME};border:2px solid ${GREEN};border-radius:3px;vertical-align:-2px"></span> EXTRA RESERVES</div>
    <div class="m" style="font-size:16px;color:${GRAY}">SNAPSHOT 10:00 UTC+8</div>
  </div>
</div>
<div style="position:absolute;left:72px;right:72px;bottom:56px;display:flex;justify-content:space-between;align-items:center">
  <div style="font-size:21px;color:${GRAY}">Reserve ratio = platform reserves ÷ user assets</div>
  <div class="m" style="font-weight:700;font-size:20px;background:${INK};color:${LIME};padding:14px 24px;border-radius:999px">Verify on hotcoin.com →</div>
</div>
</body></html>`;

const browser = await chromium.launch();
const pg = await (await browser.newContext({viewport: {width: 1080, height: 1080}, deviceScaleFactor: 2})).newPage();
const f = `${DIR}/_p.html`; fs.writeFileSync(f, html);
await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
await pg.screenshot({path: `${DIR}/hotcoin-por-oct29.png`}); fs.unlinkSync(f);
await browser.close(); console.log('done');
