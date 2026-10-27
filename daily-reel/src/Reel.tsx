import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import tl from './timeline.json';

const GREEN = '#7EC25A';
const fontFace = `@font-face{font-family:'Hand';src:url(${staticFile('hand.woff2')}) format('woff2');}`;

const Scene: React.FC<{img: string; mode: string | null; fx: number; fy: number; dur: number; idx: number}> = ({img, mode, fx, fy, dur, idx}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  if (img.startsWith('STEP')) {
    const {fps} = useVideoConfig();
    const s = spring({frame: f, fps, config: {damping: 12, stiffness: 180}});
    return (
      <AbsoluteFill style={{background: '#EDE6D6', alignItems: 'center', justifyContent: 'center'}}>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.6), rgba(0,0,0,0.12))'}} />
        <div style={{transform: `scale(${0.7 + 0.3 * s}) rotate(${-2 + 2 * s}deg)`, background: '#F7F1E3', border: '6px solid #2b2522', borderRadius: 28,
          padding: '60px 110px', boxShadow: '10px 14px 0 rgba(43,37,34,0.25)', fontFamily: 'Hand', fontSize: 190, color: '#2b2522'}}>
          Step <span style={{color: GREEN, WebkitTextStroke: '3px #2b2522', paintOrder: 'stroke fill'}}>{img.split(' ')[1]}</span>
        </div>
      </AbsoluteFill>
    );
  }
  const close = mode === 'close';
  const dir = idx % 2 === 0 ? 1 : -1;
  const scale = close ? 1.55 + 0.1 * t : 1.04 + 0.12 * t;
  const tx = (close ? 0 : dir * 1.5 * t);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Img src={staticFile(`img/${img}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover',
        transformOrigin: `${fx}% ${fy}%`, transform: `scale(${scale}) translateX(${tx}%)`}} />
    </AbsoluteFill>
  );
};

const Caption: React.FC<{words: {t: string; hi: boolean; at: number}[]}> = ({words}) => {
  const f = useCurrentFrame();
  const pop = interpolate(f, [0, 5], [0.85, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
  return (
    <AbsoluteFill style={{alignItems: 'center', top: 1080, height: 300, justifyContent: 'flex-start'}}>
      <div style={{transform: `scale(${pop})`, fontFamily: 'Hand', fontSize: 100, lineHeight: 1.05, textAlign: 'center', maxWidth: 900,
        color: 'white', WebkitTextStroke: '14px #111', paintOrder: 'stroke fill', textShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>
        {words.map((w, i) => (
          <span key={i} style={{color: w.hi ? GREEN : 'white', opacity: f >= w.at - 1 ? 1 : 0.0}}>{w.t}{i < words.length - 1 ? ' ' : ''}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 14}});
  const sub = interpolate(f, [25, 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#0B0B0B', alignItems: 'center', justifyContent: 'center'}}>
      <Img src={staticFile('logo-white.png')} style={{width: 720, transform: `scale(${0.85 + 0.15 * s})`, opacity: s}} />
      <div style={{position: 'absolute', top: 1110, fontFamily: 'Hand', fontSize: 64, color: '#d9d9d9', opacity: sub}}>
        Follow <span style={{color: GREEN}}>Hotcoin</span> for more
      </div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <style>{fontFace}</style>
    {tl.scenes.map((s, i) => (
      <Sequence key={i} from={s.from_} durationInFrames={s.dur}>
        <Scene img={s.img} mode={s.mode} fx={s.fx} fy={s.fy} dur={s.dur} idx={i} />
      </Sequence>
    ))}
    {tl.captions.map((c, i) => (
      <Sequence key={'c' + i} from={c.from_} durationInFrames={c.dur}>
        <Caption words={c.words} />
      </Sequence>
    ))}
    <Sequence from={tl.voFrames} durationInFrames={tl.endFrames}><EndCard /></Sequence>
    <Audio src={staticFile('vo.mp3')} />
    <Audio src={staticFile('sfx.wav')} volume={0.35} />
  </AbsoluteFill>
);
