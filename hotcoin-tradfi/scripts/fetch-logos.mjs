// Downloads official coin logos from CoinGecko (public API, no key) into public/meme/logos/<TICKER>.png.
// For each ticker it takes the best-ranked CoinGecko coin whose symbol matches exactly.
import {readdir, writeFile} from 'node:fs/promises';
const COINS = ['DOGE', 'SHIB', 'FLOKI', 'PEPE', 'BONK', 'WIF', 'POPCAT', 'NEIRO', 'MEW', 'USELESS', 'PUMP', 'FARTCOIN', 'PNUT', 'MOODENG', 'GOAT', 'CHILLGUY',
  'BRETT', 'TOSHI', 'DEGEN', 'BROCCOLI', 'MUBARAK', 'TUT'];
const QUERY = {WIF: 'dogwifhat', PNUT: 'peanut the squirrel', GOAT: 'goatseus maximus', BROCCOLI: 'broccoli', PUMP: 'pump.fun', NEIRO: 'neiro'};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const have = new Set((await readdir('public/meme/logos')).map((f) => f.split('.')[0]));
const search = async (q) => {
  for (let i = 0; ; i++) {
    const r = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`);
    if (r.ok) return r.json();
    await sleep(15000 * (i + 1)); // public API rate limit
  }
};
for (const sym of COINS) {
  if (have.has(sym)) continue;
  const j = await search(QUERY[sym] ?? sym);
  const hit = (j.coins ?? []).filter((c) => c.symbol.toUpperCase() === sym && c.market_cap_rank).sort((a, b) => a.market_cap_rank - b.market_cap_rank)[0];
  if (!hit) {console.log(sym, 'NOT FOUND'); continue;}
  const buf = Buffer.from(await (await fetch(hit.large)).arrayBuffer());
  await writeFile(`public/meme/logos/${sym}.${hit.large.split('?')[0].split('.').pop()}`, buf);
  console.log(sym, hit.id, hit.name, 'rank', hit.market_cap_rank, hit.large.split('?')[0].split('/').pop());
  await sleep(2500);
}
