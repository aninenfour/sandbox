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
    <AbsoluteFill style={{background: BG, color: INK, fontFamily: SANS, padding: '64px 80px 52px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 180, height: (180 * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 16, letterSpacing: 2, border: `1.5px solid ${INK}`, borderRadius: 100, padding: '8px 18px'}}>SERVICE NOTICE · 15 OCT 2026</div>
      </div>
      <div style={{flex: 1, display: 'flex', gap: 70, marginTop: 50}}>
        <div style={{width: 640, display: 'flex', flexDirection: 'column'}}>
          <Img src={staticFile('chains26/ethereum.png')} style={{width: 84, height: 84, borderRadius: 42, border: `1px solid ${LINE}`}} />
          <div style={{fontWeight: 600, fontSize: 92, lineHeight: 0.98, letterSpacing: -4, marginTop: 34}}>ETH wallet<br /><span style={{color: MUTED}}>maintenance.</span></div>
          <div style={{flex: 1}} />
          <div style={{display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 14, background: LIME, border: `2px solid ${INK}`, borderRadius: 100, padding: '14px 26px'}}>
            <span style={{width: 14, height: 14, borderRadius: 7, background: GREEN, border: `1.5px solid ${INK}`}} />
            <span style={{fontWeight: 600, fontSize: 28}}>Trading is not affected</span>
          </div>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
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
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 34, paddingTop: 22, borderTop: `1px solid ${LINE}`, fontFamily: MONO, fontSize: 15, color: MUTED}}>
        <span>Transfers sent during the pause are delayed, not lost, and credited once the network is stable.</span>
        <span>hotcoin.com</span>
      </div>
    </AbsoluteFill>
  );
};
