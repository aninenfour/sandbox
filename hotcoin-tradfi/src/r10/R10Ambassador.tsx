// Ronaldinho x Hotcoin ambassador spot, 16:9 and 9:16 from one timeline.
// Footage: original Hotcoin shoot (MAIN_0004), keyed + graded by scripts/make-r10-key.py -> public/ronaldinho/key.webm,
// voice -> public/ronaldinho/voice.wav. Speech (pt-BR, Whisper word timings, clip seconds):
//   "Aqui é o Ronaldinho" 0.00-1.22 | "jogue do seu jeito" 1.62-2.46 | "faça a magia acontecer" 2.68-3.80 |
//   "a gente se vê na Hotcoin" 4.34-5.60. Clip length 5.68 s.
// Brand rule from the team: every public asset with him ends with BOTH lines:
//   "Hotcoin Ambassador (Brazil)" + "Embaixador da Hotcoin (Brasil)". Only real footage of him, nothing generated.
// Music: "Spanish Heart" (Mixkit free licence), drop at 7.95 s aligned to HIT. SFX: Mixkit + repo foley
// (see FOOTAGE_CREDITS.md), each checked with CLAP tagging, including against cartoon labels.
import React from 'react';
import '@fontsource/inter-tight/800.css';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

export const R10A_FPS = 30;
export const R10A_DURATION = 396;  // 13.2 s, ends on a bar line of the music
// Intro: dark stadium, floodlight banks clunk on (LIGHTS), the 10 draws, music drops on HIT (ball strike).
const LIGHTS = [12, 30, 48];
const HIT = 96;               // = music drop (track 7.95 s), bars every 60 frames after this
const V = HIT + 14;           // frame where his clip (and voice) starts
const CLIP_END = V + 170;     // 5.68 s
const END = CLIP_END + 6;     // end card starts

const INK = '#07090A', LIME = '#B8F26A', GREEN = '#7EC25A', WHITE = '#F3F5F1';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace', SERIF = '"Instrument Serif", serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const io = Easing.bezier(0.65, 0, 0.35, 1);
const s2f = (s: number) => V + Math.round(s * R10A_FPS);

// caption phrases (English), clip seconds
const PHRASES: {a: number; b: number; words: string[]; hi: number[]}[] = [
  {a: 0.0, b: 1.45, words: ['This', 'is', 'Ronaldinho.'], hi: [2]},
  {a: 1.55, b: 2.6, words: ['Play', 'your', 'way.'], hi: [2]},
  {a: 2.62, b: 4.1, words: ['Make', 'the', 'magic', 'happen.'], hi: [2]},
  {a: 4.25, b: 5.68, words: ['See', 'you', 'at', 'Hotcoin.'], hi: [3]},
];
// word start times for the word-by-word reveal (clip seconds)
const WORD_T = [[0.0, 0.66, 0.74], [1.62, 1.84, 1.96], [2.68, 2.92, 2.98, 3.26], [4.34, 4.42, 4.84, 5.16]];

type L = {w: number; h: number; tall: boolean};

// floodlight strike: off, a quick double flicker, then on (with a slow settle)
const strike = (f: number, at: number) => {
  const t = f - at;
  if (t < 0) return 0;
  if (t < 2) return 0.9;
  if (t < 4) return 0.25;
  if (t < 5) return 1;
  return interpolate(t, [5, 20], [1.15, 1], clamp);
};
// camera dolly over the pitch: quick glide in the intro, then a slow drift
const dollyAt = (f: number) => 7 * (1 - Math.exp(-f / 45)) + f * 0.03;

