// Bubble Files Shorts kit: a flat 2D world (dark night palette, one warm light, one red accent),
// simple characters, the stakes meter in the corner, and word-by-word burned-in captions.
// Reused by every Short; each episode only writes its scenes and its caption rules.
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';

export const FPS = 30;
export const W = 1080, H = 1920;
export const C = {
  night: '#121826', night2: '#1A2233', wall: '#222B3D', floor: '#161D2B',
  light: '#F2C14E', lightSoft: 'rgba(242,193,78,.18)',
  skin: '#E9E4D8', line: '#0B0F18', red: '#E3262F', hi: '#FFC93C', paper: '#F2EEE6', money: '#7BC47F', grey: '#8A93A6',
};
export const FONT = {
  cap: 'Montserrat, "Arial Black", sans-serif',
  display: 'Anton, Impact, sans-serif',
  mono: '"JetBrains Mono", "IBM Plex Mono", monospace',
  hand: 'Caveat, cursive',
};
export const f = (s: number) => Math.round(s * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const lin = (fr: number, a: number, b: number, x = 0, y = 1) => interpolate(fr, [a, b], [x, y], clamp);
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const pop = (fr: number, at = 0, damping = 12, stiffness = 200) => (fr < at ? 0 : spring({frame: fr - at, fps: FPS, config: {damping, stiffness}}));

// ---------- the room every scene sits in: wall, floor line, a soft pool of light ----------
export const Room: React.FC<{light?: {x: number; y: number; r: number}; floorY?: number; tint?: string; window?: boolean}> = ({light = {x: 540, y: 760, r: 700}, floorY = 1150, tint = C.night, window: win = false}) => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: tint}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: floorY, background: `linear-gradient(${C.wall}, ${C.night2})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: floorY, bottom: 0, background: C.floor}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: floorY, height: 6, background: 'rgba(255,255,255,.06)'}} />
      {win && (
        <div style={{position: 'absolute', left: 680, top: 330, width: 300, height: 380, background: '#0B1220', border: '14px solid #2E3850', borderRadius: 6, overflow: 'hidden'}}>
          {Array.from({length: 18}, (_, i) => {
            const on = (Math.floor(fr / 40) + i * 7) % 5 !== 0;
            return <div key={i} style={{position: 'absolute', left: 14 + (i % 6) * 46, top: 170 + Math.floor(i / 6) * 60, width: 22, height: 30, background: on ? 'rgba(242,193,78,.55)' : 'rgba(242,193,78,.08)'}} />;
          })}
          <div style={{position: 'absolute', left: 0, right: 0, top: 150, height: 6, background: '#2E3850'}} />
          <div style={{position: 'absolute', left: 134, top: 0, bottom: 0, width: 6, background: '#2E3850'}} />
          <div style={{position: 'absolute', left: 200, top: 40, width: 46, height: 46, borderRadius: '50%', background: '#E9E4D8', opacity: 0.85}} />
        </div>
      )}
      <div style={{position: 'absolute', left: light.x - light.r, top: light.y - light.r, width: light.r * 2, height: light.r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${C.lightSoft} 0%, transparent 70%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 50% 40%, transparent 55%, rgba(0,0,0,.55) 100%)'}} />
    </AbsoluteFill>
  );
};

// ---------- characters ----------
// Flat figures: round head, pill body, stick limbs. Who they are comes from hair, glasses, beard and shirt colour.
export type Who = 'wayne' | 'jobs' | 'woz' | 'man';
export type Pose = {armL?: number; armR?: number; walk?: number | null; mood?: 'neutral' | 'happy' | 'worried' | 'smug'; look?: number; bob?: number; pockets?: boolean};
const LOOK: Record<Who, {shirt: string; hair: string; height: number; wide: number}> = {
  wayne: {shirt: '#5B6B8C', hair: '#C9CCD3', height: 1, wide: 1},
  jobs: {shirt: '#2E2E35', hair: '#2A211C', height: 1.02, wide: 0.9},
  woz: {shirt: '#7A5A3C', hair: '#3A2C22', height: 1.0, wide: 1.15},
  man: {shirt: '#5B6B8C', hair: '#C9CCD3', height: 1, wide: 1},
};
export const Figure: React.FC<{who: Who; x: number; y: number; s?: number; pose?: Pose; flip?: boolean}> = ({who, x, y, s = 1, pose = {}, flip}) => {
  const fr = useCurrentFrame();
  const L = LOOK[who];
  const {armL = 10, armR = -10, walk = null, mood = 'neutral', look = 0, bob = 0, pockets = false} = pose;
  const ph = walk === null ? 0 : Math.sin(walk);
  const breathe = Math.sin(fr / 14) * 2;
  const hh = 360 * L.height, bw = 120 * L.wide;
  const hipY = -150, shY = hipY - 170, headY = shY - 78;
  const leg = (side: number) => {
    const a = (walk === null ? side * 4 : side * ph * 26) * Math.PI / 180;
    return <line x1={side * 22} y1={hipY} x2={side * 22 + Math.sin(a) * 150} y2={hipY + Math.cos(a) * 150} stroke={C.skin} strokeWidth={16} strokeLinecap="round" />;
  };
  const arm = (side: number, deg: number) => {
    const swing = walk === null ? 0 : -side * ph * 22;
    const a = (deg + swing) * Math.PI / 180;
    const len = 140;
    return <line x1={side * bw / 2.2} y1={shY + 12} x2={side * bw / 2.2 + Math.sin(a) * len * side} y2={shY + 12 + Math.cos(a) * len} stroke={C.skin} strokeWidth={15} strokeLinecap="round" />;
  };
  const eyeY = headY - 6 + (mood === 'worried' ? 2 : 0);
  const mouth = mood === 'happy' ? 'M-16 22 Q0 36 16 22' : mood === 'worried' ? 'M-14 30 Q0 20 14 30' : mood === 'smug' ? 'M-14 26 Q6 32 16 20' : 'M-12 26 L12 26';
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <g transform={`translate(${x} ${y + bob}) scale(${(flip ? -1 : 1) * s} ${s})`}>
        <ellipse cx={0} cy={4} rx={110} ry={18} fill="rgba(0,0,0,.35)" />
        {leg(-1)}{leg(1)}
        {!pockets && arm(-1, armL)}
        <rect x={-bw / 2} y={shY - 6 + breathe * 0.3} width={bw} height={hipY - shY + 30} rx={bw / 2.4} fill={L.shirt} />
        {pockets && <><line x1={-bw / 2.2} y1={shY + 12} x2={-bw / 2.6} y2={hipY - 10} stroke={C.skin} strokeWidth={15} strokeLinecap="round" /><line x1={bw / 2.2} y1={shY + 12} x2={bw / 2.6} y2={hipY - 10} stroke={C.skin} strokeWidth={15} strokeLinecap="round" /></>}
        {!pockets && arm(1, armR)}
        <g transform={`translate(${look * 6} ${breathe * 0.5})`}>
          <circle cx={0} cy={headY} r={70} fill={C.skin} />
          {who === 'wayne' && <path d={`M-66 ${headY - 8} Q-70 ${headY - 70} 0 ${headY - 74} Q70 ${headY - 70} 66 ${headY - 8} Q50 ${headY - 46} 0 ${headY - 50} Q-50 ${headY - 46} -66 ${headY - 8} Z`} fill={L.hair} />}
          {who === 'jobs' && <path d={`M-72 ${headY + 20} Q-80 ${headY - 76} 0 ${headY - 78} Q80 ${headY - 76} 72 ${headY + 20} Q62 ${headY - 40} 0 ${headY - 46} Q-62 ${headY - 40} -72 ${headY + 20} Z`} fill={L.hair} />}
          {who === 'woz' && <>
            <path d={`M-68 ${headY - 4} Q-70 ${headY - 74} 0 ${headY - 76} Q70 ${headY - 74} 68 ${headY - 4} Q50 ${headY - 50} 0 ${headY - 52} Q-50 ${headY - 50} -68 ${headY - 4} Z`} fill={L.hair} />
            <path d={`M-62 ${headY + 4} Q-60 ${headY + 92} 0 ${headY + 96} Q60 ${headY + 92} 62 ${headY + 4} Q40 ${headY + 40} 0 ${headY + 42} Q-40 ${headY + 40} -62 ${headY + 4} Z`} fill={L.hair} />
          </>}
          <circle cx={-24 + look * 4} cy={eyeY} r={8} fill={C.line} />
          <circle cx={24 + look * 4} cy={eyeY} r={8} fill={C.line} />
          {who === 'wayne' && <g fill="none" stroke={C.line} strokeWidth={5}><circle cx={-24} cy={eyeY} r={20} /><circle cx={24} cy={eyeY} r={20} /><line x1={-4} y1={eyeY} x2={4} y2={eyeY} /></g>}
          {who !== 'woz' && <path d={mouth} transform={`translate(${look * 4} ${headY})`} fill="none" stroke={C.line} strokeWidth={6} strokeLinecap="round" />}
        </g>
      </g>
    </svg>
  );
};

// ---------- props ----------
// A flat red apple (a fruit, not the company logo) with a 10% wedge that can lift out.
export const Fruit: React.FC<{x: number; y: number; r: number; slice?: number; sliceDx?: number; sliceDy?: number; glow?: number}> = ({x, y, r, slice = 0, sliceDx = 0, sliceDy = 0, glow = 0}) => {
  const a0 = -90 * Math.PI / 180, a1 = (-90 + 36) * Math.PI / 180; // 36° = 10%
  const wedge = `M0 0 L${Math.cos(a0) * r} ${Math.sin(a0) * r} A${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r} Z`;
  const rest = `M0 0 L${Math.cos(a1) * r} ${Math.sin(a1) * r} A${r} ${r} 0 1 1 ${Math.cos(a0) * r} ${Math.sin(a0) * r} Z`;
  const mid = (a0 + a1) / 2;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(${x} ${y})`}>
        {glow > 0 && <circle r={r * 1.5} fill={`rgba(242,193,78,${0.18 * glow})`} />}
        <path d={`M-4 ${-r - 6} q-6 -50 22 -70`} stroke="#5A3A22" strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d={`M14 ${-r - 40} q50 -40 90 -10 q-40 30 -90 10 z`} fill="#4E8A3E" />
        <path d={rest} fill={C.red} />
        <path d={`M${-r * 0.55} ${-r * 0.35} q20 -30 50 -40`} stroke="rgba(255,255,255,.35)" strokeWidth={14} fill="none" strokeLinecap="round" />
        <g transform={`translate(${Math.cos(mid) * slice * 60 + sliceDx} ${Math.sin(mid) * slice * 60 + sliceDy})`}>
          <path d={wedge} fill={slice > 0 ? '#FF4A4A' : C.red} stroke={slice > 0 ? C.hi : 'none'} strokeWidth={slice > 0 ? 8 : 0} />
          <path d={wedge} fill="none" stroke="#FBEBD0" strokeWidth={slice > 0 ? 0 : 0} />
        </g>
      </g>
    </svg>
  );
};

