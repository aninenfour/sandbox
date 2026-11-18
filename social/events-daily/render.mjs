// Daily "ongoing events" carousel (2 slides, 4:5) + X and FB captions.
// Source: Hotcoin Announcement Center, Activities category
//   https://www.hotcoin.com/en_US/support/nav/2/?code=11675154291494913&id=11675178963439616
//   and each campaign page (https://www.hotcoin.com/en_US/announcement/<slug>/), "Campaign Period: A – B (UTC+8)".
// Picks campaigns running at run time, soonest end first. Slide copy comes from events.json (curated from the page);
// a campaign without an entry gets a basic slide and is flagged NEEDS REVIEW.
// Usage: PW_PATH=$(npm root -g)/playwright node social/events-daily/render.mjs [--skip=slug,slug] [--pick=slug,slug] [--now=2026-11-18T10:00]
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const ROOT = '/home/user/sandbox', DIR = `${ROOT}/social/events-daily`;
const args = process.argv.slice(2), opt = k => (args.find(a => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=');
const BASE = 'https://www.hotcoin.com';
const LIST = `${BASE}/en_US/support/nav/2/?code=11675154291494913&id=11675178963439616`;
const UA = {headers: {'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en'}};
const now = opt('now') ? new Date(opt('now') + '+08:00') : new Date();
const ent = s => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
const text = h => ent(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '\n')).split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);

const listHtml = await (await fetch(LIST, UA)).text();
const links = [...listHtml.matchAll(/<a[^>]+href="(\/en_US\/announcement\/([^"/]+)\/)"[^>]*>([\s\S]*?)<\/a>/g)]
  .map(m => ({path: m[1], slug: m[2], title: ent(m[3].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()}));
const seen = new Set(), events = [];
for (const l of links) {
  if (seen.has(l.slug)) continue; seen.add(l.slug);
  const L = text(await (await fetch(BASE + l.path, UA)).text());
  const i = L.findIndex(x => /Campaign Period/i.test(x));
  if (i < 0) continue;
  const m = L.slice(i, i + 3).join(' ').match(/(\d{4}-\d\d-\d\d \d\d:\d\d)\s*[–-]\s*(\d{4}-\d\d-\d\d \d\d:\d\d)\s*\(UTC\+8\)/);
  if (!m) continue;
  const start = new Date(m[1].replace(' ', 'T') + ':00+08:00'), end = new Date(m[2].replace(' ', 'T') + ':00+08:00');
  const intro = L.slice(Math.max(0, i - 8), i).join(' ');
  events.push({...l, url: BASE + l.path, start, end, intro});
}
const skip = (opt('skip') || '').split(',').filter(Boolean), pickList = (opt('pick') || '').split(',').filter(Boolean);
const live = events.filter(e => e.start <= now && e.end > now && !skip.includes(e.slug)).sort((a, b) => a.end - b.end);
const chosen = pickList.length ? pickList.map(s => events.find(e => e.slug === s)).filter(Boolean) : live.slice(0, 2);
console.log('Running now:'); live.forEach(e => console.log(`  ${e.end.toISOString().slice(0, 16)}Z  ${e.slug}`));
const DATA = JSON.parse(fs.readFileSync(`${DIR}/events.json`, 'utf8'));

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const u8 = d => new Date(+d + 8 * 3600e3); // shift to UTC+8 wall clock
const fmtEnd = d => `${MON[u8(d).getUTCMonth()]} ${u8(d).getUTCDate()}, ${String(u8(d).getUTCHours()).padStart(2, '0')}:${String(u8(d).getUTCMinutes()).padStart(2, '0')} (UTC+8)`;
const daysLeft = e => { const a = u8(now), b = u8(e.end); return Math.round((Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()) - Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate())) / 864e5); };
const status = e => { const n = daysLeft(e); return n <= 0 ? 'ENDS TODAY' : n === 1 ? 'ENDS TOMORROW' : n <= 3 ? `LAST ${n + 1} DAYS` : `${n} DAYS LEFT`; };
const asOf = `${MON[u8(now).getUTCMonth()]} ${u8(now).getUTCDate()}, ${u8(now).getUTCFullYear()}`;

