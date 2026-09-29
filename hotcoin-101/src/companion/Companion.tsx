import React from 'react';
import {random, useVideoConfig} from 'remotion';
import {useFrame} from '../design/clock';
import {GREEN, GREEN_DEEP, INK, SCLERA, theme, type Ground} from '../notebook/tokens';
import {blendFace, MOODS, type Face, type Mood} from './moods';

// The narrator, rebuilt. Still the logo's green dot, now a character:
// one eye with real lids, a brow, pupil dilation, saccades, blinks,
// anticipation and overshoot on moves, squash on landing, stretch and
// motion blur at speed, onion-skin ghosts and a contact shadow.
// Everything is a pure function of the clock, so renders are deterministic.

export type Beat = {
  at: number; // clock units (30fps) when this beat starts
  x: number;
  y: number;
  r?: number; // body radius in px
  path?: 'glide' | 'linear' | 'hop' | 'drop' | 'cut';
  dur?: number; // travel time in clock units
  hop?: number; // apex height in px for path: 'hop'
  arc?: number; // sideways bow for 'glide', fraction of distance
  mood?: Mood;
  look?: {x: number; y: number} | 'camera' | 'ahead';
  closed?: boolean; // lids shut
  plain?: boolean; // no face at all: the bare logo dot
  blink?: boolean; // force a blink at the start of this beat
};

type Props = {
  beats: Beat[];
  ground?: Ground;
  floor?: number; // y of a ground line for the contact shadow
  trail?: boolean;
  seed?: number;
  id?: string;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};

// Small pull back, then a fast move with a soft overshoot. Ends exactly at 1.
const glideCurve = (t: number) => {
  const A = 0.16;
  if (t <= 0) return 0;
  if (t < A) return -0.05 * Math.sin((Math.PI * t) / A);
  if (t >= 1) return 1;
  const u = (t - A) / (1 - A);
  const s = 1.25;
  const v = u - 1;
  return 1 + (s + 1) * v * v * v + s * v * v;
};

const defaultDur = (b: Beat, dist: number) => {
  if (b.dur !== undefined) return b.dur;
  if (b.path === 'cut') return 0;
  if (b.path === 'hop') return 13 + Math.sqrt(b.hop ?? 120) * 0.35;
  if (b.path === 'drop') return 12;
  return clamp(12 + dist / 55, 12, 30);
};

type Pose = {x: number; y: number; r: number; seg: number; t: number};

export const poseAt = (beats: Beat[], f: number): Pose => {
  let i = 0;
  for (let k = 0; k < beats.length; k++) if (beats[k].at <= f) i = k;
  const b = beats[i];
  const r1 = b.r ?? 56;
  if (i === 0 || f < b.at) return {x: b.x, y: b.y, r: r1, seg: i, t: 1};
  const a = beats[i - 1];
  const r0 = a.r ?? 56;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const dur = defaultDur(b, dist);
  const t = dur <= 0 ? 1 : clamp((f - b.at) / dur);
  if (b.path === 'hop') {
    const h = b.hop ?? 120;
    return {x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) - 4 * h * t * (1 - t), r: lerp(r0, r1, t), seg: i, t};
  }
  if (b.path === 'drop') {
    return {x: lerp(a.x, b.x, t), y: a.y + (b.y - a.y) * t * t, r: lerp(r0, r1, t), seg: i, t};
  }
  if (b.path === 'linear') {
    return {x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), r: lerp(r0, r1, t), seg: i, t};
  }
  const p = dur <= 0 ? 1 : glideCurve(t);
  const arc = (b.arc ?? 0.14) * dist * Math.sin(Math.PI * clamp(p));
  // bow upward (perpendicular pointing to -y)
  let nx = -(b.y - a.y) / (dist || 1);
  let ny = (b.x - a.x) / (dist || 1);
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  return {x: lerp(a.x, b.x, p) + nx * arc, y: lerp(a.y, b.y, p) + ny * arc, r: lerp(r0, r1, clamp(p)), seg: i, t};
};

// Piecewise schedule from a seed: returns start times up to f.
const schedule = (seed: string, f: number, first: number, min: number, spread: number) => {
  const out: number[] = [];
  let t = first;
  let n = 0;
  while (t <= f + 1) {
    out.push(t);
    t += min + random(`${seed}-${n++}`) * spread;
  }
  return out;
};

