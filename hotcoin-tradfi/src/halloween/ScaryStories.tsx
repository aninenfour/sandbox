// "Crypto Scary Stories" (Halloween, 1080x1350, 30 fps, ~52 s). Silent-film style: three ghosts around a campfire,
// the middle one tells the story (graphics in his speech bubble), left (Scaredy) and right (Snacky) react.
// Intertitle cards carry the words, so no voice-over is needed.
// Facts: Bitcoin pizza (bitcointalk.org post, 18 May 2010; paid 22 May 2010, 10,000 BTC for two pizzas, ~$41 then);
// LUNA daily closes from Bitfinex (tLUNA:USD), $82.38 on 5 May 2022 to $0.00021 on 15 May 2022;
// Feb 21, 2025 exchange cold-wallet hack, ~401,000 ETH (~$1.5B), the largest crypto theft on record (FBI attribution to DPRK).
// BTC spot for "worth today" in data.json.
// Music: "Silent Movie 46" by Sascha Ende (ende.app), CC BY 4.0. Projector clatter: synthesized (public/halloween/projector.wav).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, Loop, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import data from './data.json';

export const FPS = 30;
export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const sp = (f: number, d = 12, s = 180) => spring({frame: f, fps: FPS, config: {damping: d, stiffness: s}});
export const io = (x: number) => { x = Math.max(0, Math.min(1, x)); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const out = (x: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
export const rnd = (i: number) => { const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };
export const LIME = '#B8F26A', INK = '#0B0E11', CREAM = '#EFE8D6', RED = '#F6465D';
export const SERIF = '"Instrument Serif", serif', DISPLAY = 'Unbounded, sans-serif', MONO = '"JetBrains Mono", monospace', SANS = '"Inter Tight", sans-serif';

export const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['italic 400 80px "Instrument Serif"', '900 80px Unbounded', '800 80px Unbounded', '700 20px "JetBrains Mono"', '600 30px "Inter Tight"', '700 30px "Inter Tight"'].map((s) => document.fonts.load(s)))
      .then(() => setTimeout(() => continueRender(h), 100));
  }, [h]);
};

// ---------------- timeline (frames) ----------------
type Seg = {k: 'card' | 'scene'; from: number; to: number; id: string};
const T: Seg[] = [
  {k: 'card', from: 0, to: 96, id: 'title'},
  {k: 'scene', from: 96, to: 210, id: 'intro'},
  {k: 'card', from: 210, to: 270, id: 'c1'},
  {k: 'scene', from: 270, to: 480, id: 'pizza'},
  {k: 'card', from: 480, to: 570, id: 'c1b'},
  {k: 'card', from: 570, to: 630, id: 'c2'},
  {k: 'scene', from: 630, to: 840, id: 'luna'},
  {k: 'card', from: 840, to: 930, id: 'c2b'},
  {k: 'card', from: 930, to: 990, id: 'c3'},
  {k: 'scene', from: 990, to: 1200, id: 'heist'},
  {k: 'card', from: 1200, to: 1290, id: 'c3b'},
  {k: 'scene', from: 1290, to: 1440, id: 'end'},
  {k: 'card', from: 1440, to: 1560, id: 'outro'},
];
export const SCARY_DURATION = 1560;

// ---------------- ghosts ----------------
export type Face = 'calm' | 'tell' | 'shock' | 'scared' | 'cry' | 'happy' | 'blow' | 'chew' | 'scream' | 'peek';
export type Arms = 'down' | 'up' | 'side' | 'hug' | 'hold' | 'cover';
const bodyPath = (t: number, ph: number) => {
  const L = 14, R = 186, hem = 206;
  let d = `M${R},${hem} L${R},108 C${R},44 ${145},8 100,8 C55,8 ${L},44 ${L},108 L${L},${hem}`;
  const n = 5, seg = (R - L) / n;
  for (let i = 0; i < n; i++) {
    const x0 = L + i * seg, x1 = x0 + seg, amp = 17 + 6 * Math.sin(t * 4.2 + i * 1.4 + ph);
    d += ` Q${x0 + seg / 2},${hem + amp} ${x1},${hem}`;
  }
  return d + 'Z';
};

const Eye: React.FC<{x: number; y: number; rx: number; ry: number}> = ({x, y, rx, ry}) => (
  <g><ellipse cx={x} cy={y} rx={rx} ry={ry} fill={INK} /><circle cx={x - rx * 0.35} cy={y - ry * 0.4} r={rx * 0.32} fill="#fff" /></g>
);

