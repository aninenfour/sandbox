// A jointed stickman for the Shorts: white, softly shaded, with real knees and elbows.
// Poses are joint angles (degrees from straight down; positive = towards where he faces), so walking, running,
// carrying, bending, sitting and waving are just different angle sets that blend into each other.
import React from 'react';

export type Pose = {lean: number; head: number; tL: number; sL: number; tR: number; sR: number; uL: number; fL: number; uR: number; fR: number; dy: number};
export const ZERO: Pose = {lean: 0, head: 0, tL: 0, sL: 0, tR: 0, sR: 0, uL: 8, fL: 14, uR: -6, fR: 4, dy: 0};
export const mix = (a: Pose, b: Pose, w: number): Pose => {
  const o = {} as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => { o[k] = a[k] + (b[k] - a[k]) * w; });
  return o;
};

// ---------- pose library ----------
export const walk = (ph: number, amp = 1): Pose => {
  const s = Math.sin(ph), c = Math.cos(ph);
  const tL = 26 * amp * s, tR = -tL;
  const flexL = 8 + 50 * amp * Math.pow(Math.max(0, c), 1.3), flexR = 8 + 50 * amp * Math.pow(Math.max(0, -c), 1.3);
  const uL = -24 * amp * s, uR = -uL;
  return {lean: 4 * amp, head: -2, tL, sL: tL - flexL, tR, sR: tR - flexR, uL, fL: uL + 16 + 8 * amp, uR, fR: uR + 16 + 8 * amp, dy: -7 * amp * Math.abs(c)};
};
export const run = (ph: number): Pose => {
  const w = walk(ph, 1.45);
  return {...w, lean: 15, fL: w.uL + 80, fR: w.uR + 80, dy: w.dy - 6};
};
export const idle = (t: number): Pose => ({...ZERO, uL: 6 + Math.sin(t * 2) * 2, uR: -4 - Math.sin(t * 2) * 2, dy: Math.sin(t * 2.4) * 1.5});
export const slumpWalk = (ph: number): Pose => ({...walk(ph, 0.7), lean: 16, head: 22, uL: 6 + Math.sin(ph) * 6, fL: 10, uR: 6 - Math.sin(ph) * 6, fR: 10});
export const carry = (base: Pose): Pose => ({...base, uL: 30, fL: 100, uR: 34, fR: 104});
export const bend = (): Pose => ({lean: 48, head: 20, tL: 34, sL: -14, tR: 26, sR: -20, uL: 62, fL: 66, uR: 58, fR: 60, dy: 46});
export const shrug = (t: number): Pose => ({...ZERO, head: -8 + Math.sin(t * 6) * 3, uL: 12, fL: 112, uR: 8, fR: 108, dy: -4});
export const lookDown = (): Pose => ({...ZERO, lean: 10, head: 32, uL: 4, fL: 8, uR: 2, fR: 6});
export const wave = (t: number): Pose => ({...ZERO, head: -6, uR: 160, fR: 180 + Math.sin(t * 12) * 22});
export const cheer = (t: number): Pose => ({...ZERO, head: -14, uL: 165, fL: 178, uR: 160, fR: 172, dy: -Math.abs(Math.sin(t * 7)) * 50, tL: 10, sL: -20, tR: -6, sR: -24});
export const handOver = (k: number): Pose => ({...ZERO, lean: 6, uR: 60 + 25 * k, fR: 75 + 15 * k, uL: 6, fL: 12});
export const sit = (t: number): Pose => ({lean: -4, head: -4, tL: 84, sL: 8, tR: 80, sR: 4, uL: 52, fL: 86, uR: 48, fR: 84, dy: 120 + Math.sin(t * 9) * 2});
export const ride = (t: number): Pose => ({lean: 24, head: -8, tL: 62, sL: -8, tR: 58, sR: -14, uL: 70, fL: 82, uR: 66, fR: 80, dy: 70 + Math.sin(t * 11) * 2});

// ---------- drawing ----------
const L = {thigh: 92, shin: 92, torso: 150, upper: 72, fore: 70, head: 36};
const pol = (len: number, deg: number): [number, number] => [Math.sin(deg * Math.PI / 180) * len, Math.cos(deg * Math.PI / 180) * len];
const add = (a: [number, number], b: [number, number]): [number, number] => [a[0] + b[0], a[1] + b[1]];

const Limb: React.FC<{a: [number, number]; b: [number, number]; c: [number, number]; w: number; back?: boolean}> = ({a, b, c, w, back}) => {
  const base = back ? '#B9BCC6' : '#F1F1F4', hi = back ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.95)', sh = back ? 'rgba(0,0,0,.18)' : 'rgba(120,124,140,.45)';
  const d = `M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]}`;
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={d} stroke={sh} strokeWidth={w + 4} transform="translate(2 3)" />
      <path d={d} stroke={base} strokeWidth={w} />
      <path d={d} stroke={hi} strokeWidth={w * 0.28} transform={`translate(${-w * 0.18} ${-w * 0.18})`} />
    </g>
  );
};

