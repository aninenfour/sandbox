// "Top 24 on CoinMarketCap" celebration short. 9:16 and 4:5, English and Chinese (prop `lang`). 30 fps, 450 frames.
// Facts: CoinMarketCap derivatives exchange ranking (screenshot Nov 4, 2026: Hotcoin #24). Stats from CMC
// data-api exchange/listing?exType=2 on Nov 4, 2026 12:09 UTC: open interest $1.076B, 24h derivatives volume $8.045B,
// 575 derivatives pairs. No other exchange names or logos are shown: the ladder rows are anonymous placeholders.
// Music: original, scripts/make-rank-beat.py -> public/rank/beat.wav. Chinese font: Noto Sans SC (Google Fonts, OFL).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, LIME, MONO} from '../promo4/kit';

export const RANK_DURATION = 450;
const FPS = 30, RANK = 24, FROM = 100;
const T = {climb: 60, lock: 180, stats: 210, tag: 330, cta: 390};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ip = (f: number, a: number[], b: number[]) => interpolate(f, a, b, cl);
const sp = (f: number, d = 14, s = 170) => spring({frame: f, fps: FPS, config: {damping: d, stiffness: s}});

type Lang = 'en' | 'zh';
const COPY = {
  en: {
    intro: ['NEW RANK', 'UNLOCKED'], board: 'COINMARKETCAP · DERIVATIVES EXCHANGES', locked: 'Top 24 derivatives exchange',
    lockedSub: 'on CoinMarketCap', stats: [['Open interest', 1.08, '$', 'B', 2], ['24h futures volume', 8.0, '$', 'B', 1], ['Futures pairs', 575, '', '', 0]] as const,
    tag: ['And we\'re just', 'getting started.'], cta: 'Trade futures on Hotcoin', badge: '#24 ON COINMARKETCAP',
  },
  zh: {
    intro: ['新排名', '解锁'], board: 'COINMARKETCAP · 衍生品交易所排名', locked: '衍生品交易所第 24 名',
    lockedSub: 'CoinMarketCap 榜单', stats: [['合约持仓量', 1.08, '$', 'B', 2], ['24小时合约成交额', 8.0, '$', 'B', 1], ['合约交易对', 575, '', '', 0]] as const,
    tag: ['这，', '只是开始。'], cta: '来 Hotcoin 交易合约', badge: 'COINMARKETCAP 第 24 名',
  },
};

const useLangFonts = (lang: Lang) => {
  const [h] = useState(() => delayRender('rank-fonts'));
  useEffect(() => {
    const zh = lang === 'zh' ? ['700 80px NotoSC', '900 80px NotoSC'].map((s) => document.fonts.load(s, '排名解锁')) : [];
    Promise.all([...zh, '600 80px "Inter Tight"', '700 80px "Inter Tight"', '500 30px "JetBrains Mono"'].map((s) => (typeof s === 'string' ? document.fonts.load(s) : s)))
      .then(() => setTimeout(() => continueRender(h), 150));
  }, [h, lang]);
};

const FontFaces: React.FC = () => (
  <style>{`
    @font-face{font-family:NotoSC;font-weight:700;src:url(${staticFile('fonts/NotoSansSC-700.ttf')}) format('truetype');font-display:block}
    @font-face{font-family:NotoSC;font-weight:900;src:url(${staticFile('fonts/NotoSansSC-900.ttf')}) format('truetype');font-display:block}
  `}</style>
);

const Bg: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 55% at 50% ${38 + Math.sin(f / 40) * 4}%, #1F3A0E 0%, #0C1508 45%, ${INK} 80%)`}}>
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.7px)', backgroundSize: '40px 40px', backgroundPosition: `0 ${f * 0.6}px`, maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, #000, transparent)'}} />
  </AbsoluteFill>
);

// rank as a function of frame: slow start, fast middle, hard brake into the lock
const rankAt = (f: number) => {
  const x = ip(f, [T.climb, T.lock], [0, 1]);
  const e = x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  return FROM - (FROM - RANK) * e;
};

const Sparks: React.FC<{f: number; cx: number; cy: number}> = ({f, cx, cy}) => {
  if (f < 0 || f > 40) return null;
  return (
    <>
      {Array.from({length: 22}, (_, i) => {
        const a = (i / 22) * Math.PI * 2 + (i % 3) * 0.2, v = 9 + (i % 5) * 3.2, d = v * f * (1 - f / 90);
        const s = (i % 4 === 0 ? 16 : 9) * (1 - f / 40);
        return <div key={i} style={{position: 'absolute', left: cx + Math.cos(a) * d - s / 2, top: cy + Math.sin(a) * d - s / 2, width: s, height: s, borderRadius: i % 2 ? 99 : 3, background: i % 3 ? LIME : '#fff', transform: `rotate(${f * 9 + i * 20}deg)`}} />;
      })}
    </>
  );
};

