// Shot 2 "iPhone": the Hotcoin app on an iPhone, flying in with 3D tilt. Home (balance + live market list) ->
// tap BTC -> BTC/USDT chart -> Buy -> a filled-order card pops out of the screen toward camera.
// Market rows are Hotcoin's public spot tickers (api.hotcoinfin.com, 15 Oct 2026); BTC line = Coinbase daily closes.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import data from './data.json';
import {APPFONT, DOWN, Grain, INK, INTRO, LIME, Rings, SANS, Sparkle, UP, WHITE, cl, fmt, io, ip, lerp, out, sp, useFonts} from './kit';

const SW = 390, SH = 844; // logical iPhone screen
const BG = '#0B0B0C', CARD = '#151618', LINE = '#26272B', MUTE = '#8E9199';

const Status: React.FC = () => (
  <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: 54, display: 'flex', alignItems: 'center', padding: '6px 34px 0', boxSizing: 'border-box', fontSize: 17, fontWeight: 600}}>
    9:41
    <div style={{marginLeft: 'auto', display: 'flex', gap: 5, alignItems: 'flex-end'}}>
      {[6, 9, 12, 15].map((h) => <div key={h} style={{width: 3.5, height: h, borderRadius: 1, background: WHITE}} />)}
      <div style={{width: 27, height: 13, borderRadius: 4, border: `1.5px solid ${WHITE}`, marginLeft: 6, padding: 1.5, boxSizing: 'border-box'}}><div style={{width: '78%', height: '100%', background: WHITE, borderRadius: 2}} /></div>
    </div>
  </div>
);

const Row: React.FC<{r: (typeof data.rows)[number]; k: number; hl: number}> = ({r, k, hl}) => (
  <div style={{height: 64, display: 'flex', alignItems: 'center', padding: '0 18px', opacity: k, transform: `translateY(${(1 - k) * 26}px)`, background: `rgba(255,255,255,${0.07 * hl})`, fontVariantNumeric: 'tabular-nums'}}>
    <Img src={staticFile(`promo4/coins/${r.logo}.png`)} style={{width: 34, height: 34, borderRadius: 17, marginRight: 12}} />
    <div>
      <div style={{fontSize: 17, fontWeight: 700}}>{r.sym}<span style={{color: MUTE, fontSize: 13, fontWeight: 500}}>/USDT</span></div>
      <div style={{fontSize: 12, color: MUTE, marginTop: 2}}>Vol {(r.amount / 1e6).toFixed(1)}M</div>
    </div>
    <div style={{marginLeft: 'auto', marginRight: 14, fontSize: 16, fontWeight: 700}}>{Number(r.last) >= 100 ? fmt(Number(r.last)) : r.last}</div>
    <div style={{width: 82, height: 34, borderRadius: 7, background: r.chg >= 0 ? UP : DOWN, textAlign: 'center', lineHeight: '34px', fontSize: 14, fontWeight: 700}}>{r.chg >= 0 ? '+' : ''}{r.chg.toFixed(2)}%</div>
  </div>
);

