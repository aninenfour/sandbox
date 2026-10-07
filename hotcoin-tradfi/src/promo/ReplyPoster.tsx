// #HOTCOINxTOKEN2049 reply campaign poster, 1080 x 1350.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

export const DATES = '7–8 OCT 2026'; // campaign window: TOKEN2049 event days only
const LIME = '#B8F26A', INK = '#050706', WHITE = '#F2F3EE', GREY = '#8C938E';
const DISPLAY = 'Unbounded, sans-serif', MONO = '"JetBrains Mono", monospace', SANS = '"Inter Tight", sans-serif';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {Promise.all(['900 96px Unbounded', '700 24px "JetBrains Mono"', '500 30px "Inter Tight"', '600 30px "Inter Tight"'].map((s) => document.fonts.load(s))).then(() => continueRender(h));}, [h]);
};

const Step: React.FC<{n: string; t: React.ReactNode}> = ({n, t}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
    <div style={{width: 64, height: 64, borderRadius: '50%', border: `3px solid ${LIME}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 900, fontSize: 28, color: LIME, flexShrink: 0}}>{n}</div>
    <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 36, lineHeight: 1.2, color: WHITE}}>{t}</div>
  </div>
);

export const ReplyPoster: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Img src={staticFile('referral/bill-bg.png')} style={{position: 'absolute', left: -1500, top: 0, width: 4320, height: 1350, opacity: 0.55}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,7,6,0.6) 0%, rgba(5,7,6,0.85) 45%, rgba(5,7,6,0.97) 100%)'}} />
      <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
        <path d="M 80 40 L 1040 40 L 1040 1270 L 1000 1310 L 40 1310 L 40 80 Z" fill="none" stroke={LIME} strokeWidth={5} />
      </svg>
      {/* header */}
      <Img src={staticFile('brand/logo-official-white.png')} style={{position: 'absolute', left: 90, top: 90, width: 220, height: (220 * 328) / 2005}} />
      <div style={{position: 'absolute', right: 90, top: 86, display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: INK, background: LIME, padding: '10px 18px', borderRadius: 30}}>
        <span style={{width: 12, height: 12, borderRadius: '50%', background: '#FF3B3B'}} />LIVE AT TOKEN2049
      </div>
      {/* headline */}
      <div style={{position: 'absolute', left: 90, top: 200, fontFamily: DISPLAY, fontWeight: 900, fontSize: 92, lineHeight: 0.98, letterSpacing: -3.5, color: WHITE}}>
        Reply.<br /><span style={{color: LIME}}>Win USDT.</span>
      </div>
      {/* coupon ticket */}
      <div style={{position: 'absolute', left: 90, top: 440, width: 900, height: 250, filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.55))'}}>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(120deg, #D4FF96 0%, ${LIME} 45%, #8FD14F 100%)`, borderRadius: 26,
          WebkitMaskImage: 'radial-gradient(circle 28px at 640px 0, transparent 27px, #000 28px), radial-gradient(circle 28px at 640px 250px, transparent 27px, #000 28px)',
          WebkitMaskComposite: 'source-in', maskComposite: 'intersect'}} />
        <div style={{position: 'absolute', left: 640, top: 36, bottom: 36, borderLeft: `3px dashed rgba(5,7,6,0.45)`}} />
        <div style={{position: 'absolute', left: 50, top: 34, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: INK}}>FUTURES COUPON</div>
        <div style={{position: 'absolute', left: 44, top: 66, fontFamily: DISPLAY, fontWeight: 900, fontSize: 132, lineHeight: 1, letterSpacing: -6, color: INK}}>$10</div>
        <div style={{position: 'absolute', left: 50, top: 200, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: INK}}>USDT · HOTCOIN FUTURES</div>
        <div style={{position: 'absolute', left: 640, right: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
          <Img src={staticFile('brand/symbol-official-white.png')} style={{width: 88, height: 88, filter: 'brightness(0)'}} />
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: INK, marginTop: 10}}>{DATES}</div>
        </div>
      </div>
      {/* hashtag */}
      <div style={{position: 'absolute', left: 90, right: 90, top: 740, padding: '22px 0', textAlign: 'center', border: `3px solid ${LIME}`, borderRadius: 18, background: 'rgba(184,242,106,0.08)'}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 4, color: GREY, marginBottom: 6}}>USE THE HASHTAG</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 56, letterSpacing: -1.5, color: LIME}}>#HOTCOINxTOKEN2049</div>
      </div>
      {/* steps */}
      <div style={{position: 'absolute', left: 90, top: 935, display: 'flex', flexDirection: 'column', gap: 26}}>
        <Step n="1" t={<>Reply under <b style={{fontWeight: 600}}>any Hotcoin post</b> on X</>} />
        <Step n="2" t={<>Add <b style={{fontWeight: 600, color: LIME}}>#HOTCOINxTOKEN2049</b></>} />
        <Step n="3" t={<><b style={{fontWeight: 600}}>More replies = more chances</b> to win</>} />
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, bottom: 74, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontWeight: 500, fontSize: 19, letterSpacing: 1, color: GREY}}>
        <span>Only during TOKEN2049 · {DATES}</span><span>T&amp;Cs apply</span>
      </div>
    </AbsoluteFill>
  );
};
