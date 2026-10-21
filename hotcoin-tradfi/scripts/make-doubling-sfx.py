# Soundtrack for the "What If 01" Short (src/shorts/D01.tsx), synthesised so it hits exactly on every doubling.
# A kick and a pitched tick on each doubling (the tick climbs with the money), a noise riser under the whole
# climb that cuts at the end, then a soft chord under the lesson. Timing constants match D01.tsx.
# Usage: python3 scripts/make-doubling-sfx.py public/shorts/d01
import os, subprocess, sys
import numpy as np, soundfile as sf

OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
SR = 48000
T0, STEP, N = 1.2, 1.0, 40
tN = lambda n: T0 + (n - 1) * STEP
END_AT = tN(N) + 1.8
DUR = END_AT + 4.6
x = np.zeros(int(SR * DUR))
rng = np.random.default_rng(7)

def add(sig, at, gain=1.0):
    i = int(at * SR); j = min(len(x), i + len(sig)); x[i:j] += sig[: j - i] * gain

def kick(level):
    t = np.arange(int(SR * 0.32)) / SR
    f = 45 + 95 * np.exp(-t * 22)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * level

def tick(freq):
    t = np.arange(int(SR * 0.09)) / SR
    return (np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)) * np.exp(-t * 40)

for n in range(1, N + 1):
    p = (n - 1) / (N - 1)
    add(kick(0.55 + 0.35 * p), tN(n))
    add(tick(320 * (1500 / 320) ** p), tN(n), 0.22)

# riser: pink-ish noise, low-passed with a cutoff that opens as the money grows
t = np.arange(int(SR * END_AT)) / SR
white = rng.standard_normal(len(t))
pink = np.cumsum(white); pink -= np.convolve(pink, np.ones(2000) / 2000, mode='same'); pink /= np.abs(pink).max()
prog = np.clip((t - T0) / (END_AT - T0), 0, 1)
cut = 250 * (7000 / 250) ** prog
y = np.zeros_like(pink); a_prev = 0.0
alpha = 1 - np.exp(-2 * np.pi * cut / SR)
for i in range(len(pink)):  # one-pole low-pass with a moving cutoff
    a_prev += alpha[i] * (pink[i] - a_prev); y[i] = a_prev
y /= np.abs(y).max() + 1e-9
add(y * (0.05 + 0.35 * prog ** 2), 0)

# low drone that climbs an octave
fd = 55 * 2 ** prog
add(np.sin(2 * np.pi * np.cumsum(fd) / SR) * 0.12 * np.clip(t / 1.0, 0, 1), 0)

# the lesson: a soft major chord that swells in and fades out
tc = np.arange(int(SR * 4.6)) / SR
env = np.minimum(1, tc / 0.6) * np.exp(-tc * 0.35)
chord = sum(np.sin(2 * np.pi * fq * tc) for fq in (220, 277.18, 329.63, 440)) / 4
add(chord * env * 0.5, END_AT)

x /= np.abs(x).max() + 1e-9
raw = f'{OUT}/beat.raw.wav'
sf.write(raw, (x * 0.9).astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-16:TP=-1.5', '-ar', '48000', f'{OUT}/beat.wav'], check=True)
os.remove(raw)
print(f'{OUT}/beat.wav', round(DUR, 2), 's')
