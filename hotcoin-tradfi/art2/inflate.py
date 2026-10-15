# Builds "inflated" 3D meshes (puffy, rounded) from 2D masks: height = sqrt(distance to edge), front + mirrored back.
# Writes art2/inflated.json for art2/guess3d.html.
import cv2, numpy as np, json
from PIL import Image, ImageDraw, ImageFont

def mesh_from_mask(mask, res=300, depth=0.32, size=1.0):
    m = cv2.resize(mask.astype(np.float32), (res, res), interpolation=cv2.INTER_AREA)
    m = (cv2.GaussianBlur(m, (0, 0), 1.2) > 0.5).astype(np.uint8)
    m = np.pad(m, 2)
    # soap-bubble inflation: solve laplace(h) = -1 inside, h = 0 on the edge (smooth, no medial-axis creases)
    import scipy.sparse as sp, scipy.sparse.linalg as spl
    inside = m > 0; ids = -np.ones(m.shape, np.int64); ids[inside] = np.arange(inside.sum())
    rows, cols, vals = [], [], []
    yy, xx = np.nonzero(inside)
    for k, (y, x) in enumerate(zip(yy, xx)):
        rows.append(k); cols.append(k); vals.append(4.0)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            j = ids[y + dy, x + dx]
            if j >= 0: rows.append(k); cols.append(j); vals.append(-1.0)
    A = sp.csr_matrix((vals, (rows, cols)), shape=(len(yy), len(yy)))
    sol = spl.spsolve(A, np.ones(len(yy)))
    h = np.zeros(m.shape, np.float64); h[inside] = sol
    h = np.sqrt(h / h.max())
    R = m.shape[0]
    idx = -np.ones((R, R), np.int64); pos = []
    ys, xs = np.nonzero(m)
    for k, (y, x) in enumerate(zip(ys, xs)):
        idx[y, x] = k
        pos.append([(x / R - 0.5) * size, (0.5 - y / R) * size, float(h[y, x]) * depth])
    n = len(pos)
    tris = []
    for y in range(R - 1):
        for x in range(R - 1):
            a, b, c, e = idx[y, x], idx[y, x + 1], idx[y + 1, x], idx[y + 1, x + 1]
            if a >= 0 and b >= 0 and c >= 0: tris.append([a, c, b])
            if b >= 0 and c >= 0 and e >= 0: tris.append([b, c, e])
    # smooth the staircase outline: Laplacian smoothing of x/y (front surface), stronger near the edge
    Pn = np.array(pos); T = np.array(tris)
    adj = sp.coo_matrix((np.ones(T.size * 2), (np.r_[T[:, 0], T[:, 1], T[:, 2], T[:, 1], T[:, 2], T[:, 0]], np.r_[T[:, 1], T[:, 2], T[:, 0], T[:, 0], T[:, 1], T[:, 2]])), shape=(n, n)).tocsr()
    adj.data[:] = 1; deg = np.asarray(adj.sum(1)).ravel(); deg[deg == 0] = 1
    w = np.clip(1 - Pn[:, 2] / (depth * 0.35), 0, 1)[:, None]
    for _ in range(12):
        avg = (adj @ Pn[:, :2]) / deg[:, None]
        Pn[:, :2] = Pn[:, :2] * (1 - 0.6 * w) + avg * 0.6 * w
    pos = Pn.tolist()
    back = [[p[0], p[1], -p[2]] for p in pos]
    tris_b = [[t[0] + n, t[2] + n, t[1] + n] for t in tris]
    P = np.round(np.array(pos + back), 4).ravel().tolist()
    I = np.array(tris + tris_b).ravel().tolist()
    return {'p': P, 'i': I}

sil = cv2.imread('public/guess2/pengu-sil.png', cv2.IMREAD_UNCHANGED)[..., 3] > 127
ys, xs = np.nonzero(sil); y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
s = max(y1 - y0, x1 - x0) + 40; cy, cx = (y0 + y1) // 2, (x0 + x1) // 2
crop = np.zeros((s, s), np.uint8)
sy, sx = cy - s // 2, cx - s // 2
for yy in range(s):
    src = sy + yy
    if 0 <= src < sil.shape[0]:
        row = sil[src, max(0, sx):min(sil.shape[1], sx + s)]
        off = max(0, -sx); crop[yy, off:off + len(row)] = row
peng = mesh_from_mask(crop, res=320, depth=0.36)
font = ImageFont.truetype('node_modules/@fontsource/inter-tight/files/inter-tight-latin-800-normal.woff2', 820)
img = Image.new('L', (1000, 1000), 0); ImageDraw.Draw(img).text((500, 520), '?', font=font, fill=255, anchor='mm')
q = mesh_from_mask(np.array(img) > 127, res=300, depth=0.5)
json.dump({'peng': peng, 'q': q}, open('art2/inflated.json', 'w'))
print(len(peng['p']) // 3, len(q['p']) // 3)
