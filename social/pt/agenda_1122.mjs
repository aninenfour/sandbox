// PT "Agenda da semana" 22/11/2026, deadlines layout (new: vertical countdown, not last week's calendar grid). All times Brasília (UTC+8 minus 11h).
// Hotcoin (tracker/events.json, from each announcement page): P2P Trading Sprint ends 28/11 18:00 UTC+8 = 28/11 07:00; Fixed-Term Earn Exclusive 28/11 19:00 UTC+8 = 08:00;
// Ronaldinho futures challenge 29/11 15:00 UTC+8 = 04:00; Spot All-Round #24 30/11 23:59 UTC+8 = 12:59; TradFi 0 Fee Carnival 04/12 23:59 UTC+8 = 04/12 12:59.
// Macro: US Thanksgiving Thu 26/11/2026, NYSE/Nasdaq closed; Fri 27/11 early close 13:00 ET = 15:00 Brasília (NYSE holiday calendar).
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const L = 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png').toString('base64');
const INK = '#0B0E11', LIME = '#B8F26A';
const rows = [
  ['QUI 26', 'FERIADO', 'Bolsa dos EUA fechada (Ação de Graças)', 'TradFi', false],
  ['SEX 27', '15:00', 'Bolsa dos EUA fecha mais cedo', 'TradFi', false],
  ['SÁB 28', '07:00', 'P2P Trading Sprint termina', 'até 50 USDT em Futures Trial Funds', true],
  ['SÁB 28', '08:00', 'Earn prazo fixo exclusivo termina', 'APR de até 6,00% em USDT', true],
  ['DOM 29', '04:00', 'Ronaldinho x Hotcoin termina', 'Patek Philippe no 1º lugar', true],
  ['SEG 30', '12:59', 'Desafio Spot #24 termina', '300.000 USDT em prêmios', true],
  ['04/12', '12:59', 'TradFi taxa zero segue até', 'taxas devolvidas até 300 USDT', true],
];
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Inter+Tight:wght@400;500;600&family=Martian+Mono:wght@400;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#fff;color:${INK}}
.b{font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}.mm{font-family:'Martian Mono'}.i{font-family:'Inter Tight'}
</style></head><body>
<img src="${L}" style="position:absolute;left:72px;top:72px;height:36px">
<div class="b" style="position:absolute;left:72px;right:72px;top:150px;font-size:88px;font-weight:800;letter-spacing:-2px;line-height:.95;font-variation-settings:'opsz' 96,'wdth' 85">Prazos da semana.</div>
<div class="i" style="position:absolute;left:72px;top:262px;font-size:30px;color:#5E656C">Do feriado nos EUA ao último dia dos desafios. Horário de Brasília.</div>
<div style="position:absolute;left:72px;right:72px;top:350px">
${rows.map(([d, t, title, sub, hot], i) => `<div style="display:flex;align-items:center;gap:28px;padding:30px 0;border-top:${i ? '1.5px solid #E6E8EB' : `3px solid ${INK}`}">
  <div class="mm" style="width:120px;font-size:19px;font-weight:700;letter-spacing:1px">${d}</div>
  <div class="mm" style="width:150px;font-size:24px;font-weight:700;${hot ? `background:${INK};color:${LIME};` : 'background:#F1F2F3;'}padding:10px 0;text-align:center;border-radius:10px">${t}</div>
  <div style="flex:1"><div class="b" style="font-size:31px;font-weight:700;line-height:1.1">${title}</div>
    <div class="i" style="font-size:22px;color:#5E656C;margin-top:5px">${sub}</div></div></div>`).join('')}
<div style="border-top:1.5px solid #E6E8EB"></div></div>
</body></html>`;
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await pg.setContent(html, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
fs.mkdirSync(`${DIR}/day-2026-11-22-br`, {recursive: true}); await pg.screenshot({path: `${DIR}/day-2026-11-22-br/agenda.png`}); await br.close(); console.log('ok');
