// Hotcoin 9th Anniversary Relay · Round 1 short: coverflow of glowing mesh cards.
// Count 1..8 whips past and clicks onto 9, then newcomer tasks, lucky draw, total pool, search-bar finale.
// Facts: event brief (Nov 6-16, 2026 UTC+8; 5 / 9 / +9 USDT, max 18; lucky 9 x 99 USDT; pool 19,999 USDT). Hotcoin operating since 2017.
// Music: scripts/make-anniv9-beat.py -> public/anniv9/beat.wav (timeline mirrored there).
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, LIME, MONO, SANS, useFonts} from '../promo4/kit';

type Lang = 'en' | 'zh';
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ip = (f: number, a: number[], b: number[]) => interpolate(f, a, b, cl);
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// timeline (frames @30fps)
export const TL = {count: 66, nine: 114, m1: 132, h1: 204, m2: 222, h2: 276, m3: 294, h3: 348, end: 468};
export const ANNIV9_DURATION = TL.end;
const posAt = (f: number) => {
  if (f < TL.count) return 8 * (1 - Math.pow(1 - f / TL.count, 4));
  if (f < TL.nine) return 8;
  const seg = (a: number, b: number, from: number) => from + ease(ip(f, [a, b], [0, 1]));
  if (f < TL.h1) return seg(TL.nine, TL.m1, 8);
  if (f < TL.h2) return seg(TL.h1, TL.m2, 9);
  return seg(TL.h2, TL.m3, 10);
};

const PAL: [string, string, string][] = [
  ['#7AA2FF', '#9945FF', '#1E2A6B'], ['#14F195', '#3DDBB0', '#0B3B3A'], ['#F4B728', '#FF7A30', '#5A2A00'], ['#FF5C8A', '#9945FF', '#3A0F3A'],
  ['#5B8CFF', '#7DD3FC', '#0E1F5B'], ['#F5E663', '#B8F26A', '#2B4A14'], ['#FF8A5B', '#F4B728', '#4A1C00'], ['#9AA8FF', '#14F195', '#1E2A44'],
  ['#B8F26A', '#2DBD85', '#F5E663'], // 9 (brand)
  ['#B8F26A', '#7EC25A', '#0E1A0A'], ['#F4B728', '#B8F26A', '#3A2A00'], ['#7DD3FC', '#B8F26A', '#0E2A3A'],
];
const C = {
  en: {year: 'YEAR', nineT: 'Hotcoin turns 9', nineS: '2017 → 2026', newT: 'Newcomer Kickoff', newS: 'RELAY · ROUND 1', easy: 'EASY AS 1-2-3',
    tasks: [['Register', '5 USDT'], ['+ KYC', '9 USDT'], ['First trade ≥ 99 USDT', '+9 USDT']], upto: 'Up to 18 USDT',
    luckyT: 'Lucky Bonus', luckyS: 'RANDOM DRAW', lucky: '99', luckyU: 'USDT × 9 winners', luckyF: 'Just register via the link',
    poolT: 'Total prize pool', poolS: 'NOV 6 – NOV 16 · UTC+8', pool: '19,999', poolU: 'USDT', poolF: 'First come, first served',
    finT: ['Join the', 'relay'], fine: 'Futures trading is high risk · Not financial advice', ph: 'Search or type a URL'},
  zh: {year: '第', nineT: 'Hotcoin 9 周年', nineS: '2017 → 2026', newT: '新人起跑礼', newS: '接力赛 · 第一棒', easy: '简单三步',
    tasks: [['注册', '5 USDT'], ['+ KYC', '9 USDT'], ['首笔合约 ≥ 99 USDT', '+9 USDT']], upto: '最高 18 USDT',
    luckyT: '9周年幸运加码', luckyS: '随机抽奖', lucky: '99', luckyU: 'USDT × 9 位', luckyF: '指定链接注册即可参与',
    poolT: '总奖池', poolS: '11/6 — 11/16 · UTC+8', pool: '19,999', poolU: 'USDT', poolF: '发完即止',
    finT: ['加入', '接力赛'], fine: '合约交易风险较高 · 不构成投资建议', ph: '搜索或输入网址'},
};
const LINK = {en: 'hotcoin.com/r/Hccommunity', zh: 'hotcoinv5.com/r/Hccommunity'};

