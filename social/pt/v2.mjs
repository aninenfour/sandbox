// PT channel v2: own visual system built on Portuguese everyday objects (departures board, shop receipt, broadsheet + calcada).
// Type: Bricolage Grotesque (display), Newsreader (editorial serif), Martian Mono (data), Doto (LED board),
//       Girassol (one accent word; OFL, based on hand-painted street signs in Carcavelos, PT). All Google Fonts.
// Sources (checked 2026-11-14; Lisbon = UTC+0 in Nov, so UTC+8 minus 8h):
//  - Earn Rewards Boost: hotcoin.com/en_US/announcement/HotcoinEarnRewardsBoost1/ ends Nov 16 12:00 UTC+8 = 04:00 Lisbon.
//    First fixed-term sub >= 500 USDT -> 20 USDT Futures Trial Funds (stacks); tiers 1K/5K/20K/50K/100K -> 50/100/200/500/1000 Earn Trial Funds (highest only). No early redemption.
//  - Futures Loss Compensation: hotcoin.com/en_US/announcement/futures-loss-protection/ ends Nov 20 18:00 UTC+8 = 10:00 Lisbon. Event 1: 100% of first-trade net loss, max 50 USDT, Futures Trial Funds.
//  - NEFE Earn: hotcoin.com/en_US/announcement/HotcoinNEFEEarnLimitedOffer/ up to 15% APR, 180-day fixed, 1B NEFE first come first served.
//  - Spot All-Round Challenge #23: ended Nov 14 23:59 UTC+8 = 15:59 Lisbon, 300,000 USDT pool.
//  - MiCA PT: eco.sapo.pt/2026/07/01/... in force Jul 1 2026, Banco de Portugal + CMVM, fines up to EUR 5M.
// Run: PW_PATH=$(npm root -g)/playwright node social/pt/v2.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const L = (f) => 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/' + f).toString('base64');
const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A', UP = '#17A86B', RED = '#E5484D', CREAM = '#F4F1EA';
const head = `<meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Martian+Mono:wdth,wght@75..112.5,300..700&family=Doto:wght@500..900&family=Girassol&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.b{font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}
.n{font-family:'Newsreader'}.mm{font-family:'Martian Mono'}.d{font-family:'Doto';font-weight:800}.g{font-family:'Girassol'}
</style>`;

// ---------- 1) PARTIDAS: departures board of live events ----------
const rows = [
  {t: ['16.11', '04:00'], dest: 'EARN BOOST', sub: 'Até 1.000 USDT em Earn Trial Funds', st: 'ÚLTIMA CHAMADA', k: 'last'},
  {t: ['20.11', '10:00'], dest: 'FUTUROS 100%', sub: '1.º trade: perda coberta até 50 USDT', st: 'A EMBARCAR', k: 'on'},
  {t: ['ATÉ', 'ESGOTAR'], dest: 'NEFE EARN', sub: 'Até 15% APR · prazo fixo de 180 dias', st: 'EM CURSO', k: 'on'},
  {t: ['14.11', '15:59'], dest: 'SPOT #23', sub: 'Prémios de 300.000 USDT', st: 'PARTIU', k: 'gone'},
];
const chip = (r) => r.k === 'last' ? `background:${LIME};color:${INK}` : r.k === 'on' ? `border:2px solid ${GREEN};color:${GREEN}` : `border:2px solid #3A4046;color:#5B636B`;
const board = `<!doctype html><html><head>${head}</head><body style="background:#07090A;color:#fff">
<div style="position:absolute;inset:0;background:radial-gradient(700px 500px at 20% 0%,rgba(184,242,106,.10),transparent 70%)"></div>
<div style="position:absolute;left:72px;right:72px;top:72px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-white.png')}" style="height:42px">
  <div class="mm" style="font-size:17px;letter-spacing:2px;color:rgba(255,255,255,.55)">HORA DE LISBOA</div>
</div>
<div style="position:absolute;left:66px;top:150px;display:flex;align-items:flex-end;gap:28px">
  <div class="g" style="font-size:250px;line-height:.9;color:${LIME}">Partidas</div>
</div>
<div class="b" style="position:absolute;left:72px;top:400px;font-size:41px;font-weight:600;letter-spacing:-.3px;white-space:nowrap;line-height:1.1;font-variation-settings:'opsz' 96,'wdth' 90">Eventos Hotcoin que saem esta semana. <span style="color:rgba(255,255,255,.45)">Escolha o seu lugar.</span></div>
<div style="position:absolute;left:56px;right:56px;top:530px;border-radius:26px;background:#0F1316;border:1.5px solid #1D2328;box-shadow:inset 0 2px 30px rgba(0,0,0,.6);padding:12px 34px">
  <div class="mm" style="display:flex;font-size:15px;letter-spacing:2.5px;color:#5B636B;padding:20px 0 14px;border-bottom:1.5px solid #1D2328"><div style="width:190px">PARTIDA</div><div style="flex:1">DESTINO</div><div>ESTADO</div></div>
  ${rows.map((r, i) => `<div style="display:flex;align-items:center;padding:30px 0;${i < 3 ? 'border-bottom:1.5px solid #1D2328' : ''};opacity:${r.k === 'gone' ? .45 : 1}">
    <div class="d" style="width:190px;font-size:${r.t[1].length > 5 ? 26 : 40}px;line-height:1.05;color:${r.k === 'gone' ? '#8A939B' : LIME}">${r.t[0]}<br>${r.t[1]}</div>
    <div style="flex:1;min-width:0">
      <div class="d" style="font-size:50px;line-height:1;color:#fff;${r.k === 'gone' ? 'text-decoration:line-through;text-decoration-thickness:3px' : ''}">${r.dest}</div>
      <div class="mm" style="font-size:19px;color:rgba(255,255,255,.6);margin-top:12px">${r.sub}</div>
    </div>
    <div class="mm" style="font-size:16px;font-weight:700;letter-spacing:1.5px;padding:12px 16px;border-radius:10px;white-space:nowrap;${chip(r)}">${r.st}</div>
  </div>`).join('')}
</div>
<div class="n" style="position:absolute;left:72px;right:72px;bottom:60px;font-style:italic;font-size:44px;color:rgba(255,255,255,.85)">Não perca o comboio.</div>
</body></html>`;

