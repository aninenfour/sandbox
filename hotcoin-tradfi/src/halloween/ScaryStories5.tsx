// "Crypto Scary Stories", Episode 5: "Bugs in the Code" (1080x1350, 30 fps, ~60 s), the one before the finale. New set:
// a mad-science lab at night (brick wall, arched window with lightning, a sparking Tesla coil, bubbling flasks, a wall
// lever, cobwebs and dangling spiders, the "bugs"). Costumes: the Teller is the mad scientist (goggles, bow tie, test
// tube), the left ghost is the bug hunter (pith helmet, bug net), the right ghost has a caramel apple. No scarf.
// Facts: value overflow incident, 15 Aug 2010, block 74638, two outputs of 92,233,720,368.54 BTC (184,467,440,737 BTC
// in total), patched in v0.3.10 within hours (bitcoin.it wiki, CVE-2010-5139). The DAO, 17 Jun 2016, ~3.6M ETH drained
// through repeated splitDAO calls (re-entrancy); hard fork 20 Jul 2016, the old chain became Ethereum Classic.
// Parity multisig library, 6 Nov 2017: user devops199 took ownership and called kill(), freezing 513,774 ETH in 587
// wallets ("I accidentally killed it."); still frozen (Parity postmortem, 2017).
// Music: "Silent Movie 125" by Sascha Ende (ende.app), CC BY 4.0.
import React from 'react';
import {AbsoluteFill, Audio, Loop, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Bubble, CREAM, DISPLAY, Film, Ghost, INK, Intertitle, LIME, MONO, Outro, RED, SANS, SERIF, TallFrame, cl, io, out, rnd, sp, useFonts} from './ScaryStories';
import type {Arms, Face} from './ScaryStories';

const FPS = 30;
type Seg = {k: 'card' | 'scene'; from: number; to: number; id: string};
const LEN = {title: 120, scene0: 114, chap: 90, scene: 210, fact: 120, end: 160, outro: 150};
const T: Seg[] = (() => {
  const order: [Seg['k'], string, number][] = [['card', 'title', LEN.title], ['scene', 'intro', LEN.scene0], ['card', 'c1', LEN.chap], ['scene', 'overflow', LEN.scene], ['card', 'c1b', LEN.fact],
    ['card', 'c2', LEN.chap], ['scene', 'dao', LEN.scene], ['card', 'c2b', LEN.fact], ['card', 'c3', LEN.chap], ['scene', 'parity', LEN.scene], ['card', 'c3b', LEN.fact], ['scene', 'end', LEN.end], ['card', 'outro', LEN.outro]];
  let a = 0;
  return order.map(([k, id, len]) => { const seg = {k, id, from: a, to: a + len}; a += len; return seg; });
})();
const at = (id: string) => T.find((x) => x.id === id)!.from;
export const SCARY5_DURATION = T[T.length - 1].to;
const STAMP = 140;

const CARDS: Record<string, {kicker?: string; lines: React.ReactNode}> = {
  title: {kicker: 'HOTCOIN PRESENTS · EPISODE V', lines: <>Bugs in<br />the Code</>},
  c1: {kicker: 'BUG REPORT I', lines: <>The block that<br />printed billions.</>},
  c1b: {lines: <>Aug 2010. 184 billion BTC<br />appeared in a single block.<br /><span style={{color: LIME}}>Patched within hours.</span></>},
  c2: {kicker: 'BUG REPORT II', lines: <>The fork<br />in the road.</>},
  c2b: {lines: <>June 2016. 3.6M ETH drained<br />from The DAO.<br /><span style={{color: LIME}}>Ethereum split in two.</span></>},
  c3: {kicker: 'BUG REPORT III', lines: <>One click.<br />Frozen forever.</>},
  c3b: {lines: <>Nov 2017. One user killed<br />a shared wallet library.<br /><span style={{color: LIME}}>513,774 ETH still frozen.</span></>},
};