const Home: React.FC<{f: number}> = ({f}) => {
  const bal = 24815.62 * out((f - 40) / 50);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 18, right: 18, top: 62, height: 40, display: 'flex', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo.png')} style={{height: 21, width: (21 * 485) / 93}} />
        <div style={{marginLeft: 'auto', display: 'flex', gap: 14}}>
          {[0, 1].map((i) => <div key={i} style={{width: 22, height: 22, borderRadius: 11, border: `2px solid ${WHITE}`, opacity: 0.85}} />)}
        </div>
      </div>
      <div style={{position: 'absolute', left: 18, right: 18, top: 116, opacity: out((f - 34) / 14)}}>
        <div style={{fontSize: 14, color: MUTE}}>Total assets (USDT)</div>
        <div style={{fontSize: 38, fontWeight: 700, marginTop: 6, letterSpacing: -0.5, fontVariantNumeric: 'tabular-nums'}}>{fmt(bal)}</div>
        <div style={{fontSize: 14, color: LIME, marginTop: 4}}>Today +312.40 (+1.27%)</div>
      </div>
      <div style={{position: 'absolute', left: 18, right: 18, top: 236, display: 'flex', justifyContent: 'space-between'}}>
        {['Deposit', 'Trade', 'Copy', 'Earn'].map((t, i) => {
          const k = sp(f - 48 - i * 4, 13, 190);
          return (
            <div key={t} style={{width: 78, textAlign: 'center', transform: `scale(${k})`}}>
              <div style={{width: 54, height: 54, borderRadius: 18, margin: '0 auto', background: i === 1 ? LIME : CARD, border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: 20, height: 20, borderRadius: i % 2 ? 4 : 10, border: `2.5px solid ${i === 1 ? INK : WHITE}`}} />
              </div>
              <div style={{fontSize: 13, marginTop: 7, color: '#D7D9DD'}}>{t}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 18, right: 18, top: 336, height: 76, borderRadius: 16, background: 'linear-gradient(110deg, #B8F26A, #7EC25A)', color: INK, padding: '14px 16px', boxSizing: 'border-box', opacity: out((f - 58) / 14)}}>
        <div style={{fontSize: 16, fontWeight: 700}}>TradFi is live</div>
        <div style={{fontSize: 13, marginTop: 3}}>US stocks and gold, traded with USDT</div>
      </div>
      <div style={{position: 'absolute', left: 18, top: 432, display: 'flex', gap: 22, fontSize: 16, fontWeight: 600}}>
        <span>Hot</span><span style={{color: MUTE}}>Gainers</span><span style={{color: MUTE}}>New</span><span style={{color: MUTE}}>TradFi</span>
      </div>
      <div style={{position: 'absolute', left: 18, top: 460, width: 30, height: 3, borderRadius: 2, background: GREEN_UI}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 474}}>
        {data.rows.map((r, i) => <Row key={r.sym} r={r} k={out((f - 64 - i * 5) / 16)} hl={i === 0 ? ip(f, [146, 150, 170], [0, 1, 0.6], cl) : 0} />)}
      </div>
    </div>
  );
};
const GREEN_UI = '#7EC25A';

