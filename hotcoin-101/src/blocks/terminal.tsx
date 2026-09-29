import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FF } from '../design/fonts';
import { useLayout } from '../design/layout';
import { Page } from '../design/Scene';
import { Title } from '../design/Type';
import { useTheme } from '../design/theme';
import { VISUALS, VisualName } from '../design/Visuals';
import { CLOCK_FPS, useFrame } from '../design/clock';
import {
  useBeat30,
  useReadthrough,
  useSecondAct,
  useStagger,
  useSweep,
} from '../design/motion';

/**
 * TERMINAL ELEMENTS
 *
 * The dark look draws its tables, lists and callouts as solid blocks rather
 * than ruled rows. Cells are square, separated by a 2px gutter of the black
 * ground, and the row that carries the point is filled solid green with the
 * type knocked out of it.
 *
 * These render only under the terminal look. Paper and white keep their own.
 */

const GUT = 2;

/** Entrance offsets snap to exactly zero once under half a pixel, so landed text never creeps. */
const snap = (px: number) => (Math.abs(px) < 0.5 ? 0 : px);

const useCell = () => {
  const { u } = useLayout();
  const t = useTheme();
  return {
    base: {
      background: 'rgba(255,255,255,0.045)',
      padding: `${1.35 * u}px ${1.5 * u}px`,
      fontFamily: FF.ui,
      color: t.inkSoft,
      lineHeight: 1.28,
    } as React.CSSProperties,
    accent: {
      background: 'rgba(126,194,90,0.15)',
      padding: `${1.35 * u}px ${1.5 * u}px`,
      fontFamily: FF.ui,
      color: '#FFFFFF',
      lineHeight: 1.28,
    } as React.CSSProperties,
    solid: {
      background: t.green,
      padding: `${1.35 * u}px ${1.5 * u}px`,
      fontFamily: FF.ui,
      color: '#0B0D0B',
      fontWeight: 600,
      lineHeight: 1.28,
    } as React.CSSProperties,
  };
};

