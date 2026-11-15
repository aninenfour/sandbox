// Ongoing events digest: a 3D cube that rotates to each event, zooms in for the key details, then turns to the next.
// 1:1, 1080x1080, 30 fps, ~24 s. CSS 3D in headless Chromium, frames rendered at 2x and downscaled by ffmpeg.
// Events (hotcoin.com announcement center, Activities, checked Nov 15, 2026 17:30 UTC+8):
//  - 200,000 USDT Futures Loss Compensation, 2026-11-06 18:00 to 2026-11-20 18:00: first futures trade loss 100% covered up to
//    50 USDT (new users, >= 500 USDT futures volume, first 1,000); liquidation loss 100% covered up to 500 USDT (volume tiers);
//    1,000 USDT for a single liquidation loss over 3,000 USDT (first 10).
//  - Wall Street Earnings Season, 2026-11-06 00:00 to 2026-11-19 23:59: up to 1,060 USDT in Futures Trial Funds
//    (10 first TradFi trade + up to 1,000 volume milestones + up to 50 trading days).
//  - Earn Rewards Boost, 2026-11-06 12:00 to 2026-11-16 12:00: 20 USDT Futures Trial Funds on a first fixed-term Earn
//    subscription >= 500 USDT; up to 1,000 USDT Earn Trial Funds by cumulative subscription (highest tier only, tiers don't stack).
//  - NEFE Earn Limited Offer, from 2026-11-09 16:00: 180-day fixed term, est. 15% APR, min 100,000 NEFE, while quota lasts.
// Run: PW_PATH=$(npm root -g)/playwright node social/events-cube/render.mjs [sheet|video]
import {createRequire} from 'module';
import fs from 'fs';
import {spawn} from 'child_process';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/events-cube', BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const FPS = 30, DUR = 24, S = 1080, E = 600;   // E = cube edge in px

const FACES = [
  {kick: 'FUTURES', title: 'Futures Loss Compensation', big: '200,000', unit: 'USDT pool', rows: [
    ['100%', 'of your first futures trade loss covered, up to 50 USDT'], ['100%', 'of liquidation losses covered, up to 500 USDT'], ['1,000', 'USDT for a single liquidation loss over 3,000 USDT']],
    ends: 'ENDS NOV 20 · 18:00', note: 'New users for the first-trade cover · limited spots'},
  {kick: 'TRADFI', title: 'Wall Street Earnings Season', big: '1,060', unit: 'USDT futures trial funds', rows: [
    ['10', 'USDT on your first TradFi trade'], ['1,000', 'USDT max for trading volume milestones'], ['50', 'USDT max for trading on more days']],
    ends: 'ENDS NOV 19 · 23:59', note: 'Trade US stock and TradFi pairs'},
  {kick: 'EARN · LAST CALL', title: 'Earn Rewards Boost', big: '20', unit: 'USDT futures trial funds bonus', rows: [
    ['20', 'USDT futures trial funds on your first fixed-term Earn (500 USDT+)'], ['1,000', 'USDT max in Earn trial funds by total subscribed'], ['MAX', 'one tier only, tiers don’t stack']],
    ends: 'ENDS NOV 16 · 12:00', note: 'Last call', hot: true},
  {kick: 'EARN', title: 'NEFE Earn Limited Offer', big: '15%', unit: 'est. APR · 180-day fixed term', rows: [
    ['180', 'days fixed term, principal + earnings paid at maturity'], ['100K', 'NEFE minimum subscription'], ['1B', 'NEFE quota, first come first served']],
    ends: 'WHILE QUOTA LASTS', note: 'Fixed term, no early redemption'},
];

