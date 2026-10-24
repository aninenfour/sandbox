// What If 02 (voiced) · "What if you put $100 into Apple at its 1980 IPO?" (YouTube Short / Reel, 1080x1920).
// Voiceover with word captions; at each milestone the guy gets what the money would buy, and loses it in the crashes.
// Script: youtube/shorts/what-if-02-apple-voiced.md. Prices: public/shorts/d02/aapl.json (real, split-adjusted, $22 IPO, no dividends).
// Every beat is pinned to a spoken word from public/shorts/wi02/words.json, so numbers land as they are said.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, Captions, FONT, Figure, buildChunks, ease, f, lin, pop, type Word} from './kit';
import {Icon} from './D01';
import DATA from '../../public/shorts/d02/aapl.json';
import VO from '../../public/shorts/wi02/words.json';

const S = VO.sentences;
const WORDS = VO.words as Word[];
const st = (i: number) => S[i].start;
const wt = (w: string, n = 0, after = 0) => WORDS.filter((x) => x.start >= after && x.w.toLowerCase().replace(/[.,!?]/g, '') === w.toLowerCase())[n].start;
export const WI02_DURATION = f(VO.dur + 2.4);

// ---------- money path ----------
const PTS = DATA.pts as [number, number][];
const RUNMAX: number[] = [];
PTS.forEach(([, v], i) => RUNMAX.push(Math.max(v, i ? RUNMAX[i - 1] : v)));
const idxAt = (y: number) => { let lo = 0, hi = PTS.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (PTS[m][0] <= y) lo = m; else hi = m - 1; } return lo; };
const valueAt = (y: number) => { const i = idxAt(y), j = Math.min(PTS.length - 1, i + 1); const [ya, va] = PTS[i], [yb, vb] = PTS[j]; return yb === ya ? va : va + (vb - va) * Math.max(0, Math.min(1, (y - ya) / (yb - ya))); };

// the counter travels to each year between `from` (sentence start) and `at` (the spoken number)
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

// ---------- items ----------
type Exit = 'fade' | 'poof' | 'drive';
const ITEMS: {k: string; at: number; out: number; exit: Exit; label: string; mood: 'happy' | 'neutral' | 'smug'}[] = [
  {k: 'bill100', at: 0, out: wt('seventy-two') - 0.1, exit: 'fade', label: '$100', mood: 'neutral'},
  {k: 'pizza', at: wt('pizza') - 0.25, out: st(3), exit: 'fade', label: 'PIZZA NIGHT', mood: 'neutral'},
  {k: 'dinner', at: wt('dinner') - 0.25, out: st(6), exit: 'fade', label: 'NICE DINNER', mood: 'neutral'},
  {k: 'laptop', at: wt('laptop') - 0.25, out: wt('goes'), exit: 'poof', label: 'NEW LAPTOP', mood: 'happy'},
  {k: 'usedcar', at: wt('used') - 0.15, out: wt('bye'), exit: 'drive', label: 'USED CAR', mood: 'happy'},
  {k: 'motorbike', at: wt('motorbike') - 0.25, out: st(14), exit: 'fade', label: 'MOTORBIKE', mood: 'happy'},
  {k: 'newcar', at: wt('brand', 1) - 0.1, out: st(15), exit: 'fade', label: 'BRAND NEW CAR', mood: 'smug'},
  {k: 'downpay', at: wt('payment') - 0.3, out: st(16), exit: 'fade', label: 'HOUSE DEPOSIT', mood: 'happy'},
  {k: 'house', at: wt('fifty-four') + 0.4, out: 999, exit: 'fade', label: 'A HOUSE', mood: 'happy'},
];

