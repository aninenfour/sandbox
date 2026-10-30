// "Security notice" set for the X article, in the light Pulse/Uptober data style: a 5:2 cover (1500x600) and four
// 16:9 inline images (1600x900).
// Hotcoin facts (Hotcoin's own pages only): hotcoin.com ("9 Years of Trust, Rooted in Security", "intelligent risk
// control, and a zero-incident track record"; Account Security checklist: Google Verification, Anti-Phishing Code, Fund
// Password; Hotcoin Verify); June 2026 Proof of Reserves release (Newsfile, Aug 2026): ~US$137.4M reserves, BTC+ETH about
// half, stablecoins more than 42%, other ~8%, coverage above 100% for major assets and stablecoins, substantial majority in
// cold storage, cold-key access limited to authorized personnel, operating since 2017, 8M+ users, 120+ countries.
// Industry data: Chainalysis stolen funds, 2022 $3.8B, 2023 $1.7B, 2024 $2.2B, 2025 $3.4B (Jan to early Dec).
// Simplified Chinese version. Terms follow hotcoin.com/zh_CN: 账户安全, 谷歌双重认证, 防钓鱼码, 资金密码, 官方验证 (Hotcoin Verify), 储备金证明.
// Run: PW_PATH=$(npm root -g)/playwright node social/security/render-zh.mjs <scratch-dir>
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox';
const OUT = ROOT + '/social/security/zh';
const SCR = process.argv[2];
const LOGO = 'file://' + ROOT + '/hotcoin-tradfi/public/brand/logo-official-black.png';

const base = (w, h) => `
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+SC:wght@500;700;900&display=block');
:root{--ink:#0B0E11;--muted:#8A9099;--body:#4A5058;--red:#E5484D;--green:#2F9E44;--lime:#B8F26A;--line:#E6E8EB}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${w}px;height:${h}px;background:#fff;color:var(--ink);font-family:'Inter Tight','Noto Sans SC',sans-serif;overflow:hidden}
.s{position:relative;width:${w}px;height:${h}px;overflow:hidden}
.pill{font-family:'JetBrains Mono','Noto Sans SC';font-weight:500;font-size:16px;letter-spacing:2px;border:1.5px solid var(--ink);border-radius:100px;padding:8px 18px;background:#fff;display:inline-flex;align-items:center;gap:10px}
.pill i{width:10px;height:10px;border-radius:50%;background:var(--red)}
.mono{font-family:'JetBrains Mono','Noto Sans SC';font-size:14px;letter-spacing:2px;color:var(--muted)}
h1{font-weight:700;letter-spacing:-1px;line-height:1.12}
h1 span{color:var(--muted)}
.src{position:absolute;font-family:'JetBrains Mono','Noto Sans SC';font-size:13px;color:var(--muted);letter-spacing:.3px;line-height:1.5}
.hatch-l{background:repeating-linear-gradient(135deg,var(--lime) 0 12px,#D9F7B0 12px 24px)}
.hatch-r{background:repeating-linear-gradient(135deg,#F08A8D 0 12px,#FBD6D7 12px 24px)}
.ghost{position:absolute;font-weight:700;letter-spacing:-6px;line-height:1;white-space:nowrap;color:transparent;
  background-image:repeating-linear-gradient(90deg,rgba(11,14,17,.16) 0 3px,transparent 3px 7px);-webkit-background-clip:text;background-clip:text}
`;
const top = (page) => `
<div style="position:absolute;left:76px;right:76px;top:60px;display:flex;justify-content:space-between;align-items:center">
  <img src="${LOGO}" style="width:170px"><div class="pill"><i></i>安全公告 · ${page}</div>
</div>`;
const check = `<svg width="26" height="26" viewBox="0 0 24 24"><rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="none" stroke="#0B0E11" stroke-width="2"/></svg>`;
const never = `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke="#E5484D" stroke-width="3" stroke-linecap="round"/></svg>`;