const face = (f, i) => `<div class="face side" style="transform:rotateY(${i * 90}deg) translateZ(${E / 2}px)">
  <div class="kick m"><i class="dot"></i>${f.kick}</div>
  <div class="ttl">${f.title}</div>
  <div class="big">${f.big}<span>${f.unit}</span></div>
  <div class="rows">${f.rows.map(([n, s], k) => `<div class="row" data-k="${k}"><b>${n}</b><span>${s}</span></div>`).join('')}</div>
  <div class="ends m ${f.hot ? 'hot' : ''}"><i class="dot pulse"></i>${f.ends}</div>
</div>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:${S}px;height:${S}px;overflow:hidden;background:#07090A;font-family:'Inter Tight',sans-serif;color:#fff;position:relative}
.m{font-family:'JetBrains Mono',monospace}
#bg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 55% at 50% 50%,rgba(126,194,90,.18),rgba(7,9,10,0) 70%)}
#grid{position:absolute;inset:-200px;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:60px 60px;
  mask-image:radial-gradient(ellipse 55% 55% at 50% 50%,#000,transparent)}
#stage{position:absolute;inset:0;perspective:1700px;perspective-origin:50% 50%}
#cube{position:absolute;left:50%;top:50%;width:${E}px;height:${E}px;margin:-${E / 2}px 0 0 -${E / 2}px;transform-style:preserve-3d}
.face{position:absolute;inset:0;backface-visibility:hidden;border-radius:6px}
.side{background:linear-gradient(160deg,#171B1F 0%,#0E1114 60%,#0B0E11 100%);border:2px solid rgba(184,242,106,.55);padding:44px 46px;display:flex;flex-direction:column;
  box-shadow:inset 0 0 80px rgba(184,242,106,.06)}
.cap{background:#B8F26A;display:flex;align-items:center;justify-content:center}
.kick{display:flex;align-items:center;gap:12px;font-size:17px;font-weight:700;letter-spacing:3px;color:#B8F26A}
.dot{display:inline-block;width:14px;height:14px;border-radius:50%;background:#B8F26A;box-shadow:0 0 14px rgba(184,242,106,.8);flex:none}
.ttl{font-size:38px;font-weight:700;letter-spacing:-1.2px;line-height:1.05;margin-top:16px;color:#F2F3EF}
.big{font-size:118px;font-weight:800;letter-spacing:-5px;line-height:.95;margin-top:18px;color:#B8F26A}
.big span{display:block;font-size:21px;letter-spacing:0;font-weight:600;color:rgba(242,243,239,.75);margin-top:10px}
.rows{margin-top:auto;display:flex;flex-direction:column;gap:12px}
.row{display:flex;align-items:baseline;gap:16px;border-top:1px solid rgba(255,255,255,.1);padding-top:12px}
.row b{width:96px;flex:none;font-size:30px;font-weight:800;color:#fff;letter-spacing:-1px}
.row span{font-size:19px;line-height:1.3;color:rgba(242,243,239,.82);font-weight:500}
.ends{display:flex;align-items:center;gap:12px;margin-top:22px;align-self:flex-start;background:rgba(184,242,106,.12);border:1.5px solid rgba(184,242,106,.6);
  color:#B8F26A;border-radius:99px;padding:10px 18px;font-size:17px;font-weight:700;letter-spacing:2px}
.ends.hot{background:#B8F26A;color:#0B0E11}.ends.hot .dot{background:#0B0E11;box-shadow:none}
#title{position:absolute;left:0;right:0;top:64px;text-align:center}
#logo{position:absolute;left:50%;bottom:58px;height:34px;transform:translateX(-50%)}
#end{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;opacity:0}
</style></head><body>
<div id="bg"></div><div id="grid"></div>
<div id="title"><div class="m" style="display:inline-flex;align-items:center;gap:12px;font-size:20px;letter-spacing:4px;color:#B8F26A"><i class="dot pulse"></i>LIVE ON HOTCOIN</div>
  <div id="sub" style="font-size:54px;font-weight:800;letter-spacing:-2px;margin-top:14px">4 events running now</div></div>
<div id="stage"><div id="cube">
  ${FACES.map(face).join('')}
  <div class="face cap" style="transform:rotateX(90deg) translateZ(${E / 2}px)"><img src="${BR}symbol-official-white.png" style="height:44%;filter:brightness(0)"></div>
  <div class="face cap" style="transform:rotateX(-90deg) translateZ(${E / 2}px)"><img src="${BR}symbol-official-white.png" style="height:44%;filter:brightness(0)"></div>
</div></div>
<div id="end"><div class="m" style="display:inline-flex;align-items:center;gap:12px;font-size:20px;letter-spacing:4px;color:#B8F26A"><i class="dot"></i>DON'T MISS OUT</div>
  <div style="font-size:84px;font-weight:800;letter-spacing:-3.5px;line-height:1.02;margin-top:22px">Rewards end soon.<br><span style="color:#B8F26A">Join today.</span></div>
  <div id="soon" style="margin-top:44px;display:flex;flex-direction:column;gap:12px;font-size:24px;font-weight:600;color:rgba(242,243,239,.85)">
    <div><span class="m" style="color:#B8F26A;font-size:20px">NOV 16</span>&nbsp;&nbsp;Earn Rewards Boost</div>
    <div><span class="m" style="color:#B8F26A;font-size:20px">NOV 19</span>&nbsp;&nbsp;Wall Street Earnings Season</div>
    <div><span class="m" style="color:#B8F26A;font-size:20px">NOV 20</span>&nbsp;&nbsp;Futures Loss Compensation</div></div>
  <div class="m" style="margin-top:48px;font-size:26px;font-weight:700;color:#0B0E11;background:#B8F26A;border-radius:99px;padding:14px 30px">hotcoin.com</div></div>
<img id="logo" src="${BR}logo-official-white.png">
<script>
const $ = (q) => document.querySelector(q), cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), seg = (t, a, b) => cl((t - a) / (b - a)), mix = (a, b, u) => a + (b - a) * u;
const io = (u) => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, oc = (u) => 1 - Math.pow(1 - u, 3), ob = (u) => 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2);
const T0 = 2.2, SEG = 4.6, NF = ${FACES.length};           // intro, then one segment per face
const sides = [...document.querySelectorAll('.side')];
window.setT = (t) => {
  // cube pose: rotation follows the face schedule; zoom in while a face is read
  let ry = -25, rx = -16, z = -520, s = .62;
  if (t < T0) { const u = io(seg(t, 0, T0)); ry = mix(-60, -25, u) + t * 6; rx = -16; z = -520; }
  else if (t < T0 + NF * SEG) {
    const i = Math.min(NF - 1, Math.floor((t - T0) / SEG)), l = t - T0 - i * SEG;
    const turn = io(seg(l, 0, .9)), zin = io(seg(l, .75, 1.35)), zout = io(seg(l, SEG - .75, SEG));
    const from = i === 0 ? -25 + 13 : -(i - 1) * 90, to = -i * 90;
    ry = mix(from, to, turn) + (1 - zin + zout) * -12; rx = mix(-16, -3, zin) * (1 - zout) + -16 * zout;
    z = mix(-520, 400, zin * (1 - zout)); s = 1;
    sides.forEach((el, k) => { const on = k === i ? l : -1; el.querySelectorAll('.row').forEach((r, j) => { const p = oc(seg(on, 1.35 + j * .22, 1.75 + j * .22)); r.style.opacity = k === i ? p : 1; r.style.transform = 'translateX(' + (k === i ? (1 - p) * 30 : 0) + 'px)'; }); });
  } else { const u = seg(t, T0 + NF * SEG, T0 + NF * SEG + 1.4); ry = -(NF - 1) * 90 - io(u) * 270 - 12; rx = mix(-16, -24, u); z = mix(-520, -1400, io(seg(t, T0 + NF * SEG + .6, T0 + NF * SEG + 1.6))); }
  $('#cube').style.transform = 'translateZ(' + z + 'px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
  // dot pulse
  const pulse = .55 + .45 * Math.abs(Math.sin(t * 3.2));
  document.querySelectorAll('.pulse').forEach((d) => { d.style.transform = 'scale(' + (.85 + pulse * .3) + ')'; d.style.opacity = .6 + pulse * .4; });
  // title visible in intro and while cube is small
  const zoomed = t >= T0 && t < T0 + NF * SEG ? io(seg((t - T0) % SEG, .6, 1.2)) * (1 - io(seg((t - T0) % SEG, SEG - .8, SEG))) : 0;
  $('#title').style.opacity = t < T0 + NF * SEG ? 1 - zoomed : 1 - seg(t, T0 + NF * SEG + .4, T0 + NF * SEG + 1);
  $('#logo').style.opacity = 1 - zoomed;
  const e = oc(seg(t, T0 + NF * SEG + 1.3, T0 + NF * SEG + 2.0)); $('#end').style.opacity = e; $('#end').style.transform = 'translateY(' + (1 - e) * 30 + 'px)';
  $('#stage').style.opacity = 1 - seg(t, T0 + NF * SEG + 1.2, T0 + NF * SEG + 1.7);
  $('#grid').style.transform = 'translate(' + (t * 6 % 60) + 'px,' + (t * 3 % 60) + 'px)';
};
window.setT(0);
</script></body></html>`;

