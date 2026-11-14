// PT channel v3: real photo backgrounds (Unsplash, treated mono + grain in art/treat.py) with brand-green details, no italics.
// Photos: Manuel Palmeira (sURd6ViiuhU), Ryan Kwok (_GU2LOQrE7k), Who's Denilo ? (PbrvABXEEh8). Logged in hotcoin-tradfi/FOOTAGE_CREDITS.md.
// Data sources (checked 2026-11-14, Lisbon = UTC+0, so UTC+8 minus 8h):
//  - Earn Rewards Boost: hotcoin.com/en_US/announcement/HotcoinEarnRewardsBoost1/ ends Nov 16 04:00 Lisbon; 20 USDT Futures Trial Funds first sub >= 500 (stacks); 5K tier = 100 USDT Earn Trial Funds; highest tier only; no early redemption.
//  - Futures Loss Compensation: hotcoin.com/en_US/announcement/futures-loss-protection/ ends Nov 20 10:00 Lisbon; first trade loss 100% up to 50 USDT, Futures Trial Funds.
//  - NEFE Earn: hotcoin.com/en_US/announcement/HotcoinNEFEEarnLimitedOffer/ up to 15% APR, 180-day fixed, min 100,000 NEFE, 1B NEFE first come first served.
//  - Spot All-Round Challenge #23 ended Nov 14 15:59 Lisbon.
// Run: PW_PATH=$(npm root -g)/playwright node social/pt/v3.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const L = (f) => 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/' + f).toString('base64');
const P = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/${f}`).toString('base64');
const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A', UP = '#17A86B';
const head = `<meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Martian+Mono:wdth,wght@75..112.5,300..700&family=Doto:wght@500..900&family=Girassol&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:${INK}}
.b{font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}
.mm{font-family:'Martian Mono'}.d{font-family:'Doto';font-weight:800}.g{font-family:'Girassol'}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.glass{background:rgba(14,18,21,.62);backdrop-filter:blur(18px) saturate(.6);-webkit-backdrop-filter:blur(18px);border:1.5px solid rgba(255,255,255,.10)}
</style>`;

// ---------- 1) PARTIDAS over a film hallway ----------
const rows = [
  {t: ['16.11', '04:00'], dest: 'EARN BOOST', sub: 'Até 1.000 USDT em Earn Trial Funds', st: 'ÚLTIMA CHAMADA', k: 'last'},
  {t: ['20.11', '10:00'], dest: 'FUTUROS 100%', sub: '1.º trade: perda coberta até 50 USDT', st: 'A EMBARCAR', k: 'on'},
  {t: ['ATÉ', 'ESGOTAR'], dest: 'NEFE EARN', sub: 'Até 15% APR · prazo fixo de 180 dias', st: 'EM CURSO', k: 'on'},
  {t: ['14.11', '15:59'], dest: 'SPOT #23', sub: 'Prémios de 300.000 USDT', st: 'PARTIU', k: 'gone'},
];
const chip = (r) => r.k === 'last' ? `background:${LIME};color:${INK}` : r.k === 'on' ? `border:2px solid ${GREEN};color:${GREEN}` : `border:2px solid #3A4046;color:#6B737B`;
const board = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('hallway-t.jpg')});background-size:125% auto;background-position:50% -600px;filter:brightness(.95) contrast(1.1)"></div>
<div style="position:absolute;inset:0;background:radial-gradient(220px 260px at 50% 33%,rgba(184,242,106,.30),transparent 70%);mix-blend-mode:screen"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,9,10,.6) 0%,rgba(7,9,10,.0) 22%,rgba(7,9,10,.1) 42%,rgba(7,9,10,.9) 56%)"></div>
<div style="position:absolute;left:72px;right:72px;top:72px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-white.png')}" style="height:42px">
  <div class="mm" style="font-size:17px;letter-spacing:2px;color:rgba(255,255,255,.75)">HORA DE LISBOA</div>
