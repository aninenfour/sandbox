// Chain Pulse: four 1080 x 1350 slides in the Meme Pulse light style (white, lime, engraved coin art).
// Data (13 Oct 2026): DefiLlama (chain TVL + history, DEX volume by chain over 30 days, stablecoins by chain,
// chain fees over 12 months) and CoinGecko (token logos). Base, Robinhood and Arc icons are from their own sites.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import data from './data.json';

const BG = '#FFFFFF', INK = '#0B0E11', SOFT = '#F3F4F1', LINE = '#E6E8E3', MUTED = '#8A9099', LIME = '#B8F26A', GREEN = '#2F9E44', RED = '#E5484D';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';
const B = (v: number) => `$${(v / 1e9).toFixed(1)}B`;
const pct = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(0)}%`;
const logo = (l: string) => staticFile(`chains26/${l}.png`);

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 80px "Inter Tight"', '500 20px "Inter Tight"', '400 20px "Inter Tight"', '500 16px "JetBrains Mono"'].map((f) => document.fonts.load(f)))
      .then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};

type Art = {src: string; right: number; top: number; size: number; rot: number; op?: number};
const Frame: React.FC<{page: string; art?: Art; children: React.ReactNode}> = ({page, art, children}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: BG, color: INK, fontFamily: SANS, padding: '70px 76px 56px'}}>
      {art ? <Img src={staticFile(art.src)} style={{position: 'absolute', right: art.right, top: art.top, width: art.size, height: art.size, transform: `rotate(${art.rot}deg)`, opacity: art.op ?? 0.55,
        WebkitMaskImage: 'radial-gradient(circle at 60% 40%, #000 45%, transparent 78%)', maskImage: 'radial-gradient(circle at 60% 40%, #000 45%, transparent 78%)'}} /> : null}
      <div style={{position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 170, height: (170 * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 16, letterSpacing: 2, color: INK, border: `1.5px solid ${INK}`, borderRadius: 100, padding: '8px 18px', background: BG}}>CHAIN PULSE · {page}</div>
      </div>
      <div style={{position: 'relative', flex: 1, display: 'flex', flexDirection: 'column'}}>{children}</div>
      <div style={{fontFamily: MONO, fontSize: 14, color: MUTED, letterSpacing: 0.5}}>Data: DefiLlama, CoinGecko · {data.asOf} · Not financial advice</div>
    </AbsoluteFill>
  );
};
const Title: React.FC<{a: string; b: string}> = ({a, b}) => (
  <div style={{position: 'relative', marginTop: 70, fontWeight: 600, fontSize: 104, lineHeight: 0.98, letterSpacing: -4.5}}>{a}<br /><span style={{color: MUTED}}>{b}</span></div>
);
const Logo: React.FC<{l: string; s?: number}> = ({l, s = 56}) => <Img src={logo(l)} style={{width: s, height: s, borderRadius: l === 'base' || l === 'robinhood' ? s * 0.22 : s / 2, border: `1px solid ${LINE}`, flexShrink: 0}} />;

// ---------- 1: Base flips Solana ----------
export const ChainBase: React.FC = () => {
  const rows = data.ytd;
  const max = Math.max(...rows.map((r) => Math.abs(r.ytd)));
  return (
    <Frame page="1/4" art={{src: 'chains26/ethereum-engraved.png', right: -260, top: 110, size: 900, rot: -10}}>
      <Title a="Base flips" b="Solana." />
      <div style={{position: 'relative', marginTop: 56, display: 'flex', alignItems: 'flex-end', gap: 26}}>
        <div style={{fontWeight: 600, fontSize: 150, lineHeight: 0.8, letterSpacing: -7}}>+{Math.round(data.ytd[1].ytd)}%</div>
        <div style={{fontSize: 26, color: '#4A5058', lineHeight: 1.25, paddingBottom: 6}}>Base DeFi TVL this year.<br />Now #2 of all chains.</div>
      </div>
      <div style={{flex: 1}} />
      <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: MUTED, marginBottom: 14}}>TVL CHANGE SINCE 1 JAN · TVL NOW</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40}}>
        {rows.map((r) => {
          const hot = r.name === 'Base', w = (Math.abs(r.ytd) / max) * 34;
          return (
            <div key={r.name} style={{display: 'flex', alignItems: 'center', gap: 18, height: 74, borderBottom: `1px solid ${LINE}`, background: BG}}>
              <Logo l={r.logo} s={50} />
              <div style={{width: 150, fontWeight: 600, fontSize: 28, letterSpacing: -0.5}}>{r.name}</div>
              <div style={{flex: 1, height: 40, position: 'relative'}}>
                <div style={{position: 'absolute', left: '50%', top: -8, bottom: -8, width: 1.5, background: '#CDD1CA'}} />
                <div style={{position: 'absolute', top: 0, bottom: 0, borderRadius: 10, ...(r.ytd >= 0 ? {left: '50%'} : {right: '50%'}), width: `${w}%`,
                  background: hot ? LIME : r.ytd >= 0 ? '#DDEFD0' : SOFT, border: hot ? `2px solid ${INK}` : `1px solid ${LINE}`}} />
                <div style={{position: 'absolute', top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 23, color: r.ytd >= 0 ? GREEN : RED,
                  ...(r.ytd >= 0 ? {left: `calc(${50 + w}% + 12px)`} : {right: `calc(${50 + w}% + 12px)`})}}>{pct(r.ytd)}</div>
              </div>
              <div style={{width: 100, textAlign: 'right', fontWeight: 500, fontSize: 24}}>{B(r.now)}</div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

// ---------- 2: Robinhood Chain, #3 in DEX volume ----------
export const ChainDex: React.FC = () => {
  const rows = data.dex;
  const max = rows[0].v;
  return (
    <Frame page="2/4" art={{src: 'chains26/solana-engraved.png', right: -170, top: -120, size: 560, rot: 8, op: 0.5}}>
      <Title a="3 months old." b="#3 in DEX volume." />
      <div style={{fontSize: 28, color: '#4A5058', marginTop: 26, lineHeight: 1.3}}>Robinhood Chain went live in July.<br />It already trades more than Base and BSC.</div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: MUTED, marginBottom: 14}}>
        <span>DEX VOLUME · LAST 30 DAYS</span><span>SHARE</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40}}>
        {rows.map((r, i) => {
          const hot = r.name === 'Robinhood Chain', w = r.v / max;
          return (
            <div key={r.name} style={{display: 'flex', alignItems: 'center', gap: 18, height: 82, borderBottom: i < rows.length - 1 ? `1px solid ${LINE}` : 'none', paddingBottom: 10}}>
              <Logo l={r.logo} s={54} />
              <div style={{width: 230, fontWeight: 600, fontSize: 28, letterSpacing: -0.5}}>{r.name}</div>
              <div style={{flex: 1, height: 46, position: 'relative'}}>
                <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w * 100}%`, borderRadius: 12, background: hot ? LIME : SOFT, border: hot ? `2px solid ${INK}` : `1px solid ${LINE}`}} />
                <div style={{position: 'absolute', top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 25, ...(w > 0.55 ? {left: 18} : {left: `calc(${w * 100}% + 14px)`})}}>{B(r.v)}</div>
              </div>
              <div style={{width: 80, textAlign: 'right', fontWeight: 500, fontSize: 22, color: MUTED}}>{((r.v / data.dexTotal) * 100).toFixed(0)}%</div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

