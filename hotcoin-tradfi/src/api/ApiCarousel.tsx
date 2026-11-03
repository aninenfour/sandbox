// "Build with the Hotcoin API" X carousel (4 x 1080 x 1350), in the Meme Math style.
// API facts: Hotcoin spot API docs (hotcoinex.github.io/en/spot, github.com/hotcoinexchange/openapi): REST https://api.hotcoinfin.com,
// WebSocket wss://wss.hotcoinfin.com/trade/multiple ({"sub": channel}, gzip frames, {"ping"} -> {"pong"}), public market data
// (/v1/market/ticker, /v1/depth, /v1/ticker kline, /v1/trade), signed private calls (HmacSHA256, SignatureVersion 2),
// POST /v1/order/place (symbol, type, tradeAmount, tradePrice), rate limits 10 req/s (orders, account) and 20 req/s (market).
// "API service is free for Hotcoin users" (hotcoin.com/en_US/docs). Market numbers: live snapshot in snapshot.json.
// Coin logos: CoinGecko.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {DOWN, INK, LIME, MONO, SANS, UP, WHITE, useFonts} from '../promo4/kit';
import snap from './snapshot.json';

const MUTED = 'rgba(245,247,242,0.55)';
const PAIRS = snap.pairs;
const snapTime = new Date(snap.fetched_ms).toISOString().slice(0, 16).replace('T', ' ') + ' UTC';

// tiny Python highlighter: comments, strings, numbers, keywords
const KW = /\b(import|from|while|True|for|in|if|else|break|async|def|await|with|as|return|next)\b/;
const Code: React.FC<{src: string; size?: number}> = ({src, size = 23}) => (
  <pre style={{margin: 0, fontFamily: MONO, fontSize: size, lineHeight: 1.5, color: WHITE, whiteSpace: 'pre', fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "calt" 0'}}>
    {src.split('\n').map((line, li) => {
      const parts: React.ReactNode[] = [];
      const re = /(#.*$)|("(?:[^"\\]|\\.)*")|(\b\d[\d_.,]*\b)|(\b[A-Za-z_]+\b)|(\s+)|(.)/g;
      let m: RegExpExecArray | null, k = 0;
      while ((m = re.exec(line))) {
        const [tok, com, str, num, word] = m;
        const color = com ? 'rgba(245,247,242,0.38)' : str ? '#E9D9A6' : num ? '#8FD3FF' : word && KW.test(word) && word.length === (word.match(KW)?.[0].length ?? 0) ? LIME : undefined;
        parts.push(<span key={k++} style={{color}}>{tok}</span>);
      }
      return <div key={li}>{parts.length ? parts : ' '}</div>;
    })}
  </pre>
);

const Shell: React.FC<{page: string; title: React.ReactNode; children: React.ReactNode; foot?: React.ReactNode}> = ({page, title, children, foot}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 55% at 85% 0%, #2B4A14 0%, #0E1A0A 45%, #07090A 80%)', color: WHITE, fontFamily: SANS, overflow: 'hidden'}}>
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1.4px, transparent 1.6px)', backgroundSize: '36px 36px', maskImage: 'linear-gradient(180deg, #000 0%, transparent 55%)'}} />
      <Img src={staticFile('brand/symbol-official-white.png')} style={{position: 'absolute', width: 1100, height: 1100, right: -420, top: -330, opacity: 0.05, transform: 'rotate(-10deg)'}} />
      <div style={{position: 'absolute', left: 72, right: 72, top: 64, display: 'flex', alignItems: 'center'}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 210, height: (210 * 328) / 2005}} />
        <div style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: LIME, border: '1.5px solid rgba(184,242,106,0.5)', borderRadius: 100, padding: '10px 20px'}}>BUILD WITH API · {page}</div>
      </div>
      <div style={{position: 'absolute', left: 72, right: 72, top: 168, fontWeight: 600, fontSize: 88, lineHeight: 0.98, letterSpacing: -4}}>{title}</div>
      {children}
      {foot && <div style={{position: 'absolute', left: 72, right: 72, bottom: 64}}>{foot}</div>}
    </AbsoluteFill>
  );
};
const Card: React.FC<{top: number; height?: number; children: React.ReactNode; pad?: string; style?: React.CSSProperties}> = ({top, height, children, pad = '30px 36px', style}) => (
  <div style={{position: 'absolute', left: 48, right: 48, top, height, borderRadius: 40, padding: pad, background: 'linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))',
    border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 40px 80px rgba(0,0,0,0.45)', boxSizing: 'border-box', overflow: 'hidden', ...style}}>{children}</div>
);
const TermBar: React.FC<{label: string}> = ({label}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20}}>
    {['#F6465D', '#F2C14E', '#2DBD85'].map((c) => <div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c, opacity: 0.85}} />)}
    <div style={{marginLeft: 14, fontFamily: MONO, fontSize: 18, color: MUTED, letterSpacing: 1}}>{label}</div>
  </div>
);
const FootRow: React.FC<{left: string; right: React.ReactNode}> = ({left, right}) => (
  <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
    <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: MUTED, lineHeight: 1.6, whiteSpace: 'pre-line'}}>{left}</div>
    <div style={{textAlign: 'right', whiteSpace: 'nowrap'}}>{right}</div>
  </div>
);

