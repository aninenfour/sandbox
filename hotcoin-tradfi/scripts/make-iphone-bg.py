# 4320 x 1350 continuous banknote strip for the iPhone Upgrade Season carousel.
# Sources: Pexels 9539616 (pile of $1 bills) and 6468225, graded to ink-green monochrome.
import numpy as np
from PIL import Image, ImageOps
def panel(src, w, h, flip=False):
    im = Image.open(src).convert('RGB')
    im = ImageOps.fit(im, (w, h), Image.LANCZOS)
    return ImageOps.mirror(im) if flip else im
a = panel('public/iphone/cash-9539616.jpg', 2160, 1350)
b = panel('public/iphone/cash-6468225.jpg', 2160, 1350)
strip = Image.new('RGB', (4320, 1350)); strip.paste(a, (0, 0)); strip.paste(b, (2160, 0))
g = np.asarray(ImageOps.grayscale(strip)).astype(float) / 255
g = np.clip((g - 0.12) / 0.85, 0, 1) ** 1.2
dark = np.array([4, 8, 6]); mid = np.array([46, 92, 52])
out = dark + (mid - dark) * g[..., None]
Image.fromarray(out.astype(np.uint8)).save('public/iphone/bg-strip.jpg', quality=90)
print('ok')
