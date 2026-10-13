// "Two Texas Brothers Tried to Corner the World's Silver": 9:16 trailer for Bubble Files, ~46 s at 30 fps.
// Cut to the voiceover (scripts/make-hunt-vo.py). Footage: scripts/fetch-hunt.mjs (public-domain archive films + Mixkit).
// Facts (Wikipedia "Silver Thursday", "Nelson Bunker Hunt"; Britannica): silver ~$6 in Jan 1979, $34.45 on 31 Dec 1979,
// ~$50 on 17-18 Jan 1980, $34 on 22 Jan, $29.75 on 10 Mar, $21.62 on 26 Mar, $10.80 close on Thu 27 Mar 1980.
// ~195M oz with partners by 1 Jan 1980 (about half futures). Tiffany & Co. "Unconscionable" ad, NYT, 26 Mar 1980.
// COMEX: position limits 7 Jan 1980, liquidation-only trading from 21 Jan 1980.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {AnimatedGrain, clamp} from '../alt/kit';
import US from './usmap.json';

export const HUNT_FPS = 30;
const FPS = HUNT_FPS;
const RED = '#E3262F', INK = '#0B0E11', PAPER = '#F1EFE8', NEWS = '#ECE6D6', GREEN = '#7EC25A', SILVER = '#C9CED3';
const ANTON = 'Anton, Impact, sans-serif', MONO = '"IBM Plex Mono", monospace', SANS = '"Inter Tight", sans-serif';
const MARKER = 'HuntMarker, cursive', SERIF = '"Instrument Serif", Georgia, serif';

// ---------- timeline: voiceover lines (durations from public/hunt/vo/lines.json) ----------
const VO: [string, number, string][] = [
  ['jan', 1.899, 'January, 1980.'],
  ['fifty', 2.432, 'Silver just hit $50 an ounce.'],
  ['six', 1.6, 'A year ago, it was $6.'],
  ['behind', 2.283, 'Behind it? Two brothers from Texas.'],
  ['heirs', 1.749, 'Sons of an oil billionaire.'],
  ['bet', 2.005, "And they've bet everything on silver."],
  ['ounces', 2.539, 'Nearly 200 million ounces of it.'],
  ['tiffany', 3.733, "Tiffany's takes out an ad in the New York Times. One word."],
  ['uncon', 1.259, 'Unconscionable.'],
  ['rules', 2.24, 'Then the exchange changes the rules.'],
  ['march', 1.728, 'And on March 27th,'],
  ['ten', 1.984, 'silver crashes to $10.'],
  ['thursday', 1.728, 'They call it Silver Thursday.'],
  ['how', 2.816, "How two brothers tried to corner the world's silver,"],
  ['lost', 1.899, 'and lost almost everything.'],
];
const GAP: Record<string, number> = {jan: 0.6, uncon: 0.4, rules: 0.5, march: 0.35, thursday: 1.05, how: 0.55};
const T: Record<string, {s: number; e: number; text: string}> = {};
{
  let t = 0;
  for (const [id, d, text] of VO) { t += GAP[id] ?? 0.22; T[id] = {s: t, e: t + d, text}; t += d; }
}
const END_AT = T.lost.e + 0.45;
const END_LEN = 4.2;
export const HUNT_DURATION = Math.round((END_AT + END_LEN) * FPS);
const fr = (s: number) => Math.round(s * FPS);

// ---------- helpers ----------
const sp = (f: number, damping = 14, stiffness = 180) => spring({frame: f, fps: FPS, config: {damping, stiffness}});
const lin = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], clamp);
const shake = (f: number, amp: number) => ({x: Math.sin(f * 2.7) * amp + Math.sin(f * 7.1) * amp * 0.5, y: Math.cos(f * 3.3) * amp});

const useFonts = () => {
  const [h] = useState(() => delayRender('hunt fonts'));
  useEffect(() => {
    const face = new FontFace('HuntMarker', `url(${staticFile('hunt/fonts/marker.woff2')})`);
    face.load().then((ff) => {
      document.fonts.add(ff);
      return Promise.all(['400 100px Anton', '500 30px "IBM Plex Mono"', '600 40px "Inter Tight"', '400 100px "Instrument Serif"', '400 60px HuntMarker'].map((s) => document.fonts.load(s)));
    }).then(() => continueRender(h));
  }, [h]);
};

