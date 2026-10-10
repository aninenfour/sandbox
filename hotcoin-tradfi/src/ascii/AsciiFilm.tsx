// "Hotcoin in characters": a character-art brand film after the CVC launch video (Ashton Chew, made with fframes).
// Every shape is drawn from monospace glyphs on a canvas (dense glyph = bright). Sound-led: one slow ambient build,
// almost no hits. Scenes: symbol -> a football falls into the booth crowd -> 2017 counts to 2026 -> a diagonal sweep
// dissolves glyphs into the real team photo -> official numbers -> booth photos tile into HOTCOIN -> hotcoin.com -> symbol.
// Numbers from hotcoin.com/en_US/about (Oct 2026). Music: "Red Lights Adhafera" (Mixkit). Photos: Hotcoin booth, TOKEN2049.
import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IN, INOUT, OUT, clamp, ease} from '../alt/kit';

export const ASCII_FPS = 30;
const s = (sec: number) => Math.round(sec * ASCII_FPS);
export type Opening = 'symbol' | 'ball' | 'noise';
// scene starts (s)
const T = {ball: 4.5, burst: 10.2, year: 11, sweep: 16.5, stats: 23, mosaic: 29.2, url: 32.8, end: 36};
export const ASCII_DURATION = s(T.end);

const INK = '#0B0E11', GLYPH = '#E9E8E1', LIME = '#B8F26A';
const RAMP = ' .:-+coe8$#@';
const MONO = '"JetBrains Mono", monospace', SANS = '"Inter Tight", sans-serif', DISPLAY = 'Unbounded, sans-serif';
const rnd = (n: number) => {const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};
const sm = (a: number, b: number, x: number) => {const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t);};

// ---------- luminance sources (sampled once, 480 x 270) ----------
const LW = 480, LH = 270;
type Lum = {v: Float32Array; g: Float32Array}; // brightness, "green" mask
const cache = new Map<string, Lum>();
const sample = (lum: Lum, x: number, y: number, key: 'v' | 'g' = 'v') => {
  const ix = Math.floor(x * LW), iy = Math.floor(y * LH);
  if (ix < 0 || iy < 0 || ix >= LW || iy >= LH) return 0;
  return lum[key][iy * LW + ix];
};
const loadLum = (src: string, fit: 'cover' | 'contain', box = 1, photo = false): Promise<Lum> => new Promise((res) => {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas'); c.width = LW; c.height = LH;
    const ctx = c.getContext('2d')!; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, LW, LH);
    const sc = fit === 'cover' ? Math.max(LW / img.width, LH / img.height) : Math.min(LW / img.width, LH / img.height) * box;
    const w = img.width * sc, h = img.height * sc;
    ctx.drawImage(img, (LW - w) / 2, (LH - h) / 2, w, h);
    const d = ctx.getImageData(0, 0, LW, LH).data, v = new Float32Array(LW * LH), g = new Float32Array(LW * LH);
    for (let i = 0; i < LW * LH; i++) {
      const r = d[i * 4], gg = d[i * 4 + 1], b = d[i * 4 + 2];
      v[i] = (0.2126 * r + 0.7152 * gg + 0.0722 * b) / 255;
      g[i] = gg > r + 40 && gg > b + 40 ? 1 : 0;
    }
    if (photo) {
      // people in dark clothes against a white booth: invert, then add edge strength so outlines carry the shapes
      const out = new Float32Array(LW * LH);
      for (let y = 1; y < LH - 1; y++) for (let x = 1; x < LW - 1; x++) {
        const i = y * LW + x;
        const gx = v[i + 1] - v[i - 1] + 0.5 * (v[i - LW + 1] - v[i - LW - 1] + v[i + LW + 1] - v[i + LW - 1]);
        const gy = v[i + LW] - v[i - LW] + 0.5 * (v[i + LW - 1] - v[i - LW - 1] + v[i + LW + 1] - v[i - LW + 1]);
        const e = Math.min(1, Math.hypot(gx, gy) * 2.2);
        out[i] = Math.min(1, 0.72 * Math.pow(1 - v[i], 1.6) + 0.55 * e);
      }
      res({v: out, g});
      return;
    }
    res({v, g});
  };
  img.src = src;
});
const SOURCES: Record<string, [string, 'cover' | 'contain', number, boolean?]> = {
  symbol: ['brand/symbol-official-white.png', 'contain', 0.5],
  crowd: ['ascii/crowd.jpg', 'cover', 1, true],
  team: ['ascii/team.jpg', 'cover', 1, true],
};
const useSources = () => {
  const [h] = useState(() => delayRender('ascii sources'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all([
      ...Object.entries(SOURCES).map(([k, [f, fit, box, photo]]) => (cache.has(k) ? null : loadLum(staticFile(f), fit, box, photo).then((l) => cache.set(k, l)))),
      ...['500 20px "JetBrains Mono"', '700 20px "JetBrains Mono"', '500 20px "Inter Tight"', '600 20px "Inter Tight"', '800 20px Unbounded'].map((f) => document.fonts.load(f)),
    ]).then(() => {setReady(true); continueRender(h);});
  }, [h]);
  return ready;
};

