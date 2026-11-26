"""WHAT IF option B, richer backgrounds: B1 "Market texture", B2 "Photo depth".

python3 ig-news/research/2026-W48/whatif_redesign/build_B.py
-> B1_{1,2,3}.html/.png, B2_{1,2,3}.html/.png (1080x1920) + options_B_v2.jpg (rows B1, B2).
Content and layout are option B from build.py untouched; only background layers are added
under the content (and a soft rim light on the Bezos cut-out).
Photo backgrounds (B2) are prepared once from Unsplash originals by prep_photos(); see NOTES_B.md.
"""
import math
import random
from pathlib import Path

import build as B

HERE = B.HERE
G = '126,194,90'  # brand green rgb

# ------------------------------------------------------------------ shared layers
SHARED_CSS = f'''
.bgl{{position:absolute;inset:0;pointer-events:none}}
.bloom{{position:absolute;border-radius:50%;pointer-events:none}}
.grain{{position:absolute;inset:0;background:url(grain.png);background-size:540px 540px;mix-blend-mode:overlay;opacity:.7;pointer-events:none}}
.vig{{position:absolute;inset:0;background:radial-gradient(120% 85% at 50% 45%,transparent 45%,rgba(0,0,0,.72) 100%);pointer-events:none}}
'''


def bloom(x, y, w, h, a, blur):
    return (f'<div class="bloom" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
            f'background:radial-gradient(closest-side,rgba({G},{a}),rgba({G},0));filter:blur({blur}px)"></div>')


def inject(html, back, front=''):
    """back goes under all frame content, front (grain/vignette) over it."""
    html = html.replace('</style>', SHARED_CSS + '</style>', 1)
    html = html.replace('<div class="f">', '<div class="f">' + back, 1)
    i = html.rfind('</div></body>')
    return html[:i] + front + html[i:]


RIM = ('filter:contrast(1.05) saturate(.9) drop-shadow(0 0 1.5px rgba(200,245,170,.55)) '
       'drop-shadow(-4px -3px 14px rgba(126,194,90,.38))')


def rim(html):
    return html.replace('filter:contrast(1.05) saturate(.9)', RIM, 1)


def make_grain():
    p = HERE / 'grain.png'
    if p.exists():
        return
    from PIL import Image
    rnd = random.Random(7)
    im = Image.new('L', (540, 540))
    im.putdata([max(0, min(255, int(rnd.gauss(128, 42)))) for _ in range(540 * 540)])
    im.save(p)


# ------------------------------------------------------------------ B1: market texture
def candles(n=26, x0=-20, x1=1100, ytop=300, ybot=1700, op=.13):
    v = [math.log10(p[1]) for p in B.SPEC['series']]
    lo, hi = min(v), max(v)
    k = len(v) / n
    ys = lambda val: ybot - (val - lo) / (hi - lo) * (ybot - ytop)
    cw = (x1 - x0) / n
    out, pts = [], []
    for i in range(n):
        seg = v[int(i * k):max(int((i + 1) * k), int(i * k) + 1) + 1]
        o, c, h, l = seg[0], seg[-1], max(seg), min(seg)
        cx = x0 + (i + .5) * cw
        up = c >= o
        col = f'rgba({G},{op})' if up else f'rgba(255,255,255,{op * .55})'
        out.append(f'<line x1="{cx:.1f}" x2="{cx:.1f}" y1="{ys(h):.1f}" y2="{ys(l):.1f}" stroke="{col}" stroke-width="2"/>')
        t, b = sorted((ys(o), ys(c)))
        out.append(f'<rect x="{cx - cw * .3:.1f}" y="{t:.1f}" width="{cw * .6:.1f}" height="{max(b - t, 3):.1f}" rx="2" '
                   f'fill="{col}" stroke="{col}"/>')
        pts.append((cx, ys(c)))
    line = 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts)
    return ''.join(out), line


