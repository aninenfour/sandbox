#!/usr/bin/env python3
"""Daily Reel: a photo slideshow video (1080x1920, 30 fps, H.264 + AAC) with IG-style text and music.

Usage: python3 ig-news/reel.py ig-news/posts/<id>        (reads reel.json, writes ig-news/media/<id>/reel.mp4 + cover.jpg)
       python3 ig-news/reel.py ig-news/posts/<id> --square   (1080x1080 cut for X, no promo card: reel_square.mp4 + cover_square.jpg)

reel.json:
{"music": "<mixkit id>",                         # from tools/music.py pick / list
 "slides": [
   {"photo": "a.jpg", "pos": "50% 40%", "text": "5 trading rules\\npros never break", "hook": true},
   {"photo": "b.jpg", "num": "1", "text": "Risk 1–2% per trade", "sub": "Ten losses in a row still leaves you ~90%", "shift": 220},
   ...,
   {"kind": "cta"}                                  # last slide: Hotcoin app + link in bio
 ],
 "title": "5 rules pros never break"}               # optional: white pill on every slide after the hook
Tier-list Reel (the "Ranking X" format): add "tier": {"tiers": ["S","A","B","C","D","F"],
"items": [{"name", "tier", "logo", "why"}, ...]} and put {"kind": "tier_all"} in slides after the hook;
it becomes one reveal slide per item. Rank by real data only (returns, drawdowns, fees), never by opinion.
Text is drawn white with a dark outline (TikTok/IG native look) on a softly darkened photo.
Each photo slowly zooms (Ken Burns); slides cross-fade; music fades in/out.
"""
import json, sys, pathlib, subprocess, base64, mimetypes, html as H, shutil, re
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
W, HH, FPS = 1080, 1920, 30
# pacing (owner feedback Oct 20: slower, readable): hook 4s, content 4.5s, tier reveal 3.2s, promo 4.5s;
# soft 0.8s cross-fades between shots, and the promo card slides up instead of fading in
DUR = {'hook': 4.0, 'slide': 4.5, 'tier': 3.2, 'cta': 4.5}
XF, XF_CTA = 0.8, 0.9


def uri(p):
    p = pathlib.Path(p)
    mt = 'image/svg+xml' if p.suffix == '.svg' else (mimetypes.guess_type(str(p))[0] or 'image/png')
    return f'data:{mt};base64,{base64.b64encode(p.read_bytes()).decode()}'


