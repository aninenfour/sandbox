// "Never SAFU" aura edit (1080x1920 and 1080x1080, 30 fps, 30 s). Beat-synced to public/aura/beat.wav (150 BPM = 12 frames per beat).
// Footage: NASA (public domain): SLS LOX tank test-to-failure (breach), SLS booster test fire (fire), Perseverance landing
// day at JPL (control room, red landmarks), SDO solar flare (white light), ISS lightning/storm. Archive friends: Prelinger
// Archives (public domain): "Our Summer 1946" home movie, "Social Acceptability" (1957), "What Makes a Good Party?" (1950).
// Market data: Binance daily candles for Oct 10, 2025 (open to intraday low, src/aura/crash.json); NVDA -17% / ~$589B
// (Jan 27, 2025); S&P 500 -5.97% (Apr 4, 2025), ~$5T in two days; $19B liquidated (Oct 10, 2025, CoinGlass);
// $1.5B exchange hack (Feb 21, 2025); LUNA (May 2022); FTX (Nov 2022). Coin logos: CoinGecko.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import crash from './crash.json';

let W = 1080, H = 1920, SQ = false; // set per render from the composition size (9:16 or 1:1)
const B = 12; // frames per beat
export const AURA_DURATION = 900;
const RED = '#FF2A3A', LIME = '#B8F26A', INK = '#050607';
const ANTON = 'Anton, sans-serif', SERIF = '"Instrument Serif", serif', MONO = '"JetBrains Mono", monospace', SANS = '"Inter Tight", sans-serif', DISP = 'Unbounded, sans-serif';
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const rnd = (i: number) => { const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };
const ease = (x: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);

// timeline (frames)
const T = {wall: 0, fracture: 96, rain: 384, white: 504, claps: 552, aura: 648, cta: 792, end: 900}; // claps = archive, aura = kinetic type

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['400 80px Anton', '400 80px VT323', 'italic 400 80px "Instrument Serif"', '700 30px "JetBrains Mono"', '600 30px "Inter Tight"', '900 60px Unbounded'].map((s) => document.fonts.load(s)))
      .then(() => setTimeout(() => continueRender(h), 100));
  }, [h]);
};

// beat hits -> impact envelope (drives shake, zoom punch, RGB split, flashes)
const HITS: [number, number][] = (() => {
  const h: [number, number][] = [];
  for (let f = T.fracture; f < T.rain; f += B) h.push([f, (f - T.fracture) % (4 * B) === 0 ? 0.9 : 0.45]);
  [[T.fracture, 1.6], [T.rain, 1.2]].forEach(([f, s]) => h.push([f, s]));
  return h;
})();
const hit = (f: number, decay = 4) => HITS.reduce((m, [h, s]) => (f >= h ? Math.max(m, s * Math.exp(-(f - h) / decay)) : m), 0);

// ---------------- building blocks ----------------
type Coin = {sym: string; low_pct: number};
const COINS = (crash as unknown as {coins: Coin[]}).coins;
const TRADFI = [{sym: 'NVDA', pct: -17.0, d: 'JAN 27 2025'}, {sym: 'S&P 500', pct: -5.97, d: 'APR 4 2025'}];

