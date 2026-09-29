import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, continueRender, delayRender, interpolate, interpolateColors, spring, staticFile, useCurrentFrame} from 'remotion';
import {COPY, Lang} from './copy';

// Hotcoin Newcomer Level-Up Week #2. 1:1, 60 fps, 9.75 s. Round-1 look (green burst, LV badge, reward-power bar,
// white reward card) with Apu as the mascot. One continuous scene: Apu gains gear per level (plain, shades, crown),
// the LV.1 card flips into LV.2 (they don't stack), then LV.2 tucks into a strip and the LV.3 card stacks under it.
export const LEVELUP_DURATION = 585;
const T = {l1: 75, l2: 180, l3: 285, end: 405};
const LEVELS = [T.l1, T.l2, T.l3];

const C = {
  bg: '#1c6a3a', bgDeep: '#0f4323', ink: '#0b2414', lime: '#9cf06f', limePale: '#d4fbb0', frog: '#5fd35a',
  gold: '#ffd23f', goldPale: '#fff0a6', burstGold: '#f3d34a', white: '#ffffff', red: '#b3261e',
};
const LATIN = 'Anton, "Noto Sans SC", sans-serif';
const CJK = '"Noto Sans SC", Anton, sans-serif';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sp = (f: number, d = 12, s = 180) => spring({frame: f, fps: 60, config: {damping: d, stiffness: s}});
const lin = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], clamp);
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
const easeOut = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
const rand = (i: number) => {const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};

