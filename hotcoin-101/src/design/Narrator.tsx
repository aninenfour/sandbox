import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { COLOR } from './tokens';
import { FF } from './fonts';

/**
 * THE NARRATOR
 *
 * The Hotcoin mark, alive. The logo's green dot becomes the eye, so the
 * character is literally the brand rather than a mascot bolted onto it.
 * Everything is drawn procedurally over the real logo file, so it costs
 * almost nothing to render and can never drift off-brand.
 *
 * Emotion is deliberately narrow: a brow, a pupil, a tilt, a blink. Five
 * states is enough to carry a page and cheap enough to run on every episode.
 */

export type Mood = 'neutral' | 'curious' | 'thinking' | 'alert' | 'pleased' | 'aside';

const EYE = { cx: 78.5, cy: 79.5, r: 17.8 };

const MOODS: Record<
  Mood,
  { brow: number; browLift: number; look: [number, number]; tilt: number; pupil: number; arc?: boolean }
> = {
  neutral: { brow: 0, browLift: 0, look: [0, 0], tilt: 0, pupil: 6.4 },
  curious: { brow: -24, browLift: -4, look: [3, -3], tilt: 6, pupil: 7.4 },
  thinking: { brow: -13, browLift: -1, look: [-3.5, -3.5], tilt: -3, pupil: 6 },
  alert: { brow: 26, browLift: 1, look: [0, 1], tilt: 0, pupil: 5 },
  pleased: { brow: -10, browLift: -5, look: [0, 0], tilt: -4, pupil: 6.4, arc: true },
  aside: { brow: 3, browLift: 0, look: [-5.5, 0.5], tilt: -9, pupil: 6.4 },
};

export const Narrator: React.FC<{
  mood?: Mood;
  size: number;
  /** Frame offset so several narrators do not blink in unison. */
  seed?: number;
  framed?: boolean;
  label?: string;
}> = ({ mood = 'neutral', size, seed = 0, framed = false, label }) => {
  const frame = useCurrentFrame() + seed;
  const m = MOODS[mood];

  // Idle life: a slow bob, and a blink roughly every three and a half seconds.
  const bob = Math.sin(frame / 26) * (size * 0.012);
  const blinkPhase = frame % 104;
  const blink = m.arc ? 0 : blinkPhase < 5 ? Math.sin((blinkPhase / 5) * Math.PI) : 0;
  const lidY = interpolate(blink, [0, 1], [EYE.cy - EYE.r - 2, EYE.cy + EYE.r + 2]);

  // Alert gets a tiny tremor. Nothing else moves.
  const jitter = mood === 'alert' ? Math.sin(frame / 2.2) * 0.5 : 0;

  const body = (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        transform: `translateY(${bob}px) rotate(${m.tilt + jitter}deg)`,
        transformOrigin: '50% 70%',
      }}
    >
      <Img
        src={staticFile('hotcoin-mark.png')}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* brow */}
        <g transform={`rotate(${m.brow} ${EYE.cx} ${EYE.cy - EYE.r - 9})`}>
          <path
            d={`M${EYE.cx - 17} ${EYE.cy - EYE.r - 7 + m.browLift} q17 -8 34 0`}
            stroke={COLOR.ink}
            strokeWidth={3.4}
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* pupil, or a happy arc */}
        {m.arc ? (
          <path
            d={`M${EYE.cx - 9} ${EYE.cy + 4} q9 -11 18 0`}
            stroke={COLOR.ink}
            strokeWidth={3.6}
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <circle
            cx={EYE.cx + m.look[0]}
            cy={EYE.cy + m.look[1]}
            r={m.pupil}
            fill={COLOR.ink}
          />
        )}

        {/* eyelid: a paper-coloured disc sweeping down over the dot */}
        <clipPath id={`lid-${mood}-${seed}`}>
          <circle cx={EYE.cx} cy={EYE.cy} r={EYE.r + 0.6} />
        </clipPath>
        <g clipPath={`url(#lid-${mood}-${seed})`}>
          <rect
            x={EYE.cx - EYE.r - 2}
            y={EYE.cy - EYE.r - 2}
            width={EYE.r * 2 + 4}
            height={Math.max(0, lidY - (EYE.cy - EYE.r - 2))}
            fill={COLOR.paper}
          />
        </g>

        {/* thinking dots */}
        {mood === 'thinking'
          ? [0, 1, 2].map((i) => {
              const o = interpolate(
                (frame - i * 9) % 54,
                [0, 8, 26, 34],
                [0, 1, 1, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );
              return (
                <circle
                  key={i}
                  cx={30 + i * 8}
                  cy={92 - i * 4}
                  r={1.6 + i * 0.5}
                  fill={COLOR.inkFaint}
                  opacity={o}
                />
              );
            })
          : null}
      </svg>
    </div>
  );

  if (!framed) return body;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: size * 0.09 }}>
      <div
        style={{
          border: `1px solid ${COLOR.rule}`,
          background: 'rgba(255,255,255,0.20)',
          padding: size * 0.12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {body}
      </div>
      {label ? (
        <div
          style={{
            fontFamily: FF.mono,
            fontSize: size * 0.115,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: COLOR.inkFaint,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};
