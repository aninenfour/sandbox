#!/usr/bin/env python3
"""DOT MATRIX motion: short brand videos in the Hotcoin LED look (green dots + bloom on graphite).

    python3 ig-news/dotmotion.py <spec.json> [--only 916|169|tt] [--stills 0,1.2,5] [--fast]

Writes into spec["out_dir"]:
    v916.mp4 (1080x1920, IG Reel)   v916_tiktok.mp4 (same, end card without the CTA pill/line: TikTok rule §7c)
    v169.mp4 (1920x1080, X / FB / Telegram; landscape layout: subject left, copy right)
    cover.jpg (= frame 0 of v916, TikTok/IG cover), cover_169.jpg, contact_916.jpg, contact_169.jpg
    safezones.jpg (frame 0 + the IG/TikTok UI zones drawn on top)

Spec (paths relative to the repo root):
{
  "out_dir": "ig-news/media/2026-11-27-dotmatrix-brand",
  "music": {"path": "ig-news/assets/music/175.mp3", "start": 5.8, "credit": "..."},
  "scenes": [
    {"subject": {"type": "photo", "cutout": "ig-news/assets/dotmotion/bull.png", "fade": .18, "equalize": .4},
     "text": "Bull or bear?\\nYou pick.", "accent": "Bull", "dur": 2.3, "reveal": "ripple"},
    {"subject": {"type": "chart", "seed": 5}, "text": "...", "dur": 2.0, "reveal": "scan_lr"},
    {"subject": {"type": "coin", "svg_png": "ig-news/assets/dotmotion/btc.png"}, ...},
    {"end": true, "dur": 3.2, "text": "Trade crypto\\non Hotcoin", "pill": "Download Hotcoin"}
  ]
}
Subject types: photo (cutout = transparent PNG, or src + rembg model; crop [l,t,r,b] fractions; fade = bottom
fraction dissolved; screen = [x0,y0,x1,y1] fractions of the cutout -> lit phone screen + rising line; streaks),
chart (candle breakout), coin (round logo PNG; white parts = hot LEDs), symbol (Hotcoin symbol; end card).
Scene keys: text (\\n allowed, auto-wrapped), accent (word drawn mint), dur (s), reveal: ripple|scan_lr|scan_tb|
sparkle (how the dots assemble), origin [x,y] (0..1 of the subject box, for ripple).

Motion: scene 1 is fully lit at frame 0 (cover rule) with a light pulse; every later scene assembles dot by dot
out of the previous one (each LED flashes white, then settles), the lit layer drifts/zooms slowly over the static
"off" LED board (parallax), copy slides up line by line, a few LEDs twinkle. Grid = 12 px everywhere.
Safe zones (9:16): nothing key in the top 220 px, bottom 440 px, or right 160 px below y=700.
"""
import argparse, json, math, os, subprocess, sys, tempfile
from multiprocessing import Pool
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
sys.path.insert(0, str(HERE / 'tools'))
from dotmatrix import Board, load_subject, GREEN, GRAPHITE, FONT_ARCHIVO, ASSETS  # noqa: E402

FPS = 30
P = 12
MINT = (168, 226, 128)
INK = (14, 26, 11)
WHITE = np.array((244, 255, 236), np.float32)

# layout per format: subject box (x0, y0, x1, y1), text column, logo position
LAYOUT = {
    '916': dict(W=1080, H=1920, box=(30, 280, 1000, 1150), tx=72, tw=830, tsize=96, tbase=1415, talign='bottom',
                logo=(72, 236, 40), end_sym=(540, 700, 470), end_tx=540, end_tw=760, end_size=96, end_base=1170,
                end_center=True),
    '169': dict(W=1920, H=1080, box=(60, 80, 1000, 1000), tx=1072, tw=780, tsize=96, tmid=560, talign='middle',
                logo=(1072, 150, 44), end_sym=(520, 540, 540), end_tx=1072, end_tw=780, end_size=104, end_base=None,
                end_center=False),
}


