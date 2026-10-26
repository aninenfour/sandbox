// "Crypto Scary Stories", Episode 4: "The Fallen Kings" (1080x1350, 30 fps, ~60 s). New set: a detective's office at
// night (rain on the window, a Hotcoin neon outside, venetian-blind light, an evidence corkboard with red string, a desk
// lamp). Costumes: the Teller is a detective (fedora, magnifying glass), Scaredy wears his scarf and hides behind the
// desk, Snacky has coffee and a donut. Each chapter opens a case file with a real, freely licensed photo.
// Facts: FTX collapsed Nov 2022; ~$8B of customer funds missing; SBF convicted Nov 2023, sentenced to 25 years (28 Mar
// 2024, US DOJ SDNY). Terra/LUNA collapse May 2022 (~$40B); Do Kwon arrested in Montenegro with a fake passport (Mar
// 2023), sentenced to 15 years (11 Dec 2025). Celsius froze withdrawals 12 Jun 2022, bankrupt Jul 2022; Alex Mashinsky
// sentenced to 12 years (8 May 2025).
// Photos (Wikimedia Commons): see FOOTAGE_CREDITS.md. Music: "Silent Movie 140" by Sascha Ende (ende.app), CC BY 4.0.
import React from 'react';
import {AbsoluteFill, Audio, Img, Loop, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Bubble, CREAM, DISPLAY, Film, Ghost, INK, Intertitle, LIME, MONO, Outro, RED, SANS, SERIF, TallFrame, cl, io, out, rnd, sp, useFonts} from './ScaryStories';
import {Scarf} from './ScaryStories2';
import type {Arms, Face} from './ScaryStories';

const FPS = 30;
type Seg = {k: 'card' | 'scene'; from: number; to: number; id: string};
const LEN = {title: 120, scene0: 114, chap: 90, scene: 210, fact: 120, end: 150, outro: 150};
const T: Seg[] = (() => {
  const order: [Seg['k'], string, number][] = [['card', 'title', LEN.title], ['scene', 'intro', LEN.scene0], ['card', 'c1', LEN.chap], ['scene', 'ftx', LEN.scene], ['card', 'c1b', LEN.fact],
    ['card', 'c2', LEN.chap], ['scene', 'terra', LEN.scene], ['card', 'c2b', LEN.fact], ['card', 'c3', LEN.chap], ['scene', 'celsius', LEN.scene], ['card', 'c3b', LEN.fact], ['scene', 'end', LEN.end], ['card', 'outro', LEN.outro]];
  let a = 0;
  return order.map(([k, id, len]) => { const seg = {k, id, from: a, to: a + len}; a += len; return seg; });
})();
const at = (id: string) => T.find((x) => x.id === id)!.from;
export const SCARY4_DURATION = T[T.length - 1].to;

const CARDS: Record<string, {kicker?: string; lines: React.ReactNode}> = {
  title: {kicker: 'HOTCOIN PRESENTS · EPISODE IV', lines: <>The<br />Fallen Kings</>},
  c1: {kicker: 'CASE FILE I', lines: <>The exchange<br />that vanished.</>},
  c1b: {lines: <>Nov 2022. FTX fell in a week.<br />$8 billion of customer money.<br /><span style={{color: LIME}}>Sentenced: 25 years.</span></>},
  c2: {kicker: 'CASE FILE II', lines: <>The stablecoin<br />that wasn’t.</>},
  c2b: {lines: <>May 2022. $40 billion gone.<br />Caught with a fake passport.<br /><span style={{color: LIME}}>Sentenced: 15 years.</span></>},
  c3: {kicker: 'CASE FILE III', lines: <>The frozen<br />withdrawals.</>},
  c3b: {lines: <>June 2022. Withdrawals frozen.<br />Then bankruptcy.<br /><span style={{color: LIME}}>Sentenced: 12 years.</span></>},
};