// ---------- 2) TALAO: Earn Boost as a shop receipt ----------
const dots = (a, b) => `<div style="display:flex;gap:10px;align-items:baseline"><span>${a}</span><span style="flex:1;border-bottom:2px dotted #9AA0A6;transform:translateY(-6px)"></span><span style="font-weight:700">${b}</span></div>`;
const bars = Array.from({length: 58}, (_, i) => `<span style="display:inline-block;height:70px;width:${[2, 4, 2, 6, 3, 2, 4][i % 7]}px;margin-right:${[3, 2, 4, 2, 3][i % 5]}px;background:${INK}"></span>`).join('');
const receipt = `<!doctype html><html><head>${head}</head><body style="background:#E9E3D8;color:${INK}">
<svg style="position:absolute;inset:0" width="1080" height="1350"><filter id="nz"><feTurbulence baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter><rect width="1080" height="1350" filter="url(#nz)"/></svg>
<div style="position:absolute;left:72px;right:72px;top:72px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-black.png')}" style="height:42px">
  <div class="mm" style="font-size:17px;letter-spacing:2px;color:#6B6458">GANHAR COM A HOTCOIN</div>
</div>
<div style="position:absolute;left:72px;top:170px;right:72px">
  <div class="b" style="font-size:90px;font-weight:800;letter-spacing:-1.5px;line-height:.95;font-variation-settings:'opsz' 96,'wdth' 88">5.000 USDT em Earn?</div>
  <div class="n" style="font-style:italic;font-size:64px;line-height:1.05;margin-top:6px;color:#4A4439">Eis o seu talão.</div>
</div>
<div style="position:absolute;left:230px;top:400px;width:620px;transform:rotate(-2.2deg);filter:drop-shadow(0 30px 40px rgba(60,45,20,.22)) drop-shadow(0 4px 6px rgba(60,45,20,.15))">
  <div class="mm" style="background:#FCFBF8;padding:46px 46px 40px;font-size:21px;line-height:1.55;-webkit-mask:linear-gradient(#000,#000) top/100% calc(100% - 18px) no-repeat,conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) bottom/36px 18px repeat-x">
    <div style="text-align:center;font-weight:700;font-size:26px;letter-spacing:3px">HOTCOIN EARN</div>
    <div style="text-align:center;color:#6B7280;font-size:17px;letter-spacing:1.5px">REWARDS BOOST · 06 A 16.11</div>
    <div style="border-top:2px dashed ${INK};margin:22px 0 18px"></div>
    ${dots('Subscrição prazo fixo', '5.000,00')}
    <div style="border-top:2px dashed ${INK};margin:18px 0"></div>
    ${dots('Bónus 1.ª subscrição', '+20')}
    <div style="color:#6B7280;font-size:16px;margin:-2px 0 10px">&nbsp;&nbsp;Futures Trial Funds · acumula</div>
    ${dots('Escalão 5.000', '+100')}
    <div style="color:#6B7280;font-size:16px;margin:-2px 0 0">&nbsp;&nbsp;Earn Trial Funds</div>
    <div style="border-top:2px solid ${INK};margin:20px 0 14px"></div>
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-weight:700;letter-spacing:1px">TOTAL BÓNUS</span><span class="b" style="font-size:76px;font-weight:800;letter-spacing:-1.5px;color:${UP}">120 USDT</span></div>
    <div style="border-top:2px dashed ${INK};margin:14px 0 18px"></div>
    <div style="font-size:16px;line-height:1.6;color:#3F444A">Escalões não acumulam: conta o mais alto.<br>Sem resgate antecipado.<br>Termina 16.11 às 04:00 (Lisboa).</div>
    <div style="text-align:center;margin-top:26px;white-space:nowrap;overflow:hidden">${bars}</div>
    <div style="text-align:center;font-size:15px;letter-spacing:2px;margin-top:10px;color:#6B7280">OBRIGADO PELA PREFERÊNCIA</div>
  </div>
</div>
<div class="g" style="position:absolute;right:92px;top:430px;transform:rotate(9deg);font-size:46px;color:${INK};background:${LIME};padding:8px 22px 4px;border-radius:6px;box-shadow:0 8px 18px rgba(60,45,20,.18)">Simulação</div>
</body></html>`;

