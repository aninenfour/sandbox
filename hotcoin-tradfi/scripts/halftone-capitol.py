import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('L')
W, H = 2160, 1440  # output size (2x of 1080x720)
im = im.resize((W, int(im.height * W / im.width)), Image.LANCZOS).crop((0, 0, W, H)) if im.height * W / im.width >= H else im.resize((W, H))
a = np.asarray(im.filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32) / 255
# local contrast: subtract the smooth sky, keep architecture edges and shadows
bg = np.asarray(im.filter(ImageFilter.GaussianBlur(40)), dtype=np.float32) / 255
d = np.clip((1 - a) * 0.75 + (bg - a) * 1.6, 0, 1)
d = np.clip((d - 0.18) / 0.6, 0, 1) ** 1.1
step = 12
canvas = Image.new('L', (W, H), 0)
dr = ImageDraw.Draw(canvas)
for y in range(0, H, step):
    off = (step // 2) if (y // step) % 2 else 0
    for x in range(off, W, step):
        v = d[min(y, H - 1), min(x, W - 1)]
        r = v * step * 0.62
        if r > 0.6: dr.ellipse((x - r, y - r, x + r, y + r), fill=255)
# fade: strong at right/top, gone toward bottom and left
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
fade = np.clip(1.25 - yy / H * 1.2, 0, 1)
k = W / 800
poly = [(378,50),(395,50),(410,130),(470,180),(495,240),(515,300),(515,390),(800,385),(800,534),(0,534),(0,385),(255,390),(255,300),(275,240),(300,180),(360,130)]
m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon([(x*k, y*k) for x, y in poly], fill=255)
fade = fade * np.asarray(m.filter(ImageFilter.GaussianBlur(10)), dtype=np.float32) / 255
alpha = (np.asarray(canvas, dtype=np.float32) * fade).astype(np.uint8)
rgba = np.zeros((H, W, 4), np.uint8); rgba[..., :3] = (11, 14, 17); rgba[..., 3] = alpha
Image.fromarray(rgba, 'RGBA').save(out)
