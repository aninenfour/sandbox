import React from 'react';
import {type Beat} from '../companion/Companion';
import {useFrame} from '../design/clock';
import {useLayout} from '../notebook/Notebook';
import {endBeats, EndCard, EpisodeRunner, type SceneDef} from '../notebook/runner';
import {geo, S, T, type Geo} from './geo';
import {AddressScene, BagScene, ConcScene, OpenScene, seaY, ShrimpScene, tiles, TitleScene, WhaleScene, chartXY} from './scenes';

// FILE 015 · Whale, Shrimp, Bagholder

export const EP15_TOTAL = T.TOTAL;
const {w, ow} = T;

const End: React.FC<{g: Geo}> = ({g}) => <EndCard W={g.W} H={g.H} v={g.v} at={T.END_AT} />;

const SCENES: SceneDef<Geo>[] = [
  {key: 'open', from: S.open, ground: 'paper', label: 'field guide', C: OpenScene},
  {key: 'title', from: S.title, ground: 'paper', label: 'file 015', C: TitleScene},
  {key: 'whale', from: S.whale, ground: 'ink', label: 'whale', C: WhaleScene},
  {key: 'shrimp', from: S.shrimp, ground: 'ink', label: 'shrimp', C: ShrimpScene},
  {key: 'bag', from: S.bag, ground: 'paper', label: 'bagholder', C: BagScene},
  {key: 'address', from: S.address, ground: 'ink', label: 'addresses', C: AddressScene},
  {key: 'conc', from: S.conc, ground: 'paper', label: 'concentration', C: ConcScene},
  {key: 'end', from: S.end, ground: 'paper', label: 'end card', C: End},
];

const buildBeats = (g: Geo, f: number): Beat[] => {
  const b: Beat[] = [];
  const r = g.r;
  const last = () => b[b.length - 1];
  const hold = (at: number, extra: Partial<Beat> = {}) => {
    const l = last();
    b.push({at, x: l.x, y: l.y, r: l.r, path: 'cut', ...extra});
  };

  // cold open: hops card to card as each specimen appears, then lands as "you?"
  const above = (i: number) => ({x: g.cards[i].x + (g.v ? g.cards[i].w / 2 - 40 : 0), y: g.cards[i].y - g.cards[i].h / 2 - r - 4});
  b.push({at: 0, x: above(0).x, y: -140, r, plain: true});
  b.push({at: 4, x: above(0).x, y: above(0).y, r, path: 'drop', plain: true});
  hold(16, {closed: true});
  hold(ow('whales') - 8, {mood: 'curious', blink: true, look: {x: g.cards[0].x, y: g.cards[0].y}});
  b.push({at: ow('shrimp') - 10, x: above(1).x, y: above(1).y, r, path: 'hop', hop: 90, mood: 'curious', look: {x: g.cards[1].x, y: g.cards[1].y}});
  b.push({at: ow('bagholders') - 10, x: above(2).x, y: above(2).y, r, path: 'hop', hop: 90, look: {x: g.cards[2].x, y: g.cards[2].y}});
  b.push({at: ow('well') - 2, x: g.youDot.x, y: g.youDot.y, r, mood: 'surprised', dur: 18, arc: 0.3, look: 'camera', blink: true});
  hold(ow('somewhere') - 2, {mood: 'happy', look: 'camera'});

  // title
  b.push({at: T.TITLE_AT + 16, x: g.tDot.x, y: g.tDot.y, r: g.tDot.r, mood: 'happy', arc: 0.3, dur: 22, look: 'camera'});
  hold(T.TITLE_AT + 62, {mood: 'delight'});

  // whale: floats on the price, gets lifted then dropped by the wave
  const t0 = S.whale + 10;
  b.push({at: t0, x: g.rideX, y: seaY(g.rideX, t0 + 20, g) - r, r, mood: 'curious', dur: 20, look: {x: g.cx - 200, y: g.whaleY}});
  for (let t = t0 + 22; t < S.shrimp - 2; t += 3) {
    b.push({at: t, x: g.rideX, y: seaY(g.rideX, t + 3, g) - r - 2, r, path: 'linear', dur: 3, mood: t > w('sells') + 6 ? 'worried' : t > w('own') - 6 ? 'surprised' : undefined, look: t > w('sells') ? 'camera' : {x: g.whaleX, y: g.whaleY}});
  }

  // shrimp: sits in the middle of the swarm
  b.push({at: S.shrimp + 8, x: g.swarmDot.x, y: g.swarmDot.y, r, mood: 'curious', dur: 22, arc: 0.3, look: 'camera'});
  hold(w('most') - 2, {mood: 'delight'});

  // bagholder: watches from the side of the chart
  b.push({at: S.bag + 10, x: g.bagDot.x, y: g.bagDot.y, r, mood: 'curious', dur: 22, look: chartXY(g, 0.46, 0.95)});
  hold(w('top'), {mood: 'skeptical', look: chartXY(g, 0.46, 0.95)});
  hold(w('still'), {mood: 'worried', look: chartXY(g, 0.8, 0.3)});
  hold(w('back') - 6, {mood: 'skeptical', look: 'camera'});

  // address isn't a person
  const ad = g.v ? {x: g.cx - 360, y: g.whaleBig.y - 200} : {x: g.whaleBig.x - 520, y: g.whaleBig.y - 40};
  b.push({at: S.address + 10, x: ad.x, y: ad.y, r, mood: 'curious', dur: 22, look: g.whaleBig});
  hold(w('person') - 2, {mood: 'surprised', blink: true, look: {x: g.cx, y: (g.crowd.y0 + g.crowd.y1) / 2}});
  hold(w('users') - 2, {mood: 'happy', look: 'camera'});

  // concentration: sits on top of "everyone else"
  const {sx, sw} = tiles(g);
  const top = {x: sx + sw - r, y: g.tree.y - g.tree.h / 2 - r - 40};
  b.push({at: S.conc + 12, x: top.x, y: top.y, r, mood: 'curious', dur: 22, look: {x: g.tree.x - g.tree.w / 4, y: g.tree.y}});
  hold(w('selling'), {mood: 'surprised', blink: true});
  hold(w('sink'), {mood: 'worried', look: {x: g.mini.x, y: g.mini.y}});
  hold(w('check'), {mood: 'focused', look: 'camera'});
  hold(w('friendly') - 2, {mood: 'skeptical', look: 'camera'});

  b.push(...endBeats(g.W, g.H, g.v, T.END_AT));
  return b;
};

export const Ep15: React.FC = () => {
  const f = useFrame();
  const {W, H, vertical} = useLayout();
  const g = React.useMemo(() => geo(W, H, vertical), [W, H, vertical]);
  const beats = buildBeats(g, f);
  return (
    <EpisodeRunner
      scenes={SCENES}
      g={g}
      beats={beats}
      total={T.TOTAL}
      file="015"
      seed={1015}
      voice={[
        {src: 'vo/ep15-open-master.mp3', at: T.OPEN_AT},
        {src: 'vo/ep15-body-master.mp3', at: T.BODY_AT},
      ]}
    />
  );
};
