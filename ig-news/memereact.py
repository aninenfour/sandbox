"""MEME REACT Reel (owner, Nov 16): one static, very clear news graphic + a keyed-out green-screen meme reaction
bottom-left + mood music. Loops, 12-20 s, 1080x1920 30 fps. Frame 0 = the cover (graphic + meme face).

Usage:
  python3 ig-news/memereact.py SPEC.json|GRAPHIC.html --meme CLIP --audio TRACK --out ig-news/media/<id> [overrides]

SPEC.json (graphic + render settings; photo paths are relative to the spec file):
  {"title": "Bitcoin vs its all-time high",           small title on top (like "Last 5 Year Performance")
   "stats": [{"label": "RECORD", "sub": "Oct 6, 2025", "value": "$126K", "tone": "pos"},
             {"label": "NOW", "sub": "Nov 16, 2026", "value": "$64.5K", "tone": "neg"}],   1-3 big numbers in a row
   "arrow": true,                                       arrow between 2 stats
   "side": {"label": "Bitcoin", "photo": "coin.jpg", "photo_pos": "50% 50%", "photo_zoom": 1.0,
            "value": "-49%", "sub": "from the top", "tone": "neg"},   right column next to the meme (optional)
   "handle": "@hotcoinex",
   "meme": {"start": 5.8, "end": 13.1, "loops": 2, "crop": [x, y, w, h], "scale": 1.15, "x": 0,
            "key": "auto"|"0x0EFF00", "similarity": 0.28, "blend": 0.06, "feather_right": 70, "feather_top": 0,
            "volume": 0},                                meme's own audio level (0 = muted, 1 = as is)
   "audio": {"start": 0.6, "fade_in": 0.0, "fade_out": 1.2, "lufs": -14}}
A raw .html graphic (1080x1920 page) also works; then meme/audio settings come from the CLI flags only.

Writes OUT/memereact.mp4, OUT/cover.jpg (= frame 0), OUT/thumb_tiktok.jpg (same), OUT/graphic.png, OUT/contact.jpg.
Safe zone (TikTok + IG Reels UI): keep key content out of the top 220 px, bottom 440 px and right 160 px from y=700 down.
OUT/safezones.jpg shows the cover with those zones in red; check it.
Background carries the Hotcoin symbol as a faint watermark (wm_opacity, default 0.06). Handle text: "Hotcoin".
"""
import argparse, base64, html as H, json, pathlib, re, subprocess, sys, tempfile

ROOT = pathlib.Path(__file__).resolve().parent
W, HGT, FPS = 1080, 1920, 30
GREEN, RED, INK = '#2E9E3F', '#E5322D', '#14181C'


def _b64(p, mime):
    return f'data:{mime};base64,' + base64.b64encode(pathlib.Path(p).read_bytes()).decode()


def _img_mime(p):
    s = str(p).lower()
    return 'image/png' if s.endswith('.png') else 'image/svg+xml' if s.endswith('.svg') else 'image/jpeg'


