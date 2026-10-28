#!/usr/bin/env python3
"""Animated story Reel (owner, Oct 26): a short visual story with barely any text, then a typed lesson, Hotcoin style.

Usage: python3 ig-news/story.py ig-news/posts/<id> [--music <mixkit id>] [--frames-only]
  WHAT IF Reels (owner, Oct 28): a post with whatif.json uses the shared stories/whatif.js template instead of scene.js.
  reads <post>/scene.js (defines draw(t), window.DURATION, window.CUES) on top of ig-news/stories/kit.js,
  writes ig-news/media/<id>/story.mp4 (1080x1920, 30 fps) + cover.jpg + contact.jpg (one frame per second).
One 9:16 file goes to IG Reels, FB Reels and X (no promo card, no CTA on X).
Sound is synthesized from the scene's CUES (thunk, hop, whoosh, creak, crash, thud, stamp, key, chime, cheer)
over a Mixkit music bed that stops at the 'cut' cue.
"""
import json, sys, pathlib, subprocess, shutil, wave
import numpy as np
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent
W, H, FPS, SR = 1080, 1920, 30, 44100
rs = np.random.default_rng(5)


def env(n, a=.004, d=None):
    e = np.ones(n); k = max(1, int(a * SR)); e[:k] = np.linspace(0, 1, k)
    if d: e *= np.exp(-np.arange(n) / (d * SR))
    return e


def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode='same')


def sfx(name, pitch=1.0):
    t = lambda s: np.arange(int(s * SR)) / SR
    if name == 'thunk':
        tt = t(.32); f = 95 * pitch * np.exp(-tt * 6)
        return .9 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), d=.09) + .25 * lowpass(rs.standard_normal(len(tt)), 6) * env(len(tt), d=.015)
    if name == 'thud':
        tt = t(.28); return .55 * np.sin(2 * np.pi * 70 * tt) * env(len(tt), d=.07) + .2 * lowpass(rs.standard_normal(len(tt)), 12) * env(len(tt), d=.03)
    if name == 'hop':
        tt = t(.18); return .18 * np.sin(2 * np.pi * (500 + 1400 * tt / .18) * tt) * env(len(tt), d=.08)
    if name == 'whoosh':
        tt = t(1.3); n = lowpass(rs.standard_normal(len(tt)), 40); return .35 * n * np.sin(np.pi * tt / 1.3) ** 2
    if name == 'creak':
        tt = t(.55); f = 160 + 25 * np.sin(2 * np.pi * 9 * tt); s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR))
        return .12 * lowpass(s, 8) * np.sin(np.pi * tt / .55)
    if name == 'crash':
        tt = t(2.2); n = lowpass(rs.standard_normal(len(tt)), 3)
        return .7 * n * env(len(tt), d=.35) + .9 * np.sin(2 * np.pi * 48 * tt) * env(len(tt), d=.5)
    if name == 'stamp':
        tt = t(.5); return .8 * np.sin(2 * np.pi * 60 * tt) * env(len(tt), d=.12) + .3 * lowpass(rs.standard_normal(len(tt)), 2) * env(len(tt), d=.02)
    if name == 'key':
        tt = t(.04); return .35 * np.diff(rs.standard_normal(len(tt) + 1)) * env(len(tt), d=.008)
    if name == 'chime':
        tt = t(1.6); return .22 * (np.sin(2 * np.pi * 880 * tt) + .6 * np.sin(2 * np.pi * 1320 * tt)) * env(len(tt), .01, .45)
    if name == 'pad':  # soft low drone under the lesson
        tt = t(6.5); return .16 * (np.sin(2 * np.pi * 55 * tt) + .7 * np.sin(2 * np.pi * 82.5 * tt) + .35 * np.sin(2 * np.pi * 110 * tt * (1 + .003 * np.sin(tt)))) * np.minimum(1, tt / 1.2) * np.minimum(1, (6.5 - tt) / 1.5)
    if name == 'cash':  # register "ka-ching"
        tt = t(.9); return (.25 * lowpass(rs.standard_normal(len(tt)), 2) * env(len(tt), d=.03)
                            + .2 * (np.sin(2 * np.pi * 2093 * tt) + np.sin(2 * np.pi * 2637 * tt)) * env(len(tt), .005, .3) * (tt > .08))
    if name == 'cheer':
        tt = t(.7); return .14 * (np.sin(2 * np.pi * 660 * tt) + np.sin(2 * np.pi * 990 * tt * (1 + .02 * tt))) * env(len(tt), .02, .25)
    return np.zeros(1)


