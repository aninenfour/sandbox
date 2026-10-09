// "Time to shine": a Day 2 TOKEN2049 teaser in the restrained fframes-intro style.
// Paper-grey canvas, small centred type, pixel-art icons, one green line, letters that gather.
// No photos. ~17.4 s, music "Digital Clouds" (Mixkit), cuts on its 0.93 s pulse.
import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IN, INOUT, OUT, clamp, ease, sp} from '../alt/kit';

const FPS = 60;
const P = 0.9295, P0 = 2.51; // pulse period and first strong pulse in the track
const pulse = (n: number) => P0 + n * P;
const s = (sec: number) => Math.round(sec * FPS);
const T = {
  s1: 0, s2: pulse(0), s3: pulse(2), kick: pulse(4), s4: pulse(4), dark: pulse(8), letters: pulse(10), logo: pulse(13), end: pulse(16),
};
export const SHINE_DURATION = s(T.end);
const PAPER = '#E7E5E0', INK = '#161616', LIME = '#B8F26A', GREEN = '#7EC25A';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';

export const useShineFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {Promise.all(['500 44px "Inter Tight"', '600 44px "Inter Tight"', '500 22px "JetBrains Mono"'].map((x) => document.fonts.load(x))).then(() => continueRender(h));}, [h]);
};
export const rnd = (n: number) => {const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};

// ---------- pixel art ----------
const PAL: Record<string, string> = {
  k: '#1A1A1A', w: '#FFFFFF', g: '#CFCFCB', d: '#8A8A86', l: LIME, G: GREEN, D: '#3E7A25', y: '#FFD23F', o: '#E89A1C',
  b: '#4C86FF', c: '#9AD8FF', r: '#E8322E', R: '#9E1F1B', s: '#F2C9A0',
};
const ART: Record<string, string[]> = {
  mbs: [
    'kkkkkkkkkkkkkkkkkkkkkkkkk.',
    'kddddddddddddddddddddddddk',
    '.kkkkkkkkkkkkkkkkkkkkkkkk.',
    '..kwgk....kwgk....kwgk....',
    '..kwgk....kwgk....kwgk....',
    '..kwgk....kwgk....kwgk....',
    '..kwgkk...kwgkk...kwgkk...',
    '..kwggk...kwggk...kwggk...',
    '..kwggk...kwggk...kwggk...',
    '..kwggk...kwggk...kwggk...',
    '..kwgggk..kwgggk..kwgggk..',
    '..kwgggk..kwgggk..kwgggk..',
    'kkkkkkkkkkkkkkkkkkkkkkkkkk',
    'bcbbcbbbcbbcbbbcbbcbbbcbbc',
  ],
  booth: [
    'kkkkkkkkkkkkkkkk',
    'kwwwwwwwwwwwwwwk',
    'kwwwwkkkkwwwwwwk',
    'kwwwwkllkwwwwkkk',
    'kwwwwkkkkwwwwklk',
    'kwwwwwwwwwwwwklk',
    'kwwwwwwwwwwwwklk',
    'kkkkkkkkkkkwwklk',
    'kGGGGGGGGGkwwklk',
    'kGGGGkkGGGkwwklk',
    'kDDDDDDDDDkwwklk',
    'kkkkkkkkkkkkkkkk',
  ],
  ball: [
    '....kkkkk....',
    '..kkwwwwwkk..',
    '.kwwwkkkwwwk.',
    '.kwwkkkkkwwk.',
    'kwwwkkkkkwwwk',
    'kkwwwkkkwwwkk',
    'kkkwwwwwwwkkk',
    'kkwwwwwwwwwkk',
    'kwwwkwwwkwwwk',
    '.kwkkkwkkkwk.',
    '.kwwkkwkkwwk.',
    '..kkwwwwwkk..',
    '....kkkkk....',
  ],
  heart: [
    '..kkk...kkk..',
    '.kllGk.kllGk.',
    'klwllGkllllGk',
    'kllllllllllGk',
    'kllllllllllGk',
    '.kllllllllGk.',
    '..kllllllGk..',
    '...kllllGk...',
    '....kllGk....',
    '.....kGk.....',
    '......k......',
  ],
  coin: [
    '...kkkkk...',
    '.kkllllGkk.',
    '.klwllllGk.',
    'kllkkkkllGk',
    'klllllklllk',
    'kllllkllllk',
    'klllkllklGk',
    'kllkllkkkGk',
    '.klllllllk.',
    '.kkGGGGGkk.',
    '...kkkkk...',
  ],
  jersey: [
    '.kkkk..kkkk.',
    'kkkkkllkkkkk',
    'kkkkkkkkkkkk',
    'kkkk.kkkkkkk',
    '.kkkkkwwkkk.',
    '..kkkkkwkkk.',
    '..kkkkwwkkk.',
    '..kkkkkwkkk.',
    '..kkkwwwkkk.',
    '..kkkkkkkkk.',
    '..klllllllk.',
  ],
  trophy: [
    'kkkkkkkkkk',
    'kyywyyyyok',
    'kyyyyyyyok',
    '.kyyyyyok.',
    '..kyyyok..',
    '...kyok...',
    '....ko....',
    '...kook...',
    '..kkkkkk..',
    '..kddddk..',
    '..kkkkkk..',
  ],
  bolt: [
    '....kkk',
    '...kyyk',
    '..kyyk.',
    '.kyyk..',
    'kyyykkk',
    'kkkyyyk',
    '..kyyk.',
    '.kyyk..',
    '.kyk...',
    'kyk....',
    'kk.....',
  ],
};
export type ArtKey = keyof typeof ART;

