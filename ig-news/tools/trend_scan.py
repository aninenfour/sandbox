#!/usr/bin/env python3
"""Weekly trend scan: find each creator's breakout Shorts and save frames for analysis.

Usage: python3 ig-news/tools/trend_scan.py [N_PER_CHANNEL=30] [TOP=20]
Reads ig-news/research/channels.txt, lists each channel's latest Shorts (title + views, via yt-dlp metadata only),
scores every Short against its own channel's median ("outlier score" = views / median, so small and big channels compare fairly),
keeps the TOP highest, and saves a contact sheet per video (cover + frames at ~25/50/75%) to
ig-news/research/<YYYY-Www>/NN-<id>.jpg plus scan.json. YouTube blocks video/caption downloads from this server,
so the analysis works from title (the hook), cover, frames and numbers.
"""
import json, sys, subprocess, statistics, pathlib, datetime, urllib.request, io
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
N = int(sys.argv[1]) if len(sys.argv) > 1 else 30
TOP = int(sys.argv[2]) if len(sys.argv) > 2 else 20
week = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=8)).strftime('%G-W%V')  # UTC+8 week, like the rest of the desk
out = ROOT / 'research' / week
out.mkdir(parents=True, exist_ok=True)


def shorts(handle):
    r = subprocess.run(['yt-dlp', '--flat-playlist', '--playlist-end', str(N), '--print', '%(id)s\t%(view_count)s\t%(title)s',
                        f'https://www.youtube.com/{handle}/shorts'], capture_output=True, text=True, timeout=180)
    rows = []
    for line in r.stdout.splitlines():
        vid, views, title = (line.split('\t', 2) + ['', ''])[:3]
        if views.isdigit():
            rows.append({'id': vid, 'views': int(views), 'title': title, 'channel': handle})
    return rows


def frame(vid, name):
    try:
        return Image.open(io.BytesIO(urllib.request.urlopen(f'https://i.ytimg.com/vi/{vid}/{name}.jpg', timeout=20).read())).convert('RGB')
    except Exception:
        return None


allv = []
for h in [l.strip() for l in (ROOT / 'research' / 'channels.txt').read_text().splitlines() if l.strip() and not l.startswith('#')]:
    rows = shorts(h)
    if len(rows) < 5:
        print(f'skip {h}: {len(rows)} shorts'); continue
    med = statistics.median(r['views'] for r in rows) or 1
    for r in rows:
        r['median'] = int(med); r['score'] = round(r['views'] / med, 2)
    allv += rows
    print(f'{h}: {len(rows)} shorts, median {int(med):,} views')

best = sorted(allv, key=lambda r: -r['score'])[:TOP]
for i, r in enumerate(best, 1):
    imgs = [im for im in (frame(r['id'], n) for n in ('hqdefault', 'hq1', 'hq2', 'hq3')) if im]
    if imgs:  # 480x360 letterboxed frames: crop to the 9:16 centre, then lay out side by side
        crops = [im.crop((im.width // 2 - 101, 0, im.width // 2 + 101, im.height)).resize((270, 480)) for im in imgs]
        sheet = Image.new('RGB', (270 * len(crops), 480))
        for k, c in enumerate(crops):
            sheet.paste(c, (270 * k, 0))
        r['sheet'] = f'{i:02d}-{r["id"]}.jpg'
        sheet.save(out / r['sheet'], quality=85)
(out / 'scan.json').write_text(json.dumps({'week': week, 'scanned': len(allv), 'top': best}, indent=1, ensure_ascii=False))
for r in best:
    print(f'{r["score"]:>6}x  {r["views"]:>10,}  {r["channel"]:<22} {r["title"]}')
print('saved', out.relative_to(ROOT.parent))
