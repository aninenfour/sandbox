import React from 'react';
import {FONT, GREEN, INK, PAPER, RED} from '../notebook/tokens';

// FILE 020 illustrations: ink line, flat fills, origin noted per piece.

const LW = 3;
export const BUS = '#5E7C8E';
export const BUS_DK = '#4A6372';
export const CREAM = '#F3E9D2';
export const TX = ['#E3B341', '#C98BB9', '#7FB7D6', '#F2A285', '#B9D98C', '#D9C08F'];

/** the block as a bus: a carriage with a grid of seats. origin at the centre. filled(i) 0..1 per seat */
export const BlockBus: React.FC<{w: number; h: number; cols: number; rows: number; filled: (i: number) => number; color?: (i: number) => string; label?: string; door?: number}> = ({
  w,
  h,
  cols,
  rows,
  filled,
  color = (i) => TX[i % TX.length],
  label = 'BLOCK',
  door = 0,
}) => {
  const pad = 26;
  const sw = (w - pad * 2) / cols;
  const sh = (h - pad * 2 - 30) / rows;
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={34} fill={BUS} stroke={INK} strokeWidth={LW} />
      <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={26} rx={12} fill={BUS_DK} />
      <text x={-w / 2 + 30} y={-h / 2 + 30} fontFamily={FONT.mono} fontSize={18} letterSpacing={4} fill={PAPER} opacity={0.85}>
        {label}
      </text>
      {Array.from({length: cols * rows}).map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const x = -w / 2 + pad + c * sw;
        const y = -h / 2 + pad + 30 + r * sh;
        const f = filled(i);
        return (
          <g key={i}>
            <rect x={x + 4} y={y + 4} width={sw - 8} height={sh - 8} rx={8} fill="#3E5462" />
            {f > 0 && <rect x={x + 4 + (sw - 8) * (1 - f) * 0.5} y={y + 4 + (sh - 8) * (1 - f) * 0.5} width={(sw - 8) * f} height={(sh - 8) * f} rx={8} fill={color(i)} stroke={INK} strokeWidth={2} />}
          </g>
        );
      })}
      <rect x={w / 2 - 14} y={-h / 2 + 50} width={14} height={(h - 70) * (1 - door)} fill={door > 0.95 ? GREEN : '#2C3E48'} />
      {[-w / 2 + 120, w / 2 - 120].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={h / 2 + 6} r={34} fill={INK} />
          <circle cx={x} cy={h / 2 + 6} r={14} fill="#8A9399" />
        </g>
      ))}
    </g>
  );
};

/** a bid paddle: round sign on a stick. origin at the bottom of the stick */
export const Paddle: React.FC<{text: string; r?: number; color?: string; tilt?: number}> = ({text, r = 34, color = PAPER, tilt = 0}) => (
  <g transform={`rotate(${tilt})`}>
    <line x1={0} y1={0} x2={0} y2={-r * 2.2} stroke={INK} strokeWidth={5} strokeLinecap="round" />
    <circle cx={0} cy={-r * 2.2 - r} r={r} fill={color} stroke={INK} strokeWidth={LW} />
    <text x={0} y={-r * 2.2 - r + r * 0.36} textAnchor="middle" fontFamily={FONT.display} fontSize={r} fill={INK}>
      {text}
    </text>
  </g>
);

/** a transaction token with a face-less look: a rounded cube. origin at its bottom middle */
export const TxCube: React.FC<{s?: number; color?: string}> = ({s = 1, color = TX[0]}) => (
  <g transform={`scale(${s})`}>
    <rect x={-26} y={-52} width={52} height={52} rx={10} fill={color} stroke={INK} strokeWidth={LW} />
    <path d="M -14 -36 h 28 M -14 -24 h 18" stroke={INK} strokeWidth={2.4} strokeLinecap="round" opacity={0.5} />
  </g>
);

