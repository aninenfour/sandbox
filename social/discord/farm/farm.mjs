// "Farm them all" Discord embed image (1600x1000, black theme). Data: events.json in this folder.
// Run: PW_PATH=$(npm root -g)/playwright node social/discord/farm/farm.mjs <scratch-dir>
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const DIR = ROOT + '/social/discord/farm';
const T = ROOT + '/social/announcements/template';
const D = JSON.parse(fs.readFileSync(DIR + '/events.json', 'utf8'));
const f = (p) => 'file://' + p;
const DP = 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z';
const dc = (s, c) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" style="flex:none"><path fill="${c}" d="${DP}"/></svg>`;

const row = (e, i) => `<div class="r ${e.hot ? 'hot' : ''}">
 <span class="i">${String(i + 1).padStart(2, '0')}</span>
 <div class="m"><div class="n">${e.name}<span class="k ${e.kind.toLowerCase()}">${e.kind}</span></div><div class="p">${e.prize}</div></div>
 <span class="e">${e.ends}</span></div>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@800;900&family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block');
*{box-sizing:border-box;margin:0;padding:0}
body{width:1600px;height:1000px;overflow:hidden;font-family:'Inter Tight',sans-serif;color:#F2F3EE}
.s{position:relative;width:1600px;height:1000px;background:#07090A url(${f(T + '/bg-dark-1600x900.png')}) center/cover;display:flex}
.left{position:relative;width:520px;padding:56px 0 0 60px}
.tag{display:inline-block;font-family:'JetBrains Mono';font-weight:700;font-size:16px;letter-spacing:3px;background:#B8F26A;color:#0B0E11;padding:7px 26px 7px 12px;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 100%,0 100%)}
h1{font-family:Unbounded;font-weight:900;font-size:76px;line-height:.98;letter-spacing:-2px;margin-top:22px}
h1 span{color:#B8F26A}
.lead{font-size:24px;color:#B9BEC4;font-weight:500;margin-top:18px;line-height:1.35;max-width:420px}
.lead b{color:#fff}
.rd{position:absolute;left:30px;bottom:0;height:470px;filter:drop-shadow(0 12px 30px rgba(0,0,0,.6))}
.sym{position:absolute;left:60px;top:56px}
.right{flex:1;padding:52px 56px 0 0;display:flex;flex-direction:column}
.hd{display:flex;justify-content:space-between;font-family:'JetBrains Mono';font-weight:700;font-size:14px;letter-spacing:2px;color:#7D848C;padding:0 18px 10px 70px}
.list{display:flex;flex-direction:column;gap:9px}
.r{display:flex;align-items:center;gap:16px;background:rgba(17,20,22,.92);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px 18px;height:76px}
.r.hot{background:rgba(26,36,18,.94);border-color:rgba(184,242,106,.45)}
.i{font-family:'JetBrains Mono';font-weight:700;font-size:18px;color:#6B7280;width:34px}
.r.hot .i{color:#B8F26A}
.m{flex:1;min-width:0}
.n{font-size:23px;font-weight:800;display:flex;align-items:center;gap:10px;white-space:nowrap}
.p{font-size:17px;color:#AEB4BA;font-weight:500;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.k{font-family:'JetBrains Mono';font-weight:700;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;border-radius:5px;padding:3px 7px}
.k.platform{background:#B8F26A;color:#0B0E11}
.k.x{background:#fff;color:#0B0E11}
.k.zealy{background:#8B5CF6;color:#fff}
.e{font-family:'JetBrains Mono';font-weight:700;font-size:18px;white-space:nowrap;text-align:right;min-width:170px}
.r.hot .e{color:#B8F26A}
.ft{display:flex;justify-content:space-between;align-items:center;margin-top:auto;margin-bottom:34px;font-size:16px;color:#7D848C}
.ft .l{display:flex;align-items:center;gap:10px}
.ft b{color:#F2F3EE;font-weight:600}
</style></head><body><div class="s">
 <div class="left">
  <span class="tag">LIVE ON HOTCOIN</span>
  <h1>Farm<br>them <span>all</span></h1>
  <div class="lead"><b>${D.events.length} events</b> running right now. The top ones end first, so start there.</div>
  <img class="rd" src="${f(T + '/ronaldinho-cutout.png')}">
 </div>
 <div class="right">
  <div class="hd"><span>EVENT · REWARD</span><span>ENDS (UTC)</span></div>
  <div class="list">${D.events.map(row).join('')}</div>
  <div class="ft"><span class="l">${dc(20, '#5865F2')}<b>Links in the message below</b> · rewards follow each event's terms</span><span>As of ${D.asof}</span></div>
 </div>
</div></body></html>`;

const out = process.argv[2] + '/farm.html'; fs.writeFileSync(out, html);
const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1600, height: 1000}});
await p.goto('file://' + out, {waitUntil: 'networkidle'}); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
await p.screenshot({path: DIR + '/farm-all.png'}); await b.close(); console.log('ok');