// ---------------- set: the detective's office ----------------
const Office: React.FC<{t: number; lamp?: number; hide?: boolean}> = ({t, lamp = 1, hide}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #355E68 0%, #3F6C76 55%, #2F555E 100%)'}} />
    {/* window with rain and a Hotcoin neon across the street */}
    <div style={{position: 'absolute', left: 70, top: 120, width: 250, height: 380, borderRadius: 8, overflow: 'hidden', border: '12px solid #23434A', background: 'linear-gradient(180deg,#1E2D52,#31467A)'}}>
      <div style={{position: 'absolute', left: 30, top: 210, padding: '6px 10px', borderRadius: 8, border: `3px solid ${LIME}`, boxShadow: `0 0 24px ${LIME}, inset 0 0 12px ${LIME}`, opacity: 0.75 + 0.25 * Math.abs(Math.sin(t * 3))}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 150, height: (150 * 328) / 2005, filter: 'drop-shadow(0 0 6px #B8F26A)'}} />
      </div>
      <svg width={250} height={380} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 40}, (_, i) => { const x = rnd(i) * 250, y = ((rnd(i + 9) * 380 + t * 520 * (0.8 + rnd(i) * 0.4)) % 420) - 30; return <line key={i} x1={x} y1={y} x2={x - 4} y2={y + 22} stroke="#A9C3FF" strokeWidth={1.6} opacity={0.5} />; })}
      </svg>
      <div style={{position: 'absolute', left: 119, top: 0, bottom: 0, width: 12, background: '#23434A'}} /><div style={{position: 'absolute', left: 0, right: 0, top: 180, height: 12, background: '#23434A'}} />
    </div>
    {/* venetian-blind light on the wall */}
    <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}} opacity={0.18}>
      {Array.from({length: 7}, (_, i) => <polygon key={i} points={`${380},${130 + i * 48} ${1080},${330 + i * 70} ${1080},${360 + i * 70} ${380},${152 + i * 48}`} fill="#FFF3D1" />)}
    </svg>
    {/* evidence corkboard */}
    <div style={{position: 'absolute', left: 380, top: 150, width: 620, height: 420, background: '#C49A6C', border: '14px solid #6E4A2E', borderRadius: 6, boxShadow: '0 20px 40px rgba(10,20,25,0.4)',
      backgroundImage: 'radial-gradient(rgba(90,55,25,0.35) 1.5px, transparent 1.8px)', backgroundSize: '12px 12px'}} />
    <Board hide={hide} />
    {/* floor + desk */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 880, bottom: 0, background: 'repeating-linear-gradient(90deg,#6B4A36 0 110px,#5E412F 110px 220px)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 880, height: 60, background: 'linear-gradient(180deg, rgba(10,20,25,0.35), transparent)'}} />
    {/* lamp light */}
    <div style={{position: 'absolute', left: 60, top: 860, width: 420, height: 420, background: `radial-gradient(circle at 50% 30%, rgba(255,214,140,${0.35 * lamp}), rgba(255,214,140,0) 65%)`}} />
  </AbsoluteFill>
);