def rp(p):
    p = Path(p)
    return p if p.is_absolute() else REPO / p


def font(size, weight=760):
    f = ImageFont.truetype(FONT_ARCHIVO, size)
    try:
        f.set_variation_by_axes([weight, 100])
    except Exception:
        pass
    return f


def ease_out(x):
    x = min(1.0, max(0.0, x))
    return 1 - (1 - x) ** 3


# ------------------------------------------------------------------ subjects -> Board (source field)
def series(seed, n, start=100, drift=0.0, vol=1.6, breakout=0):
    import random
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


def fit(w, h, box, scale=1.0):
    bw, bh = box[2] - box[0], box[3] - box[1]
    s = min(bw / w, bh / h) * scale
    return s


def paint_subject(b, sub, box):
    """Paint one subject into Board b inside box. Returns the subject's centre (for camera + ripple)."""
    t = sub.get('type', 'photo')
    bx0, by0, bx1, by1 = box
    ax, ay = sub.get('anchor', [.5, .5])
    if t == 'photo':
        if sub.get('cutout'):
            im = Image.open(rp(sub['cutout'])).convert('RGBA')
        else:
            im = load_subject(rp(sub['src']), rembg=True, model=sub.get('model', 'isnet-general-use'), max_side=2000)
        W0, H0 = im.size
        cl, ct, cr, cb = sub.get('crop', [0, 0, 1, 1])
        im = im.crop((int(cl * W0), int(ct * H0), int(cr * W0), int(cb * H0)))
        s = fit(im.width, im.height, box, sub.get('scale', 1.0))
        w, h = im.width * s, im.height * s
        cx = bx0 + (bx1 - bx0 - w) * ax + w / 2 + sub.get('dx', 0) * (bx1 - bx0)
        cy = by0 + (by1 - by0 - h) * ay + h / 2
        for (yy, x0, x1, v) in (sub.get('streaks') or []):     # dim speed streaks, coords as box fractions
            b.line([(bx0 + x0 * (bx1 - bx0), by0 + yy * (by1 - by0)), (bx0 + x1 * (bx1 - bx0), by0 + yy * (by1 - by0))],
                   width=P, value=v)
        b.place(im, cx, cy, h=h, floor=sub.get('floor', .18), detail=sub.get('detail', 1.2),
                equalize=sub.get('equalize', .45), gamma=sub.get('gamma', .95))
        if sub.get('fade'):
            y1 = cy + h / 2
            b.fade_edge(y1 - h * sub['fade'], y1 + P)
        if sub.get('screen'):
            x0f, y0f, x1f, y1f = sub['screen']
            # fractions of the uncropped cutout -> canvas
            fx = lambda f: cx - w / 2 + ((f - cl) / (cr - cl)) * w
            fy = lambda f: cy - h / 2 + ((f - ct) / (cb - ct)) * h
            X0, X1, Y0, Y1 = fx(x0f), fx(x1f), fy(y0f), fy(y1f)
            b._draw_layer(lambda d: d.rectangle([X0 + 3, Y0 + 3, X1 - 3, Y1 - 3], fill=255), .3)
            import random
            rng = random.Random(9); pts = []; yv = Y1 - (Y1 - Y0) * .2
            for k in range(9):
                pts.append((X0 + (X1 - X0) * (.08 + .84 * k / 8), yv)); yv -= rng.uniform(-.04, .16) * (Y1 - Y0)
            b.line(pts, width=13, value=1, hot=True)
        return (cx, cy)
    if t == 'chart':
        s = series(sub.get('seed', 5), sub.get('n', 16), vol=2.2, breakout=sub.get('breakout', 3))
        pad = sub.get('pad', .06)
        rx0, ry0 = bx0 + (bx1 - bx0) * pad, by0 + (by1 - by0) * pad
        rw, rh = (bx1 - bx0) * (1 - 2 * pad), (by1 - by0) * (1 - 2 * pad)
        lo_, hi_ = min(c[2] for c in s), max(c[1] for c in s)
        sy = lambda v: ry0 + rh - (v - lo_) / (hi_ - lo_) * rh
        nb = sub.get('breakout', 3)
        res = max(c[1] for c in s[:-nb])
        b.dashed((bx0, sy(res)), (bx1, sy(res)), value=.5, every=2)
        step = rw / len(s)
        for i, (o, hh, ll, c) in enumerate(s):
            x = rx0 + step * (i + .5); bw = step * .62
            brk = i >= len(s) - nb
            v = 1.0 if brk else (.7 if c >= o else .32)
            b._draw_layer(lambda d: (d.rectangle([x - 6, sy(hh), x + 6, sy(ll)], fill=255),
                                     d.rectangle([x - bw / 2, sy(max(o, c)), x + bw / 2, sy(min(o, c)) + 12], fill=255)),
                          v, hot=brk and i == len(s) - 1)
        return ((bx0 + bx1) / 2, (by0 + by1) / 2)
    if t in ('coin', 'symbol'):
        src = sub.get('png') or (str(ASSETS / 'dotmotion' / ('btc.png' if t == 'coin' else 'symbol.png')))
        im = Image.open(rp(src)).convert('RGBA')
        a = np.asarray(im, np.float32) / 255
        A = a[..., 3]
        white = ((a[..., 0] > .85) & (a[..., 1] > .85) & (a[..., 2] > .85)).astype(np.float32) * A
        size = sub.get('size') or min(bx1 - bx0, by1 - by0) * sub.get('scale', .86)
        cx = bx0 + (bx1 - bx0) * ax
        cy = by0 + (by1 - by0) * ay
        if t == 'coin':
            yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]] / a.shape[0]
            shade = np.clip(1.05 - .9 * np.hypot(xx - .32, yy - .28), .15, 1) * .78
            rim = np.clip(1 - np.abs(np.hypot(xx - .5, yy - .5) - .47) / .03, 0, 1)
            val = np.where(white > .5, 1.0, np.clip(np.maximum(shade, rim * .95), 0, 1))
            rgba = np.dstack([val * 255] * 3 + [A * 255]).astype(np.uint8)
            b.place(Image.fromarray(rgba, 'RGBA'), cx, cy, h=size, floor=0, detail=0, lo=0, hi=100, gamma=1)
        else:   # Hotcoin symbol: white slash -> white-hot LEDs, green dot -> full green LEDs
            green = np.clip(A - white, 0, 1)
            Gm = Image.fromarray((np.dstack([green * 255] * 4)).astype(np.uint8), 'RGBA')
            b.shape_mask(Gm, cx, cy, size, value=.86)
        Wm = Image.fromarray((np.dstack([white * 255] * 4)).astype(np.uint8), 'RGBA')
        b.shape_mask(Wm, cx, cy, size, value=1, hot=True)
        return (cx, cy)
    raise ValueError(f'unknown subject type {t}')


