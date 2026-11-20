// "Ronaldinho · Legend Series": 9 career-milestone posters, 4:5 (1080x1350, rendered at 2x), English + Chinese.
// For Hotcoin private-domain channels (BD distribution). Request: Siri (brand), 2026-11-20.
// Facts checked against en.wikipedia.org/wiki/Ronaldinho (2026-11-20): Grêmio debut 1998; PSG 2001; 2002 World Cup (Brazil's
//   fifth title); Barcelona 2003; FIFA World Player of the Year 2004 and 2005; Ballon d'Or 2005; 2005/06 Champions League;
//   Copa Libertadores 2013 with Atlético Mineiro; "the only player in history to have won a FIFA World Cup, a Copa América,
//   a FIFA Confederations Cup, a UEFA Champions League, a Copa Libertadores and a Ballon d'Or".
// Photos: Unsplash (places and objects only, no club branding), graded by grade.py; credits in hotcoin-tradfi/FOOTAGE_CREDITS.md.
// Card 09 uses the real portrait from the official Hotcoin shoot. No club crests or third-party logos (house rule).
// Run: python3 social/r10-legend/grade.py && PW_PATH=$(npm root -g)/playwright node social/r10-legend/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH || 'playwright');
const DIR = '/home/user/sandbox/social/r10-legend';
const A = (f) => 'file://' + DIR + '/assets/' + f;
const LOGO = 'file:///home/user/sandbox/hotcoin-tradfi/public/brand/logo-official-white.png';
const GRAIN = 'file:///home/user/sandbox/hotcoin-tradfi/public/grain.png';
const W = 1080, H = 1350;
const LIME = '#B8F26A', INK = '#050806';

const CARDS = [
  {year: '1998', kicker: 'CAREER BEGINS · GRÊMIO', en: 'The Starting Point', zh: '传奇起点',
   bodyEN: 'In 1998, Ronaldinho made his professional debut for Grêmio in Porto Alegre, the first step on a legendary road.',
   bodyZH: '1998年，罗纳尔迪尼奥在巴西阿雷格里港的格雷米奥开启职业生涯，正式踏上世界足坛的传奇之路。', img: 'p01_g.jpg'},
  {year: '2001', kicker: 'TO EUROPE · PARIS SAINT-GERMAIN', en: 'Hello, Europe', zh: '登陆欧洲',
   bodyEN: 'In 2001 he joined Paris Saint-Germain and began his European career, introducing the world to a football genius from Brazil.',
   bodyZH: '2001年加盟巴黎圣日耳曼，开启欧洲征程，让世界认识了这位来自巴西的足球天才。', img: 'p02_g.jpg'},
  {year: '2002', kicker: 'FIFA WORLD CUP CHAMPION', en: 'World Champion', zh: '世界冠军',
   bodyEN: "He won the 2002 FIFA World Cup in Korea and Japan with Brazil, the country's fifth world title.",
   bodyZH: '随巴西队夺得2002年韩日世界杯冠军，助巴西第五次捧起世界杯。', img: 'p03_g.jpg'},
  {year: '2003', kicker: 'JOINS BARCELONA', en: 'A Barcelona Icon', zh: '巴萨传奇',
   bodyEN: "He joined Barcelona in 2003 and became one of the world's most iconic players with his dribbling, passing and creativity.",
   bodyZH: '2003年加盟巴塞罗那，凭借出色的盘带、传球与创造力，成为全球最具代表性的球星之一。', img: 'p04_g.jpg'},
  {year: '2004 · 2005', kicker: 'FIFA WORLD PLAYER OF THE YEAR', en: "The World's Best", zh: '世界最佳',
   bodyEN: "Named FIFA World Player of the Year two years in a row, one of football's highest individual honours.",
   bodyZH: '连续两年当选国际足联世界足球先生，跻身世界足坛巅峰。', img: 'p05_g.jpg'},
  {year: '2005', kicker: "BALLON D'OR", en: 'Golden Glory', zh: '金球荣耀',
   bodyEN: "In 2005 he won the Ballon d'Or, the peak of his individual career and a place among football's superstars.",
   bodyZH: '2005年荣获金球奖，迎来个人职业生涯的巅峰时刻，跻身世界超级巨星之列。', img: 'p06_g.jpg'},
  {year: '2006', kicker: 'UEFA CHAMPIONS LEAGUE CHAMPION', en: 'Top of Europe', zh: '欧洲之巅',
   bodyEN: "He helped Barcelona win the 2005/06 UEFA Champions League, the highest podium in European club football.",
   bodyZH: '助巴塞罗那夺得2005/06赛季欧冠冠军，登上欧洲俱乐部足球的最高领奖台。', img: 'p07_g.jpg'},
  {year: '2013', kicker: 'COPA LIBERTADORES CHAMPION', en: 'Glory on Two Continents', zh: '双洲荣耀',
   bodyEN: "In 2013 he won the Copa Libertadores with Atlético Mineiro, becoming the only player to win the World Cup, Copa América, Confederations Cup, Champions League, Libertadores and Ballon d'Or.",
   bodyZH: '2013年随米内罗竞技夺得南美解放者杯冠军，成为史上唯一集世界杯、美洲杯、联合会杯、欧冠、解放者杯与金球奖于一身的球员。', img: 'p08_g.jpg'},
  {year: '2026', kicker: 'EMBAIXADOR DA HOTCOIN (BRASIL)', en: 'Hotcoin × Ronaldinho', zh: '传奇新篇章',
   bodyEN: 'Football legend Ronaldinho is now the official Hotcoin Ambassador in Brazil. From world champion to global icon, the legend continues.',
   bodyZH: '世界足坛传奇罗纳尔迪尼奥正式成为 Hotcoin 巴西品牌大使。从世界冠军到全球足球偶像，传奇仍在续写。', img: null},
];

