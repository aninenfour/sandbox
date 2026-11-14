# Score for the money story (29 s). Music is original (numpy): soft pulse and dark pad while markets fall, then a warm major
# chord with light plucks after the turn at 16 s. Sound effects are real CC0 recordings (Kenney.nl), see assets/sfx.
# Run: python3 social/money-story/score.py social/money-story/out/score.wav
import os, sys, numpy as np, soundfile as sf
SR, DUR, TURN, END = 48000, 29.0, 16.0, 23.4
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
for k, b in enumerate(beat): add(kick, b, .24 if k % 2 == 0 else .15)
# 3. sound effects: real recordings only, Kenney "RPG Audio" + "Impact Sounds" (CC0, kenney.nl), in assets/sfx
SFX = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'sfx')
def smp(name, speed=1.0):   # load, normalize to peak 1, optional varispeed (slower = lower and longer)
    x, sr = sf.read(os.path.join(SFX, name + '.wav')); x = x if x.ndim == 1 else x.mean(1); x = x / (np.abs(x).max() + 1e-9)
    if speed != 1.0: x = np.interp(np.arange(0, len(x) - 1, speed), np.arange(len(x)), x)
    fade = min(len(x), int(.01 * SR)); x[-fade:] *= np.linspace(1, 0, fade); return x
# paper plane flights: soft cloth swishes and paper flips
add(smp('cloth1', .8), 0.3, .16, -.3); add(smp('bookFlip1'), 1.5, .08, .2)
for k in range(6): add(smp(['cloth2', 'cloth3', 'cloth4'][k % 3], .9), 8.6 + k * .26, .07, (-.4, .4)[k % 2])
# labels and cards landing: paper flips and book placements
for at, g in [(3.8, .07), (4.4, .07), (7.3, .07)]: add(smp('bookFlip2', 1.1), at, g, -.1)
add(smp('bookPlace3'), 6.7, .16, .3)                                              # clock card
for k, at in enumerate(np.arange(6.1, 8.6, .5)): add(smp('impactWood_light_000' if k % 2 else 'impactWood_light_002', 1.15), at, .045, (-.3, .3)[k % 2])
add(smp('bookPlace1'), 8.9, .26, 0)                                               # BTC card
for k in range(5): add(smp(['bookPlace2', 'bookPlace3', 'bookPlace1'][k % 3], 1.05), 10.25 + k * .5, .19, (-.35, .35)[k % 2])
add(smp('bookPlace2'), 13.25, .18, .1)                                            # chart card
# the V: a long swish into the dive, a soft heavy impact at the bottom, flip and swish on the climb
add(smp('cloth4', .62), 14.95, .2, -.2)
add(smp('impactSoft_heavy_000', .85), 15.98, .55, 0); add(smp('impactSoft_medium_001', .7), 16.0, .25, 0)
add(smp('bookFlip3', .9), 16.08, .12, .2); add(smp('cloth2', .75), 16.2, .17, .35)
# opportunity and money: coins
add(smp('bookPlace1', 1.1), 19.7, .1, 0); add(smp('handleCoins'), 21.2, .16, .3)
# end card: block drops, plane glides in, coins under the logo
add(smp('bookPlace2', .9), 23.45, .18, .2); add(smp('cloth3', .8), 23.6, .13, -.3); add(smp('handleCoins2'), 25.25, .1, .1)
# 6. the turn: warm A major pad swell + plucks
warm = sum(voice(f, 1.004) * g for f, g in [(110, .8), (164.81, .6), (220, .6), (277.18, .5), (329.63, .45), (440, .25)])
add(lp(warm * w(TURN, DUR, .5, 2.2), 900 + 1400 * np.clip((t - TURN) / 6, 0, 1)), 0, .065)
notes = [440, 554.37, 659.26, 880, 659.26, 554.37]
for k, at in enumerate(np.arange(TURN + .2, END + 2.2, .375)):
    f = notes[k % len(notes)]; n = int(1.2 * SR); u = np.arange(n) / SR
    pl = (np.sin(2 * np.pi * f * u) + .3 * np.sin(4 * np.pi * f * u)) * np.exp(-u * 5) * (1 - np.exp(-u * 900))
    add(pl, at, .03 + .012 * (k % 2), .25 if k % 2 else -.25)
# 7. end bell under the logo
n = int(3.5 * SR); u = np.arange(n) / SR
bell = sum(a * np.sin(2 * np.pi * f * u) * np.exp(-u * d) for f, a, d in [(880, 1, 1.3), (1318.5, .45, 2), (1760, .25, 2.8)]) * (1 - np.exp(-u * 500))
add(bell, 25.2, .06)

mix = np.stack([L, R], 1); mix *= np.clip((DUR - t) / 1.2, 0, 1)[:, None]; mix *= 0.6 / np.abs(mix).max()
sf.write(sys.argv[1], mix, SR, subtype='PCM_24'); print('ok')