// ---------- 1 / 4 · cover: one call, every market ----------
const LOGO: Record<string, string> = {btc: 'BTC', eth: 'ETH', sol: 'SOL', doge: 'DOGE'};
export const ApiSlide1: React.FC = () => (
  <Shell page="1/4" title={<>{PAIRS} markets.<br /><span style={{color: LIME}}>One API call.</span></>}
    foot={<FootRow left={`PUBLIC ENDPOINT · NO API KEY\nSNAPSHOT ${snapTime}`} right={<><div style={{fontWeight: 600, fontSize: 44, letterSpacing: -1.5}}>3 bots you can build →</div><div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: MUTED, marginTop: 8}}>SWIPE</div></>} />}>
    <Card top={430}>
      <TermBar label="terminal" />
      <div style={{fontFamily: MONO, fontSize: 25, color: WHITE, lineHeight: 1.4}}><span style={{color: LIME}}>$</span> curl api.hotcoinfin.com<span style={{color: LIME}}>/v1/market/ticker</span></div>
      <div style={{marginTop: 26, borderTop: '1px solid rgba(255,255,255,0.08)'}}>
        {snap.tickers.map((t) => {
          const base = t.symbol.split('_')[0], ch = parseFloat(t.change), last = parseFloat(t.last);
          return (
            <div key={t.symbol} style={{display: 'flex', alignItems: 'center', height: 106, borderBottom: '1px solid rgba(255,255,255,0.06)'}}>
              <Img src={staticFile(`api/coins/${LOGO[base]}.png`)} style={{width: 56, height: 56, borderRadius: 28}} />
              <div style={{marginLeft: 22, fontWeight: 600, fontSize: 38, letterSpacing: -1}}>{base.toUpperCase()}<span style={{color: MUTED, fontWeight: 500}}>/USDT</span></div>
              <div style={{marginLeft: 'auto', fontFamily: MONO, fontWeight: 700, fontSize: 36}}>{last >= 1 ? last.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : last.toString()}</div>
              <div style={{width: 150, textAlign: 'right', fontFamily: MONO, fontWeight: 700, fontSize: 28, color: ch >= 0 ? UP : DOWN}}>{ch >= 0 ? '+' : '−'}{Math.abs(ch).toFixed(2)}%</div>
            </div>
          );
        })}
        <div style={{height: 70, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 24, color: MUTED}}>… and {PAIRS - snap.tickers.length} more pairs in the same response</div>
      </div>
    </Card>
  </Shell>
);

// ---------- 2 / 4 · price alert bot ----------
const ALERT = `import requests, time

URL = "https://api.hotcoinfin.com/v1/market/ticker"
ALERT = 75_000  # ping me if BTC dips below this

while True:
    tickers = requests.get(URL).json()["ticker"]
    btc = next(t for t in tickers if t["symbol"] == "btc_usdt")
    if float(btc["last"]) < ALERT:
        print("BTC under", ALERT, "now", btc["last"])
        break
    time.sleep(5)  # market data allows 20 req/s`;
