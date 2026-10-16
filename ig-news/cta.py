"""CTA end card and the Instagram Story frame.

End card: brand-green backdrop, "Claim your welcome bonus" headline, three market chips with real
token/stock logos, an iPhone showing the real Hotcoin app Home screen (layout + icons taken from the
app; icons cropped from app screenshots in assets/app/), and a "Register now / Link in bio" button.
Prices are LIVE from Hotcoin's public ticker (api.hotcoinfin.com/v1/market/ticker); sparklines are the
last 24 h from CoinGecko (crypto, gold) and Yahoo Finance (stocks). Cached in assets/live.json as fallback.
"""
import json, pathlib, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent
UP, DOWN = '#2DBD85', '#F6465D'
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) HotcoinNewsDesk/1.0'}
CARDS = [('BTC', 'Crypto', 'btc_usdt', ('cg', 'bitcoin')), ('TSLA', 'Stocks', 'tslab_usdt', ('yf', 'TSLA')),
         ('XAUT', 'Gold', 'xaut_usdt', ('cg', 'tether-gold')), ('SPY', 'ETF', 'spyb_usdt', ('yf', 'SPY'))]
ROWS = [('BTC', 'btc_usdt'), ('ETH', 'eth_usdt'), ('NVDA', 'nvdab_usdt'), ('SOL', 'sol_usdt')]


def _get(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20))


