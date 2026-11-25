// Hotcoin Português (Brazil): news formats. pt-BR, Brasília time.
// Top coin 25/11: MANTRA/USDT +35.29% (last 0.0023), BTC/USDT -3.35% (58,012), Hotcoin ticker 2026-11-25 12:09 Brasília. KOR (+76.5%) skipped (no CoinGecko match). MANTRA = MANTRA (CoinGecko mantra 0.00229, +34.4%), RWA-focused Layer 1.
// Top coin 24/11: SAHARA/USDT +7.85% (last 0.00563), BTC/USDT -4.64% (60,012.85), Hotcoin ticker 2026-11-24 12:10 Brasília. UNC (+51.5%) and URNA (+38.0%) skipped (no CoinGecko match); CYS (+10.7%) skipped (yesterday's pick). SAHARA = Sahara AI (CoinGecko sahara-ai 0.00567, +8.7%). Caption says 'entre as maiores altas'.
// Top coin 23/11: CYS/USDT +18.83% (last 0.04852), BTC/USDT +3.36% (62,984.71), Hotcoin ticker 2026-11-23 12:10 Brasília. Tokenized stocks/leveraged ETF tokens (MVLLB, SOXLB, MUUB, NVDAB...) skipped. CYS = Cysic (CoinGecko cysic, 0.0482, +18.2%), ZK proof and hardware compute network.
// Top coin 22/11: PIEVERSE/USDT +25.23% (last 3.6858), BTC/USDT +1.07% (60,943.05), Hotcoin ticker 2026-11-22 12:08 Brasília. CoinGecko pieverse 3.71, +26.1%. Second day in a row as top gainer.
// Top coin 21/11: PIEVERSE/USDT +14.21% (last 2.9502), BTC/USDT -1.76% (60,315.62), Hotcoin ticker 2026-11-21 12:09 Brasília. SOXSB (+14.0%) skipped (leveraged ETF token). PIEVERSE = Pieverse (CoinGecko pieverse, rank 75, 2.95, +14.0%), categories AI / TimeFi.
// Top coin 19/11: PEARL/USDT +23.62% (last 2.3394), BTC/USDT +0.15% (63,686.01), Hotcoin ticker 2026-11-19 12:09 Brasília. PEARL = Pearl (CoinGecko pearl-2, rank 72, 2.32, +23.2%), Proof-of-Useful-Work L1 (mining from AI compute).
// Top coin 17/11: BREV/USDT +112.54% (last 0.122), BTC/USDT -0.07% (64,576.15), Hotcoin ticker 2026-11-17 12:10 Brasília. BREV = Brevis (CoinGecko brevis, 0.1232, +114.8%), ZK coprocessor.
// Top coin 16/11: RAIN/USDT +113.52% (last 0.007909), BTC/USDT -0.33% (64,543.51), Hotcoin ticker 2026-11-16 12:11 Brasília. RAIN = Rain (CoinGecko rain, rank 19, 0.0078, +110.6%).
// Top coin 15/11: JCT/USDT +12.15% (last 0.002113), BTC/USDT -2.00% (64,573.34), Hotcoin ticker 2026-11-15 12:08 Brasília. GNR (+39.5%) and UNC (+14.4%) skipped: no verified CoinGecko match. JCT = Janction (CoinGecko janction, price 0.00211 matches).
// Earlier: Top coin: Hotcoin public API api.hotcoinfin.com/v1/market/ticker, snapshot 2026-11-14 15:09 UTC (12:09 Brasília), 24h change: UP/USDT +20.03% (last 0.15931), BTC/USDT -4.51% (last 65,726.73). Earlier snapshot 11:38 UTC:
//   UP/USDT +23.24% (last 0.175), BTC/USDT -2.96% (last 67,177.64). UP = Unitas (CoinGecko id unitas), logo from CoinGecko.
// Chain review: DefiLlama. Solana TVL 4.811B (2026-11-14) vs 5.919B (2026-10-15) = -18.7%; vs 5.226B (2026-11-07) = -7.9%.
//   DEX volume 24h 1.56B, 30d 52.3B (-26.4% vs prior 30d); fees 24h 9.14M, 30d 324.6M (-23.4%). Logo from CoinGecko.
// TradFi review: Jensen Huang resigned as Nvidia CEO on 12 Nov 2026, CFO Colette Kress interim CEO; NVDA closed down more than 4% that day
//   (CNBC, Al Jazeera, Fox Business, 12 Nov 2026). Q3 FY27 results Tue 17 Nov ~1:20pm PT = 18:20 Brasília (Nvidia IR).
//   Photo: Anderseidesvik, CC BY-SA 4.0, Wikimedia Commons (File:Jensen_Huang_Stanford_2026-04-30_010_(cropped).jpg), converted to mono. Credit in caption.
// Run: PW_PATH=$(npm root -g)/playwright node social/pt/news_br.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const OUT = `${DIR}/news-br`; fs.mkdirSync(OUT, {recursive: true});
const L = (f) => 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/' + f).toString('base64');
const N = (f) => `data:image/${f.endsWith('png') ? 'png' : 'jpeg'};base64,` + fs.readFileSync(`${DIR}/art/news/${f}`).toString('base64');
const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#17A86B', RED = '#E5484D';
const head = `<meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Inter+Tight:wght@400;500;600;700&family=Martian+Mono:wdth,wght@75..112.5,300..700&family=Doto:wght@500..900&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:${INK};color:#fff}
.b{font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}.mm{font-family:'Martian Mono'}.d{font-family:'Doto';font-weight:900}.i{font-family:'Inter Tight'}
</style>`;

