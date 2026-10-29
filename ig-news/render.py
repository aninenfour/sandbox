#!/usr/bin/env python3
"""Render a Hotcoin IG carousel from posts/<id>/post.json into media/<id>/NN.jpg (4:5, rendered at 2x = 2160x2700).

Usage: python3 ig-news/render.py posts/2026-10-16-usdc-eba
Also writes media/<id>/story.jpg (1080x1920 Instagram Story announcing the post).
Slide kinds: ncover, nbars, nbig, nrows, nphoto (news v2, see news2.py) · cover, text, end (old news) · tcover, tslide (tutorial) · wcover, wday (weekly).
Inline markup in "html" fields: <g>green</g> <r>red</r> <u>underlined</u> <b>bold</b> <q>quote</q>.
"""
import json, sys, pathlib, base64, mimetypes, html as H
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent
W, HGT = 1080, 1350
GREEN, RED, INK, PAPER = '#7EC25A', '#E5322D', '#0A0A0A', '#FFFFFF'


def uri(path, base):
    p = (base / path) if not str(path).startswith('/') else pathlib.Path(path)
    if not p.exists():
        p = ROOT / 'assets' / path
    mt = mimetypes.guess_type(str(p))[0] or 'image/png'
    if p.suffix == '.svg':
        mt = 'image/svg+xml'
    return f"data:{mt};base64,{base64.b64encode(p.read_bytes()).decode()}"


def inline(s):
    tags = {'<g>': '<span class="g">', '</g>': '</span>', '<r>': '<span class="r">', '</r>': '</span>',
            '<u>': '<span class="u">', '</u>': '</span>', '<q>': '<div class="q">', '</q>': '</div>',
            '<y>': '<span class="y">', '</y>': '</span>'}
    for k, v in tags.items():
        s = s.replace(k, v)
    return s


