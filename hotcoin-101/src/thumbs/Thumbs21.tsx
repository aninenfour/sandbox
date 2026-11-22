import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Companion} from '../companion/Companion';
import {Person} from '../ep13/art';
import {Rug} from '../ep21/art';
import {Backdrop, Badge, COLORS, Line, Pill, Sticker} from './kit';
import {Card, SpikeBackdrop} from './Thumbs20';

// FILE 021 thumbnails. A: the question (who pulled the rug?). B: the real number ($2,861 to $0, Squid Game token).

const {INK, RED, YELLOW, PAPER} = COLORS;

const Art: React.FC<{W: number; H: number; children: React.ReactNode}> = ({W, H, children}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);

/** a rug flying off to the right with speed lines, people tumbling off it */
const YankedRug: React.FC<{x: number; y: number; w: number; s: number}> = ({x, y, w, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2, 3].map((i) => (
      <line key={i} x1={-260 + i * 30} y1={-10 + i * 14} x2={-60 + i * 30} y2={-10 + i * 14} stroke={INK} strokeWidth={7} strokeLinecap="round" opacity={0.5} />
    ))}
    <g transform="rotate(-4)">
      <Rug w={w} h={34} />
    </g>
    <g transform="translate(120 -40) rotate(-70) scale(1.1)">
      <Person tone={PAPER} />
    </g>
    <g transform="translate(330 -70) rotate(60) scale(1.1)">
      <Person tone="#E6DFCF" />
    </g>
  </g>
);

export const Thumb21A: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="76% 55%" />
      <Sticker>
        <Art W={W} H={H}>
          <YankedRug x={1000} y={990} w={680} s={1.3} />
        </Art>
      </Sticker>
      <Sticker o={12}>
        <Companion id="t21a" trail={false} seed={5} beats={[{at: -30, x: 1560, y: 560, r: 165, mood: 'surprised', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="WHO PULLED" x={78} y={450} size={250} rot={-3} />
      <Line W={W} H={H} text="THE RUG?" x={104} y={760} size={250} rot={-3} box={RED} />
      <Pill text="CRYPTO SLANG, DECODED" x={90} y={880} size={54} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb21B: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <SpikeBackdrop W={W} H={H} glowAt="74% 48%" />
      <Sticker>
        <Card x={1500} y={150} w={660} imgH={430} rot={4} date="NOV 2021 · SQUID GAME TOKEN" title="Gone in minutes" src="ep21/squid.jpg" pos="50% 30%" />
      </Sticker>
      <Sticker o={12}>
        <Companion id="t21b" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 1180, y: 860, r: 165, mood: 'worried', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="$2,861" x={78} y={470} size={320} rot={-3} />
      <Line W={W} H={H} text="TO $0" x={104} y={770} size={230} rot={-3} box={RED} />
      <Pill text="IN MINUTES · A REAL RUG PULL" x={90} y={880} size={54} bg={YELLOW} fg={INK} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb21AV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="50% 66%" />
      <Sticker>
        <Art W={W} H={H}>
          <YankedRug x={260} y={1470} w={620} s={1.15} />
        </Art>
      </Sticker>
      <Sticker o={10}>
        <Companion id="t21av" trail={false} seed={5} beats={[{at: -30, x: 560, y: 1160, r: 150, mood: 'surprised', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="WHO PULLED" x={540} y={600} size={190} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="THE RUG?" x={540} y={850} size={200} rot={-3} anchor="middle" box={RED} />
      <Pill text="CRYPTO SLANG, DECODED" x={540} y={1610} size={44} anchor="middle" />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};

export const Thumb21BV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <SpikeBackdrop W={W} H={H} glowAt="50% 64%" />
      <Sticker>
        <Card x={560} y={940} w={720} imgH={400} rot={3} date="NOV 2021 · SQUID GAME TOKEN" title="Gone in minutes" src="ep21/squid.jpg" pos="50% 30%" />
      </Sticker>
      <Sticker o={10}>
        <Companion id="t21bv" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 210, y: 1500, r: 130, mood: 'worried', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="$2,861" x={540} y={620} size={280} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="TO $0" x={540} y={850} size={190} rot={-3} anchor="middle" box={RED} />
      <Pill text="IN MINUTES · A REAL RUG PULL" x={540} y={1610} size={40} anchor="middle" bg={YELLOW} fg={INK} />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};
