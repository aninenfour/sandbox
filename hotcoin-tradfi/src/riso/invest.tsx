import React from 'react';
import {Corner, Dots, INK, Label, Person, Pt, Shadow, Sheet, VB, clamp, ease, reg, toPerson, twos} from './kit';
import {GROUND_Y as GROUND, Intro, Outro, S} from './scenes';

// "Why we invest": the same rule as "Why we trade" (one everyday thing, way too big), told slower.
// Square cut: the part of each 9:16 print that the 1:1 version shows.
const SQ: Record<string, VB> = {stack: [-60, 470, 1200, 1200], key: [-60, 520, 1220, 1220], mug: [-40, 330, 1340, 1340], pillow: [-40, 560, 1160, 1160]};

const Hand: React.FC<{at: Pt; s: number; p: string}> = ({at, s, p}) => (
  <g>
    <circle cx={at[0]} cy={at[1]} r={34 * s} fill={INK.paper} />
    <circle cx={at[0]} cy={at[1]} r={34 * s} fill={`url(#${p}-skin)`} transform={reg('green')} />
  </g>
);

export const InvestIntro: React.FC<S> = (props) => <Intro {...props} title={['WHY WE', 'INVEST']} sub="" />;
export const InvestOutro: React.FC<S> = (props) => <Outro {...props} lines={['TIME DOES', 'THE HEAVY', 'LIFTING.']} q={['what are you', 'investing for?']} />;

// One giant coin: green edge with pine ridges, green face with a pine ring.
const CW = 120, CH = 52, CRY = 30;
const Coin: React.FC<{cx: number; top: number; p: string}> = ({cx, top, p}) => (
  <g>
    <g transform={reg('green')} fill={INK.green}>
      <rect x={cx - CW} y={top} width={CW * 2} height={CH} />
      <ellipse cx={cx} cy={top + CH} rx={CW} ry={CRY} />
    </g>
    <g style={{mixBlendMode: 'multiply'}} transform={reg('pine')}>
      {Array.from({length: 11}, (_, i) => (
        <line key={i} x1={cx - CW + 14 + i * 21.2} x2={cx - CW + 14 + i * 21.2} y1={top + 14} y2={top + CH - 8 + CRY * Math.sqrt(Math.max(0, 1 - ((i * 21.2 + 14 - CW) / CW) ** 2)) - 6}
          stroke={INK.pine} strokeWidth={4} strokeLinecap="round" />
      ))}
      <rect x={cx + CW * 0.35} y={top} width={CW * 0.65} height={CH + CRY} fill={`url(#${p}-pine)`} />
    </g>
    {/* paper seam under the coin so each one in a stack reads separately */}
    <path d={`M${cx - CW} ${top + CH} A${CW} ${CRY} 0 0 0 ${cx + CW} ${top + CH}`} fill="none" stroke={INK.paper} strokeWidth={9} />
    <ellipse cx={cx} cy={top} rx={CW} ry={CRY} fill={INK.green} transform={reg('green')} />
    <ellipse cx={cx} cy={top} rx={CW * 0.72} ry={CRY * 0.62} fill="none" stroke={INK.pine} strokeWidth={6} transform={reg('pine')} />
  </g>
);

// 1 · STACK BY STACK: stacks of giant coins rising like a bar chart; one more goes on the tallest.
export const Stacks: React.FC<S> = ({f, p, sq}) => {
  const vb = sq ? SQ.stack : undefined;
  const t = twos(f);
  const COLS = [{x: 160, n: 3}, {x: 420, n: 5}, {x: 680, n: 7}, {x: 940, n: 10}];
  const topOf = (n: number) => GROUND - CRY - n * CH;
  const place = ease((t - 28) / 26);
  const landed = topOf(11);
  const coinTop = landed - 120 * (1 - place);
  const settle = t > 54 ? Math.sin(clamp((t - 54) / 10) * Math.PI) * 4 : 0;
  const release = ease((t - 62) / 18);
  const x = 680, y = topOf(7) - 280, s = 0.8;
  const hold = (dx: number, dy: number): Pt => [940 - CW + dx - release * 90, coinTop + CH * 0.6 + dy + release * 60];
  return (
    <Sheet p={p} f={f} vb={vb}>
      <Corner vb={vb}><Label lines={['STACK', 'BY STACK']} x={84} y={170} /></Corner>
      <Shadow cx={560} cy={GROUND + 6} rx={540} ry={40} />
      {COLS.map(({x: cx, n}) => Array.from({length: n}, (_, i) => <Coin key={`${cx}-${i}`} cx={cx} top={topOf(i + 1)} p={p} />))}
      <Person x={x} y={y} s={s} p={p} pose={{
        lean: 6, head: 4,
        handF: toPerson(x, y, s, 1, hold(40, 0)), bendF: 1, handB: toPerson(x, y, s, 1, hold(8, 26)), bendB: 1,
        footB: [-40, 330], footF: [56, 330], breathe: Math.sin(t / 8),
      }} />
      <g transform={`translate(0 ${settle})`}><Coin cx={940} top={coinTop} p={p} /></g>
    </Sheet>
  );
};

