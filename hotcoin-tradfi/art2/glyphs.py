# Style 2: turns a grayscale light study into glyph art (edges -> directional strokes, faces -> density glyphs),
# green palette with bloom, plus an optional lime price line. Output 2160x2700 RGB.
import numpy as np, cv2, math, sys, json
from PIL import Image, ImageDraw, ImageFont
src, out = sys.argv[1], sys.argv[2]
opts = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
W, H, CW, CH = 2160, 2700, 30, 40
FONT = ImageFont.truetype('node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2', 36)
g = cv2.cvtColor(cv2.imread(src), cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
g = cv2.resize(g, (W, H), interpolation=cv2.INTER_CUBIC)
g = np.clip((g - 0.04) / 0.9, 0, 1)
cols, rows = W // CW, H // CH
cell = cv2.resize(g, (cols, rows), interpolation=cv2.INTER_AREA)
gx = cv2.Sobel(g, cv2.CV_32F, 1, 0, ksize=5); gy = cv2.Sobel(g, cv2.CV_32F, 0, 1, ksize=5)
mag = cv2.resize(np.hypot(gx, gy), (cols, rows), interpolation=cv2.INTER_AREA)
ang = cv2.resize(np.arctan2(gy, gx), (cols, rows), interpolation=cv2.INTER_NEAREST)
mag = mag / (np.percentile(mag[mag > 0], 99) + 1e-6)
RAMP = "  .·:=+x#"
img = Image.new('RGB', (W, H), (4, 6, 4)); d = ImageDraw.Draw(img)
rng = np.random.default_rng(5)
for r in range(rows):
    for c in range(cols):
        v = float(cell[r, c]); m = float(mag[r, c]); x, y = c * CW, r * CH
        if m > 0.35:
            a = (math.degrees(ang[r, c]) + 180) % 180
            ch = '|' if a < 22 or a >= 158 else ('/' if a < 68 else ('-' if a < 112 else '\\'))
            col = (235, 255, 220)
        elif v > 0.04:
            ch = RAMP[min(len(RAMP) - 1, int(v * (len(RAMP) - 1) + 0.5))]
            t = v
            col = (int(40 + 170 * t), int(90 + 160 * t), int(30 + 90 * t)) if t < 0.75 else (int(184 + 50 * (t - 0.75) * 4), 242, int(106 + 120 * (t - 0.75) * 4))
        else:
            if rng.random() < 0.035: ch, col = '·', (30, 60, 28)
            else: continue
        d.text((x, y), ch, font=FONT, fill=col)
arr = np.asarray(img).astype(np.float32) / 255
glow = cv2.GaussianBlur(arr, (0, 0), 14) * 0.9 + cv2.GaussianBlur(arr, (0, 0), 60) * 0.7
arr = arr + glow * np.array([0.55, 0.85, 0.45], np.float32)
# soft haze behind the object
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
haze = np.exp(-(((xx - W * 0.5) / (W * 0.55)) ** 2 + ((yy - H * 0.36) / (H * 0.3)) ** 2))
arr = arr + haze[..., None] * np.array([0.03, 0.08, 0.03], np.float32)
if opts.get('line'):
    # rising price line through the object: smooth random walk with an up-drift, glowing lime
    n = 220; xs = np.linspace(110, W - 110, n); rw = np.cumsum(rng.normal(0, 1, n)); rw = cv2.GaussianBlur(rw.reshape(-1, 1), (0, 0), 3).ravel()
    ys = H * 0.86 - np.linspace(0, H * 0.3, n) ** 1.1 * 0.9 - (rw - rw.mean()) * 7
    ln = np.zeros((H, W), np.float32)
    cv2.polylines(ln, [np.stack([xs, ys], 1).astype(np.int32)], False, 1.0, 3, cv2.LINE_AA)
    lg = (ln + cv2.GaussianBlur(ln, (0, 0), 8) * 0.9 + cv2.GaussianBlur(ln, (0, 0), 36) * 0.5) * 0.7
    arr = arr + lg[..., None] * np.array([0.62, 1.0, 0.45], np.float32)
    ex, ey = int(xs[-1]), int(ys[-1])
    cv2.circle(arr, (ex, ey), 16, (0.62, 1.0, 0.45), -1, cv2.LINE_AA)
    arr = arr + cv2.GaussianBlur((np.hypot(xx - ex, yy - ey) < 18).astype(np.float32), (0, 0), 40)[..., None] * np.array([0.5, 0.9, 0.4]) * 2
vig = 1 - 0.6 * np.clip((np.hypot((xx - W / 2) / W, (yy - H * 0.42) / H) - 0.3) / 0.55, 0, 1) ** 1.5
arr = arr * vig[..., None] + rng.normal(0, 0.02, (H, W, 1)).astype(np.float32)
cv2.imwrite(out, cv2.cvtColor((np.clip(arr, 0, 1) * 255).astype(np.uint8), cv2.COLOR_RGB2BGR))
print('ok', out)
