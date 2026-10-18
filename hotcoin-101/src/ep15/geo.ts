import openWords from '../../public/vo/ep15-open-master.words.json';
import bodyWords from '../../public/vo/ep15-body-master.words.json';
import {endGeo, makeTimeline} from '../notebook/runner';

export const T = makeTimeline(openWords, bodyWords);
const {w} = T;

export const S = {
  open: 0,
  title: T.TITLE_AT,
  whale: T.BODY_AT - 4,
  shrimp: w('A', 2) - 6,
  bag: w('And') - 8,
  address: w("Here's") - 8,
  conc: w('But') - 8,
  end: T.END_AT,
};

export const ANTON = {baseline: 0.8838, capTop: 0.0245, ls: 0.005};
export const ADV: Record<string, number> = {'WHALE, SHRIMP,': 6.0942, BAGHOLDER: 4.2129, 'WHALE,': 2.7417, 'SHRIMP,': 3.1182};
export const antonW = (s: string, size: number) => (ADV[s] + s.length * ANTON.ls) * size;

export const geo = (W: number, H: number, v: boolean) => {
  const cx = W / 2;
  const cy = v ? H * 0.46 : H * 0.55;
  const r = v ? 48 : 46;
  const kickerY = v ? H * 0.165 : 122;

  // cold open: three specimen cards
  const cards = v
    ? [0, 1, 2].map((i) => ({x: cx, y: cy - 320 + i * 340, w: 660, h: 300}))
    : [0, 1, 2].map((i) => ({x: cx + (i - 1) * 580, y: cy - 30, w: 480, h: 420}));
  const youDot = v ? {x: cx + 330, y: cy + 360 + 150 + 34} : {x: cx, y: cy + 290};

  // title: lines stacked, last line ends in the narrator
  const lines = v
    ? [
        {t: 'WHALE,', s: 200},
        {t: 'SHRIMP,', s: 200},
        {t: 'BAGHOLDER', s: 200},
      ]
    : [
        {t: 'WHALE, SHRIMP,', s: 170},
        {t: 'BAGHOLDER', s: 250},
      ];
  const tTop0 = v ? H * 0.27 : H * 0.33;
  let y = tTop0;
  const titleLines = lines.map((l) => {
    const out = {...l, top: y};
    y += 0.92 * l.s;
    return out;
  });
  const lastL = titleLines[titleLines.length - 1];
  const lastW = antonW(lastL.t, lastL.s);
  const tBase = lastL.top + ANTON.baseline * lastL.s;
  const tr = lastL.s * 0.1;
  const tDot = {x: cx + lastW / 2 + lastL.s * 0.03 + tr, y: tBase - tr, r: tr};
  const t1S = v ? 58 : 64;
  const t1Top = titleLines[0].top + ANTON.capTop * titleLines[0].s - titleLines[0].s * 0.09 - ANTON.baseline * t1S;

  // whale: the sea is the price line
  const sea = {y: cy - (v ? 60 : 40), x0: W * 0.06, x1: W * 0.94};
  const whaleY = cy + (v ? 230 : 230);
  const whaleS = v ? 0.95 : 1.25;
  const whaleX = v ? cx - 20 : cx - 120;
  const head = v ? {x: 0, y: cy - 500, w: W, size: 130} : {x: 120, y: 160, w: 0, size: 140};
  const rideX = v ? cx + 300 : cx + 420;

  // shrimp swarm
  const swarm = v ? {x0: cx - 430, x1: cx + 430, y0: cy - 260, y1: cy + 470} : {x0: cx - 780, x1: cx + 780, y0: cy - 150, y1: cy + 330};
  const swarmDot = {x: cx, y: (swarm.y0 + swarm.y1) / 2 + 10};

  // bagholder chart
  const chart = v ? {x: cx, y: cy + 120, w: 900, h: 700} : {x: cx + 60, y: cy + 50, w: 1200, h: 560};
  const bagDot = v ? {x: cx - 380, y: chart.y + chart.h / 2 + 34} : {x: chart.x - chart.w / 2 - 60, y: chart.y - 40};

  // address isn't a person
  const whaleBig = v ? {x: cx + 20, y: cy - 280, s: 1.15} : {x: cx - 40, y: cy - 150, s: 1.45};
  const crowd = v ? {x0: cx - 420, x1: cx + 420, y0: cy + 30, y1: cy + 470, cols: 8, rows: 6} : {x0: cx - 720, x1: cx + 720, y0: cy + 110, y1: cy + 340, cols: 14, rows: 3};

  // concentration
  const tree = v ? {x: cx, y: cy - 150, w: 880, h: 560} : {x: cx - 330, y: cy + 30, w: 860, h: 560};
  const mini = v ? {x: cx, y: cy + 360, w: 880, h: 260} : {x: cx + 560, y: cy + 30, w: 520, h: 380};

  return {
    W, H, v, cx, cy, r, kickerY,
    cards, youDot,
    titleLines, tBase, tDot, t1S, t1Top, lastW,
    sea, whaleY, whaleS, whaleX, head, rideX,
    swarm, swarmDot,
    chart, bagDot,
    whaleBig, crowd,
    tree, mini,
    ...endGeo(W, H, v),
  };
};
export type Geo = ReturnType<typeof geo>;
