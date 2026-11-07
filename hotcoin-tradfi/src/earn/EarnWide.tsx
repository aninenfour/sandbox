// Hotcoin Earn Rewards Boost, 16:9 split-screen cut: copy panel on the left, PS2-style 3D scene on the right
// (camera view offset pushes the scene right); the final frame merges into one full-width centred shot.
// Same campaign facts as EarnPS2.tsx. Music: public/earn/beat.wav (scripts/make-earn-ps2-beat.py, ET mirrored).
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {INK, LIME, MONO, SANS, useFonts} from '../promo4/kit';
import {ET, EarnScene} from './EarnScene';

export const EARNW_DURATION = ET.end;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ip = (f: number, a: number[], b: number[]) => interpolate(f, a, b, cl);
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const WHITE = '#EEF2EA';
const MERGE = ET.rain + 44; // split → full frame
const PANEL = 760;

// shift the rendered view so the subject sits in the right area; ease back to centre for the merged ending
const Offset: React.FC<{m: number}> = ({m}) => {
  const {camera, size} = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  const shift = -(PANEL / 2 + 70) * (1 - m) * (size.width / 1920);
  cam.setViewOffset(size.width, size.height, shift, 0, size.width, size.height);
  cam.updateProjectionMatrix();
  return null;
};

const Block: React.FC<{f: number; a: number; b: number; k: string; h: React.ReactNode; s?: React.ReactNode; big?: boolean}> = ({f, a, b, k, h, s, big}) => {
  const o = ip(f, [a, a + 14], [0, 1]) * ip(f, [b - 12, b], [1, 0]);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 96, width: PANEL - 150, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: o, transform: `translateX(${(1 - o) * -30}px)`}}>
      <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: LIME, textShadow: `0 0 18px ${LIME}`}}>{k}</div>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: big ? 130 : 84, letterSpacing: big ? -5 : -3, lineHeight: 1, color: WHITE, marginTop: 20}}>{h}</div>
      {s && <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 32, lineHeight: 1.35, color: 'rgba(238,242,234,.72)', marginTop: 26}}>{s}</div>}
    </div>
  );
};

