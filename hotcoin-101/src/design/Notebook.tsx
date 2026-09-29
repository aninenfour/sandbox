import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useFrame} from './clock';
import {FONT, GREEN, RED, theme, type Ground as GroundKind} from './tokens';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};
const outBack = (t: number, s = 1.6) => {
  if (t >= 1) return 1;
  if (t <= 0) return 0;
  const v = t - 1;
  return 1 + (s + 1) * v * v * v + s * v * v;
};

export const useLayout = () => {
  const {width, height} = useVideoConfig();
  return {W: width, H: height, vertical: height > width};
};

// Ground: paper with fine grain, or charcoal with a dot grid. Static texture
// so landed text stays pixel-identical frame to frame.
export const Ground: React.FC<{ground: GroundKind}> = ({ground}) => {
  const {W, H} = useLayout();
  const th = theme(ground);
  const gap = 36;
  return (
    <AbsoluteFill style={{background: th.bg}}>
      {ground === 'ink' && (
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <defs>
            <pattern id="dots" width={gap} height={gap} patternUnits="userSpaceOnUse">
              <circle cx={gap / 2} cy={gap / 2} r={1.3} fill="rgba(237,236,231,0.13)" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#dots)" />
        </svg>
      )}
      <svg width={W} height={H} style={{position: 'absolute', mixBlendMode: ground === 'paper' ? 'multiply' : 'screen', opacity: ground === 'paper' ? 0.5 : 0.18}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.35 0" />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
      <AbsoluteFill
        style={{
          background:
            ground === 'paper'
              ? 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(40,38,30,0.14) 100%)'
              : 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

// Header rail, timecode, keyframe timeline and registration marks.
// Subordinate by design: small, thin, low contrast.
export const Chrome: React.FC<{ground: GroundKind; file: string; keys: number[]; total: number; label?: string}> = ({ground, file, keys, total, label}) => {
  const real = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = useFrame();
  const {W, H, vertical} = useLayout();
  const th = theme(ground);
  const m = vertical ? 64 : 56;
  const tc = (() => {
    const fr = Math.floor(real / (fps / 30));
    const s = Math.floor(fr / 30);
    const p = (n: number) => String(n).padStart(2, '0');
    return `00:${p(Math.floor(s / 60))}:${p(s % 60)}:${p(fr % 30)}`;
  })();
  const tlY = H - (vertical ? 150 : 64);
  const x0 = m;
  const x1 = W - m;
  const head = x0 + (x1 - x0) * clamp(f / total);
  const mark = (x: number, y: number) => (
    <g stroke={th.ghost} strokeWidth={1.2}>
      <circle cx={x} cy={y} r={7} fill="none" />
      <line x1={x - 12} y1={y} x2={x + 12} y2={y} />
      <line x1={x} y1={y - 12} x2={x} y2={y + 12} />
    </g>
  );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: m, top: m - 8, display: 'flex', alignItems: 'center', gap: 16}}>
        <Img src={staticFile(`brand/hotcoin-lockup-${ground === 'paper' ? 'light' : 'dark'}.png`)} style={{height: 26}} />
        <span style={{fontFamily: FONT.mono, fontSize: 17, color: th.ghost, letterSpacing: 1.5}}>101 · FILE {file}</span>
      </div>
      <div style={{position: 'absolute', right: m, top: m - 4, fontFamily: FONT.mono, fontSize: 17, color: th.ghost, letterSpacing: 1}}>{tc}</div>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {mark(m - 20, H * 0.5)}
        {mark(W - m + 20, H * 0.5)}
        <line x1={x0} y1={tlY} x2={x1} y2={tlY} stroke={th.ghost} strokeWidth={1.2} />
        {keys.map((k, i) => {
          const x = x0 + (x1 - x0) * (k / total);
          const passed = f >= k;
          return <rect key={i} x={x - 5} y={tlY - 5} width={10} height={10} transform={`rotate(45 ${x} ${tlY})`} fill={passed ? th.fg : 'none'} stroke={th.ghost} strokeWidth={1.2} opacity={passed ? 0.55 : 1} />;
        })}
        <line x1={head} y1={tlY - 14} x2={head} y2={tlY + 8} stroke={GREEN} strokeWidth={2} />
      </svg>
      {label && (
        <div style={{position: 'absolute', left: head - 100, width: 200, textAlign: 'center', top: tlY - 42, fontFamily: FONT.hand, fontSize: 24, color: th.ghost}}>{label}</div>
      )}
    </AbsoluteFill>
  );
};

// Handwritten note that writes on left to right, then an arrow draws to its
// target. Once written it never moves.
export const Note: React.FC<{
  at: number;
  x: number;
  y: number;
  text: string;
  ground: GroundKind;
  tone?: 'note' | 'red' | 'fg';
  size?: number;
  rotate?: number;
  arrow?: {x: number; y: number; bend?: number}; // absolute target point
  from?: 'left' | 'right' | 'bottom' | 'top';
  strike?: boolean;
  width?: number;
}> = ({at, x, y, text, ground, tone = 'note', size = 34, rotate = -3, arrow, from = 'left', strike, width}) => {
  const f = useFrame();
  const {W, H} = useLayout();
  const th = theme(ground);
  const color = tone === 'red' ? RED : tone === 'fg' ? th.fg : th.note;
  const writeDur = 4 + text.length * 0.55;
  const w = clamp((f - at) / writeDur);
  if (f < at) return null;
  const tw = width ?? text.length * size * 0.42;
  const anchor = {
    left: {x: x - 8, y: y + size * 0.6},
    right: {x: x + tw + 8, y: y + size * 0.6},
    bottom: {x: x + tw * 0.4, y: y + size * 1.25},
    top: {x: x + tw * 0.4, y: y - 4},
  }[from];
  const a0 = at + writeDur * 0.7;
  const aT = clamp((f - a0) / 9);
  let arrowEl: React.ReactNode = null;
  if (arrow && aT > 0) {
    const dx = arrow.x - anchor.x;
    const dy = arrow.y - anchor.y;
    const len = Math.hypot(dx, dy);
    const bend = arrow.bend ?? 0.25;
    const cx = anchor.x + dx / 2 - dy * bend;
    const cy = anchor.y + dy / 2 + dx * bend;
    const approx = len * 1.15;
    // arrowhead from the tangent at the end
    const tx = arrow.x - cx;
    const ty = arrow.y - cy;
    const tl = Math.hypot(tx, ty) || 1;
    const ux = tx / tl;
    const uy = ty / tl;
    const hs = 14;
    const h1 = {x: arrow.x - ux * hs - uy * hs * 0.6, y: arrow.y - uy * hs + ux * hs * 0.6};
    const h2 = {x: arrow.x - ux * hs + uy * hs * 0.6, y: arrow.y - uy * hs - ux * hs * 0.6};
    const head = clamp((f - a0 - 8) / 3);
    arrowEl = (
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <path
          d={`M ${anchor.x} ${anchor.y} Q ${cx} ${cy} ${arrow.x} ${arrow.y}`}
          stroke={color}
          strokeWidth={2.6}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={approx}
          strokeDashoffset={approx * (1 - smooth(aT))}
        />
        <path d={`M ${h1.x} ${h1.y} L ${arrow.x} ${arrow.y} L ${h2.x} ${h2.y}`} stroke={color} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={head} />
      </svg>
    );
  }
  const st = strike ? clamp((f - at - writeDur - 6) / 6) : 0;
  return (
    <>
      {arrowEl}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          fontFamily: FONT.hand,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.1,
          color,
          whiteSpace: 'nowrap',
          transform: `rotate(${rotate}deg)`,
          transformOrigin: 'left center',
          clipPath: `inset(-20% ${(1 - w) * 100}% -20% 0)`,
        }}
      >
        {text}
        {st > 0 && <div style={{position: 'absolute', left: -4, top: '55%', height: 3, width: `calc(${st * 100}% + 8px)`, background: color, borderRadius: 2}} />}
      </div>
    </>
  );
};

