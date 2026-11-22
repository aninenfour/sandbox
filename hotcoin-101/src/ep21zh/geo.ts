import openWords from '../../public/vo/ep21zh-open-master.words.json';
import bodyWords from '../../public/vo/ep21zh-body-master.words.json';
import closeWords from '../../public/vo/ep21zh-close-master.words.json';
import {antonWidth} from '../notebook/anton';
import {endGeo} from '../notebook/runner';
import {makeTimelineZh} from '../ep20zh/zhTimeline';

// each English cue key from the FILE 021 edit, landed on its Chinese phrase
const MAPS = {
  open: {dictionary: '黑话', jokes: '话：', Ape: '梭哈', rug: '跑路', degen: '赌狗', warnings: '穿着', costume: '警告'},
  body: {
    Aping: '梭哈', buying: '就是不看', reading: '白皮书', big: '不做功课', without: '看别人', everyone: '都在冲', jumping: '往里冲',
    Which: '然后就是', rug: '跑路', launches: '发个币', 'in#2': '冲进去', pulls: '撤走', liquidity: '流动性', dumps: '砸盘', disappears: '一下子就没了',
    In: '二零二一', Squid: '鱿鱼', shot: '涨到两千', thousand: '两千多', sell: '卖不出去', dropped: '几分钟后', zero: '归零', million: '三百万',
    That: '同一年', Chainalysis: 'Chainalysis', 'thirty-seven': '百分之三十七', scam: '三十七', billion: '二十八亿',
    And: '这也不是', LIBRA: 'LIBRA', president: '阿根廷总统', hit: '市值冲到', four: '四十亿', valuation: '美元，几小时', crashed: '暴跌', 'percent#2': '九成', insider: '内部钱包', 'million#2': '一亿美元',
    'Then#2': '最后是', degen: '赌狗', degenerate: 'degenerate', gambler: '赌徒', proudly: '骄傲',
  },
  close: {jokes: '开玩笑', real: '是真的', Who: '谁能', rug: '地毯'},
};

export const T = makeTimelineZh(openWords, bodyWords, closeWords, MAPS, {closeGap: 30, tail: 90});
const {w} = T;

export const S = {
  open: 0,
  title: T.TITLE_AT,
  ape: T.BODY_AT - 4,
  rug: w('Which') - 8,
  squid: w('In') - 8,
  stat: w('That') - 8,
  libra: w('And') - 8,
  degen: w('Then', 2) - 8,
  close: T.CLOSE_AT - 24,
  end: T.END_AT,
};

export const geo = (W: number, H: number, v: boolean) => {
  const cx = W / 2;
  const cy = v ? H * 0.46 : H * 0.55;
  const r = v ? 48 : 46;
  const kickerY = v ? H * 0.165 : 122;
  const head = v ? {x: 0, y: cy - 500, w: W, size: 130} : {x: 120, y: 160, w: 0, size: 140};

  // cold open: three joke bubbles
  const bub = v
    ? {w: 560, h: 210, size: 150, at: [{x: cx + 60, y: cy - 250}, {x: cx - 40, y: cy + 10}, {x: cx + 60, y: cy + 270}]}
    : {w: 420, h: 210, size: 150, at: [{x: cx - 500, y: cy - 30}, {x: cx, y: cy - 60}, {x: cx + 500, y: cy - 30}]};
  const floor0 = v ? cy + 560 : cy + 300;
  const me0 = v ? {x: cx - 330} : {x: cx - 640};

  // title
  const tS = v ? 140 : 230;
  const tTop = v ? H * 0.31 : H * 0.29;
  const tW = tS * 6 + antonWidth('  ', tS, 0.005); // 梭哈 跑路 赌狗: six full-width glyphs, two spaces
  const tBase = tTop + 0.92 * tS; // CJK glyphs sit lower than Anton's baseline
  const tr = tS * 0.1;
  const tDot = {x: cx + tW / 2 + tS * 0.03 + tr, y: tBase - tr, r: tr};
  const t1S = v ? 58 : 64;
  const t1Top = tTop - t1S * 1.25;
  const subS = v ? 54 : 80;
  const subTop = tTop + tS * 1.12;

  // ape: diving board and a token pool
  const board = v ? {x: 90, y: cy - 60, len: 420} : {x: 230, y: cy + 10, len: 520};
  const pool = v ? {x: 110, y: cy + 330, w: 860, h: 300} : {x: 860, y: cy + 210, w: 880, h: 220};
  const sign = v ? {x: cx + 230, y: cy + 160} : {x: pool.x + pool.w / 2, y: pool.y - 230};
  const queue = Array.from({length: 5}).map((_, i) => board.x + board.len - 70 - i * (v ? 72 : 88));

  // rug: everyone standing on it
  const floor = v ? cy + 420 : cy + 280;
  const rug = v ? {x: 40, w: 900, h: 24} : {x: 220, w: 1300, h: 24};
  const easel = v ? {x: cx + 250, w: 300, h: 220} : {x: cx + 20, w: 300, h: 210};
  const standers = v ? [110, 200, 560, 660, 770] : [330, 450, 1150, 1270, 1390];
  const meRug = v ? {x: 330} : {x: 760};
  const team = v ? {x: 1010} : {x: 1620};

  // squid: news card and the price chart
  const card = v ? {x: cx, y: cy - 100, w: 720, h: 420} : {x: 480, y: cy + 50, w: 560, h: 560};
  const chart = v ? {x: 130, y: cy + 520, w: 820, h: 300} : {x: 960, y: cy + 300, w: 800, h: 560};

  // stat: two bars
  const bars = v ? {base: cy + 520, x0: cx - 260, x1: cx + 80, bw: 200, max: 760} : {base: cy + 330, x0: cx - 300, x1: cx + 40, bw: 220, max: 560};

  // libra: card and the valuation chart
  const lcard = v ? {x: cx, y: cy - 100, w: 720, h: 420} : {x: 480, y: cy + 50, w: 560, h: 560};
  const lchart = v ? {x: 130, y: cy + 520, w: 820, h: 300} : {x: 960, y: cy + 300, w: 800, h: 540};

  // degen: the slot machine
  const slot = v ? {x: cx - 40, base: cy + 420, w: 620, h: 620} : {x: cx + 140, base: cy + 330, w: 600, h: 600};

  // close: the rug, corner lifting
  const crug = v ? {x: 60, w: 960, floor: cy + 360} : {x: 260, w: 1400, floor: cy + 300};
  const signs = v ? [cx - 300, cx, cx + 300].map((x) => ({x, y: cy - 180})) : [cx - 360, cx, cx + 360].map((x) => ({x, y: cy - 60}));

  return {
    W, H, v, cx, cy, r, kickerY, head,
    bub, floor0, me0,
    tS, tTop, tW, tBase, tDot, t1S, t1Top, subS, subTop,
    board, pool, sign, queue,
    floor, rug, easel, standers, meRug, team,
    card, chart,
    bars,
    lcard, lchart,
    slot,
    crug, signs,
    ...endGeo(W, H, v),
  };
};
export type Geo = ReturnType<typeof geo>;
