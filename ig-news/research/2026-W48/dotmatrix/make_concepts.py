#!/usr/bin/env python3
"""Build the 5 dot-matrix concepts + overview (+ optional green alt). Run from repo root:
    python3 ig-news/research/2026-W48/dotmatrix/make_concepts.py [1 2 3 ...]
Cut-outs are cached in /tmp so re-runs are fast."""
import sys, random
from pathlib import Path
import numpy as np
from PIL import Image
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[2] / 'tools'))
from dotmatrix import Board, load_subject, svg_to_png, ASSETS, GREEN, FONT_MANROPE

W, H = 1080, 1350
WHITE, MINT = (255, 255, 255), (168, 226, 128)


OFFS = {}


def cut(name, model):
    """rembg cut-out (cached, full-frame). OFFS[name] = top-left of the returned crop inside the photo."""
    cache = Path(f'/tmp/_dm_cut_{name}_{model}.png')
    if not cache.exists():
        load_subject(HERE / 'src' / f'{name}.jpg', rembg=True, model=model, max_side=4000, crop=False).save(cache)
    im = Image.open(cache)
    bb = im.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox(); OFFS[name] = bb[:2]
    return im.crop(bb)


def series(seed, n, start=100, drift=0.0, vol=1.6, breakout=0):
    rng = random.Random(seed); out = []; c = start
    for i in range(n):
        o = c
        step = drift + rng.uniform(-vol, vol)
        if breakout and i >= n - breakout:
            step = abs(step) + vol * (1.3 + (i - (n - breakout)) * .35)
        c = o + step
        hi, lo = max(o, c) + rng.uniform(.2, vol * .8), min(o, c) - rng.uniform(.2, vol * .8)
        out.append((o, hi, lo, c))
    return out


def c1():  # person holding a phone; the blank screen lights up with a rising price line
    b = Board(W, H, pitch=12)
    src = cut('phone', 'u2net_human_seg')
    ox, oy = OFFS['phone']
    sx0, sx1, sy0, sy1 = 529, 861, 862, 1024            # screen rect in src/phone.jpg (dark blob, measured)
    sub = src.crop((0, 0, src.width, int(src.height * .62)))   # waist up
    hh = 1080; sc = hh / sub.height; cx, cy = 540, 160 + hh / 2
    x0, y0 = cx - sub.width * sc / 2, cy - hh / 2
    b.place(sub, cx, cy, h=hh, floor=.18, detail=1.1, equalize=.55)
    b.fade_edge(1000, 1170)
    X0, X1 = x0 + (sx0 - ox) * sc, x0 + (sx1 - ox) * sc
    Y0, Y1 = y0 + (sy0 - oy) * sc, y0 + (sy1 - oy) * sc
    b._draw_layer(lambda d: d.rectangle([X0 + 4, Y0 + 4, X1 - 4, Y1 - 4], fill=255), .28)   # lit screen
    rng = random.Random(9); pts = []; yv = Y1 - 30
    for k in range(9):
        pts.append((X0 + 22 + k * (X1 - X0 - 44) / 8, yv)); yv -= rng.uniform(-6, 26)
    b.line(pts, width=13, value=1, hot=True)                                                  # white-hot price line
    img = b.render(hot_frac=.01)
    Board.copy(img, 'Trade it from your phone', (W / 2, 1215), 74, anchor='ms', accent=('phone', MINT))
    Board.logo(img, 'tl', 34)
    return img


def c2():  # bull over dim candles
    b = Board(W, H, pitch=12)
    bull = cut('bull', 'isnet-general-use')
    b.place(bull, 500, 660, w=1010, floor=.18, detail=1.2, equalize=.4)
    b.fade_edge(900, 1080)
    img = b.render()
    Board.copy(img, 'Bull or bear?\nYou pick.', (64, 1150), 84, accent=('Bull', MINT))
    Board.logo(img, 'tl', 34)
    return img


