# Original score for the Hotcoin dot 3D runner test (20 s). numpy + scipy + soundfile, nothing sampled.
# 118 BPM synthwave-style pulse in A minor (Am, F, C, G), soft, with quiet sound effects cued to the picture:
# 0-2.95 s rain bed, pad, ticking hat; 0.5 blink tick; 2.95 dash whoosh, kick and pulse bass start;
# 5.0 / 6.6 / 11.2 ring chimes; 7.65 wall-run swoosh; 9.95 red candle thud; 12.1 jump whoosh; 13.3 landing thud,
# drums drop out; 15.1 sign flicker buzz; 15.8 logo light-pass shimmer; 16.85 flight whoosh; 18.2 soft pop into the logo;
# 19.0 final chord. Normalised to about -16 LUFS integrated, peaks under -1 dBFS.
# Run: python3 social/dot-3d/make-music.py social/dot-3d/out/music.wav
import sys
import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy.signal import butter, lfilter

SR = 48000; DUR = 20.0; N = int(SR * DUR); BEAT = 60 / 118
out = np.zeros((N, 2)); rng = np.random.default_rng(118)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, t0, pan=0.0, g=1.0):
    i = int(t0 * SR)
    if i >= N: return
    j = min(N, i + len(sig)); s = sig[:j - i] * g
    out[i:j, 0] += s * (1 - max(0, pan)); out[i:j, 1] += s * (1 + min(0, pan))
def env(n, a, r):
    e = np.ones(n); na = min(n, int(a * SR)); nr = min(n - na, int(r * SR))
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e
def lp(x, fc, order=2): b, a = butter(order, fc / (SR / 2)); return lfilter(b, a, x)
def hp(x, fc, order=2): b, a = butter(order, fc / (SR / 2), 'high'); return lfilter(b, a, x)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)
def saw(f, n, det=(-.006, 0, .006)):
    t = np.arange(n) / SR
    return sum(2 * ((f * (1 + d) * t) % 1) - 1 for d in det) / len(det)

CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
BASS = [45, 41, 36, 43]
BAR = 4 * BEAT
def chord_at(t): return int(t // (2 * BAR)) % 4

# pad: warm filtered saws, one chord per 2 bars, swells
for k in range(int(DUR / (2 * BAR)) + 1):
    t0 = k * 2 * BAR; ch = CHORDS[k % 4]; n = int((2 * BAR + 1.2) * SR)
    s = sum(saw(midi(m), n) for m in ch + [ch[0] + 12]) / 4
    add(lp(s, 1400) * env(n, .5, 1.2), t0, g=.16)
# end chord: Am add9, long tail
n = int(2.2 * SR); s = sum(saw(midi(m), n) for m in [45, 57, 60, 64, 71]) / 5
add(lp(s, 2200) * env(n, .05, 1.8), 19.0, g=.22)

# pulse bass: 8th notes, side-chained to the kick, from the dash to the landing
t = 2.95
while t < 13.3:
    n = int(BEAT / 2 * SR); f = midi(BASS[chord_at(t)])
    s = lp(saw(f, n, (-.003, .003)), 520) * env(n, .004, .06) * (1 - .55 * np.exp(-np.arange(n) / SR * 18))
    add(s, t, g=.42); t += BEAT / 2
# soft held bass after landing
for t0, m, d in [(13.3, 45, 2.0), (15.3, 41, 1.9), (17.2, 43, 1.8)]:
    n = int(d * SR); add(lp(saw(midi(m), n, (-.003, .003)), 300) * env(n, .2, .8), t0, g=.3)

# arpeggio: 16th plucks through the run, then a slower one for the reveal
def pluck(m, d=.22):
    n = int(d * SR); tt = np.arange(n) / SR; f = midi(m)
    return lp(saw(f, n, (0,)), 2600) * np.exp(-tt * 14) * env(n, .002, .03)
t = 3.0; k = 0
while t < 13.25:
    ch = CHORDS[chord_at(t)]; m = (ch + [ch[0] + 12])[k % 4] + 12
    add(pluck(m), t, pan=(-.35 if k % 2 else .35), g=.12); t += BEAT / 4; k += 1
t = 15.0; k = 0
while t < 19.0:
    ch = CHORDS[chord_at(t)]; m = (ch + [ch[0] + 12])[k % 4] + 12
    add(pluck(m, .4), t, pan=(-.3 if k % 2 else .3), g=.1); t += BEAT / 2; k += 1

# drums: soft kick on quarters, closed hats on offbeats
def kick(g=1.0):
    n = int(.32 * SR); tt = np.arange(n) / SR; f = 46 + 80 * np.exp(-tt * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 10) * g
def hat(d=.045):
    n = int(d * SR); return hp(rng.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR * 70)
t = 2.95
while t < 13.3: add(kick(), t, g=.55); add(hat(), t + BEAT / 2, pan=.2, g=.08); t += BEAT
t = .25
while t < 2.9: add(hat(.03), t, pan=-.2, g=.035); t += BEAT / 2

# ---- sound effects (quiet, under the music) ----
def noise(d): return rng.standard_normal(int(d * SR))
def whoosh(d, lo, hi, g):
    n = int(d * SR); x = noise(d); tt = np.arange(n) / SR; k = tt / d
    s = sum(bp(x, lo + (hi - lo) * a, lo + (hi - lo) * a + 900) * w for a, w in [(.2, 1), (.5, 1), (.8, 1)]) / 3
    s *= np.sin(np.pi * k) ** 2
    return s * g
def chime(t0, root):
    for i, m in enumerate([root, root + 4, root + 7, root + 12]):
        n = int(1.0 * SR); tt = np.arange(n) / SR; f = midi(m)
        s = (np.sin(2 * np.pi * f * tt) + .4 * np.sin(2 * np.pi * f * 2.01 * tt) * np.exp(-tt * 6)) * np.exp(-tt * 4.5) * env(n, .002, .2)
        add(s, t0 + i * .035, pan=(i - 1.5) * .25, g=.09)
def thud(t0, g):
    n = int(.6 * SR); tt = np.arange(n) / SR; f = 38 + 60 * np.exp(-tt * 14)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 6) + .3 * lp(noise(.6), 300) * np.exp(-tt * 12)
    add(s, t0, g=g)
