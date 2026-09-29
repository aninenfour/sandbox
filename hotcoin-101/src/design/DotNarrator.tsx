import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Dot, DOT_ANCHOR, DOT_BOX, Mood } from './Dot';
import { useTheme } from './theme';
import { CLOCK_FPS, useFrame } from './clock';

export type DotStop = {
  /** Frame this stop takes over. */
  start: number;
  /** Position of the dot centre, as a fraction of the frame. */
  x: number;
  y: number;
  /** Radius in px. */
  r: number;
  mood: Mood;
  hidden?: boolean;
  /** Final stop: the face fades once it lands, leaving the brand dot. */
  settle?: boolean;
};

/**
 * Moves the dot from stop to stop. Position is a pure function of the frame,
 * so the motion trail is just the same function sampled a few frames back.
 */
export const DotNarrator: React.FC<{ stops: DotStop[] }> = ({ stops }) => {
  const frame = useFrame();
  const { width, height } = useVideoConfig();
  const fps = CLOCK_FPS;
  const theme = useTheme();

  if (stops.length === 0) return null;

  const sample = (f: number) => {
    let i = 0;
    for (let k = 0; k < stops.length; k++) {
      if (f >= stops[k].start) i = k;
    }
    const cur = stops[i];
    const prev = stops[i - 1] ?? cur;
    const s = spring({
      frame: f - cur.start,
      fps,
      config: { damping: 15, mass: 0.9, stiffness: 90 },
    });
    return {
      x: (prev.x + (cur.x - prev.x) * s) * width,
      y: (prev.y + (cur.y - prev.y) * s) * height,
      r: prev.r + (cur.r - prev.r) * s,
      opacity: (prev.hidden ? 0 : 1) + ((cur.hidden ? 0 : 1) - (prev.hidden ? 0 : 1)) * s,
      mood: cur.mood,
      settle: cur.settle,
      since: f - cur.start,
    };
  };

  const now = sample(frame);
  const face = now.settle
    ? Math.max(0, Math.min(1, 1 - (now.since - 34) / 16))
    : 1;
  const back = sample(frame - 1);
  const dx = now.x - back.x;
  const dy = now.y - back.y;
  const speed = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const stretch = Math.min(0.28, speed / 90);
  const moving = speed > 1.2;

  const place = (p: { x: number; y: number; r: number }) => {
    const S = p.r * DOT_BOX;
    return {
      position: 'absolute' as const,
      left: p.x - DOT_ANCHOR.x * S,
      top: p.y - DOT_ANCHOR.y * S,
    };
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {moving
        ? [4, 8, 12].map((back2, i) => {
            const g = sample(frame - back2);
            return (
              <div key={i} style={place(g)}>
                <div
                  style={{
                    width: g.r * 2,
                    height: g.r * 2,
                    marginLeft: (DOT_ANCHOR.x * g.r * DOT_BOX) - g.r,
                    marginTop: (DOT_ANCHOR.y * g.r * DOT_BOX) - g.r,
                    borderRadius: '50%',
                    background: theme.green,
                    opacity: g.opacity * (0.2 - i * 0.06),
                  }}
                />
              </div>
            );
          })
        : null}

      <div style={place(now)}>
        <Dot
          r={now.r}
          mood={now.mood}
          stretch={moving ? stretch : 0}
          angle={angle}
          opacity={now.opacity}
          face={face}
          lid={theme.paper}
        />
      </div>
    </AbsoluteFill>
  );
};
