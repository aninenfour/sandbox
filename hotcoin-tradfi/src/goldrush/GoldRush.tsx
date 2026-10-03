// "Gold Rush": the Hotcoin symbol holds the centre while the history of money strobes behind it.
// About 13.8 s at 148 BPM ("Head Bang", Mixkit). Cuts speed up from quarter notes to 32nd notes, then the symbol becomes the full logo.
// Images: Pexels plus public-domain / CC Wikimedia Commons money history (see FOOTAGE_CREDITS.md).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IN, INOUT, OUT, clamp, ease} from '../alt/kit';
import images from './images.json';

const FPS = 60, BEAT = (60 / 148) * FPS; // 24.32 frames
const b = (beats: number) => Math.round(beats * BEAT);
const MUSIC_START_S = 0.017 + 15 * 4 * (60 / 148); // one bar before the track's drop at bar 16
const DROP = b(4), STROBE = b(24), END = b(28);
export const GOLDRUSH_DURATION = b(34);

// Cut list: quarter notes in the build bar, 8ths for two bars, 16ths for three bars, 32nds for one bar.
const CUTS: number[] = (() => {
  const c: number[] = [];
  for (let x = 0; x < 4; x += 1) c.push(b(x));
  for (let x = 4; x < 12; x += 0.5) c.push(b(x));
  for (let x = 12; x < 24; x += 0.25) c.push(b(x));
  for (let x = 24; x < 28; x += 0.125) c.push(b(x));
  return c;
})();
const IMGS = (images as {file: string}[]).map((i) => i.file);
const rnd = (n: number) => {const x = Math.sin(n * 91.345 + 7.1) * 43758.5453; return x - Math.floor(x);};

const Background: React.FC<{f: number}> = ({f}) => {
  let k = 0; while (k < CUTS.length - 1 && CUTS[k + 1] <= f) k++;
  const start = CUTS[k], len = (CUTS[k + 1] ?? END) - start, t = (f - start) / Math.max(1, len);
  const s = 1.16 - 0.08 * t, ox = (rnd(k) - 0.5) * 60, oy = (rnd(k + 50) - 0.5) * 60;
  return (
    <AbsoluteFill>
      <Img src={staticFile(`goldrush/${IMGS[k % IMGS.length]}`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        transform: `translate(${ox}px, ${oy}px) scale(${s})`, filter: 'contrast(1.28) saturate(0.9) brightness(0.78) sepia(0.12)'}} />
    </AbsoluteFill>
  );
};

export const GoldRush: React.FC = () => {
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const cx = W / 2, cy = H / 2;
  const beatPhase = ((f % BEAT) + BEAT) % BEAT;
  const kick = f >= DROP && f < END ? Math.exp(-beatPhase / 6) : 0;
  const intro = ease(f, 0, 16, OUT);
  const shake = f >= STROBE && f < END ? 6 : 0;
  const sx = (rnd(Math.floor(f / 2)) - 0.5) * shake, sy = (rnd(Math.floor(f / 2) + 9) - 0.5) * shake;
  // End card: the symbol travels into its place inside the full logo, then the wordmark wipes in.
  const LOGO_W = Math.min(W * 0.62, 680), LOGO_H = (LOGO_W * 328) / 2005, SYM_END = LOGO_H;
  const go = ease(f, END - 4, END + 22, INOUT);
  const symSize = interpolate(go, [0, 1], [Math.min(W, H) * 0.3, SYM_END]);
  const symX = interpolate(go, [0, 1], [cx, cx - LOGO_W / 2 + SYM_END / 2]);
  const wipe = ease(f, END + 14, END + 40, OUT);
  const bgOut = ease(f, END - 2, END + 10, IN);
  const pulse = 1 + 0.07 * kick + (f < END ? 0.02 * Math.sin(f / 9) : 0);
  const url = ease(f, END + 34, END + 52, OUT);
  return (
    <AbsoluteFill style={{background: '#050505', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px)`, opacity: 1 - bgOut}}>
        <Background f={Math.min(f, END - 1)} />
      </AbsoluteFill>
      {/* grade: deep vignette so the centre stays readable, warm gold lift on the edges */}
      <AbsoluteFill style={{background: `radial-gradient(circle ${Math.min(W, H) * 0.42}px at 50% 50%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 100%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)'}} />
      <AbsoluteFill style={{background: '#fff', opacity: f >= DROP && f < END ? 0.22 * Math.exp(-beatPhase / 2.5) * (Math.round(f / BEAT) % 4 === 0 ? 1.6 : 1) : 0}} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, rgba(212,175,55,${0.22 * (1 - go)}), rgba(0,0,0,0) 60%)`}} />
      {/* the symbol */}
      <Img src={staticFile('brand/symbol-official-white.png')} style={{position: 'absolute', left: symX - symSize / 2, top: cy - symSize / 2, width: symSize, height: symSize,
        opacity: intro, transform: `scale(${(0.86 + 0.14 * intro) * pulse})`,
        filter: `drop-shadow(0 0 ${18 + 30 * kick}px rgba(255,255,255,0.35)) drop-shadow(0 10px 30px rgba(0,0,0,0.7))`}} />
      {/* wordmark: the full logo revealed to the right of the symbol */}
      <div style={{position: 'absolute', left: cx - LOGO_W / 2, top: cy - LOGO_H / 2, width: LOGO_W, height: LOGO_H, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 ${(SYM_END / LOGO_W) * 100 + 1}%)`}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: LOGO_W, height: LOGO_H}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: cy + LOGO_H / 2 + 44, textAlign: 'center', opacity: url, transform: `translateY(${(1 - url) * 14}px)`,
        fontFamily: '"IBM Plex Mono", monospace', fontWeight: 500, fontSize: 34, letterSpacing: 2, color: '#E9E4D6'}}>hotcoin.com</div>
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', backgroundPosition: `${rnd(Math.floor(f / 2)) * 384}px ${rnd(Math.floor(f / 2) + 3) * 384}px`,
        mixBlendMode: 'overlay', opacity: 0.25}} />
      <Audio src={staticFile('music/head-bang.mp3')} trimBefore={Math.round(MUSIC_START_S * FPS)}
        volume={(fr) => interpolate(fr, [0, 4, GOLDRUSH_DURATION - 50, GOLDRUSH_DURATION], [0, 1, 1, 0], clamp)} />
      <Sequence from={DROP - 1} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.8} /></Sequence>
      <Sequence from={STROBE - 30} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.4} /></Sequence>
      <Sequence from={END - 1} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.8} /></Sequence>
    </AbsoluteFill>
  );
};
