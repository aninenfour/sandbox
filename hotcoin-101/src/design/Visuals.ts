import { INDEX_FIGURES } from './FiguresIndex';
import { LEVERAGE_FIGURES } from './FiguresLeverage';

/** Every full-page visual the dark look can carry, by name. */
export const VISUALS = { ...INDEX_FIGURES, ...LEVERAGE_FIGURES } as const;
export type VisualName = keyof typeof VISUALS;
