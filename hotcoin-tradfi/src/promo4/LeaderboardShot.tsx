// Shot 3 "Top copy traders": a glass leaderboard card flies in, a trader climbs from #3 to #1 (rows swap),
// then the #1 row lifts out toward camera and "Copy" is pressed. Traders, avatars and numbers are illustrative.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {GREEN, Grain, INK, LIME, Rings, SANS, MONO, Sparkle, UP, WHITE, Word, cl, fmt, io, ip, lerp, out, sp, useFonts} from './kit';

const MUTE = '#7C837D', LINE = 'rgba(11,14,17,0.08)';
type T = {name: string; tag: string; roi0: number; roi1: number; win: number; copiers: number; av: [string, string, string]; seed: number};
// roi0 = before the swap, roi1 = after. The third trader climbs to #1.
const TR: T[] = [
  {name: 'lunar.whale', tag: '@lunarwhale', roi0: 412.6, roi1: 418.1, win: 74, copiers: 2318, av: [INK, LIME, INK], seed: 3},
  {name: 'quietdelta', tag: '@quietdelta', roi0: 368.2, roi1: 371.0, win: 69, copiers: 1876, av: ['#E9FCD0', INK, LIME], seed: 7},
  {name: 'mintgrid', tag: '@mintgrid', roi0: 351.4, roi1: 436.9, win: 78, copiers: 1284, av: [LIME, INK, LIME], seed: 11},
  {name: 'satsrunner', tag: '@satsrunner', roi0: 297.9, roi1: 301.3, win: 66, copiers: 954, av: [GREEN, '#F5F7F2', INK], seed: 5},
  {name: 'nightfox', tag: '@nightfox_q', roi0: 244.0, roi1: 247.5, win: 63, copiers: 731, av: ['#1D2420', LIME, INK], seed: 9},
];
const HERO = 2;

// Simple geometric avatar (no real people).
const Avatar: React.FC<{c: [string, string, string]; s: number; seed: number}> = ({c: [bg, fg, eye], s, seed}) => (
  <svg width={s} height={s} viewBox="0 0 36 36" style={{borderRadius: s / 2, flex: 'none'}}>
    <rect width="36" height="36" fill={bg} />
    <rect x="6" y="8" width="26" height="26" rx="9" fill={fg} transform={`rotate(${(seed % 5) * 9 - 18} 18 18) translate(${(seed % 3) - 1} 3)`} />
    <circle cx={14 + (seed % 2)} cy="19" r="1.8" fill={eye} />
    <circle cx={22 + (seed % 2)} cy="19" r="1.8" fill={eye} />
    <path d={`M${14 + (seed % 2)} 24.5 q4 ${2 + (seed % 3)} 8 0`} stroke={eye} strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
);

// deterministic upward-trending walk for each trader's 30D curve
const curve = (seed: number, n = 30) => {
  let v = 0, r = seed * 9301 + 49297;
  return Array.from({length: n}, (_, i) => {
    r = (r * 9301 + 49297) % 233280;
    v += 0.6 + (r / 233280 - 0.42) * 2.2;
    return v + i * 0.15;
  });
};
const Spark: React.FC<{seed: number; w: number; h: number; k: number; color?: string}> = ({seed, w, h, k, color = UP}) => {
  const c = curve(seed), lo = Math.min(...c), hi = Math.max(...c);
  const pts = c.map((v, i) => [(i / (c.length - 1)) * w, h - ((v - lo) / (hi - lo)) * h]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const len = w * 1.6;
  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <defs><linearGradient id={`g${seed}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity="0.28" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#g${seed})`} opacity={k} />
      <path d={d} stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
    </svg>
  );
};