// new icons for this episode (200x200 box, same flat style as kit and D01)
const Art: React.FC<{k: string}> = ({k}) => {
  const s = {width: 480, height: 480, viewBox: '0 0 200 200', style: {overflow: 'visible' as const}};
  switch (k) {
    case 'bill100': return <svg {...s}><rect x={10} y={55} width={180} height={90} rx={8} fill={C.money} stroke="#4E8F55" strokeWidth={6} /><rect x={22} y={66} width={156} height={68} rx={4} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth={3} /><circle cx={100} cy={100} r={26} fill="rgba(0,0,0,.14)" /><text x={100} y={112} textAnchor="middle" fontSize={32} fontWeight={900} fill="#2E5E33" fontFamily={FONT.cap}>100</text><text x={34} y={86} fontSize={18} fontWeight={900} fill="#2E5E33" fontFamily={FONT.cap}>100</text><text x={140} y={130} fontSize={18} fontWeight={900} fill="#2E5E33" fontFamily={FONT.cap}>100</text></svg>;
    case 'dinner': return <svg {...s}><ellipse cx={100} cy={130} rx={90} ry={34} fill="#E9E4D8" /><ellipse cx={100} cy={126} rx={66} ry={22} fill="#D9D3C4" /><path d="M62 122 Q80 98 120 104 Q140 110 136 124 Q100 136 62 122 Z" fill="#8E3B2E" /><circle cx={78} cy={124} r={9} fill="#7BC47F" /><circle cx={90} cy={130} r={7} fill="#7BC47F" /><path d="M20 70 L20 150 M12 70 L12 95 M28 70 L28 95 M12 95 Q20 104 28 95" stroke="#C9CED3" strokeWidth={5} fill="none" /><path d="M184 70 Q170 95 184 120 L184 150" stroke="#C9CED3" strokeWidth={6} fill="none" /></svg>;
    case 'laptop': return <svg {...s}><rect x={40} y={50} width={120} height={80} rx={8} fill="#1C1F26" stroke="#8A93A6" strokeWidth={5} /><rect x={50} y={60} width={100} height={60} rx={4} fill="#3C7BE0" /><path d="M20 135 L180 135 L170 152 L30 152 Z" fill="#C9CED3" /><rect x={85} y={136} width={30} height={5} rx={2} fill="#8A93A6" /></svg>;
    case 'usedcar': return <svg {...s}><path d="M15 130 L25 100 L60 95 L80 70 L135 70 L160 98 L185 105 L185 130 Z" fill="#8A7A5C" /><path d="M86 78 L130 78 L148 98 L72 98 Z" fill="#9CC3F0" /><circle cx={55} cy={135} r={20} fill={C.line} /><circle cx={150} cy={135} r={20} fill={C.line} /><circle cx={55} cy={135} r={8} fill={C.grey} /><circle cx={150} cy={135} r={8} fill={C.grey} /><path d="M120 108 l14 6 M40 112 l10 -4" stroke="#5A4A30" strokeWidth={4} /><rect x={168} y={110} width={12} height={8} fill="#F2C14E" /></svg>;
    case 'motorbike': return <svg {...s}><circle cx={45} cy={135} r={30} fill="none" stroke={C.line} strokeWidth={12} /><circle cx={160} cy={135} r={30} fill="none" stroke={C.line} strokeWidth={12} /><path d="M45 135 L85 100 L130 100 L160 135 M85 100 L100 135 L130 100" stroke={C.grey} strokeWidth={8} fill="none" strokeLinejoin="round" /><path d="M78 96 Q100 78 128 92 L132 104 L84 106 Z" fill={C.red} /><path d="M128 92 L150 72 L162 74" stroke={C.grey} strokeWidth={7} fill="none" strokeLinecap="round" /></svg>;
    case 'newcar': return <svg {...s}><path d="M10 132 L18 108 L55 100 L82 72 L138 72 L165 100 L190 108 L190 132 Z" fill="#E9E4D8" /><path d="M88 80 L134 80 L154 100 L72 100 Z" fill="#9CC3F0" /><path d="M18 116 L190 116" stroke="#C9CED3" strokeWidth={3} /><circle cx={52} cy={137} r={20} fill={C.line} /><circle cx={152} cy={137} r={20} fill={C.line} /><circle cx={52} cy={137} r={9} fill="#E9E4D8" /><circle cx={152} cy={137} r={9} fill="#E9E4D8" />{[[40, 60], [175, 70], [110, 52]].map(([x, y], i) => <path key={i} d={`M${x} ${y - 12} L${x + 3} ${y - 3} L${x + 12} ${y} L${x + 3} ${y + 3} L${x} ${y + 12} L${x - 3} ${y + 3} L${x - 12} ${y} L${x - 3} ${y - 3} Z`} fill={C.hi} />)}</svg>;
    case 'downpay': return <svg {...s}><path d="M30 95 L100 35 L170 95 Z" fill="#8E3B2E" /><rect x={45} y={95} width={110} height={80} fill="#E9E4D8" /><rect x={88} y={125} width={26} height={50} fill="#6B4A2E" /><rect x={110} y={20} width={86} height={40} rx={6} fill={C.hi} transform="rotate(12 150 40)" /><text x={152} y={49} textAnchor="middle" fontSize={22} fontWeight={900} fill={C.line} fontFamily={FONT.cap} transform="rotate(12 150 40)">20%</text></svg>;
    case 'house': return <svg {...s}><path d="M10 100 L100 25 L190 100 Z" fill="#8E3B2E" /><rect x={25} y={100} width={150} height={85} fill="#E9E4D8" /><rect x={88} y={132} width={28} height={53} fill="#6B4A2E" /><rect x={38} y={114} width={30} height={26} fill="#F2C14E" /><rect x={134} y={114} width={30} height={26} fill="#F2C14E" /><rect x={140} y={40} width={18} height={40} fill="#6B4A2E" /><path d="M0 185 L200 185" stroke="#4E8A3E" strokeWidth={10} /></svg>;
    default: return <div style={{transform: 'scale(1.333)', transformOrigin: '0 0'}}><Icon k={k} /></div>;
  }
};

