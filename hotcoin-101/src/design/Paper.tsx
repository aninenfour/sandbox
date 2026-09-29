import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from 'remotion';
import { COLOR } from './tokens';
import { useTheme } from './theme';
import { useLook } from './look';
import { CodeRain, Scanlines } from './Rain';
import { CLOCK_FPS, useFrame } from './clock';

/**
 * The series' signature surface: a sheet of archival paper.
 * Live grain + fibre + faint letterpress grid + printer's registration marks.
 * Everything is procedural, so no external assets and no CDN.
 */

export const PaperGrain: React.FC<{ intensity?: number; dark?: boolean }> = ({
  intensity = 0.5,
  dark = false,
}) => {
  const frame = useFrame();
  // Grain re-seeds every 2 frames: alive, but not epileptic.
  const seed = Math.floor(frame / 2) % 12;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={3}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter={`url(#grain-${seed})`}
          opacity={intensity * (dark ? 0.22 : 0.16)}
          style={{ mixBlendMode: dark ? 'screen' : 'multiply' }}
        />
      </svg>
    </AbsoluteFill>
  );
};

export const PaperFibre: React.FC = () => {
  const { width, height } = useVideoConfig();
  const fibres = new Array(90).fill(0).map((_, i) => {
    const x = random(`fx${i}`) * width;
    const y = random(`fy${i}`) * height;
    const len = 12 + random(`fl${i}`) * 90;
    const rot = random(`fr${i}`) * 180;
    const op = 0.03 + random(`fo${i}`) * 0.06;
    return { x, y, len, rot, op, i };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {fibres.map((f) => (
        <div
          key={f.i}
          style={{
            position: 'absolute',
            left: f.x,
            top: f.y,
            width: f.len,
            height: 1,
            background: COLOR.ink,
            opacity: f.op,
            transform: `rotate(${f.rot}deg)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const LetterpressGrid: React.FC<{ step?: number; opacity?: number }> = ({
  step = 90,
  opacity = 0.05,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity,
      backgroundImage: `linear-gradient(${COLOR.ink} 1px, transparent 1px), linear-gradient(90deg, ${COLOR.ink} 1px, transparent 1px)`,
      backgroundSize: `${step}px ${step}px`,
    }}
  />
);

export const RegistrationMarks: React.FC<{ pad?: number }> = ({ pad = 44 }) => {
  const arm = 26;
  const Mark = ({ style }: { style: React.CSSProperties }) => (
    <div style={{ position: 'absolute', ...style }}>
      <div
        style={{
          position: 'absolute',
          width: arm,
          height: 1.5,
          background: COLOR.inkFaint,
          top: arm / 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          height: arm,
          width: 1.5,
          background: COLOR.inkFaint,
          left: arm / 2,
        }}
      />
    </div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.55 }}>
      <Mark style={{ left: pad, top: pad }} />
      <Mark style={{ right: pad, top: pad }} />
      <Mark style={{ left: pad, bottom: pad }} />
      <Mark style={{ right: pad, bottom: pad }} />
    </AbsoluteFill>
  );
};

export const Paper: React.FC<{
  children?: React.ReactNode;
  dark?: boolean;
  tint?: string;
  grid?: boolean;
  marks?: boolean;
}> = ({ children, dark = false, tint, grid = true, marks = true }) => {
  const theme = useTheme();
  const look = useLook();

  // Beyond the Green: black, looping code rain, a vignette that keeps the
  // centre readable, and scanlines over the top.
  if (look === 'terminal') {
    return (
      <AbsoluteFill style={{ background: '#000000', overflow: 'hidden' }}>
        <CodeRain />
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(62% 42% at 50% 48%, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.58) 55%, rgba(0,0,0,0.12) 100%)',
          }}
        />
        {children}
        <Scanlines />
      </AbsoluteFill>
    );
  }

  // Editorial White has no stock, no fibre and no press marks. It is a screen,
  // not a sheet, so the only thing under the type is a very slight cool wash.
  if (!theme.texture) {
    return (
      <AbsoluteFill style={{ background: theme.paper }}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(120% 80% at 50% 0%, ${theme.paper} 0%, ${theme.paper} 58%, ${theme.paperDeep} 100%)`,
          }}
        />
        {children}
      </AbsoluteFill>
    );
  }

  const base = dark ? COLOR.night : COLOR.paper;
  const deep = dark ? COLOR.nightPaper : COLOR.paperDeep;
  return (
    <AbsoluteFill style={{ background: base }}>
      {/* uneven stock */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 30% 15%, ${deep} 0%, ${base} 55%, ${
            dark ? '#0B0C09' : COLOR.paperEdge
          } 100%)`,
        }}
      />
      {tint ? <AbsoluteFill style={{ background: tint }} /> : null}
      {grid ? <LetterpressGrid opacity={dark ? 0.06 : 0.05} /> : null}
      <PaperFibre />
      {marks ? <RegistrationMarks /> : null}
      {children}
      <PaperGrain dark={dark} />
      {/* print vignette */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          boxShadow: dark
            ? 'inset 0 0 260px rgba(0,0,0,0.75)'
            : 'inset 0 0 220px rgba(60,50,30,0.28)',
        }}
      />
    </AbsoluteFill>
  );
};
