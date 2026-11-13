// Hotcoin November update: feed carousel, 10 slides, 1080x1350 @2x, white data style (Inter Tight / JetBrains Mono, ink + lime).
// Content from the November release notes (11月版本业务同步说明) and the product team's release carousel draft (Nov 13, 2026).
//   9th Anniversary MRD: public total prize pool 6,000,000 USDT; Champions pool unlocks with all entrants' volume, steps
//   20K / 50K / 80K / 100K / 500K / 1M / 2M / 4M USDT; early bird 19 USDT (new users) / 9 USDT (existing), 20,000 USDT pool,
//   first come first served; main race Nov 16 to Dec 14, 2026 16:00 UTC+8 (dates marked TBC in the MRD); 1 main + 4 side arenas.
//   Career Review: unlocked after signing up; days with Hotcoin, trades, volume, PnL, rewards; 6-skill score and a title; poster.
//   TradFi phase 2: company profile / financials / performance on pair page, favorites, link to stock page, cash dividend events
//   on the trade page, dividend records in asset history.
//   Martingale bot defaults (draft): add every 0.5% drop, 1% take profit, 5x. NowPay CNY: 2.3% deposit fee (deducted from the
//   amount), 0.7% withdrawal fee, KYC required. Proof of Reserves ratios: Oct 29, 2026 snapshot (BTC 105%, ETH 109%, USDT 113%).
// Run: PW_PATH=$(npm root -g)/playwright node social/nov-update/render.mjs [en,zh]   (Chinese set adds halftone background art)
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/nov-update';
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png';
const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A', UP = '#17A86B', RED = '#E5484D', GRAY = '#6B7280', BODY = '#3F454D', LINE = '#E6E8EB', SOFT = '#F4F5F2';
const N = 10;

