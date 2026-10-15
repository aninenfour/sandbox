// "Guess the meme" giveaway card, white theme (1080 x 1080). Silhouette traced from the PENGU logo on CoinGecko
// (scripts in chat history: flood-filled background, 2000 px mask + flipper hint lines).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const INK = '#0B0E11', LIME = '#B8F26A', GREEN = '#7EC25A', MUTED = '#8A9099', LINE = '#E6E8E3';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';
const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['700 80px "Inter Tight"', '600 80px "Inter Tight"', '500 16px "JetBrains Mono"'].map((f) => document.fonts.load(f))).then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};
const Q: React.FC<{x: number; y: number; s: number; r: number; fill?: boolean}> = ({x, y, s, r, fill}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: SANS, fontWeight: 700, fontSize: s, lineHeight: 1, transform: `rotate(${r}deg)`,
    color: fill ? LIME : 'transparent', WebkitTextStroke: fill ? `3px ${INK}` : `2.5px ${INK}`}}>?</div>
);

export const GuessMeme: React.FC = () => {
  useFonts();
  const S = 760, SX = 362, SY = 330;
  return (
    <AbsoluteFill style={{background: '#FAFBF7', color: INK, fontFamily: SANS, overflow: 'hidden'}}>
      {/* dot grid */}
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle, rgba(11,14,17,0.13) 1.6px, transparent 1.8px)', backgroundSize: '26px 26px'}} />
      {/* spotlight disc + rings */}
      <div style={{position: 'absolute', left: 330, top: 300, width: 820, height: 820, borderRadius: '50%', background: `radial-gradient(circle at 45% 40%, #D9F8B0 0%, ${LIME} 55%, #A6E35A 100%)`, border: `3px solid ${INK}`}} />
      {[960, 1100].map((d, i) => (
        <div key={d} style={{position: 'absolute', left: 740 - d / 2, top: 710 - d / 2, width: d, height: d, borderRadius: '50%', border: `1.5px ${i ? 'dashed' : 'solid'} rgba(11,14,17,0.22)`}} />
      ))}
      {/* riso-style offset shadow, then the silhouette */}
      <div style={{position: 'absolute', left: SX + 22, top: SY + 18, width: S, height: S, background: GREEN,
        WebkitMaskImage: `url(${staticFile('guess2/pengu-sil.png')})`, maskImage: `url(${staticFile('guess2/pengu-sil.png')})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%'}} />
      <div style={{position: 'absolute', left: SX, top: SY, width: S, height: S, background: `linear-gradient(160deg, #22272B 0%, ${INK} 55%)`,
        WebkitMaskImage: `url(${staticFile('guess2/pengu-sil.png')})`, maskImage: `url(${staticFile('guess2/pengu-sil.png')})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%'}} />
      <Img src={staticFile('guess2/pengu-lines.png')} style={{position: 'absolute', left: SX, top: SY, width: S, height: S, opacity: 0.55, filter: 'brightness(0) invert(1) sepia(1) saturate(4) hue-rotate(40deg)'}} />
      <Q x={860} y={170} s={170} r={14} fill />
      <Q x={175} y={590} s={120} r={-16} />
      <Q x={955} y={470} s={84} r={8} />
      {/* header */}
      <div style={{position: 'absolute', left: 64, right: 64, top: 58, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 170, height: (170 * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 15, letterSpacing: 2.4, border: `1.5px solid ${INK}`, borderRadius: 100, padding: '8px 16px', background: '#FAFBF7'}}>MEME QUIZ · 10 WINNERS</div>
      </div>
      <div style={{position: 'absolute', left: 64, top: 150, fontWeight: 700, fontSize: 118, lineHeight: 0.92, letterSpacing: -5.5}}>
        Guess<br />the <span style={{background: INK, color: LIME, padding: '0 18px 6px', borderRadius: 18, display: 'inline-block', transform: 'rotate(-3deg)'}}>meme</span>
      </div>
      {/* prize ticket */}
      <div style={{position: 'absolute', left: 64, bottom: 64, display: 'flex', alignItems: 'stretch', background: '#fff', border: `2.5px solid ${INK}`, borderRadius: 26, boxShadow: `8px 8px 0 ${INK}`, overflow: 'hidden'}}>
        <div style={{padding: '18px 26px 16px'}}>
          <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: 2.4, color: MUTED}}>PRIZE POOL</div>
          <div style={{fontWeight: 700, fontSize: 74, letterSpacing: -3, lineHeight: 1}}>100 <span style={{fontSize: 40, letterSpacing: -1}}>USDT</span></div>
        </div>
        <div style={{width: 0, borderLeft: `2.5px dashed ${LINE}`}} />
        <div style={{background: LIME, padding: '18px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: `2.5px solid ${INK}`}}>
          <div style={{fontWeight: 700, fontSize: 30, lineHeight: 1.05}}>10 winners</div>
          <div style={{fontSize: 19, marginTop: 4}}>Futures vouchers</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
