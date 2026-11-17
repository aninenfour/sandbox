"""Work tracker for the owner's Google Doc: one row per published desk post.

  python3 ig-news/tools/tracker.py thumbs      # make media/<id>/thumb.jpg (360 px wide) for rows missing one
  python3 ig-news/tools/tracker.py html > t.html  # Date | Topic | Content style | Link | First image
  python3 ig-news/tools/tracker.py rows READ_DOC.json SHA  # update_doc args that append the rows not yet in the Doc
  python3 ig-news/tools/tracker.py tiktok READ_DOC.json SHA  # same for the "Hotcoin TikTok releases" doc (tiktok_doc_id)

Rows come from state/log.json entries that have "ig_url" (set once Publer shows the post as published),
plus entries still "scheduled" (Link cell = "Scheduled"). When a Scheduled row's post later gets its ig_url,
`rows` swaps "Scheduled" for the link instead of adding a second row.
TikTok rows come from state/tiktok_log.json entries with "doc_row": false (never drafts), newest first under
the header; Status = the TikTok link once "tiktok_url" is set, else "Scheduled". Set doc_row true after checking.
"""
import html as H
import json
import os
import re
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = 'https://raw.githubusercontent.com/aninenfour/sandbox/claude/ig-news-automation/ig-news/media/%s/thumb.jpg'
RAW_TT = 'https://raw.githubusercontent.com/aninenfour/sandbox/%s/ig-news/media/%s/thumb_tiktok.jpg'
LINK = {'foregroundColor': {'color': {'rgbColor': {'red': 0.06666667, 'green': 0.33333334, 'blue': 0.8}}}, 'underline': True}


def style(e):
    t = e['type']
    if t == 'news':
        return 'News'
    if t == 'tutorial':
        return 'Academy chart'
    if t == 'weekly':
        return "What's on this week"
    if t == 'academy':
        return 'Academy chart'
    if t.startswith('reel-whatif'):
        return 'Reel: WHAT IF' + (' (photo look)' if e.get('look') == 'photo' else '')
    if t == 'reel-tier':
        return 'Reel: tier list'
    if t == 'reel-memereact':
        return 'Reel: meme react'
    if t == 'owner-request':
        return 'News grid (owner request)'
    if t == 'reel':
        topic = (e.get('topic') or '').split(' (')[0]
        return 'Reel: ' + topic if topic else 'Reel'
    return t.title()


def rows(scheduled=False):
    log = json.load(open(os.path.join(ROOT, 'state/log.json')))
    out = [e for e in log if e.get('ig_url') or (scheduled and e.get('status') == 'scheduled' and e.get('slot'))]
    return sorted(out, key=lambda e: e['slot'])


def tt_rows():
    log = json.load(open(os.path.join(ROOT, 'state/tiktok_log.json')))
    return [e for e in log if not e.get('doc_row') and e.get('status') != 'draft']


def _thumb(src, dst, box):
    im = Image.open(src).convert('RGB')
    im.thumbnail(box)
    im.save(dst, quality=85)


def thumbs():
    for e in rows(scheduled=True):
        d = os.path.join(ROOT, 'media', e['id'])
        dst = os.path.join(d, 'thumb.jpg')
        if os.path.exists(dst):
            continue
        _thumb(next(os.path.join(d, f) for f in ('01.jpg', 'cover.jpg') if os.path.exists(os.path.join(d, f))), dst, (360, 640))
        print('thumb', e['id'])
    for e in tt_rows():
        d = os.path.join(ROOT, 'media', e['id'])
        dst = os.path.join(d, 'thumb_tiktok.jpg')
        if os.path.exists(dst):
            continue
        _thumb(next(os.path.join(d, f) for f in ('cover_tiktok.jpg', 'cover.jpg', 'tt/01.jpg', '01.jpg') if os.path.exists(os.path.join(d, f))), dst, (270, 480))
        print('thumb_tiktok', e['id'])


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


def _u(x):
    return len(x.encode('utf-16-le')) // 2


def _cells(r):
    return [''.join(x.get('textRun', {}).get('content', '') for p in c['content'] for x in p.get('paragraph', {}).get('elements', [])).strip()
            for c in r['tableCells']]


def _table(path):
    d = json.load(open(path))
    d = d.get('content', d)
    body = d['tabs'][0]['documentTab']['body']['content']
    el = next(e for e in body if 'table' in e)
    return d, el, el['table']


def _fill(reqs, start, cells, img_col, img_uri, size, link_col=None, link=None):
    """Fill an empty row that starts at `start`: image first, then text right to left, so every index stays valid."""
    reqs.append({'insertInlineImage': {'location': {'index': start + 2 + 2 * img_col}, 'uri': img_uri, 'objectSize': size}})
    for c in reversed(range(len(cells))):
        reqs.append({'insertText': {'location': {'index': start + 2 + 2 * c}, 'text': cells[c]}})
    if link:
        a = start + 2 + 2 * link_col + sum(_u(x) for x in cells[:link_col])
        reqs.append({'updateTextStyle': {'range': {'startIndex': a, 'endIndex': a + _u(cells[link_col])},
                                         'textStyle': dict(LINK, link={'url': link}), 'fields': 'link,foregroundColor,underline'}})


