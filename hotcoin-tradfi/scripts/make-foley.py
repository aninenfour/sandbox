"""Synthesises the film's non-tonal foley into public/sfx/foley: whooshes, air swells, soft thumps and one low hit.
Clicks and ticks come from the uisfx `mechanical` pack (CC0). Nothing here has a musical pitch."""
import numpy as np, soundfile as sf, os
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(7)
out = 'public/sfx/foley'
os.makedirs(out, exist_ok=True)

def pink(n):
    w = rng.standard_normal(n)
    X = np.fft.rfft(w); f = np.fft.rfftfreq(n, 1 / SR); X[1:] /= np.sqrt(f[1:]); X[0] = 0
    x = np.fft.irfft(X, n); return x / np.abs(x).max()

def band_sweep(x, f0, f1, q=1.2, steps=48):
    """Band-pass whose centre glides f0 -> f1 (log), processed in overlapping blocks."""
    n = len(x); y = np.zeros(n); hop = n // steps; win = np.hanning(hop * 2)
    for i in range(steps):
        c = f0 * (f1 / f0) ** (i / (steps - 1)); lo, hi = c / (1 + 1 / q), min(c * (1 + 1 / q), SR / 2 - 100)
        sos = butter(2, [lo, hi], btype='band', fs=SR, output='sos')
        a = max(0, i * hop - hop // 2); b = min(n, a + hop * 2)
        y[a:b] += sosfilt(sos, x[a:b]) * win[: b - a]
    return y

def env(n, attack, shape=2.0):
    t = np.linspace(0, 1, n); a = int(n * attack)
    e = np.ones(n); e[:a] = np.linspace(0, 1, a) ** 2; e[a:] = (1 - np.linspace(0, 1, n - a)) ** shape
    return e

def stereo(x, spread=0.0006):
    d = int(spread * SR); r = np.concatenate([np.zeros(d), x[:-d]]) if d else x
    return np.stack([x, 0.85 * r + 0.15 * x], 1)

def write(name, x, peak_db):
    x = x / (np.abs(x).max() + 1e-9) * 10 ** (peak_db / 20)
    sf.write(f'{out}/{name}.wav', stereo(x) if x.ndim == 1 else x, SR, subtype='PCM_16')

# Short whoosh: a swipe or a text change. 260 ms, air rising then falling.
n = int(0.26 * SR); write('whoosh', band_sweep(pink(n), 500, 3200) * env(n, 0.45, 2.2), -20)
# Long swell: a flood filling the frame. 520 ms, darker, opens up.
n = int(0.52 * SR); write('swell', band_sweep(pink(n), 180, 2200, q=0.9) * env(n, 0.7, 1.6), -17)
# Soft thump: a shape landing or contracting. Low-passed noise plus a short body, no pitch you can hum.
n = int(0.16 * SR); body = sosfilt(butter(4, 160, 'low', fs=SR, output='sos'), rng.standard_normal(n)) * env(n, 0.04, 3.5)
air = sosfilt(butter(2, [300, 1800], 'band', fs=SR, output='sos'), pink(n)) * env(n, 0.02, 6) * 0.25
write('thump', body + air, -14)
# End card hit: deep and short, felt more than heard.
n = int(0.7 * SR); t = np.arange(n) / SR
sub = np.sin(2 * np.pi * (48 * t - 6 * t ** 2)) * np.exp(-t * 7)
tail = sosfilt(butter(2, 900, 'low', fs=SR, output='sos'), pink(n)) * np.exp(-t * 9) * 0.35
write('hit', sub + tail, -11)
print('foley written to', out)