// Hand-drawn ring path around (cx, cy).
const ring = (cx: number, cy: number, rx: number, ry: number) => {
  const p: string[] = [];
  for (let i = 0; i <= 30; i++) {
    const a = -0.5 + (i / 30) * (Math.PI * 2 + 0.7);
    const wob = 1 + 0.05 * Math.sin(a * 3) + 0.03 * Math.cos(a * 5);
    p.push(`${i ? 'L' : 'M'}${(cx + Math.cos(a) * rx * wob).toFixed(1)},${(cy + Math.sin(a) * ry * wob).toFixed(1)}`);
  }
  return p.join(' ');
};
const Ring: React.FC<{f: number; cx: number; cy: number; rx: number; ry: number; color?: string; w?: number; dur?: number}> = ({f, cx, cy, rx, ry, color = '#fff', w = 9, dur = 10}) => {
  const p = lin(f, 0, dur);
  return <path d={ring(cx, cy, rx, ry)} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
};

// ---------- footage ----------
// Full-bleed clip with a slow push-in and a punch at the cut.
const Full: React.FC<{src: string; dur: number; trim?: number; filter?: string; rate?: number; from?: number; to?: number; origin?: string}> = ({src, dur, trim = 0, filter, rate = 1, from = 1.08, to = 1.16, origin = '50% 50%'}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [from, to], clamp) + 0.06 * (1 - sp(f, 16, 260));
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: INK}}>
      <OffthreadVideo src={staticFile(`hunt/clips/${src}.mp4`)} trimBefore={trim} playbackRate={rate} muted
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`, transformOrigin: origin, filter}} />
    </AbsoluteFill>
  );
};
// Archive clip shown as a framed print over its own blurred copy: keeps 4:3 film sharp in a 9:16 frame.
const Card: React.FC<{src: string; dur: number; trim?: number; tilt?: number; y?: number; filter?: string; rate?: number}> = ({src, dur, trim = 0, tilt = -1.5, y = 0, filter = 'contrast(1.2) brightness(1.05)', rate = 1}) => {
  const f = useCurrentFrame();
  const inP = sp(f, 15, 220);
  const s = interpolate(f, [0, dur], [1, 1.07], clamp);
  const v = staticFile(`hunt/clips/${src}.mp4`);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <OffthreadVideo src={v} trimBefore={trim} playbackRate={rate} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: `blur(28px) brightness(0.35) ${filter}`, transform: 'scale(1.2)'}} />
      <div style={{position: 'absolute', left: 40, top: 540 + y, width: 1000, height: 750, transform: `translateY(${(1 - inP) * 60}px) rotate(${tilt * inP}deg) scale(${0.94 + 0.06 * inP})`,
        background: PAPER, padding: 14, boxShadow: '0 40px 90px rgba(0,0,0,0.7)'}}>
        <div style={{width: '100%', height: '100%', overflow: 'hidden', background: '#000'}}>
          <OffthreadVideo src={v} trimBefore={trim} playbackRate={rate} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`, filter}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- type ----------
const Label: React.FC<{text: string; f: number; x: number; y: number; size?: number; bg?: string; color?: string; typeSpeed?: number}> = ({text, f, x, y, size = 34, bg = INK, color = '#fff', typeSpeed = 1.2}) => {
  const n = Math.min(text.length, Math.floor(Math.max(0, f) * typeSpeed));
  if (f < 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, font: `500 ${size}px ${MONO}`, letterSpacing: 3, color, background: bg, padding: '10px 16px', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
      <span style={{color: GREEN}}>● </span>{text.slice(0, n)}<span style={{opacity: n < text.length ? 1 : 0}}>▌</span>
    </div>
  );
};
const Headline: React.FC<{lines: [string, boolean][]; f: number; y: number; size?: number; x?: number}> = ({lines, f, y, size = 150, x = 60}) => (
  <div style={{position: 'absolute', left: x, top: y, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14}}>
    {lines.map(([t, red], i) => {
      const p = sp(f - i * 4, 13, 240);
      return (
        <div key={i} style={{font: `400 ${size}px/0.95 ${ANTON}`, textTransform: 'uppercase', color: '#fff', opacity: Math.min(1, p * 2),
          transform: `translateY(${(1 - p) * 40}px) scale(${1.15 - 0.15 * p}) ${red ? 'rotate(-1.5deg)' : ''}`, transformOrigin: 'left center',
          background: red ? RED : undefined, padding: red ? '10px 22px 2px' : undefined,
          textShadow: red ? 'none' : '0 6px 0 rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.6)', boxShadow: red ? '0 10px 0 rgba(0,0,0,0.45)' : undefined}}>{t}</div>
      );
    })}
  </div>
);

