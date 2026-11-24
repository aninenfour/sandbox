# Usage (from social/events-daily): python3 proto/cutout-solid.py <slug> [...] -> art/solid-<slug>.png (needs rembg[cpu], opencv)
# Solid cutout: rembg mask with interior holes filled, so dark glass stays opaque (no lost elements).
import sys, numpy as np, cv2
from rembg import remove, new_session
from PIL import Image
s = new_session('isnet-general-use')
for slug in sys.argv[1:]:
    im = Image.open(f'art/hero-{slug}.png').convert('RGB'); im.thumbnail((1600, 1600))
    a = np.array(remove(im, session=s, only_mask=True, post_process_mask=True))
    m = (a > 40).astype(np.uint8) * 255
    arr = np.array(im).astype(np.int16); bg = np.median(np.concatenate([arr[:8].reshape(-1,3), arr[-8:].reshape(-1,3), arr[:,:8].reshape(-1,3), arr[:,-8:].reshape(-1,3)]), axis=0)
    diff = (np.abs(arr - bg).max(axis=2) > 14).astype(np.uint8) * 255
    diff = cv2.morphologyEx(diff, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    m = m | diff
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41)))
    h, w = m.shape; ff = m.copy(); msk = np.zeros((h + 2, w + 2), np.uint8)
    cv2.floodFill(ff, msk, (0, 0), 255)
    m = m | cv2.bitwise_not(ff)                       # fill holes
    m = cv2.GaussianBlur(m, (0, 0), 1.5)
    rgba = np.dstack([np.array(im), m]); out = Image.fromarray(rgba, 'RGBA'); out = out.crop(out.getbbox())
    out.save(f'art/solid-{slug}.png'); print(slug, out.size)
