import React from 'react';
import {staticFile} from 'remotion';
import {Dots, INK, Label, Person, Pt, Shadow, Sheet, clamp, ease, reg, toPerson, twos} from './kit';

type S = {f: number; p: string};
const GROUND = 1640;

// 0 · Title print: a small person waves under the title.
export const Intro: React.FC<S> = ({f, p}) => {
  const t = twos(f);
  const x = 760, y = GROUND - 250, s = 0.62;
  const wave = Math.sin(t / 5) * 40;
  return (
    <Sheet p={p} f={f}>
      <Label lines={['WHY WE', 'TRADE']} x={84} y={300} size={150} />
      <text x={88} y={600} fontFamily='"Archivo Black", sans-serif' fontSize={40} fill={INK.pine} transform={reg('pine')}>a few small reasons</text>
      <Dots box={[150, 760, 520, 520]} ink="green" cell={16} dens={(px, py) => 0.85 * clamp(1.15 - Math.hypot(px - 410, py - 1020) / 230)} />
      <Shadow cx={x + 10} cy={GROUND - 30} rx={170} ry={26} />
      <Person x={x} y={y} s={s} dir={-1} p={p} pose={{
        handB: [-40, 20], bendB: -1, handF: toPerson(x, y, s, -1, [x - 230 - wave * 0.4, y - 360 + wave * 0.2]), bendF: 1,
        footB: [-40, 330], footF: [60, 330], breathe: Math.sin(t / 9),
      }} />
    </Sheet>
  );
};

// 1 · SAVING UP: a normal coin into a piggy bank the size of a car.
export const Saving: React.FC<S> = ({f, p}) => {
  const t = twos(f);
  const drop = ease((t - 42) / 14);
  const squash = t > 56 ? 1 - 0.025 * Math.sin(clamp((t - 56) / 16) * Math.PI) : 1;
  const x = 300, y = GROUND - 280, s = 0.84;
  const slot: Pt = [560, 1012];
  const handW: Pt = t < 56 ? [slot[0] - 6, slot[1] - 92 + Math.sin(t / 6) * 6] : [slot[0] - 40, slot[1] - 40 + ease((t - 56) / 20) * 120];
  return (
    <Sheet p={p} f={f}>
      <Label lines={['SAVING', 'UP']} x={84} y={170} />
      <Shadow cx={760} cy={GROUND + 6} rx={520} ry={44} />
      <g transform={`translate(0 ${GROUND}) scale(1 ${squash}) translate(0 ${-GROUND})`}>
        {/* stubby legs behind the body */}
        <g fill={INK.pine} transform={reg('pine')}>
          <rect x={540} y={1440} width={130} height={200} rx={48} />
          <rect x={930} y={1440} width={130} height={200} rx={48} />
        </g>
        {/* curly tail */}
        <path d="M335 1240 q -60 -10 -55 -60 q 6 -45 46 -30 q 30 14 0 40" stroke={INK.pine} strokeWidth={22} strokeLinecap="round" fill="none" transform={reg('pine')} />
        {/* body, ear, eye */}
        <clipPath id={`${p}-pig`}><ellipse cx={790} cy={1260} rx={440} ry={310} /></clipPath>
        <path d="M860 1000 q 50 -180 160 -170 q 0 130 -70 210 z" fill={INK.green} transform={reg('green')} />
        <path d="M890 1000 q 40 -120 112 -128 q -6 90 -54 140 z" fill={`url(#${p}-pine)`} style={{mixBlendMode: 'multiply'}} />
        <ellipse cx={790} cy={1260} rx={440} ry={310} fill={INK.green} transform={reg('green')} />
        <Dots box={[330, 1150, 900, 420]} ink="pine" clip={`${p}-pig`} dens={(px, py) => 0.62 * clamp((py - 1240) / 300)} />
        {/* snout, cropped by the frame edge */}
        <ellipse cx={1125} cy={1235} rx={95} ry={120} fill={INK.green} transform={reg('green')} />
        <ellipse cx={1125} cy={1235} rx={95} ry={120} fill={`url(#${p}-pine)`} style={{mixBlendMode: 'multiply'}} />
        <g fill={INK.pine} transform={reg('pine')}>
          <ellipse cx={1090} cy={1200} rx={13} ry={24} />
          <ellipse cx={1092} cy={1270} rx={13} ry={24} />
        </g>
        <path d="M950 1110 q 18 16 36 0" stroke={INK.black} strokeWidth={10} strokeLinecap="round" fill="none" />
        {/* coin slot */}
        <rect x={slot[0] - 62} y={slot[1] - 13} width={124} height={26} rx={13} fill={INK.pine} transform={`rotate(-24 ${slot[0]} ${slot[1]})`} />
      </g>
      {/* the coin: normal size, falls on the beat */}
      {t < 60 && (
        <g transform={`translate(${handW[0] + 6 + drop * 6} ${t < 42 ? handW[1] + 20 : handW[1] + 20 + drop * 92}) scale(${1 - drop * 0.6} 1)`}>
          <circle r={30} fill={INK.pine} transform={reg('pine')} />
          <circle r={18} fill="none" stroke={INK.paper} strokeWidth={4} />
        </g>
      )}
      <Person x={x} y={y} s={s} p={p} pose={{
        lean: 4, handF: toPerson(x, y, s, 1, handW), bendF: 1,
        handB: [-44, 20], bendB: -1,
        footB: [-40, 330], footF: [70, 326], breathe: Math.sin(t / 9),
      }} />
    </Sheet>
  );
};

