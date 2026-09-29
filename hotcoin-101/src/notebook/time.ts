import {CLOCK_FPS} from '../design/clock';
import {SERIES} from '../design/tokens';

// Helpers on top of the series clock: author in 30fps units, place
// Sequences and compositions in real 60fps frames.
export const sec = (s: number) => s * CLOCK_FPS;
export const real = (units: number) => Math.round((units * SERIES.fps) / CLOCK_FPS);
