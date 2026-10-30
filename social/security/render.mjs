// "Security notice" set for the X article, in the light Pulse/Uptober data style: a 5:2 cover (1500x600) and four
// 16:9 inline images (1600x900).
// Hotcoin facts (Hotcoin's own pages only): hotcoin.com ("9 Years of Trust, Rooted in Security", "intelligent risk
// control, and a zero-incident track record"; Account Security checklist: Google Verification, Anti-Phishing Code, Fund
// Password; Hotcoin Verify); June 2026 Proof of Reserves release (Newsfile, Aug 2026): ~US$137.4M reserves, BTC+ETH about
// half, stablecoins more than 42%, other ~8%, coverage above 100% for major assets and stablecoins, substantial majority in
// cold storage, cold-key access limited to authorized personnel, operating since 2017, 8M+ users, 120+ countries.
// Industry data: Chainalysis stolen funds, 2022 $3.8B, 2023 $1.7B, 2024 $2.2B, 2025 $3.4B (Jan to early Dec).
// Run: PW_PATH=$(npm root -g)/playwright node social/security/render.mjs <scratch-dir>
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const OUT = ROOT + '/social/security';
const SCR = process.argv[2];
const LOGO = 'file://' + ROOT + '/hotcoin-tradfi/public/brand/logo-official-black.png';

const base = (w, h) => `
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=block');
:root{--ink:#0B0E11;--muted:#8A9099;--body:#4A5058;--red:#E5484D;--green:#2F9E44;--lime:#B8F26A;--line:#E6E8EB}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${w}px;height:${h}px;background:#fff;color:var(--ink);font-family:'Inter Tight',sans-serif;overflow:hidden}
.s{position:relative;width:${w}px;height:${h}px;overflow:hidden}
.pill{font-family:'JetBrains Mono';font-weight:500;font-size:16px;letter-spacing:2px;border:1.5px solid var(--ink);border-radius:100px;padding:8px 18px;background:#fff;display:inline-flex;align-items:center;gap:10px}
.pill i{width:10px;height:10px;border-radius:50%;background:var(--red)}
.mono{font-family:'JetBrains Mono';font-size:14px;letter-spacing:2px;color:var(--muted)}
h1{font-weight:600;letter-spacing:-3.2px;line-height:.98}
h1 span{color:var(--muted)}
.src{position:absolute;font-family:'JetBrains Mono';font-size:13px;color:var(--muted);letter-spacing:.3px;line-height:1.5}
.hatch-l{background:repeating-linear-gradient(135deg,var(--lime) 0 12px,#D9F7B0 12px 24px)}
.hatch-r{background:repeating-linear-gradient(135deg,#F08A8D 0 12px,#FBD6D7 12px 24px)}
.ghost{position:absolute;font-weight:700;letter-spacing:-6px;line-height:1;white-space:nowrap;color:transparent;
  background-image:repeating-linear-gradient(90deg,rgba(11,14,17,.16) 0 3px,transparent 3px 7px);-webkit-background-clip:text;background-clip:text}
`;
const top = (page) => `
<div style="position:absolute;left:76px;right:76px;top:60px;display:flex;justify-content:space-between;align-items:center">
  <img src="${LOGO}" style="width:170px"><div class="pill"><i></i>SECURITY NOTICE · ${page}</div>
</div>`;
const check = `<svg width="26" height="26" viewBox="0 0 24 24"><rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="none" stroke="#0B0E11" stroke-width="2"/></svg>`;
const never = `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke="#E5484D" stroke-width="3" stroke-linecap="round"/></svg>`;

const HACKS = [['2022', 3.8], ['2023', 1.7], ['2024', 2.2], ['2025', 3.4]];

