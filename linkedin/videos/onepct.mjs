// "The 1% rule" how-to video, LinkedIn 4:5 (1080x1350), 30 fps, ~62 s. Canvas animation rendered frame by frame in
// Playwright, then ffmpeg + original music (onepct-beat.py). Brand: ink, lime, Inter Tight + JetBrains Mono, official logo.
// Math (checked): 10,000 x 0.99^10 = 9,043.82; 10,000 x 0.90^10 = 3,486.78. Recovery to 10,000: +10.57% and +186.80%.
// Example: account 10,000 USDT, 1% risk = 100 USDT, stop 5% below entry -> position 100 / 0.05 = 2,000 USDT.
// Run: node linkedin/videos/onepct.mjs  -> linkedin/videos/out/frames/*.png
import fs from 'fs'; import path from 'path'; import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH || 'playwright');
const DIR = path.dirname(new URL(import.meta.url).pathname), ROOT = path.resolve(DIR, '../..');
const OUT = `${DIR}/out/frames`; fs.rmSync(OUT, {recursive: true, force: true}); fs.mkdirSync(OUT, {recursive: true});
const LOGO = 'data:image/png;base64,' + fs.readFileSync(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-white.png`).toString('base64');
const FPS = 30, DUR = 62, N = FPS * DUR;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&display=block');
html,body{margin:0;background:#07090A}canvas{display:block}
/* warm the font cache */ .w1{font:800 20px 'Inter Tight'}.w2{font:700 20px 'JetBrains Mono'}.w3{font:900 20px 'Inter Tight'}.w4{font:600 20px 'Inter Tight'}
</style></head><body><span class="w1">a</span><span class="w2">a</span><span class="w3">a</span><span class="w4">a</span>
<canvas id="c" width="1080" height="1350"></canvas>
<script>
const W=1080,H=1350,c=document.getElementById('c'),x=c.getContext('2d');
const INK='#07090A',LIME='#B8F26A',GREEN='#7EC25A',WHITE='#F2F4EF',MUTED='rgba(242,244,239,.62)',RED='#E5484D',DEEP='#163F26';
const logo=new Image();logo.src='${LOGO}';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)), ease=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const prog=(t,a,b)=>ease((t-a)/(b-a));
// grain tile
const g=document.createElement('canvas');g.width=g.height=360;const gx=g.getContext('2d'),gd=gx.createImageData(360,360);
let s=3;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<gd.data.length;i+=4){const v=r()*255;gd.data[i]=gd.data[i+1]=gd.data[i+2]=v;gd.data[i+3]=255}gx.putImageData(gd,0,0);
function text(str,X,Y,font,color,alpha=1,align='left'){x.save();x.globalAlpha=alpha;x.font=font;x.fillStyle=color;x.textAlign=align;x.textBaseline='alphabetic';x.fillText(str,X,Y);x.restore()}
function chrome(str,X,Y,size,alpha=1,align='left'){x.save();x.globalAlpha=alpha;x.font='900 '+size+'px "Inter Tight"';x.textAlign=align;
  x.fillStyle='#3F7A2A';x.fillText(str,X+5,Y+5);const gr=x.createLinearGradient(0,Y-size*.85,0,Y);gr.addColorStop(0,'#FFFFFF');gr.addColorStop(.45,'#D9DDE0');gr.addColorStop(.6,'#9AA0A5');gr.addColorStop(.78,'#F4F6F7');gr.addColorStop(1,LIME);x.fillStyle=gr;x.fillText(str,X,Y);x.restore()}
function kicker(str,alpha){text(str,72,190,'700 22px "JetBrains Mono"',LIME,alpha)}
function bg(t){x.fillStyle=INK;x.fillRect(0,0,W,H);
  const k=Math.sin(t*0.25)*30;x.fillStyle=DEEP;x.beginPath();x.arc(1080+k,1240,470,0,7);x.fill();x.fillStyle='#0E2A19';x.beginPath();x.arc(-60,1320-k,170,0,7);x.fill();
  if(logo.complete)x.drawImage(logo,72,68,40*logo.width/logo.height,40);
  text('HOTCOIN 101',W-72,96,'700 20px "JetBrains Mono"',MUTED,1,'right')}
function grain(){x.save();x.globalCompositeOperation='overlay';x.globalAlpha=.14;for(let yy=0;yy<H;yy+=360)for(let xx=0;xx<W;xx+=360)x.drawImage(g,xx,yy);x.restore()}
function fadeOut(t,a,b){return 1-prog(t,a,b)}
function wrap(lines,X,Y,font,color,lh,alpha){lines.forEach((l,i)=>text(l,X,Y+i*lh,font,color,alpha))}
window.draw=(t)=>{bg(t);
  // 0-6 hook
  if(t<6.4){const a=t<5.8?1:fadeOut(t,5.8,6.4);kicker('RISK · 60 SECONDS',a);
    wrap(['Most traders','blow up on size,'],72,420,'800 104px "Inter Tight"',WHITE,108,a);
    const b=Math.max(t<1.6?0:prog(t,1.6,2.4),0)*a;wrap(['not on being','wrong.'],72,700,'800 104px "Inter Tight"',LIME,108,b)}
  // 6-16 rule
  if(t>=6.2&&t<16.4){const a=prog(t,6.2,7)*(t<15.8?1:fadeOut(t,15.8,16.4));kicker('THE RULE',a);
    chrome('The 1%',72,560,230,a);chrome('rule',72,780,230,a);
    const b=prog(t,8,9)*a;wrap(['Risk at most 1% of your','account on any one trade.'],72,930,'700 54px "Inter Tight"',WHITE,66,b);
    const d=prog(t,10.5,11.5)*a;wrap(['Not 1% of the position.','1% of everything you own.'],72,1100,'600 40px "Inter Tight"',MUTED,52,d)}
  // 16-32 worked example
  if(t>=16.2&&t<32.4){const a=prog(t,16.2,17)*(t<31.8?1:fadeOut(t,31.8,32.4));kicker('WORKED EXAMPLE',a);
    text('Size it in 3 steps',72,330,'800 80px "Inter Tight"',WHITE,a);
    const rows=[['Account','10,000 USDT',17.5],['Max risk, 1%','100 USDT',20],['Stop, below entry','5%',22.5]];
    rows.forEach(([k,v,ts],i)=>{const r=prog(t,ts,ts+.8)*a;const Y=470+i*130;x.save();x.globalAlpha=r*.35;x.fillStyle=WHITE;x.fillRect(72,Y+34,W-144,2);x.restore();
      text(k,72,Y,'600 40px "Inter Tight"',MUTED,r);text(v,W-72,Y,'800 56px "Inter Tight"',WHITE,r,'right')});
    const e=prog(t,25.5,26.5)*a;text('Position size',72,920,'700 30px "JetBrains Mono"',LIME,e);
    text('100 ÷ 5% =',72,1000,'700 52px "Inter Tight"',WHITE,e);
    const n=Math.round(2000*prog(t,26.5,28.5)),ns=n.toLocaleString('en-US');chrome(ns,72,1190,190,e);x.font='900 190px "Inter Tight"';const nw=x.measureText(ns).width;text('USDT',72+nw+24,1190,'700 44px "JetBrains Mono"',LIME,e)}
  // 32-48 chart
  if(t>=32.2&&t<48.4){const a=prog(t,32.2,33)*(t<47.8?1:fadeOut(t,47.8,48.4));kicker('10 LOSSES IN A ROW',a);
    text('Same bad luck.',72,320,'800 76px "Inter Tight"',WHITE,a);text('Different sizes.',72,404,'800 76px "Inter Tight"',LIME,a);
    const L=110,R=W-150,T=520,B=1080,v2y=v=>B-(v/10000)*(B-T);
    x.save();x.globalAlpha=a;x.strokeStyle='rgba(242,244,239,.16)';x.lineWidth=2;[0,2500,5000,7500,10000].forEach(v=>{x.beginPath();x.moveTo(L,v2y(v));x.lineTo(R,v2y(v));x.stroke();text((v/1000)+'K',L-16,v2y(v)+10,'500 24px "JetBrains Mono"',MUTED,a,'right')});x.restore();
    for(let i=0;i<=10;i++)text(i===0?'start':String(i),L+(R-L)*i/10,B+44,'500 22px "JetBrains Mono"',MUTED,a*.8,'center');
    const p=clamp((t-34)/9);const series=[[0.99,LIME,'1% risk'],[0.90,RED,'10% risk']];
    series.forEach(([f,col,lab],si)=>{const steps=p*10;x.save();x.globalAlpha=a;x.strokeStyle=col;x.lineWidth=8;x.lineJoin='round';x.lineCap='round';x.beginPath();
      let lastX=L,lastY=v2y(10000),v=10000;x.moveTo(lastX,lastY);
      for(let i=1;i<=10;i++){const fr=clamp(steps-(i-1));if(fr<=0)break;const nv=v*f;const X1=L+(R-L)*(i-1+fr)/10;const Y1=v2y(v+(nv-v)*fr);x.lineTo(X1,Y1);lastX=X1;lastY=Y1;if(fr>=1)v=nv;else{v=v+(nv-v)*fr;break}}
      x.stroke();x.fillStyle=col;x.beginPath();x.arc(lastX,lastY,12,0,7);x.fill();x.restore();
      const lv=Math.round(v);text(lv.toLocaleString('en-US'),Math.max(lastX-20,L+230),lastY+(si?60:-28),'800 44px "Inter Tight"',col,a*prog(t,35.2,35.8),'right')});
    const e=prog(t,43.5,44.5)*a;text('1% risk: −9.6%',72,1200,'800 46px "Inter Tight"',LIME,e);text('10% risk: −65.1%',W-72,1200,'800 46px "Inter Tight"',RED,e,'right')}
  // 48-56 recovery
  if(t>=48.2&&t<56.4){const a=prog(t,48.2,49)*(t<55.8?1:fadeOut(t,55.8,56.4));kicker('THE WAY BACK',a);
    text('To get back to 10,000',72,330,'800 70px "Inter Tight"',WHITE,a);
    const b=prog(t,49.5,50.5)*a;text('After 1% losses you need',72,520,'600 40px "Inter Tight"',MUTED,b);chrome('+10.6%',72,700,170,b);
    const d=prog(t,51.5,52.5)*a;text('After 10% losses you need',72,860,'600 40px "Inter Tight"',MUTED,d);
    x.save();x.globalAlpha=d;x.font='900 170px "Inter Tight"';x.fillStyle=RED;x.fillText('+187%',72,1040);x.restore();
    const e=prog(t,53.5,54.3)*a;text('Small losses heal. Big ones become a project.',72,1170,'700 38px "Inter Tight"',WHITE,e)}
  // 56-62 outro
  if(t>=56.2){const a=prog(t,56.2,57);kicker('REMEMBER',a);
    wrap(['Size first.'],72,520,'800 120px "Inter Tight"',WHITE,120,a);wrap(['Everything','else second.'],72,660,'800 120px "Inter Tight"',LIME,124,prog(t,57,57.8));
    const b=prog(t,58.5,59.3);text('Follow Hotcoin for a new 101 every week.',72,1080,'700 40px "Inter Tight"',WHITE,b);
    text('Not financial advice. Futures trading is high risk.',72,1140,'600 28px "Inter Tight"',MUTED,b)}
  grain()};
</script></body></html>`;

const br = await chromium.launch(); const p = await br.newPage({viewport: {width: 1080, height: 1350}});
await p.setContent(html, {waitUntil: 'networkidle'});
await p.evaluate(async () => { await document.fonts.ready; await new Promise(r => { const i = new Image(); i.onload = r; i.src = document.querySelector('script').textContent.match(/logo.src='([^']+)'/)[1]; }); });
const ok = await p.evaluate(() => ['800 50px "Inter Tight"', '900 50px "Inter Tight"', '700 20px "JetBrains Mono"'].every(f => document.fonts.check(f)));
if (!ok) throw new Error('fonts not loaded');
const canvas = await p.$('#c');
const TEST = (process.env.TEST || '').split(',').filter(Boolean).map(Number);
const list = TEST.length ? TEST.map(t => Math.round(t * FPS)) : [...Array(N).keys()];
for (const i of list) {
  const t = i / FPS;
  const b64 = await p.evaluate((t) => { window.draw(t); return document.getElementById('c').toDataURL('image/jpeg', 0.92).split(',')[1]; }, t);
  fs.writeFileSync(`${OUT}/${String(i).padStart(5, '0')}.jpg`, Buffer.from(b64, 'base64'));
}
await br.close();
console.log('frames', N);
