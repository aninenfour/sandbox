# Film finish for GM photos: soft focus, halation, lifted blacks, warm fade, vignette, luminance grain.
# Hides "AI-clean" edges and makes embedded logos sit in the photo. Free, local.
# Usage: python3 -I social/gm/filmify.py in.jpg out.jpg [--grain 0.07] [--blur 1.2] [--bw]
import sys, numpy as np, cv2
args = sys.argv[1:]
src, dst = args[0], args[1]
opt = lambda k, d: float(args[args.index(k) + 1]) if k in args else d
grain, blur, bw = opt('--grain', .07), opt('--blur', 1.2), '--bw' in args

im = cv2.imread(src).astype(np.float32) / 255
h, w = im.shape[:2]
if bw:
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); im = np.dstack([g, g, g])
# soft focus: blend in a blurred copy
soft = cv2.GaussianBlur(im, (0, 0), blur)
im = im * .55 + soft * .45
# halation: red-orange glow around highlights
hl = np.clip((im.max(axis=2) - .72) / .28, 0, 1)
glow = cv2.GaussianBlur(hl, (0, 0), max(w, h) / 120)
im[..., 2] += glow * .10; im[..., 1] += glow * .04
# tone: lifted blacks, softened whites, gentle warm cast
im = .045 + im * .91
im[..., 2] *= 1.03; im[..., 0] *= .97
# vignette
yy, xx = np.mgrid[0:h, 0:w]
r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
im *= (1 - .22 * np.clip(r - .55, 0, 1) ** 1.5)[..., None]
# grain: luminance-weighted, slightly clumped
rng = np.random.default_rng(7)
n = rng.normal(0, 1, (h, w)).astype(np.float32)
n = cv2.GaussianBlur(n, (0, 0), .9) * 1.6
lum = im.mean(axis=2)
im += (n * grain * (1.2 - lum))[..., None]
cv2.imwrite(dst, np.clip(im * 255, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 94])
