import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {useFrame} from '../design/clock';
import {Headline, Note, Underline} from '../notebook/Notebook';
import {FONT, GREEN, INK, LOCKUP, PAPER, RED, theme, type Ground} from '../notebook/tokens';
import {At, Bank, Cart, Chest, Coin, CoinString, COPPER, CopperPlate, EuroNote, Person, Sack, Seal, SongNote, Sycee, VERMILION} from './art';
import {chartCenter, clamp, CURVE, CURVE_B, curvePoint, lerp, mergeT, outBack, plateCenterY, plateLand, slipPos, sm, stackCount, syceeAt, win} from './dyn';
import {antonW, type Geo} from './geo';
import {ow, S, TITLE_AT, w, END_AT} from './timeline';

type SP = {g: Geo};

const Svg: React.FC<{g: Geo; children: React.ReactNode}> = ({g, children}) => (
  <svg width={g.W} height={g.H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);

const Kicker: React.FC<{g: Geo; at: number; text: string; ground: Ground}> = ({g, at, text, ground}) => {
  const f = useFrame();
  const th = theme(ground);
  const o = win(f, at, 8);
  return (
    <div
      style={{
        position: 'absolute',
        left: g.v ? 0 : 120,
        width: g.v ? g.W : undefined,
        textAlign: g.v ? 'center' : 'left',
        top: g.kickerY,
        fontFamily: FONT.mono,
        fontSize: g.v ? 24 : 22,
        letterSpacing: 4,
        color: th.fg,
        opacity: 0.6 * o,
        clipPath: `inset(0 ${(1 - sm(o)) * 100}% 0 0)`,
      }}
    >
      {text}
    </div>
  );
};

const Mono: React.FC<{x: number; y: number; text: string; ground: Ground; at: number; size?: number; align?: 'left' | 'center' | 'right'; w?: number}> = ({x, y, text, ground, at, size = 18, align = 'left', w: width}) => {
  const f = useFrame();
  const th = theme(ground);
  return (
    <div style={{position: 'absolute', left: x, top: y, width, textAlign: align, fontFamily: FONT.mono, fontSize: size, letterSpacing: 2.5, color: th.ghost, opacity: win(f, at, 8), whiteSpace: 'nowrap'}}>
      {text}
    </div>
  );
};

// ---------------------------------------------------------------- cold open
export const OpenScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const draw = sm(win(f, 2, 22));
  const x1024 = g.yx(1024);
  const x1661 = g.yx(1661);
  const pChina = win(f, ow('paper') - 6, 22);
  const pEuro = outBack(win(f, ow('Europe'), 10));
  // bracket follows the narrator from 1024 towards 1661
  const bT = sm(win(f, ow('six'), 50));
  const bx = lerp(x1024, x1661, bT);
  const bY = g.bracketY;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.rA} y1={g.rulerY} x2={lerp(g.rA, g.rB, draw)} y2={g.rulerY} stroke={INK} strokeWidth={3} />
        {Array.from({length: 15}).map((_, i) => {
          const yr = 1000 + i * 50;
          const x = g.yx(yr);
          const big = yr % 100 === 0;
          const o = win(f, 4 + i * 1.2, 6);
          return (
            <g key={yr} opacity={o}>
              <line x1={x} y1={g.rulerY} x2={x} y2={g.rulerY + (big ? 18 : 10)} stroke={INK} strokeWidth={2} />
              {big && (
                <text x={x} y={g.rulerY + 42} textAnchor="middle" fontFamily={FONT.mono} fontSize={16} fill={th.ghost} letterSpacing={1}>
                  {yr}
                </text>
              )}
            </g>
          );
        })}
        <At x={x1024} y={g.iconY} s={g.iconS}>
          <SongNote draw={pChina} seal={win(f, ow('money'), 6)} />
        </At>
        {pEuro > 0 && (
          <At x={x1661} y={g.iconY + 20} s={pEuro * g.iconS * 1.4}>
            <EuroNote />
          </At>
        )}
        {bT > 0 && (
          <g stroke={th.fg} strokeWidth={2.4} fill="none" opacity={0.8}>
            <path d={`M ${x1024} ${bY - 14} L ${x1024} ${bY} L ${bx} ${bY} L ${bx} ${bY - 14}`} />
          </g>
        )}
      </Svg>
      <Headline at={ow('printing')} text="1024" size={g.yearOpen} x={x1024 - antonW('1024', g.yearOpen) / 2} y={g.rulerY + 58} color={th.fg} />
      <Headline at={ow('Europe')} text="1661" size={g.yearOpen} x={x1661 - antonW('1661', g.yearOpen) / 2} y={g.rulerY + 58} color={th.fg} />
      <Note at={ow('hundred')} ground="paper" text="637 years" size={g.v ? 44 : 48} x={(x1024 + x1661) / 2 - 80} y={bY + 14} rotate={-2} />
      <Kicker g={g} at={4} text="PAPER MONEY" ground="paper" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- title
