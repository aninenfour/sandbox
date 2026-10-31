// "Crypto Scary Stories", Episode 6 (series finale): "The Great Heists" (1080x1350, 30 fps, ~65 s). New set: a haunted bank
// vault on Halloween night (round vault door, safe-deposit walls, security lasers, jack-o'-lanterns). Costumes: the Teller is
// the heist narrator (bandit mask, flat cap, money sack), the left ghost is the night guard (cap, flashlight), the right
// ghost has a lollipop. Finale: the vault opens on Hotcoin's glow, party hats, confetti, "Happy Halloween from Hotcoin".
// Facts: Mt. Gox, Feb 2014: ~850,000 BTC lost, ~200,000 BTC later found in an old wallet, repayments began July 2024
// (trustee notices). Coincheck, Jan 26 2018: ~523M NEM (~$530M) stolen from a hot wallet without multisig; ~260,000 users
// refunded (~46bn yen). Poly Network, Aug 10 2021: ~$611M taken across chains, all returned by "Mr. White Hat" within
// about two weeks (The Block). Hotcoin security (hotcoin.com; June 2026 PoR release): substantial majority in cold storage,
// reserve coverage above 100% for major assets, 9 years and a zero-incident record.
// Music: "Silent Movie 135" by Sascha Ende (ende.app), CC BY 4.0. Coin logos: CoinGecko.
import React from 'react';
import {AbsoluteFill, Audio, Img, Loop, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Bubble, CREAM, DISPLAY, Film, Ghost, INK, Intertitle, LIME, MONO, Outro, Pumpkin, RED, SANS, SERIF, TallFrame, cl, io, out, rnd, sp, useFonts} from './ScaryStories';
import type {Arms, Face} from './ScaryStories';

const FPS = 30;
type Seg = {k: 'card' | 'scene'; from: number; to: number; id: string};
const LEN = {title: 120, scene0: 114, chap: 90, scene: 240, fact: 120, end: 240, outro: 160};
const T: Seg[] = (() => {
  const order: [Seg['k'], string, number][] = [['card', 'title', LEN.title], ['scene', 'intro', LEN.scene0], ['card', 'c1', LEN.chap], ['scene', 'gox', LEN.scene], ['card', 'c1b', LEN.fact],
    ['card', 'c2', LEN.chap], ['scene', 'coincheck', LEN.scene], ['card', 'c2b', LEN.fact], ['card', 'c3', LEN.chap], ['scene', 'poly', LEN.scene], ['card', 'c3b', LEN.fact], ['scene', 'end', LEN.end], ['card', 'outro', LEN.outro]];
  let a = 0;
  return order.map(([k, id, len]) => { const seg = {k, id, from: a, to: a + len}; a += len; return seg; });
})();
const at = (id: string) => T.find((x) => x.id === id)!.from;
export const SCARY6_DURATION = T[T.length - 1].to;
const STAMP = 165;
const GREEN = '#2F9E44';

const CARDS: Record<string, {kicker?: string; lines: React.ReactNode}> = {
  title: {kicker: 'HOTCOIN PRESENTS · THE FINALE', lines: <>The Great<br />Heists</>},
  c1: {kicker: 'HEIST I · MT. GOX', lines: <>The coins<br />that vanished.</>},
  c1b: {lines: <>Feb 2014. ~850,000 BTC gone.<br />200,000 found years later.<br /><span style={{color: LIME}}>Repayments began in 2024.</span></>},
  c2: {kicker: 'HEIST II · COINCHECK', lines: <>The wallet<br />left online.</>},
  c2b: {lines: <>Jan 2018. 523M NEM stolen<br />from a hot wallet.<br /><span style={{color: LIME}}>260,000 users refunded.</span></>},
  c3: {kicker: 'HEIST III · POLY NETWORK', lines: <>The thief<br />who gave it back.</>},
  c3b: {lines: <>Aug 2021. $611M taken.<br />All of it returned.<br /><span style={{color: LIME}}>Signed: “Mr. White Hat.”</span></>},
};