const ItemSlot: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      {ITEMS.map((it, i) => {
        const a = f(it.at), o = f(it.out);
        if (fr < a || fr > o + 24) return null;
        // drop in from above with gravity, squash on landing, settle
        const fall = i === 0 ? 1 : Math.min(1, (fr - a) / 9);
        const y0 = (1 - fall * fall) * -520;
        const land = fr - a - 9;
        const squash = i === 0 || land < 0 ? 1 : 1 - 0.18 * Math.exp(-land / 3) * Math.cos(land / 1.6);
        let tx = 0, ty = y0, sc = 1, op = 1, rot = 0;
        if (fr > o) {
          const p = (fr - o) / 24;
          if (it.exit === 'drive') { tx = ease(p) * 900; rot = -4; }
          else if (it.exit === 'poof') { sc = 1 + 0.25 * Math.min(1, p * 4) - 1.25 * ease(Math.max(0, p * 1.6 - 0.25)); rot = p * 25; }
          else { ty = ease(p) * 160; op = 1 - p; sc = 1 - 0.3 * p; }
        }
        const lp = pop(fr, a + 8, 12, 220);
        return (
          <React.Fragment key={it.k}>
            <div style={{position: 'absolute', left: 655 - 240, top: 690, width: 480, height: 480, transformOrigin: '50% 100%', transform: `translate(${tx}px, ${ty + (land > 12 && fr <= o ? Math.sin((fr - a) / 18) * 7 : 0)}px) scale(${sc * (2 - squash)}, ${sc * squash}) rotate(${rot}deg)`, opacity: Math.max(0, op)}}>
              <Art k={it.k} />
            </div>
            {/* dust where it lands, and puff where it vanishes */}
            {land >= 0 && land < 12 && i > 0 && [-1, 1].map((d) => <div key={d} style={{position: 'absolute', left: 655 + d * (60 + land * 10) - 18, top: 1110 - land * 2, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.25)', opacity: 1 - land / 12}} />)}
            {it.exit === 'poof' && fr > o && fr < o + 20 && Array.from({length: 8}, (_, k) => { const ang = k * 45 * Math.PI / 180, r = (fr - o) * 14; return <div key={k} style={{position: 'absolute', left: 655 + Math.cos(ang) * r - 20, top: 900 + Math.sin(ang) * r - 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(200,205,215,.6)', opacity: 1 - (fr - o) / 20}} />; })}
            {it.exit === 'drive' && fr > o && fr < o + 20 && [0, 1, 2].map((k) => <div key={k} style={{position: 'absolute', left: 475 + ease((fr - o) / 24) * 900 - 120 - k * 50, top: 1010 + k * 30, width: 90, height: 8, borderRadius: 4, background: 'rgba(255,255,255,.4)'}} />)}
            {/* label under the item */}
            {fr <= o && <div style={{position: 'absolute', left: 655, top: 690, transform: `translateX(-50%) scale(${i === 0 ? 1 : lp})`, background: C.paper, color: C.line, font: `900 40px ${FONT.cap}`, padding: '8px 20px', borderRadius: 10, whiteSpace: 'nowrap', letterSpacing: 1}}>{it.label}</div>}
          </React.Fragment>
        );
      })}
    </>
  );
};

// the room changes colour by era
const ERA: [number, string, string][] = [[1980, '#3A2E26', '#2A211B'], [1990, '#24343A', '#1A262B'], [2000, '#232B3D', '#1A2030'], [2010, '#1D2230', '#151924']];
const Room: React.FC<{year: number}> = ({year}) => {
  const e = [...ERA].reverse().find(([y]) => year >= y)!;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1150, background: `linear-gradient(${e[1]}, ${e[2]})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1150, bottom: 0, background: C.floor}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1150, height: 6, background: 'rgba(255,255,255,.06)'}} />
      <div style={{position: 'absolute', left: 540 - 650, top: 900 - 650, width: 1300, height: 1300, borderRadius: '50%', background: `radial-gradient(circle, ${C.lightSoft}, transparent 70%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,.5) 100%)'}} />
    </AbsoluteFill>
  );
};

// small chart under the counter
const X0 = 110, X1 = 900, CT = 500, CB = 640, Y0 = PTS[0][0], Y1 = 2026.81;
const MiniChart: React.FC<{year: number}> = ({year}) => {
  const i = idxAt(year);
  const yMax = RUNMAX[i] * 1.15;
  const X = (y: number) => X0 + (y - Y0) / (Y1 - Y0) * (X1 - X0);
  const Yv = (v: number) => CB - v / yMax * (CB - CT);
  let d = '';
  for (let k = 0; k <= i; k += 3) d += `${k ? 'L' : 'M'}${X(PTS[k][0]).toFixed(1)},${Yv(PTS[k][1]).toFixed(1)}`;
  const v = valueAt(year), tx = X(year), ty = Yv(v);
  d += `L${tx.toFixed(1)},${ty.toFixed(1)}`;
  const falling = valueAt(year - 0.4) > v * 1.15;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <rect x={X0 - 20} y={CT - 20} width={X1 - X0 + 40} height={CB - CT + 50} rx={14} fill="rgba(0,0,0,.25)" />
      <path d={`${d}L${tx.toFixed(1)},${CB}L${X0},${CB}Z`} fill="rgba(255,201,60,.14)" />
      <path d={d} fill="none" stroke={C.hi} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={tx} cy={ty} r={9} fill={falling ? C.red : '#fff'} />
      {[1980, 2000, 2020].map((yy) => <text key={yy} x={X(yy)} y={CB + 24} textAnchor="middle" fill="rgba(255,255,255,.35)" style={{font: `600 20px ${FONT.mono}`}}>{yy}</text>)}
    </svg>
  );
};

const CHUNKS = buildChunks(WORDS, [
  ['three hundred and fifty-four thousand dollars', '$354,000'], ['a hundred and twenty-one dollars', '$121'], ['two hundred and sixty', '$260'],
  ['a hundred dollars', '$100'], ['seventy-two dollars', '$72'], ['twelve hundred dollars', '$1,200'], ['seven thousand', '$7,000'],
  ['ten thousand dollars', '$10,000'], ['fifty-two thousand', '$52,000'], ['a hundred thousand', '$100,000'], ['one hundred', '$100'],
  ['a trillion', '$1 TRILLION'], ['seventeen years', '17 YEARS'], ['five years', '5 YEARS'],
], /^(\$.*|\d.*|apple|broke|crash|laptop|car|motorbike|house|pizza|dinner|iphone|1997)$/i);

const money = (v: number) => '$' + Math.round(v).toLocaleString('en-US');

export const WI02: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const year = yearAt(t);
  const v = valueAt(year);
  const label = money(v);
  const yearsIn = Math.max(0, Math.floor(year - 1980.948));
  const arrived = BEATS.slice(1).reduce((a, b) => (t >= b.at ? b.at : a), -9);
  const pulse = 1 + 0.12 * Math.max(0, 1 - (t - arrived) * 4);
  const item = [...ITEMS].reverse().find((it) => t >= it.at && t < it.out + 0.4);
  const lost = (t >= wt('goes') && t < st(10)) || (t >= wt('bye') && t < st(13));
  const hop = [wt('twelve'), wt('seven'), wt('fifty-two'), wt('fifty-four')].reduce((h, at) => Math.max(h, t > at && t < at + 0.5 ? Math.sin((t - at) / 0.5 * Math.PI) * 60 : 0), 0);
  const endAt = S[S.length - 1].end;
  return (
    <AbsoluteFill style={{background: C.night}}>
      <Room year={year} />
      <MiniChart year={year} />
      <Figure who="man" x={265} y={1150} s={1.05} pose={{armL: lost ? 150 : 20, armR: lost ? -150 : item && item.k !== 'bill100' ? -70 : -15, mood: lost ? 'worried' : item?.mood ?? 'neutral', look: 1, bob: -hop}} />
      <ItemSlot />

      {/* counter */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 205, textAlign: 'center'}}>
        <div style={{font: `700 32px ${FONT.mono}`, letterSpacing: 6, color: 'rgba(255,255,255,.75)'}}>YOUR $100 IN APPLE</div>
        <div style={{font: `900 ${Math.min(140, Math.floor(1150 / label.length))}px/1.1 ${FONT.cap}`, color: v >= 1000 ? C.hi : '#fff', WebkitTextStroke: '12px #0B0F18', paintOrder: 'stroke fill', transform: `scale(${pulse})`, marginTop: 6, fontVariantNumeric: 'tabular-nums'}}>{label}</div>
        <div style={{font: `700 28px ${FONT.mono}`, letterSpacing: 4, color: 'rgba(255,255,255,.6)', marginTop: 4}}>{Math.floor(year)} · {yearsIn === 0 ? 'IPO DAY' : `${yearsIn} YEAR${yearsIn > 1 ? 'S' : ''} IN`}</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 118, textAlign: 'center', font: `700 26px ${FONT.mono}`, letterSpacing: 4, color: 'rgba(255,255,255,.45)'}}>WHAT IF · 02</div>

      <Captions chunks={CHUNKS} />
      {t > endAt && <div style={{position: 'absolute', left: 90, right: 170, top: 1260, textAlign: 'center', font: `600 30px/1.45 ${FONT.mono}`, color: 'rgba(255,255,255,.6)', opacity: lin(fr, f(endAt), f(endAt) + 8)}}>Bought at the $22 IPO price.<br />Splits included, dividends not.<br />Past returns don't predict future returns.</div>}

      {/* sound: voice, a soft music bed, and only a small pop when something lands */}
      <Audio src={staticFile('shorts/wi02/vo.wav')} />
      <Audio src={staticFile('bf01/music/serene-view-bed.mp3')} volume={(x) => 0.13 * lin(x, 0, 20) * (1 - lin(x, WI02_DURATION - 30, WI02_DURATION))} />
      {ITEMS.slice(1).map((it) => <Sequence key={it.k} from={f(it.at) + 8} layout="none"><Audio src={staticFile('sfx/mechanical/drop.mp3')} volume={0.28} /></Sequence>)}
      <Sequence from={f(wt('goes'))} layout="none"><Audio src={staticFile('sfx/mechanical/delete.mp3')} volume={0.25} /></Sequence>
      <Sequence from={f(wt('bye'))} layout="none"><Audio src={staticFile('sfx/mechanical/swipe.mp3')} volume={0.3} /></Sequence>
    </AbsoluteFill>
  );
};
