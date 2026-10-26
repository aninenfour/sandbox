#!/usr/bin/env python3
"""Grid effect: cut any clip into a wall of tiles, each with its own crop, delay and treatment.

Pure Python (numpy + Pillow) and ffmpeg, no browser. Frames come in from ffmpeg as raw RGB,
get composed tile by tile and go back out to ffmpeg as raw RGB.

  python3 grid/grid.py in.mp4 out.mp4 --words "VANISHING ACT,RUG PULL" --kanji 消幽魔闇 --label "EP.III"

Scenes alternate on the beat: 'mosaic' (every tile its own crop and treatment), 'assemble'
(the tiles line up into the full frame, with a big word across them) and 'flash'
(one crop repeated in a checkerboard of treatments, with a red slash).
"""
import argparse, glob, json, math, os, random, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FS = os.path.join(ROOT, 'node_modules/@fontsource')

# Hotcoin palette
INK = (8, 8, 10)
PAPER = (243, 235, 216)
RED = (232, 52, 72)
GOLD = (232, 176, 74)
LIME = (184, 242, 106)
GREY = (90, 100, 120)


def font(path, size):
    return ImageFont.truetype(path, size)


MONO = '/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf'
TITLE = os.path.join(FS, 'anton/files/anton-latin-400-normal.woff2')


def cjk_font_for(ch):
    """Noto Sans SC ships as ~100 subset files; find the one that actually has this glyph."""
    files = sorted(glob.glob(os.path.join(FS, 'noto-sans-sc/files/*-900-normal.woff2')))
    probe = lambda f, c: np.asarray(ImageFont.truetype(f, 64).getmask(c)).tobytes()
    for f in files:
        if probe(f, ch) != probe(f, ''):  # private-use char: always the missing-glyph box
            return f
    sys.exit(f'no font in noto-sans-sc has {ch!r}')


def probe(path):
    out = subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                                   'stream=width,height,r_frame_rate:format=duration', '-of', 'json', path])
    j = json.loads(out)
    s = j['streams'][0]
    n, d = s['r_frame_rate'].split('/')
    return s['width'], s['height'], float(n) / float(d), float(j['format']['duration'])


# ---------- tile treatments (each takes and returns an HxWx3 uint8 array) ----------

def lum(a):
    return (a[..., 0] * 0.299 + a[..., 1] * 0.587 + a[..., 2] * 0.114) / 255.0


def duotone(a, dark, light, contrast=1.3):
    l = np.clip((lum(a) - 0.5) * contrast + 0.5, 0, 1)[..., None]
    return (np.array(dark) * (1 - l) + np.array(light) * l).astype(np.uint8)


def halftone(a, dark, light, cell=7):
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    dx = (xx % cell) / cell - 0.5
    dy = (yy % cell) / cell - 0.5
    dist = np.sqrt(dx * dx + dy * dy)
    dot = dist < (1 - lum(a)) * 0.72
    out = np.empty_like(a)
    out[:] = light
    out[dot] = dark
    return out


