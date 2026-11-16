import React from 'react';
import {type Beat} from '../companion/Companion';
import {useLayout} from '../notebook/Notebook';
import {endBeats, EndCard, EpisodeRunner, type SceneDef} from '../notebook/runner';
import {geo, S, seatAt, T, type Geo} from './geo';
import {AuctionScene, BlockScene, busFull, CloseScene, LayerTwoScene, OpenScene, popAt, SpikesScene, TitleScene} from './scenes';

// FILE 020 (中文) · Gas 费：为什么转账要花钱
import './cjk-display.css';
import '@fontsource/zcool-kuaile/400.css';
import '@fontsource/noto-sans-sc/500.css';
import {continueRender, delayRender} from 'remotion';
import {ZH_GLYPHS} from './glyphs';

export const EP20ZH_TOTAL = T.TOTAL;
const {w, ow, cw} = T;

const End: React.FC<{g: Geo}> = ({g}) => <EndCard W={g.W} H={g.H} v={g.v} at={T.END_AT} />;

const SCENES: SceneDef<Geo>[] = [
  {key: 'open', from: S.open, ground: 'paper', label: '手续费', C: OpenScene, floor: (g) => g.ground0},
  {key: 'title', from: S.title, ground: 'paper', label: 'file 020', C: TitleScene},
  {key: 'block', from: S.block, ground: 'ink', label: '一个区块', C: BlockScene},
  {key: 'auction', from: S.auction, ground: 'paper', label: '拍卖', C: AuctionScene, floor: (g) => g.aGround},
  {key: 'spikes', from: S.spikes, ground: 'ink', label: '大堵车', C: SpikesScene},
  {key: 'l2', from: S.l2, ground: 'paper', label: '二层网络', C: LayerTwoScene},
  {key: 'close', from: S.close, ground: 'ink', label: '你在出价', C: CloseScene, floor: (g) => g.ground9},
  {key: 'end', from: S.end, ground: 'paper', label: '片尾', C: End},
];

