import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender,
  interpolate, interpolateColors, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {SFX} from './sfx';

// 60 fps, 120 BPM: one beat = 30 frames.
export const DURATION = 1190;

const C = {ink: '#0B0E11', green: '#7EC25A', paper: '#F1EFE8', red: '#F6465D', ui: '#23C08D', grey: '#9A9C9F'};
const DISPLAY = '"Archivo Black", sans-serif';
const MONO = '"IBM Plex Mono", monospace';
const SERIF = '"Instrument Serif", serif';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.83, 0, 0.17, 1);
const IN = Easing.bezier(0.7, 0, 0.84, 0);
const SNAP = Easing.bezier(0.65, 0, 0.2, 1);
const MOVE = Easing.bezier(0.45, 0, 0.15, 1);
const FLOOD = Easing.bezier(0.7, 0, 0.25, 1);
const ease = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const sp = (f: number, damping = 14, stiffness = 180) => spring({frame: f, fps: 60, config: {damping, stiffness}});
const bump = (f: number, at: number, len = 10) => interpolate(f, [at - 3, at, at + len], [0, 1, 0], clamp);
const keys = (f: number, fr: number[], v: number[]) => interpolate(f, fr, v, {...clamp, easing: INOUT});

type Rect = {x: number; y: number; w: number; h: number; r: number};
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t), r: mix(a.r, b.r, t),
});
const centered = (cx: number, cy: number, w: number, h: number, r: number): Rect => ({x: cx - w / 2, y: cy - h / 2, w, h, r});
const full = (L: Layout): Rect => ({x: 0, y: 0, w: L.W, h: L.H, r: 0});

const Box: React.FC<{r: Rect; bg?: string; style?: React.CSSProperties; children?: React.ReactNode}> = ({r, bg, style, children}) => (
  <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: r.r, background: bg, overflow: 'hidden', ...style}}>
    {children}
  </div>
);

// Text that enters and leaves through a hard mask. No opacity anywhere.
const Slot: React.FC<{
  f: number; at: number; out?: number; x: number; y: number; h: number;
  style?: React.CSSProperties; align?: 'left' | 'center' | 'right'; w?: number; children: React.ReactNode;
}> = ({f, at, out, x, y, h, style, align = 'left', w, children}) => {
  if (f < at) return null;
  if (out !== undefined && f >= out + 14) return null;
  const pin = ease(f, at, at + 18);
  const pout = out === undefined ? 0 : ease(f, out, out + 14, IN);
  const ty = (1 - pin) * 108 - pout * 108;
  return (
    <div style={{position: 'absolute', left: x, top: y, height: h, width: w, overflow: 'hidden', textAlign: align}}>
      <div style={{transform: `translateY(${ty}%)`, height: h, lineHeight: `${h}px`, whiteSpace: 'nowrap', ...style}}>{children}</div>
    </div>
  );
};

// ---------------------------------------------------------------- look: photos, light, grain
const GRADE = 'grayscale(0.2) sepia(0.14) contrast(1.14)';

