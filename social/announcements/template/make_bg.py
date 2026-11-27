# Reusable announcement background: Hotcoin symbol as halftone dots + radial dot rays on lime.
# Output: bg-lime-1600x900.png (no text). Run: python3 make_bg.py
import math, random
from PIL import Image, ImageDraw, ImageFilter
ROOT = '/home/user/sandbox'
W, H = 1600, 900
OUT = ROOT + '/social/announcements/template/bg-lime-1600x900.png'
random.seed(9)

# base: soft lime gradient
bg = Image.new('RGB', (W, H))
px = bg.load()
c1, c2 = (206, 247, 120), (160, 226, 74)
for y in range(H):
    for x in range(W):
        t = min(1, max(0, (x / W) * 0.35 + (y / H) * 0.65))
        px[x, y] = tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

# symbol mask, large and centred
sym = Image.open(ROOT + '/hotcoin-tradfi/public/brand/symbol-official-white.png').convert('RGBA')
S = 980
a = sym.split()[3].resize((S, S), Image.LANCZOS).filter(ImageFilter.GaussianBlur(3))
mask = Image.new('L', (W, H), 0); mask.paste(a, ((W - S) // 2, (H - S) // 2 + 10))
mp = mask.load()

dots = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(dots)
cx, cy, step = W / 2, H / 2 + 10, 9
for gy in range(0, H, step):
    for gx in range(0, W, step):
        x, y = gx + step / 2, gy + step / 2
        m = mp[int(x), int(y)] / 255
        dx, dy = x - cx, y - cy; r = math.hypot(dx, dy); ang = math.atan2(dy, dx)
        ray = max(0, math.cos(ang * 18)) ** 6 * max(0, 1 - r / 820) * (r > 230)
        v = max(m * 0.8, ray * 0.6)
        if v < 0.06 or random.random() > 0.55 * v + 0.05: continue
        s = 2 + int(v * 3.2 * random.uniform(0.6, 1.1))
        alpha = int(25 + 95 * v * random.uniform(0.5, 1))
        col = (24, 70, 20, alpha) if random.random() > 0.3 else (255, 255, 255, int(alpha * 1.1))
        d.rectangle([x - s / 2, y - s / 2, x + s / 2, y + s / 2], fill=col)
out = Image.alpha_composite(bg.convert('RGBA'), dots).convert('RGB')
out.save(OUT); print(OUT)
