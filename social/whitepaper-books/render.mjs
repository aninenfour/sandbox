// "Whitepapers as books": individual book spines, one tall image each (2160 px high, width varies like real books).
// Our own designs (not copies of any published cover or of the Grayscale series). Coin logos: CoinGecko only (assets/logos).
// Titles and authors: the projects' original whitepapers; classic finance and crypto books by title and author only.
// Run: PW_PATH=$(npm root -g)/playwright node social/whitepaper-books/render.mjs
import {createRequire} from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH);
const DIR = '/home/user/sandbox/social/whitepaper-books', LG = 'file://' + DIR + '/assets/logos/';
const H = 2160;
// file, width, bg, fg, accent, font, title, subtitle, author, logo, opts
const B = [
  ['01-cardano', 300, '#0B1F4B', '#F2EFE6', '#C9A86A', 'Playfair Display', 'Ouroboros', 'A Provably Secure Proof-of-Stake Blockchain Protocol', 'Kiayias · Russell · David · Oliynykov', 'cardano', {plate: '#F2EFE6', tex: 'cloth'}],
  ['02-tron', 250, '#C4161C', '#FFFFFF', '#FFFFFF', 'Oswald', 'TRON', 'Advanced Decentralized Blockchain Platform', 'TRON Foundation', 'tron', {plate: '#FFFFFF', upper: true, tex: 'paper'}],
  ['03-polkadot', 340, '#F4F1EA', '#111111', '#E6007A', 'DM Serif Display', 'Polkadot', 'Vision for a Heterogeneous Multi-Chain Framework', 'Gavin Wood', 'polkadot', {band: '#E6007A', tex: 'paper'}],
  ['04-ton', 230, '#0098EA', '#FFFFFF', '#FFFFFF', 'Space Grotesk', 'The Open Network', '', 'Nikolai Durov', 'the-open-network', {plate: '#FFFFFF', tex: 'paper'}],
  ['05-monero', 190, '#1C1C1C', '#F26822', '#F26822', 'Archivo Black', 'CryptoNote v 2.0', '', 'Nicolas van Saberhagen', 'monero', {tex: 'cloth', upper: true}],
  ['06-cosmos', 260, '#1B1E36', '#FFFFFF', '#8C8FE8', 'Inter Tight', 'Cosmos', 'A Network of Distributed Ledgers', 'Jae Kwon · Ethan Buchman', 'cosmos', {tex: 'cloth'}],
  ['07-stellar', 280, '#EFEBE1', '#121212', '#121212', 'Libre Baskerville', 'The Stellar Consensus Protocol', 'A Federated Model for Internet-level Consensus', 'David Mazières', 'stellar', {tex: 'paper', rules: true}],
  ['08-tezos', 220, '#2C7DF7', '#FFFFFF', '#FFFFFF', 'EB Garamond', 'Tezos', 'A Self-Amending Crypto-Ledger', 'L.M. Goodman', 'tezos', {plate: '#FFFFFF', tex: 'cloth'}],
  ['09-algorand', 300, '#0E0E0E', '#FFFFFF', '#9A9A9A', 'Inter Tight', 'Algorand', 'Scaling Byzantine Agreements for Cryptocurrencies', 'Gilad · Hemo · Micali · Vlachos · Zeldovich', 'algorand', {plate: '#FFFFFF', tex: 'cloth'}],
  ['10-near', 240, '#00EC97', '#0B0B0B', '#0B0B0B', 'Space Grotesk', 'Nightshade', 'Near Protocol Sharding Design', 'NEAR Protocol', 'near', {tex: 'paper'}],
  ['11-aptos', 320, '#FAFAF7', '#0B0B0B', '#0B0B0B', 'JetBrains Mono', 'The Aptos Blockchain', 'Safe, Scalable, and Upgradeable Web3 Infrastructure', 'Aptos Labs', 'aptos', {tex: 'paper', rules: true}],
  ['12-filecoin', 250, '#E8EEF3', '#0A6DCC', '#0A6DCC', 'IBM Plex Sans', 'Filecoin', 'A Decentralized Storage Network', 'Protocol Labs', 'filecoin', {tex: 'paper', band: '#0A6DCC'}],
  ['13-uniswap', 200, '#FF2E8A', '#FFFFFF', '#FFFFFF', 'Inter Tight', 'Uniswap v3 Core', '', 'H. Adams et al.', 'uniswap', {plate: '#FFFFFF', tex: 'paper'}],
  ['14-ethereum-yellow-paper', 360, '#F2D24B', '#111111', '#111111', 'IBM Plex Serif', 'Ethereum', 'A Secure Decentralised Generalised Transaction Ledger', 'Gavin Wood', 'ethereum', {tex: 'paper', label: 'YELLOW PAPER'}],
  ['15-the-intelligent-investor', 380, '#1E3B2A', '#D9B76A', '#D9B76A', 'Playfair Display', 'The Intelligent Investor', '', 'Benjamin Graham', '', {tex: 'cloth', orn: true, foil: true}],
  ['16-reminiscences-of-a-stock-operator', 300, '#5A1A1A', '#EFE3CC', '#EFE3CC', 'Libre Baskerville', 'Reminiscences of a Stock Operator', '', 'Edwin Lefèvre', '', {tex: 'cloth', orn: true}],
  ['17-a-random-walk-down-wall-street', 330, '#FBFAF6', '#121212', '#D2312B', 'Inter Tight', 'A Random Walk Down Wall Street', '', 'Burton G. Malkiel', '', {tex: 'paper', band: '#D2312B'}],
  ['18-market-wizards', 280, '#111111', '#D8B45A', '#D8B45A', 'Oswald', 'Market Wizards', 'Interviews with Top Traders', 'Jack D. Schwager', '', {tex: 'cloth', upper: true, foil: true}],
  ['19-the-black-swan', 300, '#0A0A0A', '#F3F3F0', '#F3F3F0', 'Playfair Display', 'The Black Swan', 'The Impact of the Highly Improbable', 'Nassim Nicholas Taleb', '', {tex: 'paper'}],
  ['20-thinking-fast-and-slow', 340, '#F6F4EE', '#141414', '#E8B92F', 'IBM Plex Sans', 'Thinking, Fast and Slow', '', 'Daniel Kahneman', '', {tex: 'paper', band: '#E8B92F'}],
  ['21-the-psychology-of-money', 230, '#EFE9DC', '#1A1A1A', '#2F7D4F', 'DM Serif Display', 'The Psychology of Money', '', 'Morgan Housel', '', {tex: 'paper', orn: true}],
  ['22-mastering-bitcoin', 360, '#2A2D33', '#F7F7F2', '#F7931A', 'Space Grotesk', 'Mastering Bitcoin', 'Programming the Open Blockchain', 'Andreas M. Antonopoulos', '', {tex: 'cloth', band: '#F7931A'}],
  ['23-digital-gold', 280, '#C9A227', '#141414', '#141414', 'Archivo Black', 'Digital Gold', '', 'Nathaniel Popper', '', {tex: 'paper', upper: true}],
  ['24-the-bitcoin-standard', 320, '#14213D', '#E3C27A', '#E3C27A', 'EB Garamond', 'The Bitcoin Standard', 'The Decentralized Alternative to Central Banking', 'Saifedean Ammous', '', {tex: 'cloth', orn: true, foil: true}],
];
const fonts = [...new Set(B.map((b) => b[5]))].map((f) => 'family=' + f.replace(/ /g, '+') + ':wght@400;600;700;800').join('&').replace('Archivo+Black:wght@400;600;700;800', 'Archivo+Black').replace('DM+Serif+Display:wght@400;600;700;800', 'DM+Serif+Display').replace('Libre+Baskerville:wght@400;600;700;800', 'Libre+Baskerville:wght@400;700').replace('Playfair+Display:wght@400;600;700;800', 'Playfair+Display:wght@400;700;800');