const Mesh: React.FC<{c: [string, string, string]; f: number; seed: number}> = ({c, f, seed}) => {
  const a = (k: number) => Math.sin(f / 40 + seed + k) * 12;
  return (
    <AbsoluteFill style={{background: c[2], overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: '120%', height: '90%', left: `${-20 + a(1)}%`, top: `${-25 + a(2)}%`, background: c[0], borderRadius: '50%', filter: 'blur(70px)'}} />
      <div style={{position: 'absolute', width: '100%', height: '80%', left: `${30 + a(3)}%`, top: `${40 + a(4)}%`, background: c[1], borderRadius: '50%', filter: 'blur(80px)', opacity: 0.9}} />
      <div style={{position: 'absolute', width: '70%', height: '60%', left: `${-10 + a(5)}%`, top: `${55 + a(6)}%`, background: '#fff', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.3}} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,.14) 1px, transparent 1.3px)', backgroundSize: '14px 14px', mixBlendMode: 'overlay'}} />
    </AbsoluteFill>
  );
};
const Orbit: React.FC<{f: number; size: number; o?: number}> = ({f, size, o = 0.55}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{position: 'absolute', left: '50%', top: '50%', marginLeft: -size / 2, marginTop: -size / 2, overflow: 'visible'}}>
    {Array.from({length: 14}, (_, i) => (
      <ellipse key={i} rx={92} ry={92 * Math.abs(Math.cos((i / 14) * Math.PI + f / 80))} fill="none" stroke={`rgba(255,255,255,${o})`} strokeWidth={0.9} strokeDasharray="0.5 3.2" strokeLinecap="round" transform={`rotate(${i * 13 + f * 0.5})`} />
    ))}
    <circle r={62} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth={1.4} />
  </svg>
);

const W = 640, H = 820;
const Frame: React.FC<{i: number; f: number; children: React.ReactNode}> = ({i, f, children}) => (
  <div style={{position: 'relative', width: W, height: H, borderRadius: 44, overflow: 'hidden', boxShadow: '0 40px 90px rgba(20,24,40,.25)', fontFamily: SANS, color: '#fff'}}>
    <Mesh c={PAL[i]} f={f} seed={i * 1.7} />{children}
  </div>
);
const Tag: React.FC<{children: React.ReactNode; dark?: boolean}> = ({children, dark}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, background: dark ? INK : LIME, color: dark ? LIME : INK, fontFamily: MONO, fontWeight: 700, fontSize: 21, letterSpacing: 2, padding: '7px 14px', borderRadius: 10}}>{children}</div>
);

