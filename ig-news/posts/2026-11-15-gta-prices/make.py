# GTA V (Sep 17, 2013) vs the week before GTA VI (Nov 19, 2026): one asset per slide.
# Sources: BTC Sep 17 2013 close $131.66 (CoinMarketCap historical); BTC now ~$66,675 (Yahoo BTC-USD, Nov 14 2026);
# stocks: Yahoo Finance split-adjusted closes Sep 17 2013 vs Nov 13 2026.
# GTA VI date Nov 19, 2026: Rockstar (via TechRadar, Tom's Guide). No game logos or art (copyright): text only.
import base64, pathlib
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).parent
ROOT = HERE.parents[1]
OUT = ROOT / 'media' / HERE.name
OUT.mkdir(parents=True, exist_ok=True)
f64 = lambda p: base64.b64encode(p.read_bytes()).decode()
ARCH, MAN = f64(ROOT / 'assets/fonts/Archivo.ttf'), f64(ROOT / 'assets/fonts/Manrope.ttf')
SYM = f64(ROOT / 'assets/symbol-dark.svg')

def img(name):
    p = HERE / name
    mime = 'image/svg+xml' if name.endswith('.svg') else 'image/png'
    return f'data:{mime};base64,{f64(p)}'

ASSETS = [
    ('1 Bitcoin', 'BTC.svg', '$132', '$66,675', '506x'),
    ('1 Nvidia share', 'NVDA.png', '$0.40', '$162.85', '411x'),
    ('1 Tesla share', 'TSLA.png', '$11.08', '$390.22', '35x'),
    ('1 Apple share', 'AAPL.png', '$16.26', '$356.27', '22x'),
    ('1 Take-Two share', 'TTWO.png', '$17.00', '$227.82', '13x'),
]

CSS = f"""
@font-face{{font-family:'Archivo';src:url(data:font/ttf;base64,{ARCH}) format('truetype');font-weight:100 900;font-stretch:62% 125%}}
@font-face{{font-family:'Manrope';src:url(data:font/ttf;base64,{MAN}) format('truetype');font-weight:200 800}}
*{{box-sizing:border-box;margin:0}}
body{{width:1080px;height:1350px;background:#F3F2EC;color:#0E1012;font-family:'Manrope';position:relative;overflow:hidden}}
.brand{{position:absolute;left:64px;top:56px;display:flex;align-items:center;gap:12px;font-family:'Archivo';font-weight:800;font-stretch:110%;font-size:30px}}
.brand img{{width:40px;height:40px}}
.count{{position:absolute;right:64px;top:62px;font-weight:700;font-size:24px;color:#8A8F93}}
.half{{position:absolute;left:64px;right:64px;border-radius:36px;padding:44px 52px;display:flex;flex-direction:column;justify-content:center}}
.top{{top:150px;height:520px;background:#FFFFFF;box-shadow:0 10px 30px rgba(0,0,0,.06)}}
.bot{{top:700px;height:540px;background:#0E1012;color:#fff}}
.k{{font-family:'Archivo';font-weight:800;font-stretch:112%;font-size:30px;letter-spacing:.04em;text-transform:uppercase}}
.top .k{{color:#8A8F93}} .bot .k{{color:#7EC25A}}
.d{{font-size:24px;font-weight:600;margin-top:6px}} .top .d{{color:#8A8F93}} .bot .d{{color:#9AA3AB}}
.row{{display:flex;align-items:center;gap:26px;margin-top:40px}}
.logo{{width:104px;height:104px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;flex:none;border:2px solid #E7E5DE}}
.logo img{{width:76%;height:76%;object-fit:contain}}
.what{{font-size:30px;font-weight:700}} .top .what{{color:#3B4045}}
.price{{font-family:'Archivo';font-weight:900;font-stretch:112%;letter-spacing:-.03em;line-height:1}}
.top .price{{font-size:132px;color:#0E1012}} .bot .price{{font-size:150px;color:#fff}}
.pill{{position:absolute;right:44px;top:44px;background:#7EC25A;color:#0E1012;font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:44px;padding:12px 26px;border-radius:999px}}
.cover h1{{position:absolute;left:64px;right:64px;top:190px;font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:118px;line-height:.98;letter-spacing:-.035em}}
.cover h1 span{{color:#2F7D1E}}
.cover .sub{{position:absolute;left:64px;right:64px;top:640px;font-size:38px;line-height:1.4;color:#3B4045;font-weight:500}}
.tl{{position:absolute;left:64px;right:64px;top:870px;height:300px}}
.tl .bar{{position:absolute;left:0;right:0;top:120px;height:8px;background:#0E1012;border-radius:8px}}
.tl .dot{{position:absolute;top:96px;width:56px;height:56px;border-radius:50%;background:#0E1012;border:8px solid #F3F2EC;box-shadow:0 0 0 3px #0E1012}}
.tl .dot.g{{background:#7EC25A;box-shadow:0 0 0 3px #2F7D1E}}
.tl .lab{{position:absolute;top:0;font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:64px;letter-spacing:-.02em}}
.tl .date{{position:absolute;top:176px;font-size:30px;font-weight:700;color:#3B4045}}
.tl .mid{{position:absolute;left:50%;transform:translateX(-50%);top:150px;font-size:28px;font-weight:700;color:#8A8F93}}
.swipe{{position:absolute;right:64px;bottom:56px;font-size:26px;font-weight:700;color:#3B4045}}
.end h1{{position:absolute;left:64px;right:64px;top:180px;font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:92px;line-height:1;letter-spacing:-.03em}}
.end table{{position:absolute;left:64px;width:952px;top:430px;border-collapse:collapse;font-size:38px}}
.end td{{padding:24px 8px;border-bottom:2px solid #DEDCD4}} .end td.n{{text-align:right;font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:46px}}
.end td.n.g{{color:#2F7D1E}} .end .q{{position:absolute;left:64px;right:64px;bottom:120px;font-size:40px;font-weight:700}}
"""
BRAND = f'<div class="brand"><img src="data:image/svg+xml;base64,{SYM}">Hotcoin</div>'

