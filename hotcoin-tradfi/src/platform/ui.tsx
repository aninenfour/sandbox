import React from 'react';
import {Img, interpolate, spring, staticFile} from 'remotion';
import {BTC_HEADER, CANDLES, HOME_ASSETS, SPOT_ROWS, TRADFI_ROWS} from './data';

// Hotcoin UI rebuilt from hotcoin.com's computed styles: Roboto, CTA #97E763, cards on near-black.
export const UI = {
  bg: '#0B0B0C', card: '#141416', card2: '#1B1C1F', line: '#26272B', text: '#FFFFFF', mute: '#8E9199',
  cta: '#97E763', accent: '#7EC25A', up: '#2DBD85', down: '#F6465D', font: 'Roboto, "Helvetica Neue", Arial, sans-serif',
};
const num: React.CSSProperties = {fontVariantNumeric: 'tabular-nums'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sp = (f: number, d = 16, s = 170) => spring({frame: f, fps: 60, config: {damping: d, stiffness: s}});

const Logo: React.FC<{h: number}> = ({h}) => <Img src={staticFile('brand/logo.png')} style={{height: h, width: (h * 485) / 93, display: 'block'}} />;

const Nav: React.FC = () => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1440, height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', boxSizing: 'border-box', borderBottom: `1px solid ${UI.line}`}}>
    <Logo h={22} />
    <div style={{display: 'flex', gap: 30, marginLeft: 48, fontSize: 15, fontWeight: 500, color: UI.text}}>
      {['Buy Crypto', 'Markets', 'Trade', 'Futures', 'Finance', 'Rewards', 'More', 'Prediction Markets', 'Web3 Wallet'].map((t) => <span key={t}>{t}</span>)}
    </div>
    <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 22, fontSize: 15, fontWeight: 500, color: UI.text}}>
      <div style={{width: 16, height: 16, borderRadius: 8, border: `2px solid ${UI.text}`}} />
      <span>Log In</span>
      <div style={{background: UI.cta, color: '#000', borderRadius: 8, padding: '9px 14px', fontWeight: 600}}>Sign Up</div>
    </div>
  </div>
);

const Spark: React.FC<{w: number; h: number; draw: number; seed: number; color: string}> = ({w, h, draw, seed, color}) => {
  const pts = new Array(18).fill(0).map((_, i) => {
    const y = 0.25 + 0.5 * Math.abs(Math.sin(seed * 3.1 + i * 0.9)) * (i / 17) + (i / 17) * 0.3;
    return [(i / 17) * w, Math.min(h - 2, y * h)];
  });
  const d = 'M ' + pts.map((p) => p.join(' ')).join(' L ');
  return <svg width={w} height={h}><path d={d} fill="none" stroke={color} strokeWidth={2} pathLength={1} strokeDasharray={`${draw} 1`} /></svg>;
};

