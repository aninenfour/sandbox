import React from 'react';
import {type Beat} from '../companion/Companion';
import {useLayout} from '../notebook/Notebook';
import {endBeats, EndCard, EpisodeRunner, type SceneDef} from '../notebook/runner';
import {geo, S, T, type Geo} from './geo';
import {ApeScene, barH, CloseScene, DegenScene, leverAt, LibraScene, libraPt, OpenScene, PEAK_U, RugScene, squidPt, SquidScene, StatScene, TitleScene} from './scenes';

// FILE 021 (中文) · 梭哈、跑路、赌狗
import '../ep20zh/cjk-display.css';
import '@fontsource/zcool-kuaile/400.css';
import '@fontsource/noto-sans-sc/500.css';
import {continueRender, delayRender} from 'remotion';
import {ZH_GLYPHS} from './glyphs';

export const EP21ZH_TOTAL = T.TOTAL;
const {w, ow, cw} = T;

const End: React.FC<{g: Geo}> = ({g}) => <EndCard W={g.W} H={g.H} v={g.v} at={T.END_AT} />;

const SCENES: SceneDef<Geo>[] = [
  {key: 'open', from: S.open, ground: 'paper', label: '黑话', C: OpenScene, floor: (g) => g.floor0},
  {key: 'title', from: S.title, ground: 'paper', label: 'file 021', C: TitleScene},
  {key: 'ape', from: S.ape, ground: 'ink', label: '梭哈', C: ApeScene},
  {key: 'rug', from: S.rug, ground: 'paper', label: '跑路', C: RugScene, floor: (g) => g.floor},
  {key: 'squid', from: S.squid, ground: 'ink', label: '鱿鱼游戏', C: SquidScene},
  {key: 'stat', from: S.stat, ground: 'paper', label: '37%', C: StatScene},
  {key: 'libra', from: S.libra, ground: 'ink', label: 'LIBRA', C: LibraScene, floor: (g) => g.lchart.y},
  {key: 'degen', from: S.degen, ground: 'paper', label: '赌狗', C: DegenScene, floor: (g) => g.slot.base},
  {key: 'close', from: S.close, ground: 'ink', label: '一个问题', C: CloseScene, floor: (g) => g.crug.floor},
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

  // cold open: laughs at each joke, then sees the warnings
  const y0 = g.floor0 - r;
  b.push({at: 0, x: g.me0.x, y: -140, r, plain: true});
  b.push({at: 6, x: g.me0.x, y: y0, r, path: 'drop', plain: true});
  hold(16, {closed: true});
  hold(ow('dictionary') - 2, {mood: 'curious', blink: true, look: {x: g.bub.at[0].x, y: g.bub.at[0].y}});
  ['Ape', 'rug', 'degen'].forEach((word, i) => {
    b.push({at: ow(word) + 2, x: g.me0.x, y: y0, r, path: 'hop', hop: 40, dur: 10, mood: 'delight', look: {x: g.bub.at[i].x, y: g.bub.at[i].y}});
  });
  hold(ow('warnings') - 2, {mood: 'worried', look: {x: g.bub.at[1].x, y: g.bub.at[1].y}});
  hold(ow('costume'), {mood: 'skeptical', look: 'camera'});

  // title
  b.push({at: T.TITLE_AT + 16, x: g.tDot.x, y: g.tDot.y, r: g.tDot.r, mood: 'happy', arc: 0.3, dur: 22, look: 'camera'});
  hold(T.TITLE_AT + 62, {mood: 'curious'});

  // ape: queues on the board, walks out with its eyes shut and cannonballs in
  const Bd = g.board;
  const by = Bd.y - r;
  b.push({at: S.ape + 10, x: Bd.x - 10, y: by, r, mood: 'curious', dur: 22, look: {x: g.pool.x, y: g.pool.y}});
  hold(w('buying') - 2, {mood: 'excited', look: {x: g.pool.x + g.pool.w / 2, y: g.pool.y}});
  b.push({at: w('without') - 2, x: Bd.x + Bd.len - 60, y: by, r, mood: 'happy', dur: 26, closed: true});
  b.push({at: w('jumping') - 2, x: g.pool.x + g.pool.w * 0.5, y: g.pool.y - r * 0.35, r, path: 'hop', hop: 230, dur: 16, mood: 'happy', closed: true});
  hold(w('jumping') + 18, {mood: 'surprised', look: 'camera', blink: true});

  // rug: stands on the rug, gets swept off its feet
  const ry = g.floor - g.rug.h - r;
  b.push({at: S.rug + 10, x: g.meRug.x, y: ry, r, mood: 'curious', dur: 22, look: {x: g.easel.x, y: g.floor - g.easel.h}});
  hold(w('launches') - 2, {mood: 'happy'});
  hold(w('in', 2) - 2, {mood: 'excited', look: {x: g.easel.x, y: g.floor - g.easel.h - 60}});
  b.push({at: w('pulls') + 2, x: g.meRug.x - 30, y: g.floor - r, r, path: 'hop', hop: 170, dur: 18, mood: 'surprised', look: 'camera'});
  hold(w('disappears') - 2, {mood: 'worried', look: {x: g.team.x + 400, y: g.floor - 60}});

  // squid: rides the line to the top, then falls with it
  const tA = w('shot') - 6;
  const tB = w('thousand') + 6;
  const s0 = squidPt(g, 0);
  b.push({at: S.squid + 10, x: s0.x + r, y: s0.y - r, r, mood: 'curious', dur: 22, look: {x: g.card.x, y: g.card.y}});
  for (let k = 1; k <= 6; k++) {
    const p = squidPt(g, (PEAK_U * k) / 6);
    b.push({at: Math.round(tA + ((k - 1) * (tB - tA)) / 6), x: p.x, y: p.y - r, r, path: 'linear', dur: Math.round((tB - tA) / 6), mood: k > 4 ? 'excited' : 'happy', look: 'ahead'});
  }
  hold(w('sell') - 2, {mood: 'worried', look: {x: squidPt(g, PEAK_U).x + 110, y: squidPt(g, PEAK_U).y + 60}});
  const pk = squidPt(g, PEAK_U);
  b.push({at: w('dropped') - 2, x: pk.x + 6, y: g.chart.y - 0.004 * g.chart.h - r, r, path: 'drop', dur: 10, mood: 'surprised', look: 'camera'});
  hold(w('zero') + 8, {mood: 'sleepy', look: {x: g.card.x, y: g.card.y}});

  // stat: rides the 37% bar up like a lift
  const Bs = g.bars;
  const bx = Bs.x1 + Bs.bw / 2;
  b.push({at: S.stat + 10, x: bx, y: Bs.base - 6 - r, r, mood: 'curious', dur: 22, look: {x: Bs.x0, y: Bs.base}});
  const g0 = w('thirty-seven') - 8;
  b.push({at: g0, x: bx, y: Bs.base - barH(g, g0 + 22).b1 - r, r, path: 'linear', dur: 22, mood: 'excited', look: 'camera'});
  hold(w('billion') - 2, {mood: 'surprised', look: 'camera'});

  // libra: watches the insider wallets fly off, chases one, gives up
  const C = g.lchart;
  b.push({at: S.libra + 10, x: C.x + 70, y: C.y - r, r, mood: 'curious', dur: 22, look: {x: g.lcard.x, y: g.lcard.y}});
  hold(w('president') - 2, {mood: 'skeptical', look: {x: g.lcard.x, y: g.lcard.y}});
  hold(w('four') - 2, {mood: 'surprised', look: {x: libraPt(g, 0.42).x, y: libraPt(g, 0.42).y}});
  hold(w('crashed') - 2, {mood: 'worried'});
  b.push({at: w('insider'), x: C.x + C.w * 0.72, y: C.y - r, r, path: 'hop', hop: 140, dur: 16, mood: 'excited', look: {x: C.x + C.w + 200, y: C.y - C.h}});
  hold(w('million', 2) - 2, {mood: 'skeptical', look: 'camera'});

  // degen: climbs onto the lever, rides it down, wins three rugs
  const M = g.slot;
  const meX = M.x + M.w / 2 + (g.v ? 70 : 100);
  const knob = {x: M.x + M.w / 2 - 43, y: M.base - M.h + 61};
  b.push({at: S.degen + 10, x: meX, y: M.base - r, r, mood: 'curious', dur: 22, look: {x: M.x, y: M.base - M.h / 2}});
  b.push({at: w('degen') - 8, x: knob.x, y: knob.y - 26 - r, r, path: 'hop', hop: 120, dur: 12, mood: 'excited', look: {x: M.x, y: M.base - M.h + 150}});
  b.push({at: leverAt(), x: meX, y: M.base - r, r, path: 'drop', dur: 10, mood: 'surprised', look: {x: M.x, y: M.base - M.h + 150}});
  hold(w('gambler') + 14, {mood: 'delight', look: {x: M.x, y: M.base - M.h + 150}});
  hold(w('proudly') - 2, {mood: 'happy', look: 'camera', blink: true});

  // closing: stands on the rug, looks at the lifting corner
  const R = g.crug;
  b.push({at: S.close + 10, x: R.x + 220, y: R.floor - 24 - r, r, mood: 'curious', dur: 22, look: 'camera'});
  hold(cw('jokes') - 2, {mood: 'skeptical', look: {x: g.signs[1].x, y: g.signs[1].y}});
  hold(cw('real') - 2, {mood: 'worried', look: 'camera'});
  hold(cw('Who') - 6, {mood: 'curious', look: {x: R.x + R.w * 0.8, y: R.floor - 80}});
  hold(cw('rug') + 10, {mood: 'focused', look: 'camera'});
  hold(T.END_AT - 30, {mood: 'happy', look: 'camera', blink: true});

  b.push(...endBeats(g.W, g.H, g.v, T.END_AT));
  return b.sort((a, c) => a.at - c.at);
};

// every Chinese glyph on screen, so the lazily split CJK fonts are fully in before frame 0
const useZhFonts = () => {
  const [handle] = React.useState(() => delayRender('Chinese fonts'));
  React.useEffect(() => {
    const fams = ['"HC Display CJK"', '"ZCOOL KuaiLe"', '"Noto Sans SC"'];
    Promise.all(fams.map((f) => document.fonts.load(`40px ${f}`, ZH_GLYPHS)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

export const Ep21zh: React.FC = () => {
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
      file="021"
      seed={1023}
      voice={[
        {src: 'vo/ep21zh-open-master.mp3', at: T.OPEN_AT},
        {src: 'vo/ep21zh-body-master.mp3', at: T.BODY_AT},
        {src: 'vo/ep21zh-close-master.mp3', at: T.CLOSE_AT},
      ]}
    />
  );
};
