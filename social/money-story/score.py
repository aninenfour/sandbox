# Music-led score for the money story (29 s, 120 BPM, 1 bar = 2 s). Original, made with numpy; no samples in the music.
#  0 to 14 s  "the fall": A minor groove (Am F Dm E), kick, clap, hats, plucky bass, 16th arpeggio, brightness slowly opening.
# 14 to 16 s  build: pad holds E, snare roll + noise riser, then a beat of air.
# 16 s        the drop on the bottom of the V: A major (A E F#m D), pumping chords, a hook melody, sparkle.
# Sound effects are a quiet bed under the music: real CC0 recordings (Kenney.nl) in assets/sfx.
# Run: python3 social/money-story/score.py social/money-story/out/score.wav
import os, sys, numpy as np, soundfile as sf
SR, DUR, BPM = 48000, 29.0, 120
BEAT = 60 / BPM; BAR = 4 * BEAT; DROP = 16.0
N = int(SR * DUR); t = np.arange(N) / SR; rng = np.random.default_rng(9)
L = np.zeros(N); R = np.zeros(N); KICKS = []
def add(sig, at, g, pan=0.0, bus=None):
    bl, br = bus if bus else (L, R); i = int(at * SR); n = min(len(sig), N - i)
    if n > 0 and i >= 0: bl[i:i+n] += sig[:n] * g * np.sqrt(1 - pan); br[i:i+n] += sig[:n] * g * np.sqrt(1 + pan)
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)
def saw(f, n, harm=10, bright=1.0):   # band-limited saw via additive harmonics; brightness tilts the upper harmonics
    u = np.arange(n) / SR; return sum(np.sin(2 * np.pi * f * k * u) / k * bright ** (k - 1) for k in range(1, harm + 1) if f * k < 16000) * .6
def adsr(n, a=.005, d=.2, s=.0, r=.05):
    u = np.arange(n) / SR; e = np.where(u < a, u / a, s + (1 - s) * np.exp(-(u - a) / d)); m = int(r * SR); e[-m:] *= np.linspace(1, 0, m); return e
noise = lambda n: rng.standard_normal(n)
hp = lambda x, k=1: np.diff(x, k, prepend=np.zeros(k))

# ---- music bus (gets the sidechain pump) ----
ML = np.zeros(N); MR = np.zeros(N); MUS = (ML, MR)
FALL = [(57, [57, 60, 64]), (53, [53, 57, 60]), (50, [50, 53, 57]), (52, [52, 56, 59])]   # Am F Dm E
RISE = [(57, [57, 61, 64]), (52, [52, 56, 59]), (54, [54, 57, 61]), (50, [50, 54, 57])]   # A E F#m D
def section(prog, start, bars, b0, b1, major):
    for bi in range(bars):
        root, ch = prog[bi % 4]; at = start + bi * BAR; u = bi / max(1, bars - 1); br = b0 + (b1 - b0) * u
        n = int(BAR * SR) + int(.1 * SR)
        pad = sum(saw(mtof(m + 12), n, 8, br) + saw(mtof(m + 12) * 1.004, n, 8, br) for m in ch) / 6
        add(pad * adsr(n, .08, 9, .9, .1), at, .07 if major else .055, 0, MUS)
        for s in range(8):                                            # bass: 8ths with an octave bounce
            m = root - 12 + (12 if s % 4 == 3 else 0); nn = int(.24 * SR)
            add(saw(mtof(m), nn, 6, .55) * adsr(nn, .004, .12, .25, .04), at + s * BEAT / 2, .2, 0, MUS)
        arp = [ch[0], ch[1], ch[2], ch[1] + 12, ch[2], ch[1], ch[0] + 12, ch[2]]
        steps, dt = (16, BEAT / 4) if not major else (8, BEAT / 2)
        for s in range(steps):
            m = arp[s % 8] + 12; nn = int(.18 * SR)
            add(saw(mtof(m), nn, 5, br * .8) * adsr(nn, .002, .07, 0, .03), at + s * dt, .05 + .025 * u, (-.35, .35)[s % 2], MUS)
section(FALL, 0.0, 7, .25, .6, False)                                 # 0 to 14 s
n = int(2.0 * SR); add(sum(saw(mtof(m + 12), n, 6, .4) for m in [52, 56, 59]) / 4 * adsr(n, .05, 9, .9, .3), 14.0, .06, 0, MUS)
section(RISE, DROP, 6, .55, .8, True)                                 # 16 to 28 s
def pluck(f, d=.6):
    n = int(d * SR); u = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * u) + .35 * np.sin(4 * np.pi * f * u) + .12 * np.sin(6 * np.pi * f * u)) * np.exp(-u * 6) * (1 - np.exp(-u * 800))
