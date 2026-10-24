# Voiceover and word timings for a Bubble Files Short.
# Reads the "## Script" section of a Short's markdown file (one sentence per line, blank line = paragraph),
# records it with Kokoro bm_fable one sentence at a time, applies the same mic treatment as the long video,
# then runs faster-whisper over the result to get each word's start and end for the burned-in captions.
# Usage: python3 scripts/make-short-vo.py <kokoro model folder> <short.md> <out folder>
# Writes <out>/vo.wav (-16 LUFS) and <out>/words.json: {dur, sentences: [{text, start, end, para}], words: [{w, start, end, s}]}
import difflib, json, os, re, subprocess, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

KOKORO, SRC, OUT = sys.argv[1:4]
VOICE, LANG, SR = 'bm_fable', 'en-gb', 24000
SPEED = 1.12  # Shorts run a little quicker than the long video (1.08)
os.makedirs(OUT, exist_ok=True)

SAY = {'USDT': 'U.S.D.T.', 'COMEX': 'Comex'}
ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = 'x x twenty thirty forty fifty sixty seventy eighty ninety'.split()
def two(n):
    return ONES[n] if n < 20 else TENS[n // 10] + ('-' + ONES[n % 10] if n % 10 else '')
def year(m):
    hi, lo = int(m.group(1)), int(m.group(2))
    if hi == 20 and lo < 10:  # 2000 to 2009 are said "two thousand seven", not "twenty oh seven"
        return 'two thousand' + ('' if lo == 0 else ' ' + ONES[lo])
    return two(hi) + ' ' + ('hundred' if lo == 0 else 'oh ' + ONES[lo] if lo < 10 else two(lo))
def say(text):
    for a, b in SAY.items(): text = text.replace(a, b)
    return re.sub(r'\b(19|20)(\d\d)\b', year, text)

# script: paragraphs of sentences
body = open(SRC).read().split('## Script', 1)[1].split('\n## ', 1)[0]
paras = [[l.strip() for l in p.strip().splitlines() if l.strip()] for p in re.split(r'\n\s*\n', body)]
paras = [p for p in paras if p and not p[0].startswith(('One sentence', '*', '#'))]

k = Kokoro(f'{KOKORO}/kokoro-v1.0.onnx', f'{KOKORO}/voices-v1.0.bin')
def take(text):
    a, _ = k.create(say(text), voice=VOICE, speed=SPEED if len(text.split()) > 4 else SPEED - 0.06, lang=LANG)
    nz = np.where(np.abs(a) > 0.01)[0]
    return (a[max(0, nz[0] - 360): nz[-1] + 720] if len(nz) else a).astype(np.float32)

parts, t, sents = [np.zeros(int(SR * 0.15), np.float32)], 0.15, []
for pi, para in enumerate(paras):
    for si, s in enumerate(para):
        a = take(s)
        sents.append({'text': s, 'start': round(t, 3), 'end': round(t + len(a) / SR, 3), 'para': pi})
        t += len(a) / SR
        gap = 0.16 if si < len(para) - 1 else 0.34
        parts += [a, np.zeros(int(SR * gap), np.float32)]
        t += gap
raw = f'{OUT}/vo.raw.wav'
sf.write(raw, np.concatenate(parts), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-f', 'lavfi', '-i', f'anoisesrc=color=pink:amplitude=0.0012:r={SR}',
    '-filter_complex', '[0:a]highpass=f=95,lowpass=f=14000,equalizer=f=250:t=q:w=1:g=-1.5,equalizer=f=3400:t=q:w=1.2:g=2.5,'
    'acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150:makeup=2,aecho=0.85:0.3:17|29:0.08|0.05[v];'
    '[v][1:a]amix=inputs=2:duration=first:weights=1 1,loudnorm=I=-16:TP=-1.5[a]',
    '-map', '[a]', '-ar', '48000', f'{OUT}/vo.wav'], check=True)
os.remove(raw)

# word timings: whisper hears the spoken form ("nineteen seventy-six"); captions show the written form ("1976")
from faster_whisper import WhisperModel
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
heard = []
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{OUT}/vo.wav', '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
for seg in WhisperModel('base.en', device='cpu', compute_type='int8').transcribe(np.frombuffer(pcm, np.float32), word_timestamps=True, language='en')[0]:
    for w in seg.words:
        for piece in re.split(r'[\s-]+', w.word.strip()):
            if norm(piece): heard.append((norm(piece), w.start, w.end))

words, spoken = [], []  # spoken: (token, index of the written word it belongs to)
for si, s in enumerate(sents):
    for w in s['text'].split():
        words.append({'w': w, 's': si})
        for tok in re.split(r'[\s-]+', say(w)):
            if norm(tok): spoken.append((norm(tok), len(words) - 1))
sm = difflib.SequenceMatcher(a=[x[0] for x in spoken], b=[h[0] for h in heard], autojunk=False)
for blk in sm.get_matching_blocks():
    for j in range(blk.size):
        wi = spoken[blk.a + j][1]; _, hs, he = heard[blk.b + j]
        words[wi]['start'] = min(words[wi].get('start', hs), hs); words[wi]['end'] = max(words[wi].get('end', he), he)
# anything whisper missed: spread it evenly inside its sentence between the known neighbours
for si, s in enumerate(sents):
    ws = [w for w in words if w['s'] == si]
    known = [(i, w) for i, w in enumerate(ws) if 'start' in w]
    for i, w in enumerate(ws):
        if 'start' in w: continue
        prev = max([kw for kw in known if kw[0] < i], default=None, key=lambda kw: kw[0])
        nxt = min([kw for kw in known if kw[0] > i], default=None, key=lambda kw: kw[0])
        a = prev[1]['end'] if prev else s['start']; b = nxt[1]['start'] if nxt else s['end']
        lo = prev[0] if prev else -1; hi = nxt[0] if nxt else len(ws)
        step = (b - a) / (hi - lo); w['start'] = a + step * (i - lo - 1); w['end'] = w['start'] + step
for w in words:
    w['start'], w['end'] = round(w['start'], 3), round(w['end'], 3)
missed = sum(1 for _ in range(len(spoken))) - sum(b.size for b in sm.get_matching_blocks())
json.dump({'dur': round(t, 3), 'sentences': sents, 'words': words}, open(f'{OUT}/words.json', 'w'), indent=1)
print(f'{len(sents)} sentences, {len(words)} words, {round(t, 1)} s, {missed} spoken tokens not matched by whisper')
