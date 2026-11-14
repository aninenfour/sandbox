// PT channel demo day (Sunday 15 Nov 2026, Lisbon time). Event data from tracker/events.json (hotcoin.com announcements, checked 2026-11-14).
// Market dates: Nvidia Q3 FY27 results Tue 17 Nov, ~1:20pm PT = 21:20 Lisbon (investor.nvidia.com press release, Oct 28 2026);
// FOMC minutes of Oct 27-28 meeting Wed 18 Nov 2:00pm ET = 19:00 Lisbon (federalreserve.gov Nov 2026 calendar).
// "6 semanas vermelhas": BTC 6 straight weekly losses to Nov 13 close (Hotcoin Research, Nov 14; Decrypt, CoinDesk).
// Photos (Unsplash License, mono + grain in art/treat_day.py): imren tutuncu (aSw7b8HA3_8, bridge), Annie Spratt (Y77uRYcV9bw, walker),
// Ryan Kwok (_GU2LOQrE7k, cafe), Manuel Palmeira (sURd6ViiuhU, hallway).
// Run: PW_PATH=$(npm root -g)/playwright node social/pt/day.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const OUT = `${DIR}/day-2026-11-15`; fs.mkdirSync(OUT, {recursive: true});
const L = (f) => 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/' + f).toString('base64');
const P = (f) => 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/${f}`).toString('base64');
const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A', UP = '#17A86B';
const head = `<meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Martian+Mono:wdth,wght@75..112.5,300..700&family=Doto:wght@500..900&family=Girassol&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:${INK};color:#fff}
.b{font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}.mm{font-family:'Martian Mono'}.d{font-family:'Doto';font-weight:800}.g{font-family:'Girassol'}
.bg{position:absolute;inset:0;background-size:1080px auto;background-repeat:no-repeat}
.glass{background:rgba(14,18,21,.62);backdrop-filter:blur(18px) saturate(.6);border:1.5px solid rgba(255,255,255,.10)}
</style>`;
const glow = `<defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>`;

// 09:00 Partidas board, P2P closes 10:00
const rows = [
  {t: ['HOJE', '10:00'], dest: 'DESAFIO P2P', sub: '1.º trade P2P de 200 USDT: 20 USDT em Futures Trial Funds', st: 'ÚLTIMA CHAMADA', k: 'last'},
  {t: ['16.11', '04:00'], dest: 'EARN BOOST', sub: 'Até 1.000 USDT em Earn Trial Funds', st: 'ESTA NOITE', k: 'on'},
  {t: ['19.11', '15:59'], dest: 'WALL STREET', sub: 'TradFi: até 1.060 USDT em Futures Trial Funds', st: 'A EMBARCAR', k: 'on'},
  {t: ['20.11', '10:00'], dest: 'FUTUROS 100%', sub: '1.º trade: perda coberta até 50 USDT', st: 'A EMBARCAR', k: 'on'},
  {t: ['ATÉ', 'ESGOTAR'], dest: 'NEFE EARN', sub: 'Até 15% APR · prazo fixo de 180 dias', st: 'EM CURSO', k: 'on'},
];
const chip = (r) => r.k === 'last' ? `background:${LIME};color:${INK}` : `border:2px solid ${GREEN};color:${GREEN}`;
const board = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('hallway-t.jpg')});background-size:125% auto;background-position:50% -600px;filter:brightness(.95) contrast(1.1)"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,9,10,.6) 0%,rgba(7,9,10,0) 22%,rgba(7,9,10,.1) 36%,rgba(7,9,10,.92) 50%)"></div>
<img src="${L('logo-official-white.png')}" style="position:absolute;left:72px;top:72px;height:40px">
<div class="g" style="position:absolute;left:66px;top:140px;font-size:200px;line-height:.9;color:${LIME}">Partidas</div>
<div style="position:absolute;left:48px;right:48px;top:460px;border-radius:24px;padding:4px 30px" class="glass">
  ${rows.map((r, i) => `<div style="display:flex;align-items:center;padding:24px 0;${i < rows.length - 1 ? 'border-bottom:1.5px solid rgba(255,255,255,.08)' : ''}">
    <div class="d" style="width:170px;font-size:${r.t[1].length > 5 ? 24 : 36}px;line-height:1.05;color:${LIME}">${r.t[0]}<br>${r.t[1]}</div>
    <div style="flex:1;min-width:0;padding-right:16px">
      <div class="d" style="font-size:44px;line-height:1">${r.dest}</div>
      <div class="mm" style="font-size:16px;color:rgba(255,255,255,.65);margin-top:10px">${r.sub}</div>
    </div>
    <div class="mm" style="font-size:15px;font-weight:700;letter-spacing:1.5px;padding:11px 14px;border-radius:10px;white-space:nowrap;${chip(r)}">${r.st}</div>
  </div>`).join('')}
</div>
<div class="b" style="position:absolute;left:72px;right:72px;bottom:56px;font-size:38px;font-weight:600;letter-spacing:-.3px">Domingo, 15 de novembro. <span style="color:rgba(255,255,255,.5)">O primeiro sai às 10:00.</span></div>
</body></html>`;

