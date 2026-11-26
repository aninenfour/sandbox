"""WHAT IF redesign: 3 static directions (A editorial, B dark premium, C bold poster).

python3 ig-news/research/2026-W48/whatif_redesign/build.py
-> {A,B,C}_{1,2,3}.html + .png (1080x1920) + options.jpg (3x3 overview).
Story data: posts/2026-11-25-whatif-bezos-wapo-btc/whatif.json (series = $M value of the $250M in BTC).
Safe zone used: content in y 220..1480, x 60..920 below y=700.
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]  # ig-news/
SPEC = json.loads((ROOT / 'posts/2026-11-25-whatif-bezos-wapo-btc/whatif.json').read_text())
A = '../../../assets'

S = {  # story copy, one place so the template can take any WHAT IF spec later
    'paid': '$250M', 'now': '$115B', 'mult': '461x', 'year': '2013', 'month': 'Oct 2013',
    'thing': 'newspaper', 'who': 'Jeff Bezos', 'asset': 'Bitcoin', 'tick': 'BTC',
    'note': 'BTC daily closes, Oct 1 2013 to Nov 25 2026. Price only. Not financial advice.',
}


def series(step=2):
    pts = SPEC['series'][::step]
    if pts[-1] != SPEC['series'][-1]:
        pts.append(SPEC['series'][-1])
    return [p[1] for p in pts]


def chart_path(w, h, step=2, pad_top=0):
    v = series(step)
    mx = max(v)
    n = len(v) - 1
    xy = [(i / n * w, pad_top + (h - pad_top) * (1 - x / mx)) for i, x in enumerate(v)]
    line = 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in xy)
    area = line + f' L{w},{h} L0,{h} Z'
    return line, area, xy[-1], mx


FONTS = f'''
@font-face{{font-family:'Serif';src:url(fonts/InstrumentSerif-Regular.ttf)}}
@font-face{{font-family:'Serif';font-style:italic;src:url(fonts/InstrumentSerif-Italic.ttf)}}
@font-face{{font-family:'Archivo';src:url({A}/fonts/Archivo.ttf);font-weight:100 900;font-stretch:62% 125%}}
@font-face{{font-family:'Manrope';src:url({A}/fonts/Manrope.ttf);font-weight:200 800}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1920px;overflow:hidden}}
.f{{position:relative;width:1080px;height:1920px;overflow:hidden}}
.abs{{position:absolute}}
'''


def page(css, body):
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{FONTS}{css}</style></head><body><div class="f">{body}</div></body></html>'


# ---------------------------------------------------------------- A: Editorial clean
A_CSS = '''
body{background:#F3EFE6;color:#121212;font-family:'Inter',sans-serif}
.kick{position:absolute;left:72px;right:72px;top:236px;display:flex;justify-content:space-between;align-items:center;
  font:600 26px 'Inter';letter-spacing:.24em;text-transform:uppercase;padding-bottom:22px;border-bottom:2px solid #121212}
.kick b{display:flex;align-items:center;gap:14px}.kick b i{width:14px;height:14px;border-radius:50%;background:#7EC25A}
.serif{font-family:'Serif';font-weight:400;letter-spacing:-.02em}
.it{font-style:italic;color:#3E8E26}
.rule{position:absolute;left:72px;right:72px;height:2px;background:#121212}
.cap{position:absolute;left:72px;font:500 24px 'Inter';letter-spacing:.06em;color:#6b665c}
'''


def a1():
    return page(A_CSS, f'''
<div class="kick"><b><i></i>What if</b><span>{S["month"]}</span></div>
<div class="abs serif" style="left:72px;top:312px;font-size:150px;line-height:.92">{S["paid"]}<br>for a {S["thing"]}.</div>
<div class="abs serif it" style="left:72px;top:590px;font-size:96px;line-height:1">Or Bitcoin?</div>
<img class="abs" src="bezos_cut.png" style="left:-10px;bottom:{1920-1412}px;width:1000px">
<div class="rule" style="top:1410px;left:0;right:0"></div>
<div class="cap" style="top:1430px">JEFF BEZOS BOUGHT THE WASHINGTON POST</div>
''')


def a2():
    w, h = 848, 330
    line, area, (ex, ey), mx = chart_path(w, h, 2, 10)
    return page(A_CSS, f'''
<div class="kick"><b><i></i>Same {S["paid"]} in Bitcoin</b><span>Today</span></div>
<div class="abs serif" style="left:60px;top:330px;font-size:380px;line-height:1;letter-spacing:-.015em">{S["now"]}</div>
<div class="abs" style="left:72px;top:735px;display:flex;align-items:baseline;gap:26px">
  <span class="serif it" style="font-size:150px;line-height:1">{S["mult"]}</span>
  <span style="font:500 36px 'Inter';line-height:1.25;color:#3a3833">what Bezos<br>paid for the Post</span></div>
<div class="rule" style="top:960px;height:1px;background:#bdb6a8"></div>
<svg class="abs" style="left:72px;top:1040px;overflow:visible" width="{w}" height="{h + 70}" viewBox="0 0 {w} {h + 70}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC25A" stop-opacity=".35"/><stop offset="1" stop-color="#7EC25A" stop-opacity="0"/></linearGradient></defs>
  <path d="{area}" fill="url(#g)"/>
  <path d="{line}" fill="none" stroke="#121212" stroke-width="3" stroke-linejoin="round"/>
  <line x1="0" y1="{h}" x2="{w}" y2="{h}" stroke="#121212" stroke-width="2"/>
  <circle cx="{ex:.1f}" cy="{ey:.1f}" r="11" fill="#3E8E26"/>
  <text x="0" y="{h + 50}" font-family="Inter" font-weight="600" font-size="26" fill="#6b665c" letter-spacing="2">2013</text>
  <text x="{w}" y="{h + 50}" text-anchor="end" font-family="Inter" font-weight="600" font-size="26" fill="#6b665c" letter-spacing="2">2026</text>
</svg>
<div class="cap" style="top:1440px;font-size:20px;letter-spacing:.02em">{S["note"]}</div>
''')


def a3():
    return page(A_CSS, f'''
<div class="kick" style="border-bottom:0"><img src="logo-dark.png" style="height:48px"><span>@hotcoinex</span></div>
<div class="rule" style="top:316px"></div>
<div class="abs serif" style="left:72px;top:470px;font-size:76px;line-height:1;color:#6b665c" >Your turn.</div>
<div class="abs serif" style="left:72px;top:580px;font-size:168px;line-height:.92">Trade<br><span class="it">Bitcoin</span><br>on Hotcoin.</div>
<div class="abs" style="left:72px;top:1130px;display:flex;align-items:center;gap:28px;background:#121212;color:#fff;border-radius:999px;padding:38px 56px 38px 64px;font:600 46px 'Inter'">
  Download Hotcoin <span style="display:inline-grid;place-items:center;width:64px;height:64px;border-radius:50%;background:#7EC25A;color:#121212;font-size:38px">&#8594;</span></div>
<div class="abs" style="left:76px;top:1310px;font:500 32px 'Inter';color:#3a3833">Link in bio</div>
<div class="rule" style="top:1404px;height:1px;background:#bdb6a8"></div>
<div class="cap" style="top:1424px;font-size:20px;letter-spacing:.02em">Crypto is volatile. Price only. Not financial advice.</div>
''')


# ---------------------------------------------------------------- B: Dark premium
B_CSS = '''
body{background:#060807;color:#fff;font-family:'Inter Display','Inter',sans-serif}
.glow{position:absolute;border-radius:50%;filter:blur(90px)}
.pill{position:absolute;display:inline-flex;align-items:center;gap:14px;padding:16px 28px;border-radius:999px;
  background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);font:600 26px 'Inter';letter-spacing:.2em;text-transform:uppercase;color:#d9e2d6}
.pill i{width:12px;height:12px;border-radius:50%;background:#7EC25A;box-shadow:0 0 16px #7EC25A}
.glass{position:absolute;border-radius:48px;background:linear-gradient(160deg,rgba(255,255,255,.10),rgba(255,255,255,.025));
  border:1px solid rgba(255,255,255,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 40px 120px rgba(0,0,0,.6);backdrop-filter:blur(30px)}
.grad{background:linear-gradient(180deg,#fff 30%,#b9c4b5);-webkit-background-clip:text;color:transparent}
.mute{color:#8b958a}
.noise{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 120%,rgba(126,194,90,.10),transparent 60%)}
'''


def b1():
    return page(B_CSS, f'''
<div class="glow" style="left:220px;top:300px;width:700px;height:700px;background:rgba(126,194,90,.28)"></div>
<div class="pill" style="left:72px;top:240px"><i></i>What if</div>
<img class="abs" src="bezos_cut.png" style="left:-30px;top:330px;width:1110px;
  -webkit-mask-image:linear-gradient(180deg,#000 62%,transparent 98%);filter:contrast(1.05) saturate(.9)">
<div class="abs" style="left:72px;top:1080px;font:700 108px/1 'Inter Display';letter-spacing:-.035em">
  <span class="grad">{S["paid"]}</span><br><span class="grad">on a {S["thing"]}.</span></div>
<div class="abs" style="left:72px;top:1320px;font:600 64px/1 'Inter Display';letter-spacing:-.02em;color:#7EC25A">What if it was Bitcoin?</div>
''')


def b2():
    w, h = 760, 360
    line, area, (ex, ey), mx = chart_path(w, h, 2, 20)
    return page(B_CSS, f'''
<div class="noise"></div>
<div class="glow" style="left:140px;top:520px;width:800px;height:700px;background:rgba(126,194,90,.22)"></div>
<div class="pill" style="left:72px;top:240px"><i></i>Same {S["paid"]}, in Bitcoin</div>
<div class="glass" style="left:60px;top:360px;width:860px;height:1060px"></div>
<div class="abs" style="left:110px;top:412px;display:flex;align-items:center;gap:20px;font:600 34px 'Inter';color:#e8ede6">
  <img src="{A}/logos/BTC.svg" style="width:64px">Bitcoin<span class="mute" style="font-weight:500">&nbsp;since {S["month"]}</span></div>
<div class="abs mute" style="left:110px;top:560px;font:600 28px 'Inter';letter-spacing:.18em">WORTH TODAY</div>
<div class="abs grad" style="left:102px;top:600px;font:800 250px/1 'Inter Display';letter-spacing:-.05em">{S["now"]}</div>
<div class="abs" style="left:110px;top:880px;display:flex;gap:18px;align-items:center">
  <span style="padding:14px 26px;border-radius:999px;background:#7EC25A;color:#06140a;font:800 40px 'Inter Display'">&#9650; {S["mult"]}</span>
  <span class="mute" style="font:500 32px 'Inter'">vs {S["paid"]} paid</span></div>
<svg class="abs" style="left:110px;top:1000px;overflow:visible" width="{w}" height="{h + 20}" viewBox="0 0 {w} {h + 20}">
  <defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC25A" stop-opacity=".45"/><stop offset="1" stop-color="#7EC25A" stop-opacity="0"/></linearGradient>
  <filter id="gl" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="7"/></filter></defs>
  {''.join(f'<line x1="0" x2="{w}" y1="{y}" y2="{y}" stroke="rgba(255,255,255,.07)" stroke-width="2"/>' for y in (100, 200, 300))}
  <path d="{area}" fill="url(#a)"/>
  <path d="{line}" fill="none" stroke="#7EC25A" stroke-width="8" filter="url(#gl)" opacity=".8"/>
  <path d="{line}" fill="none" stroke="#c9f2b0" stroke-width="3.5" stroke-linejoin="round"/>
  <circle cx="{ex - 2:.1f}" cy="{ey:.1f}" r="22" fill="#7EC25A" opacity=".3"/><circle cx="{ex - 2:.1f}" cy="{ey:.1f}" r="10" fill="#fff"/>
</svg>
<div class="abs mute" style="left:110px;top:1376px;width:760px;display:flex;justify-content:space-between;font:600 24px 'Inter';letter-spacing:.12em"><span>2013</span><span>2026</span></div>
<div class="abs mute" style="left:72px;top:1452px;font:500 20px 'Inter';color:#5d665c">{S["note"]}</div>
''')


def b3():
    rings = ''.join(f'<div class="abs" style="left:{490 - r}px;top:{640 - r}px;width:{2 * r}px;height:{2 * r}px;border-radius:50%;'
                    f'border:1px solid rgba(126,194,90,{.32 - i * .06})"></div>' for i, r in enumerate((190, 280, 380, 490)))
    return page(B_CSS, f'''
<div class="glow" style="left:190px;top:340px;width:600px;height:600px;background:rgba(126,194,90,.30)"></div>
{rings}
<div class="glass" style="left:370px;top:520px;width:240px;height:240px;border-radius:64px;display:grid;place-items:center">
  <img src="{A}/symbol.svg" style="width:128px"></div>
<div class="abs" style="left:72px;right:160px;top:980px;text-align:center;font:700 96px/1.02 'Inter Display';letter-spacing:-.035em">
  <span class="grad">Trade Bitcoin</span><br><span style="color:#7EC25A">on Hotcoin</span></div>
<div class="abs" style="left:150px;width:680px;top:1236px;height:124px;border-radius:999px;background:linear-gradient(180deg,#9ad677,#6fb24c);
  box-shadow:0 0 0 1px rgba(255,255,255,.25) inset,0 20px 60px rgba(126,194,90,.45);display:flex;align-items:center;justify-content:center;gap:22px;
  font:700 44px 'Inter Display';color:#06140a">Download Hotcoin <span style="font-size:40px">&#8594;</span></div>
<div class="abs mute" style="left:72px;right:160px;top:1394px;text-align:center;font:500 30px 'Inter'">Link in bio &nbsp;&middot;&nbsp; @hotcoinex</div>
<img class="abs" src="{A}/logo-official-white.png" style="left:72px;top:240px;height:46px;opacity:.9">
''')


# ---------------------------------------------------------------- C: Bold poster / split
C_CSS = '''
body{background:#0E1012;color:#0E1012;font-family:'Archivo',sans-serif}
.k{font-family:'Archivo';font-weight:900;font-stretch:125%;letter-spacing:-.02em;text-transform:uppercase}
.tag{position:absolute;font:800 28px 'Archivo';font-stretch:110%;letter-spacing:.16em;text-transform:uppercase}
.stamp{position:absolute;border-radius:50%;display:grid;place-items:center;text-align:center;transform:rotate(-12deg)}
'''
GREEN = '#7EC25A'


def c1():
    return page(C_CSS, f'''
<div class="abs" style="left:0;top:0;width:1080px;height:1010px;background:{GREEN}"></div>
<div class="tag" style="left:72px;top:244px">What if &middot; {S["year"]}</div>
<img class="abs" src="bezos_cut.png" style="left:-30px;bottom:{1920 - 1010}px;width:1040px">
<div class="abs k" style="left:66px;top:1050px;font-size:200px;line-height:.9;color:#F3EFE6;font-stretch:118%">{S["paid"]}</div>
<div class="abs k" style="left:72px;top:1252px;font-size:84px;line-height:1;color:#F3EFE6;font-stretch:100%">Newspaper</div>
<div class="abs k" style="left:72px;top:1342px;font-size:84px;line-height:1;color:{GREEN};font-stretch:100%">or Bitcoin?</div>
''')


def c2():
    big = 600
    small = round(big / 461 ** .5)  # area ratio = 461x, squares to scale
    return page(C_CSS, f'''
<div class="abs" style="left:0;top:0;width:1080px;height:720px;background:#F3EFE6"></div>
<div class="tag" style="left:72px;top:244px">Then &middot; {S["month"]}</div>
<div class="abs k" style="left:66px;top:300px;font-size:190px;line-height:1;font-stretch:118%">{S["paid"]}</div>
<div class="abs" style="left:72px;top:530px;display:flex;align-items:center;gap:20px;font:800 34px 'Archivo';text-transform:uppercase;letter-spacing:.04em">
  <span style="width:{small}px;height:{small}px;background:#0E1012;display:inline-block"></span>for a newspaper</div>
<div class="tag" style="left:72px;top:772px;color:{GREEN}">Now &middot; same money in BTC</div>
<div class="abs" style="left:72px;top:840px;width:{big}px;height:{big}px;background:{GREEN};padding:40px 44px">
  <div class="k" style="font-size:156px;line-height:.9;font-stretch:108%">{S["now"]}</div>
  <div class="abs" style="left:44px;bottom:44px;display:flex;align-items:center;gap:16px;font:800 26px 'Archivo';letter-spacing:.06em">
    <span style="width:{small}px;height:{small}px;background:#0E1012;display:inline-block"></span>= {S["paid"]}</div></div>
<div class="stamp" style="left:560px;top:1130px;width:300px;height:300px;background:#0E1012;border:6px solid #F3EFE6;color:#F3EFE6;box-shadow:0 0 0 12px #0E1012">
  <div><div class="k" style="font-size:96px;line-height:.9;color:{GREEN};font-stretch:100%;text-transform:none">{S["mult"]}</div>
  <div style="font:800 26px 'Archivo';letter-spacing:.22em;margin-top:10px">MORE</div></div></div>
<div class="abs" style="left:72px;top:1452px;font:500 20px 'Archivo';color:#6c736e">{S["note"]}</div>
''')


def c3():
    return page(C_CSS, f'''
<div class="abs" style="left:0;top:0;width:1080px;height:830px;background:#0E1012"></div>
<div class="abs" style="left:0;top:830px;width:1080px;height:1090px;background:{GREEN}"></div>
<img class="abs" src="{A}/logo-official-white.png" style="left:72px;top:248px;height:54px">
<div class="abs k" style="left:64px;top:430px;font-size:170px;line-height:.88;color:#F3EFE6;font-stretch:108%">Your<br>move.</div>
<img class="abs" src="{A}/logos/BTC.svg" style="left:660px;top:700px;width:250px;border-radius:50%;box-shadow:0 0 0 14px #0E1012">
<div class="abs k" style="left:72px;top:990px;font-size:92px;line-height:.95;font-stretch:100%">Trade BTC<br>on Hotcoin</div>
<div class="abs" style="left:72px;top:1210px;width:848px;height:140px;background:#0E1012;color:#F3EFE6;border-radius:999px;
  display:flex;align-items:center;justify-content:space-between;padding:0 20px 0 56px;font:900 46px 'Archivo';font-stretch:105%;text-transform:uppercase;letter-spacing:.01em">
  Download Hotcoin<span style="width:100px;height:100px;border-radius:50%;background:{GREEN};color:#0E1012;display:grid;place-items:center;font-size:54px">&#8594;</span></div>
<div class="tag" style="left:76px;top:1388px;font-size:28px">Link in bio &middot; @hotcoinex</div>
''')


FRAMES = {'A': [a1, a2, a3], 'B': [b1, b2, b3], 'C': [c1, c2, c3]}


def main():
    from playwright.sync_api import sync_playwright
    from PIL import Image, ImageDraw, ImageFont
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = br.new_page(viewport={'width': 1080, 'height': 1920})
        for k, fs in FRAMES.items():
            for i, fn in enumerate(fs, 1):
                h = HERE / f'{k}_{i}.html'
                h.write_text(fn())
                pg.goto(h.as_uri())
                pg.wait_for_load_state('networkidle')
                pg.evaluate('document.fonts.ready')
                pg.screenshot(path=str(HERE / f'{k}_{i}.png'))
        br.close()
    # overview: 3 rows x 3 frames at 360 px wide
    fw, fh, lab, gap = 360, 640, 70, 16
    W = lab + 3 * fw + 4 * gap
    H = 3 * fh + 4 * gap
    ov = Image.new('RGB', (W, H), (232, 232, 228))
    d = ImageDraw.Draw(ov)
    font = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf', 44)
    for r, k in enumerate('ABC'):
        y = gap + r * (fh + gap)
        d.text((lab // 2 + 4, y + fh // 2), k, fill=(20, 20, 20), font=font, anchor='mm')
        for c in range(3):
            im = Image.open(HERE / f'{k}_{c + 1}.png').convert('RGB').resize((fw, fh), Image.LANCZOS)
            ov.paste(im, (lab + gap + c * (fw + gap), y))
    ov.save(HERE / 'options.jpg', quality=90)


if __name__ == '__main__':
    main()
