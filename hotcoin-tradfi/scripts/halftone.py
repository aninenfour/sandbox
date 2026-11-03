# Turns each Uptober photo into a newsprint halftone: ink dots on a transparent background (AM screen at 45 degrees).
import glob, numpy as np
from PIL import Image, ImageOps, ImageDraw, ImageFilter
CELL = 9  # dot pitch in px at 1200 px width
for f in sorted(glob.glob('public/uptober/photos/y*.jpg')):
    im = ImageOps.grayscale(Image.open(f)); im.thumbnail((1200, 1200))
    im = ImageOps.autocontrast(im, cutoff=1)
    w, h = im.size
    big = im.rotate(45, expand=True, fillcolor=255)
    a = np.asarray(big).astype(float) / 255
    W, H = big.size
    S = 3  # supersample for smooth dots
    canvas = Image.new('L', (W * S, H * S), 0); d = ImageDraw.Draw(canvas)
    for y in range(0, H, CELL):
        for x in range(0, W, CELL):
            dark = 1 - a[y:y + CELL, x:x + CELL].mean()
            r = (dark ** 0.85) * CELL * 0.72
            if r > 0.35:
                cx, cy = (x + CELL / 2) * S, (y + CELL / 2) * S
                d.ellipse([cx - r * S, cy - r * S, cx + r * S, cy + r * S], fill=255)
    canvas = canvas.resize((W, H), Image.LANCZOS).rotate(-45, expand=False)
    l, t = (canvas.width - w) // 2, (canvas.height - h) // 2
    mask = canvas.crop((l, t, l + w, t + h))
    out = Image.new('RGBA', (w, h), (27, 26, 23, 0)); out.putalpha(mask)
    out.save(f.replace('.jpg', '-ht.png')); print(f, out.size)
