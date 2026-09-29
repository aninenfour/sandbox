import { COLOR } from './tokens';
import { FF } from './fonts';
import { useLook } from './look';

/**
 * The palette and type voice for the current look.
 *
 * Every block reads its colours from here rather than from COLOR directly, so
 * a look change is one object rather than a sweep through the components.
 */
export type Theme = {
  /** The page surface. */
  paper: string;
  paperDeep: string;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  rule: string;
  green: string;
  greenDeep: string;
  greenWash: string;
  /** Heading voice. */
  display: string;
  displayWeight: number;
  displayTracking: string;
  displayLine: number;
  /** Whether italics belong in this look. Grotesk headings do not italicise well. */
  italicOk: boolean;
  /** Figure plate. */
  plateBg: string;
  plateBorder: string | null;
  /** Paper texture, fibre, registration marks, vignette. */
  texture: boolean;
  /** Rule weight for the accent rules, in px. */
  accentRule: number;
  /** Stroke colour for the procedural figures. */
  figureInk: string;
  /** Dark surfaces need the reversed lockup and a glow on the accents. */
  dark: boolean;
  /** Extra CSS applied to accent rules, so dark looks can bloom. */
  accentGlow?: string;
};

const PAPER: Theme = {
  paper: COLOR.paper,
  paperDeep: COLOR.paperDeep,
  ink: COLOR.ink,
  inkSoft: COLOR.inkSoft,
  inkFaint: COLOR.inkFaint,
  rule: COLOR.rule,
  green: COLOR.green,
  greenDeep: COLOR.greenDeep,
  greenWash: COLOR.greenWash,
  display: FF.display,
  displayWeight: 500,
  displayTracking: '-0.018em',
  displayLine: 1.02,
  italicOk: true,
  plateBg: 'rgba(255,255,255,0.20)',
  plateBorder: COLOR.rule,
  texture: true,
  accentRule: 3,
  figureInk: COLOR.ink,
  dark: false,
};

const CUT: Theme = { ...PAPER, plateBg: 'transparent', plateBorder: null };

/** Editorial White. Pure white, hairline rules, Inter 700 with tight tracking. */
const WHITE: Theme = {
  paper: '#FFFFFF',
  paperDeep: '#F6F7F4',
  ink: '#111309',
  inkSoft: '#5C6055',
  inkFaint: '#9BA095',
  rule: '#E6E8E2',
  green: COLOR.green,
  greenDeep: '#3E7A22',
  greenWash: 'rgba(126,194,90,0.30)',
  display: FF.ui,
  displayWeight: 700,
  displayTracking: '-0.042em',
  displayLine: 0.99,
  italicOk: false,
  // A soft panel rather than a hairline frame: the drawing gets a home without
  // a box outline sitting in the middle of an otherwise ruleless page.
  plateBg: '#F5F6F3',
  plateBorder: null,
  texture: false,
  accentRule: 5,
  figureInk: '#111309',
  dark: false,
};

/**
 * Beyond the Green. Black ground, white heavy grotesk, green as the only
 * accent, mono for every label so the whole thing reads as a terminal.
 */
const TERMINAL: Theme = {
  paper: '#000000',
  paperDeep: '#050605',
  ink: '#FFFFFF',
  inkSoft: 'rgba(255,255,255,0.72)',
  inkFaint: 'rgba(255,255,255,0.42)',
  rule: 'rgba(255,255,255,0.16)',
  green: COLOR.green,
  greenDeep: COLOR.green,
  greenWash: 'rgba(126,194,90,0.30)',
  display: FF.ui,
  displayWeight: 700,
  displayTracking: '-0.04em',
  displayLine: 1.01,
  italicOk: false,
  plateBg: 'rgba(126,194,90,0.04)',
  plateBorder: 'rgba(126,194,90,0.28)',
  texture: false,
  accentRule: 3,
  figureInk: 'rgba(255,255,255,0.88)',
  dark: true,
  accentGlow: '0 0 18px rgba(126,194,90,0.85)',
};

const THEMES: Record<string, Theme> = {
  flat: PAPER,
  cutPaper: CUT,
  white: WHITE,
  terminal: TERMINAL,
};

export const useTheme = (): Theme => THEMES[useLook()] ?? PAPER;
