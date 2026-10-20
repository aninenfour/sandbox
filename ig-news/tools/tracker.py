"""Work tracker for the owner's Google Doc: one row per published desk post.

  python3 ig-news/tools/tracker.py thumbs      # make media/<id>/thumb.jpg (360 px wide) for rows missing one
  python3 ig-news/tools/tracker.py html > t.html  # Date | Topic | Content style | Link | First image
  python3 ig-news/tools/tracker.py rows READ_DOC.json SHA  # update_doc args that append the rows not yet in the Doc

Rows come from state/log.json entries that have "ig_url" (set once Publer shows the post as published).
"""
import html as H
import json
import os
import re
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


def doc_rows(path, sha):
    """Build one update_doc call that appends missing rows to the tracker table (thumbs must be pushed at `sha`)."""
    d = json.load(open(path))
    d = d.get('content', d)
    body = d['tabs'][0]['documentTab']['body']['content']
    el = next(e for e in body if 'table' in e)
    t = el['table']
    have = set()
    for r in t['tableRows']:
        txt = ''.join(x.get('textRun', {}).get('content', '') for c in r['tableCells'] for p in c['content'] for x in p.get('paragraph', {}).get('elements', []))
        have.update(re.findall(r'instagram\.com/\S+?/(?=\s|$)', txt))
    new = [e for e in rows() if e['ig_url'].replace('https://www.', '') not in have]
    reqs, end, n = [], t['tableRows'][-1]['endIndex'], len(t['tableRows'])
    # rows go in bottom-up so every index below stays valid: each new row is inserted below the current last row
    for e in reversed(new):
        cells = [e['slot'][:10], e.get('title') or e.get('hook'), style(e), e['ig_url'].replace('https://www.', '')]
        reqs.append({'insertTableRow': {'tableCellLocation': {'tableStartLocation': {'index': el['startIndex']}, 'rowIndex': n - 1, 'columnIndex': 0}, 'insertBelow': True}})
        reqs.append({'insertInlineImage': {'location': {'index': end + 10}, 'uri': RAW.replace('claude/ig-news-automation', sha) % e['id'],
                                           'objectSize': {'width': {'magnitude': 90, 'unit': 'PT'}, 'height': {'magnitude': 112.5, 'unit': 'PT'}}}})
        for c in (3, 2, 1, 0):
            reqs.append({'insertText': {'location': {'index': end + 2 + 2 * c}, 'text': cells[c]}})
        u = lambda x: len(x.encode('utf-16-le')) // 2
        a = end + 8 + sum(u(x) for x in cells[:3])
        reqs.append({'updateTextStyle': {'range': {'startIndex': a, 'endIndex': a + u(cells[3])}, 'textStyle': {'link': {'url': e['ig_url']}}, 'fields': 'link'}})
    return {'documentId': d['documentId'], 'requests': reqs, 'writeControl': {'requiredRevisionId': d['revisionId']}, 'added': [e['id'] for e in new]}


if __name__ == '__main__':
    if sys.argv[1] == 'rows':
        print(json.dumps(doc_rows(sys.argv[2], sys.argv[3]), ensure_ascii=False))
    else:
        {'thumbs': thumbs, 'html': lambda: print(html())}[sys.argv[1]]()