add(np.sin(2 * np.pi * 2200 * np.arange(int(.04 * SR)) / SR) * np.exp(-np.arange(int(.04 * SR)) / SR * 120), .5, g=.04)  # blink tick
add(whoosh(.6, 300, 2500, 1), 2.8, g=.22)                       # dash
for r, root in [(5.0, 81), (6.6, 84), (11.2, 88)]: chime(r - .02, root); add(whoosh(.35, 1500, 5000, 1), r - .2, g=.12)
add(whoosh(.9, 800, 3000, 1), 7.55, pan=.3, g=.2)               # wall-run
add(whoosh(.5, 400, 1800, 1), 9.5, g=.12); thud(9.95, .5)     # candle drop + impact
add(whoosh(.8, 500, 3500, 1), 12.0, g=.2)                       # jump
thud(13.3, .38)                                                 # landing
for i, (a, b) in enumerate([(15.1, 15.16), (15.26, 15.34), (15.4, 15.9)]):  # sign flicker buzz (mains hum + clicks)
    n = int((b - a) * SR); tt = np.arange(n) / SR
    s = (np.sign(np.sin(2 * np.pi * 120 * tt)) * .3 + bp(noise(b - a), 2000, 4000) * .4) * env(n, .003, .02)
    add(lp(s, 3000), a, g=.07)
n = int(1.0 * SR); add(hp(noise(1.0), 6000) * np.sin(np.pi * np.arange(n) / n) ** 2, 15.8, g=.06)  # light pass shimmer
add(whoosh(1.3, 600, 4000, 1), 16.85, g=.2)                     # flight home
n = int(.25 * SR); tt = np.arange(n) / SR; add(np.sin(2 * np.pi * (600 + 500 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 18), 18.2, g=.12)  # pop
# rain bed
rain = hp(lp(noise(DUR), 9000), 1500) * .5
out[:, 0] += rain[:N] * .02; out[:, 1] += np.roll(rain, 997)[:N] * .02

# room, fades, loudness
d = int(.11 * SR); out[d:, 0] += .18 * out[:-d, 1]; out[d:, 1] += .18 * out[:-d, 0]
out[:int(.05 * SR)] *= np.linspace(0, 1, int(.05 * SR))[:, None]
out[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR))[:, None] ** 1.5
meter = pyln.Meter(SR); out = pyln.normalize.loudness(out, meter.integrated_loudness(out), -16.0)
pk = np.abs(out).max(); lim = 10 ** (-1.2 / 20)
if pk > lim: out *= lim / pk  # simple peak safety
print('LUFS', round(meter.integrated_loudness(out), 2), 'peak dBFS', round(20 * np.log10(np.abs(out).max()), 2))
sf.write(sys.argv[1] if len(sys.argv) > 1 else 'music.wav', out.astype(np.float32), SR)
