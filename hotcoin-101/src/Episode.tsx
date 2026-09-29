import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { Paper } from './design/Paper';
import { SafeModeProvider } from './design/layoutContext';
import { LookProvider, Look } from './design/Sheet';
import type { SafeMode } from './design/layout';
import { useLayout } from './design/layout';
import { useLockup, Mood } from './design/Dot';
import { DotNarrator, DotStop } from './design/DotNarrator';
import { SeriesChrome } from './design/Chrome';
import { Scene } from './design/Scene';
import { SERIES } from './design/tokens';
import {
  CalloutBeat,
  CardsBeat,
  ColdOpen,
  CompareBeat,
  EndCard,
  FigureBeat,
  ListBeat,
  Outro,
  PickTwoBeat,
  QuoteBeat,
  StatBeat,
  TermBeat,
  TimelineBeat,
  TitleCard,
  VisualBeat,
} from './blocks';

/** Where the dot sits during a beat, as a fraction of the frame. */
export type DotSpec = {
  x?: number;
  y?: number;
  /** Optional overrides for the 16:9 cut, where the free space sits elsewhere. */
  hx?: number;
  hy?: number;
  mood?: Mood;
  /** Radius in short-edge percent. Default 3.8. */
  r?: number;
  hidden?: boolean;
  /** Final beat: fly home and let the logo assemble around it. */
  merge?: boolean;
};

/** A beat is one page of the document. Seconds are on-screen time. */
export type Beat = { dot?: DotSpec } & (
  | ({ type: 'coldOpen'; seconds: number } & React.ComponentProps<typeof ColdOpen>)
  | ({ type: 'title'; seconds: number } & React.ComponentProps<typeof TitleCard>)
  | ({ type: 'figure'; seconds: number } & React.ComponentProps<typeof FigureBeat>)
  | ({ type: 'stat'; seconds: number } & React.ComponentProps<typeof StatBeat>)
  | ({ type: 'compare'; seconds: number } & React.ComponentProps<typeof CompareBeat>)
  | ({ type: 'term'; seconds: number } & React.ComponentProps<typeof TermBeat>)
  | ({ type: 'list'; seconds: number } & React.ComponentProps<typeof ListBeat>)
  | ({ type: 'quote'; seconds: number } & React.ComponentProps<typeof QuoteBeat>)
  | ({ type: 'timeline'; seconds: number } & React.ComponentProps<typeof TimelineBeat>)
  | ({ type: 'cards'; seconds: number } & React.ComponentProps<typeof CardsBeat>)
  | ({ type: 'callout'; seconds: number } & React.ComponentProps<typeof CalloutBeat>)
  | ({ type: 'pickTwo'; seconds: number } & React.ComponentProps<typeof PickTwoBeat>)
  | ({ type: 'visual'; seconds: number } & React.ComponentProps<typeof VisualBeat>)
  | ({ type: 'outro'; seconds: number } & React.ComponentProps<typeof Outro>)
  | ({ type: 'endCard'; seconds: number } & React.ComponentProps<typeof EndCard>));

export type EpisodeScript = {
  file: string; // "FILE 001"
  pillar: string; // "HISTORY" | "TRADING" | "JARGON" | "TRADFI" | "CRYPTO"
  slug: string;
  title: string;
  subtitle?: string;
  /** 'reels' keeps the vertical cut clear of platform UI. Horizontal ignores it. */
  verticalLayout?: SafeMode;
  /** 'cutPaper' puts every beat on torn card stock with real shadows. */
  look?: Look;
  beats: Beat[];
};

