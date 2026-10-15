#!/usr/bin/env python3
"""Download a photo into a post folder, resized to <=1800px, as JPEG.
Usage: python3 ig-news/tools/get_image.py <url | commons:File_Name.jpg | og:https://article> <out.jpg>
  commons:  Wikimedia Commons file (prints author/license line for the credit)
  og:       the article's og:image (lead photo); credit the outlet/agency named on the page"""
import sys, re, io, json, urllib.request, urllib.parse
from PIL import Image
UA = {'User-Agent': 'HotcoinNewsDesk/1.0 (+https://www.hotcoin.com)'}
src, out = sys.argv[1], sys.argv[2]
get = lambda u: urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=30).read()
if src.startswith('commons:'):
    name = src[8:].replace(' ', '_')
    try:
        meta = json.loads(get('https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&format=json&titles=File:' + urllib.parse.quote(name)))
        m = next(iter(meta['query']['pages'].values()))['imageinfo'][0]['extmetadata']
        clean = lambda k: re.sub('<[^>]+>', '', m.get(k, {}).get('value', '')).strip()
        print('CREDIT:', clean('Artist'), '|', clean('LicenseShortName'))
    except Exception as e:
        print('CREDIT: (lookup failed, check the file page)', e)
    url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(name) + '?width=1800'
elif src.startswith('og:'):
    page = get(src[3:]).decode('utf-8', 'ignore')
    mm = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)', page) or re.search(r'content=["\']([^"\']+)["\'][^>]+property=["\']og:image', page)
    if not mm:
        sys.exit('no og:image found')
    url = mm.group(1).replace('&amp;', '&'); print('OG IMAGE:', url)
else:
    url = src
im = Image.open(io.BytesIO(get(url))).convert('RGB')
im.thumbnail((1800, 1800))
im.save(out, quality=90)
print('saved', out, im.size)
