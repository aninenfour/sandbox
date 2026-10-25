// "Uptober" carousel (4 x 1080 x 1350): October change of the top 8 coins in 2023, 2024, 2025 and 2026 so far,
// in the Pulse light style. Data: Binance monthly USDT candles, October open to October close (years.json, 2023 to 2025);
// CoinGecko USD prices, 1 Oct 2026 00:00 UTC to 25 Oct 2026 06:00 UTC (sofar.json). Logos: CoinGecko.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import sofar from './sofar.json';
import years from './years.json';

const INK = '#0B0E11', MUTED = '#8A9099', RED = '#E5484D', GREEN = '#2F9E44', LIME = '#B8F26A', BODY = '#4A5058';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';
const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 80px "Inter Tight"', '500 20px "Inter Tight"', '500 16px "JetBrains Mono"'].map((f) => document.fonts.load(f))).then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};
const pct = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}%`;

type Row = {id: string; sym: string; chg: number};

// background: the big year in engraved lines, with that October's real BTC daily candles drawn over it
const BgArt: React.FC<{year: string}> = ({year}) => {
  const c = (years as unknown as {btcCandles: Record<string, number[][]>}).btcCandles[year];
  const lo = Math.min(...c.map((k) => k[2])), hi = Math.max(...c.map((k) => k[1]));
  const X0 = 705, W = 215, Y0 = 150, H = 470, n = 31, step = W / n, bw = step * 0.66;
  const y = (v: number) => Y0 + (1 - (v - lo) / (hi - lo)) * H;
  return (
    <>
      <div style={{position: 'absolute', left: 1068, top: 130, transform: 'rotate(90deg)', transformOrigin: '0 0', fontFamily: SANS, fontWeight: 700, fontSize: 150, lineHeight: 1, letterSpacing: -4, whiteSpace: 'nowrap',
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(11,14,17,0.22) 0 3px, transparent 3px 7px)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{year}</div>
      <svg width={1080} height={1350} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="hg" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#DDF5C4" /><rect width="6" height="3" fill="#8FD45E" /></pattern>
          <pattern id="hr" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#FBD6D7" /><rect width="6" height="3" fill="#F08A8D" /></pattern>
        </defs>
        {c.map(([o, h, l, cl], i) => {
          const up = cl >= o, x = X0 + i * step + (step - bw) / 2;
          return (
            <g key={i} opacity={0.85}>
              <line x1={x + bw / 2} x2={x + bw / 2} y1={y(h)} y2={y(l)} stroke={up ? '#7EC25A' : '#E5484D'} strokeWidth={2} />
              <rect x={x} y={y(Math.max(o, cl))} width={bw} height={Math.max(3, Math.abs(y(o) - y(cl)))} rx={2} fill={`url(#${up ? 'hg' : 'hr'})`} stroke={up ? '#7EC25A' : '#E5484D'} strokeWidth={1.5} />
            </g>
          );
        })}
      </svg>
    </>
  );
};
const Slide: React.FC<{page: string; year: string; sub: string; rows: Row[]; note: React.ReactNode; source: string; red: boolean}> = ({page, year, sub, rows, note, source, red}) => {
  useFonts();
  const up = rows.filter((r) => r.chg >= 0).length;
  const maxPos = Math.max(0, ...rows.map((r) => r.chg)), maxNeg = Math.max(0, ...rows.map((r) => -r.chg));
  const W = 540, zero = (maxNeg / (maxNeg + maxPos || 1)) * W, unit = W / (maxNeg + maxPos || 1);
  const big = red ? `${rows.length - up}/${rows.length}` : `${up}/${rows.length}`;
  return (
    <AbsoluteFill style={{background: '#FFFFFF', color: INK, fontFamily: SANS, padding: '70px 76px 56px'}}>
      <BgArt year={year.slice(0, 4)} />
      <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 170, height: (170 * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 16, letterSpacing: 2, border: `1.5px solid ${INK}`, borderRadius: 100, padding: '8px 18px', background: '#fff'}}>UPTOBER CHECK · {page}</div>
      </div>
      <div style={{position: 'relative', marginTop: 64, fontWeight: 600, fontSize: 100, lineHeight: 0.98, letterSpacing: -4.3}}>Uptober {year}<br /><span style={{color: MUTED}}>{sub}</span></div>
      <div style={{position: 'relative', marginTop: 46, display: 'flex', alignItems: 'flex-end', gap: 26}}>
        <div style={{fontWeight: 600, fontSize: 150, lineHeight: 0.8, letterSpacing: -7, color: red ? RED : GREEN}}>{big}</div>
        <div style={{fontSize: 26, color: BODY, lineHeight: 1.25, paddingBottom: 6}}>{note}</div>
      </div>
      <div style={{flex: 1}} />
      <div style={{fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: MUTED, marginBottom: 16}}>OCTOBER CHANGE{year.includes('2026') ? ' SO FAR' : ''}</div>
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 34}}>
        <div style={{position: 'absolute', left: 170 + zero, top: -6, bottom: -6, width: 2, background: INK, opacity: maxNeg > 0 && maxPos > 0 ? 0.25 : 0}} />
        {rows.map((r) => {
          const pos = r.chg >= 0, w = Math.max(10, Math.abs(r.chg) * unit);
          const fill = pos ? (r.sym === 'BTC' ? `repeating-linear-gradient(135deg, ${LIME} 0 12px, #D9F7B0 12px 24px)` : '#D9F7B0') : (r.sym === 'BTC' ? `repeating-linear-gradient(135deg, ${RED} 0 12px, #F7B3B5 12px 24px)` : '#FBD3D4');
          const label = <div style={{fontWeight: 600, fontSize: 28, letterSpacing: -1, color: pos ? GREEN : RED, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>{pct(r.chg)}</div>;
          return (
            <div key={r.id} style={{display: 'flex', alignItems: 'center', height: 50}}>
              <Img src={staticFile(`uptober/coins/${r.id}.png`)} style={{width: 40, height: 40, borderRadius: 20}} />
              <div style={{width: 100, marginLeft: 14, fontWeight: 600, fontSize: 26}}>{r.sym}</div>
              <div style={{position: 'relative', width: W, height: 38, marginLeft: 16}}>
                <div style={{position: 'absolute', top: 0, height: 38, borderRadius: 12, border: `2px solid ${INK}`, background: fill, left: pos ? zero : zero - w, width: w}} />
              </div>
              <div style={{marginLeft: 'auto', textAlign: 'right'}}>{label}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'relative', fontFamily: MONO, fontSize: 13.5, color: MUTED, letterSpacing: 0.3, lineHeight: 1.5}}>{source} · Not financial advice</div>
    </AbsoluteFill>
  );
};

const Y = years as unknown as Record<string, Row[]>;
const BIN = 'Data: Binance monthly candles, USDT pairs, October open to close';
export const Uptober2023: React.FC = () => <Slide page="1/4" year="2023" sub="delivered." rows={Y['2023']} red={false} source={BIN}
  note={<>top coins closed October green.<br />SOL led with +79.7%.</>} />;
export const Uptober2024: React.FC = () => <Slide page="2/4" year="2024" sub="mostly up." rows={Y['2024']} red={false} source={BIN}
  note={<>closed green.<br />DOGE led with +41.5%.</>} />;
export const Uptober2025: React.FC = () => <Slide page="3/4" year="2025" sub="spooky." rows={Y['2025']} red source={BIN}
  note={<>closed red.<br />Only BNB finished green.</>} />;
export const UptoberSoFar: React.FC = () => <Slide page="4/4" year="2026" sub="so far." rows={sofar.rows} red source="Data: CoinGecko, USD price change from 1 Oct 00:00 UTC to 25 Oct 06:00 UTC"
  note={<>top coins are red this month.<br />7 days left to flip it.</>} />;
