// "iPhone Upgrade Season: 1 day left". 4-slide carousel (1080 x 1350 each) on one continuous banknote strip.
// Campaign: hotcoin.com/en_US/campaign/noticeActivity/457, ends 2026/10/12 23:59 (UTC+8).
// Key visual cropped from Hotcoin's own campaign page. Background: Pexels 9539616 + 6468225 (scripts/make-iphone-bg.py).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const INK = '#050706', LIME = '#B8F26A', WHITE = '#F2F3EE', MUTED = '#A9B2AA';
const DISPLAY = 'Unbounded, sans-serif', SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['900 80px Unbounded', '800 80px Unbounded', '600 30px "Inter Tight"', '500 30px "Inter Tight"', '700 20px "JetBrains Mono"'].map((f) => document.fonts.load(f)))
      .then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};

const Frame: React.FC<{i: number; children: React.ReactNode}> = ({i, children}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: INK, color: WHITE, fontFamily: SANS, overflow: 'hidden'}}>
      <Img src={staticFile('iphone/bg-strip.jpg')} style={{position: 'absolute', left: -i * 1080, top: 0, width: 4320, height: 1350}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(5,7,6,0.45), rgba(5,7,6,0.9) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,7,6,0.75) 0%, rgba(5,7,6,0) 30%, rgba(5,7,6,0) 60%, rgba(5,7,6,0.85) 100%)'}} />
      {/* one lime line runs through the whole carousel */}
      <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
        <path d={['M 0 1200 C 300 1200 700 1120 1080 1160', 'M 0 1160 C 400 1200 700 1240 1080 1230', 'M 0 1230 C 300 1220 700 1140 1080 1150', 'M 0 1150 C 300 1160 600 1190 760 1190'][i]} fill="none" stroke={LIME} strokeWidth={5} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: 72, right: 72, top: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 200, height: (200 * 328) / 2005}} />
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: 3, color: INK, background: LIME, padding: '9px 16px', borderRadius: 6}}>{i + 1} / 4</div>
      </div>
      <AbsoluteFill style={{padding: '170px 72px 0'}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const Kicker: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: LIME}}>{children}</div>
);
const KV: React.FC<{w: number; style?: React.CSSProperties}> = ({w, style}) => (
  <Img src={staticFile('iphone/kv.png')} style={{width: w, height: (w * 790) / 850, mixBlendMode: 'lighten',
    WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 78%, transparent 100%)', maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 78%, transparent 100%)', ...style}} />
);

export const IPhone1: React.FC = () => (
  <Frame i={0}>
    <div style={{display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 14, background: '#FF3B3B', color: '#fff', borderRadius: 100, padding: '12px 26px 12px 18px', fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 3}}>
      <span style={{width: 14, height: 14, borderRadius: 7, background: '#fff'}} /> LAST CALL
    </div>
    <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 168, lineHeight: 0.9, letterSpacing: -6, marginTop: 34}}>1 DAY</div>
    <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 168, lineHeight: 0.9, letterSpacing: -6, color: LIME}}>LEFT</div>
    <div style={{fontSize: 40, fontWeight: 600, marginTop: 30, letterSpacing: -0.5}}>iPhone Upgrade Season</div>
    <div style={{fontSize: 30, color: MUTED, marginTop: 8}}>Refer. Trade. Win.</div>
    <KV w={580} style={{position: 'absolute', right: 24, bottom: 165}} />
    <div style={{position: 'absolute', left: 72, bottom: 215, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: WHITE}}>ENDS 12 OCT · 23:59 (UTC+8)</div>
  </Frame>
);

