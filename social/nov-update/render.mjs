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
// Run: PW_PATH=$(npm root -g)/playwright node social/nov-update/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/nov-update';
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png';
const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A', UP = '#17A86B', RED = '#E5484D', GRAY = '#6B7280', BODY = '#3F454D', LINE = '#E6E8EB', SOFT = '#F4F5F2';
const N = 10;

const css = `@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:#fff;color:${INK};font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
.m{font-family:'JetBrains Mono',monospace}
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
  <img src="${LOGO}" style="height:42px"><div class="m" style="font-size:18px;letter-spacing:2px;border:1.5px solid ${INK};border-radius:99px;padding:9px 18px">NOVEMBER UPDATE · ${String(i).padStart(2, '0')}/${N}</div></div>`;
const title = (tag, h, top = 180) => `<div style="position:absolute;left:72px;right:72px;top:${top}px"><div class="tag">${tag}</div><h1 style="margin-top:26px">${h}</h1></div>`;
const page = (i, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="dots"></div>${head(i)}${body}</body></html>`;

const S = [];

// 1 cover: changelog
const feats = [['9th Anniversary Champions race', 'Event'], ['Career Review', 'Event'], ['US stock dividends', 'TradFi'], ['Futures Martingale bot', 'Bots'],
  ['Spot fee coupons', 'Spot'], ['CNY deposits via NowPay', 'Fiat'], ['Position mini mode', 'App'], ["Today's P&L", 'App'], ['Proof of Reserves', 'Trust']];
// small robot icon for the BOTS pill (inline SVG, renders the same everywhere unlike system emoji)
const robot = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3"/><circle cx="12" cy="2.6" r=".6" fill="${INK}"/><rect x="4" y="6" width="16" height="13" rx="4"/><circle cx="9" cy="12" r="1.4" fill="${INK}"/><circle cx="15" cy="12" r="1.4" fill="${INK}"/><path d="M9.5 16h5M2 11v4M22 11v4"/></svg>`;
S.push(page(1, `
  <div style="position:absolute;left:72px;right:72px;top:180px">
    <div class="m" style="font-size:20px;letter-spacing:3px;color:${GRAY}">WHAT'S NEW ON HOTCOIN</div>
    <div style="font-weight:800;font-size:150px;letter-spacing:-7px;line-height:.92;margin-top:14px">November<br>update.</div>
    <div style="font-weight:600;font-size:44px;letter-spacing:-1.4px;color:${GRAY};margin-top:22px">9 new things, swipe through.</div></div>
  <div class="vis" style="top:640px;bottom:80px;background:${INK};padding:26px 40px;display:flex;flex-direction:column;justify-content:space-between">
    ${feats.map(([f, c], k) => `<div style="display:flex;align-items:center;gap:22px;color:#fff;${k ? 'border-top:1.5px solid rgba(255,255,255,.1);' : ''}padding-top:${k ? 12 : 0}px">
      <div class="m" style="font-size:20px;font-weight:700;color:${LIME};width:40px">${String(k + 1).padStart(2, '0')}</div>
      <div style="flex:1;font-weight:600;font-size:32px;letter-spacing:-.5px">${f}</div>
      <div class="m" style="display:flex;align-items:center;gap:8px;font-size:18px;font-weight:700;letter-spacing:2px;color:${INK};background:${LIME};border-radius:99px;padding:7px 16px">${c === 'Bots' ? robot : ''}${c.toUpperCase()}</div></div>`).join('')}
  </div>`));

// 2 anniversary: step chart of the Champions pool
const steps = [['20K', 2], ['50K', 5], ['80K', 8], ['100K', 10], ['500K', 50], ['1M', 100], ['2M', 200], ['4M', 400]];
S.push(page(2, `${title('9TH ANNIVERSARY', `6,000,000 USDT<br><span>in the Champions race.</span>`)}
  <div class="vis" style="top:500px;height:480px;border:1.5px solid ${LINE};background:#fff;padding:30px 36px">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><div class="m" style="font-size:17px;letter-spacing:2px;color:${GRAY}">CHAMPIONS POOL UNLOCKS WITH TOTAL VOLUME</div><div class="m" style="font-size:17px;color:${GRAY}">USDT</div></div>
    <div style="position:absolute;left:36px;right:36px;bottom:30px;height:360px;display:flex;align-items:flex-end;gap:12px">
      ${steps.map(([l, v], k) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:10px;justify-content:flex-end;height:100%">
        <div class="m" style="font-size:20px;font-weight:700;color:${k == 7 ? INK : GRAY}">${l}</div>
        <div style="width:100%;height:${Math.max(10, Math.sqrt(v / 400) * 280)}px;border-radius:10px 10px 4px 4px;background:${k == 7 ? LIME : k > 4 ? GREEN : '#DDE7D3'}"></div></div>`).join('')}
    </div></div>
  ${bullets(['<b>Early bird:</b> sign up by Nov 16 for 19 USDT (new users) or 9 USDT (existing users). First come, first served.', '<b>Main race, Nov 16 to Dec 14:</b> solo and team futures trading.', '<b>Plus 4 side arenas,</b> including a lucky draw and Career Review.'])}`));

// 3 career review: card mockup with a 6-skill radar
const radar = (() => {
  const c = 150, r = 120, v = [.9, .65, .8, .55, .75, .7], ang = (k) => -Math.PI / 2 + k * Math.PI / 3, P = (k, s) => `${c + Math.cos(ang(k)) * r * s},${c + Math.sin(ang(k)) * r * s}`;
  return `<svg width="300" height="300">${[1, .66, .33].map((s) => `<polygon points="${[0, 1, 2, 3, 4, 5].map((k) => P(k, s)).join(' ')}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1.5"/>`).join('')}
    ${[0, 1, 2, 3, 4, 5].map((k) => `<line x1="${c}" y1="${c}" x2="${P(k, 1).split(',')[0]}" y2="${P(k, 1).split(',')[1]}" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>`).join('')}
    <polygon points="${v.map((s, k) => P(k, s)).join(' ')}" fill="rgba(184,242,106,.35)" stroke="${LIME}" stroke-width="3"/></svg>`;
})();
S.push(page(3, `${title('9TH ANNIVERSARY', `Your Hotcoin story,<br><span>in one card.</span>`)}
  <div class="vis" style="top:500px;height:490px;background:${INK};color:#fff;padding:40px 44px;display:flex;gap:36px;align-items:center">
    <div style="flex:1;display:flex;flex-direction:column;gap:22px">
      <div class="m" style="font-size:17px;letter-spacing:2px;color:${LIME}">CAREER REVIEW</div>
      ${['Days with Hotcoin', 'Trades and total volume', 'Best trading day', 'Rewards earned'].map((x) => `<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid rgba(255,255,255,.1);padding-bottom:12px"><div style="font-size:26px;font-weight:600">${x}</div><div style="width:90px;height:16px;border-radius:8px;background:rgba(255,255,255,.18)"></div></div>`).join('')}
      <div style="display:inline-flex;align-self:flex-start;background:${LIME};color:${INK};font-weight:800;font-size:26px;padding:10px 20px;border-radius:12px">Your title</div></div>
    ${radar}</div>
  ${bullets(['Sign up for the Champions race to unlock your <b>Career Review.</b>', 'Get scored on <b>6 trading skills</b> and earn a title.', 'Share your poster with friends.'])}`));

// 4 TradFi: pair page mockup with a dividend event
S.push(page(4, `${title('NEW · TRADFI', `US stock contracts<br><span>now pay cash dividends.</span>`)}
  <div class="vis" style="top:500px;height:480px;border:1.5px solid ${LINE};background:#fff;padding:36px 36px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="display:flex;gap:12px">${['Profile', 'Financials', 'Performance'].map((t, k) => `<div style="font-weight:700;font-size:24px;padding:10px 22px;border-radius:99px;${k ? `background:${SOFT};color:${GRAY}` : `background:${INK};color:#fff`}">${t}</div>`).join('')}</div>
    <div style="display:flex;flex-direction:column;gap:12px"><div style="height:16px;width:88%;border-radius:8px;background:${LINE}"></div><div style="height:16px;width:66%;border-radius:8px;background:${LINE}"></div></div>
    <div style="display:flex;align-items:center;gap:20px;background:${LIME};border-radius:20px;padding:22px 26px">
      <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="${INK}"/><path d="M22 11v22M27 15.5c-1.5-1.6-3.2-2.2-5-2.2-3 0-5 1.6-5 4s2 3.4 5 4.2 5.2 1.8 5.2 4.4-2.2 4.2-5.2 4.2c-2.2 0-4-.8-5.6-2.4" fill="none" stroke="${LIME}" stroke-width="2.6" stroke-linecap="round"/></svg>
      <div style="flex:1;font-weight:800;font-size:32px">Cash dividend event</div><div class="m" style="font-size:18px;font-weight:700;letter-spacing:1.5px">ON THE TRADE PAGE</div></div>
    <div style="display:flex;align-items:center;justify-content:space-between;border:1.5px solid ${LINE};border-radius:20px;padding:20px 26px">
      <div style="font-weight:700;font-size:28px">Dividend record</div><div class="m" style="font-size:18px;color:${GRAY};letter-spacing:1.5px">ASSET HISTORY</div></div>
  </div>
  ${bullets(['<b>Company profile, financials and performance</b> on every pair page.', 'Add to favorites and jump to the related stock page.', 'Dividend events on the trade page, <b>records in your asset history.</b>'])}`));

// 5 Martingale: step-down chart with adds and take profit
const mart = (() => {
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
    <text x="${tpX}" y="${tpY - 40}" text-anchor="middle" font-family="Inter Tight" font-weight="800" font-size="26" fill="${INK}">Take profit</text>
    <text x="${xs[0] + 34}" y="${ys[0] - 22}" font-family="Inter Tight" font-weight="700" font-size="22" fill="${INK}">First order</text>
    <text x="${xs[3] + 34}" y="${ys[3] + 8}" font-family="Inter Tight" font-weight="700" font-size="22" fill="${INK}">Adds as price drops</text>
    <text x="${xs[1] + 30}" y="${avg[1] - 12}" font-family="JetBrains Mono" font-size="17" fill="${GRAY}">avg entry</text>
  </svg>`;
})();
S.push(page(5, `${title('NEW · TRADING BOTS', `Futures Martingale bot.<br><span>Set the rules, it runs.</span>`)}
  <div class="vis" style="top:500px;height:480px;background:${SOFT};padding:50px 0 0 0">${mart}</div>
  ${bullets(['Price drops: the bot <b>adds in steps,</b> pulling your average entry down.', 'Price bounces to your target: the bot <b>closes the round.</b>', 'Defaults: add every 0.5% drop, 1% take profit, 5x. <b>More adds mean more risk.</b>'])}`));

