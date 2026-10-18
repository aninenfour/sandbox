import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {antonWidth} from '../notebook/anton';
import {FONT, GREEN, INK, PAPER, RED} from '../notebook/tokens';

// Thumbnail kit v2 (from FILE 015): built to read at 168 px wide.
// Huge outlined type, one keyword on a solid block, sticker-cut art with a
// white outline, the narrator very large, a thick arrow, a CTA pill and a
// clear series badge.

export const YELLOW = '#FFD23F';

/** white outline + soft drop shadow around anything inside, like a sticker */
export const Sticker: React.FC<{children: React.ReactNode; o?: number; shadow?: boolean}> = ({children, o = 10, shadow = true}) => (
  <AbsoluteFill
    style={{
      filter: [
        `drop-shadow(${o}px 0 0 #fff)`,
        `drop-shadow(-${o}px 0 0 #fff)`,
        `drop-shadow(0 ${o}px 0 #fff)`,
        `drop-shadow(0 -${o}px 0 #fff)`,
        shadow ? 'drop-shadow(0 18px 22px rgba(0,0,0,0.35))' : '',
      ].join(' '),
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Anton line with a thick stroke behind the fill. y is the baseline. Optional solid block behind it. */
export const Line: React.FC<{
  text: string;
  x: number;
  y: number;
  size: number;
  fill?: string;
  stroke?: string;
  sw?: number;
  rot?: number;
  anchor?: 'start' | 'middle';
  box?: string;
  W: number;
  H: number;
}> = ({text, x, y, size, fill = '#fff', stroke = INK, sw, rot = 0, anchor = 'start', box, W, H}) => {
  const w = antonWidth(text, size);
  const left = anchor === 'middle' ? x - w / 2 : x;
  const strokeW = sw ?? size * 0.09;
  const padX = size * 0.12;
  const capTop = y - size * 0.86;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <g transform={`rotate(${rot} ${left + w / 2} ${y - size * 0.4})`}>
        {box && (
          <rect
            x={left - padX}
            y={capTop - size * 0.1}
            width={w + padX * 2}
            height={size * 1.06}
            rx={size * 0.06}
            fill={box}
            stroke={INK}
            strokeWidth={size * 0.035}
          />
        )}
        <text
          x={left}
          y={y}
          fontFamily={FONT.display}
          fontSize={size}
          fill={fill}
          stroke={box ? 'none' : stroke}
          strokeWidth={box ? 0 : strokeW}
          strokeLinejoin="round"
          paintOrder="stroke"
        >
          {text}
        </text>
      </g>
    </svg>
  );
};

/** call-to-action pill */
export const Pill: React.FC<{text: string; x: number; y: number; size?: number; bg?: string; fg?: string; anchor?: 'start' | 'middle'}> = ({text, x, y, size = 60, bg = INK, fg = PAPER, anchor = 'start'}) => {
  const w = antonWidth(text, size, 0.02) + size * 1.4;
  const left = anchor === 'middle' ? x - w / 2 : x;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: y,
        height: size * 1.5,
        width: w,
        borderRadius: size * 0.75,
        background: bg,
        border: `${Math.round(size * 0.07)}px solid #fff`,
        boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT.display,
        fontSize: size,
        letterSpacing: size * 0.02,
        color: fg,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
      }}
    >
      {text}
    </div>
  );
};

/** series badge: white plate with the lockup and a green 101 block */
export const Badge: React.FC<{x: number; y: number; h?: number; center?: boolean}> = ({x, y, h = 84, center}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: center ? 'translateX(-50%)' : undefined,
      height: h,
      display: 'flex',
      alignItems: 'center',
      gap: h * 0.22,
      padding: `0 ${h * 0.14}px 0 ${h * 0.3}px`,
      background: '#fff',
      borderRadius: h * 0.22,
      boxShadow: '0 10px 22px rgba(0,0,0,0.28)',
    }}
  >
    <Img src={staticFile('brand/hotcoin-lockup-light.png')} style={{height: h * 0.5}} />
    <div
      style={{
        height: h * 0.72,
        padding: `0 ${h * 0.16}px`,
        borderRadius: h * 0.14,
        background: GREEN,
        color: INK,
        fontFamily: FONT.display,
        fontSize: h * 0.56,
        lineHeight: `${h * 0.72}px`,
      }}
    >
      101
    </div>
  </div>
);

/** thick arrow with a white outline. from -> to, bend bows it sideways */
export const Arrow: React.FC<{from: {x: number; y: number}; to: {x: number; y: number}; W: number; H: number; color?: string; width?: number; bend?: number}> = ({from, to, W, H, color = RED, width = 26, bend = 0.25}) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cx = from.x + dx / 2 - dy * bend;
  const cy = from.y + dy / 2 + dx * bend;
  const tx = to.x - cx;
  const ty = to.y - cy;
  const tl = Math.hypot(tx, ty) || 1;
  const ux = tx / tl;
  const uy = ty / tl;
  const hs = width * 2.6;
  const base = {x: to.x - ux * hs * 0.8, y: to.y - uy * hs * 0.8};
  const h1 = {x: base.x - uy * hs * 0.75, y: base.y + ux * hs * 0.75};
  const h2 = {x: base.x + uy * hs * 0.75, y: base.y - ux * hs * 0.75};
  const shaft = `M ${from.x} ${from.y} Q ${cx} ${cy} ${base.x} ${base.y}`;
  const head = `M ${h1.x} ${h1.y} L ${to.x} ${to.y} L ${h2.x} ${h2.y} Z`;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={shaft} stroke="#fff" strokeWidth={width + 18} fill="none" strokeLinecap="round" />
      <path d={head} fill="#fff" stroke="#fff" strokeWidth={18} strokeLinejoin="round" />
      <path d={shaft} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />
      <path d={head} fill={color} stroke={color} strokeWidth={4} strokeLinejoin="round" />
    </svg>
  );
};

/** flat brand-colour background with a soft centre glow and a vignette */
export const Backdrop: React.FC<{base: string; glow: string; glowAt?: string}> = ({base, glow, glowAt = '68% 46%'}) => (
  <AbsoluteFill style={{background: `radial-gradient(circle at ${glowAt}, ${glow} 0%, ${base} 62%)`}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.32) 100%)'}} />
  </AbsoluteFill>
);

export const COLORS = {INK, PAPER, GREEN, RED, YELLOW};
