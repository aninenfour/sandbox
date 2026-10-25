import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Companion} from '../companion/Companion';
import {FONT} from '../notebook/tokens';
import {Arrow, Backdrop, Badge, COLORS, Line, Pill, Sticker} from './kit';

// FILE 016 thumbnails, kit v2. A: the question (sold at $100, got $94?). B: the drama (a stock hit $0.01).

const {INK, RED, YELLOW, GREEN, PAPER} = COLORS;

const Art: React.FC<{W: number; H: number; children: React.ReactNode}> = ({W, H, children}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);

/** a thin stack of buyers: green bars, the top ones already eaten (dashed) */
const Stack: React.FC<{x: number; y: number; row: number; max: number; eaten?: number}> = ({x, y, row, max, eaten = 3}) => {
  const sizes = [0.3, 0.22, 0.28, 0.2, 0.95];
  return (
    <g>
      {sizes.map((s, i) => {
        const yy = y + i * row;
        const gone = i < eaten;
        return gone ? (
          <rect key={i} x={x} y={yy} width={s * max} height={row * 0.7} rx={10} fill="none" stroke={INK} strokeWidth={6} strokeDasharray="18 14" />
        ) : (
          <rect key={i} x={x} y={yy} width={s * max} height={row * 0.7} rx={10} fill={GREEN} stroke={INK} strokeWidth={6} />
        );
      })}
    </g>
  );
};

const SellButton: React.FC<{x: number; y: number; w: number; h: number; rot?: number}> = ({x, y, w, h, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={INK} />
    <text x={0} y={h * 0.2} textAnchor="middle" fontFamily={FONT.display} fontSize={h * 0.56} letterSpacing={h * 0.08} fill={PAPER}>
      SELL
    </text>
  </g>
);

/** a price line that plunges to nothing and snaps back, white-outlined */
const Plunge: React.FC<{pts: [number, number][]; width?: number}> = ({pts, width = 26}) => {
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');
  const low = pts.reduce((a, b) => (b[1] > a[1] ? b : a));
  return (
    <g>
      <path d={d} stroke="#fff" strokeWidth={width + 20} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d={d} stroke={RED} strokeWidth={width} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={low[0]} cy={low[1]} r={width * 1.3} fill={RED} stroke="#fff" strokeWidth={10} />
    </g>
  );
};

export const Thumb16A: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="74% 50%" />
      <Sticker>
        <Art W={W} H={H}>
          <SellButton x={1400} y={240} w={420} h={136} rot={-6} />
          <Stack x={1230} y={420} row={110} max={560} />
        </Art>
      </Sticker>
      <Arrow W={W} H={H} from={{x: 1700, y: 480}} to={{x: 1600, y: 860}} bend={-0.2} width={28} />
      <Sticker o={12}>
        <Companion id="t16a" trail={false} seed={9} beats={[{at: -30, x: 1735, y: 300, r: 150, mood: 'surprised', look: {x: 1500, y: 880}}]} />
      </Sticker>
      <Line W={W} H={H} text="SOLD $100" x={78} y={450} size={270} rot={-3} />
      <Line W={W} H={H} text="GOT $94?" x={104} y={790} size={290} rot={-3} box={RED} />
      <Pill text="LIQUIDITY IN 60 SECONDS" x={90} y={900} size={54} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb16B: React.FC = () => {
  const W = 1920;
  const H = 1080;
  const pts: [number, number][] = [
    [1260, 530],
    [1420, 505],
    [1530, 535],
    [1590, 515],
    [1650, 920],
    [1700, 945],
    [1770, 600],
    [1880, 540],
  ];
  return (
    <AbsoluteFill>
      <Backdrop base="#121417" glow="#6B2422" glowAt="72% 60%" />
      <Sticker shadow={false}>
        <Art W={W} H={H}>
          <Plunge pts={pts} />
        </Art>
      </Sticker>
      <Sticker o={12}>
        <Companion id="t16b" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 1390, y: 770, r: 150, mood: 'worried', look: {x: 1700, y: 945}}]} />
      </Sticker>
      <Line W={W} H={H} text="A STOCK HIT" x={78} y={470} size={250} rot={-3} />
      <Line W={W} H={H} text="$0.01" x={104} y={810} size={330} rot={-3} box={RED} />
      <Pill text="WHERE DID THE BUYERS GO?" x={90} y={910} size={52} bg={YELLOW} fg={INK} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb16AV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="50% 64%" />
      <Sticker>
        <Art W={W} H={H}>
          <SellButton x={330} y={1040} w={380} h={124} rot={-6} />
          <Stack x={180} y={1150} row={78} max={520} />
        </Art>
      </Sticker>
      <Arrow W={W} H={H} from={{x: 740, y: 1150}} to={{x: 700, y: 1460}} bend={-0.25} width={24} />
      <Sticker o={10}>
        <Companion id="t16av" trail={false} seed={9} beats={[{at: -30, x: 830, y: 1040, r: 140, mood: 'surprised', look: {x: 500, y: 1460}}]} />
      </Sticker>
      <Line W={W} H={H} text="SOLD $100" x={540} y={600} size={230} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="GOT $94?" x={540} y={880} size={250} rot={-3} anchor="middle" box={RED} />
      <Pill text="LIQUIDITY IN 60S" x={540} y={1560} size={50} anchor="middle" />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};

export const Thumb16BV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  const pts: [number, number][] = [
    [120, 1100],
    [300, 1080],
    [460, 1110],
    [560, 1090],
    [640, 1480],
    [700, 1500],
    [780, 1170],
    [960, 1110],
  ];
  return (
    <AbsoluteFill>
      <Backdrop base="#121417" glow="#6B2422" glowAt="55% 70%" />
      <Sticker shadow={false}>
        <Art W={W} H={H}>
          <Plunge pts={pts} width={22} />
        </Art>
      </Sticker>
      <Sticker o={10}>
        <Companion id="t16bv" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 300, y: 1330, r: 125, mood: 'worried', look: {x: 700, y: 1500}}]} />
      </Sticker>
      <Line W={W} H={H} text="A STOCK HIT" x={540} y={590} size={200} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="$0.01" x={540} y={880} size={290} rot={-3} anchor="middle" box={RED} />
      <Pill text="WHERE DID THE BUYERS GO?" x={540} y={1570} size={44} anchor="middle" bg={YELLOW} fg={INK} />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};