// ---------- background world ----------
// true perspective pitch: ground plane projected from a camera above the halfway line, slowly dollying forward
const Pitch: React.FC<{l: L; f: number}> = ({l, f}) => {
  const {w, h} = l;
  const hz = h * (l.tall ? 0.40 : 0.36);          // horizon
  const F = w * (l.tall ? 1.1 : 0.9), camH = 9;    // focal length (px), camera height (m)
  const cx = w / 2, dolly = dollyAt(f);
  const P = (x: number, z: number) => [cx + (F * x) / z, hz + (F * camH) / z];
  const near = 2.2, far = 140;
  const stripes: React.ReactNode[] = [];
  const band = 5.5;
  const k0 = Math.floor((near + dolly) / band) - 1;
  for (let k = k0; k < k0 + 40; k++) {
    const z1 = k * band - dolly, z2 = (k + 1) * band - dolly;
    if (z2 < near || z1 > far) continue;
    const a = Math.max(z1, near), b = Math.min(z2, far);
    const [x1, y1] = P(-80, a), [x2] = P(80, a), [x3, y3] = P(80, b), [x4] = P(-80, b);
    if (k % 2) stripes.push(<polygon key={k} points={`${x1},${y1} ${x2},${y1} ${x3},${y3} ${x4},${y3}`} fill="rgba(126,194,90,.07)" />);
  }
  // halfway line + centre circle at depth zc
  const zc = 26 - dolly * 0.6;
  const R = 9.15;
  const circ = Array.from({length: 73}).map((_, i) => {
    const t = (i / 72) * Math.PI * 2; const z = zc + Math.sin(t) * R;
    return z > near ? P(Math.cos(t) * R, z).join(',') : null;
  }).filter(Boolean).join(' ');
  const [hx1, hy] = P(-60, zc), [hx2] = P(60, zc);
  const [cdx, cdy] = P(0, zc);
  // touchlines
  const [tl1x, tl1y] = P(-34, near), [tl2x, tl2y] = P(-34, far), [tr1x] = P(34, near), [tr2x] = P(34, far);
  const line = 'rgba(184,242,106,.42)';
  return (
    <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="pfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset={String((hz + h * 0.04) / h)} stopColor="#fff" stopOpacity=".25" />
          <stop offset={String((hz + h * 0.25) / h)} stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="pmask"><rect width={w} height={h} fill="url(#pfade)" /></mask>
      </defs>
      <g mask="url(#pmask)">
        {stripes}
        <line x1={tl1x} y1={tl1y} x2={tl2x} y2={tl2y} stroke={line} strokeWidth={3} />
        <line x1={tr1x} y1={tl1y} x2={tr2x} y2={tl2y} stroke={line} strokeWidth={3} />
        <line x1={hx1} y1={hy} x2={hx2} y2={hy} stroke={line} strokeWidth={3} />
        <polyline points={circ} fill="none" stroke={line} strokeWidth={3} />
        <ellipse cx={cdx} cy={cdy} rx={7} ry={3} fill={line} />
      </g>
    </svg>
  );
};

