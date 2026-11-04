# Original 120 BPM score for the CMC rank video (15 s). Riser during the rank climb, impact on the lock (6.0 s),
# groove under the stats, button at the CTA. Output: public/rank/beat.wav (48 kHz stereo).
import numpy as np, soundfile as sf, os
SR = 48000; DUR = 15.0; BPM = 120; B = 60 / BPM
N = int(SR * DUR); L = np.zeros(N); R = np.zeros(N)
t_all = np.arange(N) / SR
rng = np.random.default_rng(7)

def add(sig, at, pan=0.0, gain=1.0):
    i = int(at * SR); sig = sig[: max(0, N - i)] * gain
    L[i:i + len(sig)] += sig * (1 - max(0, pan)); R[i:i + len(sig)] += sig * (1 + min(0, pan))

def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)

def kick(g=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 48 + 120 * np.exp(-t / 0.035); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(2.2 * np.sin(ph) * env(n, 0.001, 0.16)) * g

def hat(open_=False):
    n = int((0.22 if open_ else 0.05) * SR); x = rng.standard_normal(n)
    x = np.diff(np.concatenate([[0], x]))  # crude high-pass
    return x * env(n, 0.0005, 0.07 if open_ else 0.012) * 0.22

def clap():
    n = int(0.3 * SR); x = rng.standard_normal(n); e = np.zeros(n)
    for k in range(3): e += env(n, 0.0005, 0.01) * (np.arange(n) >= int(k * 0.011 * SR))
    e += env(n, 0.001, 0.09) * 0.6
    return np.diff(np.concatenate([[0], x])) * e * 0.35

def bass(freq, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * freq * t)) * 0.3 + np.sin(2 * np.pi * freq * t)
    return np.tanh(s * 1.4) * env(n, 0.004, dur * 0.6) * 0.33

def chord(freqs, dur, g=0.12):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for det in (-0.004, 0.004): s += np.sin(2 * np.pi * f * (1 + det) * t + np.sin(2 * np.pi * f * 2 * t) * 0.4)
    return s / len(freqs) * env(n, 0.01, dur * 0.7) * g

# intro (0-2 s): filtered pulse + hats
for k in range(4): add(kick(0.7), k * B)
for k in range(8): add(hat(), k * B / 2 + B / 2 * (k % 2 == 0) * 0, pan=0.3 * (-1) ** k)

# climb (2-6 s): riser + accelerating ticks
rs, re_ = 2.0, 6.0; n = int((re_ - rs) * SR); t = np.arange(n) / SR
sweep = 2 * np.pi * np.cumsum(180 * 2 ** (t / (re_ - rs) * 3)) / SR
riser = (np.sin(sweep) * 0.5 + rng.standard_normal(n) * 0.25 * (t / (re_ - rs))) * (t / (re_ - rs)) ** 2 * 0.35
add(riser, rs, pan=0.0)
tick = 0.0
while tick < re_ - rs - 0.05:
    m = int(0.012 * SR); add(np.sin(2 * np.pi * 2400 * np.arange(m) / SR) * env(m, 0.0005, 0.004) * 0.25, rs + tick, pan=0.2)
    tick += 0.16 * (1 - tick / (re_ - rs)) + 0.035
for k in range(8): add(kick(0.55 + k * 0.05), rs + k * B)

# lock impact (6.0 s)
n = int(2.2 * SR); t = np.arange(n) / SR
boom = np.sin(2 * np.pi * (38 + 60 * np.exp(-t / 0.08)) * t) * np.exp(-t / 0.7) * 0.9
add(np.tanh(boom * 1.5) + rng.standard_normal(n) * np.exp(-t / 0.05) * 0.4, 6.0)
add(chord([220, 277.18, 329.63, 440], 2.0, 0.16), 6.0)

# groove (6-13 s)
prog = [(55.0, [220, 261.63, 329.63]), (43.65, [174.61, 220, 261.63]), (65.41, [196, 261.63, 329.63]), (49.0, [196, 246.94, 293.66])]
for bar in range(4):
    t0 = 6.0 + bar * 4 * B * 0.875
for k in range(int((13.0 - 6.0) / B)):
    at = 6.0 + k * B
    add(kick(), at)
    if k % 2 == 1: add(clap(), at, pan=-0.1)
    add(hat(), at + B / 2, pan=0.25); add(hat(), at + B / 4, pan=-0.25, gain=0.6)
    f, ch = prog[(k // 4) % 4]
    add(bass(f, B * 0.45), at + B / 2)
    if k % 4 == 0: add(chord(ch, 4 * B, 0.09), at)
# stop-time + button (13-15 s)
add(kick(1.1), 13.0); add(chord([261.63, 329.63, 392, 523.25], 2.0, 0.2), 13.0); add(clap(), 13.0)
add(kick(0.8), 13.5); add(hat(True), 13.75)

mix = np.stack([L, R], 1)
fade = np.ones(N); f0 = int(14.2 * SR); fade[f0:] = np.linspace(1, 0, N - f0); mix *= fade[:, None]
mix = np.tanh(mix * 1.1) / np.max(np.abs(np.tanh(mix * 1.1))) * 0.89
os.makedirs('public/rank', exist_ok=True); sf.write('public/rank/beat.wav', mix, SR)
print('ok', mix.shape)
