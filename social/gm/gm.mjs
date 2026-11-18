// Daily GM planner + photo framer, built on the Nov 18, 2026 peer benchmark (Crypto_Exchange_GM_Posts_Research.docx):
// 411 GM posts from 14 exchange accounts on X, 90 days. Key findings used here:
//  - text-only GMs: 1.22x views vs account median; promo/CTA/link inside a GM: 0.49x replies -> no links, no rewards in GM.
//  - lowercase, under ~40 chars, one idea; 1-second reply prompts lift replies (1.09x to 1.19x).
//  - real photos and one ownable visual series protect reach -> "green thing of the day" real photo + small symbol tile.
//  - fixed slot: 11:00 JST (= 10:00 UTC+8) for 4 weeks; test 20:30 JST on Tue/Thu.
// Market mood uses CoinGecko BTC 24h change (no prices in copy, so no price post / risk line needed).
// Usage:
//   PW_PATH=$(npm root -g)/playwright node social/gm/gm.mjs [YYYY-MM-DD]
// Photo days: drop the team's phone photo at social/gm/inbox/<date>.jpg (or .png). No photo -> falls back to text-only.
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const ROOT = '/home/user/sandbox', DIR = `${ROOT}/social/gm`;
const args = process.argv.slice(2);
const date = args.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a)) || new Date(Date.now() + 864e5).toISOString().slice(0, 10); // default: tomorrow
const d = new Date(date + 'T00:00:00Z'), dow = d.getUTCDay(), n = Math.round(d / 864e5);
const pick = (arr, salt = 0) => arr[(n + salt) % arr.length];

// Copy bank. Lowercase, short, no links, no em dashes, no rewards. Lines from the report are marked (r).
const BANK = {
  green: ['gm. green day, act normal', 'gm. we are so back (for now)', 'gm. it\'s green somewhere 🟩', 'gm. charts woke up happy', 'gm. don\'t screenshot too early'],
  red: ['gm. still here. still building', 'gm to the ones who held through the boring part', 'gm. red candles, green tea 🍵', 'say gm if you\'re still here after that candle', 'gm. coffee first, charts later ☕'],
  flat: ['gm. new week, same chart addiction', 'gm. the chart is up before you, again', 'gm. sideways is a lifestyle', 'gm. boring market, great coffee', 'gm. if you\'re reading this before checking your pnl, you\'re stronger than most'],
  prompt: ['gm, what\'s the ticker?', 'gm. reply with the first ticker you checked today. no lying', 'gm. rate your sleep vs your portfolio, 1 to 10 👇', 'gm. one emoji for your week so far 👇', 'if i say gm, you say gm back'],
  greenThing: ['gm. found today\'s green 🟩', 'gm. today\'s green 🟩', 'gm. green thing of the day 🟩', 'gm. spotted some green 🟩'],
  setup: ['gm. rate this setup 1 to 10 👇', 'gm. show us yours 👇', 'gm from the desk. rate it 👇'],
  kaomoji: ['(｡•̀ᴗ-)✧ gm', 'ʕ•ᴥ•ʔ gm', '( ˘▽˘)っ☕ gm', '(•̀ᴗ•́)و gm', '(￣ω￣) gm'],
  merch: ['gm from the hotcoin office', 'gm from team hotcoin 🟩', 'gm. office morning, green as usual'],
  grass: ['gm. charts can wait 10 min', 'gm. touch grass first 🌱', 'gm. sunday reset'],
};
// Weekly calendar (report section 5). photo:true = needs a real photo in inbox/.
const CAL = {
  1: {fmt: 'text-only market mood', key: 'mood'},
  2: {fmt: 'green thing of the day (real photo)', key: 'greenThing', photo: true, testSlot: true},
  3: {fmt: 'reply prompt (text-only)', key: 'prompt'},
  4: {fmt: 'desk / setup photo', key: 'setup', photo: true, testSlot: true},
  5: {fmt: 'kaomoji gm (text-only)', key: 'kaomoji'},
  6: {fmt: 'merch or team-pet photo', key: 'merch', photo: true},
  0: {fmt: 'touch-grass outdoor photo', key: 'grass', photo: true},
};
const day = CAL[dow];
let key = day.key, mood = null;
if (key === 'mood') {
  try {
    const j = await (await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true', {signal: AbortSignal.timeout(15000)})).json();
    const c = j.bitcoin.usd_24h_change; mood = c; key = c > 2 ? 'green' : c < -2 ? 'red' : 'flat';
  } catch { key = 'flat'; }
}
// <date>.branded.jpg = logo already built into the scene (AI with official mark as reference): no corner tile.
const photo = ['branded.jpg', 'jpg', 'jpeg', 'png'].map(e => `${DIR}/inbox/${date}.${e}`).find(f => fs.existsSync(f));
const branded = !!photo && photo.includes('.branded.');
const caption = pick(BANK[key]);
const out = `${DIR}/out/${date}`; fs.mkdirSync(out, {recursive: true});
let image = null;
if (day.photo && photo) {
  const {chromium} = require(process.env.PW_PATH);
  const b64 = f => `data:image/${f.endsWith('png') ? 'png' : 'jpeg'};base64,` + fs.readFileSync(f).toString('base64');
  // Avatar-style mark: official symbol SVG with the dot in white too (matches the X profile tile).
  const sym = 'data:image/svg+xml;base64,' + Buffer.from(fs.readFileSync(`${ROOT}/hotcoin-tradfi/public/brand/symbol-lime-dot.svg`, 'utf8').replace(/#B8F26A/g, '#FFFFFF')).toString('base64');
  // Real photo, 4:5 crop, one small brand tile bottom-right (same spot every day = the series signature). No text on the photo.
  const html = `<!doctype html><html><body style="margin:0;width:1080px;height:1350px;overflow:hidden;position:relative">
  <img src="${b64(photo)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
  <div style="display:${branded ? 'none' : 'flex'};position:absolute;right:48px;bottom:48px;width:104px;height:104px;border-radius:26px;background:#7EC25A;align-items:center;justify-content:center;box-shadow:0 8px 30px rgba(0,0,0,.25)">
  <img src="${sym}" style="width:62px"></div></body></html>`;
  const br = await chromium.launch(); const p = await br.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 2});
  await p.setContent(html, {waitUntil: 'load'}); image = `${out}/gm-${date}.png`; await p.screenshot({path: image}); await br.close();
}
const fallback = day.photo && !photo;
const finalCaption = fallback ? pick([...BANK.flat, ...BANK.prompt], 3) : caption;
const plan = {
  date, weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow], format: fallback ? 'text-only (photo missing)' : day.fmt,
  caption: finalCaption, chars: [...finalCaption].length, image,
  btc24h: mood == null ? undefined : +mood.toFixed(2),
  slot: '11:00 JST (10:00 UTC+8)', testSlot: day.testSlot ? '20:30 JST (19:30 UTC+8), second GM for the EU/US test' : undefined,
  firstHour: 'reply to every gm by name, quote the funniest reply, shout out a regular',
};
if (fallback) console.warn(`No photo in social/gm/inbox/${date}.jpg, posting text-only instead.`);
fs.writeFileSync(`${out}/plan.json`, JSON.stringify(plan, null, 2) + '\n');
fs.writeFileSync(`${out}/caption.txt`, finalCaption + '\n');
console.log(JSON.stringify(plan, null, 2));