// ---------------- set: the vault ----------------
const VaultDoor: React.FC<{t: number; open: number}> = ({t, open}) => {
  const R = 230, cx = 540, cy = 500;
  return (
    <>
      {/* interior, revealed as the door swings */}
      <div style={{position: 'absolute', left: cx - R + 10, top: cy - R + 10, width: (R - 10) * 2, height: (R - 10) * 2, borderRadius: '50%', overflow: 'hidden', background: 'radial-gradient(circle at 50% 50%, #E9FFD0 0%, #B8F26A 35%, #3E6B1E 75%, #16240C 100%)', opacity: open > 0 ? 1 : 0}}>
        <Img src={staticFile('brand/symbol-official-white.png')} style={{position: 'absolute', left: R - 10 - 90, top: R - 10 - 90, width: 180, height: 180, filter: `drop-shadow(0 0 30px ${LIME})`, opacity: open, transform: `scale(${0.8 + 0.2 * open})`}} />
      </div>
      {open > 0.02 && <div style={{position: 'absolute', left: cx - R - 160, top: cy - R - 160, width: (R + 160) * 2, height: (R + 160) * 2, borderRadius: '50%', background: `radial-gradient(circle, rgba(184,242,106,${0.35 * open}), transparent 60%)`}} />}
      <svg width={R * 2 + 40} height={R * 2 + 40} viewBox={`${-R - 20} ${-R - 20} ${R * 2 + 40} ${R * 2 + 40}`} style={{position: 'absolute', left: cx - R - 20, top: cy - R - 20, transformOrigin: `${R * 2 + 20}px 50%`, transform: `perspective(1400px) rotateY(${-open * 78}deg)`}}>
        <circle r={R + 14} fill="#4A5A68" /><circle r={R} fill="#8C9AA7" /><circle r={R - 26} fill="#A9B5C0" /><circle r={R - 30} fill="none" stroke="#6F7E8C" strokeWidth={4} />
        {Array.from({length: 16}, (_, i) => { const a = (i / 16) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * (R - 13)} cy={Math.sin(a) * (R - 13)} r={7} fill="#5E6C79" />; })}
        <circle r={70} fill="#7C8A97" stroke="#5E6C79" strokeWidth={6} />
        <g transform={`rotate(${t * 12 + open * 540})`}>
          {[0, 120, 240].map((a) => <g key={a} transform={`rotate(${a})`}><rect x={-9} y={-150} width={18} height={150} rx={9} fill="#5E6C79" /><circle cy={-150} r={18} fill="#4A5A68" /></g>)}
          <circle r={34} fill="#4A5A68" />
        </g>
        <text y={R - 48} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={700} fontSize={20} fill="#4A5A68" letterSpacing={6}>VAULT</text>
      </svg>
    </>
  );
};
const DepositWall: React.FC<{x: number; t: number; flip?: boolean}> = ({x, t, flip}) => (
  <svg width={230} height={700} viewBox="0 0 230 700" style={{position: 'absolute', left: x, top: 150}}>
    <rect width={230} height={700} rx={10} fill="#22323F" />
    {Array.from({length: 18}, (_, i) => {
      const c = i % 3, r = Math.floor(i / 3), bx = 14 + c * 70, by = 14 + r * 114;
      const ajar = (i === (flip ? 7 : 10)) ? Math.max(0, Math.sin(t * 1.3)) : 0;
      return (
        <g key={i}>
          <rect x={bx} y={by} width={62} height={104} rx={6} fill={ajar > 0.05 ? '#B8F26A' : '#152029'} opacity={ajar > 0.05 ? 0.35 : 1} />
          <g transform={`translate(${bx} ${by}) scale(${1 - ajar * 0.7} 1)`}>
            <rect width={62} height={104} rx={6} fill="#3B5161" stroke="#2A3B48" strokeWidth={2} />
            <circle cx={31} cy={44} r={7} fill="#1B2730" /><rect x={28} y={46} width={6} height={14} rx={2} fill="#1B2730" />
            <rect x={14} y={80} width={34} height={8} rx={3} fill="#C9A453" opacity={0.8} />
          </g>
        </g>
      );
    })}
  </svg>
);
const Lasers: React.FC<{g: number; on: number}> = ({g, on}) => (
  <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}} opacity={on}>
    {[[0, 900, 1080, 1010], [0, 1060, 1080, 930], [0, 980, 1080, 1120]].map(([a, b, c, d], i) => (
      <line key={i} x1={a} y1={b + Math.sin(g / 20 + i) * 20} x2={c} y2={d - Math.sin(g / 20 + i) * 20} stroke="#FF2A3A" strokeWidth={3} opacity={0.55 + 0.35 * Math.abs(Math.sin(g / 3 + i))} style={{filter: 'drop-shadow(0 0 6px #FF2A3A)'}} />
    ))}
  </svg>
);
const Bunting: React.FC<{t: number}> = ({t}) => (
  <svg width={1080} height={120} style={{position: 'absolute', left: 0, top: 0}}>
    <path d={`M0,20 Q540,${80 + Math.sin(t) * 4} 1080,20`} stroke="#0E161D" strokeWidth={3} fill="none" />
    {Array.from({length: 14}, (_, i) => {
      const x = 40 + i * 74, y = 20 + 4 * (60 - Math.pow((x - 540) / 540 * 7.7, 2)) * 0.25 + 6;
      return <path key={i} d={`M${x - 22},${y} L${x + 22},${y} L${x},${y + 40}Z`} fill={['#F28C38', '#5B3E8E', LIME][i % 3]} transform={`rotate(${Math.sin(t * 2 + i) * 4} ${x} ${y})`} />;
    })}
  </svg>
);
const Vault: React.FC<{g: number; open: number; lasers: number; dim?: number}> = ({g, open, lasers, dim = 0}) => {
  const t = g / FPS;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #1A2733 0%, #233645 60%, #1A2733 100%)'}} />
      <AbsoluteFill style={{opacity: 0.18, backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.06) 2px, transparent 2px)', backgroundSize: '90px 100%'}} />
      <Bunting t={t} />
      <DepositWall x={20} t={t} /><DepositWall x={830} t={t} flip />
      <VaultDoor t={t} open={open} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, bottom: 0, background: '#141E27', backgroundImage: 'linear-gradient(45deg, #1B2833 25%, transparent 25%, transparent 75%, #1B2833 75%), linear-gradient(45deg, #1B2833 25%, transparent 25%, transparent 75%, #1B2833 75%)', backgroundSize: '120px 120px', backgroundPosition: '0 0, 60px 60px'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, height: 80, background: 'linear-gradient(180deg, rgba(8,12,16,0.55), transparent)'}} />
      <Lasers g={g} on={lasers} />
      <Pumpkin x={95} y={1250} s={0.62} t={t} /><Pumpkin x={990} y={1262} s={0.55} t={t + 1} />
      <AbsoluteFill style={{background: '#05080B', opacity: dim}} />
    </AbsoluteFill>
  );
};

