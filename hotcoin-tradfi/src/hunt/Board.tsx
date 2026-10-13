// Investigation-board test for the Hunt brothers trailer: one continuous camera move, no cuts, ~10 s at 30 fps.
// Every piece of evidence is pinned to one wall; the camera glides between them along red string that draws as it travels.
// Same facts, footage and voiceover as HuntTrailer.tsx (first four lines).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {AnimatedGrain, clamp} from '../alt/kit';
import US from './usmap.json';

const FPS = 30;
const RED = '#D42A2F', INK = '#15130F', PAPER = '#EFE9DA', MANILA = '#D8C7A0';
const ANTON = 'Anton, Impact, sans-serif', MONO = '"IBM Plex Mono", monospace', SANS = '"Inter Tight", sans-serif', MARKER = 'HuntMarker, cursive';

const VO: [string, number, string][] = [
  ['jan', 1.899, 'January, 1980.'],
  ['fifty', 2.432, 'Silver just hit $50 an ounce.'],
  ['six', 1.6, 'A year ago, it was $6.'],
  ['behind', 2.283, 'Behind it? Two brothers from Texas.'],
];
const T: Record<string, {s: number; e: number}> = {};
{ let t = 0; for (const [id, d] of VO) { t += id === 'jan' ? 0.6 : 0.22; T[id] = {s: t, e: t + d}; t += d; } }
export const BOARD_FPS = FPS;
export const BOARD_DURATION = Math.round((T.behind.e + 0.9) * FPS);

const sp = (f: number, damping = 16, stiffness = 140) => spring({frame: f, fps: FPS, config: {damping, stiffness}});
const lin = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], clamp);
const EASE = Easing.bezier(0.65, 0, 0.35, 1);
const s2f = (s: number) => s * FPS;

const useFonts = () => {
  const [h] = useState(() => delayRender('board fonts'));
  useEffect(() => {
    const face = new FontFace('HuntMarker', `url(${staticFile('hunt/fonts/marker.woff2')})`);
    face.load().then((ff) => { document.fonts.add(ff); return Promise.all(['400 100px Anton', '500 30px "IBM Plex Mono"', '600 40px "Inter Tight"', '400 60px HuntMarker'].map((s) => document.fonts.load(s))); }).then(() => continueRender(h));
  }, [h]);
};

// ---------- the wall (world coordinates, px) ----------
const A = {x: 700, y: 820, w: 860, h: 645, tilt: -2.2};            // archive print: exchange clock board
const NOTE = {x: 620, y: 1290};                                      // typed date tag
const B = {x: 1720, y: 1760, w: 980, h: 1180, tilt: 1.4};           // price chart on graph paper
const C1 = {x: 1150, y: 2640, w: 820, h: 330, tilt: -2.5};          // name card 1
const C2 = {x: 1210, y: 2990, w: 820, h: 330, tilt: 1.8};           // name card 2
const TX = {x: 1170, y: 3520, w: 760, h: 600, tilt: 2.4};           // Texas map clipping
const PIN = {A: [A.x + 300, A.y - 300], B: [B.x - 380, B.y - 560], C1: [C1.x + 330, C1.y - 140], TX: [TX.x + 290, TX.y - 260]} as const;

// chart geometry inside B (local px, origin top-left of the paper)
const PRICES: [number, number][] = [[0, 6.1], [2, 6.9], [4, 7.6], [6, 8.6], [7.5, 9.6], [8.5, 13.5], [9.3, 16.8], [10.5, 17.4], [11.3, 22], [12, 34.45], [12.57, 49.5]];
const gx = (t: number) => 90 + (t / 13) * 800;
const gy = (v: number) => 1080 - (v / 55) * 760;
const chartPts = PRICES.map(([t, v]) => [gx(t), gy(v)] as [number, number]);
const toWorld = ([x, y]: [number, number]) => [B.x - B.w / 2 + x, B.y - B.h / 2 + y] as [number, number];
const SIX = toWorld(chartPts[0]), FIFTY = toWorld(chartPts[chartPts.length - 1]);

