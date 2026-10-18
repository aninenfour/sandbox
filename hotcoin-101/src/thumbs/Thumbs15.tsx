import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Companion} from '../companion/Companion';
import {Ground} from '../notebook/Notebook';
import {GREEN, INK, PAPER, RED} from '../notebook/tokens';
import {MoneyBag, Shrimp, Whale} from '../ep15/art';
import {Big, Hand, Tag, TagV} from './parts';

// FILE 015 thumbnails. A: curiosity (which one are you?). B: drama (one whale sells).

export const Thumb15A: React.FC = () => (
  <AbsoluteFill>
    <Ground ground="paper" />
    <Tag file="015" />
    <Big text="WHICH ONE" size={250} x={96} y={170} color={INK} />
    <Big text="ARE YOU?" size={250} x={96} y={400} color={INK} />
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <path d="M 104 650 C 330 638, 560 662, 880 646" stroke={GREEN} strokeWidth={14} strokeLinecap="round" fill="none" />
      <g transform="translate(1530 330) scale(0.85)">
        <Whale tail={-8} />
      </g>
      <g transform="translate(1230 640) scale(1.7)">
        <Shrimp flick={10} />
      </g>
      <g transform="translate(1660 800) scale(1.45)">
        <MoneyBag />
      </g>
    </svg>
    <Hand text="whale" x={1620} y={440} size={58} color={INK} rot={-3} />
    <Hand text="shrimp" x={1110} y={740} size={58} color={INK} rot={-3} />
    <Hand text="bagholder" x={1560} y={830} size={58} color={INK} rot={-3} />
    <Companion id="t15a" trail={false} seed={8} beats={[{at: -30, x: 470, y: 850, r: 110, mood: 'curious', look: 'camera'}]} />
    <Hand text="the market zoo" x={630} y={820} size={70} color="#4E8A33" rot={-3} />
  </AbsoluteFill>
);

const crash = (x0: number, peg: number, xb: number, xc: number, yc: number) => ({
  d: `M ${x0} ${peg} L ${xb} ${peg + 8} L ${xc} ${yc}`,
  at: (x: number) => peg + 8 + ((x - xb) / (xc - xb)) * (yc - peg - 8),
});

export const Thumb15B: React.FC = () => {
  const c = crash(1250, 330, 1400, 1850, 760);
  return (
    <AbsoluteFill>
      <Ground ground="ink" />
      <Tag file="015" dark />
      <Big text="ONE WHALE" size={250} x={90} y={180} color={PAPER} />
      <Big text="SELLS" size={300} x={90} y={410} color={RED} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d={c.d} stroke={RED} strokeWidth={16} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {[1520, 1650, 1780].map((x, i) => (
          <g key={x} transform={`translate(${x} ${c.at(x) - 22}) rotate(${30 + i * 25}) scale(0.7)`}>
            <Shrimp flick={20} />
          </g>
        ))}
        <g transform="translate(1260 860) rotate(14) scale(1.2)">
          <Whale tail={-30} />
        </g>
      </svg>
      <Companion id="t15b" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 1330, y: 330 - 110, r: 104, mood: 'worried', look: {x: 1500, y: 600}}]} />
      <Hand text="everyone feels it" x={110} y={760} size={74} color={GREEN} rot={-3} />
    </AbsoluteFill>
  );
};

export const Thumb15AV: React.FC = () => (
  <AbsoluteFill>
    <Ground ground="paper" />
    <TagV file="015" />
    <Big text="WHICH ONE" size={210} x={0} width={1080} align="center" y={330} color={INK} />
    <Big text="ARE YOU?" size={210} x={0} width={1080} align="center" y={523} color={INK} />
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <path d="M 150 745 C 380 733, 660 755, 930 740" stroke={GREEN} strokeWidth={13} strokeLinecap="round" fill="none" />
      <g transform="translate(560 930) scale(0.85)">
        <Whale tail={-8} />
      </g>
      <g transform="translate(250 1250) scale(1.5)">
        <Shrimp flick={10} />
      </g>
      <g transform="translate(830 1370) scale(1.25)">
        <MoneyBag />
      </g>
    </svg>
    <Companion id="t15av" trail={false} seed={8} beats={[{at: -30, x: 540, y: 1300, r: 96, mood: 'curious', look: 'camera'}]} />
    <Hand text="the market zoo" x={330} y={1500} size={64} color="#4E8A33" rot={-3} />
  </AbsoluteFill>
);

export const Thumb15BV: React.FC = () => {
  const c = crash(110, 980, 330, 990, 1560);
  return (
    <AbsoluteFill>
      <Ground ground="ink" />
      <TagV file="015" dark />
      <Big text="ONE WHALE" size={200} x={0} width={1080} align="center" y={330} color={PAPER} />
      <Big text="SELLS" size={290} x={0} width={1080} align="center" y={510} color={RED} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d={c.d} stroke={RED} strokeWidth={15} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {[500, 680, 860].map((x, i) => (
          <g key={x} transform={`translate(${x} ${c.at(x) - 22}) rotate(${30 + i * 25}) scale(0.62)`}>
            <Shrimp flick={20} />
          </g>
        ))}
        <g transform="translate(400 1480) rotate(14) scale(0.95)">
          <Whale tail={-30} />
        </g>
      </svg>
      <Companion id="t15bv" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 300, y: 980 - 100, r: 96, mood: 'worried', look: {x: 700, y: 1300}}]} />
    </AbsoluteFill>
  );
};
