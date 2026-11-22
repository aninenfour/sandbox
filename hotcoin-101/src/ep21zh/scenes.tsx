import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useFrame} from '../design/clock';
import {Headline, Note, Underline} from '../notebook/Notebook';
import {FONT, GREEN, INK, PAPER, RED, theme} from '../notebook/tokens';
import {Kicker, lerp, Mono, outBack, sm, Svg, win} from '../notebook/runner';
import {At, Person, Sack} from '../ep13/art';
import {NewsCard, Out} from '../ep20/scenes';
import {Bubble, Caution, DivingBoard, Easel, Lock, NameTag, Pool, Rug, RUG_GOLD, Slot, Splash, Wallet} from '../ep21/art';
import {S, T, type Geo} from './geo';

const {w, ow, cw} = T;
type SP = {g: Geo};

const Head: React.FC<{g: Geo; at: number; text: string; color: string; size?: number}> = ({g, at, text, color, size}) => (
  <Headline at={at} text={text} size={size ?? g.head.size} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={color} />
);
const Sub: React.FC<{g: Geo; at: number; text: string; ground: 'paper' | 'ink'; color?: string}> = ({g, at, text, ground, color}) => (
  <Mono x={g.v ? 0 : g.head.x + 4} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.head.y + g.head.size * 0.95} text={text} ground={ground} at={at} size={20} color={color} />
);

