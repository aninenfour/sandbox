// "Reserves, in the open": Hotcoin reserve snapshot from CoinMarketCap's reserve page
// (coinmarketcap.com/exchanges/hotcoin-global/#reserve, data-api v3 exchange/reserves/wallets?id=943, 12 Oct 2026).
// Values = wallet balance x CMC price in the same response. Coin logos: CoinGecko.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import raw from './wallets.json';
import '@fontsource/noto-sans-sc/500.css';
import '@fontsource/noto-sans-sc/700.css';

const BG = '#FFFFFF', INK = '#0B0E11', SOFT = '#F3F4F1', LINE = '#E6E8E3', MUTED = '#8A9099', LIME = '#B8F26A', GREEN = '#7EC25A';
const SANS = '"Inter Tight", "Noto Sans SC", sans-serif', MONO = '"JetBrains Mono", "Noto Sans SC", monospace';
type Lang = 'en' | 'zh' | 'vi';
const T: Record<Lang, {pill: string; h1: string; h2: string; sub: string; wallets: string; mix: string; src: string; hSize: number}> = {
  en: {pill: 'RESERVES · VIEW ON COINMARKETCAP', h1: 'Reserves,', h2: 'in the open.', sub: 'Publicly displayed reserves', wallets: 'wallets', mix: 'RESERVE MIX BY VALUE', src: 'Source: CoinMarketCap · Hotcoin reserve page · reported by the exchange · 12 Oct 2026', hSize: 92},
  zh: {pill: '储备信息 · 在 COINMARKETCAP 查看', h1: '储备信息，', h2: '公开透明。', sub: '公开展示的储备资产', wallets: '个钱包', mix: '储备资产构成（按价值）', src: '来源：CoinMarketCap · Hotcoin 储备页面 · 由交易所提供 · 2026 年 10 月 12 日', hSize: 88},
  vi: {pill: 'DỰ TRỮ · XEM TRÊN COINMARKETCAP', h1: 'Dự trữ,', h2: 'công khai.', sub: 'Dự trữ được công khai', wallets: 'ví', mix: 'CƠ CẤU DỰ TRỮ THEO GIÁ TRỊ', src: 'Nguồn: CoinMarketCap · Trang dự trữ Hotcoin · do sàn cung cấp · 12/10/2026', hSize: 92},
};
const LOGO: Record<string, string> = {BTC: 'bitcoin', USDT: 'tether', ETH: 'ethereum', SHIB: 'shiba-inu'};
const COLOR: Record<string, string> = {BTC: INK, USDT: LIME, ETH: '#9AA39C', SHIB: '#D6DAD2'};

const wallets = raw.data.exchangeWallets;
const byToken = Object.values(wallets.reduce((acc: Record<string, {t: string; bal: number; usd: number; n: number}>, w) => {
  const a = acc[w.name] ?? (acc[w.name] = {t: w.name, bal: 0, usd: 0, n: 0});
  a.bal += w.balance; a.usd += w.balance * Number(w.priceUsd); a.n += 1;
  return acc;
}, {})).sort((a, b) => b.usd - a.usd);
const TOTAL = byToken.reduce((s, x) => s + x.usd, 0);

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 80px "Inter Tight"', '500 20px "Inter Tight"', '500 16px "JetBrains Mono"', '700 80px "Noto Sans SC"', '500 20px "Noto Sans SC"'].map((f) => document.fonts.load(f))).then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};
const fmtBal = (t: string, b: number) => (t === 'SHIB' ? `${(b / 1e9).toFixed(1)}B` : t === 'USDT' ? `${(b / 1e6).toFixed(2)}M` : b.toLocaleString('en-US', {maximumFractionDigits: 1}));
const fmtUsd = (v: number) => (v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${Math.round(v / 1e3)}K`);

export const ReserveCard: React.FC<{lang?: Lang}> = ({lang = 'en'}) => {
  useFonts();
  const L = T[lang];
  return (
    <AbsoluteFill style={{background: BG, color: INK, fontFamily: SANS, padding: '64px 80px 52px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 180, height: (180 * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 16, letterSpacing: lang === 'zh' ? 0.5 : 2, border: `1.5px solid ${INK}`, borderRadius: 100, padding: '8px 18px'}}>{L.pill}</div>
      </div>
      <div style={{flex: 1, display: 'flex', gap: 80, marginTop: 50}}>
        {/* left: headline + total */}
        <div style={{width: 600, display: 'flex', flexDirection: 'column'}}>
          <div style={{fontWeight: 600, fontSize: L.hSize, lineHeight: lang === 'zh' ? 1.12 : 0.98, letterSpacing: lang === 'zh' ? 0 : -4}}>{L.h1}<br /><span style={{color: MUTED}}>{L.h2}</span></div>
          <div style={{flex: 1}} />
          <div style={{fontSize: 24, color: MUTED}}>{L.sub}</div>
          <div style={{fontWeight: 600, fontSize: 150, lineHeight: 0.9, letterSpacing: -7, marginTop: 8}}>${Math.floor(TOTAL / 1e6)}M<span style={{color: GREEN}}>+</span></div>
          <div style={{fontSize: 24, color: MUTED, marginTop: 18}}>{wallets.length}{lang === 'zh' ? ' ' : ' '}{L.wallets} · BTC · USDT · ETH · SHIB</div>
        </div>
        {/* right: composition */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <div style={{fontFamily: MONO, fontSize: lang === 'zh' ? 17 : 15, letterSpacing: lang === 'zh' ? 0.5 : 2, color: MUTED, marginBottom: 14}}>{L.mix}</div>
          <div style={{display: 'flex', height: 54, borderRadius: 16, overflow: 'hidden', border: `1.5px solid ${INK}`}}>
            {byToken.map((x) => <div key={x.t} style={{width: `${(x.usd / TOTAL) * 100}%`, minWidth: 6, background: COLOR[x.t]}} />)}
          </div>
          <div style={{marginTop: 26, display: 'flex', flexDirection: 'column'}}>
            {byToken.map((x, i) => (
              <div key={x.t} style={{display: 'flex', alignItems: 'center', gap: 18, height: 84, borderBottom: i < byToken.length - 1 ? `1px solid ${LINE}` : 'none'}}>
                <div style={{width: 14, height: 14, borderRadius: 4, background: COLOR[x.t], border: `1px solid ${INK}`}} />
                <Img src={staticFile(`reserve/${LOGO[x.t]}.png`)} style={{width: 48, height: 48, borderRadius: 24}} />
                <div style={{width: 100, fontWeight: 600, fontSize: 28}}>{x.t}</div>
                <div style={{flex: 1, fontFamily: MONO, fontSize: 20, color: MUTED}}>{fmtBal(x.t, x.bal)} {x.t}</div>
                <div style={{width: 130, textAlign: 'right', fontWeight: 600, fontSize: 28}}>{fmtUsd(x.usd)}</div>
                <div style={{width: 110, textAlign: 'right', fontWeight: 500, fontSize: 24, color: MUTED}}>{((x.usd / TOTAL) * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 30, paddingTop: 22, borderTop: `1px solid ${LINE}`, fontFamily: MONO, fontSize: 15, color: MUTED}}>
        <span>{L.src}</span>
        <span>coinmarketcap.com/exchanges/hotcoin-global</span>
      </div>
    </AbsoluteFill>
  );
};
