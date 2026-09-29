import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Paper, PaperGrain } from '../design/Paper';
import { SeriesChrome } from '../design/Chrome';
import { SafeModeProvider } from '../design/layoutContext';
import { useLayout } from '../design/layout';
import { COLOR } from '../design/tokens';
import { FF } from '../design/fonts';
import { FIGURES } from '../design/Figures';
import { Dot } from '../design/Dot';

/**
 * Three visual directions for the series, same content in each so they can be
 * compared honestly. The header rail and the progress rule are identical
 * across all three, since those are what make the series recognisable.
 *
 * Content is FILE 006, Position Sizing Beats Prediction.
 */

type PageIndex = 0 | 1 | 2;

const HOOK_1 = 'Most traders die of size,';
const HOOK_2 = 'not of being wrong.';
const FIG_HEAD = 'One oversized trade erases ten good ones.';
const FIG_BODY =
  'Ten disciplined trades build the account slowly. A single position four times too large gives all of it back in an afternoon.';
const STAT_LABEL = 'A fifty percent loss needs a one hundred percent gain just to get back to level.';

/* ================================================================== */
/* A · CUT PAPER                                                       */
/* Layered card stock with real shadows and torn edges. Tactile.       */
/* ================================================================== */

const tornPolygon = (seed: number, teeth = 26) => {
  const pts: string[] = ['0% 0%', '100% 0%'];
  for (let i = teeth; i >= 0; i--) {
    const t = i / teeth;
    const wobble = 1.6 + Math.sin(seed + i * 1.7) * 1.1 + Math.sin(seed * 2.3 + i * 0.6) * 0.7;
    pts.push(`${t * 100}% ${100 - wobble}%`);
  }
  return `polygon(${pts.join(',')})`;
};

const Card: React.FC<{
  children: React.ReactNode;
  rot?: number;
  delay?: number;
  seed?: number;
  pad?: number;
  style?: React.CSSProperties;
}> = ({ children, rot = 0, delay = 0, seed = 1, pad, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useLayout();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, mass: 0.9 } });
  return (
    <div
      style={{
        position: 'relative',
        transform: `translateY(${(1 - s) * 4 * u}px) rotate(${rot * s}deg)`,
        opacity: s,
        filter: 'drop-shadow(0 10px 16px rgba(70,58,34,0.20)) drop-shadow(0 2px 2px rgba(70,58,34,0.14))',
        ...style,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(158deg, #F6F1E6 0%, #EFE8D9 62%, #E7DECB 100%)',
          clipPath: tornPolygon(seed),
          padding: pad ?? 3.4 * u,
          paddingBottom: (pad ?? 3.4 * u) + 1.6 * u,
          position: 'relative',
        }}
      >
        {children}
        <AbsoluteFill style={{ opacity: 0.5 }}>
          <PaperGrain intensity={0.5} />
        </AbsoluteFill>
      </div>
    </div>
  );
};

