import React from 'react';
import { Composition, Still } from 'remotion';
import { Episode, durationOf, EpisodeScript } from './Episode';
import { FORMATS, SERIES } from './design/tokens';
import { ep01 } from './episodes/ep01-history-of-investment';
import { ep02 } from './episodes/ep02-wagmi-ngmi';
import { ep03 } from './episodes/ep03-candlestick';
import { ep04 } from './episodes/ep04-blockchain';
import { ep05 } from './episodes/ep05-stock-exchange';
import { ep06 } from './episodes/ep06-position-sizing';
import { ep07 } from './episodes/ep07-tulip-mania';
import { ep08 } from './episodes/ep08-fud-fomo';
import { ep09 } from './episodes/ep09-not-your-keys';
import { ep10 } from './episodes/ep10-order-types';
import { ep11 } from './episodes/ep11-what-an-index-measures';
import { ep12 } from './episodes/ep12-leverage-is-a-clock';
import { NarratorTest } from './tests/NarratorTest';
import { NarratorInPage } from './tests/NarratorInPage';
import { StyleOption } from './tests/StyleOptions';
import { WhiteOption } from './tests/WhiteOptions';
import { BeyondOption } from './tests/BeyondOptions';
import { TerminalMotion, TERMINAL_MOTION_FRAMES } from './tests/TerminalMotion';
import { StyleLab, LAB_TOTAL } from './lab/StyleLab';
import { EyeLab, EYE_TOTAL } from './lab/EyeLab';
import { real } from './notebook/time';
import { Ep13, EP13_TOTAL } from './ep13/Ep13';
import { Ep14, EP14_TOTAL } from './ep14/Ep14';
import { Ep15, EP15_TOTAL } from './ep15/Ep15';
import { Ep16, EP16_TOTAL } from './ep16/Ep16';
import { Thumb14A, Thumb14AV, Thumb14B, Thumb14BV } from './thumbs/Thumbs14';
import { Thumb15A, Thumb15AV, Thumb15B, Thumb15BV } from './thumbs/Thumbs15';
import { Thumb16A, Thumb16AV, Thumb16B, Thumb16BV } from './thumbs/Thumbs16';
import { HwSlide1, HwSlide2, HwSlide3, HwSlide4, HW_W, HW_H } from './halloween/Slides';

// Two thumbnails per release (A/B), each in 16:9 (1920x1080, exported to
// 1280x720) and 9:16 (1080x1920)
const THUMBS = [
  { id: 'thumb-014-a-16x9', component: Thumb14A, width: 1920, height: 1080 },
  { id: 'thumb-014-b-16x9', component: Thumb14B, width: 1920, height: 1080 },
  { id: 'thumb-014-a-9x16', component: Thumb14AV, width: 1080, height: 1920 },
  { id: 'thumb-014-b-9x16', component: Thumb14BV, width: 1080, height: 1920 },
  { id: 'thumb-015-a-16x9', component: Thumb15A, width: 1920, height: 1080 },
  { id: 'thumb-015-b-16x9', component: Thumb15B, width: 1920, height: 1080 },
  { id: 'thumb-015-a-9x16', component: Thumb15AV, width: 1080, height: 1920 },
  { id: 'thumb-015-b-9x16', component: Thumb15BV, width: 1080, height: 1920 },
  { id: 'thumb-016-a-16x9', component: Thumb16A, width: 1920, height: 1080 },
  { id: 'thumb-016-b-16x9', component: Thumb16B, width: 1920, height: 1080 },
  { id: 'thumb-016-a-9x16', component: Thumb16AV, width: 1080, height: 1920 },
  { id: 'thumb-016-b-9x16', component: Thumb16BV, width: 1080, height: 1920 },
  // Halloween carousel, 4 slides at 4:5
  { id: 'halloween-1', component: HwSlide1, width: HW_W, height: HW_H },
  { id: 'halloween-2', component: HwSlide2, width: HW_W, height: HW_H },
  { id: 'halloween-3', component: HwSlide3, width: HW_W, height: HW_H },
  { id: 'halloween-4', component: HwSlide4, width: HW_W, height: HW_H },
];

// FILE 013 onward: bespoke notebook-look episodes, timed to the voiceover
const NOTEBOOK_EPISODES = [
  { slug: 'paper-money-invented-twice', component: Ep13, units: EP13_TOTAL },
  { slug: 'stablecoins-explained', component: Ep14, units: EP14_TOTAL },
  { slug: 'whale-shrimp-bagholder', component: Ep15, units: EP15_TOTAL },
  { slug: 'liquidity-noticed-when-gone', component: Ep16, units: EP16_TOTAL },
];

// Notebook look (FILE 013 onward) sign-off comps
const LABS = [
  { id: 'lab-style', component: StyleLab, units: LAB_TOTAL },
  { id: 'lab-eye', component: EyeLab, units: EYE_TOTAL },
];

const EPISODES: EpisodeScript[] = [ep01, ep02, ep03, ep04, ep05, ep06, ep07, ep08, ep09, ep10, ep11, ep12];