// ------------------------------------------------------------ cold open: three jokes, three warnings
export const OPEN_WORDS = ['梭哈', '跑路', '赌狗'];
export const OpenScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const B = g.bub;
  const cues = [ow('Ape'), ow('rug'), ow('degen')];
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.v ? 40 : 160} y1={g.floor0} x2={g.v ? g.W - 40 : g.W - 160} y2={g.floor0} stroke={th.ghost} strokeWidth={2.4} opacity={win(f, 2, 8)} />
        {B.at.map((p, i) => {
          const pop = outBack(win(f, cues[i] - 4, 12), 2.2);
          if (pop <= 0) return null;
          const warn = win(f, ow('warnings') - 2 + i * 5, 8);
          const wob = Math.sin(f / 6 + i * 2) * 3 * (1 - warn);
          return (
            <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${(i - 1) * 4 + wob}) scale(${pop})`}>
              <Bubble w={B.w} h={B.h} text={OPEN_WORDS[i]} size={B.size} ring={warn > 0.5 ? RED : INK} fill={PAPER} />
              {warn > 0 && (
                <g transform={`translate(${B.w / 2 - 20} ${-B.h / 2 + 10}) scale(${outBack(warn, 2.4)})`}>
                  <Caution s={1.1} />
                </g>
              )}
              {warn <= 0 && f > cues[i] + 6 && (
                <text x={-B.w / 2 + 40} y={-B.h / 2 - 16} fontFamily={FONT.hand} fontWeight={700} fontSize={40} fill={GREEN} opacity={0.9}>
                  哈哈
                </text>
              )}
            </g>
          );
        })}
      </Svg>
      <Head g={g} at={ow('jokes') - 4} text="黑话?" color={th.fg} />
      <Note at={ow('costume') - 4} ground="paper" tone="red" text="穿着笑话外衣的警告" size={g.v ? 46 : 52} x={g.v ? g.cx - 230 : g.cx - 250} y={g.v ? g.floor0 + 40 : g.floor0 + 30} rotate={-3} />
      <Kicker g={g} at={4} text="币圈黑话词典" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ title
export const TitleScene: React.FC<SP> = ({g}) => {
  const th = theme('paper');
  const t = T.TITLE_AT;
  return (
    <AbsoluteFill>
      <Headline at={t + 2} text="FILE 021 · 黑话" size={g.t1S} x={0} y={g.t1Top} width={g.W} align="center" color={th.fg} stagger={0.7} />
      <Headline at={t + 8} text="梭哈 跑路 赌狗" size={g.tS} x={0} y={g.tTop} width={g.W} align="center" color={th.fg} stagger={1.1} />
      <Headline at={t + 28} text="披着笑话外衣的警告" size={g.subS} x={0} y={g.subTop} width={g.W} align="center" color={GREEN} stagger={0.6} />
      <Underline at={t + 44} x={g.cx - g.tW / 2} y={g.tBase + g.tS * 0.06} w={g.tW + g.tDot.r * 2.6} thick={g.v ? 8 : 9} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ ape: everyone jumps, nobody reads
export const jumpAt = (i: number) => w('buying') - 4 + i * 14;
export const landAt = (g: Geo, i: number) => ({x: g.pool.x + 110 + i * (g.pool.w - 220) / 4, y: g.pool.y});
export const ApeScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const Bd = g.board;
  const P = g.pool;
  const boardIn = outBack(win(f, S.ape + 4, 12));
  const signIn = outBack(win(f, S.ape + 10, 12));
  const meLand = w('jumping') + 14;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <g opacity={boardIn}>
          <At x={Bd.x} y={Bd.y}>
            <DivingBoard len={Bd.len} bend={f > w('jumping') && f < w('jumping') + 10 ? Math.sin((f - w('jumping')) * 1.4) * 14 : 0} />
          </At>
          <At x={P.x} y={P.y}>
            <Pool w={P.w} h={P.h} t={f} />
          </At>
        </g>
        {signIn > 0 && (
          <g transform={`translate(${g.sign.x} ${g.sign.y}) scale(${signIn}) rotate(-4)`}>
            <line x1={0} y1={40} x2={0} y2={170} stroke={INK} strokeWidth={8} />
            <rect x={-170} y={-50} width={340} height={100} rx={16} fill={RUG_GOLD} stroke={INK} strokeWidth={4} />
            <text x={0} y={22} textAnchor="middle" fontFamily={FONT.display} fontSize={64} fill={INK}>
              $NEWCOIN
            </text>
            <text x={130} y={-58} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={40} fill={GREEN}>
              百倍？
            </text>
          </g>
        )}
        {g.queue.map((qx, i) => {
          const t0 = jumpAt(i);
          const t = win(f, t0, 20);
          const L = landAt(g, i);
          const pop = outBack(win(f, S.ape + 8 + i * 2, 10));
          if (pop <= 0) return null;
          if (t >= 1) {
            const bob = Math.sin(f / 7 + i) * 4;
            return (
              <g key={i}>
                <circle cx={L.x} cy={L.y + 8 + bob} r={20} fill={i % 2 ? PAPER : '#E6DFCF'} stroke={INK} strokeWidth={3} />
                <At x={L.x} y={L.y}>
                  <Splash t={win(f, t0 + 20, 16)} />
                </At>
              </g>
            );
          }
          const x = lerp(qx, L.x, t);
          const y = lerp(Bd.y, L.y + 30, t) - Math.sin(Math.PI * t) * 200;
          return (
            <At key={i} x={x} y={y} s={0.82 * pop} rot={t * 200}>
              <Person tone={i % 2 ? PAPER : '#E6DFCF'} bob={t > 0 ? 0 : Math.sin(f / 5 + i) * 2} />
            </At>
          );
        })}
        <At x={P.x + P.w * 0.5} y={P.y}>
          <Splash t={win(f, meLand, 18)} s={1.4} />
        </At>
      </Svg>
      <Head g={g} at={w('Aping') - 4} text="梭哈" color={th.fg} />
      <Sub g={g} at={w('big') - 2} text="冲得快 · 下得重 · 不做功课" ground="ink" color={th.fg} />
      <Note at={w('reading') - 2} ground="ink" text="白皮书？没看" size={g.v ? 44 : 48} x={g.v ? Bd.x + Bd.len - 140 : Bd.x + Bd.len - 220} y={g.v ? Bd.y - 230 : Bd.y - 210} rotate={-4} />
      <Note at={w('everyone') - 2} ground="ink" text="别人都冲了" size={g.v ? 40 : 44} x={g.v ? g.cx - 200 : Bd.x + 60} y={g.v ? P.y + P.h + 40 : Bd.y + 120} rotate={-2} />
      <Kicker g={g} at={S.ape + 4} text="梭哈 · 英文 APE IN" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ rug: the floor gets pulled
export const RugScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const R = g.rug;
  const top = g.floor - R.h;
  const pull = sm(win(f, w('pulls') - 2, 12));
  const fall = win(f, w('pulls') + 2, 10);
  const run = sm(win(f, w('pulls') - 2, 26));
  const rise = sm(win(f, w('launches') - 4, w('in', 2) + 6 - (w('launches') - 4)));
  const crash = sm(win(f, w('disappears') - 4, 10));
  const inn = outBack(win(f, S.rug + 4, 12));
  const tx = g.team.x + run * (g.v ? 500 : 700);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.v ? 20 : 120} y1={g.floor} x2={g.v ? g.W - 20 : g.W - 120} y2={g.floor} stroke={th.ghost} strokeWidth={2.4} />
        <g opacity={inn}>
          <At x={R.x + pull * (g.v ? 1100 : 1500)} y={top}>
            <Rug w={R.w} h={R.h} />
          </At>
          {pull < 0.2 && <line x1={R.x + R.w + 16} y1={top + R.h / 2} x2={g.team.x - 20} y2={g.floor - 60} stroke={INK} strokeWidth={4} />}
          <At x={g.easel.x} y={top - (fall > 0 ? -R.h * fall : 0)} s={g.v ? 0.9 : 1}>
            <g transform={`rotate(${fall * 8})`}>
              <Easel w={g.easel.w} h={g.easel.h} rise={rise} crash={crash} />
            </g>
          </At>
          {g.standers.map((x, i) => {
            const pop = outBack(win(f, S.rug + 8 + i * 3, 10));
            if (pop <= 0) return null;
            const dir = i % 2 ? 1 : -1;
            return (
              <At key={i} x={x} y={top + R.h * fall} s={0.7 * pop} rot={dir * 78 * sm(fall)}>
                <Person tone={i % 2 ? PAPER : '#E6DFCF'} bob={fall > 0 ? 0 : Math.sin(f / 6 + i) * 2} />
              </At>
            );
          })}
          <At x={tx} y={g.floor} s={0.75}>
            <Person tone="#3A3F45" hold />
            <text x={0} y={-82} textAnchor="middle" fontFamily={FONT.display} fontSize={22} fill={PAPER}>
              项目方
            </text>
          </At>
          {f > w('dumps') - 4 && (
            <At x={tx + 40} y={g.floor - 50} s={0.9 * outBack(win(f, w('dumps') - 4, 10))}>
              <Sack />
            </At>
          )}
        </g>
      </Svg>
      <Head g={g} at={w('rug') - 4} text="跑路" color={RED} />
      <Sub g={g} at={w('liquidity') - 2} text="项目方撤走流动性，或者直接砸盘" ground="paper" />
      <Note at={w('dumps') - 2} ground="paper" text="套现走人" size={g.v ? 42 : 46} x={g.v ? g.W - 300 : g.team.x - 120} y={g.floor - (g.v ? 260 : 230)} rotate={-4} />
      <Note at={w('disappears') - 2} ground="paper" tone="red" text="地毯没了" size={g.v ? 44 : 50} x={g.v ? g.cx - 230 : g.cx - 230} y={g.floor + 30} rotate={-3} />
      <Kicker g={g} at={S.rug + 4} text="跑路 · 英文 RUG PULL" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ squid game token: up, locked, gone
export const PEAK_U = 0.74;
export const squidPt = (g: Geo, u: number) => {
  const C = g.chart;
  const p = u <= PEAK_U ? 0.02 + 0.98 * (u / PEAK_U) ** 4 : 0.004;
  return {x: C.x + u * C.w, y: C.y - p * C.h};
};
export const SquidScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const C = g.chart;
  const K = g.card;
  const cardIn = outBack(win(f, w('Squid') - 6, 14));
  const rise = sm(win(f, w('shot') - 6, w('thousand') + 6 - (w('shot') - 6)));
  const drop = win(f, w('dropped') - 2, 6);
  const lock = outBack(win(f, w('sell') - 6, 10), 2.4);
  const n = 40;
  const pts = Array.from({length: n + 1}).map((_, i) => squidPt(g, (i / n) * PEAK_U * rise));
  const peak = squidPt(g, PEAK_U);
  const floorY = C.y - 0.004 * C.h;
  return (
    <AbsoluteFill>
      <NewsCard
        x={K.x}
        y={K.y}
        w={K.w}
        h={K.h}
        rot={-2}
        s={cardIn}
        date="2021 年 11 月 · 鱿鱼游戏代币 ($SQUID)"
        title="蹭剧集热度"
        src="ep21/squid.jpg"
        pos="50% 30%"
        credit="图片：NETFLIX，来自 PC GAMER · 数据：COINTELEGRAPH、GIZMODO"
        stamp={{text: '卷走约 340 万美元', t: win(f, w('million') - 2, 10)}}
      />
      <Svg g={g}>
        <line x1={C.x} y1={C.y} x2={C.x + C.w} y2={C.y} stroke={th.ghost} strokeWidth={3} />
        <line x1={C.x} y1={C.y} x2={C.x} y2={C.y - C.h - 20} stroke={th.ghost} strokeWidth={3} />
        {rise > 0 && <path d={pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ')} stroke={GREEN} strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round" />}
        {drop > 0 && (
          <g>
            <line x1={peak.x} y1={peak.y} x2={peak.x} y2={lerp(peak.y, floorY, drop)} stroke={RED} strokeWidth={8} strokeLinecap="round" />
            {drop >= 1 && <line x1={peak.x} y1={floorY} x2={C.x + C.w} y2={floorY} stroke={RED} strokeWidth={8} strokeLinecap="round" />}
          </g>
        )}
        {rise >= 1 && (
          <text x={peak.x - 20} y={peak.y - 26} textAnchor="end" fontFamily={FONT.display} fontSize={g.v ? 44 : 48} fill={GREEN}>
            $2,861
          </text>
        )}
        {lock > 0 && (
          <g transform={`translate(${peak.x + (g.v ? 90 : 110)} ${peak.y + 60}) scale(${lock})`}>
            <rect x={-80} y={-34} width={160} height={68} rx={14} fill="#3A3F45" stroke={PAPER} strokeWidth={3} />
            <text x={-14} y={14} textAnchor="middle" fontFamily={FONT.display} fontSize={40} fill={PAPER} opacity={0.5}>
              卖出
            </text>
            <g transform="translate(54 -10)">
              <Lock s={0.8} />
            </g>
          </g>
        )}
      </Svg>
      <Mono x={C.x} y={C.y + 16} w={C.w} align="right" text="2021 年 11 月 1 日，美元价格 · 走势示意" ground="ink" at={w('shot')} size={g.v ? 14 : 15} />
      <Note at={w('sell') - 2} ground="ink" tone="red" text="卖不出去" size={g.v ? 40 : 44} x={peak.x + (g.v ? -40 : 30)} y={peak.y + (g.v ? 130 : 110)} rotate={-3} />
      <Head g={g} at={w('zero') - 4} text="$2,861 → $0" color={RED} />
      <Kicker g={g} at={S.squid + 4} text="真实的跑路" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ chainalysis: 37% of scam revenue
export const barH = (g: Geo, f: number) => {
  const grow = sm(win(f, w('thirty-seven') - 8, 22));
  return {b0: g.bars.max * 0.01 * sm(win(f, w('Chainalysis') - 2, 10)) + 6, b1: g.bars.max * grow + 6};
};
export const StatScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const B = g.bars;
  const {b0, b1} = barH(g, f);
  const lab = win(f, w('Chainalysis'), 8);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={B.x0 - 120} y1={B.base} x2={B.x1 + B.bw + 120} y2={B.base} stroke={th.ghost} strokeWidth={3} />
        <rect x={B.x0} y={B.base - b0} width={B.bw} height={b0} rx={8} fill="#C9CED3" stroke={INK} strokeWidth={3} opacity={lab} />
        <rect x={B.x1} y={B.base - b1} width={B.bw} height={b1} rx={8} fill={RED} stroke={INK} strokeWidth={3} opacity={lab} />
        <text x={B.x0 + B.bw / 2} y={B.base - b0 - 20} textAnchor="middle" fontFamily={FONT.display} fontSize={56} fill={INK} opacity={lab}>
          1%
        </text>
        {[['2020', B.x0], ['2021', B.x1]].map(([t, x]) => (
          <text key={t as string} x={(x as number) + B.bw / 2} y={B.base + 50} textAnchor="middle" fontFamily={FONT.mono} fontSize={28} letterSpacing={3} fill={INK} opacity={lab}>
            {t}
          </text>
        ))}
      </Svg>
      <Head g={g} at={w('thirty-seven') - 4} text="37%" color={RED} />
      <Sub g={g} at={w('scam') - 2} text="加密诈骗收入里，来自跑路骗局的占比" ground="paper" />
      <Note at={w('billion') - 4} ground="paper" tone="red" text="超过 28 亿美元" size={g.v ? 56 : 64} x={g.v ? B.x0 - 40 : B.x1 + B.bw + 60} y={g.v ? B.base - B.max * 0.62 : B.base - B.max * 0.7} rotate={-4} />
      <Mono x={g.v ? 0 : B.x0 - 120} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={B.base + 100} text="来源：CHAINALYSIS《2022 加密犯罪报告》" ground="paper" at={w('Chainalysis')} size={g.v ? 16 : 16} />
      <Kicker g={g} at={S.stat + 4} text="规模有多大" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ LIBRA, 2025: the president's post
export const libraPt = (g: Geo, u: number) => {
  const C = g.lchart;
  const peakU = 0.42;
  const p = u <= peakU ? 0.03 + 0.97 * Math.sqrt(u / peakU) : u <= 0.56 ? lerp(1, 0.07, (u - peakU) / 0.14) : 0.07 - (u - 0.56) * 0.05;
  return {x: C.x + u * C.w, y: C.y - p * C.h};
};
export const WALLETS = 8;
export const walletAt = (i: number) => w('insider') - 6 + i * 4;
export const LibraScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const C = g.lchart;
  const K = g.lcard;
  const cardIn = outBack(win(f, w('LIBRA') - 6, 14));
  const up = sm(win(f, w('hit') - 6, w('valuation') - (w('hit') - 6)));
  const down = sm(win(f, w('crashed') - 4, 26));
  const u = 0.42 * up + 0.58 * down;
  const n = 48;
  const pts = Array.from({length: n + 1}).map((_, i) => libraPt(g, (i / n) * u));
  const peak = libraPt(g, 0.42);
  return (
    <AbsoluteFill>
      <NewsCard
        x={K.x}
        y={K.y}
        w={K.w}
        h={K.h}
        rot={2}
        s={cardIn}
        date="2025 年 2 月 · SOLANA 迷因币"
        title="$LIBRA"
        src="ep21/libra.jpg"
        pos="50% 40%"
        credit="图片：DL NEWS · 数据：LOOKONCHAIN、BUBBLEMAPS、NANSEN"
        stamp={{text: '几小时跌超 90%', t: win(f, w('percent', 2) - 2, 10)}}
      />
      <Svg g={g}>
        <line x1={C.x} y1={C.y} x2={C.x + C.w} y2={C.y} stroke={th.ghost} strokeWidth={3} />
        <line x1={C.x} y1={C.y} x2={C.x} y2={C.y - C.h - 20} stroke={th.ghost} strokeWidth={3} />
        {u > 0 && (
          <path d={pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ')} stroke={down > 0 ? RED : GREEN} strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        )}
        {up >= 1 && (
          <text x={peak.x} y={peak.y - 28} textAnchor="middle" fontFamily={FONT.display} fontSize={g.v ? 44 : 48} fill={GREEN}>
            ~$4B
          </text>
        )}
        {Array.from({length: WALLETS}).map((_, i) => {
          const t = win(f, walletAt(i), 30);
          if (t <= 0 || t >= 1) return null;
          const e = sm(t);
          const x = lerp(peak.x, C.x + C.w + 120, e) + (i % 3) * 20;
          const y = lerp(peak.y + 40, peak.y - 120 + (i % 4) * 50, e) - Math.sin(Math.PI * e) * 80;
          return (
            <At key={i} x={x} y={y} rot={Math.sin(f / 4 + i) * 10}>
              <Wallet s={0.9} />
            </At>
          );
        })}
      </Svg>
      <Mono x={C.x} y={C.y + 16} w={C.w} align="right" text="市值 · 走势示意" ground="ink" at={w('hit')} size={g.v ? 14 : 15} />
      <Note at={w('president') - 4} ground="ink" text="阿根廷总统米莱" size={g.v ? 40 : 44} x={g.v ? K.x + 120 : K.x - 60} y={g.v ? K.y + K.h / 2 + 24 : K.y + K.h / 2 + 30} rotate={-3} />
      <Note at={w('insider') - 2} ground="ink" tone="red" text="内部钱包套现约 1 亿美元" size={g.v ? 40 : 44} x={g.v ? g.cx - 250 : C.x + C.w * 0.5} y={g.v ? C.y - C.h * 0.6 : C.y - C.h * 0.55} rotate={-3} />
      <Out until={w('crashed') - 6}>
        <Head g={g} at={w('four') - 4} text="$4B" color={GREEN} />
      </Out>
      <Head g={g} at={w('crashed') - 2} text="几小时 -90%" color={RED} />
      <Kicker g={g} at={S.libra + 4} text="不是老黄历" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ degen: pulls the lever, proudly
export const reelStop = (k: number) => w('gambler') - 10 + k * 10;
export const leverAt = () => w('degen') + 4;
export const DegenScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const M = g.slot;
  const inn = outBack(win(f, S.degen + 4, 14));
  const lever = sm(win(f, leverAt(), 6)) * (1 - sm(win(f, leverAt() + 14, 10)));
  const reels = [0, 1, 2].map((k) => {
    const stop = reelStop(k);
    const start = leverAt() + 4;
    const tt = Math.min(Math.max(f, start), stop);
    return 1 + (stop - tt) * 0.45 + (f >= stop ? Math.sin((f - stop) * 0.9) * 0.08 * Math.exp(-(f - stop) / 4) : 0);
  });
  const lit = win(f, reelStop(2) + 2, 4);
  const tag = outBack(win(f, w('proudly') - 4, 12), 2.2);
  const meX = M.x + M.w / 2 + (g.v ? 70 : 100);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.v ? 20 : 160} y1={M.base} x2={g.v ? g.W - 20 : g.W - 160} y2={M.base} stroke={th.ghost} strokeWidth={2.4} />
        <g transform={`translate(${M.x} ${M.base}) scale(${inn}) translate(0 0)`}>
          <Slot w={M.w} h={M.h} reels={reels} lever={lever} lit={lit} t={f} />
        </g>
        {tag > 0 && (
          <At x={meX} y={M.base - g.r * 2 - 40} s={tag}>
            <NameTag text="赌狗" s={0.8} />
          </At>
        )}
      </Svg>
      <Head g={g} at={w('degen') - 4} text="赌狗" color={th.fg} />
      <Note at={w('degenerate') - 2} ground="paper" text="DEGEN = 赌徒" size={g.v ? 40 : 46} x={g.v ? 60 : g.head.x} y={g.v ? M.base + 40 : g.head.y + 170} rotate={-3} />
      <Note at={w('proudly') - 2} ground="paper" tone="red" text="还挺骄傲" size={g.v ? 44 : 50} x={g.v ? g.cx - 60 : meX - 360} y={g.v ? M.base + 120 : M.base + 40} rotate={-3} />
      <Kicker g={g} at={S.degen + 4} text="赌狗 · 自称" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ closing: who can pull the rug?
export const CloseScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const R = g.crug;
  const top = R.floor - 24;
  const inn = sm(win(f, S.close + 4, 16));
  const lift = sm(win(f, cw('Who') - 6, 18));
  const pivot = R.x + R.w * 0.72;
  const tail = R.w * 0.28;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.v ? 20 : 120} y1={R.floor} x2={g.v ? g.W - 20 : g.W - 120} y2={R.floor} stroke={th.ghost} strokeWidth={2.4} />
        <g opacity={inn}>
          <svg x={R.x} y={top} width={pivot - R.x} height={40} overflow="hidden">
            <Rug w={R.w} />
          </svg>
          {lift > 0 && (
            <text x={pivot + tail * 0.45} y={R.floor - 10} textAnchor="middle" fontFamily={FONT.display} fontSize={g.v ? 110 : 130} fill={RED} opacity={lift}>
              ?
            </text>
          )}
          <g transform={`translate(${pivot} ${top}) rotate(${-lift * 62})`}>
            <svg x={0} y={0} width={tail + 20} height={40} overflow="hidden">
              <g transform={`translate(${-(pivot - R.x)} 0)`}>
                <Rug w={R.w} />
              </g>
            </svg>
          </g>
        </g>
        {g.signs.map((p, i) => {
          const pop = outBack(win(f, cw('jokes') - 4 + i * 4, 12), 2.2);
          if (pop <= 0) return null;
          return (
            <g key={i} transform={`translate(${p.x} ${p.y}) scale(${pop}) rotate(${(i - 1) * 5})`}>
              <Caution s={1.6} />
              <text x={0} y={g.v ? 120 : 130} textAnchor="middle" fontFamily={FONT.display} fontSize={g.v ? 56 : 62} fill={PAPER}>
                {['梭哈', '跑路', '赌狗'][i]}
              </text>
            </g>
          );
        })}
      </Svg>
      <Note at={cw('real') - 2} ground="ink" tone="red" text="风险是真的" size={g.v ? 46 : 52} x={g.v ? g.cx - 170 : g.cx - 170} y={g.v ? g.signs[0].y + 190 : g.signs[0].y + 200} rotate={-3} />
      <Head g={g} at={cw('Who') - 4} text="谁能抽走这块地毯?" color={th.fg} size={g.v ? 96 : 130} />
      <Kicker g={g} at={S.close + 4} text="只问一个问题" ground="ink" />
    </AbsoluteFill>
  );
};
