#!/usr/bin/env python3
"""IN COMMON Reel (owner, Nov 28): "What do X and Y have in common?" parallel-story paper collage, spec-driven.

Look: alternating panels of warm cream paper, Hotcoin green paper and graphite; real photos as cut-outs (rembg) and
white-border prints with tape; red/green date stickers, rubber stamps, giant Archivo numbers, a typed document, a hand
with a pen that circles or underlines; kinetic captions synced word by word to a voiceover; the shared twist in huge
type; a real price chart (dip then rise, % chips); end card (real Hotcoin symbol + one CTA line + Download pill).

Usage:
  python3 ig-news/incommon.py <spec.json> [--out <dir>] [--music <mixkit id>] [--no-vo] [--stills 0,3.5,12] [--frames-only] [--reuse-frames]
  python3 ig-news/incommon.py cutout <photo> <out.png> [--crop l,t,r,b] [--model isnet-general-use|u2net_human_seg]
  python3 ig-news/incommon.py words <fal_tts_result.json> <out_words.json>   # fal TTS char timestamps -> word list

Outputs (default ig-news/media/<spec folder name>/): reel.mp4 (CTA end card + spoken CTA), story.mp4 (same file),
tiktok.mp4 (no CTA line, no pill, no spoken CTA: symbol + @hotcoinex), story_x45.mp4 (4:5 1080x1350 crop of the no-CTA
cut), cover.jpg (= frame 0, the hook), cover_45.jpg, thumb_tiktok.jpg, contact.jpg (one frame per 0.5 s), safezones.jpg.
Audio: voiceover (optional) + Mixkit bed (tools/music.py) ducked under it + soft cues, two-pass loudnorm to -14 LUFS.

Voiceover (PLAYBOOK 7f): generate ONE TTS clip for all scene lines (fal "elevenlabs/tts/eleven-v4", timestamps: true;
~$0.04 per episode) and one short clip for the CTA line. Save the mp3s and the word timings ("words" command, or write
[[word, start, end], ...] by hand from the timestamps) next to the spec. The renderer shortens long pauses to `gap`,
speeds up by `tempo` (pitch kept), and starts each scene on its first spoken word. Without a VO (or with --no-vo) the
same words are timed at `wps` words per second and the Reel is captions-only.

Spec (incommon.json; paths relative to the spec file; logo names also resolve in ig-news/assets/logos/):
  question  "What do Steve Jobs and Winston Churchill have in common?"   (the hook; full sentence, frame 0 = cover)
  people    [{"name": "STEVE JOBS", "cut": "photos/jobs_cut.png"}, {"name": "WINSTON CHURCHILL", "cut": ...}] (hook order)
  vo        {"file": "vo/vo.mp3", "words": "vo/words.json", "cta_file": "vo/cta.mp3", "cta_words": "vo/cta_words.json",
             "gap": 0.2, "tempo": 1.08}    (omit "vo" for captions-only)
  cta       "Trade stocks and crypto on Hotcoin"
  chart     {"ticker": "AAPL", "start": "1991-01-01", "end": "2026-11-27", "label": "Apple stock", "logo": "AAPL.png",
             "log": true, "low_before": "1999-01-01", "source": "..."}  (real daily closes; dip = peak before the low)
  scenes    list, in order; each has "say" (the exact words of the VO for that scene; together they are the whole VO
            after the hook) and a "type":
    hook   (first scene, "say" = question) bg "ink"
    beat   bg "cream" | "green" | "ink"; any of:
           "cut":   {"src", "x", "y", "h", "flip", "bw"}         person cut-out (transparent PNG)
           "print": {"src", "x", "y", "w", "h", "rot", "grade": "bw"|"sepia"|"color", "tape": true}  photo print
           "tag":   {"text": "1985", "color": "red"|"green"|"ink", "at": "1985", "x", "y", "rot"}  date sticker
           "stamp": {"text": "PUSHED OUT", "at": "pushed", "x", "y", "rot", "color"}               rubber stamp
           "big":   {"value": 11, "label": "YEARS", "at": "eleven", "x", "y", "size"}            giant number (counts up)
           "doc":   {"title", "rows": [[k, v], ...], "mark": row index circled by the hand, "x", "y", "w", "rot", "at"}
           "pen":   {"at": "word", "shape": "circle"|"underline", "target": "big"|"doc"}       hand + pen stroke
           "label": {"text", "x", "y"}  small typed caption chip on the photo
           "second": {...same keys..., "at": "word"}  a second half that lands mid-scene (split layouts)
    twist  {"words": ["CALLED", "BACK"], "at": ["called", "back"]}  huge type; uses both people cut-outs
    chart  uses spec.chart; "dip_at": "82", "rise_at": "since"
    end    (last scene, no "say"; spoken CTA comes from vo.cta_file in the reel cut only)
  Captions: the scene's "say" words appear as they are spoken; wrap a word in {braces} for the green accent.
"""
import base64, io, json, math, pathlib, re, shutil, subprocess, sys, wave

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent
W, H, FPS, SR = 1080, 1920, 30, 44100
LUFS = -14
MIME = {'.ttf': 'font/ttf', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml'}
GREEN, INK, CREAM = (126, 194, 90), (14, 17, 16), (240, 228, 203)


# ------------------------------------------------------------------ images
def data_uri(p):
    p = pathlib.Path(p)
    return f'data:{MIME[p.suffix.lower()]};base64,' + base64.b64encode(p.read_bytes()).decode()


def img_uri(im, fmt='JPEG', q=88):
    buf = io.BytesIO()
    im.save(buf, fmt, quality=q) if fmt == 'JPEG' else im.save(buf, fmt, optimize=True)
    return f"data:image/{'jpeg' if fmt == 'JPEG' else 'png'};base64," + base64.b64encode(buf.getvalue()).decode()


def load_photo(p, grade='color', max_side=1400):
    from PIL import Image, ImageOps, ImageEnhance
    im = Image.open(p)
    alpha = im.getchannel('A') if im.mode in ('RGBA', 'LA') else None
    im = im.convert('RGB'); im.thumbnail((max_side, max_side), Image.LANCZOS)
    if alpha is not None: alpha = alpha.resize(im.size, Image.LANCZOS)
    if grade in ('bw', 'sepia'):
        g = ImageOps.autocontrast(im.convert('L'), cutoff=.5)
        g = ImageEnhance.Contrast(g).enhance(1.12)
        im = ImageOps.colorize(g, (18, 16, 14), (246, 240, 226)) if grade == 'bw' else ImageOps.colorize(g, (34, 24, 14), (244, 230, 200))
    if alpha is not None:
        im.putalpha(alpha); return img_uri(im, 'PNG')
    return img_uri(im)


def textures():
    """Paper textures made once per render: cream paper (fibres, blotches, vignette), green paper, graphite."""
    from PIL import Image, ImageFilter
    rs = np.random.default_rng(7)

    def noise(scale, blur):
        n = rs.standard_normal((H // scale + 2, W // scale + 2)).astype(np.float32)
        im = Image.fromarray(((n - n.min()) / (np.ptp(n) + 1e-6) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
        return np.asarray(im.filter(ImageFilter.GaussianBlur(blur)), np.float32) / 255 - .5

    fine = rs.standard_normal((H, W)).astype(np.float32)
    blot, mid = noise(60, 30), noise(8, 2)
    fib = np.zeros((H, W), np.float32)
    for _ in range(900):                          # short paper fibres
        x, y, a, l = rs.uniform(0, W), rs.uniform(0, H), rs.uniform(0, np.pi), rs.uniform(8, 40)
        for s in np.linspace(0, l, int(l)):
            xi, yi = int(x + np.cos(a) * s), int(y + np.sin(a) * s)
            if 0 <= xi < W and 0 <= yi < H: fib[yi, xi] += 1
    fib = np.asarray(Image.fromarray((np.clip(fib, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.6)), np.float32) / 255
    yy, xx = np.mgrid[0:H, 0:W]; r = np.sqrt(((xx - W / 2) / W) ** 2 + ((yy - H / 2) / H) ** 2)
    vig = np.clip(r * 1.25, 0, 1) ** 2.2

    def make(base, k_fine, k_blot, k_mid, k_fib, k_vig):
        b = np.array(base, np.float32)[None, None, :]
        lum = fine[..., None] * k_fine + blot[..., None] * k_blot + mid[..., None] * k_mid - fib[..., None] * k_fib - vig[..., None] * k_vig
        out = np.clip(b * (1 + lum), 0, 255).astype(np.uint8)
        return img_uri(Image.fromarray(out), q=86)

    sp = rs.random((520, 520)).astype(np.float32)
    blob = np.asarray(Image.fromarray((rs.random((52, 52)) * 255).astype(np.uint8)).resize((520, 520), Image.BICUBIC), np.float32) / 255
    alpha = np.clip(255 * (1 - (sp > .93) * .7 - (blob > .8) * .4), 0, 255).astype(np.uint8)
    spk = Image.new('RGBA', (520, 520), (0, 0, 0, 255)); spk.putalpha(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(.7)))
    return {'speckle': img_uri(spk, 'PNG'), 'cream': make(CREAM, .035, .16, .06, .10, .22), 'green': make(GREEN, .05, .14, .05, .06, .30),
            'ink': make((20, 23, 22), .25, .35, .12, .0, .55)}


def cutout(src, out, crop=None, model='isnet-general-use'):
    """Person cut-out with rembg (transparent PNG, trimmed to the subject)."""
    from PIL import Image
    from rembg import remove, new_session
    im = Image.open(src).convert('RGB')
    if crop:
        l, t, r, b = crop; im = im.crop((int(l * im.width), int(t * im.height), int(r * im.width), int(b * im.height)))
    res = remove(im, session=new_session(model), alpha_matting=False)
    # fill holes inside the subject (white shirts, pocket squares read as background)
    from PIL import ImageDraw
    a = res.getchannel('A'); m = a.point(lambda v: 255 if v > 24 else 0)
    pad = Image.new('L', (m.width + 2, m.height + 2), 0); pad.paste(m, (1, 1))
    ImageDraw.floodfill(pad, (0, 0), 128)
    holes = pad.crop((1, 1, m.width + 1, m.height + 1)).point(lambda v: 255 if v == 0 else 0)
    a.paste(255, mask=holes); res = im.convert('RGBA'); res.putalpha(a)
    bb = res.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    res.crop(bb).save(out); print('saved', out, res.crop(bb).size)


# ------------------------------------------------------------------ voiceover timing
def norm(w):
    return re.sub(r'[^a-z0-9]', '', w.lower())


def tts_words(result):
    """fal elevenlabs TTS result (timestamps: true) -> [[word, start, end], ...]."""
    out, cur, t0, t1 = [], '', None, None
    for chunk in result['timestamps']:
        for ch, a, b in zip(chunk['characters'], chunk['character_start_times_seconds'], chunk['character_end_times_seconds']):
            if ch.isspace():
                if cur: out.append([cur, round(t0, 3), round(t1, 3)]); cur = ''
            else:
                if not cur: t0 = a
                cur += ch; t1 = b
    if cur: out.append([cur, round(t0, 3), round(t1, 3)])
    return out


def timeline(spec, base, use_vo):
    """Word times on the output timeline + audio segments [(src_a, src_b, dst_t)] of the (re-timed) voiceover."""
    vo = spec.get('vo') if use_vo else None
    said = [(i, w) for i, sc in enumerate(spec['scenes']) for w in sc.get('say', '').split()]
    if vo:
        src = json.loads((base / vo['words']).read_text())
        if [norm(w) for _, w in said] != [norm(w[0]) for w in src]:
            a = ' '.join(w for _, w in said); b = ' '.join(w[0] for w in src)
            raise SystemExit(f'scene "say" texts do not match the VO words:\n  say: {a}\n  vo:  {b}')
        gap, tempo, lead = float(vo.get('gap', .2)), float(vo.get('tempo', 1.0)), .25
        # every silence longer than `gap` in the VO (between words and inside "1985," pauses) is shortened to `gap`
        r = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(base / vo['file']), '-af', f"silencedetect=n={vo.get('silence_db', -38)}dB:d={gap + .04}",
                            '-f', 'null', '-'], capture_output=True, text=True).stderr
        sil = [(float(x), float(y)) for x, y in zip(re.findall(r'silence_start: ([\d.]+)', r), re.findall(r'silence_end: ([\d.]+)', r))]
        src_end = src[-1][2] + .12
        keep, pos = [], max(0.0, src[0][1] - .03)
        for s0, s1 in sil:
            if s1 <= pos or s0 >= src_end: continue
            keep.append((pos, s0 + gap / 2)); pos = max(pos, s1 - gap / 2)
        keep.append((pos, src_end))
        keep = [(ka, kb) for ka, kb in keep if kb - ka > .05]
        first_word = {}
        for k, (si, _) in enumerate(said): first_word.setdefault(si, src[k][1])
        segs, t = [], lead
        for ka, kb in keep:
            extra = sum(spec['scenes'][si].get('pause', 0) for si, fw in first_word.items() if ka <= fw < kb and ka > 0 and abs(fw - ka) < .5)
            t += extra; segs.append((ka, kb, t)); t += (kb - ka) / tempo
        vo_end = t

        def tmap(x):
            for ka, kb, d in segs:
                if x < ka: return d
                if x <= kb: return d + (x - ka) / tempo
            return vo_end
        words = [{'w': said[k][1], 'scene': said[k][0], 't': tmap(a), 'e': tmap(b)} for k, (w, a, b) in enumerate(src)]
        cta = None
        if vo.get('cta_file'):
            cw = json.loads((base / vo['cta_words']).read_text()) if vo.get('cta_words') else []
            cta = {'file': str(base / vo['cta_file']), 'tempo': tempo, 'len': (cw[-1][2] + .1) / tempo if cw else 2.4, 'words': cw}
        return words, segs, vo_end, cta
    wps = float(spec.get('wps', 2.7)); words, t = [], .25
    for k, (si, w) in enumerate(said):
        if k and said[k - 1][0] != si: t += .3 + spec['scenes'][si].get('pause', 0)
        d = (1.6 if re.search(r'\d{3}', w) else 1) / wps
        words.append({'w': w, 'scene': si, 't': t, 'e': t + d * .9}); t += d
    return words, [], t, None


# ------------------------------------------------------------------ chart data
def chart_data(c, base):
    sys.path.insert(0, str(ROOT)); import whatif_b2
    if c.get('series'):
        ser = [[d, float(v)] for d, v in c['series']]
    else:
        ser = [[d, v] for d, v in whatif_b2.closes(c['ticker'], c['start'], c.get('end'))]
    lim = c.get('low_before', ser[-1][0])
    lo_i = min((i for i, r in enumerate(ser) if r[0] <= lim), key=lambda i: ser[i][1])
    pk_i = max(range(0, lo_i + 1), key=lambda i: ser[i][1])
    pk, lo, last = ser[pk_i], ser[lo_i], ser[-1]
    step = max(1, math.ceil(len(ser) / 420)); ds = ser[::step]
    for r in (pk, lo, last):
        if r not in ds: ds.append(r)
    ds.sort()
    mult = last[1] / lo[1]
    out = {'series': ds, 'peak': pk, 'low': lo, 'last': last, 'log': c.get('log', True),
           'dip': f"-{round((1 - lo[1] / pk[1]) * 100)}%", 'rise': c.get('rise_label') or (f"{mult:,.0f}x" if mult >= 20 else f"+{round((mult - 1) * 100)}%"),
           'label': c.get('label', c.get('ticker', '')), 'ticker': c.get('ticker', ''),
           'source': c.get('source') or f"{c.get('ticker')} daily closes (split-adjusted), Yahoo Finance. Price only. Not financial advice."}
    if c.get('logo'):
        p = base / c['logo'] if (base / c['logo']).exists() else ROOT / 'assets' / 'logos' / c['logo']
        out['logo'] = data_uri(p)
    print(f"chart: peak {pk[0]} {pk[1]:.4f}  low {lo[0]} {lo[1]:.4f} ({out['dip']})  last {last[0]} {last[1]:.2f} ({mult:,.1f}x from the low)")
    return out


# ------------------------------------------------------------------ resolve spec -> JS SPEC
def resolve(spec_path, use_vo=True):
    sp = json.loads(spec_path.read_text()); base = spec_path.parent
    words, segs, vo_end, cta = timeline(sp, base, use_vo)
    scenes = sp['scenes']
    first_t = {}
    for w in words: first_t.setdefault(w['scene'], w['t'])
    starts = [0.0]
    for i in range(1, len(scenes)):
        starts.append(max(starts[-1] + .5, first_t.get(i, vo_end + .25) - .12))
    end_i = len(scenes) - 1
    assert scenes[-1]['type'] == 'end', 'last scene must be the end card'
    t_end = max(vo_end + .35, starts[end_i])
    starts[end_i] = t_end
    cta_len = cta['len'] if cta else 2.2
    dur = t_end + .35 + cta_len + .8
    dur_nc = t_end + 1.7
    imgs, cache = {}, {}

    def im(p, grade='color', max_side=1400):
        key = (str(p), grade)
        if key not in cache:
            cache[key] = f'i{len(cache)}'; imgs[cache[key]] = load_photo(base / p, grade, max_side)
        return cache[key]

    out_scenes = []
    for i, sc in enumerate(scenes):
        s = json.loads(json.dumps(sc))
        s['t0'] = starts[i]; s['t1'] = starts[i + 1] if i + 1 < len(scenes) else dur
        s['words'] = [{'w': w['w'], 't': w['t'] - starts[i], 'e': w['e'] - starts[i]} for w in words if w['scene'] == i]
        for key in ('cut', 'print'):
            for holder in (s, s.get('second') or {}):
                if key in holder:
                    holder[key]['img'] = im(holder[key]['src'], holder[key].get('grade', 'bw' if holder[key].get('bw') else 'color'))
        out_scenes.append(s)
    people = [{'name': p['name'], 'img': im(p['cut'], 'color' if not p.get('bw') else 'bw'), 'x': p.get('x'), 'h': p.get('h')} for p in sp['people']]
    imgs.update(textures())
    imgs['grain'] = data_uri(ROOT / 'assets' / 'grain.png')
    imgs['symbol'] = data_uri(ROOT / 'assets' / 'symbol.svg')
    if sp.get('hand'): imgs['hand'] = data_uri(base / sp['hand'])
    js = {'scenes': out_scenes, 'people': people, 'img': imgs, 'question': sp['question'], 'cta': sp.get('cta', 'Trade stocks and crypto on Hotcoin'),
          'dur': dur, 'dur_nc': dur_nc, 'end_t': t_end, 'chart': chart_data(sp['chart'], base) if sp.get('chart') else None,
          'hand_tip': sp.get('hand_tip'), 'hand_w': sp.get('hand_w'),
          'fonts': {'arch': data_uri(ROOT / 'assets' / 'fonts' / 'Archivo.ttf'), 'man': data_uri(ROOT / 'assets' / 'fonts' / 'Manrope.ttf')}}
    return sp, js, segs, cta


# ------------------------------------------------------------------ render
def page(js):
    src = (ROOT / 'stories' / 'incommon.js').read_text()
    return f'<!doctype html><html><head><meta charset="utf-8"></head><body><script>window.SPEC={json.dumps(js)};</script><script>{src}</script></body></html>'


def open_page(p, js):
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    pg = b.new_page(viewport={'width': W, 'height': H})
    pg.set_content(page(js)); pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready')
    pg.wait_for_function('[...document.images].every(i => i.complete)'); pg.wait_for_timeout(300)
    return b, pg


def render_frames(js, frames, frames_nc):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b, pg = open_page(p, js)
        n, nnc, ne = int(round(js['dur'] * FPS)), int(round(js['dur_nc'] * FPS)), int(js['end_t'] * FPS)
        for i in range(n):
            pg.evaluate(f'draw({i / FPS}, "cta")'); pg.screenshot(path=str(frames / f'{i:04d}.jpg'), type='jpeg', quality=92)
        for i in range(nnc):
            if i < ne: (frames_nc / f'{i:04d}.jpg').symlink_to(frames / f'{i:04d}.jpg')
            else: pg.evaluate(f'draw({i / FPS}, "nocta")'); pg.screenshot(path=str(frames_nc / f'{i:04d}.jpg'), type='jpeg', quality=92)
        cues = pg.evaluate('window.CUES')
        b.close()
    return cues


def stills(js, times, out):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b, pg = open_page(p, js)
        for t in times:
            pg.evaluate(f'draw({t}, "cta")'); pg.screenshot(path=str(out / f'still_{t:05.2f}.jpg'), type='jpeg', quality=90)
        b.close()


def loudnorm(src, dst, target):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(src), '-af', f'loudnorm=I={target}:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
    af = (f"loudnorm=I={target}:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(src), '-af', af, '-ar', str(SR), '-ac', '2', str(dst)], check=True)


def audio(dur, cues, track, music_start, segs, vo_file, cta, cta_t, dst):
    sys.path.insert(0, str(ROOT)); import story
    tmp = dst.parent
    mix = np.zeros(int((dur + 1) * SR))
    for c in cues:
        if c['t'] >= dur: continue
        s = story.sfx(c['s'], c.get('pitch', 1)) * c.get('v', .35); i = int(c['t'] * SR); mix[i:i + len(s)] += s[:len(mix) - i]
    sfx = tmp / '_ic_sfx.wav'
    with wave.open(str(sfx), 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
    inputs = ['-ss', f'{music_start:.2f}', '-i', str(track), '-i', str(sfx)]
    fc = [f'[0:a]atrim=0:{dur:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.2,afade=t=out:st={dur - 1.0:.3f}:d=1.0,volume={0.2 if segs else 0.55}[m]']
    mixins = ['[m]', '[1:a]']
    if segs:
        inputs += ['-i', str(vo_file)]
        tempo = segs[0][3] if len(segs[0]) > 3 else None
        for k, (a, b, t, tp) in enumerate(segs):
            fc.append(f'[2:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,atempo={tp:.4f},afade=t=in:d=0.02,afade=t=out:st={(b - a) / tp - .03:.3f}:d=0.03,'
                      f'adelay={int(t * 1000)}|{int(t * 1000)}[v{k}]'); mixins.append(f'[v{k}]')
    if cta and cta_t is not None and cta_t < dur:
        inputs += ['-i', cta['file']]; ci = 3 if segs else 2
        fc.append(f'[{ci}:a]atempo={cta["tempo"]:.4f},adelay={int(cta_t * 1000)}|{int(cta_t * 1000)}[cta]'); mixins.append('[cta]')
    fc.append(''.join(mixins) + f'amix=inputs={len(mixins)}:duration=first:normalize=0[out]')
    pre = tmp / '_ic_pre.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(fc), '-map', '[out]', '-ar', str(SR), '-ac', '2',
                    '-t', f'{dur:.3f}', str(pre)], check=True)
    loudnorm(pre, dst, LUFS)
    sfx.unlink(); pre.unlink()


def encode(frames, wav, dur, dst, vf=None):
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(frames / '%04d.jpg'), '-i', str(wav)]
    if vf: cmd += ['-vf', vf]
    cmd += ['-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-maxrate', '6M', '-bufsize', '12M', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', f'{dur:.3f}', str(dst)]
    subprocess.run(cmd, check=True)


def sheets(frames, dur, out):
    from PIL import Image, ImageDraw
    picks = [frames / f'{min(int(dur * FPS) - 1, int(s * FPS / 2)):04d}.jpg' for s in range(int(dur * 2) + 1)]
    cw, ch, cols = 180, 320, 12
    sheet = Image.new('RGB', (cw * cols, ch * ((len(picks) + cols - 1) // cols)), (20, 20, 20))
    for k, f in enumerate(picks): sheet.paste(Image.open(f).resize((cw, ch)), ((k % cols) * cw, (k // cols) * ch))
    sheet.save(out / 'contact.jpg', quality=85)
    f0 = Image.open(frames / '0000.jpg')
    f0.save(out / 'cover.jpg', quality=92); f0.save(out / 'thumb_tiktok.jpg', quality=90)
    f0.crop((0, 180, W, 1530)).save(out / 'cover_45.jpg', quality=92)
    # safe zones over 4 frames (hook, a beat, the twist, the chart)
    sz = Image.new('RGB', (W * 4 // 3, H // 3), (0, 0, 0))
    for k, t in enumerate([0, dur * .25, dur * .55, dur * .8]):
        fr = Image.open(frames / f'{int(t * FPS):04d}.jpg').convert('RGBA')
        ov = Image.new('RGBA', fr.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
        for box in [(0, 0, W, 220), (0, H - 440, W, H), (W - 160, 700, W, H - 440)]: d.rectangle(box, fill=(255, 0, 60, 90))
        sz.paste(Image.alpha_composite(fr, ov).convert('RGB').resize((W // 3, H // 3)), (k * W // 3, 0))
    sz.save(out / 'safezones.jpg', quality=85)


def main(argv):
    if argv and argv[0] == 'cutout':
        crop = [float(x) for x in argv[argv.index('--crop') + 1].split(',')] if '--crop' in argv else None
        model = argv[argv.index('--model') + 1] if '--model' in argv else 'isnet-general-use'
        return cutout(argv[1], argv[2], crop, model)
    if argv and argv[0] == 'words':
        r = json.loads(pathlib.Path(argv[1]).read_text()); r = r.get('result', r)
        pathlib.Path(argv[2]).write_text(json.dumps(tts_words(r))); return print('saved', argv[2])
    spec_path = pathlib.Path(argv[0]).resolve()
    if spec_path.is_dir(): spec_path = spec_path / 'incommon.json'
    out = pathlib.Path(argv[argv.index('--out') + 1]).resolve() if '--out' in argv else ROOT / 'media' / spec_path.parent.name
    out.mkdir(parents=True, exist_ok=True)
    use_vo = '--no-vo' not in argv
    sp, js, segs, cta = resolve(spec_path, use_vo)
    tempo = float(sp.get('vo', {}).get('tempo', 1.0))
    segs = [(a, b, t, tempo) for a, b, t in segs]
    print(f"length: reel {js['dur']:.1f}s, tiktok/x {js['dur_nc']:.1f}s, scenes: " + ', '.join(f"{s['type']}@{s['t0']:.1f}" for s in js['scenes']))
    if js['dur'] > 35.5: print(f"WARNING: reel is {js['dur']:.1f}s (> 35 s). Shorten the lines.")
    if '--stills' in argv:
        stills(js, [float(x) for x in argv[argv.index('--stills') + 1].split(',')], out); return
    work = out / '_ic_frames'; frames, frames_nc = work / 'cta', work / 'nocta'
    if '--reuse-frames' in argv and frames.exists():        # audio / encode only (frames from the last run)
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            b, pg = open_page(p, js); cues = pg.evaluate('window.CUES'); b.close()
    else:
        shutil.rmtree(work, ignore_errors=True); frames.mkdir(parents=True); frames_nc.mkdir()
        cues = render_frames(js, frames, frames_nc)
    sheets(frames, js['dur'], out)
    if '--frames-only' in argv: return
    m = sp.get('music', {})
    mid = argv[argv.index('--music') + 1] if '--music' in argv else m.get('id') or subprocess.run(
        [sys.executable, str(ROOT / 'tools' / 'music.py'), 'pick'], capture_output=True, text=True).stdout.strip()
    track = subprocess.run([sys.executable, str(ROOT / 'tools' / 'music.py'), 'get', mid], capture_output=True, text=True, check=True).stdout.split('\n')
    vo_file = spec_path.parent / sp['vo']['file'] if (use_vo and sp.get('vo')) else None
    wav, wav_nc = out / '_ic.wav', out / '_ic_nc.wav'
    audio(js['dur'], cues, track[0], float(m.get('start', 0)), segs, vo_file, cta if use_vo else None, js['end_t'] + .35, wav)
    audio(js['dur_nc'], [c for c in cues if c['t'] < js['dur_nc']], track[0], float(m.get('start', 0)), segs, vo_file, None, None, wav_nc)
    encode(frames, wav, js['dur'], out / 'reel.mp4')
    shutil.copy(out / 'reel.mp4', out / 'story.mp4')
    encode(frames_nc, wav_nc, js['dur_nc'], out / 'tiktok.mp4')
    encode(frames_nc, wav_nc, js['dur_nc'], out / 'story_x45.mp4', vf='crop=1080:1350:0:180')
    wav.unlink(); wav_nc.unlink(); shutil.rmtree(work)
    print(f"{out}/reel.mp4 {js['dur']:.1f}s (story.mp4 = same), tiktok.mp4 + story_x45.mp4 {js['dur_nc']:.1f}s (no CTA)")
    print(track[1])


if __name__ == '__main__':
    main(sys.argv[1:])