const World: React.FC<{l: L; f: number}> = ({l, f}) => {
  const flick = 0.92 + 0.08 * Math.sin(f * 0.21) * Math.sin(f * 0.057);
  const lt = [strike(f, LIGHTS[0]), strike(f, LIGHTS[1])];
  const wash = strike(f, LIGHTS[2]);
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 90% at 50% 38%, #12452A 0%, #0A2416 42%, #061009 75%, ${INK} 100%)`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.3 + 0.7 * Math.min(1, wash)}}><Pitch l={l} f={f} /></div>
      {/* horizon haze over the far pitch */}
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(7,9,10,0) 0%, rgba(10,36,22,0) ${l.tall ? 44 : 38}%, rgba(18,69,42,.55) ${l.tall ? 55 : 50}%, rgba(7,9,10,0) ${l.tall ? 72 : 70}%)`}} />
      {/* floodlight beams */}
      {[-1, 1].map((sd) => (
        <div key={sd} style={{position: 'absolute', top: -l.h * 0.12, left: sd < 0 ? -l.w * 0.08 : undefined, right: sd > 0 ? -l.w * 0.08 : undefined,
          width: l.w * 0.75, height: l.h * 1.1, opacity: 0.55 * flick * lt[sd < 0 ? 0 : 1],
          background: `conic-gradient(from ${sd < 0 ? 125 : 205}deg at ${sd < 0 ? '8% 6%' : '92% 6%'}, rgba(205,255,170,0) 0deg, rgba(205,255,170,.20) 12deg, rgba(205,255,170,.05) 22deg, rgba(205,255,170,0) 30deg)`,
          filter: 'blur(18px)', mixBlendMode: 'screen'}} />
      ))}
      {/* floodlight heads */}
      {[-1, 1].map((sd) => (
        <div key={'h' + sd} style={{position: 'absolute', top: l.h * 0.02, left: sd < 0 ? l.w * 0.02 : undefined, right: sd > 0 ? l.w * 0.02 : undefined,
          width: 260, height: 160, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(235,255,215,.55), rgba(184,242,106,.12) 60%, rgba(0,0,0,0))', filter: 'blur(6px)', opacity: flick * (0.12 + 0.88 * lt[sd < 0 ? 0 : 1])}} />
      ))}
      {/* stadium bokeh along the horizon */}
      {Array.from({length: 26}).map((_, i) => {
        const x = ((i * 137.5) % 100); const y = (l.tall ? 40 : 34) + ((i * 53) % 9);
        const r = 10 + ((i * 31) % 22); const tw = 0.35 + 0.35 * Math.sin(f * 0.05 + i);
        return <div key={'b' + i} style={{position: 'absolute', left: `${x}%`, top: `${y}%`, width: r, height: r, borderRadius: '50%', background: i % 3 ? 'rgba(184,242,106,.35)' : 'rgba(240,255,230,.4)', filter: 'blur(3px)', opacity: tw * (0.25 + 0.75 * Math.min(1, wash))}} />;
      })}
      {/* house lights down before the strike: darken the whole world, lifts with each bank */}
      <AbsoluteFill style={{background: INK, opacity: Math.max(0, 0.78 - 0.17 * lt[0] - 0.17 * lt[1] - 0.44 * Math.min(1, wash)), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

const Grain: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '256px 256px', backgroundPosition: `${(f * 37) % 256}px ${(f * 91) % 256}px`, opacity: 0.07, mixBlendMode: 'screen', pointerEvents: 'none'}} />
);
const Vignette = () => <AbsoluteFill style={{background: 'radial-gradient(130% 100% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)', pointerEvents: 'none'}} />;

// ---------- the big 10 ----------
const Ten: React.FC<{l: L; f: number}> = ({l, f}) => {
  const size = l.tall ? 1050 : 980;
  const draw = interpolate(f, [LIGHTS[2], HIT - 6], [0, 1], {...clamp, easing: ease});
  const fill = interpolate(f, [HIT - 1, HIT + 1, HIT + 11], [0, 1, 0], clamp);  // lime flash on the drop
  const push = interpolate(f, [0, END], [1.06, 1.16], clamp) - interpolate(f, [HIT, HIT + 10], [0, 0.03], {...clamp, easing: ease}) + interpolate(f, [HIT - 1, HIT + 1, HIT + 12], [0, 0.05, 0], clamp);
  const exit = interpolate(f, [CLIP_END - 4, END + 8], [1, 0], clamp);
  const x = l.tall ? l.w / 2 : l.w * 0.645;
  const y = l.tall ? l.h * 0.47 : l.h * 0.5;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${push})`, opacity: exit}}>
      <svg width={size * 1.25} height={size} viewBox={`0 0 ${size * 1.25} ${size}`} style={{overflow: 'visible'}}>
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontFamily="Inter Tight" fontWeight={800} fontSize={size} letterSpacing={-size * 0.06}
          fill={`rgba(184,242,106,${0.06 + fill * 0.8})`} stroke={LIME} strokeWidth={3}
          strokeDasharray="9000" strokeDashoffset={9000 * (1 - draw)} strokeOpacity={draw > 0.05 ? 0.75 : 0}>10</text>
      </svg>
    </div>
  );
};

// ---------- him ----------
const RIM_ID = 'r10rim';
const RimFilter = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <filter id={RIM_ID} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
        {/* inner edge on the left and right: alpha minus shifted alpha */}
        <feOffset in="SourceAlpha" dx={5} dy={0} result="sl" />
        <feComposite in="SourceAlpha" in2="sl" operator="out" result="edgeL" />
        <feOffset in="SourceAlpha" dx={-4} dy={0} result="sr" />
        <feComposite in="SourceAlpha" in2="sr" operator="out" result="edgeR" />
        <feMerge result="edges"><feMergeNode in="edgeL" /><feMergeNode in="edgeR" /></feMerge>
        <feGaussianBlur in="edges" stdDeviation={1.6} result="eb" />
        <feComposite in="eb" in2="SourceAlpha" operator="in" result="ein" />
        <feFlood floodColor="#C9FF86" floodOpacity={0.42} />
        <feComposite in2="ein" operator="in" result="rim" />
        <feBlend in="rim" in2="SourceGraphic" mode="screen" />
      </filter>
    </defs>
  </svg>
);

