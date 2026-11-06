# Original bed for Anniv9Stack: shimmer while the 9 draws, deep hit when it fills, fly-through whoosh, groove under the cards,
# whoosh per card fly-past, typing clicks and a Go chime. Mirrors ST in src/anniv9/Anniv9Stack.tsx. Output public/anniv9/stack.wav.
import numpy as np, soundfile as sf, os
SR, FPS = 48000, 30
ST = dict(draw=30, fill=44, fly=72, c0=92, t1=172, c1=190, t2=246, c2=264, fin=320, end=440)
DUR = ST['end'] / FPS; N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(11)
def add(x, at, pan=0.0, g=1.0):
    i = int(at * SR); x = x[:max(0, N - i)] * g
    L[i:i + len(x)] += x * (1 - max(0, pan)); R[i:i + len(x)] += x * (1 + min(0, pan))
def env(n, a, d): t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
s = lambda fr: fr / FPS
# shimmer riser during the draw
n = int(s(ST['fill']) * SR); t = np.arange(n) / SR; x = t / t[-1]
sh = sum(np.sin(2 * np.pi * f * t * (1 + 0.15 * x)) for f in (880, 1320, 1760)) / 3
add(sh * x ** 1.5 * 0.18 + rng.standard_normal(n) * x ** 3 * 0.05, 0)
# fill hit
m = int(2.2 * SR); t = np.arange(m) / SR
add(np.tanh(np.sin(2 * np.pi * (38 + 70 * np.exp(-t / 0.07)) * t) * np.exp(-t / 0.6) * 1.7) * 0.85, s(ST['fill']))
add(sum(np.sin(2 * np.pi * f * t) for f in (440, 554.4, 659.3, 880)) / 4 * env(m, 0.01, 0.9) * 0.22, s(ST['fill']))
# whooshes
def whoosh(a, b, g=0.55):
    n = int(s(b - a) * SR * 1.4); t = np.arange(n) / SR
    sm = np.convolve(rng.standard_normal(n), np.ones(50) / 50, 'same'); e = np.sin(np.pi * np.clip(t / (n / SR), 0, 1)) ** 2
    add(sm * e * g, s(a), pan=-0.35); add(sm[::-1] * e * g * 0.7, s(a), pan=0.35)
for a, b in [(ST['fly'], ST['c0']), (ST['t1'], ST['c1']), (ST['t2'], ST['c2']), (ST['fin'], ST['fin'] + 20)]: whoosh(a, b)
# groove from the fly-through to the finale
B = 0.5
for k in range(int((s(ST['fin']) - s(ST['c0'])) / B)):
    a = s(ST['c0']) + k * B; n = int(0.3 * SR); t = np.arange(n) / SR
    add(np.sin(2 * np.pi * (48 + 80 * np.exp(-t / 0.03)) * t) * env(n, 0.002, 0.13) * 0.55, a)
    h = int(0.04 * SR); add(np.diff(np.concatenate([[0], rng.standard_normal(h)])) * env(h, 0.001, 0.01) * 0.08, a + B / 2, pan=0.3)
chords = [[220, 261.6, 329.6], [196, 246.9, 293.7], [174.6, 220, 261.6], [196, 246.9, 329.6]]
for j, a in enumerate(np.arange(s(ST['c0']), DUR, 2.0)):
    n = int(2.3 * SR); t = np.arange(n) / SR
    add(sum(np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) for f in chords[j % 4]) / 6 * np.minimum(1, t / 0.3) * np.minimum(1, (n / SR - t) / 0.5) * 0.15, a)
# typing + go
for k in range(27):
    m = int(0.015 * SR); add(rng.standard_normal(m) * env(m, 0.0005, 0.004) * 0.12, s(ST['fin'] + 26 + k * 1.6))
m = int(1.4 * SR); t = np.arange(m) / SR
add((np.sin(2 * np.pi * 1318.5 * t) + 0.6 * np.sin(2 * np.pi * 1975.5 * t)) * env(m, 0.002, 0.4) * 0.2, s(ST['fin'] + 26 + 27 * 1.6 + 8))
mix = np.stack([L, R], 1); f0 = int((DUR - 0.8) * SR); mix[f0:] *= np.linspace(1, 0, N - f0)[:, None]
mix = mix / np.max(np.abs(mix)) * 0.88
os.makedirs('public/anniv9', exist_ok=True); sf.write('public/anniv9/stack.wav', mix, SR); print('ok', DUR)
