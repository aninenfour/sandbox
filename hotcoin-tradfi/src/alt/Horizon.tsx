import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, DISPLAY, MONO, SERIF, coinFace, useFontsReady} from './shared';
import {AnimatedGrain, Cursor, EndCard, FLOOD, GRADE, INOUT, Key, OUT, Slot, bump, clamp, ease, mix, pathAt} from './kit';
import {SfxTrack} from './sfx';

// Variant C, "Horizon". Directed from the Claude Opus 5.5 film: one curved horizon stays put while the
// macro texture under it match-cuts on the beat, and one serif phrase sits on the edge.
// It opens on a mosaic of money and car photos. 4:5, 60 fps, 120 BPM, 18.5 s.
export const HORIZON_DURATION = 1110;
const Y0 = 760, R = 1500, CX = 540;
const CY = Y0 + R;

// Mosaic, 4 x 5 tiles of 270 px. The car hood (12279541) sits at index 9 and is the one the cursor opens.
const TILES = [
  10905352, 7109882, 6757642, 4480232, 7076319, 12777409, 28103487, 18372338, 14754450, 12279541,
  35772536, 6595970, 32688417, 5214390, 6276048, 1055081, 20006817, 37950555, 4611562, 7214230,
];
const HOOD = 9;
const OPEN = 50;

type Shot = {at: number; tex: string; pos: string; word: React.ReactNode};
const I: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{fontFamily: SERIF, fontStyle: 'italic'}}>{children}</span>;
const SHOTS: Shot[] = [
  {at: 96, tex: 'hood', pos: '50% 72%', word: <I>Trade Tesla</I>},
  {at: 150, tex: 'circuit', pos: '50% 50%', word: <I>NVIDIA</I>},
  {at: 210, tex: 'dollar', pos: '50% 40%', word: <I>Apple</I>},
  {at: 270, tex: 'gold', pos: '50% 50%', word: <I>Gold</I>},
  {at: 330, tex: 'coins', pos: '40% 50%', word: <I>and ETFs</I>},
  {at: 390, tex: 'road', pos: '58% 50%', word: <><I>with</I> <span style={{fontFamily: DISPLAY, fontSize: '0.82em', color: C.green}}>USDT.</span></>},
  {at: 480, tex: 'roof', pos: '50% 50%', word: <I>Spot and Futures.</I>},
  {at: 570, tex: 'gold', pos: '20% 80%', word: <I>One account.</I>},
  {at: 660, tex: 'hood', pos: '80% 30%', word: <I>No moving funds.</I>},
  {at: 750, tex: 'dollar', pos: '30% 70%', word: <I>No fiat account.</I>},
];
const COIN = 840;
const CLICK_USDT = 390, SPLIT = 486, JOIN = 560, CLICK_END = 975;

const shotAt = (f: number) => [...SHOTS].reverse().find((s) => f >= s.at) ?? SHOTS[0];

const Texture: React.FC<{f: number; s: Shot}> = ({f, s}) => {
  const k = interpolate(f - s.at, [0, 120], [1.12, 1.04], clamp);
  const style: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.pos, transform: `scale(${k})`, filter: `${GRADE} brightness(0.95)`};
  return s.tex === 'road'
    ? <OffthreadVideo src={staticFile('plates/road.mp4')} muted style={{...style, filter: `${GRADE} brightness(1.35)`}} />
    : <Img src={staticFile(`alt/${s.tex}.jpg`)} style={style} />;
};

const Mosaic: React.FC<{f: number}> = ({f}) => (
  <>
    {TILES.map((id, i) => {
      const at = 2 + i * 2;
      if (f < at || i === HOOD) return null;
      const x = (i % 4) * 270, y = Math.floor(i / 4) * 270;
      return <Img key={id} src={staticFile(`alt/tiles/${id}.jpg`)} style={{position: 'absolute', left: x, top: y, width: 270, height: 270, objectFit: 'cover', filter: `${GRADE} brightness(0.9)`}} />;
    })}
  </>
);

