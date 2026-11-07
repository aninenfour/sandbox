// Hotcoin Earn Rewards Boost promo, PS2-era style: low-poly 3D coin character + retro console UI overlays. 4:5, 18 s.
// Campaign facts (Hotcoin campaign page "HotcoinEarnRewardsBoost1"): first fixed-term Hotcoin Earn subscription of at least
// 500 USDT → 20 USDT Futures Trial Funds; subscription milestones → up to 1,000 USDT Earn Trial Funds; both rewards combine;
// ends Nov 16, 2026, 12:00 (UTC+8); limited rewards, first come, first served. No APR is stated, so none is shown.
// Music: scripts/make-earn-ps2-beat.py -> public/earn/beat.wav.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {INK, LIME, MONO, SANS, useFonts} from '../promo4/kit';
import {ET, EarnScene} from './EarnScene';

export const EARN_DURATION = ET.end;
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ip = (f: number, a: number[], b: number[]) => interpolate(f, a, b, cl);
const WHITE = '#EEF2EA';

// text block that fades/rises in and out, PS2-menu typography (thin, wide-tracked)
const Cap: React.FC<{f: number; a: number; b: number; k: string; h: React.ReactNode; s?: React.ReactNode; top?: number}> = ({f, a, b, k, h, s, top = 150}) => {
  const o = ip(f, [a, a + 12], [0, 1]) * ip(f, [b - 10, b], [1, 0]);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 72, right: 72, top, opacity: o, transform: `translateY(${(1 - o) * 18}px)`}}>
      <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 5, color: LIME, textShadow: `0 0 18px ${LIME}`}}>{k}</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 84, letterSpacing: -2.5, lineHeight: 1, color: WHITE, marginTop: 14, textShadow: '0 0 30px rgba(184,242,106,.25)'}}>{h}</div>
      {s && <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, lineHeight: 1.3, color: 'rgba(238,242,234,.72)', marginTop: 16, maxWidth: 860}}>{s}</div>}
    </div>
  );
};

// PS2-style menu panel with a glowing selection cursor
const Menu: React.FC<{f: number}> = ({f}) => {
  const o = ip(f, [ET.menu, ET.menu + 12], [0, 1]) * ip(f, [ET.item - 6, ET.item + 4], [1, 0]);
  if (o <= 0) return null;
  const items = ['SPOT', 'FUTURES', 'HOTCOIN EARN', 'WALLET'];
  const sel = f < ET.menu + 24 ? 0 : f < ET.menu + 36 ? 1 : 2;
  const flash = f >= ET.click && f < ET.click + 10 ? (Math.floor((f - ET.click) / 2) % 2 ? 1 : 0.4) : 1;
  return (
    <div style={{position: 'absolute', right: 72, top: 470, width: 470, opacity: o, transform: `translateX(${(1 - o) * 60}px)`, fontFamily: SANS}}>
      <div style={{border: '1.5px solid rgba(184,242,106,.45)', borderRadius: 18, background: 'linear-gradient(180deg, rgba(20,32,18,.75), rgba(5,8,6,.8))', padding: '18px 0', boxShadow: '0 0 40px rgba(184,242,106,.15), inset 0 0 30px rgba(184,242,106,.06)'}}>
        <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 4, color: 'rgba(238,242,234,.5)', padding: '0 26px 12px'}}>SELECT</div>
        {items.map((it, i) => (
          <div key={it} style={{position: 'relative', padding: '16px 26px', fontSize: 32, fontWeight: i === sel ? 700 : 500, letterSpacing: 2, color: i === sel ? INK : 'rgba(238,242,234,.8)'}}>
            {i === sel && <div style={{position: 'absolute', inset: '4px 12px', borderRadius: 12, background: LIME, opacity: flash, boxShadow: `0 0 30px ${LIME}`}} />}
            <span style={{position: 'relative'}}>{i === sel ? '▸ ' : '  '}{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Milestones: React.FC<{f: number}> = ({f}) => {
  const o = ip(f, [ET.grow + 30, ET.grow + 44], [0, 1]) * ip(f, [ET.rain - 6, ET.rain + 4], [1, 0]);
  if (o <= 0) return null;
  const p = ip(f, [ET.grow + 40, ET.rain - 20], [0, 1]);
  return (
    <div style={{position: 'absolute', left: 72, right: 72, bottom: 120, opacity: o, fontFamily: SANS}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: 'rgba(238,242,234,.65)', marginBottom: 12}}>
        <span>SUBSCRIPTION MILESTONES</span><span style={{color: LIME}}>UP TO 1,000 USDT</span></div>
      <div style={{height: 20, borderRadius: 99, border: '1.5px solid rgba(184,242,106,.5)', padding: 3}}>
        <div style={{height: '100%', width: `${p * 100}%`, borderRadius: 99, background: `linear-gradient(90deg, #7EC25A, ${LIME})`, boxShadow: `0 0 20px ${LIME}`}} /></div>
      <div style={{fontSize: 27, fontWeight: 600, color: WHITE, marginTop: 16}}>Earn Trial Funds, <span style={{color: LIME}}>stacks with the 20 USDT voucher.</span></div>
    </div>
  );
};

const End: React.FC<{f: number}> = ({f}) => {
  const o = ip(f, [ET.rain + 40, ET.rain + 56], [0, 1]);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(3,6,5,0) 30%, rgba(3,6,5,.9) 75%)'}} />
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 96, fontFamily: SANS, textAlign: 'center'}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{height: 54}} />
        <div style={{fontWeight: 800, fontSize: 70, letterSpacing: -2, color: WHITE, marginTop: 26, lineHeight: 1}}>Earn Rewards Boost</div>
        <div style={{fontWeight: 600, fontSize: 32, color: 'rgba(238,242,234,.75)', marginTop: 16}}>
          <span style={{color: LIME}}>20 USDT</span> voucher + fixed interest + up to <span style={{color: LIME}}>1,000 USDT</span></div>
        <div style={{display: 'inline-block', marginTop: 30, fontFamily: MONO, fontWeight: 700, fontSize: 26, background: LIME, color: INK, padding: '18px 34px', borderRadius: 999, boxShadow: `0 0 40px rgba(184,242,106,.5)`}}>PRESS START · hotcoin.com</div>
        <div style={{fontFamily: MONO, fontSize: 17, letterSpacing: 1.5, color: 'rgba(238,242,234,.55)', marginTop: 24, lineHeight: 1.6}}>ENDS NOV 16, 2026 · 12:00 UTC+8<br />LIMITED REWARDS · FIRST COME, FIRST SERVED</div>
      </div>
    </AbsoluteFill>
  );
};