const HACKS = [['2022', 3.8], ['2023', 1.7], ['2024', 2.2], ['2025', 3.4]];

const pages = {
  // ---------- cover 5:2 ----------
  'cover-5x2': [1500, 600, `
<div style="position:absolute;left:76px;top:56px;display:flex;align-items:center;gap:22px"><img src="${LOGO}" style="width:170px"><div class="pill"><i></i>重要 · 安全公告</div></div>
<h1 style="position:absolute;left:76px;top:170px;font-size:96px">锁好你的账户。<br><span>5 分钟安全自查。</span></h1>
<div style="position:absolute;left:880px;top:150px;width:544px;display:flex;flex-direction:column">
${[['0', '起安全事故', '2017 年至今 · 据 hotcoin.com', 'var(--green)'], ['>100%', '储备金覆盖率', '主要资产 · 2026 年 6 月储备金证明', 'var(--ink)'], ['5', '项安全设置', '今天开启 · 账户安全', 'var(--ink)']].map(([n, t, d, c], i) => `
  <div style="display:flex;align-items:baseline;gap:20px;padding:16px 0;border-top:${i ? '1.5px solid var(--line)' : '2px solid var(--ink)'}">
    <div style="width:200px;font-weight:600;font-size:66px;letter-spacing:-3px;line-height:.9;color:${c}">${n}</div>
    <div><div style="font-weight:600;font-size:24px">${t}</div><div class="mono" style="font-size:13px;letter-spacing:1px;margin-top:3px">${d}</div></div></div>`).join('')}
</div>`],

  // ---------- 1: our side ----------
  '01-our-side': [1600, 900, `${top('1/4')}
<h1 style="position:absolute;left:76px;top:150px;font-size:76px">Hotcoin 如何<br><span>守护你的资产。</span></h1>
<div style="position:absolute;left:76px;top:390px;width:820px">
  <div class="mono">储备金总额 · 2026 年 6 月</div>
  <div style="font-weight:600;font-size:120px;letter-spacing:-6px;line-height:1;margin-top:8px">$137.4M</div>
  <div style="display:flex;height:46px;margin-top:22px;border:2px solid var(--ink);border-radius:12px;overflow:hidden">
    <div class="hatch-l" style="width:50%;border-right:2px solid var(--ink)"></div><div style="width:42%;background:#D9F7B0;border-right:2px solid var(--ink)"></div><div style="width:8%;background:#F1F3F5"></div>
  </div>
  <div style="display:flex;margin-top:12px;font-size:20px;font-weight:600">
    <div style="width:50%">BTC + ETH <span style="color:var(--muted);font-weight:500">~50%</span></div><div style="width:42%">稳定币 <span style="color:var(--muted);font-weight:500">&gt;42%</span></div><div style="width:8%;white-space:nowrap">其他 <span style="color:var(--muted);font-weight:500">~8%</span></div>
  </div>
  <div class="mono" style="margin-top:34px">储备金覆盖率 · 主要资产及稳定币</div>
  <div style="position:relative;height:30px;margin-top:12px;border-radius:8px;background:#F1F3F5">
    <div class="hatch-l" style="position:absolute;left:0;top:0;bottom:0;width:86%;border:2px solid var(--ink);border-radius:8px"></div>
    <div style="position:absolute;left:78%;top:-8px;bottom:-8px;width:2px;background:var(--ink)"></div>
    <div class="mono" style="position:absolute;left:78%;top:38px;transform:translateX(-50%);white-space:nowrap;color:var(--ink)">100% = 用户资产</div>
    <div style="position:absolute;left:calc(86% + 14px);top:-6px;font-weight:600;font-size:30px;letter-spacing:-1px;color:var(--green)">&gt;100%</div>
  </div>
</div>
<div style="position:absolute;left:1000px;right:76px;top:150px">
${[['2017', '年起持续运营'], ['0', '起安全事故 · 9 年'], ['8M+', '用户 · 120+ 国家和地区'], ['冷钱包', '存放绝大部分储备金'], ['少数', '授权人员掌握冷钱包密钥']].map(([n, t], i) => `
  <div style="display:flex;align-items:baseline;gap:18px;padding:18px 0;border-top:${i ? '1.5px solid var(--line)' : '2px solid var(--ink)'}">
    <div style="width:170px;flex:none;font-weight:${/[\u4e00-\u9fff]/.test(n) ? 700 : 600};font-size:${/[\u4e00-\u9fff]/.test(n) ? 44 : 56}px;letter-spacing:${/[\u4e00-\u9fff]/.test(n) ? 0 : -2.5}px;line-height:.9;color:${n === '0' ? 'var(--green)' : 'var(--ink)'}">${n}</div><div style="font-size:21px;color:var(--body);line-height:1.2">${t}</div></div>`).join('')}
</div>
<div class="src" style="left:76px;bottom:40px">来源：Hotcoin 2026 年 6 月储备金证明报告（自行披露，2026 年 8 月发布；非完整负债审计）· hotcoin.com</div>`],

  // ---------- 2: five settings ----------
  '02-five-settings': [1600, 900, `${top('2/4')}
<h1 style="position:absolute;left:76px;top:150px;font-size:76px">账户的 5 把锁。<br><span>今天就全部开启。</span></h1>
<div style="position:absolute;left:76px;right:76px;top:370px">
  <div class="mono" style="display:flex;padding-bottom:12px;border-bottom:2px solid var(--ink)"><div style="width:90px">#</div><div style="width:560px">设置</div><div style="flex:1">可防范</div><div style="width:60px;text-align:right">完成</div></div>
${[['01', '谷歌双重认证 (2FA)', '盗用密码登录 · SIM 卡劫持验证码'], ['02', '防钓鱼码', '冒充 Hotcoin 的假邮件'], ['03', '资金密码', '账户被劫持后的提币'], ['04', '独立密码', '其他网站泄露的密码'], ['05', '官方验证', '假链接和假客服账号']].map(([n, s, b]) => `
  <div style="display:flex;align-items:center;height:72px;border-bottom:1.5px solid var(--line)">
    <div style="width:90px;font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:22px;color:var(--muted)">${n}</div>
    <div style="width:560px;font-weight:600;font-size:32px;letter-spacing:-1px">${s}</div>
    <div style="flex:1;font-size:23px;color:var(--body)">${b}</div><div style="width:60px;display:flex;justify-content:flex-end">${check}</div></div>`).join('')}
</div>
<div style="position:absolute;left:76px;right:76px;bottom:44px;display:flex;align-items:center;gap:20px">
  <div class="mono" style="color:var(--ink)">你的防护</div>
  <div style="flex:1;display:flex;gap:8px">${[0, 1, 2, 3, 4].map(() => '<div class="hatch-l" style="flex:1;height:22px;border:2px solid var(--ink);border-radius:6px"></div>').join('')}</div>
  <div style="font-weight:600;font-size:30px;letter-spacing:-1px;color:var(--green)">5/5</div>
</div>`],

  // ---------- 3: hacks and scams ----------
  '03-scams-follow': [1600, 900, `${top('3/4')}
<h1 style="position:absolute;left:76px;top:136px;font-size:64px">识破骗局。<br><span>大型黑客事件后必现的 3 类消息。</span></h1>
${(() => {
  const C = 'position:absolute;top:0;width:456px';
  const card = 'position:relative;border-radius:20px;background:#fff;border:2px solid var(--ink);box-shadow:0 18px 40px rgba(11,14,17,.10);overflow:hidden;height:280px';
  const tag = (t) => `<div style="font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:14px;letter-spacing:2px;color:var(--muted);margin-bottom:12px">${t}</div>`;
  const n = (i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:13px;background:#FFD84D;border:2px solid var(--ink);font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:14px;color:var(--ink);vertical-align:middle;margin-left:6px;box-shadow:2px 2px 0 var(--ink)">${i}</span>`;
  const hl = (t) => `<span style="background:#FFF1B8;border-bottom:2px solid #F2C200">${t}</span>`;
  const calls = (items) => `<div style="display:flex;flex-direction:column;gap:10px;margin-top:18px">${items.map(([i, e, t, d], k) => `
    <div style="display:flex;align-items:center;gap:12px;background:#FFD84D;border:2px solid var(--ink);border-radius:12px;padding:8px 14px;box-shadow:4px 4px 0 var(--ink);transform:rotate(${k % 2 ? 0.8 : -0.8}deg)">
      <span style="display:inline-flex;align-items:center;justify-content:center;flex:none;width:28px;height:28px;border-radius:14px;background:#fff;border:2px solid var(--ink);font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:15px">${i}</span><span style="font-size:22px">${e}</span>
      <div style="font-weight:700;font-size:20px;letter-spacing:-.3px">${t}<span style="font-weight:500;color:#5B4A00"> · ${d}</span></div></div>`).join('')}</div>`;
  const btn = (t, bg) => `<div style="display:inline-block;margin-top:12px;background:${bg};color:#fff;font-weight:700;font-size:17px;border-radius:10px;padding:9px 16px">${t}</div>`;
  return `<div style="position:absolute;left:76px;right:76px;top:318px">
  <div style="${C};left:0">${tag('📧 邮件')}
    <div style="${card}">
      <div style="padding:14px 18px;border-bottom:1.5px solid var(--line);font-size:16px;line-height:1.7">
        <div><b>发件人：</b>Hotcoin 安全中心 &lt;${hl('alert@hotc0in-safe.co')}&gt;${n(1)}</div>
        <div><b>主题：</b>${hl('紧急：请在 24 小时内转移资金')}${n(2)}</div>
        <div style="color:var(--muted)">防钓鱼码：<b style="color:var(--red)">无</b>${n(3)}</div></div>
      <div style="padding:14px 18px;font-size:17px;line-height:1.4;color:var(--body)">因安全事件，您的资产面临风险。请立即将全部资产转入“安全钱包”。<br>${btn('立即保护资产 →', '#2F9E44')}</div>
    </div>
    ${calls([['1', '⚠️', '仿冒域名', 'hotc0in ≠ hotcoin'], ['2', '⏰', '制造紧迫感', '恐慌就是套路'], ['3', '🚫', '没有防钓鱼码', '一定是假的']])}
  </div>
  <div style="${C};left:496px">${tag('💬 私信')}
    <div style="${card};background:#F6F7F9">
      <div style="display:flex;align-items:center;gap:12px;padding:12px 18px;background:#fff;border-bottom:1.5px solid var(--line)">
        <div style="width:40px;height:40px;border-radius:20px;background:var(--ink);color:var(--lime);display:flex;align-items:center;justify-content:center;font-weight:700">H</div>
        <div><div style="font-weight:700;font-size:18px">Hotcoin 客服 ✔︎${n(1)}</div><div style="font-size:14px;color:var(--muted)">@hotcoin_help_desk · 主动私信你</div></div></div>
      <div style="padding:14px 18px">
        <div style="background:#fff;border:1.5px solid var(--line);border-radius:16px 16px 16px 4px;padding:12px 14px;font-size:17px;line-height:1.45;width:350px">你好！我们发现你的账户有异常活动 😟 为了保护账户，请${hl('把你的 2FA 验证码发给我')}${n(2)} 🙏</div>
        <div style="margin:10px 0 0 auto;background:#DCE9FF;border-radius:16px 16px 4px 16px;padding:9px 14px;font-size:17px;width:fit-content">好的，稍等…</div>
      </div>
    </div>
    ${calls([['1', '🚩', '客服绝不主动私信', '有认证标也一样'], ['2', '🔑', '绝不透露 2FA 验证码', '对我们也不行']])}
  </div>
  <div style="${C};left:992px">${tag('📣 社交帖子')}
    <div style="${card}">
      <div style="display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1.5px solid var(--line)">
        <div style="width:40px;height:40px;border-radius:20px;background:#F1F3F5;display:flex;align-items:center;justify-content:center;font-size:20px">🎁</div>
        <div><div style="font-weight:700;font-size:18px">Hotcoin 福利官</div><div style="font-size:14px;color:var(--muted)">@hotcoin_airdrops · 2 分钟前</div></div></div>
      <div style="padding:14px 18px;font-size:17px;line-height:1.5;color:var(--body)">受黑客事件影响？👇<br>${hl('立即领取 500 USDT 补偿')}${n(1)}<br><span style="color:#3B6FE0">claim-hotcoin-drop.xyz</span><br>${btn('连接钱包', '#3B6FE0')}${n(2)}</div>
    </div>
    ${calls([['1', '🎁', '好得不像真的', '白送的钱 = 诱饵'], ['2', '🔗', '连接 + 签名 = 被盗空', '千万别签']])}
  </div>
</div>`;
})()}
<div style="position:absolute;left:76px;right:76px;bottom:30px;display:flex;align-items:center;gap:14px;border-top:2px solid var(--ink);padding-top:14px">
  <div style="font-size:26px">✅</div><div style="font-weight:600;font-size:26px;letter-spacing:-.5px">先停下。不点击、不回复。到 <span style="background:var(--lime);padding:0 6px">官方验证</span> 核实。</div>
  <div class="mono" style="margin-left:auto;font-size:12px;letter-spacing:1px">示例仅作说明</div>