const personBox = (l: L) => {
  const s = l.tall ? 0.92 : 0.66;
  const w = 1500 * s, h = 1620 * s;
  const cx = l.tall ? l.w / 2 : l.w * 0.645;
  const top = l.tall ? l.h - h + 70 : l.h - h + 30;
  return {left: cx - w / 2, top, w, h};
};

const Person: React.FC<{l: L; f: number}> = ({l, f}) => {
  const {fps} = useVideoConfig();
  const b = personBox(l);
  const enter = spring({frame: f - (HIT + 9), fps, config: {damping: 200, mass: 0.9}, durationInFrames: 22});
  // gentle push + small punch-ins on each phrase
  let punch = 0;
  PHRASES.forEach((p, i) => {
    if (i === 0) return;
    punch += interpolate(f, [s2f(p.a) - 2, s2f(p.a) + 6], [0, 0.022], {...clamp, easing: ease});
  });
  const scale = (0.96 + 0.04 * enter) * (1 + interpolate(f, [V, CLIP_END], [0, 0.02], clamp) + punch);
  const exitT = interpolate(f, [CLIP_END - 2, END + 6], [0, 1], {...clamp, easing: io});
  const opacity = enter * (1 - exitT);
  const dy = (1 - enter) * 90 + exitT * 120;
  const clipF = Math.min(f, CLIP_END - 1);
  return (
    <>
      {/* soft ground shadow / glow behind him */}
      <div style={{position: 'absolute', left: b.left + b.w * 0.1, top: b.top + b.h * 0.18, width: b.w * 0.8, height: b.h * 0.9, borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(184,242,106,.18), rgba(126,194,90,.06) 60%, rgba(0,0,0,0))', opacity, filter: 'blur(30px)'}} />
      <div style={{position: 'absolute', left: b.left, top: b.top, width: b.w, height: b.h, opacity, transform: `translateY(${dy}px) scale(${scale})`, transformOrigin: '50% 30%'}}>
        <Sequence from={V} durationInFrames={CLIP_END - V} layout="none">
          <OffthreadVideo src={staticFile('ronaldinho/key.webm')} transparent muted style={{width: b.w, height: b.h, filter: `url(#${RIM_ID})`}} />
        </Sequence>
        {/* before the clip starts, hold its first frame so he can rise in */}
        {f < V && (
          <Img src={staticFile('ronaldinho/first.png')} style={{width: b.w, height: b.h, filter: `url(#${RIM_ID})`}} />
        )}
        {f >= CLIP_END && clipF && (
          <Img src={staticFile('ronaldinho/last.png')} style={{width: b.w, height: b.h, filter: `url(#${RIM_ID})`}} />
        )}
      </div>
    </>
  );
};

// ---------- top lockup ----------
const Lockup: React.FC<{l: L; f: number; at?: number}> = ({l, f}) => {
  const o = interpolate(f, [LIGHTS[2] + 4, LIGHTS[2] + 18], [0, 1], {...clamp, easing: ease});
  const h = l.tall ? 46 : 38;
  const exit = interpolate(f, [CLIP_END - 2, END + 4], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', top: l.tall ? 120 : 64, left: l.tall ? 0 : 110, right: l.tall ? 0 : undefined, display: 'flex', justifyContent: l.tall ? 'center' : 'flex-start', alignItems: 'center', gap: h * 0.55,
      opacity: o * exit, transform: `translateY(${(1 - o) * -14}px)`}}>
      <Img src={staticFile('brand/logo-official-white.png')} style={{height: h}} />
      <div style={{width: 2, height: h * 1.05, background: 'rgba(243,245,241,.45)'}} />
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: h * 0.92, letterSpacing: h * 0.06, color: WHITE, lineHeight: 1}}>RONALDINHO</div>
    </div>
  );
};

