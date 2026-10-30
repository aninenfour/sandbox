// "Security notice" set for the X article: a 5:2 cover (1500x600) and four 16:9 inline images (1600x900).
// Hotcoin facts used (all from Hotcoin's own pages): homepage "9 Years of Trust, Rooted in Security", "intelligent risk
// control, and a zero-incident track record"; Account Security checklist (Google Verification, Anti-Phishing Code, Fund
// Password); Hotcoin Verify page; June 2026 Proof of Reserves release (coverage above 100% for major assets and
// stablecoins, substantial majority in cold storage, cold-key access restricted to a limited number of authorized staff).
// Run: PW_PATH=$(npm root -g)/playwright node social/security/render.mjs <scratch-dir>
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const OUT = ROOT + '/social/security';
const SCR = process.argv[2];
const LOGO = 'file://' + ROOT + '/hotcoin-tradfi/public/brand/logo-official-white.png';
const SYM = 'file://' + ROOT + '/hotcoin-tradfi/public/brand/symbol-official-white.png';

const base = (w, h) => `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800;900&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=block');
:root{--ink:#07090A;--lime:#B8F26A;--green:#7EC25A;--red:#F6465D;--muted:#8A938C;--body:#C9D0CB}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${w}px;height:${h}px;background:var(--ink);color:#F4F6F1;font-family:'Inter Tight',sans-serif;overflow:hidden}
.s{position:relative;width:${w}px;height:${h}px;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(184,242,106,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(184,242,106,.06) 1px,transparent 1px);background-size:48px 48px;
  mask-image:radial-gradient(80% 90% at 70% 50%,#000,transparent)}
.alert{display:inline-flex;align-items:center;gap:12px;font-family:'JetBrains Mono';font-weight:700;letter-spacing:4px;color:#fff;background:var(--red);border-radius:8px;padding:9px 16px 9px 12px;box-shadow:0 0 30px rgba(246,70,93,.45)}
.alert svg{flex:none}
.tape{position:absolute;left:0;right:0;height:22px;background:repeating-linear-gradient(-45deg,var(--lime) 0 18px,var(--ink) 18px 36px)}
.logo{position:absolute}
h1{font-family:Unbounded;font-weight:900;letter-spacing:-2px;line-height:.98}
h1 em{font-style:normal;color:var(--lime)}
.mono{font-family:'JetBrains Mono';font-weight:700;letter-spacing:3px;color:var(--muted)}
`;
const warn = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2 23 21H1Z" fill="#fff"/><rect x="11" y="8" width="2" height="7" rx="1" fill="#F6465D"/><circle cx="12" cy="17.6" r="1.2" fill="#F6465D"/></svg>`;
const shield = (w) => `<svg width="${w}" height="${w * 1.15}" viewBox="0 0 200 230" style="overflow:visible">
  <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B2616"/><stop offset="1" stop-color="#0C110A"/></linearGradient></defs>
  <path d="M100 6 186 38v70c0 58-38 100-86 116C52 208 14 166 14 108V38Z" fill="url(#sg)" stroke="#B8F26A" stroke-width="5" style="filter:drop-shadow(0 0 22px rgba(184,242,106,.55))"/>
  <path d="M100 26 168 52v56c0 46-30 80-68 94-38-14-68-48-68-94V52Z" fill="none" stroke="rgba(184,242,106,.35)" stroke-width="2" stroke-dasharray="6 6"/>
</svg>`;
const lock = (s, c = '#B8F26A') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="12" rx="3" fill="${c}"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="${c}" stroke-width="2.4"/><circle cx="12" cy="15.5" r="1.8" fill="#07090A"/><rect x="11.2" y="16" width="1.6" height="3.2" rx=".8" fill="#07090A"/></svg>`;
const head = (title, kicker = 'IMPORTANT · SECURITY NOTICE') => `
<div style="position:absolute;left:80px;right:80px;top:64px;display:flex;justify-content:space-between;align-items:center">
  <div class="alert" style="font-size:17px">${warn(22)}${kicker}</div><img src="${LOGO}" style="width:190px">
</div>
<h1 style="position:absolute;left:80px;right:80px;top:140px;font-size:66px">${title}</h1>`;

const pages = {
  // ---------- cover 5:2 ----------
  'cover-5x2': [1500, 600, `