CSS = """
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden;background:transparent}
body{font-family:'Inter Display','Inter',sans-serif;-webkit-font-smoothing:antialiased}
.bg{position:absolute;inset:0;background-size:cover}
.bg:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 90% 40% at 50% 46%,rgba(0,0,0,.38),rgba(0,0,0,0) 75%),linear-gradient(180deg,rgba(0,0,0,.08) 0%,rgba(0,0,0,.12) 50%,rgba(0,0,0,.45) 100%)}
.tx{position:absolute;left:70px;right:70px;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff}
.t{font-weight:800;font-size:100px;line-height:1.08;letter-spacing:-.01em;-webkit-text-stroke:3px rgba(0,0,0,.85);paint-order:stroke fill;text-shadow:0 6px 28px rgba(0,0,0,.55)}
.hook .t{font-size:118px}
.num.tag{font-size:44px;letter-spacing:.06em;padding:10px 30px}
.num{display:inline-block;font-weight:800;font-size:60px;color:#0A0A0A;background:#7EC25A;border-radius:18px;padding:4px 26px;margin-bottom:34px;box-shadow:0 8px 24px rgba(0,0,0,.35)}
.sub{margin-top:36px;font-family:'Inter';font-weight:600;font-size:50px;line-height:1.3;-webkit-text-stroke:2px rgba(0,0,0,.8);paint-order:stroke fill;text-shadow:0 4px 18px rgba(0,0,0,.6)}
.wm{position:absolute;right:56px;bottom:150px;display:flex;align-items:center;gap:14px;font-family:'Inter';font-weight:700;font-size:30px;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.6)}
.wm i{width:66px;height:66px;border-radius:50%;background:#0A0A0A;display:flex;align-items:center;justify-content:center;border:3px solid #7EC25A}
.wm img{width:36px}
.swipe{position:absolute;left:0;right:0;bottom:300px;text-align:center;font-family:'Inter';font-weight:700;font-size:44px;color:#fff;opacity:.92;text-shadow:0 2px 12px rgba(0,0,0,.7)}
.ctab{position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 50% 60%,#E9FCD0 0%,#C6F28C 36%,#8FD84E 72%,#5BAA2E 100%)}
.ctab .holder{position:absolute;left:0;top:400px;width:1080px;height:1350px}
.ctat{position:absolute;left:0;right:0;top:170px;text-align:center;color:#07090A;font-weight:800;font-size:92px;line-height:1.02;letter-spacing:-.04em}
.ctat span{background:#07090A;color:#B8F26A;border-radius:16px;padding:0 18px}
.ctas{position:absolute;left:0;right:0;top:445px;text-align:center;color:#1b2a10;font-family:'Inter';font-weight:600;font-size:40px}
.kw{color:#FFD60A}.kwr{color:#FF5A52!important}.pnl,.bgblur{display:none}
.ptitle{position:absolute;left:0;right:0;top:250px;text-align:center}
.ptitle span{display:inline-block;background:#fff;color:#0A0A0A;font-weight:800;font-size:50px;line-height:1.1;padding:10px 26px;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.35)}
.tierbg{position:absolute;inset:0;background:radial-gradient(ellipse 120% 80% at 50% 40%,#1d2328,#0A0C0E 70%)}
.tiers{position:absolute;left:60px;right:60px;top:400px;display:flex;flex-direction:column;gap:10px}
.tiers .row{display:flex;height:150px;border-radius:14px;overflow:hidden;background:#15191d}
.tiers .lab{width:150px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:72px;color:#0A0A0A}
.tiers .its{flex:1;display:flex;align-items:center;gap:16px;padding:0 18px}
.tiers .it{display:flex;flex-direction:column;align-items:center;gap:6px;color:#fff;font-family:'Inter';font-weight:700;font-size:24px}
.tiers .it img{width:84px;height:84px;border-radius:50%;background:#fff;object-fit:contain;padding:8px}
.tiers .it.new img{box-shadow:0 0 0 6px #7EC25A}
.tlegend{position:absolute;left:40px;right:40px;top:1375px;text-align:center;color:#9aa3ab;font-family:'Inter';font-weight:600;font-size:27px;white-space:nowrap}
.tnote{position:absolute;left:70px;right:70px;top:1470px;text-align:center;color:#fff;font-weight:800;font-size:64px;line-height:1.1;-webkit-text-stroke:2px rgba(0,0,0,.85);paint-order:stroke fill}
.tnote small{display:block;margin-top:14px;font-family:'Inter';font-weight:600;font-size:40px;color:#ffffffd9;-webkit-text-stroke:0}
"""
# Text styles (owner, Oct 24: outlined text straight on a busy photo, e.g. yellow on gold, reads badly). reel.json "style":
#   outline  white outlined text on the photo (the original look)
#   panel    photo on top, text on a solid dark panel below (text never touches the photo)
#   box      photo full screen, every text line on its own dark caption box (TikTok-style)
#   frame    blurred photo backdrop, sharp photo as a rounded card, clean text underneath
STYLE_CSS = {
    'outline': '',
    'panel': """
body.bgp{background:#0B0D0F}.bg{bottom:40%}.bg:after{background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,0) 30%,rgba(11,13,15,.0) 80%,rgba(11,13,15,1))}
.pnl{display:block!important;position:absolute;left:0;right:0;bottom:0;height:40%;background:#0B0D0F}
.tx{top:auto;bottom:0;height:40%;left:80px;right:80px;justify-content:flex-start;align-items:flex-start;text-align:left;padding-top:20px}
.t,.hook .t{font-size:96px;-webkit-text-stroke:0;text-shadow:none;letter-spacing:-.025em}
.sub{font-size:44px;color:#AEB6BD;-webkit-text-stroke:0;text-shadow:none;margin-top:28px}
.num{margin-bottom:26px;box-shadow:none}.kw{color:#7EC25A}
.swipe{bottom:250px;text-align:left;left:80px;font-size:38px;color:#AEB6BD;text-shadow:none}
.wm{bottom:110px}
""",
    'box': """
.bg:after{background:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.25))}
.t,.hook .t{font-size:84px;line-height:1.42;-webkit-text-stroke:0;text-shadow:none}
.ln{background:#0A0A0A;padding:4px 26px;border-radius:16px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.sub{-webkit-text-stroke:0;text-shadow:none;font-size:42px;line-height:1.6;margin-top:30px;max-width:900px}
.sub .ln{background:#fff;color:#0A0A0A;padding:6px 20px;border-radius:12px}
.sub .kw{color:#2F7D12}.kw{color:#B8F26A}
""",
    'frame': """
.bgblur{display:block!important;position:absolute;inset:-60px;background-size:cover;background-position:center;filter:blur(46px) brightness(.42) saturate(1.1)}
body.bgp{background:#0B0D0F}.bg{left:70px;right:70px;top:380px;bottom:auto;height:820px;border-radius:40px;box-shadow:0 30px 80px rgba(0,0,0,.55)}.bg:after{display:none}
.tx{top:1230px;bottom:250px;justify-content:flex-start}
.t,.hook .t{font-size:88px;-webkit-text-stroke:0;text-shadow:0 4px 24px rgba(0,0,0,.4);letter-spacing:-.02em}
.sub{font-size:42px;color:#D5DADF;-webkit-text-stroke:0;text-shadow:none;margin-top:24px}
.kw{color:#7EC25A}.swipe{display:none}
""",
}


