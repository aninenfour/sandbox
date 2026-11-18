"""Original noir bed for Hotcoin Research (no samples, no copyrighted material).

Plucked walking bass (Karplus-Strong) in A minor at 78 bpm, brushed hats, a low drone,
optional train-wheel clacks, soft bell accents on scene cuts and a low boom on the title.

  python3 audio/make_noir.py out.wav <seconds> --hits 4.3,8.0 --boom 30.4 --train 0-8,23-30 --duck 0.5-30
"""
import argparse
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def ks(freq, dur, decay=0.996, bright=0.5):
    n = int(SR * dur)
    p = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, p)
    # soften the excitation for a round, upright-bass pluck
    for _ in range(3):
        buf = 0.5 * (buf + np.roll(buf, 1))
    out = np.zeros(n)
    for i in range(n):
        v = buf[i % p]
        out[i] = v
        buf[i % p] = decay * (bright * v + (1 - bright) * buf[(i + 1) % p])
    env = np.minimum(1, np.arange(n) / (0.004 * SR))
    return out * env


def bell(freq, dur):
    t = np.arange(int(SR * dur)) / SR
    tone = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2.76 * t) + 0.18 * np.sin(2 * np.pi * freq * 5.4 * t)
    return tone * np.exp(-t * 2.4) * np.minimum(1, t / 0.003)


def noise_burst(dur, lp=0.2, decay=40):
    n = int(SR * dur)
    x = rng.uniform(-1, 1, n)
    y = np.zeros(n)
    a = lp
    acc = 0.0
    for i in range(n):
        acc += a * (x[i] - acc)
        y[i] = acc
    t = np.arange(n) / SR
    return y * np.exp(-t * decay)


def add(buf, sig, at, gain):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def spans(s):
    out = []
    for part in filter(None, (s or '').split(',')):
        a, b = part.split('-')
        out.append((float(a), float(b)))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('out')
    ap.add_argument('seconds', type=float)
    ap.add_argument('--hits', default='')
    ap.add_argument('--boom', type=float, default=-1)
    ap.add_argument('--thud', default='')
    ap.add_argument('--train', default='')
    ap.add_argument('--stop', type=float, default=1e9, help='bass and hats stop here (end card rings out)')
    a = ap.parse_args()
    n = int(SR * a.seconds)
    mix = np.zeros(n)
    t = np.arange(n) / SR

    # drone: A1 + E2 + A2, slow swell
    drone = (np.sin(2 * np.pi * 55 * t) + 0.6 * np.sin(2 * np.pi * 82.41 * t + 0.3) + 0.35 * np.sin(2 * np.pi * 110.3 * t))
    drone *= 0.5 + 0.5 * np.sin(2 * np.pi * t / 9.0) ** 2
    mix += drone * 0.05 * np.minimum(1, t / 1.5)

    # walking bass, A minor, 78 bpm, quarter notes
    beat = 60 / 78
    walk = [55.0, 65.41, 73.42, 82.41, 87.31, 82.41, 73.42, 61.74, 55.0, 49.0, 55.0, 65.41, 73.42, 69.3, 65.41, 61.74]
    notes = {f: ks(f, 1.2, decay=0.994, bright=0.55) for f in set(walk)}
    k = 0
    tt = 0.25
    while tt < min(a.seconds - 1, a.stop):
        add(mix, notes[walk[k % len(walk)]], tt, 0.42)
        # brushed hats on 2 and 4, a ghost swish on the and
        if k % 2 == 1:
            add(mix, noise_burst(0.18, lp=0.6, decay=22), tt, 0.05)
        add(mix, noise_burst(0.06, lp=0.7, decay=60), tt + beat / 2, 0.018)
        tt += beat
        k += 1

    # train wheels: clack-clack every 1.2 s
    for s0, s1 in spans(a.train):
        c = s0
        while c < s1:
            add(mix, noise_burst(0.07, lp=0.08, decay=45), c, 0.22)
            add(mix, noise_burst(0.07, lp=0.08, decay=45), c + 0.16, 0.16)
            c += 1.2

    # bell accents on cuts (A minor tones)
    tones = [440.0, 659.25, 523.25, 587.33, 493.88, 659.25, 783.99]
    for i, h in enumerate(filter(None, a.hits.split(','))):
        add(mix, bell(tones[i % len(tones)], 2.5), float(h), 0.07)

    for th in filter(None, a.thud.split(',')):
        tl = np.arange(int(SR * 0.6)) / SR
        add(mix, np.sin(2 * np.pi * (70 - 30 * tl) * tl) * np.exp(-tl * 9), float(th), 0.6)
        add(mix, noise_burst(0.25, lp=0.15, decay=18), float(th), 0.35)

    if a.boom >= 0:
        tl = np.arange(int(SR * 3.0)) / SR
        boom = np.sin(2 * np.pi * (60 * np.exp(-tl * 0.7)) * tl) * np.exp(-tl * 1.6)
        add(mix, boom, a.boom, 0.6)
        add(mix, bell(220.0, 4.0) + 0.6 * bell(329.63, 4.0), a.boom + 0.05, 0.12)

    # fade out the last 1.2 s
    fade = np.clip((a.seconds - t) / 1.2, 0, 1)
    mix *= fade
    mix /= max(1e-6, np.max(np.abs(mix))) / 0.8
    st = np.stack([mix, mix], axis=1)
    # tiny stereo width on the bells/hats via a 9 ms delay on the right
    d = int(0.009 * SR)
    st[d:, 1] = 0.85 * st[d:, 1] + 0.15 * st[:-d, 0]
    pcm = (st * 32767).astype('<i2')
    with wave.open(a.out, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == '__main__':
    main()
