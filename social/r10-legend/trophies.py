"""Real trophy cutouts for the Legend Series (Wikimedia Commons museum photos, credits in
hotcoin-tradfi/FOOTAGE_CREDITS.md). Crop the trophy out of the museum shot (fractional box), remove the
background with rembg, drop the haze, warm/vibrant grade. Inputs: src/trophies/*.jpg  Outputs: assets/trophy_<k>.png
Run from the repo root: python3 social/r10-legend/trophies.py [keys]"""
import sys, numpy as np, cv2
from rembg import remove, new_session

S = 'social/r10-legend/src/trophies'; A = 'social/r10-legend/assets'
# key -> (file, crop box as fractions x0, y0, x1, y1)
T = {'wc': ('wc_full.jpg', (0.25, 0.385, 0.45, 0.56)),
     'wp': ('wp.jpg', (0.32, 0.15, 0.70, 0.76)),
     'bdo': ('barca22.jpg', (0.645, 0.22, 0.99, 0.65)),   # pre-2010 ball, FC Barcelona museum
     'lib': ('lib.jpg', (0.32, 0.21, 0.68, 0.985)),
     'ucl': ('ucl_dom.jpg', (0.03, 0.10, 0.80, 0.87))}   # stop above the plinth
HAZE = {'ucl': 150}   # glass-case haze around the cup
session = new_session('isnet-general-use')
only = sys.argv[1:]
for k, (f, (x0, y0, x1, y1)) in T.items():
    if only and k not in only: continue
    img = cv2.imread(f'{S}/{f}')
    if img is None and k == 'wc': img = cv2.imread(f'{S}/wc.jpg')   # 1920px fallback
    if img is None: print('missing', f); continue
    h, w = img.shape[:2]
    img = img[int(y0 * h):int(y1 * h), int(x0 * w):int(x1 * w)]
    cv2.imwrite(f'{A}/trophy_{k}_crop.jpg', img)
    rgba = np.array(remove(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), session=session, post_process_mask=True)).copy()
    a = rgba[..., 3]; a[a < HAZE.get(k, 60)] = 0
    n, lab, st, _ = cv2.connectedComponentsWithStats((a > 0).astype(np.uint8), 8)   # drop stray reflections
    big = st[1:, cv2.CC_STAT_AREA].max()
    a[~np.isin(lab, [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 0.08 * big])] = 0
    ys, xs = np.where(a > 20)
    rgba = rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    # vibrant gold: contrast + saturation lift
    hsv = cv2.cvtColor(rgba[..., :3], cv2.COLOR_RGB2HSV).astype(np.float32)
    hsv[..., 1] = np.clip(hsv[..., 1] * 1.18, 0, 255)
    hsv[..., 2] = np.clip((hsv[..., 2] - 128) * 1.1 + 134, 0, 255)
    rgba[..., :3] = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB)
    rgba[rgba[..., 3] == 0] = 0                                # clean transparent pixels
    cv2.imwrite(f'{A}/trophy_{k}.png', cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
    print('trophy', k, rgba.shape)
