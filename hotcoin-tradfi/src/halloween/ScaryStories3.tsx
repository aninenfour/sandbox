// "Crypto Scary Stories", Episode 3: "The Vanishing Act" (1080x1350, 30 fps, ~60 s). New set: a haunted parlour with
// a fireplace, portraits, candles, curtains and a big rug. Costumes: the Teller is a magician (top hat, wand) and
// vanishes in a puff of smoke in chapter III; Scaredy wears his scarf and sits on a pouf on the rug (the rug gets
// pulled in chapter I); Snacky watches from a wingback chair with a striped popcorn bucket (it vanishes in chapter II).
// Facts: SQUID (Squid Game token), Nov 1 2021: peak ~$2,861, ~$0.003 minutes later, holders could not sell
// (Benzinga, Cointelegraph). AnubisDAO, Oct 29 2021: ~$60M in ETH raised, liquidity removed ~20 hours into a
// 24-hour sale (The Block, Decrypt); the ETH later moved through Tornado Cash (Cointelegraph, 2023).
// OneCoin's founder: indicted Oct 2017, flew Sofia to Athens on Oct 25, 2017 and has not been seen since; alleged
// fraud of $4B+; FBI Ten Most Wanted since June 2022.
// Music: "Silent Movie 133" by Sascha Ende (ende.app), CC BY 4.0.
import React from 'react';
import {AbsoluteFill, Audio, Img, Loop, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Bubble, CREAM, DISPLAY, Film, Fire, Ghost, INK, Intertitle, LIME, MONO, Outro, Pumpkin, RED, SANS, SERIF, TallFrame, cl, io, out, rnd, sp, useFonts} from './ScaryStories';
import {Scarf} from './ScaryStories2';
import type {Arms, Face} from './ScaryStories';

const FPS = 30;
type Seg = {k: 'card' | 'scene'; from: number; to: number; id: string};
const LEN = {title: 120, scene0: 114, chap: 90, scene: 210, fact: 120, end: 150, outro: 140};
const T: Seg[] = (() => {
  const order: [Seg['k'], string, number][] = [['card', 'title', LEN.title], ['scene', 'intro', LEN.scene0], ['card', 'c1', LEN.chap], ['scene', 'squid', LEN.scene], ['card', 'c1b', LEN.fact],
    ['card', 'c2', LEN.chap], ['scene', 'anubis', LEN.scene], ['card', 'c2b', LEN.fact], ['card', 'c3', LEN.chap], ['scene', 'queen', LEN.scene], ['card', 'c3b', LEN.fact], ['scene', 'end', LEN.end], ['card', 'outro', LEN.outro]];
  let a = 0;
  return order.map(([k, id, len]) => { const seg = {k, id, from: a, to: a + len}; a += len; return seg; });
})();
const at = (id: string) => T.find((x) => x.id === id)!.from;
export const SCARY3_DURATION = T[T.length - 1].to;

const CARDS: Record<string, {kicker?: string; lines: React.ReactNode}> = {
  title: {kicker: 'HOTCOIN PRESENTS · EPISODE III', lines: <>The<br />Vanishing Act</>},
  c1: {kicker: 'CHAPTER I', lines: <>The token you<br />couldn’t sell.</>},
  c1b: {lines: <>Nov 2021. SQUID hit $2,861.<br />Nobody could sell.<br /><span style={{color: LIME}}>Minutes later: $0.003.</span></>},
  c2: {kicker: 'CHAPTER II', lines: <>Twenty hours.</>},
  c2b: {lines: <>$60 million raised<br />in a 24-hour sale.<br /><span style={{color: LIME}}>Gone at hour 20.</span></>},
  c3: {kicker: 'CHAPTER III', lines: <>The<br />Cryptoqueen.</>},
  c3b: {lines: <>$4 billion, allegedly.<br />One flight to Athens.<br /><span style={{color: LIME}}>Never seen again.</span></>},
};

