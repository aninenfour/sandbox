// Hotcoin Português (Brazil audience): demo day Sunday 15 Nov 2026, Brasília time (UTC-3 = UTC+8 minus 11h). pt-BR copy.
// Event data: hotcoin.com/en_US/announcement/* (checked 2026-11-14). Hero objects cut from the official announcement banners
// (img.hotbtech.cn, Hotcoin's own artwork) by art/official/cut.py. QR codes point to the event pages.
// Nvidia Q3 FY27: Tue 17 Nov ~1:20pm PT = 18:20 Brasília (investor.nvidia.com). FOMC minutes: Wed 18 Nov 2pm ET = 16:00 Brasília (federalreserve.gov).
// SNDKB: delist 19 Nov 16:00 UTC+8 = 05:00 Brasília, est. relist 20 Nov 18:00 UTC+8 = 07:00 Brasília, 8-for-1 (Hotcoin announcement, 11 Nov 2026).
// Photos (Unsplash License): Joakim Kingstrom (park), Ryan Kwok (cafe, cup recoloured green), Annie Spratt (walker), Manuel Palmeira (hallway).
// Run: PW_PATH=$(npm root -g)/playwright node social/pt/day_br.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const OUT = `${DIR}/day-2026-11-15-br`; fs.mkdirSync(OUT, {recursive: true});
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
const kvFutures = keyVisual({hero: 'futures-loss-protection-hero.png', heroW: 760, chipTxt: 'Hotcoin Futuros',
  h1: 'Primeiro trade em futuros? Se der prejuízo, a gente cobre.', label: 'Fundo de compensação', big: '200.000', unit: 'USDT',
  facts: ['100% da perda líquida, até 50 USDT', 'Pago em Futures Trial Funds', '1.000 vagas para novos usuários'], deadline: 'Até sexta, 20/11, 07:00 (Brasília)', qr: 'qr-futures.png'});
const kvP2P = keyVisual({hero: 'HotcoinP2PEcosystemChallenge1-hero.png', heroW: 300, heroTop: 196, chipTxt: 'Hotcoin P2P',
  h1: 'Última chamada: seu primeiro trade P2P vale bônus.', label: 'No 1º trade P2P de 200 USDT ou mais', big: '20', unit: 'USDT',
  facts: ['Pago em Futures Trial Funds', 'Mais tarefas: até 100 USDT em Earn Trial Funds', 'Clique em "Join Now" antes de operar'], deadline: 'Até domingo, 15/11, 07:00 (Brasília)', qr: 'qr-p2p.png'});
const kvEarn = keyVisual({hero: 'HotcoinEarnRewardsBoost1-hero.png', heroW: 560, chipTxt: 'Hotcoin Earn',
  h1: 'Seu USDT rendendo. E ainda vem bônus.', label: 'Prêmios em jogo', big: '100.000', unit: 'USDT',
  facts: ['+20 USDT em Futures Trial Funds na 1ª aplicação', 'Até 1.000 USDT em Earn Trial Funds por faixa', 'Faixas não acumulam: vale a maior'], deadline: 'Até segunda, 16/11, 01:00 (Brasília)', qr: 'qr-earn.png'});

// --- Official announcement card ---
const anuncio = `<!doctype html><html><head>${head}</head><body style="background:#F7F8F6;color:${INK}">
<div style="position:absolute;left:72px;right:72px;top:64px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-black.png')}" style="height:38px"><div class="mm" style="font-size:16px;letter-spacing:2.5px;font-weight:700">ANÚNCIO OFICIAL</div></div>
<div style="position:absolute;left:72px;right:72px;top:150px;border-top:3px solid ${INK}"></div>
<div style="position:absolute;left:72px;right:72px;top:190px">
  <div class="mm" style="font-size:16px;letter-spacing:2px;color:#5E656C">AÇÕES TOKENIZADAS · 11/11/2026</div>
  <div class="b" style="font-size:76px;font-weight:800;letter-spacing:-2px;line-height:.98;margin-top:18px;font-variation-settings:'opsz' 96,'wdth' 85">SNDKB/USDT pausa e volta após desdobramento</div>
</div>
<div style="position:absolute;left:72px;right:72px;top:560px;display:flex;align-items:center;gap:40px">
  <div class="b" style="font-size:230px;font-weight:800;letter-spacing:-8px;line-height:.85">8:1</div>
  <div class="i" style="font-size:30px;line-height:1.35;color:#3F444A">Cada 1 SNDKB na sua conta deve virar <b style="color:${INK}">8 SNDKB</b>. O preço de referência fica dividido por 8.</div>
</div>
<div style="position:absolute;left:72px;right:72px;top:860px">
  ${[['19/11 · 05:00', 'Negociação suspensa. Ordens abertas são canceladas e os ativos voltam para a conta.'], ['20/11 · 07:00', 'Retorno previsto da negociação, sujeito a novo aviso da Hotcoin.']].map(([t, d], i) => `
  <div style="display:flex;gap:36px;padding:26px 0;border-top:${i ? '1.5px solid #DADDD8' : `2px solid ${INK}`}">
    <div class="mm" style="width:250px;font-size:24px;font-weight:700">${t}</div><div class="i" style="flex:1;font-size:27px;line-height:1.35">${d}</div></div>`).join('')}
  <div style="border-top:1.5px solid #DADDD8"></div>
</div>
<div class="i" style="position:absolute;left:72px;right:250px;bottom:72px;font-size:24px;color:#5E656C">Horário de Brasília. Detalhes completos no anúncio.</div>
<div style="position:absolute;right:72px;bottom:56px;background:#fff;border:1.5px solid #DADDD8;border-radius:14px;padding:10px"><img src="${O('qr-sndkb.png')}" style="width:120px;display:block"></div>
</body></html>`;