export const TitleScene: React.FC<SP> = ({g}) => {
  const th = theme('paper');
  const T = TITLE_AT;
  return (
    <AbsoluteFill>
      <Headline at={T + 2} text="FILE 013 · HISTORY" size={g.t1S} x={0} y={g.t1Top} width={g.W} align="center" color={th.fg} stagger={0.7} />
      {g.v ? (
        <>
          <Headline at={T + 6} text="PAPER" size={g.tS} x={0} y={g.tTop} width={g.W} align="center" color={th.fg} />
          <Headline at={T + 12} text="MONEY" size={g.tS} x={0} y={g.tTop + 0.92 * g.tS} width={g.W} align="center" color={th.fg} />
        </>
      ) : (
        <Headline at={T + 6} text="PAPER MONEY" size={g.tS} x={0} y={g.tTop} width={g.W} align="center" color={th.fg} />
      )}
      <Underline at={T + 40} x={g.W / 2 - g.tLastW / 2} y={g.tBase + g.tS * 0.1} w={g.tLastW + g.tDot.r * 2.6} thick={g.v ? 8 : 9} />
      <Note
        at={T + 50}
        ground="paper"
        text="invented twice?!"
        size={g.v ? 46 : 44}
        x={g.v ? g.W / 2 - 150 : g.W / 2 + 180}
        y={g.tBase + g.tS * (g.v ? 0.3 : 0.26)}
        rotate={-4}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- iron
const PILE = [
  [-110, -16, 150], [10, -16, 140], [125, -16, 140], [-55, -44, 150], [70, -44, 140], [-5, -72, 150], [48, -100, 130], [-60, -100, 110],
];
export const IronScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const t0 = w('Coins') - 4;
  const last = w('heavy') - 10;
  const drops = PILE.map((_, i) => (i === PILE.length - 1 ? last : t0 + i * 16));
  // cart dips a little every time a string lands
  let dip = 0;
  drops.forEach((d, i) => {
    const dt = f - (d + 9);
    if (dt >= 0 && dt < 14) dip += (i === PILE.length - 1 ? 9 : 4) * Math.exp(-dt / 3) * Math.cos(dt * 0.9);
  });
  // the dot's straining makes the cart shiver, it never really moves
  const strain = f > w('is') && f < w('heavy') + 20 ? Math.sin(f * 2.1) * 1.5 : 0;
  const cartIn = sm(win(f, S.iron + 2, 16));
  const coin = outBack(win(f, w('iron') - 6, 12));
  const sweat = [0, 1, 2].map((i) => {
    const st = w('is') + 4 + i * 12;
    const t = (f - st) / 14;
    return t > 0 && t < 1 ? {t, i} : null;
  });
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.W * 0.06} y1={g.floor} x2={g.W * 0.94} y2={g.floor} stroke={INK} strokeWidth={2.4} />
        <At x={g.cartX + strain + (1 - cartIn) * 900} y={g.cartY + dip} s={g.cartS}>
          <Cart spin={(1 - cartIn) * -200} />
          {PILE.map(([x, y, len], i) => {
            const d = drops[i];
            const t = clamp((f - d) / 9);
            if (t <= 0) return null;
            const yy = lerp(-g.cartY / g.cartS - 200, y, t * t);
            return (
              <At key={i} x={x} y={yy} rot={i % 2 ? 3 : -2}>
                <CoinString len={len} />
              </At>
            );
          })}
        </At>
        {coin > 0 && (
          <At x={g.inset.x} y={g.inset.y} s={coin} rot={(1 - coin) * 40}>
            <Coin r={g.insetR} />
          </At>
        )}
        {sweat.map(
          (s, k) =>
            s && (
              <path
                key={k}
                d="M 0 -10 Q 7 2 0 8 Q -7 2 0 -10 Z"
                transform={`translate(${g.push.x + g.r * 0.7 + s.i * 8} ${g.push.y - g.r * 0.9 + s.t * 40}) scale(1.4)`}
                fill="#7FB6D9"
                stroke={INK}
                strokeWidth={1.4}
                opacity={1 - s.t}
              />
            ),
        )}
      </Svg>
      <Note at={w('iron') + 2} ground="paper" text="iron" size={48} x={g.inset.x + g.insetR + 50} y={g.inset.y - g.insetR * 0.7} from="left" arrow={{x: g.inset.x + g.insetR * 0.8, y: g.inset.y - g.insetR * 0.3, bend: 0.3}} />
      <Note at={w('heavy') + 2} ground="paper" tone="red" text="heavy." size={56} x={g.cartX + (g.v ? 20 : 160)} y={g.cartY - 130 * g.cartS - 150} from="bottom" arrow={{x: g.cartX + 40, y: g.cartY - 120 * g.cartS, bend: -0.2}} />
      <Kicker g={g} at={S.iron + 4} text="SICHUAN, CHINA · AROUND 1000 AD" ground="paper" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- receipts
export const ReceiptScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const flights = [0, 1, 2].map((i) => {
    const st = w('merchants') + i * 8;
    const t = clamp((f - st) / 12);
    return {t, i};
  });
  const lidOpen = sm(win(f, w('merchants') - 6, 6)) * (1 - sm(win(f, w('kept') + 22, 6)));
  const lock = outBack(win(f, w('traded') + 4, 8));
  const slip = slipPos(f, g);
  const inS = sm(win(f, S.receipts + 2, 10));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <At x={g.chest.x} y={g.chest.y} s={inS * g.chestS}>
          <Chest lid={lidOpen} lock={lock} slotGlow={f > w('handed') - 2 && f < w('handed') + 14 ? 1 : 0} />
        </At>
        {flights.map(({t, i}) => {
          if (t <= 0 || t >= 1) return null;
          const sx = g.chest.x - (g.v ? 600 : 520);
          const sy = g.chest.y - 60 - i * 30;
          const x = lerp(sx, g.chest.x, t);
          const y = lerp(sy, g.chest.y - 80 * g.chestS, t) - 220 * 4 * t * (1 - t);
          return (
            <At key={i} x={x} y={y} rot={t * 180} s={0.7 * g.chestS}>
              <CoinString len={120} />
            </At>
          );
        })}
        {g.people.map((p, i) => {
          const pop = outBack(win(f, w('people') - 10 + i * 4, 10));
          const holding = f > w('traded') - 10 && Math.floor((f - (w('traded') - 10)) / 12) % 4 === i;
          return pop > 0 ? (
            <At key={i} x={p.x} y={p.y} s={pop * g.personS}>
              <Person hold={holding} bob={holding ? -4 : 0} tone={i % 2 ? PAPER : '#E6DFCF'} />
            </At>
          ) : null;
        })}
        {f >= w('handed') && (
          <At x={slip.x} y={slip.y} s={slip.s * 0.42 * g.chestS} rot={slip.rot}>
            <SongNote seal={1} />
          </At>
        )}
      </Svg>
      <Note at={w('receipts') + 4} ground="paper" text="a receipt" size={48} x={g.chest.x + (g.v ? 110 : 100)} y={g.chest.y - 190 * g.chestS - (g.v ? 20 : 70)} from="left" arrow={{x: g.chest.x + (g.v ? 60 : 50), y: g.chest.y - 190 * g.chestS, bend: 0.25}} />
      <Note at={w('instead') + 2} ground="paper" tone="fg" text="the coins stay put" size={42} x={g.chest.x - 180} y={g.chest.y + 125 * g.chestS} rotate={-2} />
      <Kicker g={g} at={S.receipts + 4} text="MERCHANTS · PAPER FOR COINS" ground="paper" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 1024, the seal
export const SealScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const n = g.note;
  const draw = win(f, S.seal + 8, 40);
  const hit = w('took') + 8;
  const fall = clamp((f - (hit - 9)) / 9);
  const landed = f >= hit;
  const shock = win(f, hit, 12);
  const jolt = landed && f < hit + 8 ? Math.sin((f - hit) * 3) * 4 * (1 - (f - hit) / 8) : 0;
  const fan = sm(win(f, w('printed') + 2, 16));
  const sealLocal = {x: n.w * 0.14, y: -n.h * 0.08};
  const sealSize = n.w * 0.36;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {fan > 0 &&
          [-1, 1].map((k) => (
            <At key={k} x={n.x + k * 70 * fan} y={n.y + 10 * fan} rot={k * 8 * fan} o={0.9}>
              <SongNote w={n.w} h={n.h} seal={1} />
            </At>
          ))}
        <At x={n.x + jolt} y={n.y}>
          <SongNote w={n.w} h={n.h} draw={draw} seal={landed ? 1 : 0} />
        </At>
        {!landed && fall > 0 && (
          <g transform={`translate(${n.x + sealLocal.x} ${n.y + sealLocal.y}) scale(${lerp(2.8, 1, fall * fall)})`} opacity={clamp(fall * 3)}>
            <Seal size={sealSize} />
          </g>
        )}
        {landed && shock < 1 && (
          <circle cx={n.x + sealLocal.x} cy={n.y + sealLocal.y} r={sealSize * (0.7 + shock * 1.6)} fill="none" stroke={VERMILION} strokeWidth={6 * (1 - shock)} opacity={1 - shock} />
        )}
      </Svg>
      <Headline at={w('ten') - 2} text="1024" size={g.yearS} x={g.yearPos.x} y={g.yearPos.y} width={g.v ? g.yearPos.w : undefined} align={g.v ? 'center' : 'left'} color={th.fg} />
      <Note at={w('official') - 4} ground="ink" text="official." size={44} x={n.x + (g.v ? 160 : 180)} y={n.y - n.h / 2 - 10} from="bottom" arrow={{x: n.x + sealLocal.x + sealSize * 0.5, y: n.y + sealLocal.y - sealSize * 0.4, bend: 0.3}} />
      <Kicker g={g} at={S.seal + 6} text="SONG DYNASTY · THE STATE TAKES OVER" ground="ink" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- printing too much
export const PrintScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const n = stackCount(f);
  const st = g.stack;
  const flying = f > w('printing') - 4 && f < w('printing') + 100;
  const bx = g.buys.x;
  const iconIn = outBack(win(f, S.print + 6, 10));
  const sackPos = [
    [bx - g.sackDX, g.sackRows[0]], [bx + g.sackDX, g.sackRows[0]], [bx - g.sackDX, g.sackRows[1]], [bx + g.sackDX, g.sackRows[1]],
  ];
  const gone = [null, w('printing') + 70, w('printing') + 40, w('printing') + 12];
  const arrow = sm(win(f, S.print + 12, 10));
  const aTop = g.buys.iconY + 115 * g.iconP + 14;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {/* the stack */}
        {Array.from({length: n}).map((_, i) => (
          <rect key={i} x={st.x - st.w / 2 + (random(`s${i}`) - 0.5) * 12} y={st.y - (i + 1) * st.t} width={st.w} height={st.t - 1.5} fill={i % 2 ? '#EADAB6' : '#F2E2BF'} stroke={INK} strokeWidth={1.4} />
        ))}
        {flying &&
          [0, 1, 2, 3, 4].map((k) => {
            const ph = ((f - w('printing')) / 8 + k / 5) % 1;
            const top = st.y - n * st.t;
            const x = st.x + (random(`fx${k}`) - 0.5) * 120 * (1 - ph);
            const y = lerp(-80, top - 10, ph * ph);
            return (
              <At key={k} x={x} y={y} rot={(1 - ph) * (k % 2 ? 60 : -50)} s={0.34}>
                <SongNote seal={1} />
              </At>
            );
          })}
        {/* what one note buys */}
        <At x={bx} y={g.buys.iconY} s={g.iconP * iconIn}>
          <SongNote seal={1} />
        </At>
        <path d={`M ${bx} ${aTop} L ${bx} ${aTop + 70 * arrow}`} stroke={th.fg} strokeWidth={3} opacity={0.7} />
        {arrow > 0.9 && <path d={`M ${bx - 11} ${aTop + 56} L ${bx} ${aTop + 72} L ${bx + 11} ${aTop + 56}`} stroke={th.fg} strokeWidth={3} fill="none" opacity={0.7} />}
        {sackPos.map(([x, y], i) => {
          const pop = outBack(win(f, w('worked') - 8 + i * 5, 10));
          const g0 = gone[i];
          const out = g0 ? sm(win(f, g0, 8)) : 0;
          const shrink = i === 0 ? lerp(1, 0.55, sm(win(f, w('less') - 4, 10))) : 1;
          const s = pop * (1 - out) * shrink;
          return s > 0.01 ? (
            <At key={i} x={x} y={y}>
              <Sack s={s * g.sackS} />
            </At>
          ) : null;
        })}
      </Svg>
      <Note at={w('worked') + 6} ground="ink" text="one note buys" size={46} x={bx - (g.v ? 300 : 130)} y={g.buys.iconY - 115 * g.iconP - 80} rotate={-3} />
      <Note at={w('less') - 2} ground="ink" tone="red" text="less and less" size={50} x={bx - (g.v ? 90 : 170)} y={g.sackRows[1] + (g.v ? 40 : 30)} rotate={-3} />
      <Mono x={g.v ? 0 : g.cx + 280} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.v ? g.stack.y + 60 : g.stack.y + 50} text="ILLUSTRATIVE" ground="ink" at={S.print + 20} />
      <Kicker g={g} at={S.print + 4} text="WHEN THE STATE NEEDS MONEY" ground="ink" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- back to silver
