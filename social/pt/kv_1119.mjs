// PT key visuals 19/11/2026 (Brasília = UTC+8 minus 11h). Sources read 19/11 04:50 Brasília:
// Wall Street Earnings Season: ends 19/11 23:59 UTC+8 = 12:59 Brasília. Max 1,060 USDT per user in Futures Trial Funds (first TradFi trade 500 USDT -> 10;
//   volume tiers 5..1,000; trading days 10..50; highest tier only per event). Pool 100,000 USDT first come. hotcoin.com/en_US/announcement/wall-street-earnings-season/
// Fixed-Term Earn Exclusive: 18/11 10:30 to 28/11 19:00 UTC+8 = 17/11 23:30 to 28/11 08:00 Brasília. USDT 180d boosted APR 6.00% (max 150,000/user).
//   Subscription milestones 5k/50k/100k/500k USDT -> 100/500/1,000/2,000 USDT Futures Trial Funds; referral 10/20/50 USDT spot fee vouchers, invitee 10 USDT voucher.
//   Events combine. Products close when quota is reached. hotcoin.com/en_US/announcement/HotcoinFixed-TermEarnExclusive/
// Futures loss protection: ends 20/11 18:00 UTC+8 = 20/11 07:00 Brasília. Event 1 first futures trade (>=500 USDT volume): 100% net loss up to 50 USDT,
//   first 1,000 users; paid as Futures Trial Funds. hotcoin.com/en_US/announcement/futures-loss-protection/
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const OUT = `${DIR}/day-2026-11-19-br`; fs.mkdirSync(OUT, {recursive: true});
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

const kvWSE = keyVisual({hero: 'wall-street-earnings-season-hero.png', heroW: 540, heroTop: 100, chipTxt: 'Hotcoin TradFi',
  h1: 'Último dia: ações e ETFs na Hotcoin valem bônus.', label: 'Até, por usuário', big: '1.060', unit: 'USDT',
  facts: ['Pago em Futures Trial Funds', '1º trade TradFi de 500 USDT: 10 USDT', 'Metas de volume e de dias operados (vale a maior faixa)'], deadline: 'Termina hoje, 19/11, 12:59 (Brasília)', qr: 'qr-wse.png'});
const kvEarnX = keyVisual({hero: 'HotcoinFixed-TermEarnExclusive-hero.png', heroW: 420, heroTop: 110, chipTxt: 'Hotcoin Earn',
  h1: 'Earn prazo fixo com APR turbinada.', label: 'USDT em 180 dias, APR de até', big: '6,00', unit: '%',
  facts: ['Aplicou 5.000 USDT+: até 2.000 USDT em Futures Trial Funds', 'Indicou amigos: até 50 USDT em cupom de taxa spot', 'Etapas acumulam. Cada produto fecha ao bater a cota'], deadline: 'Até 28/11, 08:00 (Brasília)', qr: 'qr-earnx.png'});
const kvFutLast = keyVisual({hero: 'futures-loss-protection-hero.png', heroW: 760, chipTxt: 'Hotcoin Futuros',
  h1: 'Última chamada: 1º trade em futuros com perda coberta.', label: 'Fundo de compensação', big: '200.000', unit: 'USDT',
  facts: ['100% da perda líquida, até 50 USDT', 'Pago em Futures Trial Funds', '1.000 vagas para novos usuários'], deadline: 'Termina sexta, 20/11, 07:00 (Brasília)', qr: 'qr-futures.png'});
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [n, h] of [['kv-wse-lastday', kvWSE], ['kv-earn-exclusive', kvEarnX], ['kv-futuros-lastcall', kvFutLast]]) {
  await pg.setContent(h, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
  await pg.screenshot({path: `${OUT}/${n}.png`}); console.log(n); }
await br.close();
