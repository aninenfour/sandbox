import React from 'react';
import {GREEN, INK, PAPER, RED} from '../notebook/tokens';

// Notebook illustrations for FILE 013. Ink line, flat fills, one material
// colour each (iron, parchment, vermilion, silver, copper). Every piece is
// drawn around its own origin so scenes place it with x, y, scale.

export const IRON = '#4B5157';
export const IRON_HI = '#6C737A';
export const PARCH = '#F2E2BF';
export const PARCH_DK = '#DCC698';
export const VERMILION = '#C7372C';
export const COPPER = '#B8703E';
export const COPPER_HI = '#D8935E';
export const SILVER = '#C9CED3';
export const SILVER_DK = '#8E959C';
export const WOOD = '#9A6B43';

const LW = 3;

type P = {x: number; y: number; s?: number; rot?: number; o?: number; children?: React.ReactNode};
export const At: React.FC<P> = ({x, y, s = 1, rot = 0, o = 1, children}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    {children}
  </g>
);

// Chinese cash coin: round, square hole
export const Coin: React.FC<{r?: number; fill?: string; ink?: string}> = ({r = 22, fill = IRON, ink = INK}) => (
  <g>
    <circle r={r} fill={fill} stroke={ink} strokeWidth={LW * 0.8} />
    <circle r={r * 0.78} fill="none" stroke={IRON_HI} strokeWidth={1.4} opacity={0.7} />
    <rect x={-r * 0.26} y={-r * 0.26} width={r * 0.52} height={r * 0.52} fill={PAPER} stroke={ink} strokeWidth={LW * 0.7} />
  </g>
);

// A string of cash coins seen side-on: a sagging cord of stacked coins
export const CoinString: React.FC<{len?: number; sag?: number}> = ({len = 150, sag = 16}) => {
  const n = Math.round(len / 9);
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const t = i / (n - 1);
        const x = -len / 2 + t * len;
        const y = sag * 4 * t * (1 - t);
        return <rect key={i} x={x - 4.5} y={y - 15} width={9} height={30} rx={4} fill={i % 2 ? IRON : IRON_HI} stroke={INK} strokeWidth={1.6} />;
      })}
      <path d={`M ${-len / 2 - 14} -6 Q ${-len / 2 - 22} -20 ${-len / 2 - 6} -14`} stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d={`M ${len / 2 + 14} -6 Q ${len / 2 + 22} -20 ${len / 2 + 6} -14`} stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </g>
  );
};

// Handcart, origin at the middle of the bed. `spin` turns the wheels.
export const Cart: React.FC<{spin?: number}> = ({spin = 0}) => (
  <g>
    <path d="M -210 0 L 210 0 L 196 70 L -196 70 Z" fill={WOOD} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    {[-140, -70, 0, 70, 140].map((x) => (
      <line key={x} x1={x} y1={6} x2={x * 0.97} y2={66} stroke={INK} strokeWidth={1.6} opacity={0.45} />
    ))}
    <line x1={-210} y1={10} x2={-330} y2={-40} stroke={INK} strokeWidth={LW * 2} strokeLinecap="round" />
    <line x1={-330} y1={-40} x2={-352} y2={-40} stroke={INK} strokeWidth={LW * 2} strokeLinecap="round" />
    {[-120, 120].map((x) => (
      <g key={x} transform={`translate(${x} 104)`}>
        <circle r={52} fill={PAPER} stroke={INK} strokeWidth={LW} />
        <g transform={`rotate(${spin})`}>
          {[0, 45, 90, 135].map((a) => (
            <line key={a} x1={0} y1={-48} x2={0} y2={48} transform={`rotate(${a})`} stroke={INK} strokeWidth={2} />
          ))}
        </g>
        <circle r={10} fill={INK} />
      </g>
    ))}
  </g>
);

