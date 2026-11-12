# Original soft sound design for the CoinGlass #13 video (numpy + soundfile). No samples, no copyrighted audio.
# Warm pad bed, airy low-passed whooshes (no hard edges), quiet wooden ticks as Hotcoin passes each row, a soft chime on #13.
# Timings mirror scene.mjs (window.P). Run: python3 social/coinglass-collab/audio.py out/sfx.wav
import sys, numpy as np, soundfile as sf
SR, DUR = 48000, 13.0
N = int(SR * DUR); t = np.arange(N) / SR
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)

def add(sig, at, gain, pan=0.0):
    i = int(at * SR); n = min(len(sig), N - i)
    if n <= 0: return
    L[i:i + n] += sig[:n] * gain * np.sqrt(0.5 * (1 - pan)) * 1.414
    R[i:i + n] += sig[:n] * gain * np.sqrt(0.5 * (1 + pan)) * 1.414

def onepole(x, fc):  # time-varying one-pole low-pass, fc may be an array
    fc = np.broadcast_to(fc, x.shape); a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for k in range(len(x)): s = (1 - a[k]) * x[k] + a[k] * s; y[k] = s
    return y

# 1. pad: Amaj9-ish voicing, slow attack, gentle detune and swell into the hero moment
def pad_voice(f):
    ph = 2 * np.pi * f * t
    return (np.sin(ph) + 0.5 * np.sin(ph * 1.003 + 1) + 0.25 * np.sin(2 * ph * 0.998)) / 1.75
chord = [110, 164.81, 220, 277.18, 329.63, 415.30]
pad = sum(pad_voice(f) * (0.9 if f < 200 else 0.55) for f in chord)
env = np.clip(t / 1.2, 0, 1) * (0.75 + 0.25 * np.clip((t - 8.6) / 1.5, 0, 1)) * np.clip((DUR - t) / 1.8, 0, 1)
pad = onepole(pad * env, 900 + 900 * np.clip((t - 8.6) / 2, 0, 1)) * (1 + 0.04 * np.sin(2 * np.pi * 0.3 * t))
add(pad, 0, 0.055)

# 2. whoosh: brown-ish noise, raised-cosine envelope, low-pass sweep up then down (soft, no click)
def whoosh(dur, f0, f1):
    n = int(dur * SR); x = np.cumsum(rng.standard_normal(n)); x -= onepole(x, 20); x /= np.abs(x).max()
    u = np.linspace(0, 1, n); e = np.sin(np.pi * u) ** 2.5
    return onepole(x * e, f0 + (f1 - f0) * np.sin(np.pi * u)) / 0.35
add(whoosh(1.1, 250, 1600), 2.75, 0.10, -0.3)   # tiles fly out
add(whoosh(1.4, 200, 1200), 8.55, 0.09, 0.3)    # hero reveal
add(whoosh(0.9, 300, 1400), 3.45, 0.05, 0.0)    # list rises

# 3. ticks: tiny wooden taps, rising pitch as Hotcoin climbs
io = lambda u: 4 * u ** 3 if u < .5 else 1 - (-2 * u + 2) ** 3 / 2
P = lambda x: 26 - 13.35 * io(min(1, max(0, (x - 4.3) / 3.6)))
ts = np.arange(4.3, 7.9, 1 / 1000); ps = np.array([P(x) for x in ts])
for k, i in enumerate(range(25, 12, -1)):
    at = ts[np.argmax(ps <= i + 0.5)]; f = 700 * 2 ** (k / 14); n = int(0.09 * SR); u = np.arange(n) / SR
    tick = (np.sin(2 * np.pi * f * u) + 0.3 * np.sin(2 * np.pi * f * 2.76 * u)) * np.exp(-u * 70) * (1 - np.exp(-u * 3000))
    add(tick, at, 0.05, (k % 2 - .5) * .4)

# 4. landing on #13: soft bell (inharmonic partials, long decay) + gentle low bloom
n = int(2.8 * SR); u = np.arange(n) / SR
bell = sum(a * np.sin(2 * np.pi * f * u) * np.exp(-u * d) for f, a, d in [(880, 1, 1.6), (1320, .45, 2.4), (1760, .25, 3.2), (2489, .12, 4.5)])
bell *= (1 - np.exp(-u * 400))
add(bell, 7.88, 0.07, 0.1)
bloom = np.sin(2 * np.pi * 55 * u) * np.sin(np.pi * np.clip(u / 1.2, 0, 1)) ** 2
add(bloom[:int(1.2 * SR)], 7.85, 0.10)
add(bell * 0.6, 9.25, 0.05, -0.2)   # big 13 draws in

mix = np.stack([L, R], 1); mix *= 0.5 / np.abs(mix).max()   # peak about -6 dBFS
sf.write(sys.argv[1], mix, SR, subtype='PCM_24'); print('ok', round(20 * np.log10(np.sqrt((mix ** 2).mean())), 1), 'dB RMS')
