import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BTC_HALLOWEEN} from './data';
import {CornerWeb, Ghost, HalloweenLockup, HW, HwBackdrop, Pumpkin} from './art';

// Halloween carousel, 4 slides at 1080 x 1350 (4:5).

export const HW_W = 1080;
export const HW_H = 1350;
const W = HW_W;
const H = HW_H;
const SANS = 'Inter, sans-serif';

const fmt = (v: number) => (v >= 1000 ? `$${Math.round(v).toLocaleString('en-US')}` : v >= 10 ? `$${v.toFixed(0)}` : `$${v.toFixed(2)}`);
const short = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 100000 ? 0 : 1)}K` : v >= 10 ? `$${v.toFixed(0)}` : `$${v.toFixed(2)}`);

const Kicker: React.FC<{text: string; y?: number}> = ({text, y = 96}) => (
  <div style={{position: 'absolute', left: 80, top: y, display: 'flex', alignItems: 'center', gap: 22}}>
    <div style={{width: 46, height: 5, borderRadius: 3, background: HW.green}} />
    <span style={{fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: 7, color: HW.dim}}>{text}</span>
  </div>
);

const Footer: React.FC<{n: number; note?: string}> = ({n, note}) => (
  <>
    {note && <div style={{position: 'absolute', left: 80, bottom: 58, width: 760, fontFamily: SANS, fontWeight: 400, fontSize: 19, lineHeight: 1.4, color: 'rgba(244,244,239,0.45)'}}>{note}</div>}
    <div style={{position: 'absolute', right: 80, bottom: 58, display: 'flex', gap: 10, alignItems: 'center'}}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{width: i === n ? 34 : 10, height: 10, borderRadius: 5, background: i === n ? HW.green : 'rgba(244,244,239,0.3)'}} />
      ))}
    </div>
  </>
);

const Glow: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = HW.green}) => <span style={{color, textShadow: `0 0 28px ${color}88, 0 0 64px ${color}44`}}>{children}</span>;

// ------------------------------------------------------------ 1. cover
export const HwSlide1: React.FC = () => (
  <AbsoluteFill style={{fontFamily: SANS}}>
    <HwBackdrop W={W} H={H} seed="s1" />
    <CornerWeb W={W} corner="tr" size={300} opacity={0.4} />
    <Kicker text="HALLOWEEN SPECIAL" />
    <div style={{position: 'absolute', left: 76, top: 170, fontWeight: 900, fontSize: 128, lineHeight: 0.98, letterSpacing: -3, color: HW.text}}>
      Bitcoin
      <br />
      was born
      <br />
      on <Glow>Halloween.</Glow>
    </div>
    <div style={{position: 'absolute', left: 80, top: 600, width: 880, fontWeight: 400, fontSize: 36, lineHeight: 1.4, color: HW.dim}}>
      31 October 2008. Satoshi Nakamoto shares the Bitcoin whitepaper, and money gets a new costume.
    </div>
    <HalloweenLockup x={80} y={920} w={900} id="s1" />
    <div style={{position: 'absolute', left: 80, bottom: 52, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 26px', borderRadius: 40, border: `2px solid ${HW.green}`, color: HW.text, fontWeight: 800, fontSize: 24, letterSpacing: 3}}>
      SWIPE FOR 16 HALLOWEENS OF BTC →
    </div>
    <Footer n={1} />
  </AbsoluteFill>
);

// ------------------------------------------------------------ 2. price on every Halloween
const box = {x0: 150, x1: 990, y0: 470, y1: 1080};
const ly = (v: number) => {
  const lo = Math.log10(0.1);
  const hi = Math.log10(300000);
  return box.y1 - ((Math.log10(v) - lo) / (hi - lo)) * (box.y1 - box.y0);
};
const lx = (y: number) => box.x0 + ((y - 2010) / 15) * (box.x1 - box.x0);

export const HwSlide2: React.FC = () => {
  const pts = BTC_HALLOWEEN.map((d) => ({...d, px: lx(d.y), py: ly(d.hw)}));
  const path = pts.map((p, i) => `${i ? 'L' : 'M'} ${p.px} ${p.py}`).join(' ');
  const labels = new Set([2010, 2013, 2017, 2021, 2025]);
  const first = BTC_HALLOWEEN[0];
  const last = BTC_HALLOWEEN[BTC_HALLOWEEN.length - 1];
  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <HwBackdrop W={W} H={H} seed="s2" />
      <Kicker text="BTC ON EVERY HALLOWEEN" />
      <div style={{position: 'absolute', left: 76, top: 160, fontWeight: 900, fontSize: 104, lineHeight: 1, letterSpacing: -2, color: HW.text}}>
        {fmt(first.hw)} <span style={{color: HW.dim, fontWeight: 400}}>→</span>
        <br />
        <Glow>{fmt(last.hw)}</Glow>
      </div>
      <div style={{position: 'absolute', left: 80, top: 386, fontWeight: 400, fontSize: 30, color: HW.dim}}>One bitcoin on 31 October, 2010 to 2025</div>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={HW.green} stopOpacity={0.28} />
            <stop offset="100%" stopColor={HW.green} stopOpacity={0} />
          </linearGradient>
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={10} />
          </filter>
        </defs>
        {[1, 100, 10000, 100000].map((v) => (
          <g key={v}>
            <line x1={box.x0} y1={ly(v)} x2={box.x1} y2={ly(v)} stroke={HW.faint} strokeWidth={1.5} strokeDasharray="6 10" />
            <text x={box.x0 - 18} y={ly(v) + 8} textAnchor="end" fontFamily={SANS} fontWeight={500} fontSize={22} fill="rgba(244,244,239,0.5)">
              {v >= 1000 ? `$${v / 1000}K` : `$${v}`}
            </text>
          </g>
        ))}
        {[2010, 2013, 2016, 2019, 2022, 2025].map((y) => (
          <text key={y} x={lx(y)} y={box.y1 + 44} textAnchor="middle" fontFamily={SANS} fontWeight={500} fontSize={22} fill="rgba(244,244,239,0.5)">
            {y}
          </text>
        ))}
        <path d={`${path} L ${box.x1} ${box.y1} L ${box.x0} ${box.y1} Z`} fill="url(#area)" />
        <path d={path} stroke={HW.green} strokeWidth={10} fill="none" filter="url(#lineGlow)" opacity={0.8} />
        <path d={path} stroke={HW.greenHi} strokeWidth={5} fill="none" strokeLinejoin="round" />
        {pts.map((p) => (
          <g key={p.y} transform={`translate(${p.px} ${p.py})`}>
            <Pumpkin r={labels.has(p.y) ? 17 : 11} id={`p${p.y}`} glow={labels.has(p.y) ? 0.9 : 0.5} />
          </g>
        ))}
        {pts
          .filter((p) => labels.has(p.y))
          .map((p) => (
            <text key={`l${p.y}`} x={p.px + (p.y === 2025 ? -6 : p.y === 2010 ? 30 : 0)} y={p.py + (p.y === 2010 ? 10 : -34)} textAnchor={p.y === 2025 ? 'end' : p.y === 2010 ? 'start' : 'middle'} fontFamily={SANS} fontWeight={800} fontSize={30} fill={HW.text}>
              {short(p.hw)}
            </text>
          ))}
      </svg>
      <Footer n={2} note="Log scale: each gridline is 100x the one below. Price on 31 Oct each year. Source: Coin Metrics daily reference rate." />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 3. trick or treat
export const HwSlide3: React.FC = () => {
  const years = BTC_HALLOWEEN.slice(1).map((d, i) => ({y: d.y, ch: (d.hw / BTC_HALLOWEEN[i].hw - 1) * 100}));
  const treats = years.filter((y) => y.ch > 0).length;
  const tricks = years.length - treats;
  const cols = 5;
  const tw = 172;
  const th = 224;
  const gap = 14;
  const gx = (W - (cols * tw + (cols - 1) * gap)) / 2;
  const gy = 430;
  const pct = (v: number) => `${v > 0 ? '+' : ''}${Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('en-US') : Math.round(v)}%`;
  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <HwBackdrop W={W} H={H} seed="s3" />
      <Kicker text="HALLOWEEN TO HALLOWEEN" />
      <div style={{position: 'absolute', left: 76, top: 160, fontWeight: 900, fontSize: 116, lineHeight: 1, letterSpacing: -2, color: HW.text}}>
        Trick or <Glow>treat?</Glow>
      </div>
      <div style={{position: 'absolute', left: 80, top: 310, fontWeight: 400, fontSize: 32, lineHeight: 1.35, color: HW.dim, width: 900}}>
        BTC a year after each Halloween:{' '}
        <b style={{color: HW.green, fontWeight: 800}}>{treats} treats</b>, <b style={{color: HW.red, fontWeight: 800}}>{tricks} tricks</b>.
      </div>
      {years.map((d, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const x = gx + c * (tw + gap);
        const y = gy + r * (th + gap);
        const treat = d.ch > 0;
        return (
          <div
            key={d.y}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: tw,
              height: th,
              borderRadius: 22,
              background: treat ? 'linear-gradient(180deg, rgba(126,194,90,0.14), rgba(126,194,90,0.04))' : 'linear-gradient(180deg, rgba(255,90,78,0.2), rgba(255,90,78,0.05))',
              border: `2px solid ${treat ? 'rgba(126,194,90,0.45)' : 'rgba(255,90,78,0.6)'}`,
            }}
          >
            <svg width={tw} height={116} style={{position: 'absolute', left: 0, top: 8}}>
              <g transform={`translate(${tw / 2} 62)`}>{treat ? <Pumpkin r={32} id={`t${d.y}`} glow={0.6} /> : <Ghost r={36} />}</g>
            </svg>
            <div style={{position: 'absolute', top: 124, width: tw, textAlign: 'center', fontWeight: 500, fontSize: 22, letterSpacing: 2, color: HW.dim}}>
              {d.y - 1}→{String(d.y).slice(2)}
            </div>
            <div style={{position: 'absolute', top: 160, width: tw, textAlign: 'center', fontWeight: 900, fontSize: Math.abs(d.ch) >= 1000 ? 34 : 40, color: treat ? HW.greenHi : HW.red}}>{pct(d.ch)}</div>
          </div>
        );
      })}
      <Footer n={3} note="Change in BTC price from 31 Oct one year to 31 Oct the next. Source: Coin Metrics daily reference rate." />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 4. the November after + CTA
export const HwSlide4: React.FC = () => {
  const ups = BTC_HALLOWEEN.filter((d) => d.nov > 0).length;
  const best = BTC_HALLOWEEN.reduce((a, b) => (b.nov > a.nov ? b : a));
  const worst = BTC_HALLOWEEN.reduce((a, b) => (b.nov < a.nov ? b : a));
  const n = BTC_HALLOWEEN.length;
  const dot = 40;
  const gap = 12;
  const rowW = n * dot + (n - 1) * gap;
  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <HwBackdrop W={W} H={H} seed="s4" />
      <CornerWeb W={W} corner="tr" size={240} opacity={0.3} />
      <Kicker text="THE NOVEMBER AFTER" />
      <div style={{position: 'absolute', left: 72, top: 140, fontWeight: 900, fontSize: 210, lineHeight: 1, letterSpacing: -6, color: HW.text}}>
        <Glow>
          {ups} of {n}
        </Glow>
      </div>
      <div style={{position: 'absolute', left: 80, top: 370, width: 920, fontWeight: 400, fontSize: 34, lineHeight: 1.4, color: HW.dim}}>
        Novembers where BTC ended above its Halloween price. Best <b style={{color: HW.greenHi, fontWeight: 800}}>+{Math.round(best.nov)}%</b> ({best.y}), worst <b style={{color: HW.red, fontWeight: 800}}>{Math.round(worst.nov)}%</b> ({worst.y}).
      </div>
      <svg width={W} height={140} style={{position: 'absolute', left: 0, top: 540}}>
        {BTC_HALLOWEEN.map((d, i) => {
          const x = (W - rowW) / 2 + i * (dot + gap) + dot / 2;
          return (
            <g key={d.y}>
              <circle cx={x} cy={40} r={dot / 2} fill={d.nov > 0 ? HW.green : 'none'} stroke={d.nov > 0 ? HW.green : HW.red} strokeWidth={3} />
              {(i % 3 === 0 || i === n - 1) && (
                <text x={x} y={104} textAnchor="middle" fontFamily={SANS} fontWeight={500} fontSize={20} fill="rgba(244,244,239,0.5)">
                  {`'${String(d.y).slice(2)}`}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <HalloweenLockup x={160} y={790} w={760} id="s4" />
      <div style={{position: 'absolute', left: 0, width: W, top: 1000, textAlign: 'center', fontWeight: 900, fontSize: 52, letterSpacing: 1, color: HW.text}}>
        SAME MARK. <Glow>DARKER SEASON.</Glow>
      </div>
      <div style={{position: 'absolute', left: 0, width: W, top: 1084, textAlign: 'center', fontWeight: 500, fontSize: 28, letterSpacing: 8, color: HW.dim}}>TRADE WHAT'S NEXT ON HOTCOIN</div>
      <Footer n={4} note="Not financial advice. Past Halloweens don't predict the next one. Source: Coin Metrics daily reference rate, 31 Oct to 30 Nov." />
    </AbsoluteFill>
  );
};
