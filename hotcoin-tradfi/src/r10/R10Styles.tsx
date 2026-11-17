// Ronaldinho x Hotcoin, two 16:9 films in the approved static styles: "campaign" (deep green, serif, large colour crop)
// and "editorial" (warm paper, serif italic, lime highlighter). Same story as the aura edit v6 (team feedback 2026-11-17):
// text-only cover -> Hotcoin facts -> his speech (he is not shown before it) -> "Hotcoin welcomes our ambassador." -> end card.
// Footage: original Hotcoin shoot, keyed by scripts/make-r10-key.py (public/ronaldinho/key.webm, voice.wav).
// Facts: hotcoin.com/en_US/about, checked 2026-11-17 (2017 Year Founded, 8.1M+ Registered Users, 120+ Countries and Regions,
//   300+ spot / 500+ futures pairs). Music: "Spanish Heart" (Mixkit 974, free licence), its 7.95 s drop lands on DROP.
// Both required lines appear on the cover and the end card: "Hotcoin Ambassador (Brazil)" + "Embaixador da Hotcoin (Brasil)".
import React from 'react';
import '@fontsource/inter-tight/800.css';
import '@fontsource/instrument-serif/400.css';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';

export const R10S_FPS = 30;
const fr = (s: number) => Math.round(s * R10S_FPS);
const COVER_END = 45, FACT0 = 50, DROP = 140, V = DROP + 8, CLIP_END = V + 170, WELCOME = CLIP_END + 6, END = WELCOME + 66;
export const R10S_DURATION = END + 96;   // ~16.1 s
const W = 1920, H = 1080;
const EN = 'Hotcoin Ambassador (Brazil)', PT = 'Embaixador da Hotcoin (Brasil)';
const INK = '#0B0E11', LIME = '#B8F26A', WHITE = '#F3F5F1', PAPER = '#ECE5D8', DEEP = '#0D2418';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace', SERIF = '"Instrument Serif", serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

type Style = 'campaign' | 'editorial';
const FACTS = [
  {to: 2017, dec: 0, suf: '', label: 'Founded'},
  {to: 8.1, dec: 1, suf: 'M+', label: 'Registered users'},
  {to: 120, dec: 0, suf: '+', label: 'Countries and regions'},
  {to: 500, dec: 0, suf: '+', label: 'Futures pairs, plus 300+ spot'},
];
// English captions; t = word start in clip seconds (Whisper), key = highlighted word index
const PHRASES = [
  {a: 0.0, b: 1.5, w: ['This', 'is', 'Ronaldinho.'], t: [0.0, 0.66, 0.74], key: 2},
  {a: 1.55, b: 2.62, w: ['Play', 'your', 'way.'], t: [1.62, 1.84, 1.96], key: 2},
  {a: 2.64, b: 4.15, w: ['Make', 'the', 'magic', 'happen.'], t: [2.68, 2.92, 2.98, 3.26], key: 2},
  {a: 4.25, b: 5.75, w: ['See', 'you', 'at', 'Hotcoin.'], t: [4.34, 4.42, 4.84, 5.16], key: 3},
];

const Reveal: React.FC<{f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties; inline?: boolean}> = ({f, at, dur = 10, children, style, inline}) => {
  const p = interpolate(f, [at, at + dur], [0, 1], {...clamp, easing: ease});
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.1em', display: inline ? 'inline-block' : 'block', verticalAlign: 'bottom', ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 112}%)`}}>{children}</div>
    </div>
  );
};
const fadeOut = (f: number, a: number, d = 8) => 1 - interpolate(f, [a - d, a], [0, 1], clamp);
// lime highlighter that draws left to right behind a word
const Mark: React.FC<{f: number; at: number; children: React.ReactNode; on: boolean}> = ({f, at, children, on}) => {
  const p = interpolate(f, [at, at + 10], [0, 1], {...clamp, easing: ease});
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      {on && <span style={{position: 'absolute', left: '-0.04em', right: '-0.04em', top: '42%', height: '42%', background: LIME, transform: `scaleX(${p})`, transformOrigin: '0 50%', mixBlendMode: 'multiply'}} />}
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};

