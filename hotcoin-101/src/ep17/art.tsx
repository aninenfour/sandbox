import React from 'react';
import {FONT, GREEN, INK, PAPER, RED} from '../notebook/tokens';

// FILE 017 illustrations: ink line, flat fills, origin at the centre unless noted.

const LW = 3;
export const CREAM = '#F3E9D2';
export const CREAM_DK = '#DCCBA6';
export const GOLD = '#E3B341';
export const BTC = '#F2A33A';
export const SLATE = '#5E7C8E';

/** a bond certificate, w x h, centred. draw 0..1 writes the border on */
export const BondCert: React.FC<{w?: number; h?: number; amount?: string; grey?: number}> = ({w = 560, h = 360, amount = '$1,000', grey = 0}) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={CREAM} stroke={INK} strokeWidth={LW} />
    <rect x={-w / 2 + 18} y={-h / 2 + 18} width={w - 36} height={h - 36} rx={6} fill="none" stroke={CREAM_DK} strokeWidth={6} />
    <rect x={-w / 2 + 30} y={-h / 2 + 30} width={w - 60} height={h - 60} rx={4} fill="none" stroke={INK} strokeWidth={1.4} strokeDasharray="2 6" opacity={0.5} />
    <text x={0} y={-h / 2 + 96} textAnchor="middle" fontFamily={FONT.display} fontSize={h * 0.2} letterSpacing={h * 0.03} fill={INK}>
      BOND
    </text>
    <text x={0} y={-h / 2 + 128} textAnchor="middle" fontFamily={FONT.mono} fontSize={h * 0.05} letterSpacing={3} fill={INK} opacity={0.6}>
      GOVERNMENT · 10 YEARS
    </text>
    <text x={-w / 2 + 60} y={h / 2 - 60} fontFamily={FONT.display} fontSize={h * 0.2} fill={INK}>
      {amount}
    </text>
    <g transform={`translate(${w / 2 - 92} ${h / 2 - 92})`}>
      <circle r={46} fill={RED} opacity={0.85} />
      <circle r={36} fill="none" stroke={PAPER} strokeWidth={2} strokeDasharray="4 4" />
    </g>
    {grey > 0 && <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#9A9890" opacity={grey * 0.45} />}
  </g>
);

/** small house, origin at the floor middle */
export const House: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <rect x={-60} y={-80} width={120} height={80} fill={PAPER} stroke={INK} strokeWidth={LW} />
    <path d="M -76 -78 L 0 -140 L 76 -78 Z" fill={RED} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <rect x={-16} y={-44} width={32} height={44} fill={SLATE} stroke={INK} strokeWidth={2.4} />
    <rect x={-48} y={-62} width={24} height={22} fill="#C9D6DD" stroke={INK} strokeWidth={2} />
    <rect x={24} y={-62} width={24} height={22} fill="#C9D6DD" stroke={INK} strokeWidth={2} />
  </g>
);

/** a stock chart card, centred */
export const StockCard: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <rect x={-80} y={-60} width={160} height={120} rx={12} fill={PAPER} stroke={INK} strokeWidth={LW} />
    <path d="M -58 30 L -30 6 L -6 18 L 22 -18 L 56 -36" stroke={GREEN} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    <line x1={-60} y1={42} x2={60} y2={42} stroke={INK} strokeWidth={2} opacity={0.4} />
  </g>
);

/** a gold bar, centred */
export const GoldBar: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M -70 30 L -48 -26 L 48 -26 L 70 30 Z" fill={GOLD} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M -48 -26 L -36 -10 L 36 -10 L 48 -26" fill="none" stroke={INK} strokeWidth={1.6} opacity={0.5} />
  </g>
);

/** a coin marked BTC, centred */
export const BtcCoin: React.FC<{r?: number}> = ({r = 56}) => (
  <g>
    <circle r={r} fill={BTC} stroke={INK} strokeWidth={LW} />
    <circle r={r * 0.78} fill="none" stroke={INK} strokeWidth={1.6} opacity={0.4} />
    <text x={0} y={r * 0.22} textAnchor="middle" fontFamily={FONT.display} fontSize={r * 0.62} fill={INK}>
      BTC
    </text>
  </g>
);

/** high-jump stand: two posts at +-span/2 on the floor (origin), crossbar at height h */
export const HighJump: React.FC<{span: number; post: number; h: number; glow?: number; label?: string; ground?: 'paper' | 'ink'}> = ({span, post, h, glow = 0, label, ground = 'ink'}) => {
  const fg = ground === 'ink' ? PAPER : INK;
  return (
    <g>
      {[-1, 1].map((k) => (
        <g key={k}>
          <rect x={(k * span) / 2 - 7} y={-post} width={14} height={post} rx={4} fill={fg} opacity={0.85} />
          <rect x={(k * span) / 2 - 26} y={-8} width={52} height={10} rx={4} fill={fg} opacity={0.85} />
        </g>
      ))}
      {glow > 0 && <rect x={-span / 2} y={-h - 18} width={span} height={36} rx={18} fill={GREEN} opacity={0.25 * glow} />}
      <rect x={-span / 2 - 10} y={-h - 8} width={span + 20} height={16} rx={8} fill={GREEN} stroke={INK} strokeWidth={2} />
      {label && (
        <text x={0} y={-h - 30} textAnchor="middle" fontFamily={FONT.mono} fontSize={20} letterSpacing={3} fill={fg} opacity={0.8}>
          {label}
        </text>
      )}
    </g>
  );
};