const spark = (seed: number, w: number, h: number) => {
  let y = h * 0.2; const pts: string[] = [];
  for (let i = 0; i <= 24; i++) { y += (rnd(seed + i) - 0.25) * h * 0.09; pts.push(`${(i / 24) * w},${Math.min(h - 2, Math.max(2, y))}`); }
  return pts.join(' ');
};
const Tile: React.FC<{i: number; f: number; w: number; h: number; count?: number}> = ({i, f, w, h, count = 1}) => {
  const tf = i % 11 === 10 ? TRADFI[(i / 11) % 2 | 0] : null;
  const c = COINS[i % COINS.length];
  const pct = tf ? tf.pct : c.low_pct, sym = tf ? tf.sym : c.sym, d = tf ? tf.d : 'OCT 10 2025';
  const v = pct * count;
  return (
    <div style={{position: 'relative', width: w, height: h, background: 'linear-gradient(160deg,#2A0306,#120103)', border: '1.5px solid rgba(255,42,58,0.35)', overflow: 'hidden', boxSizing: 'border-box', padding: 18, color: '#fff'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        {tf ? <div style={{width: 40, height: 40, borderRadius: 20, background: '#3A0A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ANTON, fontSize: 16}}>{sym === 'NVDA' ? 'NV' : 'SPX'}</div>
          : <Img src={staticFile(`aura/coins/${sym}.png`)} style={{width: 40, height: 40, borderRadius: 20}} />}
        <div style={{fontFamily: ANTON, fontSize: 34, letterSpacing: 1}}>{sym}</div>
      </div>
      <div style={{fontFamily: ANTON, fontSize: Math.min(76, w * 0.3), color: RED, marginTop: 6, textShadow: `0 0 18px ${RED}`}}>{v.toFixed(1).replace('-', '−')}%</div>
      <svg width={w - 36} height={h * 0.28} style={{position: 'absolute', left: 18, bottom: 40}}><polyline points={spark(i * 7, w - 36, h * 0.28)} fill="none" stroke={RED} strokeWidth={3} /></svg>
      <div style={{position: 'absolute', left: 18, bottom: 12, fontFamily: MONO, fontSize: 14, color: 'rgba(255,255,255,0.55)', letterSpacing: 1}}>{d}</div>
    </div>
  );
};

// t = frames since this shot started; the video plays from `from` seconds at `rate`
const Clip: React.FC<{src: string; t: number; from?: number; rate?: number; grade?: 'red' | 'raw' | 'blue' | 'mono' | 'lime'; zoom?: number; style?: React.CSSProperties}> = ({src, t, from = 0, rate = 1, grade = 'red', zoom = 1, style}) => {
  const g = useCurrentFrame();
  const filt = {red: 'grayscale(1) contrast(1.5) brightness(0.85)', raw: 'contrast(1.15) saturate(1.2)', blue: 'grayscale(0.85) contrast(1.3) brightness(0.7)', mono: 'grayscale(1) contrast(2.6) brightness(1.05)', lime: 'grayscale(1) contrast(1.4) brightness(0.9)'}[grade];
  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      <Sequence from={g - Math.round(t)} layout="none"><OffthreadVideo src={staticFile(`aura/clips/${src}.mp4`)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: filt, transform: `scale(${zoom})`}} /></Sequence>
      {grade === 'red' && <AbsoluteFill style={{background: '#FF1A2A', mixBlendMode: 'color', opacity: 0.9}} />}
      {grade === 'red' && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(40,0,4,0.7))'}} />}
      {grade === 'blue' && <AbsoluteFill style={{background: '#3A5AA0', mixBlendMode: 'color', opacity: 0.55}} />}
      {grade === 'lime' && <AbsoluteFill style={{background: LIME, mixBlendMode: 'color', opacity: 0.75}} />}
    </AbsoluteFill>
  );
};

const News: React.FC<{f: number; title: string; sub: string; tag?: string}> = ({f, title, sub, tag = 'BREAKING'}) => {
  const p = ease(f / 6);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: SQ ? 110 : 300, transform: `translateX(${(1 - p) * -120}%)`}}>
      <div style={{display: 'flex', alignItems: 'stretch', marginLeft: 50, marginRight: 50, boxShadow: '0 20px 50px rgba(0,0,0,0.6)'}}>
        <div style={{background: RED, color: '#fff', fontFamily: ANTON, fontSize: 40, padding: '14px 20px', display: 'flex', alignItems: 'center'}}>{tag}</div>
        <div style={{flex: 1, background: '#fff', color: INK, fontFamily: ANTON, fontSize: 58, lineHeight: 1.05, padding: '14px 22px', textTransform: 'uppercase'}}>{title}</div>
      </div>
      <div style={{marginLeft: 50, marginRight: 50, background: 'rgba(8,8,10,0.92)', color: '#fff', fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 1, padding: '10px 20px'}}>{sub}</div>
      <div style={{position: 'absolute', left: 50, top: -64, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.6)', padding: '6px 14px', fontFamily: MONO, fontWeight: 700, fontSize: 20, color: '#fff'}}>
        <span style={{width: 14, height: 14, borderRadius: 7, background: RED, opacity: Math.floor(f / 8) % 2 ? 0.3 : 1}} />LIVE
      </div>
    </div>
  );
};
const HEAD = [
  {clip: 'breach', from: 2.2, title: '$1.5B stolen in one hack', sub: 'LARGEST CRYPTO HACK EVER · FEB 21, 2025'},
  {clip: 'tense', from: 0.5, title: 'Nvidia loses $589B in a day', sub: 'AI SELL-OFF · −17% · RECORD ONE-DAY LOSS · JAN 27, 2025'},
  {clip: 'fireC', from: 3.8, title: '$19B liquidated in 24 hours', sub: 'BIGGEST CRYPTO WIPEOUT EVER · OCT 10, 2025'},
  {clip: 'redcity', from: 0.3, title: '$5 trillion gone in 2 days', sub: 'S&P 500 · WORST TWO DAYS SINCE 2020 · APR 2025'},
  {clip: 'fireA', from: 1, title: 'LUNA −99.99%', sub: '$40B WIPED OUT · MAY 2022'},
  {clip: 'fireD', from: 1, title: 'FTX collapses', sub: '$8B OF CUSTOMER FUNDS · NOV 2022'},
];

