// Hotcoin 9th Anniversary Relay · Round 1 short, v2: brand palette only (ink, lime, green, white, glass).
// Opens on a hero 9 that draws, fills and glows; the camera flies through it into a depth stack of cards
// (newcomer tasks, 99 USDT lucky draw, 19,999 USDT pool), each built around a 9; ends on a dark search-bar finale.
// Facts: event brief (Nov 6-16, 2026 UTC+8). Music: scripts/make-anniv9-stack-beat.py -> public/anniv9/stack.wav.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, LIME, MONO, SANS, useFonts} from '../promo4/kit';

type Lang = 'en' | 'zh';
const GREEN = '#7EC25A', DEEP = '#16240C', WHITE = '#F2F3EF';
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ip = (f: number, a: number[], b: number[]) => interpolate(f, a, b, cl);
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const ST = {draw: 30, fill: 44, fly: 72, c0: 92, t1: 172, c1: 190, t2: 246, c2: 264, fin: 320, end: 440};
export const ANNIV9S_DURATION = ST.end;
const posAt = (f: number) => (f < ST.t1 ? 0 : f < ST.t2 ? ease(ip(f, [ST.t1, ST.c1], [0, 1])) : 1 + ease(ip(f, [ST.t2, ST.c2], [0, 1])));

const C = {
  en: {turns: 'Hotcoin turns 9', since: 'SINCE 2017', relay: 'RELAY · ROUND 01', newT: 'Newcomer Kickoff', tasks: [['Register', '5 USDT'], ['+ KYC', '9 USDT'], ['First trade ≥ 99 USDT', '+9 USDT']], upto: 'Up to 18 USDT',
    luckyS: 'LUCKY BONUS', luckyU: 'USDT × 9 winners', luckyF: 'Random draw. Just register via the link.', poolS: 'TOTAL PRIZE POOL', poolU: 'USDT', poolF: 'Nov 6 – Nov 16 · 23:59 UTC+8',
    fin: ['Join the', 'relay'], ph: 'Search or type a URL', fine: 'Futures trading is high risk · Not financial advice'},
  zh: {turns: 'Hotcoin 9 周年', since: 'SINCE 2017', relay: '接力赛 · 第一棒', newT: '新人起跑礼', tasks: [['注册', '5 USDT'], ['+ KYC', '9 USDT'], ['首笔合约 ≥ 99 USDT', '+9 USDT']], upto: '最高 18 USDT',
    luckyS: '9周年幸运加码', luckyU: 'USDT × 9 位幸运用户', luckyF: '随机抽取，指定链接注册即可参与', poolS: '总奖池', poolU: 'USDT', poolF: '11/6 — 11/16 23:59 UTC+8',
    fin: ['加入', '接力赛'], ph: '搜索或输入网址', fine: '合约交易风险较高 · 不构成投资建议'},
};
const LINK = {en: 'hotcoin.com/r/Hccommunity', zh: 'hotcoinv5.com/r/Hccommunity'};
const GRAD = `linear-gradient(160deg, #F4FFE0 0%, ${LIME} 30%, ${GREEN} 70%, #3E6B1A 100%)`;

const Glow: React.FC<{f: number; seed: number; k?: number}> = ({f, seed, k = 1}) => {
  const a = (k: number) => Math.sin(f / 45 + seed + k) * 10;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: '110%', height: '70%', left: `${-30 + a(1)}%`, top: `${-30 + a(2)}%`, background: LIME, borderRadius: '50%', filter: 'blur(110px)', opacity: 0.35 * k}} />
      <div style={{position: 'absolute', width: '90%', height: '70%', left: `${40 + a(3)}%`, top: `${55 + a(4)}%`, background: GREEN, borderRadius: '50%', filter: 'blur(120px)', opacity: 0.45 * k}} />
    </AbsoluteFill>
  );
};
const Grain: React.FC<{o?: number}> = ({o = 0.5}) => (
  <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,.07) 1px, transparent 1.3px)', backgroundSize: '5px 5px', opacity: o}} />
);
const Tag: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{display: 'inline-block', background: LIME, color: INK, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 2.5, padding: '8px 14px', borderRadius: 10}}>{children}</div>
);
const gradText = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1, background: GRAD, WebkitBackgroundClip: 'text', color: 'transparent', ...extra});

const CW = 700, CH = 940;
const Shell: React.FC<{f: number; seed: number; children: React.ReactNode}> = ({f, seed, children}) => (
  <div style={{position: 'relative', width: CW, height: CH, borderRadius: 48, overflow: 'hidden', background: `linear-gradient(170deg, #121812, ${INK} 60%)`, border: '1.5px solid rgba(184,242,106,.25)',
    boxShadow: '0 50px 120px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.08)', fontFamily: SANS, color: WHITE}}>
    <Glow f={f} seed={seed} /><Grain o={0.35} />{children}
  </div>
);

