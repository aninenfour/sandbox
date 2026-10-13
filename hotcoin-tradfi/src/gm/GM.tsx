// "gm": archival hands at a 1944 typewriter, G and M key presses, a green terminal types gm, matrix rain over
// archival glowing-line footage, gm pings around a dot globe, and the globe shrinks into the dot of the Hotcoin logo.
// Footage: public-domain films via movingimagearchive.com / Internet Archive (see FOOTAGE_CREDITS.md).
// The G and M keycaps are drawn here (no archival shot presses those keys). Music: "New Bass 02" (Mixkit).
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/vt323';
import '@fontsource/montserrat/700.css';
import {INOUT, OUT, clamp} from '../alt/kit';
import DOTS from './land-dots.json';

export const GM_FPS = 60;
const H = 60 / 78.3; // half-time beat of the track
const DROP = 4.8; // music drop = start of the rain
const beat = (n: number) => DROP + n * H;
const T = {finger: 1.7, keyG: 2.4, keyM: 3.05, crt: 3.7, rain: DROP, globe: beat(4), shrink: beat(8), logo: beat(9), end: 14};
export const GM_DURATION = Math.round(T.end * GM_FPS);
const INK = '#050706', LIME = '#B8F26A', GREEN = '#7EC25A';
const MONO = 'VT323, monospace', SANS = '"Inter Tight", sans-serif';
const f = (s: number) => Math.round(s * GM_FPS);
const sm = (a: number, b: number, x: number) => {const k = Math.max(0, Math.min(1, (x - a) / (b - a))); return k * k * (3 - 2 * k);};
const rnd = (n: number) => {const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};

// final logo placement; the globe lands on the round dot of the symbol (centre 258,261 r 59 in the 2005x328 file)
const LOGO_W = 1000, LS = LOGO_W / 2005, LOGO_X = 960 - LOGO_W / 2, LOGO_Y = 500 - (328 * LS) / 2;
const DOT = {x: LOGO_X + 258 * LS, y: LOGO_Y + 261 * LS, r: 59 * LS};

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all(['400 40px VT323', '700 200px Montserrat', '900 400px Unbounded', '600 40px "Inter Tight"'].map((x) => document.fonts.load(x)))
      .then(() => setReady(true));
  }, [h]);
  useEffect(() => {
    if (!ready) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h)));
    return () => cancelAnimationFrame(id);
  }, [ready, h]);
  return ready;
};

// 1940s film: grain, weave, flicker, dust, vignette
const Film: React.FC<{fr: number; children: React.ReactNode; tint?: number}> = ({fr, children}) => {
  const wx = (rnd(fr * 1.3) - 0.5) * 3, wy = (rnd(fr * 2.1) - 0.5) * 3, fl = 1 + (rnd(fr * 0.7) - 0.5) * 0.08;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${wx}px, ${wy}px)`, filter: `brightness(${fl})`}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '320px 320px', backgroundPosition: `${rnd(fr) * 320}px ${rnd(fr + 9) * 320}px`, mixBlendMode: 'overlay', opacity: 0.45}} />
      {[0, 1, 2].map((k) => (rnd(fr * 3 + k) > 0.7 ? <div key={k} style={{position: 'absolute', left: rnd(fr * 5 + k) * 1920, top: rnd(fr * 7 + k) * 1080, width: 2 + rnd(fr + k) * 5, height: 2 + rnd(fr * 2 + k) * 9, borderRadius: 4, background: rnd(k + fr) > 0.5 ? '#000' : '#fff', opacity: 0.6}} /> : null))}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

const Archive: React.FC<{src: string; fr: number; from: number; zoom: [number, number]; dur: number}> = ({src, fr, from, zoom, dur}) => {
  const z = interpolate(fr, [0, f(dur)], zoom, clamp);
  return (
    <Film fr={fr}>
      <OffthreadVideo src={staticFile(src)} trimBefore={f(from)} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.05) brightness(0.95)', transform: `scale(${z})`}} />
    </Film>
  );
};

// a round 1940s typewriter key, macro, drawn to match the film
const Key: React.FC<{ch: string; x: number; y: number; d: number; press?: number; glow?: number; blur?: number}> = ({ch, x, y, d, press = 0, glow = 0, blur = 0}) => (
  <div style={{position: 'absolute', left: x - d / 2, top: y - d / 2 + press * d * 0.07, width: d, height: d, filter: blur ? `blur(${blur}px)` : undefined}}>
    {/* stem + shadow */}
    <div style={{position: 'absolute', left: d * 0.42, top: d * 0.6, width: d * 0.16, height: d * (0.7 - press * 0.07), background: 'linear-gradient(90deg,#111,#555,#111)'}} />
    <div style={{position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: `0 ${d * (0.12 - press * 0.08)}px ${d * 0.12}px rgba(0,0,0,0.85)`}} />
    {/* chrome ring */}
    <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 200deg, #f4f4f4, #6a6a6a, #e8e8e8, #4a4a4a, #f4f4f4)'}} />
    {/* glass top */}
    <div style={{position: 'absolute', inset: d * 0.07, borderRadius: '50%', background: 'radial-gradient(circle at 40% 30%, #3a3a3a, #0b0b0b 62%, #000)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <span style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: d * 0.46, color: glow > 0 ? `color-mix(in srgb, ${LIME} ${glow * 100}%, #f2f2f2)` : '#f2f2f2', textShadow: glow > 0 ? `0 0 ${d * 0.12 * glow}px ${LIME}` : undefined, marginTop: d * 0.02}}>{ch}</span>
      <div style={{position: 'absolute', left: '18%', top: '10%', width: '46%', height: '24%', borderRadius: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))', transform: 'rotate(-18deg)'}} />
    </div>
  </div>
);

