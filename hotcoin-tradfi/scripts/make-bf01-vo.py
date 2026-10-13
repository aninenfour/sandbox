# Voiceover for Bubble Files 01 (Hunt brothers), read straight from youtube/bubble-files-01-script.md.
# Kokoro TTS v1.0 (Apache 2.0), voice bm_fable at the pace approved in the voice tests: one take per sentence,
# short gaps between sentences, longer gaps between paragraphs and chapters.
# Usage: python3 scripts/make-bf01-vo.py <kokoro model folder>
# Writes public/bf01/vo/<chapter>.wav (mic-treated, -16 LUFS) and public/bf01/vo/timeline.json
# with every sentence's start and end in seconds, per chapter.
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

k = Kokoro(f'{sys.argv[1]}/kokoro-v1.0.onnx', f'{sys.argv[1]}/voices-v1.0.bin')
VOICE, LANG, SR = 'bm_fable', 'en-gb', 24000
OUT = 'public/bf01/vo'
os.makedirs(OUT, exist_ok=True)

# Spellings the voice reads better; the script keeps the proper ones.
SAY = {'USDT': 'U.S.D.T.', 'COMEX': 'Comex', 'Bache': 'Baysh'}

def chapters(md):
    body = md.split('## Fact sources')[0]
    out, cur = [], None
    for block in re.split(r'\n\s*\n', body):
        b = block.strip()
        if b.startswith('## '):
            parts = [x.strip() for x in b[3:].split('·')]
            title = parts[1] if parts[0].isdigit() else parts[0]
            cur = {'id': f'{len(out):02d}-' + re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-'), 'title': title, 'paras': []}
            out.append(cur)
        elif cur and b and not b.startswith(('*', '#', '---', '**')):
            cur['paras'].append(re.sub(r'\b([A-Z])\. ([A-Z])\.', r'\1.\2.', ' '.join(b.split())))
    return out

# sentence ends, but not after initials like H.L.
SPLIT = re.compile(r'(?<=[.?!])(?<![A-Z]\.[A-Z]\.)\s+')

def say(text):
    for a, b in SAY.items(): text = text.replace(a, b)
    return text

def take(text):
    words = len(text.split())
    speed = 1.0 if words <= 4 else 1.08            # punchlines a touch slower
    a, _ = k.create(say(text), voice=VOICE, speed=speed, lang=LANG)
    nz = np.where(np.abs(a) > 0.01)[0]
    return a[max(0, nz[0] - 480): nz[-1] + 960] if len(nz) else a

timeline = []
for ch in chapters(open('youtube/bubble-files-01-script.md').read()):
    parts, t, sents = [np.zeros(int(SR * 0.3), np.float32)], 0.3, []
    for pi, para in enumerate(ch['paras']):
        for si, s in enumerate(SPLIT.split(para)):
            a = take(s).astype(np.float32)
            sents.append({'text': s, 'start': round(t, 3), 'end': round(t + len(a) / SR, 3), 'para': pi})
            t += len(a) / SR
            gap = 0.28 if si < len(SPLIT.split(para)) - 1 else 0.6
            parts += [a, np.zeros(int(SR * gap), np.float32)]
            t += gap
    raw = f'{OUT}/{ch["id"]}.raw.wav'
    sf.write(raw, np.concatenate(parts), SR)
    # same mic treatment as the approved test, mastered to -16 LUFS
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-f', 'lavfi', '-i', f'anoisesrc=color=pink:amplitude=0.0012:r={SR}',
        '-filter_complex', '[0:a]highpass=f=95,lowpass=f=14000,equalizer=f=250:t=q:w=1:g=-1.5,equalizer=f=3400:t=q:w=1.2:g=2.5,'
        'acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150:makeup=2,aecho=0.85:0.3:17|29:0.08|0.05[v];'
        '[v][1:a]amix=inputs=2:duration=first:weights=1 1,loudnorm=I=-16:TP=-1.5[a]',
        '-map', '[a]', '-ar', '48000', f'{OUT}/{ch["id"]}.wav'], check=True)
    os.remove(raw)
    timeline.append({'id': ch['id'], 'title': ch['title'], 'dur': round(t, 3), 'sentences': sents})
    print(ch['id'], round(t, 1), 's', len(sents), 'sentences', flush=True)

json.dump(timeline, open(f'{OUT}/timeline.json', 'w'), indent=1)
print('total', round(sum(c['dur'] for c in timeline) / 60, 2), 'min')
