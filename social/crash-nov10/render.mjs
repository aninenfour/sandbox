// "Recent crash" carousel, 4 slides 1080x1350 @2x. Slide 1 = user-supplied meme, centred under the logo.
// Prices: Binance BTCUSDT / ETHUSDT daily closes (data-api.binance.vision): BTC 81,343 (Oct 28) → 74,714 (Nov 10); ETH 2,425 (Nov 4) → 2,119 (Nov 10).
// Reasons (news, Nov 5-9, 2026): spot BTC ETF net outflows ≈$1.28B for Nov 2-6, worst week since June (SoSoValue via crypto.news / coinpaprika);
// >$1B liquidations in 24h, ~$913M longs (crypto.news / Bitcoin Magazine); Nasdaq down as much as 5% in an AI-stock sell-off on Nov 5 (FXStreet);
// worries about tougher US crypto oversight after the midterms (Investing.com); October CPI due Nov 10. Competitors are not named.
// Run: PW_PATH=$(npm root -g)/playwright node social/crash-nov10/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/crash-nov10';
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png';
const INK = '#0B0E11', RED = '#E5484D', GRAY = '#6B7280', LINE = '#E6E8EB', LIME = '#B8F26A';
const K = JSON.parse(fs.readFileSync(DIR + '/assets/btc4h.json', 'utf8')).map((k) => [k[0], +k[4]]);

const css = `@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:#fff;color:${INK};font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
.m{font-family:'JetBrains Mono',monospace}`;
const head = (i, pill) => `<div style="position:absolute;left:72px;right:72px;top:68px;display:flex;justify-content:space-between;align-items:center">
  <img src="${LOGO}" style="height:42px">
  <div class="m" style="font-size:18px;letter-spacing:2px;border:1.5px solid ${INK};border-radius:999px;padding:9px 18px">${pill} · ${i}/4</div></div>`;
