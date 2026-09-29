import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { COLOR } from './tokens';
import { FF } from './fonts';
import { useLayout } from './layout';
import { useLook } from './Sheet';
import { useTheme } from './theme';
import { CLOCK_FPS, useFrame } from './clock';

/** A stroke that draws itself, like a pen crossing the page. */
export const DrawPath: React.FC<{
  d: string;
  delay?: number;
  dur?: number;
  width?: number;
  color?: string;
  fill?: string;
  cap?: 'round' | 'butt' | 'square';
}> = ({ d, delay = 0, dur = 26, width = 2, color = 'currentColor', fill = 'none', cap = 'round' }) => {
  const frame = useFrame();
  const p = interpolate(frame - delay, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <path
      d={d}
      stroke={color}
      strokeWidth={width}
      fill={fill}
      fillOpacity={interpolate(frame - delay, [dur * 0.6, dur * 1.4], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })}
      strokeLinecap={cap}
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  );
};

/** Diagonal hatching used to shade engravings. */
export const Hatch: React.FC<{
  id: string;
  color?: string;
  spacing?: number;
  angle?: number;
}> = ({ id, color = 'currentColor', spacing = 6, angle = 45 }) => (
  <defs>
    <pattern
      id={id}
      width={spacing}
      height={spacing}
      patternUnits="userSpaceOnUse"
      patternTransform={`rotate(${angle})`}
    >
      <line x1="0" y1="0" x2="0" y2={spacing} stroke={color} strokeWidth="1" opacity="0.5" />
    </pattern>
  </defs>
);

/** Bordered figure plate with a printed caption, the series' picture container. */
export const Plate: React.FC<{
  children: React.ReactNode;
  caption?: string;
  figNo?: string;
  delay?: number;
  height?: number;
  width?: number | string;
  dark?: boolean;
}> = ({ children, caption, figNo, delay = 0, height, width = '100%', dark }) => {
  const { u, type } = useLayout();
  const look = useLook();
  const t = useTheme();
  const frame = useFrame();
  const fps = CLOCK_FPS;
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const cut = look === 'cutPaper';
  const line = dark ? 'rgba(239,233,220,0.35)' : t.plateBorder ?? 'transparent';
  const capC = dark ? 'rgba(239,233,220,0.6)' : t.inkFaint;
  return (
    <div style={{ width, opacity: s, transform: `translateY(${(1 - s) * 12}px)` }}>
      <div
        style={{
          color: t.figureInk,
          // The dark look frames the plate with corner brackets instead of a
          // box, so a diagram page does not read like the table pages.
          border: cut || !t.plateBorder || t.dark ? 'none' : `1px solid ${line}`,
          height,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: cut ? 'transparent' : dark ? 'rgba(255,255,255,0.02)' : t.plateBg,
        }}
      >
        {children}
        {t.dark ? <Brackets /> : null}
      </div>
      {(caption || figNo) && (
        <div
          style={{
            marginTop: 1.1 * u,
            display: 'flex',
            gap: 1.2 * u,
            fontFamily: FF.mono,
            fontSize: type.kicker,
            letterSpacing: 2,
            color: capC,
            textTransform: 'uppercase',
          }}
        >
          {figNo ? <span style={{ color: t.green }}>{figNo}</span> : null}
          <span>{caption}</span>
        </div>
      )}
    </div>
  );
};

/** Four corner marks, the dark look's frame for a figure plate. */
const Brackets: React.FC = () => {
  const { u } = useLayout();
  const t = useTheme();
  const arm = 3.2 * u;
  const w = 2;
  const C: React.CSSProperties = { position: 'absolute', background: t.green, opacity: 0.8 };
  const pad = 0;
  return (
    <>
      <div style={{ ...C, left: pad, top: pad, width: arm, height: w }} />
      <div style={{ ...C, left: pad, top: pad, width: w, height: arm }} />
      <div style={{ ...C, right: pad, top: pad, width: arm, height: w }} />
      <div style={{ ...C, right: pad, top: pad, width: w, height: arm }} />
      <div style={{ ...C, left: pad, bottom: pad, width: arm, height: w }} />
      <div style={{ ...C, left: pad, bottom: pad, width: w, height: arm }} />
      <div style={{ ...C, right: pad, bottom: pad, width: arm, height: w }} />
      <div style={{ ...C, right: pad, bottom: pad, width: w, height: arm }} />
    </>
  );
};

type FigProps = { delay?: number; color?: string; accent?: string };

export const FigClayTablet: React.FC<FigProps> = ({ delay = 0, color = 'currentColor' }) => (
  <svg viewBox="0 0 240 200" width="88%" height="88%">
    <Hatch id="ht-clay" color={color} spacing={7} />
    <DrawPath
      delay={delay}
      dur={30}
      d="M56 26 Q120 16 184 26 Q196 100 184 174 Q120 186 56 174 Q44 100 56 26 Z"
      width={2.4}
      color={color}
      fill="url(#ht-clay)"
    />
    {[0, 1, 2, 3, 4].map((r) => (
      <g key={r}>
        {[0, 1, 2, 3, 4, 5].map((c) => (
          <DrawPath
            key={c}
            delay={delay + 20 + r * 4 + c}
            dur={6}
            width={2}
            color={color}
            d={`M${76 + c * 16} ${52 + r * 24} l7 0 l-3.5 8 Z`}
          />
        ))}
      </g>
    ))}
  </svg>
);