// 6 fee coupon: two tickets
const ticket = (bg, fg, top, big, sub) => `<div style="flex:1;height:480px;background:${bg};color:${fg};border-radius:26px;position:relative;padding:34px 36px;display:flex;flex-direction:column;justify-content:space-between">
  <div style="position:absolute;left:-24px;top:216px;width:48px;height:48px;border-radius:50%;background:#fff"></div><div style="position:absolute;right:-24px;top:216px;width:48px;height:48px;border-radius:50%;background:#fff"></div>
  <div style="position:absolute;left:36px;right:36px;top:240px;border-top:2.5px dashed ${fg === INK ? 'rgba(11,14,17,.25)' : 'rgba(255,255,255,.25)'}"></div>
  <div class="m" style="font-size:18px;font-weight:700;letter-spacing:2.5px">${top}</div>
  <div><div style="font-weight:800;font-size:72px;letter-spacing:-2.5px;line-height:1">${big}</div><div style="font-size:24px;font-weight:600;margin-top:8px;opacity:.75">${sub}</div></div></div>`;
S.push(page(6, `${title('NEW · SPOT', `Spot fee coupons.<br><span>Pay less on every trade.</span>`)}
  <div class="vis" style="top:500px;height:480px;display:flex;gap:28px">${ticket(INK, '#fff', 'SPOT FEE COUPON', 'Fixed<br>amount', 'Off your trading fee')}${ticket(LIME, INK, 'SPOT FEE COUPON', 'Percent<br>off', 'A share of your fee')}</div>
  ${bullets(['Works on <b>manual spot orders,</b> buy or sell (not recurring buys).', 'One coupon per order. Choose it when you place the order.', 'Find yours in <b>Benefits Center, My Coupons</b> or on the spot page.'])}`));