CSS = """
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;overflow:hidden;background:#000}
body{font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;color:#fff}
.slide{position:relative;width:1080px;height:1350px;overflow:hidden}
.g{color:%(g)s}.r{color:%(r)s}.y{color:#F5C542}
.u{text-decoration:underline;text-decoration-color:%(g)s;text-decoration-thickness:4px;text-underline-offset:10px}
.q{font-weight:700;margin-top:6px}
.foot{position:absolute;left:0;right:0;bottom:0;height:102px;display:flex;align-items:center;justify-content:space-between;padding:0 92px 0 92px;font-size:22px;color:#cfd3d6;letter-spacing:.01em}
.foot .sym{position:absolute;left:50%%;top:50%%;transform:translate(-50%%,-50%%);width:44px;height:44px}
.foot .sw{display:flex;align-items:center;gap:22px}
.pill{width:84px;height:30px;border:2.5px solid #fff;border-radius:16px;position:relative}
.pill:after{content:'';position:absolute;right:12px;top:50%%;width:34px;height:2.5px;background:#fff;transform:translateY(-50%%)}
.pill:before{content:'';position:absolute;right:12px;top:50%%;width:11px;height:11px;border-top:2.5px solid #fff;border-right:2.5px solid #fff;transform:translateY(-50%%) rotate(45deg)}
/* cover */
.ph{position:absolute;left:0;top:0;width:1080px;height:853px;background-size:cover;background-repeat:no-repeat}
.ph:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 70%%,rgba(0,0,0,.25))}
.inset{position:absolute;border-radius:50%%;border:6px solid #fff;background-size:cover;background-position:center;box-shadow:0 10px 40px rgba(0,0,0,.45);z-index:2}
.tag{position:absolute;left:0;top:776px;height:77px;padding:0 64px 0 40px;background:%(g)s;color:#111;font-size:34px;font-weight:500;display:flex;align-items:center;clip-path:polygon(0 0,88%% 0,100%% 100%%,0 100%%);z-index:3}
.panel{position:absolute;left:0;top:853px;width:1080px;height:395px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 54px}
.hl{font-family:'Inter Display','Inter',sans-serif;font-weight:800;letter-spacing:-.035em;line-height:1.02;text-transform:uppercase;white-space:nowrap;text-align:center;color:#111}
.cover .foot{background:#16191c;height:102px}
/* text slide */
.txt{background:#000}
.lbl{position:absolute;left:62px;top:150px;background:%(g)s;color:#111;font-size:30px;font-weight:500;padding:8px 92px 8px 92px;letter-spacing:.01em}
.body{position:absolute;left:62px;right:70px;top:240px;font-size:40px;line-height:1.38;font-weight:400;z-index:2}
.body p{margin-bottom:34px}
.deco{position:absolute;right:-330px;top:330px;width:760px;height:760px;border-radius:50%%;background-size:cover;background-position:center;opacity:.18;z-index:1}
.dphoto{position:absolute;right:0;top:0;width:430px;height:430px;background-size:cover;background-position:center;filter:grayscale(1) contrast(1.05);z-index:1;border-bottom-left-radius:60px;-webkit-mask-image:linear-gradient(200deg,#000 55%%,transparent 100%%)}
.card{position:absolute;left:62px;right:42px;bottom:190px;border-radius:30px;overflow:hidden;background-size:cover;background-position:center;z-index:2;border:1px solid #333}
.stats{position:absolute;left:62px;right:62px;bottom:170px;display:grid;gap:22px;z-index:2}
.stat{background:#121416;border:1px solid #2a2e31;border-radius:26px;padding:30px 30px 28px}
.stat .v{font-family:'Inter Display';font-weight:800;font-size:64px;letter-spacing:-.03em;color:%(g)s;line-height:1}
.stat .l{font-size:25px;color:#bfc4c8;margin-top:14px;line-height:1.3}
.src{position:absolute;left:62px;bottom:120px;font-size:19px;color:#6d7378;z-index:3}
/* end card */
.end{background:radial-gradient(1200px 900px at 10%% 5%%,#4f8a2a 0%%,rgba(79,138,42,0) 60%%),radial-gradient(900px 900px at 95%% 20%%,#e8d9b5 0%%,rgba(232,217,181,0) 60%%),radial-gradient(900px 800px at 80%% 95%%,#f1f1f0 0%%,rgba(241,241,240,0) 60%%),radial-gradient(900px 700px at 60%% 85%%,#e7967a 0%%,rgba(231,150,122,0) 55%%),radial-gradient(800px 800px at 0%% 100%%,#1d1407 0%%,rgba(29,20,7,0) 60%%),#8a8670}
.end:before{content:'';position:absolute;inset:0;background:url(GRAIN) ;opacity:.12;mix-blend-mode:overlay}
.ecard{position:absolute;left:58px;right:58px;top:430px;height:490px;border-radius:44px;background:rgba(110,110,110,.55);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.18);box-shadow:0 30px 80px rgba(0,0,0,.18)}
.ecard .lg{position:absolute;left:80px;top:72px;width:200px;height:200px;border-radius:50%%;background:%(g)s;border:6px solid #fff;display:flex;align-items:center;justify-content:center}
.ecard .lg img{width:118px;height:118px;filter:brightness(0) invert(1)}
.ecard .nm{position:absolute;left:320px;top:84px;font-size:46px;font-weight:700;letter-spacing:-.03em}
.ecard .tl{position:absolute;left:320px;top:160px;font-size:30px;line-height:1.45;color:#f2f2f2}
.ecard .tg{position:absolute;left:72px;top:318px;font-size:40px;font-weight:700;letter-spacing:-.03em}
.ecard .fs{position:absolute;left:72px;top:368px;font-size:32px;font-style:italic;color:#d7d9ff}
.ecard .bl{position:absolute;left:560px;top:318px;font-size:29px;line-height:1.55;color:#f3f3f3}
.ecard .rg{position:absolute;left:0;right:0;top:428px;text-align:center;font-size:28px;color:#fff}
"""


def foot(swipe='Swipe to read full', last=False):
    right = '' if last else f'<div class="sw">{swipe}<div class="pill"></div></div>'
    return f'<div class="foot"><div>@hotcoinex</div><img class="sym" src="{SYM}">{right}</div>'


def inset_html(i, base):
    size = i.get('size', 270)
    pos = {'tl': (f'left:{-size*0.08:.0f}px', f'top:{185}px'), 'tr': (f'right:{-size*0.06:.0f}px', 'top:55px'),
           'l': ('left:-20px', 'top:240px'), 'r': ('right:-20px', 'top:60px'),
           'bl': ('left:40px', 'top:470px'), 'br': ('right:40px', 'top:470px')}[i.get('pos', 'r')]
    style = f"width:{size}px;height:{size}px;{pos[0]};{pos[1]};background-image:url({uri(i['src'], base)});"
    if i.get('bg'):
        style += f"background-color:{i['bg']};background-size:{i.get('fit','78%')};background-repeat:no-repeat;"
    if i.get('img_pos'):
        style += f"background-position:{i['img_pos']};"
    return f'<div class="inset" style="{style}"></div>'


