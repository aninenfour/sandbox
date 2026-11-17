// Ronaldinho x Hotcoin, "luxury" ambassador film (16:9). Mood reference: a luxury-house ambassador film (warm light on fluted,
// reflective architecture, slow camera, sparse tracked type). Interpreted in Hotcoin's palette, not copied.
// Story (team feedback 2026-11-17): brand first (logo from frame 0) -> Hotcoin facts -> the glass wall opens on him -> his line
// -> "Hotcoin welcomes our ambassador" -> end card with both required lines. No italics anywhere.
// Facts: hotcoin.com/en_US/about, checked 2026-11-17. Footage: original Hotcoin shoot (public/ronaldinho/key.webm, voice.wav).
// Music: "I Can Hear Your Heartbeat" (Mixkit music 1000, free licence; CLAP "elegant luxury fashion commercial" 1.00),
//   124.98 BPM, first beat 0.46 s -> started 0.46 s in so beat 0 = frame 0; scene changes land on bar lines (1.92 s).
import React from 'react';
import '@fontsource/inter-tight/200.css';
import '@fontsource/inter-tight/300.css';
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/500.css';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';

export const R10L_FPS = 30;
const BAR = 4 * 60 / 124.98;                 // 1.920 s
const fr = (s: number) => Math.round(s * R10L_FPS);
const bar = (k: number) => fr(k * BAR);
const LOCK2 = bar(1);                        // "x RONALDINHO" + lines
const FACTS_AT = bar(2);                     // four facts, half a bar each
const OPEN = bar(4);                         // glass wall opens
const V = OPEN + 12;                         // his line starts
const CLIP_END = V + 170;
const CLOSE = CLIP_END + 4;                  // wall closes
const WELCOME = bar(8);                      // after the doors have fully closed
const END = bar(9.5);
export const R10L_DURATION = bar(11);       // ~21.1 s
const W = 1920, H = 1080, LB = 92;           // letterbox bar height
const EN = 'Hotcoin Ambassador (Brazil)', PT = 'Embaixador da Hotcoin (Brasil)';
const LIME = '#B8F26A', WHITE = '#F3F5F1', INK = '#050806';
const SANS = '"Inter Tight", sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.65, 0, 0.35, 1);
const rnd = (i: number) => {const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v);};
const FACTS = [
  {n: '2017', l: 'FOUNDED'},
  {n: '8.1M+', l: 'REGISTERED USERS'},
  {n: '120+', l: 'COUNTRIES AND REGIONS'},
  {n: '500+', l: 'FUTURES PAIRS · 300+ SPOT'},
];
const PHRASES = [
  {a: 0.0, b: 1.5, t: 'This is Ronaldinho.'},
  {a: 1.55, b: 2.62, t: 'Play your way.'},
  {a: 2.64, b: 4.15, t: 'Make the magic happen.'},
  {a: 4.25, b: 5.75, t: 'See you at Hotcoin.'},
];

