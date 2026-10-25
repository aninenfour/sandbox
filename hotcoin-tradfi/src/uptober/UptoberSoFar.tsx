// "Uptober so far" (1080 x 1350): month-to-date change of the top coins, in the Pulse light style.
// Data: CoinGecko USD prices, 1 Oct 2026 00:00 UTC vs 25 Oct 2026 06:00 UTC (sofar.json). Logos: CoinGecko.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import data from './sofar.json';

const INK = '#0B0E11', SOFT = '#F3F4F1', MUTED = '#8A9099', RED = '#E5484D', BODY = '#4A5058';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 80px "Inter Tight"', '500 20px "Inter Tight"', '500 16px "JetBrains Mono"'].map((f) => document.fonts.load(f))).then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};

export const UptoberSoFar: React.FC = () => {
  useFonts();
  const max = 20, BAR = 560;
  const red = data.rows.filter((r) => r.chg < 0).length;
  return (
    <AbsoluteFill style={{background: '#FFFFFF', color: INK, fontFamily: SANS, padding: '70px 76px 56px'}}>
      <Img src={staticFile('policy26/bitcoin-engraved.png')} style={{position: 'absolute', right: -260, top: 60, width: 860, height: 860, transform: 'rotate(-10deg)', opacity: 0.45, filter: 'hue-rotate(250deg) saturate(1.4)',
        WebkitMaskImage: 'radial-gradient(circle at 60% 40%, #000 45%, transparent 78%)', maskImage: 'radial-gradient(circle at 60% 40%, #000 45%, transparent 78%)'}} />
      <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 170, height: (170 * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 16, letterSpacing: 2, border: `1.5px solid ${INK}`, borderRadius: 100, padding: '8px 18px', background: '#fff'}}>UPTOBER CHECK · OCT 25</div>
      </div>
      <div style={{position: 'relative', marginTop: 64, fontWeight: 600, fontSize: 100, lineHeight: 0.98, letterSpacing: -4.3}}>Uptober<br /><span style={{color: MUTED}}>so far.</span></div>
      <div style={{position: 'relative', marginTop: 46, display: 'flex', alignItems: 'flex-end', gap: 26}}>
        <div style={{fontWeight: 600, fontSize: 150, lineHeight: 0.8, letterSpacing: -7, color: RED}}>{red}/{data.rows.length}</div>
        <div style={{fontSize: 26, color: BODY, lineHeight: 1.25, paddingBottom: 6}}>top coins are red this month.<br />7 days left to flip it.</div>
      </div>
      <div style={{flex: 1}} />
      <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: MUTED, marginBottom: 16}}>OCTOBER CHANGE SO FAR</div>
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 34}}>
        {data.rows.map((r) => {
          const w = (Math.abs(r.chg) / max) * BAR;
          return (
            <div key={r.id} style={{display: 'flex', alignItems: 'center', height: 50}}>
              <Img src={staticFile(`uptober/coins/${r.id}.png`)} style={{width: 40, height: 40, borderRadius: 20}} />
              <div style={{width: 100, marginLeft: 14, fontWeight: 600, fontSize: 26}}>{r.sym}</div>
              <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                <div style={{height: 38, width: w, borderRadius: 12, border: `2px solid ${INK}`, background: r.sym === 'BTC' ? `repeating-linear-gradient(135deg, ${RED} 0 12px, #F7B3B5 12px 24px)` : '#FBD3D4'}} />
                <div style={{marginLeft: 16, fontWeight: 600, fontSize: 30, letterSpacing: -1, color: RED, fontVariantNumeric: 'tabular-nums'}}>{'−' + Math.abs(r.chg).toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'relative', fontFamily: MONO, fontSize: 13.5, color: MUTED, letterSpacing: 0.3, lineHeight: 1.5}}>Data: CoinGecko, USD price change from 1 Oct 00:00 UTC to 25 Oct 06:00 UTC · {data.asOf} · Not financial advice</div>
    </AbsoluteFill>
  );
};
