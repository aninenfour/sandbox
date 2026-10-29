// Daily poster redesign: four style directions with the same day's data.
// Activities lead; market data shrinks to a strip. Renders 2000x1125 PNGs (same size as the old poster).
//   node social/daily/styles.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire('/opt/node-tools/node_modules/');
const {chromium} = require(process.env.PW_PATH || 'playwright');
const ROOT = '/home/user/sandbox';
const OUT = ROOT + '/social/daily/img';
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(ROOT + '/hotcoin-tradfi/public/' + f).toString('base64');
const LOGO_W = b64('brand/logo-official-white.png');
const LOGO_B = b64('brand/logo-official-black.png');
const GRAIN = b64('grain.png');

const D = {
  date: 'Oct 29', dateLong: 'October 29, 2026', day: '29', mon: 'OCT', wk: 'THU',
  cap: '$2.65T', capCh: -0.60, fg: 51, fgLabel: 'Neutral',
  btc: '$79,970', btcCh: -1.24, eth: '$2,307', ethCh: -2.09,
  gainers: [['Q', 21.62], ['STONKBROKER', 20.70], ['HUMA', 10.04], ['LITEB', 7.63], ['ORCLB', 6.34]],
  events: [
    {tag: 'ALPHA TRADING REWARDS #6', big: '100,000', unit: 'USDT', line: 'Trade, climb the leaderboard, share the pool', ends: 'Nov 6', left: 8},
    {tag: 'HALLOWEEN MYSTERY BOX', big: 'Every draw', unit: 'wins', line: 'MacBook Pro, iPhone 18 Pro Max & more', ends: 'Nov 5', left: 7},
  ],
};
const pct = (v) => (v > 0 ? '+' : '') + v.toFixed(2) + '%';
const cls = (v) => (v >= 0 ? 'up' : 'dn');

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800;900&family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700;800&family=Instrument+Serif:ital@0;1&display=block');`;
const BASE = `*{box-sizing:border-box;margin:0;padding:0}
body{width:1600px;height:900px;overflow:hidden;font-family:'Inter Tight',sans-serif}
.mono{font-family:'JetBrains Mono',monospace}`;

