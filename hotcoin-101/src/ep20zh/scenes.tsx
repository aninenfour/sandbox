import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {useFrame} from '../design/clock';
import {Headline, Note, Underline} from '../notebook/Notebook';
import {FONT, GREEN, INK, PAPER, RED, theme} from '../notebook/tokens';
import {Kicker, lerp, Mono, outBack, sm, Svg, win} from '../notebook/runner';
import {At} from '../ep13/art';
import {BlockBus, Booth, Burst, BusyGauge, CREAM, Crate, Gavel, Paddle, Parcel, Stairs, TX, TxCube} from '../ep20/art';
import {S, seatAt, T, type Geo} from './geo';

const {w, ow, cw} = T;
type SP = {g: Geo};

/** fades its children out from `until` */
const Out: React.FC<{until: number; children: React.ReactNode}> = ({until, children}) => {
  const f = useFrame();
  const o = 1 - win(f, until, 6);
  if (o <= 0) return null;
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const Head: React.FC<{g: Geo; at: number; text: string; color: string; size?: number}> = ({g, at, text, color, size}) => (
  <Headline at={at} text={text} size={size ?? g.head.size} x={g.head.x} y={g.head.y} width={g.v ? g.head.w : undefined} align={g.v ? 'center' : 'left'} color={color} />
);

/** a real photo on a card with a caption and a source line. centred on x,y */
const PhotoCard: React.FC<{x: number; y: number; w: number; h: number; rot: number; s: number; src: string; pos?: string; lines: string[]; credit: string}> = ({x, y, w: cw_, h, rot, s, src, pos = '50% 50%', lines, credit}) => {
  if (s <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - cw_ / 2 - 16,
        top: y - h / 2 - 16,
        width: cw_ + 32,
        padding: 16,
        background: CREAM,
        border: `3px solid ${INK}`,
        borderRadius: 10,
        boxShadow: '0 14px 30px rgba(0,0,0,0.35)',
        transform: `rotate(${rot}deg) scale(${s})`,
        transformOrigin: '50% 50%',
      }}
    >
      <Img src={staticFile(src)} style={{width: cw_, height: h, objectFit: 'cover', objectPosition: pos, display: 'block', borderRadius: 4}} />
      {lines.map((l, i) => (
        <div key={i} style={{fontFamily: i ? FONT.mono : FONT.display, fontSize: i ? 17 : 34, letterSpacing: i ? 2 : 1, color: INK, marginTop: i ? 2 : 12, lineHeight: 1.1, textTransform: 'uppercase'}}>
          {l}
        </div>
      ))}
      <div style={{fontFamily: FONT.mono, fontSize: 13, letterSpacing: 1.5, color: INK, opacity: 0.55, marginTop: 8}}>{credit}</div>
    </div>
  );
};

/** a newspaper-style card: dateline, headline, real image, source. centred on x,y */
const NewsCard: React.FC<{x: number; y: number; w: number; h: number; rot: number; s: number; o?: number; date: string; title: string; src: string; pos?: string; credit: string; stamp?: {text: string; t: number}}> = ({
  x,
  y,
  w: cw_,
  h,
  rot,
  s,
  o = 1,
  date,
  title,
  src,
  pos = '50% 50%',
  credit,
  stamp,
}) => {
  if (s <= 0 || o <= 0) return null;
  const imgH = h - 190;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - cw_ / 2,
        top: y - h / 2,
        width: cw_,
        height: h,
        boxSizing: 'border-box',
        padding: '18px 22px',
        background: CREAM,
        border: `3px solid ${INK}`,
        borderRadius: 8,
        boxShadow: '0 16px 34px rgba(0,0,0,0.4)',
        transform: `rotate(${rot}deg) scale(${s})`,
        opacity: o,
      }}
    >
      <div style={{fontFamily: FONT.mono, fontSize: 18, letterSpacing: 3, color: RED}}>{date}</div>
      <div style={{fontFamily: FONT.display, fontSize: 46, lineHeight: 1, color: INK, marginTop: 6, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{title}</div>
      <div style={{height: 2, background: INK, opacity: 0.5, margin: '10px 0 12px'}} />
      <div style={{position: 'relative'}}>
        <Img src={staticFile(src)} style={{width: '100%', height: imgH, objectFit: 'cover', objectPosition: pos, display: 'block', borderRadius: 4}} />
        {stamp && stamp.t > 0 && (
          <div
            style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              padding: '6px 16px',
              border: `5px solid ${RED}`,
              borderRadius: 8,
              background: 'rgba(243,233,210,0.92)',
              color: RED,
              fontFamily: FONT.display,
              fontSize: 48,
              transform: `rotate(-8deg) scale(${outBack(stamp.t, 2.4)})`,
              transformOrigin: '100% 100%',
            }}
          >
            {stamp.text}
          </div>
        )}
      </div>
      <div style={{fontFamily: FONT.mono, fontSize: 13, letterSpacing: 1.5, color: INK, opacity: 0.6, marginTop: 10}}>{credit}</div>
    </div>
  );
};

