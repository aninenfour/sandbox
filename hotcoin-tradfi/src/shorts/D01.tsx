// What If 01 · "Your money doubles every second" (YouTube Short / Reel, 1080x1920, no voiceover).
// One rule, one counter, a short line at each milestone, and a world that escalates: room, street, sky, space.
// Ends on the real lesson: at 7% a year money doubles about every 10 years (rule of 72: 72 / 7 ≈ 10.3).
// Timing constants are shared with scripts/make-doubling-sfx.py (the beat that hits on every doubling).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, Figure, Fruit, ease, f, lin, pop} from './kit';

export const T0 = 1.2, STEP = 1.0, N = 40; // first doubling at 1.2 s, then one every second, 40 doublings
const tN = (n: number) => T0 + (n - 1) * STEP; // time of the n-th doubling
const END_AT = tN(N) + 1.8;
export const D01_DURATION = f(END_AT + 4.6);
const SERIF = '"Instrument Serif", Georgia, serif';

// milestone: after doubling n, money = 2^n
const MILES: {n: number; line: string; icon: string}[] = [
  {n: 0, line: 'You have $1. It doubles every second.', icon: 'bill'},
  {n: 2, line: 'A coffee.', icon: 'coffee'},
  {n: 5, line: 'Pizza for two.', icon: 'pizza'},
  {n: 8, line: 'New sneakers.', icon: 'sneaker'},
  {n: 10, line: 'A new phone.', icon: 'phone'},
  {n: 15, line: 'A new car.', icon: 'car'},
  {n: 18, line: 'A small house.', icon: 'house'},
  {n: 20, line: 'Millionaire. 20 seconds in.', icon: 'case'},
  {n: 25, line: 'A private jet.', icon: 'jet'},
  {n: 28, line: 'A superyacht.', icon: 'yacht'},
  {n: 30, line: 'Billionaire.', icon: 'gold'},
  {n: 35, line: 'Any sports team you want.', icon: 'trophy'},
  {n: 39, line: 'More than 10% of Apple.', icon: 'apple'},
  {n: 40, line: 'Trillionaire. 40 seconds.', icon: 'crown'},
];

const fmt = (v: number) => {
  if (v < 1e6) return '$' + Math.round(v).toLocaleString('en-US');
  const units: [number, string][] = [[1e12, 'TRILLION'], [1e9, 'BILLION'], [1e6, 'MILLION']];
  const [d, u] = units.find(([d]) => v >= d)!;
  return '$' + (v / d).toFixed(v / d >= 100 ? 0 : 1) + ' ' + u;
};

