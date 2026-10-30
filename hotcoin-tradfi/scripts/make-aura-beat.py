"""Original phonk-style score for the "Aura" edit (public/aura/beat.wav). 150 BPM, 12 frames per beat at 30 fps.
Sections (seconds): 0-3.2 red wall (rumble, siren, snare roll) | 3.2 fracture impact | 3.2-12.8 drop (808, clap, hats,
cowbell riff) | 12.8-17.6 rain breakdown (rain, thunder, pad, heartbeat) | 17.0-18.2 riser, 18.2-18.4 silence |
18.4-21.6 archive memories (snaps, pad, music box, vinyl) | 21.6-26.4 kinetic-type groove | 26.4 end card (soft hit, pad). Everything is synthesised here, nothing sampled."""
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
BPM = 150
BEAT = 60 / BPM
STEP = BEAT / 4
DUR = 30.4
N = int(SR * DUR)
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N)
duck = np.ones(N)

def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], btype='band', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype='high', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype='low', fs=SR, output='sos'), x)
def t_(d): return np.arange(int(SR * d)) / SR
def add(sig, at, g=1.0, pan=0.0):
    a = int(at * SR)
    if a >= N: return
    s = sig[: N - a] * g
    L[a:a + len(s)] += s * np.sqrt(0.5 * (1 - pan)) * 1.414
    R[a:a + len(s)] += s * np.sqrt(0.5 * (1 + pan)) * 1.414
def side(at, depth=0.6, rel=0.18):
    a = int(at * SR); n = int(rel * SR)
    if a >= N: return
    env = 1 - depth * np.exp(-np.linspace(0, 5, n))
    duck[a:a + n] = np.minimum(duck[a:a + n], env[: N - a])

# ---------- instruments ----------
def k808(note=0, dur=0.55, drive=2.2):
    t = t_(dur); f0 = 43.65 * 2 ** (note / 12)
    f = f0 * (1 + 2.5 * np.exp(-t * 40))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 3.2)
    click = hp(rng.standard_normal(len(t)), 2000) * np.exp(-t * 300) * 0.3
    return np.tanh((x + click) * drive) * 0.8
def clap(dur=0.35):
    t = t_(dur); n = rng.standard_normal(len(t))
    env = np.zeros(len(t))
    for d in (0, 0.011, 0.022): env += (t >= d) * np.exp(-(t - d).clip(0) * 90)
    env += (t >= 0.03) * np.exp(-(t - 0.03).clip(0) * 18) * 0.5
    return bp(n, 900, 4200) * env * 0.9
def hat(dur=0.05, open_=False):
    t = t_(0.3 if open_ else dur)
    return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * (12 if open_ else 90)) * 0.35
def cowbell(note=0, dur=0.22):
    t = t_(dur); f = 540 * 2 ** (note / 12)
    sq = np.sign(np.sin(2 * np.pi * f * t)) + np.sign(np.sin(2 * np.pi * f * 1.481 * t))
    x = bp(sq, f * 0.9, min(f * 5, 9000)) * np.exp(-t * 14)
    return np.tanh(x * 2.5) * 0.32
def snare(dur=0.18):
    t = t_(dur)
    return (bp(rng.standard_normal(len(t)), 1500, 7000) * np.exp(-t * 30) + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 40) * 0.6) * 0.5
def impact(dur=2.5):
    t = t_(dur)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 80 * np.exp(-t * 6)) / SR) * np.exp(-t * 1.8)
    noise = lp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 2.5) * 0.5
    return np.tanh((boom + noise) * 2) * 0.9
def shatter(dur=1.4):
    t = t_(dur); x = hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 7) * 0.5
    for _ in range(70):
        f = rng.uniform(2200, 9500); d = rng.uniform(0, 0.5); k = (t >= d)
        x += k * np.sin(2 * np.pi * f * (t - d)) * np.exp(-(t - d).clip(0) * rng.uniform(18, 60)) * rng.uniform(0.04, 0.12)
    return x
