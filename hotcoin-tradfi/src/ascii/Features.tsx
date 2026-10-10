// "Hotcoin in characters: features". Platform promo drawn in monospace glyphs (engine in AsciiFilm.tsx).
// symbol -> spot & futures (candles) -> TradFi (BTC / TSLA / GOLD) -> copy trading (followers track a leader curve)
// -> Earn (growing columns) -> buy / P2P / Web3 -> four booth photos full screen, the last one pulls back into a
// mosaic of booth photos that forms the Hotcoin logo -> hotcoin.com.
// Feature claims from hotcoin.com (homepage, /about, /tradFi), Oct 2026. Music: "Red Lights Adhafera" (Mixkit).
import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IN, INOUT, OUT, clamp, ease} from '../alt/kit';
import {ASCII_FPS, Cell, Glyphs, LH, LW, rnd, sm, symbolField, textLum, useSources} from './AsciiFilm';

const FPS = ASCII_FPS;
const s = (sec: number) => Math.round(sec * FPS);
const T = {futures: 3.6, tradfi: 9.2, copy: 14.6, earn: 20, trio: 25, photos: 29.2, pull: 31.75, logo: 34.9, url: 36.4, end: 39.3};
export const FEATURES_DURATION = s(T.end);
const INK = '#0B0E11', GLYPH = '#E9E8E1', LIME = '#B8F26A', MUTED = '#8C959E';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';

// a feature card: small numbered kicker + one clean line, bottom left (the reference keeps its type crisp)
const Caption: React.FC<{f: number; from: number; to: number; no: string; kicker: string; title: string; sub?: string}> = ({f, from, to, no, kicker, title, sub}) => {
  const a = ease(f, s(from + 0.35), s(from + 0.85), OUT) * (1 - ease(f, s(to) - 9, s(to), IN));
  return (
    <div style={{position: 'absolute', left: 120, bottom: 110, opacity: a, transform: `translateY(${(1 - a) * 16}px)`}}>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 4, color: LIME}}>{no} / {kicker}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 64, letterSpacing: -1.6, color: '#fff', marginTop: 10, textShadow: '0 4px 30px rgba(0,0,0,0.7)'}}>{title}</div>
      {sub ? <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, color: '#C9CCC6', marginTop: 8}}>{sub}</div> : null}
    </div>
  );
};
const scene = (f: number, from: number, to: number) => ease(f, s(from), s(from) + 8) * (1 - ease(f, s(to) - 8, s(to), IN));

// 01 spot & futures: a candle chart builds left to right
const Candles: React.FC<{f: number}> = ({f}) => {
  const t = f / FPS - T.futures, a = scene(f, T.futures, T.tradfi);
  const N = 16;
  const bars = useMemo(() => {
    let p = 0; const raw: {o: number; c: number; h: number; l: number}[] = [];
    for (let i = 0; i < N; i++) {
      const o = p, c = p + 0.35 + (rnd(i * 3 + 7) - 0.42) * 2.2;
      raw.push({o, c, h: Math.max(o, c) + 0.15 + rnd(i + 40) * 0.5, l: Math.min(o, c) - 0.15 - rnd(i + 80) * 0.5}); p = c;
    }
    const lo = Math.min(...raw.map((b) => b.l)), hi = Math.max(...raw.map((b) => b.h)), n = (v: number) => 0.04 + ((v - lo) / (hi - lo)) * 0.92;
    return raw.map((b) => ({o: n(b.o), c: n(b.c), h: n(b.h), l: n(b.l)}));
  }, []);
  const shown = interpolate(t, [0.2, 3.6], [0, N], {...clamp, easing: OUT});
  const x0 = 0.1, x1 = 0.9, y0 = 0.07, y1 = 0.68; // chart box (fractions of the frame)
  return (
    <Glyphs cell={12} frame={f} field={(u, w) => {
      if (u < x0 || u > x1 || w < y0 || w > y1) return 0;
      const fx = ((u - x0) / (x1 - x0)) * N, i = Math.floor(fx), within = fx - i;
      if (i >= shown) return 0;
      const b = bars[i], up = b.c >= b.o, val = 1 - (w - y0) / (y1 - y0);
      const grow = Math.min(1, shown - i);
      const top = Math.max(b.o, b.c), bot = Math.min(b.o, b.c);
      const mid = bot + (top - bot) * grow;
      const inBody = within > 0.18 && within < 0.82 && val >= bot - 0.004 && val <= Math.max(mid, bot + 0.008);
      const inWick = within > 0.44 && within < 0.56 && val >= b.l && val <= b.h * grow + bot * (1 - grow);
      if (inBody) return {v: 0.95 * a, lime: up};
      if (inWick) return {v: 0.55 * a, lime: up};
      // faint grid
      return Math.abs(val * 5 - Math.round(val * 5)) < 0.02 ? 0.12 * a : 0;
    }} />
  );
};

