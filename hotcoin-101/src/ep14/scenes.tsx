import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {useFrame} from '../design/clock';
import {Headline, Note, Underline} from '../notebook/Notebook';
import {FONT, GREEN, INK, RED, theme} from '../notebook/tokens';
import {clamp, Kicker, lerp, Mono, outBack, sm, Svg, win} from '../notebook/runner';
import {At, Bank, Person} from '../ep13/art';
import {Booth, CryptoToken, DollarBill, LunaToken, panAt, Pedestal, Safe, Scale, Seesaw, SILVER, StableToken, Stamp} from './art';
import {chartPt, S, T, type Geo} from './geo';

const {w, ow} = T;
type SP = {g: Geo};

// ------------------------------------------------------------ shared motion
export const scaleTilt = (f: number) => {
  const coin = ow('coin');
  const bill = ow('dollar');
  let t = 0;
  if (f >= coin) t = -14 * sm((f - coin) / 8);
  if (f >= bill) {
    const dt = f - bill;
    t = -14 * Math.exp(-dt / 7) * Math.cos(dt * 0.5);
  }
  if (f >= ow('question')) t += Math.sin((f - ow('question')) * 0.35) * 2.2 * sm((f - ow('question')) / 10);
  return t;
};

type Pt = number[];
const path = (pts: {x: number; y: number}[]) => pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
export const upTo = (pts: Pt[], prog: number) => {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    if (pts[i][0] <= prog) out.push(pts[i]);
    else {
      const a = pts[i - 1];
      const b = pts[i];
      const u = (prog - a[0]) / (b[0] - a[0]);
      out.push([prog, lerp(a[1], b[1], u)]);
      break;
    }
  }
  return out;
};
const prog = (f: number, keys: [number, number][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], sm((f - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])));
  }
  return keys[keys.length - 1][1];
};

export const SVB_PTS: Pt[] = [[0, 1], [0.38, 1], [0.46, 0.84], [0.56, 0.8], [0.68, 0.82], [0.78, 0.99], [1, 1]];
export const svbProg = (f: number) => prog(f, [[w('Which'), 0], [w('slipped'), 0.4], [w('days') + 8, 0.8], [S.vault - 2, 1]]);
export const UST_PTS: Pt[] = [[0, 1], [0.3, 1], [0.38, 0.95], [0.46, 0.72], [0.58, 0.36], [0.72, 0.16], [1, 0.1]];
export const ustProg = (f: number) => prog(f, [[w('May') - 4, 0], [w('broke') + 2, 0.3], [w('cents'), 0.86], [w('week'), 1]]);
export const lastPt = (pts: Pt[]) => pts[pts.length - 1];

// ------------------------------------------------------------ cold open
export const OpenScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const tilt = scaleTilt(f);
  const L = panAt(tilt, -1, g.beam, g.hang);
  const R = panAt(tilt, 1, g.beam, g.hang);
  const inScale = sm(win(f, 2, 14));
  const coinT = win(f, ow('coin') - 8, 8);
  const billT = win(f, ow('dollar') - 8, 8);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <g transform={`translate(${g.pivot.x} ${g.pivot.y + (1 - inScale) * 40})`} opacity={inScale}>
          <Scale tilt={tilt} beam={g.beam} hang={g.hang} post={g.post} />
          {coinT > 0 && (
            <At x={L.x} y={lerp(-g.pivot.y - 120, L.y - 52, coinT * coinT)}>
              <StableToken r={50} label="1" />
            </At>
          )}
          {billT > 0 && (
            <At x={R.x} y={lerp(-g.pivot.y - 120, R.y - 40, billT * billT)} rot={(1 - billT) * 20}>
              <DollarBill w={170} h={80} />
            </At>
          )}
        </g>
      </Svg>
      <Mono x={g.pivot.x + L.x - 120} w={240} align="center" y={g.pivot.y + L.y + 40} text="1 COIN" ground="paper" at={ow('coin')} size={20} />
      <Mono x={g.pivot.x + R.x - 120} w={240} align="center" y={g.pivot.y + R.y + 40} text="$1" ground="paper" at={ow('dollar')} size={20} />
      <Note
        at={ow('question') - 2}
        ground="paper"
        tone="red"
        text="says who?"
        size={g.v ? 52 : 56}
        x={g.pivot.x + (g.v ? 60 : 110)}
        y={g.pivot.y - (g.v ? 210 : 200)}
        from="left"
        arrow={{x: g.pivot.x + 30, y: g.pivot.y - 40, bend: -0.3}}
      />
      <Kicker g={g} at={4} text="ONE COIN, ONE DOLLAR" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ title
