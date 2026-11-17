// Ronaldinho x Hotcoin, "aura" edit (16:9). Same footage as R10Ambassador (public/ronaldinho/key.webm, voice.wav).
// Music: "Thunder" (Mixkit music 318, Mixkit free licence), 95.0 BPM, beat grid fitted by spectral flux:
//   beat k at 60.298 + 0.6316 k s; downbeat at 82.404 s (hardest section, CLAP "aggressive dark phonk" 1.00).
//   Track time = comp time + OFFSET, so the 82.404 s downbeat lands on DROP. The track fades out on its own at the end.
// Intro (team feedback 2026-11-17): frame 0 is a clear cover (Hotcoin x Ronaldinho + both ambassador lines + real photo),
//   then the platform (Hotcoin logo, Hotcoin symbol) before he appears. The achievement slams were removed.
// Rules: end card carries "Hotcoin Ambassador (Brazil)" + "Embaixador da Hotcoin (Brasil)";
//   no text hidden behind him (words sit either side); no deep end boom.
import React from 'react';
import '@fontsource/inter-tight/800.css';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

export const R10AURA_FPS = 30;
const BEAT = 60 / 95;                       // 0.6316 s
const INTRO_BEATS = 2;                      // cover only (team feedback 2026-11-17: no logo beats in between)
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

// ---------- intro: cover first, then the platform (team feedback 2026-11-17: no achievement slams, Hotcoin first) ----------
const EN = 'Hotcoin Ambassador (Brazil)', PT = 'Embaixador da Hotcoin (Brasil)';
const COVER_END = DROP;      // cover holds until he appears (1.26 s)

// frame 0 = the cover: who (Hotcoin x Ronaldinho), what (ambassador, both lines), his real photo
const Cover: React.FC<{f: number}> = ({f}) => {
  if (f >= COVER_END + 3) return null;
  const out = interpolate(f, [COVER_END - 1, COVER_END + 3], [1, 0], clamp);
  const push = 1 + 0.03 * (f / COVER_END);
  const grade = 'grayscale(1) contrast(1.06) brightness(1.14) drop-shadow(0 0 26px rgba(184,242,106,.55)) drop-shadow(0 0 4px rgba(184,242,106,.8))';
  const ph = TALL ? 1180 : 1010, pw = ph * (1670 / 1978);
  const photo = <Img src={staticFile('ronaldinho/cover_2.56.png')} style={{position: 'absolute', height: ph, left: TALL ? W / 2 - pw / 2 : W - pw - 60, top: H - ph + 20, filter: grade, transform: `scale(${push})`, transformOrigin: '50% 100%'}} />;
  const lock = (logoH: number, nameSize: number, align: 'flex-start' | 'center') => (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align, gap: logoH * 0.35}}>
      <Img src={staticFile('brand/logo-official-white.png')} style={{height: logoH}} />
      <div style={{display: 'flex', alignItems: 'baseline', gap: nameSize * 0.22}}>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: nameSize * 0.7, color: LIME, lineHeight: 1}}>×</span>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: nameSize, letterSpacing: -nameSize * 0.03, color: WHITE, lineHeight: 1}}>RONALDINHO</span>
      </div>
    </div>
  );
  const lines = (size: number, align: 'left' | 'center') => (
    <div style={{textAlign: align, fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1.18, letterSpacing: -size * 0.01}}>
      <div style={{color: WHITE}}>{EN}</div>
      <div style={{color: LIME}}>{PT}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{opacity: out}}>
      {photo}
      {TALL ? (
        <div style={{position: 'absolute', left: 60, right: 60, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 46}}>
          {lock(92, 132, 'center')}
          <div style={{width: 120, height: 4, background: LIME}} />
          {lines(52, 'center')}
        </div>
      ) : (
        <div style={{position: 'absolute', left: 110, top: 0, bottom: 0, width: 980, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 50}}>
          {lock(96, 150, 'flex-start')}
          <div style={{width: 140, height: 5, background: LIME}} />
          {lines(56, 'left')}
        </div>
      )}
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
const PH_ = [
  {a: 0.0, b: 1.5, L: ['THIS', 'IS'], R: ['RONALDINHO.'], t: [0.0, 0.66, 0.74], hi: 2},
  {a: 1.55, b: 2.62, L: ['PLAY'], R: ['YOUR', 'WAY.'], t: [1.62, 1.84, 1.96], hi: 2},
  {a: 2.64, b: 4.15, L: ['MAKE', 'THE'], R: ['MAGIC', 'HAPPEN.'], t: [2.68, 2.92, 2.98, 3.26], hi: 2},
  {a: 4.25, b: 5.75, L: ['SEE YOU', 'AT'], R: ['HOTCOIN.'], t: [4.34, 4.84, 5.16], hi: 2},
];
const SIDE_W = 560;
const fit = (word: string, max: number) => Math.min(max, SIDE_W / (word.length * 0.6));