// Desktop home page, 1440 wide. `scroll` is in page pixels, `hover` picks a card and `draws` its sparkline.
export const DesktopHome: React.FC<{f: number; scroll: number; hover: number; hoverAt: number[]}> = ({f, scroll, hover, hoverAt}) => (
  <div style={{position: 'absolute', inset: 0, background: UI.bg, fontFamily: UI.font, color: UI.text, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 0, top: -scroll, width: 1440}}>
      <div style={{position: 'absolute', left: 0, top: 150, width: 1440, textAlign: 'center', fontSize: 64, fontWeight: 700, lineHeight: 1.12, letterSpacing: -0.5}}>
        <span style={{color: UI.cta}}>9</span> Years of Focus.<br />Built for Traders.
      </div>
      <div style={{position: 'absolute', left: 0, top: 330, width: 1440, textAlign: 'center', fontSize: 19, color: '#C9CBD0'}}>
        New user exclusive: Up to <span style={{color: UI.cta}}>16,360 USDT</span> in rewards
      </div>
      <div style={{position: 'absolute', left: 460, top: 380, width: 520, height: 62, border: '1px solid #34363B', borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 8px 0 18px', boxSizing: 'border-box'}}>
        <span style={{color: '#71747B', fontSize: 16}}>Email / Phone number</span>
        <div style={{marginLeft: 'auto', background: UI.cta, color: '#000', borderRadius: 8, padding: '12px 20px', fontWeight: 600, fontSize: 16}}>Sign Up</div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 600, width: 1440, textAlign: 'center', fontSize: 44, fontWeight: 700}}>Start Your Global Asset Trading Here</div>
      <div style={{position: 'absolute', left: 0, top: 666, width: 1440, textAlign: 'center', fontSize: 18, color: UI.mute}}>Trade crypto, US stocks, precious metals, and more with stablecoins, all in one place.</div>
      {HOME_ASSETS.map((a, i) => {
        const on = i === hover;
        const draw = interpolate(f - (hoverAt[i] ?? 9999), [0, 24], [0.25, 1], clamp);
        const lift = on ? sp(f - (hoverAt[i] ?? 0), 14, 220) : 0;
        return (
          <div key={a.sym} style={{
            position: 'absolute', left: 84 + i * 324, top: 740 - lift * 8, width: 300, height: 150, boxSizing: 'border-box', padding: 22,
            background: UI.card, borderRadius: 20, border: `1px solid ${on ? UI.accent : UI.line}`, boxShadow: on ? '0 20px 40px rgba(0,0,0,0.5)' : 'none',
          }}>
            <div style={{fontSize: 19, fontWeight: 700}}>{a.cat} <span style={{color: UI.mute}}>→</span></div>
            <div style={{position: 'absolute', left: 22, top: 80, fontSize: 14, color: '#C9CBD0'}}>{a.sym}</div>
            <div style={{position: 'absolute', left: 22, top: 104, fontSize: 17, fontWeight: 700, ...num}}>{a.price} <span style={{color: UI.down, fontSize: 14, fontWeight: 500}}>{a.chg}</span></div>
            <div style={{position: 'absolute', right: 20, top: 72}}><Spark w={110} h={52} draw={on ? draw : 1} seed={i + 1} color={UI.down} /></div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 84, top: 950, display: 'flex', gap: 30, fontSize: 22, fontWeight: 700}}>
        <span>Hot List</span><span style={{color: UI.mute}}>Top Gainers</span><span style={{color: UI.mute}}>New Listings</span><span style={{color: UI.mute}}>Volume Leaders</span>
      </div>
      {[['ETH', '2,662.93', '-1.66%', '1.53B'], ['BTC', '83,004.8', '-2.16%', '3.29B'], ['ZEC', '1,563.27', '-5.93%', '148.83M'], ['QNT', '239.19', '+43.75%', '292.54M'], ['SOL', '118.59', '-4.31%', '403.02M']].map((r, i) => (
        <div key={r[0]} style={{position: 'absolute', left: 84, top: 1010 + i * 68, width: 1272, height: 68, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${UI.line}`, fontSize: 16, ...num}}>
          <span style={{width: 380, fontWeight: 700}}>{r[0]}</span><span style={{width: 250}}>{r[1]}</span>
          <span style={{width: 250, color: r[2].startsWith('+') ? UI.up : UI.down}}>{r[2]}</span><span style={{width: 250}}>{r[3]}</span>
          <span style={{marginLeft: 'auto', background: '#fff', color: '#000', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 14}}>Trade</span>
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1440, height: 64, background: UI.bg}}><Nav /></div>
  </div>
);

// Desktop BTC/USDT trade screen, 1440 x 900.
export type TradeState = {draw: number; cross?: {x: number; y: number}; mode: number; press: number; loading: number; toast: number};
export const DesktopTrade: React.FC<{s: TradeState; f: number}> = ({s, f}) => {
  const cx0 = 20, cw = 1010, cy0 = 160, ch = 680;
  const lo = Math.min(...CANDLES.map((c) => c.l)), hi = Math.max(...CANDLES.map((c) => c.h));
  const y = (v: number) => cy0 + ch - ((v - lo) / (hi - lo)) * ch;
  const n = Math.floor(CANDLES.length * s.draw);
  const bw = cw / CANDLES.length;
  const futures = s.mode > 0.5;
  const knob = {l: 8 + s.mode * 172, w: 172};
  let hover: (typeof CANDLES)[number] | null = null;
  if (s.cross && s.cross.x < cx0 + cw) hover = CANDLES[Math.max(0, Math.min(n - 1, Math.floor((s.cross.x - cx0) / bw)))];
  return (
    <div style={{position: 'absolute', inset: 0, background: UI.bg, fontFamily: UI.font, color: UI.text, overflow: 'hidden'}}>
      <Nav />
      <div style={{position: 'absolute', left: 24, top: 80, display: 'flex', alignItems: 'baseline', gap: 26, ...num}}>
        <span style={{fontSize: 26, fontWeight: 700}}>BTC/USDT</span>
        <span style={{fontSize: 28, fontWeight: 700, color: UI.down}}>{BTC_HEADER.price}</span>
        <span style={{fontSize: 16, color: UI.down}}>{BTC_HEADER.chg}</span>
        {[['24H High', BTC_HEADER.high], ['24H Low', BTC_HEADER.low], ['24H Vol(BTC)', BTC_HEADER.vol]].map(([k, v]) => (
          <span key={k} style={{fontSize: 14, color: UI.mute}}>{k} <b style={{color: UI.text, fontWeight: 500}}>{v}</b></span>
        ))}
      </div>
      <svg width={1440} height={900} style={{position: 'absolute', inset: 0}}>
        {new Array(7).fill(0).map((_, i) => <line key={i} x1={cx0} x2={cx0 + cw} y1={cy0 + (i * ch) / 6} y2={cy0 + (i * ch) / 6} stroke="#1C1D20" />)}
        {CANDLES.slice(0, n).map((c, i) => {
          const up = c.c >= c.o, col = up ? UI.up : UI.down, x = cx0 + i * bw + bw / 2;
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth={1.5} />
              <rect x={x - bw * 0.32} y={y(Math.max(c.o, c.c))} width={bw * 0.64} height={Math.max(2, Math.abs(y(c.o) - y(c.c)))} fill={col} />
            </g>
          );
        })}
        {n > 0 && <line x1={cx0} x2={cx0 + cw} y1={y(CANDLES[n - 1].c)} y2={y(CANDLES[n - 1].c)} stroke={UI.down} strokeDasharray="4 5" />}
        {s.cross && hover && (
          <g>
            <line x1={s.cross.x} x2={s.cross.x} y1={cy0} y2={cy0 + ch} stroke="#6B6E75" strokeDasharray="4 4" />
            <line x1={cx0} x2={cx0 + cw} y1={s.cross.y} y2={s.cross.y} stroke="#6B6E75" strokeDasharray="4 4" />
          </g>
        )}
      </svg>
      {s.cross && hover && (
        <div style={{position: 'absolute', left: s.cross.x + 18, top: s.cross.y - 118, background: UI.card2, border: `1px solid ${UI.line}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, lineHeight: 1.6, ...num}}>
          {(['o', 'h', 'l', 'c'] as const).map((k) => <div key={k}><span style={{color: UI.mute, display: 'inline-block', width: 22}}>{k.toUpperCase()}</span>{hover![k].toFixed(1)}</div>)}
        </div>
      )}
      <div style={{position: 'absolute', left: 1050, top: 140, width: 370, height: 720, background: '#101113', borderRadius: 14, padding: 20, boxSizing: 'border-box'}}>
        <div style={{position: 'relative', height: 48, background: UI.card2, borderRadius: 12}}>
          <div style={{position: 'absolute', left: knob.l, top: 6, width: knob.w, height: 36, borderRadius: 9, background: '#2E3035'}} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', fontSize: 16, fontWeight: 600}}>
            <span style={{flex: 1, textAlign: 'center', lineHeight: '48px', color: futures ? UI.mute : UI.text}}>Spot</span>
            <span style={{flex: 1, textAlign: 'center', lineHeight: '48px', color: futures ? UI.text : UI.mute}}>Futures</span>
          </div>
        </div>
        <div style={{display: 'flex', gap: 22, marginTop: 22, fontSize: 15, fontWeight: 600}}><span>Limit</span><span style={{color: UI.mute}}>Market</span><span style={{color: UI.mute}}>Adv Limit</span></div>
        {[['Price', '83,004.8', 'USDT'], ['Amount', '0.012', 'BTC']].map(([k, v, u]) => (
          <div key={k} style={{marginTop: 18, height: 50, background: UI.card2, borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 15, ...num}}>
            <span style={{color: UI.mute}}>{k}</span><span style={{marginLeft: 'auto', fontWeight: 600}}>{v}</span><span style={{color: UI.mute, marginLeft: 8}}>{u}</span>
          </div>
        ))}
        <div style={{position: 'relative', marginTop: 26, height: 20}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 9, height: 2, background: UI.line}} />
          <div style={{position: 'absolute', left: 0, width: '25%', top: 9, height: 2, background: UI.cta}} />
          {[0, 25, 50, 75, 100].map((p) => <div key={p} style={{position: 'absolute', left: `calc(${p}% - 6px)`, top: 4, width: 12, height: 12, borderRadius: 6, background: p <= 25 ? UI.cta : UI.card2, border: `2px solid ${p <= 25 ? UI.cta : UI.line}`, boxSizing: 'border-box'}} />)}
        </div>
        <div style={{marginTop: 26, fontSize: 14, color: UI.mute, display: 'flex', ...num}}><span>Total</span><span style={{marginLeft: 'auto', color: UI.text}}>996.06 USDT</span></div>
        <div style={{position: 'absolute', left: 20, right: 20, bottom: 26, display: 'flex', gap: 12}}>
          {futures ? (
            <>
              <div style={{flex: 1, height: 54, borderRadius: 12, background: UI.up, textAlign: 'center', lineHeight: '54px', fontWeight: 700, fontSize: 17}}>Open Long</div>
              <div style={{flex: 1, height: 54, borderRadius: 12, background: UI.down, textAlign: 'center', lineHeight: '54px', fontWeight: 700, fontSize: 17}}>Open Short</div>
            </>
          ) : (
            <div style={{flex: 1, height: 54, borderRadius: 12, background: UI.up, transform: `scale(${1 - s.press * 0.04})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17}}>
              {s.loading > 0 && s.loading < 1
                ? <div style={{width: 22, height: 22, borderRadius: 11, border: '3px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', transform: `rotate(${f * 14}deg)`}} />
                : s.loading >= 1 ? '✓' : 'Buy BTC'}
            </div>
          )}
        </div>
      </div>
      {s.toast > 0 && <Toast t={s.toast} />}
    </div>
  );
};

export const TOAST = {x: 530, y: 86, w: 380, h: 58};
export const Toast: React.FC<{t: number}> = ({t}) => (
  <div style={{
    position: 'absolute', left: TOAST.x, top: TOAST.y - (1 - t) * 30, width: TOAST.w, height: TOAST.h, borderRadius: 14, background: '#1E1F23',
    border: `1px solid ${UI.line}`, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', boxSizing: 'border-box',
    fontFamily: UI.font, color: UI.text, fontSize: 17, fontWeight: 500, clipPath: `inset(0 0 ${(1 - t) * 100}% 0 round 14px)`,
  }}>
    <div style={{width: 24, height: 24, borderRadius: 12, background: UI.up, color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>
    Order placed successfully
  </div>
);

// ---------------------------------------------------------------- phone app, 390 x 806
const StatusBar: React.FC = () => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 390, height: 46, display: 'flex', alignItems: 'center', padding: '0 30px', boxSizing: 'border-box', fontSize: 16, fontWeight: 600}}>
    9:41
    <div style={{marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'flex-end'}}>
      {[6, 9, 12, 15].map((h) => <div key={h} style={{width: 3.5, height: h, borderRadius: 1, background: UI.text}} />)}
      <div style={{width: 26, height: 13, borderRadius: 4, border: `1.5px solid ${UI.text}`, marginLeft: 6, padding: 1.5, boxSizing: 'border-box'}}><div style={{width: '80%', height: '100%', background: UI.text, borderRadius: 2}} /></div>
    </div>
  </div>
);
const AppHeader: React.FC = () => (
  <div style={{position: 'absolute', left: 16, right: 16, top: 52, height: 40, display: 'flex', alignItems: 'center'}}>
    <Logo h={20} />
    <div style={{marginLeft: 'auto', width: 16, height: 16, borderRadius: 8, border: `2px solid ${UI.text}`}} />
    <div style={{marginLeft: 16, background: UI.cta, color: '#000', borderRadius: 8, padding: '7px 12px', fontSize: 14, fontWeight: 600}}>Sign Up</div>
  </div>
);

const TABS = ['Favorites', 'Spot', 'Futures', 'TradFi'];
const TAB_X = [16, 110, 170, 250];
const TAB_W = [80, 42, 64, 56];
// The indicator's two edges ride different springs so the leading edge stretches ahead.
const indicator = (f: number, switchAt: number) => {
  const from = 1, to = 3;
  const lead = sp(f - switchAt, 18, 260), trail = sp(f - switchAt - 5, 20, 180);
  const l0 = TAB_X[from], r0 = TAB_X[from] + TAB_W[from], l1 = TAB_X[to], r1 = TAB_X[to] + TAB_W[to];
  return {l: l0 + (l1 - l0) * trail, r: r0 + (r1 - r0) * lead};
};

export const PhoneMarkets: React.FC<{f: number; switchAt: number; tapRow: number; tapAt: number}> = ({f, switchAt, tapRow, tapAt}) => {
  const ind = indicator(f, switchAt);
  const tradfi = f >= switchAt + 6;
  const blur = interpolate(f - switchAt, [0, 6, 14], [0, 6, 0], clamp);
  const rows = tradfi ? TRADFI_ROWS : SPOT_ROWS;
  return (
    <div style={{position: 'absolute', inset: 0, background: UI.bg, fontFamily: UI.font, color: UI.text, overflow: 'hidden'}}>
      <StatusBar /><AppHeader />
      <div style={{position: 'absolute', left: 0, top: 110, width: 390, height: 34}}>
        {TABS.map((t, i) => <span key={t} style={{position: 'absolute', left: TAB_X[i], fontSize: 17, fontWeight: 600, color: (tradfi ? i === 3 : i === 1) ? UI.text : UI.mute}}>{t}{t === 'TradFi' && <span style={{position: 'absolute', right: -7, top: 0, width: 5, height: 5, borderRadius: 3, background: UI.down}} />}</span>)}
        <div style={{position: 'absolute', left: ind.l + 6, width: ind.r - ind.l - 12, top: 30, height: 3, borderRadius: 2, background: UI.accent}} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 150, width: 390, height: 700, filter: blur > 0.1 ? `blur(${blur}px)` : undefined}}>
        <div style={{display: 'flex', gap: 10, padding: '0 16px', fontSize: 14, fontWeight: 500}}>
          {(tradfi ? ['All', 'US stocks', 'Metal', 'ETF'] : ['All', 'US stocks', 'Metal', 'Korean stocks']).map((t, i) => (
            <span key={t} style={{padding: '6px 12px', borderRadius: 8, background: i === (tradfi ? 1 : 0) ? UI.card2 : 'transparent', color: i === (tradfi ? 1 : 0) ? UI.text : UI.mute}}>{t}</span>
          ))}
        </div>
        <div style={{display: 'flex', padding: '18px 16px 8px', fontSize: 12, color: UI.mute}}>
          <span>Trading pairs / 24H Volume</span><span style={{marginLeft: 'auto', marginRight: 40}}>Last Price</span><span>24H Change</span>
        </div>
        {rows.map((r, i) => {
          const up = r.chg.startsWith('+');
          const tapped = i === tapRow && f >= tapAt;
          return (
            <div key={r.sym} style={{height: 66, display: 'flex', alignItems: 'center', padding: '0 16px', background: tapped ? UI.card2 : 'transparent', ...num}}>
              <div>
                <div style={{fontSize: 17, fontWeight: 700}}>{r.sym}<span style={{color: UI.mute, fontSize: 13, fontWeight: 500}}>/USDT</span></div>
                <div style={{fontSize: 12, color: UI.mute, marginTop: 3}}>{'name' in r ? <>{r.name} <span style={{color: UI.accent, background: 'rgba(126,194,90,0.12)', padding: '1px 5px', borderRadius: 4}}>{r.tag}</span></> : r.vol}</div>
              </div>
              <div style={{marginLeft: 'auto', textAlign: 'right', marginRight: 14}}>
                <div style={{fontSize: 16, fontWeight: 700}}>{r.price}</div>
                {'fiat' in r && <div style={{fontSize: 12, color: UI.mute, marginTop: 3}}>{r.fiat}</div>}
              </div>
              <div style={{width: 84, height: 36, borderRadius: 6, background: up ? UI.up : UI.down, textAlign: 'center', lineHeight: '36px', fontSize: 15, fontWeight: 600}}>{r.chg}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Prediction market card. `pick` is 0 (none), 1 (up) or -1 (down); `share` is the Up probability shown.
export const PhonePredict: React.FC<{f: number; market: 'BTC' | 'XRP'; pick: number; share: number; flip: number}> = ({market, pick, share, flip}) => (
  <div style={{position: 'absolute', inset: 0, background: UI.bg, fontFamily: UI.font, color: UI.text, overflow: 'hidden'}}>
    <StatusBar /><AppHeader />
    <div style={{position: 'absolute', left: 16, top: 110, fontSize: 24, fontWeight: 700}}>Hotcoin Prediction Market</div>
    <div style={{position: 'absolute', left: 16, top: 156, display: 'flex', gap: 20, fontSize: 17, fontWeight: 600}}>
      <span style={{color: UI.mute}}>Recommended</span><span>Crypto</span><span style={{color: UI.mute}}>Trending</span><span style={{color: UI.mute}}>Football</span>
    </div>
    <div style={{position: 'absolute', left: 135, top: 186, width: 56, height: 3, borderRadius: 2, background: UI.accent}} />
    <div style={{position: 'absolute', left: 16, right: 16, top: 216, height: 330, perspective: 1200}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 20, background: UI.card, border: `1px solid ${UI.line}`, padding: 20, boxSizing: 'border-box', transform: `rotateY(${flip}deg)`, backfaceVisibility: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 44, height: 44, borderRadius: 22, background: market === 'BTC' ? '#F7931A' : '#23292F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800}}>{market}</div>
          <div>
            <div style={{fontSize: 19, fontWeight: 700}}>{market} Up or Down · 15m</div>
            <div style={{fontSize: 13, color: UI.mute, marginTop: 3}}>Crypto · 15 minute market</div>
          </div>
        </div>
        <div style={{marginTop: 34, display: 'flex', fontSize: 15, fontWeight: 600, ...num}}>
          <span style={{color: UI.up}}>Up {Math.round(share)}%</span><span style={{marginLeft: 'auto', color: UI.down}}>Down {100 - Math.round(share)}%</span>
        </div>
        <div style={{marginTop: 10, height: 10, borderRadius: 5, background: 'rgba(246,70,93,0.35)', overflow: 'hidden'}}>
          <div style={{width: `${share}%`, height: '100%', background: UI.up, borderRadius: 5}} />
        </div>
        <div style={{position: 'absolute', left: 20, right: 20, bottom: 22, display: 'flex', gap: 12}}>
          <div style={{flex: 1, height: 58, borderRadius: 12, background: pick === 1 ? UI.up : 'rgba(45,189,133,0.14)', color: pick === 1 ? '#fff' : UI.up, textAlign: 'center', lineHeight: '58px', fontSize: 18, fontWeight: 700}}>Up</div>
          <div style={{flex: 1, height: 58, borderRadius: 12, background: pick === -1 ? UI.down : 'rgba(246,70,93,0.14)', color: pick === -1 ? '#fff' : UI.down, textAlign: 'center', lineHeight: '58px', fontSize: 18, fontWeight: 700}}>Down</div>
        </div>
      </div>
    </div>
  </div>
);
