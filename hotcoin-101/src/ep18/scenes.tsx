import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {useFrame} from '../design/clock';
import {Headline, Note, Underline} from '../notebook/Notebook';
import {FONT, GREEN, INK, PAPER, RED, theme} from '../notebook/tokens';
import {clamp, Kicker, lerp, Mono, outBack, sm, Svg, win} from '../notebook/runner';
import {S, T, type Geo} from './geo';

const {w, ow, cw} = T;
type SP = {g: Geo};

// ------------------------------------------------------------ cold open: halve it, then try to get it back
/** how full the money column is: 1, then half, then back to full on "double" */
export const colLevel = (f: number) => {
  const half = sm(win(f, ow('half') - 2, 12));
  const dbl = sm(win(f, ow('double') - 4, 16));
  return 1 - 0.5 * half + 0.5 * dbl;
};
export const colTop = (g: Geo, level: number) => g.col.base - g.col.h * level;

export const OpenScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const c = g.col;
  const inn = sm(win(f, 2, 12));
  const level = colLevel(f);
  const fall = sm(win(f, ow('half') - 2, 22));
  const ghost = sm(win(f, ow('think') - 2, ow('back') + 4 - (ow('think') - 2)));
  const nope = outBack(win(f, ow("don't") - 2, 10), 2.4);
  const x0 = c.x - c.w / 2;
  const y = (lv: number) => colTop(g, lv);
  const lx = c.x + c.w / 2 + (g.v ? 34 : 44);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={x0 - 60} y1={c.base} x2={c.x + c.w / 2 + (g.v ? 380 : 520)} y2={c.base} stroke={th.ghost} strokeWidth={2.4} opacity={inn} />
        <line x1={x0 - 30} y1={y(1)} x2={c.x + c.w / 2 + 20} y2={y(1)} stroke={th.ghost} strokeWidth={2.4} strokeDasharray="10 10" opacity={win(f, ow('half'), 10)} />
        {/* the half that falls away */}
        {fall < 1 && f >= ow('half') - 2 && (
          <g transform={`translate(${fall * (g.v ? 140 : 220)} ${fall * fall * 260}) rotate(${fall * 24} ${c.x} ${y(0.75)})`} opacity={1 - fall}>
            <rect x={x0} y={y(1)} width={c.w} height={c.h * 0.5} rx={10} fill={RED} />
          </g>
        )}
        {/* the "half back" guess: only gets to 75% */}
        {ghost > 0 && f < ow('double') + 6 && (
          <rect x={x0} y={y(0.5 + 0.25 * ghost)} width={c.w} height={c.h * 0.25 * ghost} rx={6} fill="none" stroke={th.fg} strokeWidth={3} strokeDasharray="12 10" opacity={1 - win(f, ow('double') - 4, 8)} />
        )}
        <rect x={x0} y={y(level * inn)} width={c.w} height={c.h * level * inn} rx={10} fill={GREEN} stroke={INK} strokeWidth={3} />
        {nope > 0 && f < ow('double') + 2 && (
          <g transform={`translate(${c.x} ${y(0.625)}) scale(${nope})`} opacity={1 - win(f, ow('double') - 4, 6)}>
            <path d="M -50 -50 L 50 50 M 50 -50 L -50 50" stroke={RED} strokeWidth={14} strokeLinecap="round" />
          </g>
        )}
      </Svg>
      <Mono x={lx} y={y(1) - 14} text="START · $100" ground="paper" at={4} size={g.v ? 22 : 22} color={th.fg} />
      <Headline at={ow('half') + 6} text="$50" size={g.v ? 96 : 110} x={lx} y={y(0.5) - (g.v ? 50 : 56)} color={RED} />
      <Mono x={lx} y={y(0.75) - 14} text="+50% · ONLY $75" ground="paper" at={ow('back') - 2} size={g.v ? 22 : 22} color={th.fg} />
      <Note at={ow('double') - 2} ground="paper" text="x2 to get back" size={g.v ? 50 : 56} x={lx} y={y(1) - (g.v ? 120 : 110)} rotate={-3} />
      <Mono x={g.v ? 0 : x0 - 30} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={c.base + 20} text="YOUR ACCOUNT" ground="paper" at={6} size={18} />
      <Kicker g={g} at={4} text="LOSE HALF" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ title