<div class="grid"></div>
<div style="position:absolute;inset:0;background:radial-gradient(40% 70% at 78% 50%,rgba(184,242,106,.20),transparent 70%)"></div>
<div class="tape" style="top:0"></div><div class="tape" style="bottom:0"></div>
<div style="position:absolute;left:80px;top:78px"><div class="alert" style="font-size:18px">${warn(24)}IMPORTANT · SECURITY NOTICE</div></div>
<h1 style="position:absolute;left:80px;top:150px;font-size:92px">Lock it<br><em>down.</em></h1>
<div style="position:absolute;left:84px;top:372px;font-size:30px;font-weight:600;color:var(--body);line-height:1.3">How Hotcoin guards your funds,<br>and the 5 settings that guard your account.</div>
<img src="${LOGO}" style="position:absolute;left:84px;bottom:58px;width:190px">
<div style="position:absolute;left:960px;top:70px">${shield(330)}
  <img src="${SYM}" style="position:absolute;left:105px;top:110px;width:120px;filter:drop-shadow(0 0 16px rgba(184,242,106,.6))">
  <div style="position:absolute;left:216px;top:236px;width:92px;height:92px;border-radius:24px;background:#0C110A;border:3px solid var(--lime);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(0,0,0,.6)">${lock(56)}</div>
</div>`],

  // ---------- 1: the five basics ----------
  '01-five-basics': [1600, 900, `
<div class="grid"></div>${head('Do these <em>5 things</em> today.')}
<div style="position:absolute;left:80px;right:80px;top:262px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
${[
    ['01', 'Turn on Google Verification', 'An authenticator app beats SMS codes.'],
    ['02', 'Set your Anti-Phishing Code', 'Real Hotcoin emails show it. No code, no click.'],
    ['03', 'Add a Fund Password', 'A second lock on every withdrawal.'],
    ['04', 'Use a unique password', 'Never reused from any other site or app.'],
    ['05', 'Verify before you trust', 'Check links and accounts on Hotcoin Verify.'],
  ].map(([n, t, d], i) => `<div style="display:flex;gap:22px;align-items:center;border-radius:20px;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.10);padding:36px 30px;${i === 4 ? 'grid-column:1 / span 2;border-color:rgba(184,242,106,.5);background:rgba(184,242,106,.07)' : ''}">
    <div style="font-family:Unbounded;font-weight:900;font-size:44px;color:var(--lime);width:76px">${n}</div>
    <div><div style="font-size:31px;font-weight:700">${t}</div><div style="font-size:23px;color:var(--body);margin-top:4px">${d}</div></div></div>`).join('')}
</div>
<div class="mono" style="position:absolute;left:80px;bottom:52px;font-size:17px">ALL FIVE LIVE IN ONE PLACE: ACCOUNT SECURITY</div>
<div class="tape" style="bottom:0;height:14px"></div>`],

  // ---------- 2: red flags ----------
  '02-red-flags': [1600, 900, `
<div class="grid"></div>${head('After a hack, <em>scammers</em> move in.')}
<div style="position:absolute;left:80px;right:80px;top:270px;display:flex;gap:18px">
${[
    ['“URGENT: move your funds to a safe wallet”', 'No real exchange will ever ask you to move your crypto to “protect” it.'],
    ['“Hi, I’m from Hotcoin support”', 'A DM you didn’t ask for is not support. We never DM you first.'],
    ['“Claim your compensation airdrop”', 'Free money + connect wallet = drained wallet.'],
  ].map(([q, a]) => `<div style="flex:1;border-radius:22px;border:2px solid rgba(246,70,93,.55);background:linear-gradient(180deg,rgba(246,70,93,.12),rgba(246,70,93,.03));padding:34px 32px 38px;position:relative">
    <div style="display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:3px;color:var(--red)">${warn(18).replace('#fff', '#F6465D').replace(/#F6465D"\/><circle/, '#07090A"/><circle').replace('fill="#F6465D"/></svg>', 'fill="#07090A"/></svg>')}RED FLAG</div>
    <div style="font-family:Unbounded;font-weight:800;font-size:31px;line-height:1.15;margin-top:18px;min-height:112px">${q}</div>
    <div style="font-size:26px;color:var(--body);line-height:1.35;margin-top:18px">${a}</div></div>`).join('')}
