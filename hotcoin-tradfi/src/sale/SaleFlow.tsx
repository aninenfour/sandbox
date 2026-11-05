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
];
const END = (CARDS.length - 1) * STEP + HOLD; // search-bar finale starts here
export const SALE_DURATION = STEP * 8 + 30; // matches scripts/make-sale-beat.py

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
        <div style={{position: 'absolute', left: 0, right: 0, top: 150, height: 360}}>
          <Orbit f={f + i * 30} size={360} />
          <div style={{position: 'absolute', left: '50%', top: '50%', width: 150, height: 150, marginLeft: -75, marginTop: -75, borderRadius: 99, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(255,255,255,.6)'}}>
            <Img src={staticFile(`sale/${card.logo}.png`)} style={{width: 104, height: 104, borderRadius: 99, objectFit: 'contain'}} />
          </div>
        </div>
      )}
      <div style={{position: 'absolute', left: 48, right: 48, top: isText ? 300 : 520, fontSize: card.key === 'cta' ? 92 : isText ? 230 : 96, fontWeight: 800, letterSpacing: card.key === 'cta' ? -3 : -6, lineHeight: 1,
        color: isText ? INK : '#fff', textShadow: isText ? 'none' : '0 6px 30px rgba(0,0,0,.25)'}}>
        {card.big}{!isText && <span style={{fontSize: 30, fontWeight: 600, letterSpacing: 0, marginLeft: 14, opacity: 0.85}}>from ATH</span>}
      </div>
      {isText ? (
        <div style={{position: 'absolute', left: 48, right: 48, bottom: 44}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, background: INK, color: LIME, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 2, padding: '9px 16px', borderRadius: 10}}>
            <span style={{fontSize: 20}}>▲</span> 6 COINS WE'RE BULLISH ON <span style={{fontSize: 24}}>→</span></div>
          <div style={{fontSize: 30, fontWeight: 600, lineHeight: 1.25, color: 'rgba(11,14,17,.78)', marginTop: 14}}>{card.foot}</div>
        </div>
      ) : (
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 30, padding: '20px 22px 22px', borderRadius: 26, background: 'rgba(255,255,255,.18)', border: '1.5px solid rgba(255,255,255,.45)', backdropFilter: 'blur(14px)'}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, background: LIME, color: INK, fontFamily: MONO, fontWeight: 700, fontSize: 21, letterSpacing: 2, padding: '7px 14px', borderRadius: 10}}>
            <span style={{fontSize: 20}}>▲</span> WHY WE'RE BULLISH</div>
          <div style={{fontSize: 33, fontWeight: 700, lineHeight: 1.2, marginTop: 12, color: '#fff', letterSpacing: -0.4}}>{card.foot}</div>
        </div>
      )}
      {card.key === 'cta' && <Img src={staticFile('brand/logo-official-black.png')} style={{position: 'absolute', left: 48, top: 520, width: 380}} />}
    </div>
  );
};


