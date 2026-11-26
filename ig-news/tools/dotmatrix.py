#!/usr/bin/env python3
"""Dot-matrix / LED-board renderer in Hotcoin style (green LED dots on graphite, or dark dots on brand green).

Library use (see ig-news/research/2026-W48/dotmatrix/make_concepts.py):
    from dotmatrix import Board, load_subject, svg_to_png
    b = Board(1080, 1350, pitch=12)
    b.place(load_subject('photo.jpg', rembg=True), cx=540, cy=700, h=1000)   # subject -> luminance field
    b.candles(rect, series); b.line(points); b.dot_text('BTC/USDT', xy, 40)  # trading elements, also in dots
    img = b.render(bg='dark')               # 'dark' (primary) or 'green' (alt)
    b.copy(img, 'Short line', xy); b.logo(img, 'tl')
CLI (quick single image):
    python3 ig-news/tools/dotmatrix.py in.jpg out.png [--rembg] [--pitch 12] [--shape round|square]
           [--bg dark|green] [--text "Short line"] [--size 1080x1350]

How it works: everything (photo cut-outs, candles, lines, dotted labels) is first painted into a single
float "source" field (value = brightness 0..1, alpha = coverage). render() samples that field on a fixed
grid, so every element shares the same LED grid. Each cell becomes one dot whose size and brightness come
from the cell's value, quantised to a few LED levels. Unlit cells show a faint "off" LED. A two-radius
bloom makes lit dots read as light. The top few % of cells become white "hot" dots.
"""
import argparse, os, sys, random
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
GREEN = (126, 194, 90)          # #7EC25A, the green in assets/symbol.svg and the templates
GRAPHITE = (9, 11, 10)          # primary background
FONT_ARCHIVO = str(ASSETS / 'fonts' / 'Archivo.ttf')
FONT_MANROPE = str(ASSETS / 'fonts' / 'Manrope.ttf')


# ---------------------------------------------------------------- inputs
def svg_to_png(svg_path, size, out=None):
    """Rasterise an SVG (real brand assets) with the same headless Chromium render.py uses."""
    from playwright.sync_api import sync_playwright
    svg = Path(svg_path).read_text()
    out = out or f'/tmp/_dm_{Path(svg_path).stem}_{size}.png'
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = b.new_page(viewport={'width': size, 'height': size})
        pg.set_content('<html><body style="margin:0;background:transparent">'
                       f'<div style="width:{size}px;height:{size}px">{svg}</div>'
                       '<style>svg{width:100%;height:100%;display:block}</style></body></html>')
        pg.screenshot(path=out, omit_background=True)
        b.close()
    im = Image.open(out).convert('RGBA')
    return im.crop(im.getbbox()) if im.getbbox() else im


def load_subject(path, rembg=False, model='isnet-general-use', keep_largest=True, max_side=1600, crop=True):
    """Return an RGBA cut-out. rembg=True removes the background (model 'u2net_human_seg' is best for people)."""
    im = Image.open(path)
    im.thumbnail((max_side, max_side))
    if rembg:
        from rembg import remove, new_session
        im = remove(im.convert('RGB'), session=new_session(model))
    im = im.convert('RGBA')
    if keep_largest:
        im = _keep_largest(im)
    bb = im.getbbox()
    return im.crop(bb) if (bb and crop) else im