const FaceArt: React.FC<{face: Face; t: number}> = ({face, t}) => {
  const blink = (Math.floor(t * 30) % 97) < 3; // occasional blink
  const ex = [74, 126], ey = 100;
  const eyes = (rx: number, ry: number) => blink && face !== 'cry' ? ex.map((x) => <path key={x} d={`M${x - rx},${ey} q${rx},6 ${rx * 2},0`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />) : ex.map((x) => <Eye key={x} x={x} y={ey} rx={rx} ry={ry} />);
  const cheeks = <g opacity={0.55}><ellipse cx={56} cy={128} rx={11} ry={6} fill="#FF9DB0" /><ellipse cx={144} cy={128} rx={11} ry={6} fill="#FF9DB0" /></g>;
  switch (face) {
    case 'tell': return <g>{eyes(11, 15)}{cheeks}<ellipse cx={100} cy={138 + Math.sin(t * 14) * 2} rx={9} ry={7 + 4 * Math.abs(Math.sin(t * 9))} fill={INK} /></g>;
    case 'shock': return <g>{ex.map((x) => <Eye key={x} x={x} y={ey - 4} rx={14} ry={20} />)}<ellipse cx={100} cy={145} rx={10} ry={16} fill={INK} />{cheeks}</g>;
    case 'scream': return <g>{ex.map((x) => <Eye key={x} x={x} y={ey - 6} rx={15} ry={22} />)}<ellipse cx={100} cy={150} rx={16} ry={24} fill={INK} /><ellipse cx={100} cy={160} rx={8} ry={8} fill="#E85A7A" /></g>;
    case 'scared': return <g>{ex.map((x) => <Eye key={x} x={x} y={ey + 2} rx={10} ry={13} />)}<path d="M58,78 l22,-8 M142,78 l-22,-8" stroke={INK} strokeWidth={5} strokeLinecap="round" /><path d={`M80,142 q5,-6 10,0 t10,0 t10,0 t10,0`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />{cheeks}</g>;
    case 'cry': return <g><path d="M62,92 l16,8 l-16,8 M138,92 l-16,8 l16,8" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M84,146 q16,-16 32,0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" /><path d={`M62,112 q-4,${12 + (t * 30 % 20)} 0,${20 + (t * 30 % 20)}`} stroke="#7FC8FF" strokeWidth={6} fill="none" strokeLinecap="round" /><path d={`M138,112 q4,${12 + ((t * 30 + 9) % 20)} 0,${20 + ((t * 30 + 9) % 20)}`} stroke="#7FC8FF" strokeWidth={6} fill="none" strokeLinecap="round" />{cheeks}</g>;
    case 'happy': return <g><path d="M62,104 q12,-14 24,0 M114,104 q12,-14 24,0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" /><path d="M84,130 q16,18 32,0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />{cheeks}</g>;
    case 'chew': return <g><path d="M62,104 q12,-12 24,0 M114,104 q12,-12 24,0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" /><ellipse cx={100} cy={138} rx={10 + 3 * Math.sin(t * 20)} ry={5 + 3 * Math.abs(Math.sin(t * 20))} fill={INK} /><g opacity={0.7}><ellipse cx={52} cy={128} rx={14} ry={10} fill="#FF9DB0" /><ellipse cx={148} cy={128} rx={14} ry={10} fill="#FF9DB0" /></g></g>;
    case 'blow': return <g>{eyes(10, 13)}<circle cx={100} cy={140} r={8} fill="none" stroke={INK} strokeWidth={5} /><g opacity={0.8}><circle cx={68} cy={130} r={15} fill="#FFB3C2" /><circle cx={132} cy={130} r={15} fill="#FFB3C2" /></g></g>;
    case 'peek': return <g>{ex.map((x) => <Eye key={x} x={x + 6} y={ey} rx={9} ry={11} />)}<path d="M88,140 h22" stroke={INK} strokeWidth={5} strokeLinecap="round" />{cheeks}</g>;
    default: return <g>{eyes(11, 15)}<ellipse cx={100} cy={138} rx={7} ry={6} fill={INK} />{cheeks}</g>;
  }
};

const Arm: React.FC<{side: -1 | 1; pose: Arms; t: number}> = ({side, pose, t}) => {
  const base: Record<Arms, [number, number, number]> = {
    down: [side < 0 ? 22 : 178, 150, side * 20], side: [side < 0 ? 12 : 188, 132, side * 70], up: [side < 0 ? 18 : 182, 96, side * 150 + Math.sin(t * 16) * 12],
    hug: [side < 0 ? 46 : 154, 176, side * -40], hold: [side < 0 ? 26 : 176, 150, side * 50], cover: [side < 0 ? 72 : 128, 112, side * -80],
  };
  const [x, y, r] = base[pose];
  return <ellipse cx={x} cy={y} rx={14} ry={26} fill="url(#gb)" transform={`rotate(${r} ${x} ${y}) translate(0 16)`} />;
};

export const Ghost: React.FC<{id: string; x: number; y: number; s: number; t: number; face: Face; arms?: [Arms, Arms]; ph?: number; rot?: number; tremble?: number; warm?: 1 | -1; light?: number; children?: React.ReactNode}> =
  ({id, x, y, s, t, face, arms = ['down', 'down'], ph = 0, rot = 0, tremble = 0, warm = 1, light = 0, children}) => {
    const bob = Math.sin(t * 2.2 + ph) * 7, tx = tremble * Math.sin(t * 55) * 3;
    return (
      <svg width={200 * s} height={260 * s} viewBox="0 -10 200 260" style={{position: 'absolute', left: x - 100 * s + tx, top: y - 240 * s + bob, overflow: 'visible', transform: `rotate(${rot}deg)`, transformOrigin: '50% 100%'}}>
        <defs>
          <linearGradient id="gb" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#DCE3F7" /></linearGradient>
          <linearGradient id={`w${id}`} x1={warm > 0 ? 1 : 0} y1="0" x2={warm > 0 ? 0 : 1} y2="0"><stop offset="0" stopColor="#FFB86A" stopOpacity="0.38" /><stop offset="0.55" stopColor="#FFB86A" stopOpacity="0" /></linearGradient>
          <radialGradient id={`l${id}`} cx="0.5" cy="0.62" r="0.5"><stop offset="0" stopColor="#FFF2B0" stopOpacity="0.75" /><stop offset="1" stopColor="#FFF2B0" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx={100} cy={246} rx={70} ry={10} fill="rgba(20,28,60,0.28)" />
        {arms[0] !== 'cover' && <Arm side={-1} pose={arms[0]} t={t} />}{arms[1] !== 'cover' && <Arm side={1} pose={arms[1]} t={t} />}
        <path d={bodyPath(t, ph)} fill="url(#gb)" />
        <path d={bodyPath(t, ph)} fill={`url(#w${id})`} />
        {light > 0 && <ellipse cx={100} cy={120} rx={90} ry={90} fill={`url(#l${id})`} opacity={light} />}
        <FaceArt face={face} t={t} />
        {arms[0] === 'cover' && <Arm side={-1} pose="cover" t={t} />}{arms[1] === 'cover' && <Arm side={1} pose="cover" t={t} />}
        {children}
      </svg>
    );
  };

// ---------------- scene pieces ----------------
export const Sky: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #33437F 0%, #4F62A6 38%, #7A8BCB 62%, #93A2D9 70%)'}}>
    <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
      <defs><radialGradient id="moon"><stop offset="0.55" stopColor="#FFFBEA" /><stop offset="0.62" stopColor="#FFFBEA" stopOpacity="0.35" /><stop offset="1" stopColor="#FFFBEA" stopOpacity="0" /></radialGradient></defs>
      <circle cx={830} cy={200} r={150} fill="url(#moon)" />
      <circle cx={800} cy={180} r={12} fill="#E9E3CC" /><circle cx={850} cy={222} r={8} fill="#E9E3CC" /><circle cx={812} cy={232} r={6} fill="#E9E3CC" />
      {Array.from({length: 46}, (_, i) => {
        const x = rnd(i) * 1080, y = rnd(i + 99) * 560, r = 1.2 + rnd(i + 7) * 2.2, tw = 0.5 + 0.5 * Math.sin(t * (1.5 + rnd(i) * 3) + i);
        return i % 9 === 0 ? <path key={i} d={`M${x},${y - 9} L${x + 2.2},${y - 2.2} L${x + 9},${y} L${x + 2.2},${y + 2.2} L${x},${y + 9} L${x - 2.2},${y + 2.2} L${x - 9},${y} L${x - 2.2},${y - 2.2}Z`} fill="#FFFBEA" opacity={0.6 + 0.4 * tw} /> : <circle key={i} cx={x} cy={y} r={r} fill="#FFFBEA" opacity={0.35 + 0.5 * tw} />;
      })}
      {/* soft clouds */}
      {[[180, 330, 1], [620, 280, 0.8], [960, 420, 0.9]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x + Math.sin(t * 0.2 + i) * 20} ${y}) scale(${s})`} opacity={0.35}>
          <ellipse cx={0} cy={0} rx={140} ry={34} fill="#A7B4E3" /><ellipse cx={-50} cy={-20} rx={70} ry={40} fill="#A7B4E3" /><ellipse cx={40} cy={-26} rx={80} ry={46} fill="#A7B4E3" />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

export const pine = (x: number, base: number, h: number, w: number, c: string, k: number) => {
  const tiers = 4; let d = '';
  for (let i = 0; i < tiers; i++) { const ty = base - h + (h * i) / tiers, tw = w * (0.45 + 0.55 * (i + 1) / tiers); d += `M${x},${ty} L${x + tw / 2},${ty + h / tiers + 30} L${x - tw / 2},${ty + h / tiers + 30}Z `; }
  return <path key={k} d={d + `M${x - 10},${base} h20 v24 h-20Z`} fill={c} />;
};
export const Forest: React.FC = () => (
  <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
    {Array.from({length: 12}, (_, i) => pine(-40 + i * 100 + rnd(i) * 40, 760, 300 + rnd(i + 3) * 160, 170 + rnd(i + 5) * 60, '#5D6FB0', i))}
    {Array.from({length: 9}, (_, i) => pine(-20 + i * 135 + rnd(i + 20) * 50, 800, 380 + rnd(i + 23) * 160, 210 + rnd(i + 25) * 60, '#45579A', 100 + i))}
    <path d="M0,760 Q270,720 540,750 T1080,740 L1080,1350 L0,1350Z" fill="url(#gr)" />
    <defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5A6FB0" /><stop offset="1" stopColor="#3F5291" /></linearGradient></defs>
    {/* bushes */}
    {[[60, 780], [330, 770], [700, 775], [1010, 790], [930, 1310], [120, 1320]].map(([x, y], i) => (
      <g key={i} fill="#4A5E9E"><ellipse cx={x} cy={y} rx={70} ry={26} /><ellipse cx={x - 30} cy={y - 14} rx={34} ry={22} /><ellipse cx={x + 26} cy={y - 18} rx={38} ry={26} /></g>
    ))}
  </svg>
);

export const Log: React.FC<{x: number; y: number; w: number; r: number}> = ({x, y, w, r}) => (
  <svg width={w + 60} height={120} style={{position: 'absolute', left: x - w / 2 - 30, top: y - 60, transform: `rotate(${r}deg)`, overflow: 'visible'}}>
    <ellipse cx={w / 2 + 30} cy={104} rx={w / 2 + 10} ry={10} fill="rgba(20,28,60,0.3)" />
    <rect x={30} y={30} width={w} height={64} rx={30} fill="#7A5536" />
    <rect x={30} y={34} width={w} height={14} rx={7} fill="#94693F" opacity={0.7} />
    {[0.25, 0.5, 0.72].map((k) => <path key={k} d={`M${30 + w * k},${46} q20,10 40,4`} stroke="#5C3F28" strokeWidth={4} fill="none" strokeLinecap="round" />)}
    <ellipse cx={30 + w} cy={62} rx={22} ry={32} fill="#C89A63" /><ellipse cx={30 + w} cy={62} rx={14} ry={21} fill="none" stroke="#9C7245" strokeWidth={3} /><ellipse cx={30 + w} cy={62} rx={6} ry={9} fill="none" stroke="#9C7245" strokeWidth={3} />
  </svg>
);

export const Fire: React.FC<{t: number; boost?: number}> = ({t, boost = 0}) => {
  const fl = (k: number, a: number) => Math.sin(t * (7 + k) + k * 2) * a;
  const h = 1 + boost * 0.7;
  const flame = (w: number, hh: number, c: string, k: number) => `<path d="M${-w},0 C${-w},${-hh * 0.4} ${-w * 0.3 + fl(k, 6)},${-hh * 0.6} ${fl(k + 1, 10)},${-hh} C${w * 0.3 + fl(k + 2, 6)},${-hh * 0.6} ${w},${-hh * 0.4} ${w},0 Z" fill="${c}"/>`;
  return (
    <div style={{position: 'absolute', left: 540, top: 1085}}>
      <svg width={600} height={600} viewBox="-300 -460 600 600" style={{position: 'absolute', left: -300, top: -460, overflow: 'visible'}}>
        <defs><radialGradient id="fglow"><stop offset="0" stopColor="#FFC66B" stopOpacity="0.55" /><stop offset="1" stopColor="#FFC66B" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={0} cy={-10} rx={300 + boost * 60} ry={140 + boost * 30} fill="url(#fglow)" opacity={0.8 + 0.2 * Math.sin(t * 9)} />
        <g dangerouslySetInnerHTML={{__html: flame(70, 190 * h + fl(3, 14), '#F2862B', 1) + flame(52, 150 * h + fl(4, 12), '#FFB53B', 2) + flame(32, 100 * h + fl(5, 10), '#FFE38A', 3)}} />
        {Array.from({length: 10}, (_, i) => { const p = ((t * 0.6 + rnd(i)) % 1); return <circle key={i} cx={(rnd(i + 3) - 0.5) * 120 + Math.sin(t * 3 + i) * 14} cy={-p * 300 * h} r={3 + rnd(i) * 3} fill="#FFD27A" opacity={1 - p} />; })}
        <g transform="rotate(-14)"><rect x={-110} y={-10} width={220} height={34} rx={17} fill="#6B4A2E" /><ellipse cx={110} cy={7} rx={10} ry={17} fill="#C89A63" /></g>
        <g transform="rotate(14)"><rect x={-110} y={-10} width={220} height={34} rx={17} fill="#7A5536" /><ellipse cx={-110} cy={7} rx={10} ry={17} fill="#C89A63" /></g>
      </svg>
    </div>
  );
};

export const Pumpkin: React.FC<{x: number; y: number; s: number; t: number}> = ({x, y, s, t}) => (
  <svg width={200 * s} height={170 * s} viewBox="-100 -90 200 170" style={{position: 'absolute', left: x - 100 * s, top: y - 90 * s}}>
    <ellipse cx={0} cy={70} rx={80} ry={10} fill="rgba(20,28,60,0.3)" />
    {[-52, -22, 22, 52].map((dx) => <ellipse key={dx} cx={dx} cy={10} rx={40} ry={58} fill="#E8772A" />)}
    <ellipse cx={0} cy={10} rx={44} ry={62} fill="#F28C38" />
    <path d="M-6,-50 q2,-26 16,-34" stroke="#4E6B2A" strokeWidth={10} fill="none" strokeLinecap="round" />
    <g fill="#FFD65A" opacity={0.85 + 0.15 * Math.sin(t * 8)}>
      <path d="M-40,-6 l18,-24 l18,24Z" /><path d="M4,-6 l18,-24 l18,24Z" />
      <path d="M-46,22 l12,16 l12,-10 l12,10 l12,-10 l12,10 l12,-10 l12,16 q-40,22 -84,0Z" />
    </g>
  </svg>
);

// laptop on the ground, lid back facing camera with the Hotcoin logo (like the pizza box in the reference)
export const Laptop: React.FC<{x: number; y: number; close: number}> = ({x, y, close}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 300, height: 220}}>
    <div style={{position: 'absolute', left: 0, bottom: 0, width: 300, height: 34, borderRadius: 8, background: 'linear-gradient(180deg,#CBD1DD,#9AA3B5)', transform: 'skewX(-18deg)', boxShadow: '0 12px 18px rgba(20,28,60,0.35)'}} />
    <div style={{position: 'absolute', left: 18, bottom: 26, width: 264, height: 186, borderRadius: 14, background: 'linear-gradient(160deg,#1A2026,#0B0E11)', transformOrigin: '50% 100%',
      transform: `perspective(700px) rotateX(${close * 78}deg) skewX(-6deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 3px #2A323A'}}>
      <Img src={staticFile('brand/logo-official-white.png')} style={{width: 190, height: (190 * 328) / 2005, opacity: 0.95}} />
    </div>
  </div>
);

export const Marshmallow: React.FC<{t: number; state: 'raw' | 'fire' | 'burnt' | 'gone'; ang: number}> = ({t, state, ang}) => (
  <svg width={300} height={200} viewBox="0 0 300 200" style={{position: 'absolute', left: 640, top: 900, overflow: 'visible', transform: `rotate(${ang}deg)`, transformOrigin: '270px 40px'}}>
    <line x1={270} y1={40} x2={40} y2={150} stroke="#8A5A33" strokeWidth={7} strokeLinecap="round" />
    {state !== 'gone' && <rect x={22} y={132} width={42} height={38} rx={12} fill={state === 'burnt' ? '#3A2A22' : '#FFF8EE'} stroke={state === 'burnt' ? '#1E1612' : '#E8D9C2'} strokeWidth={3} transform="rotate(-25 43 151)" />}
    {state === 'fire' && <g transform="translate(42 128)">{[0, 1, 2].map((k) => <path key={k} d={`M${-14 + k * 14},0 q-8,-20 ${2 + Math.sin(t * 20 + k) * 5},${-34 - k * 6 + Math.sin(t * 16 + k) * 6} q10,18 ${10},34Z`} fill={['#F2862B', '#FFB53B', '#FFE38A'][k]} />)}</g>}
    {state === 'burnt' && <path d={`M40,120 q${6 + Math.sin(t * 3) * 6},-30 0,-60 q-8,-30 4,-60`} stroke="rgba(200,200,210,0.55)" strokeWidth={8} fill="none" strokeLinecap="round" />}
  </svg>
);

// speech bubble above the teller
export const Bubble: React.FC<{f: number; children: React.ReactNode; w?: number; h?: number; top?: number}> = ({f, children, w = 860, h = 520, top = 70}) => {
  const k = sp(f, 13, 200);
  return (
    <div style={{position: 'absolute', left: 540 - w / 2, top, width: w, height: h, transform: `scale(${k}) rotate(${(1 - k) * -6 - 1}deg)`, transformOrigin: '50% 115%', opacity: Math.min(1, k * 1.5)}}>
      <svg width={w} height={h + 90} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={`M30,0 H${w - 30} Q${w},0 ${w},30 V${h - 30} Q${w},${h} ${w - 30},${h} H${w / 2 + 40} L${w / 2 - 10},${h + 80} L${w / 2 - 10},${h} H30 Q0,${h} 0,${h - 30} V30 Q0,0 30,0Z`} fill="#FFFDF6" stroke="#20294D" strokeWidth={5} />
      </svg>
      <div style={{position: 'absolute', inset: 26, overflow: 'hidden', borderRadius: 18}}>{children}</div>
    </div>
  );
};

// ---------------- bubble contents ----------------
const PizzaCard: React.FC<{f: number}> = ({f}) => {
  const p = out((f - 70) / 18), c = io((f - 120) / 60);
  const usd = 41 + (10000 * data.btcSpot - 41) * c;
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK}}>
      <div style={{background: '#EEF1F7', borderRadius: 14, padding: '18px 22px', border: '2px solid #D5DBE8', opacity: out(f / 14)}}>
        <div style={{fontFamily: MONO, fontSize: 18, color: '#5A6478', letterSpacing: 1}}>bitcointalk.org · laszlo · May 18, 2010</div>
        <div style={{fontSize: 33, fontWeight: 600, marginTop: 10, lineHeight: 1.25}}>“I’ll pay 10,000 bitcoins for a couple of pizzas.. like maybe 2 large ones so I have some left over for the next day.”</div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 26, transform: `scale(${0.6 + 0.4 * p})`, opacity: p, transformOrigin: '0 50%'}}>
        <svg width={150} height={150} viewBox="-75 -75 150 150"><circle r={70} fill="#E9A23B" /><circle r={58} fill="#FFD56B" />{[[-25, -20], [22, -26], [-6, 18], [30, 20], [-34, 26]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="#D9493A" />)}{[0, 60, 120].map((a) => <line key={a} x1={0} y1={0} x2={70 * Math.cos(a * Math.PI / 180)} y2={70 * Math.sin(a * Math.PI / 180)} stroke="#E9A23B" strokeWidth={3} transform={`rotate(${a})`} />)}</svg>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, letterSpacing: -2}}>× 2 = <span style={{color: '#E8891A'}}>10,000 BTC</span></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'baseline', gap: 18, opacity: out((f - 110) / 14)}}>
        <div style={{fontFamily: MONO, fontSize: 20, color: '#5A6478', width: 170, lineHeight: 1.3}}>{c < 0.02 ? 'PAID IN 2010' : 'WORTH TODAY'}</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 70, letterSpacing: -3, color: c > 0.98 ? '#1E9E57' : INK, fontVariantNumeric: 'tabular-nums'}}>${Math.round(usd).toLocaleString('en-US')}</div>
      </div>
    </div>
  );
};