// Banknotes: n bills fanned out, a label on top.
export const Bills: React.FC<{x: number; y: number; n?: number; s?: number; at?: number; label?: string}> = ({x, y, n = 3, s = 1, at = 0, label}) => {
  const fr = useCurrentFrame();
  const p = pop(fr, at, 11, 180);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s * p}) rotate(${-6 * p}deg)`, opacity: Math.min(1, p * 2)}}>
      {Array.from({length: n}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: -150 + i * 14, top: -70 - i * 10, width: 300, height: 140, background: C.money, border: `6px solid #4E8F55`, borderRadius: 10, transform: `rotate(${(i - n / 2) * 5}deg)`, boxShadow: '0 10px 0 rgba(0,0,0,.25)'}}>
          <div style={{position: 'absolute', inset: 14, border: '3px solid rgba(0,0,0,.18)', borderRadius: 6}} />
          <div style={{position: 'absolute', left: 120, top: 34, width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,0,0,.14)'}} />
        </div>
      ))}
      {label && <div style={{position: 'absolute', left: 0, top: 80, transform: 'translateX(-50%)', font: `900 110px ${FONT.cap}`, color: '#fff', WebkitTextStroke: '10px #0B0F18', paintOrder: 'stroke', whiteSpace: 'nowrap'}}>{label}</div>}
    </div>
  );
};

