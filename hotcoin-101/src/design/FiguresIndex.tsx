import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLOR } from './tokens';
import { FF } from './fonts';
import { useLayout } from './layout';
import { useTheme } from './theme';
import { CLOCK_FPS, useFrame } from './clock';

/**
 * INDEX FIGURES
 *
 * Bespoke diagrams for FILE 011. These carry the episode instead of text, so
 * each one is a full-bleed drawing with at most one line under it.
 */

/* ------------------------------------------------------------------ */
/* Squarified treemap. Same routine run twice, once on equal weights   */
/* and once on real ones, then interpolated, so the index visibly      */
/* redistributes itself rather than cutting between two pictures.      */
/* ------------------------------------------------------------------ */

type Rect = { x: number; y: number; w: number; h: number };

const squarify = (values: number[], W: number, H: number): Rect[] => {
  const total = values.reduce((a, b) => a + b, 0);
  const scaled = values.map((v) => (v / total) * W * H);
  const out: Rect[] = [];

  let x = 0;
  let y = 0;
  let w = W;
  let h = H;
  let i = 0;

  const worst = (row: number[], side: number) => {
    const s = row.reduce((a, b) => a + b, 0);
    const mx = Math.max(...row);
    const mn = Math.min(...row);
    return Math.max((side * side * mx) / (s * s), (s * s) / (side * side * mn));
  };

  while (i < scaled.length) {
    const side = Math.min(w, h);
    const row: number[] = [scaled[i]];
    let j = i + 1;
    while (j < scaled.length && worst(row.concat(scaled[j]), side) <= worst(row, side)) {
      row.push(scaled[j]);
      j++;
    }

    const rowSum = row.reduce((a, b) => a + b, 0);
    if (w >= h) {
      const rw = rowSum / h;
      let cy = y;
      for (const v of row) {
        const rh = v / rw;
        out.push({ x, y: cy, w: rw, h: rh });
        cy += rh;
      }
      x += rw;
      w -= rw;
    } else {
      const rh = rowSum / w;
      let cx = x;
      for (const v of row) {
        const rw2 = v / rh;
        out.push({ x: cx, y, w: rw2, h: rh });
        cx += rw2;
      }
      y += rh;
      h -= rh;
    }
    i = j;
  }
  return out;
};

/** A plausible large-cap weight curve: a few giants, a long tail. */
const CAP_WEIGHTS = new Array(64).fill(0).map((_, i) => 1 / Math.pow(i + 1, 0.92));
const EQUAL_WEIGHTS = new Array(64).fill(1);

