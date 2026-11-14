# Original score for the money story (28 s). numpy + soundfile, no samples. Gentle by design: soft pulse and dark pad while
# markets fall, quiet clock ticks and paper flutters, a short breath at 15.2 s, then a warm major chord with light plucks.
# Run: python3 social/money-story/score.py social/money-story/out/score.wav
import sys, numpy as np, soundfile as sf
SR, DUR, TURN, END = 48000, 28.0, 15.2, 22.6
N = int(SR * DUR); t = np.arange(N) / SR; rng = np.random.default_rng(3)
L = np.zeros(N); R = np.zeros(N)
def add(sig, at, g, pan=0.0):
    i = int(at * SR); n = min(len(sig), N - i)
    if n > 0: L[i:i+n] += sig[:n] * g * (1 - pan) ** .5; R[i:i+n] += sig[:n] * g * (1 + pan) ** .5
def lp(x, fc):   # one-pole low-pass, fc scalar or array
    fc = np.broadcast_to(np.asarray(fc, float), x.shape); a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for k in range(len(x)): s = (1 - a[k]) * x[k] + a[k] * s; y[k] = s
    return y
def env(n, a, r): u = np.arange(n) / SR; return np.minimum(1, u / a) * np.exp(-u / r)
def voice(f, d=1.003): ph = 2 * np.pi * f * t; return (np.sin(ph) + .45 * np.sin(ph * d + 1) + .2 * np.sin(2 * ph * .999)) / 1.65
w = lambda a, b, fa=.6, fb=.8: np.clip((t - a) / fa, 0, 1) * np.clip((b - t) / fb, 0, 1)

# 1. dark pad (A minor, low) under the fall
dark = sum(voice(f) * g for f, g in [(55, 1), (110, .8), (130.81, .55), (164.81, .5)])
add(lp(dark * w(0, TURN + .1, 1.0, .35), 500 + 300 * np.clip(t / TURN, 0, 1)), 0, .07)
# 2. heartbeat pulse, slowly speeding up
beat, x_ = [], 0.4
while x_ < TURN - .3: beat.append(x_); x_ += .66 - .18 * (x_ / TURN)
n = int(.35 * SR); u = np.arange(n) / SR
kick = np.sin(2 * np.pi * (48 + 40 * np.exp(-u * 30)) * u) * np.exp(-u * 9) * (1 - np.exp(-u * 600))
for k, b in enumerate(beat): add(kick, b, .32 if k % 2 == 0 else .2)
# 3. clock ticks in the panic scene (6.4 to 9.2 s)
n = int(.05 * SR); u = np.arange(n) / SR
tick = (np.sin(2 * np.pi * 1900 * u) + .4 * np.sin(2 * np.pi * 3100 * u)) * np.exp(-u * 160) * (1 - np.exp(-u * 4000))
for k, b in enumerate(np.arange(6.5, 9.2, .5)): add(tick, b, .05, -.3 if k % 2 else .3)
# 4. soft paper flutters for planes (band-limited noise, smooth envelope)
def flutter(d):
    n = int(d * SR); x = rng.standard_normal(n); uu = np.linspace(0, 1, n); e = np.sin(np.pi * uu) ** 2 * (0.6 + 0.4 * np.sin(2 * np.pi * 14 * uu * d) ** 2)
    return lp(x - lp(x, 400), 2600) * e
for at, d, g, p in [(0.3, 2.4, .05, -.2), (9.3, 1.2, .04, .3), (9.7, 1.2, .035, -.3), (10.2, 1.3, .035, .2), (15.5, 2.4, .05, 0), (22.7, 1.8, .045, -.2)]:
    add(flutter(d), at, g, p)
# 5. falling tone under the BTC drop (9.4 to 12 s), quiet
n = int(2.6 * SR); u = np.arange(n) / SR; f = 440 * 2 ** (-u / 1.6)
add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * u / 2.6) ** 2, 9.4, .025)
# 6. the turn: warm A major pad swell + plucks
warm = sum(voice(f, 1.004) * g for f, g in [(110, .8), (164.81, .6), (220, .6), (277.18, .5), (329.63, .45), (440, .25)])
add(lp(warm * w(TURN + .25, DUR, 1.6, 2.2), 900 + 1400 * np.clip((t - TURN) / 6, 0, 1)), 0, .065)
notes = [440, 554.37, 659.26, 880, 659.26, 554.37]
for k, at in enumerate(np.arange(TURN + .6, END + 2.2, .375)):
    f = notes[k % len(notes)]; n = int(1.2 * SR); u = np.arange(n) / SR
    pl = (np.sin(2 * np.pi * f * u) + .3 * np.sin(4 * np.pi * f * u)) * np.exp(-u * 5) * (1 - np.exp(-u * 900))
    add(pl, at, .03 + .012 * (k % 2), .25 if k % 2 else -.25)
# 7. end bell under the logo
n = int(3.5 * SR); u = np.arange(n) / SR
bell = sum(a * np.sin(2 * np.pi * f * u) * np.exp(-u * d) for f, a, d in [(880, 1, 1.3), (1318.5, .45, 2), (1760, .25, 2.8)]) * (1 - np.exp(-u * 500))
add(bell, 24.4, .06)

mix = np.stack([L, R], 1); mix *= np.clip((DUR - t) / 1.2, 0, 1)[:, None]; mix *= 0.6 / np.abs(mix).max()
sf.write(sys.argv[1], mix, SR, subtype='PCM_24'); print('ok')
