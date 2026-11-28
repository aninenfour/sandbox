// Viral-format tests 1 + 2: dense data table and 2x2 quadrant, real CoinGecko data.
// Source: api.coingecko.com /coins/markets (vs USD, top 60 by market cap, price_change_percentage=24h,7d,1y),
// pulled 2026-11-28 ~03:17 UTC (data/markets.json). Stablecoins, gold tokens and exchange tokens excluded.
// Logos: CoinGecko image URLs only.
import fs from 'fs'; import path from 'path'; import {createRequire} from 'module';
const require = createRequire(import.meta.url); const {chromium} = require(process.env.PW_PATH || 'playwright');
const DIR = path.dirname(new URL(import.meta.url).pathname);
const coins = JSON.parse(fs.readFileSync(`${DIR}/data/coins.json`, 'utf8')).filter(c => c.symbol !== 'eursafo').slice(0, 22);
const b64 = f => fs.existsSync(f) ? 'data:image/png;base64,' + fs.readFileSync(f).toString('base64') : '';
const logo = c => b64(`${DIR}/logos/${c.id}.png`);
const UP = '#17A86B', DN = '#E5484D', LIME = '#B8F26A';
const pct = v => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
const money = v => v >= 1e12 ? `$${(v / 1e12).toFixed(2)}T` : v >= 1e9 ? `$${(v / 1e9).toFixed(1)}B` : `$${(v / 1e6).toFixed(0)}M`;
const price = v => v >= 1000 ? `$${v.toLocaleString('en-US', {maximumFractionDigits: 0})}` : v >= 1 ? `$${v.toFixed(2)}` : v >= .01 ? `$${v.toFixed(4)}` : `$${v.toPrecision(3)}`;
const fonts = `@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block');`;

// ---- 1. table (1080x1350), screenshot-of-a-dashboard look
const T = coins.slice(0, 20);
const rows = T.map((c, i) => `<tr>
  <td class="m dim">${i + 1}</td>
  <td><div style="display:flex;align-items:center;gap:10px"><img src="${logo(c)}" style="width:26px;height:26px;border-radius:50%"><b>${c.symbol.toUpperCase()}</b><span class="dim" style="font-size:17px">${c.name}</span></div></td>
  <td class="m r">${price(c.current_price)}</td>
  <td class="m r" style="color:${c.price_change_percentage_1y_in_currency >= 0 ? UP : DN}">${pct(c.price_change_percentage_1y_in_currency)}</td>
  <td class="m r" style="color:${DN}">${pct(c.ath_change_percentage)}</td>
  <td class="m r dim">${money(c.market_cap)}</td></tr>`).join('');