# --square: same slides re-laid out for 1080x1080 (owner, Oct 20: tier-list Reels also go to X as a square video)
SQUARE_CSS = """html,body{height:1080px}
.t{font-size:74px}.hook .t{font-size:86px}.num{font-size:46px;margin-bottom:22px}.num.tag{font-size:34px}.sub{font-size:38px;margin-top:22px}
.ptitle{top:50px}.ptitle span{font-size:40px}
.wm{bottom:36px;right:40px;font-size:26px}.wm i{width:54px;height:54px}.wm img{width:30px}
.swipe{bottom:100px;font-size:36px}
.tiers{top:130px;left:120px;right:120px;gap:8px}.tiers .row{height:96px}.tiers .lab{width:96px;font-size:50px}
.tiers .its{gap:12px;padding:0 12px}.tiers .it{font-size:17px;gap:3px}.tiers .it img{width:56px;height:56px;padding:5px}
.tlegend{top:790px;font-size:22px}.tnote{top:836px;font-size:50px}.tnote small{font-size:32px;margin-top:8px}
"""
TIER_COLORS = {'S': '#FF7F7F', 'A': '#FFBF7F', 'B': '#FFDF7F', 'C': '#BFFF7F', 'D': '#7FFF7F', 'F': '#C77DFF'}


def tier_html(spec, upto, post):
    """Tier-list board (the 'Ranking X' format): items revealed one per slide, the newest one ringed in green."""
    rows = {t: [] for t in spec['tiers']}
    for k, it in enumerate(spec['items'][:upto]):
        logo = it.get('logo')
        img = ''
        if logo:
            src = post / logo if (post / logo).exists() else ROOT / 'assets' / 'logos' / logo
            img = f'<img src="{uri(src)}">'
        rows[it['tier']].append(f'<div class="it{" new" if k == upto - 1 else ""}">{img}{H.escape(it["name"])}</div>')
    board = ''.join(f'<div class="row"><div class="lab" style="background:{TIER_COLORS.get(t, "#ccc")}">{t}</div><div class="its">{"".join(v)}</div></div>' for t, v in rows.items())
    cur = spec['items'][upto - 1]
    note = f'<div class="tnote">{H.escape(cur["name"])}: {H.escape(cur["tier"])}<small>{H.escape(cur.get("why", ""))}</small></div>'
    legend = f'<div class="tlegend">{H.escape(spec["legend"])}</div>' if spec.get('legend') else ''
    return f'<div class="tierbg"></div><div class="tiers">{board}</div>{legend}{note}'


def kw(t):
    """Escape text; [word] becomes a yellow keyword (the caption style top finance Shorts use, weekly scan W43)."""
    t = re.sub(r'\[(.+?)\]', r'<span class="kw">\1</span>', H.escape(t))
    return re.sub(r'\{(.+?)\}', r'<span class="kwr">\1</span>', t)  # {word}: red keyword for losses


