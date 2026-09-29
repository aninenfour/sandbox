import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { SERIES } from '../design/tokens';
import { FF } from '../design/fonts';
import { useLayout } from '../design/layout';
import { Page } from '../design/Scene';
import { Body, Highlight, InkRule, Kicker, Mono, Title, useInk } from '../design/Type';
import { FIGURES, FigureName, Plate } from '../design/Figures';
import { LogoLockup, LogoMark } from '../design/Chrome';
import { LockupAssembly, LockupDarkAssembly, useLockup } from '../design/Dot';
import { MaybeSheet, useLook } from '../design/Sheet';
import { useTheme } from '../design/theme';
import {
  TerminalCallout,
  TerminalCards,
  TerminalCompare,
  TerminalList,
  TerminalPickTwo,
  TerminalVisual,
} from './terminal';

/** Entrance offsets snap to zero once under half a pixel, so landed text never creeps. */
const snap = (px: number) => (Math.abs(px) < 0.5 ? 0 : px);
import { CLOCK_FPS, useFrame, useToClock } from '../design/clock';

/* ------------------------------------------------------------------ */
/* COLD OPEN — the hook. One claim, one number, three seconds.         */
/* ------------------------------------------------------------------ */
export const ColdOpen: React.FC<{
  kicker?: string;
  line1: string;
  line2?: string;
  highlight?: boolean;
  footnote?: string;
}> = ({ kicker, line1, line2, highlight, footnote }) => {
  const { type, u, isVertical } = useLayout();
  const t = useTheme();
  return (
    <Page justify="center">
      {kicker ? <Kicker delay={2}>{kicker}</Kicker> : null}
      <div style={{ height: 1.2 * u }} />
      <Title delay={6} size={isVertical ? type.mega : type.title * 1.25}>
        {line1}
        {line2 ? (
          <>
            <br />
            {highlight ? <Highlight delay={22}>{line2}</Highlight> : line2}
          </>
        ) : null}
      </Title>
      <div style={{ height: 1.4 * u }} />
      <InkRule delay={18} width={isVertical ? '46%' : '26%'} thickness={3} color={t.green} />
      {footnote ? (
        <>
          <div style={{ height: 1.2 * u }} />
          <Mono delay={26}>{footnote}</Mono>
        </>
      ) : null}
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* TITLE CARD — the episode's masthead.                                */
/* ------------------------------------------------------------------ */
export const TitleCard: React.FC<{
  file: string;
  pillar: string;
  title: string;
  subtitle?: string;
}> = ({ file, pillar, title, subtitle }) => {
  const { type, u, isVertical } = useLayout();
  const t = useTheme();
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const stamp = spring({ frame: frame - 14, fps, config: { damping: 12, mass: 0.6 } });
  return (
    <Page justify="center">
      <div style={{ display: 'flex', alignItems: 'center', gap: 1.6 * u }}>
        {/* the black mark disappears on black, and the rail already carries the
            reversed lockup, so the dark look leads with the words alone */}
        {t.dark ? null : <LogoMark size={4.4 * u} />}
        <Kicker delay={0} color={t.ink}>
          {SERIES.name} / {SERIES.strap}
        </Kicker>
      </div>
      <div style={{ height: 1.2 * u }} />
      <InkRule delay={6} thickness={2} />
      <div style={{ height: 2.2 * u }} />
      <Title delay={12} size={isVertical ? type.title * 1.12 : type.title * 1.3}>
        {title}
      </Title>
      {subtitle ? (
        <>
          <div style={{ height: 0.8 * u }} />
          <Title delay={20} italic color={t.inkSoft} size={type.subtitle}>
            {subtitle}
          </Title>
        </>
      ) : null}
      <div style={{ height: 2.6 * u }} />
      {/* Paper gets a rubber stamp. White gets a printed tag, square and flat. */}
      <div
        style={
          t.texture
            ? {
                transform: `scale(${interpolate(stamp, [0, 1], [1.25, 1])}) rotate(-2.2deg)`,
                opacity: stamp,
                border: `2.5px solid ${t.green}`,
                padding: `${0.8 * u}px ${1.6 * u}px`,
                fontFamily: FF.mono,
                fontSize: type.kicker,
                letterSpacing: 4,
                color: t.greenDeep,
                textTransform: 'uppercase',
                fontWeight: 600,
              }
            : {
                transform: `translateY(${snap((1 - stamp) * 10)}px)`,
                opacity: stamp,
                background: t.green,
                padding: `${0.9 * u}px ${1.8 * u}px`,
                fontFamily: FF.mono,
                fontSize: type.kicker,
                letterSpacing: 4,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                fontWeight: 600,
              }
        }
      >
        {file} · {pillar}
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* FIGURE BEAT — the documentary workhorse: a plate plus a claim.      */
/* ------------------------------------------------------------------ */
export const FigureBeat: React.FC<{
  figure: FigureName;
  figNo?: string;
  caption?: string;
  era?: string;
  heading: string;
  body?: string;
  highlight?: string;
  /** 'tall' gives the plate more room, for diagrams that carry labels. */
  size?: 'normal' | 'tall';
}> = ({ figure, figNo, caption, era, heading, body, highlight, size = 'normal' }) => {
  const { u, type, isVertical, isReels } = useLayout();
  const t = useTheme();
  const cut = useLook() === 'cutPaper';
  const Fig = FIGURES[figure];

  const text = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1.4 * u, flex: 1 }}>
      {era ? <Kicker delay={4} color={t.greenDeep}>{era}</Kicker> : null}
      <Title delay={8} size={isVertical ? type.subtitle * 1.12 : type.subtitle}>
        {highlight ? (
          <>
            {heading.split(highlight)[0]}
            <Highlight delay={24}>{highlight}</Highlight>
            {heading.split(highlight)[1]}
          </>
        ) : (
          heading
        )}
      </Title>
      {body ? <Body delay={16} maxWidth={isVertical ? '100%' : '92%'}>{body}</Body> : null}
    </div>
  );

  if (isVertical) {
    return (
      <Page justify="center" gap={3 * u} sheets="each" seed={7}>
        <Plate figNo={figNo} caption={caption} delay={2} height={(size === 'tall' ? (isReels ? 50 : 62) : isReels ? 40 : 50) * u}>
          <Fig delay={8} />
        </Plate>
        {text}
      </Page>
    );
  }
  const plateH = (size === 'tall' ? (cut ? 56 : 66) : cut ? 48 : 56) * u;
  return (
    <Page justify="center" sheets="none">
      <div
        style={{
          display: 'flex',
          gap: cut ? 3 * u : 5 * u,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <MaybeSheet rot={1.3} seed={7} pad={1.8 * u} style={{ flex: '0 0 42%', zIndex: 2 }}>
          <Plate figNo={figNo} caption={caption} delay={2} height={plateH}>
            <Fig delay={8} />
          </Plate>
        </MaybeSheet>
        <MaybeSheet rot={-0.9} seed={13} delay={7} style={{ flex: 1, zIndex: 1, marginLeft: cut ? -2.4 * u : 0 }}>
          {text}
        </MaybeSheet>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* STAT BEAT — one number, counted up, with its source.                */
/* ------------------------------------------------------------------ */
export const StatBeat: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  source?: string;
  color?: string;
  /** Off for years and other non-quantities, so 2009 does not become 2,009. */
  grouping?: boolean;
}> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  label,
  source,
  color,
  grouping = true,
}) => {
  const { type, u } = useLayout();
  const t = useTheme();
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const s = spring({ frame: frame - 6, fps, config: { damping: 200, mass: 1.1 } });
  const shown = (value * s).toFixed(decimals);
  const ink = useInk(4);
  return (
    <Page justify="center">
      <div
        style={{
          ...ink,
          fontFamily: t.display,
          fontSize: type.stat,
          lineHeight: 0.92,
          letterSpacing: t.displayTracking,
          color: color ?? t.ink,
          fontWeight: t.displayWeight,
          fontVariantNumeric: 'tabular-nums',
          textShadow: t.dark ? '0 0 60px rgba(126,194,90,0.45)' : undefined,
        }}
      >
        {prefix}
        {grouping
          ? Number(shown).toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          : shown}
        {suffix}
      </div>
      <div style={{ height: 1.2 * u }} />
      <InkRule delay={10} width="34%" thickness={3} color={t.green} />
      <div style={{ height: 1.4 * u }} />
      <Title delay={14} size={type.subtitle * 0.82} color={t.inkSoft}>
        {label}
      </Title>
      {source ? (
        <>
          <div style={{ height: 1.2 * u }} />
          <Mono delay={22}>{source}</Mono>
        </>
      ) : null}
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* COMPARE BEAT — two ledger columns, the TradFi / crypto workhorse.   */
/* ------------------------------------------------------------------ */
export const CompareBeat: React.FC<{
  heading?: string;
  leftTitle: string;
  rightTitle: string;
  rows: [string, string][];
  /** 'columns' keeps two ledger blocks. 'pairs' keeps each row's mapping visible. */
  mode?: 'columns' | 'pairs';
}> = ({ heading, leftTitle, rightTitle, rows, mode = 'columns' }) => {
  const { u, type, isVertical } = useLayout();
  const t = useTheme();
  const frame = useFrame();
  const fps = CLOCK_FPS;

  // The dark look draws this as filled blocks rather than ruled rows, with the
  // last row solid green because it is always the conclusion.
  if (t.dark) {
    return (
      <TerminalCompare
        heading={heading}
        leftTitle={leftTitle}
        rightTitle={rightTitle}
        rows={rows}
      />
    );
  }

  if (mode === 'pairs') {
    return (
      <Page justify="center" gap={2.2 * u}>
        {heading ? <Title delay={0} size={type.subtitle}>{heading}</Title> : null}
        <div style={{ display: 'flex', width: '100%', gap: 1.4 * u }}>
          <div
            style={{
              flex: 1,
              fontFamily: FF.mono,
              fontSize: type.kicker,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: t.inkFaint,
            }}
          >
            {leftTitle}
          </div>
          <div
            style={{
              flex: 1,
              fontFamily: FF.mono,
              fontSize: type.kicker,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: t.greenDeep,
              fontWeight: 600,
            }}
          >
            {rightTitle}
          </div>
        </div>
        <InkRule delay={6} thickness={2} />
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {rows.map((r, i) => {
            const sp = spring({ frame: frame - 14 - i * 7, fps, config: { damping: 200 } });
            return (
              <div
                key={i}
                style={{
                  opacity: sp,
                  transform: `translateY(${snap((1 - sp) * 10)}px)`,
                  display: 'flex',
                  gap: 1.4 * u,
                  alignItems: 'flex-start',
                  paddingTop: 1.5 * u,
                  paddingBottom: 1.5 * u,
                  borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${t.rule}`,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    fontFamily: FF.ui,
                    fontSize: type.body * 0.88,
                    color: t.ink,
                    lineHeight: 1.3,
                  }}
                >
                  {r[0]}
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    gap: 0.8 * u,
                    fontFamily: FF.ui,
                    fontSize: type.body * 0.88,
                    color: t.inkSoft,
                    lineHeight: 1.3,
                  }}
                >
                  <span style={{ color: t.green }}>→</span>
                  <span>{r[1]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Page>
    );
  }

  const Col = ({ title, items, accent }: { title: string; items: string[]; accent: boolean }) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.2 * u }}>
      <div
        style={{
          fontFamily: FF.mono,
          fontSize: type.kicker,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: accent ? t.greenDeep : t.inkFaint,
          fontWeight: 600,
        }}
      >
        {title}
      </div>
      <InkRule delay={6} thickness={2} color={accent ? t.green : t.rule} />
      {items.map((it, i) => {
        const s = spring({ frame: frame - 14 - i * 5, fps, config: { damping: 200 } });
        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateX(${snap((1 - s) * 10)}px)`,
              fontFamily: FF.ui,
              fontSize: type.body * 0.86,
              color: t.ink,
              lineHeight: 1.35,
              display: 'flex',
              gap: 0.8 * u,
            }}
          >
            <span style={{ color: accent ? t.green : t.inkFaint }}>→</span>
            <span>{it}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <Page justify="center" gap={2.6 * u}>
      {heading ? <Title delay={0} size={type.subtitle}>{heading}</Title> : null}
      <div
        style={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          gap: isVertical ? 3 * u : 5 * u,
          width: '100%',
        }}
      >
        <Col title={leftTitle} items={rows.map((r) => r[0])} accent={false} />
        <Col title={rightTitle} items={rows.map((r) => r[1])} accent />
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* TERM BEAT — the jargon card, for the WAGMI / FUD style episodes.    */
/* ------------------------------------------------------------------ */
export const TermBeat: React.FC<{
  term: string;
  pron?: string;
  partOfSpeech?: string;
  definition: string;
  usage?: string;
  entry?: string;
}> = ({ term, pron, partOfSpeech = 'noun', definition, usage, entry }) => {
  const { u, type, isVertical } = useLayout();
  const t = useTheme();
  return (
    <Page justify="center" gap={1.6 * u}>
      <Kicker delay={0} color={t.greenDeep}>
        {entry ? `Glossary · entry ${entry}` : 'Glossary entry'}
      </Kicker>
      <Title delay={6} size={isVertical ? type.title : type.title * 1.1}>
        {term}
      </Title>
      <div style={{ display: 'flex', gap: 1.4 * u, alignItems: 'baseline' }}>
        {pron ? <Mono delay={12}>/{pron}/</Mono> : null}
        <Mono delay={14} color={t.green}>{partOfSpeech}</Mono>
      </div>
      <InkRule delay={16} width="100%" thickness={2} />
      <Body delay={20} size={type.body} color={t.ink}>
        {definition}
      </Body>
      {usage ? (
        <div
          style={{
            borderLeft: `3px solid ${t.green}`,
            paddingLeft: 1.6 * u,
            marginTop: 0.6 * u,
          }}
        >
          <Body delay={28} size={type.body * 0.9} color={t.inkSoft}>
            <span style={{ fontStyle: 'italic' }}>{usage}</span>
          </Body>
        </div>
      ) : null}
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* LIST BEAT — arrow list, Alex's preferred list format.               */
/* ------------------------------------------------------------------ */
export const ListBeat: React.FC<{
  heading: string;
  items: string[];
  numbered?: boolean;
}> = ({ heading, items, numbered }) => {
  const { u, type } = useLayout();
  const t = useTheme();
  const frame = useFrame();
  const fps = CLOCK_FPS;
  if (t.dark) return <TerminalList heading={heading} items={items} numbered={numbered} />;
  return (
    <Page justify="center" gap={2.2 * u}>
      <Title delay={0} size={type.subtitle}>{heading}</Title>
      <InkRule delay={8} thickness={2} color={t.green} width="18%" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1.5 * u, width: '100%' }}>
        {items.map((it, i) => {
          const s = spring({ frame: frame - 14 - i * 6, fps, config: { damping: 200 } });
          return (
            <div
              key={i}
              style={{
                opacity: s,
                transform: `translateY(${snap((1 - s) * 12)}px)`,
                display: 'flex',
                gap: 1.2 * u,
                alignItems: 'flex-start',
              }}
            >
              <span
                style={{
                  fontFamily: FF.mono,
                  fontSize: type.body * 0.8,
                  color: t.green,
                  minWidth: 3 * u,
                  paddingTop: '0.25em',
                }}
              >
                {numbered ? String(i + 1).padStart(2, '0') : '→'}
              </span>
              <span
                style={{
                  fontFamily: FF.ui,
                  fontSize: type.body,
                  color: t.ink,
                  lineHeight: 1.35,
                }}
              >
                {it}
              </span>
            </div>
          );
        })}
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* QUOTE BEAT                                                          */
/* ------------------------------------------------------------------ */
export const QuoteBeat: React.FC<{ quote: string; attribution?: string }> = ({
  quote,
  attribution,
}) => {
  const { u, type } = useLayout();
  const t = useTheme();
  return (
    <Page justify="center" gap={2 * u}>
      <div
        style={{
          fontFamily: FF.display,
          fontSize: type.title * 1.6,
          color: t.green,
          lineHeight: 0.6,
          height: type.title * 0.7,
        }}
      >
        “
      </div>
      <Title delay={6} italic size={type.subtitle * 1.05}>
        {quote}
      </Title>
      {attribution ? <Mono delay={18}>{attribution}</Mono> : null}
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* OUTRO — the takeaway plus a light Hotcoin lockup.                   */
/* ------------------------------------------------------------------ */
export const Outro: React.FC<{
  takeaway: string;
  cta?: string;
  nextHint?: string;
}> = ({ takeaway, cta, nextHint }) => {
  const { u, type, isVertical } = useLayout();
  const t = useTheme();
  return (
    <Page justify="center" gap={2.2 * u}>
      <Kicker delay={0} color={t.greenDeep}>The takeaway</Kicker>
      <Title delay={6} size={isVertical ? type.subtitle * 1.2 : type.subtitle * 1.15}>
        {takeaway}
      </Title>
      <div style={{ height: 1.2 * u }} />
      <InkRule delay={18} thickness={2} color={t.green} width="22%" />
      {cta ? (
        <Body delay={24} size={type.body * 0.92} color={t.inkSoft}>
          {cta}
        </Body>
      ) : null}
      {nextHint ? <Mono delay={32}>{nextHint}</Mono> : null}
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* END CARD — the series sign-off. Lockup, rule, one link.             */
/* ------------------------------------------------------------------ */
export const EndCard: React.FC<{
  url?: string;
  strap?: string;
  /** The dot flies home and the ink assembles around it. */
  merge?: boolean;
}> = ({ url = 'hotcoin.com', strap = 'Hotcoin 101 · Money, explained', merge }) => {
  if (merge) return <EndCardMerge url={url} strap={strap} />;
  return <EndCardStatic url={url} strap={strap} />;
};

const EndCardMerge: React.FC<{ url: string; strap: string }> = ({ url, strap }) => {
  const { u, type, isVertical } = useLayout();
  const t = useTheme();
  const L = useLockup();
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const rule = spring({ frame: frame - 26, fps, config: { damping: 200 } });
  const tx = spring({ frame: frame - 34, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill>
      {t.dark ? <LockupDarkAssembly delay={12} /> : <LockupAssembly inkDelay={14} wordDelay={26} />}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: L.top + L.lockH + 4 * u,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2.2 * u,
        }}
      >
        <div
          style={{
            width: isVertical ? '46%' : '26%',
            height: 2,
            background: t.green,
            boxShadow: t.accentGlow,
            transform: `scaleX(${rule})`,
          }}
        />
        <div
          style={{
            opacity: tx,
            transform: `translateY(${snap((1 - tx) * 8)}px)`,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 1 * u,
          }}
        >
          <div
            style={{
              fontFamily: FF.ui,
              fontSize: type.body * 0.98,
              color: t.ink,
              fontWeight: 500,
            }}
          >
            Learn more at {url}
          </div>
          <div
            style={{
              fontFamily: FF.mono,
              fontSize: type.kicker,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: t.inkFaint,
            }}
          >
            {strap}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EndCardStatic: React.FC<{
  url?: string;
  strap?: string;
}> = ({ url = 'hotcoin.com', strap = 'Hotcoin 101 · Money, explained' }) => {
  const { u, type, isVertical } = useLayout();
  const t = useTheme();
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const s = spring({ frame: frame - 4, fps, config: { damping: 200, mass: 0.9 } });
  const r = spring({ frame: frame - 16, fps, config: { damping: 200 } });
  const tx = spring({ frame: frame - 22, fps, config: { damping: 200 } });

  return (
    <Page justify="center" align="center" gap={2.6 * u}>
      <div
        style={{
          opacity: s,
          transform: `translateY(${snap((1 - s) * 12)}px)`,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {t.dark ? (
          <Img src={staticFile('hotcoin-lockup-dark.png')} style={{ width: isVertical ? 76 * u : 46 * u }} />
        ) : (
          <LogoLockup width={isVertical ? 62 * u : 38 * u} />
        )}
      </div>
      <div
        style={{
          width: isVertical ? '46%' : '26%',
          height: 2,
          background: t.green,
          transform: `scaleX(${r})`,
        }}
      />
      <div
        style={{
          opacity: tx,
          transform: `translateY(${snap((1 - tx) * 8)}px)`,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 1 * u,
        }}
      >
        <div
          style={{
            fontFamily: FF.ui,
            fontSize: type.body * 0.98,
            color: t.ink,
            fontWeight: 500,
          }}
        >
          Learn more at {url}
        </div>
        <div
          style={{
            fontFamily: FF.mono,
            fontSize: type.kicker,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: t.inkFaint,
          }}
        >
          {strap}
        </div>
      </div>
    </Page>
  );
};

/* ------------------------------------------------------------------ */
/* TIMELINE BEAT — eras sliding under a fixed playhead.                */
/* ------------------------------------------------------------------ */
export const TimelineBeat: React.FC<{
  heading?: string;
  marks: { year: string; label: string }[];
}> = ({ heading, marks }) => {
  const { u, type } = useLayout();
  const t = useTheme();
  const frame = useFrame();
  const { durationInFrames: realD } = useVideoConfig();
  const fps = CLOCK_FPS;
  const durationInFrames = useToClock()(realD);

  // The rail draws itself downward across the beat, marks land as it passes.
  const rail = interpolate(frame, [10, durationInFrames * 0.68], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Page justify="center" gap={2.8 * u}>
      {heading ? (
        <>
          <Title delay={0} size={type.subtitle}>
            {heading}
          </Title>
          <InkRule delay={8} thickness={2} color={t.green} width="18%" />
        </>
      ) : null}
      <div style={{ position: 'relative', width: '100%', paddingLeft: 3 * u }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0.9 * u,
            width: 2,
            height: `calc(${rail * 100}% - ${0.9 * u}px)`,
            background: t.rule,
          }}
        />
        {marks.map((m, i) => {
          const s = spring({
            frame: frame - 16 - i * (durationInFrames * 0.13),
            fps,
            config: { damping: 200 },
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.8 * u,
                opacity: s,
                transform: `translateX(${snap((1 - s) * 16)}px)`,
                marginBottom: 2.6 * u,
              }}
            >
              <div
                style={{
                  width: 1.1 * u,
                  height: 1.1 * u,
                  borderRadius: '50%',
                  background: t.green,
                  marginLeft: -3 * u - 0.55 * u + 1,
                  marginTop: 0.75 * u,
                  flex: '0 0 auto',
                }}
              />
              <div style={{ marginLeft: -1.8 * u + 3 * u }}>
                <div
                  style={{
                    fontFamily: FF.mono,
                    fontSize: type.kicker,
                    letterSpacing: 2,
                    color: t.greenDeep,
                    fontWeight: 600,
                  }}
                >
                  {m.year}
                </div>
                <div
                  style={{
                    fontFamily: FF.display,
                    fontSize: type.body * 1.1,
                    color: t.ink,
                    marginTop: 0.4 * u,
                    lineHeight: 1.2,
                  }}
                >
                  {m.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
};


/* ------------------------------------------------------------------ */
/* CARDS — several named things at once. Dark look only for now.       */
/* ------------------------------------------------------------------ */
export const CardsBeat: React.FC<{
  heading?: string;
  cards: { label: string; line: string; accent?: boolean }[];
}> = (props) => <TerminalCards {...props} />;

/* ------------------------------------------------------------------ */
/* CALLOUT — one boxed rule. Dark look only for now.                   */
/* ------------------------------------------------------------------ */
export const CalloutBeat: React.FC<{
  tag?: string;
  line: string;
  note?: string;
}> = (props) => <TerminalCallout {...props} />;


/* ------------------------------------------------------------------ */
/* PICK TWO — the trilemma as live toggles. Dark look only for now.    */
/* ------------------------------------------------------------------ */
export const PickTwoBeat: React.FC<{
  heading: string;
  options: [string, string, string];
  states: { on: [number, number]; label: string }[];
  hold?: number;
  start?: number;
}> = (props) => <TerminalPickTwo {...props} />;


/* ------------------------------------------------------------------ */
/* VISUAL — a diagram plus one line. Dark look only for now.           */
/* ------------------------------------------------------------------ */
export const VisualBeat: React.FC<React.ComponentProps<typeof TerminalVisual>> = (props) => (
  <TerminalVisual {...props} />
);
