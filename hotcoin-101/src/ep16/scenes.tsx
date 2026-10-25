import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {useFrame} from '../design/clock';
import {Headline, Note, Underline} from '../notebook/Notebook';
import {FONT, GREEN, INK, PAPER, RED, theme, type Ground} from '../notebook/tokens';
import {clamp, Kicker, lerp, Mono, outBack, sm, Svg, win} from '../notebook/runner';
import {rowY, S, T, type Geo, type Ladder} from './geo';

const {w, ow} = T;
type SP = {g: Geo};

export const ASK = '#5E7C8E';

// ------------------------------------------------------------ shared pieces
/** walk a sell order of size e down a stack of bids: what is left of each row, and where the order is now */
export const consume = (sizes: number[], e: number) => {
  let rest = e;
  let pos = 0;
  const left = sizes.map((s, i) => {
    const take = Math.min(s, Math.max(0, rest));
    rest -= take;
    if (take > 0) pos = i + (take >= s && i < sizes.length - 1 ? 1 : take / s);
    return s - take;
  });
  return {left, pos};
};

const Lbl: React.FC<{x: number; y: number; text: string; ground: Ground; o?: number; anchor?: 'start' | 'middle' | 'end'; size?: number; color?: string}> = ({x, y, text, ground, o = 1, anchor = 'start', size = 20, color}) => (
  <text x={x} y={y + size * 0.36} textAnchor={anchor} fontFamily={FONT.mono} fontSize={size} letterSpacing={1.5} fill={color ?? theme(ground).ghost} opacity={o}>
    {text}
  </text>
);

/** one row of a ladder: price label and a bar. size is 0..1 of L.max */
const Row: React.FC<{L: Ladder; i: number; price: string; size: number; color: string; ground: Ground; o?: number; labelO?: number; hollow?: number}> = ({L, i, price, size, color, ground, o = 1, labelO = 1, hollow = 0}) => {
  const y = rowY(L, i);
  const bh = L.rowH * 0.66;
  return (
    <g>
      <Lbl x={L.px} y={y} text={price} ground={ground} o={labelO} size={L.rowH > 70 ? 26 : 20} />
      {size > 0.002 && <rect x={L.bx} y={y - bh / 2} width={size * L.max} height={bh} rx={4} fill={color} opacity={o} />}
      {hollow > 0 && <rect x={L.bx} y={y - bh / 2} width={hollow * L.max} height={bh} rx={4} fill="none" stroke={theme(ground).ghost} strokeWidth={2.4} strokeDasharray="10 8" />}
    </g>
  );
};

// ------------------------------------------------------------ cold open: the screen says $100
export const OPEN_ROWS = [
  {p: '$100', s: 0.14},
  {p: '$99', s: 0.1},
  {p: '$97', s: 0.14},
  {p: '$96', s: 0.1},
  {p: '$94', s: 0.85},
];
const OPEN_ORDER = 0.92;
export const openEat = (f: number) => OPEN_ORDER * sm(win(f, ow('sell') + 8, ow('ninety-four') - 2 - (ow('sell') + 8)));
export const openPos = (f: number) => consume(OPEN_ROWS.map((r) => r.s), openEat(f)).pos;

