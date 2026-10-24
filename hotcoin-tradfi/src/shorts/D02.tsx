// What If 02 · "What if you put $100 into Apple at its 1980 IPO?" (YouTube Short / Reel, 1080x1920, no voiceover).
// Real data: Yahoo Finance weekly closes, split-adjusted (2:1 1987, 2:1 2000, 2:1 2005, 7:1 2014, 4:1 2020 = 224x),
// bought at the $22 IPO price, dividends not included. $100 -> 4.545 shares -> 1,018 shares -> $354,047 (23 Oct 2026).
// The chart rescales as the money grows, so 1997's scare looks big at the time and flat in hindsight.
// Timeline keys are shared with scripts/make-d02-sfx.py through public/shorts/d02/keys.json.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, Figure, ease, f, lin} from './kit';
import DATA from '../../public/shorts/d02/aapl.json';
import KEYS from '../../public/shorts/d02/keys.json';

export const D02_DURATION = f(KEYS.dur);
const SERIF = '"Instrument Serif", Georgia, serif';
const PTS = DATA.pts as [number, number][];
const Y0 = PTS[0][0], Y1 = KEYS.keys[KEYS.keys.length - 1].year;
// running maximum, for the chart's auto-scale
const RUNMAX: number[] = [];
PTS.forEach(([, v], i) => RUNMAX.push(Math.max(v, i ? RUNMAX[i - 1] : v)));

const yearAt = (t: number) => {
  const K = KEYS.keys;
  if (t <= K[0].t) return K[0].year;
  // after each milestone the counter holds for a beat, so the line on screen matches the number
  for (let i = 1; i < K.length; i++) if (t <= K[i].t) {
    const a = K[i - 1], b = K[i], hold = Math.min(KEYS.dwell, 0.45 * (b.t - a.t));
    return t < a.t + hold ? a.year : a.year + (b.year - a.year) * (t - a.t - hold) / (b.t - a.t - hold);
  }
  return K[K.length - 1].year;
};
const idxAt = (y: number) => { let lo = 0, hi = PTS.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (PTS[m][0] <= y) lo = m; else hi = m - 1; } return lo; };
const valueAt = (y: number) => {
  const i = idxAt(y), j = Math.min(PTS.length - 1, i + 1);
  const [ya, va] = PTS[i], [yb, vb] = PTS[j];
  return yb === ya ? va : va + (vb - va) * Math.max(0, Math.min(1, (y - ya) / (yb - ya)));
};
const money = (v: number) => '$' + Math.round(v).toLocaleString('en-US');
const niceStep = (max: number) => { const p = Math.pow(10, Math.floor(Math.log10(max))); for (const m of [0.25, 0.5, 1, 2, 2.5, 5]) if (max / (p * m) <= 4.5) return p * m; return p * 10; };

// chart box
const X0 = 90, X1 = 900, TOP = 600, BOT = 1180;
const Chart: React.FC<{year: number; mood: string}> = ({year, mood}) => {
  const i = idxAt(year);
  const yMax = RUNMAX[i] * 1.22;
  const X = (y: number) => X0 + (y - Y0) / (Y1 - Y0) * (X1 - X0);
  const Yv = (v: number) => BOT - v / yMax * (BOT - TOP);
  let d = '';
  for (let k = 0; k <= i; k += 2) d += `${k ? 'L' : 'M'}${X(PTS[k][0]).toFixed(1)},${Yv(PTS[k][1]).toFixed(1)}`;
  const v = valueAt(year), tx = X(year), ty = Yv(v);
  d += `L${tx.toFixed(1)},${ty.toFixed(1)}`;
  const step = niceStep(yMax);
  const ticks = Array.from({length: Math.floor(yMax / step)}, (_, k) => (k + 1) * step);
  const falling = valueAt(year - 0.4) > v * 1.15;
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {ticks.map((tk) => (
          <g key={tk}>
            <line x1={X0} x2={X1} y1={Yv(tk)} y2={Yv(tk)} stroke="rgba(255,255,255,.08)" strokeWidth={2} />
            <text x={X0} y={Yv(tk) - 10} fill="rgba(255,255,255,.4)" style={{font: `600 24px ${FONT.mono}`}}>{money(tk)}</text>
          </g>
        ))}
        <line x1={X0} x2={X1} y1={BOT} y2={BOT} stroke="rgba(255,255,255,.25)" strokeWidth={3} />
        {[1980, 1990, 2000, 2010, 2020].map((yy) => <text key={yy} x={X(yy) - 30} y={BOT + 40} fill="rgba(255,255,255,.4)" style={{font: `600 24px ${FONT.mono}`}}>{yy}</text>)}
        <path d={`${d}L${tx.toFixed(1)},${BOT}L${X0},${BOT}Z`} fill="rgba(255,201,60,.12)" />
        <path d={d} fill="none" stroke={C.hi} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
        {falling && <circle cx={tx} cy={ty} r={34} fill="rgba(227,38,47,.35)" />}
        <circle cx={tx} cy={ty} r={12} fill={falling ? C.red : '#fff'} />
      </svg>
      {/* the investor rides the tip of the line */}
      <Figure who="man" x={tx} y={ty - 6} s={0.3} pose={{armL: falling ? 160 : 40, armR: falling ? -160 : -40, mood: falling ? 'worried' : (mood as 'happy' | 'neutral' | 'worried')}} />
    </>
  );
};