// ---------- graphics ----------
// Silver, USD per troy ounce. t = months since 1 Jan 1979.
const PRICES: [number, number][] = [[0, 6.1], [2, 6.9], [4, 7.6], [6, 8.6], [7.5, 9.6], [8.5, 13.5], [9.3, 16.8], [10.5, 17.4], [11.3, 22], [12, 34.45], [12.57, 49.5], [12.7, 34], [13.3, 36.5], [14.3, 29.75], [14.83, 21.62], [14.87, 10.8]];
const PEAK = 10;
const cx = (t: number) => 110 + (t / 15) * 840;
const cy = (v: number) => 1380 - (v / 55) * 900;
const ptsUpTo = (k: number) => PRICES.slice(0, k + 1).map(([t, v]) => [cx(t), cy(v)] as [number, number]);
const pathOf = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

const ChartBase: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 40%, #1a1f24 0%, ${INK} 70%)`}}>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {[10, 20, 30, 40, 50].map((v) => (
        <g key={v}>
          <line x1={110} x2={960} y1={cy(v)} y2={cy(v)} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
          <text x={975} y={cy(v) + 10} fill="rgba(255,255,255,0.35)" style={{font: `500 26px ${MONO}`}}>${v}</text>
        </g>
      ))}
      <text x={110} y={1440} fill="rgba(255,255,255,0.45)" style={{font: `500 26px ${MONO}`, letterSpacing: 2}}>1979</text>
      <text x={cx(12) - 10} y={1440} fill="rgba(255,255,255,0.45)" style={{font: `500 26px ${MONO}`, letterSpacing: 2}}>1980</text>
      <line x1={cx(12)} x2={cx(12)} y1={cy(55)} y2={1390} stroke="rgba(255,255,255,0.12)" strokeWidth={2} strokeDasharray="6 10" />
      {children}
    </svg>
    <div style={{position: 'absolute', left: 110, top: 300, font: `500 30px ${MONO}`, letterSpacing: 4, color: SILVER}}>SILVER · USD / OZ</div>
  </AbsoluteFill>
);
const Line: React.FC<{pts: [number, number][]; p: number}> = ({pts, p}) => (
  <>
    <path d={pathOf(pts)} fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth={26} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    <path d={pathOf(pts)} fill="none" stroke={RED} strokeWidth={13} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} style={{filter: `drop-shadow(0 0 14px ${RED})`}} />
  </>
);
const valueAt = (pts: [number, number][], p: number) => {
  // price shown by the counter follows the drawn tip
  const lens = pts.slice(1).map(([x, y], i) => Math.hypot(x - pts[i][0], y - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0); let d = p * total;
  for (let i = 0; i < lens.length; i++) { if (d <= lens[i]) { const k = d / lens[i]; const [x, y] = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; return {x, y}; } d -= lens[i]; }
  return {x: pts[pts.length - 1][0], y: pts[pts.length - 1][1]};
};
const priceOfY = (y: number) => ((1380 - y) / 900) * 55;

// The climb to $50, then at `sixAt` the camera snaps back to the $6 start.
const ChartUp: React.FC<{dur: number; sixAt: number}> = ({dur, sixAt}) => {
  const f = useCurrentFrame();
  const pts = ptsUpTo(PEAK);
  const p = lin(f, 2, sixAt - 14, 0, 1);
  const eased = 1 - Math.pow(1 - p, 2.2);
  const tip = valueAt(pts, eased);
  const price = f < sixAt ? priceOfY(tip.y) : 6.1;
  const peakF = sixAt - 12;
  const six = f >= sixAt;
  const zoom = six ? 1 + 0.35 * sp(f - sixAt, 16, 200) : 1 + 0.04 * lin(f, 0, dur);
  const origin = six ? `${cx(0)}px ${cy(6.1)}px` : '50% 60%';
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: origin}}>
      <ChartBase>
        <Line pts={pts} p={eased} />
        {f >= peakF && <Ring f={f - peakF} cx={cx(12.57)} cy={cy(49.5)} rx={78} ry={58} />}
        {six && <Ring f={f - sixAt} cx={cx(0)} cy={cy(6.1)} rx={60} ry={46} />}
        {f >= peakF && !six && <text x={cx(12.57) - 290} y={cy(49.5) + 18} fill="#fff" stroke="rgba(0,0,0,.8)" strokeWidth={10} paintOrder="stroke" style={{font: `400 92px ${MARKER}`}}>$50</text>}
        {six && <text x={cx(0) + 60} y={cy(6.1) - 70} fill="#fff" stroke="rgba(0,0,0,.8)" strokeWidth={10} paintOrder="stroke" style={{font: `400 84px ${MARKER}`}}>$6</text>}
        {six && <text x={cx(0) + 70} y={cy(6.1) - 10} fill={SILVER} style={{font: `500 30px ${MONO}`, letterSpacing: 3}}>JAN 1979</text>}
      </ChartBase>
      <div style={{position: 'absolute', left: 110, top: 360, font: `400 190px/1 ${ANTON}`, color: '#fff', fontVariantNumeric: 'tabular-nums', opacity: six ? 0 : 1}}>
        ${price.toFixed(2)}
      </div>
    </AbsoluteFill>
  );
};
// From the peak down to $10.80: the line falls, the frame shakes.
const ChartCrash: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const up = ptsUpTo(PEAK);
  const down = PRICES.slice(PEAK).map(([t, v]) => [cx(t), cy(v)] as [number, number]);
  const p = lin(f, 3, dur * 0.7, 0, 1);
  const eased = p * p;
  const tip = valueAt(down, eased);
  const price = priceOfY(tip.y);
  const sh = p > 0.85 ? shake(f, 14 * (1 - lin(f, dur * 0.7, dur, 0, 1))) : {x: 0, y: 0};
  const land = dur * 0.7;
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) scale(${1.08 - 0.08 * lin(f, 0, dur)})`}}>
      <ChartBase>
        <Line pts={up} p={1} />
        <Line pts={down} p={eased} />
        {f >= land && <Ring f={f - land} cx={cx(14.87)} cy={cy(10.8)} rx={70} ry={52} />}
        {f >= land && <text x={cx(14.87) - 330} y={cy(10.8) + 100} fill="#fff" stroke="rgba(0,0,0,.8)" strokeWidth={10} paintOrder="stroke" style={{font: `400 88px ${MARKER}`}}>$10.80</text>}
      </ChartBase>
      <div style={{position: 'absolute', left: 110, top: 360, font: `400 190px/1 ${ANTON}`, color: f >= land ? RED : '#fff', fontVariantNumeric: 'tabular-nums'}}>${price.toFixed(2)}</div>
    </AbsoluteFill>
  );
};

const USMap: React.FC<{dur: number}> = () => {
  const f = useCurrentFrame();
  const tx = US.states.find((s) => s.name === 'Texas')!;
  const pop = sp(f - 4, 11, 200);
  const W = 1040, sc = W / US.w;
  const [tcx, tcy] = US.texasCentroid;
  const zoom = 1 + 0.5 * lin(f, 0, 40, 0, 1) ** 1.4;
  return (
    <AbsoluteFill style={{background: `radial-gradient(100% 60% at 50% 45%, #1b2026 0%, ${INK} 75%)`}}>
      <div style={{position: 'absolute', left: 20, top: 640, width: W, height: US.h * sc, transform: `scale(${zoom})`, transformOrigin: `${tcx * sc}px ${tcy * sc}px`}}>
        <svg width={W} height={US.h * sc} viewBox={`0 0 ${US.w} ${US.h}`}>
          {US.states.map((s) => <path key={s.name} d={s.d} fill="#2b3138" stroke={INK} strokeWidth={1.2} />)}
          <path d={tx.d} fill="none" stroke="#000" strokeOpacity={0.6} strokeWidth={10} />
          <path d={tx.d} fill={RED} stroke="#fff" strokeWidth={2.5} style={{transform: `scale(${0.85 + 0.15 * pop})`, transformOrigin: `${tcx}px ${tcy}px`, opacity: Math.min(1, pop * 1.5)}} />
          {f > 10 && <Ring f={f - 10} cx={tcx + 10} cy={tcy - 10} rx={150} ry={120} w={5} />}
        </svg>
      </div>
      <div style={{position: 'absolute', left: 120, top: 520, font: `400 120px ${MARKER}`, color: '#fff', textShadow: '0 6px 0 rgba(0,0,0,.6)', opacity: lin(f, 12, 18)}}>TEXAS</div>
    </AbsoluteFill>
  );
};

