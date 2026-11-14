// PT channel preview stills (pt-PT). 1080x1350 @2x.
// Sources (checked 2026-11-14):
//  - Futures Loss Compensation: hotcoin.com/en_US/announcement/futures-loss-protection/ (Nov 6 18:00 to Nov 20 18:00 UTC+8, paid as Futures Trial Funds)
//  - Earn Rewards Boost: hotcoin.com/en_US/announcement/HotcoinEarnRewardsBoost1/ (Nov 6 12:00 to Nov 16 12:00 UTC+8; Event 2 = Earn Trial Funds, tiers don't stack)
//  - MiCA in Portugal: eco.sapo.pt/2026/07/01/novas-regras-sobre-mercado-de-criptoativos-ja-estao-em-vigor-com-multas-ate-5-milhoes/ (in force Jul 1 2026, BdP + CMVM, fines up to EUR 5M)
// Run: PW_PATH=$(npm root -g)/playwright node social/pt/preview.mjs
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
import fs from 'fs';
const L = (f)=>'data:image/png;base64,'+fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/'+f).toString('base64');
const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A', UP = '#17A86B', GRAY = '#6B7280', LINE = '#E6E8EB';
const head = `<meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Instrument+Serif:ital@1&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;font-family:'Inter Tight',sans-serif}
.m{font-family:'JetBrains Mono',monospace}.s{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400}
</style>`;

// 1) LEMBRETE: futures loss compensation, ink "ticket" with countdown
const ticket = `<!doctype html><html><head>${head}</head><body style="background:${INK};color:#fff">
<div style="position:absolute;inset:0;background:radial-gradient(900px 600px at 85% 15%,rgba(184,242,106,.16),transparent 60%)"></div>
<div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.07) 1.5px,transparent 1.6px);background-size:22px 22px"></div>
<div style="position:absolute;left:72px;right:72px;top:72px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-white.png')}" style="height:44px">
  <div class="m" style="font-size:19px;letter-spacing:2px;color:${INK};background:${LIME};border-radius:999px;padding:10px 20px">LEMBRETE · TERMINA A 20 NOV</div>
</div>
<div style="position:absolute;left:72px;top:200px;right:72px">
  <div class="m" style="font-size:22px;letter-spacing:3px;color:rgba(255,255,255,.55)">FUTUROS · PROTEÇÃO DE PERDAS</div>
  <div style="font-weight:800;font-size:250px;letter-spacing:-12px;line-height:.9;margin-top:18px;color:${LIME}">100%</div>
  <div style="font-weight:700;font-size:60px;letter-spacing:-2px;line-height:1.05;margin-top:18px">da perda no primeiro trade<br><span class="s" style="font-size:72px;letter-spacing:0;color:rgba(255,255,255,.7)">coberta, até 50 USDT.</span></div>
</div>
<div style="position:absolute;left:72px;right:72px;top:800px;border-radius:28px;background:#fff;color:${INK};display:flex;overflow:hidden">
  <div style="flex:1;padding:38px 40px">
    <div class="m" style="font-size:17px;letter-spacing:2.5px;color:${GRAY}">COMO FUNCIONA</div>
    ${[['01','Clique em "Join Now" na campanha'],['02','Primeiro trade de futuros, volume ≥ 500 USDT'],['03','Perda líquida devolvida em Futures Trial Funds']].map(([n,t])=>`
    <div style="display:flex;gap:18px;align-items:baseline;margin-top:20px"><span class="m" style="font-weight:700;font-size:22px;color:${UP}">${n}</span><span style="font-weight:600;font-size:28px;letter-spacing:-.5px">${t}</span></div>`).join('')}
  </div>
  <div style="width:290px;border-left:3px dashed ${LINE};padding:38px 30px;display:flex;flex-direction:column;justify-content:space-between;background:#F6F8F4">
    <div><div class="m" style="font-size:16px;letter-spacing:2px;color:${GRAY}">VAGAS</div><div style="font-weight:800;font-size:58px;letter-spacing:-2px">1.000</div><div style="font-size:20px;color:${GRAY}">novos utilizadores</div></div>
    <div><div class="m" style="font-size:16px;letter-spacing:2px;color:${GRAY}">FIM</div><div class="m" style="font-weight:700;font-size:26px;white-space:nowrap">20.11 · 10:00</div><div style="font-size:20px;color:${GRAY}">hora de Lisboa</div></div>
  </div>
</div>
<div class="m" style="position:absolute;left:72px;right:72px;top:1180px;display:flex;justify-content:space-between;font-size:19px;letter-spacing:2px;color:rgba(255,255,255,.6)"><span>+ COMPENSAÇÃO DE LIQUIDAÇÃO ATÉ 500 USDT</span><span style="color:${LIME}">ACUMULÁVEL</span></div>
</body></html>`;

