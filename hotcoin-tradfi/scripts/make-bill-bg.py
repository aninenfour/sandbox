# Builds the 4320 x 1350 banknote background for the referral carousel.
# Source: "US $5 Series 2006 obverse" (Wikimedia Commons, US government work, public domain),
# fetched as the 3840 px thumbnail into public/referral/five-3840.jpg.
# Shown one-sided, monochrome and far above 150% of actual size, per US currency illustration rules.
import numpy as np
from PIL import Image, ImageOps
F = 1.72                      # bill scale so Lincoln's face fills slide 1
src = Image.open('public/referral/five-3840.jpg').convert('RGB')
im = src.resize((int(src.width * F), int(src.height * F)), Image.LANCZOS)
ox, oy = 2080, 470            # Lincoln's face centred on slide 1, the bill's far edge at slide 4's right edge
crop = im.crop((ox, oy, ox + 4320, oy + 1350))
g = np.asarray(ImageOps.grayscale(crop)).astype(float) / 255
g = np.clip((g - 0.18) / 0.78, 0, 1) ** 1.15          # firmer engraving lines
paper = np.array([66, 118, 76]); ink = np.array([4, 7, 6])
out = ink + (paper - ink) * g[..., None]
Image.fromarray(out.astype(np.uint8)).save('public/referral/bill-bg.png', optimize=True)
print('ok', crop.size)