/** newspaper clipping card, centred, with a slight tilt and a torn bottom edge */
export const Clipping: React.FC<{w: number; h: number; tilt?: number; children?: React.ReactNode}> = ({w, h, tilt = 0, children}) => {
  const teeth = 14;
  const torn = Array.from({length: teeth + 1})
    .map((_, i) => `L ${w / 2 - (i * w) / teeth} ${h / 2 + (i % 2 ? 8 : -2)}`)
    .join(' ');
  return (
    <g transform={`rotate(${tilt})`}>
      <path d={`M ${-w / 2} ${-h / 2} L ${w / 2} ${-h / 2} L ${w / 2} ${h / 2} ${torn} Z`} fill={CREAM} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
      <line x1={-w / 2 + 24} y1={-h / 2 + 64} x2={w / 2 - 24} y2={-h / 2 + 64} stroke={INK} strokeWidth={2} opacity={0.5} />
      {children}
    </g>
  );
};

/** a cartoon cat doodle (not any project's artwork), centred */
export const CatDoodle: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M -40 10 C -44 -30, -30 -48, -18 -44 L -24 -70 L -2 -50 C 6 -52, 14 -52, 22 -50 L 40 -70 L 36 -42 C 50 -32, 50 -6, 44 10 C 36 34, -32 34, -40 10 Z" fill="#E7B9D6" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <circle cx={-14} cy={-14} r={5} fill={INK} />
    <circle cx={16} cy={-14} r={5} fill={INK} />
    <path d="M -4 2 Q 1 8 6 2" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    <path d="M -46 -2 h -20 M -46 6 l -18 6 M 50 -2 h 20 M 50 6 l 18 6" stroke={INK} strokeWidth={2} strokeLinecap="round" />
  </g>
);

/** a plot of land sign doodle, centred */
export const LandDoodle: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M -70 30 L -30 -10 L 20 -4 L 70 26 L 20 46 L -40 46 Z" fill="#9FC57E" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <line x1={0} y1={18} x2={0} y2={-60} stroke={INK} strokeWidth={4} />
    <path d="M 0 -60 L 46 -48 L 0 -36 Z" fill={RED} stroke={INK} strokeWidth={2} />
  </g>
);

/** a crate packing many tiny transactions, centred. pack 0..1 */
export const Crate: React.FC<{w: number; h: number; pack: number; seed?: number}> = ({w, h, pack}) => {
  const n = 160;
  const cols = 20;
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill="#2F3A42" stroke={INK} strokeWidth={LW} />
      {Array.from({length: Math.floor(n * pack)}).map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        return <rect key={i} x={-w / 2 + 16 + c * ((w - 32) / cols)} y={-h / 2 + 16 + r * ((h - 32) / 8)} width={(w - 32) / cols - 3} height={(h - 32) / 8 - 3} rx={2} fill={TX[i % TX.length]} />;
      })}
    </g>
  );
};

/** a busy-road gauge: green to red arc with a needle. origin at the pivot. v 0..1 */
export const BusyGauge: React.FC<{r: number; v: number}> = ({r, v}) => {
  const seg = (a0: number, a1: number, color: string) => {
    const p = (a: number) => `${Math.cos(Math.PI + a * Math.PI) * r} ${Math.sin(Math.PI + a * Math.PI) * r}`;
    return <path d={`M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}`} stroke={color} strokeWidth={r * 0.18} fill="none" />;
  };
  const a = Math.PI + v * Math.PI;
  return (
    <g>
      {seg(0, 0.34, GREEN)}
      {seg(0.34, 0.67, '#E3B341')}
      {seg(0.67, 1, RED)}
      <line x1={0} y1={0} x2={Math.cos(a) * r * 0.82} y2={Math.sin(a) * r * 0.82} stroke={PAPER} strokeWidth={6} strokeLinecap="round" />
      <circle r={10} fill={PAPER} />
    </g>
  );
};

