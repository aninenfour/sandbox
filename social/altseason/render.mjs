// "Altseason watch" carousel: 8 slides, 1080x1350, rendered at 2x.
// Data (data.json, pulled Nov 5, 2026): CoinMarketCap Altcoin Season Index + altcoin market cap (data-api altcoin-season/chart),
// CoinMarketCap BTC dominance (data-api global-metrics historical), Binance ETHBTC daily closes (data-api.binance.vision),
// DefiLlama total stablecoin supply (stablecoins.llama.fi). Photos: Unsplash (see ../../hotcoin-tradfi/FOOTAGE_CREDITS.md),
// background removed with rembg (isnet-general-use).
// Run: PW_PATH=$(npm root -g)/playwright node social/altseason/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/altseason';
const A = (f) => 'file://' + DIR + '/assets/' + f;
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png';
const D = JSON.parse(fs.readFileSync(DIR + '/data.json', 'utf8'));
const W = 1080, H = 1350, N = 8;
const INK = '#0B0E11', LIME = '#B8F26A', RED = '#F6465D', AMB = '#F5A524', GRN = '#2DBD85', GRAY = '#6B7280';

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const last = (s) => s[s.length - 1][1];
const pct = (a, b) => ((a / b - 1) * 100);

// line chart: series [[date, v]], optional band / ref line
function chart(series, {w = 740, h = 270, color = INK, fmt = (v) => v, band, ref, pad = 0.08}) {
  const vs = series.map((p) => p[1]);
  let lo = Math.min(...vs), hi = Math.max(...vs);
  if (ref) { lo = Math.min(lo, ref.v); hi = Math.max(hi, ref.v); }
  const r = hi - lo; lo -= r * pad; hi += r * pad;
  const X = (i) => (i / (series.length - 1)) * w, Y = (v) => h - ((v - lo) / (hi - lo)) * h;
  const d = series.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('');
  const lx = X(series.length - 1), ly = Y(last(series));
  const ticks = [];
  series.forEach((p, i) => { if (p[0].endsWith('-01') && ['01', '04', '07', '10'].includes(p[0].slice(5, 7))) ticks.push([X(i), MON[+p[0].slice(5, 7) - 1] + ' ' + p[0].slice(2, 4)]); });
  return `<svg width="${w + 150}" height="${h + 50}" style="overflow:visible">
    <defs><linearGradient id="g${color.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".16"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    ${[0, .25, .5, .75, 1].map((f) => `<line x1="0" x2="${w}" y1="${h * f}" y2="${h * f}" stroke="#E6E8E1" stroke-width="1.5"/>`).join('')}
    ${ref ? `<line x1="0" x2="${w}" y1="${Y(ref.v)}" y2="${Y(ref.v)}" stroke="${INK}" stroke-width="2" stroke-dasharray="6 7"/><text x="0" y="${Y(ref.v) - 14}" font-family="JetBrains Mono" font-size="20" font-weight="700" fill="${INK}">${ref.label}</text>` : ''}
    <path d="${d} L${w},${h} L0,${h}Z" fill="url(#g${color.slice(1)})"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${lx}" cy="${ly}" r="11" fill="${LIME}" stroke="${INK}" stroke-width="4"/>
    <text x="${lx + 22}" y="${ly + 9}" font-family="JetBrains Mono" font-weight="700" font-size="26" fill="${INK}">${fmt(last(series))}</text>
    ${ticks.map(([x, t]) => `<text x="${x}" y="${h + 40}" font-family="JetBrains Mono" font-size="19" fill="${GRAY}" text-anchor="middle">${t.toUpperCase()}</text>`).join('')}
  </svg>`;
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Instrument+Serif:ital@0;1&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;background:#F3F4EE;font-family:'Inter Tight',sans-serif;color:${INK};overflow:hidden;position:relative}
.grain{position:absolute;inset:0;background-image:radial-gradient(rgba(11,14,17,.06) 1px,transparent 1.2px);background-size:22px 22px;pointer-events:none}
header{position:absolute;top:56px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center;z-index:5}
header img{height:40px}
.pill{font-family:'JetBrains Mono';font-weight:500;font-size:19px;letter-spacing:2.5px;border:1.5px solid ${INK};border-radius:99px;padding:9px 18px;background:#F3F4EE}
.num{position:absolute;font-weight:800;font-size:420px;letter-spacing:-24px;line-height:.8;color:transparent;-webkit-text-stroke:2.5px rgba(11,14,17,.13);z-index:0}
h1{font-weight:700;font-size:96px;letter-spacing:-4px;line-height:.95}
em{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;letter-spacing:-1px}
.what{font-size:31px;color:${GRAY};font-weight:500;margin-top:16px;line-height:1.3}
.kpi{display:flex;align-items:baseline;gap:22px;margin-top:34px}
.kpi b{font-size:120px;letter-spacing:-6px;line-height:1;font-weight:700}
.chip{font-family:'JetBrains Mono';font-weight:500;font-size:21px;padding:8px 14px;border-radius:10px;background:#fff;border:1.5px solid #E1E4DA;white-space:nowrap}
.chip.dn{color:${RED}} .chip.up{color:#169E6B}
.card{position:absolute;left:44px;right:44px;background:#fff;border-radius:32px;padding:40px 40px 26px;box-shadow:0 1px 0 #E1E4DA,0 24px 60px rgba(11,14,17,.07)}
.row{position:absolute;left:64px;right:64px;bottom:96px;display:flex;gap:22px;align-items:stretch}
.rule{flex:1;background:${INK};color:#F3F4EE;border-radius:26px;padding:26px 30px}
.rule small,.now small{display:block;font-family:'JetBrains Mono';font-size:18px;letter-spacing:2.5px;opacity:.6;margin-bottom:10px}
.rule p{font-size:29px;font-weight:600;line-height:1.25}
.now{width:330px;border-radius:26px;padding:26px 28px;background:#fff;border:2px solid #E1E4DA}
.now p{font-size:24px;font-weight:500;color:${GRAY};line-height:1.3;margin-top:10px}
.st{display:inline-flex;align-items:center;gap:12px;font-family:'JetBrains Mono';font-weight:700;font-size:25px;letter-spacing:1px}
.dot{width:22px;height:22px;border-radius:99px;box-shadow:0 0 0 6px rgba(0,0,0,.05)}
footer{position:absolute;left:64px;bottom:44px;font-family:'JetBrains Mono';font-size:17px;color:${GRAY};letter-spacing:.5px}
.cut{position:absolute;z-index:3;filter:drop-shadow(0 30px 30px rgba(11,14,17,.28)) drop-shadow(0 6px 8px rgba(11,14,17,.18))}
`;
const status = (c, t) => `<span class="st"><span class="dot" style="background:${c}"></span>${t}</span>`;
const page = (i, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="grain"></div>
<header><img src="${LOGO}"><div class="pill">ALTSEASON WATCH · ${String(i).padStart(2, '0')}/${String(N).padStart(2, '0')}</div></header>${body}</body></html>`;

const sign = ({i, n, title, what, kpi, chips, chartSvg, rule, color, label, now, img, src}) => page(i, `
  <div class="num" style="right:30px;top:140px">${n}</div>
  <div style="position:absolute;left:64px;top:170px;right:64px;z-index:2">
    <div style="font-family:'JetBrains Mono';font-weight:700;font-size:21px;letter-spacing:3px;color:${INK};background:${LIME};display:inline-block;padding:6px 12px;border-radius:8px;margin-bottom:22px">SIGN ${n}</div>
    <h1>${title}</h1><div class="what">${what}</div>
    <div class="kpi"><b>${kpi}</b><div style="display:flex;flex-direction:column;gap:10px">${chips}</div></div>
  </div>
  <div class="card" style="top:640px;height:400px">${chartSvg}</div>
  ${img}
  <div class="row"><div class="rule"><small>ALTSEASON SIGNAL</small><p>${rule}</p></div>
  <div class="now"><small>NOW</small>${status(color, label)}<p>${now}</p></div></div>
  `);

// ---------- data ----------
const dom = D.dom, eb = D.ethbtc, asi = D.asi, st = D.stable, alt = D.alt;
const at = (s, back) => s[s.length - 1 - back][1];
const domR = [Math.min(...dom.map((p) => p[1])), Math.max(...dom.map((p) => p[1]))];
const altMax = alt.reduce((m, p) => (p[1] > m[1] ? p : m));
const ch = (v, cls) => `<span class="chip ${cls}">${v}</span>`;
const sgn = (v, d = 1) => (v >= 0 ? '+' : '') + v.toFixed(d) + '%';

const slides = [];
// 1 cover
slides.push(page(1, `
  <div style="position:absolute;left:-120px;top:520px;width:900px;height:900px;border-radius:999px;background:${LIME}"></div>
  <div style="position:absolute;left:64px;top:190px;z-index:2">
    <div style="font-weight:800;font-size:212px;letter-spacing:-13px;line-height:.86;margin-top:10px">Alt<br>season</div>
    <div style="font-size:76px;font-weight:600;letter-spacing:-2.5px;line-height:1.02;margin-top:30px">is it coming?<br><em style="font-size:86px">5 signs</em> to watch.</div>
  </div>
  <img class="cut" src="${A('binoculars.png')}" style="width:800px;right:-90px;top:900px;transform:rotate(-8deg);filter:grayscale(1) contrast(1.25) brightness(1.35) drop-shadow(0 30px 30px rgba(11,14,17,.3))">
  <div style="position:absolute;right:64px;top:250px;display:flex;flex-direction:column;gap:16px;align-items:flex-end;z-index:4">
    ${[['BTC.D', last(dom).toFixed(2) + '%'], ['ETH/BTC', last(eb).toFixed(4)], ['ALT INDEX', last(asi) + '/100']].map(([k, v], j) => `<div style="background:#fff;border-radius:16px;padding:14px 20px;font-family:'JetBrains Mono';font-size:22px;box-shadow:0 10px 30px rgba(11,14,17,.1);transform:rotate(${[3, -2, 2][j]}deg)"><span style="color:${GRAY}">${k}</span> <b>${v}</b></div>`).join('')}
  </div>
  <div style="position:absolute;left:64px;bottom:64px;z-index:4;font-size:30px;font-weight:600;display:flex;align-items:center;gap:14px">Read the thread <span style="font-size:40px">↓</span></div>`));

// 2 BTC dominance
slides.push(sign({i: 2, n: '01', title: 'Bitcoin <em>dominance</em>', what: "BTC's share of the whole crypto market.",
  kpi: last(dom).toFixed(1) + '%', chips: ch(`1Y RANGE ${domR[0].toFixed(1)}–${domR[1].toFixed(1)}%`, '') + ch(`90D ${sgn(last(dom) - at(dom, 90), 2).replace('%', ' pts')}`, last(dom) > at(dom, 90) ? 'dn' : 'up'),
  chartSvg: chart(dom, {fmt: (v) => v.toFixed(1) + '%'}), rule: 'Dominance drops hard and fast as money rotates out of BTC into alts.',
  color: RED, label: 'NOT YET', now: 'Stuck near 60%. Bitcoin still leads.',
  img: `<img class="cut" src="${A('bitcoin.png')}" style="width:270px;right:36px;top:330px;transform:rotate(12deg)">`, src: 'Source: CoinMarketCap · 1 year to Nov 5, 2026'}));

// 3 ETH/BTC
slides.push(sign({i: 3, n: '02', title: 'ETH / BTC <em>ratio</em>', what: 'ETH priced in bitcoin. Usually the first domino.',
  kpi: last(eb).toFixed(4), chips: ch(`1Y ${sgn(pct(last(eb), eb[0][1]))}`, 'dn') + ch(`90D ${sgn(pct(last(eb), at(eb, 90)))}`, 'up'),
  chartSvg: chart(eb, {fmt: (v) => v.toFixed(4)}), rule: 'ETH/BTC breaks out of its range and keeps climbing for weeks.',
  color: AMB, label: 'STIRRING', now: `Off the ${Math.min(...eb.map((p) => p[1])).toFixed(3)} low, below a year ago.`,
  img: `<img class="cut" src="${A('scale.png')}" style="width:330px;right:46px;top:330px;transform:rotate(-4deg)">`, src: 'Source: Binance ETHBTC daily close · 1 year to Nov 5, 2026'}));

// 4 Altcoin Season Index (gauge)
const v = last(asi), ang = Math.PI * (1 - v / 100);
const R = 250, cx = 456, cy = 300;
const arc = (a0, a1) => { const p = (t) => [cx + R * Math.cos(Math.PI * (1 - t / 100)), cy - R * Math.sin(Math.PI * (1 - t / 100))]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1}`; };
const gauge = `<svg width="912" height="340" style="overflow:visible">
  <path d="${arc(0, 25)}" stroke="#D9DCD2" stroke-width="56" fill="none"/>
  <path d="${arc(25.6, 74.4)}" stroke="#ECEEE7" stroke-width="56" fill="none"/>
  <path d="${arc(75, 100)}" stroke="${LIME}" stroke-width="56" fill="none"/>
  <text x="${cx - R - 28}" y="${cy + 44}" font-family="JetBrains Mono" font-size="20" fill="${GRAY}">BITCOIN SEASON</text>
  <text x="${cx + R + 28}" y="${cy + 44}" font-family="JetBrains Mono" font-size="20" fill="${INK}" text-anchor="end" font-weight="700">ALTCOIN SEASON 75+</text>
  <line x1="${cx}" y1="${cy}" x2="${cx + (R - 20) * Math.cos(ang)}" y2="${cy - (R - 20) * Math.sin(ang)}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
  <circle cx="${cx}" cy="${cy}" r="24" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="9" fill="${LIME}"/>
  <text x="${cx}" y="${cy - 90}" text-anchor="middle" font-family="Inter Tight" font-weight="700" font-size="104" letter-spacing="-5" fill="${INK}">${v}</text>
</svg>`;
slides.push(sign({i: 4, n: '03', title: 'Altcoin Season <em>Index</em>', what: 'Share of the top 100 coins beating BTC over 90 days.',
  kpi: v + '<span style="font-size:56px;color:#9CA3AF">/100</span>', chips: ch(`30D AGO ${at(asi, 30)}`, 'dn') + ch(`1Y HIGH ${Math.max(...asi.map((p) => p[1]))}`, ''),
  chartSvg: gauge, rule: '75 or higher: three in four top coins outperform bitcoin.',
  color: AMB, label: 'NEUTRAL', now: `Peaked at ${Math.max(...asi.map((p) => p[1]))} in late September, now cooling.`,
  img: `<img class="cut" src="${A('thermo.png')}" style="height:470px;right:56px;top:300px;transform:rotate(9deg)">`, src: 'Source: CoinMarketCap Altcoin Season Index · Nov 5, 2026'}));

// 5 Stablecoins
slides.push(sign({i: 5, n: '04', title: 'Stablecoin <em>supply</em>', what: 'Dry powder: dollars on-chain, ready to buy.',
  kpi: '$' + last(st).toFixed(1) + 'B', chips: ch(`1Y ${sgn(pct(last(st), st[0][1]))}`, 'dn') + ch(`90D ${sgn(pct(last(st), at(st, 90)))}`, 'dn'),
  chartSvg: chart(st, {fmt: (v) => '$' + v.toFixed(0) + 'B'}), rule: 'Supply climbs to new highs as fresh money arrives in crypto.',
  color: RED, label: 'NOT YET', now: 'Shrinking. New capital is not flowing in yet.',
  img: `<div class="cut" style="right:60px;top:300px;width:300px;height:420px;border-radius:18px;overflow:hidden;transform:rotate(7deg);border:10px solid #fff"><img src="${A('dollars.jpg')}" style="width:100%;height:100%;object-fit:cover"></div>`, src: 'Source: DefiLlama, total stablecoin supply · 1 year to Nov 5, 2026'}));

// 6 Altcoin market cap
slides.push(sign({i: 6, n: '05', title: 'Altcoin <em>market cap</em>', what: 'Combined value of altcoins, tracked by CoinMarketCap.',
  kpi: '$' + (last(alt) / 1000).toFixed(2) + 'T', chips: ch(`90D ${sgn(pct(last(alt), at(alt, 90)), 0)}`, 'up') + ch(`VS HIGH ${sgn(pct(last(alt), altMax[1]), 0)}`, 'dn'),
  chartSvg: chart(alt, {fmt: (v) => '$' + (v / 1000).toFixed(2) + 'T', ref: {v: altMax[1], label: 'HIGH $' + (altMax[1] / 1000).toFixed(2) + 'T'}}), rule: 'Breaks above its previous high and holds there.',
  color: AMB, label: 'RECOVERING', now: 'Up since summer, still far from the high.',
  img: `<img class="cut" src="${A('rocket.png')}" style="height:400px;right:64px;top:250px;transform:rotate(6deg)">`, src: 'Source: CoinMarketCap altcoin market cap · 1 year to Nov 5, 2026'}));

// 7 crowd signs
const crowd = [['Memecoins go vertical', 'New tokens doing 10x in days, every day.'], ['Funding rates run hot', 'Traders pay up to stay long on alts.'], ['Crypto apps top the charts', 'Exchange apps climb the app stores.'], ['Search spikes', '"Altcoins" and "which coin to buy" trend.'], ['Your friends ask', 'People who never cared start asking you.']];
slides.push(page(7, `
  <div style="position:absolute;left:64px;top:170px;right:64px;z-index:2">
    <div style="font-family:'JetBrains Mono';font-weight:700;font-size:21px;letter-spacing:3px;background:${LIME};display:inline-block;padding:6px 12px;border-radius:8px;margin-bottom:22px">BONUS</div>
    <h1>The <em>crowd</em><br>signs</h1><div class="what" style="max-width:600px">Late-stage tells. When these show up, the move is often already well underway.</div>
  </div>
  <img class="cut" src="${A('megaphone.png')}" style="height:330px;right:50px;top:250px;transform:rotate(-14deg)">
  <div style="position:absolute;left:44px;right:44px;top:620px;display:flex;flex-direction:column;gap:14px">
    ${crowd.map(([t, d], j) => `<div style="background:#fff;border-radius:26px;padding:20px 30px;display:flex;align-items:center;gap:28px;box-shadow:0 1px 0 #E1E4DA,0 16px 40px rgba(11,14,17,.05)">
      <div style="font-family:'JetBrains Mono';font-weight:700;font-size:30px;width:64px;height:64px;border-radius:18px;background:${j % 2 ? INK : LIME};color:${j % 2 ? LIME : INK};display:flex;align-items:center;justify-content:center">${j + 1}</div>
      <div><div style="font-size:38px;font-weight:700;letter-spacing:-1px">${t}</div><div style="font-size:26px;color:${GRAY};margin-top:4px">${d}</div></div></div>`).join('')}
  </div>`));

// 8 scorecard
const rows = [['Bitcoin dominance', last(dom).toFixed(1) + '%', RED, 'NOT YET'], ['ETH / BTC', last(eb).toFixed(4), AMB, 'STIRRING'], ['Altcoin Season Index', last(asi) + '/100', AMB, 'NEUTRAL'], ['Stablecoin supply', '$' + last(st).toFixed(0) + 'B', RED, 'NOT YET'], ['Altcoin market cap', '$' + (last(alt) / 1000).toFixed(2) + 'T', AMB, 'RECOVERING']];
slides.push(page(8, `
  <div style="position:absolute;left:64px;top:170px;z-index:2">
    <div style="font-family:'JetBrains Mono';font-weight:700;font-size:21px;letter-spacing:3px;background:${LIME};display:inline-block;padding:6px 12px;border-radius:8px;margin-bottom:22px">SCORECARD · ${D.asof.toUpperCase()}</div>
    <h1 style="font-size:110px">Not altseason.<br><em>Yet.</em></h1>
  </div>
  <img class="cut" src="${A('redlight.png')}" style="width:200px;right:76px;top:300px;border-radius:999px;box-shadow:0 0 0 14px #1B1D1F, 0 0 0 16px #2A2D30">
  <div class="card" style="top:560px;padding:14px 40px">
    ${rows.map(([k, val, c, l], j) => `<div style="display:flex;align-items:center;padding:24px 0;${j ? 'border-top:1.5px solid #ECEEE7' : ''}">
      <div style="flex:1;font-size:34px;font-weight:700;letter-spacing:-.5px">${k}</div>
      <div style="width:220px;font-family:'JetBrains Mono';font-size:28px;text-align:right;margin-right:40px">${val}</div>
      <div style="width:240px">${status(c, l)}</div></div>`).join('')}
  </div>
  <div style="position:absolute;left:64px;right:64px;bottom:64px;display:flex;align-items:center;justify-content:space-between">
    <div><div style="font-size:40px;font-weight:700;letter-spacing:-1px">0 of 5 signs green.</div><div style="font-size:27px;color:${GRAY};margin-top:6px">Watch them live. Be early, not late.</div></div>
    <div style="font-family:'JetBrains Mono';font-weight:700;font-size:28px;background:${INK};color:${LIME};padding:22px 32px;border-radius:999px">hotcoin.com</div>
  </div>
  <div style="position:absolute;right:64px;top:128px;font-family:'JetBrains Mono';font-size:16px;color:${GRAY}"></div>`));

const browser = await chromium.launch();
const ctx = await browser.newContext({viewport: {width: W, height: H}, deviceScaleFactor: 2});
const pg = await ctx.newPage();
fs.mkdirSync(DIR + '/out', {recursive: true});
for (let i = 0; i < slides.length; i++) {
  const f = `${DIR}/out/_s${i + 1}.html`; fs.writeFileSync(f, slides[i]);
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({path: `${DIR}/out/altseason-${String(i + 1).padStart(2, '0')}.png`}); fs.unlinkSync(f);
}
await browser.close();
console.log('done', slides.length);