const Dossier: React.FC = () => {
  const f = useCurrentFrame();
  const card = (i: number, name: string[], at: number) => {
    const p = sp(f - at, 14, 200);
    return (
      <div style={{position: 'absolute', left: 70 + i * 30, top: 470 + i * 430, width: 940, height: 380, background: '#D9C9A3', transform: `translateX(${(1 - p) * (i ? 1100 : -1100)}px) rotate(${i ? 1.8 : -2.2}deg)`,
        boxShadow: '0 30px 70px rgba(0,0,0,.6)', padding: '34px 44px', boxSizing: 'border-box', backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,.05) 1px, transparent 1px)', backgroundSize: '100% 46px'}}>
        <div style={{font: `500 28px ${MONO}`, letterSpacing: 4, color: '#5b4a2a'}}>SUBJECT {String(i + 1).padStart(2, '0')} · DALLAS, TEXAS</div>
        <div style={{font: `400 112px/1 ${ANTON}`, color: INK, marginTop: 26, textTransform: 'uppercase'}}>{name[0]}</div>
        <div style={{font: `400 112px/1 ${ANTON}`, color: RED, textTransform: 'uppercase'}}>{name[1]}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: `radial-gradient(100% 70% at 50% 45%, #222830 0%, ${INK} 75%)`}}>
      {card(0, ['Nelson Bunker', 'Hunt'], 2)}
      {card(1, ['William Herbert', 'Hunt'], 9)}
    </AbsoluteFill>
  );
};