# ------------------------------------------------------------------ per-cell LED state
def cell_state(b, hot_frac=.03, hot_keep=.45, levels=6, min_cov=.38, smin=.22, smax=.94):
    """Same LED maths as Board.render, but returned per cell (on, radius, colour) for animation."""
    X, Y, V, C, Hh, F = b.cells()
    rng = np.random.default_rng(3)
    on = (C >= min_cov) & (rng.random(V.shape) < F ** .8)
    V = V * (.35 + .65 * F)
    q = np.clip(np.round(V * (levels - 1)) / (levels - 1), 0, 1)
    thr = np.quantile(V[on], 1 - hot_frac) if (on.sum() > 20 and hot_frac > 0) else 2
    hot = on & (((V >= thr) & (rng.random(V.shape) < hot_keep)) | (Hh > .5))
    r = P / 2 * (smin + (smax - smin) * q ** .85)
    g = np.array(GREEN, np.float32); deep = np.array((36, 74, 26), np.float32); mint = np.array((196, 242, 160), np.float32)
    v = q[..., None]
    col = np.where(v < .75, deep + (g - deep) * np.minimum(1, v / .75), g + (mint - g) * (v - .75) / .25 * .55)
    col = col * (.42 + .58 * v)
    col = np.where(hot[..., None], WHITE, col)
    r = np.where(hot, np.maximum(r, P / 2 * .9), r)
    r = np.where(on, r, 0).astype(np.float32)
    return on, r, col.astype(np.float32)


