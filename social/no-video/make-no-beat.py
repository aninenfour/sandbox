# Original score for the "No." video. 120 BPM, 19.5 s. numpy + soundfile, nothing sampled.
# 0 to 1.5 s: one soft low thud on "No.", then silence. 1.5 s: warm chords start. 5.5 s: pulse + hats under the app screens.
# 11.5 s: drops back to chords ("We do one thing."). 13 s: lift on "properly." 15.5 s: end chord, long tail.
import numpy as np, soundfile as sf, sys
SR = 48000; DUR = 19.5; BEAT = 0.5
N = int(SR * DUR); out = np.zeros((N, 2))
t_all = np.arange(N) / SR
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR); j = min(N, i + len(sig)); s = sig[:j - i] * gain
    out[i:j, 0] += s * (1 - max(0, pan)); out[i:j, 1] += s * (1 + min(0, pan))
def env(n, a, r):
    e = np.ones(n); na = min(n, int(a * SR)); nr = min(n - na, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr) ** 2; return e
def keys(m, dur):  # soft electric-piano-ish tone
    n = int(dur * SR); t = np.arange(n) / SR; f = midi(m)
    s = np.sin(2 * np.pi * f * t + 0.6 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 3))
    s += 0.25 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 2)
    return s * np.exp(-t * 0.9) * env(n, 0.008, 0.4)
def pad(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = midi(m)
    s = sum(np.sin(2 * np.pi * f * (1 + d) * t) for d in (-0.004, 0, 0.004)) / 3
    return s * env(n, 0.6, 1.2)
def kick(g=1.0):
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 48 + 90 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * g
def hat():
    n = int(0.05 * SR); t = np.arange(n) / SR
    s = np.random.default_rng(int(t.size)).standard_normal(n); s = np.diff(np.concatenate([[0], s]))
    return s * np.exp(-t * 90) * 0.12
def bass(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = midi(m)
    return (np.sin(2 * np.pi * f * t) + 0.2 * np.sin(2 * np.pi * 2 * f * t)) * env(n, 0.01, 0.15)

# "No." : one muted low thud, then silence
add(kick(0.9), 0.0); add(bass(31, 1.1) * np.exp(-np.arange(int(1.1 * SR)) / SR * 3), 0.0, gain=0.5)
# chord changes every 2 beats from 1.5 s: Dmaj9 / Bm9 / Gmaj9 / A6sus
CH = [[50, 57, 62, 66, 69, 76], [47, 54, 59, 62, 66, 73], [43, 50, 55, 59, 62, 69], [45, 52, 57, 59, 64, 66]]
t = 1.5; k = 0
while t < 15.5:
    c = CH[k % 4]
    for i, m in enumerate(c[1:]):
        add(keys(m, 1.2), t + i * 0.012, pan=(i - 2) * 0.18, gain=0.11)
    add(pad(c[0] + 12, 1.1), t, gain=0.05)
    if 5.5 <= t < 11.5 or 13 <= t:
        add(bass(c[0] - 12, 0.9), t, gain=0.22)
    t += 2 * BEAT; k += 1
# pulse under the app screens and the lift on "properly."
b = 5.5
while b < 15.5:
    if b < 11.5 or b >= 13:
        add(kick(0.55), b)
        add(hat(), b + BEAT / 2, pan=0.3)
        if b >= 7.5: add(hat(), b + BEAT / 4, pan=-0.3, gain=0.6); add(hat(), b + 3 * BEAT / 4, pan=-0.3, gain=0.6)
    b += BEAT
# end card: Dmaj9 held, small high bell on the dot landing (~17.9 s)
for i, m in enumerate([50, 57, 62, 66, 69, 76]):
    add(keys(m, 4.0) * 1.0, 15.5 + i * 0.03, pan=(i - 2.5) * 0.15, gain=0.12)
    add(pad(m, 4.0), 15.5, gain=0.04)
add(bass(38, 3.0), 15.5, gain=0.22); add(kick(0.6), 15.5)
add(keys(93, 1.6), 17.9, pan=0.2, gain=0.05)
# gentle room: short stereo slapback
d = int(0.11 * SR); out[d:, 0] += 0.18 * out[:-d, 1]; out[d:, 1] += 0.18 * out[:-d, 0]
# fade tail, normalise to about -15 LUFS-ish (RMS) with peak guard
out[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR))[:, None]
rms = np.sqrt(np.mean(out[int(1.5 * SR):] ** 2)); out *= 10 ** (-17 / 20) / rms
out /= max(1.0, np.abs(out).max() / 0.89)
sf.write(sys.argv[1] if len(sys.argv) > 1 else 'out/no-music.wav', out, SR)
print('ok')
