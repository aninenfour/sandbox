import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, DISPLAY, MONO, SERIF, coinFace, useFontsReady} from './shared';
import {AnimatedGrain, Cursor, EndCard, FLOOD, IN, INOUT, Key, OUT, Slot, bump, ease, mix, pathAt, pillBg, pillShadow, sp} from './kit';
import {SfxTrack} from './sfx';

// Variant A, "Orbit". Directed from the X Ticker launch film: a paper stage, orbit rings,
// network lines and one thin price line. 4:5, 60 fps, 120 BPM (30 frames a beat), 18 s.
export const ORBIT_DURATION = 1080;
const CX = 540, CY0 = 850;
const RINGS = [180, 310, 440, 570];
const circ = (r: number) => 2 * Math.PI * r;

type Chip = {t: string; k: string; img: string; r: number; a: number; at: number};
const CHIPS: Chip[] = [
  {t: 'AAPL', k: 'US stock', img: 'dollar', r: 310, a: -150, at: 90},
  {t: 'TSLA', k: 'US stock', img: 'hood', r: 440, a: -38, at: 120},
  {t: 'GOLD', k: 'Metal', img: 'gold', r: 440, a: 158, at: 150},
  {t: 'ETFs', k: 'Index funds', img: 'coins', r: 440, a: 64, at: 180},
  {t: 'SILVER', k: 'Metal', img: 'silver', r: 310, a: 112, at: 210},
  {t: 'NVDA', k: 'US stock', img: 'circuit', r: 570, a: 14, at: 240},
];
const NV = CHIPS[5];
const GRAB = 252, LOCK = 292;
const PULL = 520, LET_GO = 560;
const FIAT_CLICK = 640;
const CLICK_END = 960;

const spinAt = (f: number) => f * 0.06;
const coinCY = (f: number) => mix(CY0, 700, ease(f, 720, 770, INOUT));
const coinD = (f: number) => {
  if (f < 30) return 0;
  const base = 240 * sp(f - 30, 10, 240);
  const big = mix(base, 420, ease(f, 720, 770, INOUT));
  return mix(big, 70, ease(f, 920, 950, INOUT));
};
const polar = (r: number, a: number, cy: number) => ({x: CX + r * Math.cos((a * Math.PI) / 180), y: cy + r * Math.sin((a * Math.PI) / 180)});

const chipState = (c: Chip, f: number) => {
  const pop = sp(f - c.at, 11, 230);
  let r = c.r;
  if (c === NV) r = mix(570, 232, ease(f, GRAB + 4, LOCK, INOUT));
  const retract = ease(f, 300 + CHIPS.indexOf(c) * 3, 330 + CHIPS.indexOf(c) * 3, IN);
  r = mix(r, 0, retract);
  return {p: polar(r, c.a + spinAt(f), CY0), scale: f < c.at ? 0 : pop * (1 - retract) * (c === NV && f > GRAB ? 1.1 : 1), r};
};

// Ring radii through the film: four orbits, then SPOT and FUTURES, then one ring, then the coin's rim.
const ringR = (i: number, f: number) => {
  const two = i < 2 ? 250 : 370;
  let r = mix(RINGS[i], two, ease(f, 300, 330, INOUT));
  r = mix(r, 310, ease(f, 420, 450, INOUT));
  r = mix(r, 250, ease(f, 720, 770, INOUT));
  return mix(r, coinD(f) / 2 + 2, ease(f, 900, 925, IN));
};

