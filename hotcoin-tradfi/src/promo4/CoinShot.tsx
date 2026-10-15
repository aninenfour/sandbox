// Shot 1 "Coins": the Hotcoin logo flies in as the opening, then dives past the camera while real coins
// (CoinGecko logos) burst out and settle into a row. The 3D is pre-rendered in three.js (promo4/coin.html,
// accumulation motion blur, transparent PNG sequence in public/promo4/coinframes); this adds backdrop and type.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Grain, INTRO, IntroWord, LIME, Rings, Sparkle, io, lerp, useFonts} from './kit';

export const COIN_FRAMES = 330;

export const CoinShot: React.FC = () => {
  useFonts();
  const g = useCurrentFrame(), f = g - INTRO;
  const toRow = io((f - 126) / 66);
  const flash = Math.max(0, 1 - Math.abs(f - 124) / 10) * 0.35;
  const gx = lerp(50, 55, toRow), gy = lerp(46, 52, toRow);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 60% at ${gx}% ${gy}%, #22420F 0%, #0F1E09 40%, #060A06 75%, #040504 100%)`, overflow: 'hidden'}}>
      <Rings cx={960} cy={lerp(510, 540, toRow)} color="rgba(184,242,106,0.16)" base={lerp(380, 300, toRow)} t={f / 300} n={7} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% ${lerp(48, 52, toRow)}%, rgba(184,242,106,${0.12 + flash}) 0%, rgba(184,242,106,0) 40%)`}} />
      {f >= 0 && <Img src={staticFile(`promo4/coinframes/${String(Math.min(f, COIN_FRAMES - 1)).padStart(4, '0')}.png`)} style={{position: 'absolute', inset: 0, width: 1920, height: 1080}} />}
      <Sparkle x={1430} y={250} s={72} f={f} at={52} color={LIME} />
      <Sparkle x={1490} y={310} s={28} f={f} at={58} />
      <Sparkle x={470} y={830} s={44} f={f} at={70} color={LIME} />
      <Sparkle x={1700} y={380} s={40} f={f} at={200} color={LIME} />
      <Sparkle x={250} y={700} s={30} f={f} at={210} />
      <IntroWord f={g} text="all in one app." />
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};