// ---------- the fluted emerald glass wall ----------
const FLUTES = 18;
const Wall: React.FC<{f: number; half: 'L' | 'R'; open: number}> = ({f, half, open}) => {
  const fw = W / FLUTES;
  const n = FLUTES / 2;
  // two light sweeps crossing the wall at different speeds
  const sweepA = ((f * 9) % (W + 1400)) - 700;
  const sweepB = W + 500 - ((f * 5.5 + 900) % (W + 1400));
  return (
    <div style={{position: 'absolute', top: 0, bottom: 0, left: half === 'L' ? 0 : W / 2, width: W / 2,
      transform: `translateX(${(half === 'L' ? -1 : 1) * open * (W / 2 + 40)}px)`}}>
      {Array.from({length: n}).map((_, j) => {
        const i = half === 'L' ? j : j + n;
        const cx = i * fw + fw / 2;
        const refr = Math.sin(i * 1.7) * 60;               // each flute bends the light a little differently
        const a = Math.exp(-(((cx + refr - sweepA) / 420) ** 2));
        const b = Math.exp(-(((cx - refr - sweepB) / 520) ** 2)) * 0.5;
        const glow = Math.min(1, a + b);
        return (
          <div key={i} style={{position: 'absolute', left: j * fw, top: 0, bottom: 0, width: fw + 1,
            background: `linear-gradient(90deg, #020A06 0%, #071C12 20%, #0D2E1D ${44 - glow * 4}%, rgba(225,250,205,${0.02 + 0.62 * glow}) 51%, #0B2919 ${58 + glow * 4}%, #04120B 86%, #020805 100%)`}}>
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(214,250,190,${0.02 + 0.14 * glow}) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,.25) 75%, rgba(214,250,190,${0.01 + 0.06 * glow}) 100%)`}} />
          </div>
        );
      })}
      {/* inner edge of the door catches the light as it opens */}
      <div style={{position: 'absolute', top: 0, bottom: 0, [half === 'L' ? 'right' : 'left']: 0, width: 6,
        background: `rgba(220,255,190,${0.15 + 0.6 * Math.sin(Math.PI * Math.min(1, open * 1.2))})`, filter: 'blur(2px)'}} />
    </div>
  );
};

const Dust: React.FC<{f: number; o: number}> = ({f, o}) => (
  <AbsoluteFill style={{opacity: o}}>
    {Array.from({length: 70}).map((_, i) => {
      const x = (rnd(i) * W + f * (0.3 + rnd(i + 3) * 0.6)) % W;
      const y = (rnd(i + 7) * H - f * (0.2 + rnd(i + 9) * 0.5) + H * 4) % H;
      const s = 2 + rnd(i + 11) * 5;
      const tw = 0.3 + 0.7 * Math.abs(Math.sin(f * 0.05 + i));
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: 'rgba(225,255,205,.9)', filter: `blur(${s > 5 ? 2 : 1}px)`, opacity: tw * 0.55}} />;
    })}
  </AbsoluteFill>
);

// the room behind the wall: a soft top light on him
const Room: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: `radial-gradient(55% 75% at 50% 30%, #1F5A38 0%, #0C2B1A 45%, ${INK} 85%)`}}>
    <div style={{position: 'absolute', left: W / 2 - 520, top: -200, width: 1040, height: 1300,
      background: 'conic-gradient(from 160deg at 50% 0%, rgba(220,255,200,0) 0deg, rgba(220,255,200,.16) 20deg, rgba(220,255,200,.16) 40deg, rgba(220,255,200,0) 60deg)', filter: 'blur(30px)',
      opacity: 0.8 + 0.2 * Math.sin(f * 0.03)}} />
  </AbsoluteFill>
);

// ---------- type ----------
const Tracked: React.FC<{text: string; size: number; weight?: number; color?: string; f: number; at: number; stagger?: number; track?: number}> = ({text, size, weight = 400, color = WHITE, f, at, stagger = 1.2, track = 0.32}) => (
  <div style={{fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: `${track}em`, color, whiteSpace: 'nowrap', marginRight: `-${track}em`}}>
    {text.split('').map((c, i) => {
      const p = interpolate(f, [at + i * stagger, at + i * stagger + 14], [0, 1], {...clamp, easing: ease});
      return <span key={i} style={{opacity: p, display: 'inline-block', transform: `translateY(${(1 - p) * 0.25}em)`, filter: `blur(${(1 - p) * 6}px)`}}>{c === ' ' ? ' ' : c}</span>;
    })}
  </div>
);

// logo with a glint passing across it (mask = the logo itself)
const GlintLogo: React.FC<{f: number; h: number; at: number; dark?: boolean}> = ({f, h, at}) => {
  const src = staticFile('brand/logo-official-white.png');
  const w = h * (2005 / 328);
  const g = interpolate(f, [at, at + 40], [-0.4, 1.4], clamp);
  const o = interpolate(f, [at - 12, at + 6], [0, 1], {...clamp, easing: ease});
  return (
    <div style={{position: 'relative', width: w, height: h, opacity: o}}>
      <Img src={src} style={{position: 'absolute', inset: 0, width: w, height: h}} />
      <div style={{position: 'absolute', inset: 0, WebkitMaskImage: `url(${src})`, WebkitMaskSize: '100% 100%', maskImage: `url(${src})`, maskSize: '100% 100%',
        background: `linear-gradient(100deg, rgba(255,255,255,0) ${g * 100 - 14}%, rgba(214,255,170,1) ${g * 100}%, rgba(255,255,255,0) ${g * 100 + 14}%)`}} />
    </div>
  );
};

const Opening: React.FC<{f: number}> = ({f}) => {
  if (f >= FACTS_AT + 4) return null;
  const out = interpolate(f, [FACTS_AT - 10, FACTS_AT + 2], [0, 1], {...clamp, easing: io});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - out, filter: `blur(${out * 8}px)`}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, padding: '60px 90px', background: 'radial-gradient(closest-side, rgba(4,14,9,.72), rgba(4,14,9,0))'}}>
        <GlintLogo f={f} h={110} at={6} />
        <div style={{width: interpolate(f, [LOCK2 - 8, LOCK2 + 14], [0, 260], {...clamp, easing: ease}), height: 1, background: 'rgba(214,255,170,.8)'}} />
        <Tracked text="× RONALDINHO" size={58} weight={300} f={f} at={LOCK2} />
        <div style={{marginTop: 16, textAlign: 'center', fontFamily: SANS, fontWeight: 400, fontSize: 40, lineHeight: 1.35, letterSpacing: '0.04em',
          opacity: interpolate(f, [LOCK2 + 14, LOCK2 + 30], [0, 1], clamp)}}>
          <div style={{color: WHITE}}>{EN}</div>
          <div style={{color: LIME}}>{PT}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Facts: React.FC<{f: number}> = ({f}) => {
  if (f < FACTS_AT || f >= OPEN) return null;
  const slot = fr(BAR / 2);
  const i = Math.min(3, Math.floor((f - FACTS_AT) / slot));
  const at = FACTS_AT + i * slot;
  const x = FACTS[i];
  const inP = interpolate(f, [at, at + 12], [0, 1], {...clamp, easing: ease});
  const outP = interpolate(f, [at + slot - 7, at + slot], [0, 1], {...clamp, easing: io});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '40px 120px', background: 'radial-gradient(closest-side, rgba(4,14,9,.7), rgba(4,14,9,0))',
        opacity: inP * (1 - outP), transform: `translateY(${(1 - inP) * 24 - outP * 16}px) scale(${1.04 - 0.04 * inP})`, filter: `blur(${(1 - inP) * 8 + outP * 6}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 200, fontSize: 250, lineHeight: 0.95, letterSpacing: '-0.02em', color: WHITE}}>{x.n}</div>
        <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 42, letterSpacing: '0.3em', marginRight: '-0.3em', color: LIME}}>{x.l}</div>
      </div>
    </AbsoluteFill>
  );
};

const Person: React.FC<{f: number}> = ({f}) => {
  if (f < OPEN || f > CLOSE + 32) return null;
  const ph = 1010, pw = ph * (1500 / 1620);
  const reveal = interpolate(f, [OPEN, OPEN + 30], [0, 1], {...clamp, easing: io});
  const push = 1.06 - 0.06 * interpolate(f, [OPEN, CLOSE], [0, 1], clamp);
  const style: React.CSSProperties = {width: pw, height: ph};
  return (
    <div style={{position: 'absolute', left: W / 2 - pw / 2, top: H - ph + 40, width: pw, height: ph, opacity: 0.3 + 0.7 * reveal,
      transform: `scale(${push})`, transformOrigin: '50% 30%', filter: 'saturate(.92) contrast(1.05) brightness(1.03) drop-shadow(0 0 40px rgba(184,242,106,.18))'}}>
      <Sequence from={V} durationInFrames={CLIP_END - V} layout="none"><OffthreadVideo src={staticFile('ronaldinho/key.webm')} transparent muted style={style} /></Sequence>
      {f < V && <Img src={staticFile('ronaldinho/first.png')} style={style} />}
      {f >= CLIP_END && <Img src={staticFile('ronaldinho/last.png')} style={style} />}
    </div>
  );
};

const Captions: React.FC<{f: number}> = ({f}) => {
  const t = (f - V) / R10L_FPS;
  const p = PHRASES.find((q) => t >= q.a && t < q.b);
  if (f < V || !p) return null;
  const lt = (t - p.a) * R10L_FPS, rem = (p.b - t) * R10L_FPS;
  const o = Math.min(interpolate(lt, [0, 8], [0, 1], clamp), interpolate(rem, [0, 5], [0, 1], clamp));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: LB, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: o, zIndex: 5}}>
      <span style={{fontFamily: SANS, fontWeight: 400, fontSize: 46, letterSpacing: '0.03em', color: WHITE}}>{p.t}</span>
    </div>
  );
};

// small brand mark while he speaks
const Bug: React.FC<{f: number}> = ({f}) => {
  const o = interpolate(f, [V + 20, V + 40, CLOSE - 10, CLOSE], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 80, top: LB + 40, display: 'flex', alignItems: 'center', gap: 22, opacity: o}}>
      <Img src={staticFile('brand/logo-official-white.png')} style={{height: 34}} />
      <div style={{width: 1, height: 30, background: 'rgba(243,245,241,.5)'}} />
      <div style={{fontFamily: SANS, fontWeight: 400, fontSize: 24, letterSpacing: '0.3em', color: WHITE}}>RONALDINHO</div>
    </div>
  );
};

const Welcome: React.FC<{f: number}> = ({f}) => {
  if (f < WELCOME || f >= END + 4) return null;
  const out = interpolate(f, [END - 10, END + 2], [0, 1], {...clamp, easing: io});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - out, filter: `blur(${out * 8}px)`}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, padding: '50px 120px', background: 'radial-gradient(closest-side, rgba(4,14,9,.72), rgba(4,14,9,0))'}}>
        <Tracked text="HOTCOIN WELCOMES" size={92} weight={300} f={f} at={WELCOME} stagger={1.1} track={0.18} />
        <Tracked text="OUR AMBASSADOR" size={92} weight={300} color={LIME} f={f} at={WELCOME + 14} stagger={1.1} track={0.18} />
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{f: number}> = ({f}) => {
  if (f < END) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, padding: '60px 140px', background: 'radial-gradient(closest-side, rgba(4,14,9,.78), rgba(4,14,9,0))'}}>
        <GlintLogo f={f} h={120} at={END + 6} />
        <div style={{width: interpolate(f, [END + 6, END + 26], [0, 300], {...clamp, easing: ease}), height: 1, background: 'rgba(214,255,170,.8)'}} />
        <Tracked text="× RONALDINHO" size={56} weight={300} f={f} at={END + 10} />
        <div style={{marginTop: 12, textAlign: 'center', fontFamily: SANS, fontWeight: 400, fontSize: 44, lineHeight: 1.35, letterSpacing: '0.04em', opacity: interpolate(f, [END + 22, END + 36], [0, 1], clamp)}}>
          <div style={{color: WHITE}}>{EN}</div>
          <div style={{color: LIME}}>{PT}</div>
        </div>
        <div style={{marginTop: 22, border: '1px solid rgba(214,255,170,.75)', borderRadius: 999, padding: '14px 40px', fontFamily: SANS, fontWeight: 500, fontSize: 32, letterSpacing: '0.16em', color: WHITE,
          opacity: interpolate(f, [END + 32, END + 46], [0, 1], clamp)}}>HOTCOIN.COM</div>
      </div>
    </AbsoluteFill>
  );
};

const Sound: React.FC = () => {
  const f = useCurrentFrame();
  const vol = interpolate(f, [0, 10, OPEN, V - 6, V + 4, CLIP_END - 4, CLIP_END + 12, R10L_DURATION - 45, R10L_DURATION],
    [0.25, 0.5, 0.55, 0.55, 0.12, 0.12, 0.48, 0.45, 0], clamp);
  return (
    <>
      <Audio src={staticFile('music/r10-luxe.mp3')} startFrom={fr(0.46)} volume={() => vol} />
      <Sequence from={V} layout="none"><Audio src={staticFile('ronaldinho/voice.wav')} volume={1} /></Sequence>
    </>
  );
};

export const R10Luxe: React.FC = () => {
  const f = useCurrentFrame();
  // doors: open on OPEN, close after his line
  const open = interpolate(f, [OPEN, OPEN + 34], [0, 1], {...clamp, easing: io}) * (1 - interpolate(f, [CLOSE, CLOSE + 30], [0, 1], {...clamp, easing: io}));
  const dolly = 1.1 - 0.1 * interpolate(f, [0, OPEN], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const pan = Math.sin(f / 120) * 18;
  const flood = Math.sin(Math.PI * interpolate(f, [OPEN, OPEN + 30], [0, 1], clamp)) * 0.35;
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Room f={f} />
      <Person f={f} />
      <AbsoluteFill style={{transform: `scale(${dolly}) translateX(${pan}px)`}}>
        <Wall f={f} half="L" open={open} />
        <Wall f={f} half="R" open={open} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(225,255,205,1)', opacity: flood, mixBlendMode: 'soft-light'}} />
      <Dust f={f} o={0.9} />
      <AbsoluteFill style={{background: 'radial-gradient(120% 95% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 100%)'}} />
      <Opening f={f} />
      <Facts f={f} />
      <Bug f={f} />
      <Welcome f={f} />
      <EndCard f={f} />
      {/* letterbox */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: LB, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: LB, background: '#000'}} />
      <Captions f={f} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '256px 256px', backgroundPosition: `${(f * 37) % 256}px ${(f * 91) % 256}px`, opacity: 0.06, mixBlendMode: 'screen'}} />
      <Sound />
    </AbsoluteFill>
  );
};