const Photo: React.FC<{src: string; f: number; bright: number; blur?: number; zoom?: [number, number]; pos?: string; range?: [number, number]}> = (
  {src, f, bright, blur = 0, zoom = [1.04, 1.12], pos = '50% 50%', range = [0, DURATION]},
) => {
  const k = interpolate(f, range, zoom, clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={staticFile(`photos/${src}.jpg`)} style={{
        width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos,
        transform: `scale(${k})`, filter: `${GRADE} brightness(${bright}) blur(${blur}px)`,
      }} />
    </AbsoluteFill>
  );
};
const Plate: React.FC<{src: string; f: number; bright: number; zoom?: [number, number]; pos?: string; range?: [number, number]}> = (
  {src, f, bright, zoom = [1.04, 1.12], pos = '50% 50%', range = [0, DURATION]},
) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <OffthreadVideo src={staticFile(`plates/${src}.mp4`)} muted style={{
      width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos,
      transform: `scale(${interpolate(f, range, zoom, clamp)})`, filter: `${GRADE} brightness(${bright})`,
    }} />
  </AbsoluteFill>
);
const Vignette: React.FC<{strength?: number}> = ({strength = 0.9}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 85% 70% at 50% 42%, rgba(11,14,17,0) 0%, rgba(11,14,17,${strength * 0.55}) 62%, rgba(11,14,17,${strength}) 100%)`}} />
);
const Light: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(80% 45% at 50% -8%, rgba(255,240,215,0.14), rgba(255,240,215,0) 70%)'}} />
);
const Stage: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(110% 70% at 50% 18%, #1A2027 0%, #0B0E11 62%)'}} />
);
const Grain: React.FC<{f: number}> = ({f}) => {
  const n = Math.floor(f / 2);
  const r = (s: number) => {const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};
  return (
    <AbsoluteFill style={{
      backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px',
      backgroundPosition: `${r(n) * 384}px ${r(n + 99) * 384}px`, mixBlendMode: 'overlay', opacity: 0.32, pointerEvents: 'none',
    }} />
  );
};

// A tactile green pill: lit from the top, resting on a soft shadow.
const pillStyle = (ink: boolean, pressed: number): React.CSSProperties => ({
  background: ink ? 'linear-gradient(180deg, #232A31 0%, #0B0E11 100%)' : 'linear-gradient(180deg, #A2DA83 0%, #7EC25A 52%, #67A945 100%)',
  boxShadow: `inset 0 2px 0 rgba(255,255,255,${ink ? 0.12 : 0.5}), inset 0 -4px 0 rgba(0,0,0,0.2), 0 ${22 - pressed * 14}px ${44 - pressed * 20}px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.3)`,
  transform: `translateY(${pressed * 4}px)`,
});

// ---------------------------------------------------------------- layout
type Layout = ReturnType<typeof layoutFor>;
const layoutFor = (W: number, H: number) => {
  const kind = H / W > 1.6 ? 'tall' : H / W > 1.15 ? 'feed' : 'square';
  const pick = <T,>(tall: T, feed: T, square: T): T => (kind === 'tall' ? tall : kind === 'feed' ? feed : square);
  return {
    W, H, kind, v: kind !== 'square',
    // scene 1
    fs1: pick(170, 132, 120),
    tradeY: pick(330, 104, 60),
    card: pick({cx: 540, cy: 880, w: 820, h: 540}, {cx: 540, cy: 612, w: 820, h: 500}, {cx: 540, cy: 468, w: 700, h: 420}),
    withY: pick(1232, 936, 742),
    fsWith: pick(150, 122, 112),
    // scenes 2 to 4: one floating window
    win: pick({x: 60, y: 690, w: 960, h: 790, r: 40}, {x: 60, y: 300, w: 960, h: 900, r: 36}, {x: 100, y: 330, w: 880, h: 660, r: 34}),
    win2: pick({x: 40, y: 700, w: 1000, h: 600, r: 40}, {x: 40, y: 380, w: 1000, h: 600, r: 36}, {x: 60, y: 260, w: 960, h: 560, r: 34}),
    fs3: pick(112, 86, 80),
    y3: pick(440, 172, 150),
    // scene 6
    coin: pick({cx: 540, cy: 870, d: 540, t: 46}, {cx: 540, cy: 600, d: 450, t: 40}, {cx: 540, cy: 470, d: 420, t: 36}),
    fromY: pick(300, 96, 42),
    fsFrom: pick(150, 118, 108),
    usdtY: pick(1216, 872, 760),
    fsUsdt: pick(180, 140, 124),
    noteY: pick(1418, 1060, 916),
    // end card
    logoW: pick(680, 620, 520),
    endY: pick(940, 690, 520),
  };
};

// ---------------------------------------------------------------- recording
const REC_W = 2560, REC_H = 1440;
type Cam = {cx: number; cy: number; s: number};
type CamKey = [number, number, number, number];
const camAt = (f: number, ks: CamKey[]): Cam => {
  const fr = ks.map((k) => k[0]);
  return {
    cx: keys(f, fr, ks.map((k) => k[1])),
    cy: keys(f, fr, ks.map((k) => k[2])),
    s: Math.exp(keys(f, fr, ks.map((k) => Math.log(k[3])))),
  };
};
const recToScreen = (win: Rect, cam: Cam, rx: number, ry: number) => ({
  x: win.x + win.w / 2 + (rx - cam.cx) * cam.s,
  y: win.y + win.h / 2 + (ry - cam.cy) * cam.s,
});
const RecVideo: React.FC<{w: number; h: number; cam: Cam; from: number; dur: number; trim: number}> = ({w, h, cam, from, dur, trim}) => (
  <Sequence from={from} durationInFrames={dur} layout="none">
    <OffthreadVideo
      src={staticFile('rec/hero.mp4')} trimBefore={trim} muted
      style={{position: 'absolute', maxWidth: 'none', width: REC_W * cam.s, height: REC_H * cam.s, left: w / 2 - cam.cx * cam.s, top: h / 2 - cam.cy * cam.s}}
    />
  </Sequence>
);

// A window floating in perspective.
const Float3D: React.FC<{r: Rect; rx: number; ry: number; children: React.ReactNode; bg?: string}> = ({r, rx, ry, children, bg = C.ink}) => (
  <AbsoluteFill style={{perspective: 2400, perspectiveOrigin: `${r.x + r.w / 2}px ${r.y + r.h / 2}px`}}>
    <div style={{
      position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: r.r, overflow: 'hidden', background: bg,
      transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
      boxShadow: '0 90px 160px rgba(0,0,0,0.7), 0 24px 48px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.09)',
    }}>
      {children}
    </div>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- cursor
const Cursor: React.FC<{x: number; y: number; press: number}> = ({x, y, press}) => (
  <svg width={70} height={81} viewBox="0 0 26 30" style={{
    position: 'absolute', left: x - 6.7, top: y - 4, transform: `scale(${1 - press * 0.16})`, transformOrigin: '7px 4px', overflow: 'visible',
    filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))',
  }}>
    <path d="M2.5 1.5 L2.5 22.5 L7.6 17.8 L11.2 26.2 L15 24.6 L11.5 16.4 L18.5 16.4 Z" fill="#FFFFFF" stroke={C.ink} strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

// ---------------------------------------------------------------- scene 1: ticker cards (0 to 300)
const TICKERS = [
  {t: 'AAPL', cap: 'Apple  ·  US stock', img: 'aapl', pos: '50% 42%'},
  {t: 'NVDA', cap: 'NVIDIA  ·  US stock', img: 'nvda', pos: '50% 55%'},
  {t: 'TSLA', cap: 'Tesla  ·  US stock', img: 'tsla', pos: '50% 58%'},
  {t: 'GOLD', cap: 'XAU  ·  Commodity', img: 'gold', pos: '50% 50%'},
  {t: 'ETFs', cap: 'Index funds', img: 'etf', pos: '50% 38%'},
];
const STEPS = [130, 160, 190, 220];
const CLICK_USDT = 250;
const S1_END = 280;
const rollAt = (f: number) => STEPS.reduce((a, t) => a + sp(f - t, 15, 210), 0);

const CardFace: React.FC<{i: number; w: number; h: number; L: Layout}> = ({i, w, h, L}) => {
  const c = TICKERS[i];
  const pad = L.v ? 40 : 30;
  return (
    <div style={{position: 'absolute', inset: 0, borderRadius: L.v ? 36 : 30, overflow: 'hidden', background: C.ink}}>
      <Img src={staticFile(`photos/${c.img}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: c.pos, filter: `${GRADE} brightness(0.7)`}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11,14,17,0.92) 0%, rgba(11,14,17,0.2) 55%, rgba(11,14,17,0.35) 100%)'}} />
      <div style={{position: 'absolute', left: pad, top: pad - 6, fontFamily: MONO, fontWeight: 500, fontSize: L.v ? 26 : 20, letterSpacing: 2, color: C.paper, textTransform: 'uppercase'}}>{c.cap}</div>
      <div style={{position: 'absolute', right: pad, top: pad - 6, fontFamily: MONO, fontSize: L.v ? 26 : 20, color: C.grey}}>0{i + 1} / 05</div>
      <div style={{position: 'absolute', left: pad - 6, bottom: pad - (L.v ? 30 : 22), fontFamily: DISPLAY, fontSize: L.v ? 200 : 150, lineHeight: 1, color: C.paper, letterSpacing: -2}}>{c.t}</div>
      <div style={{position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14), inset 0 1px 0 rgba(255,255,255,0.22)'}} />
    </div>
  );
};