// costumes (ghost space; eyes at (74,100) and (126,100))
const BanditMask: React.FC = () => (
  <g>
    <path fillRule="evenodd" d="M14,84 Q100,70 186,84 L186,116 Q100,128 14,116Z M52,100 a22,17 0 1,0 44,0 a22,17 0 1,0 -44,0 M104,100 a22,17 0 1,0 44,0 a22,17 0 1,0 -44,0" fill="#15171C" />
    <path d="M186,92 q22,-6 30,8 M186,104 q20,6 26,22" stroke="#15171C" strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);
const FlatCap: React.FC = () => (
  <g><path d="M40,34 Q46,-6 104,-8 Q160,-6 166,30 Q130,24 40,34Z" fill="#4B4F5A" /><path d="M36,34 Q100,22 176,36 Q170,46 110,42 Q60,42 36,34Z" fill="#3A3E47" /><circle cx={104} cy={-6} r={6} fill="#3A3E47" /></g>
);
const MoneySack: React.FC<{a: number}> = ({a}) => (
  <g transform={`rotate(${a} 186 170)`}>
    <path d="M168,150 q-24,10 -22,44 q4,30 40,30 q36,0 40,-30 q2,-34 -22,-44Z" fill="#C9A86A" stroke="#8A6E3E" strokeWidth={3} />
    <path d="M172,150 q14,-10 28,0" stroke="#8A6E3E" strokeWidth={6} fill="none" />
    <text x={186} y={204} textAnchor="middle" fontFamily="Unbounded" fontWeight={900} fontSize={30} fill="#6B5226">$</text>
  </g>
);
const GuardCap: React.FC = () => (
  <g><path d="M44,34 Q48,-10 100,-12 Q152,-10 156,34Z" fill="#26375A" /><rect x={36} y={28} width={128} height={14} rx={6} fill="#1A2640" /><path d="M60,40 Q100,62 150,40" fill="#16203A" />
    <path d="M100,2 l9,6 v10 q0,8 -9,12 q-9,-4 -9,-12 v-10Z" fill="#E8C565" /></g>
);
const Flashlight: React.FC<{a: number; on: number}> = ({a, on}) => (
  <g transform={`rotate(${a} 14 170)`}>
    {on > 0 && <polygon points="0,150 -260,40 -260,260" fill="rgba(255,244,190,0.22)" opacity={on} />}
    <rect x={-6} y={158} width={40} height={22} rx={6} fill="#2A2F38" /><rect x={-14} y={154} width={12} height={30} rx={4} fill="#4A5160" /><circle cx={-14} cy={169} r={9} fill="#FFF4BE" opacity={on} />
  </g>
);
const Lollipop: React.FC<{t: number}> = ({t}) => (
  <g><rect x={184} y={110} width={6} height={66} rx={3} fill="#F3EBD8" />
    <g transform={`rotate(${t * 60} 187 92)`}><circle cx={187} cy={92} r={26} fill="#F28CB1" /><path d="M187,92 m-20,0 a20,20 0 1,1 40,0 a14,14 0 1,1 -28,0 a8,8 0 1,1 16,0" stroke="#fff" strokeWidth={5} fill="none" /></g></g>
);
const PartyHat: React.FC<{c: string; rot?: number}> = ({c, rot = 0}) => (
  <g transform={`rotate(${rot} 100 20)`}><path d="M64,26 L100,-62 L136,26Z" fill={c} /><path d="M78,-8 L122,-8 M71,10 L129,10" stroke="#fff" strokeWidth={6} opacity={0.6} /><circle cx={100} cy={-64} r={10} fill="#fff" /></g>
);
const Confetti: React.FC<{f: number}> = ({f}) => (
  <>
    {Array.from({length: 90}, (_, i) => {
      const x = rnd(i) * 1080 + Math.sin(f / 10 + i) * 30, y = -40 + ((f * (4 + rnd(i + 3) * 5)) + rnd(i + 7) * 400) % 1450 - 400;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: 14, height: 8, background: [LIME, '#F28C38', '#5B3E8E', '#fff', '#F28CB1'][i % 5], transform: `rotate(${f * 9 + i * 40}deg)`, opacity: y > -20 ? 1 : 0}} />;
    })}
  </>
);