const blinkAmount = (dt: number) => {
  if (dt < 0 || dt > 7) return 0;
  if (dt < 2) return smooth(dt / 2);
  if (dt < 3) return 1;
  return 1 - smooth((dt - 3) / 3.5);
};

const faceAt = (beats: Beat[], f: number, seed: string) => {
  // mood blend
  const moodBeats = beats.filter((b) => b.mood);
  let cur: Mood = 'neutral';
  let prev: Mood = 'neutral';
  let since = 999;
  moodBeats.forEach((b) => {
    if (b.at <= f && b.mood !== cur) {
      prev = cur;
      cur = b.mood!;
      since = f - b.at;
    }
  });
  const face: Face = blendFace(MOODS[prev], MOODS[cur], smooth(since / 7));

  // closed and plain are held states with short blends
  const held = (key: 'closed' | 'plain') => {
    let v = 0;
    let last = 0;
    let since2 = 999;
    beats.forEach((b) => {
      if (b.at <= f) {
        const target = b[key] ? 1 : 0;
        if (target !== last) {
          v = last;
          since2 = f - b.at;
          last = target;
        }
      }
    });
    return lerp(v, last, smooth(since2 / (key === 'plain' ? 8 : 5)));
  };
  const closed = held('closed');
  const plain = held('plain');

  // blinks: natural schedule, occasional double, plus forced ones
  let blink = 0;
  schedule(`${seed}-blink`, f, 24, 70, 100).forEach((bt, n) => {
    blink = Math.max(blink, blinkAmount(f - bt));
    if (random(`${seed}-dbl-${n}`) < 0.18) blink = Math.max(blink, blinkAmount(f - bt - 8));
  });
  beats.forEach((b) => {
    if (b.blink) blink = Math.max(blink, blinkAmount(f - b.at));
  });

  // micro saccades
  const sac = schedule(`${seed}-sac`, f, 0, 14, 38);
  const sn = sac.length - 1;
  const sx0 = sn > 0 ? (random(`${seed}-sx-${sn - 1}`) - 0.5) * 0.4 : 0;
  const sy0 = sn > 0 ? (random(`${seed}-sy-${sn - 1}`) - 0.5) * 0.24 : 0;
  const sx1 = (random(`${seed}-sx-${sn}`) - 0.5) * 0.4;
  const sy1 = (random(`${seed}-sy-${sn}`) - 0.5) * 0.24;
  const st = smooth((f - sac[sn]) / 1.6);
  return {face, closed, plain, blink, saccade: {x: lerp(sx0, sx1, st), y: lerp(sy0, sy1, st)}};
};