const CardNew: React.FC<{f: number; lang: Lang}> = ({f, lang}) => {
  const c = C[lang];
  return (
    <Shell f={f} seed={1}>
      {/* giant cropped 9, embedded behind the glass rows */}
      <div style={{position: 'absolute', right: -110, top: -40, ...gradText(900, {letterSpacing: -44, opacity: 0.5})}}>9</div>
      <div style={{position: 'absolute', left: 50, top: 50, right: 50}}>
        <Tag>{c.relay}</Tag>
        <div style={{fontWeight: 800, fontSize: 70, letterSpacing: lang === 'zh' ? 3 : -2.5, lineHeight: 1, marginTop: 22}}>{c.newT}</div>
      </div>
      <div style={{position: 'absolute', left: 36, right: 36, top: 300, display: 'flex', flexDirection: 'column', gap: 14}}>
        {c.tasks.map(([a, v], k) => (
          <div key={k} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '20px 24px', borderRadius: 24, background: 'rgba(11,14,17,.45)', border: '1.5px solid rgba(255,255,255,.18)', backdropFilter: 'blur(18px)'}}>
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: LIME, width: 40}}>0{k + 1}</div>
            <div style={{flex: 1, fontWeight: 700, fontSize: 31}}>{a}</div>
            <div style={{fontWeight: 800, fontSize: 36, letterSpacing: -1}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 50, bottom: 50, fontWeight: 800, fontSize: 66, letterSpacing: lang === 'zh' ? 2 : -2.5, color: WHITE}}>
        {c.upto.split('18')[0]}<span style={{color: LIME}}>18</span>{c.upto.split('18')[1]}</div>
    </Shell>
  );
};
const CardBig: React.FC<{f: number; lang: Lang; kind: 'lucky' | 'pool'}> = ({f, lang, kind}) => {
  const c = C[lang], lucky = kind === 'lucky';
  return (
    <Shell f={f} seed={lucky ? 3 : 5}>
      <div style={{position: 'absolute', left: 50, top: 50}}><Tag>{lucky ? c.luckyS : c.poolS}</Tag></div>
      <div style={{position: 'absolute', left: lucky ? 30 : 40, right: 0, top: lucky ? 170 : 300, ...gradText(lucky ? 560 : 236, {letterSpacing: lucky ? -36 : -12})}}>{lucky ? '99' : '19,999'}</div>
      <div style={{position: 'absolute', left: 50, right: 50, top: lucky ? 690 : 560, fontWeight: 700, fontSize: 44, letterSpacing: -0.5}}>{lucky ? c.luckyU : c.poolU}</div>
      <div style={{position: 'absolute', left: 36, right: 36, bottom: 36, padding: '22px 26px', borderRadius: 24, background: 'rgba(11,14,17,.45)', border: '1.5px solid rgba(255,255,255,.18)', backdropFilter: 'blur(18px)', fontWeight: 600, fontSize: 28, lineHeight: 1.3}}>{lucky ? c.luckyF : c.poolF}</div>
    </Shell>
  );
};

