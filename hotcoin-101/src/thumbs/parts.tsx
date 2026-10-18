import React from 'react';
import {Img, staticFile} from 'remotion';
import {FONT} from '../notebook/tokens';

// Shared thumbnail pieces (FILE 015 onward).

export const Tag: React.FC<{file: string; dark?: boolean}> = ({file, dark}) => (
  <div style={{position: 'absolute', left: 70, top: 56, display: 'flex', alignItems: 'center', gap: 18}}>
    <Img src={staticFile(`brand/hotcoin-lockup-${dark ? 'dark' : 'light'}.png`)} style={{height: 40}} />
    <span style={{fontFamily: FONT.mono, fontSize: 26, letterSpacing: 3, color: dark ? 'rgba(237,236,231,0.7)' : 'rgba(21,23,26,0.6)'}}>101 · FILE {file}</span>
  </div>
);

/** 9:16 tag, centred, sitting just inside the 3:4 grid-crop band */
export const TagV: React.FC<{file: string; dark?: boolean}> = ({file, dark}) => (
  <div style={{position: 'absolute', left: 0, width: 1080, top: 258, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
    <Img src={staticFile(`brand/hotcoin-lockup-${dark ? 'dark' : 'light'}.png`)} style={{height: 36}} />
    <span style={{fontFamily: FONT.mono, fontSize: 24, letterSpacing: 3, color: dark ? 'rgba(237,236,231,0.7)' : 'rgba(21,23,26,0.6)'}}>101 · FILE {file}</span>
  </div>
);

export const Big: React.FC<{text: string; size: number; x: number; y: number; color: string; width?: number; align?: 'left' | 'center'}> = ({text, size, x, y, color, width, align = 'left'}) => (
  <div style={{position: 'absolute', left: x, top: y, width, textAlign: align, fontFamily: FONT.display, fontSize: size, lineHeight: 0.92, color, whiteSpace: 'nowrap', letterSpacing: size * 0.005}}>{text}</div>
);

export const Hand: React.FC<{text: string; x: number; y: number; size: number; color: string; rot?: number}> = ({text, x, y, size, color, rot = -4}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: FONT.hand, fontWeight: 700, fontSize: size, color, transform: `rotate(${rot}deg)`, whiteSpace: 'nowrap'}}>{text}</div>
);