// 10:00 bridge: futures loss protection, 5 days left (day 9 of 14). Line runs along the deck; dashed for days still to come.
const deck = [[-10, 266], [120, 330], [240, 392], [355, 448], [470, 528], [560, 608], [640, 690], [690, 770], [732, 840]];
const cut = 5; // 9/14 of the deck length ~ point index 5
const solid = 'M' + deck.slice(0, cut + 1).map((p) => p.join(',')).join(' L');
const dashed = 'M' + deck.slice(cut).map((p) => p.join(',')).join(' L');
const bridge = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('bridge-m.jpg')});background-position:0 -38px"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,14,17,0) 60%,rgba(11,14,17,.85) 92%)"></div>
<svg style="position:absolute;inset:0" width="1080" height="1350">${glow}
  <path d="${dashed}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 12" stroke-linecap="round" opacity=".8"/>
  <path d="${solid}" fill="none" stroke="${LIME}" stroke-width="13" opacity=".5" filter="url(#gl)"/>
  <path d="${solid}" fill="none" stroke="${LIME}" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="${deck[cut][0]}" cy="${deck[cut][1]}" r="12" fill="${LIME}"/><circle cx="${deck[cut][0]}" cy="${deck[cut][1]}" r="28" fill="none" stroke="${LIME}" stroke-width="3" opacity=".6"/>
  <circle cx="${deck[8][0]}" cy="${deck[8][1]}" r="9" fill="none" stroke="#fff" stroke-width="3"/>
</svg>
<div class="mm" style="position:absolute;left:${deck[cut][0] + 30}px;top:${deck[cut][1] - 62}px;font-size:16px;letter-spacing:2px;color:#fff">HOJE · DIA 9 DE 14</div>
<div class="mm" style="position:absolute;left:${deck[8][0] + 22}px;top:${deck[8][1] - 8}px;font-size:16px;letter-spacing:2px;color:#fff">20.11 · 10:00</div>
<img src="${L('logo-official-black.png')}" style="position:absolute;right:64px;top:64px;height:36px">
<div class="b" style="position:absolute;left:600px;right:64px;top:150px;color:${INK};font-size:76px;font-weight:800;letter-spacing:-1.5px;line-height:.95;font-variation-settings:'opsz' 96,'wdth' 85">Faltam 5 dias.</div>
<div style="position:absolute;left:72px;right:72px;bottom:70px">
  <div class="b" style="font-size:46px;font-weight:700;letter-spacing:-1px;line-height:1.1">Proteção de perdas em futuros</div>
  <div class="b" style="font-size:30px;font-weight:500;line-height:1.3;margin-top:10px;color:rgba(255,255,255,.8)">1.º trade de futuros: 100% da perda líquida coberta, até 50 USDT, em Futures Trial Funds.</div>