// ---------------- set: the lab ----------------
const Coil: React.FC<{g: number; on: number}> = ({g, on}) => (
  <svg width={240} height={420} viewBox="0 0 240 420" style={{position: 'absolute', left: 0, top: 520, overflow: 'visible'}}>
    <rect x={80} y={340} width={80} height={60} rx={8} fill="#2B2238" /><rect x={70} y={392} width={100} height={18} rx={6} fill="#1E1828" />
    {Array.from({length: 16}, (_, i) => <rect key={i} x={98} y={120 + i * 14} width={44} height={9} rx={4} fill={i % 2 ? '#C77A3A' : '#E39A55'} />)}
    <rect x={112} y={110} width={16} height={240} fill="#5A4636" opacity={0.35} />
    <ellipse cx={120} cy={90} rx={58} ry={34} fill="#9AA3B8" /><ellipse cx={108} cy={80} rx={22} ry={10} fill="#E6EBF5" opacity={0.7} />
    {on > 0 && <circle cx={120} cy={90} r={90} fill="url(#coilGlow)" opacity={on} />}
    <defs><radialGradient id="coilGlow"><stop offset="0" stopColor="#C9B6FF" stopOpacity="0.7" /><stop offset="1" stopColor="#C9B6FF" stopOpacity="0" /></radialGradient></defs>
    {on > 0 && Array.from({length: 4}, (_, k) => {
      const s = Math.floor(g / 2) * 7 + k * 31, a0 = -Math.PI / 2 + (rnd(s) - 0.5) * 2.6;
      let x = 120 + Math.cos(a0) * 56, y = 90 + Math.sin(a0) * 32;
      const pts = [`${x},${y}`];
      for (let j = 1; j < 7; j++) { x += Math.cos(a0) * 16 + (rnd(s + j) - 0.5) * 26; y += Math.sin(a0) * 16 + (rnd(s + j + 50) - 0.5) * 26; pts.push(`${x},${y}`); }
      return <polyline key={k} points={pts.join(' ')} fill="none" stroke="#E9DEFF" strokeWidth={3} opacity={on * (0.6 + 0.4 * rnd(s + 9))} style={{filter: 'drop-shadow(0 0 6px #B69CFF)'}} />;
    })}
  </svg>
);

const Flask: React.FC<{x: number; y: number; s: number; c: string; g: number; ph: number; round?: boolean}> = ({x, y, s, c, g, ph, round}) => (
  <svg width={120 * s} height={160 * s} viewBox="0 0 120 160" style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    {round
      ? <><rect x={48} y={10} width={24} height={60} rx={4} fill="rgba(220,235,255,0.35)" stroke="#CFE0F5" strokeWidth={3} /><circle cx={60} cy={110} r={46} fill="rgba(220,235,255,0.3)" stroke="#CFE0F5" strokeWidth={3} />
        <path d="M18,118 a42,42 0 0 0 84,0 Z" fill={c} opacity={0.9} /></>
      : <><path d="M48,10 h24 v46 l38,88 q4,10 -8,10 h-84 q-12,0 -8,-10 l38,-88z" fill="rgba(220,235,255,0.3)" stroke="#CFE0F5" strokeWidth={3} />
        <path d="M30,104 h60 l18,40 q3,8 -6,8 h-84 q-9,0 -6,-8z" fill={c} opacity={0.9} /></>}
    {Array.from({length: 5}, (_, i) => { const p = ((g / 40 + i / 5 + ph) % 1); return <circle key={i} cx={52 + rnd(i + ph * 10) * 16} cy={140 - p * 120} r={3 + rnd(i) * 3} fill={c} opacity={1 - p} />; })}
  </svg>
);

const Spider: React.FC<{x: number; len: number; t: number; ph: number}> = ({x, len, t, ph}) => {
  const y = len + Math.sin(t * 1.7 + ph) * 8, sw = Math.sin(t * 1.3 + ph) * 3;
  return (
    <svg width={80} height={y + 40} style={{position: 'absolute', left: x - 40, top: 0, overflow: 'visible'}}>
      <line x1={40} y1={0} x2={40 + sw} y2={y} stroke="rgba(230,230,240,0.55)" strokeWidth={1.5} />
      <g transform={`translate(${40 + sw} ${y})`}>
        {[-1, 1].map((d) => [0, 1, 2, 3].map((i) => <path key={`${d}${i}`} d={`M0,4 q${d * 14},${-10 + i * 6} ${d * 24},${-2 + i * 8}`} stroke="#141018" strokeWidth={3} fill="none" strokeLinecap="round" />))}
        <ellipse cx={0} cy={8} rx={11} ry={13} fill="#1A1420" /><circle cx={0} cy={-6} r={8} fill="#1A1420" />
        <circle cx={-3} cy={-7} r={2.4} fill={LIME} /><circle cx={3} cy={-7} r={2.4} fill={LIME} />
      </g>
    </svg>
  );
};

