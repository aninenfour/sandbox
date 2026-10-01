// Memecoin history, about 30 s at 148 BPM ("Head Bang", Mixkit). One green line runs through every era,
// changes its shape to match each one, and ends as the green dot in the Hotcoin logo.
// Every photo is stock (Pexels). Coins appear as tickers only, with no brand logos and no real people.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {AnimatedGrain, IN, OUT, clamp, ease, sp} from '../alt/kit';

export const BEAT = 3600 / 148;
const at = (k: number) => Math.round(k * BEAT);
const cut = (k: number) => Math.max(0, at(k) - 2);
const E = (k: number) => at(k) - 2; // visual events lead the beat by two frames
export const MEME_DURATION = at(74);
const MUSIC_START_S = 0.017 + 12 * 4 * (60 / 148); // track bar 12, so its drop lands on film beat 16
const LINE = '#AAFF73'; // sampled from the green dot in public/brand/logo.png
const INK = '#0B0E11';

const F = {
  comic: '"Comic Neue", cursive', pixel: '"Press Start 2P", monospace', bang: 'Bangers, sans-serif', neon: 'Monoton, sans-serif',
  goth: 'UnifrakturMaguntia, serif', bungee: 'Bungee, sans-serif', rmono: '"Rubik Mono One", sans-serif', shrik: 'Shrikhand, serif',
  bowl: '"Bowlby One", sans-serif', bubble: '"Rubik Bubbles", sans-serif', vt: 'VT323, monospace', anton: 'Anton, sans-serif',
  arch: '"Archivo Black", sans-serif', mono: '"IBM Plex Mono", monospace', serif: '"Instrument Serif", serif', ui: 'Roboto, sans-serif',
};

const useMemeFonts = () => {
  const [h] = useState(() => delayRender('meme fonts'));
  useEffect(() => {
    const specs = ['700 80px "Comic Neue"', '400 40px "Press Start 2P"', '400 80px Bangers', '400 80px Monoton', '400 80px UnifrakturMaguntia',
      '400 80px Bungee', '400 40px "Rubik Mono One"', '400 80px Shrikhand', '400 80px "Bowlby One"', '400 80px "Rubik Bubbles"', '400 80px VT323',
      '400 80px Anton', '400 80px "Archivo Black"', '500 40px "IBM Plex Mono"', 'italic 400 80px "Instrument Serif"', '400 30px Roboto', '500 30px Roboto', '700 30px Roboto'];
    Promise.all(specs.map((s) => document.fonts.load(s))).then(() => continueRender(h));
  }, [h]);
};

// Motion helpers. pop() is a spring with overshoot from beat k; inn() a fast ease-out from beat k.
const pop = (fr: number, k: number, d = 10, s = 260) => (fr < E(k) ? 0 : sp(fr - E(k), d, s));
const inn = (fr: number, k: number, len = 9) => ease(fr, E(k), E(k) + len);
const pulse = (fr: number) => {const b = (fr + 2) / BEAT; return Math.exp(-(b - Math.floor(b)) * 5);};
const shown = (fr: number, k: number) => fr >= E(k);

// ---------- the green line ----------
type Pt = [number, number];
type LineSpec = {k0: number; k1: number; pts: Pt[]; w: number; outline?: string; ow?: number; glow?: number; square?: boolean; linear?: boolean};

const stairs = (x0: number, y0: number, x1: number, y1: number, n: number): Pt[] => {
  const pts: Pt[] = [[x0, y0]];
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * (i + 1)) / n, y = y0 + ((y1 - y0) * (i + 1)) / n;
    pts.push([x, pts[pts.length - 1][1]], [x, y]);
  }
  return pts;
};
const sample = (n: number, fn: (t: number) => Pt): Pt[] => Array.from({length: n + 1}, (_, i) => fn(i / n));
const loops = (yc: number, b: number, n: number): Pt[] => {
  const a = 1160 / (2 * Math.PI * n);
  return sample(260, (t) => {const th = t * 2 * Math.PI * n; return [-40 + a * th - b * Math.sin(th), yc - b * Math.cos(th)];});
};

const LINES: LineSpec[] = [
  {k0: 0, k1: 8, pts: stairs(-40, 1215, 1120, 1065, 9), w: 16, outline: '#000', ow: 5, square: true},
  {k0: 8, k1: 16, pts: [[-40, 1060], [250, 1120], [470, 965], [690, 1050], [905, 900], [1120, 935]], w: 16, outline: '#000', ow: 8},
  {k0: 16, k1: 24, pts: [[-40, 1250], [700, 1250], [745, 1150], [780, 1185], [830, 930], [860, 965], [905, 640], [935, 675], [985, 260], [1010, -100]], w: 14, glow: 22},
  {k0: 24, k1: 30, pts: sample(160, (t) => [-40 + 1160 * t, 820 - 46 * Math.sin(t * Math.PI * 4)]), w: 13, outline: '#FF3EDB', ow: 6, glow: 14},
  {k0: 30, k1: 38, pts: loops(930, 105, 3), w: 18, outline: '#FFFFFF', ow: 9},
  {k0: 38, k1: 44, pts: [[-40, 820], [1120, 820]], w: 5, glow: 16, linear: true},
  {k0: 44, k1: 52, pts: sample(160, (t) => [-40 + 1160 * t, 1245 - 1345 * Math.pow(t, 4)]), w: 14, glow: 20},
  {k0: 52, k1: 55, pts: [[-40, 1185], [1120, 1185]], w: 16, outline: INK, ow: 6},
  {k0: 55, k1: 58, pts: [[-40, 1185], [1120, 1185]], w: 16, outline: INK, ow: 6},
  {k0: 58, k1: 60, pts: [[-40, 1185], [1120, 1185]], w: 16, outline: INK, ow: 8},
  {k0: 60, k1: 66, pts: [[-40, 372], [1120, 372]], w: 8, glow: 14},
];
// End card geometry: the logo is 485 x 93 with its green dot centred at (70, 71), radius 14.5.
const LOGO_W = 620, LOGO_S = LOGO_W / 485, LOGO_X = 540 - LOGO_W / 2, LOGO_Y = 610;
const DOT: Pt = [LOGO_X + 70 * LOGO_S, LOGO_Y + 71 * LOGO_S];
const DOT_R = 14.5 * LOGO_S;