const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A';
const b64 = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const WM = b64(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-white.png`);
const ICON = {
  candles: `<svg width="520" height="520" viewBox="0 0 520 520" fill="none" stroke="${LIME}" stroke-width="3">${[[60, 330, 70, 260], [130, 290, 60, 220], [200, 250, 80, 180], [270, 210, 50, 160], [340, 160, 70, 110], [410, 110, 60, 60]].map(([x, top, h, wick]) => `<line x1="${x + 18}" y1="${wick}" x2="${x + 18}" y2="${top + h + 40}" opacity=".5"/><rect x="${x}" y="${top}" width="36" height="${h}" fill="${LIME}" fill-opacity=".14"/>`).join('')}<polyline points="40,420 150,360 230,330 300,260 380,200 480,90" stroke-width="2" stroke-dasharray="6 8" opacity=".7"/></svg>`,
  shield: `<svg width="520" height="520" viewBox="0 0 520 520" fill="none" stroke="${LIME}" stroke-width="3"><path d="M260 60 L430 120 V260 C430 370 350 440 260 470 C170 440 90 370 90 260 V120 Z" fill="${LIME}" fill-opacity=".07"/><path d="M260 105 L392 152 V262 C392 348 330 404 260 428 C190 404 128 348 128 262 V152 Z" opacity=".45" stroke-dasharray="6 8"/><path d="M200 265 L245 310 L330 215" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

function slide(e, idx, total) {
  // Hero = the campaign's own key art (art/hero-<slug>.png: cropped from the official announcement banner, upscaled).
  // Background matches the banner grey (#262626) so the art sits seamlessly; no stock icons or generated decoration.
  const d = DATA[e.slug];
  const review = !d;
  const auto = (e.intro.match(/([\d,]+)\s*USDT/) || [])[1];
  const c = d || {short: e.title.split('|')[0].trim(), kicker: 'EVENT', headline: auto ? `Up to ${auto} USDT` : 'Live now', headSub: 'see campaign page for reward type', rows: [], foot: ''};
  const artFile = [`${DIR}/art/hero-${e.slug}.png`, `${DIR}/art/crop-${e.slug}.png`].find(f => fs.existsSync(f)) || '';
  const art = fs.existsSync(artFile) ? b64(artFile) : null;
  const hot = daysLeft(e) <= 1, BG = '#262626';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Instrument+Serif:ital@1&display=block');
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;background:${BG};color:#fff;font-family:'Inter Tight',sans-serif;overflow:hidden;position:relative}
.m{font-family:'JetBrains Mono',monospace}.s{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400}
</style></head><body>
${art ? `<img src="${art}" style="position:absolute;left:50%;top:96px;transform:translateX(-50%);height:560px;max-width:960px;object-fit:contain;-webkit-mask-image:linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent),linear-gradient(transparent,#000 8%,#000 92%,transparent);-webkit-mask-composite:source-in;mask-composite:intersect">` : ''}
<div style="position:absolute;left:0;right:0;top:540px;height:150px;background:linear-gradient(rgba(38,38,38,0),${BG})"></div>
<img src="${WM}" style="position:absolute;left:72px;top:64px;height:36px">
<div class="m" style="position:absolute;right:72px;top:70px;font-size:22px;letter-spacing:3px;color:rgba(255,255,255,.8)">${idx} / ${total}</div>
<div style="position:absolute;left:72px;right:72px;top:680px;display:flex;flex-direction:column;gap:14px">
  <div class="m" style="display:flex;gap:12px">
    <span style="font-size:21px;letter-spacing:3px;padding:7px 12px 6px;border:1.5px solid rgba(255,255,255,.5);color:#fff">${c.kicker}</span>
    <span style="font-size:21px;letter-spacing:3px;padding:7px 12px 6px;background:${hot ? '#F6465D' : LIME};color:${hot ? '#fff' : INK};font-weight:700">${status(e)}</span></div>
  <div style="font-weight:700;font-size:56px;letter-spacing:-1.5px;line-height:1.05;margin-top:6px">${c.short}</div>
  <div style="font-weight:800;font-size:72px;letter-spacing:-2.5px;line-height:1;color:${LIME}">${c.headline}</div>
  <div class="s" style="font-size:38px;line-height:1.1;color:rgba(255,255,255,.92);margin-top:-2px">${c.headSub}</div>
  <div style="margin-top:12px">
  ${c.rows.map(r => `<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 0 14px;border-top:1px solid rgba(255,255,255,.14)">
    <div><span style="font-weight:600;font-size:28px">${r[0]}</span><span style="font-size:22px;color:rgba(255,255,255,.7);margin-left:14px">${r[2]}</span></div>
    <div style="font-weight:700;font-size:28px;color:${LIME};white-space:nowrap;padding-left:16px">${r[1]}</div></div>`).join('')}
  ${review ? `<div class="m" style="margin-top:14px;font-size:24px;color:#F6465D">NEEDS REVIEW: add this campaign to events.json</div>` : ''}
  </div>
</div>
<div style="position:absolute;left:72px;right:72px;top:1222px;border-top:1px solid rgba(255,255,255,.14);padding-top:22px;display:flex;justify-content:space-between;align-items:center">
  <div class="m" style="font-size:22px;letter-spacing:2px">ENDS <span style="color:${hot ? '#F6465D' : LIME}">${fmtEnd(e.end).toUpperCase()}</span></div>
  <div class="m" style="font-size:22px;letter-spacing:2px;color:rgba(255,255,255,.8)">AS OF ${asOf.toUpperCase()}</div></div>
</body></html>`;
}

const out = `${DIR}/out/${u8(now).toISOString().slice(0, 10)}`; fs.mkdirSync(out, {recursive: true});
const br = await chromium.launch(); const p = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
const files = [];
for (const [i, e] of chosen.entries()) {
  await p.setContent(slide(e, i + 1, chosen.length), {waitUntil: 'networkidle'}); await p.waitForTimeout(400);
  const f = `${out}/slide-${i + 1}-${e.slug}.png`; await p.screenshot({path: f}); files.push(f);
}
await br.close();

const xLine = e => (DATA[e.slug]?.x || `${e.title.split('|')[0].trim()}. Ends {end}`).replace('{end}', fmtEnd(e.end)).replace('{endShort}', fmtEnd(e.end).replace(' (UTC+8)', ''));
const anyFutures = chosen.some(e => /futures/i.test(JSON.stringify(DATA[e.slug] || e.title)));
const risk = anyFutures ? 'Futures trading is high risk. Not financial advice.' : 'Not financial advice.';
const x = `Ending soon on Hotcoin ⏳\n\n${chosen.map(xLine).join('\n\n')}\n\nUTC+8. ${anyFutures ? 'Futures trading is high risk.' : 'Not financial advice.'} Links 👇`;
const xReply = chosen.map(e => `${DATA[e.slug]?.short || e.title.split('|')[0].trim()}: ${e.url}`).join('\n');
const fb = `Don't miss these ${chosen.length} Hotcoin events ⏳\n\n${chosen.map(e => { const d = DATA[e.slug]; return `${xLine(e)}\n${d ? d.rows.map(r => `• ${r[0]}: ${r[1]} (${r[2]})`).join('\n') + '\n' : ''}Details: ${e.url}`; }).join('\n\n')}\n\nRewards are paid as Futures Trial Funds, first come, first served while the prize pools last. Full terms on each campaign page.\n${risk}`;
fs.writeFileSync(`${out}/caption-x.txt`, x + '\n\n--- first reply ---\n' + xReply + '\n');
fs.writeFileSync(`${out}/caption-fb.txt`, fb + '\n');
console.log(files.join('\n')); console.log('\n[X]\n' + x + '\n[X reply]\n' + xReply + '\n[FB]\n' + fb + `\n\nX length (X counts emoji as 2): ${[...x].reduce((n, ch) => n + (ch.codePointAt(0) > 0x2000 ? 2 : 1), 0)}`);
