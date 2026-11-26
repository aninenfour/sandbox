// LinkedIn carousel slides (1080x1350 @2x) for the week of Nov 26, 2026. Cover = the matching linkedin/covers render.
// Style: ink ground, brand-green shape, light film grain, official logo, Inter Tight + JetBrains Mono, no italics.
// Sources:
//  - bots: Birdeye estimate as reported by BeInCrypto (Nov 2026): ~2/3 of on-chain trades by bots, 1 to 3% of wallets,
//    up to 80% of Solana volume automated; methodology due Dec 2026.
//  - hiring: moledao.io/companies/hotcoin/jobs/ (21 listings, 16 distinct roles), pulled Nov 26, 2026.
// Run: node linkedin/carousels/slides.mjs <deck>   -> linkedin/carousels/out/<deck>/NN.png + <deck>.pdf
import fs from 'fs'; import path from 'path'; import {createRequire} from 'module'; import {execFileSync} from 'child_process';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH || 'playwright');
const DIR = path.dirname(new URL(import.meta.url).pathname), ROOT = path.resolve(DIR, '../..');
const b64 = (f, t = 'image/png') => `data:${t};base64,` + fs.readFileSync(f).toString('base64');
const LOGO_W = b64(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-white.png`);

const shell = (inner, n, total, opts = {}) => `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+SC:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:#07090A;color:#F2F4EF;font-family:'Inter Tight','Noto Sans SC',sans-serif;overflow:hidden;position:relative}
.k{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:20px;letter-spacing:4px;color:#B8F26A;text-transform:uppercase}
.h{font-weight:800;font-size:84px;letter-spacing:-3.5px;line-height:1.02;margin-top:18px}
.s{font-weight:600;font-size:36px;letter-spacing:-.6px;line-height:1.3;color:rgba(242,244,239,.82);margin-top:24px}
.big{font-weight:900;font-size:300px;letter-spacing:-14px;line-height:.9;background:linear-gradient(180deg,#fff 20%,#B8F26A 140%);-webkit-background-clip:text;color:transparent}
.row{display:flex;gap:28px;align-items:flex-start;padding:30px 0;border-top:1px solid rgba(255,255,255,.18)}
.row .n{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:26px;color:#B8F26A;min-width:56px;padding-top:6px}
.row .t{font-weight:700;font-size:40px;letter-spacing:-.8px;line-height:1.2}
.row .t small{display:block;font-weight:500;font-size:28px;color:rgba(242,244,239,.7);letter-spacing:-.2px;margin-top:6px}
.job{display:grid;grid-template-columns:1fr auto;gap:6px 24px;padding:30px 0;border-top:1px solid rgba(255,255,255,.18);align-items:baseline}
.job .r{font-weight:700;font-size:44px;letter-spacing:-.6px;line-height:1.15}
.job .zh{font-weight:500;font-size:28px;margin-top:4px;color:rgba(242,244,239,.6)}
.job .p{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:30px;color:#B8F26A;text-align:right;white-space:nowrap}
.job .w{font-family:'JetBrains Mono',monospace;font-size:24px;margin-top:4px;color:rgba(242,244,239,.65);text-align:right;white-space:nowrap}
.pg{position:absolute;right:72px;top:76px;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:20px;letter-spacing:3px;color:rgba(242,244,239,.6)}
</style></head><body>
<svg width="1080" height="1350" style="position:absolute;inset:0"><circle cx="${opts.cx ?? 1120}" cy="${opts.cy ?? 1240}" r="460" fill="#163F26"/><circle cx="${opts.cx2 ?? -60}" cy="${opts.cy2 ?? 1330}" r="150" fill="#0E2A19"/></svg>
<img src="${LOGO_W}" style="position:absolute;left:72px;top:68px;height:40px">
<div class="pg">${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}</div>
<div style="position:absolute;left:72px;right:72px;top:170px;bottom:90px;display:flex;flex-direction:column">${inner}</div>
<canvas id="g" width="1080" height="1350" style="position:absolute;inset:0;mix-blend-mode:overlay;opacity:.16"></canvas>
<script>(async()=>{await document.fonts.ready;const g=document.getElementById('g').getContext('2d'),d=g.createImageData(1080,1350);let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<d.data.length;i+=4){const v=r()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}g.putImageData(d,0,0);document.body.dataset.done=1})();</script>
</body></html>`;

const JOBS = JSON.parse(fs.readFileSync(`${DIR}/hotcoin-jobs.json`, 'utf8'));
const jobRows = (ids) => ids.map(id => { const j = JOBS.find(x => x.key === id); return `<div class="job"><div><div class="r">${j.en}</div><div class="zh">${j.zh}</div></div><div><div class="p">${j.pay || 'Pay on request'}</div><div class="w">${j.where}</div></div></div>`; }).join('');

const DECKS = {
  bots: {cover: `${ROOT}/linkedin/covers/out/thu-bots.png`, slides: [
    `<div class="k">The estimate</div><div class="big" style="margin-top:40px">~2/3</div><div class="h" style="font-size:72px">of on-chain crypto trades<br>are made by bots.</div><div class="s">They come from just <b style="color:#B8F26A">1 to 3%</b> of wallets.</div>`,
    `<div class="k">Read it right</div><div class="h">It counts trades,<br>not volume.</div><div class="s">One bot can fire hundreds of small trades a minute. Each one counts once, whatever its size. So “2/3 of trades” does not mean bots move 2/3 of the money.</div>`,
    `<div class="k">Where it's highest</div><div class="big" style="margin-top:40px">80%</div><div class="h" style="font-size:72px">of Solana volume<br>can be automated.</div><div class="s">The data is on-chain, where every trade is public. Exchange order books can't be split into human and machine trades this way.</div>`,
    `<div class="k">How a bot is spotted</div><div class="h" style="margin-bottom:40px">Things no human<br>can do.</div>
     <div class="row"><div class="n">01</div><div class="t">Several trades per second<small>from the same wallet</small></div></div>
     <div class="row"><div class="n">02</div><div class="t">Buys within seconds of a listing<small>before a person could read the news</small></div></div>
     <div class="row"><div class="n">03</div><div class="t">Complex contract calls<small>many steps bundled into one move</small></div></div>`,
    `<div class="k">If you trade by hand</div><div class="h" style="margin-bottom:40px">Don't race them.<br>Out-discipline them.</div>
     <div class="row"><div class="n">01</div><div class="t">Skip the speed game<small>you won't be first to a listing</small></div></div>
     <div class="row"><div class="n">02</div><div class="t">Win on size, stops and time frame<small>where machines have no edge over you</small></div></div>
     <div class="row"><div class="n">03</div><div class="t">Automate the boring part<small>a trading bot follows your rules, every time</small></div></div>`,
    `<div class="k">Sources</div><div class="h" style="font-size:56px">Birdeye on-chain estimate, reported by BeInCrypto, Nov 2026.</div><div class="s">Full methodology is due in December 2026, so treat the numbers as an estimate. Not financial advice.</div><div style="margin-top:auto"><div class="h" style="font-size:72px">Follow Hotcoin<br>for weekly <span style="color:#B8F26A">data</span>.</div></div>`,
  ]},
  hiring: {cover: `${ROOT}/linkedin/covers/out/thu-hiring.png`, slides: [
    `<div class="k">BD and partnerships · 5 roles</div><div class="h" style="font-size:84px;margin-bottom:36px">Grow the network.</div>${jobRows(['bdlead', 'futbd', 'futbd-euus', 'spotbd', 'c2c'])}`,
    `<div class="k">Growth and operations · 3 roles</div><div class="h" style="font-size:84px;margin-bottom:36px">Grow the users.</div>${jobRows(['web3growth', 'usergrowth', 'futops'])}`,
    `<div class="k">Product, tech and media · 3 roles</div><div class="h" style="font-size:84px;margin-bottom:36px">Build and tell it.</div>${jobRows(['pm', 'cfd', 'media'])}`,
    `<div class="k">Interns, language and support · 5 roles</div><div class="h" style="font-size:84px;margin-bottom:36px">Start here.</div>${jobRows(['ai-intern', 'seo-intern', 'growth-intern', 'pt', 'cs'])}`,
    `<div class="k">How to apply</div><div class="h">Apply on Moledao<br>or DM us here.</div><div class="s">All 16 roles, with full descriptions:<br><b style="color:#B8F26A">moledao.io/companies/hotcoin/jobs</b></div>
     <div style="margin-top:auto;display:flex;gap:40px;align-items:flex-end"><img src="${b64(`${DIR}/out/hiring-qr.png`)}" style="width:300px;height:300px;border-radius:16px;background:#fff;padding:18px"><div class="s" style="margin:0 0 10px">Scan to see every open role.<br>Know someone? Tag them below.</div></div>`,
  ]},
};

const deck = process.argv[2]; const D = DECKS[deck]; if (!D) throw new Error('deck? ' + Object.keys(DECKS));
const OUT = `${DIR}/out/${deck}`; fs.mkdirSync(OUT, {recursive: true});
const total = D.slides.length + 1;
fs.copyFileSync(D.cover, `${OUT}/01.png`);
const br = await chromium.launch(); const p = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [i, inner] of D.slides.entries()) {
  await p.setContent(shell(inner, i + 2, total, i % 2 ? {cx: -120, cy: 1250, cx2: 1100, cy2: 1320} : {}), {waitUntil: 'networkidle'});
  await p.waitForSelector('body[data-done]'); await p.waitForTimeout(120);
  const ov = await p.evaluate(() => { const c = document.querySelector('body>div:nth-of-type(2)'); return c.scrollHeight - c.clientHeight; });
  if (ov > 2) console.warn(`slide ${i + 2}: content overflows by ${ov}px`);
  await p.screenshot({path: `${OUT}/${String(i + 2).padStart(2, '0')}.png`});
}
await br.close();
execFileSync('python3', ['-c', `
import glob
from PIL import Image
fs=sorted(glob.glob('${OUT}/[0-9][0-9].png'))
ims=[Image.open(f).convert('RGB').resize((1080,1350),Image.LANCZOS) for f in fs]
ims[0].save('${OUT}/${deck}.pdf',save_all=True,append_images=ims[1:],resolution=144)
print(len(ims),'pages')`], {stdio: 'inherit'});