const KeyShot: React.FC<{fr: number; ch: string; row: string[]; row2: string[]; pressAt: number; dur: number}> = ({fr, ch, row, row2, pressAt, dur}) => {
  const t = fr / GM_FPS;
  const into = t - pressAt;
  const press = into < 0 ? 0 : into < 0.05 ? into / 0.05 : Math.max(0, 1 - (into - 0.16) / 0.12);
  const glow = into < 0 ? 0 : Math.exp(-into * 2.2);
  const push = interpolate(t, [0, dur], [1.0, 1.08], clamp);
  const shake = into > 0 && into < 0.2 ? (rnd(fr) - 0.5) * 10 * (1 - into / 0.2) : 0;
  const D = 470;
  return (
    <Film fr={fr}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2a2a2a, #090909 70%)', perspective: 1400}}>
        <AbsoluteFill style={{transform: `translateY(${shake}px) scale(${push}) rotateX(42deg)`, transformOrigin: '50% 60%'}}>
          {row2.map((c, i) => <Key key={c} ch={c} x={960 + (i - 1) * (D + 70) - (D + 70) / 2} y={540 - 560} d={D} blur={9} />)}
          {row.map((c, i) => (c === ch ? null : <Key key={c} ch={c} x={960 + (i - 1) * (D + 70)} y={540} d={D} blur={4} />))}
          <Key ch={ch} x={960} y={540} d={D} press={press} glow={glow} />
        </AbsoluteFill>
      </AbsoluteFill>
    </Film>
  );
};

// green phosphor terminal types gm
const CRT: React.FC<{t: number}> = ({t}) => {
  const lt = t - T.crt;
  const l1 = '> gm'.slice(0, lt < 0.1 ? 2 : lt < 0.25 ? 3 : 4);
  const msg = 'delivering gm worldwide...';
  const l2 = lt > 0.42 ? msg.slice(0, Math.floor((lt - 0.42) / 0.022)) : '';
  const cursor = Math.floor(lt / 0.18) % 2 === 0;
  const on = sm(0, 0.08, lt);
  return (
    <AbsoluteFill style={{background: '#020402', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{opacity: on, transform: `scaleY(${0.02 + 0.98 * OUT(Math.min(1, lt / 0.12))})`, fontFamily: MONO, color: LIME, textShadow: `0 0 18px ${LIME}, 0 0 40px ${GREEN}`, width: 1400}}>
        <div style={{fontSize: 260, lineHeight: 1}}>{l1}{l2 ? '' : cursor ? '█' : ' '}</div>
        <div style={{fontSize: 64, marginTop: 10, minHeight: 70}}>{l2}{l2 && cursor ? '█' : ''}</div>
      </div>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.85) 100%)'}} />
    </AbsoluteFill>
  );
};