def main():
    post = pathlib.Path(sys.argv[1]).resolve()
    out = ROOT / 'media' / post.name; frames = out / 'story_frames'
    shutil.rmtree(frames, ignore_errors=True); frames.mkdir(parents=True)
    kit = (ROOT / 'stories' / 'kit.js').read_text()
    if (post / 'whatif.json').exists():  # WHAT IF price-dot Reel: shared template + the post's data
        scene = 'window.SPEC=' + (post / 'whatif.json').read_text() + ';\n' + (ROOT / 'stories' / 'whatif.js').read_text()
    else:
        scene = (post / 'scene.js').read_text()
    import base64
    mime = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp'}
    imgs = {f.name: f'data:{mime[f.suffix.lower()]};base64,' + base64.b64encode(f.read_bytes()).decode()
            for f in post.iterdir() if f.suffix.lower() in mime}  # post images for the scene (window.IMGS)
    logo = 'data:image/svg+xml;base64,' + base64.b64encode((ROOT / 'assets' / 'symbol.svg').read_bytes()).decode()
    html = f'''<!doctype html><html><head><meta charset="utf-8"><style>html,body{{margin:0;background:#000}}canvas{{display:block}}</style></head>
<body><canvas id="c" width="{W}" height="{H}"></canvas><script>window.HOTCOIN_LOGO="{logo}";window.IMGS={json.dumps(imgs)};</script><script>{kit}</script><script>{scene}</script></body></html>'''
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = b.new_page(viewport={'width': W, 'height': H})
        pg.set_content(html); pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(300)
        pg.wait_for_function("typeof IM === 'undefined' || Object.values(IM).every(i => i.complete)")
        dur = pg.evaluate('window.DURATION'); cues = pg.evaluate('window.CUES'); cover_t = pg.evaluate('window.COVER_T || 6.8')
        n = int(round(dur * FPS))
        for i in range(n):
            pg.evaluate(f'draw({i / FPS})')
            pg.screenshot(path=str(frames / f'{i:04d}.jpg'), type='jpeg', quality=90)
        b.close()
    # contact sheet: one frame per second
    from PIL import Image
    picks = [frames / f'{min(n - 1, int(s * FPS)):04d}.jpg' for s in range(int(dur) + 1)]
    cw, ch = 216, 384; sheet = Image.new('RGB', (cw * 10, ch * ((len(picks) + 9) // 10)))
    for k, f in enumerate(picks): sheet.paste(Image.open(f).resize((cw, ch)), ((k % 10) * cw, (k // 10) * ch))
    sheet.save(out / 'contact.jpg', quality=80)
    if '--frames-only' in sys.argv: return
    # sound: synthesized cues + music bed until the 'cut' cue
    mix = np.zeros(int((dur + 2.5) * SR))
    cut = next((c['t'] for c in cues if c['s'] == 'cut'), dur)
    for c in cues:
        if c['s'] == 'cut': continue
        s = sfx(c['s'], c.get('pitch', 1)); i = int(c['t'] * SR); mix[i:i + len(s)] += s[:len(mix) - i]
    mix = np.clip(mix / max(1, np.abs(mix).max()) * .9, -1, 1)
    wav = out / 'story_sfx.wav'
    with wave.open(str(wav), 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
    mid = sys.argv[sys.argv.index('--music') + 1] if '--music' in sys.argv else subprocess.run([sys.executable, str(ROOT / 'tools' / 'music.py'), 'pick'], capture_output=True, text=True).stdout.strip()
    track = subprocess.run([sys.executable, str(ROOT / 'tools' / 'music.py'), 'get', mid], capture_output=True, text=True, check=True).stdout.split('\n')
    mp4 = out / 'story.mp4'
    fc = (f'[1:a]atrim=0:{cut:.3f},afade=t=in:d=0.6,afade=t=out:st={cut - .08:.3f}:d=0.08,volume=0.55,apad[m];'
          f'[2:a]volume=1.0[s];[m][s]amix=inputs=2:duration=longest:normalize=0,atrim=0:{dur:.3f},afade=t=out:st={dur - .6:.3f}:d=0.6[a]')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(frames / '%04d.jpg'), '-i', track[0], '-i', str(wav),
                    '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', f'{dur:.3f}', str(mp4)], check=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{cover_t:.2f}', '-i', str(mp4), '-frames:v', '1', '-q:v', '2', str(out / 'cover.jpg')], check=True)
    print(mp4.relative_to(ROOT.parent), f'{dur:.1f}s'); print(track[1])


if __name__ == '__main__':
    main()