const CopyBtn: React.FC<{f: number; press: number; done: boolean; scale?: number}> = ({press, done, scale = 1}) => (
  <div style={{width: 128 * scale, height: 50 * scale, borderRadius: 25 * scale, background: done ? INK : LIME, color: done ? LIME : INK, border: `2px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 8 * scale, fontSize: 20 * scale, fontWeight: 600, transform: `scale(${1 - 0.1 * press})`, flex: 'none', boxShadow: done ? '0 10px 24px rgba(11,14,17,0.25)' : 'none'}}>
    {done ? <>✓ Copying</> : 'Copy'}
  </div>
);

const RowBody: React.FC<{t: T; rank: number; roi: number; k: number; f: number; press?: number; done?: boolean; copiers?: number}> = ({t, rank, roi, k, f, press = 0, done = false, copiers}) => (
  <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 30px', gap: 22, fontVariantNumeric: 'tabular-nums'}}>
    <div style={{width: 46, height: 46, borderRadius: 23, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 600, fontSize: 20,
      background: rank === 1 ? INK : rank <= 3 ? '#EEF6E4' : 'transparent', color: rank === 1 ? LIME : INK, border: rank <= 3 ? 'none' : `1.5px solid ${LINE}`}}>{rank}</div>
    <Avatar c={t.av} s={60} seed={t.seed} />
    <div style={{width: 230}}>
      <div style={{fontSize: 27, fontWeight: 600, letterSpacing: -0.6}}>{t.name}</div>
      <div style={{fontSize: 17, color: MUTE, marginTop: 2, fontFamily: MONO}}>{t.tag}</div>
    </div>
    <Spark seed={t.seed} w={170} h={46} k={k} />
    <div style={{width: 190, textAlign: 'right'}}>
      <div style={{fontSize: 34, fontWeight: 600, color: UP, letterSpacing: -1}}>+{fmt(roi * out(k * 1.2), 1)}%</div>
      <div style={{fontSize: 15, color: MUTE, marginTop: 2}}>30D ROI</div>
    </div>
    <div style={{width: 120, textAlign: 'right'}}>
      <div style={{fontSize: 24, fontWeight: 600}}>{(copiers ?? t.copiers).toLocaleString('en-US')}</div>
      <div style={{fontSize: 15, color: MUTE, marginTop: 2}}>copiers</div>
    </div>
    <div style={{marginLeft: 'auto'}}><CopyBtn f={f} press={press} done={done} /></div>
  </div>
);

const RH = 112, CW = 1180;

const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const enter = sp(f - 2, 16, 90, 1);
  const swap = io((f - 62) / 44); // #3 climbs to #1
  const lift = io((f - 128) / 34); // hero row lifts out toward camera
  const press = ip(f, [196, 201, 208], [0, 1, 0], cl);
  const done = f >= 202;
  const pop = sp(f - 202, 11, 220);
  // rank positions before/after the swap
  const pos0 = [0, 1, 2, 3, 4], pos1 = [1, 2, 0, 3, 4];
  const y = (i: number) => lerp(pos0[i], pos1[i], swap) * RH;
  const rankNow = (i: number) => (swap < 0.5 ? pos0[i] : pos1[i]) + 1;
  const roiNow = (t: T) => lerp(t.roi0, t.roi1, io((f - 50) / 50));
  const climb = Math.sin(Math.PI * swap); // hero row bulges while overtaking
  // board (card) transform: flies up from below with tilt, then recedes while the hero row lifts
  const rx = lerp(42, 8, enter) + 6 * lift, ry = lerp(-18, -6, enter) - 4 * lift, ty = lerp(900, 0, enter) + 40 * lift;
  const boardScale = lerp(1, 0.86, lift);
  const hero = TR[HERO];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 85% at 50% 58%, #FFFFFF 0%, #F3FBEA 45%, #DDF4C2 80%, #C8EDA0 100%)', overflow: 'hidden', fontFamily: SANS, color: INK}}>
      <Rings cx={960} cy={600} color="rgba(126,194,90,0.35)" base={360} t={f / 300} />
      <Img src={staticFile('brand/symbol-official-white.png')} style={{position: 'absolute', width: 1300, height: 1300, right: -380, top: -260, filter: 'brightness(0)', opacity: 0.035, transform: `rotate(${-8 + f * 0.01}deg)`}} />
      <div style={{position: 'absolute', inset: 0, perspective: 2200, perspectiveOrigin: '50% 40%'}}>
        {/* the board */}
        <div style={{position: 'absolute', left: 960 - CW / 2, top: 170 + ty, width: CW, transform: `rotateX(${rx}deg) rotateY(${ry}deg) scale(${boardScale})`, transformOrigin: '50% 30%',
          filter: `blur(${lift * 8}px)`, opacity: 1 - 0.5 * lift}}>
          <div style={{borderRadius: 40, background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 60px 120px rgba(40,70,20,0.18), 0 8px 24px rgba(40,70,20,0.08)', padding: '30px 0 24px', backdropFilter: 'blur(20px)'}}>
            <div style={{display: 'flex', alignItems: 'center', padding: '0 34px 22px', borderBottom: `1px solid ${LINE}`}}>
              <Img src={staticFile('brand/logo-official-black.png')} style={{height: 26, width: (26 * 2003) / 328}} />
              <div style={{width: 1.5, height: 30, background: LINE, margin: '0 22px'}} />
              <div style={{fontSize: 34, fontWeight: 600, letterSpacing: -1}}>Top copy traders</div>
              <div style={{marginLeft: 'auto', display: 'flex', gap: 8, fontSize: 18, fontWeight: 600}}>
                {['30D ROI', 'PnL', 'Copiers'].map((x, i) => <div key={x} style={{padding: '10px 18px', borderRadius: 100, background: i === 0 ? INK : 'transparent', color: i === 0 ? WHITE : MUTE}}>{x}</div>)}
              </div>
            </div>
            <div style={{position: 'relative', height: RH * TR.length, marginTop: 10}}>
              {TR.map((t, i) => {
                const k = out((f - 6 - i * 4) / 28);
                const isHero = i === HERO;
                const hide = isHero ? lift > 0.02 : false;
                return (
                  <div key={t.name} style={{position: 'absolute', left: 14, right: 14, top: y(i), height: RH - 8, borderRadius: 26, opacity: hide ? 0 : k, zIndex: isHero ? 2 : 1,
                    transform: `translateY(${(1 - k) * 40}px) scale(${isHero ? 1 + 0.035 * climb : 1})`,
                    background: isHero && swap > 0 ? `rgb(${Math.round(lerp(243, 184, climb))},${Math.round(lerp(252, 242, climb))},${Math.round(lerp(234, 106, climb))})` : rankNow(i) === 1 ? 'rgba(184,242,106,0.16)' : 'transparent',
                    boxShadow: isHero ? `0 ${24 * climb}px ${50 * climb}px rgba(40,70,20,${0.22 * climb})` : 'none'}}>
                    <RowBody t={t} rank={rankNow(i)} roi={roiNow(t)} k={k} f={f} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* hero row lifted out, toward camera */}
        {lift > 0.02 && (() => {
          const s = lerp(boardScale, 1.55, lift);
          const top = lerp(170 + ty + 30 + 22 + 50 + 10, 560, lift);
          return (
            <div style={{position: 'absolute', left: 960 - (CW - 28) / 2, top, width: CW - 28, height: RH - 8, transform: `rotateX(${lerp(rx, 0, lift)}deg) rotateY(${lerp(ry, 0, lift)}deg) scale(${s})`, transformOrigin: '50% 50%',
              borderRadius: 26, background: '#FFFFFF', boxShadow: `0 ${50 * lift}px ${100 * lift}px rgba(30,60,10,0.28), 0 0 0 ${2 * lift}px ${LIME}`}}>
              <RowBody t={hero} rank={1} roi={roiNow(hero)} k={1} f={f} press={press} done={done} copiers={hero.copiers + (done ? 1 : 0)} />
              {done && (
                <div style={{position: 'absolute', right: 30, top: -46, transform: `scale(${pop})`, transformOrigin: '80% 100%', background: INK, color: WHITE, borderRadius: 14, padding: '8px 14px', fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap'}}>
                  <span style={{color: LIME}}>●</span> Mirroring mintgrid's trades
                </div>
              )}
            </div>
          );
        })()}
      </div>
      <Word f={f} at={150} until={292} text="copy the best." color={INK} size={150} x={960} y={300} />
      <Sparkle x={150} y={470} s={64} f={f} at={204} color={LIME} />
      <Sparkle x={215} y={420} s={26} f={f} at={210} color={INK} />
      <div style={{position: 'absolute', left: 60, bottom: 40, fontFamily: MONO, fontSize: 15, color: MUTE, opacity: 0.8}}>Illustrative traders and figures. Past performance does not guarantee future results.</div>
      <Grain o={0.05} />
    </AbsoluteFill>
  );
};

export const LeaderboardShot: React.FC = () => {
  useFonts();
  return <CameraMotionBlur samples={7} shutterAngle={200}><Scene /></CameraMotionBlur>;
};