const timeline = (i) => {
  const x0 = 80, x1 = W - 80, step = (x1 - x0) / 8;
  const dots = CARDS.map((c, k) => {
    const x = x0 + k * step;
    const cur = k === i, past = k < i;
    return cur
      ? `<div class="abs" style="left:${x - 13}px;top:-13px;width:26px;height:26px;border-radius:50%;background:${LIME};box-shadow:0 0 0 7px rgba(184,242,106,.22),0 0 30px rgba(184,242,106,.8)"></div>`
      : `<div class="abs" style="left:${x - 6}px;top:-6px;width:12px;height:12px;border-radius:50%;background:${past ? LIME : 'rgba(243,245,241,.28)'}"></div>`;
  }).join('');
  return `<div class="abs" style="left:0;right:0;top:${H - 92}px;height:0">
    <div class="abs" style="left:80px;right:80px;top:-1px;height:2px;background:rgba(243,245,241,.18)"></div>
    <div class="abs" style="left:80px;width:${i * step}px;top:-1px;height:2px;background:${LIME}"></div>${dots}</div>`;
};

const card = (c, i, lang) => {
  const zh = lang === 'zh';
  const last = i === 8;
  const yearSize = c.year.length > 4 ? 150 : 232;
  // his portrait (official shoot, cut out by cutouts.py) is the hero on every card; the place photo is dim atmosphere
  const cut = A(`cut_${String(i + 1).padStart(2, '0')}.png`);
  const bg = last
    ? `<div class="abs" style="inset:0;background:radial-gradient(70% 55% at 62% 32%, #1E5A36 0%, #0B2716 50%, ${INK} 85%)"></div>
       <div class="abs" style="left:70px;top:160px;width:236px;height:510px;border-radius:34px;background:#0B0E11;border:3px solid #2A3A30;box-shadow:0 30px 80px rgba(0,0,0,.7),0 0 40px rgba(184,242,106,.25);transform:rotate(-7deg);overflow:hidden">
         <img src="${A('app_chart.png')}" style="width:100%;height:100%;object-fit:cover;object-position:top"></div>`
    : `<img class="abs" src="${A(c.img)}" style="inset:-20px;width:${W + 40}px;height:${H + 40}px;object-fit:cover;filter:brightness(.5) blur(3px)">`;
  const hero = `${bg}
    <div class="abs" style="left:${last ? 250 : 170}px;top:40px;width:900px;height:900px;border-radius:50%;background:radial-gradient(closest-side, rgba(184,242,106,.28), rgba(184,242,106,0))"></div>
    <img class="abs" src="${cut}" style="left:${last ? 700 : 620}px;transform:translateX(-50%);top:120px;height:${i === 5 ? 940 : 880}px;max-width:${W - 60}px;object-fit:contain;object-position:center top;
      filter:drop-shadow(-6px 0 0 rgba(184,242,106,.35)) drop-shadow(0 0 40px rgba(184,242,106,.30));-webkit-mask-image:linear-gradient(180deg,#000 62%,transparent 94%)">`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;800;900&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+SC:wght@500;700;900&display=block');
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${W}px;height:${H}px;overflow:hidden;background:${INK}}
.abs{position:absolute}.sans{font-family:'Inter Tight','Noto Sans SC',sans-serif}.mono{font-family:'JetBrains Mono',monospace}.sc{font-family:'Noto Sans SC',sans-serif}
</style></head><body><div class="abs" style="inset:0;overflow:hidden">
  ${hero}
  <div class="abs" style="inset:0;background:linear-gradient(180deg, rgba(5,8,6,.75) 0%, rgba(5,8,6,0) 18%, rgba(5,8,6,0) 50%, rgba(5,8,6,.7) 64%, ${INK} 82%)"></div>
  <div class="abs" style="inset:28px;border:1px solid rgba(184,242,106,.22)"></div>
  ${['left:20px;top:20px;border-width:2px 0 0 2px', 'right:20px;top:20px;border-width:2px 2px 0 0', 'left:20px;bottom:20px;border-width:0 0 2px 2px', 'right:20px;bottom:20px;border-width:0 2px 2px 0'].map((s) => `<div class="abs" style="${s};width:26px;height:26px;border-style:solid;border-color:${LIME}"></div>`).join('')}
  <img class="abs" src="${LOGO}" style="left:72px;top:70px;height:38px">
  <div class="abs mono" style="right:72px;top:76px;font-size:22px;font-weight:700;letter-spacing:3px;color:${LIME}">LEGEND SERIES · ${String(i + 1).padStart(2, '0')} / 09</div>
  <div class="abs" style="left:72px;right:72px;bottom:150px">
    <div class="sans" style="font-size:${yearSize}px;font-weight:900;line-height:.9;letter-spacing:-${yearSize * 0.04}px;
      background:linear-gradient(180deg,#FFFFFF 0%,#F3F5F1 45%,${LIME} 100%);-webkit-background-clip:text;color:transparent;
      filter:drop-shadow(0 6px 30px rgba(0,0,0,.6))">${c.year}</div>
    <div style="display:flex;align-items:center;gap:18px;margin-top:22px">
      <div style="width:44px;height:3px;background:${LIME}"></div>
      <div class="mono" style="font-size:24px;font-weight:700;letter-spacing:4px;color:${LIME}">${c.kicker}</div>
    </div>
    ${zh
      ? `<div class="sc" style="font-size:78px;font-weight:900;color:#F3F5F1;line-height:1.1;margin-top:20px">${c.zh}</div>
         <div class="sans" style="font-size:30px;font-weight:600;color:rgba(243,245,241,.6);margin-top:6px">${c.en}</div>
         <div class="sc" style="font-size:31px;font-weight:500;color:rgba(243,245,241,.9);line-height:1.6;margin-top:22px;max-width:930px">${c.bodyZH}</div>`
      : `<div class="sans" style="font-size:${c.en.length > 18 ? 66 : 76}px;font-weight:800;color:#F3F5F1;line-height:1.05;letter-spacing:-1.5px;margin-top:20px">${c.en}</div>
         <div class="sans" style="font-size:31px;font-weight:500;color:rgba(243,245,241,.9);line-height:1.45;margin-top:22px;max-width:930px">${c.bodyEN}</div>`}
    ${last ? `<div class="sans" style="font-size:34px;font-weight:800;color:${LIME};margin-top:24px">Play Your Way. Make It Magic.</div>` : ''}
  </div>
  ${timeline(i)}
  <div class="abs" style="inset:0;background:url(${GRAIN});background-size:256px;opacity:.07;mix-blend-mode:screen"></div>
</div></body></html>`;
};

fs.mkdirSync(DIR + '/out', {recursive: true});
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: W, height: H}, deviceScaleFactor: 2});
for (const lang of ['en', 'zh']) {
  for (let i = 0; i < CARDS.length; i++) {
    const html = `${DIR}/out/_${lang}${i}.html`;
    fs.writeFileSync(html, card(CARDS[i], i, lang));
    await page.goto('file://' + html, {waitUntil: 'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    await page.screenshot({path: `${DIR}/out/${lang.toUpperCase()}-${String(i + 1).padStart(2, '0')}.png`});
  }
  console.log('rendered', lang);
}
await browser.close();