const Web: React.FC<{flip?: boolean}> = ({flip}) => (
  <svg width={220} height={220} viewBox="0 0 220 220" style={{position: 'absolute', top: 0, [flip ? 'right' : 'left']: 0, transform: flip ? 'scaleX(-1)' : undefined}} opacity={0.5}>
    {[0, 22, 45, 68, 90].map((a) => <line key={a} x1={0} y1={0} x2={220 * Math.cos((a * Math.PI) / 180)} y2={220 * Math.sin((a * Math.PI) / 180)} stroke="#E6E6F0" strokeWidth={1.4} />)}
    {[40, 80, 125, 170].map((r) => <path key={r} d={[0, 22, 45, 68, 90].map((a, i) => `${i ? 'Q' + (r * 0.8 * Math.cos(((a - 11) * Math.PI) / 180)) + ',' + (r * 0.8 * Math.sin(((a - 11) * Math.PI) / 180)) + ' ' : 'M'}${r * Math.cos((a * Math.PI) / 180)},${r * Math.sin((a * Math.PI) / 180)}`).join(' ')} stroke="#E6E6F0" strokeWidth={1.2} fill="none" />)}
  </svg>
);

const Lever: React.FC<{p: number}> = ({p}) => (
  <svg width={150} height={210} viewBox="0 0 150 210" style={{position: 'absolute', left: 900, top: 560, overflow: 'visible'}}>
    <rect x={10} y={20} width={120} height={170} rx={10} fill="#3A3346" stroke="#262030" strokeWidth={6} />
    <rect x={30} y={40} width={80} height={14} rx={7} fill={p > 0.5 ? RED : '#57506A'} /><text x={70} y={80} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={700} fontSize={14} fill="#CFC6E6">DANGER</text>
    <rect x={62} y={110} width={16} height={60} rx={6} fill="#1E1828" />
    <g transform={`rotate(${-40 + p * 80} 70 140)`}><rect x={66} y={60} width={8} height={80} rx={4} fill="#B9B3C9" /><circle cx={70} cy={58} r={14} fill={RED} /></g>
  </svg>
);