const mode = process.argv[2] || 'sheet';
fs.mkdirSync(DIR + '/out', {recursive: true});
const f = DIR + '/_page.html'; fs.writeFileSync(f, html);
const browser = await chromium.launch();
const pg = await (await browser.newContext({viewport: {width: S, height: S}, deviceScaleFactor: 2})).newPage();
await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready);
if (mode === 'sheet') {
  for (const t of (process.argv[3] || '0,1.5,3.0,5.5,8.2,10.2,12.8,15.0,17.5,19.4,21.6,23.5').split(',').map(Number)) { await pg.evaluate((v) => window.setT(v), t); await pg.screenshot({path: `${DIR}/out/s-${t}.jpg`, type: 'jpeg', quality: 88}); }
} else {
  const ff = spawn('/usr/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-vf', `scale=${S}:${S}:flags=lanczos`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', `${DIR}/out/silent.mp4`], {stdio: ['pipe', 'inherit', 'inherit']});
  for (let i = 0; i < DUR * FPS; i++) { await pg.evaluate((v) => window.setT(v), i / FPS); const b = await pg.screenshot({type: 'jpeg', quality: 93}); if (!ff.stdin.write(b)) await new Promise((r) => ff.stdin.once('drain', r)); if (i % 90 === 0) console.log('frame', i); }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
}
await browser.close(); fs.unlinkSync(f); console.log('done', mode);
