// What If 02 (journey cut) · "$100 in Apple in 1980" as a side-scroller: the stickman walks through 46 years,
// picks things up, loses them in the crashes, drives, rides, and ends at his own front door.
// Voice + word captions: public/shorts/wi02. Prices: public/shorts/d02/aapl.json (real, split-adjusted, $22 IPO, no dividends).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, Captions, FONT, buildChunks, ease, f, lin, type Word} from './kit';
import {Rig, bend, carry, cheer, hands, idle, lookDown, ride, run, sit, slumpWalk, walk, wave, handOver, type Pose} from './rig';
import DATA from '../../public/shorts/d02/aapl.json';
import VO from '../../public/shorts/wi02/words.json';

const S = VO.sentences;
const WORDS = VO.words as Word[];
const st = (i: number) => S[i].start;
const wt = (w: string, n = 0, after = 0) => WORDS.filter((x) => x.start >= after && x.w.toLowerCase().replace(/[.,!?]/g, '') === w.toLowerCase())[n].start;
const END = VO.dur + 2.6;
export const WI02B_DURATION = f(END);
const G = 1150; // ground line (feet)

// ---------- money ----------
const PTS = DATA.pts as [number, number][];
const idxAt = (y: number) => { let lo = 0, hi = PTS.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (PTS[m][0] <= y) lo = m; else hi = m - 1; } return lo; };
const valueAt = (y: number) => { const i = idxAt(y), j = Math.min(PTS.length - 1, i + 1); const [ya, va] = PTS[i], [yb, vb] = PTS[j]; return yb === ya ? va : va + (vb - va) * Math.max(0, Math.min(1, (y - ya) / (yb - ya))); };
const BEATS: {from: number; at: number; year: number}[] = [
  {from: 0, at: 0, year: 1980.948},
  {from: st(1), at: wt('seventy-two'), year: 1985.69},
  {from: st(3), at: wt('twenty-one'), year: 1997.97},
  {from: st(6), at: wt('twelve'), year: 2000.22},
  {from: st(8), at: wt('sixty'), year: 2000.94},
  {from: st(10), at: wt('iphone'), year: 2007.04},
  {from: wt('iphone') + 0.4, at: wt('seven'), year: 2008.40},
  {from: st(12), at: wt('half'), year: 2008.88},
  {from: st(13), at: wt('ten', 0, st(13)), year: 2010.70},
  {from: st(14), at: wt('fifty-two'), year: 2018.59},
  {from: st(15), at: wt('hundred', 0, st(15)), year: 2020.57},
  {from: st(16), at: wt('fifty-four'), year: 2026.8077},
];
const yearAt = (t: number) => {
  let y = BEATS[0].year;
  for (let i = 1; i < BEATS.length; i++) {
    const b = BEATS[i];
    if (t >= b.at) y = b.year;
    else if (t > b.from) { y = BEATS[i - 1].year + (b.year - BEATS[i - 1].year) * ease((t - b.from) / Math.max(0.2, b.at - b.from)); break; }
    else break;
  }
  return y;
};

