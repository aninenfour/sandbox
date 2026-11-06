// Hybrid key visual: Canva-generated 3D art (kv-canva-en.png, right side) + Hotcoin typography and logo. 1600x900 @2x, EN + ZH.
// Canva design: DAHaG-svOWA (generated Nov 6, 2026). Its own left-side text is masked out.
// Run: PW_PATH=$(npm root -g)/playwright node social/events/2026-11-anniv9/hybrid.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/events/2026-11-anniv9';
const BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const LIME = '#B8F26A';
const T = {
  en: {k: '9TH ANNIVERSARY RELAY · ROUND 01', h: 'Newcomer<br>Kickoff.', s: 'Register. Verify. Trade.', up: 'Up to', lucky: '+ 9 × 99 USDT lucky draw, just register', cta: 'Join now', d: 'NOV 6 – NOV 16 · 23:59 UTC+8', pool: '19,999 USDT POOL',
    fine: 'NEW USERS VIA THE EVENT LINK ONLY · ONE UID PER PERSON · TIERS 1 AND 2 DO NOT STACK · REWARDS SENT AFTER REVIEW · FUTURES TRADING IS HIGH RISK · NOT FINANCIAL ADVICE'},
  zh: {k: '9周年狂欢接力赛 · 第一棒', h: '新人<br>起跑礼', s: '注册 · 认证 · 交易', up: '最高可拿', lucky: '+ 注册即抽 9 × 99 USDT 合约体验金', cta: '立即参与', d: '11/6 — 11/16 23:59 UTC+8', pool: '19,999 USDT 福利池',
    fine: '仅限通过指定链接注册的新用户 · 每人限一个 UID · 第 1、2 档不叠加 · 审核后发放奖励 · 合约交易风险较高 · 不构成投资建议'},
};
const page = (t, zh) => `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+SC:wght@500;700;900&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1600px;height:900px;overflow:hidden;position:relative;background:#000;font-family:'Inter Tight','Noto Sans SC',sans-serif;color:#F2F3EF}
.m{font-family:'JetBrains Mono','Noto Sans SC',monospace}
</style></head><body>
<img src="file://${DIR}/kv-canva-en.png" style="position:absolute;left:60px;top:0;width:1600px;height:900px">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,#000 0,#000 820px,rgba(0,0,0,0) 930px)"></div>
<img src="${BR}logo-official-white.png" style="position:absolute;left:84px;top:78px;height:36px">
<div class="m" style="position:absolute;left:84px;top:200px;font-size:18px;letter-spacing:3px;color:${LIME}">${t.k}</div>
<div style="position:absolute;left:84px;top:240px;font-weight:${zh ? 900 : 700};font-size:${zh ? 118 : 112}px;line-height:${zh ? 1.06 : .94};letter-spacing:${zh ? 4 : -5}px">${t.h}</div>
<div style="position:absolute;left:84px;top:${zh ? 520 : 500}px;font-size:30px;font-weight:500;color:rgba(242,243,239,.65);letter-spacing:${zh ? 4 : -.5}px">${t.s}</div>
<div style="position:absolute;left:84px;top:${zh ? 572 : 552}px;display:flex;align-items:baseline;gap:16px">
  <div style="font-size:${zh ? 34 : 32}px;font-weight:600;color:rgba(242,243,239,.8)">${t.up}</div>
  <div style="font-size:132px;font-weight:800;letter-spacing:-6px;line-height:1;background:linear-gradient(180deg,#FFFFFF,#9EA19C);-webkit-background-clip:text;color:transparent">18</div>
  <div style="font-size:40px;font-weight:700">USDT</div>
</div>
<div style="position:absolute;left:84px;top:${zh ? 718 : 700}px;font-size:${zh ? 24 : 22}px;font-weight:600;color:${LIME}">${t.lucky}</div>
<div style="position:absolute;left:84px;bottom:94px;display:flex;align-items:center;gap:22px">
  <div style="font-size:${zh ? 25 : 23}px;font-weight:700;background:#F2F3EF;color:#050606;padding:15px 34px;border-radius:999px">${t.cta}</div>
  <div class="m" style="font-size:16px;letter-spacing:2.5px;color:rgba(242,243,239,.55);line-height:1.7">${t.d}<br>${t.pool}</div>
</div>
<div class="m" style="position:absolute;left:84px;bottom:36px;font-size:${zh ? 12 : 11}px;letter-spacing:.8px;color:rgba(242,243,239,.32)">${t.fine}</div>
</body></html>`;
const browser = await chromium.launch();
const ctx = await browser.newContext({viewport: {width: 1600, height: 900}, deviceScaleFactor: 2});
const pg = await ctx.newPage();
for (const [n, t, zh] of [['kv-hybrid-en', T.en, false], ['kv-hybrid-zh', T.zh, true]]) {
  const f = `${DIR}/_${n}.html`; fs.writeFileSync(f, page(t, zh));
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({path: `${DIR}/${n}.png`}); fs.unlinkSync(f);
}
await browser.close(); console.log('done');