// ---------- A. Event hero (dark + lime, the brand) ----------
const A = () => `<style>${FONTS}${BASE}
body{background:#07090B;color:#F2F4EF}
.s{position:relative;width:1600px;height:900px;padding:56px 64px 44px;display:flex;flex-direction:column}
.glow{position:absolute;inset:0;background:radial-gradient(55% 60% at 22% 55%,rgba(184,242,106,.16),transparent 70%),radial-gradient(40% 50% at 85% 40%,rgba(255,122,26,.13),transparent 70%)}
.grain{position:absolute;inset:0;background:url(${GRAIN});opacity:.06;mix-blend-mode:screen}
.top{position:relative;display:flex;justify-content:space-between;align-items:center}
.top img{height:40px}
.top .d{font-family:'JetBrains Mono';font-weight:700;font-size:20px;letter-spacing:3px;color:#9AA39A}
.top .d b{color:#B8F26A}
.cards{position:relative;flex:1;display:grid;grid-template-columns:1.35fr 1fr;gap:28px;margin:38px 0 30px}
.c{border-radius:28px;padding:42px 44px;display:flex;flex-direction:column;position:relative;overflow:hidden}
.c1{background:#B8F26A;color:#07090B}
.c2{background:#16120E;border:1.5px solid #3A2A1A}
.tag{font-family:'JetBrains Mono';font-weight:800;font-size:19px;letter-spacing:3px}
.c2 .tag{color:#FF8A3D}
.big{font-family:Unbounded;font-weight:900;letter-spacing:-4px;line-height:.92;margin-top:auto}
.c1 .big{font-size:132px}
.c1 .big small{display:block;font-size:64px;margin-top:8px;letter-spacing:-1px;margin-left:10px}
.c2 .big{font-size:88px;letter-spacing:-2px;color:#FFF3E4}
.c2 .big em{font-style:normal;color:#FF8A3D}
.line{font-size:28px;font-weight:600;margin-top:18px;opacity:.85}
.foot{display:flex;align-items:center;gap:14px;margin-top:30px}
.pill{font-family:'JetBrains Mono';font-weight:800;font-size:20px;letter-spacing:2px;padding:12px 20px;border-radius:999px}
.c1 .pill{background:#07090B;color:#B8F26A}
.c2 .pill{background:#FF8A3D;color:#16120E}
.ends{font-family:'JetBrains Mono';font-weight:700;font-size:19px;letter-spacing:1px;opacity:.7}
.ring{position:absolute;right:-90px;top:-90px;width:360px;height:360px;border-radius:50%;border:44px solid rgba(7,9,11,.08)}
.box{position:absolute;right:34px;top:34px;font-size:84px;line-height:1;filter:saturate(1.1)}
.strip{position:relative;display:flex;align-items:center;justify-content:space-between;border-top:1.5px solid #1F2420;padding-top:26px;font-family:'JetBrains Mono';font-size:22px;font-weight:700;color:#C9CEC6}
.strip span{color:#6E766C;font-weight:500;margin-right:10px}
.up{color:#B8F26A}.dn{color:#FF5C6C}
</style><div class="s"><div class="glow"></div><div class="grain"></div>
<div class="top"><img src="${LOGO_W}"><div class="d">TODAY ON HOTCOIN · <b>${D.date.toUpperCase()}</b></div></div>
<div class="cards">
 <div class="c c1"><div class="ring"></div><div class="tag">${D.events[0].tag}</div>
  <div class="big">${D.events[0].big}<small>${D.events[0].unit}</small></div>
  <div class="line">${D.events[0].line}</div>
  <div class="foot"><div class="pill">${D.events[0].left} DAYS LEFT</div><div class="ends">ENDS ${D.events[0].ends.toUpperCase()}</div></div></div>
 <div class="c c2"><div class="box">🎃</div><div class="tag">${D.events[1].tag}</div>
  <div class="big">Every draw <em>wins.</em></div>
  <div class="line" style="color:#E9DCCB">${D.events[1].line}</div>
  <div class="foot"><div class="pill">${D.events[1].left} DAYS LEFT</div><div class="ends" style="color:#E9DCCB">ENDS ${D.events[1].ends.toUpperCase()}</div></div></div>
</div>
<div class="strip">
 <div><span>MKT</span>${D.cap} <i class="${cls(D.capCh)}" style="font-style:normal">${pct(D.capCh)}</i></div>
 <div><span>BTC</span>${D.btc} <i class="${cls(D.btcCh)}" style="font-style:normal">${pct(D.btcCh)}</i></div>
 <div><span>ETH</span>${D.eth} <i class="${cls(D.ethCh)}" style="font-style:normal">${pct(D.ethCh)}</i></div>
 <div><span>FEAR/GREED</span>${D.fg} ${D.fgLabel}</div>
 <div><span>TOP</span>${D.gainers[0][0]} <i class="up" style="font-style:normal">${pct(D.gainers[0][1])}</i></div>
</div></div>`;