const Lab: React.FC<{g: number; flash: number; coil: number; lever: number; drop: number; dark?: number}> = ({g, flash, coil, lever, drop, dark = 0}) => {
  const t = g / FPS;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #3B2E52 0%, #463863 55%, #33284A 100%)'}} />
      <AbsoluteFill style={{opacity: 0.22, backgroundImage: 'linear-gradient(#251C36 3px, transparent 3px), linear-gradient(90deg, #251C36 3px, transparent 3px)', backgroundSize: '120px 56px', backgroundPosition: '0 0, 60px 28px'}} />
      {/* arched window: moon, clouds, lightning */}
      <div style={{position: 'absolute', left: 70, top: 110, width: 270, height: 390, borderRadius: '135px 135px 10px 10px', overflow: 'hidden', border: '14px solid #2A2139',
        background: `linear-gradient(180deg, ${flash > 0.5 ? '#C9D4FF' : '#1C2350'}, ${flash > 0.5 ? '#8E9BE0' : '#2E3A78'})`}}>
        <div style={{position: 'absolute', left: 150, top: 70, width: 70, height: 70, borderRadius: 35, background: '#F4EFD8', boxShadow: '0 0 40px rgba(244,239,216,0.6)'}} />
        <div style={{position: 'absolute', left: 30 + Math.sin(t * 0.4) * 20, top: 120, width: 160, height: 40, borderRadius: 20, background: 'rgba(60,70,120,0.85)'}} />
        {flash > 0.5 && <svg width={270} height={390} style={{position: 'absolute', inset: 0}}><polyline points="90,0 70,90 104,96 62,210 120,110 86,104 118,0" fill="#FFFFFF" /></svg>}
        <div style={{position: 'absolute', left: 121, top: 0, bottom: 0, width: 14, background: '#2A2139'}} /><div style={{position: 'absolute', left: 0, right: 0, top: 200, height: 14, background: '#2A2139'}} />
      </div>
      {/* chalkboard */}
      <div style={{position: 'absolute', left: 420, top: 130, width: 590, height: 330, background: '#1F2A26', border: '14px solid #5E412F', borderRadius: 6, boxShadow: '0 20px 40px rgba(10,6,20,0.45)', fontFamily: SERIF, fontStyle: 'italic', color: 'rgba(240,240,230,0.75)', padding: '24px 30px', fontSize: 34, lineHeight: 1.25}}>
        <div>2<sup>64</sup> − 1 = 18,446,744,073,709,551,615</div>
        <div style={{marginTop: 10}}>if (sum &gt; MAX) &#123; panic(); &#125;</div>
        <div style={{marginTop: 10}}>splitDAO() → splitDAO() → …</div>
        <div style={{marginTop: 10, color: LIME}}>kill() ⚠</div>
        <svg width={120} height={110} style={{position: 'absolute', right: 26, bottom: 18}}><circle cx={55} cy={55} r={44} stroke="rgba(240,240,230,0.6)" strokeWidth={3} fill="none" /><path d="M30,55 h50 M55,30 v50" stroke="rgba(240,240,230,0.6)" strokeWidth={3} /></svg>
      </div>
      <Web /><Web flip />
      {/* shelf with jars */}
      <div style={{position: 'absolute', left: 360, top: 690, width: 480, height: 16, borderRadius: 4, background: '#5E412F', boxShadow: '0 8px 14px rgba(10,6,20,0.4)'}} />
      <Flask x={380} y={590} s={0.65} c="#B8F26A" g={g} ph={0.1} />
      <Flask x={470} y={575} s={0.75} c="#C77DFF" g={g} ph={0.5} round />
      <Flask x={710} y={590} s={0.65} c="#FF8A5B" g={g} ph={0.3} />
      <div style={{position: 'absolute', left: 600, top: 610, width: 70, height: 80, borderRadius: 12, background: 'rgba(184,242,106,0.35)', border: '3px solid #CFE0F5'}}><div style={{position: 'absolute', left: 6, right: 6, top: -12, height: 14, borderRadius: 4, background: '#8A6A4E'}} />
        <div style={{position: 'absolute', left: 6, right: 6, bottom: 6, fontFamily: MONO, fontWeight: 700, fontSize: 11, color: '#1B2A12', textAlign: 'center', background: '#F3EBD8', borderRadius: 3}}>BUGS</div></div>
      <Lever p={lever} />
      <Coil g={g} on={coil} />
      {/* floor */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, bottom: 0, background: 'repeating-linear-gradient(90deg,#2C2438 0 134px,#251E30 134px 270px)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, height: 70, background: 'linear-gradient(180deg, rgba(10,6,20,0.45), transparent)'}} />
      {/* spiders (the bugs) */}
      {[[250, 520, 0], [880, 470, 1.7], [620, 120, 3.1], [990, 200, 4.4]].map(([x, l, ph], i) => <Spider key={i} x={x} len={l + drop * (i % 2 ? 160 : 120)} t={t} ph={ph} />)}
      {/* lightning flash + blackout */}
      <AbsoluteFill style={{background: '#E9EEFF', opacity: flash * 0.35, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: '#05030A', opacity: dark}} />
    </AbsoluteFill>
  );
};

const Table: React.FC<{g: number}> = ({g}) => (
  <>
    <svg width={1080} height={400} viewBox="0 0 1080 400" style={{position: 'absolute', left: 0, top: 1000}}>
      <rect x={290} y={30} width={540} height={30} rx={8} fill="#7A5A44" /><rect x={290} y={56} width={540} height={10} fill="#5E412F" />
      <rect x={320} y={66} width={26} height={300} fill="#5E412F" /><rect x={774} y={66} width={26} height={300} fill="#5E412F" />
      <rect x={320} y={230} width={480} height={18} rx={4} fill="#6B4A36" />
      {/* lower shelf: a stack of old books and a crate of "bugs" */}
      <rect x={380} y={196} width={110} height={34} rx={4} fill="#4E6B8A" /><rect x={392} y={168} width={90} height={28} rx={4} fill="#8A3B4E" /><rect x={600} y={170} width={120} height={60} rx={6} fill="#8A6A4E" />
      <text x={660} y={206} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={700} fontSize={16} fill="#2B1E14">EXPERIMENTS</text>
      {/* test-tube rack */}
      <rect x={700} y={8} width={100} height={12} rx={4} fill="#8A6A4E" /><rect x={704} y={20} width={8} height={12} fill="#8A6A4E" /><rect x={788} y={20} width={8} height={12} fill="#8A6A4E" />
      {['#B8F26A', '#FF8A5B', '#C77DFF'].map((c, i) => <g key={c}><rect x={716 + i * 26} y={-50} width={16} height={68} rx={8} fill="rgba(220,235,255,0.35)" stroke="#CFE0F5" strokeWidth={2} /><rect x={718 + i * 26} y={-14} width={12} height={30} rx={6} fill={c} /></g>)}
    </svg>
    <Flask x={318} y={872} s={1} c="#B8F26A" g={g} ph={0.7} round />
  </>
);