// ---------- camera: [time s, x, y, zoom, rotation deg]; holds drift, moves ease ----------
type Key = [number, number, number, number, number];
const CAM: Key[] = [
  [0, A.x + 40, A.y + 220, 1.22, -1.2],
  [T.jan.e - 0.1, A.x + 20, A.y + 200, 1.32, -0.6],
  [T.fifty.s + 0.9, B.x, B.y - 40, 0.92, 0.8],
  [T.six.s - 0.2, B.x + 40, B.y - 60, 0.98, 0.6],
  [T.six.s + 0.5, SIX[0] + 140, SIX[1] - 140, 1.75, -0.4],
  [T.behind.s - 0.05, SIX[0] + 160, SIX[1] - 150, 1.85, -0.6],
  [T.behind.s + 1.0, 1180, 2800, 1.02, 0.5],
  [T.behind.s + 1.35, 1185, 2815, 1.05, 0.6],
  [T.behind.s + 2.05, 1180, 3120, 0.86, 0.9],
  [T.behind.e + 0.9, 1180, 3140, 0.9, 1.0],
];
// segments between keys alternate drift (linear-ish) and move (eased); index of keys that START a move:
const MOVES = new Set([1, 3, 5, 7]);
const camAt = (t: number) => {
  let i = CAM.findIndex((k, j) => j + 1 < CAM.length && t >= k[0] && t < CAM[j + 1][0]);
  if (i < 0) i = t < CAM[0][0] ? 0 : CAM.length - 2;
  const [t0, ...a] = CAM[i], [t1, ...b] = CAM[i + 1];
  const p = interpolate(t, [t0, t1], [0, 1], {...clamp, easing: MOVES.has(i) ? EASE : Easing.bezier(0.3, 0.1, 0.7, 0.9)});
  // ease zoom in log space so pull-outs feel even
  const z = Math.exp(Math.log(a[2]) + (Math.log(b[2]) - Math.log(a[2])) * p);
  return {x: a[0] + (b[0] - a[0]) * p, y: a[1] + (b[1] - a[1]) * p, z, r: a[3] + (b[3] - a[3]) * p, moving: MOVES.has(i) && p > 0 && p < 1};
};

