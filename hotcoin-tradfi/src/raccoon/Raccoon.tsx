// "Change your trading mindset": the raccoon meme re-captioned, with a Hotcoin pin on the happy raccoon. 1440 x 1882.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const FONT = 'Roboto, "Noto Color Emoji", sans-serif';
const ROWS: [string, string][] = [
  ["I can't trade", '😭'],
  ['Trading is hard', '😢'],
  ['Liquidated again', '😰'],
  ['Longed the top', '😥'],
];

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {Promise.all(['700 66px Roboto', '400 66px "Noto Color Emoji"'].map((s) => document.fonts.load(s))).then(() => continueRender(h));}, [h]);
};

export const Raccoon: React.FC = () => {
  useFonts();
  const row: React.CSSProperties = {fontFamily: FONT, fontWeight: 700, fontSize: 64, color: '#111', letterSpacing: -0.5, whiteSpace: 'nowrap'};
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <Img src={staticFile('raccoon/src.jpg')} style={{position: 'absolute', inset: 0, width: 1440, height: 1882}} />
      {/* clear the old title and captions */}
      <div style={{position: 'absolute', left: 0, top: 60, width: 1440, height: 200, background: '#fff'}} />
      <div style={{position: 'absolute', left: 0, top: 1100, width: 1440, height: 782, background: '#fff'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 108, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 96, letterSpacing: -1, color: '#111'}}>
        Change your trading mindset
      </div>
      {ROWS.map(([t, e], i) => {
        const y = 1170 + i * 150;
        return (
          <React.Fragment key={t}>
            <div style={{...row, position: 'absolute', right: 1440 - 700, top: y, textAlign: 'right'}}>{t} {e}</div>
            <svg width={100} height={40} style={{position: 'absolute', left: 745, top: y + 22}}>
              <line x1={4} y1={20} x2={80} y2={20} stroke="#E8261C" strokeWidth={6} />
              <polygon points="76,8 98,20 76,32" fill="#E8261C" />
            </svg>
            <div style={{...row, position: 'absolute', left: 900, top: y}}>Muhehehe 😈</div>
          </React.Fragment>
        );
      })}
      {/* the Hotcoin pin on the happy raccoon */}
      <div style={{position: 'absolute', left: 1182, top: 902, width: 118, height: 118, borderRadius: '50%', transform: 'rotate(-10deg)',
        background: 'linear-gradient(145deg, #F4F4F2 0%, #A9ACAA 45%, #EDEDEB 70%, #8C8F8D 100%)', boxShadow: '0 8px 14px rgba(0,0,0,0.45), 0 2px 3px rgba(0,0,0,0.4)'}}>
        <div style={{position: 'absolute', inset: 7, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #2A2F2C 0%, #0B0E0C 70%)', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Img src={staticFile('brand/symbol-official-white.png')} style={{width: 62, height: 62}} />
        </div>
        <div style={{position: 'absolute', inset: 7, borderRadius: '50%', background: 'linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 40%)'}} />
      </div>
    </AbsoluteFill>
  );
};