// 2) GANHAR: Earn Rewards Boost ladder, white data style
const tiers = [[1000,50],[5000,100],[20000,200],[50000,500],[100000,1000]];
const fmt = (n)=>n.toLocaleString('pt-PT').replace(/\s/g,'.');
const ladder = (()=>{const w=900,h=360,X=i=>40+i*(w-80)/4,Y=v=>h-30-Math.sqrt(v/1000)*(h-80);
  return `<svg width="${w}" height="${h+60}" style="overflow:visible">
  ${[0,.25,.5,.75,1].map(f=>`<line x1="0" x2="${w}" y1="${(h-30)*f+0}" y2="${(h-30)*f}" stroke="${LINE}" stroke-width="1.5"/>`).join('')}
  <line x1="0" x2="${w}" y1="${h-30}" y2="${h-30}" stroke="${INK}" stroke-width="2"/>
  ${tiers.map(([s,r],i)=>{const top=Y(r),last=i===4;return `<rect x="${X(i)-56}" y="${top}" width="112" height="${h-30-top}" rx="10" fill="${last?LIME:INK}" ${last?`stroke="${INK}" stroke-width="3"`:''}/>
  <text x="${X(i)}" y="${top-16}" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="26" fill="${last?UP:INK}">+${fmt(r)}</text>
  <text x="${X(i)}" y="${h+6}" text-anchor="middle" font-family="JetBrains Mono" font-size="19" fill="${GRAY}">${s>=1000?fmt(s/1000)+'K':s}</text>`}).join('')}
  <text x="0" y="${h+46}" font-family="JetBrains Mono" font-size="16" fill="${GRAY}" letter-spacing="1.5">SUBSCRIÇÃO ACUMULADA (USDT) → RECOMPENSA EM EARN TRIAL FUNDS</text>
  </svg>`})();
const earn = `<!doctype html><html><head>${head}</head><body style="background:#fff;color:${INK}">
<div style="position:absolute;right:-120px;top:120px;width:640px;height:640px;border-radius:50%;background:radial-gradient(circle,rgba(126,194,90,.18),transparent 65%)"></div>
<div style="position:absolute;left:72px;right:72px;top:72px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-black.png')}" style="height:44px">
  <div class="m" style="font-size:19px;letter-spacing:2px;border:1.5px solid ${INK};border-radius:999px;padding:10px 20px">GANHAR COM A HOTCOIN · 6 A 16 NOV</div>
</div>
<div style="position:absolute;left:72px;top:190px;right:72px">
  <div class="m" style="font-size:22px;letter-spacing:3px;color:${GRAY}">ATÉ</div>
  <div style="font-weight:800;font-size:150px;letter-spacing:-7px;line-height:.95;color:${UP};margin-top:6px;white-space:nowrap">+1.000 USDT</div>
  <div style="font-weight:700;font-size:52px;letter-spacing:-1.5px;line-height:1.08;margin-top:22px">em Earn Trial Funds,<br><span style="color:${GRAY}">por subscrever Earn a prazo fixo.</span></div>
</div>
<div style="position:absolute;left:90px;top:660px">${ladder}</div>
<div style="position:absolute;left:72px;right:72px;top:1150px;display:flex;gap:20px">
  <div style="flex:1;border:1.5px solid ${INK};border-radius:22px;padding:24px 28px"><div class="m" style="font-size:16px;letter-spacing:2px;color:${GRAY}">BÓNUS 1ª SUBSCRIÇÃO</div><div style="font-weight:700;font-size:30px;margin-top:8px">≥ 500 USDT → <span style="color:${UP}">20 USDT</span></div><div style="font-size:19px;color:${GRAY};margin-top:4px">em Futures Trial Funds · acumula</div></div>
  <div style="flex:1;background:${INK};color:#fff;border-radius:22px;padding:24px 28px"><div class="m" style="font-size:16px;letter-spacing:2px;color:rgba(255,255,255,.55)">ATENÇÃO</div><div style="font-weight:700;font-size:30px;margin-top:8px">Só conta o <span style="color:${LIME}">escalão mais alto</span></div><div style="font-size:19px;color:rgba(255,255,255,.6);margin-top:4px">escalões não acumulam entre si</div></div>
</div>
</body></html>`;

