import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, Cursor, DISPLAY, Grain, MONO, Pill, SERIF, coinFace, useFontsReady} from './shared';

// Variant A, "Orbit": after the X Ticker launch film. Assets orbit a USDT coin; the cursor drags them in.
const CX = 540, CY = 850;
const RINGS = [180, 310, 440, 570];
const CHIPS = [
  {t: 'AAPL', k: 'US stock', r: 310, a: -150},
  {t: 'TSLA', k: 'US stock', r: 440, a: -38},
  {t: 'GOLD', k: 'Metal', r: 440, a: 158},
  {t: 'ETFs', k: 'Index funds', r: 440, a: 64},
  {t: 'SILVER', k: 'Metal', r: 310, a: 112},
  {t: 'NVDA', k: 'US stock', r: 232, a: 18, drag: true},
];

export const AltA: React.FC = () => {
  useFontsReady();
  const f = useCurrentFrame();
  const spin = f * 0.08;
  const pos = (r: number, a: number) => ({x: CX + r * Math.cos(((a + spin) * Math.PI) / 180), y: CY + r * Math.sin(((a + spin) * Math.PI) / 180)});
  const nv = pos(232, 18);
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 70% at 50% 58%, #F7F6F1 0%, ${C.paper} 60%, #E6E3DA 100%)`, overflow: 'hidden'}}>
      <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
        {RINGS.map((r, i) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke={C.ink} strokeOpacity={0.1} strokeWidth={1.5} strokeDasharray={i === 2 ? '2 10' : undefined} />
        ))}
        {CHIPS.map((c) => {const p = pos(c.r, c.a); return <line key={c.t} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={c.drag ? C.green : C.ink} strokeOpacity={c.drag ? 1 : 0.14} strokeWidth={c.drag ? 4 : 1.5} />;})}
        {new Array(14).fill(0).map((_, i) => {const p = pos(RINGS[i % 4], i * 47 + 11); return <circle key={i} cx={p.x} cy={p.y} r={5} fill={C.ink} fillOpacity={0.22} />;})}
        <path d="M -20 1180 C 120 1150 180 1210 300 1160 S 470 1080 560 1120 S 760 1010 860 1040 S 1010 960 1100 930" fill="none" stroke={C.green} strokeWidth={4} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: CX - 120, top: CY - 120, width: 240, height: 240, borderRadius: '50%', background: coinFace,
        boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.4), inset 0 -8px 16px rgba(0,0,0,0.18), 0 40px 70px rgba(11,14,17,0.25), 0 0 0 10px rgba(126,194,90,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 54, color: C.ink}}>USDT</div>
      {CHIPS.map((c) => {
        const p = pos(c.r, c.a);
        return (
          <div key={c.t} style={{
            position: 'absolute', left: p.x, top: p.y, transform: `translate(-50%, -50%) scale(${c.drag ? 1.12 : 1})`,
            background: '#FFFFFF', borderRadius: 999, padding: '14px 26px 14px 16px', display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: c.drag ? `0 0 0 4px ${C.green}, 0 24px 44px rgba(11,14,17,0.22)` : '0 12px 30px rgba(11,14,17,0.12), inset 0 0 0 1px rgba(11,14,17,0.06)',
          }}>
            <div style={{width: 40, height: 40, borderRadius: '50%', background: C.ink, color: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 20}}>{c.t[0]}</div>
            <div>
              <div style={{fontFamily: DISPLAY, fontSize: 30, color: C.ink, lineHeight: 1}}>{c.t}</div>
              <div style={{fontFamily: MONO, fontSize: 17, color: C.grey, marginTop: 5, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{c.k}</div>
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, width: 1080, top: 118, textAlign: 'center', fontFamily: DISPLAY, fontSize: 104, color: C.ink, lineHeight: 1}}>Trade the world</div>
      <div style={{position: 'absolute', left: 250, top: 236, fontFamily: SERIF, fontStyle: 'italic', fontSize: 118, color: C.ink, lineHeight: 1.05}}>with</div>
      <Pill x={500} y={246} h={112} fs={78}>USDT</Pill>
      <Cursor x={nv.x + 70} y={nv.y + 18} />
      <Grain opacity={0.18} />
    </AbsoluteFill>
  );
};