export const buildBeats = (g: Geo): Beat[] => {
  const b: Beat[] = [];
  const r = g.r;
  const last = () => b[b.length - 1];
  const hold = (at: number, extra: Partial<Beat> = {}) => {
    const l = last();
    b.push({at, x: l.x, y: l.y, r: l.r, path: 'cut', ...extra});
  };

  // cold open: drops in behind the parcel, the fee lands, the gavel falls
  const gy0 = g.ground0 - r;
  const signY = g.ground0 - 440 * g.booth.s;
  b.push({at: 0, x: g.me0.x, y: -140, r, plain: true});
  b.push({at: 6, x: g.me0.x, y: gy0, r, path: 'drop', plain: true});
  hold(16, {closed: true});
  hold(ow('paid') - 2, {mood: 'curious', blink: true, look: {x: g.parcel.x, y: g.ground0 - 120}});
  hold(ow('fees') - 2, {look: {x: g.booth.x, y: signY - 40}});
  b.push({at: ow('sending') - 2, x: g.me0.x, y: gy0, r, path: 'hop', hop: 70, dur: 14, mood: 'surprised', look: 'camera'});
  hold(ow('bank') - 2, {mood: 'skeptical', look: 'camera'});
  hold(ow('losing') - 2, {mood: 'worried', look: {x: g.booth.x, y: signY - 60}});
  b.push({at: ow('auction') + 2, x: g.me0.x, y: gy0, r, path: 'hop', hop: 26, dur: 10, mood: 'surprised', look: 'camera'});

  // title: the dot after GAS FEES
  b.push({at: T.TITLE_AT + 16, x: g.tDot.x, y: g.tDot.y, r: g.tDot.r, mood: 'happy', arc: 0.3, dur: 22, look: 'camera'});
  hold(T.TITLE_AT + 62, {mood: 'curious'});

  // the block: waits beside the bus, then boards one seat
  const B = g.bus;
  const seat = seatAt(B, g.mySeat);
  const wait = g.v ? {x: B.x + B.w / 2 - 90, y: B.y - B.h / 2 - r - 6} : {x: B.x - B.w / 2 - r - 30, y: B.y + B.h / 2 - r + 30};
  b.push({at: S.block + 10, x: wait.x, y: wait.y, r, mood: 'curious', dur: 22, look: {x: g.photo.x, y: g.photo.y}});
  hold(w('block') - 2, {look: {x: B.x, y: B.y}});
  hold(w('twelve') - 2, {mood: 'focused', look: {x: g.clock.x, y: g.clock.y}});
  hold(w('room') - 2, {mood: 'worried', look: {x: B.x, y: B.y}});
  b.push({at: w('transaction') - 6, x: seat.x, y: seat.y, r: Math.min(r, seat.sw * 0.38), path: 'hop', hop: 160, dur: 18, mood: 'excited', look: 'camera'});
  hold(w('twenty-one') - 2, {mood: 'happy', look: 'camera', blink: true});

  // the auction: queues last with a tiny paddle, bounces off the closed door
  const A = g.abus;
  const qy = g.aGround - r;
  const me = g.queue[5];
  b.push({at: S.auction + 10, x: me, y: qy, r, mood: 'curious', dur: 22, look: {x: A.x, y: A.y}});
  hold(w('bid') - 2, {mood: 'excited', look: 'camera'});
  hold(w('highest') - 2, {mood: 'curious', look: {x: A.x, y: A.y}});
  hold(w('low') - 2, {mood: 'worried', look: 'camera'});
  const doorX = g.v ? A.x + A.w / 2 - 60 : A.x + A.w / 2 + r + 6;
  const doorY = g.v ? A.y + A.h / 2 + r + 50 : qy;
  b.push({at: Math.max(busFull(), w('wait') - 12), x: doorX, y: doorY, r, path: 'hop', hop: 120, dur: 14, mood: 'excited', look: {x: A.x, y: A.y}});
  b.push({at: w('wait') + 4, x: doorX + (g.v ? -10 : 150), y: g.v ? qy : qy, r, path: 'hop', hop: 90, dur: 12, mood: 'surprised', look: 'camera'});
  hold(w('next') + 2, {mood: 'sleepy', look: {x: -200, y: A.y}});

  // real jams: perched on the first card, then inflates like a bubble and pops
  const K = g.card;
  const top1 = {x: g.c1.x + K.w / 2 - 90, y: g.c1.y - K.h / 2 - r + 4};
  const top2 = {x: g.c2.x - K.w / 2 + 90, y: g.c2.y - K.h / 2 - r + 4};
  b.push({at: S.spikes + 10, x: top1.x, y: top1.y, r, mood: 'curious', dur: 22, look: {x: g.c1.x, y: g.c1.y}});
  hold(w('jammed') - 2, {mood: 'worried', look: 'camera'});
  hold(w('stuck') - 2, {mood: 'sleepy', look: {x: g.c1.x, y: g.c1.y + 100}});
  b.push({at: w('night') - 2, x: top2.x, y: top2.y, r, mood: 'curious', dur: 20, look: {x: g.c2.x, y: g.c2.y}});
  const Bl = g.balloon;
  b.push({at: w('crowded') - 4, x: Bl.x, y: Bl.y, r: r * 1.15, mood: 'surprised', dur: 16, look: 'camera'});
  b.push({at: w('spent') - 2, x: Bl.x, y: Bl.y, r: r * 1.7, path: 'linear', dur: w('fifty') - w('spent'), mood: 'excited', look: 'camera'});
  b.push({at: w('fifty') - 2, x: Bl.x, y: Bl.y, r: r * 2.4, path: 'linear', dur: w('gas') - w('fifty'), mood: 'worried', look: 'camera'});
  b.push({at: w('gas') - 2, x: Bl.x, y: Bl.y, r: r * 3.3, path: 'linear', dur: 8, mood: 'surprised', look: 'camera'});
  b.push({at: popAt(), x: Bl.x, y: Bl.y, r: r * 0.55, path: 'cut', mood: 'surprised', look: 'camera'});
  b.push({at: popAt() + 4, x: Bl.x, y: Bl.y + (g.v ? 220 : 200), r, path: 'drop', mood: 'surprised', look: 'camera'});
  hold(popAt() + 18, {mood: 'skeptical', blink: true});

  // layer two: rides the crate, then tumbles down the fee stairs
  const C = g.crate;
  const St = g.stairs;
  const step = (k: number) => ({x: St.x + k * St.sw + St.sw / 2, y: St.y + k * St.sh - r});
  b.push({at: S.l2 + 10, x: C.x + C.w / 2 - 70, y: C.y - C.h / 2 - r, r, mood: 'curious', dur: 22, look: {x: C.x, y: C.y}});
  hold(w('bundle') - 2, {mood: 'focused', look: {x: C.x, y: C.y}});
  b.push({at: w('post') - 4, x: step(0).x, y: step(0).y, r, path: 'hop', hop: 160, dur: 18, mood: 'happy', look: 'camera'});
  const t0 = w('upgrade');
  const t3 = w('few') - 10;
  const gap = (t3 - t0) / 3;
  [1, 2, 3].forEach((k) => {
    b.push({at: Math.round(t0 + (k - 1) * gap), x: step(k).x, y: step(k).y, r, path: 'hop', hop: 34, dur: 11, mood: k === 2 ? 'worried' : 'surprised', look: k === 2 ? 'camera' : 'ahead'});
  });
  hold(w('few') - 2, {mood: 'delight', look: 'camera'});
  hold(w('cents') + 10, {mood: 'happy', look: 'camera', blink: true});

  // closing: stands with the YOU paddle, watches the road gauge
  const M = g.me;
  b.push({at: S.close + 10, x: M.x, y: M.y, r: M.r, mood: 'curious', dur: 22, look: 'camera'});
  hold(cw('tax') - 2, {mood: 'skeptical'});
  hold(cw('auction') - 2, {mood: 'curious', look: 'camera'});
  b.push({at: cw('send') - 4, x: M.x, y: M.y, r: M.r, path: 'hop', hop: 50, dur: 12, mood: 'excited', look: 'camera'});
  hold(cw('bidders') - 2, {mood: 'delight', look: 'camera'});
  hold(cw('busy') - 2, {mood: 'focused', look: {x: g.gauge.x, y: g.gauge.y - g.gauge.r * 0.5}});
  hold(cw('road') + 4, {mood: 'worried'});
  hold(cw('ride') + 18, {mood: 'happy', look: 'camera', blink: true});
  hold(T.END_AT - 30, {mood: 'delight', look: 'camera'});

  b.push(...endBeats(g.W, g.H, g.v, T.END_AT));
  return b.sort((a, c) => a.at - c.at);
};

// every Chinese glyph on screen, so the lazily split CJK fonts are fully in before frame 0
const ZH = ZH_GLYPHS;
const useZhFonts = () => {
  const [handle] = React.useState(() => delayRender('Chinese fonts'));
  React.useEffect(() => {
    const fams = ['"HC Display CJK"', '"ZCOOL KuaiLe"', '"Noto Sans SC"'];
    Promise.all(fams.map((f) => document.fonts.load(`40px ${f}`, ZH)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

export const Ep20zh: React.FC = () => {
  useZhFonts();
  const {W, H, vertical} = useLayout();
  const g = React.useMemo(() => geo(W, H, vertical), [W, H, vertical]);
  const beats = React.useMemo(() => buildBeats(g), [g]);
  return (
    <EpisodeRunner
      scenes={SCENES}
      g={g}
      beats={beats}
      total={T.TOTAL}
      file="020"
      seed={1021}
      voice={[
        {src: 'vo/ep20zh-open-master.mp3', at: T.OPEN_AT},
        {src: 'vo/ep20zh-body-master.mp3', at: T.BODY_AT},
        {src: 'vo/ep20zh-close-master.mp3', at: T.CLOSE_AT},
      ]}
    />
  );
};
