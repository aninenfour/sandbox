// Hotcoin x CoinGlass scene: one HTML page driven by window.setT(seconds). Used for the stills and for the video frames.
// Facts (CoinGlass "Exchanges" ranking, Nov 12, 2026): Hotcoin #13, 24h volume $6.17B, open interest $155.44M, taker 0.06% / maker 0.02%.
// Other exchanges are anonymous rows (never named). CoinGlass logo = their own files from cdn.coinglasscdn.com (fetch-logos.py).
const BR = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/';
const AS = 'file:///home/user/sandbox/social/coinglass-collab/assets/';
export const LIME = '#B8F26A', GREEN = '#7EC25A', DEEP = '#2F5A17', INK = '#0B0E11';

const css = (W, H) => `@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;font-family:'Inter Tight',sans-serif;color:#fff;
  background:radial-gradient(ellipse 85% 65% at 50% 40%,#93D46A 0%,${GREEN} 45%,#4F8A31 100%)}
.m{font-family:'JetBrains Mono',monospace}.abs{position:absolute}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.07) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(255,255,255,.07) 1.5px,transparent 1.5px);
  background-size:${Math.round(W / 10)}px ${Math.round(W / 10)}px;background-position:center;mask-image:radial-gradient(ellipse 75% 70% at 50% 45%,#000 30%,transparent 100%)}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.06) 1px,transparent 1.3px);background-size:5px 5px}
.tile{position:absolute;border-radius:22%;transform-style:preserve-3d}
.tile .rim{position:absolute;inset:0;border-radius:inherit;padding:5px;background:linear-gradient(140deg,#fff 0%,${LIME} 22%,rgba(184,242,106,.35) 55%,#fff 100%);
  box-shadow:0 0 30px rgba(220,255,170,.55),0 40px 80px rgba(20,45,8,.45)}
.tile .face{position:absolute;inset:5px;border-radius:21%;overflow:hidden}
.tile .shine{position:absolute;inset:0;border-radius:inherit;background:linear-gradient(115deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.28) 45%,rgba(255,255,255,0) 60%);background-size:300% 100%}
.tile .gloss{position:absolute;left:0;right:0;top:0;height:48%;background:linear-gradient(180deg,rgba(255,255,255,.22),rgba(255,255,255,0));border-radius:21% 21% 0 0}
.plus{position:absolute;border-radius:50%;background:radial-gradient(circle at 40% 35%,#C9F58C,${GREEN} 60%,${DEEP});border:3px solid #E9FFD0;
  box-shadow:0 0 26px rgba(220,255,170,.9);display:flex;align-items:center;justify-content:center}
.row{position:absolute;left:72px;right:72px;display:flex;align-items:center;border-radius:20px}
.other{height:96px;padding:0 34px;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.22)}
.hot{height:120px;padding:0 40px;background:#fff;color:${INK};box-shadow:0 30px 60px rgba(20,40,8,.35)}
.o13{position:absolute;left:-40px;top:110px;font-weight:800;font-size:860px;letter-spacing:-60px;line-height:1}`;

const tile = (id, x, y, s, face, art) => `<div id="${id}" class="tile" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px">
  <div class="rim"></div><div class="face" style="background:${face}">${art}<div class="gloss"></div><div class="shine"></div></div></div>`;
const cgFace = `radial-gradient(circle at 30% 20%,#2A2F33 0%,${INK} 55%,#000 100%)`;
const hcFace = `radial-gradient(circle at 30% 20%,#4E8A2C 0%,#2C5516 55%,#1B3A0C 100%)`;
const cgArt = (s) => `<img src="${AS}coinglass-mark.png" style="position:absolute;left:50%;top:50%;height:${s * 0.56}px;transform:translate(-50%,-50%)">`;
const hcArt = (s) => `<img src="${BR}symbol-official-white.png" style="position:absolute;left:50%;top:50%;height:${s * 0.46}px;transform:translate(-50%,-50%)">`;
const plus = (x, y, d) => `<div id="plus" class="plus" style="left:${x - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px">
  <svg width="${d * .5}" height="${d * .5}" viewBox="0 0 10 10"><path d="M5 1V9M1 5H9" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></svg></div>`;
const marks = (cx, y, h) => `<div id="marks" class="abs" style="left:0;right:0;top:${y}px;display:flex;justify-content:center;align-items:center;gap:${h * 1.6}px">
  <div style="display:flex;align-items:center;gap:${h * .35}px"><img src="${AS}coinglass-mark.png" style="height:${h * 1.25}px"><img src="${AS}coinglass-word.png" style="height:${h * .78}px"></div>
  <div style="width:2px;height:${h * 1.1}px;background:rgba(255,255,255,.55)"></div>
  <img src="${BR}logo-official-white.png" style="height:${h * .9}px"></div>`;

