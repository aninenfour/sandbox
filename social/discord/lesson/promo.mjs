// Weekly Discord trading lesson promo (EN + CN), 1080x1080, white Hotcoin style.
// Run: PW_PATH=$(npm root -g)/playwright node promo.mjs <scratch-dir>
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const OUT = ROOT + '/social/discord/lesson';
const SCR = process.argv[2];
const LOGO = 'file://' + ROOT + '/hotcoin-tradfi/public/brand/logo-official-black.png';
const HOST = 'file://' + OUT + '/mellst-host.png';
const DP = 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z';
const dc = (s, c) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" style="flex:none"><path fill="${c}" d="${DP}"/></svg>`;

const T = {
  en: {
    tag: 'HOTCOIN DISCORD · WEEKLY LESSON', h1: 'Trading Lesson<br>with <span class="hl">Mellst</span>',
    lead: 'Learn live, watch real trades and win trial vouchers.',
    prize: '5 lucky viewers', amt: '$5', amtNote: 'trial voucher each', up: '<b>$10</b>', upK: 'UPGRADE', upT: 'if your UID traded on Hotcoin<br>in the last 7 days',
    howT: 'HOW TO WIN',
    how: ['Join the live lesson in <b>Hotcoin Stage</b>', 'Have a valid <b>Hotcoin UID</b>', 'Post your screenshot on X and tag <b>@hotcoinglobal</b>'],
    host: 'HOST', fine: 'Winners picked at random by the host. Vouchers land within 48 working hours, are valid 48 h, and positions auto-close within 24 h.',
    bar: 'Every week · tune in', font: "'Inter Tight'", hfont: 'Unbounded', hsize: 76,
  },
  cn: {
    tag: 'HOTCOIN DISCORD · 每周交易课堂', h1: 'Mellst<br><span class="hl">交易课堂</span>',
    lead: '直播学交易，看实盘演示，赢取合约体验金。',
    prize: '5 位幸运观众', amt: '5 USDT', amtNote: '体验金 / 人', up: '<b>10 USDT</b>', upK: '升级', upT: '近 7 天在 Hotcoin<br>有交易记录的 UID',
    howT: '参与方式',
    how: ['在 <b>Hotcoin Stage</b> 参加直播课程', '拥有有效的 <b>Hotcoin UID</b>', '在 X 发布参与截图并 <b>@hotcoinglobal</b>'],
    host: '主讲人', fine: '获奖者由主讲人随机抽取。体验金于 48 个工作小时内发放，有效期 48 小时，仓位将在 24 小时内自动平仓。',
    bar: '每周举行 · 不见不散', font: "'Noto Sans SC'", hfont: "'Noto Sans SC'", hsize: 92,
  },
};

