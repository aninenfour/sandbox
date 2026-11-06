# Original bed for Anniv9Flow: accelerating-then-braking ticks for cards 1-8, a bright "clock" chime + bass hit on 9,
# then a light groove with whooshes on each card move, and a button chime at the finale. Mirrors TL in src/anniv9/Anniv9Flow.tsx.
import numpy as np, soundfile as sf, os
SR, FPS = 48000, 30
TL = dict(count=66, nine=114, m1=132, h1=204, m2=222, h2=276, m3=294, h3=348, end=468)
DUR = TL['end'] / FPS; N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(9)
def add(x, at, pan=0.0, g=1.0):
    i = int(at * SR); x = x[:max(0, N - i)] * g
    L[i:i + len(x)] += x * (1 - max(0, pan)); R[i:i + len(x)] += x * (1 + min(0, pan))
def env(n, a, d): t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
def back_out(x): return 1 - (1 - x) ** 4  # quartic ease-out, same as posAt
# ticks: when the carousel crosses each integer 1..8
prev = 0
for fr in range(TL['count'] + 1):
    v = 8 * back_out(fr / TL['count'])
    for k in range(int(np.floor(prev)) + 1, int(np.floor(v)) + 1):
        if 1 <= k <= 8:
            m = int(0.03 * SR); t = np.arange(m) / SR
            add(np.sin(2 * np.pi * (1800 + k * 120) * t) * env(m, 0.0005, 0.008) * 0.35, fr / FPS, pan=(-0.3 if k % 2 else 0.3))
    prev = v
# riser into the 9
n = int(TL['count'] / FPS * SR); t = np.arange(n) / SR; x = t / t[-1]
add((np.sin(2 * np.pi * np.cumsum(200 * 2 ** (x * 2.5)) / SR) * 0.3 + rng.standard_normal(n) * 0.12 * x) * x ** 2 * 0.3, 0)
# clock on 9: chime + sub hit
at9 = TL['count'] / FPS
m = int(2.0 * SR); t = np.arange(m) / SR
add(sum(np.sin(2 * np.pi * f * t) * a for f, a in [(1046.5, 1), (1568, .6), (2093, .35)]) * env(m, 0.002, 0.5) * 0.25, at9)
add(np.tanh(np.sin(2 * np.pi * (40 + 70 * np.exp(-t / 0.06)) * t) * np.exp(-t / 0.5) * 1.6) * 0.8, at9)
# groove after 9
B = 0.5; start = at9
for k in range(int((TL['h3'] / FPS - start) / B)):
    a = start + k * B; n = int(0.3 * SR); t = np.arange(n) / SR
    add(np.sin(2 * np.pi * (50 + 80 * np.exp(-t / 0.03)) * t) * env(n, 0.002, 0.13) * 0.55, a)
    h = int(0.04 * SR); add(np.diff(np.concatenate([[0], rng.standard_normal(h)])) * env(h, 0.001, 0.01) * 0.09, a + B / 2, pan=0.3)
chords = [[220, 277.2, 329.6], [196, 246.9, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7]]
for j, a in enumerate(np.arange(start, TL['end'] / FPS, 2.0)):
    n = int(2.2 * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t) + 0.4 * np.sin(4 * np.pi * f * t) for f in chords[j % 4]) / 6
    add(s * np.minimum(1, t / 0.3) * np.minimum(1, (n / SR - t) / 0.5) * 0.16, a)
# whooshes for card moves + finale
for a, b in [(TL['nine'], TL['m1']), (TL['h1'], TL['m2']), (TL['h2'], TL['m3']), (TL['h3'], TL['h3'] + 22)]:
    n = int((b - a) / FPS * SR * 1.3); t = np.arange(n) / SR
    sm = np.convolve(rng.standard_normal(n), np.ones(40) / 40, 'same'); e = np.sin(np.pi * np.clip(t / (n / SR), 0, 1)) ** 2
    add(sm * e * 0.5, a / FPS, pan=-0.4); add(sm[::-1] * e * 0.35, a / FPS, pan=0.4)
# typing clicks + go chime
for k in range(26):
    m = int(0.015 * SR); add(rng.standard_normal(m) * env(m, 0.0005, 0.004) * 0.12, (TL['h3'] + 26 + k * 1.6) / FPS)
go = (TL['h3'] + 26 + 26 * 1.6 + 8) / FPS; m = int(1.4 * SR); t = np.arange(m) / SR
add((np.sin(2 * np.pi * 1318.5 * t) + 0.6 * np.sin(2 * np.pi * 1975.5 * t)) * env(m, 0.002, 0.4) * 0.2, go)
mix = np.stack([L, R], 1); f0 = int((DUR - 0.8) * SR); mix[f0:] *= np.linspace(1, 0, N - f0)[:, None]
mix = mix / np.max(np.abs(mix)) * 0.88
os.makedirs('public/anniv9', exist_ok=True); sf.write('public/anniv9/beat.wav', mix, SR); print('ok', DUR)
