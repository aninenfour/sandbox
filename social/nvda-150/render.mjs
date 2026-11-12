// NVDA dips below $150: white data post, 1080x1350 @2x (also renders a Chinese version).
// Data: Yahoo Finance daily chart for NVDA (query1.finance.yahoo.com/v8/finance/chart/NVDA), pulled Nov 12, 2026 ~10:30 ET.
//   Intraday low Nov 12, 2026: $148.80 (open $150.99, prior close $173.73 -> gap -13.1%).
//   Record high: $243.37 intraday on Oct 6, 2026 -> peak to low -38.9% in 37 days.
//   Last time the low was at or under $148.80: Jun 24, 2025 (low $145.50).
// Why: CEO resignation announced Nov 12; shares down 12% at the open (NBC News, CNBC, Nov 12, 2026). Kept neutral, no people shown.
// Hotcoin lists NVDAB/USDT (api.hotcoinfin.com ticker, low 149.26 on Nov 12). No Nvidia logo used (text only).
// Run: PW_PATH=$(npm root -g)/playwright node social/nvda-150/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/nvda-150';
const BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const FONTS = 'file:///home/user/sandbox/hotcoin-tradfi/public/fonts/';
const INK = '#0B0E11', RED = '#E5484D', GRAY = '#6B7280', LINE = '#E6E8EB';
const D = JSON.parse(fs.readFileSync(DIR + '/nvda-daily.json', 'utf8'));   // [date, close, low]
const PEAK = {date: '2026-10-06', v: 243.37}, LOW = {date: '2026-11-12', v: 148.80}, SAME = '2025-06-24';

const T = {
  en: {pill: 'NVDA · NOV 12, 2026', kick: 'NVIDIA (NVDA) · INTRADAY LOW', h1: 'Nvidia dipped below $150.', h2: 'Same price as June 2025.',
    erased: '15 months of gains', erased2: 'erased in 37 days', peak: 'Record $243.37', peakd: 'Oct 6', low: '$148.80', lowd: 'Nov 12',
    same: 'Jun 24, 2025', cards: [['PEAK TO LOW', '-38.9%'], ['GAP AT THE OPEN', '-13.1%'], ['LAST SEEN', 'Jun 2025']],
    months: ['JAN 25', 'APR', 'JUL', 'OCT', 'JAN 26', 'APR', 'JUL', 'OCT'], ls: -1.5},
  zh: {pill: 'NVDA · 2026.11.12', kick: '英伟达 (NVDA) · 盘中低点', h1: '英伟达跌破 $150', h2: '回到 2025 年 6 月的价格',
    erased: '15 个月的涨幅', erased2: '37 天内抹平', peak: '历史高点 $243.37', peakd: '10月6日', low: '$148.80', lowd: '11月12日',
    same: '2025年6月24日', cards: [['高点至低点', '-38.9%'], ['开盘跳空', '-13.1%'], ['上次见到此价', '2025年6月']],
    months: ['25年1月', '4月', '7月', '10月', '26年1月', '4月', '7月', '10月'], ls: 0},
};

function chart(t) {
  const w = 936, h = 430, lo = 80, hi = 260;
  const X = (i) => (i / (D.length - 1)) * (w - 40), Y = (v) => h - ((v - lo) / (hi - lo)) * h;
  const idx = (d) => D.findIndex((r) => r[0] === d);
  const pts = D.map((r, i) => [X(i), Y(r[1])]);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
  const si = idx(SAME), pi = idx(PEAK.date), li = D.length - 1, yL = Y(LOW.v);
  // "erased" area: price above the $148.80 line, from Jun 24 2025 to today
  const area = `M${X(si)},${yL} ` + pts.slice(si).map((p) => `L${p[0].toFixed(1)},${Math.min(p[1], yL).toFixed(1)}`).join('') + ` L${X(li)},${yL}Z`;
  const mIdx = (m) => D.findIndex((r) => r[0] >= m);
  const ticks = ['2025-01', '2025-04', '2025-07', '2025-10', '2026-01', '2026-04', '2026-07', '2026-10'].map((m, k) => [X(mIdx(m)), t.months[k]]);
  return `<svg width="${w}" height="${h + 50}" style="overflow:visible">
    <defs><linearGradient id="er" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${RED}" stop-opacity=".22"/><stop offset="1" stop-color="${RED}" stop-opacity=".05"/></linearGradient></defs>
    ${[100, 150, 200, 250].map((v) => `<line x1="0" x2="${w - 40}" y1="${Y(v)}" y2="${Y(v)}" stroke="${LINE}" stroke-width="1.5"/><text x="0" y="${Y(v) - 8}" font-family="JetBrains Mono" font-size="17" fill="${GRAY}">$${v}</text>`).join('')}
    <path d="${area}" fill="url(#er)"/>
    <line x1="${X(si)}" x2="${X(li)}" y1="${yL}" y2="${yL}" stroke="${RED}" stroke-width="2.5" stroke-dasharray="9 7"/>
    <path d="${path}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <line x1="${X(pi)}" x2="${X(pi)}" y1="${Y(D[pi][1])}" y2="${Y(PEAK.v)}" stroke="${INK}" stroke-width="3"/>
    <line x1="${X(li)}" x2="${X(li)}" y1="${Y(D[li][1])}" y2="${yL}" stroke="${RED}" stroke-width="3"/>
    <circle cx="${X(si)}" cy="${yL}" r="10" fill="#fff" stroke="${RED}" stroke-width="4"/>
    <text x="${X(si) + 18}" y="${yL + 34}" font-family="JetBrains Mono, Noto Sans SC" font-weight="700" font-size="20" fill="${RED}">${t.same}</text>
    <circle cx="${X(pi)}" cy="${Y(PEAK.v)}" r="9" fill="#fff" stroke="${INK}" stroke-width="4"/>
    <text x="${X(pi) - 18}" y="${Y(PEAK.v) - 4}" text-anchor="end" font-family="Inter Tight, Noto Sans SC" font-weight="800" font-size="24" fill="${INK}">${t.peak}</text>
    <text x="${X(pi) - 18}" y="${Y(PEAK.v) + 22}" text-anchor="end" font-family="JetBrains Mono, Noto Sans SC" font-size="18" fill="${GRAY}">${t.peakd}</text>
    <circle cx="${X(li)}" cy="${yL}" r="11" fill="${RED}" stroke="#fff" stroke-width="4"/>
    <text x="${X(li) + 4}" y="${yL + 46}" text-anchor="end" font-family="Inter Tight" font-weight="800" font-size="26" fill="${RED}">${t.low}</text>
    <line x1="${X(si) + 150}" x2="${X(si) + 150}" y1="${Y(232) + 30}" y2="${Y(186)}" stroke="${RED}" stroke-width="1.5"/><circle cx="${X(si) + 150}" cy="${Y(186)}" r="4" fill="${RED}"/>
    <text x="${X(si) + 30}" y="${Y(240)}" font-family="Inter Tight, Noto Sans SC" font-weight="800" font-size="30" fill="${RED}">${t.erased}</text>
    <text x="${X(si) + 30}" y="${Y(240) + 34}" font-family="Inter Tight, Noto Sans SC" font-weight="600" font-size="26" fill="${RED}">${t.erased2}</text>
    ${ticks.map(([x, l]) => `<text x="${x}" y="${h + 42}" font-family="JetBrains Mono, Noto Sans SC" font-size="17" fill="${GRAY}">${l}</text>`).join('')}
  </svg>`;
}