def doc_rows(path, sha):
    """Build one update_doc call that appends missing rows to the tracker table (thumbs must be pushed at `sha`)."""
    d, el, t = _table(path)
    have, sched = set(), {}
    for r in t['tableRows']:
        c = _cells(r)
        have.update(re.findall(r'instagram\.com/\S+?/(?=\s|$)', ' '.join(c) + ' '))
        if len(c) > 3 and c[3] == 'Scheduled':
            sched[c[1]] = r['tableCells'][3]['content'][0]['paragraph']['elements'][0]
    reqs, end, n, added, swapped = [], t['tableRows'][-1]['endIndex'], len(t['tableRows']), [], []
    new = []
    for e in rows(scheduled=True):
        title = e.get('title') or e.get('hook')
        if e.get('ig_url'):
            if e['ig_url'].replace('https://www.', '') in have:
                continue
            if title in sched:
                swapped.append((sched[title], e))
                continue
        elif title in sched:
            continue
        new.append(e)
    # rows go in bottom-up so every index below stays valid: each new row is inserted below the current last row
    for e in reversed(new):
        link = e.get('ig_url')
        cells = [e['slot'][:10], e.get('title') or e.get('hook'), style(e), link.replace('https://www.', '') if link else 'Scheduled']
        reqs.append({'insertTableRow': {'tableCellLocation': {'tableStartLocation': {'index': el['startIndex']}, 'rowIndex': n - 1, 'columnIndex': 0}, 'insertBelow': True}})
        _fill(reqs, end, cells, 4, RAW.replace('claude/ig-news-automation', sha) % e['id'],
              {'width': {'magnitude': 90, 'unit': 'PT'}, 'height': {'magnitude': 112.5, 'unit': 'PT'}}, 3, link)
        added.append(e['id'])
    # Scheduled -> link swaps sit above the appended rows, so do them last, bottom-up
    for run, e in sorted(swapped, key=lambda x: -x[0]['startIndex']):
        txt = e['ig_url'].replace('https://www.', '')
        reqs.append({'deleteContentRange': {'range': {'startIndex': run['startIndex'], 'endIndex': run['startIndex'] + len('Scheduled')}}})
        reqs.append({'insertText': {'location': {'index': run['startIndex']}, 'text': txt}})
        reqs.append({'updateTextStyle': {'range': {'startIndex': run['startIndex'], 'endIndex': run['startIndex'] + _u(txt)},
                                         'textStyle': dict(LINK, link={'url': e['ig_url']}), 'fields': 'link,foregroundColor,underline'}})
        added.append(e['id'] + ' (link)')
    return {'documentId': d['documentId'], 'requests': reqs, 'writeControl': {'requiredRevisionId': d['revisionId']}, 'added': added}


def tiktok_rows(path, sha):
    """update_doc args for the TikTok doc: rows for tiktok_log entries with doc_row false, newest first under the header."""
    d, el, t = _table(path)
    have = set()
    for r in t['tableRows']:
        have.update(re.findall(r'tiktok\.com/@[^/]+/video/\d+', ' '.join(_cells(r))))
    new = [e for e in tt_rows() if not (e.get('tiktok_url') and _short(e['tiktok_url']) in have)]
    reqs, start, added = [], t['tableRows'][1]['startIndex'], []
    # each new row goes above the current first data row, so insert oldest first: the newest ends on top
    for e in sorted(new, key=lambda e: e['slot']):
        link = e.get('tiktok_url')
        cells = [e['slot'][:10], e['slot'][11:16], e['topic'], e.get('hook') or e['topic'], _short(link) if link else 'Scheduled']
        w, h = Image.open(os.path.join(ROOT, 'media', e['id'], 'thumb_tiktok.jpg')).size
        reqs.append({'insertTableRow': {'tableCellLocation': {'tableStartLocation': {'index': el['startIndex']}, 'rowIndex': 1, 'columnIndex': 0}, 'insertBelow': False}})
        _fill(reqs, start, cells, 5, RAW_TT % (sha, e['id']),
              {'width': {'magnitude': 67.5, 'unit': 'PT'}, 'height': {'magnitude': round(67.5 * h / w, 2), 'unit': 'PT'}}, 4,
              link and 'https://www.' + _short(link))
        added.append(e['id'])
    return {'documentId': d['documentId'], 'requests': reqs, 'writeControl': {'requiredRevisionId': d['revisionId']}, 'added': added}


def _short(u):
    return re.sub(r'^https?://(www\.)?', '', u.split('?')[0])


if __name__ == '__main__':
    if sys.argv[1] in ('rows', 'tiktok'):
        print(json.dumps((doc_rows if sys.argv[1] == 'rows' else tiktok_rows)(sys.argv[2], sys.argv[3]), ensure_ascii=False))
    else:
        {'thumbs': thumbs, 'html': lambda: print(html())}[sys.argv[1]]()