export const FigWeightGrid: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const { u } = useLayout();
  const t = useTheme();

  const W = 300;
  const H = 200;
  const flat = squarify(EQUAL_WEIGHTS, W, H);
  const cap = squarify(CAP_WEIGHTS, W, H);

  // hold the equal-weight state, then redistribute
  const m = spring({
    frame: frame - delay - 62,
    fps,
    config: { damping: 24, mass: 1.6, stiffness: 42 },
  });

  return (
    <svg viewBox={`-6 -6 ${W + 12} ${H + 12}`} width="100%" height="100%">
      {flat.map((a, i) => {
        const b = cap[i];
        const r = {
          x: a.x + (b.x - a.x) * m,
          y: a.y + (b.y - a.y) * m,
          w: a.w + (b.w - a.w) * m,
          h: a.h + (b.h - a.h) * m,
        };
        // the giants light up as they take over
        const share = (r.w * r.h) / (W * H);
        const hot = interpolate(share, [0.006, 0.05], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const appear = interpolate(frame - delay, [i * 0.7, i * 0.7 + 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <rect
            key={i}
            x={r.x + 0.7}
            y={r.y + 0.7}
            width={Math.max(0, r.w - 1.4)}
            height={Math.max(0, r.h - 1.4)}
            fill={COLOR.green}
            opacity={appear * (0.16 + hot * 0.74)}
          />
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* DOMINANCE — one bar, split by count and by weight, so the gap       */
/* between "how many" and "how much" is the whole picture.             */
/* ------------------------------------------------------------------ */
export const FigDominance: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const t = useTheme();

  const grow = spring({ frame: frame - delay - 6, fps, config: { damping: 200 } });
  const split = spring({ frame: frame - delay - 30, fps, config: { damping: 22, mass: 1 } });

  const W = 300;
  const barH = 34;
  // by count the ten are a sliver; by weight they are roughly a third
  const byCount = 0.02;
  const byWeight = 0.35;
  const share = byCount + (byWeight - byCount) * split;

  const Row = ({
    y,
    label,
    frac,
    live,
  }: {
    y: number;
    label: string;
    frac: number;
    live: boolean;
  }) => (
    <>
      <text x={0} y={y - 9} fill="currentColor" opacity={0.5} fontSize={9} fontFamily={FF.mono} letterSpacing={1.4}>
        {label}
      </text>
      <rect x={0} y={y} width={W * grow} height={barH} fill="currentColor" opacity={0.12} />
      <rect x={0} y={y} width={W * frac * grow} height={barH} fill={COLOR.green} />
      {live ? (
        <rect x={W * frac * grow - 1.5} y={y - 5} width={3} height={barH + 10} fill="#EAFFDC" />
      ) : null}
    </>
  );

  return (
    <svg viewBox="-8 -22 316 150" width="100%" height="100%">
      <Row y={0} label="BY HOW MANY COMPANIES" frac={byCount} live={false} />
      <Row y={80} label="BY HOW MUCH THEY MOVE IT" frac={share} live />
      <text
        x={W * share * grow + 8}
        y={80 + barH / 2 + 4}
        fill={COLOR.green}
        fontSize={11}
        fontFamily={FF.mono}
        opacity={split}
      >
        THE TEN LARGEST
      </text>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* SURVIVORS — the list edits itself. Chips drop out, new ones arrive. */
/* ------------------------------------------------------------------ */
const OUT = ['KODAK', 'SEARS', 'LEHMAN', 'BLOCKBSTR'];
const IN = ['NVDA', 'TSLA', 'PLTR', 'COIN'];

export const FigSurvivors: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useFrame();
  const fps = CLOCK_FPS;

  const chipW = 64;
  const chipH = 26;
  const gap = 8;
  const W = 4 * chipW + 3 * gap;

  return (
    <svg viewBox={`-10 -34 ${W + 20} 130`} width="100%" height="100%">
      <text x={0} y={-18} fill="currentColor" opacity={0.5} fontSize={9} fontFamily={FF.mono} letterSpacing={1.4}>
        IN THE INDEX
      </text>
      <line x1={0} y1={chipH + 22} x2={W} y2={chipH + 22} stroke="currentColor" strokeOpacity={0.18} strokeWidth={1} />

      {OUT.map((name, i) => {
        const go = spring({ frame: frame - delay - 20 - i * 12, fps, config: { damping: 200 } });
        const arrive = spring({ frame: frame - delay - 30 - i * 12, fps, config: { damping: 18, mass: 0.8 } });
        const x = i * (chipW + gap);
        return (
          <g key={i}>
            {/* the one leaving, falling below the line */}
            <g transform={`translate(${x}, ${go * 46})`} opacity={1 - go}>
              <rect width={chipW} height={chipH} fill="currentColor" opacity={0.1} />
              <text
                x={chipW / 2}
                y={chipH / 2 + 4}
                textAnchor="middle"
                fill="currentColor"
                opacity={0.75}
                fontSize={11}
                fontFamily={FF.mono}
              >
                {name}
              </text>
              <line
                x1={6}
                y1={chipH / 2}
                x2={6 + (chipW - 12) * Math.min(1, go * 2.4)}
                y2={chipH / 2}
                stroke={COLOR.red}
                strokeWidth={2}
              />
            </g>
            {/* the one taking its place */}
            <g transform={`translate(${x}, ${(1 - arrive) * -42})`} opacity={arrive}>
              <rect width={chipW} height={chipH} fill={COLOR.green} />
              <text
                x={chipW / 2}
                y={chipH / 2 + 4}
                textAnchor="middle"
                fill="#0B0D0B"
                fontSize={11}
                fontWeight={600}
                fontFamily={FF.mono}
              >
                {IN[i]}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* DIVERGENCE — same 500 companies, two rules, two different numbers.  */
/* ------------------------------------------------------------------ */
export const FigDivergence: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useFrame();
  const W = 300;
  const H = 150;

  const p = interpolate(frame - delay - 8, [0, 62], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // two paths from one origin: the cap-weighted one runs away
  const pts = (k: number) => {
    const a: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const tt = i / 40;
      const wob = Math.sin(tt * 9 + k * 2) * 5 * tt;
      const y = H - (tt * (k === 0 ? 118 : 66) + wob);
      a.push(`${i === 0 ? 'M' : 'L'} ${tt * W} ${y}`);
    }
    return a.join(' ');
  };

  const Line = ({ k, color, label }: { k: number; color: string; label: string }) => (
    <>
      <path
        d={pts(k)}
        stroke={color}
        strokeWidth={k === 0 ? 3 : 2}
        fill="none"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
      <text
        x={W * p + 6}
        y={H - (p * (k === 0 ? 118 : 66)) + 4}
        fill={color}
        fontSize={10}
        fontFamily={FF.mono}
        opacity={p > 0.12 ? 1 : 0}
      >
        {label}
      </text>
    </>
  );

  return (
    <svg viewBox={`-6 -14 ${W + 90} ${H + 28}`} width="100%" height="100%">
      <line x1={0} y1={H} x2={W} y2={H} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
      <Line k={1} color="rgba(255,255,255,0.45)" label="EQUAL WEIGHT" />
      <Line k={0} color={COLOR.green} label="CAP WEIGHT" />
      <text x={0} y={-4} fill="currentColor" opacity={0.5} fontSize={9} fontFamily={FF.mono} letterSpacing={1.4}>
        SAME 500 COMPANIES, TWO RULES
      </text>
    </svg>
  );
};

export const INDEX_FIGURES = {
  weightGrid: FigWeightGrid,
  dominance: FigDominance,
  survivors: FigSurvivors,
  divergence: FigDivergence,
} as const;

export type IndexFigureName = keyof typeof INDEX_FIGURES;