// costumes (ghost space)
const Goggles: React.FC = () => (
  <g>
    <path d="M18,40 Q100,18 182,40" stroke="#3A2E22" strokeWidth={9} fill="none" />
    {[70, 130].map((x) => <g key={x}><circle cx={x} cy={34} r={22} fill="#8A6A3A" /><circle cx={x} cy={34} r={15} fill={LIME} opacity={0.85} /><ellipse cx={x - 5} cy={29} rx={5} ry={3.5} fill="#fff" opacity={0.7} /></g>)}
    <rect x={92} y={30} width={16} height={8} rx={3} fill="#8A6A3A" />
  </g>
);
const BowTie: React.FC = () => <g transform="translate(100 176)"><path d="M0,0 L-24,-13 L-24,13Z M0,0 L24,-13 L24,13Z" fill={RED} /><circle r={6} fill="#B5243A" /></g>;
const TestTube: React.FC<{a: number; g: number}> = ({a, g}) => (
  <g transform={`rotate(${a} 186 168)`}>
    <rect x={178} y={92} width={18} height={80} rx={9} fill="rgba(220,235,255,0.45)" stroke="#CFE0F5" strokeWidth={3} /><rect x={181} y={128} width={12} height={41} rx={6} fill={LIME} />
    {[0, 1, 2].map((i) => { const p = (g / 30 + i / 3) % 1; return <circle key={i} cx={187 + Math.sin(p * 9 + i) * 4} cy={86 - p * 40} r={4} fill={LIME} opacity={1 - p} />; })}
  </g>
);
const PithHelmet: React.FC = () => (
  <g><ellipse cx={100} cy={30} rx={82} ry={12} fill="#B79A62" /><path d="M42,30 Q44,-26 100,-28 Q156,-26 158,30Z" fill="#D4B77A" /><rect x={44} y={20} width={112} height={10} fill="#7A5C34" /><circle cx={100} cy={-28} r={6} fill="#B79A62" /></g>
);
const BugNet: React.FC<{a: number}> = ({a}) => (
  <g transform={`rotate(${a} 14 168)`}>
    <line x1={14} y1={168} x2={-14} y2={6} stroke="#7A5C34" strokeWidth={8} strokeLinecap="round" />
    <ellipse cx={-20} cy={-24} rx={34} ry={22} fill="rgba(255,255,255,0.18)" stroke="#E6E6F0" strokeWidth={4} transform="rotate(-10 -20 -24)" />
    <path d="M-53,-20 Q-26,40 13,-26" fill="rgba(255,255,255,0.14)" stroke="#E6E6F0" strokeWidth={2} strokeDasharray="4 4" />
  </g>
);
const CaramelApple: React.FC = () => (
  <g><rect x={184} y={110} width={6} height={64} rx={3} fill="#E8D7A8" /><circle cx={188} cy={96} r={24} fill="#D63A3A" /><path d="M164,94 a24,24 0 0 1 48,0 q-6,10 -12,2 q-6,10 -12,0 q-6,10 -12,0 q-6,8 -12,-2z" fill="#C8873A" /><path d="M188,72 q4,-10 12,-12" stroke="#5E412F" strokeWidth={4} fill="none" /></g>
);

