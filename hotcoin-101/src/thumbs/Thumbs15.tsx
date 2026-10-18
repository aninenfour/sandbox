import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Companion} from '../companion/Companion';
import {Shrimp, Whale} from '../ep15/art';
import {Backdrop, Badge, COLORS, Line, Pill, Sticker} from './kit';

// FILE 015 thumbnails, kit v2. A: the question (whale or shrimp?). B: the drama (one whale sells).

const {INK, RED, YELLOW} = COLORS;

type Pt = {x: number; y: number};
/** jagged crash line with an arrowhead, white-outlined */
const Crash: React.FC<{pts: Pt[]; W: number; H: number; width?: number}> = ({pts, W, H, width = 30}) => {
  const end = pts[pts.length - 1];
  const prev = pts[pts.length - 2];
  const l = Math.hypot(end.x - prev.x, end.y - prev.y);
  const ux = (end.x - prev.x) / l;
  const uy = (end.y - prev.y) / l;
  const hs = width * 2.4;
  const base = {x: end.x - ux * hs, y: end.y - uy * hs};
  const head = `M ${base.x - uy * hs * 0.8} ${base.y + ux * hs * 0.8} L ${end.x + ux * 10} ${end.y + uy * 10} L ${base.x + uy * hs * 0.8} ${base.y - ux * hs * 0.8} Z`;
  const d = [...pts.slice(0, -1), base].map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={d} stroke="#fff" strokeWidth={width + 20} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d={head} fill="#fff" stroke="#fff" strokeWidth={20} strokeLinejoin="round" />
      <path d={d} stroke={RED} strokeWidth={width} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d={head} fill={RED} />
    </svg>
  );
};

const Art: React.FC<{W: number; H: number; children: React.ReactNode}> = ({W, H, children}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);

export const Thumb15A: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="72% 50%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(1500 300) scale(1.3)">
            <Whale tail={-10} />
          </g>
          <g transform="translate(1230 880) scale(2.5) rotate(-8)">
            <Shrimp flick={12} />
          </g>
        </Art>
      </Sticker>
      <Sticker o={12}>
        <Companion id="t15a" trail={false} seed={8} beats={[{at: -30, x: 1620, y: 770, r: 190, mood: 'surprised', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="WHALE OR" x={78} y={440} size={280} rot={-3} />
      <Line W={W} H={H} text="SHRIMP?" x={104} y={790} size={320} rot={-3} box={RED} />
      <Pill text="CRYPTO SLANG IN 60 SECONDS" x={90} y={900} size={54} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb15B: React.FC = () => {
  const W = 1920;
  const H = 1080;
  const crash = [
    {x: 1330, y: 410},
    {x: 1440, y: 470},
    {x: 1500, y: 430},
    {x: 1630, y: 680},
    {x: 1690, y: 650},
    {x: 1850, y: 960},
  ];
  return (
    <AbsoluteFill>
      <Backdrop base="#121417" glow="#6B2422" glowAt="70% 62%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(1290 900) rotate(16) scale(1.1)">
            <Whale tail={-30} />
          </g>
          {[
            {x: 1560, y: 560, r: 40},
            {x: 1770, y: 800, r: 70},
          ].map((s, i) => (
            <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.r}) scale(1.1)`}>
              <Shrimp flick={20} />
            </g>
          ))}
        </Art>
      </Sticker>
      <Crash W={W} H={H} pts={crash} />
      <Sticker o={12}>
        <Companion id="t15b" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 1420, y: 230, r: 150, mood: 'worried', look: {x: 1700, y: 800}}]} />
      </Sticker>
      <Line W={W} H={H} text="ONE WHALE" x={78} y={480} size={270} rot={-3} />
      <Line W={W} H={H} text="SELLS" x={104} y={810} size={330} rot={-3} box={RED} />
      <Pill text="WHO REALLY MOVES THE PRICE?" x={90} y={910} size={52} bg={YELLOW} fg={INK} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb15AV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="50% 62%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(560 1120) scale(1.0)">
            <Whale tail={-10} />
          </g>
          <g transform="translate(250 1410) scale(2.1) rotate(-8)">
            <Shrimp flick={12} />
          </g>
        </Art>
      </Sticker>
      <Sticker o={10}>
        <Companion id="t15av" trail={false} seed={8} beats={[{at: -30, x: 790, y: 1410, r: 150, mood: 'surprised', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="WHALE OR" x={540} y={600} size={230} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="SHRIMP?" x={540} y={880} size={260} rot={-3} anchor="middle" box={RED} />
      <Pill text="CRYPTO SLANG IN 60S" x={540} y={1560} size={50} anchor="middle" />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};

export const Thumb15BV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  const crash = [
    {x: 300, y: 1120},
    {x: 420, y: 1180},
    {x: 480, y: 1140},
    {x: 640, y: 1350},
    {x: 700, y: 1320},
    {x: 950, y: 1560},
  ];
  return (
    <AbsoluteFill>
      <Backdrop base="#121417" glow="#6B2422" glowAt="55% 70%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(420 1450) rotate(14) scale(0.85)">
            <Whale tail={-30} />
          </g>
          <g transform="translate(770 1220) rotate(60) scale(0.95)">
            <Shrimp flick={20} />
          </g>
        </Art>
      </Sticker>
      <Crash W={W} H={H} pts={crash} width={26} />
      <Sticker o={10}>
        <Companion id="t15bv" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 210, y: 1030, r: 115, mood: 'worried', look: {x: 800, y: 1400}}]} />
      </Sticker>
      <Line W={W} H={H} text="ONE WHALE" x={540} y={590} size={210} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="SELLS" x={560} y={860} size={290} rot={-3} anchor="middle" box={RED} />
      <Pill text="WHO MOVES THE PRICE?" x={540} y={1570} size={50} anchor="middle" bg={YELLOW} fg={INK} />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};