// ------------------------------------------------------------ cold open: a $50 fee to send $20
export const OpenScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const gy = g.ground0;
  const b = g.booth;
  const p = g.parcel;
  const boothIn = outBack(win(f, 4, 14));
  const parcelIn = outBack(win(f, 8, 12));
  const fee = f >= ow('fees') - 2;
  const signY = gy - 440 * b.s;
  const swing = win(f, ow('losing') - 2, ow('auction') + 2 - (ow('losing') - 2));
  const strike = f >= ow('auction') + 2;
  const gavelO = win(f, ow('losing') - 6, 6);
  const hx = b.x + 40 * b.s;
  const hy = signY - 72 * b.s;
  const rot = strike ? 0 : lerp(70, 0, swing * swing);
  const burst = win(f, ow('auction') + 2, 12);
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.v ? 40 : 160} y1={gy} x2={g.v ? g.W - 40 : g.W - 160} y2={gy} stroke={th.ghost} strokeWidth={2.4} opacity={win(f, 2, 8)} />
        {boothIn > 0 && (
          <At x={b.x} y={gy} s={b.s * boothIn}>
            <Booth sign={fee ? '$50' : '...'} signColor={fee ? RED : INK} label="手续费" />
          </At>
        )}
        {parcelIn > 0 && (
          <At x={p.x} y={gy} s={p.s * parcelIn}>
            <Parcel tag="$20" />
          </At>
        )}
        {gavelO > 0 && (
          <g opacity={gavelO} transform={`translate(${hx + 185 * b.s} ${hy}) rotate(${rot}) translate(${-185 * b.s} 0) scale(${b.s}) rotate(90)`}>
            <Gavel />
          </g>
        )}
        <At x={hx} y={signY}>
          <Burst r={90} t={burst} color={RED} />
        </At>
      </Svg>
      <Head g={g} at={ow('sending') - 6} text="转 $20，手续费 $50?" color={th.fg} size={g.v ? 96 : undefined} />
      <Mono x={g.v ? 0 : g.head.x + 4} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.head.y + g.head.size * 0.95} text="示意 · 网络拥堵时的手续费" ground="paper" at={ow('sending') + 2} size={20} />
      <Note at={ow('bank') - 4} ground="paper" text="付给银行？" strike size={g.v ? 42 : 46} x={g.v ? g.cx - 320 : p.x - 240} y={g.v ? gy + 60 : gy + 40} rotate={-3} />
      <Note at={ow('auction') - 2} ground="paper" tone="red" text="拍卖里出局了" size={g.v ? 46 : 50} x={g.v ? g.cx - 40 : b.x - 470} y={g.v ? gy + 140 : signY - 10} rotate={-3} />
      <Kicker g={g} at={4} text="手续费比转账还贵" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ title
