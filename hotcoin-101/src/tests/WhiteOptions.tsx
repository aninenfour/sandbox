import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SeriesChrome } from '../design/Chrome';
import { SafeModeProvider } from '../design/layoutContext';
import { useLayout } from '../design/layout';
import { COLOR } from '../design/tokens';
import { FF } from '../design/fonts';
import { Dot } from '../design/Dot';

/**
 * Three white-background directions for the series, same three pages in each.
 * Header rail, progress rule and the dot are identical across all three.
 * Content is FILE 008, FUD, FOMO and the Two Moods of the Market.
 */

type PageIndex = 0 | 1 | 2;

const WHITE = '#FFFFFF';
const OFFWHITE = '#F6F7F4';
const INK = '#111309';
const INK_SOFT = '#5C6055';
const INK_FAINT = '#9BA095';
const HAIR = '#E6E8E2';
const GREEN = COLOR.green;
const GREEN_DEEP = '#3E7A22';

const HOOK_1 = 'Every market has';
const HOOK_2 = 'two moods.';
const HOOK_SUB = 'Everything else is vocabulary.';

const TERM = 'FUD';
const PRON = 'eff-yoo-dee';
const POS = 'noun';
const DEF = 'Fear, uncertainty and doubt. Negative talk that travels faster than the news underneath it.';
const USAGE = 'Sometimes it is manipulation. Sometimes it is simply early.';

const CMP_HEAD = 'What you see, and what it usually is.';
const CMP: [string, string][] = [
  ['A wave of FUD', 'Often a real risk, arriving early'],
  ['Sudden FOMO', 'Late money buying from early money'],
  ['Total silence', 'The most underrated signal on the timeline'],
];

/* ================================================================== */
/* A · EDITORIAL WHITE                                                 */
/* Pure white, hairlines, one heavy grotesk. Swiss, no decoration.     */
/* ================================================================== */

const StyleA: React.FC<{ page: PageIndex }> = ({ page }) => {
  const { u, safe } = useLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const rule = spring({ frame: frame - 16, fps, config: { damping: 200 } });

  const Kick: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
      style={{
        fontFamily: FF.mono,
        fontSize: 2.15 * u,
        letterSpacing: 3.4,
        textTransform: 'uppercase',
        color: INK_FAINT,
      }}
    >
      {children}
    </div>
  );

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
        gap: 2.6 * u,
        opacity: s,
        transform: `translateY(${(1 - s) * 2 * u}px)`,
      }}
    >
      {page === 0 ? (
        <>
          <Kick>File 008 · Jargon</Kick>
          <div
            style={{
              fontFamily: FF.ui,
              fontWeight: 700,
              fontSize: 11.6 * u,
              lineHeight: 0.98,
              letterSpacing: '-0.042em',
              color: INK,
            }}
          >
            {HOOK_1}
            <br />
            {HOOK_2}
          </div>
          <div
            style={{
              width: '30%',
              height: 5,
              background: GREEN,
              transform: `scaleX(${rule})`,
              transformOrigin: 'left center',
            }}
          />
          <div style={{ fontFamily: FF.ui, fontSize: 3.4 * u, color: INK_SOFT, lineHeight: 1.4 }}>
            {HOOK_SUB}
          </div>
        </>
      ) : null}

      {page === 1 ? (
        <>
          <Kick>Glossary · entry 01</Kick>
          <div
            style={{
              fontFamily: FF.ui,
              fontWeight: 700,
              fontSize: 12.5 * u,
              lineHeight: 0.94,
              letterSpacing: '-0.05em',
              color: INK,
            }}
          >
            {TERM}
          </div>
          <div style={{ display: 'flex', gap: 1.6 * u, alignItems: 'baseline' }}>
            <span style={{ fontFamily: FF.mono, fontSize: 2.5 * u, color: INK_FAINT }}>/{PRON}/</span>
            <span style={{ fontFamily: FF.mono, fontSize: 2.5 * u, color: GREEN_DEEP }}>{POS}</span>
          </div>
          <div style={{ height: 2, background: HAIR, width: '100%' }} />
          <div style={{ fontFamily: FF.ui, fontSize: 3.5 * u, color: INK, lineHeight: 1.4 }}>{DEF}</div>
          <div
            style={{
              fontFamily: FF.ui,
              fontSize: 3.1 * u,
              color: INK_SOFT,
              lineHeight: 1.4,
              borderLeft: `3px solid ${GREEN}`,
              paddingLeft: 1.8 * u,
            }}
          >
            {USAGE}
          </div>
        </>
      ) : null}

      {page === 2 ? (
        <>
          <div
            style={{
              fontFamily: FF.ui,
              fontWeight: 700,
              fontSize: 5.4 * u,
              lineHeight: 1.06,
              letterSpacing: '-0.03em',
              color: INK,
            }}
          >
            {CMP_HEAD}
          </div>
          <div style={{ height: 2, background: INK, width: '100%' }} />
          {CMP.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 1.6 * u,
                paddingTop: 1.6 * u,
                paddingBottom: 1.6 * u,
                borderBottom: i === CMP.length - 1 ? 'none' : `1px solid ${HAIR}`,
              }}
            >
              <div style={{ flex: 1, fontFamily: FF.ui, fontWeight: 500, fontSize: 3.2 * u, color: INK }}>
                {r[0]}
              </div>
              <div style={{ flex: 1.15, fontFamily: FF.ui, fontSize: 3.2 * u, color: INK_SOFT, lineHeight: 1.3 }}>
                {r[1]}
              </div>
            </div>
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* B · SOFT CARD                                                       */
/* Off-white ground, white cards, round corners, soft shadow, pills.   */
/* ================================================================== */

const Pill: React.FC<{ children: React.ReactNode; tone?: 'green' | 'grey' }> = ({
  children,
  tone = 'green',
}) => {
  const { u } = useLayout();
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: FF.mono,
        fontSize: 2.1 * u,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: tone === 'green' ? GREEN_DEEP : INK_FAINT,
        background: tone === 'green' ? 'rgba(126,194,90,0.16)' : 'rgba(17,19,9,0.05)',
        padding: `${0.75 * u}px ${1.5 * u}px`,
        borderRadius: 999,
      }}
    >
      {children}
    </span>
  );
};