const cumOf = (pts: Pt[]) => pts.reduce<number[]>((acc, p, i) => {acc.push(i ? acc[i - 1] + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0); return acc;}, []);
const pointAt = (pts: Pt[], cum: number[], L: number): Pt => {
  let i = 1; while (i < pts.length - 1 && cum[i] < L) i++;
  const t = Math.min(1, Math.max(0, (L - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1])));
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
};
const segment = (pts: Pt[], cum: number[], a: number, b: number): Pt[] => {
  const out: Pt[] = [pointAt(pts, cum, a)];
  pts.forEach((p, i) => {if (cum[i] > a && cum[i] < b) out.push(p);});
  out.push(pointAt(pts, cum, b));
  return out;
};

const Stroke: React.FC<{pts: Pt[]; spec: Pick<LineSpec, 'w' | 'outline' | 'ow' | 'glow' | 'square'>; head: number; color?: string}> = ({pts, spec, head, color = LINE}) => {
  const d = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const cap = spec.square ? 'square' : 'round', join = spec.square ? 'miter' : 'round';
  const h = pts[pts.length - 1];
  return (
    <svg width={1080} height={1350} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: spec.glow ? `drop-shadow(0 0 ${spec.glow}px ${color}) drop-shadow(0 0 ${spec.glow / 3}px ${color})` : undefined}}>
      {spec.outline ? <polyline points={d} fill="none" stroke={spec.outline} strokeWidth={spec.w + 2 * (spec.ow ?? 4)} strokeLinecap={cap} strokeLinejoin={join} /> : null}
      <polyline points={d} fill="none" stroke={color} strokeWidth={spec.w} strokeLinecap={cap} strokeLinejoin={join} />
      {head > 0 ? (
        spec.square
          ? <rect x={h[0] - head} y={h[1] - head} width={head * 2} height={head * 2} fill={color} stroke={spec.outline} strokeWidth={spec.ow} />
          : <circle cx={h[0]} cy={h[1]} r={head} fill={color} stroke={spec.outline} strokeWidth={spec.outline ? spec.ow : 0} />
      ) : null}
    </svg>
  );
};

const GreenLine: React.FC<{fr: number}> = ({fr}) => {
  const spec = LINES.find((l) => fr >= cut(l.k0) && fr < cut(l.k1));
  if (spec) {
    const cum = cumOf(spec.pts), L = cum[cum.length - 1], n = spec.k1 - spec.k0;
    const b = Math.max(0, (fr - E(spec.k0)) / BEAT);
    // The line surges forward on every beat and holds between them; the cult chapter crawls instead.
    const s = spec.linear ? b : Math.floor(b) + OUT(Math.min(1, (b - Math.floor(b)) / 0.42));
    const p = Math.min(1, s / (n - 0.25));
    if (p <= 0) return null;
    return <Stroke pts={segment(spec.pts, cum, 0, p * L)} spec={spec} head={spec.w * 0.95} />;
  }
  if (fr >= cut(66)) {
    // Logo chapter: the line runs in, stops on the logo's dot, and its tail retracts into it.
    const pts: Pt[] = [[-40, DOT[1]], DOT], cum = cumOf(pts), L = cum[1];
    const head = ease(fr, E(66), E(68), OUT) * L;
    const tail = ease(fr, E(68), E(68) + 26, IN) * L;
    const r = interpolate(fr, [E(68), E(68) + 30], [12, DOT_R], {...clamp, easing: OUT});
    const fadeOut = interpolate(fr, [E(70), E(70) + 14], [1, 0], clamp);
    if (fadeOut <= 0) return null;
    return <AbsoluteFill style={{opacity: fadeOut}}><Stroke pts={segment(pts, cum, Math.min(tail, head - 0.01), head)} spec={{w: 12, glow: 16}} head={r} /></AbsoluteFill>;
  }
  return null;
};

// ---------- shared bits ----------
const Chapter: React.FC<{k0: number; k1: number; children: (fr: number) => React.ReactNode; punch?: number}> = ({k0, k1, children, punch = 0.07}) => {
  const fr = useCurrentFrame() + cut(k0);
  const s = 1 + punch * Math.exp(-(fr - cut(k0)) / 6);
  return <AbsoluteFill style={{transform: `scale(${s})`, overflow: 'hidden'}}>{children(fr)}</AbsoluteFill>;
};
const Clip: React.FC<{name: string; k0: number; trim?: number; style?: React.CSSProperties}> = ({name, k0, trim = 0, style}) => (
  <Sequence from={0} layout="none">
    <OffthreadVideo src={staticFile(`meme/${name}.mp4`)} trimBefore={trim} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style}} />
  </Sequence>
);
const sticker = (px: number, c = '#fff') => `drop-shadow(${px}px 0 0 ${c}) drop-shadow(-${px}px 0 0 ${c}) drop-shadow(0 ${px}px 0 ${c}) drop-shadow(0 -${px}px 0 ${c})`;
const outlineText = (px: number, c: string): React.CSSProperties => ({WebkitTextStroke: `${px}px ${c}`, paintOrder: 'stroke fill'});
const Abs: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>
);
const Photo: React.FC<{src: string; w: number; h: number; pos?: string; style?: React.CSSProperties}> = ({src, w, h, pos = 'center', style}) => (
  <Img src={staticFile(`meme/${src}`)} style={{width: w, height: h, objectFit: 'cover', objectPosition: pos, display: 'block', ...style}} />
);

