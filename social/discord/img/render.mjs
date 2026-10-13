import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire('/opt/node-tools/node_modules/');
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const OUT = ROOT + '/social/discord/img';
const SCR = process.argv[2];
const LOGO = 'file://' + ROOT + '/hotcoin-tradfi/public/brand/logo-official-black.png';
const GRAIN = 'file://' + ROOT + '/hotcoin-tradfi/public/grain.png';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800;900&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=block');
:root{--ink:#0B0E11;--panel:#F4F5F2;--line:#E3E6E0;--lime:#B8F26A;--green:#2F9E44;--white:#0B0E11;--muted:#6B7280;--blue:#2563EB;--bluet:#EAF0FF}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1080px;background:#fff;color:var(--white);font-family:'Inter Tight',sans-serif;overflow:hidden}
.s{position:relative;width:1080px;height:1080px;padding:60px 64px 48px;display:flex;flex-direction:column}
.bg1{position:absolute;inset:0;background:radial-gradient(70% 50% at 100% 0%,rgba(184,242,106,.30),rgba(184,242,106,0) 70%)}
.bg2{position:absolute;inset:0;background-image:linear-gradient(rgba(11,14,17,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(11,14,17,.045) 1px,transparent 1px);background-size:60px 60px}
.grain{position:absolute;inset:0;background:url(${GRAIN});opacity:.04;mix-blend-mode:multiply}
.top,.foot,.body{position:relative}
.top{display:flex;justify-content:space-between;align-items:center}
.tag{font-family:'JetBrains Mono';font-weight:700;font-size:17px;letter-spacing:3px;color:var(--ink);background:var(--lime);padding:8px 30px 8px 14px;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 100%,0 100%)}
.logo{width:180px}
.body{flex:1;display:flex;flex-direction:column}
.foot{display:flex;justify-content:space-between;font-family:'JetBrains Mono';font-size:16px;color:var(--muted);letter-spacing:1px}
.foot b{color:var(--white);font-weight:500}
h1{font-family:Unbounded;font-weight:900;letter-spacing:-1px;line-height:1.02}
.lime{background:linear-gradient(transparent 58%,var(--lime) 58%,var(--lime) 92%,transparent 92%);padding:0 6px;margin:0 -6px}
.blue{background:linear-gradient(transparent 58%,#BFD3FF 58%,#BFD3FF 92%,transparent 92%);padding:0 6px;margin:0 -6px}
.tag.b{background:var(--blue);color:#fff}
.mono{font-family:'JetBrains Mono'}
`;
const shell = (tag, page, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="s"><div class="bg1"></div><div class="bg2"></div><div class="grain"></div>
<div class="top"><div class="tag ${tag.startsWith('SEPARATE')?'b':''}">${tag}</div><img class="logo" src="${LOGO}"></div>
<div class="body">${body}</div>
<div class="foot"><span><b>discord.gg/hotcoin</b> · all times UTC</span><span>${page}</span></div></div></body></html>`;

// ---------- 1. calendar ----------
const days = [
  {d:'MON',n:12,tag:'DAY 1',t:'Engagement Challenge kicks off',s:'+ Monday AMA & Trading Session',time:'',state:'done'},
  {d:'TUE',n:13,tag:'DAY 2',t:'Crypto Knowledge Quiz',time:'14:00',state:'today'},
  {d:'WED',n:14,tag:'DAY 3',t:'Market Analysis Challenge',time:'14:00'},
  {d:'THU',n:15,tag:'DAY 4',t:'Hotcoin Feature Hunt',time:'14:00'},
  {d:'FRI',n:16,tag:'DAY 5',t:'Crypto Word Scramble',time:'14:00'},
  {d:'SAT',n:17,tag:'DAY 6',t:'Final Quiz & Leaderboard',s:'Top 5 winners announced',time:'14:00'},
  {d:'SUN',n:18,tag:'',t:'Engagement Challenge & tournaments',time:''},
];
const row = (x) => {
  const today = x.state==='today', done = x.state==='done';
  return `<div class="row ${today?'today':''} ${done?'done':''}">
    <div class="date"><span class="dn">${x.d}</span><span class="dd">${x.n}</span></div>
    <div class="ev">
      <div class="evt">${x.tag?`<span class="dtag">${x.tag}</span>`:''}${x.t}${today?'<span class="now">TODAY</span>':''}</div>
      ${x.s?`<div class="evs">${x.s}</div>`:''}
    </div>
    <div class="tm">${done?'<span class="chk">✓ DONE</span>':x.time?`${x.time}`:'—'}</div>
    <div class="gm"><span>20:00</span></div>
  </div>`;
};
const cal = shell('HOTCOIN COMMUNITY · WEEKLY EVENTS','1 / 4',`
<style>
.hd{display:flex;justify-content:space-between;align-items:flex-end;margin:34px 0 22px}
.hd h1{font-size:60px}
.hd .sub{font-family:'JetBrains Mono';font-size:20px;color:var(--muted);text-align:right;line-height:1.5}
.cols{display:grid;grid-template-columns:118px 1fr 120px 120px;padding:0 22px 10px;font-family:'JetBrains Mono';font-size:14px;letter-spacing:2px;color:var(--muted)}
.cols span:nth-child(3),.cols span:nth-child(4){text-align:right}
.rows{display:flex;flex-direction:column;gap:7px}
.row{display:grid;grid-template-columns:118px 1fr 120px 120px;align-items:center;height:78px;padding:0 22px;background:var(--panel);border:1px solid var(--line);border-radius:14px}
.row.done{opacity:.45}
.row.today{background:var(--lime);border-color:var(--lime);color:var(--ink);height:96px;box-shadow:0 10px 40px rgba(120,190,60,.30)}
.date{display:flex;align-items:baseline;gap:10px}
.dn{font-family:'JetBrains Mono';font-weight:700;font-size:16px;letter-spacing:2px;color:var(--muted)}
.dd{font-family:Unbounded;font-weight:800;font-size:34px}
.today .dn{color:var(--ink)}
.evt{font-size:27px;font-weight:700;display:flex;align-items:center;gap:14px}
.evs{font-size:18px;color:var(--muted);margin-top:4px;font-weight:500}
.dtag{font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:var(--green);border:1.5px solid var(--green);border-radius:6px;padding:3px 8px}
.today .dtag{color:var(--ink);border-color:var(--ink)}
.now{font-family:'JetBrains Mono';font-weight:700;font-size:14px;letter-spacing:2px;background:var(--ink);color:var(--lime);border-radius:6px;padding:5px 9px}
.tm,.gm{font-family:'JetBrains Mono';font-weight:700;font-size:26px;text-align:right}
.gm{color:var(--blue)}
.gm span{display:inline-block;background:var(--bluet);border-radius:8px;padding:4px 10px}
.today .gm span{background:#fff}
.chk{font-size:15px;letter-spacing:2px;color:var(--green)}
.legend{margin-top:auto;margin-bottom:22px;display:flex;gap:30px;font-size:19px;color:var(--muted);font-weight:500}
.legend b{color:var(--white);font-weight:600}
.dot{display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:10px;vertical-align:1px}
</style>
<div class="hd"><h1>This week<br>at <span class="lime">Hotcoin</span></h1><div class="sub">OCT 12 – 18, 2026<br>ALL TIMES UTC</div></div>
<div class="cols"><span>DATE</span><span>EVENT</span><span>TIME</span><span style="color:var(--blue)">GAMES</span></div>
<div class="rows">${days.map(row).join('')}</div>
<div class="legend"><span><span class="dot" style="background:var(--green)"></span><b>6-day programme</b> · Engagement Challenge daily</span><span><span class="dot" style="background:var(--blue)"></span><b>Separate:</b> DLS & eFootball, daily 20:00</span></div>
`);

// ---------- 2. engagement + rewards ----------
const eng = shell('HOTCOIN COMMUNITY · EVERY DAY','2 / 4',`
<style>
h1.big{font-size:84px;margin:46px 0 16px}
.lead{font-size:28px;color:var(--muted);font-weight:500;max-width:920px;line-height:1.35}
.list{margin-top:36px;display:flex;flex-direction:column;gap:12px}
.it{display:flex;align-items:center;gap:22px;font-size:30px;font-weight:600;padding:19px 26px;background:var(--panel);border:1px solid var(--line);border-radius:14px}
.box{flex:none;width:40px;height:40px;border-radius:9px;background:var(--lime);color:var(--ink);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:26px}
.it em{font-style:normal;color:var(--green)}
.pool{margin-top:auto;margin-bottom:30px;display:flex;align-items:center;justify-content:space-between;padding:26px 34px;border-radius:18px;background:var(--lime)}
.pool .l{font-family:'JetBrains Mono';font-size:18px;letter-spacing:3px;color:var(--ink);font-weight:700}
.pool .l div{font-family:'Inter Tight';letter-spacing:0;color:var(--white);font-size:30px;margin-top:8px}
.pool .r{font-family:Unbounded;font-weight:900;font-size:96px;color:var(--ink);line-height:1;text-align:right}
.pool .r small{display:block;font-family:'JetBrains Mono';font-size:16px;letter-spacing:3px;font-weight:700;margin-top:8px}
</style>
<h1 class="big">Engagement<br><span class="lime">Challenge</span></h1>
<div class="lead">Stay active all week. Day 6 reviews participation and crowns the top 5.</div>
<div class="list">
 <div class="it"><span class="box">✓</span>Sign up on the Hotcoin platform</div>
 <div class="it"><span class="box">✓</span>Engage with official Hotcoin X posts every week</div>
 <div class="it"><span class="box">✓</span><span>Send <em>50+ meaningful messages</em> a week on Discord</span></div>
 <div class="it"><span class="box">✓</span>Join the community activities</div>
</div>
<div class="pool"><div class="l">WEEKLY REWARDS<div>Top 5 participants · <b>$10 each</b><br><span style="font-size:22px;font-weight:600">paid as Futures vouchers</span></div></div><div class="r">$50<small>FUTURES VOUCHERS</small></div></div>
`);

// ---------- 3. tournaments ----------
const tour = shell('SEPARATE EVENT · MOBILE GAMES','3 / 4',`
<style>
h1.big{font-size:84px;margin:56px 0 18px}
.lead{font-size:28px;color:var(--muted);font-weight:500;line-height:1.35}
.cards{margin-top:44px;display:grid;grid-template-columns:1fr 1fr;gap:22px}
.c{position:relative;padding:34px 32px 30px;border-radius:20px;background:var(--bluet);border:1px solid #D3E0FF;overflow:hidden;height:330px;display:flex;flex-direction:column}
.c .k{font-family:'JetBrains Mono';font-size:16px;letter-spacing:3px;color:var(--blue);font-weight:700}
.c .n{font-family:Unbounded;font-weight:900;font-size:58px;margin-top:14px;line-height:1}
.c .f{font-size:22px;color:var(--muted);margin-top:12px;font-weight:500}
.c .p{margin-top:auto;display:flex;align-items:baseline;gap:14px}
.c .p b{font-family:Unbounded;font-weight:900;font-size:64px;color:var(--blue)}
.c .p span{font-size:21px;font-weight:600;line-height:1.25}
.c .pitch{position:absolute;right:-40px;top:-40px;width:220px;height:220px;border:2px solid rgba(37,99,235,.16);border-radius:50%}
.c .pitch:after{content:'';position:absolute;left:50%;top:50%;width:70px;height:70px;margin:-35px;border:2px solid rgba(37,99,235,.16);border-radius:50%}
.when{margin-top:auto;margin-bottom:30px;display:flex;align-items:center;gap:28px;padding:24px 32px;border-radius:18px;background:var(--blue);color:#fff}
.when .t{font-family:'JetBrains Mono';font-weight:700;font-size:58px;letter-spacing:-1px}
.when .d{font-size:26px;font-weight:700;line-height:1.3}
.when .d span{display:block;font-weight:500;font-size:21px;opacity:.75}
</style>
<h1 class="big">Game<br><span class="blue">Tournaments</span></h1>
<div class="lead">Challenge fellow Hotcoiners and fight for the title.</div>
<div class="cards">
 <div class="c"><div class="pitch"></div><div class="k">TOURNAMENT 01</div><div class="n">DLS</div><div class="f">Dream League Soccer</div><div class="p"><b>$10</b><span>Futures voucher<br>to the winner</span></div></div>
 <div class="c"><div class="pitch"></div><div class="k">TOURNAMENT 02</div><div class="n">eFootball</div><div class="f">Mobile football</div><div class="p"><b>$10</b><span>Futures voucher<br>to the winner</span></div></div>
</div>
<div class="when"><div class="t">20:00</div><div class="d">Every day, UTC, until the tournament ends<span>Registration & match rules announced separately</span></div></div>
`);

// ---------- 4. today ----------
const today = shell('HOTCOIN COMMUNITY · TODAY','4 / 4',`
<style>
.k{margin-top:70px;font-family:'JetBrains Mono';font-size:22px;letter-spacing:4px;color:var(--green);font-weight:700}
h1.big{font-size:104px;margin:22px 0 0;line-height:.98}
.time{margin-top:56px;display:flex;align-items:center;gap:30px}
.time .t{font-family:'JetBrains Mono';font-weight:700;font-size:150px;line-height:1;color:var(--green);letter-spacing:-4px}
.time .u{font-size:28px;font-weight:600;line-height:1.35;color:var(--muted)}
.time .u b{color:var(--ink);display:block;font-size:34px}
.chips{margin-top:52px;display:flex;flex-wrap:wrap;gap:14px}
.chip{font-size:26px;font-weight:600;padding:14px 24px;border-radius:999px;border:1.5px solid var(--line);background:var(--panel)}
.prog{margin-top:auto;margin-bottom:30px}
.prog .bar{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
.prog .bar div{height:14px;border-radius:7px;background:var(--line)}
.prog .bar .on{background:var(--green)}
.prog .lbl{display:flex;justify-content:space-between;margin-top:14px;font-family:'JetBrains Mono';font-size:17px;color:var(--muted);letter-spacing:2px}
</style>
<div class="k">DAY 2 · TUESDAY, OCT 13</div>
<h1 class="big">Crypto<br>Knowledge <span class="lime">Quiz</span></h1>
<div class="time"><div class="t">14:00</div><div class="u"><b>UTC today</b>right here on Discord</div></div>
<div class="chips"><span class="chip">Crypto</span><span class="chip">Blockchain</span><span class="chip">Spot trading</span><span class="chip">Futures trading</span></div>
<div class="prog"><div class="bar"><div class="on"></div><div class="on"></div><div></div><div></div><div></div><div></div></div><div class="lbl"><span>DAY 1</span><span>WEEKLY PROGRESS</span><span>DAY 6 · TOP 5</span></div></div>
`);

const slides = [['01-weekly-calendar',cal],['02-engagement-challenge',eng],['03-game-tournaments',tour],['04-today-day2-quiz',today]];
const browser = await chromium.launch();
const page = await browser.newPage({viewport:{width:1080,height:1080}});
for (const [name, html] of slides) {
  const f = `${SCR}/${name}.html`; fs.writeFileSync(f, html);
  await page.goto('file://' + f, {waitUntil:'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({path:`${OUT}/${name}.png`});
  console.log('ok', name);
}
await browser.close();