const PHOTOS = ['halloween/ep4/sbf.jpg', 'halloween/ep4/kwon.jpg', 'halloween/ep4/mashinsky.jpg'];
const Polaroid: React.FC<{src: string; x: number; y: number; r: number; w?: number; label?: string; hide?: boolean}> = ({src, x, y, r, w = 130, label, hide}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, padding: `${w * 0.06}px ${w * 0.06}px ${w * 0.2}px`, background: '#F7F2E6', transform: `rotate(${r}deg)`, boxShadow: '0 6px 12px rgba(40,20,10,0.35)'}}>
    {hide
      ? <div style={{width: '100%', height: w * 0.9, background: '#2A2420', color: '#EDE6D3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 900, fontSize: w * 0.4}}>?</div>
      : <Img src={staticFile(src)} style={{width: '100%', height: w * 0.9, objectFit: 'cover', filter: 'grayscale(0.6) sepia(0.35) contrast(1.05)'}} />}
    {label && <div style={{position: 'absolute', left: 0, right: 0, bottom: w * 0.04, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: w * 0.09, color: '#3A2A1E'}}>{label}</div>}
    <div style={{position: 'absolute', left: '50%', top: -6, width: 14, height: 14, marginLeft: -7, borderRadius: 7, background: RED, boxShadow: '0 2px 3px rgba(0,0,0,0.4)'}} />
  </div>
);
const Board: React.FC<{hide?: boolean}> = ({hide}) => (
  <>
    <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
      {[[480, 230, 690, 250], [690, 250, 900, 230], [480, 230, 690, 420], [900, 230, 690, 420]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#C62828" strokeWidth={3} />)}
    </svg>
    <Polaroid src={PHOTOS[0]} x={420} y={190} r={-6} label="CASE I" hide={hide} />
    <Polaroid src={PHOTOS[1]} x={625} y={205} r={3} label="CASE II" hide={hide} />
    <Polaroid src={PHOTOS[2]} x={835} y={190} r={7} label="CASE III" hide={hide} />
    <div style={{position: 'absolute', left: 640, top: 395, width: 110, height: 70, background: '#FFF27A', transform: 'rotate(-4deg)', boxShadow: '0 4px 8px rgba(40,20,10,0.3)', fontFamily: SERIF, fontStyle: 'italic', fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3A2A1E'}}>who’s next?</div>
    <div style={{position: 'absolute', left: 430, top: 430, width: 150, height: 100, background: '#EDE6D3', transform: 'rotate(5deg)', padding: 8, fontFamily: SERIF, fontSize: 16, lineHeight: 1.1, color: '#3A2A1E', boxShadow: '0 4px 8px rgba(40,20,10,0.3)'}}><b style={{fontSize: 18}}>CRYPTO CRASH</b><br />Billions vanish as exchange collapses…</div>
    <div style={{position: 'absolute', left: 820, top: 440, width: 150, height: 90, background: '#EDE6D3', transform: 'rotate(-6deg)', padding: 8, fontFamily: SERIF, fontSize: 16, lineHeight: 1.1, color: '#3A2A1E', boxShadow: '0 4px 8px rgba(40,20,10,0.3)'}}><b style={{fontSize: 18}}>WITHDRAWALS PAUSED</b><br />Users locked out…</div>
  </>
);

const Desk: React.FC<{lamp: number}> = ({lamp}) => (
  <svg width={1080} height={420} viewBox="0 0 1080 420" style={{position: 'absolute', left: 0, top: 1000}}>
    <rect x={20} y={40} width={560} height={40} rx={8} fill="#8A5A3A" /><rect x={40} y={80} width={520} height={300} fill="#74492E" />
    <rect x={70} y={110} width={220} height={90} rx={6} fill="#83563A" /><rect x={300} y={110} width={230} height={90} rx={6} fill="#83563A" />
    <circle cx={180} cy={155} r={6} fill="#C9A453" /><circle cx={415} cy={155} r={6} fill="#C9A453" />
    {/* lamp */}
    <g transform="translate(470 40)"><rect x={-30} y={-6} width={60} height={10} rx={4} fill="#1E3A2E" /><rect x={-4} y={-90} width={8} height={86} fill="#1E3A2E" />
      <path d="M-56,-92 L56,-92 L30,-140 L-30,-140Z" fill="#2E6B4C" /><ellipse cx={0} cy={-92} rx={56} ry={10} fill={`rgba(255,226,150,${lamp})`} /></g>
    {/* case files on the desk */}
    <g transform="translate(120 30) rotate(-6)"><rect width={150} height={20} rx={3} fill="#E8D7A8" /><rect y={-8} width={60} height={10} rx={3} fill="#E8D7A8" /></g>
  </svg>
);

// costumes (ghost space)
const Fedora: React.FC<{t: number}> = ({t}) => (
  <g transform={`rotate(${-6 + Math.sin(t * 2.2) * 2} 100 16)`}>
    <ellipse cx={100} cy={18} rx={82} ry={14} fill="#4A3B2C" />
    <path d="M52,18 Q50,-36 100,-40 Q150,-36 148,18Z" fill="#5C4A37" />
    <path d="M78,-36 Q100,-24 122,-36" stroke="#3E3124" strokeWidth={6} fill="none" />
    <rect x={52} y={2} width={96} height={14} fill="#2B241C" />
  </g>
);
const Magnifier: React.FC<{a: number}> = ({a}) => (
  <g transform={`rotate(${a} 186 160)`}><rect x={182} y={150} width={9} height={52} rx={4} fill="#5C3A22" /><circle cx={186} cy={128} r={26} fill="rgba(200,230,255,0.35)" stroke="#C9A453" strokeWidth={7} /></g>
);
const CoffeeDonut: React.FC<{t: number}> = ({t}) => (
  <svg width={190} height={140} viewBox="0 0 190 140" style={{position: 'absolute', left: 870, top: 1010}}>
    <path d={`M36,40 q${Math.sin(t * 3) * 6},-14 0,-28 M56,40 q${Math.sin(t * 3 + 1) * 6},-14 0,-28`} stroke="rgba(255,255,255,0.6)" strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M20,44 L76,44 L70,120 L26,120Z" fill="#F3EBD8" /><rect x={20} y={64} width={56} height={22} fill={LIME} /><path d="M76,58 q22,4 0,30" stroke="#F3EBD8" strokeWidth={8} fill="none" />
    <g transform="translate(130 96)"><circle r={36} fill="#E8A65A" /><circle r={30} fill="#F28CB1" /><circle r={11} fill="#5E412F" />
      {[[-18, -10, '#B8F26A'], [8, -20, '#7FC8FF'], [16, 12, '#FFE38A'], [-10, 18, '#fff']].map(([x, y, c], i) => <rect key={i} x={x as number} y={y as number} width={8} height={3} rx={1} fill={c as string} transform={`rotate(${i * 40} ${x} ${y})`} />)}
    </g>
  </svg>
);

// ---------------- case file (bubble content) ----------------
const CaseFile: React.FC<{f: number; photo: string; name: string; role: string; when: string; lines: [string, string][]; sentence: string}> = ({f, photo, name, role, when, lines, sentence}) => {
  const p = sp(f - 4, 12, 160), stamp = sp(f - 130, 8, 260);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS, color: INK, display: 'flex', gap: 26}}>
      <div style={{width: 250, flex: 'none', transform: `translateY(${(1 - p) * 40}px) rotate(${-3 + (1 - p) * -8}deg)`, opacity: p}}>
        <div style={{background: '#F7F2E6', padding: '12px 12px 40px', boxShadow: '0 10px 20px rgba(20,12,30,0.25)', position: 'relative'}}>
          <Img src={staticFile(photo)} style={{width: '100%', height: 250, objectFit: 'cover', filter: 'grayscale(0.4) sepia(0.25)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 15, color: '#3A2A1E'}}>{name.toUpperCase()}</div>
        </div>
      </div>
      <div style={{flex: 1, position: 'relative'}}>
        <div style={{fontFamily: MONO, fontSize: 17, color: '#5A6478', letterSpacing: 1}}>{when}</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 38, lineHeight: 1.05, marginTop: 6}}>{name}</div>
        <div style={{fontFamily: MONO, fontSize: 16, color: '#5A6478', marginTop: 4}}>{role}</div>
        <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10}}>
          {lines.map(([k, v], i) => (
            <div key={k} style={{display: 'flex', alignItems: 'baseline', gap: 12, opacity: out((f - 40 - i * 26) / 12), transform: `translateX(${(1 - out((f - 40 - i * 26) / 12)) * 20}px)`}}>
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 15, color: '#8A93A6', width: 112, flex: 'none'}}>{k}</div>
              <div style={{fontWeight: 700, fontSize: 25, lineHeight: 1.15}}>{v}</div>
            </div>
          ))}
        </div>
        {f > 130 && <div style={{position: 'absolute', right: 14, bottom: 4, border: `6px solid ${RED}`, color: RED, borderRadius: 10, padding: '4px 14px', fontFamily: DISPLAY, fontWeight: 900, fontSize: 36, transform: `rotate(-9deg) scale(${2 - stamp})`, opacity: Math.min(1, stamp * 1.5), background: 'rgba(255,253,246,0.85)'}}>{sentence}</div>}
      </div>
    </div>
  );
};

