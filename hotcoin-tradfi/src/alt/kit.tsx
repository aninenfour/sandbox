import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile} from 'remotion';
import {C, DISPLAY, MONO} from './shared';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.83, 0, 0.17, 1);
export const IN = Easing.bezier(0.7, 0, 0.84, 0);
export const MOVE = Easing.bezier(0.45, 0, 0.15, 1);
export const FLOOD = Easing.bezier(0.7, 0, 0.25, 1);
export const ease = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const sp = (f: number, damping = 13, stiffness = 200) => spring({frame: f, fps: 60, config: {damping, stiffness}});
export const bump = (f: number, at: number, len = 10) => interpolate(f, [at - 3, at, at + len], [0, 1, 0], clamp);
export const GRADE = 'grayscale(0.2) sepia(0.14) contrast(1.14)';

// Cursor path: [frame, x, y] keys joined with an ease; presses are frames.
export type Key = [number, number, number];
export const pathAt = (f: number, ks: Key[]) => {
  const fr = ks.map((k) => k[0]);
  const o = {...clamp, easing: MOVE};
  return {x: interpolate(f, fr, ks.map((k) => k[1]), o), y: interpolate(f, fr, ks.map((k) => k[2]), o)};
};

export const Cursor: React.FC<{x: number; y: number; press: number}> = ({x, y, press}) => (
  <svg width={70} height={81} viewBox="0 0 26 30" style={{
    position: 'absolute', left: x - 6.7, top: y - 4, transform: `scale(${1 - press * 0.16})`, transformOrigin: '7px 4px', overflow: 'visible',
    filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))',
  }}>
    <path d="M2.5 1.5 L2.5 22.5 L7.6 17.8 L11.2 26.2 L15 24.6 L11.5 16.4 L18.5 16.4 Z" fill="#FFFFFF" stroke={C.ink} strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

// Text through a hard mask: rises in, rises out. No opacity.
export const Slot: React.FC<{
  f: number; at: number; out?: number; y: number; h: number; x?: number; w?: number;
  align?: 'left' | 'center'; style?: React.CSSProperties; children: React.ReactNode;
}> = ({f, at, out, y, h, x = 0, w = 1080, align = 'center', style, children}) => {
  if (f < at || (out !== undefined && f >= out + 14)) return null;
  const ty = (1 - ease(f, at, at + 18)) * 110 - (out === undefined ? 0 : ease(f, out, out + 14, IN)) * 110;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', textAlign: align}}>
      <div style={{transform: `translateY(${ty}%)`, height: h, lineHeight: `${h}px`, whiteSpace: 'nowrap', ...style}}>{children}</div>
    </div>
  );
};

export const AnimatedGrain: React.FC<{f: number; opacity?: number}> = ({f, opacity = 0.3}) => {
  const n = Math.floor(f / 2);
  const r = (s: number) => {const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};
  return (
    <AbsoluteFill style={{
      backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px',
      backgroundPosition: `${r(n) * 384}px ${r(n + 99) * 384}px`, mixBlendMode: 'overlay', opacity,
    }} />
  );
};

export const pillBg = 'linear-gradient(180deg, #A2DA83 0%, #7EC25A 52%, #67A945 100%)';
export const pillShadow = 'inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -4px 0 rgba(0,0,0,0.18), 0 18px 36px rgba(0,0,0,0.28)';

// End card on ink: the logo keyed out of the Hotcoin recording (never redrawn), the URL, a green underline pill.
export const EndCard: React.FC<{f: number; at: number; y: number; logoW: number}> = ({f, at, y, logoW}) => {
  if (f < at) return null;
  const lh = logoW * (93 / 485);
  const wipe = ease(f, at, at + 22, Easing.bezier(0.65, 0, 0.2, 1));
  const pill = ease(f, at + 28, at + 50);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(110% 70% at 50% 18%, #1A2027 0%, #0B0E11 62%)'}}>
      <div style={{position: 'absolute', left: (1080 - logoW) / 2, top: y - lh, width: logoW, height: lh, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`}}>
        <Img src={staticFile('brand/logo.png')} style={{width: logoW, height: lh}} />
      </div>
      <Slot f={f} at={at + 14} y={y + 60} h={60} style={{fontFamily: MONO, fontWeight: 500, fontSize: 40, color: C.paper}}>hotcoin.com/en_US/tradFi</Slot>
      {pill > 0 && (
        <div style={{position: 'absolute', left: 540 - (18 + pill * 170) / 2, top: y + 158, width: 18 + pill * 170, height: 18, borderRadius: 9, background: pillBg, boxShadow: pillShadow}} />
      )}
    </AbsoluteFill>
  );
};

export const Display: React.CSSProperties = {fontFamily: DISPLAY};