export const TitleScene: React.FC<SP> = ({g}) => {
  const th = theme('paper');
  const t = T.TITLE_AT;
  return (
    <AbsoluteFill>
      <Headline at={t + 2} text="FILE 018 · RISK" size={g.t1S} x={0} y={g.t1Top} width={g.W} align="center" color={th.fg} stagger={0.7} />
      <Headline at={t + 8} text="RISK OF RUIN" size={g.tS} x={0} y={g.tTop} width={g.W} align="center" color={th.fg} stagger={1.1} />
      <Headline at={t + 28} text="THE MATHS OF BLOWING UP" size={g.subS} x={0} y={g.subTop} width={g.W} align="center" color={RED} stagger={0.6} />
      <Underline at={t + 44} x={g.cx - g.tW / 2} y={g.tBase + g.tS * 0.06} w={g.tW + g.tDot.r * 2.6} thick={g.v ? 8 : 9} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ drawdowns: the hole and the climb out
export const PAIRS = [
  {loss: 10, need: 11.1, l: '-10%', n: '+11%'},
  {loss: 50, need: 100, l: '-50%', n: '+100%'},
  {loss: 70, need: 233.3, l: '-70%', n: '+233%'},
];
export const pairCues = () => [
  {down: w('ten'), up: w('eleven') - 2, upDur: 10},
  {down: w('half'), up: w('hundred') - 2, upDur: 12},
  {down: w('seventy'), up: w('two') - 2, upDur: w('thirty-three') + 10 - (w('two') - 2)},
];
export const upGrow = (f: number, i: number) => {
  const c = pairCues()[i];
  return sm(win(f, c.up, c.upDur));
};
export const ddUpTop = (g: Geo, f: number, i: number) => g.dd.base - PAIRS[i].need * g.dd.k * upGrow(f, i);

export const DrawdownScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const d = g.dd;
  const cues = pairCues();
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.v ? 40 : 160} y1={d.base} x2={g.v ? g.W - 40 : g.W - 160} y2={d.base} stroke={th.ghost} strokeWidth={2.4} opacity={win(f, S.dd + 4, 10)} />
        {PAIRS.map((p, i) => {
          const dn = sm(win(f, cues[i].down - 2, 10));
          const up = upGrow(f, i);
          const x = d.xs[i];
          const hD = p.loss * d.k * dn;
          const hU = p.need * d.k * up;
          return (
            <g key={i}>
              {dn > 0 && <rect x={x - d.bw * 1.05} y={d.base + 4} width={d.bw} height={hD} rx={6} fill={RED} />}
              {up > 0 && <rect x={x + d.bw * 0.05} y={d.base - 4 - hU} width={d.bw} height={hU} rx={6} fill={GREEN} />}
            </g>
          );
        })}
      </Svg>
      {PAIRS.map((p, i) => (
        <React.Fragment key={i}>
          <Mono x={d.xs[i] - d.bw * 1.05 - 20} w={d.bw + 40} align="center" y={d.base + 4 + p.loss * d.k + 12} text={p.l} ground="ink" at={cues[i].down + 6} size={g.v ? 24 : 24} color={RED} />
          <Mono x={d.xs[i] + d.bw * 0.05 - 30} w={d.bw + 60} align="center" y={d.base - 4 - p.need * d.k - 40} text={p.n} ground="ink" at={cues[i].up + cues[i].upDur} size={g.v ? 24 : 24} color={GREEN} />
        </React.Fragment>
      ))}
      <Mono x={g.v ? 0 : 120} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={d.base + 70 * d.k + (g.v ? 80 : 70)} text="GAIN NEEDED TO GET BACK = 1 / (1 - LOSS) - 1" ground="ink" at={w('drawdown')} size={g.v ? 18 : 20} />
      <Note at={w('mostly') - 2} ground="ink" tone="red" text="mostly doesn't happen" size={g.v ? 42 : 48} x={g.v ? g.cx - 220 : d.xs[2] - 520} y={g.v ? d.base + 70 * d.k + 120 : d.base - 233 * d.k + 30} rotate={-3} />
      <Headline at={w('thirty-three') - 2} text="+233%" size={g.head.size} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={GREEN} />
      <Kicker g={g} at={S.dd + 4} text="THE MATHS OF A DRAWDOWN" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ a hundred coin flips, and the streak inside them
export const RUN = [63, 64, 65, 66, 67];
export const flips = (): boolean[] => {
  // true = loss. Seeded, then the one clean run of five is set and any other run of four or more broken
  const out = Array.from({length: 100}).map((_, i) => random(`flip18-${i}`) < 0.5);
  RUN.forEach((i) => (out[i] = true));
  out[62] = false;
  out[68] = false;
  let run = 0;
  for (let i = 0; i < 100; i++) {
    if (RUN.includes(i)) {
      run = 0;
      continue;
    }
    run = out[i] ? run + 1 : 0;
    if (run >= 4) {
      out[i] = false;
      run = 0;
    }
  }
  return out;
};
export const cellXY = (g: Geo, i: number) => {
  const c = g.grid.cell;
  return {x: g.grid.x + ((i % 10) - 4.5) * c, y: g.grid.y + (Math.floor(i / 10) - 4.5) * c};
};
export const StreakScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const list = flips();
  const t0 = w('Flip') - 2;
  const t1 = w('hundred', 3) + 16;
  const rr = g.grid.cell * 0.3;
  const runO = sm(win(f, w('run') - 2, 10));
  const a = cellXY(g, RUN[0]);
  const b = cellXY(g, RUN[RUN.length - 1]);
  const pulse = 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {list.map((loss, i) => {
          const p = outBack(win(f, t0 + (i / 100) * (t1 - t0), 6));
          if (p <= 0) return null;
          const {x, y} = cellXY(g, i);
          const inRun = RUN.includes(i);
          const dim = runO > 0 && !inRun ? 1 - runO * 0.55 : 1;
          return loss ? (
            <circle key={i} cx={x} cy={y} r={rr * p} fill="none" stroke={RED} strokeWidth={rr * 0.4} opacity={dim} />
          ) : (
            <circle key={i} cx={x} cy={y} r={rr * p} fill={GREEN} opacity={dim} />
          );
        })}
        {runO > 0 && (
          <rect
            x={a.x - g.grid.cell * 0.5}
            y={a.y - g.grid.cell * 0.5}
            width={b.x - a.x + g.grid.cell}
            height={g.grid.cell}
            rx={g.grid.cell * 0.5}
            fill={`rgba(240,69,63,${0.08 + 0.08 * pulse})`}
            stroke={RED}
            strokeWidth={5}
            opacity={runO}
          />
        )}
      </Svg>
      <Mono x={cellXY(g, 0).x - g.grid.cell * 0.4} y={cellXY(g, 0).y - g.grid.cell - 10} text="100 TRADES · 50/50 · GREEN WIN, RED LOSS" ground="paper" at={t0} size={g.v ? 18 : 18} color={th.fg} />
      <Note at={w('row') - 2} ground="paper" tone="red" text="five in a row" size={g.v ? 46 : 50} x={g.v ? g.cx - 140 : b.x + 60} y={g.v ? cellXY(g, 99).y + g.grid.cell * 0.7 : b.y + g.grid.cell * 0.8} rotate={-3} />
      <Headline at={w('likely') - 4} text="81%" size={g.head.size} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={RED} />
      <Mono x={g.v ? 0 : g.head.x + 4} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.head.y + g.head.size * 0.95} text={g.v ? 'CHANCE OF 5+ LOSSES IN A ROW' : 'CHANCE OF 5+ LOSSES IN A ROW IN 100 FAIR TRADES'} ground="paper" at={w('likely') + 4} size={g.v ? 20 : 20} />
      <Kicker g={g} at={S.streak + 4} text="LOSSES COME IN BUNCHES" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ sizing: same five losses, two accounts
