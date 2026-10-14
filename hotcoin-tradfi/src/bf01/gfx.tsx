// Shared graphics for Bubble Files 01 (chapters 2 to 7): world map moves, documents, calendar, price chart, big numbers.
// Same visual language as Part 1: dark paper ground, clean white labels, one red accent, things settle and stay still.
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {ANTON, INK, Paper, RED, Ring, Tag, ease, lin, sp} from './Part1';
import WORLD from './world.json';

const SANS = '"Inter Tight", system-ui, sans-serif', MONO = '"IBM Plex Mono", monospace', SERIF = '"Instrument Serif", Georgia, serif';
const LAND = '#2B3036', LAND_EDGE = '#14171A', SEA = '#0d1217', NEWS = '#ECE6D6', SILVER = '#C9CED3';
type Pt = [number, number];
const pt = (k: keyof typeof WORLD.points) => WORLD.points[k] as Pt;

// ---------- world map with a camera ----------
// `focus` is the world point to centre, `zoom` the scale; both ease from `from*` over the first second.
export const WorldMap: React.FC<{
  focus: Pt; zoom: number; fromFocus?: Pt; fromZoom?: number; highlight?: string[]; children?: React.ReactNode; moveLen?: number;
}> = ({focus, zoom, fromFocus, fromZoom, highlight = [], children, moveLen = 36}) => {
  const fr = useCurrentFrame();
  const p = ease(lin(fr, 0, moveLen));
  const ff = fromFocus ?? focus, fz = fromZoom ?? zoom;
  const z = Math.exp(Math.log(fz) + (Math.log(zoom) - Math.log(fz)) * p);
  const cx = ff[0] + (focus[0] - ff[0]) * p, cy = ff[1] + (focus[1] - ff[1]) * p;
  const drift = 1 + 0.03 * ease(lin(fr, moveLen, moveLen + 240));
  const fill = sp(fr - 6, 18, 140);
  return (
    <AbsoluteFill style={{background: SEA, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0',
        transform: `translate(960px, 540px) scale(${z * drift}) translate(${-cx}px, ${-cy}px)`}}>
        <svg width={1920} height={1080} style={{overflow: 'visible'}}>
          {WORLD.countries.map((c) => { const hi = highlight.includes(c.id ?? ''); return (
            <path key={(c.id ?? '') + c.name} d={c.d} fill={hi ? RED : LAND} fillOpacity={hi ? 0.88 * fill : 1}
              stroke={hi ? '#fff' : LAND_EDGE} strokeWidth={(hi ? 1.6 : 0.7) / z} />
          ); })}
          <ZoomCtx.Provider value={z}>{children}</ZoomCtx.Provider>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
const ZoomCtx = React.createContext(1);
// A pin with a pulse, sized to stay constant on screen whatever the zoom.
export const Pin: React.FC<{at: Pt; delay?: number}> = ({at, delay = 0}) => {
  const fr = useCurrentFrame();
  const z = React.useContext(ZoomCtx);
  if (fr < delay) return null;
  const pulse = ((fr - delay) % 40) / 40;
  return (
    <g>
      <circle cx={at[0]} cy={at[1]} r={(22 + 18 * pulse) / z} fill="none" stroke="#fff" strokeWidth={2 / z} opacity={1 - pulse} />
      <circle cx={at[0]} cy={at[1]} r={7 / z} fill="#fff" />
    </g>
  );
};
// A flight path that arcs between two points and draws on.
export const Route: React.FC<{a: Pt; b: Pt; at?: number; len?: number; bend?: number}> = ({a, b, at = 0, len = 40, bend = 0.28}) => {
  const fr = useCurrentFrame();
  const z = React.useContext(ZoomCtx);
  const p = ease(lin(fr, at, at + len));
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.hypot(b[0] - a[0], b[1] - a[1]) * bend;
  const d = `M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`;
  return (
    <g>
      <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={8 / z} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
      <path d={d} fill="none" stroke={RED} strokeWidth={4.5 / z} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </g>
  );
};
export const W = {pt};

// ---------- a typed document with one highlighted line ----------
export const Doc: React.FC<{
  kicker: string; title: string; lines: string[]; mark?: number; markAt?: number; x?: number; y?: number; w?: number; tilt?: number; stamp?: React.ReactNode;
}> = ({kicker, title, lines, mark, markAt = 20, x = 960, y = 540, w = 1300, tilt = -1.2, stamp}) => {
  const fr = useCurrentFrame();
  const p = sp(fr, 20, 110);
  const hl = ease(lin(fr, markAt, markAt + 16));
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, translate: '0 -50%', transform: `translateY(${(1 - p) * 120}px) rotate(${tilt * p}deg)`, opacity: Math.min(1, p * 1.6),
      background: NEWS, color: '#1d1b16', padding: '56px 64px 64px', boxSizing: 'border-box', boxShadow: '0 40px 90px rgba(0,0,0,.6)'}}>
      <div style={{font: `500 26px ${MONO}`, letterSpacing: 6, textTransform: 'uppercase', borderBottom: '2px solid #1d1b16', paddingBottom: 16}}>{kicker}</div>
      <div style={{font: `400 78px/1.06 ${SERIF}`, margin: '30px 0 26px'}}>{title}</div>
      {lines.map((l, i) => (
        <div key={i} style={{position: 'relative', font: `400 42px/1.4 ${SERIF}`, marginBottom: 6, opacity: mark === undefined || mark === i ? 1 : 0.45}}>
          {mark === i && <span style={{position: 'absolute', left: -8, right: `${(1 - hl) * 100}%`, top: 6, bottom: 2, background: 'rgba(227,38,47,.28)'}} />}
          <span style={{position: 'relative'}}>{l}</span>
        </div>
      ))}
      {stamp}
    </div>
  );
};

