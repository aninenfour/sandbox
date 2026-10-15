// One-page visual calendar, Oct 19 - Nov 15 2026 (1920x1080).
// Run: PW_PATH=$(npm root -g)/playwright node onepager.mjs <scratch-dir>
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const OUT = ROOT + '/social/plan';
const LOGO = 'file://' + ROOT + '/hotcoin-tradfi/public/brand/logo-official-black.png';

const LANG = process.argv[3] || 'en';
const S = {
 en: {tag:'HOTCOIN · MARKETING CALENDAR', h1:'Oct 19 – Nov 15, <span class="hl">2026</span>', wd:['MON','TUE','WED','THU','FRI','SAT','SUN'], mo:['OCT','NOV'],
  ev:{'10-19':[['go','🎃 Halloween starts']],'10-21':[['mk','TSLA earnings*']],'10-27':[['mk','FOMC day 1']],'10-28':[['mk','Fed decision']],'10-29':[['mk','AAPL · AMZN earnings*']],'10-31':[['hw','🎃 Halloween'],['mk','BTC whitepaper turns 18']],'11-01':[['rt','Teaser 1'],['hd','Moonvember']],'11-02':[['rt','Teaser 2']],'11-03':[['rt','Teaser 3'],['mk','US midterms']],'11-04':[['rt','Teaser 4']],'11-05':[['rv','REVEAL · TBC']],'11-06':[['mk','US jobs report']],'11-08':[['hd','Diwali']],'11-11':[['hd','11.11']]},
  c1k:'🎃 OCT 19–31 · MAIN THEME', c1t:'Halloween: start light, peak on Oct 31', c1b:'No Ronaldinho elements in October. Ronaldinho reveal never on Halloween day.',
  c2k:'⚽ NOV 1–5 · RONALDINHO', c2t:'4 teaser days → reveal ~Nov 5', c2b:'Landing page, media release, our posts, bios / pins and his post go live together. Official Brazil-shoot creatives only.',
  c3k:'ALWAYS ON · EVERY WEEK', c3b:'<b>X giveaways</b> · 2 themed + 1 new users only ($100 each)<br><b>Meta ads</b> · Brazil, PT + EN, football + investing interests (ChatGPT ads test, TG explore)<br><b>Discord</b> · 6 daily events, 2 weekly games, live trading sessions',
  bk:'WEEKLY VOUCHER BUDGET', bt:'X $300 · Discord $70 · trading lesson ≤ $70', ak:'OPEN · NEEDED BEFORE NOV 1', at:'Final Ronaldinho reveal date and whether he posts on his side',
  lg:['Halloween','Ronaldinho teasers','Reveal','Market dates','Holidays'], foot:'* earnings dates estimated until confirmed · all vouchers = futures trial vouchers', h1font:'Unbounded', out:'calendar-onepager.png'},
 cn: {tag:'HOTCOIN · 营销日程', h1:'10月19日 – 11月15日，<span class="hl">2026</span>', wd:['周一','周二','周三','周四','周五','周六','周日'], mo:['10月','11月'],
  ev:{'10-19':[['go','🎃 万圣节开始']],'10-21':[['mk','特斯拉财报*']],'10-27':[['mk','美联储会议首日']],'10-28':[['mk','美联储议息决议']],'10-29':[['mk','苹果 · 亚马逊财报*']],'10-31':[['hw','🎃 万圣节'],['mk','比特币白皮书 18 周年']],'11-01':[['rt','预热 1'],['hd','Moonvember']],'11-02':[['rt','预热 2']],'11-03':[['rt','预热 3'],['mk','美国中期选举']],'11-04':[['rt','预热 4']],'11-05':[['rv','官宣 · 待确认']],'11-06':[['mk','美国非农数据']],'11-08':[['hd','排灯节']],'11-11':[['hd','双十一']]},
  c1k:'🎃 10/19–10/31 · 主题', c1t:'万圣节：轻度开启，10/31 达到高峰', c1b:'10 月不出现小罗元素。小罗官宣不安排在万圣节当天。',
  c2k:'⚽ 11/1–11/5 · 小罗', c2t:'4 天预热 → 约 11/5 官宣', c2b:'落地页、媒体新闻稿、我方帖子、简介 / 置顶及其本人帖子同步上线。仅使用巴西官方拍摄素材。',
  c3k:'每周常规', c3b:'<b>X 抽奖</b> · 2 场主题 + 1 场新用户专属（每场 $100）<br><b>Meta 广告</b> · 巴西，葡语 + 英语，足球 + 投资兴趣人群（ChatGPT 广告测试，TG 探索）<br><b>Discord</b> · 6 项每日活动、每周 2 场游戏、直播交易课堂',
  bk:'每周体验金预算', bt:'X $300 · Discord $70 · 交易课堂 ≤ $70', ak:'待确认 · 11/1 前需要', at:'小罗最终官宣日期，以及他本人是否发帖',
  lg:['万圣节','小罗预热','官宣','市场日期','节日'], foot:'* 财报日期为预计，以公司公告为准 · 所有奖励均为合约体验金', h1font:"'Noto Sans SC'", out:'calendar-onepager-cn.png'},
}[LANG];