const Glitch: React.FC<{text: string; size: number; f: number; amt: number; font?: string; color?: string; top: number}> = ({text, size, f, amt, font = ANTON, color = '#fff', top}) => {
  const d = amt * 14;
  const base: React.CSSProperties = {position: 'absolute', left: 0, right: 0, top, textAlign: 'center', fontFamily: font, fontSize: size, lineHeight: 0.95, letterSpacing: 2, whiteSpace: 'pre-line'};
  const slice = amt > 0.15 ? (rnd(f) - 0.5) * 40 * amt : 0;
  return (
    <>
      <div style={{...base, color: '#FF0030', transform: `translateX(${-d}px)`, mixBlendMode: 'screen', opacity: 0.9}}>{text}</div>
      <div style={{...base, color: '#00E5FF', transform: `translateX(${d}px)`, mixBlendMode: 'screen', opacity: 0.9}}>{text}</div>
      <div style={{...base, color, textShadow: '0 0 30px rgba(255,255,255,0.35)', clipPath: amt > 0.15 ? `inset(0 0 ${40 + rnd(f + 3) * 30}% 0)` : undefined}}>{text}</div>
      {amt > 0.15 && <div style={{...base, color, clipPath: `inset(${60 - rnd(f + 3) * 30}% 0 0 0)`, transform: `translateX(${slice}px)`}}>{text}</div>}
    </>
  );
};

const Rain: React.FC<{f: number; n?: number; o?: number}> = ({f, n = 160, o = 0.5}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: n}, (_, i) => {
      const len = 50 + rnd(i) * 110, sp = 70 + rnd(i + 3) * 60;
      const y = ((rnd(i + 7) * (H + 300)) + f * sp) % (H + 300) - 200, x = (rnd(i + 11) * (W + 200) - 100 + y * 0.12) % (W + 100);
      return <line key={i} x1={x} y1={y} x2={x + len * 0.12} y2={y + len} stroke={`rgba(200,220,255,${o * (0.4 + rnd(i + 5) * 0.6)})`} strokeWidth={1 + rnd(i + 9) * 2} />;
    })}
  </svg>
);
const LensDrops: React.FC<{f: number}> = ({f}) => (
  <>
    {Array.from({length: 26}, (_, i) => {
      const r = 10 + rnd(i + 20) * 34, x = rnd(i + 21) * W, y = (rnd(i + 22) * H + f * (0.3 + rnd(i) * 1.2)) % H;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2.3, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45), rgba(255,255,255,0.05) 55%, rgba(0,0,0,0.25))', backdropFilter: 'blur(3px)'}} />;
    })}
  </>
);
const Cracks: React.FC<{p: number}> = ({p}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: 16}, (_, i) => {
      const a = (i / 16) * Math.PI * 2 + rnd(i) * 0.3; let x = W / 2, y = H * 0.47; const pts = [`${x},${y}`];
      for (let k = 0; k < 9; k++) { x += Math.cos(a + (rnd(i * 9 + k) - 0.5) * 0.7) * 150 * p; y += Math.sin(a + (rnd(i * 9 + k) - 0.5) * 0.7) * 150 * p; pts.push(`${x},${y}`); }
      return <polyline key={i} points={pts.join(' ')} fill="none" stroke="#fff" strokeWidth={4 - (i % 3)} opacity={0.95} style={{filter: 'drop-shadow(0 0 6px #fff)'}} />;
    })}
  </svg>
);

