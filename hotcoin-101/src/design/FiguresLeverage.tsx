import React from 'react';
import { interpolate, spring } from 'remotion';
import { COLOR } from './tokens';
import { FF } from './fonts';
import { CLOCK_FPS, useFrame } from './clock';
import { useBeat, useBeat30 } from './motion';

/**
 * LEVERAGE FIGURES — FILE 012
 *
 * Each of these runs a timeline across the whole page rather than a one-off
 * entrance, so there is always something moving: a counter climbing, a line
 * closing in, a path being drawn. Numbers are the simple isolated-margin
 * approximation (liquidation distance is roughly 1 / leverage) and are
 * labelled as approximate where they appear.
 */

const RED = COLOR.red;
const MONO = FF.mono;

const Label: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  color?: string;
  size?: number;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
  weight?: number;
}> = ({ x, y, children, color = 'currentColor', size = 11, anchor = 'start', opacity = 1, weight = 400 }) => (
  <text
    x={x}
    y={y}
    fill={color}
    fontSize={size}
    fontFamily={MONO}
    letterSpacing={1.2}
    textAnchor={anchor}
    opacity={opacity}
    fontWeight={weight}
  >
    {children}
  </text>
);

/* ------------------------------------------------------------------ */
/* NOTIONAL — your margin, and the position it moves.                  */
/* The position bar stretches to 20x while a counter climbs, then a    */
/* 5% slice of the position lights red and so does all of your margin. */
/* ------------------------------------------------------------------ */
export const FigNotional: React.FC<{ delay?: number }> = () => {
  const { t } = useBeat();
  const unit = 12; // $100 of margin
  const lev = interpolate(t, [0.1, 0.44], [1, 20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const posW = unit * lev;
  const hit = interpolate(t, [0.56, 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const labels = interpolate(t, [0.66, 0.76], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x0 = 20;

  return (
    <svg viewBox="0 0 300 186" width="100%" height="100%">
      <Label x={280} y={30} size={30} anchor="end" color={COLOR.green} weight={700}>
        {Math.round(lev)}x
      </Label>

      <Label x={x0} y={46} opacity={0.55}>YOUR MARGIN</Label>
      <rect x={x0} y={54} width={unit} height={34} fill={COLOR.green} />
      <rect x={x0} y={54} width={unit} height={34 * hit} fill={RED} />
      <Label x={x0 + unit + 8} y={76} size={15} weight={600}>$100</Label>
      <Label x={x0 + unit + 64} y={76} color={RED} size={13} opacity={labels}>
        ← IS ALL OF THIS
      </Label>

      <Label x={x0} y={122} opacity={0.55}>THE POSITION IT MOVES</Label>
      <rect x={x0} y={130} width={posW} height={34} fill="currentColor" opacity={0.14} />
      <rect x={x0} y={130} width={posW} height={34} fill="none" stroke={COLOR.green} strokeWidth={1.5} />
      <rect x={x0 + posW - unit} y={130} width={unit} height={34 * hit} fill={RED} />
      <Label x={x0 + 6} y={152} size={15} weight={600}>
        ${Math.round(100 * lev).toLocaleString('en-US')}
      </Label>
      <Label x={x0 + posW} y={182} anchor="end" color={RED} size={13} opacity={labels}>
        A 5% MOVE HERE ↑
      </Label>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* LADDER — each step up in leverage pulls liquidation closer.         */
/* Price wobbles near entry the whole time. At 20x the wobble reaches  */
/* the line, and the position is gone.                                 */
/* ------------------------------------------------------------------ */
const STEPS = [
  { at: 0.06, lev: 2 },
  { at: 0.26, lev: 5 },
  { at: 0.44, lev: 10 },
  { at: 0.6, lev: 20 },
];

export const FigLiqLadder: React.FC<{ delay?: number }> = () => {
  const frame = useFrame();
  const { t } = useBeat();
  const d30 = useBeat30();

  let k = 0;
  for (let i = 0; i < STEPS.length; i++) if (t >= STEPS[i].at) k = i;
  const cur = STEPS[k];
  const prev = STEPS[k - 1] ?? cur;
  const s = spring({
    frame: frame - cur.at * d30,
    fps: CLOCK_FPS,
    config: { damping: 16, mass: 0.9 },
  });
  // distance to liquidation, roughly 1 / leverage
  const dist = 1 / prev.lev + (1 / cur.lev - 1 / prev.lev) * Math.min(1, s);

  const ENTRY = 40;
  const SCALE = 260; // chart units per 100%
  const liqY = ENTRY + dist * SCALE;

  // price noise around entry, which grows in the last stretch
  const amp = interpolate(t, [0, 0.66, 0.86], [4, 6, 15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wob = (x: number) =>
    Math.sin(x * 0.09 + frame * 0.21) * amp * 0.6 +
    Math.sin(x * 0.23 - frame * 0.13) * amp * 0.4;

  const pts: string[] = [];
  for (let x = 0; x <= 200; x += 4) pts.push(`${x === 0 ? 'M' : 'L'} ${40 + x} ${ENTRY + Math.max(0, wob(x))}`);
  const deepest = Math.max(...new Array(51).fill(0).map((_, i) => wob(i * 4)));
  const liquidated = k === STEPS.length - 1 && t > 0.8 && ENTRY + deepest >= liqY - 1;
  const flash = liquidated ? 0.6 + 0.4 * Math.sin(frame * 0.8) : 0;

  return (
    <svg viewBox="0 0 300 200" width="100%" height="100%">
      <line x1={40} y1={ENTRY} x2={240} y2={ENTRY} stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />
      <Label x={36} y={ENTRY + 3} anchor="end" opacity={0.55}>ENTRY</Label>

      <path d={pts.join(' ')} stroke={COLOR.green} strokeWidth={2} fill="none" />

      <line
        x1={40}
        y1={liqY}
        x2={240}
        y2={liqY}
        stroke={RED}
        strokeWidth={liquidated ? 3 : 1.6}
        strokeDasharray="5 4"
      />
      <Label x={36} y={liqY + 3} anchor="end" color={RED}>LIQ</Label>
      <Label x={246} y={liqY + 4} color={RED} size={13}>
        ~{Math.round(dist * 100)}%
      </Label>

      <Label x={280} y={28} anchor="end" size={30} color={COLOR.green} weight={700}>
        {cur.lev}x
      </Label>

      {liquidated ? (
        <Label x={140} y={liqY + 26} anchor="middle" size={17} color={RED} weight={700} opacity={flash}>
          LIQUIDATED
        </Label>
      ) : null}
      <Label x={40} y={194} opacity={0.35} size={9}>
        APPROXIMATE, BEFORE FEES
      </Label>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* CLOCK — one price path, two positions.                              */
/* The same idea at 10x and at 20x. The path dips, recovers and ends   */
/* up. At 20x the dip was enough, so being right arrived too late.     */
/* ------------------------------------------------------------------ */
const WAY: [number, number][] = [
  [0, 0], [0.1, 1.4], [0.2, -1.8], [0.3, -3.6], [0.38, -5.6],
  [0.46, -3.1], [0.56, -6.4], [0.64, -2.4], [0.74, 2.2], [0.86, 5.2], [1, 8],
];
const priceAt = (x: number) => {
  let i = 0;
  while (i < WAY.length - 2 && x > WAY[i + 1][0]) i++;
  const [x0, y0] = WAY[i];
  const [x1, y1] = WAY[i + 1];
  const u = (x - x0) / (x1 - x0);
  const e = u * u * (3 - 2 * u);
  return y0 + (y1 - y0) * e + Math.sin(x * 71) * 0.35;
};

export const FigClock: React.FC<{ delay?: number }> = () => {
  const frame = useFrame();
  const { t } = useBeat();
  const draw = interpolate(t, [0.06, 0.84], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const X0 = 30;
  const W = 220;
  const Y = (pct: number) => 80 - pct * 7; // +10% at 10, -12% at 164

  // first time the path reaches -5%, which is where 20x ends
  let hitX = -1;
  for (let i = 0; i <= 400; i++) {
    const x = i / 400;
    if (priceAt(x) <= -5) {
      hitX = x;
      break;
    }
  }
  const hitShown = hitX >= 0 && draw >= hitX;
  const since = hitShown ? (draw - hitX) * 400 : 0;

  const seg = (from: number, to: number) => {
    const a: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const x = from + ((to - from) * i) / 120;
      a.push(`${i === 0 ? 'M' : 'L'} ${X0 + x * W} ${Y(priceAt(x))}`);
    }
    return a.join(' ');
  };

  return (
    <svg viewBox="0 0 300 190" width="100%" height="100%">
      <line x1={X0} y1={Y(0)} x2={X0 + W} y2={Y(0)} stroke="currentColor" strokeOpacity={0.25} strokeDasharray="2 3" />
      <Label x={X0 - 4} y={Y(0) + 3} anchor="end" opacity={0.5} size={10}>IN</Label>

      <line x1={X0} y1={Y(-5)} x2={X0 + W} y2={Y(-5)} stroke={RED} strokeWidth={1.4} strokeDasharray="5 4" />
      <Label x={X0 + W + 5} y={Y(-5) + 3} color={RED} size={11}>20x</Label>
      <line x1={X0} y1={Y(-10)} x2={X0 + W} y2={Y(-10)} stroke={COLOR.gold} strokeWidth={1.4} strokeDasharray="5 4" />
      <Label x={X0 + W + 5} y={Y(-10) + 3} color={COLOR.gold} size={11}>10x</Label>

      {/* the path, drawn across the page */}
      <path d={seg(0, Math.max(0.001, draw))} stroke={COLOR.green} strokeWidth={2.2} fill="none" strokeLinejoin="round" />

      {hitShown ? (
        <>
          <circle cx={X0 + hitX * W} cy={Y(-5)} r={4 + Math.max(0, 6 - since * 0.4)} fill="none" stroke={RED} strokeWidth={2} />
          <circle cx={X0 + hitX * W} cy={Y(-5)} r={3} fill={RED} />
          <Label x={X0 + hitX * W} y={Y(-5) + 20} anchor="middle" color={RED} size={13} weight={700}>
            20x OUT
          </Label>
        </>
      ) : null}

      {draw > 0.97 ? (
        <Label
          x={X0 + W}
          y={Y(8) - 8}
          anchor="end"
          color={COLOR.green}
          size={13}
          weight={700}
          opacity={interpolate(t, [0.84, 0.9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        >
          10x STILL IN, AND RIGHT
        </Label>
      ) : null}
      <Label x={X0} y={186} opacity={0.35} size={9}>
        ILLUSTRATIVE PRICE PATH
      </Label>
      {/* live tip */}
      <circle
        cx={X0 + draw * W}
        cy={Y(priceAt(draw))}
        r={3.4 + Math.sin(frame * 0.4) * 0.8}
        fill="#EAFFDC"
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* FUNDING — charged on the position, paid out of the margin.          */
/* A tick lands every interval and takes a bite out of your margin     */
/* while a counter keeps the running total.                            */
/* ------------------------------------------------------------------ */
export const FigFunding: React.FC<{ delay?: number }> = () => {
  const frame = useFrame();
  const { t } = useBeat();
  const TICKS = 9;
  const perTick = 2; // dollars, on a $2,000 position at 0.1%
  const X0 = 20;
  const W = 250;

  const done = interpolate(t, [0.1, 0.86], [0, TICKS], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const whole = Math.floor(done);
  const frac = done - whole;
  const paid = whole * perTick;
  const left = 100 - paid;

  return (
    <svg viewBox="0 0 300 180" width="100%" height="100%">
      <Label x={X0} y={22} opacity={0.55}>YOUR $100 MARGIN</Label>
      <rect x={X0} y={30} width={W} height={32} fill="currentColor" opacity={0.1} />
      <rect x={X0} y={30} width={(W * left) / 100} height={32} fill={COLOR.green} />
      {/* the bite being taken right now */}
      {frac > 0 && whole < TICKS ? (
        <rect
          x={X0 + (W * left) / 100 - (W * perTick) / 100}
          y={30}
          width={(W * perTick) / 100}
          height={32}
          fill={RED}
          opacity={interpolate(frac, [0, 0.4, 1], [0, 1, 0.2])}
        />
      ) : null}
      <Label x={X0 + W} y={80} anchor="end" color={RED} size={18} weight={700}>
        -${paid}
      </Label>

      <Label x={X0} y={112} opacity={0.55}>FUNDING, CHARGED ON THE FULL $2,000</Label>
      <line x1={X0} y1={134} x2={X0 + W} y2={134} stroke="currentColor" strokeOpacity={0.25} />
      {new Array(TICKS).fill(0).map((_, i) => {
        const x = X0 + ((i + 1) * W) / (TICKS + 1);
        const on = done >= i + 0.3;
        const pop = on ? Math.max(0, 1 - (done - i - 0.3) * 2) : 0;
        return (
          <g key={i}>
            <line x1={x} y1={126} x2={x} y2={142} stroke={on ? RED : 'currentColor'} strokeOpacity={on ? 1 : 0.3} strokeWidth={on ? 2 : 1} />
            {pop > 0 ? <circle cx={x} cy={134} r={4 + pop * 8} fill="none" stroke={RED} strokeOpacity={pop} /> : null}
          </g>
        );
      })}
      <Label x={X0} y={172} opacity={0.35} size={9}>
        ILLUSTRATIVE RATE, BUSY MARKET
      </Label>
      <circle cx={X0 + ((done + 0.7) * W) / (TICKS + 1)} cy={134} r={2.6 + Math.sin(frame * 0.5) * 0.6} fill="#EAFFDC" opacity={whole < TICKS ? 1 : 0} />
    </svg>
  );
};

export const LEVERAGE_FIGURES = {
  notional: FigNotional,
  liqLadder: FigLiqLadder,
  clock: FigClock,
  funding: FigFunding,
} as const;
