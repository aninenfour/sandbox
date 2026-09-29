import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Companion, poseAt, type Beat} from '../companion/Companion';
import {useFrame} from '../design/clock';
import {Chrome, Ground, Headline, Note, Underline, useLayout, Wipe} from '../design/Notebook';
import {FONT, GREEN, INK, LOCKUP, PAPER, RED, theme, type Ground as G} from '../design/tokens';

// A 17 second proof of the notebook look: the dot drops in and bounces,
// opens its eye, becomes the period of the title card, rides an
// illustrative price line on a charcoal page, then lands in the logo.

export const LAB_TOTAL = 520; // clock units
const S2 = 130;
const S3 = 262;
const S4 = 420;
const KEYS = [0, S2, S3, S4];
const FILE = '013';

// Anton metrics (units per em): advance widths and baseline for line-height 0.92
const ANTON = {baseline: 0.8838, capTop: 0.0245, adv: (s: string) => s.length * 0.005 + ({'FILE 013': 2.9878, 'HOTCOIN 101': 4.4556, VOLATILITY: 3.9263} as Record<string, number>)[s]};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const useGeo = () => {
  const {W, H, vertical: v} = useLayout();
  const r1 = v ? 50 : 46;
  const floor = H * (v ? 0.6 : 0.64);
  const xs = v ? [0.16, 0.36, 0.47, 0.54].map((k) => k * W) : [0.16, 0.33, 0.44, 0.5].map((k) => k * W);
  const hops = v ? [300, 150, 60] : [260, 130, 50];
  // title card
  const S = v ? 240 : 330;
  const s1 = v ? 90 : 120;
  const t2 = v ? H * 0.42 : H * 0.4;
  const base2 = t2 + ANTON.baseline * S;
  const cap2 = t2 + ANTON.capTop * S;
  const base1 = cap2 - S * 0.09;
  const t1 = base1 - ANTON.baseline * s1;
  const w2 = ANTON.adv('FILE 013') * S;
  const r2 = S * 0.1;
  const dot2 = {x: W / 2 + w2 / 2 + S * 0.03 + r2, y: base2 - r2};
  // chart
  const box = v ? {x0: 110, x1: W - 110, y0: H * 0.36, y1: H * 0.68} : {x0: 220, x1: W - 220, y0: H * 0.38, y1: H * 0.8};
  // end card
  const lw = v ? W * 0.7 : W * 0.44;
  const k = lw / LOCKUP.w;
  const lx = (W - lw) / 2;
  const ly = H * (v ? 0.45 : 0.44) - (LOCKUP.h * k) / 2;
  const logoDot = {x: lx + LOCKUP.dot.cx * k, y: ly + LOCKUP.dot.cy * k, r: LOCKUP.dot.r * k};
  return {W, H, v, r1, floor, xs, hops, S, s1, t1, t2, base2, w2, r2, dot2, box, lw, lx, ly, k, logoDot};
};

type Geo = ReturnType<typeof useGeo>;

const PRICE = [
  [0, 0.45], [0.1, 0.56], [0.19, 0.5], [0.31, 0.74], [0.41, 0.63], [0.52, 0.2], [0.6, 0.3], [0.69, 0.14], [0.8, 0.48], [0.9, 0.6], [1, 0.86],
];
const RIDE_AT = S3 + 32;
const chartPts = (g: Geo) => PRICE.map(([px, py]) => ({x: g.box.x0 + px * (g.box.x1 - g.box.x0), y: g.box.y1 - py * (g.box.y1 - g.box.y0)}));