// 2 · THE TRIP: a suitcase taller than a door.
export const Trip: React.FC<S> = ({f, p}) => {
  const t = twos(f);
  const tug = Math.sin(t / 7);
  const bx = 8 * tug;
  const x = 230, y = GROUND - 282, s = 0.84;
  const grip: Pt = [430 + bx, 1060];
  return (
    <Sheet p={p} f={f}>
      <Label lines={['THE', 'TRIP']} x={84} y={170} />
      <Shadow cx={780 + bx} cy={GROUND + 6} rx={430} ry={40} />
      <Shadow cx={x + 30} cy={GROUND + 6} rx={170} ry={26} />
      <g transform={`translate(${bx} 0) rotate(${tug * 0.6} 800 ${GROUND})`}>
        {/* handle */}
        <path d="M640 600 L640 470 L900 470 L900 600" stroke={INK.pine} strokeWidth={44} strokeLinejoin="round" strokeLinecap="round" fill="none" transform={reg('pine')} />
        {/* wheels */}
        <g fill={INK.pine} transform={reg('pine')}>
          <circle cx={540} cy={GROUND - 22} r={34} />
          <circle cx={1050} cy={GROUND - 22} r={34} />
        </g>
        <clipPath id={`${p}-case`}><rect x={440} y={590} width={720} height={1010} rx={64} /></clipPath>
        <rect x={440} y={590} width={720} height={1010} rx={64} fill={INK.green} transform={reg('green')} />
        {/* straps and corner guards overprint the green */}
        <g style={{mixBlendMode: 'multiply'}} clipPath={`url(#${p}-case)`}>
          <g fill={INK.pine} transform={reg('pine')}>
            <rect x={560} y={560} width={46} height={1080} />
            <rect x={960} y={560} width={46} height={1080} />
          </g>
        </g>
        <Dots box={[440, 590, 720, 1010]} ink="pine" clip={`${p}-case`} dens={(px, py) => 0.55 * clamp((px - 900) / 260) + 0.25 * clamp((py - 1350) / 250)} />
        {/* side handle the person pulls */}
        <rect x={412 + 0} y={1010} width={48} height={110} rx={22} fill={INK.pine} transform={reg('pine')} />
        {/* travel sticker with a paper plane */}
        <circle cx={790} cy={1110} r={92} fill={INK.pine} transform={reg('pine')} />
        <path d="M735 1132 L845 1080 L812 1150 L790 1128 Z M790 1128 L782 1162 L772 1124 Z" fill={INK.paper} />
      </g>
      <Person x={x} y={y} s={s} p={p} pose={{
        lean: -10 - tug * 3, handF: toPerson(x, y, s, 1, [grip[0] - 6, grip[1] + 10]), bendF: -1,
        handB: toPerson(x, y, s, 1, [grip[0] - 30, grip[1] + 40]), bendB: -1,
        footB: [-70, 330], footF: [90, 326], kneeF: -1, breathe: tug,
      }} />
    </Sheet>
  );
};