def btc_board(pitch=14):
    b = Board(W, H, pitch=pitch)
    coin = svg_to_png(ASSETS / 'logos' / 'BTC.svg', 1024)
    a = np.asarray(coin, np.float32) / 255
    disc = a[..., 3]
    whiteB = ((a[..., 0] > .85) & (a[..., 1] > .85) & (a[..., 2] > .85)).astype(np.float32) * disc
    # disc as shaded sphere-ish coin, the B in hot white: LED coin
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]] / a.shape[0]
    shade = np.clip(1.05 - .9 * np.hypot(xx - .32, yy - .28), .15, 1) * .78
    rim = np.clip(1 - np.abs(np.hypot(xx - .5, yy - .5) - .47) / .03, 0, 1)
    val = np.clip(np.maximum(shade, rim * .95), 0, 1)
    val = np.where(whiteB > .5, 1.0, val)
    rgba = np.dstack([val * 255] * 3 + [disc * 255]).astype(np.uint8)
    cx, cy, size = W / 2, 610, 720
    b.place(Image.fromarray(rgba, 'RGBA'), cx, cy, h=size, floor=.0, detail=0, lo=0, hi=100, gamma=1)
    Bm = Image.fromarray((np.dstack([whiteB * 255] * 4)).astype(np.uint8), 'RGBA')
    b.shape_mask(Bm, cx, cy, size, value=1, hot=True)
    return b


def c3():
    img = btc_board().render(hot_frac=.0)
    Board.copy(img, 'Start with a little Bitcoin', (W / 2, 1150), 74, anchor='ms', accent=('Bitcoin', MINT))
    Board.logo(img, 'tl', 34)
    return img


def c3_green():
    img = btc_board().render(bg='green', hot_frac=.0)
    Board.copy(img, 'Start with a little Bitcoin', (W / 2, 1150), 74, anchor='ms', color=(14, 26, 11), shadow=False)
    Board.logo(img, 'tl', 34, dark=True)
    return img


def c4():  # athlete
    b = Board(W, H, pitch=12)
    # speed streaks behind, in dots
    for y, x0, x1, v in ((520, 40, 300, .22), (610, 80, 360, .16), (900, 30, 260, .2), (980, 120, 330, .12)):
        b.line([(x0, y), (x1, y)], width=12, value=v)
    b.place(cut('dribble', 'isnet-general-use'), 600, 640, h=1040, floor=.22, detail=1.2, equalize=.85, gamma=1.1)
    img = b.render()
    Board.copy(img, 'Move fast when\nthe market does', (64, 1170), 74, accent=('fast', MINT))
    Board.logo(img, 'tl', 34)
    return img


def c5():  # candlestick breakout
    b = Board(W, H, pitch=12)
    s = series(5, 16, vol=2.2, breakout=3)
    rect = (84, 230, 912, 780)
    lo_, hi_ = min(c[2] for c in s), max(c[1] for c in s)
    sy = lambda v: rect[1] + rect[3] - (v - lo_) / (hi_ - lo_) * rect[3]
    res = max(c[1] for c in s[:-3])
    b.dashed((48, sy(res)), (1032, sy(res)), value=.5, every=2)
    # base candles medium (down ones dim), the 3 breakout candles full-bright, last one white-hot
    step = rect[2] / len(s)
    for i, (o, hh, ll, c) in enumerate(s):
        cx = rect[0] + step * (i + .5); bw = step * .62
        brk = i >= len(s) - 3
        v = 1.0 if brk else (.7 if c >= o else .32)
        b._draw_layer(lambda d: (d.rectangle([cx - 6, sy(hh), cx + 6, sy(ll)], fill=255),
                                 d.rectangle([cx - bw / 2, sy(max(o, c)), cx + bw / 2, sy(min(o, c)) + 12], fill=255)),
                      v, hot=brk and i == len(s) - 1)
    img = b.render(hot_frac=.0)
    Board.copy(img, 'It broke out.\nDid you see it?', (64, 1150), 74, accent=('broke out.', MINT))
    Board.logo(img, 'tl', 34)
    Board.symbol(img, 'br', 64, 64)
    return img


JOBS = {'1': c1, '2': c2, '3': c3, '4': c4, '5': c5, '3g': c3_green}

if __name__ == '__main__':
    which = sys.argv[1:] or list(JOBS)
    for k in which:
        name = f'concept_{k}.png' if k != '3g' else 'concept_3_alt_green.png'
        JOBS[k]().save(HERE / name); print(name)
    ims = [Image.open(HERE / f'concept_{i}.png') for i in range(1, 6)]
    if all(ims):
        tw, th, g = 360, 450, 12
        ov = Image.new('RGB', (5 * tw + 6 * g, th + 2 * g), (24, 26, 25))
        for i, im in enumerate(ims):
            ov.paste(im.resize((tw, th), Image.LANCZOS), (g + i * (tw + g), g))
        ov.save(HERE / 'overview.jpg', quality=92)
