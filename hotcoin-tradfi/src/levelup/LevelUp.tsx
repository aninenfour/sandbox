import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {COPY, Lang} from './copy';

// Hotcoin Newcomer Level-Up Week #2. 1:1, 60 fps, 9 s. Same look as round 1: dark green burst, flexing
// frog in shades, LV badge, reward-power bar, white reward card. One level per task, then an end card.
export const LEVELUP_DURATION = 540;
const T = {l1: 75, l2: 165, l3: 255, end: 360};
const LEVELS = [T.l1, T.l2, T.l3];

const C = {
  bg: '#1c6a3a', bgDeep: '#0f4323', ink: '#0b2414', lime: '#9cf06f', limePale: '#d4fbb0', frog: '#5fd35a',
  frogDark: '#3aa53f', belly: '#e6fbc8', gold: '#ffd23f', goldDark: '#c98a00', white: '#ffffff', pink: '#f58aa3',
};
const LATIN = 'Anton, "Noto Sans SC", sans-serif';
const CJK = '"Noto Sans SC", Anton, sans-serif';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sp = (f: number, d = 12, s = 180) => spring({frame: f, fps: 60, config: {damping: d, stiffness: s}});
const lin = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], clamp);
const rand = (i: number) => {const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};

// Current level (0 = intro, 1..3, 4 = end card) and frames since it started.
const stageAt = (f: number) => {
  if (f >= T.end) return {lv: 4, t: f - T.end};
  for (let i = 2; i >= 0; i--) if (f >= LEVELS[i]) return {lv: i + 1, t: f - LEVELS[i]};
  return {lv: 0, t: f};
};
const hitAge = (f: number) => {
  const hits = [0, ...LEVELS, T.end].filter((h) => h <= f);
  return f - hits[hits.length - 1];
};

// ---------------------------------------------------------------- fonts
const useFonts = (lang: Lang) => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const all = JSON.stringify(COPY[lang]);
    Promise.all([
      document.fonts.load('400 100px Anton', all),
      document.fonts.load('900 100px "Noto Sans SC"', all),
      document.fonts.load('700 100px "Noto Sans SC"', all),
    ]).then(() => continueRender(h));
  }, [h, lang]);
};

// ---------------------------------------------------------------- shapes
const starPts = (cx: number, cy: number, n: number, rO: number, rI: number, rot = 0, jitter = 0, seed = 0) => {
  const p: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (i * Math.PI) / n;
    const r = i % 2 === 0 ? rO * (1 - jitter + jitter * 2 * rand(seed + i)) : rI;
    p.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return p.join(' ');
};

// Comic outline text: a thick stroke layer under a clean fill layer, plus a hard drop shadow.
const Ink: React.FC<{
  children: React.ReactNode; size: number; fill?: string; stroke?: string; sw?: number; family?: string;
  weight?: number; shadow?: number; style?: React.CSSProperties; lh?: number; ls?: number;
}> = ({children, size, fill = C.white, stroke = C.ink, sw = 8, family = LATIN, weight = 400, shadow = 0, style, lh = 1, ls = 0}) => {
  const base: React.CSSProperties = {fontFamily: family, fontWeight: weight, fontSize: size, lineHeight: lh, letterSpacing: ls, whiteSpace: 'pre'};
  return (
    <div style={{position: 'relative', display: 'inline-block', ...style}}>
      <div style={{...base, position: 'absolute', inset: 0, color: stroke, WebkitTextStroke: `${sw * 2}px ${stroke}`,
        filter: shadow ? `drop-shadow(${shadow}px ${shadow}px 0 ${C.ink})` : undefined}}>{children}</div>
      <div style={{...base, position: 'relative', color: fill}}>{children}</div>
    </div>
  );
};