const withGroup = (L: Layout) => {
  const withW = L.fsWith * 1.72;
  const ph = L.fsWith * 0.86;
  const pw = L.fsWith * 2.84;
  const gap = L.fsWith * 0.16;
  const x0 = (L.W - (withW + gap + pw)) / 2;
  return {withX: x0, withW, pill: {x: x0 + withW + gap, y: L.withY + (L.fsWith * 1.1 - ph) / 2, w: pw, h: ph, r: ph / 2} as Rect};
};

const Scene1: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  const roll = rollAt(f);
  const c = L.card;
  const dot = sp(f - 30, 10, 260);
  const wT = ease(f, 40, 60, SNAP), hT = ease(f, 52, 76, SNAP);
  const w = f < 40 ? 34 * dot : mix(34, c.w, wT);
  const h = f < 52 ? 34 * Math.min(dot, 1) : mix(34, c.h, hT);
  const morph = centered(c.cx, c.cy, w, h, Math.min(h / 2, L.v ? 36 : 30));
  const reveal = interpolate(f, [60, 94], [0, 1200], {...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1)});
  const tiltT = ease(f, 94, 150, INOUT);
  const rx = tiltT * 12 * (1 - ease(f, 230, 270, INOUT) * 0.5);
  const ry = tiltT * (-16 + interpolate(f, [150, 280], [0, 6], clamp));
  const open = ease(f, 96, 136);
  const g = withGroup(L);
  const pillIn = sp(f - 105, 11, 220);
  const pressed = f >= CLICK_USDT;
  const press = bump(f, CLICK_USDT + 2, 8);

  return (
    <>
      <Plate src="road" f={f} bright={0.95} zoom={[1.04, 1.16]} range={[0, S1_END]} pos={L.kind === 'tall' ? '62% 50%' : '58% 50%'} />
      <Vignette />
      <Light />
      <Slot f={f} at={60} x={0} w={L.W} align="center" y={L.tradeY} h={L.fs1 * 1.06} style={{fontFamily: DISPLAY, fontSize: L.fs1, color: C.paper}}>Trade</Slot>
      {f >= 30 && f < 96 && <Box r={morph} bg={C.green} style={pillStyle(false, 0)} />}
      {f >= 60 && (
        <AbsoluteFill style={{perspective: 2000, perspectiveOrigin: `${c.cx}px ${c.cy}px`}}>
          <div style={{position: 'absolute', left: c.cx - c.w / 2, top: c.cy - c.h / 2, width: c.w, height: c.h, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg)`}}>
            {TICKERS.map((_, i) => {
              if (i > 0 && open <= 0) return null;
              const k = Math.max(i - roll, 0) * open;
              const flip = Math.min(Math.max(roll - i, 0), 1);
              if (flip >= 0.98) return null;
              return (
                <div key={i} style={{
                  position: 'absolute', inset: 0, transformOrigin: '50% 0%', backfaceVisibility: 'hidden',
                  transform: `translate3d(0, ${-k * (L.v ? 34 : 26)}px, ${-k * 90}px) rotateX(${flip * 105}deg)`,
                  filter: `brightness(${1 - Math.min(k, 3) * 0.22})`,
                  clipPath: i === 0 && f < 96 ? `circle(${reveal}px at 50% 50%)` : undefined,
                  boxShadow: k < 0.5 ? '0 60px 110px rgba(0,0,0,0.6)' : undefined, borderRadius: L.v ? 36 : 30,
                }}>
                  <CardFace i={i} w={c.w} h={c.h} L={L} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
      <Slot f={f} at={100} x={g.withX} w={g.withW} align="right" y={L.withY} h={L.fsWith * 1.1}
        style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: L.fsWith * 1.08, color: C.paper, paddingRight: 8}}>with</Slot>
      {f >= 105 && f < CLICK_USDT + 6 && (
        <Box r={g.pill} style={{...pillStyle(pressed, press), transform: `translateY(${press * 4}px) scale(${pillIn})`, overflow: 'visible', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <span style={{fontFamily: DISPLAY, fontSize: L.fsWith * 0.72, color: pressed ? C.paper : C.ink, letterSpacing: 1}}>USDT</span>
        </Box>
      )}
    </>
  );
};

const cursor1 = (f: number, L: Layout) => {
  const c = L.card;
  const grab = {x: c.cx + c.w * 0.18, y: c.cy + c.h * 0.3};
  const {pill} = withGroup(L);
  const target = {x: pill.x + pill.w * 0.55, y: pill.y + pill.h * 0.6};
  let x = mix(L.W * 0.86, c.cx, ease(f, 0, 27, MOVE));
  let y = mix(L.H * 0.94, c.cy, ease(f, 0, 27, MOVE));
  const g = ease(f, 84, 116, MOVE);
  x = mix(x, grab.x, g); y = mix(y, grab.y, g);
  y -= interpolate(f, [120, 230], [0, c.h * 0.42], {...clamp, easing: Easing.bezier(0.3, 0, 0.6, 1)});
  const p = ease(f, 230, 248, MOVE);
  x = mix(x, target.x, p); y = mix(y, target.y, p);
  const hold = f >= 120 && f < 230 ? Math.min(ease(f, 116, 122), 1 - ease(f, 228, 234)) : 0;
  return {x, y, press: Math.max(bump(f, 30), bump(f, CLICK_USDT), hold)};
};

const Flood1: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  if (f < CLICK_USDT + 6 || f >= S1_END) return null;
  return <Box r={lerpRect(withGroup(L).pill, full(L), ease(f, CLICK_USDT + 6, S1_END, FLOOD))} bg={C.ink} />;
};

// ---------------------------------------------------------------- scene 2: hotcoin.com asset tabs (280 to 400)
// Screenshots of the live TradFi page at 3x. Coordinates are image pixels.
const SITE = {w: 3720, h: 1290, us: [1182, 507], metal: [1480, 507], etf: [2623, 507]} as const;
const CLICK_METAL = 326;
const CLICK_ETF = 358;
const S2_END = 400;
const S2_CAM: CamKey[] = [[280, 1860, 640, 0.43], [312, 1860, 640, 0.43], [384, 1880, 630, 0.45], [S2_END, 2623, 520, 2.4]];
const siteCam = (f: number, L: Layout): Cam => {const c = camAt(f, S2_CAM); return {...c, s: c.s * (L.win2.w / 960)};};
const win2At = (f: number, L: Layout): Rect =>
  f < 384 ? lerpRect(full(L), L.win2, ease(f, S1_END, 310)) : lerpRect(L.win2, L.win, ease(f, 384, S2_END, INOUT));

const Scene2: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  const win = win2At(f, L);
  const cam = siteCam(f, L);
  const tab = f < CLICK_METAL + 2 ? 'us' : f < CLICK_ETF + 2 ? 'metal' : 'etf';
  const rx = keys(f, [S1_END, 304, 322], [0, 8, 0]);
  const ry = keys(f, [S1_END, 304, 322], [0, -10, 0]);
  return (
    <>
      <Photo src="desk" f={f} bright={0.42} blur={5} zoom={[1.02, 1.06]} range={[S1_END, S2_END]} pos="50% 45%" />
      <Vignette />
      <Light />
      <Float3D r={win} rx={rx} ry={ry} bg="#000">
        <Img src={staticFile(`site/tab-${tab}.png`)} style={{
          position: 'absolute', maxWidth: 'none', width: SITE.w * cam.s, height: SITE.h * cam.s,
          left: win.w / 2 - cam.cx * cam.s, top: win.h / 2 - cam.cy * cam.s,
        }} />
      </Float3D>
    </>
  );
};
const cursor2 = (f: number, L: Layout) => {
  const at = (p: readonly number[], t: number) => recToScreen(L.win2, siteCam(t, L), p[0], p[1] + 8);
  const {pill} = withGroup(L);
  const start = {x: pill.x + pill.w * 0.55, y: pill.y + pill.h * 0.6};
  const m = at(SITE.metal, CLICK_METAL), e = at(SITE.etf, CLICK_ETF);
  const t1 = ease(f, 296, CLICK_METAL - 3, MOVE), t2 = ease(f, CLICK_METAL + 8, CLICK_ETF - 3, MOVE);
  return {
    x: mix(mix(start.x, m.x, t1), e.x, t2),
    y: mix(mix(start.y, m.y, t1), e.y, t2),
    press: Math.max(bump(f, CLICK_METAL), bump(f, CLICK_ETF)),
  };
};

// ---------------------------------------------------------------- scenes 3 and 4: the real app, floating
const HeadLines: React.FC<{f: number; L: Layout; at: number; out?: number; lines: React.ReactNode[]}> = ({f, L, at, out, lines}) => {
  const fs = L.fs3, lh = fs * 1.1;
  return (
    <>
      {lines.map((ln, i) => (
        <Slot key={i} f={f} at={at + i * 5} out={out === undefined ? undefined : out + i * 3} x={0} w={L.W} align="center"
          y={L.y3 + i * lh - lines.length * lh * 0.5} h={lh} style={{fontFamily: DISPLAY, fontSize: fs, color: C.paper}}>{ln}</Slot>
      ))}
    </>
  );
};
const I: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: '1.12em', letterSpacing: -1}}>{children}</span>
);

const S3_CAM: CamKey[] = [
  [300, 470, 470, 3.2], [330, 470, 620, 1.0], [332, 470, 620, 1.0], [354, 360, 703, 1.7], [418, 360, 703, 1.7],
  [440, 470, 600, 1.15], [458, 460, 420, 1.5], [482, 470, 520, 1.3], [500, 480, 812, 1.5],
  [528, 480, 700, 1.1], [548, 520, 430, 1.0], [578, 470, 300, 1.25], [600, 200, 170, 5.0],
];
const S4_CAM: CamKey[] = [
  [600, 2150, 440, 5.0], [632, 2185, 640, 1.3], [656, 2185, 640, 1.3], [682, 2185, 1120, 1.3], [720, 2185, 1120, 1.3],
];
const OPEN_LONG = {x0: 1882, y0: 1175, x1: 2186, y1: 1261};
const PRESS = 690;

const tiltAt = (f: number) => (f < 600
  ? {rx: keys(f, [300, 342, 600], [0, 9, 5]), ry: keys(f, [300, 342, 600], [0, -12, -6])}
  : {rx: keys(f, [600, 630, 666], [0, 8, 0]), ry: keys(f, [600, 630, 666], [0, -9, 0])});

const Scene34: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  const win: Rect = L.win;
  const s3 = f < 600;
  const cam = s3 ? camAt(f, S3_CAM) : camAt(f, S4_CAM);
  const {rx, ry} = tiltAt(f);
  return (
    <>
      <Photo src="desk" f={f} bright={0.42} blur={5} zoom={[1.06, 1.16]} range={[300, 722]} pos="50% 45%" />
      <Vignette />
      <Light />
      <HeadLines f={f} L={L} at={330} out={404} lines={[<>Spot <I>and</I></>, 'Futures.']} />
      <HeadLines f={f} L={L} at={420} out={494} lines={['One', 'account.']} />
      <HeadLines f={f} L={L} at={510} out={584} lines={['No moving', 'funds.']} />
      <HeadLines f={f} L={L} at={606} lines={[<><I>No</I> separate</>, 'fiat account.']} />
      <Float3D r={win} rx={rx} ry={ry}>
        {s3
          ? <RecVideo w={win.w} h={win.h} cam={cam} from={300} dur={300} trim={75} />
          : <RecVideo w={win.w} h={win.h} cam={cam} from={600} dur={130} trim={636} />}
      </Float3D>
    </>
  );
};

// ---------------------------------------------------------------- scene 5: Open Long floods the frame (690 to 720)
const openLongRect = (L: Layout): Rect => {
  const cam = camAt(PRESS, S4_CAM);
  const a = recToScreen(L.win, cam, OPEN_LONG.x0, OPEN_LONG.y0);
  const b = recToScreen(L.win, cam, OPEN_LONG.x1, OPEN_LONG.y1);
  return {x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y, r: (b.y - a.y) / 2};
};
const Scene5: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  if (f < PRESS + 4 || f >= 722) return null;
  const t = ease(f, PRESS + 4, 720, FLOOD);
  return <Box r={lerpRect(openLongRect(L), full(L), t)} bg={interpolateColors(t, [0, 0.6], [C.ui, C.green])} />;
};
const cursor5 = (f: number, L: Layout) => {
  const p = recToScreen(L.win, camAt(PRESS, S4_CAM), 2042, 1235);
  const away = ease(f, 700, 730, MOVE);
  return {x: mix(p.x, L.W * 0.82, away), y: mix(p.y, L.H * 1.02, away), press: bump(f, PRESS + 2)};
};

// ---------------------------------------------------------------- scene 6: a 3D coin, from 10 USDT (720 to 960)
const COIN_IN = 752;
const RING_OUT = 930;
const CLICK_END = 960;
const coinFace = 'radial-gradient(circle at 34% 28%, #B4E398 0%, #8CCB68 30%, #7EC25A 52%, #5F9E3F 100%)';

const Coin: React.FC<{d: number; t: number; rx: number; ry: number}> = ({d, t, rx, ry}) => {
  const r = d / 2;
  const n = 96;
  const seg = (2 * Math.PI * r) / n + 1.5;
  const face = (back: boolean) => (
    <div style={{
      position: 'absolute', left: -r, top: -r, width: d, height: d, borderRadius: '50%', background: coinFace, backfaceVisibility: 'hidden',
      transform: `${back ? 'rotateY(180deg) ' : ''}translateZ(${t / 2}px)`, overflow: 'hidden',
      boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.35), inset 0 -6px 12px rgba(0,0,0,0.18)',
    }}>
      <div style={{position: 'absolute', inset: d * 0.065, borderRadius: '50%', boxShadow: 'inset 0 3px 0 rgba(0,0,0,0.16), 0 2px 0 rgba(255,255,255,0.3)'}} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: DISPLAY, fontSize: d * 0.44, lineHeight: 1, color: C.ink, letterSpacing: -4, marginTop: d * 0.04, textShadow: '0 2px 0 rgba(255,255,255,0.35), 0 -2px 0 rgba(0,0,0,0.18)'}}>10</div>
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: d * 0.058, letterSpacing: d * 0.012, color: C.ink, marginTop: d * 0.02}}>USDT</div>
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.22) 48%, rgba(255,255,255,0) 60%)', transform: `translateX(${((ry % 360) / 180) * d * 0.6}px)`}} />
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg)`}}>
      {new Array(n).fill(0).map((_, i) => {
        const a = (i / n) * 360;
        const shade = 0.62 + 0.38 * Math.cos(((a - 120) * Math.PI) / 180);
        return (
          <div key={i} style={{
            position: 'absolute', left: -seg / 2, top: -t / 2, width: seg, height: t,
            background: i % 2 ? '#4B8631' : '#437A2B', filter: `brightness(${shade})`,
            transform: `rotateZ(${a}deg) translateY(${-r}px) rotateX(90deg)`,
          }} />
        );
      })}
      {face(false)}
      {face(true)}
    </div>
  );
};

