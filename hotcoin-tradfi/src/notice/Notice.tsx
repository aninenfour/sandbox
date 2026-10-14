// Service notice card (1600 x 900), same light layout as the reserves card.
// ETH network wallet maintenance, Hotcoin announcement of 14 Oct 2026. ETH logo: CoinGecko.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const BG = '#FFFFFF', INK = '#0B0E11', SOFT = '#F3F4F1', LINE = '#E6E8E3', MUTED = '#8A9099', LIME = '#B8F26A', GREEN = '#2F9E44';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';
const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 80px "Inter Tight"', '500 20px "Inter Tight"', '500 16px "JetBrains Mono"'].map((f) => document.fonts.load(f))).then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};

const STEPS: [string, string, string, boolean][] = [
  ['13:55', 'Deposits & withdrawals paused', 'ETH network tokens', false],
  ['14:00', 'Maintenance starts', 'about 1 hour', true],
  ['~15:00', 'Deposits & withdrawals resume', 'no further notice', false],
];

export const EthMaintenance: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: BG, color: INK, fontFamily: SANS, padding: '64px 80px 64px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 180, height: (180 * 328) / 2003}} />
      </div>
      <div style={{flex: 1, display: 'flex', gap: 60, marginTop: 20}}>
        <div style={{width: 680, display: 'flex', flexDirection: 'column'}}>
          <div style={{flex: 1}} />
          <div style={{fontWeight: 600, fontSize: 96, lineHeight: 0.96, letterSpacing: -4.2}}>Important<br /><span style={{color: MUTED}}>announcement.</span></div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 34}}>
            <Img src={staticFile('chains26/ethereum.png')} style={{width: 52, height: 52, borderRadius: 26, border: `1px solid ${LINE}`}} />
            <span style={{fontWeight: 600, fontSize: 34, letterSpacing: -0.8}}>ETH network wallet maintenance</span>
          </div>
          <div style={{display: 'inline-flex', marginTop: 34, alignSelf: 'flex-start', alignItems: 'center', gap: 14, background: LIME, border: `2px solid ${INK}`, borderRadius: 100, padding: '14px 26px'}}>
            <span style={{width: 14, height: 14, borderRadius: 7, background: GREEN, border: `1.5px solid ${INK}`}} />
            <span style={{fontWeight: 600, fontSize: 28}}>Trading is not affected</span>
          </div>
          <div style={{flex: 1}} />
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: MUTED, marginBottom: 14}}>15 OCT 2026 · UTC+8</div>
          {STEPS.map(([t, a, b, hot], i) => (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '22px 26px', marginBottom: i < 2 ? 12 : 0, borderRadius: 22,
              background: hot ? INK : SOFT, color: hot ? '#fff' : INK, border: hot ? 'none' : `1px solid ${LINE}`}}>
              <div style={{width: 150, fontWeight: 600, fontSize: 46, letterSpacing: -2, color: hot ? LIME : INK}}>{t}</div>
              <div>
                <div style={{fontWeight: 600, fontSize: 27}}>{a}</div>
                <div style={{fontSize: 20, color: hot ? 'rgba(255,255,255,0.65)' : MUTED, marginTop: 4}}>{b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