def live():
    cache = ROOT / 'assets' / 'live.json'
    old = json.loads(cache.read_text()) if cache.exists() else {'tick': {}, 'spark': {}}
    out = {'tick': old.get('tick', {}), 'spark': old.get('spark', {})}
    try:
        t = _get('https://api.hotcoinfin.com/v1/market/ticker')['ticker']
        out['tick'] = {x['symbol']: {'last': x['last'], 'change': x['change']} for x in t}
    except Exception:
        pass
    for sym, _, _, (src, key) in CARDS:
        try:
            if src == 'cg':
                ys = [p[1] for p in _get(f'https://api.coingecko.com/api/v3/coins/{key}/market_chart?vs_currency=usd&days=1')['prices']]
            else:
                r = _get(f'https://query1.finance.yahoo.com/v8/finance/chart/{key}?range=5d&interval=30m')['chart']['result'][0]
                ys = [y for y in r['indicators']['quote'][0]['close'] if y][-26:]
            out['spark'][sym] = ys[:: max(1, len(ys) // 40)]
        except Exception:
            pass
    cache.write_text(json.dumps(out))
    return out


def fmt(v, small=False):
    v = float(v)
    if v >= 10000 and not small:
        return f'{v:,.0f}'
    return f'{v:,.2f}' if v >= 1 else f'{v:.4f}'


def spark(ys, up):
    if not ys or len(ys) < 3:
        return ''
    lo, hi = min(ys), max(ys); hi = hi if hi > lo else lo + 1
    pts = ' '.join(f'{i * 100 / (len(ys) - 1):.1f},{30 - (y - lo) / (hi - lo) * 28 - 1:.1f}' for i, y in enumerate(ys))
    return f'<svg viewBox="0 0 100 30" preserveAspectRatio="none"><polyline points="{pts}" fill="none" stroke="{UP if up else DOWN}" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>'


CSS = """
.cta{background:radial-gradient(ellipse 90% 80% at 72% 64%,#E9FCD0 0%,#C6F28C 36%,#8FD84E 72%,#5BAA2E 100%);color:#07090A}
.cta .ring{position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,.5)}
.cta .gr{position:absolute;inset:0;background:url(GRAIN);background-size:320px;mix-blend-mode:overlay;opacity:.08}
.cta .top{position:absolute;left:66px;top:70px;display:flex;align-items:center;gap:14px;font-size:24px;font-weight:600;letter-spacing:.14em}
.cta .top img{width:44px;height:44px;background:#07090A;border-radius:12px;padding:8px}
.cta .h1{position:absolute;left:62px;top:142px;font-family:'Inter Display';font-weight:800;font-size:104px;line-height:.93;letter-spacing:-.045em}
.cta .h1 span{background:#07090A;color:#B8F26A;padding:0 16px;border-radius:14px;display:inline-block;margin-top:8px}
.cta .sub{position:absolute;left:66px;top:388px;width:520px;font-size:32px;line-height:1.35;font-weight:500;color:#1b2a10}
.cta .chip{position:absolute;left:58px;width:470px;background:rgba(255,255,255,.78);backdrop-filter:blur(10px);border-radius:28px;padding:20px 22px;box-shadow:0 18px 40px rgba(30,60,10,.16)}
.cta .chip .lg{display:flex;margin-bottom:12px}
.cta .chip .lg img{width:58px;height:58px;border-radius:50%;background:#fff;border:3px solid #fff;padding:6px;margin-right:-12px;object-fit:contain;box-shadow:0 3px 8px rgba(0,0,0,.15)}
.cta .chip b{display:block;font-size:28px;letter-spacing:-.01em}
.cta .chip i{font-style:normal;font-size:21px;color:#43503a}
.cta .btn{position:absolute;left:58px;bottom:66px;height:100px;padding:0 40px 0 38px;border-radius:60px;background:#07090A;color:#fff;display:flex;align-items:center;gap:20px;font-size:35px;font-weight:700;box-shadow:0 20px 50px rgba(0,0,0,.28)}
.cta .btn em{font-style:normal;background:#B8F26A;color:#07090A;border-radius:40px;padding:12px 22px;font-size:27px}
.phone{position:absolute;left:604px;top:398px;width:452px;height:972px;border-radius:72px;padding:14px;background:linear-gradient(135deg,#8B8E93 0%,#3B3D41 18%,#1C1D20 50%,#4A4C50 82%,#9EA1A6 100%);transform:rotate(4deg) scale(.91);transform-origin:0 0;box-shadow:0 60px 90px rgba(20,40,10,.38)}
.phone .scr{position:relative;width:424px;height:944px;border-radius:60px;overflow:hidden;background:#0F0F0F}
.phone .app{position:absolute;left:0;top:0;width:390px;height:868px;transform:scale(1.0872);transform-origin:0 0;color:#F2F3F3;font-family:'Inter',sans-serif}
.app .isl{position:absolute;left:50%;top:11px;width:120px;height:34px;margin-left:-60px;border-radius:18px;background:#000;z-index:5}
.app .sb{position:absolute;left:0;right:0;top:0;height:50px;display:flex;align-items:center;padding:4px 30px 0 38px;font-size:16px;font-weight:600}
.app .sb .r{margin-left:auto;display:flex;gap:5px;align-items:flex-end}
.app .sb .r i{width:3px;background:#fff;border-radius:1px;display:block}
.app .sb .bat{width:24px;height:12px;border:1.5px solid #fff;border-radius:4px;padding:1.5px;margin-left:5px}.app .sb .bat div{width:85%;height:100%;background:#fff;border-radius:1.5px}
.app .hdr{position:absolute;left:16px;right:14px;top:54px;height:34px;display:flex;align-items:center;gap:10px}
.app .av{width:30px;height:30px;border-radius:9px;background:#7EC25A;display:flex;align-items:center;justify-content:center}.app .av img{width:18px;filter:brightness(0)}
.app .srch{flex:1;height:31px;border-radius:9px;background:#1F2020;display:flex;align-items:center;padding-left:10px;gap:7px;font-size:12.5px;color:#8B8E8E}
.app .srch i{width:12px;height:12px;border:1.6px solid #8B8E8E;border-radius:50%;display:block}
.app .hdr .ic{height:28px}
.app .ast{position:absolute;left:16px;top:98px;font-size:12px;color:#C9CBCB}
.app .bal{position:absolute;left:16px;top:116px;font-size:29px;font-weight:700;letter-spacing:-.01em;font-variant-numeric:tabular-nums}.app .bal small{font-size:14px;font-weight:600;margin-left:6px}
.app .cny{position:absolute;left:16px;top:156px;font-size:11.5px;color:#C9CBCB}
.app .dep{position:absolute;right:16px;top:116px;height:34px;padding:0 18px;border-radius:9px;background:#fff;color:#0F0F0F;font-size:15px;font-weight:700;line-height:34px}
.app .grid{position:absolute;left:8px;right:8px;top:190px;display:grid;grid-template-columns:repeat(4,1fr);row-gap:10px}
.app .grid div{text-align:center;font-size:11.5px;line-height:1.2;color:#E9EAEA;position:relative}
.app .grid img{width:46px;height:46px;display:block;margin:0 auto 5px}
.app .grid .nw{position:absolute;left:58px;top:-6px;height:12px;width:auto}
.app .mk{position:absolute;left:16px;right:16px;top:356px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.app .mk div.c{background:#1C1D1D;border-radius:10px;height:70px;padding:9px 10px;position:relative}
.app .mk .t{font-size:12px;font-weight:700}.app .mk .t span{font-weight:400;color:#9A9D9D;margin-left:4px;font-size:11px}
.app .mk .p{position:absolute;left:10px;bottom:9px;font-size:15px;font-weight:600;font-variant-numeric:tabular-nums}.app .mk .p span{font-size:10px;margin-left:5px;font-weight:600}
.app .mk svg{position:absolute;right:9px;top:9px;width:40px;height:18px}
.app .bnr{position:absolute;left:16px;right:16px;top:516px;height:70px;border:1px solid #2A2B2B;border-radius:12px;display:flex;align-items:center;padding:0 12px;gap:12px;background:linear-gradient(100deg,rgba(126,194,90,.12),rgba(126,194,90,0) 60%)}
.app .bnr img{width:46px;height:46px}
.app .bnr .a{font-size:11.5px;color:#C9CBCB}.app .bnr .b{font-size:15px;font-weight:700;margin-top:3px}.app .bnr .b span{color:#7EC25A}
.app .bnr .go{margin-left:auto;font-size:11px;font-weight:700;background:#7EC25A;color:#0F0F0F;border-radius:14px;padding:6px 10px}
.app .tb1{position:absolute;left:16px;top:604px;display:flex;gap:16px;font-size:17px;font-weight:700;color:#7E8181}.app .tb1 .on{color:#fff}
.app .tb2{position:absolute;left:16px;top:640px;display:flex;gap:8px;font-size:12px;color:#8B8E8E}.app .tb2 span{padding:5px 10px}.app .tb2 .on{background:#1F2020;color:#fff;border-radius:7px}
.app .rows{position:absolute;left:16px;right:16px;top:676px}
.app .row{display:flex;align-items:center;height:50px;font-variant-numeric:tabular-nums}
.app .row img{width:30px;height:30px;border-radius:50%;background:#fff;padding:3px;margin-right:9px;object-fit:contain}
.app .row b{font-size:14px}.app .row b small{font-size:11px;color:#8B8E8E;font-weight:500}
.app .row .px{margin-left:auto;margin-right:10px;text-align:right;font-size:13.5px;font-weight:600}
.app .row .ch{width:70px;height:28px;border-radius:6px;text-align:center;line-height:28px;font-size:12px;font-weight:700;color:#fff}
.app .nav{position:absolute;left:14px;right:14px;bottom:22px;height:64px;border-radius:34px;background:rgba(41,41,41,.96);border:1px solid #3a3a3a;display:flex;align-items:center;justify-content:space-around;padding:0 6px;z-index:4}
.app .nav div{text-align:center;font-size:10.5px;color:#E3E4E4;width:62px;height:54px;border-radius:27px;padding-top:5px}
.app .nav div.on{background:#151515}
.app .nav img{height:25px;display:block;margin:0 auto 3px}
.story{background:#000}
.story .bg{position:absolute;inset:-60px;background-size:cover;background-position:center;filter:blur(40px) brightness(.45)}
.story .card{position:absolute;left:97px;top:420px;width:886px;height:1107px;border-radius:36px;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.6)}
.story .card img{width:100%;height:100%;display:block}
.story .np{position:absolute;left:97px;top:300px;display:flex;align-items:center;gap:16px;font-size:34px;font-weight:700;color:#fff}
.story .np span{background:#7EC25A;color:#07090A;padding:10px 22px;border-radius:40px;font-size:30px;letter-spacing:.06em}
.story .hint{position:absolute;left:0;right:0;top:1580px;text-align:center;font-size:38px;font-weight:600;color:#fff}
.story .hint b{color:#B8F26A}
.story .brand{position:absolute;left:0;right:0;top:150px;display:flex;justify-content:center}
.story .brand img{height:48px}
"""


def s_end(g):
    A = lambda name: g['uri'](str(ROOT / 'assets' / 'app' / f'{name}.png'), ROOT)

    def L(sym):
        for ext in ('svg', 'png'):
            p = ROOT / 'assets' / 'logos' / f'{sym}.{ext}'
            if p.exists():
                return g['uri'](str(p), ROOT)
        return ''

    def render(s, base):
        d = live(); t = d['tick']
        cards = ''
        for sym, cat, key, _ in CARDS:
            x = t.get(key)
            if not x:
                continue
            ch = float(x['change'])
            cards += (f'<div class="c"><div class="t">{sym}<span>{cat}</span></div>{spark(d["spark"].get(sym), ch >= 0)}'
                      f'<div class="p">{fmt(x["last"])}<span style="color:{UP if ch >= 0 else DOWN}">{"+" if ch >= 0 else ""}{ch:.2f}%</span></div></div>')
        rows = ''
        for sym, key in ROWS:
            x = t.get(key)
            if not x:
                continue
            ch = float(x['change'])
            rows += (f'<div class="row"><img src="{L(sym)}"><b>{sym}<small> /USDT</small></b><div class="px">{fmt(x["last"], True)}</div>'
                     f'<div class="ch" style="background:{UP if ch >= 0 else DOWN}">{"+" if ch >= 0 else ""}{ch:.2f}%</div></div>')
        grid = ''.join(f'<div><img src="{A(i)}">{n}' + (f'<img class="nw" src="{A("badge_new")}">' if i == 'ic_campaign' else '') + '</div>' for i, n in [
            ('ic_rewards', 'Rewards<br>Center'), ('ic_campaign', 'Campaign<br>Center'), ('ic_referral', 'Referral'), ('ic_grid', 'Futures Grid'),
            ('ic_copy', 'Copy Trading'), ('ic_deposit', 'Deposit'), ('ic_p2p', 'P2P'), ('ic_more', 'More')])
        nav = ''.join(f'<div class="{"on" if i == "tab_home" else ""}"><img src="{A(i)}">{n}</div>' for i, n in [
            ('tab_home', 'Home'), ('tab_market', 'Market'), ('tab_trade', 'Trade'), ('tab_futures', 'Futures'), ('tab_assets', 'Assets')])
        app = f'''<div class="app"><div class="isl"></div>
<div class="sb">9:41<div class="r"><i style="height:5px"></i><i style="height:8px"></i><i style="height:11px"></i><i style="height:14px"></i><div class="bat"><div></div></div></div></div>
<div class="hdr"><div class="av"><img src="{g['SYM']}"></div><div class="srch"><i></i>Search contracts</div><img class="ic" src="{A('top_support')}"><img class="ic" src="{A('top_scan')}"><img class="ic" src="{A('top_bell')}"></div>
<div class="ast">Est. Total Asset Value &#9673;</div><div class="bal">0.00<small>USDT ▾</small></div><div class="cny">≈0.00 CNY</div><div class="dep">Deposit</div>
<div class="grid">{grid}</div><div class="mk">{cards}</div>
<div class="bnr"><img src="{A('ic_rewards')}"><div><div class="a">New user exclusive</div><div class="b"><span>Welcome bonus</span> waiting</div></div><div class="go">Claim</div></div>
<div class="tb1"><span>Favorites</span><span class="on">Spot</span><span>Futures</span><span>US stocks</span></div>
<div class="tb2"><span class="on">Hot</span><span>Gainers</span><span>Losers</span><span>New Listings</span></div>
<div class="rows">{rows}</div><div class="nav">{nav}</div></div>'''
        chips = [(['BTC', 'ETH', 'SOL', 'XRP'], 'Crypto', 'Bitcoin, Ethereum, Solana &amp; more'),
                 (['NVDA', 'TSLA', 'AAPL', 'META'], 'US stocks', 'NVIDIA, Tesla, Apple, Meta'),
                 (['XAUT', 'USDT'], 'Gold &amp; ETFs', 'all with one USDT account')]
        chip_html = ''.join(f'<div class="chip" style="top:{486 + i * 186}px"><div class="lg">' + ''.join(f'<img src="{L(x)}">' for x in lg)
                            + f'</div><b>{b}</b><i>{c}</i></div>' for i, (lg, b, c) in enumerate(chips))
        rings = ''.join(f'<div class="ring" style="left:{820-r}px;top:{860-r}px;width:{2*r}px;height:{2*r}px;opacity:{.6-i*.08}"></div>' for i, r in enumerate(range(300, 1100, 160)))
        return f'''<div class="slide cta">{rings}<div class="gr"></div>
<div class="top"><img src="{g['SYM']}">HOTCOIN EXCHANGE</div>
<div class="h1">Claim your<br><span>welcome bonus</span></div>
<div class="sub">Register on Hotcoin and trade crypto &amp; stocks in one app.</div>
{chip_html}<div class="phone"><div class="scr">{app}</div></div>
<div class="btn">Register now <em>Link in bio ↗</em></div></div>'''
    return render


def render_story(page, css_base, cover_jpg, out_path, g):
    """1080x1920 Story: blurred cover backdrop + the cover card + 'new post' hint."""
    cover = g['uri'](str(cover_jpg), ROOT)
    logo_w = g['uri'](str(ROOT / 'assets' / 'logo-official-white.png'), ROOT)
    body = f'''<div class="slide story" style="width:1080px;height:1920px"><div class="bg" style="background-image:url({cover})"></div>
<div class="brand"><img src="{logo_w}"></div>
<div class="np"><span>NEW POST</span> Hotcoin News</div>
<div class="card"><img src="{cover}"></div>
<div class="hint">Full story on our feed 👉 <b>@hotcoinex</b></div></div>'''
    page.set_viewport_size({'width': 1080, 'height': 1920})
    page.set_content(f'<!doctype html><html><head><meta charset="utf-8"><style>{css_base}html,body{{width:1080px;height:1920px}}</style></head><body>{body}</body></html>')
    page.wait_for_load_state('networkidle')
    page.screenshot(path=str(out_path), type='jpeg', quality=95)
    page.set_viewport_size({'width': 1080, 'height': 1350})
