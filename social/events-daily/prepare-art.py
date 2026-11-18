# Fetch a campaign's key art from its official announcement banner and crop the 3D object (right side of the 2744x720 banner).
# Usage: python3 social/events-daily/prepare-art.py <slug> [<slug> ...]
# Writes art/<slug>.png (banner) and art/crop-<slug>.png. For a sharp hero, upscale the crop with fal "fal-ai/recraft/upscale/crisp"
# (~$0.004) and save as art/hero-<slug>.png; render.mjs uses hero-*, else falls back to crop-*.
import sys, re, os, urllib.request
import numpy as np
from PIL import Image
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'art'); os.makedirs(D, exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0'}
for slug in sys.argv[1:]:
    html = urllib.request.urlopen(urllib.request.Request(f'https://www.hotcoin.com/en_US/announcement/{slug}/', headers=UA), timeout=30).read().decode('utf-8', 'ignore')
    m = re.search(r'https://img\.hotbtech\.cn/cms/support/[^"\' )]+\.(?:png|jpe?g|webp)', html)
    if not m: print(slug, 'no banner found'); continue
    f = os.path.join(D, f'{slug}.png'); urllib.request.urlretrieve(m.group(0), f)
    im = Image.open(f).convert('RGB'); w, h = im.size
    bg = np.array(im.getpixel((5, 5)))
    a = np.abs(np.array(im).astype(int) - bg).max(2) > 8; col = a.sum(0) > 0
    x = w - 1
    while x > 0 and not col[x]: x -= 1
    right, gap = x, 0
    while x > 0:
        gap = gap + 1 if not col[x] else 0
        if gap >= 40: break
        x -= 1
    left = x + gap; rows = np.where(a[:, left:right + 1].any(1))[0]; p = 24
    im.crop((max(0, left - p), max(0, rows[0] - p), min(w, right + p), min(h, rows[-1] + p))).save(os.path.join(D, f'crop-{slug}.png'))
    print(slug, 'ok, background', tuple(bg))
