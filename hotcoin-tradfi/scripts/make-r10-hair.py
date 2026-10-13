# Dot-matrix "long curly hair + headband" sprites for the R10 teaser, styled like the point-cloud scans in the
# reference: uniform dot grid, white highlights, yellow-green mid-tones, red rim on the outer edge.
# Hair = ringlet tubes (each lock its own height field) so curls read as separate shaded locks. Procedural only.
import numpy as np, cv2, math
rng = np.random.default_rng(11)

def lock_field(W, H, locks, base=None):
    hgt = np.zeros((H, W), np.float32) if base is None else base.copy()
    for (x0, y0, L, wd, amp, fq, ph, drift, z) in locks:
        m = np.zeros((H, W), np.uint8)
        pts = [(x0 + drift * t * L + amp * math.sin(ph + t * L * fq), y0 + t * L) for t in np.linspace(0, 1, 160)]
        w = [max(4, int(wd * (1 - 0.55 * t))) for t in np.linspace(0, 1, 160)]
        for i in range(len(pts) - 1):
            cv2.line(m, (int(pts[i][0]), int(pts[i][1])), (int(pts[i + 1][0]), int(pts[i + 1][1])), 255, w[i], cv2.LINE_AA)
        d = cv2.distanceTransform((m > 127).astype(np.uint8), cv2.DIST_L2, 5)
        tube = np.sqrt(np.clip(d / (wd * 0.5), 0, 1)) * 0.6 + z
        tube[m < 128] = 0
        hgt = np.maximum(hgt, tube)
    return hgt

def render(hgt, pitch=4, light=(0.55, -0.75), rim_left=True):
    H, W = hgt.shape
    mask = (hgt > 0.02).astype(np.uint8)
    hx = cv2.Sobel(hgt, cv2.CV_32F, 1, 0, ksize=5); hy = cv2.Sobel(hgt, cv2.CV_32F, 0, 1, ksize=5)
    nz = np.full_like(hgt, 0.35); n = np.sqrt(hx ** 2 + hy ** 2 + nz ** 2)
    lam = np.clip((-hx * light[0] - hy * light[1] + nz * 0.9) / n, 0, 1)
    closed = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((45, 45), np.uint8))
    dist = cv2.distanceTransform(closed, cv2.DIST_L2, 5)
    xs = np.mgrid[0:H, 0:W][1]
    cx = (xs * mask).sum() / max(1, mask.sum())
    rim = (mask > 0) & (dist > 0) & (dist < 9) & ((xs < cx - 60) if rim_left else (xs > cx + 60))
    out = np.zeros((H, W, 4), np.float32)
    for y in range(pitch // 2, H, pitch):
        for x in range(pitch // 2, W, pitch):
            if not mask[y, x]: continue
            l = 0.22 + 0.78 * float(lam[y, x]) * (0.6 + 0.4 * min(1.0, float(hgt[y, x]) * 1.6))
            col = np.array([0.72, 0.86, 0.28]) * (1 - l) + np.array([1.0, 1.0, 1.0]) * l   # RGB
            col = np.clip(col * (0.42 + 0.75 * l), 0, 1)
            if rim[y, x]: col = np.array([1.0, 0.3, 0.12])
            cv2.circle(out, (x, y), 2 if l > 0.35 else 1, (float(col[2]), float(col[1]), float(col[0]), 1.0), -1, cv2.LINE_AA)
    return out

def save(img, path):
    cv2.imwrite(path, (np.clip(img, 0, 1) * 255).astype(np.uint8))

W, H = 1300, 1500
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
CX = W / 2

def band_sprite(y_mid, bend, x0, x1, thick, path):
    m = np.zeros((H, W), np.uint8)
    pts = np.array([(x, y_mid - bend * math.sin(math.pi * (x - x0) / (x1 - x0))) for x in range(int(x0), int(x1) + 1, 4)], np.int32)
    cv2.polylines(m, [pts], False, 255, thick, cv2.LINE_AA)
    d = cv2.distanceTransform((m > 127).astype(np.uint8), cv2.DIST_L2, 5)
    b = np.sqrt(np.clip(d / (thick / 2), 0, 1)) * 0.5 + 0.55; b[m < 128] = 0
    save(render(b, light=(0.2, -0.95)), path)

def crown_sprite(cx, cy, rx, ry, path, n=110):
    dome = np.sqrt(np.clip(1 - ((xx - cx) / rx) ** 2 - ((yy - cy) / ry) ** 2, 0, 1)) * 0.12
    dome[yy > cy + ry * 0.35] = 0
    locks = [(cx + rng.normal(0, rx * 0.55), cy - ry * rng.uniform(0.1, 0.8), rng.uniform(60, 160), rng.uniform(26, 36), 10, 0.07, rng.uniform(0, 6.28), rng.normal(0, 0.3), 0.42) for _ in range(n)]
    save(render(lock_field(W, H, locks, dome)), path)

def falls(roots, Lr, path, rim_left=True, drift=(0.0, 0.1)):
    locks = [(x + rng.normal(0, 14), y + rng.normal(0, 10), rng.uniform(*Lr), rng.uniform(22, 30), rng.uniform(7, 10), rng.uniform(0.09, 0.12), rng.uniform(0, 6.28), rng.uniform(*drift), rng.uniform(0.3, 0.5)) for (x, y) in roots]
    save(render(lock_field(W, H, locks), rim_left=rim_left), path)

# all sprites: band centre at (650, 420); head width about 600 px
crown_sprite(650, 380, 330, 220, 'public/r10/crown.png')
band_sprite(430, 60, 330, 970, 60, 'public/r10/band-front.png')
# three-quarter (face turned to our left): long locks behind the far (right) side, a few at the near temple
falls([(820 + 150 * k / 20, 330 + 40 * k / 20) for k in range(22)], (650, 1000), 'public/r10/q-behind.png', rim_left=False, drift=(0.02, 0.16))
falls([(400 + 30 * k / 4, 420 + 10 * k) for k in range(5)], (300, 520), 'public/r10/q-near.png', drift=(-0.08, 0.0))
# front: locks on both sides (behind the face)
falls([(360 + 60 * k / 10, 380) for k in range(12)] + [(880 + 60 * k / 10, 380) for k in range(12)], (600, 950), 'public/r10/f-behind.png', drift=(-0.06, 0.06))
# profile facing left: band from the brow to behind the ear, locks fall from the back of the head
band_sprite(430, 30, 330, 900, 60, 'public/r10/band-profile.png')
falls([(760 + 260 * k / 25, 300 + 120 * k / 25) for k in range(26)], (700, 1050), 'public/r10/p-behind.png', rim_left=False, drift=(0.02, 0.14))
# back view: long locks over the shoulders + band
# back: long ringlets from the crown and around the head outline, fanning out to the shoulders (no dome)
longl = []
for a in np.linspace(-0.35, math.pi + 0.35, 80):
    x0 = 650 + 280 * math.cos(a) * rng.uniform(0.2, 1.0); y0 = 330 + 120 * math.sin(a) * rng.uniform(0.0, 1.0) + rng.normal(0, 12)
    longl.append((x0, y0, rng.uniform(480, 700), rng.uniform(22, 28), rng.uniform(7, 10), rng.uniform(0.09, 0.12), rng.uniform(0, 6.28), (x0 - 650) / 1400 + rng.normal(0, 0.03), rng.uniform(0.3, 0.5)))
hb = lock_field(W, H, longl)
save(render(hb, rim_left=False), 'public/r10/hair-back.png')
band_sprite(440, -30, 350, 950, 56, 'public/r10/band-back.png')
print('ok')
