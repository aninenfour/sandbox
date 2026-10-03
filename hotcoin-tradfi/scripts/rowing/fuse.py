# Worker head = pose-detected face nearest to my hand-placed keyframe path; falls back to the tracked path.
import json, numpy as np, collections
P = json.load(open('ptrack.json')); K = {int(k): v for k, v in json.load(open('keys.json')).items()}; ks = sorted(K)
T = np.array(json.load(open('btc.json')))
prior = np.array([np.interp(i, ks, [K[k][0] for k in ks]), np.interp(i, ks, [K[k][1] for k in ks])] for i in range(len(P)))
prior = np.array([[np.interp(i, ks, [K[k][0] for k in ks]), np.interp(i, ks, [K[k][1] for k in ks])] for i in range(len(P))])
ETH = np.array(json.load(open('others.json'))['eth'])
out = []; src = collections.Counter()
for i, ppl in enumerate(P):
    best = None
    for p in ppl:
        k = np.array(p['k']); f = k[:5]; g = f[f[:, 2] > 0.3]
        if len(g) < 2: continue
        h = g[:, :2].mean(0)
        if np.linalg.norm(h - ETH[i]) < 60: continue
        d = min(np.linalg.norm(h - prior[i]), np.linalg.norm(h - T[i]))
        if d < 95 and (best is None or d < best[0]): best = (d, h)
    if best: out.append(best[1]); src['pose'] += 1
    else: out.append(T[i]); src['track'] += 1
o = np.array(out)
# reject single-frame spikes, then smooth
for i in range(1, len(o) - 1):
    if np.linalg.norm(o[i] - (o[i-1] + o[i+1]) / 2) > 60: o[i] = (o[i-1] + o[i+1]) / 2
k = np.exp(-0.5 * (np.arange(-2, 3) / 1.0) ** 2); k /= k.sum()
o = np.stack([np.convolve(np.pad(o[:, c], 2, mode='edge'), k, 'valid') for c in range(2)], 1)
json.dump(o.round(1).tolist(), open('btc2.json', 'w')); print(src)
