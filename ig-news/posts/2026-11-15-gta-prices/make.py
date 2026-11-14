# GTA V (Sep 17, 2013) vs the week before GTA VI (Nov 19, 2026). Visual-first 2x2 grid (owner, Nov 14:
# "visual first, text numbers later", format like the GTA/BTC grid posts going round IG).
# Sources: BTC Sep 17 2013 close $131.66 (CoinMarketCap historical); BTC ~$66,675 (Yahoo BTC-USD, Nov 14 2026);
# stocks: Yahoo Finance split-adjusted closes Sep 17 2013 vs Nov 13 2026. GTA VI date: TechRadar, Tom's Guide.
# No Rockstar logos or key art (copyright): LA sunset = GTA V era, Miami sunset = GTA VI era, photos from Unsplash.
import base64, pathlib
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).parent
ROOT = HERE.parents[1]
OUT = ROOT / 'media' / HERE.name
OUT.mkdir(parents=True, exist_ok=True)
for old in OUT.glob('*.jpg'):
    old.unlink()
f64 = lambda p: base64.b64encode(p.read_bytes()).decode()
ARCH, MAN = f64(ROOT / 'assets/fonts/Archivo.ttf'), f64(ROOT / 'assets/fonts/Manrope.ttf')
SYM = f64(ROOT / 'assets/symbol.svg')
img = lambda n: f'data:image/jpeg;base64,{f64(HERE / n)}'

# (label, photo then, photo now, price then, price now, multiple)
ASSETS = [
    ('1 Bitcoin', 'btc1.jpg', 'btc2.jpg', '$132', '$66,675', '506x'),
    ('1 Nvidia share', 'nv1.jpg', 'nv2.jpg', '$0.40', '$162.85', '411x'),
    ('1 Tesla share', 'ts1.jpg', 'ts2.jpg', '$11.08', '$390.22', '35x'),
    ('1 Apple share', 'ap1.jpg', 'ap2.jpg', '$16.26', '$356.27', '22x'),
    ('1 Take-Two share', 'tt1.jpg', 'tt2.jpg', '$17.00', '$227.82', '13x'),
]
LA, MIA = img('la.jpg'), img('mia.jpg')

CSS = f"""
@font-face{{font-family:'Archivo';src:url(data:font/ttf;base64,{ARCH}) format('truetype');font-weight:100 900;font-stretch:62% 125%}}
@font-face{{font-family:'Manrope';src:url(data:font/ttf;base64,{MAN}) format('truetype');font-weight:200 800}}
*{{box-sizing:border-box;margin:0}}
body{{width:1080px;height:1350px;background:#0B0E11;font-family:'Manrope';position:relative;overflow:hidden}}
.g{{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:4px}}
.c{{position:relative;background-size:cover;background-position:center;overflow:hidden}}
.c:after{{content:'';position:absolute;inset:0}}
.left:after{{background:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.35))}}
.right{{filter:saturate(1.05)}} .right:after{{background:rgba(5,8,10,.48)}}
.t{{position:absolute;left:0;right:0;z-index:2;text-align:center;color:#fff}}
.game{{top:50%;transform:translateY(-55%);font-family:'Archivo';font-weight:900;font-stretch:125%;font-size:112px;white-space:nowrap;letter-spacing:-.04em;line-height:.9;text-shadow:0 6px 30px rgba(0,0,0,.45)}}
.game small{{display:block;font-size:34px;font-weight:800;letter-spacing:.06em;margin-top:18px;font-stretch:112%}}
.lab{{top:41%;font-family:'Archivo';font-weight:900;font-stretch:108%;font-size:52px;letter-spacing:-.02em}}
.lab span{{background:#7EC25A;color:#0B0E11;padding:2px 14px;border-radius:6px}}
.px{{top:54%;font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:60px;letter-spacing:-.02em;text-shadow:0 4px 20px rgba(0,0,0,.6)}}
.brand{{position:absolute;left:30px;top:28px;z-index:5;display:flex;align-items:center;gap:10px;font-family:'Archivo';font-weight:800;font-stretch:110%;font-size:28px;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.5)}}
.brand img{{width:36px;height:36px}}
.count{{position:absolute;right:28px;top:26px;z-index:5;background:rgba(0,0,0,.55);color:#fff;font-weight:700;font-size:24px;padding:8px 16px;border-radius:999px}}
.mult{{position:absolute;right:28px;bottom:28px;z-index:5;background:#7EC25A;color:#0B0E11;font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:46px;padding:10px 24px;border-radius:999px;box-shadow:0 8px 30px rgba(0,0,0,.4)}}
.end{{position:absolute;inset:0;background-size:cover;background-position:center}}
.end:after{{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,8,10,.55),rgba(5,8,10,.85))}}
.end .in{{position:absolute;inset:0;z-index:2;padding:150px 80px 0;color:#fff}}
.end h1{{font-family:'Archivo';font-weight:900;font-stretch:115%;font-size:92px;line-height:.98;letter-spacing:-.03em}}
.end h1 span{{color:#7EC25A}}
.end table{{width:100%;margin-top:60px;border-collapse:collapse;font-size:42px;font-weight:600}}
.end td{{padding:22px 0;border-bottom:2px solid rgba(255,255,255,.25);color:#fff}}
.end td.n{{text-align:right;font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:52px;color:#7EC25A}}
.end .q{{position:absolute;left:80px;right:80px;bottom:90px;font-size:40px;font-weight:700}}
"""
BRAND = f'<div class="brand"><img src="data:image/svg+xml;base64,{SYM}">Hotcoin</div>'
TOTAL = len(ASSETS) + 1

def page(inner, n):
    return f'<html><head><style>{CSS}</style></head><body>{inner}{BRAND}<div class="count">{n}/{TOTAL}</div></body></html>'

slides = []
for k, (lab, p1, p2, then, now, mult) in enumerate(ASSETS, 1):
    slides.append(page(f"""<div class="g">
<div class="c left" style="background-image:url({LA})"><div class="t game">GTA V<small>SEP 2013</small></div></div>
<div class="c right" style="background-image:url({img(p1)})"><div class="t lab"><span>{lab}</span></div><div class="t px">= {then}</div></div>
<div class="c left" style="background-image:url({MIA})"><div class="t game">GTA VI<small>NOV 2026</small></div></div>
<div class="c right" style="background-image:url({img(p2)})"><div class="t lab"><span>{lab}</span></div><div class="t px">= {now}</div></div>
</div><div class="mult">{mult}</div>""", k))
rows = ''.join(f'<tr><td>{a[0][2:].replace(" share", "")}</td><td class="n">{a[5]}</td></tr>' for a in ASSETS)
slides.append(page(f"""<div class="end" style="background-image:url({MIA})"><div class="in">
<h1>Between two GTAs: <span>13 years</span></h1><table>{rows}<tr><td>S&amp;P 500</td><td class="n" style="color:#fff">4.4x</td></tr></table>
<div class="q">Which would you have bought in 2013?</div></div></div>""", TOTAL))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    pg = b.new_page(viewport={'width': 1080, 'height': 1350}, device_scale_factor=2)
    for k, html in enumerate(slides, 1):
        pg.set_content(html); pg.wait_for_timeout(400)
        pg.screenshot(path=str(OUT / f'{k:02d}.jpg'), type='jpeg', quality=90)
    b.close()
print(OUT)
