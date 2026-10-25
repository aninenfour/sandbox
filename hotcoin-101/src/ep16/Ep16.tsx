import React from 'react';
import {type Beat} from '../companion/Companion';
import {useLayout} from '../notebook/Notebook';
import {endBeats, EndCard, EpisodeRunner, type SceneDef} from '../notebook/runner';
import {geo, rowY, S, T, type Geo} from './geo';
import {BookScene, crashAt, crashProg, crashXY, CrashScene, DeepScene, dtLadder, dtY, lensAt, OpenScene, openPos, TakeScene, thinPos, TitleScene, VanishScene, bidFloorY} from './scenes';

// FILE 016 · Liquidity: Noticed Only When It Is Gone

export const EP16_TOTAL = T.TOTAL;
const {w, ow} = T;

const End: React.FC<{g: Geo}> = ({g}) => <EndCard W={g.W} H={g.H} v={g.v} at={T.END_AT} />;

const SCENES: SceneDef<Geo>[] = [
  {key: 'open', from: S.open, ground: 'paper', label: 'one sell order', C: OpenScene},
  {key: 'title', from: S.title, ground: 'paper', label: 'file 016', C: TitleScene},
  {key: 'book', from: S.book, ground: 'ink', label: 'order book', C: BookScene},
  {key: 'deep', from: S.deep, ground: 'paper', label: 'slippage', C: DeepScene},
  {key: 'vanish', from: S.vanish, ground: 'ink', label: 'just orders', C: VanishScene},
  {key: 'crash', from: S.crash, ground: 'paper', label: 'flash crash', C: CrashScene},
  {key: 'take', from: S.take, ground: 'ink', label: 'price vs fill', C: TakeScene},
  {key: 'end', from: S.end, ground: 'paper', label: 'end card', C: End},
];