// ---------- choreography ----------
// what he is doing, second by second. Speeds in px/s; positions come from integrating them.
type Mode = 'walk' | 'slow' | 'run' | 'stand' | 'drive' | 'ride';
const T = {
  booth: wt('apple'), pizza: wt('pizza'), dinner: wt('dinner'), boom: wt('boom'), laptop: wt('laptop'), crash1: wt('crash'), goes: wt('goes'),
  iphone: wt('iphone'), car: wt('used'), crash2: wt('crash', 1), bye: wt('bye'), bike: wt('motorbike'), trillion: wt('trillion'), newcar: wt('brand', 1),
  house: wt('payment'), today: wt('today'), sold: wt('fifty-four'), hundred: wt('one', 0, st(17)), holding: wt('holding'),
};
const SEG: [number, Mode][] = [
  [0, 'walk'], [T.booth - 0.25, 'stand'], [st(1) - 0.6, 'walk'], [T.pizza - 0.3, 'stand'], [T.pizza + 0.5, 'walk'],
  [st(3), 'slow'], [T.dinner - 0.35, 'stand'], [st(6) - 0.3, 'walk'], [T.boom - 0.1, 'run'], [T.laptop - 0.4, 'stand'], [T.laptop + 0.4, 'walk'],
  [T.crash1 + 0.5, 'slow'], [T.goes - 0.15, 'stand'], [st(10) + 0.2, 'walk'], [T.car - 0.35, 'stand'], [T.car + 0.25, 'drive'],
  [T.crash2 + 0.1, 'stand'], [st(13) - 0.2, 'walk'], [T.bike - 0.3, 'stand'], [T.bike + 0.1, 'ride'], [T.newcar - 0.35, 'stand'],
  [T.newcar + 0.2, 'drive'], [T.house - 0.2, 'stand'], [T.today, 'walk'], [T.hundred - 0.3, 'stand'],
];
const SPEED: Record<Mode, number> = {walk: 250, slow: 150, run: 430, stand: 0, drive: 760, ride: 600};
const modeAt = (t: number) => [...SEG].reverse().find(([t0]) => t >= t0)![1];
// integrate once: position, foot travel (for the walk cycle) and smoothed speed for every frame
const NF = f(END) + 1;
const X: number[] = [], FOOT: number[] = [], V: number[] = [];
{
  let x = 0, foot = 0, v = 0;
  for (let i = 0; i < NF; i++) {
    const m = modeAt(i / 30);
    const target = SPEED[m];
    v += (target - v) * (m === 'drive' || m === 'ride' ? 0.08 : 0.25);
    if (m === 'stand' && v < 8) v = 0;
    x += v / 30;
    if (m !== 'drive' && m !== 'ride') foot += v / 30;
    X.push(x); FOOT.push(foot); V.push(v);
  }
}
const xAt = (t: number) => X[Math.max(0, Math.min(NF - 1, Math.round(t * 30)))];
const tAtX = (x: number) => { let lo = 0, hi = NF - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (X[m] < x) lo = m + 1; else hi = m; } return lo / 30; };
// where things stand in the world
const P = {
  booth: xAt(T.booth) + 150, pizza: xAt(T.pizza) + 95, dinner: xAt(T.dinner) + 95, laptop: xAt(T.laptop) + 95, smash: xAt(T.goes) + 70,
  car: xAt(T.car) + 30, bike: xAt(T.bike) + 10, newcar: xAt(T.newcar) + 30, house: xAt(T.hundred - 0.3) + 40, billboard07: xAt(T.iphone) + 380, billboard18: xAt(T.trillion) + 520,
};

// ---------- the world ----------
const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const eraOfX = (x: number) => yearAt(tAtX(x));
type Bld = {x: number; w: number; h: number; year: number; seed: number};
const NEAR: Bld[] = [], FAR: Bld[] = [];
{
  let x = -1200; let i = 0;
  while (x < X[NF - 1] + 2500) { const w = 200 + rnd(i) * 160; NEAR.push({x, w, h: 260 + rnd(i + 9) * 260, year: eraOfX(x), seed: i}); x += w + 30 + rnd(i + 3) * 80; i++; }
  x = -1500; i = 500;
  while (x < X[NF - 1] * 0.35 + 3000) { const w = 160 + rnd(i) * 200; FAR.push({x, w, h: 420 + rnd(i + 7) * 420, year: eraOfX(x / 0.35), seed: i}); x += w + 10; i++; }
}
const eraStyle = (y: number) => y < 1990 ? {wall: '#6B3B2E', trim: '#4A271E', win: '#F2C14E'} : y < 2000 ? {wall: '#59616E', trim: '#3E444F', win: '#E8D9A8'} : y < 2010 ? {wall: '#2E4E7A', trim: '#1E3454', win: '#9CC3F0'} : {wall: '#26304F', trim: '#171D33', win: '#7FE0F0'};
const sky = (y: number) => y < 1990 ? ['#3B2F4A', '#C97B58'] : y < 1996.5 ? ['#2B3446', '#6A7488'] : y < 1999 ? ['#1F242E', '#3D4452'] : y < 2008.6 ? ['#17203D', '#3A5A9A'] : y < 2009.5 ? ['#1A1A26', '#4A3A44'] : ['#0F1430', '#4B3F8F'];
const lerpHex = (a: string, b: string, k: number) => { const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16)); return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join(''); };

const Building: React.FC<{b: Bld; sx: number; far?: boolean}> = ({b, sx, far}) => {
  const e = eraStyle(b.year);
  const rows = Math.floor((b.h - 60) / 70), cols = Math.max(2, Math.floor(b.w / 70));
  return (
    <div style={{position: 'absolute', left: sx, top: G - b.h, width: b.w, height: b.h, background: far ? 'rgba(10,12,22,.55)' : e.wall, borderTop: far ? 'none' : `10px solid ${e.trim}`, overflow: 'hidden'}}>
      {Array.from({length: rows * cols}, (_, k) => {
        const on = rnd(b.seed * 31 + k) > (far ? 0.55 : 0.35);
        return <div key={k} style={{position: 'absolute', left: 18 + (k % cols) * ((b.w - 36) / cols), top: 30 + Math.floor(k / cols) * 70, width: (b.w - 36) / cols - 18, height: 38, background: on ? e.win : 'rgba(0,0,0,.35)', opacity: far ? 0.5 : on ? 0.85 : 1}} />;
      })}
    </div>
  );
};

