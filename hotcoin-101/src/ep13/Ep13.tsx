import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {Companion, poseAt, type Beat} from '../companion/Companion';
import {useFrame} from '../design/clock';
import {Chrome, Ground, useLayout, Wipe} from '../notebook/Notebook';
import {INK, GREEN, PAPER, type Ground as G} from '../notebook/tokens';
import {real} from '../notebook/time';
import {plateLand, slipPos, stackTop, syceeLand, curvePoint, chartCenter, CURVE} from './dyn';
import {geo, type Geo} from './geo';
import {BankScene, EndScene, IronScene, OpenScene, PrintScene, ReceiptScene, SameScene, SealScene, SilverScene, SwedenScene, TitleScene, TrustScene} from './scenes';
import {BODY_AT, END_AT, KEYS, OPEN_AT, ow, S, TITLE_AT, TOTAL, w} from './timeline';

// FILE 013 · How Paper Money Got Invented Twice
// Notebook look. Every scene and every narrator move is placed on a word of
// the voiceover (see timeline.ts).

export const EP13_TOTAL = TOTAL;

type SceneDef = {key: keyof typeof S; ground: G; label: string; C: React.FC<{g: Geo}>};
const SCENES: SceneDef[] = [
  {key: 'open', ground: 'paper', label: 'cold open', C: OpenScene},
  {key: 'title', ground: 'paper', label: 'file 013', C: TitleScene},
  {key: 'iron', ground: 'paper', label: 'iron', C: IronScene},
  {key: 'receipts', ground: 'paper', label: 'receipts', C: ReceiptScene},
  {key: 'seal', ground: 'ink', label: '1024', C: SealScene},
  {key: 'print', ground: 'ink', label: 'printing', C: PrintScene},
  {key: 'silver', ground: 'ink', label: 'silver', C: SilverScene},
  {key: 'sweden', ground: 'paper', label: 'sweden', C: SwedenScene},
  {key: 'bank', ground: 'paper', label: 'stockholm', C: BankScene},
  {key: 'same', ground: 'ink', label: 'same ending', C: SameScene},
  {key: 'trust', ground: 'paper', label: 'trust', C: TrustScene},
  {key: 'end', ground: 'paper', label: 'end card', C: EndScene},
];
const WIPE = 16;