// ---------------------------------------------------------------- background
const Background: React.FC<{f: number; gold: number}> = ({f, gold}) => {
  const age = hitAge(f);
  const pop = 1 + 0.12 * Math.exp(-age / 10) * Math.cos(age / 3);
  const rot = f * 0.0025;
  const outer = interpolate(gold, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 52%, ${C.bg} 0%, ${C.bgDeep} 75%)`}}>
      <svg width={1080} height={1080} style={{position: 'absolute'}}>
        {/* speed rays */}
        <g opacity={0.16}>
          {Array.from({length: 36}).map((_, i) => {
            const a = rot * 2 + (i * Math.PI * 2) / 36;
            const w = 0.035;
            return <polygon key={i} fill={C.limePale} points={`540,560 ${540 + Math.cos(a - w) * 1200},${560 + Math.sin(a - w) * 1200} ${540 + Math.cos(a + w) * 1200},${560 + Math.sin(a + w) * 1200}`} />;
          })}
        </g>
        <g transform={`translate(540 540) scale(${pop}) translate(-540 -540)`}>
          <polygon points={starPts(540, 520, 17, 470, 250, rot - Math.PI / 2, 0.22, 3)} fill={outer > 0.5 ? '#f3d34a' : C.lime} stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
          <polygon points={starPts(540, 520, 17, 380, 220, rot - Math.PI / 2 + 0.09, 0.2, 40)} fill={outer > 0.5 ? '#fff0a6' : C.limePale} />
        </g>
      </svg>
      {/* diagonal hatching */}
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.06) 0 6px, transparent 6px 18px)'}} />
    </AbsoluteFill>
  );
};

const Sparkles: React.FC<{f: number}> = ({f}) => {
  const pts = [[110, 560, 0], [965, 520, 1.3], [180, 380, 2.1], [905, 700, 0.7], [70, 760, 2.8], [1010, 330, 1.9]];
  return (
    <svg width={1080} height={1080} style={{position: 'absolute'}}>
      {pts.map(([x, y, ph], i) => {
        const s = 0.6 + 0.4 * Math.sin(f / 9 + ph * 3);
        return <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M0,-34 L9,0 L0,34 L-9,0 Z" fill={C.lime} stroke={C.ink} strokeWidth={4} />;
      })}
    </svg>
  );
};

// ---------------------------------------------------------------- the frog: Apu PNG when frogImage is set, else an original frog drawn in code
const Frog: React.FC<{f: number; lv: number; image?: string}> = ({f, lv, image}) => {
  const flex = Math.sin(f / 7) * 7; // forearm pump, degrees
  const arm = (side: 1 | -1) => {
    // elbow out wide, forearm up, fist by the cheek
    const ex = 200 + side * 175, ey = 285;
    return (
      <g transform={`rotate(${side * flex} ${ex} ${ey})`}>
        <path d={`M${200 + side * 80},270 Q${200 + side * 150},300 ${ex},${ey} L${ex - side * 8},${205}`} fill="none" stroke={C.ink} strokeWidth={60} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${200 + side * 80},270 Q${200 + side * 150},300 ${ex},${ey} L${ex - side * 8},${205}`} fill="none" stroke={C.frog} strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" />
        {/* biceps bump */}
        <ellipse cx={200 + side * 135} cy={268} rx={34} ry={26} fill={C.frog} stroke={C.ink} strokeWidth={8} />
        <ellipse cx={200 + side * 135} cy={268} rx={30} ry={22} fill={C.frog} />
        {/* fist */}
        <circle cx={ex - side * 8} cy={190} r={36} fill={C.frog} stroke={C.ink} strokeWidth={8} />
        <path d={`M${ex - side * 24},${178} h${side * 30} M${ex - side * 24},${194} h${side * 30} M${ex - side * 24},${210} h${side * 26}`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
      </g>
    );
  };
  const silhouette = (props: React.SVGProps<SVGGElement>) => (
    <g {...props}>
      <ellipse cx={140} cy={410} rx={52} ry={20} />
      <ellipse cx={260} cy={410} rx={52} ry={20} />
      <path d="M112,250 C96,340 130,408 200,408 C270,408 304,340 288,250 Z" />
      <ellipse cx={200} cy={190} rx={128} ry={84} />
      <circle cx={138} cy={122} r={44} />
      <circle cx={262} cy={122} r={44} />
    </g>
  );
  return (
    <svg viewBox="-40 0 480 440" width={560} height={513} style={{overflow: 'visible'}}>
      {/* LV.3 aura */}
      {lv >= 3 && (
        <polygon points={starPts(image ? 224 : 200, image ? 230 : 250, 14, 250 + 12 * Math.sin(f / 4), 170, f * 0.01, 0.25, 90)} fill={C.gold} stroke={C.ink} strokeWidth={8} opacity={0.95} />
      )}
      {image ? (
        <ApuLayer href={image} f={f} lv={lv} />
      ) : (
        <>
          {silhouette({fill: C.ink, stroke: C.ink, strokeWidth: 18, strokeLinejoin: 'round'})}
          {silhouette({fill: C.frog})}
          <ellipse cx={200} cy={330} rx={66} ry={62} fill={C.belly} />
          {[[150, 250, 9], [250, 240, 7], [168, 150, 6], [236, 160, 8], [130, 300, 6]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={C.frogDark} />)}
          {arm(-1)}
          {arm(1)}
          {/* shades */}
          <rect x={78} y={96} width={244} height={16} rx={6} fill={C.ink} />
          <rect x={88} y={100} width={100} height={62} rx={16} fill={C.ink} />
          <rect x={212} y={100} width={100} height={62} rx={16} fill={C.ink} />
          {[108, 232].map((x) => (
            <g key={x} stroke={C.white} strokeWidth={8} strokeLinecap="round">
              <line x1={x + 18} y1={112} x2={x} y2={142} />
              <line x1={x + 40} y1={112} x2={x + 22} y2={142} />
            </g>
          ))}
          <ellipse cx={126} cy={196} rx={20} ry={12} fill={C.pink} />
          <ellipse cx={274} cy={196} rx={20} ry={12} fill={C.pink} />
          <path d="M168,212 Q200,232 232,212" fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
          <rect x={188} y={219} width={11} height={13} rx={2} fill={C.white} stroke={C.ink} strokeWidth={3} />
          <rect x={201} y={219} width={11} height={13} rx={2} fill={C.white} stroke={C.ink} strokeWidth={3} />
        </>
      )}
      {/* LV.2+: verified chain (KYC done) */}
      {!image && lv >= 2 && (
        <g>
          <path d="M130,262 Q200,318 270,262" fill="none" stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
          <path d="M130,262 Q200,318 270,262" fill="none" stroke={C.gold} strokeWidth={9} strokeLinecap="round" strokeDasharray="2 12" />
          <circle cx={200} cy={300} r={30} fill={C.gold} stroke={C.ink} strokeWidth={7} />
          <path d="M186,300 l10,11 l18,-22" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {/* LV.3: crown */}
      {!image && lv >= 3 && <Crown x={200} y={64} rot={-8 + 3 * Math.sin(f / 10)} s={1} />}
    </svg>
  );
};

const Crown: React.FC<{x: number; y: number; rot: number; s: number}> = ({x, y, rot, s}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-80,30 L-92,-40 L-44,-4 L0,-58 L44,-4 L92,-40 L80,30 Z" fill={C.gold} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={0} cy={8} r={11} fill="#ff4d6d" stroke={C.ink} strokeWidth={5} />
    <circle cx={-48} cy={14} r={7} fill="#4dc3ff" stroke={C.ink} strokeWidth={4} />
    <circle cx={48} cy={14} r={7} fill="#4dc3ff" stroke={C.ink} strokeWidth={4} />
  </g>
);

// Apu ("FRENS" PNG, background keyed out, ink outline added; 888 x 945) fitted into the frog box, with level gear
// placed on its face and neck. Box coordinates: image x0 = -6.7, scale 0.466. Pupils sit at about (235,107) and (344,111).
const ApuLayer: React.FC<{href: string; f: number; lv: number}> = ({href, f, lv}) => {
  const wob = 2.5 * Math.sin(f / 9);
  return (
    <g transform={`translate(200 500) scale(1.15) translate(-200 -440) rotate(${wob} 200 440)`}>
      <image href={href} x={-40} y={0} width={480} height={440} preserveAspectRatio="xMidYMax meet" />
      {lv >= 1 && (
        <g transform="translate(0 3) rotate(4 292 106)">
          <rect x={172} y={74} width={240} height={14} rx={6} fill={C.ink} />
          <rect x={180} y={78} width={106} height={60} rx={16} fill={C.ink} />
          <rect x={298} y={78} width={106} height={60} rx={16} fill={C.ink} />
          {[198, 316].map((x) => (
            <g key={x} stroke={C.white} strokeWidth={8} strokeLinecap="round">
              <line x1={x + 20} y1={90} x2={x + 2} y2={122} />
              <line x1={x + 44} y1={90} x2={x + 26} y2={122} />
            </g>
          ))}
        </g>
      )}
      {lv >= 2 && (
        <g>
          <path d="M140,180 Q232,222 328,186" fill="none" stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
          <path d="M140,180 Q232,222 328,186" fill="none" stroke={C.gold} strokeWidth={9} strokeLinecap="round" strokeDasharray="2 12" />
          <circle cx={232} cy={202} r={22} fill={C.gold} stroke={C.ink} strokeWidth={6} />
          <path d="M222,202 l8,9 l13,-16" fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {lv >= 3 && <Crown x={262} y={22} rot={8 + 3 * Math.sin(f / 10)} s={0.85} />}
    </g>
  );
};

// ---------------------------------------------------------------- HUD pieces
const LvBadge: React.FC<{lv: number; t: number}> = ({lv, t}) => {
  const s = interpolate(sp(t, 9, 200), [0, 1], [2.4, 1]);
  const r = interpolate(sp(t, 12, 160), [0, 1], [-40, -9]);
  return (
    <div style={{position: 'absolute', left: 18, top: 16, width: 380, height: 280, transform: `scale(${s}) rotate(${r}deg)`, opacity: lin(t, 0, 4)}}>
      <svg width={380} height={280} style={{position: 'absolute'}}>
        <polygon points={starPts(190, 140, 14, 182, 118, 0.1, 0.18, lv * 7)} fill={lv === 3 ? C.gold : C.lime} stroke={C.ink} strokeWidth={10} strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Ink size={150} sw={9} shadow={6}>{`LV.${lv}`}</Ink>
      </div>
    </div>
  );
};

const PowerBar: React.FC<{lv: number; t: number; lang: Lang}> = ({lv, t, lang}) => {
  const c = COPY[lang];
  const fillNew = lin(t, 6, 18);
  const cap = [5, 5, 15][lv - 1];
  const prevCap = lv > 1 ? [5, 5, 15][lv - 2] : 0;
  const shown = Math.round(interpolate(t, [6, 22], [prevCap, cap], clamp));
  return (
    <div style={{position: 'absolute', right: 44, top: 44, width: 470, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12}}>
      <div style={{fontFamily: lang === 'cn' ? CJK : '"Roboto", sans-serif', fontWeight: 900, fontSize: 34, color: C.white, textShadow: `3px 3px 0 ${C.ink}`}}>{c.power}</div>
      <div style={{display: 'flex', gap: 14}}>
        {[1, 2, 3].map((i) => {
          const w = i < lv ? 1 : i === lv ? fillNew : 0;
          return (
            <div key={i} style={{width: 132, height: 42, transform: 'skewX(-20deg)', background: '#237f45', border: `5px solid ${C.ink}`, position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w * 100}%`, background: lv === 3 ? C.gold : C.lime}} />
              {i === lv && t > 6 && t < 18 && <div style={{position: 'absolute', top: 0, bottom: 0, left: `${w * 100 - 8}%`, width: 14, background: C.white}} />}
            </div>
          );
        })}
      </div>
      <Ink size={lang === 'cn' ? 50 : 54} sw={5} family={lang === 'cn' ? CJK : LATIN} weight={lang === 'cn' ? 900 : 400}
        style={{transform: `scale(${1 + 0.18 * Math.exp(-Math.max(0, t - 22) / 8) * (t > 22 ? 1 : 0)})`, transformOrigin: 'right center'}}>
        {c.upTo(shown)}
      </Ink>
    </div>
  );
};

const RewardCard: React.FC<{lv: number; t: number; len: number; lang: Lang}> = ({lv, t, len, lang}) => {
  const c = COPY[lang].levels[lv - 1];
  const inn = sp(t - 4, 11, 190);
  const out = lin(t, len - 10, len, 0, 1);
  const y = interpolate(inn, [0, 1], [420, 0]) + out * out * 520;
  const count = Math.round(interpolate(t, [8, 24], [0, c.amount], clamp));
  const tab = sp(t - 8, 14, 200);
  const isCn = lang === 'cn';
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 792, height: 236, transform: `translateY(${y}px) rotate(-2deg)`}}>
      <div style={{position: 'absolute', inset: 0, background: C.white, border: `9px solid ${C.ink}`, boxShadow: `14px 14px 0 ${C.ink}`,
        display: 'flex', alignItems: 'center', padding: '0 40px', gap: 34}}>
        <Ink size={c.amount >= 10 ? 170 : 186} fill={lv === 3 ? C.gold : C.frog} sw={9} lh={1.05}
          style={{transform: `scale(${1 + 0.1 * Math.exp(-Math.max(0, t - 24) / 6) * (t >= 24 ? 1 : 0)})`}}>
          {`${c.plus ? '+' : ''}${count} USDT`}
        </Ink>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <div style={{fontFamily: isCn ? CJK : '"Roboto", sans-serif', fontWeight: 900, fontSize: isCn ? 50 : 46, lineHeight: 1.12, color: C.ink, whiteSpace: 'pre'}}>{c.label}</div>
          {c.note && <div style={{fontFamily: isCn ? CJK : '"Roboto", sans-serif', fontWeight: 700, fontSize: 22, lineHeight: 1.25, color: '#b3261e', whiteSpace: 'pre'}}>{c.note}</div>}
        </div>
      </div>
      {/* task tab */}
      <div style={{position: 'absolute', left: 26, top: -58, transform: `translateX(${interpolate(tab, [0, 1], [-900, 0])}px)`,
        background: C.ink, color: C.white, padding: '8px 22px 10px', borderRadius: 10, fontFamily: isCn ? CJK : '"Roboto", sans-serif',
        fontWeight: 900, fontSize: 34, whiteSpace: 'nowrap', border: `4px solid ${C.lime}`}}>
        {c.task}
      </div>
    </div>
  );
};

const LevelUpShout: React.FC<{t: number; lang: Lang}> = ({t, lang}) => {
  if (t > 40) return null;
  const s = interpolate(sp(t - 2, 8, 220), [0, 1], [0.2, 1]);
  const o = lin(t, 24, 38, 1, 0);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 168, display: 'flex', justifyContent: 'center', transform: `scale(${s}) rotate(-6deg) translateY(${-t * 0.5}px)`, opacity: o}}>
      <Ink size={lang === 'cn' ? 86 : 96} family={lang === 'cn' ? CJK : LATIN} weight={lang === 'cn' ? 900 : 400} fill={C.gold} sw={7} shadow={6} ls={2}>
        {COPY[lang].shout}
      </Ink>
    </div>
  );
};

// ---------------------------------------------------------------- intro + end card
const Intro: React.FC<{t: number; lang: Lang}> = ({t, lang}) => {
  const c = COPY[lang];
  const isCn = lang === 'cn';
  const a = sp(t - 2, 10, 200), b = sp(t - 8, 10, 200), d = sp(t - 16, 12, 200), e = sp(t - 22, 12, 200);
  const out = lin(t, 64, 75);
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `scale(${1 + out * 0.25})`}}>
      <div style={{position: 'absolute', top: 58, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: lin(t, 0, 10)}}>
        <Img src={staticFile('brand/logo.png')} style={{height: 46, filter: `drop-shadow(3px 3px 0 ${C.ink})`}} />
      </div>
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
        <div style={{transform: `scale(${a}) rotate(-4deg)`}}>
          <Ink size={isCn ? 200 : 170} family={isCn ? CJK : LATIN} weight={isCn ? 900 : 400} sw={11} shadow={10} lh={1.05}>{c.title1}</Ink>
        </div>
        <div style={{transform: `scale(${b}) rotate(-4deg)`, display: 'flex', alignItems: 'center', gap: 24}}>
          <Ink size={isCn ? 190 : 150} family={isCn ? CJK : LATIN} weight={isCn ? 900 : 400} sw={10} shadow={9} lh={1.05} fill={C.lime}>{c.title2}</Ink>
          <div style={{position: 'relative', width: 200, height: 170, transform: `rotate(${10 + 4 * Math.sin(t / 8)}deg)`}}>
            <svg width={200} height={170} style={{position: 'absolute'}}>
              <polygon points={starPts(100, 85, 12, 96, 66, 0, 0.12, 5)} fill={C.gold} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
            </svg>
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Ink size={96} sw={7}>#2</Ink>
            </div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: isCn ? 560 : 580, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${d})`}}>
        <div style={{background: C.ink, color: C.white, border: `5px solid ${C.lime}`, borderRadius: 16, padding: '12px 30px 16px', fontFamily: isCn ? CJK : LATIN,
          fontWeight: isCn ? 900 : 400, fontSize: isCn ? 54 : 58, letterSpacing: isCn ? 0 : 1, transform: 'rotate(-2deg)'}}>
          {c.pool}
        </div>
      </div>
      <div style={{position: 'absolute', top: isCn ? 684 : 712, left: 0, right: 0, textAlign: 'center', opacity: e, transform: `translateY(${(1 - e) * 20}px)`,
        fontFamily: isCn ? CJK : '"Roboto", sans-serif', fontWeight: 900, fontSize: 38, color: C.white, textShadow: `3px 3px 0 ${C.ink}`}}>
        {c.hook}
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{t: number; lang: Lang}> = ({t, lang}) => {
  const c = COPY[lang];
  const isCn = lang === 'cn';
  const a = sp(t - 2, 9, 200), chips = [0, 1, 2].map((i) => sp(t - 12 - i * 5, 12, 200));
  const d = sp(t - 28, 12, 200), e = sp(t - 34, 12, 200), g = sp(t - 40, 12, 200);
  const n = Math.round(interpolate(t, [2, 22], [0, 15], clamp));
  const cta = 1 + 0.04 * Math.sin(t / 6) * (t > 56 ? 1 : 0);
  const body = isCn ? CJK : '"Roboto", sans-serif';
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20}}>
        <Img src={staticFile('brand/logo.png')} style={{height: 40, filter: `drop-shadow(3px 3px 0 ${C.ink})`}} />
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: C.white, textShadow: `3px 3px 0 ${C.ink}`}}>{c.endKicker}</div>
      </div>
      <div style={{position: 'absolute', top: 108, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${interpolate(a, [0, 1], [2, 1])}) rotate(-4deg)`, opacity: lin(t, 0, 4)}}>
        <Ink size={isCn ? 170 : 176} family={isCn ? CJK : LATIN} weight={isCn ? 900 : 400} sw={11} shadow={10} fill={C.gold} lh={1.1}>{c.endBig(n)}</Ink>
      </div>
      <div style={{position: 'absolute', top: 350, left: 60, right: 60, display: 'flex', justifyContent: 'center', gap: 22}}>
        {COPY[lang].levels.map((l, i) => (
          <div key={i} style={{flex: 1, background: C.white, border: `6px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}`, padding: '12px 14px 14px',
            transform: `translateY(${(1 - chips[i]) * 60}px) rotate(${[-2, 1, -1][i]}deg)`, opacity: chips[i], display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
            <div style={{fontFamily: LATIN, fontSize: 34, color: C.ink, background: i === 2 ? C.gold : C.lime, padding: '0 14px', border: `4px solid ${C.ink}`, borderRadius: 8}}>{`LV.${i + 1}`}</div>
            <div style={{fontFamily: LATIN, fontSize: 58, color: C.ink, lineHeight: 1.1}}>{`${l.plus ? '+' : ''}${l.amount} USDT`}</div>
            <div style={{fontFamily: body, fontWeight: 900, fontSize: isCn ? 24 : 21, color: C.ink, textAlign: 'center', lineHeight: 1.15}}>{l.chip}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: 600, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${d})`}}>
        <div style={{background: '#ff4d3a', color: C.white, border: `5px solid ${C.ink}`, borderRadius: 14, padding: '8px 26px 12px', fontFamily: body, fontWeight: 900, fontSize: isCn ? 42 : 40, boxShadow: `6px 6px 0 ${C.ink}`, transform: 'rotate(-2deg)'}}>
          {c.limit}
        </div>
      </div>
      <div style={{position: 'absolute', top: 700, left: 0, right: 0, textAlign: 'center', opacity: e, fontFamily: body, fontWeight: 900, fontSize: 36, color: C.white, textShadow: `3px 3px 0 ${C.ink}`}}>
        {c.dates}
      </div>
      <div style={{position: 'absolute', top: 784, left: 90, right: 90, height: 150, transform: `translateY(${(1 - g) * 300}px) rotate(-1.5deg)`,
        background: C.white, border: `8px solid ${C.ink}`, boxShadow: `12px 12px 0 ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 0 36px'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <div style={{fontFamily: body, fontWeight: 900, fontSize: 28, color: '#3a7a4c'}}>{c.linkLabel}</div>
          <div style={{fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 36, color: C.ink}}>{c.link}</div>
        </div>
        <div style={{background: C.lime, border: `6px solid ${C.ink}`, borderRadius: 14, padding: '10px 24px 14px', fontFamily: isCn ? CJK : LATIN, fontWeight: isCn ? 900 : 400, fontSize: 46, color: C.ink, transform: `scale(${cta})`, whiteSpace: 'nowrap'}}>
          {c.cta}
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', opacity: e * 0.85, fontFamily: body, fontWeight: 700, fontSize: 22, color: C.limePale}}>
        {c.fine}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- sound
const SFX: [number, string, number][] = [
  [0, 'start', 0.7], [10, 'pop', 0.5], [18, 'pop', 0.5],
  ...LEVELS.flatMap((l, i): [number, string, number][] => [
    [l, i === 2 ? 'achievement' : 'level-up', 0.9], [l + 6, 'progress-step', 0.5], [l + 12, 'coupon', 0.7],
  ]),
  [T.end, 'bonus', 0.9], [T.end + 12, 'snap', 0.5], [T.end + 17, 'snap', 0.5], [T.end + 22, 'snap', 0.5], [T.end + 40, 'reward', 0.8],
];
const FILES: Record<string, string> = {pop: 'select'};

// ---------------------------------------------------------------- composition
export const LevelUp: React.FC<{lang: Lang; frogImage?: string}> = ({lang, frogImage}) => {
  useFonts(lang);
  const f = useCurrentFrame();
  const {lv, t} = stageAt(f);
  const age = hitAge(f);
  const shake = f >= T.l1 ? 16 * Math.exp(-age / 6) : 0;
  const sx = shake * Math.sin(age * 2.7), sy = shake * Math.cos(age * 3.3);
  const flash = f >= T.l1 ? lin(age, 0, 12, 0.85, 0) : 0;

  // Frog: small and low in the intro, centre stage for levels, bottom-right on the end card.
  const frogLv = Math.min(lv, 3);
  const inLevel = lv >= 1 && lv <= 3;
  const squash = inLevel || lv === 4 ? Math.exp(-age / 9) * Math.cos(age / 2.2) : 0;
  const introPop = sp(f - 14, 10, 170);
  let fx = 540, fy = 548, fs = 1;
  if (lv === 0) {fy = interpolate(introPop, [0, 1], [1400, 1048]); fs = 0.62;}
  if (lv === 4) {const k = sp(t, 14, 120); fx = interpolate(k, [0, 1], [540, 1090]); fy = interpolate(k, [0, 1], [548, 1260]); fs = interpolate(k, [0, 1], [1, 0]);}
  const hop = inLevel ? -40 * Math.max(0, Math.sin(Math.min(Math.PI, age / 5))) * (age < 16 ? 1 : 0) : 0;
  const bob = 6 * Math.sin(f / 7);
  const levelLen = (i: number) => (i === 3 ? T.end : LEVELS[i]) - LEVELS[i - 1];

  return (
    <AbsoluteFill style={{background: C.bgDeep, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px)`}}>
        <Background f={f} gold={lv === 3 ? 1 : 0} />
        <Sparkles f={f} />
        {lv < 4 || fs > 0.02 ? (
          <div style={{position: 'absolute', left: fx - 280, top: fy - 400 + hop + bob, width: 560, height: 513,
            transform: `scale(${fs * (1 - 0.1 * squash)}, ${fs * (1 + 0.1 * squash)})`, transformOrigin: '50% 100%'}}>
            <Frog f={f} lv={frogLv} image={frogImage ? staticFile(frogImage) : undefined} />
          </div>
        ) : null}
        {lv === 0 && <Intro t={t} lang={lang} />}
        {inLevel && (
          <>
            <LvBadge lv={lv} t={t} />
            <PowerBar lv={lv} t={t} lang={lang} />
            <LevelUpShout t={t} lang={lang} />
            <RewardCard lv={lv} t={t} len={levelLen(lv)} lang={lang} />
          </>
        )}
        {lv === 4 && <EndCard t={t} lang={lang} />}
      </AbsoluteFill>
      <AbsoluteFill style={{background: C.white, opacity: flash, pointerEvents: 'none'}} />
      {SFX.map(([at, cue, vol], i) => (
        <Sequence key={i} from={at} durationInFrames={120} layout="none">
          <Audio src={staticFile(`sfx/arcade/${FILES[cue] ?? cue}.mp3`)} volume={vol * 0.8} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