// glowing-line archival clips, graded to lime and screened under the rain
const GLOW: {src: string; from: number}[] = [{src: 'g16', from: 0.2}, {src: 'g0', from: 7.5}, {src: 'g30', from: 1.6}, {src: 'g8', from: 0.1}];
const GlowFootage: React.FC<{t: number}> = ({t}) => {
  const k = Math.max(0, Math.min(GLOW.length - 1, Math.floor((t - T.rain) / H)));
  const into = t - T.rain - k * H;
  const g = GLOW[k];
  return (
    <AbsoluteFill style={{opacity: 0.5 * (1 - 0.6 * sm(T.rain + 1.0, T.rain + 2.0, t)) * sm(T.globe + 0.1, T.globe - 0.25, t), isolation: 'isolate'}}>
      <Sequence from={f(T.rain + k * H)} durationInFrames={f(H) + 2} layout="none">
        <OffthreadVideo src={staticFile(`gm/glow/${g.src}.mp4`)} trimBefore={f(g.from)} muted
          style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.6) brightness(1.2) blur(1.5px)', transform: `scale(${1.08 + into * 0.06})`}} />
      </Sequence>
      <AbsoluteFill style={{background: LIME, mixBlendMode: 'multiply'}} />
    </AbsoluteFill>
  );
};

const CW = 30, CH = 36, COLS = Math.ceil(1920 / CW), ROWS = Math.ceil(1080 / CH);
const GLYPHS = 'gmgmgmGM0123456789+<>/$#';
const Rain: React.FC<{t: number; fr: number}> = ({t, fr}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mask, setMask] = useState<Uint8ClampedArray | null>(null);
  useEffect(() => {
    const c = document.createElement('canvas'); c.width = COLS; c.height = ROWS;
    const x = c.getContext('2d')!; x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `900 ${ROWS * 0.95}px Unbounded`; x.fillText('gm', COLS / 2, ROWS * 0.47);
    setMask(x.getImageData(0, 0, COLS, ROWS).data);
  }, []);
  useLayoutEffect(() => {
    const cv = ref.current; if (!cv || !mask) return;
    const x = cv.getContext('2d')!;
    x.clearRect(0, 0, 1920, 1080);
    x.font = `${CH}px VT323`; x.textAlign = 'center'; x.textBaseline = 'top';
    const lt = t - T.rain;
    const form = sm(1.0, 2.2, lt) * (1 - sm(T.globe - T.rain - 0.35, T.globe - T.rain, lt)); // big gm forms out of the rain
    for (let c = 0; c < COLS; c++) {
      const speed = 18 + rnd(c) * 26, off = rnd(c * 7) * ROWS * 2, len = 10 + Math.floor(rnd(c * 3) * 18);
      const head = (lt * speed + off) % (ROWS + len + 6);
      for (let r = 0; r < ROWS; r++) {
        const inMask = mask[(r * COLS + c) * 4 + 3] > 120;
        const d = head - r;
        let a = d >= 0 && d < len ? 1 - d / len : 0;
        const isHead = d >= 0 && d < 1;
        if (inMask) a = Math.max(a * (1 - form), form);
        else a *= 1 - 0.75 * form;
        if (a <= 0.02) continue;
        const ch = inMask && form > 0.5 ? (c % 2 ? 'g' : 'm') : GLYPHS[Math.floor(rnd(c * 31 + r * 17 + Math.floor(fr / (3 + (c % 4)))) * GLYPHS.length)];
        x.fillStyle = isHead && !(inMask && form > 0.3) ? `rgba(235,255,220,${a})` : inMask && form > 0.3 ? `rgba(214,255,150,${a})` : `rgba(126,194,90,${a * 0.85})`;
        if (inMask && form > 0.3) {x.globalAlpha = form * 0.9; x.fillRect(c * CW + 1, r * CH + 1, CW - 2, CH - 2); x.globalAlpha = 1; if (form > 0.6) x.fillStyle = 'rgba(8,20,4,0.9)';}
        x.fillText(ch, c * CW + CW / 2, r * CH);
      }
    }
  }, [t, fr, mask]);
  return <canvas ref={ref} width={1920} height={1080} style={{position: 'absolute', inset: 0, filter: `drop-shadow(0 0 6px ${GREEN})`}} />;
};

