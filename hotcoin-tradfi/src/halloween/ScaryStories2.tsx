// "Crypto Scary Stories", Episode 2: "The Lost Keys" (1080x1350, 30 fps, ~52 s). Same cast and film treatment as
// Episode 1, new set: a graveyard of dead coins (SQUID 2021, BitConnect 2018, LUNA 2022), mist and bats. Costumes:
// the Teller wears a witch hat, Scaredy a scarf over his mouth, Snacky carries a pumpkin candy bucket.
// Facts: James Howells' hard drive with 8,000 BTC thrown out in 2013, Newport (Wales) landfill; the High Court struck
// out his claim and the Court of Appeal refused an appeal (2025). Stefan Thomas: 7,002 BTC on an IronKey that allows
// 10 wrong passwords, 8 used (NYT, Jan 2021). Quadriga: CEO died Dec 2018 as the only key holder; ~C$215M owed to
// 76,000+ clients; the wallets had been empty since April 2018 (Ontario Securities Commission, 2020).
// BTC spot for "worth today" in data2.json. Music: "Silent Movie 60" by Sascha Ende (ende.app), CC BY 4.0.
import React from 'react';
import {AbsoluteFill, Audio, Img, Loop, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import data from './data2.json';
import {Bubble, CREAM, DISPLAY, Film, Fire, Ghost, INK, Intertitle, LIME, Laptop, Log, MONO, Outro, Pumpkin, RED, SANS, SERIF, Sky, TallFrame, cl, io, out, pine, rnd, sp, useFonts} from './ScaryStories';
import type {Arms, Face} from './ScaryStories';

const FPS = 30;
type Seg = {k: 'card' | 'scene'; from: number; to: number; id: string};
const T: Seg[] = [
  {k: 'card', from: 0, to: 96, id: 'title'},
  {k: 'scene', from: 96, to: 210, id: 'intro'},
  {k: 'card', from: 210, to: 270, id: 'c1'},
  {k: 'scene', from: 270, to: 480, id: 'landfill'},
  {k: 'card', from: 480, to: 570, id: 'c1b'},
  {k: 'card', from: 570, to: 630, id: 'c2'},
  {k: 'scene', from: 630, to: 840, id: 'password'},
  {k: 'card', from: 840, to: 930, id: 'c2b'},
  {k: 'card', from: 930, to: 990, id: 'c3'},
  {k: 'scene', from: 990, to: 1200, id: 'keys'},
  {k: 'card', from: 1200, to: 1290, id: 'c3b'},
  {k: 'scene', from: 1290, to: 1440, id: 'end'},
  {k: 'card', from: 1440, to: 1560, id: 'outro'},
];
export const SCARY2_DURATION = 1560;
const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const LANDFILL = 8000 * data.btcSpot, IRONKEY = 7002 * data.btcSpot;
const M = (n: number) => `$${Math.round(n / 1e6)}M`;

const CARDS: Record<string, {kicker?: string; lines: React.ReactNode}> = {
  title: {kicker: 'HOTCOIN PRESENTS · EPISODE II', lines: <>The<br />Lost Keys</>},
  c1: {kicker: 'CHAPTER I', lines: <>The landfill.</>},
  c1b: {lines: <>8,000 BTC on a hard drive.<br />Thrown out in 2013.<br /><span style={{color: LIME}}>About {M(LANDFILL)} today.</span></>},
  c2: {kicker: 'CHAPTER II', lines: <>Two guesses<br />left.</>},
  c2b: {lines: <>7,002 BTC behind<br />one forgotten password.<br /><span style={{color: LIME}}>8 wrong tries. 2 to go.</span></>},
  c3: {kicker: 'CHAPTER III', lines: <>The dead<br />man’s keys.</>},
  c3b: {lines: <>Only the CEO had the keys.<br />C$215M owed.<br /><span style={{color: LIME}}>The wallets? Already empty.</span></>},
};

// ---------------- set: graveyard of dead coins ----------------
const Tomb: React.FC<{x: number; y: number; s: number; r: number; coin?: string; year?: string; cross?: boolean}> = ({x, y, s, r, coin, year, cross}) => (
  <svg width={170 * s} height={230 * s} viewBox="-85 -200 170 230" style={{position: 'absolute', left: x - 85 * s, top: y - 200 * s, transform: `rotate(${r}deg)`, transformOrigin: '50% 100%', overflow: 'visible'}}>
    <ellipse cx={0} cy={20} rx={80} ry={10} fill="rgba(20,28,60,0.3)" />
    {cross ? (
      <g fill="#8391C2"><rect x={-14} y={-190} width={28} height={210} rx={6} /><rect x={-60} y={-150} width={120} height={28} rx={6} /><rect x={-14} y={-190} width={10} height={210} fill="#9CA9D6" /></g>
    ) : (
      <g>
        <path d="M-70,20 V-120 Q-70,-190 0,-190 Q70,-190 70,-120 V20Z" fill="#7C8ABD" />
        <path d="M-62,20 V-118 Q-62,-180 0,-180 Q62,-180 62,-118 V20Z" fill="#8F9CCE" />
        <text x={0} y={-112} textAnchor="middle" fontFamily="Unbounded" fontWeight={900} fontSize={34} fill="#56639A">RIP</text>
        <text x={0} y={-70} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={700} fontSize={coin && coin.length > 7 ? 15 : 20} fill="#46528A">{coin}</text>
        <text x={0} y={-40} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={17} fill="#56639A">{year}</text>
        <ellipse cx={-34} cy={4} rx={20} ry={8} fill="#7EC25A" opacity={0.75} /><ellipse cx={30} cy={8} rx={14} ry={6} fill="#7EC25A" opacity={0.6} />
      </g>
    )}
  </svg>
);

const Bat: React.FC<{t: number; k: number; x: number; y: number}> = ({t, k, x, y}) => {
  const flap = Math.sin(t * 22 + k) ;
  return (
    <svg width={90} height={50} viewBox="-45 -25 90 50" style={{position: 'absolute', left: x - 45, top: y - 25}}>
      <path d={`M0,0 C-10,-6 -22,${-14 * flap} -42,${-6 * flap} C-34,4 -26,2 -20,8 C-16,2 -8,6 0,10 C8,6 16,2 20,8 C26,2 34,4 42,${-6 * flap} C22,${-14 * flap} 10,-6 0,0Z`} fill="#1E2546" />
      <circle cx={0} cy={2} r={6} fill="#1E2546" /><circle cx={-2} cy={1} r={1.4} fill="#FFE38A" /><circle cx={2} cy={1} r={1.4} fill="#FFE38A" />
    </svg>
  );
};

const Graveyard: React.FC<{t: number}> = ({t}) => (
  <>
    <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 11}, (_, i) => pine(-30 + i * 108 + rnd(i + 40) * 40, 740, 280 + rnd(i + 43) * 150, 160 + rnd(i + 45) * 60, '#5D6FB0', i))}
      {Array.from({length: 8}, (_, i) => pine(-10 + i * 150 + rnd(i + 60) * 50, 770, 340 + rnd(i + 63) * 150, 200 + rnd(i + 65) * 60, '#4A5C9E', 100 + i))}
      {/* iron fence */}
      <g stroke="#2E3866" strokeWidth={6} strokeLinecap="round">
        <line x1={0} x2={1080} y1={712} y2={712} /><line x1={0} x2={1080} y1={760} y2={760} />
        {Array.from({length: 28}, (_, i) => <g key={i}><line x1={i * 40 + 10} x2={i * 40 + 10} y1={690} y2={790} /><path d={`M${i * 40 + 3},${694} L${i * 40 + 10},${680} L${i * 40 + 17},${694}`} fill="#2E3866" strokeWidth={3} /></g>)}
      </g>
      <path d="M0,770 Q270,735 540,760 T1080,750 L1080,1350 L0,1350Z" fill="url(#gr2)" />
      <defs><linearGradient id="gr2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5B6CAA" /><stop offset="1" stopColor="#3E4F8C" /></linearGradient></defs>
    </svg>
    <Tomb x={110} y={860} s={0.95} r={-6} coin="SQUID" year="2021" />
    <Tomb x={320} y={815} s={0.7} r={4} cross />
    <Tomb x={780} y={820} s={0.85} r={5} coin="BITCONNECT" year="2018" />
    <Tomb x={985} y={865} s={0.95} r={-4} coin="LUNA" year="2022" />
    {/* mist */}
    {[[150, 900, 0], [520, 870, 1], [900, 905, 2], [300, 1180, 3], [780, 1210, 4]].map(([x, y, k]) => (
      <div key={k} style={{position: 'absolute', left: x - 260 + Math.sin(t * 0.4 + k) * 60, top: y - 40, width: 520, height: 80, borderRadius: '50%', background: 'rgba(225,232,255,0.16)', filter: 'blur(16px)'}} />
    ))}
  </>
);

