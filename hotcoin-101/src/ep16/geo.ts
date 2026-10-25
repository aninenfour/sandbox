import openWords from '../../public/vo/ep16-open-master.words.json';
import bodyWords from '../../public/vo/ep16-body-master.words.json';
import {antonWidth, ANTON_METRICS} from '../notebook/anton';
import {endGeo, makeTimeline} from '../notebook/runner';

export const T = makeTimeline(openWords, bodyWords);
const {w} = T;

export const S = {
  open: 0,
  title: T.TITLE_AT,
  book: T.BODY_AT - 4,
  deep: w('Deep') - 8,
  vanish: w('And') - 8,
  crash: w('On') - 8,
  take: w('depth') - 14,
  end: T.END_AT,
};

/** a price ladder: price labels at px, bars growing right from bx, rows of rowH from top */
export type Ladder = {px: number; bx: number; top: number; rowH: number; max: number};
export const rowY = (L: Ladder, i: number) => L.top + (i + 0.5) * L.rowH;

export const geo = (W: number, H: number, v: boolean) => {
  const cx = W / 2;
  const cy = v ? H * 0.46 : H * 0.55;
  const r = v ? 48 : 46;
  const kickerY = v ? H * 0.165 : 122;

  // cold open: a price screen with a sell button, and the thin stack of buyers under it
  const card = v ? {x: cx, y: cy - 330, w: 640, h: 380} : {x: cx - 470, y: cy, w: 540, h: 560};
  const openL: Ladder = v ? {px: cx - 400, bx: cx - 250, top: cy - 50, rowH: 96, max: 620} : {px: cx + 10, bx: cx + 150, top: cy - 250, rowH: 100, max: 600};
  const btn = {x: card.x, y: card.y + card.h / 2 - 34 - (v ? 44 : 50), w: card.w - 80, h: v ? 88 : 100};

  // title
  const tS = v ? 210 : 300;
  const tTop = v ? H * 0.31 : H * 0.29;
  const tW = antonWidth('LIQUIDITY', tS, 0.005);
  const tBase = tTop + ANTON_METRICS.baseline * tS;
  const tr = tS * 0.1;
  const tDot = {x: cx + tW / 2 + tS * 0.03 + tr, y: tBase - tr, r: tr};
  const t1S = v ? 58 : 64;
  const t1Top = tTop - t1S * 1.25;
  const subS = v ? 56 : 80;
  const subTop = tTop + tS * 0.98;

  // order book: 5 asks, a gap, 5 bids
  const book: Ladder = v ? {px: cx - 410, bx: cx - 260, top: cy - 300, rowH: 64, max: 640} : {px: cx - 470, bx: cx - 320, top: cy - 300, rowH: 55, max: 760};

  // deep vs thin: two stacks of bids side by side
  const cols = v
    ? [
        {x0: cx - 480, w: 430},
        {x0: cx + 50, w: 430},
      ]
    : [
        {x0: cx - 780, w: 560},
        {x0: cx + 120, w: 560},
      ];
  const dtTop = v ? cy - 190 : cy - 200;
  const dtRow = v ? 78 : 68;
  const head = v ? {x: 0, y: cy - 520, w: W, size: 130} : {x: 120, y: 160, w: 0, size: 140};

  // flash crash chart
  const chart = v ? {x: cx, y: cy + 150, w: 920, h: 640} : {x: cx + 140, y: cy + 70, w: 1240, h: 560};

  // takeaway: a small book under the magnifier, quote and fill cards
  const mini: Ladder = v ? {px: cx - 330, bx: cx - 200, top: cy - 470, rowH: 46, max: 520} : {px: cx - 820, bx: cx - 690, top: cy - 250, rowH: 50, max: 520};
  const cards = v
    ? [
        {x: cx - 235, y: cy + 330, w: 400, h: 300},
        {x: cx + 235, y: cy + 330, w: 400, h: 300},
      ]
    : [
        {x: cx + 380, y: cy - 150, w: 560, h: 240},
        {x: cx + 380, y: cy + 170, w: 560, h: 240},
      ];

  return {
    W, H, v, cx, cy, r, kickerY,
    card, openL, btn,
    tS, tTop, tW, tBase, tDot, t1S, t1Top, subS, subTop,
    book,
    cols, dtTop, dtRow, head,
    chart,
    mini, cards,
    ...endGeo(W, H, v),
  };
};
export type Geo = ReturnType<typeof geo>;