// 0 = intro, 1..3 = levels, 4 = end card.
const levelAt = (f: number) => (f >= T.end ? 4 : f >= T.l3 ? 3 : f >= T.l2 ? 2 : f >= T.l1 ? 1 : 0);
const sinceHit = (f: number) => {
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
const Background: React.FC<{f: number}> = ({f}) => {
  const age = sinceHit(f);
  const pop = f >= T.l1 ? 1 + 0.05 * Math.exp(-age / 14) : 1;
  const rot = f * 0.0025;
  const g = ease(f, T.l3, T.l3 + 20) * (1 - ease(f, T.end - 10, T.end + 10));
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 52%, ${C.bg} 0%, ${C.bgDeep} 75%)`}}>
      <svg width={1080} height={1080} style={{position: 'absolute'}}>
        <g opacity={0.16}>
          {Array.from({length: 36}).map((_, i) => {
            const a = rot * 2 + (i * Math.PI * 2) / 36;
            const w = 0.035;
            return <polygon key={i} fill={C.limePale} points={`540,560 ${540 + Math.cos(a - w) * 1200},${560 + Math.sin(a - w) * 1200} ${540 + Math.cos(a + w) * 1200},${560 + Math.sin(a + w) * 1200}`} />;
          })}
        </g>
        <g transform={`translate(540 520) scale(${pop}) translate(-540 -520)`}>
          <polygon points={starPts(540, 520, 17, 470, 250, rot - Math.PI / 2, 0.22, 3)} fill={interpolateColors(g, [0, 1], [C.lime, C.burstGold])} stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
          <polygon points={starPts(540, 520, 17, 380, 220, rot - Math.PI / 2 + 0.09, 0.2, 40)} fill={interpolateColors(g, [0, 1], [C.limePale, C.goldPale])} />
        </g>
      </svg>
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

// ---------------------------------------------------------------- Apu
// public/levelup/apu.png: classic Apu in a blue shirt (web PNG; hand gesture painted out, background keyed, ink
// outline added). 690 x 642. Gear is drawn in the image's own pixel space: pupils near (306,229) and (586,229),
// head top between the eye bumps near (350,20).
const APU_W = 690, APU_H = 642;
const Shades: React.FC = () => (
  <g transform="rotate(3 410 215)">
    <rect x={120} y={146} width={575} height={24} rx={10} fill={C.ink} />
    <rect x={138} y={150} width={302} height={130} rx={38} fill={C.ink} />
    <rect x={442} y={158} width={244} height={122} rx={36} fill={C.ink} />
    {[[196, 170], [500, 176]].map(([x, y]) => (
      <g key={x} stroke={C.white} strokeWidth={14} strokeLinecap="round">
        <line x1={x + 38} y1={y + 18} x2={x} y2={y + 78} />
        <line x1={x + 82} y1={y + 18} x2={x + 44} y2={y + 78} />
      </g>
    ))}
  </g>
);
const Crown: React.FC = () => (
  <g>
    <path d="M-80,30 L-92,-40 L-44,-4 L0,-58 L44,-4 L92,-40 L80,30 Z" fill={C.gold} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-80} y={18} width={160} height={16} fill={C.gold} stroke={C.ink} strokeWidth={6} />
    <circle cx={0} cy={4} r={11} fill="#ff4d6d" stroke={C.ink} strokeWidth={5} />
    <circle cx={-48} cy={10} r={7} fill="#4dc3ff" stroke={C.ink} strokeWidth={4} />
    <circle cx={48} cy={10} r={7} fill="#4dc3ff" stroke={C.ink} strokeWidth={4} />
  </g>
);
const Ring: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => {
  if (t < 0 || t > 24) return null;
  const k = easeOut(t, 0, 24);
  return <circle cx={x} cy={y} r={40 + 230 * k} fill="none" stroke={C.gold} strokeWidth={18 * (1 - k)} opacity={1 - k} />;
};

const Apu: React.FC<{f: number}> = ({f}) => {
  const shadesIn = easeOut(f, T.l2 + 2, T.l2 + 18);
  const crownIn = easeOut(f, T.l3 + 2, T.l3 + 20);
  const sway = 1.6 * Math.sin(f / 22);
  const breathe = 1 + 0.012 * Math.sin(f / 14);
  return (
    <svg viewBox={`0 0 ${APU_W} ${APU_H}`} width={APU_W} height={APU_H} style={{overflow: 'visible', display: 'block'}}>
      <g transform={`rotate(${sway} 345 ${APU_H}) translate(345 ${APU_H}) scale(${1 / breathe}, ${breathe}) translate(-345 -${APU_H})`}>
        <image href={staticFile('levelup/apu.png')} x={0} y={0} width={APU_W} height={APU_H} />
        {f >= T.l2 && <g transform={`translate(0 ${-420 * (1 - shadesIn)})`} opacity={lin(f, T.l2, T.l2 + 6)}><Shades /></g>}
        {f >= T.l3 && (
          <g transform={`translate(350 ${-6 - 460 * (1 - crownIn)}) rotate(${-6 + 10 * (1 - crownIn)}) scale(1.35)`} opacity={lin(f, T.l3, T.l3 + 6)}>
            <Crown />
          </g>
        )}
      </g>
      <Ring x={450} y={220} t={f - T.l2 - 16} />
      <Ring x={350} y={-10} t={f - T.l3 - 18} />
    </svg>
  );
};

// ---------------------------------------------------------------- header: LV badge + reward power
const LvBadge: React.FC<{f: number; lang: Lang}> = ({f, lang}) => {
  const lv = Math.min(3, Math.max(1, levelAt(f)));
  const enter = sp(f - T.l1, 16, 150);
  // number flips over on each level change
  const hit = lv > 1 ? LEVELS[lv - 1] : -999;
  const p = lin(f, hit, hit + 14);
  const shown = p < 0.5 && lv > 1 ? lv - 1 : lv;
  const flip = Math.abs(Math.cos(p * Math.PI));
  const pulse = 1 + 0.08 * Math.sin(Math.PI * lin(f, hit, hit + 18));
  const gold = ease(f, T.l3, T.l3 + 14);
  const ribbon = lv >= 1 ? Math.min(easeOut(sinceHit(f), 4, 16), 1 - ease(sinceHit(f), 44, 56)) : 0;
  return (
    <>
      <div style={{position: 'absolute', left: 16, top: 6, width: 320, height: 230, transform: `scale(${enter * pulse}) rotate(-8deg)`}}>
        <svg width={320} height={230} style={{position: 'absolute'}}>
          <polygon points={starPts(160, 115, 14, 152, 100, 0.1, 0.18, 7)} fill={interpolateColors(gold, [0, 1], [C.lime, C.gold])} stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Ink size={122} sw={8} shadow={5} style={{transform: `scaleY(${flip})`}}>{`LV.${shown}`}</Ink>
        </div>
      </div>
      {f >= T.l1 && (
        <div style={{position: 'absolute', left: 52, top: 226, opacity: ribbon, transform: `translateY(${(1 - ribbon) * -16}px) rotate(-6deg)`,
          background: C.ink, border: `4px solid ${C.gold}`, borderRadius: 10, padding: '2px 16px 6px'}}>
          <Ink size={lang === 'cn' ? 36 : 40} family={lang === 'cn' ? CJK : LATIN} weight={lang === 'cn' ? 900 : 400} fill={C.gold} sw={0} ls={1}>{COPY[lang].shout}</Ink>
        </div>
      )}
    </>
  );
};

const PowerBar: React.FC<{f: number; lang: Lang}> = ({f, lang}) => {
  const c = COPY[lang];
  const fills = LEVELS.map((l) => ease(f, l + 4, l + 22));
  const total = f < T.l3 ? 5 * fills[0] : 5 + 10 * fills[2];
  const pulse = 1 + 0.1 * Math.sin(Math.PI * lin(sinceHit(f), 18, 30)) * (f >= T.l1 ? 1 : 0);
  const gold = ease(f, T.l3, T.l3 + 14);
  const body = lang === 'cn' ? CJK : '"Roboto", sans-serif';
  const enter = easeOut(f, T.l1, T.l1 + 16);
  return (
    <div style={{position: 'absolute', right: 40, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
      opacity: enter, transform: `translateX(${(1 - enter) * 80}px)`}}>
      <div style={{fontFamily: body, fontWeight: 900, fontSize: 30, color: C.white, textShadow: `3px 3px 0 ${C.ink}`}}>{c.power}</div>
      <div style={{display: 'flex', gap: 12}}>
        {fills.map((w, i) => {
          const active = levelAt(f) === i + 1;
          return (
            <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
              <div style={{width: 128, height: 40, transform: 'skewX(-20deg)', background: '#237f45', border: `5px solid ${C.ink}`, position: 'relative', overflow: 'hidden'}}>
                <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w * 100}%`, background: interpolateColors(gold, [0, 1], [C.lime, C.gold])}} />
              </div>
              <div style={{fontFamily: body, fontWeight: 900, fontSize: 22, color: active ? C.gold : w > 0.99 ? C.white : 'rgba(255,255,255,0.55)', textShadow: `2px 2px 0 ${C.ink}`}}>
                {`${i + 1}. ${c.steps[i]}`}
              </div>
            </div>
          );
        })}
      </div>
      <Ink size={lang === 'cn' ? 46 : 50} sw={5} family={lang === 'cn' ? CJK : LATIN} weight={lang === 'cn' ? 900 : 400}
        style={{transform: `scale(${pulse})`, transformOrigin: 'right center'}}>
        {c.upTo(Math.round(total))}
      </Ink>
    </div>
  );
};

