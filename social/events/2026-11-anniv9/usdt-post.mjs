// Relay Round 1 rewards graphic in the PolitiFi data-post pattern: white, big number, step chart, reward table,
// halftone USDT coin as background art (official Tether logo from CoinGecko, halftoned). 1080x1350 @2x, EN + ZH.
// Run: PW_PATH=$(npm root -g)/playwright node social/events/2026-11-anniv9/usdt-post.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/events/2026-11-anniv9';
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png';
const INK = '#0B0E11', UP = '#17A86B', GRAY = '#6B7280', LINE = '#E6E8EB', LIME = '#B8F26A';
const T = {
  en: {pill: '9TH ANNIVERSARY · RELAY 01 · NOV 6 – 16', up: 'UP TO', big: '+18 USDT', h1: 'Newcomer Kickoff rewards', h2: 'for new Hotcoin users.',
    steps: [['REGISTER', '5 USDT'], ['+ KYC', '9 USDT'], ['+ FIRST TRADE', '18 USDT']], note: 'TIERS 1 AND 2 DON\'T STACK', axis: ['START', 'STEP 1', 'STEP 2', 'STEP 3'],
    cols: ['TASK', 'REWARD', 'TYPE'], rows: [['Register via the link', '5 USDT', 'Fee coupon'], ['Register + KYC', '9 USDT', 'Trial funds'], ['First futures trade ≥ 99 USDT', '+9 USDT', 'Trial funds'], ['Lucky draw · 9 winners', '99 USDT', 'Trial funds each']],
    total: ['Total pool', '19,999 USDT', 'Nov 6 – 16 · UTC+8']},
  zh: {pill: '9周年 · 接力赛第一棒 · 11/6 – 11/16', up: '最高可拿', big: '+18 USDT', h1: '新人起跑礼奖励', h2: '专属 Hotcoin 新用户',
    steps: [['注册', '5 USDT'], ['+ KYC', '9 USDT'], ['+ 首笔合约', '18 USDT']], note: '第 1、2 档不叠加', axis: ['起点', '第一步', '第二步', '第三步'],
    cols: ['任务', '奖励', '类型'], rows: [['指定链接注册', '5 USDT', '手续费抵扣券'], ['注册 + KYC', '9 USDT', '合约体验金'], ['首笔合约 ≥ 99 USDT', '+9 USDT', '合约体验金'], ['幸运抽奖 · 9 位', '99 USDT', '每人合约体验金']],
    total: ['总奖池', '19,999 USDT', '11/6 – 11/16 · UTC+8']},
};

function stepChart(t) {
  const w = 760, h = 300, vals = [0, 5, 9, 18], X = (i) => (i / 3) * w, Y = (v) => h - (v / 18) * (h - 30);
  let d = `M0,${Y(0)}`;
  for (let i = 1; i < 4; i++) d += ` L${X(i) - 70},${Y(vals[i - 1])} C${X(i) - 30},${Y(vals[i - 1])} ${X(i) - 30},${Y(vals[i])} ${X(i)},${Y(vals[i])}`;
  d += ` L${w + 90},${Y(18)}`;
  return `<svg width="${w + 220}" height="${h + 50}" style="overflow:visible">
    <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${UP}" stop-opacity=".18"/><stop offset="1" stop-color="${UP}" stop-opacity="0"/></linearGradient></defs>
    ${[0, .25, .5, .75, 1].map((f) => `<line x1="0" x2="${w + 90}" y1="${h * f}" y2="${h * f}" stroke="${LINE}" stroke-width="1.5"/>`).join('')}
    <line x1="0" x2="${w + 90}" y1="${h}" y2="${h}" stroke="${INK}" stroke-width="2"/>
    <path d="${d} L${w + 90},${h} L0,${h}Z" fill="url(#ga)"/>
    <path d="${d}" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    ${t.steps.map(([a, v], k) => { const i = k + 1, last = k === 2; return `
      <circle cx="${X(i)}" cy="${Y(vals[i])}" r="${last ? 13 : 10}" fill="${last ? LIME : '#fff'}" stroke="${INK}" stroke-width="4"/>
      <text x="${X(i) - (last ? 0 : 14)}" y="${Y(vals[i]) - 52}" text-anchor="${last ? 'middle' : 'end'}" font-family="JetBrains Mono, Noto Sans SC" font-size="19" fill="${GRAY}" letter-spacing="1.5">${a}</text>
      <text x="${X(i) - (last ? 0 : 14)}" y="${Y(vals[i]) - 22}" text-anchor="${last ? 'middle' : 'end'}" font-family="JetBrains Mono" font-weight="700" font-size="27" fill="${last ? UP : INK}">${v}</text>`; }).join('')}
    ${t.axis.map((a, i) => `<text x="${X(i)}" y="${h + 38}" text-anchor="${i === 0 ? 'start' : 'middle'}" font-family="JetBrains Mono, Noto Sans SC" font-size="18" fill="${GRAY}">${a}</text>`).join('')}
    <text x="${X(1) + 20}" y="${h - 16}" font-family="JetBrains Mono, Noto Sans SC" font-size="16" fill="${GRAY}">↳ ${t.note}</text>
  </svg>`;
}