// ---------- a year/day calendar that flips ----------
export const Calendar: React.FC<{head: string; from: string; to: string; foot?: string; flipAt?: number}> = ({head, from, to, foot, flipAt = 12}) => {
  const fr = useCurrentFrame();
  const flip = lin(fr, flipAt, flipAt + 10);
  const val = flip < 0.5 ? from : to;
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{position: 'absolute', left: 960 - 330, top: 150, width: 660, height: 780, background: '#F2EEE6', boxShadow: '0 40px 100px rgba(0,0,0,.7)', overflow: 'hidden', transform: `rotate(1.2deg) scale(${1 + 0.04 * ease(lin(fr, 0, 120))})`}}>
        <div style={{height: 150, background: RED, color: '#fff', font: `400 92px/150px ${ANTON}`, textAlign: 'center', letterSpacing: 6}}>{head}</div>
        <div style={{position: 'relative', height: 630, perspective: 1600}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 0%', transform: `rotateX(${flip < 0.5 ? flip * 180 : (1 - flip) * -180}deg)`, textAlign: 'center'}}>
            <div style={{font: `400 ${val.length > 2 ? 300 : 400}px/1.25 ${ANTON}`, color: INK}}>{val}</div>
            {foot && <div style={{font: `500 46px ${MONO}`, letterSpacing: 12, color: flip >= 0.5 ? RED : '#666'}}>{foot}</div>}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- price chart ----------
// Silver in USD per ounce; t is fractional years. Draws from `p0` to `p1` of the path between frames a and b.
export type Series = [number, number][];
export const Chart: React.FC<{
  data: Series; t0: number; t1: number; vMax: number; a: number; b: number; p0?: number; p1?: number; years?: number[];
  labels?: {t: number; v: number; text: string; at: number; side?: 'l' | 'r'; ring?: boolean}[]; title?: string; ticks?: number[]; counter?: boolean;
  fromIndex?: number; toIndex?: number; // draw between these data points instead of p0/p1
  xLabels?: {t: number; text: string}[]; refs?: {v: number; text: string}[];
}> = ({data, t0, t1, vMax, a, b, p0: p0In = 0, p1: p1In = 1, years = [], labels = [], title = 'SILVER · US DOLLARS PER OUNCE', ticks = [10, 20, 30, 40, 50], counter, fromIndex, toIndex, xLabels = [], refs = []}) => {
  const fr = useCurrentFrame();
  const X = (t: number) => 230 + ((t - t0) / (t1 - t0)) * 1420, Y = (v: number) => 930 - (v / vMax) * 720;
  const pts = data.map(([t, v]) => [X(t), Y(v)] as Pt);
  const lens = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = lens.reduce((s, l) => s + l, 0);
  const upTo = (k: number) => lens.slice(0, k).reduce((s, l) => s + l, 0) / total;
  const p0 = fromIndex !== undefined ? upTo(fromIndex) : p0In, p1 = toIndex !== undefined ? upTo(toIndex) : p1In;
  const p = p0 + (p1 - p0) * ease(lin(fr, a, b));
  // the drawn part of the path, cut exactly at p
  let rem = p * total; const shown: Pt[] = [pts[0]];
  for (let i = 0; i < lens.length; i++) {
    if (rem >= lens[i]) { shown.push(pts[i + 1]); rem -= lens[i]; continue; }
    const k = rem / lens[i]; shown.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]); break;
  }
  const tip = shown[shown.length - 1];
  const val = ((930 - tip[1]) / 720) * vMax;
  const d = shown.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return (
    <AbsoluteFill>
      <Paper />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {ticks.map((v) => <g key={v}><line x1={230} x2={1650} y1={Y(v)} y2={Y(v)} stroke="rgba(255,255,255,.07)" strokeWidth={2} /><text x={1672} y={Y(v) + 9} fill="rgba(255,255,255,.4)" style={{font: `500 24px ${MONO}`}}>${v}</text></g>)}
        {years.map((y) => <text key={y} x={X(y) - 30} y={985} fill="rgba(255,255,255,.4)" style={{font: `500 24px ${MONO}`}}>{y}</text>)}
        {xLabels.map((l) => <text key={l.text} x={X(l.t)} y={985} textAnchor="middle" fill="rgba(255,255,255,.4)" style={{font: `500 24px ${MONO}`}}>{l.text}</text>)}
        {refs.map((r) => <g key={r.v}><line x1={230} x2={1650} y1={Y(r.v)} y2={Y(r.v)} stroke="rgba(255,255,255,.45)" strokeWidth={2} strokeDasharray="10 10" /><text x={236} y={Y(r.v) - 12} fill="rgba(255,255,255,.6)" style={{font: `500 22px ${MONO}`}}>{r.text}</text></g>)}
        <path d={`${d} L${tip[0]},930 L${pts[0][0]},930 Z`} fill="rgba(227,38,47,.08)" />
        <path d={d} fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={tip[0]} cy={tip[1]} r={10} fill="#fff" />
        {labels.filter((l) => l.ring).map((l, i) => <Ring key={i} cx={X(l.t)} cy={Y(l.v)} rx={54} ry={42} at={l.at} color="#fff" width={5} />)}
      </svg>
      {labels.filter((l) => l.text).map((l, i) => <Tag key={i} text={l.text} x={l.side === 'l' ? X(l.t) - 420 : X(l.t) + 30} y={Y(l.v) - 22} at={l.at} size={30} />)}
      <div style={{position: 'absolute', left: 230, top: 90, font: `500 26px ${MONO}`, letterSpacing: 5, color: SILVER}}>{title}</div>
      {counter && <div style={{position: 'absolute', left: 224, top: 130, font: `400 130px/1 ${ANTON}`, color: '#fff', fontVariantNumeric: 'tabular-nums'}}>${val.toFixed(2)}</div>}
    </AbsoluteFill>
  );
};

