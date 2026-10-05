// "Trade anything with USDT": four 1080 x 1350 slides cut from one 4320 x 1350 canvas over the engraved $5 note.
// Facts and prices from hotcoin.com (homepage and /tradFi), 4 Oct 2026:
//   "Trade crypto, US stocks, precious metals, and more with stablecoins, all in one place."
//   TradFi: from a minimum of 10 USDT, 24/7 trading, fees from 0; metals, commodities, forex, indices, US/JP/KR/HK stocks, bonds.
// Stock logos via financialmodelingprep.com image-stock; crypto logos are CoinGecko's. Gold uses a drawn Au coin.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

export const TRADE_W = 4320, TRADE_H = 1350;
const LIME = '#B8F26A', WHITE = '#F4F5F2', GREY = '#9BA39D', INK = '#050807', UP = '#2DBD85', DOWN = '#F6465D';
const SANS = '"Inter Tight", sans-serif', SERIF = '"Instrument Serif", serif', MONO = '"IBM Plex Mono", monospace', UI = 'Roboto, sans-serif';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['500 96px "Inter Tight"', '600 96px "Inter Tight"', '400 30px "Inter Tight"', 'italic 400 96px "Instrument Serif"', '500 24px "IBM Plex Mono"', '400 30px Roboto', '500 30px Roboto', '700 30px Roboto']
      .map((s) => document.fonts.load(s))).then(() => continueRender(h));
  }, [h]);
};

type Asset = {sym: string; name: string; tag: string; price: string; chg: string; logo?: string; badge?: string};
const MIXED: Asset[] = [
  {sym: 'BTC', name: 'Bitcoin', tag: 'Crypto', price: '86,489.4', chg: '+2.11%', logo: 'meme/logos/BTC.png'},
  {sym: 'TSLA', logo: 'trade/logos/TSLA.png', name: 'Tesla', tag: 'US Stocks', price: '372.59', chg: '+0.33%'},
  {sym: 'XAU', name: 'Gold', tag: 'Metals', price: '4,146.44', chg: '-0.01%', badge: 'Au'},
  {sym: 'ETH', name: 'Ethereum', tag: 'Crypto', price: '2,725.87', chg: '+1.46%', logo: 'meme/logos/ETH.png'},
  {sym: 'SPY', logo: 'trade/logos/SPY.png', name: 'S&P 500 ETF', tag: 'ETFs', price: '770.95', chg: '-0.06%'},
  {sym: 'NVDA', logo: 'trade/logos/NVDA.png', name: 'NVIDIA', tag: 'US Stocks', price: '235.31', chg: '+0.10%'},
  {sym: 'SOL', name: 'Solana', tag: 'Crypto', price: '121.47', chg: '+1.54%', logo: 'meme/logos/SOL.png'},
];
const TRADFI: Asset[] = [
  {sym: 'SNDK', logo: 'trade/logos/SNDK.png', name: 'SanDisk', tag: '20X', price: '1,727.67', chg: '+0.45%'},
  {sym: 'NVDA', logo: 'trade/logos/NVDA.png', name: 'NVIDIA', tag: '10X', price: '235.31', chg: '+0.10%'},
  {sym: 'MU', logo: 'trade/logos/MU.png', name: 'Micron Technology', tag: '10X', price: '1,075.94', chg: '+0.51%'},
  {sym: 'TSLA', logo: 'trade/logos/TSLA.png', name: 'Tesla', tag: '10X', price: '372.59', chg: '+0.33%'},
  {sym: 'XAU', name: 'Gold', tag: 'Metals', price: '4,146.44', chg: '-0.01%', badge: 'Au'},
  {sym: 'SPY', logo: 'trade/logos/SPY.png', name: 'S&P 500 ETF', tag: 'ETF', price: '770.95', chg: '-0.06%'},
];

