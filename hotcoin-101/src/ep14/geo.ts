import openWords from '../../public/vo/ep14-open-master.words.json';
import bodyWords from '../../public/vo/ep14-body-master.words.json';
import {endGeo, makeTimeline} from '../notebook/runner';

export const T = makeTimeline(openWords, bodyWords);
const {w} = T;

export const S = {
  open: 0,
  title: T.TITLE_AT,
  coat: T.BODY_AT - 4,
  svb: w('Which') - 8,
  vault: w('The', 2) - 8,
  formula: w('And') - 8,
  claim: w('So') - 8,
  end: T.END_AT,
};

const ANTON = {baseline: 0.8838, capTop: 0.0245, ls: 0.005};
const adv = {STABLECOINS: 4.7764, STABLE: 2.6299, COINS: 2.1465};

export const geo = (W: number, H: number, v: boolean) => {
  const cx = W / 2;
  const cy = v ? H * 0.46 : H * 0.55;
  const r = v ? 48 : 46;
  const kickerY = v ? H * 0.165 : 122;

  // cold open: the scale
  const pivot = {x: cx, y: cy - (v ? 130 : 120)};
  const beam = v ? 320 : 360;
  const hang = 150;
  const post = v ? 390 : 340;

  // title
  const tS = v ? 300 : 260;
  const t1S = v ? 62 : 70;
  const tTop = v ? H * 0.31 : H * 0.4;
  const tLines = v ? 2 : 1;
  const tBase = tTop + (tLines - 1) * 0.92 * tS + ANTON.baseline * tS;
  const tCap = tTop + ANTON.capTop * tS;
  const t1Top = tCap - tS * 0.09 - ANTON.baseline * t1S;
  const tLastW = ((v ? adv.COINS : adv.STABLECOINS) + (v ? 5 : 11) * ANTON.ls) * tS;
  const tr = tS * 0.1;
  const tDot = {x: cx + tLastW / 2 + tS * 0.03 + tr, y: tBase - tr, r: tr};

  // coat check
  const cFloor = cy + (v ? 330 : 280);
  const booth = {x: cx + (v ? -70 : -100), h: v ? 560 : 520, win: 200, kw: v ? 300 : 360};
  const person = {x: booth.x - (v ? 290 : 420), s: v ? 1.35 : 1.5};
  const safe = {x: booth.x + (v ? 320 : 420), s: v ? 230 : 270};
  const hand = {x: person.x + 40 * person.s, y: cFloor - 82 * person.s};
  const window = {x: booth.x, y: cFloor - 120 - booth.win / 2};

  // svb
  const cell = v ? {w: 82, h: 52} : {w: 78, h: 50};
  const grid = v ? {x: cx - 420, y: cy - 300} : {x: cx - 700, y: cy - 190};
  const svbBank = v ? {x: cx + 220, y: cy - 50, s: 0.55} : {x: cx - 330, y: cy + 230, s: 0.5};
  const big = v ? {x: 0, y: cy - 495, w: W, size: 140} : {x: cx - 720, y: cy - 400, w: 0, size: 150};
  const chart = v ? {x: cx, y: cy + 290, w: 880, h: 400} : {x: cx + 330, y: cy + 20, w: 760, h: 420};

  // vault (overcollateralised)
  const vFloor = cy + (v ? 360 : 300);
  const colL = cx - (v ? 200 : 280);
  const colR = cx + (v ? 200 : 280);
  const row = v ? 30 : 28;
  const coinW = v ? 200 : 220;

  // formula
  const saw = v ? {x: cx, y: cy - 280, len: 330} : {x: cx - 470, y: cy + 40, len: 300};
  const sawFloor = saw.y + 120;
  const fChart = v ? {x: cx, y: cy + 330, w: 880, h: 380} : {x: cx + 360, y: cy + 30, w: 720, h: 420};

  // claim
  const clFloor = cy + (v ? 300 : 270);
  const peds = [-1, 0, 1].map((k) => cx + k * (v ? 330 : 430));
  const pedH = v ? 200 : 220;
  const pedW = v ? 190 : 200;
  const tokR = v ? 56 : 60;

  return {
    W, H, v, cx, cy, r, kickerY,
    pivot, beam, hang, post,
    tS, t1S, tTop, tBase, t1Top, tLastW, tDot,
    cFloor, booth, person, safe, hand, window,
    cell, grid, svbBank, big, chart,
    vFloor, colL, colR, row, coinW,
    saw, sawFloor, fChart,
    clFloor, peds, pedH, pedW, tokR,
    ...endGeo(W, H, v),
  };
};
export type Geo = ReturnType<typeof geo>;

// chart helpers: value 1 = peg
export const chartPt = (c: {x: number; y: number; w: number; h: number}, px: number, val: number, lo = 0) => ({
  x: c.x - c.w / 2 + 40 + px * (c.w - 80),
  y: c.y - c.h / 2 + 50 + ((1.08 - val) / (1.08 - lo)) * (c.h - 100),
});