// 02 TradFi: one account, the ticker morphs BTC -> TSLA -> GOLD (cells switch word one by one)
const Tickers: React.FC<{f: number}> = ({f}) => {
  const t = f / FPS - T.tradfi, a = scene(f, T.tradfi, T.copy);
  const lums = useMemo(() => ['BTC', 'TSLA', 'GOLD'].map((w) => textLum(w, w.length > 3 ? 116 : 160)), []);
  const k = Math.min(2, Math.floor(Math.max(0, t - 0.3) / 1.6));
  const local = Math.max(0, t - 0.3) - k * 1.6;
  const mix = k < 2 ? sm(1.15, 1.6, local) : 0;
  return (
    <Glyphs cell={11} frame={f} field={(u, w, c, r) => {
      const ix = Math.floor(u * LW), iy = Math.floor((w + 0.14) * LH);
      if (ix < 0 || iy < 0 || ix >= LW || iy >= LH) return 0;
      const useNext = rnd(c * 13 + r * 29) < mix;
      const v = (useNext ? lums[k + 1] : lums[k])[iy * LW + ix];
      const kk = useNext ? k + 1 : k;
      return {v: v * a, lime: kk === 2};
    }} />
  );
};

// 03 copy trading: a lime leader curve, followers converge onto it
const Copy: React.FC<{f: number}> = ({f}) => {
  const t = f / FPS - T.copy, a = scene(f, T.copy, T.earn);
  const lead = (x: number) => 0.5 - 0.22 * x - 0.06 * Math.sin(x * 9) - 0.03 * Math.sin(x * 23 + 1);
  const reveal = interpolate(t, [0.2, 3.0], [0, 1], {...clamp, easing: INOUT});
  const lock = sm(1.0, 3.6, t); // followers snap onto the leader
  const followers = [0.16, -0.12, 0.24, -0.2, 0.08, -0.05];
  return (
    <Glyphs cell={11} frame={f} field={(u, w) => {
      const x = (u - 0.08) / 0.84;
      if (x < 0 || x > reveal || w > 0.7) return 0;
      const ly = lead(x);
      if (Math.abs(w - ly) < 0.016) return {v: a, lime: true};
      let best = 0;
      followers.forEach((off, i) => {
        const lag = 0.03 * (i + 1);
        const fy = lead(Math.max(0, x - lag)) + off * (1 - lock) * (0.4 + x) + 0.012 * Math.sin(x * 40 + i);
        if (Math.abs(w - fy) < 0.008) best = Math.max(best, 0.55 - i * 0.04);
      });
      return best * a;
    }} />
  );
};

// 04 Earn: columns grow like compounding balances
const Earn: React.FC<{f: number}> = ({f}) => {
  const t = f / FPS - T.earn, a = scene(f, T.earn, T.trio);
  const N = 12;
  return (
    <Glyphs cell={12} frame={f} field={(u, w) => {
      const x0 = 0.18, x1 = 0.82, base = 0.68;
      if (u < x0 || u > x1 || w > base) return 0;
      const fx = ((u - x0) / (x1 - x0)) * N, i = Math.floor(fx), within = fx - i;
      if (within < 0.14 || within > 0.86) return 0;
      const target = 0.08 * Math.pow(1.19, i);
      const grow = sm(0.3 + i * 0.18, 0.9 + i * 0.18, t);
      const top = base - target * grow;
      if (w < top) return 0;
      return {v: (0.55 + 0.45 * (1 - (w - top) / 0.6)) * a, lime: i === N - 1 && grow > 0.95};
    }} />
  );
};