def delay_map(kind, shape, origin, span, rng):
    ny, nx = shape
    ys, xs = np.mgrid[0:ny, 0:nx]
    x01, y01 = (xs + .5) / nx, (ys + .5) / ny
    j = rng.random(shape)
    if kind == 'scan_lr':
        d = .8 * x01 + .2 * j
    elif kind == 'scan_tb':
        d = .8 * y01 + .2 * j
    elif kind == 'sparkle':
        d = j
    else:   # ripple
        ox, oy = origin
        dd = np.hypot((x01 - ox) * nx, (y01 - oy) * ny)
        d = .78 * dd / dd.max() + .22 * j
    return (d * span).astype(np.float32)


# ------------------------------------------------------------------ text layers (crisp copy)
def wrap(text, f, maxw):
    d = ImageDraw.Draw(Image.new('L', (8, 8)))
    out = []
    for para in text.split('\n'):
        words, cur = para.split(' '), ''
        for w in words:
            t = (cur + ' ' + w).strip()
            if d.textlength(t, font=f) <= maxw or not cur:
                cur = t
            else:
                out.append(cur); cur = w
        out.append(cur)
    return out


def text_lines(text, size, maxw):
    """Wrap; shrink until every line fits. Returns (font, size, lines)."""
    while True:
        f = font(size)
        lines = wrap(text, f, maxw)
        d = ImageDraw.Draw(Image.new('L', (8, 8)))
        if all(d.textlength(l, font=f) <= maxw for l in lines) and len(lines) <= 3 or size < 40:
            return f, size, lines
        size -= 4


def line_layer(line, f, size, accent=None, color=(255, 255, 255)):
    """One line of copy as an RGBA image with a soft dark halo baked in (for compositing)."""
    d0 = ImageDraw.Draw(Image.new('L', (8, 8)))
    tw = int(d0.textlength(line, font=f)) + 1
    pad = int(size * .6)
    Wl, Hl = tw + 2 * pad, int(size * 1.45) + 2 * pad
    base_y = pad + int(size * 1.0)
    mask = Image.new('L', (Wl, Hl), 0)
    ImageDraw.Draw(mask).text((pad, base_y), line, font=f, fill=255, anchor='ls')
    halo = mask.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(size * .35)).point(lambda v: int(v * .78))
    lay = Image.new('RGBA', (Wl, Hl), (0, 0, 0, 0))
    lay.putalpha(halo)
    d = ImageDraw.Draw(lay)
    x = pad
    parts = [(line, color)]
    if accent and accent in line:
        pre, post = line.split(accent, 1)
        parts = [(pre, color), (accent, MINT), (post, color)]
    for part, c in parts:
        if part:
            d.text((x, base_y), part, font=f, fill=c + (255,), anchor='ls')
            x += d.textlength(part, font=f)
    return lay, pad, base_y, tw


