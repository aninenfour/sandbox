// Memecoin Pulse, light edition: two 1080 x 1350 slides, white, minimal copy.
// Data (10 Oct 2026, ~15:30 UTC): Hotcoin spot API (api.hotcoinfin.com/v1/market/ticker, 24h quote volume per
// meme pair; pairs matched to CoinGecko by symbol and checked by price) + CoinGecko (meme-token category, 30d change,
// logos). History bars: CoinGecko 2025 State of Memecoins report.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import data from './data2.json';

const BG = '#FFFFFF', INK = '#0B0E11', SOFT = '#F3F4F1', LINE = '#E6E8E3', MUTED = '#8A9099', LIME = '#B8F26A', GREEN = '#2F9E44', RED = '#E5484D';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 80px "Inter Tight"', '500 20px "Inter Tight"', '400 20px "Inter Tight"', '500 16px "JetBrains Mono"'].map((f) => document.fonts.load(f)))
      .then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};
const pct = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;
const usdM = (v: number) => `$${(v / 1e6).toFixed(1)}M`;

type Art = {src: string; right: number; top: number; size: number; rot: number; op?: number};
const Frame: React.FC<{page: string; art?: Art; children: React.ReactNode}> = ({page, art, children}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: BG, color: INK, fontFamily: SANS, padding: '70px 76px 56px'}}>
      {art ? <Img src={staticFile(art.src)} style={{position: 'absolute', right: art.right, top: art.top, width: art.size, height: art.size, transform: `rotate(${art.rot}deg)`, opacity: art.op ?? 0.55,
        WebkitMaskImage: 'radial-gradient(circle at 60% 40%, #000 45%, transparent 78%)', maskImage: 'radial-gradient(circle at 60% 40%, #000 45%, transparent 78%)'}} /> : null}
      <div style={{position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 170, height: (170 * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 16, letterSpacing: 2, color: INK, border: `1.5px solid ${INK}`, borderRadius: 100, padding: '8px 18px', background: BG}}>MEMECOIN PULSE · {page}</div>
      </div>
      <div style={{position: 'relative', flex: 1, display: 'flex', flexDirection: 'column'}}>{children}</div>
      <div style={{fontFamily: MONO, fontSize: 14, color: MUTED, letterSpacing: 0.5}}>Data: Hotcoin, CoinGecko · {data.asOf} · Not financial advice</div>
    </AbsoluteFill>
  );
};

