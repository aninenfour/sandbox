import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender,
  interpolate, interpolateColors, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {SFX} from './sfx';

// 60 fps, 120 BPM: one beat = 30 frames.
export const DURATION = 1110;

const C = {ink: '#0B0E11', green: '#7EC25A', paper: '#F1EFE8', red: '#F6465D', ui: '#23C08D', grey: '#6B6F76'};
const DISPLAY = '"Archivo Black", sans-serif';
const MONO = '"IBM Plex Mono", monospace';
const SERIF = '"Instrument Serif", serif';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.83, 0, 0.17, 1);
const IN = Easing.bezier(0.7, 0, 0.84, 0);
const SNAP = Easing.bezier(0.65, 0, 0.2, 1);
const MOVE = Easing.bezier(0.45, 0, 0.15, 1);
const ease = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const sp = (f: number, damping = 14, stiffness = 180) => spring({frame: f, fps: 60, config: {damping, stiffness}});
const bump = (f: number, at: number, len = 10) => interpolate(f, [at - 3, at, at + len], [0, 1, 0], clamp);

type Rect = {x: number; y: number; w: number; h: number; r: number};
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t), r: mix(a.r, b.r, t),
});
const centered = (cx: number, cy: number, w: number, h: number, r: number): Rect => ({x: cx - w / 2, y: cy - h / 2, w, h, r});

const Box: React.FC<{r: Rect; bg?: string; style?: React.CSSProperties; children?: React.ReactNode}> = ({r, bg, style, children}) => (
  <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: r.r, background: bg, overflow: 'hidden', ...style}}>
    {children}
  </div>
);

