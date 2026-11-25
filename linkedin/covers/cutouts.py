#!/usr/bin/env python3
"""Grainy photo cutouts for LinkedIn covers.

Real Unsplash photos (credits in hotcoin-tradfi/FOOTAGE_CREDITS.md) -> background removed with rembg ->
grayscale stipple grain: each pixel becomes a light dot with probability = its brightness, blended with a bit of
the smooth tone so detail survives. Output: RGBA PNGs in covers/cut/ (light dots on transparent, for ink grounds,
and *-ink.png dark dots for white grounds).

Run: python3 linkedin/covers/cutouts.py   (pip install "rembg[cpu]" first)
"""
import os, sys
import numpy as np
from PIL import Image, ImageOps, ImageFilter, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
SRC, OUT = os.path.join(HERE, 'src'), os.path.join(HERE, 'cut')
os.makedirs(OUT, exist_ok=True)

# name: (crop box as fractions l,t,r,b or None, mode)  mode: "rembg" or "circle" (cx, cy, r fractions)
JOBS = {
    'robot':      (None, 'rembg'),
    'headphones': (None, 'rembg'),
    'trophy':     ((0.45, 0.25, 0.95, 1.0), 'rembg'),
    'jar':        (None, 'rembg'),
    'hand':       (None, 'rembg'),
    'scale':      (None, 'rembg'),
    'terminal':   (None, 'rembg'),
    'vault':      ((0.40, 0.635, 0.30), 'circle'),
}


def stipple(rgba, light=True, seed=7):
    a = np.asarray(rgba.split()[-1], dtype=np.float32) / 255
    g = ImageOps.autocontrast(rgba.convert('L'), cutoff=1).filter(ImageFilter.UnsharpMask(2, 120, 2))
    L = np.asarray(g, dtype=np.float32) / 255
    rng = np.random.default_rng(seed)
    # coarse grain: one random threshold per 2x2 block, like a print stipple
    h, w = L.shape
    thr = rng.random(((h + 1) // 2, (w + 1) // 2)).repeat(2, 0).repeat(2, 1)[:h, :w]
    dots = (thr < (L ** 1.25)).astype(np.float32)
    tone = 0.72 * dots + 0.28 * L                      # grain plus some smooth tone
    if light:
        rgb = np.array([234, 238, 230], dtype=np.float32)  # warm white dots on ink
        alpha = a * np.clip(0.18 + 0.82 * tone, 0, 1)
    else:
        rgb = np.array([11, 14, 17], dtype=np.float32)      # ink dots on white
        alpha = a * np.clip(0.12 + 0.88 * (1 - tone), 0, 1)
    out = np.zeros(L.shape + (4,), dtype=np.uint8)
    out[..., :3] = rgb
    out[..., 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def main():
    from rembg import remove, new_session
    sess = new_session('isnet-general-use')
    only = set(sys.argv[1:])
    for name, (box, mode) in JOBS.items():
        if only and name not in only:
            continue
        im = Image.open(os.path.join(SRC, name + '.jpg')).convert('RGB')
        W, H = im.size
        if mode == 'circle':
            cx, cy, r = box
            cx, cy, r = cx * W, cy * H, r * min(W, H)
            im = im.crop((int(cx - r), int(cy - r), int(cx + r), int(cy + r))).convert('RGBA')
            m = Image.new('L', im.size, 0)
            ImageDraw.Draw(m).ellipse((0, 0, im.size[0] - 1, im.size[1] - 1), fill=255)
            im.putalpha(m)
            cut = im
        else:
            if box:
                im = im.crop((int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H)))
            cut = remove(im, session=sess)
        bb = cut.split()[-1].point(lambda v: 255 if v > 20 else 0).getbbox()
        cut = cut.crop(bb)
        cut.thumbnail((1600, 1600))
        cut.save(os.path.join(OUT, name + '-raw.png'))
        stipple(cut, True).save(os.path.join(OUT, name + '.png'))
        stipple(cut, False).save(os.path.join(OUT, name + '-ink.png'))
        print(name, cut.size)


if __name__ == '__main__':
    main()
