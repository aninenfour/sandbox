// Shot "Glass": liquid-glass BTC trade pill (three.js frames from promo4/glass.html, rendered on the Mac GPU by
// scripts/mac-render.sh into public/promo4/glassframes) with captions and an end card. 600 frames, 60 fps.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Grain, INK, LIME, SANS, WHITE, io, out, useFonts} from './kit';

export const GLASS_FRAMES = 600;
const CAPS: [number, number, string][] = [[12, 150, 'Tap to trade.'], [162, 292, 'Moves like liquid.'], [304, 424, 'Glows with the market.'], [436, 516, 'One tap. Done.']];

const Caption: React.FC<{f: number; at: number; until: number; text: string}> = ({f, at, until, text}) => {
  if (f < at || f > until + 10) return null;
  const a = out((f - at) / 14), b = io((f - until) / 10);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 84, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 56, letterSpacing: -1.6, color: WHITE,
      opacity: a * (1 - b), filter: `blur(${(1 - a) * 10 + b * 10}px)`, transform: `translateY(${(1 - a) * 14}px)`, textShadow: '0 4px 30px rgba(5,12,5,0.55)'}}>{text}</div>
  );
};

export const GlassShot: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const end = io((f - 520) / 30);
  return (
    <AbsoluteFill style={{background: '#16241a'}}>
      <Img src={staticFile(`promo4/glassframes/${String(Math.min(f, GLASS_FRAMES - 1)).padStart(4, '0')}.png`)} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, filter: `blur(${end * 18}px)`}} />
      {CAPS.map(([a, u, t]) => <Caption key={t} f={f} at={a} until={u} text={t} />)}
      {/* end card */}
      <AbsoluteFill style={{background: `rgba(7,9,10,${0.55 * end})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: end}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 520, height: (520 * 328) / 2005, transform: `scale(${0.94 + 0.06 * end})`}} />
        <div style={{marginTop: 34, fontFamily: SANS, fontWeight: 600, fontSize: 46, letterSpacing: -1.2, color: WHITE}}>Crypto, TradFi and predictions. <span style={{color: LIME}}>One app.</span></div>
      </AbsoluteFill>
      <Grain o={0.05} />
      <div style={{display: 'none', color: INK}} />
    </AbsoluteFill>
  );
};
