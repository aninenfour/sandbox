import React from 'react';
import {FONT, GREEN, GREEN_DEEP, INK, PAPER, RED} from '../notebook/tokens';

// FILE 014 illustrations. Same rules as 013: ink line, flat fills, origin at
// the object's own centre unless noted.

const LW = 3;
export const BILL = '#DCE5CF';
export const BILL_DK = '#A9BC95';
export const SILVER = '#C9CED3';
export const GOLD = '#E3B341';
export const STEEL = '#5B636B';

// A stablecoin: one coin, one dollar
export const StableToken: React.FC<{r?: number; label?: string; red?: number}> = ({r = 52, label = '$1', red = 0}) => (
  <g>
    <circle r={r} fill="#FFFFFF" stroke={INK} strokeWidth={LW} />
    <circle r={r * 0.84} fill="none" stroke={red > 0.5 ? RED : GREEN} strokeWidth={r * 0.13} />
    <circle r={r * 0.66} fill="none" stroke={INK} strokeWidth={1.2} strokeDasharray="3 4" opacity={0.5} />
    <text y={r * 0.2} textAnchor="middle" fontFamily={FONT.display} fontSize={r * 0.62} fill={INK}>
      {label}
    </text>
  </g>
);

// Generic dollar bill (stylised, not a real note)
export const DollarBill: React.FC<{w?: number; h?: number}> = ({w = 190, h = 88}) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={4} fill={BILL} stroke={INK} strokeWidth={2.6} />
    <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h - 16} fill="none" stroke={BILL_DK} strokeWidth={2} />
    <ellipse cx={0} cy={0} rx={h * 0.3} ry={h * 0.34} fill="none" stroke={INK} strokeWidth={1.8} />
    <text y={h * 0.13} textAnchor="middle" fontFamily={FONT.display} fontSize={h * 0.36} fill={INK}>
      $1
    </text>
    <text x={-w / 2 + 18} y={-h / 2 + 30} fontFamily={FONT.display} fontSize={h * 0.24} fill={INK} opacity={0.7}>
      1
    </text>
    <text x={w / 2 - 28} y={h / 2 - 14} fontFamily={FONT.display} fontSize={h * 0.24} fill={INK} opacity={0.7}>
      1
    </text>
  </g>
);

// Safe, origin at the bottom middle. door 0 = shut, 1 = open
export const Safe: React.FC<{s?: number; door?: number; children?: React.ReactNode}> = ({s = 220, door = 0, children}) => {
  const d = Math.max(0, Math.min(1, door));
  return (
    <g>
      <rect x={-s / 2} y={-s} width={s} height={s} rx={10} fill={STEEL} stroke={INK} strokeWidth={LW} />
      <rect x={-s / 2 + 18} y={-s + 18} width={s - 36} height={s - 36} rx={6} fill="#24282C" stroke={INK} strokeWidth={2} />
      <g>{children}</g>
      {/* door swings toward the viewer: drawn as a narrowing panel */}
      <g transform={`translate(${-s / 2 + 18} 0) scale(${1 - d * 0.92} 1)`}>
        <rect x={0} y={-s + 18} width={s - 36} height={s - 36} rx={6} fill="#737C85" stroke={INK} strokeWidth={2.4} />
        <circle cx={(s - 36) * 0.62} cy={-s / 2} r={s * 0.14} fill="#9AA3AB" stroke={INK} strokeWidth={2.4} />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <line
            key={a}
            x1={(s - 36) * 0.62}
            y1={-s / 2}
            x2={(s - 36) * 0.62 + Math.cos((a * Math.PI) / 180) * s * 0.12}
            y2={-s / 2 + Math.sin((a * Math.PI) / 180) * s * 0.12}
            stroke={INK}
            strokeWidth={1.4}
          />
        ))}
        <rect x={(s - 36) * 0.18} y={-s / 2 - 8} width={s * 0.12} height={16} rx={4} fill={INK} />
      </g>
      <rect x={-s / 2 + 12} y={-8} width={s * 0.14} height={14} fill={INK} />
      <rect x={s / 2 - 12 - s * 0.14} y={-8} width={s * 0.14} height={14} fill={INK} />
    </g>
  );
};

