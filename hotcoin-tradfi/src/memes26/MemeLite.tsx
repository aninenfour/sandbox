// Memecoin Pulse, light edition: two 1080 x 1350 slides, white, minimal copy.
// Data (10 Oct 2026, ~15:30 UTC): Hotcoin spot API (api.hotcoinfin.com/v1/market/ticker, 24h quote volume per
// meme pair; pairs matched to CoinGecko by symbol and checked by price) + CoinGecko (meme-token category, 30d change,
// logos). History bars: CoinGecko 2025 State of Memecoins report.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import data from './data2.json';

const BG = '#FFFFFF', INK = '#0B0E11', SOFT = '#F3F4F1', LINE = '#E6E8E3', MUTED = '#8A9099', LIME = '#B8F26A', GREEN = '#2F9E44', RED = '#E5484D';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 80px "Inter Tight"', '500 20px "Inter Tight"', '400 20px "Inter Tight"', '500 16px "JetBrains Mono"'].map((f) => document.fonts.load(f)))
      .then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};
const pct = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const usdM = (v: number) => `$${(v / 1e6).toFixed(1)}M`;

const Frame: React.FC<{page: string; children: React.ReactNode}> = ({page, children}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: BG, color: INK, fontFamily: SANS, padding: '70px 76px 56px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 170, height: (170 * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 16, letterSpacing: 2, color: INK, border: `1.5px solid ${INK}`, borderRadius: 100, padding: '8px 18px'}}>MEMECOIN PULSE · {page}</div>
      </div>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>{children}</div>
      <div style={{fontFamily: MONO, fontSize: 14, color: MUTED, letterSpacing: 0.5}}>Data: Hotcoin, CoinGecko · {data.asOf} · Not financial advice</div>
    </AbsoluteFill>
  );
};

// ---------- 1: season? ----------
const HIST = [{y: '2021', v: 88.0}, {y: '2024', v: 150.6}, {y: '2025', v: 47.2}, {y: 'Now', v: data.memeCap / 1e9}];
export const MemeLiteSeason: React.FC = () => {
  const fromAth = (data.memeCap / 1e9 / 150.6 - 1) * 100;
  const signals = [data.btcDom < 55, false, false, true]; // BTC dom < 55%, alt index 75+, meme vol at 2024 pace, leaders beating BTC
  const CH = 360;
  return (
    <Frame page="1/2">
      <div style={{marginTop: 70, fontWeight: 600, fontSize: 104, lineHeight: 0.98, letterSpacing: -4.5}}>
        Meme season?<br /><span style={{color: MUTED}}>Not yet.</span>
      </div>
      <div style={{marginTop: 64, display: 'flex', alignItems: 'flex-end', gap: 26}}>
        <div style={{fontWeight: 600, fontSize: 150, lineHeight: 0.8, letterSpacing: -7}}>−{Math.abs(Math.round(fromAth))}%</div>
        <div style={{fontSize: 26, color: MUTED, lineHeight: 1.25, paddingBottom: 6}}>memecoin market cap<br />vs the 2024 peak</div>
      </div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, height: CH + 60}}>
        {HIST.map((d, i) => {
          const now = i === HIST.length - 1;
          return (
            <div key={d.y} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
              <div style={{fontWeight: 600, fontSize: 30, letterSpacing: -1, marginBottom: 12}}>${d.v.toFixed(0)}B</div>
              <div style={{width: '100%', height: (d.v / 155) * CH, borderRadius: 22, background: now ? LIME : SOFT, border: now ? `2px solid ${INK}` : `1px solid ${LINE}`}} />
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex', gap: 22, marginTop: 14}}>
        {HIST.map((d, i) => <div key={d.y} style={{flex: 1, textAlign: 'center', fontSize: 22, fontWeight: i === 3 ? 600 : 400, color: i === 3 ? INK : MUTED}}>{d.y}</div>)}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 44, marginBottom: 30, paddingTop: 28, borderTop: `1px solid ${LINE}`}}>
        <div style={{display: 'flex', gap: 8}}>
          {signals.map((on, i) => <div key={i} style={{width: 18, height: 18, borderRadius: 9, background: on ? LIME : SOFT, border: on ? `2px solid ${INK}` : `1px solid ${LINE}`}} />)}
        </div>
        <div style={{fontSize: 24, fontWeight: 500}}>1 of 4 season signals on</div>
      </div>
    </Frame>
  );
};

// ---------- 2: most traded on Hotcoin ----------
export const MemeLiteHotcoin: React.FC = () => {
  const rows = data.top;
  const max = Math.max(...rows.map((r) => r.vol));
  return (
    <Frame page="2/2">
      <div style={{marginTop: 64, display: 'flex', alignItems: 'flex-end', gap: 22}}>
        <div style={{fontWeight: 600, fontSize: 132, lineHeight: 0.8, letterSpacing: -6}}>{usdM(data.hcMemeVol)}</div>
      </div>
      <div style={{fontSize: 28, color: MUTED, marginTop: 18}}>memecoins traded on Hotcoin, last 24h</div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 58, fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: MUTED}}>
        <span>MOST TRADED</span><span>30D</span>
      </div>
      <div style={{marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12}}>
        {rows.map((r, i) => (
          <div key={r.id} style={{display: 'flex', alignItems: 'center', gap: 20, height: 92, borderBottom: i < rows.length - 1 ? `1px solid ${LINE}` : 'none', paddingBottom: 12}}>
            <Img src={staticFile(r.logo)} style={{width: 60, height: 60, borderRadius: 30, border: `1px solid ${LINE}`}} />
            <div style={{width: 170, fontWeight: 600, fontSize: 31, letterSpacing: -0.5}}>{r.sym}</div>
            <div style={{flex: 1, height: 46, position: 'relative'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(r.vol / max) * 100}%`, minWidth: 8, borderRadius: 12, background: i === 0 ? LIME : SOFT, border: i === 0 ? `2px solid ${INK}` : `1px solid ${LINE}`}} />
              <div style={{position: 'absolute', left: `calc(${(r.vol / max) * 100}% + 14px)`, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 24, ...(r.vol / max > 0.72 ? {left: 18} : {})}}>{usdM(r.vol)}</div>
            </div>
            <div style={{width: 120, textAlign: 'right', fontWeight: 600, fontSize: 27, color: r.d30 >= 0 ? GREEN : RED}}>{pct(r.d30)}</div>
          </div>
        ))}
      </div>
      <div style={{flex: 1}} />
    </Frame>
  );
};
