// "Guess the Total Assets" giveaway graphic, 1080 x 1080.
// Minimal version: one hero element, the wallet's hidden balance (the app's green arc and ******), over the money engraving.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const LIME = '#B8F26A', ARC = '#8DC063', WHITE = '#F4F5F2', GREY = '#A3A9A5', INK = '#050807';
const SANS = '"Inter Tight", sans-serif', MONO = '"IBM Plex Mono", monospace';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 96px "Inter Tight"', '500 30px "Inter Tight"', '500 24px "IBM Plex Mono"'].map((s) => document.fonts.load(s))).then(() => continueRender(h));
  }, [h]);
};

const CX = 540, CY = 640, R = 330; // the arc, as in the app's Overview screen

export const Guess: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      {/* money grain: the engraved $5 note, full bleed */}
      <Img src={staticFile('referral/bill-bg.png')} style={{position: 'absolute', left: -380, top: -135, height: 1350, width: 4320}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 560px 420px at ${CX}px ${CY}px, rgba(5,8,7,0.92) 0%, rgba(5,8,7,0.6) 60%, rgba(5,8,7,0.35) 100%)`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,8,7,0.75) 0%, rgba(5,8,7,0) 30%, rgba(5,8,7,0) 75%, rgba(5,8,7,0.8) 100%)'}} />

      <Img src={staticFile('brand/logo-official-white.png')} style={{position: 'absolute', left: 540 - 120, top: 64, width: 240, height: (240 * 328) / 2005}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 84, letterSpacing: -3, color: WHITE}}>
        Guess the <span style={{color: LIME}}>Total Assets</span>
      </div>

      {/* hero: the hidden balance */}
      <svg width={1080} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs><filter id="g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16" /></filter></defs>
        <path d={`M ${CX - R} ${CY + 40} A ${R} ${R} 0 0 1 ${CX + R} ${CY + 40}`} fill="none" stroke={ARC} strokeWidth={36} opacity={0.5} filter="url(#g)" />
        <path d={`M ${CX - R} ${CY + 40} A ${R} ${R} 0 0 1 ${CX + R} ${CY + 40}`} fill="none" stroke={ARC} strokeWidth={30} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: CY - 150, textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 38, color: WHITE}}>Total Assets USDT</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: CY - 92, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 190, lineHeight: 1, letterSpacing: 6, color: WHITE,
        textShadow: '0 0 40px rgba(184,242,106,0.55)'}}>******</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: CY + 86, textAlign: 'center'}}>
        <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 36, color: INK, background: LIME, padding: '12px 30px', borderRadius: 50}}>Guess right. Win it all.</span>
      </div>

      {/* the one rule */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 34, color: WHITE}}>
        1 digit after the dot: <span style={{fontWeight: 600, color: LIME}}>1,234.5</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 966, textAlign: 'center', fontFamily: MONO, fontSize: 20, color: GREY}}>Comment your guess · T&amp;Cs apply</div>
    </AbsoluteFill>
  );
};