export const EarnPS2: React.FC = () => {
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  useFonts();
  const zz = f < ET.menu ? f : -1;
  return (
    <AbsoluteFill style={{background: '#030605'}}>
      <ThreeCanvas width={W} height={H} camera={{fov: 40, position: [0, 1.2, 6], near: 0.1, far: 80}} gl={{antialias: true, preserveDrawingBuffer: true}}>
        <EarnScene />
      </ThreeCanvas>
      {/* CRT / PS2 finish: scanlines, vignette, faint dither */}
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0px, rgba(0,0,0,.18) 1px, transparent 1px, transparent 3px)', mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.65) 100%)'}} />
      <Img src={staticFile('brand/logo-official-white.png')} style={{position: 'absolute', left: 72, top: 64, height: 36, opacity: f < ET.rain + 40 ? 1 : 0}} />
      <div style={{position: 'absolute', right: 72, top: 66, fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: LIME, border: `1.5px solid rgba(184,242,106,.5)`, borderRadius: 99, padding: '8px 16px', opacity: f < ET.rain + 40 ? 1 : 0}}>EARN REWARDS BOOST</div>
      {zz >= 0 && [0, 1, 2].map((i) => {
        const t = ((zz + i * 20) % 60) / 60;
        return <div key={i} style={{position: 'absolute', left: W / 2 + 90 + t * 80, top: H * 0.5 - 60 - t * 160, fontFamily: SANS, fontWeight: 800, fontSize: 40 + i * 10, color: 'rgba(238,242,234,.7)', opacity: Math.sin(t * Math.PI)}}>Z</div>;
      })}
      <Cap f={f} a={6} b={ET.menu} k="YOUR CRYPTO" h={<>Just sitting<br />there.</>} s="Bored. Idle. Earning nothing." />
      <Cap f={f} a={ET.menu + 4} b={ET.item} k="PUT IT TO WORK" h={<>Hotcoin<br /><span style={{color: LIME}}>Earn.</span></>} s="Subscribe to fixed-term Earn for the first time, 500 USDT or more." />
      <Menu f={f} />
      <Cap f={f} a={ET.land - 4} b={ET.grow} k="ITEM GET" h={<><span style={{color: LIME}}>+20 USDT</span><br />voucher.</>} s="Futures Trial Funds. Trade futures with it, keep the profit." />
      <Cap f={f} a={ET.grow + 6} b={ET.rain} k="AND MEANWHILE" h={<>Fixed interest.<br /><span style={{color: LIME}}>Every day.</span></>} />
      <Milestones f={f} />
      <Cap f={f} a={ET.rain + 2} b={ET.rain + 44} k="RESULT" h={<>More money.</>} />
      <End f={f} />
      <Audio src={staticFile('earn/beat.wav')} />
    </AbsoluteFill>
  );
};