const Counter: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const p = 1 - Math.pow(1 - lin(f, 2, dur * 0.75), 3);
  const n = Math.round(195_000_000 * p);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', font: `400 168px/1 ${ANTON}`, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 8px 0 rgba(0,0,0,.6), 0 0 60px rgba(0,0,0,.7)'}}>
        {n.toLocaleString('en-US')}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 830, display: 'flex', justifyContent: 'center'}}>
        <div style={{font: `400 92px/1 ${ANTON}`, color: '#fff', background: RED, padding: '10px 26px 2px', transform: 'rotate(-1.5deg)'}}>OUNCES</div>
      </div>
      <Label text="with partners · about half in futures · 1 Jan 1980" f={f - 10} x={70} y={1010} size={24} typeSpeed={3} />
    </>
  );
};

// A newsprint advert, rebuilt as a graphic (not a facsimile): the headline lands on "Unconscionable".
const Advert: React.FC<{wordAt: number; dur: number}> = ({wordAt, dur}) => {
  const f = useCurrentFrame();
  const inP = sp(f, 15, 200);
  const w = f >= wordAt ? sp(f - wordAt, 12, 260) : 0;
  const zoom = 1 + 0.06 * lin(f, 0, wordAt) + 0.12 * w;
  const sh = f >= wordAt && f < wordAt + 8 ? shake(f, 8) : {x: 0, y: 0};
  const bars = Array.from({length: 18}, (_, i) => i);
  return (
    <AbsoluteFill style={{background: INK, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <div style={{position: 'absolute', left: 60, top: 300, width: 960, height: 1040, background: NEWS, transform: `translateY(${(1 - inP) * 120}px) scale(${zoom}) rotate(-1deg)`, transformOrigin: '50% 45%',
        boxShadow: '0 40px 100px rgba(0,0,0,.7)', padding: 60, boxSizing: 'border-box', color: '#1d1b16'}}>
        <div style={{font: `500 26px ${MONO}`, letterSpacing: 8, textAlign: 'center', borderBottom: '3px solid #1d1b16', paddingBottom: 16}}>AN ADVERTISEMENT</div>
        <div style={{height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{font: `400 150px/1 ${SERIF}`, letterSpacing: -2, opacity: w, transform: `scale(${1.6 - 0.6 * w})`, filter: w < 0.9 ? `blur(${(1 - w) * 10}px)` : undefined}}>Unconscionable.</div>
        </div>
        <div style={{columnCount: 2, columnGap: 40, opacity: 0.55}}>
          {bars.map((i) => <div key={i} style={{height: 14, margin: '0 0 18px', background: '#1d1b16', opacity: 0.5, width: `${78 + ((i * 37) % 22)}%`}} />)}
        </div>
        <div style={{position: 'absolute', bottom: 56, left: 0, right: 0, textAlign: 'center', font: `400 64px ${SERIF}`, letterSpacing: 6}}>TIFFANY &amp; CO.</div>
      </div>
      <Label text="The New York Times · 26 March 1980" f={f - 6} x={70} y={1385} size={26} typeSpeed={3} />
    </AbsoluteFill>
  );
};

const Stamp: React.FC<{f: number; text: string; sub: string}> = ({f, text, sub}) => {
  if (f < 0) return null;
  const p = sp(f, 10, 300);
  return (
    <div style={{position: 'absolute', left: 90, top: 760, transform: `rotate(-9deg) scale(${1.8 - 0.8 * p})`, opacity: Math.min(1, p * 2), border: `10px solid ${RED}`, padding: '20px 34px', color: RED, textAlign: 'center',
      background: 'rgba(11,14,17,0.55)', boxShadow: '0 0 0 4px rgba(227,38,47,.35) inset'}}>
      <div style={{font: `400 128px/1 ${ANTON}`, letterSpacing: 2}}>{text}</div>
      <div style={{font: `500 30px ${MONO}`, letterSpacing: 6, marginTop: 10}}>{sub}</div>
    </div>
  );
};

const Calendar: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const flip = lin(f, 10, 20);
  const day = flip < 0.5 ? 26 : 27;
  const dayName = day === 26 ? 'WEDNESDAY' : 'THURSDAY';
  const zoom = 1 + 0.08 * lin(f, 0, dur);
  return (
    <AbsoluteFill style={{background: `radial-gradient(100% 70% at 50% 45%, #232930 0%, ${INK} 75%)`}}>
      <div style={{position: 'absolute', left: 190, top: 470, width: 700, height: 840, background: PAPER, boxShadow: '0 40px 100px rgba(0,0,0,.7)', transform: `scale(${zoom}) rotate(1.5deg)`, overflow: 'hidden'}}>
        <div style={{height: 170, background: RED, color: '#fff', font: `400 110px/170px ${ANTON}`, textAlign: 'center', letterSpacing: 6}}>MARCH 1980</div>
        <div style={{position: 'relative', height: 670, perspective: 1600}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 0%', transform: `rotateX(${flip < 0.5 ? flip * 180 : (1 - flip) * -180}deg)`, background: PAPER, textAlign: 'center'}}>
            <div style={{font: `400 440px/1.1 ${ANTON}`, color: INK, marginTop: 10}}>{day}</div>
            <div style={{font: `500 50px ${MONO}`, letterSpacing: 14, color: day === 27 ? RED : '#555'}}>{dayName}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const HostShot: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1.02, 1.08], clamp);
  return (
    <AbsoluteFill style={{background: INK}}>
      <OffthreadVideo src={staticFile('hunt/clips/floorWide.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.2) brightness(0.45) blur(3px)', transform: 'scale(1.3)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,14,17,.85) 0%, rgba(11,14,17,.2) 45%, rgba(11,14,17,.6) 100%)'}} />
      <Img src={staticFile('hunt/host/host-shocked.png')} style={{position: 'absolute', left: -60, bottom: -260, height: 1500, transform: `scale(${s})`, transformOrigin: '50% 100%',
        filter: 'drop-shadow(4px 0 0 #fff) drop-shadow(-4px 0 0 #fff) drop-shadow(0 -4px 0 #fff) drop-shadow(0 30px 50px rgba(0,0,0,.7))'}} />
      <Headline f={f} y={250} size={140} lines={[['Two brothers', false], ['Cornered silver', true]]} />
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: INK}}>
      <OffthreadVideo src={staticFile('hunt/clips/coinsMacro.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) brightness(0.28) contrast(1.2)', transform: `scale(${1.3 + 0.05 * lin(f, 0, 120)})`}} />
      <div style={{position: 'absolute', left: 70, top: 470, font: `500 32px ${MONO}`, letterSpacing: 6, color: INK, background: GREEN, padding: '10px 18px', opacity: lin(f, 2, 6)}}>BUBBLE FILES</div>
      <Headline f={f - 4} y={560} size={170} lines={[['The Hunt', false], ['Brothers', false], ['Full story Tuesday', true]]} />
      <Img src={staticFile('brand/logo-official-white.png')} style={{position: 'absolute', left: 70, top: 1290, width: 300, opacity: lin(f, 16, 26)}} />
      <div style={{position: 'absolute', left: 70, top: 1370, font: `500 28px ${MONO}`, letterSpacing: 4, color: SILVER, opacity: lin(f, 20, 30)}}>YOUTUBE.COM/@HOTCOINGLOBAL</div>
    </AbsoluteFill>
  );
};