const greens = T.filter(c => c.price_change_percentage_1y_in_currency > 0).length;
const table = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
body{margin:0;width:1080px;height:1350px;background:#0D1117;font-family:'Inter Tight';color:#E6EDF3}
.m{font-family:'JetBrains Mono';font-variant-numeric:tabular-nums}.r{text-align:right}.dim{color:#8B949E}
table{border-collapse:collapse;width:100%;font-size:20px}th{font:600 15px 'JetBrains Mono';letter-spacing:1px;color:#8B949E;text-align:right;padding:10px 12px;border-bottom:1px solid #30363D}
th:nth-child(2),th:first-child{text-align:left}td{padding:9px 12px;border-bottom:1px solid #1F242C;height:30px}tr:nth-child(odd) td{background:#11161D}
</style></head><body>
<div style="padding:56px 48px 0">
 <div class="m" style="font-size:18px;letter-spacing:3px;color:${LIME}">TOP 20 COINS BY MARKET CAP · NOV 28, 2026</div>
 <div style="font-weight:800;font-size:54px;letter-spacing:-1.5px;margin-top:10px;line-height:1.05">Only <span style="color:${UP}">${greens} of 20</span> are up on the year.</div>
 <div style="font-size:24px;color:#8B949E;margin-top:10px">Every single one is still below its all-time high.</div>
</div>
<div style="margin:34px 32px 0;border:1px solid #30363D;border-radius:14px;overflow:hidden;background:#0D1117">
<table><thead><tr><th>#</th><th>COIN</th><th>PRICE</th><th>1Y</th><th>FROM ATH</th><th>MCAP</th></tr></thead><tbody>${rows}</tbody></table></div>
<div style="position:absolute;right:48px;top:52px"><img src="${b64(DIR + '/../../hotcoin-tradfi/public/brand/logo-official-white.png')}" style="height:30px"></div>
</body></html>`;

// ---- 2. quadrant (1200x1200): x = 1Y change, y = distance from ATH
const X0 = -70, X1 = 100, Y0 = -97, Y1 = -25, PL = 90, PR = 1110, PT = 210, PB = 1110;
const sx = v => PL + (Math.max(X0, Math.min(X1, v)) - X0) / (X1 - X0) * (PR - PL);
const lg = v => Math.log(1 + Math.max(Y0, Math.min(Y1, v)) / 100);
const sy = v => PB - (lg(v) - lg(Y0)) / (lg(Y1) - lg(Y0)) * (PB - PT);
const cx = sx(0), cy = sy(-75);
const P = coins.map(c => ({c, x: sx(c.price_change_percentage_1y_in_currency), y: sy(c.ath_change_percentage)}));
for (let it = 0; it < 200; it++) for (const a of P) for (const b of P) { if (a === b) continue; const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy) || 1; if (d < 78) { const f = (78 - d) / 2 / d; a.x += dx * f * .5; a.y += dy * f * .5; } }
for (const a of P) { a.x = Math.max(PL + 20, Math.min(PR - 20, a.x)); a.y = Math.max(PT + 20, Math.min(PB - 30, a.y)); }
const dots = P.map(({c, x, y}) => {
  return `<div style="position:absolute;left:${x - 24}px;top:${y - 24}px;width:48px;text-align:center"><img src="${logo(c)}" style="width:48px;height:48px;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.18);background:#fff"><div style="font:600 14px 'Inter Tight';color:#333;margin-top:3px;white-space:nowrap;transform:translateX(${(48 - 60) / 2}px);width:60px">${c.symbol.toUpperCase()}</div></div>`; }).join('');
const quad = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
body{margin:0;width:1200px;height:1200px;background:#E9E9E6;font-family:'Inter Tight';position:relative}</style></head><body>
<div style="position:absolute;inset:28px;background:#F6F6F4;border-radius:22px"></div>
<div style="position:absolute;left:70px;top:62px;font-weight:800;font-size:46px;letter-spacing:-1px;color:#111;line-height:1.05">Who actually held up<br>this year?</div>
<div class="m" style="position:absolute;right:70px;top:70px;font:500 16px 'JetBrains Mono';letter-spacing:2px;color:#555;text-align:right">TOP 22 COINS<br>NOV 28, 2026<br>Y AXIS: LOG SCALE</div>
<svg width="1200" height="1200" style="position:absolute;inset:0">
 <defs><marker id="a" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10" fill="none" stroke="#222" stroke-width="1.8"/></marker></defs>
 <line x1="${PL}" y1="${cy}" x2="${PR}" y2="${cy}" stroke="#222" stroke-width="2" marker-end="url(#a)" marker-start="url(#a)"/>
 <line x1="${cx}" y1="${PB}" x2="${cx}" y2="${PT - 10}" stroke="#222" stroke-width="2" marker-end="url(#a)" marker-start="url(#a)"/>
</svg>
<div style="position:absolute;left:70px;top:1122px;font:700 20px 'Inter Tight';color:${DN}">&larr; Down on the year</div>
<div style="position:absolute;right:${1200 - PR}px;top:${cy - 40}px;font:700 20px 'Inter Tight';color:${UP}">Up on the year &rarr;</div>
<div style="position:absolute;right:${1200 - cx + 14}px;top:${PT - 14}px;font:700 20px 'Inter Tight';color:#111">Closer to ATH</div>
<div style="position:absolute;right:${1200 - cx + 14}px;top:${PB - 18}px;font:700 20px 'Inter Tight';color:#111">Far below ATH</div>
${dots}
<img src="${b64(DIR + '/../../hotcoin-tradfi/public/brand/logo-official-black.png')}" style="position:absolute;right:70px;bottom:58px;height:28px">
</body></html>`;

const br = await chromium.launch(); const p = await br.newPage({deviceScaleFactor: 2});
fs.mkdirSync(`${DIR}/out`, {recursive: true});
await p.setViewportSize({width: 1080, height: 1350}); await p.setContent(table, {waitUntil: 'networkidle'}); await p.waitForTimeout(300); await p.screenshot({path: `${DIR}/out/table.png`});
await p.setViewportSize({width: 1200, height: 1200}); await p.setContent(quad, {waitUntil: 'networkidle'}); await p.waitForTimeout(300); await p.screenshot({path: `${DIR}/out/quadrant.png`});
await br.close();
console.log('greens', greens, coins.map(c => c.symbol + ' ' + c.price_change_percentage_1y_in_currency.toFixed(0) + '/' + c.ath_change_percentage.toFixed(0)).join(', '));
