// "Guess the Total Assets" giveaway graphic, 1080 x 1080.
// The phone shows the real Hotcoin wallet screenshot (balance hidden); the hidden number is the thing to guess.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const LIME = '#B8F26A', GREEN = '#7EC25A', WHITE = '#F4F5F2', GREY = '#A3A9A5', INK = '#050807';
const SANS = '"Inter Tight", sans-serif', MONO = '"IBM Plex Mono", monospace';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 96px "Inter Tight"', '500 30px "Inter Tight"', '400 30px "Inter Tight"', '500 24px "IBM Plex Mono"'].map((s) => document.fonts.load(s))).then(() => continueRender(h));
  }, [h]);
};

// Screenshot 1170 x 1470, cropped from y = 130 (below the status bar) and shown at scale K.
const K = 0.405, CROP_Y = 130;
const PHONE = {x: 568, y: 214, w: 1170 * K, h: (1470 - CROP_Y) * K};
// The hidden balance "******" sits at about x 440 to 730, y 668 to 738 in the screenshot.
const HOLE = {x: PHONE.x + 425 * K, y: PHONE.y + (650 - CROP_Y) * K, w: 320 * K, h: 110 * K};

export const Guess: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      {/* money backdrop: the engraved $5 note, Lincoln on the left */}
      <Img src={staticFile('referral/bill-bg.png')} style={{position: 'absolute', left: -120, top: -135, height: 1350, width: 4320, opacity: 0.9}} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,8,7,0.92) 0%, rgba(5,8,7,0.78) 45%, rgba(5,8,7,0.45) 100%)'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 520px 520px at ${PHONE.x + PHONE.w / 2}px ${HOLE.y}px, rgba(126,194,90,0.32), transparent 70%)`}} />

      {/* header */}
      <Img src={staticFile('brand/logo-official-white.png')} style={{position: 'absolute', left: 64, top: 62, width: 220, height: (220 * 328) / 2005}} />
      <div style={{position: 'absolute', right: 64, top: 60, fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: 2, color: INK, background: LIME, padding: '8px 18px', borderRadius: 40}}>GIVEAWAY</div>

      {/* the ask */}
      <div style={{position: 'absolute', left: 64, top: 214, width: 470, fontFamily: SANS, fontWeight: 600, fontSize: 86, lineHeight: 0.98, letterSpacing: -3.5, color: WHITE}}>
        Guess the<br /><span style={{color: LIME}}>Total<br />Assets</span>
      </div>
      <div style={{position: 'absolute', left: 66, top: 520, width: 450, fontFamily: SANS, fontWeight: 500, fontSize: 34, lineHeight: 1.25, color: WHITE}}>
        Guess it right and<br /><span style={{color: INK, background: LIME, padding: '0 10px', borderRadius: 8, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>win the whole balance.</span>
      </div>

      {/* the rule, made unmissable */}
      <div style={{position: 'absolute', left: 64, top: 676, width: 450, borderRadius: 24, border: `2px solid ${LIME}`, background: 'rgba(5,8,7,0.82)', padding: '24px 28px', boxSizing: 'border-box'}}>
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 20, letterSpacing: 1.5, color: LIME}}>HOW TO ANSWER</div>
        <div style={{fontFamily: SANS, fontSize: 27, lineHeight: 1.3, color: WHITE, marginTop: 10}}>Include <b style={{fontWeight: 600, color: LIME}}>1 digit after the dot</b></div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 50, letterSpacing: -1.5, color: WHITE, marginTop: 10, fontVariantNumeric: 'tabular-nums'}}>
          e.g. 1,234<span style={{color: LIME}}>.5</span> <span style={{fontSize: 28, color: GREY, fontWeight: 500}}>USDT</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 66, top: 930, fontFamily: SANS, fontWeight: 600, fontSize: 32, color: WHITE}}>Comment your guess 👇</div>
      <div style={{position: 'absolute', left: 66, top: 984, fontFamily: SANS, fontSize: 18, color: GREY}}>Exact amount wins. T&amp;Cs apply.</div>

      {/* the real wallet */}
      <div style={{position: 'absolute', left: PHONE.x - 14, top: PHONE.y - 14, width: PHONE.w + 28, height: PHONE.h + 28, borderRadius: 46, background: '#0C0F0E',
        border: '1.5px solid rgba(184,242,106,0.35)', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(126,194,90,0.18)'}} />
      <div style={{position: 'absolute', left: PHONE.x, top: PHONE.y, width: PHONE.w, height: PHONE.h, borderRadius: 34, overflow: 'hidden'}}>
        <Img src={staticFile('guess/wallet.jpg')} style={{position: 'absolute', left: 0, top: -CROP_Y * K, width: 1170 * K, height: 1470 * K}} />
      </div>
      {/* spotlight on the hidden number */}
      <div style={{position: 'absolute', left: HOLE.x, top: HOLE.y, width: HOLE.w, height: HOLE.h, borderRadius: 16, border: `4px solid ${LIME}`,
        boxShadow: `0 0 0 6px rgba(184,242,106,0.18), 0 0 40px rgba(184,242,106,0.7)`}} />
      <div style={{position: 'absolute', left: HOLE.x + HOLE.w / 2 - 130, top: HOLE.y - 100, width: 260, textAlign: 'center'}}>
        <div style={{display: 'inline-block', fontFamily: SANS, fontWeight: 600, fontSize: 30, color: INK, background: LIME, padding: '10px 22px', borderRadius: 40, boxShadow: '0 10px 24px rgba(0,0,0,0.45)'}}>Guess this</div>
        <div style={{width: 0, height: 0, margin: '0 auto', borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: `14px solid ${LIME}`}} />
      </div>
      <div style={{position: 'absolute', left: PHONE.x, width: PHONE.w, top: PHONE.y + PHONE.h + 30, textAlign: 'center', fontFamily: MONO, fontWeight: 500, fontSize: 19, letterSpacing: 1, color: GREY}}>
        A REAL HOTCOIN WALLET
      </div>
    </AbsoluteFill>
  );
};