// ---------- props ----------
const Booth: React.FC<{sx: number; fr: number}> = ({sx, fr}) => (
  <div style={{position: 'absolute', left: sx - 150, top: G - 360, width: 300, height: 360}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 300, height: 70, background: `repeating-linear-gradient(90deg, ${C.red} 0 30px, #F2EEE6 30px 60px)`, borderRadius: '10px 10px 0 0'}} />
    <div style={{position: 'absolute', left: 20, top: 70, width: 260, height: 290, background: '#5A3A22'}} />
    <div style={{position: 'absolute', left: 30, top: 90, width: 240, height: 90, background: C.paper, textAlign: 'center', font: `900 34px/1.1 ${FONT.cap}`, color: C.line, paddingTop: 10}}>APPLE IPO<br /><span style={{font: `700 22px ${FONT.mono}`}}>$22 A SHARE · 1980</span></div>
    <div style={{position: 'absolute', left: 0, top: 200, width: 300, height: 26, background: '#3A2716'}} />
    {fr > f(T.booth + 0.35) && <div style={{position: 'absolute', left: 110, top: 168, width: 80, height: 36, background: C.money, border: '3px solid #4E8F55', borderRadius: 4, transform: 'rotate(-8deg)'}} />}
  </div>
);
const PizzaBox: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <div style={{position: 'absolute', left: x - 70 * s, top: y - 22 * s, width: 140 * s, height: 26 * s, background: '#E0B070', border: `${3 * s}px solid #9A6A3A`, borderRadius: 4}}>
    <div style={{position: 'absolute', left: 50 * s, top: 3 * s, width: 34 * s, height: 14 * s, borderRadius: '50%', background: C.red}} />
  </div>
);
const Plate: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <div style={{position: 'absolute', left: x - 75 * s, top: y - 26 * s, width: 150 * s, height: 30 * s}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: '#E9E4D8', border: `${3 * s}px solid #C9C3B4`}} />
    <div style={{position: 'absolute', left: 40 * s, top: -8 * s, width: 70 * s, height: 26 * s, borderRadius: '50% 50% 40% 40%', background: '#8E3B2E'}} />
    <div style={{position: 'absolute', left: 30 * s, top: 0, width: 20 * s, height: 16 * s, borderRadius: '50%', background: C.money}} />
  </div>
);
const Laptop: React.FC<{x: number; y: number; s?: number; open?: number}> = ({x, y, s = 1}) => (
  <div style={{position: 'absolute', left: x - 70 * s, top: y - 90 * s, width: 140 * s, height: 96 * s}}>
    <div style={{position: 'absolute', left: 10 * s, top: 0, width: 120 * s, height: 80 * s, background: '#1C1F26', border: `${4 * s}px solid #8A93A6`, borderRadius: 6 * s}}><div style={{position: 'absolute', inset: 6 * s, background: '#3C7BE0'}} /></div>
    <div style={{position: 'absolute', left: 0, top: 80 * s, width: 140 * s, height: 14 * s, background: '#C9CED3', borderRadius: 3 * s}} />
  </div>
);
const Table: React.FC<{sx: number; children?: React.ReactNode}> = ({sx, children}) => (
  <div style={{position: 'absolute', left: sx - 110, top: G - 170, width: 220, height: 170}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 220, height: 18, background: '#7A4E2C', borderRadius: 6}} />
    <div style={{position: 'absolute', left: 20, top: 18, width: 14, height: 152, background: '#5A3A22'}} />
    <div style={{position: 'absolute', right: 20, top: 18, width: 14, height: 152, background: '#5A3A22'}} />
    {children}
  </div>
);
const Wheel: React.FC<{cx: number; cy: number; r: number; rot: number}> = ({cx, cy, r, rot}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
    <circle r={r} fill="#15171C" /><circle r={r * 0.55} fill="#8A93A6" />
    {[0, 60, 120].map((a) => <line key={a} x1={-r * 0.5} y1={0} x2={r * 0.5} y2={0} stroke="#3A3E48" strokeWidth={6} transform={`rotate(${a})`} />)}
  </g>
);
// car body around his seated upper body; `shiny` for the new one
const Car: React.FC<{sx: number; rot: number; color: string; shiny?: boolean; bounce?: number; smoke?: number; children?: React.ReactNode}> = ({sx, rot, color, shiny, bounce = 0, smoke = 0, children}) => (
  <>
    {children}
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <g transform={`translate(${sx} ${G}) translate(0 ${bounce})`}>
        <path d="M-230 -60 L-222 -125 L-125 -142 L-75 -268 L95 -268 L160 -142 L232 -122 L242 -60 Z M-62 -256 L-110 -146 L-36 -146 L-8 -256 Z M6 -256 L-22 -146 L146 -146 L86 -256 Z" fill={color} fillRule="evenodd" />
        <path d="M-62 -256 L-110 -146 L-36 -146 L-8 -256 Z M6 -256 L-22 -146 L146 -146 L86 -256 Z" fill="rgba(160,200,240,.28)" stroke="rgba(255,255,255,.45)" strokeWidth={3} />
        <path d="M-75 -268 L95 -268" stroke="rgba(0,0,0,.25)" strokeWidth={6} />
        <rect x={225} y={-108} width={16} height={14} fill="#F2C14E" /><rect x={-232} y={-108} width={12} height={14} fill={C.red} />
        {shiny && <path d="M-200 -115 L200 -115" stroke="rgba(255,255,255,.55)" strokeWidth={5} />}
        <Wheel cx={-140} cy={-42} r={44} rot={rot} /><Wheel cx={150} cy={-42} r={44} rot={rot} />
        {smoke > 0 && Array.from({length: 6}, (_, k) => <circle key={k} cx={-40 + k * 30 + Math.sin(k + smoke * 3) * 20} cy={-230 - smoke * 120 * (0.5 + k / 6)} r={30 + k * 6} fill={`rgba(90,90,100,${0.55 * (1 - smoke) + 0.15})`} />)}
      </g>
    </svg>
  </>
);
const Bike: React.FC<{sx: number; rot: number; children?: React.ReactNode}> = ({sx, rot, children}) => (
  <>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <g transform={`translate(${sx} ${G})`}>
        <Wheel cx={-110} cy={-46} r={46} rot={rot} /><Wheel cx={120} cy={-46} r={46} rot={rot} />
        <path d="M-110 -46 L-30 -120 L70 -120 L120 -46 M-30 -120 L0 -46 L70 -120" stroke="#8A93A6" strokeWidth={12} fill="none" strokeLinejoin="round" />
        <path d="M-50 -128 Q10 -170 80 -138 L84 -112 L-40 -108 Z" fill={C.red} />
        <path d="M70 -130 L105 -175 L130 -172" stroke="#8A93A6" strokeWidth={10} fill="none" strokeLinecap="round" />
      </g>
    </svg>
    {children}
  </>
);
const House: React.FC<{sx: number; lit: number; sold: boolean}> = ({sx, lit, sold}) => (
  <div style={{position: 'absolute', left: sx - 260, top: G - 560, width: 520, height: 560}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, borderLeft: '260px solid transparent', borderRight: '260px solid transparent', borderBottom: '190px solid #8E3B2E'}} />
    <div style={{position: 'absolute', left: 340, top: 40, width: 50, height: 110, background: '#6B4A2E'}} />
    <div style={{position: 'absolute', left: 40, top: 190, width: 440, height: 370, background: '#E9E4D8'}} />
    <div style={{position: 'absolute', left: 205, top: 360, width: 110, height: 200, background: '#6B4A2E'}}><div style={{position: 'absolute', right: 14, top: 100, width: 12, height: 12, borderRadius: '50%', background: C.hi}} /></div>
    {[[80, 250], [360, 250]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: 90, height: 80, background: lerpHex('#33384A', '#F2C14E', lit), boxShadow: lit > 0.5 ? `0 0 ${40 * lit}px rgba(242,193,78,.8)` : 'none', border: '6px solid #C9C3B4'}} />)}
    {/* sign */}
    <div style={{position: 'absolute', left: -170, top: 330, width: 10, height: 230, background: '#5A3A22'}} />
    <div style={{position: 'absolute', left: -240, top: 300, width: 150, height: 90, background: sold ? C.red : C.paper, color: sold ? '#fff' : C.line, textAlign: 'center', font: `900 ${sold ? 40 : 26}px/1.05 ${FONT.cap}`, paddingTop: sold ? 22 : 10, transform: 'rotate(-4deg)', boxShadow: '0 6px 0 rgba(0,0,0,.3)'}}>{sold ? 'SOLD' : <>FOR SALE<br /><span style={{color: C.red}}>20% DOWN</span></>}</div>
  </div>
);
const Billboard: React.FC<{sx: number; children: React.ReactNode}> = ({sx, children}) => (
  <div style={{position: 'absolute', left: sx - 230, top: G - 700, width: 460, height: 700}}>
    <div style={{position: 'absolute', left: 215, top: 300, width: 30, height: 400, background: '#3A3E48'}} />
    <div style={{position: 'absolute', left: 0, top: 40, width: 460, height: 270, background: '#101420', border: '10px solid #3A3E48', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, boxShadow: '0 0 60px rgba(127,224,240,.25)'}}>{children}</div>
  </div>
);
const YearPost: React.FC<{sx: number; label: string}> = ({sx, label}) => (
  <div style={{position: 'absolute', left: sx - 70, top: G - 300, width: 140, height: 300}}>
    <div style={{position: 'absolute', left: 64, top: 70, width: 12, height: 230, background: '#8A93A6'}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 140, height: 76, background: '#2E7D32', border: '5px solid #fff', borderRadius: 10, color: '#fff', font: `900 40px/66px ${FONT.cap}`, textAlign: 'center'}}>{label}</div>
  </div>
);