const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`;

function chart() {
  const w = 936, h = 330, vs = K.map((p) => p[1]), lo = Math.min(...vs) * 0.995, hi = Math.max(...vs) * 1.005;
  const X = (i) => (i / (K.length - 1)) * w, Y = (v) => h - ((v - lo) / (hi - lo)) * h;
  const d = K.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('');
  const mi = vs.indexOf(Math.max(...vs)), li = K.length - 1;
  const day = (t) => {const x = new Date(t); return ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][x.getUTCMonth()] + ' ' + x.getUTCDate();};
  const ticks = K.map((p, i) => [i, p[0]]).filter(([i, t]) => new Date(t).getUTCHours() === 0 && new Date(t).getUTCDate() % 4 === 0);
  return `<svg width="${w}" height="${h + 44}" style="overflow:visible">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${RED}" stop-opacity=".16"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></linearGradient></defs>
    ${[0, .25, .5, .75, 1].map((f) => `<line x1="0" x2="${w}" y1="${h * f}" y2="${h * f}" stroke="${LINE}" stroke-width="1.5"/>`).join('')}
    <path d="${d} L${w},${h} L0,${h}Z" fill="url(#g)"/><path d="${d}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <circle cx="${X(mi)}" cy="${Y(vs[mi])}" r="9" fill="#fff" stroke="${INK}" stroke-width="4"/>
    <text x="${X(mi) + 18}" y="${Y(vs[mi]) + 8}" font-family="JetBrains Mono" font-weight="700" font-size="22">$${Math.round(vs[mi]).toLocaleString('en-US')}</text>
    <circle cx="${X(li)}" cy="${Y(vs[li])}" r="10" fill="${RED}" stroke="#fff" stroke-width="4"/>
    <text x="${X(li) - 6}" y="${Y(vs[li]) + 46}" text-anchor="end" paint-order="stroke" stroke="#fff" stroke-width="8" font-family="JetBrains Mono" font-weight="700" font-size="22" fill="${RED}">NOW</text>
    ${ticks.map(([i, t]) => `<text x="${X(i)}" y="${h + 36}" text-anchor="middle" font-family="JetBrains Mono" font-size="18" fill="${GRAY}">${day(t)}</text>`).join('')}
  </svg>`;
}

const reason = (n, title, big, unit, text) => `<div style="padding:30px 0;border-top:1.5px solid ${LINE};display:flex;gap:30px;align-items:flex-start">
  <div class="m" style="font-weight:700;font-size:22px;color:${GRAY};width:44px;padding-top:6px">0${n}</div>
  <div style="flex:1">
    <div style="font-weight:700;font-size:38px;letter-spacing:-1px">${title}</div>
    <div style="display:flex;align-items:baseline;gap:12px;margin-top:10px"><div style="font-weight:800;font-size:92px;letter-spacing:-4px;line-height:1;color:${RED}">${big}</div><div style="font-weight:700;font-size:30px;color:${RED}">${unit}</div></div>
    <div style="font-size:27px;line-height:1.35;color:${GRAY};margin-top:12px">${text}</div>
  </div></div>`;

const slides = [
  page(`<img src="file://${DIR}/assets/meme.png" style="position:absolute;left:50%;top:120px;height:1100px;transform:translateX(-50%);border-radius:24px">
    <img src="${LOGO}" style="position:absolute;right:72px;bottom:58px;height:34px">`),
  page(`${head(2, 'MARKET CHECK')}
    <div style="position:absolute;left:72px;top:180px">
      <div class="m" style="font-size:20px;letter-spacing:3px;color:${GRAY}">BTC SINCE OCT 28</div>
      <div style="font-weight:800;font-size:190px;letter-spacing:-9px;line-height:.92;color:${RED}">-8.2%</div>
      <div style="font-weight:700;font-size:50px;letter-spacing:-1.5px;line-height:1.1;margin-top:20px">Five red weeks in a row.<br><span style="color:${GRAY}">Here's what happened.</span></div>
    </div>
    <div style="position:absolute;left:72px;top:600px">${chart()}</div>
    <div style="position:absolute;left:72px;right:72px;top:1070px;display:flex;gap:24px">
      ${[['BTC', '$81,343', '$74,714', '-8.2%'], ['ETH', '$2,425', '$2,119', '-12.6%']].map(([s, a, b, p]) => `<div style="flex:1;border:1.5px solid ${LINE};border-radius:24px;padding:22px 26px">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font-weight:800;font-size:34px">${s}</div><div style="font-weight:800;font-size:40px;color:${RED}">${p}</div></div>
        <div class="m" style="font-size:20px;color:${GRAY};margin-top:8px">${a} → <b style="color:${INK}">${b}</b></div></div>`).join('')}
    </div>`),
  page(`${head(3, 'WHY IT FELL')}
    <div style="position:absolute;left:72px;top:180px;font-weight:800;font-size:84px;letter-spacing:-3.5px;line-height:1">Big money left.<br><span style="color:${GRAY}">Leverage got wiped.</span></div>
    <div style="position:absolute;left:72px;right:72px;top:450px">
      ${reason(1, 'Spot Bitcoin ETFs saw outflows', '$1.28B', 'out in 5 days', 'Nov 2 to 6 was the worst week for the funds since June. When ETFs sell, they sell real bitcoin.')}
      ${reason(2, 'Leveraged longs got liquidated', '$1B+', 'in 24 hours', 'Most of it was long positions, forced to close as prices dipped. Forced selling pushed prices lower still.')}
    </div>`),
  page(`${head(4, 'WHY IT FELL')}
    <div style="position:absolute;left:72px;top:180px;font-weight:800;font-size:84px;letter-spacing:-3.5px;line-height:1">Tech wobbled.<br><span style="color:${GRAY}">Rules feel uncertain.</span></div>
    <div style="position:absolute;left:72px;right:72px;top:450px">
      ${reason(3, 'AI stocks sold off', '-5%', 'Nasdaq, Nov 5', 'Crypto has been trading in step with tech. When AI stocks dropped, bitcoin followed.')}
      <div style="padding:30px 0;border-top:1.5px solid ${LINE};display:flex;gap:30px">
        <div class="m" style="font-weight:700;font-size:22px;color:${GRAY};width:44px;padding-top:6px">04</div>
        <div style="flex:1"><div style="font-weight:700;font-size:38px;letter-spacing:-1px">Regulation worries after the midterms</div>
        <div style="font-size:27px;line-height:1.35;color:${GRAY};margin-top:12px">Traders are pricing in the chance of tighter US crypto rules.</div></div></div>
    </div>
    <div style="position:absolute;left:72px;right:72px;bottom:72px;background:${INK};color:#fff;border-radius:28px;padding:32px 36px">
      <div class="m" style="font-size:19px;letter-spacing:3px;color:${LIME}">WHAT TO WATCH</div>
      <div style="font-weight:700;font-size:36px;line-height:1.25;margin-top:12px">US inflation data (CPI) and whether ETF flows turn positive again.</div>
      <div style="font-size:24px;color:rgba(255,255,255,.65);margin-top:14px">Stay calm, size your risk, and use stop-losses. Not financial advice.</div>
    </div>`),
];

const browser = await chromium.launch();
const pg = await (await browser.newContext({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2})).newPage();
fs.mkdirSync(DIR + '/out', {recursive: true});
for (let i = 0; i < slides.length; i++) {
  const f = `${DIR}/_s.html`; fs.writeFileSync(f, slides[i]);
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({path: `${DIR}/out/crash-${i + 1}.png`}); fs.unlinkSync(f);
}
await browser.close(); console.log('done');