// ---------------- costumes (drawn inside the ghost's own 200x260 space) ----------------
const WitchHat: React.FC<{t: number}> = ({t}) => (
  <g transform={`rotate(${Math.sin(t * 2.4) * 3} 100 20)`}>
    <ellipse cx={100} cy={20} rx={80} ry={14} fill="#2B2350" />
    <path d="M58,18 C70,-22 94,-60 132,-80 C120,-52 138,-12 144,18Z" fill="#3B2F6E" />
    <path d="M60,4 L142,4 L144,18 L58,18Z" fill={LIME} />
    <rect x={92} y={2} width={18} height={18} rx={3} fill="none" stroke="#2B2350" strokeWidth={4} />
  </g>
);
const Scarf: React.FC = () => (
  <g>
    <defs><pattern id="stripe" width="28" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><rect width="28" height="40" fill={LIME} /><rect width="13" height="40" fill="#2B3A6E" /></pattern></defs>
    <path d="M28,122 Q100,108 172,122 L170,160 Q100,148 30,160Z" fill="url(#stripe)" />
    <path d="M132,150 L160,150 L166,214 L138,216Z" fill="url(#stripe)" />
    <path d="M138,216 l4,10 M146,216 l3,10 M154,215 l3,10 M161,214 l3,10" stroke="#2B3A6E" strokeWidth={3} />
  </g>
);