const LunaCard: React.FC<{f: number}> = ({f}) => {
  const pts = data.luna as [string, number][];
  const W = 770, H = 330, n = pts.length, max = 100;
  const k = io((f - 10) / 130) * (n - 1);
  const xy = pts.map(([, v], i) => [20 + (i / (n - 1)) * (W - 90), 30 + (1 - v / max) * (H - 50)]);
  const upto = Math.floor(k), fr = k - upto;
  const seg = xy.slice(0, upto + 1);
  if (upto < n - 1) seg.push([xy[upto][0] + (xy[upto + 1][0] - xy[upto][0]) * fr, xy[upto][1] + (xy[upto + 1][1] - xy[upto][1]) * fr]);
  const tip = seg[seg.length - 1], v = upto < n - 1 ? pts[upto][1] + (pts[upto + 1][1] - pts[upto][1]) * fr : pts[n - 1][1];
  const stamp = sp(f - 150, 9, 220);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 40}}>LUNA</div>
        <div style={{fontFamily: MONO, fontSize: 19, color: '#5A6478'}}>USD · daily close · Apr 25 – May 18, 2022</div>
      </div>
      <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 58, letterSpacing: -2, marginTop: 4, color: v < 30 ? RED : INK, fontVariantNumeric: 'tabular-nums'}}>${v >= 1 ? v.toFixed(2) : v.toPrecision(2)}</div>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, bottom: 0}}>
        {[0, 25, 50, 75, 100].map((g) => <g key={g}><line x1={20} x2={W - 70} y1={30 + (1 - g / max) * (H - 50)} y2={30 + (1 - g / max) * (H - 50)} stroke="#E3E7F0" strokeWidth={2} /><text x={W - 62} y={36 + (1 - g / max) * (H - 50)} fontFamily="JetBrains Mono" fontSize={16} fill="#8A93A6">${g}</text></g>)}
        <path d={seg.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')} stroke={RED} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={tip[0]} cy={tip[1]} r={10} fill={RED} />
      </svg>
      {f > 150 && <div style={{position: 'absolute', right: 30, top: 70, transform: `rotate(-12deg) scale(${stamp})`, border: `6px solid ${RED}`, color: RED, borderRadius: 12, padding: '6px 18px', fontFamily: DISPLAY, fontWeight: 900, fontSize: 56}}>−99.99%</div>}
    </div>
  );
};

