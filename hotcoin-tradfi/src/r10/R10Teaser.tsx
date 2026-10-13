// "Model 10" pre-reveal teaser: the reference reveal cut (cleaned by scripts/make-r10-base.py: old identity text
// painted out, tracked point-cloud curls + headband on the scan shots) with new pre-reveal text on top.
// Hints only, no name: No. 10, 21.03.1980, Porto Alegre, 17.05.2006 Paris, right foot, curls and headband.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/600.css';
import tracks from './tracks.json';

export const R10_FPS = 30;
export const R10_DURATION = 620;
const SANS = '"Inter Tight", sans-serif', COND = 'Oswald, sans-serif';
const RED = '#E5352B', LABEL = '#8E8E8E';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const rnd = (n: number) => {const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};
const GLYPH = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
// typewriter / scramble reveal like the reference labels
const scramble = (text: string, f: number, start: number, perFrame = 3) => {
  const shown = Math.max(0, (f - start) * perFrame);
  return text.split('').map((c, i) => (c === ' ' || c === '\n' ? c : i < shown - 2 ? c : i < shown ? GLYPH[Math.floor(rnd(i * 7 + f) * GLYPH.length)] : '')).join('');
};

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 30px Oswald', '500 30px Oswald', '600 30px "Inter Tight"', '500 20px "Inter Tight"'].map((x) => document.fonts.load(x))).then(() => setTimeout(() => continueRender(h), 120));
  }, [h]);
};
const In: React.FC<{f: number; a: number; b: number; children: React.ReactNode}> = ({f, a, b, children}) => (f >= a && f <= b ? <>{children}</> : null);

// schematic label (grey condensed caps, two lines)
const Cond: React.FC<{x: number; y: number; s?: number; lines: string[]; blur?: number}> = ({x, y, s = 1, lines, blur = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, transformOrigin: '0 0', transform: `scale(${s})`, fontFamily: COND, fontWeight: 600, fontSize: 37, lineHeight: '43px', color: LABEL, letterSpacing: 0.3, filter: blur ? `blur(${blur}px)` : undefined, whiteSpace: 'pre'}}>
    {lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>
);
const Bar: React.FC<{w: number; h?: number}> = ({w, h = 28}) => <span style={{display: 'inline-block', width: w, height: h, background: LABEL, verticalAlign: '-3px', marginRight: 8}} />;

// kick-shot callout: red index, white title, grey sub line, underline
const Callout: React.FC<{x: number; y: number; n: string; title: string; sub: string; f: number; start: number}> = ({x, y, n, title, sub, f, start}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: SANS}}>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
      <span style={{color: RED, fontSize: 11, fontWeight: 600, letterSpacing: 1}}>{n}</span>
      <span style={{color: '#F2F2F2', fontSize: 19, fontWeight: 600, letterSpacing: 2.2}}>{scramble(title, f, start, 7)}</span>
    </div>
    <div style={{height: 1, background: 'rgba(255,255,255,0.55)', width: 260, marginTop: 6}} />
    <div style={{color: '#9A9A9A', fontSize: 12, fontWeight: 500, letterSpacing: 1.6, marginTop: 7}}>{scramble(sub, f, start + 1, 8)}</div>
  </div>
);

type T = Record<string, Record<string, number[]>>;
const T_ = tracks as unknown as T;
const box = (k: string, f: number) => T_[k][String(f)];

const Redact: React.FC<{f: number}> = ({f}) => {
  const k = f <= 525 ? 'nameA' : 'nameB';
  const b = box(k, f);
  if (!b || b[4] < 0.45) return null;
  const [x, y, w, h] = b;
  const op = f <= 525 ? Math.min(1, (f - 500) / 2, (525 - f) / 2) : Math.min(1, (f - 527) / 2, (546 - f) / 2);
  return (
    <div style={{position: 'absolute', left: x - 30, top: y - 8, width: w + 60, height: h + 16, background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.18)', opacity: Math.max(0, op),
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: h * 0.12}}>
      <span style={{width: h * 0.14, height: h * 0.14, background: RED}} />
      <span style={{fontFamily: SANS, fontWeight: 600, fontSize: h * 0.3, letterSpacing: h * 0.06, color: '#CFCFCF'}}>{scramble('CLASSIFIED', f, k === 'nameA' ? 500 : 527, 2)}</span>
    </div>
  );
};