// ---------- 2013: DOGE, the early web ----------
const Doge: React.FC<{fr: number}> = ({fr}) => {
  const words = [
    {k: 1, t: 'wow', x: 70, y: 300, c: '#FF3EDB', r: -10, s: 92},
    {k: 2, t: 'such coin', x: 640, y: 330, c: '#00F0FF', r: 7, s: 62},
    {k: 3, t: 'much internet', x: 40, y: 930, c: '#FFF200', r: -5, s: 60},
    {k: 4, t: 'very 2013', x: 650, y: 880, c: '#7CFF4F', r: 6, s: 64},
    {k: 5, t: 'so money', x: 60, y: 610, c: '#FF8A00', r: -9, s: 60},
    {k: 6, t: 'wow', x: 800, y: 620, c: '#FF3EDB', r: 12, s: 96},
  ];
  const win = pop(fr, 0, 11, 240), wa = pop(fr, 0.5, 9, 220);
  const twinkle = Math.floor((fr + 2) / BEAT) % 2;
  return (
    <AbsoluteFill style={{background: '#000080'}}>
      <AbsoluteFill style={{
        backgroundImage: ['radial-gradient(circle at 20px 30px, #fff 1.6px, transparent 2.4px)', 'radial-gradient(circle at 90px 80px, #fff 1.2px, transparent 2px)',
          'radial-gradient(circle at 60px 120px, #FFF200 1.4px, transparent 2.2px)'].join(','),
        backgroundSize: twinkle ? '140px 140px' : '150px 150px', opacity: 0.85,
      }} />
      <Abs x={50} y={52}><div style={{fontFamily: F.pixel, fontSize: 34, color: '#FFF200', textShadow: '4px 4px 0 #FF3EDB'}}>2013</div></Abs>
      <Abs x={0} y={110} style={{width: 1080, textAlign: 'center', transform: `scale(${wa * (1 + 0.035 * pulse(fr))}) rotate(-4deg) skewX(-8deg)`}}>
        <span style={{
          fontFamily: F.comic, fontWeight: 700, fontSize: 150, letterSpacing: -4,
          background: 'linear-gradient(90deg,#FF0040,#FF8A00,#FFF200,#2BFF4F,#00C8FF,#7B3FF2,#FF3EDB)', WebkitBackgroundClip: 'text', color: 'transparent',
          filter: 'drop-shadow(4px 4px 0 #FFFFFF) drop-shadow(5px 5px 0 #000) drop-shadow(5px 5px 0 #333)',
        }}>DOGECOIN</span>
      </Abs>
      <Abs x={290} y={330} style={{transform: `translateY(${(1 - win) * 500}px) rotate(${-3 + (1 - win) * 8}deg)`}}>
        <div style={{width: 500, background: '#C0C0C0', padding: 6, borderTop: '4px solid #fff', borderLeft: '4px solid #fff', borderRight: '4px solid #404040', borderBottom: '4px solid #404040', boxShadow: '14px 14px 0 rgba(0,0,0,0.55)'}}>
          <div style={{height: 40, background: 'linear-gradient(90deg,#000080,#1084D0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px'}}>
            <span style={{fontFamily: F.vt, fontSize: 32, color: '#fff'}}>doge.jpg</span>
            <span style={{display: 'flex', gap: 5}}>{['_', '□', 'x'].map((c) => <span key={c} style={{width: 28, height: 26, background: '#C0C0C0', borderTop: '2px solid #fff', borderLeft: '2px solid #fff', borderRight: '2px solid #404040', borderBottom: '2px solid #404040', fontFamily: F.vt, fontSize: 24, lineHeight: '22px', textAlign: 'center'}}>{c}</span>)}</span>
          </div>
          <Photo src="doge.jpg" w={476} h={590} pos="50% 40%" style={{marginTop: 6}} />
        </div>
      </Abs>
      {words.map((w) => {
        const p = pop(fr, w.k, 8, 300);
        return p > 0 ? (
          <Abs key={w.k} x={w.x} y={w.y} style={{transform: `rotate(${w.r}deg) scale(${p})`, transformOrigin: 'left center'}}>
            <span style={{fontFamily: F.comic, fontWeight: 700, fontSize: w.s, color: w.c, textShadow: '3px 3px 0 #000, -1px -1px 0 #000'}}>{w.t}</span>
          </Abs>
        ) : null;
      })}
      <Abs x={640} y={1262}><span style={{fontFamily: F.vt, fontSize: 44, color: '#2BFF4F', background: '#000', padding: '2px 12px', border: '3px ridge #C0C0C0'}}>VISITORS 0069420</span></Abs>
    </AbsoluteFill>
  );
};