const page = (t, zh) => `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+SC:wght@500;700;900&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:#fff;color:${INK};font-family:'Inter Tight','Noto Sans SC',sans-serif;overflow:hidden;position:relative}
.m{font-family:'JetBrains Mono','Noto Sans SC',monospace}
</style></head><body>
<img src="file://${DIR}/assets/usdt-halftone.png" style="position:absolute;right:-170px;top:250px;width:820px;opacity:.12">
<div style="position:absolute;left:72px;right:72px;top:72px;display:flex;justify-content:space-between;align-items:center">
  <img src="${LOGO}" style="height:44px">
  <div class="m" style="font-size:19px;letter-spacing:2px;border:1.5px solid ${INK};border-radius:999px;padding:10px 20px;background:#fff">${t.pill}</div>
</div>
<div style="position:absolute;left:72px;top:190px">
  <div class="m" style="font-size:22px;letter-spacing:3px;color:${GRAY}">${t.up}</div>
  <div style="font-weight:800;font-size:182px;letter-spacing:-8px;line-height:.95;color:${UP};margin-top:6px">${t.big}</div>
  <div style="font-weight:${zh ? 900 : 700};font-size:${zh ? 54 : 52}px;letter-spacing:${zh ? 2 : -1.5}px;line-height:1.08;margin-top:22px">${t.h1}<br><span style="color:${GRAY}">${t.h2}</span></div>
</div>
<div style="position:absolute;left:72px;top:590px">${stepChart(t)}</div>
<div style="position:absolute;left:72px;right:72px;top:972px">
  <div class="m" style="display:flex;font-size:17px;letter-spacing:2.5px;color:${GRAY};padding-bottom:12px"><div style="flex:1">${t.cols[0]}</div><div style="width:200px;text-align:right">${t.cols[1]}</div><div style="width:230px;text-align:right">${t.cols[2]}</div></div>
  ${t.rows.map(([a, v, u]) => `<div style="display:flex;align-items:center;padding:10px 0;border-top:1.5px solid ${LINE}">
    <div style="flex:1;font-weight:700;font-size:26px;letter-spacing:-.3px">${a}</div>
    <div class="m" style="width:200px;text-align:right;font-weight:700;font-size:24px">${v}</div>
    <div style="width:230px;text-align:right;font-size:21px;color:${GRAY}">${u}</div></div>`).join('')}
  <div style="display:flex;align-items:center;padding:14px 0 0;border-top:2px solid ${INK}">
    <div style="flex:1;font-weight:800;font-size:30px">${t.total[0]}</div>
    <div class="m" style="width:260px;text-align:right;font-weight:700;font-size:28px;color:${UP}">${t.total[1]}</div>
    <div style="width:230px;text-align:right;font-size:20px;color:${GRAY}">${t.total[2]}</div></div>
</div>
</body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
const pg = await ctx.newPage();
for (const [n, t, zh] of [['relay1-rewards-en', T.en, false], ['relay1-rewards-zh', T.zh, true]]) {
  const f = `${DIR}/_${n}.html`; fs.writeFileSync(f, page(t, zh));
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({path: `${DIR}/${n}.png`}); fs.unlinkSync(f);
}
await browser.close(); console.log('done');
