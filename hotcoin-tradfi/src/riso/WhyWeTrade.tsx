import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {useFontsReady} from '../alt/shared';
import {H, ease} from './kit';
import {ForThem, Intro, LongRun, Outro, Saving, Trip} from './scenes';

// "Why we trade": six risograph prints, each one sliding up over the last like a fresh sheet off the drum.
const FPS = 30;
const SLIDE = 14;
const PRINTS: {C: React.FC<{f: number; p: string; len?: number}>; len: number}[] = [
  {C: Intro, len: 75},
  {C: Saving, len: 120},
  {C: Trip, len: 115},
  {C: ForThem, len: 115},
  {C: LongRun, len: 120},
  {C: Outro, len: 150},
];
const STARTS = PRINTS.reduce<number[]>((a, s, i) => [...a, i === 0 ? 0 : a[i - 1] + PRINTS[i - 1].len - SLIDE], []);
export const WWT_DURATION = STARTS[STARTS.length - 1] + PRINTS[PRINTS.length - 1].len;

export const WhyWeTrade: React.FC<{music?: string; musicFrom?: number}> = ({music = 'music/walking-in-the-park.mp3', musicFrom = 0}) => {
  useFontsReady();
  const f = useCurrentFrame();
  const vol = (fr: number) => interpolate(fr, [0, 15, WWT_DURATION - 40, WWT_DURATION], [0, 0.8, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#E6E1D3', overflow: 'hidden'}}>
      {PRINTS.map(({C, len}, i) => {
        const lf = f - STARTS[i];
        if (lf < 0 || lf >= len) return null;
        const inT = i === 0 ? 1 : ease(lf / SLIDE);
        const next = STARTS[i + 1];
        const outT = next !== undefined ? ease((f - next) / SLIDE) : 0;
        return (
          <AbsoluteFill key={i} style={{transform: `translateY(${(1 - inT) * H - outT * 90}px)`, boxShadow: inT < 1 ? '0 -18px 40px rgba(40,40,30,0.18)' : undefined}}>
            <C f={lf} p={`s${i}`} len={len} />
          </AbsoluteFill>
        );
      })}
      {music && <Audio src={staticFile(music)} startFrom={musicFrom * FPS} volume={vol} />}
    </AbsoluteFill>
  );
};
