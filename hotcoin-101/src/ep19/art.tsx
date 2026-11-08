import React from 'react';
import {FONT, GREEN, INK, PAPER, RED} from '../notebook/tokens';

// FILE 019 illustrations: ink line, flat fills, origin noted per piece.

const LW = 3;
export const BARK = '#B9B09A';
export const BARK_DK = '#8E8672';
export const LEAF = ['#6FA34E', '#7EC25A', '#5E9440', '#8DCB6A'];
export const PARCH = '#F2E2BF';
export const SLATE = '#5E7C8E';

/** a buttonwood (sycamore): patchy bark, round canopy. origin at the foot of the trunk. s scales; ghost draws it as a dashed outline */
export const Tree: React.FC<{s?: number; grow?: number; ghost?: number}> = ({s = 1, grow = 1, ghost = 0}) => {
  const blobs = [
    {x: 0, y: -330, r: 150},
    {x: -150, y: -280, r: 120},
    {x: 150, y: -280, r: 125},
    {x: -80, y: -400, r: 110},
    {x: 95, y: -405, r: 105},
    {x: -230, y: -210, r: 85},
    {x: 230, y: -205, r: 90},
  ];
  if (ghost > 0)
    return (
      <g transform={`scale(${s})`} opacity={ghost} fill="none" stroke={INK} strokeWidth={LW} strokeDasharray="10 10">
        <path d="M -26 0 C -20 -80, -30 -150, -10 -220 L 14 -220 C 30 -150, 22 -80, 30 0 Z" />
        {blobs.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} />
        ))}
      </g>
    );
  return (
    <g transform={`scale(${s})`}>
      <path d="M -26 0 C -20 -80, -30 -150, -10 -220 L 14 -220 C 30 -150, 22 -80, 30 0 Z" fill={BARK} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
      <path d="M -6 -170 C -40 -200, -70 -220, -100 -250 M 6 -180 C 40 -210, 70 -230, 110 -255" stroke={INK} strokeWidth={10} strokeLinecap="round" fill="none" />
      {[
        [-10, -40, 12, 18],
        [8, -95, 10, 14],
        [-12, -140, 9, 12],
        [6, -185, 8, 10],
      ].map(([x, y, rx, ry], i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={BARK_DK} opacity={0.7} />
      ))}
      {blobs.map((b, i) => {
        const g = Math.max(0, Math.min(1, grow * 1.6 - i * 0.09));
        return <circle key={i} cx={b.x} cy={b.y} r={b.r * g} fill={LEAF[i % LEAF.length]} stroke={INK} strokeWidth={LW} />;
      })}
    </g>
  );
};

/** coffee cup, origin at the saucer middle */
export const Coffee: React.FC<{s?: number; steam?: number}> = ({s = 1, steam = 0}) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={0} rx={70} ry={14} fill={PAPER} stroke={INK} strokeWidth={LW} />
    <path d="M -46 -2 L -40 -78 L 40 -78 L 46 -2 Z" fill={PAPER} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M 42 -62 C 70 -62, 70 -24, 44 -22" stroke={INK} strokeWidth={LW} fill="none" />
    <rect x={-40} y={-60} width={80} height={14} fill="#8A5A3B" opacity={0.7} />
    {[-16, 6].map((x, i) => (
      <path key={i} d={`M ${x} -92 C ${x - 10} -110, ${x + 10} -122, ${x} -142`} stroke={INK} strokeWidth={2.4} fill="none" opacity={0.5} strokeDasharray={`${40 * steam} 60`} />
    ))}
  </g>
);

/** a rack of servers, origin at the floor middle */
export const Rack: React.FC<{s?: number; t?: number; seed?: number}> = ({s = 1, t = 0, seed = 0}) => (
  <g transform={`scale(${s})`}>
    <rect x={-70} y={-300} width={140} height={300} rx={10} fill="#23272C" stroke={INK} strokeWidth={LW} />
    {Array.from({length: 7}).map((_, i) => (
      <g key={i}>
        <rect x={-56} y={-286 + i * 40} width={112} height={30} rx={4} fill="#34393F" />
        {[0, 1, 2].map((k) => {
          const on = Math.sin(t * (1.3 + k * 0.7) + i * 1.7 + seed * 2.3 + k) > 0.2;
          return <circle key={k} cx={30 + k * 10} cy={-271 + i * 40} r={3.4} fill={on ? GREEN : '#55606A'} />;
        })}
      </g>
    ))}
  </g>
);

/** a hanging price tag, origin at the hook */
export const PriceTag: React.FC<{text: string; w?: number; color?: string; crack?: number}> = ({text, w = 200, color = INK, crack = 0}) => (
  <g>
    <line x1={0} y1={0} x2={0} y2={34} stroke={INK} strokeWidth={2} />
    <path d={`M ${-w / 2} 34 L ${w / 2} 34 L ${w / 2} 110 L ${-w / 2} 110 Z`} fill={PARCH} stroke={INK} strokeWidth={LW} />
    <text x={0} y={88} textAnchor="middle" fontFamily={FONT.display} fontSize={46} fill={color}>
      {text}
    </text>
    {crack > 0 && <path d={`M ${-w * 0.1} 34 L ${w * 0.05} 60 L ${-w * 0.05} 80 L ${w * 0.08} 110`} stroke={RED} strokeWidth={4} fill="none" strokeDasharray={120} strokeDashoffset={120 * (1 - crack)} />}
  </g>
);

/** a small signature squiggle, origin at its left end */
export const Squiggle: React.FC<{seed: number; w?: number; draw?: number}> = ({seed, w = 90, draw = 1}) => {
  const a = 6 + (seed % 5) * 2;
  const d = `M 0 0 C ${w * 0.15} ${-a}, ${w * 0.25} ${a}, ${w * 0.4} ${-a * 0.5} S ${w * 0.6} ${a}, ${w * 0.75} 0 S ${w * 0.9} ${-a}, ${w} ${a * 0.3}`;
  return <path d={d} stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeDasharray={w * 1.6} strokeDashoffset={w * 1.6 * (1 - draw)} />;
};