const Card: React.FC<{i: number; f: number; lang: Lang; land: number}> = ({i, f, lang, land}) => {
  const c = C[lang];
  if (i < 8) {
    return (
      <Frame i={i} f={f}>
        <div style={{position: 'absolute', left: 46, top: 42, fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: 'rgba(255,255,255,.85)'}}>{lang === 'zh' ? `${c.year} ${i + 1} 年` : `${c.year} 0${i + 1}`}</div>
        <Orbit f={f + i * 20} size={460} o={0.4} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 380, letterSpacing: -20, lineHeight: 1, textShadow: '0 10px 50px rgba(0,0,0,.25)'}}>{i + 1}</div>
        <div style={{position: 'absolute', left: 46, bottom: 42, fontFamily: MONO, fontSize: 22, color: 'rgba(255,255,255,.75)'}}>{2017 + i + 1}</div>
      </Frame>
    );
  }
  if (i === 8) {
    const s = land;
    return (
      <Frame i={i} f={f}>
        <Orbit f={f} size={520} o={0.5} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 470, letterSpacing: -20, lineHeight: 1, color: INK, transform: `scale(${1 + (1 - s) * 0.12})`}}>9</div>
        <div style={{position: 'absolute', left: 46, top: 42, opacity: s, transform: `translateY(${(1 - s) * -20}px)`}}><Tag dark>{lang === 'zh' ? '9 周年' : '9 YEARS'}</Tag></div>
        <div style={{position: 'absolute', left: 46, right: 46, bottom: 42, opacity: s, transform: `translateY(${(1 - s) * 30}px)`}}>
          <div style={{fontWeight: 800, fontSize: 52, letterSpacing: lang === 'zh' ? 2 : -1.5, color: INK}}>{c.nineT}</div>
          <div style={{fontFamily: MONO, fontSize: 24, color: 'rgba(11,14,17,.7)', marginTop: 6}}>{c.nineS}</div>
        </div>
      </Frame>
    );
  }
  if (i === 9) {
    return (
      <Frame i={i} f={f}>
        <div style={{position: 'absolute', left: 46, top: 42, right: 46}}>
          <Tag>{c.easy}</Tag>
          <div style={{fontWeight: 800, fontSize: 58, letterSpacing: lang === 'zh' ? 3 : -2, lineHeight: 1.02, marginTop: 18}}>{c.newT}</div>
          <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: 'rgba(255,255,255,.7)', marginTop: 8}}>{c.newS}</div>
        </div>
        <div style={{position: 'absolute', left: 30, right: 30, top: 270, display: 'flex', flexDirection: 'column', gap: 14}}>
          {c.tasks.map(([a, v], k) => (
            <div key={k} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px', borderRadius: 22, background: 'rgba(255,255,255,.16)', border: '1.5px solid rgba(255,255,255,.4)', backdropFilter: 'blur(12px)'}}>
              <div style={{width: 52, height: 52, borderRadius: 16, background: LIME, color: INK, fontFamily: MONO, fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{k + 1}</div>
              <div style={{flex: 1, fontWeight: 700, fontSize: 30}}>{a}</div>
              <div style={{fontWeight: 800, fontSize: 34, letterSpacing: -1}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 46, bottom: 42, fontWeight: 800, fontSize: 64, letterSpacing: lang === 'zh' ? 2 : -2.5, color: LIME, textShadow: '0 4px 30px rgba(0,0,0,.3)'}}>{c.upto}</div>
      </Frame>
    );
  }
  const big = i === 10 ? c.lucky : c.pool, unit = i === 10 ? c.luckyU : c.poolU;
  return (
    <Frame i={i} f={f}>
      <div style={{position: 'absolute', left: 46, top: 42, right: 46}}>
        <Tag dark>{i === 10 ? c.luckyS : c.poolS}</Tag>
        <div style={{fontWeight: 800, fontSize: 58, letterSpacing: lang === 'zh' ? 3 : -2, marginTop: 18}}>{i === 10 ? c.luckyT : c.poolT}</div>
      </div>
      {i === 10 && <Orbit f={f} size={420} o={0.5} />}
      <div style={{position: 'absolute', left: 0, right: 0, top: i === 10 ? 300 : 330, textAlign: 'center', fontWeight: 800, fontSize: i === 10 ? 250 : 168, letterSpacing: i === 10 ? -12 : -8, lineHeight: 1, textShadow: '0 10px 50px rgba(0,0,0,.25)'}}>{big}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: i === 10 ? 560 : 520, textAlign: 'center', fontWeight: 700, fontSize: 40}}>{unit}</div>
      <div style={{position: 'absolute', left: 30, right: 30, bottom: 30, padding: '20px 24px', borderRadius: 24, background: 'rgba(255,255,255,.18)', border: '1.5px solid rgba(255,255,255,.45)', fontWeight: 700, fontSize: 30, backdropFilter: 'blur(12px)'}}>{i === 10 ? c.luckyF : c.poolF}</div>
    </Frame>
  );
};

