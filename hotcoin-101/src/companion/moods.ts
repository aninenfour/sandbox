// Every expression is a set of numbers so any two moods can blend.
// Units are fractions of the body radius unless noted.
export type Face = {
  upper: number; // upper lid openness, 1 = fully open, 0 = shut
  upperTilt: number; // + drops the outer (right) corner
  lower: number; // lower lid raise, 0 = hidden, 1 = meets centre
  lowerCurve: number; // + bows the lower lid up, the "smiling eye"
  pupil: number; // pupil scale
  sclera: number; // eye white scale
  browL: number; // brow height at left end
  browR: number; // brow height at right end
  browArch: number; // + arches up in the middle
  tilt: number; // head tilt in degrees
  tremble: number; // pupil jitter amount
  squint: number; // horizontal squash of the eye white
};

export const MOODS = {
  neutral: {upper: 0.92, upperTilt: 0, lower: 0.08, lowerCurve: 0.1, pupil: 1, sclera: 1, browL: 0, browR: 0, browArch: 0.04, tilt: 0, tremble: 0, squint: 0},
  happy: {upper: 0.96, upperTilt: 0, lower: 0.36, lowerCurve: 0.9, pupil: 1.08, sclera: 1, browL: 0.08, browR: 0.08, browArch: 0.12, tilt: -4, tremble: 0, squint: 0},
  delight: {upper: 0.9, upperTilt: 0, lower: 0.62, lowerCurve: 1.5, pupil: 1, sclera: 1, browL: 0.14, browR: 0.14, browArch: 0.16, tilt: -6, tremble: 0, squint: 0},
  curious: {upper: 1, upperTilt: -0.12, lower: 0.06, lowerCurve: 0.1, pupil: 1.18, sclera: 1.04, browL: 0.02, browR: 0.22, browArch: 0.1, tilt: 9, tremble: 0, squint: 0},
  skeptical: {upper: 0.56, upperTilt: 0.28, lower: 0.2, lowerCurve: -0.1, pupil: 0.9, sclera: 1, browL: -0.1, browR: 0.14, browArch: -0.02, tilt: -5, tremble: 0, squint: 0.04},
  surprised: {upper: 1.08, upperTilt: 0, lower: 0, lowerCurve: 0, pupil: 0.68, sclera: 1.1, browL: 0.26, browR: 0.26, browArch: 0.18, tilt: 0, tremble: 0, squint: -0.04},
  worried: {upper: 0.84, upperTilt: -0.22, lower: 0.12, lowerCurve: -0.2, pupil: 1.12, sclera: 1.02, browL: 0.2, browR: -0.04, browArch: -0.1, tilt: 4, tremble: 1, squint: 0},
  focused: {upper: 0.58, upperTilt: 0, lower: 0.22, lowerCurve: 0.05, pupil: 0.84, sclera: 0.98, browL: -0.1, browR: -0.1, browArch: -0.04, tilt: 0, tremble: 0, squint: 0.06},
  sleepy: {upper: 0.34, upperTilt: 0.06, lower: 0.12, lowerCurve: 0.1, pupil: 1, sclera: 1, browL: -0.04, browR: -0.06, browArch: 0, tilt: 6, tremble: 0, squint: 0},
  excited: {upper: 1.02, upperTilt: 0, lower: 0.28, lowerCurve: 1, pupil: 1.32, sclera: 1.06, browL: 0.2, browR: 0.2, browArch: 0.16, tilt: -3, tremble: 0, squint: 0},
} satisfies Record<string, Face>;

export type Mood = keyof typeof MOODS;

export const blendFace = (a: Face, b: Face, t: number): Face => {
  const out = {} as Face;
  (Object.keys(a) as (keyof Face)[]).forEach((k) => {
    out[k] = a[k] + (b[k] - a[k]) * t;
  });
  return out;
};