// ---------------- set: the haunted parlour ----------------
const Parlour: React.FC<{t: number; candles?: number}> = ({t, candles = 1}) => (
  <AbsoluteFill>
    {/* wallpaper */}
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #4C4590 0%, #5A52A2 55%, #4A4388 100%)'}} />
    <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}} opacity={0.16}>
      <defs><pattern id="damask" width="120" height="150" patternUnits="userSpaceOnUse">
        <path d="M60,10 C80,40 100,50 60,75 C20,50 40,40 60,10Z M60,75 C85,95 95,120 60,140 C25,120 35,95 60,75Z" fill="#C9C2FF" />
        <circle cx={0} cy={75} r={6} fill="#C9C2FF" /><circle cx={120} cy={75} r={6} fill="#C9C2FF" />
      </pattern></defs>
      <rect width={1080} height={800} fill="url(#damask)" />
    </svg>
    {/* windows with moonlit sky */}
    {[90, 780].map((x, i) => (
      <div key={x} style={{position: 'absolute', left: x, top: 150, width: 210, height: 330, borderRadius: '105px 105px 8px 8px', overflow: 'hidden', border: '10px solid #2D2754', background: 'linear-gradient(180deg,#2E3D7A,#5C70B4)'}}>
        {i === 1 && <div style={{position: 'absolute', left: 92, top: 50, width: 70, height: 70, borderRadius: 35, background: '#FFFBEA', boxShadow: '0 0 40px rgba(255,251,234,0.7)'}} />}
        {Array.from({length: 7}, (_, k) => <div key={k} style={{position: 'absolute', left: rnd(k + x) * 190, top: rnd(k * 3 + x) * 250, width: 3, height: 3, borderRadius: 2, background: '#FFFBEA', opacity: 0.4 + 0.5 * Math.abs(Math.sin(t * 2 + k))}} />)}
        <div style={{position: 'absolute', left: 95, top: 0, bottom: 0, width: 8, background: '#2D2754'}} /><div style={{position: 'absolute', left: 0, right: 0, top: 160, height: 8, background: '#2D2754'}} />
      </div>
    ))}
    {/* curtains */}
    {[[50, -1], [270, 1], [740, -1], [960, 1]].map(([x, d], i) => (
      <svg key={i} width={90} height={430} viewBox="0 0 90 430" style={{position: 'absolute', left: x, top: 120, transform: d > 0 ? 'scaleX(-1)' : undefined}}>
        <path d={`M0,0 H90 Q70,${200 + Math.sin(t + i) * 6} 80,430 H0Z`} fill="#8A2E58" /><path d="M14,0 V430 M36,0 V430" stroke="#6E2347" strokeWidth={6} opacity={0.6} />
      </svg>
    ))}
    {/* wainscoting + floor */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 820, height: 110, background: '#3A3370', borderTop: '8px solid #2D2754'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 930, bottom: 0, background: 'repeating-linear-gradient(90deg,#7A5340 0 120px,#6E4A39 120px 240px)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 930, bottom: 0, background: 'linear-gradient(180deg, rgba(20,12,30,0.35), rgba(20,12,30,0))'}} />
    {/* fireplace */}
    <div style={{position: 'absolute', left: 330, top: 600, width: 420, height: 340, background: '#9C9AB4', borderRadius: '10px 10px 0 0', boxShadow: '0 20px 40px rgba(20,12,30,0.4)'}}>
      <div style={{position: 'absolute', left: -30, right: -30, top: -28, height: 34, background: '#7E7C9C', borderRadius: 8}} />
      <div style={{position: 'absolute', left: 80, right: 80, top: 80, bottom: 0, background: '#1A1630', borderRadius: '130px 130px 0 0'}} />
    </div>
    <Fire t={t} x={540} y={938} s={0.62} />
    {/* portrait above the mantel: the Hotcoin symbol, framed */}
    <div style={{position: 'absolute', left: 430, top: 380, width: 220, height: 180, border: '14px solid #C9A453', borderRadius: 10, background: 'radial-gradient(circle at 50% 40%, #2A3C24, #121A10)', boxShadow: 'inset 0 0 0 3px #8A6C2E, 0 10px 20px rgba(20,12,30,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Img src={staticFile('brand/symbol-official-white.png')} style={{width: 92, height: 92}} />
    </div>
    {/* candles on the mantel */}
    {[355, 725].map((x, i) => (
      <div key={x} style={{position: 'absolute', left: x, top: 520}}>
        <div style={{position: 'absolute', left: 0, top: 22, width: 18, height: 52, background: '#F3EBD8', borderRadius: 4}} />
        <div style={{position: 'absolute', left: 3, top: 0 + Math.sin(t * 9 + i) * 2, width: 12, height: 22, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: '#FFD27A', boxShadow: `0 0 ${24 * candles}px rgba(255,200,110,${0.9 * candles})`, opacity: candles}} />
      </div>
    ))}
    {/* cobwebs */}
    {[[0, 0, 0], [1080, 0, 90]].map(([x, y, r], i) => (
      <svg key={i} width={170} height={170} viewBox="0 0 170 170" style={{position: 'absolute', left: x - (r ? 170 : 0), top: y, transform: r ? 'scaleX(-1)' : undefined}} opacity={0.5}>
        {[30, 60, 95, 130].map((rr) => <path key={rr} d={`M${rr},0 Q${rr * 0.8},${rr * 0.8} 0,${rr}`} stroke="#E3E0FF" strokeWidth={2} fill="none" />)}
        {[0, 25, 50, 75].map((a) => <line key={a} x1={0} y1={0} x2={150 * Math.cos(a * Math.PI / 180)} y2={150 * Math.sin(a * Math.PI / 180)} stroke="#E3E0FF" strokeWidth={2} />)}
      </svg>
    ))}
  </AbsoluteFill>
);

const Rug: React.FC<{pull: number}> = ({pull}) => (
  <svg width={760} height={250} viewBox="0 0 760 250" style={{position: 'absolute', left: 30 - pull * 1300, top: 1075, transform: `rotate(${-pull * 6}deg)`}}>
    <ellipse cx={380} cy={130} rx={370} ry={110} fill="#8A2E58" />
    <ellipse cx={380} cy={130} rx={330} ry={88} fill="none" stroke="#E8B04A" strokeWidth={8} />
    <ellipse cx={380} cy={130} rx={250} ry={60} fill="#6E2347" />
    <ellipse cx={380} cy={130} rx={170} ry={38} fill="none" stroke="#E8B04A" strokeWidth={6} strokeDasharray="14 10" />
    {Array.from({length: 30}, (_, i) => { const a = (i / 30) * Math.PI * 2; return <line key={i} x1={380 + Math.cos(a) * 370} y1={130 + Math.sin(a) * 110} x2={380 + Math.cos(a) * 392} y2={130 + Math.sin(a) * 122} stroke="#E8B04A" strokeWidth={4} />; })}
  </svg>
);

const Pouf: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
  <svg width={220} height={110} viewBox="0 0 220 110" style={{position: 'absolute', left: x - 110, top: y - 40, transform: `rotate(${r}deg)`, transformOrigin: '50% 100%'}}>
    <ellipse cx={110} cy={86} rx={100} ry={20} fill="#3A6B5C" /><rect x={10} y={30} width={200} height={56} fill="#4E8A75" /><ellipse cx={110} cy={30} rx={100} ry={22} fill="#69A891" />
    {[50, 110, 170].map((cx) => <circle key={cx} cx={cx} cy={30} r={5} fill="#3A6B5C" />)}
  </svg>
);

const Armchair: React.FC = () => (
  <svg width={330} height={340} viewBox="0 0 330 340" style={{position: 'absolute', left: 690, top: 845}}>
    <path d="M40,40 Q165,-10 290,40 L280,230 H50Z" fill="#7A3FA0" /><path d="M60,58 Q165,20 270,58 L262,220 H68Z" fill="#8E52B6" />
    <rect x={10} y={180} width={80} height={110} rx={30} fill="#6A3590" /><rect x={240} y={180} width={80} height={110} rx={30} fill="#6A3590" />
    <rect x={60} y={220} width={210} height={70} rx={18} fill="#7A3FA0" />
    <rect x={40} y={290} width={16} height={40} rx={4} fill="#4E3528" /><rect x={274} y={290} width={16} height={40} rx={4} fill="#4E3528" />
  </svg>
);

// costumes (ghost space)
const TopHat: React.FC<{t: number; tilt?: number}> = ({t, tilt = 0}) => (
  <g transform={`rotate(${tilt + Math.sin(t * 2.4) * 2} 100 14)`}>
    <rect x={62} y={-62} width={76} height={76} rx={6} fill="#14121F" />
    <rect x={62} y={-8} width={76} height={14} fill={LIME} />
    <ellipse cx={100} cy={14} rx={64} ry={11} fill="#14121F" />
    <rect x={70} y={-58} width={10} height={60} rx={4} fill="#2A2740" />
  </g>
);
const Wand: React.FC<{a: number}> = ({a}) => (
  <g transform={`rotate(${a} 182 150)`}><rect x={180} y={60} width={9} height={92} rx={3} fill="#14121F" /><rect x={180} y={60} width={9} height={16} rx={3} fill="#FFFDF6" /></g>
);

const Popcorn: React.FC<{gone: number}> = ({gone}) => (
  <svg width={120} height={150} viewBox="-60 -70 120 150" style={{position: 'absolute', left: 950, top: 985, overflow: 'visible', opacity: 1 - gone, transform: `scale(${1 - gone * 0.6})`}}>
    {Array.from({length: 9}, (_, i) => <circle key={i} cx={-36 + (i % 5) * 18} cy={-34 - Math.floor(i / 5) * 14 - (i % 2) * 5} r={12} fill="#FFF3D1" stroke="#E8C77A" strokeWidth={2} />)}
    <path d="M-46,-30 L46,-30 L36,70 L-36,70Z" fill="#FFFDF6" />
    {[-34, -12, 10, 30].map((x) => <path key={x} d={`M${x},-30 L${x + 12},-30 L${x * 0.78 + 10},70 L${x * 0.78},70Z`} fill="#E5484D" />)}
    <rect x={-30} y={8} width={60} height={26} rx={6} fill={INK} />
    <text x={0} y={27} textAnchor="middle" fontFamily="Unbounded" fontWeight={900} fontSize={11} fill={LIME}>HOTCOIN</text>
  </svg>
);
const Poof: React.FC<{x: number; y: number; p: number; s?: number}> = ({x, y, p, s = 1}) => p <= 0 || p >= 1 ? null : (
  <svg width={400} height={400} viewBox="-200 -200 400 400" style={{position: 'absolute', left: x - 200, top: y - 200, overflow: 'visible', transform: `scale(${s})`}}>
    {Array.from({length: 9}, (_, i) => { const a = (i / 9) * Math.PI * 2; const r = 30 + p * 110; return <circle key={i} cx={Math.cos(a) * r * 0.8} cy={Math.sin(a) * r * 0.6} r={40 + p * 30} fill="#E9E6F5" opacity={(1 - p) * 0.9} />; })}
    <circle r={50 + p * 60} fill="#FFFFFF" opacity={(1 - p) * 0.9} />
    {[0, 1, 2, 3].map((k) => <path key={k} transform={`translate(${Math.cos(k * 1.7) * (60 + p * 120)} ${Math.sin(k * 1.7) * (50 + p * 90)}) scale(${1 - p})`} d="M0,-14 L4,-4 L14,0 L4,4 L0,14 L-4,4 L-14,0 L-4,-4Z" fill={LIME} />)}
  </svg>
);

// ---------------- bubble contents ----------------
const SquidCard: React.FC<{f: number}> = ({f}) => {
  const rise = io((f - 10) / 80), crash = io((f - 100) / 8);
  const price = crash > 0 ? 2861 * (1 - crash) + 0.003 * crash : 0.01 * Math.pow(2861 / 0.01, rise);
  const W = 470, H = 230, pts = 40;
  const curve = Array.from({length: pts}, (_, i) => { const k = i / (pts - 1); return [k * W * 0.86, H - 10 - Math.pow(k, 3.2) * (H - 30)]; });
  const drawn = Math.floor(rise * (pts - 1));
  const path = curve.slice(0, drawn + 1).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + (crash > 0 ? ` L${W * 0.86 + 6},${(20 + (H - 30) * crash).toFixed(1)}` : '');
  const tap = f > 54 && f < 90, fail = f > 58 && f < 90;
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 40}}>SQUID</div>
        <div style={{fontFamily: MONO, fontSize: 19, color: '#5A6478'}}>Nov 1, 2021 · price path, simplified</div>
      </div>
      <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 60, letterSpacing: -2, color: crash > 0.5 ? RED : '#1E9E57', fontVariantNumeric: 'tabular-nums'}}>${price >= 1 ? Math.round(price).toLocaleString('en-US') : price.toFixed(3)}</div>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, bottom: 0}}>
        <line x1={0} x2={W} y1={H - 10} y2={H - 10} stroke="#E3E7F0" strokeWidth={2} />
        <path d={path} stroke={crash > 0 ? RED : '#1E9E57'} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      {/* trade panel */}
      <div style={{position: 'absolute', right: 0, top: 70, width: 270, display: 'flex', flexDirection: 'column', gap: 12, transform: `translateX(${fail ? Math.sin(f * 2.5) * 8 : 0}px)`}}>
        <div style={{height: 64, borderRadius: 14, background: '#1E9E57', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 900, fontSize: 28}}>BUY</div>
        <div style={{height: 64, borderRadius: 14, background: fail ? '#C9CED8' : RED, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 900, fontSize: 28, position: 'relative', transform: tap ? 'scale(0.95)' : 'none'}}>
          SELL{fail && <span style={{position: 'absolute', right: 14, fontSize: 30}}>🔒</span>}
        </div>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 17, color: RED, opacity: fail ? 1 : 0, textAlign: 'center'}}>SELLING DISABLED</div>
      </div>
      {f > 116 && <div style={{position: 'absolute', right: 20, bottom: 10, transform: `rotate(-10deg) scale(${sp(f - 116, 9, 220)})`, border: `6px solid ${RED}`, color: RED, borderRadius: 12, padding: '4px 16px', fontFamily: DISPLAY, fontWeight: 900, fontSize: 44}}>RUG PULLED</div>}
    </div>
  );
};