const HeistCard: React.FC<{f: number}> = ({f}) => {
  const d = io((f - 40) / 110);
  const eth = Math.round(401000 * (1 - d));
  const alert = f > 40 && Math.floor(f / 6) % 2 === 0;
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderRadius: 12, background: f > 40 ? (alert ? RED : '#FFE3E7') : '#EEF1F7', color: f > 40 && alert ? '#fff' : f > 40 ? RED : '#5A6478', fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 1}}>
        {f > 40 ? '⚠ COLD WALLET · UNUSUAL OUTFLOW' : '🔒 COLD WALLET · FEB 21, 2025'}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 26}}>
        {/* vault */}
        <svg width={230} height={230} viewBox="-115 -115 230 230">
          <rect x={-105} y={-105} width={210} height={210} rx={24} fill="#C9D0DC" stroke="#20294D" strokeWidth={5} />
          <circle r={70} fill="#E7EBF2" stroke="#20294D" strokeWidth={5} />
          <g transform={`rotate(${f * (f > 40 ? 9 : 1)})`}>{[0, 60, 120, 180, 240, 300].map((a) => <line key={a} x1={0} y1={0} x2={0} y2={-56} stroke="#20294D" strokeWidth={6} strokeLinecap="round" transform={`rotate(${a})`} />)}<circle r={16} fill="#20294D" /></g>
        </svg>
        <div>
          <div style={{fontFamily: MONO, fontSize: 20, color: '#5A6478'}}>ETH BALANCE</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 6}}>
            <Img src={staticFile('promo4/coins/ethereum.png')} style={{width: 54, height: 54, borderRadius: 27}} />
            <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 62, letterSpacing: -2, fontVariantNumeric: 'tabular-nums', color: d > 0.98 ? RED : INK}}>{eth.toLocaleString('en-US')}</div>
          </div>
          <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, color: RED, marginTop: 12, opacity: out((f - 120) / 14)}}>−$1.5 billion</div>
        </div>
      </div>
      {/* coins flying out */}
      {f > 40 && Array.from({length: 9}, (_, i) => {
        const p = ((f - 40) / 26 + rnd(i)) % 1;
        if (f > 160) return null;
        return <Img key={i} src={staticFile('promo4/coins/ethereum.png')} style={{position: 'absolute', left: 95 + p * (560 + rnd(i + 5) * 160), top: 190 - p * (230 + rnd(i) * 60) - Math.sin(p * Math.PI) * 40, width: 40, height: 40, borderRadius: 20, opacity: 1 - p, transform: `rotate(${p * 720}deg)`}} />;
      })}
      <div style={{position: 'absolute', left: 0, bottom: 0, fontFamily: MONO, fontSize: 21, color: '#5A6478', opacity: out((f - 150) / 14)}}>1 transaction · biggest crypto heist on record</div>
    </div>
  );
};

