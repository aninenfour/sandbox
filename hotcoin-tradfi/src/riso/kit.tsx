import React from 'react';

// Risograph kit: three Hotcoin inks on cream paper, halftone dots instead of gradients,
// slight registration offset, patchy ink and rough edges. Everything is flat SVG.
export const INK = {
  paper: '#F2EEE3',
  green: '#7EC25A', // Hotcoin accent green: the main ink, used for every oversized object
  pine: '#2C5A43', // deep green: clothes, details and shading dots
  black: '#121417', // only hair, eyes, shoes and the label
};
export const W = 1080, H = 1920;
export type Pt = [number, number];
type Ink = keyof typeof INK;

// Registration offset per ink, so the plates never line up perfectly.
export const REG: Record<Ink, Pt> = {paper: [0, 0], green: [4, -3], pine: [-2, 2], black: [0, 0]};
export const reg = (ink: Ink) => `translate(${REG[ink][0]} ${REG[ink][1]})`;

export const rand = (s: number) => {const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (t: number) => {t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;};
// Animate "on twos" for a hand-printed feel.
export const twos = (f: number) => Math.floor(f / 2) * 2;

// Halftone with dot size driven by a density function, which stands in for a gradient.
export const Dots: React.FC<{
  box: [number, number, number, number]; ink: Ink; dens: (x: number, y: number) => number;
  cell?: number; angle?: number; clip?: string; blend?: boolean;
}> = ({box: [x0, y0, w, h], ink, dens, cell = 13, angle = 15, clip, blend = true}) => {
  const a = (angle * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a);
  const cx = x0 + w / 2, cy = y0 + h / 2, R = Math.hypot(w, h) / 2;
  const n = Math.ceil(R / cell);
  const dots: React.ReactNode[] = [];
  for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) {
    const px = cx + i * cell * ca - j * cell * sa, py = cy + i * cell * sa + j * cell * ca;
    if (px < x0 - cell || px > x0 + w + cell || py < y0 - cell || py > y0 + h + cell) continue;
    const d = clamp(dens(px, py));
    if (d < 0.02) continue;
    dots.push(<circle key={`${i}_${j}`} cx={px} cy={py} r={Math.min(cell * 0.66, cell * 0.5 * Math.sqrt(d) * 1.25)} />);
  }
  return (
    <g clipPath={clip ? `url(#${clip})` : undefined} style={blend ? {mixBlendMode: 'multiply'} : undefined}>
      <g transform={reg(ink)} fill={INK[ink]}>{dots}</g>
    </g>
  );
};

// Uniform halftone patterns, defined once per sheet.
export const Patterns: React.FC<{p: string}> = ({p}) => {
  const pat = (id: string, cell: number, r: number, ink: Ink, angle = 15) => (
    <pattern id={`${p}-${id}`} width={cell} height={cell} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <circle cx={cell / 2} cy={cell / 2} r={r} fill={INK[ink]} />
    </pattern>
  );
  return (
    <>
      {pat('skin', 8, 2.7, 'green', 30)}
      {pat('cheek', 7, 3.5, 'green', 30)}
      {pat('glass', 12, 2.4, 'green', 30)}
      {pat('pine', 12, 3.6, 'pine', 15)}
    </>
  );
};