// faint chip schematic (original line drawing, not a logo) behind the headline number
const chip = (() => {
  const s = 380, pins = Array.from({length: 9}, (_, i) => 40 + i * 37.5);
  return `<svg width="${s + 80}" height="${s + 80}" viewBox="-40 -40 ${s + 80} ${s + 80}" style="position:absolute;right:-90px;top:150px;opacity:.05">
    <rect x="0" y="0" width="${s}" height="${s}" rx="28" fill="none" stroke="${INK}" stroke-width="6"/>
    <rect x="80" y="80" width="${s - 160}" height="${s - 160}" rx="14" fill="none" stroke="${INK}" stroke-width="5"/>
    ${pins.map((p) => `<line x1="${p}" x2="${p}" y1="-36" y2="0" stroke="${INK}" stroke-width="8"/><line x1="${p}" x2="${p}" y1="${s}" y2="${s + 36}" stroke="${INK}" stroke-width="8"/><line y1="${p}" y2="${p}" x1="-36" x2="0" stroke="${INK}" stroke-width="8"/><line y1="${p}" y2="${p}" x1="${s}" x2="${s + 36}" stroke="${INK}" stroke-width="8"/>`).join('')}
  </svg>`;
})();

const page = (lang) => {
  const t = T[lang];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block');
  @font-face{font-family:'Noto Sans SC';font-weight:700;src:url(${FONTS}NotoSansSC-700.ttf)}
  @font-face{font-family:'Noto Sans SC';font-weight:800 900;src:url(${FONTS}NotoSansSC-900.ttf)}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1350px;background:#fff;color:${INK};font-family:'Inter Tight','Noto Sans SC',sans-serif;overflow:hidden;position:relative}
  .m{font-family:'JetBrains Mono','Noto Sans SC',monospace}</style></head><body>
  <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(11,14,17,.06) 1px,transparent 1.3px);background-size:6px 6px;opacity:.6"></div>
  ${chip}
  <div style="position:absolute;left:72px;right:72px;top:68px;display:flex;justify-content:space-between;align-items:center">
    <img src="${BR}logo-official-black.png" style="height:42px"><div class="m" style="font-size:18px;letter-spacing:2px;border:1.5px solid ${INK};border-radius:99px;padding:9px 18px">${t.pill}</div></div>
  <div style="position:absolute;left:72px;top:176px">
    <div class="m" style="font-size:20px;letter-spacing:3px;color:${GRAY}">${t.kick}</div>
    <div style="font-weight:800;font-size:190px;letter-spacing:-9px;line-height:.95;color:${RED};margin-top:6px">$148.80</div>
    <div style="font-weight:700;font-size:50px;letter-spacing:${t.ls}px;line-height:1.12;margin-top:18px">${t.h1}<br><span style="color:${GRAY}">${t.h2}</span></div>
  </div>
  <div style="position:absolute;left:72px;top:600px">${chart(t)}</div>
  <div style="position:absolute;left:72px;right:72px;bottom:72px;display:flex;gap:18px">${t.cards.map(([k, v], i) => `<div style="flex:1;border:1.5px solid ${LINE};border-radius:20px;padding:20px 24px;background:#fff">
    <div class="m" style="font-size:15px;letter-spacing:2px;color:${GRAY}">${k}</div><div style="font-weight:800;font-size:44px;letter-spacing:-1px;margin-top:6px;color:${i < 2 ? RED : INK}">${v}</div></div>`).join('')}</div>
  </body></html>`;
};

const browser = await chromium.launch();
const pg = await (await browser.newContext({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 3})).newPage();
fs.mkdirSync(DIR + '/out', {recursive: true});
for (const lang of ['en', 'zh']) {
  const f = `${DIR}/_${lang}.html`; fs.writeFileSync(f, page(lang));
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({path: `${DIR}/out/nvda-150-${lang}.png`}); fs.unlinkSync(f);
}
await browser.close(); console.log('done');