const EndCard4: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: INK}}>
    <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 132, lineHeight: 1, transform: `scale(${0.8 + 0.2 * sp(f, 10, 160)})`}}>Case closed?</div>
    <div style={{fontFamily: MONO, fontSize: 22, color: '#5A6478', marginTop: 24, letterSpacing: 2, opacity: out((f - 30) / 14)}}>…HAPPY HALLOWEEN 🎃</div>
  </div>
);

// ---------------- the office scene ----------------
const Scene: React.FC<{id: string; f: number; g: number}> = ({id, f, g}) => {
  const t = g / FPS;
  let L: {face: Face; arms: [Arms, Arms]; tremble?: number; dy?: number} = {face: 'peek', arms: ['down', 'down'], dy: 0};
  let Mi: {face: Face; arms: [Arms, Arms]} = {face: 'calm', arms: ['down', 'hold']};
  let R: {face: Face; arms: [Arms, Arms]} = {face: 'chew', arms: ['side', 'hold']};
  let mag = -20, lamp = 1, bubble: React.ReactNode = null;
  const jump = (t0: number) => -Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (f - t0) / 14)))) * 70;
  if (id === 'intro') {
    Mi = {face: f > 40 ? 'tell' : 'calm', arms: [f > 30 && f < 80 ? 'up' : 'down', 'hold']};
    mag = f > 30 && f < 80 ? -60 + Math.sin(f / 5) * 15 : -20;
    L = {face: f > 50 ? 'scared' : 'peek', arms: ['down', 'down'], tremble: f > 50 ? 0.6 : 0};
  } else if (id === 'ftx' || id === 'terra' || id === 'celsius') {
    Mi = {face: 'tell', arms: ['down', 'hold']};
    mag = -40 + Math.sin(f / 9) * 10;
    const stamp = f > 140;
    L = {face: stamp ? 'shock' : 'scared', arms: stamp ? ['up', 'up'] : ['down', 'down'], tremble: stamp ? 0 : 0.6, dy: stamp ? jump(140) : 0};
    R = {face: stamp ? 'shock' : 'chew', arms: stamp ? ['up', 'hold'] : ['side', 'hold']};
    if (id === 'celsius') lamp = f > 140 && f < 150 ? 0.2 : 1;
    const cfg = id === 'ftx'
      ? {photo: PHOTOS[0], name: 'Sam Bankman-Fried', role: 'FTX · founder', when: 'CASE FILE I · NOV 2022', lines: [['WHAT', 'FTX collapsed in a week'], ['DAMAGE', '$8B of customer funds'], ['VERDICT', 'Guilty on 7 counts (2023)']] as [string, string][], sentence: '25 YEARS'}
      : id === 'terra'
        ? {photo: PHOTOS[1], name: 'Do Kwon', role: 'Terraform Labs · co-founder', when: 'CASE FILE II · MAY 2022', lines: [['WHAT', 'UST lost its $1 peg, LUNA crashed'], ['DAMAGE', '~$40B wiped out'], ['CAUGHT', 'Montenegro, fake passport (2023)']] as [string, string][], sentence: '15 YEARS'}
        : {photo: PHOTOS[2], name: 'Alex Mashinsky', role: 'Celsius · founder', when: 'CASE FILE III · JUNE 2022', lines: [['WHAT', 'Withdrawals frozen overnight'], ['THEN', 'Bankruptcy, July 2022'], ['PLEA', 'Guilty to fraud (2024)']] as [string, string][], sentence: '12 YEARS'};
    bubble = <Bubble f={f - 6} h={400}><CaseFile f={f - 10} {...cfg} /></Bubble>;
  } else if (id === 'end') {
    Mi = {face: f > 70 ? 'happy' : 'scream', arms: f > 70 ? ['side', 'hold'] : ['up', 'up']};
    L = {face: f > 70 ? 'happy' : 'scream', arms: f > 70 ? ['side', 'side'] : ['up', 'up'], dy: f > 70 ? 0 : jump(0)};
    R = {face: f > 70 ? 'chew' : 'scream', arms: f > 70 ? ['side', 'hold'] : ['up', 'up']};
    lamp = f < 12 ? 0.2 : 1;
    bubble = f > 74 ? <Bubble f={f - 74} w={700} h={360}><EndCard4 f={f - 80} /></Bubble> : null;
  }
  return (
    <AbsoluteFill>
      <Office t={t} lamp={lamp} />
      <Ghost id="m4" x={690} y={990} s={1.25} t={t} face={Mi.face} arms={Mi.arms} light={0} warm={-1}>
        <Magnifier a={mag} />
        <Fedora t={t} />
      </Ghost>
      <Ghost id="r4" x={900} y={1110} s={1.15} t={t} face={R.face} arms={R.arms} ph={2.6} warm={-1} />
      <CoffeeDonut t={t} />
      <Ghost id="l4" x={300} y={1080 + (L.dy ?? 0)} s={1.15} t={t} face={L.face} arms={L.arms} ph={1.3} tremble={L.tremble ?? 0} warm={1}><Scarf id="l4" /></Ghost>
      <Desk lamp={lamp} />
      {bubble}
    </AbsoluteFill>
  );
};