// Coat-check kiosk, front view: a dark serving hatch, a counter and an
// awning. origin at floor under the hatch.
export const Booth: React.FC<{h?: number; win?: number; kw?: number}> = ({h = 520, win = 200, kw = 360}) => {
  const stripes = 8;
  const sw = (kw + 40) / stripes;
  return (
    <g>
      <rect x={-kw / 2} y={-h} width={kw} height={h} fill={PAPER} stroke={INK} strokeWidth={LW} />
      <rect x={-kw / 2 + 14} y={-h + 60} width={kw - 28} height={h - 74} fill="none" stroke={INK} strokeWidth={1.2} opacity={0.35} />
      <rect x={-110} y={-120 - win} width={220} height={win} rx={6} fill="#2A2C2F" stroke={INK} strokeWidth={LW} />
      <rect x={-140} y={-128} width={280} height={18} rx={3} fill="#9A6B43" stroke={INK} strokeWidth={LW} />
      {Array.from({length: stripes}).map((_, i) => (
        <path
          key={i}
          d={`M ${-kw / 2 - 20 + i * sw} ${-h} L ${-kw / 2 - 20 + (i + 1) * sw} ${-h} L ${-kw / 2 - 20 + (i + 1) * sw} ${-h + 46} Q ${-kw / 2 - 20 + (i + 0.5) * sw} ${-h + 66} ${-kw / 2 - 20 + i * sw} ${-h + 46} Z`}
          fill={i % 2 ? PAPER : GREEN}
          stroke={INK}
          strokeWidth={2}
        />
      ))}
      <rect x={-kw / 2 + 20} y={-h - 72} width={kw - 40} height={56} rx={6} fill={INK} />
      <text y={-h - 36} textAnchor="middle" fontFamily={FONT.mono} fontSize={22} letterSpacing={4} fill={PAPER}>
        COAT CHECK
      </text>
    </g>
  );
};

// Balance scale. origin at the pivot. Returns pan positions via panAt().
export const BEAM = 300;
export const panAt = (tilt: number, side: -1 | 1, beam = BEAM, hang = 150) => {
  const a = (tilt * Math.PI) / 180;
  return {x: side * beam * Math.cos(a), y: side * beam * Math.sin(a) + hang};
};
export const Scale: React.FC<{tilt: number; beam?: number; hang?: number; post?: number}> = ({tilt, beam = BEAM, hang = 150, post = 330}) => {
  const a = (tilt * Math.PI) / 180;
  const ends = [-1, 1].map((s) => ({x: s * beam * Math.cos(a), y: s * beam * Math.sin(a)}));
  return (
    <g>
      <rect x={-12} y={0} width={24} height={post} fill={PAPER} stroke={INK} strokeWidth={LW} />
      <path d={`M -110 ${post} L 110 ${post} L 80 ${post - 26} L -80 ${post - 26} Z`} fill={PAPER} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
      <path d="M -26 10 L 0 -24 L 26 10 Z" fill={INK} />
      <line x1={ends[0].x} y1={ends[0].y} x2={ends[1].x} y2={ends[1].y} stroke={INK} strokeWidth={LW * 2.4} strokeLinecap="round" />
      {ends.map((e, i) => (
        <g key={i}>
          <line x1={e.x} y1={e.y} x2={e.x - 70} y2={e.y + hang} stroke={INK} strokeWidth={1.8} />
          <line x1={e.x} y1={e.y} x2={e.x + 70} y2={e.y + hang} stroke={INK} strokeWidth={1.8} />
          <path d={`M ${e.x - 96} ${e.y + hang} Q ${e.x} ${e.y + hang + 46} ${e.x + 96} ${e.y + hang} Z`} fill={PAPER} stroke={INK} strokeWidth={LW} />
        </g>
      ))}
      <circle r={9} fill={PAPER} stroke={INK} strokeWidth={LW} />
    </g>
  );
};

// A volatile crypto token (generic hexagon mark, not any real logo)
export const CryptoToken: React.FC<{r?: number}> = ({r = 26}) => {
  const hex = Array.from({length: 6}).map((_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return `${Math.cos(a) * r * 0.55},${Math.sin(a) * r * 0.55}`;
  });
  return (
    <g>
      <circle r={r} fill={SILVER} stroke={INK} strokeWidth={2.4} />
      <polygon points={hex.join(' ')} fill="none" stroke={INK} strokeWidth={2.4} />
      <circle r={r * 0.16} fill={INK} />
    </g>
  );
};

