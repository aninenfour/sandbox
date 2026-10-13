"""Point-cloud "3D scan" shot from a single photo, in the style of the Model 10 reference.

Runs on an Apple Silicon Mac (PyTorch MPS) or any CUDA/CPU machine:
  python3 -m venv .venv && source .venv/bin/activate
  pip install torch transformers pillow numpy opencv-python
  python3 scripts/r10-scan/scan.py photo.jpg --out out/r10/scan-01 --frames 90 --yaw -18 18 --pitch 6 -2

Steps: depth from Depth Anything V2 (downloads the model from Hugging Face on first run), subject mask from the
depth map, a dense dot grid lifted into 3D, a slow camera orbit, and the reference look: white dots, yellow-green
mid-tones, red rim on one edge, black background, soft glow. Writes PNG frames plus an mp4 if ffmpeg is on PATH.
--depth luminance skips the model (rough, for testing the renderer only).
"""
import argparse, math, os, shutil, subprocess
import numpy as np, cv2
from PIL import Image


def estimate_depth(img_rgb, model_id):
    import torch
    from transformers import pipeline
    dev = 'mps' if torch.backends.mps.is_available() else ('cuda' if torch.cuda.is_available() else 'cpu')
    pipe = pipeline('depth-estimation', model=model_id, device=dev)
    d = np.array(pipe(Image.fromarray(img_rgb))['predicted_depth'].squeeze().cpu().numpy(), np.float32)
    d = cv2.resize(d, (img_rgb.shape[1], img_rgb.shape[0]), interpolation=cv2.INTER_CUBIC)
    return (d - d.min()) / (d.max() - d.min() + 1e-6)  # Depth Anything: larger = closer


def luminance_depth(img_rgb):
    g = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255
    h, w = g.shape; yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dome = np.sqrt(np.clip(1 - ((xx - w / 2) / (w * 0.5)) ** 2 - ((yy - h * 0.55) / (h * 0.6)) ** 2, 0, 1))
    return np.clip(dome * 0.75 + cv2.GaussianBlur(g, (0, 0), 3) * 0.3, 0, 1)


def subject_mask(depth):
    d8 = (depth * 255).astype(np.uint8)
    t, _ = cv2.threshold(d8, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    m = (d8 > t * 0.85).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    if n > 1: m = (lab == 1 + np.argmax(st[1:, 4])).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    return m


def render(img_rgb, depth, mask, yaw, pitch, W, H, pitch_px=2, relief=0.45, zoom=1.0, rim_side=-1):
    h, w = depth.shape
    ys, xs = np.mgrid[0:h:pitch_px, 0:w:pitch_px]
    keep = mask[ys, xs] > 0
    ys, xs = ys[keep], xs[keep]
    z = (depth[ys, xs] - 0.5) * relief
    X = (xs - w / 2) / max(h, w); Y = (ys - h / 2) / max(h, w)
    cy, sy, cp, sp = math.cos(yaw), math.sin(yaw), math.cos(pitch), math.sin(pitch)
    x1 = X * cy + z * sy; z1 = -X * sy + z * cy
    y2 = Y * cp - z1 * sp; z2 = Y * sp + z1 * cp
    f = 1.8; s = H * 1.05 * zoom
    px = (W / 2 + s * x1 / (f - z2)).astype(np.int32); py = (H / 2 + s * y2 / (f - z2)).astype(np.int32)
    # shading: surface normal from the depth gradient, key light from upper right, green fill, red rim
    gx = cv2.Sobel(depth, cv2.CV_32F, 1, 0, ksize=5)[ys, xs]; gy = cv2.Sobel(depth, cv2.CV_32F, 0, 1, ksize=5)[ys, xs]
    nx, ny, nz = -gx * 6, -gy * 6, np.ones_like(gx); nn = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
    key = np.clip((nx * 0.55 - ny * 0.6 + nz * 0.55) / nn, 0, 1)
    albedo = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)[ys, xs].astype(np.float32) / 255
    lum = np.clip(0.25 + 0.85 * key * (0.55 + 0.45 * albedo), 0, 1)
    edge = cv2.distanceTransform(mask, cv2.DIST_L2, 5)[ys, xs]
    rim = (edge < 10) & ((xs < w * 0.5) if rim_side < 0 else (xs > w * 0.5))
    col = np.stack([lum, lum, lum], -1) * 255                        # white highlights
    mid = (lum > 0.25) & (lum < 0.62)
    col[mid] = np.stack([lum[mid] * 205, lum[mid] * 238, lum[mid] * 90], -1)  # yellow-green mid-tones
    col[rim] = (235, 70, 40)
    order = np.argsort(z2)  # far to near
    canvas = np.zeros((H, W, 3), np.float32)
    ok = (px >= 1) & (px < W - 1) & (py >= 1) & (py < H - 1)
    idx = order[ok[order]]
    canvas[py[idx], px[idx]] = col[idx]  # near points are written last and win
    canvas = cv2.dilate(canvas, np.ones((2, 2), np.uint8))
    glow = cv2.GaussianBlur(canvas, (0, 0), 7) * 0.45
    return np.clip(canvas + glow, 0, 255).astype(np.uint8)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('photo'); ap.add_argument('--out', default='out/r10/scan')
    ap.add_argument('--frames', type=int, default=90); ap.add_argument('--fps', type=int, default=30)
    ap.add_argument('--yaw', type=float, nargs=2, default=(-18, 18)); ap.add_argument('--pitch', type=float, nargs=2, default=(6, -2))
    ap.add_argument('--zoom', type=float, nargs=2, default=(1.0, 1.12)); ap.add_argument('--relief', type=float, default=0.45)
    ap.add_argument('--size', default='1920x1080'); ap.add_argument('--depth', choices=['model', 'luminance'], default='model')
    ap.add_argument('--model', default='depth-anything/Depth-Anything-V2-Large-hf')
    a = ap.parse_args()
    W, H = map(int, a.size.split('x'))
    img = cv2.cvtColor(cv2.imread(a.photo), cv2.COLOR_BGR2RGB)
    scale = 900 / max(img.shape[:2]); img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    depth = estimate_depth(img, a.model) if a.depth == 'model' else luminance_depth(img)
    mask = subject_mask(depth)
    os.makedirs(a.out, exist_ok=True)
    cv2.imwrite(os.path.join(a.out, 'depth.png'), (depth * 255).astype(np.uint8)); cv2.imwrite(os.path.join(a.out, 'mask.png'), mask * 255)
    for k in range(a.frames):
        t = k / max(1, a.frames - 1); e = t * t * (3 - 2 * t)
        fr = render(img, depth, mask, math.radians(a.yaw[0] + (a.yaw[1] - a.yaw[0]) * e), math.radians(a.pitch[0] + (a.pitch[1] - a.pitch[0]) * e),
                    W, H, relief=a.relief, zoom=a.zoom[0] + (a.zoom[1] - a.zoom[0]) * e)
        cv2.imwrite(os.path.join(a.out, f'f{k:04d}.png'), cv2.cvtColor(fr, cv2.COLOR_RGB2BGR))
    if shutil.which('ffmpeg'):
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(a.fps), '-i', os.path.join(a.out, 'f%04d.png'),
                        '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', a.out.rstrip('/') + '.mp4'], check=True)
    print('done', a.out)


if __name__ == '__main__':
    main()