const EndCard: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: INK}}>
    <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 150, lineHeight: 1, transform: `scale(${0.8 + 0.2 * sp(f, 10, 160)})`}}>The End?</div>
    <div style={{fontFamily: MONO, fontSize: 22, color: '#5A6478', marginTop: 24, letterSpacing: 2, opacity: out((f - 30) / 14)}}>…MORE STORIES TO COME THIS HALLOWEEN</div>
  </div>
);

// ---------------- silent-film intertitles ----------------
const CARDS: Record<string, {kicker?: string; lines: React.ReactNode}> = {
  title: {kicker: 'HOTCOIN PRESENTS', lines: <>Crypto<br />Scary Stories</>},
  c1: {kicker: 'CHAPTER I', lines: <>The most expensive<br />dinner ever.</>},
  c1b: {lines: <>Two pizzas.<br />10,000 BTC.<br /><span style={{color: LIME}}>About $829 million today.</span></>},
  c2: {kicker: 'CHAPTER II', lines: <>The fall<br />of LUNA.</>},
  c2b: {lines: <>May 2022.<br />From $82 to $0.0002<br /><span style={{color: LIME}}>in ten days.</span></>},
  c3: {kicker: 'CHAPTER III', lines: <>The heist.</>},
  c3b: {lines: <>Feb 2025.<br />$1.5 billion in ETH,<br /><span style={{color: LIME}}>gone in one transaction.</span></>},
};
export const Intertitle: React.FC<{id: string; f: number; len: number; cards?: Record<string, {kicker?: string; lines: React.ReactNode}>}> = ({id, f, len, cards = CARDS}) => {
  const c = cards[id];
  const a = out(f / 8) * (1 - io((f - (len - 8)) / 8));
  return (
    <AbsoluteFill style={{background: '#0A0A09', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', inset: 46, border: `3px solid ${CREAM}`, opacity: 0.85}} />
      <div style={{position: 'absolute', inset: 60, border: `1px solid ${CREAM}`, opacity: 0.5}} />
      {[[46, 46, 0], [1034, 46, 90], [1034, 1304, 180], [46, 1304, 270]].map(([x, y, r], i) => (
        <svg key={i} width={90} height={90} viewBox="0 0 90 90" style={{position: 'absolute', left: x - 6, top: y - 6, transform: `rotate(${r}deg)`, transformOrigin: '6px 6px'}}>
          <path d="M6,40 Q6,6 40,6 M18,40 Q18,18 40,18 M6,6 l22,22" stroke={CREAM} strokeWidth={3} fill="none" />
          <circle cx={30} cy={30} r={4} fill={LIME} />
        </svg>
      ))}
      <div style={{textAlign: 'center', color: CREAM, opacity: a, transform: `scale(${0.98 + 0.02 * a})`}}>
        {c.kicker && <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 10, color: LIME, marginBottom: 30}}>— {c.kicker} —</div>}
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: id === 'title' ? 150 : 96, lineHeight: 1.05}}>{c.lines}</div>
        {id === 'title' && <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 6, marginTop: 40, opacity: 0.7}}>A HALLOWEEN TALE IN THREE CHAPTERS</div>}
      </div>
    </AbsoluteFill>
  );
};