const AnubisCard: React.FC<{f: number}> = ({f}) => {
  const hours = Math.min(20, (f / 120) * 20);
  const raised = 60 * io(f / 115);
  const pulled = f > 122;
  const hh = Math.floor(hours), mm = Math.floor((hours - hh) * 60);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK}}>
      <div style={{fontFamily: MONO, fontSize: 19, color: '#5A6478', letterSpacing: 1}}>ANUBISDAO · OCT 29, 2021 · 24-HOUR TOKEN SALE</div>
      <div style={{display: 'flex', gap: 22, marginTop: 18}}>
        <div style={{flex: 1, borderRadius: 16, background: '#EEF1F7', padding: '16px 20px'}}>
          <div style={{fontFamily: MONO, fontSize: 17, color: '#5A6478'}}>SALE CLOCK</div>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 54, color: pulled ? RED : INK, fontVariantNumeric: 'tabular-nums'}}>{String(hh).padStart(2, '0')}:{String(mm).padStart(2, '0')}<span style={{fontSize: 28, color: '#8A93A6'}}> / 24:00</span></div>
        </div>
        <div style={{flex: 1, borderRadius: 16, background: '#EEF1F7', padding: '16px 20px'}}>
          <div style={{fontFamily: MONO, fontSize: 17, color: '#5A6478'}}>RAISED IN ETH</div>
          <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 50, letterSpacing: -2, color: pulled ? RED : '#1E9E57', fontVariantNumeric: 'tabular-nums'}}>{pulled ? '$0' : `$${raised.toFixed(1)}M`}</div>
        </div>
      </div>
      <div style={{fontFamily: MONO, fontSize: 17, color: '#5A6478', marginTop: 20}}>LIQUIDITY POOL</div>
      <div style={{height: 46, borderRadius: 23, background: '#EEF1F7', marginTop: 8, overflow: 'hidden', border: '3px solid #20294D'}}>
        <div style={{height: '100%', width: `${(pulled ? Math.max(0, 1 - (f - 122) / 6) : raised / 60) * 100}%`, background: 'linear-gradient(90deg,#7EC25A,#B8F26A)'}} />
      </div>
      {pulled && <div style={{marginTop: 18, fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, color: RED, transform: `scale(${sp(f - 124, 9, 220)})`, transformOrigin: '0 50%'}}>LIQUIDITY REMOVED</div>}
      <div style={{position: 'absolute', left: 0, bottom: 0, fontFamily: MONO, fontSize: 18, color: '#5A6478', opacity: out((f - 150) / 12)}}>the ETH later vanished through Tornado Cash</div>
    </div>
  );
};

