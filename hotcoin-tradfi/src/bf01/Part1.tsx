// Bubble Files 01 · The Hunt Brothers. Part 1: cold open, title, chapter 1 ("The Hunts"). 16:9, 30 fps.
// Johnny Harris-style long-form: real footage carries the story, graphics only when there's something to explain
// (maps, a price chart, framed photo prints, clean labels, one red marker accent). Every shot is locked to a sentence
// of the voiceover (public/bf01/vo/timeline.json, made by scripts/make-bf01-vo.py).
// Facts: see youtube/bubble-files-01-script.md (sources at the bottom). Photos of the Hunts are used under fair use.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {AnimatedGrain, clamp} from '../alt/kit';
import TL from '../../public/bf01/vo/timeline.json';
import US from './us.json';
import AF from './africa.json';

export const FPS = 30;
export const INK = '#0E0F11', PAPER = '#F2EEE6', RED = '#E3262F', LAND = '#2B3036', LAND_EDGE = '#14171A', SILVER = '#C9CED3';
export const ANTON = 'Anton, Impact, sans-serif', SANS = '"Inter Tight", system-ui, sans-serif', MONO = '"IBM Plex Mono", monospace', MARKER = 'BFMarker, cursive';

// ---------- timeline ----------
const CO = TL[0], C1 = TL[1];
const TITLE_AT = CO.dur + 0.25, TITLE_LEN = 3.4;
const C1_AT = TITLE_AT + TITLE_LEN;
const END = C1_AT + C1.dur + 1.2;
export const PART1_DURATION = Math.round(END * FPS);
const co = (i: number) => CO.sentences[i].start;
const c1 = (i: number) => C1_AT + C1.sentences[i].start;
export const f = (s: number) => Math.round(s * FPS);

// ---------- helpers ----------
export const sp = (fr: number, damping = 18, stiffness = 120) => spring({frame: fr, fps: FPS, config: {damping, stiffness}});
export const lin = (fr: number, a: number, b: number, x = 0, y = 1) => interpolate(fr, [a, b], [x, y], clamp);
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const useFonts = () => {
  const [h] = useState(() => delayRender('bf01 fonts'));
  useEffect(() => {
    const face = new FontFace('BFMarker', `url(${staticFile('hunt/fonts/marker.woff2')})`);
    face.load().then((ff) => { document.fonts.add(ff); return Promise.all(['400 100px Anton', '600 40px "Inter Tight"', '500 30px "IBM Plex Mono"', '400 60px BFMarker'].map((s) => document.fonts.load(s))); }).then(() => continueRender(h));
  }, [h]);
};

