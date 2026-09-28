// Recent figures from hotcoin.com (homepage, markets and TradFi pages, captured 27 to 28 Sep 2026).
export const HOME_ASSETS = [
  {cat: 'Crypto', sym: 'BTC', price: '83,004.8', chg: '-2.16%'},
  {cat: 'Stocks', sym: 'TSLA', price: '370.28', chg: '-0.94%'},
  {cat: 'Precious Metals', sym: 'XAU', price: '4,159.85', chg: '-3.03%'},
  {cat: 'ETFs', sym: 'SPY', price: '768.71', chg: '-0.42%'},
];

export const SPOT_ROWS = [
  {sym: 'BTC', vol: '10697.50546', price: '82983.27', fiat: '≈ $82983.27', chg: '-2.20%'},
  {sym: 'ETH', vol: '94125.9647', price: '2662.27', fiat: '≈ $2662.27', chg: '-1.70%'},
  {sym: 'XRP', vol: '8505257.9', price: '1.4865', fiat: '≈ $1.49', chg: '-3.12%'},
  {sym: 'LTC', vol: '32872.253', price: '71.69', fiat: '≈ $71.69', chg: '+0.39%'},
  {sym: 'LINK', vol: '150505.87', price: '13.962', fiat: '≈ $13.96', chg: '-2.28%'},
];

export const TRADFI_ROWS = [
  {sym: 'NVDA', name: 'NVIDIA', tag: 'US Stocks', price: '225.13', chg: '+0.27%'},
  {sym: 'TSLA', name: 'Tesla', tag: 'US Stocks', price: '370.28', chg: '-0.94%'},
  {sym: 'SNDK', name: 'SanDisk', tag: 'US Stocks', price: '1778.24', chg: '+0.15%'},
  {sym: 'MU', name: 'Micron Technology', tag: 'US Stocks', price: '1093.37', chg: '+0.93%'},
  {sym: 'XAU', name: 'Gold', tag: 'Metals', price: '4159.85', chg: '-3.03%'},
];

export const BTC_HEADER = {price: '83,004.8', chg: '-2.16%', high: '85,154.02', low: '82,597.55', vol: '10.69K'};

// A deterministic candle series that ends at the header price.
export const CANDLES = (() => {
  let s = 7;
  const r = () => {s = (s * 16807) % 2147483647; return s / 2147483647;};
  const out: {o: number; h: number; l: number; c: number}[] = [];
  let p = 83820;
  for (let i = 0; i < 64; i++) {
    const drift = i < 40 ? 6 : -30;
    const c = p + drift + (r() - 0.5) * 260;
    out.push({o: p, c, h: Math.max(p, c) + r() * 90, l: Math.min(p, c) - r() * 90});
    p = c;
  }
  const k = 83004.8 - p;
  return out.map((d, i) => {const a = (k * i) / 63; return {o: d.o + a, c: d.c + a, h: d.h + a, l: d.l + a};});
})();
