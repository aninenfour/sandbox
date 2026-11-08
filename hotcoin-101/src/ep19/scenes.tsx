import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {useFrame} from '../design/clock';
import {Headline, Note, Underline} from '../notebook/Notebook';
import {FONT, GREEN, INK, PAPER, RED, theme} from '../notebook/tokens';
import {clamp, Kicker, lerp, Mono, outBack, sm, Svg, win} from '../notebook/runner';
import {At, Bank, Person} from '../ep13/art';
import {Coffee, PARCH, PriceTag, Rack, Squiggle, Tree} from './art';
import {S, T, type Geo} from './geo';

const {w, ow, cw} = T;
type SP = {g: Geo};

// ------------------------------------------------------------ cold open: 24 brokers under a tree
export const crowdPos = (g: Geo) => {
  const c = g.crowd;
  return Array.from({length: 24}).map((_, i) => {
    const row = i % 2;
    const k = Math.floor(i / 2);
    const x = lerp(c.x0, c.x1, (k + 0.5 + row * 0.5) / 12.5);
    return {x: x + (random(`cx${i}`) - 0.5) * 16, y: c.y - row * 34, row};
  });
};
export const OpenScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const t = g.tree;
  const grow = sm(win(f, 4, 26));
  const list = crowdPos(g);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.v ? 40 : 160} y1={t.base} x2={g.v ? g.W - 40 : g.W - 160} y2={t.base} stroke={th.ghost} strokeWidth={2.4} opacity={win(f, 2, 8)} />
        <At x={t.x} y={t.base} s={t.s}>
          <Tree grow={grow} />
        </At>
        {list
          .map((p, i) => ({...p, i}))
          .sort((a, b) => a.row - b.row)
          .reverse()
          .map((p) => {
            const pop = outBack(win(f, ow('twenty-four') - 6 + (p.i % 12) * 2 + p.row * 3, 10));
            if (pop <= 0) return null;
            const bob = Math.sin(f / 7 + p.i) * 2;
            return (
              <At key={p.i} x={p.x} y={p.y} s={g.crowd.s * pop * (p.row ? 0.92 : 1)}>
                <Person tone={p.i % 3 ? PAPER : '#E6DFCF'} bob={bob} />
              </At>
            );
          })}
      </Svg>
      <Headline at={ow('seventeen') - 4} text="1792" size={g.head.size} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={th.fg} />
      <Mono x={g.v ? 0 : g.head.x + 4} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.head.y + g.head.size * 0.95} text="24 BROKERS · WALL STREET, NEW YORK" ground="paper" at={ow('twenty-four') + 2} size={g.v ? 20 : 20} />
      <Note at={ow('accidentally') - 2} ground="paper" text="Wall Street, by accident" size={g.v ? 44 : 50} x={g.v ? g.cx - 230 : g.head.x} y={g.v ? g.crowd.y + 40 : g.cy + 60} rotate={-3} />
      <Kicker g={g} at={4} text="A BUTTONWOOD TREE" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ title