// 1) Top coin of the day: stadium scoreboard
const placar = `<!doctype html><html><head>${head}</head><body>
<div style="position:absolute;inset:0;background:radial-gradient(500px 300px at 12% -4%,rgba(255,255,255,.22),transparent 70%),radial-gradient(500px 300px at 88% -4%,rgba(255,255,255,.22),transparent 70%),linear-gradient(180deg,#10151A,#07090A 60%)"></div>
<div style="position:absolute;left:0;right:0;bottom:0;height:330px;background:repeating-linear-gradient(90deg,#123017 0 90px,#173A1C 90px 180px);opacity:.9"></div>
<div style="position:absolute;left:0;right:0;bottom:330px;height:3px;background:rgba(255,255,255,.5)"></div>
<div style="position:absolute;left:540px;bottom:0;width:3px;height:330px;margin-left:-1px;background:rgba(255,255,255,.4)"></div>
<div style="position:absolute;left:390px;bottom:15px;width:300px;height:300px;border:3px solid rgba(255,255,255,.4);border-radius:50%"></div>
<img src="${L('logo-official-white.png')}" style="position:absolute;left:72px;top:64px;height:38px">
<div class="b" style="position:absolute;left:72px;right:72px;top:150px;font-size:88px;font-weight:800;letter-spacing:-2px;line-height:.95;font-variation-settings:'opsz' 96,'wdth' 85">Placar do dia.</div>
<div style="position:absolute;left:60px;right:60px;top:330px;background:#050607;border:6px solid #1C2227;border-radius:22px;padding:36px 40px 40px;box-shadow:0 30px 80px rgba(0,0,0,.6),inset 0 0 40px rgba(0,0,0,.8)">
  <div class="mm" style="display:flex;justify-content:space-between;font-size:18px;letter-spacing:3px;color:#7D868E"><span>HOTCOIN · 24H</span><span>25/11 · 12:09 BRASÍLIA</span></div>
  <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;margin-top:30px;gap:10px">
    <div style="text-align:center"><img src="${N('mantra.png')}" style="width:120px;height:120px;border-radius:50%;background:#fff"><div class="d" style="font-size:54px;margin-top:14px">MANTRA</div></div>
    <div class="d" style="font-size:44px;color:#5B636B">×</div>
    <div style="text-align:center"><div style="width:120px;height:120px;border-radius:50%;margin:0 auto;border:4px solid #2A3137;display:grid;place-items:center" class="d"><span style="font-size:44px;color:#9AA2A9">₿</span></div><div class="d" style="font-size:54px;margin-top:14px;color:#9AA2A9">BTC</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;margin-top:24px">
    <div class="d" style="text-align:center;font-size:100px;color:${LIME};text-shadow:0 0 30px rgba(184,242,106,.45)">+35,3</div>
    <div class="d" style="font-size:60px;color:#5B636B">:</div>
    <div class="d" style="text-align:center;font-size:100px;color:#F6465D;text-shadow:0 0 30px rgba(246,70,93,.35)">-3,4</div>
  </div>
  <div class="mm" style="text-align:center;font-size:18px;letter-spacing:3px;color:#7D868E;margin-top:8px">VARIAÇÃO EM %</div>
</div>
<div style="position:absolute;left:0;right:0;bottom:0;height:330px;background:linear-gradient(180deg,rgba(7,9,10,.2),rgba(7,9,10,.88) 55%)"></div>
<div style="position:absolute;left:72px;right:72px;bottom:96px">
  <div class="b" style="font-size:44px;font-weight:700;letter-spacing:-.5px">MANTRA ($MANTRA) goleou o mercado.</div>
  <div class="i" style="font-size:27px;color:rgba(255,255,255,.75);margin-top:8px">Layer 1 de ativos do mundo real (RWA). Maior alta cripto verificada em 24h na Hotcoin.</div>
</div>
</body></html>`;