// ---------- captions ----------
const CHUNKS = buildChunks(WORDS, [
  ['three hundred and fifty-four thousand dollars', '$354,000'], ['a hundred and twenty-one dollars', '$121'], ['two hundred and sixty', '$260'],
  ['a hundred dollars', '$100'], ['seventy-two dollars', '$72'], ['twelve hundred dollars', '$1,200'], ['seven thousand', '$7,000'],
  ['ten thousand dollars', '$10,000'], ['fifty-two thousand', '$52,000'], ['a hundred thousand', '$100,000'], ['one hundred', '$100'],
  ['a trillion', '$1 TRILLION'], ['seventeen years', '17 YEARS'], ['five years', '5 YEARS'],
], /^(\$.*|\d.*|apple|broke|crash|laptop|car|motorbike|house|pizza|dinner|iphone|1997)$/i);
const money = (v: number) => '$' + Math.round(v).toLocaleString('en-US');
const YEARPOSTS: [number, string][] = [[wt('seventy-two'), '1985'], [wt('twenty-one'), '1997'], [wt('twelve'), '2000'], [T.iphone, '2007'], [wt('ten', 0, st(13)), '2010'], [T.trillion, '2018'], [wt('hundred', 0, st(15)), '2020'], [T.today, 'TODAY']];

