import React from 'react';
import {
  AbsoluteFill,
  Img,
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
 * BEYOND THE GREEN — three dark directions for the series from FILE 009 on.
 *
 * Same four frames in each: the hook, the compare page, the number, and one
 * frame caught mid-transition so the page-swap mechanic is visible.
 * Content is FILE 009, Not Your Keys, Not Your Coins.
 */

type PageIndex = 0 | 1 | 2 | 3;

const GREEN = '#7EC25A';
const GREEN_HOT = '#8FD96A';
const VOID = '#07090A';
const CHAR = '#0E1110';

const HOOK_1 = 'There are only two ways';
const HOOK_2 = 'to hold crypto.';
const HOOK_SUB = 'Both of them cost you something.';

const CMP_HEAD = 'Two ways to hold it.';
const CMP_L = 'Self custody';
const CMP_R = 'Exchange custody';
const CMP: [string, string][] = [
  ['You hold the keys', 'They hold the keys'],
  ['Your mistake is final', 'Their failure is your problem'],
  ['Operational risk', 'Counterparty risk'],
];

const STAT = '20%';
const STAT_LABEL = 'of all bitcoin is estimated to be permanently lost to wallets nobody can open.';
const STAT_SRC = 'Chainalysis estimate';

/* ================================================================== */
/* Shared background pieces                                            */
/* ================================================================== */

const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.28 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 10;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity }}>
      <svg width="100%" height="100%">
        <filter id={`bg-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#bg-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Slow drifting dust, the thing that makes the key visual feel like a photograph. */
const Motes: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {new Array(40).fill(0).map((_, i) => {
        const x = random(`mx${i}`) * width;
        const y0 = random(`my${i}`) * height;
        const sp = 0.12 + random(`ms${i}`) * 0.35;
        const r = 1 + random(`mr${i}`) * 3.4;
        const y = (y0 - frame * sp + height) % height;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: r,
              height: r,
              borderRadius: '50%',
              background: GREEN,
              opacity: 0.10 + random(`mo${i}`) * 0.22,
              filter: 'blur(0.4px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* A · DEEP FIELD                                                      */
/* Cinematic void with one volumetric green light. Type is the subject. */
/* ================================================================== */

const StyleA: React.FC<{ page: PageIndex }> = ({ page }) => {
  const { u, safe, width, height } = useLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 3, fps, config: { damping: 200 } });
  const rule = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  // very slow push in, so a still page still has life
  const push = 1 + interpolate(frame, [0, 120], [0, 0.035], { extrapolateRight: 'clamp' });

  const Kick: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
      style={{
        fontFamily: FF.mono,
        fontSize: 2.1 * u,
        letterSpacing: 4,
        textTransform: 'uppercase',
        color: GREEN,
      }}
    >
      {children}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: VOID, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {/* the light source, off to one side like the boots shot */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(58% 46% at 22% 34%, rgba(126,194,90,0.34) 0%, rgba(126,194,90,0.10) 42%, rgba(7,9,10,0) 72%)`,
          }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(120% 80% at 78% 88%, rgba(76,138,47,0.18) 0%, rgba(7,9,10,0) 60%)`,
          }}
        />
        <Motes />
      </AbsoluteFill>
      <Grain opacity={0.3} />

      <AbsoluteFill
        style={{
          paddingTop: safe.top,
          paddingBottom: safe.bottom,
          paddingLeft: safe.left,
          paddingRight: safe.right,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2.4 * u,
          opacity: s,
          transform: `translateY(${(1 - s) * 2.4 * u}px)`,
        }}
      >
        {page === 0 ? (
          <>
            <Kick>File 009 · Crypto</Kick>
            <div
              style={{
                fontFamily: FF.ui,
                fontWeight: 700,
                fontSize: 10.4 * u,
                lineHeight: 1.0,
                letterSpacing: '-0.04em',
                color: '#FFFFFF',
                textShadow: '0 0 60px rgba(126,194,90,0.28)',
              }}
            >
              {HOOK_1}
              <br />
              {HOOK_2}
            </div>
            <div
              style={{
                width: '32%',
                height: 4,
                background: GREEN,
                boxShadow: `0 0 22px ${GREEN}`,
                transform: `scaleX(${rule})`,
                transformOrigin: 'left center',
              }}
            />
            <div style={{ fontFamily: FF.ui, fontSize: 3.3 * u, color: 'rgba(255,255,255,0.66)' }}>
              {HOOK_SUB}
            </div>
          </>
        ) : null}

        {page === 1 ? (
          <>
            <div
              style={{
                fontFamily: FF.ui,
                fontWeight: 700,
                fontSize: 6.4 * u,
                letterSpacing: '-0.035em',
                color: '#FFFFFF',
                lineHeight: 1.02,
              }}
            >
              {CMP_HEAD}
            </div>
            <div style={{ display: 'flex', gap: 1.6 * u, marginTop: 1 * u }}>
              <div style={{ flex: 1, fontFamily: FF.mono, fontSize: 2.1 * u, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)' }}>
                {CMP_L}
              </div>
              <div style={{ flex: 1, fontFamily: FF.mono, fontSize: 2.1 * u, letterSpacing: 3, textTransform: 'uppercase', color: GREEN }}>
                {CMP_R}
              </div>
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.22)' }} />
            {CMP.map((r, i) => {
              const rs = spring({ frame: frame - 12 - i * 6, fps, config: { damping: 200 } });
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 1.6 * u,
                    opacity: rs,
                    transform: `translateY(${(1 - rs) * 12}px)`,
                    paddingTop: 1.3 * u,
                    paddingBottom: 1.3 * u,
                    borderBottom: i === CMP.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.10)',
                  }}
                >
                  <div style={{ flex: 1, fontFamily: FF.ui, fontSize: 2.9 * u, color: 'rgba(255,255,255,0.78)' }}>{r[0]}</div>
                  <div style={{ flex: 1, fontFamily: FF.ui, fontSize: 2.9 * u, color: '#FFFFFF' }}>{r[1]}</div>
                </div>
              );
            })}
          </>
        ) : null}

        {page === 2 ? (
          <>
            <Kick>The number</Kick>
            <div
              style={{
                fontFamily: FF.ui,
                fontWeight: 700,
                fontSize: 26 * u,
                lineHeight: 0.86,
                letterSpacing: '-0.055em',
                color: '#FFFFFF',
                textShadow: '0 0 90px rgba(126,194,90,0.4)',
              }}
            >
              {STAT}
            </div>
            <div
              style={{
                width: '26%',
                height: 4,
                background: GREEN,
                boxShadow: `0 0 22px ${GREEN}`,
                transform: `scaleX(${rule})`,
                transformOrigin: 'left center',
              }}
            />
            <div style={{ fontFamily: FF.ui, fontSize: 3.2 * u, color: 'rgba(255,255,255,0.7)', lineHeight: 1.35 }}>
              {STAT_LABEL}
            </div>
            <div style={{ fontFamily: FF.mono, fontSize: 2 * u, letterSpacing: 2, color: 'rgba(255,255,255,0.38)' }}>
              {STAT_SRC}
            </div>
          </>
        ) : null}

        {/* mid-transition: the outgoing page blooms out through the light */}
        {page === 3 ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                fontFamily: FF.ui,
                fontWeight: 700,
                fontSize: 10.4 * u,
                lineHeight: 1.0,
                letterSpacing: '-0.04em',
                color: '#FFFFFF',
                opacity: 0.32,
                filter: 'blur(9px)',
                transform: 'scale(1.09)',
                padding: safe.left,
              }}
            >
              {HOOK_1}
              <br />
              {HOOK_2}
            </div>
            <AbsoluteFill
              style={{
                background: `radial-gradient(70% 40% at 50% 50%, rgba(126,194,90,0.5) 0%, rgba(7,9,10,0) 68%)`,
              }}
            />
          </div>
        ) : null}
      </AbsoluteFill>

      <Chrome tone="light" />
      <DotAt x={0.2} y={0.8} r={4.2 * u} mood="curious" glow />
      <Caption>A · DEEP FIELD</Caption>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* B · TERMINAL                                                        */
/* Black, code rain, type materialises in the centre, pages collapse   */
/* to a line of light and open again.                                  */
/* ================================================================== */

const GLYPHS = 'アイウエオカキクケコサシスセソ0123456789ABCDEF{}[]<>/\\$#%&*+=';

/**
 * Seamless code rain.
 *
 * Every column travels a whole number of cycles inside LOOP frames, and the
 * glyph shuffle is indexed modulo the loop, so frame 0 and frame LOOP are
 * identical. That means the background can run under a 60 second episode with
 * no visible restart, and it costs nothing to render.
 */
export const RAIN_LOOP = 120;
const STEP = 26;

const CodeRain: React.FC<{ cols?: number; opacity?: number }> = ({ cols = 26, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const colW = width / cols;
  const shuffle = Math.floor((frame % RAIN_LOOP) / 4);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      {new Array(cols).fill(0).map((_, c) => {
        const len = 9 + Math.floor(random(`cl${c}`) * 16);
        const cycle = height + len * STEP;
        // 1 to 3 full passes per loop, so the motion varies but still closes
        const passes = 1 + Math.floor(random(`cp${c}`) * 3);
        const speed = (passes * cycle) / RAIN_LOOP;
        const start = random(`c0${c}`) * cycle;
        const headY = (start + frame * speed) % cycle;

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
                    opacity: lead ? 0.7 : Math.max(0, 0.38 - k * 0.022),
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
      opacity: 0.35,
      backgroundImage: 'repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.55) 3px)',
    }}
  />
);

/** Reveals text one character at a time with a block caret, like it's being typed. */
const TypeOn: React.FC<{ text: string; delay?: number; cps?: number; style: React.CSSProperties }> = ({
  text,
  delay = 0,
  cps = 34,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - delay) / fps) * cps)));
  const done = n >= text.length;
  return (
    <div style={style}>
      {text.slice(0, n)}
      <span style={{ opacity: done ? (Math.floor(frame / 15) % 2 ? 0 : 1) : 1, color: GREEN }}>▌</span>
    </div>
  );
};

const StyleB: React.FC<{ page: PageIndex }> = ({ page }) => {
  const { u, safe, height } = useLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const Line: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = 'rgba(255,255,255,0.45)' }) => (
    <div style={{ fontFamily: FF.mono, fontSize: 2.1 * u, letterSpacing: 2, color: c }}>{children}</div>
  );

  return (
    <AbsoluteFill style={{ background: '#000000', overflow: 'hidden' }}>
      <CodeRain opacity={page === 3 ? 0.85 : 0.4} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(58% 40% at 50% 48%, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.1) 100%)`,
        }}
      />

      {page !== 3 ? (
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
          {page === 0 ? (
            <>
              <Line c={GREEN}>&gt; file_009 --pillar crypto</Line>
              <TypeOn
                text={`${HOOK_1} ${HOOK_2}`}
                delay={8}
                cps={26}
                style={{
                  fontFamily: FF.ui,
                  fontWeight: 700,
                  fontSize: 9.6 * u,
                  lineHeight: 1.02,
                  letterSpacing: '-0.04em',
                  color: '#FFFFFF',
                }}
              />
              <div style={{ height: 2, background: GREEN, boxShadow: `0 0 18px ${GREEN}`, width: '34%' }} />
              <Line>{HOOK_SUB}</Line>
            </>
          ) : null}

          {page === 1 ? (
            <>
              <Line c={GREEN}>&gt; compare --custody</Line>
              <div
                style={{
                  fontFamily: FF.ui,
                  fontWeight: 700,
                  fontSize: 6 * u,
                  letterSpacing: '-0.035em',
                  color: '#FFFFFF',
                }}
              >
                {CMP_HEAD}
              </div>
              <div style={{ height: 1, background: 'rgba(126,194,90,0.4)' }} />
              {CMP.map((r, i) => {
                const on = frame > 14 + i * 8;
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 1.2 * u,
                      alignItems: 'baseline',
                      opacity: on ? 1 : 0,
                      paddingTop: 1.1 * u,
                      paddingBottom: 1.1 * u,
                      borderBottom: i === CMP.length - 1 ? 'none' : '1px dashed rgba(255,255,255,0.14)',
                    }}
                  >
                    <span style={{ fontFamily: FF.mono, fontSize: 2 * u, color: GREEN, minWidth: 4.4 * u }}>
                      0{i + 1}
                    </span>
                    <span style={{ flex: 1, fontFamily: FF.ui, fontSize: 2.8 * u, color: 'rgba(255,255,255,0.7)' }}>
                      {r[0]}
                    </span>
                    <span style={{ fontFamily: FF.mono, fontSize: 2.2 * u, color: GREEN }}>::</span>
                    <span style={{ flex: 1, fontFamily: FF.ui, fontSize: 2.8 * u, color: '#FFFFFF' }}>{r[1]}</span>
                  </div>
                );
              })}
            </>
          ) : null}

          {page === 2 ? (
            <>
              <Line c={GREEN}>&gt; query lost_supply</Line>
              <div
                style={{
                  fontFamily: FF.mono,
                  fontWeight: 600,
                  fontSize: 24 * u,
                  lineHeight: 0.9,
                  letterSpacing: '-0.03em',
                  color: '#FFFFFF',
                  textShadow: `0 0 40px rgba(126,194,90,0.45)`,
                }}
              >
                {STAT}
              </div>
              <div style={{ height: 2, background: GREEN, boxShadow: `0 0 18px ${GREEN}`, width: '28%' }} />
              <div style={{ fontFamily: FF.ui, fontSize: 3 * u, color: 'rgba(255,255,255,0.72)', lineHeight: 1.35 }}>
                {STAT_LABEL}
              </div>
              <Line>{STAT_SRC}</Line>
            </>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* mid-transition: the page has collapsed into a slit of light at centre */}
      {page === 3 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: '86%',
              height: 3,
              background: '#EAFFDC',
              boxShadow: `0 0 40px ${GREEN}, 0 0 120px ${GREEN}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '86%',
              height: 26 * u,
              background: `linear-gradient(180deg, rgba(126,194,90,0) 0%, rgba(126,194,90,0.16) 48%, rgba(126,194,90,0) 100%)`,
              filter: 'blur(10px)',
            }}
          />
        </AbsoluteFill>
      ) : null}

      <Scanlines />
      <Chrome tone="terminal" />
      <DotAt x={0.2} y={0.8} r={4.2 * u} mood="thinking" glow />
      <Caption>B · TERMINAL</Caption>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* C · KINETIC SPLIT                                                   */
/* Graphic, fast, built for short beats. Green slabs do the cutting.   */
/* ================================================================== */

const StyleC: React.FC<{ page: PageIndex }> = ({ page }) => {
  const { u, safe, width } = useLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slab = spring({ frame: frame - 2, fps, config: { damping: 22, mass: 0.8 } });
  const t1 = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const t2 = spring({ frame: frame - 14, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ background: CHAR, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(160deg, rgba(126,194,90,0.10) 0%, rgba(14,17,16,0) 52%)`,
        }}
      />
      {/* the slab: enters from the left and parks, the page's structural element */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 2.2 * u,
          background: GREEN,
          transform: `translateX(${(1 - slab) * -100}%)`,
        }}
      />
      <Grain opacity={0.14} />

      <AbsoluteFill
        style={{
          paddingTop: safe.top,
          paddingBottom: safe.bottom,
          paddingLeft: safe.left + 2.4 * u,
          paddingRight: safe.right,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2 * u,
        }}
      >
        {page === 0 ? (
          <>
            <div
              style={{
                alignSelf: 'flex-start',
                background: GREEN,
                color: '#0B0D0B',
                fontFamily: FF.mono,
                fontSize: 2.1 * u,
                letterSpacing: 3.5,
                fontWeight: 600,
                padding: `${0.7 * u}px ${1.5 * u}px`,
                transform: `translateX(${(1 - t1) * -30}px)`,
                opacity: t1,
              }}
            >
              FILE 009 · CRYPTO
            </div>
            <div
              style={{
                fontFamily: FF.ui,
                fontWeight: 700,
                fontSize: 10.8 * u,
                lineHeight: 0.97,
                letterSpacing: '-0.045em',
                color: '#FFFFFF',
              }}
            >
              <span style={{ display: 'block', opacity: t1, transform: `translateX(${(1 - t1) * -40}px)` }}>
                {HOOK_1}
              </span>
              <span style={{ display: 'block', opacity: t2, transform: `translateX(${(1 - t2) * 40}px)`, color: GREEN }}>
                {HOOK_2}
              </span>
            </div>
            <div style={{ fontFamily: FF.ui, fontSize: 3.3 * u, color: 'rgba(255,255,255,0.6)', opacity: t2 }}>
              {HOOK_SUB}
            </div>
          </>
        ) : null}

        {page === 1 ? (
          <>
            <div
              style={{
                fontFamily: FF.ui,
                fontWeight: 700,
                fontSize: 6.4 * u,
                letterSpacing: '-0.035em',
                color: '#FFFFFF',
                opacity: t1,
              }}
            >
              {CMP_HEAD}
            </div>
            {CMP.map((r, i) => {
              const a = spring({ frame: frame - 10 - i * 5, fps, config: { damping: 200 } });
              return (
                <div key={i} style={{ display: 'flex', width: '100%', opacity: a }}>
                  <div
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      padding: `${1.4 * u}px ${1.4 * u}px`,
                      fontFamily: FF.ui,
                      fontSize: 2.8 * u,
                      color: 'rgba(255,255,255,0.66)',
                      transform: `translateX(${(1 - a) * -26}px)`,
                    }}
                  >
                    {r[0]}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: i === 2 ? GREEN : 'rgba(126,194,90,0.16)',
                      padding: `${1.4 * u}px ${1.4 * u}px`,
                      fontFamily: FF.ui,
                      fontSize: 2.8 * u,
                      fontWeight: i === 2 ? 600 : 400,
                      color: i === 2 ? '#0B0D0B' : '#FFFFFF',
                      transform: `translateX(${(1 - a) * 26}px)`,
                    }}
                  >
                    {r[1]}
                  </div>
                </div>
              );
            })}
          </>
        ) : null}

        {page === 2 ? (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.6 * u }}>
              <div
                style={{
                  fontFamily: FF.ui,
                  fontWeight: 700,
                  fontSize: 28 * u,
                  lineHeight: 0.8,
                  letterSpacing: '-0.06em',
                  color: GREEN,
                  opacity: t1,
                  transform: `translateY(${(1 - t1) * 26}px)`,
                }}
              >
                {STAT}
              </div>
            </div>
            <div
              style={{
                fontFamily: FF.ui,
                fontSize: 3.2 * u,
                color: '#FFFFFF',
                lineHeight: 1.32,
                opacity: t2,
                borderLeft: `4px solid ${GREEN}`,
                paddingLeft: 1.6 * u,
              }}
            >
              {STAT_LABEL}
            </div>
            <div style={{ fontFamily: FF.mono, fontSize: 2 * u, letterSpacing: 2, color: 'rgba(255,255,255,0.4)', opacity: t2 }}>
              {STAT_SRC}
            </div>
          </>
        ) : null}
      </AbsoluteFill>

      {/* mid-transition: a green wipe crosses the frame and hands over the page */}
      {page === 3 ? (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: GREEN,
              clipPath: 'polygon(0% 0%, 62% 0%, 46% 100%, 0% 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#0B0D0B',
              clipPath: 'polygon(0% 0%, 56% 0%, 40% 100%, 0% 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: safe.left + 2.4 * u,
              top: '46%',
              fontFamily: FF.ui,
              fontWeight: 700,
              fontSize: 8 * u,
              letterSpacing: '-0.04em',
              color: '#FFFFFF',
              opacity: 0.9,
            }}
          >
            Two ways.
          </div>
        </>
      ) : null}

      <Chrome tone="light" />
      <DotAt x={0.2} y={0.8} r={4.2 * u} mood="alert" />
      <Caption>C · KINETIC SPLIT</Caption>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Shared chrome, dot and caption                                      */
