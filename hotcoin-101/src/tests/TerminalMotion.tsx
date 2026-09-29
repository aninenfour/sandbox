import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SafeModeProvider } from '../design/layoutContext';
import { useLayout } from '../design/layout';
import { FF } from '../design/fonts';
import { Dot } from '../design/Dot';

/**
 * TERMINAL, in motion.
 *
 * Three pages and the two swaps between them, so the mechanic is visible in
 * both cuts. Each page opens out of a horizontal slit of light at the centre
 * and collapses back into it, which is the "into the void" handover.
 */

const GREEN = '#7EC25A';
const GLYPHS = 'アイウエオカキクケコサシスセソ0123456789ABCDEF{}[]<>/\\$#%&*+=';

const RAIN_LOOP = 120;
const STEP = 26;

const CodeRain: React.FC<{ cols?: number; opacity?: number }> = ({ cols, opacity = 0.42 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const n = cols ?? Math.round(width / 42);
  const colW = width / n;
  const shuffle = Math.floor((frame % RAIN_LOOP) / 4);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      {new Array(n).fill(0).map((_, c) => {
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
                    color: lead ? '#D8FFC4' : GREEN,
                    opacity: lead ? 0.72 : Math.max(0, 0.4 - k * 0.023),
                    textShadow: lead ? `0 0 14px ${GREEN}` : 'none',
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

const Scanlines: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity: 0.32,
      backgroundImage:
        'repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.5) 3px)',
    }}
  />
);

const TypeOn: React.FC<{ text: string; delay?: number; cps?: number; style: React.CSSProperties }> = ({
  text,
  delay = 0,
  cps = 30,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - delay) / fps) * cps)));
  const done = n >= text.length;
  return (
    <div style={style}>
      {text.slice(0, n)}
      <span style={{ opacity: done ? (Math.floor(frame / 14) % 2 ? 0 : 1) : 1, color: GREEN }}>▌</span>
    </div>
  );
};

/**
 * The swap. Content scales down to a line at the vertical centre on the way
 * out and opens from that line on the way in, while a slit of light flares
 * across the frame at the handover.
 */
