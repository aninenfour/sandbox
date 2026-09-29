import {useCurrentFrame, useVideoConfig} from 'remotion';

// Same contract as the series clock: render at 60fps, author every timing in
// 30fps units. When the original project lands, keep its clock.ts and delete
// this one; the API matches.
export const CLOCK_FPS = 30;
export const RENDER_FPS = 60;

export const useFrame = (): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (frame * CLOCK_FPS) / fps;
};

// Seconds -> clock units
export const sec = (s: number) => s * CLOCK_FPS;
// Clock units -> real frames (for Sequence from/durationInFrames)
export const real = (units: number) => Math.round((units * RENDER_FPS) / CLOCK_FPS);