export const TitleScene: React.FC<SP> = ({g}) => {
  const th = theme('paper');
  const t = T.TITLE_AT;
  return (
    <AbsoluteFill>
      <Headline at={t + 2} text="FILE 020 · 加密货币" size={g.t1S} x={0} y={g.t1Top} width={g.W} align="center" color={th.fg} stagger={0.7} />
      <Headline at={t + 8} text="GAS 费" size={g.tS} x={0} y={g.tTop} width={g.W} align="center" color={th.fg} stagger={1.1} />
      <Headline at={t + 28} text="为什么转账要花钱" size={g.subS} x={0} y={g.subTop} width={g.W} align="center" color={GREEN} stagger={0.6} />
      <Underline at={t + 44} x={g.cx - g.tW / 2} y={g.tBase + g.tS * 0.06} w={g.tW + g.tDot.r * 2.6} thick={g.v ? 8 : 9} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ the block: a bus that leaves every 12 seconds
export const FILL_ORDER = (g: Geo) => {
  const n = g.bus.cols * g.bus.rows;
  const skip = new Set([g.mySeat, n - 1, n - 2]);
  return Array.from({length: n}).map((_, i) => i).filter((i) => !skip.has(i));
};
export const BlockScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const B = g.bus;
  const ph = g.photo;
  const photoIn = outBack(win(f, w('Ethereum') - 6, 14));
  const busIn = outBack(win(f, w('block') - 6, 14));
  const clockIn = outBack(win(f, w('twelve') - 6, 12));
  const order = FILL_ORDER(g);
  const fill0 = w('room') - 16;
  const filled = (i: number) => {
    const k = order.indexOf(i);
    if (k < 0) return 0;
    return outBack(win(f, fill0 + k * 2.2, 8));
  };
  const tag = outBack(win(f, w('twenty-one') - 4, 12));
  const seat = seatAt(B, g.mySeat);
  const sweep = ((f - w('twelve')) / 60) % 1;
  const C = g.clock;
  const arcP = (a: number) => `${C.x + Math.sin(a * Math.PI * 2) * C.r} ${C.y - Math.cos(a * Math.PI * 2) * C.r}`;
  return (
    <AbsoluteFill>
      <PhotoCard
        x={ph.x}
        y={ph.y}
        w={ph.w}
        h={ph.h}
        rot={ph.rot}
        s={photoIn}
        src="ep20/vitalik.jpg"
        pos="50% 25%"
        lines={['Vitalik Buterin', '以太坊联合创始人 · 2015']}
        credit="图片：TECHCRUNCH · CC BY 2.0 · WIKIMEDIA"
      />
      <Svg g={g}>
        {busIn > 0 && (
          <g transform={`translate(${B.x} ${B.y}) scale(${busIn})`}>
            <BlockBus w={B.w} h={B.h} cols={B.cols} rows={B.rows} filled={filled} label="区块 · 空间有限" />
          </g>
        )}
        {clockIn > 0 && (
          <g transform={`translate(${C.x} ${C.y}) scale(${clockIn}) translate(${-C.x} ${-C.y})`}>
            <circle cx={C.x} cy={C.y} r={C.r} fill={INK} stroke={PAPER} strokeWidth={3} />
            {f >= w('twelve') && <path d={`M ${C.x} ${C.y - C.r} A ${C.r} ${C.r} 0 ${sweep > 0.5 ? 1 : 0} 1 ${arcP(Math.max(0.001, sweep))}`} stroke={GREEN} strokeWidth={10} fill="none" strokeLinecap="round" />}
            <text x={C.x} y={C.y + C.r * 0.2} textAnchor="middle" fontFamily={FONT.display} fontSize={C.r * 0.46} fill={PAPER}>
              12秒
            </text>
          </g>
        )}
        {tag > 0 && (
          <g transform={`translate(${seat.x} ${seat.y - seat.sh / 2 - 30}) scale(${tag})`}>
            <rect x={-104} y={-26} width={208} height={52} rx={26} fill={GREEN} stroke={INK} strokeWidth={3} />
            <text x={0} y={10} textAnchor="middle" fontFamily={FONT.display} fontSize={30} fill={INK}>
              21,000 GAS
            </text>
          </g>
        )}
      </Svg>
      <Out until={w('Gas') - 6}>
        <Head g={g} at={w('twelve') - 4} text="12 秒" color={th.fg} />
      </Out>
      <Head g={g} at={w('Gas') - 2} text="GAS = 空间" color={GREEN} />
      <Mono x={g.v ? 0 : g.head.x + 4} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.head.y + g.head.size * 0.95} text="一笔普通 ETH 转账 = 21,000 GAS" ground="ink" at={w('twenty-one') + 2} size={20} color={th.fg} />
      <Note
        at={w('transaction') - 2}
        ground="ink"
        text="你的交易"
        width={g.v ? 168 : 184}
        size={g.v ? 42 : 46}
        x={g.v ? g.cx - 330 : B.x - 330}
        y={B.y + B.h / 2 + (g.v ? 70 : 52)}
        rotate={-3}
        from="right"
        arrow={{x: seat.x - 10, y: seat.y + seat.sh / 2 + 4, bend: -0.25}}
      />
      <Kicker g={g} at={S.block + 4} text="以太坊 · 一个区块" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ the auction: highest bids board first
export const BIDS = [18, 40, 12, 32, 25];
export const boardAt = (k: number) => w('highest') - 4 + k * 10;
export const busFull = () => boardAt(4) + 16;
export const busLeaves = () => w('wait') + 18;
export const AuctionScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const B = g.abus;
  const rank = BIDS.map((v, i) => ({v, i})).sort((a, b) => b.v - a.v);
  const busIn = outBack(win(f, S.auction + 4, 14));
  const leave = sm(win(f, busLeaves(), 34));
  const bx = B.x - leave * (g.v ? 1400 : 1500);
  const door = 1 - win(f, busFull(), 6);
  const seatOf = (i: number) => rank.findIndex((r) => r.i === i);
  const flight = (i: number) => win(f, boardAt(seatOf(i)), 14);
  const filled = (k: number) => (flight(rank[k].i) >= 1 ? 1 : 0);
  const paddleUp = sm(win(f, w('bid') - 6, 10));
  const lowT = win(f, w('low') - 4, 8);
  const qy = g.aGround;
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.v ? 40 : 120} y1={qy} x2={g.v ? g.W - 40 : g.W - 60} y2={qy} stroke={th.ghost} strokeWidth={2.4} />
        {busIn > 0 && (
          <g transform={`translate(${bx} ${B.y}) scale(${busIn})`}>
            <BlockBus w={B.w} h={B.h} cols={B.cols} rows={B.rows} filled={filled} color={(k) => TX[rank[k].i]} label="下一个区块" door={door} />
          </g>
        )}
        {BIDS.map((v, i) => {
          const pop = outBack(win(f, S.auction + 10 + i * 3, 10));
          if (pop <= 0) return null;
          const t = flight(i);
          if (t >= 1) return null;
          const s = seatAt({...B, x: bx}, seatOf(i));
          const e = sm(t);
          const x = lerp(g.queue[i], s.x, e);
          const y = lerp(qy, s.y + 26, e) - Math.sin(Math.PI * e) * 180;
          return (
            <g key={i}>
              <At x={x} y={y} s={1.7 * pop * (1 - e * 0.35)}>
                <TxCube color={TX[i]} />
              </At>
              {t <= 0 && paddleUp > 0 && (
                <At x={g.queue[i] + 50} y={qy - 50 + (1 - paddleUp) * 60} o={paddleUp}>
                  <Paddle text={String(v)} r={36} tilt={8} />
                </At>
              )}
            </g>
          );
        })}
        {paddleUp > 0 && f < w('wait') - 2 && (
          <At x={g.queue[5] + g.r + 4} y={qy - 30 + (1 - paddleUp) * 60} o={paddleUp}>
            <Paddle text="3" r={30} tilt={10} color={lowT > 0 ? '#F6B3AE' : PAPER} />
          </At>
        )}
      </Svg>
      <Head g={g} at={w('auction') - 4} text="拍卖" color={th.fg} />
      <Mono x={g.v ? 0 : g.head.x + 4} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.head.y + g.head.size * 0.95} text="出价：每单位 GAS 多少 GWEI · 示意" ground="paper" at={w('bid') - 2} size={20} />
      <Note at={w('highest') - 4} ground="paper" text="出价高的先上车" size={g.v ? 42 : 46} x={g.v ? g.cx - 300 : B.x - 300} y={g.v ? B.y - B.h / 2 - 110 : B.y - B.h / 2 - 96} rotate={-3} />
      <Note at={w('low') - 2} ground="paper" tone="red" text="出价太低" size={g.v ? 44 : 48} x={g.queue[5] - (g.v ? 150 : 120)} y={qy - (g.v ? 260 : 250)} rotate={-4} />
      <Note at={w('next') - 4} ground="paper" text="……等下一班吧" size={g.v ? 40 : 44} x={g.v ? g.cx - 330 : g.queue[0] - 40} y={qy + (g.v ? 60 : 40)} rotate={-2} />
      <Kicker g={g} at={S.auction + 4} text="人比座位多" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ real jams: CryptoKitties 2017, Otherside 2022
