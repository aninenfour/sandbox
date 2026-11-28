#!/usr/bin/env python3
"""WHAT IF "B2 Photo depth" Reel (owner pick, Nov 28): dark premium motion template, spec-driven.

Usage:
  python3 ig-news/whatif_b2.py ig-news/posts/<id>/whatif.json [--out <dir>] [--music <mixkit id>] [--frames-only]
  python3 ig-news/story.py ig-news/posts/<id>                    # same thing when whatif.json has "look": "b2"
  python3 ig-news/whatif_b2.py closes BTC 2013-10-01 [2026-11-25] # print daily closes (Bitstamp for coins, Yahoo for stocks)

Outputs (default ig-news/media/<post id>/): reel.mp4 (9:16, CTA end card) + story.mp4 (same file, IG Story, <= 59 s),
tiktok.mp4 (9:16, ends on the Hotcoin symbol, no CTA, PLAYBOOK 7c), story_x45.mp4 (4:5 1080x1350 for X, no CTA),
cover.jpg (= frame 0, the hook) + cover_45.jpg, thumb_tiktok.jpg, contact.jpg (one frame per 0.5 s). Audio: Mixkit bed
(tools/music.py) + soft cues, loudness-normalised to -14 LUFS.

Spec (whatif.json, "look": "b2"); paths are relative to the spec file, logo names resolve in ig-news/assets/logos/:
  person "Bezos", pronoun "he", verb "spent", amount 250000000, amount_label "$250M", object "on a newspaper"
    -> hook ["Bezos spent $250M", "on a newspaper"]  (or give "hook": [lines]; full sentences, never cut phrases)
  question (optional) ["What if he just bought", "{Bitcoin} instead?"]   {word} = brand green
  object_logo "wapo_wp.png"   real logo only (round badge after the hook); omit if there is no real logo
  asset {"name": "Bitcoin", "ticker": "BTC", "logo": "BTC.svg"}   (+ "logo_round": true for square stock logos)
  date "2013-10-01" (purchase); series [[date, value of the money in $]] or series_file + series_col + series_scale
    (e.g. an older whatif.json in $M: series_scale 1e6) or "fetch": true (daily closes via closes(), amount / first close)
  result (optional) {"value": "$115B", "mult": "461x", "chip_text": "more than he paid", "neg": false}
  source (optional, small line under the chart), log (optional, log price scale), cta (optional 2 lines)
  bg [scene1 story photo, scene2 trading screens, scene3 green bokeh]: path (graded here: blur + black/green duotone)
    or {"src": path, "graded": true} for an already graded 1080x1920 file; optional "fx" (0..1 crop x), "blur"
  cutout "bezos_cut.png" (transparent PNG of the person) + optional cutout_box {"x": -30, "y": 330, "w": 1110}
"""
import base64, json, math, pathlib, shutil, subprocess, sys, urllib.request, wave
from datetime import datetime, timezone

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent
W, H, FPS, SR = 1080, 1920, 30, 44100
LUFS = -14
FONT = '/usr/share/fonts/opentype/inter/'
MIME = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml'}
COINS = {'BTC', 'ETH', 'XRP', 'SOL', 'LTC', 'BCH', 'LINK', 'AVAX', 'DOGE', 'ADA', 'DOT'}


# ------------------------------------------------------------------ prices
def _json(url):
    return json.loads(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read())


def closes(ticker, start, end=None):
    """Daily closes [[YYYY-MM-DD, close]] from start to end (inclusive). Coins: Bitstamp (since 2011);
    stocks/ETFs: Yahoo chart API (split-adjusted close, price only). Cross-check first and last close with a 2nd source."""
    t0 = int(datetime.fromisoformat(start).replace(tzinfo=timezone.utc).timestamp())
    t1 = int(datetime.fromisoformat(end).replace(tzinfo=timezone.utc).timestamp()) if end else int(datetime.now(timezone.utc).timestamp())
    out = {}
    if ticker.upper() in COINS:
        s = t0
        while s <= t1:
            rows = _json(f'https://www.bitstamp.net/api/v2/ohlc/{ticker.lower()}usd/?step=86400&limit=1000&start={s}')['data']['ohlc']
            if not rows: break
            for r in rows:
                ts = int(r['timestamp'])
                if ts <= t1: out[datetime.fromtimestamp(ts, timezone.utc).strftime('%Y-%m-%d')] = float(r['close'])
            nxt = int(rows[-1]['timestamp']) + 86400
            if nxt <= s: break
            s = nxt
    else:
        r = _json(f'https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?period1={t0}&period2={t1 + 86400}&interval=1d')['chart']['result'][0]
        for ts, c in zip(r['timestamp'], r['indicators']['quote'][0]['close']):
            if c is not None: out[datetime.fromtimestamp(ts, timezone.utc).strftime('%Y-%m-%d')] = float(c)
    return sorted(out.items())