// ---------- 3: Tron and stablecoins ----------
export const ChainStables: React.FC = () => {
  const rows = data.stables;
  const other = data.stableTotal - rows.reduce((s, r) => s + r.v, 0);
  const tronShare = (rows[1].v / data.stableTotal) * 100;
  const fmax = data.fees1y[0].v;
  const segs = [...rows.map((r) => ({...r, k: r.name})), {name: 'Others', logo: '', v: other, k: 'Others'}];
  return (
    <Frame page="3/4" art={{src: 'chains26/tron-engraved.png', right: -230, top: 60, size: 760, rot: -8, op: 0.5}}>
      <Title a="Tron runs" b="the dollars." />
      <div style={{position: 'relative', display: 'flex', gap: 18, marginTop: 50}}>
        {[[`${Math.round(data.tronTvlShare)}%`, 'of DeFi TVL', false], [`${Math.round(tronShare)}%`, 'of all stablecoins', true]].map(([v, l, hot]) => (
          <div key={String(l)} style={{flex: 1, borderRadius: 26, padding: '24px 28px', background: hot ? LIME : SOFT, border: hot ? `2px solid ${INK}` : `1px solid ${LINE}`}}>
            <div style={{fontWeight: 600, fontSize: 92, letterSpacing: -4, lineHeight: 1}}>{v}</div>
            <div style={{fontSize: 24, marginTop: 8, color: hot ? INK : '#4A5058'}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'relative', fontSize: 28, color: '#4A5058', marginTop: 30, lineHeight: 1.3}}>{B(rows[1].v)} in stablecoins sits on Tron,<br />and it earned more fees than any chain.</div>
      <div style={{flex: 1}} />
      <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: MUTED, marginBottom: 14}}>STABLECOINS BY CHAIN · {B(data.stableTotal)} TOTAL</div>
      <div style={{display: 'flex', height: 64, borderRadius: 16, overflow: 'hidden', border: `1.5px solid ${INK}`}}>
        {segs.map((s) => <div key={s.k} style={{width: `${(s.v / data.stableTotal) * 100}%`, background: s.name === 'Tron' ? LIME : s.name === 'Ethereum' ? INK : s.name === 'Others' ? '#FFFFFF' : '#D9DDD5', borderRight: `1px solid ${BG}`}} />)}
      </div>
      <div style={{display: 'flex', gap: 24, marginTop: 14, fontSize: 21, color: '#4A5058', flexWrap: 'wrap'}}>
        {segs.slice(0, 4).map((s) => <span key={s.k}><b style={{color: INK, fontWeight: 600}}>{s.name}</b> {B(s.v)}</span>)}
      </div>
      <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: MUTED, marginTop: 44, marginBottom: 12}}>CHAIN FEES · LAST 12 MONTHS</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40}}>
        {data.fees1y.map((r, i) => (
          <div key={r.name} style={{display: 'flex', alignItems: 'center', gap: 16, height: 48}}>
            <Logo l={r.logo} s={40} />
            <div style={{width: 130, fontWeight: 600, fontSize: 24}}>{r.name}</div>
            <div style={{flex: 1, height: 34, position: 'relative'}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(r.v / fmax) * 100}%`, borderRadius: 9, background: i === 0 ? LIME : SOFT, border: i === 0 ? `2px solid ${INK}` : `1px solid ${LINE}`}} />
              <div style={{position: 'absolute', left: 14, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 21}}>${Math.round(r.v / 1e6)}M</div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

// ---------- 4: new chains rise, old hype fades ----------
export const ChainPeak: React.FC = () => {
  const rows = data.peak;
  const CH = 560;
  return (
    <Frame page="4/4" art={{src: 'chains26/monad-engraved.png', right: -150, top: -120, size: 500, rot: 8, op: 0.45}}>
      <Title a="New chains rise." b="Old hype fades." />
      <div style={{fontSize: 26, color: '#4A5058', marginTop: 24}}>DeFi TVL today vs each chain's all-time high</div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 14, height: CH + 120}}>
        {rows.map((r) => {
          const left = 1 + r.ath / 100, top = r.ath > -10;
          return (
            <div key={r.name} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontWeight: 600, fontSize: 26, letterSpacing: -1, marginBottom: 12, color: top ? GREEN : RED}}>{top ? 'ATH' : `${Math.round(r.ath)}%`}</div>
              <div style={{width: '100%', height: CH, borderRadius: 20, border: '1.5px dashed #CDD1CA', position: 'relative', overflow: 'hidden'}}>
                <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: Math.max(8, left * CH), background: top ? LIME : INK, borderTop: top ? `2px solid ${INK}` : 'none'}} />
              </div>
              <div style={{marginTop: 16}}><Logo l={r.logo} s={64} /></div>
              <div style={{fontWeight: 600, fontSize: 18, marginTop: 8, letterSpacing: -0.3}}>{r.name}</div>
              <div style={{fontFamily: MONO, fontSize: 13, color: MUTED, marginTop: 2}}>{top ? `since ${r.first.replace('-', '.')}` : `ATH ${r.athDate.replace('-', '.')}`}</div>
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 30, marginBottom: 30, fontSize: 22, color: MUTED}}>
        <div style={{width: 26, height: 16, border: '1.5px dashed #CDD1CA', borderRadius: 4}} /> all-time high
        <div style={{width: 26, height: 16, background: INK, borderRadius: 4, marginLeft: 18}} /> TVL left today
        <div style={{width: 26, height: 16, background: LIME, border: `1.5px solid ${INK}`, borderRadius: 4, marginLeft: 18}} /> at the top now
      </div>
    </Frame>
  );
};
