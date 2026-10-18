import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {useFrame} from '../design/clock';
import {Headline, Note, Underline} from '../notebook/Notebook';
import {FONT, GREEN, INK, PAPER, RED, theme} from '../notebook/tokens';
import {clamp, Kicker, lerp, Mono, outBack, sm, Svg, win} from '../notebook/runner';
import {At, Person} from '../ep13/art';
import {Card, Clock, MoneyBag, Shrimp, Wallet, Whale} from './art';
import {S, T, type Geo} from './geo';

const {w, ow} = T;
type SP = {g: Geo};

// ------------------------------------------------------------ shared motion
/** the sea surface is the price: a wave runs right when the whale sells, the level drops behind it */
export const waveFront = (f: number, g: Geo) => lerp(g.whaleX, g.sea.x1 + 300, clamp((f - w('sells')) / 34));
export const seaY = (x: number, f: number, g: Geo) => {
  const started = f >= w('sells');
  const front = waveFront(f, g);
  const bump = started ? -70 * Math.exp(-(((x - front) / 90) ** 2)) * (1 - clamp((f - w('sells') - 30) / 10)) : 0;
  const drop = started && x < front ? 80 * sm((front - x) / 260) : 0;
  return g.sea.y + 7 * Math.sin(x / 70 + f / 7) + bump + drop;
};

type Pt = [number, number];
export const BAG_PTS: Pt[] = [[0, 0.18], [0.2, 0.42], [0.36, 0.62], [0.46, 0.95], [0.58, 0.62], [0.72, 0.38], [0.86, 0.3], [1, 0.24]];
export const bagProg = (f: number) => {
  const keys: [number, number][] = [[S.bag + 4, 0], [w('top'), 0.46], [w('back'), 1]];
  if (f <= keys[0][0]) return 0;
  for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], sm((f - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])));
  return 1;
};
export const chartXY = (g: Geo, px: number, val: number) => ({x: g.chart.x - g.chart.w / 2 + 40 + px * (g.chart.w - 80), y: g.chart.y + g.chart.h / 2 - 40 - val * (g.chart.h - 80)});
export const penAt = (prog: number): Pt => {
  for (let i = 1; i < BAG_PTS.length; i++) {
    const [x1, y1] = BAG_PTS[i];
    if (prog <= x1) {
      const [x0, y0] = BAG_PTS[i - 1];
      return [prog, lerp(y0, y1, (prog - x0) / (x1 - x0))];
    }
  }
  return BAG_PTS[BAG_PTS.length - 1];
};

// ------------------------------------------------------------ cold open: field guide
const SPECIMEN = [
  {cue: () => ow('whales'), label: 'fig. 1   whale'},
  {cue: () => ow('shrimp'), label: 'fig. 2   shrimp'},
  {cue: () => ow('bagholders'), label: 'fig. 3   bagholder'},
];
export const OpenScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {g.cards.map((c, i) => {
          const at = SPECIMEN[i].cue() - 10;
          const d = win(f, at - 6, 14);
          const pop = outBack(win(f, at, 12));
          const k = g.v ? 0.95 : 1;
          return (
            <g key={i}>
              <At x={c.x} y={c.y}>
                <Card w={c.w} h={c.h} draw={d} />
              </At>
              {pop > 0 && (
                <At x={c.x} y={c.y - c.h * 0.06} s={pop * k}>
                  {i === 0 && (
                    <g transform={`scale(${g.v ? 0.8 : 0.7})`}>
                      <Whale tail={Math.sin(f / 8) * 8} />
                    </g>
                  )}
                  {i === 1 && (
                    <g transform="scale(1.9)">
                      <Shrimp flick={Math.sin(f / 4) * 14} />
                    </g>
                  )}
                  {i === 2 && (
                    <g transform="translate(0 80)">
                      <MoneyBag s={1.4} />
                    </g>
                  )}
                </At>
              )}
            </g>
          );
        })}
      </Svg>
      {g.cards.map((c, i) => (
        <Note key={i} at={SPECIMEN[i].cue() - 2} ground="paper" tone="fg" text={SPECIMEN[i].label} size={g.v ? 36 : 38} x={c.x - c.w / 2 + 26} y={c.y + c.h / 2 - 62} rotate={-1} width={300} />
      ))}
      <Note at={ow("you're") - 2} ground="paper" tone="red" text="you?" size={64} x={g.youDot.x + (g.v ? -230 : 90)} y={g.youDot.y - (g.v ? 90 : 60)} from={g.v ? 'right' : 'left'} arrow={{x: g.youDot.x + (g.v ? -g.r - 10 : g.r + 10), y: g.youDot.y, bend: 0.3}} />
      <Kicker g={g} at={4} text="A FIELD GUIDE TO THE MARKET ZOO" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ title