// --- GM (pt-BR) ---
const gm = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('park-m.jpg')});background-position:0 -135px"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,14,17,.75) 0%,rgba(11,14,17,.35) 26%,rgba(11,14,17,0) 40%)"></div>
${line(chart([590, 1360], [546, 846], 18, 70))}
<div style="position:absolute;left:72px;top:72px"><div class="b" style="font-size:250px;font-weight:800;letter-spacing:-4px;line-height:.85;font-variation-settings:'opsz' 96,'wdth' 80">GM.</div>
<div class="b" style="font-size:44px;font-weight:500;line-height:1.15;margin-top:18px;color:rgba(255,255,255,.85)">Hoje o caminho é grama.</div></div>
<img src="${L('logo-official-white.png')}" style="position:absolute;right:64px;bottom:60px;height:36px">
</body></html>`;

// --- Agenda (pt-BR, Brasília) ---
const days = [['SEG', '16'], ['TER', '17'], ['QUA', '18'], ['QUI', '19'], ['SEX', '20']];
const evs = [{d: 0, h: 1, t: '01:00', title: 'Earn Boost termina', who: 'Hotcoin'}, {d: 1, h: 18.3, t: '18:20', title: 'Nvidia: resultado do 3º tri', who: '$NVDAB', hot: true},
  {d: 2, h: 16, t: '16:00', title: 'Fed: ata de outubro', who: 'Macro'}, {d: 3, h: 13, t: '12:59', title: 'TradFi Wall Street termina', who: 'Hotcoin'}, {d: 4, h: 7, t: '07:00', title: 'Proteção de futuros termina', who: 'Hotcoin'}];
const GX = 72, GW = 936, GY = 360, GH = 820, cw = GW / 5, hy = (h) => GY + 60 + (h / 24) * (GH - 170);
const agenda = `<!doctype html><html><head>${head}</head><body style="background:#FFFFFF;color:${INK}">
<img src="${L('logo-official-black.png')}" style="position:absolute;left:72px;top:72px;height:36px">
<div class="b" style="position:absolute;left:72px;right:72px;top:150px;font-size:84px;font-weight:800;letter-spacing:-2px;line-height:.95;font-variation-settings:'opsz' 96,'wdth' 85">A semana em cinco horários.</div>
<svg style="position:absolute;left:0;top:0" width="1080" height="1350">
  ${days.map((d, i) => `<text x="${GX + i * cw + 14}" y="${GY + 30}" font-family="Martian Mono" font-size="17" letter-spacing="2" fill="#6B7280">${d[0]}</text><text x="${GX + i * cw + 14}" y="${GY + 54}" font-family="Bricolage Grotesque" font-weight="800" font-size="22" fill="${INK}">${d[1]}/11</text>`).join('')}
  ${[0, 6, 12, 18, 24].map((h) => `<line x1="${GX}" x2="${GX + GW}" y1="${hy(h)}" y2="${hy(h)}" stroke="#E6E8EB" stroke-width="1.5"/>`).join('')}
  ${days.map((d, i) => i ? `<line x1="${GX + i * cw}" x2="${GX + i * cw}" y1="${GY}" y2="${GY + GH}" stroke="#E6E8EB" stroke-width="1.5"/>` : '').join('')}
</svg>
${evs.map((e) => `<div style="position:absolute;left:${GX + e.d * cw + 8}px;width:${cw - 16}px;top:${hy(e.h) - 14}px">
  <div style="width:20px;height:20px;border-radius:50%;margin:0 auto;background:${e.hot ? LIME : INK};border:3px solid ${INK}"></div>
  <div style="background:${e.hot ? INK : '#F4F5F6'};color:${e.hot ? '#fff' : INK};border-radius:14px;padding:14px 12px;margin-top:10px">
    <div class="mm" style="font-size:20px;font-weight:700;color:${e.hot ? LIME : INK}">${e.t}</div>
    <div class="b" style="font-size:22px;font-weight:700;line-height:1.15;margin-top:6px">${e.title}</div>
    <div class="mm" style="font-size:13px;letter-spacing:1px;margin-top:8px;opacity:.6">${e.who}</div></div></div>`).join('')}
