#!/usr/bin/env python3
"""Hotcoin page links for the daily posts (Hotcoin social linkage plan, Nov 17 2026).

Every daily post carries exactly one link to a Hotcoin page, always on www.hotcoin.com, English (en_US):
  1. Price page of the post's lead coin:  https://www.hotcoin.com/en_US/price/<slug>/
     top5: the #1 gainer (falls back to #2, #3, ...); watch: the first pick (then the next ones).
  2. If none of the post's coins has a price page: the BTC Price page
     https://www.hotcoin.com/en_US/price/bitcoin-btc/
Price pages only (owner, Nov 17): no Converter or Academy (/learn/) links in the daily posts.

Slugs come from Hotcoin's own sitemap (price-en_US-sitemap.xml). A page is only used if it loads (HTTP 200) and its
<title> names the right ticker, e.g. "Rain (RAIN) Price Today | Hotcoin", so a same-name page never gets linked.

  python3 social/daily/links.py RAIN NVDAB BTC     # prints the link line for the first that resolves
"""
import re, sys, urllib.request

SITE = 'https://www.hotcoin.com'
LANG = 'en_US'
SITEMAP = f'{SITE}/price-{LANG}-sitemap.xml'
BTC_PRICE = f'{SITE}/{LANG}/price/bitcoin-btc/'
_slugs = None


def _get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (hotcoin-daily)'})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.status, r.read().decode('utf-8', 'replace')


def slugs():
    global _slugs
    if _slugs is None:
        _slugs = []
        for _ in range(2):
            try:
                _, xml = _get(SITEMAP)
                _slugs = re.findall(rf'/{LANG}/price/([a-z0-9-]+)/', xml)
                break
            except Exception as e:
                print(f'links: sitemap failed ({e})', file=sys.stderr)
    return _slugs


def _title_ok(url, sym):
    try:
        status, html = _get(url)
    except Exception:
        return False
    m = re.search(r'<title>([^<]*)', html)
    return status == 200 and bool(m) and f'({sym.upper()})' in m.group(1)


def price_url(sym):
    """Verified Price page URL for a Hotcoin symbol, or None. Tokenized stocks (NVDAB) also try the stock (NVDA)."""
    sym = sym.upper()
    tries = [sym] + ([sym[:-1]] if sym.endswith('B') and len(sym) > 2 else [])
    for s in tries:
        low = s.lower()
        cands = [x for x in slugs() if x == low or x.endswith('-' + low)]
        cands.sort(key=lambda x: (x != low, len(x)))
        for slug in cands[:4]:
            url = f'{SITE}/{LANG}/price/{slug}/'
            if _title_ok(url, s):
                return url
    return None


def link_line(syms):
    """One caption line with one Hotcoin Price page link: the first symbol that has one, else BTC's."""
    for s in syms:
        url = price_url(s)
        if url:
            return f'📊 ${s.upper()} live price and chart: {url}'
    return f'📊 $BTC live price and chart: {price_url("BTC") or BTC_PRICE}'


if __name__ == '__main__':
    print(link_line(sys.argv[1:] or ['BTC']))
