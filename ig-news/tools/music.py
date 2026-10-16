#!/usr/bin/env python3
"""Royalty-free music for Reels (Mixkit Stock Music Free License, https://mixkit.co/license/#musicFree).
  python3 ig-news/tools/music.py list            # refresh + print the library (assets/music/library.json)
  python3 ig-news/tools/music.py get <id>        # download track -> assets/music/<id>.mp3, prints path + credit
  python3 ig-news/tools/music.py pick            # least-recently-used track id (from state/music_used.json)"""
import sys, re, json, pathlib, urllib.request
ROOT = pathlib.Path(__file__).resolve().parent.parent
LIB = ROOT / 'assets' / 'music' / 'library.json'
USED = ROOT / 'state' / 'music_used.json'
UA = {'User-Agent': 'Mozilla/5.0'}
TAGS = ['hip-hop', 'lo-fi', 'chill', 'corporate', 'upbeat']
SKIP = re.compile(r'(?i)lord|praise|church|christmas|halloween|horror|sad|wedding|baby|molly|acid|playboi|type|trizzy|bang')

def refresh():
    lib = {}
    for t in TAGS:
        try:
            h = urllib.request.urlopen(urllib.request.Request(f'https://mixkit.co/free-stock-music/tag/{t}/', headers=UA), timeout=30).read().decode('utf-8', 'ignore')
        except Exception:
            continue
        for m in re.finditer(r'"name":"([^"]+)","genre":"([^"]*)","byArtist":"([^"]+)","duration":"PT(?:(\d+)M)?(\d+)S","url":"(https://assets\.mixkit\.co/music/(\d+)/\d+\.mp3)"', h):
            name, genre, artist, mi, se, url, i = m.groups()
            secs = int(mi or 0) * 60 + int(se)
            if SKIP.search(name) or secs < 25:
                continue
            lib[i] = {'id': i, 'name': name, 'artist': artist, 'genre': genre or t, 'tag': t, 'secs': secs, 'url': url}
    if lib:
        LIB.write_text(json.dumps(lib, indent=1))
    return lib

def load():
    return json.loads(LIB.read_text()) if LIB.exists() else refresh()

cmd = sys.argv[1] if len(sys.argv) > 1 else 'list'
if cmd == 'list':
    for v in refresh().values():
        print(f"{v['id']:>5}  {v['secs']:>3}s  {v['tag']:<9} {v['name']} — {v['artist']}")
elif cmd == 'get':
    v = load()[sys.argv[2]]; out = ROOT / 'assets' / 'music' / f"{v['id']}.mp3"
    if not out.exists():
        out.write_bytes(urllib.request.urlopen(urllib.request.Request(v['url'], headers=UA), timeout=60).read())
    used = json.loads(USED.read_text()) if USED.exists() else []
    used.append(v['id']); USED.write_text(json.dumps(used[-60:]))
    print(out); print(f"CREDIT: Music: \"{v['name']}\" by {v['artist']} (Mixkit)")
elif cmd == 'pick':
    lib = load(); used = json.loads(USED.read_text()) if USED.exists() else []
    pool = [k for k, v in lib.items() if v['tag'] in ('hip-hop', 'lo-fi', 'upbeat')] or list(lib)
    pool.sort(key=lambda k: (used[::-1].index(k) * -1 if k in used else -999))
    print(pool[0])