export const ScaryStories4: React.FC = () => {
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
          ? <Outro f={f} extra="LESSON OF THE NIGHT: TRUST, BUT VERIFY" sources={<>Sources: US DOJ SDNY (2024) · The Block &amp; Decrypt (Dec 2025) · NBC News (May 2025)<br />Photos: Wikimedia Commons (CC BY) · Music: Silent Movie 140 by Sascha Ende (ende.app), CC BY 4.0</>} />
          : card ? <Intertitle id={seg.id} f={f} len={len} cards={CARDS} /> : <Scene id={seg.id} f={f} g={g} />}
      </AbsoluteFill>
      <Film g={g} card={card} />
      <Audio src={staticFile('halloween/silent-movie-140.mp3')} volume={(fr) => 0.7 * interpolate(fr, [0, 10, SCARY4_DURATION - 50, SCARY4_DURATION], [0, 1, 1, 0], cl)} />
      <Loop durationInFrames={180}><Audio src={staticFile('halloween/projector.wav')} volume={0.16} /></Loop>
      {T.filter((x) => x.k === 'scene' && x.id !== 'intro').map((x) => <Sequence key={x.id} from={x.from + 4} durationInFrames={30} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.35} /></Sequence>)}
      {['ftx', 'terra', 'celsius'].map((id) => <Sequence key={id} from={at(id) + 140} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.55} /></Sequence>)}
      <Sequence from={at('end')} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.45} /></Sequence>
    </AbsoluteFill>
  );
};
// teaser cover: case files still sealed, faces hidden
export const ScaryThumb4: React.FC = () => {
  useFonts();
  const t = 2.4;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Office t={t} hide />
      <Ghost id="m4t" x={690} y={990} s={1.25} t={t} face="tell" arms={['up', 'hold']} light={0} warm={-1}>
        <Magnifier a={-60} />
        <Fedora t={t} />
      </Ghost>
      <Ghost id="r4t" x={900} y={1110} s={1.15} t={t} face="shock" arms={['up', 'hold']} ph={2.6} warm={-1} />
      <CoffeeDonut t={t} />
      <Ghost id="l4t" x={300} y={1060} s={1.15} t={t} face="scream" arms={['up', 'up']} ph={1.3} warm={1}><Scarf id="l4t" /></Ghost>
      <Desk lamp={1} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,28,0.85) 0%, rgba(10,22,28,0.5) 22%, rgba(10,22,28,0) 36%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 54, textAlign: 'center', color: CREAM}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 9, color: LIME}}>— CRYPTO SCARY STORIES · EP. IV —</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 124, lineHeight: 0.95, marginTop: 14, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>The <span style={{color: LIME}}>Fallen</span> Kings</div>
      </div>
      <Bubble f={60} w={740} h={250} top={330}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: INK, textAlign: 'center'}}>
          <div style={{display: 'flex', gap: 14}}>
            {['I', 'II', 'III'].map((n, i) => (
              <div key={n} style={{position: 'relative', width: 150, height: 92, borderRadius: 10, background: '#E8D7A8', color: '#3A2A1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: 3}}>CASE {n}</div>
                <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, letterSpacing: 2}}>???</div>
                <div style={{position: 'absolute', border: `3px solid ${RED}`, color: RED, borderRadius: 6, padding: '0 6px', fontFamily: MONO, fontWeight: 700, fontSize: 13, letterSpacing: 2, transform: `rotate(${-12 + i * 8}deg)`, bottom: -10, background: 'rgba(255,253,246,0.9)'}}>SEALED</div>
              </div>
            ))}
          </div>
          <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 56, marginTop: 22, lineHeight: 1}}>Who fell the hardest?</div>
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
export const ScaryThumb4Tall: React.FC = () => <TallFrame episode="🎃 HALLOWEEN SPECIAL 🎃" title="Episode 4" small><ScaryThumb4 /></TallFrame>;
export const ScaryStories4Tall: React.FC = () => <TallFrame episode="EPISODE 4" title="The Fallen Kings"><ScaryStories4 /></TallFrame>;