export const buildBeats = (g: Geo): Beat[] => {
  const b: Beat[] = [];
  const r = g.r;
  const last = () => b[b.length - 1];
  const hold = (at: number, extra: Partial<Beat> = {}) => {
    const l = last();
    b.push({at, x: l.x, y: l.y, r: l.r, path: 'cut', ...extra});
  };

  // cold open: lands on the price screen, presses sell, watches the order walk down the buyers
  const c = g.card;
  const perch = {x: c.x + c.w / 2 - 80, y: c.y - c.h / 2 - r - 2};
  const L = g.openL;
  b.push({at: 0, x: perch.x, y: -140, r, plain: true});
  b.push({at: 4, x: perch.x, y: perch.y, r, path: 'drop', plain: true});
  hold(14, {closed: true});
  hold(Math.max(20, ow('screen') + 4), {mood: 'curious', blink: true, look: {x: c.x - c.w / 4, y: c.y - c.h / 5}});
  b.push({at: ow('sell') - 14, x: g.btn.x + g.btn.w / 2 - 70, y: g.btn.y - g.btn.h / 2 - r + 4, r, path: 'hop', hop: 70, dur: 12, mood: 'focused', look: {x: g.btn.x, y: g.btn.y}});
  hold(ow('sell') + 8, {mood: 'curious', look: {x: L.bx + 40, y: rowY(L, 2)}});
  for (let t = ow('sell') + 12; t < ow('ninety-four') - 4; t += 6) hold(t, {look: {x: L.bx - 30, y: rowY(L, Math.min(openPos(t + 4), 4))}});
  hold(ow('ninety-four') - 2, {mood: 'surprised', blink: true, look: 'camera'});
  hold(ow('Nobody') - 2, {mood: 'skeptical', look: 'camera'});
  hold(ow('ran') - 2, {mood: 'worried', look: {x: L.bx + 60, y: rowY(L, 1)}});

  // title
  b.push({at: T.TITLE_AT + 16, x: g.tDot.x, y: g.tDot.y, r: g.tDot.r, mood: 'happy', arc: 0.3, dur: 22, look: 'camera'});
  hold(T.TITLE_AT + 62, {mood: 'delight'});

  // order book: watches each side fill in
  const B = g.book;
  const bookSpot = g.v ? {x: g.cx + 330, y: B.top - 90} : {x: B.px - 90, y: rowY(B, 5)};
  b.push({at: S.book + 10, x: bookSpot.x, y: bookSpot.y, r, mood: 'curious', dur: 22, look: {x: B.bx + B.max / 2, y: rowY(B, 5)}});
  hold(w('without') - 2, {look: {x: B.bx + 0.4 * B.max, y: rowY(B, 6)}});
  hold(w('price') + 6, {mood: 'happy', look: 'camera'});
  hold(w('buyers') - 2, {mood: 'curious', look: {x: B.bx + B.max / 2, y: rowY(B, 8)}});
  hold(w('sellers') - 2, {look: {x: B.bx + B.max / 2, y: rowY(B, 2)}});
  hold(w('spread') - 2, {mood: 'delight', blink: true, look: {x: B.bx + B.max / 2, y: rowY(B, 5)}});

  // deep vs thin: rides the thin book's price down
  const Lt = dtLadder(g, 1);
  const rideX = Lt.bx + Lt.max * (g.v ? 0.64 : 0.55);
  b.push({at: S.deep + 10, x: rideX, y: dtY(g, 0), r, mood: 'curious', dur: 22, look: {x: dtLadder(g, 0).bx + 100, y: dtY(g, 0)}});
  hold(w('Thin') - 4, {look: {x: Lt.bx, y: dtY(g, 0)}});
  for (let t = w('eaten') - 2; t <= w('slides') + 16; t += 3) {
    b.push({at: t, x: rideX, y: dtY(g, thinPos(t + 3)), r, path: 'linear', dur: 3, mood: t > w('slides') - 4 ? 'worried' : 'surprised', look: {x: Lt.bx, y: dtY(g, thinPos(t + 3))}});
  }
  hold(w('slippage') - 2, {mood: 'skeptical', look: 'camera'});

  // just orders: sits on the best bid, falls through when the book empties
  const V = g.book;
  const seat = {x: V.bx + 0.64 * V.max, y: rowY(V, 5)};
  b.push({at: S.vanish + 10, x: seat.x, y: seat.y, r, mood: 'curious', dur: 22, look: {x: V.bx + V.max / 2, y: rowY(V, 2)}});
  hold(w('cancelled') - 2, {mood: 'surprised', blink: true});
  hold(w('scary') - 2, {mood: 'worried', look: 'camera'});
  b.push({at: w('vanish') + 18, x: seat.x, y: bidFloorY(g) - r, r, path: 'drop', dur: 14, mood: 'worried', look: 'camera'});
  hold(w('once') - 2, {mood: 'worried', blink: true, look: 'camera'});

  // flash crash: rides the line down to a cent and back
  const start = crashXY(g, 0, 0.82);
  b.push({at: S.crash + 6, x: start.x, y: start.y - r - 6, r, mood: 'curious', dur: 18, look: 'ahead'});
  for (let t = S.crash + 26; t < S.take - 2; t += 3) {
    const [px, val] = crashAt(crashProg(t + 3));
    const q = crashXY(g, px, val);
    b.push({at: t, x: q.x, y: q.y - r - 6, r, path: 'linear', dur: 3, mood: t > w('cent') + 20 ? 'happy' : t > w('Accenture') - 2 ? 'surprised' : 'curious', look: t > w('cent') - 6 && t < w('cent') + 20 ? 'camera' : 'ahead'});
  }

  // takeaway: becomes the lens over the depth, then reads the two cards
  const lens = lensAt(g);
  const [q, fl] = g.cards;
  b.push({at: w('depth') - 8, x: lens.x, y: lens.y, r, mood: 'focused', dur: 16, look: {x: lens.x + 40, y: lens.y + 30}});
  hold(w('quote') - 4, {mood: 'curious', look: {x: q.x, y: q.y}});
  hold(w('fill', 2) - 4, {look: {x: fl.x, y: fl.y}});
  hold(w('get', 3) - 2, {mood: 'happy', look: 'camera'});

  b.push(...endBeats(g.W, g.H, g.v, T.END_AT));
  return b;
};

export const Ep16: React.FC = () => {
  const {W, H, vertical} = useLayout();
  const g = React.useMemo(() => geo(W, H, vertical), [W, H, vertical]);
  const beats = React.useMemo(() => buildBeats(g), [g]);
  return (
    <EpisodeRunner
      scenes={SCENES}
      g={g}
      beats={beats}
      total={T.TOTAL}
      file="016"
      seed={1016}
      voice={[
        {src: 'vo/ep16-open-master.mp3', at: T.OPEN_AT},
        {src: 'vo/ep16-body-master.mp3', at: T.BODY_AT},
      ]}
    />
  );
};