const Scene6: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  if (f < 720 || f >= CLICK_END + 4) return null;
  const k = L.coin;
  const disc = lerpRect(full(L), centered(k.cx, k.cy, k.d, k.d, k.d / 2), ease(f, 720, COIN_IN));
  const spin = -360 * (1 - ease(f, COIN_IN, 826, OUT));
  const edge = ease(f, RING_OUT, 954, INOUT);
  const ry = mix(spin - 20 * ease(f, 800, 860, INOUT), -90, edge);
  const rx = mix(10 * ease(f, 790, 850, INOUT), 0, edge);
  const bob = Math.sin((f - COIN_IN) / 40) * 8 * ease(f, 800, 840) * (1 - edge);
  const g = full(L);
  return (
    <>
      <Box r={g}>
        <Photo src="coins" f={f} bright={0.5} blur={8} zoom={[1.18, 1.06]} range={[720, 960]} pos="50% 50%" />
        <Vignette />
        <Light />
      </Box>
      {f < COIN_IN && <Box r={disc} bg={coinFace} />}
      <Slot f={f} at={765} out={RING_OUT} x={0} w={L.W} align="center" y={L.fromY} h={L.fsFrom * 1.08}
        style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: L.fsFrom * 1.05, color: C.paper}}>From</Slot>
      {f >= COIN_IN && (
        <>
          <div style={{position: 'absolute', left: k.cx - k.d * 0.42, top: k.cy + k.d * 0.5 + 40, width: k.d * 0.84, height: 70, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.6), rgba(0,0,0,0) 70%)'}} />
          <AbsoluteFill style={{perspective: 1800, perspectiveOrigin: `${k.cx}px ${k.cy}px`}}>
            <div style={{position: 'absolute', left: k.cx, top: k.cy + bob, transformStyle: 'preserve-3d'}}>
              <Coin d={k.d} t={k.t} rx={rx} ry={ry} />
            </div>
          </AbsoluteFill>
        </>
      )}
      <Slot f={f} at={780} out={RING_OUT + 4} x={0} w={L.W} align="center" y={L.usdtY} h={L.fsUsdt * 1.06}
        style={{fontFamily: DISPLAY, fontSize: L.fsUsdt, color: C.paper}}>USDT</Slot>
      <Slot f={f} at={795} out={RING_OUT + 8} x={0} w={L.W} align="center" y={L.noteY} h={50}
        style={{fontFamily: MONO, fontWeight: 500, fontSize: L.v ? 36 : 28, color: C.grey, letterSpacing: 1}}>on selected TradFi products</Slot>
    </>
  );
};