/** Column label above a block table. */
const ColHead: React.FC<{ children: React.ReactNode; accent?: boolean }> = ({
  children,
  accent,
}) => {
  const { u, type } = useLayout();
  const t = useTheme();
  return (
    <div
      style={{
        flex: 1,
        fontFamily: FF.mono,
        fontSize: type.kicker,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: accent ? t.green : t.inkFaint,
        paddingLeft: 1.5 * u,
        paddingBottom: 0.7 * u,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* BLOCK TABLE — the compare page as filled cells.                     */
/* The last row is solid green, because it is always the conclusion.   */
/* ------------------------------------------------------------------ */
export const TerminalCompare: React.FC<{
  heading?: string;
  leftTitle: string;
  rightTitle: string;
  rows: [string, string][];
}> = ({ heading, leftTitle, rightTitle, rows }) => {
  const { u, type } = useLayout();
  const t = useTheme();
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const C = useCell();
  const body = type.body * 0.86;
  // rows keep arriving until 40% of the page, then a highlight reads down them
  const at = useStagger(rows.length, 0.06, 0.4);
  const read = useReadthrough(rows.length, 0.48, 0.86);
  const sweep = useSweep(0.7, 0.84);

  return (
    <Page justify="center" gap={2 * u}>
      {heading ? <Title delay={0} size={type.subtitle}>{heading}</Title> : null}
      <div style={{ display: 'flex', width: '100%' }}>
        <ColHead>{leftTitle}</ColHead>
        <ColHead accent>{rightTitle}</ColHead>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: GUT, width: '100%' }}>
        {rows.map((r, i) => {
          const last = i === rows.length - 1;
          const s = spring({ frame: frame - at(i), fps, config: { damping: 20, mass: 0.8 } });
          const h = read(i);
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: GUT,
                opacity: Math.min(1, s),
                position: 'relative',
              }}
            >
              <div
                style={{
                  ...C.base,
                  flex: 1,
                  fontSize: body,
                  background: `rgba(255,255,255,${0.045 + h * 0.08})`,
                  color: h > 0.3 ? '#FFFFFF' : C.base.color,
                  transform: `translateX(${snap((1 - s) * -40)}px)`,
                  boxShadow: h > 0.05 ? `inset ${0.5 * u * h}px 0 0 ${t.green}` : undefined,
                }}
              >
                {r[0]}
              </div>
              <div
                style={{
                  ...(last ? C.solid : C.accent),
                  flex: 1,
                  fontSize: body,
                  position: 'relative',
                  overflow: 'hidden',
                  background: last ? t.green : `rgba(126,194,90,${0.15 + h * 0.14})`,
                  transform: `translateX(${snap((1 - s) * 40)}px)`,
                  boxShadow: last && h > 0.05 ? `0 0 ${24 * h}px rgba(126,194,90,${0.6 * h})` : undefined,
                }}
              >
                {r[1]}
                {last && sweep !== null ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: `${sweep}%`,
                      width: '22%',
                      background:
                        'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)',
                    }}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* BLOCK LIST — index chip plus a filled cell, instead of an arrow.    */
/* Items arrive across the first 40% of the page, then a reading       */
/* highlight travels down them, so the back half is not a still.       */
/* ------------------------------------------------------------------ */
export const TerminalList: React.FC<{
  heading: string;
  items: string[];
  numbered?: boolean;
}> = ({ heading, items }) => {
  const { u, type } = useLayout();
  const t = useTheme();
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const C = useCell();
  const at = useStagger(items.length, 0.06, 0.4);
  const read = useReadthrough(items.length, 0.46, 0.9);

  return (
    <Page justify="center" gap={2 * u}>
      <Title delay={0} size={type.subtitle}>{heading}</Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: GUT, width: '100%' }}>
        {items.map((it, i) => {
          const s = spring({ frame: frame - at(i), fps, config: { damping: 20, mass: 0.8 } });
          // the chip flashes as it lands, then glows again on the read-through
          const land = interpolate(frame - at(i), [0, 6, 18], [0, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const h = read(i);
          const glow = Math.max(land, h);
          return (
            <div
              key={i}
              style={{ display: 'flex', gap: GUT, opacity: Math.min(1, s) }}
            >
              <div
                style={{
                  background: t.green,
                  color: '#0B0D0B',
                  fontFamily: FF.mono,
                  fontWeight: 600,
                  fontSize: type.kicker,
                  width: 5.4 * u,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: '0 0 auto',
                  transform: `translateX(${snap((1 - s) * -36)}px)`,
                  boxShadow: glow > 0.02 ? `0 0 ${26 * glow}px rgba(126,194,90,${0.85 * glow})` : undefined,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div
                style={{
                  ...C.base,
                  flex: 1,
                  fontSize: type.body * 0.9,
                  color: '#FFFFFF',
                  background: `rgba(255,255,255,${0.045 + h * 0.09})`,
                  transform: `translateX(${snap((1 - s) * 36)}px)`,
                }}
              >
                {it}
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* CARDS — several named things side by side, each with one line.      */
/* Cards arrive across the first 40%, the eye is walked across them,   */
/* and the accent card lifts late as the payoff.                       */
/* ------------------------------------------------------------------ */
export const TerminalCards: React.FC<{
  heading?: string;
  cards: { label: string; line: string; accent?: boolean }[];
}> = ({ heading, cards }) => {
  const { u, type, isVertical } = useLayout();
  const t = useTheme();
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const at = useStagger(cards.length, 0.06, 0.38);
  const read = useReadthrough(cards.length, 0.44, 0.74);
  const lift = useSecondAct(0.72, 0.86);

  return (
    <Page justify="center" gap={2.2 * u}>
      {heading ? <Title delay={0} size={type.subtitle}>{heading}</Title> : null}
      <div
        style={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          gap: GUT,
          width: '100%',
        }}
      >
        {cards.map((c, i) => {
          const s = spring({ frame: frame - at(i), fps, config: { damping: 18, mass: 0.8 } });
          const h = read(i);
          const up = c.accent ? lift : 0;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                background: c.accent
                  ? `rgba(126,194,90,${0.15 + up * 0.1})`
                  : `rgba(255,255,255,${0.045 + h * 0.07})`,
                borderTop: `3px solid ${c.accent || h > 0.4 ? t.green : 'rgba(255,255,255,0.18)'}`,
                padding: `${1.6 * u}px ${1.6 * u}px ${1.9 * u}px`,
                opacity: Math.min(1, s),
                transform: `translateY(${snap((1 - s) * 34)}px)`,
                boxShadow: up > 0.02 ? `0 ${14 * up}px ${40 * up}px rgba(126,194,90,${0.28 * up})` : undefined,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.9 * u,
              }}
            >
              <div
                style={{
                  fontFamily: FF.mono,
                  fontSize: type.kicker,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: c.accent || h > 0.4 ? t.green : t.inkFaint,
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontFamily: FF.ui,
                  fontSize: type.body * 0.9,
                  color: '#FFFFFF',
                  lineHeight: 1.3,
                }}
              >
                {c.line}
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* CALLOUT — one rule, boxed. For the line that has to land.           */
/* The rule lands first, the note follows a third of the way in, and   */
/* a pulse of light runs down the bar in the back half.                */
/* ------------------------------------------------------------------ */
export const TerminalCallout: React.FC<{
  tag?: string;
  line: string;
  note?: string;
}> = ({ tag = 'Worth knowing', line, note }) => {
  const { u, type, isVertical } = useLayout();
  const t = useTheme();
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const d30 = useBeat30();
  const s = spring({ frame: frame - 3, fps, config: { damping: 20, mass: 0.8 } });
  const lineIn = spring({ frame: frame - 0.08 * d30, fps, config: { damping: 200 } });
  const n = spring({ frame: frame - 0.32 * d30, fps, config: { damping: 200 } });
  const pulse = useSecondAct(0.55, 0.85);

  return (
    <Page justify="center" gap={0}>
      <div
        style={{
          width: '100%',
          position: 'relative',
          background: 'rgba(255,255,255,0.045)',
          padding: `${2.4 * u}px ${2.2 * u}px ${2.4 * u}px ${3 * u}px`,
          opacity: Math.min(1, s),
          transform: `translateX(${snap((1 - s) * -40)}px)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.4 * u,
          overflow: 'hidden',
        }}
      >
        {/* the bar draws itself top to bottom, then carries a pulse */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 0.8 * u,
            height: `${Math.min(1, s) * 100}%`,
            background: t.green,
          }}
        />
        {pulse > 0 && pulse < 1 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: `${pulse * 100 - 20}%`,
              width: 0.8 * u,
              height: '20%',
              background: '#EAFFDC',
              boxShadow: `0 0 22px ${t.green}`,
            }}
          />
        ) : null}
        <div
          style={{
            fontFamily: FF.mono,
            fontSize: type.kicker,
            letterSpacing: 3.4,
            textTransform: 'uppercase',
            color: t.green,
          }}
        >
          {tag}
        </div>
        <div
          style={{
            fontFamily: FF.ui,
            fontWeight: 700,
            fontSize: isVertical ? type.subtitle * 1.06 : type.subtitle,
            letterSpacing: '-0.035em',
            color: '#FFFFFF',
            lineHeight: 1.06,
            opacity: lineIn,
            transform: `translateY(${snap((1 - lineIn) * 16)}px)`,
          }}
        >
          {line}
        </div>
        {note ? (
          <div
            style={{
              fontFamily: FF.ui,
              fontSize: type.body * 0.88,
              color: t.inkSoft,
              lineHeight: 1.35,
              opacity: n,
              transform: `translateY(${snap((1 - n) * 14)}px)`,
            }}
          >
            {note}
          </div>
        ) : null}
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* PICK TWO — the trilemma, as three toggles that keep re-deciding.    */
/*                                                                     */
/* Three switches, and only ever two of them on. The page cycles       */
/* through every valid pair and names what each pair actually is, so   */
/* the beat keeps moving for its whole length instead of landing in    */
/* the first second and then sitting still.                            */
/* ------------------------------------------------------------------ */
export const TerminalPickTwo: React.FC<{
  heading: string;
  /** Exactly three, in order. */
  options: [string, string, string];
  /** Each state names the two that are on, and what that combination is. */
  states: { on: [number, number]; label: string }[];
  /** Frames each state holds. */
  hold?: number;
  /** Frames before the first state settles. */
  start?: number;
}> = ({ heading, options, states, hold = 70, start = 14 }) => {
  const { u, type, isVertical } = useLayout();
  const t = useTheme();
  const frame = useFrame();
  const fps = CLOCK_FPS;

  const i = Math.max(0, Math.min(states.length - 1, Math.floor((frame - start) / hold)));
  const state = states[i];
  const prev = states[i - 1] ?? state;
  // 0 to 1 across the switch between the previous state and this one
  const s = spring({
    frame: frame - (start + i * hold),
    fps,
    config: { damping: 18, mass: 0.7, stiffness: 120 },
  });

  const wasOn = (k: number) => (prev.on.includes(k) ? 1 : 0);
  const isOn = (k: number) => (state.on.includes(k) ? 1 : 0);
  const level = (k: number) => wasOn(k) + (isOn(k) - wasOn(k)) * s;

  const trackH = 3.4 * u;
  const knob = trackH - 0.8 * u;
  const trackW = isVertical ? 13 * u : 9 * u;

  return (
    <Page justify="center" gap={2.2 * u}>
      <Title delay={0} size={type.subtitle}>{heading}</Title>

      <div style={{ display: 'flex', flexDirection: 'column', gap: GUT, width: '100%' }}>
        {options.map((o, k) => {
          const v = level(k);
          const off = 1 - v;
          return (
            <div
              key={k}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.6 * u,
                background: `rgba(126,194,90,${0.04 + v * 0.11})`,
                borderLeft: `${0.5 * u}px solid ${
                  v > 0.5 ? t.green : 'rgba(255,255,255,0.14)'
                }`,
                padding: `${1.25 * u}px ${1.5 * u}px`,
              }}
            >
              <div
                style={{
                  flex: 1,
                  fontFamily: FF.mono,
                  fontSize: type.kicker * 1.15,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: `rgba(255,255,255,${0.3 + v * 0.7})`,
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                {o}
                {/* the strike is drawn on, so switching off reads as a decision */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '52%',
                    height: 2,
                    width: `${off * 100}%`,
                    background: 'rgba(255,255,255,0.4)',
                  }}
                />
              </div>

              {/* the switch */}
              <div
                style={{
                  width: trackW,
                  height: trackH,
                  background: v > 0.5 ? t.green : 'rgba(255,255,255,0.10)',
                  position: 'relative',
                  flex: '0 0 auto',
                  boxShadow: v > 0.5 ? t.accentGlow : undefined,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0.4 * u,
                    left: 0.4 * u + v * (trackW - knob - 0.8 * u),
                    width: knob,
                    height: knob,
                    background: v > 0.5 ? '#0B0D0B' : 'rgba(255,255,255,0.55)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* what the current pair actually is */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 1 * u,
          width: '100%',
          minHeight: type.body * 1.5,
        }}
      >
        <span style={{ fontFamily: FF.mono, fontSize: type.body * 0.9, color: t.green }}>→</span>
        <span
          style={{
            fontFamily: FF.ui,
            fontWeight: 600,
            fontSize: type.body * 1.02,
            color: '#FFFFFF',
            opacity: interpolate(s, [0, 0.35, 1], [0, 0, 1]),
            transform: `translateY(${snap((1 - s) * 8)}px)`,
          }}
        >
          {state.label}
        </span>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* VISUAL — the diagram is the page.                                   */
/*                                                                     */
/* A kicker, a big drawing, and one short line. No body copy, no       */
/* table. Used when the picture does the explaining and the voiceover  */
/* carries the rest.                                                   */
/* ------------------------------------------------------------------ */
export const TerminalVisual: React.FC<{
  figure: VisualName;
  kicker?: string;
  line: string;
  /** Emphasised fragment of the line, drawn in green. */
  accent?: string;
  /** Plate height in short-edge percent. */
  height?: number;
}> = ({ figure, kicker, line, accent, height }) => {
  const { u, type, isVertical, isReels } = useLayout();
  const t = useTheme();
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const Fig = VISUALS[figure];
  const s = spring({ frame: frame - 2, fps, config: { damping: 200 } });
  const l = spring({ frame: frame - 0.26 * useBeat30(), fps, config: { damping: 200 } });

  const h = (height ?? (isVertical ? (isReels ? 52 : 58) : 54)) * u;
  const arm = 3.2 * u;

  const body = accent ? (
    <>
      {line.split(accent)[0]}
      <span style={{ color: t.green }}>{accent}</span>
      {line.split(accent)[1]}
    </>
  ) : (
    line
  );

  return (
    <Page justify="center" gap={2.4 * u} sheets="none">
      {kicker ? (
        <div
          style={{
            fontFamily: FF.mono,
            fontSize: type.kicker,
            letterSpacing: 3.4,
            textTransform: 'uppercase',
            color: t.green,
            opacity: s,
          }}
        >
          {kicker}
        </div>
      ) : null}

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: h,
          color: t.figureInk,
          opacity: s,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2.2 * u,
          boxSizing: 'border-box',
        }}
      >
        <Fig delay={4} />
        {/* corner marks, the dark look's frame */}
        {[
          { left: 0, top: 0, w: arm, h: 2 },
          { left: 0, top: 0, w: 2, h: arm },
          { right: 0, top: 0, w: arm, h: 2 },
          { right: 0, top: 0, w: 2, h: arm },
          { left: 0, bottom: 0, w: arm, h: 2 },
          { left: 0, bottom: 0, w: 2, h: arm },
          { right: 0, bottom: 0, w: arm, h: 2 },
          { right: 0, bottom: 0, w: 2, h: arm },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: c.left,
              right: c.right,
              top: c.top,
              bottom: c.bottom,
              width: c.w,
              height: c.h,
              background: t.green,
              opacity: 0.75 * s,
            }}
          />
        ))}
      </div>

      <div
        style={{
          fontFamily: FF.ui,
          fontWeight: 700,
          fontSize: isVertical ? type.subtitle * 1.04 : type.subtitle,
          letterSpacing: '-0.035em',
          lineHeight: 1.06,
          color: '#FFFFFF',
          opacity: l,
          transform: `translateY(${snap((1 - l) * 12)}px)`,
        }}
      >
        {body}
      </div>
    </Page>
  );
};