// ---------------- heist cards (bubble content, animated) ----------------
const Coin: React.FC<{src: string; x: number; y: number; s?: number; o?: number; glow?: string}> = ({src, x, y, s = 40, o = 1, glow}) => (
  <Img src={staticFile(src)} style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, opacity: o, filter: glow ? `drop-shadow(0 0 8px ${glow})` : undefined}} />
);
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const Stamp: React.FC<{f: number; text: string; color: string}> = ({f, text, color}) => {
  const st = sp(f - STAMP + 10, 8, 260);
  return f > STAMP - 10 ? <div style={{position: 'absolute', right: 14, bottom: 4, border: `6px solid ${color}`, color, borderRadius: 10, padding: '4px 16px', fontFamily: DISPLAY, fontWeight: 900, fontSize: 36, transform: `rotate(-8deg) scale(${2 - st})`, opacity: Math.min(1, st * 1.5), background: 'rgba(255,253,246,0.92)'}}>{text}</div> : null;
};
const Header: React.FC<{f: number; no: string; when: string; title: string}> = ({f, no, when, title}) => (
  <>
    <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: out(f / 10)}}>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, color: '#fff', background: INK, borderRadius: 6, padding: '3px 10px', letterSpacing: 1}}>{no}</div>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, color: '#5A6478', letterSpacing: 1}}>{when}</div>
    </div>
    <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, lineHeight: 1.05, marginTop: 8, opacity: out((f - 6) / 10)}}>{title}</div>
  </>
);
const VaultIcon: React.FC<{x: number; y: number; s?: number; spin?: number}> = ({x, y, s = 1, spin = 0}) => (
  <svg width={140 * s} height={140 * s} viewBox="-70 -70 140 140" style={{position: 'absolute', left: x - 70 * s, top: y - 70 * s}}>
    <rect x={-66} y={-66} width={132} height={132} rx={18} fill="#4A5A68" /><circle r={48} fill="#A9B5C0" /><circle r={48} fill="none" stroke="#6F7E8C" strokeWidth={4} />
    <g transform={`rotate(${spin})`}>{[0, 120, 240].map((a) => <rect key={a} x={-4} y={-38} width={8} height={38} rx={4} fill="#5E6C79" transform={`rotate(${a})`} />)}<circle r={12} fill="#4A5A68" /></g>
  </svg>
);

const GoxCard: React.FC<{f: number}> = ({f}) => {
  const lost = interpolate(f, [24, 100], [0, 850000], cl), found = interpolate(f, [108, 140], [0, 200000], cl);
  const tl = io((f - 128) / 30);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK}}>
      <Header f={f} no="HEIST I" when="MT. GOX · FEB 2014" title="Where did the coins go?" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 100, height: 200}}>
        <VaultIcon x={90} y={100} spin={f * 3} />
        {Array.from({length: 26}, (_, i) => {
          const s0 = 24 + i * 3, p = (f - s0) / 26;
          if (p <= 0 || p > 1) return null;
          return <Coin key={i} src="halloween/ep6/BTC.png" x={110 + p * 520 + rnd(i) * 40} y={100 - Math.sin(p * Math.PI) * (40 + rnd(i + 3) * 70) + (rnd(i + 5) - 0.5) * 60} o={1 - p * 0.9} s={38} />;
        })}
        {Array.from({length: 6}, (_, i) => {
          const s0 = 108 + i * 5, p = (f - s0) / 22;
          if (p <= 0 || p > 1) return null;
          return <Coin key={i} src="halloween/ep6/BTC.png" x={640 - p * 530} y={100 - Math.sin(p * Math.PI) * 60 + (rnd(i) - 0.5) * 40} glow={GREEN} s={42} />;
        })}
      </div>
      <div style={{position: 'absolute', left: 0, top: 300, display: 'flex', gap: 34, alignItems: 'baseline', whiteSpace: 'nowrap'}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 46, color: RED, opacity: out((f - 20) / 8)}}>−{fmt(lost)} BTC</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 34, color: GREEN, opacity: out((f - 106) / 8)}}>+{fmt(found)} found</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 300, top: 372, opacity: out((f - 124) / 10)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontWeight: 700, fontSize: 18, color: '#5A6478'}}><span>2014 · COLLAPSE</span><span>2024 · REPAYMENTS BEGIN</span></div>
        <div style={{height: 14, borderRadius: 7, background: '#E7E9EE', marginTop: 8, overflow: 'hidden'}}><div style={{height: '100%', width: `${tl * 100}%`, background: INK, borderRadius: 7}} /></div>
      </div>
      <Stamp f={f} text="10 YEARS" color={RED} />
    </div>
  );
};