// ---------- phone ----------
const PW = 500, PH = 1020;
const Phone: React.FC<{x: number; y: number; rot?: number; children: React.ReactNode}> = ({x, y, rot = 0, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: PW, height: PH, transform: `rotate(${rot}deg)`, borderRadius: 64, padding: 14, boxSizing: 'border-box',
    background: 'linear-gradient(145deg, #2A2F2C, #0B0D0C 40%, #1B1F1D)', boxShadow: '0 50px 90px rgba(0,0,0,0.65), 0 0 70px rgba(126,194,90,0.18), inset 0 0 0 2px rgba(255,255,255,0.08)'}}>
    <div style={{width: '100%', height: '100%', borderRadius: 52, overflow: 'hidden', background: '#0B0E11', position: 'relative', fontFamily: UI, color: WHITE}}>
      <div style={{height: 54, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 34px 0', fontSize: 20, fontWeight: 500}}>
        <span>9:41</span><span style={{width: 110, height: 30, borderRadius: 20, background: '#000', marginTop: 4}} /><span>5G ▮</span>
      </div>
      {children}
    </div>
  </div>
);
const Avatar: React.FC<{a: Asset; size?: number}> = ({a, size = 46}) => a.logo
  ? (a.logo.startsWith('trade/')
    ? <div style={{width: size, height: size, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <Img src={staticFile(a.logo)} style={{width: size * 0.66, height: size * 0.66, objectFit: 'contain'}} />
      </div>
    : <Img src={staticFile(a.logo)} style={{width: size, height: size, borderRadius: '50%'}} />)
  : <div style={{width: size, height: size, borderRadius: '50%', background: a.badge ? 'radial-gradient(circle at 35% 30%, #FFE9A0, #D4A93A 60%, #8C6A1C)' : '#1E2329',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.34, fontWeight: 700, color: a.badge ? '#3A2A05' : WHITE}}>{a.badge ?? a.sym.slice(0, 2)}</div>;
const Row: React.FC<{a: Asset; hot?: boolean}> = ({a, hot}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px', height: 92, background: hot ? 'rgba(184,242,106,0.08)' : 'transparent',
    borderLeft: hot ? `4px solid ${LIME}` : '4px solid transparent'}}>
    <Avatar a={a} />
    <div style={{flex: 1}}>
      <div style={{fontSize: 25, fontWeight: 700}}>{a.sym}<span style={{color: '#848E9C', fontWeight: 400, fontSize: 19}}> /USDT</span></div>
      <div style={{fontSize: 17, color: '#848E9C', marginTop: 3}}>{a.name} · {a.tag}</div>
    </div>
    <div style={{textAlign: 'right'}}>
      <div style={{fontSize: 23, fontWeight: 500, fontVariantNumeric: 'tabular-nums'}}>{a.price}</div>
      <div style={{display: 'inline-block', marginTop: 5, fontSize: 17, fontWeight: 500, color: '#fff', background: a.chg.startsWith('-') ? DOWN : UP, borderRadius: 6, padding: '3px 10px'}}>{a.chg}</div>
    </div>
  </div>
);
const Tabs: React.FC<{items: string[]; on: number}> = ({items, on}) => (
  <div style={{display: 'flex', gap: 10, padding: '14px 26px 18px', overflow: 'hidden'}}>
    {items.map((t, i) => (
      <div key={t} style={{fontSize: 19, fontWeight: 500, padding: '9px 16px', borderRadius: 30, whiteSpace: 'nowrap', background: i === on ? LIME : '#1E2329', color: i === on ? INK : '#B7BDC6'}}>{t}</div>
    ))}
  </div>
);

// ---------- copy blocks ----------
const S = (i: number) => i * 1080;
const Logo: React.FC<{i: number}> = ({i}) => (
  <Img src={staticFile('brand/logo-official-white.png')} style={{position: 'absolute', left: S(i) + 80, top: 78, width: 190, height: (190 * 328) / 2005}} />
);
const Page: React.FC<{i: number}> = ({i}) => (
  <div style={{position: 'absolute', left: S(i) + 1080 - 200, top: 84, width: 120, textAlign: 'right', fontFamily: MONO, fontSize: 22, color: GREY}}><span style={{color: WHITE}}>0{i + 1}</span> / 04</div>
);
const Step: React.FC<{i: number; n?: string; head: React.ReactNode; sub: string; top?: number; subW?: number}> = ({i, n, head, sub, top = 190, subW = 920}) => (
  <div style={{position: 'absolute', left: S(i) + 80, top, width: 920}}>
    {n ? <div style={{display: 'inline-block', fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: 2, color: INK, background: LIME, borderRadius: 30, padding: '6px 16px', marginBottom: 22}}>STEP {n}</div> : null}
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 96, lineHeight: 1.0, letterSpacing: -3.8, color: WHITE}}>{head}</div>
    <div style={{fontFamily: SANS, fontSize: 34, lineHeight: 1.3, color: GREY, marginTop: 20, width: subW}}>{sub}</div>
  </div>
);
const Em: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: '1.12em', letterSpacing: -1, color: LIME}}>{children}</span>
);
const Chip: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 27, color: WHITE, padding: '12px 22px', borderRadius: 40, border: '1.5px solid rgba(184,242,106,0.55)', background: 'rgba(5,8,7,0.7)', whiteSpace: 'nowrap'}}>{children}</div>
);