# ------------------------------------------------------------------ helpers
def money(v):
    a = abs(v)
    f = lambda x, u: '$' + (f'{round(x)}' if x >= 100 else f'{x:.1f}'.rstrip('0').rstrip('.') if x >= 10 else f'{x:.2f}'.rstrip('0').rstrip('.')) + u
    if a >= 1e12: return f(v / 1e12, 'T')
    if a >= 1e9: return f(v / 1e9, 'B')
    if a >= 1e6: return f(v / 1e6, 'M')
    return f'${v:,.2f}' if a < 100 else f'${round(v):,}'


def mon(d):
    return datetime.fromisoformat(d).strftime('%b %Y')


def text_w(s, px, weight='Bold', tracking=0.0):
    from PIL import ImageFont
    f = ImageFont.truetype(FONT + f'InterDisplay-{weight}.otf', px)
    return f.getlength(s) + tracking * px * len(s)


def fit(lines, max_px, min_px, width, weight='Bold', tracking=-.035, extra_last=0):
    for px in range(max_px, min_px - 1, -2):
        if all(text_w(l.replace('{', '').replace('}', ''), px, weight, tracking) + (extra_last if i == len(lines) - 1 else 0) <= width
               for i, l in enumerate(lines)):
            return px
    raise SystemExit(f'text too long for the B2 layout even at {min_px}px: {lines}. Shorten the sentence (never cut a phrase).')


def data_uri(p):
    p = pathlib.Path(p)
    return f'data:{MIME[p.suffix.lower()]};base64,' + base64.b64encode(p.read_bytes()).decode()


def grade(src, fx=.5, blur=14):
    """Story photo -> blurred, black/green duotone 1080x1920 background (same grade as the B2 mock-ups)."""
    from PIL import Image, ImageFilter, ImageOps
    import io
    im = Image.open(src).convert('RGB')
    s = max(W / im.width, H / im.height) * 1.08
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = int((im.width - W) * fx); y = (im.height - H) // 2
    im = im.crop((x, y, x + W, y + H)).filter(ImageFilter.GaussianBlur(blur))
    g = ImageOps.autocontrast(im.convert('L'), cutoff=1)
    im = ImageOps.colorize(g, black=(2, 4, 3), mid=(22, 46, 24), white=(150, 214, 118), midpoint=150)
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=88)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()


