# Builds the 9:16 "scroll" cut for Reels/TikTok: the 4:5 ink video on a tall rice-paper sheet with feathered edges.
# Run: python3 social/dot-3d/make-scroll-916.py <in-4x5.mp4> <out-9x16.mp4>
import subprocess, sys, os, numpy as np
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
tmp = os.path.join(os.path.dirname(dst), '_scroll')
os.makedirs(tmp, exist_ok=True)
rng = np.random.default_rng(7)
W, H, VH = 1080, 1920, 1350
# paper: warm off-white with fibres and soft blotches (matches the shader's #f1ebdd paper)
base = np.array([241, 235, 221], float)
fine = rng.normal(0, 4.0, (H, W))
blot = np.array(Image.fromarray(rng.normal(128, 40, (H // 24, W // 24)).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), float) - 128
fib = np.array(Image.fromarray(rng.normal(128, 60, (H // 2, W // 16)).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), float) - 128
paper = base[None, None, :] + (fine + blot * .06 + fib * .025)[:, :, None]
Image.fromarray(paper.clip(0, 255).astype(np.uint8)).save(f'{tmp}/paper.png')
# feathered alpha mask for the painting (soft deckle edge at top and bottom)
y = np.arange(VH)[:, None]; edge = np.minimum(y, VH - 1 - y).astype(float)
wob = np.array(Image.fromarray(rng.normal(128, 70, (1, W // 6)).clip(0, 255).astype(np.uint8)).resize((W, 1), Image.BICUBIC), float) / 255
a = np.clip((edge - 10 - 30 * wob) / 50, 0, 1)
Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3)).save(f'{tmp}/mask.png')
top = (H - VH) // 2
subprocess.run(['/usr/bin/ffmpeg', '-loglevel', 'error', '-y', '-loop', '1', '-i', f'{tmp}/paper.png', '-i', src, '-loop', '1', '-i', f'{tmp}/mask.png',
  '-filter_complex', f'[1:v]format=rgba[v];[2:v]format=gray,scale={W}:{VH}[m];[v][m]alphamerge[vm];[0:v][vm]overlay=0:{top}:shortest=1,format=yuv420p[o]',
  '-map', '[o]', '-map', '1:a?', '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-c:a', 'copy', '-movflags', '+faststart', dst], check=True)
print('ok', dst)