// 7 NowPay: two fee numbers
S.push(page(7, `${title('NEW · FIAT', `CNY deposits<br><span>and withdrawals are live.</span>`)}
  <div class="vis" style="top:500px;height:480px;display:flex;gap:28px">
    ${[['DEPOSIT CNY', '2.3%', 'fee, taken from the deposit amount', LIME, INK], ['WITHDRAW CNY', '0.7%', 'withdrawal fee', INK, '#fff']].map(([k, v, s, bg, fg]) => `<div style="flex:1;background:${bg};color:${fg};border-radius:26px;padding:34px 36px;display:flex;flex-direction:column;justify-content:space-between">
      <div class="m" style="font-size:18px;font-weight:700;letter-spacing:2.5px">${k}</div><div><div style="font-weight:800;font-size:170px;letter-spacing:-8px;line-height:.9">${v}</div><div style="font-size:26px;font-weight:600;margin-top:12px;opacity:.75">${s}</div></div></div>`).join('')}
  </div>
  ${bullets(['A new fiat channel, <b>powered by NowPay.</b>', 'Buy crypto with CNY, cash out to CNY.', 'KYC required.'])}`));

// 8 app: mini mode + today's P&L
const bar = (w, c = LINE) => `<div style="height:14px;width:${w};border-radius:7px;background:${c}"></div>`;
S.push(page(8, `${title('NEW · APP', `Two small upgrades<br><span>you'll use every day.</span>`)}
  <div class="vis" style="top:500px;height:500px;display:flex;gap:28px">
    <div style="flex:1;border:1.5px solid ${LINE};background:#fff;border-radius:28px;padding:28px;display:flex;flex-direction:column;gap:18px">
      <div class="m" style="font-size:17px;letter-spacing:2px;color:${GRAY}">HOME</div>
      <div style="font-size:22px;font-weight:600;color:${GRAY}">Total assets</div>${bar('70%', INK)}
      <div style="background:${LIME};border-radius:18px;padding:22px;margin-top:10px">
        <div style="font-size:24px;font-weight:800">Today's P&amp;L</div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:12px"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 16l6-6 4 4 6-7" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>${bar('60%', 'rgba(11,14,17,.35)')}</div></div>
      <div style="font-size:24px;font-weight:700;margin-top:auto">Your day, at a glance.</div></div>
    <div style="flex:1;border:1.5px solid ${LINE};background:#fff;border-radius:28px;padding:28px;display:flex;flex-direction:column;gap:12px">
      <div class="m" style="font-size:17px;letter-spacing:2px;color:${GRAY}">FUTURES · MINI MODE</div>
      ${[0, 1, 2, 3, 4, 5].map((k) => `<div style="height:46px;border-radius:12px;background:${k ? SOFT : INK};display:flex;align-items:center;justify-content:space-between;padding:0 16px">${bar('42%', k ? '#D9DCD6' : 'rgba(255,255,255,.35)')}<div style="height:14px;width:22%;border-radius:7px;background:${k % 2 ? UP : k ? RED : LIME}"></div></div>`).join('')}
      <div style="font-size:24px;font-weight:700;margin-top:auto">More positions, less scrolling.</div></div>
  </div>
  ${bullets(["<b>Today's P&amp;L</b> now sits next to your assets on the App home page.", '<b>Position mini mode:</b> switch the futures position panel to a compact view.'])}`));

// 9 proof of reserves (ratios from the Oct 29 snapshot)
S.push(page(9, `${title('NEW · TRUST', `Proof of Reserves,<br><span>right in the app.</span>`)}
  <div class="vis" style="top:500px;height:480px;border:1.5px solid ${LINE};background:#fff;padding:36px 40px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="display:flex;justify-content:space-between"><div class="m" style="font-size:17px;letter-spacing:2px;color:${GRAY}">RESERVE RATIO · LAST SNAPSHOT</div><div class="m" style="font-size:17px;color:${GRAY}">OCT 29, 2026</div></div>
    ${[['BTC', 105], ['ETH', 109], ['USDT', 113]].map(([c, v]) => `<div style="display:flex;align-items:center;gap:24px"><div style="width:110px;font-weight:800;font-size:34px">${c}</div>
      <div style="flex:1;height:56px;border-radius:12px;background:${SOFT};position:relative;overflow:hidden"><div style="position:absolute;left:0;top:0;bottom:0;width:${(100 / 120) * 100}%;background:#DDE7D3"></div><div style="position:absolute;left:0;top:0;bottom:0;width:${(v / 120) * 100}%;background:${UP};border-radius:12px"></div>
      <div style="position:absolute;left:${(100 / 120) * 100}%;top:-6px;bottom:-6px;border-left:2.5px dashed ${INK}"></div></div>
      <div style="width:130px;text-align:right;font-weight:800;font-size:40px;color:${UP}">${v}%</div></div>`).join('')}
    <div class="m" style="font-size:16px;letter-spacing:1.5px;color:${GRAY};padding-left:134px">DASHED LINE = 100%, FULLY BACKED</div></div>
  ${bullets(['Check the platform\'s <b>reserve information any time,</b> inside the app.', 'Above 100% means reserves exceed user assets for that coin.'])}`));

// 10 also improved + CTA
const polish = [['Futures', 'refreshed charts, order panels and TP/SL'], ['Risk prompts', 'clearer liquidation price wording'], ['Copy trading', '"Go lead" opens your last pair'],
  ['Login', 'verification follows what you bound, Passkey first'], ['Activity Center', 'refreshed, all events by default'], ['Look and feel', 'new number font and illustrations']];
S.push(page(10, `${title('ALSO IN THIS UPDATE', `Polished<br><span>across the app.</span>`)}
  <div style="position:absolute;left:72px;right:72px;top:500px;display:grid;grid-template-columns:1fr 1fr;gap:18px">
    ${polish.map(([k, v]) => `<div style="border:1.5px solid ${LINE};border-radius:22px;padding:24px 26px;background:#fff"><div style="font-weight:800;font-size:30px">${k}</div><div style="font-size:24px;line-height:1.3;color:${BODY};margin-top:8px;font-weight:500">${v}</div></div>`).join('')}</div>
  <div style="position:absolute;left:72px;right:72px;bottom:80px;background:${INK};color:#fff;border-radius:28px;padding:34px 40px;display:flex;align-items:center;justify-content:space-between">
    <div><div style="font-weight:800;font-size:44px;letter-spacing:-1.5px">Update your Hotcoin app.</div><div class="m" style="font-size:20px;letter-spacing:2px;color:${LIME};margin-top:10px">HOTCOIN.COM</div></div>
    <div style="width:84px;height:84px;border-radius:50%;background:${LIME};display:flex;align-items:center;justify-content:center"><svg width="36" height="36" viewBox="0 0 24 24"><path d="M12 4v14M6 12l6 6 6-6" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>`));

const browser = await chromium.launch();
const pg = await (await browser.newContext({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2})).newPage();
fs.mkdirSync(DIR + '/out', {recursive: true});
for (let i = 0; i < S.length; i++) {
  const f = `${DIR}/_s.html`; fs.writeFileSync(f, S[i]);
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({path: `${DIR}/out/nov-${String(i + 1).padStart(2, '0')}.png`}); fs.unlinkSync(f);
}
await browser.close(); console.log('done', S.length);