// A pixel sprite. `build` (0..1+) assembles it pixel by pixel; each pixel pops with its own delay.
export const Pixels: React.FC<{art: ArtKey; px: number; build?: number; seed?: number}> = ({art, px, build = 1, seed = 1}) => {
  const rows = ART[art], w = rows[0].length, h = rows.length;
  const cells = useMemo(() => {
    const out: {x: number; y: number; c: string; d: number}[] = [];
    rows.forEach((r, y) => r.split('').forEach((ch, x) => {if (ch !== '.') out.push({x, y, c: PAL[ch], d: rnd(x * 31 + y * 17 + seed) * 0.7});}));
    return out;
  }, [art, seed]);
  return (
    <svg width={w * px} height={h * px} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" style={{display: 'block', overflow: 'visible'}}>
      {cells.map((p, i) => {
        const t = Math.max(0, Math.min(1, (build - p.d) / 0.3));
        if (t <= 0) return null;
        const k = OUT(t);
        return <rect key={i} x={p.x + 0.5 - k / 2} y={p.y + 0.5 - k / 2 + (1 - k) * -1.5} width={k} height={k} fill={p.c} opacity={Math.min(1, t * 2)} />;
      })}
    </svg>
  );
};
export const artSize = (art: ArtKey, px: number) => ({w: ART[art][0].length * px, h: ART[art].length * px});

// ---------- type ----------
export const Words: React.FC<{text: string; at: number; out?: number; y: number; size?: number; color?: string}> = ({text, at, out, y, size = 44, color = INK}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  const o = out === undefined ? 1 : 1 - ease(f, s(out) - 8, s(out), IN);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: o}}>
      {words.map((wd, i) => {
        const p = ease(f, s(at) + i * 7, s(at) + i * 7 + 18, OUT);
        return <span key={i} style={{display: 'inline-block', marginRight: '0.28em', fontFamily: SANS, fontWeight: 500, fontSize: size, letterSpacing: -0.5, color, opacity: p, transform: `translateY(${(1 - p) * 14}px)`, filter: `blur(${(1 - p) * 4}px)`}}>{wd}</span>;
      })}
    </div>
  );
};

// ---------- scenes ----------
export const Paper: React.FC = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%, rgba(0,0,0,0.12) 100%)'}} />
  </AbsoluteFill>
);

