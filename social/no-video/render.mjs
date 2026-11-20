// "No." 16:9 joke reply video (19.5 s), posted as a QUOTE post on X so the original video plays above ours (nothing re-uploaded).
// v2: a parody of the original's look (warm paper, quiet serif words, full-bleed footage with one word, mono "\ label \"),
// interrupted by a full-screen red "No.". Fonts are free stand-ins (Newsreader, JetBrains Mono); the original's typeface is not used.
// Footage stills (Unsplash License, logged in hotcoin-tradfi/FOOTAGE_CREDITS.md): Maxim Hopman fiXLQXAhCfk (candles, mirrored),
// Nicholas Cappello Wb63zqJ5gnE (stock monitor), Jingming Pan iYsrkq5qq0Q (gold bars).
// Claims: crypto spot/futures, U.S. stocks with "24/7 Trading" and a "Metal" market are all shown in the Hotcoin app
// (hotcoin-tradfi/reference/hotcoin-mobile-screens.png, Oct 2026). "9 years. Built for traders." is from hotcoin.com's homepage.
// Run: PW_PATH=$(npm root -g)/playwright node social/no-video/render.mjs [frames|video]
import {createRequire} from 'module';
import {spawn} from 'child_process';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const MODE = process.argv[2] || 'frames';
const FPS = 30, DUR = 19.5;
const A = 'file://' + DIR + 'assets/';
const LOGO = 'file://' + DIR + '../../hotcoin-tradfi/public/brand/logo-official-black.png';