// x, y: where his feet touch the ground (screen px). s: scale. face: 1 right, -1 left. hide: draw upper body only (in a car).
export const Rig: React.FC<{x: number; y: number; s?: number; p: Pose; face?: 1 | -1; eye?: [number, number]; upperOnly?: boolean; shadow?: boolean}> = ({x, y, s = 1, p, face = 1, eye = [1, 0], upperOnly, shadow = true}) => {
  const hipY = -(L.thigh + L.shin) + p.dy;
  const hip: [number, number] = [0, hipY];
  const kneeL = add(hip, pol(L.thigh, p.tL)), footL = add(kneeL, pol(L.shin, p.sL));
  const kneeR = add(hip, pol(L.thigh, p.tR)), footR = add(kneeR, pol(L.shin, p.sR));
  const neck = add(hip, [Math.sin(p.lean * Math.PI / 180) * L.torso, -Math.cos(p.lean * Math.PI / 180) * L.torso]);
  const sh = add(neck, pol(14, p.lean + 180));
  const elL = add(sh, pol(L.upper, p.uL)), haL = add(elL, pol(L.fore, p.fL));
  const elR = add(sh, pol(L.upper, p.uR)), haR = add(elR, pol(L.fore, p.fR));
  const head = add(neck, pol(L.head + 10, p.lean + 180 + p.head * 0.4));
  const gid = 'hg';
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <defs>
        <radialGradient id={gid} cx="35%" cy="30%" r="75%"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="70%" stopColor="#E6E7EC" /><stop offset="100%" stopColor="#B9BCC6" /></radialGradient>
      </defs>
      <g transform={`translate(${x} ${y}) scale(${face * s} ${s})`}>
        {shadow && !upperOnly && <ellipse cx={0} cy={4} rx={70} ry={12} fill="rgba(0,0,0,.35)" />}
        {/* back limbs */}
        {!upperOnly && <Limb a={hip} b={kneeR} c={footR} w={22} back />}
        <Limb a={sh} b={elR} c={haR} w={18} back />
        {/* torso */}
        <path d={`M${hip[0]} ${hip[1]} L${neck[0]} ${neck[1]}`} stroke="rgba(120,124,140,.45)" strokeWidth={40} strokeLinecap="round" transform="translate(2 3)" />
        <path d={`M${hip[0]} ${hip[1]} L${neck[0]} ${neck[1]}`} stroke="#F1F1F4" strokeWidth={36} strokeLinecap="round" />
        <path d={`M${hip[0] - 7} ${hip[1] - 6} L${neck[0] - 7} ${neck[1] + 6}`} stroke="rgba(255,255,255,.95)" strokeWidth={8} strokeLinecap="round" />
        {/* head */}
        <circle cx={head[0] + 2} cy={head[1] + 3} r={L.head} fill="rgba(120,124,140,.45)" />
        <circle cx={head[0]} cy={head[1]} r={L.head} fill={`url(#${gid})`} />
        <ellipse cx={head[0] + 12 + eye[0] * 5} cy={head[1] - 4 + eye[1] * 5 + p.head * 0.15} rx={4.5} ry={6} fill="#1B1E26" />
        <ellipse cx={head[0] + 26 + eye[0] * 5} cy={head[1] - 4 + eye[1] * 5 + p.head * 0.15} rx={4} ry={5.5} fill="#1B1E26" />
        {/* front limbs */}
        {!upperOnly && <Limb a={hip} b={kneeL} c={footL} w={22} />}
        <Limb a={sh} b={elL} c={haL} w={18} />
        {!upperOnly && <><ellipse cx={footL[0] + 10} cy={footL[1] - 4} rx={18} ry={9} fill="#2A2D36" /><ellipse cx={footR[0] + 10} cy={footR[1] - 4} rx={18} ry={9} fill="#1E2028" /></>}
      </g>
    </svg>
  );
};

// where his hands are, so props can sit in them
export const hands = (x: number, y: number, s: number, p: Pose, face: 1 | -1 = 1): [number, number] => {
  const hipY = -(L.thigh + L.shin) + p.dy;
  const neck = [Math.sin(p.lean * Math.PI / 180) * L.torso, hipY - Math.cos(p.lean * Math.PI / 180) * L.torso];
  const sh = [neck[0] - Math.sin(p.lean * Math.PI / 180) * 14, neck[1] + Math.cos(p.lean * Math.PI / 180) * 14];
  const el = [sh[0] + Math.sin(p.uL * Math.PI / 180) * L.upper, sh[1] + Math.cos(p.uL * Math.PI / 180) * L.upper];
  const ha = [el[0] + Math.sin(p.fL * Math.PI / 180) * L.fore, el[1] + Math.cos(p.fL * Math.PI / 180) * L.fore];
  return [x + face * s * ha[0], y + s * ha[1]];
};
