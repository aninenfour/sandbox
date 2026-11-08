import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Companion} from '../companion/Companion';
import {Person} from '../ep13/art';
import {Tree} from '../ep19/art';
import {Backdrop, Badge, COLORS, Line, Pill, Sticker} from './kit';

// FILE 019 thumbnails, kit v2. A: the question (a market under a tree?). B: the number (24 brokers, 1 tree).

const {INK, RED, YELLOW, PAPER} = COLORS;

const Art: React.FC<{W: number; H: number; children: React.ReactNode}> = ({W, H, children}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);

const Crowd: React.FC<{x0: number; x1: number; y: number; s: number; n?: number}> = ({x0, x1, y, s, n = 8}) => (
  <g>
    {Array.from({length: n}).map((_, i) => (
      <g key={i} transform={`translate(${x0 + ((x1 - x0) * (i + 0.5)) / n} ${y + (i % 2) * 10}) scale(${s})`}>
        <Person tone={i % 3 ? PAPER : '#E6DFCF'} />
      </g>
    ))}
  </g>
);

export const Thumb19A: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="76% 50%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(1640 1000) scale(0.85)">
            <Tree />
          </g>
          <Crowd x0={1440} x1={1880} y={1000} s={0.75} n={6} />
        </Art>
      </Sticker>
      <Sticker o={12}>
        <Companion id="t19a" trail={false} seed={5} beats={[{at: -30, x: 1650, y: 430, r: 130, mood: 'surprised', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="A MARKET" x={78} y={450} size={270} rot={-3} />
      <Line W={W} H={H} text="UNDER A TREE?" x={104} y={780} size={232} rot={-3} box={RED} />
      <Pill text="HOW WALL STREET BEGAN" x={90} y={900} size={54} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb19B: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <Backdrop base="#121417" glow="#5C3B22" glowAt="72% 55%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(1630 1010) scale(0.9)">
            <Tree />
          </g>
          <Crowd x0={1330} x1={1900} y={1010} s={0.75} n={7} />
        </Art>
      </Sticker>
      <Sticker o={12}>
        <Companion id="t19b" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 1640, y: 400, r: 125, mood: 'delight', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="24 BROKERS," x={78} y={470} size={250} rot={-3} />
      <Line W={W} H={H} text="1 TREE" x={104} y={810} size={330} rot={-3} box={RED} />
      <Pill text="THE BIRTH OF WALL STREET" x={90} y={910} size={52} bg={YELLOW} fg={INK} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb19AV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="50% 66%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(540 1520) scale(1.15)">
            <Tree />
          </g>
          <Crowd x0={160} x1={920} y={1520} s={0.62} n={8} />
        </Art>
      </Sticker>
      <Sticker o={10}>
        <Companion id="t19av" trail={false} seed={5} beats={[{at: -30, x: 860, y: 1000, r: 110, mood: 'surprised', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="A MARKET" x={540} y={600} size={230} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="UNDER A TREE?" x={540} y={860} size={170} rot={-3} anchor="middle" box={RED} />
      <Pill text="HOW WALL STREET BEGAN" x={540} y={1585} size={44} anchor="middle" />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};

export const Thumb19BV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <Backdrop base="#121417" glow="#5C3B22" glowAt="50% 68%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(540 1520) scale(1.15)">
            <Tree />
          </g>
          <Crowd x0={140} x1={940} y={1520} s={0.62} n={9} />
        </Art>
      </Sticker>
      <Sticker o={10}>
        <Companion id="t19bv" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 220, y: 1000, r: 105, mood: 'delight', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="24 BROKERS," x={540} y={590} size={200} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="1 TREE" x={540} y={880} size={290} rot={-3} anchor="middle" box={RED} />
      <Pill text="THE BIRTH OF WALL STREET" x={540} y={1590} size={44} anchor="middle" bg={YELLOW} fg={INK} />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};