const Slit: React.FC<{ children: React.ReactNode; duration: number }> = ({ children, duration }) => {
  const frame = useCurrentFrame();
  const open = 9;
  const close = 8;

  const inS = interpolate(frame, [0, open], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outS = interpolate(frame, [duration - close, duration], [1, 0], {
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
      {/* the light line, brightest exactly at the handover */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div
          style={{
            width: '88%',
            height: 3,
            background: '#EAFFDC',
            boxShadow: `0 0 40px ${GREEN}, 0 0 120px ${GREEN}`,
            opacity: interpolate(t, [0, 0.5, 1], [1, 0.5, 0]),
            transform: `scaleX(${interpolate(t, [0, 1], [1, 1.06])})`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Chrome: React.FC = () => {
  const { safe, u, chrome } = useLayout();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: safe.left,
          right: safe.right,
          top: chrome.railTop,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Img src={staticFile('hotcoin-lockup-dark.png')} style={{ height: 2.9 * u, width: 'auto' }} />
        <div style={{ fontFamily: FF.mono, fontSize: 2 * u, letterSpacing: 3, color: GREEN }}>FILE 009</div>
      </div>
      <div style={{ position: 'absolute', left: safe.left, right: safe.right, bottom: chrome.progressBottom }}>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.14)' }}>
          <div style={{ height: 2, width: `${progress * 100}%`, background: GREEN, boxShadow: `0 0 10px ${GREEN}` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** The dot, drifting between marks with a glitch step and a visible blink. */
const DotTrack: React.FC = () => {
  const { u, width, height, isVertical } = useLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = 4.2 * u;

  const marks = isVertical
    ? [
        { at: 0, x: 0.17, y: 0.78, mood: 'curious' as const },
        { at: 78, x: 0.3, y: 0.78, mood: 'thinking' as const },
        { at: 156, x: 0.2, y: 0.78, mood: 'alert' as const },
      ]
    : [
        { at: 0, x: 0.88, y: 0.8, mood: 'curious' as const },
        { at: 78, x: 0.8, y: 0.82, mood: 'thinking' as const },
        { at: 156, x: 0.88, y: 0.8, mood: 'alert' as const },
      ];

  let i = 0;
  for (let k = 0; k < marks.length; k++) if (frame >= marks[k].at) i = k;
  const cur = marks[i];
  const prev = marks[i - 1] ?? cur;
  const s = spring({ frame: frame - cur.at, fps, config: { damping: 15, mass: 0.9, stiffness: 90 } });
  const x = (prev.x + (cur.x - prev.x) * s) * width;
  const y = (prev.y + (cur.y - prev.y) * s) * height;

  // terminal-flavoured motion: a horizontal tear as it moves
  const moving = s > 0.03 && s < 0.94 && i > 0;
  const tear = moving ? Math.sin(frame * 1.9) * 3 : 0;

  return (
    <>
      {moving
        ? [5, 10].map((b, k) => {
            const bs = spring({ frame: frame - b - cur.at, fps, config: { damping: 15, mass: 0.9, stiffness: 90 } });
            const bx = (prev.x + (cur.x - prev.x) * bs) * width;
            return (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: bx - r * 1.5,
                  top: y - r * 1.95,
                  opacity: 0.22 - k * 0.08,
                }}
              >
                <Dot r={r} mood={cur.mood} />
              </div>
            );
          })
        : null}
      <div
        style={{
          position: 'absolute',
          left: x - r * 1.5 + tear,
          top: y - r * 1.95,
          filter: `drop-shadow(0 0 ${r * 0.85}px rgba(126,194,90,0.8))`,
        }}
      >
        <Dot r={r} mood={cur.mood} />
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */

const PageHook: React.FC = () => {
  const { u, safe } = useLayout();
  return (
    <Frame>
      <div style={{ fontFamily: FF.mono, fontSize: 2.1 * u, letterSpacing: 2, color: GREEN }}>
        &gt; file_009 --pillar crypto
      </div>
      <TypeOn
        text="There are only two ways to hold crypto."
        delay={10}
        cps={24}
        style={{
          fontFamily: FF.ui,
          fontWeight: 700,
          fontSize: 9.2 * u,
          lineHeight: 1.02,
          letterSpacing: '-0.04em',
          color: '#FFFFFF',
        }}
      />
      <div style={{ height: 2, background: GREEN, boxShadow: `0 0 18px ${GREEN}`, width: '34%' }} />
      <div style={{ fontFamily: FF.mono, fontSize: 2.1 * u, letterSpacing: 2, color: 'rgba(255,255,255,0.5)' }}>
        Both of them cost you something.
      </div>
    </Frame>
  );
};

const PageCompare: React.FC = () => {
  const { u } = useLayout();
  const frame = useCurrentFrame();
  const rows: [string, string][] = [
    ['You hold the keys', 'They hold the keys'],
    ['Your mistake is final', 'Their failure is your problem'],
    ['Operational risk', 'Counterparty risk'],
  ];
  return (
    <Frame>
      <div style={{ fontFamily: FF.mono, fontSize: 2.1 * u, letterSpacing: 2, color: GREEN }}>
        &gt; compare --custody
      </div>
      <div style={{ fontFamily: FF.ui, fontWeight: 700, fontSize: 5.8 * u, letterSpacing: '-0.035em', color: '#FFFFFF' }}>
        Two ways to hold it.
      </div>
      <div style={{ height: 1, background: 'rgba(126,194,90,0.42)' }} />
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 1.2 * u,
            alignItems: 'baseline',
            opacity: frame > 12 + i * 7 ? 1 : 0,
            paddingTop: 1.1 * u,
            paddingBottom: 1.1 * u,
            borderBottom: i === rows.length - 1 ? 'none' : '1px dashed rgba(255,255,255,0.14)',
          }}
        >
          <span style={{ fontFamily: FF.mono, fontSize: 2 * u, color: GREEN, minWidth: 4.4 * u }}>0{i + 1}</span>
          <span style={{ flex: 1, fontFamily: FF.ui, fontSize: 2.8 * u, color: 'rgba(255,255,255,0.7)' }}>{r[0]}</span>
          <span style={{ fontFamily: FF.mono, fontSize: 2.2 * u, color: GREEN }}>::</span>
          <span style={{ flex: 1, fontFamily: FF.ui, fontSize: 2.8 * u, color: '#FFFFFF' }}>{r[1]}</span>
        </div>
      ))}
    </Frame>
  );
};

const PageStat: React.FC = () => {
  const { u } = useLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 8, fps, config: { damping: 200, mass: 1.1 } });
  const shown = Math.round(20 * s);
  return (
    <Frame>
      <div style={{ fontFamily: FF.mono, fontSize: 2.1 * u, letterSpacing: 2, color: GREEN }}>
        &gt; query lost_supply
      </div>
      <div
        style={{
          fontFamily: FF.mono,
          fontWeight: 600,
          fontSize: 22 * u,
          lineHeight: 0.9,
          letterSpacing: '-0.03em',
          color: '#FFFFFF',
          textShadow: '0 0 40px rgba(126,194,90,0.45)',
        }}
      >
        {shown}%
      </div>
      <div style={{ height: 2, background: GREEN, boxShadow: `0 0 18px ${GREEN}`, width: '28%' }} />
      <div style={{ fontFamily: FF.ui, fontSize: 3 * u, color: 'rgba(255,255,255,0.74)', lineHeight: 1.35 }}>
        of all bitcoin is estimated to be permanently lost to wallets nobody can open.
      </div>
      <div style={{ fontFamily: FF.mono, fontSize: 2 * u, letterSpacing: 2, color: 'rgba(255,255,255,0.4)' }}>
        Chainalysis estimate
      </div>
    </Frame>
  );
};

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { safe, u, isVertical } = useLayout();
  return (
    <AbsoluteFill
      style={{
        paddingTop: safe.top,
        paddingBottom: safe.bottom,
        paddingLeft: safe.left,
        paddingRight: safe.right,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 2.2 * u,
      }}
    >
      <div style={{ width: isVertical ? '100%' : '62%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2.2 * u }}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

const PAGE = 78;

const Body: React.FC = () => (
  <AbsoluteFill style={{ background: '#000000', overflow: 'hidden' }}>
    <CodeRain />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(62% 42% at 50% 48%, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.58) 55%, rgba(0,0,0,0.12) 100%)',
      }}
    />
    <Sequence from={0} durationInFrames={PAGE} layout="none">
      <Slit duration={PAGE}>
        <PageHook />
      </Slit>
    </Sequence>
    <Sequence from={PAGE} durationInFrames={PAGE} layout="none">
      <Slit duration={PAGE}>
        <PageCompare />
      </Slit>
    </Sequence>
    <Sequence from={PAGE * 2} durationInFrames={PAGE} layout="none">
      <Slit duration={PAGE}>
        <PageStat />
      </Slit>
    </Sequence>
    <Scanlines />
    <Chrome />
    <DotTrack />
  </AbsoluteFill>
);

export const TERMINAL_MOTION_FRAMES = PAGE * 3;

export const TerminalMotion: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <SafeModeProvider value={height > width ? 'reels' : 'standard'}>
      <Body />
    </SafeModeProvider>
  );
};