const buildBeats = (g: Geo): Beat[] => {
  const b: Beat[] = [];
  const fy = g.floor - g.r1;
  b.push({at: 0, x: g.xs[0], y: -140, r: g.r1, plain: true});
  b.push({at: 4, x: g.xs[0], y: fy, path: 'drop', plain: true});
  let t = 4 + 12;
  g.hops.forEach((h, i) => {
    b.push({at: t, x: g.xs[i + 1], y: fy, path: 'hop', hop: h, plain: true});
    t += 13 + Math.sqrt(h) * 0.35;
  });
  const land = t;
  const cx = g.xs[3];
  b.push({at: land + 8, x: cx, y: fy, path: 'cut', closed: true});
  b.push({at: land + 22, x: cx, y: fy, path: 'cut', mood: 'surprised', blink: true});
  b.push({at: land + 36, x: cx, y: fy, path: 'cut', mood: 'curious', look: {x: 0, y: fy - 200}});
  b.push({at: land + 48, x: cx, y: fy, path: 'cut', look: {x: g.W, y: fy - 100}});
  b.push({at: land + 60, x: cx, y: fy, path: 'cut', mood: 'happy', look: 'camera'});

  // title card: settles as the period just after the type
  b.push({at: S2 + 20, x: g.dot2.x, y: g.dot2.y, r: g.r2, mood: 'focused', arc: 0.28, dur: 22});
  b.push({at: S2 + 48, x: g.dot2.x, y: g.dot2.y, r: g.r2, path: 'cut', mood: 'happy', blink: true, look: {x: g.W / 2, y: g.t1}});
  b.push({at: S2 + 84, x: g.dot2.x, y: g.dot2.y, r: g.r2, path: 'cut', mood: 'delight', look: 'camera'});

  // chart ride
  const pts = chartPts(g);
  const r3 = g.v ? 34 : 30;
  b.push({at: S3 + 10, x: pts[0].x, y: pts[0].y, r: r3, mood: 'curious', dur: 20, arc: 0.2});
  let rt = RIDE_AT;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    const dur = d / (g.v ? 11 : 16);
    const mood = i === 5 ? 'worried' : i === 7 ? 'skeptical' : i === 8 ? 'happy' : i === 10 ? 'excited' : undefined;
    b.push({at: rt, x: pts[i].x, y: pts[i].y, r: r3, path: 'linear', dur, mood, look: 'ahead'});
    rt += dur;
  }
  b.push({at: rt + 6, x: pts[pts.length - 1].x, y: pts[pts.length - 1].y, r: r3, path: 'cut', mood: 'delight', look: 'camera', blink: true});

  // end card: into the logo
  b.push({at: S4 + 18, x: g.logoDot.x, y: g.logoDot.y, r: g.logoDot.r, mood: 'happy', dur: 26, arc: 0.3});
  b.push({at: S4 + 52, x: g.logoDot.x, y: g.logoDot.y, r: g.logoDot.r, path: 'cut', mood: 'delight'});
  b.push({at: S4 + 66, x: g.logoDot.x, y: g.logoDot.y, r: g.logoDot.r, path: 'cut', mood: 'delight', plain: true});
  return b;
};

const fadeOut = (f: number, at: number, dur = 5) => 1 - clamp((f - at) / dur);