const CITIES: [string, number, number][] = [
  ['Tokyo', 35.7, 139.7], ['Seoul', 37.5, 127], ['Hanoi', 21, 105.8], ['Singapore', 1.35, 103.8], ['Mumbai', 19, 72.8], ['Dubai', 25.2, 55.3],
  ['Istanbul', 41, 29], ['Nairobi', -1.3, 36.8], ['Berlin', 52.5, 13.4], ['Lagos', 6.5, 3.4], ['London', 51.5, -0.1], ['São Paulo', -23.5, -46.6],
  ['New York', 40.7, -74], ['Mexico City', 19.4, -99.1],
];
const LON0 = 150, LON1 = -90, TILT = 18 * (Math.PI / 180);
const lonAt = (t: number) => LON0 + (LON1 - LON0) * INOUT(Math.min(1, Math.max(0, (t - T.globe) / (T.logo - T.globe))));
const project = (lat: number, lon: number, lon0: number, R: number, cx: number, cy: number) => {
  const p = (lat * Math.PI) / 180, l = ((lon - lon0) * Math.PI) / 180;
  const z = Math.sin(TILT) * Math.sin(p) + Math.cos(TILT) * Math.cos(p) * Math.cos(l);
  return {x: cx + R * Math.cos(p) * Math.sin(l), y: cy - R * (Math.cos(TILT) * Math.sin(p) - Math.sin(TILT) * Math.cos(p) * Math.cos(l)), z};
};
const globeState = (t: number) => {
  const s = INOUT(sm(T.shrink, T.logo - 0.1, t));
  const R0 = 400 * (0.85 + 0.15 * OUT(Math.min(1, (t - T.globe) / 0.6)));
  return {R: R0 + (DOT.r - R0) * s, cx: 960 + (DOT.x - 960) * s, cy: 520 + (DOT.y - 520) * s, s};
};
// when each city faces the camera, it gets its gm
const pingTime = (lon: number) => {
  for (let k = 0; k <= 200; k++) {const t = T.globe + ((T.shrink - T.globe) * k) / 200; if (lonAt(t) <= lon + 8) return t;}
  return -1;
};
const PINGS = CITIES.map(([n, la, lo]) => ({n, la, lo, at: pingTime(lo)})).filter((p) => p.at > 0 && p.at < T.shrink - 0.2);