def _keep_largest(im, min_frac=0.02):
    """Drop stray blobs the matting model kept (studio lamps etc.); keep components >= min_frac of the largest."""
    a = np.array(im.getchannel('A')) > 100
    try:
        from scipy import ndimage
        lab, n = ndimage.label(a)
    except ImportError:
        return im
    if n <= 1:
        return im
    sizes = np.bincount(lab.ravel())[1:]
    keep = np.isin(lab, np.where(sizes >= sizes.max() * min_frac)[0] + 1)
    keep = np.array(Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
    arr = np.array(im); arr[..., 3] = np.where(keep, arr[..., 3], 0)
    return Image.fromarray(arr)


def _blur(a, r):
    if r <= 0:
        return a
    from scipy.ndimage import gaussian_filter
    return gaussian_filter(a.astype(np.float32), r)


# ---------------------------------------------------------------- board
class Board:
    def __init__(self, W=1080, H=1350, pitch=12, shape='round', seed=7):
        self.W, self.H, self.p, self.shape = W, H, pitch, shape
        self.val = np.zeros((H, W), np.float32)   # brightness 0..1
        self.cov = np.zeros((H, W), np.float32)   # coverage 0..1
        self.hot = np.zeros((H, W), np.float32)   # 1 = force white "hot" dot
        self.fade = np.ones((H, W), np.float32)   # <1 = dots shrink, dim and drop out (soft edges)
        self.rng = random.Random(seed)

    def _paint(self, val, cov, x0, y0, hot=None):
        h, w = val.shape
        xa, ya, xb, yb = max(0, x0), max(0, y0), min(self.W, x0 + w), min(self.H, y0 + h)
        if xa >= xb or ya >= yb:
            return
        sv, sc = val[ya - y0:yb - y0, xa - x0:xb - x0], cov[ya - y0:yb - y0, xa - x0:xb - x0]
        dv, dc = self.val[ya:yb, xa:xb], self.cov[ya:yb, xa:xb]
        dv[:] = sv * sc + dv * (1 - sc)
        dc[:] = np.maximum(dc, sc)
        if hot is not None:
            self.hot[ya:yb, xa:xb] = np.maximum(self.hot[ya:yb, xa:xb], hot[ya - y0:yb - y0, xa - x0:xb - x0] * sc)

    def fade_edge(self, y0, y1):
        """Soft LED dissolve between y0 (full) and y1 (gone), for subjects cropped by the frame."""
        ramp = np.clip((y1 - np.arange(self.H)) / max(1, y1 - y0), 0, 1).astype(np.float32)[:, None]
        self.fade = np.minimum(self.fade, np.broadcast_to(ramp, self.fade.shape))

    def place(self, rgba, cx, cy, h=None, w=None, floor=0.16, detail=1.2, gamma=0.9, lo=2, hi=99.5, shade=None,
              lum='mix', equalize=0.0):
        """Paint a cut-out. Luminance is stretched inside the subject, detail-boosted (local contrast at
        ~2 dot pitches), then lifted by `floor` so dark clothes/skin still show as dim dots (silhouette reads).
        shade: optional fn(x01, y01) -> multiplier for a light direction."""
        s = (h / rgba.height) if h else (w / rgba.width)
        im = rgba.resize((max(1, int(rgba.width * s)), max(1, int(rgba.height * s))), Image.LANCZOS)
        arr = np.asarray(im, np.float32) / 255
        L = arr[..., 0] * .299 + arr[..., 1] * .587 + arr[..., 2] * .114
        if lum == 'mix':    # luma + HSV value: saturated colours (a red shirt) stay readable
            L = .5 * L + .5 * arr[..., :3].max(axis=2)
        A = arr[..., 3]
        m = A > .5
        if equalize and m.sum() > 50:   # rank-equalise inside the subject: full range of dot sizes on dark photos
            r = np.zeros_like(L); idx = np.argsort(L[m], kind='stable')
            rk = np.empty(idx.size, np.float32); rk[idx] = np.linspace(0, 1, idx.size)
            r[m] = rk; L = np.where(m, equalize * r + (1 - equalize) * L, L)
        if m.sum() > 50:
            a, b = np.percentile(L[m], lo), np.percentile(L[m], hi)
            L = np.clip((L - a) / max(1e-3, b - a), 0, 1)
        if detail:
            base = _blur(L * A, self.p * 2) / np.maximum(_blur(A, self.p * 2), 1e-3)
            L = np.clip(L + detail * (L - base), 0, 1)
        L = L ** gamma
        if shade:
            yy, xx = np.mgrid[0:L.shape[0], 0:L.shape[1]]
            L = np.clip(L * shade(xx / L.shape[1], yy / L.shape[0]), 0, 1)
        L = floor + (1 - floor) * L
        self._paint(L, A, int(cx - im.width / 2), int(cy - im.height / 2))
        return (int(cx - im.width / 2), int(cy - im.height / 2), im.width, im.height)

    def _draw_layer(self, fn, value=1.0, hot=False):
        layer = Image.new('L', (self.W, self.H), 0)
        fn(ImageDraw.Draw(layer))
        c = np.asarray(layer, np.float32) / 255
        self._paint(np.full_like(c, value), c, 0, 0, hot=(c if hot else None))

    def candles(self, rect, series, up=1.0, down=0.42, body=0.62, wick=None):
        """series: list of (open, high, low, close) in any units; drawn inside rect=(x,y,w,h).
        Up candles are full-bright, down candles dim, so the colour stays one green family."""
        x, y, w, h = rect
        lo_, hi_ = min(c[2] for c in series), max(c[1] for c in series)
        sy = lambda v: y + h - (v - lo_) / (hi_ - lo_) * h
        step = w / len(series)
        wick = wick or max(2, self.p // 3)
        for i, (o, hh, ll, c) in enumerate(series):
            cx = x + step * (i + .5)
            bw = step * body
            v = up if c >= o else down
            self._draw_layer(lambda d: (d.rectangle([cx - wick / 2, sy(hh), cx + wick / 2, sy(ll)], fill=255),
                                        d.rectangle([cx - bw / 2, sy(max(o, c)), cx + bw / 2, sy(min(o, c)) + 1], fill=255)), v)
        return sy

    def line(self, pts, width=None, value=1.0, hot=False):
        width = width or self.p
        self._draw_layer(lambda d: d.line(pts, fill=255, width=int(width), joint='curve'), value, hot)

    def dashed(self, p0, p1, value=.35, width=None, every=3):
        """A dotted guide line (support/resistance): every n-th cell lit."""
        width = width or self.p
        (x0, y0), (x1, y1) = p0, p1
        n = int(max(abs(x1 - x0), abs(y1 - y0)) / self.p)
        for i in range(0, n, every):
            t = i / max(1, n)
            px, py = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
            self._draw_layer(lambda d: d.rectangle([px, py - width / 2, px + self.p * .8, py + width / 2], fill=255), value)

    def dot_text(self, text, xy, size, value=1.0, font=FONT_ARCHIVO, weight=800, anchor='la', hot=False):
        """Text rendered INTO the grid (LED marquee look). Use >= 4-5 pitches of cap height to stay legible."""
        f = ImageFont.truetype(font, size)
        try:
            f.set_variation_by_axes([weight, 100] if 'Archivo' in font else [weight])
        except Exception:
            pass
        self._draw_layer(lambda d: d.text(xy, text, font=f, fill=255, anchor=anchor), value, hot)

    def shape_mask(self, rgba, cx, cy, h, value=1.0, hot=False):
        """Flat-fill any RGBA shape (e.g. a logo glyph) into the grid at one brightness."""
        s = h / rgba.height
        im = rgba.resize((int(rgba.width * s), int(h)), Image.LANCZOS)
        A = np.asarray(im.getchannel('A'), np.float32) / 255
        self._paint(np.full_like(A, value), A, int(cx - im.width / 2), int(cy - im.height / 2), hot=(A if hot else None))

    # ------------------------------------------------------------ render
    def cells(self):
        """Per-cell (cx, cy, value, coverage, hot). Grid is centred on the canvas."""
        p = self.p
        nx, ny = self.W // p, self.H // p
        ox, oy = (self.W - nx * p) // 2, (self.H - ny * p) // 2
        crop = lambda a: a[oy:oy + ny * p, ox:ox + nx * p].reshape(ny, p, nx, p)
        C = crop(self.cov).mean(axis=(1, 3))
        V = (crop(self.val) * crop(self.cov)).sum(axis=(1, 3)) / np.maximum(crop(self.cov).sum(axis=(1, 3)), 1e-3)
        Hh = crop(self.hot).max(axis=(1, 3))
        F = crop(self.fade).mean(axis=(1, 3))
        ys, xs = np.mgrid[0:ny, 0:nx]
        return (ox + (xs + .5) * p, oy + (ys + .5) * p, V, C, Hh, F)

    def render(self, bg='dark', levels=6, min_cov=.38, smin=.22, smax=.94, hot_frac=.035, hot_keep=.45,
               glow=1.0, off_leds=True, reveal=None, ss=3, out_size=None):
        """bg='dark': green LEDs on graphite with bloom. bg='green': dark ink dots on brand green, no bloom.
        reveal: optional (ny, nx) array 0..1 per cell for animation (0 = off, 1 = settled; a short
        white flash happens around 0.6-0.9)."""
        p = self.p
        X, Y, V, C, Hh, F = self.cells()
        rng = np.random.default_rng(3)
        on = (C >= min_cov) & (rng.random(V.shape) < F ** .8)
        V = V * (.35 + .65 * F)
        q = np.clip(np.round(V * (levels - 1)) / (levels - 1), 0, 1)        # LED brightness steps
        thr = np.quantile(V[on], 1 - hot_frac) if (on.sum() > 20 and hot_frac > 0) else 2
        hot = on & (((V >= thr) & (rng.random(V.shape) < hot_keep)) | (Hh > .5))
        W, H = self.W, self.H
        S = ss
        dark = bg == 'dark'
        base = GRAPHITE if dark else GREEN
        canvas = Image.new('RGB', (W * S, H * S), base)
        lit = Image.new('RGB', (W * S, H * S), (0, 0, 0))     # emissive layer (for bloom)
        dc, dl = ImageDraw.Draw(canvas), ImageDraw.Draw(lit)
        ink = np.array((14, 26, 11), np.float32)
        g = np.array(GREEN, np.float32)
        deep = np.array((36, 74, 26), np.float32)
        mint = np.array((196, 242, 160), np.float32)
        white = np.array((244, 255, 236), np.float32)

        def dot(d, x, y, r, col):
            x, y, r = x * S, y * S, r * S
            if self.shape == 'square':
                d.rounded_rectangle([x - r, y - r, x + r, y + r], radius=r * .28, fill=col)
            else:
                d.ellipse([x - r, y - r, x + r, y + r], fill=col)

        off_col = tuple(int(c) for c in (np.array(base, np.float32) * (1 if dark else .86) + (np.array((15, 21, 16)) if dark else 0)))
        ny, nx = V.shape
        for j in range(ny):
            for i in range(nx):
                x, y = X[j, i], Y[j, i]
                k = 1.0 if reveal is None else float(reveal[j, i])
                if off_leds:
                    dot(dc, x, y, p * .20, off_col)
                if not on[j, i] or k <= 0:
                    continue
                v = q[j, i]
                flash = 0.0
                if reveal is not None:
                    flash = max(0.0, 1 - abs(k - .75) / .2) if k < 1 else 0.0
                    kk = min(1.0, k / .6)
                else:
                    kk = 1.0
                r = p / 2 * (smin + (smax - smin) * v ** .85) * (.55 + .45 * kk)
                if dark:
                    col = deep + (g - deep) * min(1, v / .75) if v < .75 else g + (mint - g) * (v - .75) / .25 * .55
                    col = col * (.42 + .58 * v)
                    if hot[j, i]:
                        col, r = white, max(r, p / 2 * .9)
                    col = col * kk + (white - col * kk) * flash
                    col = tuple(int(c) for c in np.clip(col, 0, 255))
                    dot(dc, x, y, r, col); dot(dl, x, y, r, col)
                else:
                    col = np.array(base, np.float32) + (ink - np.array(base, np.float32)) * (.55 + .45 * v) * kk
                    if hot[j, i]:
                        col = white
                    dot(dc, x, y, r, tuple(int(c) for c in col))
        out = canvas.resize((W, H), Image.LANCZOS)
        if dark and glow:
            lit = lit.resize((W, H), Image.LANCZOS)
            a = np.asarray(out, np.float32) / 255
            b1 = np.asarray(lit.filter(ImageFilter.GaussianBlur(p * .55)), np.float32) / 255
            b2 = np.asarray(lit.filter(ImageFilter.GaussianBlur(p * 2.6)), np.float32) / 255
            bloom = np.clip(b1 * .55 * glow + b2 * .55 * glow, 0, 1)
            a = 1 - (1 - a) * (1 - bloom)                     # screen
            out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
        if out_size:
            out = out.resize(out_size, Image.LANCZOS)
        return out

    # ------------------------------------------------------------ overlays (crisp, not dotted)
    @staticmethod
    def copy(img, text, xy, size=64, color=(255, 255, 255), weight=700, anchor='la', accent=None,
             shadow=True, font=FONT_ARCHIVO, width_axis=100, line_gap=1.05):
        """Clean headline in our font. accent=(word, rgb) colours one word. Soft dark halo keeps it
        readable over glowing dots."""
        f = ImageFont.truetype(font, size)
        try:
            f.set_variation_by_axes([weight, width_axis] if 'Archivo' in font else [weight])
        except Exception:
            pass
        lines = text.split('\n')
        if shadow:
            sh = Image.new('L', img.size, 0); ds = ImageDraw.Draw(sh)
            for n, ln in enumerate(lines):
                ds.text((xy[0], xy[1] + n * size * line_gap), ln, font=f, fill=255, anchor=anchor)
            sh = sh.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(size * .35))
            dark = Image.new('RGB', img.size, (0, 0, 0))
            img.paste(dark, (0, 0), sh.point(lambda v: int(v * .78)))
        d = ImageDraw.Draw(img)
        for n, ln in enumerate(lines):
            y = xy[1] + n * size * line_gap
            if accent and accent[0] in ln:
                pre, post = ln.split(accent[0], 1)
                x = xy[0]
                if anchor[0] == 'm':
                    x -= d.textlength(ln, font=f) / 2
                a2 = 'l' + anchor[1]
                for part, colr in ((pre, color), (accent[0], accent[1]), (post, color)):
                    d.text((x, y), part, font=f, fill=colr, anchor=a2); x += d.textlength(part, font=f)
            else:
                d.text((xy[0], y), ln, font=f, fill=color, anchor=anchor)
        return img

    @staticmethod
    def logo(img, corner='tl', height=36, margin=64, dark=False):
        """Real Hotcoin wordmark (assets/logo-official-white.png); dark=True recolours it to ink for green bg."""
        lg = Image.open(ASSETS / 'logo-official-white.png').convert('RGBA')
        lg = lg.resize((int(lg.width * height / lg.height), height), Image.LANCZOS)
        if dark:
            r = Image.new('RGBA', lg.size, (14, 26, 11, 255)); r.putalpha(lg.getchannel('A')); lg = r
        W, H = img.size
        x = margin if corner[1] == 'l' else W - margin - lg.width
        y = margin if corner[0] == 't' else H - margin - lg.height
        img.paste(lg, (x, y), lg)
        return img

    @staticmethod
    def symbol(img, corner='br', size=64, margin=64, svg='symbol.svg'):
        """Real Hotcoin symbol (assets/symbol.svg, white slash + green dot)."""
        sym = svg_to_png(ASSETS / svg, 512)
        sym = sym.resize((int(sym.width * size / sym.height), size), Image.LANCZOS)
        W, H = img.size
        x = margin if corner[1] == 'l' else W - margin - sym.width
        y = margin if corner[0] == 't' else H - margin - sym.height
        img.paste(sym, (x, y), sym)
        return img


# ---------------------------------------------------------------- CLI
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('src'); ap.add_argument('out')
    ap.add_argument('--rembg', action='store_true'); ap.add_argument('--model', default='isnet-general-use')
    ap.add_argument('--pitch', type=int, default=12); ap.add_argument('--shape', default='round', choices=['round', 'square'])
    ap.add_argument('--bg', default='dark', choices=['dark', 'green'])
    ap.add_argument('--size', default='1080x1350'); ap.add_argument('--fill', type=float, default=.72, help='subject height / canvas height')
    ap.add_argument('--text', default=''); ap.add_argument('--no-logo', action='store_true')
    a = ap.parse_args()
    W, H = map(int, a.size.split('x'))
    b = Board(W, H, a.pitch, a.shape)
    subj = load_subject(a.src, rembg=a.rembg, model=a.model)
    hh = H * a.fill
    if subj.width * hh / subj.height > W * .9:
        b.place(subj, W / 2, H * .52, w=W * .9)
    else:
        b.place(subj, W / 2, H * .52, h=hh)
    img = b.render(bg=a.bg)
    if a.text:
        Board.copy(img, a.text, (W / 2, H - 170), 70, color=(255, 255, 255) if a.bg == 'dark' else (14, 26, 11),
                   anchor='ms', shadow=a.bg == 'dark')
    if not a.no_logo:
        Board.logo(img, 'tl', dark=a.bg == 'green')
    img.save(a.out)
    print(a.out)


if __name__ == '__main__':
    main()