</div>`],
  // ---------- 4: never ask ----------
  '04-never-ask': [1600, 900, `${top('4/4')}
<h1 style="position:absolute;left:76px;top:150px;font-size:76px">Hotcoin 绝不会<br><span>向你索要这些。</span></h1>
<div style="position:absolute;left:76px;width:900px;top:370px">
  <div class="mono" style="display:flex;padding-bottom:12px;border-bottom:2px solid var(--ink)"><div style="flex:1">索要内容</div><div style="width:160px;text-align:right">HOTCOIN</div></div>
${['你的登录密码', '你的 2FA 验证码', '你的资金密码', '你的助记词或私钥', '远程控制你的设备', '“测试”转账来验证账户'].map((t) => `
  <div style="display:flex;align-items:center;height:62px;border-bottom:1.5px solid var(--line)">
    <div style="flex:1;font-weight:600;font-size:30px;letter-spacing:-.8px">${t}</div>
    <div style="width:160px;display:flex;justify-content:flex-end;align-items:center;gap:10px;font-family:'JetBrains Mono','Noto Sans SC';font-weight:700;font-size:18px;letter-spacing:2px;color:var(--red)">${never}绝不</div></div>`).join('')}
</div>
<div style="position:absolute;left:1060px;right:76px;top:370px;border-top:2px solid var(--ink);padding-top:22px">
  <div class="mono">如果有人索要</div>
  <div style="font-weight:600;font-size:100px;letter-spacing:-5px;line-height:.9;margin-top:14px;color:var(--red)">0%</div>
  <div style="font-size:24px;color:var(--body);line-height:1.3;margin-top:12px">是我们的可能性。</div>
  <div style="margin-top:34px;border-top:1.5px solid var(--line);padding-top:20px;font-size:22px;line-height:1.35"><b>立即举报。</b><br>并到<b style="background:var(--lime);padding:0 6px">官方验证</b><br>核实对方账号。</div>
</div>
<div class="src" style="left:76px;bottom:40px">Hotcoin · 账户安全 · 官方渠道核实：hotcoin.com 官方验证</div>`],
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