// ---------- 2020: SHIB and FLOKI, the manga era ----------
const Shib: React.FC<{fr: number}> = ({fr}) => {
  const rush = ease(fr, E(14), E(16), IN);
  const rot = (fr - cut(8)) * (0.25 + rush * 2.5);
  const shake = rush * 14;
  const sx = Math.sin(fr * 2.1) * shake, sy = Math.cos(fr * 2.7) * shake;
  const t = pop(fr, 8, 9, 280), p1 = pop(fr, 8.5, 11, 220), bub = pop(fr, 10, 8, 300), p2 = pop(fr, 12, 11, 240), fl = pop(fr, 13, 8, 300), yr = pop(fr, 9, 8, 300);
  return (
    <AbsoluteFill style={{transform: `translate(${sx}px,${sy}px) scale(${1 + rush * 0.16})`}}>
      <AbsoluteFill style={{background: `repeating-conic-gradient(from ${rot}deg at 50% 46%, #FFE14D 0deg 5deg, #FF6A00 5deg 11deg)`}} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle, rgba(140,20,0,0.35) 2.2px, transparent 2.6px)', backgroundSize: '12px 12px'}} />
      <Abs x={60} y={40} style={{transform: `scale(${t}) rotate(-5deg)`, transformOrigin: 'left top'}}>
        <span style={{fontFamily: F.bang, fontSize: 290, lineHeight: 1, color: '#fff', ...outlineText(16, '#000'), textShadow: '14px 14px 0 #000'}}>SHIB</span>
      </Abs>
      <Abs x={790} y={70} style={{transform: `scale(${yr}) rotate(10deg)`}}>
        <div style={{width: 230, height: 230, background: '#FF2D55', clipPath: 'polygon(50% 0%,61% 30%,95% 20%,72% 47%,100% 70%,64% 68%,57% 100%,43% 72%,8% 88%,30% 58%,0% 32%,36% 32%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <span style={{fontFamily: F.bang, fontSize: 64, color: '#fff'}}>2020</span>
        </div>
      </Abs>
      <Abs x={110} y={370} style={{transform: `translateX(${(1 - p1) * -900}px) rotate(-4deg)`}}>
        <div style={{border: '12px solid #000', boxShadow: '18px 18px 0 #000', background: '#000'}}><Photo src="shib.jpg" w={600} h={700} pos="50% 55%" /></div>
      </Abs>
      {bub > 0 ? (
        <Abs x={520} y={330} style={{transform: `scale(${bub}) rotate(5deg)`, transformOrigin: 'left bottom'}}>
          <div style={{background: '#fff', border: '8px solid #000', borderRadius: 40, padding: '10px 30px', boxShadow: '10px 10px 0 #000'}}>
            <span style={{fontFamily: F.bang, fontSize: 82, color: '#000'}}>THE DOGE KILLER?</span>
          </div>
        </Abs>
      ) : null}
      <Abs x={600} y={700} style={{transform: `translateX(${(1 - p2) * 800}px) rotate(5deg)`}}>
        <div style={{border: '12px solid #000', boxShadow: '18px 18px 0 #000', background: '#000'}}><Photo src="floki.jpg" w={400} h={470} pos="50% 35%" /></div>
      </Abs>
      {fl > 0 ? (
        <Abs x={560} y={1150} style={{transform: `scale(${fl}) rotate(-6deg)`}}>
          <span style={{fontFamily: F.bang, fontSize: 120, color: '#FFE14D', ...outlineText(12, '#000'), textShadow: '9px 9px 0 #000'}}>$FLOKI</span>
        </Abs>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 2021: TO THE MOON, the drop ----------
const Neon: React.FC<{t: string; size: number; on: number; fr: number; color?: string}> = ({t, size, on, fr, color = '#FF2D55'}) => {
  const age = fr - on;
  const flick = age < 0 ? 0 : age < 9 ? [1, 0.2, 1, 0.4, 1, 1, 0.3, 1, 1][age] : 1;
  return <span style={{fontFamily: F.neon, fontSize: size, lineHeight: 1, color: '#FFE6EC', opacity: flick, textShadow: `0 0 8px ${color}, 0 0 26px ${color}, 0 0 60px ${color}, 0 0 110px ${color}`}}>{t}</span>;
};
const Moon: React.FC<{fr: number}> = ({fr}) => {
  const slam = pop(fr, 16, 12, 200);
  const shake = Math.exp(-Math.max(0, fr - E(16)) / 7) * 22;
  const fw = ease(fr, E(20), E(20) + 8);
  return (
    <AbsoluteFill style={{background: '#050007', transform: `translate(${Math.sin(fr * 2.3) * shake}px,${Math.cos(fr * 1.9) * shake}px)`}}>
      <Clip name="laser" k0={16} trim={60} style={{filter: 'saturate(1.4) brightness(0.75) hue-rotate(-12deg)'}} />
      <AbsoluteFill style={{opacity: fw}}><Clip name="fireworks" k0={16} trim={80} style={{filter: 'saturate(1.5) brightness(0.9)'}} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,0,7,0.7) 0%, rgba(5,0,7,0.1) 45%, rgba(5,0,7,0.75) 100%)'}} />
      {shown(fr, 20) ? (
        <Abs x={0} y={560} style={{width: 1080, textAlign: 'center', opacity: 0.55 * inn(fr, 20, 6)}}>
          <span style={{fontFamily: F.anton, fontSize: 470, lineHeight: 1, color: 'transparent', WebkitTextStroke: '4px #FF2D55'}}>2021</span>
        </Abs>
      ) : null}
      <Abs x={60} y={70}><Neon t="TO" size={150} on={E(16)} fr={fr} /></Abs>
      <Abs x={340} y={70}><Neon t="THE" size={150} on={E(17)} fr={fr} /></Abs>
      <Abs x={50} y={250}><Neon t="MOON" size={225} on={E(18)} fr={fr} /></Abs>
      <Abs x={20} y={1350 - 700} style={{transform: `translateY(${(1 - slam) * 720}px)`}}>
        <Img src={staticFile('meme/shades-cut.png')} style={{height: 700, filter: 'drop-shadow(0 0 0 #000) drop-shadow(0 0 34px rgba(255,45,85,0.85))'}} />
      </Abs>
      {[{k: 20, t: 'DOGE ATH $0.73'}, {k: 21, t: 'SHIB ATH $0.000086'}].map((c, i) => {
        const p = pop(fr, c.k, 10, 280);
        return p > 0 ? (
          <Abs key={c.k} x={545} y={660 + i * 96} style={{transform: `translateX(${(1 - p) * 300}px)`, opacity: Math.min(1, p * 2)}}>
            <span style={{fontFamily: F.mono, fontWeight: 500, fontSize: 36, color: '#fff', padding: '10px 20px', border: '3px solid #FF2D55', borderRadius: 40, background: 'rgba(30,0,10,0.75)', boxShadow: '0 0 26px rgba(255,45,85,0.8)'}}>{c.t}</span>
          </Abs>
        ) : null;
      })}
    </AbsoluteFill>
  );
};

// ---------- 2023: PEPE, vaporwave chrome ----------
const chrome: React.CSSProperties = {
  background: 'linear-gradient(180deg,#FFFFFF 0%,#CFE3FF 38%,#5B3E8E 50%,#FF9AD8 54%,#FFF0FA 78%,#FFFFFF 100%)',
  WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 0 #2A0B4A) drop-shadow(0 0 24px rgba(255,62,219,0.6))',
};
const Pepe: React.FC<{fr: number}> = ({fr}) => {
  const t = pop(fr, 24, 10, 240), card = pop(fr, 24.5, 12, 200), feels = pop(fr, 26, 9, 280), yr = pop(fr, 27, 9, 280);
  const scroll = ((fr - cut(24)) * 4) % 80;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1A0638 0%,#5A1A8C 38%,#FF4FA3 64%,#FFB86B 61%,#1A0638 61.2%)'}}>
      <div style={{position: 'absolute', left: 540 - 270, top: 300, width: 540, height: 540, borderRadius: '50%', background: 'linear-gradient(180deg,#FFF36B 0%,#FF8A3D 45%,#FF3E9A 100%)',
        WebkitMaskImage: 'linear-gradient(180deg,#000 0%,#000 48%,transparent 48%,transparent 52%,#000 52%,#000 62%,transparent 62%,transparent 67%,#000 67%,#000 76%,transparent 76%,transparent 82%,#000 82%)'}} />
      <div style={{position: 'absolute', left: -540, top: 820, width: 2160, height: 530, perspective: 420, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: '-60% 0 0 0', transform: 'rotateX(62deg)', transformOrigin: '50% 0%',
          backgroundImage: 'linear-gradient(#FF3EDB 3px, transparent 3px), linear-gradient(90deg, #FF3EDB 3px, transparent 3px)', backgroundSize: '80px 80px', backgroundPosition: `0 ${scroll}px`,
          filter: 'drop-shadow(0 0 6px #FF3EDB)'}} />
      </div>
      <Abs x={0} y={50} style={{width: 1080, textAlign: 'center', transform: `scale(${t})`}}>
        <span style={{fontFamily: F.shrik, fontSize: 230, lineHeight: 1.05, ...chrome}}>PEPE</span>
      </Abs>
      <Abs x={540 - 300} y={330} style={{transform: `perspective(900px) rotateY(${(1 - card) * 70 - 8}deg) scale(${card})`}}>
        <div style={{padding: 8, background: 'linear-gradient(135deg,#fff,#9ED9FF,#FF9AD8,#fff)', boxShadow: '0 30px 60px rgba(26,6,56,0.6)'}}>
          <Photo src="frog.jpg" w={600} h={420} pos="45% 30%" style={{filter: 'saturate(1.9) contrast(1.15) hue-rotate(-8deg)'}} />
        </div>
      </Abs>
      {feels > 0 ? (
        <Abs x={0} y={900} style={{width: 1080, textAlign: 'center', transform: `scale(${feels})`}}>
          <span style={{fontFamily: F.vt, fontSize: 150, color: '#AAFF73', textShadow: '6px 6px 0 #FF3EDB, -4px -4px 0 #00E5FF'}}>FEELS GOOD</span>
        </Abs>
      ) : null}
      {yr > 0 ? (
        <Abs x={0} y={1080} style={{width: 1080, textAlign: 'center', transform: `scale(${yr})`}}>
          <span style={{fontFamily: F.shrik, fontSize: 120, ...chrome}}>$PEPE 2023</span>
        </Abs>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 2024: Solana season, Y2K stickers ----------
const Sparkle: React.FC<{x: number; y: number; s: number; r: number}> = ({x, y, s, r}) => (
  <div style={{position: 'absolute', left: x, top: y, width: s, height: s, transform: `rotate(${r}deg)`, background: 'linear-gradient(135deg,#fff,#C9B8FF,#8FF5E0)', clipPath: 'polygon(50% 0%,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0% 50%,40% 40%)'}} />
);
const Sol: React.FC<{fr: number}> = ({fr}) => {
  const ttl = pop(fr, 30, 9, 260), bonk = pop(fr, 31, 7, 320), wif = pop(fr, 32, 10, 240), cat = pop(fr, 34, 9, 260);
  const half = Math.floor(((fr + 2) / BEAT) * 2);
  const catPop = shown(fr, 34) ? (half % 2 ? 1.12 : 0.9) : 1;
  const spin = (fr - cut(30)) * 1.4;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg,#D2C4FF 0%,#B9A4FF 35%,#8FF0DD 100%)'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.8), transparent 30%), radial-gradient(circle at 15% 85%, rgba(255,120,220,0.45), transparent 35%)'}} />
      {[[880, 520, 70], [470, 220, 46], [960, 860, 54], [40, 1240, 60], [520, 1260, 40], [300, 560, 34]].map(([x, y, s], i) => <Sparkle key={i} x={x} y={y} s={s} r={spin * (i % 2 ? 1 : -1)} />)}
      <Abs x={0} y={46} style={{width: 1080, textAlign: 'center', transform: `scale(${ttl}) rotate(-2deg)`}}>
        <span style={{fontFamily: F.bubble, fontSize: 128, color: '#7B3FF2', filter: sticker(7) + ' drop-shadow(0 10px 0 rgba(60,20,120,0.35))'}}>SOLANA SZN</span>
      </Abs>
      <Abs x={830} y={196} style={{transform: `scale(${ttl}) rotate(8deg)`}}>
        <span style={{fontFamily: F.rmono, fontSize: 34, color: '#fff', background: '#7B3FF2', padding: '8px 18px', borderRadius: 30, border: '4px solid #fff'}}>2024</span>
      </Abs>
      {bonk > 0 ? (
        <Abs x={40} y={240} style={{transform: `scale(${bonk}) rotate(-9deg)`}}>
          <span style={{fontFamily: F.bubble, fontSize: 176, color: '#FF8A00', filter: sticker(8) + ' drop-shadow(0 10px 0 rgba(60,20,120,0.3))'}}>BONK!</span>
        </Abs>
      ) : null}
      <Abs x={610} y={250} style={{transform: `translateY(${(1 - wif) * 900}px) rotate(${4 - (1 - wif) * 20}deg)`}}>
        <Img src={staticFile('meme/wif-cut.png')} style={{height: 560, filter: sticker(9) + ' drop-shadow(0 16px 10px rgba(60,20,120,0.35))'}} />
        <div style={{position: 'absolute', left: 30, top: 470, transform: `scale(${pop(fr, 33, 8, 300)}) rotate(-6deg)`}}>
          <span style={{fontFamily: F.bubble, fontSize: 96, color: '#FFD23F', filter: sticker(6, '#2A0B4A')}}>$WIF</span>
        </div>
      </Abs>
      {cat > 0 ? (
        <Abs x={70} y={450} style={{transform: `scale(${cat * catPop}) rotate(-4deg)`}}>
          <div style={{width: 340, height: 340, borderRadius: '50%', overflow: 'hidden', border: '10px solid #fff', boxShadow: '0 16px 0 rgba(60,20,120,0.3)'}}>
            <Photo src="popcat.jpg" w={340} h={340} pos="38% 55%" style={{transform: 'scale(1.5)', transformOrigin: '36% 60%'}} />
          </div>
          <div style={{position: 'absolute', left: 20, top: 296, transform: 'rotate(5deg)'}}>
            <span style={{fontFamily: F.bubble, fontSize: 72, color: '#FF3EDB', filter: sticker(6)}}>$POPCAT</span>
          </div>
        </Abs>
      ) : null}
      {[35, 36, 37].map((k, i) => {
        const p = pop(fr, k, 7, 340);
        return p > 0 ? (
          <Abs key={k} x={80 + i * 320} y={1100} style={{transform: `scale(${p}) rotate(${[-8, 6, -4][i]}deg)`}}>
            <span style={{fontFamily: F.bubble, fontSize: 120, color: ['#FF3EDB', '#7B3FF2', '#FF8A00'][i], filter: sticker(7)}}>POP</span>
          </Abs>
        ) : null;
      })}
    </AbsoluteFill>
  );
};

// ---------- cult season: candles and blackletter ----------
const Cult: React.FC<{fr: number}> = ({fr}) => {
  const word = (k: number) => ease(fr, E(k), E(k) + 14, OUT);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Clip name="candles" k0={38} trim={90} style={{filter: 'grayscale(1) contrast(1.45) brightness(0.62)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(0,0,0,0.85) 80%)'}} />
      {[{t: 'Cult', k: 38, y: 120}, {t: 'Season', k: 39, y: 380}].map((w) => (
        <Abs key={w.t} x={0} y={w.y} style={{width: 1080, textAlign: 'center', opacity: word(w.k), filter: `blur(${(1 - word(w.k)) * 14}px)`, transform: `scale(${1.18 - 0.18 * word(w.k)})`}}>
          <span style={{fontFamily: F.goth, fontSize: 250, lineHeight: 1, color: '#F1EFE8', textShadow: '0 0 40px rgba(255,255,255,0.25)'}}>{w.t}</span>
        </Abs>
      ))}
      {[{t: 'Neiro', k: 40}, {t: 'Mew', k: 41}, {t: 'Useless', k: 42}].map((w, i) => (
        <Abs key={w.t} x={0} y={880 + i * 118} style={{width: 1080, textAlign: 'center', opacity: word(w.k), filter: `blur(${(1 - word(w.k)) * 10}px)`}}>
          <span style={{fontFamily: F.goth, fontSize: 104, lineHeight: 1, color: '#F1EFE8'}}>{w.t}</span>
        </Abs>
      ))}
    </AbsoluteFill>
  );
};

// ---------- pump season: the casino of launches ----------
const CARDS = [
  {t: 'PUMP', bg: '#AAFF73', fg: INK},
  {t: 'FARTCOIN', bg: '#7A4A1E', fg: '#FFE14D'},
  {t: 'PNUT', img: 'pnut.jpg', pos: '30% 45%'},
  {t: 'MOODENG', img: 'moodeng.jpg', pos: '70% 45%'},
  {t: 'GOAT', img: 'goat.jpg', pos: '45% 25%'},
  {t: 'CHILLGUY', bg: '#E8E2D4', fg: '#3B2F2A'},
];
const Pump: React.FC<{fr: number}> = ({fr}) => {
  const bond = interpolate(fr, [E(44), E(50)], [0, 100], {...clamp, easing: IN});
  const grad = pop(fr, 50, 8, 300);
  return (
    <AbsoluteFill style={{background: '#12001C'}}>
      <Clip name="slots" k0={44} trim={30} style={{filter: 'saturate(1.6) brightness(0.42) blur(3px)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(18,0,28,0.55), rgba(18,0,28,0.2) 50%, rgba(18,0,28,0.8))'}} />
      {[{t: 'EVERYTHING', k: 44, y: 50, c: '#fff'}, {t: 'IS A COIN', k: 45, y: 160, c: '#FF3EDB'}].map((w) => (
        <Abs key={w.t} x={0} y={w.y} style={{width: 1080, textAlign: 'center', transform: `scale(${pop(fr, w.k, 9, 300)})`}}>
          <span style={{fontFamily: F.bungee, fontSize: 104, lineHeight: 1, color: w.c, textShadow: '0 6px 0 #000, 0 0 30px rgba(255,62,219,0.6)'}}>{w.t}</span>
        </Abs>
      ))}
      {CARDS.map((c, i) => {
        const k = 46 + i * 0.5, p = pop(fr, k, 10, 300);
        if (p <= 0) return null;
        const x = 45 + (i % 3) * 345, y = 330 + Math.floor(i / 3) * 370;
        return (
          <Abs key={c.t} x={x} y={y} style={{transform: `translateY(${(1 - p) * -160}px) rotate(${(i % 2 ? 3 : -3) * (2 - p)}deg)`, opacity: Math.min(1, p * 3)}}>
            <div style={{width: 300, height: 340, borderRadius: 22, overflow: 'hidden', border: '5px solid #FF3EDB', background: c.bg ?? '#1E0630', boxShadow: '0 0 30px rgba(255,62,219,0.55), 0 18px 30px rgba(0,0,0,0.5)', position: 'relative'}}>
              {c.img ? <Photo src={c.img} w={300} h={340} pos={c.pos} /> : null}
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 0', textAlign: 'center', background: c.img ? 'rgba(18,0,28,0.82)' : 'transparent', top: c.img ? undefined : 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{fontFamily: F.rmono, fontSize: c.t.length > 6 ? 34 : c.img ? 40 : 58, color: c.fg ?? '#fff'}}>${c.t}</span>
              </div>
            </div>
          </Abs>
        );
      })}
      <Abs x={45} y={1095}>
        <div style={{fontFamily: F.rmono, fontSize: 26, color: '#fff', marginBottom: 12, opacity: 1 - grad}}>BONDING CURVE {Math.round(bond)}%</div>
        <div style={{width: 990, height: 34, borderRadius: 20, background: 'rgba(255,255,255,0.12)', border: '3px solid #FF3EDB', overflow: 'hidden'}}>
          <div style={{width: `${bond}%`, height: '100%', background: 'repeating-linear-gradient(45deg,#AAFF73 0 18px,#7EC25A 18px 36px)'}} />
        </div>
      </Abs>
      {grad > 0 ? (
        <Abs x={0} y={1000} style={{width: 1080, textAlign: 'center', transform: `scale(${grad * 1.0}) rotate(-6deg)`}}>
          <span style={{fontFamily: F.bungee, fontSize: 118, color: '#AAFF73', ...outlineText(12, INK), textShadow: '0 8px 0 #000'}}>GRADUATED</span>
        </Abs>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- colour seasons: Base blue, BNB yellow, the next chain ----------
const Season: React.FC<{fr: number; k0: number; bg: string; fg: string; title: string; items: {t: string; img?: string; pos?: string}[]}> = ({fr, k0, bg, fg, title, items}) => {
  const t = pop(fr, k0, 9, 320);
  return (
    <AbsoluteFill style={{background: bg}}>
      <Abs x={50} y={60} style={{transform: `translateX(${(1 - t) * -500}px)`}}>
        <span style={{fontFamily: F.arch, fontSize: title.length > 4 ? 250 : 320, lineHeight: 0.9, color: fg, letterSpacing: -10}}>{title}</span>
      </Abs>
      {items.map((it, i) => {
        const p = pop(fr, k0 + 0.5 + i * 0.5, 9, 320);
        if (p <= 0) return null;
        return it.img ? (
          <Abs key={it.t} x={660} y={640} style={{transform: `scale(${p}) rotate(6deg)`}}>
            <div style={{width: 360, height: 360, borderRadius: '50%', overflow: 'hidden', border: `10px solid ${fg}`}}><Photo src={it.img} w={360} h={360} pos={it.pos} /></div>
            <div style={{position: 'absolute', left: 10, top: 330, background: fg, padding: '6px 22px', borderRadius: 40, transform: 'rotate(-6deg)'}}>
              <span style={{fontFamily: F.arch, fontSize: 58, color: bg}}>${it.t}</span>
            </div>
          </Abs>
        ) : (
          <Abs key={it.t} x={50} y={[430, 0, 1000][i]} style={{transform: `translateX(${(1 - p) * -400}px)`}}>
            <span style={{fontFamily: F.arch, fontSize: 120, color: fg, letterSpacing: -4}}>${it.t}</span>
          </Abs>
        );
      })}
    </AbsoluteFill>
  );
};
const NextChain: React.FC<{fr: number}> = ({fr}) => (
  <AbsoluteFill style={{background: '#97E763', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{textAlign: 'center', marginTop: -140}}>
      <div style={{fontFamily: F.arch, fontSize: 260, lineHeight: 0.9, color: INK, transform: `scale(${pop(fr, 58, 9, 320)})`, letterSpacing: -10}}>NEXT</div>
      <div style={{fontFamily: F.arch, fontSize: 200, lineHeight: 0.95, color: INK, transform: `scale(${pop(fr, 58.5, 9, 320) * (1 + 0.06 * pulse(fr))})`, letterSpacing: -8}}>CHAIN?</div>
    </div>
  </AbsoluteFill>
);

// ---------- today: one markets list (Hotcoin spot prices, 1 Oct 2026) ----------
const ROWS = [
  ['DOGE', '0.09531'], ['SHIB', '0.00000579'], ['PEPE', '0.00000435'], ['BONK', '0.00000386'], ['WIF', '0.2510'], ['FLOKI', '0.00002797'], ['POPCAT', '0.05253'],
  ['PUMP', '0.005728'], ['FARTCOIN', '0.17870'], ['PNUT', '0.0550'], ['MOODENG', '0.04817'], ['BRETT', '0.005875'], ['TOSHI', '0.00012533'],
];
const Today: React.FC<{fr: number}> = ({fr}) => {
  const card = pop(fr, 60, 13, 200);
  const scroll = interpolate(fr, [E(62), E(66)], [0, 170], {...clamp, easing: IN});
  return (
    <AbsoluteFill style={{background: INK}}>
      {[{t: 'EVERY ERA.', k: 60, y: 120, c: '#F1EFE8'}, {t: 'ONE APP.', k: 61, y: 232, c: '#97E763'}].map((w) => (
        <Abs key={w.t} x={60} y={w.y} style={{transform: `translateY(${(1 - inn(fr, w.k, 10)) * 60}px)`, opacity: inn(fr, w.k, 6)}}>
          <span style={{fontFamily: F.arch, fontSize: 112, lineHeight: 1, color: w.c, letterSpacing: -3}}>{w.t}</span>
        </Abs>
      ))}
      <Abs x={60} y={420} style={{transform: `translateY(${(1 - card) * 700}px)`}}>
        <div style={{width: 960, height: 870, borderRadius: 32, background: '#15181C', border: '1px solid #262A30', overflow: 'hidden', fontFamily: F.ui}}>
          <div style={{display: 'flex', gap: 40, padding: '30px 36px 0', fontSize: 32, fontWeight: 500, color: '#8B8E93'}}>
            <span>Favorites</span><span style={{color: '#fff', borderBottom: '4px solid #23C08D', paddingBottom: 14}}>Spot</span><span>Futures</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '24px 36px 10px', fontSize: 24, color: '#8B8E93', borderTop: '1px solid #262A30', marginTop: -2}}>
            <span>Name</span><span>Last price (USDT)</span>
          </div>
          <div style={{transform: `translateY(${-scroll}px)`}}>
            {ROWS.map(([sym, price], i) => {
              const p = ease(fr, E(60.5) + i * 4, E(60.5) + i * 4 + 12);
              return (
                <div key={sym} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 36px', height: 74, lineHeight: '74px', opacity: p, transform: `translateX(${(1 - p) * 60}px)`}}>
                  <span><span style={{fontSize: 36, fontWeight: 700, color: '#fff'}}>{sym}</span><span style={{fontSize: 26, color: '#8B8E93'}}> /USDT</span></span>
                  <span style={{fontSize: 36, fontWeight: 500, color: '#fff', fontVariantNumeric: 'tabular-nums'}}>{price}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Abs>
      <AbsoluteFill style={{background: `linear-gradient(180deg, transparent 88%, ${INK} 96%)`}} />
    </AbsoluteFill>
  );
};

// ---------- end card ----------
const End: React.FC<{fr: number}> = ({fr}) => {
  const wipe = ease(fr, E(69), E(69) + 30, OUT);
  const url = inn(fr, 70, 14), risk = inn(fr, 70.5, 14);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Img src={staticFile('brand/logo.png')} style={{position: 'absolute', left: LOGO_X, top: LOGO_Y, width: LOGO_W, height: (LOGO_W * 93) / 485, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`}} />
      <div style={{position: 'absolute', top: 800, width: 1080, textAlign: 'center', opacity: url, transform: `translateY(${(1 - url) * 16}px)`, fontFamily: F.mono, fontWeight: 500, fontSize: 38, color: '#F1EFE8', letterSpacing: 1}}>hotcoin.com</div>
      <div style={{position: 'absolute', top: 1222, width: 1080, textAlign: 'center', opacity: risk * 0.75, fontFamily: F.mono, fontSize: 22, color: '#8B8E93'}}>Trading involves risk. Memecoins are highly volatile.</div>
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{k: number; file: string; vol: number}> = ({k, file, vol}) => (
  <Sequence from={Math.max(0, E(k) - 1)} durationInFrames={120} layout="none"><Audio src={staticFile(file)} volume={vol} /></Sequence>
);

export const Meme: React.FC = () => {
  useMemeFonts();
  const fr = useCurrentFrame();
  const flash = Math.max(interpolate(fr, [E(16) - 4, E(16), E(16) + 5], [0, 1, 0], clamp), interpolate(fr, [E(66) - 2, E(66), E(66) + 6], [0, 0.6, 0], clamp));
  const CH: [number, number, (f: number) => React.ReactNode][] = [
    [0, 8, (f) => <Doge fr={f} />], [8, 16, (f) => <Shib fr={f} />], [16, 24, (f) => <Moon fr={f} />], [24, 30, (f) => <Pepe fr={f} />],
    [30, 38, (f) => <Sol fr={f} />], [38, 44, (f) => <Cult fr={f} />], [44, 52, (f) => <Pump fr={f} />],
    [52, 55, (f) => <Season fr={f} k0={52} bg="#0052FF" fg="#FFFFFF" title="BASE" items={[{t: 'BRETT'}, {t: 'TOSHI', img: 'toshi.jpg', pos: '50% 40%'}, {t: 'DEGEN'}]} />],
    [55, 58, (f) => <Season fr={f} k0={55} bg="#F0B90B" fg={INK} title="BNB" items={[{t: 'MUBARAK'}, {t: 'BROCCOLI', img: 'malinois.jpg', pos: '50% 35%'}, {t: 'TUT'}]} />],
    [58, 60, (f) => <NextChain fr={f} />], [60, 66, (f) => <Today fr={f} />], [66, 74, (f) => <End fr={f} />],
  ];
  return (
    <AbsoluteFill style={{background: INK}}>
      {CH.map(([k0, k1, render]) => (
        <Sequence key={k0} from={cut(k0)} durationInFrames={(k1 === 74 ? MEME_DURATION : cut(k1)) - cut(k0)}>
          <Chapter k0={k0} k1={k1} punch={k0 === 66 ? 0 : 0.07}>{render}</Chapter>
        </Sequence>
      ))}
      <GreenLine fr={fr} />
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
      <AnimatedGrain f={fr} opacity={0.22} />
      <Audio src={staticFile('music/head-bang.mp3')} trimBefore={Math.round(MUSIC_START_S * 60)}
        volume={(f) => interpolate(f, [0, 3, at(71), MEME_DURATION], [0, 0.9, 0.9, 0], clamp)} />
      <Sfx k={16} file="sfx/foley/thump.wav" vol={0.7} />
      <Sfx k={15} file="sfx/foley/swell.wav" vol={0.35} />
      {[30, 44, 52, 55, 58, 60].map((k) => <Sfx key={k} k={k - 0.4} file="sfx/foley/whoosh.wav" vol={0.35} />)}
      <Sfx k={68} file="sfx/foley/hit.wav" vol={0.6} />
    </AbsoluteFill>
  );
};