const Globe: React.FC<{t: number}> = ({t}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const {R, cx, cy, s} = globeState(t);
  const lon0 = lonAt(t);
  useLayoutEffect(() => {
    const cv = ref.current; if (!cv) return;
    const x = cv.getContext('2d')!;
    x.clearRect(0, 0, 1920, 1080);
    const appear = OUT(Math.min(1, (t - T.globe) / 0.5));
    // halo
    const hg = x.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.35);
    hg.addColorStop(0, `rgba(184,242,106,${0.18 * (1 - s)})`); hg.addColorStop(1, 'rgba(184,242,106,0)');
    x.fillStyle = hg; x.beginPath(); x.arc(cx, cy, R * 1.35, 0, Math.PI * 2); x.fill();
    // body fills as it becomes the dot
    x.fillStyle = `rgba(184,242,106,${0.05 + 0.95 * sm(0.55, 1, s)})`; x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.fill();
    const dr = Math.max(0.6, 2.3 * (R / 400));
    (DOTS as number[][]).forEach(([la, lo], i) => {
      const p = project(la, lo, lon0, R, cx, cy);
      const front = p.z > 0;
      const dly = rnd(i) * 0.4;
      const a = Math.min(1, Math.max(0, (t - T.globe - dly) / 0.25)) * appear;
      if (a <= 0) return;
      x.fillStyle = front ? `rgba(184,242,106,${a * (0.35 + 0.65 * p.z)})` : `rgba(126,194,90,${a * 0.1})`;
      x.beginPath(); x.arc(p.x, p.y, front ? dr : dr * 0.7, 0, Math.PI * 2); x.fill();
    });
    // rim
    x.strokeStyle = `rgba(184,242,106,${0.35 * appear})`; x.lineWidth = 1.5; x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.stroke();
  }, [t, R, cx, cy, s, lon0]);
  return (
    <AbsoluteFill>
      <canvas ref={ref} width={1920} height={1080} style={{position: 'absolute', inset: 0}} />
      {PINGS.map((p) => {
        const lt = t - p.at;
        if (lt < 0 || lt > 1.1 || s > 0.05) return null;
        const q = project(p.la, p.lo, lon0, R, cx, cy);
        if (q.z < 0.05) return null;
        const pop = OUT(Math.min(1, lt / 0.18)), fade = 1 - sm(0.75, 1.1, lt);
        return (
          <React.Fragment key={p.n}>
            <div style={{position: 'absolute', left: q.x - 40, top: q.y - 40, width: 80, height: 80, borderRadius: '50%', border: `2px solid ${LIME}`, transform: `scale(${0.2 + lt * 1.6})`, opacity: Math.max(0, 1 - lt * 1.3)}} />
            <div style={{position: 'absolute', left: q.x - 6, top: q.y - 6, width: 12, height: 12, borderRadius: 6, background: '#fff', boxShadow: `0 0 16px ${LIME}`, opacity: fade}} />
            <div style={{position: 'absolute', left: q.x + 14, top: q.y - 74, opacity: fade, transform: `translateY(${(1 - pop) * 16}px) scale(${0.8 + 0.2 * pop})`, transformOrigin: '0 100%'}}>
              <div style={{background: LIME, color: INK, fontFamily: MONO, fontSize: 48, lineHeight: 1, padding: '6px 14px 8px', borderRadius: '14px 14px 14px 2px', boxShadow: `0 0 24px ${LIME}88`}}>gm</div>
              <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 20, color: '#fff', marginTop: 8, letterSpacing: 0.3, textShadow: '0 2px 8px #000'}}>{p.n}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

const Logo: React.FC<{t: number}> = ({t}) => {
  const lt = t - T.logo + 0.12;
  const a = OUT(Math.min(1, Math.max(0, lt / 0.45)));
  const tag = OUT(Math.min(1, Math.max(0, (lt - 0.5) / 0.6)));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: LOGO_X, top: LOGO_Y, width: LOGO_W, height: 328 * LS, opacity: a, filter: `blur(${(1 - a) * 8}px)`}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: '100%', height: '100%'}} />
      </div>
      <div style={{position: 'absolute', left: DOT.x - DOT.r - 1.5, top: DOT.y - DOT.r - 1.5, width: (DOT.r + 1.5) * 2, height: (DOT.r + 1.5) * 2, borderRadius: '50%', background: LIME, boxShadow: `0 0 ${30 + 20 * Math.sin(lt * 4)}px ${LIME}aa`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: LOGO_Y + 328 * LS + 70, textAlign: 'center', fontFamily: MONO, fontSize: 76, color: LIME, textShadow: `0 0 18px ${GREEN}`, opacity: tag, transform: `translateY(${(1 - tag) * 16}px)`}}>gm, traders.</div>
    </AbsoluteFill>
  );
};

