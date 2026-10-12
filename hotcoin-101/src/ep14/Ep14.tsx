import React from 'react';
import {type Beat} from '../companion/Companion';
import {useFrame} from '../design/clock';
import {useLayout} from '../notebook/Notebook';
import {endBeats, EndCard, EpisodeRunner, type SceneDef} from '../notebook/runner';
import {panAt} from './art';
import {chartPt, geo, S, T, type Geo} from './geo';
import {ClaimScene, CoatScene, FormulaScene, lastPt, OpenScene, sawAngle, scaleTilt, SVB_PTS, svbProg, SvbScene, TitleScene, tokTop, upTo, UST_PTS, ustProg, VaultScene, lockedCount} from './scenes';

// FILE 014 · Stablecoins, Explained

export const EP14_TOTAL = T.TOTAL;
const {w, ow} = T;

const End: React.FC<{g: Geo}> = ({g}) => <EndCard W={g.W} H={g.H} v={g.v} at={T.END_AT} />;

const SCENES: SceneDef<Geo>[] = [
  {key: 'open', from: S.open, ground: 'paper', label: 'the peg', C: OpenScene},
  {key: 'title', from: S.title, ground: 'paper', label: 'file 014', C: TitleScene},
  {key: 'coat', from: S.coat, ground: 'paper', label: 'cash', C: CoatScene, floor: (g) => g.cFloor},
  {key: 'svb', from: S.svb, ground: 'ink', label: 'usdc 2023', C: SvbScene},
  {key: 'vault', from: S.vault, ground: 'paper', label: 'crypto', C: VaultScene, floor: (g) => g.vFloor},
  {key: 'formula', from: S.formula, ground: 'ink', label: 'formula', C: FormulaScene},
  {key: 'claim', from: S.claim, ground: 'paper', label: 'behind it', C: ClaimScene, floor: (g) => g.clFloor},
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

  // cold open: lands on top of the scale's pivot and watches both pans
  const top = {x: g.pivot.x, y: g.pivot.y - 24 - r};
  b.push({at: 0, x: top.x, y: -140, r, plain: true});
  b.push({at: 6, x: top.x, y: top.y, r, path: 'drop', plain: true});
  hold(18, {closed: true});
  const L = panAt(scaleTilt(f), -1, g.beam, g.hang);
  const R = panAt(scaleTilt(f), 1, g.beam, g.hang);
  hold(ow('promise') - 2, {mood: 'curious', blink: true, look: 'camera'});
  hold(ow('coin') - 4, {look: {x: g.pivot.x + L.x, y: g.pivot.y + L.y}});
  hold(ow('dollar') - 4, {look: {x: g.pivot.x + R.x, y: g.pivot.y + R.y}});
  hold(ow('question') - 2, {mood: 'skeptical', look: 'camera'});

  // title
  b.push({at: T.TITLE_AT + 14, x: g.tDot.x, y: g.tDot.y, r: g.tDot.r, mood: 'happy', arc: 0.3, dur: 22, look: 'camera'});
  hold(T.TITLE_AT + 62, {mood: 'delight'});

  // coat check: watches from on top of the safe
  const onSafe = {x: g.safe.x, y: g.cFloor - g.safe.s - r};
  b.push({at: S.coat + 10, x: onSafe.x, y: onSafe.y, r, mood: 'curious', dur: 24, arc: 0.3, look: {x: g.hand.x, y: g.hand.y}});
  hold(w('dollar', 1), {look: {x: g.window.x, y: g.window.y}});
  hold(w('keeps'), {mood: 'happy', look: {x: g.safe.x, y: g.cFloor - g.safe.s / 2}});
  hold(w('coin', 1), {look: {x: g.hand.x, y: g.hand.y - 50}});

  // svb: rides the price line through the dip
  const c = g.chart;
  const startPt = chartPt(c, 0, 1, 0.6);
  b.push({at: S.svb + 12, x: startPt.x, y: startPt.y - r, r, mood: 'curious', dur: 18});
  const t0 = Math.max(S.svb + 32, w('Which'));
  for (let t = t0; t <= S.vault - 4; t += 4) {
    const p = lastPt(upTo(SVB_PTS, svbProg(t)));
    const pt = chartPt(c, p[0], p[1], 0.6);
    b.push({at: t, x: pt.x, y: pt.y - r, r, path: 'linear', dur: 4, mood: t >= w('failed') && t < w('days') + 6 ? 'worried' : t >= w('days') + 6 ? 'happy' : 'curious', look: 'ahead'});
  }

  // vault: stands between the columns, watches the locked side fall
  const between = {x: g.cx, y: g.vFloor - r};
  b.push({at: S.vault + 12, x: between.x, y: between.y, r, mood: 'curious', dur: 22, look: {x: g.colL, y: g.vFloor - 15 * g.row}});
  hold(w('borrow'), {look: {x: g.colR, y: g.vFloor - 10 * g.row}});
  hold(w('falls'), {mood: 'worried', look: {x: g.colL, y: g.vFloor - lockedCount(f) * g.row}});
  hold(w('sold') + 4, {mood: 'surprised', blink: true, look: {x: g.colL, y: g.vFloor - 6 * g.row}});
  hold(w('first') + 2, {mood: 'happy', look: {x: g.colR, y: g.vFloor - 6 * g.row}});

  // formula: rides the plank, falls when it snaps, then the crash line
  const a = (sawAngle(f) * Math.PI) / 180;
  const onPlank = {x: g.saw.x, y: g.saw.y - 16 - r + Math.sin(a) * 0};
  b.push({at: S.formula + 12, x: onPlank.x, y: onPlank.y, r, mood: 'curious', dur: 22, look: {x: g.saw.x + 200, y: g.saw.y}});
  hold(w('formula'), {mood: 'skeptical', look: 'camera'});
  b.push({at: w('broke') + 2, x: g.saw.x, y: g.sawFloor - r, r, path: 'drop', dur: 9, mood: 'surprised', blink: true});
  const fc = g.fChart;
  const end = chartPt(fc, 1, 0.1, 0);
  b.push({at: w('cents') + 4, x: end.x - 30, y: end.y - r - 6, r, mood: 'worried', dur: 22, arc: 0.35, look: {x: fc.x, y: fc.y}});
  hold(w('gone'), {mood: 'worried', look: 'camera'});

  // claim: sits on the cash-backed coin
  const t1 = tokTop(g, 0);
  b.push({at: S.claim + 14, x: t1.x, y: t1.y - g.tokR - r + 4, r, mood: 'curious', dur: 22, look: {x: g.peds[2], y: g.clFloor - g.pedH}});
  hold(w('law') + 4, {mood: 'surprised', look: {x: g.peds[2], y: g.clFloor - g.tokR}});
  hold(w('standing'), {mood: 'happy', look: 'camera'});

  b.push(...endBeats(g.W, g.H, g.v, T.END_AT));
  return b;
};

export const Ep14: React.FC = () => {
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
      file="014"
      seed={1014}
      voice={[
        {src: 'vo/ep14-open-master.mp3', at: T.OPEN_AT},
        {src: 'vo/ep14-body-master.mp3', at: T.BODY_AT},
      ]}
    />
  );
};
