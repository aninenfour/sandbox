"""Portrait cutouts for the Legend Series (official Hotcoin shoot photos, Ronaldinho in the 9th-anniversary jersey).
1. Card 09 photo: the blank blue phone screen is replaced by a real Hotcoin app screenshot (perspective-matched,
   his fingers kept in front).
2. Background removed with rembg (isnet-general-use), cropped just below the jersey hem: no socks, shoes or
   third-party logos on the shorts.
3. Gentle grade: a touch more contrast, very slight green in the shadows to sit in the Hotcoin palette.
Inputs: social/r10-legend/src/photoNN.jpg + app.png (copied from the uploads). Outputs: assets/cut_NN.png
Run from the repo root: python3 social/r10-legend/cutouts.py"""
import numpy as np, cv2
from rembg import remove, new_session

S = 'social/r10-legend/src'; A = 'social/r10-legend/assets'
# card -> (source photo, crop y = just below jersey hem, in source px of 2576 tall)
CARDS = {1: ('photo06', 1450), 2: ('photo08', 1480), 3: ('photo03', 1500), 4: ('photo04', 1440), 5: ('photo07', 1440),
         6: ('photo05', 2120), 7: ('photo10', 1560), 8: ('photo01', 1510), 9: ('photo02', 1530)}
session = new_session('isnet-general-use')

def put_screen(img, shot):
    """Replace the blue phone screen with `shot` (perspective-fitted); skin (fingers) stays in front."""
    b, g, r = [img[..., i].astype(np.int16) for i in range(3)]
    blue = ((b > 50) & (b > r + 35) & (b > g + 30)).astype(np.uint8)   # navy screen: B~86, G~5, R~1
    blue = cv2.morphologyEx(blue, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))   # bridge the black tracking dots
    n, lab, st, _ = cv2.connectedComponentsWithStats(blue, 8)
    k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); blue = (lab == k).astype(np.uint8)
    hull = cv2.convexHull(cv2.findNonZero(blue))
    quad = cv2.approxPolyDP(hull, 0.02 * cv2.arcLength(hull, True), True).reshape(-1, 2).astype(np.float32)
    if len(quad) != 4:
        x, y, w, h = cv2.boundingRect(hull); quad = np.float32([[x, y], [x + w, y], [x + w, y + h], [x, y + h]])
    # order: tl, tr, br, bl
    s = quad.sum(1); d = np.diff(quad, axis=1).ravel()
    quad = np.float32([quad[np.argmin(s)], quad[np.argmin(d)], quad[np.argmax(s)], quad[np.argmax(d)]])
    c = quad.mean(0); quad = c + (quad - c) * 1.06                  # cover the anti-aliased blue rim
    hh, ww = shot.shape[:2]
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [ww, 0], [ww, hh], [0, hh]]), quad)
    warped = cv2.warpPerspective(shot, M, (img.shape[1], img.shape[0]), flags=cv2.INTER_AREA)
    area = np.zeros(img.shape[:2], np.uint8); cv2.fillConvexPoly(area, quad.astype(np.int32), 1)
    skin = (r > b + 15) & (r > 90)
    rim = cv2.dilate(((b > 40) & (b > r + 25) & (b > g + 20)).astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
    m = ((area.astype(bool) | (rim & cv2.dilate(area, np.ones((9, 9), np.uint8)).astype(bool))) & ~skin).astype(np.float32)
    m = cv2.GaussianBlur(m, (0, 0), 0.8)[..., None]
    print('screen quad', quad.astype(int).tolist())
    return (warped * m + img * (1 - m)).astype(np.uint8)

import sys
ONLY = [int(x) for x in sys.argv[1:]]
for card, (src, ycut) in CARDS.items():
    if ONLY and card not in ONLY: continue
    img = cv2.imread(f'{S}/{src}.jpg')
    if card == 9:
        shot = cv2.imread(f'{S}/app.png')
        shot = shot[0:shot.shape[0], :]                       # full screen incl. status bar
        img = put_screen(img, shot)
        cv2.imwrite(f'{A}/phone_check.jpg', img[600:1100, 400:800])
    rgba = remove(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), session=session, post_process_mask=True)
    rgba = np.array(rgba)[:ycut].copy()
    a = rgba[..., 3]
    a[a < 40] = 0                                              # drop the faint haze rembg leaves around the subject
    ys, xs = np.where(a > 20)
    rgba = rgba[max(0, ys.min() - 10):, max(0, xs.min() - 10):xs.max() + 10]
    # grade: contrast + slight green in the shadows
    rgb = rgba[..., :3].astype(np.float32) / 255
    rgb = np.clip((rgb - 0.5) * 1.08 + 0.5, 0, 1)
    shadow = (1 - rgb.mean(-1, keepdims=True)) ** 2
    rgb = rgb + shadow * np.array([-0.012, 0.018, -0.004])
    rgba[..., :3] = (np.clip(rgb, 0, 1) * 255).astype(np.uint8)
    cv2.imwrite(f'{A}/cut_{card:02d}.png', cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
    print('cut', card, src, rgba.shape)