const CandyBucket: React.FC<{t: number; full: number; tilt: number}> = ({t, full, tilt}) => (
  <svg width={150} height={150} viewBox="-75 -80 150 150" style={{position: 'absolute', left: 925, top: 905, transform: `rotate(${tilt}deg)`, overflow: 'visible'}}>
    <path d="M-48,-30 Q0,-95 48,-30" stroke="#1E2546" strokeWidth={6} fill="none" />
    {full > 0 && Array.from({length: 7}, (_, i) => <circle key={i} cx={-36 + i * 12} cy={-34 - (i % 2) * 8 * full} r={9} fill={['#F6465D', '#B8F26A', '#FFD65A', '#9D7BFF', '#FF8FB1', '#7FC8FF', '#FFD65A'][i]} opacity={full} />)}
    <path d="M-56,-32 Q-60,40 0,44 Q60,40 56,-32Z" fill="#F28C38" />
    <ellipse cx={0} cy={-32} rx={56} ry={12} fill={full > 0 ? '#E8772A' : '#3A2A22'} />
    <g fill="#2B2350"><path d="M-30,-6 l12,-16 l12,16Z" /><path d="M6,-6 l12,-16 l12,16Z" /><path d="M-30,16 l10,10 l10,-6 l10,6 l10,-6 l10,6 l10,-10 q-30,22 -60,0Z" /></g>
  </svg>
);
const Candy: React.FC<{p: number}> = ({p}) => p <= 0 || p >= 1 ? null : (
  <div style={{position: 'absolute', left: 990 - p * 120, top: 900 - Math.sin(p * Math.PI) * 90 + p * -10, width: 18, height: 18, borderRadius: 9, background: '#FFD65A', boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.15)'}} />
);

// ---------------- bubble contents ----------------
const LandfillCard: React.FC<{f: number}> = ({f}) => {
  const drop = sp(f - 20, 9, 120);
  const v = LANDFILL * io((f - 95) / 60);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div style={{fontFamily: MONO, fontSize: 21, color: '#5A6478', letterSpacing: 1}}>NEWPORT, WALES · 2013</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, color: '#E8891A'}}>8,000 BTC</div>
      </div>
      <svg width={810} height={250} style={{position: 'absolute', left: 0, top: 50}}>
        {/* gulls */}
        {[0, 1, 2].map((k) => <path key={k} d={`M${560 + k * 60 + Math.sin(f / 10 + k) * 10},${40 + k * 18} q10,-10 20,0 q10,-10 20,0`} stroke="#5A6478" strokeWidth={3} fill="none" />)}
        {/* hard drive falling into the heap */}
        <g transform={`translate(${330} ${-70 + drop * 210}) rotate(${(1 - drop) * 140 + 18})`}>
          <rect x={-60} y={-38} width={120} height={76} rx={8} fill="#C9D0DC" stroke="#20294D" strokeWidth={4} />
          <circle cx={-12} cy={0} r={24} fill="#E7EBF2" stroke="#20294D" strokeWidth={3} /><circle cx={-12} cy={0} r={5} fill="#20294D" />
          <line x1={-12} y1={0} x2={34} y2={20} stroke="#20294D" strokeWidth={4} strokeLinecap="round" />
        </g>
        {/* trash heap in front of the drive */}
        <path d="M0,250 C60,150 140,120 220,150 C300,105 420,110 480,160 C560,120 680,140 810,250Z" fill="#8C7A64" />
        <path d="M30,250 C90,190 160,175 240,195 C320,160 430,170 500,205 C590,180 700,190 790,250Z" fill="#6F604E" />
        {[[120, 190, '#5DA9E9', 0], [250, 175, '#F6465D', 20], [420, 182, '#B8F26A', -15], [560, 200, '#FFD65A', 30], [690, 215, '#C9D0DC', -10], [330, 215, '#9D7BFF', 10]].map(([x, y, c, r], i) => (
          <rect key={i} x={x as number} y={y as number} width={34} height={22} rx={4} fill={c as string} transform={`rotate(${r} ${x} ${y})`} opacity={0.9} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'baseline', gap: 18, opacity: out((f - 90) / 12)}}>
        <div style={{fontFamily: MONO, fontSize: 20, color: '#5A6478', width: 170}}>WORTH TODAY</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, letterSpacing: -3, fontVariantNumeric: 'tabular-nums', color: f > 155 ? '#1E9E57' : INK}}>{usd(v)}</div>
      </div>
    </div>
  );
};