// ---------- him ----------
const Person: React.FC<{f: number; s: Style}> = ({f, s}) => {
  if (f < DROP) return null;
  const camp = s === 'campaign';
  const ph = camp ? 1900 : 1080, pw = ph * (1500 / 1620);
  const left = camp ? W - pw + 260 : W - pw - 30, top = camp ? -150 : H - ph + 40;
  const enter = interpolate(f, [DROP, DROP + 18], [0, 1], {...clamp, easing: ease});
  const push = 1 + interpolate(f, [DROP, WELCOME], [0, 0.04], clamp);
  const exit = camp ? interpolate(f, [WELCOME - 6, WELCOME + 8], [0, 1], {...clamp, easing: ease})
                    : interpolate(f, [WELCOME - 4, WELCOME + 10], [0, 1], {...clamp, easing: ease});
  const style: React.CSSProperties = {width: pw, height: ph};
  const filter = camp ? 'saturate(.88) contrast(1.04)' : 'saturate(.92) contrast(1.02) drop-shadow(0 18px 30px rgba(60,40,10,.12))';
  return (
    <div style={{position: 'absolute', left, top, width: pw, height: ph, opacity: enter * (1 - exit),
      transform: `translate(${(1 - enter) * 60 + (!camp ? exit * 80 : 0)}px, 0) scale(${push})`, transformOrigin: '60% 30%', filter}}>
      <Sequence from={V} durationInFrames={CLIP_END - V} layout="none">
        <OffthreadVideo src={staticFile('ronaldinho/key.webm')} transparent muted style={style} />
      </Sequence>
      {f < V && <Img src={staticFile('ronaldinho/first.png')} style={style} />}
      {f >= CLIP_END && <Img src={staticFile('ronaldinho/last.png')} style={style} />}
    </div>
  );
};

// ---------- campaign ----------
const CampaignBg: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(70% 90% at 72% 40%, #16402A 0%, ${DEEP} 55%, #081710 100%)`}} />
);
const CampaignText: React.FC<{f: number}> = ({f}) => {
  const L = 110;
  // cover
  const cover = f < COVER_END && (
    <div style={{position: 'absolute', left: L, top: 300, opacity: fadeOut(f, COVER_END, 8)}}>
      <Reveal f={f} at={-10} dur={1}><div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 5, color: 'rgba(243,245,241,.8)'}}>OFFICIAL AMBASSADOR · BRASIL</div></Reveal>
      <div style={{width: 64, height: 2, background: LIME, margin: '24px 0 22px'}} />
      <div style={{fontFamily: SERIF, fontSize: 168, lineHeight: 0.92, color: WHITE}}>Hotcoin<br /><span style={{fontStyle: 'italic', color: LIME}}>×</span> Ronaldinho</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 46, lineHeight: 1.2, marginTop: 52}}>
        <div style={{color: WHITE}}>{EN}</div><div style={{color: LIME}}>{PT}</div>
      </div>
    </div>
  );
  // facts: serif numbers, stacked list
  const facts = f >= COVER_END && f < DROP + 6 && (
    <div style={{position: 'absolute', left: L, top: 250, opacity: fadeOut(f, DROP + 6, 10)}}>
      {FACTS.map((x, i) => {
        const at = FACT0 + i * 15;
        const v = x.to === 2017 ? '2017' : interpolate(f, [at, at + 16], [0, x.to], {...clamp, easing: ease}).toFixed(x.dec);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 36, borderTop: `1px solid rgba(184,242,106,${interpolate(f, [at - 2, at + 8], [0, 0.45], clamp)})`, padding: '14px 0 10px', width: 1100}}>
            <Reveal f={f} at={at} style={{width: 420}}><div style={{fontFamily: SERIF, fontSize: 132, lineHeight: 1, color: WHITE}}>{v}{x.suf}</div></Reveal>
            <Reveal f={f} at={at + 3}><div style={{fontFamily: SANS, fontWeight: 600, fontSize: 46, color: LIME}}>{x.label}</div></Reveal>
          </div>
        );
      })}
    </div>
  );
  return <>{cover}{facts}</>;
};