// Text that enters and leaves through a hard mask. No opacity anywhere.
const Slot: React.FC<{
  f: number; at: number; out?: number; x: number; y: number; h: number;
  style?: React.CSSProperties; align?: 'left' | 'center'; w?: number; children: React.ReactNode;
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

// ---------------------------------------------------------------- layout
type Layout = ReturnType<typeof layoutFor>;
const layoutFor = (W: number, H: number) => {
  const v = H > W;
  return {
    W, H, v,
    // scene 1
    hx: v ? 90 : 80,
    fs1: v ? 150 : 124,
    y1: v ? 290 : 120,
    card: v ? {x: 110, y: 830, w: 860, h: 600, r: 44} : {x: 640, y: 150, w: 370, h: 780, r: 40},
    withW: v ? 272 : 224,
    // scenes 3 and 4
    win: v ? {x: 40, y: 640, w: 1000, h: 860, r: 36} : {x: 470, y: 90, w: 570, h: 900, r: 32},
    fs3: v ? 116 : 92,
    y3: v ? 330 : 360,
    // scene 6
    ring: v ? {x: 560, y: 470, w: 380, h: 580, r: 190} : {x: 590, y: 250, w: 300, h: 460, r: 150},
    counter: v ? {w: 170, h: 370} : {w: 132, h: 290},
    fsOne: v ? 800 : 630,
    oneRight: v ? 540 : 570,
    fromY: v ? 300 : 90,
    usdtY: v ? 1090 : 760,
    noteY: v ? 1300 : 945,
    // end card
    logoW: v ? 600 : 520,
    endY: v ? 880 : 500,
  };
};

// ---------------------------------------------------------------- recording window
const REC_W = 2560, REC_H = 1440;
type Cam = {cx: number; cy: number; s: number};
type CamKey = [number, number, number, number];
const camAt = (f: number, ks: CamKey[]): Cam => {
  const o = {...clamp, easing: INOUT};
  const fr = ks.map((k) => k[0]);
  return {
    cx: interpolate(f, fr, ks.map((k) => k[1]), o),
    cy: interpolate(f, fr, ks.map((k) => k[2]), o),
    s: Math.exp(interpolate(f, fr, ks.map((k) => Math.log(k[3])), o)),
  };
};
const recToScreen = (win: Rect, cam: Cam, rx: number, ry: number) => ({
  x: win.x + win.w / 2 + (rx - cam.cx) * cam.s,
  y: win.y + win.h / 2 + (ry - cam.cy) * cam.s,
});

const RecWindow: React.FC<{win: Rect; cam: Cam; from: number; dur: number; trim: number}> = ({win, cam, from, dur, trim}) => (
  <Box r={win} bg={C.ink}>
    <Sequence from={from} durationInFrames={dur} layout="none">
      <OffthreadVideo
        src={staticFile('rec/hero.mp4')} trimBefore={trim} muted
        style={{position: 'absolute', maxWidth: 'none', width: REC_W * cam.s, height: REC_H * cam.s, left: win.w / 2 - cam.cx * cam.s, top: win.h / 2 - cam.cy * cam.s}}
      />
    </Sequence>
  </Box>
);

// ---------------------------------------------------------------- cursor
const Cursor: React.FC<{x: number; y: number; press: number}> = ({x, y, press}) => (
  <svg width={70} height={81} viewBox="0 0 26 30" style={{position: 'absolute', left: x - 6.7, top: y - 4, transform: `scale(${1 - press * 0.16})`, transformOrigin: '7px 4px', overflow: 'visible'}}>
    <path d="M2.5 1.5 L2.5 22.5 L7.6 17.8 L11.2 26.2 L15 24.6 L11.5 16.4 L18.5 16.4 Z" fill="#FFFFFF" stroke={C.ink} strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

// ---------------------------------------------------------------- scene 1: tickers (0 to 300)
const TICKERS = ['AAPL', 'NVDA', 'TSLA', 'GOLD', 'ETFs'];
const STEPS = [150, 180, 210, 240];
const CLICK_USDT = 270;

const pillRect = (L: Layout): Rect => {
  const h = L.fs1 * 0.84;
  const w = L.fs1 * 2.7;
  return {x: L.hx + L.withW + 22, y: L.y1 + L.fs1 * 2.12 + (L.fs1 * 1.06 - h) / 2, w, h, r: h / 2};
};

const Scene1: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  const roll = STEPS.reduce((a, t) => a + sp(f - t, 13, 240), 0);
  const c = L.card;
  const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
  const dot = sp(f - 30, 10, 260);
  const wT = ease(f, 40, 60, SNAP), hT = ease(f, 52, 76, SNAP);
  const w = f < 40 ? 34 * dot : mix(34, c.w, wT);
  const h = f < 52 ? 34 * Math.min(dot, 1) : mix(34, c.h, hT);
  const release = sp(f - 250, 12, 200);
  const dragY = f >= 140 ? -roll * 14 * (1 - release) : 0;
  const card = centered(cx, cy + dragY, w, h, Math.min(h / 2, c.r));
  const reveal = interpolate(f, [58, 90], [0, 1400], {...clamp, easing: Easing.bezier(0.5, 0, 0.2, 1)});
  const plateW = L.v ? c.w : 820;
  const plateH = plateW * (1920 / 1080);
  const push = interpolate(f, [58, 300], [1.14, 1.0], clamp);

  const fs = L.fs1, lh = fs * 1.06;
  const pr = pillRect(L);
  const pillIn = sp(f - 105, 11, 220);
  const pressed = f >= CLICK_USDT;
  const pillScale = pillIn * (1 - bump(f, CLICK_USDT + 2, 8) * 0.07);

  return (
    <>
      {f >= 30 && (
        <Box r={card} bg={C.green}>
          <Sequence from={0} durationInFrames={300} layout="none">
            <div style={{position: 'absolute', inset: 0, clipPath: `circle(${reveal}px at 50% 50%)`}}>
              <OffthreadVideo
                src={staticFile('plates/skyline.mp4')} muted
                style={{position: 'absolute', maxWidth: 'none', width: plateW, height: plateH, left: w / 2 - plateW / 2, top: h / 2 - plateH * 0.74, transform: `scale(${push})`}}
              />
            </div>
          </Sequence>
        </Box>
      )}
      <Slot f={f} at={60} x={L.hx} y={L.y1} h={lh} style={{fontFamily: DISPLAY, fontSize: fs, color: C.ink}}>Trade</Slot>
      {f >= 90 && (
        <Slot f={f} at={90} x={L.hx} y={L.y1 + lh} h={lh} style={{fontFamily: DISPLAY, fontSize: fs, color: C.ink}}>
          <div style={{transform: `translateY(${-roll * lh}px)`}}>
            {TICKERS.map((t) => <div key={t} style={{height: lh}}>{t}</div>)}
          </div>
        </Slot>
      )}
      <Slot f={f} at={100} x={L.hx} y={L.y1 + lh * 2} h={lh * 1.04} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: fs * 1.08, color: C.ink}}>with</Slot>
      {f >= 105 && f < CLICK_USDT + 6 && (
        <Box r={pr} bg={pressed ? C.ink : C.green} style={{transform: `scale(${pillScale})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <span style={{fontFamily: DISPLAY, fontSize: fs * 0.7, color: pressed ? C.paper : C.ink, letterSpacing: 1}}>USDT</span>
        </Box>
      )}
    </>
  );
};

const cursor1 = (f: number, L: Layout) => {
  const c = L.card;
  const dot = {x: c.x + c.w / 2, y: c.y + c.h / 2};
  const grab = {x: dot.x + (L.v ? 110 : 40), y: dot.y + (L.v ? 80 : 120)};
  const pr = pillRect(L);
  const pill = {x: pr.x + pr.w * 0.55, y: pr.y + pr.h * 0.55};
  const roll = STEPS.reduce((a, t) => a + sp(f - t, 13, 240), 0);
  const release = sp(f - 250, 12, 200);
  let x = mix(L.W * 0.86, dot.x, ease(f, 0, 27, MOVE));
  let y = mix(L.H * 0.94, dot.y, ease(f, 0, 27, MOVE));
  const g = ease(f, 96, 136, MOVE);
  x = mix(x, grab.x, g); y = mix(y, grab.y, g);
  y -= roll * 40 * (1 - release);
  const p = ease(f, 250, 268, MOVE);
  x = mix(x, pill.x, p); y = mix(y, pill.y, p);
  const hold = f >= 140 && f < 250 ? 1 : 0;
  const press = Math.max(bump(f, 30), bump(f, CLICK_USDT), hold * Math.min(ease(f, 136, 142), 1 - ease(f, 248, 254)));
  return {x, y, press};
};

// ---------------------------------------------------------------- flood out of the USDT pill (270 to 300)
const Flood1: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  if (f < CLICK_USDT + 6 || f >= 300) return null;
  const t = ease(f, CLICK_USDT + 6, 300, Easing.bezier(0.7, 0, 0.25, 1));
  const pr = pillRect(L);
  return <Box r={lerpRect(pr, {x: 0, y: 0, w: L.W, h: L.H, r: 0}, t)} bg={C.ink} />;
};

// ---------------------------------------------------------------- scenes 3 and 4: the real app
const HeadLines: React.FC<{f: number; L: Layout; at: number; out?: number; lines: React.ReactNode[]}> = ({f, L, at, out, lines}) => {
  const fs = L.fs3, lh = fs * 1.08;
  const x = L.v ? 70 : 60;
  return (
    <>
      {lines.map((ln, i) => (
        <Slot key={i} f={f} at={at + i * 5} out={out === undefined ? undefined : out + i * 3} x={x} y={L.y3 + i * lh - (lines.length - 1) * lh * 0.5} h={lh}
          style={{fontFamily: DISPLAY, fontSize: fs, color: C.ink}}>{ln}</Slot>
      ))}
    </>
  );
};
const I: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: '1.1em', letterSpacing: -1}}>{children}</span>
);

const S3_CAM: CamKey[] = [
  [300, 480, 640, 1.0], [332, 470, 620, 1.0], [354, 360, 703, 1.7], [418, 360, 703, 1.7],
  [440, 470, 600, 1.15], [458, 460, 420, 1.5], [482, 470, 520, 1.3], [500, 480, 812, 1.5],
  [528, 480, 700, 1.1], [548, 520, 430, 1.0], [578, 470, 300, 1.25], [600, 200, 170, 5.0],
];
const S4_CAM: CamKey[] = [
  [600, 2150, 440, 5.0], [632, 2185, 640, 1.35], [656, 2185, 640, 1.35], [682, 2185, 1120, 1.35], [720, 2185, 1120, 1.35],
];
const OPEN_LONG = {x0: 1882, y0: 1175, x1: 2186, y1: 1261};
const PRESS = 690;

const winAt = (f: number, L: Layout) =>
  f < 330 ? lerpRect({x: 0, y: 0, w: L.W, h: L.H, r: 0}, L.win, ease(f, 300, 330)) : (L.win as Rect);

const Scene34: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  const win = winAt(f, L);
  const s3 = f < 600;
  const cam = s3 ? camAt(f, S3_CAM) : camAt(f, S4_CAM);
  return (
    <>
      <HeadLines f={f} L={L} at={330} out={416} lines={[<>Spot <I>and</I></>, 'Futures.']} />
      <HeadLines f={f} L={L} at={420} out={506} lines={['One', 'account.']} />
      <HeadLines f={f} L={L} at={510} out={596} lines={['No moving', 'funds.']} />
      <HeadLines f={f} L={L} at={606} lines={[<><I>No</I> separate</>, 'fiat account.']} />
      {s3
        ? <RecWindow win={win} cam={cam} from={300} dur={300} trim={75} />
        : <RecWindow win={win} cam={cam} from={600} dur={130} trim={636} />}
    </>
  );
};

// ---------------------------------------------------------------- scene 5: Open Long becomes the flood (690 to 720)
const openLongRect = (L: Layout): Rect => {
  const cam = camAt(PRESS, S4_CAM);
  const a = recToScreen(L.win, cam, OPEN_LONG.x0, OPEN_LONG.y0);
  const b = recToScreen(L.win, cam, OPEN_LONG.x1, OPEN_LONG.y1);
  return {x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y, r: (b.y - a.y) / 2};
};
const Scene5: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  if (f < PRESS + 4 || f >= 722) return null;
  const t = ease(f, PRESS + 4, 720, Easing.bezier(0.7, 0, 0.25, 1));
  const col = interpolateColors(t, [0, 0.6], [C.ui, C.green]);
  return <Box r={lerpRect(openLongRect(L), {x: 0, y: 0, w: L.W, h: L.H, r: 0}, t)} bg={col} />;
};
const cursor5 = (f: number, L: Layout) => {
  const r = openLongRect(L);
  const cam = camAt(PRESS, S4_CAM);
  const p = recToScreen(L.win, cam, 2042, 1235);
  const away = ease(f, 700, 730, MOVE);
  return {x: mix(p.x, L.W * 0.8, away), y: mix(p.y, L.H * 0.95, away) + (r.y - r.y), press: bump(f, PRESS + 2)};
};

// ---------------------------------------------------------------- scene 6: from 10 USDT (720 to 930)
const RING_OUT = 930;
const Scene6: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  if (f < 720 || f >= 962) return null;
  const R = L.ring;
  const toRing = ease(f, 720, 752);
  const toDot = ease(f, 944, 962, SNAP);
  const dotR: Rect = centered(R.x + R.w / 2, R.y + R.h / 2, 120, 120, 60);
  let ring = lerpRect({x: 0, y: 0, w: L.W, h: L.H, r: 0}, R, toRing);
  ring = lerpRect(ring, dotR, toDot);
  const open = ease(f, 746, 770) * (1 - ease(f, RING_OUT, 946, SNAP));
  const cnt = centered(ring.w / 2, ring.h / 2, L.counter.w * open, L.counter.h * open, (L.counter.w * open) / 2);
  const pressed = f >= 960;
  const fs = L.fsOne;
  return (
    <>
      <Slot f={f} at={765} out={RING_OUT} x={L.hx} y={L.fromY} h={L.fs1 * 1.0}
        style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: L.fs1 * 1.0, color: C.ink}}>From</Slot>
      <Slot f={f} at={752} out={RING_OUT} x={L.oneRight - fs} w={fs} align="left" y={R.y - fs * 0.115} h={fs * 0.9}
        style={{fontFamily: DISPLAY, fontSize: fs, lineHeight: `${fs}px`, color: C.ink, textAlign: 'right'}}>1</Slot>
      <Box r={ring} bg={pressed ? C.ink : C.green}>
        {open > 0 && <Box r={cnt} bg={C.paper} />}
      </Box>
      <Slot f={f} at={780} out={RING_OUT + 4} x={L.hx} y={L.usdtY} h={L.fs1 * 1.06}
        style={{fontFamily: DISPLAY, fontSize: L.fs1 * 1.02, color: C.ink}}>USDT</Slot>
      <Slot f={f} at={795} out={RING_OUT + 8} x={L.hx + 6} y={L.noteY} h={48}
        style={{fontFamily: MONO, fontWeight: 500, fontSize: L.v ? 38 : 30, color: C.grey}}>on selected TradFi products</Slot>
    </>
  );
};

// ---------------------------------------------------------------- scene 7: end card (960 to 1110)
const CLICK_END = 960;
const Scene7: React.FC<{f: number; L: Layout}> = ({f, L}) => {
  if (f < CLICK_END + 2) return null;
  const R = L.ring;
  const cx = R.x + R.w / 2, cy = R.y + R.h / 2;
  const t = ease(f, CLICK_END + 2, 988, Easing.bezier(0.7, 0, 0.25, 1));
  const d = mix(120, Math.hypot(L.W, L.H) * 2.2, t);
  const logoIn = ease(f, 990, 1012, SNAP);
  const lw = L.logoW, lh = lw * (93 / 485);
  const pillW = ease(f, 1018, 1040, OUT);
  return (
    <>
      <Box r={centered(cx, cy, d, d, d / 2)} bg={C.ink} />
      {f >= 988 && (
        <div style={{position: 'absolute', left: (L.W - lw) / 2, top: L.endY - lh, width: lw, height: lh, clipPath: `inset(0 ${(1 - logoIn) * 100}% 0 0)`}}>
          <Img src={staticFile('brand/logo.png')} style={{width: lw, height: lh}} />
        </div>
      )}
      <Slot f={f} at={1004} x={0} w={L.W} align="center" y={L.endY + (L.v ? 70 : 56)} h={60}
        style={{fontFamily: MONO, fontWeight: 500, fontSize: L.v ? 40 : 34, color: C.paper}}>hotcoin.com/en_US/tradFi</Slot>
      {f >= 1018 && <Box r={centered(L.W / 2, L.endY + (L.v ? 170 : 140), 14 + pillW * 160, 14, 7)} bg={C.green} />}
    </>
  );
};
const cursor7 = (f: number, L: Layout) => {
  const R = L.ring;
  const c = {x: R.x + R.w / 2, y: R.y + R.h / 2};
  const inT = ease(f, 926, 956, MOVE);
  const park = ease(f, 1010, 1050, MOVE);
  return {
    x: mix(mix(L.W * 0.9, c.x + 10, inT), L.W / 2 + (L.v ? 120 : 110), park),
    y: mix(mix(L.H * 1.02, c.y + 14, inT), L.endY + (L.v ? 200 : 170), park),
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
      document.fonts.load('italic 400 100px "Instrument Serif"'),
    ]).then(() => continueRender(h));
  }, [h]);
};

export const Film: React.FC<{square: boolean}> = () => {
  useFonts();
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const L = layoutFor(width, height);

  const cur = f < 300 ? cursor1(f, L) : f >= PRESS - 2 && f < 732 ? cursor5(f, L) : f >= 924 ? cursor7(f, L) : null;

  return (
    <AbsoluteFill style={{background: C.paper, overflow: 'hidden'}}>
      {f < 300 && <Scene1 f={f} L={L} />}
      {f < 300 && <Flood1 f={f} L={L} />}
      {f >= 300 && f < 722 && <Scene34 f={f} L={L} />}
      <Scene5 f={f} L={L} />
      <Scene6 f={f} L={L} />
      <Scene7 f={f} L={L} />
      {cur && <Cursor {...cur} />}
      <SFX />
    </AbsoluteFill>
  );
};