// ---------------------------------------------------------------- scene 7: end card (960 to 1110)
const Scene7: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  if (f < CLICK_END) return null;
  const k = L.coin;
  const bar = centered(k.cx, k.cy, k.t, k.d, k.t / 2);
  const t = ease(f, CLICK_END + 2, 988, FLOOD);
  const logoIn = ease(f, 990, 1012, SNAP);
  const lw = L.logoW, lh = lw * (93 / 485);
  const pillW = ease(f, 1018, 1040, OUT);
  return (
    <>
      {f >= 988 && <><Stage /><Light /></>}
      {f < 990 && <Box r={lerpRect(bar, full(L), t)} bg={C.ink} />}
      {f >= 988 && (
        <div style={{position: 'absolute', left: (L.W - lw) / 2, top: L.endY - lh, width: lw, height: lh, clipPath: `inset(0 ${(1 - logoIn) * 100}% 0 0)`}}>
          <Img src={staticFile('brand/logo.png')} style={{width: lw, height: lh}} />
        </div>
      )}
      <Slot f={f} at={1004} x={0} w={L.W} align="center" y={L.endY + (L.v ? 70 : 56)} h={60}
        style={{fontFamily: MONO, fontWeight: 500, fontSize: L.v ? 40 : 34, color: C.paper}}>hotcoin.com/en_US/tradFi</Slot>
      {f >= 1018 && <Box r={centered(L.W / 2, L.endY + (L.v ? 172 : 142), 18 + pillW * 170, 18, 9)} style={pillStyle(false, 0)} />}
    </>
  );
};
const cursor7 = (f: number, L: Layout) => {
  const k = L.coin;
  const inT = ease(f, 926, 956, MOVE);
  const park = ease(f, 1010, 1050, MOVE);
  return {
    x: mix(mix(L.W * 0.9, k.cx + 6, inT), L.W / 2 + (L.v ? 130 : 115), park),
    y: mix(mix(L.H * 1.02, k.cy + 20, inT), L.endY + (L.v ? 205 : 172), park),
    press: bump(f, CLICK_END),
  };
};

