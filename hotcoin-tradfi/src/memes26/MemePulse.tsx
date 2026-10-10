// "Memecoin season: wait or not?" Hotcoin Research, two 1080 x 1350 slides.
// Live data pulled from CoinGecko on 10 Oct 2026 into data.json (meme-token category, markets, global).
// History points come from the CoinGecko 2025 State of Memecoins report. Logos are CoinGecko coin images.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import '@fontsource/noto-sans-sc/700.css';
import data from './data.json';

const INK = '#0B0E11', PANEL = '#12161B', LINE = '#232A31', LIME = '#B8F26A', GREEN = '#7EC25A', WHITE = '#F2F3EE', MUTED = '#8C959E', RED = '#FF5A5A';
const DISPLAY = 'Unbounded, sans-serif', SANS = '"Inter Tight", "Noto Sans SC", sans-serif', MONO = '"JetBrains Mono", monospace';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['900 60px Unbounded', '800 60px Unbounded', '600 20px "Inter Tight"', '500 20px "Inter Tight"', '700 20px "JetBrains Mono"', '500 20px "JetBrains Mono"', '700 20px "Noto Sans SC"']
      .map((f) => document.fonts.load(f))).then(() => setTimeout(() => continueRender(h), 200));
  }, [h]);
};
const pct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
const usd = (v: number) => (v >= 1e9 ? `$${(v / 1e9).toFixed(1)}B` : `$${Math.round(v / 1e6)}M`);

const Shell: React.FC<{page: string; note?: string; children: React.ReactNode}> = ({page, note, children}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: INK, color: WHITE, fontFamily: SANS, padding: '64px 64px 52px'}}>
      <AbsoluteFill style={{background: 'radial-gradient(70% 45% at 100% 0%, rgba(184,242,106,0.13), rgba(184,242,106,0) 70%)'}} />
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(242,243,238,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(242,243,238,0.035) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
      <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: 3, color: INK, background: LIME, padding: '8px 28px 8px 14px', clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)'}}>HOTCOIN RESEARCH · MEMECOIN PULSE</div>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 190, height: (190 * 328) / 2005}} />
      </div>
      <div style={{position: 'relative', flex: 1, display: 'flex', flexDirection: 'column'}}>{children}</div>
      <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 15, color: MUTED, letterSpacing: 1}}>
        <span>{note ?? `Data: CoinGecko, as of ${data.asOf}. Not financial advice.`}</span>
        <span>{page}</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- slide 1: should we wait? ----------
