// Bubble Files 01 · the whole episode: cold open and chapter 1, chapters 2 to 3, the Hotcoin read, chapters 4 to 7.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {BF01Part1, INK, PART1_DURATION} from './Part1';
import {BF01Part2, PART2_DURATION} from './Part2';
import {AD_DURATION, BF01Ad} from './Ad';
import {BF01Part3, PART3_DURATION} from './Part3';

const PARTS = [
  {C: BF01Part1, len: PART1_DURATION},
  {C: BF01Part2, len: PART2_DURATION},
  {C: BF01Ad, len: AD_DURATION},
  {C: BF01Part3, len: PART3_DURATION},
];
export const FULL_DURATION = PARTS.reduce((s, p) => s + p.len, 0);
export const PART_STARTS = PARTS.map((_, i) => PARTS.slice(0, i).reduce((s, p) => s + p.len, 0));

export const BF01Full: React.FC = () => (
  <AbsoluteFill style={{background: INK}}>
    {PARTS.map(({C, len}, i) => (
      <Sequence key={i} from={PART_STARTS[i]} durationInFrames={len}><C /></Sequence>
    ))}
  </AbsoluteFill>
);
