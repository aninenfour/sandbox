// Engage bot tutorial cards for the Hotcoin Discord (1080x1080, white).
// Run: PW_PATH=$(npm root -g)/playwright node tutorial.mjs <scratch-dir>
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const OUT = ROOT + '/social/discord/engage';
const SCR = process.argv[2];
const LOGO = 'file://' + ROOT + '/hotcoin-tradfi/public/brand/logo-official-black.png';
const DISCORD_PATH = 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z';
const dc = (s, c = '#5865F2') => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" style="flex:none"><path fill="${c}" d="${DISCORD_PATH}"/></svg>`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800;900&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=block');
:root{--ink:#0B0E11;--panel:#F4F5F2;--line:#E3E6E0;--lime:#B8F26A;--green:#2F9E44;--muted:#6B7280;--blurple:#5865F2;
 --d0:#1E1F22;--d1:#2B2D31;--d2:#313338;--d3:#383A40;--dt:#DBDEE1;--dm:#949BA4;--dl:#00A8FC}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1080px;background:#fff;color:var(--ink);font-family:'Inter Tight','Noto Color Emoji',sans-serif;overflow:hidden}
.s{position:relative;width:1080px;height:1080px;padding:60px 64px 48px;display:flex;flex-direction:column}
.bg1{position:absolute;inset:0;background:radial-gradient(70% 50% at 100% 0%,rgba(88,101,242,.16),rgba(88,101,242,0) 70%)}
.bg2{position:absolute;inset:0;background-image:linear-gradient(rgba(11,14,17,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(11,14,17,.045) 1px,transparent 1px);background-size:60px 60px}
.top,.foot,.body{position:relative}
.top{display:flex;justify-content:space-between;align-items:center}
.tag{font-family:'JetBrains Mono';font-weight:700;font-size:17px;letter-spacing:3px;color:#fff;background:var(--blurple);padding:8px 30px 8px 14px;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 100%,0 100%)}
.logo{width:180px}
.body{flex:1;display:flex;flex-direction:column}
.foot{display:flex;justify-content:space-between;align-items:center;font-family:'JetBrains Mono';font-size:16px;color:var(--muted);letter-spacing:1px}
.foot b{color:var(--ink);font-weight:500}
h1{font-family:Unbounded;font-weight:900;letter-spacing:-1px;line-height:1.02;font-size:68px;margin-top:40px}
.hl{background:linear-gradient(transparent 58%,var(--lime) 58%,var(--lime) 92%,transparent 92%);padding:0 6px;margin:0 -6px}
.wg{display:grid;grid-template-columns:auto 1fr;column-gap:22px;row-gap:14px;margin-top:16px;font-size:21px;align-items:center}
.wg>div:nth-child(even){color:var(--muted);font-weight:500}
.wg>div:nth-child(odd){font-weight:600;display:flex;gap:8px;flex-wrap:wrap}
.lead{font-size:26px;color:var(--muted);font-weight:500;margin-top:14px;line-height:1.35}
.steps{display:flex;flex-direction:column;gap:14px;margin-top:30px}
.st{display:flex;align-items:center;gap:18px;font-size:26px;font-weight:600;line-height:1.3}
.n{flex:none;width:44px;height:44px;border-radius:50%;background:var(--ink);color:var(--lime);font-family:'JetBrains Mono';font-weight:700;font-size:22px;display:flex;align-items:center;justify-content:center}
.ch{display:inline-flex;align-items:center;gap:6px;background:#E8EAFE;color:#3B45C4;border-radius:7px;padding:1px 10px 2px;font-weight:700}
code,.cmd{font-family:'JetBrains Mono';font-weight:700;background:var(--panel);border:1px solid var(--line);border-radius:7px;padding:1px 9px;font-size:.9em}
/* discord mock */
.dw{margin-top:auto;margin-bottom:26px;background:var(--d2);border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(11,14,17,.22);color:var(--dt);font-family:'Inter Tight','Noto Color Emoji',sans-serif}
.dh{display:flex;align-items:center;gap:10px;padding:14px 22px;border-bottom:1px solid #26282C;font-weight:700;font-size:20px;color:#F2F3F5}
.dh .hs{color:var(--dm);font-size:24px;font-weight:500}
.dh .sub{color:var(--dm);font-weight:500;font-size:16px;margin-left:10px}
.msg{display:flex;gap:16px;padding:16px 22px}
.av{flex:none;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:22px}
.av.e{background:#1B2B5A}
.av.h{background:#0B0E11}
.nm{font-weight:700;font-size:19px;color:#F2F3F5;display:flex;align-items:center;gap:8px}
.app{font-size:12px;font-weight:700;background:var(--blurple);color:#fff;border-radius:4px;padding:1px 5px;letter-spacing:.5px}
.tm{color:var(--dm);font-size:14px;font-weight:500}
.tx{font-size:19px;margin-top:4px;line-height:1.4}
.eph{font-size:14px;color:var(--dm);margin-top:6px}
.eph u{color:var(--dl);text-decoration:none}
.inp{margin:6px 22px 20px;background:var(--d3);border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:12px;font-size:19px}
.inp .c{font-weight:700;color:#F2F3F5}
.inp .o{background:#4E5058;border-radius:6px;padding:2px 10px;color:#F2F3F5}
.inp .o span{color:var(--dm)}
.caret{width:2px;height:24px;background:#F2F3F5}
.hint{margin:0 22px;padding:8px 14px;background:var(--d1);border-radius:10px 10px 0 0;font-size:15px;color:var(--dm)}
.hint b{color:#F2F3F5}
.lbl{font-family:'JetBrains Mono';font-weight:700;font-size:14px;letter-spacing:1px;background:var(--lime);color:var(--ink);border-radius:7px;padding:5px 10px;white-space:nowrap}
.callout{position:absolute;font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:1px;background:var(--lime);color:var(--ink);border-radius:8px;padding:6px 10px;white-space:nowrap}
`;
const shell = (tag, page, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="s"><div class="bg1"></div><div class="bg2"></div>
<div class="top"><div class="tag">${tag}</div><img class="logo" src="${LOGO}"></div>
<div class="body">${body}</div>
<div class="foot"><span style="display:flex;align-items:center;gap:10px">${dc(22)}<b>Hotcoin Discord</b> · powered by Engage</span><span>${page}</span></div></div></body></html>`;
const chan = (name) => `<span class="ch">💠 | ${name}</span>`;

// ---------- 1. connect X ----------
const s1 = shell('ENGAGE GUIDE · STEP 1', '1 / 3', `
<h1>Connect<br>your <span class="hl">X account</span></h1>
<div class="lead">One time only. It links your X to Engage so your likes, reposts and replies count.</div>
<div class="steps">
 <div class="st"><span class="n">1</span><span>Open ${chan('engage-logs')}</span></div>
 <div class="st"><span class="n">2</span><span>Type <code>/set twitter</code> and enter your X username</span></div>
 <div class="st"><span class="n">3</span><span>Wait for <b>“Your Twitter is now connected!”</b></span></div>
</div>
<div class="dw" style="position:relative">
 <div class="dh"><span class="hs">#</span>💠 | engage-logs<span class="sub">Track all Engage activity and points</span></div>
 <div class="msg"><div class="av e">E</div><div>
  <div class="nm">The Engage <span class="app">APP</span><span class="tm">Today at 14:02</span></div>
  <div class="tx">✅ Your Twitter is now connected!</div>
  <div class="eph">👁 Only you can see this · <u>Dismiss message</u></div>
 </div></div>
 <div class="hint"><b>account</b> · Your Twitter account username</div>
 <div class="inp" style="margin-top:0;border-radius:0 0 10px 10px"><span class="c">/set twitter</span><span class="o"><span>account:</span> yourname</span><span class="caret"></span></div>
</div>
<div style="font-size:19px;color:var(--muted);margin-bottom:24px">First time on Engage? Authorize X once at <b style="color:var(--ink)">engages.io/profile</b> (Login with Discord → Connect Twitter).</div>
`);

// ---------- 2. earn points ----------
const btn = (icon, bg) => `<span style="display:inline-flex;align-items:center;gap:8px;background:${bg};border-radius:8px;padding:8px 14px;font-size:20px">${icon}<svg width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#DBDEE1" stroke-width="2.4" d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/></svg></span>`;
const s2 = shell('ENGAGE GUIDE · STEP 2', '2 / 3', `
<h1>Engage &amp; <span class="hl">earn points</span></h1>
<div class="lead">Every new Hotcoin post on X drops into ${chan('engage')} as a quest.</div>
<div class="steps">
 <div class="st"><span class="n">1</span><span>Open the latest quest in ${chan('engage')}</span></div>
 <div class="st"><span class="n">2</span><span>Use the buttons to <b>like, repost and reply</b> on X</span></div>
 <div class="st"><span class="n">3</span><span>Tap the <b style="color:#248046">green 📋 button</b> to collect your points</span></div>
</div>
<div class="dw" style="position:relative">
 <div class="dh"><span class="hs">#</span>💠 | engage<span class="sub">Share and interact with tweets</span></div>
 <div class="msg"><div class="av e">E</div><div style="flex:1">
  <div class="nm">The Engage <span class="app">APP</span><span class="tm">Today at 09:27</span></div>
  <div class="tx"><b>Hotcoin 🟩</b> just posted: <span style="color:var(--dl)">x.com/HotcoinGlobal/status/…</span></div>
  <div class="tx" style="font-weight:700">Engage to collect your points · <span style="font-weight:500;color:var(--dm)">Expires in a day</span></div>
  <div style="display:flex;gap:22px;margin-top:16px;align-items:flex-start">
   <div style="display:flex;flex-direction:column;align-items:center;gap:12px"><div style="display:flex;gap:10px">${btn('❤️','#4E5058')}${btn('🔁','#4E5058')}${btn('💬','#4E5058')}</div><span class="lbl">① LIKE · REPOST · REPLY</span></div>
   <div style="display:flex;flex-direction:column;align-items:center;gap:12px"><span style="display:inline-flex;align-items:center;background:#248046;border-radius:8px;padding:8px 22px;font-size:20px;outline:3px solid var(--lime);outline-offset:3px">📋</span><span class="lbl" style="background:#248046;color:#fff">② COLLECT</span></div>
  </div>
 </div></div>
 <div style="height:8px"></div>
</div>
<div style="font-size:19px;color:var(--muted);margin:14px 0 24px">Quests expire, so jump in early. Points only count from your connected X account.</div>
`);

// ---------- 3. check points ----------
const row = (c, d) => `<div style="display:flex;align-items:center;gap:18px;padding:28px 26px;border-top:1px solid #26282C"><span style="font-family:'JetBrains Mono';font-weight:700;font-size:26px;color:#F2F3F5;width:230px">${c}</span><span style="font-size:21px;color:var(--dm)">${d}</span></div>`;
const s3 = shell('ENGAGE GUIDE · STEP 3', '3 / 3', `
<h1>Track your <span class="hl">progress</span></h1>
<div class="lead">Type these anywhere the Engage bot works to see where you stand.</div>
<div class="dw" style="margin-top:40px">
 <div class="dh" style="font-size:16px;letter-spacing:1px;color:var(--dm)">COMMANDS MATCHING /</div>
 ${row('/rank','Your XP, level and points')}
 ${row('/profile','Your connected X, wallets and points')}
 ${row('/leaderboard','Top members on the server')}
 <div style="padding:16px 22px;border-top:1px solid #26282C;font-size:17px;color:var(--dm)">💡 Your X link is global: it works on every server that uses Engage.</div>
</div>
<div style="margin-top:auto;margin-bottom:26px;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:24px 26px">
  <div style="font-family:'JetBrains Mono';font-weight:700;font-size:15px;letter-spacing:2px;color:var(--green)">WHERE TO GO · ENGAGE ECOSYSTEM</div>
  <div class="wg">
   <div>${chan('engage-logs')}</div><div>Connect your X, see your activity</div>
   <div>${chan('engage')}</div><div>New quests from Hotcoin's X posts</div>
   <div>${chan('giveaway')} ${chan('arena')} ${chan('marketplace')}</div><div>Use your points</div>
  </div>
</div>
`);

const slides = [['01-connect-x', s1], ['02-earn-points', s2], ['03-track-progress', s3]];
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1080, height: 1080}});
for (const [name, html] of slides) {
  const f = `${SCR}/${name}.html`; fs.writeFileSync(f, html);
  await page.goto('file://' + f, {waitUntil: 'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({path: `${OUT}/${name}.png`});
  console.log('ok', name);
}
await browser.close();
