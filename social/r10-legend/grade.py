"""Grades the 8 milestone photos into one Hotcoin tritone (ink shadows, deep green mids, lime-white highlights)
and crops them to 2160x2700 (4:5 at 2x). Photos: Unsplash (see hotcoin-tradfi/FOOTAGE_CREDITS.md), in assets/.
Run from the repo root: python3 social/r10-legend/grade.py"""
import numpy as np, cv2

A = 'social/r10-legend/assets'
W, H = 2160, 2700
# per-photo vertical focus (0 = keep top, 1 = keep bottom)
ZOOM = {'p07': 1.5}
GAIN = {'p05': 1.7, 'p07': 1.6}   # lift the two night photos so the subject reads
FOCUS = {'p01': 0.7, 'p02': 0.35, 'p03': 0.5, 'p04': 0.2, 'p05': 0.5, 'p06': 0.5, 'p07': 0.15, 'p08': 0.5}
STOPS = np.array([[0.00, 4, 9, 7], [0.35, 14, 44, 28], [0.70, 92, 150, 84], [1.00, 236, 255, 214]], np.float32)  # pos, R, G, B

def tritone(l):
    out = np.zeros(l.shape + (3,), np.float32)
    for c in range(3):
        out[..., c] = np.interp(l, STOPS[:, 0], STOPS[:, c + 1])
    return out

for k, fy in FOCUS.items():
    im = cv2.imread(f'{A}/{k}.jpg').astype(np.float32) / 255
    h, w = im.shape[:2]
    s = max(W / w, H / h) * ZOOM.get(k, 1)
    im = cv2.resize(im, (int(w * s + 0.5), int(h * s + 0.5)), interpolation=cv2.INTER_AREA)
    h, w = im.shape[:2]
    y0 = int((h - H) * fy); x0 = (w - W) // 2
    im = im[y0:y0 + H, x0:x0 + W]
    l = np.clip((0.299 * im[..., 2] + 0.587 * im[..., 1] + 0.114 * im[..., 0]) * GAIN.get(k, 1), 0, 1)
    l8 = (np.clip(l, 0, 1) * 255).astype(np.uint8)
    l = cv2.createCLAHE(clipLimit=1.6, tileGridSize=(8, 8)).apply(l8).astype(np.float32) / 255
    l = np.clip((l - 0.04) / 0.92, 0, 1) ** 1.08
    g = tritone(l)
    cv2.imwrite(f'{A}/{k}_g.jpg', g[..., ::-1].astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 93])
    print('graded', k)