export const Horizon: React.FC = () => {
  useFontsReady();
  const f = useCurrentFrame();

  // Opening: the hood tile opens to full frame, then the horizon closes over it.
  const hx = (HOOD % 4) * 270, hy = Math.floor(HOOD / 4) * 270;
  const open = ease(f, OPEN + 2, 76, INOUT);
  const tile = {x: mix(hx, 0, open), y: mix(hy, 0, open), w: mix(270, 1080, open), h: mix(270, 1350, open)};
  const close = ease(f, 76, 96, INOUT);
  let r = mix(2400, R, close);
  let cy = CY;
  // Ending: the horizon contracts into a green coin.
  const toCoin = ease(f, COIN, 880, INOUT);
  r = mix(r, 250, toCoin);
  cy = mix(cy, 640, toCoin);
  const green = f >= COIN;
  const arcGreen = f >= CLICK_USDT && f < COIN;
  const split = ease(f, SPLIT, SPLIT + 30, OUT) * (1 - ease(f, JOIN, JOIN + 24, INOUT));
  const s = shotAt(f);
  const tileShown = 2 + HOOD * 2;
  const ink = f >= CLICK_END;
  const flood = ease(f, CLICK_END + 2, 1000, FLOOD);
  const drawArc = ease(f, 90, 112, OUT);

  const cur: Key[] = [
    [0, 980, 1330], [OPEN - 4, hx + 150, hy + 150], [90, 880, 1180], [CLICK_USDT - 6, 760, Y0 - 60], [SPLIT - 6, 700, Y0 + 4],
    [JOIN - 4, 840, Y0 + 30], [620, 900, 1200], [940, 900, 1250], [CLICK_END - 4, CX + 20, 650], [1030, 650, 860], [1109, 650, 860],
  ];
  const c = pathAt(f, cur);
  const hold = f >= SPLIT && f < JOIN ? Math.min(ease(f, SPLIT - 4, SPLIT + 2), 1 - ease(f, JOIN - 2, JOIN + 4)) : 0;
  const press = Math.max(bump(f, OPEN), bump(f, CLICK_USDT), hold, bump(f, CLICK_END));

  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #06080A 0%, #0E1216 ${Y0 - 80}px, #1B1F22 ${Y0}px)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(70% 40% at 50% 0%, rgba(255,240,215,0.07), rgba(0,0,0,0) 70%)'}} />
      {f < 96 && <Mosaic f={f} />}
      {f >= tileShown && !ink && (
        <div style={{
          position: 'absolute', left: f < 76 ? tile.x : 0, top: f < 76 ? tile.y : 0, width: f < 76 ? tile.w : 1080, height: f < 76 ? tile.h : 1350, overflow: 'hidden',
          clipPath: f >= 76 ? `circle(${r}px at ${CX}px ${cy}px)` : undefined,
        }}>
          {green
            ? <AbsoluteFill style={{background: coinFace, backgroundSize: `${r * 2}px ${r * 2}px`, backgroundPosition: `${CX - r}px ${cy - r}px`}} />
            : <Texture f={f} s={f < 96 ? SHOTS[0] : s} />}
          {!green && <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,14,17,0) 0%, rgba(11,14,17,0.2) 45%, rgba(11,14,17,0.7) 100%)'}} />}
        </div>
      )}
      {f >= 90 && f < COIN && (
        <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
          {[-1, 1].map((d) => (
            <circle key={d} cx={CX + d * split * 90} cy={CY - split * 20} r={R} fill="none" stroke={arcGreen ? C.green : C.paper} strokeOpacity={arcGreen ? 0.95 : 0.55}
              strokeWidth={arcGreen ? 3 : 1.5} pathLength={1} strokeDasharray={`${drawArc} 1`} transform={`rotate(-90 ${CX} ${CY})`} />
          ))}
        </svg>
      )}
      {SHOTS.map((sh, i) => {
        const next = SHOTS[i + 1]?.at ?? COIN;
        return <Slot key={i} f={f} at={sh.at + 4} out={next - 14} y={Y0 - 178} h={170} style={{fontSize: 140, color: C.paper, letterSpacing: -1}}>{sh.word}</Slot>;
      })}
      {green && f >= 872 && !ink && (
        <div style={{position: 'absolute', left: CX - r, top: cy - r, width: r * 2, height: r * 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.ink}}>
          <div style={{fontFamily: DISPLAY, fontSize: 230, lineHeight: 1, letterSpacing: -6, textShadow: '0 3px 0 rgba(255,255,255,0.35)'}}>10</div>
        </div>
      )}
      {green && !ink && <div style={{position: 'absolute', left: CX - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.4), inset 0 -10px 20px rgba(0,0,0,0.2), 0 50px 90px rgba(0,0,0,0.5)'}} />}
      <Slot f={f} at={880} out={958} y={190} h={150} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 140, color: C.paper}}>From</Slot>
      <Slot f={f} at={895} out={962} y={930} h={160} style={{fontFamily: DISPLAY, fontSize: 150, color: C.paper}}>USDT</Slot>
      <Slot f={f} at={910} out={966} y={1110} h={50} style={{fontFamily: MONO, fontWeight: 500, fontSize: 34, color: C.grey, letterSpacing: 1}}>on selected TradFi products</Slot>
      {ink && f < 1002 && (
        <div style={{position: 'absolute', left: CX - (500 + flood * 2600) / 2, top: 640 - (500 + flood * 2600) / 2, width: 500 + flood * 2600, height: 500 + flood * 2600, borderRadius: '50%', background: C.ink}} />
      )}
      <EndCard f={f} at={1000} y={690} logoW={620} />
      <Cursor {...c} press={press} />
      <AnimatedGrain f={f} opacity={0.34} />
      <SfxTrack cues={HORIZON_SFX} />
    </AbsoluteFill>
  );
};

const HORIZON_SFX: [number, string, number][] = [
  ...TILES.map((_, i) => [2 + i * 2, 'hover', 0.25] as [number, string, number]).filter((_, i) => i % 3 === 0),
  [OPEN, 'press', 0.9], [52, 'expand', 0.7], [76, 'collapse', 0.7],
  ...SHOTS.map((s) => [s.at, 'swipe', 0.45] as [number, string, number]),
  [CLICK_USDT, 'press', 0.8], [SPLIT, 'drag-start', 0.6], [JOIN, 'snap', 0.7],
  [COIN, 'collapse', 0.7], [872, 'reward', 0.7], [CLICK_END, 'press', 0.9], [CLICK_END + 2, 'expand', 0.8], [1000, 'success', 0.8],
];