const pts = data.btc.map((p) => p[1] as number);
const Detail: React.FC<{f: number; buy: number}> = ({f, buy}) => {
  const W = 354, H = 250, lo = Math.min(...pts), hi = Math.max(...pts);
  const d = pts.map((v, i) => `${i ? 'L' : 'M'}${((i / (pts.length - 1)) * W).toFixed(1)},${(H - ((v - lo) / (hi - lo)) * (H - 20) - 10).toFixed(1)}`).join(' ');
  const draw = out((f - 176) / 50);
  const last = pts[pts.length - 1];
  return (
    <div style={{position: 'absolute', inset: 0, background: BG}}>
      <div style={{position: 'absolute', left: 18, right: 18, top: 64, display: 'flex', alignItems: 'center', fontSize: 19, fontWeight: 700}}>
        <span style={{fontSize: 24, marginRight: 14, color: MUTE}}>‹</span>
        <Img src={staticFile('promo4/coins/bitcoin.png')} style={{width: 26, height: 26, borderRadius: 13, marginRight: 9}} />BTC/USDT
        <span style={{marginLeft: 'auto', fontSize: 13, color: MUTE, fontWeight: 500}}>Spot</span>
      </div>
      <div style={{position: 'absolute', left: 18, top: 116, fontVariantNumeric: 'tabular-nums'}}>
        <div style={{fontSize: 40, fontWeight: 700, letterSpacing: -0.5, color: UP}}>{fmt(last * ip(f, [170, 220], [0.985, 1], cl))}</div>
        <div style={{fontSize: 14, color: MUTE, marginTop: 4}}>120 days <span style={{color: UP}}>+{(((last / pts[0]) - 1) * 100).toFixed(1)}%</span></div>
      </div>
      <div style={{position: 'absolute', left: 18, top: 210, display: 'flex', gap: 18, fontSize: 13, color: MUTE}}>
        {['1H', '4H', '1D', '1W', '3M'].map((t) => <span key={t} style={{color: t === '3M' ? WHITE : MUTE, fontWeight: t === '3M' ? 700 : 500}}>{t}</span>)}
      </div>
      <svg width={W} height={H} style={{position: 'absolute', left: 18, top: 250, overflow: 'visible'}}>
        <defs>
          <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={UP} stopOpacity="0.35" /><stop offset="1" stopColor={UP} stopOpacity="0" /></linearGradient>
          <clipPath id="pc"><rect x="0" y="-20" width={W * draw} height={H + 40} /></clipPath>
        </defs>
        {[0.25, 0.5, 0.75].map((y) => <line key={y} x1="0" x2={W} y1={H * y} y2={H * y} stroke={LINE} strokeDasharray="3 5" />)}
        <g clipPath="url(#pc)">
          <path d={`${d} L${W},${H} L0,${H} Z`} fill="url(#pf)" />
          <path d={d} fill="none" stroke={UP} strokeWidth={2.6} strokeLinejoin="round" />
        </g>
        {draw > 0.98 && <circle cx={W} cy={H - ((last - lo) / (hi - lo)) * (H - 20) - 10} r={5} fill={UP} />}
      </svg>
      <div style={{position: 'absolute', left: 18, right: 18, top: 530, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13, color: MUTE}}>
        {[['24H High', '82,918.02'], ['24H Low', '80,098.55'], ['24H Vol (USDT)', '1.12B'], ['Fee', '0% maker']].map(([a, b]) => (
          <div key={a} style={{background: CARD, borderRadius: 12, padding: '10px 12px'}}>{a}<div style={{color: WHITE, fontSize: 15, fontWeight: 600, marginTop: 3}}>{b}</div></div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 18, right: 18, bottom: 40, display: 'flex', gap: 12}}>
        <div style={{flex: 1, height: 54, borderRadius: 14, background: UP, textAlign: 'center', lineHeight: '54px', fontSize: 18, fontWeight: 700, transform: `scale(${1 - 0.06 * buy})`}}>Buy</div>
        <div style={{flex: 1, height: 54, borderRadius: 14, background: DOWN, textAlign: 'center', lineHeight: '54px', fontSize: 18, fontWeight: 700}}>Sell</div>
      </div>
    </div>
  );
};

const Touch: React.FC<{x: number; y: number; at: number; f: number}> = ({x, y, at, f}) => {
  const t = f - at;
  if (t < -10 || t > 24) return null;
  const s = ip(t, [-10, -2, 0, 4, 24], [0.5, 1, 0.8, 1, 0.6], cl), ring = ip(t, [0, 20], [0, 1], cl);
  return (
    <>
      {t >= 0 && <div style={{position: 'absolute', left: x - 24 - ring * 20, top: y - 24 - ring * 20, width: 48 + ring * 40, height: 48 + ring * 40, borderRadius: '50%', border: `2px solid rgba(255,255,255,${0.7 * (1 - ring)})`}} />}
      <div style={{position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.75)', transform: `scale(${s})`}} />
    </>
  );
};

// iPhone body: titanium band + black bezel + Dynamic Island. Screen children are laid out at 390 x 844.
const IPhone: React.FC<{k: number; children: React.ReactNode}> = ({k, children}) => {
  const w = SW * k, h = SH * k, b = 13 * k, rad = 58 * k;
  return (
    <div style={{position: 'relative', width: w + b * 2 + 6 * k, height: h + b * 2 + 6 * k}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: rad + b + 3 * k, background: 'linear-gradient(135deg, #8B8E93 0%, #3B3D41 18%, #1C1D20 50%, #4A4C50 82%, #9EA1A6 100%)'}} />
      <div style={{position: 'absolute', inset: 3 * k, borderRadius: rad + b, background: '#050505'}} />
      {/* side buttons */}
      <div style={{position: 'absolute', right: -3 * k, top: 220 * k, width: 4 * k, height: 96 * k, borderRadius: 3 * k, background: '#4A4C50'}} />
      <div style={{position: 'absolute', left: -3 * k, top: 180 * k, width: 4 * k, height: 60 * k, borderRadius: 3 * k, background: '#4A4C50'}} />
      <div style={{position: 'absolute', left: -3 * k, top: 256 * k, width: 4 * k, height: 60 * k, borderRadius: 3 * k, background: '#4A4C50'}} />
      <div style={{position: 'absolute', left: b + 3 * k, top: b + 3 * k, width: w, height: h, borderRadius: rad, overflow: 'hidden', background: BG}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: SH, transform: `scale(${k})`, transformOrigin: '0 0', fontFamily: APPFONT, color: WHITE}}>{children}</div>
        {/* glass reflection */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.05) 100%)'}} />
      </div>
      <div style={{position: 'absolute', left: '50%', top: b + 14 * k, width: 122 * k, height: 36 * k, marginLeft: -61 * k, borderRadius: 18 * k, background: '#000'}} />
    </div>
  );
};

// "in your pocket." opens big in the centre, then slides left and shrinks to make room for the phone.
const Phrase: React.FC<{g: number}> = ({g}) => {
  const a = out((g - 4) / 16), m = io((g - (INTRO - 22)) / 34), b = io((g - (INTRO + 128)) / 14);
  if (g < 2 || b >= 1) return null;
  const size = lerp(168, 104, m);
  return (
    <div style={{position: 'absolute', left: lerp(960, 110, m), top: 540, transform: `translate(${-50 * (1 - m)}%, -50%) translateY(${(1 - a) * 30 - b * 20}px)`,
      fontFamily: SANS, fontWeight: 600, fontSize: size, letterSpacing: -size * 0.045 + (1 - a) * 8, color: INK, whiteSpace: 'nowrap', opacity: a * (1 - b), filter: `blur(${(1 - a) * 14 + b * 16}px)`}}>in your pocket.</div>
  );
};