// ---------- building blocks ----------
export type Grade = 'bw' | 'silver' | 'warm' | 'natural';
export const GRADES: Record<Grade, string> = {
  bw: 'grayscale(1) contrast(1.18) brightness(1.02)',
  silver: 'grayscale(0.85) contrast(1.25) brightness(1.05)',
  warm: 'sepia(0.25) contrast(1.1) saturate(0.9)',
  natural: 'contrast(1.06) saturate(0.95)',
};
// Full-screen footage with a slow push. `crop` scales past film-gate edges on archive transfers.
export const Foot: React.FC<{src: string; dur: number; trim?: number; grade?: Grade; from?: number; to?: number; crop?: number; rate?: number; origin?: string}> = ({src, dur, trim = 0, grade = 'natural', from = 1.0, to = 1.06, crop = 1, rate = 1, origin = '50% 50%'}) => {
  const fr = useCurrentFrame();
  const s = (from + (to - from) * ease(lin(fr, 0, dur))) * crop;
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile(src)} trimBefore={Math.round(trim * FPS)} playbackRate={rate} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`, transformOrigin: origin, filter: GRADES[grade]}} />
    </AbsoluteFill>
  );
};
// A blurred, darkened copy of a clip as a backdrop for prints and maps.
export const Backdrop: React.FC<{src: string; trim?: number; dark?: number}> = ({src, trim = 0, dark = 0.32}) => (
  <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
    <OffthreadVideo src={staticFile(src)} trimBefore={Math.round(trim * FPS)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)', filter: `grayscale(1) blur(18px) brightness(${dark})`}} />
  </AbsoluteFill>
);
export const Paper: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(90% 80% at 50% 45%, #24272c 0%, ${INK} 75%)`}} />
);
// A framed print: photo (or footage) with a paper border and a soft shadow. It settles in, then stays still.
export const Print: React.FC<{img?: string; video?: string; x: number; y: number; w: number; h: number; tilt?: number; at?: number; from?: 'up' | 'down' | 'left' | 'right'; objectPosition?: string; grade?: string; zoom?: number}> = ({img, video, x, y, w, h, tilt = 0, at = 0, from = 'up', objectPosition = '50% 30%', grade = 'grayscale(1) contrast(1.12)', zoom = 0.04}) => {
  const fr = useCurrentFrame();
  const p = fr < at ? 0 : sp(fr - at, 20, 110);
  const off = (1 - p) * 140;
  const dx = from === 'left' ? -off : from === 'right' ? off : 0, dy = from === 'up' ? -off : from === 'down' ? off : 0;
  const inner = 1 + zoom * ease(lin(fr, at, at + 240));
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: Math.min(1, p * 1.6),
      transform: `translate(${dx}px, ${dy}px) rotate(${tilt * p}deg)`, background: PAPER, padding: 14, boxSizing: 'border-box',
      boxShadow: '0 30px 70px rgba(0,0,0,.55), 0 2px 0 rgba(0,0,0,.2)'}}>
      <div style={{width: '100%', height: '100%', overflow: 'hidden', background: '#000'}}>
        {img && <Img src={staticFile(img)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition, transform: `scale(${inner})`, filter: grade}} />}
        {video && <OffthreadVideo src={staticFile(video)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${inner})`, filter: grade}} />}
      </div>
    </div>
  );
};
// Clean label: white slab, black type, wipes on from the left.
export const Tag: React.FC<{text: string; x: number; y: number; at?: number; size?: number; dark?: boolean; sub?: string; inline?: boolean}> = ({text, x, y, at = 0, size = 34, dark, sub, inline}) => {
  const fr = useCurrentFrame();
  const p = fr < at ? 0 : ease(lin(fr, at, at + 12));
  return (
    <div style={{position: inline ? 'relative' : 'absolute', left: inline ? 0 : x, top: inline ? 0 : y, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', clipPath: p >= 1 ? undefined : `inset(0 ${100 - p * 100}% -40% 0)`}}>
      <div style={{background: dark ? INK : '#fff', color: dark ? '#fff' : INK, font: `600 ${size}px/1 ${SANS}`, letterSpacing: 1.5, textTransform: 'uppercase', padding: `${size * 0.42}px ${size * 0.6}px`, whiteSpace: 'nowrap', alignSelf: 'stretch'}}>{text}</div>
      {sub && <div style={{background: RED, color: '#fff', font: `500 ${size * 0.62}px/1 ${MONO}`, letterSpacing: 2, padding: `${size * 0.3}px ${size * 0.6}px`, textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0}}>{sub}</div>}
    </div>
  );
};
// Hand-drawn marker ring that draws on.
export const ringPath = (cx: number, cy: number, rx: number, ry: number) => {
  const p: string[] = [];
  for (let i = 0; i <= 32; i++) { const a = -0.6 + (i / 32) * (Math.PI * 2 + 0.8); const w = 1 + 0.045 * Math.sin(a * 3) + 0.03 * Math.cos(a * 5); p.push(`${i ? 'L' : 'M'}${(cx + Math.cos(a) * rx * w).toFixed(1)},${(cy + Math.sin(a) * ry * w).toFixed(1)}`); }
  return p.join(' ');
};
export const Ring: React.FC<{cx: number; cy: number; rx: number; ry: number; at?: number; color?: string; width?: number}> = ({cx, cy, rx, ry, at = 0, color = RED, width = 7}) => {
  const fr = useCurrentFrame();
  const p = ease(lin(fr, at, at + 14));
  if (p <= 0) return null;
  return <path d={ringPath(cx, cy, rx, ry)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
};
export const Stamp: React.FC<{text: string; sub: string; x: number; y: number; at: number}> = ({text, sub, x, y, at}) => {
  const fr = useCurrentFrame();
  if (fr < at) return null;
  const p = sp(fr - at, 12, 260);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 'max-content', whiteSpace: 'nowrap', transform: `rotate(-7deg) scale(${1.6 - 0.6 * p})`, opacity: Math.min(1, p * 2), border: `8px solid ${RED}`, color: RED, padding: '14px 26px', textAlign: 'center', background: 'rgba(14,15,17,.35)'}}>
      <div style={{font: `400 92px/1 ${ANTON}`, letterSpacing: 3}}>{text}</div>
      <div style={{font: `500 26px ${MONO}`, letterSpacing: 6, marginTop: 6}}>{sub}</div>
    </div>
  );
};
// Fades a shot in over the previous one (soft cut), unless `hard`.
export const Shot: React.FC<{from: number; to: number; hard?: boolean; children: (dur: number) => React.ReactNode}> = ({from, to, hard, children}) => {
  const d = f(to) - f(from);
  return (
    <Sequence from={f(from)} durationInFrames={d}>
      <FadeIn hard={hard}><ShotBody render={children} d={d} /></FadeIn>
    </Sequence>
  );
};
// Renders the shot's contents inside its Sequence, so useCurrentFrame() in them counts from the shot's start.
const ShotBody: React.FC<{render: (dur: number) => React.ReactNode; d: number}> = ({render, d}) => <>{render(d)}</>;
export const FadeIn: React.FC<{hard?: boolean; children: React.ReactNode}> = ({hard, children}) => {
  const fr = useCurrentFrame();
  return <AbsoluteFill style={{opacity: hard ? 1 : lin(fr, 0, 9)}}>{children}</AbsoluteFill>;
};

// ---------- graphics ----------
// $6 (Jan 1979) to ~$50 (Jan 1980), drawn as one clean line.
const ChartUp: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  const pts: [number, number][] = [[0, 6.1], [2, 6.9], [4, 7.6], [6, 8.6], [7.5, 9.6], [8.5, 13.5], [9.3, 16.8], [10.5, 17.4], [11.3, 22], [12, 34.45], [12.57, 49.5]];
  const X = (t: number) => 300 + (t / 12.57) * 1320, Y = (v: number) => 900 - (v / 55) * 700;
  const p = ease(lin(fr, 4, dur - 10));
  const d = pts.map(([t, v], i) => `${i ? 'L' : 'M'}${X(t).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  return (
    <AbsoluteFill>
      <Paper />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {[10, 20, 30, 40, 50].map((v) => <g key={v}><line x1={300} x2={1640} y1={Y(v)} y2={Y(v)} stroke="rgba(255,255,255,.07)" strokeWidth={2} /><text x={1660} y={Y(v) + 9} fill="rgba(255,255,255,.4)" style={{font: `500 24px ${MONO}`}}>${v}</text></g>)}
        <path d={d} fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
        <circle cx={X(0)} cy={Y(6.1)} r={11} fill="#fff" />
        {p > 0.98 && <circle cx={X(12.57)} cy={Y(49.5)} r={11} fill="#fff" />}
      </svg>
      <Tag text="$6 · Jan 1979" x={X(0) - 40} y={Y(6.1) + 30} at={2} size={30} />
      <Tag text="$50 · Jan 1980" x={X(12.57) - 330} y={Y(49.5) - 40} at={dur - 12} size={30} />
      <div style={{position: 'absolute', left: 300, top: 120, font: `500 26px ${MONO}`, letterSpacing: 5, color: SILVER}}>SILVER · US DOLLARS PER OUNCE</div>
    </AbsoluteFill>
  );
};
// The fall: $50 down to $10.80, drawn over the brothers' print.
const FallLine: React.FC<{at: number}> = ({at}) => {
  const fr = useCurrentFrame();
  const p = ease(lin(fr, at, at + 40));
  const pts: [number, number][] = [[200, 230], [520, 300], [760, 420], [900, 380], [1150, 560], [1380, 620], [1500, 900], [1720, 940]];
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
      <path d={d} fill="none" stroke={RED} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
  );
};