export const Outro: React.FC<{f: number; sources?: React.ReactNode; extra?: string}> = ({f, sources, extra}) => {
  const a = out(f / 10);
  return (
    <AbsoluteFill style={{background: '#0A0A09', alignItems: 'center', justifyContent: 'center', color: CREAM}}>
      <div style={{position: 'absolute', inset: 46, border: `3px solid ${CREAM}`, opacity: 0.85}} />
      <div style={{textAlign: 'center', opacity: a}}>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 104, lineHeight: 1.05}}>Market tricks.<br /><span style={{color: LIME}}>Trading treats.</span></div>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 380, height: (380 * 328) / 2005, marginTop: 70, opacity: out((f - 14) / 12)}} />
        <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 6, marginTop: 26, opacity: out((f - 20) / 12)}}>HAPPY HALLOWEEN 🎃</div>
        {extra && <div style={{fontFamily: MONO, fontSize: 20, letterSpacing: 4, marginTop: 18, color: LIME, opacity: out((f - 26) / 12)}}>{extra}</div>}
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, bottom: 84, textAlign: 'center', fontFamily: MONO, fontSize: 15, letterSpacing: 1, opacity: 0.45}}>{sources ?? <>Sources: bitcointalk.org (2010) · Bitfinex LUNA/USD daily closes (2022) · FBI statement (Feb 2025) · BTC price via Coinbase, Oct 2026<br />Music: Silent Movie 46 by Sascha Ende (ende.app), CC BY 4.0</>}</div>
    </AbsoluteFill>
  );
};