const Finale: React.FC<{e: number; lang: Lang}> = ({e, lang}) => {
  const c = C[lang], site = LINK[lang];
  const inn = ip(e, [6, 24], [0, 1]);
  const typed = Math.max(0, Math.min(site.length, Math.floor((e - 26) / 1.6)));
  const tEnd = 26 + site.length * 1.6, press = e >= tEnd + 6 && e < tEnd + 12 ? 0.92 : 1, done = e >= tEnd + 12;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: inn, transform: `translateY(${(1 - inn) * 60}px)`}}>
      <div style={{position: 'absolute', width: 900, height: 460, borderRadius: '50%', background: 'conic-gradient(from 0deg, #B8F26A, #3DDBB0, #F5E663, #7EC25A, #B8F26A)', filter: 'blur(90px)', opacity: 0.5, transform: `rotate(${e * 3}deg)`}} />
      <div style={{position: 'relative', fontFamily: SANS, fontWeight: 800, fontSize: 88, letterSpacing: lang === 'zh' ? 4 : -3.5, color: INK, textAlign: 'center', lineHeight: 1, marginBottom: 54}}>
        {c.finT[0]} <span style={{background: LIME, padding: '0 14px', borderRadius: 14}}>{c.finT[1]}</span></div>
      <div style={{position: 'relative', width: 940, height: 124, borderRadius: 999, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px 0 40px', gap: 22,
        boxShadow: `0 0 0 ${done ? 6 : 3}px ${done ? LIME : 'rgba(11,14,17,.08)'}, 0 30px 80px rgba(20,24,40,.18)`}}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
        <div style={{flex: 1, fontFamily: SANS, fontWeight: 600, fontSize: 44, letterSpacing: -0.8, color: INK, whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {typed === 0 ? <span style={{color: 'rgba(11,14,17,.35)'}}>{c.ph}</span> : site.slice(0, typed)}
          {!done && typed > 0 && Math.floor(e / 8) % 2 === 0 && <span style={{display: 'inline-block', width: 4, height: 46, marginLeft: 4, verticalAlign: -6, background: INK}} />}
        </div>
        <div style={{width: 100, height: 100, borderRadius: 999, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${press})`}}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={LIME} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </div>
      </div>
      <div style={{position: 'relative', marginTop: 40, fontFamily: MONO, fontSize: 22, letterSpacing: 1.5, color: 'rgba(11,14,17,.55)'}}>{c.fine}</div>
    </AbsoluteFill>
  );
};

export const Anniv9Flow: React.FC<{lang: Lang}> = ({lang}) => {
  const f = useCurrentFrame();
  const {width: VW, height: VH} = useVideoConfig();
  useFonts();
  const p = posAt(f);
  const land = ip(f, [TL.count - 4, TL.count + 14], [0, 1]);
  const e = f - TL.h3, out = ip(e, [0, 22], [0, 1]);
  const N = 12, cards = Array.from({length: N}, (_, i) => ({i, d: i - p})).sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
  const flash = f >= TL.count - 2 ? ip(f, [TL.count - 2, TL.count + 10], [0.6, 0]) : 0;
  const sc = Math.min(VW / 1080, VH / 1350) * (VH / VW > 1.5 ? 1.12 : 1);
  return (
    <AbsoluteFill style={{background: '#F1F2F4', overflow: 'hidden', perspective: 1600}}>
      {cards.map(({i, d}) => Math.abs(d) < 0.15 || Math.abs(d) > 2.2 ? null : (
        <div key={'g' + i} style={{position: 'absolute', left: '50%', top: '50%', width: 600, height: 1000, marginLeft: -300 + Math.sign(d) * (400 + Math.abs(d) * 170) * sc, marginTop: -500,
          background: `linear-gradient(${d > 0 ? 90 : 270}deg, ${PAL[i][0]}, ${PAL[i][1]} 55%, rgba(241,242,244,0))`, filter: 'blur(50px)',
          opacity: (1 - out) * 0.9 * Math.min(1, Math.abs(d)) * (1 - Math.max(0, Math.abs(d) - 1.2)), transform: `scaleX(${1 + Math.abs(d) * 0.6})`, borderRadius: '40%'}} />
      ))}
      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `translateY(${-out * 260}px) scale(${1 - out * 0.35})`, opacity: 1 - out, filter: `blur(${out * 12}px)`}}>
        {cards.map(({i, d}) => {
          const ad = Math.abs(d);
          if (ad > 2.6) return null;
          const x = Math.sign(d) * (Math.min(ad, 1) * 470 + Math.max(0, ad - 1) * 230) * sc;
          const z = -ad * 260, ry = -Math.sign(d) * Math.min(ad, 1.4) * 38, s = (1.08 - Math.min(ad, 2) * 0.07) * sc;
          return (
            <div key={i} style={{position: 'absolute', left: VW / 2 - W / 2, top: VH / 2 - H / 2, transform: `translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${s})`, opacity: ip(ad, [0, 2, 2.6], [1, 0.9, 0])}}>
              <Card i={i} f={f} lang={lang} land={land} />
            </div>
          );
        })}
      </AbsoluteFill>
      {flash > 0 && <AbsoluteFill style={{background: LIME, opacity: flash, mixBlendMode: 'multiply'}} />}
      <Img src={staticFile('brand/logo-official-black.png')} style={{position: 'absolute', left: 60, top: 56, height: 38}} />
      <div style={{position: 'absolute', right: 60, top: 54, fontFamily: MONO, fontSize: 20, letterSpacing: 3, border: `1.5px solid ${INK}`, borderRadius: 99, padding: '9px 18px', color: INK, opacity: 1 - out}}>
        {lang === 'zh' ? '9 周年 · 第一棒' : '9TH ANNIVERSARY · RELAY 01'}</div>
      {e > 0 && <Finale e={e} lang={lang} />}
      <Audio src={staticFile('anniv9/beat.wav')} />
    </AbsoluteFill>
  );
};