// phase: h = Halloween, t = Ronaldinho teaser, r = reveal, s = Ronaldinho sustain
const start = new Date(Date.UTC(2026, 9, 19));
const ev = S.ev;
const phase = (m, d) => (m === 10 ? 'h' : d <= 4 ? 't' : d === 5 ? 'r' : 's');
let cells = '';
for (let i = 0; i < 28; i++) {
  const dt = new Date(start.getTime() + i * 864e5);
  const m = dt.getUTCMonth() + 1, d = dt.getUTCDate();
  const key = `${m}-${String(d).padStart(2, '0')}`;
  const p = phase(m, d);
  const chips = (ev[key] || []).map(([k, t]) => `<span class="c ${k}">${t}</span>`).join('');
  const mo = (d === 1 || i === 0) ? `<span class="mo">${m === 10 ? S.mo[0] : S.mo[1]}</span>` : '';
  cells += `<div class="d ${p}"><div class="n">${mo}${d}</div>${chips}</div>`;
}

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@800;900&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+SC:wght@500;700;900&display=block');
:root{--ink:#0B0E11;--lime:#B8F26A;--green:#2F9E44;--muted:#6B7280;--line:#E3E6E0;--panel:#F4F5F2;--or:#FF7A1A;--ort:#FFF1E4;--blue:#2563EB;--bt:#EAF0FF;--pu:#7C3AED;--pt:#F1EAFE}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1920px;height:1080px;background:#fff;color:var(--ink);font-family:'Inter Tight','Noto Sans SC','Noto Color Emoji',sans-serif;overflow:hidden}
.s{position:relative;width:100%;height:100%;padding:52px 64px 44px;display:flex;flex-direction:column}
.bg{position:absolute;inset:0;background:radial-gradient(50% 45% at 100% 0%,rgba(184,242,106,.28),rgba(184,242,106,0) 70%),linear-gradient(rgba(11,14,17,.035) 1px,transparent 1px) 0 0/60px 60px,linear-gradient(90deg,rgba(11,14,17,.035) 1px,transparent 1px) 0 0/60px 60px}
.top,.main,.foot{position:relative}
.top{display:flex;align-items:flex-end;justify-content:space-between}
.tag{display:inline-block;font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:16px;letter-spacing:3px;background:var(--lime);padding:7px 28px 7px 12px;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 100%,0 100%)}
h1{font-family:${S.h1font},'Noto Sans SC';font-weight:900;font-size:58px;letter-spacing:-1px;margin-top:16px;line-height:1}
.hl{background:linear-gradient(transparent 58%,var(--lime) 58%,var(--lime) 92%,transparent 92%);padding:0 6px;margin:0 -6px}
.logo{width:190px;margin-bottom:8px}
.main{flex:1;display:flex;gap:28px;margin-top:30px;min-height:0}
.cal{flex:1;display:flex;flex-direction:column}
.wd{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:14px;letter-spacing:2px;color:var(--muted);padding:0 4px 8px}
.grid{flex:1;display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(4,1fr);gap:8px}
.d{border-radius:12px;padding:10px 11px;display:flex;flex-direction:column;gap:5px;border:1px solid var(--line);min-width:0}
.d .n{font-family:Unbounded;font-weight:800;font-size:24px;display:flex;align-items:baseline;gap:6px}
.d .mo{font-family:'JetBrains Mono','Noto Sans SC';font-size:12px;letter-spacing:2px;font-weight:700;color:var(--muted)}
.d.h{background:var(--ort);border-color:#FFD9B8}
.d.t{background:#EEF9DD;border-color:#CFEBA6}
.d.s{background:#F7FBF0;border-color:#E3F0D0}
.d.r{background:var(--ink);border-color:var(--ink);color:#fff;box-shadow:0 10px 30px rgba(11,14,17,.25)}
.d.r .mo{color:var(--lime)}
.c{font-size:14px;font-weight:700;border-radius:6px;padding:3px 8px;align-self:flex-start;max-width:100%;line-height:1.25}
.c.go{background:var(--or);color:#fff}
.c.hw{background:var(--or);color:#fff;font-size:15px}
.c.mk{background:var(--bt);color:var(--blue)}
.c.hd{background:var(--pt);color:var(--pu)}
.c.rt{background:var(--green);color:#fff}
.c.rv{background:var(--lime);color:var(--ink);font-size:16px}
.ph{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-top:10px;font-family:'JetBrains Mono';font-weight:700;font-size:13px;letter-spacing:1.5px}
.ph div{border-radius:8px;padding:7px 10px}
.side{width:500px;display:flex;flex-direction:column;gap:14px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:16px 20px}
.card .k{font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:13px;letter-spacing:2px;color:var(--green)}
.card .t{font-size:21px;font-weight:700;margin-top:6px}
.card .b{font-size:16px;color:#374151;margin-top:5px;line-height:1.4}
.ask{background:var(--ink);color:#fff;border-radius:16px;padding:16px 20px}
.ask .k{font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:13px;letter-spacing:2px;color:var(--lime)}
.ask .t{font-size:20px;font-weight:700;margin-top:6px;line-height:1.35}
.bud{display:flex;align-items:center;justify-content:space-between;background:var(--lime);border-radius:16px;padding:14px 20px}
.bud .k{font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:13px;letter-spacing:2px}
.bud .t{font-size:15px;font-weight:600;margin-top:4px}
.bud b{font-family:Unbounded;font-weight:900;font-size:44px}
.foot{display:flex;justify-content:space-between;align-items:center;margin-top:16px;font-size:14px;color:var(--muted)}
.lg{display:flex;gap:18px;align-items:center}
.lg span{display:inline-flex;align-items:center;gap:7px}
.sw{width:14px;height:14px;border-radius:4px;display:inline-block}
</style></head><body><div class="s"><div class="bg"></div>
<div class="top"><div><span class="tag">${S.tag}</span><h1>${S.h1}</h1></div><img class="logo" src="${LOGO}"></div>
<div class="main">
 <div class="cal">
  <div class="wd">${S.wd.map(x => `<span>${x}</span>`).join('')}</div>
  <div class="grid">${cells}</div>
 </div>
 <div class="side">
  <div class="card"><div class="k">${S.c1k}</div><div class="t">${S.c1t}</div><div class="b">${S.c1b}</div></div>
  <div class="card"><div class="k">${S.c2k}</div><div class="t">${S.c2t}</div><div class="b">${S.c2b}</div></div>
  <div class="card"><div class="k">${S.c3k}</div><div class="b">${S.c3b}</div></div>
  <div class="bud"><div><div class="k">${S.bk}</div><div class="t">${S.bt}</div></div><b>$440</b></div>
  <div class="ask"><div class="k">${S.ak}</div><div class="t">${S.at}</div></div>
 </div>
</div>
<div class="foot"><div class="lg">
 <span><i class="sw" style="background:#FFD9B8"></i>${S.lg[0]}</span>
 <span><i class="sw" style="background:#CFEBA6"></i>${S.lg[1]}</span>
 <span><i class="sw" style="background:var(--ink)"></i>${S.lg[2]}</span>
 <span><i class="sw" style="background:var(--bt);border:1px solid #BFD3FF"></i>${S.lg[3]}</span>
 <span><i class="sw" style="background:var(--pt);border:1px solid #D9C6FB"></i>${S.lg[4]}</span>
</div><span>${S.foot}</span></div>
</div></body></html>`;

const f = process.argv[2] + `/onepager-${LANG}.html`; fs.writeFileSync(f, html);
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
await page.goto('file://' + f, {waitUntil: 'networkidle'});
await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
await page.screenshot({path: OUT + '/' + S.out});
await browser.close(); console.log('ok');
