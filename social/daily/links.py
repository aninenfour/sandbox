#!/usr/bin/env python3
"""Hotcoin page link for the daily posts (Hotcoin social linkage plan; owner Nov 17 2026: Converter links only).

Every daily post carries exactly one link, always www.hotcoin.com, English, USD:
  the Converter page of the post's lead coin   https://www.hotcoin.com/en_US/converter/<sym>/usd/
  top5: the #1 gainer (falls back to #2, #3, ...); watch: the first pick (then the next ones).
  If none of the post's coins has a Converter page: https://www.hotcoin.com/en_US/converter/btc/usd/
No Price pages and no Academy (/learn/) links in these posts.

Pages come from Hotcoin's own converter-en_US-sitemap.xml. A page is used only if it loads (HTTP 200) and its
<title> names the right ticker, e.g. "Convert Rain (RAIN) to US Dollar (USD) | Hotcoin".

  python3 social/daily/links.py RAIN NVDAB BTC     # prints the link line for the first that resolves
"""
import re, sys, urllib.request

SITE = 'https://www.hotcoin.com'
LANG = 'en_US'
FIAT = 'usd'
SITEMAP = f'{SITE}/converter-{LANG}-sitemap.xml'
_syms = None


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


def link_line(syms):
    """One caption line with one Hotcoin Converter link: the first symbol that has a page, else BTC."""
    for s in list(syms) + ['BTC']:
        url = converter_url(s)
        if url:
            return f'🧮 1 ${s.upper()} in USD right now: {url}'
    return f'🧮 1 $BTC in USD right now: {SITE}/{LANG}/converter/btc/{FIAT}/'


if __name__ == '__main__':
    print(link_line(sys.argv[1:] or ['BTC']))
