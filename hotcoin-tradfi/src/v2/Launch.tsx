import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {DISPLAY, MONO, useFontsReady} from '../alt/shared';
import {Cursor, clamp, ease, mix} from '../alt/kit';
import {soundFor} from '../soundmap';
import {DesktopHome, DesktopTrade, PhoneMarkets, PhonePredict, UI} from '../platform/ui';

// Hotcoin, v2 "Launch". 4:5, 60 fps, 40 s. Real footage (NASA 1969, Prelinger 1941 / 1960s, Pexels, Pixabay)
// cut hard on the beat of "Rising Forest" (Mixkit, 124 BPM) with the rebuilt Hotcoin UI in glass.
export const LAUNCH_DURATION = 2400;
const BEAT = 3600 / 124; // frames per beat at 60 fps
const b = (k: number) => k * BEAT;
const cut = (k: number) => Math.round(b(k)) - 2; // hard cuts lead the beat by two frames
const MUSIC_START_S = 0.242 + 20 * 4 * (60 / 124); // track bar 20: the breakdown, so the drop lands on beat 16

// ---------------------------------------------------------------- shots
type Shot = {k0: number; k1: number; src: string; trim?: number; pos?: string; blur?: 'x' | 'y'; dark?: number; mono?: boolean};
const SHOTS: Shot[] = [
  {k0: 0, k1: 2, src: 'cal1941', pos: '50% 40%', mono: true},
  {k0: 2, k1: 4, src: 'ticker1941', mono: true},
  {k0: 4, k1: 6, src: 'floor60s', blur: 'x'},
  {k0: 6, k1: 8, src: 'floortop', blur: 'y'},
  {k0: 8, k1: 10, src: 'pad', trim: 1.5},
  {k0: 10, k1: 12, src: 'ignite1', blur: 'y'},
  {k0: 12, k1: 14, src: 'ignite2'},
  {k0: 14, k1: 16, src: 'pad', trim: 5.4, blur: 'y'},
  {k0: 16, k1: 19, src: 'liftoff', dark: 0.38},
  {k0: 19, k1: 21, src: 'flame', blur: 'y', dark: 0.3},
  {k0: 21, k1: 22, src: 'ascent', trim: 1, blur: 'y'},
  {k0: 22, k1: 28, src: 'coin', pos: '50% 50%'},
  {k0: 28, k1: 34, src: 'goldfire', dark: 0.72},
  {k0: 34, k1: 40, src: 'city', dark: 0.25, blur: 'x'},
  {k0: 40, k1: 46, src: 'crucible', dark: 0.2, blur: 'y'},
  {k0: 46, k1: 49, src: 'wildfire', dark: 0.1},
  {k0: 49, k1: 50, src: 'lightning'},
  {k0: 50, k1: 52, src: 'wildfire', trim: 3, dark: 0.55, blur: 'y'},
  {k0: 52, k1: 58, src: 'cash', dark: 0.35, blur: 'x'},
  {k0: 58, k1: 64, src: 'ascent', trim: 2, dark: 0.45},
  {k0: 64, k1: 70, src: 'flames', dark: 0.0, blur: 'y'},
];

