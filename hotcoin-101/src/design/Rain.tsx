import React from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLOR } from './tokens';
import { FF } from './fonts';
import { CLOCK_FPS, useFrame } from './clock';

/**
 * CODE RAIN
 *
 * The Beyond the Green background. Every column travels a whole number of
 * passes inside LOOP frames and the glyph shuffle is indexed to the same
 * window, so frame 0 and frame LOOP are identical. It can run under a whole
 * episode with no visible restart.
 */

const GLYPHS = 'アイウエオカキクケコサシスセソ0123456789ABCDEF{}[]<>/\\$#%&*+=';
export const RAIN_LOOP = 120;
const STEP = 26;

export const CodeRain: React.FC<{ opacity?: number }> = ({ opacity }) => {
  const frame = useFrame();
  const { width, height } = useVideoConfig();
  const cols = Math.round(width / 42);
  const colW = width / cols;
  const shuffle = Math.floor((frame % RAIN_LOOP) / 4);
  // the wide cut spreads the same density over more frame, so lift it a little
  const op = opacity ?? (width > height ? 0.52 : 0.42);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: op }}>
      {new Array(cols).fill(0).map((_, c) => {
        const len = 9 + Math.floor(random(`cl${c}`) * 16);
        const cycle = height + len * STEP;
        const passes = 1 + Math.floor(random(`cp${c}`) * 3);
        const speed = (passes * cycle) / RAIN_LOOP;
        const headY = (random(`c0${c}`) * cycle + frame * speed) % cycle;
        return (
          <div key={c} style={{ position: 'absolute', left: c * colW, top: 0, width: colW }}>
            {new Array(len).fill(0).map((_, k) => {
              const y = headY - k * STEP;
              if (y < -STEP || y > height + STEP) return null;
              const g = GLYPHS[Math.floor(random(`g${c}-${k}-${shuffle}`) * GLYPHS.length)];
              const lead = k === 0;
              return (
                <div
                  key={k}
                  style={{
                    position: 'absolute',
                    top: y,
                    fontFamily: FF.mono,
                    fontSize: 20,
                    color: lead ? '#D8FFC4' : COLOR.green,
                    opacity: lead ? 0.72 : Math.max(0, 0.4 - k * 0.023),
                    textShadow: lead ? `0 0 14px ${COLOR.green}` : 'none',
                  }}
                >
                  {g}
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Scanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.3 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity,
      backgroundImage:
        'repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.5) 3px)',
    }}
  />
);