<div class="b" style="position:absolute;left:72px;right:72px;bottom:64px;font-size:30px;font-weight:500;color:#6B7280">Horário de Brasília. Qual deles mexe com a sua carteira?</div>
</body></html>`;

// --- Talão with the green cup (pt-BR) ---
const dots = (a, b) => `<div style="display:flex;gap:10px;align-items:baseline"><span>${a}</span><span style="flex:1;border-bottom:2px dotted #9AA0A6;transform:translateY(-6px)"></span><span style="font-weight:700">${b}</span></div>`;
const bars = Array.from({length: 46}, (_, i) => `<span style="display:inline-block;height:56px;width:${[2, 4, 2, 6, 3, 2, 4][i % 7]}px;margin-right:${[3, 2, 4, 2, 3][i % 5]}px;background:${INK}"></span>`).join('');
const talao = `<!doctype html><html><head>${head}</head><body>
<div class="bg" style="background-image:url(${P('cafe-t.jpg')});background-size:118% auto;background-position:0% 55%"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,14,17,.6),rgba(11,14,17,0) 30%)"></div>
<img src="${L('logo-official-white.png')}" style="position:absolute;left:72px;top:72px;height:40px">
<div class="b" style="position:absolute;left:72px;right:72px;top:150px;font-size:88px;font-weight:800;letter-spacing:-1.5px;line-height:.95;font-variation-settings:'opsz' 96,'wdth' 88">Um cafezinho.<br><span style="color:${LIME}">E o recibo do Earn.</span></div>
<div style="position:absolute;left:48px;top:430px;width:520px;transform:rotate(-3deg);filter:drop-shadow(0 30px 40px rgba(0,0,0,.35)) drop-shadow(0 4px 6px rgba(0,0,0,.2))">
  <div class="mm" style="background:#FCFBF8;color:${INK};padding:38px 38px 34px;font-size:19px;line-height:1.55;-webkit-mask:linear-gradient(#000,#000) top/100% calc(100% - 16px) no-repeat,conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) bottom/32px 16px repeat-x">
    <div style="text-align:center;font-weight:700;font-size:23px;letter-spacing:3px">HOTCOIN EARN</div>
    <div style="text-align:center;color:#6B7280;font-size:15px;letter-spacing:1.5px">ATÉ 16/11 · 01:00 BRASÍLIA</div>
    <div style="border-top:2px dashed ${INK};margin:18px 0 14px"></div>
    ${dots('Prazo fixo', '5.000,00 USDT')}
    <div style="border-top:2px dashed ${INK};margin:14px 0"></div>
    ${dots('Bônus 1ª aplicação', '+20')}
    <div style="color:#6B7280;font-size:14px;margin:-2px 0 8px">&nbsp;&nbsp;Futures Trial Funds · acumula</div>
    ${dots('Faixa 5.000', '+100')}
    <div style="color:#6B7280;font-size:14px">&nbsp;&nbsp;Earn Trial Funds</div>
    <div style="border-top:2px solid ${INK};margin:16px 0 10px"></div>
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-weight:700">TOTAL BÔNUS</span><span class="b" style="font-size:62px;font-weight:800;letter-spacing:-1.5px;color:${UP}">120 USDT</span></div>
    <div style="border-top:2px dashed ${INK};margin:12px 0 14px"></div>
    <div style="font-size:15px;line-height:1.6;color:#3F444A">Faixas não acumulam: vale a maior.<br>Sem resgate antecipado.</div>
    <div style="text-align:center;margin-top:18px;white-space:nowrap;overflow:hidden">${bars}</div>
    <div style="text-align:center;font-size:13px;letter-spacing:2px;margin-top:8px;color:#6B7280">OBRIGADO PELA PREFERÊNCIA</div>
  </div>
</div>
</body></html>`;

// --- Memes: serious photo, unhinged caption (X screenshot style header) ---
const meme = (photo, pos, text) => `<!doctype html><html><head>${head}</head><body style="background:#fff">
<div class="bg" style="top:300px;background-image:url(${P(photo)});background-size:1080px auto;background-position:${pos}"></div>
<div style="position:absolute;left:0;right:0;top:0;height:300px;background:#fff;padding:56px 64px 0">
  <div class="i" style="font-size:52px;font-weight:600;line-height:1.18;color:${INK};letter-spacing:-.5px">${text}</div></div>
<img src="${L('logo-official-white.png')}" style="position:absolute;left:52px;bottom:48px;height:30px;filter:drop-shadow(0 2px 8px rgba(0,0,0,.5))">
</body></html>`;
const meme1 = meme('walker-m.jpg', '0 -470px', 'eu indo avisar a família que o churrasco de domingo virou miojo');
const meme2 = meme('hallway-t.jpg', '0 -300px', 'eu indo na agência pedir pro gerente o estorno do meu stop loss');

const br = await chromium.launch();
const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [n, h] of [['kv-p2p', kvP2P], ['gm', gm], ['kv-futuros', kvFutures], ['kv-earn', kvEarn], ['anuncio-sndkb', anuncio], ['agenda', agenda], ['meme-miojo', meme1], ['talao', talao], ['meme-estorno', meme2]]) {
  await pg.setContent(h, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
  await pg.screenshot({path: `${OUT}/${n}.png`}); console.log('ok', n);
}
await br.close();
