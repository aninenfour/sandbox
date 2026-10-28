import React from 'react';
import {type Beat} from '../companion/Companion';
import {useLayout} from '../notebook/Notebook';
import {endBeats, EndCard, EpisodeRunner, type SceneDef} from '../notebook/runner';
import {geo, S, T, type Geo} from './geo';
import {BarScene, coinStart, COUPON_H, couponAt, LoanScene, OpenScene, OppScene, TenScene, TitleScene, y22Prog, Y22Scene, y22XY} from './scenes';

// FILE 017 · Bonds, or Lending to a Government

export const EP17_TOTAL = T.TOTAL;
const {w, ow} = T;

const End: React.FC<{g: Geo}> = ({g}) => <EndCard W={g.W} H={g.H} v={g.v} at={T.END_AT} />;

const SCENES: SceneDef<Geo>[] = [
  {key: 'open', from: S.open, ground: 'paper', label: 'boring', C: OpenScene},
  {key: 'title', from: S.title, ground: 'paper', label: 'file 017', C: TitleScene},
  {key: 'loan', from: S.loan, ground: 'ink', label: 'a loan', C: LoanScene},
  {key: 'opp', from: S.opp, ground: 'paper', label: 'price vs rate', C: OppScene},
  {key: 'ten', from: S.ten, ground: 'ink', label: 'the ten-year', C: TenScene},
  {key: 'y22', from: S.y22, ground: 'paper', label: '2022', C: Y22Scene},
  {key: 'bar', from: S.bar, ground: 'ink', label: 'the bar', C: BarScene, floor: (g) => g.stand.floor},
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

  // cold open: asleep on the certificate, wakes when the strings appear
  const c = g.cert;
  const perch = {x: c.x + c.w / 2 - 110, y: c.y - c.h / 2 - r - 2};
  b.push({at: 0, x: perch.x, y: -140, r, plain: true});
  b.push({at: 4, x: perch.x, y: perch.y, r, path: 'drop', plain: true});
  hold(16, {closed: true, mood: 'sleepy'});
  hold(ow('somehow') - 4, {mood: 'surprised', blink: true, look: g.items[0]});
  hold(ow('everything'), {mood: 'curious', look: g.items[1]});
  hold(ow('crypto') - 2, {mood: 'skeptical', look: g.items[3]});

  // title
  b.push({at: T.TITLE_AT + 16, x: g.tDot.x, y: g.tDot.y, r: g.tDot.r, mood: 'happy', arc: 0.3, dur: 22, look: 'camera'});
  hold(T.TITLE_AT + 62, {mood: 'delight'});

  // the loan: bounces along the coupons, rides the principal back up
  const fl = g.flow;
  const onCoupon = (i: number) => ({x: g.slotX(i), y: fl.y - 8 - COUPON_H - r - 4});
  b.push({at: S.loan + 10, x: g.slotX(0), y: fl.y - r - 30, r, mood: 'curious', dur: 22, look: {x: g.slotX(0), y: fl.y + 100}});
  for (let i = 1; i <= 10; i++) {
    const p = onCoupon(i);
    b.push({at: couponAt(i) - 2, x: p.x, y: p.y, r, path: 'hop', hop: 46, dur: 9, mood: i > 8 ? 'happy' : 'curious', look: 'ahead'});
  }
  b.push({at: w('back') - 4, x: g.slotX(10), y: fl.y - 8 - fl.up - r - 4, r, mood: 'delight', dur: 14, look: 'camera'});

  // price vs rate: sits on your bond, watches the buyers leave
  const y = g.yours;
  b.push({at: S.opp + 10, x: y.x - y.w / 2 + 80, y: y.y - y.h / 2 - r - 2, r, mood: 'happy', dur: 22, look: {x: y.x, y: y.y}});
  hold(w('fifty') - 4, {mood: 'curious', look: g.fresh});
  hold(w('nobody') - 2, {mood: 'worried', look: {x: g.fresh.x, y: g.buyersY - 60}});
  hold(w('cut') - 2, {mood: 'surprised', blink: true, look: {x: y.x + y.w / 2 - 70, y: y.y - y.h / 2}});
  hold(w('Rates'), {mood: 'focused', look: g.twin});
  hold(w('maths') - 4, {mood: 'skeptical', look: 'camera'});

  // the ten-year: perched on the tile, everyone else watching
  const t = g.tile;
  b.push({at: S.ten + 10, x: t.x - t.w / 2 + 70, y: t.y - t.h / 2 - r - 4, r, mood: 'curious', dur: 22, look: g.watchers[0]});
  hold(w('everyone') - 2, {look: g.watchers[1]});
  hold(w('watches'), {look: g.watchers[3]});
  hold(w('no') - 4, {mood: 'happy', look: 'camera'});

  // 2022: rides the yield up
  const s0 = y22XY(g, 0);
  b.push({at: S.y22 + 8, x: s0.x, y: s0.y - r - 6, r, mood: 'curious', dur: 20, look: 'ahead'});
  for (let k = w('climbed') - 2; k <= w('four') + 4; k += 3) {
    const p = y22XY(g, y22Prog(k + 3));
    b.push({at: k, x: p.x, y: p.y - r - 6, r, path: 'linear', dur: 3, mood: k > w('percent') ? 'surprised' : 'focused', look: 'ahead'});
  }
  hold(w('four') + 6, {mood: 'surprised', look: 'camera', blink: true});

  // the bar: watches bitcoin miss, then clears it
  const st = g.stand;
  const side = {x: st.x + st.span / 2 + (g.v ? 100 : 140), y: st.floor - r};
  b.push({at: S.bar + 8, x: side.x, y: side.y, r, mood: 'curious', dur: 20, look: coinStart(g)});
  hold(w('bitcoin') + 6, {mood: 'surprised', look: {x: st.x - st.span / 2, y: st.floor - g.barH(3.9)}});
  hold(w('thirds') - 4, {mood: 'worried', look: 'camera'});
  hold(w('Safe') - 2, {mood: 'focused', look: {x: st.x, y: st.floor - g.barH(3.9)}});
  b.push({at: w('clear') - 16, x: st.x - st.span / 2 - (g.v ? 110 : 150), y: side.y, r, path: 'hop', hop: g.barH(3.9) + r + 70, dur: 20, mood: 'excited', look: 'ahead'});
  hold(w('clear') + 8, {mood: 'delight', look: 'camera'});

  b.push(...endBeats(g.W, g.H, g.v, T.END_AT));
  return b;
};

export const Ep17: React.FC = () => {
  const {W, H, vertical} = useLayout();
  const g = React.useMemo(() => geo(W, H, vertical), [W, H, vertical]);
  const beats = React.useMemo(() => buildBeats(g), [g]);
  return (
    <EpisodeRunner
      scenes={SCENES}
      g={g}
      beats={beats}
      total={T.TOTAL}
      file="017"
      seed={1017}
      voice={[
        {src: 'vo/ep17-open-master.mp3', at: T.OPEN_AT},
        {src: 'vo/ep17-body-master.mp3', at: T.BODY_AT},
      ]}
    />
  );
};