def s_cover(s, base):
    lines = ''.join(
        f'<div class="hl fit" data-max="{l.get("max", 92)}" style="color:{ {"ink":"#111","green":GREEN,"red":RED}[l.get("c","ink")] }">{H.escape(l["t"])}</div>'
        for l in s['headline'])
    insets = ''.join(inset_html(i, base) for i in s.get('insets', []))
    return f'''<div class="slide cover"><div class="ph" style="background-image:url({uri(s['photo'], base)});background-position:{s.get('photo_pos','center')};background-size:{s.get('photo_size','cover')}"></div>
{insets}<div class="tag">{s.get('tag','Hotcoin News')}</div><div class="panel">{lines}</div>{foot()}</div>'''


def s_text(s, base):
    out = [f'<div class="slide txt">']
    if s.get('deco'):
        bg = f"background-color:{s.get('deco_bg','transparent')};"
        out.append(f'<div class="deco" style="background-image:url({uri(s["deco"], base)});{bg}background-size:{s.get("deco_fit","cover")};background-repeat:no-repeat"></div>')
    if s.get('photo'):
        out.append(f'<div class="dphoto" style="background-image:url({uri(s["photo"], base)});background-position:{s.get("photo_pos","center")};background-size:{s.get("photo_size","cover")}"></div>')
    out.append(f'<div class="lbl">{H.escape(s.get("tag",""))}</div>')
    body_style = f"font-size:{s.get('size',40)}px;"
    if s.get('body_top'):
        body_style += f"top:{s['body_top']}px;"
    if s.get('body_right'):
        body_style += f"right:{s['body_right']}px;"
    out.append(f'<div class="body fitbody" data-bottom="{s.get("body_bottom", 1180)}" style="{body_style}">' + ''.join(f'<p>{inline(p)}</p>' for p in s['paras']) + '</div>')
    m = s.get('media')
    if m and m['type'] == 'image':
        out.append(f'<div class="card" style="height:{m.get("h",320)}px;background-image:url({uri(m["src"], base)});background-position:{m.get("pos","center")}"></div>')
    if m and m['type'] == 'stats':
        cols = len(m['items'])
        out.append(f'<div class="stats" style="grid-template-columns:repeat({cols},1fr)">' + ''.join(
            f'<div class="stat"><div class="v"{" style=\'color:" + RED + "\'" if i.get("neg") else ""}>{H.escape(i["v"])}</div><div class="l">{H.escape(i["l"])}</div></div>' for i in m['items']) + '</div>')
    if s.get('source'):
        out.append(f'<div class="src">Source: {H.escape(s["source"])}</div>')
    out.append(foot('Swipe') + '</div>')
    return ''.join(out)


def s_end(s, base):
    return f'''<div class="slide end"><div class="ecard"><div class="lg"><img src="{SYM}"></div>
<div class="nm">HOTCOIN EXCHANGE</div><div class="tl">Daily crypto &amp; TradFi news<br>Follow <b>@hotcoinex</b></div>
<div class="tg">Your Trades, Our Priority</div><div class="fs">Financial service</div>
<div class="bl">• Follow the market rhythm<br>• Trade Anywhere</div>
<div class="rg">Register Here: www.hotcoin.com</div></div></div>'''


FIT_JS = """
() => {
  for (const el of document.querySelectorAll('.fit')) {
    const max = +el.dataset.max; let fs = max; el.style.fontSize = fs + 'px';
    const avail = el.parentElement.clientWidth - 100;
    while (el.scrollWidth > avail && fs > 30) { fs -= 1; el.style.fontSize = fs + 'px'; }
  }
  const panel = document.querySelector('.panel');
  if (panel) { const lines=[...panel.querySelectorAll('.fit')]; let k = 0;
    const tot = () => lines.reduce((a, l) => a + l.getBoundingClientRect().height, 0);
    while (tot() > panel.clientHeight - 44 && k++ < 40) lines.forEach(l => l.style.fontSize = (parseFloat(l.style.fontSize)*0.98)+'px'); }
  for (const b of document.querySelectorAll('.fitbody')) {
    const lim = +b.dataset.bottom; let fs = parseFloat(getComputedStyle(b).fontSize);
    const blockers = [...document.querySelectorAll('.card,.stats,.vis,.wev')].filter(e => e.getBoundingClientRect().top > b.getBoundingClientRect().top).map(e => e.getBoundingClientRect().top - 30);
    const bottom = Math.min(lim, ...blockers);
    while (b.getBoundingClientRect().bottom > bottom && fs > 24) { fs -= 1; b.style.fontSize = fs + 'px'; }
  }
  for (const el of document.querySelectorAll('[data-maxh]')) {
    let fs = parseFloat(getComputedStyle(el).fontSize);
    while (el.offsetHeight > +el.dataset.maxh && fs > 40) { fs -= 2; el.style.fontSize = fs + 'px'; }
  }
  for (const sub of document.querySelectorAll('.tsub[data-auto]')) {  // tutorial cover: sit under the title, stay clear of the hero circle
    const slide = sub.closest('.slide').getBoundingClientRect(), t = sub.parentElement.querySelector('.thl'), hero = sub.parentElement.querySelector('.thero');
    sub.style.top = (t.getBoundingClientRect().bottom - slide.top + 28) + 'px';
    const lim = hero ? hero.getBoundingClientRect().top - 24 : 1100; let fs = parseFloat(getComputedStyle(sub).fontSize);
    while (sub.getBoundingClientRect().bottom > lim && fs > 26) { fs -= 1; sub.style.fontSize = fs + 'px'; }
  }
  const over = [...document.querySelectorAll('.fitbody')].some(b => b.getBoundingClientRect().bottom > 1250);
  return over;
}
"""