def resolve(spec_path):
    sp = json.loads(spec_path.read_text()); base = spec_path.parent
    P = lambda p: (base / p) if (base / p).exists() else (ROOT / 'assets' / 'logos' / p)
    a = sp['asset']; pron = sp.get('pronoun', 'he')
    amount = float(sp['amount']); amount_label = sp.get('amount_label') or money(amount)
    # series of the money's value in $
    if sp.get('series'):
        series = [[d, float(v)] for d, v, *_ in sp['series']]
    elif sp.get('series_file'):
        src = json.loads((base / sp['series_file']).read_text())['series']; col = sp.get('series_col', 1); k = float(sp.get('series_scale', 1))
        series = [[r[0], float(r[col]) * k] for r in src]
    elif sp.get('fetch'):
        c = closes(a['ticker'], sp['date'], sp.get('end')); q = amount / c[0][1]
        series = [[d, q * v] for d, v in c]
    else:
        raise SystemExit('spec needs series, series_file or fetch')
    step = max(1, math.ceil(len(series) / 380)); ds = series[::step]
    if ds[-1] != series[-1]: ds.append(series[-1])
    raw = series[-1][1]; r = sp.get('result', {})
    mult = raw / amount
    res = {'raw': raw, 'value': r.get('value') or money(raw), 'neg': r.get('neg', raw < amount),
           'mult': r.get('mult') or (f'{mult:.0f}x' if mult >= 10 else f'{mult:.1f}x'),
           'chip_text': r.get('chip_text') or (f'more than {pron} paid' if raw >= amount else f'less than {pron} paid')}
    hook = sp.get('hook') or [f"{sp['person']} {sp.get('verb', 'spent')} {amount_label}", sp['object']]
    question = sp.get('question') or [f'What if {pron} just bought', '{' + a['name'] + '} instead?']
    d0, d1 = series[0][0], series[-1][0]
    logo = bool(sp.get('object_logo'))
    out = {
        'hook': hook, 'question': question, 'amount': amount, 'asset': a, 'result': res, 'series': ds, 'log': sp.get('log', False),
        'since_label': sp.get('since_label') or f'bought in {mon(d0)}',
        'worth_label': sp.get('worth_label') or f"The same {amount_label} in {a['name']} is worth",
        'date0': mon(d0), 'date1': mon(d1),
        'source': sp.get('source') or f"{a.get('ticker', a['name'])} daily closes, {datetime.fromisoformat(d0).strftime('%b %-d %Y')} to "
                                       f"{datetime.fromisoformat(d1).strftime('%b %-d %Y')}. Price only. Not financial advice.",
        'cta': sp.get('cta') or [f"Trade {a['name']}", 'on Hotcoin'],
        'cutout': sp.get('cutout_box', {}),
    }
    out['hook_px'] = fit(hook, 96, 70, 860, 'Bold', -.035, extra_last=118 if logo else 0)
    out['question_px'] = min(fit(question, 66, 52, 860, 'SemiBold', -.02), out['hook_px'] - 22)
    counts = [money(amount * (raw / amount) ** (k / 80)) for k in range(81)] if raw > 0 else []
    out['num_px'] = fit([max(counts + [res['value']], key=lambda x: text_w(x, 100, 'ExtraBold', -.05))], 250, 120, 760, 'ExtraBold', -.05)  # widest count-up string fits
    out['cta_px'] = fit(out['cta'], 96, 64, 820, 'Bold', -.035)
    out['gap'] = 34
    block = len(hook) * out['hook_px'] * 1.04 + out['gap'] + len(question) * out['question_px'] * 1.12
    out['hook_top'] = round(min(1040, 1450 - block))
    if out['worth_label'] and text_w(out['worth_label'], 40, 'SemiBold') > 770:
        raise SystemExit(f"worth_label too long for the card: {out['worth_label']!r}")
    bgs = sp['bg']
    img = {'cutout': data_uri(base / sp['cutout']), 'asset_logo': data_uri(P(a['logo'])),
           'grain': data_uri(ROOT / 'assets' / 'grain.png'), 'symbol': data_uri(ROOT / 'assets' / 'symbol.svg'),
           'wordmark': data_uri(ROOT / 'assets' / 'logo-official-white.png')}
    if logo: img['object_logo'] = data_uri(P(sp['object_logo']))
    for n, b in enumerate(bgs, 1):
        b = b if isinstance(b, dict) else {'src': b}
        img[f'bg{n}'] = data_uri(base / b['src']) if b.get('graded') else grade(base / b['src'], b.get('fx', .5), b.get('blur', 14))
    out['img'] = img
    return sp, out


# ------------------------------------------------------------------ render
def render_frames(spec, frames, frames_nc):
    from playwright.sync_api import sync_playwright
    js = (ROOT / 'stories' / 'whatif_b2.js').read_text()
    html = f'<!doctype html><html><head><meta charset="utf-8"></head><body><script>window.SPEC={json.dumps(spec)};</script><script>{js}</script></body></html>'
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = b.new_page(viewport={'width': W, 'height': H})
        pg.set_content(html); pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready')
        pg.wait_for_function('[...document.images].every(i => i.complete)'); pg.wait_for_timeout(300)
        dur, dnc, end_t = pg.evaluate('[window.DURATION, window.DURATION_NOCTA, window.END_T]')
        cues = pg.evaluate('window.CUES')
        n, nnc, ne = int(round(dur * FPS)), int(round(dnc * FPS)), int(end_t * FPS)
        for i in range(n):
            pg.evaluate(f'draw({i / FPS}, "cta")'); pg.screenshot(path=str(frames / f'{i:04d}.jpg'), type='jpeg', quality=92)
        for i in range(nnc):
            if i < ne: (frames_nc / f'{i:04d}.jpg').symlink_to(frames / f'{i:04d}.jpg')
            else: pg.evaluate(f'draw({i / FPS}, "nocta")'); pg.screenshot(path=str(frames_nc / f'{i:04d}.jpg'), type='jpeg', quality=92)
        b.close()
    return n / FPS, nnc / FPS, cues


