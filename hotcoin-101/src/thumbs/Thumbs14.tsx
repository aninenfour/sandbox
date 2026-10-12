import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Companion} from '../companion/Companion';
import {Ground} from '../notebook/Notebook';
import {FONT, GREEN, INK, PAPER, RED} from '../notebook/tokens';
import {DollarBill, panAt, Scale, StableToken} from '../ep14/art';

// FILE 014 thumbnails, 1920 x 1080, exported to 1280 x 720 JPG.
// A: curiosity (the peg as a question). B: drama (the UST crash).

const Tag: React.FC<{dark?: boolean}> = ({dark}) => (
  <div style={{position: 'absolute', left: 70, top: 56, display: 'flex', alignItems: 'center', gap: 18}}>
    <Img src={staticFile(`brand/hotcoin-lockup-${dark ? 'dark' : 'light'}.png`)} style={{height: 40}} />
    <span style={{fontFamily: FONT.mono, fontSize: 26, letterSpacing: 3, color: dark ? 'rgba(237,236,231,0.7)' : 'rgba(21,23,26,0.6)'}}>101 · FILE 014</span>
  </div>
);

const Big: React.FC<{text: string; size: number; x: number; y: number; color: string}> = ({text, size, x, y, color}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: FONT.display, fontSize: size, lineHeight: 0.92, color, whiteSpace: 'nowrap', letterSpacing: size * 0.005}}>{text}</div>
);

const Hand: React.FC<{text: string; x: number; y: number; size: number; color: string; rot?: number}> = ({text, x, y, size, color, rot = -4}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: FONT.hand, fontWeight: 700, fontSize: size, color, transform: `rotate(${rot}deg)`, whiteSpace: 'nowrap'}}>{text}</div>
);

export const Thumb14A: React.FC = () => {
  const pivot = {x: 1390, y: 360};
  const beam = 320;
  const tilt = 13;
  const L = panAt(tilt, -1, beam, 150);
  const R = panAt(tilt, 1, beam, 150);
  return (
    <AbsoluteFill>
      <Ground ground="paper" />
      <Tag />
      <Big text="IS $1" size={330} x={96} y={170} color={INK} />
      <Big text="REALLY $1?" size={190} x={104} y={470} color={INK} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d="M 110 690 C 330 676, 560 700, 880 684" stroke={GREEN} strokeWidth={14} strokeLinecap="round" fill="none" />
        <g transform={`translate(${pivot.x} ${pivot.y})`}>
          <Scale tilt={tilt} beam={beam} hang={150} post={430} />
          <g transform={`translate(${L.x} ${L.y - 62}) scale(1.25)`}>
            <StableToken r={50} label="1" />
          </g>
          <g transform={`translate(${R.x} ${R.y - 48}) scale(1.05)`}>
            <DollarBill w={190} h={88} />
          </g>
        </g>
      </svg>
      <Hand text="says who?" x={1500} y={130} size={84} color={RED} />
      <Companion id="ta" trail={false} seed={3} beats={[{at: -30, x: pivot.x, y: pivot.y - 24 - 104, r: 104, mood: 'skeptical', look: {x: pivot.x + L.x, y: pivot.y + L.y}}]} />
      <Hand text="stablecoins, explained" x={110} y={760} size={64} color="#4E8A33" rot={-2} />
    </AbsoluteFill>
  );
};

export const Thumb14B: React.FC = () => {
  const peg = 300;
  const a = {x: 900, y: peg};
  const b = {x: 1060, y: peg + 10};
  const c = {x: 1840, y: 960};
  const at = (x: number) => b.y + ((x - b.x) / (c.x - b.x)) * (c.y - b.y);
  const dotX = 1300;
  return (
    <AbsoluteFill>
      <Ground ground="ink" />
      <Tag dark />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={900} y1={peg} x2={1860} y2={peg} stroke={PAPER} strokeWidth={3} strokeDasharray="14 14" opacity={0.45} />
        <path d={`M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`} stroke={RED} strokeWidth={16} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <g transform="translate(1640 770) rotate(-18)">
          <StableToken r={120} label="UST" red={1} />
          <path d="M 64 -101 L 88 -50 L 70 -18 L 104 30 L 92 60" stroke={INK} strokeWidth={7} fill="none" strokeLinejoin="round" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 900, top: peg - 58, fontFamily: FONT.mono, fontSize: 30, letterSpacing: 3, color: 'rgba(237,236,231,0.75)'}}>$1.00</div>
      <Big text="$45B" size={380} x={90} y={170} color={RED} />
      <Big text="GONE IN A WEEK" size={118} x={100} y={530} color={PAPER} />
      <div style={{position: 'absolute', left: 104, top: 680, fontFamily: FONT.mono, fontSize: 32, letterSpacing: 5, color: 'rgba(237,236,231,0.7)'}}>TERRA UST · MAY 2022</div>
      <Companion id="tb" trail={false} seed={5} ground="ink" beats={[{at: -30, x: dotX, y: at(dotX) - 104 - 6, r: 104, mood: 'worried', look: {x: 1640, y: 770}}]} />
      <Hand text="a stablecoin?" x={1150} y={110} size={80} color={GREEN} />
    </AbsoluteFill>
  );
};