def riser(dur):
    t = t_(dur); p = t / dur
    f = 200 * (40 ** p)
    n = rng.standard_normal(len(t)); out = np.zeros(len(t)); blk = 2048
    for i in range(0, len(t), blk):
        c = f[i]; out[i:i + blk] = bp(n[i:i + blk], c * 0.7, min(c * 1.4, 20000))
    tone = np.sin(2 * np.pi * np.cumsum(110 * (8 ** p)) / SR) * 0.25
    return (out * 0.6 + tone) * p ** 2
def pad(notes, dur):
    t = t_(dur); x = np.zeros(len(t))
    for n in notes:
        f = 87.31 * 2 ** (n / 12)
        for d in (-0.07, 0, 0.06): x += 2 * ((t * f * (1 + d / 12)) % 1) - 1
    x = lp(x, 900) / (len(notes) * 3)
    env = np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 0.8)
    return x * env * 0.5
def rain(dur):
    t = t_(dur); n = rng.standard_normal(len(t))
    x = bp(n, 900, 9000) * 0.18
    drops = (rng.random(len(t)) > 0.9993) * rng.uniform(0.3, 1, len(t))
    x += hp(np.convolve(drops, np.exp(-np.arange(400) / 40), 'same'), 2000) * 0.25
    return x * np.minimum(1, t / 0.4) * np.minimum(1, (dur - t) / 0.3)
def thunder(dur=3.5):
    t = t_(dur); n = lp(rng.standard_normal(len(t)), 400, 3)
    crack = hp(rng.standard_normal(len(t)), 1500) * np.exp(-t * 25) * 0.6
    return np.tanh((n * np.exp(-t * 1.2) * 3 + crack)) * 0.7
def heart():
    t = t_(0.3); x = np.sin(2 * np.pi * 55 * t) * np.exp(-t * 18)
    return lp(x, 200) * 0.9
def siren(dur):
    t = t_(dur); f = 720 + 230 * np.sin(2 * np.pi * 0.62 * t)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return bp(x, 500, 1400) * np.minimum(1, t / 0.8) * 0.12
def rumble(dur):
    t = t_(dur); return lp(rng.standard_normal(len(t)), 90, 3) * (t / dur) ** 1.5 * 2.2
def tail_hit():
    return impact(3.0) * 1.1

# ---------- arrangement ----------
B = lambda bar, step=0: bar * 16 * STEP + step * STEP   # time of (bar, 16th step) from t=0
DROP0 = 3.2
# intro 0-3.2
add(rumble(3.2), 0, 0.9); add(siren(3.2), 0, 1.0, -0.2)
for i in range(8): add(heart(), i * BEAT, 0.7)
for i in range(16):  # snare roll accelerating in bar 2
    tt = 1.6 + 1.6 * (1 - (1 - i / 16) ** 1.6); add(snare(), tt, 0.25 + 0.5 * i / 16, 0.2 * np.sin(i))
add(riser(1.6), 1.6, 0.8)
# fracture impact
add(impact(), DROP0, 1.1); add(shatter(), DROP0, 1.0, 0.3); add(shatter(), DROP0 + 0.02, 0.8, -0.3); side(DROP0, 0.9, 0.5)

RIFF = [[0, None, 0, None, 3, None, 0, None, 7, None, 5, None, 3, None, None, None],
        [0, None, 0, None, 3, None, 0, None, 8, None, 7, None, 5, None, 3, None]]
BASS = [(0, 0), (6, 0), (10, -2)], [(0, 0), (6, 0), (10, 3)]
def drop_bar(t0, b, riff=True, hats=True, roll=False):
    for st, nt in BASS[b % 2]: add(k808(nt), t0 + st * STEP, 0.95); side(t0 + st * STEP)
    for st in (4, 12): add(clap(), t0 + st * STEP, 0.8, 0.05)
    if hats:
        for st in range(16):
            if roll and st >= 12:
                for k in range(2): add(hat(), t0 + (st + k / 2) * STEP, 0.5 + 0.3 * k, 0.4)
            else: add(hat(), t0 + st * STEP, 0.8 if st % 2 == 0 else 0.5, 0.4)
        add(hat(open_=True), t0 + 6 * STEP, 0.4, -0.4); add(hat(open_=True), t0 + 14 * STEP, 0.4, -0.4)
    if riff:
        for st, nt in enumerate(RIFF[b % 2]):
            if nt is not None: add(cowbell(nt), t0 + st * STEP, 0.8 if t0 >= 21 else 1.0, -0.25); add(cowbell(nt + 12), t0 + st * STEP, 0.25, 0.35)