const page = (L) => `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@800;900&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+SC:wght@500;700;900&display=block');
:root{--ink:#0B0E11;--panel:#F4F5F2;--line:#E3E6E0;--lime:#B8F26A;--green:#2F9E44;--muted:#6B7280;--blurple:#5865F2}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1080px;background:#fff;color:var(--ink);font-family:${L.font},'Noto Sans SC',sans-serif;overflow:hidden}
.s{position:relative;width:1080px;height:1080px;padding:60px 64px 48px;display:flex;flex-direction:column}
.bg1{position:absolute;inset:0;background:radial-gradient(70% 50% at 100% 0%,rgba(184,242,106,.30),rgba(184,242,106,0) 70%)}
.bg2{position:absolute;inset:0;background-image:linear-gradient(rgba(11,14,17,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(11,14,17,.045) 1px,transparent 1px);background-size:60px 60px}
.top,.body{position:relative}
.top{display:flex;justify-content:space-between;align-items:center}
.tag{font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:17px;letter-spacing:3px;color:var(--ink);background:var(--lime);padding:8px 30px 8px 14px;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 100%,0 100%)}
.logo{width:180px}
.body{flex:1;display:flex;flex-direction:column}
h1{font-family:${L.hfont},'Noto Sans SC';font-weight:900;font-size:${L.hsize}px;line-height:1.04;letter-spacing:-1px;margin-top:38px}
.hl{background:linear-gradient(transparent 58%,var(--lime) 58%,var(--lime) 92%,transparent 92%);padding:0 6px;margin:0 -6px}
.lead{font-size:27px;color:var(--muted);font-weight:500;margin-top:16px}
.row{display:flex;gap:24px;margin-top:30px}
.left{flex:1;display:flex;flex-direction:column;gap:18px}
.prize{background:var(--lime);border-radius:18px;padding:22px 26px}
.prize .k{font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:16px;letter-spacing:2px}
.prize .a{display:flex;align-items:baseline;gap:14px;margin-top:6px}
.prize .a b{font-family:Unbounded,'Noto Sans SC';font-weight:900;font-size:66px;line-height:1}
.prize .a span{font-size:22px;font-weight:700}
.up{display:flex;align-items:center;gap:16px;margin-top:16px;background:var(--ink);color:#fff;border-radius:14px;padding:14px 18px;box-shadow:0 8px 22px rgba(11,14,17,.25)}
.cr{flex:none;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#FFE27A,#F5B700);display:flex;align-items:center;justify-content:center;font-size:32px;box-shadow:0 0 0 3px rgba(255,214,77,.35)}
.ut{flex:1}
.uk{font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:14px;letter-spacing:3px;color:#FFD54D}
.uv{font-size:18px;font-weight:600;line-height:1.3;margin-top:3px;color:#E9ECEF}
.ua b{font-family:Unbounded,'Noto Sans SC';font-weight:900;font-size:44px;color:#FFD54D;white-space:nowrap}
.how{background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:20px 24px}
.host{align-self:stretch}
.how .k{font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:15px;letter-spacing:2px;color:var(--green)}
.st{display:flex;align-items:center;gap:14px;font-size:21px;font-weight:500;margin-top:12px;line-height:1.3}
.n{flex:none;width:34px;height:34px;border-radius:50%;background:var(--ink);color:var(--lime);font-family:'JetBrains Mono';font-weight:700;font-size:17px;display:flex;align-items:center;justify-content:center}
.host{flex:none;width:300px;border-radius:20px;overflow:hidden;background:#000;position:relative;box-shadow:0 16px 40px rgba(11,14,17,.25)}
.host img{width:100%;height:100%;object-fit:cover;object-position:50% 30%;display:block}
.host .lb{position:absolute;left:14px;top:14px;font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:14px;letter-spacing:2px;background:var(--lime);color:var(--ink);border-radius:6px;padding:4px 9px}
.fine{font-size:15px;color:var(--muted);margin-top:auto;margin-bottom:16px;line-height:1.45}
.bar{position:relative;display:flex;align-items:center;justify-content:space-between;background:var(--blurple);color:#fff;border-radius:16px;padding:18px 26px}
.bar .l{display:flex;align-items:center;gap:14px;font-size:26px;font-weight:700}
.bar .r{font-family:'JetBrains Mono';font-weight:700;font-size:24px}
</style></head><body><div class="s"><div class="bg1"></div><div class="bg2"></div>
<div class="top"><div class="tag">${L.tag}</div><img class="logo" src="${LOGO}"></div>
<div class="body">
 <h1>${L.h1}</h1>
 <div class="lead">${L.lead}</div>
 <div class="row">
  <div class="left">
   <div class="prize"><div class="k">${L.prize}</div><div class="a"><b>${L.amt}</b><span>${L.amtNote}</span></div><div class="up"><span class="cr">👑</span><div class="ut"><div class="uk">${L.upK}</div><div class="uv">${L.upT}</div></div><div class="ua">${L.up}</div></div></div>
   <div class="how"><div class="k">${L.howT}</div>${L.how.map((h, i) => `<div class="st"><span class="n">${i + 1}</span><span>${h}</span></div>`).join('')}</div>
  </div>
  <div class="host"><img src="${HOST}"><span class="lb">${L.host} · MELLST</span></div>
 </div>
 <div class="fine">${L.fine}</div>
 <div class="bar"><span class="l">${dc(34, '#fff')}${L.bar}</span><span class="r">discord.gg/hotcoin</span></div>
</div></div></body></html>`;

const browser = await chromium.launch();
const p = await browser.newPage({viewport: {width: 1080, height: 1080}});
for (const k of ['en', 'cn']) {
  const f = `${SCR}/lesson-${k}.html`; fs.writeFileSync(f, page(T[k]));
  await p.goto('file://' + f, {waitUntil: 'networkidle'});
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({path: `${OUT}/trading-lesson-${k}.png`});
  console.log('ok', k);
}
await browser.close();
