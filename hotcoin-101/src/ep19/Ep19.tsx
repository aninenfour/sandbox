import React from 'react';
import {type Beat} from '../companion/Companion';
import {useLayout} from '../notebook/Notebook';
import {endBeats, EndCard, EpisodeRunner, type SceneDef} from '../notebook/runner';
import {geo, S, T, type Geo} from './geo';
import {ClubScene, CloseScene, DealScene, LineScene, OpenScene, STOPS, TitleScene, TodayScene} from './scenes';

// FILE 019 · A Market That Started Under a Tree

export const EP19_TOTAL = T.TOTAL;
const {w, ow, cw} = T;

const End: React.FC<{g: Geo}> = ({g}) => <EndCard W={g.W} H={g.H} v={g.v} at={T.END_AT} />;

const SCENES: SceneDef<Geo>[] = [
  {key: 'open', from: S.open, ground: 'paper', label: 'the tree', C: OpenScene},
  {key: 'title', from: S.title, ground: 'paper', label: 'file 019', C: TitleScene},
  {key: 'deal', from: S.deal, ground: 'ink', label: 'the agreement', C: DealScene},
  {key: 'club', from: S.club, ground: 'paper', label: 'a club', C: ClubScene},
  {key: 'line', from: S.line, ground: 'ink', label: '1792 to 1975', C: LineScene, floor: (g) => g.tl.y},
  {key: 'today', from: S.today, ground: 'paper', label: 'today', C: TodayScene, floor: (g) => g.racks.base},
  {key: 'close', from: S.close, ground: 'ink', label: 'the agreement', C: CloseScene},
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

  // cold open: lands on the canopy, watches the brokers gather
  const t = g.tree;
  const top = {x: t.x + 40 * t.s, y: t.base - 515 * t.s - r + 6};
  b.push({at: 0, x: top.x, y: -140, r, plain: true});
  b.push({at: 6, x: top.x, y: top.y, r, path: 'drop', plain: true});
  hold(18, {closed: true});
  hold(ow('seventeen') - 2, {mood: 'curious', blink: true, look: 'camera'});
  hold(ow('twenty-four'), {look: {x: g.crowd.x0 + 100, y: g.crowd.y - 40}});
  hold(ow('tree') - 2, {look: {x: g.crowd.x1 - 100, y: g.crowd.y - 40}});
  hold(ow('accidentally') - 2, {mood: 'surprised', look: 'camera'});
  hold(ow('Wall'), {mood: 'happy', look: 'camera'});

  // title
  b.push({at: T.TITLE_AT + 16, x: g.tDot.x, y: g.tDot.y, r: g.tDot.r, mood: 'happy', arc: 0.3, dur: 22, look: 'camera'});
  hold(T.TITLE_AT + 62, {mood: 'curious'});

  // the agreement: perched on the parchment corner
  const d = g.doc;
  b.push({at: S.deal + 10, x: d.x + d.w / 2 - 70, y: d.y - d.h / 2 - r - 2, r, mood: 'curious', dur: 22, look: {x: d.x, y: d.y - d.h / 2 + 80}});
  hold(w('signed') - 2, {look: {x: d.x, y: d.y + d.h / 2 - 120}});
  hold(w('deal', 2) - 4, {mood: 'focused', look: {x: d.x - d.w * 0.23, y: d.y - d.h * 0.08}});
  hold(w('nobody') - 4, {look: {x: d.x + d.w * 0.23, y: d.y - d.h * 0.08}});
  hold(w('quarter') - 2, {mood: 'skeptical', look: 'camera'});

  // the club: stands outside the gate
  const R = g.ring;
  const gx = R.x + R.r;
  b.push({at: S.club + 10, x: gx + (g.v ? 160 : 180), y: R.y + (g.v ? 40 : 30), r, mood: 'curious', dur: 22, look: {x: R.x, y: R.y}});
  hold(w('door') - 2, {mood: 'skeptical', look: {x: gx, y: R.y}});
  hold(w('price') - 2, {mood: 'worried', look: {x: gx, y: R.y - R.r * 0.6}});

  // the timeline: hops stop to stop
  const L = g.tl;
  const stops = STOPS();
  b.push({at: S.line + 10, x: L.xs[0] + (g.v ? 70 : 90), y: L.y - r - 4, r, mood: 'curious', dur: 20, look: {x: L.xs[1], y: L.y}});
  const hopTo = (i: number) => b.push({at: stops[i].at - 2, x: L.xs[i] + (g.v ? 70 : 90), y: L.y - r - 4, r, path: 'hop', hop: 90, dur: 14, mood: i === 3 ? 'surprised' : 'curious', look: 'ahead'});
  hopTo(1);
  hopTo(2);
  hold(w('centuries') - 2, {mood: 'surprised', look: 'camera', blink: true});
  hopTo(3);
  hold(w('cheaper') + 4, {mood: 'happy', look: 'camera'});

  // today: between the ghost tree and the racks
  const mid = (g.ghost.x + (g.racks.x - 170 * g.racks.s)) / 2;
  b.push({at: S.today + 10, x: mid, y: g.racks.base - r, r, mood: 'curious', dur: 22, look: {x: g.racks.x, y: g.racks.base - 200}});
  hold(w('gone') - 2, {mood: 'sleepy', look: {x: g.ghost.x, y: g.ghost.base - 300}});
  hold(w('idea') - 2, {mood: 'happy', look: 'camera', blink: true});

  // closing: walks in through the gate and stays for the beat
  b.push({at: S.close + 10, x: gx + (g.v ? 90 : 120), y: R.y, r, mood: 'curious', dur: 20, look: {x: gx, y: R.y}});
  b.push({at: cw('who') - 4, x: R.x, y: R.y, r, mood: 'happy', dur: 22, arc: 0.1, look: 'camera'});
  hold(cw('price'), {mood: 'delight', look: 'camera'});
  hold(T.END_AT - 30, {mood: 'happy', look: 'camera', blink: true});

  b.push(...endBeats(g.W, g.H, g.v, T.END_AT));
  return b.sort((a, c) => a.at - c.at);
};

export const Ep19: React.FC = () => {
  const {W, H, vertical} = useLayout();
  const g = React.useMemo(() => geo(W, H, vertical), [W, H, vertical]);
  const beats = React.useMemo(() => buildBeats(g), [g]);
  return (
    <EpisodeRunner
      scenes={SCENES}
      g={g}
      beats={beats}
      total={T.TOTAL}
      file="019"
      seed={1019}
      voice={[
        {src: 'vo/ep19-open-master.mp3', at: T.OPEN_AT},
        {src: 'vo/ep19-body-master.mp3', at: T.BODY_AT},
        {src: 'vo/ep19-close-master.mp3', at: T.CLOSE_AT},
      ]}
    />
  );
};
