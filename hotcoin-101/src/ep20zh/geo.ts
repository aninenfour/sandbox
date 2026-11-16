import openWords from '../../public/vo/ep20zh-open-master.words.json';
import bodyWords from '../../public/vo/ep20zh-body-master.words.json';
import closeWords from '../../public/vo/ep20zh-close-master.words.json';
import {antonWidth, ANTON_METRICS} from '../notebook/anton';
import {endGeo} from '../notebook/runner';
import {makeTimelineZh} from './zhTimeline';

// each English cue key from the FILE 020 edit, landed on its Chinese phrase
const MAPS = {
  open: {paid: '转二十', fees: '手续费', sending: '要五十', bank: '银行', losing: '拍卖', auction: '输了'},
  body: {
    Ethereum: '以太坊', block: '区块', twelve: '十二秒', room: '有限', Gas: 'Gas', transaction: '交易', transfer: '转账', 'twenty-one': '两万一千',
    So: '那要是', auction: '拍卖', bid: '报个价', highest: '最高', low: '太低', wait: '只能等', next: '下一班',
    "That's": '二零一七', game: '游戏', cats: '卡通猫', CryptoKitties: '加密猫', jammed: '堵死', seventeen: '二零一七', thirty: '三万', stuck: '卡在',
    And: '还有', night: '晚上', 'twenty-two': '二零二二', crowded: '挤爆', spent: '光是', fifty: '烧掉', gas: '美元',
    The: '出路', layer: '二层网络', Rollups: 'Rollup', bundle: '打包', hundreds: '几百', post: '合成', 'one#4': '提交',
    upgrade: '升级', 'twenty-four': '二零二四', fees: '手续费', few: '几美分', cents: '美分',
  },
  close: {Fees: '手续费', tax: '税', auction: '拍卖', send: '发送', bidders: '出价人', check: '先看看', busy: '这条路', road: '堵不堵', ride: '堵不堵'},
};

export const T = makeTimelineZh(openWords, bodyWords, closeWords, MAPS, {closeGap: 30, tail: 90});
const {w} = T;

export const S = {
  open: 0,
  title: T.TITLE_AT,
  block: T.BODY_AT - 4,
  auction: w('So') - 8,
  spikes: w("That's") - 8,
  l2: w('The'),
  close: T.CLOSE_AT - 24,
  end: T.END_AT,
};

/** seat centre inside a BlockBus drawn at (bx, by) */
export const seatAt = (bus: {x: number; y: number; w: number; h: number; cols: number; rows: number}, i: number) => {
  const pad = 26;
  const sw = (bus.w - pad * 2) / bus.cols;
  const sh = (bus.h - pad * 2 - 30) / bus.rows;
  const c = i % bus.cols;
  const r = Math.floor(i / bus.cols);
  return {x: bus.x - bus.w / 2 + pad + c * sw + sw / 2, y: bus.y - bus.h / 2 + pad + 30 + r * sh + sh / 2, sw, sh};
};

export const geo = (W: number, H: number, v: boolean) => {
  const cx = W / 2;
  const cy = v ? H * 0.46 : H * 0.55;
  const r = v ? 48 : 46;
  const kickerY = v ? H * 0.165 : 122;
  const head = v ? {x: 0, y: cy - 500, w: W, size: 130} : {x: 120, y: 160, w: 0, size: 140};

  // cold open: a parcel, a toll booth, a fee bigger than the parcel
  const ground0 = v ? cy + 380 : cy + 300;
  const booth = v ? {x: cx + 260, s: 1.05} : {x: cx + 470, s: 1.25};
  const parcel = v ? {x: cx - 130, s: 1.05} : {x: cx - 160, s: 1.35};
  const me0 = v ? {x: cx - 380} : {x: cx - 470};

  // title
  const tS = v ? 220 : 320;
  const tTop = v ? H * 0.31 : H * 0.29;
  const tW = antonWidth('GAS ', tS, 0.005) + tS * 1.0;
  const tBase = tTop + ANTON_METRICS.baseline * tS;
  const tr = tS * 0.1;
  const tDot = {x: cx + tW / 2 + tS * 0.03 + tr, y: tBase - tr, r: tr};
  const t1S = v ? 58 : 64;
  const t1Top = tTop - t1S * 1.25;
  const subS = v ? 54 : 80;
  const subTop = tTop + tS * 0.98;

  // the block: a photo card and a bus with seats
  const photo = v ? {x: cx - 210, y: cy - 130, w: 300, h: 330, rot: -5} : {x: 330, y: cy + 10, w: 320, h: 360, rot: -5};
  const bus = v ? {x: cx, y: cy + 420, w: 960, h: 440, cols: 7, rows: 3} : {x: 1200, y: cy + 40, w: 1040, h: 460, cols: 8, rows: 3};
  const clock = v ? {x: cx + 250, y: cy - 130, r: 90} : {x: bus.x + bus.w / 2 - 70, y: bus.y - bus.h / 2 - 110, r: 66};
  const mySeat = v ? 19 : 21;

  // the auction: a short bus and a queue of bidders
  const abus = v ? {x: cx, y: cy - 20, w: 940, h: 300, cols: 5, rows: 1} : {x: cx - 330, y: cy - 10, w: 860, h: 300, cols: 5, rows: 1};
  const aGround = v ? cy + 470 : abus.y + abus.h / 2 + 40;
  const queue = v ? Array.from({length: 6}).map((_, i) => 120 + i * 162) : Array.from({length: 6}).map((_, i) => abus.x + abus.w / 2 + 90 + i * 120);

  // spikes: two news cards
  const card = v ? {w: 820, h: 640} : {w: 600, h: 560};
  const c1 = v ? {x: cx, y: cy + 180, rot: -2} : {x: 500, y: cy + 60, rot: -3};
  const c2 = v ? {x: cx, y: cy + 180, rot: 2} : {x: 1420, y: cy + 50, rot: 3};
  const balloon = v ? {x: cx, y: cy - 150} : {x: cx, y: cy - 40};

  // layer two: a crate and the fee stairs
  const crate = v ? {x: cx, y: cy - 150, w: 860, h: 260} : {x: cx - 470, y: cy + 20, w: 560, h: 280};
  const stairs = v ? {x: cx - 380, y: cy + 180, sw: 190, sh: 92, n: 4} : {x: cx + 60, y: cy - 150, sw: 190, sh: 100, n: 4};
  const floorY = stairs.y + stairs.sh * stairs.n;

  // closing: the bidder with a paddle, and the busy gauge
  const me = v ? {x: cx - 120, y: cy + 200, r: 76} : {x: cx - 330, y: cy + 120, r: 76};
  const gauge = v ? {x: cx + 20, y: cy + 720, r: 170} : {x: cx + 470, y: cy + 160, r: 170};
  const ground9 = me.y + me.r;

  return {
    W, H, v, cx, cy, r, kickerY, head,
    ground0, booth, parcel, me0,
    tS, tTop, tW, tBase, tDot, t1S, t1Top, subS, subTop,
    photo, bus, clock, mySeat,
    abus, aGround, queue,
    card, c1, c2, balloon,
    crate, stairs, floorY,
    me, gauge, ground9,
    ...endGeo(W, H, v),
  };
};
export type Geo = ReturnType<typeof geo>;
