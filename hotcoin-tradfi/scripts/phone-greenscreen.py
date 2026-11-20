# Put a screen recording onto a green-screen phone in a video: tracks the green quad per frame, perspective-warps the
# recording into it, keys only the green (fingers stay in front), despills edges, keeps the template audio.
# Usage: ffmpeg -i rec.mov -vf fps=30 -an -c:v libx264 -crf 12 rec30.mp4   (match template fps; cv2 cannot read HEVC)
#        python3 hotcoin-tradfi/scripts/phone-greenscreen.py template.mov rec30.mp4 out.mp4   (needs opencv-python-headless)
import cv2, numpy as np, subprocess, sys
A, B, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
ca, cb = cv2.VideoCapture(A), cv2.VideoCapture(B)
fps = ca.get(cv2.CAP_PROP_FPS); W, H = int(ca.get(3)), int(ca.get(4))
bframes = []
while True:
    ok, f = cb.read()
    if not ok: break
    bframes.append(f)
p = subprocess.Popen(['/usr/bin/ffmpeg','-loglevel','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{W}x{H}','-r',str(fps),'-i','-',
                      '-i',A,'-map','0:v','-map','1:a?','-c:v','libx264','-crf','16','-preset','medium','-pix_fmt','yuv420p','-c:a','aac','-shortest',OUT],stdin=subprocess.PIPE)
def order(pts):
    pts = pts.reshape(-1, 2).astype(np.float32)
    s, d = pts.sum(1), np.diff(pts, axis=1).ravel()
    return np.array([pts[s.argmin()], pts[d.argmin()], pts[s.argmax()], pts[d.argmax()]], np.float32)  # TL, TR, BR, BL
def quad(cnt):
    hull = cv2.convexHull(cnt); peri = cv2.arcLength(hull, True)
    for eps in np.linspace(0.01, 0.08, 15):
        ap = cv2.approxPolyDP(hull, eps * peri, True)
        if len(ap) == 4: return order(ap)
    return order(cv2.boxPoints(cv2.minAreaRect(cnt)))
prev, i, log = None, 0, []
k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
while True:
    ok, fr = ca.read()
    if not ok: break
    hsv = cv2.cvtColor(fr, cv2.COLOR_BGR2HSV)
    m = cv2.inRange(hsv, (35, 90, 70), (85, 255, 255))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, k)
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    out = fr
    if cnts:
        c = max(cnts, key=cv2.contourArea)
        if cv2.contourArea(c) > 0.01 * W * H:
            q = quad(c)
            # smooth corners within a shot; reset on cuts (big jump)
            if prev is not None and np.abs(q - prev).max() < 25: q = 0.6 * q + 0.4 * prev
            prev = q
            bf = bframes[min(i, len(bframes) - 1)]
            bh, bw = bf.shape[:2]
            # screen-content inset so the app UI sits inside the rounded glass
            src = np.float32([[0, 0], [bw, 0], [bw, bh], [0, bh]])
            M = cv2.getPerspectiveTransform(src, q)
            warped = cv2.warpPerspective(bf, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
            # alpha: green-ness, softened; limited to the phone screen hull so green elsewhere stays
            hullmask = np.zeros((H, W), np.uint8); cv2.fillConvexPoly(hullmask, cv2.convexHull(c), 255)
            g = fr.astype(np.float32)
            greenness = np.clip((g[..., 1] - np.maximum(g[..., 0], g[..., 2]) - 25) / 60, 0, 1)
            alpha = cv2.GaussianBlur(greenness * (hullmask / 255.0), (5, 5), 0)[..., None]
            # despill the edge fringe
            fr2 = fr.astype(np.float32); spill = fr2[..., 1] > np.maximum(fr2[..., 0], fr2[..., 2])
            fr2[..., 1] = np.where(spill & (hullmask > 0), np.maximum(fr2[..., 0], fr2[..., 2]), fr2[..., 1])
            out = (fr2 * (1 - alpha) + warped.astype(np.float32) * alpha).clip(0, 255).astype(np.uint8)
            log.append((i, q.round().tolist()))
    else: prev = None
    p.stdin.write(out.tobytes()); i += 1
p.stdin.close(); p.wait()
print('frames', i, 'with phone', len(log))