// ---------- 3) JORNAL: broadsheet front page with calcada wave ----------
function calcada(w, h) {
  let s = '', seed = 7; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const c = 15;
  for (let y = 0; y < h; y += c) for (let x = 0; x < w; x += c) {
    const cx = x + c / 2, cy = y + c / 2;
    const w1 = h * .5 + Math.sin(cx / 120) * 95, w2 = h * .5 + Math.sin(cx / 120 + 2.2) * 95;
    const band = Math.abs(cy - w1) < 34, band2 = Math.abs(cy - w2) < 9;
    const fill = band ? INK : band2 ? GREEN : '#E3DCCF';
    const sz = c - 3 - R() * 3, j = () => (R() - .5) * 2.4;
    s += `<rect x="${(x + j()).toFixed(1)}" y="${(y + j()).toFixed(1)}" width="${sz.toFixed(1)}" height="${(sz - R() * 2).toFixed(1)}" rx="${(2 + R() * 2.5).toFixed(1)}" fill="${fill}" transform="rotate(${((R() - .5) * 18).toFixed(1)} ${cx} ${cy})"/>`;
  }
  return `<svg width="${w}" height="${h}" style="display:block;background:#EDE7DB">${s}</svg>`;
}
const nums = [['01.07', 'A lei que aplica o MiCA entrou em vigor em 2026.'], ['2', 'Supervisores: Banco de Portugal e CMVM.'], ['5 M€', 'Coima máxima para empresas que falhem as regras.']];
const paper = `<!doctype html><html><head>${head}</head><body style="background:${CREAM};color:${INK}">
<div style="position:absolute;left:72px;right:72px;top:64px">
  <div style="display:flex;justify-content:space-between;align-items:center"><img src="${L('logo-official-black.png')}" style="height:34px"><div class="mm" style="font-size:15px;letter-spacing:2px">Nº 01 · SÁBADO</div></div>
  <div style="border-top:3px solid ${INK};margin-top:22px"></div>
  <div class="n" style="text-align:center;font-weight:600;font-size:100px;letter-spacing:-2px;line-height:1.1;padding:4px 0 0;white-space:nowrap;font-variation-settings:'opsz' 72">Portugal <i style="font-weight:400">Explicado</i></div>
  <div class="mm" style="display:flex;justify-content:space-between;border-top:1.5px solid ${INK};border-bottom:1.5px solid ${INK};padding:10px 0;font-size:15px;letter-spacing:2px;margin-top:6px"><span>LISBOA</span><span>14 DE NOVEMBRO DE 2026</span><span>CRIPTO · REGRAS</span></div>
</div>
<div style="position:absolute;left:72px;top:320px;width:936px;height:360px;overflow:hidden">${calcada(936, 360)}</div>
<div style="position:absolute;left:72px;right:72px;top:722px">
  <div class="b" style="font-size:94px;font-weight:800;letter-spacing:-1.8px;line-height:.95;font-variation-settings:'opsz' 96,'wdth' 82">Cripto em Portugal já&nbsp;tem&nbsp;regras.</div>
  <div class="n" style="font-size:36px;line-height:1.25;margin-top:20px;color:#3F444A"><i>Desde 1 de julho, o MiCA é lei cá. O que muda, em três números.</i></div>
</div>
<div style="position:absolute;left:72px;right:72px;top:1060px;display:flex;border-top:3px solid ${INK}">
  ${nums.map(([n, t], i) => `<div style="flex:1;padding:22px ${i < 2 ? 26 : 0}px 0 ${i ? 26 : 0}px;${i < 2 ? 'border-right:1.5px solid ' + INK : ''}">
    <div class="b" style="font-size:76px;font-weight:800;letter-spacing:-1.5px;line-height:1;color:${i === 2 ? RED : INK};font-variation-settings:'opsz' 96,'wdth' 80">${n}</div>
    <div class="n" style="font-size:27px;line-height:1.3;margin-top:14px">${t}</div></div>`).join('')}
</div>
</body></html>`;

const br = await chromium.launch();
const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [n, h] of [['v2-01-partidas', board], ['v2-02-talao', receipt], ['v2-03-jornal', paper]]) {
  await pg.setContent(h, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
  await pg.screenshot({path: `${DIR}/${n}.png`}); console.log('ok', n);
}
await br.close();