// ---------------- the campfire scene ----------------
const Scene: React.FC<{id: string; f: number; g: number}> = ({id, f, g}) => {
  const t = g / FPS;
  // reactions per scene
  let L: {face: Face; arms: [Arms, Arms]; tremble?: number; rot?: number} = {face: 'calm', arms: ['down', 'down']};
  let M: {face: Face; arms: [Arms, Arms]; light: number} = {face: 'calm', arms: ['down', 'hold'], light: 0};
  let R: {face: Face; arms: [Arms, Arms]} = {face: 'happy', arms: ['side', 'hold']};
  let mm: 'raw' | 'fire' | 'burnt' | 'gone' = 'raw', mmAng = Math.sin(t * 1.5) * 3, boost = 0, lap = 0, laptopX = 70;
  let bubble: React.ReactNode = null;
  if (id === 'intro') {
    M = {face: f > 40 ? 'tell' : 'calm', arms: ['down', 'hold'], light: io((f - 30) / 14)};
    L = {face: f > 50 ? 'scared' : 'calm', arms: ['down', 'down'], tremble: f > 50 ? 0.6 : 0};
  } else if (id === 'pizza') {
    M = {face: 'tell', arms: [f > 70 && f < 110 ? 'up' : 'down', 'hold'], light: 1};
    L = {face: f > 125 ? 'shock' : 'peek', arms: f > 125 ? ['up', 'up'] : ['down', 'down']};
    R = {face: f > 125 ? 'shock' : 'chew', arms: f > 125 ? ['up', 'hold'] : ['side', 'hold']};
    mm = f > 60 ? 'gone' : 'raw'; mmAng = f > 30 && f < 60 ? -30 : mmAng;
    bubble = <Bubble f={f - 6}><PizzaCard f={f - 10} /></Bubble>;
  } else if (id === 'luna') {
    M = {face: 'tell', arms: ['down', 'hold'], light: 1};
    const crash = f > 100;
    L = {face: crash ? 'cry' : 'scared', arms: crash ? ['cover', 'cover'] : ['down', 'down'], tremble: crash ? 0 : 0.8, rot: crash ? -interpolate(f, [100, 112, 150, 170], [0, -62, -62, 0], cl) * -1 : 0};
    R = {face: f > 120 && f < 175 ? 'blow' : f > 175 ? 'shock' : 'happy', arms: ['side', 'hold']};
    mm = f > 120 && f < 175 ? 'fire' : f >= 175 ? 'burnt' : 'raw'; mmAng = f > 120 && f < 175 ? 22 + Math.sin(t * 20) * 6 : mmAng;
    boost = interpolate(f, [100, 108, 140], [0, 1, 0.2], cl);
    bubble = <Bubble f={f - 6}><LunaCard f={f - 10} /></Bubble>;
  } else if (id === 'heist') {
    M = {face: 'tell', arms: ['down', 'hold'], light: 1};
    L = {face: f > 60 ? 'scared' : 'shock', arms: f > 60 ? ['cover', 'cover'] : ['up', 'up'], tremble: f > 60 ? 1 : 0};
    R = {face: f > 120 ? 'scream' : 'shock', arms: f > 120 ? ['up', 'up'] : ['side', 'hold']};
    mm = 'burnt';
    bubble = <Bubble f={f - 6}><HeistCard f={f - 10} /></Bubble>;
  } else if (id === 'end') {
    M = {face: f > 70 ? 'happy' : 'scream', arms: f > 70 ? ['side', 'hold'] : ['up', 'up'], light: f > 70 ? 0 : 1};
    L = {face: f > 70 ? 'happy' : 'scream', arms: f > 70 ? ['side', 'side'] : ['up', 'up']};
    R = {face: f > 70 ? 'chew' : 'scream', arms: f > 70 ? ['side', 'hold'] : ['up', 'up']};
    boost = interpolate(f, [0, 8, 60], [0, 1, 0], cl); mm = f > 70 ? 'raw' : 'burnt';
    bubble = f > 74 ? <Bubble f={f - 74} w={700} h={360}><EndCard f={f - 80} /></Bubble> : null;
  }
  return (
    <AbsoluteFill>
      <Sky t={t} />
      <Forest />
      <Pumpkin x={980} y={860} s={0.9} t={t} />
      <Pumpkin x={950} y={1230} s={1.1} t={t + 1} />
      <Log x={540} y={890} w={300} r={0} />
      <Ghost id="m" x={540} y={915} s={1.3} t={t} face={M.face} arms={M.arms} light={M.light} warm={1}>
        {M.light > 0 && <g opacity={M.light}><rect x={88} y={176} width={24} height={46} rx={7} fill="#2A2F45" /><rect x={84} y={170} width={32} height={14} rx={5} fill="#FFE38A" /></g>}
      </Ghost>
      <Log x={225} y={1035} w={270} r={14} />
      <Log x={855} y={1035} w={270} r={-14} />
      <Fire t={t} boost={boost} />
      <Ghost id="l" x={235} y={1035} s={1.18} t={t} face={L.face} arms={L.arms} ph={1.3} tremble={L.tremble ?? 0} rot={L.rot ?? 0} warm={1} />
      <Ghost id="r" x={850} y={1035} s={1.18} t={t} face={R.face} arms={R.arms} ph={2.6} warm={-1} />
      <Marshmallow t={t} state={mm} ang={mmAng} />
      <Laptop x={laptopX} y={1080} close={lap} />
      {bubble}
    </AbsoluteFill>
  );
};