const QueenCard: React.FC<{f: number}> = ({f}) => {
  const fly = io((f - 20) / 70);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK, display: 'flex', gap: 26}}>
      {/* missing poster */}
      <div style={{width: 300, flex: 'none', background: '#F3EBD8', border: '3px solid #20294D', borderRadius: 8, padding: '14px 16px', textAlign: 'center', transform: 'rotate(-2deg)', boxShadow: '0 10px 20px rgba(20,12,30,0.18)', position: 'relative'}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 46, color: RED, letterSpacing: 1}}>MISSING</div>
        <svg width={140} height={150} viewBox="0 0 140 150" style={{marginTop: 6}}><rect width={140} height={150} rx={6} fill="#D9D0BA" /><circle cx={70} cy={58} r={34} fill="#20294D" /><path d="M14,150 Q14,96 70,96 Q126,96 126,150Z" fill="#20294D" /><text x={70} y={72} textAnchor="middle" fontFamily="Unbounded" fontWeight={900} fontSize={40} fill="#F3EBD8">?</text></svg>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 15, marginTop: 8}}>“THE CRYPTOQUEEN”</div>
        <div style={{fontFamily: MONO, fontSize: 14, color: '#5A6478', marginTop: 4}}>OneCoin founder · $4B+ alleged</div>
        {f > 130 && <div style={{position: 'absolute', left: 20, right: 20, top: 160, border: `4px solid ${RED}`, color: RED, fontFamily: MONO, fontWeight: 700, fontSize: 16, padding: '4px 6px', transform: `rotate(-12deg) scale(${sp(f - 130, 9, 220)})`, background: 'rgba(243,235,216,0.85)'}}>FBI TEN MOST WANTED</div>}
      </div>
      {/* flight path */}
      <div style={{flex: 1, position: 'relative'}}>
        <div style={{fontFamily: MONO, fontSize: 18, color: '#5A6478'}}>LAST SEEN · OCT 25, 2017</div>
        <svg width={460} height={300} style={{position: 'absolute', left: 0, top: 40}}>
          <path d="M40,60 Q220,-10 400,230" stroke="#20294D" strokeWidth={4} strokeDasharray="10 10" fill="none" />
          <circle cx={40} cy={60} r={10} fill="#20294D" /><text x={58} y={52} fontFamily="JetBrains Mono" fontWeight={700} fontSize={22} fill="#20294D">SOFIA</text>
          <circle cx={400} cy={230} r={10} fill={RED} /><text x={300} y={274} fontFamily="JetBrains Mono" fontWeight={700} fontSize={22} fill={RED}>ATHENS</text>
          {(() => { const p = fly, x = (1 - p) * (1 - p) * 40 + 2 * (1 - p) * p * 220 + p * p * 400, y = (1 - p) * (1 - p) * 60 + 2 * (1 - p) * p * -10 + p * p * 230; return <text x={x - 20} y={y + 12} fontSize={40} opacity={f > 100 ? Math.max(0, 1 - (f - 100) / 12) : 1}>✈️</text>; })()}
        </svg>
        <div style={{position: 'absolute', left: 0, bottom: 0, fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, color: RED, opacity: out((f - 110) / 12)}}>…then nothing.</div>
      </div>
    </div>
  );
};