export const OpenScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const c = g.card;
  const L = g.openL;
  const cardIn = outBack(win(f, 4, 14));
  const pressed = f >= ow('sell') - 2 && f < ow('sell') + 8;
  const sold = f >= ow('sell') - 2;
  const {left} = consume(OPEN_ROWS.map((r) => r.s), openEat(f));
  const pos = openPos(f);
  const eating = f > ow('sell') + 6;
  const stamp = outBack(win(f, ow('ninety-four') - 4, 10), 2.2);
  const empty = win(f, ow('ran') - 6, 10);
  const priceS = g.v ? 120 : 150;
  const b = g.btn;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <g transform={`translate(${c.x} ${c.y}) scale(${cardIn}) translate(${-c.x} ${-c.y})`}>
          <rect x={c.x - c.w / 2} y={c.y - c.h / 2} width={c.w} height={c.h} rx={26} fill="#FBFAF6" stroke={INK} strokeWidth={3} />
          <text x={c.x - c.w / 2 + 40} y={c.y - c.h / 2 + 56} fontFamily={FONT.mono} fontSize={20} letterSpacing={3} fill={th.ghost}>
            LAST PRICE
          </text>
          <text x={c.x - c.w / 2 + 36} y={c.y - c.h / 2 + 70 + priceS * 0.86} fontFamily={FONT.display} fontSize={priceS} fill={INK}>
            $100
          </text>
          <rect x={b.x - b.w / 2} y={b.y - b.h / 2 + (pressed ? 4 : 0)} width={b.w} height={b.h} rx={b.h / 2} fill={sold ? '#3A3D42' : INK} />
          <text x={b.x} y={b.y + (pressed ? 4 : 0) + 15} textAnchor="middle" fontFamily={FONT.display} fontSize={44} letterSpacing={6} fill={PAPER}>
            SELL
          </text>
        </g>
        {stamp > 0 && (
          <g transform={`translate(${c.x + c.w * (g.v ? 0.25 : 0.12)} ${c.y - (g.v ? 60 : 10)}) rotate(-8) scale(${stamp * (g.v ? 0.85 : 1)})`}>
            <rect x={-170} y={-50} width={340} height={100} rx={10} fill="rgba(240,69,63,0.08)" stroke={RED} strokeWidth={5} />
            <text x={0} y={18} textAnchor="middle" fontFamily={FONT.display} fontSize={52} letterSpacing={2} fill={RED}>
              YOU GOT $94
            </text>
          </g>
        )}
        <g opacity={win(f, 10, 10)}>
          {OPEN_ROWS.map((r, i) => {
            const grow = sm(win(f, 12 + i * 3, 12));
            return <Row key={i} L={L} i={i} price={r.p} size={left[i] * grow} color={GREEN} ground="paper" hollow={i < 4 ? empty * r.s : 0} />;
          })}
          {eating && pos < 4.999 && (
            <path d={`M ${L.bx - 20} ${rowY(L, Math.min(pos, 4))} l -26 -16 l 0 32 Z`} fill={RED} />
          )}
        </g>
      </Svg>
      <Mono x={L.bx} y={L.top - 46} text="BUYERS WAITING" ground="paper" at={14} size={18} color={th.fg} />
      <Mono x={g.v ? 0 : L.bx} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={L.top + 5 * L.rowH + 14} text="ILLUSTRATIVE" ground="paper" at={18} size={16} />
      <Note
        at={ow('ran') - 4}
        ground="paper"
        tone="red"
        text="the buyers ran out"
        size={g.v ? 46 : 50}
        x={g.v ? L.bx + 190 : L.bx + 260}
        y={g.v ? rowY(L, 1) - 40 : L.top - 120}
        from={g.v ? 'left' : 'bottom'}
        arrow={g.v ? {x: L.bx + 0.16 * L.max, y: rowY(L, 1), bend: 0.25} : {x: L.bx + 90, y: rowY(L, 1) - 20, bend: 0.25}}
      />
      <Kicker g={g} at={4} text="ONE SELL ORDER" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ title
