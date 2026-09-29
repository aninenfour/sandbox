"""
Hotcoin 101 — procedural music bed.

Reads an episode script's beat durations and writes a WAV that is locked to the
page turns: a low sustained pad underneath, one soft plucked note on every page,
and a quiet paper-turn breath at each cut.

  python3 audio/make_bed.py src/episodes/ep03-candlestick.ts out/ep03-bed.wav

Everything is synthesised here, so there is no licence attached to the output.
"""
import re
import sys
import numpy as np
from scipy.io import wavfile

SR = 48000

# A minor pentatonic. Any order of these sits together, so the page order can
# change without the bed needing a rewrite.
SCALE = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25]
PATTERN = [0, 2, 1, 4, 3, 5, 2, 0, 4, 1, 3, 6, 2, 5, 0, 3]


def beats_from_script(path):
    text = open(path).read()
    return [float(m) for m in re.findall(r"seconds:\s*([0-9.]+)", text)]


def env_exp(n, attack=0.004, decay=1.7):
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1)
    d = np.exp(-t / decay)
    return a * d


def pluck(freq, dur, level=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    e = env_exp(n, 0.004, 1.55)
    tone = (
        np.sin(2 * np.pi * freq * t)
        + 0.34 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / 0.5)
        + 0.11 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t / 0.25)
    )
    return tone * e * level


def paper_breath(dur=0.34, level=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = np.random.default_rng(7).normal(0, 1, n)
    # crude band shaping: difference twice for brightness, then smooth back down
    noise = np.diff(noise, prepend=0)
    k = 40
    noise = np.convolve(noise, np.ones(k) / k, mode="same")
    e = np.exp(-t / 0.09) * np.clip(t / 0.01, 0, 1)
    return noise * e * level


def pad(total, level=1.0):
    t = np.arange(int(total * SR)) / SR
    voices = [(110.0, 1.0), (164.81, 0.55), (220.0, 0.32), (329.63, 0.14)]
    out = np.zeros_like(t)
    for i, (f, a) in enumerate(voices):
        drift = 1 + 0.0012 * np.sin(2 * np.pi * (0.037 + i * 0.011) * t)
        swell = 0.62 + 0.38 * np.sin(2 * np.pi * (0.028 + i * 0.007) * t + i)
        out += a * swell * np.sin(2 * np.pi * f * drift * t)
    # take the edge off
    k = 24
    out = np.convolve(out, np.ones(k) / k, mode="same")
    return out * level


def reverb(x, taps=((0.031, 0.30), (0.067, 0.22), (0.113, 0.16), (0.190, 0.10))):
    out = x.copy()
    for delay, gain in taps:
        d = int(delay * SR)
        pad_ = np.zeros(d)
        out[d:] += gain * x[:-d] if d < len(x) else 0
        del pad_
    return out


def build(beats, tail=0.0):
    total = sum(beats) + tail
    n = int(total * SR)
    left = np.zeros(n)
    right = np.zeros(n)

    # pad bed
    p = pad(total, 0.055)
    left += p
    right += np.roll(p, 431)  # tiny decorrelation for width

    # page events
    cursor = 0.0
    for i, b in enumerate(beats):
        start = int(cursor * SR)

        # paper breath just before the page lands
        br = paper_breath(0.34, 0.055)
        s0 = max(0, start - int(0.06 * SR))
        e0 = min(n, s0 + len(br))
        left[s0:e0] += br[: e0 - s0] * 0.9
        right[s0:e0] += br[: e0 - s0]

        # the note
        freq = SCALE[PATTERN[i % len(PATTERN)]]
        # first and last page get the low root instead, as bookends
        if i == 0 or i == len(beats) - 1:
            freq = 220.00
        note = pluck(freq, min(b + 1.4, 3.2), 0.20)
        e1 = min(n, start + len(note))
        span = e1 - start
        panl = 0.62 if i % 2 == 0 else 0.38
        left[start:e1] += note[:span] * panl
        right[start:e1] += note[:span] * (1 - panl)

        # a quieter octave shadow halfway through longer pages
        if b >= 5.5:
            mid = start + int((b * 0.55) * SR)
            sh = pluck(freq * 2, 1.8, 0.075)
            e2 = min(n, mid + len(sh))
            left[mid:e2] += sh[: e2 - mid] * (1 - panl)
            right[mid:e2] += sh[: e2 - mid] * panl

        cursor += b

    left = reverb(left)
    right = reverb(right)

    # fades
    fi = int(1.2 * SR)
    fo = int(2.2 * SR)
    ramp_in = np.linspace(0, 1, fi) ** 2
    ramp_out = np.linspace(1, 0, fo) ** 1.6
    for ch in (left, right):
        ch[:fi] *= ramp_in
        ch[-fo:] *= ramp_out

    stereo = np.stack([left, right], axis=1)
    peak = np.max(np.abs(stereo))
    if peak > 0:
        stereo = stereo / peak * 0.52  # sits under a voiceover without ducking
    return (stereo * 32767).astype(np.int16)


if __name__ == "__main__":
    script, out = sys.argv[1], sys.argv[2]
    beats = beats_from_script(script)
    audio = build(beats)
    wavfile.write(out, SR, audio)
    print(f"{out}  pages={len(beats)}  length={len(audio)/SR:.2f}s")
