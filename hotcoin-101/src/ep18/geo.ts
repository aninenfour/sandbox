import openWords from '../../public/vo/ep18-open-master.words.json';
import bodyWords from '../../public/vo/ep18-body-master.words.json';
import closeWords from '../../public/vo/ep18-close-master.words.json';
import {antonWidth, ANTON_METRICS} from '../notebook/anton';
import {endGeo, makeTimeline} from '../notebook/runner';

// FILE 018 is the first with a closing take and a held last scene (see CLAUDE.md, "Give the ending room").
export const T = makeTimeline(openWords, bodyWords, {close: closeWords, closeGap: 30, tail: 80});
/** true while the words files are estimates (no voice generated yet); renders carry a banner so they can't ship */
export const PLACEHOLDER = [openWords, bodyWords, closeWords].some((x) => (x as {placeholder?: boolean}).placeholder);
const {w} = T;

export const S = {
  open: 0,
  title: T.TITLE_AT,
  dd: T.BODY_AT - 4,
  streak: w('And') - 8,
  size: w('So') - 8,
  close: T.CLOSE_AT - 24,
  end: T.END_AT,
};

export const geo = (W: number, H: number, v: boolean) => {
  const cx = W / 2;
  const cy = v ? H * 0.46 : H * 0.55;
  const r = v ? 48 : 46;
  const kickerY = v ? H * 0.165 : 122;
  const head = v ? {x: 0, y: cy - 500, w: W, size: 130} : {x: 120, y: 160, w: 0, size: 140};

  // cold open: one column of money, halved, then the wrong and the right way back
  const col = v ? {x: cx - 150, base: cy + 430, h: 680, w: 240} : {x: cx - 330, base: cy + 300, h: 500, w: 220};

  // title
  const tS = v ? 180 : 280;
  const tTop = v ? H * 0.31 : H * 0.29;
  const tW = antonWidth('RISK OF RUIN', tS, 0.005);
  const tBase = tTop + ANTON_METRICS.baseline * tS;
  const tr = tS * 0.1;
  const tDot = {x: cx + tW / 2 + tS * 0.03 + tr, y: tBase - tr, r: tr};
  const t1S = v ? 58 : 64;
  const t1Top = tTop - t1S * 1.25;
  const subS = v ? 54 : 80;
  const subTop = tTop + tS * 0.98;

  // drawdowns: three pairs of bars, loss down and recovery up, on one scale
  const dd = v ? {base: cy + 120, k: 1.9, xs: [cx - 330, cx, cx + 330], bw: 76} : {base: cy + 40, k: 1.5, xs: [cx - 520, cx - 60, cx + 420], bw: 84};

  // a hundred coin flips
  const grid = v ? {x: cx, y: cy + 90, cell: 74} : {x: cx + 200, y: cy + 50, cell: 54};

  // two accounts, same five losses
  const gauges = v
    ? {xs: [cx - 230, cx + 230], base: cy + 520, h: 720, w: 210, chipsY: cy - 380}
    : {xs: [cx - 400, cx + 400], base: cy + 330, h: 540, w: 210, chipsY: cy - 330};

  // closing: two roads, one keeps going
  const road = v ? {x0: 70, x1: W - 40, yA: cy - 120, yB: cy + 260, cliff: cx + 40} : {x0: 160, x1: W - 80, yA: cy - 40, yB: cy + 220, cliff: cx - 60};

  return {
    W, H, v, cx, cy, r, kickerY, head,
    col,
    tS, tTop, tW, tBase, tDot, t1S, t1Top, subS, subTop,
    dd,
    grid,
    gauges,
    road,
    ...endGeo(W, H, v),
  };
};
export type Geo = ReturnType<typeof geo>;
