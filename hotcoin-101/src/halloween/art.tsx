import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {LOCKUP} from '../notebook/tokens';

// Halloween season look, after Alex's logo concept: black ground, orange
// bokeh, cobwebs, a bat, and the logo dot as a glowing green jack-o'-lantern.

export const HW = {
  bg: '#060706',
  green: '#7EC25A',
  greenHi: '#B7F27F',
  glow: '#E9FF9E',
  orange: '#FF8A2A',
  red: '#FF5A4E',
  text: '#F4F4EF',
  dim: 'rgba(244,244,239,0.62)',
  faint: 'rgba(244,244,239,0.16)',
};

/** green jack-o'-lantern, centred on 0,0 */
export const Pumpkin: React.FC<{r: number; id: string; glow?: number}> = ({r, id, glow = 1}) => (
  <g>
    <defs>
      <radialGradient id={`${id}-halo`}>
        <stop offset="0%" stopColor={HW.green} stopOpacity={0.75 * glow} />
        <stop offset="45%" stopColor={HW.green} stopOpacity={0.28 * glow} />
        <stop offset="100%" stopColor={HW.green} stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${id}-skin`} cx="40%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#C6F58F" />
        <stop offset="40%" stopColor="#7EC25A" />
        <stop offset="100%" stopColor="#2C6A18" />
      </radialGradient>
      <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation={r * 0.08} />
      </filter>
    </defs>
    <circle r={r * 2.2} fill={`url(#${id}-halo)`} />
    <path d={`M ${-r * 0.06} ${-r * 0.82} C ${-r * 0.1} ${-r * 1.05}, ${r * 0.02} ${-r * 1.2}, ${r * 0.22} ${-r * 1.22} L ${r * 0.24} ${-r * 1.08} C ${r * 0.1} ${-r * 1.06}, ${r * 0.1} ${-r * 0.96}, ${r * 0.1} ${-r * 0.8} Z`} fill="#2B4A1A" />
    {[
      {x: -0.62, rx: 0.44, ry: 0.78},
      {x: 0.62, rx: 0.44, ry: 0.78},
      {x: -0.34, rx: 0.52, ry: 0.88},
      {x: 0.34, rx: 0.52, ry: 0.88},
      {x: 0, rx: 0.5, ry: 0.92},
    ].map((l, i) => (
      <ellipse key={i} cx={l.x * r} cy={0} rx={l.rx * r} ry={l.ry * r} fill={`url(#${id}-skin)`} stroke="#1E4A10" strokeWidth={r * 0.035} />
    ))}
    <g fill={HW.glow}>
      <g filter={`url(#${id}-blur)`} opacity={0.9}>
        <path d={`M ${-r * 0.48} ${-r * 0.12} L ${-r * 0.2} ${-r * 0.12} L ${-r * 0.34} ${-r * 0.38} Z`} />
        <path d={`M ${r * 0.48} ${-r * 0.12} L ${r * 0.2} ${-r * 0.12} L ${r * 0.34} ${-r * 0.38} Z`} />
        <path d={`M ${-r * 0.56} ${r * 0.18} L ${-r * 0.36} ${r * 0.26} L ${-r * 0.24} ${r * 0.16} L ${-r * 0.1} ${r * 0.28} L ${r * 0.06} ${r * 0.16} L ${r * 0.2} ${r * 0.28} L ${r * 0.36} ${r * 0.16} L ${r * 0.56} ${r * 0.18} C ${r * 0.4} ${r * 0.56}, ${-r * 0.4} ${r * 0.56}, ${-r * 0.56} ${r * 0.18} Z`} />
      </g>
      <path d={`M ${-r * 0.48} ${-r * 0.12} L ${-r * 0.2} ${-r * 0.12} L ${-r * 0.34} ${-r * 0.38} Z`} />
      <path d={`M ${r * 0.48} ${-r * 0.12} L ${r * 0.2} ${-r * 0.12} L ${r * 0.34} ${-r * 0.38} Z`} />
      <path d={`M ${-r * 0.56} ${r * 0.18} L ${-r * 0.36} ${r * 0.26} L ${-r * 0.24} ${r * 0.16} L ${-r * 0.1} ${r * 0.28} L ${r * 0.06} ${r * 0.16} L ${r * 0.2} ${r * 0.28} L ${r * 0.36} ${r * 0.16} L ${r * 0.56} ${r * 0.18} C ${r * 0.4} ${r * 0.56}, ${-r * 0.4} ${r * 0.56}, ${-r * 0.56} ${r * 0.18} Z`} />
    </g>
  </g>
);

/** little ghost for a "trick" year, centred on 0,0 */
export const Ghost: React.FC<{r: number}> = ({r}) => (
  <g>
    <circle r={r * 1.4} fill={HW.red} opacity={0.1} />
    <path
      d={`M ${-r * 0.7} ${r * 0.9} L ${-r * 0.7} ${-r * 0.1} C ${-r * 0.7} ${-r * 0.9}, ${r * 0.7} ${-r * 0.9}, ${r * 0.7} ${-r * 0.1} L ${r * 0.7} ${r * 0.9} L ${r * 0.47} ${r * 0.7} L ${r * 0.23} ${r * 0.9} L 0 ${r * 0.7} L ${-r * 0.23} ${r * 0.9} L ${-r * 0.47} ${r * 0.7} Z`}
      fill="#EDEDEA"
    />
    <ellipse cx={-r * 0.24} cy={-r * 0.12} rx={r * 0.11} ry={r * 0.17} fill="#111" />
    <ellipse cx={r * 0.24} cy={-r * 0.12} rx={r * 0.11} ry={r * 0.17} fill="#111" />
    <ellipse cx={0} cy={r * 0.22} rx={r * 0.12} ry={r * 0.14} fill="#111" />
  </g>
);

/** quarter cobweb from a corner at 0,0 opening into +x +y */
export const Web: React.FC<{size: number; opacity?: number; rot?: number}> = ({size, opacity = 0.55, rot = 0}) => {
  const spokes = [0, 18, 36, 54, 72, 90].map((a) => (a * Math.PI) / 180);
  const rings = [0.22, 0.42, 0.62, 0.82, 1];
  return (
    <g transform={`rotate(${rot})`} stroke="#fff" fill="none" opacity={opacity} strokeWidth={1.6}>
      {spokes.map((a, i) => (
        <line key={i} x1={0} y1={0} x2={Math.cos(a) * size} y2={Math.sin(a) * size} />
      ))}
      {rings.map((k, ri) =>
        spokes.slice(0, -1).map((a, i) => {
          const b = spokes[i + 1];
          const p = {x: Math.cos(a) * size * k, y: Math.sin(a) * size * k};
          const q = {x: Math.cos(b) * size * k, y: Math.sin(b) * size * k};
          const m = (a + b) / 2;
          const c = {x: Math.cos(m) * size * k * 0.86, y: Math.sin(m) * size * k * 0.86};
          return <path key={`${ri}${i}`} d={`M ${p.x} ${p.y} Q ${c.x} ${c.y} ${q.x} ${q.y}`} />;
        }),
      )}
    </g>
  );
};

/** bat silhouette centred on 0,0, about 68 wide at s = 1. moon puts an orange glow behind it */
export const Bat: React.FC<{s?: number; moon?: boolean}> = ({s = 1, moon}) => (
  <g transform={`scale(${s})`}>
    {moon && (
      <>
        <defs>
          <radialGradient id="batMoon">
            <stop offset="0%" stopColor="#FFB45C" stopOpacity={0.55} />
            <stop offset="55%" stopColor={HW.orange} stopOpacity={0.18} />
            <stop offset="100%" stopColor={HW.orange} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle r={46} fill="url(#batMoon)" />
      </>
    )}
    <path
      d="M 0 2 C -6 -4, -18 -10, -34 -8 C -28 -4, -26 2, -28 8 C -22 4, -16 6, -12 12 C -8 6, -4 7, 0 9 C 4 7, 8 6, 12 12 C 16 6, 22 4, 28 8 C 26 2, 28 -4, 34 -8 C 18 -10, 6 -4, 0 2 Z"
      fill="#050505"
    />
    <ellipse cx={0} cy={3} rx={3.6} ry={6} fill="#050505" />
    <path d="M -3.4 -1 L -3 -6.5 L -1 -2.6 L 1 -2.6 L 3 -6.5 L 3.4 -1 Z" fill="#050505" />
  </g>
);

/** black ground, drifting orange bokeh, a little fog and a vignette */
export const HwBackdrop: React.FC<{W: number; H: number; seed?: string; floor?: number}> = ({W, H, seed = 'hw', floor}) => (
  <AbsoluteFill style={{background: HW.bg}}>
    {Array.from({length: 14}).map((_, i) => {
      const x = random(`${seed}x${i}`) * W;
      const y = (0.1 + random(`${seed}y${i}`) * 0.8) * H;
      const r = 30 + random(`${seed}r${i}`) * 110;
      const o = 0.18 + random(`${seed}o${i}`) * 0.35;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x - r,
            top: y - r,
            width: r * 2,
            height: r * 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,138,42,${o}) 0%, rgba(255,110,20,${o * 0.4}) 45%, rgba(255,110,20,0) 70%)`,
            filter: `blur(${6 + random(`${seed}b${i}`) * 14}px)`,
          }}
        />
      );
    })}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 0%, rgba(126,194,90,0.10) 0%, rgba(0,0,0,0) 55%)'}} />
    {floor !== undefined && (
      <div style={{position: 'absolute', left: 0, top: floor, width: W, height: H - floor, background: 'linear-gradient(180deg, rgba(126,194,90,0.10) 0%, rgba(0,0,0,0) 60%)'}} />
    )}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)'}} />
  </AbsoluteFill>
);

/** the Halloween lockup: white mark and wordmark, the dot as a glowing pumpkin, a bat over the wordmark */
export const HalloweenLockup: React.FC<{x: number; y: number; w: number; id: string; bats?: boolean}> = ({x, y, w, id, bats = true}) => {
  const k = w / LOCKUP.w;
  const h = LOCKUP.h * k;
  const dot = {x: x + LOCKUP.dot.cx * k, y: y + LOCKUP.dot.cy * k, r: LOCKUP.dot.r * k * 1.45};
  return (
    <>
      <Img src={staticFile('brand/hotcoin-lockup-dark-nodot.png')} style={{position: 'absolute', left: x, top: y, width: w, height: h, filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.18))'}} />
      <svg width={x + w + 200} height={y + h + 200} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {bats && (
          <>
            <g transform={`translate(${x + 1560 * k} ${y - 130 * k}) rotate(-14)`}>
              <Bat s={6.5 * k} moon />
            </g>
            <g transform={`translate(${x + 1840 * k} ${y - 250 * k}) rotate(10)`}>
              <Bat s={3.6 * k} moon />
            </g>
          </>
        )}
        <g transform={`translate(${dot.x} ${dot.y})`}>
          <Pumpkin r={dot.r} id={id} />
        </g>
      </svg>
    </>
  );
};

/** cobweb hanging from a corner of the slide */
export const CornerWeb: React.FC<{W: number; corner: 'tl' | 'tr'; size: number; opacity?: number}> = ({W, corner, size, opacity = 0.35}) => (
  <svg width={W} height={size + 20} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <g transform={corner === 'tl' ? 'translate(0 0)' : `translate(${W} 0) rotate(90)`}>
      <Web size={size} opacity={opacity} />
    </g>
  </svg>
);