const FONTS = 'file:///home/user/sandbox/hotcoin-tradfi/public/fonts/';
let LANG = 'en';
const t = (en, zh) => (LANG === 'zh' ? zh : en);
const css = `@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block');
@font-face{font-family:'Noto Sans SC';font-weight:700;src:url(${FONTS}NotoSansSC-700.ttf)}
@font-face{font-family:'Noto Sans SC';font-weight:800 900;src:url(${FONTS}NotoSansSC-900.ttf)}
body.zh h1{letter-spacing:0;line-height:1.12;font-size:70px}
.art{position:absolute;right:56px;top:150px;width:300px;height:300px;background-image:radial-gradient(${'#3E7A22'} 2.6px,transparent 3px);background-size:9px 9px;opacity:.38;-webkit-mask-size:contain;-webkit-mask-repeat:no-repeat;-webkit-mask-position:center}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:#fff;color:${INK};font-family:'Inter Tight','Noto Sans SC',sans-serif;overflow:hidden;position:relative}
.m{font-family:'JetBrains Mono','Noto Sans SC',monospace}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(11,14,17,.06) 1px,transparent 1.3px);background-size:6px 6px;opacity:.55}
.tag{display:inline-flex;align-items:center;gap:10px;background:${INK};color:${LIME};font-family:'JetBrains Mono';font-weight:700;font-size:18px;letter-spacing:2.5px;padding:10px 18px;border-radius:99px}
h1{font-weight:700;font-size:84px;letter-spacing:-3.2px;line-height:1.0}
h1 span{color:${GRAY}}
.vis{position:absolute;left:72px;right:72px;border-radius:32px}
.bl{position:absolute;left:72px;right:72px;bottom:80px;display:flex;flex-direction:column;gap:20px}
.b{display:flex;gap:18px;align-items:flex-start;font-size:30px;line-height:1.3;color:${BODY};font-weight:500}
.b i{flex:none;width:34px;height:34px;border-radius:50%;background:${LIME};margin-top:2px;display:flex;align-items:center;justify-content:center}
.b b{color:${INK};font-weight:700}`;
const tick = `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M3.5 9.5l3.5 3.5 7.5-8" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const bullets = (arr) => `<div class="bl">${arr.map((x) => `<div class="b"><i>${tick}</i><div>${x}</div></div>`).join('')}</div>`;
const head = (i) => `<div style="position:absolute;left:72px;right:72px;top:68px;display:flex;justify-content:space-between;align-items:center">
  <img src="${LOGO}" style="height:42px"><div class="m" style="font-size:18px;letter-spacing:2px;border:1.5px solid ${INK};border-radius:99px;padding:9px 18px">${t('NOVEMBER UPDATE', '11月更新')} · ${String(i).padStart(2, '0')}/${N}</div></div>`;
const title = (tag, h, top = 180) => `<div style="position:absolute;left:72px;right:72px;top:${top}px"><div class="tag">${tag}</div><h1 style="margin-top:26px">${h}</h1></div>`;
// halftone background art (Chinese set): a filled silhouette used as a mask over a dot screen
const ART = {   // [shapes, cut-outs]: cut-outs are punched through the shape so the halftone shows the detail
  cover: ['<rect x="8" y="20" width="84" height="74" rx="10"/><rect x="24" y="6" width="9" height="24" rx="4"/><rect x="67" y="6" width="9" height="24" rx="4"/>', '<rect x="8" y="34" width="84" height="5"/><text x="50" y="84" text-anchor="middle" font-family="Arial" font-weight="900" font-size="40">11</text>'],
  trophy: ['<path d="M27 6h46v24c0 15-10 26-23 28-13-2-23-13-23-28z"/><path d="M27 12H11c0 17 8 25 19 26M73 12h16c0 17-8 25-19 26" fill="none" stroke="#000" stroke-width="7"/><rect x="45" y="56" width="10" height="16"/><rect x="29" y="70" width="42" height="10" rx="3"/><circle cx="12" cy="86" r="11"/><circle cx="88" cy="84" r="12"/>', '<path d="M50 16l4 8 9 1-6.5 6 1.5 9-8-4.5-8 4.5 1.5-9-6.5-6 9-1z"/><text x="12" y="91" text-anchor="middle" font-family="Arial" font-weight="900" font-size="14">$</text><text x="88" y="89" text-anchor="middle" font-family="Arial" font-weight="900" font-size="15">$</text>'],
  podium: ['<rect x="35" y="36" width="30" height="60" rx="3"/><rect x="3" y="54" width="30" height="42" rx="3"/><rect x="67" y="64" width="30" height="32" rx="3"/><path d="M50 4l5 10 11 1.5-8 7.5 2 11-10-5.5-10 5.5 2-11-8-7.5 11-1.5z"/>', '<text x="50" y="66" text-anchor="middle" font-family="Arial" font-weight="900" font-size="22">1</text><text x="18" y="80" text-anchor="middle" font-family="Arial" font-weight="900" font-size="18">2</text><text x="82" y="86" text-anchor="middle" font-family="Arial" font-weight="900" font-size="16">3</text>'],
  dividend: ['<rect x="2" y="10" width="64" height="40" rx="6"/><path d="M34 52v16M26 60l8 9 8-9" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/><rect x="40" y="72" width="56" height="26" rx="6"/><circle cx="16" cy="84" r="13"/>', '<text x="34" y="40" text-anchor="middle" font-family="Arial" font-weight="900" font-size="28">$</text><circle cx="86" cy="85" r="4"/><text x="16" y="90" text-anchor="middle" font-family="Arial" font-weight="900" font-size="15">$</text>'],
  robot: ['<rect x="16" y="24" width="68" height="56" rx="14"/><rect x="47" y="8" width="6" height="16"/><circle cx="50" cy="8" r="6"/><rect x="4" y="42" width="10" height="22" rx="4"/><rect x="86" y="42" width="10" height="22" rx="4"/><rect x="32" y="84" width="36" height="12" rx="4"/>', '<circle cx="36" cy="47" r="8"/><circle cx="64" cy="47" r="8"/><rect x="36" y="63" width="28" height="6" rx="3"/>'],
  ticket: ['<path d="M4 22h92v18a10 10 0 0 0 0 20v18H4V60a10 10 0 0 0 0-20z"/>', '<text x="50" y="66" text-anchor="middle" font-family="Arial" font-weight="900" font-size="34">%</text><path d="M28 26v6M28 40v6M28 54v6M28 68v6" stroke="#000" stroke-width="3"/>'],
  yuan: ['<rect x="2" y="20" width="96" height="60" rx="8"/>', '<circle cx="50" cy="50" r="22"/><circle cx="16" cy="50" r="5"/><circle cx="84" cy="50" r="5"/>', '<text x="50" y="62" text-anchor="middle" font-family="Arial" font-weight="900" font-size="32">¥</text>'],
  phone: ['<rect x="24" y="2" width="52" height="96" rx="10"/>', '<rect x="30" y="12" width="40" height="74" rx="4"/>', '<path d="M34 64l9-10 8 6 13-16" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="34" y="20" width="22" height="6" rx="3"/><rect x="34" y="72" width="32" height="6" rx="3"/>'],
  shield: ['<path d="M50 3l42 14v29c0 27-18 43-42 51C26 89 8 73 8 46V17z"/>', '<path d="M30 50l13 13 27-28" fill="none" stroke="#000" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'],
  spark: ['<path d="M40 4l8 24 24 8-24 8-8 24-8-24-24-8 24-8z"/><path d="M80 54l4.5 13.5 13.5 4.5-13.5 4.5-4.5 13.5-4.5-13.5-13.5-4.5 13.5-4.5z"/><circle cx="16" cy="84" r="6"/>', ''],
};
const art = (k) => { if (LANG !== 'zh' || !k) return ''; const [shape, cut, add = ''] = ART[k];
  // shape minus cut-outs, plus optional detail drawn back inside a cut-out (e.g. the yuan sign inside the coin hole)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><mask id="m"><rect width="100" height="100" fill="white"/><g fill="black" stroke-linecap="round">${cut}</g></mask></defs><g mask="url(#m)">${shape}</g>${add}</svg>`;
  const u = `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`; return `<div class="art" style="-webkit-mask-image:${u};mask-image:${u}"></div>`; };
