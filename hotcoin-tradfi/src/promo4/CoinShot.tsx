// Shot 1 "Coin": the Hotcoin coin spins in, holds as a hero under a light sweep, then whips into a row of
// real coins (CoinGecko logos). The 3D coin is pre-rendered in three.js (promo4/coin.html, accumulation motion
// blur, transparent PNG sequence in public/promo4/coinframes); this composition adds backdrop and type.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Grain, LIME, Rings, Sparkle, WHITE, Word, io, lerp, useFonts} from './kit';

export const CoinShot: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const toRow = io((f - 140) / 60);
  const flash = Math.max(0, 1 - Math.abs(f - 146) / 10) * 0.35;
  const gx = lerp(50, 55, toRow), gy = lerp(46, 52, toRow);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 60% at ${gx}% ${gy}%, #22420F 0%, #0F1E09 40%, #060A06 75%, #040504 100%)`, overflow: 'hidden'}}>
      <Rings cx={960} cy={lerp(510, 540, toRow)} color="rgba(184,242,106,0.16)" base={lerp(380, 300, toRow)} t={f / 300} n={7} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% ${lerp(48, 52, toRow)}%, rgba(184,242,106,${0.12 + flash}) 0%, rgba(184,242,106,0) 40%)`}} />
      <Img src={staticFile(`promo4/coinframes/${String(f).padStart(4, '0')}.png`)} style={{position: 'absolute', inset: 0, width: 1920, height: 1080}} />
      <Sparkle x={1430} y={250} s={72} f={f} at={52} color={LIME} />
      <Sparkle x={1490} y={310} s={28} f={f} at={58} />
      <Sparkle x={470} y={830} s={44} f={f} at={70} color={LIME} />
      <Sparkle x={1700} y={300} s={40} f={f} at={232} color={LIME} />
      <Word f={f} at={214} until={300} text="all in one app." color={WHITE} size={104} x={960} y={150} />
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};