const renderBeat = (b: Beat, key: number) => {
  switch (b.type) {
    case 'coldOpen':
      return <ColdOpen key={key} {...b} />;
    case 'title':
      return <TitleCard key={key} {...b} />;
    case 'figure':
      return <FigureBeat key={key} {...b} />;
    case 'stat':
      return <StatBeat key={key} {...b} />;
    case 'compare':
      return <CompareBeat key={key} {...b} />;
    case 'term':
      return <TermBeat key={key} {...b} />;
    case 'list':
      return <ListBeat key={key} {...b} />;
    case 'quote':
      return <QuoteBeat key={key} {...b} />;
    case 'timeline':
      return <TimelineBeat key={key} {...b} />;
    case 'cards':
      return <CardsBeat key={key} {...b} />;
    case 'callout':
      return <CalloutBeat key={key} {...b} />;
    case 'pickTwo':
      return <PickTwoBeat key={key} {...b} />;
    case 'visual':
      return <VisualBeat key={key} {...b} />;
    case 'outro':
      return <Outro key={key} {...b} />;
    case 'endCard':
      return <EndCard key={key} {...b} />;
  }
};

export const durationOf = (script: EpisodeScript) =>
  Math.round(script.beats.reduce((a, b) => a + b.seconds, 0) * SERIES.fps);

export const Episode: React.FC<{ script: EpisodeScript }> = ({ script }) => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const safeMode: SafeMode = isVertical ? script.verticalLayout ?? 'standard' : 'standard';
  return (
    <SafeModeProvider value={safeMode}>
      <LookProvider value={script.look ?? 'flat'}>
        <EpisodeBody script={script} />
      </LookProvider>
    </SafeModeProvider>
  );
};

const EpisodeBody: React.FC<{ script: EpisodeScript }> = ({ script }) => {
  const { u, width, height, isVertical } = useLayout();
  const { fps } = useVideoConfig();
  // pages are cut in real frames, the dot moves on the 30fps authoring clock
  const toClock = (f: number) => (f * 30) / fps;
  const lockup = useLockup();

  // Frame ranges, then the dot's itinerary across them.
  const ranges: { from: number; dur: number }[] = [];
  let c = 0;
  for (const b of script.beats) {
    const d = Math.round(b.seconds * SERIES.fps);
    ranges.push({ from: c, dur: d });
    c += d;
  }

  const stops: DotStop[] = [];
  let last: Required<Pick<DotSpec, 'x' | 'y' | 'mood' | 'r'>> & { hidden: boolean } = {
    x: 0.5,
    y: 0.5,
    mood: 'neutral',
    r: 3.8,
    hidden: true,
  };
  script.beats.forEach((b, i) => {
    if (!b.dot) return;
    const merged = {
      x: (isVertical ? b.dot.x : b.dot.hx ?? b.dot.x) ?? last.x,
      y: (isVertical ? b.dot.y : b.dot.hy ?? b.dot.y) ?? last.y,
      mood: b.dot.mood ?? last.mood,
      r: b.dot.r ?? last.r,
      hidden: b.dot.hidden ?? false,
    };
    last = merged;
    if (b.dot.merge) {
      stops.push({
        start: toClock(ranges[i].from) + 4,
        x: lockup.dotX / width,
        y: lockup.dotY / height,
        r: lockup.dotR,
        mood: 'pleased',
        settle: true,
      });
    } else {
      stops.push({
        start: toClock(ranges[i].from) + 3,
        x: merged.x,
        y: merged.y,
        r: merged.r * u,
        mood: merged.mood,
        hidden: merged.hidden,
      });
    }
  });

  let cursor = 0;
  return (
      <AbsoluteFill>
      <Paper>
        {script.beats.map((b, i) => {
          const from = cursor;
          const dur = Math.round(b.seconds * SERIES.fps);
          cursor += dur;
          return (
            <Scene
              key={i}
              from={from}
              duration={dur}
              hold={i === script.beats.length - 1}
              name={`${i + 1}. ${b.type}`}
            >
              {renderBeat(b, i)}
            </Scene>
          );
        })}
        {stops.length ? <DotNarrator stops={stops} /> : null}
        <SeriesChrome episode={script.file} pillar={script.pillar} />
      </Paper>
      </AbsoluteFill>
  );
};