const PasswordCard: React.FC<{f: number}> = ({f}) => {
  const tries = Math.max(0, Math.min(8, Math.floor((f - 18) / 13) + 1));
  const sinceTry = (f - 18) % 13;
  const shake = tries > 0 && tries <= 8 && f < 18 + 8 * 13 && sinceTry < 5 ? Math.sin(sinceTry * 3) * 10 : 0;
  const done = f >= 18 + 8 * 13;
  const dots = done || f < 18 ? 0 : Math.max(0, Math.min(10, Math.floor(sinceTry * 1.2)));
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <svg width={120} height={56} viewBox="0 0 120 56"><rect x={2} y={10} width={82} height={36} rx={8} fill="#20294D" /><rect x={84} y={16} width={30} height={24} rx={3} fill="#C9D0DC" stroke="#20294D" strokeWidth={3} /><circle cx={18} cy={28} r={7} fill="none" stroke="#C9D0DC" strokeWidth={3} /><text x={34} y={33} fontFamily="JetBrains Mono" fontSize={13} fontWeight={700} fill="#C9D0DC">KEY</text></svg>
        <div>
          <div style={{fontFamily: MONO, fontSize: 18, color: '#5A6478', letterSpacing: 1}}>ENCRYPTED DRIVE · OPENS WITH ONE PASSWORD</div>
          <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, color: '#E8891A'}}>7,002 BTC inside</div>
        </div>
      </div>
      <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, transform: `translateX(${shake}px)`}}>
        <div style={{flex: 1, height: 70, borderRadius: 14, border: `3px solid ${shake ? RED : '#20294D'}`, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 22px', fontFamily: MONO, fontSize: 36, letterSpacing: 6}}>
          {'•'.repeat(dots)}<span style={{width: 3, height: 36, background: INK, opacity: Math.floor(f / 8) % 2, marginLeft: 4}} />
        </div>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 20, color: RED, width: 190, opacity: shake ? 1 : 0}}>WRONG PASSWORD</div>
      </div>
      <div style={{fontFamily: MONO, fontSize: 18, color: '#5A6478', marginTop: 22, letterSpacing: 1}}>ATTEMPTS · 10 WRONG = LOCKED FOREVER</div>
      <div style={{display: 'flex', gap: 10, marginTop: 10}}>
        {Array.from({length: 10}, (_, i) => {
          const used = i < tries, left = i >= 8 && done;
          return <div key={i} style={{width: 64, height: 64, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 900, fontSize: 30,
            background: used ? '#FFE3E7' : left ? (Math.floor(f / 7) % 2 ? '#FFF3C4' : '#fff') : '#EEF1F7', color: RED, border: `3px solid ${used ? RED : left ? '#E8B400' : '#D5DBE8'}`, transform: used && i === tries - 1 && sinceTry < 6 && !done ? `scale(${1.2 - sinceTry * 0.033})` : 'none'}}>{used ? '✕' : ''}</div>;
        })}
      </div>
      {done && <div style={{position: 'absolute', right: 10, bottom: 0, fontFamily: DISPLAY, fontWeight: 900, fontSize: 52, color: RED, transform: `rotate(-4deg) scale(${sp(f - 18 - 8 * 13, 9, 220)})`}}>2 tries left</div>}
    </div>
  );
};