const HIST = [
  {label: 'Oct 2021', sub: '2021 peak', v: 88.0},
  {label: 'Dec 2024', sub: 'All-time high', v: 150.6},
  {label: 'Nov 2025', sub: '', v: 47.2},
  {label: 'Today', sub: data.asOf, v: data.memeCap / 1e9},
];
export const MemeSeason: React.FC = () => {
  const now = data.memeCap / 1e9, fromAth = (now / 150.6 - 1) * 100, share = (data.memeCap / data.total) * 100;
  const pepe = data.hot.find((c) => c.sym === 'PEPE')!, bonk = data.hot.find((c) => c.sym === 'BONK')!;
  const signals: [string, string, boolean][] = [
    ['Bitcoin dominance below 55%', `${data.btcDom.toFixed(1)}%`, data.btcDom < 55],
    ['Altcoin Season Index at 75+', '61', false],
    ['Meme volume back to 2024 pace ($9.7B a day)', `$${(data.memeVol / 1e9).toFixed(1)}B`, false],
    ['Meme leaders beating BTC over 30 days', `PEPE ${pct(pepe.d30)} · BONK ${pct(bonk.d30)} vs BTC +6.2%`, true],
  ];
  const on = signals.filter((s) => s[2]).length;
  const CH = 250, maxV = 160;
  return (
    <Shell page="1 / 2" note={`CoinGecko, ${data.asOf} · history: CoinGecko memecoin report · ASI: CMC, early Oct · NFA`}>
      <div style={{marginTop: 34, fontFamily: DISPLAY, fontWeight: 900, fontSize: 62, lineHeight: 1.04, letterSpacing: -2}}>
        Memecoin season?<br /><span style={{color: LIME}}>Not yet.</span>
      </div>
      <div style={{fontSize: 27, color: MUTED, marginTop: 16, lineHeight: 1.35}}>The sector is {Math.abs(fromAth).toFixed(0)}% below its peak, but the leaders are waking up.</div>

      {/* history bars */}
      <div style={{marginTop: 28, background: PANEL, border: `1px solid ${LINE}`, borderRadius: 20, padding: '22px 30px 18px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 17, letterSpacing: 2, color: MUTED}}>MEMECOIN MARKET CAP · $B</div>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 20, color: RED}}>{fromAth.toFixed(0)}% FROM ATH</div>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 34, height: CH + 56, marginTop: 8}}>
          {HIST.map((d, i) => {
            const last = i === HIST.length - 1, ath = d.v === 150.6;
            return (
              <div key={d.label} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%'}}>
                <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 28, color: last ? LIME : WHITE, marginBottom: 8}}>{d.v.toFixed(1)}</div>
                <div style={{width: '100%', height: (d.v / maxV) * CH, borderRadius: '10px 10px 0 0', background: last ? LIME : ath ? 'rgba(242,243,238,0.85)' : 'rgba(242,243,238,0.22)', boxShadow: last ? `0 0 30px ${LIME}66` : 'none'}} />
              </div>
            );
          })}
        </div>
        <div style={{display: 'flex', gap: 34, borderTop: `2px solid ${LINE}`, paddingTop: 12}}>
          {HIST.map((d, i) => (
            <div key={d.label} style={{flex: 1, textAlign: 'center'}}>
              <div style={{fontWeight: 600, fontSize: 21, color: i === HIST.length - 1 ? LIME : WHITE}}>{d.label}</div>
              <div style={{fontSize: 16, color: MUTED, height: 20}}>{d.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* signal checklist */}
      <div style={{marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 17, letterSpacing: 2, color: MUTED}}>MEME SEASON SIGNALS</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 30}}><span style={{color: LIME}}>{on}</span><span style={{color: MUTED}}> / {signals.length} ON</span></div>
      </div>
      <div style={{marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10}}>
        {signals.map(([label, val, ok]) => (
          <div key={label} style={{display: 'flex', alignItems: 'center', gap: 18, background: ok ? 'rgba(184,242,106,0.09)' : PANEL, border: `1px solid ${ok ? LIME : LINE}`, borderRadius: 14, padding: '12px 20px'}}>
            <div style={{width: 34, height: 34, borderRadius: 17, flex: 'none', background: ok ? LIME : 'transparent', border: ok ? 'none' : `2px solid ${MUTED}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 18, color: ok ? INK : MUTED}}>{ok ? '✓' : '–'}</div>
            <div style={{flex: 1, fontSize: 22, fontWeight: 500}}>{label}</div>
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, color: ok ? LIME : WHITE, textAlign: 'right'}}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', gap: 14, marginBottom: 22, marginTop: 18}}>
        {[[`${share.toFixed(1)}%`, 'of the crypto market is memes'], [usd(data.memeVol), 'meme volume, last 24h'], [`${data.btcDom.toFixed(1)}%`, 'Bitcoin dominance']].map(([v, l]) => (
          <div key={l} style={{flex: 1, borderLeft: `3px solid ${GREEN}`, paddingLeft: 14}}>
            <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 30}}>{v}</div>
            <div style={{fontSize: 17, color: MUTED}}>{l}</div>
          </div>
        ))}
      </div>
    </Shell>
  );
};

// ---------- slide 2: the hot list ----------
const Spark: React.FC<{pts: number[]; up: boolean}> = ({pts, up}) => {
  const w = 150, h = 46, lo = Math.min(...pts), hi = Math.max(...pts);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${((i / (pts.length - 1)) * w).toFixed(1)} ${(h - ((p - lo) / (hi - lo || 1)) * (h - 6) - 3).toFixed(1)}`).join(' ');
  return <svg width={w} height={h}><path d={d} fill="none" stroke={up ? LIME : RED} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" /></svg>;
};
export const MemeHotList: React.FC = () => {
  const rows = data.hot;
  const down = rows.filter((r) => (r.y1 ?? 0) < 0);
  const worst = Math.min(...down.map((r) => r.y1 as number)), best = Math.max(...down.map((r) => r.y1 as number));
  return (
    <Shell page="2 / 2">
      <div style={{marginTop: 40, fontFamily: DISPLAY, fontWeight: 900, fontSize: 54, lineHeight: 1.06, letterSpacing: -1.5}}>The hot list</div>
      <div style={{fontSize: 23, color: MUTED, marginTop: 10}}>Biggest 30-day gainers among the 30 largest memecoins</div>
      <div style={{marginTop: 26, display: 'flex', fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: MUTED, padding: '0 18px'}}>
        <div style={{width: 360}}>COIN</div><div style={{width: 130, textAlign: 'right'}}>MKT CAP</div><div style={{width: 190, textAlign: 'center'}}>7 DAYS</div><div style={{width: 120, textAlign: 'right'}}>30D</div><div style={{flex: 1, textAlign: 'right'}}>1 YEAR</div>
      </div>
      <div style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8}}>
        {rows.map((r, i) => (
          <div key={r.id} style={{display: 'flex', alignItems: 'center', background: i === 0 ? 'rgba(184,242,106,0.09)' : PANEL, border: `1px solid ${i === 0 ? LIME : LINE}`, borderRadius: 14, padding: '10px 18px', height: 70}}>
            <div style={{width: 360, display: 'flex', alignItems: 'center', gap: 16}}>
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 16, color: MUTED, width: 24}}>{String(i + 1).padStart(2, '0')}</div>
              <Img src={staticFile(r.logo)} style={{width: 46, height: 46, borderRadius: 23, background: WHITE, border: '2px solid #4A535C'}} />
              <div style={{minWidth: 0}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <span style={{fontWeight: 700, fontSize: 23}}>{r.sym}</span>
                  {r.onHotcoin ? <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 11, letterSpacing: 1, color: INK, background: LIME, padding: '3px 7px', borderRadius: 4}}>ON HOTCOIN</span> : null}
                </div>
                <div style={{fontSize: 16, color: MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260}}>{r.sym === r.name.split(' ')[0] ? r.name.replace(/^.*\((.*)\)$/, '$1') : r.name}</div>
              </div>
            </div>
            <div style={{width: 130, textAlign: 'right', fontFamily: MONO, fontWeight: 500, fontSize: 19}}>{usd(r.mcap)}</div>
            <div style={{width: 190, display: 'flex', justifyContent: 'center'}}><Spark pts={r.spark} up={r.d7 >= 0} /></div>
            <div style={{width: 120, textAlign: 'right', fontFamily: DISPLAY, fontWeight: 800, fontSize: 22, color: LIME}}>{pct(r.d30)}</div>
            <div style={{flex: 1, textAlign: 'right', fontFamily: MONO, fontWeight: 700, fontSize: 19, color: (r.y1 ?? 0) >= 0 ? LIME : RED}}>{r.y1 == null ? '–' : pct(r.y1)}</div>
          </div>
        ))}
      </div>
      <div style={{flex: 1}} />
      <div style={{background: 'rgba(184,242,106,0.08)', border: `2px solid ${LIME}`, borderRadius: 16, padding: '18px 24px', marginBottom: 18}}>
        <div style={{fontWeight: 700, fontSize: 25, lineHeight: 1.35}}>A bounce is not a season: {down.length} of these 10 are still down {Math.round(-best)}–{Math.round(-worst)}% over a year.</div>
        <div style={{fontSize: 19, color: MUTED, marginTop: 6}}>The money is rotating into new names (MUBARAK, 币安人生, PUMP) while the 2024 heroes rebuild.</div>
      </div>
    </Shell>
  );
};
