# Builds the photo assets for the TOKEN2049 wrap-up video (src/wrap/Wrap.tsx) from public/live/*.jpg:
#   public/wrap/c_<name>.jpg      600x600 card crops
#   public/wrap/c_<name>_m<N>.jpg the same crop as an N-blocks-wide pixel mosaic (for the pixel resolve)
#   public/wrap/h_<name>.jpg      1440x1080 hero crops (+ _m<N> mosaics)
import os
from PIL import Image

SRC, OUT = 'public/live', 'public/wrap'
os.makedirs(OUT, exist_ok=True)
FLOOD = ['p3', 's2', 'p11', 't1', 'p15', 's3', 'p14', 'p24', 's4', 'p5', 't2', 'p19', 's7', 'p25', 'p12', 't3',
         'p21', 's8', 'p26', 'p10', 's5', 't4', 'p17', 'p9', 's1', 'p20', 's6', 'p13', 'p27', 't5', 'p4', 's9']
HERO = ['p7', 'p18']
FOCUS = {'s2': (0.6, 0.45), 's3': (0.55, 0.42), 's1': (0.45, 0.4), 'p3': (0.4, 0.4), 'p11': (0.5, 0.4), 's8': (0.5, 0.48),
         'p9': (0.5, 0.35), 'p8': (0.5, 0.35), 't5': (0.5, 0.62), 'p23': (0.5, 0.6), 's5': (0.5, 0.4), 's6': (0.5, 0.4), 's7': (0.45, 0.4),
         't1': (0.5, 0.55), 't2': (0.5, 0.35), 't3': (0.5, 0.35), 't4': (0.5, 0.5), 'p19': (0.5, 0.35), 'p24': (0.5, 0.4)}


def crop(im, aspect, fx, fy):
    w, h = im.size
    if w / h > aspect:
        cw, ch = int(h * aspect), h
    else:
        cw, ch = w, int(w / aspect)
    x = min(max(0, int(fx * w - cw / 2)), w - cw)
    y = min(max(0, int(fy * h - ch / 2)), h - ch)
    return im.crop((x, y, x + cw, y + ch))


def mosaics(im, base, levels):
    for n in levels:
        m = im.resize((n, max(1, round(n * im.height / im.width))), Image.BILINEAR).resize(im.size, Image.NEAREST)
        m.save(f'{OUT}/{base}_m{n}.jpg', quality=90)


for n in FLOOD:
    im = Image.open(f'{SRC}/{n}.jpg').convert('RGB')
    c = crop(im, 1, *FOCUS.get(n, (0.5, 0.45))).resize((600, 600), Image.LANCZOS)
    c.save(f'{OUT}/c_{n}.jpg', quality=90)
    mosaics(c, f'c_{n}', [6, 12, 24])
for n in HERO:
    im = Image.open(f'{SRC}/{n}.jpg').convert('RGB')
    c = crop(im, 4 / 3, 0.5, 0.5).resize((1440, 1080), Image.LANCZOS)
    c.save(f'{OUT}/h_{n}.jpg', quality=92)
    mosaics(c, f'h_{n}', [8, 16, 32, 64])
print('ok', len(os.listdir(OUT)))
