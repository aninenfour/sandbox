// Hotcoin dot: anime-style test scene (10 s, 4:5 1080x1350, 30 fps). Everything is drawn in code on a canvas:
// sky, sun glare, cel-shaded clouds, god rays, sparkles and the 101 mascot (one eye, loop on top, no mouth).
// Beats: asleep on a cloud -> wakes -> looks around -> sees the sunrise -> determined -> hops off toward the sun -> logo.
// Music: make-music.py (original, numpy). Run: PW_PATH=$(npm root -g)/playwright node social/dot-anime/render.mjs [frames|video]
import {createRequire} from 'module';
import {spawn} from 'child_process';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = new URL('.', import.meta.url).pathname;
const MODE = process.argv[2] || 'frames';
const FPS = 30, DUR = 10;
const LOGO = 'file://' + DIR + '../../hotcoin-tradfi/public/brand/logo-official-white.png';

const html = `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0}body{width:1080px;height:1350px;overflow:hidden;background:#000}
#logo{position:absolute;left:50%;top:150px;height:64px;transform:translateX(-50%);opacity:0;filter:drop-shadow(0 4px 18px rgba(40,40,90,.35))}</style></head><body>
<canvas id="c" width="1080" height="1350"></canvas><img id="logo" src="${LOGO}">
<script>
const W=1080,H=1350,c=document.getElementById('c'),x=c.getContext('2d');
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)), ease=(v)=>{v=cl(v);return v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2}, eo=(v)=>1-Math.pow(1-cl(v),3);
const seg=(t,a,b)=>cl((t-a)/(b-a)), lerp=(a,b,k)=>a+(b-a)*k;
let s=7; const rnd=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};
// cloud shapes: arrays of blobs (relative x, y, r)
function makeCloud(n,w,h){const b=[];for(let i=0;i<n;i++){const u=i/(n-1);b.push([(u-.5)*w,(Math.sin(u*Math.PI))*-h*(.55+rnd()*.45),h*(.35+rnd()*.45)])}
 for(let i=0;i<n;i++)b.push([(rnd()-.5)*w*.9,h*(.05+rnd()*.15),h*(.3+rnd()*.25)]);return b}
const L={far:[],mid:[],near:[]};
for(let i=0;i<9;i++)L.far.push({x:i*150-80,y:790+rnd()*20,c:makeCloud(7,240,50)});
for(let i=0;i<7;i++)L.mid.push({x:i*210-120,y:930+rnd()*50,c:makeCloud(8,300,80)});
for(let i=0;i<5;i++)L.near.push({x:i*300-150,y:1390+rnd()*40,c:makeCloud(9,420,120)});
const hero={x:360,y:1250,c:makeCloud(10,560,120)};
const SP=[];for(let i=0;i<90;i++)SP.push([rnd()*W,rnd()*H,rnd()*2+1,rnd()*6.28,rnd()*.6+.2]);
const BURST=[];for(let i=0;i<26;i++)BURST.push([rnd()*6.28,rnd()*260+120,rnd()*3+2]);
function blobPath(cd,ox,oy,k=1){const p=new Path2D();for(const [bx,by,r] of cd){p.moveTo(ox+bx*k+r*k,oy+by*k);p.arc(ox+bx*k,oy+by*k,r*k,0,6.283)}return p}
function cloud(cd,ox,oy,lit,shade,rim,k=1){const p=blobPath(cd,ox,oy,k);x.save();x.fillStyle=shade;x.fill(p);x.clip(p);
 x.fillStyle=lit;x.fill(blobPath(cd,ox-8*k,oy-22*k,k));
 x.globalAlpha=.55;x.fillStyle=rim;x.fill(blobPath(cd,ox-16*k,oy-34*k,k*.97));x.restore()}
const SUN={x:800,y:700};
function sky(t){const g=x.createLinearGradient(0,0,0,820);g.addColorStop(0,'#5d74bd');g.addColorStop(.35,'#9d8fd0');g.addColorStop(.62,'#e9a9b8');g.addColorStop(.82,'#ffc99a');g.addColorStop(1,'#fff0c4');
 x.fillStyle=g;x.fillRect(-200,-200,W+400,H+400);
 const r=x.createRadialGradient(SUN.x,SUN.y,10,SUN.x,SUN.y,620);r.addColorStop(0,'rgba(255,250,225,1)');r.addColorStop(.08,'rgba(255,236,180,.95)');r.addColorStop(.3,'rgba(255,200,150,.35)');r.addColorStop(1,'rgba(255,190,160,0)');
 x.fillStyle=r;x.fillRect(-200,-200,W+400,H+400);
 x.save();x.globalCompositeOperation='lighter';x.translate(SUN.x,SUN.y);x.rotate(t*.03);
 for(let i=0;i<14;i++){x.rotate(6.283/14);x.fillStyle='rgba(255,230,180,'+(.035+.02*Math.sin(t*1.3+i))+')';x.beginPath();x.moveTo(0,0);x.lineTo(1400,-60);x.lineTo(1400,60);x.fill()}
 x.restore();x.fillStyle='#fffbe8';x.beginPath();x.arc(SUN.x,SUN.y,46,0,6.283);x.fill()}
function layer(arr,t,speed,lit,shade,rim,k){for(const o of arr){let ox=((o.x+t*speed)%(W+600)+(W+600))%(W+600)-300;cloud(o.c,ox,o.y,lit,shade,rim,k)}}
// ---------- the dot ----------
function dot(cx,cy,R,st){x.save();x.translate(cx,cy);x.rotate(st.rot||0);x.scale(st.sx,st.sy);
 const ol='#1d3a14',lw=R*.065;x.lineJoin='round';x.lineCap='round';
 // legs
 for(const sgn of [-1,1]){x.save();x.translate(sgn*R*.36,R*.86);x.rotate(sgn*(st.legs||0));x.fillStyle='#3f8a26';x.strokeStyle=ol;x.lineWidth=lw;
  x.beginPath();x.roundRect(-R*.13,-R*.05,R*.26,R*.34,R*.13);x.fill();x.stroke();x.restore()}
 // arms
 for(const sgn of [-1,1]){x.save();x.translate(sgn*R*.95,R*.18);x.rotate(sgn*(st.arms||.5));x.fillStyle='#5aa834';x.strokeStyle=ol;x.lineWidth=lw;
  x.beginPath();x.roundRect(-R*.11,-R*.02,R*.22,R*.42,R*.11);x.fill();x.stroke();x.restore()}
 // loop on top
 x.strokeStyle=ol;x.lineWidth=R*.2;x.beginPath();x.arc(0,-R*1.02,R*.2,Math.PI*1.08,Math.PI*1.92);x.stroke();
 x.strokeStyle='#6cbb3c';x.lineWidth=R*.1;x.beginPath();x.arc(0,-R*1.02,R*.2,Math.PI*1.1,Math.PI*1.9);x.stroke();
 // body
 const g=x.createRadialGradient(-R*.35,-R*.4,R*.1,0,0,R*1.05);g.addColorStop(0,'#dcff9a');g.addColorStop(.45,'#93d454');g.addColorStop(1,'#4a9a2b');
 x.fillStyle=g;x.beginPath();x.arc(0,0,R,0,6.283);x.fill();
 x.save();x.beginPath();x.arc(0,0,R,0,6.283);x.clip();
 x.fillStyle='rgba(28,72,22,.35)';x.beginPath();x.arc(-R*.28,R*.32,R*.95,0,6.283);x.arc(R*.3,-R*.25,R*1.05,0,6.283,true);x.fill('evenodd');
 x.strokeStyle='rgba(255,214,140,.85)';x.lineWidth=R*.12;x.beginPath();x.arc(0,0,R*.98,-1.2,.7);x.stroke();
 x.fillStyle='rgba(255,255,255,.75)';x.beginPath();x.ellipse(-R*.48,-R*.55,R*.2,R*.11,-.7,0,6.283);x.fill();x.restore();
 x.strokeStyle=ol;x.lineWidth=lw;x.beginPath();x.arc(0,0,R,0,6.283);x.stroke();
 // eye
 const ex=0,ey=-R*.04,erx=R*.6,ery=R*.64;
 x.save();x.beginPath();x.ellipse(ex,ey,erx,ery,0,0,6.283);x.fillStyle='#fbfff4';x.fill();x.clip();
 const ix=ex+st.lx*R*.2,iy=ey+st.ly*R*.18;
 x.fillStyle='#3b8f2a';x.beginPath();x.arc(ix,iy,R*.33,0,6.283);x.fill();
 x.fillStyle='#1f5a17';x.beginPath();x.arc(ix,iy,R*.25,0,6.283);x.fill();
 x.fillStyle='#07120a';x.beginPath();x.arc(ix,iy,R*.15,0,6.283);x.fill();
 x.fillStyle='#fff';x.beginPath();x.arc(ix-R*.1,iy-R*.11,R*.075,0,6.283);x.fill();x.beginPath();x.arc(ix+R*.08,iy+R*.08,R*.035,0,6.283);x.fill();
 // lids (closed amount + determined narrowing)
 const top=ey-ery, lidY=top+ery*2*(1-st.open)+ery*1.0*st.narrow*st.open;
 x.fillStyle='#86c94b';x.fillRect(ex-erx-5,top-5,erx*2+10,lidY-top+5);
 x.strokeStyle=ol;x.lineWidth=lw*.9;x.beginPath();x.moveTo(ex-erx,lidY+st.narrow*R*.12);x.lineTo(ex+erx,lidY-st.narrow*R*.05);x.stroke();
 if(st.open<1){const by=ey+ery-ery*2*st.open;x.fillStyle='#86c94b';x.fillRect(ex-erx-5,Math.max(by,lidY),erx*2+10,ery*3)}
 x.restore();
 x.strokeStyle=ol;x.lineWidth=lw;x.beginPath();x.ellipse(ex,ey,erx,ery,0,0,6.283);x.stroke();
 if(st.open<.15){x.strokeStyle=ol;x.lineWidth=lw;x.beginPath();x.moveTo(ex-erx*.82,ey+ery*.55);x.lineTo(ex+erx*.82,ey+ery*.55);x.stroke();for(const k of [-.45,0,.45]){x.beginPath();x.moveTo(ex+erx*k,ey+ery*.55);x.lineTo(ex+erx*k*1.15,ey+ery*.72);x.stroke()}}
 x.restore()}
// ---------- timeline ----------
window.draw=(t)=>{
 const zoom=1+.07*ease(t/10), camY=60*ease(seg(t,6.4,8.6));
 x.setTransform(1,0,0,1,0,0);x.save();x.translate(W/2,H/2);x.scale(zoom,zoom);x.translate(-W/2,-H/2+camY);
 sky(t);
 layer(L.far,t,6,'#ffd9bd','#c99ac0','#fff1de',1);
 layer(L.mid,t,11,'#ffe7d2','#b58bbd','#fff8ee',1);
 // sparkles
 x.save();x.globalCompositeOperation='lighter';for(const [px,py,r,ph,a] of SP){const yy=(py-t*14)%H;x.fillStyle='rgba(255,240,200,'+(a*(.5+.5*Math.sin(t*2+ph)))+')';x.beginPath();x.arc((px+t*9)%W,yy<0?yy+H:yy,r,0,6.283);x.fill()}x.restore();
 // dot state
 const open=t<1?0:(t<1.45?eo(seg(t,1,1.45)):(t>4.5&&t<4.85?1-Math.sin(seg(t,4.5,4.85)*Math.PI):1));
 let lx=0,ly=0; if(t>1.6){const a=ease(seg(t,1.6,2.1))-ease(seg(t,2.6,3.1));lx=-a*.9;} if(t>2.9){lx+=ease(seg(t,2.9,3.4))*.85;ly=-ease(seg(t,2.9,3.4))*.35}
 if(t<1){lx=0;ly=0}
 const narrow=.38*ease(seg(t,5,5.4));
 const breathe=1+.018*Math.sin(t*3.2);
 let sx=1/breathe,sy=breathe,px=360,py=1010,rot=0,arms=.5,legs=0;
 if(t<1){sy=1+.03*Math.sin(t*2.4);sx=1/sy}
 const sq=ease(seg(t,5.6,6.4)); sy-=.18*sq; sx+=.12*sq; py+=24*sq; arms=.5+1.2*sq;
 if(t>=6.4){const u=seg(t,6.4,8.4),k=eo(u);px=lerp(360,1200,k);py=lerp(1034,260,k)-260*Math.sin(Math.PI*Math.min(1,u*1.2))*(1-u*.6);
  const st=Math.max(0,1-u*3);sy=1+.2*st;sx=1-.13*st;rot=.35*k;arms=-1.2;legs=.4}
 // hero cloud (in front of mid, behind the dot's feet)
 cloud(hero.c,hero.x-t*4,hero.y,'#fff0e0','#b98fc0','#ffffff',1);
 // takeoff burst + speed lines
 if(t>6.3&&t<7.6){const u=seg(t,6.3,7.6);x.save();x.globalCompositeOperation='lighter';for(const [ang,d,r] of BURST){x.fillStyle='rgba(255,246,210,'+(1-u)+')';x.beginPath();x.arc(360+Math.cos(ang)*d*eo(u),1120+Math.sin(ang)*d*eo(u)*.5,r,0,6.283);x.fill()}x.restore()}
 if(t>6.5&&t<8.2){x.save();x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=4;for(let i=0;i<7;i++){const o=(i-3)*28,len=120+i*14;x.beginPath();x.moveTo(px-Math.cos(-.65)*(160+len)-o*.6,py+Math.sin(.65)*(160+len)+o);x.lineTo(px-Math.cos(-.65)*160-o*.6,py+Math.sin(.65)*160+o);x.stroke()}x.restore()}
 dot(px,py,125,{sx,sy,rot,arms,legs,open,lx,ly,narrow});
 layer(L.near,t,18,'#ffece0','#a77fb5','#fffaf2',1.05);
 x.restore();
 // flash + vignette + grain
 const fl=Math.max(0,1-Math.abs(t-8.6)/0.7)*.55;
 x.fillStyle='rgba(255,246,222,'+fl+')';x.fillRect(0,0,W,H);
 const v=x.createRadialGradient(W/2,H*.55,H*.3,W/2,H*.55,H*.85);v.addColorStop(0,'rgba(40,20,60,0)');v.addColorStop(1,'rgba(40,20,60,.35)');x.fillStyle=v;x.fillRect(0,0,W,H);
 document.getElementById('logo').style.opacity=eo(seg(t,8.7,9.4));
};
</script></body></html>`;
const f = DIR + `_a-${process.pid}.html`;
fs.writeFileSync(f, html);
const b = await chromium.launch({args: ['--allow-file-access-from-files']});
const p = await b.newPage({viewport: {width: 1080, height: 1350}});
await p.goto('file://' + f); await p.waitForTimeout(500);
fs.mkdirSync(DIR + 'out', {recursive: true});
if (MODE === 'frames') {
  for (const t of [0.5, 1.6, 3.4, 5.3, 6.2, 7.0, 7.8, 9.6]) {
    await p.evaluate((t) => window.draw(t), t);
    await p.screenshot({path: DIR + `out/f-${t}.jpg`, type: 'jpeg', quality: 88});
  }
} else {
  const ff = spawn('/usr/bin/ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-pix_fmt', 'yuv420p', DIR + 'out/dot-silent.mp4']);
  for (let i = 0; i < DUR * FPS; i++) {
    await p.evaluate((t) => window.draw(t), i / FPS);
    ff.stdin.write(await p.screenshot({type: 'jpeg', quality: 92}));
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
}
await b.close(); fs.unlinkSync(f); console.log('ok', MODE);
