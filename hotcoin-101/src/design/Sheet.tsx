import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PaperGrain } from './Paper';
import { useLayout } from './layout';
import { useLook } from './look';
import { CLOCK_FPS, useFrame } from './clock';

/**
 * CUT PAPER
 *
 * A torn sheet of card stock. Content sits on these instead of directly on the
 * page, so every beat is a physical thing that lands rather than text that
 * fades. The torn edge is a clip-path built from a deterministic wobble, so it
 * is different on every sheet but never random between renders.
 */

export { LookProvider, useLook } from './look';
export type { Look } from './look';

const tornPolygon = (seed: number, teeth = 30) => {
  const pts: string[] = ['0% 0%', '100% 0%'];
  for (let i = teeth; i >= 0; i--) {
    const t = i / teeth;
    const w =
      1.5 + Math.sin(seed * 1.9 + i * 1.7) * 1.0 + Math.sin(seed * 3.7 + i * 0.55) * 0.6;
    pts.push(`${(t * 100).toFixed(2)}% ${(100 - w).toFixed(2)}%`);
  }
  return `polygon(${pts.join(',')})`;
};

export const Sheet: React.FC<{
  children: React.ReactNode;
  rot?: number;
  delay?: number;
  seed?: number;
  pad?: number;
  grow?: boolean;
  style?: React.CSSProperties;
}> = ({ children, rot = 0, delay = 0, seed = 1, pad, grow, style }) => {
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const { u } = useLayout();
  const s = spring({ frame: frame - delay, fps, config: { damping: 17, mass: 0.85 } });
  const p = pad ?? 3.2 * u;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        flex: grow ? 1 : undefined,
        transform: `translateY(${(1 - s) * 3.4 * u}px) rotate(${rot * s}deg)`,
        opacity: Math.min(1, s * 1.35),
        filter:
          'drop-shadow(0 9px 15px rgba(70,58,34,0.19)) drop-shadow(0 2px 2px rgba(70,58,34,0.13))',
        ...style,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(158deg, #F6F1E6 0%, #EFE8D9 62%, #E7DECB 100%)',
          clipPath: tornPolygon(seed),
          padding: p,
          paddingBottom: p + 1.5 * u,
          position: 'relative',
          height: grow ? '100%' : undefined,
          boxSizing: 'border-box',
        }}
      >
        {children}
        <AbsoluteFill style={{ opacity: 0.45, pointerEvents: 'none' }}>
          <PaperGrain intensity={0.45} />
        </AbsoluteFill>
      </div>
    </div>
  );
};

/** Renders a Sheet under the cut-paper look, and a plain div otherwise. */
export const MaybeSheet: React.FC<{
  children: React.ReactNode;
  rot?: number;
  delay?: number;
  seed?: number;
  pad?: number;
  style?: React.CSSProperties;
}> = ({ children, style, ...rest }) => {
  const look = useLook();
  if (look !== 'cutPaper') return <div style={style}>{children}</div>;
  return (
    <Sheet {...rest} style={style}>
      {children}
    </Sheet>
  );
};
