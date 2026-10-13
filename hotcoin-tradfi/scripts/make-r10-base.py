# Builds public/r10/base.mp4 from the reference cut: paints out identity text (inpainting), adds tracked
# point-cloud hair + headband to the scan shots, glitches the celebrating actor's face. New text is added in Remotion.
import cv2, numpy as np, json, math, subprocess, sys
sys.path.insert(0, 'scripts')
SRC = sys.argv[1]; OUT = 'public/r10/base.mp4'
tracks = {k: {int(f): v for f, v in d.items()} for k, d in json.load(open('src/r10/tracks.json')).items()}
SPR = {}
def spr(n, gray=False):
    key = (n, gray)
    if key not in SPR:
        s = cv2.imread(f'public/r10/{n}.png', cv2.IMREAD_UNCHANGED)
        if gray:
            g = cv2.cvtColor(s[..., :3], cv2.COLOR_BGR2GRAY); g = np.clip(g.astype(float) * 1.15, 0, 255).astype(np.uint8)
            s = np.dstack([g, g, g, s[..., 3]])
        SPR[key] = s
    return SPR[key]
def anchor_center(ax, ay, w, h, tx, ty, s, rot):
    vx, vy = (ax - w / 2) * s, (ay - h / 2) * s; t = math.radians(rot)
    return tx - (vx * math.cos(t) - vy * math.sin(t)), ty - (vx * math.sin(t) + vy * math.cos(t))
def warp(n, tx, ty, s, rot, gray=False, anchor=(650, 430)):
    sp = spr(n, gray); h, w = sp.shape[:2]; cx, cy = anchor_center(anchor[0], anchor[1], w, h, tx, ty, s, rot)
    M = cv2.getRotationMatrix2D((w / 2, h / 2), -rot, s); M[0, 2] += cx - w / 2; M[1, 2] += cy - h / 2
    return cv2.warpAffine(sp, M, (1920, 1080), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0))
def over(base, layer, occ=None, op=1.0):
    a = layer[..., 3:4].astype(np.float32) / 255 * op
    if occ is not None: a = a * (1 - occ[..., None])
    return (base * (1 - a) + layer[..., :3] * a).astype(np.uint8)
def occlusion(base, thr=45):
    g = cv2.cvtColor(base, cv2.COLOR_BGR2GRAY)
    m = (cv2.GaussianBlur(g, (0, 0), 4) > thr).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((31, 31), np.uint8)); m = cv2.dilate(m, np.ones((9, 9), np.uint8))
    return cv2.GaussianBlur(m.astype(np.float32), (0, 0), 3)
def dress(base, view, tx, ty, s, rot, op):
    if view == 'q':
        occ = occlusion(base)
        base = over(base, warp('q-behind', tx, ty, s, rot), occ, op); base = over(base, warp('crown', tx, ty, s, rot), None, op); base = over(base, warp('band-front', tx, ty, s, rot), None, op)
    elif view == 'p':
        occ = occlusion(base)
        base = over(base, warp('p-behind', tx, ty, s, rot), occ, op); base = over(base, warp('crown', tx, ty, s, rot), None, op); base = over(base, warp('band-profile', tx, ty, s, rot), None, op)
    elif view == 'b':
        base = over(base, warp('hair-back', tx, ty, s, rot, True), None, op * 0.88); base = over(base, warp('band-back', tx, ty, s, rot, True), None, op)
    return base
# hair placements: (track, view, ref target (tx,ty,s,rot), frames, fade frames)
HAIR = [('faceG', 'q', (1175, 250, 1.05, -30), (153, 214)), ('faceL', 'p', (1500, 140, 0.62, -4), (330, 357)),
        ('nameA', 'b', (950, 300, 0.48, 0), (501, 524)), ('nameB', 'b', (730, 330, 0.47, 0), (527, 545))]