// Every shot enters already moving (exponential ease-out of a push) and leaves on an accelerating, blurred move.
const ShotLayer: React.FC<{s: Shot; f: number; id: number}> = ({s, f, id}) => {
  const a = cut(s.k0), z = cut(s.k1);
  if (f < a || f >= z) return null;
  const t = f - a, left = z - f;
  const push = 1.04 + 0.12 * Math.exp(-t / 16) + t * 0.0009;
  const exitK = interpolate(left, [0, 6], [1, 0], clamp) ** 2;
  const blur = exitK * 14;
  const shift = exitK * 60;
  const dir = s.blur ?? 'y';
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={`sb${id}`}><feGaussianBlur stdDeviation={dir === 'x' ? `${blur} 0.01` : `0.01 ${blur}`} /></filter>
      </svg>
      <Sequence from={a} layout="none">
        <OffthreadVideo src={staticFile(`v2/seg/${s.src}.mp4`)} trimBefore={Math.round((s.trim ?? 0) * 60)} muted style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.pos ?? '50% 50%',
          transform: `scale(${push}) translate${dir === 'x' ? 'X' : 'Y'}(${-shift}px)`,
          filter: `${blur > 0.2 ? `url(#sb${id}) ` : ''}${s.mono ? 'contrast(1.15) brightness(1.05)' : 'contrast(1.08) saturate(1.05)'}`,
        }} />
      </Sequence>
      {s.dark ? <AbsoluteFill style={{background: `rgba(8,9,11,${s.dark})`}} /> : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- type
const W: React.CSSProperties = {fontFamily: DISPLAY, color: '#FFFFFF', letterSpacing: -3, lineHeight: 0.92, textTransform: 'uppercase', textAlign: 'center'};

// Giant words that rise in line by line with a short blur, and leave upward with a blur ramp.
const Big: React.FC<{f: number; k0: number; k1: number; lines: string[]; size: number; y?: number; color?: string}> = ({f, k0, k1, lines, size, y = 675, color = '#fff'}) => {
  const a = cut(k0) + 2, z = cut(k1);
  if (f < a - 1 || f >= z) return null;
  size = Math.min(size, 990 / (Math.max(...lines.map((l) => l.length)) * 0.78));
  const h = size * 0.95;
  const top = y - (lines.length * h) / 2;
  return (
    <>
      {lines.map((ln, i) => {
        const t = f - a - i * 3;
        const inK = 1 - Math.exp(-Math.max(0, t) / 5);
        const outK = interpolate(z - f, [0, 7], [1, 0], clamp) ** 2;
        const ty = (1 - inK) * h * 0.9 - outK * 80;
        const bl = (1 - inK) * 10 + outK * 16;
        return (
          <div key={i} style={{position: 'absolute', left: 0, width: 1080, top: top + i * h, height: h, overflow: 'hidden'}}>
            <div style={{...W, color, fontSize: size, height: h, lineHeight: `${h}px`, transform: `translateY(${ty}px)`, filter: bl > 0.3 ? `blur(${bl}px)` : undefined, textShadow: '0 6px 40px rgba(0,0,0,0.35)'}}>{ln}</div>
          </div>
        );
      })}
    </>
  );
};

// Giant words cut out of a moving picture: the footage only shows inside the letters.
const FilledWords: React.FC<{f: number; k0: number; k1: number; lines: string[]; size: number; src: string; trim?: number}> = ({f, k0, k1, lines, size, src, trim = 0}) => {
  const a = cut(k0), z = cut(k1);
  if (f < a || f >= z) return null;
  const t = f - a;
  const s = 1.25 - 0.2 * (1 - Math.exp(-t / 10));
  const outK = interpolate(z - f, [0, 7], [1, 0], clamp) ** 2;
  size = Math.min(size, 1000 / (Math.max(...lines.map((l) => l.length)) * 0.78));
  const h = size * 0.95, top = 675 - (lines.length * h) / 2;
  return (
    <AbsoluteFill style={{isolation: 'isolate', transform: `scale(${s})`, filter: outK > 0.02 ? `blur(${outK * 14}px)` : undefined}}>
      <Sequence from={a} layout="none">
        <OffthreadVideo src={staticFile(`v2/seg/${src}.mp4`)} trimBefore={Math.round(trim * 60)} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.3) contrast(1.1) brightness(1.55)'}} />
      </Sequence>
      <AbsoluteFill style={{background: '#000', mixBlendMode: 'multiply'}}>
        {lines.map((ln, i) => <div key={i} style={{...W, position: 'absolute', left: 0, width: 1080, top: top + i * h, fontSize: size, lineHeight: `${h}px`, color: '#fff'}}>{ln}</div>)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Small: React.FC<{f: number; k0: number; k1: number; y: number; children: React.ReactNode; size?: number}> = ({f, k0, k1, y, children, size = 28}) => {
  const a = cut(k0) + 4, z = cut(k1);
  if (f < a || f >= z) return null;
  const inK = 1 - Math.exp(-(f - a) / 6);
  return <div style={{position: 'absolute', left: 0, width: 1080, top: y + (1 - inK) * 20, textAlign: 'center', fontFamily: MONO, fontWeight: 500, fontSize: size, letterSpacing: 4, color: 'rgba(255,255,255,0.86)', textTransform: 'uppercase', filter: inK < 0.9 ? `blur(${(1 - inK) * 6}px)` : undefined}}>{children}</div>;
};

// ---------------------------------------------------------------- glass
const glass = (r: number): React.CSSProperties => ({
  borderRadius: r, overflow: 'hidden', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(28px) saturate(1.5)',
  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.35), inset 0 0 0 1px rgba(255,255,255,0.14), 0 60px 120px rgba(0,0,0,0.55)',
});
const Sheen: React.FC<{f: number; r: number}> = ({f, r}) => (
  <div style={{position: 'absolute', inset: 0, borderRadius: r, pointerEvents: 'none', background: `linear-gradient(115deg, rgba(255,255,255,0) ${20 + (f % 240) / 6}%, rgba(255,255,255,0.10) ${30 + (f % 240) / 6}%, rgba(255,255,255,0) ${42 + (f % 240) / 6}%)`}} />
);
const PhoneFrame: React.FC<{x: number; y: number; w: number; children: React.ReactNode; f: number}> = ({x, y, w, children, f}) => {
  const h = w * (806 / 390), k = w / 390;
  return (
    <div style={{position: 'absolute', left: x - 11, top: y - 11, width: w + 22, height: h + 22, borderRadius: 58, background: 'linear-gradient(135deg, #3A3B40 0%, #121316 45%, #2A2B2F 100%)', boxShadow: '0 70px 120px rgba(0,0,0,0.6), inset 0 0 0 1.5px rgba(255,255,255,0.14)'}}>
      <div style={{position: 'absolute', left: 11, top: 11, width: w, height: h, borderRadius: 48, overflow: 'hidden', background: UI.bg}}>
        <div style={{width: 390, height: 806, transform: `scale(${k})`, transformOrigin: '0 0'}}>{children}</div>
        <Sheen f={f} r={48} />
      </div>
    </div>
  );
};
const riseIn = (f: number, at: number, dist = 900) => dist * Math.exp(-Math.max(0, f - at) / 9);

// ---------------------------------------------------------------- UI scenes
const TradeScene: React.FC<{f: number}> = ({f}) => {
  const a = cut(28), z = cut(34);
  if (f < a || f >= z) return null;
  const rise = riseIn(f, a, 700);
  const push = 1 + (f - a) * 0.0006;
  const k = 1.4;
  const offX = 940 - 24 - 1420 * k, offY = 10 - 130 * k;
  const click = cut(30.5), toast = cut(31);
  const bx = 70 + offX + 1235 * k, by = 250 + rise + offY + 806 * k;
  const press = interpolate(f - click, [-3, 0, 8], [0, 1, 0], clamp);
  const t = spring({frame: f - toast, fps: 60, config: {damping: 15, stiffness: 190}});
  const outK = interpolate(z - f, [0, 7], [1, 0], clamp) ** 2;
  return (
    <AbsoluteFill style={{transform: `scale(${push}) translateY(${-outK * 120}px)`, filter: outK > 0.02 ? `blur(${outK * 12}px)` : undefined}}>
      <div style={{position: 'absolute', left: 70, top: 250 + rise, width: 940, height: 1040, ...glass(44)}}>
        <div style={{position: 'absolute', left: offX, top: offY, width: 1440, height: 900, transform: `scale(${k})`, transformOrigin: '0 0'}}>
          <DesktopTrade f={f} s={{draw: 1, mode: 0, press, loading: f < click + 3 ? 0 : f < toast - 4 ? 0.5 : 1, toast: 0}} />
        </div>
        <Sheen f={f} r={44} />
      </div>
      {f >= toast && (
        <div style={{position: 'absolute', left: 540 - 250, top: 290 + (1 - t) * -60, width: 500, height: 84, borderRadius: 42, ...glass(42), background: 'rgba(30,31,35,0.72)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: UI.font, fontSize: 26, fontWeight: 500, color: '#fff', transform: `scale(${0.8 + 0.2 * t})`}}>
          <span style={{width: 34, height: 34, borderRadius: 17, background: UI.up, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700}}>✓</span>
          Order placed successfully
        </div>
      )}
      {f < toast + 20 && <Cursor x={mix(bx + 260, bx, 1 - Math.exp(-Math.max(0, f - a - 20) / 14))} y={mix(by + 200, by, 1 - Math.exp(-Math.max(0, f - a - 20) / 14))} press={press} />}
    </AbsoluteFill>
  );
};

const PhoneScene: React.FC<{f: number; k0: number; k1: number; kind: 'tradfi' | 'predict'; tapK: number}> = ({f, k0, k1, kind, tapK}) => {
  const a = cut(k0), z = cut(k1);
  if (f < a || f >= z) return null;
  const rise = riseIn(f, a, 900);
  const tilt = 8 * Math.exp(-(f - a) / 14);
  const outK = interpolate(z - f, [0, 7], [1, 0], clamp) ** 2;
  const tap = cut(tapK);
  const w = 430, x = 540 - w / 2, y = 420 + rise;
  const tp = kind === 'tradfi' ? {x: 120, y: 280} : {x: 106, y: 495};
  const tx = x + tp.x * (w / 390), ty = y + tp.y * (w / 390);
  const dot = interpolate(f - tap, [-12, -2, 0, 4, 20], [0, 1, 0.8, 1, 0], clamp);
  return (
    <AbsoluteFill style={{transform: `perspective(1600px) rotateX(${tilt}deg) translateY(${-outK * 160}px)`, filter: outK > 0.02 ? `blur(${outK * 12}px)` : undefined}}>
      <PhoneFrame x={x} y={y} w={w} f={f}>
        {kind === 'tradfi'
          ? <PhoneMarkets f={f} switchAt={-100} tapRow={0} tapAt={tap} />
          : <PhonePredict f={f} market="BTC" pick={f >= tap ? 1 : 0} share={mix(50, 62, ease(f, tap + 2, tap + 40))} flip={0} />}
      </PhoneFrame>
      {dot > 0.01 && <div style={{position: 'absolute', left: tx - 24, top: ty - 24, width: 48, height: 48, borderRadius: 24, background: 'rgba(255,255,255,0.8)', transform: `scale(${dot})`, boxShadow: '0 4px 14px rgba(0,0,0,0.3)'}} />}
    </AbsoluteFill>
  );
};

const DevicesScene: React.FC<{f: number}> = ({f}) => {
  const a = cut(58), z = cut(64);
  if (f < a || f >= z) return null;
  const rise = riseIn(f, a, 700), rise2 = riseIn(f, a + 8, 900);
  const outK = interpolate(z - f, [0, 7], [1, 0], clamp) ** 2;
  const lw = 820, lh = lw * (900 / 1440);
  return (
    <AbsoluteFill style={{transform: `translateY(${-outK * 140}px)`, filter: outK > 0.02 ? `blur(${outK * 12}px)` : undefined}}>
      <div style={{position: 'absolute', left: 60, top: 400 + rise, width: lw, height: lh, ...glass(22), background: UI.bg, border: '12px solid #17181B'}}>
        <div style={{width: 1440, height: 900, transform: `scale(${(lw - 24) / 1440})`, transformOrigin: '0 0'}}><DesktopHome f={f} scroll={0} hover={-1} hoverAt={[]} /></div>
        <Sheen f={f} r={22} />
      </div>
      <PhoneFrame x={700} y={520 + rise2} w={300} f={f}><PhoneMarkets f={f} switchAt={-100} tapRow={-1} tapAt={9999} /></PhoneFrame>
      {['iOS', 'Android', 'Mac', 'Windows'].map((p, i) => {
        const at = cut(59 + i * 0.75);
        const s = spring({frame: f - at, fps: 60, config: {damping: 13, stiffness: 230}});
        if (f < at) return null;
        return <div key={p} style={{position: 'absolute', left: 115 + i * 220, top: 1190 + (1 - s) * 60, width: 190, height: 64, borderRadius: 32, ...glass(32), background: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UI.font, fontWeight: 600, fontSize: 26, color: '#fff', transform: `scale(${0.85 + 0.15 * s})`}}>{p}</div>;
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- end card
const EndCard: React.FC<{f: number}> = ({f}) => {
  const a = cut(70);
  if (f < a) return null;
  const t = f - a;
  const w = 540 + 1110 * Math.exp(-t / 3.2) - Math.min(t, 240) * 0.08;
  const h = w * (93 / 485);
  const smear = Math.exp(-t / 4);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(60% 45% at 50% 46%, #26272A 0%, #0A0A0C 60%, #020204 100%)'}}>
      {new Array(18).fill(0).map((_, i) => {
        const sc = 1 + (i + 1) * 0.06 * smear;
        return smear > 0.03 ? <Img key={i} src={staticFile('brand/logo.png')} style={{position: 'absolute', left: 540 - (w * sc) / 2, top: 600 - (h * sc) / 2, width: w * sc, height: h * sc, opacity: 0.08 * (1 - i / 18) * smear * 3}} /> : null;
      })}
      <Img src={staticFile('brand/logo.png')} style={{position: 'absolute', left: 540 - w / 2, top: 600 - h / 2, width: w, height: h, filter: `blur(${smear * 6}px) drop-shadow(0 0 18px rgba(151,231,99,0.35)) drop-shadow(0 0 60px rgba(255,255,255,0.12))`}} />
      <Small f={f} k0={72} k1={200} y={690} size={30}>Built for traders</Small>
      <Small f={f} k0={73} k1={200} y={770} size={40}>hotcoin.com</Small>
      <Small f={f} k0={75} k1={200} y={1250} size={18}>Trading involves risk. T&amp;C apply.</Small>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- film
export const Launch: React.FC = () => {
  useFontsReady();
  const f = useCurrentFrame();
  const flash = interpolate(f, [cut(16) - 6, cut(16), cut(16) + 10], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#050506', overflow: 'hidden'}}>
      {SHOTS.map((s, i) => <ShotLayer key={i} s={s} f={f} id={i} />)}
      <AbsoluteFill style={{background: 'radial-gradient(90% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />

      <Big f={f} k0={0} k1={3.8} lines={['Markets ran', 'on paper.']} size={132} />
      <Big f={f} k0={4} k1={7.8} lines={['Then on', 'the floor.']} size={140} />
      {['3', '2', '1'].map((n, i) => <Big key={n} f={f} k0={8 + i * 2} k1={9.8 + i * 2} lines={[n]} size={520} />)}
      <Small f={f} k0={14} k1={16} y={1180}>Ignition</Small>
      <Big f={f} k0={16} k1={21.8} lines={['Built for', 'traders.']} size={170} />

      <FilledWords f={f} k0={22} k1={27.8} lines={['Zero', 'fees']} size={330} src="goldfire" />
      <Small f={f} k0={23} k1={27.8} y={1150}>On Spot crypto · T&amp;C apply</Small>

      <TradeScene f={f} />
      <Big f={f} k0={28} k1={30.8} lines={['Spot + Futures.']} size={96} y={150} />
      <Big f={f} k0={31} k1={33.8} lines={['One account.']} size={110} y={150} />

      <Big f={f} k0={34} k1={36.8} lines={['US', 'stocks.']} size={260} />
      <PhoneScene f={f} k0={37} k1={40} kind="tradfi" tapK={38.5} />
      <Big f={f} k0={37} k1={39.8} lines={['From 10 USDT.']} size={104} y={170} />
      <Small f={f} k0={37.5} k1={39.8} y={250} size={22}>On selected TradFi products</Small>

      <Big f={f} k0={40} k1={45.8} lines={['Gold.']} size={230} y={430} />
      <Big f={f} k0={41.5} k1={45.8} lines={['Silver.']} size={230} y={675} />
      <Big f={f} k0={43} k1={45.8} lines={['ETFs.']} size={230} y={920} />

      <FilledWords f={f} k0={46} k1={49} lines={['Predict']} size={250} src="goldfire" trim={2.5} />
      <PhoneScene f={f} k0={50} k1={52} kind="predict" tapK={50.8} />
      <Big f={f} k0={50} k1={51.8} lines={['Up or down.']} size={110} y={170} />

      <Big f={f} k0={52} k1={53.8} lines={['8.1M+', 'traders']} size={210} />
      <Big f={f} k0={54} k1={55.8} lines={['120+', 'countries']} size={200} />
      <Big f={f} k0={56} k1={57.8} lines={['Since', '2017']} size={230} />

      <DevicesScene f={f} />
      <Big f={f} k0={58} k1={63.8} lines={['Trade anywhere.']} size={100} y={220} />

      <FilledWords f={f} k0={64} k1={70} lines={['9 years', 'of focus.']} size={200} src="liftoff" trim={0.5} />

      <EndCard f={f} />
      {flash > 0.01 && <AbsoluteFill style={{background: '#FFF6E8', opacity: flash}} />}
      <Grain f={f} />
      <Sound />
    </AbsoluteFill>
  );
};

const Grain: React.FC<{f: number}> = ({f}) => {
  const n = Math.floor(f / 2), r = (s: number) => {const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};
  return <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', backgroundPosition: `${r(n) * 384}px ${r(n + 99) * 384}px`, mixBlendMode: 'overlay', opacity: 0.28}} />;
};

// ---------------------------------------------------------------- sound
const WHOOSH_AT = [4, 8, 16, 22, 28, 34, 40, 46, 52, 58, 64, 70];
const Sound: React.FC = () => {
  const cues: [number, string, number][] = [
    ...WHOOSH_AT.map((k) => [Math.max(0, cut(k) - 14), 'swipe', 0.8] as [number, string, number]),
    [cut(14.5), 'expand', 1.4], [cut(16), 'success', 1.2], [cut(22), 'collapse', 0.9],
    [cut(30.5), 'press', 1], [cut(31), 'snap', 0.8], [cut(38.5), 'press', 0.7], [cut(50.8), 'press', 0.7],
    [cut(52), 'collapse', 0.8], [cut(54), 'collapse', 0.8], [cut(56), 'collapse', 0.8],
    ...[0, 1, 2, 3].map((i) => [cut(59 + i * 0.75), 'snap', 0.6] as [number, string, number]),
    [cut(70), 'success', 1.1],
  ];
  return (
    <>
      <Audio src={staticFile('music/rising-forest.mp3')} trimBefore={Math.round(MUSIC_START_S * 60)} volume={(fr) => 0.7 * interpolate(fr, [LAUNCH_DURATION - 60, LAUNCH_DURATION - 2], [1, 0], clamp)} />
      <Sequence from={cut(15)} durationInFrames={Math.round(b(9))} layout="none">
        <Audio src={staticFile('v2/rocket.wav')} trimBefore={60} volume={(fr) => 0.9 * interpolate(fr, [0, 20, b(6), b(9)], [0, 1, 0.8, 0], clamp)} />
      </Sequence>
      {cues.map(([fr, cue, vol], i) => {
        const s = soundFor(cue, vol);
        return <Sequence key={i} from={fr} durationInFrames={120} layout="none"><Audio src={staticFile(s.src)} volume={Math.min(1, s.volume * 1.3)} /></Sequence>;
      })}
    </>
  );
};