/* ================================================================== */

const Chrome: React.FC<{ tone: 'light' | 'terminal' }> = ({ tone }) => {
  const { safe, u, chrome } = useLayout();
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 120], [0.18, 0.42], { extrapolateRight: 'clamp' });
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
        <div
          style={{
            fontFamily: FF.mono,
            fontSize: 2 * u,
            letterSpacing: 3,
            color: tone === 'terminal' ? GREEN : 'rgba(255,255,255,0.45)',
          }}
        >
          FILE 009
        </div>
      </div>
      <div style={{ position: 'absolute', left: safe.left, right: safe.right, bottom: chrome.progressBottom }}>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.14)' }}>
          <div style={{ height: 2, width: `${progress * 100}%`, background: GREEN, boxShadow: `0 0 10px ${GREEN}` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const DotAt: React.FC<{ x: number; y: number; r: number; mood: 'curious' | 'thinking' | 'alert'; glow?: boolean }> = ({
  x,
  y,
  r,
  mood,
  glow,
}) => {
  const { width, height } = useLayout();
  return (
    <div
      style={{
        position: 'absolute',
        left: x * width - r * 1.5,
        top: y * height - r * 1.95,
        filter: glow ? `drop-shadow(0 0 ${r * 0.9}px rgba(126,194,90,0.75))` : undefined,
      }}
    >
      <Dot r={r} mood={mood} lid="#0A0C0A" />
    </div>
  );
};

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { u } = useLayout();
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 1.4 * u,
        textAlign: 'center',
        fontFamily: FF.mono,
        fontSize: 1.8 * u,
        letterSpacing: 4,
        color: 'rgba(255,255,255,0.3)',
      }}
    >
      {children}
    </div>
  );
};

export const BeyondOption: React.FC<{ style: 'a' | 'b' | 'c'; page: PageIndex }> = ({ style, page }) => {
  const Comp = style === 'a' ? StyleA : style === 'b' ? StyleB : StyleC;
  return (
    <SafeModeProvider value="reels">
      <Comp page={page} />
    </SafeModeProvider>
  );
};