// 2) Chain review: Solana, white data post
const pts = JSON.parse(fs.readFileSync(`${DIR}/art/news/sol_tvl_90d.json`));
const CW = 936, CH = 300, vmin = 4.4, vmax = 6.4, X = (i) => (i / (pts.length - 1)) * CW, Y = (v) => CH - ((v - vmin) / (vmax - vmin)) * CH;
const path = pts.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ');
const iOct15 = pts.length - 31, last = pts.length - 1;
const chain = `<!doctype html><html><head>${head}</head><body style="background:#fff;color:${INK}">
<div style="position:absolute;left:72px;right:72px;top:64px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-black.png')}" style="height:38px"><div class="mm" style="font-size:16px;letter-spacing:2.5px;font-weight:700">RAIO-X DA REDE</div></div>
<div style="position:absolute;left:72px;top:150px;display:flex;align-items:center;gap:22px"><img src="${N('sol.png')}" style="width:64px;height:64px"><div class="b" style="font-size:48px;font-weight:800;letter-spacing:-1px">Solana</div></div>
<div style="position:absolute;left:72px;right:72px;top:240px">
  <div class="b" style="font-size:176px;font-weight:800;letter-spacing:-7px;line-height:.95;color:${RED}">−18,7%</div>
  <div class="b" style="font-size:46px;font-weight:700;letter-spacing:-1px;line-height:1.1;margin-top:14px">de valor travado (TVL) em 30 dias.<br><span style="color:#6B7280">De US$ 5,92 bi para US$ 4,81 bi.</span></div>
</div>
<svg style="position:absolute;left:72px;top:640px;overflow:visible" width="${CW}" height="${CH + 40}">
  <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${RED}" stop-opacity=".14"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></linearGradient></defs>
  <rect x="${X(iOct15)}" y="0" width="${CW - X(iOct15)}" height="${CH}" fill="#F6F7F8"/>
  ${[4.5, 5, 5.5, 6].map((v) => `<line x1="0" x2="${CW}" y1="${Y(v)}" y2="${Y(v)}" stroke="#E6E8EB" stroke-width="1.5"/><text x="0" y="${Y(v) - 8}" font-family="Martian Mono" font-size="15" fill="#9AA0A6" stroke="#fff" stroke-width="8" paint-order="stroke">${String(v).replace('.', ',')} bi</text>`).join('')}
  <path d="${path} L${CW},${CH} L0,${CH}Z" fill="url(#ga)"/>
  <path d="${path}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  <circle cx="${X(iOct15)}" cy="${Y(pts[iOct15][1])}" r="8" fill="#fff" stroke="${INK}" stroke-width="3"/>
  <circle cx="${X(last)}" cy="${Y(pts[last][1])}" r="10" fill="${RED}"/>
  <text x="0" y="${CH + 32}" font-family="Martian Mono" font-size="15" fill="#6B7280">16/08</text>
  <text x="${X(iOct15)}" y="${CH + 32}" text-anchor="middle" font-family="Martian Mono" font-size="15" fill="#6B7280">15/10</text>
  <text x="${CW}" y="${CH + 32}" text-anchor="end" font-family="Martian Mono" font-size="15" fill="#6B7280">14/11</text>
</svg>
<div style="position:absolute;left:72px;right:72px;top:1040px">
  ${[['Volume em DEX, 24h', 'US$ 1,56 bi', '30 dias: −26%'], ['Taxas da rede, 24h', 'US$ 9,1 mi', '30 dias: −23%']].map(([a, b, c], i) => `
  <div class="i" style="display:flex;align-items:baseline;padding:20px 0;border-top:${i ? '1.5px solid #E6E8EB' : `2px solid ${INK}`};font-size:28px"><div style="flex:1;font-weight:500">${a}</div><div style="width:240px;text-align:right;font-weight:700">${b}</div><div style="width:240px;text-align:right;color:${RED};font-weight:600">${c}</div></div>`).join('')}
  <div style="border-top:1.5px solid #E6E8EB"></div>
</div>
</body></html>`;