// ---------------- bug report (bubble content) ----------------
type Line = {t: string; c?: string};
const BugReport: React.FC<{f: number; no: string; when: string; title: string; lines: Line[]; quote?: string; stamp: string; counter?: [number, string]}> = ({f, no, when, title, lines, quote, stamp, counter}) => {
  const st = sp(f - STAMP + 10, 8, 260);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 16, opacity: out(f / 10)}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 17, color: '#fff', background: '#3B2E52', borderRadius: 6, padding: '3px 10px', letterSpacing: 1}}>{no}</div>
        <div style={{fontFamily: MONO, fontSize: 17, color: '#5A6478', letterSpacing: 1}}>{when}</div>
      </div>
      <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 38, lineHeight: 1.05, marginTop: 10, opacity: out((f - 6) / 10)}}>{title}</div>
      <div style={{marginTop: 16, height: 236, borderRadius: 16, background: '#0E1410', border: '3px solid #2B3A2E', padding: '16px 22px', position: 'relative', overflow: 'hidden', fontFamily: MONO, fontSize: 23, lineHeight: 1.5, color: '#9EF07A',
        boxShadow: 'inset 0 0 40px rgba(126,194,90,0.18)', opacity: out((f - 12) / 10)}}>
        {lines.map((l, i) => {
          const s = f - 24 - i * 18, n = Math.max(0, Math.min(l.t.length, Math.floor(s * 2.4)));
          return s > 0 ? <div key={i} style={{whiteSpace: 'pre', color: l.c ?? '#9EF07A'}}>{l.t.slice(0, n)}{n < l.t.length && <span style={{background: '#9EF07A'}}>&nbsp;</span>}</div> : null;
        })}
        {counter && f > 24 + lines.length * 18 && <div style={{whiteSpace: 'pre', color: RED, fontWeight: 700}}>{'  drained     '}{Math.round(counter[0] * io((f - 24 - lines.length * 18) / 50)).toLocaleString('en-US')}{counter[1]}</div>}
        <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(180deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 5px)', pointerEvents: 'none'}} />
      </div>
      {quote && f > 110 && <div style={{position: 'absolute', left: 0, bottom: -2, fontFamily: SERIF, fontStyle: 'italic', fontSize: 30, color: INK, opacity: out((f - 110) / 12)}}>{quote}</div>}
      {f > STAMP - 10 && <div style={{position: 'absolute', right: 18, bottom: 6, border: `6px solid ${RED}`, color: RED, borderRadius: 10, padding: '4px 16px', fontFamily: DISPLAY, fontWeight: 900, fontSize: 38, transform: `rotate(-9deg) scale(${2 - st})`, opacity: Math.min(1, st * 1.5), background: 'rgba(255,253,246,0.9)'}}>{stamp}</div>}
    </div>
  );
};

const EndCard5: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: INK, textAlign: 'center'}}>
    <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 118, lineHeight: 1, transform: `scale(${0.8 + 0.2 * sp(f, 10, 160)})`}}>One story left…</div>
    <div style={{fontFamily: MONO, fontSize: 22, color: '#5A6478', marginTop: 24, letterSpacing: 2, opacity: out((f - 30) / 14)}}>THE FINAL EPISODE · HALLOWEEN NIGHT 🎃</div>
  </div>
);

