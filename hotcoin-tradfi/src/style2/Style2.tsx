// Style 2: art-first single image posts. The art plate (art2/*: three.js render + composited backdrop) carries the post;
// type is limited to a small mono label row and one line. 1080 x 1350, render with --scale=2 for a 2160 x 2700 master.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';
const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 60px "Inter Tight"', '500 16px "JetBrains Mono"'].map((f) => document.fonts.load(f))).then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};

type Props = {art: string; label: string; meta: string; line: string; lineAt: 'top' | 'bottom'; lineWidth?: number};
const Style2: React.FC<Props> = ({art, label, meta, line, lineAt, lineWidth = 760}) => {
  useFonts();
  const lineEl = (
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 62, lineHeight: 1.04, letterSpacing: -2.2, color: '#F4F6F1', maxWidth: lineWidth, textShadow: '0 2px 30px rgba(0,0,0,0.55)'}}>{line}</div>
  );
  return (
    <AbsoluteFill style={{background: '#050706'}}>
      <Img src={staticFile(art)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      {/* soft legibility gradient on the text side only */}
      <AbsoluteFill style={{background: lineAt === 'top'
        ? 'linear-gradient(180deg, rgba(5,7,6,0.75) 0%, rgba(5,7,6,0) 32%)'
        : 'linear-gradient(0deg, rgba(5,7,6,0.8) 0%, rgba(5,7,6,0) 34%)'}} />
      <div style={{position: 'absolute', left: 64, right: 64, top: 58, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontWeight: 500, fontSize: 15, letterSpacing: 2.6, color: 'rgba(244,246,241,0.82)'}}>
        <span>{label}</span><span>{meta}</span>
      </div>
      {lineAt === 'top' ? <div style={{position: 'absolute', left: 64, top: 112}}>{lineEl}</div> : null}
      <div style={{position: 'absolute', left: 64, right: 64, bottom: 58, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        {lineAt === 'bottom' ? lineEl : <span />}
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 150, height: (150 * 328) / 2005, opacity: 0.92, marginBottom: 6}} />
      </div>
    </AbsoluteFill>
  );
};

export const Style2Logo: React.FC = () => (
  <Style2 art="art2/logo-art.png" label="" meta="HOTCOIN · SINCE 2017" line="9 years. Built for traders." lineAt="bottom" lineWidth={620} />
);
export const Style2TradFi: React.FC = () => (
  <Style2 art="art2/tradfi-art.png" label="TRADFI ON HOTCOIN" meta="BTC · STOCKS · GOLD" line="Crypto, US stocks and gold. One account." lineAt="top" lineWidth={640} />
);
export const Style2Next90: React.FC = () => (
  <Style2 art="art2/next90-art.png" label="NEXT 90 DAYS" meta="28 OCT · 3 NOV · 9 DEC · 3 JAN" line="Four dates that can move crypto." lineAt="top" lineWidth={560} />
);