// ---------------------------------------------------------------- reward cards
const CARD = {left: 50, right: 50, top: 812, h: 212};
const RewardFace: React.FC<{i: number; count: number; lang: Lang}> = ({i, count, lang}) => {
  const c = COPY[lang].levels[i];
  const isCn = lang === 'cn';
  const body = isCn ? CJK : '"Roboto", sans-serif';
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', inset: 0, background: C.white, border: `9px solid ${C.ink}`, boxShadow: `14px 14px 0 ${C.ink}`,
        display: 'flex', alignItems: 'center', padding: '0 38px', gap: 30}}>
        <Ink size={c.amount >= 10 ? 160 : 176} fill={i === 2 ? C.gold : C.frog} sw={9} lh={1.05}>{`${c.plus ? '+' : ''}${count} USDT`}</Ink>
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <div style={{fontFamily: body, fontWeight: 900, fontSize: isCn ? 48 : 44, lineHeight: 1.12, color: C.ink, whiteSpace: 'pre'}}>{c.label}</div>
          {c.note && <div style={{fontFamily: body, fontWeight: 700, fontSize: 22, lineHeight: 1.25, color: C.red, whiteSpace: 'pre'}}>{c.note}</div>}
        </div>
      </div>
      <div style={{position: 'absolute', left: 24, top: -56, background: C.ink, color: C.white, padding: '6px 20px 9px', borderRadius: 10,
        fontFamily: body, fontWeight: 900, fontSize: 32, whiteSpace: 'nowrap', border: `4px solid ${i === 2 ? C.gold : C.lime}`}}>
        {c.task}
      </div>
    </div>
  );
};