export const IPhone2: React.FC = () => (
  <Frame i={1}>
    <Kicker>EVENT 1 · REFER A FRIEND</Kicker>
    <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 104, lineHeight: 0.95, letterSpacing: -4, marginTop: 26}}>You get<br /><span style={{color: LIME}}>10 USDT.</span><br />They get<br /><span style={{color: LIME}}>10 USDT.</span></div>
    <div style={{marginTop: 54, display: 'flex', gap: 18}}>
      <div style={{flex: 1, border: `2px solid ${LIME}`, borderRadius: 22, padding: '26px 28px', background: 'rgba(5,7,6,0.7)'}}>
        <div style={{fontSize: 22, color: MUTED}}>Prize pool</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, color: LIME, marginTop: 6}}>150,000</div>
        <div style={{fontSize: 24, fontWeight: 600}}>USDT</div>
      </div>
      <div style={{flex: 1.3, border: '1px solid rgba(242,243,238,0.25)', borderRadius: 22, padding: '26px 28px', background: 'rgba(5,7,6,0.7)', fontSize: 24, lineHeight: 1.45}}>
        <div style={{fontSize: 22, color: MUTED, marginBottom: 8}}>Your friend</div>
        Deposits 300+ USDT<br />Trades futures on 5 days
      </div>
    </div>
  </Frame>
);

const TIERS: [string, string][] = [['100K', 'iPhone 18 Pro 256G'], ['200K', 'iPhone 18 Pro Max 2T'], ['300K', 'iPhone Duo 2T']];
export const IPhone3: React.FC = () => (
  <Frame i={2}>
    <Kicker>EVENT 2 · REFER &amp; TRADE</Kicker>
    <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 96, lineHeight: 0.95, letterSpacing: -4, marginTop: 26}}>Win a<br /><span style={{color: LIME}}>new iPhone.</span></div>
    <div style={{fontSize: 30, color: MUTED, marginTop: 24}}>Refer 3+ friends. Their futures fees unlock your prize.</div>
    <div style={{marginTop: 50, display: 'flex', flexDirection: 'column', gap: 16}}>
      {TIERS.map(([fee, prize], k) => (
        <div key={fee} style={{display: 'flex', alignItems: 'center', gap: 26, borderRadius: 22, padding: '24px 30px', background: k === 2 ? LIME : 'rgba(5,7,6,0.72)', color: k === 2 ? INK : WHITE, border: k === 2 ? 'none' : '1px solid rgba(242,243,238,0.25)'}}>
          <div style={{width: 210}}>
            <div style={{fontSize: 18, opacity: 0.7}}>fees from referrals</div>
            <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 46}}>{fee}</div>
          </div>
          <div style={{fontSize: 34, fontWeight: 600, letterSpacing: -0.5}}>{prize}</div>
        </div>
      ))}
    </div>
    <div style={{fontSize: 20, color: MUTED, marginTop: 18}}>Futures trading fees in USDT, generated by your qualified direct referrals.</div>
  </Frame>
);

export const IPhone4: React.FC = () => (
  <Frame i={3}>
    <Kicker>DON'T MISS IT</Kicker>
    <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 112, lineHeight: 0.92, letterSpacing: -4.5, marginTop: 26}}>Ends<br /><span style={{color: LIME}}>tomorrow.</span></div>
    <div style={{display: 'flex', gap: 14, marginTop: 44, alignItems: 'center'}}>
      {[['12', 'OCT'], ['23:59', 'UTC+8']].map(([a, b]) => (
        <div key={a} style={{background: 'rgba(5,7,6,0.75)', border: '1px solid rgba(242,243,238,0.25)', borderRadius: 18, padding: '18px 26px', textAlign: 'center'}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 54}}>{a}</div>
          <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: MUTED}}>{b}</div>
        </div>
      ))}
    </div>
    <KV w={560} style={{position: 'absolute', right: 40, top: 520}} />
    <div style={{position: 'absolute', left: 72, bottom: 260, display: 'flex', flexDirection: 'column', gap: 18}}>
      <div style={{background: LIME, color: INK, borderRadius: 18, padding: '26px 44px', fontWeight: 700, fontSize: 40, textAlign: 'center', width: 420, boxShadow: `0 0 50px ${LIME}55`}}>Join now</div>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 1, color: WHITE}}>hotcoin.com · Rewards Hub</div>
    </div>
  </Frame>
);
