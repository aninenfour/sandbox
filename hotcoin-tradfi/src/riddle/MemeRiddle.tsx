// Memecoin math puzzle (1080 x 1350). Coin logos: CoinGecko.
// DOGE = 10, PEPE = 5, BONK = 4. Answer: DOGE + PEPE x BONK = 10 + 20 = 30 (multiplication first; 60 is the trap).
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {INK, LIME, MONO, SANS, WHITE, useFonts} from '../promo4/kit';

type Coin = 'doge' | 'pepe' | 'bonk';
const LOGO: Record<Coin, string> = {doge: 'riddle/dogecoin.png', pepe: 'riddle/pepe.png', bonk: 'riddle/bonk.png'};
type Tok = Coin | '+' | '−' | '×';
const ROWS: {toks: Tok[]; res: string}[] = [
  {toks: ['doge', '+', 'doge', '+', 'doge'], res: '30'},
  {toks: ['doge', '+', 'pepe', '+', 'pepe'], res: '20'},
  {toks: ['pepe', '×', 'bonk', '−', 'doge'], res: '10'},
  {toks: ['doge', '+', 'pepe', '×', 'bonk'], res: '?'},
];

// coin: CoinGecko logo set in a brushed-metal rim, with a soft top highlight and a contact shadow
const CoinChip: React.FC<{c: Coin; s?: number}> = ({c, s = 140}) => (
  <div style={{width: s, height: s, borderRadius: s / 2, position: 'relative', flex: 'none',
    background: 'conic-gradient(from 210deg, #F4F5F1, #8E928C, #E6E8E3, #6E726C, #F4F5F1, #A3A79F, #F4F5F1)',
    boxShadow: '0 18px 30px rgba(0,0,0,0.55), 0 2px 0 rgba(255,255,255,0.25) inset'}}>
    <Img src={staticFile(LOGO[c])} style={{position: 'absolute', inset: s * 0.075, width: s * 0.85, height: s * 0.85, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 2px rgba(0,0,0,0.35)'}} />
    <div style={{position: 'absolute', inset: s * 0.075, borderRadius: '50%', background: 'radial-gradient(ellipse 70% 45% at 40% 18%, rgba(255,255,255,0.42), rgba(255,255,255,0) 70%)'}} />
    <div style={{position: 'absolute', inset: s * 0.075, borderRadius: '50%', boxShadow: 'inset 0 -10px 18px rgba(0,0,0,0.28)'}} />
  </div>
);

const Op: React.FC<{t: string}> = ({t}) => <div style={{width: 78, textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 64, color: 'rgba(245,247,242,0.55)', lineHeight: 1}}>{t}</div>;

export const MemeRiddle: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 55% at 85% 0%, #2B4A14 0%, #0E1A0A 45%, #07090A 80%)', color: WHITE, fontFamily: SANS, overflow: 'hidden'}}>
      {/* dot grid + huge symbol watermark */}
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1.4px, transparent 1.6px)', backgroundSize: '36px 36px', maskImage: 'linear-gradient(180deg, #000 0%, transparent 55%)'}} />
      <Img src={staticFile('brand/symbol-official-white.png')} style={{position: 'absolute', width: 1100, height: 1100, right: -420, top: -330, opacity: 0.05, transform: 'rotate(-10deg)'}} />

      <div style={{position: 'absolute', left: 72, right: 72, top: 64, display: 'flex', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 210, height: (210 * 328) / 2005}} />
        <div style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: LIME, border: `1.5px solid rgba(184,242,106,0.5)`, borderRadius: 100, padding: '10px 20px'}}>MEME MATH</div>
      </div>

      <div style={{position: 'absolute', left: 72, top: 168, fontWeight: 600, fontSize: 92, lineHeight: 0.98, letterSpacing: -4}}>
        Solve it in<br /><span style={{color: LIME}}>15 seconds.</span>
      </div>

      {/* equations */}
      <div style={{position: 'absolute', left: 48, right: 48, top: 430, borderRadius: 44, padding: '26px 34px', background: 'linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))',
        border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 40px 80px rgba(0,0,0,0.45)'}}>
        {ROWS.map(({toks, res}, r) => {
          const q = res === '?';
          return (
            <div key={r} style={{display: 'flex', alignItems: 'center', height: 168, padding: '0 18px', marginTop: q ? 22 : 0, borderRadius: 30,
              background: q ? 'rgba(184,242,106,0.08)' : 'transparent', border: q ? `2px solid ${LIME}` : '2px solid transparent',
              borderTop: !q && r > 0 ? '1px solid rgba(255,255,255,0.06)' : undefined}}>
              {toks.map((t, i) => (t === '+' || t === '−' || t === '×') ? <Op key={i} t={t} /> : <CoinChip key={i} c={t} />)}
              <Op t="=" />
              {q ? (
                <div style={{marginLeft: 'auto', width: 132, height: 112, borderRadius: 26, background: LIME, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 84}}>?</div>
              ) : (
                <div style={{marginLeft: 'auto', width: 132, textAlign: 'center', fontWeight: 600, fontSize: 84, letterSpacing: -3, fontVariantNumeric: 'tabular-nums'}}>{res}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* legend + CTA */}
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 64, display: 'flex', alignItems: 'flex-end'}}>
        <div style={{display: 'flex', gap: 26}}>
          {(['doge', 'pepe', 'bonk'] as Coin[]).map((c) => (
            <div key={c} style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 20, letterSpacing: 1.5, color: 'rgba(245,247,242,0.6)'}}>
              <Img src={staticFile(LOGO[c])} style={{width: 30, height: 30, borderRadius: 15}} />{c.toUpperCase()}
            </div>
          ))}
        </div>
        <div style={{marginLeft: 'auto', textAlign: 'right'}}>
          <div style={{fontWeight: 600, fontSize: 36, letterSpacing: -1}}>Drop your answer below.</div>
          <div style={{fontFamily: MONO, fontSize: 18, color: 'rgba(245,247,242,0.5)', marginTop: 8, letterSpacing: 1}}>ANSWER IN THE REPLIES</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
