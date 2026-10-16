"""CTA end card (replaces the old brand card) and the Instagram Story frame.

End card: brand-green backdrop, "Claim your welcome bonus" headline, register CTA ("link in bio"),
and an iPhone showing the Hotcoin app with LIVE prices from Hotcoin's public ticker
(api.hotcoinfin.com/v1/market/ticker); falls back to assets/tickers.json when offline.
"""
import json, pathlib, urllib.request, html as H

ROOT = pathlib.Path(__file__).resolve().parent
ROWS = [('BTC', 'btc_usdt', 'Bitcoin'), ('ETH', 'eth_usdt', 'Ethereum'), ('NVDA', 'nvdab_usdt', 'NVIDIA'),
        ('SOL', 'sol_usdt', 'Solana'), ('TSLA', 'tslab_usdt', 'Tesla'), ('AAPL', 'aaplb_usdt', 'Apple')]
UP, DOWN, LIME, INK = '#2DBD85', '#F6465D', '#B8F26A', '#07090A'


def tickers():
    cache = ROOT / 'assets' / 'tickers.json'
    try:
        req = urllib.request.Request('https://api.hotcoinfin.com/v1/market/ticker', headers={'User-Agent': 'Mozilla/5.0'})
        t = json.load(urllib.request.urlopen(req, timeout=20))['ticker']
        d = {x['symbol']: {'last': x['last'], 'change': x['change']} for x in t}
        cache.write_text(json.dumps(d))
        return d
    except Exception:
        return json.loads(cache.read_text()) if cache.exists() else {}


def fmt(v):
    v = float(v)
    return f'{v:,.2f}' if v >= 1 else f'{v:.4f}'