export const TitleScene: React.FC<SP> = ({g}) => {
  const th = theme('paper');
  const t = T.TITLE_AT;
  return (
    <AbsoluteFill>
      <Headline at={t + 2} text="FILE 019 · HISTORY" size={g.t1S} x={0} y={g.t1Top} width={g.W} align="center" color={th.fg} stagger={0.7} />
      <Headline at={t + 8} text="UNDER A TREE" size={g.tS} x={0} y={g.tTop} width={g.W} align="center" color={th.fg} stagger={1.1} />
      <Headline at={t + 28} text="HOW WALL STREET BEGAN" size={g.subS} x={0} y={g.subTop} width={g.W} align="center" color={GREEN} stagger={0.6} />
      <Underline at={t + 44} x={g.cx - g.tW / 2} y={g.tBase + g.tS * 0.06} w={g.tW + g.tDot.r * 2.6} thick={g.v ? 8 : 9} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ the agreement
export const DealScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const d = g.doc;
  const inn = outBack(win(f, S.deal + 4, 14));
  const x0 = d.x - d.w / 2;
  const y0 = d.y - d.h / 2;
  const sig = (i: number) => sm(win(f, w('signed') - 2 + i * 0.9, 6));
  const c1 = outBack(win(f, w('deal', 2) - 4, 12));
  const c2 = outBack(win(f, w('nobody') - 4, 12), 2.2);
  const ringR = d.h * 0.14;
  const c1x = x0 + d.w * 0.27;
  const c2x = x0 + d.w * 0.73;
  const cy1 = y0 + d.h * 0.42;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <g transform={`translate(${d.x} ${d.y}) scale(${inn}) translate(${-d.x} ${-d.y})`}>
          <rect x={x0} y={y0} width={d.w} height={d.h} rx={14} fill={PARCH} stroke={PAPER} strokeWidth={3} />
          <rect x={x0 + 18} y={y0 + 18} width={d.w - 36} height={d.h - 36} rx={8} fill="none" stroke="#DCC698" strokeWidth={5} />
          <text x={d.x} y={y0 + 70} textAnchor="middle" fontFamily={FONT.display} fontSize={g.v ? 46 : 44} letterSpacing={3} fill={INK}>
            THE BUTTONWOOD AGREEMENT
          </text>
          <text x={d.x} y={y0 + 108} textAnchor="middle" fontFamily={FONT.mono} fontSize={20} letterSpacing={4} fill={INK} opacity={0.6}>
            NEW YORK · 17 MAY 1792
          </text>
          {Array.from({length: 24}).map((_, i) => {
            const cols = 6;
            const sx = x0 + 70 + (i % cols) * ((d.w - 140) / cols);
            const sy = y0 + d.h - 150 + Math.floor(i / cols) * 30;
            return (
              <g key={i} transform={`translate(${sx} ${sy})`}>
                <Squiggle seed={i} w={(d.w - 200) / cols} draw={sig(i)} />
              </g>
            );
          })}
        </g>
        {c1 > 0 && (
          <g transform={`translate(${c1x} ${cy1}) scale(${c1})`}>
            {Array.from({length: 12}).map((_, i) => {
              const a = (i / 12) * Math.PI * 2 + f / 40;
              return <circle key={i} cx={Math.cos(a) * ringR} cy={Math.sin(a) * ringR} r={ringR * 0.16} fill={GREEN} stroke={INK} strokeWidth={2} />;
            })}
            <circle r={ringR} fill="none" stroke={INK} strokeWidth={2} strokeDasharray="6 8" />
          </g>
        )}
        {c2 > 0 && (
          <g transform={`translate(${c2x} ${cy1}) rotate(-8) scale(${c2})`}>
            <rect x={-ringR * 1.25} y={-ringR * 0.62} width={ringR * 2.5} height={ringR * 1.24} rx={10} fill="rgba(240,69,63,0.08)" stroke={RED} strokeWidth={5} />
            <text x={0} y={ringR * 0.18} textAnchor="middle" fontFamily={FONT.display} fontSize={ringR * 0.62} fill={RED}>
              MIN 0.25%
            </text>
          </g>
        )}
      </Svg>
      <Mono x={c1x - 160} w={320} align="center" y={cy1 + ringR + 22} text="DEAL WITH EACH OTHER FIRST" ground="ink" at={w('first') - 2} size={g.v ? 16 : 16} color={INK} />
      <Mono x={c2x - 160} w={320} align="center" y={cy1 + ringR + 22} text="MINIMUM COMMISSION" ground="ink" at={w('percent') - 2} size={g.v ? 16 : 16} color={INK} />
      <Headline at={w('quarter') - 4} text="0.25%" size={g.head.size} x={g.head.x} y={g.v ? g.head.y : g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={RED} />
      <Note at={w('signed') - 2} ground="ink" text="24 signatures" size={g.v ? 42 : 46} x={g.v ? g.cx + 90 : x0 - 330} y={g.v ? y0 + d.h - 230 : y0 + d.h - 160} rotate={-3} />
      <Kicker g={g} at={S.deal + 4} text="TWO PROMISES" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ what it really was: a club with a door and a price
export const gateAngle = 0; // the gate faces right
export const ClubScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const R = g.ring;
  const rope = sm(win(f, w('club') - 6, 16));
  const gate = win(f, w('door') - 4, 10);
  const tag = outBack(win(f, w('minimum') - 4, 12));
  const gap = 0.32; // radians either side of the gate
  const arcEnd = (Math.PI * 2 - gap * 2) * rope;
  const arc = Array.from({length: 61}).map((_, i) => {
    const a = gap + (i / 60) * arcEnd;
    return `${i ? 'L' : 'M'} ${R.x + Math.cos(a) * R.r} ${R.y + Math.sin(a) * R.r}`;
  });
  const members = Array.from({length: 24}).map((_, i) => {
    const ring = i < 14 ? 0.62 : 0.32;
    const n = i < 14 ? 14 : 10;
    const k = i < 14 ? i : i - 14;
    const a = (k / n) * Math.PI * 2 + (i < 14 ? 0 : 0.3);
    return {x: R.x + Math.cos(a) * R.r * ring, y: R.y + Math.sin(a) * R.r * ring + 30};
  });
  const outsiders = (g.v
    ? [
        {x: R.x - R.r - 40, y: R.y + R.r + 120},
        {x: R.x + R.r + 30, y: R.y + R.r + 140},
        {x: R.x - 60, y: R.y + R.r + 190},
      ]
    : [
        {x: R.x + R.r + 260, y: R.y + 150},
        {x: R.x + R.r + 400, y: R.y + 80},
        {x: R.x - R.r - 160, y: R.y + 160},
        {x: R.x - R.r - 290, y: R.y + 90},
      ]
  ).map((p, i) => ({...p, i}));
  const gx = R.x + R.r;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {rope > 0.01 && <path d={arc.join(' ')} stroke={RED} strokeWidth={10} fill="none" strokeLinecap="round" />}
        {[gap, -gap].map((a, i) => (
          <g key={i} opacity={rope > 0.95 ? 1 : 0}>
            <rect x={R.x + Math.cos(a) * R.r - 9} y={R.y + Math.sin(a) * R.r - 60} width={18} height={70} rx={6} fill="#C9A227" stroke={INK} strokeWidth={2.4} />
          </g>
        ))}
        {gate > 0 && <rect x={gx - 30} y={R.y - Math.sin(gap) * R.r} width={60} height={Math.sin(gap) * R.r * 2} rx={8} fill={`rgba(126,194,90,${0.25 * gate})`} stroke={GREEN} strokeWidth={4} opacity={gate} />}
        {members.map((p, i) => {
          const pop = outBack(win(f, S.club + 6 + i * 0.8, 10));
          return pop > 0 ? (
            <At key={i} x={p.x} y={p.y} s={0.32 * pop}>
              <Person tone={PAPER} bob={Math.sin(f / 8 + i) * 2} />
            </At>
          ) : null;
        })}
        {outsiders.map((p) => {
          const pop = outBack(win(f, w('door') + p.i * 3, 10));
          return pop > 0 ? (
            <At key={p.i} x={p.x} y={p.y} s={0.36 * pop}>
              <Person tone="#B8B6AE" bob={Math.sin(f / 6 + p.i) * 3} />
            </At>
          ) : null;
        })}
        {tag > 0 && (
          <g transform={`translate(${gx} ${R.y - Math.sin(gap) * R.r - 60}) rotate(${Math.sin(f / 12) * 5}) scale(${tag})`}>
            <PriceTag text="0.25%" w={170} color={RED} />
          </g>
        )}
      </Svg>
      <Note at={w('door') - 2} ground="paper" text="a club with a door" size={g.v ? 46 : 50} x={g.v ? g.cx - 220 : R.x - R.r - 420} y={g.v ? R.y - R.r - 150 : R.y - R.r - 10} rotate={-3} />
      <Note at={w('price') - 2} ground="paper" tone="red" text="and a minimum price" size={g.v ? 42 : 46} x={g.v ? g.cx - 60 : gx + 120} y={g.v ? R.y + R.r + 40 : R.y - R.r - 70} rotate={-2} />
      <Mono x={R.x - 200} w={400} align="center" y={R.y - 18} text="MEMBERS" ground="paper" at={S.club + 10} size={18} color={th.fg} />
      <Kicker g={g} at={S.club + 4} text="WHAT IT REALLY WAS" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ the timeline: 1792 to 1975
export const STOPS = () => [
  {year: '1792', at: S.line + 6, label: 'THE TREE'},
  {year: '1793', at: w('coffee') - 4, label: 'COFFEE HOUSE'},
  {year: '1817', at: w('eighteen') - 4, label: 'NY STOCK & EXCHANGE BOARD'},
  {year: '1975', at: w('seventy-five') - 6, label: 'FIXED FEES END'},
];
export const LineScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const L = g.tl;
  const stops = STOPS();
  const span = sm(win(f, S.line + 4, w('seventy-five') - (S.line + 4)));
  const bracket = sm(win(f, w('minimum', 2) - 4, w('centuries') - (w('minimum', 2) - 4)));
  const fall = sm(win(f, w('cheaper') - 6, 16));
  const iconS = g.v ? 0.62 : 0.8;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={L.xs[0] - 60} y1={L.y} x2={lerp(L.xs[0] - 60, L.xs[3] + 80, span)} y2={L.y} stroke={th.ghost} strokeWidth={3} />
        {bracket > 0 && (
          <g>
            <path d={`M ${L.xs[0]} ${L.y - (g.v ? 240 : 250)} v -24 H ${lerp(L.xs[0], L.xs[3], bracket)} v 24`} stroke={RED} strokeWidth={5} fill="none" />
          </g>
        )}
        {stops.map((s, i) => {
          const pop = outBack(win(f, s.at, 12));
          if (pop <= 0) return null;
          const x = L.xs[i];
          return (
            <g key={i}>
              <circle cx={x} cy={L.y} r={12 * pop} fill={i === 3 ? RED : GREEN} stroke={PAPER} strokeWidth={3} />
              <At x={x} y={L.y - 40} s={pop * iconS}>
                {i === 0 && <Tree s={0.42} />}
                {i === 1 && <Coffee s={1.2} steam={(f / 30) % 1} />}
                {i === 2 && <g transform="scale(0.34)"><Bank /></g>}
                {i === 3 && (
                  <g transform={`translate(0 ${-200 + fall * 160}) rotate(${fall * 40})`} opacity={1 - fall * 0.5}>
                    <PriceTag text="0.25%" w={170} color={RED} crack={fall} />
                  </g>
                )}
              </At>
            </g>
          );
        })}
      </Svg>
      {stops.map((s, i) => (
        <React.Fragment key={i}>
          <Mono x={L.xs[i] - 120} w={240} align="center" y={L.y + 28} text={s.year} ground="ink" at={s.at + 2} size={g.v ? 26 : 28} color={th.fg} />
          <Mono x={L.xs[i] - 130} w={260} align="center" y={L.y + 70} text={s.label} ground="ink" at={s.at + 6} size={g.v ? 13 : 16} />
        </React.Fragment>
      ))}
      <Mono x={L.xs[0]} y={L.y - (g.v ? 310 : 320)} text="FIXED MINIMUM COMMISSIONS" ground="ink" at={w('minimum', 2) - 2} size={g.v ? 16 : 20} color={RED} />
      <Headline at={w('centuries') - 4} text="183 YEARS" size={g.head.size} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={th.fg} />
      <Note at={w('cheaper') - 2} ground="ink" text="cheaper for everyone" size={g.v ? 40 : 46} x={g.v ? g.cx - 200 : L.xs[3] - 300} y={L.y + 130} rotate={-3} />
      <Kicker g={g} at={S.line + 4} text="FROM A TREE TO AN EXCHANGE" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ today: servers, and the tree is gone
export const TodayScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const rk = g.racks;
  const gh = g.ghost;
  const fade = 1 - 0.6 * win(f, w('gone') - 4, 14);
  const link = sm(win(f, w('idea') - 4, 16));
  const rx = [rk.x - 170 * rk.s, rk.x, rk.x + 170 * rk.s];
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.v ? 40 : 160} y1={rk.base} x2={g.v ? g.W - 40 : g.W - 160} y2={rk.base} stroke={th.ghost} strokeWidth={2.4} />
        <At x={gh.x} y={gh.base} s={gh.s}>
          <Tree ghost={fade} />
        </At>
        {rx.map((x, i) => {
          const pop = outBack(win(f, S.today + 6 + i * 4, 12));
          return pop > 0 ? (
            <At key={i} x={x} y={rk.base} s={rk.s * pop}>
              <Rack t={f / 6} seed={i} />
            </At>
          ) : null;
        })}
        {link > 0 && (
          <path
            d={`M ${gh.x} ${gh.base - 330 * gh.s} Q ${(gh.x + rk.x) / 2} ${rk.base - 520 * rk.s} ${rk.x} ${rk.base - 320 * rk.s}`}
            stroke={GREEN}
            strokeWidth={5}
            fill="none"
            strokeDasharray="12 12"
            strokeDashoffset={-f}
            opacity={link}
          />
        )}
      </Svg>
      <Note at={w('servers') - 2} ground="paper" text="servers now" size={g.v ? 44 : 48} x={rk.x - (g.v ? 120 : 110)} y={rk.base + 20} rotate={-2} />
      <Note at={w('idea') - 2} ground="paper" text="same idea" size={g.v ? 50 : 56} x={g.v ? g.cx - 120 : (gh.x + rk.x) / 2 - 110} y={g.v ? rk.base - 640 * rk.s : rk.base - 560 * rk.s} rotate={-3} />
      <Kicker g={g} at={S.today + 4} text="TODAY" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ closing: who gets in, and at what price
export const CloseScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const R = g.ring;
  const inn = sm(win(f, S.close + 4, 20));
  const who = win(f, cw('who') - 4, 10);
  const price = outBack(win(f, cw('price') - 6, 12));
  const gap = 0.32;
  const arc = Array.from({length: 61}).map((_, i) => {
    const a = gap + (i / 60) * (Math.PI * 2 - gap * 2) * inn;
    return `${i ? 'L' : 'M'} ${R.x + Math.cos(a) * R.r} ${R.y + Math.sin(a) * R.r}`;
  });
  const gx = R.x + R.r;
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <path d={arc.join(' ')} stroke={GREEN} strokeWidth={10} fill="none" strokeLinecap="round" />
        {Array.from({length: 24}).map((_, i) => {
          const a = (i / 24) * Math.PI * 2 + f / 120;
          const pop = win(f, S.close + 8 + i * 0.6, 8);
          return <circle key={i} cx={R.x + Math.cos(a) * R.r * 0.62} cy={R.y + Math.sin(a) * R.r * 0.62} r={10} fill={PAPER} opacity={pop * 0.85} />;
        })}
        {who > 0 && <rect x={gx - 34} y={R.y - Math.sin(gap) * R.r} width={68} height={Math.sin(gap) * R.r * 2} rx={10} fill={`rgba(126,194,90,${0.15 + 0.2 * pulse})`} stroke={GREEN} strokeWidth={4} opacity={who} />}
        {price > 0 && (
          <g transform={`translate(${gx} ${R.y - Math.sin(gap) * R.r - 60}) rotate(${Math.sin(f / 12) * 5}) scale(${price})`}>
            <PriceTag text="PRICE" w={170} color={INK} />
          </g>
        )}
      </Svg>
      <Mono x={g.v ? 0 : gx + 50} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.v ? R.y + R.r + 40 : R.y + Math.sin(gap) * R.r + 16} text="WHO GETS IN · AT WHAT PRICE" ground="ink" at={cw('who') - 2} size={g.v ? 20 : 20} color={GREEN} />
      <Headline at={cw('agreement') - 4} text="THE AGREEMENT" size={g.v ? 120 : 140} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={th.fg} />
      <Kicker g={g} at={S.close + 4} text="EVERY MARKET, EVER" ground="ink" />
    </AbsoluteFill>
  );
};