// The sister token in the formula
export const LunaToken: React.FC<{r?: number; crack?: number}> = ({r = 60, crack = 0}) => (
  <g>
    <circle r={r} fill={GOLD} stroke={INK} strokeWidth={LW} />
    <circle r={r * 0.78} fill="none" stroke={INK} strokeWidth={1.4} opacity={0.5} />
    <text y={r * 0.14} textAnchor="middle" fontFamily={FONT.mono} fontWeight={500} fontSize={r * 0.34} letterSpacing={2} fill={INK}>
      LUNA
    </text>
    {crack > 0 && (
      <path
        d={`M ${-r * 0.2} ${-r} L ${r * 0.05} ${-r * 0.4} L ${-r * 0.15} ${-r * 0.05} L ${r * 0.2} ${r * 0.4} L 0 ${r}`}
        stroke={INK}
        strokeWidth={3}
        fill="none"
        strokeDasharray={r * 2.4}
        strokeDashoffset={r * 2.4 * (1 - Math.min(1, crack))}
      />
    )}
  </g>
);

// Seesaw: origin at the fulcrum tip. broken 0..1 snaps the plank in the middle.
export const Seesaw: React.FC<{angle: number; broken?: number; len?: number}> = ({angle, broken = 0, len = 300}) => {
  const b = Math.max(0, Math.min(1, broken));
  return (
    <g>
      <path d="M 0 0 L 70 120 L -70 120 Z" fill={PAPER} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
      <line x1={-140} y1={120} x2={140} y2={120} stroke={INK} strokeWidth={LW} />
      {[-1, 1].map((side) => (
        <g key={side} transform={`rotate(${angle + side * b * 38} 0 -6) translate(${side * b * 14} ${b * 40})`}>
          <rect x={side < 0 ? -len : 6} y={-16} width={len - 6} height={20} rx={4} fill="#9A6B43" stroke={INK} strokeWidth={LW} />
        </g>
      ))}
    </g>
  );
};

// A rubber stamp mark
export const Stamp: React.FC<{text: string; w?: number; color?: string}> = ({text, w = 200, color = RED}) => (
  <g>
    <rect x={-w / 2} y={-34} width={w} height={68} rx={8} fill="none" stroke={color} strokeWidth={6} />
    <text y={18} textAnchor="middle" fontFamily={FONT.display} fontSize={50} letterSpacing={4} fill={color}>
      {text}
    </text>
  </g>
);

// Pedestals for the closing comparison. origin at floor middle.
export const Pedestal: React.FC<{kind: 'cash' | 'crypto' | 'formula'; h?: number; w?: number}> = ({kind, h = 220, w = 200}) => {
  if (kind === 'formula')
    return (
      <g>
        <rect x={-w / 2} y={-h} width={w} height={h} fill="none" stroke={INK} strokeWidth={LW} strokeDasharray="12 10" opacity={0.7} />
        <text y={-h / 2 + 18} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={54} fill={INK} opacity={0.7}>
          f(x)
        </text>
      </g>
    );
  if (kind === 'crypto')
    return (
      <g>
        {Array.from({length: 7}).map((_, i) => (
          <g key={i} transform={`translate(${(i % 2 ? 1 : -1) * 6} ${-26 - i * 28})`}>
            <rect x={-w / 2 + 20} y={-12} width={w - 40} height={26} rx={12} fill={SILVER} stroke={INK} strokeWidth={2.2} />
          </g>
        ))}
      </g>
    );
  return (
    <g>
      <rect x={-w / 2} y={-h} width={w} height={h} rx={8} fill={STEEL} stroke={INK} strokeWidth={LW} />
      <rect x={-w / 2 + 16} y={-h + 16} width={w - 32} height={h - 32} rx={6} fill="#737C85" stroke={INK} strokeWidth={2} />
      <circle cx={w * 0.14} cy={-h / 2} r={w * 0.14} fill="#9AA3AB" stroke={INK} strokeWidth={2.4} />
      <rect x={-w * 0.3} y={-h / 2 - 7} width={w * 0.2} height={14} rx={4} fill={INK} />
    </g>
  );
};

export const GREEN_INK = GREEN_DEEP;