const page = (i, body, k) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body class="${LANG}"><div class="dots"></div>${art(k)}${head(i)}${body}</body></html>`;

function build(lang) {
LANG = lang;
const S = [];

// 1 cover: changelog
const feats = [[t('9th Anniversary Champions race', '九周年冠军赛'), 'Event'], [t('Career Review', '九周年生涯回顾'), 'Event'], [t('US stock dividends', '美股合约现金分红'), 'TradFi'], [t('Futures Martingale bot', '合约马丁格尔机器人'), 'Bots'],
  [t('Spot fee coupons', '现货手续费抵扣券'), 'Spot'], [t('CNY deposits via NowPay', 'NowPay 人民币出入金'), 'Fiat'], [t('Position mini mode', '合约仓位迷你模式'), 'App'], [t("Today's P&L", '首页今日盈亏'), 'App'], [t('Proof of Reserves', '储备金证明'), 'Trust']];
const CATN = {Event: t('EVENT', '活动'), TradFi: 'TRADFI', Bots: t('BOTS', '机器人'), Spot: t('SPOT', '现货'), Fiat: t('FIAT', '法币'), App: 'APP', Trust: t('TRUST', '安全')};
// small robot icon for the BOTS pill (inline SVG, renders the same everywhere unlike system emoji)
const robot = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3"/><circle cx="12" cy="2.6" r=".6" fill="${INK}"/><rect x="4" y="6" width="16" height="13" rx="4"/><circle cx="9" cy="12" r="1.4" fill="${INK}"/><circle cx="15" cy="12" r="1.4" fill="${INK}"/><path d="M9.5 16h5M2 11v4M22 11v4"/></svg>`;
// one soft colour per category (same lightness, ink text); same category = same colour
const CAT = {Event: LIME, TradFi: '#9AD7FF', Bots: '#CDBBFF', Spot: '#FFC98A', Fiat: '#8FE3C2', App: '#FFFFFF', Trust: '#F2E3A0'};
const shield = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>`;
S.push(page(1, `
  <div style="position:absolute;left:72px;right:72px;top:180px">
    <div class="m" style="font-size:20px;letter-spacing:3px;color:${GRAY}">${t("WHAT'S NEW ON HOTCOIN", 'HOTCOIN 新功能')}</div>
    <div style="font-weight:800;font-size:150px;letter-spacing:-7px;line-height:.92;margin-top:14px">${t('November<br>update.', '11月<br>版本更新')}</div>
    <div style="font-weight:600;font-size:44px;letter-spacing:-1.4px;color:${GRAY};margin-top:22px">${t('9 new things, swipe through.', '9 项新功能，左滑查看')}</div></div>
  <div class="vis" style="top:640px;bottom:80px;background:${INK};padding:26px 40px;display:flex;flex-direction:column;justify-content:space-between">
    ${feats.map(([f, c], k) => `<div style="display:flex;align-items:center;gap:22px;color:#fff;${k ? 'border-top:1.5px solid rgba(255,255,255,.1);' : ''}padding-top:${k ? 12 : 0}px">
      <div class="m" style="font-size:20px;font-weight:700;color:${LIME};width:40px">${String(k + 1).padStart(2, '0')}</div>
      <div style="flex:1;font-weight:600;font-size:32px;letter-spacing:-.5px">${f}</div>
      <div class="m" style="display:flex;align-items:center;gap:8px;font-size:18px;font-weight:700;letter-spacing:2px;color:${INK};background:${CAT[c]};border-radius:99px;padding:7px 16px">${c === 'Bots' ? robot : c === 'Trust' ? shield : ''}${CATN[c]}</div></div>`).join('')}
  </div>`, 'cover'));

// 2 anniversary: step chart of the Champions pool
const steps = [['20K', 2], ['50K', 5], ['80K', 8], ['100K', 10], ['500K', 50], ['1M', 100], ['2M', 200], ['4M', 400]];
S.push(page(2, `${title(t('9TH ANNIVERSARY', '九周年'), `6,000,000 USDT<br><span>${t('in the Champions race.', '九周年冠军赛总奖池')}</span>`)}
  <div class="vis" style="top:500px;height:480px;border:1.5px solid ${LINE};background:#fff;padding:30px 36px">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><div class="m" style="font-size:17px;letter-spacing:2px;color:${GRAY}">${t('CHAMPIONS POOL UNLOCKS WITH TOTAL VOLUME', '全员交易量逐级解锁冠军奖池')}</div><div class="m" style="font-size:17px;color:${GRAY}">USDT</div></div>
    <div style="position:absolute;left:36px;right:36px;bottom:30px;height:360px;display:flex;align-items:flex-end;gap:12px">
      ${steps.map(([l, v], k) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:10px;justify-content:flex-end;height:100%">
        <div class="m" style="font-size:20px;font-weight:700;color:${k == 7 ? INK : GRAY}">${l}</div>
        <div style="width:100%;height:${Math.max(10, Math.sqrt(v / 400) * 280)}px;border-radius:10px 10px 4px 4px;background:${k == 7 ? LIME : k > 4 ? GREEN : '#DDE7D3'}"></div></div>`).join('')}
    </div></div>
  ${bullets(t(['<b>Early bird:</b> sign up by Nov 16 for 19 USDT (new users) or 9 USDT (existing users). First come, first served.', '<b>Main race, Nov 16 to Dec 14:</b> solo and team futures trading.', '<b>Plus 4 side arenas,</b> including a lucky draw and Career Review.'],
    ['<b>早鸟奖：</b>11月16日前报名，新用户 19 USDT，老用户 9 USDT，先到先得。', '<b>正赛 11月16日至12月14日：</b>个人赛与战队赛，比拼合约交易。', '<b>另有 4 个分会场，</b>包括幸运抽奖和生涯回顾。']))}`, 'trophy'));