def pill_layer(label, size=46):
    f = font(size, 760)
    d0 = ImageDraw.Draw(Image.new('L', (8, 8)))
    tw = d0.textlength(label, font=f)
    ph, pw = int(size * 2.05), int(tw + size * 1.7)
    pad = 40
    lay = Image.new('RGBA', (pw + 2 * pad, ph + 2 * pad), (0, 0, 0, 0))
    glow = Image.new('L', lay.size, 0)
    ImageDraw.Draw(glow).rounded_rectangle([pad, pad, pad + pw, pad + ph], radius=ph // 2, fill=150)
    glow = glow.filter(ImageFilter.GaussianBlur(18))
    g = Image.new('RGBA', lay.size, GREEN + (0,)); g.putalpha(glow)
    lay = Image.alpha_composite(lay, g)
    d = ImageDraw.Draw(lay)
    d.rounded_rectangle([pad, pad, pad + pw, pad + ph], radius=ph // 2, fill=GREEN + (255,))
    d.text((pad + pw / 2, pad + ph / 2 + size * .04), label, font=f, fill=INK + (255,), anchor='mm')
    return lay, pad, pw, ph


# ------------------------------------------------------------------ build a format
class Movie:
    def __init__(self, spec, fmt, tiktok=False):
        self.spec, self.fmt, self.tiktok = spec, fmt, tiktok
        L = LAYOUT[fmt]; self.L = L
        self.W, self.H = L['W'], L['H']
        self.nx, self.ny = self.W // P, self.H // P
        self.scenes = []
        t = 0.0
        rng = np.random.default_rng(11)
        for i, sc in enumerate(spec['scenes']):
            b = Board(self.W, self.H, pitch=P)
            if sc.get('end'):
                cx, cy, size = L['end_sym']
                c = paint_subject(b, {'type': 'symbol', 'size': size, 'anchor': [.5, .5]},
                                  (cx - size / 2, cy - size / 2, cx + size / 2, cy + size / 2))
            else:
                box = sc.get('box', {}).get(fmt, L['box'])
                c = paint_subject(b, dict(sc['subject'], **sc['subject'].get(fmt, {})), box)
            on, r, col = cell_state(b, hot_frac=sc.get('hot_frac', .03 if sc.get('subject', {}).get('type') == 'photo' else 0))
            origin = sc.get('origin')
            if origin is None:
                origin = (c[0] / self.W, c[1] / self.H)
            dur = float(sc.get('dur', 2.0))
            dm = delay_map(sc.get('reveal', 'ripple'), (self.ny, self.nx), origin, sc.get('span', .5), rng)
            tw = rng.random((self.ny, self.nx))
            self.scenes.append(dict(sc=sc, t0=t, dur=dur, on=on, r=r, col=col, delay=dm, centre=c,
                                    tw_phase=tw, tw_sel=(rng.random((self.ny, self.nx)) < .035) & on & ~(col[..., 0] > 240),
                                    text=self._text(sc, i)))
            t += dur
        self.total = t
        self.n = int(round(t * FPS))
        # sprites: antialiased disc masks for radii 0..P/2 in 0.05 px steps
        ss = 8
        g = (np.arange(P * ss) + .5) / ss
        yy, xx = np.meshgrid(g, g, indexing='ij')
        dist = np.hypot(xx - P / 2, yy - P / 2)
        self.rad_steps = np.arange(0, P / 2 + .05, .05)
        spr = [(dist <= rr).reshape(P, ss, P, ss).mean(axis=(1, 3)) for rr in self.rad_steps]
        self.spr = np.stack(spr).astype(np.float32)
        off = self.spr[int(round(P * .2 / .05))]
        offc = np.array(GRAPHITE, np.float32) + np.array((15, 21, 16), np.float32)
        tile = np.tile(off, (self.ny, self.nx))[..., None]
        self.bg = (np.array(GRAPHITE, np.float32) * (1 - tile) + offc * tile)
        lg = Image.open(ASSETS / 'logo-official-white.png').convert('RGBA')
        lh = L['logo'][2]
        self.logo = lg.resize((int(lg.width * lh / lg.height), lh), Image.LANCZOS)

    def _text(self, sc, i):
        L = self.L
        end = sc.get('end')
        text = sc.get('text', '')
        accent = sc.get('accent')
        pill = sc.get('pill')
        if end and self.tiktok:     # TikTok cut: no trading CTA (house rule §7c)
            text, pill, accent = sc.get('tiktok_text', 'Hotcoin'), None, None
        if not text:
            return []
        size = L['end_size'] if end else L['tsize']
        maxw = L['end_tw'] if end else L['tw']
        f, size, lines = text_lines(text, size, maxw)
        lh = size * 1.1
        items = []
        if end and L['end_center']:
            base0 = L['end_base']
        elif end or L['talign'] == 'middle':
            block = lh * (len(lines) - 1) + size * .75 + ((size * 2.05 + 50) if pill else 0)
            base0 = L.get('tmid', 540) - block / 2 + size * .75
        else:
            base0 = L['tbase'] - lh * (len(lines) - 1)
        for k, ln in enumerate(lines):
            lay, pad, by, tw = line_layer(ln, f, size, accent)
            x = (L['end_tx'] - tw / 2 if (end and L['end_center']) else (L['end_tx'] if end else L['tx'])) - pad
            y = base0 + k * lh - by
            items.append(dict(img=lay, x=x, y=y, delay=.18 + .09 * k if (i > 0) else -1, kind='line'))
        if pill:
            lay, pad, pw, ph = pill_layer(pill, 54 if self.fmt == '916' else 50)
            ytop = base0 + (len(lines) - 1) * lh + size * .55
            x = (L['end_tx'] - pw / 2 if L['end_center'] else L['end_tx']) - pad
            items.append(dict(img=lay, x=x, y=ytop - pad, delay=.75, kind='pill'))
        return items

    # -------------------------------------------------------------- one frame
    def frame(self, fi):
        t = fi / FPS
        si = max(i for i, s in enumerate(self.scenes) if s['t0'] <= t + 1e-6)
        S = self.scenes[si]
        lt = t - S['t0']
        DUR = .24
        if si == 0:
            k = np.ones_like(S['r'])
        else:
            k = np.clip((lt - S['delay']) / DUR, 0, 1)
        r, col = S['r'].copy(), S['col'].copy()
        kk = np.minimum(1, k / .6)
        flash = np.where(k < 1, np.maximum(0, 1 - np.abs(k - .75) / .2), 0)
        r = r * (.55 + .45 * kk)
        col = col * kk[..., None]
        col = col + (WHITE - col) * flash[..., None]
        # twinkle: a few lit LEDs flash softly
        ph = (lt * .9 + S['tw_phase']) % 1.0
        tw = np.where(S['tw_sel'] & (k >= 1), np.maximum(0, 1 - np.abs(ph - .5) / .09), 0) * .7
        col = col + (WHITE - col) * tw[..., None]
        # scene 1: a light pulse rolls out from the subject (life from frame 0, no blank frame)
        if si == 0:
            X = (np.arange(self.nx) + .5) * P; Y = (np.arange(self.ny) + .5) * P
            dd = np.hypot(X[None, :] - S['centre'][0], Y[:, None] - S['centre'][1])
            front = lt * 1400
            pulse = np.exp(-((dd - front) / 90) ** 2) * (lt < 1.4) * .55
            col = col + (WHITE - col) * (pulse * (S['r'] > 0))[..., None] * .6
            r = np.minimum(P / 2 * .96, r * (1 + .12 * pulse))
        # before a cell switches over, it still shows the previous scene's settled LED (dot-by-dot morph)
        if si > 0:
            Pv = self.scenes[si - 1]
            keep = k <= 0
            r = np.where(keep, Pv['r'], r)
            col = np.where(keep[..., None], Pv['col'], col)
        # sprites -> lit layer (premultiplied) + alpha
        idx = np.clip(np.round(r / .05).astype(np.int32), 0, len(self.rad_steps) - 1)
        A = self.spr[idx].transpose(0, 2, 1, 3).reshape(self.H, self.W)
        C = np.repeat(np.repeat(np.clip(col, 0, 255), P, axis=0), P, axis=1)
        lit = (C * A[..., None]).astype(np.float32)
        # camera: slow zoom + drift of the lit layer only (the off-LED board stays put = parallax)
        u = lt / S['dur']
        z = 1.0 + .045 * u
        cx, cy = S['centre']
        dy = -10 * u * (1 if self.fmt == '916' else .7)
        lit_i = Image.fromarray(np.clip(lit, 0, 255).astype(np.uint8))
        A_i = Image.fromarray((A * 255).astype(np.uint8))
        if abs(z - 1) > 1e-4 or dy:
            # inverse map: src = (dst - c - d)/z + c
            coef = (1 / z, 0, cx - (cx + 0) / z, 0, 1 / z, cy - (cy + dy) / z)
            lit_i = lit_i.transform((self.W, self.H), Image.AFFINE, coef, resample=Image.BICUBIC)
            A_i = A_i.transform((self.W, self.H), Image.AFFINE, coef, resample=Image.BICUBIC)
        litf = np.asarray(lit_i, np.float32)
        Af = np.asarray(A_i, np.float32)[..., None] / 255
        out = self.bg * (1 - Af) + litf
        # bloom (two radii), screen blend
        b1 = np.asarray(lit_i.filter(ImageFilter.GaussianBlur(P * .55)), np.float32)
        small = lit_i.resize((self.W // 4, self.H // 4), Image.BILINEAR).filter(ImageFilter.GaussianBlur(P * 2.6 / 4))
        b2 = np.asarray(small.resize((self.W, self.H), Image.BILINEAR), np.float32)
        bloom = np.clip((b1 * .55 + b2 * .6) / 255, 0, 1)
        a = out / 255
        a = 1 - (1 - a) * (1 - bloom)
        img = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).convert('RGBA')
        # copy + pill (slide up + fade in; scene 1 is static from frame 0)
        for it in S['text']:
            if it['delay'] < 0:
                e = 1.0
            else:
                e = ease_out((lt - it['delay']) / (.34 if it['kind'] == 'line' else .3))
            if e <= 0:
                continue
            lay = it['img']
            if it['kind'] == 'pill':
                sc_ = .86 + .14 * e
                lay = lay.resize((int(lay.width * sc_), int(lay.height * sc_)), Image.BICUBIC)
                x = it['x'] + (it['img'].width - lay.width) / 2; y = it['y'] + (it['img'].height - lay.height) / 2
            else:
                x, y = it['x'], it['y'] + 36 * (1 - e)
            if e < 1:
                lay = lay.copy(); lay.putalpha(lay.getchannel('A').point(lambda v: int(v * e)))
            img.alpha_composite(lay, (int(round(x)), int(round(y))))
        lx, ly, _ = self.L['logo']
        img.alpha_composite(self.logo, (lx, ly))
        return np.asarray(img.convert('RGB'))


_M = None


def _work(fi):
    return _M.frame(fi).tobytes()


def build_audio(spec, total, out):
    m = spec.get('music')
    if not m:
        return None
    src = rp(m['path'])
    fo = max(.8, min(1.8, total * .12))
    af = f"afade=t=in:d=0.06,afade=t=out:st={total - fo:.2f}:d={fo:.2f}"
    tmp = out.with_suffix('.pre.wav')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(m.get('start', 0)), '-t', f'{total:.3f}', '-i', str(src),
                    '-af', af, '-ar', '48000', '-ac', '2', str(tmp)], check=True)
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(tmp), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json',
                        '-f', 'null', '-'], capture_output=True, text=True)
    js = json.loads(r.stderr[r.stderr.rindex('{'):r.stderr.rindex('}') + 1])
    ln = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:"
          f"measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(tmp), '-af', ln + ',aresample=48000',
                    '-c:a', 'aac', '-b:a', '192k', str(out)], check=True)
    tmp.unlink()
    return out