const StyleA: React.FC<{ page: PageIndex }> = ({ page }) => {
  const { u, type, safe } = useLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Fig = FIGURES.candles;
  const strip = spring({ frame: frame - 20, fps, config: { damping: 200 } });

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
        <Card rot={-1.1} seed={3}>
          <div
            style={{
              fontFamily: FF.mono,
              fontSize: type.kicker,
              letterSpacing: 3,
              color: COLOR.greenDeep,
              textTransform: 'uppercase',
              marginBottom: 1.6 * u,
            }}
          >
            File 006 · Risk
          </div>
          <div
            style={{
              fontFamily: FF.display,
              fontSize: type.mega * 0.92,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: COLOR.ink,
            }}
          >
            {HOOK_1}
            <br />
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '-0.16em',
                  right: '-0.16em',
                  top: '0.1em',
                  bottom: '0.08em',
                  background: COLOR.green,
                  opacity: 0.85,
                  transform: `rotate(-1.4deg) scaleX(${strip})`,
                  transformOrigin: 'left center',
                }}
              />
              <span style={{ position: 'relative' }}>{HOOK_2}</span>
            </span>
          </div>
        </Card>
      ) : null}

      {page === 1 ? (
        <>
          <Card rot={1.4} seed={7} pad={2 * u} style={{ zIndex: 2 }}>
            <div style={{ height: 40 * u, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Fig delay={6} />
            </div>
          </Card>
          <Card rot={-0.9} seed={11} style={{ marginTop: -2.6 * u, zIndex: 1 }} delay={8}>
            <div
              style={{
                fontFamily: FF.mono,
                fontSize: type.kicker,
                letterSpacing: 3,
                color: COLOR.greenDeep,
                textTransform: 'uppercase',
                marginBottom: 1.2 * u,
              }}
            >
              Fig. 01 · The arithmetic
            </div>
            <div
              style={{
                fontFamily: FF.display,
                fontSize: type.subtitle * 1.1,
                lineHeight: 1.06,
                color: COLOR.ink,
                marginBottom: 1.4 * u,
              }}
            >
              {FIG_HEAD}
            </div>
            <div style={{ fontFamily: FF.ui, fontSize: type.body, lineHeight: 1.42, color: COLOR.inkSoft }}>
              {FIG_BODY}
            </div>
          </Card>
        </>
      ) : null}

      {page === 2 ? (
        <Card rot={0.7} seed={5}>
          <div
            style={{
              fontFamily: FF.display,
              fontSize: type.stat,
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
              color: COLOR.ink,
            }}
          >
            50%
          </div>
          <div
            style={{
              width: '38%',
              height: 4,
              background: COLOR.green,
              margin: `${1.8 * u}px 0`,
              transform: `scaleX(${strip})`,
              transformOrigin: 'left center',
            }}
          />
          <div
            style={{
              fontFamily: FF.display,
              fontSize: type.subtitle * 0.8,
              lineHeight: 1.15,
              color: COLOR.inkSoft,
            }}
          >
            {STAT_LABEL}
          </div>
        </Card>
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* B · CONTINUOUS SHEET                                                */
/* No page cuts. One long sheet, the camera glides between stations.   */
/* ================================================================== */

const StyleB: React.FC<{ page: PageIndex }> = ({ page }) => {
  const { u, type, safe, width, height } = useLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Fig = FIGURES.candles;
  const s = spring({ frame: frame - 6, fps, config: { damping: 200 } });

  const spineX = safe.left + 2.2 * u;

  const Ghost: React.FC<{ children: React.ReactNode; top?: boolean }> = ({ children, top }) => (
    <div
      style={{
        position: 'absolute',
        left: spineX + 5 * u,
        right: safe.right,
        [top ? 'top' : 'bottom']: 6 * u,
        opacity: 0.16,
        fontFamily: FF.display,
        fontSize: type.subtitle,
        color: COLOR.ink,
        lineHeight: 1.05,
      }}
    >
      {children}
    </div>
  );

  return (
    <AbsoluteFill>
      {/* the spine: one green line threading the whole episode */}
      <div
        style={{
          position: 'absolute',
          left: spineX,
          top: 0,
          bottom: 0,
          width: 2,
          background: COLOR.rule,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: spineX,
          top: 0,
          height: `${58 + page * 6}%`,
          width: 2,
          background: COLOR.green,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: spineX - 1.15 * u,
          top: `${52}%`,
          width: 2.3 * u,
          height: 2.3 * u,
          borderRadius: '50%',
          background: COLOR.green,
          transform: `scale(${s})`,
        }}
      />

      <Ghost top>Position sizing is the only variable you fully control.</Ghost>
      <Ghost>Risk of ruin, and the maths of getting back.</Ghost>

      <div
        style={{
          position: 'absolute',
          left: spineX + 5 * u,
          right: safe.right * 0.4,
          top: '50%',
          transform: `translateY(-50%) translateY(${(1 - s) * 3 * u}px)`,
          opacity: s,
        }}
      >
        <div
          style={{
            fontFamily: FF.mono,
            fontSize: type.kicker,
            letterSpacing: 3,
            color: COLOR.greenDeep,
            textTransform: 'uppercase',
            marginBottom: 1.6 * u,
          }}
        >
          {page === 0 ? 'File 006 · Risk' : page === 1 ? 'Station 02 · The arithmetic' : 'Station 03 · Recovery'}
        </div>

        {page === 0 ? (
          <div
            style={{
              fontFamily: FF.display,
              fontSize: type.mega,
              lineHeight: 0.98,
              letterSpacing: '-0.025em',
              color: COLOR.ink,
            }}
          >
            {HOOK_1}
            <br />
            {HOOK_2}
          </div>
        ) : null}

        {page === 1 ? (
          <>
            <div
              style={{
                fontFamily: FF.display,
                fontSize: type.subtitle * 1.16,
                lineHeight: 1.04,
                color: COLOR.ink,
                marginBottom: 2 * u,
              }}
            >
              {FIG_HEAD}
            </div>
            <div
              style={{
                width: '108%',
                height: 34 * u,
                marginLeft: '-4%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Fig delay={8} />
            </div>
            <div
              style={{
                fontFamily: FF.ui,
                fontSize: type.body,
                lineHeight: 1.42,
                color: COLOR.inkSoft,
                marginTop: 2 * u,
              }}
            >
              {FIG_BODY}
            </div>
          </>
        ) : null}

        {page === 2 ? (
          <>
            <div
              style={{
                fontFamily: FF.display,
                fontSize: type.stat * 1.15,
                lineHeight: 0.88,
                letterSpacing: '-0.035em',
                color: COLOR.ink,
              }}
            >
              50%
            </div>
            <div
              style={{
                fontFamily: FF.display,
                fontSize: type.subtitle * 0.78,
                lineHeight: 1.16,
                color: COLOR.inkSoft,
                marginTop: 1.6 * u,
              }}
            >
              {STAT_LABEL}
            </div>
          </>
        ) : null}
      </div>

      {/* a big number bleeding off the edge, for depth as the camera moves */}
      <div
        style={{
          position: 'absolute',
          right: -6 * u,
          bottom: 12 * u,
          fontFamily: FF.display,
          fontSize: 34 * u,
          color: COLOR.ink,
          opacity: 0.05,
          letterSpacing: '-0.04em',
        }}
      >
        {page === 0 ? '006' : page === 1 ? '10:1' : '2x'}
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* C · BOLD FIELD                                                      */
/* Colour blocks sweep in and the type reverses out of them.           */
/* ================================================================== */

const StyleC: React.FC<{ page: PageIndex }> = ({ page }) => {
  const { u, type, safe, height } = useLayout();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Fig = FIGURES.candles;
  const sweep = spring({ frame: frame - 2, fps, config: { damping: 200, mass: 1.1 } });
  const s = spring({ frame: frame - 14, fps, config: { damping: 200 } });

  const fieldColor = page === 2 ? COLOR.green : COLOR.ink;
  const onField = page === 2 ? COLOR.ink : COLOR.paper;
  const fieldTop = safe.top - 4 * u;
  const fieldH = height * (page === 1 ? 0.42 : 0.34);

  return (
    <AbsoluteFill>
      {/* the field */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: fieldTop,
          height: fieldH,
          background: fieldColor,
          transform: `translateX(${(1 - sweep) * -110}%) rotate(-1.1deg)`,
          transformOrigin: 'left center',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: safe.left,
          right: safe.right,
          top: fieldTop,
          height: fieldH,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          opacity: s,
          transform: `rotate(-1.1deg)`,
        }}
      >
        <div
          style={{
            fontFamily: FF.mono,
            fontSize: type.kicker,
            letterSpacing: 3,
            color: page === 2 ? COLOR.greenDeep : COLOR.green,
            textTransform: 'uppercase',
            marginBottom: 1.4 * u,
          }}
        >
          File 006 · Risk
        </div>
        {page === 1 ? (
          <div style={{ height: 26 * u, display: 'flex', alignItems: 'center' }}>
            <Fig delay={16} color={onField} accent={COLOR.green} />
          </div>
        ) : (
          <div
            style={{
              fontFamily: FF.display,
              fontSize: page === 2 ? type.stat * 0.86 : type.title * 1.02,
              lineHeight: page === 2 ? 0.92 : 1.0,
              letterSpacing: '-0.025em',
              color: onField,
            }}
          >
            {page === 0 ? (
              <>
                {HOOK_1}
                <br />
                {HOOK_2}
              </>
            ) : (
              '50%'
            )}
          </div>
        )}
      </div>

      {/* paper half */}
      <div
        style={{
          position: 'absolute',
          left: safe.left,
          right: safe.right,
          top: fieldTop + fieldH + 4.5 * u,
          opacity: s,
          transform: `translateY(${(1 - s) * 2.4 * u}px)`,
        }}
      >
        {page === 0 ? (
          <div style={{ fontFamily: FF.ui, fontSize: type.body, lineHeight: 1.42, color: COLOR.inkSoft }}>
            Win rate is the thing everyone argues about. Size is the thing that actually ends accounts.
          </div>
        ) : null}
        {page === 1 ? (
          <>
            <div
              style={{
                fontFamily: FF.display,
                fontSize: type.subtitle * 1.06,
                lineHeight: 1.06,
                color: COLOR.ink,
                marginBottom: 1.4 * u,
              }}
            >
              {FIG_HEAD}
            </div>
            <div style={{ fontFamily: FF.ui, fontSize: type.body, lineHeight: 1.42, color: COLOR.inkSoft }}>
              {FIG_BODY}
            </div>
          </>
        ) : null}
        {page === 2 ? (
          <div
            style={{
              fontFamily: FF.display,
              fontSize: type.subtitle * 0.86,
              lineHeight: 1.16,
              color: COLOR.ink,
            }}
          >
            {STAT_LABEL}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */

export const StyleOption: React.FC<{ style?: 'a' | 'b' | 'c'; page?: PageIndex }> = ({
  style = 'a',
  page = 0,
}) => (
  <SafeModeProvider value="reels">
    <AbsoluteFill>
      <Paper>
        {style === 'a' ? <StyleA page={page} /> : null}
        {style === 'b' ? <StyleB page={page} /> : null}
        {style === 'c' ? <StyleC page={page} /> : null}
        <DotCorner />
        <SeriesChrome episode="FILE 006" pillar="Risk" />
      </Paper>
    </AbsoluteFill>
  </SafeModeProvider>
);

const DotCorner: React.FC = () => {
  const { u, safe } = useLayout();
  return (
    <div style={{ position: 'absolute', left: safe.left, bottom: safe.bottom + 3 * u }}>
      <Dot r={4.2 * u} mood="curious" />
    </div>
  );
};