const EndCard3: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: INK}}>
    <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 150, lineHeight: 1, transform: `scale(${0.8 + 0.2 * sp(f, 10, 160)})`}}>The End?</div>
    <div style={{fontFamily: MONO, fontSize: 22, color: '#5A6478', marginTop: 24, letterSpacing: 2, opacity: out((f - 30) / 14)}}>…HAPPY HALLOWEEN 🎃</div>
  </div>
);

// ---------------- the parlour scene ----------------
const Scene: React.FC<{id: string; f: number; g: number}> = ({id, f, g}) => {
  const t = g / FPS;
  let L: {face: Face; arms: [Arms, Arms]; tremble?: number; rot?: number} = {face: 'calm', arms: ['down', 'down']};
  let Mi: {face: Face; arms: [Arms, Arms]; light: number} = {face: 'calm', arms: ['down', 'hold'], light: 0};
  let R: {face: Face; arms: [Arms, Arms]} = {face: 'chew', arms: ['side', 'hold']};
  let pull = 0, popGone = 0, poofM = -1, poofR = -1, tellerAlpha = 1, tellerX = 540, wand = 0, candles = 1, fireBoost = 0;
  let bubble: React.ReactNode = null;
  if (id === 'intro') {
    Mi = {face: f > 40 ? 'tell' : 'calm', arms: ['down', 'hold'], light: io((f - 30) / 14)};
    L = {face: f > 50 ? 'scared' : 'calm', arms: ['down', 'down'], tremble: f > 50 ? 0.6 : 0};
    wand = f > 10 && f < 40 ? Math.sin(f / 3) * 25 : 0;
  } else if (id === 'squid') {
    Mi = {face: 'tell', arms: ['down', 'hold'], light: 1};
    pull = io((f - 112) / 10);
    L = {face: f > 112 ? 'scream' : f > 54 ? 'shock' : 'peek', arms: f > 112 ? ['up', 'up'] : ['down', 'down'], rot: f > 112 ? -interpolate(f, [112, 122, 170, 190], [0, 75, 75, 0], cl) : 0};
    R = {face: f > 112 ? 'happy' : 'chew', arms: f > 112 ? ['up', 'hold'] : ['side', 'hold']};
    bubble = <Bubble f={f - 6}><SquidCard f={f - 10} /></Bubble>;
  } else if (id === 'anubis') {
    Mi = {face: 'tell', arms: ['down', 'hold'], light: 1};
    pull = 1;
    L = {face: 'scared', arms: ['cover', 'cover'], tremble: 0.8};
    popGone = io((f - 134) / 6); poofR = (f - 132) / 22;
    R = {face: f > 136 ? 'shock' : 'chew', arms: f > 136 ? ['up', 'up'] : ['side', 'hold']};
    bubble = <Bubble f={f - 6}><AnubisCard f={f - 10} /></Bubble>;
  } else if (id === 'queen') {
    pull = 1; popGone = 1;
    const vanish = f > 118;
    Mi = {face: 'tell', arms: [f > 100 && f < 120 ? 'up' : 'down', 'hold'], light: 1};
    wand = f > 100 && f < 120 ? Math.sin(f / 2) * 30 : 0;
    poofM = (f - 116) / 24; tellerAlpha = vanish ? (f > 168 ? io((f - 168) / 10) : 0) : 1; tellerX = f > 168 ? 330 : 540;
    candles = f > 118 && f < 170 ? 0.15 : 1;
    L = {face: f > 168 ? 'scream' : f > 118 ? 'scared' : 'shock', arms: f > 168 ? ['up', 'up'] : ['down', 'down'], tremble: f > 118 && f < 168 ? 1 : 0};
    R = {face: f > 118 ? 'shock' : 'peek', arms: ['side', 'side']};
    fireBoost = f > 118 && f < 128 ? 1 : 0;
    bubble = <Bubble f={f - 6}><QueenCard f={f - 10} /></Bubble>;
  } else if (id === 'end') {
    pull = 1 - io(f / 40); popGone = 1 - io((f - 60) / 20);
    Mi = {face: f > 70 ? 'happy' : 'scream', arms: f > 70 ? ['side', 'hold'] : ['up', 'up'], light: f > 70 ? 0 : 1};
    L = {face: f > 70 ? 'happy' : 'scream', arms: f > 70 ? ['side', 'side'] : ['up', 'up']};
    R = {face: f > 70 ? 'chew' : 'scream', arms: f > 70 ? ['side', 'hold'] : ['up', 'up']};
    fireBoost = interpolate(f, [0, 8, 60], [0, 1, 0], cl);
    bubble = f > 74 ? <Bubble f={f - 74} w={700} h={360}><EndCard3 f={f - 80} /></Bubble> : null;
  }
  return (
    <AbsoluteFill>
      <Parlour t={t} candles={candles} />
      {fireBoost > 0 && <Fire t={t} x={540} y={938} s={0.62} boost={fireBoost} />}
      <Pumpkin x={150} y={990} s={0.62} t={t} />
      <Armchair />
      <Rug pull={pull} />
      <div style={{opacity: tellerAlpha}}>
        <Ghost id="m3" x={tellerX} y={1125} s={1.3} t={t} face={Mi.face} arms={Mi.arms} light={Mi.light} warm={1}>
          {Mi.light > 0 && <g opacity={Mi.light}><rect x={88} y={176} width={24} height={46} rx={7} fill="#2A2F45" /><rect x={84} y={170} width={32} height={14} rx={5} fill="#FFE38A" /></g>}
          <Wand a={-30 + wand} />
          <TopHat t={t} />
        </Ghost>
      </div>
      <Poof x={540} y={940} p={poofM} s={1.5} />
      <Pouf x={235 - pull * 60} y={1245} r={pull * -30} />
      <Ghost id="l3" x={235 - pull * 40} y={1225} s={1.2} t={t} face={L.face} arms={L.arms} ph={1.3} tremble={L.tremble ?? 0} rot={L.rot ?? 0} warm={1}><Scarf id="l3" /></Ghost>
      <Ghost id="r3" x={855} y={1120} s={1.2} t={t} face={R.face} arms={R.arms} ph={2.6} warm={-1} />
      <Popcorn gone={popGone} />
      <Poof x={1010} y={1030} p={poofR} s={0.6} />
      {bubble}
    </AbsoluteFill>
  );
};