const SceneBounce: React.FC<{g: Geo}> = ({g}) => {
  const f = useFrame();
  const ground: G = 'paper';
  const th = theme(ground);
  const o = fadeOut(f, S2 - 6);
  const fy = g.floor - g.r1;
  const apex = {x: (g.xs[0] + g.xs[1]) / 2, y: fy - g.hops[0]};
  const lineT = clamp(f / 14);
  return (
    <AbsoluteFill>
      <Ground ground={ground} />
      <Chrome ground={ground} file={FILE} keys={KEYS} total={LAB_TOTAL} label="the dot" />
      <AbsoluteFill style={{opacity: o}}>
        <svg width={g.W} height={g.H} style={{position: 'absolute'}}>
          <line x1={g.W * 0.08} y1={g.floor} x2={g.W * 0.08 + g.W * 0.84 * lineT} y2={g.floor} stroke={INK} strokeWidth={2.2} />
        </svg>
        <Note at={20} ground={ground} tone="red" text="squash!" x={g.xs[0] - 150} y={g.floor + 34} from="right" arrow={{x: g.xs[0] - 10, y: g.floor + 8, bend: -0.3}} />
        <Note at={30} ground={ground} text="slow in, slow out" x={apex.x - 40} y={apex.y - 120} from="bottom" arrow={{x: apex.x + 6, y: apex.y - g.r1 - 14, bend: 0.2}} />
        <Note at={72} ground={ground} text="hang on. it blinks?" x={g.xs[3] + (g.v ? -120 : 150)} y={fy - (g.v ? 250 : 200)} from="bottom" arrow={{x: g.xs[3] + g.r1 * 0.9, y: fy - g.r1 * 1.1, bend: -0.25}} />
        <div style={{position: 'absolute', left: g.W * 0.08, top: g.floor + 22, fontFamily: FONT.mono, fontSize: 16, color: th.ghost, opacity: clamp((f - 60) / 8), letterSpacing: 1}}>
          y = floor · g = 1 · bounce 0.5
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneTitle: React.FC<{g: Geo}> = ({g}) => {
  const f = useFrame();
  const ground: G = 'paper';
  const th = theme(ground);
  const glow = clamp((f - S2 - 90) / 20);
  return (
    <AbsoluteFill>
      <Headline at={S2 + 4} text="HOTCOIN 101" size={g.s1} x={0} y={g.t1} width={g.W} align="center" color={th.fg} />
      <Headline at={S2 + 10} text="FILE 013" size={g.S} x={0} y={g.t2} width={g.W} align="center" color={th.fg} />
      <Underline at={S2 + 44} x={g.W / 2 - g.w2 / 2} y={g.base2 + g.S * 0.11} w={g.w2 + g.r2 * 2.4} thick={g.v ? 7 : 9} />
      <Note
        at={S2 + 56}
        ground={ground}
        text="money, explained"
        x={g.v ? g.W / 2 - 60 : g.W / 2 + ANTON.adv('HOTCOIN 101') * g.s1 * 0.5 + 40}
        y={g.v ? g.t1 - 120 : g.t1 - 10}
        from={g.v ? 'bottom' : 'left'}
        arrow={g.v ? {x: g.W / 2 + 70, y: g.t1 + 6, bend: 0.25} : {x: g.W / 2 + ANTON.adv('HOTCOIN 101') * g.s1 * 0.5 + 12, y: g.t1 + g.s1 * 0.5, bend: 0.3}}
      />
      <Note at={S2 + 70} ground={ground} tone="red" text="that's me" rotate={-5} x={g.dot2.x - (g.v ? 150 : 40)} y={g.base2 + g.S * 0.22} from="top" arrow={{x: g.dot2.x + g.r2 * 0.2, y: g.dot2.y + g.r2 * 1.4, bend: -0.35}} />
      <div style={{position: 'absolute', width: g.W, textAlign: 'center', top: g.base2 + g.S * (g.v ? 0.62 : 0.5), fontFamily: FONT.mono, fontSize: g.v ? 22 : 20, letterSpacing: 3, color: th.fg, opacity: 0.55 * clamp((f - S2 - 64) / 10)}}>
        EVERY FRAME DRAWN IN CODE
      </div>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${g.dot2.x}px ${g.dot2.y}px, rgba(126,194,90,${0.18 * glow}) 0, rgba(126,194,90,0) ${g.S * 0.9}px)`}} />
    </AbsoluteFill>
  );
};

const SceneChart: React.FC<{g: Geo; beats: Beat[]}> = ({g, beats}) => {
  const f = useFrame();
  const ground: G = 'ink';
  const th = theme(ground);
  const pts = chartPts(g);
  const pen = f >= RIDE_AT ? poseAt(beats, f) : pts[0];
  const drawn = f >= RIDE_AT ? [...pts.filter((p) => p.x < pen.x - 0.5), {x: pen.x, y: pen.y}] : [pts[0]];
  const line = drawn.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${drawn[drawn.length - 1].x} ${g.box.y1} L ${g.box.x0} ${g.box.y1} Z`;
  const ax = clamp((f - S3 - 12) / 14);
  const startY = pts[0].y;
  const titleS = g.v ? 150 : 150;
  const low = pts[7];
  const up = pts[9];
  return (
    <AbsoluteFill>
      <Ground ground={ground} />
      <Chrome ground={ground} file={FILE} keys={KEYS} total={LAB_TOTAL} label="diagram" />
      <Headline at={S3 + 14} text="VOLATILITY" size={titleS} x={g.v ? 0 : g.box.x0 - 40} y={g.v ? g.H * 0.16 : g.H * 0.1} width={g.v ? g.W : undefined} align={g.v ? 'center' : 'left'} color={th.fg} stagger={1.1} />
      <svg width={g.W} height={g.H} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GREEN} stopOpacity={0.22} />
            <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
          </linearGradient>
        </defs>
        <line x1={g.box.x0} y1={g.box.y1} x2={g.box.x0 + (g.box.x1 - g.box.x0) * ax} y2={g.box.y1} stroke={th.ghost} strokeWidth={1.6} />
        <line x1={g.box.x0} y1={g.box.y1} x2={g.box.x0} y2={g.box.y1 - (g.box.y1 - g.box.y0) * ax} stroke={th.ghost} strokeWidth={1.6} />
        <line x1={g.box.x0} y1={startY} x2={g.box.x1} y2={startY} stroke={th.ghost} strokeWidth={1.4} strokeDasharray="6 9" opacity={clamp((f - S3 - 24) / 8)} />
        <path d={area} fill="url(#area)" />
        <path d={line} stroke={GREEN} strokeWidth={g.v ? 6 : 5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {f >= RIDE_AT && pen.x > low.x && <circle cx={low.x} cy={low.y} r={7} fill={RED} />}
      </svg>
      <div style={{position: 'absolute', left: g.box.x0 - 6, top: g.box.y0 - 44, fontFamily: FONT.hand, fontSize: 28, color: th.ghost, opacity: ax}}>price</div>
      <div style={{position: 'absolute', left: g.box.x1 - 50, top: g.box.y1 + 10, fontFamily: FONT.hand, fontSize: 28, color: th.ghost, opacity: ax}}>time</div>
      <div style={{position: 'absolute', left: g.box.x1 - 150, top: startY - 34, fontFamily: FONT.mono, fontSize: 16, letterSpacing: 1.5, color: th.ghost, opacity: clamp((f - S3 - 28) / 8)}}>START</div>
      <Note at={RIDE_AT + 52} ground={ground} tone="red" text="ouch" x={low.x - (g.v ? 150 : 170)} y={low.y + 40} from="right" arrow={{x: low.x - 14, y: low.y + 10, bend: -0.3}} />
      <Note at={RIDE_AT + 74} ground={ground} text="and back" x={up.x + (g.v ? -170 : 40)} y={up.y + (g.v ? 90 : 70)} from="top" arrow={{x: up.x + 4, y: up.y + 22, bend: 0.3}} />
      <div style={{position: 'absolute', right: g.v ? 110 : 220, top: g.box.y1 + (g.v ? 70 : 48), fontFamily: FONT.mono, fontSize: g.v ? 20 : 17, letterSpacing: 1.5, color: th.ghost, opacity: clamp((f - S3 - 30) / 8)}}>
        ILLUSTRATIVE · NOT REAL DATA
      </div>
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC<{g: Geo}> = ({g}) => {
  const f = useFrame();
  const ground: G = 'paper';
  const th = theme(ground);
  const p = clamp((f - S4 - 10) / 18);
  const e = p * p * (3 - 2 * p);
  const sweep = (g.lx - 80) + (g.lw + 160) * e;
  return (
    <AbsoluteFill>
      <Ground ground={ground} />
      <Chrome ground={ground} file={FILE} keys={KEYS} total={LAB_TOTAL} label="end card" />
      <div style={{position: 'absolute', left: g.lx, top: g.ly, width: g.lw, height: LOCKUP.h * g.k, clipPath: `inset(0 ${(1 - e) * 100}% 0 0)`}}>
        {/* dot-free lockup: the narrator becomes the dot */}
        <Img src={staticFile('brand/hotcoin-lockup-light-nodot.png')} style={{width: g.lw, height: LOCKUP.h * g.k, display: 'block'}} />
      </div>
      {p > 0 && p < 1 && (
        <div style={{position: 'absolute', left: sweep - 40, top: g.ly - 30, width: 80, height: LOCKUP.h * g.k + 60, background: 'linear-gradient(90deg, rgba(126,194,90,0), rgba(126,194,90,0.55), rgba(126,194,90,0))'}} />
      )}
      <div style={{position: 'absolute', width: g.W, top: g.ly + LOCKUP.h * g.k + (g.v ? 70 : 60), textAlign: 'center', fontFamily: FONT.mono, fontSize: g.v ? 26 : 22, letterSpacing: 4, color: th.fg, opacity: 0.7 * clamp((f - S4 - 58) / 10)}}>
        HOTCOIN 101 · MONEY, EXPLAINED
      </div>
    </AbsoluteFill>
  );
};

export const StyleLab: React.FC = () => {
  const f = useFrame();
  const g = useGeo();
  const beats = React.useMemo(() => buildBeats(g), [g.W, g.H]);
  const at3 = poseAt(beats, S3);
  const at4 = poseAt(beats, S4);
  const ground: G = f < S3 + 8 ? 'paper' : f < S4 + 8 ? 'ink' : 'paper';
  return (
    <AbsoluteFill style={{background: PAPER}}>
      {f < S3 + 20 && (
        <AbsoluteFill>
          <SceneBounce g={g} />
          {f >= S2 && <SceneTitle g={g} />}
        </AbsoluteFill>
      )}
      {f >= S3 && f < S4 + 20 && (
        <Wipe at={S3} x={at3.x} y={at3.y} ring={GREEN}>
          <SceneChart g={g} beats={beats} />
        </Wipe>
      )}
      {f >= S4 && (
        <Wipe at={S4} x={at4.x} y={at4.y} ring={INK}>
          <SceneEnd g={g} />
        </Wipe>
      )}
      <Companion beats={beats} ground={ground} floor={f < S2 ? g.floor : undefined} seed={13} />
    </AbsoluteFill>
  );
};