export const FigShip: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => (
  <svg viewBox="0 0 260 200" width="92%" height="92%">
    <Hatch id="ht-sail" color={color} spacing={7} angle={-40} />
    <DrawPath delay={delay} dur={22} width={2.2} color={color} d="M130 22 L130 138" />
    <DrawPath
      delay={delay + 8}
      dur={26}
      width={2.2}
      color={color}
      fill="url(#ht-sail)"
      d="M130 34 Q186 60 176 106 L130 106 Z"
    />
    <DrawPath
      delay={delay + 14}
      dur={26}
      width={2.2}
      color={color}
      fill="url(#ht-sail)"
      d="M130 42 Q80 66 88 110 L130 110 Z"
    />
    <DrawPath
      delay={delay + 22}
      dur={26}
      width={2.4}
      color={color}
      d="M56 138 L204 138 L184 168 Q130 178 76 168 Z"
    />
    <DrawPath delay={delay + 34} dur={20} width={2} color={accent} d="M130 22 L156 30 L130 38" />
    {[0, 1, 2].map((i) => (
      <DrawPath
        key={i}
        delay={delay + 40 + i * 4}
        dur={18}
        width={1.6}
        color={color}
        d={`M${40 + i * 12} ${182 + (i % 2) * 4} q22 -10 44 0 q22 10 44 0 q22 -10 44 0`}
      />
    ))}
  </svg>
);

export const FigCertificate: React.FC<FigProps> = ({
  delay = 0,
  color = 'currentColor',
  accent = COLOR.green,
}) => (
  <svg viewBox="0 0 240 200" width="88%" height="88%">
    <DrawPath delay={delay} dur={26} width={2.4} color={color} d="M34 22 L206 22 L206 178 L34 178 Z" />
    <DrawPath delay={delay + 8} dur={22} width={1.2} color={color} d="M44 32 L196 32 L196 168 L44 168 Z" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <DrawPath
        key={i}
        delay={delay + 18 + i * 3}
        dur={14}
        width={2}
        color={color}
        d={`M62 ${58 + i * 16} L${i === 5 ? 132 : 178} ${58 + i * 16}`}
      />
    ))}
    <DrawPath delay={delay + 38} dur={20} width={2.2} color={accent} d="M150 132 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0" />
    <DrawPath delay={delay + 44} dur={16} width={1.6} color={accent} d="M140 132 l8 8 l14 -16" />
  </svg>
);

export const FigTicker: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const frame = useFrame();
  const tapeX = interpolate(frame - delay - 30, [0, 90], [0, -120], { extrapolateLeft: 'clamp' });
  return (
    <svg viewBox="0 0 260 200" width="94%" height="94%">
      <Hatch id="ht-tick" color={color} spacing={6} />
      <DrawPath delay={delay} dur={24} width={2.4} color={color} d="M78 60 L182 60 L182 132 L78 132 Z" />
      <DrawPath delay={delay + 6} dur={20} width={2.2} color={color} d="M104 60 Q130 18 156 60" />
      <DrawPath delay={delay + 12} dur={18} width={2} color={color} d="M96 132 L96 156 M164 132 L164 156" />
      <DrawPath delay={delay + 16} dur={20} width={2.2} color={color} d="M70 156 L190 156" />
      <g clipPath="url(#tapeclip)">
        <defs>
          <clipPath id="tapeclip">
            <rect x="10" y="86" width="240" height="24" />
          </clipPath>
        </defs>
        <DrawPath delay={delay + 26} dur={18} width={1.8} color={color} d="M182 98 L250 98" />
        <g transform={`translate(${tapeX},0)`}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={190 + i * 22}
              y={92}
              width={12}
              height={2}
              fill={i % 3 === 0 ? accent : color}
              opacity={interpolate(frame - delay - 30, [0, 10], [0, 0.9], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}
            />
          ))}
        </g>
      </g>
    </svg>
  );
};

export const FigCandles: React.FC<FigProps & { seedUp?: boolean }> = ({
  delay = 0,
  color = 'currentColor',
  accent = COLOR.green,
}) => {
  const frame = useFrame();
  const bars = [
    { x: 40, o: 130, c: 112, h: 104, l: 138, up: true },
    { x: 70, o: 112, c: 124, h: 106, l: 132, up: false },
    { x: 100, o: 124, c: 96, h: 88, l: 128, up: true },
    { x: 130, o: 96, c: 84, h: 74, l: 100, up: true },
    { x: 160, o: 84, c: 96, h: 78, l: 104, up: false },
    { x: 190, o: 96, c: 58, h: 48, l: 100, up: true },
  ];
  return (
    <svg viewBox="0 0 240 200" width="94%" height="94%">
      <DrawPath delay={delay} dur={20} width={1.6} color={color} d="M24 168 L216 168" />
      <DrawPath delay={delay + 4} dur={20} width={1.6} color={color} d="M24 30 L24 168" />
      {bars.map((b, i) => {
        const t = interpolate(frame - delay - 16 - i * 5, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const top = Math.min(b.o, b.c);
        const h = Math.abs(b.o - b.c);
        const c = b.up ? accent : COLOR.red;
        return (
          <g key={i} opacity={t}>
            <line x1={b.x} y1={b.h} x2={b.x} y2={b.l} stroke={c} strokeWidth={1.8} />
            <rect
              x={b.x - 7}
              y={top}
              width={14}
              height={Math.max(h * t, 2)}
              fill={b.up ? c : 'none'}
              stroke={c}
              strokeWidth={1.8}
            />
          </g>
        );
      })}
    </svg>
  );
};

export const FigPhone: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const frame = useFrame();
  const line = interpolate(frame - delay - 30, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <svg viewBox="0 0 200 220" width="80%" height="80%">
      <DrawPath
        delay={delay}
        dur={28}
        width={2.4}
        color={color}
        d="M56 16 L144 16 Q152 16 152 26 L152 194 Q152 204 144 204 L56 204 Q48 204 48 194 L48 26 Q48 16 56 16 Z"
      />
      <DrawPath delay={delay + 16} dur={14} width={2} color={color} d="M88 28 L112 28" />
      <path
        d="M62 150 L78 132 L92 142 L110 96 L126 116 L140 70"
        stroke={accent}
        strokeWidth={2.6}
        fill="none"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - line}
      />
      {[0, 1, 2].map((i) => (
        <DrawPath
          key={i}
          delay={delay + 46 + i * 4}
          dur={12}
          width={1.6}
          color={color}
          d={`M62 ${172 + i * 12} L${i === 2 ? 108 : 138} ${172 + i * 12}`}
        />
      ))}
    </svg>
  );
};