export const SilverScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const line = sm(win(f, S.silver + 2, 18));
  const [x1, x2, x3] = g.stations;
  const st = [
    {x: x1, at: S.silver + 6, greyAt: w('too') + 2, size: g.yuan, year: '1260', name: 'YUAN'},
    {x: x2, at: w('Ming') - 4, greyAt: w('Ming') + 16, size: g.ming, year: '1375', name: 'MING'},
  ];
  const syY = syceeAt(f, g);
  const gleam = win(f, w('silver') - 2, 16);
  const fadePaper = 1 - 0.55 * sm(win(f, w('back'), 14));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.stations[0] - 200} y1={g.baseY} x2={lerp(g.stations[0] - 200, g.stations[2] + 200, line)} y2={g.baseY} stroke={th.ghost} strokeWidth={2} />
        {st.map((s, i) => {
          const draw = win(f, s.at, 20);
          const copies = Math.floor(3 * sm(win(f, s.at + 14, 16)));
          const grey = sm(win(f, s.greyAt, 18));
          const cyN = g.baseY - 14 - s.size.h / 2;
          return (
            <g key={i} opacity={fadePaper}>
              {Array.from({length: copies}).map((_, k) => (
                <At key={k} x={s.x - 16 * (k + 1)} y={cyN - 8 * (k + 1)} rot={-3 * (k + 1)} o={0.85}>
                  <SongNote w={s.size.w} h={s.size.h} seal={1} grey={grey} />
                </At>
              ))}
              <At x={s.x} y={cyN} rot={grey * 5}>
                <SongNote w={s.size.w} h={s.size.h} draw={draw} seal={draw >= 1 ? 1 : 0} grey={grey} />
              </At>
            </g>
          );
        })}
        {f > w('hundreds') + 2 && (
          <At x={x3} y={syY} s={g.syceeS}>
            <Sycee gleam={gleam > 0 && gleam < 1 ? gleam : -1} />
          </At>
        )}
      </Svg>
      {st.map((s, i) => (
        <React.Fragment key={i}>
          <Headline at={s.at + 4} text={s.year} size={g.yearSmall} x={s.x - 130} y={g.baseY + 24} width={260} align="center" color={th.fg} />
          <Mono x={s.x - 100} w={200} align="center" y={g.baseY + 34 + g.yearSmall} text={s.name} ground="ink" at={s.at + 8} size={20} />
        </React.Fragment>
      ))}
      <Headline at={w('fifteen') - 2} text="1500S" size={g.yearSmall} x={x3 - 130} y={g.baseY + 24} width={260} align="center" color={th.fg} />
      <Mono x={x3 - 100} w={200} align="center" y={g.baseY + 34 + g.yearSmall} text="SILVER" ground="ink" at={w('silver')} size={20} />
      <Note at={w('too') + 4} ground="ink" tone="red" text="printed too much" size={44} x={x1 - (g.v ? 140 : 150)} y={g.baseY - g.yuan.h - (g.v ? 120 : 110)} rotate={-3} />
      <Kicker g={g} at={S.silver + 4} text="SAME MOVE, TWO MORE DYNASTIES" ground="ink" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- sweden