export const TitleScene: React.FC<SP> = ({g}) => {
  const th = theme('paper');
  const t = T.TITLE_AT;
  return (
    <AbsoluteFill>
      <Headline at={t + 2} text="FILE 014 · CRYPTO" size={g.t1S} x={0} y={g.t1Top} width={g.W} align="center" color={th.fg} stagger={0.7} />
      {g.v ? (
        <>
          <Headline at={t + 6} text="STABLE" size={g.tS} x={0} y={g.tTop} width={g.W} align="center" color={th.fg} />
          <Headline at={t + 12} text="COINS" size={g.tS} x={0} y={g.tTop + 0.92 * g.tS} width={g.W} align="center" color={th.fg} />
        </>
      ) : (
        <Headline at={t + 6} text="STABLECOINS" size={g.tS} x={0} y={g.tTop} width={g.W} align="center" color={th.fg} />
      )}
      <Underline at={t + 40} x={g.W / 2 - g.tLastW / 2} y={g.tBase + g.tS * 0.1} w={g.tLastW + g.tDot.r * 2.6} thick={g.v ? 8 : 9} />
      <Note at={t + 50} ground="paper" text="explained." size={g.v ? 50 : 48} x={g.v ? g.W / 2 - 110 : g.W / 2 + 260} y={g.tBase + g.tS * (g.v ? 0.3 : 0.26)} rotate={-4} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ type 1: coat check
export const CoatScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const inn = sm(win(f, S.coat + 2, 14));
  const door = sm(win(f, w('hand') - 2, 8)) * (1 - sm(win(f, w('keeps') + 4, 8)));
  // bill: hand -> window -> safe
  const b0 = w('dollar', 1) - 2;
  const bt = win(f, b0, 20);
  const billIn = f >= w('hand') - 6 && bt < 1;
  const safeIn = {x: g.safe.x, y: g.cFloor - g.safe.s / 2};
  let bill = {x: g.hand.x, y: g.hand.y - 40, s: 0.8};
  if (bt > 0) {
    if (bt < 0.5) {
      const u = sm(bt / 0.5);
      bill = {x: lerp(g.hand.x, g.window.x, u), y: lerp(g.hand.y - 40, g.window.y, u) - 60 * 4 * u * (1 - u), s: 0.8};
    } else {
      const u = sm((bt - 0.5) / 0.5);
      bill = {x: lerp(g.window.x, safeIn.x, u), y: lerp(g.window.y, safeIn.y, u) - 60 * 4 * u * (1 - u), s: lerp(0.8, 0.5, u)};
    }
  }
  // token: window -> hand, then the swap-back loop
  const tk = win(f, w('coin', 1) - 4, 14);
  const swapA = win(f, w('swap') - 2, 8);
  const swapB = win(f, w('back', 1) + 2, 8);
  let tok = {x: g.window.x, y: g.window.y, o: 0};
  if (tk > 0) {
    const u = sm(tk);
    tok = {x: lerp(g.window.x, g.hand.x, u), y: lerp(g.window.y, g.hand.y - 50, u) - 70 * 4 * u * (1 - u), o: 1};
  }
  if (swapA > 0) {
    const u = sm(swapA) * (1 - sm(swapB));
    tok = {x: lerp(g.hand.x, g.window.x, u), y: lerp(g.hand.y - 50, g.window.y, u) - 50 * 4 * u * (1 - u), o: 1};
  }
  const arrows = sm(win(f, w('back', 1), 10));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.W * 0.06} y1={g.cFloor} x2={g.W * 0.94} y2={g.cFloor} stroke={INK} strokeWidth={2.4} />
        <g opacity={inn}>
          <At x={g.booth.x} y={g.cFloor}>
            <Booth h={g.booth.h} win={g.booth.win} kw={g.booth.kw} />
          </At>
          <At x={g.safe.x} y={g.cFloor}>
            <Safe s={g.safe.s} door={door}>
              {f > b0 + 20 &&
                [0, 1, 2].map((k) => (
                  <At key={k} x={0} y={-g.safe.s * 0.3 - k * 14} s={0.42}>
                    <DollarBill />
                  </At>
                ))}
            </Safe>
          </At>
          <At x={g.person.x} y={g.cFloor} s={g.person.s}>
            <Person hold />
          </At>
        </g>
        {billIn && (
          <At x={bill.x} y={bill.y} s={bill.s} rot={bt * 30}>
            <DollarBill />
          </At>
        )}
        {tok.o > 0 && (
          <At x={tok.x} y={tok.y} s={0.62}>
            <StableToken />
          </At>
        )}
        {arrows > 0 && (
          <g stroke={GREEN} strokeWidth={4} fill="none" strokeLinecap="round" opacity={arrows}>
            <path d={`M ${g.hand.x + 60} ${g.hand.y - 150} Q ${(g.hand.x + g.window.x) / 2} ${g.hand.y - 230} ${g.window.x - 60} ${g.window.y - 70}`} />
            <path d={`M ${g.window.x - 80} ${g.window.y - 70} l 20 -2 l -8 18`} />
            <path d={`M ${g.window.x - 60} ${g.window.y - 30} Q ${(g.hand.x + g.window.x) / 2} ${g.hand.y - 110} ${g.hand.x + 60} ${g.hand.y - 110}`} />
            <path d={`M ${g.hand.x + 80} ${g.hand.y - 112} l -20 -2 l 10 18`} />
          </g>
        )}
      </Svg>
      <Note at={w('keeps')} ground="paper" text="the reserve" size={46} x={g.safe.x - (g.v ? 120 : 90)} y={g.cFloor - g.safe.s - (g.v ? 140 : 130)} from="bottom" arrow={{x: g.safe.x, y: g.cFloor - g.safe.s - 70, bend: 0.2}} />
      <Note at={w('back', 1) + 4} ground="paper" text="1 : 1" size={56} x={(g.hand.x + g.window.x) / 2 - 40} y={g.hand.y - (g.v ? 330 : 320)} rotate={-3} />
      <Kicker g={g} at={S.coat + 4} text="TYPE 1 · BACKED BY CASH" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ USDC and SVB
export const SvbScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const c = g.chart;
  const p = svbProg(f);
  const pts = upTo(SVB_PTS, p).map(([x, v]) => chartPt(c, x, v, 0.6));
  const peg = chartPt(c, 0, 1, 0.6).y;
  const axes = sm(win(f, S.svb + 6, 12));
  const failed = w('failed');
  const crack = win(f, failed, 14);
  const red = win(f, failed + 4, 8);
  const drop = sm(win(f, failed + 10, 14));
  const link = sm(win(f, w('billion', 1) - 4, 10));
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    const col = i % 3;
    const rw = Math.floor(i / 3);
    const x = g.grid.x + col * (g.cell.w + 8);
    const y = g.grid.y + rw * (g.cell.h + 8);
    const pop = outBack(win(f, S.svb + 8 + i * 1.5, 8));
    const isSvb = i === 11;
    const dy = isSvb ? drop * 140 : 0;
    cells.push(
      <g key={i} transform={`translate(${x + g.cell.w / 2} ${y + g.cell.h / 2 + dy}) scale(${pop}) rotate(${isSvb ? drop * 25 : 0})`} opacity={isSvb ? 1 - drop * 0.6 : 1}>
        <rect x={-g.cell.w / 2} y={-g.cell.h / 2} width={g.cell.w} height={g.cell.h} rx={4} fill={isSvb && red > 0 ? RED : GREEN} opacity={isSvb ? 0.9 : 0.85} />
        <text y={8} textAnchor="middle" fontFamily={FONT.display} fontSize={22} fill={INK}>
          $
        </text>
      </g>,
    );
  }
  const last = {x: g.grid.x + 2 * (g.cell.w + 8) + g.cell.w / 2, y: g.grid.y + 3 * (g.cell.h + 8) + g.cell.h / 2};
  const bankTop = {x: g.svbBank.x, y: g.svbBank.y - 390 * g.svbBank.s};
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {link > 0 && <line x1={last.x} y1={last.y} x2={lerp(last.x, bankTop.x, link)} y2={lerp(last.y, bankTop.y + 40, link)} stroke={th.ghost} strokeWidth={2} strokeDasharray="6 6" />}
        {cells}
        <g opacity={sm(win(f, w('bank', 1) - 10, 10))}>
          <g transform={`translate(${g.svbBank.x} ${g.svbBank.y}) scale(${g.svbBank.s})`}>
            <Bank crack={crack} sag={14 * sm(win(f, failed + 6, 10))} />
            <text x={0} y={-259} textAnchor="middle" fontFamily={FONT.mono} fontSize={30} letterSpacing={6} fill={INK}>
              SVB
            </text>
          </g>
        </g>
        {/* chart */}
        <g opacity={axes}>
          <line x1={c.x - c.w / 2 + 40} y1={c.y + c.h / 2 - 40} x2={c.x + c.w / 2 - 40} y2={c.y + c.h / 2 - 40} stroke={th.ghost} strokeWidth={1.6} />
          <line x1={c.x - c.w / 2 + 40} y1={peg} x2={c.x + c.w / 2 - 40} y2={peg} stroke={th.fg} strokeWidth={1.6} strokeDasharray="8 8" opacity={0.6} />
        </g>
        <path d={path(pts)} stroke={p > 0.4 && p < 0.78 ? RED : GREEN} strokeWidth={g.v ? 6 : 5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      </Svg>
      <Mono x={c.x - c.w / 2 + 40} y={peg - 34} text="$1.00 PEG" ground="ink" at={S.svb + 10} size={18} />
      <Headline at={w('three') - 4} text="$3.3B" size={g.big.size} x={g.big.x} y={g.big.y} width={g.v ? g.big.w : undefined} align={g.v ? 'center' : 'left'} color={th.fg} />
      <Note at={w('failed') + 4} ground="ink" tone="red" text="about 8% of reserves" size={g.v ? 40 : 42} x={g.v ? g.grid.x + 300 : g.grid.x + 270} y={g.grid.y + (g.v ? 0 : 120)} from="left" arrow={{x: last.x + 30, y: last.y - 10, bend: 0.25}} />
      <Note at={w('days') - 6} ground="ink" text="back after a few days" size={40} x={c.x + (g.v ? -60 : 20)} y={peg - (g.v ? 110 : 100)} rotate={-3} />
      <Mono x={c.x + c.w / 2 - 300} w={260} align="right" y={c.y + c.h / 2 - 28} text="ILLUSTRATIVE" ground="ink" at={S.svb + 14} size={16} />
      <Kicker g={g} at={S.svb + 4} text="USDC · MARCH 2023" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ type 2: more crypto than you borrow
export const lockedCount = (f: number) => Math.round(15 - 3 * sm(win(f, w('falls') - 2, w('far') + 10 - (w('falls') - 2))));
export const VaultScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const nL = f < w('lock') - 4 ? Math.floor(15 * sm(win(f, S.vault + 6, 20))) : lockedCount(f);
  const nR = Math.floor(10 * sm(win(f, w('borrow') - 6, 14)));
  const sold = w('sold');
  const stamp = clamp((f - (sold - 4)) / 6);
  const lineY = g.vFloor - 12.5 * g.row;
  const lineO = sm(win(f, w('falls') - 8, 8));
  const glow = sm(win(f, w('first'), 10));
  const coinStack = (x: number, n: number, kind: 'crypto' | 'stable', key: string) =>
    Array.from({length: n}).map((_, i) => (
      <g key={`${key}${i}`} transform={`translate(${x + (random(`${key}${i}`) - 0.5) * 8} ${g.vFloor - (i + 0.5) * g.row})`}>
        <rect x={-g.coinW / 2} y={-g.row / 2 + 2} width={g.coinW} height={g.row - 4} rx={(g.row - 4) / 2} fill={kind === 'crypto' ? SILVER : '#FFFFFF'} stroke={kind === 'crypto' ? INK : GREEN} strokeWidth={kind === 'crypto' ? 2 : 3} />
      </g>
    ));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.W * 0.06} y1={g.vFloor} x2={g.W * 0.94} y2={g.vFloor} stroke={INK} strokeWidth={2.4} />
        {coinStack(g.colL, nL, 'crypto', 'l')}
        {coinStack(g.colR, nR, 'stable', 'r')}
        {nL > 0 && (
          <At x={g.colL} y={g.vFloor - nL * g.row - 40} s={1.2}>
            <CryptoToken />
          </At>
        )}
        {nR > 0 && (
          <At x={g.colR} y={g.vFloor - nR * g.row - 44} s={0.7}>
            <StableToken />
          </At>
        )}
        {lineO > 0 && <line x1={g.colL - g.coinW / 2 - 40} y1={lineY} x2={g.colL + g.coinW / 2 + 40} y2={lineY} stroke={RED} strokeWidth={3} strokeDasharray="10 8" opacity={lineO} />}
        {stamp > 0 && (
          <g transform={`translate(${g.colL} ${g.vFloor - 6 * g.row}) rotate(-8) scale(${lerp(2.4, 1, stamp * stamp)})`} opacity={clamp(stamp * 3)}>
            <Stamp text="SOLD" w={g.coinW + 20} />
          </g>
        )}
        {glow > 0 && <rect x={g.colR - g.coinW / 2 - 16} y={g.vFloor - nR * g.row - 100} width={g.coinW + 32} height={nR * g.row + 100} rx={14} fill="none" stroke={GREEN} strokeWidth={4} opacity={glow} />}
      </Svg>
      <Mono x={g.colL - 150} w={300} align="center" y={g.vFloor + 18} text="LOCKED" ground="paper" at={w('lock')} size={20} color={th.fg} />
      <Mono x={g.colR - 150} w={300} align="center" y={g.vFloor + 18} text="BORROWED" ground="paper" at={w('borrow')} size={20} color={th.fg} />
      <Note at={w('lock') + 4} ground="paper" text="say $150" size={44} x={g.colL - g.coinW / 2 - (g.v ? 10 : 190)} y={g.vFloor - 15 * g.row - (g.v ? 150 : 90)} rotate={-4} />
      <Note at={w('borrow') + 2} ground="paper" text="for $100" size={44} x={g.colR - (g.v ? 80 : 60)} y={g.vFloor - 10 * g.row - (g.v ? 160 : 150)} rotate={-4} />
      <Mono x={g.colL + g.coinW / 2 + 50} y={lineY - 12} text="SELL LINE" ground="paper" at={w('falls')} size={16} color={RED} />
      <Note at={w('first') + 2} ground="paper" text="coin still covered" size={42} x={g.colR - (g.v ? 160 : 140)} y={g.vFloor + (g.v ? 70 : 60)} rotate={-2} />
      <Mono x={g.v ? 0 : g.W - 420} w={g.v ? g.W : 300} align={g.v ? 'center' : 'right'} y={g.v ? g.vFloor + 150 : g.vFloor + 30} text="ILLUSTRATIVE" ground="paper" at={S.vault + 14} size={16} />
      <Kicker g={g} at={S.vault + 4} text="TYPE 2 · BACKED BY MORE CRYPTO" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ type 3: a formula
