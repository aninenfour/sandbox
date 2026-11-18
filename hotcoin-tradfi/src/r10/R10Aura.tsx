// Ronaldinho x Hotcoin, "aura" edit (16:9). Same footage as R10Ambassador (public/ronaldinho/key.webm, voice.wav).
// Music: "Thunder" (Mixkit music 318, Mixkit free licence), 95.0 BPM, beat grid fitted by spectral flux:
//   beat k at 60.298 + 0.6316 k s; downbeat at 82.404 s (hardest section, CLAP "aggressive dark phonk" 1.00).
//   Track time = comp time + OFFSET, so the 82.404 s downbeat lands on DROP. The track fades out on its own at the end.
// Intro (team feedback 2026-11-17): frame 0 is a clear cover (Hotcoin x Ronaldinho + both ambassador lines + real photo),
//   then four quick Hotcoin facts (hotcoin.com/en_US/about) before he appears. Outro: "Hotcoin welcomes our ambassador".
// Rules: end card carries "Hotcoin Ambassador (Brazil)" + "Embaixador da Hotcoin (Brasil)";
//   no text hidden behind him (words sit either side); no deep end boom.
import React from 'react';
import '@fontsource/inter-tight/800.css';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

export const R10AURA_FPS = 30;
const BEAT = 60 / 95;                       // 0.6316 s
const INTRO_BEATS = 7;                      // cover (1 beat) + stats panel builds (4 beats) and holds (2 beats), then he appears
const DROP_S = INTRO_BEATS * BEAT;          // 1.26 s
const OFFSET = 82.404 - DROP_S;             // track seconds = comp seconds + OFFSET
const V_S = DROP_S + 0.3;                   // his clip starts
const CLIP = 5.68;
const fr = (s: number) => Math.round(s * R10AURA_FPS);
const beatS = (k: number) => k * BEAT;      // comp seconds of beat k (beat 0 = comp 0)
const DROP = fr(DROP_S), V = fr(V_S), CLIP_END = fr(V_S + CLIP);
// outro on the grid: words on beats 16, 17, 18; end card on beat 19
const OB = INTRO_BEATS + 10;               // outro words land on the same beats of the track as before
const OUT1 = fr(beatS(OB)), OUT2 = fr(beatS(OB + 1)), OUT3 = fr(beatS(OB + 2)), END = fr(beatS(OB + 3));
// the intro was 6 beats; everything after the drop sits at the same track time, so shift track-anchored frames
const SHIFT = fr(beatS(6 - INTRO_BEATS));
export const R10AURA_DURATION = 432 - SHIFT;   // ~11.9 s; music fully faded before the track's last two 808 hits

const INK = '#050607', LIME = '#B8F26A', GREEN = '#7EC25A', WHITE = '#F3F5F1';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace', SERIF = '"Instrument Serif", serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
// layout is set per render from the composition size (16:9 or 9:16), like AuraEdit
let W = 1920, H = 1080, TALL = false;

// beat phase helpers (in frames)
const beatIndex = (f: number) => Math.floor(f / R10AURA_FPS / BEAT);
const sinceBeat = (f: number) => f - fr(beatS(beatIndex(f)));
const pulse = (f: number, decay = 7) => Math.exp(-sinceBeat(f) / decay);          // 1 on each beat, decays
const barPulse = (f: number) => (beatIndex(f) % 4 === 0 ? pulse(f, 9) : 0);

// ---------- background patterns ----------
const Rays: React.FC<{f: number; o: number}> = ({f, o}) => (
  <AbsoluteFill style={{opacity: o, mixBlendMode: 'screen'}}>
    <div style={{position: 'absolute', left: W / 2 - 1400, top: (TALL ? 700 : H * 0.42) - 1400, width: 2800, height: 2800, borderRadius: '50%', transform: `rotate(${f * 0.25}deg)`,
      background: 'repeating-conic-gradient(from 0deg, rgba(184,242,106,.10) 0deg 3deg, rgba(184,242,106,0) 3deg 15deg)',
      WebkitMaskImage: 'radial-gradient(closest-side, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 72%)', maskImage: 'radial-gradient(closest-side, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 72%)'}} />
  </AbsoluteFill>
);