const page = ([file, w, bg, fg, acc, font, title, sub, author, logo, o]) => `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?${fonts}&family=JetBrains+Mono:wght@500;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:${w}px;height:${H}px;overflow:hidden;background:${bg};color:${fg};font-family:'${font}',serif;position:relative}
.tex{position:absolute;inset:0;pointer-events:none}
.edge{position:absolute;inset:0;box-shadow:inset 14px 0 22px -10px rgba(0,0,0,.45),inset -14px 0 22px -10px rgba(0,0,0,.45),inset 0 10px 18px -12px rgba(0,0,0,.5),inset 0 -10px 18px -12px rgba(0,0,0,.5)}
.hl{position:absolute;top:0;bottom:0;left:22%;width:9%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.10),rgba(255,255,255,0))}
.v{writing-mode:vertical-rl;text-orientation:mixed;white-space:nowrap}
#title{font-weight:${/Archivo|Oswald/.test(font) ? 700 : 800};line-height:1;${o.upper ? 'text-transform:uppercase;letter-spacing:.02em;' : ''}${o.foil ? 'background:linear-gradient(180deg,#f4e3a8,' + fg + ' 40%,#8a6a2a 70%,' + fg + ');-webkit-background-clip:text;color:transparent;' : ''}}
#sub{opacity:.85;line-height:1.15;font-weight:400}
</style></head><body>
<svg class="tex" width="${w}" height="${H}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="${o.tex === 'cloth' ? '.9 .06' : '.8'}" numOctaves="3" seed="${w}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${o.tex === 'cloth' ? '.22' : '.12'} 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
${o.band ? `<div style="position:absolute;left:0;right:0;top:120px;height:${Math.round(w * .32)}px;background:${o.band}"></div><div style="position:absolute;left:0;right:0;bottom:120px;height:14px;background:${o.band}"></div>` : ''}
${o.rules ? `<div style="position:absolute;left:0;right:0;top:250px;height:3px;background:${fg};opacity:.8"></div><div style="position:absolute;left:0;right:0;bottom:330px;height:3px;background:${fg};opacity:.8"></div>` : ''}
<div id="author" style="position:absolute;left:10%;right:10%;top:${o.band ? 140 + Math.round(w * .32) : 90}px;text-align:center;font-size:${Math.min(30, w * .1)}px;line-height:1.25;font-weight:600;color:${o.band && false ? '#fff' : fg};opacity:.9">${author}</div>
${o.label ? `<div style="position:absolute;left:0;right:0;top:40px;text-align:center;font-family:'JetBrains Mono';font-weight:700;font-size:${w * .07}px;letter-spacing:.15em">${o.label}</div>` : ''}
<div id="mid" style="position:absolute;left:0;right:0;top:420px;bottom:420px;display:flex;justify-content:center;align-items:flex-start;gap:${w * .05}px">
  <div id="title" class="v" style="font-size:${w * .44}px">${title}</div>
  ${sub ? `<div id="sub" class="v" style="font-size:${w * .11}px;color:${acc === fg ? fg : acc}">${sub}</div>` : ''}
</div>
${logo ? `<div style="position:absolute;left:50%;bottom:150px;transform:translateX(-50%);width:${w * .5}px;height:${w * .5}px;border-radius:50%;${o.plate ? 'background:' + o.plate + ';' : ''}display:flex;align-items:center;justify-content:center"><img src="${LG}${logo}.png" style="width:${o.plate ? 74 : 100}%;height:${o.plate ? 74 : 100}%;object-fit:contain"></div>`
  : o.orn ? `<svg style="position:absolute;left:50%;bottom:170px;transform:translateX(-50%)" width="${w * .5}" height="${w * .5}" viewBox="0 0 100 100"><g fill="none" stroke="${fg}" stroke-width="3"><path d="M50 8l10 32 32 10-32 10-10 32-10-32-32-10 32-10z"/><circle cx="50" cy="50" r="9"/></g></svg>` : `<div style="position:absolute;left:30%;right:30%;bottom:200px;height:${w * .06}px;background:${acc}"></div>`}
<div class="hl"></div><div class="edge"></div>
<script>
  // fit: shrink the title/subtitle until the block fits the spine length and width
  window.fit = () => { const mid = document.getElementById('mid'), t = document.getElementById('title'), s = document.getElementById('sub');
    const maxH = mid.clientHeight, maxW = mid.clientWidth * .86;
    for (let k = 0; k < 200; k++) { const th = t.getBoundingClientRect().height, sh = s ? s.getBoundingClientRect().height : 0;
      const tw = t.getBoundingClientRect().width + (s ? s.getBoundingClientRect().width + ${w * .05} : 0);
      if (th <= maxH && sh <= maxH && tw <= maxW) break;
      if (th > maxH || tw > maxW) t.style.fontSize = (parseFloat(t.style.fontSize) * .97) + 'px';
      if (s && (sh > maxH || tw > maxW)) s.style.fontSize = (parseFloat(s.style.fontSize) * .97) + 'px'; }
    // centre the block vertically along the spine
    const th = t.getBoundingClientRect().height; mid.style.alignItems = 'center'; return [th, maxH]; };
</script></body></html>`;

const browser = await chromium.launch();
fs.mkdirSync(DIR + '/out', {recursive: true});
for (const b of B) {
  const pg = await (await browser.newContext({viewport: {width: b[1], height: H}, deviceScaleFactor: 1})).newPage();
  const f = `${DIR}/_s.html`; fs.writeFileSync(f, page(b));
  await pg.goto('file://' + f, {waitUntil: 'networkidle'}); await pg.evaluate(() => document.fonts.ready); await pg.evaluate(() => window.fit());
  await pg.screenshot({path: `${DIR}/out/${b[0]}.png`}); fs.unlinkSync(f); await pg.close();
}
await browser.close(); console.log('done', B.length);