// US map: whole country, Texas fills, then the camera dives to the East Texas field.
const MapEastTexas: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  const tx = US.states.find((s) => s.name === 'Texas')!;
  const [kx, ky] = US.points.kilgore;
  const sc = 1560 / US.w;
  const fill = sp(fr - 6, 18, 140);
  const dive = ease(lin(fr, 26, Math.min(dur - 20, 110)));
  const z = 1 + 2.3 * dive;
  // keep the field near the centre as we zoom
  const cx = (US.w / 2) * (1 - dive) + kx * dive, cy = (US.h / 2) * (1 - dive) + ky * dive;
  return (
    <AbsoluteFill style={{background: INK}}>
      <Paper />
      <div style={{position: 'absolute', left: 960, top: 530, width: US.w * sc, height: US.h * sc, transform: `translate(${-cx * sc}px, ${-cy * sc}px) scale(${z})`, transformOrigin: `${cx * sc}px ${cy * sc}px`}}>
        <svg width={US.w * sc} height={US.h * sc} viewBox={`0 0 ${US.w} ${US.h}`}>
          {US.states.map((s) => <path key={s.name} d={s.d} fill={LAND} stroke={LAND_EDGE} strokeWidth={1.1 / z} />)}
          <path d={tx.d} fill={RED} fillOpacity={0.9 * fill * (1 - 0.7 * dive)} stroke="#fff" strokeWidth={2 / z} />
          <circle cx={kx} cy={ky} r={34 / z} fill={RED} opacity={0.9 * dive} />
          <circle cx={kx} cy={ky} r={(10 + 4 * Math.sin(fr / 6)) / z} fill="#fff" opacity={dive > 0.6 ? 1 : 0} />
          <circle cx={kx} cy={ky} r={(26 + 10 * ((fr % 40) / 40)) / z} fill="none" stroke="#fff" strokeWidth={2 / z} opacity={dive > 0.6 ? 1 - (fr % 40) / 40 : 0} />
        </svg>
      </div>
      <Tag text="East Texas oil field" sub="Found 1930" x={1040} y={470} at={Math.min(dur - 30, 100)} size={36} />
    </AbsoluteFill>
  );
};
// Texas with the two brothers pinned onto it.
const TexasBrothers: React.FC<{dur: number; bunkerAt: number; herbertAt: number}> = ({bunkerAt, herbertAt}) => {
  const fr = useCurrentFrame();
  const tx = US.states.find((s) => s.name === 'Texas')!;
  const [b0, b1] = [US.texasBounds[0], US.texasBounds[1]];
  const pad = 30, vb = `${b0[0] - pad} ${b0[1] - pad} ${b1[0] - b0[0] + pad * 2} ${b1[1] - b0[1] + pad * 2}`;
  const [dx, dy] = US.points.dallas;
  const push = 1 + 0.05 * ease(lin(fr, 0, 300));
  return (
    <AbsoluteFill style={{background: INK}}>
      <Paper />
      <div style={{position: 'absolute', left: 230, top: 90, width: 1000, height: 900, transform: `scale(${push})`}}>
        <svg width={1000} height={900} viewBox={vb} preserveAspectRatio="xMidYMid meet">
          {US.states.map((s) => <path key={s.name} d={s.d} fill={LAND} stroke={LAND_EDGE} strokeWidth={1.2} />)}
          <path d={tx.d} fill={RED} fillOpacity={0.85} stroke="#fff" strokeWidth={1.6} />
          <circle cx={dx} cy={dy} r={5} fill="#fff" />
        </svg>
      </div>
      <Print img="bf01/photos/bunker-sworn.jpg" x={1250} y={420} w={430} h={520} tilt={2.5} at={bunkerAt} from="right" objectPosition="40% 30%" />
      <Print img="bf01/photos/herbert-sworn.jpg" x={1640} y={560} w={430} h={520} tilt={-2.5} at={herbertAt} from="right" objectPosition="45% 30%" />
      <Tag text="Nelson Bunker Hunt" x={1060} y={720} at={bunkerAt + 12} size={30} />
      <Tag text="William Herbert Hunt" x={1450} y={860} at={herbertAt + 12} size={30} />
      <Tag text="Dallas" x={560} y={330} at={6} size={24} dark />
    </AbsoluteFill>
  );
};
// North Africa: Libya fills, the Sarir field gets a pin, then the stamp.
const MapLibya: React.FC<{dur: number; stampAt: number}> = ({stampAt}) => {
  const fr = useCurrentFrame();
  const ly = AF.countries.find((c) => c.id === '434')!;
  const [sx, sy] = AF.points.sarir;
  const fill = sp(fr - 8, 18, 140);
  const z = 1.0 + 0.35 * ease(lin(fr, 0, 120));
  return (
    <AbsoluteFill style={{background: '#0b1a24'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${sx}px ${sy}px`}}>
        <svg width={1920} height={1080}>
          {AF.countries.map((c) => <path key={c.id + c.name} d={c.d} fill={c.id === '434' ? LAND : '#2f3439'} stroke={LAND_EDGE} strokeWidth={1.2} />)}
          <path d={ly.d} fill={RED} fillOpacity={0.85 * fill} stroke="#fff" strokeWidth={2} />
          <circle cx={sx} cy={sy} r={9} fill="#fff" />
          <Ring cx={sx} cy={sy} rx={60} ry={46} at={24} color="#fff" width={5} />
        </svg>
      </div>
      <Tag text="Sarir oil field, Libya" sub="Bunker Hunt" x={1240} y={560} at={30} size={34} />
      <Stamp text="NATIONALIZED" sub="LIBYA · 1973" x={260} y={640} at={stampAt} />
    </AbsoluteFill>
  );
};
const TitleCard: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Foot src="bf01/clips/coinsBlack.mp4" dur={f(TITLE_LEN)} trim={9} grade="bw" from={1.1} to={1.16} />
      <AbsoluteFill style={{background: 'rgba(14,15,17,.55)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center'}}>
        <div style={{font: `500 30px ${MONO}`, letterSpacing: 14, color: '#7EC25A', opacity: lin(fr, 2, 10)}}>BUBBLE FILES · 01</div>
        <div style={{font: `400 170px/1 ${ANTON}`, color: '#fff', letterSpacing: 4, marginTop: 24, opacity: lin(fr, 8, 18), transform: `translateY(${(1 - ease(lin(fr, 8, 22))) * 30}px)`}}>THE HUNT BROTHERS</div>
        <div style={{font: `600 34px ${SANS}`, color: SILVER, letterSpacing: 6, marginTop: 26, opacity: lin(fr, 18, 28)}}>THE PLAN TO CORNER THE WORLD'S SILVER</div>
      </div>
    </AbsoluteFill>
  );
};
export const Counter: React.FC<{from: number; to: number; at: number; len: number}> = ({from, to, at, len}) => {
  const fr = useCurrentFrame();
  const v = from + (to - from) * ease(lin(fr, at, at + len));
  return (
    <div style={{position: 'absolute', right: 120, bottom: 120, textAlign: 'right', opacity: lin(fr, at - 6, at)}}>
      <div style={{font: `500 26px ${MONO}`, letterSpacing: 5, color: SILVER}}>SILVER · PER OUNCE</div>
      <div style={{font: `400 200px/1 ${ANTON}`, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 8px 30px rgba(0,0,0,.6)'}}>${v.toFixed(2)}</div>
    </div>
  );
};

// ---------- the edit ----------
export const BF01Part1: React.FC = () => {
  useFonts();
  const fr = useCurrentFrame();
  const t = fr / FPS;
  const melt = co(3) + 4.1;
  return (
    <AbsoluteFill style={{background: INK}}>
      {/* COLD OPEN */}
      <Shot from={0} to={co(2)} hard>{(d) => <>
        <AbsoluteFill style={{opacity: lin(useCurrentFrame(), 12, 40)}}><Foot src="hunt/clips/molten3.mp4" dur={d} grade="silver" rate={0.5} from={1.08} to={1.18} /></AbsoluteFill>
        <Tag text="January 1980" x={120} y={120} at={f(co(1)) + 2} size={38} />
        <Counter from={6} to={50} at={f(co(1)) + 10} len={f(4)} />
      </>}</Shot>
      <Shot from={co(2)} to={co(3)}>{(d) => <ChartUp dur={d} />}</Shot>
      <Shot from={co(3)} to={co(3) + 2.1}>{(d) => <Foot src="bf01/clips/silverChest.mp4" dur={d} trim={8} grade="warm" crop={1.14} />}</Shot>
      <Shot from={co(3) + 2.1} to={melt}>{(d) => <Foot src="bf01/clips/silverForks.mp4" dur={d} trim={1} grade="warm" crop={1.14} from={1.0} to={1.1} />}</Shot>
      <Shot from={melt} to={co(4)}>{(d) => <Foot src="hunt/clips/molten.mp4" dur={d} grade="silver" rate={0.6} from={1.05} to={1.12} />}</Shot>
      <Shot from={co(4)} to={co(5)}>{(d) => <Foot src="hunt/clips/floorWide.mp4" dur={d} grade="bw" from={1.0} to={1.08} />}</Shot>
      <Shot from={co(5)} to={TITLE_AT}>{(d) => <>
        <Backdrop src="hunt/clips/floorWide.mp4" />
        <Print img="bf01/photos/aba-silver.jpg" x={960} y={520} w={1180} h={782} tilt={-1.2} at={0} from="down" objectPosition="50% 50%" grade="grayscale(1) contrast(1.15)" zoom={0.05} />
        <Tag text="Nelson Bunker & William Herbert Hunt" sub="Dallas, Texas" x={140} y={860} at={10} size={34} />
        <FallLine at={f(co(6) - co(5)) + 6} />
        <div style={{position: 'absolute', right: 140, top: 120, background: RED, color: '#fff', font: `400 96px/1 ${ANTON}`, padding: '14px 26px 6px', opacity: lin(useCurrentFrame(), f(co(6) - co(5)) + 50, f(co(6) - co(5)) + 58)}}>−$1 BILLION+</div>
      </>}</Shot>

      {/* TITLE */}
      <Shot from={TITLE_AT} to={C1_AT} hard>{() => <TitleCard />}</Shot>

      {/* CHAPTER 1 · THE HUNTS */}
      <Shot from={C1_AT} to={c1(1)}>{() => <>
        <Paper />
        <Print img="bf01/photos/hl-hunt-1965.jpg" x={760} y={540} w={560} h={700} tilt={-1.5} at={0} from="up" objectPosition="50% 30%" />
        <Tag text="H. L. Hunt" sub="1889 – 1974 · oilman" x={1110} y={470} at={14} size={44} />
      </>}</Shot>
      <Shot from={c1(1)} to={c1(1) + 3.6}>{(d) => <Foot src="hunt/clips/derricks.mp4" dur={d} grade="bw" from={1.02} to={1.1} />}</Shot>
      <Shot from={c1(1) + 3.6} to={c1(2)}>{(d) => <MapEastTexas dur={d} />}</Shot>
      <Shot from={c1(2)} to={c1(3)}>{(d) => <>
        <Foot src="hunt/clips/pumpjackOld.mp4" dur={d} grade="bw" from={1.04} to={1.1} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(14,15,17,.75) 0%, rgba(14,15,17,.1) 60%)'}} />
        <Print img="bf01/photos/hl-hunt-1965.jpg" x={420} y={520} w={420} h={530} tilt={2} at={0} from="left" />
        <Tag text="One of the richest men in the world" sub="1950s" x={700} y={760} at={20} size={40} />
      </>}</Shot>
      <Shot from={c1(3)} to={c1(5)}>{(d) => <TexasBrothers dur={d} bunkerAt={f(c1(4) - c1(3))} herbertAt={f(c1(4) - c1(3) + 3.2)} />}</Shot>
      <Shot from={c1(5)} to={c1(6) + 2.2}>{() => <>
        <Paper />
        <Print img="bf01/photos/bunker-1985-crop.jpg" x={960} y={540} w={1240} h={900} tilt={-1} at={0} from="down" objectPosition="50% 40%" grade="grayscale(1) contrast(1.1)" zoom={0.08} />
        <Tag text="Bunker Hunt" sub="Racehorse owner · 1985" x={160} y={800} at={12} size={40} />
      </>}</Shot>
      <Shot from={c1(6) + 2.2} to={c1(6) + 4.2}>{(d) => <Foot src="bf01/clips/dunes.mp4" dur={d} trim={6} grade="bw" from={1.05} to={1.12} />}</Shot>
      <Shot from={c1(6) + 4.2} to={c1(9)}>{(d) => <MapLibya dur={d} stampAt={f(c1(8) - c1(6) - 4.2)} />}</Shot>
      <Shot from={c1(9)} to={c1(10)}>{() => <>
        <Backdrop src="bf01/clips/desertTrail.mp4" />
        <Print img="bf01/photos/bunker-sworn.jpg" x={960} y={540} w={620} h={760} tilt={1.5} at={0} from="up" objectPosition="45% 30%" zoom={0.1} />
      </>}</Shot>
      <Shot from={c1(10)} to={c1(11)}>{(d) => <Foot src="bf01/clips/desertTrail.mp4" dur={d} trim={2} grade="bw" from={1.04} to={1.12} />}</Shot>
      <Shot from={c1(11)} to={c1(11) + 2.8}>{(d) => <Foot src="bf01/clips/dollarHands.mp4" dur={d} grade="bw" from={1.02} to={1.1} />}</Shot>
      <Shot from={c1(11) + 2.8} to={c1(12)}>{() => <>
        <Backdrop src="bf01/clips/usMint.mp4" trim={6} />
        <Print img="bf01/photos/Richard_Nixon_presidential_portrait.jpg" x={640} y={540} w={540} h={680} tilt={-2} at={0} from="left" objectPosition="50% 25%" />
        <Tag text="Aug 15, 1971" sub="Nixon cuts the dollar's link to gold" x={980} y={470} at={10} size={46} />
      </>}</Shot>
      <Shot from={c1(12)} to={END}>{(d) => <Foot src="bf01/clips/coinsBlack.mp4" dur={d} trim={9} grade="bw" from={1.0} to={1.12} />}</Shot>

      <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 50%, transparent 60%, rgba(0,0,0,.45) 100%)', pointerEvents: 'none'}} />
      <AnimatedGrain f={fr * 2} opacity={0.22} />

      {/* SOUND */}
      <Audio src={staticFile('bf01/vo/00-cold-open.wav')} />
      <Sequence from={f(C1_AT)} layout="none"><Audio src={staticFile('bf01/vo/01-the-hunts.wav')} /></Sequence>
      <Audio src={staticFile('bf01/music/silent-descent.mp3')} trimBefore={40 * FPS}
        volume={(x) => 0.32 * lin(x, 0, 30) * (1 - lin(x, f(TITLE_AT) - 6, f(TITLE_AT) + 4))} />
      <Sequence from={f(TITLE_AT) + 10} layout="none">
        <Audio src={staticFile('bf01/music/188.mp3')} trimBefore={14 * FPS}
          volume={(x) => 0.26 * lin(x, 0, 45) * (1 - lin(x, f(END - TITLE_AT) - 60, f(END - TITLE_AT) - 10))} />
      </Sequence>
      <Sequence from={f(TITLE_AT)} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.7} /></Sequence>
      {[co(2), co(3), co(4), co(5), c1(1), c1(3), c1(6) + 4.2, c1(11)].map((s, i) => (
        <Sequence key={i} from={Math.max(0, f(s) - 3)} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.18} /></Sequence>
      ))}
      <Sequence from={f(c1(8))} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.7} /></Sequence>
      {t < 0 && null}
    </AbsoluteFill>
  );
};