const Hero9: React.FC<{f: number; lang: Lang; VW: number; VH: number}> = ({f, lang, VW, VH}) => {
  const draw = ip(f, [0, ST.draw], [0, 1]), fill = ip(f, [ST.draw - 6, ST.fill], [0, 1]);
  const fly = ip(f, [ST.fly, ST.c0], [0, 1]), fe = fly * fly;
  const txt = ip(f, [ST.fill - 4, ST.fill + 14], [0, 1]);
  const c = C[lang];
  return (
    <AbsoluteFill style={{transformStyle: 'preserve-3d'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: VW, height: VH, transform: `translateZ(${fe * 1300}px)`, opacity: 1 - ip(fly, [0.55, 1], [0, 1])}}>
        <svg width={VW} height={VH} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs><linearGradient id="g9" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stopColor="#F4FFE0" /><stop offset=".3" stopColor={LIME} /><stop offset=".7" stopColor={GREEN} /><stop offset="1" stopColor="#3E6B1A" /></linearGradient>
            <filter id="gl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="40" /></filter></defs>
          <text x={VW / 2} y={VH * 0.62} textAnchor="middle" fontFamily="Inter Tight" fontWeight={800} fontSize={VH * 0.62} fill={LIME} opacity={fill * 0.55} filter="url(#gl)">9</text>
          <text x={VW / 2} y={VH * 0.62} textAnchor="middle" fontFamily="Inter Tight" fontWeight={800} fontSize={VH * 0.62} fill="url(#g9)" fillOpacity={fill}
            stroke={LIME} strokeWidth={3} strokeDasharray={5200} strokeDashoffset={5200 * (1 - draw)} strokeOpacity={1 - fill * 0.6}>9</text>
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: VH * 0.69, textAlign: 'center', opacity: txt, transform: `translateY(${(1 - txt) * 30}px)`}}>
          <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: LIME}}>{c.since}</div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 92, letterSpacing: lang === 'zh' ? 4 : -3.5, color: WHITE, marginTop: 12}}>{c.turns}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Finale: React.FC<{e: number; lang: Lang}> = ({e, lang}) => {
  const c = C[lang], site = LINK[lang];
  const inn = ip(e, [6, 24], [0, 1]);
  const typed = Math.max(0, Math.min(site.length, Math.floor((e - 26) / 1.6)));
  const tEnd = 26 + site.length * 1.6, press = e >= tEnd + 6 && e < tEnd + 12 ? 0.92 : 1, done = e >= tEnd + 12;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: inn, transform: `translateY(${(1 - inn) * 60}px)`}}>
      <div style={{position: 'absolute', width: 900, height: 460, borderRadius: '50%', background: `radial-gradient(ellipse, ${LIME}, ${GREEN} 45%, rgba(0,0,0,0) 72%)`, filter: 'blur(70px)', opacity: 0.35 + Math.sin(e / 10) * 0.05}} />
      <div style={{position: 'relative', fontFamily: SANS, fontWeight: 800, fontSize: 92, letterSpacing: lang === 'zh' ? 4 : -3.5, color: WHITE, textAlign: 'center', lineHeight: 1, marginBottom: 56}}>
        {c.fin[0]} <span style={{background: LIME, color: INK, padding: '0 16px', borderRadius: 16}}>{c.fin[1]}</span></div>
      <div style={{position: 'relative', width: 940, height: 124, borderRadius: 999, background: WHITE, display: 'flex', alignItems: 'center', padding: '0 12px 0 40px', gap: 22,
        boxShadow: `0 0 0 ${done ? 6 : 2}px ${done ? LIME : 'rgba(255,255,255,.2)'}, 0 30px 90px rgba(0,0,0,.6), 0 0 ${done ? 80 : 0}px rgba(184,242,106,.5)`}}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
        <div style={{flex: 1, fontFamily: SANS, fontWeight: 600, fontSize: 44, letterSpacing: -0.8, color: INK, whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {typed === 0 ? <span style={{color: 'rgba(11,14,17,.35)'}}>{c.ph}</span> : site.slice(0, typed)}
          {!done && typed > 0 && Math.floor(e / 8) % 2 === 0 && <span style={{display: 'inline-block', width: 4, height: 46, marginLeft: 4, verticalAlign: -6, background: INK}} />}
        </div>
        <div style={{width: 100, height: 100, borderRadius: 999, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${press})`}}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={LIME} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </div>
      </div>
      <div style={{position: 'relative', marginTop: 40, fontFamily: MONO, fontSize: 22, letterSpacing: 1.5, color: 'rgba(242,243,239,.5)'}}>{c.fine}</div>
    </AbsoluteFill>
  );
};

export const Anniv9Stack: React.FC<{lang: Lang}> = ({lang}) => {
  const f = useCurrentFrame();
  const {width: VW, height: VH} = useVideoConfig();
  useFonts();
  const sc = VH / VW > 1.5 ? 1.3 : 1.12;
  const p = posAt(f);
  const show = ip(f, [ST.fly + 6, ST.c0], [0, 1]);
  const e = f - ST.fin, out = ip(e, [0, 20], [0, 1]);
  const cards = [0, 1, 2].map((k) => ({k, d: k - p})).sort((a, b) => b.d - a.d);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden', perspective: 1400}}>
      <Glow f={f} seed={0} k={0.45} />
      <Grain />
      {f < ST.c0 + 4 && <Hero9 f={f} lang={lang} VW={VW} VH={VH} />}
      <AbsoluteFill style={{transformStyle: 'preserve-3d', opacity: show * (1 - out)}}>
        {cards.map(({k, d}) => {
          if (d < -1.2 || d > 2.4) return null;
          const z = d >= 0 ? -d * 520 : -d * 1500, y = d >= 0 ? -d * 70 : d * -60;
          const o = d >= 0 ? ip(d, [0, 2.2], [1, 0.25]) : ip(d, [-1, -0.45], [0, 1]);
          const intro = k === 0 ? (1 - show) * -900 : 0;
          return (
            <div key={k} style={{position: 'absolute', left: VW / 2 - CW / 2, top: VH / 2 - CH / 2 + 40 * sc, opacity: o, filter: `blur(${d < 0 ? -d * 10 : Math.max(0, d - 0.6) * 3}px)`,
              transform: `translateY(${y * sc}px) translateZ(${(z + intro) }px) rotateX(${d > 0 ? 4 : 0}deg) scale(${sc})`}}>
              {k === 0 ? <CardNew f={f} lang={lang} /> : <CardBig f={f} lang={lang} kind={k === 1 ? 'lucky' : 'pool'} />}
            </div>
          );
        })}
      </AbsoluteFill>
      <Img src={staticFile('brand/logo-official-white.png')} style={{position: 'absolute', left: 60, top: 60, height: 38}} />
      <div style={{position: 'absolute', right: 60, top: 58, fontFamily: MONO, fontSize: 20, letterSpacing: 3, border: '1.5px solid rgba(184,242,106,.6)', color: LIME, borderRadius: 99, padding: '9px 18px'}}>
        {lang === 'zh' ? '9 周年 · 第一棒' : '9TH ANNIVERSARY'}</div>
      {e > 0 && <Finale e={e} lang={lang} />}
      <Audio src={staticFile('anniv9/stack.wav')} />
    </AbsoluteFill>
  );
};
