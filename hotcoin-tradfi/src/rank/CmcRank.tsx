// "Top 24 on CoinMarketCap" celebration short. 9:16 and 4:5, English and Chinese (prop `lang`). 30 fps, 450 frames.
// Facts: CoinMarketCap derivatives exchange ranking (screenshot Nov 4, 2026: Hotcoin #24). Stats from CMC
// data-api exchange/listing?exType=2 on Nov 4, 2026 12:09 UTC: open interest $1.076B, 24h derivatives volume $8.045B,
// 575 derivatives pairs. Table rows 19-28 copy the CMC page (screenshot); rows 29+ are the next entries of the same
// CMC listing (API, same day). Exchange logos: CoinMarketCap static exchange logos (s2.coinmarketcap.com), cmc.json.
// Music: original, scripts/make-rank-beat.py -> public/rank/beat.wav. Chinese font: Noto Sans SC (Google Fonts, OFL).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, LIME, MONO} from '../promo4/kit';
import DATA from './cmc.json';

export const RANK_DURATION = 450;
const FPS = 30, RANK = 24;
const T = {land: 72, lift: 100, stats: 195, tag: 315, cta: 375};
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ip = (f: number, a: number[], b: number[]) => interpolate(f, a, b, cl);
const sp = (f: number, d = 14, s = 170) => spring({frame: f, fps: FPS, config: {damping: d, stiffness: s}});

type Lang = 'en' | 'zh' | 'vi';
const COPY = {
  en: {
    title: 'Derivatives Exchanges', sub: 'CoinMarketCap ranking · Nov 4, 2026', colName: 'Name', colOI: 'Open Interest', locked: 'Top 24 derivatives exchange',
    lockedSub: 'on CoinMarketCap', stats: [['Open interest', 1.08, '$', 'B', 2], ['24h futures volume', 8.0, '$', 'B', 1], ['Futures pairs', 575, '', '', 0]] as const,
    tag: ['And we\'re just', 'getting started.'], cta: 'Trade futures on Hotcoin', badge: '#24 ON COINMARKETCAP',
  },
  vi: {
    title: 'Sàn giao dịch phái sinh', sub: 'Xếp hạng CoinMarketCap · 04/11/2026', colName: 'Tên', colOI: 'Hợp đồng mở', locked: 'Top 24 sàn phái sinh',
    lockedSub: 'trên CoinMarketCap', stats: [['Hợp đồng mở (OI)', 1.08, '$', 'B', 2], ['Khối lượng futures 24h', 8.0, '$', 'B', 1], ['Cặp giao dịch futures', 575, '', '', 0]] as const,
    tag: ['Và đây mới chỉ', 'là khởi đầu.'], cta: 'Giao dịch futures trên Hotcoin', badge: '#24 TRÊN COINMARKETCAP',
  },
  zh: {
    title: '衍生品交易所排名', sub: 'CoinMarketCap · 2026年11月4日', colName: '名称', colOI: '持仓量', locked: '衍生品交易所第 24 名',
    lockedSub: 'CoinMarketCap 榜单', stats: [['合约持仓量', 1.08, '$', 'B', 2], ['24小时合约成交额', 8.0, '$', 'B', 1], ['合约交易对', 575, '', '', 0]] as const,
    tag: ['这，', '只是开始。'], cta: '来 Hotcoin 交易合约', badge: 'COINMARKETCAP 第 24 名',
  },
};