const KeysCard: React.FC<{f: number}> = ({f}) => {
  const crumble = io((f - 55) / 30), open = io((f - 100) / 26);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK}}>
      <div style={{fontFamily: MONO, fontSize: 20, color: '#5A6478', letterSpacing: 1}}>CANADIAN EXCHANGE · DECEMBER 2018</div>
      <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 38, marginTop: 4}}>C$215M owed to 76,000+ clients</div>
      <svg width={810} height={300} style={{position: 'absolute', left: 0, top: 95}}>
        {/* vault interior (revealed when the door opens): empty, cobweb */}
        <rect x={60} y={20} width={260} height={260} rx={24} fill="#1A1F33" />
        <path d="M60,44 Q90,60 84,20 M60,44 L110,20 M60,70 Q120,70 140,20" stroke="#5A6478" strokeWidth={2} fill="none" opacity={open} />
        <text x={208} y={170} textAnchor="middle" fontFamily="Unbounded" fontWeight={900} fontSize={44} fill="#F6465D" opacity={open}>0 BTC</text>
        {/* door swings open on its left hinge */}
        <g transform={`translate(60 20) scale(${1 - 0.86 * open} 1)`}>
          <rect x={0} y={0} width={260} height={260} rx={24} fill="#C9D0DC" stroke="#20294D" strokeWidth={5} />
          <circle cx={130} cy={130} r={78} fill="#E7EBF2" stroke="#20294D" strokeWidth={5} />
          {[0, 60, 120, 180, 240, 300].map((a) => <line key={a} x1={130} y1={130} x2={130} y2={66} stroke="#20294D" strokeWidth={6} strokeLinecap="round" transform={`rotate(${a + f * 0.5} 130 130)`} />)}
          {/* padlock */}
          <path d="M108,118 v-16 a22,22 0 0 1 44,0 v16" stroke="#20294D" strokeWidth={8} fill="none" />
          <rect x={98} y={116} width={64} height={52} rx={10} fill="#FFD65A" stroke="#20294D" strokeWidth={4} />
        </g>
        {/* the only key, crumbling */}
        <g transform="translate(470 140)" opacity={1 - crumble * 0.9}>
          <g transform={`rotate(${-20 + Math.sin(f / 8) * 4})`}>
            <circle cx={0} cy={0} r={36} fill="none" stroke="#E8B400" strokeWidth={14} />
            <rect x={30} y={-8} width={150} height={16} rx={6} fill="#E8B400" />
            <rect x={140} y={8} width={14} height={30} rx={3} fill="#E8B400" /><rect x={164} y={8} width={14} height={22} rx={3} fill="#E8B400" />
          </g>
        </g>
        {crumble > 0 && Array.from({length: 26}, (_, i) => (
          <rect key={i} x={430 + rnd(i) * 220} y={120 + rnd(i + 3) * 40 + crumble * (60 + rnd(i + 5) * 120)} width={8 + rnd(i) * 8} height={8 + rnd(i + 1) * 8} fill="#E8B400" opacity={1 - crumble * 0.8} transform={`rotate(${rnd(i) * 90} ${430 + rnd(i) * 220} 140)`} />
        ))}
        <g opacity={1 - crumble}><rect x={600} y={70} width={150} height={44} rx={8} fill="#20294D" /><text x={675} y={99} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={700} fontSize={18} fill="#FFFDF6">ONLY KEY</text></g>
      </svg>
      <div style={{position: 'absolute', left: 0, bottom: 0, fontFamily: MONO, fontSize: 20, color: '#5A6478', opacity: out((f - 140) / 12)}}>the wallets had been empty since April 2018</div>
    </div>
  );
};