// ---------- a big number over footage ----------
export const BigNumber: React.FC<{value: number; prefix?: string; suffix?: string; at?: number; len?: number; label?: string; sub?: string; y?: number}> = ({value, prefix = '', suffix = '', at = 4, len = 40, label, sub, y = 380}) => {
  const fr = useCurrentFrame();
  const v = Math.round(value * ease(lin(fr, at, at + len)));
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', font: `400 200px/1 ${ANTON}`, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 10px 40px rgba(0,0,0,.6)', opacity: lin(fr, at - 4, at)}}>
        {prefix}{v.toLocaleString('en-US')}{suffix}
      </div>
      {label && <div style={{position: 'absolute', left: 0, right: 0, top: y + 220, display: 'flex', justifyContent: 'center'}}><Tag text={label} sub={sub} x={0} y={0} at={at + 10} size={36} /></div>}
    </>
  );
};

// ---------- the Tiffany advert, rebuilt as a graphic (headline word only, not a facsimile) ----------
export const Advert: React.FC<{wordAt: number}> = ({wordAt}) => {
  const fr = useCurrentFrame();
  const p = sp(fr, 20, 110);
  const w = fr >= wordAt ? sp(fr - wordAt, 13, 240) : 0;
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{position: 'absolute', left: 960 - 520, top: 110, width: 1040, height: 860, background: NEWS, color: '#1d1b16', padding: 56, boxSizing: 'border-box',
        boxShadow: '0 40px 100px rgba(0,0,0,.7)', transform: `translateY(${(1 - p) * 120}px) rotate(-0.8deg) scale(${1 + 0.06 * ease(lin(fr, 0, 200))})`}}>
        <div style={{font: `500 22px ${MONO}`, letterSpacing: 8, textAlign: 'center', borderBottom: '2px solid #1d1b16', paddingBottom: 14}}>AN ADVERTISEMENT</div>
        <div style={{height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{font: `400 150px/1 ${SERIF}`, opacity: w, transform: `scale(${1.5 - 0.5 * w})`}}>Unconscionable.</div>
        </div>
        <div style={{columnCount: 2, columnGap: 44, opacity: 0.5}}>
          {Array.from({length: 16}, (_, i) => <div key={i} style={{height: 13, margin: '0 0 17px', background: '#1d1b16', opacity: 0.5, width: `${76 + ((i * 37) % 24)}%`}} />)}
        </div>
        <div style={{position: 'absolute', bottom: 48, left: 0, right: 0, textAlign: 'center', font: `400 58px ${SERIF}`, letterSpacing: 6}}>TIFFANY &amp; CO.</div>
      </div>
      <Tag text="The New York Times" sub="26 March 1980" x={140} y={860} at={12} size={30} />
    </AbsoluteFill>
  );
};