export const SwedenScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const land = plateLand();
  const pY = plateCenterY(f, g);
  const falling = f > land - 13;
  const shadowK = falling ? clamp((f - (land - 13)) / 13) : 0;
  const dust = win(f, land, 16);
  const coins = [0, 1, 2].map((i) => {
    const t = sm(win(f, w('copper') - 6 + i * 5, 16));
    return {x: lerp(g.coinsX - 500, g.coinsX + i * 52, t), rot: (1 - t) * -540, t};
  });
  const shake = f >= land && f < land + 10 ? Math.sin((f - land) * 4) * 5 * (1 - (f - land) / 10) : 0;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <g transform={`translate(0 ${shake * 0.4})`}>
          <line x1={g.W * 0.06} y1={g.sFloor} x2={g.W * 0.94} y2={g.sFloor} stroke={INK} strokeWidth={2.4} />
        </g>
        {coins.map((c, i) =>
          c.t > 0 ? (
            <g key={i} transform={`translate(${c.x} ${g.sFloor - 22}) rotate(${c.rot})`}>
              <circle r={22} fill={COPPER} stroke={INK} strokeWidth={2.4} />
              <circle r={15} fill="none" stroke={INK} strokeWidth={1.2} opacity={0.6} />
              <line x1={-8} y1={0} x2={8} y2={0} stroke={INK} strokeWidth={2} opacity={0.6} />
            </g>
          ) : null,
        )}
        {shadowK > 0 && <ellipse cx={g.plateX} cy={g.sFloor + 3} rx={(g.plate.w / 2) * (0.4 + 0.6 * shadowK)} ry={10} fill={INK} opacity={0.18 * shadowK} />}
        {falling && (
          <At x={g.plateX} y={pY}>
            <CopperPlate w={g.plate.w} h={g.plate.h} />
          </At>
        )}
        {dust > 0 &&
          dust < 1 &&
          [-1, 1].map((k) =>
            [0, 1, 2].map((j) => (
              <circle
                key={`${k}${j}`}
                cx={g.plateX + k * (g.plate.w / 2 + 20 + dust * (40 + j * 30))}
                cy={g.sFloor - 10 - j * 14 - dust * 20}
                r={10 + j * 6 + dust * 14}
                fill="none"
                stroke={INK}
                strokeWidth={2}
                opacity={(1 - dust) * 0.6}
              />
            )),
          )}
      </Svg>
      <Note at={w('time') - 4} ground="paper" tone="fg" text="a normal coin" size={40} x={g.coinsX - 40} y={g.sFloor - 130} from="bottom" arrow={{x: g.coinsX + 10, y: g.sFloor - 52, bend: 0.2}} />
      <Note at={w('twenty') - 4} ground="paper" tone="red" text="almost 20 kg" size={60} x={g.plateX - (g.v ? 200 : 260)} y={g.sFloor - g.plate.h - (g.v ? 190 : 170)} from="bottom" arrow={{x: g.plateX - 60, y: g.sFloor - g.plate.h - 16, bend: 0.25}} />
      <Headline at={w('Sweden') - 6} text="SWEDEN" size={g.v ? 170 : 200} x={g.v ? 0 : 120} y={g.v ? g.cy - 520 : g.kickerY + 50} width={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} color={theme('paper').fg} />
      <Kicker g={g} at={S.sweden + 4} text="SWEDEN · 1600s · COPPER PLATE MONEY" ground="paper" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- stockholm banco