// 3) TradFi review with a real (licensed) photo, news format only
const tradfi = `<!doctype html><html><head>${head}</head><body>
<div style="position:absolute;left:0;right:0;top:0;height:860px;background:url(${N('huang-m.jpg')}) 50% 18%/1080px auto no-repeat"></div>
<div style="position:absolute;left:0;right:0;top:0;height:860px;background:linear-gradient(180deg,rgba(11,14,17,.55) 0%,rgba(11,14,17,0) 22%,rgba(11,14,17,0) 70%,${INK} 100%)"></div>
<div style="position:absolute;left:72px;right:72px;top:64px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-white.png')}" style="height:38px"><div class="mm" style="font-size:16px;letter-spacing:2.5px;font-weight:700;color:${LIME}">RAIO-X TRADFI</div></div>
<div style="position:absolute;left:72px;right:72px;top:740px">
  <div class="b" style="font-size:78px;font-weight:800;letter-spacing:-2px;line-height:.98;font-variation-settings:'opsz' 96,'wdth' 85">Nvidia divulga o primeiro balanço sem Jensen Huang.</div>
  <div style="margin-top:34px;display:grid;gap:0">
    ${[['12/11', 'Huang deixa o cargo de CEO. A diretora financeira Colette Kress assume interinamente.'], ['12/11', 'Ação fecha em queda de mais de 4% no dia do anúncio.'], ['TER 17/11 · 18:20', 'Resultado do 3º trimestre, horário de Brasília. Na Hotcoin: $NVDAB.']].map(([t, d], i) => `
    <div style="display:flex;gap:30px;padding:20px 0;border-top:1.5px solid rgba(255,255,255,${i ? .12 : .4})"><div class="mm" style="width:250px;font-size:20px;font-weight:700;color:${i === 2 ? LIME : '#fff'}">${t}</div><div class="i" style="flex:1;font-size:26px;line-height:1.35;color:rgba(255,255,255,.85)">${d}</div></div>`).join('')}
  </div>
</div>
</body></html>`;

const br = await chromium.launch();
const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
for (const [n, h] of [['placar-up', placar], ['raiox-solana', chain], ['raiox-tradfi-nvidia', tradfi]]) {
  await pg.setContent(h, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
  await pg.screenshot({path: `${OUT}/${n}.png`}); console.log('ok', n);
}
await br.close();
