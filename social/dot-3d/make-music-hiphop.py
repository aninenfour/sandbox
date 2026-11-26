# Original hip-hop score for the dot 3D test v2/v3 (20 s). numpy + scipy + soundfile, nothing sampled.
# Boom-bap at 92.75 BPM, downbeat grid starts at the dash (2.95 s) so beat 16 lands on the rooftop landing (13.30 s).
# Music only, no sound effects: 0-2.95 s filtered beat teaser + keys + reverse cymbal into the dash; 2.95 full beat,
# 808, whistle hook; hat rolls into the ring boosts; snare fill into the drop; 13.30 drop (808 hit), bouncy wiggle
# groove, scratch on the look back (14.27); 14.92 groove back with the hook; 19.0 end chord and tape stop. About -16 LUFS.
# Run: python3 social/dot-3d/make-music-hiphop.py social/dot-3d/out/music-v2.wav
import sys
import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy.signal import butter, lfilter

SR = 48000; DUR = 20.0; N = int(SR * DUR); BEAT = 60 / 92.75; T0 = 2.95; DROP = T0 + 16 * BEAT
out = np.zeros((N, 2)); rng = np.random.default_rng(93)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, t0, pan=0.0, g=1.0, buf=None):
    o = out if buf is None else buf
    i = int(round(t0 * SR))
    if i >= N or i + len(sig) <= 0: return
    if i < 0: sig = sig[-i:]; i = 0
    j = min(N, i + len(sig)); s = sig[:j - i] * g
    o[i:j, 0] += s * (1 - max(0, pan)); o[i:j, 1] += s * (1 + min(0, pan))
def env(n, a, r):
    e = np.ones(n); na = min(n, int(a * SR)); nr = min(n - na, int(r * SR))
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e
def lp(x, fc, o=2): b, a = butter(o, fc / (SR / 2)); return lfilter(b, a, x)
def hp(x, fc, o=2): b, a = butter(o, fc / (SR / 2), 'high'); return lfilter(b, a, x)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)
def noise(d): return rng.standard_normal(int(d * SR))
def beat_t(b): return T0 + b * BEAT  # b can be fractional; swing applied by callers

# ---- instruments ----
def kick(g=1.0):
    n = int(.42 * SR); t = np.arange(n) / SR; f = 50 + 110 * np.exp(-t * 32)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5) + .25 * hp(noise(.42), 2500) * np.exp(-t * 120)
    return np.tanh(s * 1.6) * g
def snare(g=1.0):
    n = int(.3 * SR); t = np.arange(n) / SR
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 22)
    nz = bp(noise(.3), 1200, 7000) * np.exp(-t * 15)
    clap = sum(bp(noise(.3), 900, 3000) * np.exp(-np.maximum(0, t - d) * 40) * (t >= d) for d in (0, .011, .022))
    return (body * .6 + nz * .9 + clap * .5) * g
def hat(open_=False, g=1.0):
    d = .22 if open_ else .05; n = int(d * SR); t = np.arange(n) / SR
    return hp(noise(d), 7500) * np.exp(-t * (14 if open_ else 75)) * g
def b808(m, d):
    n = int(d * SR); t = np.arange(n) / SR; f = midi(m) * (1 + .5 * np.exp(-t * 40))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return np.tanh(s * 1.8) * np.exp(-t * 1.3) * env(n, .003, .08)
def keys(ms, d, bright=1.0):  # dusty electric piano (FM)
    n = int(d * SR); t = np.arange(n) / SR; s = 0
    for m in ms:
        f = midi(m); s = s + np.sin(2 * np.pi * f * t + 1.1 * bright * np.sin(2 * np.pi * f * t) * np.exp(-t * 3))
    s = s / len(ms) * np.exp(-t * .8) * env(n, .006, .3)
    return lp(s, 3500) * (1 + .15 * np.sin(2 * np.pi * 5 * t))  # wobble like an old tape
CH = [[57, 60, 64, 67], [53, 57, 60, 64], [50, 53, 57, 60], [52, 56, 59, 62]]  # Am7 Fmaj7 Dm7 E7
ROOT = [33, 29, 26, 28]

# ---- intro: crackle, keys, riser ----
crk = np.zeros(N); idx = rng.integers(0, N, 900); crk[idx] = rng.standard_normal(900) * 3
crk = hp(crk, 1500) + hp(lp(noise(DUR), 5000), 800)[:N] * .05
out[:, 0] += crk * .012; out[:, 1] += np.roll(crk, 1211) * .012
add(lp(keys(CH[0], 1.5, .6), 1800), .02, g=.3); add(lp(keys(CH[1], 1.6, .6), 1800), 1.45, g=.3)
n = int(1.1 * SR); t = np.arange(n) / SR; add(hp(noise(1.1), 4000) * (t / 1.1) ** 3, 1.85, g=.22)  # reverse cymbal into the dash

