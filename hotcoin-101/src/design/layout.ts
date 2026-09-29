import { useVideoConfig } from 'remotion';
import { useSafeMode } from './layoutContext';

export type Orientation = 'vertical' | 'horizontal';

/**
 * 'standard' centres the page in the full frame.
 * 'reels'    pulls everything into the band that platform UI leaves visible:
 *            IG and TikTok cover roughly the top 13% (status bar, nav),
 *            the bottom 20% (username, caption, tab bar) and a strip down the
 *            right side (like, comment, share) below the halfway line.
 */
export type SafeMode = 'standard' | 'reels';

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const safeMode = useSafeMode();
  const orientation: Orientation = height > width ? 'vertical' : 'horizontal';
  const shortEdge = Math.min(width, height);
  const u = shortEdge / 100; // 1u = 1% of the short edge
  const isVertical = orientation === 'vertical';
  const isReels = isVertical && safeMode === 'reels';

  const safe = isReels
    ? { top: 35.5 * u, bottom: 39 * u, left: 7 * u, right: 12 * u }
    : isVertical
      ? { top: 19 * u, bottom: 25 * u, left: 8 * u, right: 8 * u }
      : { top: 9 * u, bottom: 9 * u, left: 9 * u, right: 9 * u };

  // Where the series furniture sits, measured from the frame edges.
  const chrome = isReels
    ? { railTop: safe.top - 9 * u, progressBottom: safe.bottom + 1.5 * u }
    : isVertical
      ? { railTop: safe.top - 9 * u, progressBottom: safe.bottom - 10 * u }
      : { railTop: safe.top - 4.4 * u, progressBottom: safe.bottom - 4.2 * u };

  // Reels mode has a shorter band to work in, so the ramp tightens slightly.
  const s = isReels ? 0.95 : 1;

  return {
    width,
    height,
    orientation,
    isVertical,
    isReels,
    safeMode,
    shortEdge,
    u,
    safe,
    chrome,
    type: {
      mega: 12.4 * u * s,
      title: 8.6 * u * s,
      subtitle: 5.4 * u * s,
      body: 3.6 * u * s,
      small: 2.7 * u * s,
      kicker: 2.1 * u,
      stat: 16 * u * s,
    },
  };
};