// ---------- the world ----------
const stageOf = (n: number) => (n < 12 ? 0 : n < 22 ? 1 : n < 31 ? 2 : 3);
const World: React.FC<{n: number}> = ({n}) => {
  const fr = useCurrentFrame();
  const mix = (s: number) => {
    // each stage fades in over the second after its first doubling
    const first = [0, 12, 22, 31][s];
    return s === 0 ? 1 : lin(fr, f(tN(first)) - 6, f(tN(first)) + 18);
  };
  return (
    <AbsoluteFill>
      {/* room */}
      <AbsoluteFill style={{background: `linear-gradient(${C.wall}, ${C.night2})`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1200, bottom: 0, background: C.floor}} />
        <div style={{position: 'absolute', left: 540 - 650, top: 650 - 650, width: 1300, height: 1300, borderRadius: '50%', background: `radial-gradient(circle, ${C.lightSoft}, transparent 70%)`}} />
      </AbsoluteFill>
      {/* street at night */}
      <AbsoluteFill style={{opacity: mix(1), background: 'linear-gradient(#0E1424, #1B2440)'}}>
        {Array.from({length: 9}, (_, i) => {
          const h = 420 + ((i * 173) % 380), w = 140 + ((i * 61) % 60), x = -40 + i * 132;
          return (
            <div key={i} style={{position: 'absolute', left: x, top: 1200 - h, width: w, height: h, background: i % 2 ? '#1F2A45' : '#26324F'}}>
              {Array.from({length: Math.floor(h / 70) * 3}, (_, k) => <div key={k} style={{position: 'absolute', left: 16 + (k % 3) * (w / 3.2), top: 24 + Math.floor(k / 3) * 70, width: 22, height: 30, background: (k * 7 + i + Math.floor(fr / 20)) % 4 ? 'rgba(242,193,78,.6)' : 'rgba(242,193,78,.1)'}} />)}
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1200, bottom: 0, background: '#151B2B'}} />
      </AbsoluteFill>
      {/* sky: clouds stream down, so we feel like we're rising */}
      <AbsoluteFill style={{opacity: mix(2), background: 'linear-gradient(#3B5BA8, #7FA6E0)'}}>
        {Array.from({length: 7}, (_, i) => {
          const y = ((fr * (6 + i) + i * 400) % 2400) - 300;
          return <div key={i} style={{position: 'absolute', left: (i * 211) % 900 - 100, top: y, width: 320, height: 110, borderRadius: 60, background: 'rgba(255,255,255,.85)', filter: 'blur(2px)'}} />;
        })}
      </AbsoluteFill>
      {/* space */}
      <AbsoluteFill style={{opacity: mix(3), background: '#05060B'}}>
        {Array.from({length: 90}, (_, i) => <div key={i} style={{position: 'absolute', left: (i * 397) % 1080, top: ((i * 613) % 1920 + fr * (1 + (i % 3))) % 1920, width: 3 + (i % 3), height: 3 + (i % 3), borderRadius: '50%', background: '#fff', opacity: 0.4 + (i % 5) / 8}} />)}
        <div style={{position: 'absolute', left: -600, top: 1500, width: 2280, height: 2280, borderRadius: '50%', background: 'radial-gradient(circle at 50% 10%, #4B8FD6, #1C3F7A 40%, #0B1A36 70%)', boxShadow: '0 -20px 120px rgba(100,170,255,.45)'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,.5) 100%)'}} />
    </AbsoluteFill>
  );
};

// ---------- icons (flat, drawn in a 200x200 box) ----------
const Icon: React.FC<{k: string}> = ({k}) => {
  const s = {width: 360, height: 360, viewBox: '0 0 200 200', style: {overflow: 'visible' as const}};
  switch (k) {
    case 'bill': return <svg {...s}><rect x={20} y={60} width={160} height={80} rx={8} fill={C.money} stroke="#4E8F55" strokeWidth={6} /><circle cx={100} cy={100} r={24} fill="rgba(0,0,0,.15)" /><text x={100} y={112} textAnchor="middle" fontSize={34} fontWeight={900} fill="#2E5E33" fontFamily={FONT.cap}>1</text></svg>;
    case 'coffee': return <svg {...s}><path d="M55 70 L145 70 L135 170 L65 170 Z" fill="#E9E4D8" /><rect x={50} y={58} width={100} height={18} rx={6} fill="#6B4A2E" /><rect x={60} y={105} width={80} height={30} fill="#C9A86A" /><path d="M90 40 q-10 -15 0 -30 M110 40 q-10 -15 0 -30" stroke="rgba(255,255,255,.6)" strokeWidth={5} fill="none" /></svg>;
    case 'pizza': return <svg {...s}><circle cx={100} cy={100} r={80} fill="#E0A84E" /><circle cx={100} cy={100} r={66} fill="#E35B3A" />{[[70, 80], [125, 75], [95, 125], [140, 120], [65, 125]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="#8E2A1D" />)}<path d="M100 100 L100 20 M100 100 L170 140 M100 100 L30 140" stroke="#E0A84E" strokeWidth={5} /></svg>;
    case 'sneaker': return <svg {...s}><path d="M25 140 L25 95 Q60 90 80 70 L110 100 Q150 105 175 125 L175 140 Z" fill="#F2EEE6" /><rect x={20} y={138} width={160} height={18} rx={8} fill={C.red} /><path d="M70 85 L95 108 M60 95 L85 118" stroke={C.line} strokeWidth={5} /></svg>;
    case 'phone': return <svg {...s}><rect x={60} y={20} width={80} height={160} rx={16} fill="#1C1F26" stroke="#8A93A6" strokeWidth={5} /><rect x={68} y={36} width={64} height={124} rx={6} fill="#3C7BE0" /><rect x={88} y={26} width={24} height={5} rx={2} fill="#8A93A6" /></svg>;
    case 'car': return <svg {...s}><path d="M15 130 L25 100 L60 95 L80 70 L135 70 L160 98 L185 105 L185 130 Z" fill={C.red} /><path d="M86 78 L130 78 L148 98 L72 98 Z" fill="#9CC3F0" /><circle cx={55} cy={135} r={20} fill={C.line} /><circle cx={150} cy={135} r={20} fill={C.line} /><circle cx={55} cy={135} r={8} fill={C.grey} /><circle cx={150} cy={135} r={8} fill={C.grey} /></svg>;
    case 'house': return <svg {...s}><path d="M30 95 L100 35 L170 95 Z" fill="#8E3B2E" /><rect x={45} y={95} width={110} height={80} fill="#E9E4D8" /><rect x={88} y={125} width={26} height={50} fill="#6B4A2E" /><rect x={58} y={110} width={22} height={22} fill="#F2C14E" /><rect x={122} y={110} width={22} height={22} fill="#F2C14E" /></svg>;
    case 'case': return <svg {...s}><rect x={30} y={70} width={140} height={95} rx={10} fill="#3A2C22" /><rect x={80} y={52} width={40} height={22} rx={6} fill="none" stroke="#3A2C22" strokeWidth={8} /><rect x={40} y={82} width={120} height={70} rx={4} fill={C.money} /><text x={100} y={130} textAnchor="middle" fontSize={44} fontWeight={900} fill="#2E5E33" fontFamily={FONT.cap}>$1M</text></svg>;
    case 'jet': return <svg {...s}><path d="M10 110 Q90 95 175 100 Q195 103 190 112 Q180 120 100 122 L20 122 Z" fill="#F2EEE6" /><path d="M80 105 L120 60 L135 60 L115 108 Z M70 118 L105 150 L118 150 L102 118 Z M20 112 L10 80 L25 80 L40 110 Z" fill="#C9CED3" />{[60, 80, 100, 120, 140].map((x) => <circle key={x} cx={x} cy={110} r={4} fill="#3C7BE0" />)}</svg>;
    case 'yacht': return <svg {...s}><path d="M10 130 L190 130 L170 160 L30 160 Z" fill="#F2EEE6" /><path d="M40 130 L60 100 L150 100 L165 130 Z" fill="#E9E4D8" /><path d="M70 100 L85 78 L130 78 L140 100 Z" fill="#C9CED3" /><rect x={10} y={160} width={180} height={10} fill="#3C7BE0" opacity={0.6} />{[80, 100, 120, 140].map((x) => <rect key={x} x={x} y={108} width={12} height={8} fill="#1C1F26" />)}</svg>;
    case 'gold': return <svg {...s}>{[[30, 120], [80, 120], [130, 120], [55, 85], [105, 85], [80, 50]].map(([x, y], i) => <path key={i} d={`M${x} ${y + 30} L${x + 10} ${y} L${x + 40} ${y} L${x + 50} ${y + 30} Z`} fill="#F2C14E" stroke="#B88A1E" strokeWidth={3} />)}</svg>;
    case 'trophy': return <svg {...s}><path d="M60 30 L140 30 L135 90 Q100 120 65 90 Z" fill="#F2C14E" /><path d="M60 40 Q25 40 35 70 Q45 90 65 85 M140 40 Q175 40 165 70 Q155 90 135 85" stroke="#F2C14E" strokeWidth={8} fill="none" /><rect x={92} y={105} width={16} height={35} fill="#F2C14E" /><rect x={65} y={140} width={70} height={20} rx={4} fill="#6B4A2E" /></svg>;
    case 'crown': return <svg {...s}><path d="M25 140 L35 60 L70 100 L100 40 L130 100 L165 60 L175 140 Z" fill="#F2C14E" stroke="#B88A1E" strokeWidth={4} /><rect x={25} y={140} width={150} height={22} rx={4} fill="#E0A84E" />{[[100, 70], [55, 115], [145, 115]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill={C.red} />)}</svg>;
    default: return null;
  }
};

// ---------- the Short ----------
export const D01: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const n = Math.max(0, Math.min(N, Math.floor((t - T0) / STEP) + 1));
  const sinceStep = n > 0 ? fr - f(tN(n)) : 99;
  // the value rolls up to the next power of two over the 6 frames after each doubling
  const shown = n === 0 ? 1 : Math.pow(2, n - 1 + ease(lin(sinceStep, 0, 6)));
  const pulse = n > 0 ? 1 + 0.12 * Math.max(0, 1 - sinceStep / 6) : 1;
  const mile = [...MILES].reverse().find((m) => n >= m.n)!;
  const mileAt = mile.n === 0 ? 0 : f(tN(mile.n));
  const stage = stageOf(n);
  const ending = t >= END_AT;
  const endP = lin(fr, f(END_AT), f(END_AT) + 12);
  const float = stage >= 2 ? Math.sin(fr / 12) * 18 - (stage === 3 ? 40 : 0) : 0;
  const counterSize = Math.min(150, Math.floor(1300 / fmt(shown).length));
  return (
    <AbsoluteFill style={{background: C.night}}>
      <World n={n} />

      {/* person and the thing their money buys right now */}
      <AbsoluteFill style={{opacity: 1 - endP}}>
        <Figure who="man" x={260} y={1200} s={1.05} pose={{armL: 20, armR: n > 0 ? -60 - Math.min(80, n * 2) : -10, mood: n >= 20 ? 'happy' : n >= 8 ? 'smug' : 'neutral', bob: float, look: 1}} />
        <div key={mile.n} style={{position: 'absolute', left: 680 - 180, top: 760 - 180 + float * 0.6, scale: '1.25', transform: `scale(${pop(fr, mileAt, 10, 200)}) rotate(${(1 - pop(fr, mileAt, 10, 200)) * -20}deg)`}}>
          {mile.icon === 'apple'
            ? <div style={{position: 'relative', width: 360, height: 360}}><div style={{position: 'absolute', left: -540 + 180, top: -960 + 180}}><Fruit x={540} y={960} r={130} slice={1} glow={1} /></div></div>
            : <Icon k={mile.icon} />}
        </div>
      </AbsoluteFill>

      {/* counter */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', opacity: 1 - endP}}>
        <div style={{font: `700 34px ${FONT.mono}`, letterSpacing: 8, color: 'rgba(255,255,255,.75)'}}>YOUR MONEY</div>
        <div style={{font: `900 ${counterSize}px/1.1 ${FONT.cap}`, color: n >= 20 ? C.hi : '#fff', WebkitTextStroke: '12px #0B0F18', paintOrder: 'stroke fill', transform: `scale(${pulse})`, marginTop: 10, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>{fmt(shown)}</div>
        <div style={{font: `700 30px ${FONT.mono}`, letterSpacing: 4, color: 'rgba(255,255,255,.6)', marginTop: 8}}>{n > 0 ? `DOUBLED ${n} TIME${n > 1 ? 'S' : ''} · ${n} SEC` : 'DOUBLES EVERY SECOND'}</div>
      </div>
      {n > 0 && sinceStep < 10 && <div style={{position: 'absolute', left: 820, top: 330, font: `900 70px ${FONT.cap}`, color: C.hi, opacity: 1 - sinceStep / 10, transform: `translateY(${-sinceStep * 4}px)`}}>×2</div>}

      {/* milestone line */}
      {!ending && (
        <div key={'l' + mile.n} style={{position: 'absolute', left: 70, right: 170, top: 1290, textAlign: 'center', font: `italic 400 78px/1.15 ${SERIF}`, color: '#fff', textShadow: '0 4px 18px rgba(0,0,0,.7)', opacity: lin(fr, mileAt, mileAt + 5), transform: `translateY(${(1 - ease(lin(fr, mileAt, mileAt + 8))) * 20}px)`}}>{mile.line}</div>
      )}

      {/* the real lesson */}
      {ending && (
        <AbsoluteFill style={{opacity: endP, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40, padding: '0 80px', textAlign: 'center'}}>
          <div style={{font: `italic 400 92px/1.1 ${SERIF}`, color: '#fff'}}>Real money doubles too.</div>
          <div style={{font: `italic 400 92px/1.1 ${SERIF}`, color: C.hi, opacity: lin(fr, f(END_AT) + 30, f(END_AT) + 40)}}>Just slower.</div>
          <div style={{font: `900 56px/1.3 ${FONT.cap}`, color: '#fff', marginTop: 30, opacity: lin(fr, f(END_AT) + 60, f(END_AT) + 70)}}>At 7% a year, it doubles<br />about every <span style={{color: C.hi}}>10 years</span>.</div>
        </AbsoluteFill>
      )}

      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', font: `700 26px ${FONT.mono}`, letterSpacing: 4, color: 'rgba(255,255,255,.45)'}}>WHAT IF · 01</div>

      <Audio src={staticFile('shorts/d01/beat.wav')} />
      {MILES.filter((m) => m.n > 0).map((m) => <Sequence key={m.n} from={f(tN(m.n))} layout="none"><Audio src={staticFile('sfx/mechanical/purchase.mp3')} volume={0.35} /></Sequence>)}
      <Sequence from={f(END_AT)} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

