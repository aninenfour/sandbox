#!/usr/bin/env python3
"""List recent crypto headlines from RSS feeds (newest first) as JSON lines.
Usage: python3 ig-news/tools/fetch_news.py [hours=12]"""
import sys, json, re, email.utils, datetime as dt, urllib.request, xml.etree.ElementTree as ET
FEEDS = {
    'CoinDesk': 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    'Cointelegraph': 'https://cointelegraph.com/rss',
    'The Block': 'https://www.theblock.co/rss.xml',
    'Decrypt': 'https://decrypt.co/feed',
}
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) HotcoinNewsDesk/1.0'}
hours = float(sys.argv[1]) if len(sys.argv) > 1 else 12
cut = dt.datetime.now(dt.timezone.utc) - dt.timedelta(hours=hours)
items = []
for src, url in FEEDS.items():
    try:
        raw = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20).read()
        root = ET.fromstring(raw)
    except Exception as e:
        print(json.dumps({'source': src, 'error': str(e)[:120]}), file=sys.stderr); continue
    for it in root.iter('item'):
        g = lambda t: (it.findtext(t) or '').strip()
        try:
            when = email.utils.parsedate_to_datetime(g('pubDate'))
        except Exception:
            continue
        if when < cut:
            continue
        img = ''
        for el in it:
            if el.tag.endswith('content') or el.tag.endswith('thumbnail') or el.tag == 'enclosure':
                img = el.attrib.get('url', img)
        desc = re.sub('<[^>]+>', '', g('description'))[:280]
        items.append({'when': when.isoformat(), 'source': src, 'title': g('title'), 'link': g('link'), 'img': img, 'desc': desc})
items.sort(key=lambda x: x['when'], reverse=True)
for i in items:
    print(json.dumps(i, ensure_ascii=False))