// Merchant's strongbox, origin at the middle of its front face
export const Chest: React.FC<{lid?: number; lock?: number; slotGlow?: number}> = ({lid = 0, lock = 0, slotGlow = 0}) => (
  <g>
    <rect x={-150} y={-60} width={300} height={170} rx={8} fill={WOOD} stroke={INK} strokeWidth={LW} />
    <rect x={-150} y={-10} width={300} height={16} fill={INK} opacity={0.18} />
    {[-110, 110].map((x) => (
      <rect key={x} x={x - 10} y={-60} width={20} height={170} fill={IRON} stroke={INK} strokeWidth={2} />
    ))}
    <rect x={-60} y={34} width={120} height={10} rx={4} fill={INK} />
    <rect x={-60} y={34} width={120} height={10} rx={4} fill={GREEN} opacity={slotGlow} />
    <g transform={`translate(-150 -60) rotate(${-lid * 62})`}>
      <path d="M 0 0 L 300 0 L 300 -20 Q 150 -70 0 -20 Z" fill={WOOD} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
      <rect x={140} y={-30} width={20} height={30} fill={IRON} stroke={INK} strokeWidth={2} />
    </g>
    {lock > 0 && (
      <g transform={`translate(0 ${-18 + (1 - lock) * -30}) scale(${0.6 + 0.4 * lock})`} opacity={Math.min(1, lock * 2)}>
        <path d="M -16 0 L -16 -18 Q 0 -38 16 -18 L 16 0" stroke={INK} strokeWidth={5} fill="none" />
        <rect x={-24} y={-2} width={48} height={40} rx={6} fill={IRON} stroke={INK} strokeWidth={LW} />
        <circle cx={0} cy={16} r={5} fill={INK} />
      </g>
    )}
  </g>
);

// Paper receipt / early note (vertical, Chinese style). origin centre.
export const SongNote: React.FC<{w?: number; h?: number; draw?: number; grey?: number; seal?: number}> = ({w = 150, h = 230, draw = 1, grey = 0, seal = 0}) => {
  const d = Math.max(0, Math.min(1, draw));
  const per = 2 * (w + h);
  const fill = grey > 0 ? mix(PARCH, '#9A968C', grey) : PARCH;
  const cols = 5;
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={fill} opacity={Math.min(1, d * 2)} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="none" stroke={INK} strokeWidth={LW} strokeDasharray={per} strokeDashoffset={per * (1 - d)} />
      <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} fill="none" stroke={INK} strokeWidth={1.4} opacity={d} strokeDasharray="5 3" />
      {/* header band */}
      <rect x={-w / 2 + 18} y={-h / 2 + 22} width={w - 36} height={h * 0.13} fill={INK} opacity={0.85 * clamp01(d * 1.6 - 0.3)} />
      {/* columns of script */}
      {Array.from({length: cols}).map((_, i) => {
        const x = -w / 2 + 26 + i * ((w - 52) / (cols - 1));
        const t = clamp01(d * 2 - 0.5 - i * 0.08);
        return (
          <g key={i} opacity={t}>
            {Array.from({length: 5}).map((__, k) => (
              <rect key={k} x={x - 5} y={-h / 2 + h * 0.23 + k * h * 0.075} width={10} height={h * 0.045} rx={2} fill={INK} opacity={0.75} />
            ))}
          </g>
        );
      })}
      {/* picture band: three houses and a granary */}
      <g opacity={clamp01(d * 2 - 1)} transform={`translate(0 ${h * 0.3})`}>
        {[-w * 0.26, 0, w * 0.26].map((x, i) => (
          <g key={i} transform={`translate(${x} 0)`}>
            <path d={`M -16 6 L 0 -12 L 16 6 Z`} fill={INK} />
            <rect x={-11} y={6} width={22} height={16} fill="none" stroke={INK} strokeWidth={1.8} />
          </g>
        ))}
      </g>
      {seal > 0 && <Seal size={w * 0.36} x={w * 0.14} y={-h * 0.08} o={seal} />}
    </g>
  );
};