const Card: React.FC<{ children: React.ReactNode; delay?: number; pad?: number }> = ({
  children,
  delay = 0,
  pad,
}) => {
  const { u } = useLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, mass: 0.9 } });
  return (
    <div
      style={{
        background: WHITE,
        borderRadius: 2.4 * u,
        padding: pad ?? 3.4 * u,
        boxShadow: '0 10px 34px rgba(20,28,12,0.07), 0 1px 3px rgba(20,28,12,0.05)',
        opacity: s,
        transform: `translateY(${(1 - s) * 2.6 * u}px)`,
      }}
    >
      {children}
    </div>
  );
};

const StyleB: React.FC<{ page: PageIndex }> = ({ page }) => {
  const { u, safe } = useLayout();
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
      {page === 0 ? (
        <Card>
          <div style={{ marginBottom: 2.2 * u }}>
            <Pill>File 008 · Jargon</Pill>
          </div>
          <div
            style={{
              fontFamily: FF.ui,
              fontWeight: 700,
              fontSize: 9.4 * u,
              lineHeight: 1.0,
              letterSpacing: '-0.038em',
              color: INK,
            }}
          >
            {HOOK_1} {HOOK_2}
          </div>
          <div
            style={{
              fontFamily: FF.ui,
              fontSize: 3.3 * u,
              color: INK_SOFT,
              lineHeight: 1.4,
              marginTop: 2 * u,
            }}
          >
            {HOOK_SUB}
          </div>
        </Card>
      ) : null}

      {page === 1 ? (
        <>
          <Card>
            <div style={{ display: 'flex', gap: 1 * u, marginBottom: 2 * u }}>
              <Pill>Entry 01</Pill>
              <Pill tone="grey">{POS}</Pill>
            </div>
            <div
              style={{
                fontFamily: FF.ui,
                fontWeight: 700,
                fontSize: 10.5 * u,
                lineHeight: 0.96,
                letterSpacing: '-0.05em',
                color: INK,
              }}
            >
              {TERM}
            </div>
            <div style={{ fontFamily: FF.mono, fontSize: 2.5 * u, color: INK_FAINT, marginTop: 1.2 * u }}>
              /{PRON}/
            </div>
            <div
              style={{
                fontFamily: FF.ui,
                fontSize: 3.4 * u,
                color: INK,
                lineHeight: 1.4,
                marginTop: 2.2 * u,
              }}
            >
              {DEF}
            </div>
          </Card>
          <Card delay={8} pad={2.6 * u}>
            <div style={{ fontFamily: FF.ui, fontSize: 3 * u, color: INK_SOFT, lineHeight: 1.4 }}>
              {USAGE}
            </div>
          </Card>
        </>
      ) : null}

      {page === 2 ? (
        <>
          <div
            style={{
              fontFamily: FF.ui,
              fontWeight: 700,
              fontSize: 5.2 * u,
              lineHeight: 1.06,
              letterSpacing: '-0.03em',
              color: INK,
              marginBottom: 1 * u,
            }}
          >
            {CMP_HEAD}
          </div>
          {CMP.map((r, i) => (
            <Card key={i} delay={i * 7} pad={2.6 * u}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 1.6 * u }}>
                <div style={{ flex: 1, fontFamily: FF.ui, fontWeight: 600, fontSize: 3.1 * u, color: INK }}>
                  {r[0]}
                </div>
                <div style={{ color: GREEN, fontFamily: FF.ui, fontSize: 3.1 * u }}>→</div>
                <div style={{ flex: 1.2, fontFamily: FF.ui, fontSize: 3 * u, color: INK_SOFT, lineHeight: 1.3 }}>
                  {r[1]}
                </div>
              </div>
            </Card>
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* C · WHITE + GREEN BLOCK                                             */
/* White ground, one solid green slab per page, type reversed out.     */
/* ================================================================== */

const StyleC: React.FC<{ page: PageIndex }> = ({ page }) => {
  const { u, safe, width } = useLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweep = spring({ frame: frame - 2, fps, config: { damping: 200, mass: 1.05 } });
  const s = spring({ frame: frame - 12, fps, config: { damping: 200 } });

  const Slab: React.FC<{ children: React.ReactNode; tall?: boolean }> = ({ children, tall }) => (
    <div
      style={{
        position: 'relative',
        marginLeft: -safe.left,
        marginRight: -safe.right,
        background: GREEN,
        padding: `${(tall ? 5 : 4) * u}px ${safe.left}px ${(tall ? 5 : 4) * u}px`,
        clipPath: `inset(0 ${(1 - sweep) * 100}% 0 0)`,
      }}
    >
      <div style={{ opacity: s }}>{children}</div>
    </div>
  );

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
        gap: 3 * u,
      }}
    >
      {page === 0 ? (
        <>
          <Slab tall>
            <div
              style={{
                fontFamily: FF.mono,
                fontSize: 2.15 * u,
                letterSpacing: 3.4,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: 1.8 * u,
              }}
            >
              File 008 · Jargon
            </div>
            <div
              style={{
                fontFamily: FF.ui,
                fontWeight: 700,
                fontSize: 9.8 * u,
                lineHeight: 0.99,
                letterSpacing: '-0.04em',
                color: WHITE,
              }}
            >
              {HOOK_1}
              <br />
              {HOOK_2}
            </div>
          </Slab>
          <div style={{ fontFamily: FF.ui, fontSize: 3.4 * u, color: INK_SOFT, lineHeight: 1.4 }}>
            {HOOK_SUB}
          </div>
        </>
      ) : null}

      {page === 1 ? (
        <>
          <Slab tall>
            <div
              style={{
                fontFamily: FF.mono,
                fontSize: 2.15 * u,
                letterSpacing: 3.4,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: 1.4 * u,
              }}
            >
              Glossary · entry 01
            </div>
            <div
              style={{
                fontFamily: FF.ui,
                fontWeight: 700,
                fontSize: 12 * u,
                lineHeight: 0.94,
                letterSpacing: '-0.05em',
                color: WHITE,
              }}
            >
              {TERM}
            </div>
            <div style={{ fontFamily: FF.mono, fontSize: 2.5 * u, color: 'rgba(255,255,255,0.8)', marginTop: 1 * u }}>
              /{PRON}/ {POS}
            </div>
          </Slab>
          <div style={{ fontFamily: FF.ui, fontSize: 3.5 * u, color: INK, lineHeight: 1.4 }}>{DEF}</div>
          <div style={{ fontFamily: FF.ui, fontSize: 3.1 * u, color: INK_SOFT, lineHeight: 1.4 }}>
            {USAGE}
          </div>
        </>
      ) : null}

      {page === 2 ? (
        <>
          <Slab>
            <div
              style={{
                fontFamily: FF.ui,
                fontWeight: 700,
                fontSize: 5.2 * u,
                lineHeight: 1.06,
                letterSpacing: '-0.03em',
                color: WHITE,
              }}
            >
              {CMP_HEAD}
            </div>
          </Slab>
          {CMP.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 1.6 * u,
                paddingBottom: 1.6 * u,
                borderBottom: i === CMP.length - 1 ? 'none' : `1px solid ${HAIR}`,
                opacity: s,
              }}
            >
              <div style={{ flex: 1, fontFamily: FF.ui, fontWeight: 600, fontSize: 3.1 * u, color: INK }}>
                {r[0]}
              </div>
              <div style={{ flex: 1.2, fontFamily: FF.ui, fontSize: 3.1 * u, color: INK_SOFT, lineHeight: 1.3 }}>
                {r[1]}
              </div>
            </div>
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */

const DotCorner: React.FC = () => {
  const { u, safe } = useLayout();
  return (
    <div style={{ position: 'absolute', left: safe.left, bottom: safe.bottom + 3 * u }}>
      <Dot r={4.2 * u} mood="curious" lid={WHITE} />
    </div>
  );
};

export const WhiteOption: React.FC<{ style?: 'a' | 'b' | 'c'; page?: PageIndex }> = ({
  style = 'a',
  page = 0,
}) => (
  <SafeModeProvider value="reels">
    <AbsoluteFill style={{ background: style === 'b' ? OFFWHITE : WHITE }}>
      {style === 'a' ? <StyleA page={page} /> : null}
      {style === 'b' ? <StyleB page={page} /> : null}
      {style === 'c' ? <StyleC page={page} /> : null}
      <DotCorner />
      <SeriesChrome episode="FILE 008" pillar="Jargon" />
    </AbsoluteFill>
  </SafeModeProvider>
);