const useLangFonts = (lang: Lang) => {
  const [h] = useState(() => delayRender('rank-fonts'));
  useEffect(() => {
    const zh = lang === 'zh' ? ['700 80px NotoSC', '900 80px NotoSC'].map((s) => document.fonts.load(s, '排名解锁')) : [];
    Promise.all([...zh, '600 80px "Inter Tight"', '700 80px "Inter Tight"', '500 30px "JetBrains Mono"', '500 30px Inter', '700 30px Inter', '800 30px Inter'].map((s) => (typeof s === 'string' ? document.fonts.load(s) : s)))
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

const Confetti: React.FC<{f: number; W: number; H: number; y0: number}> = ({f, W, H, y0}) => {
  if (f < 0 || f > 90) return null;
  const cols = [LIME, '#2DBD85', INK, '#B8F26A', '#7EC25A'];
  return (
    <>
      {Array.from({length: 70}, (_, i) => {
        const r1 = Math.sin(i * 91.7) * 0.5 + 0.5, r2 = Math.sin(i * 47.3) * 0.5 + 0.5, r3 = Math.sin(i * 13.1) * 0.5 + 0.5;
        const vx = (r1 - 0.5) * 34, vy = -18 - r2 * 26, g = 1.05;
        const x = W / 2 + vx * f, y = y0 + vy * f + 0.5 * g * f * f;
        if (y > H + 40) return null;
        const w = 12 + r3 * 14, h = w * (0.45 + r2 * 0.4);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: i % 5 === 0 ? 99 : 3, background: cols[i % cols.length], opacity: ip(f, [60, 90], [1, 0]),
          transform: `rotate(${f * (8 + r3 * 14) + i * 33}deg) scaleY(${Math.cos(f * 0.3 + i)})`}} />;
      })}
    </>
  );
};

export const CmcRank: React.FC<{lang: Lang}> = ({lang}) => {
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  useLangFonts(lang);
  const c = COPY[lang];
  const FONT = lang === 'zh' ? '"Inter Tight", NotoSC, sans-serif' : '"Inter Tight", Inter, sans-serif';
  const tall = H / W > 1.5, k = tall ? 1 : 0.86; // 4:5 gets slightly smaller type
  const ink = '#F5F7F2', muted = 'rgba(245,247,242,0.55)';

  // ---------- S1 CMC table: scroll up, land on Hotcoin, highlight, lift it out ----------
  const UI = '"Inter", "Inter Tight", NotoSC, sans-serif';
  const RH = 146 * k, headTop = H * (tall ? 0.075 : 0.05), thTop = headTop + 150 * k, rowsTop = thTop + 74 * k;
  const viewH = H - rowsTop, focusY = rowsTop + viewH * (tall ? 0.42 : 0.46);
  const sc = ip(f, [0, T.land], [0, 1]), eased = 1 - Math.pow(1 - sc, 4);
  const center = 44 - (44 - RANK) * eased, speed = Math.abs(ip(f + 1, [0, T.land], [0, 1]) - sc) > 0 ? 4 * Math.pow(1 - sc, 3) * (44 - RANK) / T.land : 0;
  const rowY = (rank: number) => focusY + (rank - center) * RH - RH / 2;
  const hl = ip(f, [T.land, T.land + 10], [0, 1]), draw = ip(f, [T.land + 4, T.land + 22], [0, 1]);
  const lt = sp(f - T.lift, 12, 120), liftY = interpolate(lt, [0, 1], [rowY(RANK), H * (tall ? 0.36 : 0.4)]);
  const s1out = ip(f, [T.stats - 10, T.stats + 2], [1, 0]);
  const fmtUsd = (v: number) => '$' + Math.round(v).toLocaleString('en-US');
  const Row: React.FC<{r: typeof DATA.rows[number]; hot?: boolean}> = ({r, hot}) => (
    <div style={{display: 'flex', alignItems: 'center', height: RH, padding: `0 ${52 * k}px`, boxSizing: 'border-box', fontFamily: UI, color: '#0D1421'}}>
      <div style={{width: 92 * k, fontSize: 32 * k, color: '#58667E', fontWeight: 500}}>{r.rank}</div>
      <Img src={staticFile(`rank/logos/${r.id}.png`)} style={{width: 66 * k, height: 66 * k, borderRadius: 99, marginRight: 28 * k}} />
      <div style={{flex: 1}}>
        <div style={{fontSize: 38 * k, fontWeight: 700, letterSpacing: -0.4}}>{r.name}</div>
        <div style={{display: 'inline-block', marginTop: 6, fontSize: 25 * k, fontWeight: 600, color: '#58667E', background: '#EFF2F5', borderRadius: 7, padding: '2px 12px'}}>{r.rank}</div>
      </div>
      <div style={{fontSize: 36 * k, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: hot ? '#0D1421' : '#0D1421'}}>{fmtUsd(r.oi)}</div>
    </div>
  );
  const hot = DATA.rows.find((r) => r.name === 'Hotcoin')!;
  const table = f < T.stats + 4 && (
    <AbsoluteFill style={{background: '#fff', opacity: s1out, transform: `translateY(${ip(f, [T.stats - 10, T.stats + 2], [0, -H * 0.08])}px)`}}>
      <div style={{position: 'absolute', inset: 0, filter: `blur(${ip(lt, [0, 1], [0, 6])}px)`, opacity: ip(lt, [0, 1], [1, 0.3])}}>
        <div style={{position: 'absolute', top: headTop, left: 52 * k, fontFamily: UI}}>
          <div style={{fontSize: 62 * k, fontWeight: 800, color: '#0D1421', letterSpacing: -1.5}}>{c.title}</div>
          <div style={{fontSize: 30 * k, fontWeight: 500, color: '#58667E', marginTop: 8}}>{c.sub}</div>
        </div>
        <div style={{position: 'absolute', left: 0, top: rowsTop, width: W, height: viewH, overflow: 'hidden', filter: `blur(${Math.min(5, speed * 0.9)}px)`}}>
          {DATA.rows.map((r) => {
            const y = rowY(r.rank) - rowsTop; if (y < -RH || y > viewH) return null;
            const isHot = r.name === 'Hotcoin';
            return (
              <div key={r.rank} style={{position: 'absolute', left: 0, top: y, width: W, borderBottom: '1.5px solid #EFF2F5', background: isHot ? `rgba(184,242,106,${0.28 * hl * (1 - lt)})` : 'transparent'}}>
                <div style={{opacity: isHot ? 1 - lt : 1}}><Row r={r} hot={isHot} /></div>
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 0, top: thTop, width: W, height: 74 * k, display: 'flex', alignItems: 'center', padding: `0 ${52 * k}px`, boxSizing: 'border-box', fontFamily: UI, fontWeight: 700, fontSize: 29 * k, color: '#0D1421', borderTop: '1.5px solid #EFF2F5', borderBottom: '1.5px solid #EFF2F5', background: '#fff'}}>
          <div style={{width: 92 * k}}># <span style={{color: '#3861FB', fontSize: 20 * k}}>▼</span></div>
          <div style={{flex: 1}}>{c.colName}</div>
          <div>{c.colOI}</div>
        </div>
      </div>
      {/* hand-drawn marker circle around our row */}
      {f >= T.land + 4 && lt < 0.02 && (
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <path d={`M ${W * 0.06} ${rowY(RANK) + RH * 0.15} C ${W * 0.1} ${rowY(RANK) - RH * 0.12}, ${W * 0.82} ${rowY(RANK) - RH * 0.14}, ${W * 0.94} ${rowY(RANK) + RH * 0.3} S ${W * 0.78} ${rowY(RANK) + RH * 1.12}, ${W * 0.35} ${rowY(RANK) + RH * 1.06} S ${W * 0.02} ${rowY(RANK) + RH * 0.85}, ${W * 0.06} ${rowY(RANK) + RH * 0.2} l ${W * 0.02} ${RH * 0.18}`}
            fill="none" stroke={LIME} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{filter: 'drop-shadow(0 2px 0 rgba(0,0,0,0.12))'}} />
        </svg>
      )}
      {/* lifted card */}
      {f >= T.lift - 1 && (
        <>
          <div style={{position: 'absolute', left: 0, top: liftY, width: W, transform: `scale(${1 + lt * 0.06})`, transformOrigin: '50% 50%'}}>
            <div style={{margin: `0 ${24 * k}px`, borderRadius: 30, background: '#fff', border: `4px solid ${LIME}`, boxShadow: `0 ${30 * lt}px ${80 * lt}px rgba(13,20,33,${0.22 * lt}), 0 0 ${60 * lt}px rgba(184,242,106,${0.6 * lt})`}}>
              <Row r={hot} hot />
            </div>
          </div>
          <div style={{position: 'absolute', top: liftY - (tall ? 380 : 330) * k, width: '100%', textAlign: 'center', opacity: lt, transform: `scale(${0.6 + 0.4 * sp(f - T.lift - 4, 9, 200)})`}}>
            <span style={{position: 'relative', fontFamily: '"Inter Tight", sans-serif', fontWeight: 700, fontSize: 300 * k, letterSpacing: -14, color: INK, lineHeight: 1}}>
              <span style={{position: 'absolute', left: '-4%', right: '-4%', bottom: '10%', height: '30%', background: LIME, zIndex: -1, borderRadius: 12, transform: `scaleX(${ip(f, [T.lift + 8, T.lift + 22], [0, 1])})`, transformOrigin: '0 50%'}} />
              #{RANK}
            </span>
          </div>
          <div style={{position: 'absolute', top: liftY + RH + 70 * k, width: '100%', textAlign: 'center', opacity: ip(f, [T.lift + 14, T.lift + 26], [0, 1]), transform: `translateY(${ip(f, [T.lift + 14, T.lift + 28], [30, 0])}px)`}}>
            <div style={{fontFamily: FONT, fontWeight: lang === 'zh' ? 900 : 700, fontSize: 66 * k, color: INK, letterSpacing: lang === 'zh' ? 2 : -1.5}}>{c.locked}</div>
            <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 40 * k, color: '#58667E', marginTop: 10}}>{c.lockedSub}</div>
          </div>
          <Confetti f={f - T.lift} W={W} H={H} y0={liftY} />
        </>
      )}
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
      {table}
      {stats}
      {tag}
      {f >= T.stats - 2 && f < T.cta + 20 && <Img src={staticFile('brand/logo-official-white.png')} style={{position: 'absolute', top: H * 0.045, left: (W - 230) / 2, width: 230, opacity: 0.9 * ip(f, [T.stats, T.stats + 10], [0, 1])}} />}
      {cta}
      <Audio src={staticFile('rank/beat.wav')} />
    </AbsoluteFill>
  );
};
