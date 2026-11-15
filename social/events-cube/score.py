# Original music for the events cube (24 s, 120 BPM, bright A major). numpy only, no samples, no sound effects.
# Intro pad and plucks, then a light groove (A F#m D E) with a soft chime as each cube face lands, a lift into the end card.
# Run: python3 social/events-cube/score.py social/events-cube/out/score.wav
import sys, numpy as np, soundfile as sf
SR, DUR, BPM = 48000, 24.0, 120
BEAT = 60 / BPM; BAR = 4 * BEAT
FACES = [2.2 + i * 4.6 for i in range(4)]; OUT = 2.2 + 4 * 4.6        # face turns and the outro spin
N = int(SR * DUR); t = np.arange(N) / SR; rng = np.random.default_rng(4)
ML = np.zeros(N); MR = np.zeros(N); DL = np.zeros(N); DR = np.zeros(N); KICKS = []
def add(sig, at, g, pan=0.0, bus='m'):
    bl, br = (ML, MR) if bus == 'm' else (DL, DR); i = int(at * SR); n = min(len(sig), N - i)
    if n > 0 and i >= 0: bl[i:i+n] += sig[:n] * g * np.sqrt(1 - pan); br[i:i+n] += sig[:n] * g * np.sqrt(1 + pan)
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)
def saw(f, n, harm=8, bright=.6):
    u = np.arange(n) / SR; return sum(np.sin(2 * np.pi * f * k * u) / k * bright ** (k - 1) for k in range(1, harm + 1) if f * k < 15000) * .6
def adsr(n, a=.005, d=.2, s=0., r=.05):
    u = np.arange(n) / SR; e = np.where(u < a, u / a, s + (1 - s) * np.exp(-(u - a) / d)); m = int(r * SR); e[-m:] *= np.linspace(1, 0, m); return e
def pluck(f, d=.7, b=.3):
    n = int(d * SR); u = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * u) + b * np.sin(4 * np.pi * f * u) + b * .35 * np.sin(6 * np.pi * f * u)) * np.exp(-u * 5.5) * (1 - np.exp(-u * 900))
hp = lambda x: np.diff(x, prepend=0.)

PROG = [(57, [57, 61, 64]), (54, [54, 57, 61]), (50, [50, 54, 57]), (52, [52, 56, 59])]   # A F#m D E
bars = int(np.ceil(DUR / BAR))
for bi in range(bars):
    at = bi * BAR; root, ch = PROG[bi % 4]; n = int(BAR * SR) + int(.12 * SR)
    lift = np.clip(at / 18, 0, 1)
    pad = sum(saw(mtof(m + 12), n, 7, .45 + .2 * lift) + saw(mtof(m + 12) * 1.004, n, 7, .45 + .2 * lift) for m in ch) / 6
    add(pad * adsr(n, .12, 9, .9, .12), at, .07)
    if at >= 2.0 and at < OUT + 1.0:
        for s in range(8):
            m = root - 12 + (12 if s % 4 == 3 else 0); nn = int(.22 * SR)
            add(saw(mtof(m), nn, 5, .5) * adsr(nn, .004, .11, .25, .04), at + s * BEAT / 2, .17)
    arp = [ch[0], ch[1], ch[2], ch[1] + 12, ch[2] + 12, ch[2], ch[1], ch[0] + 12]
    for s in range(8):
        add(pluck(mtof(arp[s] + 12), .5, .25), at + s * BEAT / 2, .045 + .02 * lift, (-.3, .3)[s % 2])

# drums: light, enter after the intro, out for the end card
def kick():
    n = int(.28 * SR); u = np.arange(n) / SR; f = 50 + 95 * np.exp(-u * 34)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-u * 8) * (1 - np.exp(-u * 900))
def hat():
    n = int(.035 * SR); u = np.arange(n) / SR; return np.diff(rng.standard_normal(n), 2, prepend=[0., 0.]) * np.exp(-u * 100) * .35
def clap():
    n = int(.18 * SR); u = np.arange(n) / SR
    e = sum(np.exp(-np.maximum(0, u - o) * 70) * (u >= o) for o in (0, .01, .02)) * .5 + np.exp(-np.maximum(0, u - .028) * 22) * (u >= .028)
    return hp(rng.standard_normal(n)) * .4 * e
for b in range(int(DUR / BEAT)):
    at = b * BEAT
    if at < 2.0 or at >= OUT + 1.0: continue
    add(kick(), at, .42, 0, 'd'); KICKS.append(at)
    if b % 2 == 1: add(clap(), at, .1, .05, 'd')
    add(hat(), at + BEAT / 2, .03, .25, 'd')

# a soft chime as each face lands (fifth up the A major scale each time), sparkle on the end card
for k, ft in enumerate(FACES):
    for j, m in enumerate([81, 85, 88][: 2 + (k % 2)]): add(pluck(mtof(m + [0, 2, 4, 5][k]), 1.2, .15), ft + .8 + j * .07, .06, (-.2, .2)[j % 2])
n = int(1.4 * SR); u = np.arange(n) / SR
add(np.diff(rng.standard_normal(n), prepend=0.) * (u / 1.4) ** 2.2 * .5, OUT - .2, .05)          # gentle lift into the outro
for j, m in enumerate([69, 73, 76, 81, 85]): add(pluck(mtof(m), 2.4, .2), OUT + 1.3 + j * .06, .07, (-.25, .25)[j % 2])
n = int(3.0 * SR); add(sum(saw(mtof(m), n, 6, .5) for m in [57, 61, 64, 69]) / 4 * adsr(n, .02, 1.6, 0, .5), OUT + 1.3, .09)

# sidechain pump on the music, sum, master
duck = np.ones(N)
for kt in KICKS:
    i = int(kt * SR); n = min(int(.3 * SR), N - i); duck[i:i+n] = np.minimum(duck[i:i+n], 1 - .4 * np.exp(-np.arange(n) / SR * 9))
L = ML * duck + DL; R = MR * duck + DR
mix = np.stack([L, R], 1); mix *= (np.clip(t / .05, 0, 1) * np.clip((DUR - t) / 1.2, 0, 1))[:, None]; mix *= .7 / np.abs(mix).max()
sf.write(sys.argv[1], mix, SR, subtype='PCM_24'); print('ok')
