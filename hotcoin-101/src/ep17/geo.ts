import openWords from '../../public/vo/ep17-open-master.words.json';
import bodyWords from '../../public/vo/ep17-body-master.words.json';
import {antonWidth, ANTON_METRICS} from '../notebook/anton';
import {endGeo, makeTimeline} from '../notebook/runner';

export const T = makeTimeline(openWords, bodyWords);
const {w} = T;

export const S = {
  open: 0,
  title: T.TITLE_AT,
  loan: T.BODY_AT - 4,
  opp: w("Here's") - 8,
  ten: w('And') - 8,
  y22: w('So') - 8,
  bar: w('everything') - 8,
  end: T.END_AT,
};

export const geo = (W: number, H: number, v: boolean) => {
  const cx = W / 2;
  const cy = v ? H * 0.46 : H * 0.55;
  const r = v ? 48 : 46;
  const kickerY = v ? H * 0.165 : 122;
  const head = v ? {x: 0, y: cy - 500, w: W, size: 130} : {x: 120, y: 160, w: 0, size: 140};

  // cold open: the certificate, and what it quietly prices
  const cert = v ? {x: cx, y: cy - 230, w: 680, h: 400} : {x: cx - 430, y: cy + 10, w: 600, h: 390};
  const items = v
    ? [
        {x: cx - 250, y: cy + 230},
        {x: cx + 250, y: cy + 230},
        {x: cx - 250, y: cy + 500},
        {x: cx + 250, y: cy + 500},
      ]
    : [
        {x: cx + 330, y: cy - 210},
        {x: cx + 640, y: cy - 60},
        {x: cx + 330, y: cy + 140},
        {x: cx + 640, y: cy + 280},
      ];

  // title
  const tS = v ? 260 : 300;
  const tTop = v ? H * 0.31 : H * 0.29;
  const tW = antonWidth('BONDS', tS, 0.005);
  const tBase = tTop + ANTON_METRICS.baseline * tS;
  const tr = tS * 0.1;
  const tDot = {x: cx + tW / 2 + tS * 0.03 + tr, y: tBase - tr, r: tr};
  const t1S = v ? 58 : 64;
  const t1Top = tTop - t1S * 1.25;
  const subS = v ? 54 : 80;
  const subTop = tTop + tS * 0.98;

  // the loan: a cash-flow timeline, slot 0 is the money you hand over, 1..10 the years
  const flow = v ? {x0: 110, x1: W - 110, y: cy + 170, up: 420, down: 230} : {x0: 260, x1: W - 220, y: cy + 110, up: 330, down: 220};
  const slotX = (i: number) => flow.x0 + (i / 10) * (flow.x1 - flow.x0);

  // rates up, old prices down
  const yours = v ? {x: cx - 240, y: cy - 300, w: 440, h: 300} : {x: cx - 430, y: cy - 80, w: 540, h: 300};
  const fresh = v ? {x: cx + 240, y: cy - 300, w: 440, h: 300} : {x: cx + 330, y: cy - 80, w: 540, h: 300};
  const buyersY = v ? cy + 110 : cy + 230;
  const twin = v ? {x: cx, y: cy + 380, w: 900, h: 300} : {x: cx, y: cy + 250, w: 1100, h: 230};

  // the ten-year everyone watches
  const tile = v ? {x: cx, y: cy, w: 640, h: 320} : {x: cx, y: cy, w: 600, h: 300};
  const watchers = v
    ? [
        {x: cx - 330, y: cy - 400},
        {x: cx + 330, y: cy - 400},
        {x: cx - 330, y: cy + 400},
        {x: cx + 330, y: cy + 400},
      ]
    : [
        {x: cx - 660, y: cy - 200},
        {x: cx + 660, y: cy - 200},
        {x: cx - 660, y: cy + 220},
        {x: cx + 660, y: cy + 220},
      ];

  // 2022: the yield climbs
  const chart = v ? {x: cx, y: cy + 170, w: 920, h: 700} : {x: cx + 120, y: cy + 80, w: 1280, h: 580};

  // the bar: a high-jump stand at the risk-free rate
  const stand = v ? {x: cx + 10, floor: cy + 430, span: 600, post: 640} : {x: cx + 160, floor: cy + 320, span: 820, post: 560};
  const barH = (rate: number) => (v ? 90 : 70) * rate + 40;

  return {
    W, H, v, cx, cy, r, kickerY, head,
    cert, items,
    tS, tTop, tW, tBase, tDot, t1S, t1Top, subS, subTop,
    flow, slotX,
    yours, fresh, buyersY, twin,
    tile, watchers,
    chart,
    stand, barH,
    ...endGeo(W, H, v),
  };
};
export type Geo = ReturnType<typeof geo>;