// 3 · FOR THEM: a birthday cake as wide as the room, carried overhead.
export const ForThem: React.FC<S> = ({f, p}) => {
  const t = twos(f);
  const wob = Math.sin(t / 8) * 1.6;
  const flick = 1 + 0.12 * Math.sin(t * 1.3) + 0.06 * Math.sin(t * 2.1);
  const x = 560, y = GROUND - 282, s = 0.84;
  const cy = 820; // cake base
  const hold = (w: Pt): Pt => {
    const a = (wob * Math.PI) / 180, dx = w[0] - 560, dy = w[1] - 1000;
    return [560 + dx * Math.cos(a) - dy * Math.sin(a), 1000 + dx * Math.sin(a) + dy * Math.cos(a)];
  };
  return (
    <Sheet p={p} f={f}>
      <Label lines={['FOR', 'THEM']} x={84} y={170} />
      <Shadow cx={x + 10} cy={GROUND + 6} rx={260} ry={30} />
      <g transform={`rotate(${wob} 560 1000)`}>
        {/* candle + flame */}
        <rect x={545} y={250} width={44} height={200} rx={10} fill={INK.pine} transform={reg('pine')} />
        <g transform={`translate(567 236) scale(${2 - flick} ${flick})`}>
          <path d="M0 -70 C 30 -30 34 0 0 18 C -34 0 -30 -30 0 -70 Z" fill={INK.green} transform={reg('green')} />
        </g>
        <clipPath id={`${p}-cake`}><path d={`M120 460 L120 ${cy} A440 92 0 0 0 1000 ${cy} L1000 460 Z`} /></clipPath>
        <path d={`M120 460 L120 ${cy} A440 92 0 0 0 1000 ${cy} L1000 460 Z`} fill={INK.green} transform={reg('green')} />
        <Dots box={[120, 440, 880, 480]} ink="pine" clip={`${p}-cake`} dens={(px) => 0.6 * clamp((px - 760) / 240) + 0.18 * clamp((300 - px) / 180)} />
        {/* icing top and drips overprint the green */}
        <g style={{mixBlendMode: 'multiply'}}>
          <path d="M120 460 A440 92 0 0 1 1000 460 L1000 540 q -40 0 -40 60 q 0 34 -30 34 q -30 0 -30 -60 q 0 -30 -60 -30 q -50 0 -50 90 q 0 30 -30 30 q -30 0 -30 -50 q 0 -36 -60 -36 q -60 0 -60 70 q 0 26 -28 26 q -28 0 -28 -60 q 0 -40 -70 -40 q -40 0 -44 40 q 0 24 -26 24 q -26 0 -28 -70 Z"
            fill={INK.pine} transform={reg('pine')} />
        </g>
        <ellipse cx={560} cy={460} rx={440} ry={92} fill={INK.pine} transform={reg('pine')} />
        <ellipse cx={560} cy={456} rx={380} ry={66} fill={`url(#${p}-glass)`} />
      </g>
      <Person x={x} y={y} s={s} p={p} pose={{
        lean: -2, head: -10,
        handF: toPerson(x, y, s, 1, hold([700, cy + 70])), bendF: 1,
        handB: toPerson(x, y, s, 1, hold([420, cy + 74])), bendB: -1,
        footB: [-80, 330], footF: [90, 330], breathe: Math.sin(t / 9),
      }} />
    </Sheet>
  );
};