const Word: React.FC<{w: string; lt: number; lime: boolean; serif: boolean; align: 'left' | 'right'; size: number}> = ({w, lt, lime, serif, align, size}) => {
  if (lt < 0) return null;
  const sc = 1 + 0.35 * Math.exp(-lt / 2.5);
  const o = Math.min(1, lt / 2 + 0.2);
  return (
    <div style={{fontFamily: serif ? SERIF : SANS, fontStyle: serif ? 'italic' : 'normal', fontWeight: serif ? 400 : 800, fontSize: serif ? size * 1.25 : size,
      lineHeight: 0.98, letterSpacing: serif ? 0 : -size * 0.03, color: lime ? LIME : WHITE, opacity: o, transform: `scale(${sc})`, transformOrigin: align === 'left' ? '0% 50%' : '100% 50%',
      textShadow: lime ? '0 0 40px rgba(184,242,106,.55)' : '0 0 30px rgba(0,0,0,.6)', textAlign: align, whiteSpace: 'nowrap'}}>{serif ? w.toLowerCase() : w}</div>
  );
};

const Captions: React.FC<{f: number}> = ({f}) => {
  const t = (f - V) / R10AURA_FPS;
  const i = PH_.findIndex((p) => t >= p.a && t < p.b);
  if (f < V || f >= OUT1 || i < 0) return null;
  const p = PH_[i];
  const words = [...p.L, ...p.R];
  const out = interpolate(t, [p.b - 0.1, p.b], [1, 0], clamp);
  const render = (list: string[], offset: number, align: 'left' | 'right') => list.map((w, k) => {
    const idx = offset + k;
    const lt = (t - p.t[Math.min(idx, p.t.length - 1)]) * R10AURA_FPS;
    const isHi = idx >= p.hi && (align === 'right');
    const serif = i === 2 && w === 'MAGIC';
    return <Word key={idx} w={w} lt={lt} lime={isHi} serif={serif} align={align} size={fit(w, 150)} />;
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
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', left: 90, top: 330, width: SIDE_W, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>{render(p.L, 0, 'left')}</div>
      <div style={{position: 'absolute', right: 90, top: 330, width: SIDE_W, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>{render(p.R, p.L.length, 'right')}</div>
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
  const list = [{at: OUT1, w: 'PLAY YOUR WAY.'}, {at: OUT2, w: 'MAKE IT'}, {at: OUT3, w: 'MAGIC.'}];
  const cur = [...list].reverse().find((x) => f >= x.at)!;
  const lt = f - cur.at;
  const sc = 1 + 0.12 * Math.exp(-lt / 3);
  const serif = cur.w === 'MAGIC.';
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${sc})`, fontFamily: serif ? SERIF : SANS, fontStyle: serif ? 'italic' : 'normal', fontWeight: serif ? 400 : 800,
        fontSize: serif ? (TALL ? 300 : 340) : (TALL ? 116 : 168), letterSpacing: serif ? 0 : (TALL ? -4 : -6), color: serif ? LIME : WHITE, textShadow: serif ? '0 0 80px rgba(184,242,106,.6)' : '0 0 50px rgba(184,242,106,.25)', whiteSpace: 'nowrap'}}>
        {serif ? 'magic.' : cur.w}
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
        <div style={{...row(3), fontFamily: SANS, fontWeight: 800, fontSize: TALL ? 112 : 128, lineHeight: TALL ? 1.08 : 1, letterSpacing: -4, color: WHITE}}>
          Play your way.{TALL ? <br /> : ' '}Make it <span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: TALL ? 134 : 152, letterSpacing: 0, color: LIME, textShadow: '0 0 50px rgba(184,242,106,.5)'}}>magic.</span>
        </div>
        <div style={{...row(7), marginTop: TALL ? 80 : 50, background: LIME, color: INK, borderRadius: 999, padding: TALL ? '22px 48px' : '18px 42px', fontFamily: SANS, fontWeight: 800, fontSize: TALL ? 46 : 40}}>hotcoin.com</div>
        <div style={{...row(10), marginTop: TALL ? 90 : 44, fontFamily: MONO, fontWeight: 500, fontSize: TALL ? 32 : 27, lineHeight: 1.5, color: 'rgba(243,245,241,.92)'}}>
          <div>Hotcoin Ambassador (Brazil)</div>
          <div style={{color: GREEN}}>Embaixador da Hotcoin (Brasil)</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// one/two-frame flashes on the big moments
const Flash: React.FC<{f: number}> = ({f}) => {
  const hits = [DROP, OUT1, OUT3, END];
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
      <Cover f={f} />
      <Person f={f} />
      <Captions f={f} />
      <NameStrip f={f} />
      <Outro f={f} />
      <EndCard f={f} />
      <Flash f={f} />
      <AbsoluteFill style={{background: 'radial-gradient(120% 100% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.7) 100%)'}} />
      <Grain f={f} />
      <Sound />
    </AbsoluteFill>
  );
};