/** a toll booth with a fee board on a post. origin at the booth's bottom centre. sign text above */
export const Booth: React.FC<{sign: string; signColor?: string; arm?: number; label?: string}> = ({sign, signColor = INK, arm = 0, label = 'FEE'}) => (
  <g>
    <rect x={-80} y={-230} width={160} height={230} rx={10} fill={CREAM} stroke={INK} strokeWidth={LW} />
    <rect x={-56} y={-196} width={112} height={78} rx={8} fill="#BFD7E2" stroke={INK} strokeWidth={LW} />
    <path d="M -104 -230 L 0 -284 L 104 -230 Z" fill={RED} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <g transform={`translate(-80 -96) rotate(${-arm * 80})`}>
      <rect x={-300} y={-9} width={300} height={18} rx={9} fill={PAPER} stroke={INK} strokeWidth={LW} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-290 + i * 76} y={-9} width={34} height={18} fill={RED} />
      ))}
    </g>
    <line x1={0} y1={-284} x2={0} y2={-330} stroke={INK} strokeWidth={6} />
    <rect x={-120} y={-440} width={240} height={110} rx={14} fill={PAPER} stroke={INK} strokeWidth={LW} />
    <text x={0} y={-404} textAnchor="middle" fontFamily={FONT.mono} fontSize={20} letterSpacing={4} fill={INK} opacity={0.6}>
      {label}
    </text>
    <text x={0} y={-345} textAnchor="middle" fontFamily={FONT.display} fontSize={56} fill={signColor}>
      {sign}
    </text>
  </g>
);

/** a parcel with a price tag. origin at its bottom centre */
export const Parcel: React.FC<{tag: string}> = ({tag}) => (
  <g>
    <rect x={-90} y={-140} width={180} height={140} rx={10} fill="#D9B27A" stroke={INK} strokeWidth={LW} />
    <path d="M -90 -96 H 90 M 0 -140 V 0" stroke="#B88C52" strokeWidth={10} />
    <g transform="translate(52 -150) rotate(14)">
      <rect x={-46} y={-26} width={92} height={52} rx={8} fill={PAPER} stroke={INK} strokeWidth={2.6} />
      <text x={0} y={13} textAnchor="middle" fontFamily={FONT.display} fontSize={36} fill={INK}>
        {tag}
      </text>
    </g>
  </g>
);

/** an auction gavel. origin at the head's striking face; rot in degrees */
export const Gavel: React.FC<{rot?: number}> = ({rot = 0}) => (
  <g transform={`rotate(${rot})`}>
    <rect x={-10} y={-200} width={20} height={170} rx={8} fill="#8A5A34" stroke={INK} strokeWidth={LW} />
    <rect x={-70} y={-60} width={140} height={60} rx={14} fill="#A86B3C" stroke={INK} strokeWidth={LW} />
    <rect x={-80} y={-56} width={16} height={52} rx={5} fill="#C9A227" stroke={INK} strokeWidth={2.4} />
    <rect x={64} y={-56} width={16} height={52} rx={5} fill="#C9A227" stroke={INK} strokeWidth={2.4} />
  </g>
);

/** radial burst lines for a pop. origin at the centre. t 0..1 */
export const Burst: React.FC<{r: number; t: number; color?: string; n?: number}> = ({r, t, color = INK, n = 14}) => {
  if (t <= 0 || t >= 1) return null;
  const e = 1 - (1 - t) * (1 - t);
  return (
    <g opacity={1 - t * t}>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + 0.2;
        const r0 = r * (0.6 + e * 0.9);
        const r1 = r0 + r * 0.45 * (1 - t);
        return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke={color} strokeWidth={7} strokeLinecap="round" />;
      })}
    </g>
  );
};

/** fee staircase: n steps going down to the right. origin at the top-left corner of the first step */
export const Stairs: React.FC<{n: number; sw: number; sh: number; labels: string[]; show: number; fg: string}> = ({n, sw, sh, labels, show, fg}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const o = clamp01(show * n - i);
      if (o <= 0) return null;
      const x = i * sw;
      const y = i * sh;
      const depth = (n - i) * sh;
      return (
        <g key={i} opacity={o}>
          <rect x={x} y={y} width={sw} height={depth} fill={i === n - 1 ? GREEN : CREAM} stroke={INK} strokeWidth={LW} />
          <text x={x + sw / 2} y={y + 38} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} letterSpacing={2} fill={i === n - 1 ? INK : fg}>
            {labels[i]}
          </text>
        </g>
      );
    })}
  </g>
);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
