# Original score for the dot anime test (10 s). numpy + soundfile, nothing sampled.
# 0-1 s soft pad (asleep) · 1.0 chime (eye opens) · 1.6-5.6 light plucked arpeggio · 5.6-6.4 rising build
# 6.4 soft whoosh-glide (hop) · 8.6 shimmer chord (flash) · resolve to the end.
import numpy as np, soundfile as sf, sys
SR = 48000; DUR = 10.0; N = int(SR * DUR); out = np.zeros((N, 2))
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, t0, pan=0.0, g=1.0):
    i = int(t0 * SR); j = min(N, i + len(sig)); s = sig[:j - i] * g
    out[i:j, 0] += s * (1 - max(0, pan)); out[i:j, 1] += s * (1 + min(0, pan))
def env(n, a, r):
    e = np.ones(n); na = min(n, int(a * SR)); nr = min(n - na, int(r * SR))
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e
def pad(ms, d):
    n = int(d * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * midi(m) * (1 + k) * t) for m in ms for k in (-.003, 0, .003)) / (3 * len(ms))
    return s * env(n, 1.0, 1.5)
def pluck(m, d=.9):
    n = int(d * SR); t = np.arange(n) / SR; f = midi(m)
    return (np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 5) * env(n, .004, .2)
def bell(m, d=2.0):
    n = int(d * SR); t = np.arange(n) / SR; f = midi(m)
    return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 3)) * np.exp(-t * 1.6) * env(n, .003, .4)
# pads: Fmaj9 -> Dm9 -> Bbmaj7 -> Fmaj9
for t0, ch, d in [(0, [53, 60, 64, 69], 3.4), (3.2, [50, 57, 60, 64], 3.0), (6.0, [46, 53, 57, 62], 2.8), (8.5, [53, 60, 64, 67, 72], 1.5)]:
    add(pad(ch, d + 0.4), t0, g=.5)
add(bell(84), 1.0, pan=.2, g=.35)
arp = [65, 69, 72, 76, 74, 72, 69, 72]
t = 1.6; k = 0
while t < 5.6:
    add(pluck(arp[k % len(arp)]), t, pan=(-.3 if k % 2 else .3), g=.22); t += .25; k += 1
# build 5.6-6.4: quick rising plucks
for i, m in enumerate([60, 62, 64, 65, 67, 69, 71, 72]):
    add(pluck(m + 12, .5), 5.6 + i * .1, g=.18 + i * .02)
# hop glide 6.4: sine sweep up, soft
n = int(1.2 * SR); tt = np.arange(n) / SR; f = 300 + 900 * (tt / 1.2) ** 1.5
add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.2) * env(n, .03, .3), 6.4, g=.12)
# shimmer 8.6
for i, m in enumerate([77, 81, 84, 88]):
    add(bell(m, 1.4), 8.6 + i * .04, pan=(i - 1.5) * .3, g=.16)
# room + fade + level
d = int(.13 * SR); out[d:, 0] += .22 * out[:-d, 1]; out[d:, 1] += .22 * out[:-d, 0]
out[-int(.8 * SR):] *= np.linspace(1, 0, int(.8 * SR))[:, None]
out *= 10 ** (-16 / 20) / np.sqrt(np.mean(out ** 2)); out /= max(1.0, np.abs(out).max() / .89)
sf.write(sys.argv[1] if len(sys.argv) > 1 else 'out/music.wav', out, SR); print('ok')