// Collapsed LV.2 reward, parked above the LV.3 card.
const Strip: React.FC<{lang: Lang}> = ({lang}) => {
  const c = COPY[lang].levels[1];
  const body = lang === 'cn' ? CJK : '"Roboto", sans-serif';
  return (
    <div style={{position: 'absolute', inset: 0, background: C.white, border: `6px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}`,
      display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px'}}>
      <div style={{fontFamily: LATIN, fontSize: 30, color: C.ink, background: C.lime, padding: '0 12px', border: `4px solid ${C.ink}`, borderRadius: 8}}>LV.2</div>
      <div style={{fontFamily: LATIN, fontSize: 52, color: C.ink, lineHeight: 1}}>5 USDT</div>
      <div style={{fontFamily: body, fontWeight: 900, fontSize: 28, color: C.ink, flex: 1}}>{c.chip}</div>
      <svg width={44} height={44}><circle cx={22} cy={22} r={19} fill={C.frog} stroke={C.ink} strokeWidth={4} /><path d="M12,22 l7,8 l13,-15" fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
};

const Cards: React.FC<{f: number; lang: Lang}> = ({f, lang}) => {
  if (f < T.l1) return null;
  const exit = ease(f, T.end - 16, T.end + 2);
  const box: React.CSSProperties = {position: 'absolute', left: CARD.left, right: CARD.right, top: CARD.top, height: CARD.h};
  // LV.1 -> LV.2: one card that flips over (the two rewards replace each other)
  const inn = easeOut(f, T.l1 + 2, T.l1 + 22);
  const angle = interpolate(f, [T.l2 + 4, T.l2 + 20], [0, 180], {...clamp, easing: Easing.inOut(Easing.quad)});
  const face = angle < 90 ? 0 : 1;
  const count1 = Math.round(interpolate(f, [T.l1 + 10, T.l1 + 26], [0, 5], clamp));
  // LV.2 -> strip, LV.3 slides in underneath it
  const tuck = ease(f, T.l3 + 2, T.l3 + 18);
  const inn3 = easeOut(f, T.l3 + 6, T.l3 + 24);
  const count3 = Math.round(interpolate(f, [T.l3 + 12, T.l3 + 28], [0, 10], clamp));
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateY(${exit * 480}px)`, opacity: 1 - exit}}>
      {tuck < 1 && (
        <div style={{...box, perspective: 1400}}>
          <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 50%',
            transform: `translateY(${(1 - inn) * 420 - tuck * 206}px) scale(${1 - 0.5 * tuck}) rotateX(${face === 0 ? angle : angle - 180}deg) rotate(-2deg)`,
            opacity: 1 - lin(tuck, 0.6, 0.9)}}>
            <RewardFace i={face} count={face === 0 ? count1 : 5} lang={lang} />
          </div>
        </div>
      )}
      {tuck > 0 && (
        <div style={{position: 'absolute', left: 110, right: 110, top: 670, height: 80, opacity: lin(tuck, 0.6, 0.9), transform: `scale(${1.1 - 0.1 * lin(tuck, 0.6, 1)}) rotate(-1.5deg)`}}>
          <Strip lang={lang} />
        </div>
      )}
      {f >= T.l3 + 6 && (
        <div style={{...box, transform: `translateY(${(1 - inn3) * 420}px) rotate(-2deg)`}}>
          <RewardFace i={2} count={count3} lang={lang} />
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------- intro + end card
const Intro: React.FC<{t: number; lang: Lang}> = ({t, lang}) => {
  const c = COPY[lang];
  const isCn = lang === 'cn';
  const a = sp(t - 2, 12, 200), b = sp(t - 8, 12, 200), d = sp(t - 16, 14, 200), e = sp(t - 22, 14, 200);
  const out = ease(t, 58, 74);
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `translateY(${-out * 60}px)`}}>
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
  const a = sp(t - 2, 14, 180), chips = [0, 1, 2].map((i) => sp(t - 12 - i * 5, 14, 200));
  const d = sp(t - 28, 14, 200), e = sp(t - 34, 14, 200), g = sp(t - 40, 14, 200);
  const n = Math.round(interpolate(t, [2, 22], [0, 15], clamp));
  const cta = 1 + 0.04 * Math.sin(t / 6) * (t > 56 ? 1 : 0);
  const body = isCn ? CJK : '"Roboto", sans-serif';
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: lin(t, 0, 10)}}>
        <Img src={staticFile('brand/logo.png')} style={{height: 40, filter: `drop-shadow(3px 3px 0 ${C.ink})`}} />
        <div style={{fontFamily: body, fontWeight: 900, fontSize: 34, color: C.white, textShadow: `3px 3px 0 ${C.ink}`}}>{c.endKicker}</div>
      </div>
      <div style={{position: 'absolute', top: 108, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${interpolate(a, [0, 1], [1.5, 1])}) rotate(-4deg)`, opacity: lin(t, 0, 6)}}>
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
  [0, 'start', 0.7], [10, 'select', 0.5], [18, 'select', 0.5], [60, 'swipe', 0.5],
  [T.l1, 'level-up', 0.8], [T.l1 + 8, 'progress-step', 0.5], [T.l1 + 20, 'coupon', 0.7],
  [T.l2, 'level-up', 0.8], [T.l2 + 6, 'swipe', 0.6], [T.l2 + 16, 'badge', 0.7],
  [T.l3, 'achievement', 0.9], [T.l3 + 4, 'swipe', 0.5], [T.l3 + 18, 'unlock', 0.6], [T.l3 + 28, 'coupon', 0.7],
  [T.end, 'bonus', 0.8], [T.end + 12, 'snap', 0.5], [T.end + 17, 'snap', 0.5], [T.end + 22, 'snap', 0.5], [T.end + 40, 'reward', 0.8],
];

// ---------------------------------------------------------------- composition
export const LevelUp: React.FC<{lang: Lang}> = ({lang}) => {
  useFonts(lang);
  const f = useCurrentFrame();
  const lv = levelAt(f);

  // Apu: peeks up from the bottom in the intro, glides to centre stage for the levels, glides out for the end card.
  const up = ease(f, 52, 90);
  const out = ease(f, T.end - 16, T.end + 2);
  const scale = interpolate(up, [0, 1], [0.62, 0.82]);
  const top = interpolate(up, [0, 1], [1080 - 230, 312]) + out * 900;
  const peek = sp(f - 14, 16, 140);
  const introY = f < 52 ? (1 - peek) * 300 : 0;
  const glow = f >= T.l1 && lv <= 3 ? 0.55 * Math.exp(-sinceHit(f) / 16) * lin(sinceHit(f), 0, 4) : 0;
  const hudOut = ease(f, T.end - 14, T.end);

  return (
    <AbsoluteFill style={{background: C.bgDeep, overflow: 'hidden'}}>
      <Background f={f} />
      <Sparkles f={f} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 44%, rgba(255,255,230,${glow}) 0%, rgba(255,255,230,0) 38%)`}} />
      {out < 1 && (
        <div style={{position: 'absolute', left: 540 - (APU_W * scale) / 2, top: top + introY, width: APU_W * scale, height: APU_H * scale}}>
          <div style={{transform: `scale(${scale})`, transformOrigin: '0 0'}}>
            <Apu f={f} />
          </div>
        </div>
      )}
      {lv === 0 && <Intro t={f} lang={lang} />}
      {f >= T.l1 && f < T.end && (
        <AbsoluteFill style={{opacity: 1 - hudOut}}>
          <LvBadge f={f} lang={lang} />
          <PowerBar f={f} lang={lang} />
        </AbsoluteFill>
      )}
      <Cards f={f} lang={lang} />
      {lv === 4 && <EndCard t={f - T.end} lang={lang} />}
      {SFX.map(([at, cue, vol], i) => (
        <Sequence key={i} from={at} durationInFrames={120} layout="none">
          <Audio src={staticFile(`sfx/arcade/${cue}.mp3`)} volume={vol * 0.8} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