def market_bg(frame):
    cs, line = candles()
    grid = ''.join(f'<line x1="{x}" x2="{x}" y1="0" y2="1920" stroke="rgba(255,255,255,.04)" stroke-width="1"/>' for x in range(0, 1081, 60))
    grid += ''.join(f'<line y1="{y}" y2="{y}" x1="0" x2="1080" stroke="rgba(255,255,255,.04)" stroke-width="1"/>' for y in range(0, 1921, 60))
    # fade the texture toward top and bottom so it never fights the UI zones
    svg = f'''<svg class="bgl" width="1080" height="1920" viewBox="0 0 1080 1920">
<defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".3" stop-color="#fff" stop-opacity="1"/>
<stop offset=".78" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity=".15"/></linearGradient>
<mask id="m"><rect width="1080" height="1920" fill="url(#fade)"/></mask>
<filter id="lb"><feGaussianBlur stdDeviation="10"/></filter></defs>
<g mask="url(#m)">{grid}{cs}
<path d="{line}" fill="none" stroke="rgba({G},.22)" stroke-width="10" filter="url(#lb)"/>
<path d="{line}" fill="none" stroke="rgba({G},.20)" stroke-width="2"/></g></svg>'''
    base = '<div class="bgl" style="background:radial-gradient(90% 60% at 50% 40%,#0b120c 0%,#050706 60%,#020302 100%)"></div>'
    blooms = {
        1: bloom(-260, -160, 900, 900, .20, 40) + bloom(420, 520, 900, 900, .16, 60) + bloom(-200, 1300, 800, 700, .10, 70),
        2: bloom(560, 120, 760, 760, .18, 50) + bloom(-300, 900, 900, 900, .14, 70) + bloom(300, 1480, 700, 500, .12, 60),
        3: bloom(-280, -120, 800, 800, .14, 50) + bloom(700, 1100, 800, 800, .14, 70) + bloom(140, 1460, 800, 500, .10, 60),
    }[frame]
    calm = ('<div class="bgl" style="background:radial-gradient(60% 16% at 46% 63%,rgba(4,6,5,.8),rgba(4,6,5,0))"></div>'
            if frame == 3 else '')  # quiet zone behind the end-frame headline
    return base + blooms + svg + calm


def reflection():
    # faint mirrored glow of the glass card on the "floor" under it (frame 2)
    return ('<div class="bgl" style="inset:auto;left:110px;top:1430px;height:170px;'
            f'width:760px;background:radial-gradient(50% 50% at 50% 0%,rgba({G},.22),rgba({G},0));filter:blur(18px)"></div>'
            '<div class="bgl" style="inset:auto;left:90px;top:1424px;width:800px;height:2px;'
            'background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)"></div>')


def b1(n, html):
    back = market_bg(n) + (reflection() if n == 2 else '') + '<div class="grain"></div><div class="vig"></div>'
    return inject(html, back)


# ------------------------------------------------------------------ B2: photo depth
PHOTOS = {  # frame -> (source file in scratch dl, crop focus x 0..1, blur px)
    1: ('p1.jpg', .35, 9),
    2: ('p2.jpg', .55, 12),
    3: ('p3.jpg', .80, 22),
}


def prep_photos(src_dir):
    """Darken, blur and duotone-grade the originals to brand black/green -> bgphoto_{n}.jpg (1080x1920)."""
    from PIL import Image, ImageFilter, ImageOps
    for n, (fn, fx, blur) in PHOTOS.items():
        im = Image.open(Path(src_dir) / fn).convert('RGB')
        s = max(1080 / im.width, 1920 / im.height) * 1.08
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        x = int((im.width - 1080) * fx)
        y = (im.height - 1920) // 2
        im = im.crop((x, y, x + 1080, y + 1920)).filter(ImageFilter.GaussianBlur(blur))
        g = ImageOps.autocontrast(im.convert('L'), cutoff=1)
        im = ImageOps.colorize(g, black=(2, 4, 3), mid=(22, 46, 24), white=(150, 214, 118), midpoint=150)
        im.save(HERE / f'bgphoto_{n}.jpg', quality=88)


def photo_bg(n):
    op = {1: .55, 2: .55, 3: .85}[n]
    shade = {  # extra darkening where the copy sits
        1: 'linear-gradient(180deg,rgba(3,5,4,.35) 0%,rgba(3,5,4,.10) 28%,rgba(3,5,4,.7) 47%,rgba(3,5,4,.85) 58%,rgba(3,5,4,.92) 80%,#030504 100%)',
        2: 'linear-gradient(180deg,rgba(3,5,4,.45) 0%,rgba(3,5,4,.35) 50%,rgba(3,5,4,.85) 85%)',
        3: 'radial-gradient(70% 22% at 45% 62%,rgba(3,5,4,.85),rgba(3,5,4,0)),linear-gradient(180deg,rgba(3,5,4,.35) 0%,rgba(3,5,4,.25) 40%,rgba(3,5,4,.7) 75%,rgba(3,5,4,.92) 100%)',
    }[n]
    return (f'<div class="bgl" style="background:url(bgphoto_{n}.jpg) center/cover;opacity:{op}"></div>'
            f'<div class="bgl" style="background:{shade}"></div>')