const pages = {
  // ---------- cover 5:2 ----------
  'cover-5x2': [1500, 600, `
<div style="position:absolute;left:76px;top:56px;display:flex;align-items:center;gap:22px"><img src="${LOGO}" style="width:170px"><div class="pill"><i></i>IMPORTANT · SECURITY NOTICE</div></div>
<h1 style="position:absolute;left:76px;top:150px;font-size:104px">Lock it down.<br><span>Your 5-minute<br>security check.</span></h1>
<div style="position:absolute;left:880px;top:150px;width:544px;display:flex;flex-direction:column">
${[['0', 'security incidents', 'since 2017 · per hotcoin.com', 'var(--green)'], ['>100%', 'reserve coverage', 'major assets · June 2026 PoR', 'var(--ink)'], ['5', 'settings to turn on', 'today · Account Security', 'var(--ink)']].map(([n, t, d, c], i) => `
  <div style="display:flex;align-items:baseline;gap:20px;padding:16px 0;border-top:${i ? '1.5px solid var(--line)' : '2px solid var(--ink)'}">
    <div style="width:230px;font-weight:600;font-size:66px;letter-spacing:-3px;line-height:.9;color:${c}">${n}</div>
    <div><div style="font-weight:600;font-size:24px">${t}</div><div class="mono" style="font-size:13px;letter-spacing:1px;margin-top:3px">${d}</div></div></div>`).join('')}
</div>`],

  // ---------- 1: our side ----------
  '01-our-side': [1600, 900, `${top('1/4')}
<h1 style="position:absolute;left:76px;top:150px;font-size:76px">How Hotcoin guards<br><span>your funds.</span></h1>
<div style="position:absolute;left:76px;top:390px;width:820px">
  <div class="mono">TOTAL RESERVES · JUNE 2026</div>
  <div style="font-weight:600;font-size:120px;letter-spacing:-6px;line-height:1;margin-top:8px">$137.4M</div>
  <div style="display:flex;height:46px;margin-top:22px;border:2px solid var(--ink);border-radius:12px;overflow:hidden">
    <div class="hatch-l" style="width:50%;border-right:2px solid var(--ink)"></div><div style="width:42%;background:#D9F7B0;border-right:2px solid var(--ink)"></div><div style="width:8%;background:#F1F3F5"></div>
  </div>
  <div style="display:flex;margin-top:12px;font-size:20px;font-weight:600">
    <div style="width:50%">BTC + ETH <span style="color:var(--muted);font-weight:500">~50%</span></div><div style="width:42%">Stablecoins <span style="color:var(--muted);font-weight:500">&gt;42%</span></div><div style="width:8%;white-space:nowrap">Other <span style="color:var(--muted);font-weight:500">~8%</span></div>
  </div>
  <div class="mono" style="margin-top:34px">RESERVE COVERAGE · MAJOR ASSETS &amp; STABLECOINS</div>
  <div style="position:relative;height:30px;margin-top:12px;border-radius:8px;background:#F1F3F5">
    <div class="hatch-l" style="position:absolute;left:0;top:0;bottom:0;width:86%;border:2px solid var(--ink);border-radius:8px"></div>
    <div style="position:absolute;left:78%;top:-8px;bottom:-8px;width:2px;background:var(--ink)"></div>
    <div class="mono" style="position:absolute;left:78%;top:38px;transform:translateX(-50%);white-space:nowrap;color:var(--ink)">100% = CUSTOMER BALANCES</div>
    <div style="position:absolute;left:calc(86% + 14px);top:-6px;font-weight:600;font-size:30px;letter-spacing:-1px;color:var(--green)">&gt;100%</div>
  </div>
</div>
<div style="position:absolute;left:1000px;right:76px;top:150px">
${[['2017', 'operating continuously since'], ['0', 'security incidents · 9 years'], ['8M+', 'users · 120+ countries'], ['Cold', 'storage holds the substantial majority'], ['Few', 'hands on cold-storage keys']].map(([n, t], i) => `
  <div style="display:flex;align-items:baseline;gap:18px;padding:18px 0;border-top:${i ? '1.5px solid var(--line)' : '2px solid var(--ink)'}">
    <div style="width:150px;font-weight:600;font-size:56px;letter-spacing:-2.5px;line-height:.9;color:${n === '0' ? 'var(--green)' : 'var(--ink)'}">${n}</div><div style="font-size:21px;color:var(--body);line-height:1.2">${t}</div></div>`).join('')}
</div>
<div class="src" style="left:76px;bottom:40px">Source: Hotcoin Proof of Reserves report, June 2026 (self-reported, announced Aug 2026; not a full audit of liabilities) · hotcoin.com</div>`],

  // ---------- 2: five settings ----------
  '02-five-settings': [1600, 900, `${top('2/4')}
<h1 style="position:absolute;left:76px;top:150px;font-size:76px">5 locks on your account.<br><span>Turn them on today.</span></h1>
<div style="position:absolute;left:76px;right:76px;top:370px">
  <div class="mono" style="display:flex;padding-bottom:12px;border-bottom:2px solid var(--ink)"><div style="width:90px">#</div><div style="width:560px">SETTING</div><div style="flex:1">WHAT IT BLOCKS</div><div style="width:60px;text-align:right">DONE</div></div>
${[['01', 'Google Verification (2FA)', 'Logins with a stolen password · SIM-swap codes'], ['02', 'Anti-Phishing Code', 'Fake “Hotcoin” emails'], ['03', 'Fund Password', 'Withdrawals from a hijacked session'], ['04', 'Unique password', 'Passwords leaked from other sites'], ['05', 'Hotcoin Verify', 'Fake links and fake support accounts']].map(([n, s, b]) => `
  <div style="display:flex;align-items:center;height:72px;border-bottom:1.5px solid var(--line)">
    <div style="width:90px;font-family:'JetBrains Mono';font-weight:700;font-size:22px;color:var(--muted)">${n}</div>
    <div style="width:560px;font-weight:600;font-size:32px;letter-spacing:-1px">${s}</div>
    <div style="flex:1;font-size:23px;color:var(--body)">${b}</div><div style="width:60px;display:flex;justify-content:flex-end">${check}</div></div>`).join('')}
</div>
<div style="position:absolute;left:76px;right:76px;bottom:44px;display:flex;align-items:center;gap:20px">
  <div class="mono" style="color:var(--ink)">YOUR PROTECTION</div>
  <div style="flex:1;display:flex;gap:8px">${[0, 1, 2, 3, 4].map(() => '<div class="hatch-l" style="flex:1;height:22px;border:2px solid var(--ink);border-radius:6px"></div>').join('')}</div>
  <div style="font-weight:600;font-size:30px;letter-spacing:-1px;color:var(--green)">5/5</div>
</div>`],

  // ---------- 3: hacks and scams ----------
  '03-scams-follow': [1600, 900, `${top('3/4')}
<h1 style="position:absolute;left:76px;top:150px;font-size:76px">Hacks make headlines.<br><span>Scams follow.</span></h1>
<div style="position:absolute;left:76px;top:370px;width:700px">
  <div class="mono">CRYPTO STOLEN IN HACKS, PER YEAR (USD)</div>
  <div style="position:relative;height:330px;margin-top:20px;display:flex;align-items:flex-end;gap:34px;border-bottom:2px solid var(--ink)">
  ${HACKS.map(([y, v]) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center">
      <div style="font-weight:600;font-size:34px;letter-spacing:-1.5px;color:var(--red);margin-bottom:10px">$${v}B</div>
      <div class="hatch-r" style="width:100%;height:${(v / 3.8) * 250}px;border:2px solid var(--ink);border-bottom:none;border-radius:10px 10px 0 0"></div></div>`).join('')}
  </div>
  <div style="display:flex;gap:34px;margin-top:10px">${HACKS.map(([y]) => `<div style="flex:1;text-align:center;font-family:'JetBrains Mono';font-weight:700;font-size:18px">${y}${y === '2025' ? '*' : ''}</div>`).join('')}</div>