// ---------- 1: season? ----------
const HIST = [{y: '2021', v: 88.0}, {y: '2024', v: 150.6}, {y: '2025', v: 47.2}, {y: 'Now', v: data.memeCap / 1e9}];
export const MemeLiteSeason: React.FC = () => {
  const fromAth = (data.memeCap / 1e9 / 150.6 - 1) * 100;
  const signals = [data.btcDom < 55, false, false, true]; // BTC dom < 55%, alt index 75+, meme vol at 2024 pace, leaders beating BTC
  const CH = 360;
  return (
    <Frame page="1/4" art={{src: 'memes26/doge-engraved.png', right: -260, top: 120, size: 920, rot: -12}}>
            <div style={{position: 'relative', marginTop: 70, fontWeight: 600, fontSize: 104, lineHeight: 0.98, letterSpacing: -4.5}}>
        Meme season?<br /><span style={{color: MUTED}}>Not yet.</span>
      </div>
      <div style={{position: 'relative', marginTop: 64, display: 'flex', alignItems: 'flex-end', gap: 26}}>
        <div style={{fontWeight: 600, fontSize: 150, lineHeight: 0.8, letterSpacing: -7}}>−{Math.abs(Math.round(fromAth))}%</div>
        <div style={{fontSize: 26, color: '#4A5058', lineHeight: 1.25, paddingBottom: 6}}>memecoin market cap<br />vs the 2024 peak</div>
      </div>
      <div style={{flex: 1}} />
      <div style={{position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 22, height: CH + 60}}>
        {HIST.map((d, i) => {
          const now = i === HIST.length - 1;
          return (
            <div key={d.y} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
              <div style={{fontWeight: 600, fontSize: 30, letterSpacing: -1, marginBottom: 12}}>${d.v.toFixed(0)}B</div>
              <div style={{width: '100%', height: (d.v / 155) * CH, borderRadius: 22, background: now ? LIME : SOFT, border: now ? `2px solid ${INK}` : `1px solid ${LINE}`}} />
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex', gap: 22, marginTop: 14}}>
        {HIST.map((d, i) => <div key={d.y} style={{flex: 1, textAlign: 'center', fontSize: 22, fontWeight: i === 3 ? 600 : 400, color: i === 3 ? INK : MUTED}}>{d.y}</div>)}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 44, marginBottom: 30, paddingTop: 28, borderTop: `1px solid ${LINE}`}}>
        <div style={{display: 'flex', gap: 8}}>
          {signals.map((on, i) => <div key={i} style={{width: 18, height: 18, borderRadius: 9, background: on ? LIME : SOFT, border: on ? `2px solid ${INK}` : `1px solid ${LINE}`}} />)}
        </div>
        <div style={{fontSize: 24, fontWeight: 500}}>1 of 4 season signals on</div>
      </div>
    </Frame>
  );
};

// ---------- 2: the hot list (CoinGecko) ----------
export const MemeLiteHotcoin: React.FC = () => {
  const rows = data.hot;
  const max = Math.max(...rows.map((r) => r.d30));
  return (
    <Frame page="2/4" art={{src: 'memes26/pepe-engraved.png', right: -150, top: -110, size: 500, rot: 10, op: 0.5}}>
      <div style={{marginTop: 70, fontWeight: 600, fontSize: 104, lineHeight: 0.98, letterSpacing: -4.5}}>The hot list</div>
      <div style={{fontSize: 28, color: MUTED, marginTop: 20}}>Top 30-day gainers among the 30 biggest memes</div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 56, fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: MUTED}}>
        <span>30 DAYS</span><span>1 YEAR</span>
      </div>
      <div style={{marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12}}>
        {rows.map((r, i) => {
          const w = Math.max(0.04, r.d30 / max);
          return (
            <div key={r.id} style={{display: 'flex', alignItems: 'center', gap: 20, height: 88, borderBottom: i < rows.length - 1 ? `1px solid ${LINE}` : 'none', paddingBottom: 12}}>
              <Img src={staticFile(r.logo)} style={{width: 60, height: 60, borderRadius: 30, border: `1px solid ${LINE}`}} />
              <div style={{width: 170, fontWeight: 600, fontSize: 31, letterSpacing: -0.5, fontFamily: `${SANS}, "Noto Sans SC"`}}>{r.sym}</div>
              <div style={{flex: 1, height: 46, position: 'relative'}}>
                <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w * 100}%`, borderRadius: 12, background: i === 0 ? LIME : SOFT, border: i === 0 ? `2px solid ${INK}` : `1px solid ${LINE}`}} />
                <div style={{position: 'absolute', top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: 25, ...(w > 0.72 ? {left: 18} : {left: `calc(${w * 100}% + 14px)`})}}>{pct(r.d30)}</div>
              </div>
              <div style={{width: 120, textAlign: 'right', fontWeight: 500, fontSize: 24, color: r.y1 == null ? MUTED : r.y1 >= 0 ? GREEN : RED}}>{r.y1 == null ? '–' : pct(r.y1)}</div>
            </div>
          );
        })}
      </div>
      <div style={{flex: 1}} />
    </Frame>
  );
};

// ---------- 3: the four signals ----------
type Sig = {label: string; now: string; target: string; p: number; on: boolean};
export const MemeLiteSignals: React.FC = () => {
  const pepe = data.hot.find((r) => r.sym === 'PEPE')!, bonk = data.hot.find((r) => r.sym === 'BONK')!;
  const sigs: Sig[] = [
    {label: 'Bitcoin dominance', now: `${data.btcDom.toFixed(1)}%`, target: 'below 55%', p: Math.max(0, Math.min(1, (70 - data.btcDom) / (70 - 55))), on: data.btcDom < 55},
    {label: 'Altcoin Season Index', now: '61', target: '75+', p: 61 / 75, on: false},
    {label: 'Meme volume / day', now: `$${(data.memeVol / 1e9).toFixed(1)}B`, target: '$9.7B (2024)', p: data.memeVol / 1e9 / 9.7, on: false},
    {label: 'PEPE & BONK vs BTC, 30d', now: `${pct((pepe.d30 + bonk.d30) / 2)}`, target: `beat BTC ${pct(data.btc30)}`, p: 1, on: true},
  ];
  return (
    <Frame page="3/4" art={{src: 'memes26/shib-engraved.png', right: -200, top: 40, size: 760, rot: -8, op: 0.5}}>
      <div style={{marginTop: 70, fontWeight: 600, fontSize: 104, lineHeight: 0.98, letterSpacing: -4.5}}>4 signals<br /><span style={{color: MUTED}}>to watch.</span></div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 40}}>
        {sigs.map((g, i) => (
          <div key={i} style={{borderRadius: 26, padding: '26px 30px', background: g.on ? LIME : SOFT, border: g.on ? `2px solid ${INK}` : `1px solid ${LINE}`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
              <div style={{fontSize: 27, fontWeight: 500}}>{g.label}</div>
              <div style={{fontFamily: MONO, fontSize: 15, letterSpacing: 1.5, fontWeight: 500, color: g.on ? INK : MUTED}}>{g.on ? 'ON' : 'NOT YET'}</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 14}}>
              <div style={{width: 230, fontWeight: 600, fontSize: 52, letterSpacing: -2}}>{g.now}</div>
              <div style={{flex: 1}}>
                <div style={{height: 12, borderRadius: 6, background: g.on ? 'rgba(11,14,17,0.15)' : '#E2E4DF', overflow: 'hidden'}}>
                  <div style={{width: `${Math.min(1, g.p) * 100}%`, height: '100%', borderRadius: 6, background: INK}} />
                </div>
                <div style={{fontSize: 19, color: g.on ? INK : MUTED, marginTop: 10}}>Season level: {g.target}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

// ---------- 4: from peak to now ----------
export const MemeLitePeak: React.FC = () => {
  const rows = data.peak;
  const CH = 600;
  return (
    <Frame page="4/4" art={{src: 'memes26/bonk-engraved.png', right: -150, top: -120, size: 500, rot: 8, op: 0.45}}>
      <div style={{marginTop: 70, fontWeight: 600, fontSize: 104, lineHeight: 0.98, letterSpacing: -4.5}}>Hype fades.<br /><span style={{color: MUTED}}>Peak to now.</span></div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 14, height: CH + 120}}>
        {rows.map((r) => {
          const left = 1 + r.ath / 100, best = r.ath > -50;
          return (
            <div key={r.id} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontWeight: 600, fontSize: 26, letterSpacing: -1, marginBottom: 12, color: best ? INK : RED}}>{Math.round(r.ath)}%</div>
              <div style={{width: '100%', height: CH, borderRadius: 20, border: `1.5px dashed #CDD1CA`, position: 'relative', overflow: 'hidden'}}>
                <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: Math.max(8, left * CH), background: best ? LIME : INK, borderTop: best ? `2px solid ${INK}` : 'none'}} />
              </div>
              <Img src={staticFile(r.logo)} style={{width: 64, height: 64, borderRadius: 32, border: `1px solid ${LINE}`, marginTop: 16}} />
              <div style={{fontWeight: 600, fontSize: 19, marginTop: 8, letterSpacing: -0.3}}>{r.sym}</div>
              <div style={{fontFamily: MONO, fontSize: 13, color: MUTED, marginTop: 2}}>{r.athDate.replace('-', '.')}</div>
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 30, marginBottom: 30, fontSize: 22, color: MUTED}}>
        <div style={{width: 26, height: 16, border: '1.5px dashed #CDD1CA', borderRadius: 4}} /> all-time high
        <div style={{width: 26, height: 16, background: INK, borderRadius: 4, marginLeft: 18}} /> value left today
      </div>
    </Frame>
  );
};
