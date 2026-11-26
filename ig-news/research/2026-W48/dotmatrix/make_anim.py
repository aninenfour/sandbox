#!/usr/bin/env python3
"""4 s 9:16 test: the bull's LEDs switch on in a sweep (each dot flashes white, then settles to green),
then the line fades in. Writes anim.mp4 (1080x1920, 30 fps, H.264) + anim_preview.gif (360 px).
    python3 ig-news/research/2026-W48/dotmatrix/make_anim.py"""
import subprocess, sys, tempfile
from pathlib import Path
import numpy as np
from PIL import Image
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parents[2] / 'tools'))
from make_concepts import cut, MINT
from dotmatrix import Board

W, H, FPS, SEC = 1080, 1920, 30, 4.0
b = Board(W, H, pitch=12)
b.place(cut('bull', 'isnet-general-use'), 500, 900, w=1040, floor=.18, detail=1.2, equalize=.4)
b.fade_edge(1180, 1380)
X, Y, V, C, Hh, F = b.cells()
rng = np.random.default_rng(1)
# sweep from the bull's nose (right) to its back (left), with jitter so it sparkles instead of wiping
nose = np.array([820, 880])
d = np.hypot(X - nose[0], Y - nose[1]); d = d / d.max()
delay = .15 + 1.75 * d + rng.uniform(0, .45, d.shape)
DUR = .45                                    # seconds a dot takes from off to settled

tmp = Path(tempfile.mkdtemp())
n = int(SEC * FPS)
for f in range(n):
    t = f / FPS
    reveal = np.clip((t - delay) / DUR, 0, 1)
    img = b.render(reveal=reveal, ss=2)
    a = float(np.clip((t - 2.55) / .45, 0, 1))
    if a > 0:
        top = Board.copy(img.copy(), 'Bull or bear?\nYou pick.', (72, 1530), 100, accent=('Bull', MINT))
        img = Image.blend(img, top, a)
    Board.logo(img, 'tl', 40, margin=72)
    img.save(tmp / f'f{f:04d}.png')
    if f % 20 == 0:
        print('frame', f, flush=True)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / 'f%04d.png'),
                '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', str(HERE / 'anim.mp4')], check=True)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(HERE / 'anim.mp4'), '-vf',
                'fps=15,scale=360:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=3',
                str(HERE / 'anim_preview.gif')], check=True)
print('ok', HERE / 'anim.mp4')