# ---- main groove: 2.95 to 13.30 (16 beats = 4 bars) ----
SW = .085  # swing on the off-16ths, in beats
def groove(b0, b1, light=False):
    for b in range(b0, b1):
        t = beat_t(b); bar_b = b % 4; chord = (b // 4) % 4
        # kick: 1, the "and" of 2, 3 (boom-bap)
        if bar_b in (0, 2): add(kick(), t, g=.75 if not light else .5)
        if bar_b == 1: add(kick(.8), beat_t(b + .5), g=.6 if not light else .4)
        if bar_b in (1, 3): add(snare(), t, g=.55 if not light else .4)
        for k in range(4):  # 16th hats with swing
            tk = beat_t(b + k / 4 + (SW if k % 2 else 0))
            add(hat(g=(.9 if k == 0 else .5 + .2 * rng.random())), tk, pan=.25, g=.14 if not light else .1)
        if bar_b == 3 and not light: add(hat(True), beat_t(b + .5), pan=-.2, g=.08)
        if bar_b == 0:  # keys + 808 per bar
            add(keys(CH[chord], 4 * BEAT + .3), t, g=.26 if not light else .22, pan=-.1)
            add(b808(ROOT[chord] + 12, 1.6 * BEAT), t, g=.5 if not light else .35)
            add(b808(ROOT[chord] + 12, .9 * BEAT), beat_t(b + 2.5), g=.38 if not light else .28)
groove(0, 16)
# filtered teaser of the groove before the dash (like hearing it through a wall), opening up as he charges
teaser = np.zeros((N, 2))
for b in range(-4, 0):
    t = beat_t(b); bar_b = b % 4
    if bar_b in (0, 2): add(kick(), t, g=.75, buf=teaser)
    if bar_b == 1: add(kick(.8), beat_t(b + .5), g=.6, buf=teaser)
    if bar_b in (1, 3): add(snare(), t, g=.5, buf=teaser)
    for k in range(4): add(hat(g=.6), beat_t(b + k / 4 + (SW if k % 2 else 0)), g=.1, buf=teaser)
add(b808(ROOT[0] + 12, 2 * BEAT), beat_t(-4), g=.4, buf=teaser)
for ch_ in range(2): teaser[:, ch_] = lp(teaser[:, ch_], 450)
out += teaser * 1.3
# whistle hook (A minor pentatonic), call and response over the groove
def whistle(m, d):
    n = int(d * SR); tt = np.arange(n) / SR; f = midi(m) * (1 + .006 * np.sin(2 * np.pi * 5.5 * tt) * np.clip(tt / .15, 0, 1))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) + .08 * np.sin(4 * np.pi * np.cumsum(f) / SR) + .05 * bp(noise(d), 1500, 5000)
    return s * env(n, .03, min(.12, d * .4))
HOOK = [(0, 76, .6), (.75, 74, .6), (1.5, 72, .45), (2, 69, .9), (3, 72, .4), (3.5, 74, .45),
        (4, 76, .6), (4.5, 79, .6), (5.25, 76, .6), (6, 74, .45), (6.5, 72, .45), (7, 69, 1.2)]
def hook(b0, g=.13):
    for (o, m, d) in HOOK: add(whistle(m, d * BEAT * 1.6), beat_t(b0 + o), pan=.15, g=g)
hook(4); hook(12, .11)
# snare fill into the drop
for k in range(8): add(snare(.5 + k * .07), DROP - BEAT / 2 + k * BEAT / 16, pan=(-.2 if k % 2 else .2), g=.32)
# hat rolls into each ring boost
for r in (5.0, 6.6, 11.2):
    for k in range(6): add(hat(g=.7), r - .26 + k * BEAT / 8, pan=.3, g=.1)

# ---- drop + rooftop wiggle ----
add(b808(33, 1.2), DROP, g=.7); add(kick(1.2), DROP, g=.8); add(hat(True), DROP, g=.1)
for k in range(4):  # bouncy half-beat kicks and claps under the wiggle
    tk = DROP + .12 + k * BEAT / 2
    add(kick(.9), tk, g=.55) if k % 2 == 0 else add(snare(.8), tk, g=.45)
# scratch on the look back: a bright stab read back and forth like a record under a hand
stab = keys([69, 72, 76, 81], .5, 1.6) + .3 * bp(noise(.5), 800, 4000)
def scratch(t0, moves):
    pieces = []
    for (d, a, b) in moves:  # duration, start/end positions in the stab (seconds)
        n = int(d * SR); u = np.linspace(0, 1, n); pos = a + (b - a) * (.5 - .5 * np.cos(np.pi * u))
        idx = np.clip((pos * SR).astype(int), 0, len(stab) - 1); pieces.append(stab[idx] * np.sin(np.pi * u) ** .5)
    s = np.concatenate(pieces); add(hp(s, 300), t0, g=.5)
scratch(14.27 - .04, [(.07, 0, .09), (.06, .09, .02), (.09, .02, .14), (.08, .14, 0)])
add(snare(1.1), 14.27 + .36, g=.5); add(kick(), 14.92, g=.6)

# ---- reveal groove 15.0 onward, lighter ----
bstart = int(np.ceil((14.92 - T0) / BEAT)); bend = int((19.0 - T0) / BEAT)
groove(bstart, bend, light=True)
hook(bstart + 1, .1)
# end chord + tape stop
n = int(1.4 * SR); t = np.arange(n) / SR
end = keys([45, 57, 60, 64, 71], 1.4, .8); rate = np.clip(1 - (t / 1.2) ** 1.6, 0, 1); pos = np.cumsum(rate) / SR
end_stop = np.interp(pos * SR, np.arange(len(end)), end) * np.clip(rate * 3, 0, 1)
add(lp(end_stop, 2500), 19.0, g=.5); add(b808(33, 1.0), 19.0, g=.45)

# ---- mix bus: light glue, fades, loudness ----
out = np.tanh(out * 1.2) / 1.2
out[:int(.03 * SR)] *= np.linspace(0, 1, int(.03 * SR))[:, None]
out[-int(.6 * SR):] *= np.linspace(1, 0, int(.6 * SR))[:, None]
meter = pyln.Meter(SR); out = pyln.normalize.loudness(out, meter.integrated_loudness(out), -16.0)
pk = np.abs(out).max(); lim = 10 ** (-1.2 / 20)
if pk > lim: out *= lim / pk
print('LUFS', round(meter.integrated_loudness(out), 2), 'peak dBFS', round(20 * np.log10(np.abs(out).max()), 2))
sf.write(sys.argv[1] if len(sys.argv) > 1 else 'music-v2.wav', out.astype(np.float32), SR)