export const RemotionRoot: React.FC = () => (
  <>
    {THUMBS.map((t) => (
      <Still key={t.id} id={t.id} component={t.component} width={t.width} height={t.height} />
    ))}
    {NOTEBOOK_EPISODES.map((ep) =>
      (['vertical', 'horizontal'] as const).map((fm) => (
        <Composition
          key={`${ep.slug}-${fm}`}
          id={`${ep.slug}-${fm}`}
          component={ep.component}
          durationInFrames={real(ep.units)}
          fps={SERIES.fps}
          width={FORMATS[fm].width}
          height={FORMATS[fm].height}
        />
      ))
    )}
    {LABS.map((lab) =>
      (['vertical', 'horizontal'] as const).map((fm) => (
        <Composition
          key={`${lab.id}-${fm}`}
          id={`${lab.id}-${fm}`}
          component={lab.component}
          durationInFrames={real(lab.units)}
          fps={SERIES.fps}
          width={FORMATS[fm].width}
          height={FORMATS[fm].height}
        />
      ))
    )}
    {EPISODES.map((script) => (
      <React.Fragment key={script.slug}>
        <Composition
          id={`${script.slug}-vertical`}
          component={Episode as React.FC<Record<string, unknown>>}
          durationInFrames={durationOf(script)}
          fps={SERIES.fps}
          width={FORMATS.vertical.width}
          height={FORMATS.vertical.height}
          defaultProps={{ script } as unknown as Record<string, unknown>}
        />
        <Composition
          id={`${script.slug}-horizontal`}
          component={Episode as React.FC<Record<string, unknown>>}
          durationInFrames={durationOf(script)}
          fps={SERIES.fps}
          width={FORMATS.horizontal.width}
          height={FORMATS.horizontal.height}
          defaultProps={{ script } as unknown as Record<string, unknown>}
        />
      </React.Fragment>
    ))}
    <Composition
      id="terminal-motion-vertical"
      component={TerminalMotion}
      durationInFrames={TERMINAL_MOTION_FRAMES}
      fps={SERIES.fps}
      width={FORMATS.vertical.width}
      height={FORMATS.vertical.height}
    />
    <Composition
      id="terminal-motion-horizontal"
      component={TerminalMotion}
      durationInFrames={TERMINAL_MOTION_FRAMES}
      fps={SERIES.fps}
      width={FORMATS.horizontal.width}
      height={FORMATS.horizontal.height}
    />
    <Composition
      id="narrator-test"
      component={NarratorTest}
      durationInFrames={150}
      fps={SERIES.fps}
      width={1400}
      height={900}
    />
    {(['bare', 'framed', 'aside'] as const).map((v) => (
      <React.Fragment key={v}>
        <Composition
          id={`narrator-page-${v}-vertical`}
          component={NarratorInPage as React.FC<Record<string, unknown>>}
          durationInFrames={150}
          fps={SERIES.fps}
          width={FORMATS.vertical.width}
          height={FORMATS.vertical.height}
          defaultProps={{ variant: v } as unknown as Record<string, unknown>}
        />
        <Composition
          id={`narrator-page-${v}-horizontal`}
          component={NarratorInPage as React.FC<Record<string, unknown>>}
          durationInFrames={150}
          fps={SERIES.fps}
          width={FORMATS.horizontal.width}
          height={FORMATS.horizontal.height}
          defaultProps={{ variant: v } as unknown as Record<string, unknown>}
        />
      </React.Fragment>
    ))}
    {(['a', 'b', 'c'] as const).map((st) =>
      [0, 1, 2].map((pg) => (
        <Composition
          key={`${st}${pg}`}
          id={`style-${st}-${pg}`}
          component={StyleOption as React.FC<Record<string, unknown>>}
          durationInFrames={120}
          fps={SERIES.fps}
          width={FORMATS.vertical.width}
          height={FORMATS.vertical.height}
          defaultProps={{ style: st, page: pg } as unknown as Record<string, unknown>}
        />
      ))
    )}
    {(['a', 'b', 'c'] as const).map((st) =>
      [0, 1, 2, 3].map((pg) => (
        <Composition
          key={`b${st}${pg}`}
          id={`beyond-${st}-${pg}`}
          component={BeyondOption as React.FC<Record<string, unknown>>}
          durationInFrames={120}
          fps={SERIES.fps}
          width={FORMATS.vertical.width}
          height={FORMATS.vertical.height}
          defaultProps={{ style: st, page: pg } as unknown as Record<string, unknown>}
        />
      ))
    )}
    {(['a', 'b', 'c'] as const).map((st) =>
      [0, 1, 2].map((pg) => (
        <Composition
          key={`w${st}${pg}`}
          id={`white-${st}-${pg}`}
          component={WhiteOption as React.FC<Record<string, unknown>>}
          durationInFrames={120}
          fps={SERIES.fps}
          width={FORMATS.vertical.width}
          height={FORMATS.vertical.height}
          defaultProps={{ style: st, page: pg } as unknown as Record<string, unknown>}
        />
      ))
    )}
  </>
);