export const popAt = () => w('gas') + 6;
export const SpikesScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const K = g.card;
  const in1 = outBack(win(f, w('game') - 4, 14));
  const in2 = outBack(win(f, w('night') - 6, 14));
  const swap = g.v ? sm(win(f, w('night') - 10, 14)) : 0;
  const x1 = g.c1.x - swap * g.W;
  const x2 = g.v ? g.c2.x + (1 - sm(win(f, w('night') - 6, 14))) * g.W : g.c2.x;
  const pop = win(f, popAt(), 14);
  const popText = outBack(win(f, popAt(), 10), 2.6) * (1 - win(f, popAt() + 22, 6));
  return (
    <AbsoluteFill>
      <NewsCard
        x={x1}
        y={g.c1.y}
        w={K.w}
        h={K.h}
        rot={g.c1.rot}
        s={in1}
        o={g.v ? 1 - swap : 1}
        date="2017 年 12 月 · 以太坊"
        title="加密猫热潮"
        src="ep20/cryptokitties.png"
        pos="50% 60%"
        credit="图片：CRYPTOKITTIES / DAPPER LABS · 数据：BBC、COINDESK"
        stamp={{text: '约 3 万笔卡住', t: win(f, w('thirty') - 2, 10)}}
      />
      <NewsCard
        x={x2}
        y={g.c2.y}
        w={K.w}
        h={K.h}
        rot={g.c2.rot}
        s={in2}
        date="2022 年 4 月 30 日 · 以太坊"
        title="Otherside 卖地"
        src="ep20/otherside.png"
        pos="50% 35%"
        credit="图片：YUGA LABS，来自 DECRYPT · 数据：DECRYPT、THE DEFIANT"
        stamp={{text: 'GAS 费 1.5 亿美元+', t: win(f, w('fifty') - 2, 10)}}
      />
      <Svg g={g}>
        <At x={g.balloon.x} y={g.balloon.y}>
          <Burst r={170} t={pop} color={GREEN} n={16} />
          {popText > 0 && (
            <g transform={`scale(${popText}) rotate(-8)`}>
              <text x={0} y={30} textAnchor="middle" fontFamily={FONT.display} fontSize={120} fill={PAPER} stroke={INK} strokeWidth={6} paintOrder="stroke">
                砰！
              </text>
            </g>
          )}
        </At>
      </Svg>
      <Out until={w('night') - 8}>
        <Head g={g} at={w('thirty') - 4} text="3 万笔卡住" color={th.fg} />
      </Out>
      <Head g={g} at={w('fifty') - 4} text="GAS 费 1.5 亿美元+" color={RED} />
      <Kicker g={g} at={S.spikes + 4} text="真实的大堵车" ground="ink" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ the way out: layer two, and the fee stairs
export const STEPS = ['主网', '二层网络', '2024 年 3 月', '几美分'];
export const LayerTwoScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('paper');
  const C = g.crate;
  const St = g.stairs;
  const crateIn = outBack(win(f, w('Rollups') - 4, 14));
  const pack = sm(win(f, w('bundle') - 4, w('post') - (w('bundle') - 4)));
  const squeeze = sm(win(f, w('one', 4) - 6, 12));
  const cube = outBack(win(f, w('one', 4) + 2, 12));
  const stairs = sm(win(f, w('upgrade') - 14, 18));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        {crateIn > 0 && squeeze < 1 && (
          <g transform={`translate(${C.x} ${C.y}) scale(${crateIn * lerp(1, 0.12, squeeze)} ${crateIn * lerp(1, 0.25, squeeze)})`}>
            <Crate w={C.w} h={C.h} pack={pack} />
          </g>
        )}
        {cube > 0 && (
          <At x={C.x} y={C.y + 40} s={1.6 * cube}>
            <TxCube color={GREEN} />
          </At>
        )}
        {stairs > 0 && (
          <g transform={`translate(${St.x} ${St.y})`}>
            <Stairs n={St.n} sw={St.sw} sh={St.sh} labels={STEPS} show={stairs} fg={INK} />
          </g>
        )}
      </Svg>
      <Out until={w('upgrade') - 6}>
        <Head g={g} at={w('layer') - 4} text="二层网络" color={th.fg} />
      </Out>
      <Head g={g} at={w('few') - 6} text="几美分" color={GREEN} />
      <Mono x={g.v ? 0 : C.x - C.w / 2} w={g.v ? g.W : C.w} align="center" y={C.y + C.h / 2 + 24} text="几百笔交易，装进一个箱子" ground="paper" at={w('hundreds')} size={g.v ? 18 : 17} />
      <Note at={w('post') - 2} ground="paper" text="合成一笔上链" size={g.v ? 44 : 48} x={g.v ? g.cx + 40 : C.x - 120} y={g.v ? C.y + C.h / 2 + 70 : C.y + C.h / 2 + 70} rotate={-3} />
      <Mono x={g.v ? 0 : St.x - 40} w={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} y={g.floorY + 24} text="2024 年 3 月 DENCUN 升级后，部分二层网络的手续费中位数" ground="paper" at={w('cents') - 2} size={g.v ? 17 : 16} />
      <Kicker g={g} at={S.l2 + 4} text="出路" ground="paper" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ closing: you're one of the bidders
export const CloseScene: React.FC<SP> = ({g}) => {
  const f = useFrame();
  const th = theme('ink');
  const M = g.me;
  const G = g.gauge;
  const gy = g.ground9;
  const strike = sm(win(f, cw('tax') + 2, 8));
  const you = sm(win(f, cw('send') - 4, 10));
  const gaugeIn = outBack(win(f, cw('busy') - 6, 12));
  const up = sm(win(f, cw('busy') - 2, 14));
  const down = sm(win(f, cw('ride') + 16, 30));
  const needle = lerp(lerp(0.12, 0.88, up), 0.18, down) + Math.sin(f / 3) * 0.015 * up * (1 - down);
  const others = (g.v ? [-330, 250, 400] : [-360, -200, 230]).map((dx, i) => ({x: M.x + dx, i}));
  return (
    <AbsoluteFill>
      <Svg g={g}>
        <line x1={g.v ? 40 : 160} y1={gy} x2={g.v ? g.W - 40 : G.x - G.r - 60} y2={gy} stroke={th.ghost} strokeWidth={2.4} />
        {others.map((o) => {
          const pop = outBack(win(f, cw('bidders') - 10 + o.i * 3, 10));
          if (pop <= 0) return null;
          return (
            <g key={o.i}>
              <At x={o.x} y={gy} s={1.5 * pop}>
                <TxCube color={TX[o.i + 1]} />
              </At>
              <At x={o.x + 44} y={gy - 44} s={pop}>
                <Paddle text={String([14, 22, 9][o.i])} r={34} tilt={-8 + o.i * 8} />
              </At>
            </g>
          );
        })}
        {you > 0 && (
          <At x={M.x + M.r + 26} y={gy - 10 + (1 - you) * 80} o={you}>
            <Paddle text="你" r={40} tilt={10} color={GREEN} />
          </At>
        )}
        {gaugeIn > 0 && (
          <g transform={`translate(${G.x} ${G.y}) scale(${gaugeIn})`}>
            <BusyGauge r={G.r} v={needle} />
            <text x={-G.r} y={44} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} letterSpacing={2} fill={PAPER} opacity={0.7}>
              畅通
            </text>
            <text x={G.r} y={44} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} letterSpacing={2} fill={PAPER} opacity={0.7}>
              拥堵
            </text>
          </g>
        )}
      </Svg>
      <Out until={cw('auction') - 6}>
        <Head g={g} at={cw('Fees') - 2} text="是税？" color={th.fg} />
        {strike > 0 && (
          <div
            style={{
              position: 'absolute',
              left: g.v ? g.cx - 170 : g.head.x - 10,
              top: g.head.y + g.head.size * 0.42,
              width: (g.v ? 360 : 380) * strike,
              height: 12,
              background: RED,
              borderRadius: 6,
              transform: 'rotate(-4deg)',
            }}
          />
        )}
      </Out>
      <Out until={cw('bidders') - 8}>
        <Head g={g} at={cw('auction') - 4} text="是拍卖" color={GREEN} />
      </Out>
      <Head g={g} at={cw('bidders') - 4} text="你就是出价人" color={th.fg} size={g.v ? 120 : undefined} />
      <Note at={cw('check') - 2} ground="ink" text="先看看堵不堵" size={g.v ? 42 : 46} x={g.v ? g.cx - 220 : G.x - 200} y={g.v ? G.y + 70 : G.y + 70} rotate={-3} />
      <Note at={cw('ride') + 18} ground="ink" tone="fg" text="路不堵，车费就便宜" size={g.v ? 40 : 42} x={g.v ? g.cx - 230 : G.x - 230} y={g.v ? G.y + 130 : G.y + 130} rotate={-2} />
      <Kicker g={g} at={S.close + 4} text="划重点" ground="ink" />
    </AbsoluteFill>
  );
};