const buildBeats = (g: Geo, f: number): Beat[] => {
  const b: Beat[] = [];
  const r = g.r;
  const last = () => b[b.length - 1];
  const hold = (at: number, extra: Partial<Beat> = {}) => {
    const l = last();
    b.push({at, x: l.x, y: l.y, r: l.r, path: 'cut', ...extra});
  };

  // cold open: drops onto 1024, opens its eye, hops the 637 years to 1661
  const onRuler = g.rulerY - r;
  const x1024 = g.yx(1024);
  b.push({at: 0, x: x1024, y: -140, r, plain: true});
  b.push({at: 3, x: x1024, y: onRuler, r, path: 'drop', plain: true});
  hold(20, {closed: true});
  hold(ow('paper') - 4, {mood: 'curious', look: {x: x1024, y: g.iconY}, blink: true});
  const hopAt = ow('six') - 6;
  b.push({at: hopAt, x: g.yx(1250), y: onRuler, r, path: 'hop', hop: 90, mood: 'focused'});
  b.push({at: hopAt + 16, x: g.yx(1460), y: onRuler, r, path: 'hop', hop: 90});
  b.push({at: hopAt + 32, x: g.yx(1661) - 70, y: onRuler, r, path: 'hop', hop: 90});
  hold(ow('Europe') + 8, {mood: 'surprised', look: {x: g.yx(1661), y: g.iconY}, blink: true});
  hold(ow('tried'), {mood: 'skeptical', look: {x: x1024, y: g.iconY}});

  // title: lands as the full stop
  b.push({at: TITLE_AT + 14, x: g.tDot.x, y: g.tDot.y, r: g.tDot.r, mood: 'happy', arc: 0.3, dur: 22, look: 'camera'});
  hold(TITLE_AT + 62, {mood: 'delight'});

  // iron: tries to push the cart
  b.push({at: S.iron + 8, x: g.push.x - 70, y: g.push.y, r, mood: 'curious', dur: 24, arc: 0.25, look: {x: g.cartX, y: g.cartY - 60}});
  hold(w('iron') - 4, {look: {x: g.inset.x, y: g.inset.y}});
  b.push({at: w('iron', 2) - 6, x: g.push.x, y: g.push.y, r, dur: 10, mood: 'focused', look: {x: g.cartX, y: g.cartY}});
  for (let i = 0; i < 4; i++) {
    const t = w('is') + i * 12;
    b.push({at: t, x: g.push.x + 8, y: g.push.y, r, path: 'linear', dur: 5, mood: i > 0 ? 'worried' : undefined});
    b.push({at: t + 5, x: g.push.x, y: g.push.y, r, path: 'linear', dur: 7});
  }
  b.push({at: w('heavy') - 1, x: g.push.x, y: g.push.y, r, path: 'drop', dur: 3, mood: 'worried', blink: true});
  hold(w('heavy') + 16, {mood: 'sleepy', look: 'camera'});

  // receipts: watches the slip travel
  b.push({at: S.receipts + 8, x: g.dotR.x, y: g.dotR.y, r, mood: 'curious', dur: 24, look: {x: g.chest.x, y: g.chest.y}});
  const slip = slipPos(f, g);
  hold(w('handed'), {look: {x: slip.x, y: slip.y}});
  hold(w('people'), {mood: 'happy', look: {x: slip.x, y: slip.y}});

  // 1024: the stamp
  const noteC = {x: g.note.x, y: g.note.y};
  b.push({at: S.seal + 12, x: g.dotS.x, y: g.dotS.y, r, mood: 'curious', dur: 22, look: noteC});
  hold(w('took') + 8, {mood: 'surprised', blink: true, look: noteC});
  hold(w('notes') - 2, {mood: 'happy', look: 'camera'});

  // printing: watches the stack climb and the sacks go
  b.push({at: S.print + 8, x: g.dotP.x, y: g.dotP.y, r, mood: 'happy', dur: 20, look: {x: g.buys.x, y: g.sackRows[0]}});
  const top = stackTop(f, g);
  hold(w('needed'), {mood: 'skeptical', look: top});
  hold(w('printing'), {mood: 'worried', look: top});
  hold(w('less') - 4, {mood: 'worried', look: {x: g.buys.x, y: g.sackRows[1]}});

  // silver: rides station to station, lands on the ingot
  const yuanTop = g.baseY - 14 - g.yuan.h - r;
  const mingTop = g.baseY - 14 - g.ming.h - r;
  b.push({at: w('Mongols') - 2, x: g.stations[0] + g.yuan.w * 0.2, y: yuanTop, r, mood: 'curious', dur: 20, arc: 0.3});
  hold(w('too') + 6, {mood: 'skeptical'});
  b.push({at: w('Ming') - 2, x: g.stations[1] + g.ming.w * 0.2, y: mingTop, r, path: 'hop', hop: 120, mood: 'worried'});
  b.push({at: Math.max(syceeLand() + 4, w('back') - 6), x: g.stations[2], y: g.syceeY - 52 * g.syceeS - r + 14, r, path: 'hop', hop: 150, mood: 'curious'});
  hold(w('silver'), {mood: 'delight', blink: true});

  // sweden: the plate nearly flattens it
  const onFloor = g.sFloor - r;
  b.push({at: S.sweden + 12, x: g.plateX, y: onFloor, r, mood: 'curious', dur: 22, look: {x: g.coinsX, y: g.sFloor}});
  hold(plateLand() - 16, {mood: 'surprised', look: {x: g.plateX, y: 0}, blink: true});
  b.push({at: plateLand() - 11, x: g.safeX, y: onFloor, r, path: 'hop', hop: 120});
  hold(plateLand() + 4, {mood: 'surprised', look: {x: g.plateX, y: g.sFloor - g.plate.h / 2}});
  b.push({at: w('kilos') + 6, x: g.plateX + g.plate.w * 0.25, y: g.sFloor - g.plate.h - r, r, path: 'hop', hop: 140, mood: 'happy'});

  // stockholm
  b.push({at: S.bank + 10, x: g.dotB.x, y: g.dotB.y, r, mood: 'curious', dur: 24, look: {x: g.bankX, y: g.bFloor - 250}});
  hold(w('printed', 2), {mood: 'happy', look: {x: g.pileX, y: g.bFloor - 60}});
  hold(w('printed', 3), {mood: 'skeptical', look: {x: g.pileX, y: g.bFloor - 100}});
  hold(w('pay'), {mood: 'worried', blink: true, look: {x: g.bankX, y: g.bFloor - 300}});

  // same ending: rides the merged line down
  const midA = chartCenter(S.same + 12, g, 'A');
  b.push({at: S.same + 12, x: g.v ? g.cx + g.chart.w / 2 - 40 : g.cx, y: g.v ? g.cy : midA.y - g.chart.h / 2 - 30, r, mood: 'focused', dur: 20, look: 'camera'});
  const endPt = curvePoint(g.chartM, g, CURVE[CURVE.length - 1]);
  b.push({at: w('ending') + 4, x: endPt.x, y: endPt.y - r - 4, r, mood: 'skeptical', dur: 18, arc: 0.2});

  // trust: becomes the full stop of TRUST
  const nh = 96 * g.bigNote.s;
  b.push({at: S.trust + 12, x: g.v ? g.cx : g.cx - 160 * g.bigNote.s * 0.5 - 90, y: g.v ? g.cy + nh / 2 + 110 : g.cy + nh / 2 - r, r, mood: 'curious', dur: 22, look: {x: g.cx, y: g.cy}});
  b.push({at: w('trust') + 6, x: g.trDot.x, y: g.trDot.y, r: g.trDot.r, mood: 'happy', dur: 20, arc: 0.35, look: 'camera'});
  hold(w('scarce'), {mood: 'delight'});

  // end card: into the logo
  b.push({at: END_AT + 18, x: g.logoDot.x, y: g.logoDot.y, r: g.logoDot.r, mood: 'happy', dur: 26, arc: 0.3});
  hold(END_AT + 52, {mood: 'delight'});
  hold(END_AT + 66, {mood: 'delight', plain: true});
  return b;
};