</div>
<div class="g" style="position:absolute;left:66px;top:150px;font-size:230px;line-height:.9;color:${LIME};text-shadow:0 0 40px rgba(184,242,106,.35)">Partidas</div>
<div style="position:absolute;left:56px;right:56px;top:585px;border-radius:26px;padding:8px 34px" class="glass">
  <div class="mm" style="display:flex;font-size:15px;letter-spacing:2.5px;color:#7B838B;padding:20px 0 14px;border-bottom:1.5px solid rgba(255,255,255,.08)"><div style="width:190px">PARTIDA</div><div style="flex:1">DESTINO</div><div>ESTADO</div></div>
  ${rows.map((r, i) => `<div style="display:flex;align-items:center;padding:23px 0;${i < 3 ? 'border-bottom:1.5px solid rgba(255,255,255,.08)' : ''};opacity:${r.k === 'gone' ? .45 : 1}">
    <div class="d" style="width:190px;font-size:${r.t[1].length > 5 ? 26 : 40}px;line-height:1.05;color:${r.k === 'gone' ? '#8A939B' : LIME}">${r.t[0]}<br>${r.t[1]}</div>
    <div style="flex:1;min-width:0">
      <div class="d" style="font-size:50px;line-height:1;color:#fff;${r.k === 'gone' ? 'text-decoration:line-through;text-decoration-thickness:3px' : ''}">${r.dest}</div>
      <div class="mm" style="font-size:19px;color:rgba(255,255,255,.65);margin-top:12px">${r.sub}</div>
    </div>
    <div class="mm" style="font-size:16px;font-weight:700;letter-spacing:1.5px;padding:12px 16px;border-radius:10px;white-space:nowrap;${chip(r)}">${r.st}</div>
  </div>`).join('')}
</div>
<div class="b" style="position:absolute;left:72px;right:72px;bottom:62px;font-size:40px;font-weight:600;letter-spacing:-.3px;color:#fff">Não perca o comboio. <span style="color:rgba(255,255,255,.5)">Escolha o seu lugar.</span></div>
</body></html>`;

// ---------- 2) TALAO on a Lisbon cafe counter, cup in brand green ----------
const dots = (a, b) => `<div style="display:flex;gap:10px;align-items:baseline"><span>${a}</span><span style="flex:1;border-bottom:2px dotted #9AA0A6;transform:translateY(-6px)"></span><span style="font-weight:700">${b}</span></div>`;
const bars = Array.from({length: 46}, (_, i) => `<span style="display:inline-block;height:60px;width:${[2, 4, 2, 6, 3, 2, 4][i % 7]}px;margin-right:${[3, 2, 4, 2, 3][i % 5]}px;background:${INK}"></span>`).join('');
const receipt = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('cafe-t.jpg')});background-size:118% auto;background-position:0% 55%"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,14,17,.55),rgba(11,14,17,0) 30%)"></div>
<div style="position:absolute;left:72px;right:72px;top:72px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-white.png')}" style="height:42px">
  <div class="mm" style="font-size:17px;letter-spacing:2px;color:rgba(255,255,255,.8)">GANHAR COM A HOTCOIN</div>
</div>
<div style="position:absolute;left:72px;right:72px;top:160px;color:#fff">
  <div class="b" style="font-size:92px;font-weight:800;letter-spacing:-1.5px;line-height:.95;font-variation-settings:'opsz' 96,'wdth' 88">Uma bica.<br><span style="color:${LIME}">E o talão do Earn.</span></div>
</div>
<div style="position:absolute;left:48px;top:430px;width:520px;transform:rotate(-3deg);filter:drop-shadow(0 30px 40px rgba(0,0,0,.35)) drop-shadow(0 4px 6px rgba(0,0,0,.2))">
  <div class="mm" style="background:#FCFBF8;color:${INK};padding:40px 40px 36px;font-size:19px;line-height:1.55;-webkit-mask:linear-gradient(#000,#000) top/100% calc(100% - 16px) no-repeat,conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) bottom/32px 16px repeat-x">
    <div style="text-align:center;font-weight:700;font-size:23px;letter-spacing:3px">HOTCOIN EARN</div>
    <div style="text-align:center;color:#6B7280;font-size:15px;letter-spacing:1.5px">REWARDS BOOST · 06 A 16.11</div>
    <div style="border-top:2px dashed ${INK};margin:18px 0 14px"></div>
    ${dots('Prazo fixo', '5.000,00 USDT')}
    <div style="border-top:2px dashed ${INK};margin:14px 0"></div>
    ${dots('Bónus 1.ª subscrição', '+20')}
    <div style="color:#6B7280;font-size:14px;margin:-2px 0 8px">&nbsp;&nbsp;Futures Trial Funds · acumula</div>
    ${dots('Escalão 5.000', '+100')}
    <div style="color:#6B7280;font-size:14px">&nbsp;&nbsp;Earn Trial Funds</div>
    <div style="border-top:2px solid ${INK};margin:16px 0 10px"></div>
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-weight:700">TOTAL BÓNUS</span><span class="b" style="font-size:64px;font-weight:800;letter-spacing:-1.5px;color:${UP}">120 USDT</span></div>
    <div style="border-top:2px dashed ${INK};margin:12px 0 14px"></div>
    <div style="font-size:15px;line-height:1.6;color:#3F444A">Escalões não acumulam: conta o mais alto.<br>Sem resgate antecipado.<br>Termina 16.11 às 04:00 (Lisboa).</div>
    <div style="text-align:center;margin-top:20px;white-space:nowrap;overflow:hidden">${bars}</div>
    <div style="text-align:center;font-size:13px;letter-spacing:2px;margin-top:8px;color:#6B7280">OBRIGADO PELA PREFERÊNCIA</div>
  </div>
</div>
</body></html>`;