// ---------- B. Light Swiss (matches the Discord posters) ----------
const B = () => `<style>${FONTS}${BASE}
body{background:#fff;color:#0B0E11}
.s{position:relative;width:1600px;height:900px;padding:56px 64px 48px;display:grid;grid-template-columns:330px 1fr;gap:56px}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(11,14,17,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(11,14,17,.045) 1px,transparent 1px);background-size:64px 64px}
.l,.r{position:relative;display:flex;flex-direction:column}
.l img{width:230px}
.date{margin-top:auto;font-family:Unbounded;font-weight:900;line-height:.85}
.date .n{font-size:200px;letter-spacing:-10px}
.date .m{font-size:64px;letter-spacing:2px;margin-top:14px}
.date .w{font-family:'JetBrains Mono';font-weight:700;font-size:20px;letter-spacing:4px;color:#6B7280;margin-top:18px}
.mk{margin-top:36px;border-top:2px solid #0B0E11;padding-top:18px;display:grid;grid-template-columns:auto 1fr;row-gap:10px;column-gap:18px;font-family:'JetBrains Mono';font-size:19px;font-weight:700}
.mk span{color:#6B7280;font-weight:500}
.up{color:#2F9E44}.dn{color:#E03131}
.tag{align-self:flex-start;font-family:'JetBrains Mono';font-weight:800;font-size:18px;letter-spacing:3px;background:#B8F26A;padding:9px 34px 9px 14px;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 100%,0 100%)}
.ev{margin-top:26px;display:flex;flex-direction:column;gap:20px}
.e{display:grid;grid-template-columns:1fr 210px;border:2px solid #0B0E11;border-radius:22px;overflow:hidden;background:#fff}
.e .t{padding:30px 34px}
.e h3{font-family:'JetBrains Mono';font-size:17px;letter-spacing:3px;color:#6B7280}
.e h2{font-family:Unbounded;font-weight:900;font-size:66px;letter-spacing:-2px;line-height:1;margin-top:12px}
.e h2 .hl{background:linear-gradient(transparent 58%,#B8F26A 58%,#B8F26A 92%,transparent 92%);padding:0 6px;margin:0 -6px}
.e p{font-size:24px;font-weight:600;margin-top:12px;color:#374151}
.e .cd{background:#0B0E11;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;border-left:2px dashed #fff;position:relative}
.e .cd b{font-family:Unbounded;font-weight:900;font-size:104px;line-height:.9;color:#B8F26A}
.e .cd span{font-family:'JetBrains Mono';font-weight:700;font-size:17px;letter-spacing:3px;margin-top:10px}
.e .cd i{font-style:normal;font-family:'JetBrains Mono';font-size:15px;color:#9CA3AF;margin-top:6px;letter-spacing:1px}
.gn{margin-top:auto;display:flex;gap:12px;align-items:center}
.gn .h{font-family:'JetBrains Mono';font-weight:800;font-size:17px;letter-spacing:3px;margin-right:6px}
.chip{border:2px solid #0B0E11;border-radius:999px;padding:10px 18px;font-family:'JetBrains Mono';font-weight:700;font-size:19px;white-space:nowrap}
.chip b{color:#2F9E44;margin-left:8px}
.chip.one{background:#0B0E11;color:#fff}.chip.one b{color:#B8F26A}
</style><div class="s"><div class="grid"></div>
<div class="l"><img src="${LOGO_B}">
 <div class="date"><div class="n">${D.day}</div><div class="m">${D.mon}</div><div class="w">${D.wk} · DAILY</div></div>
 <div class="mk"><span>MKT</span><div>${D.cap} <i class="${cls(D.capCh)}" style="font-style:normal">${pct(D.capCh)}</i></div>
 <span>BTC</span><div>${D.btc} <i class="${cls(D.btcCh)}" style="font-style:normal">${pct(D.btcCh)}</i></div>
 <span>ETH</span><div>${D.eth} <i class="${cls(D.ethCh)}" style="font-style:normal">${pct(D.ethCh)}</i></div>
 <span>F&amp;G</span><div>${D.fg} · ${D.fgLabel}</div></div></div>
<div class="r"><div class="tag">LIVE ON HOTCOIN NOW</div>
 <div class="ev">
  <div class="e"><div class="t"><h3>${D.events[0].tag}</h3><h2><span class="hl">${D.events[0].big}</span> USDT</h2><p>${D.events[0].line}</p></div>
   <div class="cd"><b>${D.events[0].left}</b><span>DAYS LEFT</span><i>ENDS ${D.events[0].ends.toUpperCase()}</i></div></div>
  <div class="e"><div class="t"><h3>${D.events[1].tag}</h3><h2>Every draw <span class="hl">wins</span></h2><p>${D.events[1].line}</p></div>
   <div class="cd"><b>${D.events[1].left}</b><span>DAYS LEFT</span><i>ENDS ${D.events[1].ends.toUpperCase()}</i></div></div>
 </div>
 <div class="gn"><div class="h">TOP GAINERS</div>${D.gainers.map(([s, v], i) => `<div class="chip${i ? '' : ' one'}">${s}<b>${pct(v)}</b></div>`).join('')}</div>
</div></div>`;