const CoincheckCard: React.FC<{f: number}> = ({f}) => {
  const n = interpolate(f, [30, 110], [0, 523000000], cl);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK}}>
      <Header f={f} no="HEIST II" when="COINCHECK · JAN 26, 2018" title="The hot wallet" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 118, height: 230}}>
        {/* hot wallet */}
        <div style={{position: 'absolute', left: 0, top: 70, width: 220, height: 130, borderRadius: 18, background: '#FFE7D6', border: '3px solid #F28C38', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: out((f - 8) / 10)}}>
          <svg width={50} height={56} viewBox="0 0 24 28" style={{transform: `scaleY(${1 + Math.sin(f / 3) * 0.08})`}}><path d="M12 1c2 5 8 8 8 15a8 8 0 0 1-16 0c0-4 2-6 3-8 0 3 2 4 3 4 0-4 0-8 2-11z" fill="#F28C38" /></svg>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 16, color: '#B4561A', whiteSpace: 'nowrap'}}>HOT WALLET · ONLINE</div>
        </div>
        {/* cold wallet, unused */}
        <div style={{position: 'absolute', left: 240, top: 70, width: 220, height: 130, borderRadius: 18, background: '#E8F1FB', border: '3px dashed #7FA7D6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: out((f - 14) / 10) * 0.75}}>
          <svg width={46} height={46} viewBox="0 0 24 24"><path d="M12 2v20M4 6l16 12M20 6L4 18" stroke="#5C86B8" strokeWidth={2.4} strokeLinecap="round" /></svg>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 16, color: '#4A6F99', whiteSpace: 'nowrap'}}>COLD WALLET · UNUSED</div>
        </div>
        {Array.from({length: 24}, (_, i) => {
          const s0 = 30 + i * 3.3, p = (f - s0) / 24;
          if (p <= 0 || p > 1) return null;
          return <Coin key={i} src="halloween/ep6/XEM.png" x={110 + p * 640} y={110 - Math.sin(p * Math.PI) * 110 - p * 30 + (rnd(i) - 0.5) * 30} s={36} o={1 - p * 0.6} />;
        })}
        <div style={{position: 'absolute', right: 10, top: 0, width: 110, height: 110, borderRadius: '50%', background: '#1A1F2B', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: out((f - 24) / 8)}}>
          <svg width={70} height={70} viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8v4l2 2v4h3v-3h2v3h2v-3h2v3h3v-4l2-2v-4a8 8 0 0 0-8-8z" fill="#E8E2D0" /><circle cx={9} cy={11} r={2} fill="#1A1F2B" /><circle cx={15} cy={11} r={2} fill="#1A1F2B" /></svg>
        </div>
      </div>
      <div style={{position: 'absolute', left: 476, top: 252, fontFamily: DISPLAY, fontWeight: 900, fontSize: 27, color: RED, whiteSpace: 'nowrap', opacity: out((f - 28) / 8)}}>{fmt(n)} NEM</div>
      <div style={{position: 'absolute', left: 476, top: 294, fontFamily: MONO, fontWeight: 700, fontSize: 20, color: '#5A6478', opacity: out((f - 100) / 8)}}>≈ $530M · NO MULTISIG</div>
      <div style={{position: 'absolute', left: 0, top: 372, display: 'flex', alignItems: 'center', gap: 10, background: '#E6F6E9', border: `2px solid ${GREEN}`, borderRadius: 999, padding: '8px 18px', fontWeight: 700, fontSize: 24, color: GREEN, opacity: out((f - 128) / 10), transform: `translateX(${(1 - out((f - 128) / 10)) * -30}px)`}}>260,000 users refunded</div>
      <Stamp f={f} text="HOT WALLET" color={RED} />
    </div>
  );
};

