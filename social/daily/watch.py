#!/usr/bin/env python3
"""Morning "What to Watch Today" post: 5 assets across crypto and TradFi, all live on Hotcoin.

  python3 social/daily/watch.py social/daily/watch/<YYYY-MM-DD>/picks.json

picks.json (written by the run after its news research, see RUNBOOK.md):
  {"items": [
     {"sym": "BTC",   "kind": "crypto", "why": "Fed decision tonight, 02:00 UTC+8"},
     {"sym": "NVDAB", "kind": "tradfi", "name": "NVIDIA", "handle": "nvidia", "why": "Earnings after the US close"},
     ...5 items, at least 2 crypto and 2 tradfi]}
  "sym" is the Hotcoin base symbol (the part before _usdt). "handle" (X handle, no @) and "name" are optional
  overrides; otherwise crypto handles come from CoinGecko (coins.json cache) and TradFi from TRADFI below.

Checks every symbol against Hotcoin's live ticker (exits non-zero if one is missing), takes live price and
24h change, renders the poster (square.mjs sq-watch) and writes three captions next to picks.json:
  x.txt (with @handles), facebook.txt and linkedin.txt (no @handles).
"""
import datetime as dt, json, os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import live  # noqa: E402  (reuses ticker, CoinGecko resolve, logo + colour helpers)

# X handles for the companies / issuers behind Hotcoin's tokenized stocks and gold tokens.
TRADFI = {
    'AAPL': ('Apple', 'Apple'), 'NVDA': ('NVIDIA', 'nvidia'), 'TSLA': ('Tesla', 'Tesla'), 'MSFT': ('Microsoft', 'Microsoft'),
    'GOOGL': ('Alphabet', 'Google'), 'AMZN': ('Amazon', 'amazon'), 'META': ('Meta', 'Meta'), 'NFLX': ('Netflix', 'netflix'),
    'COIN': ('Coinbase', 'coinbase'), 'HOOD': ('Robinhood', 'RobinhoodApp'), 'MSTR': ('Strategy', 'Strategy'),
    'PLTR': ('Palantir', 'PalantirTech'), 'AMD': ('AMD', 'AMD'), 'AVGO': ('Broadcom', 'Broadcom'), 'MU': ('Micron', 'MicronTech'),
    'TSM': ('TSMC', None), 'ORCL': ('Oracle', 'Oracle'), 'INTC': ('Intel', 'intel'), 'BABA': ('Alibaba', 'AlibabaGroup'),
    'CRCL': ('Circle', 'circle'), 'SPCX': ('SpaceX', 'SpaceX'), 'QCOM': ('Qualcomm', 'Qualcomm'), 'ARM': ('Arm', 'Arm'),
    'ASML': ('ASML', 'ASMLcompany'), 'IBM': ('IBM', 'IBM'), 'PYPL': ('PayPal', 'PayPal'), 'CRWD': ('CrowdStrike', 'CrowdStrike'),
    'SMCI': ('Supermicro', 'Supermicro_SMCI'), 'DELL': ('Dell', 'Dell'), 'GME': ('GameStop', 'GameStop'), 'RKLB': ('Rocket Lab', 'RocketLab'),
    'MRVL': ('Marvell', 'MarvellTech'), 'NOK': ('Nokia', 'nokia'), 'GS': ('Goldman Sachs', 'GoldmanSachs'), 'BMNR': ('BitMine', None),
    'SPY': ('S&P 500 ETF', None), 'QQQ': ('Nasdaq 100 ETF', None), 'TQQQ': ('Nasdaq 100 3x ETF', None), 'SMH': ('Semiconductor ETF', None),
    'XAUT': ('Tether Gold', None), 'PAXG': ('PAX Gold', 'PaxosGlobal'),
}
TZ = live.TZ
LIGHT = ((0, 4351), (8192, 8205), (8208, 8223), (8242, 8247))


def x_len(t):
    """X's weighted length, erring high (same rule as publish.py): emoji count 2."""
    n = 0
    for ch in t:
        c = ord(ch)
        if c in (0xFE0F, 0x200D):
            continue
        n += 1 if any(a <= c <= b for a, b in LIGHT) and c != 0x20E3 else 2
    return n


def base(sym):
    """AAPLB -> AAPL (Hotcoin's tokenized stocks end in B)."""
    return sym[:-1] if sym.endswith('B') and sym[:-1] in TRADFI else sym