// ---------- the Short ----------
export const WI02B: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const i = Math.min(NF - 1, fr);
  const gx = X[i];
  const mode = modeAt(t);
  // camera: follows him; at the end it rewinds to 1997
  const rewind = lin(t, T.holding - 2.0, T.holding - 0.2);
  const back1997 = xAt(wt('twenty-one')) - 380;
  const camFollow = gx - 360;
  const camX = camFollow + (back1997 - camFollow) * ease(rewind);
  const shakeT = [T.crash1, T.crash2].find((c) => t > c && t < c + 0.6);
  const shake = shakeT !== undefined ? Math.sin(fr * 2.6) * 14 * (1 - (t - shakeT) / 0.6) : 0;
  const year = yearAt(t);
  const camYear = eraOfX(camX + 400);
  const [s0, s1] = sky(camYear);
  const v = valueAt(year), label = money(v);
  const arrived = BEATS.slice(1).reduce((a, b) => (t >= b.at ? b.at : a), -9);
  const pulse = 1 + 0.12 * Math.max(0, 1 - (t - arrived) * 4);
  const yearsIn = Math.max(0, Math.floor(year - 1980.948));
  const sxOf = (wx: number) => wx - camX;

  // his pose
  const ph = FOOT[i] / 85 * Math.PI / 2;
  const holding = t < T.booth + 0.3 ? 'bill' : t >= T.pizza && t < T.dinner ? 'pizza' : t >= T.dinner && t < T.laptop ? 'plate' : t >= T.laptop && t < T.goes ? 'laptop' : null;
  let p: Pose;
  const near = (a: number, b: number) => t >= a && t < b;
  if (mode === 'drive') p = sit(t);
  else if (mode === 'ride') p = ride(t);
  else if (near(T.booth - 0.2, T.booth + 0.6)) p = handOver(ease(lin(t, T.booth - 0.2, T.booth + 0.25)));
  else if (near(T.pizza - 0.25, T.pizza + 0.35) || near(T.dinner - 0.3, T.dinner + 0.3) || near(T.laptop - 0.35, T.laptop + 0.3)) p = bend();
  else if (near(T.goes, T.goes + 1.4)) p = lookDown();
  else if (near(T.bye, T.bye + 1.0)) p = wave(t);
  else if (near(wt('twelve'), wt('twelve') + 0.7) || near(T.sold, T.sold + 0.4)) p = cheer(t);
  else if (t >= T.hundred - 0.3) p = wave(t);
  else if (mode === 'stand') p = idle(t);
  else if (mode === 'run') p = run(ph);
  else if (mode === 'slow') p = slumpWalk(ph);
  else p = walk(ph, Math.min(1, V[i] / 250));
  if (holding && holding !== 'bill' && !near(T.pizza - 0.25, T.pizza + 0.35) && !near(T.dinner - 0.3, T.dinner + 0.3) && !near(T.laptop - 0.35, T.laptop + 0.3)) p = carry(p);
  // hands position for carried things
  const sx = sxOf(gx);
  const [hx, hy] = hands(sx, G, 1, p);

  // vehicles
  const carStart = T.car + 0.25, carStop = T.crash2 + 0.1, carGone = T.bye + 0.05;
  const carX = t < carStart ? P.car : t < carGone ? Math.max(P.car, gx + 30) : xAt(carGone) + 30 - (t - carGone) * 900 * ease(Math.min(1, (t - carGone) * 1.5));
  const bikeX = t < T.bike + 0.1 ? P.bike : t < T.newcar - 0.35 ? gx + 10 : xAt(T.newcar - 0.35) + 10;
  const newX = t < T.newcar + 0.2 ? P.newcar : t < T.house + 0.4 ? gx + 30 : xAt(T.house + 0.4) + 30; // parks at the house
  const wheel = (x: number) => (x / (2 * Math.PI * 44)) * 360;
  const inCar = t >= carStart && t < carStop + 0.5, onBike = t >= T.bike + 0.1 && t < T.newcar - 0.35, inNew = t >= T.newcar + 0.2 && t < T.house + 0.4;
  const smoke = t > T.crash2 ? lin(t, T.crash2, T.crash2 + 1.6) : 0;

  // weather
  const rain = camYear > 1996 && camYear < 1999.2;
  const confetti = t > T.boom && t < T.boom + 2.4;
  const sparkle = t > T.trillion && t < T.trillion + 1.6;
  const fireworks = t > T.sold && t < T.sold + 3.5;

  return (
    <AbsoluteFill style={{background: s0, transform: `translate(${shake}px, ${shake * 0.5}px)`}}>
      <AbsoluteFill style={{background: `linear-gradient(${s0}, ${s1} 62%)`}} />
      {/* far skyline (parallax) */}
      {FAR.map((b) => { const bx = b.x - camX * 0.35; return bx > -500 && bx < 1300 ? <Building key={b.seed} b={b} sx={bx} far /> : null; })}
      {/* street */}
      {NEAR.map((b) => { const bx = b.x - camX; return bx > -500 && bx < 1300 ? <Building key={b.seed} b={b} sx={bx} /> : null; })}
      <div style={{position: 'absolute', left: 0, right: 0, top: G, bottom: 0, background: '#23262E'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: G, height: 40, background: '#3A3E48'}} />
      {Array.from({length: 12}, (_, k) => <div key={k} style={{position: 'absolute', left: ((k * 220 - camX) % 2640 + 2640) % 2640 - 400, top: G + 120, width: 120, height: 12, background: 'rgba(255,255,255,.25)'}} />)}

      {/* props in the world */}
      {YEARPOSTS.map(([tt, l]) => { const px = sxOf(xAt(tt) + 300); return px > -200 && px < 1300 ? <YearPost key={l} sx={px} label={l} /> : null; })}
      {Math.abs(sxOf(P.booth) - 400) < 1200 && <Booth sx={sxOf(P.booth)} fr={fr} />}
      {t < T.pizza && <div style={{position: 'absolute', left: sxOf(P.pizza) - 100, top: G - 90, width: 200, height: 90}}><div style={{position: 'absolute', left: 0, top: 0, width: 200, height: 16, background: '#7A4E2C'}} /><div style={{position: 'absolute', left: 14, top: 16, width: 12, height: 74, background: '#5A3A22'}} /><div style={{position: 'absolute', right: 14, top: 16, width: 12, height: 74, background: '#5A3A22'}} /><PizzaBox x={100} y={0} /></div>}
      {Math.abs(sxOf(P.dinner) - 400) < 1200 && <Table sx={sxOf(P.dinner)}>{t < T.dinner ? <Plate x={110} y={0} /> : <PizzaBox x={110} y={0} />}</Table>}
      {Math.abs(sxOf(P.laptop) - 400) < 1200 && <Table sx={sxOf(P.laptop)}>{t < T.laptop ? <Laptop x={110} y={0} /> : <Plate x={110} y={0} s={0.9} />}</Table>}
      {t >= T.goes + 0.45 && Math.abs(sxOf(P.smash) - 400) < 1200 && Array.from({length: 9}, (_, k) => <div key={k} style={{position: 'absolute', left: sxOf(P.smash) - 80 + k * 20 + (k % 3) * 6, top: G - 14 + (k % 2) * 6, width: 22 + (k % 3) * 8, height: 10, background: k % 2 ? '#3C7BE0' : '#8A93A6', transform: `rotate(${k * 37}deg)`}} />)}
      {Math.abs(sxOf(P.billboard07) - 400) < 1300 && <Billboard sx={sxOf(P.billboard07)}><div style={{width: 90, height: 170, borderRadius: 16, background: '#1C1F26', border: '6px solid #8A93A6', position: 'relative'}}><div style={{position: 'absolute', inset: 8, top: 14, bottom: 22, background: 'linear-gradient(#3C7BE0, #7FE0F0)'}} /></div><div style={{font: `900 64px ${FONT.cap}`, color: '#fff'}}>2007</div></Billboard>}
      {Math.abs(sxOf(P.billboard18) - 400) < 1300 && <Billboard sx={sxOf(P.billboard18)}><div style={{font: `900 92px/1 ${FONT.cap}`, color: C.hi, textAlign: 'center'}}>$1T<div style={{font: `700 28px ${FONT.mono}`, color: '#fff', marginTop: 8}}>APPLE · 2018</div></div></Billboard>}
      {Math.abs(sxOf(P.house) - 400) < 1400 && <House sx={sxOf(P.house)} lit={lin(t, T.sold, T.sold + 0.6)} sold={t >= T.sold} />}

      {/* vehicles parked or moving */}
      {Math.abs(sxOf(carX) - 400) < 1300 && <Car sx={sxOf(carX)} rot={wheel(carX)} color="#8A7A5C" smoke={smoke} bounce={inCar ? Math.sin(t * 18) * 2 : 0}>
        {inCar && <Rig x={sxOf(carX) - 20} y={G - 30} s={0.8} p={p} upperOnly />}
      </Car>}
      {Math.abs(sxOf(bikeX) - 400) < 1300 && <Bike sx={sxOf(bikeX)} rot={wheel(bikeX)}>{onBike && <Rig x={sxOf(gx) - 20} y={G - 40} s={0.9} p={p} />}</Bike>}
      {Math.abs(sxOf(newX) - 400) < 1300 && <Car sx={sxOf(newX)} rot={wheel(newX)} color="#E9E4D8" shiny bounce={inNew ? Math.sin(t * 16) * 1.5 : 0}>{inNew && <Rig x={sxOf(newX) - 20} y={G - 30} s={0.8} p={p} upperOnly />}</Car>}

      {/* him, on foot */}
      {!inCar && !onBike && !inNew && <Rig x={sx} y={G} s={1} p={p} face={t >= T.hundred - 0.3 && t < T.holding - 2 ? -1 : 1} />}
      {holding === 'bill' && <div style={{position: 'absolute', left: hx - 30, top: hy - 22, width: 80, height: 36, background: C.money, border: '3px solid #4E8F55', borderRadius: 4, transform: 'rotate(-8deg)'}} />}
      {holding === 'pizza' && !near(T.pizza - 0.25, T.pizza + 0.2) && <PizzaBox x={hx + 40} y={hy + 8} />}
      {holding === 'plate' && !near(T.dinner - 0.3, T.dinner + 0.2) && <Plate x={hx + 40} y={hy + 8} />}
      {holding === 'laptop' && !near(T.laptop - 0.35, T.laptop + 0.2) && <Laptop x={hx + 40} y={hy + 14} />}
      {t >= T.goes && t < T.goes + 0.45 && <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${sxOf(P.smash) - 40}px, ${hy + (G - hy) * Math.pow((t - T.goes) / 0.45, 2) - 90}px) rotate(${(t - T.goes) * 300}deg)`}}><Laptop x={70} y={90} /></div>}

      {/* weather and moments */}
      {rain && Array.from({length: 90}, (_, k) => { const x = (k * 97 + fr * 7) % 1180 - 50, y = (k * 211 + fr * 46) % 1250 - 100; return <div key={k} style={{position: 'absolute', left: x, top: y, width: 3, height: 36, background: 'rgba(180,200,230,.45)', transform: 'rotate(12deg)'}} />; })}
      {confetti && Array.from({length: 50}, (_, k) => { const tt = t - T.boom; const x = (k * 131) % 1080, y = -50 + tt * (300 + (k % 5) * 90) + Math.sin(tt * 4 + k) * 20; return <div key={k} style={{position: 'absolute', left: x, top: y, width: 14, height: 22, background: [C.hi, C.red, '#7FE0F0', C.money][k % 4], transform: `rotate(${tt * 400 + k * 30}deg)`}} />; })}
      {sparkle && Array.from({length: 14}, (_, k) => { const tt = (t - T.trillion) * 2 - k * 0.1; const a = k * 0.45; return tt > 0 && tt < 1.4 ? <div key={k} style={{position: 'absolute', left: sxOf(P.billboard18) + Math.cos(a) * 260 * tt, top: G - 520 + Math.sin(a) * 160 * tt, width: 20, height: 20, background: C.hi, transform: 'rotate(45deg)', opacity: 1 - tt / 1.4}} /> : null; })}
      {fireworks && [0, 1, 2].map((b) => { const tt = (t - T.sold - b * 0.6); if (tt < 0 || tt > 1.6) return null; const cx = 250 + b * 300, cy = 380 + (b % 2) * 120; return Array.from({length: 16}, (_, k) => { const a = k * Math.PI / 8; return <div key={b * 20 + k} style={{position: 'absolute', left: cx + Math.cos(a) * 180 * ease(Math.min(1, tt)), top: cy + Math.sin(a) * 180 * ease(Math.min(1, tt)) + tt * tt * 40, width: 12, height: 12, borderRadius: '50%', background: [C.hi, C.red, '#7FE0F0'][b], opacity: 1 - tt / 1.6}} />; }); })}
      {/* rewind: fast lines while the camera runs back to 1997, then the ghost of him in the rain */}
      {rewind > 0 && rewind < 1 && Array.from({length: 16}, (_, k) => <div key={k} style={{position: 'absolute', left: (k * 173) % 1080, top: 300 + (k * 97) % 800, width: 260, height: 6, background: 'rgba(255,255,255,.35)'}} />)}
      {rewind >= 1 && <>
        <div style={{opacity: lin(t, T.holding - 0.2, T.holding + 0.3)}}><Rig x={380} y={G} s={1} p={carry(slumpWalk(t * 4))} /><PizzaBox x={495} y={G - 334 + 60 - 4} /></div>
        <div style={{position: 'absolute', left: 260, top: 640, background: C.red, color: '#fff', font: `900 46px ${FONT.cap}`, padding: '8px 20px', borderRadius: 10, opacity: lin(t, T.holding + 0.2, T.holding + 0.5)}}>1997 · $121</div>
      </>}

      {/* HUD, on a soft dark band so it reads over any skyline */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 520, background: 'linear-gradient(rgba(8,10,18,.72), rgba(8,10,18,0))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 185, textAlign: 'center'}}>
        <div style={{font: `700 30px ${FONT.mono}`, letterSpacing: 6, color: 'rgba(255,255,255,.8)', textShadow: '0 2px 8px rgba(0,0,0,.6)'}}>YOUR $100 IN APPLE</div>
        <div style={{font: `900 ${Math.min(136, Math.floor(1100 / label.length))}px/1.1 ${FONT.cap}`, color: v >= 1000 ? C.hi : '#fff', WebkitTextStroke: '12px #0B0F18', paintOrder: 'stroke fill', transform: `scale(${pulse})`, marginTop: 4, fontVariantNumeric: 'tabular-nums'}}>{label}</div>
        <div style={{font: `700 28px ${FONT.mono}`, letterSpacing: 4, color: 'rgba(255,255,255,.75)', marginTop: 4, textShadow: '0 2px 8px rgba(0,0,0,.6)'}}>{Math.floor(year)} · {yearsIn === 0 ? 'IPO DAY' : `${yearsIn} YEAR${yearsIn > 1 ? 'S' : ''} IN`}</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 112, textAlign: 'center', font: `700 26px ${FONT.mono}`, letterSpacing: 4, color: 'rgba(255,255,255,.55)'}}>WHAT IF · 02</div>
      <Captions chunks={CHUNKS} />
      {t > VO.dur && <div style={{position: 'absolute', left: 90, right: 170, top: 1260, textAlign: 'center', font: `600 30px/1.45 ${FONT.mono}`, color: 'rgba(255,255,255,.7)', opacity: lin(fr, f(VO.dur), f(VO.dur) + 8)}}>Bought at the $22 IPO price.<br />Splits included, dividends not.<br />Past returns don't predict future returns.</div>}

      {/* sound: voice, a light bed, and only a few small effects */}
      <Audio src={staticFile('shorts/wi02/vo.wav')} />
      <Audio src={staticFile('bf01/music/serene-view-bed.mp3')} volume={(x) => 0.13 * lin(x, 0, 20) * (1 - lin(x, WI02B_DURATION - 30, WI02B_DURATION))} />
      {[T.pizza, T.dinner, T.laptop].map((tt) => <Sequence key={tt} from={f(tt)} layout="none"><Audio src={staticFile('sfx/mechanical/drop.mp3')} volume={0.25} /></Sequence>)}
      <Sequence from={f(T.goes + 0.45)} layout="none"><Audio src={staticFile('sfx/mechanical/delete.mp3')} volume={0.3} /></Sequence>
      <Sequence from={f(T.bye)} layout="none"><Audio src={staticFile('sfx/mechanical/swipe.mp3')} volume={0.3} /></Sequence>
      <Sequence from={f(T.sold)} layout="none"><Audio src={staticFile('sfx/mechanical/success.mp3')} volume={0.3} /></Sequence>
    </AbsoluteFill>
  );
};
