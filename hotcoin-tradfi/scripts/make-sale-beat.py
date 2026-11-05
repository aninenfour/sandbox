# Soft original bed for SaleFlow: warm pad + light pulse, an airy whoosh on every card move, a chime when each card lands.
# Timing mirrors src/sale/SaleFlow.tsx (HOLD 48, MOVE 20 frames at 30 fps, 8 cards). Output public/sale/beat.wav.
import numpy as np, soundfile as sf, os
SR = 48000; FPS = 30; HOLD, MOVE, NC = 48, 20, 8
DUR = ((HOLD + MOVE) * NC + 30) / FPS
N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(3)
def add(x, at, pan=0.0, g=1.0):
    i = int(at * SR); x = x[:max(0, N - i)] * g
    L[i:i + len(x)] += x * (1 - max(0, pan)); R[i:i + len(x)] += x * (1 + min(0, pan))
def env(n, a, d):
    t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
# pad: slow chord changes per card
chords = [[220, 277.2, 329.6], [196, 246.9, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7]]
for k in range(NC):
    t0 = k * (HOLD + MOVE) / FPS; n = int(((HOLD + MOVE) / FPS + 0.6) * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.003 * t) for f in chords[k % 4]) / 6
    e = np.minimum(1, t / 0.4) * np.minimum(1, (n / SR - t) / 0.6)
    add(s * e * 0.18, t0)
# pulse: soft kick + shaker at 120 bpm
B = 0.5
for k in range(int(DUR / B)):
    n = int(0.3 * SR); t = np.arange(n) / SR
    add(np.sin(2 * np.pi * (50 + 70 * np.exp(-t / 0.03)) * t) * env(n, 0.002, 0.12) * 0.5, k * B)
    m = int(0.04 * SR); add(np.diff(np.concatenate([[0], rng.standard_normal(m)])) * env(m, 0.001, 0.01) * 0.08, k * B + B / 2, pan=0.3)
# whoosh per move, chime per landing
for k in range(1, NC):
    start = (k * (HOLD + MOVE) - MOVE) / FPS; n = int(MOVE / FPS * SR * 1.3); t = np.arange(n) / SR
    noise = rng.standard_normal(n); sm = np.convolve(noise, np.ones(40) / 40, 'same')
    e = np.sin(np.pi * np.clip(t / (n / SR), 0, 1)) ** 2
    add(sm * e * 0.5, start, pan=-0.4); add(sm[::-1] * e * 0.35, start, pan=0.4)
    land = k * (HOLD + MOVE) / FPS; m = int(1.2 * SR); tt = np.arange(m) / SR
    add((np.sin(2 * np.pi * 1318.5 * tt) + 0.5 * np.sin(2 * np.pi * 1975.5 * tt)) * env(m, 0.002, 0.35) * 0.12, land)
mix = np.stack([L, R], 1); f0 = int((DUR - 1.0) * SR); mix[f0:] *= np.linspace(1, 0, N - f0)[:, None]
mix = mix / np.max(np.abs(mix)) * 0.88
os.makedirs('public/sale', exist_ok=True); sf.write('public/sale/beat.wav', mix, SR); print('ok', DUR)