export const D02: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const year = yearAt(t);
  const v = valueAt(year);
  const K = KEYS.keys;
  const ki = Math.max(0, K.reduce((a, k, i) => (t >= k.t ? i : a), -1));
  const key = K[ki];
  const keyAt = ki === 0 ? 0 : f(key.t);
  const ending = t >= KEYS.end;
  const endP = lin(fr, f(KEYS.end), f(KEYS.end) + 12);
  const sinceKey = fr - keyAt;
  const pulse = ki > 0 ? 1 + 0.1 * Math.max(0, 1 - sinceKey / 8) : 1;
  const yearsIn = Math.max(0, Math.floor(year - 1980.95));
  const label = money(v);
  return (
    <AbsoluteFill style={{background: `linear-gradient(${C.wall}, ${C.night})`}}>
      <AbsoluteFill style={{background: 'radial-gradient(90% 60% at 50% 45%, rgba(242,193,78,.08), transparent 70%)'}} />
      {/* the year, huge and faint behind the chart */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 650, textAlign: 'center', font: `400 380px/1 ${FONT.display}`, color: 'rgba(255,255,255,.05)', opacity: 1 - endP}}>{Math.floor(year)}</div>

      <AbsoluteFill style={{opacity: 1 - endP}}>
        <Chart year={year} mood={key.mood} />
      </AbsoluteFill>

      {/* counter */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', opacity: 1 - endP * 0.2}}>
        <div style={{font: `700 34px ${FONT.mono}`, letterSpacing: 6, color: 'rgba(255,255,255,.75)'}}>YOUR $100 IN APPLE</div>
        <div style={{font: `900 ${Math.min(150, Math.floor(1250 / label.length))}px/1.1 ${FONT.cap}`, color: v >= 1000 ? C.hi : '#fff', WebkitTextStroke: '12px #0B0F18', paintOrder: 'stroke fill', transform: `scale(${pulse})`, marginTop: 10, fontVariantNumeric: 'tabular-nums'}}>{label}</div>
        <div style={{font: `700 30px ${FONT.mono}`, letterSpacing: 4, color: 'rgba(255,255,255,.6)', marginTop: 8}}>{Math.floor(year)} · {yearsIn === 0 ? 'IPO DAY' : `${yearsIn} YEAR${yearsIn > 1 ? 'S' : ''} IN`}</div>
      </div>

      {/* milestone line */}
      {!ending && (
        <div key={ki} style={{position: 'absolute', left: 70, right: 170, top: 1290, textAlign: 'center', font: `italic 400 76px/1.15 ${SERIF}`, color: '#fff', textShadow: '0 4px 18px rgba(0,0,0,.7)', opacity: ki === 0 ? 1 : lin(fr, keyAt, keyAt + 5), transform: `translateY(${ki === 0 ? 0 : (1 - ease(lin(fr, keyAt, keyAt + 8))) * 20}px)`}}>{key.line}</div>
      )}

      {/* the lesson */}
      {ending && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34, padding: '260px 170px 0 90px', textAlign: 'center'}}>
          <div style={{font: `italic 400 90px/1.1 ${SERIF}`, color: '#fff', opacity: endP}}>The hard part wasn't buying.</div>
          <div style={{font: `italic 400 90px/1.1 ${SERIF}`, color: C.hi, opacity: lin(fr, f(KEYS.end) + 30, f(KEYS.end) + 40)}}>It was holding on in 1997.</div>
          <div style={{font: `600 30px/1.4 ${FONT.mono}`, color: 'rgba(255,255,255,.55)', marginTop: 40, opacity: lin(fr, f(KEYS.end) + 60, f(KEYS.end) + 70)}}>Bought at the $22 IPO price. Splits included, dividends not.<br />Past returns don't predict future returns.</div>
        </AbsoluteFill>
      )}

      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', font: `700 26px ${FONT.mono}`, letterSpacing: 4, color: 'rgba(255,255,255,.45)'}}>WHAT IF · 02</div>

      <Audio src={staticFile('shorts/d02/beat.wav')} />
    </AbsoluteFill>
  );
};