</div>
</body></html>`;

// 12:30 What to Watch, PT version: the week as a calendar, Lisbon times
const days = [['SEG', '16'], ['TER', '17'], ['QUA', '18'], ['QUI', '19'], ['SEX', '20']];
const evs = [
  {d: 0, h: 4, t: '04:00', title: 'Earn Boost fecha', who: 'Hotcoin'},
  {d: 1, h: 21.3, t: '21:20', title: 'Nvidia: resultados do 3.º trimestre', who: '$NVDAB', hot: true},
  {d: 2, h: 19, t: '19:00', title: 'Fed: atas de outubro', who: 'Macro'},
  {d: 3, h: 16, t: '15:59', title: 'TradFi Wall Street fecha', who: 'Hotcoin'},
  {d: 4, h: 10, t: '10:00', title: 'Proteção de futuros fecha', who: 'Hotcoin'},
];
const GX = 72, GW = 936, GY = 360, GH = 820, cw = GW / 5, hy = (h) => GY + 60 + (h / 24) * (GH - 170);
const agenda = `<!doctype html><html><head>${head}</head><body style="background:#FFFFFF;color:${INK}">
<img src="${L('logo-official-black.png')}" style="position:absolute;left:72px;top:72px;height:36px">
<div class="b" style="position:absolute;left:72px;right:72px;top:150px;font-size:84px;font-weight:800;letter-spacing:-2px;line-height:.95;font-variation-settings:'opsz' 96,'wdth' 85">A semana em cinco horas marcadas.</div>
<svg style="position:absolute;left:0;top:0" width="1080" height="1350">
  ${days.map((d, i) => `<text x="${GX + i * cw + 14}" y="${GY + 30}" font-family="Martian Mono" font-size="17" letter-spacing="2" fill="#6B7280">${d[0]}</text><text x="${GX + i * cw + 14}" y="${GY + 54}" font-family="Bricolage Grotesque" font-weight="800" font-size="22" fill="${INK}">${d[1]}.11</text>`).join('')}
  ${[0, 6, 12, 18, 24].map((h) => `<line x1="${GX}" x2="${GX + GW}" y1="${hy(h)}" y2="${hy(h)}" stroke="#E6E8EB" stroke-width="1.5"/>`).join('')}
  ${days.map((d, i) => i ? `<line x1="${GX + i * cw}" x2="${GX + i * cw}" y1="${GY}" y2="${GY + GH}" stroke="#E6E8EB" stroke-width="1.5"/>` : '').join('')}
  <path d="M${evs.map((e) => `${GX + e.d * cw + cw / 2},${hy(e.h)}`).join(' L')}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>
</svg>
${evs.map((e) => `<div style="position:absolute;left:${GX + e.d * cw + 8}px;width:${cw - 16}px;top:${hy(e.h) - 14}px">
  <div style="width:20px;height:20px;border-radius:50%;margin:0 auto;background:${e.hot ? LIME : INK};border:3px solid ${INK}"></div>
  <div style="background:${e.hot ? INK : '#F4F5F6'};color:${e.hot ? '#fff' : INK};border-radius:14px;padding:14px 12px;margin-top:10px">
    <div class="mm" style="font-size:20px;font-weight:700;color:${e.hot ? LIME : INK}">${e.t}</div>
    <div class="b" style="font-size:22px;font-weight:700;line-height:1.15;margin-top:6px">${e.title}</div>
    <div class="mm" style="font-size:13px;letter-spacing:1px;margin-top:8px;opacity:.6">${e.who}</div></div></div>`).join('')}