// 3) LOCAL: MiCA in Portugal explainer, original tile grid in brand colours
const tile = (i)=>{const r=i%4;return `<svg viewBox="0 0 100 100" width="120" height="120"><rect width="100" height="100" fill="none"/>
 ${r===0?`<circle cx="50" cy="50" r="30" fill="none" stroke="${LIME}" stroke-width="5"/><circle cx="50" cy="50" r="8" fill="${LIME}"/>`:
   r===1?`<path d="M0 50 Q25 20 50 50 T100 50" fill="none" stroke="${GREEN}" stroke-width="5"/><path d="M0 70 Q25 40 50 70 T100 70" fill="none" stroke="${GREEN}" stroke-width="5" opacity=".5"/>`:
   r===2?`<path d="M50 10 L90 50 L50 90 L10 50Z" fill="none" stroke="${LIME}" stroke-width="5"/>`:
   `<path d="M0 0 Q50 50 100 0 M0 100 Q50 50 100 100" fill="none" stroke="${GREEN}" stroke-width="5"/>`}</svg>`};
const mica = `<!doctype html><html><head>${head}</head><body style="background:#F4F1EA;color:${INK}">
<div style="position:absolute;left:0;right:0;top:0;height:480px;background:${INK};display:grid;grid-template-columns:repeat(9,120px);overflow:hidden;opacity:1">${Array.from({length:36},(_, i)=>tile(i+Math.floor(i/9))).join('')}</div>
<div style="position:absolute;left:0;right:0;top:0;height:480px;background:linear-gradient(180deg,rgba(11,14,17,.6),rgba(11,14,17,.95))"></div>
<div style="position:absolute;left:72px;right:72px;top:72px;display:flex;justify-content:space-between;align-items:center">
  <img src="${L('logo-official-white.png')}" style="height:44px">
  <div class="m" style="font-size:19px;letter-spacing:2px;color:${INK};background:${LIME};border-radius:999px;padding:10px 20px">PORTUGAL · EXPLICADO</div>
</div>
<div style="position:absolute;left:72px;right:72px;top:250px;color:#fff">
  <div class="m" style="font-size:22px;letter-spacing:3px;color:rgba(255,255,255,.6)">MiCA EM PORTUGAL</div>
  <div style="font-weight:800;font-size:92px;letter-spacing:-4px;line-height:.98;margin-top:12px">Cripto já tem <span class="s" style="font-size:108px;letter-spacing:-1px;color:${LIME}">regras.</span></div>
</div>
<div style="position:absolute;left:72px;right:72px;top:560px">
  <div style="font-weight:700;font-size:46px;letter-spacing:-1.2px;line-height:1.12">O que mudou desde 1 de julho de 2026,<br><span style="color:${GRAY}">em três números.</span></div>
  ${[['01.07.2026','Entrada em vigor da lei nacional que aplica o MiCA'],['2','Supervisores: Banco de Portugal e CMVM'],['5 M€','Coima máxima para empresas em incumprimento']].map(([n,t],i)=>`
  <div style="display:flex;align-items:center;gap:36px;border-top:${i?'1.5px solid #DAD5CA':'2px solid '+INK};padding:46px 0">
    <div style="width:330px;font-weight:800;font-size:${n.length>6?62:84}px;letter-spacing:-3px;color:${i===2?'#E5484D':INK}">${n}</div>
    <div style="flex:1;font-weight:600;font-size:31px;letter-spacing:-.4px;line-height:1.2">${t}</div></div>`).join('')}
  <div style="border-top:1.5px solid #DAD5CA"></div>
</div>
</body></html>`;

const br = await chromium.launch();
const pg = await br.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:2});
for (const [n,h] of [['01-lembrete-futuros',ticket],['02-ganhar-earn',earn],['03-local-mica',mica]]) {
  await pg.setContent(h,{waitUntil:'networkidle'}); await pg.evaluate(()=>document.fonts.ready); await pg.waitForTimeout(400);
  await pg.screenshot({path:`${DIR}/${n}.png`}); console.log('ok',n);
}
await br.close();