export const TitleScene: React.FC<SP> = ({g}) => {
  const th = theme('paper');
  const t = T.TITLE_AT;
  return (
    <AbsoluteFill>
      <Headline at={t + 2} text="FILE 015 · JARGON" size={g.t1S} x={0} y={g.t1Top} width={g.W} align="center" color={th.fg} stagger={0.7} />
      {g.titleLines.map((l, i) => (
        <Headline key={i} at={t + 6 + i * 6} text={l.t} size={l.s} x={0} y={l.top} width={g.W} align="center" color={th.fg} stagger={1.1} />
      ))}
      <Underline at={t + 44} x={g.W / 2 - g.lastW / 2} y={g.tBase + g.titleLines[g.titleLines.length - 1].s * 0.1} w={g.lastW + g.tDot.r * 2.6} thick={g.v ? 8 : 9} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ whale: moves the price on its own
export const WhaleScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const sells = w('sells');
  const swimIn = sm(win(f, S.whale + 2, sells - 6 - (S.whale + 2)));
  const dive = sm(win(f, sells - 4, 16));
  const wx = lerp(-420, g.whaleX, swimIn) + dive * 160;
  const wy = g.whaleY + dive * 45 + Math.sin(f / 10) * 6;
  const tail = Math.sin(f / 6) * 10 + (f > sells - 6 && f < sells + 8 ? -38 * Math.sin(((f - (sells - 6)) / 14) * Math.PI) : 0);
  const n = 64;
  const pts = Array.from({length: n + 1}).map((_, i) => {
    const x = lerp(g.sea.x0, g.sea.x1, i / n);
    return `${i ? 'L' : 'M'} ${x} ${seaY(x, f, g)}`;
  });
  const floaters = Array.from({length: 9}).map((_, i) => lerp(g.sea.x0 + 80, g.sea.x1 - 80, i / 8)).filter((x) => Math.abs(x - g.rideX) > 90);
  const inn = sm(win(f, S.whale + 2, 12));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <path d={`${pts.join(' ')} L ${g.sea.x1} ${g.H} L ${g.sea.x0} ${g.H} Z`} fill="rgba(94,124,142,0.16)" opacity={inn} />
        <path d={pts.join(' ')} stroke={f > sells + 4 ? RED : GREEN} strokeWidth={g.v ? 6 : 5} fill="none" opacity={inn} strokeLinejoin="round" />
        {floaters.map((x, i) => {
          const y = seaY(x, f, g);
          const tilt = (seaY(x + 6, f, g) - seaY(x - 6, f, g)) * 3;
          return (
            <At key={i} x={x} y={y - 16} s={0.42} rot={tilt}>
              <Shrimp flick={Math.sin(f / 4 + i) * 10} />
            </At>
          );
        })}
        <At x={wx} y={wy} s={g.whaleS} rot={dive * 12}>
          <Whale tail={tail} />
        </At>
      </Svg>
      <Mono x={g.sea.x0} y={g.sea.y - 70} text="PRICE" ground="ink" at={S.whale + 10} size={18} />
      <Headline at={w('thousand') - 4} text="1,000+ BTC" size={g.head.size} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={th.fg} />
      <Mono x={g.v ? 0 : g.head.x + 4} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.head.y + g.head.size * 0.95} text="WHALE · THE USUAL TRACKER LINE" ground="ink" at={w('thousand') + 4} size={g.v ? 22 : 20} />
      <Note at={w('own') - 6} ground="ink" text="big enough to move it" size={g.v ? 42 : 46} x={g.v ? g.cx - 200 : g.cx + 200} y={g.sea.y - (g.v ? 170 : 160)} rotate={-3} />
      <Note at={w('wave') - 4} ground="ink" tone="red" text="everyone feels it" size={g.v ? 40 : 44} x={g.v ? g.cx + 60 : g.cx + 520} y={g.sea.y + (g.v ? 120 : 110)} rotate={-3} />
      <Kicker g={g} at={S.whale + 4} text="THE WHALE" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ shrimp: most of us
export const swarm = (g: Geo) => {
  const cols = g.v ? 7 : 13;
  const rows = g.v ? 8 : 5;
  const out: {x: number; y: number; i: number}[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const x = lerp(g.swarm.x0, g.swarm.x1, (c + 0.5) / cols) + (random(`sx${i}`) - 0.5) * 50;
      const y = lerp(g.swarm.y0, g.swarm.y1, (r + 0.5) / rows) + (random(`sy${i}`) - 0.5) * 40;
      if (Math.hypot(x - g.swarmDot.x, y - g.swarmDot.y) < 110) continue;
      out.push({x, y, i});
    }
  return out;
};
export const ShrimpScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const list = swarm(g);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {list.map((p, k) => {
          const pop = outBack(win(f, w('shrimp') - 6 + (k % 17) * 1.4, 10));
          if (pop <= 0) return null;
          const dx = Math.sin(f / 14 + p.i) * 12;
          const dy = Math.cos(f / 11 + p.i * 0.7) * 6;
          const flip = random(`sf${p.i}`) < 0.35 ? -1 : 1;
          return (
            <g key={p.i} transform={`translate(${p.x + dx} ${p.y + dy}) scale(${pop * 0.62 * flip} ${pop * 0.62})`}>
              <Shrimp flick={Math.sin(f / 3 + p.i) * 14} />
            </g>
          );
        })}
      </Svg>
      <Headline at={w('under') - 4} text="UNDER 1 BTC" size={g.head.size} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={th.fg} />
      <Mono x={g.v ? 0 : g.head.x + 4} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.head.y + g.head.size * 0.95} text="SHRIMP · THE SMALLEST HOLDERS" ground="ink" at={w('under') + 4} size={g.v ? 22 : 20} />
      <Note at={w('most') - 4} ground="ink" text="that's most of us" size={g.v ? 46 : 50} x={g.swarmDot.x + (g.v ? -170 : 60)} y={g.swarm.y0 - (g.v ? 110 : 100)} from="bottom" arrow={{x: g.swarmDot.x + 10, y: g.swarmDot.y - g.r - 12, bend: 0.25}} />
      <Kicker g={g} at={S.shrimp + 4} text="THE SHRIMP" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ bagholder: any size
