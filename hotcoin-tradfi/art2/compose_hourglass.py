# Style 2, piece "logo": moody backdrop behind the rendered 3D tile (art2/tile.html). Output 2160x2700 RGB.
import numpy as np, cv2, sys
W, H = 2160, 2700
tile = cv2.imread(sys.argv[1], cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
out = sys.argv[2]
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
LIME = np.array([106, 242, 184], np.float32) / 255   # BGR
GREEN = np.array([60, 140, 72], np.float32) / 255
DEEP = np.array([18, 52, 24], np.float32) / 255
img = np.zeros((H, W, 3), np.float32) + np.array([6, 8, 5], np.float32) / 255

def disc(cx, cy, r, soft):
    d = np.hypot(xx - cx, yy - cy)
    return np.clip((r - d) / soft + 0.5, 0, 1)
def add(mask, col, a=1.0):
    global img
    img = img * (1 - mask[..., None] * a) + col * mask[..., None] * a

# giant out-of-focus lime disc (the logo's dot, blown up) top-left, a deep green disc bottom-right, a ring
add(disc(1360, 1250, 820, 60), DEEP * 1.1, 1)
add(disc(1360, 1250, 640, 260), GREEN * 0.7, 0.55)
add(disc(1380, 1160, 300, 260), LIME * 0.9, 0.6)
ring = np.clip(1 - np.abs(np.hypot(xx - 1360, yy - 1250) - 1000) / 40, 0, 1)
add(cv2.GaussianBlur(ring, (0, 0), 18), GREEN * 0.55, 0.7)
add(disc(-200, 2800, 500, 120), DEEP * 1.2, 0.9)
# black checker blocks from the right (echo of the tile), heavily defocused
blocks = np.zeros((H, W), np.float32)
for (x0, y0, s) in [(-100, 1500, 520), (200, 2200, 380), (1900, 120, 300)]:
    blocks[y0:y0 + s, x0:x0 + s] = 1
add(cv2.GaussianBlur(blocks, (0, 0), 40), np.array([3, 4, 3], np.float32) / 255, 0.85)
# light streaks on the left (anamorphic, like a lens flare through glass)
streak = np.zeros((H, W), np.float32)
for i, (x, w, a) in enumerate([(140, 8, 0.8), (190, 3, 0.6), (270, 22, 0.3)]):
    pts = np.array([[x, -200], [x + 520, H + 200]], np.int32)
    cv2.line(streak, tuple(pts[0]), tuple(pts[1]), a, w, cv2.LINE_AA)
streak = cv2.GaussianBlur(streak, (0, 0), 3) + cv2.GaussianBlur(streak, (0, 0), 28) * 0.9
img = img + np.clip(streak, 0, 1.5)[..., None] * np.array([0.75, 1.0, 0.85], np.float32)
# defocus the whole backdrop a touch more, then the object sits sharp on top
img = cv2.GaussianBlur(img, (0, 0), 6)
# tile shadow + lime bloom
a = tile[..., 3]
shadow = cv2.GaussianBlur(np.roll(a, 60, 0), (0, 0), 70) * 0.6
img = img * (1 - shadow[..., None] * 0.75)
bloom = cv2.GaussianBlur(a, (0, 0), 120)
img = img + bloom[..., None] * LIME * 0.12
img = img * (1 - a[..., None]) + tile[..., :3] * a[..., None]
# vignette, grain, gentle contrast
vig = 1 - 0.55 * np.clip((np.hypot((xx - W * 0.55) / W, (yy - H * 0.45) / H) - 0.25) / 0.6, 0, 1) ** 1.6
img = img * vig[..., None]
rng = np.random.default_rng(3)
img = img + (rng.normal(0, 0.028, (H, W)).astype(np.float32))[..., None]
img = np.clip(img, 0, 1) ** 0.98
cv2.imwrite(out, (img * 255).astype(np.uint8))
print('ok', out)
