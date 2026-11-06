// Hotcoin 9th Anniversary Relay · Round 1 (Newcomer Kickoff) key visuals, EN + ZH.
// Brand-flood system with a giant "9" drawn as a running track (relay theme). Facts from the event brief (Nov 6-16, 2026, UTC+8):
// register 5 USDT fee coupon | register+KYC 9 USDT trial funds (tiers 1-2 not stackable) | first single futures trade >= 99 USDT +9 USDT
// | max 18 USDT | lucky draw 9 x 99 USDT for link sign-ups | pools 19,108 + 891 = 19,999 USDT.
// Outputs: kv-{en,zh}.png (1080x1080), steps-{en,zh}.png (1080x1350), rendered at 2x.
// Run: PW_PATH=$(npm root -g)/playwright node social/events/2026-11-anniv9/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/events/2026-11-anniv9';
const BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const INK = '#0B0E11', LIME = '#B8F26A';

const T = {
  en: {
    lang: 'en', kicker: '9TH ANNIVERSARY RELAY · ROUND 1', head: ['NEWCOMER', 'KICKOFF'], upto: 'UP TO', reward: '18', unit: 'USDT',
    pool: '19,999 USDT prize pool', dates: 'NOV 6 – NOV 16 · 23:59 (UTC+8)', cta: 'JOIN NOW', tag: '#HOTCOINTURNS9', years: '9 YEARS',
    track: 'HOTCOIN TURNS 9 · RELAY ROUND 1 · NEWCOMER KICKOFF · ',
    stepsTitle: ['3 steps,', 'up to 18 USDT.'], steps: [
      ['Register via the link', '5 USDT', 'Futures fee coupon'],
      ['Register + complete KYC', '9 USDT', 'Futures trial funds'],
      ['First futures trade ≥ 99 USDT', '+9 USDT', 'Futures trial funds'],
    ], nostack: 'Steps 1 and 2 don\'t stack: you get the higher one.',
    max: 'KYC + first trade = 18 USDT', lucky: ['LUCKY BONUS', '9 × 99 USDT', 'Every sign-up via the link enters the draw. 9 winners after the event.'],
    link: 'hotcoin.com/r/Hccommunity',
    fine: 'New users only, one UID per person. First-trade task counts real funds only. Rewards are sent after the event and review. Futures trading is high risk and may lead to loss of your margin. Hotcoin reserves the right of final interpretation.',
  },
  zh: {
    lang: 'zh', kicker: '9周年狂欢接力赛 · 第一棒', head: ['新人', '起跑礼'], upto: '最高可拿', reward: '18', unit: 'USDT',
    pool: '19,999 USDT 福利池', dates: '11/6 — 11/16 23:59（UTC+8）', cta: '立即参与', tag: '#HOTCOIN9周年', years: '9 周年',
    track: 'HOTCOIN 9周年 · 接力赛第一棒 · 新人起跑礼 · ',
    stepsTitle: ['新人起跑三步走', '最高拿 18 USDT'], steps: [
      ['指定链接注册', '5 USDT', '合约手续费抵扣券'],
      ['注册 + 完成 KYC', '9 USDT', '合约体验金'],
      ['首次单笔合约交易 ≥ 99 USDT', '+9 USDT', '合约体验金'],
    ], nostack: '第 1、2 档不叠加，按最高档发放',
    max: 'KYC + 首单 = 最高 18 USDT', lucky: ['9周年幸运加码', '9 × 99 USDT', '通过指定链接注册即自动参与抽奖，活动结束后抽取 9 位幸运用户'],
    link: 'hotcoinv5.com/r/Hccommunity',
    fine: '仅限活动期间通过指定链接注册的新用户，每人限一个 UID。首单任务仅统计真实资金交易。奖励于活动结束并审核后统一发放。合约交易风险较高，可能损失全部保证金。Hotcoin 保留本活动最终解释权。',
  },
};

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100,600;100,700;125,800;125,900&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+SC:wght@500;700;900&display=block');`;
const base = (w, h, bg) => `${fonts}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${w}px;height:${h}px;background:${bg};overflow:hidden;position:relative;font-family:'Archivo','Noto Sans SC',sans-serif;color:${INK}}
.wide{font-stretch:125%;font-weight:900;letter-spacing:-1px}
.mono{font-family:'JetBrains Mono','Noto Sans SC',monospace}
.zh .wide{font-family:'Noto Sans SC';font-stretch:normal;letter-spacing:2px}
`;

