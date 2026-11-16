"""Green-screen key + grade for the Ronaldinho ambassador clip (public/ronaldinho/main.mp4, 4K 10-bit 4:2:2, 50 fps).

Writes public/ronaldinho/key.webm: VP9 with alpha, subject crop only, 50 fps, original audio stripped
(audio goes separately to public/ronaldinho/voice.wav). Usage:
  python3 scripts/make-r10-key.py            # full clip
  python3 scripts/make-r10-key.py --still 2  # one test frame at t=2s -> out/r10key/test.png (+ checker preview)

Steps per frame (float32, 16-bit input):
  1. colour-difference matte: d = G - max(R, B). Backdrop measures 0.18..0.24, subject <= 0.02.
  0. pink tracking crosses repainted in backdrop green before keying (never cut from the alpha).
  2. garbage matte: largest connected blob of the hard matte, holes filled, dilated.
  3. edge refinement: small erode on the soft alpha + 1px feather, so no green halo.
  4. despill: G limited to the mean of R and B where it exceeds it.
  5. grade: magenta studio rim light neutralised (lime rim is added in the Remotion composite), +exposure,
     contrast S-curve, slight warm skin, blacks lifted to ink #0B0E11.
"""
import argparse, os, subprocess
import numpy as np, cv2

SRC = 'public/ronaldinho/main.mp4'
W, H = 3840, 2160
X0, X1 = 1040, 3040            # subject crop (he moves within ~1230..2850)
SCALE = 0.75                   # 2000x2160 -> 1500x1620
OW, OH = int((X1 - X0) * SCALE), int(H * SCALE)
LO, HI = 0.035, 0.150          # d below LO = solid, above HI = backdrop


def key(img):
    """img: HxWx3 float32 RGB 0..1 (already cropped). Returns RGBA float32, graded."""
    # Pink tracking crosses: repaint them in backdrop green BEFORE keying, so the normal key decides the edge.
    # (Cutting them out of the alpha with a safety margin bit into his neck where a cross sits right beside it.)
    # Core = bright saturated pink (V ~0.8). Its anti-aliased fringe is repainted only where bright (V > 0.42);
    # his magenta-lit skin is much darker (V < 0.3), so it is never touched.
    img = img.copy()
    hsv0 = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
    core = ((hsv0[..., 0] > 320) & (hsv0[..., 1] > 0.33) & (hsv0[..., 2] > 0.6)).astype(np.uint8)
    n3, lab3, st3, _ = cv2.connectedComponentsWithStats(core, 8)
    big = np.isin(lab3, [i for i in range(1, n3) if st3[i, cv2.CC_STAT_AREA] > 150])
    if big.any():
        zone = cv2.dilate(big.astype(np.uint8), np.ones((11, 11), np.uint8)) > 0
        fix = zone & ((hsv0[..., 2] > 0.42) | big) & ~((hsv0[..., 1] < 0.12) & (hsv0[..., 2] > 0.7))  # never white shirt
        img[fix] = np.array([0.21, 0.43, 0.20], np.float32)
    R, G, B = img[..., 0], img[..., 1], img[..., 2]
    d = G - np.maximum(R, B)
    a = 1.0 - np.clip((d - LO) / (HI - LO), 0, 1)

    hard = (a > 0.5).astype(np.uint8)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(hard, 8)
    if n > 1:
        big = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        blob = (lab == big).astype(np.uint8)
    else:
        blob = hard
    # fill holes (anything not connected to the frame border through background)
    inv = (1 - blob).astype(np.uint8)
    n2, lab2 = cv2.connectedComponents(inv, 4)
    border = set(np.unique(np.concatenate([lab2[0], lab2[-1], lab2[:, 0], lab2[:, -1]])))
    holes = np.isin(lab2, [i for i in range(1, n2) if i not in border])
    blob = np.maximum(blob, holes.astype(np.uint8))
    garbage = cv2.dilate(blob, np.ones((9, 9), np.uint8))
    a = a * garbage
    a[holes] = 1.0

    # tighten edge by ~1px and feather
    a = cv2.erode(a, np.ones((3, 3), np.uint8))
    a = cv2.GaussianBlur(a, (0, 0), 0.9)
    a = np.clip((a - 0.04) / 0.92, 0, 1)

    # despill
    lim = (R + B) * 0.5
    G2 = np.where(G > lim, lim + (G - lim) * 0.15, G)
    rgb = np.stack([R, G2, B], -1)

    # magenta rim light mask on HSV of despilled image
    hsv = cv2.cvtColor(rgb.astype(np.float32), cv2.COLOR_RGB2HSV)  # H in degrees 0..360
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    mag = np.clip(1 - np.abs(((h - 290 + 180) % 360) - 180) / 45, 0, 1) * np.clip((s - 0.18) / 0.25, 0, 1)
    mag = cv2.GaussianBlur(mag, (0, 0), 2)
    # neutralise the magenta light (keep its luminance, drop its colour); the lime rim is added in the composite
    lum = (0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2])
    neutral = np.repeat(lum[..., None], 3, -1) * np.array([1.02, 1.0, 0.98], np.float32)
    rgb = rgb * (1 - mag[..., None] * 0.9) + neutral * (mag[..., None] * 0.9)

    # grade: contrast S-curve around mid grey, slight warm skin, ink blacks
    x = np.clip(rgb * 1.14, 0, 1) ** 0.93                 # +exposure, open the face
    x = x + 0.26 * (x - 0.5) * (1 - np.abs(2 * x - 1))   # soft S
    x = x * np.array([1.03, 1.0, 0.97], np.float32)        # warm a touch
    ink = np.array([0x0B, 0x0E, 0x11], np.float32) / 255
    x = ink + x * (1 - ink)
    x = np.clip(x, 0, 1)
    return np.dstack([x, a])