const Halftone: React.FC<{f: number; o: number}> = ({f, o}) => {
  const p = pulse(f, 8);
  const size = 3.2 + p * 2.2;
  return (
    <AbsoluteFill style={{opacity: o,
      backgroundImage: `radial-gradient(circle, rgba(184,242,106,.55) ${size / 2}px, rgba(0,0,0,0) ${size / 2 + 0.8}px)`, backgroundSize: '22px 22px',
      backgroundPosition: `${(f * 0.6) % 22}px 0px`,
      WebkitMaskImage: `radial-gradient(ellipse 55% 60% at 50% 46%, rgba(0,0,0,${0.15 + p * 0.25}) 0%, rgba(0,0,0,.9) 60%, rgba(0,0,0,0) 100%)`,
      maskImage: `radial-gradient(ellipse 55% 60% at 50% 46%, rgba(0,0,0,${0.15 + p * 0.25}) 0%, rgba(0,0,0,.9) 60%, rgba(0,0,0,0) 100%)`}} />
  );
};

// sonar rings born on every beat from the centre
const Rings: React.FC<{f: number; o: number; cy?: number}> = ({f, o, cy = TALL ? 700 : H * 0.44}) => {
  const k = beatIndex(f);
  return (
    <AbsoluteFill style={{opacity: o}}>
      {[0, 1, 2, 3].map((j) => {
        const born = fr(beatS(k - j));
        const age = (f - born) / (BEAT * R10AURA_FPS * 4);
        if (age < 0 || age > 1) return null;
        const r = 160 + age * 1100;
        return <div key={j} style={{position: 'absolute', left: W / 2 - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%',
          border: `${3 - age * 2}px solid rgba(184,242,106,${(1 - age) * 0.55})`, boxShadow: `0 0 ${30 * (1 - age)}px rgba(184,242,106,${(1 - age) * 0.35})`}} />;
      })}
    </AbsoluteFill>
  );
};

const Grain: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '256px 256px', backgroundPosition: `${(f * 37) % 256}px ${(f * 91) % 256}px`, opacity: 0.09, mixBlendMode: 'screen'}} />
);

// ---------- intro (team feedback 2026-11-17): text-only cover, then a Hotcoin stats panel; he is not shown before the drop ----------
const EN = 'Hotcoin Ambassador (Brazil)', PT = 'Embaixador da Hotcoin (Brasil)';
const COVER_END = fr(beatS(1));      // frame 0 = cover (thumbnail), held one beat
// line reveal: text slides up from behind its own baseline (no zoom, no blur)
const Reveal: React.FC<{f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({f, at, dur = 9, children, style}) => {
  const p = interpolate(f, [at, at + dur], [0, 1], {...clamp, easing: ease});
  return <div style={{overflow: 'hidden', paddingBottom: '0.08em', ...style}}><div style={{transform: `translateY(${(1 - p) * 110}%)`}}>{children}</div></div>;
};
const Lockup: React.FC<{logoH: number; nameSize: number; align: 'flex-start' | 'center'}> = ({logoH, nameSize, align}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: align, gap: logoH * 0.35}}>
    <Img src={staticFile('brand/logo-official-white.png')} style={{height: logoH}} />
    <div style={{display: 'flex', alignItems: 'baseline', gap: nameSize * 0.22}}>
      <span style={{fontFamily: SANS, fontWeight: 800, fontSize: nameSize * 0.7, color: LIME, lineHeight: 1}}>×</span>
      <span style={{fontFamily: SANS, fontWeight: 800, fontSize: nameSize, letterSpacing: -nameSize * 0.03, color: WHITE, lineHeight: 1}}>RONALDINHO</span>
    </div>
  </div>
);
// frame 0 = cover: Hotcoin x Ronaldinho + both ambassador lines, text only
const Cover: React.FC<{f: number}> = ({f}) => {
  if (f >= COVER_END + 8) return null;
  const out = interpolate(f, [COVER_END, COVER_END + 8], [0, 1], {...clamp, easing: ease});
  const size = TALL ? 56 : 60;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - out, transform: `translateY(${-out * 60}px)`}}>
      {/* Hotcoin is the hero (team 2026-11-18): big logo, his name smaller; ambassador lines live on the end card */}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: TALL ? 44 : 40, textAlign: 'center'}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{height: TALL ? 132 : 170}} />
        <div style={{width: 140, height: 4, background: LIME}} />
        <div style={{display: 'flex', alignItems: 'baseline', gap: 22}}>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: size * 1.1, color: LIME, lineHeight: 1}}>×</span>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: size * 1.45, letterSpacing: 4, color: WHITE, lineHeight: 1}}>RONALDINHO</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Facts: hotcoin.com/en_US/about (checked 2026-11-17): founded 2017, 8.1M+ registered users, 120+ countries and regions,