// giant 9 as a running track: ink band, two lime lane lines, event name running along the middle lane
function track9({cx, cy, R, band, text, idp}) {
  const d = `M ${cx - 0.75 * R} ${cy + 2.35 * R} C ${cx + 0.55 * R} ${cy + 2.35 * R} ${cx + R} ${cy + 1.5 * R} ${cx + R} ${cy + 0.4 * R} L ${cx + R} ${cy} A ${R} ${R} 0 1 1 ${cx - R} ${cy} A ${R} ${R} 0 1 1 ${cx + R} ${cy}`;
  const lane = band / 3;
  return `<svg width="100%" height="100%" style="position:absolute;inset:0;overflow:visible">
    <defs><path id="${idp}" d="${d}"/><path id="${idp}c" d="M ${cx + R} ${cy} A ${R} ${R} 0 1 1 ${cx - R} ${cy} A ${R} ${R} 0 1 1 ${cx + R} ${cy}"/></defs>
    <use href="#${idp}" fill="none" stroke="${INK}" stroke-width="${band}" stroke-linecap="butt"/>
    <use href="#${idp}" fill="none" stroke="${LIME}" stroke-width="${lane + 3}" stroke-opacity="1"/>
    <use href="#${idp}" fill="none" stroke="${INK}" stroke-width="${lane - 3}"/>
    <use href="#${idp}" fill="none" stroke="rgba(184,242,106,.35)" stroke-width="2" stroke-dasharray="2 18" transform="translate(0,0)"/>
    <text font-family="Archivo" font-stretch="125%" font-weight="900" font-size="${lane * 0.5}" fill="${LIME}" letter-spacing="3" dy="${lane * 0.18}">
      <textPath href="#${idp}c" startOffset="0" textLength="${2 * Math.PI * R - 6}" lengthAdjust="spacing">${text.repeat(/[\u4e00-\u9fff]/.test(text) ? 2 : 1)}</textPath></text>
    <rect x="${cx - 0.75 * R + 4}" y="${cy + 2.35 * R - band / 2}" width="10" height="${band}" fill="#fff"/>
  </svg>`;
}

const header = (t, dark) => `<div style="position:absolute;left:64px;top:60px;display:flex;align-items:center;gap:26px;z-index:5">
  <img src="${BR}logo-official-${dark ? 'white' : 'black'}.png" style="height:42px">
  <div style="width:2px;height:40px;background:${dark ? 'rgba(255,255,255,.4)' : INK}"></div>
  <div class="mono" style="font-weight:700;font-size:24px;letter-spacing:3px;color:${dark ? LIME : INK}">${t.years}</div></div>`;