// 2 · A HOME ONE DAY: carrying a house key longer than a car.
export const HomeKey: React.FC<S> = ({f, p, sq}) => {
  const vb = sq ? SQ.key : undefined;
  const t = twos(f);
  const w = Math.sin(t / 4), bob = Math.abs(Math.sin(t / 4)) * 9;
  const x = 520, y = GROUND - 280 - bob, s = 0.84;
  const a = (-14 * Math.PI) / 180, u: Pt = [Math.cos(a), Math.sin(a)], n: Pt = [-Math.sin(a), Math.cos(a)];
  const A: Pt = [556, 1150 - bob];
  const P = (d: number, off: number): Pt => [A[0] + d * u[0] + off * n[0], A[1] + d * u[1] + off * n[1]];
  const poly = (pts: Pt[]) => pts.map((q) => q.join(',')).join(' ');
  const shaft = poly([P(-330, -42), P(560, -42), P(560, 42), P(-330, 42)]);
  const collar = poly([P(-345, -66), P(-300, -66), P(-300, 66), P(-345, 66)]);
  const teeth = poly([P(370, 40), P(370, 150), P(420, 150), P(420, 105), P(462, 105), P(462, 175), P(512, 175), P(512, 120), P(560, 120), P(560, 40)]);
  const bow = P(-520, 0);
  const handF = P(130, 0), handB = P(-80, 6);
  return (
    <Sheet p={p} f={f} vb={vb}>
      <Corner vb={vb}><Label lines={['A HOME', 'ONE DAY']} x={84} y={170} /></Corner>
      <Shadow cx={x + 40} cy={GROUND + 8} rx={200} ry={26} />
      <Person x={x} y={y} s={s} p={p} pose={{
        lean: 3, head: -4,
        handF: toPerson(x, y, s, 1, handF), bendF: 1, handB: toPerson(x, y, s, 1, handB), bendB: 1,
        footB: [-40 - 80 * w, 330], footF: [60 + 80 * w, 330], breathe: w,
      }} />
      {/* the key rests on the shoulder, in front of the body */}
      <g transform={reg('green')} fill={INK.green}>
        <circle cx={bow[0]} cy={bow[1]} r={200} />
        <polygon points={shaft} />
        <polygon points={collar} />
        <polygon points={teeth} />
      </g>
      <circle cx={bow[0] - 30} cy={bow[1] - 20} r={72} fill={INK.paper} />
      <Dots box={[bow[0] - 200, bow[1] - 200, 400, 400]} ink="pine" dens={(px, py) => {
        const d = Math.hypot(px - bow[0], py - bow[1]), h = Math.hypot(px - bow[0] + 30, py - bow[1] + 20);
        return d < 198 && h > 76 ? 0.5 * clamp((py - bow[1] + 60) / 200) : 0;
      }} />
      <polygon points={poly([P(-330, 14), P(560, 14), P(560, 42), P(-330, 42)])} fill={`url(#${p}-pine)`} style={{mixBlendMode: 'multiply'}} />
      <Hand at={handB} s={s} p={p} />
      <Hand at={handF} s={s} p={p} />
    </Sheet>
  );
};