const Chips: React.FC<{f: number}> = ({f}) => (
  <>
    {CHIPS.map((c) => {
      const s = chipState(c, f);
      if (s.scale <= 0.01) return null;
      const locked = c === NV && f >= LOCK;
      return (
        <div key={c.t} style={{
          position: 'absolute', left: s.p.x, top: s.p.y, transform: `translate(-50%, -50%) scale(${s.scale})`,
          background: '#FFFFFF', borderRadius: 999, padding: '12px 26px 12px 12px', display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: locked || (c === NV && f > GRAB) ? `0 0 0 4px ${C.green}, 0 24px 44px rgba(11,14,17,0.22)` : '0 12px 30px rgba(11,14,17,0.12), inset 0 0 0 1px rgba(11,14,17,0.06)',
        }}>
          <div style={{width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', background: C.ink}}>
            <Img src={staticFile(`alt/${c.img}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.2) sepia(0.14) contrast(1.14)'}} />
          </div>
          <div>
            <div style={{fontFamily: DISPLAY, fontSize: 30, color: C.ink, lineHeight: 1}}>{c.t}</div>
            <div style={{fontFamily: MONO, fontSize: 17, color: C.grey, marginTop: 5, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{c.k}</div>
          </div>
        </div>
      );
    })}
  </>
);

const Coin: React.FC<{f: number}> = ({f}) => {
  const d = coinD(f);
  if (d <= 1 || f >= CLICK_END + 2) return null;
  const flip = ease(f, 750, 792, INOUT) * 180;
  const back = flip > 90;
  const inked = f >= CLICK_END;
  return (
    <div style={{position: 'absolute', left: CX - d / 2, top: coinCY(f) - d / 2, width: d, height: d, perspective: 1600}}>
      <div style={{
        width: d, height: d, borderRadius: '50%', background: inked ? C.ink : coinFace, transform: `rotateY(${back ? flip - 180 : flip}deg) scale(${1 - bump(f, CLICK_END) * 0.1})`,
        boxShadow: `inset 0 3px 0 rgba(255,255,255,0.4), inset 0 -8px 16px rgba(0,0,0,0.18), 0 40px 70px rgba(11,14,17,0.25), 0 0 0 ${d * 0.04}px rgba(126,194,90,0.18)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.ink, overflow: 'hidden',
      }}>
        {d > 120 && !back && <div style={{fontFamily: DISPLAY, fontSize: d * 0.225}}>USDT</div>}
        {d > 120 && back && (
          <>
            <div style={{fontFamily: DISPLAY, fontSize: d * 0.46, lineHeight: 1, letterSpacing: -4, textShadow: '0 2px 0 rgba(255,255,255,0.35)'}}>10</div>
            <div style={{fontFamily: MONO, fontWeight: 500, fontSize: d * 0.06, letterSpacing: d * 0.012, marginTop: d * 0.02}}>USDT</div>
          </>
        )}
      </div>
    </div>
  );
};

const Stage: React.FC<{f: number}> = ({f}) => {
  const cy = coinCY(f);
  const spin = spinAt(f);
  const nv = chipState(NV, f).p;
  // "No moving funds": a transfer line the cursor pulls out, which snaps back.
  const pull = ease(f, PULL, LET_GO - 6, OUT) * (1 - sp(f - LET_GO, 12, 260));
  const tip = {x: mix(CX + 130, 880, pull), y: mix(cy - 50, 560, pull)};
  // "No fiat account": a dashed FIAT ring whose dashes shrink to nothing.
  const fiatIn = ease(f, 600, 622);
  const fiatGone = ease(f, FIAT_CLICK + 4, 676, INOUT);
  const fiatR = 520;
  const priceDraw = ease(f, 690, 740, OUT);
  const merged = f >= 435;
  return (
    <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
      <defs>
        {[0, 1, 2, 3].map((i) => <path key={i} id={`ring${i}`} d={`M ${CX - ringR(i, f)} ${cy} a ${ringR(i, f)} ${ringR(i, f)} 0 1 1 ${ringR(i, f) * 2} 0 a ${ringR(i, f)} ${ringR(i, f)} 0 1 1 ${-ringR(i, f) * 2} 0`} />)}
      </defs>
      {[0, 1, 2, 3].map((i) => {
        const r = ringR(i, f);
        const draw = ease(f, 40 + i * 8, 84 + i * 8, OUT);
        const green = merged && f < 900;
        const split = f >= 300 && !merged;
        return <circle key={i} cx={CX} cy={cy} r={r} fill="none" stroke={green ? C.green : C.ink} strokeOpacity={green ? 0.9 : split ? 0.45 : 0.12} strokeWidth={green ? 3 : split ? 2.5 : 1.5}
          strokeDasharray={`${circ(r) * draw} ${circ(r)}`} transform={`rotate(-90 ${CX} ${cy})`} />;
      })}
      {f >= 330 && f < 450 && (
        <>
          <text fontFamily={MONO} fontSize={26} letterSpacing={6} fill={C.ink} fillOpacity={0.85}>
            <textPath href="#ring0" startOffset={`${(f * 0.12) % 100}%`}>SPOT  ·  SPOT  ·  SPOT  ·  SPOT  ·  SPOT</textPath>
          </text>
          <text fontFamily={MONO} fontSize={26} letterSpacing={6} fill={C.ink} fillOpacity={0.85}>
            <textPath href="#ring2" startOffset={`${100 - ((f * 0.1) % 100)}%`}>FUTURES  ·  FUTURES  ·  FUTURES  ·  FUTURES</textPath>
          </text>
        </>
      )}
      {f >= 450 && f < 720 && (
        <text fontFamily={MONO} fontSize={26} letterSpacing={6} fill={C.ink} fillOpacity={0.85}>
          <textPath href="#ring0" startOffset={`${(f * 0.08) % 100}%`}>SPOT + FUTURES  ·  ONE ACCOUNT  ·  SPOT + FUTURES  ·  ONE ACCOUNT</textPath>
        </text>
      )}
      {CHIPS.map((c) => {
        const s = chipState(c, f);
        if (s.scale <= 0.01) return null;
        const hot = c === NV && f > GRAB;
        return <line key={c.t} x1={CX} y1={CY0} x2={s.p.x} y2={s.p.y} stroke={hot ? C.green : C.ink} strokeOpacity={hot ? 1 : 0.14} strokeWidth={hot ? 4 : 1.5} />;
      })}
      {f < 330 && new Array(12).fill(0).map((_, i) => {
        const p = polar(RINGS[i % 4], i * 47 + 11 + spin, cy);
        return <circle key={i} cx={p.x} cy={p.y} r={5 * ease(f, 60 + i * 4, 80 + i * 4)} fill={C.ink} fillOpacity={0.22} />;
      })}
      {f >= PULL && f < LET_GO + 30 && pull > 0.01 && (
        <g>
          <line x1={CX + 110} y1={cy - 40} x2={tip.x} y2={tip.y} stroke={C.ink} strokeWidth={3} strokeDasharray="10 10" />
          <circle cx={tip.x} cy={tip.y} r={10} fill={C.paper} stroke={C.ink} strokeWidth={3} />
        </g>
      )}
      {f >= 600 && f < 690 && (
        <g>
          <circle cx={CX} cy={cy} r={fiatR} fill="none" stroke={C.red} strokeWidth={3}
            strokeDasharray={`${18 * (1 - fiatGone)} ${22 + fiatGone * 40}`} strokeDashoffset={-f * 0.6} opacity={fiatIn > 0 ? 1 : 0} />
          {fiatGone < 0.6 && fiatIn > 0 && (
            <text x={CX + fiatR * 0.86} y={cy - fiatR * 0.52} fontFamily={MONO} fontSize={26} letterSpacing={4} fill={C.red}>FIAT</text>
          )}
        </g>
      )}
      {f >= 690 && f < 900 && (
        <path d={`M -20 1240 C 150 1220 220 1260 330 1190 S 470 1060 ${CX - 60} ${cy + 120} S 760 900 1100 760`} fill="none" stroke={C.green} strokeWidth={5} strokeLinecap="round"
          pathLength={1} strokeDasharray={`${priceDraw} 1`} />
      )}
      {f < 300 && f > 60 && (
        <path d="M -20 1180 C 120 1150 180 1210 300 1160 S 470 1080 560 1120 S 760 1010 860 1040 S 1010 960 1100 930" fill="none" stroke={C.green} strokeWidth={4} strokeLinecap="round"
          pathLength={1} strokeDasharray={`${ease(f, 80, 200)} 1`} />
      )}
      {nv && null}
    </svg>
  );
};

const CUR: (f: number) => Key[] = (f) => {
  const nvAt = (t: number) => chipState(NV, t).p;
  const g = nvAt(GRAB), l = nvAt(LOCK);
  const cy = coinCY(f);
  return [
    [0, 930, 1320], [27, CX, CY0], [70, CX + 60, CY0 + 90], [150, 800, 1120], [GRAB - 4, g.x + 30, g.y + 10], [LOCK, l.x + 30, l.y + 10],
    [330, 800, 1180], [PULL - 4, CX + 130, CY0 - 50], [LET_GO - 6, 880, 560], [600, 900, 1120],
    [FIAT_CLICK - 4, CX + 520 * 0.86 + 20, CY0 - 520 * 0.5 + 10], [700, 860, 1220], [925, 900, 1300], [CLICK_END - 4, CX + 6, cy + 10],
    [1000, 650, 860], [1079, 650, 860],
  ];
};

export const Orbit: React.FC = () => {
  useFontsReady();
  const f = useCurrentFrame();
  const cur = pathAt(f, CUR(f));
  const hold = (a: number, b: number) => (f >= a && f < b ? Math.min(ease(f, a - 4, a + 2), 1 - ease(f, b - 2, b + 4)) : 0);
  const press = Math.max(bump(f, 30), hold(GRAB, LOCK), hold(PULL, LET_GO), bump(f, FIAT_CLICK), bump(f, CLICK_END));
  const pill = f < 300 ? sp(f - 80, 11, 230) * (1 - ease(f, 300, 312, IN)) : 0;
  const flood = ease(f, CLICK_END + 2, 990, FLOOD);
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 70% at 50% 58%, #F7F6F1 0%, ${C.paper} 60%, #E6E3DA 100%)`, overflow: 'hidden'}}>
      <Stage f={f} />
      <Chips f={f} />
      <Coin f={f} />
      <Slot f={f} at={60} out={300} y={112} h={116} style={{fontFamily: DISPLAY, fontSize: 104, color: C.ink}}>Trade the world</Slot>
      <Slot f={f} at={72} out={302} x={170} w={320} align="left" y={226} h={130} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 118, color: C.ink, textAlign: 'right'}}>with</Slot>
      {pill > 0.01 && (
        <div style={{position: 'absolute', left: 520, top: 238, height: 112, padding: '0 40px', borderRadius: 56, background: pillBg, boxShadow: pillShadow,
          display: 'flex', alignItems: 'center', fontFamily: DISPLAY, fontSize: 78, color: C.ink, transform: `scale(${pill})`}}>USDT</div>
      )}
      <Slot f={f} at={330} out={404} y={150} h={120} style={{fontFamily: DISPLAY, fontSize: 96, color: C.ink}}>Spot <span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: '1.12em'}}>and</span> Futures.</Slot>
      <Slot f={f} at={420} out={494} y={150} h={120} style={{fontFamily: DISPLAY, fontSize: 96, color: C.ink}}>One account.</Slot>
      <Slot f={f} at={510} out={584} y={150} h={120} style={{fontFamily: DISPLAY, fontSize: 96, color: C.ink}}>No moving funds.</Slot>
      <Slot f={f} at={600} out={674} y={150} h={120} style={{fontFamily: DISPLAY, fontSize: 96, color: C.ink}}>No fiat account.</Slot>
      <Slot f={f} at={770} out={900} y={150} h={140} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 132, color: C.ink}}>From</Slot>
      <Slot f={f} at={785} out={904} y={990} h={160} style={{fontFamily: DISPLAY, fontSize: 150, color: C.ink}}>USDT</Slot>
      <Slot f={f} at={800} out={908} y={1170} h={50} style={{fontFamily: MONO, fontWeight: 500, fontSize: 34, color: C.grey, letterSpacing: 1}}>on selected TradFi products</Slot>
      {f >= CLICK_END + 2 && f < 992 && (
        <div style={{position: 'absolute', left: CX - (70 + flood * 2400) / 2, top: coinCY(f) - (70 + flood * 2400) / 2, width: 70 + flood * 2400, height: 70 + flood * 2400, borderRadius: '50%', background: C.ink}} />
      )}
      <EndCard f={f} at={990} y={690} logoW={620} />
      <Cursor {...cur} press={press} />
      <AnimatedGrain f={f} opacity={f >= 990 ? 0.3 : 0.16} />
      <SfxTrack cues={ORBIT_SFX} />
    </AbsoluteFill>
  );
};

const ORBIT_SFX: [number, string, number][] = [
  [30, 'press', 0.9], [40, 'expand', 0.6], [60, 'select', 0.5], [80, 'toggle-on', 0.7],
  [90, 'snap', 0.55], [120, 'snap', 0.55], [150, 'snap', 0.55], [180, 'snap', 0.55], [210, 'snap', 0.55], [240, 'snap', 0.55],
  [GRAB, 'drag-start', 0.7], [LOCK, 'connect', 0.8],
  [300, 'collapse', 0.7], [330, 'select', 0.5], [420, 'select', 0.5], [435, 'check', 0.7],
  [510, 'select', 0.5], [PULL, 'drag-start', 0.6], [LET_GO, 'invalid-drop', 0.7],
  [600, 'select', 0.5], [FIAT_CLICK, 'press', 0.8], [650, 'delete', 0.6],
  [690, 'progress-step', 0.6], [720, 'expand', 0.7], [750, 'reward', 0.7], [785, 'select', 0.5],
  [900, 'collapse', 0.6], [CLICK_END, 'press', 0.9], [962, 'expand', 0.8], [990, 'success', 0.8],
];
