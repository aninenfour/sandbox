import React from 'react';
import {type Beat} from '../companion/Companion';
import {useLayout} from '../notebook/Notebook';
import {endBeats, EndCard, EpisodeRunner, type SceneDef} from '../notebook/runner';
import {AbsoluteFill} from 'remotion';
import {geo, PLACEHOLDER, S, T, type Geo} from './geo';
import {cellXY, CloseScene, colLevel, colTop, ddUpTop, DrawdownScene, OpenScene, pairCues, roadA, RUN, SizeScene, stepTimes, StreakScene, TitleScene} from './scenes';

// FILE 018 · Risk of Ruin: The Maths of Blowing Up

export const EP18_TOTAL = T.TOTAL;
const {w, ow, cw} = T;

const End: React.FC<{g: Geo}> = ({g}) => <EndCard W={g.W} H={g.H} v={g.v} at={T.END_AT} />;

const SCENES: SceneDef<Geo>[] = [
  {key: 'open', from: S.open, ground: 'paper', label: 'lose half', C: OpenScene, floor: (g) => g.col.base},
  {key: 'title', from: S.title, ground: 'paper', label: 'file 018', C: TitleScene},
  {key: 'dd', from: S.dd, ground: 'ink', label: 'drawdown', C: DrawdownScene},
  {key: 'streak', from: S.streak, ground: 'paper', label: 'streaks', C: StreakScene},
  {key: 'size', from: S.size, ground: 'ink', label: 'sizing', C: SizeScene},
  {key: 'close', from: S.close, ground: 'paper', label: 'survive', C: CloseScene},
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

  // cold open: sits on the money column, sinks with it, rides it back up on "double"
  const cx = g.col.x + g.col.w / 2 - r - 10;
  const onCol = (lv: number) => colTop(g, lv) - r - 2;
  b.push({at: 0, x: cx, y: -140, r, plain: true});
  b.push({at: 6, x: cx, y: onCol(1), r, path: 'drop', plain: true});
  hold(18, {mood: 'happy', look: 'camera'});
  for (let t = ow('half') - 2; t <= ow('half') + 12; t += 2) b.push({at: t, x: cx, y: onCol(colLevel(t + 2)), r, path: 'linear', dur: 2, mood: 'surprised', look: 'camera'});
  hold(ow('think') - 2, {mood: 'curious', look: {x: g.col.x, y: colTop(g, 0.75)}});
  hold(ow("don't") - 2, {mood: 'skeptical', look: 'camera'});
  for (let t = ow('double') - 4; t <= ow('double') + 14; t += 2) b.push({at: t, x: cx, y: onCol(colLevel(t + 2)), r, path: 'linear', dur: 2, mood: 'focused', look: {x: cx, y: colTop(g, 1) - 200}});
  hold(ow('double') + 16, {mood: 'happy', look: 'camera'});

  // title
  b.push({at: T.TITLE_AT + 16, x: g.tDot.x, y: g.tDot.y, r: g.tDot.r, mood: 'curious', arc: 0.3, dur: 22, look: 'camera'});
  hold(T.TITLE_AT + 62, {mood: 'skeptical'});

  // drawdowns: watches the holes, then rides the 233% bar up
  const d = g.dd;
  const cues = pairCues();
  const upX = d.xs[2] + d.bw * 0.55;
  b.push({at: S.dd + 10, x: d.xs[1] + (g.v ? 165 : 230), y: d.base - r - 6, r, mood: 'curious', dur: 22, look: {x: d.xs[0], y: d.base + 40}});
  hold(cues[1].down, {look: {x: d.xs[1], y: d.base + 60}});
  b.push({at: cues[2].down - 4, x: upX, y: d.base - r - 6, r, path: 'hop', hop: 60, dur: 12, mood: 'curious', look: {x: d.xs[2], y: d.base + 60}});
  for (let t = cues[2].up; t <= cues[2].up + cues[2].upDur; t += 3) b.push({at: t, x: upX, y: ddUpTop(g, t + 3, 2) - r - 6, r, path: 'linear', dur: 3, mood: 'surprised', look: {x: upX, y: d.base}});
  hold(w('mostly') - 2, {mood: 'worried', look: 'camera'});

  // streaks: perches by the grid, stares at the run
  const run = cellXY(g, RUN[2]);
  const perch = g.v ? {x: g.cx + 300, y: cellXY(g, 0).y - g.grid.cell - 70} : {x: cellXY(g, 9).x + g.grid.cell + 60, y: cellXY(g, 9).y};
  b.push({at: S.streak + 10, x: perch.x, y: perch.y, r, mood: 'curious', dur: 22, look: {x: g.grid.x, y: g.grid.y}});
  hold(w('run') - 2, {mood: 'surprised', blink: true, look: run});
  hold(w('likely') - 2, {mood: 'worried', look: 'camera'});

  // sizing: between the two accounts, watching each one take the streak
  const G = g.gauges;
  const mid = {x: g.cx, y: G.base - G.h * 0.45};
  b.push({at: S.size + 10, x: mid.x, y: mid.y, r, mood: 'focused', dur: 22, look: 'camera'});
  hold(stepTimes(0)[0] - 2, {mood: 'curious', look: {x: G.xs[0], y: G.base - G.h * 0.2}});
  hold(w('fine') - 2, {mood: 'happy', look: 'camera'});
  hold(stepTimes(1)[0] - 2, {mood: 'surprised', look: {x: G.xs[1], y: G.base - G.h * 0.4}});
  hold(w('third') - 2, {mood: 'worried', look: {x: G.xs[1], y: G.base - G.h * 0.2}});
  hold(w('Same') - 2, {mood: 'skeptical', look: 'camera', blink: true});

  // closing: walks the long road, then just stays with you for a beat
  const R = g.road;
  const xStart = R.x0 + 80;
  const xEnd = R.x0 + (R.x1 - R.x0) * (g.v ? 0.62 : 0.72);
  b.push({at: S.close + 12, x: xStart, y: roadA(g, xStart) - r - 4, r, mood: 'happy', dur: 20, look: 'ahead'});
  const walk0 = S.close + 34;
  const walk1 = T.END_AT - 30;
  for (let t = walk0; t <= walk1; t += 6) {
    const x = xStart + (xEnd - xStart) * ((t - walk0) / (walk1 - walk0));
    b.push({at: t, x, y: roadA(g, x) - r - 4 - (Math.floor((t - walk0) / 6) % 2 ? 6 : 0), r, path: 'linear', dur: 6, mood: 'happy', look: 'ahead'});
  }
  hold(cw('strategy') + 8, {mood: 'delight', look: 'camera'});
  hold(T.END_AT - 24, {mood: 'happy', look: 'camera', blink: true});

  b.push(...endBeats(g.W, g.H, g.v, T.END_AT));
  return b.sort((a, c) => a.at - c.at);
};

export const Ep18: React.FC = () => {
  const {W, H, vertical} = useLayout();
  const g = React.useMemo(() => geo(W, H, vertical), [W, H, vertical]);
  const beats = React.useMemo(() => buildBeats(g), [g]);
  return (
    <AbsoluteFill>
    <EpisodeRunner
      scenes={SCENES}
      g={g}
      beats={beats}
      total={T.TOTAL}
      file="018"
      seed={1018}
      voice={[
        {src: 'vo/ep18-open-master.mp3', at: T.OPEN_AT},
        {src: 'vo/ep18-body-master.mp3', at: T.BODY_AT},
        {src: 'vo/ep18-close-master.mp3', at: T.CLOSE_AT},
      ]}
    />
    {PLACEHOLDER && (
      <div style={{position: 'absolute', left: 0, right: 0, top: H * 0.45, padding: 20, background: 'rgba(240,69,63,0.9)', color: '#fff', fontFamily: 'monospace', fontSize: 34, textAlign: 'center'}}>
        PREVIEW · ESTIMATED TIMINGS · NO VOICE YET
      </div>
    )}
    </AbsoluteFill>
  );
};
