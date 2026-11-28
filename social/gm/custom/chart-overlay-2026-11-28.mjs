import fs from 'fs'; import {createRequire} from 'module';
const require = createRequire(import.meta.url); const {chromium} = require(process.env.PW_PATH);
const D = '/tmp/claude-0/-home-user-sandbox/6fc3896b-19e5-5018-9bda-b96740ccd586/scratchpad';
const bg = 'data:image/jpeg;base64,' + fs.readFileSync(D + '/bw1080.jpg').toString('base64');
const L = '#B8F26A';
// price path: choppy, rising, ends at the cup rim (480, 858)
const pts = [[-10,1120],[50,1098],[95,1112],[140,1070],[185,1084],[230,1040],[262,1056],[300,1002],[318,1018],[340,985],[350,930],[366,878],[480,812]];
const path = pts.map((p,i)=>(i?'L':'M')+p.join(',')).join(' ');
const area = pts.slice(0,-1).map((p,i)=>(i?'L':'M')+p.join(',')).join(' ') + ' L366,1350 L-10,1350 Z';
// small candles along the path (body around the point)
const candles = pts.slice(1,-1).map(([x,y],i)=>{const up=i%3!==1, h=22+((i*7)%14); return `<line x1="${x}" y1="${y-h-10}" x2="${x}" y2="${y+h/2+10}" stroke="${up?L:'#F6465D'}" stroke-opacity=".55" stroke-width="1.5"/><rect x="${x-5}" y="${y-h/2}" width="10" height="${h}" fill="${up?L:'#F6465D'}" fill-opacity=".55"/>`;}).join('');
const grid = [880,960,1040,1120].map(y=>`<line x1="0" x2="1080" y1="${y}" y2="${y}" stroke="#fff" stroke-opacity=".16" stroke-dasharray="3 7"/>`).join('');
const ticks = [[880,'+3.2%'],[960,'+2.1%'],[1040,'+1.0%'],[1120,'0.0%']].map(([y,t])=>`<text x="1060" y="${y-8}" text-anchor="end" font-family="JetBrains Mono" font-size="20" fill="#fff" fill-opacity=".7" letter-spacing="1">${t}</text>`).join('');
const html = `<!doctype html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=block');body{margin:0;width:1080px;height:1350px;position:relative;overflow:hidden}</style></head><body>
<img src="${bg}" style="position:absolute;inset:0;width:1080px;height:1350px">
<svg width="1080" height="1350" style="position:absolute;inset:0">
 <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${L}" stop-opacity=".22"/><stop offset="1" stop-color="${L}" stop-opacity="0"/></linearGradient>
 <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
 ${grid}${ticks}
 <path d="${area}" fill="url(#g)"/>
 ${candles}
 <path d="${path}" fill="none" stroke="${L}" stroke-width="3.2" stroke-linejoin="round" filter="url(#glow)"/>
 <circle cx="480" cy="812" r="9" fill="${L}"/><circle cx="480" cy="812" r="20" fill="none" stroke="${L}" stroke-opacity=".6" stroke-width="2"/>
 <line x1="480" y1="812" x2="1080" y2="812" stroke="${L}" stroke-opacity=".7" stroke-dasharray="6 6" stroke-width="1.5"/>
</svg>
<div style="position:absolute;right:20px;top:792px;background:${L};color:#0B0E11;font:700 22px 'JetBrains Mono';letter-spacing:2px;padding:6px 12px 5px">GM</div>
</body></html>`;
const br = await chromium.launch(); const p = await br.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:2});
await p.setContent(html,{waitUntil:'networkidle'}); await p.waitForTimeout(300);
await p.screenshot({path: D + '/bwchart/out.png'}); await br.close();
