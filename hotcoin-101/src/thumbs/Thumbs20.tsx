import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Companion} from '../companion/Companion';
import {FONT} from '../notebook/tokens';
import {Booth, CREAM, Parcel} from '../ep20/art';
import {Backdrop, Badge, COLORS, Line, Pill, Sticker} from './kit';

// FILE 020 thumbnails, kit v2. Each leads with a hook, not a topic name.
// A: the question everyone has asked (why did I pay $50 to send $20?).
// B: the real number (over $150M burned on gas in one night, Otherside 2022), with the real image.

const {INK, RED, YELLOW, PAPER} = COLORS;

const Art: React.FC<{W: number; H: number; children: React.ReactNode}> = ({W, H, children}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);

const NewsShot: React.FC<{x: number; y: number; w: number; h: number; rot: number}> = ({x, y, w, h, rot}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      padding: 18,
      boxSizing: 'border-box',
      background: CREAM,
      border: `5px solid ${INK}`,
      borderRadius: 12,
      boxShadow: '0 22px 50px rgba(0,0,0,0.55)',
      transform: `rotate(${rot}deg)`,
    }}
  >
    <div style={{fontFamily: FONT.mono, fontSize: 24, letterSpacing: 3, color: RED}}>30 APR 2022 · ETHEREUM</div>
    <div style={{fontFamily: FONT.display, fontSize: 58, lineHeight: 1.05, color: INK, textTransform: 'uppercase'}}>Otherside land sale</div>
    <Img src={staticFile('ep20/otherside.png')} style={{width: '100%', height: h - 150, objectFit: 'cover', objectPosition: '50% 35%', display: 'block', marginTop: 10, borderRadius: 6}} />
  </div>
);

export const Thumb20A: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="78% 52%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(1690 1030) scale(1.3)">
            <Booth sign="$50" signColor={RED} />
          </g>
          <g transform="translate(1250 1030) scale(1.15)">
            <Parcel tag="$20" />
          </g>
        </Art>
      </Sticker>
      <Sticker o={12}>
        <Companion id="t20a" trail={false} seed={5} beats={[{at: -30, x: 1390, y: 650, r: 118, mood: 'surprised', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="PAID $50" x={78} y={450} size={300} rot={-3} />
      <Line W={W} H={H} text="TO SEND $20?" x={104} y={760} size={210} rot={-3} box={RED} />
      <Pill text="WHY GAS FEES SPIKE" x={90} y={880} size={54} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb20B: React.FC = () => {
  const W = 1920;
  const H = 1080;
  return (
    <AbsoluteFill>
      <Backdrop base="#121417" glow="#2F5A2A" glowAt="74% 50%" />
      <Sticker>
        <NewsShot x={1490} y={520} w={720} h={640} rot={4} />
      </Sticker>
      <Sticker o={12}>
        <Companion id="t20b" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 1170, y: 840, r: 165, mood: 'worried', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="$150M" x={78} y={470} size={330} rot={-3} />
      <Line W={W} H={H} text="ON GAS FEES" x={104} y={770} size={190} rot={-3} box={RED} />
      <Pill text="IN ONE NIGHT · 2022" x={90} y={880} size={54} bg={YELLOW} fg={INK} />
      <Badge x={60} y={46} />
    </AbsoluteFill>
  );
};

export const Thumb20AV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <Backdrop base="#F7C531" glow="#FFE98A" glowAt="50% 68%" />
      <Sticker>
        <Art W={W} H={H}>
          <g transform="translate(790 1560) scale(1.3)">
            <Booth sign="$50" signColor={RED} />
          </g>
          <g transform="translate(300 1560) scale(1.25)">
            <Parcel tag="$20" />
          </g>
        </Art>
      </Sticker>
      <Sticker o={10}>
        <Companion id="t20av" trail={false} seed={5} beats={[{at: -30, x: 300, y: 1140, r: 125, mood: 'surprised', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="PAID $50" x={540} y={600} size={250} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="TO SEND $20?" x={540} y={850} size={160} rot={-3} anchor="middle" box={RED} />
      <Pill text="WHY GAS FEES SPIKE" x={540} y={1600} size={44} anchor="middle" />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};

export const Thumb20BV: React.FC = () => {
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill>
      <Backdrop base="#121417" glow="#2F5A2A" glowAt="50% 66%" />
      <Sticker>
        <NewsShot x={560} y={1220} w={760} h={600} rot={3} />
      </Sticker>
      <Sticker o={10}>
        <Companion id="t20bv" trail={false} seed={6} ground="ink" beats={[{at: -30, x: 210, y: 1470, r: 130, mood: 'worried', look: 'camera'}]} />
      </Sticker>
      <Line W={W} H={H} text="$150M" x={540} y={620} size={300} rot={-3} anchor="middle" />
      <Line W={W} H={H} text="ON GAS FEES" x={540} y={850} size={150} rot={-3} anchor="middle" box={RED} />
      <Pill text="IN ONE NIGHT · 2022" x={540} y={1590} size={44} anchor="middle" bg={YELLOW} fg={INK} />
      <Badge x={W / 2} y={262} h={76} center />
    </AbsoluteFill>
  );
};