export const sawAngle = (f: number) => (f < w('broke') ? Math.sin((f - S.formula) / 9) * 7 : 0);
export const FormulaScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const c = g.fChart;
  const broke = w('broke');
  const b = sm(win(f, broke, 6));
  const ang = sawAngle(f);
  const inn = sm(win(f, S.formula + 4, 12));
  const a = (ang * Math.PI) / 180;
  const endX = g.saw.len - 70;
  // tokens sit on the plank ends; after the break they fall
  const fall = clamp((f - broke) / 10);
  const ustY = lerp(-endX * Math.sin(a) - 16 - 50, g.sawFloor - g.saw.y - 50, fall * fall);
  const lunaY = lerp(endX * Math.sin(a) - 16 - 60, g.sawFloor - g.saw.y - 60, fall * fall);
  const p = ustProg(f);
  const pts = upTo(UST_PTS, p).map(([x, v]) => chartPt(c, x, v, 0));
  const peg = chartPt(c, 0, 1, 0).y;
  const axes = sm(win(f, w('May') - 8, 10));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <g opacity={inn}>
          <line x1={g.saw.x - g.saw.len - 60} y1={g.sawFloor} x2={g.saw.x + g.saw.len + 60} y2={g.sawFloor} stroke={th.ghost} strokeWidth={2} />
          <At x={g.saw.x} y={g.saw.y}>
            <Seesaw angle={ang} broken={b} len={g.saw.len} />
            <At x={-endX * Math.cos(a)} y={ustY} rot={fall * -30}>
              <StableToken r={50} label="UST" red={win(f, broke + 4, 6)} />
            </At>
            <At x={endX * Math.cos(a)} y={lunaY}>
              <LunaToken r={58} crack={win(f, broke + 6, 10)} />
            </At>
          </At>
        </g>
        <g opacity={axes}>
          <line x1={c.x - c.w / 2 + 40} y1={c.y + c.h / 2 - 50} x2={c.x + c.w / 2 - 40} y2={c.y + c.h / 2 - 50} stroke={th.ghost} strokeWidth={1.6} />
          <line x1={c.x - c.w / 2 + 40} y1={peg} x2={c.x + c.w / 2 - 40} y2={peg} stroke={th.fg} strokeWidth={1.6} strokeDasharray="8 8" opacity={0.6} />
        </g>
        {p > 0 && <path d={path(pts)} stroke={p > 0.32 ? RED : GREEN} strokeWidth={g.v ? 6 : 5} fill="none" strokeLinejoin="round" strokeLinecap="round" />}
      </Svg>
      <Mono x={g.saw.x - 260} w={520} align="center" y={g.saw.y - (g.v ? 200 : 190)} text="1 UST  =  $1 OF LUNA" ground="ink" at={w('formula') - 2} size={g.v ? 26 : 24} color={th.fg} />
      <Mono x={c.x - c.w / 2 + 40} y={peg - 34} text="UST · $1.00" ground="ink" at={w('May') - 4} size={18} />
      <Headline at={w('May') - 2} text="MAY 2022" size={g.v ? 90 : 96} x={c.x + c.w / 2 - (g.v ? 380 : 420)} y={c.y - c.h / 2 - (g.v ? 100 : 110)} color={th.fg} />
      <Note at={w('cents') - 4} ground="ink" tone="red" text="about 10 cents" size={42} x={c.x + c.w / 2 - 290} y={c.y - 60} from="bottom" arrow={{x: c.x + c.w / 2 - 110, y: c.y + 30, bend: 0.2}} />
      <Headline at={w('forty-five') - 2} text="$45B" size={g.v ? 120 : 140} x={c.x - c.w / 2 + 50} y={c.y + 10} color={RED} />
      <Note at={w('gone') - 2} ground="ink" text="gone in a week" size={44} x={c.x - c.w / 2 + 60 + 1.93 * (g.v ? 120 : 140) + 24} y={c.y + 60} rotate={-3} />
      <Kicker g={g} at={S.formula + 4} text="TYPE 3 · BACKED BY A FORMULA" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ what stands behind it
