#!/usr/bin/env python3
"""Live daily gainers post: rank Hotcoin's USDT pairs by 24h change right now, resolve each
token's logo and X handle on CoinGecko, render the posters (square.mjs) and write the captions.

  python3 social/daily/live.py top1|top5 [--min-vol 50000] [--template auto|podium|orbit|news]
  python3 social/daily/live.py top5 --rerender social/daily/live/<stamp>-top5   # same numbers, re-read news

top5 rotates three templates so the 22:05 post doesn't look the same every night:
  podium  sq-white: white cards, big numbers (the original)
  orbit   sq-orbit: ink, coins climbing a lime trajectory, few numbers
  news    sq-news:  editorial list with small logos and one "why it moved" line per coin
'auto' (default) picks one at random, seeded by the date (so a preview and the real run agree)
and never the same as the last posted night. News lines come from social/daily/news/<YYYY-MM-DD>.json:
  {"GNR": {"line": "short fact, max ~80 chars, dated", "src": "https://..."}, ...}
A coin without a line shows its 24h Hotcoin volume instead ("No single headline...").

Writes social/daily/live/<YYYYmmdd-HHMM>-<kind>/ with data.json, the PNG and caption.txt,
and prints a JSON summary (paths, top list, caption). Coins resolved once are cached in
social/daily/coins.json; edit that file to fix a wrong match or handle.
"""
import argparse, colorsys, datetime as dt, glob, io, json, os, random, subprocess, sys, time, urllib.parse, urllib.request
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
LOGOS = os.path.join(HERE, 'logos')
CACHE = os.path.join(HERE, 'coins.json')
TICKER = 'https://api.hotcoinfin.com/v1/market/ticker'
CG = 'https://api.coingecko.com/api/v3'
TZ = dt.timezone(dt.timedelta(hours=8))
# handles that belong to an issuer or exchange rather than the token itself: don't tag them
TEMPLATES = {'podium': 'sq-white', 'orbit': 'sq-orbit', 'news': 'sq-news'}
NEWS = os.path.join(HERE, 'news')
NO_TAG = {'binance', 'bybit_official', 'okx', 'coinbase', 'kucoincom', 'gate_io', 'hotcoin_ex'}


def get(url, tries=5):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'hotcoin-daily/1.0', 'Accept': 'application/json'})
            with urllib.request.urlopen(req, timeout=25) as r:
                return r.read()
        except Exception as e:  # CoinGecko rate-limits with 429; back off
            if i == tries - 1:
                raise
            time.sleep(6 * (i + 1))


def get_json(url, tries=6):
    for i in range(tries):
        try:
            d = json.loads(get(url))
            if not (isinstance(d, dict) and 'status' in d and isinstance(d['status'], dict) and d['status'].get('error_code')):
                return d
        except Exception:
            if i == tries - 1:
                raise
        time.sleep(10 * (i + 1))
    raise RuntimeError(f'rate-limited: {url}')


def gainers(min_vol, n=5):
    t = json.loads(get(TICKER))['ticker']
    rows = [x for x in t if x['symbol'].endswith('_usdt') and float(x['amount']) >= min_vol]
    rows.sort(key=lambda x: -float(x['change']))
    return [{'sym': x['symbol'][:-5].upper(), 'ch': float(x['change']), 'last': float(x['last']), 'vol': float(x['amount'])} for x in rows[:n]]


def price_ok(cg, hc):
    return cg and hc and 0.7 <= cg / hc <= 1 / 0.7


