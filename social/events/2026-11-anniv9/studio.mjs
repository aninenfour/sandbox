// "Studio" key visual (OKX-like premium monochrome): sculpted chrome 9, lime glass coin, spotlight, grain. 1600x900 @2x, EN + ZH.
// Run: PW_PATH=$(npm root -g)/playwright node social/events/2026-11-anniv9/studio.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/events/2026-11-anniv9';
const BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const LIME = '#B8F26A';
const T = {
  en: {k: '9TH ANNIVERSARY RELAY · ROUND 01', h: 'Newcomer<br>Kickoff.', s: 'Register. Verify. Trade.', up: 'Up to', u: 'USDT', lucky: '+ 9 × 99 USDT lucky draw, just register', cta: 'Join now', d: 'NOV 6 – NOV 16 · 23:59 UTC+8', pool: '19,999 USDT POOL',
    fine: 'NEW USERS VIA THE EVENT LINK ONLY. ONE UID PER PERSON. TIERS 1 AND 2 DO NOT STACK. FIRST-TRADE TASK COUNTS REAL FUNDS ONLY. REWARDS SENT AFTER THE EVENT AND REVIEW. FUTURES TRADING IS HIGH RISK. NOT FINANCIAL ADVICE. HOTCOIN RESERVES THE RIGHT OF FINAL INTERPRETATION.'},
  zh: {k: '9周年狂欢接力赛 · 第一棒', h: '新人<br>起跑礼', s: '注册 · 认证 · 交易', up: '最高可拿', u: 'USDT', lucky: '+ 注册即抽 9 × 99 USDT 合约体验金', cta: '立即参与', d: '11/6 — 11/16 23:59 UTC+8', pool: '19,999 USDT 福利池',
    fine: '仅限活动期间通过指定链接注册的新用户，每人限一个 UID。第 1、2 档不叠加。首单任务仅统计真实资金。奖励于活动结束审核后发放。合约交易风险较高，不构成投资建议。HOTCOIN 保留最终解释权。'},
};
const page = (t, zh) => `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+SC:wght@500;700;900&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1600px;height:900px;overflow:hidden;position:relative;background:#050606;font-family:'Inter Tight','Noto Sans SC',sans-serif;color:#F2F3EF}
.m{font-family:'JetBrains Mono','Noto Sans SC',monospace}
</style></head><body>
<!-- spotlight + horizon -->
<div style="position:absolute;left:640px;top:-380px;width:1100px;height:1100px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.16),rgba(255,255,255,0) 62%)"></div>
<div style="position:absolute;left:300px;top:640px;width:1800px;height:700px;border-radius:50%;border-top:1.5px solid rgba(255,255,255,.18);background:radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.10),rgba(0,0,0,0) 45%)"></div>
<!-- faint grid -->
<div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:80px 80px;mask-image:radial-gradient(ellipse 60% 70% at 70% 45%,#000,transparent)"></div>

<!-- sculpted 9 -->
<div style="position:absolute;left:1000px;top:700px;width:640px;height:200px;border-radius:50%;background:radial-gradient(ellipse,rgba(0,0,0,.85),rgba(0,0,0,0) 70%)"></div>
<svg width="1600" height="900" style="position:absolute;inset:0">
  <defs>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#E9EAE6"/><stop offset=".22" stop-color="#5E615E"/><stop offset=".45" stop-color="#141515"/>
      <stop offset=".62" stop-color="#8C8F8B"/><stop offset=".78" stop-color="#202121"/><stop offset="1" stop-color="#0A0B0B"/>
    </linearGradient>
    <filter id="bevel" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="14" result="b"/>
      <feSpecularLighting in="b" surfaceScale="9" specularConstant=".9" specularExponent="22" lighting-color="#ffffff" result="s">
        <feDistantLight azimuth="235" elevation="38"/></feSpecularLighting>
      <feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>
      <feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".55" k4="0"/>
    </filter>
    <filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="40"/></filter>
  </defs>
  <text x="980" y="790" font-family="Inter Tight" font-weight="800" font-size="980" letter-spacing="-40" fill="url(#chrome)" filter="url(#bevel)">9</text>
</svg>
<!-- frosted glass slab over the lower part of the 9 -->
<div style="position:absolute;left:1330px;top:0;width:270px;height:900px;background:linear-gradient(90deg,rgba(255,255,255,.10),rgba(255,255,255,.03));backdrop-filter:blur(22px) brightness(1.15);border-left:1.5px solid rgba(255,255,255,.28)"></div>
<!-- lime glass coin -->
<div style="position:absolute;left:805px;top:225px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(184,242,106,.32),rgba(184,242,106,0) 65%)"></div>
<div style="position:absolute;left:880px;top:300px;width:250px;height:250px;border-radius:50%;
  background:radial-gradient(circle at 34% 28%,#F4FFE0 0%,#CFF79A 16%,#B8F26A 36%,#6FA62A 72%,#2C470C 100%);
  box-shadow:0 40px 80px rgba(0,0,0,.6), inset -18px -24px 40px rgba(20,40,0,.45), inset 10px 14px 30px rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center">
  <img src="${BR}symbol-official-white.png" style="width:118px;filter:brightness(0) opacity(.86);transform:translate(4px,4px)">
  <div style="position:absolute;left:40px;top:28px;width:110px;height:60px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,255,255,.75),rgba(255,255,255,0) 70%);transform:rotate(-24deg)"></div>
</div>
<!-- copy -->
<img src="${BR}logo-official-white.png" style="position:absolute;left:84px;top:78px;height:36px">
<div class="m" style="position:absolute;left:84px;top:200px;font-size:18px;letter-spacing:3px;color:${LIME}">${t.k}</div>
<div style="position:absolute;left:84px;top:240px;font-weight:${zh ? 900 : 700};font-size:${zh ? 118 : 112}px;line-height:${zh ? 1.06 : .94};letter-spacing:${zh ? 4 : -5}px">${t.h}</div>
<div style="position:absolute;left:84px;top:${zh ? 520 : 500}px;font-size:30px;font-weight:500;color:rgba(242,243,239,.65);letter-spacing:${zh ? 4 : -.5}px">${t.s}</div>
<div style="position:absolute;left:84px;top:${zh ? 572 : 552}px;display:flex;align-items:baseline;gap:16px">
  <div style="font-size:${zh ? 34 : 32}px;font-weight:600;color:rgba(242,243,239,.8)">${t.up}</div>
  <div style="font-size:132px;font-weight:800;letter-spacing:-6px;line-height:1;background:linear-gradient(180deg,#FFFFFF,#9EA19C);-webkit-background-clip:text;color:transparent">18</div>
  <div style="font-size:40px;font-weight:700">${t.u}</div>
</div>
<div style="position:absolute;left:84px;top:${zh ? 718 : 700}px;font-size:${zh ? 24 : 22}px;font-weight:600;color:${LIME}">${t.lucky}</div>
<div style="position:absolute;left:84px;bottom:94px;display:flex;align-items:center;gap:22px">
  <div style="font-size:${zh ? 25 : 23}px;font-weight:700;background:#F2F3EF;color:#050606;padding:15px 34px;border-radius:999px">${t.cta}</div>
  <div class="m" style="font-size:16px;letter-spacing:2.5px;color:rgba(242,243,239,.55);line-height:1.7">${t.d}<br>${t.pool}</div>
</div>
<div class="m" style="position:absolute;left:84px;right:84px;bottom:30px;font-size:${zh ? 12 : 11}px;line-height:1.5;letter-spacing:.6px;color:rgba(242,243,239,.32)">${t.fine}</div>
<!-- grain -->
<div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.05) 1px,transparent 1.2px);background-size:4px 4px;opacity:.6;pointer-events:none"></div>
</body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({viewport: {width: 1600, height: 900}, deviceScaleFactor: 2});
const pg = await ctx.newPage();
for (const [n, t, zh] of [['kv-studio-en', T.en, false], ['kv-studio-zh', T.zh, true]]) {
  const f = `${DIR}/_${n}.html`; fs.writeFileSync(f, page(t, zh));
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({path: `${DIR}/${n}.png`}); fs.unlinkSync(f);
}
await browser.close(); console.log('done');
