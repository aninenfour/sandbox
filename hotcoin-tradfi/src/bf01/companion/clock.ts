import { useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * THE AUTHORING CLOCK
 *
 * Every delay, spring and draw-on in the engine was written in 30fps frames.
 * Rendering at 60fps would halve all of them. Instead, components read time
 * from this clock, which always counts in 30fps units and simply lands on
 * half-frames at 60. Springs in Remotion evaluate cleanly at fractional
 * frames, so the result is the same timing with twice the samples.
 */
export const CLOCK_FPS = 30;

export const useFrame = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (frame * CLOCK_FPS) / fps;
};

/** A real-frame count converted into authoring units. */
export const useToClock = () => {
  const { fps } = useVideoConfig();
  return (realFrames: number) => (realFrames * CLOCK_FPS) / fps;
};