REF = {'faceG': (950, 180, 550), 'faceL': (1500, 60, 400), 'nameA': (800, 640, 300), 'nameB': (620, 600, 230)}
# text paint-outs: (frames, rect at start, rect at end, luminance threshold)
def lerp(a, b, t): return [a[i] + (b[i] - a[i]) * t for i in range(4)]
TEXT = [
    ((49, 53), (1485, 262, 1675, 352), None, 70), ((49, 53), (1485, 752, 1780, 842), None, 70),           # sphere: AWARDED / ENGRAVED BASE
    ((226, 247), (105, 714, 440, 754), None, 105),                                                       # title: name
    ((293, 301), (1030, 160, 1410, 250), None, 60), ((293, 301), (1225, 558, 1470, 645), None, 60),       # kick labels
    ((293, 301), (1290, 812, 1540, 900), None, 60), ((293, 301), (1745, 360, 1805, 760), None, 60),
    ((389, 400), (1310, 590, 1665, 724), None, 62), ((389, 400), (1310, 776, 1715, 908), None, 62),
    ((401, 433), (1348, 600, 1645, 715), (1418, 636, 1755, 770), 62), ((401, 433), (1348, 786, 1695, 900), (1418, 850, 1805, 975), 62),  # trophy
    ((500, 525), (0, 992, 320, 1070), None, 42),                                                       # back: FIG. 10 / name
]
def text_rect(f, fr, r0, r1):
    if r1 is None: return r0
    t = 0 if f <= 418 else min(1, (f - 418) / (432 - 418))
    return lerp(r0, r1, t)
cap = cv2.VideoCapture(SRC); n = int(cap.get(7))
TMP = sys.argv[2]
vw = cv2.VideoWriter(TMP, cv2.VideoWriter_fourcc(*'MJPG'), 30, (1920, 1080)); vw.set(cv2.VIDEOWRITER_PROP_QUALITY, 100)
last = {}
for f in range(n):
    ok, im = cap.read()
    if not ok: break
    # paint out text
    mask = np.zeros(im.shape[:2], np.uint8)
    for (fr, r0, r1, thr) in TEXT:
        if fr[0] <= f <= fr[1]:
            x0, y0, x1, y1 = [int(v) for v in text_rect(f, fr, r0, r1)]
            g = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY)
            mask[y0:y1, x0:x1] |= (g > thr).astype(np.uint8) * 255
    if mask.any():
        im = cv2.inpaint(im, cv2.dilate(mask, np.ones((7, 7), np.uint8)), 6, cv2.INPAINT_TELEA)
    # hair
    for (tk, view, (tx, ty, s, rot), (a, b)) in HAIR:
        if a <= f <= b and f in tracks[tk]:
            x, y, w, h, sc = tracks[tk][f]
            if sc < 0.45 and tk in last: x, y, w = last[tk]
            else: last[tk] = (x, y, w)
            rx, ry, rw = REF[tk]; k = w / rw
            op = min(1, (f - a + 1) / 4, (b - f + 1) / 3)
            im = dress(im, view, x + (tx - rx) * k, y + (ty - ry) * k, s * k, rot, op)
    # actor face glitch (celebration shot) and the bare-face inset panel in the profile shot
    gl = None
    if 250 <= f <= 274 and f in tracks['faceI']:
        x, y, w, h, sc = tracks['faceI'][f]; gl = (x, y, w, h)
    if f in (346, 348): gl = (580, 160, 540, 590)
    if gl:
        x, y, w, h = gl
        x0, y0, x1, y1 = max(0, x - 20), max(0, y - 10), min(1920, x + w + 20), min(1080, y + h + 10)
        roi = im[y0:y1, x0:x1].copy(); rng = np.random.default_rng(f)
        small = cv2.resize(roi, (max(1, roi.shape[1] // 14), max(1, roi.shape[0] // 14)), interpolation=cv2.INTER_AREA)
        roi = cv2.resize(small, (roi.shape[1], roi.shape[0]), interpolation=cv2.INTER_NEAREST)
        for yy in range(0, roi.shape[0], 12): roi[yy:yy + 12] = np.roll(roi[yy:yy + 12], int(rng.integers(-28, 28)), axis=1)
        tint = np.array([90, 230, 180], np.float32)  # BGR lime
        roi = np.clip(roi.astype(np.float32) * 0.6 + tint * 0.25 * (roi.mean(axis=2, keepdims=True) / 255), 0, 255).astype(np.uint8)
        im[y0:y1, x0:x1] = roi
    vw.write(im)
vw.release()
subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', TMP, '-c:v', 'libx264', '-crf', '12', '-preset', 'medium', '-pix_fmt', 'yuv420p', OUT], check=True)
print('done', n)
