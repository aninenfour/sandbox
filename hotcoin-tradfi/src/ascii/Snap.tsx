// "Hotcoin in characters: snap cut". Fast, beat-locked features promo in glyph art (engine in AsciiFilm.tsx).
// Music "New Bass 02" (Mixkit), 156.6 BPM; scenes change on the half-time beat H = 0.766 s and the drop lands on the
// symbol slam. Ends on booth photos flashing, then pulling back into a mosaic that forms the Hotcoin logo.
import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IN, INOUT, OUT, clamp} from '../alt/kit';
import {Cell, Glyphs, LH, LW, rnd, sm, symbolField, textLum, useSources} from './AsciiFilm';

export const SNAP_FPS = 60;
const H = 60 / 78.3; // half-time beat (s)
const DROP_IN_TRACK = 16.399; // first bass hit after the intro
const sb = (beats: number) => beats * H;
// scene starts in beats
const B = {drop: 4, futures: 4, tradfi: 7, copy: 10, earn: 13, trio: 16, photos: 19, pull: 21, logo: 24, end: 27};
export const SNAP_DURATION = Math.round(sb(B.end) * SNAP_FPS);
const INK = '#0B0E11', LIME = '#B8F26A';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace', DISPLAY = 'Unbounded, sans-serif';

// beat helpers: progress inside the current beat, and a decaying "kick" at each beat
const beatPhase = (t: number, div = 1) => {const b = t / (H / div); return b - Math.floor(b);};
const kick = (t: number, div = 1) => Math.exp(-beatPhase(t, div) * 7);