export const BankScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const build = sm(win(f, S.bank + 2, 22));
  const door = sm(win(f, w('printed', 2) - 6, 8)) * (1 - sm(win(f, w("couldn't"), 5)));
  const crack = win(f, w("couldn't") + 6, 18);
  const sag = 16 * sm(win(f, w('pay') + 2, 14));
  const pileN = Math.floor(12 * sm(win(f, w('printed', 2), 50)) + 30 * sm(win(f, w('printed', 3) - 6, 30)));
  const streaming = (f > w('printed', 2) && f < w('printed', 2) + 50) || (f > w('printed', 3) - 6 && f < w('printed', 3) + 26);
  const doorPt = {x: g.bankX, y: g.bFloor - 100 * g.bankS};
  const year = f < w('three') ? '1661' : f < w('years') ? '1662' : f < w('later') ? '1663' : '1664';
  const yearChanged = f >= w('three');
  const queue = [0, 1, 2, 3].map((i) => sm(win(f, w('it', 2) - 14 + i * 4, 14)));
  const bob = f > w("couldn't") ? Math.abs(Math.sin(f * 0.5)) * -8 : 0;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.W * 0.06} y1={g.bFloor} x2={g.W * 0.94} y2={g.bFloor} stroke={INK} strokeWidth={2.4} />
        <defs>
          <clipPath id="bankBuild">
            <rect x={0} y={g.bFloor - (420 * g.bankS + 20) * build} width={g.W} height={(420 * g.bankS + 40) * build} />
          </clipPath>
        </defs>
        <g clipPath="url(#bankBuild)">
          <At x={g.bankX} y={g.bFloor} s={g.bankS}>
            <Bank crack={crack} sag={sag} door={door} />
            <text x={0} y={-259 + sag} textAnchor="middle" fontFamily={FONT.mono} fontSize={17} letterSpacing={3} fill={INK}>
              STOCKHOLMS BANCO
            </text>
          </At>
        </g>
        {Array.from({length: pileN}).map((_, i) => {
          const rx = (random(`px${i}`) - 0.5) * 170 * g.bankS;
          const ry = (-12 - Math.floor(i / 4) * 12 - random(`py${i}`) * 8) * g.bankS;
          return (
            <At key={i} x={g.pileX + rx} y={g.bFloor + ry} rot={(random(`pr${i}`) - 0.5) * 40} s={0.7 * g.bankS}>
              <EuroNote />
            </At>
          );
        })}
        {streaming &&
          [0, 1, 2, 3].map((k) => {
            const ph = ((f / 7 + k / 4) % 1 + 1) % 1;
            const x = lerp(doorPt.x, g.pileX + (random(`sx${k}`) - 0.5) * 120, ph);
            const y = lerp(doorPt.y, g.bFloor - 40, ph) - 160 * 4 * ph * (1 - ph);
            return (
              <At key={k} x={x} y={y} rot={ph * 360 * (k % 2 ? 1 : -1)} s={0.6 * g.bankS}>
                <EuroNote />
              </At>
            );
          })}
        {queue.map((q, i) =>
          q > 0 ? (
            <At key={i} x={lerp(-100, g.bankX - (110 + i * 80) * g.bankS, q)} y={g.bFloor} s={g.bankS * 0.9}>
              <Person bob={i % 2 ? bob : -bob * 0.6} tone={i % 2 ? PAPER : '#E6DFCF'} />
            </At>
          ) : null,
        )}
      </Svg>
      {!yearChanged ? (
        <Headline at={w('sixteen') - 2} text="1661" size={g.bYear.size} x={g.bYear.x} y={g.bYear.y} width={g.v ? g.bYear.w : undefined} align={g.v ? 'center' : 'left'} color={th.fg} />
      ) : (
        <div style={{position: 'absolute', left: g.bYear.x, top: g.bYear.y, width: g.v ? g.bYear.w : undefined, textAlign: g.v ? 'center' : 'left', fontFamily: FONT.display, fontSize: g.bYear.size, lineHeight: 0.92, color: year === '1664' ? RED : th.fg, letterSpacing: g.bYear.size * 0.005}}>
          {year}
        </div>
      )}
      <Note at={w('banknotes') + 4} ground="paper" text="Europe's first" size={48} x={g.pileX - (g.v ? 70 : 80)} y={g.bFloor - (g.v ? 300 : 230 * g.bankS + 40)} from="bottom" arrow={{x: g.pileX, y: g.bFloor - 80 * g.bankS, bend: 0.2}} />
      <Note at={w('pay') + 2} ground="paper" tone="red" text="no copper left" size={52} x={g.bankX - (g.v ? 380 : 560)} y={g.bFloor - 420 * g.bankS - (g.v ? 20 : 0)} rotate={-4} />
      <Kicker g={g} at={S.bank + 4} text="STOCKHOLM · EUROPE'S FIRST BANKNOTES" ground="paper" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- same ending