def b2(n, html):
    back = photo_bg(n) + (reflection() if n == 2 else '') + '<div class="grain"></div><div class="vig"></div>'
    return inject(html, back)


# ------------------------------------------------------------------ v2 copy: full sentences
# Owner feedback on v1: "don't cut phrases". Frame 1 headline is two full sentences, with a small
# Washington Post badge (the paper's real "wp" mark, wapo_wp.png, source in NOTES_B.md) after "newspaper".
# Frame 2 swaps its label fragments for a sentence; frame 3 (CTA) is unchanged.
WAPO = ('<img src="wapo_wp.png" alt="The Washington Post" style="display:inline-block;width:92px;height:92px;'
        'border-radius:50%;vertical-align:-6px;margin-left:22px;box-shadow:0 0 0 4px rgba(255,255,255,.9),'
        '0 10px 30px rgba(0,0,0,.55)">')


def f1():
    S = B.S
    return B.page(B.B_CSS, f'''
<div class="glow" style="left:220px;top:300px;width:700px;height:700px;background:rgba(126,194,90,.28)"></div>
<div class="pill" style="left:72px;top:240px"><i></i>What if</div>
<img class="abs" src="bezos_cut.png" style="left:-30px;top:330px;width:1110px;
  -webkit-mask-image:linear-gradient(180deg,#000 62%,transparent 98%);filter:contrast(1.05) saturate(.9)">
<div class="abs" style="left:72px;top:1040px;width:860px;font:700 96px/1.04 'Inter Display';letter-spacing:-.035em">
  <span class="grad">Bezos spent {S["paid"]}</span><br><span class="grad">on a {S["thing"]}</span>{WAPO}</div>
<div class="abs" style="left:72px;top:1286px;width:860px;font:600 66px/1.12 'Inter Display';letter-spacing:-.02em;color:#eef2ec">
  What if he just bought<br><span style="color:#7EC25A">Bitcoin</span> instead?</div>
''')


F2_SWAPS = (
    ('<i></i>Same {paid}, in Bitcoin</div>', '<i></i>What if</div>'),
    ('&nbsp;since {month}</span>', '&nbsp;bought in {month}</span>'),
    ('''<div class="abs mute" style="left:110px;top:560px;font:600 28px 'Inter';letter-spacing:.18em">WORTH TODAY</div>''',
     '''<div class="abs" style="left:110px;top:526px;font:600 40px 'Inter';letter-spacing:-.01em;color:#d9e2d6">The same {paid} in Bitcoin is worth</div>'''),
    ('>vs {paid} paid</span>', '>more than he paid</span>'),
)


def f2():
    h = B.b2()
    for a, b in F2_SWAPS:
        a, b = a.format(**B.S), b.format(**B.S)
        assert a in h, a
        h = h.replace(a, b, 1)
    return h


# ------------------------------------------------------------------ render
def main():
    import sys
    from playwright.sync_api import sync_playwright
    from PIL import Image, ImageDraw, ImageFont
    if len(sys.argv) > 1:
        prep_photos(sys.argv[1])
    make_grain()
    base = {1: rim(f1()), 2: f2(), 3: B.b3()}
    jobs = {}
    for n, h in base.items():
        jobs[f'B1_{n}'] = b1(n, h)
        jobs[f'B2_{n}'] = b2(n, h)
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = br.new_page(viewport={'width': 1080, 'height': 1920})
        for name, html in jobs.items():
            f = HERE / f'{name}.html'
            f.write_text(html)
            pg.goto(f.as_uri())
            pg.wait_for_load_state('networkidle')
            pg.evaluate('document.fonts.ready')
            pg.screenshot(path=str(HERE / f'{name}.png'))
        br.close()
    fw, fh, lab, gap = 360, 640, 90, 16
    W, H = lab + 3 * fw + 4 * gap, 2 * fh + 3 * gap
    ov = Image.new('RGB', (W, H), (232, 232, 228))
    d = ImageDraw.Draw(ov)
    font = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf', 40)
    for r, k in enumerate(('B1', 'B2')):
        y = gap + r * (fh + gap)
        d.text((lab // 2 + 4, y + fh // 2), k, fill=(20, 20, 20), font=font, anchor='mm')
        for c in range(3):
            im = Image.open(HERE / f'{k}_{c + 1}.png').convert('RGB').resize((fw, fh), Image.LANCZOS)
            ov.paste(im, (lab + gap + c * (fw + gap), y))
    ov.save(HERE / 'options_B_v2.jpg', quality=90)


if __name__ == '__main__':
    main()
