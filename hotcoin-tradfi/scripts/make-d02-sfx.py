# Soundtrack for "What If 02" (src/shorts/D02.tsx): a tick every time a new year starts, pitched by how much
# the $100 is worth (so the music climbs with the money), a kick on each milestone, a falling "whoomp" on the
# crashes, a riser under the climb, then a soft chord under the lesson. Reads the same keys.json and aapl.json.
# Usage: python3 scripts/make-d02-sfx.py public/shorts/d02
import json, math, os, subprocess, sys
import numpy as np, soundfile as sf

OUT = sys.argv[1]
SR = 48000
K = json.load(open(f'{OUT}/keys.json')); KEYS = K['keys']
PTS = json.load(open(f'{OUT}/aapl.json'))['pts']
x = np.zeros(int(SR * K['dur']))
rng = np.random.default_rng(3)

def add(sig, at, gain=1.0):
    i = int(at * SR); j = min(len(x), i + len(sig))
    if i < len(x): x[i:j] += sig[: j - i] * gain

def time_of(year):  # inverse of the video's year mapping
    for a, b in zip(KEYS, KEYS[1:]):
        if a['year'] <= year <= b['year']:
            hold = min(K['dwell'], 0.45 * (b['t'] - a['t']))  # same pause after each milestone as the video
            return a['t'] + hold + (b['t'] - a['t'] - hold) * (year - a['year']) / (b['year'] - a['year'])
    return None

def value(year):
    best = min(PTS, key=lambda p: abs(p[0] - year)); return best[1]

def tick(freq):
    t = np.arange(int(SR * 0.08)) / SR
    return (np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)) * np.exp(-t * 45)

def kick(level=0.8):
    t = np.arange(int(SR * 0.32)) / SR
    f = 45 + 95 * np.exp(-t * 22)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * level

def whoomp():
    t = np.arange(int(SR * 0.7)) / SR
    f = 260 * np.exp(-t * 4) + 40
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.5) * 0.8

for yr in range(1981, 2027):
    t = time_of(yr + 0.0)
    if t is None: continue
    lv = math.log10(max(50, value(yr)))  # 1.7 .. 5.6
    add(tick(260 * (1600 / 260) ** ((lv - 1.7) / 3.9)), t, 0.25)

for k in KEYS[1:]:
    add(kick(), k['t'])
    if k['mood'] == 'worried': add(whoomp(), k['t'], 0.7)

# riser under the climb, opening up as the value grows
end = K['end']
t = np.arange(int(SR * end)) / SR
noise = rng.standard_normal(len(t)); noise = np.cumsum(noise); noise -= np.convolve(noise, np.ones(2000) / 2000, mode='same'); noise /= np.abs(noise).max()
prog = np.clip((t - KEYS[0]['t']) / (end - KEYS[0]['t']), 0, 1)
cut = 250 * (6000 / 250) ** prog; alpha = 1 - np.exp(-2 * np.pi * cut / SR)
y = np.zeros_like(noise); a = 0.0
for i in range(len(noise)):
    a += alpha[i] * (noise[i] - a); y[i] = a
y /= np.abs(y).max() + 1e-9
add(y * (0.04 + 0.3 * prog ** 2), 0)
fd = 55 * 2 ** prog
add(np.sin(2 * np.pi * np.cumsum(fd) / SR) * 0.1 * np.clip(t / 1.0, 0, 1), 0)

tc = np.arange(int(SR * (K['dur'] - end))) / SR
env = np.minimum(1, tc / 0.6) * np.exp(-tc * 0.35)
add(sum(np.sin(2 * np.pi * fq * tc) for fq in (220, 277.18, 329.63, 440)) / 4 * env * 0.5, end)

x /= np.abs(x).max() + 1e-9
raw = f'{OUT}/beat.raw.wav'
sf.write(raw, (x * 0.9).astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-16:TP=-1.5', '-ar', '48000', f'{OUT}/beat.wav'], check=True)
os.remove(raw)
print(f'{OUT}/beat.wav', K['dur'], 's')