// ---------------- the lab scene ----------------
const Scene: React.FC<{id: string; f: number; g: number}> = ({id, f, g}) => {
  const t = g / FPS;
  let L: {face: Face; arms: [Arms, Arms]; tremble?: number; dy?: number} = {face: 'peek', arms: ['hold', 'down']};
  let Mi: {face: Face; arms: [Arms, Arms]} = {face: 'calm', arms: ['down', 'hold']};
  let R: {face: Face; arms: [Arms, Arms]} = {face: 'chew', arms: ['side', 'hold']};
  let net = 0, tube = 0, lever = 0, drop = 0, dark = 0, bubble: React.ReactNode = null;
  const ambient = [0, 1, 2, 7, 8].includes(g % 260) ? 1 : 0;
  let flash = ambient, coil = 1;
  const jump = (t0: number) => -Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (f - t0) / 14)))) * 70;
  if (id === 'intro') {
    Mi = {face: f > 40 ? 'tell' : 'calm', arms: [f > 30 && f < 80 ? 'up' : 'down', 'hold']};
    tube = f > 30 && f < 80 ? -30 + Math.sin(f / 4) * 10 : 0;
    L = {face: f > 50 ? 'scared' : 'peek', arms: ['hold', 'down'], tremble: f > 50 ? 0.6 : 0};
    net = f > 50 ? Math.sin(f / 6) * 8 : 0;
  } else if (id === 'overflow' || id === 'dao' || id === 'parity') {
    const hit = f > STAMP;
    Mi = {face: hit ? 'shock' : 'tell', arms: [hit ? 'up' : 'down', 'hold']};
    tube = hit ? -20 : Math.sin(f / 9) * 8;
    L = {face: hit ? 'shock' : 'scared', arms: hit ? ['hold', 'up'] : ['hold', 'down'], tremble: hit ? 0 : 0.6, dy: hit ? jump(STAMP) : 0};
    R = {face: hit ? 'shock' : 'chew', arms: hit ? ['up', 'hold'] : ['side', 'hold']};
    net = hit ? interpolate(f, [STAMP, STAMP + 8, STAMP + 16, STAMP + 26], [0, -55, 30, 0], cl) : 0;
    drop = interpolate(f, [STAMP - 4, STAMP + 10, 200, 210], [0, 1, 1, 0.3], cl);
    if (f >= STAMP && f < STAMP + 6) flash = 1;
    if (id === 'parity') { coil = f > STAMP ? 0 : 1; dark = f >= STAMP && f < STAMP + 8 ? 0.85 : 0; }
    const cfg = id === 'overflow'
      ? {no: 'BUG #1', when: 'BITCOIN · AUG 15, 2010', title: 'The overflow bug', stamp: 'OVERFLOW', lines: [
        {t: '> inspect block 74638'}, {t: '  output 1    92,233,720,368.54 BTC'}, {t: '  output 2    92,233,720,368.54 BTC'}, {t: '  total      184,467,440,737 BTC', c: RED}, {t: '  supply cap      21,000,000 BTC', c: '#7FA36B'}]}
      : id === 'dao'
        ? {no: 'BUG #2', when: 'THE DAO · JUNE 17, 2016', title: 'The re-entrancy attack', stamp: 'HARD FORK', counter: [3641694, ' ETH'] as [number, string], lines: [
          {t: '> TheDAO.splitDAO()'}, {t: '> TheDAO.splitDAO()   again'}, {t: '> TheDAO.splitDAO()   again…'}, {t: '> TheDAO.splitDAO()   again…'}]}
        : {no: 'BUG #3', when: 'PARITY WALLET · NOV 6, 2017', title: 'The accidental kill', stamp: 'FROZEN', quote: '“I accidentally killed it.” (devops199)', lines: [
          {t: '> library.initWallet()  owner = devops199'}, {t: '> library.kill()'}, {t: '  wallets affected   587'}, {t: '  ETH locked         513,774', c: RED}]};
    bubble = <Bubble f={f - 6} h={440}><BugReport f={f - 10} {...cfg} /></Bubble>;
  } else if (id === 'end') {
    // the Teller pulls the lever: big strike, blackout, then the cliffhanger
    lever = interpolate(f, [10, 24], [0, 1], cl);
    Mi = {face: f > 80 ? 'happy' : f > 24 ? 'scream' : 'tell', arms: f > 80 ? ['side', 'hold'] : ['up', 'hold']};
    L = {face: f > 80 ? 'happy' : f > 24 ? 'scream' : 'scared', arms: f > 80 ? ['hold', 'side'] : ['hold', 'up'], dy: f > 24 && f < 80 ? jump(26) : 0};
    R = {face: f > 80 ? 'chew' : f > 24 ? 'scream' : 'chew', arms: f > 24 && f < 80 ? ['up', 'up'] : ['side', 'hold']};
    flash = f >= 24 && f < 34 ? 1 : ambient;
    dark = interpolate(f, [34, 40, 66, 76], [0, 0.92, 0.92, 0], cl);
    drop = interpolate(f, [24, 40, 120, 150], [0, 1.2, 1.2, 0.4], cl);
    bubble = f > 84 ? <Bubble f={f - 84} w={760} h={360}><EndCard5 f={f - 90} /></Bubble> : null;
  }
  return (
    <AbsoluteFill>
      <Lab g={g} flash={flash} coil={coil} lever={lever} drop={drop} />
      <Ghost id="m5" x={560} y={1000} s={1.25} t={t} face={Mi.face} arms={Mi.arms} light={0} warm={-1}>
        <TestTube a={tube} g={g} />
        <BowTie />
        <Goggles />
      </Ghost>
      <Ghost id="r5" x={905} y={1105} s={1.15} t={t} face={R.face} arms={R.arms} ph={2.6} warm={-1}>{R.arms[1] === 'hold' && <CaramelApple />}</Ghost>
      <Ghost id="l5" x={235} y={1090 + (L.dy ?? 0)} s={1.15} t={t} face={L.face} arms={L.arms} ph={1.3} tremble={L.tremble ?? 0} warm={1}>
        <BugNet a={net} />
        <PithHelmet />
      </Ghost>
      <Table g={g} />
      <AbsoluteFill style={{background: '#05030A', opacity: dark, pointerEvents: 'none'}} />
      {bubble}
    </AbsoluteFill>
  );
};

