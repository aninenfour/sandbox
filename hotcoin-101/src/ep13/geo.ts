import {LOCKUP} from '../notebook/tokens';

// Stage geometry for FILE 013, per format. 9:16 content stays inside the
// reels-safe band (13% to 79% of height).
export const ANTON = {baseline: 0.8838, capTop: 0.0245, cap: 0.859, ls: 0.005};
export const anton = {
  'PAPER MONEY': 5.1406,
  PAPER: 2.3179,
  MONEY: 2.5884,
  'FILE 013 · HISTORY': 6.6826,
  TRUST: 2.2026,
  '1024': 1.813,
  '1661': 1.6494,
} as const;
export const antonW = (s: keyof typeof anton, size: number) => (anton[s] + s.length * ANTON.ls) * size;

export const geo = (W: number, H: number, v: boolean) => {
  const cx = W / 2;
  const cy = v ? H * 0.46 : H * 0.55;
  const r = v ? 48 : 46;
  const kickerY = v ? H * 0.165 : 122;

  // cold open: a ruler from 1000 to 1700
  const rA = cx - (v ? 430 : 640);
  const rB = cx + (v ? 430 : 640);
  const rulerY = cy + (v ? 60 : 40);
  const yx = (year: number) => rA + ((year - 1000) / 700) * (rB - rA);
  const iconY = cy - (v ? 230 : 190);
  const iconS = v ? 0.8 : 0.85;
  const yearOpen = v ? 120 : 150;
  const bracketY = rulerY + (v ? 220 : 230);

  // title card
  const tS = v ? 300 : 250;
  const t1S = v ? 62 : 70;
  const tTop = v ? H * 0.31 : H * 0.4; // top of first big line
  const tLines = v ? 2 : 1;
  const tBase = tTop + (tLines - 1) * 0.92 * tS + ANTON.baseline * tS;
  const tCap = tTop + ANTON.capTop * tS;
  const t1Top = tCap - tS * 0.09 - ANTON.baseline * t1S;
  const tLastW = v ? antonW('MONEY', tS) : antonW('PAPER MONEY', tS);
  const tr = tS * 0.1;
  const tDot = {x: cx + tLastW / 2 + tS * 0.03 + tr, y: tBase - tr, r: tr};

  // iron
  const floor = cy + (v ? 300 : 250);
  const cartS = v ? 1.15 : 1.35;
  const cartX = cx + (v ? 110 : 200);
  const cartY = floor - 156 * cartS;
  const push = {x: cartX - 210 * cartS - r - 2, y: floor - r};
  const inset = v ? {x: cx - 230, y: cy - 330} : {x: cx - 600, y: cy - 200};
  const insetR = v ? 90 : 95;

  // receipts
  const chestS = v ? 1.25 : 1.35;
  const personS = v ? 1.2 : 1.35;
  const chest = v ? {x: cx, y: cy - 270} : {x: cx - 520, y: cy + 10};
  const people = [0, 1, 2, 3].map((i) => (v ? {x: cx - 345 + i * 230, y: cy + 400} : {x: cx - 40 + i * 245, y: cy + 270}));
  const dotR = v ? {x: cx + 330, y: cy - 140} : {x: chest.x + 300, y: chest.y + 110};

  // seal
  const note = v ? {x: cx, y: cy + 210, w: 300, h: 460} : {x: cx + 280, y: cy + 10, w: 340, h: 520};
  const yearS = v ? 220 : 300;
  const yearPos = v ? {x: 0, y: cy - 520, w: W} : {x: cx - 800, y: cy - 230};
  const dotS = v ? {x: cx - 330, y: cy + 400} : {x: cx - 190, y: cy + 230};

  // printing
  const stack = {x: cx - (v ? 230 : 400), y: cy + (v ? 400 : 290), w: v ? 220 : 280, t: v ? 13 : 14};
  const buys = {x: cx + (v ? 210 : 380), iconY: cy - (v ? 380 : 270)};
  const iconP = v ? 0.5 : 0.55;
  const sackS = v ? 1.2 : 1.35;
  const sackDX = v ? 85 : 95;
  const sackRows = v ? [cy + 90, cy + 330] : [cy + 60, cy + 270];
  const dotP = {x: cx - (v ? 10 : 0), y: stack.y - r};

  // silver: three stations on one line
  const baseY = cy + (v ? 240 : 190);
  const stations = [-1, 0, 1].map((k) => cx + k * (v ? 330 : 500));
  const yuan = {w: v ? 160 : 180, h: v ? 245 : 275};
  const ming = {w: v ? 195 : 220, h: v ? 300 : 340};
  const syceeS = v ? 1.2 : 1.5;
  const syceeY = baseY - 42 * syceeS;
  const yearSmall = v ? 72 : 84;

  // sweden
  const sFloor = cy + (v ? 330 : 270);
  const plate = {w: v ? 540 : 720, h: v ? 260 : 340};
  const plateX = cx + (v ? 30 : 80);
  const coinsX = cx - (v ? 440 : 700);
  const safeX = Math.min(W - 80, plateX + plate.w / 2 + 110);

  // bank
  const bFloor = cy + (v ? 420 : 310);
  const bankX = cx + (v ? -60 : -260);
  const bankS = v ? 1 : 1.3;
  const pileX = bankX + (v ? 350 : 620);
  const bYear = v ? {x: 0, y: cy - 520, w: W, size: 200} : {x: cx + 260, y: cy - 370, w: 0, size: 260};
  const dotB = {x: bankX + (v ? 150 : 170) * bankS, y: bFloor - 28 * bankS - r};

  // same ending: two charts
  const chart = v ? {w: 860, h: 380} : {w: 780, h: 440};
  const chartA = v ? {x: cx, y: cy - 250} : {x: cx - 420, y: cy + 30};
  const chartB = v ? {x: cx, y: cy + 250} : {x: cx + 420, y: cy + 30};
  const chartM = v ? {x: cx, y: cy} : {x: cx, y: cy + 30};

  // trust
  const trS = v ? 220 : 270;
  const trW = (anton.TRUST + 5 * ANTON.ls) * trS;
  const trTop = cy - (ANTON.cap * trS) / 2 - ANTON.capTop * trS;
  const trBase = trTop + ANTON.baseline * trS;
  const trR = trS * 0.11;
  const trDot = {x: cx + trW / 2 + trS * 0.035 + trR, y: trBase - trR, r: trR};
  const bigNote = {s: v ? 3.5 : 4.3};

  // end card
  const lw = v ? W * 0.7 : W * 0.44;
  const k = lw / LOCKUP.w;
  const lx = (W - lw) / 2;
  const ly = H * (v ? 0.43 : 0.44) - (LOCKUP.h * k) / 2;
  const logoDot = {x: lx + LOCKUP.dot.cx * k, y: ly + LOCKUP.dot.cy * k, r: LOCKUP.dot.r * k};

  return {
    W, H, v, cx, cy, r, kickerY,
    rA, rB, rulerY, yx, iconY, iconS, yearOpen, bracketY,
    tS, t1S, tTop, tBase, t1Top, tLastW, tDot,
    floor, cartS, cartX, cartY, push, inset, insetR,
    chestS, personS, chest, people, dotR,
    note, yearS, yearPos, dotS,
    stack, buys, iconP, sackS, sackDX, sackRows, dotP,
    baseY, stations, yuan, ming, syceeS, syceeY, yearSmall,
    sFloor, plate, plateX, coinsX, safeX,
    bFloor, bankX, bankS, pileX, bYear, dotB,
    chart, chartA, chartB, chartM,
    trS, trW, trTop, trBase, trDot, bigNote,
    lw, k, lx, ly, logoDot,
  };
};

export type Geo = ReturnType<typeof geo>;
