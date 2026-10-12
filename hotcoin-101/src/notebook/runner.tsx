import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile} from 'remotion';
import {Companion, poseAt, type Beat} from '../companion/Companion';
import {useFrame} from '../design/clock';
import {Chrome, Ground, Wipe} from './Notebook';
import {FONT, GREEN, INK, LOCKUP, PAPER, theme, type Ground as G} from './tokens';
import {real} from './time';

// Shared plumbing for notebook-look episodes (FILE 014 onward): a timeline
// built from the voiceover's word timings, scene stages with iris wipes on
// ground changes, the narrator on top, voice and music, and the end card.

type W = {word: string; at: number; until: number};
type Words = {words: W[]};

const strip = (s: string) => s.replace(/[.,!?…;:]+$/g, '');

export const makeTimeline = (open: Words, body: Words, opts: {titleLen?: number; endHold?: number} = {}) => {
  const find = (list: W[], word: string, n: number) => {
    let k = 0;
    for (const x of list) if (strip(x.word) === word && ++k === n) return x;
    throw new Error(`word not found: ${word} #${n}`);
  };
  const OPEN_AT = 12;
  const openEnd = open.words[open.words.length - 1].until;
  const TITLE_AT = Math.round(OPEN_AT + openEnd + 8);
  const BODY_AT = TITLE_AT + (opts.titleLen ?? 100);
  const bodyEnd = BODY_AT + body.words[body.words.length - 1].until;
  const END_AT = Math.round(bodyEnd + 16);
  const TOTAL = END_AT + (opts.endHold ?? 130);
  return {
    OPEN_AT,
    TITLE_AT,
    BODY_AT,
    END_AT,
    TOTAL,
    /** global clock time of the nth occurrence of a body word (case-sensitive) */
    w: (word: string, n = 1) => BODY_AT + find(body.words, word, n).at,
    /** global clock time of a cold-open word */
    ow: (word: string, n = 1) => OPEN_AT + find(open.words, word, n).at,
  };
};

export type BaseGeo = {
  W: number;
  H: number;
  v: boolean;
  cx: number;
  cy: number;
  r: number;
  kickerY: number;
};

export const endGeo = (W: number, H: number, v: boolean) => {
  const lw = v ? W * 0.7 : W * 0.44;
  const k = lw / LOCKUP.w;
  const lx = (W - lw) / 2;
  const ly = H * (v ? 0.43 : 0.44) - (LOCKUP.h * k) / 2;
  return {lw, k, lx, ly, logoDot: {x: lx + LOCKUP.dot.cx * k, y: ly + LOCKUP.dot.cy * k, r: LOCKUP.dot.r * k}};
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const sm = (t: number) => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};
export const win = (f: number, at: number, dur: number) => clamp((f - at) / dur);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const outBack = (t: number, s = 1.7) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const v = t - 1;
  return 1 + (s + 1) * v * v * v + s * v * v;
};

export const Svg: React.FC<{g: BaseGeo; children: React.ReactNode}> = ({g, children}) => (
  <svg width={g.W} height={g.H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);

export const Kicker: React.FC<{g: BaseGeo; at: number; text: string; ground: G}> = ({g, at, text, ground}) => {
  const f = useFrame();
  const th = theme(ground);
  const o = win(f, at, 8);
  return (
    <div
      style={{
        position: 'absolute',
        left: g.v ? 0 : 120,
        width: g.v ? g.W : undefined,
        textAlign: g.v ? 'center' : 'left',
        top: g.kickerY,
        fontFamily: FONT.mono,
        fontSize: g.v ? 24 : 22,
        letterSpacing: 4,
        color: th.fg,
        opacity: 0.6 * o,
        clipPath: `inset(0 ${(1 - sm(o)) * 100}% 0 0)`,
      }}
    >
      {text}
    </div>
  );
};

export const Mono: React.FC<{x: number; y: number; text: string; ground: G; at: number; size?: number; align?: 'left' | 'center' | 'right'; w?: number; color?: string}> = ({
  x,
  y,
  text,
  ground,
  at,
  size = 18,
  align = 'left',
  w: width,
  color,
}) => {
  const f = useFrame();
  const th = theme(ground);
  return (
    <div style={{position: 'absolute', left: x, top: y, width, textAlign: align, fontFamily: FONT.mono, fontSize: size, letterSpacing: 2.5, color: color ?? th.ghost, opacity: win(f, at, 8), whiteSpace: 'nowrap'}}>
      {text}
    </div>
  );
};

export const EndCard: React.FC<{W: number; H: number; v: boolean; at: number}> = ({W, H, v, at}) => {
  const f = useFrame();
  const th = theme('paper');
  const e = endGeo(W, H, v);
  const p = clamp((f - at - 10) / 18);
  const ee = p * p * (3 - 2 * p);
  const sweep = e.lx - 80 + (e.lw + 160) * ee;
  const lh = LOCKUP.h * e.k;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: e.lx, top: e.ly, width: e.lw, height: lh, clipPath: `inset(0 ${(1 - ee) * 100}% 0 0)`}}>
        <Img src={staticFile('brand/hotcoin-lockup-light-nodot.png')} style={{width: e.lw, height: lh, display: 'block'}} />
      </div>
      {p > 0 && p < 1 && <div style={{position: 'absolute', left: sweep - 40, top: e.ly - 30, width: 80, height: lh + 60, background: 'linear-gradient(90deg, rgba(126,194,90,0), rgba(126,194,90,0.55), rgba(126,194,90,0))'}} />}
      <div style={{position: 'absolute', width: W, top: e.ly + lh + (v ? 70 : 60), textAlign: 'center', fontFamily: FONT.mono, fontSize: v ? 26 : 22, letterSpacing: 4, color: th.fg, opacity: 0.7 * win(f, at + 58, 10)}}>
        HOTCOIN 101 · MONEY, EXPLAINED
      </div>
      <div style={{position: 'absolute', width: W, top: e.ly + lh + (v ? 118 : 100), textAlign: 'center', fontFamily: FONT.mono, fontSize: v ? 24 : 20, letterSpacing: 3, color: GREEN, opacity: win(f, at + 70, 10)}}>
        hotcoin.com
      </div>
    </AbsoluteFill>
  );
};