export const RISKS = [0.02, 0.2];
export const stepTimes = (k: number) => {
  const [a, b] = k === 0 ? [w('five', 2) - 4, w('ninety') - 2] : [w('streak') - 6, w('third') - 2];
  return Array.from({length: 5}).map((_, i) => a + (i * (b - a)) / 5);
};
export const gaugeLevel = (f: number, k: number) => {
  let lv = 1;
  stepTimes(k).forEach((t) => {
    const p = sm(win(f, t, 6));
    lv *= 1 - RISKS[k] * p;
  });
  return lv;
};
export const SizeScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const G = g.gauges;
  const ghost = sm(win(f, w('triple') - 4, 14));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {G.xs.map((x, k) => {
          const inn = sm(win(f, k === 0 ? w('Risk') - 6 : w('Risk', 2) - 6, 12));
          if (inn <= 0) return null;
          const lv = gaugeLevel(f, k);
          const top = G.base - G.h;
          const broke = k === 1 && f > w('third') - 2;
          const steps = stepTimes(k);
          return (
            <g key={k} opacity={inn}>
              <rect x={x - G.w / 2} y={top} width={G.w} height={G.h} rx={26} fill="none" stroke={PAPER} strokeWidth={4} />
              <rect x={x - G.w / 2 + 10} y={G.base - 10 - (G.h - 20) * lv} width={G.w - 20} height={(G.h - 20) * lv} rx={18} fill={broke ? RED : GREEN} />
              {k === 1 && ghost > 0 && (
                <rect x={x - G.w / 2 + 10} y={top + 10} width={G.w - 20} height={(G.h - 20) * (1 - lv) * ghost} rx={18} fill="none" stroke={RED} strokeWidth={3} strokeDasharray="12 10" />
              )}
              {steps.map((t, i) => {
                const on = win(f, t, 4);
                const cx0 = x - 2 * 40 + i * 40;
                return <rect key={i} x={cx0 - 15} y={G.chipsY - 15} width={30} height={30} rx={6} fill={on > 0.5 ? RED : 'none'} stroke={on > 0.5 ? RED : th.ghost} strokeWidth={2.4} />;
              })}
            </g>
          );
        })}
      </Svg>
      {G.xs.map((x, k) => {
        const at = k === 0 ? w('Risk') - 4 : w('Risk', 2) - 4;
        return <Mono key={k} x={x - 200} w={400} align="center" y={G.chipsY - 70} text={k === 0 ? 'RISK 2% A TRADE' : 'RISK 20% A TRADE'} ground="ink" at={at} size={g.v ? 22 : 24} color={th.fg} />;
      })}
      <Headline at={w('ninety') - 2} text="90%" size={84} x={G.xs[0] - 200} y={G.base - 10 - (G.h - 20) * 0.9 + 18} width={400} align="center" color={INK} />
      <Headline at={w('third') - 2} text="33%" size={84} x={G.xs[1] - 200} y={G.base - 10 - (G.h - 20) * 0.33 - 100} width={400} align="center" color={PAPER} />
      <Note at={w('fine') - 2} ground="ink" text="annoying, but fine" size={g.v ? 38 : 44} x={G.xs[0] - (g.v ? 190 : 180)} y={G.base + 20} rotate={-2} />
      <Note at={w('triple') - 2} ground="ink" tone="red" text="has to triple" size={g.v ? 40 : 46} x={G.xs[1] - (g.v ? 150 : 140)} y={G.base + 20} rotate={-2} />
      <Mono x={G.xs[1] - 200} w={400} align="center" y={G.base - G.h - 40} text="+205% TO BREAK EVEN" ground="ink" at={w('triple') + 6} size={g.v ? 18 : 20} color={RED} />
      <Note at={w('luck') - 4} ground="ink" text="same luck" size={g.v ? 44 : 50} x={g.cx - (g.v ? 100 : 110)} y={g.v ? G.base + 80 : G.chipsY - 140} rotate={-3} />
      <Kicker g={g} at={S.size + 4} text="SAME STREAK, TWO ACCOUNTS" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ closing: one road keeps going
