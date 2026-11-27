#!/usr/bin/env python3
"""Original calm beat for the 1% rule video: 92 bpm, soft kick, closed hat, minor pad. 62 s, 48 kHz stereo WAV."""
import numpy as np, soundfile as sf, sys, os
SR = 48000
DUR, BPM = float(os.environ.get("DUR", 62.0)), float(os.environ.get("BPM", 92))  # v3 uses DUR=40.5 BPM=112
n = int(SR * DUR); t = np.arange(n) / SR; out = np.zeros(n)
beat = 60 / BPM
def env(length, a=0.005, d=0.3):
    k = np.arange(int(length * SR)) / SR
    return np.minimum(k / a, 1) * np.exp(-k / d)
# kick on 1 and 3, from bar 2
for i in range(int(DUR / beat)):
    st = int(i * beat * SR)
    if i >= int(os.environ.get('KICK_FROM', 4)) and i % 2 == 0:
        L = int(0.35 * SR); k = np.arange(L) / SR
        f = 55 + 70 * np.exp(-k * 30)
        sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(0.35, 0.002, 0.12)[:L]
        out[st:st + L] += 0.55 * sig[:max(0, min(L, n - st))]
    if i >= int(os.environ.get('HAT_FROM', 8)):
        L = int(0.06 * SR); hh = np.random.default_rng(i).standard_normal(L) * env(0.06, 0.001, 0.015)[:L]
        hh = np.diff(hh, prepend=0)
        st2 = st + int(beat * SR / 2)
        if st2 + L < n: out[st2:st2 + L] += 0.08 * hh
# pad: Am - F - C - G, 4 beats each
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
bar = 4 * beat
for b in range(int(DUR / bar) + 1):
    st = int(b * bar * SR); L = min(int(bar * SR), n - st)
    if L <= 0: break
    k = np.arange(L) / SR; e = np.minimum(k / 0.6, 1) * np.minimum((bar - k) / 0.6, 1)
    for m in chords[b % 4]:
        fr = 440 * 2 ** ((m - 69) / 12)
        out[st:st + L] += 0.05 * e * (np.sin(2 * np.pi * fr * k) + 0.3 * np.sin(2 * np.pi * 2 * fr * k + 0.5))
fade = np.minimum(np.minimum(t / 1.0, 1), np.minimum((DUR - t) / 2.5, 1))
out *= fade; out /= np.max(np.abs(out)) * 1.15
st = np.stack([out, np.roll(out, 240)], axis=1)
sf.write(sys.argv[1] if len(sys.argv) > 1 else 'onepct-beat.wav', st, SR)
print('ok')
