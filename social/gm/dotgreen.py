# Usage: python3 social/gm/dotgreen.py in.jpg out.jpg  (needs opencv)
# Shift olive/khaki greens to brand dot green #7EC25A (hue ~99deg, sat ~.54), keeping each pixel's shading.
import sys, numpy as np, cv2
src, dst = sys.argv[1], sys.argv[2]
im = cv2.imread(src); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV).astype(np.float32)
h, s, v = hsv[..., 0] * 2, hsv[..., 1] / 255, hsv[..., 2] / 255   # h in degrees
m = ((h > 45) & (h < 125) & (s > .22)).astype(np.float32)
m = cv2.GaussianBlur(m, (0, 0), 3)
nh = 99.0
ns = np.clip(s * 1.35 + .08, 0, .62)
nv = np.clip(v * 1.18 + .04, 0, 1)
h2 = h * (1 - m) + nh * m; s2 = s * (1 - m) + ns * m; v2 = v * (1 - m) + nv * m
out = cv2.cvtColor(np.dstack([h2 / 2, s2 * 255, v2 * 255]).astype(np.uint8), cv2.COLOR_HSV2BGR)
cv2.imwrite(dst, out, [cv2.IMWRITE_JPEG_QUALITY, 94])
