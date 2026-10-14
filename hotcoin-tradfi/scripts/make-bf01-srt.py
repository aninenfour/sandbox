# English captions for Bubble Files 01, built from public/bf01/vo/timeline.json and the part layout in src/bf01.
# Usage: python3 scripts/make-bf01-srt.py > out/bf01/bubble-files-01.en.srt
import json, re
T = json.load(open('public/bf01/vo/timeline.json'))
D = [c['dur'] for c in T]
P1 = round((D[0] + 0.25 + 3.4 + D[1] + 1.2) * 30) / 30          # Part1: cold open, title, chapter 1
P2 = round((0.4 + D[2] + 0.5 + D[3] + 0.4) * 30) / 30
AD = round((0.5 + D[4] + 0.3) * 30) / 30
starts = [0, D[0] + 0.25 + 3.4, P1 + 0.4, P1 + 0.4 + D[2] + 0.5, P1 + P2 + 0.5]
c4 = P1 + P2 + AD + 0.6
starts += [c4, c4 + D[5] + 0.5, c4 + D[5] + 0.5 + D[6] + 1.6, c4 + D[5] + 0.5 + D[6] + 1.6 + D[7] + 0.5]

def ts(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{sec:02d},{ms:03d}'

cues = []
for ch, at in zip(T, starts):
    for s in ch['sentences']:
        words, a, b = s['text'].split(), at + s['start'], at + s['end']
        parts = [s['text']] if len(s['text']) <= 84 else None
        if parts is None:  # split long lines near the middle, at a comma if there is one
            mid = len(words) // 2
            cands = [i for i, w in enumerate(words[:-2]) if w.endswith(',') and abs(i + 1 - mid) <= len(words) // 4]
            k = (min(cands, key=lambda i: abs(i + 1 - mid)) + 1) if cands else mid
            parts = [' '.join(words[:k]), ' '.join(words[k:])]
        total = sum(len(p) for p in parts); t = a
        for p in parts:
            e = t + (b - a) * len(p) / total
            cues.append((t, e, p)); t = e
for i, (a, b, text) in enumerate(cues, 1):
    print(f'{i}\n{ts(a)} --> {ts(b)}\n{text}\n')