// 3 · SLOW MORNINGS: stretching on the rim of a coffee mug the size of a hot tub.
export const SlowMornings: React.FC<S> = ({f, p, sq}) => {
  const vb = sq ? SQ.mug : undefined;
  const t = twos(f);
  const stretch = Math.sin(t / 9);
  const x = 590, y = 1105, s = 0.84;
  const steam = (x0: number, ph: number) => {
    let d = `M${x0} 960`;
    for (let i = 1; i <= 7; i++) d += ` L${x0 + Math.sin(i * 0.9 + t / 7 + ph) * 26} ${960 - i * 48}`;
    return d;
  };
  return (
    <Sheet p={p} f={f} vb={vb}>
      <Corner vb={vb}><Label lines={['SLOW', 'MORNINGS']} x={84} y={170} /></Corner>
      <Shadow cx={600} cy={GROUND + 8} rx={420} ry={36} />
      {/* steam */}
      <g stroke={INK.pine} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" transform={reg('pine')} opacity={0.7}>
        <path d={steam(400, 0)} />
        <path d={steam(560, 2)} />
        <path d={steam(760, 4)} />
      </g>
      {/* handle, coffee surface, then the person sitting in it, then the mug front over their legs */}
      <path d="M880 1120 C 1090 1100 1100 1450 880 1440" stroke={INK.green} strokeWidth={78} strokeLinecap="round" fill="none" transform={reg('green')} />
      <ellipse cx={580} cy={1000} rx={300} ry={48} fill={INK.green} transform={reg('green')} />
      <ellipse cx={580} cy={1004} rx={270} ry={36} fill={INK.pine} transform={reg('pine')} />
      <Person x={x} y={y} s={s} p={p} top="pine" bottom="pine" pose={{
        lean: -4, head: -12,
        handB: [-150 - stretch * 20, -620 + stretch * 20], bendB: 1, handF: [120 + stretch * 20, -630 + stretch * 20], bendF: -1,
        footB: [-40, 300], footF: [60, 300], breathe: stretch,
      }} />
      <clipPath id={`${p}-mug`}><path d="M280 1000 L280 1560 Q280 1640 360 1640 L800 1640 Q880 1640 880 1560 L880 1000 A300 48 0 0 1 280 1000 Z" /></clipPath>
      <path d="M280 1000 L280 1560 Q280 1640 360 1640 L800 1640 Q880 1640 880 1560 L880 1000 A300 48 0 0 1 280 1000 Z" fill={INK.green} transform={reg('green')} />
      <Dots box={[280, 990, 600, 660]} ink="pine" clip={`${p}-mug`} dens={(px, py) => 0.6 * clamp((px - 700) / 180) + 0.3 * clamp((py - 1450) / 190)} />
    </Sheet>
  );
};

// 4 · SLEEP WELL: asleep on a pillow as big as a bed.
export const SleepWell: React.FC<S> = ({f, p, sq}) => {
  const vb = sq ? SQ.pillow : undefined;
  const t = twos(f);
  const hx = 620, hy = 1150, s = 0.84;
  const pillow = 'M-30 1220 Q 540 1150 1110 1220 Q 1040 1430 1110 1650 Q 540 1720 -30 1650 Q 40 1430 -30 1220 Z';
  return (
    <Sheet p={p} f={f} vb={vb}>
      <Corner vb={vb}><Label lines={['SLEEP', 'WELL']} x={84} y={170} /></Corner>
      <clipPath id={`${p}-pillow`}><path d={pillow} /></clipPath>
      <path d={pillow} fill={INK.green} transform={reg('green')} />
      <Dots box={[-40, 1150, 1160, 580]} ink="pine" clip={`${p}-pillow`} dens={(px, py) => 0.55 * clamp((py - 1460) / 220) + 0.35 * clamp((px - 880) / 200)} />
      <ellipse cx={330} cy={1235} rx={200} ry={34} fill={`url(#${p}-pine)`} style={{mixBlendMode: 'multiply'}} />
      <path d="M40 1262 Q 540 1200 1040 1262 Q 985 1430 1040 1610 Q 540 1668 40 1610 Q 95 1430 40 1262 Z" stroke={INK.pine} strokeWidth={6} strokeDasharray="18 14" fill="none" transform={reg('pine')} />
      <g transform={`rotate(-90 ${hx} ${hy})`}>
        <Person x={hx} y={hy} s={s} p={p} top="pine" bottom="pine" pose={{
          handF: [110, -150], bendF: 1, handB: [-30, -470], bendB: 1,
          footB: [-46, 330], footF: [-10, 262], kneeF: -1, breathe: Math.sin(t / 12) * 1.4,
        }} />
      </g>
      {[0, 1, 2].map((i) => {
        const ph = (t / 46 + i / 3) % 1;
        return (
          <text key={i} x={300 + ph * 190} y={1010 - ph * 260} fontFamily='"Archivo Black", sans-serif' fontSize={40 + ph * 46}
            fill={INK.pine} opacity={Math.sin(ph * Math.PI)} transform={reg('pine')}>z</text>
        );
      })}
    </Sheet>
  );
};