def resolve(sym, price, cache):
    """Match the Hotcoin ticker to a CoinGecko coin. A match only counts if CoinGecko's price is
    within ±30% of Hotcoin's last price, so a same-symbol different token never gets tagged."""
    if sym in cache and cache[sym].get('id'):
        cg = get_json(f'{CG}/simple/price?ids={cache[sym]["id"]}&vs_currencies=usd').get(cache[sym]['id'], {}).get('usd')
        if price_ok(cg, price) or cache[sym].get('pinned'):
            return cache[sym]
        print(f'{sym}: cached {cache[sym]["id"]} price {cg} vs Hotcoin {price}, re-resolving', file=sys.stderr)
    res = get_json(f'{CG}/search?query={urllib.parse.quote(sym)}')
    cands = [c for c in res.get('coins', []) if c['symbol'].upper() == sym][:12]
    prices = get_json(f'{CG}/simple/price?ids={",".join(c["id"] for c in cands)}&vs_currencies=usd') if cands else {}
    ok = [c for c in cands if price_ok(prices.get(c['id'], {}).get('usd'), price)]
    if not ok:
        print(f'{sym}: no CoinGecko coin with a matching price, posting without tag/logo', file=sys.stderr)
        info = {'id': None, 'name': '', 'twitter': None, 'logo': None}
    else:
        best = min(ok, key=lambda c: c.get('market_cap_rank') or 10 ** 9)
        time.sleep(2)
        c = get_json(f'{CG}/coins/{best["id"]}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false')
        info = {'id': best['id'], 'name': c.get('name') or sym, 'twitter': (c.get('links') or {}).get('twitter_screen_name') or None,
                'image': (c.get('image') or {}).get('large'), 'logo': sym.lower()}
    if info['id']:
        cache[sym] = info
    else:
        cache.pop(sym, None)
    time.sleep(2)
    return info


def logo_file(info):
    key = info.get('logo')
    if not key:
        return None
    path = os.path.join(LOGOS, key + '.png')
    if not os.path.exists(path) and info.get('image'):
        Image.open(io.BytesIO(get(info['image']))).convert('RGBA').save(path)
    return path if os.path.exists(path) else None


def colours(path):
    """bg: colour just inside the coin's edge (white if transparent); glow: the logo's most vivid common colour."""
    if not path:
        return '#141414', '#B8F26A'
    im = Image.open(path).convert('RGBA').resize((64, 64))
    px = im.load()
    r, g, b, a = px[32, 4]
    bg = '#%02x%02x%02x' % (r, g, b) if a > 200 else '#ffffff'
    best, score = None, 0
    for (cnt, (r, g, b, a)) in im.getcolors(64 * 64):
        if a < 200:
            continue
        h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        if l < 0.15 or l > 0.92:
            continue
        sc = cnt * (s ** 2)
        if sc > score:
            best, score = (r, g, b), sc
    glow = '#%02x%02x%02x' % best if best else '#9AA3B5'
    return bg, glow


def tag(info):
    h = info.get('twitter')
    return f'@{h}' if h and h.lower() not in NO_TAG else ''


def pick_template(now, want):
    if want != 'auto':
        return want
    prev = 'podium'
    today = now.strftime('%Y%m%d')
    for d in sorted(glob.glob(os.path.join(HERE, 'live', '*-top5'))):
        if os.path.basename(d)[:8] < today and os.path.exists(os.path.join(d, 'published.json')):
            try:
                prev = json.load(open(os.path.join(d, 'data.json'))).get('template', 'podium')
            except Exception:
                pass
    return random.Random(now.strftime('%Y-%m-%d')).choice([t for t in TEMPLATES if t != prev])


def add_news(data, day):
    path = os.path.join(NEWS, day + '.json')
    news = json.load(open(path)) if os.path.exists(path) else {}
    for g in data['gainers']:
        n = news.get(g['sym'])
        g['news'] = n['line'] if n and n.get('line') else None
        if g['news'] and len(g['news']) > 85:
            print(f'{g["sym"]}: news line is {len(g["news"])} chars, keep it under ~80 or it gets cut', file=sys.stderr)
        if g['news'] and ('\u2014' in g['news'] or '\u2013' in g['news']):
            sys.exit(f'{g["sym"]}: no em/en dashes in the news line')