# drop 3.2-12.8: 6 bars (first bar without riff for punch)
for b in range(6): drop_bar(DROP0 + b * 1.6, b, riff=b > 0, roll=b % 2 == 1)
# breakdown 12.8-17.6
BD = 12.8
add(impact(1.6), BD, 0.6); add(thunder(), BD, 1.0); add(rain(4.8), BD, 1.0, 0.1); add(rain(4.8), BD + 0.013, 0.8, -0.3)
add(pad([0, 3, 7, 12], 4.9), BD, 1.1)
for i in range(6): add(heart(), BD + 0.4 + i * 0.8, 0.8); add(heart(), BD + 0.62 + i * 0.8, 0.5)
for st, nt in enumerate(RIFF[0]):
    if nt is not None: add(lp(cowbell(nt, 0.5), 1200), BD + 1.6 + st * STEP * 2, 0.5, -0.5)  # half-speed echo
add(thunder(), BD + 2.6, 0.5)
add(riser(1.2), 17.0, 1.0)
# silence 18.2-18.4, then the archive "memories" section 18.4-21.6: soft kick, snaps, warm major pad, music box, vinyl
CL = 18.4
def snap():
    t = t_(0.08); return bp(rng.standard_normal(len(t)), 1800, 6000) * np.exp(-t * 70) * 0.6
def mbox(note, dur=1.2):
    t = t_(dur); f = 523.25 * 2 ** (note / 12)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) + 0.1 * np.sin(2 * np.pi * 3.01 * f * t)) * np.exp(-t * 3.5) * 0.18
def crackle(dur):
    t = t_(dur); x = (rng.random(len(t)) > 0.9985) * rng.uniform(-1, 1, len(t))
    return hp(x, 1500) * 0.5 + lp(rng.standard_normal(len(t)), 300) * 0.01
add(pad([8, 12, 15, 20], 3.4), CL, 1.2); add(crackle(3.4), CL, 1.0)
for i in range(8):
    tt = CL + i * BEAT
    if i % 2 == 0: add(k808(0, 0.3, 1.2), tt, 0.5)
    else: add(snap(), tt, 0.7, 0.3 * (-1) ** i)
MEL = [8, 12, 15, 20, 19, 15, 12, 15, 8, 12, 15, 17, 15, 12, 10, 12]
for i, n in enumerate(MEL): add(mbox(n - 12), CL + i * STEP * 2, 0.9, 0.2 * np.sin(i))
# kinetic-type groove 21.6-26.4 (3 bars): cleaner drop, quieter cowbell
FD = 21.6
add(impact(1.4), FD, 0.6); side(FD, 0.7, 0.3)
for b in range(3): drop_bar(FD + b * 1.6, b, roll=b == 2)
# end card 26.4-30.4: one soft hit, then a warm pad and music box under the CTA
END = 26.4
add(impact(2.0), END, 0.55); add(pad([8, 12, 15, 20], 4.0), END, 1.0)
for i, n in enumerate([8, 15, 20, 15, 12, 20, 24, 20]): add(mbox(n - 12, 1.6), END + 0.2 + i * BEAT, 0.8)

# ---------- reverb, ducking, master ----------
irn = int(1.6 * SR); ir_t = np.arange(irn) / SR
irL = rng.standard_normal(irn) * np.exp(-ir_t / 0.45); irR = rng.standard_normal(irn) * np.exp(-ir_t / 0.45)
wetL = fftconvolve(L, irL)[:N] * 0.012; wetR = fftconvolve(R, irR)[:N] * 0.012
L = L * duck ** 0.3 + wetL; R = R * duck ** 0.3 + wetR
mix = np.stack([L, R], 1)
mix = np.tanh(mix / np.abs(mix).max() * 1.6)
mix *= 0.89 / np.abs(mix).max()
sf.write('public/aura/beat.wav', mix.astype(np.float32), SR)
print('beat written', mix.shape[0] / SR, 's')
