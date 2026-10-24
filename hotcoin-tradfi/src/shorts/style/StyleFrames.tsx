// Style frames for the journey redo: a character lineup, then three shots that size the camera to the money
// (close-up for a pizza, medium for a car, wide for a house) and change the season as the years pass.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from '../kit';
import {GUY, Guy, GuyHead} from './Cutout';

// the cutout guy lives in a 400 x 500 box; x: centre, y: feet, h: height in px
const GFig: React.FC<{x: number; y: number; h: number; children: React.ReactNode}> = ({x, y, h, children}) => (
  <div style={{position: 'absolute', left: x - h * 0.4, top: y - h, width: h * 0.8, height: h}}>
    <div style={{transform: `scale(${h / 500})`, transformOrigin: '0 0'}}>{children}</div>
  </div>
);

const HUD: React.FC<{value: string; sub: string; gold?: boolean}> = ({value, sub, gold}) => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 520, background: 'linear-gradient(rgba(8,10,18,.6), rgba(8,10,18,0))'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 112, textAlign: 'center', font: `700 26px ${FONT.mono}`, letterSpacing: 4, color: 'rgba(255,255,255,.6)'}}>WHAT IF · 02</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 185, textAlign: 'center'}}>
      <div style={{font: `700 30px ${FONT.mono}`, letterSpacing: 6, color: 'rgba(255,255,255,.85)'}}>YOUR $100 IN APPLE</div>
      <div style={{font: `900 136px/1.1 ${FONT.cap}`, color: gold ? C.hi : '#fff', WebkitTextStroke: '12px #0B0F18', paintOrder: 'stroke fill', marginTop: 4}}>{value}</div>
      <div style={{font: `700 28px ${FONT.mono}`, letterSpacing: 4, color: 'rgba(255,255,255,.85)', marginTop: 4}}>{sub}</div>
    </div>
  </>
);
const Cap: React.FC<{words: [string, boolean][]}> = ({words}) => (
  <div style={{position: 'absolute', left: 70, right: 170, top: 1330, display: 'flex', justifyContent: 'center', gap: '0 24px', flexWrap: 'wrap'}}>
    {words.map(([w, hi], i) => <span key={i} style={{font: `900 94px/1.1 ${FONT.cap}`, color: hi ? C.hi : '#fff', WebkitTextStroke: '14px #0B0F18', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,.45)'}}>{w}</span>)}
  </div>
);
const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// ---------- lineup: one guy, three seasons, and the talking head ----------
export const StyleLineup: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(80% 60% at 50% 55%, #2C3550, #141824)'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', font: `900 80px ${FONT.cap}`, color: '#fff'}}>MEET THE GUY</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', font: `600 34px ${FONT.mono}`, color: 'rgba(255,255,255,.6)'}}>his head flaps when he talks</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1150, height: 8, background: 'rgba(255,255,255,.08)'}} />
    <GFig x={190} y={1150} h={400}><Guy o={GUY.autumn} mood="smug" /></GFig>
    <GFig x={540} y={1150} h={400}><Guy o={GUY.winter} jaw={0.75} mood="shock" /></GFig>
    <GFig x={880} y={1150} h={400}><Guy o={GUY.spring} arm="wave" wave={1} /></GFig>
    {[['AUTUMN', 'smug', 190], ['WINTER', 'talking', 540], ['SPRING', 'waving', 880]].map(([n, d, x]) => (
      <div key={n as string} style={{position: 'absolute', left: (x as number) - 170, width: 340, top: 1190, textAlign: 'center'}}>
        <div style={{font: `900 40px ${FONT.cap}`, color: '#fff'}}>{n}</div>
        <div style={{font: `600 26px ${FONT.mono}`, color: 'rgba(255,255,255,.6)', marginTop: 6}}>{d}</div>
      </div>
    ))}
  </AbsoluteFill>
);

// ---------- 1 · close-up: a pizza, autumn 1985 ----------
const Leaf: React.FC<{x: number; y: number; r: number; c: string; s?: number}> = ({x, y, r, c, s = 1}) => (
  <svg width={80 * s} height={80 * s} viewBox="0 0 80 80" style={{position: 'absolute', left: x, top: y, transform: `rotate(${r}deg)`}}>
    <path d="M40 4 Q70 20 62 50 Q52 74 40 76 Q28 74 18 50 Q10 20 40 4 Z" fill={c} /><path d="M40 10 L40 74 M40 30 L54 22 M40 44 L56 38 M40 30 L26 22 M40 44 L24 38" stroke="rgba(0,0,0,.2)" strokeWidth={2.5} fill="none" />
  </svg>
);
export const StyleClose: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(#3B2F4A, #C97B58 70%, #E0A070)'}}>
    {/* soft city lights behind */}
    {Array.from({length: 26}, (_, i) => <div key={i} style={{position: 'absolute', left: rnd(i) * 1080 - 60, top: 300 + rnd(i + 40) * 700, width: 60 + rnd(i + 9) * 120, height: 60 + rnd(i + 9) * 120, borderRadius: '50%', background: ['#F2C14E', '#E3262F', '#F7E0B0', '#E0A84E'][i % 4], opacity: 0.25 + rnd(i + 3) * 0.3, filter: 'blur(14px)'}} />)}
    {/* his head, big, mouth wide open at the pizza */}
    <svg viewBox="0 0 400 500" width={520} height={650} style={{position: 'absolute', left: 280, top: 452, overflow: 'visible'}}>
      <GuyHead o={GUY.autumn} jaw={0.6} mood="shock" look={-0.5} />
    </svg>
    {/* the pizza box, open, held up close */}
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, transform: 'translateY(70px)'}}>
      {/* lid folded back, seen edge-on */}
      <path d="M130 762 L950 762 L930 722 L150 722 Z" fill="#B3854A" />
      <path d="M110 760 L970 760 L1010 1180 L70 1180 Z" fill="#E0B070" /><path d="M70 1180 L1010 1180 L1000 1220 L80 1220 Z" fill="#B3854A" />
      <ellipse cx={540} cy={970} rx={400} ry={170} fill="#D88A3C" /><ellipse cx={540} cy={962} rx={360} ry={148} fill="#F2C14E" />
      <ellipse cx={540} cy={962} rx={340} ry={136} fill="#F7D774" />
      {[[400, 920], [560, 890], [700, 940], [470, 1020], [640, 1030], [760, 1000], [330, 990], [520, 960]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y} rx={44} ry={22} fill="#B8322A" /><ellipse cx={x - 8} cy={y - 6} rx={14} ry={6} fill="rgba(255,255,255,.25)" /></g>)}
      {[[450, 960], [610, 960], [380, 940], [690, 980]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q12 -14 26 0 q-12 10 -26 0`} fill="#4E8A3E" />)}
      <path d="M540 962 L880 962 M540 962 L700 1096 M540 962 L380 1096 M540 962 L200 962 M540 962 L640 826" stroke="rgba(170,110,40,.45)" strokeWidth={4} />
      {/* a slice lifting off with a cheese string */}
      <path d="M760 1000 Q800 940 880 960 L900 980 Z" fill="none" />
      <path d="M560 1000 Q600 1060 620 1120" stroke="#F7D774" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.9} />
      {/* mittens holding the box */}
      <path d="M0 1060 L130 1080 L130 1170 L0 1190 Z" fill={GUY.autumn.top} />
      <circle cx={130} cy={1110} r={52} fill={GUY.autumn.mitts} />
      <path d="M1080 1060 L950 1080 L950 1170 L1080 1190 Z" fill={GUY.autumn.top} />
      <circle cx={950} cy={1110} r={52} fill={GUY.autumn.mitts} />
    </svg>
    {/* autumn leaves falling */}
    {Array.from({length: 16}, (_, i) => <Leaf key={i} x={rnd(i + 70) * 1040} y={rnd(i + 90) * 1500} r={rnd(i) * 360} c={['#E0742C', '#C94A2A', '#F2B13A', '#A8462A'][i % 4]} s={0.6 + rnd(i + 5) * 0.8} />)}
    <HUD value="$72" sub="AUTUMN 1985 · 4 YEARS IN" />
    <Cap words={[['PIZZA', true], ['NIGHT', false]]} />
  </AbsoluteFill>
);

// ---------- 2 · medium: a used car, winter night 2008 ----------
export const StyleMedium: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(#0C1226, #1E2C52 60%, #2C3E6A)'}}>
    {Array.from({length: 8}, (_, i) => { const w = 150 + rnd(i) * 120, h = 300 + rnd(i + 3) * 400, x = i * 150 - 60; return (
      <div key={i} style={{position: 'absolute', left: x, top: 1180 - h, width: w, height: h, background: '#18223F', filter: 'blur(1.5px)'}}>
        {Array.from({length: Math.floor(h / 70) * 2}, (_, k) => <div key={k} style={{position: 'absolute', left: 22 + (k % 2) * (w / 2), top: 30 + Math.floor(k / 2) * 70, width: w / 2 - 44, height: 34, background: rnd(i * 9 + k) > 0.4 ? 'rgba(242,193,78,.55)' : 'rgba(0,0,0,.3)'}} />)}
        <div style={{position: 'absolute', left: 0, right: 0, top: -14, height: 18, background: '#E8EEF8', borderRadius: 8}} />
      </div>
    ); })}
    {/* street lamp */}
    <div style={{position: 'absolute', left: 120, top: 520, width: 16, height: 680, background: '#2A3048'}} />
    <div style={{position: 'absolute', left: 90, top: 500, width: 140, height: 40, borderRadius: 20, background: '#3A4260'}} />
    <div style={{position: 'absolute', left: -160, top: 520, width: 700, height: 700, background: 'radial-gradient(closest-side, rgba(255,214,140,.38), transparent)'}} />
    {/* snowy ground */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 1180, bottom: 0, background: 'linear-gradient(#E8EEF8, #B9C6DE)'}} />
    <div style={{position: 'absolute', left: -40, top: 1150, width: 420, height: 90, borderRadius: '50%', background: '#F4F8FF'}} />
    {/* the used car */}
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <g transform="translate(700 1190)">
        <ellipse cx={0} cy={6} rx={380} ry={26} fill="rgba(20,30,60,.35)" />
        <path d="M-360 -70 L-344 -160 L-200 -182 L-120 -330 L130 -330 L230 -182 L350 -152 L366 -70 Z" fill="#B8A57E" />
        <path d="M-100 -312 L-180 -186 L-40 -186 L-10 -312 Z M10 -312 L-20 -186 L210 -186 L120 -312 Z" fill="#7FA0C8" stroke="#E8EEF8" strokeWidth={4} />
        <path d="M-100 -312 L-60 -312 L-150 -190 L-180 -186 Z" fill="rgba(255,255,255,.35)" />
        <path d="M-330 -120 L350 -120" stroke="rgba(0,0,0,.15)" strokeWidth={6} />
        <circle cx={-250} cy={-110} r={16} fill="#8A5A30" opacity={0.7} /><circle cx={120} cy={-90} r={10} fill="#8A5A30" opacity={0.7} /><path d="M40 -150 l40 10" stroke="#8A5A30" strokeWidth={6} opacity={0.6} />
        <rect x={20} y={-160} width={44} height={10} rx={4} fill="#4A3E2C" />
        <path d="M-120 -330 Q-100 -360 0 -358 Q120 -360 132 -330 Z" fill="#F4F8FF" />
        <path d="M230 -182 Q290 -196 350 -152 L352 -160 Q290 -210 226 -192 Z" fill="#F4F8FF" />
        <rect x={350} y={-140} width={22} height={30} rx={6} fill="#FFE7A0" /><path d="M372 -126 L560 -170 L560 -80 Z" fill="rgba(255,231,160,.22)" />
        <rect x={-366} y={-140} width={16} height={26} rx={4} fill={C.red} />
        {[-220, 230].map((x) => <g key={x} transform={`translate(${x} -60)`}><circle r={66} fill="#15171C" /><circle r={36} fill="#8A93A6" /><circle r={12} fill="#3A3E48" /></g>)}
      </g>
    </svg>
    {/* him, bundled up, reaching for the door */}
    <GFig x={210} y={1196} h={430}><Guy o={GUY.winter} arm="reach" jaw={0.45} mood="happy" look={1} /></GFig>
    <div style={{position: 'absolute', left: 330, top: 800, width: 70, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,.5)', filter: 'blur(4px)'}} />
    {/* snow */}
    {Array.from({length: 90}, (_, i) => <div key={i} style={{position: 'absolute', left: rnd(i + 200) * 1080, top: rnd(i + 300) * 1500, width: 6 + rnd(i) * 10, height: 6 + rnd(i) * 10, borderRadius: '50%', background: '#fff', opacity: 0.5 + rnd(i + 7) * 0.5}} />)}
    <HUD value="$6,862" sub="WINTER 2008 · 27 YEARS IN" gold />
    <Cap words={[['A', false], ['USED', false], ['CAR', true]]} />
  </AbsoluteFill>
);

// ---------- 3 · wide: the house, spring today ----------
export const StyleWide: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(#7FC0EA, #CFE7F2 55%, #F7E7C6 75%)'}}>
    <div style={{position: 'absolute', left: 700, top: 520, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, #FFF4C8, rgba(255,244,200,0) 70%)'}} />
    {[[80, 470, 260], [560, 600, 200], [300, 690, 160]].map(([x, y, w], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: w * 0.34, borderRadius: 60, background: 'rgba(255,255,255,.85)'}} />)}
    {/* far city */}
    {Array.from({length: 18}, (_, i) => { const h = 80 + rnd(i) * 200, w = 40 + rnd(i + 4) * 50; return <div key={i} style={{position: 'absolute', left: 30 + i * 58, top: 900 - h, width: w, height: h, background: '#A9C3D9'}} />; })}
    {/* hills */}
    <div style={{position: 'absolute', left: -300, top: 860, width: 1100, height: 600, borderRadius: '50%', background: '#8CC66A'}} />
    <div style={{position: 'absolute', left: 300, top: 900, width: 1200, height: 700, borderRadius: '50%', background: '#7AB85A'}} />
    <div style={{position: 'absolute', left: -200, top: 1060, width: 1500, height: 1000, borderRadius: '50%', background: '#69A84D'}} />
    {/* the house */}
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <g transform="translate(560 1080)">
        <ellipse cx={0} cy={8} rx={300} ry={26} fill="rgba(30,60,20,.3)" />
        <rect x={-230} y={-240} width={460} height={250} fill="#F4EFE4" />
        <path d="M-270 -230 L0 -420 L270 -230 Z" fill="#8E3B2E" /><path d="M-270 -230 L0 -420 L0 -400 L-240 -230 Z" fill="rgba(255,255,255,.12)" />
        <rect x={140} y={-380} width={44} height={100} fill="#6B4A2E" />
        <rect x={-40} y={-130} width={80} height={140} fill={C.red} /><circle cx={24} cy={-60} r={6} fill={C.hi} />
        <rect x={-190} y={-190} width={100} height={80} fill="#9CC3F0" stroke="#fff" strokeWidth={8} /><rect x={90} y={-190} width={100} height={80} fill="#9CC3F0" stroke="#fff" strokeWidth={8} />
        <path d="M-190 -150 L-90 -150 M-140 -190 L-140 -110 M90 -150 L190 -150 M140 -190 L140 -110" stroke="#fff" strokeWidth={5} />
        <path d="M-60 10 L60 10 L120 160 L-120 160 Z" fill="#D9CFB8" />
        {Array.from({length: 16}, (_, i) => <rect key={i} x={-360 + i * 46} y={-40} width={14} height={60} rx={4} fill="#fff" />)}
        <rect x={-370} y={-20} width={740} height={10} fill="#fff" />
        <g transform="translate(260 -30)"><rect x={0} y={0} width={8} height={70} fill="#5A3A22" /><rect x={-40} y={-50} width={90} height={56} fill={C.red} /><text x={5} y={-12} textAnchor="middle" fill="#fff" style={{font: `900 30px ${FONT.cap}`}}>SOLD</text></g>
      </g>
      {/* blossom tree */}
      <g transform="translate(170 1120)">
        <path d="M0 0 Q-10 -140 20 -260 M14 -200 Q60 -250 110 -260 M10 -160 Q-40 -200 -80 -220" stroke="#6B4A2E" strokeWidth={26} fill="none" strokeLinecap="round" />
        {Array.from({length: 22}, (_, i) => <circle key={i} cx={-120 + rnd(i) * 260} cy={-420 + rnd(i + 11) * 220} r={40 + rnd(i + 5) * 40} fill={['#F4B6C8', '#F7C9D6', '#EE9DB4'][i % 3]} />)}
      </g>
    </svg>
    {/* him, tiny, waving at his own front door */}
    <GFig x={630} y={1092} h={150}><Guy o={GUY.spring} arm="wave" wave={1} /></GFig>
    {Array.from({length: 24}, (_, i) => <div key={i} style={{position: 'absolute', left: rnd(i + 500) * 1080, top: 400 + rnd(i + 600) * 1100, width: 14, height: 10, borderRadius: '50% 50% 50% 0', background: '#F4B6C8', transform: `rotate(${rnd(i) * 360}deg)`}} />)}
    <HUD value="$354,047" sub="SPRING 2026 · 45 YEARS IN" gold />
    <Cap words={[['FROM', false], ['$100', true]]} />
  </AbsoluteFill>
);

// ---------- motion test: walks in, stops, talks ----------
export const StyleTalk: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const walkEnd = 1.4;
  const x = interpolate(t, [0, walkEnd], [-150, 420], {extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const walking = t < walkEnd;
  // fake syllables: open-close bursts with gaps, the real video drives this from the voiceover
  const talk = t > walkEnd + 0.2 ? Math.max(0, Math.sin(t * 22)) * (0.55 + 0.45 * Math.max(0, Math.sin(t * 3.1))) * (Math.sin(t * 1.7) > -0.6 ? 1 : 0) : 0;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(#0C1226, #1E2C52 60%, #2C3E6A)'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1180, bottom: 0, background: 'linear-gradient(#E8EEF8, #B9C6DE)'}} />
      <GFig x={x} y={1196} h={560}><Guy o={GUY.winter} step={walking ? t * 12 : undefined} jaw={talk} mood={t > 2.6 ? 'shock' : 'happy'} /></GFig>
      {Array.from({length: 60}, (_, i) => <div key={i} style={{position: 'absolute', left: rnd(i + 200) * 1080 + Math.sin(t + i) * 20, top: ((rnd(i + 300) * 1900 + t * (60 + rnd(i) * 80)) % 1900), width: 6 + rnd(i) * 10, height: 6 + rnd(i) * 10, borderRadius: '50%', background: '#fff', opacity: 0.7}} />)}
      <HUD value="$6,862" sub="WINTER 2008 · 27 YEARS IN" gold />
      <Cap words={[['A', false], ['USED', false], ['CAR', true]]} />
    </AbsoluteFill>
  );
};