// big kinetic caption, words rise in a mask one after another
const Caption: React.FC<{t: number; at: number; until: number; kicker: string; title: string}> = ({t, at, until, kicker, title}) => {
  const local = t - sb(at), left = sb(until) - t;
  if (local < 0 || left < 0) return null;
  const outP = sm(0.16, 0, left);
  return (
    <div style={{position: 'absolute', left: 110, bottom: 96}}>
      <div style={{overflow: 'hidden'}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: LIME, transform: `translateY(${(1 - OUT(Math.min(1, local / 0.18))) * 100 + outP * -100}%)`}}>{kicker}</div>
      </div>
      <div style={{display: 'flex', gap: 22, marginTop: 8}}>
        {title.split(' ').map((w, i) => {
          const p = OUT(Math.max(0, Math.min(1, (local - 0.05 - i * 0.05) / 0.22)));
          return (
            <div key={i} style={{overflow: 'hidden', paddingBottom: 6}}>
              <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 70, letterSpacing: -2, color: '#fff', transform: `translateY(${(1 - p) * 110 + outP * -110}%)`}}>{w}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// a scanline wipe that hides each cut
const Wipe: React.FC<{t: number}> = ({t}) => {
  const cuts = [B.futures, B.tradfi, B.copy, B.earn, B.trio, B.photos].map(sb);
  const c = cuts.find((x) => t > x - 0.12 && t < x + 0.14);
  if (c === undefined) return null;
  const p = (t - (c - 0.12)) / 0.26;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 0, bottom: 0, left: `${p * 130 - 20}%`, width: '14%', background: `linear-gradient(90deg, rgba(184,242,106,0), ${LIME} 50%, rgba(184,242,106,0))`, opacity: 0.85, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

const Candles: React.FC<{f: number; t: number}> = ({f, t}) => {
  const local = t - sb(B.futures);
  const N = 18;
  const bars = useMemo(() => {
    let p = 0; const raw: {o: number; c: number; h: number; l: number}[] = [];
    for (let i = 0; i < N; i++) {
      const o = p, c = p + 0.4 + (rnd(i * 3 + 7) - 0.42) * 2.2;
      raw.push({o, c, h: Math.max(o, c) + 0.15 + rnd(i + 40) * 0.5, l: Math.min(o, c) - 0.15 - rnd(i + 80) * 0.5}); p = c;
    }
    const lo = Math.min(...raw.map((b) => b.l)), hi = Math.max(...raw.map((b) => b.h)), n = (v: number) => 0.04 + ((v - lo) / (hi - lo)) * 0.92;
    return raw.map((b) => ({o: n(b.o), c: n(b.c), h: n(b.h), l: n(b.l)}));
  }, []);
  const shown = (local / 0.9) * N; // the whole chart in under a second
  const x0 = 0.08, x1 = 0.92, y0 = 0.06, y1 = 0.66;
  return (
    <Glyphs cell={12} frame={f} field={(u, w) => {
      if (u < x0 || u > x1 || w < y0 || w > y1) return 0;
      const fx = ((u - x0) / (x1 - x0)) * N, i = Math.floor(fx), within = fx - i;
      if (i >= shown) return 0;
      const b = bars[i], up = b.c >= b.o, val = 1 - (w - y0) / (y1 - y0), grow = OUT(Math.min(1, shown - i));
      const top = Math.max(b.o, b.c), bot = Math.min(b.o, b.c), mid = bot + (top - bot) * grow;
      if (within > 0.16 && within < 0.84 && val >= bot - 0.004 && val <= Math.max(mid, bot + 0.01)) return {v: 0.98, lime: up};
      if (within > 0.45 && within < 0.55 && val >= b.l && val <= bot + (b.h - bot) * grow) return {v: 0.6, lime: up};
      return 0;
    }} />
  );
};

const Words: React.FC<{f: number; t: number; at: number; words: string[]; limeLast?: boolean}> = ({f, t, at, words, limeLast}) => {
  const lums = useMemo(() => words.map((w) => textLum(w, w.length > 3 ? 118 : 160)), [words.join()]);
  const local = Math.max(0, t - sb(at));
  const k = Math.min(words.length - 1, Math.floor(local / H));
  const into = local - k * H;
  const scr = k > 0 ? sm(0.14, 0, into) : sm(0.16, 0, into); // a quick glyph scramble on each change
  const z = 1 + 0.08 * Math.exp(-into * 9); // zoom punch on the beat
  return (
    <Glyphs cell={11} frame={f} seedShift={k * 53} field={(u, w, c, r) => {
      const x = (u - 0.5) / z + 0.5, y = (w - 0.36) / z + 0.5;
      const ix = Math.floor(x * LW), iy = Math.floor(y * LH);
      const v = ix >= 0 && iy >= 0 && ix < LW && iy < LH ? lums[k][iy * LW + ix] : 0;
      const n = scr > 0 && w < 0.66 && rnd(c * 17 + r * 3 + f) < scr * 0.35 ? 0.55 : 0;
      return {v: Math.max(v * (1 - scr * 0.6), n), lime: !!limeLast && k === words.length - 1 && v > 0.4};
    }} />
  );
};

const Copy: React.FC<{f: number; t: number}> = ({f, t}) => {
  const local = t - sb(B.copy);
  const lead = (x: number) => 0.52 - 0.26 * x - 0.07 * Math.sin(x * 9) - 0.03 * Math.sin(x * 23 + 1);
  const reveal = OUT(Math.min(1, local / 0.8)), lock = sm(H * 1.0, H * 1.6, local);
  const followers = [0.18, -0.14, 0.26, -0.22, 0.1, -0.06];
  return (
    <Glyphs cell={11} frame={f} field={(u, w) => {
      const x = (u - 0.06) / 0.88;
      if (x < 0 || x > reveal || w > 0.7) return 0;
      if (Math.abs(w - lead(x)) < 0.017) return {v: 1, lime: true};
      let best = 0;
      followers.forEach((off, i) => {
        const fy = lead(Math.max(0, x - 0.025 * (i + 1))) + off * (1 - lock) * (0.4 + x) + 0.012 * Math.sin(x * 40 + i);
        if (Math.abs(w - fy) < 0.008) best = Math.max(best, 0.6 - i * 0.04);
      });
      return best;
    }} />
  );
};

const Earn: React.FC<{f: number; t: number}> = ({f, t}) => {
  const local = t - sb(B.earn), N = 12;
  return (
    <Glyphs cell={12} frame={f} field={(u, w) => {
      const x0 = 0.16, x1 = 0.84, base = 0.68;
      if (u < x0 || u > x1 || w > base) return 0;
      const fx = ((u - x0) / (x1 - x0)) * N, i = Math.floor(fx), within = fx - i;
      if (within < 0.14 || within > 0.86) return 0;
      const grow = OUT(sm(i * 0.07, i * 0.07 + 0.22, local)); // one column every 1/16 note-ish
      const top = base - 0.075 * Math.pow(1.2, i) * grow;
      if (w < top) return 0;
      return {v: 0.6 + 0.4 * (1 - (w - top) / 0.6), lime: i >= N - 3};
    }} />
  );
};

const Intro: React.FC<{f: number; t: number}> = ({f, t}) => {
  // sparks converge into the symbol, it breathes on the beat, then slams at the drop and bursts
  const conv = OUT(sm(0.2, 1.6, t));
  const slam = t > sb(B.drop) - 0.25 ? sm(sb(B.drop) - 0.25, sb(B.drop), t) : 0;
  const breathe = 1 + 0.03 * kick(t) * (t > 1.6 ? 1 : 0);
  const scale = (0.5 + 0.06 * conv) * breathe * (1 + slam * 2.8);
  const sf = symbolField(scale, 1 - slam);
  return (
    <Glyphs cell={12} frame={f} field={(u, w, c, r) => {
      const s_ = sf(u, w, c, r) as Cell;
      const spark = rnd(c * 13 + r * 7 + Math.floor(f / 2)) > 0.94 ? 0.35 + 0.5 * rnd(c + r * 3 + f) : 0;
      return {v: Math.max(s_.v * conv, spark * (1 - conv) * Math.min(1, t / 0.3)), lime: s_.lime};
    }} />
  );
};

// photos flash on the hats, then the last one pulls back into the logo mosaic
const MC = 64;
const Photos: React.FC<{t: number}> = ({t}) => {
  const local = t - sb(B.photos), step = H / 2;
  const k = Math.min(3, Math.floor(local / step)), into = local - k * step;
  return (
    <AbsoluteFill>
      <Img src={staticFile(`ascii/hero${k}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.12 - 0.1 * OUT(Math.min(1, into / step))})`}} />
      <AbsoluteFill style={{background: '#fff', opacity: Math.max(0, 0.45 - into * 3)}} />
    </AbsoluteFill>
  );
};
const Mosaic: React.FC<{f: number; t: number}> = ({f, t}) => {
  const [grid, setGrid] = useState<{cells: {c: number; r: number; k: number}[]; rows: number} | null>(null);
  const [h] = useState(() => delayRender('logo grid'));
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const rows = Math.round(((MC * img.height) / img.width) * (4 / 3)) + 2;
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
  const focus = grid.cells.reduce((b, x) => (Math.abs(x.c - MC * 0.55) + Math.abs(x.r - grid.rows / 2) < Math.abs(b.c - MC * 0.55) + Math.abs(b.r - grid.rows / 2) ? x : b));
  const fx = ox + focus.c * TW + TW / 2, fy = oy + focus.r * TH + TH / 2;
  const local = t - sb(B.pull);
  const p = INOUT(Math.min(1, Math.max(0, local / sb(B.logo - B.pull))));
  const z = Math.exp(Math.log(1920 / TW) * (1 - p));
  const cx = fx + (960 - fx) * p, cy = fy + (540 - fy) * p;
  const hold = t - sb(B.logo);
  const punch = hold > 0 ? 1 + 0.025 * kick(hold) : 1;
  const scan = hold > 0 ? (hold % (H * 2)) / (H * 2) : -1; // a lime light passes across the logo
  const fadeEnd = sm(sb(B.end) - 0.35, sb(B.end), t);
  return (
    <AbsoluteFill style={{opacity: 1 - fadeEnd}}>
      <AbsoluteFill style={{transform: `translate(${960 - cx}px, ${540 - cy}px) scale(${z * punch})`, transformOrigin: `${cx}px ${cy}px`}}>
        {grid.cells.map(({c, r, k}) => {
          const isFocus = k === focus.k;
          const d = Math.hypot(c - focus.c, (r - focus.r) * 1.5) / MC;
          const st = sb(B.pull) + 0.1 + d * 1.6 + rnd(k) * 0.25;
          const vis = isFocus ? 1 : Math.max(0, Math.min(1, (t - st) / 0.15));
          const lit = scan >= 0 ? Math.max(0, 1 - Math.abs(c / MC - scan) * 9) : 0;
          return (
            <div key={k} style={{position: 'absolute', left: ox + c * TW + 0.5, top: oy + r * TH + 0.5, width: TW - 1, height: TH - 1, opacity: vis}}>
              <Img src={staticFile(isFocus ? 'ascii/hero3.jpg' : `ascii/tiles/${String((k * 7) % 40).padStart(2, '0')}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              {lit > 0 ? <div style={{position: 'absolute', inset: 0, background: LIME, opacity: lit * 0.75, mixBlendMode: 'screen'}} /> : null}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SnapFilm: React.FC = () => {
  const ready = useSources();
  const f = useCurrentFrame();
  const t = f / SNAP_FPS;
  const {durationInFrames} = useVideoConfig();
  const inScene = (a: number, b: number) => t >= sb(a) && t < sb(b);
  // continuous push + a small punch on every beat after the drop
  const push = t > sb(B.drop) && t < sb(B.photos) ? 1 + 0.035 * kick(t - sb(B.drop)) : 1;
  return (
    <AbsoluteFill style={{background: INK}}>
      {ready ? (
        <AbsoluteFill style={{transform: `scale(${push})`}}>
          {inScene(0, B.futures) ? <Intro f={f} t={t} /> : null}
          {inScene(B.futures, B.tradfi) ? <Candles f={f} t={t} /> : null}
          {inScene(B.tradfi, B.copy) ? <Words f={f} t={t} at={B.tradfi} words={['BTC', 'TSLA', 'GOLD']} limeLast /> : null}
          {inScene(B.copy, B.earn) ? <Copy f={f} t={t} /> : null}
          {inScene(B.earn, B.trio) ? <Earn f={f} t={t} /> : null}
          {inScene(B.trio, B.photos) ? <Words f={f} t={t} at={B.trio} words={['BUY', 'P2P', 'WEB3']} limeLast /> : null}
        </AbsoluteFill>
      ) : null}
      {ready && inScene(B.photos, B.pull) ? <Photos t={t} /> : null}
      {ready && t >= sb(B.pull) ? <Mosaic f={f} t={t} /> : null}
      <Caption t={t} at={B.futures} until={B.tradfi} kicker="01 / SPOT & FUTURES" title="Up to 200x." />
      <Caption t={t} at={B.tradfi} until={B.copy} kicker="02 / TRADFI" title="Crypto, stocks, metals." />
      <Caption t={t} at={B.copy} until={B.earn} kicker="03 / COPY TRADING" title="Follow the best." />
      <Caption t={t} at={B.earn} until={B.trio} kicker="04 / HOTCOIN EARN" title="Make it work." />
      <Caption t={t} at={B.trio} until={B.photos} kicker="05 / BUY · P2P · WEB3" title="All in one app." />
      <Wipe t={t} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.12}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.45) 100%)'}} />
      <Audio src={staticFile('ascii/bass.mp3')} startFrom={Math.round((DROP_IN_TRACK - sb(B.drop)) * SNAP_FPS)} volume={(fr) => interpolate(fr, [0, 6, durationInFrames - 24, durationInFrames - 1], [0, 1, 1, 0], clamp)} />
      <Sequence from={Math.round((sb(B.drop) - 0.9) * SNAP_FPS)} durationInFrames={70} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.3} /></Sequence>
      {[0, 1, 2, 3].map((i) => <Sequence key={i} from={Math.round((sb(B.photos) + (i * H) / 2) * SNAP_FPS)} durationInFrames={20} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.22} /></Sequence>)}
    </AbsoluteFill>
  );
};
