// "The 1% rule" v2, pixel style (owner, Nov 27: v1 was too basic; reference = halftone square-pixel athletes on a solid
// color with one clean text line through the middle). Our version: brand-green ground, real-photo cutouts rebuilt as
// square halftone pixels, numbers and charts built from the same pixels, everything morphing scene to scene.
// Figures: Unsplash (credited in hotcoin-tradfi/FOOTAGE_CREDITS.md), cut out with rembg (linkedin/covers/cut/*-raw.png).
// Math: 10,000 x 0.99^10 = 9,043.82; 10,000 x 0.90^10 = 3,486.78; recovery +10.57% and +186.80%. 100 / 5% = 2,000.
// Run: node linkedin/videos/onepct-pixel.mjs  (TEST=0,5,10 for stills) -> linkedin/videos/out/pframes/*.jpg
import fs from 'fs'; import path from 'path'; import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH || 'playwright');
const DIR = path.dirname(new URL(import.meta.url).pathname), ROOT = path.resolve(DIR, '../..');
const OUT = `${DIR}/out/pframes`; fs.mkdirSync(OUT, {recursive: true});
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const IMG = {
  logo: b64(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-white.png`),
  phone: b64(`${ROOT}/linkedin/covers/cut/phoneman-raw.png`),
  hand: b64(`${ROOT}/linkedin/covers/cut/hand-raw.png`),
  walk: b64(`${ROOT}/linkedin/covers/cut/stairs-raw.png`),
};
const FPS = 30, DUR = 62, N = FPS * DUR;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&display=block');
html,body{margin:0;background:#0E5A31}canvas{display:block}
.w1{font:600 20px 'Inter Tight'}.w2{font:700 20px 'JetBrains Mono'}.w3{font:900 20px 'Inter Tight'}.w4{font:800 20px 'Inter Tight'}
</style></head><body><span class="w1">a</span><span class="w2">a</span><span class="w3">a</span><span class="w4">a</span>
<canvas id="c" width="1080" height="1350"></canvas>
<script>
const W=1080,H=1350,C=14,c=document.getElementById('c'),x=c.getContext('2d');
const BG='#0E5A31',LIGHT='#E6EEDD',MID='#8FC29A',LIME='#B8F26A',TEXT='#EEF3EA',MUTED='rgba(238,243,234,.68)';
const IMG=${JSON.stringify(IMG)};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const load=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=s});
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
// ---- pixel sources -------------------------------------------------------
function fromImage(img,cx,cy,h){ // halftone squares from a cutout, centered at (cx,cy), height h
  const w=h*img.width/img.height,gw=Math.round(w/C),gh=Math.round(h/C);
  const o=document.createElement('canvas');o.width=gw;o.height=gh;const ox=o.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(img,0,0,gw,gh);
  const d=ox.getImageData(0,0,gw,gh).data,out=[],x0=Math.round((cx-w/2)/C)*C,y0=Math.round((cy-h/2)/C)*C;
  let lo=1,hi=0;const L=[];for(let i=0;i<gw*gh;i++){const a=d[i*4+3]/255;if(a<.5){L.push(-1);continue}const l=(0.3*d[i*4]+0.59*d[i*4+1]+0.11*d[i*4+2])/255;L.push(l);lo=Math.min(lo,l);hi=Math.max(hi,l)}
  for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){const l=L[j*gw+i];if(l<0)continue;const b=(l-lo)/Math.max(.001,hi-lo);
    const lv=b>.72?1:b>.45?.78:b>.22?.56:.34;out.push({x:x0+i*C,y:y0+j*C,s:lv,c:b>.45?LIGHT:MID})}
  return out}
function fromText(str,cx,cy,size,color,weight=900){ // solid pixel blocks of big text
  const o=document.createElement('canvas');o.width=W;o.height=H;const ox=o.getContext('2d');ox.font=weight+' '+size+'px "Inter Tight"';ox.textAlign='center';ox.textBaseline='middle';ox.fillStyle='#fff';ox.fillText(str,cx,cy);
  const d=ox.getImageData(0,0,W,H).data,out=[];for(let y=0;y<H;y+=C)for(let xx=0;xx<W;xx+=C){let s=0;for(let k=2;k<C;k+=4)for(let m=2;m<C;m+=4)s+=d[((y+k)*W+xx+m)*4+3];if(s/9>110)out.push({x:xx,y,s:1,c:color})}
  return out}
function chartPts(){ // two pixel lines: 1% (lime) and 10% (light), 10 losses
  const L=150,R=W-150,T=420,B=980,v2y=v=>B-(v/10000)*(B-T),out=[];
  for(let xx=L;xx<=R;xx+=C*2)out.push({x:Math.round(xx/C)*C,y:Math.round(B/C)*C,s:.34,c:MID,k:'axis'});
  [[0.99,LIME],[0.90,LIGHT]].forEach(([f,col])=>{for(let px=L;px<=R;px+=C/2){const st=(px-L)/(R-L)*10;const v=10000*Math.pow(f,st);
    const y=Math.round(v2y(v)/C)*C,xx=Math.round(px/C)*C;out.push({x:xx,y,s:1,c:col,ord:st});out.push({x:xx,y:y+C,s:.56,c:col,ord:st})}});
  return out}
function bars(){ // recovery bars: +10.6% vs +187%, same scale
  const B=1010,sc=430/187,out=[];[[330,10.57,LIME],[750,186.8,LIGHT]].forEach(([cx,v,col])=>{const h=Math.max(C*2,v*sc);
    for(let y=B;y>B-h;y-=C)for(let xx=cx-84;xx<=cx+84;xx+=C)out.push({x:Math.round(xx/C)*C,y:Math.round(y/C)*C,s:1,c:col})});return out}
// ---- scenes: [start, cells, lines] -------------------------------------------
let S=[];
async function build(){const ph=await load(IMG.phone),hd=await load(IMG.hand),wk=await load(IMG.walk);window.LOGO=await load(IMG.logo);
  S=[
    {t:0,cells:fromImage(ph,540,700,1000),lines:[[0,3.4,'Most traders blow up on size,'],[3.4,7.2,'not on being wrong.',LIME]]},
    {t:7.2,cells:fromText('1%',540,470,520,LIME),lines:[[7.9,11.6,'Risk 1% of your account per trade.'],[11.6,14.4,'That is the whole rule.']]},
    {t:14.4,cells:fromImage(hd,560,700,900),lines:[[14.9,20.6,'1% of everything you own, not of the position.']]},
    {t:20.6,cells:fromText('10,000',540,500,250,LIGHT),lines:[[21.2,24.4,'Account: 10,000 USDT']]},
    {t:24.4,cells:fromText('100',540,470,420,LIME),lines:[[24.9,27.8,'Max risk at 1%: 100 USDT']]},
    {t:27.8,cells:fromText('5%',540,470,460,LIGHT),lines:[[28.3,31.2,'Stop: 5% below entry']]},
    {t:31.2,cells:fromText('2,000',540,490,330,LIME),lines:[[31.7,35.6,'Position: 100 ÷ 5% = 2,000 USDT']]},
    {t:35.6,cells:chartPts(),chart:true,lines:[[36.2,41.5,'10 losses in a row. Same luck.'],[41.5,47.4,'Different size.',LIME]]},
    {t:47.4,cells:bars(),bars:true,lines:[[48,54.2,'The way back to 10,000']]},
    {t:54.2,cells:fromImage(wk,540,690,880),lines:[[54.7,58.4,'Size first.'],[58.4,62,'Everything else second.',LIME]]},
  ]}
const MORPH=1.1;
function cellsAt(t){let k=0;for(let i=0;i<S.length;i++)if(t>=S[i].t)k=i;const cur=S[k].cells;
  if(k===0||t-S[k].t>MORPH)return {list:cur,k,m:1};const prev=S[k-1].cells,n=Math.max(prev.length,cur.length),out=[],p=(t-S[k].t)/MORPH;
  for(let i=0;i<n;i++){const a=prev[Math.floor(i*prev.length/n)],b=cur[Math.floor(i*cur.length/n)];const dl=((i*7919)%997)/997*.35;const q=ease((p-dl)/(1-.35));
    out.push({x:a.x+(b.x-a.x)*q,y:a.y+(b.y-a.y)*q,s:a.s+(b.s-a.s)*q,c:q<.5?a.c:b.c,ord:b.ord,k:b.k})}return {list:out,k,m:p}}
function text(str,X,Y,font,color,alpha=1,align='center'){x.save();x.globalAlpha=alpha;x.font=font;x.fillStyle=color;x.textAlign=align;x.textBaseline='middle';x.fillText(str,X,Y);x.restore()}
window.draw=(t)=>{x.fillStyle=BG;x.fillRect(0,0,W,H);
  const {list,k}=cellsAt(t),sc=S[k];const st=t-sc.t;
  let bandY=-999,bandA=0;for(const [a,b] of sc.lines){const al=Math.min(clamp((t-a)/.35),clamp((b-t)/.3));if(al>bandA){bandA=al;bandY=sc.chart?1130:sc.bars?1160:H/2+40}}
  for(const p of list){let s=p.s;
    if(bandA>0){const dy=Math.abs(p.y+C/2-bandY);if(dy<52)s*=1-.72*bandA*(1-dy/80)}
    if(sc.chart&&p.ord!==undefined&&t-sc.t>MORPH){const prog=clamp((st-1.4)/7.5)*10;if(p.ord>prog)s=Math.min(s,.18)}
    const sh=.9+.1*Math.sin(t*2.6+p.x*.031+p.y*.017);const sz=C*.86*s*sh,off=(C-sz)/2;x.fillStyle=p.c;x.fillRect(p.x+off,p.y+off,sz,sz)}
  // chart labels
  if(sc.chart){const a=clamp((st-9)/0.8);text('9,044',W-150,385,'800 54px "Inter Tight"',LIME,a,'right');text('3,487',W-150,860,'800 54px "Inter Tight"',LIGHT,a,'right');
    {const la=clamp((st-1.2)/.6);x.save();x.globalAlpha=la;x.fillStyle=LIME;x.fillRect(150,290,22,22);x.fillStyle=LIGHT;x.fillRect(420,290,22,22);x.restore();
    text('1% risk',186,301,'700 28px "JetBrains Mono"',LIME,la,'left');text('10% risk',456,301,'700 28px "JetBrains Mono"',LIGHT,la,'left')}
    text('START',150,1020,'500 22px "JetBrains Mono"',MUTED,clamp((st-1)/.6),'left');text('LOSS 10',W-150,1020,'500 22px "JetBrains Mono"',MUTED,clamp((st-1)/.6),'right')}
  if(sc.bars){const a=clamp((st-1.2)/.6);text('+10.6%',330,500,'900 72px "Inter Tight"',LIME,a);text('after 1% losses',330,1060,'600 30px "Inter Tight"',TEXT,a);
    text('+187%',750,500,'900 72px "Inter Tight"',LIGHT,a);text('after 10% losses',750,1060,'600 30px "Inter Tight"',TEXT,a)}
  // the one clean line through the middle
  for(const [a,b,str,col] of sc.lines){const al=Math.min(clamp((t-a)/.35),clamp((b-t)/.3));if(al>0){
    const y=sc.chart?1130:sc.bars?1160:H/2+40;text(str,540,y,'700 '+(str.length>34?50:60)+'px "Inter Tight"',col||TEXT,al)}}
  // brand frame
  if(window.LOGO)x.drawImage(window.LOGO,64,60,38*LOGO.width/LOGO.height,38);
  text('HOTCOIN 101 · THE 1% RULE',W-64,80,'700 20px "JetBrains Mono"',MUTED,1,'right');
  if(t>58.6){const a=clamp((t-58.6)/.5);text('Follow Hotcoin for a new 101 every week',540,1230,'700 32px "Inter Tight"',TEXT,a);
    text('Not financial advice. Futures trading is high risk.',540,1280,'600 22px "Inter Tight"',MUTED,a)}};
</script></body></html>`;

const br = await chromium.launch(); const p = await br.newPage({viewport: {width: 1080, height: 1350}});
await p.setContent(html, {waitUntil: 'networkidle'});
await p.evaluate(async () => { for (const f of ['600 50px "Inter Tight"','700 50px "Inter Tight"','800 50px "Inter Tight"','900 50px "Inter Tight"','700 20px "JetBrains Mono"','500 20px "JetBrains Mono"']) await document.fonts.load(f); await document.fonts.ready; await build(); });
const ok = await p.evaluate(() => ['900 50px "Inter Tight"', '700 50px "Inter Tight"', '700 20px "JetBrains Mono"'].every(f => document.fonts.check(f)));
if (!ok) throw new Error('fonts not loaded');
const TEST = (process.env.TEST || '').split(',').filter(Boolean).map(Number);
const list = TEST.length ? TEST.map(t => Math.round(t * FPS)) : [...Array(N).keys()];
if (!TEST.length) for (const f of fs.readdirSync(OUT)) fs.unlinkSync(`${OUT}/${f}`);
for (const i of list) {
  const b = await p.evaluate((t) => { window.draw(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93).split(',')[1]; }, i / FPS);
  fs.writeFileSync(`${OUT}/${TEST.length ? 'test-' : ''}${String(i).padStart(5, '0')}.jpg`, Buffer.from(b, 'base64'));
}
await br.close(); console.log('frames', list.length);