export const ScaryStories5: React.FC = () => {
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
          ? <Outro f={f} extra="LESSON OF THE NIGHT: EVEN CODE HAS GHOSTS" sources={<>Sources: Bitcoin Wiki (CVE-2010-5139) · Ethereum Foundation &amp; Gemini Cryptopedia (The DAO) · Parity postmortem (Nov 2017)<br />Music: Silent Movie 125 by Sascha Ende (ende.app), CC BY 4.0</>} />
          : card ? <Intertitle id={seg.id} f={f} len={len} cards={CARDS} /> : <Scene id={seg.id} f={f} g={g} />}
      </AbsoluteFill>
      <Film g={g} card={card} />
      <Audio src={staticFile('halloween/silent-movie-125.mp3')} volume={(fr) => 0.7 * interpolate(fr, [0, 10, SCARY5_DURATION - 50, SCARY5_DURATION], [0, 1, 1, 0], cl)} />
      <Loop durationInFrames={180}><Audio src={staticFile('halloween/projector.wav')} volume={0.16} /></Loop>
      {T.filter((x) => x.k === 'scene' && x.id !== 'intro').map((x) => <Sequence key={x.id} from={x.from + 4} durationInFrames={30} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.35} /></Sequence>)}
      {['overflow', 'dao', 'parity'].map((id) => <Sequence key={id} from={at(id) + STAMP} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.55} /></Sequence>)}
      <Sequence from={at('end') + 24} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

// teaser cover: bug reports still sealed
export const ScaryThumb5: React.FC = () => {
  useFonts();
  const g = 72, t = g / FPS;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Lab g={g} flash={0} coil={1} lever={0} drop={0.6} />
      <Ghost id="m5t" x={560} y={1000} s={1.25} t={t} face="tell" arms={['up', 'hold']} light={0} warm={-1}><TestTube a={-25} g={g} /><BowTie /><Goggles /></Ghost>
      <Ghost id="r5t" x={905} y={1105} s={1.15} t={t} face="shock" arms={['side', 'hold']} ph={2.6} warm={-1}><CaramelApple /></Ghost>
      <Ghost id="l5t" x={235} y={1070} s={1.15} t={t} face="scream" arms={['hold', 'up']} ph={1.3} warm={1}><BugNet a={12} /><PithHelmet /></Ghost>
      <Table g={g} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(16,10,30,0.95) 0%, rgba(16,10,30,0.85) 20%, rgba(16,10,30,0) 34%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 54, textAlign: 'center', color: CREAM}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 9, color: LIME}}>— CRYPTO SCARY STORIES · EP. V —</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 124, lineHeight: 0.95, marginTop: 14, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}><span style={{color: LIME}}>Bugs</span> in the Code</div>
      </div>
      <Bubble f={60} w={740} h={250} top={330}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: INK, textAlign: 'center'}}>
          <div style={{display: 'flex', gap: 14}}>
            {['1', '2', '3'].map((n) => (
              <div key={n} style={{width: 150, height: 92, borderRadius: 12, background: '#0E1410', color: '#9EF07A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: MONO}}>
                <div style={{fontWeight: 700, fontSize: 15, letterSpacing: 3}}>BUG #{n}</div>
                <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 38, letterSpacing: 2}}>???</div>
              </div>
            ))}
          </div>
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 54, marginTop: 18, lineHeight: 1}}>Billions, one bug at a time.</div>
        </div>
      </Bubble>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1240, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, background: LIME, color: INK, borderRadius: 999, padding: '16px 30px', fontFamily: DISPLAY, fontWeight: 900, fontSize: 30, boxShadow: '0 14px 30px rgba(10,12,30,0.45)'}}>
          <svg width={26} height={28} viewBox="0 0 26 28"><path d="M2,2 L24,14 L2,26Z" fill={INK} /></svg>WATCH IF YOU DARE
        </div>
      </div>
      <Film g={7} card={false} still />
    </AbsoluteFill>
  );
};
export const ScaryThumb5Tall: React.FC = () => <TallFrame episode="🎃 HALLOWEEN SPECIAL 🎃" title="Episode 5" small><ScaryThumb5 /></TallFrame>;
export const ScaryStories5Tall: React.FC = () => <TallFrame episode="EPISODE 5" title="Bugs in the Code"><ScaryStories5 /></TallFrame>;
