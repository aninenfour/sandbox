import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { COLOR } from './tokens';
import { useLayout } from './layout';
import { useLook } from './look';
import { CLOCK_FPS, useFrame } from './clock';

/**
 * THE DOT
 *
 * The green dot out of the Hotcoin mark, on its own, doing the narrating.
 * It travels the page, reacts, and in the final beat flies home and the ink
 * of the logo assembles around it.
 *
 * Expression is four numbers: pupil position, pupil size, brow angle, blink.
 * Everything is vector, so it costs nothing to render.
 */

export type Mood = 'neutral' | 'curious' | 'thinking' | 'alert' | 'pleased' | 'aside';

type MoodSpec = {
  brow: number;
  browLift: number;
  look: [number, number];
  pupil: number;
  arc?: boolean;
};

const MOODS: Record<Mood, MoodSpec> = {
  neutral: { brow: 0, browLift: 0, look: [0, 0], pupil: 0.35 },
  curious: { brow: -14, browLift: -0.05, look: [0.1, -0.11], pupil: 0.38 },
  thinking: { brow: -9, browLift: -0.02, look: [-0.13, -0.13], pupil: 0.33 },
  alert: { brow: 16, browLift: 0.03, look: [0, 0.05], pupil: 0.28 },
  pleased: { brow: -8, browLift: -0.07, look: [0, 0], pupil: 0.35, arc: true },
  aside: { brow: 3, browLift: 0, look: [-0.22, 0.03], pupil: 0.35 },
};

/** Geometry lifted straight off the logo file, so the merge lands exactly. */
export const GLYPH = {
  dotCx: 0.7835,
  dotCy: 0.7943,
  dotR: 0.1797,
  gap: 0.5104, // space between glyph and wordmark, in glyph widths
  wordH: 0.6911, // wordmark height, in glyph heights
  wordAspect: 6.2955,
};

/** The drawn box is 3x the dot radius, with the dot centre at (0.5, 0.65). */
export const DOT_BOX = 3;
export const DOT_ANCHOR = { x: 0.5, y: 0.65 };

export const Dot: React.FC<{
  r: number;
  mood?: Mood;
  seed?: number;
  /** 0 = round, positive squashes along the direction of travel. */
  stretch?: number;
  angle?: number;
  opacity?: number;
  /** Fades the pupil and brow away, leaving the plain brand dot. */
  face?: number;
  /**
   * Colour of the blink lid. Defaults to a darker green, so the blink reads as
   * an eyelid closing over the eye rather than the dot vanishing. On a black
   * ground a background-coloured lid made the dot disappear entirely.
   */
  lid?: string;
}> = ({
  r,
  mood = 'neutral',
  seed = 0,
  stretch = 0,
  angle = 0,
  opacity = 1,
  face = 1,
  lid = COLOR.greenLid,
}) => {
  const frame = useFrame() + seed;
  const m = MOODS[mood];
  const S = r * DOT_BOX;

  // 7 frames rather than 5: at 5 the blink was almost impossible to catch.
  const blinkPhase = frame % 104;
  const blink = m.arc ? 0 : blinkPhase < 7 ? Math.sin((blinkPhase / 7) * Math.PI) : 0;
  const lidY = interpolate(blink, [0, 1], [-104, 104]);

  const jitter = mood === 'alert' ? Math.sin(frame / 2.2) * 0.6 : 0;

  return (
    <svg
      viewBox="-150 -195 300 300"
      width={S}
      height={S}
      style={{
        opacity,
        transform: `rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch * 0.7}) rotate(${-angle}deg) rotate(${jitter}deg)`,
        transformOrigin: `${DOT_ANCHOR.x * 100}% ${DOT_ANCHOR.y * 100}%`,
        overflow: 'visible',
      }}
    >
      <circle cx={0} cy={0} r={100} fill={COLOR.green} />

      <g opacity={face}>
      {m.arc ? (
        <path
          d="M-52 22 q52 -62 104 0"
          stroke={COLOR.ink}
          strokeWidth={20}
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <circle
          cx={m.look[0] * 100}
          cy={m.look[1] * 100}
          r={m.pupil * 100}
          fill={COLOR.ink}
        />
      )}

      <clipPath id={`dotlid-${mood}-${seed}`}>
        <circle cx={0} cy={0} r={101} />
      </clipPath>
      <g clipPath={`url(#dotlid-${mood}-${seed})`}>
        <rect x={-104} y={-104} width={208} height={Math.max(0, lidY + 104)} fill={lid} />
        {/* crease, so the closed eye is legible and not just a flat disc */}
        {blink > 0.06 ? (
          <line
            x1={-104}
            y1={lidY}
            x2={104}
            y2={lidY}
            stroke={COLOR.ink}
            strokeWidth={11}
            strokeLinecap="round"
            opacity={0.85}
          />
        ) : null}
      </g>

      <g transform={`rotate(${m.brow} 0 -124)`}>
        <path
          d={`M-72 ${-124 + m.browLift * 100} q72 -30 144 0`}
          stroke={COLOR.ink}
          strokeWidth={15}
          strokeLinecap="round"
          fill="none"
        />
      </g>
      </g>

      {mood === 'thinking'
        ? [0, 1, 2].map((i) => {
            const o = interpolate((frame - i * 9) % 54, [0, 8, 26, 34], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <circle
                key={i}
                cx={-118 - i * 22}
                cy={-40 - i * 22}
                r={9 + i * 4}
                fill={COLOR.green}
                opacity={o * 0.75}
              />
            );
          })
        : null}
    </svg>
  );
};

