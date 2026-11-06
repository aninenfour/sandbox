# Ambient original score for Anniv9Dots: slow evolving pad, soft low pulse, a granular shimmer swelling over every dot morph,
# a gentle bell when each shape settles, typing ticks at the URL. Mirrors DT in src/anniv9/Anniv9Dots.tsx. Output public/anniv9/dots.wav.
import numpy as np, soundfile as sf, os
SR, FPS = 48000, 30
M = [(36, 96), (168, 214), (276, 320), (380, 424), (486, 532)]; END = 640
DUR = END / FPS; N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(5)
def add(x, at, pan=0.0, g=1.0):
    i = int(at * SR); x = x[:max(0, N - i)] * g
    L[i:i + len(x)] += x * (1 - max(0, pan)); R[i:i + len(x)] += x * (1 + min(0, pan))
def env(n, a, d): t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
t = np.arange(N) / SR
# pad: slow chord cycle with detune and gentle filter-ish movement
chords = [[110, 164.8, 220, 277.2], [98, 146.8, 196, 246.9], [87.3, 130.8, 174.6, 220], [98, 146.8, 196, 293.7]]
seg = DUR / 4
for k, ch in enumerate(chords):
    a = k * seg; n = int((seg + 1.5) * SR); tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * tt) + np.sin(2 * np.pi * f * 1.003 * tt + 1) + 0.3 * np.sin(2 * np.pi * f * 2 * tt) for f in ch) / 10
    e = np.minimum(1, tt / 1.2) * np.minimum(1, (n / SR - tt) / 1.5)
    add(s * e * (0.75 + 0.25 * np.sin(2 * np.pi * tt / 5)) * 0.35, a)
# low pulse (heartbeat) from the first shape
for k in range(int((DUR - 2) / 1.0)):
    a = 1.2 + k * 1.0; n = int(0.5 * SR); tt = np.arange(n) / SR
    add(np.sin(2 * np.pi * (44 + 30 * np.exp(-tt / 0.05)) * tt) * env(n, 0.004, 0.18) * 0.35, a)
# shimmer over each morph + bell on settle
for (a, b) in M:
    n = int((b - a) / FPS * SR * 1.2); tt = np.arange(n) / SR; x = tt / tt[-1]
    grains = np.zeros(n)
    for _ in range(140):
        p = int(rng.random() * (n - 3000)); m = 2400; f = rng.choice([1760, 2093, 2349, 2637, 3136])
        grains[p:p + m] += np.sin(2 * np.pi * f * np.arange(m) / SR) * np.hanning(m) * 0.08
    add(grains * np.sin(np.pi * x) * 0.9, a / FPS, pan=float(rng.uniform(-0.4, 0.4)))
    m = int(2.5 * SR); tt = np.arange(m) / SR
    add(sum(np.sin(2 * np.pi * f * tt) * g for f, g in [(880, 1), (1320, .5), (1760, .3)]) * env(m, 0.003, 0.9) * 0.12, b / FPS)
# typing ticks at the URL scene
for k in range(27):
    m = int(0.012 * SR); add(rng.standard_normal(m) * env(m, 0.0005, 0.003) * 0.08, (M[4][1] - 4 + k * 1.4) / FPS)
mix = np.stack([L, R], 1); f0 = int((DUR - 1.5) * SR); mix[f0:] *= np.linspace(1, 0, N - f0)[:, None]
mix = mix / np.max(np.abs(mix)) * 0.85
os.makedirs('public/anniv9', exist_ok=True); sf.write('public/anniv9/dots.wav', mix, SR); print('ok', DUR)