// finale: a modern search field that types hotcoin.com and presses Go
const Finale: React.FC<{e: number}> = ({e}) => {
  const site = 'hotcoin.com';
  const inn = interpolate(e, [8, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const typed = Math.max(0, Math.min(site.length, Math.floor((e - 28) / 3)));
  const press = e >= 66 && e < 72 ? 0.92 : 1;
  const done = e >= 72;
  const glow = (e % 60) / 60;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: inn, transform: `translateY(${(1 - inn) * 60}px)`}}>
      <div style={{position: 'absolute', width: 900, height: 420, borderRadius: '50%', background: 'conic-gradient(from 0deg, #B8F26A, #7AA2FF, #9945FF, #F4B728, #B8F26A)', filter: 'blur(90px)', opacity: 0.45, transform: `rotate(${glow * 360}deg)`}} />
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 82, letterSpacing: -3.5, color: INK, textAlign: 'center', lineHeight: 1, marginBottom: 54, position: 'relative'}}>Trade them all<br />on <span style={{background: LIME, padding: '0 14px', borderRadius: 14}}>Hotcoin</span></div>
      <div style={{position: 'relative', width: 880, height: 128, borderRadius: 999, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 14px 0 44px', gap: 26,
        boxShadow: `0 0 0 ${done ? 6 : 3}px ${done ? LIME : 'rgba(11,14,17,.08)'}, 0 30px 80px rgba(20,24,40,.18)`}}>
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
        <div style={{flex: 1, fontFamily: SANS, fontWeight: 600, fontSize: 56, letterSpacing: -1, color: INK, whiteSpace: 'nowrap'}}>
          {typed === 0 ? <span style={{color: 'rgba(11,14,17,.35)'}}>Search or type a URL</span> : site.slice(0, typed)}
          <span style={{display: 'inline-block', width: 4, height: 56, marginLeft: 4, verticalAlign: -8, background: INK, opacity: typed > 0 && !done && Math.floor(e / 8) % 2 ? 1 : typed === 0 ? 0 : 0.0 + (done ? 0 : 1)}} />
        </div>
        <div style={{width: 100, height: 100, borderRadius: 999, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${press})`}}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={LIME} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </div>
      </div>
      <div style={{position: 'relative', marginTop: 40, fontFamily: MONO, fontSize: 22, letterSpacing: 1.5, color: 'rgba(11,14,17,.55)'}}>Not financial advice · Prices as of Nov 5, 2026</div>
    </AbsoluteFill>
  );
};

export const SaleFlow: React.FC = () => {
  const f = useCurrentFrame();
  const {width: VW, height: VH} = useVideoConfig();
  useFonts();
  const p = posAt(f);
  const e = f - END, out = interpolate(e, [0, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const order = CARDS.map((c, i) => ({c, i, d: i - p})).sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
  return (
    <AbsoluteFill style={{background: '#F1F2F4', overflow: 'hidden', perspective: 1600}}>
      {/* stretched glow bands behind the side cards */}
      {order.map(({c, i, d}) => Math.abs(d) < 0.15 || Math.abs(d) > 2.2 ? null : (
        <div key={'g' + i} style={{position: 'absolute', left: '50%', top: '50%', width: 600, height: 980, marginLeft: -300 + Math.sign(d) * (400 + Math.abs(d) * 170), marginTop: -490,
          background: `linear-gradient(${d > 0 ? 90 : 270}deg, ${c.c[0]}, ${c.c[1]} 55%, rgba(241,242,244,0))`, filter: 'blur(50px)', opacity: 0.9 * Math.min(1, Math.abs(d)) * (1 - Math.max(0, Math.abs(d) - 1.2)),
          transform: `scaleX(${1 + Math.abs(d) * 0.6})`, borderRadius: '40%'}} />
      ))}
      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `translateY(${-out * 260}px) scale(${1 - out * 0.35})`, opacity: 1 - out, filter: `blur(${out * 12}px)`}}>
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
      <div style={{position: 'absolute', opacity: 1 - out, right: 60, top: 54, fontFamily: MONO, fontSize: 20, letterSpacing: 3, border: `1.5px solid ${INK}`, borderRadius: 99, padding: '9px 18px', color: INK}}>
        {String(Math.round(p) + 1).padStart(2, '0')}/{String(CARDS.length).padStart(2, '0')}
      </div>
      <div style={{position: 'absolute', opacity: 1 - out, left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', gap: 12}}>
        {CARDS.map((_, i) => <div key={i} style={{width: Math.abs(i - p) < 0.5 ? 46 : 12, height: 12, borderRadius: 99, background: Math.abs(i - p) < 0.5 ? INK : 'rgba(11,14,17,.2)'}} />)}
      </div>
      {e > 0 && <Finale e={e} />}
      <Audio src={staticFile('sale/beat.wav')} />
      <div style={{display: 'none'}}>{LIME}</div>
    </AbsoluteFill>
  );
};