def build_html(spec, base):
    font = lambda n: _b64(ROOT / 'assets' / 'fonts' / n, 'font/ttf')
    tone = lambda t: RED if t == 'neg' else GREEN if t == 'pos' else INK
    stats = spec.get('stats', [])
    cells = []
    for i, s in enumerate(stats):
        if i and spec.get('arrow') and len(stats) == 2:
            cells.append('<div class="arrow">&#8594;</div>')
        icon = f'<div class="sicon" style="background-image:url({_b64(base / s["icon"], _img_mime(s["icon"]))})"></div>' if s.get('icon') else ''
        cells.append(f'<div class="stat"><div class="slabel">{H.escape(s.get("label", ""))}</div>'
                     f'<div class="ssub">{H.escape(s.get("sub", ""))}</div>{icon}'
                     f'<div class="sval" style="color:{tone(s.get("tone"))}">{H.escape(s["value"])}</div>'
                     + (f'<div class="slabel2">{H.escape(s["name"])}</div>' if s.get('name') else '') + '</div>')
    side = spec.get('side')
    side_html = ''
    if side:
        ph = ''
        if side.get('icon'):
            ph = (f'<div class="sicon2" style="background-image:url({_b64(base / side["icon"], _img_mime(side["icon"]))})"></div>')
        elif side.get('photo'):
            ph = (f'<div class="sphoto" style="background-image:url({_b64(base / side["photo"], _img_mime(side["photo"]))});'
                  f'background-position:{side.get("photo_pos", "50% 50%")};background-size:{int(100 * side.get("photo_zoom", 1.0))}%"></div>')
        side_html = (f'<div class="side"><div class="sdlabel">{H.escape(side.get("label", ""))}</div>{ph}'
                     f'<div class="sdval" style="color:{tone(side.get("tone"))}">{H.escape(side.get("value", ""))}</div>'
                     f'<div class="sdsub">{H.escape(side.get("sub", ""))}</div></div>')
    pu = spec.get('punch')
    punch_html = (f'<div class="punch" style="top:{pu.get("top", 1060)}px;left:{pu.get("left", 560)}px;width:{pu.get("width", 360)}px">{H.escape(pu["text"])}</div>' if pu else '')
    logo = _b64(ROOT / 'assets' / 'symbol-dark.svg', 'image/svg+xml')
    handle = H.escape(spec.get('handle', ''))
    # title: *word* = red highlight, _word_ = green highlight
    title_html = re.sub(r'\*(.+?)\*', r'<span class="hlr">\1</span>', H.escape(spec.get('title', '')))
    title_html = re.sub(r'_(.+?)_', r'<span class="hlg">\1</span>', title_html).replace('\n', '<br>')
    wm = _b64(ROOT / 'assets' / 'symbol-dark.svg', 'image/svg+xml')
    n = max(1, len(stats))
    val_px = spec.get('value_px') or {1: 180, 2: 132, 3: 100}.get(n, 100)
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:'Archivo';src:url({font('Archivo.ttf')}) format('truetype');font-weight:100 900;font-stretch:62% 125%}}
@font-face{{font-family:'Manrope';src:url({font('Manrope.ttf')}) format('truetype');font-weight:200 800}}
html,body{{margin:0;width:{W}px;height:{HGT}px;overflow:hidden}}
body{{background:radial-gradient(ellipse 85% 60% at 50% 42%,#FFFFFF 0%,#EDEEF0 55%,#C9CBCF 100%);font-family:'Manrope',sans-serif;color:{INK};position:relative}}
.brand{{position:absolute;top:{spec.get('brand_top', 250)}px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:12px;font:700 30px 'Manrope';color:#5B6168}}
.brand img{{width:34px;height:34px}}
.title{{position:absolute;top:{spec.get('title_top', 250)}px;left:50px;right:{spec.get('title_right', 50)}px;text-align:center;font-family:'Archivo';font-weight:900;font-stretch:80%;font-size:{spec.get('title_px', 96)}px;line-height:1.02;letter-spacing:-1px;text-transform:uppercase}}
.hlr{{color:#fff;background:{RED};padding:0 14px;border-radius:12px;box-decoration-break:clone;-webkit-box-decoration-break:clone}}
.hlg{{color:#fff;background:{GREEN};padding:0 14px;border-radius:12px;box-decoration-break:clone;-webkit-box-decoration-break:clone}}
.row{{position:absolute;top:{spec.get("row_top", 470 if len(spec.get("title", "")) < 34 else 540)}px;left:40px;right:160px;display:flex;justify-content:center;align-items:flex-end;gap:{spec.get("row_gap", 64)}px}}
.stat{{display:flex;flex-direction:column;align-items:center;flex:1 1 0;min-width:0}}
.slabel{{font:800 40px 'Manrope';letter-spacing:2px;color:#3A4047}}
.ssub{{font:600 34px 'Manrope';color:#6A7078;margin-top:6px}}
.sicon{{width:{spec.get('icon_px', 150)}px;height:{spec.get('icon_px', 150)}px;border-radius:50%;background-size:cover;background-position:center;margin-top:18px;box-shadow:0 8px 24px rgba(0,0,0,.18)}}
.sval{{font-family:'Archivo';font-weight:900;font-stretch:88%;font-size:{val_px}px;line-height:1;margin-top:18px;letter-spacing:-2px;white-space:nowrap}}
.arrow{{font:800 90px 'Manrope';color:#9AA0A6;padding-bottom:22px}}
.side{{position:absolute;top:{spec.get("side_top", 720)}px;left:{spec.get("side_left", 600)}px;width:{spec.get("side_width", 360)}px;display:flex;flex-direction:column;align-items:center}}
.sicon2{{width:{spec.get("side_photo", 260)}px;height:{spec.get("side_photo", 260)}px;margin-top:16px;background:center/contain no-repeat;filter:drop-shadow(0 10px 22px rgba(0,0,0,.18))}}
.wm{{position:absolute;left:50%;top:{spec.get("wm_top", 46)}%;width:{spec.get("wm_size", 760)}px;height:{spec.get("wm_size", 760)}px;transform:translate(-50%,-50%);background:url({wm}) center/contain no-repeat;opacity:{spec.get("wm_opacity", 0.06)}}}
.punch{{position:absolute;background:#fff;border-radius:34px;padding:26px 30px;font:800 46px/1.15 'Manrope';color:{INK};box-shadow:0 12px 30px rgba(0,0,0,.18);text-align:center}}
.punch:after{{content:'';position:absolute;left:-26px;bottom:40px;border:16px solid transparent;border-right:26px solid #fff;border-left:0}}
.slabel2{{font:700 38px 'Manrope';color:#2A3036;margin-top:14px}}
.sdlabel{{font:700 46px 'Manrope';color:#2A3036}}
.sphoto{{width:{spec.get("side_photo", 300)}px;height:{spec.get("side_photo", 300)}px;border-radius:50%;margin-top:16px;background-repeat:no-repeat;box-shadow:0 10px 30px rgba(0,0,0,.22);border:6px solid #fff}}
.sdval{{font-family:'Archivo';font-weight:900;font-size:{spec.get("side_value_px", 150)}px;line-height:1;margin-top:20px;letter-spacing:-3px}}
.sdsub{{font:700 38px 'Manrope';color:#4A5057;margin-top:8px}}
</style></head><body>
<div class="wm"></div>
{f'<div class="brand"><img src="{logo}">{handle}</div>' if handle else ''}
<div class="title">{title_html}</div>
<div class="row">{"".join(cells)}</div>
{side_html}
{punch_html}
</body></html>'''


def render_png(html, out_png):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = b.new_page(viewport={'width': W, 'height': HGT})
        pg.set_content(html); pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(400)
        # review Nov 19: big stat values must fit their own column (equal columns, real gap), all at one size,
        # so "$115.8B" and "-35%" never read as one number
        fit = pg.evaluate("""() => { const v = [...document.querySelectorAll('.row .sval')]; if (!v.length) return null;
            let px = parseFloat(getComputedStyle(v[0]).fontSize);
            const over = () => v.some(e => e.scrollWidth > e.parentElement.clientWidth);
            while (over() && px > 64) { px -= 2; v.forEach(e => e.style.fontSize = px + 'px'); }
            return px; }""")
        if fit is not None and fit <= 64:
            print('WARNING stat values still wider than their column at 64 px: shorten them')
        pg.screenshot(path=str(out_png), type='png')
        b.close()


def run(cmd, binary=False):
    r = subprocess.run(cmd, capture_output=True, text=not binary)
    if r.returncode:
        err = r.stderr if not binary else r.stderr.decode(errors='replace')
        sys.exit(f'ffmpeg failed: {" ".join(cmd)}\n{err[-2000:]}')
    return r


def sample_key(clip, t):
    """Most common bright-green pixel colour of a frame (the screen colour)."""
    raw = run(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', str(clip), '-frames:v', '1', '-vf', 'scale=180:320', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], binary=True).stdout
    return None if not raw else raw


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('graphic', help='spec .json (built-in template) or a 1080x1920 .html page')
    ap.add_argument('--meme', required=True, help='green-screen clip (mp4/mov)')
    ap.add_argument('--audio', required=True, help='music track; "meme" = use the clip\'s own audio')
    ap.add_argument('--out', required=True, help='output dir, e.g. ig-news/media/<id>')
    for k in ('start', 'end', 'scale', 'similarity', 'blend', 'audio_start'):
        ap.add_argument('--' + k.replace('_', '-'), type=float)
    ap.add_argument('--loops', type=int)
    ap.add_argument('--crop', help='x,y,w,h of the meme clip to keep')
    ap.add_argument('--key', help='screen colour, e.g. 0x0EFF00 (default: auto)')
    a = ap.parse_args()

    g = pathlib.Path(a.graphic).resolve(); out = pathlib.Path(a.out).resolve(); out.mkdir(parents=True, exist_ok=True)
    spec = json.loads(g.read_text()) if g.suffix == '.json' else {}
    html = build_html(spec, g.parent) if g.suffix == '.json' else g.read_text()
    m = dict(spec.get('meme', {})); au = dict(spec.get('audio', {}))
    for k in ('start', 'end', 'scale', 'similarity', 'blend', 'loops', 'key'):
        if getattr(a, k) is not None: m[k] = getattr(a, k)
    if a.crop: m['crop'] = [int(v) for v in a.crop.split(',')]
    if a.audio_start is not None: au['start'] = a.audio_start

    png = out / 'graphic.png'
    render_png(html, png)

    clip = pathlib.Path(a.meme).resolve()
    probe = json.loads(run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type,width,height:format=duration', '-of', 'json', str(clip)]).stdout)
    vs = next(s for s in probe['streams'] if s['codec_type'] == 'video'); cw, ch = vs['width'], vs['height']
    start = float(m.get('start', 0)); end = float(m.get('end', float(probe['format']['duration'])))
    loops = int(m.get('loops', 2)); seg = end - start; dur = seg * loops
    if not 12 <= dur <= 20.5:
        print(f'WARNING duration {dur:.1f}s is outside 12-20 s: change start/end/loops')
    x, y, w, h = m.get('crop', [0, 0, cw, ch])
    sc = float(m.get('scale', 1.0)); ow, oh = int(round(w * sc / 2) * 2), int(round(h * sc / 2) * 2)
    px = int(m.get('x', 0)); py = HGT - oh + int(m.get('y_offset', 0))
    key = m.get('key', 'auto')
    if key == 'auto':
        raw = sample_key(clip, start) or b''
        import collections
        px3 = [tuple(v // 4 * 4 + 2 for v in raw[i:i + 3]) for i in range(0, len(raw), 3)]
        greens = [c for c in px3 if c[1] > 150 and c[0] < 140 and c[2] < 140]
        c = collections.Counter(greens).most_common(1)[0][0] if greens else (0, 255, 0)
        key = '0x%02X%02X%02X' % c
    sim, bl = float(m.get('similarity', 0.28)), float(m.get('blend', 0.06))
    fr, ft = int(m.get('feather_right', 0)), int(m.get('feather_top', 0))
    # alpha feather mask for straight cut edges of the source (right / top)
    mask = out / '_mask.png'
    from PIL import Image
    mk = Image.new('L', (ow, oh), 255); pxl = mk.load()
    for xx in range(ow):
        fx = min(1.0, (ow - 1 - xx) / fr) if fr else 1.0
        if fx < 1.0:
            for yy in range(oh): pxl[xx, yy] = int(255 * fx)
    if ft:
        for yy in range(min(ft, oh)):
            for xx in range(ow): pxl[xx, yy] = int(pxl[xx, yy] * yy / ft)
    mk.save(mask)

    nseg = int(round(seg * FPS))
    vol = float(m.get('volume', 0))
    fc = (f'[1:v]trim=start={start}:end={end},setpts=PTS-STARTPTS,fps={FPS},crop={w}:{h}:{x}:{y},'
          f'chromakey={key}:{sim}:{bl},despill=type=green:mix=0.6:expand=0.1,scale={ow}:{oh}:flags=lanczos,'
          f'loop=loop={loops - 1}:size={nseg}:start=0,setpts=N/{FPS}/TB,format=rgba,split[k][k2];'
          f'[k2]alphaextract[ka];[3:v]format=gray[mk];[ka][mk]blend=all_mode=multiply,format=gray[kam];[k][kam]alphamerge[km];'
          f'[0:v][km]overlay={px}:{py}:shortest=0:format=auto,format=yuv420p,trim=duration={dur:.3f}[v]')
    a_in = []
    if a.audio == 'meme':
        fc += f';[1:a]atrim=start={start}:end={end},asetpts=PTS-STARTPTS,aloop=loop={loops - 1}:size={int(seg * 48000)},atrim=duration={dur:.3f}[mus]'
    else:
        a_in = ['-i', str(pathlib.Path(a.audio).resolve())]
        ast = float(au.get('start', 0)); fo = float(au.get('fade_out', 1.2)); fi = float(au.get('fade_in', 0))
        fc += (f';[4:a]aresample=48000,atrim=start={ast}:duration={dur:.3f},asetpts=PTS-STARTPTS'
               + (f',afade=t=in:d={fi}' if fi else '') + f',afade=t=out:st={max(0, dur - fo):.3f}:d={fo}'
               + ('[mus0]' if vol > 0 else '[mus]'))
        if vol > 0:  # mix the meme's own sound under the music
            fc += (f';[1:a]aresample=48000,atrim=start={start}:end={end},asetpts=PTS-STARTPTS,aloop=loop={loops - 1}:size={int(seg * 48000)},'
                   f'atrim=duration={dur:.3f},volume={vol}[ma];[mus0][ma]amix=inputs=2:normalize=0[mus]')
    tmp = out / '_premaster.mp4'
    run(['ffmpeg', '-y', '-v', 'error', '-loop', '1', '-framerate', str(FPS), '-t', f'{dur:.3f}', '-i', str(png), '-i', str(clip),
         '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-loop', '1', '-framerate', str(FPS), '-t', f'{dur:.3f}', '-i', str(mask), *a_in,
         '-filter_complex', fc, '-map', '[v]', '-map', '[mus]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
         '-r', str(FPS), '-c:a', 'pcm_s16le', '-t', f'{dur:.3f}', str(tmp.with_suffix('.mkv'))])
    tmp = tmp.with_suffix('.mkv')
    # two-pass loudness normalisation
    lufs = float(au.get('lufs', -14))
    st = run(['ffmpeg', '-v', 'info', '-i', str(tmp), '-af', f'loudnorm=I={lufs}:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']).stderr
    js = json.loads(st[st.rfind('{'):st.rfind('}') + 1])
    ln = (f'loudnorm=I={lufs}:TP=-1.5:LRA=11:measured_I={js["input_i"]}:measured_TP={js["input_tp"]}:measured_LRA={js["input_lra"]}'
          f':measured_thresh={js["input_thresh"]}:offset={js["target_offset"]}:linear=true')
    mp4 = out / 'memereact.mp4'
    run(['ffmpeg', '-y', '-v', 'error', '-i', str(tmp), '-c:v', 'copy', '-af', ln + ',aresample=48000', '-c:a', 'aac', '-b:a', '192k',
         '-movflags', '+faststart', str(mp4)])
    tmp.unlink(); mask.unlink()
    run(['ffmpeg', '-y', '-v', 'error', '-i', str(mp4), '-frames:v', '1', '-q:v', '2', str(out / 'cover.jpg')])
    run(['ffmpeg', '-y', '-v', 'error', '-i', str(mp4), '-frames:v', '1', '-q:v', '2', str(out / 'thumb_tiktok.jpg')])
    run(['ffmpeg', '-y', '-v', 'error', '-i', str(mp4), '-vf', 'fps=1,scale=216:384,tile=8x2', '-frames:v', '1', '-q:v', '4', str(out / 'contact.jpg')])
    from PIL import ImageDraw
    sz = Image.open(out / 'cover.jpg').convert('RGB'); d = ImageDraw.Draw(sz, 'RGBA')
    for box in [(0, 0, W, 220), (0, HGT - 440, W, HGT), (W - 160, 700, W, HGT)]:  # TikTok/IG UI: top bar, caption, buttons
        d.rectangle(box, fill=(255, 0, 0, 70))
    sz.save(out / 'safezones.jpg', quality=85)
    meas = run(['ffmpeg', '-v', 'info', '-i', str(mp4), '-af', 'ebur128', '-f', 'null', '-']).stderr
    i_lufs = re.findall(r'I:\s+(-?[\d.]+) LUFS', meas)
    print(f'OK {mp4}  {dur:.1f}s  key={key}  loudness={i_lufs[-1] if i_lufs else "?"} LUFS')
    print('Check cover.jpg (frame 0: full graphic + meme face) and contact.jpg before scheduling.')


if __name__ == '__main__':
    main()
