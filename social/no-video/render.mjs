// "No." 16:9 joke reply video (~19.5 s), posted as a quote post on X so the original video plays above ours (nothing re-uploaded).
// Lines cut on a 120 BPM grid. Real app screens: hotcoin-tradfi/reference/hotcoin-mobile-screens.png (Hotcoin app, captured Oct 2026).
// End card: Belo Horizonte photo (Alvaro Guerrero, Unsplash License, logged) with the lime line along the real ridge.
// Phones: BTC/USDT chart, U.S. stocks page, markets list (US stocks, Metal, Korean stocks chips) = "And more.". Risk line lives in the caption.
// Tagline "9 years. Built for traders." is from hotcoin.com's own homepage ("9 Years of Focus. Built for Traders.").
// Run: PW_PATH=$(npm root -g)/playwright node social/no-video/render.mjs [frames|video]
import {createRequire} from 'module';
import {spawn} from 'child_process';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const MODE = process.argv[2] || 'frames';
const FPS = 30, DUR = 19.5;
const R = JSON.parse(fs.readFileSync(DIR + 'assets/ridge.json', 'utf8'));
const pts = R.bh.slice(0, R.bh_peak + 1);
const d = 'M' + pts.map(([x, y]) => `${x} ${y}`).join(' L');
let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
const peak = pts.at(-1);
const A = 'file://' + DIR + 'assets/';
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png';

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=block">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1920px;height:1080px;overflow:hidden;background:#0b0e11;color:#f3f4f1;font-family:'Bricolage Grotesque',sans-serif;font-variation-settings:'opsz' 96,'wdth' 78}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.07) 1.6px,transparent 1.8px);background-size:32px 32px}
.glow{position:absolute;left:900px;top:520px;width:1500px;height:900px;background:radial-gradient(ellipse at center,rgba(184,242,106,.16),rgba(184,242,106,0) 65%)}
.sc{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;opacity:0}
.big{font-weight:800;letter-spacing:-6px;line-height:.9;text-align:center}
.lime{color:#b8f26a}
.no{font-size:560px;letter-spacing:-26px}
.l1{font-size:170px}
.phones{display:flex;gap:70px;align-items:flex-end}
.ph{width:360px;text-align:center}
.ph .lab{font-weight:800;font-size:76px;letter-spacing:-2px;margin-bottom:26px}
.ph .fr{width:360px;height:600px;border-radius:44px;border:3px solid #2a3136;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.6),0 0 0 10px rgba(184,242,106,.06);background:#000}
.ph .fr img{width:360px;height:600px;object-fit:cover;object-position:top;display:block}
.end img.bg{position:absolute;inset:0;width:1920px;height:1080px;object-fit:cover;filter:grayscale(1)}
.end .scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,14,17,.92) 0%,rgba(11,14,17,.55) 34%,rgba(11,14,17,0) 58%)}
.end .t{position:absolute;left:128px;top:170px;width:1500px}
.end .t .k{font-family:'JetBrains Mono';font-weight:700;font-size:28px;letter-spacing:6px;color:#b8f26a;margin-bottom:26px}
.end .t .h{font-weight:800;font-size:150px;letter-spacing:-5px;line-height:.92}
.end .logo{position:absolute;left:128px;top:72px;height:44px}
.end .url{position:absolute;right:128px;bottom:72px;font-family:'Inter Tight';font-weight:700;font-size:40px;background:#b8f26a;color:#0b0e11;padding:22px 44px;border-radius:99px}
.end .risk{position:absolute;left:128px;bottom:84px;font-family:'JetBrains Mono';font-size:24px;letter-spacing:2px;color:rgba(255,255,255,.75)}
</style></head><body>
<div class="dots"></div><div class="glow"></div>
<div class="sc" id="s0"><div class="big no">No.</div></div>
<div class="sc" id="s1"><div class="big l1">We can’t fix<br>everything.</div></div>
<div class="sc" id="s2"><div class="big l1">But we can help<br>you <span class="lime">trade.</span></div></div>
<div class="sc" id="s3"><div class="phones">
 <div class="ph" id="p0"><div class="lab">Crypto.</div><div class="fr"><img src="${A}app-btc.png"></div></div>
 <div class="ph" id="p1"><div class="lab">U.S. stocks.</div><div class="fr"><img src="${A}app-stocks.png"></div></div>
 <div class="ph" id="p2"><div class="lab lime">And more.</div><div class="fr"><img src="${A}app-markets.png"></div></div>
</div></div>
<div class="sc" id="s4"><div class="big l1">One account.</div></div>
<div class="sc" id="s5"><div class="big l1">We do one thing.</div></div>
<div class="sc" id="s6"><div class="big l1">And we do it<br><span class="lime">properly.</span></div></div>
<div class="sc end" id="s7" style="display:block">
 <img class="bg" src="${A}bg-bh.jpg"><div class="scrim"></div>
 <svg style="position:absolute;inset:0" width="1920" height="1080"><defs><filter id="gl" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>
  <path id="lg" d="${d}" fill="none" stroke="#b8f26a" stroke-width="14" stroke-linecap="round" opacity=".5" filter="url(#gl)" stroke-dasharray="${L}" stroke-dashoffset="${L}"/>
  <path id="ln" d="${d}" fill="none" stroke="#b8f26a" stroke-width="5" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${L}"/>
  <circle id="dot" cx="${peak[0]}" cy="${peak[1]}" r="13" fill="#b8f26a" opacity="0"/><circle id="ring" cx="${peak[0]}" cy="${peak[1]}" r="30" fill="none" stroke="#b8f26a" stroke-width="3" opacity="0"/></svg>
 <img class="logo" src="${LOGO}">
 <div class="t"><div class="h" id="eh">9 years.<br>Built for traders.</div></div>
 <div class="url" id="eu">hotcoin.com</div>
</div>
<script>
const L=${L};
const cl=(x)=>Math.max(0,Math.min(1,x)), eo=(x)=>1-Math.pow(1-cl(x),3);
const S=[['s0',0,1.5],['s1',1.5,3.5],['s2',3.5,5.5],['s3',5.5,10],['s4',10,11.5],['s5',11.5,13],['s6',13,15.5],['s7',15.5,99]];
window.setT=(t)=>{
 for(const [id,a,b] of S){const e=document.getElementById(id); const on=t>=a&&t<b; e.style.opacity=on?1:0;
  if(on&&id!=='s7'&&id!=='s3'){const k=eo((t-a)/.45); e.style.transform=id==='s0'?'none':\`translateY(\${(1-k)*40}px)\`; e.firstElementChild.style.opacity=id==='s0'?1:k;}}
 [0,1,2].forEach(i=>{const k=eo((t-5.5-i*.5)/.6); const p=document.getElementById('p'+i); p.style.opacity=k; p.style.transform=\`translateY(\${(1-k)*120}px)\`;});
 if(t>=15.5){const u=t-15.5; const g=eo(u/3.2);
  document.querySelector('#s7 img.bg').style.transform=\`scale(\${1.08-0.08*eo(u/4)})\`;
  const off=L*(1-eo((u-.2)/2.2)); ['lg','ln'].forEach(id=>document.getElementById(id).setAttribute('stroke-dashoffset',off));
  const dk=cl((u-2.3)/.35); document.getElementById('dot').setAttribute('opacity',dk); document.getElementById('ring').setAttribute('opacity',dk*.7);
  [['eh',.3],['eu',.9]].forEach(([id,dl])=>{const k=eo((u-dl)/.6); const e=document.getElementById(id); e.style.opacity=k; e.style.transform=\`translateY(\${(1-k)*30}px)\`;});
  document.getElementById('s7').style.opacity=1;}
};
</script></body></html>`;

const f = DIR + `_no-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1920, height: 1080}});
await p.goto('file://' + f);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(600);
fs.mkdirSync(DIR + 'out', {recursive: true});
if (MODE === 'frames') {
  for (const t of [0.5, 2.2, 4.4, 7.5, 10.6, 12.2, 14.2, 19.2]) {
    await p.evaluate((t) => window.setT(t), t);
    await p.screenshot({path: DIR + `out/f-${t}.jpg`, type: 'jpeg', quality: 85});
  }
} else {
  const ff = spawn('/usr/bin/ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-pix_fmt', 'yuv420p', DIR + 'out/no-silent.mp4']);
  for (let i = 0; i < Math.round(DUR * FPS); i++) {
    await p.evaluate((t) => window.setT(t), i / FPS);
    ff.stdin.write(await p.screenshot({type: 'jpeg', quality: 92}));
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
}
await b.close(); fs.unlinkSync(f); console.log('ok', MODE);