def render(spec, fmt, out, audio, tiktok=False, fast=False):
    global _M
    _M = Movie(spec, fmt, tiktok)
    W, H, n = _M.W, _M.H, _M.n
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-']
    if audio:
        cmd += ['-i', str(audio), '-map', '0:v', '-map', '1:a', '-c:a', 'copy']
    cmd += ['-c:v', 'libx264', '-preset', 'veryfast' if fast else 'slow', '-crf', '17', '-pix_fmt', 'yuv420p',
            '-profile:v', 'high', '-r', str(FPS), '-movflags', '+faststart', '-shortest', str(out)]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with Pool(os.cpu_count() or 2) as pool:
        for i, fr in enumerate(pool.imap(_work, range(n), chunksize=2)):
            p.stdin.write(fr)
            if i % 60 == 0:
                print(f'  {fmt}{" tt" if tiktok else ""} frame {i}/{n}', flush=True)
    p.stdin.close(); p.wait()
    if p.returncode:
        raise SystemExit('ffmpeg failed')
    return _M


def contact(video, out, cols=6, every=.5, tw=None):
    d = Path(tempfile.mkdtemp())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(video), '-vf', f'fps={1 / every}', str(d / 'c%03d.jpg')], check=True)
    fr = sorted(d.glob('c*.jpg'))
    im0 = Image.open(fr[0]); tw = tw or (300 if im0.width < im0.height else 480)
    th = int(im0.height * tw / im0.width)
    rows = math.ceil(len(fr) / cols)
    sheet = Image.new('RGB', (cols * (tw + 8) + 8, rows * (th + 30) + 8), (30, 32, 31))
    dr = ImageDraw.Draw(sheet); f = font(20, 600)
    for i, p in enumerate(fr):
        x, y = 8 + (i % cols) * (tw + 8), 8 + (i // cols) * (th + 30)
        sheet.paste(Image.open(p).resize((tw, th), Image.LANCZOS), (x, y + 22))
        dr.text((x, y), f'{i * every:.1f}s', font=f, fill=(200, 200, 200))
    sheet.save(out, quality=88)


def safezones(cover, out):
    im = Image.open(cover).convert('RGBA')
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    d.rectangle([0, 0, 1080, 220], fill=(255, 0, 0, 70)); d.rectangle([0, 1480, 1080, 1920], fill=(255, 0, 0, 70))
    d.rectangle([920, 700, 1080, 1480], fill=(255, 0, 0, 70))
    Image.alpha_composite(im, ov).convert('RGB').save(out, quality=88)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('spec')
    ap.add_argument('--only', default='916,169,tt')
    ap.add_argument('--stills', default='', help='comma-separated times (s): write PNG stills only, no video')
    ap.add_argument('--fast', action='store_true')
    a = ap.parse_args()
    spec = json.loads(Path(a.spec).read_text())
    out_dir = rp(spec['out_dir']); out_dir.mkdir(parents=True, exist_ok=True)
    only = a.only.split(',')
    if a.stills:
        global _M
        for fmt in [f for f in only if f in LAYOUT]:
            _M = Movie(spec, fmt)
            for ts in a.stills.split(','):
                fi = min(_M.n - 1, int(round(float(ts) * FPS)))
                Image.fromarray(_M.frame(fi)).save(out_dir / f'still_{fmt}_{float(ts):05.2f}.png')
            print('stills ->', out_dir)
        return
    total = sum(float(s.get('dur', 2.0)) for s in spec['scenes'])
    audio = build_audio(spec, total, out_dir / '_music.m4a')
    jobs = [('916', 'v916.mp4', False), ('tt', 'v916_tiktok.mp4', True), ('169', 'v169.mp4', False)]
    for key, name, tt in jobs:
        if key not in only:
            continue
        fmt = '916' if key == 'tt' else key
        render(spec, fmt, out_dir / name, audio, tiktok=tt, fast=a.fast)
        if key == '916':
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(out_dir / name), '-frames:v', '1', '-q:v', '2',
                            str(out_dir / 'cover.jpg')], check=True)
            contact(out_dir / name, out_dir / 'contact_916.jpg')
            safezones(out_dir / 'cover.jpg', out_dir / 'safezones.jpg')
        if key == '169':
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(out_dir / name), '-frames:v', '1', '-q:v', '2',
                            str(out_dir / 'cover_169.jpg')], check=True)
            contact(out_dir / name, out_dir / 'contact_169.jpg', cols=5)
        print('ok', out_dir / name)
    if audio and audio.exists():
        audio.unlink()


if __name__ == '__main__':
    main()
