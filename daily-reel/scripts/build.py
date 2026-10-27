"""Turn episode.json + words.json into src/timeline.json and public/sfx.wav.

Usage: python3 scripts/build.py episodes/<slug>

episode.json:
{
  "slug": "newton-fomo",
  "highlight": ["FOMO", "1720", ...],          # words shown in brand green
  "scenes": [
    {"at": "The smartest man", "img": "s01", "mode": "wide", "fx": 50, "fy": 50},
    {"at": "lost a fortune",   "img": "s01", "mode": "close", "fx": 50, "fy": 40},
    {"at": "Step one", "step": 1},
    ...
  ]
}
"at" is the first words of the line where the scene starts (matched in order).
mode: wide = slow push-in on the whole frame; close = punch-in crop around fx/fy (percent).
"""
import json, re, sys, os
import numpy as np, wave

FPS = 60
END_SECONDS = 3.0

ep = sys.argv[1]
spec = json.load(open(os.path.join(ep, 'episode.json')))
W = json.load(open(os.path.join(ep, 'words.json')))
norm = lambda t: re.sub(r"[^a-z0-9']", '', t.lower())
toks = [norm(w['w']) for w in W]

# resolve scene anchors to word indices, in order
cursor = 0
anchors = []
for sc in spec['scenes']:
    want = [norm(t) for t in sc['at'].split() if norm(t)]
    found = None
    for i in range(cursor, len(toks) - len(want) + 1):
        if toks[i:i + len(want)] == want:
            found = i
            break
    if found is None:
        sys.exit(f'Anchor not found after word {cursor}: "{sc["at"]}"')
    anchors.append(found)
    cursor = found + 1
if anchors[0] != 0:
    anchors[0] = 0

vo_end = W[-1]['e']
total = vo_end + 0.35
scenes = []
for i, sc in enumerate(spec['scenes']):
    st = 0 if i == 0 else W[anchors[i]]['s'] - 0.05
    en = (W[anchors[i + 1]]['s'] - 0.05) if i + 1 < len(anchors) else total
    img = f"STEP {sc['step']}" if 'step' in sc else sc['img']
    scenes.append(dict(img=img, mode=sc.get('mode'), fx=sc.get('fx', 50), fy=sc.get('fy', 50),
                       from_=round(st * FPS), dur=round(en * FPS) - round(st * FPS)))

# captions: 1-3 words, break at scene starts and pauses; none during Step cards
step_words = set()
for i, sc in enumerate(spec['scenes']):
    if 'step' in sc:
        nxt = anchors[i + 1] if i + 1 < len(anchors) else len(W)
        step_words |= set(range(anchors[i], nxt))
hi = {norm(h) for h in spec.get('highlight', [])}
starts = set(anchors)
caps, cur = [], []
for i, w in enumerate(W):
    if i in step_words:
        if cur: caps.append(cur); cur = []
        continue
    if i in starts and cur:
        caps.append(cur); cur = []
    if cur and (len(cur) >= 3 or w['s'] - W[i - 1]['e'] > 0.22):
        caps.append(cur); cur = []
    cur.append(i)
if cur: caps.append(cur)
out = []
for k, c in enumerate(caps):
    st = W[c[0]]['s']
    en = W[c[-1]]['e'] + 0.12
    if k + 1 < len(caps):
        en = min(max(en, st + 0.3), W[caps[k + 1][0]]['s'])
    out.append(dict(from_=round(st * FPS), dur=max(6, round(en * FPS) - round(st * FPS)),
                    words=[dict(t=W[i]['w'], hi=norm(W[i]['w']).replace("'s", '') in hi,
                                at=round((W[i]['s'] - st) * FPS)) for i in c]))

END = int(END_SECONDS * FPS)
json.dump(dict(fps=FPS, voFrames=round(total * FPS), endFrames=END, scenes=scenes, captions=out),
          open('src/timeline.json', 'w'))

# SFX: soft whoosh on image changes, pop on Step cards, whoosh into end card
SR = 48000
n = int((round(total * FPS) + END) / FPS * SR) + SR
buf = np.zeros(n)
rng = np.random.default_rng(1)
def whoosh(L=0.28):
    m = int(L * SR); x = rng.standard_normal(m)
    x = np.convolve(x, np.ones(18) / 18, 'same'); x -= np.convolve(x, np.ones(200) / 200, 'same')
    return x * np.sin(np.linspace(0, np.pi, m)) ** 2 / np.abs(x).max() * 0.5
def pop(L=0.12):
    m = int(L * SR); t = np.arange(m) / SR
    return np.sin(2 * np.pi * np.cumsum(np.linspace(900, 250, m)) / SR) * np.exp(-t * 35) * 0.7
def add(sig, t):
    i = int(max(0, t) * SR); buf[i:i + len(sig)] += sig[:max(0, n - i)]
for k, s in enumerate(scenes):
    if k == 0: continue
    t = s['from_'] / FPS
    if s['img'].startswith('STEP'): add(pop(), t)
    elif scenes[k - 1]['img'] != s['img']: add(whoosh(), t - 0.12)
add(whoosh(0.5), round(total * FPS) / FPS - 0.2)
with wave.open('public/sfx.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())

print(f'{len(scenes)} scenes, {len(out)} captions, {(round(total * FPS) + END) / FPS:.1f}s')
