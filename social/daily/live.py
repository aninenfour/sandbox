#!/usr/bin/env python3
"""Live daily gainers post: rank Hotcoin's USDT pairs by 24h change right now, resolve each
token's logo and X handle on CoinGecko, render the posters (square.mjs) and write the captions.

  python3 social/daily/live.py top1|top5 [--min-vol 50000]

Writes social/daily/live/<YYYYmmdd-HHMM>-<kind>/ with data.json, the PNG and caption.txt,
and prints a JSON summary (paths, top list, caption). Coins resolved once are cached in
social/daily/coins.json; edit that file to fix a wrong match or handle.
"""
import argparse, colorsys, datetime as dt, io, json, os, subprocess, sys, time, urllib.parse, urllib.request
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
LOGOS = os.path.join(HERE, 'logos')
CACHE = os.path.join(HERE, 'coins.json')
TICKER = 'https://api.hotcoinfin.com/v1/market/ticker'
CG = 'https://api.coingecko.com/api/v3'
TZ = dt.timezone(dt.timedelta(hours=8))
# handles that belong to an issuer or exchange rather than the token itself: don't tag them
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


def gainers(min_vol, n=5):
    t = json.loads(get(TICKER))['ticker']
    rows = [x for x in t if x['symbol'].endswith('_usdt') and float(x['amount']) >= min_vol]
    rows.sort(key=lambda x: -float(x['change']))
    return [{'sym': x['symbol'][:-5].upper(), 'ch': float(x['change']), 'last': x['last'], 'vol': float(x['amount'])} for x in rows[:n]]


def resolve(sym, cache):
    if sym in cache:
        return cache[sym]
    res = json.loads(get(f'{CG}/search?query={urllib.parse.quote(sym)}'))
    cands = [c for c in res.get('coins', []) if c['symbol'].upper() == sym]
    if not cands:
        info = {'id': None, 'name': sym, 'twitter': None, 'logo': None}
    else:
        best = min(cands, key=lambda c: c.get('market_cap_rank') or 10 ** 9)
        time.sleep(2)
        c = json.loads(get(f'{CG}/coins/{best["id"]}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false'))
        info = {'id': best['id'], 'name': c.get('name') or sym, 'twitter': (c.get('links') or {}).get('twitter_screen_name') or None,
                'image': (c.get('image') or {}).get('large'), 'logo': sym.lower()}
    cache[sym] = info
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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('kind', choices=['top1', 'top5'])
    ap.add_argument('--min-vol', type=float, default=50000)
    a = ap.parse_args()

    now = dt.datetime.now(TZ)
    top = gainers(a.min_vol)
    cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    for g in top:
        info = resolve(g['sym'], cache)
        g['name'], g['handle'] = info['name'], tag(info)
        lf = logo_file(info)
        g['logo'] = os.path.splitext(os.path.basename(lf))[0] if lf else 'missing'
        g['bg'], g['glow'] = colours(lf)
    json.dump(cache, open(CACHE, 'w'), indent=1, ensure_ascii=False)

    stamp = now.strftime('%b %-d %H:%M')
    window = f'24H to {stamp} (UTC+8)'
    out = os.path.join(HERE, 'live', now.strftime('%Y%m%d-%H%M') + '-' + a.kind)
    os.makedirs(out, exist_ok=True)
    data = {'window': window, 'date': now.strftime('%b %-d').upper(),
            'gainers': [{k: g[k] for k in ('sym', 'name', 'ch', 'logo', 'bg', 'glow')} for g in top]}
    json.dump(data, open(os.path.join(out, 'data.json'), 'w'), indent=1, ensure_ascii=False)

    page = 'sq-top1' if a.kind == 'top1' else 'sq-white'
    subprocess.run(['node', os.path.join(HERE, 'square.mjs'), page], check=True,
                   env={**os.environ, 'DATA': os.path.join(out, 'data.json'), 'OUT_DIR': out}, stdout=subprocess.DEVNULL)

    p = lambda v: f'+{v:.2f}%' if v >= 0 else f'{v:.2f}%'
    line = lambda g: ' '.join(x for x in (f'${g["sym"]}', g['handle'], p(g['ch'])) if x)
    if a.kind == 'top1':
        g = top[0]
        cap = (f'🥇 Top Gainer on Hotcoin right now\n\n{line(g)} in 24h 🚀\n⏱ {window}\n\n'
               f'Are you in? 👇\n#Hotcoin #TopGainers')
    else:
        medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']
        cap = (f'🔥 Daily Top Gainers TOP 5 on Hotcoin\n⏱ {window}\n\n' + '\n'.join(f'{m} {line(g)}' for m, g in zip(medals, top)) +
               '\n\nWhich one are you riding next? 👇\n#Hotcoin #TopGainers')
    open(os.path.join(out, 'caption.txt'), 'w').write(cap)
    print(json.dumps({'dir': os.path.relpath(out, os.path.dirname(os.path.dirname(HERE))), 'image': os.path.join(out, page + '.png'),
                      'top': [{k: g[k] for k in ('sym', 'name', 'ch', 'vol', 'handle', 'logo')} for g in top], 'caption': cap,
                      'caption_len': len(cap)}, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