const Menu: React.FC<{f: number}> = ({f}) => {
  const o = ip(f, [ET.menu + 20, ET.menu + 34], [0, 1]) * ip(f, [ET.item - 6, ET.item + 4], [1, 0]);
  if (o <= 0) return null;
  const items = ['SPOT', 'FUTURES', 'HOTCOIN EARN', 'WALLET'];
  const sel = f < ET.menu + 44 ? 0 : f < ET.menu + 56 ? 1 : 2;
  const flash = f >= ET.click && f < ET.click + 10 ? (Math.floor((f - ET.click) / 2) % 2 ? 1 : 0.4) : 1;
  return (
    <div style={{position: 'absolute', left: 790, top: 330, width: 360, opacity: o, transform: `translateX(${(1 - o) * 60}px)`, fontFamily: SANS}}>
      <div style={{border: '1.5px solid rgba(184,242,106,.45)', borderRadius: 18, background: 'linear-gradient(180deg, rgba(20,32,18,.8), rgba(5,8,6,.85))', padding: '16px 0', boxShadow: '0 0 40px rgba(184,242,106,.15)'}}>
        <div style={{fontFamily: MONO, fontSize: 17, letterSpacing: 4, color: 'rgba(238,242,234,.5)', padding: '0 24px 10px'}}>SELECT</div>
        {items.map((it, i) => (
          <div key={it} style={{position: 'relative', padding: '14px 24px', fontSize: 30, fontWeight: i === sel ? 700 : 500, letterSpacing: 2, color: i === sel ? INK : 'rgba(238,242,234,.8)'}}>
            {i === sel && <div style={{position: 'absolute', inset: '4px 12px', borderRadius: 12, background: LIME, opacity: flash, boxShadow: `0 0 30px ${LIME}`}} />}
            <span style={{position: 'relative'}}>{i === sel ? '▸ ' : '  '}{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Bar: React.FC<{f: number}> = ({f}) => {
  const o = ip(f, [ET.grow + 40, ET.grow + 54], [0, 1]) * ip(f, [ET.rain - 8, ET.rain + 4], [1, 0]);
  if (o <= 0) return null;
  const p = ip(f, [ET.grow + 50, ET.rain - 20], [0, 1]);
  return (
    <div style={{position: 'absolute', left: 96, width: PANEL - 150, bottom: 150, opacity: o}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 19, letterSpacing: 3, color: 'rgba(238,242,234,.65)', marginBottom: 12}}>
        <span>MILESTONES</span><span style={{color: LIME}}>UP TO 1,000 USDT</span></div>
      <div style={{height: 18, borderRadius: 99, border: '1.5px solid rgba(184,242,106,.5)', padding: 3}}>
        <div style={{height: '100%', width: `${p * 100}%`, borderRadius: 99, background: `linear-gradient(90deg, #7EC25A, ${LIME})`, boxShadow: `0 0 20px ${LIME}`}} /></div>
    </div>
  );
};

const End: React.FC<{f: number}> = ({f}) => {
  const o = ip(f, [MERGE + 10, MERGE + 30], [0, 1]);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(3,6,5,0) 35%, rgba(3,6,5,.92) 80%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily: SANS}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28}}>
          <Img src={staticFile('brand/logo-official-white.png')} style={{height: 50}} />
          <div style={{width: 2, height: 44, background: 'rgba(238,242,234,.35)'}} />
          <div style={{fontWeight: 800, fontSize: 56, letterSpacing: -1.5, color: WHITE}}>Earn Rewards Boost</div>
        </div>
        <div style={{fontWeight: 600, fontSize: 32, color: 'rgba(238,242,234,.78)', marginTop: 18}}>
          <span style={{color: LIME}}>20 USDT</span> voucher + fixed interest + up to <span style={{color: LIME}}>1,000 USDT</span> in milestone rewards</div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, marginTop: 26}}>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, background: LIME, color: INK, padding: '16px 32px', borderRadius: 999, boxShadow: '0 0 40px rgba(184,242,106,.5)'}}>PRESS START · hotcoin.com</div>
          <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 1.5, color: 'rgba(238,242,234,.55)', textAlign: 'left', lineHeight: 1.6}}>ENDS NOV 16, 2026 · 12:00 UTC+8<br />LIMITED REWARDS · FIRST COME, FIRST SERVED</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const EarnWide: React.FC = () => {
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  useFonts();
  const m = ease(ip(f, [MERGE - 16, MERGE + 16], [0, 1]));
  const zz = f < ET.menu ? f : -1;
  return (
    <AbsoluteFill style={{background: '#030605'}}>
      <ThreeCanvas width={W} height={H} camera={{fov: 40, position: [0, 1.2, 6], near: 0.1, far: 80}} gl={{antialias: true, preserveDrawingBuffer: true}}>
        <EarnScene />
        <Offset m={m} />
      </ThreeCanvas>
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0px, rgba(0,0,0,.18) 1px, transparent 1px, transparent 3px)', mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 75% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 100%)'}} />
      {/* left copy panel: solid ink with a soft edge into the scene and a thin lime divider */}
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: PANEL + 120, transform: `translateX(${-m * (PANEL + 140)}px)`,
        background: `linear-gradient(90deg, #030605 0, #030605 ${PANEL - 40}px, rgba(3,6,5,0) ${PANEL + 120}px)`}}>
        <div style={{position: 'absolute', left: PANEL - 20, top: 120, bottom: 120, width: 1.5, background: 'linear-gradient(180deg, rgba(184,242,106,0), rgba(184,242,106,.45), rgba(184,242,106,0))'}} />
        <Img src={staticFile('brand/logo-official-white.png')} style={{position: 'absolute', left: 96, top: 80, height: 40}} />
        <div style={{position: 'absolute', left: 96, bottom: 80, fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: LIME, border: '1.5px solid rgba(184,242,106,.5)', borderRadius: 99, padding: '8px 16px'}}>EARN REWARDS BOOST · ENDS NOV 16</div>
        <Block f={f} a={8} b={74} k="QUICK QUESTION" h={<>Is your crypto just sitting there,<br /><span style={{color: 'rgba(238,242,234,.55)'}}>idle?</span></>} />
        <Block f={f} a={78} b={ET.menu + 8} k="HONESTLY" h={<span style={{color: LIME}}>SO<br />BORING.</span>} big />
        <Block f={f} a={ET.menu + 12} b={ET.item} k="PUT IT TO WORK" h={<>Hotcoin<br /><span style={{color: LIME}}>Earn.</span></>} s="Subscribe to fixed-term Earn for the first time with 500 USDT or more." />
        <Block f={f} a={ET.land - 6} b={ET.grow + 20} k="ITEM GET" h={<><span style={{color: LIME}}>+20 USDT</span><br />voucher.</>} s="Futures Trial Funds. Trade futures with it, and the profit is yours." />
        <Block f={f} a={ET.grow + 24} b={ET.rain} k="ON TOP OF THAT" h={<>Fixed interest,<br /><span style={{color: LIME}}>every day.</span></>} s={<>Hit milestones for up to <b style={{color: WHITE}}>1,000 USDT</b> in Earn Trial Funds. Both rewards stack.</>} />
        <Block f={f} a={ET.rain + 4} b={MERGE + 4} k="RESULT" h={<>More<br /><span style={{color: LIME}}>money.</span></>} big />
        <Bar f={f} />
      </div>
      {zz >= 0 && [0, 1, 2].map((i) => {
        const t = ((zz + i * 20) % 60) / 60;
        return <div key={i} style={{position: 'absolute', left: W * 0.66 + 120 + t * 80, top: H * 0.42 - t * 150, fontFamily: SANS, fontWeight: 800, fontSize: 44 + i * 12, color: 'rgba(238,242,234,.7)', opacity: Math.sin(t * Math.PI)}}>Z</div>;
      })}
      <Menu f={f} />
      <End f={f} />
      <Audio src={staticFile('earn/beat.wav')} />
    </AbsoluteFill>
  );
};
