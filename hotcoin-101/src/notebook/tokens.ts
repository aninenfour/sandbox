import '@fontsource/anton/400.css';
import '@fontsource/caveat/500.css';
import '@fontsource/caveat/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/inter/700.css';

// Notebook look. Two grounds that alternate page to page, one brand accent,
// one contrast colour that means "down / wrong / careful".
export const INK = '#15171A';
export const PAPER = '#EDECE7';
export const GREEN = '#7EC25A';
export const GREEN_DEEP = '#4E8A33';
export const GREEN_LID = '#5E9E3F';
export const RED = '#F0453F';
export const SCLERA = '#FBFBF7';

export type Ground = 'paper' | 'ink';

export const theme = (g: Ground) =>
  g === 'paper'
    ? {bg: PAPER, fg: INK, faint: 'rgba(21,23,26,0.16)', ghost: 'rgba(21,23,26,0.28)', note: GREEN_DEEP}
    : {bg: INK, fg: PAPER, faint: 'rgba(237,236,231,0.14)', ghost: 'rgba(237,236,231,0.3)', note: GREEN};

export const FONT = {
  display: 'Anton, "Arial Narrow", sans-serif',
  hand: 'Caveat, "Comic Sans MS", cursive',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  brand: 'Inter, sans-serif',
};

// Lockup geometry, measured from public/brand/hotcoin-lockup-{dark,light}.png
// (both cropped to the same 1980 x 336 box, so the dot sits at the same spot).
export const LOCKUP = {w: 1980, h: 336, dot: {cx: 260.5, cy: 263.5, r: 58}};