// 3 career review: card mockup with a 6-skill radar
const radar = (() => {
  const c = 150, r = 120, v = [.9, .65, .8, .55, .75, .7], ang = (k) => -Math.PI / 2 + k * Math.PI / 3, P = (k, s) => `${c + Math.cos(ang(k)) * r * s},${c + Math.sin(ang(k)) * r * s}`;
  return `<svg width="300" height="300">${[1, .66, .33].map((s) => `<polygon points="${[0, 1, 2, 3, 4, 5].map((k) => P(k, s)).join(' ')}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1.5"/>`).join('')}
    ${[0, 1, 2, 3, 4, 5].map((k) => `<line x1="${c}" y1="${c}" x2="${P(k, 1).split(',')[0]}" y2="${P(k, 1).split(',')[1]}" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>`).join('')}
    <polygon points="${v.map((s, k) => P(k, s)).join(' ')}" fill="rgba(184,242,106,.35)" stroke="${LIME}" stroke-width="3"/></svg>`;
})();
S.push(page(3, `${title(t('9TH ANNIVERSARY', '九周年'), t(`Your Hotcoin story,<br><span>in one card.</span>`, `你的 Hotcoin 故事<br><span>浓缩成一张卡片</span>`))}
  <div class="vis" style="top:500px;height:490px;background:${INK};color:#fff;padding:40px 44px;display:flex;gap:36px;align-items:center">
    <div style="flex:1;display:flex;flex-direction:column;gap:22px">
      <div class="m" style="font-size:17px;letter-spacing:2px;color:${LIME}">${t('CAREER REVIEW', '生涯回顾')}</div>
      ${t(['Days with Hotcoin', 'Trades and total volume', 'Best trading day', 'Rewards earned'], ['陪伴天数', '交易次数与总交易额', '最佳交易日', '获得奖励']).map((x) => `<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid rgba(255,255,255,.1);padding-bottom:12px"><div style="font-size:26px;font-weight:600">${x}</div><div style="width:90px;height:16px;border-radius:8px;background:rgba(255,255,255,.18)"></div></div>`).join('')}
      <div style="display:inline-flex;align-self:flex-start;background:${LIME};color:${INK};font-weight:800;font-size:26px;padding:10px 20px;border-radius:12px">${t('Your title', '你的专属称号')}</div></div>
    ${radar}</div>
  ${bullets(t(['Sign up for the Champions race to unlock your <b>Career Review.</b>', 'Get scored on <b>6 trading skills</b> and earn a title.', 'Share your poster with friends.'],
    ['报名冠军赛，即可开启<b>生涯回顾</b>。', '<b>6 维交易能力</b>打分，获得专属称号。', '生成专属海报，分享给好友。']))}`, 'podium'));

// 4 TradFi: pair page mockup with a dividend event
S.push(page(4, `${title(t('NEW · TRADFI', '新功能 · TRADFI'), t(`US stock contracts<br><span>now pay cash dividends.</span>`, `美股合约<br><span>现已支持现金分红</span>`))}
  <div class="vis" style="top:500px;height:480px;border:1.5px solid ${LINE};background:#fff;padding:36px 36px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="display:flex;gap:12px">${t(['Profile', 'Financials', 'Performance'], ['公司简介', '财务信息', '业绩指标']).map((t, k) => `<div style="font-weight:700;font-size:24px;padding:10px 22px;border-radius:99px;${k ? `background:${SOFT};color:${GRAY}` : `background:${INK};color:#fff`}">${t}</div>`).join('')}</div>
    <div style="display:flex;flex-direction:column;gap:12px"><div style="height:16px;width:88%;border-radius:8px;background:${LINE}"></div><div style="height:16px;width:66%;border-radius:8px;background:${LINE}"></div></div>
    <div style="display:flex;align-items:center;gap:20px;background:${LIME};border-radius:20px;padding:22px 26px">
      <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="${INK}"/><path d="M22 11v22M27 15.5c-1.5-1.6-3.2-2.2-5-2.2-3 0-5 1.6-5 4s2 3.4 5 4.2 5.2 1.8 5.2 4.4-2.2 4.2-5.2 4.2c-2.2 0-4-.8-5.6-2.4" fill="none" stroke="${LIME}" stroke-width="2.6" stroke-linecap="round"/></svg>
      <div style="flex:1;font-weight:800;font-size:32px">${t('Cash dividend event', '现金分红事件')}</div><div class="m" style="font-size:18px;font-weight:700;letter-spacing:1.5px">${t('ON THE TRADE PAGE', '交易页展示')}</div></div>
    <div style="display:flex;align-items:center;justify-content:space-between;border:1.5px solid ${LINE};border-radius:20px;padding:20px 26px">
      <div style="font-weight:700;font-size:28px">${t('Dividend record', '分红记录')}</div><div class="m" style="font-size:18px;color:${GRAY};letter-spacing:1.5px">${t('ASSET HISTORY', '资产流水')}</div></div>
  </div>
  ${bullets(t(['<b>Company profile, financials and performance</b> on every pair page.', 'Add to favorites and jump to the related stock page.', 'Dividend events on the trade page, <b>records in your asset history.</b>'],
    ['币对主页新增<b>公司简介、财务信息与业绩指标</b>。', '支持收藏，可跳转关联个股主页。', '交易页展示分红事件，<b>资产流水可查分红记录</b>。']))}`, 'dividend'));

// 5 Martingale: step-down chart with adds and take profit
const martF = () => {
  const w = 936, h = 380, xs = [70, 250, 430, 610], ys = [70, 150, 230, 310];
  const avg = [70, 110, 150, 190];
  const tpX = 820, tpY = 150;
  const price = `M10,40 L${xs[0]},${ys[0]} L150,110 L${xs[1]},${ys[1]} L330,190 L${xs[2]},${ys[2]} L520,280 L${xs[3]},${ys[3]} L700,230 L${tpX},${tpY}`;
  return `<svg width="${w}" height="${h}" style="overflow:visible">
    ${[0, 1, 2, 3].map((k) => `<line x1="${xs[k]}" x2="${k < 3 ? xs[k + 1] : tpX}" y1="${avg[k] + 0}" y2="${avg[k]}" stroke="${GRAY}" stroke-width="2" stroke-dasharray="6 6"/>`).join('')}
    <line x1="${xs[0]}" x2="${tpX + 60}" y1="${tpY}" y2="${tpY}" stroke="${UP}" stroke-width="2.5" stroke-dasharray="10 8" opacity=".0"/>
    <path d="${price}" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
    ${xs.map((x, k) => `<circle cx="${x}" cy="${ys[k]}" r="22" fill="${k ? INK : '#fff'}" stroke="${INK}" stroke-width="3"/><text x="${x}" y="${ys[k] + 7}" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="19" fill="${k ? LIME : INK}">${k ? '+' + k : '1'}</text>`).join('')}
    <circle cx="${tpX}" cy="${tpY}" r="24" fill="${LIME}" stroke="${INK}" stroke-width="3"/><path d="M${tpX - 9} ${tpY + 1}l6 6 12-13" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${tpX}" y="${tpY - 40}" text-anchor="middle" font-family="Inter Tight" font-weight="800" font-size="26" fill="${INK}">${t('Take profit', '止盈')}</text>
    <text x="${xs[0] + 34}" y="${ys[0] - 22}" font-family="Inter Tight" font-weight="700" font-size="22" fill="${INK}">${t('First order', '首单')}</text>
    <text x="${xs[3] + 34}" y="${ys[3] + 8}" font-family="Inter Tight" font-weight="700" font-size="22" fill="${INK}">${t('Adds as price drops', '下跌时分批加仓')}</text>
    <text x="${xs[1] + 30}" y="${avg[1] - 12}" font-family="JetBrains Mono" font-size="17" fill="${GRAY}">${t('avg entry', '持仓均价')}</text>
  </svg>`;
};
const mart = martF();
S.push(page(5, `${title(t('NEW · TRADING BOTS', '新功能 · 交易机器人'), t(`Futures Martingale bot.<br><span>Set the rules, it runs.</span>`, `合约马丁格尔机器人<br><span>设好规则，自动执行</span>`))}
  <div class="vis" style="top:500px;height:480px;background:${SOFT};padding:50px 0 0 0">${mart}</div>
  ${bullets(t(['Price drops: the bot <b>adds in steps,</b> pulling your average entry down.', 'Price bounces to your target: the bot <b>closes the round.</b>', 'Defaults: add every 0.5% drop, 1% take profit, 5x. <b>More adds mean more risk.</b>'],
    ['价格下跌：机器人<b>分批加仓</b>，拉低持仓均价。', '价格反弹至目标：机器人<b>自动平仓</b>，完成一轮。', '默认参数：每跌 0.5% 加仓，1% 止盈，5 倍杠杆。<b>加仓越多，风险越高。</b>']))}`, 'robot'));

// 6 fee coupon: two tickets
const ticket = (bg, fg, top, big, sub) => `<div style="flex:1;height:480px;background:${bg};color:${fg};border-radius:26px;position:relative;padding:34px 36px;display:flex;flex-direction:column;justify-content:space-between">
  <div style="position:absolute;left:-24px;top:216px;width:48px;height:48px;border-radius:50%;background:#fff"></div><div style="position:absolute;right:-24px;top:216px;width:48px;height:48px;border-radius:50%;background:#fff"></div>
  <div style="position:absolute;left:36px;right:36px;top:240px;border-top:2.5px dashed ${fg === INK ? 'rgba(11,14,17,.25)' : 'rgba(255,255,255,.25)'}"></div>
  <div class="m" style="font-size:18px;font-weight:700;letter-spacing:2.5px">${top}</div>
  <div><div style="font-weight:800;font-size:72px;letter-spacing:-2.5px;line-height:1">${big}</div><div style="font-size:24px;font-weight:600;margin-top:8px;opacity:.75">${sub}</div></div></div>`;
S.push(page(6, `${title(t('NEW · SPOT', '新功能 · 现货'), t(`Spot fee coupons.<br><span>Pay less on every trade.</span>`, `现货手续费抵扣券<br><span>每笔交易都能省</span>`))}
  <div class="vis" style="top:500px;height:480px;display:flex;gap:28px">${ticket(INK, '#fff', t('SPOT FEE COUPON', '现货手续费抵扣券'), t('Fixed<br>amount', '固定<br>金额'), t('Off your trading fee', '直接抵扣手续费'))}${ticket(LIME, INK, t('SPOT FEE COUPON', '现货手续费抵扣券'), t('Percent<br>off', '固定<br>比例'), t('A share of your fee', '按比例抵扣手续费'))}</div>
  ${bullets(t(['Works on <b>manual spot orders,</b> buy or sell (not recurring buys).', 'One coupon per order. Choose it when you place the order.', 'Find yours in <b>Benefits Center, My Coupons</b> or on the spot page.'],
    ['适用于<b>手动现货下单</b>，买入卖出均可（定投除外）。', '每笔订单限用一张，下单时选择使用。', '在<b>福利中心、我的卡券</b>或现货页右上角查看。']))}`, 'ticket'));

// 7 NowPay: two fee numbers
S.push(page(7, `${title(t('NEW · FIAT', '新功能 · 法币'), t(`CNY deposits<br><span>and withdrawals are live.</span>`, `人民币出入金<br><span>现已上线</span>`))}
  <div class="vis" style="top:500px;height:480px;display:flex;gap:28px">
    ${[[t('DEPOSIT CNY', '人民币入金'), '2.3%', t('fee, taken from the deposit amount', '手续费，从入金金额中扣除'), LIME, INK], [t('WITHDRAW CNY', '人民币出金'), '0.7%', t('withdrawal fee', '出金手续费'), INK, '#fff']].map(([k, v, s, bg, fg]) => `<div style="flex:1;background:${bg};color:${fg};border-radius:26px;padding:34px 36px;display:flex;flex-direction:column;justify-content:space-between">
      <div class="m" style="font-size:18px;font-weight:700;letter-spacing:2.5px">${k}</div><div><div style="font-weight:800;font-size:170px;letter-spacing:-8px;line-height:.9">${v}</div><div style="font-size:26px;font-weight:600;margin-top:12px;opacity:.75">${s}</div></div></div>`).join('')}
  </div>
  ${bullets(t(['A new fiat channel, <b>powered by NowPay.</b>', 'Buy crypto with CNY, cash out to CNY.', 'KYC required.'],
    ['新增法币渠道，<b>由 NowPay 提供</b>。', '人民币入金买币，也可出金至人民币。', '需完成 KYC 认证。']))}`, 'yuan'));

// 8 app: mini mode + today's P&L
const bar = (w, c = LINE) => `<div style="height:14px;width:${w};border-radius:7px;background:${c}"></div>`;
S.push(page(8, `${title(t('NEW · APP', '新功能 · APP'), t(`Two small upgrades<br><span>you'll use every day.</span>`, `两项小升级<br><span>每天都用得上</span>`))}
  <div class="vis" style="top:500px;height:500px;display:flex;gap:28px">
    <div style="flex:1;border:1.5px solid ${LINE};background:#fff;border-radius:28px;padding:28px;display:flex;flex-direction:column;gap:18px">
      <div class="m" style="font-size:17px;letter-spacing:2px;color:${GRAY}">${t('HOME', '首页')}</div>
      <div style="font-size:22px;font-weight:600;color:${GRAY}">${t('Total assets', '总资产')}</div>${bar('70%', INK)}
      <div style="background:${LIME};border-radius:18px;padding:22px;margin-top:10px">
        <div style="font-size:24px;font-weight:800">${t("Today's P&amp;L", '今日盈亏')}</div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:12px"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 16l6-6 4 4 6-7" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>${bar('60%', 'rgba(11,14,17,.35)')}</div></div>
      <div style="font-size:24px;font-weight:700;margin-top:auto">${t('Your day, at a glance.', '当日盈亏，一目了然。')}</div></div>
    <div style="flex:1;border:1.5px solid ${LINE};background:#fff;border-radius:28px;padding:28px;display:flex;flex-direction:column;gap:12px">
      <div class="m" style="font-size:17px;letter-spacing:2px;color:${GRAY}">${t('FUTURES · MINI MODE', '合约 · 迷你模式')}</div>
      ${[0, 1, 2, 3, 4, 5].map((k) => `<div style="height:46px;border-radius:12px;background:${k ? SOFT : INK};display:flex;align-items:center;justify-content:space-between;padding:0 16px">${bar('42%', k ? '#D9DCD6' : 'rgba(255,255,255,.35)')}<div style="height:14px;width:22%;border-radius:7px;background:${k % 2 ? UP : k ? RED : LIME}"></div></div>`).join('')}
      <div style="font-size:24px;font-weight:700;margin-top:auto">${t('More positions, less scrolling.', '仓位一屏看更多。')}</div></div>
  </div>
  ${bullets(t(["<b>Today's P&amp;L</b> now sits next to your assets on the App home page.", '<b>Position mini mode:</b> switch the futures position panel to a compact view.'],
    ['App 首页资产旁新增<b>今日盈亏</b>。', '<b>仓位迷你模式：</b>合约仓位面板可切换为紧凑视图。']))}`, 'phone'));

// 9 proof of reserves (ratios from the Oct 29 snapshot)
S.push(page(9, `${title(t('NEW · TRUST', '新功能 · 安全'), t(`Proof of Reserves,<br><span>right in the app.</span>`, `储备金证明<br><span>App 内随时查看</span>`))}
  <div class="vis" style="top:500px;height:480px;border:1.5px solid ${LINE};background:#fff;padding:36px 40px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="display:flex;justify-content:space-between"><div class="m" style="font-size:17px;letter-spacing:2px;color:${GRAY}">${t('RESERVE RATIO · LAST SNAPSHOT', '储备金率 · 最近快照')}</div><div class="m" style="font-size:17px;color:${GRAY}">${t('OCT 29, 2026', '2026.10.29')}</div></div>
    ${[['BTC', 105], ['ETH', 109], ['USDT', 113]].map(([c, v]) => `<div style="display:flex;align-items:center;gap:24px"><div style="width:110px;font-weight:800;font-size:34px">${c}</div>
      <div style="flex:1;height:56px;border-radius:12px;background:${SOFT};position:relative;overflow:hidden"><div style="position:absolute;left:0;top:0;bottom:0;width:${(100 / 120) * 100}%;background:#DDE7D3"></div><div style="position:absolute;left:0;top:0;bottom:0;width:${(v / 120) * 100}%;background:${UP};border-radius:12px"></div>
      <div style="position:absolute;left:${(100 / 120) * 100}%;top:-6px;bottom:-6px;border-left:2.5px dashed ${INK}"></div></div>
      <div style="width:130px;text-align:right;font-weight:800;font-size:40px;color:${UP}">${v}%</div></div>`).join('')}
    <div class="m" style="font-size:16px;letter-spacing:1.5px;color:${GRAY};padding-left:134px">${t('DASHED LINE = 100%, FULLY BACKED', '虚线 = 100%，足额储备')}</div></div>
  ${bullets(t(['Check the platform\'s <b>reserve information any time,</b> inside the app.', 'Above 100% means reserves exceed user assets for that coin.'],
    ['在 App 内<b>随时查看平台储备信息</b>。', '高于 100%，表示该币种储备大于用户资产。']))}`, 'shield'));

// 10 also improved + CTA
const polish = t([['Futures', 'refreshed charts, order panels and TP/SL'], ['Risk prompts', 'clearer liquidation price wording'], ['Copy trading', '"Go lead" opens your last pair'],
  ['Login', 'verification follows what you bound, Passkey first'], ['Activity Center', 'refreshed, all events by default'], ['Look and feel', 'new number font and illustrations']],
  [['合约交易', '行情、K线、委托面板及止盈止损全面优化'], ['风控提示', '强平价格文案更清晰'], ['跟单', '「去带单」自动选中上次币对'], ['登录验证', '按已绑定方式验证，优先 Passkey'], ['活动中心', '界面焕新，默认展示全部活动'], ['视觉体验', '全新数字字体与插画']]);
S.push(page(10, `${title(t('ALSO IN THIS UPDATE', '本次更新还有'), t(`Polished<br><span>across the app.</span>`, `全面优化<br><span>体验更顺手</span>`))}
  <div style="position:absolute;left:72px;right:72px;top:500px;display:grid;grid-template-columns:1fr 1fr;gap:18px">
    ${polish.map(([k, v]) => `<div style="border:1.5px solid ${LINE};border-radius:22px;padding:24px 26px;background:#fff"><div style="font-weight:800;font-size:30px">${k}</div><div style="font-size:24px;line-height:1.3;color:${BODY};margin-top:8px;font-weight:500">${v}</div></div>`).join('')}</div>
  <div style="position:absolute;left:72px;right:72px;bottom:80px;background:${INK};color:#fff;border-radius:28px;padding:34px 40px;display:flex;align-items:center;justify-content:space-between">
    <div><div style="font-weight:800;font-size:44px;letter-spacing:${t('-1.5px', '0')}">${t('Update your Hotcoin app.', '立即更新 Hotcoin App')}</div><div class="m" style="font-size:20px;letter-spacing:2px;color:${LIME};margin-top:10px">${t('HOTCOIN.COM', 'HOTCOINV5.COM')}</div></div>
    <div style="width:84px;height:84px;border-radius:50%;background:${LIME};display:flex;align-items:center;justify-content:center"><svg width="36" height="36" viewBox="0 0 24 24"><path d="M12 4v14M6 12l6 6 6-6" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>`, 'spark'));

return S;
}

const browser = await chromium.launch();
const pg = await (await browser.newContext({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2})).newPage();
fs.mkdirSync(DIR + '/out', {recursive: true});
for (const lang of (process.argv[2] || 'en,zh').split(',')) {
  const S = build(lang), pre = lang === 'en' ? 'nov' : 'nov-' + lang;
  for (let i = 0; i < S.length; i++) {
    const f = `${DIR}/_s.html`; fs.writeFileSync(f, S[i]);
    await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({path: `${DIR}/out/${pre}-${String(i + 1).padStart(2, '0')}.png`}); fs.unlinkSync(f);
  }
}
await browser.close(); console.log('done');