// 4 · THE LONG RUN: leaning on an hourglass taller than a house, sand running.
export const LongRun: React.FC<S & {len?: number}> = ({f, p, len = 120}) => {
  const t = twos(f);
  const k = clamp(t / len);
  const x = 330, y = GROUND - 70, s = 0.84;
  const cx = 720, top = 300, neck = 960, bot = 1620;
  const bulb = (y0: number, y1: number, up: boolean) =>
    up ? `M${cx - 270} ${y0} C ${cx - 270} ${y0 + 360} ${cx - 30} ${y1 - 160} ${cx - 22} ${y1} L${cx + 22} ${y1} C ${cx + 30} ${y1 - 160} ${cx + 270} ${y0 + 360} ${cx + 270} ${y0} Z`
      : `M${cx - 22} ${y0} C ${cx - 30} ${y0 + 160} ${cx - 270} ${y1 - 360} ${cx - 270} ${y1} L${cx + 270} ${y1} C ${cx + 270} ${y1 - 360} ${cx + 30} ${y0 + 160} ${cx + 22} ${y0} Z`;
  const topLevel = 640 + k * 220; // sand surface sinks
  const pile = 120 + k * 180; // pile grows
  return (
    <Sheet p={p} f={f}>
      <Label lines={['THE', 'LONG RUN']} x={84} y={170} />
      <Shadow cx={cx} cy={GROUND + 6} rx={420} ry={40} />
      <clipPath id={`${p}-top`}><path d={bulb(top + 60, neck, true)} /></clipPath>
      <clipPath id={`${p}-bot`}><path d={bulb(neck, bot - 60, false)} /></clipPath>
      {/* glass in light halftone */}
      <path d={bulb(top + 60, neck, true)} fill={`url(#${p}-glass)`} />
      <path d={bulb(neck, bot - 60, false)} fill={`url(#${p}-glass)`} />
      {/* sand */}
      <g transform={reg('green')} fill={INK.green}>
        <rect x={cx - 300} y={topLevel} width={600} height={neck - topLevel + 4} clipPath={`url(#${p}-top)`} />
        <path d={`M${cx - 300} ${bot - 60} L${cx - 300} ${bot - 60 - pile * 0.35} Q ${cx} ${bot - 60 - pile * 1.9} ${cx + 300} ${bot - 60 - pile * 0.35} L${cx + 300} ${bot - 60} Z`} clipPath={`url(#${p}-bot)`} />
        <rect x={cx - 5 + Math.sin(t) * 1.5} y={neck - 6} width={10} height={bot - 60 - neck - pile * 0.95} />
      </g>
      <Dots box={[cx - 300, neck, 600, bot - neck]} ink="pine" clip={`${p}-bot`} dens={(px, py) => 0.5 * clamp((px - cx - 60) / 200) * clamp((py - (bot - 60 - pile)) / 120)} />
      {/* frame */}
      <g fill={INK.pine} transform={reg('pine')}>
        <rect x={cx - 330} y={top} width={660} height={64} rx={26} />
        <rect x={cx - 330} y={bot - 64} width={660} height={64} rx={26} />
        <rect x={cx - 316} y={top + 40} width={40} height={bot - top - 80} rx={14} />
        <rect x={cx + 276} y={top + 40} width={40} height={bot - top - 80} rx={14} />
      </g>
      <Shadow cx={x - 60} cy={GROUND + 6} rx={260} ry={26} />
      <Person x={x} y={y} s={s} dir={-1} p={p} pose={{
        lean: -16, head: 6,
        handF: [-30, -470], bendF: 1, handB: [-90, -440], bendB: 1,
        footB: [190, 60], kneeB: -1, footF: [235, 60], kneeF: -1, breathe: Math.sin(t / 10),
      }} />
    </Sheet>
  );
};

// 5 · Close: the line, the question, and the logo on a tiny black label.
export const Outro: React.FC<S> = ({f, p}) => {
  const t = twos(f);
  const a = ease((t - 24) / 16);
  const x = 780, y = GROUND - 250, s = 0.62;
  const wave = Math.sin(t / 5) * 40;
  return (
    <Sheet p={p} f={f}>
      <Label lines={['EVERYONE', 'TRADES FOR', 'SOMETHING.']} x={84} y={360} size={104} />
      <g opacity={a}>
        <text x={88} y={760} fontFamily='"Archivo Black", sans-serif' fontSize={64} fill={INK.pine} transform={reg('pine')}>what&apos;s yours?</text>
      </g>
      <Shadow cx={x + 10} cy={GROUND - 30} rx={170} ry={26} />
      <Person x={x} y={y} s={s} dir={-1} p={p} pose={{
        handB: [-40, 20], bendB: -1, handF: toPerson(x, y, s, -1, [x - 230 - wave * 0.4, y - 360 + wave * 0.2]), bendF: 1,
        footB: [-40, 330], footF: [60, 330], breathe: Math.sin(t / 9),
      }} />
      <g transform={`translate(84 ${GROUND + 70})`}>
        <rect width={300} height={84} rx={14} fill={INK.black} />
        <image href={staticFile('brand/logo.png')} x={26} y={20} width={248} height={47.6} />
      </g>
    </Sheet>
  );
};