// Vermilion seal
export const Seal: React.FC<{size?: number; x?: number; y?: number; o?: number; rot?: number}> = ({size = 70, x = 0, y = 0, o = 1, rot = -4}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
    <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={size * 0.06} fill={VERMILION} />
    <rect x={-size * 0.4} y={-size * 0.4} width={size * 0.8} height={size * 0.8} fill="none" stroke={PARCH} strokeWidth={size * 0.05} />
    {[-0.2, 0.05, 0.25].map((k, i) => (
      <rect key={i} x={-size * 0.28} y={size * k - size * 0.03} width={size * 0.56} height={size * 0.06} fill={PARCH} />
    ))}
    <rect x={-size * 0.03} y={-size * 0.3} width={size * 0.06} height={size * 0.6} fill={PARCH} />
  </g>
);

// Rice sack, origin at the bottom middle
export const Sack: React.FC<{s?: number; o?: number}> = ({s = 1, o = 1}) => (
  <g transform={`scale(${s})`} opacity={o}>
    <path d="M -46 0 Q -58 -60 -30 -92 L -18 -104 Q 0 -96 18 -104 L 30 -92 Q 58 -60 46 0 Z" fill={PARCH_DK} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M -22 -100 Q 0 -86 22 -100" stroke={INK} strokeWidth={4} fill="none" />
    <path d="M -14 -52 Q 0 -60 14 -52 M -8 -40 Q 0 -44 8 -40" stroke={INK} strokeWidth={2} fill="none" opacity={0.5} />
  </g>
);

// Silver sycee ingot, origin centre
export const Sycee: React.FC<{gleam?: number}> = ({gleam = -1}) => (
  <g>
    <defs>
      <linearGradient id="syc" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E9ECEF" />
        <stop offset="55%" stopColor={SILVER} />
        <stop offset="100%" stopColor={SILVER_DK} />
      </linearGradient>
      <clipPath id="sycClip">
        <path d="M -120 -40 Q -90 30 -50 40 L 50 40 Q 90 30 120 -40 Q 60 -10 0 -10 Q -60 -10 -120 -40 Z" />
      </clipPath>
    </defs>
    <path d="M -120 -40 Q -90 30 -50 40 L 50 40 Q 90 30 120 -40 Q 60 -10 0 -10 Q -60 -10 -120 -40 Z" fill="url(#syc)" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <ellipse cx={0} cy={-18} rx={42} ry={26} fill="url(#syc)" stroke={INK} strokeWidth={LW} />
    {gleam >= 0 && gleam <= 1 && (
      <g clipPath="url(#sycClip)">
        <rect x={-160 + gleam * 320} y={-60} width={34} height={120} fill="#fff" opacity={0.75} transform={`skewX(-24)`} />
      </g>
    )}
  </g>
);

// Swedish copper plate money, origin centre. w x h in px.
export const CopperPlate: React.FC<{w?: number; h?: number}> = ({w = 520, h = 250}) => {
  const stamp = (x: number, y: number, k: number) => (
    <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
      <circle r={30} fill={COPPER_HI} stroke={INK} strokeWidth={2.2} />
      <circle r={22} fill="none" stroke={INK} strokeWidth={1.4} />
      <path d="M -12 4 L -12 -8 L -6 -2 L 0 -12 L 6 -2 L 12 -8 L 12 4 Z" fill={INK} opacity={0.8} />
      <rect x={-12} y={8} width={24} height={4} fill={INK} opacity={0.6 + k * 0} />
    </g>
  );
  return (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={COPPER} stroke={INK} strokeWidth={LW} />
      <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h * 0.18} rx={6} fill={COPPER_HI} opacity={0.35} />
      {[
        [-w / 2 + 48, -h / 2 + 48],
        [w / 2 - 48, -h / 2 + 48],
        [-w / 2 + 48, h / 2 - 48],
        [w / 2 - 48, h / 2 - 48],
        [0, 0],
      ].map(([x, y], i) => stamp(x, y, i))}
    </g>
  );
};