// ---------------- scenes ----------------
const RedWall: React.FC<{f: number}> = ({f}) => {
  const COLS = 4, ROWS = SQ ? 4 : 7, TW = W / COLS, TH = H / ROWS;
  const z = 1 + f * 0.0012;
  return (
    <AbsoluteFill style={{background: '#0A0102', transform: `scale(${z})`}}>
      {Array.from({length: COLS * ROWS}, (_, i) => {
        const on = f > i * 1.3 + 2, c = Math.min(1, Math.max(0, (f - i * 1.3) / 24));
        return <div key={i} style={{position: 'absolute', left: (i % COLS) * TW, top: Math.floor(i / COLS) * TH, opacity: on ? (rnd(i + Math.floor(f / 2)) > 0.06 ? 1 : 0.4) : 0}}><Tile i={i} f={f} w={TW} h={TH} count={c} /></div>;
      })}
      <AbsoluteFill style={{background: `rgba(255,20,40,${0.12 + 0.12 * Math.abs(Math.sin((f / B) * Math.PI))})`, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

const Shatter: React.FC<{f: number}> = ({f}) => {
  const k = ease(f / 22), C = 3, R = 5;
  return (
    <AbsoluteFill>
      {Array.from({length: C * R}, (_, i) => {
        const cx = i % C, cy = Math.floor(i / C), x0 = (cx / C) * 100, y0 = (cy / R) * 100;
        const dx = (cx - 1) * 500 * k + (rnd(i) - 0.5) * 300 * k, dy = (cy - 2) * 300 * k + 900 * k * k, rot = (rnd(i + 4) - 0.5) * 60 * k;
        return (
          <AbsoluteFill key={i} style={{clipPath: `polygon(${x0}% ${y0}%, ${x0 + 100 / C}% ${y0 + (rnd(i) - 0.5) * 4}%, ${x0 + 100 / C}% ${y0 + 100 / R}%, ${x0}% ${y0 + 100 / R + (rnd(i + 1) - 0.5) * 4}%)`, transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 1 - k * 0.6}}>
            <RedWall f={96} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// grid chaos: bars 0..5 (each 48 frames) from T.fracture
const GridChaos: React.FC<{f: number}> = ({f}) => {
  const bar = Math.floor(f / 48), bf = f % 48, beat = Math.floor(bf / B), bb = bf % B;
  if (bar === 0) { // 2 x 3 cells of footage + tiles, one cell swaps per beat
    const cells = ['breach', 'fireA', 'tense', 'redcity', 'fireB', 'storm'];
    return (
      <AbsoluteFill style={{background: INK}}>
        {cells.map((c, i) => {
          const swap = i === (beat * 2 + 1) % 6 || i === (beat * 2 + 4) % 6;
          const cx = i % 2, cy = Math.floor(i / 2);
          return (
            <div key={i} style={{position: 'absolute', left: cx * W / 2 + 4, top: cy * H / 3 + 4, width: W / 2 - 8, height: H / 3 - 8, overflow: 'hidden', transform: `translateX(${(cy % 2 ? 1 : -1) * (1 - ease(f / 14)) * W}px)`}}>
              {swap && bb < 6 ? <Tile i={i * 3 + beat} f={60} w={W / 2 - 8} h={H / 3 - 8} /> : <div style={{position: 'absolute', inset: 0}}><Clip src={c} t={f} from={1 + i * 0.4} zoom={1.1} /></div>}
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }
  if (bar === 1) { // hero: fireball + $19B, splits into rows on beat 3
    const split = beat >= 2;
    return (
      <AbsoluteFill style={{background: INK}}>
        {[0, 1, 2].map((r) => (
          <div key={r} style={{position: 'absolute', left: 0, top: (r * H) / 3, width: W, height: H / 3, overflow: 'hidden', transform: split ? `translateX(${(r % 2 ? 1 : -1) * ease((bf - 24) / 10) * 90}px)` : undefined}}>
            <div style={{position: 'absolute', left: 0, top: -(r * H) / 3, width: W, height: H}}><Clip src="fireC" t={bf} from={3.6} zoom={1.15} /></div>
          </div>
        ))}
        <News f={bf} title={HEAD[2].title} sub={HEAD[2].sub} />
      </AbsoluteFill>
    );
  }
  if (bar === 2) { // rows: three marquee strips of tiles + headline footage
    return (
      <AbsoluteFill style={{background: INK}}>
        {[0, 1, 2].map((r) => (
          <div key={r} style={{position: 'absolute', left: 0, top: (r * H) / 3, width: W, height: H / 3, overflow: 'hidden', borderTop: `3px solid ${RED}`}}>
            <div style={{position: 'absolute', top: 0, left: (r % 2 ? -1 : 1) * (bf * 28) - (r % 2 ? 0 : 1400), display: 'flex'}}>
              {Array.from({length: 8}, (_, k) => k === 2 + r ? <div key={k} style={{position: 'relative', width: 420, height: H / 3, overflow: 'hidden'}}><Clip src={['breach', 'fireD', 'redcity'][r]} t={bf} from={2} /></div> : <Tile key={k} i={r * 8 + k} f={60} w={300} h={H / 3} />)}
            </div>
          </div>
        ))}
        <Glitch text="BREACH" size={250} f={f} amt={hit(f + T.fracture)} top={H / 2 - 120} color="#fff" />
      </AbsoluteFill>
    );
  }
  if (bar === 3) { // columns sliding vertically, each beat a new headline below
    const h = HEAD[[1, 3, 0, 5][beat]];
    return (
      <AbsoluteFill style={{background: INK}}>
        {[0, 1, 2].map((c) => (
          <div key={c} style={{position: 'absolute', left: (c * W) / 3, top: 0, width: W / 3, height: H, overflow: 'hidden', transform: `translateY(${(c % 2 ? -1 : 1) * Math.sin((bf / 48) * Math.PI) * 120}px)`}}>
            <div style={{position: 'absolute', left: -(c * W) / 3, top: 0, width: W, height: H}}><Clip src={h.clip} t={bb} from={h.from} zoom={1.1} /></div>
          </div>
        ))}
        <News f={bb} title={h.title} sub={h.sub} />
      </AbsoluteFill>
    );
  }
  if (bar === 4) { // 3 x 4 mosaic, reshuffles every half beat
    const s = Math.floor(bf / 6);
    const clips = ['breach', 'fireA', 'fireB', 'fireC', 'tense', 'redcity', 'storm', 'fireD'];
    return (
      <AbsoluteFill style={{background: INK}}>
        {Array.from({length: 12}, (_, i) => {
          const pick = Math.floor(rnd(i * 13 + s * 7) * 3);
          const cw = W / 3, ch = H / 4;
          return (
            <div key={i} style={{position: 'absolute', left: (i % 3) * cw + 3, top: Math.floor(i / 3) * ch + 3, width: cw - 6, height: ch - 6, overflow: 'hidden'}}>
              {pick === 0 ? <Tile i={i + s * 5} f={60} w={cw - 6} h={ch - 6} /> : <div style={{position: 'absolute', inset: 0}}><Clip src={clips[(i + s) % clips.length]} t={bf - s * 6} from={1 + rnd(i + s) * 2} zoom={1.2} /></div>}
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }
  // bar 5: full-screen headline per beat, then PANIC strobe
  if (beat < 2) {
    const h = HEAD[[4, 1][beat]];
    return <AbsoluteFill style={{background: INK}}><Clip src={h.clip} t={bb} from={h.from} zoom={1.05 + bb * 0.01} /><News f={bb} title={h.title} sub={h.sub} /></AbsoluteFill>;
  }
  const strobe = Math.floor(bf / 3) % 2;
  return (
    <AbsoluteFill style={{background: strobe ? RED : INK}}>
      {!strobe && <Clip src="fireC" t={bf - 24} from={5} zoom={1.3} />}
      <Glitch text={'PANIC'} size={330} f={f} amt={0.8} top={H / 2 - 170} color={strobe ? INK : '#fff'} />
    </AbsoluteFill>
  );
};

const RainScene: React.FC<{f: number}> = ({f}) => {
  // 0-12 storm flash, 12-84 despair push-in, 84-120 pray (hands), 120-144 tense
  const shot = f < 12 ? 'storm' : f < 84 ? 'despair' : f < 120 ? 'pray' : 'tense';
  const local = f < 12 ? f : f < 84 ? f - 12 : f < 120 ? f - 84 : f - 120;
  const thunder = f < 3 || (f > 70 && f < 73) ? 1 : 0;
  const txt = 'You’re never SAFU…', shown = Math.max(0, Math.min(txt.length, Math.floor((f - 30) / 2.2)));
  return (
    <AbsoluteFill style={{background: '#020305'}}>
      <Clip src={shot} t={local} from={shot === 'storm' ? 1.5 : 0.2} rate={shot === 'storm' ? 1 : 0.6} grade="blue" zoom={1.05 + local * 0.0025} />
      <Rain f={f} />
      <LensDrops f={f} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,0.75))'}} />
      <AbsoluteFill style={{background: '#DDE6FF', opacity: thunder * 0.55, mixBlendMode: 'screen'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: SQ ? 760 : 1240, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: SQ ? 112 : 132, color: '#fff', textShadow: '0 0 40px rgba(170,200,255,0.6)', opacity: interpolate(f, [120, 140], [1, 0], cl)}}>
        {txt.slice(0, shown)}<span style={{opacity: Math.floor(f / 6) % 2 ? 1 : 0}}>|</span>
      </div>
    </AbsoluteFill>
  );
};

const WhiteLight: React.FC<{f: number}> = ({f}) => {
  const w = interpolate(f, [0, 30, 36], [0, 0.85, 1], cl);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Clip src="sun" t={f} from={0.6} grade="raw" zoom={1 + f * 0.012} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${w}) ${w * 70}%, rgba(255,255,255,${w * 0.6}))`}} />
    </AbsoluteFill>
  );
};

// ---------------- back half: archive friends, kinetic type, end card ----------------
// archive: 4 shots x 2 beats, shown as a 4:3 film frame with sprockets, grain, gate weave and dust
const ARCH = [{c: 'arch1', y: 'HOME MOVIE · 1946'}, {c: 'arch2', y: 'SOCIAL ACCEPTABILITY · 1957'}, {c: 'arch3', y: 'HOME MOVIE · 1946'}, {c: 'arch4', y: 'WHAT MAKES A GOOD PARTY? · 1950'}];
const ArchiveScene: React.FC<{f: number}> = ({f}) => {
  const k = Math.min(3, Math.floor(f / 24)), local = f - k * 24, shot = ARCH[k];
  const fw = W - (SQ ? 140 : 110), fh = fw * 0.75, fx = (W - fw) / 2, fy = (H - fh) / 2 - (SQ ? 10 : 30);
  const wx = (rnd(f * 3.1) - 0.5) * 5, wy = (rnd(f * 2.7) - 0.5) * 6, flick = 0.92 + rnd(f * 5.3) * 0.12;
  const burn = f < 8 ? 1 - f / 8 : local < 2 && k > 0 ? 0.7 - local * 0.3 : 0;
  return (
    <AbsoluteFill style={{background: '#0B0A08'}}>
      {[0, 1].map((side) => (
        <div key={side} style={{position: 'absolute', top: 0, bottom: 0, [side ? 'right' : 'left']: (fx - 44) / 2, width: 44, backgroundImage: 'linear-gradient(180deg, #E9E2D0 0 26px, transparent 26px 64px)', backgroundSize: '44px 64px', backgroundPosition: `0 ${(f * 21) % 64}px`, opacity: 0.18, borderRadius: 6}} />
      ))}
      <div style={{position: 'absolute', left: fx + wx, top: fy + wy, width: fw, height: fh, overflow: 'hidden', borderRadius: 10, filter: `brightness(${flick})`}}>
        <Sequence from={useCurrentFrame() - local} layout="none">
          <OffthreadVideo src={staticFile(`aura/clips/${shot.c}.mp4`)} startFrom={6} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.35) contrast(1.15) saturate(0.85)', transform: `scale(${1.04 + local * 0.002})`}} />
        </Sequence>
        <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundPosition: `${rnd(f) * 300}px ${rnd(f + 2) * 300}px`, opacity: 0.35, mixBlendMode: 'overlay'}} />
        <svg width={fw} height={fh} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 7}, (_, i) => <circle key={i} cx={rnd(f * 7 + i) * fw} cy={rnd(f * 11 + i) * fh} r={1 + rnd(f + i * 3) * 2.5} fill={i % 2 ? '#000' : '#fff'} opacity={0.6} />)}
          {rnd(f * 13) > 0.6 && <line x1={rnd(f * 17) * fw} y1={0} x2={rnd(f * 17) * fw + 4} y2={fh} stroke="#fff" strokeWidth={1.2} opacity={0.35} />}
        </svg>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.6))'}} />
        <AbsoluteFill style={{background: '#FFF8E8', opacity: burn}} />
      </div>
      <div style={{position: 'absolute', left: fx, top: fy + fh + 26, fontFamily: MONO, fontWeight: 700, fontSize: SQ ? 16 : 20, letterSpacing: 3, color: 'rgba(233,226,208,0.55)'}}>{shot.y}</div>
      <div style={{position: 'absolute', right: fx, top: fy + fh + 26, fontFamily: MONO, fontWeight: 700, fontSize: SQ ? 16 : 20, letterSpacing: 3, color: 'rgba(233,226,208,0.35)'}}>PRELINGER ARCHIVES</div>
    </AbsoluteFill>
  );
};

// soft fluid background on white
const Fluid: React.FC<{f: number; o?: number}> = ({f, o = 1}) => (
  <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    {[['#D9F7B0', 0.30, 0.25, 0.9], ['#B8F26A', 0.75, 0.62, 0.7], ['#E8F8FF', 0.15, 0.85, 0.8], ['#F4FBE6', 0.85, 0.15, 1.0]].map(([c, x, y, s], i) => {
      const t = f / 40 + i * 1.7, r = Math.min(W, H) * (s as number);
      return <div key={i} style={{position: 'absolute', left: (x as number) * W + Math.sin(t) * W * 0.08 - r / 2, top: (y as number) * H + Math.cos(t * 0.8) * H * 0.06 - r / 2, width: r, height: r, borderRadius: '50%', background: c as string, filter: 'blur(90px)', opacity: 0.85 * o}} />;
    })}
  </AbsoluteFill>
);

const Words: React.FC<{text: string; f: number; at: number; size: number; color?: string; step?: number; weight?: number}> = ({text, f, at, size, color = INK, step = 4, weight = 600}) => (
  <span style={{display: 'inline-flex', flexWrap: 'wrap', gap: `0 ${size * 0.24}px`}}>
    {text.split(' ').map((w, i) => {
      const p = ease((f - at - i * step) / 9);
      return <span key={i} style={{display: 'inline-block', overflow: 'hidden', lineHeight: 1.08, paddingBottom: size * 0.06}}><span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, fontWeight: weight, fontSize: size, letterSpacing: -size * 0.045, color}}>{w}</span></span>;
    })}
  </span>
);

const TextScene: React.FC<{f: number}> = ({f}) => {
  const size = SQ ? 104 : 118, out1 = ease((f - 64) / 10), out2 = ease((f - 136) / 8);
  const hl = ease((f - 34) / 12);
  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <Fluid f={f} />
      <div style={{position: 'absolute', left: SQ ? 90 : 80, right: SQ ? 90 : 80, top: SQ ? 300 : 700, opacity: 1 - out1, transform: `translateY(${-out1 * 80}px)`}}>
        <div><Words text="Everything’s better" f={f} at={2} size={size} color="#8A9099" /></div>
        <div style={{position: 'relative', display: 'inline-block', marginTop: 6}}>
          <div style={{position: 'absolute', left: -12, right: -12, top: size * 0.32, height: size * 0.62, background: LIME, transformOrigin: 'left center', transform: `scaleX(${hl})`, borderRadius: 10}} />
          <div style={{position: 'relative'}}><Words text="with friends." f={f} at={18} size={size * 1.12} /></div>
        </div>
      </div>
      <div style={{position: 'absolute', left: SQ ? 90 : 80, right: SQ ? 90 : 80, top: SQ ? 280 : 660, opacity: f > 72 ? 1 - out2 : 0, transform: `translateY(${-out2 * 80}px)`}}>
        <div><Words text="Bring a friend." f={f} at={74} size={size} /></div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 10}}>
          <span style={{fontWeight: 600, fontSize: size * 2.1, letterSpacing: -size * 0.11, lineHeight: 0.9, color: '#2F9E44', opacity: ease((f - 90) / 8), transform: `scale(${1.15 - ease((f - 90) / 8) * 0.15})`, display: 'inline-block', transformOrigin: 'left bottom'}}>+$2</span>
          <span style={{fontFamily: MONO, fontWeight: 700, fontSize: SQ ? 22 : 26, letterSpacing: 2, color: '#8A9099', opacity: ease((f - 100) / 8)}}>PER FRIEND · UP TO 50</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// end card: stable, white, registration UI + CTA
const Check: React.FC<{on: number; s: number}> = ({on, s}) => (
  <div style={{width: s, height: s, borderRadius: '50%', border: `2px solid ${on > 0.5 ? INK : '#C9CED4'}`, background: on > 0.5 ? LIME : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + Math.sin(Math.min(1, on) * Math.PI) * 0.15})`, flex: 'none'}}>
    <svg width={s * 0.55} height={s * 0.55} viewBox="0 0 24 24" style={{opacity: on}}><path d="M4 12.5l5 5L20 6.5" stroke={INK} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} strokeDashoffset={30 * (1 - on)} /></svg>
  </div>
);
const CTA: React.FC<{f: number}> = ({f}) => {
  const a = (d: number) => ease((f - d) / 10);
  const steps = ['Sign up', 'Bind your phone', 'First deposit · any amount'];
  const cardW = SQ ? 450 : 900, cardX = SQ ? W - 80 - cardW : 90, cardY = SQ ? 250 : 760, rowH = SQ ? 74 : 104, fs = SQ ? 24 : 36;
  const toast = a(58);
  return (
    <AbsoluteFill style={{color: INK, fontFamily: SANS}}>
      <Fluid f={f + 144} o={0.55} />
      <div style={{position: 'absolute', left: SQ ? 80 : 90, right: SQ ? 80 : 90, top: SQ ? 70 : 150, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: SQ ? 200 : 280, height: ((SQ ? 200 : 280) * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: SQ ? 14 : 19, letterSpacing: 2, border: `1.5px solid ${INK}`, borderRadius: 100, padding: '8px 16px', background: '#fff'}}>NOV 3 — NOV 30</div>
      </div>
      <div style={{position: 'absolute', left: SQ ? 80 : 90, width: SQ ? 440 : 900, top: SQ ? 250 : 330, fontWeight: 600, fontSize: SQ ? 64 : 104, lineHeight: 1, letterSpacing: SQ ? -2.8 : -4.6, opacity: a(0), transform: `translateY(${(1 - a(0)) * 20}px)`}}>
        Time to test a new platform. <span style={{color: '#8A9099'}}>The test is on us.</span>
      </div>
      {/* registration card */}
      <div style={{position: 'absolute', left: cardX, top: cardY, width: cardW, background: '#fff', borderRadius: SQ ? 26 : 36, border: '1.5px solid #E6E8EB', boxShadow: '0 30px 80px rgba(11,14,17,0.12)', padding: SQ ? 28 : 44, opacity: a(6), transform: `translateY(${(1 - a(6)) * 40}px)`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <div style={{fontWeight: 600, fontSize: SQ ? 30 : 44, letterSpacing: -1}}>Create account</div>
          <div style={{fontFamily: MONO, fontSize: SQ ? 14 : 18, color: '#8A9099'}}>{Math.min(3, Math.max(0, Math.floor((f - 14) / 12) + 1))}/3</div>
        </div>
        <div style={{height: 6, borderRadius: 3, background: '#F1F3F5', marginTop: SQ ? 14 : 20, overflow: 'hidden'}}><div style={{height: '100%', width: `${Math.min(1, Math.max(0, (f - 10) / 40)) * 100}%`, background: INK}} /></div>
        {steps.map((s, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: SQ ? 16 : 24, height: rowH, borderBottom: i < 2 ? '1.5px solid #F1F3F5' : undefined}}>
            <Check on={ease((f - 14 - i * 12) / 6)} s={SQ ? 34 : 50} />
            <div style={{fontWeight: 600, fontSize: fs, letterSpacing: -0.5}}>{s}</div>
          </div>
        ))}
        <div style={{marginTop: SQ ? 14 : 22, display: 'flex', alignItems: 'center', gap: SQ ? 14 : 20, background: LIME, borderRadius: SQ ? 16 : 22, padding: SQ ? '16px 18px' : '24px 28px', opacity: toast, transform: `translateY(${(1 - toast) * 20}px) scale(${0.96 + toast * 0.04})`}}>
          <svg width={SQ ? 30 : 44} height={SQ ? 30 : 44} viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" rx="2" fill="none" stroke={INK} strokeWidth={2} /><path d="M3 13h18M12 9v12M12 9c-2-4-6-4-6-1.5S10 9 12 9zm0 0c2-4 6-4 6-1.5S14 9 12 9z" fill="none" stroke={INK} strokeWidth={2} /></svg>
          <div><div style={{fontWeight: 600, fontSize: SQ ? 30 : 46, letterSpacing: -1, lineHeight: 1}}>$5 Futures Voucher</div><div style={{fontFamily: MONO, fontSize: SQ ? 13 : 18, marginTop: 4}}>added to your account</div></div>
        </div>
      </div>
      {/* friend line + button */}
      <div style={{position: 'absolute', left: SQ ? 80 : 90, right: SQ ? undefined : 90, width: SQ ? 440 : undefined, top: SQ ? 560 : 1480, display: 'flex', alignItems: 'baseline', gap: 18, opacity: a(70)}}>
        <span style={{fontWeight: 600, fontSize: SQ ? 72 : 96, letterSpacing: -3, color: '#2F9E44', lineHeight: 1}}>+$2</span>
        <span style={{fontWeight: 600, fontSize: SQ ? 24 : 34, lineHeight: 1.15}}>for every friend<br /><span style={{fontFamily: MONO, fontWeight: 500, fontSize: SQ ? 14 : 20, color: '#8A9099'}}>up to 50 friends</span></span>
      </div>
      <div style={{position: 'absolute', left: SQ ? 80 : 90, right: SQ ? 80 : 90, top: SQ ? 880 : 1640, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: INK, color: '#fff', borderRadius: 999, padding: SQ ? '18px 18px 18px 36px' : '26px 26px 26px 46px', opacity: a(80), transform: `scale(${0.97 + a(80) * 0.03})`}}>
        <div style={{fontFamily: DISP, fontWeight: 900, fontSize: SQ ? 34 : 34, whiteSpace: 'nowrap'}}>hotcoin.com/r/MetaBonus</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <span style={{fontWeight: 600, fontSize: SQ ? 24 : 26, color: LIME, whiteSpace: 'nowrap'}}>Sign up</span>
          <div style={{width: SQ ? 58 : 74, height: SQ ? 58 : 74, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="40%" height="40%" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        </div>
      </div>
      <div style={{position: 'absolute', left: SQ ? 80 : 90, right: SQ ? 80 : 90, bottom: SQ ? 26 : 60, fontFamily: MONO, fontSize: SQ ? 12 : 15, lineHeight: 1.5, color: '#8A9099'}}>
        Futures Vouchers are promotional trial funds. Futures trading is high risk. Terms apply.<br />Footage: NASA, Prelinger Archives (public domain) · Data: Binance, CoinGlass, Reuters, Bloomberg
      </div>
    </AbsoluteFill>
  );
};

// ---------------- main ----------------
export const AuraEdit: React.FC = () => {
  useFonts();
  const g = useCurrentFrame();
  ({width: W, height: H} = useVideoConfig()); SQ = W === H;
  const h = hit(g);
  const shake = h * 22, sx = (rnd(g * 1.7) - 0.5) * shake, sy = (rnd(g * 2.3) - 0.5) * shake;
  const zoom = 1 + h * 0.06;
  const cta = g >= T.claps; // archive, type and end card have their own clean look
  const rgb = cta ? 0 : Math.min(18, h * 14 + (g >= T.fracture && g < T.fracture + 10 ? 10 : 0));
  let scene: React.ReactNode;
  if (g < T.fracture) scene = (
    <AbsoluteFill>
      <RedWall f={g} />
      {g >= 48 && <Glitch text={['EVERYTHING', 'EVERYTHING\nIS', 'EVERYTHING\nIS RED.'][Math.min(2, Math.floor((g - 48) / B))]} size={SQ ? 160 : 190} f={g} amt={(g - 48) % B < 3 ? 0.8 : 0.12} top={SQ ? 230 : 620} />}
      <AbsoluteFill style={{background: `linear-gradient(${(g * 6) % 360}deg, rgba(255,0,30,0.25), transparent 40%)`, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
  else if (g < T.rain) scene = (
    <AbsoluteFill>
      <GridChaos f={g - T.fracture} />
      {g < T.fracture + 24 && <Shatter f={g - T.fracture} />}
      {g < T.fracture + 10 && <Cracks p={ease((g - T.fracture) / 4)} />}
    </AbsoluteFill>
  );
  else if (g < T.white) scene = <RainScene f={g - T.rain} />;
  else if (g < T.claps) scene = <WhiteLight f={g - T.white} />;
  else if (g < T.aura) scene = <ArchiveScene f={g - T.claps} />;
  else if (g < T.cta) scene = <TextScene f={g - T.aura} />;
  else scene = <CTA f={g - T.cta} />;
  const flash = [T.fracture, T.rain].some((x) => g >= x && g < x + 3) ? 1 - ((g - [T.fracture, T.rain].find((x) => g >= x && g < x + 3)!) / 3) : 0;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="rgbsplit" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feOffset in="r" dx={rgb} dy={0} result="ro" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
          <feOffset in="b" dx={-rgb} dy={0} result="bo" />
          <feBlend in="ro" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="bo" mode="screen" />
        </filter>
      </svg>
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px) scale(${zoom})`, filter: rgb > 1 ? 'url(#rgbsplit)' : undefined}}>{scene}</AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
      {!cta && <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundPosition: `${rnd(g) * 400}px ${rnd(g + 1) * 400}px`, opacity: 0.12, mixBlendMode: 'overlay'}} />}
      {!cta && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55))'}} />}
      <Audio src={staticFile('aura/beat.wav')} />
    </AbsoluteFill>
  );
};