// 16:9 static (collab key visual)
export function wide() {
  const W = 1920, H = 1080, s = 400;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H)}</style></head><body><div class="dots"></div><div class="grid"></div>
    <div class="abs" style="left:560px;top:120px;width:800px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(230,255,190,.45),rgba(230,255,190,0) 65%)"></div>
    <div style="perspective:1400px;position:absolute;inset:0">
      ${tile('cg', 745, 450, s, cgFace, cgArt(s))}${tile('hc', 1175, 430, s, hcFace, hcArt(s))}</div>
    ${plus(960, 445, 92)}
    ${marks(960, 800, 64)}
    <script>
      document.getElementById('cg').style.transform='rotateY(18deg) rotateZ(-7deg)';
      document.getElementById('hc').style.transform='rotateY(-18deg) rotateZ(7deg)';
      document.querySelectorAll('.shine').forEach(e=>e.style.backgroundPosition='60% 0');
    </script></body></html>`;
}

// 4:5 animated page. window.setT(t) poses every element for time t (seconds).
export const DUR = 13;
export function feed() {
  const W = 1080, H = 1350, s = 330;
  const others = Array.from({length: 30}, (_, i) => i + 1); // 30 anonymous exchanges, in rank order without Hotcoin
  const rowHtml = others.map((i) => `<div class="row other" id="o${i}">
      <div class="m" style="width:72px;font-size:26px;font-weight:700;color:rgba(255,255,255,.75)" data-r></div>
      <div style="width:44px;height:44px;border-radius:99px;background:rgba(255,255,255,.28);margin-right:20px"></div>
      <div style="width:${150 + (i * 53) % 130}px;height:20px;border-radius:10px;background:rgba(255,255,255,.32)"></div><div style="flex:1"></div>
      <div style="width:${90 + (i * 31) % 60}px;height:20px;border-radius:10px;background:rgba(255,255,255,.26)"></div></div>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css(W, H)}</style></head><body><div class="dots"></div><div class="grid" id="grid"></div>
  <div id="glow" class="abs" style="left:90px;top:160px;width:900px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(230,255,190,.45),rgba(230,255,190,0) 65%)"></div>
  <div id="o13w" class="abs" style="inset:0">
    <div class="o13" id="o13fill" style="color:rgba(255,255,255,.12)">13</div>
    <div class="o13" id="o13line" style="color:transparent;-webkit-text-stroke:5px rgba(255,255,255,.9)">13</div></div>
  <img id="logo" src="${BR}logo-official-white.png" class="abs" style="left:72px;top:72px;height:40px">
  <div class="m abs" style="right:72px;top:80px;font-size:18px;letter-spacing:3px">COINGLASS · RANKING</div>
  <div id="title" class="abs" style="left:72px;right:72px;top:168px;display:flex;align-items:center;gap:18px">
    <img src="${AS}coinglass-mark.png" style="height:58px"><div style="font-weight:800;font-size:50px;letter-spacing:-1.5px">Top derivatives exchanges</div></div>
  <div id="list">${rowHtml}</div>
  <div class="row hot" id="hot"><div class="m" id="hr" style="font-size:34px;font-weight:700;width:96px;color:${DEEP}">#13</div>
    <img src="${BR}logo-official-black.png" style="height:40px"><div style="flex:1"></div><div class="m" style="font-size:28px;font-weight:700">$6.17B</div></div>
  <div id="head" class="abs" style="left:72px;right:72px;top:976px;font-weight:800;font-size:64px;letter-spacing:-2px;line-height:1.05">Now ranked on CoinGlass.</div>
  <div id="strip" class="abs" style="left:72px;right:72px;bottom:80px;display:flex;border-top:1.5px solid rgba(255,255,255,.3);padding-top:28px">
    ${[['24H VOLUME', 'v1'], ['OPEN INTEREST', 'v2'], ['TAKER / MAKER', 'v3']].map(([k, id], i) => `<div style="flex:1;${i ? 'border-left:1.5px solid rgba(255,255,255,.3);padding-left:28px' : ''}">
      <div class="m" style="font-size:15px;letter-spacing:2px;color:rgba(255,255,255,.75)">${k}</div><div id="${id}" style="font-weight:700;font-size:${i == 2 ? 32 : 44}px;margin-top:8px"></div></div>`).join('')}</div>
  <div id="collab" class="abs" style="inset:0">
    <div style="perspective:1300px;position:absolute;inset:0">${tile('cg', 365, 580, s, cgFace, cgArt(s))}${tile('hc', 715, 560, s, hcFace, hcArt(s))}</div>
    ${plus(540, 572, 84)}${marks(540, 900, 50)}
    <div id="ctitle" class="abs" style="left:0;right:0;top:1080px;text-align:center;font-weight:800;font-size:60px;letter-spacing:-2px">Hotcoin is live on CoinGlass.</div>
  </div>
  <script>
  const $=id=>document.getElementById(id), cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)), mix=(a,b,u)=>a+(b-a)*u;
  const io=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2, oc=u=>1-Math.pow(1-u,3), oq=u=>1-Math.pow(1-u,5), ss=u=>u*u*(3-2*u);
  const seg=(t,a,b)=>cl((t-a)/(b-a));
  // Hotcoin's position in the list: enters at 26, climbs, nudges past 13 to 12.65, settles on 13.
  window.P=t=>t<4.3?26:t<7.9?26-13.35*io(seg(t,4.3,7.9)):12.65+0.35*oc(seg(t,7.9,8.6));
  const PITCH=112, N=30;
  window.setT=t=>{
    // 1. collab tiles (0 to 3.4s), then they leave
    const fl=Math.sin(t*1.3), out=io(seg(t,2.9,3.9));
    $('cg').style.transform='translate('+(-out*264)+'px,'+(-out*383)+'px) scale('+(1-out*.69)+') rotateY('+(18+fl*4)*(1-out)+'deg) rotateZ('+(-7+fl*1.5)*(1-out)+'deg)';
    $('hc').style.transform='translate('+(-out*487)+'px,'+(out*100)+'px) scale('+(1-out*.74)+') rotateY('+(-18-fl*4)*(1-out)+'deg) rotateZ('+(7-fl*1.5)*(1-out)+'deg)';
    $('cg').style.opacity=1-seg(t,3.7,3.95); $('hc').style.opacity=1-seg(t,3.75,4.0);
    document.querySelectorAll('#collab .shine').forEach(e=>e.style.backgroundPosition=(100-ss(seg(t,.4,2.4))*100)+'% 0');
    $('plus').style.transform='scale('+(1-io(seg(t,2.8,3.3)))+') rotate('+(io(seg(t,2.8,3.3))*90)+'deg)';
    $('marks').style.opacity=$('ctitle').style.opacity=1-seg(t,2.7,3.2);
    $('marks').style.transform='translateY('+(seg(t,2.7,3.2)*30)+'px)'; $('ctitle').style.transform='translateY('+(seg(t,2.7,3.2)*30)+'px)';
    // 2. ranking list
    const inL=oq(seg(t,3.5,4.3)), hero=io(seg(t,8.8,10.0)), p=P(t), cam=mix(26,13,io(seg(t,4.1,8.2))), CY=660;
    $('title').style.opacity=seg(t,3.65,3.95)*(1-hero); $('title').style.transform='translateY('+(-hero*40)+'px)';
    $('logo').style.opacity=seg(t,3.2,3.9);
    for(let i=1;i<=N;i++){const e=$('o'+i), f=ss(cl(i+1-p)), r=i+f, y=CY+(r-cam)*PITCH;
      const dist=Math.abs(r-cam), fade=cl(1-(dist-2.4)/1.1);
      const spread=(r<13?-1:1)*hero*260;
      e.style.top=(y-48+spread+(1-inL)*120)+'px'; e.style.opacity=fade*inL*(1-hero);
      e.querySelector('[data-r]').textContent=i+(f>.5?1:0);}
    const hy=mix(CY+(p-cam)*PITCH, 880, hero), hIn=oq(seg(t,3.7,4.1));
    $('hot').style.top=(hy-60+(1-hIn)*20)+'px'; $('hot').style.opacity=hIn;
    const lift=Math.sin(Math.PI*seg(t,4.3,8.6)); $('hot').style.transform='scale('+(1+lift*.04)+')';
    $('hot').style.boxShadow='0 '+(30+lift*20)+'px '+(60+lift*30)+'px rgba(20,40,8,'+(.35+lift*.1)+'), 0 0 0 '+(seg(t,8.0,8.6)*(1-hero)*10)+'px rgba(230,255,190,.6)';
    $('hr').textContent='#'+Math.round(Math.max(13,p));
    // 3. hero: outline 13, headline, stats
    const o=io(seg(t,9.2,10.6)); $('o13line').style.clipPath='inset('+((1-o)*100)+'% 0 0 0)';
    $('o13fill').style.opacity=seg(t,9.8,10.8); $('o13w').style.transform='scale('+(1.06-.06*oc(seg(t,9.2,11)))+')'; $('o13w').style.transformOrigin='30% 50%';
    const hh=oq(seg(t,9.7,10.6)); $('head').style.opacity=hh; $('head').style.transform='translateY('+((1-hh)*40)+'px)';
    const st=oq(seg(t,10.0,11.4)); $('strip').style.opacity=seg(t,9.9,10.4); $('strip').style.transform='translateY('+((1-seg(t,9.9,10.6))*30)+'px)';
    $('v1').textContent='$'+(6.17*st).toFixed(2)+'B'; $('v2').textContent='$'+(155.44*st).toFixed(2)+'M'; $('v3').textContent=(.06*st).toFixed(2)+'% / '+(.02*st).toFixed(2)+'%';
    $('glow').style.opacity=1-inL*.5+hero*.3;
  };
  window.setT(0);
  </script></body></html>`;
}
