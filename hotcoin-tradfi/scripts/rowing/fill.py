# Drift-corrected tracking between hand-placed keyframes of the worker's head.
import cv2, json, numpy as np
V = '/root/.claude/uploads/08b7d1e0-df49-5703-a4c9-aa238815ef35/40d95be2-publer-1791004104223.mp4'
K = {int(k): v for k, v in json.load(open('keys.json')).items()}; ks = sorted(K)
cap = cv2.VideoCapture(V); frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(f)
N = len(frames); out = np.zeros((N, 2)); B = 100; fallback = 0
for a, b in zip(ks, ks[1:] + [N - 1]):
    pa = np.array(K[a], float); pb = np.array(K.get(b, K[a]), float)
    t = cv2.TrackerCSRT_create(); t.init(frames[a], (int(pa[0] - B / 2), int(pa[1] - B / 2), B, B))
    tr = [pa]
    for i in range(a + 1, b + 1):
        ok, bx = t.update(frames[i]); tr.append(np.array([bx[0] + bx[2] / 2, bx[1] + bx[3] / 2]) if ok else tr[-1])
    tr = np.array(tr); err = tr[-1] - pb; n = b - a
    if b in K and np.linalg.norm(err) < 110:
        for j in range(n + 1): out[a + j] = tr[j] - err * (j / n)
    else:
        fallback += 1
        for j in range(n + 1): out[a + j] = pa + (pb - pa) * (j / max(n, 1)) if b in K else tr[j]
k = np.exp(-0.5 * (np.arange(-3, 4) / 1.5) ** 2); k /= k.sum()
sm = np.stack([np.convolve(np.pad(out[:, c], 3, mode='edge'), k, 'valid') for c in range(2)], 1)
json.dump(sm.round(1).tolist(), open('btc.json', 'w')); print('frames', N, 'segments using linear fallback', fallback)