export const FigCoinStack: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const frame = useFrame();
  const RX = 50;
  const RY = 14;
  const H = 15;
  const CX = 130;
  return (
    <svg viewBox="0 0 260 200" width="88%" height="88%">
      {[0, 1, 2, 3].map((i) => {
        const t = interpolate(frame - delay - i * 7, [0, 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const cy = 156 - i * 27;
        const c = i === 3 ? accent : color;
        return (
          <g key={i} opacity={t} transform={`translate(0 ${(1 - t) * -14})`}>
            {/* side wall */}
            <path
              d={`M${CX - RX} ${cy - H} L${CX - RX} ${cy} A${RX} ${RY} 0 0 0 ${CX + RX} ${cy} L${CX + RX} ${cy - H} Z`}
              fill={COLOR.paper}
              stroke={c}
              strokeWidth={2.4}
            />
            {/* top face */}
            <ellipse cx={CX} cy={cy - H} rx={RX} ry={RY} fill={COLOR.paper} stroke={c} strokeWidth={2.4} />
            {i === 3 ? <ellipse cx={CX} cy={cy - H} rx={RX * 0.42} ry={RY * 0.42} fill="none" stroke={c} strokeWidth={2} /> : null}
          </g>
        );
      })}
    </svg>
  );
};

export const FigBook: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => (
  <svg viewBox="0 0 260 200" width="94%" height="94%">
    <DrawPath delay={delay} dur={26} width={2.4} color={color} d="M130 52 Q92 34 34 40 L34 158 Q92 152 130 168 Z" />
    <DrawPath delay={delay + 6} dur={26} width={2.4} color={color} d="M130 52 Q168 34 226 40 L226 158 Q168 152 130 168 Z" />
    <DrawPath delay={delay + 14} dur={18} width={2} color={color} d="M130 52 L130 168" />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <DrawPath
          delay={delay + 20 + i * 3}
          dur={12}
          width={1.6}
          color={i === 0 ? accent : color}
          d={`M48 ${70 + i * 18} L${i === 4 ? 92 : 114} ${70 + i * 18}`}
        />
        <DrawPath
          delay={delay + 22 + i * 3}
          dur={12}
          width={1.6}
          color={i === 0 ? accent : color}
          d={`M146 ${70 + i * 18} L${i === 4 ? 190 : 212} ${70 + i * 18}`}
        />
      </g>
    ))}
  </svg>
);

export const FigMegaphone: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const frame = useFrame();
  return (
    <svg viewBox="0 0 260 200" width="94%" height="94%">
      <DrawPath delay={delay} dur={26} width={2.4} color={color} d="M40 84 L40 122 L78 122 L140 158 L140 48 L78 84 Z" />
      <DrawPath delay={delay + 14} dur={18} width={2.2} color={color} d="M58 122 L64 162 L86 162 L78 122" />
      {[0, 1, 2].map((i) => {
        const pulse = interpolate(
          (frame - delay - 30 - i * 8) % 45,
          [0, 12, 45],
          [0, 0.95, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const r = 24 + i * 24;
        return (
          <path
            key={i}
            d={`M158 ${103 - r * 0.62} A ${r} ${r} 0 0 1 158 ${103 + r * 0.62}`}
            stroke={accent}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
            opacity={frame - delay < 30 ? 0 : pulse}
          />
        );
      })}
    </svg>
  );
};

/** Small helper: a printed label that fades in, in the series mono face. */
const Label: React.FC<{
  x: number;
  y: number;
  children: string;
  delay?: number;
  color?: string;
  size?: number;
  anchor?: 'start' | 'middle' | 'end';
}> = ({ x, y, children, delay = 0, color = 'currentColor', size = 8.5, anchor = 'start' }) => {
  const frame = useFrame();
  const o = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <text
      x={x}
      y={y}
      fill={color}
      opacity={o}
      fontFamily={FF.mono}
      fontSize={size}
      letterSpacing={1.1}
      textAnchor={anchor}
      dominantBaseline="middle"
    >
      {children}
    </text>
  );
};

const Leader: React.FC<{ x1: number; y: number; x2: number; delay?: number }> = ({
  x1,
  y,
  x2,
  delay = 0,
}) => {
  const frame = useFrame();
  const p = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <line
      x1={x1}
      y1={y}
      x2={x1 + (x2 - x1) * p}
      y2={y}
      stroke="currentColor" strokeOpacity={0.5}
      strokeWidth={1}
      strokeDasharray="3 3"
    />
  );
};