const PolyCard: React.FC<{f: number}> = ({f}) => {
  const taken = interpolate(f, [26, 86], [0, 611], cl), back = interpolate(f, [100, 150], [0, 611], cl), ret = f > 98;
  const chains = [['ETH', 120], ['BSC', 260], ['POLYGON', 400]] as [string, number][];
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK}}>
      <Header f={f} no="HEIST III" when="POLY NETWORK · AUG 10, 2021" title="The bridge job" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 118, height: 240}}>
        <svg width={520} height={220} style={{position: 'absolute', left: 0, top: 0}}>
          <path d="M40,170 Q260,10 480,170" stroke="#9AA6B8" strokeWidth={10} fill="none" />
          {[100, 180, 260, 340, 420].map((x) => <line key={x} x1={x} y1={170} x2={x} y2={170 - (1 - Math.pow((x - 260) / 220, 2)) * 90} stroke="#9AA6B8" strokeWidth={4} />)}
          <rect x={20} y={168} width={480} height={14} rx={6} fill="#6F7E8C" />
        </svg>
        {chains.map(([c, x], i) => (
          <div key={c} style={{position: 'absolute', left: x - 50, top: 190, width: 100, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 17, color: '#fff', background: '#2B3646', borderRadius: 999, padding: '6px 0', opacity: out((f - 6 - i * 4) / 8)}}>{c}</div>
        ))}
        {Array.from({length: 18}, (_, i) => {
          const s0 = ret ? 100 + i * 2.6 : 26 + i * 3.2, p = (f - s0) / 22;
          if (p <= 0 || p > 1) return null;
          const x0 = 260, x1 = 760, x = ret ? x1 - p * (x1 - x0) : x0 + p * (x1 - x0);
          return <div key={i} style={{position: 'absolute', left: x - 20, top: 90 - Math.sin(p * Math.PI) * 60 + (rnd(i) - 0.5) * 40, width: 40, height: 40, borderRadius: 20, background: ret ? GREEN : RED, color: '#fff', fontFamily: DISPLAY, fontWeight: 900, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>$</div>;
        })}
        {/* Mr. White Hat */}
        <svg width={140} height={170} viewBox="0 0 140 170" style={{position: 'absolute', right: 10, top: 10, opacity: out((f - 20) / 8), transform: `rotate(${ret ? Math.sin(f / 4) * 6 : 0}deg)`}}>
          <path d="M20,170 L20,90 Q20,40 70,40 Q120,40 120,90 L120,170Z" fill="#DCE3F7" />
          <rect x={30} y={30} width={80} height={14} rx={4} fill="#fff" stroke="#9AA6B8" strokeWidth={2} /><rect x={46} y={-8} width={48} height={42} rx={6} fill="#fff" stroke="#9AA6B8" strokeWidth={2} />
          <circle cx={55} cy={88} r={7} fill={INK} /><circle cx={85} cy={88} r={7} fill={INK} />
          <path d={ret ? 'M52,112 q18,16 36,0' : 'M56,116 h28'} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
        </svg>
        <div style={{position: 'absolute', right: 0, top: 186, width: 160, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 16, color: '#5A6478', opacity: out((f - 24) / 8)}}>“MR. WHITE HAT”</div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 372, display: 'flex', gap: 24, alignItems: 'baseline', whiteSpace: 'nowrap'}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 36, color: RED, opacity: out((f - 24) / 8), textDecoration: back > 600 ? 'line-through' : undefined}}>−${fmt(taken)}M</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 36, color: GREEN, opacity: out((f - 98) / 8)}}>+${fmt(back)}M back</div>
      </div>
      <Stamp f={f} text="RETURNED" color={GREEN} />
    </div>
  );
};

const FinaleCard: React.FC<{f: number}> = ({f}) => {
  const chips = ['Cold storage first', 'Proof of Reserves · >100%', '9 years · zero incidents'];
  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', color: INK, textAlign: 'center', paddingTop: 6}}>
      <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 112, lineHeight: 0.95, transform: `scale(${0.8 + 0.2 * sp(f, 10, 160)})`}}>Happy Halloween!</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, opacity: out((f - 14) / 10)}}>
        <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: '#5A6478'}}>FROM</span>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 230, height: (230 * 328) / 2003}} />
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 28, width: 780}}>
        {chips.map((c, i) => (
          <div key={c} style={{display: 'flex', alignItems: 'center', gap: 10, background: '#F4FBE9', border: `2px solid ${INK}`, borderRadius: 999, padding: '10px 20px', fontWeight: 700, fontSize: 26, opacity: out((f - 34 - i * 10) / 10), transform: `translateY(${(1 - out((f - 34 - i * 10) / 10)) * 20}px)`}}>
            <svg width={22} height={22} viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" stroke={GREEN} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>{c}
          </div>
        ))}
      </div>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: '#5A6478', marginTop: 24, opacity: out((f - 70) / 10)}}>NO TRICKS. JUST A SAFER VAULT.</div>
    </div>
  );
};

