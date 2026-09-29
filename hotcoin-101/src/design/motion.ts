import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * MOTION
 *
 * The series had one timing bug running through every block: entrances used
 * fixed frame delays, so a seven second page finished all of its movement in
 * the first second and then held a still frame for six. Shortening the page
 * only trims the dead tail.
 *
 * These helpers make timing a fraction of the beat instead of a constant, so
 * motion spreads across however long the page is actually on screen, and add
 * the two layers that were missing: a slow push that never stops, and a
 * second act in the back half.
 */

/** Scale for authored delays, so 30fps timings survive a move to 60fps. */
export const useFrameScale = () => useVideoConfig().fps / 30;

/** Where we are inside this page. `t` runs 0 to 1 across the beat. */
export const useBeat = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: d, fps } = useVideoConfig();
  return { frame, d, fps, t: d > 1 ? Math.min(1, frame / (d - 1)) : 0 };
};

const smooth = (x: number) => x * x * (3 - 2 * x);

/**
 * Entrance delays spread across a window of the beat rather than the first
 * few frames. Default window is 6% to 45%, so the last item is still arriving
 * almost halfway through the page.
 */
export const useStagger = (n: number, from = 0.06, to = 0.45) => {
  const { d, fps } = useBeat();
  // returned in 30fps authoring units, to match the clock the blocks read
  const d30 = (d * 30) / fps;
  const a = from * d30;
  const b = to * d30;
  const step = n > 1 ? (b - a) / (n - 1) : 0;
  return (i: number) => a + i * step;
};

/**
 * The slow push. Runs the entire beat and eases at both ends, so a page is
 * never actually frozen even when nothing is entering or leaving.
 */
export const useDrift = (strength = 1) => {
  const { t } = useBeat();
  const e = smooth(t);
  return {
    transform: `scale(${1 + 0.016 * strength * e}) translateY(${-7 * strength * e}px)`,
  } as const;
};

/**
 * The second act: 0 through the first half, then 0 to 1 across a window in
 * the back half. Blocks use it to do one more thing once everything has
 * landed, which is the stretch that used to be dead.
 */
export const useSecondAct = (from = 0.52, to = 0.82) => {
  const { t } = useBeat();
  return interpolate(t, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

/**
 * A reading highlight that travels down `n` rows during the back half, so the
 * eye is led through the content a second time instead of staring at it.
 */
export const useReadthrough = (n: number, from = 0.5, to = 0.9) => {
  const { t } = useBeat();
  const p = interpolate(t, [from, to], [0, n], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (i: number) => {
    const d = Math.abs(p - (i + 0.5));
    return Math.max(0, 1 - d * 1.8);
  };
};

/** The last stretch before the cut, so the page is already leaving. */
export const usePreExit = (from = 0.88) => {
  const { t } = useBeat();
  const e = interpolate(t, [from, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { lift: -10 * e, dim: 1 - 0.12 * e };
};

/** Beat length in 30fps authoring units, for blocks that read the clock. */
export const useBeat30 = () => {
  const { d, fps } = useBeat();
  return (d * 30) / fps;
};

/**
 * A light sweep that crosses an element once inside a window of the beat.
 * Returns the sweep's position as a percentage, or null when it is not on.
 */
export const useSweep = (from = 0.66, to = 0.8) => {
  const { t } = useBeat();
  if (t < from || t > to) return null;
  return interpolate(t, [from, to], [-30, 130]);
};
