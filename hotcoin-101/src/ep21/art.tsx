import React from 'react';
import {FONT, GREEN, INK, PAPER, RED} from '../notebook/tokens';

// FILE 021 illustrations: ink line, flat fills.

const LW = 3;
export const RUG_RED = '#B8433A';
export const RUG_GOLD = '#E3B341';
export const WATER = '#7FB7D6';
export const WATER_DK = '#5E97B8';
export const WOOD = '#B98A5A';
export const CREAM = '#F3E9D2';
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** a comic speech bubble holding one big word. centred, tail at the bottom left */
export const Bubble: React.FC<{w: number; h: number; text: string; size: number; fill?: string; ink?: string; ring?: string}> = ({w, h, text, size, fill = PAPER, ink = INK, ring = INK}) => (
  <g>
    <path
      d={`M ${-w / 2 + 30} ${-h / 2} H ${w / 2 - 30} Q ${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + 30} V ${h / 2 - 30} Q ${w / 2} ${h / 2} ${w / 2 - 30} ${h / 2} H ${-w / 2 + 110} L ${-w / 2 + 50} ${h / 2 + 50} L ${-w / 2 + 70} ${h / 2} H ${-w / 2 + 30} Q ${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - 30} V ${-h / 2 + 30} Q ${-w / 2} ${-h / 2} ${-w / 2 + 30} ${-h / 2} Z`}
      fill={fill}
      stroke={ring}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={FONT.display} fontSize={size} fill={ink}>
      {text}
    </text>
  </g>
);

/** caution triangle with an exclamation mark. origin at its centre */
export const Caution: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M 0 -46 L 50 40 L -50 40 Z" fill={RUG_GOLD} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-5} y={-18} width={10} height={36} rx={4} fill={INK} />
    <circle cx={0} cy={28} r={6} fill={INK} />
  </g>
);

/** a diving board on a post. origin at the top of the board's left end */
export const DivingBoard: React.FC<{len: number; bend?: number}> = ({len, bend = 0}) => (
  <g>
    <rect x={-30} y={0} width={60} height={260} rx={6} fill="#8A9399" stroke={INK} strokeWidth={LW} />
    <path d={`M -40 0 L ${len - 30} ${bend} Q ${len} ${bend} ${len} ${bend + 10} L ${len} ${bend + 20} L -40 20 Z`} fill={WOOD} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
  </g>
);

/** a pool seen from the side: water block with waves. origin at the top-left of the water */
export const Pool: React.FC<{w: number; h: number; t: number}> = ({w, h, t}) => {
  const n = 12;
  const wave = Array.from({length: n + 1})
    .map((_, i) => `${i ? 'L' : 'M'} ${(i / n) * w} ${Math.sin(i * 1.3 + t * 0.15) * 6}`)
    .join(' ');
  return (
    <g>
      <rect x={-14} y={-6} width={w + 28} height={h + 20} rx={10} fill="#D8DEE2" stroke={INK} strokeWidth={LW} />
      <path d={`${wave} L ${w} ${h} L 0 ${h} Z`} fill={WATER} />
      <path d={wave} stroke={WATER_DK} strokeWidth={5} fill="none" />
    </g>
  );
};

/** splash ring and drops. origin on the water surface. t 0..1 */
export const Splash: React.FC<{t: number; s?: number}> = ({t, s = 1}) => {
  if (t <= 0 || t >= 1) return null;
  const e = 1 - (1 - t) * (1 - t);
  return (
    <g transform={`scale(${s})`} opacity={1 - t}>
      <ellipse cx={0} cy={0} rx={30 + e * 70} ry={8 + e * 12} fill="none" stroke={PAPER} strokeWidth={5} />
      {[-1, -0.4, 0.4, 1].map((k, i) => (
        <circle key={i} cx={k * 50 * e} cy={-90 * Math.sin(Math.PI * e) * (1 - Math.abs(k) * 0.3)} r={9} fill={PAPER} />
      ))}
    </g>
  );
};

/** a long patterned rug. origin at its top-left; height is its thickness */
export const Rug: React.FC<{w: number; h?: number}> = ({w, h = 24}) => (
  <g>
    <rect x={0} y={0} width={w} height={h} rx={4} fill={RUG_RED} stroke={INK} strokeWidth={LW} />
    {Array.from({length: Math.floor(w / 60)}).map((_, i) => (
      <path key={i} d={`M ${30 + i * 60} 4 L ${40 + i * 60} ${h / 2} L ${30 + i * 60} ${h - 4} L ${20 + i * 60} ${h / 2} Z`} fill={RUG_GOLD} />
    ))}
    {Array.from({length: 6}).map((_, i) => (
      <line key={i} x1={w + 2} y1={3 + i * (h - 6) / 5} x2={w + 16} y2={3 + i * (h - 6) / 5} stroke={RUG_GOLD} strokeWidth={3} strokeLinecap="round" />
    ))}
  </g>
);