/** One candle, fully labelled. The anatomy plate for the trading pillar. */
export const FigCandleAnatomy: React.FC<FigProps> = ({
  delay = 0,
  color = 'currentColor',
  accent = COLOR.green,
}) => {
  const frame = useFrame();
  const x = 78;
  const grow = interpolate(frame - delay, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const HIGH = 30;
  const CLOSE = 66;
  const OPEN = 138;
  const LOW = 172;
  const mid = (CLOSE + OPEN) / 2;
  return (
    <svg viewBox="0 0 260 200" width="96%" height="96%">
      <line
        x1={x}
        y1={mid - (mid - HIGH) * grow}
        x2={x}
        y2={mid + (LOW - mid) * grow}
        stroke={accent}
        strokeWidth={2.4}
      />
      <rect
        x={x - 15}
        y={mid - ((OPEN - CLOSE) / 2) * grow}
        width={30}
        height={(OPEN - CLOSE) * grow}
        fill={accent}
        stroke={accent}
        strokeWidth={2.4}
      />

      <Leader x1={x + 20} y={HIGH} x2={150} delay={delay + 22} />
      <Label x={155} y={HIGH} delay={delay + 26} color={color}>
        HIGH
      </Label>
      <Leader x1={x + 20} y={CLOSE} x2={150} delay={delay + 30} />
      <Label x={155} y={CLOSE} delay={delay + 34} color={color}>
        CLOSE
      </Label>
      <Leader x1={x + 20} y={OPEN} x2={150} delay={delay + 38} />
      <Label x={155} y={OPEN} delay={delay + 42} color={color}>
        OPEN
      </Label>
      <Leader x1={x + 20} y={LOW} x2={150} delay={delay + 46} />
      <Label x={155} y={LOW} delay={delay + 50} color={color}>
        LOW
      </Label>

      <Leader x1={x - 20} y={(HIGH + CLOSE) / 2} x2={30} delay={delay + 54} />
      <Label x={26} y={(HIGH + CLOSE) / 2} delay={delay + 58} anchor="end">
        WICK
      </Label>
      <Leader x1={x - 20} y={mid} x2={30} delay={delay + 58} />
      <Label x={26} y={mid} delay={delay + 62} anchor="end">
        BODY
      </Label>
    </svg>
  );
};

/** Two candles side by side: what the colour is actually reporting. */
export const FigTwoCandles: React.FC<FigProps> = ({
  delay = 0,
  color = 'currentColor',
  accent = COLOR.green,
}) => {
  const frame = useFrame();
  const g = interpolate(frame - delay, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const g2 = interpolate(frame - delay - 10, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const Candle = ({
    cx,
    top,
    bottom,
    hi,
    lo,
    c,
    filled,
    t,
  }: {
    cx: number;
    top: number;
    bottom: number;
    hi: number;
    lo: number;
    c: string;
    filled: boolean;
    t: number;
  }) => {
    const m = (top + bottom) / 2;
    return (
      <g>
        <line x1={cx} y1={m - (m - hi) * t} x2={cx} y2={m + (lo - m) * t} stroke={c} strokeWidth={2.4} />
        <rect
          x={cx - 16}
          y={m - ((bottom - top) / 2) * t}
          width={32}
          height={(bottom - top) * t}
          fill={filled ? c : 'none'}
          stroke={c}
          strokeWidth={2.6}
        />
      </g>
    );
  };
  return (
    <svg viewBox="0 0 260 200" width="96%" height="96%">
      <Candle cx={74} top={52} bottom={130} hi={34} lo={150} c={accent} filled t={g} />
      <Candle cx={186} top={52} bottom={130} hi={34} lo={150} c={COLOR.red} filled={false} t={g2} />
      <Label x={74} y={172} delay={delay + 24} anchor="middle" color={COLOR.greenDeep}>
        CLOSE ABOVE OPEN
      </Label>
      <Label x={186} y={172} delay={delay + 30} anchor="middle" color={COLOR.red}>
        CLOSE BELOW OPEN
      </Label>
      <Label x={130} y={190} delay={delay + 38} anchor="middle">
        THAT IS ALL COLOUR MEANS
      </Label>
    </svg>
  );
};

/** A long upper wick: the shape of a rejected move. */
export const FigWick: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const frame = useFrame();
  const up = interpolate(frame - delay, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const back = interpolate(frame - delay - 20, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const body = interpolate(frame - delay - 34, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const HIGH = 26;
  const TOP = 116;
  const BOT = 152;
  const LOW = 172;
  return (
    <svg viewBox="0 0 260 200" width="96%" height="96%">
      <line x1={110} y1={TOP} x2={110} y2={TOP - (TOP - HIGH) * up} stroke={COLOR.red} strokeWidth={2.6} />
      <line x1={110} y1={BOT} x2={110} y2={BOT + (LOW - BOT) * body} stroke={COLOR.red} strokeWidth={2.4} />
      <rect
        x={95}
        y={TOP}
        width={30}
        height={(BOT - TOP) * body}
        fill="none"
        stroke={COLOR.red}
        strokeWidth={2.8}
      />
      <path
        d={`M140 ${HIGH + 6} L140 ${TOP - 6}`}
        stroke={accent}
        strokeWidth={2}
        opacity={up}
        markerStart=""
      />
      <path d={`M140 ${HIGH + 6} l-5 8 M140 ${HIGH + 6} l5 8`} stroke={accent} strokeWidth={2} opacity={up} fill="none" />
      <Label x={150} y={(HIGH + TOP) / 2 - 10} delay={delay + 10} color={COLOR.greenDeep}>
        BUYERS PUSH UP
      </Label>
      <path d={`M168 ${HIGH + 10} L168 ${TOP - 4}`} stroke={COLOR.red} strokeWidth={2} opacity={back} />
      <path
        d={`M168 ${TOP - 4} l-5 -8 M168 ${TOP - 4} l5 -8`}
        stroke={COLOR.red}
        strokeWidth={2}
        opacity={back}
        fill="none"
      />
      <Label x={178} y={(HIGH + TOP) / 2 + 10} delay={delay + 30} color={COLOR.red}>
        AND LOSE IT
      </Label>
      <Label x={110} y={190} delay={delay + 46} anchor="middle">
        THE WICK IS THE REJECTION
      </Label>
    </svg>
  );
};

/** The same hour, drawn on two timeframes. */
export const FigTimeframe: React.FC<FigProps> = ({
  delay = 0,
  color = 'currentColor',
  accent = COLOR.green,
}) => {
  const frame = useFrame();
  const small = [
    [104, 86, 78, 112],
    [86, 96, 80, 102],
    [96, 70, 62, 100],
    [70, 80, 66, 86],
    [80, 60, 50, 84],
    [60, 46, 38, 66],
  ] as [number, number, number, number][];
  return (
    <svg viewBox="0 0 260 200" width="98%" height="98%">
      {small.map((c, i) => {
        const t = interpolate(frame - delay - i * 4, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const [o, cl, hi, lo] = c;
        const up = cl < o;
        const col = up ? accent : COLOR.red;
        const top = Math.min(o, cl);
        const h = Math.abs(o - cl);
        const cx = 26 + i * 19;
        return (
          <g key={i} opacity={t}>
            <line x1={cx} y1={hi} x2={cx} y2={lo} stroke={col} strokeWidth={2.2} />
            <rect
              x={cx - 7.5}
              y={top}
              width={15}
              height={Math.max(h, 2)}
              fill={up ? col : 'none'}
              stroke={col}
              strokeWidth={2.2}
            />
          </g>
        );
      })}
      <Label x={73} y={144} delay={delay + 26} anchor="middle" size={9.5}>
        5M · TWELVE CANDLES
      </Label>

      <Label x={156} y={78} delay={delay + 34} anchor="middle" size={22} color="currentColor">
        =
      </Label>

      {(() => {
        const t = interpolate(frame - delay - 40, [0, 14], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const o = 104;
        const cl = 46;
        const m = (o + cl) / 2;
        return (
          <g opacity={t}>
            <line
              x1={212}
              y1={m - (m - 38) * t}
              x2={212}
              y2={m + (112 - m) * t}
              stroke={accent}
              strokeWidth={2.8}
            />
            <rect
              x={212 - 19}
              y={m - ((o - cl) / 2) * t}
              width={38}
              height={(o - cl) * t}
              fill={accent}
              stroke={accent}
              strokeWidth={2.8}
            />
          </g>
        );
      })()}
      <Label x={212} y={144} delay={delay + 52} anchor="middle" size={9.5}>
        1H · ONE CANDLE
      </Label>
      <Label x={130} y={178} delay={delay + 60} anchor="middle" color={color} size={10}>
        SAME HOUR. DIFFERENT STORY.
      </Label>
    </svg>
  );
};


/** A plain ledger page: rows of who paid whom. */
export const FigLedger: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => (
  <svg viewBox="0 0 260 200" width="96%" height="96%">
    <DrawPath delay={delay} dur={26} width={2.4} color={color} d="M46 20 L214 20 L214 180 L46 180 Z" />
    <DrawPath delay={delay + 10} dur={20} width={1.6} color={color} d="M46 44 L214 44" />
    <DrawPath delay={delay + 12} dur={20} width={1.4} color={color} d="M150 20 L150 180" />
    {[0, 1, 2, 3, 4].map((i2) => (
      <g key={i2}>
        <DrawPath
          delay={delay + 18 + i2 * 4}
          dur={12}
          width={1.6}
          color={color}
          d={`M58 ${62 + i2 * 24} L${i2 === 4 ? 110 : 138} ${62 + i2 * 24}`}
        />
        <DrawPath
          delay={delay + 20 + i2 * 4}
          dur={12}
          width={1.6}
          color={i2 === 1 ? accent : color}
          d={`M162 ${62 + i2 * 24} L${i2 === 1 ? 196 : 202} ${62 + i2 * 24}`}
        />
      </g>
    ))}
    <Label x={98} y={33} delay={delay + 30} anchor="middle">
      FROM / TO
    </Label>
    <Label x={182} y={33} delay={delay + 34} anchor="middle">
      AMOUNT
    </Label>
  </svg>
);

/** Blocks in a row, each carrying the previous block's fingerprint. */
export const FigChain: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const boxes = [26, 104, 182];
  return (
    <svg viewBox="0 0 260 200" width="98%" height="98%">
      {boxes.map((x, i) => (
        <g key={i}>
          <DrawPath
            delay={delay + i * 8}
            dur={22}
            width={2.4}
            color={color}
            d={`M${x} 54 L${x + 52} 54 L${x + 52} 132 L${x} 132 Z`}
          />
          <DrawPath
            delay={delay + 8 + i * 8}
            dur={14}
            width={1.6}
            color={color}
            d={`M${x} 76 L${x + 52} 76`}
          />
          {[0, 1, 2].map((r) => (
            <DrawPath
              key={r}
              delay={delay + 16 + i * 8 + r * 2}
              dur={10}
              width={1.4}
              color={color}
              d={`M${x + 8} ${90 + r * 12} L${x + (r === 2 ? 30 : 44)} ${90 + r * 12}`}
            />
          ))}
          <Label x={x + 26} y={65} delay={delay + 26 + i * 6} anchor="middle" size={7.5} color={accent}>
            {`#${i === 0 ? '8A1F' : i === 1 ? '4C7D' : 'B209'}`}
          </Label>
          <Label x={x + 26} y={146} delay={delay + 34 + i * 6} anchor="middle" size={8}>
            {`BLOCK ${i + 1}`}
          </Label>
        </g>
      ))}
      {[78, 156].map((x, i) => (
        <g key={i}>
          <DrawPath delay={delay + 30 + i * 8} dur={12} width={2} color={accent} d={`M${x} 93 L${x + 26} 93`} />
          <DrawPath
            delay={delay + 34 + i * 8}
            dur={10}
            width={2}
            color={accent}
            d={`M${x + 26} 93 l-7 -5 M${x + 26} 93 l-7 5`}
          />
        </g>
      ))}
      <Label x={130} y={176} delay={delay + 52} anchor="middle" color={color} size={7.5}>
        EACH BLOCK HOLDS THE PREVIOUS HASH
      </Label>
    </svg>
  );
};

/** Edit an old block and every fingerprint after it stops matching. */
export const FigTamper: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const frame = useFrame();
  const boxes = [26, 104, 182];
  const breakIn = interpolate(frame - delay - 34, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <svg viewBox="0 0 260 200" width="98%" height="98%">
      {boxes.map((x, i) => {
        const bad = i >= 0;
        const c = i === 0 ? COLOR.red : bad ? COLOR.red : color;
        return (
          <g key={i}>
            <DrawPath
              delay={delay + i * 6}
              dur={20}
              width={2.4}
              color={i === 0 ? COLOR.red : color}
              d={`M${x} 54 L${x + 52} 54 L${x + 52} 132 L${x} 132 Z`}
            />
            <g opacity={i === 0 ? 1 : breakIn}>
              <Label x={x + 26} y={93} delay={delay + 20} anchor="middle" size={13} color={c}>
                ✕
              </Label>
            </g>
            <Label
              x={x + 26}
              y={146}
              delay={delay + 30 + i * 4}
              anchor="middle"
              size={8}
              color={i === 0 ? COLOR.red : 'currentColor'}
            >
              {i === 0 ? 'EDITED' : 'BROKEN'}
            </Label>
          </g>
        );
      })}
      {[78, 156].map((x, i) => (
        <g key={i} opacity={breakIn}>
          <DrawPath delay={delay + 36 + i * 6} dur={10} width={2} color={COLOR.red} d={`M${x} 86 L${x + 26} 100`} />
          <DrawPath delay={delay + 36 + i * 6} dur={10} width={2} color={COLOR.red} d={`M${x} 100 L${x + 26} 86`} />
        </g>
      ))}
      <Label x={130} y={176} delay={delay + 52} anchor="middle" color={color} size={7.5}>
        CHANGE ONE, BREAK THE REST
      </Label>
    </svg>
  );
};

/** Many machines, one agreed copy. */
export const FigNodes: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const frame = useFrame();
  const nodes = [
    [130, 44],
    [58, 82],
    [202, 82],
    [82, 146],
    [178, 146],
    [130, 104],
  ] as [number, number][];
  const links: [number, number][] = [
    [5, 0],
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 4],
    [3, 4],
  ];
  return (
    <svg viewBox="0 0 260 200" width="96%" height="96%">
      {links.map((l, i) => (
        <DrawPath
          key={i}
          delay={delay + 10 + i * 2}
          dur={14}
          width={1.3}
          color={color}
          d={`M${nodes[l[0]][0]} ${nodes[l[0]][1]} L${nodes[l[1]][0]} ${nodes[l[1]][1]}`}
        />
      ))}
      {nodes.map((n, i) => {
        const t = interpolate(frame - delay - 4 - i * 4, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <g key={i} opacity={t}>
            <rect
              x={n[0] - 13}
              y={n[1] - 10}
              width={26}
              height={20}
              rx={2}
              fill={COLOR.paper}
              stroke={i === 5 ? accent : color}
              strokeWidth={2.2}
            />
            {[0, 1, 2].map((r) => (
              <line
                key={r}
                x1={n[0] - 8}
                y1={n[1] - 4 + r * 4}
                x2={n[0] + (r === 2 ? 2 : 8)}
                y2={n[1] - 4 + r * 4}
                stroke={i === 5 ? accent : color}
                strokeWidth={1.2}
                opacity={0.8}
              />
            ))}
          </g>
        );
      })}
      <Label x={130} y={178} delay={delay + 44} anchor="middle" color={color} size={7.5}>
        SAME LIST, THOUSANDS OF COPIES
      </Label>
    </svg>
  );
};


/** The order book as a price ladder: bids stacked below, asks above. */
export const FigOrderBook: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const frame = useFrame();
  const asks = [58, 44, 30, 20];
  const bids = [24, 38, 50, 62];
  const rowH = 15;
  const top = 34;
  return (
    <svg viewBox="0 0 260 200" width="98%" height="98%">
      <Label x={186} y={24} delay={delay + 30} anchor="middle" color={COLOR.red}>
        ASKS
      </Label>
      {asks.map((w, i) => {
        const t = interpolate(frame - delay - i * 3, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const y = top + i * rowH;
        return (
          <g key={i}>
            <rect x={136} y={y} width={w * t} height={rowH - 4} fill={COLOR.red} opacity={0.55} />
            <Label x={130} y={y + 5} delay={delay + 8 + i * 3} anchor="end" size={7.5}>
              {`${104 + (asks.length - i)}`}
            </Label>
          </g>
        );
      })}

      <DrawPath delay={delay + 16} dur={18} width={1.6} color={color} d="M28 100 L232 100" />
      <Label x={232} y={100} delay={delay + 40} anchor="end" size={7} color="currentColor">
        {''}
      </Label>

      {bids.map((w, i) => {
        const t = interpolate(frame - delay - 8 - i * 3, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const y = 106 + i * rowH;
        return (
          <g key={i}>
            <rect x={136 - w * t} y={y} width={w * t} height={rowH - 4} fill={accent} opacity={0.6} />
            <Label x={142} y={y + 5} delay={delay + 16 + i * 3} anchor="start" size={7.5}>
              {`${104 - i}`}
            </Label>
          </g>
        );
      })}
      <Label x={70} y={180} delay={delay + 36} anchor="middle" color={COLOR.greenDeep}>
        BIDS
      </Label>
      <Label x={186} y={180} delay={delay + 44} anchor="middle" color={color} size={7.5}>
        PRICE, AND SIZE WAITING
      </Label>
    </svg>
  );
};

/** Two sides meeting: the moment a trade prints. */
export const FigMatch: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const frame = useFrame();
  const close = interpolate(frame - delay - 6, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const printed = interpolate(frame - delay - 32, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lx = 30 + 66 * close;
  const rx = 230 - 66 * close;
  return (
    <svg viewBox="0 0 260 200" width="98%" height="98%">
      <g>
        <rect x={lx - 26} y={72} width={52} height={30} fill="none" stroke={accent} strokeWidth={2.4} />
        <Label x={lx} y={87} delay={delay} anchor="middle" color={COLOR.greenDeep}>
          BUYER
        </Label>
      </g>
      <g>
        <rect x={rx - 26} y={72} width={52} height={30} fill="none" stroke={COLOR.red} strokeWidth={2.4} />
        <Label x={rx} y={87} delay={delay + 2} anchor="middle" color={COLOR.red}>
          SELLER
        </Label>
      </g>
      <g opacity={printed}>
        <DrawPath delay={delay + 32} dur={14} width={2.4} color={color} d="M104 126 L156 126" />
        <Label x={130} y={144} delay={delay + 38} anchor="middle" color={color}>
          TRADE PRINTED
        </Label>
      </g>
      <Label x={130} y={40} delay={delay + 44} anchor="middle" size={7.5}>
        THE EXCHANGE ONLY MATCHES THEM
      </Label>
    </svg>
  );
};

/** Best bid, best ask, and the gap you pay to cross. */
export const FigSpread: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => (
  <svg viewBox="0 0 260 200" width="98%" height="98%">
    <DrawPath delay={delay} dur={22} width={2.8} color={COLOR.red} d="M44 68 L216 68" />
    <Label x={44} y={54} delay={delay + 12} color={COLOR.red}>
      BEST ASK
    </Label>
    <Label x={216} y={54} delay={delay + 14} anchor="end" color={COLOR.red} size={7.5}>
      105.20
    </Label>

    <DrawPath delay={delay + 8} dur={22} width={2.8} color={accent} d="M44 128 L216 128" />
    <Label x={44} y={142} delay={delay + 20} color={COLOR.greenDeep}>
      BEST BID
    </Label>
    <Label x={216} y={142} delay={delay + 22} anchor="end" color={COLOR.greenDeep} size={7.5}>
      105.00
    </Label>

    <DrawPath delay={delay + 26} dur={14} width={1.6} color={color} d="M130 68 L130 128" />
    <DrawPath delay={delay + 30} dur={10} width={1.6} color={color} d="M124 74 L130 68 L136 74" />
    <DrawPath delay={delay + 30} dur={10} width={1.6} color={color} d="M124 122 L130 128 L136 122" />
    <rect x={104} y={90} width={52} height={16} fill={COLOR.paper} />
    <Label x={130} y={98} delay={delay + 36} anchor="middle" color={color}>
      SPREAD
    </Label>
    <Label x={130} y={176} delay={delay + 46} anchor="middle" size={7.5}>
      CROSS IT AND YOU TRADE NOW
    </Label>
  </svg>
);


/** Ten disciplined trades, and the one that undoes them. */
export const FigSizing: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const frame = useFrame();
  const base = 112;
  return (
    <svg viewBox="0 0 260 200" width="98%" height="98%">
      <DrawPath delay={delay} dur={20} width={1.6} color={color} d="M18 112 L242 112" />
      {new Array(10).fill(0).map((_, i) => {
        const t = interpolate(frame - delay - 6 - i * 3, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const h = 17;
        return (
          <rect
            key={i}
            x={24 + i * 12}
            y={base - h * t}
            width={8}
            height={h * t}
            fill={accent}
          />
        );
      })}
      <Label x={72} y={130} delay={delay + 34} anchor="middle" color={COLOR.greenDeep} size={8}>
        TEN GOOD TRADES
      </Label>

      {(() => {
        const t = interpolate(frame - delay - 44, [0, 14], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <g>
            <rect x={186} y={base} width={38} height={72 * t} fill="none" stroke={COLOR.red} strokeWidth={2.6} />
            <rect x={186} y={base} width={38} height={72 * t} fill={COLOR.red} opacity={0.12} />
          </g>
        );
      })()}
      <Label x={205} y={196} delay={delay + 58} anchor="middle" color={COLOR.red} size={8}>
        ONE OVERSIZED LOSS
      </Label>
      <Label x={205} y={100} delay={delay + 62} anchor="middle" color={color} size={8}>
        4x TOO BIG
      </Label>
    </svg>
  );
};

/** The hole gets steeper the deeper it goes. */
export const FigDrawdown: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const frame = useFrame();
  const fall = interpolate(frame - delay - 6, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const climb = interpolate(frame - delay - 30, [0, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const TOP = 44;
  const BOT = 132;
  return (
    <svg viewBox="0 0 260 200" width="98%" height="98%">
      <line x1={22} y1={TOP} x2={240} y2={TOP} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.2} strokeDasharray="4 4" />
      <Label x={240} y={34} delay={delay + 8} anchor="end" size={8}>
        STARTING LEVEL
      </Label>

      <path
        d={`M30 ${TOP} L102 ${TOP + (BOT - TOP) * fall}`}
        stroke={COLOR.red}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M102 ${BOT} L228 ${BOT - (BOT - TOP) * climb}`}
        stroke={accent}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        opacity={climb > 0 ? 1 : 0}
      />

      <Label x={62} y={104} delay={delay + 22} anchor="middle" color={COLOR.red} size={9}>
        −50%
      </Label>
      <Label x={188} y={66} delay={delay + 56} anchor="middle" color={COLOR.greenDeep} size={9}>
        +100%
      </Label>
      <Label x={130} y={170} delay={delay + 68} anchor="middle" color={color} size={8}>
        HALF THE FALL, TWICE THE CLIMB
      </Label>
    </svg>
  );
};


/** A tulip, above and below the ground. */
export const FigTulip: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => (
  <svg viewBox="0 0 260 200" width="92%" height="92%">
    <DrawPath
      delay={delay}
      dur={26}
      width={2.6}
      color={color}
      d="M104 62 Q104 34 116 26 Q128 40 130 26 Q132 40 144 26 Q156 34 156 62 Q130 74 104 62 Z"
    />
    <DrawPath delay={delay + 18} dur={20} width={2.2} color={color} d="M130 40 L130 62" />
    <DrawPath delay={delay + 22} dur={24} width={2.6} color={accent} d="M130 70 L130 132" />
    <DrawPath delay={delay + 28} dur={22} width={2.4} color={accent} d="M130 92 Q98 92 86 118" />
    <DrawPath delay={delay + 32} dur={22} width={2.4} color={accent} d="M130 104 Q162 104 174 128" />
    <line x1={30} y1={134} x2={230} y2={134} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.2} strokeDasharray="5 4" />
    <DrawPath
      delay={delay + 40}
      dur={22}
      width={2.4}
      color={color}
      d="M130 134 Q108 140 110 158 Q112 178 130 182 Q148 178 150 158 Q152 140 130 134 Z"
    />
    <Label x={230} y={126} delay={delay + 50} anchor="end" size={8}>
      SOIL LINE
    </Label>
    <Label x={130} y={196} delay={delay + 56} anchor="middle" size={8}>
      THE BULB IS THE ASSET
    </Label>
  </svg>
);

/** The shape every mania makes. Reusable for any bubble episode. */
export const FigBubble: React.FC<FigProps> = ({ delay = 0, color = 'currentColor', accent = COLOR.green }) => {
  const frame = useFrame();
  const rise = interpolate(frame - delay - 4, [0, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fall = interpolate(frame - delay - 44, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <svg viewBox="0 0 260 200" width="96%" height="96%">
      <DrawPath delay={delay} dur={18} width={1.6} color={color} d="M24 162 L238 162" />
      <path
        d="M28 156 C70 152 96 144 118 120 C134 102 142 66 150 30"
        stroke={accent}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - rise}
      />
      <path
        d="M150 30 C158 60 164 108 176 132 C190 152 212 156 232 158"
        stroke={COLOR.red}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - fall}
      />
      <circle cx={150} cy={30} r={4.6} fill="currentColor" opacity={rise > 0.98 ? 1 : 0} />
      <Label x={150} y={16} delay={delay + 38} anchor="middle" color={color} size={8.5}>
        THE PEAK
      </Label>
      <Label x={62} y={128} delay={delay + 20} color={COLOR.greenDeep} size={8.5}>
        THE STORY
      </Label>
      <Label x={228} y={140} delay={delay + 62} anchor="end" color={COLOR.red} size={8.5}>
        NO BIDS
      </Label>
    </svg>
  );
};

export const FIGURES = {
  tablet: FigClayTablet,
  ship: FigShip,
  certificate: FigCertificate,
  ticker: FigTicker,
  candles: FigCandles,
  phone: FigPhone,
  coins: FigCoinStack,
  book: FigBook,
  megaphone: FigMegaphone,
  candleAnatomy: FigCandleAnatomy,
  twoCandles: FigTwoCandles,
  wick: FigWick,
  timeframe: FigTimeframe,
  ledger: FigLedger,
  chain: FigChain,
  tamper: FigTamper,
  nodes: FigNodes,
  orderBook: FigOrderBook,
  match: FigMatch,
  spread: FigSpread,
  sizing: FigSizing,
  drawdown: FigDrawdown,
  tulip: FigTulip,
  bubble: FigBubble,
};
export type FigureName = keyof typeof FIGURES;
