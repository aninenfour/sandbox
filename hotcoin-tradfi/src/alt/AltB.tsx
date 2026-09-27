import React, {useEffect, useState} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, DISPLAY, Grain, MONO, Pill, SERIF, useFontsReady} from './shared';

// Variant B, "Halftone": after the Cube Motion launch film. Every shape is a grid of dots that re-forms.
const W = 1080, H = 1350;

// Rasterise text onto a grid and return the dot centres that land inside the glyphs.
const dotsForText = (text: string, font: string, box: {x: number; y: number; w: number; h: number}, step: number) => {
  const c = document.createElement('canvas');
  c.width = box.w; c.height = box.h;
  const g = c.getContext('2d')!;
  g.fillStyle = '#fff'; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, box.w / 2, box.h / 2 + box.h * 0.04);
  const data = g.getImageData(0, 0, box.w, box.h).data;
  const pts: [number, number][] = [];
  for (let y = step / 2; y < box.h; y += step) for (let x = step / 2; x < box.w; x += step) {
    if (data[(Math.floor(y) * box.w + Math.floor(x)) * 4 + 3] > 128) pts.push([box.x + x, box.y + y]);
  }
  return pts;
};
const rand = (s: number) => {const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};

const CANDLES = [[0.62, 0.3], [0.5, 0.4], [0.58, 0.35], [0.42, 0.5], [0.46, 0.38], [0.32, 0.55], [0.36, 0.42], [0.24, 0.6], [0.3, 0.5], [0.18, 0.66], [0.22, 0.52], [0.12, 0.7]];

export const AltB: React.FC = () => {
  const ready = useFontsReady();
  const f = useCurrentFrame();
  const [pts, setPts] = useState<[number, number][]>([]);
  useEffect(() => {
    if (ready) setPts(dotsForText('NVDA', '400 330px "Archivo Black"', {x: 40, y: 330, w: 1000, h: 380}, 15));
  }, [ready]);
  const step = 15;
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 70% at 50% 40%, #151A20 0%, ${C.ink} 70%)`, overflow: 'hidden'}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {new Array(Math.floor(H / 30)).fill(0).map((_, j) => new Array(Math.floor(W / 30)).fill(0).map((__, i) => (
          <circle key={`${i}-${j}`} cx={15 + i * 30} cy={15 + j * 30} r={1.6} fill={C.paper} fillOpacity={0.07} />
        )))}
        {pts.map(([x, y], i) => {
          const k = rand(i + f * 0.001);
          return <circle key={i} cx={x} cy={y} r={step * (k > 0.93 ? 0.22 : 0.34)} fill={k > 0.97 ? C.paper : C.green} />;
        })}
        {CANDLES.map(([top, len], i) => {
          const x = 150 + i * 66, y0 = 760 + top * 260, n = Math.round((len * 260) / 13);
          const up = i % 3 !== 1;
          return new Array(n).fill(0).map((_, j) => (
            <circle key={`c${i}-${j}`} cx={x} cy={y0 + j * 13} r={j === 0 || j === n - 1 ? 3 : 5.2} fill={up ? C.green : C.red} fillOpacity={0.9} />
          ));
        })}
      </svg>
      <div style={{position: 'absolute', left: 64, top: 96, fontFamily: MONO, fontWeight: 500, fontSize: 26, color: C.paper, letterSpacing: 2}}>trade(&quot;NVDA&quot;, &quot;USDT&quot;)</div>
      <div style={{position: 'absolute', right: 64, top: 96, fontFamily: MONO, fontSize: 26, color: C.grey}}>02 / 05</div>
      <div style={{position: 'absolute', left: 64, top: 142, fontFamily: MONO, fontSize: 22, color: C.grey, letterSpacing: 2}}>US STOCK  ·  NVIDIA</div>
      <div style={{position: 'absolute', left: 64, top: 1098, fontFamily: SERIF, fontStyle: 'italic', fontSize: 128, color: C.paper, lineHeight: 1}}>with</div>
      <Pill x={330} y={1100} h={120} fs={84}>USDT</Pill>
      <div style={{position: 'absolute', left: 64, bottom: 64, fontFamily: MONO, fontSize: 24, color: C.grey, letterSpacing: 1}}>spot()  +  futures()  =  one account</div>
      <Grain opacity={0.22} />
    </AbsoluteFill>
  );
};
