import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { useLayout } from './layout';
import { Sheet, useLook } from './Sheet';
import { COLOR } from './tokens';

/**
 * Scene: a page of the document.
 * Pages enter with a short paper-shift and leave with an ink dissolve, so cuts
 * feel like a hand turning a sheet rather than a slideshow transition.
 */
export const Scene: React.FC<{
  from: number;
  duration: number;
  children: React.ReactNode;
  shift?: number;
  name?: string;
  /** Final page of an episode: no exit fade, it holds until the last frame. */
  hold?: boolean;
}> = ({ from, duration, children, shift = 26, name, hold }) => (
  <Sequence from={from} durationInFrames={duration} name={name} layout="none">
    <ScenePage shift={shift} duration={duration} hold={hold}>
      {children}
    </ScenePage>
  </Sequence>
);

/** Picks the page-change mechanic for the current look. */
const SceneSwitch: React.FC<{
  children: React.ReactNode;
  shift: number;
  duration: number;
  hold?: boolean;
}> = (props) =>
  useLook() === 'terminal' ? <SceneSlit {...props} /> : <ScenePage {...props} />;

/**
 * Beyond the Green page change: the page opens out of a horizontal slit of
 * light at the centre of the frame and collapses back into it. Six frames out,
 * five frames in, which is fast enough to feel like a cut and slow enough to
 * read as a mechanic.
 */
const SceneSlit: React.FC<{
  children: React.ReactNode;
  shift: number;
  duration: number;
  hold?: boolean;
}> = ({ children, duration, hold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // authored at 30fps, so the swap keeps its length at any frame rate
  const open = 6 * (fps / 30);
  const close = 5 * (fps / 30);

  const inS = interpolate(frame, [0, open], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outS = hold
    ? 1
    : interpolate(frame, [duration - close, duration], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  const t = Math.min(inS, outS);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scaleY(${Math.max(0.001, t)})`,
          transformOrigin: 'center center',
          opacity: interpolate(t, [0, 0.35, 1], [0, 0.9, 1]),
        }}
      >
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div
          style={{
            width: '88%',
            height: 3,
            background: '#EAFFDC',
            boxShadow: `0 0 40px ${COLOR.green}, 0 0 120px ${COLOR.green}`,
            opacity: interpolate(t, [0, 0.5, 1], [1, 0.45, 0]),
            transform: `scaleX(${interpolate(t, [0, 1], [1, 1.06])})`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ScenePage: React.FC<{
  children: React.ReactNode;
  shift: number;
  duration: number;
  hold?: boolean;
}> = ({ children, shift, duration, hold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inD = Math.round(fps * 0.35);
  const outD = Math.round(fps * 0.28);

  const enter = interpolate(frame, [0, inD], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exit = hold
    ? 1
    : interpolate(frame, [duration - outD, duration], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  const y =
    interpolate(enter, [0, 1], [shift, 0]) + interpolate(exit, [0, 1], [-shift * 0.5, 0]);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(enter, exit),
        transform: `translateY(${y}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Standard content column, respecting the format's safe area. */
export const Page: React.FC<{
  children: React.ReactNode;
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  gap?: number;
  /** 'one' puts the whole page on a single sheet, 'each' gives every child its own. */
  sheets?: 'one' | 'each' | 'none';
  seed?: number;
}> = ({ children, justify = 'center', align = 'flex-start', gap, sheets = 'one', seed = 1 }) => {
  const { safe, u, isReels } = useLayout();
  const look = useLook();
  // Cut paper leaves a clear band under the cards for the dot to sit in.
  const cutBottom = safe.bottom + (isReels ? 11 * u : 3 * u);

  const frame = (
    <AbsoluteFill
      style={{
        paddingTop: safe.top,
        paddingBottom: safe.bottom,
        paddingLeft: safe.left,
        paddingRight: safe.right,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: justify,
        alignItems: look === 'cutPaper' ? 'stretch' : align,
        gap: gap ?? 2.4 * u,
      }}
    >
      {children}
    </AbsoluteFill>
  );

  if (look !== 'cutPaper' || sheets === 'none') return frame;

  const kids = React.Children.toArray(children).filter(Boolean);

  if (sheets === 'each') {
    return (
      <AbsoluteFill
        style={{
          paddingTop: safe.top,
          paddingBottom: cutBottom,
          paddingLeft: safe.left,
          paddingRight: safe.right,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: justify,
          alignItems: 'stretch',
        }}
      >
        {kids.map((k, i) => (
          <Sheet
            key={i}
            seed={seed + i * 4}
            rot={i % 2 === 0 ? 1.3 : -0.9}
            delay={i * 7}
            pad={i === 0 ? 1.8 * u : undefined}
            style={{ marginTop: i === 0 ? 0 : -2.2 * u, zIndex: kids.length - i }}
          >
            {k}
          </Sheet>
        ))}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        paddingTop: safe.top,
        paddingBottom: cutBottom,
        paddingLeft: safe.left,
        paddingRight: safe.right,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: justify,
      }}
    >
      <Sheet seed={seed} rot={-0.9}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: align,
            gap: gap ?? 2.4 * u,
          }}
        >
          {children}
        </div>
      </Sheet>
    </AbsoluteFill>
  );
};