// 9:16 covers, 1080 x 1920. Everything that matters sits inside the centre
// 3:4 band (y 240 to 1680), which is what the Instagram profile grid shows.
const Centered: React.FC<{text: string; size: number; y: number; color: string}> = ({text, size, y, color}) => (
  <div style={{position: 'absolute', left: 0, width: 1080, top: y, textAlign: 'center', fontFamily: FONT.display, fontSize: size, lineHeight: 0.92, color, whiteSpace: 'nowrap', letterSpacing: size * 0.005}}>{text}</div>
);
const TagV: React.FC<{dark?: boolean}> = ({dark}) => (
  <div style={{position: 'absolute', left: 0, width: 1080, top: 258, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
    <Img src={staticFile(`brand/hotcoin-lockup-${dark ? 'dark' : 'light'}.png`)} style={{height: 36}} />
    <span style={{fontFamily: FONT.mono, fontSize: 24, letterSpacing: 3, color: dark ? 'rgba(237,236,231,0.7)' : 'rgba(21,23,26,0.6)'}}>101 · FILE 014</span>
  </div>
);

export const Thumb14AV: React.FC = () => {
  const pivot = {x: 540, y: 1090};
  const beam = 330;
  const tilt = 13;
  const L = panAt(tilt, -1, beam, 150);
  const R = panAt(tilt, 1, beam, 150);
  return (
    <AbsoluteFill>
      <Ground ground="paper" />
      <TagV />
      <Centered text="IS $1" size={300} y={340} color={INK} />
      <Centered text="REALLY $1?" size={190} y={612} color={INK} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d="M 140 818 C 360 806, 640 828, 940 812" stroke={GREEN} strokeWidth={13} strokeLinecap="round" fill="none" />
        <g transform={`translate(${pivot.x} ${pivot.y})`}>
          <Scale tilt={tilt} beam={beam} hang={150} post={420} />
          <g transform={`translate(${L.x} ${L.y - 62}) scale(1.2)`}>
            <StableToken r={50} label="1" />
          </g>
          <g transform={`translate(${R.x} ${R.y - 48})`}>
            <DollarBill w={190} h={88} />
          </g>
        </g>
      </svg>
      <Hand text="says who?" x={650} y={900} size={70} color={RED} />
      <Companion id="tav" trail={false} seed={3} beats={[{at: -30, x: pivot.x, y: pivot.y - 24 - 100, r: 100, mood: 'skeptical', look: {x: pivot.x + L.x, y: pivot.y + L.y}}]} />
      <Hand text="stablecoins, explained" x={250} y={1580} size={60} color="#4E8A33" rot={-2} />
    </AbsoluteFill>
  );
};

export const Thumb14BV: React.FC = () => {
  const peg = 960;
  const a = {x: 110, y: peg};
  const b = {x: 380, y: peg + 10};
  const c = {x: 990, y: 1640};
  const at = (x: number) => b.y + ((x - b.x) / (c.x - b.x)) * (c.y - b.y);
  const dotX = 560;
  return (
    <AbsoluteFill>
      <Ground ground="ink" />
      <TagV dark />
      <Centered text="$45B" size={380} y={330} color={RED} />
      <Centered text="GONE IN A WEEK" size={118} y={700} color={PAPER} />
      <div style={{position: 'absolute', left: 0, width: 1080, top: 840, textAlign: 'center', fontFamily: FONT.mono, fontSize: 30, letterSpacing: 5, color: 'rgba(237,236,231,0.7)'}}>TERRA UST · MAY 2022</div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={110} y1={peg} x2={980} y2={peg} stroke={PAPER} strokeWidth={3} strokeDasharray="14 14" opacity={0.45} />
        <path d={`M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`} stroke={RED} strokeWidth={15} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <g transform="translate(830 1430) rotate(-18)">
          <StableToken r={110} label="UST" red={1} />
          <path d="M 59 -93 L 81 -46 L 64 -17 L 96 28 L 85 55" stroke={INK} strokeWidth={7} fill="none" strokeLinejoin="round" />
        </g>
      </svg>
      <Companion id="tbv" trail={false} seed={5} ground="ink" beats={[{at: -30, x: dotX, y: at(dotX) - 100 - 6, r: 100, mood: 'worried', look: {x: 830, y: 1430}}]} />
      <Hand text="a stablecoin?" x={120} y={1400} size={70} color={GREEN} />
    </AbsoluteFill>
  );
};
