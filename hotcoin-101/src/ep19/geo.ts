import openWords from '../../public/vo/ep19-open-master.words.json';
import bodyWords from '../../public/vo/ep19-body-master.words.json';
import closeWords from '../../public/vo/ep19-close-master.words.json';
import {antonWidth, ANTON_METRICS} from '../notebook/anton';
import {endGeo, makeTimeline} from '../notebook/runner';

export const T = makeTimeline(openWords, bodyWords, {close: closeWords, closeGap: 30, tail: 80});
const {w} = T;

export const S = {
  open: 0,
  title: T.TITLE_AT,
  deal: T.BODY_AT - 4,
  club: w("That's") - 8,
  line: w('A') - 8,
  today: w('Today') - 8,
  close: T.CLOSE_AT - 24,
  end: T.END_AT,
};

export const geo = (W: number, H: number, v: boolean) => {
  const cx = W / 2;
  const cy = v ? H * 0.46 : H * 0.55;
  const r = v ? 48 : 46;
  const kickerY = v ? H * 0.165 : 122;
  const head = v ? {x: 0, y: cy - 500, w: W, size: 130} : {x: 120, y: 160, w: 0, size: 140};

  // cold open: the tree and the 24 brokers under it
  const tree = v ? {x: cx, base: cy + 360, s: 1.0} : {x: cx + 280, base: cy + 340, s: 0.95};
  const crowd = v ? {x0: cx - 440, x1: cx + 440, y: cy + 360, s: 0.6} : {x0: tree.x - 520, x1: tree.x + 520, y: cy + 340, s: 0.6};

  // title
  const tS = v ? 165 : 300;
  const tTop = v ? H * 0.31 : H * 0.29;
  const tW = antonWidth('UNDER A TREE', tS, 0.005);
  const tBase = tTop + ANTON_METRICS.baseline * tS;
  const tr = tS * 0.1;
  const tDot = {x: cx + tW / 2 + tS * 0.03 + tr, y: tBase - tr, r: tr};
  const t1S = v ? 58 : 64;
  const t1Top = tTop - t1S * 1.25;
  const subS = v ? 54 : 80;
  const subTop = tTop + tS * 0.98;

  // the agreement on parchment
  const doc = v ? {x: cx, y: cy + 150, w: 880, h: 820} : {x: cx + 220, y: cy + 40, w: 900, h: 640};

  // the club: a roped ring with a gate and a price tag
  const ring = v ? {x: cx, y: cy + 80, r: 300} : {x: cx, y: cy + 50, r: 260};

  // the timeline: four stops
  const tl = v ? {y: cy + 120, xs: [130, 400, 680, 950]} : {y: cy + 120, xs: [260, 720, 1180, 1640]};

  // today: racks and the ghost of the tree
  const racks = v ? {x: cx + 220, base: cy + 420, s: 0.9} : {x: cx + 380, base: cy + 330, s: 1.05};
  const ghost = v ? {x: cx - 230, base: cy + 420, s: 0.75} : {x: cx - 420, base: cy + 330, s: 0.85};

  return {
    W, H, v, cx, cy, r, kickerY, head,
    tree, crowd,
    tS, tTop, tW, tBase, tDot, t1S, t1Top, subS, subTop,
    doc,
    ring,
    tl,
    racks, ghost,
    ...endGeo(W, H, v),
  };
};
export type Geo = ReturnType<typeof geo>;