const Caption: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const line = VO.find(([id]) => t >= T[id].s - 0.05 && t <= T[id].e + 0.15);
  if (!line || ['uncon', 'thursday'].includes(line[0])) return null;
  const words = line[2].split(' ');
  const {s, e} = T[line[0]];
  const k = Math.floor(((t - s) / (e - s)) * words.length + 0.5);
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1520, textAlign: 'center', font: `600 54px/1.2 ${SANS}`, color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,.9), 0 0 3px #000'}}>
      {words.map((w, i) => <span key={i} style={{opacity: i <= k ? 1 : 0.35}}>{w} </span>)}
    </div>
  );
};

// ---------- shots ----------
type Shot = {at: number; el: (dur: number) => React.ReactNode};
const SHOTS: Shot[] = [
  {at: 0, el: (d) => <><Card src="clock" dur={d} filter="grayscale(1) contrast(1.3)" /><LabelAt at={T.jan.s - 0.1} text="January 1980" x={70} y={360} size={44} /></>},
  {at: T.fifty.s, el: (d) => <Full src="molten3" dur={d} trim={30} filter="grayscale(0.85) contrast(1.3) brightness(1.1)" />},
  {at: T.fifty.s + 0.85, el: (d) => <ChartUp dur={d} sixAt={fr(T.six.s - T.fifty.s - 0.85)} />},
  {at: T.behind.s, el: () => <Dossier />},
  {at: T.behind.s + 1.45, el: (d) => <USMap dur={d} />},
  {at: T.heirs.s + 0.2, el: (d) => <Card src="texasMap" dur={d} trim={60} filter="contrast(1.25)" tilt={1.2} />},
  {at: T.heirs.s + 0.95, el: (d) => <><Card src="derricks" dur={d} filter="contrast(1.25)" /><LabelAt at={T.heirs.s + 1.0} text="Father: H. L. Hunt · oil" x={70} y={360} /></>},
  {at: T.bet.s, el: (d) => <Card src="dallasPhone" dur={d} filter="contrast(1.1) saturate(0.8)" tilt={-1} />},
  {at: T.bet.s + 0.6, el: (d) => <Card src="buySlip" dur={d} filter="contrast(1.1) saturate(0.8)" tilt={1.4} />},
  {at: T.bet.s + 1.15, el: (d) => <><Full src="coinsMacro" dur={d} filter="grayscale(1) contrast(1.3) brightness(1.1)" /><HeadAt at={T.bet.s + 1.25} lines={[['Silver', true]]} y={330} /></>},
  {at: T.ounces.s, el: (d) => <><Full src="coins" dur={d} trim={60} filter="grayscale(1) contrast(1.2) brightness(0.55)" /><Counter dur={d} /></>},
  {at: T.tiffany.s, el: (d) => <Card src="quoteBoard" dur={d} filter="grayscale(1) contrast(1.3)" />},
  {at: T.tiffany.s + 1.2, el: (d) => <Advert dur={d} wordAt={fr(T.uncon.s - T.tiffany.s - 1.2)} />},
  {at: T.rules.s, el: (d) => <Card src="agBoard" dur={d} filter="grayscale(1) contrast(1.3)" tilt={1.2} />},
  {at: T.rules.s + 0.95, el: (d) => <><Full src="floorWide" dur={d} filter="grayscale(1) contrast(1.3) brightness(0.8)" /><StampAt at={T.rules.s + 1.15} /></>},
  {at: T.march.s - 0.15, el: (d) => <Calendar dur={d} />},
  {at: T.ten.s, el: (d) => <Card src="sellSlip" dur={d} rate={0.3} filter="grayscale(1) contrast(1.35)" tilt={-2} />},
  {at: T.ten.s + 0.55, el: (d) => <ChartCrash dur={d} />},
  {at: T.ten.e + 0.25, el: (d) => <Card src="tapeDelay" dur={d} filter="grayscale(1) contrast(1.5) brightness(1.1)" />},
  {at: T.thursday.s - 0.12, el: (d) => <><Full src="molten" dur={d} rate={0.6} filter="grayscale(1) contrast(1.4) brightness(1.05)" /><AbsoluteFill style={{background: 'rgba(11,14,17,.35)'}} /><TitleNow /></>},
  {at: T.how.s, el: (d) => <HostShot dur={d} />},
  {at: T.lost.s, el: (d) => <Card src="headDown" dur={d} rate={0.65} filter="grayscale(1) contrast(1.25)" tilt={-1} />},
  {at: END_AT, el: () => <EndCard />},
];

