import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';

// Text-only cover for the Reel/TikTok grid. No logo. Text stays inside the centre
// 1080x1350 so the Instagram grid crop (3:4 / 4:5) never cuts it.
const GREEN = '#7EC25A';
const fontFace = `@font-face{font-family:'Hand';src:url(${staticFile('hand.woff2')}) format('woff2');}`;

export type ThumbProps = {text: string; hi: string[]; kicker?: string};

export const Thumb: React.FC<ThumbProps> = ({text, hi, kicker}) => {
  const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const hiSet = new Set(hi.map(norm));
  const words = text.split(' ');
  const size = text.length > 34 ? 150 : text.length > 22 ? 170 : 195;
  return (
    <AbsoluteFill style={{background: '#EDE6D6', alignItems: 'center', justifyContent: 'center'}}>
      <style>{fontFace}</style>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.55), rgba(0,0,0,0.14))'}} />
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50, maxWidth: 900}}>
        {kicker ? (
          <div style={{fontFamily: 'Hand', fontSize: 72, color: '#2b2522', background: '#F7F1E3', border: '5px solid #2b2522',
            borderRadius: 20, padding: '10px 40px', transform: 'rotate(-2deg)', boxShadow: '8px 10px 0 rgba(43,37,34,0.25)'}}>{kicker}</div>
        ) : null}
        <div style={{fontFamily: 'Hand', fontSize: size, lineHeight: 1.0, textAlign: 'center', color: 'white',
          WebkitTextStroke: '20px #111', paintOrder: 'stroke fill', textShadow: '0 10px 0 rgba(0,0,0,0.3)'}}>
          {words.map((w, i) => (
            <span key={i} style={{color: hiSet.has(norm(w)) ? GREEN : 'white'}}>{w}{i < words.length - 1 ? ' ' : ''}</span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