// 05 three quick beats
const Trio: React.FC<{f: number}> = ({f}) => {
  const t = f / FPS - T.trio, a = scene(f, T.trio, T.photos);
  const words = ['BUY', 'P2P', 'WEB3'];
  const k = Math.min(2, Math.floor(Math.max(0, t) / 1.4));
  const lum = useMemo(() => textLum(words[k], words[k].length > 3 ? 116 : 160), [k]);
  const local = Math.max(0, t) - k * 1.4;
  const pop = sm(0, 0.25, local) * (k < 2 ? 1 - sm(1.2, 1.4, local) : 1);
  return (
    <Glyphs cell={11} frame={f} seedShift={k * 31} field={(u, w) => {
      const ix = Math.floor(u * LW), iy = Math.floor((w + 0.14) * LH);
      const v = ix >= 0 && iy >= 0 && ix < LW && iy < LH ? lum[iy * LW + ix] : 0;
      return {v: v * a * pop, lime: k === 2};
    }} />
  );
};
const TRIO_SUB = ['Buy crypto with a card', 'P2P trading with trusted merchants', 'Your own Web3 wallet'];

// 06 photos -> logo mosaic
const MC = 64;
const Mosaic: React.FC<{f: number}> = ({f}) => {
  const sec = f / FPS;
  const [grid, setGrid] = useState<{cells: {c: number; r: number; k: number}[]; rows: number} | null>(null);
  const [h] = useState(() => delayRender('logo grid'));
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const rows = Math.round((MC * img.height) / img.width * (4 / 3)) + 2;
      const cv = document.createElement('canvas'); cv.width = MC; cv.height = rows;
      const ctx = cv.getContext('2d')!; ctx.drawImage(img, 0, 1, MC, rows - 2);
      const d = ctx.getImageData(0, 0, MC, rows).data, cells: {c: number; r: number; k: number}[] = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < MC; c++) if (d[(r * MC + c) * 4 + 3] > 90) cells.push({c, r, k: cells.length});
      setGrid({cells, rows}); continueRender(h);
    };
    img.src = staticFile('brand/logo-official-white.png');
  }, [h]);
  if (!grid) return null;
  const TW = 1800 / MC, TH = TW * 0.75, ox = 60, oy = (1080 - grid.rows * TH) / 2;
  // the focus tile: a cell near the middle of the wordmark
  const focus = grid.cells.reduce((b, x) => (Math.abs(x.c - MC * 0.55) + Math.abs(x.r - grid.rows / 2) < Math.abs(b.c - MC * 0.55) + Math.abs(b.r - grid.rows / 2) ? x : b));
  const fx = ox + focus.c * TW + TW / 2, fy = oy + focus.r * TH + TH / 2;
  // pull-back: from the focus tile filling the frame to the whole logo
  const p = interpolate(sec, [T.pull + 0.55, T.logo], [0, 1], {...clamp, easing: INOUT});
  const zStart = 1920 / TW, z = Math.exp(Math.log(zStart) * (1 - p));
  const cx = fx + (960 - fx) * p, cy = fy + (540 - fy) * p;
  const out = ease(f, s(T.url) - 4, s(T.url) + 10, IN);
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <AbsoluteFill style={{transform: `translate(${960 - cx}px, ${540 - cy}px) scale(${z})`, transformOrigin: `${cx}px ${cy}px`}}>
        {grid.cells.map(({c, r, k}) => {
          const isFocus = k === focus.k;
          const st = s(T.pull + 0.55) + 4 + rnd(k) * 24; // tiles land as the camera pulls back
          const vis = isFocus ? 1 : f < st ? 0 : Math.min(1, (f - st) / 8);
          return (
            <Img key={k} src={staticFile(isFocus ? 'ascii/hero3.jpg' : `ascii/tiles/${String((k * 7) % 40).padStart(2, '0')}.jpg`)}
              style={{position: 'absolute', left: ox + c * TW + 0.5, top: oy + r * TH + 0.5, width: TW - 1, height: TH - 1, objectFit: 'cover', opacity: vis}} />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Heroes: React.FC<{f: number}> = ({f}) => {
  const sec = f / FPS;
  const k = Math.min(3, Math.floor((sec - T.photos) / 0.85));
  const local = sec - T.photos - k * 0.85;
  if (k >= 3) return null; // the 4th photo is the mosaic's focus tile
  return (
    <AbsoluteFill>
      <Img src={staticFile(`ascii/hero${k}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.06 - local * 0.05})`}} />
      <AbsoluteFill style={{background: '#fff', opacity: Math.max(0, 0.35 - local * 1.4)}} />
    </AbsoluteFill>
  );
};

const UrlOut: React.FC<{f: number}> = ({f}) => {
  const sec = f / FPS, t = sec - T.url;
  const lum = useMemo(() => textLum('hotcoin.com', 64, 500, SANS), []);
  const a = ease(f, s(T.url) - 2, s(T.url) + 10);
  const shrink = interpolate(t, [0.8, 2.0], [1, 0.32], {...clamp, easing: INOUT});
  const toSym = sm(1.7, 2.3, t);
  const fade = 1 - ease(f, s(T.end - 0.7), s(T.end - 0.05), IN);
  const sf = symbolField(0.16, 1);
  return (
    <Glyphs cell={9} frame={f} field={(u, w, c, r) => {
      const x = (u - 0.5) / shrink + 0.5, y = (w - 0.5) / shrink + 0.5;
      const ix = Math.floor(x * LW), iy = Math.floor(y * LH);
      const tv = ix >= 0 && iy >= 0 && ix < LW && iy < LH ? lum[iy * LW + ix] : 0;
      const sc = sf(u, w, c, r) as Cell;
      return {v: (tv * (1 - toSym) + sc.v * toSym) * a * fade, lime: sc.lime && toSym > 0.5};
    }} />
  );
};

export const FeaturesFilm: React.FC = () => {
  const ready = useSources();
  const f = useCurrentFrame();
  const sec = f / FPS;
  const {durationInFrames} = useVideoConfig();
  const symScale = interpolate(sec, [0.2, T.futures], [0.18, 0.6], {...clamp, easing: OUT});
  const symA = ease(f, s(0.2), s(1.4)) * (1 - ease(f, s(T.futures) - 10, s(T.futures), IN));
  return (
    <AbsoluteFill style={{background: INK}}>
      {ready ? (
        <>
          {sec < T.futures ? <Glyphs cell={13} frame={f} field={symbolField(symScale, symA)} /> : null}
          {sec >= T.futures && sec < T.tradfi ? <Candles f={f} /> : null}
          {sec >= T.tradfi && sec < T.copy ? <Tickers f={f} /> : null}
          {sec >= T.copy && sec < T.earn ? <Copy f={f} /> : null}
          {sec >= T.earn && sec < T.trio ? <Earn f={f} /> : null}
          {sec >= T.trio && sec < T.photos ? <Trio f={f} /> : null}
          {sec >= T.photos && sec < T.pull ? <Heroes f={f} /> : null}
          {sec >= T.pull && sec < T.url + 0.5 ? <Mosaic f={f} /> : null}
          {sec >= T.url - 0.2 ? <UrlOut f={f} /> : null}
        </>
      ) : null}
      <Caption f={f} from={T.futures} to={T.tradfi} no="01" kicker="SPOT & FUTURES" title="Trade crypto, up to 200x." sub="Spot, margin and futures on hundreds of coins" />
      <Caption f={f} from={T.tradfi} to={T.copy} no="02" kicker="TRADFI" title="Crypto, US stocks and metals." sub="One account, settled in USDT, from 10 USDT" />
      <Caption f={f} from={T.copy} to={T.earn} no="03" kicker="COPY TRADING" title="Follow top traders." sub="Copy their strategies in one tap" />
      <Caption f={f} from={T.earn} to={T.trio} no="04" kicker="HOTCOIN EARN" title="Put idle crypto to work." sub="Simple yield on the assets you hold" />
      {[0, 1, 2].map((i) => (
        <Caption key={i} f={f} from={T.trio + i * 1.4 - (i ? 0.3 : 0)} to={i < 2 ? T.trio + (i + 1) * 1.4 : T.photos} no={`0${5 + i}`} kicker={['BUY CRYPTO', 'P2P', 'WEB3 WALLET'][i]} title={TRIO_SUB[i]} />
      ))}
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.12}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)'}} />
      <Audio src={staticFile('ascii/music.mp3')} startFrom={s(9)} volume={(fr) => interpolate(fr, [0, 15, durationInFrames - 50, durationInFrames - 2], [0, 1, 1, 0], clamp)} />
      {[0, 1, 2].map((i) => <Sequence key={i} from={s(T.photos + i * 0.85)} durationInFrames={20} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.18} /></Sequence>)}
      <Sequence from={s(T.pull) - 30} durationInFrames={70} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.22} /></Sequence>
    </AbsoluteFill>
  );
};
