// "Red vs Blue" PolitiFi market-cap comparison, 1080x1350, white background.
// Data: CoinMarketCap (TRUMP, MELANIA, MAGA) and DexScreener top Solana pair (BODEN, KAMA), snapshot in data.json.
// Coin logos: CoinGecko (public/politifi/{SYM}.png). Sources and date go in the post copy, not on the graphic.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {INK, MONO, SANS, useFonts} from '../promo4/kit';
import data from './data.json';

const RED = '#E5484D', BLUE = '#2F6FE0', GRAY = '#6B7280', LINE = '#E6E8EB';
type Tok = {sym: string; name: string; mc: number; ch: number};

const usd = (v: number) => v >= 1e9 ? `$${(v / 1e9).toFixed(2)}B` : v >= 1e6 ? `$${(v / 1e6).toFixed(v >= 1e8 ? 0 : 1)}M` : `$${(v / 1e3).toFixed(0)}K`;
const sum = (a: Tok[]) => a.reduce((s, t) => s + t.mc, 0);

const Row: React.FC<{t: Tok; color: string}> = ({t, color}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '22px 0', borderTop: `1.5px solid ${LINE}`}}>
    <div style={{width: 64, height: 64, borderRadius: 32, overflow: 'hidden', flexShrink: 0, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 26}}>
      <Img src={staticFile(`politifi/${t.sym}.png`)} style={{width: 64, height: 64, objectFit: 'cover'}} />
    </div>
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{fontSize: 32, fontWeight: 700, color: INK, letterSpacing: -0.5}}>${t.sym}</div>
      <div style={{fontSize: 20, color: GRAY, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{t.name}</div>
    </div>
    <div style={{textAlign: 'right'}}>
      <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 500, color: INK}}>{usd(t.mc)}</div>
      <div style={{fontFamily: MONO, fontSize: 20, marginTop: 4, color: t.ch >= 0 ? '#16A34A' : '#DC2626'}}>{t.ch >= 0 ? '+' : ''}{t.ch.toFixed(2)}%</div>
    </div>
  </div>
);

const Column: React.FC<{label: string; color: string; toks: Tok[]}> = ({label, color, toks}) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
      <div style={{width: 16, height: 16, borderRadius: 4, background: color}} />
      <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 500, letterSpacing: 3, color}}>{label}</div>
    </div>
    <div style={{fontSize: 92, fontWeight: 700, color, letterSpacing: -3, lineHeight: 1, marginTop: 22}}>{usd(sum(toks))}</div>
    <div style={{fontSize: 22, color: GRAY, marginTop: 10, marginBottom: 26}}>combined market cap · {toks.length} tokens</div>
    {toks.map((t) => <Row key={t.sym} t={t} color={color} />)}
  </div>
);

export const RedBlue: React.FC = () => {
  useFonts();
  const red = data.red as Tok[], blue = data.blue as Tok[];
  const r = sum(red), b = sum(blue), share = r / (r + b);
  const ratio = Math.round(r / b / 10) * 10;
  return (
    <AbsoluteFill style={{background: '#FFFFFF', fontFamily: SANS, color: INK, padding: '72px 72px 64px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{height: 44}} />
        <div style={{fontFamily: MONO, fontSize: 20, letterSpacing: 2, color: INK, border: `1.5px solid ${INK}`, borderRadius: 999, padding: '10px 20px'}}>POLITIFI · {data.asof.toUpperCase()}</div>
      </div>

      <div style={{marginTop: 70}}>
        <div style={{fontSize: 132, fontWeight: 700, letterSpacing: -5, lineHeight: 0.95}}>
          <span style={{color: RED}}>Red</span> vs <span style={{color: BLUE}}>Blue.</span>
        </div>
        <div style={{fontSize: 46, fontWeight: 600, color: GRAY, letterSpacing: -1, marginTop: 16}}>Election day, on-chain.</div>
      </div>

      <div style={{marginTop: 64}}>
        <div style={{display: 'flex', height: 64, borderRadius: 14, overflow: 'hidden', gap: 6}}>
          <div style={{flex: share, background: RED}} />
          <div style={{width: 14, background: BLUE, borderRadius: 6}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16, fontFamily: MONO, fontSize: 22}}>
          <span style={{color: RED}}>{(share * 100).toFixed(1)}%</span>
          <span style={{color: INK, fontWeight: 500, letterSpacing: 1}}>RED IS ~{ratio}× BIGGER</span>
          <span style={{color: BLUE}}>{((1 - share) * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div style={{display: 'flex', gap: 0, marginTop: 64, flex: 1}}>
        <Column label="RED-CODED" color={RED} toks={red} />
        <div style={{width: 1.5, background: LINE, margin: '0 44px'}} />
        <Column label="BLUE-CODED" color={BLUE} toks={blue} />
      </div>
    </AbsoluteFill>
  );
};
