// Data + logos for the "Aura" edit. Crypto: Binance daily candle for Oct 10, 2025 (the record ~$19B liquidation day),
// open -> intraday low and open -> close. Logos: CoinGecko (official coin images). Writes src/aura/crash.json.
import {writeFile} from 'node:fs/promises';
const COINS = [['BTC', 'bitcoin'], ['ETH', 'ethereum'], ['SOL', 'solana'], ['XRP', 'ripple'], ['BNB', 'binancecoin'], ['DOGE', 'dogecoin'],
  ['ADA', 'cardano'], ['LINK', 'chainlink'], ['AVAX', 'avalanche-2'], ['SUI', 'sui'], ['DOT', 'polkadot'], ['LTC', 'litecoin'],
  ['UNI', 'uniswap'], ['NEAR', 'near'], ['APT', 'aptos'], ['ARB', 'arbitrum'], ['OP', 'optimism'], ['PEPE', 'pepe'], ['SHIB', 'shiba-inu'], ['TON', 'the-open-network']];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const T0 = Date.UTC(2025, 9, 10);
const out = [];
for (const [sym, id] of COINS) {
  const r = await fetch(`https://data-api.binance.vision/api/v3/klines?symbol=${sym}USDT&interval=1d&startTime=${T0}&limit=1`);
  const k = (await r.json())[0];
  if (!k) {console.log(sym, 'no candle'); continue;}
  const [o, , l, c] = [+k[1], +k[2], +k[3], +k[4]];
  out.push({sym, id, open: o, low: l, close: c, low_pct: +((l / o - 1) * 100).toFixed(2), close_pct: +((c / o - 1) * 100).toFixed(2)});
  console.log(sym, ((l / o - 1) * 100).toFixed(1), ((c / o - 1) * 100).toFixed(1));
}
await writeFile('src/aura/crash.json', JSON.stringify({date: '2025-10-10', source: 'Binance daily candles (data-api.binance.vision), UTC day', coins: out}, null, 1));
for (const {sym, id} of out) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`);
    if (r.ok) {const j = await r.json(); const buf = Buffer.from(await (await fetch(j.image.large)).arrayBuffer()); await writeFile(`public/aura/coins/${sym}.png`, buf); break;}
    await sleep(15000 * (i + 1));
  }
  await sleep(2500);
}
console.log('logos done');