// ---------------- the vault scene ----------------
const Scene: React.FC<{id: string; f: number; g: number}> = ({id, f, g}) => {
  const t = g / FPS;
  let L: {face: Face; arms: [Arms, Arms]; tremble?: number; dy?: number} = {face: 'calm', arms: ['hold', 'down']};
  let Mi: {face: Face; arms: [Arms, Arms]} = {face: 'calm', arms: ['down', 'hold']};
  let R: {face: Face; arms: [Arms, Arms]} = {face: 'chew', arms: ['side', 'hold']};
  let beam = -20 + Math.sin(t * 1.4) * 25, light = 1, sack = 0, open = 0, lasers = 1, party = 0, dim = 0, bubble: React.ReactNode = null;
  const jump = (t0: number) => -Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (f - t0) / 14)))) * 70;
  if (id === 'intro') {
    Mi = {face: f > 36 ? 'tell' : 'calm', arms: [f > 30 && f < 84 ? 'up' : 'down', 'hold']};
    sack = f > 30 && f < 84 ? Math.sin(f / 5) * 14 : 0;
    L = {face: f > 50 ? 'scared' : 'peek', arms: ['hold', 'down'], tremble: f > 50 ? 0.6 : 0};
    beam = f > 50 ? -30 + Math.sin(f / 3) * 40 : beam;
  } else if (id === 'gox' || id === 'coincheck' || id === 'poly') {
    const hit = f > STAMP, twist = id === 'poly' && f > 100;
    Mi = {face: hit ? (twist ? 'happy' : 'shock') : 'tell', arms: [hit ? 'up' : 'down', 'hold']};
    sack = hit ? -25 : Math.sin(f / 8) * 8;
    L = {face: twist ? 'happy' : hit ? 'shock' : 'scared', arms: hit ? ['hold', 'up'] : ['hold', 'down'], tremble: hit || twist ? 0 : 0.5, dy: hit ? jump(STAMP) : 0};
    R = {face: twist ? 'happy' : hit ? 'shock' : 'chew', arms: hit ? ['up', 'hold'] : ['side', 'hold']};
    beam = hit ? -60 + Math.sin(f / 2) * 50 : beam;
    light = id === 'coincheck' && f > STAMP && f < STAMP + 6 ? 0 : 1;
    const card = id === 'gox' ? <GoxCard f={f - 10} /> : id === 'coincheck' ? <CoincheckCard f={f - 10} /> : <PolyCard f={f - 10} />;
    bubble = <Bubble f={f - 6} w={900} h={500} top={56}>{card}</Bubble>;
  } else if (id === 'end') {
    // lasers off, the vault swings open on Hotcoin's glow, party hats, confetti, Happy Halloween
    lasers = interpolate(f, [0, 12], [1, 0], cl);
    open = io((f - 16) / 40);
    party = f > 56 ? 1 : 0;
    Mi = {face: f > 50 ? 'happy' : 'shock', arms: f > 50 ? ['up', 'up'] : ['down', 'hold']};
    L = {face: f > 50 ? 'happy' : 'shock', arms: f > 50 ? ['up', 'side'] : ['hold', 'down'], dy: f > 56 && f < 74 ? jump(56) : 0};
    R = {face: f > 50 ? 'happy' : 'shock', arms: f > 50 ? ['up', 'hold'] : ['side', 'hold'], };
    beam = f > 50 ? -90 + Math.sin(f / 6) * 30 : beam;
    bubble = f > 96 ? <Bubble f={f - 96} w={900} h={460} top={70}><FinaleCard f={f - 102} /></Bubble> : null;
  }
  return (
    <AbsoluteFill>
      <Vault g={g} open={open} lasers={lasers} dim={(1 - light) * 0.85 + dim} />
      <Ghost id="m6" x={540} y={1030} s={1.25} t={t} face={Mi.face} arms={Mi.arms} light={0} warm={-1}>
        {!party && <MoneySack a={sack} />}
        <BanditMask />
        {party ? <PartyHat c={LIME} rot={-6} /> : <FlatCap />}
      </Ghost>
      <Ghost id="r6" x={870} y={1150 + (id === 'end' && f > 60 ? jump(64) * 0.6 : 0)} s={1.1} t={t} face={R.face} arms={R.arms} ph={2.6} warm={-1}>
        {R.arms[1] === 'hold' && <Lollipop t={t} />}
        {party ? <PartyHat c="#F28CB1" rot={8} /> : null}
      </Ghost>
      <Ghost id="l6" x={215} y={1150 + (L.dy ?? 0)} s={1.1} t={t} face={L.face} arms={L.arms} ph={1.3} tremble={L.tremble ?? 0} warm={1}>
        <Flashlight a={beam} on={light} />
        {party ? <PartyHat c="#F28C38" rot={-10} /> : <GuardCap />}
      </Ghost>
      {party > 0 && <Confetti f={f - 56} />}
      {bubble}
    </AbsoluteFill>
  );
};

