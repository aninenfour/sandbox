"""Time-stretch (pitch kept) and master a voiceover take, rescaling its word timings.

    python3 scripts/vo_master.py ep14-body 0.95     # slower
    python3 scripts/vo_master.py ep14-open 1.0      # master only

Reads public/vo/<name>.mp3 and <name>.words.json, writes <name>-master.mp3
(-16 LUFS) and <name>-master.words.json. tempo > 1 speeds up.
"""
import json
import subprocess
import sys

import imageio_ffmpeg

name, tempo = sys.argv[1], float(sys.argv[2])
base = f"public/vo/{name}"
ff = imageio_ffmpeg.get_ffmpeg_exe()
af = (f"atempo={tempo}," if tempo != 1 else "") + "loudnorm=I=-16:TP=-1.5:LRA=9"
subprocess.run([ff, "-hide_banner", "-loglevel", "error", "-y", "-i", f"{base}.mp3", "-af", af, "-ar", "44100", "-b:a", "192k", f"{base}-master.mp3"], check=True)
d = json.load(open(f"{base}.words.json"))
for w in d["words"]:
    for k in ("start", "end"):
        w[k] = round(w[k] / tempo, 3)
    w["at"] = round(w["start"] * 30, 1)
    w["until"] = round(w["end"] * 30, 1)
d["duration"] = round(d["duration"] / tempo, 3)
d["tempo"] = tempo
json.dump(d, open(f"{base}-master.words.json", "w"), indent=1)
print(f"{name}: tempo {tempo}, {d['duration']:.2f}s")
