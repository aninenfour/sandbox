// "Guess the meme" giveaway, 3D / Apple-style (1080 x 1080). 3D layer: art2/guess3d.html (inflated PENGU silhouette
// from the CoinGecko logo, lime question marks), rendered transparent and placed on a soft lime-white backdrop.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const INK = '#0B0E11', LIME = '#B8F26A', MUTED = '#6F7680';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';
const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['700 80px "Inter Tight"', '600 40px "Inter Tight"', '500 20px "Inter Tight"', '500 16px "JetBrains Mono"'].map((f) => document.fonts.load(f))).then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};

export const GuessMeme3D: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 70% at 70% 72%, #E4F7CC 0%, #F3F7EE 45%, #FBFCF9 100%)', color: INK, fontFamily: SANS, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 78% 60%, rgba(184,242,106,0.55) 0%, rgba(184,242,106,0) 38%)'}} />
      <Img src={staticFile('guess2/pengu-3d.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
      <div style={{position: 'absolute', left: 72, top: 66, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 168, height: (168 * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: 2.4, color: MUTED}}>MEME QUIZ</div>
      </div>
      <div style={{position: 'absolute', left: 72, top: 158}}>
        <div style={{fontWeight: 700, fontSize: 112, lineHeight: 0.94, letterSpacing: -5.2}}>Guess<br />the meme.</div>
        <div style={{fontWeight: 500, fontSize: 30, color: MUTED, marginTop: 22, letterSpacing: -0.4}}>Who's hiding in the shadow?</div>
      </div>
      {/* frosted glass prize card */}
      <div style={{position: 'absolute', left: 72, bottom: 72, padding: '24px 30px 26px', borderRadius: 34, background: 'rgba(255,255,255,0.58)', backdropFilter: 'blur(24px) saturate(1.4)',
        border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 30px 60px rgba(30,50,20,0.14), inset 0 1px 0 rgba(255,255,255,0.9)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontSize: 14, letterSpacing: 2.2, color: MUTED}}>
          <span style={{width: 10, height: 10, borderRadius: 5, background: LIME, boxShadow: `0 0 0 3px rgba(184,242,106,0.35)`}} />GIVEAWAY
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8}}>
          <span style={{fontWeight: 700, fontSize: 84, letterSpacing: -4, lineHeight: 1}}>100</span>
          <span style={{fontWeight: 600, fontSize: 36, letterSpacing: -1}}>USDT</span>
        </div>
        <div style={{fontSize: 22, fontWeight: 500, color: INK, marginTop: 8}}>10 winners · Futures vouchers</div>
      </div>
    </AbsoluteFill>
  );
};
