// Shared bits for the four Hotcoin product shots (1920 x 1080, 60 fps).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile} from 'remotion';

export const FPS = 60;
export const INK = '#07090A', LIME = '#B8F26A', GREEN = '#7EC25A', WHITE = '#F5F7F2', UP = '#2DBD85', DOWN = '#F6465D';
export const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';
export const APPFONT = 'Roboto, "Helvetica Neue", Arial, sans-serif';
export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const sp = (f: number, d = 16, s = 160, m = 1) => spring({frame: f, fps: FPS, config: {damping: d, stiffness: s, mass: m}});
export const io = (x: number) => {x = Math.max(0, Math.min(1, x)); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;};
export const out = (x: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 4);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const fmt = (v: number, d = 2) => v.toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d});

export const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 80px "Inter Tight"', '700 80px "Inter Tight"', '500 30px "Inter Tight"', '500 16px "JetBrains Mono"', '500 16px Roboto', '700 16px Roboto'].map((x) => document.fonts.load(x)))
      .then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};

// Big kinetic word: blur-in, slight rise and tracking, then blur-out. `at`/`until` in frames.
export const Word: React.FC<{f: number; at: number; until: number; text: string; color?: string; size?: number; x?: number | string; y?: number | string; align?: 'left' | 'center'}> =
  ({f, at, until, text, color = WHITE, size = 150, x = '50%', y = '50%', align = 'center'}) => {
  if (f < at - 2 || f > until + 12) return null;
  const a = out((f - at) / 16), b = io((f - until) / 12);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(${align === 'center' ? '-50%' : '0'}, -50%) translateY(${(1 - a) * 30 - b * 20}px) scale(${0.96 + 0.04 * a})`,
      fontFamily: SANS, fontWeight: 600, fontSize: size, letterSpacing: -size * 0.045 + (1 - a) * 8, color, whiteSpace: 'nowrap', opacity: a * (1 - b), filter: `blur(${(1 - a) * 14 + b * 16}px)`}}>{text}</div>
  );
};

// Soft concentric rings + glow, like an Apple keynote backdrop.
export const Rings: React.FC<{cx: number; cy: number; color: string; base?: number; t?: number; n?: number}> = ({cx, cy, color, base = 260, t = 0, n = 6}) => (
  <AbsoluteFill>
    {Array.from({length: n}, (_, i) => {
      const r = base + i * 150 + t * 40;
      return <div key={i} style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `1.5px solid ${color}`, opacity: 0.55 - i * 0.07}} />;
    })}
  </AbsoluteFill>
);

export const Grain: React.FC<{o?: number}> = ({o = 0.07}) => (
  <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '320px 320px', mixBlendMode: 'overlay', opacity: o}} />
);

export const Sparkle: React.FC<{x: number; y: number; s: number; f: number; at: number; color?: string}> = ({x, y, s, f, at, color = WHITE}) => {
  const k = sp(f - at, 12, 220);
  if (f < at) return null;
  return (
    <svg width={s} height={s} viewBox="-1 -1 2 2" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `scale(${k}) rotate(${(f - at) * 0.6}deg)`}}>
      <path d="M0,-1 C0.08,-0.08 0.08,-0.08 1,0 C0.08,0.08 0.08,0.08 0,1 C-0.08,0.08 -0.08,0.08 -1,0 C-0.08,-0.08 -0.08,-0.08 0,-1 Z" fill={color} />
    </svg>
  );
};

export const clampv = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const ip = interpolate;