export const Companion: React.FC<Props> = ({beats, ground = 'paper', floor, trail = true, seed = 7, id = 'nar'}) => {
  const f = useFrame();
  const {width, height} = useVideoConfig();
  const th = theme(ground);
  const s = String(seed);

  const pose = poseAt(beats, f);
  const back = poseAt(beats, f - 1);
  const vx = pose.x - back.x;
  const vy = pose.y - back.y;
  const speed = Math.hypot(vx, vy);
  const R = pose.r;
  const beat = beats[pose.seg];

  // stretch along travel, area preserved
  const sAmt = clamp(speed / (R * 1.1), 0, 1.1);
  const along = 1 + 0.3 * sAmt;
  const across = 1 / along;
  const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
  const blur = clamp(speed * 0.28, 0, R * 0.45);

  // landing squash for hops and drops, settle wobble for glides
  let squash = 0;
  beats.forEach((b, i) => {
    if (i === 0) return;
    const a = beats[i - 1];
    const end = b.at + defaultDur(b, Math.hypot(b.x - a.x, b.y - a.y));
    const dt = f - end;
    if (dt < 0 || dt > 16) return;
    if (b.path === 'hop' || b.path === 'drop') {
      const k = b.path === 'drop' ? 0.38 : clamp((b.hop ?? 120) / 400, 0.12, 0.34);
      squash += k * Math.exp(-dt / 3) * Math.cos(dt * 0.8);
    } else if (b.path !== 'cut' && b.path !== 'linear') {
      squash += 0.06 * Math.exp(-dt / 4) * Math.cos(dt * 0.9);
    }
  });
  const sqY = 1 - squash;
  const sqX = 1 + squash * 0.85;

  const {face, closed, plain, blink, saccade} = faceAt(beats, f, s);
  const breath = Math.sin((f / 72) * Math.PI * 2);

  // gaze
  let lx = 0;
  let ly = 0;
  const look = pose.t < 0.8 && beat.path !== 'cut' && beat.path !== 'linear' && pose.seg > 0 ? {x: beat.x, y: beat.y} : beat.look ?? 'camera';
  if (look === 'ahead') {
    lx = speed > 0.5 ? vx / speed : 0;
    ly = speed > 0.5 ? vy / speed : 0;
  } else if (look !== 'camera') {
    const dx = look.x - pose.x;
    const dy = look.y - pose.y;
    const d = Math.hypot(dx, dy) || 1;
    const m = clamp(d / (R * 3.5));
    lx = (dx / d) * m;
    ly = (dy / d) * m;
  }
  lx = clamp(lx + saccade.x * 0.5 + face.tremble * 0.05 * Math.sin(f * 2.3), -1, 1);
  ly = clamp(ly + saccade.y * 0.5 + face.tremble * 0.04 * Math.cos(f * 3.1), -1, 1);

  // eye geometry (local, px)
  const Wx = R * 0.5 * face.sclera * (1 + face.squint);
  const Hy = R * 0.54 * face.sclera * (1 - face.squint);
  const ex = lx * R * 0.1;
  const ey = ly * R * 0.08 - R * 0.02;
  const pr = R * 0.25 * face.pupil;
  const px = lx * (Wx - pr * 1.05);
  const py = ly * (Hy - pr * 1.1);

  const lowerRaise = clamp(face.lower);
  const lowerMid = lerp(Hy, -Hy * 0.05, lowerRaise) - face.lowerCurve * Hy * 0.3 * (0.3 + lowerRaise);
  const lowerEnd = lerp(Hy, -Hy * 0.05, lowerRaise) + Hy * 0.1;
  const open = clamp(face.upper * (1 - blink) * (1 - closed), 0, 1.2);
  const upperMid = lerp(lowerMid + Hy * 0.04, -Hy * 1.02, open);
  const tiltY = face.upperTilt * Hy * 0.4 * open;
  const bulge = Hy * 0.18;
  const uL = upperMid - tiltY - bulge;
  const uR = upperMid + tiltY - bulge;
  const uC = 2 * upperMid - (uL + uR) / 2;
  const lC = 2 * lowerMid - lowerEnd;
  const pad = R * 0.2;
  const upperPath = `M ${-Wx - pad} ${-Hy - pad} L ${-Wx - pad} ${uL} Q 0 ${uC} ${Wx + pad} ${uR} L ${Wx + pad} ${-Hy - pad} Z`;
  const upperEdge = `M ${-Wx - pad} ${uL} Q 0 ${uC} ${Wx + pad} ${uR}`;
  const lowerPath = `M ${-Wx - pad} ${Hy + pad} L ${-Wx - pad} ${lowerEnd} Q 0 ${lC} ${Wx + pad} ${lowerEnd} L ${Wx + pad} ${Hy + pad} Z`;
  const lowerEdge = `M ${-Wx - pad} ${lowerEnd} Q 0 ${lC} ${Wx + pad} ${lowerEnd}`;

  const browDip = blink * R * 0.04;
  const by = -R * 0.76 + browDip;
  const bL = by - face.browL * R;
  const bR = by - face.browR * R;
  const bC = 2 * ((bL + bR) / 2 - face.browArch * R) - (bL + bR) / 2;
  const bx = lx * R * 0.12;
  const browPath = `M ${bx - R * 0.3} ${bL} Q ${bx} ${bC} ${bx + R * 0.3} ${bR}`;

  const faceOp = 1 - plain;
  const lidFill = `url(#${id}-body)`;

  // onion skin
  const ghosts: {x: number; y: number; r: number; o: number}[] = [];
  if (trail) {
    for (let k = 1; k <= 6; k++) {
      const g = poseAt(beats, f - k * 1.6);
      const d = Math.hypot(g.x - pose.x, g.y - pose.y);
      const o = clamp(d / R - 0.6) * (1 - k / 7);
      if (o > 0.02) ghosts.push({x: g.x, y: g.y, r: g.r, o});
    }
  }

  // contact shadow
  const lift = floor !== undefined ? floor - (pose.y + R) : 0;
  const shadowK = floor !== undefined ? 1 - clamp(lift / (R * 7)) : 0;

  const bottomShift = R * (1 - sqY);

  return (
    <svg width={width} height={height} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <defs>
        <radialGradient id={`${id}-body`} gradientUnits="userSpaceOnUse" cx={-R * 0.28} cy={-R * 0.4} r={R * 1.5}>
          <stop offset="0%" stopColor="#A6DA86" />
          <stop offset="45%" stopColor={GREEN} />
          <stop offset="100%" stopColor="#62A542" />
        </radialGradient>
        <linearGradient id={`${id}-white`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9DCD2" />
          <stop offset="32%" stopColor={SCLERA} />
          <stop offset="100%" stopColor={SCLERA} />
        </linearGradient>
        <clipPath id={`${id}-eye`}>
          <ellipse cx={0} cy={0} rx={Wx} ry={Hy} />
        </clipPath>
        <filter id={`${id}-mb`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </defs>

      {shadowK > 0 && (
        <ellipse
          cx={pose.x}
          cy={floor! + 3}
          rx={R * (0.35 + 0.6 * shadowK) * sqX}
          ry={R * 0.1}
          fill={ground === 'paper' ? INK : '#000'}
          opacity={0.16 * shadowK}
        />
      )}

      {ghosts.map((g, i) => (
        <circle key={i} cx={g.x} cy={g.y} r={g.r * 0.97} fill="none" stroke={th.ghost} strokeWidth={2} opacity={g.o} />
      ))}

      <g transform={`translate(${pose.x} ${pose.y + bottomShift}) scale(${sqX} ${sqY})`}>
        <g transform={`rotate(${angle}) scale(${along} ${across})`} filter={blur > 0.6 ? `url(#${id}-mb)` : undefined}>
          <g transform={`rotate(${-angle}) scale(${1 - breath * 0.008} ${1 + breath * 0.014})`}>
            <circle r={R} fill={`url(#${id}-body)`} />
            {/* plain = the logo's own flat dot, so the merge is seamless */}
            {plain > 0 && <circle r={R} fill={GREEN} opacity={plain} />}
            <g transform={`rotate(${face.tilt * faceOp})`} opacity={faceOp}>
              <path d={browPath} stroke={GREEN_DEEP} strokeWidth={R * 0.1} strokeLinecap="round" fill="none" />
              <g transform={`translate(${ex} ${ey})`}>
                <g clipPath={`url(#${id}-eye)`}>
                  <rect x={-Wx} y={-Hy} width={Wx * 2} height={Hy * 2} fill={`url(#${id}-white)`} />
                  <g transform={`translate(${px} ${py})`}>
                    <circle r={pr + R * 0.055} fill={GREEN_DEEP} />
                    <circle r={pr} fill={INK} />
                    <circle cx={-pr * 0.36} cy={-pr * 0.4} r={R * 0.075} fill="#fff" />
                    <circle cx={pr * 0.34} cy={pr * 0.32} r={R * 0.032} fill="#fff" opacity={0.85} />
                  </g>
                  <path d={upperEdge} transform={`translate(0 ${R * 0.05})`} stroke="#000" strokeOpacity={0.13} strokeWidth={R * 0.09} fill="none" />
                  <path d={lowerPath} fill={lidFill} />
                  <path d={upperPath} fill={lidFill} />
                  <path d={upperEdge} stroke={GREEN_DEEP} strokeWidth={R * 0.05} fill="none" strokeLinecap="round" />
                  <path d={lowerEdge} stroke={GREEN_DEEP} strokeWidth={R * (0.03 + 0.03 * lowerRaise)} fill="none" strokeLinecap="round" opacity={clamp(lowerRaise * 4) * 0.85} />
                </g>
                <ellipse rx={Wx} ry={Hy} fill="none" stroke={GREEN_DEEP} strokeWidth={R * 0.03} opacity={0.55} />
              </g>
            </g>
            <path
              d={`M ${-R * 0.72} ${-R * 0.34} A ${R * 0.8} ${R * 0.8} 0 0 1 ${-R * 0.3} ${-R * 0.74}`}
              stroke="#fff"
              strokeOpacity={0.4 * (1 - plain)}
              strokeWidth={R * 0.07}
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
