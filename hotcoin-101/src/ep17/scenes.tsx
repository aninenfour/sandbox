import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useFrame} from '../design/clock';
import {Headline, Note, Underline} from '../notebook/Notebook';
import {FONT, GREEN, INK, PAPER, RED, theme} from '../notebook/tokens';
import {clamp, Kicker, lerp, Mono, outBack, sm, Svg, win} from '../notebook/runner';
import {At, Bank, Person} from '../ep13/art';
import {BondCert, BtcCoin, GoldBar, HighJump, House, SLATE, StockCard} from './art';
import {S, T, type Geo} from './geo';

const {w, ow} = T;
type SP = {g: Geo};

// ------------------------------------------------------------ cold open: boring, and pulling every string
const ITEM_CUE = () => [ow('price') - 4, ow('everything') - 4, ow('everything') + 4, ow('crypto') - 4];
const Item: React.FC<{k: number; s: number; f: number}> = ({k, s, f}) => {
  if (k === 0) return <g transform={`translate(0 60)`}><House s={s} /></g>;
  if (k === 1) return <StockCard s={s} />;
  if (k === 2) return <GoldBar s={s} />;
  return <BtcCoin r={56 * s} />;
};
export const certEdge = (g: Geo) => (g.v ? {x: g.cert.x, y: g.cert.y + g.cert.h / 2} : {x: g.cert.x + g.cert.w / 2, y: g.cert.y});

export const OpenScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const c = g.cert;
  const inn = outBack(win(f, 4, 14));
  const zz = 1 - win(f, ow('somehow') - 4, 8);
  const cues = ITEM_CUE();
  const e = certEdge(g);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <At x={c.x} y={c.y} s={inn}>
          <BondCert w={c.w} h={c.h} grey={1 - win(f, ow('sets') - 4, 14)} />
        </At>
        {zz > 0 &&
          [0, 1, 2].map((i) => {
            const t = ((f + i * 14) % 42) / 42;
            return (
              <text key={i} x={c.x + c.w / 2 - 40 + t * 60} y={c.y - c.h / 2 - 90 - t * 90} fontFamily={FONT.hand} fontSize={40 + i * 6} fill={INK} opacity={zz * (1 - t) * win(f, 18, 8)}>
                z
              </text>
            );
          })}
        {g.items.map((it, k) => {
          const at = cues[k];
          const pull = sm(win(f, at, 10));
          const pop = outBack(win(f, at + 6, 12));
          if (pull <= 0) return null;
          const tx = lerp(e.x, it.x, pull);
          const ty = lerp(e.y, it.y, pull);
          const sway = Math.sin(f / 9 + k) * 6 * pop;
          const sag = 40 + 20 * Math.sin(f / 13 + k);
          const mx = (e.x + tx) / 2;
          const my = (e.y + ty) / 2 + sag;
          const hot = k === 3 && f > ow('crypto') - 2;
          return (
            <g key={k}>
              <path d={`M ${e.x} ${e.y} Q ${mx} ${my} ${tx} ${ty}`} stroke={hot ? RED : INK} strokeWidth={hot ? 3.5 : 2.4} fill="none" opacity={0.7} />
              {pop > 0 && (
                <At x={it.x + sway} y={it.y + Math.abs(sway) * 0.5} s={pop * (g.v ? 1.3 : 1.35)} rot={sway * 0.6}>
                  <Item k={k} s={1} f={f} />
                </At>
              )}
            </g>
          );
        })}
      </Svg>
      <Note at={ow('boring') - 2} ground="paper" text="the most boring thing" size={g.v ? 44 : 46} x={g.v ? c.x - 240 : c.x - c.w / 2} y={c.y + c.h / 2 + 24} rotate={-2} />
      <Note at={ow('crypto') + 2} ground="paper" tone="red" text="crypto too" size={g.v ? 46 : 50} x={g.items[3].x + (g.v ? -120 : 100)} y={g.items[3].y + (g.v ? -170 : -40)} rotate={-3} />
      <Kicker g={g} at={4} text="A GOVERNMENT IOU" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ title
