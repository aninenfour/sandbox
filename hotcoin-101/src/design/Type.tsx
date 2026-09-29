import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FF } from './fonts';
import { useLayout } from './layout';
import { useTheme } from './theme';
import { CLOCK_FPS, useFrame } from './clock';

/** Ink-rise: text settles onto the page like it was pressed there. */
export const useInk = (delay = 0, damping = 200) => {
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const s = spring({ frame: frame - delay, fps, config: { damping, mass: 0.7 } });
  // Once text has landed it must be pixel-still. Springs creep toward 1
  // forever, and sub-pixel movement or a near-zero blur makes type shimmer.
  if (s > 0.992) return { opacity: 1 };
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(s, [0, 1], [14, 0])}px)`,
    filter: `blur(${interpolate(s, [0, 0.4, 1], [4, 0.6, 0])}px)`,
  };
};

export const Kicker: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
}> = ({ children, delay = 0, color }) => {
  const { type, u } = useLayout();
  const t = useTheme();
  const ink = useInk(delay);
  return (
    <div
      style={{
        ...ink,
        fontFamily: FF.mono,
        fontSize: type.kicker,
        letterSpacing: 0.42 * u * 0.1 + 3,
        textTransform: 'uppercase',
        color: color ?? t.inkSoft,
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
};

export const Title: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  color?: string;
  italic?: boolean;
  align?: React.CSSProperties['textAlign'];
}> = ({ children, delay = 0, size, color, italic, align = 'left' }) => {
  const { type } = useLayout();
  const t = useTheme();
  const ink = useInk(delay);
  // A grotesk heading does not italicise, so in that look the secondary voice
  // is carried by weight and colour instead.
  const slant = italic && t.italicOk;
  return (
    <div
      style={{
        ...ink,
        fontFamily: t.display,
        fontSize: size ?? type.title,
        lineHeight: t.displayLine,
        letterSpacing: t.displayTracking,
        color: color ?? t.ink,
        fontWeight: italic && !t.italicOk ? Math.max(500, t.displayWeight - 200) : t.displayWeight,
        fontStyle: slant ? 'italic' : 'normal',
        textAlign: align,
      }}
    >
      {children}
    </div>
  );
};

export const Body: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
  size?: number;
  maxWidth?: number | string;
}> = ({ children, delay = 0, color, size, maxWidth }) => {
  const { type } = useLayout();
  const t = useTheme();
  const ink = useInk(delay);
  return (
    <div
      style={{
        ...ink,
        fontFamily: FF.ui,
        fontSize: size ?? type.body,
        lineHeight: 1.42,
        color: color ?? t.inkSoft,
        fontWeight: 400,
        maxWidth,
      }}
    >
      {children}
    </div>
  );
};

export const Mono: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
  size?: number;
}> = ({ children, delay = 0, color, size }) => {
  const { type } = useLayout();
  const t = useTheme();
  const ink = useInk(delay);
  return (
    <div
      style={{
        ...ink,
        fontFamily: FF.mono,
        fontSize: size ?? type.small,
        color: color ?? t.inkFaint,
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </div>
  );
};

/** Hand-drawn ink rule that draws itself in. */
export const InkRule: React.FC<{
  delay?: number;
  width?: number | string;
  color?: string;
  thickness?: number;
}> = ({ delay = 0, width = '100%', color, thickness = 2 }) => {
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const t = useTheme();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        width,
        height: thickness,
        background: color ?? t.ink,
        boxShadow: color && color === t.green ? t.accentGlow : undefined,
        transform: `scaleX(${s})`,
        transformOrigin: 'left center',
        opacity: t.texture ? 0.85 : 1,
      }}
    />
  );
};

/** Green marker highlight that sweeps across a phrase. */
export const Highlight: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
}> = ({ children, delay = 0, color }) => {
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const t = useTheme();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.9 } });
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        style={{
          position: 'absolute',
          left: '-0.14em',
          right: '-0.14em',
          top: '0.08em',
          bottom: '0.06em',
          background: color ?? t.greenWash,
          transform: `scaleX(${s})`,
          transformOrigin: 'left center',
          borderRadius: 2,
        }}
      />
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  );
};