const EndCard: React.FC<{f: number}> = ({f}) => {
  const lt = f - 554;
  const word = 'MAKE IT MAGIC.';
  const big = word.split('').map((c, i) => (c === ' ' ? c : lt > i * 0.9 + 4 ? c : lt > i * 0.9 ? GLYPH[Math.floor(rnd(i + f) * GLYPH.length)] : '')).join('');
  const op = interpolate(f, [612, 619], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#0E0E0E', opacity: op}}>
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '256px 256px', opacity: 0.08, mixBlendMode: 'screen'}} />
      <div style={{position: 'absolute', left: 150, right: 150, top: 352}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: SANS, fontWeight: 600, fontSize: 13, letterSpacing: 2.4, color: '#D8D8D8'}}>
          <span><span style={{display: 'inline-block', width: 7, height: 7, background: RED, marginRight: 9, verticalAlign: 1}} />{scramble('MODEL 10', f, 556)}</span>
          <span style={{color: '#8C8C8C'}}>{scramble('COMING SOON', f, 560)}</span>
        </div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 196, lineHeight: 1, letterSpacing: -6, color: '#F1F1EF', marginTop: 18, whiteSpace: 'pre'}}>{big}</div>
        <div style={{height: 1.5, background: 'rgba(255,255,255,0.45)', marginTop: 22, width: `${interpolate(lt, [2, 16], [0, 100], clamp)}%`}} />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18}}>
          <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 15, letterSpacing: 2.6, color: '#D8D8D8'}}>{scramble('PLAY YOUR WAY.', f, 566)}</span>
          <Img src={staticFile('brand/logo-official-white.png')} style={{width: 150, height: (150 * 328) / 2005, opacity: interpolate(lt, [14, 22], [0, 1], clamp)}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const R10Teaser: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  // trophy labels zoom with the shot between 418 and 432
  const tz = interpolate(f, [418, 432], [0, 1], clamp);
  const tBlur = interpolate(f, [401, 405], [4, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo src={staticFile('r10/base.mp4')} muted style={{width: '100%', height: '100%'}} />
      {/* golden sphere */}
      <In f={f} a={49} b={53}>
        <Cond x={1490} y={268} lines={['AWARDED:', '2005']} />
        <Cond x={1490} y={758} lines={['ENGRAVED BASE:', '[CLASSIFIED]']} />
      </In>
      {/* MODEL 10 card */}
      <In f={f} a={226} b={246}>
        <div style={{position: 'absolute', left: 130, top: 722, fontFamily: SANS, fontWeight: 600, fontSize: 13, letterSpacing: 2.6, color: '#D2D2D2'}}>{scramble('IDENTITY: CLASSIFIED', f, 226, 2)}</div>
      </In>
      {/* kick callouts */}
      <In f={f} a={294} b={301}>
        <Callout x={1046} y={176} n="01" title="IDENTITY: CLASSIFIED" sub="PORTO ALEGRE · 21.03.1980" f={f} start={294} />
        <Callout x={1240} y={573} n="02" title="NO. 10" sub="PARIS · 17.05.2006" f={f} start={294} />
        <Callout x={1306} y={829} n="03" title="RIGHT FOOT" sub="PRIMARY · MAGIC" f={f} start={295} />
        <div style={{position: 'absolute', left: 1775, top: 560, transform: 'translate(-50%, -50%) rotate(-90deg)', fontFamily: SANS, fontWeight: 600, fontSize: 12, letterSpacing: 2, color: '#CFCFCF', whiteSpace: 'nowrap'}}>HEIGHT 1.81 m (STANDING)</div>
      </In>
      {/* trophy: wide frame first (labels type in), then the push-in */}
      <In f={f} a={389} b={400}>
        <Cond x={1332} y={610} lines={[scramble('CHAMPION:', f, 389, 2), '']} />
        <div style={{position: 'absolute', left: 1332, top: 653, fontFamily: COND, fontWeight: 600, fontSize: 37, lineHeight: '43px', color: LABEL, whiteSpace: 'nowrap', opacity: f >= 392 ? 1 : 0}}><Bar w={138} />(NO. 10)</div>
        <Cond x={1332} y={792} lines={[scramble('FINAL: 17.05.2006', f, 390, 3), scramble('PARIS', f, 393, 2)]} />
      </In>
      <In f={f} a={401} b={433}>
        <Cond x={1356 + 70 * tz} y={616 + 34 * tz} s={1 + 0.16 * tz} blur={tBlur} lines={['CHAMPION:', '']} />
        <div style={{position: 'absolute', left: 1356 + 70 * tz, top: 616 + 34 * tz + 43 * (1 + 0.16 * tz), transformOrigin: '0 0', transform: `scale(${1 + 0.16 * tz})`, fontFamily: COND, fontWeight: 600, fontSize: 37, lineHeight: '43px', color: LABEL, filter: tBlur ? `blur(${tBlur}px)` : undefined, whiteSpace: 'nowrap'}}>
          <Bar w={138} />(NO. 10)
        </div>
        <Cond x={1356 + 70 * tz} y={796 + 62 * tz} s={1 + 0.16 * tz} blur={tBlur} lines={['FINAL: 17.05.2006', 'PARIS']} />
      </In>
      {/* back shot */}
      <In f={f} a={500} b={546}><Redact f={f} /></In>
      <In f={f} a={504} b={524}>
        <div style={{position: 'absolute', left: 40, top: 1012, fontFamily: COND, fontWeight: 500, fontSize: 15, letterSpacing: 1.2, color: '#9A9A9A'}}>FIG. 10 / CLASSIFIED</div>
      </In>
      {/* end card */}
      <In f={f} a={554} b={619}><EndCard f={f} /></In>
      <Audio src={staticFile('r10/music.mp4')} />
    </AbsoluteFill>
  );
};