// A sheet of paper with typed lines that type on, optional stamp.
export const Paper: React.FC<{x: number; y: number; w?: number; title: string; lines?: string[]; at?: number; typeSpeed?: number; tilt?: number; stamp?: {text: string; at: number; color?: string}; children?: React.ReactNode}> = ({x, y, w = 680, title, lines = [], at = 0, typeSpeed = 1.6, tilt = -2, stamp, children}) => {
  const fr = useCurrentFrame();
  const p = pop(fr, at, 14, 160);
  let budget = Math.max(0, (fr - at - 6) * typeSpeed);
  const typed = (s: string) => { const n = Math.min(s.length, Math.floor(budget)); budget -= s.length; return s.slice(0, Math.max(0, n)); };
  const sp = stamp ? pop(fr, stamp.at, 9, 260) : 0;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `translateY(${(1 - p) * 200}px) rotate(${tilt}deg)`, opacity: Math.min(1, p * 2), background: C.paper, padding: '48px 52px 56px', boxShadow: '0 30px 0 rgba(0,0,0,.3)', borderRadius: 6}}>
      <div style={{font: `700 30px ${FONT.mono}`, color: '#1d1b16', letterSpacing: 2, borderBottom: '4px solid #1d1b16', paddingBottom: 14, minHeight: 36}}>{typed(title)}</div>
      {lines.map((l, i) => <div key={i} style={{font: `500 30px/1.5 ${FONT.mono}`, color: '#3a372f', marginTop: 16, minHeight: 45}}>{typed(l)}</div>)}
      {children}
      {/* drawn reconstructions, not the real paperwork */}
      <div style={{position: 'absolute', right: 20, top: 14, font: `600 16px ${FONT.mono}`, letterSpacing: 2, color: 'rgba(0,0,0,.35)'}}>ILLUSTRATION</div>
      {stamp && fr >= stamp.at && (
        <div style={{position: 'absolute', right: 30, bottom: 40, transform: `rotate(-12deg) scale(${2 - sp})`, opacity: Math.min(1, sp * 2), border: `8px solid ${stamp.color ?? C.red}`, color: stamp.color ?? C.red, padding: '8px 22px', font: `900 64px ${FONT.cap}`, letterSpacing: 2, whiteSpace: 'nowrap'}}>{stamp.text}</div>
      )}
    </div>
  );
};

