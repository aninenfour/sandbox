// "PolitiFi: $10.4B gone" drawdown graphic, 1080x1350, white background.
// Data: CoinMarketCap daily market-cap history (data-api detail/chart, range ALL) for TRUMP, MELANIA, PEOPLE,
// the top 3 of CoinGecko's PolitiFi category (96% of it on Nov 3, 2026). Combined, forward-filled daily. drawdown.json.
// Coin logos: CoinGecko. Background: US Capitol photo by J. Amill Santiago on Unsplash (SVtBYkvai1M), halftoned by scripts/halftone-capitol.py.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {INK, MONO, SANS, useFonts} from '../promo4/kit';
import data from './drawdown.json';

const GRAY = '#6B7280', LINE = '#E6E8EB', RED = '#E5484D';
const usd = (v: number) => v >= 1e9 ? `$${(v / 1e9).toFixed(v >= 1e10 ? 1 : 2)}B` : `$${(v / 1e6).toFixed(v >= 1e8 ? 0 : 1)}M`;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const nice = (s: string) => {const [y, m, d] = s.split('-').map(Number); return `${MON[m - 1]} ${d}, ${y}`;};

const Chart: React.FC<{w: number; h: number}> = ({w, h}) => {
  const s = data.series, max = data.peak.v * 1.08;
  const t0 = Date.parse(s[0].d), t1 = Date.parse(s[s.length - 1].d);
  const X = (d: string) => ((Date.parse(d) - t0) / (t1 - t0)) * w, Y = (v: number) => h - (v / max) * h;
  const line = s.map((p, i) => `${i ? 'L' : 'M'}${X(p.d).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
  const px = X(data.peak.d), py = Y(data.peak.v), nx = w, ny = Y(data.now);
  const ticks = ['2025-02-01', '2025-07-01', '2026-01-01', '2026-07-01'].filter((d) => Date.parse(d) >= t0);
  return (
    <svg width={w} height={h + 46} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={INK} stopOpacity={0.14} />
          <stop offset="1" stopColor={INK} stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1={0} x2={w} y1={h - f * h} y2={h - f * h} stroke={LINE} strokeWidth={1.5} />)}
      <line x1={0} x2={w} y1={h} y2={h} stroke={INK} strokeWidth={2} />
      <path d={`${line} L${w},${h} L0,${h} Z`} fill="url(#fill)" />
      <path d={line} fill="none" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <line x1={px} x2={px} y1={py} y2={h} stroke={INK} strokeWidth={1.5} strokeDasharray="4 6" />
      <circle cx={px} cy={py} r={10} fill="#fff" stroke={INK} strokeWidth={4} />
      <text x={px + 22} y={py + 8} fontFamily={MONO} fontSize={26} fill={INK} fontWeight={500}>PEAK {usd(data.peak.v)}</text>
      <text x={px + 22} y={py + 42} fontFamily={MONO} fontSize={21} fill={GRAY}>{nice(data.peak.d).toUpperCase()}</text>
      <circle cx={nx} cy={ny} r={10} fill={RED} stroke="#fff" strokeWidth={4} />
      <text x={nx - 22} y={ny - 26} textAnchor="end" fontFamily={MONO} fontSize={26} fill={RED} fontWeight={500}>NOW {usd(data.now)}</text>
      {ticks.map((d) => (
        <text key={d} x={X(d)} y={h + 38} textAnchor={X(d) < 40 ? 'start' : 'middle'} fontFamily={MONO} fontSize={20} fill={GRAY}>{MON[+d.slice(5, 7) - 1].toUpperCase()} {d.slice(2, 4)}</text>
      ))}
    </svg>
  );
};

export const Wiped: React.FC = () => {
  useFonts();
  const gone = data.peak.v - data.now, pct = (1 - data.now / data.peak.v) * 100;
  return (
    <AbsoluteFill style={{background: '#FFFFFF', fontFamily: SANS, color: INK, padding: '72px 72px 64px'}}>
      <Img src={staticFile('politifi/capitol-halftone.png')} style={{position: 'absolute', left: 300, top: 110, width: 960, opacity: 0.28, maskImage: 'radial-gradient(ellipse 55% 62% at 50% 36%, #000 50%, transparent 100%)'}} />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{height: 44}} />
        <div style={{fontFamily: MONO, fontSize: 20, letterSpacing: 2, border: `1.5px solid ${INK}`, borderRadius: 999, padding: '10px 20px'}}>POLITIFI · {data.asof.toUpperCase()}</div>
      </div>

      <div style={{marginTop: 48}}>
        <div style={{fontSize: 170, fontWeight: 700, letterSpacing: -8, lineHeight: 0.9, color: RED}}>-{usd(gone)}</div>
        <div style={{fontSize: 44, fontWeight: 600, letterSpacing: -1, marginTop: 18, lineHeight: 1.1}}>
          PolitiFi market value erased<br /><span style={{color: GRAY}}>since inauguration day.</span>
        </div>
      </div>

      <div style={{marginTop: 40}}>
        <Chart w={936} h={300} />
      </div>

      <div style={{marginTop: 40}}>
        <div style={{display: 'flex', fontFamily: MONO, fontSize: 19, letterSpacing: 2, color: GRAY, paddingBottom: 14}}>
          <div style={{flex: 1}}>TOKEN</div>
          <div style={{width: 190, textAlign: 'right'}}>PEAK</div>
          <div style={{width: 190, textAlign: 'right'}}>NOW</div>
          <div style={{width: 160, textAlign: 'right'}}>DROP</div>
        </div>
        {data.tokens.map((t) => (
          <div key={t.sym} style={{display: 'flex', alignItems: 'center', padding: '13px 0', borderTop: `1.5px solid ${LINE}`}}>
            <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: 16}}>
              <Img src={staticFile(`politifi/${t.sym}.png`)} style={{width: 52, height: 52, borderRadius: 26, objectFit: 'cover'}} />
              <div style={{fontSize: 30, fontWeight: 700, letterSpacing: -0.5}}>${t.sym}</div>
            </div>
            <div style={{width: 190, textAlign: 'right', fontFamily: MONO, fontSize: 27, color: GRAY}}>{usd(t.peak)}</div>
            <div style={{width: 190, textAlign: 'right', fontFamily: MONO, fontSize: 27}}>{usd(t.now)}</div>
            <div style={{width: 160, textAlign: 'right', fontFamily: MONO, fontSize: 27, color: RED, fontWeight: 500}}>-{((1 - t.now / t.peak) * 100).toFixed(0)}%</div>
          </div>
        ))}
        <div style={{display: 'flex', alignItems: 'center', padding: '18px 0 0', borderTop: `2px solid ${INK}`}}>
          <div style={{flex: 1, fontSize: 30, fontWeight: 700}}>Combined</div>
          <div style={{width: 190, textAlign: 'right', fontFamily: MONO, fontSize: 27, color: GRAY}}>{usd(data.peak.v)}</div>
          <div style={{width: 190, textAlign: 'right', fontFamily: MONO, fontSize: 27}}>{usd(data.now)}</div>
          <div style={{width: 160, textAlign: 'right', fontFamily: MONO, fontSize: 27, color: RED, fontWeight: 700}}>-{pct.toFixed(0)}%</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