// ---------- editorial ----------
const EditorialBg: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: PAPER}}>
    <div style={{position: 'absolute', left: 80, right: 80, top: 66, height: 2, background: INK, transform: `scaleX(${interpolate(f, [0, 14], [0.2, 1], {...clamp, easing: ease})})`, transformOrigin: '0 50%'}} />
    <div style={{position: 'absolute', left: 80, top: 82, fontFamily: MONO, fontSize: 20, letterSpacing: 1, color: INK}}>HOTCOIN × RONALDINHO</div>
    <div style={{position: 'absolute', right: 80, top: 82, fontFamily: MONO, fontSize: 20, letterSpacing: 1, color: INK}}>BRASIL</div>
  </AbsoluteFill>
);
const EditorialText: React.FC<{f: number}> = ({f}) => {
  const cover = f < COVER_END && (
    <div style={{position: 'absolute', left: 72, top: 225, opacity: fadeOut(f, COVER_END, 8)}}>
      <div style={{fontFamily: SERIF, fontSize: 250, lineHeight: 0.9, color: INK, letterSpacing: -3}}>Hotcoin <span style={{fontStyle: 'italic'}}>×</span><br /><Mark f={f} at={-10} on><span style={{fontStyle: 'italic'}}>Ronaldinho.</span></Mark></div>
      <div style={{width: 1000, height: 2, background: INK, margin: '60px 0 28px 8px'}} />
      <div style={{marginLeft: 8, fontFamily: SANS, fontWeight: 800, fontSize: 56, color: INK, letterSpacing: -1, lineHeight: 1.1}}>{EN}</div>
      <div style={{marginLeft: 8, fontFamily: SERIF, fontStyle: 'italic', fontSize: 70, color: INK, lineHeight: 1.1}}>{PT}</div>
    </div>
  );
  const facts = f >= COVER_END && f < DROP + 6 && (
    <div style={{position: 'absolute', left: 80, right: 80, top: 250, opacity: fadeOut(f, DROP + 6, 10)}}>
      <Reveal f={f} at={COVER_END + 2}><div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 150, color: INK, lineHeight: 1}}>Hotcoin, <Mark f={f} at={COVER_END + 6} on>in numbers.</Mark></div></Reveal>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', columnGap: 64, marginTop: 110}}>
        {FACTS.map((x, i) => {
          const at = FACT0 + i * 15;
          const v = x.to === 2017 ? '2017' : interpolate(f, [at, at + 16], [0, x.to], {...clamp, easing: ease}).toFixed(x.dec);
          return (
            <div key={i}>
              <div style={{height: 2, background: INK, transform: `scaleX(${interpolate(f, [at - 2, at + 10], [0, 1], {...clamp, easing: ease})})`, transformOrigin: '0 50%'}} />
              <Reveal f={f} at={at} style={{marginTop: 18}}><div style={{fontFamily: SANS, fontWeight: 800, fontSize: 128, letterSpacing: -5, color: INK, lineHeight: 1}}>{v}{x.suf}</div></Reveal>
              <Reveal f={f} at={at + 3}><div style={{fontFamily: SANS, fontWeight: 600, fontSize: 42, color: INK, marginTop: 12, lineHeight: 1.15}}>{x.label}</div></Reveal>
            </div>
          );
        })}
      </div>
    </div>
  );
  return <>{cover}{facts}</>;
};