// ---------------- film treatment ----------------
export const Film: React.FC<{g: number; card: boolean; still?: boolean}> = ({g, card, still = false}) => {
  const flick = rnd(g * 3.1) * (card ? 0.1 : 0.06);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `rgba(0,0,0,${flick})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 60%, rgba(10,8,20,0.55) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '300px 300px', backgroundPosition: `${rnd(g) * 300}px ${rnd(g + 1) * 300}px`, mixBlendMode: 'overlay', opacity: card ? 0.22 : 0.12}} />
      <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 6}, (_, i) => rnd(g * 7 + i) < 0.35 ? <circle key={i} cx={rnd(g + i * 11) * 1080} cy={rnd(g * 2 + i) * 1350} r={1 + rnd(g + i) * 3} fill={rnd(i + g) > 0.5 ? '#fff' : '#000'} opacity={0.5} /> : null)}
        {!still && rnd(Math.floor(g / 9) * 13) < 0.3 && <line x1={rnd(Math.floor(g / 9)) * 1080} x2={rnd(Math.floor(g / 9)) * 1080 + 4} y1={0} y2={1350} stroke={card ? '#ddd' : '#fff'} strokeWidth={1.4} opacity={0.25} />}
      </svg>
    </AbsoluteFill>
  );
};

export const ScaryStories: React.FC = () => {
  useFonts();
  const g = useCurrentFrame();
  const seg = T.find((s) => g >= s.from && g < s.to) ?? T[T.length - 1];
  const f = g - seg.from, len = seg.to - seg.from;
  const card = seg.k === 'card';
  // iris in/out on scenes, and a 1-px gate weave
  const iris = card ? 1 : Math.min(io(f / 10), 1 - io((f - (len - 8)) / 8));
  const weave = (rnd(Math.floor(g / 2)) - 0.5) * 2;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${weave * 0.6}px, ${weave}px)`, clipPath: card ? undefined : `circle(${Math.max(0.1, iris) * 110}% at 50% 55%)`}}>
        {seg.id === 'outro' ? <Outro f={f} /> : card ? <Intertitle id={seg.id} f={f} len={len} /> : <Scene id={seg.id} f={f} g={g} />}
      </AbsoluteFill>
      <Film g={g} card={card} />
      <Audio src={staticFile('halloween/silent-movie-46.mp3')} volume={(fr) => 0.75 * interpolate(fr, [0, 10, SCARY_DURATION - 50, SCARY_DURATION], [0, 1, 1, 0], cl)} />
      <Loop durationInFrames={180}><Audio src={staticFile('halloween/projector.wav')} volume={0.16} /></Loop>
      {T.filter((x) => x.k === 'scene' && x.id !== 'intro').map((x) => <Sequence key={x.id} from={x.from + 4} durationInFrames={30} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.35} /></Sequence>)}
      <Sequence from={630 + 100} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.5} /></Sequence>
      <Sequence from={990 + 40} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.5} /></Sequence>
      <Sequence from={1290} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.45} /></Sequence>
    </AbsoluteFill>
  );
};

// ---------------- thumbnail (cover for the post) ----------------
export const ScaryThumb: React.FC = () => {
  useFonts();
  const t = 2.4;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Sky t={t} />
      <Forest />
      <Pumpkin x={980} y={860} s={0.9} t={t} />
      <Pumpkin x={950} y={1230} s={1.1} t={t + 1} />
      <Log x={540} y={890} w={300} r={0} />
      <Ghost id="m" x={540} y={915} s={1.3} t={t} face="tell" arms={['up', 'hold']} light={1} warm={1}>
        <g><rect x={88} y={176} width={24} height={46} rx={7} fill="#2A2F45" /><rect x={84} y={170} width={32} height={14} rx={5} fill="#FFE38A" /></g>
      </Ghost>
      <Log x={225} y={1035} w={270} r={14} />
      <Log x={855} y={1035} w={270} r={-14} />
      <Fire t={t} boost={0.6} />
      <Ghost id="l" x={235} y={1035} s={1.18} t={t} face="scream" arms={['up', 'up']} ph={1.3} warm={1} />
      <Ghost id="r" x={850} y={1035} s={1.18} t={t} face="blow" arms={['side', 'hold']} ph={2.6} warm={-1} />
      <Marshmallow t={t} state="fire" ang={24} />
      <Laptop x={70} y={1080} close={0} />
      {/* title */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,12,30,0.78) 0%, rgba(10,12,30,0.45) 26%, rgba(10,12,30,0) 40%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 54, textAlign: 'center', color: CREAM}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 9, color: LIME}}>— HOTCOIN PRESENTS —</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 132, lineHeight: 0.95, marginTop: 14, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>Crypto <span style={{color: LIME}}>Scary</span> Stories</div>
      </div>
      <Bubble f={60} w={740} h={250} top={330}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: INK, textAlign: 'center'}}>
          <div style={{display: 'flex', gap: 14}}>
            {['I', 'II', 'III'].map((n) => (
              <div key={n} style={{width: 150, height: 92, borderRadius: 16, background: '#20294D', color: CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: 3, color: LIME}}>STORY {n}</div>
                <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, letterSpacing: 2}}>???</div>
              </div>
            ))}
          </div>
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 56, marginTop: 16, lineHeight: 1}}>Don’t watch alone…</div>
        </div>
      </Bubble>
      <div style={{position: 'absolute', left: 230, right: 150, top: 1212, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: LIME, color: INK, borderRadius: 999, padding: '16px 30px', fontFamily: DISPLAY, fontWeight: 900, fontSize: 30, boxShadow: '0 14px 30px rgba(10,12,30,0.45)'}}>
          <svg width={26} height={28} viewBox="0 0 26 28"><path d="M2,2 L24,14 L2,26Z" fill={INK} /></svg>WATCH IF YOU DARE
        </div>
      </div>
      <Film g={7} card={false} still />
    </AbsoluteFill>
  );
};

export const TallFrame: React.FC<{children: React.ReactNode; episode?: string; title?: string; small?: boolean}> = ({children, episode = 'EPISODE 1', title = 'Crypto Scary Stories', small = false}) => (
  <AbsoluteFill style={{background: '#0A0A09'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 285, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 34, color: CREAM}}>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 9, color: LIME}}>{episode}</div>
      <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: small ? 64 : 78, lineHeight: 1, marginTop: small ? 12 : 10}}>{title}</div>
    </div>
    <div style={{position: 'absolute', left: 0, top: 285, width: 1080, height: 1350, overflow: 'hidden'}}>{children}</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1635, height: 285, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 36, color: CREAM}}>
      <Img src={staticFile('brand/logo-official-white.png')} style={{width: 230, height: (230 * 328) / 2005}} />
      <div style={{fontFamily: MONO, fontSize: 20, letterSpacing: 5, marginTop: 16, opacity: 0.75}}>MARKET TRICKS · TRADING TREATS</div>
    </div>
  </AbsoluteFill>
);
export const ScaryStoriesTall: React.FC = () => <TallFrame><ScaryStories /></TallFrame>;
export const ScaryThumbTall: React.FC = () => <TallFrame episode="🎃 HALLOWEEN SPECIAL 🎃" title="Episode 1" small><ScaryThumb /></TallFrame>;
