#!/usr/bin/env python3
"""Daily Reel: a photo slideshow video (1080x1920, 30 fps, H.264 + AAC) with IG-style text and music.

Usage: python3 ig-news/reel.py ig-news/posts/<id>        (reads reel.json, writes ig-news/media/<id>/reel.mp4 + cover.jpg)

reel.json:
{"music": "<mixkit id>",                         # from tools/music.py pick / list
 "slides": [
   {"photo": "a.jpg", "pos": "50% 40%", "text": "5 trading rules\\npros never break", "hook": true},
   {"photo": "b.jpg", "num": "1", "text": "Risk 1–2% per trade", "sub": "Ten losses in a row still leaves you ~90%"},
   ...,
   {"kind": "cta"}                                  # last slide: Hotcoin app + link in bio
 ]}
Text is drawn white with a dark outline (TikTok/IG native look) on a softly darkened photo.
Each photo slowly zooms (Ken Burns); slides cross-fade; music fades in/out.
"""
import json, sys, pathlib, subprocess, base64, mimetypes, html as H, shutil
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
W, HH, FPS, XF = 1080, 1920, 30, 0.35


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
"""


def text_html(s, sym):
    if s.get('kind') == 'cta':
        return ''
    lines = '<br>'.join(H.escape(x) for x in s['text'].split('\n'))
    num = f'<div class="num">{H.escape(s["num"])}</div>' if s.get('num') else ''
    if s.get('hook') and s.get('tag'):
        num = f'<div class="num tag">{H.escape(s["tag"])}</div>'
    sub = f'<div class="sub">{H.escape(s["sub"])}</div>' if s.get('sub') else ''
    swipe = '<div class="swipe">Watch till the end 👇</div>' if s.get('hook') else ''
    return (f'<div class="tx {"hook" if s.get("hook") else ""}">{num}<div class="t">{lines}</div>{sub}</div>{swipe}'
            f'<div class="wm"><i><img src="{sym}"></i>@hotcoinex</div>')


def main():
    post = pathlib.Path(sys.argv[1]).resolve()
    spec = json.loads((post / 'reel.json').read_text())
    out = ROOT / 'media' / post.name
    work = out / 'reel_frames'
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
            # background: photo cover-cropped, rendered 10% oversize so the zoom never shows edges
            ph = uri(post / s['photo'])
            pg.set_content(f'<!doctype html><html><head><style>{CSS}</style></head><body><div class="bg" style="background-image:url({ph});background-position:{s.get("pos","center")}"></div></body></html>')
            pg.wait_for_load_state('networkidle')
            pg.screenshot(path=str(work / f'bg{n:02d}.jpg'), type='jpeg', quality=94)
            pg.set_content(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{text_html(s, sym)}</body></html>')
            pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready')
            pg.screenshot(path=str(work / f'tx{n:02d}.png'), omit_background=True)
        b.close()

    n = len(spec['slides'])
    durs = [float(s.get('dur', 3.4 if s.get('hook') else (3.6 if s.get('kind') == 'cta' else 3.0))) for s in spec['slides']]
    total = sum(durs) - XF * (n - 1)
    cmd = ['ffmpeg', '-y', '-loglevel', 'error']
    for i in range(n):
        cmd += ['-loop', '1', '-t', f'{durs[i]}', '-i', str(work / f'bg{i+1:02d}.jpg'),
                '-loop', '1', '-t', f'{durs[i]}', '-i', str(work / f'tx{i+1:02d}.png')]
    track = subprocess.run([sys.executable, str(ROOT / 'tools' / 'music.py'), 'get', str(spec['music'])], capture_output=True, text=True, check=True).stdout.split('\n')
    cmd += ['-i', track[0]]
    fc, offset = [], 0.0
    for i in range(n):
        frames = int(durs[i] * FPS)
        z = '1.0+0.07*on/%d' % frames if i % 2 == 0 else '1.07-0.07*on/%d' % frames  # alternate zoom in / out
        fc.append(f'[{2*i}:v]scale=2160:3840,zoompan=z=\'{z}\':d={frames}:x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':s={W}x{HH}:fps={FPS},setsar=1[b{i}]')
        fade = '' if i == 0 else 'fade=t=in:st=0.12:d=0.3:alpha=1,'  # slide 1 text is visible from frame 0 = the Reel cover
        fc.append(f'[{2*i+1}:v]format=rgba,fps={FPS},{fade}setsar=1[t{i}]')
        fc.append(f'[b{i}][t{i}]overlay=0:0:shortest=1,format=yuv420p,trim=duration={durs[i]},setpts=PTS-STARTPTS[s{i}]')
    last = 's0'
    for i in range(1, n):
        offset += durs[i - 1] - XF
        fc.append(f'[{last}][s{i}]xfade=transition=fade:duration={XF}:offset={offset:.3f}[x{i}]')
        last = f'x{i}'
    fc.append(f'[{2*n}:a]atrim=0:{total:.3f},afade=t=in:d=0.4,afade=t=out:st={total-1.4:.3f}:d=1.4,volume=0.9[a]')
    mp4 = out / 'reel.mp4'
    cmd += ['-filter_complex', ';'.join(fc), '-map', f'[{last}]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
            '-pix_fmt', 'yuv420p', '-r', str(FPS), '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', f'{total:.3f}', str(mp4)]
    subprocess.run(cmd, check=True)
    # cover = frame 0 (Instagram's default Reel cover); check it before scheduling
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(mp4), '-frames:v', '1', '-q:v', '2', str(out / 'cover.jpg')], check=True)
    print(mp4.relative_to(ROOT.parent), f'{total:.1f}s'); print(track[1])


if __name__ == '__main__':
    main()