/** chart on an easel. origin at the bottom of the legs. rise 0..1 draws the line, crash 0..1 drops it */
export const Easel: React.FC<{w: number; h: number; rise: number; crash: number}> = ({w, h, rise, crash}) => {
  const pts = Array.from({length: 9}).map((_, i) => ({x: -w / 2 + 24 + (i / 8) * (w - 48), y: -h - 60 + (h - 30) - (i / 8) ** 1.8 * (h - 60) + (i % 2 ? 6 : 0)}));
  const shown = pts.slice(0, Math.max(1, Math.round(rise * pts.length)));
  const last = shown[shown.length - 1];
  const crashY = -60 - 20;
  return (
    <g>
      <line x1={-w / 3} y1={0} x2={0} y2={-h - 60} stroke={INK} strokeWidth={6} />
      <line x1={w / 3} y1={0} x2={0} y2={-h - 60} stroke={INK} strokeWidth={6} />
      <rect x={-w / 2} y={-h - 70} width={w} height={h} rx={8} fill={PAPER} stroke={INK} strokeWidth={LW} />
      <path d={shown.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ')} stroke={GREEN} strokeWidth={7} fill="none" strokeLinejoin="round" />
      {crash > 0 && <line x1={last.x} y1={last.y} x2={last.x + 6} y2={last.y + (crashY - last.y) * crash} stroke={RED} strokeWidth={7} strokeLinecap="round" />}
    </g>
  );
};

/** a padlock. origin at its centre */
export const Lock: React.FC<{s?: number; color?: string}> = ({s = 1, color = RED}) => (
  <g transform={`scale(${s})`}>
    <path d="M -18 -6 V -22 Q -18 -42 0 -42 Q 18 -42 18 -22 V -6" stroke={INK} strokeWidth={7} fill="none" />
    <rect x={-28} y={-8} width={56} height={44} rx={8} fill={color} stroke={INK} strokeWidth={LW} />
    <circle cx={0} cy={12} r={6} fill={INK} />
  </g>
);

/** a small brown wallet with a dollar sign. origin at its centre */
export const Wallet: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <rect x={-36} y={-24} width={72} height={48} rx={10} fill="#8A5A34" stroke={INK} strokeWidth={LW} />
    <rect x={10} y={-10} width={30} height={20} rx={6} fill="#A86B3C" stroke={INK} strokeWidth={2.4} />
    <text x={-10} y={11} textAnchor="middle" fontFamily={FONT.display} fontSize={30} fill={RUG_GOLD}>
      $
    </text>
  </g>
);

/** a slot machine. origin at its bottom centre. reels: offset per reel (in symbols), lever 0..1 pulled */
export const SYMBOLS = ['APE', 'RUG', '$', '7', 'RUG', 'DEGEN'];
export const Slot: React.FC<{w: number; h: number; reels: number[]; lever: number; lit: number; t: number}> = ({w, h, reels, lever, lit, t}) => {
  const rw = (w - 100) / 3;
  const rh = 150;
  const top = -h + 150;
  return (
    <g>
      <rect x={-w / 2} y={-h} width={w} height={h} rx={34} fill={RED} stroke={INK} strokeWidth={LW} />
      <rect x={-w / 2 + 30} y={-h - 70} width={w - 60} height={90} rx={22} fill={INK} stroke={INK} strokeWidth={LW} />
      {Array.from({length: 9}).map((_, i) => (
        <circle key={i} cx={-w / 2 + 60 + i * ((w - 120) / 8)} cy={-h - 25} r={9} fill={lit > 0 && (i + Math.floor(t / 4)) % 2 ? RUG_GOLD : '#5A4A2A'} />
      ))}
      <text x={0} y={-h - 2} textAnchor="middle" fontFamily={FONT.display} fontSize={46} fill={lit > 0 ? RUG_GOLD : PAPER} opacity={0.4 + 0.6 * lit}>
        DEGEN
      </text>
      <rect x={-w / 2 + 30} y={top - 20} width={w - 60} height={rh + 40} rx={16} fill={INK} />
      {reels.map((off, k) => {
        const x = -w / 2 + 50 + k * rw;
        return (
          <g key={k}>
            <clipPath id={`reel${k}`}>
              <rect x={x} y={top} width={rw - 10} height={rh} rx={10} />
            </clipPath>
            <rect x={x} y={top} width={rw - 10} height={rh} rx={10} fill={CREAM} />
            <g clipPath={`url(#reel${k})`}>
              {[-1, 0, 1].map((j) => {
                const base = Math.floor(off);
                const frac = off - base;
                const idx = (((base + j) % SYMBOLS.length) + SYMBOLS.length) % SYMBOLS.length;
                const sy = top + rh / 2 + (j - frac) * rh;
                const sym = SYMBOLS[idx];
                return (
                  <text key={j} x={x + (rw - 10) / 2} y={sy + 26} textAnchor="middle" fontFamily={FONT.display} fontSize={sym.length > 3 ? 50 : 74} fill={sym === 'RUG' ? RED : INK}>
                    {sym}
                  </text>
                );
              })}
            </g>
          </g>
        );
      })}
      <rect x={-w / 2 + 60} y={-130} width={w - 120} height={60} rx={12} fill="#7A2A24" stroke={INK} strokeWidth={LW} />
      <g transform={`translate(${w / 2} ${-h + 210})`}>
        <rect x={0} y={-14} width={34} height={60} rx={8} fill="#8A9399" stroke={INK} strokeWidth={LW} />
        <g transform={`rotate(${lever * 150 - 20} 17 16)`}>
          <line x1={17} y1={16} x2={17} y2={-150} stroke="#C9CED3" strokeWidth={12} strokeLinecap="round" />
          <circle cx={17} cy={-160} r={26} fill={RED} stroke={INK} strokeWidth={LW} />
        </g>
      </g>
    </g>
  );
};

/** name badge pinned on: a little rounded label. centred */
export const NameTag: React.FC<{text: string; s?: number}> = ({text, s = 1}) => (
  <g transform={`scale(${s}) rotate(-8)`}>
    <rect x={-70} y={-24} width={140} height={48} rx={10} fill={RUG_GOLD} stroke={INK} strokeWidth={LW} />
    <text x={0} y={12} textAnchor="middle" fontFamily={FONT.display} fontSize={32} fill={INK}>
      {text}
    </text>
  </g>
);

export {clamp01};