// A big price tag on a string.
export const Tag: React.FC<{x: number; y: number; text: string; at?: number; flipAt?: number; flipText?: string; color?: string}> = ({x, y, text, at = 0, flipAt, flipText, color = C.hi}) => {
  const fr = useCurrentFrame();
  const p = pop(fr, at, 9, 200);
  const flipped = flipAt !== undefined && fr >= flipAt;
  const fp = flipAt !== undefined ? lin(fr, flipAt - 4, flipAt + 4) : 0;
  const sx = flipAt !== undefined ? Math.abs(Math.cos(fp * Math.PI)) : 1;
  const swing = Math.sin((fr - at) / 7) * 6 * Math.exp(-(fr - at) / 30);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, 0) rotate(${swing}deg) scale(${p})`, transformOrigin: '50% -80px'}}>
      <div style={{position: 'absolute', left: '50%', top: -80, width: 4, height: 80, background: C.grey}} />
      <div style={{transform: `scaleX(${sx})`, background: flipped ? C.red : color, color: flipped ? '#fff' : C.line, font: `900 92px ${FONT.cap}`, padding: '18px 40px', borderRadius: 18, whiteSpace: 'nowrap', boxShadow: '0 14px 0 rgba(0,0,0,.3)'}}>
        {flipped ? flipText : text}
      </div>
    </div>
  );
};

// Two choice buttons, the way story Shorts end.
export const Choice: React.FC<{a: string; b: string; at: number; y?: number}> = ({a, b, at, y = 760}) => {
  const fr = useCurrentFrame();
  const pa = pop(fr, at, 10, 220), pb = pop(fr, at + 5, 10, 220);
  const btn = (t: string, bg: string, p: number) => (
    <div style={{transform: `scale(${p})`, background: bg, color: '#fff', font: `900 70px ${FONT.cap}`, padding: '26px 64px', borderRadius: 999, boxShadow: '0 12px 0 rgba(0,0,0,.35)'}}>{t}</div>
  );
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', gap: 50}}>
      {btn(a, '#3C7BE0', pa)}{btn(b, C.red, pb)}
    </div>
  );
};

// ---------- stakes meter: the thing that keeps ticking in the corner ----------
export type MeterState = {from: number; label: string; value: string | ((fr: number) => string); color?: string};
export const Meter: React.FC<{states: MeterState[]}> = ({states}) => {
  const fr = useCurrentFrame();
  let cur = states[0];
  for (const s of states) if (fr >= s.from) cur = s;
  const since = fr - cur.from;
  const p = cur.from === 0 ? 1 : lin(since, 0, 6);
  const v = typeof cur.value === 'function' ? cur.value(fr) : cur.value;
  const blink = Math.floor(fr / 15) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: 64, top: 150}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, font: `700 30px ${FONT.mono}`, color: 'rgba(255,255,255,.7)', letterSpacing: 2}}>
        <span style={{width: 16, height: 16, borderRadius: '50%', background: C.red, opacity: blink ? 1 : 0.35}} />
        <span style={{opacity: p}}>{cur.label}</span>
      </div>
      <div style={{font: `900 ${Math.min(92, Math.floor(1300 / v.length))}px/1.05 ${FONT.cap}`, color: cur.color ?? '#fff', marginTop: 6, fontVariantNumeric: 'tabular-nums', transform: `translateY(${(1 - ease(p)) * 12}px)`, opacity: 0.4 + 0.6 * p}}>{v}</div>
    </div>
  );
};

// ---------- captions ----------
// 1 to 3 words at a time, from the voice's word timings. Numbers spoken as words show as digits;
// money, numbers and names light up in the highlight colour.
export type Word = {w: string; start: number; end: number; s: number};
type Chunk = {text: string[]; hi: boolean[]; start: number; end: number};
export const buildChunks = (words: Word[], replace: [string, string][], highlight: RegExp, maxWords = 3, maxChars = 12): Chunk[] => {
  // merge spoken phrases into their written form ("eight hundred dollars." -> "$800.")
  const toks: {w: string; start: number; end: number; s: number}[] = [];
  const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9-]/g, '');
  for (let i = 0; i < words.length;) {
    let hit = false;
    for (const [from, to] of replace) {
      const parts = from.split(' ');
      const seg = words.slice(i, i + parts.length);
      if (seg.length === parts.length && seg.every((w, j) => clean(w.w) === parts[j])) {
        const trail = seg[seg.length - 1].w.match(/[.,?!]+$/)?.[0] ?? '';
        toks.push({w: to + trail, start: seg[0].start, end: seg[seg.length - 1].end, s: seg[0].s});
        i += parts.length; hit = true; break;
      }
    }
    if (!hit) { toks.push(words[i]); i++; }
  }
  const out: Chunk[] = [];
  let cur: typeof toks = [];
  const flush = () => { if (cur.length) out.push({text: cur.map((t) => t.w), hi: cur.map((t) => highlight.test(t.w.replace(/[.,?!]+$/, ''))), start: cur[0].start, end: cur[cur.length - 1].end}); cur = []; };
  for (const t of toks) {
    const len = cur.reduce((n, c) => n + c.w.length + 1, 0) + t.w.length;
    if (cur.length && (cur.length >= maxWords || len > maxChars || cur[0].s !== t.s)) flush();
    cur.push(t);
    if (/[.,?!]$/.test(t.w)) flush();
  }
  flush();
  // each chunk stays up until the next one starts (no flicker between words)
  for (let i = 0; i < out.length - 1; i++) out[i].end = Math.max(out[i].end, Math.min(out[i + 1].start, out[i].end + 0.6));
  return out;
};
export const Captions: React.FC<{chunks: Chunk[]; offset?: number; y?: number}> = ({chunks, offset = 0, y = 1250}) => {
  const fr = useCurrentFrame();
  const t = fr / FPS - offset;
  const c = chunks.find((k) => t >= k.start - 0.04 && t < k.end + 0.02);
  if (!c) return null;
  const since = (t - c.start + 0.04) * FPS;
  const s = 0.82 + 0.18 * Math.min(1, pop(since, 0, 9, 320));
  return (
    <div style={{position: 'absolute', left: 70, right: 170, top: y, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 24px', transform: `scale(${s})`}}>
      {c.text.map((w, i) => (
        <span key={i} style={{font: `900 94px/1.1 ${FONT.cap}`, textTransform: 'uppercase', color: c.hi[i] ? C.hi : '#fff', WebkitTextStroke: '14px #0B0F18', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,.45)', whiteSpace: 'nowrap'}}>{w.replace(/[.,]$/, '')}</span>
      ))}
    </div>
  );
};

// Soft scene entrance: a quick settle, used by every scene.
export const Enter: React.FC<{children: React.ReactNode; from?: 'zoom' | 'left' | 'right' | 'up'; still?: boolean}> = ({children, from = 'zoom', still}) => {
  const fr = useCurrentFrame();
  if (still) return <AbsoluteFill>{children}</AbsoluteFill>; // the first frame is the feed cover and the loop point: no fade
  const p = ease(lin(fr, 0, 8));
  const tr = from === 'zoom' ? `scale(${1.06 - 0.06 * p})` : from === 'left' ? `translateX(${(1 - p) * -120}px)` : from === 'right' ? `translateX(${(1 - p) * 120}px)` : `translateY(${(1 - p) * 120}px)`;
  return <AbsoluteFill style={{opacity: lin(fr, 0, 5), transform: tr}}>{children}</AbsoluteFill>;
};