export const CmcRank: React.FC<{lang: Lang}> = ({lang}) => {
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  useLangFonts(lang);
  const c = COPY[lang];
  const FONT = lang === 'zh' ? '"Inter Tight", NotoSC, sans-serif' : '"Inter Tight", sans-serif';
  const tall = H / W > 1.5, k = tall ? 1 : 0.86; // 4:5 gets slightly smaller type
  const ink = '#F5F7F2', muted = 'rgba(245,247,242,0.55)';

  // ---------- S1 intro ----------
  const intro = f < T.climb + 8 && (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: ip(f, [T.climb - 6, T.climb + 6], [1, 0])}}>
      {c.intro.map((w, i) => {
        const s = sp(f - 4 - i * 9, 11, 220);
        return (
          <div key={i} style={{fontFamily: FONT, fontWeight: lang === 'zh' ? 900 : 700, fontSize: (lang === 'zh' ? 190 : 170) * k, letterSpacing: lang === 'zh' ? 8 : -6, lineHeight: 1.02, color: i ? LIME : ink,
            transform: `translateY(${(1 - s) * 120}px) scale(${0.7 + s * 0.3 + ip(f, [40, T.climb], [0, 0.08])})`, opacity: s, filter: `blur(${(1 - s) * 10}px)`}}>{w}</div>
        );
      })}
    </AbsoluteFill>
  );

  // ---------- S2 ladder ----------
  const r = rankAt(f), shown = Math.round(r);
  const locked = f >= T.lock, lk = sp(f - T.lock, 9, 260);
  const RH = 132 * k, cy = H * (tall ? 0.6 : 0.6), rowW = W - 140;
  const s2in = sp(f - T.climb + 6, 16, 140), s2out = ip(f, [T.stats - 8, T.stats + 4], [1, 0]);
  const ladder = f >= T.climb - 8 && f < T.stats + 6 && (
    <AbsoluteFill style={{opacity: s2in * s2out}}>
      <div style={{position: 'absolute', top: H * (tall ? 0.13 : 0.098), width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 24 * k, letterSpacing: 4, color: muted}}>{c.board}</div>
      <div style={{position: 'absolute', top: H * (tall ? 0.165 : 0.128), width: '100%', textAlign: 'center', fontFamily: '"Inter Tight", sans-serif', fontWeight: 700,
        fontSize: 300 * k, letterSpacing: -14, lineHeight: 1, color: locked ? LIME : ink, transform: `scale(${locked ? 1 + (1 - lk) * 0.35 : 1})`,
        textShadow: locked ? `0 0 ${60 * (1.2 - lk)}px rgba(184,242,106,0.55)` : 'none', fontVariantNumeric: 'tabular-nums'}}>#{shown}</div>
      <div style={{position: 'absolute', left: 0, top: cy - RH * 3.3, width: W, height: RH * 6.6, opacity: ip(f, [T.lock + 2, T.lock + 14], [1, 0.25]), maskImage: 'linear-gradient(180deg, transparent, #000 25%, #000 75%, transparent)'}}>
        {Array.from({length: 9}, (_, j) => {
          const kk = Math.floor(r) - 4 + j; if (kk < 1 || Math.abs(kk - r) < 0.5) return null;
          const y = RH * 3.3 + (kk - r) * RH - RH * 0.42;
          return (
            <div key={kk} style={{position: 'absolute', left: 70, top: y, width: rowW, height: RH * 0.84, borderRadius: 22, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 28, padding: '0 34px', boxSizing: 'border-box'}}>
              <div style={{fontFamily: MONO, fontSize: 30 * k, color: 'rgba(245,247,242,0.35)', width: 70 * k}}>{kk}</div>
              <div style={{width: 58 * k, height: 58 * k, borderRadius: 99, background: 'rgba(255,255,255,0.09)'}} />
              <div style={{width: 190 + (kk * 37) % 120, height: 22 * k, borderRadius: 11, background: 'rgba(255,255,255,0.1)'}} />
              <div style={{flex: 1}} />
              <div style={{width: 150 + (kk * 53) % 70, height: 22 * k, borderRadius: 11, background: 'rgba(255,255,255,0.07)'}} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 50, top: cy - RH * 0.5, width: rowW + 40, height: RH, borderRadius: 26, background: '#0E1A0A', border: `3px solid ${LIME}`,
        boxShadow: `0 0 ${locked ? 90 * (1.3 - lk) : 40}px rgba(184,242,106,${locked ? 0.55 : 0.28})`, display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px', boxSizing: 'border-box',
        transform: `scale(${locked ? 1 + (1 - lk) * 0.08 : 1}) translateY(${Math.sin(f / 3) * (locked ? 0 : 2)}px)`}}>
        <div style={{fontFamily: MONO, fontSize: 36 * k, color: LIME, width: 80 * k, fontWeight: 700}}>{shown}</div>
        <Img src={staticFile('brand/symbol-official-white.png')} style={{width: 66 * k, height: 66 * k, objectFit: 'contain'}} />
        <div style={{fontFamily: '"Inter Tight", sans-serif', fontWeight: 700, fontSize: 52 * k, color: ink, letterSpacing: -1}}>Hotcoin</div>
        <div style={{flex: 1}} />
      </div>
      <Sparks f={f - T.lock} cx={W / 2} cy={H * (tall ? 0.245 : 0.22)} />
      <div style={{position: 'absolute', top: cy + RH * 2.2, width: '100%', textAlign: 'center', opacity: ip(f, [T.lock + 4, T.lock + 14], [0, 1]), transform: `translateY(${ip(f, [T.lock + 4, T.lock + 16], [30, 0])}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: lang === 'zh' ? 900 : 700, fontSize: 64 * k, color: ink, letterSpacing: lang === 'zh' ? 2 : -1.5}}>{c.locked}</div>
        <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 40 * k, color: muted, marginTop: 10}}>{c.lockedSub}</div>
      </div>
      {locked && <AbsoluteFill style={{background: LIME, opacity: ip(f, [T.lock, T.lock + 7], [0.55, 0]), mixBlendMode: 'screen'}} />}
    </AbsoluteFill>
  );

  // ---------- S3 stats ----------
  const s3out = ip(f, [T.tag - 8, T.tag + 2], [1, 0]);
  const stats = f >= T.stats - 4 && f < T.tag + 4 && (
    <AbsoluteFill style={{justifyContent: 'center', padding: '0 80px', gap: (tall ? 46 : 26) * k, opacity: s3out}}>
      {c.stats.map(([label, val, pre, suf, dp], i) => {
        const t0 = T.stats + i * 12, s = sp(f - t0, 15, 170), cnt = ip(f, [t0, t0 + 32], [0, 1]);
        const v = val * (1 - Math.pow(1 - cnt, 3));
        return (
          <div key={i} style={{opacity: s, transform: `translateX(${(1 - s) * -80}px)`, borderLeft: `6px solid ${LIME}`, paddingLeft: 36}}>
            <div style={{fontFamily: '"Inter Tight", sans-serif', fontWeight: 700, fontSize: 170 * k, letterSpacing: -7, lineHeight: 1, color: i === 0 ? LIME : ink, fontVariantNumeric: 'tabular-nums'}}>{pre}{v.toFixed(dp)}{suf}</div>
            <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 44 * k, color: muted, marginTop: 8}}>{label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );

  // ---------- S4 tagline ----------
  const tag = f >= T.tag - 2 && f < T.cta + 4 && (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: ip(f, [T.cta - 6, T.cta + 2], [1, 0])}}>
      {c.tag.map((w, i) => {
        const s = sp(f - T.tag - i * 10, 13, 180);
        return <div key={i} style={{fontFamily: FONT, fontWeight: lang === 'zh' ? 900 : 700, fontSize: (lang === 'zh' ? 150 : 118) * k, letterSpacing: lang === 'zh' ? 4 : -4, lineHeight: 1.08, color: i ? LIME : ink,
          opacity: s, transform: `translateY(${(1 - s) * 70}px)`, filter: `blur(${(1 - s) * 8}px)`, textAlign: 'center'}}>{w}</div>;
      })}
    </AbsoluteFill>
  );

  // ---------- S5 CTA (white) ----------
  const w5 = sp(f - T.cta + 4, 18, 150);
  const cta = f >= T.cta - 4 && (
    <AbsoluteFill style={{background: '#fff', transform: `translateY(${(1 - w5) * H}px)`, alignItems: 'center', justifyContent: 'center', gap: 54 * k}}>
      <Img src={staticFile('brand/logo-official-black.png')} style={{width: 560 * k, opacity: sp(f - T.cta - 4)}} />
      <div style={{fontFamily: FONT, fontWeight: lang === 'zh' ? 900 : 700, fontSize: (lang === 'zh' ? 80 : 74) * k, color: INK, letterSpacing: lang === 'zh' ? 2 : -2, textAlign: 'center', opacity: sp(f - T.cta - 10), padding: '0 60px'}}>{c.cta}</div>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 44 * k, color: INK, background: LIME, borderRadius: 999, padding: `${26 * k}px ${64 * k}px`, transform: `scale(${sp(f - T.cta - 16, 10, 220)})`}}>hotcoin.com</div>
      <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 26 * k, letterSpacing: 3, color: INK, border: `2px solid ${INK}`, borderRadius: 999, padding: '12px 26px', opacity: sp(f - T.cta - 22)}}>{c.badge}</div>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <FontFaces />
      <Bg f={f} />
      {intro}
      {ladder}
      {stats}
      {tag}
      {f < T.cta + 20 && <Img src={staticFile('brand/logo-official-white.png')} style={{position: 'absolute', top: H * 0.045, left: (W - 230) / 2, width: 230, opacity: 0.9 * ip(f, [0, 10], [0, 1])}} />}
      {cta}
      <Audio src={staticFile('rank/beat.wav')} />
    </AbsoluteFill>
  );
};
