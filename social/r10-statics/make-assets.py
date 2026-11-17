"""Derived portrait assets for the six Ronaldinho ambassador statics (social/r10-statics/render.mjs).
Input: full-res keyed stills from the original Hotcoin shoot (real footage only, per the team's ambassador rule):
  python3 hotcoin-tradfi/scripts/make-r10-key.py --cutout 0.02 2.56 5.62   (run inside hotcoin-tradfi/)
Output (gitignored) in social/r10-statics/assets/:
  col_<t>.png   colour cutout, trimmed
  bw_<t>.png    soft black-and-white (gentle curve, no crushed jaw shadow)
  ht_<t>.png    lime halftone dots on transparent (screen-print look)
  riso_<t>.png  black stochastic grain on transparent (risograph look); riso2_<t>.png the green plate
  led_<t>.png   dot-matrix (stadium board) version
"""
import os, numpy as np, cv2

SRC = 'hotcoin-tradfi/public/ronaldinho/stills'
OUT = 'social/r10-statics/assets'
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(3)

def load(t):
    im = cv2.imread(f'{SRC}/cut_{t}.png', cv2.IMREAD_UNCHANGED).astype(np.float32) / 65535
    rgba = np.dstack([im[..., 2], im[..., 1], im[..., 0], im[..., 3]])
    a = rgba[..., 3]
    ys, xs = np.where(a > 0.08)
    return rgba[ys.min():, max(0, xs.min() - 4):xs.max() + 4]

def save(name, rgba):
    x = (np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8)
    cv2.imwrite(f'{OUT}/{name}', cv2.cvtColor(x, cv2.COLOR_RGBA2BGRA))

def lum(rgb):
    return 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]

def local_lum(rgb):
    """Luminance with local contrast (CLAHE) for the screened looks: brings out eyes, glasses and smile
    without a global lift, so his skin tone is not lightened."""
    l8 = (np.clip(lum(rgb), 0, 1) * 255).astype(np.uint8)
    c = cv2.createCLAHE(clipLimit=2.2, tileGridSize=(10, 10)).apply(l8).astype(np.float32) / 255
    return 0.55 * c + 0.45 * lum(rgb)

def soft_bw(rgb):
    l = lum(rgb)
    l = cv2.GaussianBlur(l, (0, 0), 0.6)
    # lift shadows with a gentle filmic curve, keep highlights (white shirt) from clipping
    l = np.clip(l * 1.08, 0, 1) ** 0.86
    l = 0.03 + 0.94 * l
    return np.repeat(l[..., None], 3, -1)

def halftone(rgb, a, cell, color, angle=45):
    """Classic AM halftone: dot radius ~ sqrt(brightness) on a rotated grid. Returns RGBA."""
    h, w = a.shape
    l = cv2.GaussianBlur(local_lum(rgb), (0, 0), cell * 0.35)
    l = np.clip((l - 0.03) / 0.8, 0, 1) ** 0.85
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    th = np.deg2rad(angle)
    u = (xx * np.cos(th) + yy * np.sin(th)) / cell
    v = (-xx * np.sin(th) + yy * np.cos(th)) / cell
    du = (u - np.round(u)); dv = (v - np.round(v))
    d = np.sqrt(du ** 2 + dv ** 2)                  # 0 at cell centre, ~0.707 at corner
    r = np.sqrt(l) * 0.62
    dots = np.clip((r - d) * cell * 0.9, 0, 1)      # anti-aliased dot edge
    out = np.zeros((h, w, 4), np.float32)
    out[..., :3] = color
    out[..., 3] = dots * np.clip(a * 1.2, 0, 1)
    return out

def grain(rgb, a, color, gamma=1.0, scale=1):
    """Stochastic (riso) screen: ink where darker than blue-ish noise threshold."""
    h, w = a.shape
    l = np.clip(cv2.GaussianBlur(local_lum(rgb), (0, 0), 0.8), 0, 1) ** gamma
    n = rng.random((h // scale + 1, w // scale + 1)).astype(np.float32)
    n = cv2.resize(n, (w, h), interpolation=cv2.INTER_NEAREST)[:h, :w]
    ink = (l < n * 0.95).astype(np.float32)
    out = np.zeros((h, w, 4), np.float32); out[..., :3] = color; out[..., 3] = ink * (a > 0.5)
    return out

def led(rgb, a, cell, on, off):
    h, w = a.shape
    gh, gw = h // cell, w // cell
    small_l = cv2.resize(local_lum(rgb), (gw, gh), interpolation=cv2.INTER_AREA)
    small_a = cv2.resize(a, (gw, gh), interpolation=cv2.INTER_AREA)
    out = np.zeros((gh * cell, gw * cell, 4), np.float32)
    yy, xx = np.mgrid[0:cell, 0:cell].astype(np.float32)
    disc = np.clip((cell * 0.42 - np.sqrt((xx - cell / 2 + .5) ** 2 + (yy - cell / 2 + .5) ** 2)) * 1.5, 0, 1)
    for j in range(gh):
        for i in range(gw):
            if small_a[j, i] < 0.5: continue
            v = np.clip((small_l[j, i] - 0.03) / 0.75, 0, 1) ** 0.85
            col = np.array(off) * (1 - v) + np.array(on) * v
            out[j * cell:(j + 1) * cell, i * cell:(i + 1) * cell, :3] = col
            out[j * cell:(j + 1) * cell, i * cell:(i + 1) * cell, 3] = disc * (0.35 + 0.65 * v)
    return out

LIME = np.array([0xB8, 0xF2, 0x6A]) / 255
GREEN = np.array([0x7E, 0xC2, 0x5A]) / 255
INK = np.array([0x0B, 0x0E, 0x11]) / 255

for t in ['0.02', '2.56', '5.62']:
    im = load(t); rgb, a = im[..., :3], im[..., 3]
    save(f'col_{t}.png', im)
    save(f'bw_{t}.png', np.dstack([soft_bw(rgb), a]))
    if t == '2.56':
        save(f'ht_{t}.png', halftone(rgb, a, 12, LIME))
        save(f'led_{t}.png', led(rgb, a, 14, [0.9, 1.0, 0.78], [0.10, 0.22, 0.09]))
    if t == '5.62':
        save(f'riso_{t}.png', grain(rgb, a, INK, gamma=0.75, scale=2))
        save(f'riso2_{t}.png', grain(rgb, a, GREEN, gamma=0.9, scale=2))
    print('assets', t, im.shape)