/** Geometry of the reversed Beyond the Green lockup, measured off the file. */
export const LOCKUP_DARK = {
  aspect: 6.1128,
  dotCx: 0.12862, // of lockup width
  dotCy: 0.79518, // of lockup height
  dotR: 0.17759, // of lockup height
};

/**
 * The end card, assembled around the dot rather than drawn as one image.
 * The ink glyph wipes in along its own diagonal, then the wordmark follows.
 *
 * On the dark look the lockup is a single reversed file instead, so the
 * geometry comes from LOCKUP_DARK and the dot simply lands on its own dot.
 */
export const useLockup = () => {
  const { u, isVertical, width, height } = useLayout();
  const dark = useLook() === 'terminal';

  if (dark) {
    const W = (isVertical ? 76 : 46) * u;
    const H = W / LOCKUP_DARK.aspect;
    const left = (width - W) / 2;
    const top = height * (isVertical ? 0.435 : 0.42) - H / 2;
    return {
      G: H,
      wordW: W,
      total: W,
      left,
      top,
      dark: true,
      lockW: W,
      lockH: H,
      dotX: left + LOCKUP_DARK.dotCx * W,
      dotY: top + LOCKUP_DARK.dotCy * H,
      dotR: LOCKUP_DARK.dotR * H,
    };
  }

  const G = (isVertical ? 16 : 11) * u;
  const wordW = GLYPH.wordH * GLYPH.wordAspect * G;
  const total = G + GLYPH.gap * G + wordW;
  const left = (width - total) / 2;
  const top = height * (isVertical ? 0.435 : 0.42) - G / 2;
  return {
    G,
    wordW,
    total,
    left,
    top,
    dark: false,
    lockW: total,
    lockH: G,
    dotX: left + GLYPH.dotCx * G,
    dotY: top + GLYPH.dotCy * G,
    dotR: GLYPH.dotR * G,
  };
};

/**
 * Dark end card: the reversed lockup prints in behind a sweep of light, and
 * the narrator dot is already sitting exactly where the logo's dot lands.
 */
export const LockupDarkAssembly: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useFrame();
  const L = useLockup();
  const p = interpolate(frame - delay, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: L.left,
          top: L.top,
          width: L.lockW,
          height: L.lockH,
          clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        }}
      >
        <Img
          src={staticFile('hotcoin-lockup-dark.png')}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      {/* the sweep that does the printing */}
      {p > 0.01 && p < 0.99 ? (
        <div
          style={{
            position: 'absolute',
            left: L.left + p * L.lockW - 1,
            top: L.top - L.lockH * 0.35,
            width: 3,
            height: L.lockH * 1.7,
            background: '#EAFFDC',
            boxShadow: `0 0 26px ${COLOR.green}, 0 0 70px ${COLOR.green}`,
          }}
        />
      ) : null}
    </>
  );
};

export const LockupAssembly: React.FC<{ inkDelay?: number; wordDelay?: number }> = ({
  inkDelay = 0,
  wordDelay = 12,
}) => {
  const frame = useFrame();
  const L = useLockup();

  const ink = interpolate(frame - inkDelay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const word = interpolate(frame - wordDelay, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: L.left,
          top: L.top,
          width: L.G,
          height: L.G,
          // wipe along the glyph's own diagonal
          clipPath: `polygon(-40% ${140 - ink * 200}%, 140% ${-60 - ink * 200}%, 140% 140%, -40% 140%)`,
        }}
      >
        <Img
          src={staticFile('hotcoin-mark-ink.png')}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: L.left + L.G + GLYPH.gap * L.G,
          top: L.top + (L.G - GLYPH.wordH * L.G) / 2,
          width: L.wordW,
          opacity: word,
          transform: `translateX(${(1 - word) * -L.G * 0.12}px)`,
        }}
      >
        <Img src={staticFile('hotcoin-word.png')} style={{ width: '100%', height: 'auto' }} />
      </div>
    </>
  );
};