// ---------- a ticker strip ----------
export const Ticker: React.FC<{text: string; sub: string; at?: number}> = ({text, sub, at = 6}) => {
  const fr = useCurrentFrame();
  const blink = Math.floor(fr / 8) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 440, height: 200, background: 'rgba(0,0,0,.82)', borderTop: `4px solid ${RED}`, borderBottom: `4px solid ${RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 50, opacity: lin(fr, at, at + 4)}}>
      <div style={{font: `400 110px/1 ${ANTON}`, color: '#fff', letterSpacing: 4}}>{text}</div>
      <div style={{font: `600 40px ${MONO}`, color: RED, letterSpacing: 6, opacity: blink ? 1 : 0.35}}>{sub}</div>
    </div>
  );
};

// ---------- a timeline bar (e.g. 1933 to 1974) ----------
export const Span: React.FC<{from: string; to: string; label: string; at?: number; y?: number}> = ({from, to, label, at = 6, y = 900}) => {
  const fr = useCurrentFrame();
  const p = ease(lin(fr, at, at + 30));
  return (
    <div style={{position: 'absolute', left: 260, right: 260, top: y}}>
      <div style={{height: 14, background: 'rgba(255,255,255,.12)'}}><div style={{height: 14, width: `${p * 100}%`, background: RED}} /></div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, font: `600 34px ${SANS}`, color: '#fff'}}>
        <span>{from}</span><span style={{font: `500 24px ${MONO}`, letterSpacing: 5, color: SILVER, opacity: p > 0.5 ? 1 : 0}}>{label}</span><span style={{opacity: p > 0.98 ? 1 : 0.25}}>{to}</span>
      </div>
    </div>
  );
};

// photo shown full frame with a slow push (Ken Burns)
export const Still: React.FC<{src: string; dur: number; from?: number; to?: number; grade?: string; pos?: string}> = ({src, dur, from = 1.04, to = 1.12, grade = 'contrast(1.05)', pos = '50% 50%'}) => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: INK}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${from + (to - from) * ease(lin(fr, 0, dur))})`, filter: grade}} />
    </AbsoluteFill>
  );
};
export {OffthreadVideo};