// ---------- pieces ----------
const Pin: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: 16, zIndex: 5,
    background: 'radial-gradient(circle at 35% 30%, #ff8a8a 0%, #d42a2f 45%, #6d0f12 100%)', boxShadow: '4px 8px 10px rgba(0,0,0,.55)'}} />
);
const Paper: React.FC<{x: number; y: number; w: number; h: number; tilt: number; bg?: string; pad?: number; children: React.ReactNode}> = ({x, y, w, h, tilt, bg = PAPER, pad = 0, children}) => (
  <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${tilt}deg)`, background: bg, padding: pad, boxSizing: 'border-box',
    boxShadow: '0 2px 0 rgba(0,0,0,.25), 18px 30px 50px rgba(0,0,0,.55)', overflow: 'hidden'}}>
    {children}
    <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '300px', mixBlendMode: 'multiply', opacity: 0.18, pointerEvents: 'none'}} />
  </div>
);

// Red string between two pins: sags a little and draws from `a` to `b` with progress p.
const String_: React.FC<{a: readonly [number, number]; b: readonly [number, number]; p: number}> = ({a, b, p}) => {
  if (p <= 0) return null;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.06;
  const d = `M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`;
  return (
    <g>
      <path d={d} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={9} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} transform="translate(8,14)" />
      <path d={d} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </g>
  );
};

const ringPath = (cx: number, cy: number, rx: number, ry: number) => {
  const p: string[] = [];
  for (let i = 0; i <= 30; i++) { const a = -0.5 + (i / 30) * (Math.PI * 2 + 0.7); const w = 1 + 0.05 * Math.sin(a * 3) + 0.03 * Math.cos(a * 5); p.push(`${i ? 'L' : 'M'}${(cx + Math.cos(a) * rx * w).toFixed(1)},${(cy + Math.sin(a) * ry * w).toFixed(1)}`); }
  return p.join(' ');
};

const Chart: React.FC<{f: number}> = ({f}) => {
  const drawFrom = s2f(T.fifty.s + 0.55), drawTo = s2f(T.fifty.e - 0.1);
  const p = 1 - Math.pow(1 - lin(f, drawFrom, drawTo), 2);
  const n = chartPts.length - 1, seg = p * n, k = Math.floor(seg), r = seg - k;
  const tip = k >= n ? chartPts[n] : [chartPts[k][0] + (chartPts[k + 1][0] - chartPts[k][0]) * r, chartPts[k][1] + (chartPts[k + 1][1] - chartPts[k][1]) * r];
  const shown = [...chartPts.slice(0, k + 1), tip];
  const price = ((1080 - tip[1]) / 760) * 55;
  const d = shown.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const ring50 = lin(f, drawTo, drawTo + 9), ring6 = lin(f, s2f(T.six.s + 0.25), s2f(T.six.s + 0.6));
  return (
    <Paper {...B} bg={PAPER}>
      <svg width={B.w} height={B.h} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 24}, (_, i) => <line key={'v' + i} x1={i * 45} x2={i * 45} y1={0} y2={B.h} stroke="rgba(60,90,120,.13)" strokeWidth={2} />)}
        {Array.from({length: 27}, (_, i) => <line key={'h' + i} y1={i * 45} y2={i * 45} x1={0} x2={B.w} stroke="rgba(60,90,120,.13)" strokeWidth={2} />)}
        {[10, 20, 30, 40, 50].map((v) => <text key={v} x={900} y={gy(v) + 8} fill="rgba(21,19,15,.55)" style={{font: `500 24px ${MONO}`}}>${v}</text>)}
        <text x={90} y={1130} fill="rgba(21,19,15,.6)" style={{font: `500 24px ${MONO}`, letterSpacing: 2}}>JAN 1979</text>
        <text x={gx(12) - 60} y={1130} fill="rgba(21,19,15,.6)" style={{font: `500 24px ${MONO}`, letterSpacing: 2}}>JAN 1980</text>
        <path d={d} fill="none" stroke={RED} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
        {ring50 > 0 && <path d={ringPath(...chartPts[n], 70, 54)} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring50} />}
        {ring50 > 0.6 && <text x={chartPts[n][0] - 260} y={chartPts[n][1] + 20} fill={INK} style={{font: `400 80px ${MARKER}`}}>$50</text>}
        {ring6 > 0 && <path d={ringPath(...chartPts[0], 56, 44)} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring6} />}
        {ring6 > 0.6 && <text x={chartPts[0][0] + 30} y={chartPts[0][1] - 70} fill={INK} style={{font: `400 76px ${MARKER}`}}>$6</text>}
      </svg>
      <div style={{position: 'absolute', left: 90, top: 70, font: `500 26px ${MONO}`, letterSpacing: 4, color: 'rgba(21,19,15,.7)'}}>SILVER · USD PER OUNCE</div>
      <div style={{position: 'absolute', left: 84, top: 110, font: `400 170px/1 ${ANTON}`, color: INK, fontVariantNumeric: 'tabular-nums', opacity: lin(f, drawFrom - 6, drawFrom)}}>${price.toFixed(2)}</div>
    </Paper>
  );
};

const NameCard: React.FC<{c: typeof C1; n: number; first: string; f: number; at: number}> = ({c, n, first, f, at}) => {
  const typed = Math.max(0, Math.floor((f - at) * 1.6));
  const full = `${first} HUNT`;
  return (
    <Paper {...c} bg={MANILA} pad={34}>
      <div style={{font: `500 24px ${MONO}`, letterSpacing: 4, color: '#5b4a2a'}}>SUBJECT {String(n).padStart(2, '0')} · DALLAS, TEXAS</div>
      <div style={{font: `400 100px/1.02 ${ANTON}`, color: INK, marginTop: 20, textTransform: 'uppercase', whiteSpace: 'pre-wrap'}}>
        {full.slice(0, typed).replace(' HUNT', '\nHUNT').split('\n').map((l, i) => <div key={i} style={{color: i ? RED : INK}}>{l}</div>)}
      </div>
    </Paper>
  );
};

const TexasClip: React.FC<{f: number; at: number}> = ({f, at}) => {
  const tx = US.states.find((s) => s.name === 'Texas')!;
  const [b0, b1] = [US.texasBounds[0], US.texasBounds[1]];
  const pad = 40, vb = `${b0[0] - pad - 160} ${b0[1] - pad - 70} ${b1[0] - b0[0] + pad * 2 + 260} ${b1[1] - b0[1] + pad * 2 + 120}`;
  const fill = sp(f - at, 14, 160);
  const ring = lin(f, at + 6, at + 18);
  const [cx, cy] = US.texasCentroid;
  return (
    <Paper {...TX} bg={PAPER}>
      <svg width={TX.w} height={TX.h} viewBox={vb} preserveAspectRatio="xMidYMid meet">
        {US.states.map((s) => <path key={s.name} d={s.d} fill="none" stroke="rgba(21,19,15,.35)" strokeWidth={1.4} />)}
        <path d={tx.d} fill={RED} fillOpacity={0.85 * fill} stroke={INK} strokeWidth={2.4} />
        {ring > 0 && <path d={ringPath(cx + 8, cy - 8, 165, 140)} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring} />}
      </svg>
      <div style={{position: 'absolute', right: 40, bottom: 30, font: `400 76px ${MARKER}`, color: INK, opacity: lin(f, at + 12, at + 18)}}>TEXAS</div>
    </Paper>
  );
};

export const HuntBoard: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const t = f / FPS;
  const cam = camAt(t);
  // string progress follows the camera's travel between pieces
  const sAB = lin(t, T.jan.e - 0.15, T.fifty.s + 0.85);
  const sBC = lin(t, T.behind.s - 0.05, T.behind.s + 1.0);
  const sCT = lin(t, T.behind.s + 1.35, T.behind.s + 2.0);
  const cardAt = s2f(T.behind.s + 0.7), txAt = s2f(T.behind.s + 1.7);
  const lampX = 540 + Math.sin(t * 0.7) * 40, lampY = 860 + Math.cos(t * 0.5) * 30;
  return (
    <AbsoluteFill style={{background: '#0d0c0a', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 2600, height: 3800, transformOrigin: '0 0',
        transform: `translate(540px, 840px) rotate(${cam.r}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`}}>
        {/* wall */}
        <div style={{position: 'absolute', inset: -400, background: 'radial-gradient(60% 40% at 45% 35%, #2b2721 0%, #1a1814 60%, #100f0c 100%)'}} />
        <div style={{position: 'absolute', inset: -400, backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '420px', opacity: 0.35, mixBlendMode: 'overlay'}} />
        {/* evidence */}
        <Paper {...A} pad={16}>
          <OffthreadVideo src={staticFile('hunt/clips/clock.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.3) sepia(.15)'}} />
        </Paper>
        <div style={{position: 'absolute', left: NOTE.x - 230, top: NOTE.y - 50, transform: 'rotate(-3deg)', background: PAPER, padding: '18px 28px', boxShadow: '10px 18px 30px rgba(0,0,0,.5)',
          font: `500 52px ${MONO}`, letterSpacing: 6, color: INK, opacity: lin(f, s2f(T.jan.s) - 2, s2f(T.jan.s) + 4)}}>
          {'JANUARY 1980'.slice(0, Math.max(0, Math.floor((f - s2f(T.jan.s)) * 0.9)))}
        </div>
        <Chart f={f} />
        <NameCard c={C1} n={1} first="Nelson Bunker" f={f} at={cardAt} />
        <NameCard c={C2} n={2} first="William Herbert" f={f} at={cardAt + 10} />
        <TexasClip f={f} at={txAt} />
        <svg width={2600} height={3800} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', zIndex: 4}}>
          <String_ a={PIN.A} b={PIN.B} p={sAB} />
          <String_ a={PIN.B} b={PIN.C1} p={sBC} />
          <String_ a={PIN.C1} b={PIN.TX} p={sCT} />
        </svg>
        {Object.values(PIN).map(([x, y], i) => <Pin key={i} x={x} y={y} />)}
      </div>
      {/* desk-lamp falloff and lens */}
      <AbsoluteFill style={{background: `radial-gradient(75% 55% at ${lampX}px ${lampY}px, rgba(255,236,200,.10) 0%, transparent 55%, rgba(0,0,0,.55) 100%)`}} />
      <AnimatedGrain f={f * 2} opacity={0.28} />
      <Caption t={t} />
      <div style={{position: 'absolute', left: 70, top: 200, font: `500 26px ${MONO}`, letterSpacing: 6, color: 'rgba(255,255,255,.7)'}}>BUBBLE FILES</div>
      <Audio src={staticFile('hunt/music/614.mp3')} trimBefore={18 * FPS} volume={(fr) => 0.3 * lin(fr, 0, 36) * (1 - lin(fr, BOARD_DURATION - 30, BOARD_DURATION))} />
      {VO.map(([id]) => <Sequence key={id} from={Math.round(s2f(T[id].s))} layout="none"><Audio src={staticFile(`hunt/vo/${id}.wav`)} /></Sequence>)}
      {/* one soft air move per camera glide, a tick when each string reaches its pin */}
      {[T.jan.e - 0.15, T.six.s - 0.2, T.behind.s - 0.05, T.behind.s + 1.35].map((s, i) => <Sequence key={'w' + i} from={Math.round(s2f(s))} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.35} /></Sequence>)}
      {[T.fifty.s + 0.85, T.behind.s + 1.0, T.behind.s + 2.0].map((s, i) => <Sequence key={'p' + i} from={Math.round(s2f(s))} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.4} /></Sequence>)}
    </AbsoluteFill>
  );
};

const Caption: React.FC<{t: number}> = ({t}) => {
  const line = VO.find(([id]) => t >= T[id].s - 0.05 && t <= T[id].e + 0.15);
  if (!line) return null;
  const words = line[2].split(' '), {s, e} = T[line[0]];
  const k = Math.floor(((t - s) / (e - s)) * words.length + 0.5);
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1520, textAlign: 'center', font: `600 54px/1.2 ${SANS}`, color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,.9), 0 0 3px #000'}}>
      {words.map((w, i) => <span key={i} style={{opacity: i <= k ? 1 : 0.35}}>{w} </span>)}
    </div>
  );
};