export const TitleScene: React.FC<SP> = ({g}) => {
  const th = theme('paper');
  const t = T.TITLE_AT;
  return (
    <AbsoluteFill>
      <Headline at={t + 2} text="FILE 016 · TRADING" size={g.t1S} x={0} y={g.t1Top} width={g.W} align="center" color={th.fg} stagger={0.7} />
      <Headline at={t + 8} text="LIQUIDITY" size={g.tS} x={0} y={g.tTop} width={g.W} align="center" color={th.fg} stagger={1.3} />
      <Headline at={t + 30} text="NOTICED ONLY WHEN IT'S GONE" size={g.subS} x={0} y={g.subTop} width={g.W} align="center" color={GREEN} stagger={0.6} />
      <Underline at={t + 44} x={g.cx - g.tW / 2} y={g.tBase + g.tS * 0.06} w={g.tW + g.tDot.r * 2.6} thick={g.v ? 8 : 9} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ the order book
export const BOOK_ROWS = [
  {p: '101.0', s: 0.55, side: 'ask'},
  {p: '100.8', s: 0.72, side: 'ask'},
  {p: '100.6', s: 0.46, side: 'ask'},
  {p: '100.4', s: 0.62, side: 'ask'},
  {p: '100.2', s: 0.4, side: 'ask'},
  {p: '', s: 0, side: 'gap'},
  {p: '100.0', s: 0.46, side: 'bid'},
  {p: '99.8', s: 0.66, side: 'bid'},
  {p: '99.6', s: 0.5, side: 'bid'},
  {p: '99.4', s: 0.78, side: 'bid'},
  {p: '99.2', s: 0.6, side: 'bid'},
] as const;

const bookGrow = (f: number, i: number) => {
  const side = BOOK_ROWS[i].side;
  if (side === 'gap') return 0;
  // a first sketch of the whole book, then each side fills out on its word
  const sketch = 0.35 * sm(win(f, S.book + 8 + (i % 6) * 2, 12));
  const full = side === 'bid' ? sm(win(f, w('buyers') - 4 + (i - 6) * 2, 12)) : sm(win(f, w('sellers') - 4 + (4 - i) * 2, 12));
  return Math.max(sketch, full);
};

export const BookScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const L = g.book;
  const blip = sm(win(f, w('without') - 2, 12));
  const bidHi = win(f, w('buyers') - 4, 8) * (1 - win(f, w('sellers') - 4, 8));
  const askHi = win(f, w('sellers') - 4, 8) * (1 - win(f, w('spread') - 4, 8));
  const spread = sm(win(f, w('spread') - 4, 12));
  const gy0 = rowY(L, 4) + L.rowH * 0.33;
  const gy1 = rowY(L, 6) - L.rowH * 0.33;
  const midY = rowY(L, 5);
  const bx = L.bx + L.max + (g.v ? 30 : 40);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={L.bx - 14} y1={L.top} x2={L.bx - 14} y2={L.top + 11 * L.rowH} stroke={th.faint} strokeWidth={2} opacity={win(f, S.book + 6, 10)} />
        {BOOK_ROWS.map((r, i) => {
          if (r.side === 'gap') return null;
          const isBid = r.side === 'bid';
          let s = r.s * bookGrow(f, i);
          if (i === 6) s -= 0.1 * blip * bookGrow(f, i);
          const hi = isBid ? bidHi : askHi;
          return <Row key={i} L={L} i={i} price={r.p} size={s} color={isBid ? GREEN : ASK} ground="ink" o={0.75 + 0.25 * hi} labelO={win(f, S.book + 10 + i, 8)} />;
        })}
        {blip > 0 && blip < 1 && <circle cx={L.bx + (0.46 - 0.1 * blip) * L.max} cy={rowY(L, 6)} r={10 + 30 * blip} fill="none" stroke={PAPER} strokeWidth={3} opacity={1 - blip} />}
        <g opacity={win(f, S.book + 14, 10)}>
          <line x1={L.px} y1={midY} x2={L.bx + L.max} y2={midY} stroke={PAPER} strokeWidth={2} strokeDasharray="4 10" opacity={0.5} />
        </g>
        {spread > 0 && (
          <g opacity={spread}>
            <path d={`M ${bx} ${gy0} h 18 V ${gy1} h -18`} stroke={GREEN} strokeWidth={4} fill="none" />
            <rect x={L.bx} y={gy0} width={L.max * spread} height={gy1 - gy0} fill="rgba(126,194,90,0.10)" />
          </g>
        )}
      </Svg>
      <Mono x={L.px} y={midY - 12} text="PRICE 100.1" ground="ink" at={S.book + 16} size={18} color={th.fg} />
      <Mono x={L.bx} y={L.top - 40} text="SELLERS · ASKS" ground="ink" at={w('sellers') - 4} size={18} color={ASK} />
      <Mono x={L.bx} y={L.top + 11 * L.rowH + 10} text="BUYERS · BIDS" ground="ink" at={w('buyers') - 4} size={18} color={GREEN} />
      <Note at={w('price') - 2} ground="ink" text="small trade, price stays" size={g.v ? 34 : 42} x={g.v ? g.cx + 40 : L.bx + L.max * 0.62} y={g.v ? rowY(L, 6) - 26 : rowY(L, 7) + 6} rotate={-2} from="left" arrow={{x: L.bx + 0.36 * L.max + 14, y: rowY(L, 6) + 8, bend: 0.3}} />
      <Note at={w('spread') - 2} ground="ink" text="the spread" size={g.v ? 44 : 52} x={g.v ? L.bx + 30 : bx + 34} y={midY - (g.v ? 32 : 36)} rotate={-3} />
      <Mono x={g.v ? 0 : L.px} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={L.top + 11 * L.rowH + (g.v ? 50 : 46)} text="ILLUSTRATIVE BOOK" ground="ink" at={S.book + 18} size={16} />
      <Kicker g={g} at={S.book + 4} text="THE ORDER BOOK" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ deep vs thin
export const DEEP = [0.95, 0.9, 0.92, 0.88, 0.94, 0.9];
export const THIN = [0.2, 0.12, 0.16, 0.1, 0.14, 0.22];
const DT_PRICES = ['100.0', '99.9', '99.8', '99.7', '99.6', '99.5'];
const DT_ORDER = 0.6;
const deepEat = (f: number) => DT_ORDER * sm(win(f, w('soak') - 2, 16));
export const thinEat = (f: number) => DT_ORDER * sm(win(f, w('eaten') - 2, w('slides') + 16 - (w('eaten') - 2)));
export const thinPos = (f: number) => consume(THIN, thinEat(f)).pos;
export const dtLadder = (g: Geo, k: number): Ladder => {
  const c = g.cols[k];
  return {px: c.x0, bx: c.x0 + (g.v ? 100 : 120), top: g.dtTop, rowH: g.dtRow, max: c.w - (g.v ? 100 : 120)};
};
export const dtY = (g: Geo, pos: number) => g.dtTop + (pos + 0.5) * g.dtRow;

export const DeepScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const th2 = 'paper' as const;
  const sets = [
    {sizes: DEEP, eat: deepEat(f), at: S.deep + 6, name: 'DEEP'},
    {sizes: THIN, eat: thinEat(f), at: w('Thin') - 8, name: 'THIN'},
  ];
  const slip = sm(win(f, w('slippage') - 6, 12));
  const Lt = dtLadder(g, 1);
  const bx = Lt.bx + Lt.max * 0.3;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {sets.map((st, k) => {
          const L = dtLadder(g, k);
          const {left, pos} = consume(st.sizes, st.eat);
          const o = win(f, st.at, 10);
          const going = st.eat > 0.002 && st.eat < DT_ORDER - 0.002;
          return (
            <g key={k} opacity={o}>
              {st.sizes.map((s, i) => {
                const grow = sm(win(f, st.at + i * 2, 12));
                return <Row key={i} L={L} i={i} price={DT_PRICES[i]} size={left[i] * grow} color={GREEN} ground={th2} hollow={left[i] < s - 0.001 ? s : 0} />;
              })}
              {st.eat > 0.002 && (
                <g>
                  <path d={`M ${L.bx - 16} ${dtY(g, Math.min(pos, 5))} l -24 -15 l 0 30 Z`} fill={RED} />
                  {going && <circle cx={L.bx + left[Math.min(Math.floor(pos), 5)] * L.max} cy={dtY(g, Math.floor(Math.min(pos, 5)))} r={8 + 6 * Math.sin(f)} fill={RED} opacity={0.5} />}
                </g>
              )}
            </g>
          );
        })}
        {slip > 0 && (
          <g opacity={slip}>
            <path d={`M ${bx} ${dtY(g, 0)} h 20 V ${dtY(g, 0) + (dtY(g, 4) - dtY(g, 0)) * slip} h -20`} stroke={RED} strokeWidth={5} fill="none" />
          </g>
        )}
      </Svg>
      {sets.map((st, k) => {
        const L = dtLadder(g, k);
        return <Mono key={k} x={L.bx} y={g.dtTop - 44} text={`${st.name} BOOK · SAME SELL ORDER`} ground="paper" at={st.at} size={g.v ? 16 : 18} color={th.fg} />;
      })}
      <Note at={w('order', 2) - 2} ground="paper" text="barely a dent" size={g.v ? 40 : 46} x={dtLadder(g, 0).bx + 40} y={dtY(g, 6) + 10} rotate={-3} />
      <Note at={w('level', 2) - 2} ground="paper" text="level by level" size={g.v ? 40 : 44} x={g.v ? Lt.bx - 10 : Lt.bx + 60} y={dtY(g, 6) + 10} rotate={-2} />
      <Headline at={w('slippage') - 4} text="SLIPPAGE" size={g.head.size} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={RED} />
      <Mono x={g.v ? 0 : g.head.x + 4} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.head.y + g.head.size * 0.95} text="THE PRICE MOVES WHILE YOU FILL" ground="paper" at={w('slippage') + 4} size={g.v ? 22 : 20} />
      <Kicker g={g} at={S.deep + 4} text="DEEP VS THIN" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ they're just orders, and they vanish
const TICKET = 44;
const tickets = (g: Geo) => {
  const L = g.book;
  const out: {i: number; j: number; x: number; y: number; w: number; h: number; bid: boolean; cancel: boolean; t: number}[] = [];
  BOOK_ROWS.forEach((r, i) => {
    if (r.side === 'gap') return;
    const len = r.s * L.max;
    const n = Math.max(1, Math.round(len / TICKET));
    const tw = len / n;
    for (let j = 0; j < n; j++) {
      const k = `${i}-${j}`;
      out.push({
        i,
        j,
        x: L.bx + j * tw,
        y: rowY(L, i) - L.rowH * 0.33,
        w: tw - 4,
        h: L.rowH * 0.66,
        bid: r.side === 'bid',
        cancel: random(`c${k}`) < 0.18,
        t: random(`v${k}`),
      });
    }
  });
  return out;
};
export const bidFloorY = (g: Geo) => rowY(g.book, 10) + g.book.rowH * 0.33;

export const VanishScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const L = g.book;
  const list = tickets(g);
  const split = sm(win(f, w('orders') - 6, 12));
  const scary = win(f, w('scary') - 2, 4) * (1 - win(f, w('scary') + 10, 20));
  const shake = f > w('scary') - 2 && f < w('vanish') + 30 ? Math.sin(f * 2.3) * 4 * (1 - clamp((f - w('scary')) / 50)) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(240,69,63,0) 40%, rgba(240,69,63,${0.32 * scary}) 100%)`}} />
      <Svg g={g}>
        <line x1={L.bx - 14} y1={L.top} x2={L.bx - 14} y2={L.top + 11 * L.rowH} stroke={th.faint} strokeWidth={2} />
        {BOOK_ROWS.map((r, i) => (r.side === 'gap' ? null : <Lbl key={i} x={L.px} y={rowY(L, i)} text={r.p} ground="ink" size={20} />))}
        {list.map((t) => {
          const k = `${t.i}-${t.j}`;
          const out = t.cancel ? win(f, w('cancelled') - 2 + t.t * 10, 8) : win(f, w('vanish') - 2 + t.t * 26, 6);
          if (out >= 1) return null;
          const gap = 4 * split;
          const jx = t.cancel ? out * (60 + random(`dx${k}`) * 40) : 0;
          const jy = t.cancel ? -out * 40 : 0;
          return (
            <g key={k} transform={`translate(${shake * (random(`s${k}`) - 0.5) * 2 + jx} ${jy})`} opacity={(1 - out) * (0.8 + 0.2 * split)}>
              <rect x={t.x + gap / 2} y={t.y} width={t.w + 4 - gap} height={t.h} rx={4 * split + 3} fill={t.bid ? GREEN : ASK} />
              {split > 0.5 && <line x1={t.x + t.w * 0.25} y1={t.y + t.h * 0.35} x2={t.x + t.w * 0.75} y2={t.y + t.h * 0.35} stroke={INK} strokeWidth={2} opacity={0.35} />}
              {split > 0.5 && <line x1={t.x + t.w * 0.25} y1={t.y + t.h * 0.62} x2={t.x + t.w * 0.6} y2={t.y + t.h * 0.62} stroke={INK} strokeWidth={2} opacity={0.35} />}
            </g>
          );
        })}
        {f > w('vanish') + 20 && (
          <g opacity={win(f, w('vanish') + 20, 12)}>
            {BOOK_ROWS.map((r, i) =>
              r.side === 'gap' ? null : <rect key={i} x={L.bx} y={rowY(L, i) - L.rowH * 0.33} width={r.s * L.max} height={L.rowH * 0.66} rx={4} fill="none" stroke={th.ghost} strokeWidth={2} strokeDasharray="8 8" />,
            )}
          </g>
        )}
      </Svg>
      <Note at={w('orders') - 2} ground="ink" text="each one is an order" size={g.v ? 40 : 46} x={g.v ? g.cx - 140 : L.bx + L.max + 40} y={g.v ? L.top - 120 : rowY(L, 1) - 10} from={g.v ? 'bottom' : 'left'} arrow={{x: L.bx + 0.5 * L.max * 0.72, y: rowY(L, 1) - L.rowH * 0.4, bend: 0.25}} />
      <Note at={w('vanish') + 2} ground="ink" tone="red" text="gone, all at once" size={g.v ? 48 : 54} x={g.v ? g.cx - 170 : L.bx + L.max + 40} y={g.v ? L.top + 11 * L.rowH + 30 : rowY(L, 7)} rotate={-3} />
      <Kicker g={g} at={S.vanish + 4} text="LIQUIDITY IS JUST ORDERS" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ flash crash
type Pt = [number, number];
export const CRASH_PTS: Pt[] = [[0, 0.82], [0.2, 0.85], [0.36, 0.8], [0.44, 0.83], [0.47, 0.06], [0.5, 0.02], [0.53, 0.5], [0.58, 0.78], [0.7, 0.8], [0.85, 0.84], [1, 0.82]];
export const crashProg = (f: number) => {
  const keys: [number, number][] = [
    [S.crash + 4, 0],
    [w('Accenture') - 4, 0.44],
    [w('cent') + 2, 0.5],
    [w('cent') + 26, 0.62],
    [S.take - 2, 1],
  ];
  if (f <= keys[0][0]) return 0;
  for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], sm((f - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])));
  return 1;
};
export const crashAt = (p: number): Pt => {
  for (let i = 1; i < CRASH_PTS.length; i++) {
    const [x1, y1] = CRASH_PTS[i];
    if (p <= x1) {
      const [x0, y0] = CRASH_PTS[i - 1];
      return [p, lerp(y0, y1, (p - x0) / (x1 - x0))];
    }
  }
  return CRASH_PTS[CRASH_PTS.length - 1];
};
export const crashXY = (g: Geo, px: number, val: number) => ({x: g.chart.x - g.chart.w / 2 + 40 + px * (g.chart.w - 80), y: g.chart.y + g.chart.h / 2 - 40 - val * (g.chart.h - 80)});

export const CrashScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const p = crashProg(f);
  const pts: Pt[] = [...CRASH_PTS.filter(([x]) => x < p), crashAt(p)];
  const path = pts.map(([x, v], i) => {
    const q = crashXY(g, x, v);
    return `${i ? 'L' : 'M'} ${q.x} ${q.y}`;
  });
  const axes = sm(win(f, S.crash + 2, 12));
  const low = crashXY(g, 0.5, 0.02);
  const red = p > 0.45 && p < 0.56;
  const c = g.chart;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <g opacity={axes}>
          <line x1={c.x - c.w / 2} y1={c.y + c.h / 2 - 40} x2={c.x + c.w / 2} y2={c.y + c.h / 2 - 40} stroke={th.ghost} strokeWidth={2} />
          <line x1={c.x - c.w / 2 + 20} y1={c.y - c.h / 2} x2={c.x - c.w / 2 + 20} y2={c.y + c.h / 2 - 40} stroke={th.ghost} strokeWidth={2} />
        </g>
        <path d={path.join(' ')} stroke={red ? RED : INK} strokeWidth={g.v ? 7 : 6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {p >= 0.5 && <circle cx={low.x} cy={low.y} r={12} fill={RED} opacity={win(f, w('cent'), 6)} />}
      </Svg>
      <Mono x={c.x - c.w / 2 + 30} y={c.y - c.h / 2 - 34} text="ACCENTURE · NYSE · 6 MAY 2010" ground="paper" at={w('Accenture') - 6} size={18} color={th.fg} />
      <Headline at={w('one', 2) - 4} text="$0.01" size={g.v ? 170 : 190} x={g.v ? 0 : g.head.x} y={g.v ? g.head.y : g.head.y - 10} width={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} color={RED} />
      <Note at={w('cent') + 2} ground="paper" tone="red" text="for a few seconds" size={g.v ? 42 : 46} x={low.x + 40} y={low.y - (g.v ? 110 : 100)} rotate={-3} from="left" arrow={{x: low.x + 16, y: low.y - 14, bend: 0.3}} />
      <Note at={w('cent') + 26} ground="paper" text="then it snapped back" size={g.v ? 40 : 44} x={g.v ? c.x - 40 : crashXY(g, 0.6, 0.78).x + 40} y={crashXY(g, 0.6, 0.78).y + 40} rotate={-2} />
      <Mono x={g.v ? 0 : c.x - c.w / 2 + 30} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={c.y + c.h / 2 + 4} text="THE 2010 FLASH CRASH · SHAPE ILLUSTRATIVE" ground="paper" at={S.crash + 10} size={16} />
      <Kicker g={g} at={S.crash + 4} text="IT HAS HAPPENED" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ takeaway: the price is a quote, the fill is what you get
export const MINI = [0.3, 0.45, 0.25, 0.5, 0.35, 0, 0.12, 0.08, 0.14, 0.6, 0.7];
export const lensAt = (g: Geo) => ({x: g.mini.bx + g.mini.max * 0.2, y: rowY(g.mini, 7.5)});

export const TakeScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const L = g.mini;
  const lens = lensAt(g);
  const lensO = sm(win(f, w('depth') - 6, 12));
  const cardsIn = [outBack(win(f, w('quote') - 6, 12)), outBack(win(f, w('fill', 2) - 6, 12))];
  const gap = sm(win(f, w('get', 3) - 8, 12));
  const [q, fl] = g.cards;
  const cardSpec = [
    {c: q, label: 'THE QUOTE', val: '$100', fill: '#23272C', color: PAPER},
    {c: fl, label: 'YOUR FILL', val: '$94', fill: '#23272C', color: GREEN},
  ];
  const valS = g.v ? 130 : 140;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <g opacity={win(f, S.take + 4, 10)}>
          {MINI.map((s, i) => {
            if (i === 5) return null;
            const grow = sm(win(f, S.take + 6 + i, 12));
            return <Row key={i} L={L} i={i} price="" size={s * grow} color={i < 5 ? ASK : GREEN} ground="ink" />;
          })}
        </g>
        {lensO > 0 && (
          <g opacity={lensO}>
            <circle cx={lens.x} cy={lens.y} r={g.r * 2.3} fill="rgba(126,194,90,0.08)" stroke={PAPER} strokeWidth={6} />
            <line x1={lens.x + g.r * 1.65} y1={lens.y + g.r * 1.65} x2={lens.x + g.r * 3.1} y2={lens.y + g.r * 3.1} stroke={PAPER} strokeWidth={16} strokeLinecap="round" />
          </g>
        )}
        {cardSpec.map((cs, k) => {
          const s = cardsIn[k];
          if (s <= 0) return null;
          const c = cs.c;
          return (
            <g key={k} transform={`translate(${c.x} ${c.y}) scale(${s}) translate(${-c.x} ${-c.y})`}>
              <rect x={c.x - c.w / 2} y={c.y - c.h / 2} width={c.w} height={c.h} rx={22} fill={cs.fill} stroke={k ? GREEN : th.ghost} strokeWidth={3} />
              <text x={c.x - c.w / 2 + 34} y={c.y - c.h / 2 + 50} fontFamily={FONT.mono} fontSize={20} letterSpacing={3} fill={th.ghost}>
                {cs.label}
              </text>
              <text x={c.x - c.w / 2 + 30} y={c.y + c.h / 2 - 34} fontFamily={FONT.display} fontSize={valS} fill={cs.color}>
                {cs.val}
              </text>
            </g>
          );
        })}
        {gap > 0 &&
          (g.v ? (
            <path d={`M ${q.x + q.w / 2 - 10} ${q.y + q.h / 2 + 30} q ${(fl.x - q.x) / 2} 60 ${fl.x - q.x} 0`} stroke={GREEN} strokeWidth={5} fill="none" strokeDasharray="12 10" opacity={gap} />
          ) : (
            <path d={`M ${q.x + q.w / 2 + 30} ${q.y} h 30 V ${q.y + (fl.y - q.y) * gap} h -30`} stroke={GREEN} strokeWidth={5} fill="none" opacity={gap} />
          ))}
      </Svg>
      <Mono x={L.bx} y={L.top - 40} text="CHECK THE DEPTH" ground="ink" at={S.take + 8} size={18} color={th.fg} />
      <Note at={w('get', 3) - 4} ground="ink" text="that gap is liquidity" size={g.v ? 44 : 50} x={g.v ? g.cx - 200 : q.x + q.w / 2 + 80} y={g.v ? q.y + q.h / 2 + 80 : (q.y + fl.y) / 2 - 30} rotate={-3} />
      <Kicker g={g} at={S.take + 4} text="PRICE VS FILL" ground="ink" />
    </AbsoluteFill>
  );
};