const TitleNow: React.FC = () => {
  const f = useCurrentFrame();
  return <Headline f={f - 2} y={620} size={190} lines={[['Silver', false], ['Thursday', true]]} />;
};

// Shot-relative wrappers that start their own animation clock at an absolute time.
const LabelAt: React.FC<{at: number; text: string; x: number; y: number; size?: number}> = ({at, text, x, y, size}) => {
  const f = useCurrentFrame();
  const startOfShot = SHOTS_START.get(useShotIndex()) ?? 0;
  return <Label text={text} f={f - (fr(at) - startOfShot)} x={x} y={y} size={size} />;
};
const HeadAt: React.FC<{at: number; lines: [string, boolean][]; y: number}> = ({at, lines, y}) => {
  const f = useCurrentFrame();
  const startOfShot = SHOTS_START.get(useShotIndex()) ?? 0;
  const local = f - (fr(at) - startOfShot);
  return local < 0 ? null : <Headline f={local} y={y} lines={lines} size={170} />;
};
const StampAt: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const startOfShot = SHOTS_START.get(useShotIndex()) ?? 0;
  return <Stamp f={f - (fr(at) - startOfShot)} text="LIQUIDATION ONLY" sub="COMEX · 21 JAN 1980" />;
};
const ShotIndex = React.createContext(0);
const useShotIndex = () => React.useContext(ShotIndex);
const SHOTS_START = new Map(SHOTS.map((s, i) => [i, fr(s.at)]));

