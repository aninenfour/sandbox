// PT Anúncio oficial 16/11: ANTHROPICUSDT -> ANTUSDT (pre-IPO perpetual). Source: hotcoin.com/en_US/announcement/
// HotcoinWillDelistandRelistANTHROPICUSDTPerpetualFuturesFollowingContractAdjustments/ (16/11/2026). UTC+8 -> Brasília (-11h):
// 17/11 11:30 no new positions = 00:30; 11:45 liquidation = 00:45; 12:00 delist = 01:00; est. relist 20:00 = 09:00. Positions not carried over.
// Run: PW_PATH=$(npm root -g)/playwright node social/pt/anuncio_ant.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const L = 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-black.png').toString('base64');
const Q = 'data:image/png;base64,' + fs.readFileSync(`${DIR}/art/official/qr-ant.png`).toString('base64');
const INK = '#0B0E11', RED = '#E5484D';
const rows = [['17/11 · 00:30', 'Novas posições bloqueadas.'], ['17/11 · 00:45', 'Posições abertas liquidadas. Na deslistagem (01:00), ordens pendentes são canceladas.'], ['17/11 · 09:00', 'Retorno previsto como ANTUSDT, com novo tamanho de contrato e preço de marcação.']];
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Inter+Tight:wght@400;500;600;700&family=Martian+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#F7F8F6;color:${INK}}
.b{font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}.mm{font-family:'Martian Mono'}.i{font-family:'Inter Tight'}
</style></head><body>
<div style="position:absolute;left:72px;right:72px;top:64px;display:flex;justify-content:space-between;align-items:center"><img src="${L}" style="height:38px"><div class="mm" style="font-size:16px;letter-spacing:2.5px;font-weight:700">ANÚNCIO OFICIAL</div></div>
<div style="position:absolute;left:72px;right:72px;top:150px;border-top:3px solid ${INK}"></div>
<div style="position:absolute;left:72px;right:72px;top:190px">
  <div class="mm" style="font-size:16px;letter-spacing:2px;color:#5E656C">FUTUROS PRÉ-IPO · 16/11/2026</div>
  <div class="b" style="font-size:80px;font-weight:800;letter-spacing:-2px;line-height:.98;margin-top:18px;font-variation-settings:'opsz' 96,'wdth' 85">ANTHROPICUSDT vira ANTUSDT</div>
</div>
<div style="position:absolute;left:72px;right:72px;top:470px;display:flex;align-items:center;gap:40px">
  <div class="b" style="font-size:200px;font-weight:800;letter-spacing:-8px;line-height:.85;color:${RED}">00:45</div>
  <div class="i" style="font-size:29px;line-height:1.35;color:#3F444A">Esta noite, horário de Brasília. Posições <b style="color:${INK}">não passam</b> para o novo contrato: feche antes.</div>
</div>
<div style="position:absolute;left:72px;right:72px;top:760px">
  ${rows.map(([t, d], i) => `<div style="display:flex;gap:36px;padding:24px 0;border-top:${i ? '1.5px solid #DADDD8' : `2px solid ${INK}`}"><div class="mm" style="width:250px;font-size:24px;font-weight:700">${t}</div><div class="i" style="flex:1;font-size:27px;line-height:1.35">${d}</div></div>`).join('')}
  <div style="border-top:1.5px solid #DADDD8"></div>
</div>
<div style="position:absolute;right:72px;bottom:56px;background:#fff;border:1.5px solid #DADDD8;border-radius:14px;padding:10px"><img src="${Q}" style="width:120px;display:block"></div>
</body></html>`;
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await pg.setContent(html, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
await pg.screenshot({path: `${DIR}/day-2026-11-16-br/anuncio-ant.png`}); await br.close(); console.log('ok');
