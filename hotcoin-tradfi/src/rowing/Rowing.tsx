// "How the crypto market is moving": coin logos stuck on the rowers of a viral dragon-boat clip.
// Bitcoin rows; everyone else rides along. Head positions come from YOLO pose + hand-placed keyframes
// (see scripts in the session notes); logos are CoinGecko's official images.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import track from './track.json';

type P = [number, number];
const T = track as unknown as Record<'btc' | 'eth' | 'sol' | 'doge' | 'pepe', P[]>;
export const ROWING_DURATION = T.btc.length;
export const CAPTION = 'How the crypto market is moving';

const useFont = () => {
  const [h] = useState(() => delayRender('font'));
  useEffect(() => {document.fonts.load('800 40px Montserrat').then(() => continueRender(h));}, [h]);
};

const at = (k: keyof typeof T, f: number): P => T[k][Math.min(T[k].length - 1, Math.max(0, f))];

const Sticker: React.FC<{src: string; p: P; size: number; opacity?: number; rot?: number}> = ({src, p, size, opacity = 1, rot = 0}) => (
  <div style={{position: 'absolute', left: p[0] - size / 2, top: p[1] - size / 2, width: size, height: size, opacity, transform: `rotate(${rot}deg)`,
    filter: 'drop-shadow(0 0 0 #fff) drop-shadow(0 4px 6px rgba(0,0,0,0.45))'}}>
    <div style={{width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#fff', boxShadow: `0 0 0 ${size * 0.05}px #fff`}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
    </div>
  </div>
);

export const Rowing: React.FC = () => {
  useFont();
  const f = useCurrentFrame();
  const btc = at('btc', f), eth = at('eth', f);
  // When the worker sits up in front of the ETH rower, ETH is hidden behind him.
  const gap = Math.hypot(btc[0] - eth[0], btc[1] - eth[1]);
  const ethVis = interpolate(gap, [55, 85], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // BTC tilts with its own motion so it feels stuck on, not floating.
  const prev = at('btc', f - 2);
  const rot = Math.max(-18, Math.min(18, (btc[0] - prev[0]) * 0.9));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo src={staticFile('rowing/source.mp4')} />
      <Sticker src="meme/logos/SOL.png" p={at('sol', f)} size={62} />
      <Sticker src="meme/logos/PEPE.jpeg" p={at('pepe', f)} size={66} />
      <Sticker src="meme/logos/ETH.png" p={eth} size={74} opacity={ethVis} />
      <Sticker src="meme/logos/BTC.png" p={btc} size={118} rot={rot} />
      <Sticker src="meme/logos/DOGE.png" p={[Math.min(at('doge', f)[0] - 6, 648), at('doge', f)[1] + 8]} size={128} />
      {/* new caption over the original one, same position and style */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 956, display: 'flex', justifyContent: 'center'}}>
        <div style={{background: '#fff', borderRadius: 14, padding: '13px 20px 16px', minWidth: 580, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 37, letterSpacing: -0.6,
          color: '#000', whiteSpace: 'nowrap', lineHeight: 1.1}}>{CAPTION}</div>
      </div>
    </AbsoluteFill>
  );
};