CSS = """
.cta{background:radial-gradient(ellipse 90% 80% at 70% 62%,#E9FCD0 0%,#C6F28C 36%,#8FD84E 72%,#5BAA2E 100%);color:#07090A}
.cta .ring{position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,.55)}
.cta .gr{position:absolute;inset:0;background:url(GRAIN);background-size:320px;mix-blend-mode:overlay;opacity:.10}
.cta .top{position:absolute;left:66px;top:74px;display:flex;align-items:center;gap:14px;font-size:24px;font-weight:600;letter-spacing:.14em}
.cta .top img{width:44px;height:44px;background:#07090A;border-radius:12px;padding:8px}
.cta .h1{position:absolute;left:62px;top:150px;font-family:'Inter Display';font-weight:800;font-size:104px;line-height:.93;letter-spacing:-.045em}
.cta .h1 span{background:#07090A;color:#B8F26A;padding:0 16px;border-radius:14px;display:inline-block;margin-top:8px}
.cta .sub{position:absolute;left:66px;top:410px;width:470px;font-size:33px;line-height:1.35;font-weight:500;color:#1b2a10}
.cta .chip{position:absolute;left:62px;width:400px;background:rgba(255,255,255,.72);backdrop-filter:blur(10px);border-radius:26px;padding:22px 24px;display:flex;gap:18px;align-items:center;box-shadow:0 18px 40px rgba(30,60,10,.18)}
.cta .chip .ic{width:58px;height:58px;border-radius:16px;background:#07090A;color:#B8F26A;display:flex;align-items:center;justify-content:center;font-size:30px;flex:none}
.cta .chip b{display:block;font-size:27px;letter-spacing:-.01em}
.cta .chip i{font-style:normal;font-size:21px;color:#43503a}
.cta .btn{position:absolute;left:62px;bottom:72px;height:104px;padding:0 44px 0 40px;border-radius:60px;background:#07090A;color:#fff;display:flex;align-items:center;gap:22px;font-size:36px;font-weight:700;letter-spacing:-.01em;box-shadow:0 20px 50px rgba(0,0,0,.28)}
.cta .btn em{font-style:normal;background:#B8F26A;color:#07090A;border-radius:40px;padding:12px 22px;font-size:27px}
.phone{position:absolute;left:556px;top:500px;width:500px;height:1082px;border-radius:78px;padding:16px;background:linear-gradient(135deg,#8B8E93 0%,#3B3D41 18%,#1C1D20 50%,#4A4C50 82%,#9EA1A6 100%);transform:rotate(5deg);box-shadow:0 60px 90px rgba(20,40,10,.38)}
.phone .scr{position:relative;width:100%;height:100%;border-radius:64px;overflow:hidden;background:#0B0B0C;color:#F5F7F2}
.phone .isl{position:absolute;left:50%;top:16px;width:136px;height:40px;margin-left:-68px;border-radius:20px;background:#000;z-index:3}
.phone .st{position:absolute;left:38px;top:22px;font-size:20px;font-weight:600}
.app{position:absolute;left:0;right:0;top:74px;padding:0 22px}
.app .hd{display:flex;align-items:center;height:46px}.app .hd img{height:24px}
.app .hd .av{margin-left:auto;width:30px;height:30px;border-radius:50%;border:2.5px solid #F5F7F2;opacity:.85}
.app .bonus{margin-top:16px;border-radius:20px;padding:18px 18px;background:linear-gradient(110deg,#B8F26A,#7EC25A);color:#07090A}
.app .bonus b{font-size:22px;display:block}.app .bonus span{font-size:15px}
.app .bonus .go{display:inline-block;margin-top:10px;background:#07090A;color:#B8F26A;border-radius:20px;padding:7px 14px;font-size:14px;font-weight:700}
.app .acts{display:flex;justify-content:space-between;margin-top:18px}
.app .acts div{width:84px;text-align:center;font-size:14px;color:#D7D9DD}
.app .acts div i{display:block;width:56px;height:56px;margin:0 auto 7px;border-radius:18px;background:#151618;border:1px solid #26272B}
.app .acts div.on i{background:#B8F26A}
.app .tabs{display:flex;gap:24px;margin-top:20px;font-size:18px;font-weight:600;color:#8E9199}.app .tabs .on{color:#F5F7F2;border-bottom:3px solid #7EC25A;padding-bottom:6px}
.app .row{display:flex;align-items:center;height:70px;font-variant-numeric:tabular-nums}
.app .row img{width:38px;height:38px;border-radius:50%;background:#fff;margin-right:12px;object-fit:contain}
.app .row .nm b{font-size:18px}.app .row .nm b small{color:#8E9199;font-weight:500;font-size:13px}
.app .row .nm div{font-size:13px;color:#8E9199;margin-top:2px}
.app .row .px{margin-left:auto;margin-right:12px;font-size:17px;font-weight:700}
.app .row .ch{width:88px;height:36px;border-radius:8px;text-align:center;line-height:36px;font-size:15px;font-weight:700;color:#fff}
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


def logo_uri(g, sym):
    for ext in ('svg', 'png'):
        p = ROOT / 'assets' / 'logos' / f'{sym}.{ext}'
        if p.exists():
            return g['uri'](str(p), ROOT)
    return ''


def s_end(g):
    def render(s, base):
        t = tickers()
        rows = ''
        for sym, key, name in ROWS:
            x = t.get(key)
            if not x:
                continue
            ch = float(x['change'])
            rows += (f'<div class="row"><img src="{logo_uri(g, sym)}"><div class="nm"><b>{sym}<small>/USDT</small></b><div>{name}</div></div>'
                     f'<div class="px">{fmt(x["last"])}</div><div class="ch" style="background:{UP if ch >= 0 else DOWN}">{"+" if ch >= 0 else ""}{ch:.2f}%</div></div>')
        rings = ''.join(f'<div class="ring" style="left:{800-r}px;top:{900-r}px;width:{2*r}px;height:{2*r}px;opacity:{.6-i*.08}"></div>' for i, r in enumerate(range(300, 1100, 160)))
        logo_w = g['uri'](str(ROOT / 'assets' / 'logo-official-white.png'), ROOT)
        chips = [('₿', 'Crypto + US stocks', 'BTC, ETH, NVDA &amp; more'), ('$', 'One USDT account', 'for every market'), ('⚡', 'Trade anywhere', 'app &amp; web, 24/7')]
        chip_html = ''.join(f'<div class="chip" style="top:{590 + i*138}px"><div class="ic">{a}</div><div><b>{b}</b><i>{c}</i></div></div>' for i, (a, b, c) in enumerate(chips))
        return f'''<div class="slide cta">{rings}<div class="gr"></div>
<div class="top"><img src="{g['SYM']}">HOTCOIN EXCHANGE</div>
<div class="h1">Claim your<br><span>welcome bonus</span></div>
<div class="sub" style="top:395px">Register on Hotcoin and trade crypto &amp; stocks in one app.</div>
{chip_html}
<div class="phone"><div class="scr"><div class="isl"></div><div class="st">9:41</div>
<div class="app"><div class="hd"><img src="{logo_w}"><div class="av"></div></div>
<div class="bonus"><b>🎁 Welcome bonus</b><span>New users: register to claim yours</span><br><span class="go">Claim now →</span></div>
<div class="acts"><div><i></i>Deposit</div><div class="on"><i></i>Trade</div><div><i></i>TradFi</div><div><i></i>Earn</div></div>
<div class="tabs"><span class="on">Hot</span><span>Crypto</span><span>Stocks</span><span>Gainers</span></div>{rows}</div></div></div>
<div class="btn">Register now <em>Link in bio ↗</em></div></div>'''
    return render


STORY_JS = None


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
    page.screenshot(path=str(out_path), type='jpeg', quality=92)
    page.set_viewport_size({'width': 1080, 'height': 1350})