def page(body, n, total, cls=''):
    return f'<html><head><style>{CSS}</style></head><body class="{cls}">{BRAND}<div class="count">{n}/{total}</div>{body}</body></html>'

slides = []
total = len(ASSETS) + 2
slides.append(page("""<h1>GTA V to GTA VI: <span>13 years</span> of prices</h1>
<div class="sub">What 1 Bitcoin and 1 share of Nvidia, Tesla, Apple and Take-Two cost then, and what they cost now.</div>
<div class="tl"><div class="bar"></div>
<div class="lab" style="left:0">GTA V</div><div class="dot" style="left:0"></div><div class="date" style="left:0">Sep 17, 2013</div>
<div class="mid">13 years</div>
<div class="lab" style="right:0">GTA VI</div><div class="dot g" style="right:0"></div><div class="date" style="right:0">Nov 19, 2026</div></div>
<div class="swipe">Swipe →</div>""", 1, total, 'cover'))
for i, (what, logo, then, now, mult) in enumerate(ASSETS, 2):
    slides.append(page(f"""<div class="half top"><div class="k">When GTA V came out</div><div class="d">Sep 17, 2013</div>
<div class="row"><div class="logo"><img src="{img(logo)}"></div><div><div class="what">{what}</div><div class="price">{then}</div></div></div></div>
<div class="half bot"><div class="pill">{mult}</div><div class="k">Days before GTA VI</div><div class="d">Nov 13, 2026</div>
<div class="row"><div class="logo"><img src="{img(logo)}"></div><div><div class="what">{what}</div><div class="price">{now}</div></div></div></div>""", i, total))
rows = ''.join(f'<tr><td>{w.replace("1 ", "").replace(" share", "")}</td><td class="n g">{m}</td></tr>' for w, _, _, _, m in ASSETS)
slides.append(page(f"""<h1>Between two GTAs</h1><table>{rows}<tr><td>S&amp;P 500</td><td class="n">4.4x</td></tr></table>
<div class="q">Which would you have bought in 2013? 👇</div>""", total, total, 'end'))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    pg = b.new_page(viewport={'width': 1080, 'height': 1350}, device_scale_factor=2)
    for k, html in enumerate(slides, 1):
        pg.set_content(html); pg.wait_for_timeout(300)
        pg.screenshot(path=str(OUT / f'{k:02d}.jpg'), type='jpeg', quality=92)
    b.close()
print(OUT)
