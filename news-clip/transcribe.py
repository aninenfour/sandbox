#!/usr/bin/env python3
"""Transcribe a 16 kHz mono wav with faster-whisper (word timestamps).
Usage: ffmpeg -i src/x.mp4 -ac 1 -ar 16000 src/x.wav && python3 transcribe.py src/x.wav src/x.txt base.en
Writes src/x.txt (one segment per line) and src/x.txt.json (for make.py). Needs: pip install faster-whisper soundfile."""
import sys,numpy as np,soundfile as sf
from faster_whisper import WhisperModel
a,sr=sf.read(sys.argv[1],dtype='float32')
m=WhisperModel(sys.argv[3] if len(sys.argv)>3 else "base.en",device="cpu",compute_type="int8",cpu_threads=2)
segs,_=m.transcribe(a,vad_filter=True,word_timestamps=True)
import json
out=[]
with open(sys.argv[2],"w") as f:
    for s in segs:
        f.write(f"{s.start:7.1f} {s.end:7.1f} {s.text.strip()}\n"); f.flush()
        out.append({"start":s.start,"end":s.end,"text":s.text,"words":[[w.start,w.end,w.word] for w in s.words]})
json.dump(out,open(sys.argv[2]+".json","w"))