const Scene: React.FC = () => {
  const g = useCurrentFrame(), f = g - INTRO;
  // phone flight
  const enter = sp(f - 2, 17, 95, 1.1);
  const swing = io((f - 150) / 36), pop = io((f - 236) / 30);
  const rx = lerp(58, 12, enter) - 4 * pop, ry = lerp(-42, -20, enter) + 36 * swing - 6 * pop, rz = lerp(14, -3, enter) + 4 * swing;
  const tx = lerp(420, 270, enter) - 330 * swing + 40 * pop, ty = lerp(1100, 0, enter), tz = -180 * pop;
  const toDetail = io((f - 156) / 20);
  const buy = ip(f, [228, 232, 238], [0, 1, 0], cl);
  // filled-order card flying out of the screen
  const card = sp(f - 238, 15, 130);
  const bgT = f / 300;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 90% at ${lerp(60, 40, swing)}% 55%, #E9FCD0 0%, #C6F28C 38%, #8FD84E 75%, #5BAA2E 100%)`, overflow: 'hidden'}}>
      <Rings cx={lerp(1150, 830, swing)} cy={540} color="rgba(255,255,255,0.55)" base={330} t={bgT} />
      <Phrase g={g} />
      <Sparkle x={1580} y={250} s={70} f={f} at={250} />
      <Sparkle x={1660} y={330} s={30} f={f} at={258} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: 2400, perspectiveOrigin: '50% 45%'}}>
        <div style={{position: 'absolute', left: 960 - 240 + tx, top: 540 - 505 + ty, transform: `translateZ(${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`, transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 60px 80px rgba(20,40,10,0.35))'}}>
          <IPhone k={1.16}>
            <Status />
            <div style={{position: 'absolute', inset: 0, transform: `translateX(${-toDetail * 120}px)`, opacity: 1 - toDetail}}><Home f={f} /></div>
            {toDetail > 0 && <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - toDetail) * SW}px)`, boxShadow: '-20px 0 40px rgba(0,0,0,0.5)'}}><Detail f={f} buy={buy} /><Status /></div>}
            <Touch x={120} y={506} at={150} f={f} />
            <Touch x={105} y={780} at={230} f={f} />
          </IPhone>
        </div>
      </div>
      {/* order card, pops toward camera */}
      {f >= 238 && (
        <div style={{position: 'absolute', left: 1050, top: 300, width: 600, transform: `translate(${(1 - card) * -260}px, ${(1 - card) * 180}px) scale(${0.45 + 0.55 * card}) rotate(${(1 - card) * -12 - 3}deg)`, transformOrigin: '0 50%',
          borderRadius: 34, background: 'rgba(10,12,12,0.92)', color: WHITE, padding: '30px 34px', fontFamily: SANS, boxShadow: '0 50px 90px rgba(10,30,5,0.45), inset 0 1px 0 rgba(255,255,255,0.12)', opacity: Math.min(1, card * 2)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{width: 46, height: 46, borderRadius: 23, background: LIME, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700}}>✓</div>
            <div style={{fontSize: 30, fontWeight: 600, letterSpacing: -0.6}}>Order filled</div>
            <Img src={staticFile('brand/logo.png')} style={{marginLeft: 'auto', height: 22, width: (22 * 485) / 93, opacity: 0.9}} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 24}}>
            <Img src={staticFile('promo4/coins/bitcoin.png')} style={{width: 54, height: 54, borderRadius: 27}} />
            <div style={{fontSize: 52, fontWeight: 600, letterSpacing: -2}}>+0.0500 <span style={{fontSize: 30, color: '#9AA09C'}}>BTC</span></div>
          </div>
          <div style={{fontSize: 20, color: '#9AA09C', marginTop: 10, fontFamily: APPFONT}}>Spot · BTC/USDT · market order</div>
        </div>
      )}
      <Grain o={0.06} />
    </AbsoluteFill>
  );
};

export const PhoneShot: React.FC = () => {
  useFonts();
  return <CameraMotionBlur samples={7} shutterAngle={200}><Scene /></CameraMotionBlur>;
};