// text rasterised to a luminance field (per call; cheap at 480 x 270)
const textCanvas = document.createElement('canvas'); textCanvas.width = LW; textCanvas.height = LH;
const textLum = (text: string, px: number, weight = 800, family = DISPLAY, dx = 0): Float32Array => {
  const ctx = textCanvas.getContext('2d', {willReadFrequently: true})!;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, LW, LH);
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `${weight} ${px}px ${family}`;
  ctx.fillText(text, LW / 2 + dx, LH / 2 + px * 0.04);
  const d = ctx.getImageData(0, 0, LW, LH).data, v = new Float32Array(LW * LH);
  for (let i = 0; i < LW * LH; i++) v[i] = d[i * 4] / 255;
  return v;
};

// ---------- the glyph layer ----------
type Cell = {v: number; lime?: boolean; a?: number};
type Field = (u: number, w: number, col: number, row: number) => Cell | number;
const Glyphs: React.FC<{cell: number; field: Field; frame: number; under?: (ctx: CanvasRenderingContext2D) => void; seedShift?: number}> = ({cell, field, frame, under, seedShift = 0}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const {width: W, height: H} = useVideoConfig();
  useLayoutEffect(() => {
    const ctx = ref.current!.getContext('2d')!;
    ctx.clearRect(0, 0, W, H);
    if (under) under(ctx);
    const cw = cell * 0.62, ch = cell;
    const cols = Math.ceil(W / cw), rows = Math.ceil(H / ch);
    ctx.font = `500 ${cell * 0.92}px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    // glyphs shimmer: the ramp index jitters a little every few frames
    const tick = Math.floor(frame / 3) + seedShift;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c + 0.5) * cw, y = (r + 0.5) * ch;
        const out = field(x / W, y / H, c, r);
        const cellv = typeof out === 'number' ? {v: out} : out;
        let v = cellv.v;
        if (v < 0.06) continue;
        v = Math.min(1, v + (rnd(c * 31 + r * 17 + tick) - 0.5) * 0.12);
        const ch_ = RAMP[Math.max(1, Math.min(RAMP.length - 1, Math.round(v * (RAMP.length - 1))))];
        ctx.globalAlpha = (cellv.a ?? 1) * (0.28 + 0.72 * v);
        ctx.fillStyle = cellv.lime ? LIME : GLYPH;
        ctx.fillText(ch_, x, y);
      }
    }
    ctx.globalAlpha = 1;
  });
  return <canvas ref={ref} width={W} height={H} style={{position: 'absolute', inset: 0}} />;
};

// ---------- scenes ----------
const symbolField = (scale: number, alpha = 1, cx = 0.5, cy = 0.5): Field => (u, w) => {
  const sym = cache.get('symbol')!;
  // symbol occupies the centre (contain, 0.5 box): rescale around (cx, cy)
  const x = (u - cx) / scale + 0.5, y = (w - cy) / scale + 0.5;
  const v = sample(sym, x, y);
  return {v: v * alpha, lime: sample(sym, x, y, 'g') > 0.5};
};

const Football = (u: number, w: number, bx: number, by: number, R: number, rot: number) => {
  const W = 1920, H = 1080;
  const dx = (u * W - bx) / R, dy = (w * H - by) / R, d2 = dx * dx + dy * dy;
  if (d2 > 1) return 0;
  const z = Math.sqrt(1 - d2);
  const shade = 0.35 + 0.65 * Math.max(0, -0.45 * dx - 0.55 * dy + 0.7 * z);
  // pentagon patches: nearest of a few rotating points on the sphere
  let pat = 1;
  for (let k = 0; k < 7; k++) {
    const a = k * 2.399 + rot, b = (k / 7 - 0.5) * 2.2;
    const px = Math.cos(a) * Math.cos(b), py = Math.sin(b), pz = Math.sin(a) * Math.cos(b);
    const dd = (dx - px) ** 2 + (dy - py) ** 2 + (z - pz) ** 2;
    if (pz > -0.2 && dd < 0.11) pat = 0.25;
  }
  return Math.min(1, shade * pat + 0.08);
};

const Opening: React.FC<{f: number; open: Opening}> = ({f, open}) => {
  const sec = f / ASCII_FPS;
  if (open === 'symbol') {
    const sc = interpolate(sec, [0.3, 4.5], [0.18, 0.62], {...clamp, easing: OUT}), a = ease(f, s(0.3), s(1.6));
    const out = ease(f, s(T.ball) - 12, s(T.ball), IN);
    return <Glyphs cell={13} frame={f} field={symbolField(sc * (1 + out * 0.5), a * (1 - out))} />;
  }
  if (open === 'noise') {
    // random glyph rain condenses into the symbol
    const k = sm(0.6, 3.6, sec), out = ease(f, s(T.ball) - 12, s(T.ball), IN);
    const sf = symbolField(0.5);
    return <Glyphs cell={13} frame={f} field={(u, w, c, r) => {
      const t = sf(u, w, c, r) as Cell;
      const noise = rnd(c * 13 + r * 7 + Math.floor(f / 2)) > 0.86 ? 0.3 + 0.4 * rnd(c + r * 3 + f) : 0;
      return {v: (noise * (1 - k) + t.v * k) * (1 - out) * ease(f, 0, s(0.8)), lime: t.lime && k > 0.6};
    }} />;
  }
  return null;
};

const BallIntoCrowd: React.FC<{f: number; start: number}> = ({f, start}) => {
  const sec = f / ASCII_FPS, t = sec - start, dur = T.burst - start;
  const crowd = cache.get('crowd')!;
  const p = Math.max(0, Math.min(1, t / (dur - 0.6)));
  // the ball comes from above and recedes into the crowd (perspective: shrinks as it travels)
  const by = interpolate(p, [0, 0.42, 1], [-260, 470, 720], {...clamp, easing: INOUT});
  const R = interpolate(p, [0, 0.42, 1], [240, 200, 34], {...clamp, easing: INOUT});
  const horizon = interpolate(t, [1.2, dur * 0.75], [1.02, 0.58], {...clamp, easing: OUT});
  const burst = ease(f, s(T.burst) - 6, s(T.year) - 2, IN);
  return (
    <Glyphs cell={12} frame={f} field={(u, w) => {
      const b = Football(u, w, 960, by, R, t * 2.4);
      // the ball sits in front of the crowd: a dark rim, then the ball itself
      const dr = Math.hypot(u * 1920 - 960, w * 1080 - by);
      if (b > 0) return {v: b};
      if (dr < R + 14) return 0;
      let c = 0;
      if (w > horizon - burst * 0.9) {
        const fade = sm(horizon - burst * 0.9, horizon - burst * 0.9 + 0.08, w);
        c = sample(crowd, u, w) * fade * (0.85 + burst * 0.6);
        if (c > 0.3 && sample(crowd, u, w, 'g') > 0.5) return {v: c, lime: true};
      }
      // the burst: a bright wave climbs the screen just before the cut
      const wave = burst > 0 ? sm(0.12, 0, Math.abs(w - (1 - burst * 1.1))) * 0.9 : 0;
      return {v: Math.max(b, c, wave * (0.4 + 0.6 * rnd(Math.floor(u * 200) + Math.floor(w * 100) * 7 + f)))};
    }} />
  );
};

const YearCount: React.FC<{f: number}> = ({f}) => {
  const sec = f / ASCII_FPS, t = sec - T.year;
  const year = Math.round(interpolate(t, [0.6, 3.4], [2017, 2026], {...clamp, easing: INOUT}));
  const txt = t < 3.9 ? String(year) : '9 YEARS';
  const lum = useMemo(() => textLum(txt, txt.length > 4 ? 92 : 132), [txt]);
  const zoom = interpolate(t, [0, T.sweep - T.year], [1.06, 0.96]);
  const a = ease(f, s(T.year), s(T.year) + 8) * (1 - ease(f, s(T.sweep) - 10, s(T.sweep), IN));
  return (
    <>
      <Glyphs cell={11} frame={f} field={(u, w) => {
        const x = (u - 0.5) / zoom + 0.5, y = (w - 0.5) / zoom + 0.5;
        const ix = Math.floor(x * LW), iy = Math.floor(y * LH);
        const v = ix >= 0 && iy >= 0 && ix < LW && iy < LH ? lum[iy * LW + ix] : 0;
        return {v: v * a, lime: txt.length > 4 && v > 0.5 && u > 0.5 + 0.14};
      }} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 30, color: GLYPH, opacity: ease(f, s(T.year + 4.1), s(T.year + 4.6)) * a, letterSpacing: 0.5}}>
        since 2017. one green line.
      </div>
    </>
  );
};

// diagonal sweep: glyphs of the team photo ahead of the front, the real photo behind it, lime residue at the edge
const PhotoSweep: React.FC<{f: number}> = ({f}) => {
  const sec = f / ASCII_FPS, t = sec - T.sweep;
  const team = cache.get('team')!;
  const front = interpolate(t, [1.4, 4.2], [-0.35, 1.45], {...clamp, easing: INOUT}); // in (u + w*0.6) space
  const out = ease(f, s(T.stats) - 12, s(T.stats), IN);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [h] = useState(() => delayRender('team photo'));
  useEffect(() => {const i = new Image(); i.onload = () => {setImg(i); continueRender(h);}; i.src = staticFile('ascii/team.jpg');}, [h]);
  const lift = ease(f, s(T.sweep), s(T.sweep + 1.2));
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <Glyphs cell={12} frame={f} under={(ctx) => {
        if (!img) return;
        // the photo, revealed behind the front with a soft diagonal mask
        ctx.save();
        ctx.beginPath();
        const k = 0.6, W = 1920, H = 1080;
        // region where u + k*w < front  ->  polygon
        const x0 = (front) * W, x1 = (front - k) * W; // at w=0 and w=1
        ctx.moveTo(-10, -10); ctx.lineTo(x0, -10); ctx.lineTo(x1, H + 10); ctx.lineTo(-10, H + 10); ctx.closePath(); ctx.clip();
        ctx.filter = 'contrast(1.05) saturate(1.05)';
        const z = interpolate(t, [0, T.stats - T.sweep], [1.08, 1.0]);
        ctx.drawImage(img, W / 2 - (W * z) / 2, H / 2 - (H * z) / 2, W * z, H * z);
        ctx.restore();
      }} field={(u, w) => {
        const d = u + 0.6 * w - front; // >0 ahead of the front
        const v = sample(team, u, w);
        if (d > 0) return {v: v * lift * (0.6 + 0.6 * sm(0.25, 0, d)), lime: d < 0.05};
        // behind the front: residue fades out
        const res = sm(-0.18, 0, d);
        return {v: v * res, lime: true, a: res};
      }} />
      <div style={{position: 'absolute', left: 120, bottom: 120, fontFamily: SANS, fontWeight: 600, fontSize: 64, color: '#fff', letterSpacing: -1.5, textShadow: '0 4px 30px rgba(0,0,0,0.6)', opacity: ease(f, s(T.sweep + 4.3), s(T.sweep + 5)), transform: `translateY(${(1 - ease(f, s(T.sweep + 4.3), s(T.sweep + 5), OUT)) * 20}px)`}}>
        Built for traders.
      </div>
    </AbsoluteFill>
  );
};

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const Stats: React.FC<{f: number}> = ({f}) => {
  const sec = f / ASCII_FPS, t = sec - T.stats;
  const n = interpolate(t, [0.3, 3.2], [7_950_000, 8_100_000], {...clamp, easing: OUT});
  const a = ease(f, s(T.stats), s(T.stats) + 10) * (1 - ease(f, s(T.mosaic) - 10, s(T.mosaic), IN));
  const plus = ease(f, s(T.stats + 3.2), s(T.stats + 3.5));
  const chips: [string, string][] = [['300+', 'spot pairs'], ['500+', 'futures pairs'], ['$137M+', 'in reserves']];
  return (
    <AbsoluteFill style={{opacity: a, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <Glyphs cell={12} frame={f} field={(u, w, c, r) => ({v: rnd(c * 7 + r * 13) > 0.985 ? 0.25 : 0})} />
      <div style={{fontFamily: SANS, fontSize: 30, color: '#9AA09B', letterSpacing: 0.5, marginBottom: 8}}>Over</div>
      <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 150, color: '#fff', letterSpacing: -4, textShadow: '0 0 40px rgba(255,255,255,0.35)', fontVariantNumeric: 'tabular-nums'}}>
        {fmt(n)}<span style={{color: LIME, opacity: plus, textShadow: `0 0 30px ${LIME}`}}>+</span>
      </div>
      <div style={{fontFamily: SANS, fontSize: 32, color: '#C9CCC6', marginTop: 10}}>registered traders in 120+ countries and regions</div>
      <div style={{display: 'flex', gap: 22, marginTop: 70}}>
        {chips.map(([v, l], i) => {
          const p = ease(f, s(T.stats + 3.4 + i * 0.25), s(T.stats + 3.9 + i * 0.25), OUT);
          return (
            <div key={l} style={{opacity: p, transform: `translateY(${(1 - p) * 18}px)`, border: '1px solid #2A3038', background: 'rgba(20,24,29,0.9)', borderRadius: 14, padding: '16px 28px', display: 'flex', alignItems: 'baseline', gap: 12}}>
              <span style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: LIME}}>{v}</span>
              <span style={{fontFamily: SANS, fontSize: 26, color: '#C9CCC6'}}>{l}</span>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', bottom: 60, fontFamily: MONO, fontSize: 16, color: '#5F666E', letterSpacing: 1}}>source: hotcoin.com, Oct 2026</div>
    </AbsoluteFill>
  );
};

// booth photos tile into the word HOTCOIN, camera pulls back
const MCOLS = 76, MROWS = 16, TW = 1880 / MCOLS, TH = TW * 0.75;
const Mosaic: React.FC<{f: number}> = ({f}) => {
  const sec = f / ASCII_FPS, t = sec - T.mosaic;
  const cells = useMemo(() => {
    const c = document.createElement('canvas'); c.width = MCOLS; c.height = MROWS;
    const ctx = c.getContext('2d')!; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, MCOLS, MROWS);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `800 ${MROWS}px ${DISPLAY}`;
    const fit = Math.min(MROWS * 1.15, (MCOLS - 3) / ctx.measureText('HOTCOIN').width * MROWS); ctx.font = `800 ${fit}px ${DISPLAY}`;
    ctx.fillText('HOTCOIN', MCOLS / 2, MROWS / 2 + 0.6);
    const d = ctx.getImageData(0, 0, MCOLS, MROWS).data, out: {c: number; r: number; k: number}[] = [];
    for (let r = 0; r < MROWS; r++) for (let cc = 0; cc < MCOLS; cc++) if (d[(r * MCOLS + cc) * 4] > 110) out.push({c: cc, r, k: out.length});
    return out;
  }, []);
  const zoom = interpolate(t, [0, 3.0], [3.2, 1], {...clamp, easing: INOUT});
  const out = ease(f, s(T.url) - 8, s(T.url) + 4, IN);
  const oy = (1080 - MROWS * TH) / 2;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 50%'}}>
        {cells.map(({c, r, k}) => {
          const d = Math.hypot(c - MCOLS / 2, (r - MROWS / 2) * 2) / MCOLS; // centre first
          const st = s(T.mosaic) + d * 40 + rnd(k) * 10;
          const p = f < st ? 0 : Math.min(1, (f - st) / 9);
          return (
            <Img key={k} src={staticFile(`ascii/tiles/${String((k * 7) % 40).padStart(2, '0')}.jpg`)}
              style={{position: 'absolute', left: 20 + c * TW + 1, top: oy + r * TH + 1, width: TW - 2, height: TH - 2, objectFit: 'cover', opacity: p, transform: `scale(${0.6 + 0.4 * OUT(p)})`, borderRadius: 1}} />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const UrlOut: React.FC<{f: number}> = ({f}) => {
  const sec = f / ASCII_FPS, t = sec - T.url;
  const lum = useMemo(() => textLum('hotcoin.com', 64, 500, SANS), []);
  const a = ease(f, s(T.url) - 4, s(T.url) + 8);
  const shrink = interpolate(t, [0.6, 2.0], [1, 0.32], {...clamp, easing: INOUT}); // the url shrinks...
  const toSym = sm(1.6, 2.3, t); // ...and becomes the symbol
  const fade = 1 - ease(f, s(T.end - 0.9), s(T.end - 0.1), IN);
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

export const AsciiFilm: React.FC<{open?: Opening; previewEnd?: number}> = ({open = 'symbol'}) => {
  const ready = useSources();
  const f = useCurrentFrame();
  const sec = f / ASCII_FPS;
  const ballStart = open === 'ball' ? 0.4 : T.ball;
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: INK}}>
      {ready ? (
        <>
          {sec < T.ball ? <Opening f={f} open={open} /> : null}
          {sec >= ballStart && sec < T.year ? <BallIntoCrowd f={f} start={ballStart} /> : null}
          {sec >= T.year && sec < T.sweep ? <YearCount f={f} /> : null}
          {sec >= T.sweep && sec < T.stats ? <PhotoSweep f={f} /> : null}
          {sec >= T.stats && sec < T.mosaic ? <Stats f={f} /> : null}
          {sec >= T.mosaic && sec < T.url + 0.2 ? <Mosaic f={f} /> : null}
          {sec >= T.url - 0.2 ? <UrlOut f={f} /> : null}
        </>
      ) : null}
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.12}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
      {/* sound-led: one ambient build (track's own slow rise), a swell into the mosaic, a soft landing on the symbol */}
      <Audio src={staticFile('ascii/music.mp3')} startFrom={s(9)} volume={(fr) => interpolate(fr, [0, 15, durationInFrames - 50, durationInFrames - 2], [0, 1, 1, 0], clamp)} />
      <Sequence from={s(T.mosaic) - 40} durationInFrames={70} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.22} /></Sequence>
      <Sequence from={s(T.sweep + 1.2)} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.12} /></Sequence>
    </AbsoluteFill>
  );
};