// ---------- 3) A SUBIDA: Bica tram hill, rail becomes a rising lime line ----------
const W = 1080, H = 1350;
let seed = 11; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pts = []; const N = 16;
for (let i = 0; i <= N; i++) { const f = i / N; const y = 1130 - f * 600 + (i > 0 && i < N ? (R() - .35) * 70 * (1 - f) : 0); const x = 560 - f * 22 + (i > 0 && i < N ? (R() - .5) * 40 * (1 - f) : 0); pts.push([x, y]); }
const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
const grid = []; for (let y = 90; y < H; y += 90) for (let x = 60; x < W; x += 120) grid.push(`<circle cx="${x}" cy="${y}" r="2.6" fill="#fff" opacity=".55"/>`);
const end = pts[N];
const subida = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('tram-t.jpg')});background-position:50% 45%;filter:brightness(.82) contrast(1.12)"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,9,10,.65) 0%,rgba(7,9,10,.0) 30%,rgba(7,9,10,0) 55%,rgba(7,9,10,.85) 100%)"></div>
<svg style="position:absolute;inset:0" width="${W}" height="${H}">
  <defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>
  ${grid.join('')}
  <path d="${line}" fill="none" stroke="${LIME}" stroke-width="14" opacity=".55" filter="url(#gl)"/>
  <path d="${line}" fill="none" stroke="${LIME}" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="${end[0]}" cy="${end[1]}" r="13" fill="${LIME}"/><circle cx="${end[0]}" cy="${end[1]}" r="30" fill="none" stroke="${LIME}" stroke-width="3" opacity=".6"/>
</svg>
<div style="position:absolute;left:72px;right:72px;top:72px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-white.png')}" style="height:42px">
  <div class="mm" style="font-size:17px;letter-spacing:2px;color:rgba(255,255,255,.8)">ELEVADOR DA BICA · LISBOA</div>
</div>
<div class="b" style="position:absolute;left:72px;top:160px;font-size:96px;font-weight:800;letter-spacing:-2px;line-height:.93;color:#fff;font-variation-settings:'opsz' 96,'wdth' 85">Devagar<br>também<br>se <span style="color:${LIME}">sobe.</span></div>
<div class="glass" style="position:absolute;left:72px;right:72px;bottom:72px;border-radius:24px;padding:30px 34px;display:flex;align-items:center;gap:30px">
  <div style="flex:1">
    <div class="mm" style="font-size:15px;letter-spacing:2.5px;color:${GREEN}">NEFE EARN · PRAZO FIXO</div>
    <div class="b" style="font-size:46px;font-weight:700;letter-spacing:-1px;color:#fff;margin-top:8px">180 dias, até <span style="color:${LIME}">15% APR</span></div>
    <div class="mm" style="font-size:17px;color:rgba(255,255,255,.65);margin-top:8px">Mínimo 100.000 NEFE · enquanto houver</div>
  </div>
</div>
</body></html>`;

const br = await chromium.launch();
const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [n, h] of [['v3-01-partidas', board], ['v3-02-talao', receipt], ['v3-03-subida', subida]]) {
  await pg.setContent(h, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(600);
  await pg.screenshot({path: `${DIR}/${n}.png`}); console.log('ok', n);
}
await br.close();