<div class="b" style="position:absolute;left:72px;right:72px;bottom:64px;font-size:30px;font-weight:500;color:#6B7280">Horas de Lisboa. Qual delas mexe com a sua carteira?</div>
</body></html>`;

// 14:00 meme of the day
const meme = `<!doctype html><html><head>${head}</head><body style="background:#fff">
<div class="bg" style="background-image:url(${P('walker-m.jpg')});background-position:0 -135px"></div>
<div style="position:absolute;left:0;right:0;top:0;height:420px;background:linear-gradient(180deg,rgba(255,255,255,.92) 55%,rgba(255,255,255,0))"></div>
<div class="b" style="position:absolute;left:64px;right:64px;top:70px;color:${INK};font-size:66px;font-weight:800;letter-spacing:-1.5px;line-height:1.02;font-variation-settings:'opsz' 96,'wdth' 88">O meu portfólio a subir de volta depois de 6 semanas vermelhas:</div>
<img src="${L('logo-official-white.png')}" style="position:absolute;left:64px;bottom:58px;height:32px;filter:drop-shadow(0 2px 8px rgba(0,0,0,.4))">
</body></html>`;

// 17:00 Earn Boost last night: receipt on a cafe counter (no recolouring)
const dots = (a, b) => `<div style="display:flex;gap:10px;align-items:baseline"><span>${a}</span><span style="flex:1;border-bottom:2px dotted #9AA0A6;transform:translateY(-6px)"></span><span style="font-weight:700">${b}</span></div>`;
const bars = Array.from({length: 46}, (_, i) => `<span style="display:inline-block;height:56px;width:${[2, 4, 2, 6, 3, 2, 4][i % 7]}px;margin-right:${[3, 2, 4, 2, 3][i % 5]}px;background:${INK}"></span>`).join('');
const talao = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('cafe-m.jpg')});background-size:118% auto;background-position:0% 55%"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,14,17,.6),rgba(11,14,17,0) 30%)"></div>
<img src="${L('logo-official-white.png')}" style="position:absolute;left:72px;top:72px;height:40px">
<div class="b" style="position:absolute;left:72px;right:72px;top:150px;font-size:92px;font-weight:800;letter-spacing:-1.5px;line-height:.95;font-variation-settings:'opsz' 96,'wdth' 88">Última noite<br>do Earn Boost.</div>
<div style="position:absolute;left:48px;top:430px;width:520px;transform:rotate(-3deg);filter:drop-shadow(0 30px 40px rgba(0,0,0,.35)) drop-shadow(0 4px 6px rgba(0,0,0,.2))">
  <div class="mm" style="background:#FCFBF8;color:${INK};padding:38px 38px 34px;font-size:19px;line-height:1.55;-webkit-mask:linear-gradient(#000,#000) top/100% calc(100% - 16px) no-repeat,conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) bottom/32px 16px repeat-x">
    <div style="text-align:center;font-weight:700;font-size:23px;letter-spacing:3px">HOTCOIN EARN</div>
    <div style="text-align:center;color:#6B7280;font-size:15px;letter-spacing:1.5px">FECHA 16.11 · 04:00 LISBOA</div>
    <div style="border-top:2px dashed ${INK};margin:18px 0 14px"></div>
    ${dots('Prazo fixo', '5.000,00 USDT')}
    <div style="border-top:2px dashed ${INK};margin:14px 0"></div>
    ${dots('Bónus 1.ª subscrição', '+20')}
    <div style="color:#6B7280;font-size:14px;margin:-2px 0 8px">&nbsp;&nbsp;Futures Trial Funds · acumula</div>
    ${dots('Escalão 5.000', '+100')}
    <div style="color:#6B7280;font-size:14px">&nbsp;&nbsp;Earn Trial Funds</div>
    <div style="border-top:2px solid ${INK};margin:16px 0 10px"></div>
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-weight:700">TOTAL BÓNUS</span><span class="b" style="font-size:62px;font-weight:800;letter-spacing:-1.5px;color:${UP}">120 USDT</span></div>
    <div style="border-top:2px dashed ${INK};margin:12px 0 14px"></div>
    <div style="font-size:15px;line-height:1.6;color:#3F444A">Escalões não acumulam: conta o mais alto.<br>Sem resgate antecipado.</div>
    <div style="text-align:center;margin-top:18px;white-space:nowrap;overflow:hidden">${bars}</div>
    <div style="text-align:center;font-size:13px;letter-spacing:2px;margin-top:8px;color:#6B7280">OBRIGADO PELA PREFERÊNCIA</div>
  </div>
</div>
</body></html>`;

const br = await chromium.launch();
const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [n, h] of [['0900-partidas', board], ['1000-ponte', bridge], ['1230-agenda', agenda], ['1400-meme', meme], ['1700-talao', talao]]) {
  await pg.setContent(h, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
  await pg.screenshot({path: `${OUT}/${n}.png`}); console.log('ok', n);
}
await br.close();