// ---------- captions ----------
const Captions: React.FC<{l: L; f: number}> = ({l, f}) => {
  const t = (f - V) / R10A_FPS;
  const i = PHRASES.findIndex((p) => t >= p.a && t < p.b);
  if (f < V || i < 0) return null;
  const p = PHRASES[i];
  const out = interpolate(t, [p.b - 0.12, p.b], [1, 0], clamp);
  const size = l.tall ? 96 : 104;
  const pos: React.CSSProperties = l.tall
    ? {left: 60, right: 60, top: 236, textAlign: 'center', justifyContent: 'center'}
    : {left: 110, width: 720, top: 330, justifyContent: 'flex-start'};
  return (
    <div style={{position: 'absolute', display: 'flex', flexWrap: 'wrap', columnGap: size * 0.26, rowGap: 0, ...pos, opacity: out}}>
      {p.words.map((w, k) => {
        const wt = WORD_T[i][k];
        const lt = (t - wt) * R10A_FPS;
        const o = interpolate(lt, [-1, 4], [0, 1], {...clamp, easing: ease});
        const hi = p.hi.includes(k);
        const magic = i === 2 && hi;
        return (
          <span key={k} style={{display: 'inline-block', opacity: o, transform: `translateY(${(1 - o) * size * 0.35}px)`,
            fontFamily: magic ? SERIF : SANS, fontStyle: magic ? 'italic' : 'normal', fontWeight: magic ? 400 : 800,
            fontSize: magic ? size * 1.18 : size, lineHeight: 1.04, letterSpacing: magic ? 0 : -size * 0.03,
            color: hi ? LIME : WHITE, textShadow: '0 4px 30px rgba(0,0,0,.45)'}}>{w}</span>
        );
      })}
    </div>
  );
};