function kv(t) {
  const zh = t.lang === 'zh';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${base(1600, 900, LIME)}</style></head><body class="${t.lang}">
  ${track9({cx: 1250, cy: 330, R: 222, band: 166, text: t.track, idp: 'p9'})}
  <div style="position:absolute;left:${1250 - 140}px;top:${330 - 140}px;width:280px;height:280px;border-radius:999px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:4;transform:rotate(-8deg)">
    <div class="mono" style="font-weight:700;font-size:${zh ? 22 : 19}px;letter-spacing:2px;background:${INK};color:${LIME};padding:6px 12px;border-radius:8px">${t.lucky[0]}</div>
    <div style="font-family:'Archivo';font-stretch:125%;font-weight:900;font-size:76px;letter-spacing:-3px;line-height:1;margin-top:10px">9×99</div>
    <div style="font-family:'Archivo';font-stretch:125%;font-weight:900;font-size:30px;letter-spacing:1px">USDT</div>
    <div style="font-family:${zh ? "'Noto Sans SC'" : "'Archivo'"};font-weight:700;font-size:${zh ? 19 : 17}px;margin-top:6px;text-align:center;line-height:1.2">${zh ? '注册即可抽奖' : 'Just register to enter'}</div>
  </div>
  ${header(t, false)}
  <div style="position:absolute;left:80px;top:170px;z-index:4">
    <div class="mono" style="display:inline-block;font-weight:700;font-size:21px;letter-spacing:2px;background:${INK};color:${LIME};padding:9px 16px;border-radius:10px">${t.kicker}</div>
    <div class="wide" style="font-size:${zh ? 92 : 84}px;line-height:${zh ? 1.05 : 0.92};margin-top:22px">${t.head[0]}<br>${t.head[1]}</div>
    <div style="margin-top:${zh ? 26 : 34}px;display:flex;align-items:flex-end;gap:16px">
      <div class="${zh ? '' : 'wide'}" style="font-family:${zh ? "'Noto Sans SC'" : 'inherit'};font-weight:900;font-size:${zh ? 40 : 34}px;line-height:1.1;margin-bottom:22px">${zh ? t.upto : t.upto.replace(' ', '<br>')}</div>
      <div class="wide" style="font-family:'Archivo';font-stretch:125%;font-size:170px;line-height:.82;letter-spacing:-6px">${t.reward}</div>
      <div class="wide" style="font-family:'Archivo';font-stretch:125%;font-size:46px;margin-bottom:12px">${t.unit}</div>
    </div>
    <div style="font-weight:700;font-size:30px;margin-top:22px;font-family:${zh ? "'Noto Sans SC'" : "'Archivo'"}">${t.pool}</div>
    <div class="mono" style="display:inline-block;font-weight:700;font-size:22px;letter-spacing:1.5px;margin-top:16px;border-top:3px solid ${INK};padding-top:12px">⏱ ${t.dates}</div>
  </div>
  <div style="position:absolute;left:80px;bottom:60px;display:flex;align-items:center;gap:18px;z-index:4">
    <div class="wide" style="font-size:${zh ? 34 : 30}px;background:${INK};color:${LIME};padding:22px 44px;border-radius:999px;font-family:${zh ? "'Noto Sans SC'" : "'Archivo'"}">${t.cta}</div>
    <div class="wide" style="font-size:${zh ? 26 : 24}px;border:3px solid ${INK};padding:19px 30px;border-radius:999px;font-family:'Archivo','Noto Sans SC'">${t.tag}</div>
  </div>
  </body></html>`;
}

function steps(t) {
  const zh = t.lang === 'zh';
  const sans = zh ? "'Noto Sans SC'" : "'Archivo'";
  return `<!doctype html><html><head><meta charset="utf-8"><style>${base(1080, 1350, INK)}
  .lane{position:relative;height:176px;border-top:3px solid rgba(184,242,106,.5);display:flex;align-items:center;padding:0 40px 0 0}
  </style></head><body class="${t.lang}" style="color:#fff">
  <div style="position:absolute;right:-140px;top:-120px;width:620px;height:620px;border-radius:999px;border:120px solid rgba(184,242,106,.09)"></div>
  ${header(t, true)}
  <div style="position:absolute;left:64px;top:170px">
    <div class="mono" style="display:inline-block;font-weight:700;font-size:21px;letter-spacing:2px;background:${LIME};color:${INK};padding:9px 16px;border-radius:10px">${t.kicker}</div>
    <div class="wide" style="font-size:${zh ? 84 : 76}px;line-height:1;margin-top:24px;color:#fff">${t.stepsTitle[0]}<br><span style="color:${LIME}">${t.stepsTitle[1]}</span></div>
  </div>
  <div style="position:absolute;left:64px;right:64px;top:430px">
    ${t.steps.map(([a, v, u], k) => `<div class="lane">
      <div class="wide" style="font-family:'Archivo';font-stretch:125%;font-size:130px;color:${LIME};width:170px;line-height:1;opacity:.95">${k + 1}</div>
      <div style="flex:1">
        <div style="font-family:${sans};font-weight:700;font-size:${zh ? 34 : 32}px;line-height:1.2">${a}</div>
        <div style="font-family:${sans};font-weight:500;font-size:${zh ? 24 : 23}px;color:rgba(255,255,255,.6);margin-top:6px">${u}</div>
      </div>
      <div class="wide" style="font-family:'Archivo';font-stretch:125%;font-size:56px;color:${k === 2 ? LIME : '#fff'};white-space:nowrap">${v}</div>
    </div>`).join('')}
    <div style="border-top:3px solid rgba(184,242,106,.5)"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;gap:20px">
      <div style="font-family:${sans};font-size:${zh ? 23 : 22}px;color:rgba(255,255,255,.6)">⚠ ${t.nostack}</div>
      <div style="font-family:${sans};font-weight:800;font-size:${zh ? 26 : 24}px;background:${LIME};color:${INK};padding:10px 18px;border-radius:10px;white-space:nowrap">🔥 ${t.max}</div>
    </div>
  </div>
  <div style="position:absolute;left:64px;right:64px;top:1062px;height:150px;border-radius:28px;background:${LIME};color:${INK};display:flex;align-items:center;padding:0 36px;gap:30px">
    <div>
      <div class="mono" style="font-weight:700;font-size:20px;letter-spacing:2.5px">${t.lucky[0]}</div>
      <div class="wide" style="font-family:'Archivo';font-stretch:125%;font-size:58px;line-height:1;margin-top:6px;white-space:nowrap">${t.lucky[1]}</div>
    </div>
    <div style="font-family:${sans};font-weight:600;font-size:${zh ? 23 : 22}px;line-height:1.35">${t.lucky[2]}</div>
  </div>
  <div style="position:absolute;left:64px;right:64px;bottom:40px;display:flex;justify-content:space-between;align-items:flex-end;gap:30px">
    <div style="font-family:${sans};font-size:${zh ? 15 : 14}px;line-height:1.45;color:rgba(255,255,255,.45);max-width:600px">${t.fine}</div>
    <div style="text-align:right">
      <div class="mono" style="font-weight:700;font-size:21px;color:${LIME}">${t.dates}</div>
      <div class="mono" style="font-weight:500;font-size:19px;color:#fff;margin-top:6px">${t.link}</div>
    </div>
  </div>
  </body></html>`;
}

const browser = await chromium.launch();
for (const [name, html, w, h] of [['kv-en', kv(T.en), 1600, 900], ['kv-zh', kv(T.zh), 1600, 900], ['steps-en', steps(T.en), 1080, 1350], ['steps-zh', steps(T.zh), 1080, 1350]]) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, deviceScaleFactor: 2});
  const pg = await ctx.newPage();
  const f = `${DIR}/_${name}.html`; fs.writeFileSync(f, html);
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({path: `${DIR}/${name}.png`}); fs.unlinkSync(f); await ctx.close();
}
await browser.close();
console.log('done');