// Condensed display line. Letters drop in with overlap and a touch of
// rotation, stagger about 45ms, and land at exactly zero offset.
export const Headline: React.FC<{
  at: number;
  text: string;
  size: number;
  x: number;
  y: number; // top
  color: string;
  stagger?: number;
  align?: 'left' | 'center';
  width?: number;
}> = ({at, text, size, x, y, color, stagger = 1.35, align = 'left', width}) => {
  const f = useFrame();
  const chars = text.split('');
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        textAlign: align,
        fontFamily: FONT.display,
        fontSize: size,
        lineHeight: 0.92,
        color,
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
        letterSpacing: size * 0.005,
      }}
    >
      {chars.map((c, i) => {
        const t = (f - at - i * stagger) / 11;
        const p = outBack(t, 1.4);
        const landed = t >= 1;
        const dy = landed ? 0 : (1 - p) * size * 0.55;
        const rot = landed ? 0 : (1 - p) * (i % 2 ? 9 : -7);
        const o = clamp(t * 3);
        return (
          <span key={i} style={{display: 'inline-block', transform: landed ? undefined : `translateY(${dy}px) rotate(${rot}deg)`, opacity: o, whiteSpace: 'pre'}}>
            {c}
          </span>
        );
      })}
    </div>
  );
};

// Hand-drawn underline that sweeps in.
export const Underline: React.FC<{at: number; x: number; y: number; w: number; color?: string; dur?: number; thick?: number}> = ({at, x, y, w, color = GREEN, dur = 12, thick = 7}) => {
  const f = useFrame();
  const {W, H} = useLayout();
  const t = smooth((f - at) / dur);
  if (t <= 0) return null;
  const d = `M ${x} ${y + 4} C ${x + w * 0.3} ${y - 3}, ${x + w * 0.62} ${y + 6}, ${x + w} ${y - 2}`;
  const len = w * 1.03;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <path d={d} stroke={color} strokeWidth={thick} strokeLinecap="round" fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - t)} />
    </svg>
  );
};

// Iris wipe out of a point: the next page grows from the narrator,
// led by two thin rings.
export const Wipe: React.FC<{at: number; x: number; y: number; dur?: number; children: React.ReactNode; ring?: string}> = ({at, x, y, dur = 16, children, ring = GREEN}) => {
  const f = useFrame();
  const {W, H} = useLayout();
  const far = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 40;
  const t = clamp((f - at) / dur);
  const e = t * t * (3 - 2 * t);
  const e2 = clamp((f - at - 2) / dur);
  const r = e * far;
  if (t <= 0) return null;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: t >= 1 ? undefined : `circle(${r}px at ${x}px ${y}px)`}}>{children}</AbsoluteFill>
      {t < 1 && (
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <circle cx={x} cy={y} r={r} fill="none" stroke={ring} strokeWidth={6} />
          <circle cx={x} cy={y} r={Math.max(0, r - 26 - 30 * (1 - e2))} fill="none" stroke={ring} strokeWidth={2} opacity={0.6} />
        </svg>
      )}
    </AbsoluteFill>
  );
};
