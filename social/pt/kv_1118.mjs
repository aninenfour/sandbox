// PT launch key visual 18/11/2026: Ronaldinho x Hotcoin futures challenge.
// Period 18/11 15:00 to 29/11 15:00 UTC+8 = 18/11 04:00 to 29/11 04:00 Brasília. Event 1 (first-time futures users): volume tiers 5k..300k USDT ->
//   5..200 USDT Futures Trial Funds, 200,000 USDT pool first come. Event 2 ranking (all users), 200 winners: 1st Patek Philippe Aquanaut + Ronaldinho-signed
//   gift box (min 300M volume), 2nd LV Speedy P9, 3rd Hermes Picotin 18, 4-7 iPhone 18 Pro, 8-10 PS5 Pro, 11-20 DJI Osmo Pocket 4, 21-200 1,500..100 USDT
//   Futures Trial Funds. Must click Join Now. Similar campaigns: rewards go to the one registered first, non-cumulative.
//   Source: hotcoin.com/en_US/announcement/ronaldinho-futures-challenge/ (read 18/11 07:50 Brasília). Hero = official banner (img.hotbtech.cn 2026-11-18),
//   Ronaldinho is labelled "Embaixador da Hotcoin (Brasil)" on the official banner.
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const OUT = `${DIR}/day-2026-11-18-br`; fs.mkdirSync(OUT, {recursive: true});
const L = (f) => 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/' + f).toString('base64');
const P = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/${f}`).toString('base64');
const O = (f) => 'data:image/png;base64,' + fs.readFileSync(`${DIR}/art/official/${f}`).toString('base64');
const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A', UP = '#17A86B';
const head = `<meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Inter+Tight:wght@400;500;600&family=Martian+Mono:wdth,wght@75..112.5,300..700&family=Doto:wght@500..900&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:${INK};color:#fff}
.b{font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}.mm{font-family:'Martian Mono'}.d{font-family:'Doto';font-weight:800}.i{font-family:'Inter Tight'}
.bg{position:absolute;inset:0;background-size:1080px auto;background-repeat:no-repeat}
</style>`;
let seed = 3; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const chart = (a, b, n, amp) => { const p = []; for (let i = 0; i <= n; i++) { const f = i / n, k = i && i < n ? 1 : 0;
  p.push([a[0] + (b[0] - a[0]) * f + k * (R() - .5) * 2 * amp * (1 - f) * .6, a[1] + (b[1] - a[1]) * f + k * (R() - .3) * amp * .5 * (1 - f)]); } return p; };
const line = (pts) => { const d = 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' L'), e = pts[pts.length - 1];
  return `<svg style="position:absolute;inset:0" width="1080" height="1350"><defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>
  <path d="${d}" fill="none" stroke="${LIME}" stroke-width="13" opacity=".5" filter="url(#gl)"/><path d="${d}" fill="none" stroke="${LIME}" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="${e[0]}" cy="${e[1]}" r="12" fill="${LIME}"/><circle cx="${e[0]}" cy="${e[1]}" r="28" fill="none" stroke="${LIME}" stroke-width="3" opacity=".6"/></svg>`; };

// --- Event key visual (official hero object + clear details) ---
function keyVisual({hero, heroW, heroTop, chipTxt, h1, label, big, unit, facts, deadline, qr}) {
  return `<!doctype html><html><head>${head}</head><body>
<div style="position:absolute;inset:0;background:radial-gradient(620px 420px at 50% 34%,rgba(184,242,106,.22),transparent 70%),radial-gradient(900px 600px at 50% 120%,rgba(126,194,90,.10),transparent 70%)"></div>
<div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.06) 1.4px,transparent 1.5px);background-size:24px 24px;mask-image:linear-gradient(180deg,#000 0%,#000 45%,transparent 70%)"></div>
<svg style="position:absolute;left:0;top:0" width="1080" height="1350">
  <polygon points="190,120 450,90 450,560 190,590" fill="rgba(255,255,255,.035)" stroke="rgba(184,242,106,.35)" stroke-width="1.5"/>
  <polygon points="630,90 890,120 890,590 630,560" fill="rgba(255,255,255,.035)" stroke="rgba(184,242,106,.35)" stroke-width="1.5"/>
  <ellipse cx="540" cy="585" rx="300" ry="34" fill="rgba(184,242,106,.18)"/>
</svg>
<img src="${O(hero)}" style="position:absolute;left:${540 - heroW / 2}px;top:${heroTop ?? 590 - heroW * .62}px;width:${heroW}px;filter:drop-shadow(0 30px 40px rgba(0,0,0,.6))">
<div style="position:absolute;left:72px;right:72px;top:64px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-white.png')}" style="height:40px">
  <div class="i" style="font-size:22px;font-weight:600;color:${LIME};background:rgba(184,242,106,.12);border:1px solid rgba(184,242,106,.35);padding:10px 18px;border-radius:12px">${chipTxt}</div>
</div>
<div style="position:absolute;left:72px;right:72px;top:660px">
  <div class="b" style="font-size:64px;font-weight:800;letter-spacing:-1.5px;line-height:1.02">${h1}</div>
  <div class="i" style="font-size:28px;color:rgba(255,255,255,.55);margin-top:26px">${label}</div>
  <div style="display:flex;align-items:baseline;gap:18px;margin-top:2px"><span class="b" style="font-size:150px;font-weight:800;letter-spacing:-5px;line-height:1;color:${LIME}">${big}</span><span class="b" style="font-size:60px;font-weight:800">${unit}</span></div>
</div>
<div style="position:absolute;left:72px;right:72px;bottom:64px;display:flex;align-items:flex-end;gap:32px">
  <div style="flex:1;display:grid;gap:10px">${facts.map((f) => `<div class="i" style="font-size:25px;line-height:1.3;color:rgba(255,255,255,.88)"><span style="color:${LIME}">→</span> ${f}</div>`).join('')}
    <div class="i" style="font-size:25px;font-weight:600;margin-top:8px">${deadline}</div></div>
  <div style="background:#fff;border-radius:16px;padding:12px"><img src="${O(qr)}" style="width:150px;display:block"></div>
</div>
</body></html>`;
}

const kvR = keyVisual({hero: 'ronaldinho-futures-challenge-hero.png', heroW: 700, heroTop: 70, chipTxt: 'Embaixador da Hotcoin',
  h1: 'Ronaldinho x Hotcoin: opere como uma lenda.', label: 'Bônus de estreia em futuros', big: '200.000', unit: 'USDT',
  facts: ['1º do ranking: Patek Philippe + kit autografado pelo Ronaldinho', 'Estreia em futuros: até 200 USDT em Futures Trial Funds', '200 premiados: bolsas, iPhone 18 Pro, PS5 Pro e mais'], deadline: 'Até 29/11, 04:00 (Brasília) · clique em "Join Now"', qr: 'qr-ronaldinho.png'});
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await pg.setContent(kvR, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
await pg.screenshot({path: `${OUT}/kv-ronaldinho.png`}); await br.close(); console.log('ok');