def main():
    picks_path = sys.argv[1]
    out = os.path.dirname(os.path.abspath(picks_path))
    picks = json.load(open(picks_path))['items']
    if len(picks) != 5:
        sys.exit(f'need exactly 5 picks, got {len(picks)}')
    kinds = [p['kind'] for p in picks]
    if kinds.count('crypto') < 2 or kinds.count('tradfi') < 2:
        sys.exit(f'need at least 2 crypto and 2 tradfi picks, got {kinds}')

    tick = {x['symbol'][:-5].upper(): x for x in json.loads(live.get(live.TICKER))['ticker'] if x['symbol'].endswith('_usdt')}
    missing = [p['sym'] for p in picks if p['sym'].upper() not in tick]
    if missing:
        sys.exit(f'not listed on Hotcoin (no _usdt pair): {missing}. Pick something else.')

    cache = json.load(open(live.CACHE)) if os.path.exists(live.CACHE) else {}
    items = []
    for p in picks:
        sym = p['sym'].upper()
        t = tick[sym]
        last, ch = float(t['last']), float(t['change'])
        info = live.resolve(sym, last, cache)
        b = base(sym)
        name, handle = info.get('name') or sym, live.tag(info)
        if p['kind'] == 'tradfi' and b in TRADFI:
            name = TRADFI[b][0]
            handle = f'@{TRADFI[b][1]}' if TRADFI[b][1] else ''
        name = p.get('name') or name
        if 'handle' in p:
            handle = f'@{p["handle"]}' if p['handle'] else ''
        lf = live.logo_file(info)
        bg, glow = live.colours(lf)
        items.append({'sym': sym, 'name': name, 'kind': p['kind'], 'handle': handle, 'why': p['why'].strip(),
                      'last': last, 'ch': ch, 'vol': float(t['amount']),
                      'logo': os.path.splitext(os.path.basename(lf))[0] if lf else 'missing', 'bg': bg, 'glow': glow})
    json.dump(cache, open(live.CACHE, 'w'), indent=1, ensure_ascii=False)

    now = dt.datetime.now(TZ)
    data = {'date': now.strftime('%b %-d').upper(), 'window': f'Prices at {now.strftime("%b %-d %H:%M")} (UTC+8)', 'items': items}
    json.dump(data, open(os.path.join(out, 'data.json'), 'w'), indent=1, ensure_ascii=False)
    subprocess.run(['node', os.path.join(live.HERE, 'square.mjs'), 'sq-watch'], check=True,
                   env={**os.environ, 'DATA': os.path.join(out, 'data.json'), 'OUT_DIR': out}, stdout=subprocess.DEVNULL)

    def price(v):
        return f'${v:,.2f}' if v >= 1 else f'${v:.6g}'

    def pct(v):
        return f'▲{v:.2f}%' if v >= 0 else f'▼{abs(v):.2f}%'

    def caption(with_handles):
        lines = [f'👀 What to Watch Today on Hotcoin | {now.strftime("%b %-d")}', '']
        for i, g in enumerate(items, 1):
            head = ' '.join(x for x in (f'🟩 ${g["sym"]}', g['handle'] if with_handles else '', f'{price(g["last"])} {pct(g["ch"])}') if x)
            lines += [head, f'→ {g["why"]}', '']
        lines += [f'⏱ {data["window"]}, 24h change', 'Which one is on your list? 👇', '', '#Hotcoin #Crypto #TradFi']
        return '\n'.join(lines)

    def short_caption():
        """Fallback for X without Premium: must fit 280 weighted chars, the poster carries the reasons."""
        for handles, prices in ((True, True), (False, True), (True, False), (False, False)):
            lines = [f'👀 What to Watch Today on Hotcoin | {now.strftime("%b %-d")}', '']
            for g in items:
                lines.append(' '.join(x for x in (f'${g["sym"]}', g['handle'] if handles else '',
                                                  f'{price(g["last"])} {pct(g["ch"])}' if prices else '') if x))
            lines += ['', 'Which one is on your list? 👇', '#Hotcoin #Crypto #TradFi']
            t = '\n'.join(lines)
            if x_len(t) <= 280:
                return t
        return t

    caps = {'x': caption(True), 'x-short': short_caption(), 'facebook': caption(False), 'linkedin': caption(False)}
    for k, v in caps.items():
        if '—' in v:
            sys.exit('em dash in caption, rewrite the "why" lines')
        open(os.path.join(out, f'{k}.txt'), 'w').write(v)
    print(json.dumps({'dir': out, 'image': os.path.join(out, 'sq-watch.png'), 'items': items,
                      'x_len': x_len(caps['x']), 'x_short_len': x_len(caps['x-short'])}, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