export const TitleScene: React.FC<SP> = ({g}) => {
  const th = theme('paper');
  const t = T.TITLE_AT;
  return (
    <AbsoluteFill>
      <Headline at={t + 2} text="FILE 017 · TRADFI" size={g.t1S} x={0} y={g.t1Top} width={g.W} align="center" color={th.fg} stagger={0.7} />
      <Headline at={t + 8} text="BONDS" size={g.tS} x={0} y={g.tTop} width={g.W} align="center" color={th.fg} stagger={1.6} />
      <Headline at={t + 26} text="OR LENDING TO A GOVERNMENT" size={g.subS} x={0} y={g.subTop} width={g.W} align="center" color={GREEN} stagger={0.6} />
      <Underline at={t + 44} x={g.cx - g.tW / 2} y={g.tBase + g.tS * 0.06} w={g.tW + g.tDot.r * 2.6} thick={g.v ? 8 : 9} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ a bond is a loan: the cash flows
export const COUPON_H = 46;
export const couponAt = (i: number) => w('forty') - 4 + (i - 1) * ((w('thousand', 2) - 8 - (w('forty') - 4)) / 9);
export const LoanScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const fl = g.flow;
  const axis = sm(win(f, S.loan + 4, 14));
  const out = sm(win(f, w('thousand') - 4, 12));
  const back = outBack(win(f, w('back') - 6, 14));
  const bw = g.v ? 46 : 64;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={fl.x0 - 30} y1={fl.y} x2={lerp(fl.x0 - 30, fl.x1 + 40, axis)} y2={fl.y} stroke={th.ghost} strokeWidth={2.4} />
        {Array.from({length: 11}).map((_, i) => (
          <g key={i} opacity={win(f, S.loan + 8 + i, 6)}>
            <line x1={g.slotX(i)} y1={fl.y - 6} x2={g.slotX(i)} y2={fl.y + 6} stroke={th.ghost} strokeWidth={2} />
            <text x={g.slotX(i)} y={fl.y + 36} textAnchor="middle" fontFamily={FONT.mono} fontSize={g.v ? 18 : 18} fill={th.ghost}>
              {i === 0 ? 'NOW' : `Y${i}`}
            </text>
          </g>
        ))}
        {out > 0 && <rect x={g.slotX(0) - bw / 2} y={fl.y + 52} width={bw} height={(fl.down - 52) * out} rx={6} fill={SLATE} />}
        {Array.from({length: 10}).map((_, k) => {
          const i = k + 1;
          const p = outBack(win(f, couponAt(i), 8));
          if (p <= 0) return null;
          const h = COUPON_H * p;
          return <rect key={i} x={g.slotX(i) - bw / 2} y={fl.y - 8 - h} width={bw} height={h} rx={6} fill={GREEN} />;
        })}
        {back > 0 && <rect x={g.slotX(10) - bw / 2} y={fl.y - 8 - COUPON_H - (fl.up - COUPON_H) * back} width={bw} height={(fl.up - COUPON_H) * back} rx={6} fill={GREEN} opacity={0.9} stroke={PAPER} strokeWidth={3} />}
      </Svg>
      <Mono x={g.slotX(0) + bw / 2 + 14} y={fl.y + 60} text="YOU LEND $1,000" ground="ink" at={w('dollars')} size={g.v ? 18 : 20} color={th.fg} />
      <Mono x={g.slotX(1) - bw / 2} y={fl.y - 8 - COUPON_H - 40} text="$40" ground="ink" at={couponAt(1) + 4} size={20} color={GREEN} />
      <Mono x={g.slotX(10) - (g.v ? 230 : 400)} y={fl.y - fl.up - 50} text={g.v ? '$1,000 BACK' : '$1,000 BACK + LAST $40'} ground="ink" at={w('back')} size={g.v ? 18 : 20} color={GREEN} />
      <Note at={w('coupon') - 2} ground="ink" text="the coupon" size={g.v ? 46 : 52} x={g.slotX(g.v ? 3 : 4)} y={fl.y - 8 - COUPON_H - (g.v ? 150 : 140)} rotate={-3} from="bottom" arrow={{x: g.slotX(g.v ? 4 : 5), y: fl.y - 8 - COUPON_H - 8, bend: 0.25}} />
      <Headline at={w('loan') - 4} text="A LOAN" size={g.head.size} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={th.fg} />
      <Mono x={g.v ? 0 : g.head.x + 4} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.head.y + g.head.size * 0.95} text="10-YEAR BOND · 4% COUPON · NOT TO SCALE" ground="ink" at={w('loan') + 4} size={g.v ? 20 : 20} />
      <Kicker g={g} at={S.loan + 4} text="WHAT A BOND IS" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ rates up, old bond prices down
const BondCard: React.FC<{c: {x: number; y: number; w: number; h: number}; label: string; pays: string; hi?: boolean; s: number}> = ({c, label, pays, hi, s}) => (
  <g transform={`translate(${c.x} ${c.y}) scale(${s})`}>
    <rect x={-c.w / 2} y={-c.h / 2} width={c.w} height={c.h} rx={18} fill="#F3E9D2" stroke={hi ? GREEN : INK} strokeWidth={hi ? 6 : 3} />
    <text x={-c.w / 2 + 30} y={-c.h / 2 + 50} fontFamily={FONT.mono} fontSize={20} letterSpacing={3} fill={INK} opacity={0.6}>
      {label}
    </text>
    <text x={-c.w / 2 + 28} y={c.h / 2 - 76} fontFamily={FONT.display} fontSize={c.h * 0.36} fill={INK}>
      {pays}
    </text>
    <text x={-c.w / 2 + 30} y={c.h / 2 - 36} fontFamily={FONT.mono} fontSize={18} letterSpacing={3} fill={INK} opacity={0.6}>
      A YEAR
    </text>
  </g>
);
export const OppScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const y = g.yours;
  const n = g.fresh;
  const yIn = outBack(win(f, S.opp + 4, 14));
  const nIn = outBack(win(f, w('fifty') - 6, 14));
  const walk = sm(win(f, w('nobody') - 2, 30));
  const cut = sm(win(f, w('cut') - 2, 14));
  const twin = sm(win(f, w('Rates') - 4, w('down') + 6 - (w('Rates') - 4)));
  const buyersO = 1 - win(f, w('Rates') - 8, 8);
  const tw = g.twin;
  const tx = (p: number) => tw.x - tw.w / 2 + 40 + p * (tw.w - 80);
  const ty = (v: number) => tw.y + tw.h / 2 - 20 - v * (tw.h - 40);
  const seg = (fn: (p: number) => number) =>
    Array.from({length: 41})
      .map((_, i) => i / 40)
      .filter((p) => p <= twin)
      .map((p, i) => `${i ? 'L' : 'M'} ${tx(p)} ${ty(fn(p))}`)
      .join(' ');
  const tag = {x: y.x + y.w / 2 - 70, y: y.y - y.h / 2 - 20};
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <BondCard c={y} label="YOUR BOND" pays="$40" s={yIn} />
        {nIn > 0 && <BondCard c={n} label="NEW BOND" pays="$50" hi s={nIn} />}
        {yIn > 0.9 && (
          <g transform={`translate(${tag.x} ${tag.y}) rotate(${-8 + cut * 26}) translate(0 ${cut * 30})`}>
            <line x1={0} y1={-40} x2={0} y2={0} stroke={INK} strokeWidth={2} />
            <path d="M -70 0 L 70 0 L 70 60 L -70 60 Z" fill={PAPER} stroke={INK} strokeWidth={3} />
            <text x={0} y={44} textAnchor="middle" fontFamily={FONT.display} fontSize={42} fill={cut > 0.3 ? RED : INK}>
              $1,000
            </text>
            {cut > 0.3 && <line x1={-60} y1={30} x2={60 * lerp(-1, 1, clamp((cut - 0.3) / 0.4))} y2={30} stroke={RED} strokeWidth={5} />}
          </g>
        )}
        <g opacity={buyersO}>
          {[0, 1, 2].map((i) => {
            const x0 = y.x - 120 + i * 120;
            const x1 = n.x - 120 + i * 120;
            const t = clamp(walk * 1.3 - i * 0.15);
            const bob = t > 0 && t < 1 ? -Math.abs(Math.sin(f / 3 + i)) * 10 : 0;
            return (
              <At key={i} x={lerp(x0, x1, sm(t))} y={g.buyersY} s={g.v ? 0.7 : 0.75} o={win(f, S.opp + 10 + i * 3, 8)}>
                <Person tone={i === 1 ? '#E6DFCF' : PAPER} bob={bob} />
              </At>
            );
          })}
        </g>
        {twin > 0 && (
          <g>
            <line x1={tw.x - tw.w / 2} y1={tw.y + tw.h / 2 - 20} x2={tw.x + tw.w / 2} y2={tw.y + tw.h / 2 - 20} stroke={th.ghost} strokeWidth={2} />
            <path d={seg((p) => 0.12 + 0.76 * p)} stroke={GREEN} strokeWidth={g.v ? 7 : 6} fill="none" strokeLinecap="round" />
            <path d={seg((p) => 0.88 - 0.76 * p)} stroke={RED} strokeWidth={g.v ? 7 : 6} fill="none" strokeLinecap="round" />
          </g>
        )}
      </Svg>
      <Mono x={tx(1) - 140} y={ty(0.88) - 36} text="RATES" ground="paper" at={w('up') - 2} size={20} color={GREEN} />
      <Mono x={tx(1) - 210} y={ty(0.12) + 12} text="OLD BOND PRICE" ground="paper" at={w('down') - 2} size={20} color={RED} />
      <Note at={w('nobody') - 2} ground="paper" tone="red" text="nobody wants $40" size={g.v ? 42 : 46} x={g.v ? g.cx - 200 : y.x - 160} y={g.v ? g.buyersY + 30 : y.y + y.h / 2 + 22} rotate={-2} />
      <Note at={w('maths') - 4} ground="paper" text="it's just maths" size={g.v ? 44 : 48} x={g.v ? g.cx - 140 : tw.x + 80} y={g.v ? tw.y + tw.h / 2 + 10 : tw.y - tw.h / 2 - 24} rotate={-3} />
      <Kicker g={g} at={S.opp + 4} text="WHY BOND PRICES FALL" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ the ten-year everyone watches
const Watcher: React.FC<{k: number}> = ({k}) => {
  if (k === 0) return <StockCard s={0.9} />;
  if (k === 1) return <g transform="translate(0 50)"><House s={0.9} /></g>;
  if (k === 2) return <GoldBar s={0.9} />;
  return <BtcCoin r={50} />;
};
export const TenScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const t = g.tile;
  const inn = outBack(win(f, w('ten-year') - 6, 14));
  const look = sm(win(f, w('everyone') - 4, 14));
  const stamp = outBack(win(f, w('no') - 4, 10), 2.2);
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {g.watchers.map((p, k) => {
          const pop = outBack(win(f, S.ten + 10 + k * 4, 12));
          if (pop <= 0) return null;
          const ex = lerp(p.x, t.x + (p.x < t.x ? -t.w / 2 : t.w / 2), 0.92);
          const ey = lerp(p.y, t.y + (p.y < t.y ? -t.h / 2 : t.h / 2) * 0.6, 0.92);
          return (
            <g key={k}>
              {look > 0 && <line x1={p.x} y1={p.y} x2={lerp(p.x, ex, look)} y2={lerp(p.y, ey, look)} stroke={GREEN} strokeWidth={3} strokeDasharray="8 10" opacity={0.7} />}
              <At x={p.x} y={p.y} s={pop}>
                <Watcher k={k} />
              </At>
            </g>
          );
        })}
        {inn > 0 && (
          <g transform={`translate(${t.x} ${t.y}) scale(${inn})`}>
            <rect x={-t.w / 2 - 14} y={-t.h / 2 - 14} width={t.w + 28} height={t.h + 28} rx={30} fill="none" stroke={GREEN} strokeWidth={4} opacity={look * (0.3 + 0.5 * pulse)} />
            <rect x={-t.w / 2} y={-t.h / 2} width={t.w} height={t.h} rx={24} fill="#23272C" stroke={PAPER} strokeWidth={3} />
            <text x={-t.w / 2 + 36} y={-t.h / 2 + 56} fontFamily={FONT.mono} fontSize={22} letterSpacing={4} fill={th.ghost}>
              US TREASURY
            </text>
            <text x={-t.w / 2 + 30} y={t.h / 2 - 44} fontFamily={FONT.display} fontSize={t.h * 0.5} fill={PAPER}>
              10-YEAR
            </text>
          </g>
        )}
        {stamp > 0 && (
          <g transform={`translate(${t.x + t.w * 0.26} ${t.y - t.h * 0.28}) rotate(-8) scale(${stamp})`}>
            <rect x={-130} y={-36} width={260} height={72} rx={8} fill="rgba(126,194,90,0.12)" stroke={GREEN} strokeWidth={4} />
            <text x={0} y={14} textAnchor="middle" fontFamily={FONT.display} fontSize={40} letterSpacing={3} fill={GREEN}>
              RISK-FREE
            </text>
          </g>
        )}
      </Svg>
      <Note at={w('watches') - 2} ground="ink" text="everyone's watching" size={g.v ? 44 : 48} x={g.v ? g.cx - 200 : g.cx - 230} y={g.v ? t.y + t.h / 2 + 50 : t.y + t.h / 2 + 40} rotate={-2} />
      <Mono x={0} w={g.W} align="center" y={t.y - t.h / 2 - 170} text="THE YIELD = WHAT YOU EARN FOR ~ZERO RISK" ground="ink" at={w('earn') - 4} size={g.v ? 20 : 20} color={th.fg} />
      <Kicker g={g} at={S.ten + 4} text="THE NUMBER EVERYONE WATCHES" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 2022: the ten-year climbs
// US 10-year yield, month-end 2022 (approximate; endpoints 1.51% and 3.88%)
export const Y22 = [1.51, 1.79, 1.83, 2.32, 2.89, 2.85, 2.98, 2.65, 3.19, 3.83, 4.1, 3.68, 3.88];
export const y22Prog = (f: number) => {
  const a = sm(win(f, S.y22 + 6, w('climbed') - (S.y22 + 6))) * 0.08;
  const b = sm(win(f, w('climbed') - 2, w('four') + 4 - (w('climbed') - 2))) * 0.92;
  return a + b;
};
export const y22XY = (g: Geo, p: number) => {
  const c = g.chart;
  const n = Y22.length - 1;
  const k = Math.min(n - 1, Math.floor(p * n));
  const t = p * n - k;
  const v = lerp(Y22[k], Y22[Math.min(n, k + 1)], t);
  return {x: c.x - c.w / 2 + 80 + p * (c.w - 120), y: c.y + c.h / 2 - 40 - (v / 5) * (c.h - 80)};
};
export const Y22Scene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const c = g.chart;
  const p = y22Prog(f);
  const n = 120;
  const path = Array.from({length: n + 1})
    .map((_, i) => i / n)
    .filter((q) => q <= p)
    .concat([p])
    .map((q, i) => {
      const pt = y22XY(g, q);
      return `${i ? 'L' : 'M'} ${pt.x} ${pt.y}`;
    })
    .join(' ');
  const axes = sm(win(f, S.y22 + 2, 12));
  const base = c.y + c.h / 2 - 40;
  const yAt = (v: number) => base - (v / 5) * (c.h - 80);
  const end = y22XY(g, 1);
  const start = y22XY(g, 0);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <g opacity={axes}>
          <line x1={c.x - c.w / 2 + 40} y1={base} x2={c.x + c.w / 2} y2={base} stroke={th.ghost} strokeWidth={2} />
          {[1, 2, 3, 4, 5].map((v) => (
            <g key={v}>
              <line x1={c.x - c.w / 2 + 60} y1={yAt(v)} x2={c.x + c.w / 2} y2={yAt(v)} stroke={th.faint} strokeWidth={1.5} strokeDasharray="4 10" />
              <text x={c.x - c.w / 2 + 40} y={yAt(v) + 7} textAnchor="end" fontFamily={FONT.mono} fontSize={18} fill={th.ghost}>
                {v}%
              </text>
            </g>
          ))}
        </g>
        <path d={`${path} L ${y22XY(g, p).x} ${base} L ${start.x} ${base} Z`} fill="rgba(240,69,63,0.08)" />
        <path d={path} stroke={RED} strokeWidth={g.v ? 7 : 6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {p > 0.98 && <circle cx={end.x} cy={end.y} r={11} fill={RED} />}
        <circle cx={start.x} cy={start.y} r={9} fill={INK} opacity={axes} />
      </Svg>
      <Mono x={start.x - 10} y={start.y + 22} text="1.51%" ground="paper" at={S.y22 + 10} size={20} color={th.fg} />
      <Mono x={end.x - 70} y={end.y + 24} text="3.88%" ground="paper" at={w('four')} size={20} color={RED} />
      <Mono x={c.x - c.w / 2 + 60} y={c.y - c.h / 2 - 30} text="US 10-YEAR YIELD · 2022" ground="paper" at={S.y22 + 8} size={18} color={th.fg} />
      <Mono x={g.v ? 0 : c.x - c.w / 2 + 60} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={base + 20} text="MONTH-END, APPROXIMATE · ENDPOINTS 31 DEC 2021 AND 30 DEC 2022" ground="paper" at={S.y22 + 12} size={g.v ? 14 : 16} />
      <Headline at={w('climbed') - 4} text="1.5% TO 3.9%" size={g.head.size} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={RED} />
      <Kicker g={g} at={S.y22 + 4} text="2022" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ the bar every bet has to clear
export const barRate = (f: number) => lerp(1.5, 3.9, sm(win(f, S.bar + 4, 20)));
export const coinStart = (g: Geo) => ({x: g.stand.x - g.stand.span / 2 - (g.v ? 150 : 260), y: g.stand.floor - 56});
/** the coin's jump: runs up, peaks under the bar, knocks into it and drops */
export const coinPos = (g: Geo, f: number) => {
  const s0 = coinStart(g);
  const t0 = w('bitcoin') - 6;
  const t = clamp((f - t0) / 22);
  const top = g.stand.floor - g.barH(3.9) + 70;
  const xPeak = g.stand.x - g.stand.span / 2 + (g.v ? 70 : 120);
  if (t < 1) return {x: lerp(s0.x, xPeak, t), y: lerp(s0.y, top, Math.sin((t * Math.PI) / 2)), rot: t * 200};
  const d = clamp((f - t0 - 22) / 16);
  return {x: xPeak - 40 * d, y: lerp(top, s0.y, d * d), rot: 200 + d * 120};
};
export const BarScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const st = g.stand;
  const rate = barRate(f);
  const h = g.barH(rate);
  const glow = win(f, w('Safe') - 4, 10) * (0.6 + 0.4 * Math.sin(f / 5));
  const cp = coinPos(g, f);
  const hit = f > w('bitcoin') + 14 && f < w('bitcoin') + 28;
  const shake = hit ? Math.sin(f * 3) * 6 : 0;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.v ? 40 : 180} y1={st.floor} x2={g.v ? g.W - 40 : g.W - 180} y2={st.floor} stroke={th.ghost} strokeWidth={2.4} opacity={win(f, S.bar + 2, 8)} />
        <g transform={`translate(${st.x} ${st.floor + shake * 0.3})`} opacity={win(f, S.bar + 2, 8)}>
          <HighJump span={st.span} post={st.post} h={h} glow={glow} label="RISK-FREE RATE" ground="ink" />
        </g>
        <At x={cp.x} y={cp.y} rot={cp.rot} s={g.v ? 0.95 : 1}>
          <BtcCoin r={56} />
        </At>
      </Svg>
      <Mono x={st.x + st.span / 2 + 24} y={st.floor - h - 14} text={`${rate.toFixed(1)}%`} ground="ink" at={S.bar + 2} size={22} color={GREEN} />
      <Headline at={w('thirds') - 6} text="-64%" size={g.head.size} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={RED} />
      <Mono x={g.v ? 0 : g.head.x + 4} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.head.y + g.head.size * 0.95} text="BTC IN 2022 · COIN METRICS, 31 DEC TO 31 DEC" ground="ink" at={w('thirds')} size={g.v ? 18 : 20} />
      <Note at={w('cheaper') - 4} ground="ink" text="risky stuff has to beat this" size={g.v ? 40 : 46} x={g.v ? g.cx - 260 : st.x - st.span / 2} y={st.floor + 20} rotate={-2} />
      <Kicker g={g} at={S.bar + 4} text="THE BAR" ground="ink" />
    </AbsoluteFill>
  );
};