const KINDS = ['cash', 'crypto', 'formula'] as const;
export const tokTop = (g: Geo, i: number) => ({x: g.peds[i], y: g.clFloor - (i === 1 ? 210 : g.pedH) - g.tokR - 2});
export const ClaimScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const lawT = clamp((f - w('law')) / 14);
  const glow = sm(win(f, w('standing') - 4, 12));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.W * 0.06} y1={g.clFloor} x2={g.W * 0.94} y2={g.clFloor} stroke={INK} strokeWidth={2.4} />
        {KINDS.map((k, i) => {
          const pop = outBack(win(f, S.claim + 4 + i * 6, 12));
          const t = tokTop(g, i);
          const falling = i === 2 && lawT > 0;
          const tx = falling ? t.x + lawT * 90 : t.x;
          const ty = falling ? lerp(t.y, g.clFloor - g.tokR, lawT * lawT) : t.y;
          return (
            <g key={k} opacity={pop > 0 ? 1 : 0}>
              <g transform={`translate(${g.peds[i]} ${g.clFloor}) scale(${pop})`}>
                <Pedestal kind={k} h={g.pedH} w={g.pedW} />
              </g>
              {pop > 0.5 && (
                <At x={tx} y={ty} rot={falling ? lawT * 120 : 0}>
                  <StableToken r={g.tokR} red={falling ? 1 : 0} />
                </At>
              )}
              {i < 2 && glow > 0 && <rect x={g.peds[i] - g.pedW / 2 - 14} y={g.clFloor - g.pedH - 14} width={g.pedW + 28} height={g.pedH + 14} rx={10} fill="none" stroke={GREEN} strokeWidth={4} opacity={glow} />}
            </g>
          );
        })}
      </Svg>
      {KINDS.map((k, i) => (
        <Mono key={k} x={g.peds[i] - 150} w={300} align="center" y={g.clFloor + 18} text={k.toUpperCase()} ground="paper" at={S.claim + 10 + i * 6} size={20} color={th.fg} />
      ))}
      <Note at={w('law') + 2} ground="paper" tone="red" text="not a law" size={48} x={g.peds[2] - (g.v ? 160 : 100)} y={g.clFloor - g.pedH - (g.v ? 200 : 190)} rotate={-4} />
      <Note at={w('standing') - 2} ground="paper" text="check what's under it" size={g.v ? 44 : 46} x={g.cx - (g.v ? 230 : 240)} y={g.clFloor + (g.v ? 80 : 70)} rotate={-2} />
      <Kicker g={g} at={S.claim + 4} text="WHAT STANDS BEHIND IT" ground="paper" />
    </AbsoluteFill>
  );
};