</div>
<div style="position:absolute;left:880px;right:76px;top:370px">
  <div class="mono">3 MESSAGES THAT FOLLOW EVERY BIG HACK</div>
${[['“URGENT: move your funds to a safe wallet”', 'No real exchange asks this. The safe wallet is the scammer’s.'], ['“Hi, I’m from Hotcoin support”', 'Support never DMs you first.'], ['“Claim your compensation airdrop”', 'Connect wallet + sign = drained wallet.']].map(([q, a], i) => `
  <div style="padding:20px 0;border-top:${i ? '1.5px solid var(--line)' : '2px solid var(--ink)'};${i ? '' : 'margin-top:14px'}">
    <div style="font-family:'JetBrains Mono';font-weight:700;font-size:13px;letter-spacing:2px;color:var(--red)">RED FLAG 0${i + 1}</div>
    <div style="font-weight:600;font-size:27px;letter-spacing:-.8px;line-height:1.15;margin-top:6px">${q}</div>
    <div style="font-size:20px;color:var(--body);margin-top:6px">${a}</div></div>`).join('')}
</div>
<div class="src" style="left:76px;bottom:40px">Data: Chainalysis, funds stolen from crypto platforms. *2025: January to early December. Rule: stop, don’t click, check it on Hotcoin Verify.</div>`],

  // ---------- 4: never ask ----------
  '04-never-ask': [1600, 900, `${top('4/4')}
<h1 style="position:absolute;left:76px;top:150px;font-size:76px">Hotcoin will never<br><span>ask you for these.</span></h1>
<div style="position:absolute;left:76px;width:900px;top:370px">
  <div class="mono" style="display:flex;padding-bottom:12px;border-bottom:2px solid var(--ink)"><div style="flex:1">REQUEST</div><div style="width:160px;text-align:right">HOTCOIN</div></div>
${['Your password', 'Your 2FA code', 'Your Fund Password', 'Your seed phrase or private keys', 'Remote access to your device', 'A “test” transfer to verify your account'].map((t) => `
  <div style="display:flex;align-items:center;height:62px;border-bottom:1.5px solid var(--line)">
    <div style="flex:1;font-weight:600;font-size:30px;letter-spacing:-.8px">${t}</div>
    <div style="width:160px;display:flex;justify-content:flex-end;align-items:center;gap:10px;font-family:'JetBrains Mono';font-weight:700;font-size:18px;letter-spacing:2px;color:var(--red)">${never}NEVER</div></div>`).join('')}
</div>
<div style="position:absolute;left:1060px;right:76px;top:370px;border-top:2px solid var(--ink);padding-top:22px">
  <div class="mono">IF SOMEONE ASKS</div>
  <div style="font-weight:600;font-size:100px;letter-spacing:-5px;line-height:.9;margin-top:14px;color:var(--red)">0%</div>
  <div style="font-size:24px;color:var(--body);line-height:1.3;margin-top:12px">chance it’s really us.</div>
  <div style="margin-top:34px;border-top:1.5px solid var(--line);padding-top:20px;font-size:22px;line-height:1.35"><b>Report it.</b><br>Check the account on<br><b style="background:var(--lime);padding:0 6px">Hotcoin Verify</b>.</div>
</div>
<div class="src" style="left:76px;bottom:40px">Hotcoin · Account Security · Official channels: Hotcoin Verify on hotcoin.com</div>`],
};

for (const f of fs.readdirSync(OUT)) if (f.endsWith('.png')) fs.unlinkSync(`${OUT}/${f}`);
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