// ---------- captions (both styles) ----------
const Captions: React.FC<{f: number; s: Style}> = ({f, s}) => {
  const t = (f - V) / R10S_FPS;
  const i = PHRASES.findIndex((p) => t >= p.a && t < p.b);
  if (f < V || f >= WELCOME || i < 0) return null;
  const p = PHRASES[i];
  const out = interpolate(t, [p.b - 0.12, p.b], [1, 0], clamp);
  const camp = s === 'campaign';
  const size = camp ? 128 : 170;
  return (
    <div style={{position: 'absolute', left: camp ? 110 : 76, top: camp ? 620 : 300, width: camp ? 900 : 1000, opacity: out,
      fontFamily: SERIF, fontSize: size, lineHeight: 0.98, color: camp ? WHITE : INK, letterSpacing: camp ? 0 : -2}}>
      {p.w.map((w, k) => {
        const at = V + fr(p.t[k]);
        const key = k === p.key;
        return (
          <React.Fragment key={k}>
            <Reveal f={f} at={at} dur={8} inline>
              {camp
                ? <span style={{fontStyle: key ? 'italic' : 'normal', color: key ? LIME : WHITE}}>{w}</span>
                : <Mark f={f} at={at + 4} on={key}><span style={{fontStyle: key ? 'italic' : 'normal'}}>{w}</span></Mark>}
            </Reveal>{' '}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------- welcome + end card ----------
const Welcome: React.FC<{f: number; s: Style}> = ({f, s}) => {
  if (f < WELCOME || f >= END + 8) return null;
  const camp = s === 'campaign';
  const o = fadeOut(f, END + 8, 10);
  return camp ? (
    <div style={{position: 'absolute', left: 110, top: 380, opacity: o, fontFamily: SERIF, fontSize: 150, lineHeight: 0.95, color: WHITE}}>
      <Reveal f={f} at={WELCOME}>Hotcoin welcomes</Reveal>
      <Reveal f={f} at={WELCOME + 6}>our <span style={{fontStyle: 'italic', color: LIME}}>ambassador.</span></Reveal>
    </div>
  ) : (
    <div style={{position: 'absolute', left: 72, top: 250, opacity: o, fontFamily: SERIF, fontSize: 210, lineHeight: 0.92, color: INK, letterSpacing: -3}}>
      <Reveal f={f} at={WELCOME}>Hotcoin welcomes</Reveal>
      <Reveal f={f} at={WELCOME + 6}>our <Mark f={f} at={WELCOME + 14} on><span style={{fontStyle: 'italic'}}>ambassador.</span></Mark></Reveal>
    </div>
  );
};

const EndCard: React.FC<{f: number; s: Style}> = ({f, s}) => {
  if (f < END) return null;
  const camp = s === 'campaign';
  const c = camp ? WHITE : INK;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <Reveal f={f} at={END}><Img src={staticFile(camp ? 'brand/logo-official-white.png' : 'brand/logo-official-black.png')} style={{height: 64}} /></Reveal>
      <Reveal f={f} at={END + 5} style={{marginTop: 54}}>
        <div style={{fontFamily: SERIF, fontSize: 116, lineHeight: 1, color: c}}>{EN}</div>
      </Reveal>
      <Reveal f={f} at={END + 9}>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 116, lineHeight: 1.05, color: camp ? LIME : c}}>{camp ? PT : <Mark f={f} at={END + 16} on>{PT}</Mark>}</div>
      </Reveal>
      <Reveal f={f} at={END + 16} style={{marginTop: 60}}>
        <div style={{display: 'inline-block', background: camp ? LIME : INK, color: camp ? INK : PAPER, borderRadius: 999, padding: '18px 44px', fontFamily: SANS, fontWeight: 800, fontSize: 40}}>hotcoin.com</div>
      </Reveal>
    </AbsoluteFill>
  );
};

const Sound: React.FC = () => {
  const f = useCurrentFrame();
  const vol = interpolate(f, [0, 8, DROP - 2, DROP + 2, V - 4, V + 4, CLIP_END - 2, CLIP_END + 10, R10S_DURATION - 30, R10S_DURATION],
    [0, 0.28, 0.28, 0.34, 0.34, 0.065, 0.065, 0.24, 0.22, 0], clamp);
  return (
    <>
      {/* drop measured 2 frames late at fr(7.95), so start 2 frames later in the track. After he speaks: low-cut copy (no kick boom on the end) */}
      <Audio src={staticFile('music/r10-spanish-heart.mp3')} startFrom={fr(7.95) - DROP + 2} volume={() => vol * interpolate(f, [CLIP_END - 2, CLIP_END + 6], [1, 0], clamp)} />
      <Audio src={staticFile('music/r10-spanish-heart-hp.mp3')} startFrom={fr(7.95) - DROP + 2} volume={() => vol * 1.15 * interpolate(f, [CLIP_END - 2, CLIP_END + 6], [0, 1], clamp)} />
      <Sequence from={V} layout="none"><Audio src={staticFile('ronaldinho/voice.wav')} volume={1} /></Sequence>
    </>
  );
};

export const R10Styled: React.FC<{style: Style}> = ({style: s}) => {
  const f = useCurrentFrame();
  const camp = s === 'campaign';
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {camp ? <CampaignBg /> : <EditorialBg f={f} />}
      <Person f={f} s={s} />
      {camp && <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,23,16,.95) 0%, rgba(8,23,16,.7) 36%, rgba(8,23,16,0) 56%)', opacity: f >= DROP ? 1 : 0}} />}
      {camp ? <CampaignText f={f} /> : <EditorialText f={f} />}
      <Captions f={f} s={s} />
      <Welcome f={f} s={s} />
      <EndCard f={f} s={s} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '256px 256px', backgroundPosition: `${(f * 37) % 256}px ${(f * 91) % 256}px`,
        opacity: camp ? 0.07 : 0.06, mixBlendMode: camp ? 'screen' : 'multiply'}} />
      <Sound />
    </AbsoluteFill>
  );
};