export const personOnChart = (f: number, g: Geo) => {
  const p = bagProg(f);
  const at = penAt(Math.max(0.46, p));
  return chartXY(g, at[0], at[1]);
};
export const BagScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const p = bagProg(f);
  const pts: Pt[] = [...BAG_PTS.filter(([x]) => x < p), penAt(p)];
  const path = pts.map(([x, v], i) => {
    const q = chartXY(g, x, v);
    return `${i ? 'L' : 'M'} ${q.x} ${q.y}`;
  });
  const peak = chartXY(g, 0.46, 0.95);
  const axes = sm(win(f, S.bag + 2, 12));
  const showP = win(f, w('bought') - 4, 8);
  const pos = personOnChart(f, g);
  const bagS = lerp(0.55, 1.15, sm(win(f, w('top') + 4, w('back') - w('top'))));
  const clockO = outBack(win(f, w('still') - 2, 10));
  const hope = sm(win(f, w('waiting') - 4, 14));
  const ps = g.v ? 1.0 : 1.1;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <g opacity={axes}>
          <line x1={g.chart.x - g.chart.w / 2} y1={g.chart.y + g.chart.h / 2 - 40} x2={g.chart.x + g.chart.w / 2} y2={g.chart.y + g.chart.h / 2 - 40} stroke={th.ghost} strokeWidth={2} />
          <line x1={g.chart.x - g.chart.w / 2 + 20} y1={g.chart.y - g.chart.h / 2} x2={g.chart.x - g.chart.w / 2 + 20} y2={g.chart.y + g.chart.h / 2 - 40} stroke={th.ghost} strokeWidth={2} />
        </g>
        <path d={path.join(' ')} stroke={p > 0.47 ? RED : GREEN} strokeWidth={g.v ? 7 : 6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {showP > 0 && (
          <g opacity={showP}>
            <line x1={peak.x} y1={peak.y - 14} x2={peak.x} y2={peak.y - 90} stroke={INK} strokeWidth={2.4} />
            <path d={`M ${peak.x} ${peak.y - 90} L ${peak.x + 50} ${peak.y - 78} L ${peak.x} ${peak.y - 66} Z`} fill={RED} />
          </g>
        )}
        {hope > 0 && (
          <path
            d={`M ${pos.x + 30} ${pos.y - 140 * ps} Q ${pos.x + 160} ${peak.y - 60} ${peak.x + 200} ${peak.y + 10}`}
            stroke={GREEN}
            strokeWidth={4}
            strokeDasharray="10 10"
            fill="none"
            opacity={hope}
          />
        )}
        {showP > 0 && (
          <g opacity={showP}>
            <At x={pos.x - 10} y={pos.y - 6} s={ps}>
              <Person hold />
            </At>
            <At x={pos.x + 48 * ps} y={pos.y - 20 * ps} s={bagS * ps * 0.7}>
              <MoneyBag />
            </At>
          </g>
        )}
        {clockO > 0 && (
          <At x={pos.x + 150 * ps} y={pos.y - 150 * ps} s={clockO * (g.v ? 0.9 : 1.1)}>
            <Clock t={(f - w('still')) / 30} />
          </At>
        )}
      </Svg>
      <Note at={w('bought') - 2} ground="paper" tone="red" text="bought here" size={g.v ? 44 : 46} x={peak.x - (g.v ? 260 : 300)} y={peak.y - 130} rotate={-3} />
      <Note at={w('holding') - 4} ground="paper" text="still holding" size={g.v ? 44 : 46} x={g.v ? g.cx + 40 : g.chart.x + g.chart.w / 2 - 300} y={g.chart.y + g.chart.h / 2 + 10} rotate={-2} />
      <Mono x={g.chart.x - g.chart.w / 2 + 30} y={g.chart.y - g.chart.h / 2 - 34} text="PRICE · ILLUSTRATIVE" ground="paper" at={S.bag + 10} size={18} />
      <Kicker g={g} at={S.bag + 4} text="THE BAGHOLDER · ANY SIZE" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ an address isn't a person
export const crowdPos = (g: Geo) => {
  const out: {x: number; y: number}[] = [];
  for (let r = 0; r < g.crowd.rows; r++)
    for (let c = 0; c < g.crowd.cols; c++)
      out.push({x: lerp(g.crowd.x0, g.crowd.x1, (c + 0.5) / g.crowd.cols), y: lerp(g.crowd.y0, g.crowd.y1, (r + 1) / g.crowd.rows)});
  return out;
};
export const AddressScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const inn = outBack(win(f, S.address + 4, 14));
  const burst = sm(win(f, w('person') - 2, 22));
  const crowd = crowdPos(g);
  const wb = g.whaleBig;
  const walletO = sm(win(f, w('exchange') - 4, 10));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <g opacity={1 - burst * 0.85}>
          <At x={wb.x} y={wb.y} s={wb.s * inn}>
            <Whale tail={Math.sin(f / 8) * 8} />
          </At>
        </g>
        {burst > 0 &&
          crowd.map((p, i) => {
            const sx = wb.x + (random(`bx${i}`) - 0.5) * 420 * wb.s;
            const sy = wb.y + (random(`by${i}`) - 0.5) * 140 * wb.s;
            const t = clamp(burst * 1.4 - (i % 9) * 0.04);
            const e = sm(t);
            return (
              <At key={i} x={lerp(sx, p.x, e)} y={lerp(sy, p.y, e)} s={lerp(0.12, g.v ? 0.42 : 0.4, e)}>
                <Person tone={i % 3 ? PAPER : '#E6DFCF'} />
              </At>
            );
          })}
        {walletO > 0 && (
          <At x={wb.x} y={wb.y} s={walletO * (g.v ? 0.8 : 0.9)}>
            <Wallet w={240} />
          </At>
        )}
      </Svg>
      <Mono x={wb.x - 200} w={400} align="center" y={wb.y + 100 * (g.v ? 0.8 : 0.9)} text="ONE EXCHANGE WALLET" ground="ink" at={w('exchange')} size={g.v ? 22 : 22} color={th.fg} />
      <Note at={w('person') - 2} ground="ink" tone="red" text="not one person" size={g.v ? 48 : 52} x={wb.x + (g.v ? -130 : 280)} y={wb.y - (g.v ? 230 : 210)} rotate={-4} />
      <Note at={w('crowd') - 2} ground="ink" text="a huge crowd" size={g.v ? 44 : 48} x={g.v ? g.cx - 130 : g.crowd.x1 - 300} y={g.crowd.y1 + (g.v ? 30 : 34)} rotate={-2} />
      <Kicker g={g} at={S.address + 4} text="AN ADDRESS ISN'T A PERSON" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ concentration
export const tiles = (g: Geo) => {
  const t = g.tree;
  const x0 = t.x - t.w / 2;
  const y0 = t.y - t.h / 2;
  const big = [
    {x: x0, y: y0, w: t.w * 0.38, h: t.h},
    {x: x0 + t.w * 0.38 + 6, y: y0, w: t.w * 0.26, h: t.h * 0.58},
    {x: x0 + t.w * 0.38 + 6, y: y0 + t.h * 0.58 + 6, w: t.w * 0.26, h: t.h * 0.42 - 6},
  ];
  const sx = x0 + t.w * 0.64 + 12;
  const sw = t.w - (sx - x0);
  const cols = 8;
  const rows = 12;
  const small: {x: number; y: number; w: number; h: number}[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) small.push({x: sx + (c * sw) / cols, y: y0 + (r * t.h) / rows, w: sw / cols - 3, h: t.h / rows - 3});
  return {big, small, sx, sw};
};
export const ConcScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const {big, small, sx, sw} = tiles(g);
  const sell = w('selling');
  const out = sm(win(f, sell - 2, 14));
  const shake = f > sell && f < sell + 30 ? Math.sin(f * 2.6) * 3 * (1 - (f - sell) / 30) : 0;
  const m = g.mini;
  const mp = (px: number, v: number) => ({x: m.x - m.w / 2 + 30 + px * (m.w - 60), y: m.y + m.h / 2 - 30 - v * (m.h - 60)});
  const dropT = sm(win(f, sell + 2, 16));
  const line = [mp(0, 0.7), mp(0.3, 0.72), mp(0.55, 0.7), mp(0.62, lerp(0.7, 0.25, dropT)), mp(1, lerp(0.7, 0.2, dropT))];
  const friendly = outBack(win(f, w('friendly') - 8, 12));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {big.map((b, i) => {
          const pop = outBack(win(f, S.conc + 6 + i * 4, 12));
          const isOut = i === 0;
          const dx = isOut ? out * (g.v ? 0 : -60) : 0;
          const dy = isOut ? out * (g.v ? -40 : 0) : 0;
          return (
            <rect
              key={i}
              x={b.x + dx}
              y={b.y + dy}
              width={b.w}
              height={b.h}
              rx={6}
              fill={isOut && out > 0.3 ? RED : '#5E7C8E'}
              stroke={INK}
              strokeWidth={2.4}
              opacity={pop * (isOut ? 1 - out * 0.4 : 1)}
            />
          );
        })}
        {small.map((s, i) => {
          const pop = win(f, S.conc + 14 + (i % 24) * 0.6, 8);
          return <rect key={i} x={s.x + shake * (random(`t${i}`) - 0.5) * 2} y={s.y} width={s.w} height={s.h} rx={2} fill={GREEN} opacity={pop * 0.8} />;
        })}
        <g opacity={win(f, S.conc + 10, 10)}>
          <line x1={m.x - m.w / 2} y1={m.y + m.h / 2 - 30} x2={m.x + m.w / 2} y2={m.y + m.h / 2 - 30} stroke={th.ghost} strokeWidth={2} />
          <path d={line.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ')} stroke={dropT > 0.1 ? RED : GREEN} strokeWidth={5} fill="none" strokeLinejoin="round" />
        </g>
        {friendly > 0 && (
          <At x={g.v ? g.cx + 300 : m.x + 120} y={g.v ? m.y - 40 : m.y - m.h / 2 - 90} s={friendly * 0.42}>
            <Whale smile={1} tail={Math.sin(f / 6) * 10} />
          </At>
        )}
      </Svg>
      <Mono x={big[0].x} y={big[0].y - 34} text="A FEW WALLETS" ground="paper" at={S.conc + 10} size={18} color={th.fg} />
      <Mono x={sx} w={sw} y={big[0].y - 34} text="EVERYONE ELSE" ground="paper" at={S.conc + 16} size={18} color={th.fg} />
      <Mono x={m.x - m.w / 2 + 30} y={m.y - m.h / 2 - 4} text="PRICE" ground="paper" at={S.conc + 12} size={18} />
      <Note at={w('check') - 4} ground="paper" text="check who holds the rest" size={g.v ? 44 : 46} x={g.v ? g.cx - 260 : big[0].x} y={g.tree.y + g.tree.h / 2 + (g.v ? 20 : 24)} rotate={-2} />
      <Note at={w('friendly') - 2} ground="paper" tone="red" text="friendly?" size={48} x={g.v ? g.cx + 120 : m.x + 200} y={g.v ? m.y - m.h / 2 - 70 : m.y - m.h / 2 - 200} rotate={-4} />
      <Mono x={g.v ? 0 : m.x - m.w / 2 + 30} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={m.y + m.h / 2 + 10} text="ILLUSTRATIVE" ground="paper" at={S.conc + 14} size={16} />
      <Kicker g={g} at={S.conc + 4} text="CONCENTRATION" ground="paper" />
    </AbsoluteFill>
  );
};
