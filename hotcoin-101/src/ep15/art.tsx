import React from 'react';
import {FONT, GREEN, INK, PAPER} from '../notebook/tokens';

// FILE 015 illustrations: ink line, flat fills, origin at the centre.

const LW = 3;
export const WHALE = '#5E7C8E';
export const WHALE_BELLY = '#C9D6DD';
export const SHRIMP = '#F2A285';
export const BAG = '#D9C08F';

// Whale, side view facing right. ~520 x 220 at s=1. smile 0..1 curls the mouth.
export const Whale: React.FC<{tail?: number; smile?: number}> = ({tail = 0, smile = 0}) => (
  <g>
    {/* tail flukes, rotate around the tail stock */}
    <g transform={`rotate(${tail} -230 -10)`}>
      <path d="M -230 -10 C -270 -30, -300 -70, -320 -100 C -290 -80, -262 -66, -244 -40 C -262 -20, -290 10, -330 30 C -296 24, -262 10, -230 -10 Z" fill={WHALE} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    </g>
    <path
      d="M -235 -12 C -180 -60, -60 -110, 70 -104 C 170 -100, 250 -60, 262 4 C 268 50, 220 92, 120 100 C 10 108, -110 80, -190 30 Z"
      fill={WHALE}
      stroke={INK}
      strokeWidth={LW}
      strokeLinejoin="round"
    />
    <path d="M -150 50 C -40 98, 120 104, 236 54 C 210 88, 150 100, 100 102 C 0 108, -100 86, -150 50 Z" fill={WHALE_BELLY} stroke={INK} strokeWidth={2} />
    {[-60, -10, 40, 90, 140].map((x) => (
      <line key={x} x1={x} y1={70} x2={x + 26} y2={98} stroke={INK} strokeWidth={1.6} opacity={0.45} />
    ))}
    <path d={`M 150 40 Q 205 ${44 + smile * 22} 246 ${28 - smile * 6}`} stroke={INK} strokeWidth={LW} fill="none" strokeLinecap="round" />
    <circle cx={172} cy={4} r={11} fill={INK} />
    <circle cx={175} cy={0} r={3.5} fill="#fff" />
    <path d="M -40 -98 C -30 -130, 0 -140, 20 -128 C 4 -120, -10 -110, -14 -100 Z" fill={WHALE} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
  </g>
);

// Shrimp, facing right, ~110 x 70 at s=1
export const Shrimp: React.FC<{flick?: number}> = ({flick = 0}) => (
  <g>
    <path d="M 30 -10 C 70 -40, 110 -46, 140 -60" stroke={INK} strokeWidth={1.8} fill="none" />
    <path d="M 34 -6 C 70 -20, 110 -18, 136 -30" stroke={INK} strokeWidth={1.8} fill="none" />
    <path
      d="M 44 0 C 40 -26, 10 -36, -18 -30 C -44 -24, -60 -2, -52 20 C -46 34, -30 40, -18 34 C -30 26, -34 12, -26 2 C -16 -8, 6 -8, 20 4 C 28 12, 40 12, 44 0 Z"
      fill={SHRIMP}
      stroke={INK}
      strokeWidth={2.4}
      strokeLinejoin="round"
    />
    {[-30, -12, 6, 22].map((x, i) => (
      <path key={i} d={`M ${x} -28 Q ${x + 6} -14 ${x - 2} ${i < 2 ? 4 : -2}`} stroke={INK} strokeWidth={1.4} fill="none" opacity={0.6} />
    ))}
    <g transform={`rotate(${flick} -46 26)`}>
      <path d="M -46 26 L -70 42 L -58 22 Z" fill={SHRIMP} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
    </g>
    <circle cx={34} cy={-12} r={4} fill={INK} />
  </g>
);

// Money bag with a $ mark, origin bottom middle. s scales.
export const MoneyBag: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M -56 0 Q -72 -70, -34 -108 L -22 -122 Q 0 -112, 22 -122 L 34 -108 Q 72 -70, 56 0 Z" fill={BAG} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M -26 -116 Q 0 -100, 26 -116" stroke={INK} strokeWidth={4} fill="none" />
    <text y={-34} textAnchor="middle" fontFamily={FONT.display} fontSize={56} fill={INK}>
      $
    </text>
  </g>
);

// Wallet, origin centre
export const Wallet: React.FC<{w?: number; label?: string}> = ({w = 260, label}) => {
  const h = w * 0.64;
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill="#3B4248" stroke={INK} strokeWidth={LW} />
      <rect x={w * 0.12} y={-h * 0.16} width={w * 0.42} height={h * 0.32} rx={12} fill="#5B636B" stroke={INK} strokeWidth={2.4} />
      <circle cx={w * 0.26} cy={0} r={h * 0.06} fill={GREEN} />
      {label && (
        <text y={h / 2 + 40} textAnchor="middle" fontFamily={FONT.mono} fontSize={20} letterSpacing={3} fill={PAPER}>
          {label}
        </text>
      )}
    </g>
  );
};

// Clock face, origin centre. t turns the hand.
export const Clock: React.FC<{r?: number; t?: number}> = ({r = 40, t = 0}) => (
  <g>
    <circle r={r} fill={PAPER} stroke={INK} strokeWidth={LW} />
    {Array.from({length: 12}).map((_, i) => (
      <line key={i} x1={0} y1={-r * 0.82} x2={0} y2={-r * 0.68} transform={`rotate(${i * 30})`} stroke={INK} strokeWidth={2} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-r * 0.62} transform={`rotate(${t * 360})`} stroke={INK} strokeWidth={3} strokeLinecap="round" />
    <line x1={0} y1={0} x2={r * 0.4} y2={0} transform={`rotate(${t * 30})`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
    <circle r={4} fill={INK} />
  </g>
);

// Specimen card frame for the field-guide cold open. origin centre.
export const Card: React.FC<{w: number; h: number; draw?: number}> = ({w, h, draw = 1}) => {
  const per = 2 * (w + h);
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill="rgba(255,255,255,0.35)" opacity={Math.min(1, draw * 2)} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill="none" stroke={INK} strokeWidth={2} strokeDasharray={per} strokeDashoffset={per * (1 - Math.min(1, draw))} />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
        <path key={i} d={`M ${sx * (w / 2 - 4)} ${sy * (h / 2 - 22)} L ${sx * (w / 2 - 4)} ${sy * (h / 2 - 4)} L ${sx * (w / 2 - 22)} ${sy * (h / 2 - 4)}`} stroke={INK} strokeWidth={3.4} fill="none" opacity={Math.min(1, draw * 2)} />
      ))}
    </g>
  );
};