def text_html(s, sym, title=''):
    if s.get('kind') == 'cta':
        return ''
    lines = '<br>'.join(f'<span class="ln">{kw(x)}</span>' for x in s['text'].split('\n'))
    num = f'<div class="num">{H.escape(s["num"])}</div>' if s.get('num') else ''
    if s.get('hook') and s.get('tag'):
        num = f'<div class="num tag">{H.escape(s["tag"])}</div>'
    sub = f'<div class="sub"><span class="ln">{kw(s["sub"])}</span></div>' if s.get('sub') else ''
    swipe = '<div class="swipe">Watch till the end 👇</div>' if s.get('hook') else ''
    shift = f' style="transform:translateY({int(s["shift"] * HH / 1920)}px)"' if s.get('shift') else ''  # move text off the photo's subject
    top = f'<div class="ptitle"><span>{H.escape(title)}</span></div>' if title and not s.get('hook') else ''  # context for viewers who land mid-loop
    return (f'<div class="pnl"></div>{top}<div class="tx {"hook" if s.get("hook") else ""}"{shift}>{num}<div class="t">{lines}</div>{sub}</div>{swipe}'
            f'<div class="wm"><i><img src="{sym}"></i>@hotcoinex</div>')


def main():
    global HH, CSS
    post = pathlib.Path(sys.argv[1]).resolve()
    sq = '--square' in sys.argv
    if sq:
        HH, CSS = W, CSS + SQUARE_CSS
    sfx = '_square' if sq else ''
    spec = json.loads((post / 'reel.json').read_text())
    if 'tier' in spec:  # {"kind": "tier_all"} expands to one reveal slide per ranked item
        ex = []
        for sl in spec['slides']:
            ex += [{'kind': 'tier', 'upto': k + 1, 'dur': DUR['tier']} for k in range(len(spec['tier']['items']))] if sl.get('kind') == 'tier_all' else [sl]
        spec['slides'] = ex
    if sq:  # X cut: no promo card (owner, Oct 20); hold the final slide longer instead
        spec['slides'] = [x for x in spec['slides'] if x.get('kind') != 'cta']
        spec['slides'][-1]['dur'] = max(float(spec['slides'][-1].get('dur', 0)), DUR['cta'])
    CSS += STYLE_CSS[spec.get('style', 'frame')]  # frame = house style (owner, Oct 24)
    out = ROOT / 'media' / post.name
    work = out / ('reel_frames' + sfx)
    shutil.rmtree(work, ignore_errors=True); work.mkdir(parents=True)
    sym = uri(ROOT / 'assets' / 'symbol.svg')
    import render, cta  # reuse the carousel CTA card (live app UI) for the last slide
    render.SYM = sym
    g = vars(render)
    grain = ROOT.parent / 'hotcoin-tradfi/public/grain.png'
    cta_css = cta.CSS.replace('GRAIN', uri(grain) if grain.exists() else '')
    base_css = (render.CSS % {'g': render.GREEN, 'r': render.RED}).replace('GRAIN', '')
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = b.new_page(viewport={'width': W, 'height': HH}, device_scale_factor=1)
        for n, s in enumerate(spec['slides'], 1):
            if s.get('kind') == 'cta':
                card = cta.s_end(g)({}, post)
                body = (f'<div class="ctab"><div class="ctat">Trade crypto<br>&amp; <span>US stocks</span></div><div class="ctas">Register on Hotcoin · link in bio</div>'
                        f'<div class="holder">{card}</div></div>')
                css = base_css + cta_css + CSS + '.holder .slide{transform:none;overflow:visible}.holder .cta .h1,.holder .cta .sub,.holder .cta .top{display:none}.holder .cta{background:transparent}.holder .cta .ring,.holder .cta .gr{display:none}'
                pg.set_content(f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body>{body}</body></html>')
                pg.wait_for_load_state('networkidle')
                pg.screenshot(path=str(work / f'bg{n:02d}.jpg'), type='jpeg', quality=94)
                pg.set_content(f'<!doctype html><html><head><style>{CSS}</style></head><body></body></html>')
                pg.screenshot(path=str(work / f'tx{n:02d}.png'), omit_background=True)
                continue
            if s.get('kind') == 'tier':  # the board itself is the background; no text layer
                body = tier_html(spec['tier'], s['upto'], post)
                pg.set_content(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}<div class="ptitle"><span>{H.escape(spec.get("title", ""))}</span></div></body></html>')
                pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready')
                pg.screenshot(path=str(work / f'bg{n:02d}.jpg'), type='jpeg', quality=94)
                pg.set_content(f'<!doctype html><html><head><style>{CSS}</style></head><body></body></html>')
                pg.screenshot(path=str(work / f'tx{n:02d}.png'), omit_background=True)
                continue
            # background: photo cover-cropped, rendered 10% oversize so the zoom never shows edges
            ph = uri(post / s['photo'])
            pg.set_content(f'<!doctype html><html><head><style>{CSS}</style></head><body class="bgp"><div class="bgblur" style="background-image:url({ph})"></div><div class="bg" style="background-image:url({ph});background-position:{s.get("pos","center")}"></div></body></html>')
            pg.wait_for_load_state('networkidle')
            pg.screenshot(path=str(work / f'bg{n:02d}.jpg'), type='jpeg', quality=94)
            pg.set_content(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{text_html(s, sym, spec.get("title", ""))}</body></html>')
            pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready')
            pg.screenshot(path=str(work / f'tx{n:02d}.png'), omit_background=True)
        b.close()

    n = len(spec['slides'])
    durs = [float(s.get('dur', DUR['hook'] if s.get('hook') else (DUR['cta'] if s.get('kind') == 'cta' else DUR['slide']))) for s in spec['slides']]
    trans = [('slideup', XF_CTA) if spec['slides'][i].get('kind') == 'cta' else ('fade', XF) for i in range(n)]  # transition INTO slide i
    total = sum(durs) - sum(trans[i][1] for i in range(1, n))
    cmd = ['ffmpeg', '-y', '-loglevel', 'error']
    for i in range(n):
        cmd += ['-loop', '1', '-t', f'{durs[i]}', '-i', str(work / f'bg{i+1:02d}.jpg'),
                '-loop', '1', '-t', f'{durs[i]}', '-i', str(work / f'tx{i+1:02d}.png')]
    track = subprocess.run([sys.executable, str(ROOT / 'tools' / 'music.py'), 'get', str(spec['music'])], capture_output=True, text=True, check=True).stdout.split('\n')
    cmd += ['-i', track[0]]
    fc, offset = [], 0.0
    for i in range(n):
        frames = int(durs[i] * FPS)
        z = '1.0+0.05*on/%d' % frames if i % 2 == 0 else '1.05-0.05*on/%d' % frames  # gentle alternate zoom in / out
        if spec['slides'][i].get('kind') == 'tier':
            z = '1.0'  # the board must stay steady and sharp
        fc.append(f'[{2*i}:v]scale={2*W}:{2*HH},zoompan=z=\'{z}\':d={frames}:x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':s={W}x{HH}:fps={FPS},setsar=1[b{i}]')
        fade = '' if i == 0 else 'fade=t=in:st=0.45:d=0.5:alpha=1,'  # slide 1 text is visible from frame 0 = the Reel cover
        fc.append(f'[{2*i+1}:v]format=rgba,fps={FPS},{fade}setsar=1[t{i}]')
        fc.append(f'[b{i}][t{i}]overlay=0:0:shortest=1,format=yuv420p,trim=duration={durs[i]},setpts=PTS-STARTPTS[s{i}]')
    last = 's0'
    for i in range(1, n):
        tr, td = trans[i]
        offset += durs[i - 1] - td
        fc.append(f'[{last}][s{i}]xfade=transition={tr}:duration={td}:offset={offset:.3f}[x{i}]')
        last = f'x{i}'
    fc.append(f'[{2*n}:a]atrim=0:{total:.3f},afade=t=in:d=0.4,afade=t=out:st={total-1.4:.3f}:d=1.4,volume=0.9[a]')
    mp4 = out / f'reel{sfx}.mp4'
    cmd += ['-filter_complex', ';'.join(fc), '-map', f'[{last}]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
            '-pix_fmt', 'yuv420p', '-r', str(FPS), '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', f'{total:.3f}', str(mp4)]
    subprocess.run(cmd, check=True)
    # cover = frame 0 (Instagram's default Reel cover); check it before scheduling
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(mp4), '-frames:v', '1', '-q:v', '2', str(out / f'cover{sfx}.jpg')], check=True)
    print(mp4.relative_to(ROOT.parent), f'{total:.1f}s'); print(track[1])


if __name__ == '__main__':
    main()
