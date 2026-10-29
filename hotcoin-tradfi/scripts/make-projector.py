"""Synthesises public/halloween/projector.wav: a 6 s seamless film-projector loop (shutter clicks at 24/s over a soft motor hiss)."""
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

SR, DUR = 48000, 6.0
rng = np.random.default_rng(3)
n = int(SR * DUR)
hiss = sosfilt(butter(2, [300, 3000], btype='band', fs=SR, output='sos'), rng.standard_normal(n)) * 0.05
x = hiss.copy()
click = sosfilt(butter(2, [1500, 6000], btype='band', fs=SR, output='sos'), rng.standard_normal(int(SR * 0.012))) * np.exp(-np.linspace(0, 8, int(SR * 0.012)))
for i in range(int(DUR * 24)):
    a = int(i * SR / 24 + rng.integers(-40, 40)) % n
    g = 0.35 * (1.0 if i % 2 == 0 else 0.6) * rng.uniform(0.8, 1.1)
    seg = click[: n - a]; x[a: a + len(seg)] += seg * g
x += 0.03 * np.sin(2 * np.pi * 50 * np.arange(n) / SR)
x /= np.abs(x).max() / 0.7
sf.write('public/halloween/projector.wav', x.astype(np.float32), SR)
print('projector written')