const EndCard2: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: INK}}>
    <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 150, lineHeight: 1, transform: `scale(${0.8 + 0.2 * sp(f, 10, 160)})`}}>The End?</div>
    <div style={{fontFamily: MONO, fontSize: 22, color: '#5A6478', marginTop: 24, letterSpacing: 2, opacity: out((f - 30) / 14)}}>…MORE STORIES TO COME THIS HALLOWEEN</div>
  </div>
);

// ---------------- the graveyard scene ----------------
const Scene: React.FC<{id: string; f: number; g: number}> = ({id, f, g}) => {
  const t = g / FPS;
  let L: {face: Face; arms: [Arms, Arms]; tremble?: number; rot?: number} = {face: 'calm', arms: ['down', 'down']};
  let Mi: {face: Face; arms: [Arms, Arms]; light: number} = {face: 'calm', arms: ['down', 'hold'], light: 0};
  let R: {face: Face; arms: [Arms, Arms]} = {face: 'chew', arms: ['side', 'hold']};
  let full = 1, tilt = 0, boost = 0, candy = -1, bats = -1;
  let bubble: React.ReactNode = null;
  if (id === 'intro') {
    Mi = {face: f > 40 ? 'tell' : 'calm', arms: ['down', 'hold'], light: io((f - 30) / 14)};
    L = {face: f > 50 ? 'scared' : 'calm', arms: ['down', 'down'], tremble: f > 50 ? 0.6 : 0};
    candy = (f - 10) / 24; bats = f / 70;
  } else if (id === 'landfill') {
    Mi = {face: 'tell', arms: [f > 20 && f < 60 ? 'up' : 'down', 'hold'], light: 1};
    L = {face: f > 150 ? 'shock' : 'peek', arms: f > 150 ? ['up', 'up'] : ['down', 'down']};
    R = {face: f > 150 ? 'shock' : 'chew', arms: f > 150 ? ['up', 'hold'] : ['side', 'hold']};
    candy = (f - 40) / 24;
    bubble = <Bubble f={f - 6}><LandfillCard f={f - 10} /></Bubble>;
  } else if (id === 'password') {
    Mi = {face: 'tell', arms: ['down', 'hold'], light: 1};
    const tryHit = f > 28 && f < 132 && (f - 28) % 13 < 4;
    L = {face: tryHit ? 'cry' : 'scared', arms: ['cover', 'cover'], tremble: 1};
    R = {face: f > 132 ? 'blow' : 'chew', arms: ['side', 'hold']};
    candy = f < 120 ? ((f - 20) % 40) / 24 : -1;
    bats = (f - 140) / 60;
    bubble = <Bubble f={f - 6}><PasswordCard f={f - 10} /></Bubble>;
  } else if (id === 'keys') {
    Mi = {face: 'tell', arms: ['down', 'hold'], light: 1};
    const empty = f > 110;
    L = {face: empty ? 'cry' : 'scared', arms: empty ? ['up', 'up'] : ['down', 'down'], tremble: empty ? 0 : 0.8, rot: empty ? interpolate(f, [110, 120, 160, 180], [0, 62, 62, 0], cl) * -1 : 0};
    R = {face: f > 60 && f < 110 ? 'peek' : f >= 110 ? 'scream' : 'chew', arms: f >= 110 ? ['up', 'up'] : ['side', 'hold']};
    full = f > 60 ? 0 : 1; tilt = f > 60 && f < 110 ? -28 : 0;
    boost = interpolate(f, [110, 118, 150], [0, 1, 0.2], cl);
    bubble = <Bubble f={f - 6}><KeysCard f={f - 10} /></Bubble>;
  } else if (id === 'end') {
    Mi = {face: f > 70 ? 'happy' : 'scream', arms: f > 70 ? ['side', 'hold'] : ['up', 'up'], light: f > 70 ? 0 : 1};
    L = {face: f > 70 ? 'happy' : 'scream', arms: f > 70 ? ['side', 'side'] : ['up', 'up']};
    R = {face: f > 70 ? 'happy' : 'scream', arms: f > 70 ? ['side', 'hold'] : ['up', 'up']};
    full = f > 90 ? 1 : 0; boost = interpolate(f, [0, 8, 60], [0, 1, 0], cl); bats = (f - 10) / 70;
    bubble = f > 74 ? <Bubble f={f - 74} w={700} h={360}><EndCard2 f={f - 80} /></Bubble> : null;
  }
  return (
    <AbsoluteFill>
      <Sky t={t} />
      {bats > 0 && bats < 1 && [0, 1, 2].map((k) => <Bat key={k} t={t} k={k} x={-80 + bats * 1240 - k * 90} y={190 + k * 34 + Math.sin(bats * 9 + k) * 26} />)}
      <Graveyard t={t} />
      <Pumpkin x={955} y={1240} s={1.05} t={t + 1} />
      <Log x={540} y={890} w={300} r={0} />
      <Ghost id="m2" x={540} y={915} s={1.3} t={t} face={Mi.face} arms={Mi.arms} light={Mi.light} warm={1}>
        {Mi.light > 0 && <g opacity={Mi.light}><rect x={88} y={176} width={24} height={46} rx={7} fill="#2A2F45" /><rect x={84} y={170} width={32} height={14} rx={5} fill="#FFE38A" /></g>}
        <WitchHat t={t} />
      </Ghost>
      <Log x={225} y={1035} w={270} r={14} />
      <Log x={855} y={1035} w={270} r={-14} />
      <Fire t={t} boost={boost} />
      <Ghost id="l2" x={235} y={1035} s={1.18} t={t} face={L.face} arms={L.arms} ph={1.3} tremble={L.tremble ?? 0} rot={L.rot ?? 0} warm={1}><Scarf /></Ghost>
      <Ghost id="r2" x={850} y={1035} s={1.18} t={t} face={R.face} arms={R.arms} ph={2.6} warm={-1} />
      <CandyBucket t={t} full={full} tilt={tilt} />
      {full > 0 && <Candy p={candy} />}
      {id === 'keys' && f > 64 && f < 110 && <div style={{position: 'absolute', left: 935, top: 840, fontFamily: DISPLAY, fontWeight: 900, fontSize: 46, color: CREAM, transform: `scale(${sp(f - 64, 10, 220)})`}}>?!</div>}
      <Laptop x={70} y={1080} close={0} />
      {bubble}
    </AbsoluteFill>
  );
};