export const ScaryStories3: React.FC = () => {
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
          ? <Outro f={f} extra="LESSON OF THE NIGHT: DO YOUR OWN RESEARCH" sources={<>Sources: Benzinga &amp; Cointelegraph (Nov 2021) · The Block &amp; Decrypt (Oct 2021) · FBI (2022) · Cointelegraph (2023)<br />Music: Silent Movie 133 by Sascha Ende (ende.app), CC BY 4.0</>} />
          : card ? <Intertitle id={seg.id} f={f} len={len} cards={CARDS} /> : <Scene id={seg.id} f={f} g={g} />}
      </AbsoluteFill>
      <Film g={g} card={card} />
      <Audio src={staticFile('halloween/silent-movie-133.mp3')} volume={(fr) => 0.7 * interpolate(fr, [0, 10, SCARY3_DURATION - 50, SCARY3_DURATION], [0, 1, 1, 0], cl)} />
      <Loop durationInFrames={180}><Audio src={staticFile('halloween/projector.wav')} volume={0.16} /></Loop>
      {T.filter((x) => x.k === 'scene' && x.id !== 'intro').map((x) => <Sequence key={x.id} from={x.from + 4} durationInFrames={30} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.35} /></Sequence>)}
      <Sequence from={at('squid') + 64} durationInFrames={20} layout="none"><Audio src={staticFile('sfx/mechanical/blocked.mp3')} volume={0.35} /></Sequence>
      <Sequence from={at('squid') + 122} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.5} /></Sequence>
      <Sequence from={at('anubis') + 132} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.45} /></Sequence>
      <Sequence from={at('queen') + 116} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.45} /></Sequence>
      <Sequence from={at('queen') + 168} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.5} /></Sequence>
      <Sequence from={at('end')} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.45} /></Sequence>
    </AbsoluteFill>
  );
};
export const ScaryStories3Tall: React.FC = () => <TallFrame episode="EPISODE 3" title="The Vanishing Act"><ScaryStories3 /></TallFrame>;

