"""Work tracker for the owner's Google Doc: one row per published desk post.

  python3 ig-news/tools/tracker.py thumbs      # make media/<id>/thumb.jpg (360 px wide) for rows missing one
  python3 ig-news/tools/tracker.py html > t.html  # Date | Topic | Content style | Link | First image

Rows come from state/log.json entries that have "ig_url" (set once Publer shows the post as published).
"""
import html as H
import json
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = 'https://raw.githubusercontent.com/aninenfour/sandbox/claude/ig-news-automation/ig-news/media/%s/thumb.jpg'


def style(e):
    t = e['type']
    if t == 'news':
        return 'News'
    if t == 'tutorial':
        return 'Academy chart'
    if t == 'weekly':
        return "What's on this week"
    if t == 'reel':
        topic = (e.get('topic') or '').split(' (')[0]
        return 'Reel: ' + topic if topic else 'Reel'
    return t.title()


def rows():
    log = json.load(open(os.path.join(ROOT, 'state/log.json')))
    out = [e for e in log if e.get('ig_url')]
    return sorted(out, key=lambda e: e['slot'])


def thumbs():
    for e in rows():
        d = os.path.join(ROOT, 'media', e['id'])
        dst = os.path.join(d, 'thumb.jpg')
        if os.path.exists(dst):
            continue
        src = next(os.path.join(d, f) for f in ('01.jpg', 'cover.jpg') if os.path.exists(os.path.join(d, f)))
        im = Image.open(src).convert('RGB')
        im.thumbnail((360, 640))
        im.save(dst, quality=85)
        print('thumb', e['id'])


def html():
    tr = []
    for e in rows():
        title = e.get('title') or e.get('hook')
        tr.append('<tr><td>%s</td><td>%s</td><td>%s</td><td><a href="%s">%s</a></td><td><img src="%s" width="120"></td></tr>' % (
            e['slot'][:10], H.escape(title), H.escape(style(e)), e['ig_url'], e['ig_url'].replace('https://www.', ''), RAW % e['id']))
    return ('<html><body><h1>Hotcoin content tracker</h1>'
            '<p>Published posts from the Hotcoin news desk (Instagram links; each also went to Facebook and IG Story).</p>'
            '<table border="1" cellpadding="6"><tr><th>Date</th><th>Topic</th><th>Content style</th><th>Link</th><th>First image</th></tr>'
            + ''.join(tr) + '</table></body></html>')


if __name__ == '__main__':
    {'thumbs': thumbs, 'html': lambda: print(html())}[sys.argv[1]]()
