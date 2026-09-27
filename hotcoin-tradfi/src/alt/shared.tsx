import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, staticFile} from 'remotion';

export const C = {ink: '#0B0E11', green: '#7EC25A', paper: '#F1EFE8', red: '#F6465D', grey: '#8B8E93'};
export const DISPLAY = '"Archivo Black", sans-serif';
export const MONO = '"IBM Plex Mono", monospace';
export const SERIF = '"Instrument Serif", serif';

export const useFontsReady = () => {
  const [h] = useState(() => delayRender('fonts'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all([
      document.fonts.load('400 100px "Archivo Black"'),
      document.fonts.load('500 40px "IBM Plex Mono"'),
      document.fonts.load('italic 400 100px "Instrument Serif"'),
    ]).then(() => {setReady(true); continueRender(h);});
  }, [h]);
  return ready;
};

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.3}) => (
  <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity}} />
);

export const coinFace = 'radial-gradient(circle at 34% 28%, #B4E398 0%, #8CCB68 30%, #7EC25A 52%, #5F9E3F 100%)';

export const Cursor: React.FC<{x: number; y: number}> = ({x, y}) => (
  <svg width={70} height={81} viewBox="0 0 26 30" style={{position: 'absolute', left: x - 6.7, top: y - 4, overflow: 'visible', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))'}}>
    <path d="M2.5 1.5 L2.5 22.5 L7.6 17.8 L11.2 26.2 L15 24.6 L11.5 16.4 L18.5 16.4 Z" fill="#FFFFFF" stroke={C.ink} strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

// A green pill lit from above.
export const Pill: React.FC<{x: number; y: number; h: number; children: React.ReactNode; fs: number}> = ({x, y, h, children, fs}) => (
  <div style={{
    position: 'absolute', left: x, top: y, height: h, padding: `0 ${h * 0.36}px`, borderRadius: h / 2, display: 'flex', alignItems: 'center',
    background: 'linear-gradient(180deg, #A2DA83 0%, #7EC25A 52%, #67A945 100%)',
    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -4px 0 rgba(0,0,0,0.18), 0 18px 36px rgba(0,0,0,0.28)',
    fontFamily: DISPLAY, fontSize: fs, color: C.ink,
  }}>{children}</div>
);