// European banknote (landscape), origin centre
export const EuroNote: React.FC<{w?: number; h?: number; o?: number}> = ({w = 160, h = 96, o = 1}) => (
  <g opacity={o}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#F7F4EC" stroke={INK} strokeWidth={2.4} />
    <rect x={-w / 2 + 7} y={-h / 2 + 7} width={w - 14} height={h - 14} fill="none" stroke={INK} strokeWidth={1.2} />
    <circle cx={-w * 0.28} cy={0} r={h * 0.2} fill="none" stroke={INK} strokeWidth={1.6} />
    {[-0.18, 0, 0.18].map((k) => (
      <rect key={k} x={-w * 0.05} y={h * k - 3} width={w * 0.36} height={6} rx={2} fill={INK} opacity={0.6} />
    ))}
    <circle cx={w * 0.34} cy={h * 0.24} r={8} fill={VERMILION} opacity={0.85} />
  </g>
);

// Bank facade: pediment, four columns, steps. origin at the base centre.
export const Bank: React.FC<{crack?: number; sag?: number; door?: number}> = ({crack = 0, sag = 0, door = 0}) => {
  const c = Math.max(0, Math.min(1, crack));
  return (
    <g>
      <rect x={-300} y={-14} width={600} height={14} fill={PAPER} stroke={INK} strokeWidth={LW} />
      <rect x={-270} y={-28} width={540} height={14} fill={PAPER} stroke={INK} strokeWidth={LW} />
      <g transform={`translate(0 ${sag}) rotate(${sag * 0.12} 200 -30)`}>
        {[-200, -80, 80, 200].map((x, i) => (
          <g key={x} transform={i === 3 ? `rotate(${sag * 0.25} ${x} -28)` : undefined}>
            <rect x={x - 22} y={-250} width={44} height={222} fill={PAPER} stroke={INK} strokeWidth={LW} />
            {[-12, 0, 12].map((k) => (
              <line key={k} x1={x + k} y1={-244} x2={x + k} y2={-34} stroke={INK} strokeWidth={1} opacity={0.4} />
            ))}
          </g>
        ))}
        <rect x={-46} y={-150} width={92} height={122} fill={door > 0 ? INK : '#2A2C2F'} stroke={INK} strokeWidth={LW} />
        <rect x={-46} y={-150} width={92 * (1 - door)} height={122} fill={WOOD} stroke={INK} strokeWidth={2} />
        <rect x={-270} y={-282} width={540} height={32} fill={PAPER} stroke={INK} strokeWidth={LW} />
        <path d="M -290 -282 L 0 -390 L 290 -282 Z" fill={PAPER} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <circle cx={0} cy={-322} r={20} fill="none" stroke={INK} strokeWidth={2.2} />
        {/* crack */}
        <path
          d="M 40 -390 L 22 -350 L 48 -318 L 30 -282 L 56 -250 L 44 -200 L 70 -150"
          stroke={RED}
          strokeWidth={4}
          fill="none"
          strokeLinejoin="round"
          strokeDasharray={320}
          strokeDashoffset={320 * (1 - c)}
        />
        <path d="M 200 -250 L 186 -200 L 210 -160 L 196 -110" stroke={RED} strokeWidth={3} fill="none" strokeDasharray={160} strokeDashoffset={160 * (1 - clamp01(c * 1.6 - 0.6))} />
      </g>
    </g>
  );
};

// Simple person: head and shoulders. origin at feet.
export const Person: React.FC<{tone?: string; hold?: boolean; bob?: number}> = ({tone = PAPER, hold = false, bob = 0}) => (
  <g transform={`translate(0 ${bob})`}>
    <path d="M -30 0 Q -32 -62 0 -66 Q 32 -62 30 0 Z" fill={tone} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <circle cx={0} cy={-88} r={20} fill={tone} stroke={INK} strokeWidth={LW} />
    {hold && <line x1={20} y1={-40} x2={40} y2={-58} stroke={INK} strokeWidth={LW} strokeLinecap="round" />}
  </g>
);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * clamp01(t)));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