const pathOf = (pts: {x: number; y: number}[], upto: number) => {
  const n = pts.length - 1;
  const k = upto * n;
  const i = Math.floor(k);
  const out = pts.slice(0, Math.min(i + 1, pts.length));
  if (i < n) {
    const u = k - i;
    out.push({x: lerp(pts[i].x, pts[i + 1].x, u), y: lerp(pts[i].y, pts[i + 1].y, u)});
  }
  return out.map((p, j) => `${j ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
};

export const SameScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const m = mergeT(f);
  const labelsOut = 1 - win(f, w('same', 2) - 10, 5);
  const charts = [
    {key: 'A' as const, pts: CURVE, at: w('Two') - 2, name: 'CHINA', span: '1024 TO 1500s'},
    {key: 'B' as const, pts: CURVE_B, at: w('inventions') - 4, name: 'SWEDEN', span: '1661 TO 1664'},
  ];
  const red = win(f, w('ending'), 10);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {charts.map((c) => {
          const cc = chartCenter(f, g, c.key);
          const d = win(f, c.at, 30);
          const pts = c.pts.map((p) => curvePoint(cc, g, p));
          const x0 = cc.x - g.chart.w / 2;
          const y0 = cc.y - g.chart.h / 2;
          const col = red > 0 ? `rgb(${Math.round(lerp(126, 240, red))},${Math.round(lerp(194, 69, red))},${Math.round(lerp(90, 63, red))})` : GREEN;
          return (
            <g key={c.key} opacity={win(f, c.at - 4, 6)}>
              <line x1={x0 + 30} y1={y0 + g.chart.h - 24} x2={x0 + g.chart.w - 30} y2={y0 + g.chart.h - 24} stroke={th.ghost} strokeWidth={1.6} opacity={1 - m * 0.5} />
              <line x1={x0 + 30} y1={y0 + 20} x2={x0 + 30} y2={y0 + g.chart.h - 24} stroke={th.ghost} strokeWidth={1.6} opacity={1 - m * 0.5} />
              <path d={pathOf(pts, d)} stroke={col} strokeWidth={g.v ? 6 : 5} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={c.key === 'B' ? 1 - 0.35 * m : 1} />
            </g>
          );
        })}
      </Svg>
      {charts.map((c) => {
        const a = c.key === 'A' ? g.chartA : g.chartB;
        return (
          <div key={c.key} style={{position: 'absolute', left: a.x - g.chart.w / 2 + 44, top: a.y - g.chart.h / 2 + 10, opacity: win(f, c.at, 8) * labelsOut}}>
            <div style={{fontFamily: FONT.display, fontSize: g.v ? 56 : 60, color: th.fg, lineHeight: 1}}>{c.name}</div>
            <div style={{fontFamily: FONT.mono, fontSize: 20, letterSpacing: 2, color: th.ghost, marginTop: 8}}>{c.span}</div>
          </div>
        );
      })}
      <Note at={w('ending') + 2} ground="ink" text="same ending." size={60} x={g.chartM.x - (g.v ? 250 : 120)} y={g.chartM.y - g.chart.h / 2 - (g.v ? 70 : 60)} rotate={-3} />
      <Mono x={g.v ? 0 : g.cx + g.chart.w / 2 - 140} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.v ? g.chartB.y + g.chart.h / 2 + 30 : g.chartM.y + g.chart.h / 2 + 30} text="VALUE OF ONE NOTE · ILLUSTRATIVE" ground="ink" at={w('Two') + 10} size={16} />
      <Kicker g={g} at={S.same + 4} text="TWO INVENTIONS" ground="ink" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- trust
export const TrustScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const k = g.bigNote.s;
  const nw = 160 * k;
  const nh = 96 * k;
  const inN = outBack(win(f, S.trust + 6, 14));
  const fade = 1 - sm(win(f, w('paper', 2) - 4, 16));
  const outline = win(f, w('paper', 2) + 6, 10);
  const glow = win(f, w('scarce') - 2, 16);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {fade > 0 && (
          <At x={g.cx} y={g.cy} s={k * inN}>
            <EuroNote o={fade} />
          </At>
        )}
        {outline > 0 && (
          <rect
            x={g.cx - nw / 2}
            y={g.cy - nh / 2}
            width={nw}
            height={nh}
            fill={`rgba(126,194,90,${0.1 * glow})`}
            stroke={glow > 0 ? GREEN : INK}
            strokeWidth={3}
            strokeDasharray="14 10"
            opacity={outline * (0.55 + 0.45 * glow)}
          />
        )}
      </Svg>
      <Headline at={w('trust') - 2} text="TRUST" size={g.trS} x={0} y={g.trTop} width={g.W} align="center" color={th.fg} />
      <Underline at={w('scarce') - 2} x={g.cx - g.trW / 2} y={g.trBase + g.trS * 0.12} w={g.trW + g.trDot.r * 2.6} thick={g.v ? 8 : 9} />
      <Note at={w('scarce') + 4} ground="paper" tone="red" text="the scarce part" size={54} x={g.cx - (g.v ? 150 : 160)} y={g.cy + nh / 2 + (g.v ? 40 : 30)} rotate={-3} />
      <Kicker g={g} at={S.trust + 4} text="WHAT PAPER MONEY REALLY IS" ground="paper" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- end card
export const EndScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const p = clamp((f - END_AT - 10) / 18);
  const e = p * p * (3 - 2 * p);
  const sweep = g.lx - 80 + (g.lw + 160) * e;
  const lh = LOCKUP.h * g.k;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: g.lx, top: g.ly, width: g.lw, height: lh, clipPath: `inset(0 ${(1 - e) * 100}% 0 0)`}}>
        <Img src={staticFile('brand/hotcoin-lockup-light-nodot.png')} style={{width: g.lw, height: lh, display: 'block'}} />
      </div>
      {p > 0 && p < 1 && <div style={{position: 'absolute', left: sweep - 40, top: g.ly - 30, width: 80, height: lh + 60, background: 'linear-gradient(90deg, rgba(126,194,90,0), rgba(126,194,90,0.55), rgba(126,194,90,0))'}} />}
      <div style={{position: 'absolute', width: g.W, top: g.ly + lh + (g.v ? 70 : 60), textAlign: 'center', fontFamily: FONT.mono, fontSize: g.v ? 26 : 22, letterSpacing: 4, color: th.fg, opacity: 0.7 * win(f, END_AT + 58, 10)}}>
        HOTCOIN 101 · MONEY, EXPLAINED
      </div>
      <div style={{position: 'absolute', width: g.W, top: g.ly + lh + (g.v ? 118 : 100), textAlign: 'center', fontFamily: FONT.mono, fontSize: g.v ? 24 : 20, letterSpacing: 3, color: GREEN, opacity: win(f, END_AT + 70, 10)}}>
        hotcoin.com
      </div>
    </AbsoluteFill>
  );
};
