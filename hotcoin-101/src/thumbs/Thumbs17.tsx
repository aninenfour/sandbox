import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Companion} from '../companion/Companion';
import {BondCert, BtcCoin} from '../ep17/art';
import {Arrow, Backdrop, Badge, COLORS, Line, Pill, Sticker} from './kit';

// FILE 017 thumbnails, kit v2. A: the question (do bonds move crypto?). B: the drama (rates up, BTC -64%).

const {INK, RED, YELLOW, GREEN} = COLORS;

const Art: React.FC<{W: number; H: number; children: React.ReactNode}> = ({W, H, children}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);

/** puppet string from the certificate to the coin */
const Str: React.FC<{a: {x: number; y: number}; b: {x: number; y: number}}> = ({a, b}) => (
  <path d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2 + 40} ${(a.y + b.y) / 2 + 60} ${b.x} ${b.y}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
);

/** a chunky high-jump bar for stickers */
const Bar: React.FC<{x: number; y: number; span: number; post: number; h: number}> = ({x, y, span, post, h}) => (
  <g transform={`translate(${x} ${y})`}>
    {[-1, 1].map((k) => (
      <rect key={k} x={(k * span) / 2 - 14} y={-post} width={28} height={post} rx={8} fill="#EDECE7" stroke={INK} strokeWidth={6} />
    ))}
    <rect x={-span / 2 - 20} y={-h - 18} width={span + 40} height={36} rx={18} fill={GREEN} stroke={INK} strokeWidth={6} />
  </g>
);

export const Thumb17A: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="74% 48%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(1560 290) rotate(-6) scale(0.95)">
            <BondCert w={520} h={330} />
          </g>
          <Str a={{x: 1460, y: 450}} b={{x: 1420, y: 760}} />
          <Str a={{x: 1640, y: 450}} b={{x: 1440, y: 740}} />
          <g transform="translate(1430 820) rotate(-12)">
            <BtcCoin r={120} />
          </g>
        </Art>
      </Sticker>
      <Sticker o={12}>
        <Companion id="t17a" trail={false} seed={4} beats={[{at: -30, x: 1750, y: 790, r: 150, mood: 'surprised', look: {x: 1430, y: 820}}]} />
      </Sticker>
      <Line W={W} H={H} text="BONDS MOVE" x={78} y={450} size={250} rot={-3} />
      <Line W={W} H={H} text="CRYPTO?" x={104} y={790} size={300} rot={-3} box={RED} />
      <Pill text="BONDS IN 60 SECONDS" x={90} y={900} size={54} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb17B: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <Backdrop base="#121417" glow="#6B2422" glowAt="72% 58%" />
      <Sticker>
        <Art W={W} H={H}>
          <Bar x={1660} y={960} span={430} post={680} h={560} />
          <g transform="translate(1500 770) rotate(24)">
            <BtcCoin r={105} />
          </g>
        </Art>
      </Sticker>
      <Arrow W={W} H={H} from={{x: 1560, y: 520}} to={{x: 1480, y: 640}} bend={0.3} width={26} />
      <Sticker o={12}>
        <Companion id="t17b" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 1740, y: 240, r: 135, mood: 'worried', look: {x: 1500, y: 770}}]} />
      </Sticker>
      <Line W={W} H={H} text="RATES UP" x={78} y={470} size={270} rot={-3} />
      <Line W={W} H={H} text="BTC -64%" x={104} y={810} size={300} rot={-3} box={RED} />
      <Pill text="WHY THE 10-YEAR MATTERS" x={90} y={910} size={52} bg={YELLOW} fg={INK} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb17AV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="50% 64%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(400 1110) rotate(-6) scale(0.82)">
            <BondCert w={520} h={330} />
          </g>
          <Str a={{x: 330, y: 1240}} b={{x: 330, y: 1400}} />
          <Str a={{x: 480, y: 1240}} b={{x: 350, y: 1390}} />
          <g transform="translate(340 1450) rotate(-12)">
            <BtcCoin r={95} />
          </g>
        </Art>
      </Sticker>
      <Sticker o={10}>
        <Companion id="t17av" trail={false} seed={4} beats={[{at: -30, x: 790, y: 1380, r: 130, mood: 'surprised', look: {x: 340, y: 1450}}]} />
      </Sticker>
      <Line W={W} H={H} text="BONDS MOVE" x={540} y={600} size={200} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="CRYPTO?" x={540} y={880} size={260} rot={-3} anchor="middle" box={RED} />
      <Pill text="BONDS IN 60S" x={540} y={1580} size={50} anchor="middle" />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};

export const Thumb17BV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <Backdrop base="#121417" glow="#6B2422" glowAt="55% 70%" />
      <Sticker>
        <Art W={W} H={H}>
          <Bar x={640} y={1530} span={420} post={520} h={420} />
          <g transform="translate(420 1380) rotate(24)">
            <BtcCoin r={90} />
          </g>
        </Art>
      </Sticker>
      <Arrow W={W} H={H} from={{x: 470, y: 1110}} to={{x: 400, y: 1250}} bend={0.3} width={22} />
      <Sticker o={10}>
        <Companion id="t17bv" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 230, y: 1130, r: 110, mood: 'worried', look: {x: 420, y: 1380}}]} />
      </Sticker>
      <Line W={W} H={H} text="RATES UP" x={540} y={590} size={220} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="BTC -64%" x={540} y={880} size={240} rot={-3} anchor="middle" box={RED} />
      <Pill text="WHY THE 10-YEAR MATTERS" x={540} y={1590} size={44} anchor="middle" bg={YELLOW} fg={INK} />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};