// ---------------------------------------------------------------- film
const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('400 100px "Archivo Black"'),
      document.fonts.load('500 40px "IBM Plex Mono"'),
      document.fonts.load('400 40px "IBM Plex Mono"'),
      document.fonts.load('italic 400 100px "Instrument Serif"'),
    ]).then(() => continueRender(h));
  }, [h]);
};

// Scenes 3 to 7 were authored on their own clock; the website beat pushes them back by OFF frames.
export const OFF = S2_END - 300;

const Later: React.FC<{L: Layout}> = ({L}) => {
  const f = useCurrentFrame();
  const cur = f >= PRESS - 2 && f < 732 ? cursor5(f, L) : f >= 924 ? cursor7(f, L) : null;
  return (
    <>
      {f >= 300 && f < 722 && <Scene34 f={f} L={L} />}
      <Scene5 f={f} L={L} />
      <Scene6 f={f} L={L} />
      <Scene7 f={f} L={L} />
      {cur && <Cursor {...cur} />}
    </>
  );
};

export const Film: React.FC<{square: boolean}> = () => {
  useFonts();
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const L = layoutFor(width, height);
  const cur = f < S1_END ? cursor1(f, L) : f < 388 ? cursor2(f, L) : null;

  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      <Stage />
      {f < S1_END && <Scene1 f={f} L={L} />}
      {f < S1_END && <Flood1 f={f} L={L} />}
      {f >= S1_END && f < S2_END && <Scene2 f={f} L={L} />}
      <Sequence from={OFF} layout="none"><Later L={L} /></Sequence>
      {cur && <Cursor {...cur} />}
      <Grain f={f} />
      <SFX />
    </AbsoluteFill>
  );
};
