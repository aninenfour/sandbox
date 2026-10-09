// "That's a wrap": TOKEN2049 Singapore wrap-up, the sequel to "Time to shine" (src/shine).
// Same paper canvas, small type and pulse grid, but built from the real booth photos:
// each photo resolves from big pixels to sharp, they pile up ("tons of meetings"), the green line
// loops through them, everything collapses, then dark: the announcement line and "that's a wrap."
// Photo assets come from scripts/make-wrap.py (public/wrap). Music: "Digital Clouds" (Mixkit).
import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IN, INOUT, OUT, clamp, ease, sp} from '../alt/kit';
import {Paper, Pixels, Words, artSize, rnd, useShineFonts} from '../shine/Shine';

const FPS = 60;
const P = 0.9295, P0 = 2.51;
const pulse = (n: number) => P0 + n * P;
const s = (sec: number) => Math.round(sec * FPS);
const T = {booth: pulse(0), ball: pulse(2), flood: pulse(4), line: pulse(8), dark: pulse(10), letters: pulse(12), logo: pulse(15), end: pulse(18)};
export const WRAP_DURATION = s(T.end);
const PAPER = '#E7E5E0', LIME = '#B8F26A', GREEN = '#7EC25A';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';

const FLOOD = ['p3', 's2', 'p11', 't1', 'p15', 's3', 'p14', 'p24', 's4', 'p5', 't2', 'p19', 's7', 'p25', 'p12', 't3',
  'p21', 's8', 'p26', 'p10', 's5', 't4', 'p17', 'p9', 's1', 'p20', 's6', 'p13', 'p27', 't5', 'p4', 's9'];
const DEAL = (4 * P) / FLOOD.length; // one card every 1/8 pulse

// pixel resolve: step through mosaic levels, then the sharp image
const resolve = (base: string, levels: number[], t: number, step: number) => {
  const i = Math.floor(t / step);
  return staticFile(i < levels.length ? `wrap/${base}_m${levels[Math.max(0, i)]}.jpg` : `wrap/${base}.jpg`);
};

const Polaroid: React.FC<{src: string; w: number; h: number; border: number; style?: React.CSSProperties}> = ({src, w, h, border, style}) => (
  <div style={{position: 'absolute', width: w, height: h, background: '#FBFAF7', padding: border, boxSizing: 'border-box', boxShadow: '0 18px 34px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.12)', ...style}}>
    <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
  </div>
);

