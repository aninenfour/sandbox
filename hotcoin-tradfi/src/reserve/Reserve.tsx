// "Reserves, in the open": Hotcoin reserve snapshot from CoinMarketCap's reserve page
// (coinmarketcap.com/exchanges/hotcoin-global/#reserve, data-api v3 exchange/reserves/wallets?id=943, 12 Oct 2026).
// Values = wallet balance x CMC price in the same response. Coin logos: CoinGecko.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import raw from './wallets.json';

const BG = '#FFFFFF', INK = '#0B0E11', SOFT = '#F3F4F1', LINE = '#E6E8E3', MUTED = '#8A9099', LIME = '#B8F26A', GREEN = '#7EC25A';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';
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
    Promise.all(['600 80px "Inter Tight"', '500 20px "Inter Tight"', '500 16px "JetBrains Mono"'].map((f) => document.fonts.load(f))).then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};
const fmtBal = (t: string, b: number) => (t === 'SHIB' ? `${(b / 1e9).toFixed(1)}B` : t === 'USDT' ? `${(b / 1e6).toFixed(2)}M` : b.toLocaleString('en-US', {maximumFractionDigits: 1}));
const fmtUsd = (v: number) => (v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${Math.round(v / 1e3)}K`);

export const ReserveCard: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: BG, color: INK, fontFamily: SANS, padding: '64px 80px 52px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 180, height: (180 * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 16, letterSpacing: 2, border: `1.5px solid ${INK}`, borderRadius: 100, padding: '8px 18px'}}>RESERVES · VIEW ON COINMARKETCAP</div>
      </div>
      <div style={{flex: 1, display: 'flex', gap: 80, marginTop: 50}}>
        {/* left: headline + total */}
        <div style={{width: 600, display: 'flex', flexDirection: 'column'}}>
          <div style={{fontWeight: 600, fontSize: 92, lineHeight: 0.98, letterSpacing: -4}}>Reserves,<br /><span style={{color: MUTED}}>in the open.</span></div>
          <div style={{flex: 1}} />
          <div style={{fontSize: 24, color: MUTED}}>Publicly displayed reserves</div>
          <div style={{fontWeight: 600, fontSize: 150, lineHeight: 0.9, letterSpacing: -7, marginTop: 8}}>${Math.floor(TOTAL / 1e6)}M<span style={{color: GREEN}}>+</span></div>
          <div style={{fontSize: 24, color: MUTED, marginTop: 18}}>{wallets.length} wallets · BTC · USDT · ETH · SHIB</div>
        </div>
        {/* right: composition */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: MUTED, marginBottom: 14}}>RESERVE MIX BY VALUE</div>
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
        <span>Source: CoinMarketCap · Hotcoin reserve page · reported by the exchange · 12 Oct 2026</span>
        <span>coinmarketcap.com/exchanges/hotcoin-global</span>
      </div>
    </AbsoluteFill>
  );
};
