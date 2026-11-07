# Original PS2-era-flavoured score for EarnPS2 (no samples): airy pad + deep drone, a sleepy music-box loop while the coin is
# bored, a menu "blip" and select chime, an "item get" fanfare arpeggio, a light beat under the growth, coin clinks in the rain.
# Mirrors ET in src/earn/EarnScene.tsx. Output public/earn/beat.wav.
import numpy as np, soundfile as sf, os
SR, FPS = 48000, 30
ET = dict(menu=96, click=150, item=176, land=220, grow=300, rain=420, end=540)
DUR = ET['end'] / FPS; N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(2)
s = lambda fr: fr / FPS
def add(x, at, pan=0.0, g=1.0):
    i = int(at * SR); x = x[:max(0, N - i)] * g
    L[i:i + len(x)] += x * (1 - max(0, pan)); R[i:i + len(x)] += x * (1 + min(0, pan))
def env(n, a, d): t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
def tone(f, dur, a=0.004, d=0.3, wave='sin'):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) if wave == 'sin' else np.sign(np.sin(2 * np.pi * f * t)) * 0.4 + np.sin(2 * np.pi * f * t) * 0.6
    return x * env(n, a, d)
t = np.arange(N) / SR
# drone + pad across the whole piece
add((np.sin(2 * np.pi * 55 * t) * 0.25 + np.sin(2 * np.pi * 82.4 * t) * 0.12) * np.minimum(1, t / 2), 0)
for k, ch in enumerate([[220, 261.6, 329.6], [196, 246.9, 329.6], [174.6, 220, 293.7], [196, 246.9, 293.7], [220, 277.2, 329.6]]):
    a = k * DUR / 5; n = int((DUR / 5 + 1.2) * SR); tt = np.arange(n) / SR
    p = sum(np.sin(2 * np.pi * f * tt) + np.sin(2 * np.pi * f * 1.004 * tt) for f in ch) / 8
    add(p * np.minimum(1, tt / 0.8) * np.minimum(1, (n / SR - tt) / 1.0) * 0.28, a)
# sleepy music box while bored
for k, f in enumerate([659.3, 523.3, 440, 392, 440, 523.3, 392, 329.6]):
    add(tone(f, 1.2, 0.002, 0.5) * 0.18, 0.2 + k * 0.38, pan=0.2)
# menu blips + select chime
for k in range(3): add(tone(1200 + k * 150, 0.12, 0.001, 0.04, 'sq') * 0.15, s(ET['menu'] + 12 + k * 12))
add(tone(1568, 0.6, 0.001, 0.15) * 0.25 + tone(2093, 0.6, 0.001, 0.2) * 0.18, s(ET['click']))
# item get: rising arpeggio + bright chord + sub hit
for k, f in enumerate([523.3, 659.3, 784, 1046.5, 1318.5, 1568]):
    add(tone(f, 0.5, 0.002, 0.2, 'sq') * 0.14, s(ET['land']) - 0.45 + k * 0.075, pan=(k % 2 - 0.5) * 0.4)
m = int(2.2 * SR); tt = np.arange(m) / SR
add(sum(np.sin(2 * np.pi * f * tt) for f in (523.3, 659.3, 784, 1046.5)) / 4 * env(m, 0.005, 0.8) * 0.3, s(ET['land']))
add(np.tanh(np.sin(2 * np.pi * (45 + 60 * np.exp(-tt / 0.06)) * tt) * np.exp(-tt / 0.5) * 1.5) * 0.6, s(ET['land']))
# light beat from the item onward
B = 0.5
for k in range(int((DUR - s(ET['land']) - 1) / B)):
    a = s(ET['land']) + k * B; n = int(0.3 * SR); tt = np.arange(n) / SR
    add(np.sin(2 * np.pi * (50 + 70 * np.exp(-tt / 0.03)) * tt) * env(n, 0.002, 0.12) * 0.45, a)
    h = int(0.04 * SR); add(np.diff(np.concatenate([[0], rng.standard_normal(h)])) * env(h, 0.001, 0.01) * 0.07, a + B / 2, pan=0.3)
# coin clinks while stacks grow and in the rain
for k in range(40):
    a = s(ET['grow']) + rng.random() * (s(ET['end']) - s(ET['grow']) - 1)
    add(tone(3200 + rng.random() * 900, 0.15, 0.0005, 0.04) * 0.08, a, pan=float(rng.uniform(-0.6, 0.6))); add(tone(4700, 0.1, 0.0005, 0.02) * 0.04, a)
mix = np.stack([L, R], 1); f0 = int((DUR - 1.0) * SR); mix[f0:] *= np.linspace(1, 0, N - f0)[:, None]
mix = mix / np.max(np.abs(mix)) * 0.86
os.makedirs('public/earn', exist_ok=True); sf.write('public/earn/beat.wav', mix, SR); print('ok', DUR)
