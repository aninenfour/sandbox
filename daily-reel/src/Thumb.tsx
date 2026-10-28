import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

// Cover for the Reel/TikTok grid: one scene image with the character's face, hook text on top.
// No logo. Text stays inside the centre 1080x1440 so the Instagram grid crop (3:4) never cuts it.
const GREEN = '#7EC25A';
const fontFace = `@font-face{font-family:'Hand';src:url(${staticFile('hand.woff2')}) format('woff2');}`;

export type ThumbProps = {
  text: string; hi: string[]; kicker?: string;
  img?: string;            // scene name in public/img, default s01 (the hero)
  zoom?: number;           // 1 = full frame; 1.2 to 1.5 pushes in on the face
  fx?: number; fy?: number; // zoom focus in percent: put it on the face; the face should land in the upper half
};

export const Thumb: React.FC<ThumbProps> = ({text, hi, kicker, img = 's01', zoom = 1.3, fx = 50, fy = 25}) => {
  const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const hiSet = new Set(hi.map(norm));
  const words = text.split(' ');
  const size = text.length > 34 ? 128 : text.length > 22 ? 145 : 165;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <style>{fontFace}</style>
      <Img src={staticFile(`img/${img}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover',
        transformOrigin: `${fx}% ${fy}%`, transform: `scale(${zoom})`}} />
      {/* darken the bottom so the text reads; the face above stays bright */}
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0) 50%)'}} />
      <div style={{position: 'absolute', bottom: 290, left: 0, right: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 34}}>
        {kicker ? (
          <div style={{fontFamily: 'Hand', fontSize: 64, color: '#2b2522', background: '#F7F1E3', border: '5px solid #2b2522',
            borderRadius: 20, padding: '6px 36px', transform: 'rotate(-2deg)', boxShadow: '8px 10px 0 rgba(0,0,0,0.35)'}}>{kicker}</div>
        ) : null}
        <div style={{fontFamily: 'Hand', fontSize: size, lineHeight: 1.0, textAlign: 'center', maxWidth: 960, color: 'white',
          WebkitTextStroke: '18px #111', paintOrder: 'stroke fill', textShadow: '0 10px 0 rgba(0,0,0,0.35)'}}>
          {words.map((w, i) => (
            <span key={i} style={{color: hiSet.has(norm(w)) ? GREEN : 'white'}}>{w}{i < words.length - 1 ? ' ' : ''}</span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