def frames(t=None):
    cmd = ['/usr/bin/ffmpeg', '-v', 'error']
    if t is not None:
        cmd += ['-ss', str(t)]
    cmd += ['-i', SRC]
    if t is not None:
        cmd += ['-frames:v', '1']
    cmd += ['-vf', f'crop={X1 - X0}:{H}:{X0}:0', '-f', 'rawvideo', '-pix_fmt', 'rgb48le', '-']
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, bufsize=10 ** 8)
    n = (X1 - X0) * H * 3 * 2
    while True:
        buf = p.stdout.read(n)
        if len(buf) < n:
            break
        yield np.frombuffer(buf, np.uint16).reshape(H, X1 - X0, 3).astype(np.float32) / 65535


def shrink(rgba):
    return cv2.resize(rgba, (OW, OH), interpolation=cv2.INTER_AREA)


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--still', type=float)
    args = ap.parse_args()
    if args.still is not None:
        os.makedirs('out/r10key', exist_ok=True)
        img = next(frames(args.still))
        k = shrink(key(img))
        out = (np.clip(k, 0, 1) * 65535).astype(np.uint16)
        cv2.imwrite('out/r10key/test.png', cv2.cvtColor(out, cv2.COLOR_RGBA2BGRA))
        # preview on dark green + checker for edge inspection
        bg = np.zeros_like(k[..., :3]); bg[:] = np.array([0.04, 0.16, 0.09])
        yy, xx = np.mgrid[0:OH, 0:OW]
        chk = (((yy // 24) + (xx // 24)) % 2)[..., None] * 0.25 + 0.6
        for name, b in [('green', bg), ('checker', np.repeat(chk, 3, -1))]:
            comp = k[..., :3] * k[..., 3:] + b * (1 - k[..., 3:])
            cv2.imwrite(f'out/r10key/test_{name}.png', (np.clip(comp, 0, 1)[..., ::-1] * 255).astype(np.uint8))
        raw = cv2.resize(img, (OW, OH), interpolation=cv2.INTER_AREA)
        cv2.imwrite('out/r10key/test_raw.png', (raw[..., ::-1] * 255).astype(np.uint8))
        print('wrote out/r10key/test*.png', OW, OH)
    else:
        enc = subprocess.Popen(['/usr/bin/ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{OW}x{OH}',
                                '-r', '50', '-i', '-', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '14',
                                '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-auto-alt-ref', '0',
                                'public/ronaldinho/key.webm'], stdin=subprocess.PIPE)
        for i, img in enumerate(frames()):
            k = shrink(key(img))
            enc.stdin.write((np.clip(k, 0, 1) * 255 + 0.5).astype(np.uint8).tobytes())
            if i % 25 == 0:
                print('frame', i, flush=True)
        enc.stdin.close(); enc.wait()
        subprocess.run(['/usr/bin/ffmpeg', '-v', 'error', '-y', '-i', SRC, '-vn', '-ac', '2', '-ar', '48000',
                        'public/ronaldinho/voice.wav'], check=True)
        print('done')
