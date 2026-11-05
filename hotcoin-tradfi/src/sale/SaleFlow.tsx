// "The market is on sale" as a 3D coverflow: glowing mesh-gradient cards on a curved carousel that spins card to card.
// Same facts as social/dips (CoinGecko prices Nov 5, 2026; CMC total market cap; catalysts listed in social/dips/render.mjs).
// Coin logos: CoinGecko (public/sale). Music: scripts/make-sale-beat.py -> public/sale/beat.wav.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, LIME, MONO, SANS, useFonts} from '../promo4/kit';

const HOLD = 48, MOVE = 20, STEP = HOLD + MOVE; // frames per card
type Card = {key: string; title: string; sub: string; big: string; foot: string; c: [string, string, string]; logo?: string; price?: string};
const CARDS: Card[] = [
  {key: 'cover', title: 'The market', sub: 'is on sale.', big: '-37%', foot: '$1.59T wiped since the Oct 2025 peak', c: ['#B8F26A', '#2DBD85', '#F5E663']},
  {key: 'eth', title: 'Ethereum', sub: 'ETH · $2,287', big: '-54%', foot: 'Glamsterdam upgrade in public testing', c: ['#6C7CF5', '#9AA8FF', '#2B2F6B'], logo: 'eth'},
  {key: 'sol', title: 'Solana', sub: 'SOL · $90.98', big: '-69%', foot: 'Alpenglow live since Oct 21', c: ['#9945FF', '#14F195', '#3E1C7A'], logo: 'sol'},
  {key: 'link', title: 'Chainlink', sub: 'LINK · $10.89', big: '-79%', foot: 'CCIP 2.0 with ANZ, SBI and 600+ banks via Bottomline', c: ['#2A5ADA', '#7AA2FF', '#0E1F5B'], logo: 'link'},
  {key: 'ondo', title: 'Ondo', sub: 'ONDO · $0.381', big: '-82%', foot: 'First tokenizer on DTCC\'s Fund/SERV', c: ['#1E2A44', '#5B8CFF', '#C7D2FE'], logo: 'ondo'},
  {key: 'zec', title: 'Zcash', sub: 'ZEC · $1,232', big: '-61%', foot: 'NU7: blocks 3x faster, from Nov 5', c: ['#F4B728', '#FF7A30', '#7A4A00'], logo: 'zec'},
  {key: 'xlm', title: 'Stellar', sub: 'XLM · $0.157', big: '-82%', foot: 'Bell upgrade, mainnet vote Nov 23', c: ['#3B3B3B', '#B8F26A', '#7DD3FC'], logo: 'xlm'},
  {key: 'cta', title: 'Trade them all', sub: 'on Hotcoin', big: 'hotcoin.com', foot: 'Not financial advice. Prices as of Nov 5, 2026', c: ['#B8F26A', '#7EC25A', '#E8FFD0']},
];
export const SALE_DURATION = STEP * CARDS.length + 30;

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
// carousel position: holds on each card, eases between
const posAt = (f: number) => {
  const i = Math.floor(f / STEP), t = f - i * STEP;
  const p = i + (t < HOLD ? 0 : ease((t - HOLD) / MOVE));
  return Math.min(p, CARDS.length - 1);
};

const Mesh: React.FC<{c: Card['c']; f: number; seed: number}> = ({c, f, seed}) => {
  const a = (k: number) => Math.sin(f / 45 + seed + k) * 12;
  return (
    <AbsoluteFill style={{background: c[2], overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: '120%', height: '90%', left: `${-20 + a(1)}%`, top: `${-25 + a(2)}%`, background: c[0], borderRadius: '50%', filter: 'blur(70px)', opacity: 0.95}} />
      <div style={{position: 'absolute', width: '100%', height: '80%', left: `${30 + a(3)}%`, top: `${40 + a(4)}%`, background: c[1], borderRadius: '50%', filter: 'blur(80px)', opacity: 0.9}} />
      <div style={{position: 'absolute', width: '70%', height: '60%', left: `${-10 + a(5)}%`, top: `${55 + a(6)}%`, background: '#ffffff', borderRadius: '50%', filter: 'blur(90px)', opacity: 0.35}} />
    </AbsoluteFill>
  );
};

// dotted orbit rings (like the reference's dotted spiral)
const Orbit: React.FC<{f: number; size: number}> = ({f, size}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{position: 'absolute', left: '50%', top: '50%', marginLeft: -size / 2, marginTop: -size / 2, overflow: 'visible'}}>
    {Array.from({length: 14}, (_, i) => (
      <ellipse key={i} cx={0} cy={0} rx={92} ry={92 * Math.abs(Math.cos((i / 14) * Math.PI + f / 90))} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth={0.9}
        strokeDasharray="0.5 3.2" strokeLinecap="round" transform={`rotate(${i * 13 + f * 0.4})`} />
    ))}
    <circle r={60} fill="none" stroke="rgba(255,255,255,.9)" strokeWidth={1.4} />
  </svg>
);