</div>
<div style="position:absolute;left:80px;right:80px;top:760px;display:flex;align-items:center;gap:18px;font-size:32px;font-weight:700">
  <span style="background:var(--lime);color:var(--ink);font-family:Unbounded;font-weight:900;font-size:22px;border-radius:10px;padding:10px 16px">STOP</span><span>Don’t click. Don’t reply. Check it on <span style="color:var(--lime)">Hotcoin Verify</span>.</span>
</div>`],

  // ---------- 3: what guards your funds ----------
  '03-our-side': [1600, 900, `
<div class="grid"></div>${head('How we guard <em>your funds.</em>', 'SECURITY · OUR SIDE')}
<div style="position:absolute;left:80px;right:80px;top:262px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
${[
    ['❄', 'Cold storage first', 'The substantial majority of reserves is held offline. Hot wallets carry only what daily withdrawals need.'],
    ['🔑', 'Keys in few hands', 'Access to cold-storage keys is restricted to a limited number of authorized personnel.'],
    ['📊', 'Proof of Reserves', 'Published on a recurring basis. June 2026: coverage above 100% for major assets and stablecoins.'],
    ['🛡', 'Intelligent risk control', 'Built up over 9 years of operation since 2017. A zero-incident track record.'],
  ].map(([i, t, d]) => `<div style="border-radius:20px;background:rgba(184,242,106,.05);border:1.5px solid rgba(184,242,106,.28);padding:38px 32px;display:flex;gap:24px">
    <div style="flex:none;width:64px;height:64px;border-radius:16px;background:#0C110A;border:2px solid var(--lime);display:flex;align-items:center;justify-content:center;font-size:30px;font-family:'Noto Color Emoji',sans-serif">${i}</div>
    <div><div style="font-size:31px;font-weight:700">${t}</div><div style="font-size:25px;color:var(--body);line-height:1.38;margin-top:8px">${d}</div></div></div>`).join('')}
</div>
<div class="mono" style="position:absolute;left:80px;bottom:52px;font-size:15px;letter-spacing:1.5px;line-height:1.6">SOURCES: HOTCOIN.COM · HOTCOIN PROOF OF RESERVES REPORT, JUNE 2026 (PUBLISHED AUG 2026)</div>
<div class="tape" style="bottom:0;height:14px"></div>`],

  // ---------- 4: we will never ask ----------
  '04-never-ask': [1600, 900, `
<div class="grid"></div>${head('Hotcoin will <em>never</em> ask you for:')}
<div style="position:absolute;left:80px;right:80px;top:282px;display:flex;flex-wrap:wrap;gap:22px">
${['Your password', 'Your 2FA code', 'Your Fund Password', 'Your seed phrase or private keys', 'Remote access to your device', 'A “test” transfer to verify your account'].map((t) =>
    `<div style="display:flex;align-items:center;gap:16px;border-radius:999px;border:2px solid rgba(246,70,93,.55);background:rgba(246,70,93,.07);padding:24px 36px 24px 26px;font-size:38px;font-weight:700">
      <svg width="34" height="34" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#F6465D"/><path d="M7.5 7.5l9 9M16.5 7.5l-9 9" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>${t}</div>`).join('')}
</div>
<div style="position:absolute;left:80px;right:80px;bottom:60px;border-radius:22px;background:var(--lime);color:var(--ink);padding:26px 34px;display:flex;align-items:center;gap:22px">
  ${lock(52, '#07090A')}<div style="font-family:Unbounded;font-weight:800;font-size:31px;line-height:1.15">If someone asks, it isn’t us.<br><span style="font-family:'Inter Tight';font-weight:700;font-size:25px">Report it and check the account on Hotcoin Verify.</span></div>
</div>`],
};

const browser = await chromium.launch();
for (const [name, [w, h, body]] of Object.entries(pages)) {
  const page = await browser.newPage({viewport: {width: w, height: h}, deviceScaleFactor: 2});
  const f = `${SCR}/sec-${name}.html`;
  fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><style>${base(w, h)}</style></head><body><div class="s">${body}</div></body></html>`);
  await page.goto('file://' + f, {waitUntil: 'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({path: `${OUT}/${name}.png`});
  await page.close();
  console.log('ok', name);
}
await browser.close();