def caption(data, kind):
    p = lambda v: f'+{v:.2f}%' if v >= 0 else f'{v:.2f}%'
    line = lambda g: ' '.join(x for x in (f'${g["sym"]}', g.get('handle', ''), p(g['ch'])) if x)
    top, window = data['gainers'], data['window']
    if kind == 'top1':
        g = top[0]
        return (f'🥇 Top Gainer on Hotcoin right now\n\n{line(g)} in 24h 🚀\n⏱ {window}\n\n'
                f'Are you in? 👇\n#Hotcoin #TopGainers')
    medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']
    rows = '\n'.join(f'{m} {line(g)}' for m, g in zip(medals, top))
    t = data.get('template', 'podium')
    if t == 'orbit':
        return f'🚀 Tonight\'s Top 5 climbers on Hotcoin\n⏱ {window}\n\n{rows}\n\nWho makes the list tomorrow? 👇\n#Hotcoin #TopGainers'
    if t == 'news':
        return f'📰 Top 5 Gainers on Hotcoin, and why they moved\n⏱ {window}\n\n{rows}\n\nThe stories are on the card 👆\n#Hotcoin #TopGainers'
    return f'🔥 Daily Top Gainers TOP 5 on Hotcoin\n⏱ {window}\n\n{rows}\n\nWhich one are you riding next? 👇\n#Hotcoin #TopGainers'


def render(out, data, kind):
    page = 'sq-top1' if kind == 'top1' else TEMPLATES[data.get('template', 'podium')]
    json.dump(data, open(os.path.join(out, 'data.json'), 'w'), indent=1, ensure_ascii=False)
    subprocess.run(['node', os.path.join(HERE, 'square.mjs'), page], check=True,
                   env={**os.environ, 'DATA': os.path.join(out, 'data.json'), 'OUT_DIR': out}, stdout=subprocess.DEVNULL)
    cap = caption(data, kind)
    open(os.path.join(out, 'caption.txt'), 'w').write(cap)
    return os.path.join(out, page + '.png'), cap


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('kind', choices=['top1', 'top5'])
    ap.add_argument('--min-vol', type=float, default=50000)
    ap.add_argument('--template', default='auto', choices=['auto', *TEMPLATES])
    ap.add_argument('--rerender', help='existing live/<stamp>-top5 folder: keep its numbers, re-read news, render again')
    ap.add_argument('--preview', action='store_true', help='print tonight\'s template and current movers only, write nothing')
    a = ap.parse_args()

    now = dt.datetime.now(TZ)
    if a.rerender:
        out = os.path.abspath(a.rerender)
        data = json.load(open(os.path.join(out, 'data.json')))
        if a.template != 'auto':
            data['template'] = a.template
        if data.get('template') == 'news':
            add_news(data, data['day'])
        img, cap = render(out, data, a.kind)
        print(json.dumps({'dir': out, 'image': img, 'template': data.get('template'), 'caption': cap}, ensure_ascii=False, indent=1))
        return

    tpl = pick_template(now, a.template) if a.kind == 'top5' else None
    top = gainers(a.min_vol)
    if a.preview:
        print(json.dumps({'template': tpl, 'movers': [{k: g[k] for k in ('sym', 'ch', 'vol')} for g in top]}, indent=1))
        return
    cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    for g in top:
        info = resolve(g['sym'], g['last'], cache)
        g['name'], g['handle'] = info['name'], tag(info)
        lf = logo_file(info)
        g['logo'] = os.path.splitext(os.path.basename(lf))[0] if lf else 'missing'
        g['bg'], g['glow'] = colours(lf)
    json.dump(cache, open(CACHE, 'w'), indent=1, ensure_ascii=False)

    window = f'24H to {now.strftime("%b %-d %H:%M")} (UTC+8)'
    out = os.path.join(HERE, 'live', now.strftime('%Y%m%d-%H%M') + '-' + a.kind)
    os.makedirs(out, exist_ok=True)
    data = {'window': window, 'date': now.strftime('%b %-d').upper(), 'day': now.strftime('%Y-%m-%d'), 'template': tpl or 'podium',
            'gainers': [{k: g[k] for k in ('sym', 'name', 'ch', 'vol', 'handle', 'logo', 'bg', 'glow')} for g in top]}
    if tpl == 'news':
        add_news(data, data['day'])
    img, cap = render(out, data, a.kind)
    missing = [g['sym'] for g in data['gainers'] if tpl == 'news' and not g.get('news')]
    print(json.dumps({'dir': os.path.relpath(out, os.path.dirname(os.path.dirname(HERE))), 'image': img, 'template': data['template'],
                      'news_missing': missing,
                      'top': [{k: g[k] for k in ('sym', 'name', 'ch', 'vol', 'handle', 'logo')} for g in top], 'caption': cap,
                      'caption_len': len(cap)}, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