def audio(dur, cues, track, dst):
    sys.path.insert(0, str(ROOT)); import story
    mix = np.zeros(int((dur + 1) * SR))
    for c in cues:
        s = story.sfx(c['s'], c.get('pitch', 1)) * .5; i = int(c['t'] * SR); mix[i:i + len(s)] += s[:len(mix) - i]
    sfx = dst.with_name('b2_sfx.wav')
    with wave.open(str(sfx), 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
    fc = (f'[0:a]atrim=0:{dur:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.25,afade=t=out:st={dur - 1.2:.3f}:d=1.2,volume=0.6[m];'
          f'[1:a]volume=1.0[s];[m][s]amix=inputs=2:duration=first:normalize=0')
    pre = dst.with_name('b2_pre.wav')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(track), '-i', str(sfx), '-filter_complex', fc, '-ar', str(SR), '-ac', '2', str(pre)], check=True)
    # two-pass loudnorm to -14 LUFS integrated, -1.5 dBTP
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(pre), '-af', f'loudnorm=I={LUFS}:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
    af = (f"loudnorm=I={LUFS}:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(pre), '-af', af, '-ar', str(SR), str(dst)], check=True)
    sfx.unlink(); pre.unlink()


def encode(frames, wav, dur, dst, vf=None):
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(frames / '%04d.jpg'), '-i', str(wav)]
    if vf: cmd += ['-vf', vf]
    cmd += ['-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-maxrate', '6M', '-bufsize', '12M', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', f'{dur:.3f}', str(dst)]
    subprocess.run(cmd, check=True)


def main(argv):
    if argv and argv[0] == 'closes':
        for d, c in closes(argv[1], argv[2], argv[3] if len(argv) > 3 else None): print(d, c)
        return
    spec_path = pathlib.Path(argv[0]).resolve()
    if spec_path.is_dir(): spec_path = spec_path / 'whatif.json'
    out = pathlib.Path(argv[argv.index('--out') + 1]).resolve() if '--out' in argv else ROOT / 'media' / spec_path.parent.name
    out.mkdir(parents=True, exist_ok=True)
    sp, spec = resolve(spec_path)
    work = out / '_b2_frames'; shutil.rmtree(work, ignore_errors=True)
    frames, frames_nc = work / 'cta', work / 'nocta'; frames.mkdir(parents=True); frames_nc.mkdir()
    dur, dnc, cues = render_frames(spec, frames, frames_nc)
    from PIL import Image
    # contact sheet: one frame per 0.5 s (CTA version)
    picks = [frames / f'{min(int(dur * FPS) - 1, int(s * FPS / 2)):04d}.jpg' for s in range(int(dur * 2) + 1)]
    cw, ch, cols = 180, 320, 12
    sheet = Image.new('RGB', (cw * cols, ch * ((len(picks) + cols - 1) // cols)), (20, 20, 20))
    for k, f in enumerate(picks): sheet.paste(Image.open(f).resize((cw, ch)), ((k % cols) * cw, (k // cols) * ch))
    sheet.save(out / 'contact.jpg', quality=85)
    Image.open(frames / '0000.jpg').save(out / 'cover.jpg', quality=92)
    Image.open(frames / '0000.jpg').save(out / 'thumb_tiktok.jpg', quality=90)
    Image.open(frames / '0000.jpg').crop((0, 180, W, 1530)).save(out / 'cover_45.jpg', quality=92)
    a = np.asarray(Image.open(frames / '0000.jpg').convert('L').resize((108, 192)), float)
    f0 = float((np.abs(a - np.median(a)) > 40).mean())
    # dark B2 covers score lower than the old light ones (black lower third by design, safe zone): Bezos test = 21%
    print(f'thumbnail check: frame 0 fill {f0:.0%}' + ('' if f0 >= .15 else '  WARNING: frame 0 is mostly empty, check the cut-out and the bg photo'))
    if '--frames-only' in argv: return
    mid = argv[argv.index('--music') + 1] if '--music' in argv else subprocess.run(
        [sys.executable, str(ROOT / 'tools' / 'music.py'), 'pick'], capture_output=True, text=True).stdout.strip()
    track = subprocess.run([sys.executable, str(ROOT / 'tools' / 'music.py'), 'get', mid], capture_output=True, text=True, check=True).stdout.split('\n')
    wav, wav_nc = out / '_b2.wav', out / '_b2_nc.wav'
    audio(dur, cues, track[0], wav)
    audio(dnc, [c for c in cues if c['t'] < dnc], track[0], wav_nc)
    encode(frames, wav, dur, out / 'reel.mp4')
    assert dur <= 59, 'IG Story limit'
    shutil.copy(out / 'reel.mp4', out / 'story.mp4')            # <= 59 s: the IG Story uses the same file
    encode(frames_nc, wav_nc, dnc, out / 'tiktok.mp4')
    encode(frames_nc, wav_nc, dnc, out / 'story_x45.mp4', vf='crop=1080:1350:0:180')
    wav.unlink(); wav_nc.unlink(); shutil.rmtree(work)
    print(f'{out}/reel.mp4 {dur:.1f}s (story.mp4 = same), tiktok.mp4 + story_x45.mp4 {dnc:.1f}s (no CTA)')
    print(track[1])


if __name__ == '__main__':
    main(sys.argv[1:])
