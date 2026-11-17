import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useFontsReady} from '../alt/shared';
import {ease} from './kit';

// A run of risograph prints, each one sliding up over the last like a fresh sheet off the drum.
export type Print = {C: React.FC<{f: number; p: string; len?: number; sq?: boolean}>; len: number};
const FPS = 30;
const SLIDE = 14;

export const starts = (prints: Print[]) =>
  prints.reduce<number[]>((a, _, i) => [...a, i === 0 ? 0 : a[i - 1] + prints[i - 1].len - SLIDE], []);
export const duration = (prints: Print[]) => {
  const s = starts(prints);
  return s[s.length - 1] + prints[prints.length - 1].len;
};

export const RisoFilm: React.FC<{prints: Print[]; music?: string; musicFrom?: number; square?: boolean}> = ({prints, music, musicFrom = 0, square = false}) => {
  const {height: H} = useVideoConfig();
  useFontsReady();
  const f = useCurrentFrame();
  const STARTS = starts(prints), TOTAL = duration(prints);
  const vol = (fr: number) => interpolate(fr, [0, 15, TOTAL - 40, TOTAL], [0, 0.8, 0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#E6E1D3', overflow: 'hidden'}}>
      {prints.map(({C, len}, i) => {
        const lf = f - STARTS[i];
        if (lf < 0 || lf >= len) return null;
        const inT = i === 0 ? 1 : ease(lf / SLIDE);
        const next = STARTS[i + 1];
        const outT = next !== undefined ? ease((f - next) / SLIDE) : 0;
        return (
          <AbsoluteFill key={i} style={{transform: `translateY(${(1 - inT) * H - outT * 90}px)`, boxShadow: inT < 1 ? '0 -18px 40px rgba(40,40,30,0.18)' : undefined}}>
            <C f={lf} p={`s${i}`} len={len} sq={square} />
          </AbsoluteFill>
        );
      })}
      {music && <Audio src={staticFile(music)} startFrom={musicFrom * FPS} volume={vol} />}
    </AbsoluteFill>
  );
};