// [id, start, end, kind, text, label/bg]
const SHOTS = [
  ['no', 0, 1.5, 'red', 'No.'],
  ['a', 1.5, 3.5, 'paper', 'We can’t fix everything.'],
  ['b', 3.5, 5.5, 'paper', 'But we can help you trade.'],
  ['c', 5.5, 7, 'foot', 'Crypto.', 'spot-and-futures', 'ft-crypto.jpg'],
  ['d', 7, 8.5, 'foot', 'U.S. stocks.', '24-7-trading', 'ft-stocks.jpg'],
  ['e', 8.5, 10, 'foot', 'Metals.', 'one-app', 'ft-gold.jpg'],
  ['f', 10, 11.5, 'paper', 'One account.'],
  ['g', 11.5, 13, 'paper', 'We do one thing.'],
  ['h', 13, 15.5, 'paper', 'And we do it properly.'],
  ['i', 15.5, 17.4, 'paper', '9 years. Built for traders.'],
  ['end', 17.4, 99, 'end'],
];
const words = (s) => s.split(' ').map((w, i) => `<span class="w" data-i="${i}">${w}</span>`).join(' ');
const shotHtml = SHOTS.map(([id, , , kind, text, label, bg]) => {
  if (kind === 'red') return `<div class="sc red" id="${id}"><div class="no">${text}</div></div>`;
  if (kind === 'paper') return `<div class="sc paper" id="${id}"><div class="line">${words(text)}</div></div>`;
  if (kind === 'foot') return `<div class="sc foot" id="${id}"><img class="ft" src="${A}${bg}"><div class="shade"></div>
    <div class="word">${text}</div><div class="lab">\\ ${label} \\</div></div>`;
  return `<div class="sc paper" id="${id}"><img class="logo" src="${LOGO}"><div class="url">hotcoin.com</div></div>`;
}).join('\n');

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..600&family=JetBrains+Mono:wght@400;500&display=block">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1920px;height:1080px;overflow:hidden;background:#f0eee6;font-family:'Newsreader',serif;font-optical-sizing:auto}
.sc{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;opacity:0;overflow:hidden}
.paper{background:#f0eee6;color:#1f1e1d}
.paper::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(255,255,255,0) 55%,rgba(120,105,80,.10) 100%)}
.line{font-size:84px;font-weight:500;letter-spacing:-1.6px;text-align:center}
.w{display:inline-block}
.red{background:#d93a33;color:#f0eee6}
.no{font-size:640px;font-weight:500;letter-spacing:-28px;line-height:1;margin-top:-40px}
.foot{background:#000}
.ft{position:absolute;inset:-54px -96px;width:2112px;height:1188px;object-fit:cover}
.shade{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,.38),rgba(0,0,0,.12) 60%,rgba(0,0,0,.45))}
.word{position:relative;color:#fff;font-size:120px;font-weight:500;letter-spacing:-2px;text-shadow:0 2px 30px rgba(0,0,0,.35)}
.lab{position:absolute;bottom:96px;left:0;right:0;text-align:center;font-family:'JetBrains Mono';font-size:28px;color:#fff;letter-spacing:.5px;text-shadow:0 1px 12px rgba(0,0,0,.8)}
.logo{height:92px;position:relative}
.url{position:relative;margin-top:44px;font-family:'JetBrains Mono';font-size:28px;color:#1f1e1d;letter-spacing:1px}
.url::before{content:'';display:block;width:56px;height:5px;border-radius:3px;background:#7ec25a;margin:0 auto 30px}
#grain{position:absolute;inset:0;width:1920px;height:1080px;opacity:.07;mix-blend-mode:overlay;pointer-events:none;image-rendering:pixelated}
</style></head><body>
${shotHtml}
<img id="grain" src="${A}grain0.png">
<script>
const SHOTS=${JSON.stringify(SHOTS.map(([id, a, b, kind]) => [id, a, b, kind]))};
const cl=(x)=>Math.max(0,Math.min(1,x)), eo=(x)=>1-Math.pow(1-cl(x),3);
window.setT=(t,f)=>{
 document.getElementById('grain').src='${A}grain'+(f%4)+'.png';
 for(const [id,a,b,kind] of SHOTS){const e=document.getElementById(id); const on=t>=a&&t<b; e.style.opacity=on?1:0; if(!on) continue; const u=t-a;
  if(kind==='red'){e.firstElementChild.style.transform='scale('+(1.035-0.035*eo(u/0.5))+')';}
  if(kind==='paper'&&id!=='end'){e.querySelectorAll('.w').forEach((w,i)=>{const k=eo((u-0.08-i*0.16)/0.4); w.style.opacity=k; w.style.filter='blur('+((1-k)*8)+'px)'; w.style.transform='translateY('+((1-k)*10)+'px)';});}
  if(kind==='foot'){e.querySelector('.ft').style.transform='scale('+(1.0+0.05*(u/(b-a)))+')';
   const k=eo((u-0.1)/0.45); const w=e.querySelector('.word'); w.style.opacity=k; w.style.filter='blur('+((1-k)*8)+'px)';
   const k2=eo((u-0.45)/0.4); e.querySelector('.lab').style.opacity=k2;}
  if(id==='end'){const k=eo((u-0.05)/0.6); const l=e.querySelector('.logo'); l.style.opacity=k; l.style.filter='blur('+((1-k)*8)+'px)';
   const k2=eo((u-0.5)/0.5); const r=e.querySelector('.url'); r.style.opacity=k2; r.style.transform='translateY('+((1-k2)*12)+'px)';}
 }
};
</script></body></html>`;

const f = DIR + `_no-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1920, height: 1080}});
await p.goto('file://' + f);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(800);
fs.mkdirSync(DIR + 'out', {recursive: true});
if (MODE === 'frames') {
  for (const t of [0.1, 3.3, 5.3, 6.6, 8.1, 9.6, 14.9, 17.2, 19.2]) {
    await p.evaluate(([t, f]) => window.setT(t, f), [t, Math.round(t * FPS)]);
    await p.waitForTimeout(60);
    await p.screenshot({path: DIR + `out/f-${t}.jpg`, type: 'jpeg', quality: 85});
  }
} else {
  const ff = spawn('/usr/bin/ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-pix_fmt', 'yuv420p', DIR + 'out/no-silent.mp4']);
  for (let i = 0; i < Math.round(DUR * FPS); i++) {
    await p.evaluate(([t, f]) => window.setT(t, f), [i / FPS, i]);
    await p.waitForTimeout(i % 1 === 0 ? 15 : 0);
    ff.stdin.write(await p.screenshot({type: 'jpeg', quality: 92}));
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
}
await b.close(); fs.unlinkSync(f); console.log('ok', MODE);