export const Wrap: React.FC = () => {
  useShineFonts();
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const tall = H / W > 1.5;
  const sec = f / FPS;
  const cx = W / 2, textY = H * (tall ? 0.71 : 0.76), iconY = H * (tall ? 0.42 : 0.4);

  // ---- pile layout ----
  const CS = tall ? 300 : 250;
  const cols = tall ? 3 : 4, rows = tall ? 4 : 3;
  const ax0 = tall ? 200 : 170, ax1 = W - ax0, ay0 = tall ? 330 : 190, ay1 = tall ? 1110 : 790;
  const cards = useMemo(() => {
    const slots = cols * rows;
    return FLOOD.map((name, i) => {
      const layer = Math.floor(i / slots), k = i % slots;
      // per layer, visit the slots in a shuffled order so the pile does not fill row by row
      const order = Array.from({length: slots}, (_, j) => j).sort((a, b) => rnd(a * 7 + layer * 101) - rnd(b * 7 + layer * 101));
      const slot = order[k], c = slot % cols, r = Math.floor(slot / cols);
      const x = ax0 + (c / (cols - 1)) * (ax1 - ax0) + (rnd(i * 13 + 1) - 0.5) * 70 + layer * 18;
      const y = ay0 + (r / (rows - 1)) * (ay1 - ay0) + (rnd(i * 17 + 5) - 0.5) * 60 - layer * 14;
      return {name, x, y, rot: (rnd(i * 23 + 9) - 0.5) * 16, rot0: (rnd(i * 29 + 3) - 0.5) * 50, at: T.flood + i * DEAL};
    });
  }, [W, H]);

  // ---- green line: closed loop through the top layer, ordered by angle around the pile centre ----
  const pcy = (ay0 + ay1) / 2;
  const top = useMemo(() => cards.slice(-8).map((c) => ({...c, a: Math.atan2(c.y - pcy, c.x - cx)})).sort((a, b) => a.a - b.a), [cards]);
  const loop = useMemo(() => {
    const pts = top.map((c) => [c.x, c.y]), n = pts.length, out: number[][] = [];
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      for (let t = 0; t < 1; t += 1 / 40) {
        const t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map((d) => 0.5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)));
      }
    }
    out.push(out[0]);
    return out;
  }, [top]);
  const lineP = INOUT(Math.max(0, Math.min(1, (sec - T.line - 0.1) / 1.6)));
  const drawn = loop.slice(0, Math.max(2, Math.round(lineP * (loop.length - 1)) + 1));

  // ---- collapse into the centre just before the cut ----
  const col = ease(f, s(T.dark) - 27, s(T.dark), IN);

  // ---- heroes ----
  const HW = tall ? 940 : 800, HH = HW * 0.75, hy = H * 0.4;
  const hero = (name: string, from: number, to: number, r: number, seed: number) => {
    if (sec < from || sec > to + 0.5) return null;
    const t = sec - from, inP = sp(f - s(from), 16, 140);
    const outP = ease(f, s(to), s(to) + 22, IN);
    return (
      <Polaroid src={resolve(`h_${name}`, [8, 16, 32, 64], t - 0.05, 0.11)} w={HW} h={HH} border={tall ? 18 : 16}
        style={{left: cx - HW / 2 + outP * -W * 0.9 * (seed % 2 ? -1 : 1), top: hy - HH / 2 + outP * 80, opacity: Math.min(1, t * 8),
          transform: `rotate(${r + outP * 14 * (seed % 2 ? 1 : -1)}deg) scale(${0.92 + 0.08 * inP})`}} />
    );
  };

  // pixel Singapore for the opener
  const mbsPx = tall ? 22 : 19, mbs = artSize('mbs', mbsPx);
  const mbsLeave = ease(f, s(T.booth) - 10, s(T.booth), IN);

  const LINE = "that's a wrap.";
  const glow = interpolate(sec, [T.dark, T.letters + 1.5, T.logo, T.logo + 0.6], [0.15, 0.5, 1, 0.55], clamp);

  return (
    <AbsoluteFill style={{background: PAPER, overflow: 'hidden'}}>
      {sec < T.dark ? (
        <>
          <Paper />
          {sec < T.booth ? (
            <div style={{position: 'absolute', left: cx - mbs.w / 2, top: iconY - mbs.h / 2 - mbsLeave * 40, opacity: 1 - mbsLeave}}>
              <Pixels art="mbs" px={mbsPx} build={(sec - 0.4) / 0.9} seed={5} />
            </div>
          ) : null}
          <Words text="two days in singapore." at={0.35} out={T.booth} y={textY} />
          {hero('p7', T.booth, T.ball, -1.6, 1)}
          {hero('p18', T.ball, T.flood, 1.4, 2)}
          <Words text="one green booth." at={T.booth + 0.3} out={T.ball} y={textY} />
          <Words text="one football challenge." at={T.ball + 0.3} out={T.flood} y={textY} />
          <Words text="tons of meetings." at={T.flood + 0.3} out={T.line} y={textY} />
          <Words text="good people. real conversations." at={T.line + 0.25} out={T.dark - 0.35} y={textY} />
          {/* the pile */}
          {cards.map((c, i) => {
            if (sec < c.at) return null;
            const t = sec - c.at, p = sp(f - s(c.at), 13, 170);
            const k = top.findIndex((q) => q.name === c.name);
            const hitAt = k < 0 ? -1 : T.line + 0.1 + 1.6 * (k / top.length);
            const bump = hitAt > 0 && sec > hitAt ? Math.exp(-(sec - hitAt) * 7) * Math.sin((sec - hitAt) * 18) * 0.05 : 0;
            const x = c.x + (cx - c.x) * col, y = c.y + (pcy - c.y) * col;
            return (
              <Polaroid key={c.name} src={resolve(`c_${c.name}`, [6, 12, 24], t, 0.075)} w={CS} h={CS} border={tall ? 10 : 9}
                style={{left: x - CS / 2, top: y - CS / 2, opacity: Math.min(1, t * 10),
                  transform: `rotate(${c.rot * (1 - col) + c.rot0 * (1 - p)}deg) scale(${(1.35 - 0.35 * p + bump) * (1 - 0.8 * col)})`}} />
            );
          })}
          {/* the green line on top of the pile, with a lime node at each card */}
          {sec >= T.line ? (
            <>
            <AbsoluteFill style={{background: PAPER, opacity: 0.4 * ease(f, s(T.line), s(T.line) + 20) * (1 - col)}} />
            <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 1 - col}}>
              <polyline points={drawn.map((p) => p.join(',')).join(' ')} fill="none" stroke="#161616" strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={drawn.map((p) => p.join(',')).join(' ')} fill="none" stroke={GREEN} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
              {top.map((c, k) => {
                const at = T.line + 0.1 + 1.6 * (k / top.length);
                const q = sec < at ? 0 : sp(f - s(at), 10, 260);
                return <circle key={k} cx={c.x} cy={c.y} r={18 * q} fill={LIME} stroke="#161616" strokeWidth={4 * q} />;
              })}
            </svg>
            </>
          ) : null}
          <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'multiply', opacity: 0.12}} />
        </>
      ) : (
        <AbsoluteFill style={{background: '#050605'}}>
          <AbsoluteFill style={{background: `radial-gradient(ellipse ${W * 0.9}px ${H * 0.55}px at 50% ${110 - glow * 40}%, rgba(184,242,106,${0.55 * glow}) 0%, rgba(126,194,90,${0.18 * glow}) 40%, rgba(0,0,0,0) 72%)`}} />
          {sec < T.letters + 0.3 ? (
            <>
              <Words text="solid announcements" at={T.dark + 0.2} out={T.letters} y={H * 0.455} color="#EDEDE8" />
              <Words text="are coming next." at={T.dark + 0.75} out={T.letters} y={H * 0.455 + 62} color={LIME} />
            </>
          ) : null}
          {sec >= T.letters && sec < T.logo + 0.4 ? (
            <div style={{position: 'absolute', left: 0, right: 0, top: H * 0.47, textAlign: 'center', opacity: 1 - ease(f, s(T.logo) - 4, s(T.logo) + 20, IN)}}>
              {LINE.split('').map((ch, i) => {
                const st = s(T.letters) + i * 3, p = f < st ? 0 : Math.min(1, sp(f - st, 16, 110));
                const dx = (rnd(i + 5) - 0.5) * W * 1.1, dy = (rnd(i + 43) - 0.5) * H * 0.9, rot = (rnd(i + 79) - 0.5) * 220, sc = 0.5 + rnd(i + 11) * 1.4;
                const isWrap = i >= LINE.indexOf('wrap');
                return (
                  <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', fontFamily: SANS, fontWeight: isWrap ? 600 : 500, fontSize: 58, letterSpacing: -0.8,
                    color: isWrap ? LIME : '#EDEDE8', textShadow: isWrap ? `0 0 ${18 * glow}px rgba(184,242,106,0.8)` : undefined,
                    transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p)}px) rotate(${rot * (1 - p)}deg) scale(${sc + (1 - sc) * p})`, opacity: 0.25 + 0.75 * p}}>{ch}</span>
                );
              })}
            </div>
          ) : null}
          {sec >= T.logo ? (
            <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34}}>
              <Img src={staticFile('brand/logo-official-white.png')} style={{width: W * 0.4, height: (W * 0.4 * 328) / 2005, opacity: ease(f, s(T.logo) + 6, s(T.logo) + 30), transform: `scale(${0.96 + 0.04 * ease(f, s(T.logo), s(T.logo) + 60, OUT)})`}} />
              <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: 3, color: '#9AA09B', textAlign: 'center', lineHeight: 1.8, opacity: ease(f, s(T.logo + 0.9), s(T.logo + 0.9) + 24)}}>
                TOKEN2049 SINGAPORE · 7–8 OCT 2026<br /><span style={{color: LIME}}>STAY TUNED</span>
              </div>
            </AbsoluteFill>
          ) : null}
          <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.2}} />
        </AbsoluteFill>
      )}
      <Audio src={staticFile('shine/music.mp3')} volume={(fr) => interpolate(fr, [0, 10, WRAP_DURATION - 80, WRAP_DURATION], [0, 0.8, 0.8, 0], clamp)} />
      {[0.5, T.booth + 0.05, T.ball + 0.05].map((t) => <Sequence key={t} from={s(t)} durationInFrames={40} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.25} /></Sequence>)}
      {cards.map((c, i) => <Sequence key={c.name} from={s(c.at)} durationInFrames={30} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={i % 2 ? 0.07 : 0.11} /></Sequence>)}
      <Sequence from={s(T.line + 1.7)} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/mechanical/connect.mp3')} volume={0.2} /></Sequence>
      <Sequence from={s(T.dark) - 30} durationInFrames={70} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.4} /></Sequence>
      <Sequence from={s(T.letters) - 50} durationInFrames={70} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.28} /></Sequence>
      <Sequence from={s(T.logo) - 1} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};
