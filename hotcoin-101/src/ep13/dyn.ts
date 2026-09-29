import type {Geo} from './geo';
import {S, w} from './timeline';

// Moving parts that both the scenes and the narrator need to agree on.
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const sm = (t: number) => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};
export const win = (f: number, at: number, dur: number) => clamp((f - at) / dur);
export const outBack = (t: number, s = 1.7) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const v = t - 1;
  return 1 + (s + 1) * v * v * v + s * v * v;
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// receipts: slip leaves the chest, then hops hand to hand
export const SLIP_HOP = 12;
export const slipPos = (f: number, g: Geo) => {
  const slot = {x: g.chest.x, y: g.chest.y + 39 * g.chestS};
  const above = {x: g.chest.x, y: g.chest.y - 190 * g.chestS};
  const t0 = w('handed');
  if (f < t0) return {...slot, s: 0.15, rot: 0};
  const rise = sm((f - t0) / 22);
  if (f < w('traded') - 10) return {x: above.x, y: lerp(slot.y, above.y, rise), s: lerp(0.15, 1, rise), rot: 0};
  const hands = g.people.map((p) => ({x: p.x + 30 * g.personS, y: p.y - 150 * g.personS}));
  const tt = (f - (w('traded') - 10)) / SLIP_HOP;
  const i = Math.floor(tt);
  const u = tt - i;
  const from = i === 0 ? above : hands[(i - 1) % 4];
  const to = hands[i % 4];
  const e = sm(u);
  return {x: lerp(from.x, to.x, e), y: lerp(from.y, to.y, e) - 90 * 4 * e * (1 - e), s: 1, rot: Math.sin(u * Math.PI) * 14};
};

// printing: how many notes in the stack
export const stackCount = (f: number) => Math.floor(1 + 3 * win(f, w('needed'), 30) + 34 * sm(win(f, w('printing'), 105)));
export const stackTop = (f: number, g: Geo) => ({x: g.stack.x, y: g.stack.y - stackCount(f) * g.stack.t});

// silver: the ingot drops in
export const syceeLand = () => w('hundreds') + 14;
export const syceeAt = (f: number, g: Geo) => {
  const land = syceeLand();
  if (f >= land) return g.syceeY - 16 * Math.exp(-(f - land) / 2.6) * Math.abs(Math.sin((f - land) * 0.8));
  const t = clamp((f - (land - 12)) / 12);
  return lerp(-200, g.syceeY, t * t);
};

// sweden: the plate falls and slams
export const plateLand = () => w('weighed');
export const plateCenterY = (f: number, g: Geo) => {
  const end = g.sFloor - g.plate.h / 2;
  const land = plateLand();
  if (f >= land) return end - 12 * Math.exp(-(f - land) / 2.4) * Math.abs(Math.sin((f - land) * 0.9));
  const t = clamp((f - (land - 13)) / 13);
  return lerp(-g.plate.h, end, t * t);
};

// same ending: value of one note, illustrative, same shape twice
export const CURVE = [
  [0, 0.9], [0.18, 0.9], [0.34, 0.86], [0.5, 0.74], [0.64, 0.52], [0.76, 0.32], [0.88, 0.16], [1, 0.1],
];
export const CURVE_B = [
  [0, 0.88], [0.16, 0.9], [0.33, 0.84], [0.5, 0.75], [0.63, 0.5], [0.77, 0.31], [0.9, 0.15], [1, 0.1],
];
export const mergeT = (f: number) => sm(win(f, w('same', 2) - 6, 20));
export const chartCenter = (f: number, g: Geo, which: 'A' | 'B') => {
  const a = which === 'A' ? g.chartA : g.chartB;
  const m = mergeT(f);
  return {x: lerp(a.x, g.chartM.x, m), y: lerp(a.y, g.chartM.y, m)};
};
export const curvePoint = (c: {x: number; y: number}, g: Geo, p: number[]) => ({
  x: c.x - g.chart.w / 2 + 30 + p[0] * (g.chart.w - 60),
  y: c.y + g.chart.h / 2 - 24 - p[1] * (g.chart.h - 60),
});

export const sceneAt = (f: number) => {
  const order = Object.entries(S).sort((a, b) => a[1] - b[1]);
  let cur = order[0][0];
  for (const [k, t] of order) if (f >= t) cur = k;
  return cur as keyof typeof S;
};