def pixelate(a, block=10):
    h, w = a.shape[:2]
    small = Image.fromarray(a).resize((max(1, w // block), max(1, h // block)), Image.BILINEAR)
    return np.asarray(small.resize((w, h), Image.NEAREST))


def rgb_split(a, shift=6):
    out = a.copy()
    out[:, shift:, 0] = a[:, :-shift, 0]
    out[:, :-shift, 2] = a[:, shift:, 2]
    return out


def ink(a, t=0.55):
    m = lum(a) > t
    out = np.empty_like(a)
    out[:] = INK
    out[m] = PAPER
    return out


def scanlines(a):
    g = (lum(a) * 255).astype(np.uint8)
    out = np.stack([g, g, g], -1)
    out[::3] = (out[::3] * 0.35).astype(np.uint8)
    return out


FX = {
    'plain': lambda a: a,
    'mono': lambda a: duotone(a, INK, PAPER, 1.1),
    'red': lambda a: duotone(a, INK, RED, 1.5),
    'redwhite': lambda a: duotone(a, RED, PAPER, 1.4),
    'gold': lambda a: duotone(a, INK, GOLD, 1.4),
    'lime': lambda a: duotone(a, INK, LIME, 1.4),
    'halftone': lambda a: halftone(a, INK, PAPER),
    'halftone_gold': lambda a: halftone(a, INK, GOLD, 6),
    'halftone_red': lambda a: halftone(a, RED, PAPER, 8),
    'pixel': pixelate,
    'rgb': rgb_split,
    'ink': ink,
    'scan': scanlines,
    'invert': lambda a: 255 - a,
}
# weights: mostly footage treatments, a few plain, graphic tiles handled separately
FX_WEIGHTS = {'plain': 3, 'mono': 4, 'red': 3, 'redwhite': 2, 'gold': 2, 'lime': 1, 'halftone': 3,
              'halftone_gold': 2, 'halftone_red': 1, 'pixel': 2, 'rgb': 2, 'ink': 3, 'scan': 2, 'invert': 1}
GRAPHICS = ['kanji', 'ring', 'cross', 'barcode', 'arrows', 'solid']


# ---------- graphic tiles ----------

def graphic_tile(kind, tw, th, t, rng_seed, kanji_fonts, kanji):
    r = random.Random(rng_seed)
    bg = r.choice([INK, INK, RED, (30, 30, 34), PAPER]) if kind != 'solid' else r.choice([RED, GOLD, INK])
    fg = PAPER if bg in (INK, RED, (30, 30, 34)) else INK
    if bg == INK and r.random() < 0.5:
        fg = RED
    im = Image.new('RGB', (tw, th), bg)
    d = ImageDraw.Draw(im)
    cx, cy = tw / 2, th / 2
    s = min(tw, th)
    if kind == 'kanji':
        ch = kanji[rng_seed % len(kanji)]
        f = font(kanji_fonts[ch], int(s * 0.7))
        d.text((cx, cy), ch, font=f, fill=fg, anchor='mm')
    elif kind == 'ring':
        rad = s * 0.22
        a0 = (t * 9 + rng_seed * 40) % 360
        d.arc([cx - rad, cy - rad, cx + rad, cy + rad], a0, a0 + 290, fill=fg if fg != INK else GOLD, width=3)
    elif kind == 'cross':
        rad = s * 0.18
        d.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], outline=RED, width=2)
        d.line([cx - rad * 1.6, cy, cx + rad * 1.6, cy], fill=RED, width=2)
        d.line([cx, cy - rad * 1.6, cx, cy + rad * 1.6], fill=RED, width=2)
        d.rectangle([cx - 3, cy - 3, cx + 3, cy + 3], fill=RED)
    elif kind == 'barcode':
        x = cx - s * 0.25
        while x < cx + s * 0.25:
            bw = r.choice([1, 2, 2, 3, 5])
            d.rectangle([x, cy - s * 0.08, x + bw - 1, cy + s * 0.08], fill=fg if fg != INK else GOLD)
            x += bw + r.choice([1, 2, 3])
    elif kind == 'arrows':
        for i in range(3):
            ox = cx - s * 0.18 + i * s * 0.12 + ((t * 2) % (s * 0.12))
            d.line([ox, cy - s * 0.08, ox + s * 0.07, cy, ox, cy + s * 0.08], fill=fg, width=3)
    return np.asarray(im)


# ---------- main ----------

def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('input')
    p.add_argument('output')
    p.add_argument('--w', type=int, default=1080)
    p.add_argument('--h', type=int, default=1350)
    p.add_argument('--cols', type=int, default=6)
    p.add_argument('--rows', type=int, default=7)
    p.add_argument('--gap', type=int, default=3)
    p.add_argument('--fps', type=float, default=None, help='default: source fps')
    p.add_argument('--start', type=float, default=0)
    p.add_argument('--dur', type=float, default=None)
    p.add_argument('--beat', type=int, default=15, help='frames per beat (15 at 30fps = 120 bpm)')
    p.add_argument('--words', default='VANISHING ACT,RUG PULL,ONE CLICK')
    p.add_argument('--kanji', default='消幽魔闇')
    p.add_argument('--label', default='HOTCOIN')
    p.add_argument('--seed', type=int, default=7)
    p.add_argument('--audio', default=None, help='audio file to mux; default: source audio if any')
    a = p.parse_args()

    rng = random.Random(a.seed)
    sw, sh, sfps, sdur = probe(a.input)
    fps = a.fps or sfps
    dur = a.dur or (sdur - a.start)
    nframes = int(dur * fps)
    W, H, C, R, G = a.w, a.h, a.cols, a.rows, a.gap
    words = [w.strip() for w in a.words.split(',') if w.strip()]
    kanji = list(a.kanji)
    kanji_fonts = {ch: cjk_font_for(ch) for ch in kanji}

    # tile rects (x0, y0, x1, y1), gaps between and around
    xs = [round(G + i * (W - G) / C) for i in range(C + 1)]
    ys = [round(G + j * (H - G) / R) for j in range(R + 1)]
    tiles = [(xs[i], ys[j], xs[i + 1] - G, ys[j + 1] - G) for j in range(R) for i in range(C)]

    # scene schedule in beats
    pattern = [('mosaic', 4), ('assemble', 2), ('mosaic', 3), ('flash', 1), ('mosaic', 3), ('assemble', 3), ('flash', 1)]
    schedule, f, k = [], 0, 0
    while f < nframes:
        kind, beats = pattern[k % len(pattern)]
        schedule.append((f, f + beats * a.beat, kind))
        f += beats * a.beat
        k += 1

    def scene_at(i):
        for n, (s, e, kind) in enumerate(schedule):
            if s <= i < e:
                return n, kind, s, e
        return len(schedule) - 1, schedule[-1][2], schedule[-1][0], schedule[-1][1]

    fx_names = list(FX_WEIGHTS)
    fx_w = [FX_WEIGHTS[n] for n in fx_names]

    def new_tile_state():
        if rng.random() < 0.14:
            return {'graphic': rng.choice(GRAPHICS), 'gseed': rng.randrange(10 ** 6)}
        z = rng.choice([1.0, 1.6, 2.2, 3.0, 4.0])
        return {'graphic': None, 'fx': rng.choices(fx_names, fx_w)[0], 'zoom': z,
                'cx': rng.uniform(0.2, 0.8), 'cy': rng.uniform(0.2, 0.8),
                'vx': rng.uniform(-1, 1) * 0.0015, 'vy': rng.uniform(-1, 1) * 0.0015,
                'delay': rng.choice([0, 0, 0, 3, 6, 12]), 'flip': rng.random() < 0.15}

    state = [new_tile_state() for _ in tiles]

    # ffmpeg in: source cover-cropped to W x H so 'assemble' tiles map 1:1 to the frame
    vf = f'scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={fps}'
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', str(a.start), '-t', str(dur), '-i', a.input,
                            '-vf', vf, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc_cmd = ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-']
    audio = a.audio
    if audio is None:
        has_audio = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index',
                                    '-of', 'csv=p=0', a.input], capture_output=True, text=True).stdout.strip()
        audio = a.input if has_audio else None
    if audio:
        enc_cmd += ['-ss', str(a.start if audio == a.input else 0), '-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-shortest']
    enc_cmd += ['-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', a.output]
    enc = subprocess.Popen(enc_cmd, stdin=subprocess.PIPE)

    label_f = font(MONO, 11)
    tc_f = font(MONO, 13)
    title_f = font(TITLE, int(W * 0.2))
    buf = []  # ring buffer of recent source frames for per-tile delay
    slash = None  # (start_frame, p0, p1)
    particles = [[rng.uniform(0, W), rng.uniform(0, H), rng.uniform(-0.3, 0.3), rng.uniform(-1.2, -0.3), rng.uniform(1.5, 3.5)]
                 for _ in range(40)]
    frame_bytes = W * H * 3

    for i in range(nframes):
        raw = dec.stdout.read(frame_bytes)
        if len(raw) < frame_bytes:
            break
        src = np.frombuffer(raw, np.uint8).reshape(H, W, 3)
        buf.append(src)
        if len(buf) > 13:
            buf.pop(0)

        n, kind, s0, s1 = scene_at(i)
        on_beat = (i - s0) % a.beat == 0
        if i == s0:  # scene change: reroll everything
            state = [new_tile_state() for _ in tiles]
            if kind == 'flash' or (kind == 'mosaic' and rng.random() < 0.5):
                ang = rng.uniform(-0.9, -0.4) if rng.random() < 0.5 else rng.uniform(0.4, 0.9)
                cx, cy = rng.uniform(0.3, 0.7) * W, rng.uniform(0.3, 0.7) * H
                L = math.hypot(W, H)
                slash = (i, (cx - math.cos(ang) * L, cy - math.sin(ang) * L), (cx + math.cos(ang) * L, cy + math.sin(ang) * L))
        elif on_beat and kind == 'mosaic':  # a third of the tiles change per beat
            for t in rng.sample(range(len(tiles)), len(tiles) // 3):
                state[t] = new_tile_state()

        out = np.empty((H, W, 3), np.uint8)
        out[:] = (14, 14, 16)
        flash_crop = None
        if kind == 'flash':
            st0 = state[0] if state[0]['graphic'] is None else {'cx': 0.5, 'cy': 0.5, 'zoom': 1.8}
            flash_crop = st0

        for ti, (x0, y0, x1, y1) in enumerate(tiles):
            tw, th = x1 - x0, y1 - y0
            st = state[ti]
            if kind == 'assemble':
                tile = src[y0:y1, x0:x1]
                col, row = ti % C, ti // C
                fxn = ['plain', 'redwhite', 'red', 'mono', 'halftone_red'][(col + row + n) % 5] if (col + row) % 2 else 'redwhite'
                tile = FX[fxn](tile)
            elif st['graphic'] and kind == 'mosaic':
                tile = graphic_tile(st['graphic'], tw, th, i, st['gseed'], kanji_fonts, kanji)
            else:
                cs = flash_crop if kind == 'flash' else st
                if kind != 'flash':
                    st['cx'] = min(0.95, max(0.05, st['cx'] + st['vx']))
                    st['cy'] = min(0.95, max(0.05, st['cy'] + st['vy']))
                frame = buf[max(0, len(buf) - 1 - (0 if kind == 'flash' else st['delay']))]
                cw = W / cs['zoom']
                ch = cw * th / tw
                if ch > H:
                    ch, cw = H, H * tw / th
                l = min(max(0, cs['cx'] * W - cw / 2), W - cw)
                t = min(max(0, cs['cy'] * H - ch / 2), H - ch)
                crop = Image.fromarray(frame).crop((int(l), int(t), int(l + cw), int(t + ch))).resize((tw, th), Image.BILINEAR)
                tile = np.asarray(crop)
                if kind != 'flash' and st['flip']:
                    tile = tile[:, ::-1]
                if kind == 'flash':
                    fxn = ['red', 'mono', 'ink', 'halftone_gold'][(ti % C + ti // C + (i - s0) // 3) % 4]
                else:
                    fxn = st['fx']
                tile = FX[fxn](np.ascontiguousarray(tile))
            out[y0:y1, x0:x1] = tile

        img = Image.fromarray(out)
        d = ImageDraw.Draw(img)

        # tiny tile labels, like a contact sheet
        for ti, (x0, y0, x1, y1) in enumerate(tiles):
            if (ti * 7 + n) % 5 == 0:
                d.rectangle([x0, y0, x0 + 62, y0 + 13], fill=INK)
                d.text((x0 + 3, y0 + 1), f'{a.label} {ti + 1:02d}', font=label_f, fill=PAPER if ti % 3 else RED)

        # drifting red embers
        for pt in particles:
            pt[0] += pt[2]
            pt[1] += pt[3]
            if pt[1] < -5:
                pt[0], pt[1] = rng.uniform(0, W), H + 5
            d.ellipse([pt[0] - pt[4] / 2, pt[1] - pt[4] / 2, pt[0] + pt[4] / 2, pt[1] + pt[4] / 2], fill=RED)

        # big word across the grid while it assembles
        if kind == 'assemble':
            word = words[(n // 2) % len(words)]
            prog = min(1, (i - s0) / 6)
            size = int(W * 0.17)
            f_ = font(TITLE, size)
            while d.textlength(word, font=f_) > W * 0.9:
                size = int(size * 0.92)
                f_ = font(TITLE, size)
            yc = H * 0.5
            lines = word.split(' ') if d.textlength(word, font=f_) > W * 0.9 or len(word) > 10 else [word]
            for li, ln in enumerate(lines):
                y = yc + (li - (len(lines) - 1) / 2) * size * 1.05
                x = W / 2 + (1 - prog) * 40 * (1 if li % 2 else -1)
                d.text((x + 6, y + 6), ln, font=f_, fill=INK, anchor='mm')
                d.text((x, y), ln, font=f_, fill=PAPER, anchor='mm')
            k_ch = kanji[n % len(kanji)]
            kf = font(kanji_fonts[k_ch], int(W * 0.16))
            d.text((W / 2, yc + size * (0.62 + 0.52 * len(lines)) + W * 0.04), k_ch, font=kf, fill=PAPER, anchor='mm')

        # red slash with glow
        if slash and i - slash[0] < 9:
            age = i - slash[0]
            grow = min(1, (age + 1) / 3)
            (ax, ay), (bx, by) = slash[1], slash[2]
            mx, my = (ax + bx) / 2, (ay + by) / 2
            p0 = (mx + (ax - mx) * grow, my + (ay - my) * grow)
            p1 = (mx + (bx - mx) * grow, my + (by - my) * grow)
            glow = Image.new('RGB', (W, H), 0)
            ImageDraw.Draw(glow).line([p0, p1], fill=RED, width=26)
            glow = glow.filter(ImageFilter.GaussianBlur(14))
            fade = 1 - max(0, age - 4) / 5
            img = Image.fromarray(np.clip(np.asarray(img, np.int16) + (np.asarray(glow, np.int16) * fade).astype(np.int16), 0, 255).astype(np.uint8))
            d = ImageDraw.Draw(img)
            d.line([p0, p1], fill=(255, 225, 225) if fade > 0.5 else RED, width=4)

        # timecode
        secs = i / fps
        tc = f'{int(secs // 60):02d}:{int(secs % 60):02d}:{int((secs % 1) * fps):02d}'
        x1, y1 = tiles[-1][2], tiles[-1][3]
        d.rectangle([x1 - 78, y1 - 20, x1, y1], fill=INK)
        d.text((x1 - 72, y1 - 18), tc, font=tc_f, fill=PAPER)

        enc.stdin.write(img.tobytes())
        if i % 60 == 0:
            print(f'frame {i}/{nframes} [{kind}]', file=sys.stderr)

    enc.stdin.close()
    enc.wait()
    dec.wait()
    print(a.output)


if __name__ == '__main__':
    main()