// ---------- sound ----------
type Cue = [number, string, number];
const CUES: Cue[] = [];
SHOTS.forEach((s, i) => { if (i) CUES.push([s.at - 0.08, 'sfx/foley/whoosh.wav', 0.35]); });
CUES.push(
  [0.05, 'sfx/foley/swell.wav', 0.5],
  ...Array.from({length: 4}, (_, i): Cue => [T.jan.s + i * 0.5, 'sfx/mechanical/snap.mp3', 0.35]),
  [T.six.s - 0.45, 'sfx/foley/hit.wav', 0.55],
  [T.behind.s + 0.05, 'sfx/foley/thump.wav', 0.6], [T.behind.s + 0.35, 'sfx/foley/thump.wav', 0.6],
  [T.behind.s + 1.6, 'sfx/foley/hit.wav', 0.45],
  [T.uncon.s - 1.4, 'sfx/foley/swell.wav', 0.7], [T.uncon.s, 'sfx/foley/hit.wav', 0.9],
  [T.rules.s + 1.15, 'sfx/foley/hit.wav', 0.8],
  [T.march.s + 0.2, 'sfx/mechanical/press.mp3', 0.6],
  [T.ten.s, 'sfx/foley/swell.wav', 0.6], [T.ten.s + 0.55 + 0.7 * (T.ten.e + 0.25 - T.ten.s - 0.55), 'sfx/foley/hit.wav', 1], [T.ten.e, 'sfx/foley/thump.wav', 0.9],
  [T.thursday.s - 0.1, 'sfx/foley/hit.wav', 1],
  [T.how.s, 'sfx/foley/thump.wav', 0.6],
  [END_AT, 'sfx/foley/hit.wav', 0.8],
);
const MUSIC_TRIM_S = 18;
const musicVol = (f: number) => {
  const t = f / FPS;
  const fadeIn = lin(t, 0, 1.2, 0, 1);
  const out = 1 - lin(t, END_AT + END_LEN - 1.4, END_AT + END_LEN, 0, 1);
  // silence after the crash lands, back in for the title
  const gap = t > T.ten.e + 0.2 && t < T.thursday.s - 0.1 ? 0.05 : 1;
  const lift = t >= T.thursday.s - 0.1 ? 1.35 : 1;
  return 0.3 * fadeIn * out * gap * lift;
};

export const HuntTrailer: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: INK}}>
      {SHOTS.map((s, i) => {
        const from = fr(s.at), to = i + 1 < SHOTS.length ? fr(SHOTS[i + 1].at) : HUNT_DURATION;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <ShotIndex.Provider value={i}>{s.el(to - from)}</ShotIndex.Provider>
          </Sequence>
        );
      })}
      <AbsoluteFill style={{background: 'radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%)', pointerEvents: 'none'}} />
      <AnimatedGrain f={f * 2} opacity={0.32} />
      <Caption />
      {f < fr(END_AT) && <div style={{position: 'absolute', left: 70, top: 200, font: `500 26px ${MONO}`, letterSpacing: 6, color: 'rgba(255,255,255,.7)'}}>BUBBLE FILES</div>}
      <Audio src={staticFile('hunt/music/614.mp3')} trimBefore={MUSIC_TRIM_S * FPS} volume={musicVol} />
      {VO.map(([id]) => (
        <Sequence key={id} from={fr(T[id].s)} layout="none"><Audio src={staticFile(`hunt/vo/${id}.wav`)} volume={1} /></Sequence>
      ))}
      {CUES.map(([at, src, v], i) => (
        <Sequence key={'c' + i} from={Math.max(0, fr(at))} durationInFrames={90} layout="none"><Audio src={staticFile(src)} volume={v} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