export const ApiSlide2: React.FC = () => (
  <Shell page="2/4" title={<>Bot #1: price alert.<br /><span style={{color: LIME}}>12 lines of Python.</span></>}
    foot={<FootRow left={'NO API KEY NEEDED\nWIRE IT TO TELEGRAM OR DISCORD'} right={<div style={{fontWeight: 600, fontSize: 40, letterSpacing: -1.2}}>Next: a live order book →</div>} />}>
    <Card top={430}>
      <TermBar label="alert.py" />
      <Code src={ALERT} size={23} />
      <div style={{marginTop: 26, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: MONO, fontSize: 23, lineHeight: 1.5}}>
        <div><span style={{color: LIME}}>$</span> python alert.py</div>
        <div style={{color: MUTED}}>watching btc_usdt · last {parseFloat(snap.tickers[0].last).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
      </div>
    </Card>
  </Shell>
);

// ---------- 3 / 4 · live order book over WebSocket ----------
const WS = `async with websockets.connect(
        "wss://wss.hotcoinfin.com/trade/multiple") as ws:
    await ws.send(json.dumps({"sub": "market.btc_usdt.trade.depth"}))
    async for frame in ws:
        msg = json.loads(gzip.decompress(frame))
        if "ping" in msg:
            await ws.send(json.dumps({"pong": "pong"}))
        else:
            draw_book(msg)  # bids, asks, spread`;
const Book: React.FC = () => {
  const asks = snap.asks.slice(0, 4).reverse(), bids = snap.bids.slice(0, 4);
  const max = Math.max(...asks.map((a) => a[1]), ...bids.map((b) => b[1]));
  const row = ([p, a]: number[], up: boolean, i: number) => (
    <div key={`${up}${i}`} style={{position: 'relative', display: 'flex', alignItems: 'center', height: 38, fontFamily: MONO, fontSize: 22}}>
      <div style={{position: 'absolute', right: 0, top: 4, bottom: 4, width: `${(a / max) * 100}%`, background: up ? 'rgba(45,189,133,0.18)' : 'rgba(246,70,93,0.18)', borderRadius: 6}} />
      <div style={{position: 'relative', width: 260, color: up ? UP : DOWN, fontWeight: 700}}>{p.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
      <div style={{position: 'relative', marginLeft: 'auto', color: WHITE}}>{a.toFixed(5)} BTC</div>
    </div>
  );
  const spread = snap.asks[0][0] - snap.bids[0][0];
  return (
    <>
      {asks.map((r, i) => row(r, false, i))}
      <div style={{display: 'flex', alignItems: 'center', height: 50, fontFamily: MONO, fontSize: 20, color: MUTED, borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', margin: '4px 0'}}>
        SPREAD <span style={{marginLeft: 12, color: LIME, fontWeight: 700}}>{spread.toFixed(2)} USDT</span><span style={{marginLeft: 'auto'}}>BTC/USDT · {snapTime}</span>
      </div>
      {bids.map((r, i) => row(r, true, i))}
    </>
  );
};
export const ApiSlide3: React.FC = () => (
  <Shell page="3/4" title={<>Bot #2: live order book.<br /><span style={{color: LIME}}>Pushed, not polled.</span></>}
    foot={<FootRow left={'CHANNELS: KLINE · DEPTH · BBO\n24H TICKERS · TRADE DETAIL'} right={<div style={{fontWeight: 600, fontSize: 40, letterSpacing: -1.2}}>Next: your own DCA bot →</div>} />}>
    <Card top={400} pad="24px 32px">
      <TermBar label="book.py · websocket" />
      <Code src={WS} size={21} />
    </Card>
    <Card top={792} height={392} pad="16px 32px"><Book /></Card>
  </Shell>
);

// ---------- 4 / 4 · signed orders: a DCA bot ----------
const DCA = `# every Monday: buy 0.001 BTC at the best ask
order = {
    "symbol": "btc_usdt",
    "type": "buy",
    "tradeAmount": "0.001",
    "tradePrice": best_ask,
}
query = sign("POST", "/v1/order/place", order)  # HmacSHA256 v2
requests.post(BASE + "/v1/order/place?" + query)`;
const TIPS: [string, string][] = [
  ['Keys stay in env vars', 'Never hard-code the SecretKey.'],
  ['Least permission', 'Give the key only what the bot needs.'],
  ['Mind the limits', '10 req/s for orders · 20 req/s market data.'],
];
export const ApiSlide4: React.FC = () => (
  <Shell page="4/4" title={<>Bot #3: your own DCA.<br /><span style={{color: LIME}}>Signed and scheduled.</span></>}
    foot={<FootRow left={'NOT FINANCIAL ADVICE\nBOTS CAN LOSE MONEY. TEST SMALL.'} right={<><div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: MUTED}}>FREE FOR HOTCOIN USERS</div><div style={{marginTop: 10, display: 'inline-block', background: LIME, color: INK, borderRadius: 999, padding: '14px 26px', fontWeight: 700, fontSize: 30}}>hotcoin.com/en_US/docs</div></>} />}>
    <Card top={410} pad="26px 32px">
      <TermBar label="dca.py · signed request" />
      <Code src={DCA} size={22} />
    </Card>
    <Card top={850} pad="14px 36px">
      {TIPS.map(([t, d], i) => (
        <div key={t} style={{display: 'flex', alignItems: 'center', gap: 24, height: 96, borderTop: i ? '1px solid rgba(255,255,255,0.06)' : undefined}}>
          <div style={{width: 46, height: 46, borderRadius: 23, background: 'rgba(184,242,106,0.14)', border: `2px solid ${LIME}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>
            <svg width={24} height={24} viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" stroke={LIME} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div><div style={{fontWeight: 600, fontSize: 32, letterSpacing: -0.8}}>{t}</div><div style={{fontSize: 23, color: MUTED, marginTop: 2}}>{d}</div></div>
        </div>
      ))}
    </Card>
  </Shell>
);