hook = [(0, 76), (.5, 73), (1, 71), (1.5, 73), (2.5, 69), (3, 71), (4, 76), (4.5, 78), (5, 76), (5.5, 73), (6.5, 71), (7, 69)]
for rep in range(3):
    for b, m in hook: add(pluck(mtof(m)), DROP + .5 + rep * 4 + b * BEAT, .13, .15, MUS)
add(pluck(mtof(93), 1.4) + pluck(mtof(88), 1.4) * .7, DROP, .08, -.2, MUS)
n = int(2.6 * SR); add(sum(saw(mtof(m), n, 6, .5) for m in [57, 61, 64, 69]) / 4 * adsr(n, .01, 1.2, 0, .4), 26.6, .1, 0, MUS)

# ---- drums ----
def kick():
    n = int(.32 * SR); u = np.arange(n) / SR; f = 46 + 110 * np.exp(-u * 32)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-u * 7) * (1 - np.exp(-u * 900)) + noise(n) * np.exp(-u * 300) * .05
def clap():
    n = int(.22 * SR); u = np.arange(n) / SR
    e = sum(np.exp(-np.maximum(0, u - o) * 60) * (u >= o) for o in (0, .011, .022)) * .5 + np.exp(-np.maximum(0, u - .03) * 18) * (u >= .03)
    return hp(noise(n)) * .45 * e
def hat(open_=False):
    n = int((.16 if open_ else .04) * SR); u = np.arange(n) / SR; return hp(noise(n), 2) * np.exp(-u * (18 if open_ else 90)) * .4
for b in range(int(DUR / BEAT)):
    at = b * BEAT; pre = at < DROP
    if 15.0 <= at < DROP or at >= DUR - 1.5 or at < 2.0: continue   # 1 bar intro, break before the drop, clean ending
    add(kick(), at, .5 if pre else .58); KICKS.append(at)
    if b % 2 == 1: add(clap(), at, .12 if pre else .15, .05)
    add(hat(), at, .025, -.25); add(hat(open_=not pre), at + BEAT / 2, .035, .25)
n = int(.08 * SR); u = np.arange(n) / SR; snare = (hp(noise(n)) * .6 + np.sin(2 * np.pi * 190 * u) * .4) * np.exp(-u * 35)
k, at = 0, 14.0
while at < 15.82:                                                     # build: snare roll speeding up
    add(snare, at, .04 + .12 * (at - 14.0) / 1.82, (-.15, .15)[k % 2]); at += .25 if at < 15.0 else .125 if at < 15.5 else .0625; k += 1
n = int(1.6 * SR); u = np.arange(n) / SR; add(hp(noise(n)) * (u / 1.6) ** 2.5, 14.3, .06)

# sidechain pump on the music bus, then sum
duck = np.ones(N)
for kt in KICKS:
    i = int(kt * SR); n = min(int(.32 * SR), N - i); duck[i:i+n] = np.minimum(duck[i:i+n], 1 - .5 * np.exp(-np.arange(n) / SR * 9))
L += ML * duck; R += MR * duck

# ---- sound effects: a quiet bed under the music, real CC0 recordings ----
SFX = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'sfx')
def smp(name, speed=1.0):
    x, _ = sf.read(os.path.join(SFX, name + '.wav')); x = x if x.ndim == 1 else x.mean(1); x = x / (np.abs(x).max() + 1e-9)
    if speed != 1.0: x = np.interp(np.arange(0, len(x) - 1, speed), np.arange(len(x)), x)
    f = min(len(x), int(.01 * SR)); x[-f:] *= np.linspace(1, 0, f); return x
add(smp('cloth1', .8), 0.4, .04, -.3)
add(smp('bookPlace1'), 8.9, .06, 0)
for k in range(5): add(smp(['bookPlace2', 'bookPlace3', 'bookPlace1'][k % 3], 1.05), 10.25 + k * .5, .045, (-.3, .3)[k % 2])
add(smp('impactSoft_heavy_000', .85), 15.98, .1, 0)
add(smp('handleCoins'), 21.2, .045, .3)

mix = np.stack([L, R], 1); mix *= (np.clip(t / .05, 0, 1) * np.clip((DUR - t) / 1.0, 0, 1))[:, None]; mix *= 0.7 / np.abs(mix).max()
sf.write(sys.argv[1], mix, SR, subtype='PCM_24'); print('ok')