export const ScaryStories6: React.FC = () => {
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
          ? <Outro f={f} extra="SERIES FINALE · NEW HERE? hotcoin.com/r/MetaBonus" sources={<>Sources: Mt. Gox trustee notices (2014–2024) · Coincheck / Reuters (2018) · The Block (Aug 2021) · Hotcoin Proof of Reserves (June 2026) · hotcoin.com<br />Music: Silent Movie 135 by Sascha Ende (ende.app), CC BY 4.0 · Coin logos: CoinGecko</>} />
          : card ? <Intertitle id={seg.id} f={f} len={len} cards={CARDS} /> : <Scene id={seg.id} f={f} g={g} />}
      </AbsoluteFill>
      <Film g={g} card={card} />
      <Audio src={staticFile('halloween/silent-movie-135.mp3')} volume={(fr) => 0.7 * interpolate(fr, [0, 10, SCARY6_DURATION - 50, SCARY6_DURATION], [0, 1, 1, 0], cl)} />
      <Loop durationInFrames={180}><Audio src={staticFile('halloween/projector.wav')} volume={0.16} /></Loop>
      {T.filter((x) => x.k === 'scene' && x.id !== 'intro').map((x) => <Sequence key={x.id} from={x.from + 4} durationInFrames={30} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.35} /></Sequence>)}
      {['gox', 'coincheck', 'poly'].map((id) => <Sequence key={id} from={at(id) + STAMP} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.55} /></Sequence>)}
      <Sequence from={at('end') + 16} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.5} /></Sequence>
      <Sequence from={at('end') + 56} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.45} /></Sequence>
    </AbsoluteFill>
  );
};

// teaser cover: heist files sealed
export const ScaryThumb6: React.FC = () => {
  useFonts();
  const g = 80, t = g / FPS;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Vault g={g} open={0} lasers={1} />
      <Ghost id="m6t" x={540} y={1030} s={1.25} t={t} face="tell" arms={['up', 'hold']} light={0} warm={-1}><MoneySack a={-20} /><BanditMask /><FlatCap /></Ghost>
      <Ghost id="r6t" x={870} y={1150} s={1.1} t={t} face="shock" arms={['side', 'hold']} ph={2.6} warm={-1}><Lollipop t={t} /></Ghost>
      <Ghost id="l6t" x={215} y={1150} s={1.1} t={t} face="scream" arms={['hold', 'up']} ph={1.3} warm={1}><Flashlight a={-40} on={1} /><GuardCap /></Ghost>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,16,22,0.95) 0%, rgba(10,16,22,0.85) 20%, rgba(10,16,22,0) 34%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 54, textAlign: 'center', color: CREAM}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 9, color: LIME}}>— CRYPTO SCARY STORIES · FINALE —</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 124, lineHeight: 0.95, marginTop: 14, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>The Great <span style={{color: LIME}}>Heists</span></div>
      </div>
      <Bubble f={60} w={760} h={250} top={330}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: INK, textAlign: 'center'}}>
          <div style={{display: 'flex', gap: 14}}>
            {['I', 'II', 'III'].map((n, i) => (
              <div key={n} style={{position: 'relative', width: 150, height: 92, borderRadius: 12, background: '#2B3646', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: MONO}}>
                <div style={{fontWeight: 700, fontSize: 15, letterSpacing: 3, color: LIME}}>HEIST {n}</div>
                <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 38, letterSpacing: 2}}>???</div>
                <div style={{position: 'absolute', bottom: -10, border: `3px solid ${RED}`, color: RED, borderRadius: 6, padding: '0 6px', fontWeight: 700, fontSize: 13, letterSpacing: 2, transform: `rotate(${-10 + i * 8}deg)`, background: 'rgba(255,253,246,0.95)'}}>CLASSIFIED</div>
              </div>
            ))}
          </div>
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 54, marginTop: 22, lineHeight: 1}}>Billions out the door.</div>
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
export const ScaryThumb6Tall: React.FC = () => <TallFrame episode="🎃 HALLOWEEN FINALE 🎃" title="Episode 6" small><ScaryThumb6 /></TallFrame>;
export const ScaryStories6Tall: React.FC = () => <TallFrame episode="EPISODE 6 · FINALE" title="The Great Heists"><ScaryStories6 /></TallFrame>;
