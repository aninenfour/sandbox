// PT GM 23/11: Porto Alegre skyline over the trees, mono. The lime line traces the real rooftop line (detected from the sky mask) left to right and stops on the tallest tower.
// Photo: will dornelles (Unsplash nLuken1lHRE), Unsplash License. No data claims. Run: PW_PATH=$(npm root -g)/playwright node social/pt/gm_sp.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/pt';
const P = 'data:image/jpeg;base64,' + fs.readFileSync(`${DIR}/art/poa-m.jpg`).toString('base64');
const L = 'data:image/png;base64,' + fs.readFileSync('/home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png').toString('base64');
const LIME = '#B8F26A';
let seed = 5; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pts = [[-20, 630.5], [0.0, 630.5], [6.0, 630.5], [12.0, 630.5], [18.0, 627.0], [24.0, 627.0], [30.0, 620.0], [36.0, 613.5], [42.0, 613.5], [48.0, 614.0], [54.0, 614.0], [60.0, 614.5], [66.0, 615.5], [72.0, 644.5], [78.0, 645.5], [84.0, 646.5], [90.0, 654.0], [96.0, 658.5], [102.0, 658.5], [108.0, 658.5], [114.0, 658.5], [120.0, 658.5], [126.0, 658.5], [132.0, 659.0], [138.0, 659.0], [144.0, 659.0], [150.0, 659.0], [156.0, 661.0], [162.0, 664.0], [168.0, 664.0], [174.0, 659.0], [180.0, 628.5], [186.0, 627.0], [192.0, 595.5], [198.0, 595.5], [204.0, 595.5], [210.0, 595.5], [216.0, 590.0], [222.0, 564.5], [228.0, 564.5], [234.0, 564.5], [240.0, 562.0], [246.0, 562.0], [252.0, 565.0], [258.0, 565.5], [264.0, 566.0], [270.0, 566.0], [276.0, 565.0], [282.0, 565.0], [288.0, 592.0], [294.0, 592.5], [300.0, 592.5], [306.0, 624.5], [312.0, 630.0], [318.0, 653.0], [324.0, 653.0], [330.0, 653.0], [336.0, 628.5], [342.0, 615.0], [348.0, 595.0], [354.0, 559.0], [360.0, 557.0], [366.0, 545.5], [372.0, 542.5], [378.0, 538.0], [384.0, 519.5], [390.0, 519.5], [396.0, 520.5], [402.0, 521.5], [408.0, 543.0], [414.0, 543.5], [420.0, 545.5], [426.0, 546.0], [432.0, 546.5], [438.0, 557.5], [444.0, 598.5], [450.0, 598.5], [456.0, 597.5], [462.0, 597.5], [468.0, 600.0], [474.0, 607.0], [480.0, 607.0], [486.0, 607.0], [492.0, 609.5], [498.0, 612.0], [504.0, 616.0], [510.0, 617.0], [516.0, 617.5], [522.0, 626.0], [528.0, 642.0], [534.0, 644.0], [540.0, 654.0], [546.0, 656.5], [552.0, 656.0], [558.0, 656.0], [564.0, 656.0], [570.0, 658.0], [576.0, 659.0], [582.0, 660.0], [588.0, 659.0], [594.0, 656.0], [600.0, 639.0], [606.0, 564.5], [612.0, 564.5], [618.0, 564.5], [624.0, 564.0], [630.0, 560.0], [636.0, 560.0], [642.0, 559.5], [648.0, 559.0], [654.0, 532.0], [660.0, 531.5], [666.0, 531.5], [672.0, 531.5], [678.0, 531.5], [684.0, 532.0], [690.0, 532.5], [696.0, 532.5], [702.0, 533.5], [708.0, 565.0], [714.0, 565.5], [720.0, 629.5], [726.0, 636.5], [732.0, 636.5], [738.0, 626.5], [744.0, 626.0], [750.0, 626.0], [756.0, 615.0], [762.0, 598.5], [768.0, 598.5], [774.0, 598.5], [780.0, 598.5], [786.0, 598.5], [792.0, 591.5], [798.0, 583.0], [804.0, 570.0], [810.0, 545.5], [816.0, 545.5], [822.0, 547.0], [828.0, 547.5], [834.0, 547.5], [840.0, 561.5], [846.0, 563.0], [852.0, 600.0], [858.0, 600.0], [864.0, 600.0], [870.0, 596.0], [876.0, 588.5], [882.0, 588.0], [888.0, 588.0], [894.0, 588.5], [900.0, 596.0], [906.0, 598.0], [912.0, 598.0], [918.0, 597.5], [924.0, 597.0], [930.0, 597.0], [936.0, 597.0], [942.0, 596.0], [948.0, 596.0], [954.0, 599.0], [960.0, 605.0], [966.0, 605.0], [972.0, 605.5], [978.0, 605.5], [984.0, 606.0], [990.0, 606.0], [996.0, 603.0], [1002.0, 571.0], [1008.0, 567.5], [1014.0, 567.5], [1020.0, 567.5], [1026.0, 567.5], [1032.0, 484.0]]; const N = pts.length - 1;
const d = 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' L'), e = pts[N];
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&display=block');
*{margin:0;padding:0}body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#111;color:#fff;font-family:'Bricolage Grotesque';font-variation-settings:'opsz' 96}
</style></head><body>
<div style="position:absolute;inset:0;background:url(${P}) 0 -45px/1080px auto no-repeat"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,14,17,.7) 0%,rgba(11,14,17,.3) 24%,rgba(11,14,17,0) 36%)"></div>
<svg style="position:absolute;inset:0" width="1080" height="1350"><defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter></defs>
<path d="${d}" fill="none" stroke="${LIME}" stroke-width="13" opacity=".55" filter="url(#gl)"/><path d="${d}" fill="none" stroke="${LIME}" stroke-width="5" stroke-linejoin="round"/>
<circle cx="${e[0]}" cy="${e[1]}" r="12" fill="${LIME}"/><circle cx="${e[0]}" cy="${e[1]}" r="28" fill="none" stroke="${LIME}" stroke-width="3" opacity=".7"/></svg>
<div style="position:absolute;left:64px;top:64px">
  <div style="font-size:230px;font-weight:800;letter-spacing:-4px;line-height:.85;font-variation-settings:'opsz' 96,'wdth' 80">GM.</div>
  <div style="font-size:42px;font-weight:600;line-height:1.15;margin-top:18px">Segunda em Porto Alegre.<br>O horizonte já abriu em alta.</div>
</div>
<img src="${L}" style="position:absolute;right:56px;bottom:56px;height:34px">
</body></html>`;
const br = await chromium.launch(); const pg = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
await pg.setContent(html, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
fs.mkdirSync(`${DIR}/day-2026-11-23-br`, {recursive: true}); await pg.screenshot({path: `${DIR}/day-2026-11-23-br/gm-poa.png`}); await br.close(); console.log('ok');