// ---------- banner name plate (football lower third) ----------
const NamePlate: React.FC<{l: L; f: number}> = ({l, f}) => {
  const a = s2f(0.6), b = s2f(2.55);
  const inT = interpolate(f, [a, a + 12], [0, 1], {...clamp, easing: ease});
  const outT = interpolate(f, [b, b + 10], [0, 1], {...clamp, easing: io});
  if (f < a || outT >= 1) return null;
  const tall = l.tall;
  const W = tall ? 760 : 700;
  const left = tall ? 70 : 110;
  const top = tall ? 1340 : 610;
  const wipe = inT * (1 - outT);
  return (
    <div style={{position: 'absolute', left, top, width: W, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`}}>
      <div style={{display: 'flex', alignItems: 'stretch', transform: 'skewX(-12deg)', transformOrigin: '0 100%'}}>
        <div style={{background: LIME, color: INK, fontFamily: SANS, fontWeight: 800, fontSize: tall ? 92 : 84, lineHeight: 1, padding: tall ? '18px 26px 14px' : '16px 24px 12px', letterSpacing: -3}}>
          <div style={{transform: 'skewX(12deg)'}}>10</div>
        </div>
        <div style={{flex: 1, background: 'rgba(7,9,10,.88)', borderTop: `3px solid ${LIME}`, padding: tall ? '16px 28px' : '14px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{transform: 'skewX(12deg)', fontFamily: SANS, fontWeight: 800, fontSize: tall ? 54 : 50, letterSpacing: 2, color: WHITE, lineHeight: 1}}>RONALDINHO</div>
        </div>
      </div>
      <div style={{marginTop: 0, display: 'inline-block', background: 'rgba(7,9,10,.88)', padding: tall ? '12px 20px 14px' : '10px 18px 12px', fontFamily: MONO, fontWeight: 500, fontSize: tall ? 27 : 23, lineHeight: 1.45, color: 'rgba(243,245,241,.9)', letterSpacing: 0.4,
        opacity: interpolate(f, [a + 8, a + 18], [0, 1], clamp)}}>
        <div>Hotcoin Ambassador (Brazil)</div>
        <div style={{color: GREEN}}>Embaixador da Hotcoin (Brasil)</div>
      </div>
    </div>
  );
};

// ---------- "magic" ball arc ----------
const MagicArc: React.FC<{l: L; f: number}> = ({l, f}) => {
  const a = s2f(2.86);
  const p = interpolate(f, [a, a + 22], [0, 1], {...clamp, easing: Easing.bezier(0.3, 0.1, 0.2, 1)});
  const fade = interpolate(f, [a + 26, a + 44], [1, 0], clamp);
  if (f < a || fade <= 0) return null;
  const {w, h} = l;
  const d = l.tall
    ? `M ${-60} ${h * 0.86} C ${w * 0.15} ${h * 0.2}, ${w * 0.9} ${h * 0.18}, ${w + 60} ${h * 0.62}`
    : `M ${w * 0.30} ${h + 40} C ${w * 0.42} ${h * -0.05}, ${w * 0.92} ${h * 0.02}, ${w + 60} ${h * 0.55}`;
  const len = 4000;
  return (
    <svg width={w} height={h} style={{position: 'absolute', inset: 0, opacity: fade, mixBlendMode: 'screen'}}>
      <defs>
        <filter id="glowArc"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>
      <path d={d} fill="none" stroke={LIME} strokeWidth={16} strokeLinecap="round" strokeDasharray={`${len * 0.28} ${len}`} strokeDashoffset={len * 0.28 - len * p} filter="url(#glowArc)" opacity={0.7} />
      <path d={d} fill="none" stroke="#EFFFD9" strokeWidth={4} strokeLinecap="round" strokeDasharray={`${len * 0.28} ${len}`} strokeDashoffset={len * 0.28 - len * p} />
    </svg>
  );
};

// ---------- transition + end card ----------
const StripeWipe: React.FC<{l: L; f: number}> = ({l, f}) => {
  const a = CLIP_END - 4;
  const p = interpolate(f, [a, a + 16], [0, 1], {...clamp, easing: io});
  if (p <= 0 || p >= 1) return null;
  const n = 5;
  const span = l.w + l.h;
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const q = Math.min(1, Math.max(0, p * 1.6 - i * 0.12));
        const x = -span * 0.6 + q * span * 1.9;
        return <div key={i} style={{position: 'absolute', top: -l.h, left: x - i * 70, width: 90 + i * 30, height: l.h * 3, transform: 'rotate(24deg)',
          background: i % 2 ? GREEN : LIME, opacity: 0.95 - i * 0.12}} />;
      })}
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{l: L; f: number}> = ({l, f}) => {
  const {fps} = useVideoConfig();
  if (f < END - 2) return null;
  const lt = f - END;
  const ln = (d: number) => spring({frame: lt - d, fps, config: {damping: 200}, durationInFrames: 18});
  const tall = l.tall;
  const H1 = tall ? 128 : 132;
  const row = (d: number): React.CSSProperties => ({opacity: ln(d), transform: `translateY(${(1 - ln(d)) * 40}px)`});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {/* big faint 10 on the end card */}
      <div style={{position: 'absolute', fontFamily: SANS, fontWeight: 800, fontSize: tall ? 1250 : 1100, lineHeight: 1, letterSpacing: -60, color: 'transparent',
        WebkitTextStroke: '2px rgba(184,242,106,.16)', top: '50%', left: '50%', transform: `translate(-50%,-52%) scale(${1 + lt * 0.0012})`}}>10</div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: tall ? 120 : -10}}>
        <div style={{...row(0), display: 'flex', alignItems: 'center', gap: 26, marginBottom: tall ? 80 : 56}}>
          <Img src={staticFile('brand/logo-official-white.png')} style={{height: tall ? 64 : 52}} />
          <div style={{width: 2, height: tall ? 64 : 54, background: 'rgba(243,245,241,.45)'}} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: tall ? 60 : 50, letterSpacing: 3, color: WHITE, lineHeight: 1}}>RONALDINHO</div>
        </div>
        <div style={{...row(4), fontFamily: SANS, fontWeight: 800, fontSize: H1, lineHeight: 1, letterSpacing: -H1 * 0.035, color: WHITE}}>Play your way.</div>
        <div style={{...row(8), fontFamily: SANS, fontWeight: 800, fontSize: H1, lineHeight: 1.08, letterSpacing: -H1 * 0.035, color: WHITE}}>
          Make it <span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: H1 * 1.18, letterSpacing: 0, color: LIME}}>magic.</span>
        </div>
        <div style={{...row(14), marginTop: tall ? 90 : 60, display: 'flex', alignItems: 'center', gap: 14, background: LIME, color: INK, borderRadius: 999,
          padding: tall ? '22px 46px' : '18px 40px', fontFamily: SANS, fontWeight: 800, fontSize: tall ? 46 : 38, letterSpacing: -0.5}}>hotcoin.com</div>
        <div style={{...row(18), marginTop: tall ? 110 : 54, fontFamily: MONO, fontWeight: 500, fontSize: tall ? 32 : 26, lineHeight: 1.5, color: 'rgba(243,245,241,.92)', letterSpacing: 0.5}}>
          <div>Hotcoin Ambassador (Brazil)</div>
          <div style={{color: GREEN}}>Embaixador da Hotcoin (Brasil)</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- sound ----------
// Every cue is placed so its transient (measured peak, seconds into the file) lands on the frame given.
// All checked with CLAP against "cartoon / slide whistle / boing / toy" labels: none score above 0.00.
const PEAK: Record<string, number> = {
  'r10/clunk.wav': 0.269, 'r10/kick.mp3': 0.252, 'foley/hit.wav': 0.005, 'r10/whoosh-soft.mp3': 0.713,
  'r10/whoosh-fast.mp3': 1.087, 'r10/sparkle.mp3': 0.455, 'r10/impact.mp3': 0.629,
};
// [frame the transient lands on, file, volume, optional seconds trimmed off the start]
const SFX: [number, string, number, number?][] = [
  [LIGHTS[0], 'r10/clunk.wav', 0.55],       // floodlight bank 1
  [LIGHTS[1], 'r10/clunk.wav', 0.6],        // bank 2
  [LIGHTS[2], 'r10/clunk.wav', 0.8],        // pitch wash
  [HIT, 'r10/whoosh-soft.mp3', 0.35],       // air pulled into the strike
  [HIT, 'r10/kick.mp3', 0.95],              // ball strike = music drop = lime 10
  [HIT, 'foley/hit.wav', 0.9],              // low body under the strike
  [s2f(0.62), 'r10/whoosh-fast.mp3', 0.3],  // name plate wipe
  [s2f(2.86), 'r10/sparkle.mp3', 0.35],     // "magic" arc
  [CLIP_END + 5, 'r10/whoosh-fast.mp3', 0.6, 0.85], // stripe wipe; lead-in trimmed so it never covers "Hotcoin"
  [END + 2, 'r10/impact.mp3', 0.6],         // end card lands
];
const MUSIC_DROP = 7.95;  // seconds into "Spanish Heart" where the full beat enters

const Sound: React.FC = () => {
  const f = useCurrentFrame();
  const music = interpolate(f, [0, 8, HIT - 2, HIT, V - 6, V + 2, CLIP_END + 1, END + 6, R10A_DURATION - 24, R10A_DURATION],
    [0, 0.42, 0.42, 0.6, 0.6, 0.095, 0.095, 0.5, 0.5, 0], clamp);
  const crowd = interpolate(f, [0, LIGHTS[2], LIGHTS[2] + 10, V - 4, V + 4, CLIP_END + 1, END + 8, R10A_DURATION - 30, R10A_DURATION],
    [0, 0.04, 0.16, 0.16, 0.025, 0.025, 0.26, 0.2, 0], clamp);
  return (
    <>
      <Audio src={staticFile('music/r10-spanish-heart.mp3')} startFrom={Math.round((MUSIC_DROP - HIT / R10A_FPS) * R10A_FPS)} volume={() => music} />
      <Audio src={staticFile('sfx/r10/crowd.mp3')} volume={() => crowd} />
      <Sequence from={V} layout="none"><Audio src={staticFile('ronaldinho/voice.wav')} volume={1} /></Sequence>
      {SFX.map(([at, file, vol, trim = 0], i) => (
        <Sequence key={i} from={Math.max(0, at - Math.round((PEAK[file] - trim) * R10A_FPS))} layout="none">
          <Audio src={staticFile('sfx/' + file)} startFrom={Math.round(trim * R10A_FPS)} volume={vol} />
        </Sequence>
      ))}
    </>
  );
};

export const R10Ambassador: React.FC<{tall: boolean}> = ({tall}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const l: L = {w: width, h: height, tall};
  return (
    <AbsoluteFill style={{background: INK}}>
      <RimFilter />
      <World l={l} f={f} />
      <Ten l={l} f={f} />
      <MagicArc l={l} f={f} />
      <Person l={l} f={f} />
      <Lockup l={l} f={f} />
      <Captions l={l} f={f} />
      <NamePlate l={l} f={f} />
      <EndCard l={l} f={f} />
      <StripeWipe l={l} f={f} />
      <Vignette />
      <Grain f={f} />
      <Sound />
    </AbsoluteFill>
  );
};
