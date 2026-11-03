import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Companion} from '../companion/Companion';
import {FONT} from '../notebook/tokens';
import {Arrow, Backdrop, Badge, COLORS, Line, Pill, Sticker} from './kit';

// FILE 018 thumbnails, kit v2. A: the question (lose half, need 2x?). B: the drama (lose 70%, need +233%).

const {INK, RED, YELLOW, GREEN} = COLORS;

const Art: React.FC<{W: number; H: number; children: React.ReactNode}> = ({W, H, children}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);

/** the money column: green half left standing, red half tumbling off */
const Column: React.FC<{x: number; base: number; w: number; h: number; fall?: [number, number, number]}> = ({x, base, w, h, fall = [w * 0.55, -h * 0.08, 18]}) => (
  <g>
    <rect x={x - w / 2} y={base - h / 2} width={w} height={h / 2} rx={14} fill={GREEN} stroke={INK} strokeWidth={7} />
    <g transform={`translate(${fall[0]} ${fall[1]}) rotate(${fall[2]} ${x} ${base - h * 0.75})`}>
      <rect x={x - w / 2} y={base - h} width={w} height={h / 2} rx={14} fill={RED} stroke={INK} strokeWidth={7} />
    </g>
    <line x1={x - w / 2 - 30} y1={base - h} x2={x + w / 2 + 30} y2={base - h} stroke={INK} strokeWidth={6} strokeDasharray="18 14" />
  </g>
);

/** a drawdown pair on one scale: the hole and the climb out */
const Pair: React.FC<{x: number; base: number; k: number; bw: number}> = ({x, base, k, bw}) => (
  <g>
    <rect x={x - bw * 1.1} y={base} width={bw} height={70 * k} rx={12} fill={RED} stroke={INK} strokeWidth={7} />
    <rect x={x + bw * 0.1} y={base - 233 * k} width={bw} height={233 * k} rx={12} fill={GREEN} stroke={INK} strokeWidth={7} />
    <line x1={x - bw * 1.6} y1={base} x2={x + bw * 1.6} y2={base} stroke="#fff" strokeWidth={6} />
  </g>
);

const Tag: React.FC<{x: number; y: number; text: string; color: string; size?: number}> = ({x, y, text, color, size = 64}) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.display} fontSize={size} fill={color} stroke={INK} strokeWidth={size * 0.12} paintOrder="stroke" strokeLinejoin="round">
    {text}
  </text>
);

export const Thumb18A: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="72% 50%" />
      <Sticker>
        <Art W={W} H={H}>
          <Column x={1330} base={950} w={220} h={600} fall={[330, 300, 32]} />
          <Tag x={1330} y={322} text="$100" color="#fff" size={70} />
          <Tag x={1330} y={830} text="$50" color="#fff" size={90} />
        </Art>
      </Sticker>
      <Arrow W={W} H={H} from={{x: 1500, y: 900}} to={{x: 1500, y: 370}} bend={-0.2} color={GREEN} width={30} />
      <Sticker o={12}>
        <Companion id="t18a" trail={false} seed={3} beats={[{at: -30, x: 1760, y: 290, r: 135, mood: 'surprised', look: {x: 1500, y: 380}}]} />
      </Sticker>
      <Line W={W} H={H} text="LOSE HALF," x={78} y={450} size={260} rot={-3} />
      <Line W={W} H={H} text="NEED 2X?" x={104} y={790} size={300} rot={-3} box={RED} />
      <Pill text="RISK IN 60 SECONDS" x={90} y={900} size={54} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb18B: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <Backdrop base="#121417" glow="#6B2422" glowAt="70% 60%" />
      <Sticker>
        <Art W={W} H={H}>
          <Pair x={1600} base={820} k={2.5} bw={150} />
        </Art>
      </Sticker>
      <Sticker o={12}>
        <Companion id="t18b" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 1690, y: 120, r: 105, mood: 'worried', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="LOSE 70%," x={78} y={470} size={260} rot={-3} />
      <Line W={W} H={H} text="NEED +233%" x={104} y={810} size={250} rot={-3} box={RED} />
      <Pill text="THE MATHS OF BLOWING UP" x={90} y={910} size={52} bg={YELLOW} fg={INK} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb18AV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="50% 64%" />
      <Sticker>
        <Art W={W} H={H}>
          <Column x={420} base={1500} w={210} h={520} />
          <Tag x={420} y={970} text="$100" color="#fff" size={60} />
          <Tag x={420} y={1330} text="$50" color="#fff" size={80} />
        </Art>
      </Sticker>
      <Arrow W={W} H={H} from={{x: 640, y: 1440}} to={{x: 640, y: 1020}} bend={0.25} color={GREEN} width={26} />
      <Sticker o={10}>
        <Companion id="t18av" trail={false} seed={3} beats={[{at: -30, x: 820, y: 1220, r: 125, mood: 'surprised', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="LOSE HALF," x={540} y={600} size={210} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="NEED 2X?" x={540} y={880} size={250} rot={-3} anchor="middle" box={RED} />
      <Pill text="RISK IN 60S" x={540} y={1580} size={50} anchor="middle" />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};

export const Thumb18BV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <Backdrop base="#121417" glow="#6B2422" glowAt="55% 70%" />
      <Sticker>
        <Art W={W} H={H}>
          <Pair x={620} base={1420} k={2.1} bw={120} />
        </Art>
      </Sticker>
      <Sticker o={10}>
        <Companion id="t18bv" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 280, y: 1250, r: 115, mood: 'worried', look: {x: 680, y: 960}}]} />
      </Sticker>
      <Line W={W} H={H} text="LOSE 70%," x={540} y={590} size={210} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="NEED +233%" x={540} y={880} size={190} rot={-3} anchor="middle" box={RED} />
      <Pill text="THE MATHS OF BLOWING UP" x={540} y={1590} size={44} anchor="middle" bg={YELLOW} fg={INK} />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};
