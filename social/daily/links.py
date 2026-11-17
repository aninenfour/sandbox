#!/usr/bin/env python3
"""Hotcoin page link for the daily posts (Hotcoin social linkage plan, owner Nov 17 2026).

Every daily post carries exactly one link, always www.hotcoin.com, English:
  What to Watch (watch.py): Converter page to USD  https://www.hotcoin.com/en_US/converter/<sym>/usd/
     the first pick that has one (then the next picks), else BTC to USD.            -> converter_line()
  Top 5 Gainers (live.py):  Price page             https://www.hotcoin.com/en_US/price/<slug>/
     the #1 gainer (then #2, #3, ...), else BTC's Price page.                        -> price_line()
No Academy (/learn/) links in these posts.

Pages come from Hotcoin's own en_US sitemaps. A page is used only if it loads (HTTP 200) and its <title> names
the right ticker, e.g. "Convert Rain (RAIN) to US Dollar (USD) | Hotcoin" or "Rain (RAIN) Price Today | Hotcoin".

  python3 social/daily/links.py converter ZRO NVDAB     # prints the line for the first that resolves
  python3 social/daily/links.py price RAIN HUMA
"""
import re, sys, urllib.request

SITE = 'https://www.hotcoin.com'
LANG = 'en_US'
FIAT = 'usd'
SITEMAP = f'{SITE}/converter-{LANG}-sitemap.xml'
PRICE_SITEMAP = f'{SITE}/price-{LANG}-sitemap.xml'
_syms = None
_slugs = None


def _get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (hotcoin-daily)'})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.status, r.read().decode('utf-8', 'replace')


def sitemap_syms():
    global _syms
    if _syms is None:
        _syms = set()
        for _ in range(2):
            try:
                _, xml = _get(SITEMAP)
                _syms = set(re.findall(rf'/{LANG}/converter/([a-z0-9]+)/{FIAT}/', xml))
                break
            except Exception as e:
                print(f'links: sitemap failed ({e})', file=sys.stderr)
    return _syms


def converter_url(sym):
    """Verified Converter page URL (to USD) for a Hotcoin symbol, or None."""
    sym = sym.upper()
    if sitemap_syms() and sym.lower() not in sitemap_syms():
        return None
    url = f'{SITE}/{LANG}/converter/{sym.lower()}/{FIAT}/'
    try:
        status, html = _get(url)
    except Exception:
        return None
    m = re.search(r'<title>([^<]*)', html)
    return url if status == 200 and m and f'({sym})' in m.group(1) else None


def _title_names(url, sym):
    try:
        status, html = _get(url)
    except Exception:
        return False
    m = re.search(r'<title>([^<]*)', html)
    return status == 200 and bool(m) and f'({sym.upper()})' in m.group(1)


def price_slugs():
    global _slugs
    if _slugs is None:
        _slugs = []
        for _ in range(2):
            try:
                _, xml = _get(PRICE_SITEMAP)
                _slugs = re.findall(rf'/{LANG}/price/([a-z0-9-]+)/', xml)
                break
            except Exception as e:
                print(f'links: price sitemap failed ({e})', file=sys.stderr)
    return _slugs


def price_url(sym):
    """Verified Price page URL for a Hotcoin symbol, or None (slugs end in -<sym> or equal it, e.g. layerzero-zro, rain)."""
    low = sym.lower()
    cands = sorted((x for x in price_slugs() if x == low or x.endswith('-' + low)), key=lambda x: (x != low, len(x)))
    for slug in cands[:4]:
        url = f'{SITE}/{LANG}/price/{slug}/'
        if _title_names(url, sym):
            return url
    return None


def price_line(syms):
    """Top 5 Gainers: one Price page link, the first symbol that has one, else BTC's."""
    for s in list(syms) + ['BTC']:
        url = price_url(s)
        if url:
            return f'📊 ${s.upper()} live price and chart: {url}'
    return f'📊 $BTC live price and chart: {SITE}/{LANG}/price/bitcoin-btc/'


def converter_line(syms):
    """What to Watch: one Converter (to USD) link, the first symbol that has a page, else BTC."""
    for s in list(syms) + ['BTC']:
        url = converter_url(s)
        if url:
            return f'🧮 1 ${s.upper()} in USD right now: {url}'
    return f'🧮 1 $BTC in USD right now: {SITE}/{LANG}/converter/btc/{FIAT}/'


if __name__ == '__main__':
    kind, syms = (sys.argv[1], sys.argv[2:]) if len(sys.argv) > 1 and sys.argv[1] in ('price', 'converter') else ('converter', sys.argv[1:])
    print((price_line if kind == 'price' else converter_line)(syms or ['BTC']))