// ---------- C. Terminal ----------
const C = () => {
  const bar = (left, total = 14) => '█'.repeat(total - left) + '░'.repeat(left);
  return `<style>${FONTS}${BASE}
body{background:#050605;color:#C8D3C4;font-family:'JetBrains Mono',monospace}
.s{position:relative;width:1600px;height:900px;padding:48px 60px;display:flex;flex-direction:column}
.scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 4px)}
.vig{position:absolute;inset:0;background:radial-gradient(80% 80% at 50% 50%,transparent 60%,rgba(0,0,0,.6))}
.hd{position:relative;display:flex;justify-content:space-between;align-items:center;font-size:20px;color:#6C7A68;border-bottom:1.5px dashed #2A3328;padding-bottom:20px}
.hd img{height:34px}
.hd b{color:#B8F26A}
.tick{position:relative;display:flex;gap:44px;font-size:21px;font-weight:700;padding:18px 0;border-bottom:1.5px dashed #2A3328;white-space:nowrap}
.tick span{color:#5E6B5A;font-weight:500}
.up{color:#B8F26A}.dn{color:#FF5C6C}
.main{position:relative;flex:1;display:grid;grid-template-columns:1fr 440px;gap:48px;padding-top:34px}
.ev{display:flex;flex-direction:column;gap:30px}
.e{border:1.5px solid #2A3328;padding:28px 32px;position:relative}
.e::before{content:attr(data-k);position:absolute;top:-13px;left:22px;background:#050605;padding:0 10px;color:#B8F26A;font-size:18px;font-weight:800;letter-spacing:2px}
.e h2{font-family:Unbounded;font-weight:900;font-size:76px;letter-spacing:-2px;color:#F2F6EE;line-height:1}
.e h2 i{font-style:normal;color:#B8F26A}
.e p{font-size:22px;margin-top:14px;color:#9FAA9B}
.e .cd{margin-top:20px;font-size:22px;font-weight:700;color:#B8F26A;letter-spacing:1px}
.e .cd span{color:#5E6B5A}
.e.o::before{color:#FF8A3D}.e.o h2 i,.e.o .cd{color:#FF8A3D}
.side{border-left:1.5px dashed #2A3328;padding-left:40px;display:flex;flex-direction:column}
.side h4{font-size:18px;letter-spacing:3px;color:#5E6B5A;margin-bottom:22px}
.row{display:grid;grid-template-columns:34px 1fr auto;font-size:24px;font-weight:700;padding:13px 0;border-bottom:1px solid #161B15}
.row .n{color:#5E6B5A}
.fg{margin-top:auto;font-size:20px;color:#9FAA9B}
.fg .b{margin-top:10px;letter-spacing:0;color:#B8F26A;font-size:22px}
.cur{display:inline-block;width:14px;height:26px;background:#B8F26A;vertical-align:-4px;margin-left:6px}
</style><div class="s"><div class="scan"></div><div class="vig"></div>
<div class="hd"><img src="${LOGO_W}"><div>~/hotcoin/daily <b>$</b> cat ${D.dateLong.toLowerCase().replace(/[ ,]+/g, '-')}.log<span class="cur"></span></div></div>
<div class="tick">
 <div><span>MKT_CAP</span> ${D.cap} <i class="${cls(D.capCh)}" style="font-style:normal">${pct(D.capCh)}</i></div>
 <div><span>BTC</span> ${D.btc} <i class="${cls(D.btcCh)}" style="font-style:normal">${pct(D.btcCh)}</i></div>
 <div><span>ETH</span> ${D.eth} <i class="${cls(D.ethCh)}" style="font-style:normal">${pct(D.ethCh)}</i></div>
 <div><span>UTC+8</span> ${D.date.toUpperCase()}</div>
</div>
<div class="main"><div class="ev">
 <div class="e" data-k="[ EVENT_01 ] ${D.events[0].tag}"><h2>${D.events[0].big} <i>USDT</i></h2><p>&gt; ${D.events[0].line}</p>
  <div class="cd">${bar(D.events[0].left)} <span>T-${D.events[0].left}D · ENDS ${D.events[0].ends.toUpperCase()}</span></div></div>
 <div class="e o" data-k="[ EVENT_02 ] ${D.events[1].tag}"><h2>Every draw <i>wins</i></h2><p>&gt; ${D.events[1].line}</p>
  <div class="cd">${bar(D.events[1].left)} <span>T-${D.events[1].left}D · ENDS ${D.events[1].ends.toUpperCase()}</span></div></div>
</div>
<div class="side"><h4>// TOP_GAINERS_24H</h4>
 ${D.gainers.map(([s, v], i) => `<div class="row"><span class="n">${i + 1}</span><span>${s}</span><span class="up">${pct(v)}</span></div>`).join('')}
 <div class="fg">fear_greed_index:<div class="b">[${'|'.repeat(Math.round(D.fg / 4))}${'.'.repeat(25 - Math.round(D.fg / 4))}] ${D.fg} ${D.fgLabel.toUpperCase()}</div></div>
</div></div></div>`;
};