/** narrator beats that carry the dot into the logo on the end card */
export const endBeats = (W: number, H: number, v: boolean, at: number): Beat[] => {
  const d = endGeo(W, H, v).logoDot;
  return [
    {at: at + 18, x: d.x, y: d.y, r: d.r, mood: 'happy', dur: 26, arc: 0.3},
    {at: at + 52, x: d.x, y: d.y, r: d.r, path: 'cut', mood: 'delight'},
    {at: at + 66, x: d.x, y: d.y, r: d.r, path: 'cut', mood: 'delight', plain: true},
  ];
};

export type SceneDef<Geo> = {key: string; from: number; ground: G; label: string; C: React.FC<{g: Geo}>; floor?: (g: Geo) => number};

const WIPE = 16;

export function EpisodeRunner<Geo extends BaseGeo>({
  scenes,
  g,
  beats,
  total,
  file,
  seed,
  voice,
}: {
  scenes: SceneDef<Geo>[];
  g: Geo;
  beats: Beat[];
  total: number;
  file: string;
  seed: number;
  voice: {src: string; at: number}[];
}) {
  const f = useFrame();
  const keys = scenes.map((s) => s.from);
  let current = 0;
  scenes.forEach((s, i) => {
    if (f >= s.from) current = i;
  });

  const layers: React.ReactNode[] = [];
  scenes.forEach((def, i) => {
    const from = def.from;
    const next = scenes[i + 1];
    const to = next ? next.from : total + 1;
    const prev = scenes[i - 1];
    const wiped = !!prev && prev.ground !== def.ground;
    const nextWiped = !!next && next.ground !== def.ground;
    const until = nextWiped ? to + WIPE + 1 : to;
    if (f < from || f >= until) return;
    const fadeIn = !wiped && i > 0 && def.key !== 'title';
    const fadeOut = !nextWiped && !!next && next.key !== 'title';
    const o = Math.min(fadeIn ? Math.min(1, (f - from) / 5) : 1, fadeOut ? 1 - clamp((f - (to - 6)) / 6) : 1);
    const stage = (
      <AbsoluteFill>
        <Ground ground={def.ground} />
        <Chrome ground={def.ground} file={file} keys={keys} total={total} label={def.label} />
        <AbsoluteFill style={{opacity: Math.max(0, o)}}>
          <def.C g={g} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
    if (wiped) {
      const p = poseAt(beats, from);
      layers.push(
        <Wipe key={def.key} at={from} x={p.x} y={p.y} ring={def.ground === 'ink' ? GREEN : INK}>
          {stage}
        </Wipe>,
      );
    } else {
      layers.push(<AbsoluteFill key={def.key}>{stage}</AbsoluteFill>);
    }
  });

  const cur = scenes[current];
  const prevDef = scenes[current - 1];
  const ground: G = prevDef && prevDef.ground !== cur.ground && f < cur.from + WIPE / 2 ? prevDef.ground : cur.ground;
  const floor = cur.floor ? cur.floor(g) : undefined;

  return (
    <AbsoluteFill style={{background: PAPER}}>
      {layers}
      <Companion beats={beats} ground={ground} floor={floor} seed={seed} />
      {voice.map((v) => (
        <Sequence key={v.src} from={real(v.at)} layout="none">
          <Audio src={staticFile(v.src)} />
        </Sequence>
      ))}
      <Audio
        src={staticFile('music/serene-view-bed.mp3')}
        volume={(fr) => interpolate(fr, [0, real(20), real(total) - real(70), real(total)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      />
    </AbsoluteFill>
  );
}