/** the long road wobbles gently upward; the short one stops at the cliff */
export const roadA = (g: Geo, x: number) => g.road.yA - ((x - g.road.x0) / (g.road.x1 - g.road.x0)) * (g.v ? 60 : 80) + Math.sin(x / 47) * 6;
export const roadB = (g: Geo, x: number) => g.road.yB + Math.sin(x / 41) * 6;
export const closeDraw = (f: number) => sm(win(f, S.close + 4, 40));

export const CloseScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const R = g.road;
  const p = closeDraw(f);
  const xA = lerp(R.x0, R.x1, p);
  const xB = Math.min(R.cliff, lerp(R.x0, R.x1, p));
  const n = 80;
  const pathA = Array.from({length: n + 1}).map((_, i) => {
    const x = lerp(R.x0, xA, i / n);
    return `${i ? 'L' : 'M'} ${x} ${roadA(g, x)}`;
  });
  const pathB = Array.from({length: n + 1}).map((_, i) => {
    const x = lerp(R.x0, xB, i / n);
    return `${i ? 'L' : 'M'} ${x} ${roadB(g, x)}`;
  });
  const fell = xB >= R.cliff - 1;
  const drop = sm(win(f, S.close + 4 + 40 * ((R.cliff - R.x0) / (R.x1 - R.x0)), 12));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <path d={pathA.join(' ')} stroke={GREEN} strokeWidth={g.v ? 9 : 8} fill="none" strokeLinecap="round" />
        {Array.from({length: 16}).map((_, i) => {
          const x = lerp(R.x0 + 40, R.x1 - 40, i / 15);
          return x <= xA ? <circle key={i} cx={x} cy={roadA(g, x)} r={7} fill={PAPER} stroke={INK} strokeWidth={2.4} /> : null;
        })}
        <path d={pathB.join(' ')} stroke={RED} strokeWidth={g.v ? 9 : 8} fill="none" strokeLinecap="round" />
        {fell && (
          <g opacity={drop}>
            <line x1={R.cliff} y1={roadB(g, R.cliff)} x2={R.cliff} y2={roadB(g, R.cliff) + 160 * drop} stroke={RED} strokeWidth={g.v ? 9 : 8} strokeLinecap="round" strokeDasharray="4 14" />
            <path d={`M ${R.cliff + 16} ${roadB(g, R.cliff) - 30} l 40 40 m 0 -40 l -40 40`} stroke={RED} strokeWidth={8} strokeLinecap="round" />
          </g>
        )}
      </Svg>
      <Mono x={R.x0} y={roadA(g, R.x0) - 50} text="RISK 2%" ground="paper" at={S.close + 6} size={g.v ? 22 : 24} color={th.fg} />
      <Mono x={R.x0} y={roadB(g, R.x0) - 50} text="RISK 20%" ground="paper" at={S.close + 6} size={g.v ? 22 : 24} color={RED} />
      <Note at={cw('game') - 2} ground="paper" text="still in the game" size={g.v ? 44 : 50} x={g.v ? g.cx - 40 : R.x1 - 460} y={roadA(g, R.x1) - (g.v ? 120 : 110)} rotate={-3} />
      <Headline at={cw('strategy') - 6} text="SURVIVE" size={g.v ? 170 : 190} x={g.v ? 0 : g.head.x} y={g.v ? g.head.y - 20 : g.head.y + 10} width={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} color={INK} />
      <Kicker g={g} at={S.close + 4} text="THE WHOLE STRATEGY" ground="paper" />
    </AbsoluteFill>
  );
};
