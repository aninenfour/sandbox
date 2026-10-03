# ETH rower = the upright face behind the worker: follow the nearest pose face frame to frame, never one near the worker.
import json, numpy as np
P = json.load(open('ptrack.json')); K = {int(k): v for k, v in json.load(open('keys.json')).items()}; ks = sorted(K)
W = np.array([[np.interp(i, ks, [K[k][0] for k in ks]), np.interp(i, ks, [K[k][1] for k in ks])] for i in range(len(P))])
SOL = np.array(json.load(open('others.json'))['sol'])
e = np.array([551., 299.]); out = []; hit = 0
for i, ppl in enumerate(P):
    best = None
    for p in ppl:
        k = np.array(p['k']); f = k[:5]; g = f[f[:, 2] > 0.3]
        if len(g) < 2: continue
        h = g[:, :2].mean(0)
        if np.linalg.norm(h - W[i]) < 70 or np.linalg.norm(h - SOL[i]) < 40: continue
        d = np.linalg.norm(h - e)
        if d < 32 and (best is None or d < best[0]): best = (d, h)
    if best: e = 0.5 * e + 0.5 * best[1]; hit += 1
    out.append(e.copy())
o = np.array(out); k = np.exp(-0.5 * (np.arange(-6, 7) / 3) ** 2); k /= k.sum()
o = np.stack([np.convolve(np.pad(o[:, c], 6, mode='edge'), k, 'valid') for c in range(2)], 1)
d = json.load(open('others.json')); d['eth'] = o.round(1).tolist(); json.dump(d, open('others.json', 'w')); print('hits', hit)