export const Shine: React.FC = () => {
  useShineFonts();
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const tall = H / W > 1.5;
  const cx = W / 2, textY = H * (tall ? 0.66 : 0.72), iconY = H * (tall ? 0.42 : 0.4);
  const sec = f / FPS;

  // S1 Singapore, S2 booth (pixel builds; outgoing sprite scatters away)
  const sprite = (art: ArtKey, px: number, from: number, to: number, seed: number) => {
    const build = (sec - from - 0.15) / 0.9;
    const leave = ease(f, s(to) - 10, s(to), IN);
    if (sec < from || sec > to) return null;
    const {w, h} = artSize(art, px);
    return (
      <div style={{position: 'absolute', left: cx - w / 2, top: iconY - h / 2 + leave * -40, opacity: 1 - leave, transform: `scale(${1 + 0.03 * Math.sin(sec * 1.6)})`}}>
        <Pixels art={art} px={px} build={build} seed={seed} />
      </div>
    );
  };

  // S3 ball: drops with three bounces, rests, then is kicked along the green line
  const ground = iconY + 120, R = 13 * 9 / 2;
  const ballY = (() => {
    const t = sec - T.s3 - 0.15;
    if (t < 0) return -300;
    const drop = 0.55, h0 = ground + 300;
    if (t < drop) return -300 + h0 * (t / drop) ** 2;
    let tt = t - drop, hgt = 260, dur = 0.5;
    for (let i = 0; i < 3; i++) {
      if (tt < dur) {const u = tt / dur; return ground - hgt * 4 * u * (1 - u);}
      tt -= dur; hgt *= 0.42; dur *= 0.62;
    }
    return ground;
  })();
  const squash = (() => {const d = Math.abs(ballY - ground); return d < 8 && sec > T.s3 + 0.6 ? 1 - (8 - d) / 40 : 1;})();

  // S4 the green line: from the ball, up-right into an orbit ellipse, drawn behind the ball
  const ex = W * 0.36, ey = W * 0.12, ocy = iconY + 10;
  const pathPt = (u: number): [number, number] => {
    // u in [0, 1]: 0..0.25 bezier from ball to ellipse right point, 0.25..1 one full loop of the ellipse
    if (u <= 0.25) {
      const t = u / 0.25, a: [number, number] = [cx, ground], c: [number, number] = [cx + W * 0.5, ground + 40], b: [number, number] = [cx + ex, ocy];
      return [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
    }
    const th = -((u - 0.25) / 0.75) * Math.PI * 2;
    return [cx + ex * Math.cos(th), ocy + ey * Math.sin(th)];
  };
  const travel = INOUT(Math.max(0, Math.min(1, (sec - T.kick) / 1.7)));
  const ringFade = interpolate(sec, [T.kick + 1.7, T.kick + 2.4], [1, 0], clamp);
  const linePts = useMemo(() => Array.from({length: 241}, (_, i) => pathPt(i / 240)), [W, H]);
  const drawn = linePts.slice(0, Math.max(2, Math.round(travel * 240) + 1));
  const ballPos: [number, number] = sec < T.kick ? [cx, ballY] : pathPt(travel);
  const ballRot = sec < T.kick ? 0 : travel * 720;
  const ballScale = sec < T.kick ? 1 : 1 - 0.35 * travel;

  // Orbit: icons join the ring after the ball, then spin out before the cut
  const ORBIT: ArtKey[] = ['ball', 'heart', 'coin', 'jersey', 'trophy', 'mbs', 'bolt', 'booth'];
  const orbitOn = sec >= T.kick + 1.7 && sec < T.dark;
  const spin = sec - (T.kick + 1.7);
  const exitP = ease(f, s(T.dark) - 26, s(T.dark), IN);

  // S5/S6 dark: "day 2.", then letters gather into "it's time to shine."
  const LINE = "it's time to shine.";
  const glow = interpolate(sec, [T.dark, T.letters + 1.5, T.logo, T.logo + 0.6], [0.15, 0.5, 1, 0.55], clamp);

  return (
    <AbsoluteFill style={{background: PAPER, overflow: 'hidden'}}>
      {sec < T.dark ? (
        <>
          <Paper />
          {sprite('mbs', tall ? 22 : 19, T.s1 + 0.25, T.s2, 3)}
          {sprite('booth', tall ? 30 : 26, T.s2, T.s3, 7)}
          <Words text="we came to singapore." at={0.35} out={T.s2} y={textY} />
          <Words text="we built a booth." at={T.s2 + 0.2} out={T.s3} y={textY} />
          <Words text="we brought a ball." at={T.s3 + 0.25} out={T.kick} y={textY} />
          <Words text="and one green line." at={T.kick + 0.25} out={T.kick + 1.9} y={textY} />
          <Words text="that brings everyone together." at={T.kick + 2.0} out={T.dark} y={textY} />
          {/* the line */}
          {sec >= T.kick ? (
            <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
              <polyline points={drawn.map((p) => p.join(',')).join(' ')} fill="none" stroke={GREEN} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={0.25 + 0.75 * ringFade} />
            </svg>
          ) : null}
          {/* ground shadow + ball */}
          {sec >= T.s3 && sec < T.kick + 1.7 ? (
            <>
              {sec < T.kick + 0.3 ? <div style={{position: 'absolute', left: cx - 70, top: ground + R - 6, width: 140, height: 14, borderRadius: '50%', background: 'rgba(0,0,0,0.18)', filter: 'blur(4px)',
                transform: `scaleX(${interpolate(ground - ballY, [0, 400], [1, 0.3], clamp)})`, opacity: interpolate(sec, [T.kick, T.kick + 0.3], [1, 0], clamp)}} /> : null}
              <div style={{position: 'absolute', left: ballPos[0] - R, top: ballPos[1] - R, transform: `rotate(${ballRot}deg) scale(${ballScale}) scaleY(${squash}) scaleX(${2 - squash})`, transformOrigin: '50% 100%'}}>
                <Pixels art="ball" px={9} />
              </div>
            </>
          ) : null}
          {orbitOn ? ORBIT.map((art, i) => {
            const join = i * 0.11, p = sec < T.kick + 1.7 + join ? 0 : sp(f - s(T.kick + 1.7 + join), 12, 220);
            const th = -Math.PI * 2 * (i / ORBIT.length) - spin * (0.9 + exitP * 4);
            const depth = (Math.sin(th) + 1) / 2; // 0 back, 1 front
            const rr = 1 + exitP * 1.8;
            const x = cx + ex * rr * Math.cos(th), y = ocy + ey * rr * Math.sin(th);
            const px = art === 'mbs' ? 5 : art === 'booth' ? 6 : 9;
            const {w, h} = artSize(art, px);
            const sc = p * (0.7 + 0.45 * depth);
            return (
              <div key={art} style={{position: 'absolute', left: x - w / 2, top: y - h / 2, zIndex: Math.round(depth * 100), opacity: 1 - exitP,
                transform: `scale(${sc}) rotate(${Math.sin(spin * 2 + i) * 6}deg)`, filter: `drop-shadow(0 ${6 + depth * 8}px ${4 + depth * 6}px rgba(0,0,0,0.18))`}}>
                <Pixels art={art} px={px} seed={i + 11} />
              </div>
            );
          }) : null}
          <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'multiply', opacity: 0.12}} />
        </>
      ) : (
        <AbsoluteFill style={{background: '#050605'}}>
          {/* the light rising */}
          <AbsoluteFill style={{background: `radial-gradient(ellipse ${W * 0.9}px ${H * 0.55}px at 50% ${110 - glow * 40}%, rgba(184,242,106,${0.55 * glow}) 0%, rgba(126,194,90,${0.18 * glow}) 40%, rgba(0,0,0,0) 72%)`}} />
          {sec < T.letters + 0.3 ? <Words text="day 2." at={T.dark + 0.2} out={T.letters} y={H * 0.48} color="#EDEDE8" /> : null}
          {sec >= T.letters && sec < T.logo + 0.4 ? (
            <div style={{position: 'absolute', left: 0, right: 0, top: H * 0.47, textAlign: 'center', opacity: 1 - ease(f, s(T.logo) - 4, s(T.logo) + 20, IN)}}>
              {LINE.split('').map((ch, i) => {
                const st = s(T.letters) + i * 2.4, p = f < st ? 0 : Math.min(1, sp(f - st, 16, 110));
                const dx = (rnd(i + 3) - 0.5) * W * 1.1, dy = (rnd(i + 41) - 0.5) * H * 0.9, rot = (rnd(i + 77) - 0.5) * 220, sc = 0.5 + rnd(i + 9) * 1.4;
                const isShine = i >= LINE.indexOf('shine');
                return (
                  <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', fontFamily: SANS, fontWeight: isShine ? 600 : 500, fontSize: 46, letterSpacing: -0.5,
                    color: isShine ? LIME : '#EDEDE8', textShadow: isShine ? `0 0 ${18 * glow}px rgba(184,242,106,0.8)` : undefined,
                    transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p)}px) rotate(${rot * (1 - p)}deg) scale(${sc + (1 - sc) * p})`, opacity: 0.25 + 0.75 * p}}>{ch}</span>
                );
              })}
            </div>
          ) : null}
          {sec >= T.logo ? (
            <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34}}>
              <Img src={staticFile('brand/logo-official-white.png')} style={{width: W * 0.4, height: (W * 0.4 * 328) / 2005, opacity: ease(f, s(T.logo) + 6, s(T.logo) + 30), transform: `scale(${0.96 + 0.04 * ease(f, s(T.logo), s(T.logo) + 60, OUT)})`}} />
              <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: 3, color: '#9AA09B', textAlign: 'center', lineHeight: 1.8, opacity: ease(f, s(T.logo + 0.9), s(T.logo + 0.9) + 24)}}>
                TOKEN2049 SINGAPORE · DAY 2<br />LEVEL 5 · PB5-5 + PB5-6
              </div>
            </AbsoluteFill>
          ) : null}
          <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.2}} />
        </AbsoluteFill>
      )}
      <Audio src={staticFile('shine/music.mp3')} volume={(fr) => interpolate(fr, [0, 10, SHINE_DURATION - 70, SHINE_DURATION], [0, 0.8, 0.8, 0], clamp)} />
      {[T.s1 + 0.4, T.s2 + 0.2].map((t) => <Sequence key={t} from={s(t)} durationInFrames={40} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.25} /></Sequence>)}
      {[0.7, 1.2, 1.51].map((t) => <Sequence key={t} from={s(T.s3 + t)} durationInFrames={40} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.5 * (1.7 - t)} /></Sequence>)}
      <Sequence from={s(T.kick) - 6} durationInFrames={70} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.45} /></Sequence>
      <Sequence from={s(T.dark) - 50} durationInFrames={70} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.3} /></Sequence>
      <Sequence from={s(T.logo) - 1} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};
