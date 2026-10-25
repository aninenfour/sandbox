// Stardrop x $DNA reminder (1600 x 900). Event: 2026-10-20 18:00 to 2026-10-27 17:59 (UTC+8), $10,000 in DNA.
// DNA logo: provided by the user (NeoSoulAI).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const LIME = '#B8F26A', INK = '#07090A', MUTED = '#8A938C', ORANGE = '#F28C28';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';

export const StardropDNA: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 80px "Inter Tight"', '500 20px "JetBrains Mono"'].map((f) => document.fonts.load(f))).then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 70% at 78% 45%, rgba(242,140,40,0.16) 0%, rgba(184,242,106,0.05) 40%, ${INK} 75%)`, color: '#F4F6F1', fontFamily: SANS, padding: '70px 90px'}}>
      {/* stars */}
      <svg width={1600} height={900} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 60}, (_, i) => { const r = (k: number) => { const v = Math.sin(i * 12.9898 + k) * 43758.5453; return v - Math.floor(v); }; return <circle key={i} cx={r(1) * 1600} cy={r(2) * 900} r={0.6 + r(3) * 1.6} fill="#fff" opacity={0.15 + r(4) * 0.5} />; })}
        {[[1060, 120], [1460, 760], [1180, 700]].map(([x, y], i) => <path key={i} d={`M${x},${y - 14} L${x + 3},${y - 3} L${x + 14},${y} L${x + 3},${y + 3} L${x},${y + 14} L${x - 3},${y + 3} L${x - 14},${y} L${x - 3},${y - 3}Z`} fill={i ? '#fff' : LIME} opacity={0.9} />)}
      </svg>
      {/* DNA coin with soft orbit rings */}
      <div style={{position: 'absolute', left: 1180 - 210, top: 450 - 210, width: 420, height: 420}}>
        {[0, 1, 2].map((k) => <div key={k} style={{position: 'absolute', inset: -60 - k * 70, borderRadius: '50%', border: `1.5px solid rgba(242,140,40,${0.28 - k * 0.08})`}} />)}
        <Img src={staticFile('stardrop/dna.png')} style={{width: 420, height: 420, borderRadius: '50%', boxShadow: '0 0 120px rgba(242,140,40,0.35)'}} />
      </div>
      <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 18}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 190, height: (190 * 328) / 2005}} />
        <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: INK, background: LIME, borderRadius: 999, padding: '7px 16px', marginLeft: 12}}>STARDROP</div>
      </div>
      <div style={{position: 'relative', marginTop: 120, fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: ORANGE}}>⏳ LAST CHANCE</div>
      <div style={{position: 'relative', marginTop: 18, fontWeight: 600, fontSize: 132, lineHeight: 0.95, letterSpacing: -5}}>$10,000<br /><span style={{color: ORANGE}}>in $DNA</span></div>
      <div style={{position: 'relative', marginTop: 34, fontSize: 30, color: '#C9CEC8'}}>Deposit or trade DNA/USDT. Collect Stars. Share the drop.</div>
      <div style={{position: 'relative', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 22}}>
        <div style={{background: LIME, color: INK, fontWeight: 700, fontSize: 30, borderRadius: 16, padding: '16px 30px'}}>Join now →</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: MUTED, letterSpacing: 1}}>Ends Oct 27 · 17:59 (UTC+8)</div>
      </div>
    </AbsoluteFill>
  );
};