// 300+ spot + 500+ futures pairs = 800+ trading pairs (team asked for 800, 2026-11-18). Labels in Portuguese (team: visuals in PT).
const FACTS: {to: number; dec: number; pre: string; suf: string; label: string; en: string}[] = [
  {to: 2017, dec: 0, pre: '', suf: '', label: 'Ano de fundação', en: 'Founded'},
  {to: 8.1, dec: 1, pre: '', suf: 'M+', label: 'Usuários registrados', en: 'Registered users'},
  {to: 120, dec: 0, pre: '', suf: '+', label: 'Países e regiões', en: 'Countries and regions'},
  {to: 800, dec: 0, pre: '', suf: '+', label: 'Pares de negociação', en: 'Trading pairs'},
];
const FACT_AT = (i: number) => fr(beatS(1 + i));
const Facts: React.FC<{f: number}> = ({f}) => {
  if (f < COVER_END || f >= DROP) return null;
  const out = interpolate(f, [DROP - 6, DROP], [0, 1], clamp);
  const num = TALL ? 150 : 176, lab = TALL ? 46 : 50;
  const cell = (x: typeof FACTS[0], i: number) => {
    const at = FACT_AT(i);
    const cnt = x.to === 2017 ? 2017 : interpolate(f, [at, at + 14], [0, x.to], {...clamp, easing: ease});   // the year is not counted
    const line = interpolate(f, [at - 2, at + 10], [0, 1], {...clamp, easing: ease});
    return (
      <div key={i} style={{position: 'relative', paddingTop: TALL ? 18 : 22}}>
        <div style={{position: 'absolute', left: 0, top: 0, height: 3, width: `${line * 100}%`, background: LIME}} />
        <Reveal f={f} at={at}><div style={{fontFamily: SANS, fontWeight: 800, fontSize: num, lineHeight: 1, letterSpacing: -num * 0.04, color: WHITE}}>{x.pre}{cnt.toFixed(x.dec)}{x.suf}</div></Reveal>
        <Reveal f={f} at={at + 3}><div style={{fontFamily: SANS, fontWeight: 600, fontSize: lab, lineHeight: 1.15, color: LIME, marginTop: 8}}>{x.label}</div></Reveal>
        <Reveal f={f} at={at + 6}><div style={{fontFamily: SANS, fontWeight: 500, fontSize: lab * 0.72, lineHeight: 1.2, color: 'rgba(243,245,241,.7)', marginTop: 4}}>{x.en}</div></Reveal>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div style={{position: 'absolute', left: TALL ? 90 : 150, right: TALL ? 90 : 150, top: TALL ? 360 : 200}}>
        <Reveal f={f} at={COVER_END}><Img src={staticFile('brand/logo-official-white.png')} style={{height: TALL ? 64 : 58}} /></Reveal>
        <div style={{display: 'grid', gridTemplateColumns: TALL ? '1fr' : '1fr 1fr', columnGap: 120, rowGap: TALL ? 54 : 50, marginTop: TALL ? 70 : 56}}>
          {FACTS.map(cell)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- him ----------
const Person: React.FC<{f: number}> = ({f}) => {
  if (f < DROP) return null;
  const PS = TALL ? 0.95 : 0.7, PW = 1500 * PS, PH = 1620 * PS;
  const enter = interpolate(f, [DROP, DROP + 8], [0, 1], {...clamp, easing: ease});
  const exit = interpolate(f, [OUT1 - 2, OUT1 + 6], [0, 1], {...clamp, easing: ease});
  const p = pulse(f, 6), bp = barPulse(f);
  const zoom = 1 + (1 - enter) * 0.25;   // steady: no beat pulse (team feedback)
  const shake = 0;
  const sx = Math.sin(f * 2.3) * shake, sy = Math.cos(f * 1.7) * shake;
  const glow = 26;
  const left = W / 2 - PW / 2, top = H - PH + (TALL ? 70 : 40);
  const style: React.CSSProperties = {width: PW, height: PH};
  const grade = `grayscale(1) contrast(1.06) brightness(1.14) drop-shadow(0 0 ${glow}px rgba(184,242,106,.55)) drop-shadow(0 0 4px rgba(184,242,106,.8))`;
  const clipFrame = Math.min(f, CLIP_END - 1);
  const media = (extra: React.CSSProperties) => (f < V
    ? <Img src={staticFile('ronaldinho/first.png')} style={{...style, ...extra}} />
    : f >= CLIP_END
      ? <Img src={staticFile('ronaldinho/last.png')} style={{...style, ...extra}} />
      : null);
  return (
    <div style={{position: 'absolute', left, top, width: PW, height: PH, opacity: enter * (1 - exit),
      transform: `translate(${sx}px, ${sy - exit * 60}px) scale(${zoom * (1 - exit * 0.1)})`, transformOrigin: '50% 35%'}}>
      {/* echo trail: a lime ghost that blooms out on each bar */}
      {false && bp > 0.05 && f >= V && f < CLIP_END && (
        <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + (1 - bp) * 0.12})`, opacity: bp * 0.45, filter: 'brightness(0) invert(1) sepia(1) saturate(6) hue-rotate(40deg) blur(2px)'}}>
          <Sequence from={V} durationInFrames={CLIP_END - V} layout="none">
            <OffthreadVideo src={staticFile('ronaldinho/key.webm')} transparent muted style={style} />
          </Sequence>
        </div>
      )}
      <div style={{position: 'absolute', inset: 0, filter: grade}}>
        <Sequence from={V} durationInFrames={CLIP_END - V} layout="none">
          <OffthreadVideo src={staticFile('ronaldinho/key.webm')} transparent muted style={style} />
        </Sequence>
        {media({})}
        {clipFrame < 0 && null}
      </div>
    </div>
  );
};

// ---------- kinetic captions: line A on the left, line B on the right, word by word ----------
// his own words in Portuguese (Whisper word starts, clip seconds), with the English directly under each side
// in the same type, smaller and lighter (team 2026-11-18: EN + PT together, harmonious). Names are not repeated in English.
const PH_ = [
  {a: 0.0, b: 1.5, L: ['AQUI É O'], R: ['RONALDINHO.'], t: [0.0, 0.74], hi: 1, enL: 'THIS IS', enR: ''},
  {a: 1.55, b: 2.62, L: ['JOGUE'], R: ['DO SEU', 'JEITO.'], t: [1.62, 1.84, 2.14], hi: 2, enL: 'PLAY', enR: 'YOUR WAY.'},
  {a: 2.64, b: 4.15, L: ['FAÇA', 'A'], R: ['MAGIA', 'ACONTECER.'], t: [2.68, 2.92, 2.98, 3.26], hi: 2, enL: 'MAKE THE', enR: 'MAGIC HAPPEN.'},
  {a: 4.25, b: 5.75, L: ['A GENTE', 'SE VÊ NA'], R: ['HOTCOIN.'], t: [4.34, 4.62, 5.16], hi: 2, enL: 'SEE YOU AT', enR: ''},
];
const SIDE_W = 560;
const fit = (word: string, max: number) => Math.min(max, SIDE_W / (word.length * 0.6));

const Word: React.FC<{w: string; lt: number; lime: boolean; serif: boolean; align: 'left' | 'right'; size: number}> = ({w, lt, lime, serif, align, size}) => {
  const p = interpolate(lt, [0, 7], [0, 1], {...clamp, easing: ease});
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.06em'}}>
      <div style={{transform: `translateY(${(1 - p) * 110}%)`, fontFamily: serif ? SERIF : SANS, fontStyle: serif ? 'italic' : 'normal', fontWeight: serif ? 400 : 800, fontSize: serif ? size * 1.2 : size,
        lineHeight: 1, letterSpacing: serif ? 0 : -size * 0.03, color: lime ? LIME : WHITE,
        textShadow: '0 0 30px rgba(0,0,0,.6)', textAlign: align, whiteSpace: 'nowrap'}}>{serif ? w.toLowerCase() : w}</div>
    </div>
  );
};

const Captions: React.FC<{f: number}> = ({f}) => {
  const t = (f - V) / R10AURA_FPS;
  const i = PH_.findIndex((p) => t >= p.a && t < p.b);
  if (f < V || f >= OUT1 || i < 0) return null;
  const p = PH_[i];
  const words = [...p.L, ...p.R];
  const phraseSize = Math.min(...words.map((w) => fit(w, 120)));   // one size per phrase
  const out = interpolate(t, [p.b - 0.1, p.b], [1, 0], clamp);
  const render = (list: string[], offset: number, align: 'left' | 'right') => list.map((w, k) => {
    const idx = offset + k;
    const lt = (t - p.t[Math.min(idx, p.t.length - 1)]) * R10AURA_FPS;
    const isHi = idx >= p.hi && (align === 'right');
    const serif = i === 2 && w === 'MAGIC';
    return <Word key={idx} w={w} lt={lt} lime={isHi} serif={serif} align={align} size={phraseSize} />;
  });
  if (TALL) {
    const row = (list: string[], offset: number) => {
      const size = Math.min(124, 960 / (list.join(' ').length * 0.62));
      return (
        <div style={{display: 'flex', justifyContent: 'center', gap: size * 0.28, alignItems: 'baseline'}}>
          {list.map((w, k) => {
            const idx = offset + k;
            const lt = (t - p.t[Math.min(idx, p.t.length - 1)]) * R10AURA_FPS;
            return <Word key={idx} w={w} lt={lt} lime={idx >= p.hi && offset > 0} serif={i === 2 && w === 'MAGIC'} align="left" size={size} />;
          })}
        </div>
      );
    };
    return (
      <AbsoluteFill style={{opacity: out}}>
        <div style={{position: 'absolute', left: 50, right: 50, top: 190, display: 'flex', flexDirection: 'column', gap: 6}}>{row(p.L, 0)}{row(p.R, p.L.length)}</div>
      </AbsoluteFill>
    );
  }
  // English line under a column: same family, uppercase, lighter weight, tracked; appears with that column's first word
  const enLine = (txt: string, firstIdx: number, align: 'left' | 'right', lime: boolean) => {
    if (!txt) return null;
    const lt = (t - p.t[Math.min(firstIdx, p.t.length - 1)]) * R10AURA_FPS - 4;
    const q = interpolate(lt, [0, 8], [0, 1], {...clamp, easing: ease});
    return (
      <div style={{marginTop: 18, paddingTop: 14, borderTop: `2px solid rgba(184,242,106,${0.5 * q})`, opacity: q, transform: `translateY(${(1 - q) * 12}px)`,
        fontFamily: SANS, fontWeight: 500, fontSize: Math.max(40, phraseSize * 0.4), letterSpacing: '0.08em', lineHeight: 1.1, textAlign: align,
        color: lime ? 'rgba(184,242,106,.85)' : 'rgba(243,245,241,.72)', whiteSpace: 'nowrap'}}>{txt}</div>
    );
  };
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', left: 90, top: 330, width: SIDE_W, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>{render(p.L, 0, 'left')}{enLine(p.enL, 0, 'left', false)}</div>
      <div style={{position: 'absolute', right: 90, top: 330, width: SIDE_W, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>{render(p.R, p.L.length, 'right')}{enLine(p.enR, p.L.length, 'right', true)}</div>
    </AbsoluteFill>
  );
};

// name strip under him once he has said his name (both required lines)
const NameStrip: React.FC<{f: number}> = ({f}) => {
  const a = V + fr(0.9), b = V + fr(2.55);
  if (f < a || f > b + 8) return null;
  const o = interpolate(f, [a, a + 6, b, b + 8], [0, 1, 1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: TALL ? 360 : 56, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{background: 'rgba(5,6,7,.82)', border: '1px solid rgba(184,242,106,.5)', padding: '12px 26px', fontFamily: MONO, fontWeight: 500, fontSize: 24, color: WHITE, letterSpacing: 0.5, textAlign: 'center', lineHeight: 1.45}}>
        {TALL
          ? <><div style={{color: LIME, fontWeight: 700}}>R10</div><div>Hotcoin Ambassador (Brazil)</div><div style={{color: GREEN}}>Embaixador da Hotcoin (Brasil)</div></>
          : <><span style={{color: LIME, fontWeight: 700}}>R10</span>  ·  Hotcoin Ambassador (Brazil)  ·  <span style={{color: GREEN}}>Embaixador da Hotcoin (Brasil)</span></>}
      </div>
    </div>
  );
};

// ---------- outro words + end card ----------
const Outro: React.FC<{f: number}> = ({f}) => {
  if (f < OUT1 || f >= END) return null;
  const out = interpolate(f, [END - 6, END], [0, 1], clamp);
  const size = TALL ? 78 : 112;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - out}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: -size * 0.03, color: WHITE, textAlign: 'center'}}>
        <Reveal f={f} at={OUT1} dur={10}>A Hotcoin dá as boas-vindas</Reveal>
        <Reveal f={f} at={OUT1 + 6} dur={10}>ao nosso <span style={{color: LIME}}>embaixador.</span></Reveal>
        <div style={{fontWeight: 600, fontSize: TALL ? 40 : 38, letterSpacing: 0, color: 'rgba(243,245,241,.75)', marginTop: 30, opacity: interpolate(f, [OUT1 + 14, OUT1 + 24], [0, 1], clamp)}}>Hotcoin welcomes our ambassador.</div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{f: number}> = ({f}) => {
  if (f < END) return null;
  const lt = f - END;
  const r = (d: number) => interpolate(lt, [d, d + 8], [0, 1], {...clamp, easing: ease});
  const row = (d: number): React.CSSProperties => ({opacity: r(d), transform: `translateY(${(1 - r(d)) * 30}px)`});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{...row(0), display: 'flex', alignItems: 'center', gap: 26, marginBottom: TALL ? 70 : 46}}>
          <Img src={staticFile('brand/logo-official-white.png')} style={{height: TALL ? 50 : 56}} />
          <div style={{width: 2, height: TALL ? 50 : 56, background: 'rgba(243,245,241,.45)'}} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: TALL ? 46 : 54, letterSpacing: 3, color: WHITE, lineHeight: 1}}>RONALDINHO</div>
        </div>
        {/* team 2026-11-18: Portuguese identity line only */}
        <div style={{...row(3), fontFamily: SANS, fontWeight: 800, fontSize: TALL ? 76 : 100, lineHeight: 1.12, letterSpacing: -2, color: WHITE}}>{PT}</div>
        <div style={{...row(7), marginTop: TALL ? 80 : 50, background: LIME, color: INK, borderRadius: 999, padding: TALL ? '22px 48px' : '18px 42px', fontFamily: SANS, fontWeight: 800, fontSize: TALL ? 46 : 40}}>hotcoin.com</div>
      </div>
    </AbsoluteFill>
  );
};

// one/two-frame flashes on the big moments
const Flash: React.FC<{f: number}> = ({f}) => {
  const hits = [DROP];
  const h = hits.find((x) => f >= x && f < x + 3);
  if (h === undefined) return null;
  const big = h === DROP;
  const o = (big ? [0.8, 0.35, 0.1] : [0.28, 0.12, 0.04])[f - h];
  return <AbsoluteFill style={{background: big && f - h === 0 ? WHITE : LIME, opacity: o, mixBlendMode: 'screen'}} />;
};

const Sound: React.FC = () => {
  const f = useCurrentFrame();
  const vol = interpolate(f, [0, 4, DROP - 1, DROP, V - 4, V + 4, CLIP_END - 2, CLIP_END + 6, 392 - SHIFT, 414 - SHIFT],
    [0.0, 0.55, 0.55, 0.65, 0.65, 0.14, 0.14, 0.6, 0.45, 0], clamp);
  return (
    <>
      {/* full track until the end card, then a low-cut copy (scripts: ffmpeg highpass 180 Hz x2) so no 808 boom after he leaves */}
      <Audio src={staticFile('music/r10-thunder.mp3')} startFrom={fr(OFFSET)} volume={() => vol * interpolate(f, [END - 3, END + 3], [1, 0], clamp)} />
      <Audio src={staticFile('music/r10-thunder-hp.mp3')} startFrom={fr(OFFSET)} volume={() => vol * 1.15 * interpolate(f, [END - 3, END + 3], [0, 1], clamp)} />
      <Sequence from={V} layout="none"><Audio src={staticFile('ronaldinho/voice.wav')} volume={1} /></Sequence>
      {/* air pulled into the drop and into the end card (transient at 1.087 s / 0.713 s) */}
      <Sequence from={DROP - fr(0.713)} layout="none"><Audio src={staticFile('sfx/r10/whoosh-soft.mp3')} volume={0.35} /></Sequence>
      <Sequence from={END - fr(0.713)} layout="none"><Audio src={staticFile('sfx/r10/whoosh-soft.mp3')} volume={0.3} /></Sequence>
    </>
  );
};

export const R10Aura: React.FC = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  W = width; H = height; TALL = height > width;
  const inVoice = f >= DROP && f < OUT1;
  // background intensity by section
  const rays = f < DROP ? 0.6 : inVoice ? 1 : 0.7;
  const half = f < DROP ? 0.5 : inVoice ? 0.6 : 0.35;
  return (
    <AbsoluteFill style={{background: `radial-gradient(70% 80% at 50% 44%, #0E2A17 0%, #07130B 45%, ${INK} 80%)`, overflow: 'hidden'}}>
      <Rays f={f} o={rays} />
      <Halftone f={f} o={half} />
      <Rings f={f} o={f < END ? 1 : 0.5} />
      {/* the text cover is replaced by the baked-in poster (scripts/bake-r10-poster.sh) */}
      <Facts f={f} />
      <Person f={f} />
      <Captions f={f} />
      <Outro f={f} />
      <EndCard f={f} />
      <Flash f={f} />
      <AbsoluteFill style={{background: 'radial-gradient(120% 100% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.7) 100%)'}} />
      <Grain f={f} />
      <Sound />
    </AbsoluteFill>
  );
};

// ---------- poster (baked into the first 0.5 s of the export so every preview shows it; team 2026-11-18) ----------
export const R10AuraPoster: React.FC = () => {
  W = 1920; H = 1080; TALL = false;
  const ph = 1060, pw = ph * (1670 / 1978);
  return (
    <AbsoluteFill style={{background: `radial-gradient(70% 80% at 62% 44%, #0E2A17 0%, #07130B 45%, ${INK} 80%)`, overflow: 'hidden'}}>
      <Rays f={0} o={0.8} />
      <Halftone f={0} o={0.45} />
      <Rings f={30} o={0.8} cy={H * 0.44} />
      <Img src={staticFile('ronaldinho/cover_2.56.png')} style={{position: 'absolute', height: ph, left: W - pw - 70, top: H - ph + 30,
        filter: 'grayscale(1) contrast(1.06) brightness(1.14) drop-shadow(0 0 26px rgba(184,242,106,.55)) drop-shadow(0 0 4px rgba(184,242,106,.8))'}} />
      <div style={{position: 'absolute', left: 110, top: 0, bottom: 0, width: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{height: 84, alignSelf: 'flex-start'}} />
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 10, color: LIME, marginTop: 64}}>EMBAIXADOR OFICIAL</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 150, letterSpacing: -4, color: WHITE, lineHeight: 1, marginTop: 14}}>RONALDINHO</div>
        <div style={{width: 140, height: 5, background: LIME, margin: '44px 0 34px'}} />
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 50, lineHeight: 1.2}}>
          <div style={{color: LIME}}>Embaixador da Hotcoin (Brasil)</div>
        </div>
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(120% 100% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.7) 100%)'}} />
      <Grain f={0} />
    </AbsoluteFill>
  );
};