const CardFace: React.FC<{card: Card; f: number; i: number; active: number}> = ({card, f, i, active}) => {
  const W = 640, H = 820;
  const isText = !card.logo;
  return (
    <div style={{position: 'relative', width: W, height: H, borderRadius: 44, overflow: 'hidden', boxShadow: '0 40px 90px rgba(20,24,40,.25)', fontFamily: SANS, color: '#fff'}}>
      <Mesh c={card.c} f={f} seed={i * 1.7} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,.14) 1px, transparent 1.3px)', backgroundSize: '14px 14px', mixBlendMode: 'overlay'}} />
      <div style={{position: 'absolute', left: 48, top: 46, right: 48}}>
        <div style={{fontSize: 52, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.02, color: card.key === 'cover' || card.key === 'cta' ? INK : '#fff'}}>{card.title}</div>
        <div style={{fontSize: card.key === 'cover' || card.key === 'cta' ? 52 : 30, fontWeight: card.key === 'cover' || card.key === 'cta' ? 700 : 500, letterSpacing: card.key === 'cover' || card.key === 'cta' ? -1.5 : 0,
          marginTop: 6, color: card.key === 'cover' || card.key === 'cta' ? INK : 'rgba(255,255,255,.78)', fontFamily: card.key === 'cover' || card.key === 'cta' ? SANS : MONO}}>{card.sub}</div>
      </div>
      {!isText && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 210, height: 380}}>
          <Orbit f={f + i * 30} size={400} />
          <div style={{position: 'absolute', left: '50%', top: '50%', width: 150, height: 150, marginLeft: -75, marginTop: -75, borderRadius: 99, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(255,255,255,.6)'}}>
            <Img src={staticFile(`sale/${card.logo}.png`)} style={{width: 104, height: 104, borderRadius: 99, objectFit: 'contain'}} />
          </div>
        </div>
      )}
      <div style={{position: 'absolute', left: 48, right: 48, top: isText ? 300 : 600, fontSize: card.key === 'cta' ? 92 : isText ? 230 : 96, fontWeight: 800, letterSpacing: card.key === 'cta' ? -3 : -6, lineHeight: 1,
        color: isText ? INK : '#fff', textShadow: isText ? 'none' : '0 6px 30px rgba(0,0,0,.25)'}}>
        {card.big}{!isText && <span style={{fontSize: 30, fontWeight: 600, letterSpacing: 0, marginLeft: 14, opacity: 0.85}}>from ATH</span>}
      </div>
      <div style={{position: 'absolute', left: 48, right: 48, bottom: 44, fontSize: 28, fontWeight: 600, lineHeight: 1.25, color: isText ? 'rgba(11,14,17,.75)' : 'rgba(255,255,255,.92)'}}>{card.foot}</div>
      {card.key === 'cta' && <Img src={staticFile('brand/logo-official-black.png')} style={{position: 'absolute', left: 48, top: 520, width: 380}} />}
    </div>
  );
};

export const SaleFlow: React.FC = () => {
  const f = useCurrentFrame();
  const {width: VW, height: VH} = useVideoConfig();
  useFonts();
  const p = posAt(f);
  const intro = interpolate(f, [0, 24], [0, 1], {extrapolateRight: 'clamp'});
  const order = CARDS.map((c, i) => ({c, i, d: i - p})).sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
  return (
    <AbsoluteFill style={{background: '#F1F2F4', overflow: 'hidden', perspective: 1600}}>
      {/* stretched glow bands behind the side cards */}
      {order.map(({c, i, d}) => Math.abs(d) < 0.15 || Math.abs(d) > 2.2 ? null : (
        <div key={'g' + i} style={{position: 'absolute', left: '50%', top: '50%', width: 600, height: 980, marginLeft: -300 + Math.sign(d) * (400 + Math.abs(d) * 170), marginTop: -490,
          background: `linear-gradient(${d > 0 ? 90 : 270}deg, ${c.c[0]}, ${c.c[1]} 55%, rgba(241,242,244,0))`, filter: 'blur(50px)', opacity: 0.9 * Math.min(1, Math.abs(d)) * (1 - Math.max(0, Math.abs(d) - 1.2)),
          transform: `scaleX(${1 + Math.abs(d) * 0.6})`, borderRadius: '40%'}} />
      ))}
      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `translateY(${(1 - intro) * 120}px)`, opacity: intro}}>
        {order.map(({c, i, d}) => {
          const ad = Math.abs(d);
          if (ad > 2.6) return null;
          const x = Math.sign(d) * (Math.min(ad, 1) * 470 + Math.max(0, ad - 1) * 230);
          const z = -ad * 260, ry = -Math.sign(d) * Math.min(ad, 1.4) * 38;
          const sc = 1.08 - Math.min(ad, 2) * 0.07;
          return (
            <div key={c.key} style={{position: 'absolute', left: VW / 2 - 320, top: VH / 2 - 410 + 30, transform: `translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${sc})`,
              opacity: interpolate(ad, [0, 2, 2.6], [1, 0.9, 0]), filter: `saturate(${1 - Math.min(ad, 1) * 0.15})`}}>
              <CardFace card={c} f={f} i={i} active={ad} />
            </div>
          );
        })}
      </AbsoluteFill>
      <Img src={staticFile('brand/logo-official-black.png')} style={{position: 'absolute', left: 60, top: 56, height: 38}} />
      <div style={{position: 'absolute', right: 60, top: 54, fontFamily: MONO, fontSize: 20, letterSpacing: 3, border: `1.5px solid ${INK}`, borderRadius: 99, padding: '9px 18px', color: INK}}>
        {String(Math.round(p) + 1).padStart(2, '0')}/{String(CARDS.length).padStart(2, '0')}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', gap: 12}}>
        {CARDS.map((_, i) => <div key={i} style={{width: Math.abs(i - p) < 0.5 ? 46 : 12, height: 12, borderRadius: 99, background: Math.abs(i - p) < 0.5 ? INK : 'rgba(11,14,17,.2)'}} />)}
      </div>
      <Audio src={staticFile('sale/beat.wav')} />
      <div style={{display: 'none'}}>{LIME}</div>
    </AbsoluteFill>
  );
};
