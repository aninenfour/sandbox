/**
 * HOTCOIN 101 — series design tokens
 * One file to rule the whole series. Change here, every episode follows.
 */

export const COLOR = {
  // Paper stock
  paper: '#EFE9DC',
  paperDeep: '#E4DCCB',
  paperEdge: '#D8CEB9',

  // Ink
  ink: '#17170F',
  inkSoft: '#4A473B',
  inkFaint: '#8C8877',
  rule: 'rgba(23,23,15,0.16)',

  // Hotcoin brand
  green: '#7EC25A', // sampled from the Hotcoin logo mark
  greenDeep: '#4C8A2F', // darkened for small type on paper
  greenForest: '#639649', // legacy palette green, used for charts only
  greenWash: 'rgba(126,194,90,0.26)',
  greenLid: '#63A344', // eyelid: darker than the dot, so a blink reads on any ground

  // Editorial signals (loss / risk / heat)
  red: '#C1362B',
  redWash: 'rgba(193,54,43,0.10)',
  gold: '#C08A2E',

  // Night stock (used sparingly, for "danger" or modern-market episodes)
  night: '#12130F',
  nightPaper: '#1B1C17',
} as const;

export const FONT = {
  display: 'Newsreader',
  ui: 'Inter',
  mono: 'IBM Plex Mono',
} as const;

/** Base grid: everything is sized off the frame's short edge so both formats match. */
export const grid = (shortEdge: number) => ({
  unit: shortEdge / 36,
  gutter: shortEdge / 12,
});

export const SERIES = {
  name: 'HOTCOIN 101',
  strap: 'MONEY, EXPLAINED',
  fps: 60,
} as const;

export const FORMATS = {
  vertical: { width: 1080, height: 1920 },
  horizontal: { width: 1920, height: 1080 },
} as const;

export type FormatName = keyof typeof FORMATS;