// ---------- D. Lime block, giant type ----------
const Dd = () => `<style>${FONTS}${BASE}
body{background:#B8F26A;color:#07090B}
.s{position:relative;width:1600px;height:900px;padding:52px 60px 44px;display:flex;flex-direction:column}
.grain{position:absolute;inset:0;background:url(${GRAIN});opacity:.08;mix-blend-mode:multiply}
.top{position:relative;display:flex;justify-content:space-between;align-items:flex-start}
.top img{height:40px}
.top .d{font-family:Unbounded;font-weight:900;font-size:30px;text-align:right;line-height:1}
.top .d span{display:block;font-family:'JetBrains Mono';font-weight:700;font-size:17px;letter-spacing:3px;margin-top:8px}
h1{position:relative;font-family:Unbounded;font-weight:900;font-size:150px;letter-spacing:-7px;line-height:.86;margin-top:24px}
.row{position:relative;display:grid;grid-template-columns:1.25fr 1fr;gap:22px;margin-top:auto}
.e{background:#07090B;color:#F2F4EF;border-radius:26px;padding:30px 34px;display:flex;align-items:flex-end;justify-content:space-between;gap:20px}
.e h3{font-family:'JetBrains Mono';font-weight:800;font-size:16px;letter-spacing:3px;color:#B8F26A}
.e h2{font-family:Unbounded;font-weight:900;font-size:62px;letter-spacing:-2px;line-height:1;margin-top:12px}
.e p{font-size:21px;font-weight:600;margin-top:10px;color:#AEB4AA}
.e .n{flex:none;text-align:center;border:2px solid #B8F26A;border-radius:18px;padding:12px 18px;color:#B8F26A}
.e .n b{display:block;font-family:Unbounded;font-weight:900;font-size:60px;line-height:1}
.e .n span{font-family:'JetBrains Mono';font-weight:700;font-size:14px;letter-spacing:2px}
.e.o h3{color:#FF8A3D}.e.o .n{border-color:#FF8A3D;color:#FF8A3D}
.mk{position:relative;display:flex;justify-content:space-between;margin-top:22px;font-family:'JetBrains Mono';font-size:20px;font-weight:700}
.mk span{opacity:.55;font-weight:500;margin-right:8px}
</style><div class="s"><div class="grain"></div>
<div class="top"><img src="${LOGO_B}"><div class="d">${D.date.toUpperCase()}<span>TODAY ON HOTCOIN</span></div></div>
<h1>Trade.<br>Climb. Win.</h1>
<div class="row">
 <div class="e"><div><h3>${D.events[0].tag}</h3><h2>100,000 USDT</h2><p>${D.events[0].line}</p></div><div class="n"><b>${D.events[0].left}</b><span>DAYS</span></div></div>
 <div class="e o"><div><h3>${D.events[1].tag}</h3><h2>Every draw wins</h2><p>${D.events[1].line}</p></div><div class="n"><b>${D.events[1].left}</b><span>DAYS</span></div></div>
</div>
<div class="mk">
 <div><span>MKT</span>${D.cap} ${pct(D.capCh)}</div><div><span>BTC</span>${D.btc} ${pct(D.btcCh)}</div><div><span>ETH</span>${D.eth} ${pct(D.ethCh)}</div>
 <div><span>F&amp;G</span>${D.fg} ${D.fgLabel}</div><div><span>TOP</span>${D.gainers[0][0]} ${pct(D.gainers[0][1])}</div>
</div></div>`;

const STYLES = {'a-event-hero': A, 'b-light-swiss': B, 'c-terminal': C, 'd-lime-block': Dd};
fs.mkdirSync(OUT, {recursive: true});
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1600, height: 900}, deviceScaleFactor: 1.25});
for (const [name, html] of Object.entries(STYLES)) {
  await page.setContent(`<!doctype html><meta charset="utf-8">${html()}`, {waitUntil: 'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({path: `${OUT}/${name}.png`});
  console.log(name);
}
await browser.close();