export const GMFilm: React.FC = () => {
  const ready = useFonts();
  const fr = useCurrentFrame();
  const t = fr / GM_FPS;
  if (!ready) return <AbsoluteFill style={{background: INK}} />;
  const scene = (a: number, b: number) => t >= a && t < b;
  const vol = (fr2: number) => interpolate(fr2, [0, f(T.end - DROP) - 50, f(T.end - DROP) - 1], [0.9, 0.9, 0], clamp);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Sequence from={0} durationInFrames={f(T.finger)}><Archive src="gm/hands.mp4" fr={fr} from={0.2} zoom={[1.0, 1.06]} dur={T.finger} /></Sequence>
      <Sequence from={f(T.finger)} durationInFrames={f(T.keyG - T.finger)}><Archive src="gm/finger.mp4" fr={fr - f(T.finger)} from={0.25} zoom={[1.05, 1.2]} dur={T.keyG - T.finger} /></Sequence>
      {scene(T.keyG, T.keyM) ? <KeyShot fr={fr - f(T.keyG)} ch="G" row={['F', 'G', 'H']} row2={['T', 'Y']} pressAt={0.12} dur={T.keyM - T.keyG} /> : null}
      {scene(T.keyM, T.crt) ? <KeyShot fr={fr - f(T.keyM)} ch="M" row={['N', 'M', ',']} row2={['J', 'K']} pressAt={0.1} dur={T.crt - T.keyM} /> : null}
      {scene(T.crt, T.rain) ? <CRT t={t} /> : null}
      {scene(T.rain, T.globe + 0.2) ? (
        <AbsoluteFill style={{transform: `scale(${1 + 0.03 * Math.exp(-(((t - DROP) / H) % 1) * 7)})`}}>
          <GlowFootage t={t} />
          <Rain t={t} fr={fr} />
        </AbsoluteFill>
      ) : null}
      {scene(T.globe, T.end) ? <Globe t={t} /> : null}
      {scene(T.globe - 0.05, T.globe + 0.35) ? (
        <AbsoluteFill style={{opacity: 0.55 * (1 - sm(T.globe, T.globe + 0.35, t)), mixBlendMode: 'screen'}}>
          <Sequence from={f(T.globe - 0.05)} durationInFrames={f(0.45)} layout="none">
            <OffthreadVideo src={staticFile('gm/glow/g75.mp4')} trimBefore={f(1)} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.5)'}} />
          </Sequence>
          <AbsoluteFill style={{background: LIME, mixBlendMode: 'multiply'}} />
        </AbsoluteFill>
      ) : null}
      {scene(T.logo - 0.12, T.end) ? <Logo t={t} /> : null}
      {scene(T.globe + 0.3, T.shrink) ? (
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily: MONO, fontSize: 52, color: LIME, letterSpacing: 2, textShadow: `0 0 14px ${GREEN}`, opacity: sm(T.globe + 0.3, T.globe + 0.6, t) * (1 - sm(T.shrink - 0.3, T.shrink, t))}}>delivering gm worldwide</div>
      ) : null}
      {t >= T.rain ? <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.1}} /> : null}
      {/* sound */}
      <Sequence from={0} durationInFrames={f(T.finger + 0.3)} layout="none"><Audio src={staticFile('gm/sfx/1372.mp3')} volume={(x) => interpolate(x, [0, f(T.finger), f(T.finger + 0.3)], [0.7, 0.7, 0], clamp)} /></Sequence>
      <Sequence from={f(T.keyG + 0.12)} durationInFrames={f(1)} layout="none"><Audio src={staticFile('gm/sfx/1365.mp3')} volume={1} /></Sequence>
      <Sequence from={f(T.keyM + 0.1)} durationInFrames={f(1)} layout="none"><Audio src={staticFile('gm/sfx/1119.mp3')} volume={1} /></Sequence>
      <Sequence from={f(T.crt + 0.1)} durationInFrames={f(0.5)} layout="none"><Audio src={staticFile('gm/sfx/1380.mp3')} volume={0.6} /></Sequence>
      <Sequence from={f(T.crt + 0.25)} durationInFrames={f(0.5)} layout="none"><Audio src={staticFile('gm/sfx/1380.mp3')} volume={0.6} /></Sequence>
      <Sequence from={f(T.crt + 0.42)} durationInFrames={f(DROP - T.crt - 0.42)} layout="none"><Audio src={staticFile('gm/sfx/1385.mp3')} volume={0.5} /></Sequence>
      <Sequence from={f(DROP - 0.9)} durationInFrames={70} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.35} /></Sequence>
      <Sequence from={f(DROP)} durationInFrames={f(T.end - DROP)} layout="none"><Audio src={staticFile('ascii/bass.mp3')} trimBefore={f(16.399)} volume={vol} /></Sequence>
      <Sequence from={f(T.shrink)} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.4} /></Sequence>
      <Sequence from={f(T.logo - 0.05)} durationInFrames={90} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.45} /></Sequence>
    </AbsoluteFill>
  );
};