// Rough edges, patchy coverage and paper fibre. The seed changes on 10 fps for a gentle "boil".
// k = user units per screen pixel, so the texture keeps its on-screen size when a sheet is zoomed out.
export const PrintFilters: React.FC<{p: string; seed: number; k?: number}> = ({p, seed, k = 1}) => (
  <>
    <filter id={`${p}-rough`} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency={0.03 / k} numOctaves={2} seed={seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={6 * k} xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id={`${p}-speckle`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency={0.75 / k} numOctaves={2} seed={seed + 7} result="n" />
      <feColorMatrix in="n" type="matrix" values={`0 0 0 0 0.949  0 0 0 0 0.933  0 0 0 0 0.890  7 0 0 0 -4.1`} />
    </filter>
    <filter id={`${p}-fibre`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency={`${0.006 / k} ${0.09 / k}`} numOctaves={3} seed={3} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.4  0 0 0 0.9 -0.35" />
    </filter>
  </>
);

// Two-segment limb solved by IK so a hand or foot lands where the scene needs it.
const solve = (S: Pt, T: Pt, L1: number, L2: number, bend: number): [Pt, Pt] => {
  let dx = T[0] - S[0], dy = T[1] - S[1];
  let d = Math.hypot(dx, dy);
  const max = L1 + L2 - 0.5;
  if (d > max) {dx = (dx / d) * max; dy = (dy / d) * max; d = max;}
  const H: Pt = [S[0] + dx, S[1] + dy];
  const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
  const mx = S[0] + (dx * a) / d, my = S[1] + (dy * a) / d;
  return [[mx - (bend * h * dy) / d, my + (bend * h * dx) / d], H];
};
const rot = ([x, y]: Pt, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
};

export type Pose = {
  lean?: number; // upper-body tilt in degrees around the hip
  head?: number; // extra head tilt
  handB: Pt; bendB?: number; handF: Pt; bendF?: number; // targets in person space (hip = 0,0)
  footB: Pt; kneeB?: number; footF: Pt; kneeF?: number;
  breathe?: number;
};

// One cheerful person: rounded blocky body, soft thick limbs, small head, closed curved eyes.
// Drawn facing +x; dir = -1 mirrors it. Black is used only for hair and shoes.
export const Person: React.FC<{x: number; y: number; s: number; dir?: 1 | -1; pose: Pose; p: string; top?: Ink; bottom?: Ink}> = ({
  x, y, s, dir = 1, pose, p, top = 'pine', bottom = 'green',
}) => {
  const lean = pose.lean ?? 0, br = pose.breathe ?? 0;
  const local = (pt: Pt) => rot(pt, -lean); // hand targets are given unrotated
  const shB: Pt = [-38, -250], shF: Pt = [38, -250];
  const [eB, hB] = solve(shB, local(pose.handB), 150, 150, pose.bendB ?? 1);
  const [eF, hF] = solve(shF, local(pose.handF), 150, 150, pose.bendF ?? -1);
  const hipB: Pt = [-46, 0], hipF: Pt = [46, 0];
  const [kB, fB] = solve(hipB, pose.footB, 168, 168, pose.kneeB ?? -1);
  const [kF, fF] = solve(hipF, pose.footF, 168, 168, pose.kneeF ?? -1);
  const limb = (a: Pt, b: Pt, c: Pt) => `M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]}`;
  const hand = (h: Pt) => (
    <g>
      <circle cx={h[0]} cy={h[1]} r={34} fill={INK.paper} />
      <circle cx={h[0]} cy={h[1]} r={34} fill={`url(#${p}-skin)`} transform={reg('green')} />
    </g>
  );
  const shoe = (f: Pt) => <ellipse cx={f[0] + 24} cy={f[1] + 6} rx={58} ry={31} fill={INK.black} />;
  const headY = -400 + br * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * dir} ${s})`}>
      {/* legs */}
      <g transform={reg(bottom)}>
        <path d={limb(hipB, kB, fB)} stroke={INK[bottom]} strokeWidth={94} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={limb(hipF, kF, fF)} stroke={INK[bottom]} strokeWidth={94} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x={-100} y={-70} width={200} height={110} rx={46} fill={INK[bottom]} />
      </g>
      {shoe(fB)}{shoe(fF)}
      <g transform={`rotate(${lean})`}>
        {/* back arm */}
        <path d={limb(shB, eB, hB)} stroke={INK[top]} strokeWidth={74} strokeLinecap="round" strokeLinejoin="round" fill="none" transform={reg(top)} />
        {hand(hB)}
        {/* torso */}
        <clipPath id={`${p}-torso`}><rect x={-112} y={-320 + br * 4} width={224} height={330 - br * 4} rx={96} /></clipPath>
        <rect x={-112} y={-320 + br * 4} width={224} height={330 - br * 4} rx={96} fill={INK[top]} transform={reg(top)} />
        {/* overprinted shading down the back of the torso */}
        <Dots box={[-112, -320, 110, 330]} ink={bottom} dens={(px) => 0.32 * clamp((-40 - px) / 70)} cell={11} clip={`${p}-torso`} />
        {/* neck + head */}
        <g transform={`rotate(${pose.head ?? 0} 10 ${headY + 40})`}>
          <rect x={-20} y={headY + 30} width={40} height={50} fill={INK.paper} />
          <rect x={-20} y={headY + 30} width={40} height={50} fill={`url(#${p}-skin)`} transform={reg('green')} />
          <circle cx={10} cy={headY} r={74} fill={INK.paper} />
          <circle cx={10} cy={headY} r={74} fill={`url(#${p}-skin)`} transform={reg('green')} />
          <circle cx={64} cy={headY + 20} r={16} fill={`url(#${p}-cheek)`} transform={reg('green')} />
          <g fill={INK.black}>
            <circle cx={-22} cy={headY - 44} r={56} />
            <circle cx={22} cy={headY - 62} r={40} />
            <circle cx={-64} cy={headY - 6} r={42} />
            <circle cx={-52} cy={headY + 38} r={28} />
            <circle cx={50} cy={headY - 50} r={28} />
          </g>
          <g stroke={INK.black} strokeWidth={6.5} strokeLinecap="round" fill="none">
            <path d={`M${12} ${headY} q 11 10 22 0`} />
            <path d={`M${48} ${headY + 2} q 10 9 20 0`} />
          </g>
          <path d={`M${36} ${headY + 26} q 10 9 20 0`} stroke={INK.pine} strokeWidth={5.5} strokeLinecap="round" fill="none" />
        </g>
        {/* front arm */}
        <path d={limb(shF, eF, hF)} stroke={INK[top]} strokeWidth={74} strokeLinecap="round" strokeLinejoin="round" fill="none" transform={reg(top)} />
        {hand(hF)}
      </g>
    </g>
  );
};

// Converts a world point into a person's space (needed to aim hands and feet).
export const toPerson = (x: number, y: number, s: number, dir: 1 | -1, w: Pt): Pt => [(w[0] - x) / (s * dir), (w[1] - y) / s];

// The tiny bold label in a free upper corner.
export const Label: React.FC<{lines: string[]; x: number; y: number; size?: number; anchor?: 'start' | 'end'}> = ({lines, x, y, size = 46, anchor = 'start'}) => (
  <text x={x} y={y} fontFamily='"Archivo Black", sans-serif' fontSize={size} fill={INK.black} textAnchor={anchor} letterSpacing={0.5}>
    {lines.map((l, i) => <tspan key={i} x={x} dy={i === 0 ? 0 : size * 0.98}>{l}</tspan>)}
  </text>
);

// A full print: paper, artwork with rough edges, speckled ink and fibre.
// vb picks the part of the 1080x1920 drawing to show (the square cut uses its own box per print).
export type VB = [number, number, number, number];
export const Sheet: React.FC<{p: string; f: number; children: React.ReactNode; vb?: VB}> = ({p, f, children, vb = [0, 0, W, H]}) => {
  const seed = 1 + (Math.floor(f / 3) % 6);
  const k = vb[2] / W;
  return (
    <svg width={W} height={(W * vb[3]) / vb[2]} viewBox={vb.join(' ')} style={{position: 'absolute', inset: 0, background: INK.paper}}>
      <defs>
        <Patterns p={p} />
        <PrintFilters p={p} seed={seed} k={k} />
      </defs>
      <rect x={vb[0]} y={vb[1]} width={vb[2]} height={vb[3]} filter={`url(#${p}-fibre)`} opacity={0.12} style={{mixBlendMode: 'multiply'}} />
      <g filter={`url(#${p}-rough)`}>{children}</g>
      <rect x={vb[0]} y={vb[1]} width={vb[2]} height={vb[3]} filter={`url(#${p}-speckle)`} />
    </svg>
  );
};

// Puts something drawn for the 9:16 top-left corner into the top-left corner of a view box, at the same screen size.
export const Corner: React.FC<{vb?: VB; children: React.ReactNode}> = ({vb, children}) =>
  vb ? <g transform={`translate(${vb[0]} ${vb[1]}) scale(${vb[2] / W})`}>{children}</g> : <>{children}</>;

// Ground shadow in coarse halftone.
export const Shadow: React.FC<{cx: number; cy: number; rx: number; ry: number; k?: number}> = ({cx, cy, rx, ry, k = 0.35}) => (
  <Dots box={[cx - rx, cy - ry, rx * 2, ry * 2]} ink="pine" cell={14}
    dens={(x, y) => k * clamp(1 - Math.hypot((x - cx) / rx, (y - cy) / ry))} />
);
