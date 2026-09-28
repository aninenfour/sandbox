// One sound vocabulary for every cut: dry mechanical clicks and ticks (uisfx `mechanical`, CC0)
// plus synthesised, pitch-free air (scripts/make-foley.py). Cue names stay semantic; this maps them to files.
type Sound = {file: string; gain: number};
const CLICK: Sound = {file: 'sfx/mechanical/press.mp3', gain: 0.55};
const TICK: Sound = {file: 'sfx/mechanical/snap.mp3', gain: 0.3};
const WHOOSH: Sound = {file: 'sfx/foley/whoosh.wav', gain: 0.8};
const SOFT: Sound = {file: 'sfx/foley/whoosh.wav', gain: 0.35};
const SWELL: Sound = {file: 'sfx/foley/swell.wav', gain: 0.9};
const THUMP: Sound = {file: 'sfx/foley/thump.wav', gain: 0.7};
const HIT: Sound = {file: 'sfx/foley/hit.wav', gain: 0.8};

const MAP: Record<string, Sound> = {
  press: CLICK, 'double-click': CLICK,
  snap: TICK, seek: TICK, check: TICK, connect: TICK, hover: {...TICK, gain: 0.14}, 'toggle-on': TICK,
  'drag-start': {...TICK, gain: 0.2}, drop: {...TICK, gain: 0.25}, delete: TICK,
  select: SOFT, swipe: WHOOSH, 'progress-step': WHOOSH,
  expand: SWELL, collapse: THUMP, 'invalid-drop': THUMP, reward: THUMP,
  success: HIT,
};

// Cue volumes in the timelines were written for the old pack; scale them down so the mix sits under music.
export const soundFor = (cue: string, vol: number) => {
  const s = MAP[cue] ?? SOFT;
  return {src: s.file, volume: Math.min(1, s.gain * vol * 0.9)};
};
