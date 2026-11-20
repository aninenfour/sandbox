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

def _line_from(pts):
    vx, vy, x0, y0 = cv2.fitLine(pts.astype(np.float32), cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
    return np.array([x0, y0]), np.array([vx, vy])

def _intersect(l1, l2):
    (p1, d1), (p2, d2) = l1, l2
    t = np.linalg.solve(np.array([d1, -d2]).T, p2 - p1)[0]
    return p1 + t * d1

def put_screen(img, shot):
    """Replace the blue phone screen with `shot`. Each screen edge is fitted as a straight line (the rounded corners are
    left out of the fit), the lines are intersected for exact corners, and the screenshot gets the phone's rounded
    corners + notch before the perspective warp. Skin (fingers) stays in front."""
    b, g, r = [img[..., i].astype(np.int16) for i in range(3)]
    blue = ((b > 50) & (b > r + 35) & (b > g + 30)).astype(np.uint8)   # navy screen: B~86, G~5, R~1
    blue = cv2.morphologyEx(blue, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))   # bridge the tracking markers
    n, lab, st, _ = cv2.connectedComponentsWithStats(blue, 8)
    k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); blue = (lab == k).astype(np.uint8)
    cnt = max(cv2.findContours(blue, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[0], key=cv2.contourArea).reshape(-1, 2)
    box = cv2.boxPoints(cv2.minAreaRect(cnt))
    sm = box.sum(1); df = np.diff(box, axis=1).ravel()
    box = np.float32([box[np.argmin(sm)], box[np.argmin(df)], box[np.argmax(sm)], box[np.argmax(df)]])  # tl tr br bl
    lines = []
    for j in range(4):
        pa, pb = box[j], box[(j + 1) % 4]
        d = (pb - pa) / np.linalg.norm(pb - pa); nrm = np.array([-d[1], d[0]])
        t = (cnt - pa) @ d / np.linalg.norm(pb - pa); dist = np.abs((cnt - pa) @ nrm)
        sel = cnt[(t > 0.2) & (t < 0.8) & (dist < 12)]          # straight middle part of this edge only
        lines.append(_line_from(sel))
    quad = np.float32([_intersect(lines[(j + 3) % 4], lines[j]) for j in range(4)])   # tl tr br bl
    print('screen quad', quad.round(1).tolist())
    # screenshot -> rounded screen with notch, pre-shrunk (INTER_AREA) to ~2x the target size so it stays crisp
    th = int(2 * max(np.linalg.norm(quad[3] - quad[0]), np.linalg.norm(quad[2] - quad[1])))
    sh, sw = shot.shape[:2]; tw = int(th * sw / sh)
    sc = cv2.resize(shot, (tw, th), interpolation=cv2.INTER_AREA)
    alpha = np.zeros((th, tw), np.float32); rad = int(0.135 * tw)
    cv2.rectangle(alpha, (rad, 0), (tw - rad, th), 1, -1); cv2.rectangle(alpha, (0, rad), (tw, th - rad), 1, -1)
    for cx, cy in [(rad, rad), (tw - rad, rad), (rad, th - rad), (tw - rad, th - rad)]:
        cv2.circle(alpha, (cx, cy), rad, 1, -1, cv2.LINE_AA)
    iw, ih = int(0.31 * tw), int(0.038 * th); ix, iy = (tw - iw) // 2, int(0.013 * th)   # notch (dynamic island)
    cv2.rectangle(sc, (ix + ih // 2, iy), (ix + iw - ih // 2, iy + ih), (8, 8, 8), -1)
    cv2.circle(sc, (ix + ih // 2, iy + ih // 2), ih // 2, (8, 8, 8), -1, cv2.LINE_AA)
    cv2.circle(sc, (ix + iw - ih // 2, iy + ih // 2), ih // 2, (8, 8, 8), -1, cv2.LINE_AA)
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [tw, 0], [tw, th], [0, th]]), quad)
    W2, H2 = img.shape[1], img.shape[0]
    warped = cv2.warpPerspective(sc, M, (W2, H2), flags=cv2.INTER_LINEAR)
    wa = cv2.warpPerspective(alpha, M, (W2, H2), flags=cv2.INTER_LINEAR)
    skin = ((r > b + 15) & (r > 90)).astype(np.float32)
    m = (wa * (1 - skin))[..., None]
    out = (warped * m + img * (1 - m)).astype(np.uint8)
    # any blue fringe left between the new screen and the bezel becomes bezel black
    b2, g2, r2 = [out[..., i].astype(np.int16) for i in range(3)]
    fringe = (b2 > 40) & (b2 > r2 + 25) & (b2 > g2 + 20) & cv2.dilate(blue, np.ones((7, 7), np.uint8)).astype(bool)
    out[fringe] = (12, 12, 14)
    return out

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