export const TradeCarousel: React.FC = () => {
  useFonts();
  const phoneY = 420;
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <Img src={staticFile('referral/bill-bg.png')} style={{position: 'absolute', inset: 0, width: TRADE_W, height: TRADE_H}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,8,7,0.82) 0%, rgba(5,8,7,0.45) 40%, rgba(5,8,7,0.55) 75%, rgba(5,8,7,0.9) 100%)'}} />
      <AbsoluteFill style={{background: [0, 1, 2, 3].map((i) => `radial-gradient(ellipse 380px 520px at ${S(i) + 760}px 900px, rgba(126,194,90,0.22), transparent 70%)`).join(',')}} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.2}} />

      {/* 01: the promise */}
      <Logo i={0} /><Page i={0} />
      <Step i={0} top={190} head={<>Trade anything.<br /><Em>With USDT.</Em></>} sub="Crypto, US stocks, gold, ETFs and more. One app." subW={420} />
      <div style={{position: 'absolute', left: 80, top: 660, display: 'flex', flexDirection: 'column', gap: 14}}>
        {['₿  Crypto', '📈  US stocks', '🥇  Gold & metals', '🌍  Forex & indices', '📊  ETFs'].map((c) => <div key={c} style={{display: 'flex'}}><Chip>{c}</Chip></div>)}
      </div>
      <div style={{position: 'absolute', left: 82, top: 1214, fontFamily: MONO, fontSize: 22, color: GREY}}>Swipe for 3 steps →</div>
      <Phone x={520} y={phoneY} rot={4}>
        <div style={{padding: '18px 26px 6px', fontSize: 34, fontWeight: 700}}>Markets</div>
        <Tabs items={['All', 'Crypto', 'Stocks', 'Metals', 'ETFs']} on={0} />
        {MIXED.map((a) => <Row key={a.sym + a.tag} a={a} />)}
      </Phone>

      {/* 02: deposit */}
      <Page i={1} />
      <Step i={1} n="1" head={<>Deposit<br /><Em>USDT.</Em></>} sub="One balance for every market." subW={560} />
      <Phone x={S(1) + 300} y={phoneY + 110} rot={-3}>
        <Img src={staticFile('guess/wallet.jpg')} style={{width: '100%', display: 'block', marginTop: -40}} />
      </Phone>
      <div style={{position: 'absolute', left: S(1) + 80, top: 1200, display: 'flex', gap: 12, zIndex: 2}}><Chip>Stablecoins in</Chip><Chip>Ready in one tap</Chip></div>

      {/* 03: pick a market */}
      <Page i={2} />
      <Step i={2} n="2" head={<>Pick any<br /><Em>market.</Em></>} sub="US stocks, metals, commodities, forex, indices, bonds." subW={420} />
      <Phone x={S(2) + 520} y={phoneY + 60} rot={3}>
        <div style={{padding: '18px 26px 6px', fontSize: 34, fontWeight: 700}}>TradFi</div>
        <Tabs items={['US Stocks', 'Metals', 'Forex', 'Index', 'ETF']} on={0} />
        {TRADFI.map((a, k) => <Row key={a.sym} a={a} hot={k === 1} />)}
      </Phone>
      <div style={{position: 'absolute', left: S(2) + 80, top: 700, width: 400, display: 'flex', flexDirection: 'column', gap: 14}}>
        {['US · JP · KR · HK stocks', 'Gold & silver', 'Forex & indices', 'Up to 20X'].map((c) => <div key={c} style={{display: 'flex'}}><Chip>{c}</Chip></div>)}
      </div>

      {/* 04: trade */}
      <Logo i={3} /><Page i={3} />
      <Step i={3} n="3" head={<>Tap buy.<br /><Em>Done.</Em></>} sub="Same app, same balance, any asset." subW={420} />
      <Phone x={S(3) + 520} y={phoneY + 60} rot={-3}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '20px 26px'}}>
          <Avatar a={TRADFI[1]} size={52} />
          <div><div style={{fontSize: 28, fontWeight: 700}}>NVDA<span style={{color: '#848E9C', fontWeight: 400, fontSize: 20}}> /USDT</span></div><div style={{fontSize: 18, color: '#848E9C'}}>NVIDIA · US Stocks</div></div>
        </div>
        <div style={{padding: '0 26px', fontSize: 52, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>235.31 <span style={{fontSize: 22, color: UP, fontWeight: 500}}>+0.10%</span></div>
        <svg width={472} height={230} style={{display: 'block', margin: '18px 0'}}>
          <defs><linearGradient id="gf" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={UP} stopOpacity={0.35} /><stop offset="1" stopColor={UP} stopOpacity={0} /></linearGradient></defs>
          {(() => {
            const pts = Array.from({length: 40}, (_, i) => [10 + i * 11.5, 170 - i * 2.4 - 26 * Math.sin(i / 3.2) - 10 * Math.sin(i * 1.7)]);
            const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
            return <><path d={`${d} L ${pts[39][0]},230 L 10,230 Z`} fill="url(#gf)" /><path d={d} fill="none" stroke={UP} strokeWidth={4} /></>;
          })()}
        </svg>
        <div style={{margin: '0 26px', padding: 22, borderRadius: 20, background: '#15191E'}}>
          <div style={{display: 'flex', background: '#0B0E11', borderRadius: 12, padding: 5}}>
            <div style={{flex: 1, textAlign: 'center', padding: 12, borderRadius: 9, background: UP, fontSize: 22, fontWeight: 700}}>Buy</div>
            <div style={{flex: 1, textAlign: 'center', padding: 12, fontSize: 22, color: '#848E9C'}}>Sell</div>
          </div>
          <div style={{fontSize: 18, color: '#848E9C', marginTop: 20}}>Amount</div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, padding: '14px 16px', borderRadius: 12, border: `2px solid ${LIME}`}}>
            <span style={{fontSize: 34, fontWeight: 700}}>10</span><span style={{fontSize: 20, color: '#848E9C'}}>USDT</span>
          </div>
          <div style={{marginTop: 22, textAlign: 'center', padding: 18, borderRadius: 14, background: UP, fontSize: 26, fontWeight: 700}}>Buy NVDA</div>
        </div>
      </Phone>
      <div style={{position: 'absolute', left: S(3) + 80, top: 660, display: 'flex', flexDirection: 'column', gap: 14}}>
        {['From 10 USDT', 'Trade 24/7', 'Fees from 0'].map((c) => <div key={c} style={{display: 'flex'}}><Chip>{c}</Chip></div>)}
      </div>
      <div style={{position: 'absolute', left: S(3) + 80, top: 940, fontFamily: SANS, fontWeight: 600, fontSize: 32, color: INK, background: LIME, padding: '18px 34px', borderRadius: 50}}>Start on Hotcoin</div>
      <div style={{position: 'absolute', left: S(3) + 82, top: 1040, fontFamily: MONO, fontWeight: 500, fontSize: 24, color: WHITE}}>hotcoin.com</div>
      <div style={{position: 'absolute', left: S(3) + 80, top: 1255, width: 420, fontFamily: SANS, fontSize: 17, lineHeight: 1.4, color: GREY}}>
        Prices from hotcoin.com, 4 Oct 2026, for illustration. Leveraged and TradFi products carry high risk. T&amp;Cs apply.
      </div>
    </AbsoluteFill>
  );
};