const Stage: React.FC<{def: SceneDef; g: Geo; to: number; fadeIn: boolean; fadeOut: boolean}> = ({def, g, to, fadeIn, fadeOut}) => {
  const f = useFrame();
  const from = S[def.key];
  const o = Math.min(fadeIn ? Math.min(1, (f - from) / 5) : 1, fadeOut ? 1 - Math.min(1, Math.max(0, (f - (to - 6)) / 6)) : 1);
  return (
    <AbsoluteFill>
      <Ground ground={def.ground} />
      <Chrome ground={def.ground} file="013" keys={KEYS} total={TOTAL} label={def.label} />
      <AbsoluteFill style={{opacity: Math.max(0, o)}}>
        <def.C g={g} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Ep13: React.FC = () => {
  const f = useFrame();
  const {W, H, vertical} = useLayout();
  const g = React.useMemo(() => geo(W, H, vertical), [W, H, vertical]);
  const beats = buildBeats(g, f);

  let current = 0;
  SCENES.forEach((s, i) => {
    if (f >= S[s.key]) current = i;
  });

  const layers: React.ReactNode[] = [];
  SCENES.forEach((def, i) => {
    const from = S[def.key];
    const next = SCENES[i + 1];
    const to = next ? S[next.key] : TOTAL + 1;
    const prev = SCENES[i - 1];
    const wiped = !!prev && prev.ground !== def.ground;
    const nextWiped = !!next && next.ground !== def.ground;
    const until = nextWiped ? to + WIPE + 1 : to;
    if (f < from || f >= until) return;
    const stage = <Stage def={def} g={g} to={to} fadeIn={!wiped && i > 0 && def.key !== 'title'} fadeOut={!nextWiped && !!next && next.key !== 'title'} />;
    if (wiped) {
      const p = poseAt(beats, from);
      layers.push(
        <Wipe key={def.key} at={from} x={p.x} y={p.y} ring={def.ground === 'ink' ? GREEN : INK}>
          {stage}
        </Wipe>,
      );
    } else {
      layers.push(<AbsoluteFill key={def.key}>{stage}</AbsoluteFill>);
    }
  });

  const cur = SCENES[current];
  const prevDef = SCENES[current - 1];
  const ground: G = prevDef && prevDef.ground !== cur.ground && f < S[cur.key] + WIPE / 2 ? prevDef.ground : cur.ground;
  const floor = cur.key === 'open' ? g.rulerY : cur.key === 'iron' ? g.floor : cur.key === 'sweden' ? g.sFloor : cur.key === 'bank' ? g.bFloor : undefined;

  return (
    <AbsoluteFill style={{background: PAPER}}>
      {layers}
      <Companion beats={beats} ground={ground} floor={floor} seed={1013} />
      <Sequence from={real(OPEN_AT)} layout="none">
        <Audio src={staticFile('vo/ep13-open-master.mp3')} />
      </Sequence>
      <Sequence from={real(BODY_AT)} layout="none">
        <Audio src={staticFile('vo/ep13-body-105-master.mp3')} />
      </Sequence>
      <Audio
        src={staticFile('music/serene-view-bed.mp3')}
        volume={(fr) =>
          interpolate(fr, [0, real(20), real(TOTAL) - real(70), real(TOTAL)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
        }
      />
    </AbsoluteFill>
  );
};
