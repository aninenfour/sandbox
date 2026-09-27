import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, Grain, MONO, SERIF, useFontsReady} from './shared';

// Variant C, "Horizon": after the Claude Opus 5.5 film. Macro money and car textures cut by one curved horizon;
// a single serif phrase sits on the edge and every beat match-cuts to a new texture on the same arc.
const R = 1500, HORIZON = 760;

export const AltC: React.FC = () => {
  useFontsReady();
  const f = useCurrentFrame();
  const k = 1.06 + f * 0.0006;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #06080A 0%, #0E1216 ${HORIZON - 60}px, #1B1F22 ${HORIZON}px)`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, clipPath: `circle(${R}px at 540px ${HORIZON + R}px)`}}>
        <Img src={staticFile('alt/hood.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 70%', transform: `scale(${k})`, filter: 'contrast(1.12) saturate(0.9) brightness(0.95) sepia(0.12)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,14,17,0) 0%, rgba(11,14,17,0.15) 40%, rgba(11,14,17,0.75) 100%)'}} />
      </div>
      <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
        <circle cx={540} cy={HORIZON + R} r={R} fill="none" stroke={C.paper} strokeOpacity={0.55} strokeWidth={1.5} />
      </svg>
      <div style={{position: 'absolute', left: 0, width: 1080, top: HORIZON - 150, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 150, color: C.paper, lineHeight: 1, letterSpacing: -2}}>
        Trade Tesla
      </div>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 120, textAlign: 'center', fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: 6, color: C.grey}}>TRADFI  ·  HOTCOIN</div>
      <div style={{position: 'absolute', left: 0, width: 1080, bottom: 90, textAlign: 'center', fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: C.paper}}>TSLA  /  USDT</div>
      <Grain opacity={0.34} />
    </AbsoluteFill>
  );
};