export const ScaryStories2: React.FC = () => {
  useFonts();
  const g = useCurrentFrame();
  const seg = T.find((s) => g >= s.from && g < s.to) ?? T[T.length - 1];
  const f = g - seg.from, len = seg.to - seg.from;
  const card = seg.k === 'card';
  const iris = card ? 1 : Math.min(io(f / 10), 1 - io((f - (len - 8)) / 8));
  const weave = (rnd(Math.floor(g / 2)) - 0.5) * 2;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${weave * 0.6}px, ${weave}px)`, clipPath: card ? undefined : `circle(${Math.max(0.1, iris) * 110}% at 50% 55%)`}}>
        {seg.id === 'outro'
          ? <Outro f={f} extra="LESSON OF THE NIGHT: GUARD YOUR KEYS" sources={<>Sources: UK High Court &amp; Court of Appeal (2025) · New York Times (Jan 2021) · Ontario Securities Commission (2020) · BTC price via Coinbase, Oct 2026<br />Music: Silent Movie 60 by Sascha Ende (ende.app), CC BY 4.0</>} />
          : card ? <Intertitle id={seg.id} f={f} len={len} cards={CARDS} /> : <Scene id={seg.id} f={f} g={g} />}
      </AbsoluteFill>
      <Film g={g} card={card} />
      <Audio src={staticFile('halloween/silent-movie-60.mp3')} volume={(fr) => 0.75 * interpolate(fr, [0, 10, SCARY2_DURATION - 50, SCARY2_DURATION], [0, 1, 1, 0], cl)} />
      <Loop durationInFrames={180}><Audio src={staticFile('halloween/projector.wav')} volume={0.16} /></Loop>
      {T.filter((x) => x.k === 'scene' && x.id !== 'intro').map((x) => <Sequence key={x.id} from={x.from + 4} durationInFrames={30} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.35} /></Sequence>)}
      <Sequence from={270 + 30} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.45} /></Sequence>
      {Array.from({length: 8}, (_, i) => <Sequence key={i} from={630 + 28 + i * 13} durationInFrames={20} layout="none"><Audio src={staticFile('sfx/mechanical/blocked.mp3')} volume={0.3} /></Sequence>)}
      <Sequence from={990 + 120} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.5} /></Sequence>
      <Sequence from={1290} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.45} /></Sequence>
    </AbsoluteFill>
  );
};

// ---------------- thumbnail (teaser, no spoilers) ----------------
export const ScaryThumb2: React.FC = () => {
  useFonts();
  const t = 2.4;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Sky t={t} />
      <Graveyard t={t} />
      <Pumpkin x={955} y={1240} s={1.05} t={t + 1} />
      <Log x={540} y={890} w={300} r={0} />
      <Ghost id="m2" x={540} y={915} s={1.3} t={t} face="tell" arms={['up', 'hold']} light={1} warm={1}>
        <g><rect x={88} y={176} width={24} height={46} rx={7} fill="#2A2F45" /><rect x={84} y={170} width={32} height={14} rx={5} fill="#FFE38A" /></g>
        <WitchHat t={t} />
      </Ghost>
      <Log x={225} y={1035} w={270} r={14} />
      <Log x={855} y={1035} w={270} r={-14} />
      <Fire t={t} boost={0.6} />
      <Ghost id="l2" x={235} y={1035} s={1.18} t={t} face="scream" arms={['up', 'up']} ph={1.3} warm={1}><Scarf /></Ghost>
      <Ghost id="r2" x={850} y={1035} s={1.18} t={t} face="shock" arms={['up', 'hold']} ph={2.6} warm={-1} />
      <CandyBucket t={t} full={1} tilt={-12} />
      <Laptop x={70} y={1080} close={0} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,12,30,0.8) 0%, rgba(10,12,30,0.45) 26%, rgba(10,12,30,0) 40%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 54, textAlign: 'center', color: CREAM}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 9, color: LIME}}>— CRYPTO SCARY STORIES · EP. II —</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 132, lineHeight: 0.95, marginTop: 14, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>The <span style={{color: LIME}}>Lost</span> Keys</div>
      </div>
      <Bubble f={60} w={740} h={250} top={330}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: INK, textAlign: 'center'}}>
          <div style={{display: 'flex', gap: 14}}>
            {['I', 'II', 'III'].map((n) => (
              <div key={n} style={{width: 150, height: 92, borderRadius: 16, background: '#20294D', color: CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: 3, color: LIME}}>STORY {n}</div>
                <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, letterSpacing: 2}}>🔒</div>
              </div>
            ))}
          </div>
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 56, marginTop: 16, lineHeight: 1}}>Where did the keys go…?</div>
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
export const ScaryStories2Tall: React.FC = () => <TallFrame episode="EPISODE 2" title="The Lost Keys"><ScaryStories2 /></TallFrame>;
export const ScaryThumb2Tall: React.FC = () => <TallFrame episode="🎃 HALLOWEEN SPECIAL 🎃" title="Episode 2" small><ScaryThumb2 /></TallFrame>;