// ---------------- thumbnail (teaser, no spoilers) ----------------
export const ScaryThumb3: React.FC = () => {
  useFonts();
  const t = 2.4;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Parlour t={t} />
      <Pumpkin x={150} y={990} s={0.62} t={t} />
      <Armchair />
      <Rug pull={0} />
      <Ghost id="m3" x={540} y={1125} s={1.3} t={t} face="tell" arms={['up', 'hold']} light={1} warm={1}>
        <g><rect x={88} y={176} width={24} height={46} rx={7} fill="#2A2F45" /><rect x={84} y={170} width={32} height={14} rx={5} fill="#FFE38A" /></g>
        <Wand a={-10} />
        <TopHat t={t} />
      </Ghost>
      <Pouf x={235} y={1245} r={0} />
      <Ghost id="l3" x={235} y={1225} s={1.2} t={t} face="scream" arms={['up', 'up']} ph={1.3} warm={1}><Scarf id="l3t" /></Ghost>
      <Ghost id="r3" x={855} y={1120} s={1.2} t={t} face="chew" arms={['side', 'hold']} ph={2.6} warm={-1} />
      <Popcorn gone={0} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(14,10,34,0.82) 0%, rgba(14,10,34,0.5) 22%, rgba(14,10,34,0) 36%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 54, textAlign: 'center', color: CREAM}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 9, color: LIME}}>— CRYPTO SCARY STORIES · EP. III —</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 124, lineHeight: 0.95, marginTop: 14, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>The <span style={{color: LIME}}>Vanishing</span> Act</div>
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
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 56, marginTop: 16, lineHeight: 1}}>Now you see it…</div>
        </div>
      </Bubble>
      <div style={{position: 'absolute', left: 360, right: 0, top: 1240, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: LIME, color: INK, borderRadius: 999, padding: '16px 30px', fontFamily: DISPLAY, fontWeight: 900, fontSize: 30, boxShadow: '0 14px 30px rgba(10,12,30,0.45)'}}>
          <svg width={26} height={28} viewBox="0 0 26 28"><path d="M2,2 L24,14 L2,26Z" fill={INK} /></svg>WATCH IF YOU DARE
        </div>
      </div>
      <Film g={7} card={false} still />
    </AbsoluteFill>
  );
};
export const ScaryThumb3Tall: React.FC = () => <TallFrame episode="🎃 HALLOWEEN SPECIAL 🎃" title="Episode 3" small><ScaryThumb3 /></TallFrame>;