KINDS = {'cover': s_cover, 'text': s_text, 'end': s_end}


def main():
    global SYM, CSS
    post_dir = pathlib.Path(sys.argv[1]).resolve()
    spec = json.loads((post_dir / 'post.json').read_text())
    SYM = uri('symbol.svg', ROOT / 'assets')
    grain = ROOT.parent / 'hotcoin-tradfi/public/grain.png'
    css = (CSS % {'g': GREEN, 'r': RED}).replace('GRAIN', uri(str(grain), ROOT) if grain.exists() else '')
    try:
        import extra_templates  # tutorial / weekly kinds
        KINDS.update(extra_templates.kinds(globals()))
        css += extra_templates.CSS
    except ImportError:
        pass
    import news2  # v2 news layouts (owner, Oct 28): light, graphic-first, Archivo + Manrope
    KINDS.update(news2.kinds(globals()))
    css += news2.css()
    if spec.get('style') == 'v2':
        css += news2.ACADEMY_CSS
    import cta  # CTA end card + Story frame
    KINDS['end'] = cta.s_end(globals())
    css += cta.CSS.replace('GRAIN', uri(str(grain), ROOT) if grain.exists() else '')
    out = ROOT / 'media' / post_dir.name
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob('*.jpg'):
        old.unlink()
    files = []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = b.new_page(viewport={'width': W, 'height': HGT}, device_scale_factor=2)  # 2160x2700 output: sharp text on zoom
        for n, s in enumerate(spec['slides'], 1):
            s.setdefault('_date', spec.get('date', ''))
            if spec.get('style') == 'v2' and s['kind'] == 'tslide' and s.get('visual'):  # bigger charts (graphic first)
                v = s['visual']; v.setdefault('fs', 1.4)
                if v['type'] == 'line': v['h'] = max(v.get('h', 300), 470)
                if v['type'] == 'bars': v['row'] = max(v.get('row', 64), 150 if len(v['items']) <= 3 else (96 if len(v['items']) <= 6 else 64))
            body = KINDS[s['kind']](s, post_dir)
            pg.set_content(f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body>{body}</body></html>')
            pg.wait_for_load_state('networkidle')
            pg.evaluate('document.fonts.ready')
            if spec.get('style') == 'v2' and s['kind'] == 'tslide':
                pg.evaluate(news2.ACADEMY_JS)
            if s['kind'] in news2.KINDS_V2 and pg.evaluate(news2.FIT_JS):
                print(f'WARNING slide {n}: text runs past the bottom — shorten copy', file=sys.stderr)
            if pg.evaluate(FIT_JS):
                print(f'WARNING slide {n}: body text overflows into footer — shorten copy', file=sys.stderr)
            if spec.get('style') == 'v2':
                for w in pg.evaluate(news2.CHECK_JS):
                    print(f'WARNING slide {n} collision: {w}', file=sys.stderr)
            f = out / f'{n:02d}.jpg'
            pg.screenshot(path=str(f), type='jpeg', quality=95)
            files.append(f)
        story = out / 'story.jpg'
        cta.render_story(pg, css, files[0], story, globals(), spec.get('type', 'news'))
        files.append(story)
        b.close()
    print('\n'.join(str(f.relative_to(ROOT.parent)) for f in files))


if __name__ == '__main__':
    sys.path.insert(0, str(ROOT))
    main()
