"""News carousel v2 (owner, Oct 28): no black background, better fonts, graphic on top, short text under,
rotating layouts so days don't look the same. Used when post.json has "style": "v2" (default for new posts).

Fonts: Archivo (wide, heavy headlines) + Manrope (body), embedded from assets/fonts.
Markup in headline / text: [word] = green highlight block, {word} = red, <g> <r> <u> <b> as in render.py.

Slide kinds (pick a different graphic for slides 2 and 3, and don't repeat yesterday's pair):
  ncover  photo card on top + up to 2 floating stat chips over it, big headline under
  nbars   bar chart on top (2-5 bars, values, optional logos), 1-3 short lines under
  nbig    one giant number on a green card (+ optional sparkline / delta pill), short lines under
  nrows   3-5 glass rows (logo/emoji, label, value) like Hotcoin's X unlock/gainer posts, short lines under
  nphoto  second photo on top with a one-line overlay fact, short lines under
"""
import base64, html as H, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent
GREEN, GREEN_D, RED, INK, PAPER = '#7EC25A', '#3F8A27', '#E5322D', '#0E1A12', '#F2F4EE'


def _font(name):
    return base64.b64encode((ROOT / 'assets' / 'fonts' / name).read_bytes()).decode()


CSS = """
@font-face{font-family:'Archivo';src:url(data:font/ttf;base64,%(arch)s) format('truetype');font-weight:100 900;font-stretch:62%% 125%%}
@font-face{font-family:'Manrope';src:url(data:font/ttf;base64,%(man)s) format('truetype');font-weight:200 800}
.v2{background:%(paper)s;color:%(ink)s;font-family:'Manrope',sans-serif}
.v2:before{content:'';position:absolute;inset:0;background:radial-gradient(900px 600px at 100%% 0%%,rgba(126,194,90,.22),transparent 60%%),radial-gradient(700px 500px at 0%% 100%%,rgba(126,194,90,.14),transparent 60%%)}
.v2 .n2-hd{position:absolute;left:56px;right:56px;top:40px;height:64px;display:flex;align-items:center;justify-content:space-between;z-index:5}
.v2 .n2-brand{display:flex;align-items:center;gap:14px;font-family:'Archivo';font-weight:800;font-stretch:110%%;font-size:34px;letter-spacing:-.01em}
.v2 .n2-brand img{width:46px;height:46px}
.v2 .n2-chip{font-family:'Archivo';font-weight:700;font-stretch:110%%;font-size:22px;letter-spacing:.08em;background:%(ink)s;color:#fff;border-radius:40px;padding:12px 24px}
.v2 .n2-chip b{color:%(green)s;font-weight:800}
.v2 .n2-ft{position:absolute;left:56px;right:56px;bottom:34px;height:50px;display:flex;align-items:center;justify-content:space-between;font-size:22px;font-weight:600;color:#5b665e;z-index:5}
.v2 .n2-ft .n2-sw{display:flex;align-items:center;gap:16px;color:%(ink)s}
.v2 .n2-ft .n2-ar{width:74px;height:30px;border-radius:16px;background:%(green)s;position:relative}
.v2 .n2-ft .n2-ar:after{content:'';position:absolute;right:16px;top:50%%;width:12px;height:12px;border-top:3px solid %(ink)s;border-right:3px solid %(ink)s;transform:translateY(-50%%) rotate(45deg)}
.v2 .n2-ttl{font-family:'Archivo';font-weight:800;font-stretch:112%%;letter-spacing:-.025em;line-height:1.02;color:%(ink)s;text-wrap:balance}
.v2 .n2-hl{background:%(green)s;color:%(ink)s;padding:0 .14em;border-radius:.12em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.v2 .n2-hr{color:%(red)s}
.v2 .n2-g{color:%(green_d)s;font-weight:800}.v2 .n2-r{color:%(red)s;font-weight:800}
.v2 .n2-u{text-decoration:underline;text-decoration-color:%(green)s;text-decoration-thickness:5px;text-underline-offset:8px;font-weight:700}
.v2 .n2-lines{position:absolute;left:64px;right:64px;font-size:38px;line-height:1.36;font-weight:500;color:#26332a;z-index:3}
.v2 .n2-lines p{margin-bottom:22px}
.v2 .n2-src{position:absolute;left:64px;right:64px;bottom:96px;font-size:19px;color:#7a857d;z-index:3}
.v2 .n2-tagc{display:inline-block;font-family:'Archivo';font-weight:800;font-stretch:115%%;font-size:24px;letter-spacing:.1em;padding:10px 20px;border-radius:12px;background:%(green)s;color:%(ink)s}
.v2 .n2-card{position:absolute;left:44px;right:44px;border-radius:44px;background:#fff;box-shadow:0 30px 70px rgba(14,26,18,.12),0 2px 0 rgba(14,26,18,.04);overflow:hidden;z-index:2}
/* cover */
.v2 .n2-cph{position:absolute;left:28px;right:28px;top:124px;height:740px;border-radius:48px;background-size:cover;background-position:center;box-shadow:0 30px 70px rgba(14,26,18,.22);z-index:2}
.v2 .n2-cph:after{content:'';position:absolute;inset:0;border-radius:48px;background:linear-gradient(180deg,transparent 55%%,rgba(0,0,0,.35))}
.v2 .n2-ins{position:absolute;width:150px;height:150px;border-radius:50%%;border:7px solid #fff;background:#fff center/72%% no-repeat;box-shadow:0 14px 40px rgba(0,0,0,.25);z-index:4}
.v2 .n2-sc{position:absolute;z-index:4;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);border-radius:30px;padding:20px 30px 18px;box-shadow:0 18px 40px rgba(0,0,0,.25)}
.v2 .n2-sc .n2-v{font-family:'Archivo';font-weight:800;font-stretch:112%%;font-size:72px;letter-spacing:-.03em;line-height:1}
.v2 .n2-sc .n2-l{font-size:24px;font-weight:700;color:#4a564d;margin-top:6px}
.v2 .n2-ctl{position:absolute;left:58px;right:58px;top:900px;height:330px;display:flex;align-items:center;z-index:3}
/* bars */
.v2 .n2-bars{display:flex;align-items:flex-end;justify-content:space-around;gap:26px;height:100%%;padding:0 40px}
.v2 .n2-bar{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%%}
.v2 .n2-bar .n2-bv{font-family:'Archivo';font-weight:800;font-stretch:110%%;font-size:52px;letter-spacing:-.03em;margin-bottom:12px;white-space:nowrap}
.v2 .n2-bar .n2-bb{width:100%%;max-width:190px;border-radius:22px 22px 8px 8px}
.v2 .n2-bar .n2-bl{font-size:25px;font-weight:700;color:#4a564d;margin-top:14px;text-align:center;line-height:1.2;min-height:60px}
.v2 .n2-bar .n2-lg{width:64px;height:64px;border-radius:50%%;background:#fff center/70%% no-repeat;box-shadow:0 6px 16px rgba(0,0,0,.12);margin-bottom:10px}
/* big number */
.v2 .n2-bigc{position:absolute;left:44px;right:44px;border-radius:48px;overflow:hidden;z-index:2;background:linear-gradient(135deg,#8ED06A 0%%,#5FA83C 55%%,#3F8A27 100%%);box-shadow:0 30px 70px rgba(63,138,39,.35);color:%(ink)s}
.v2 .n2-bigc.n2-neg{background:linear-gradient(135deg,#FF7A6E 0%%,#E5322D 60%%,#B71F1A 100%%);box-shadow:0 30px 70px rgba(229,50,45,.3);color:#fff}
.v2 .n2-bigc .n2-k{position:absolute;left:56px;right:300px;top:50px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:'Archivo';font-weight:800;font-stretch:115%%;font-size:26px;letter-spacing:.12em;opacity:.8}
.v2 .n2-bigc .n2-n{position:absolute;left:50px;right:50px;top:120px;font-family:'Archivo';font-weight:900;font-stretch:118%%;letter-spacing:-.045em;line-height:.95;white-space:nowrap}
.v2 .n2-bigc .n2-lb{position:absolute;left:56px;right:56px;font-size:34px;font-weight:700;line-height:1.25}
.v2 .n2-bigc .n2-dp{position:absolute;right:50px;top:40px;font-family:'Archivo';font-weight:800;font-size:30px;padding:10px 22px;border-radius:30px;background:rgba(255,255,255,.85);color:%(ink)s}
.v2 .n2-bigc svg{position:absolute;left:0;right:0;bottom:0}
/* rows */
.v2 .n2-rows{display:flex;flex-direction:column;gap:18px;padding:34px}
.v2 .n2-row{display:flex;align-items:center;gap:24px;background:%(paper)s;border-radius:28px;padding:20px 30px;border:1px solid rgba(14,26,18,.06)}
.v2 .n2-row .n2-ic{width:76px;height:76px;border-radius:50%%;background:#fff center/68%% no-repeat;box-shadow:0 6px 16px rgba(0,0,0,.1);display:flex;align-items:center;justify-content:center;font-size:42px;flex:none}
.v2 .n2-row .n2-rl{flex:1;font-size:30px;font-weight:700;line-height:1.2}
.v2 .n2-row .n2-rl small{display:block;font-size:22px;font-weight:600;color:#6b766e;margin-top:4px}
.v2 .n2-row .n2-rv{font-family:'Archivo';font-weight:800;font-stretch:110%%;font-size:50px;letter-spacing:-.03em;white-space:nowrap}
/* photo fact */
.v2 .n2-pf{position:absolute;left:44px;right:44px;border-radius:44px;background-size:cover;background-position:center;z-index:2;box-shadow:0 30px 70px rgba(14,26,18,.22);overflow:hidden}
.v2 .n2-pf:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%%,rgba(0,0,0,.78))}
.v2 .n2-pf .n2-ov{position:absolute;left:44px;right:44px;bottom:40px;color:#fff;font-family:'Archivo';font-weight:800;font-stretch:110%%;font-size:54px;line-height:1.05;letter-spacing:-.02em;z-index:2}
"""


def css(green=GREEN):
    return CSS % {'arch': _font('Archivo.ttf'), 'man': _font('Manrope.ttf'), 'paper': PAPER, 'ink': INK,
                  'green': GREEN, 'green_d': GREEN_D, 'red': RED}


def kinds(G):
    uri, inline, SYM = G['uri'], G['inline'], G['SYM']

    def mark(s):
        s = inline(s).replace('class="g"', 'class="n2-g"').replace('class="r"', 'class="n2-r"').replace('class="u"', 'class="n2-u"')
        s = re.sub(r'\[(.+?)\]', r'<span class="n2-hl">\1</span>', s)
        return re.sub(r'\{(.+?)\}', r'<span class="n2-hr">\1</span>', s)

    def frame(s, inner, last=False, swipe='Swipe'):
        date = s.get('_date', '')
        chip = f'<div class="n2-chip">{H.escape(s.get("chip", "NEWS"))}<b> · </b>{H.escape(date)}</div>' if date else f'<div class="n2-chip">{H.escape(s.get("chip", "NEWS"))}</div>'
        sw = '' if last else f'<div class="n2-sw">{swipe}<div class="n2-ar"></div></div>'
        return (f'<div class="slide v2"><div class="n2-hd"><div class="n2-brand"><img src="{G["SYM"]}">Hotcoin</div>{chip}</div>'
                f'{inner}<div class="n2-ft"><div>@hotcoinex</div>{sw}</div></div>')

    def lines(s, top):
        if not s.get('text'):
            return ''
        return (f'<div class="n2-lines fitv2" data-bottom="1240" style="top:{top}px">'
                + ''.join(f'<p>{mark(p)}</p>' for p in s['text']) + '</div>')

    def src(s):  # owner, Oct 29: no source line on the slides; "source" stays in post.json and goes in the caption
        return ''

    def title(s, top, size=58):
        if not s.get('title'):
            return '', top
        tag = f'<div class="n2-tagc">{H.escape(s["tag"])}</div>' if s.get('tag') else ''
        return (f'<div style="position:absolute;left:64px;right:64px;top:{top}px;z-index:3">{tag}'
                f'<div class="n2-ttl" style="font-size:{size}px;margin-top:{18 if tag else 0}px">{mark(s["title"])}</div></div>'), top + (78 if tag else 0) + int(size * 2.04) + 34

    def ncover(s, base):
        ins = ''
        for i, it in enumerate(s.get('insets', [])):
            pos = it.get('pos', ['tr', 'tl'][i % 2])
            xy = {'tr': 'right:56px;top:150px', 'tl': 'left:56px;top:150px', 'br': 'right:56px;top:690px', 'bl': 'left:56px;top:690px'}[pos]
            ins += f'<div class="n2-ins" style="{xy};background-image:url({uri(it["src"], base)});background-color:{it.get("bg", "#fff")}"></div>'
        chips = ''
        for i, c in enumerate(s.get('chips', [])[:2]):
            xy = ['left:60px;top:690px', 'right:60px;top:690px'][i] if len(s.get('chips', [])) > 1 else 'left:60px;top:690px'
            col = RED if c.get('neg') else GREEN_D
            chips += f'<div class="n2-sc" style="{xy}"><div class="n2-v" style="color:{col}">{H.escape(c["v"])}</div><div class="n2-l">{H.escape(c["l"])}</div></div>'
        inner = (f'<div class="n2-cph" style="background-image:url({uri(s["photo"], base)});background-position:{s.get("photo_pos", "center")}"></div>'
                 f'{ins}{chips}<div class="n2-ctl"><div class="n2-ttl fitttl" data-max="{s.get("max", 92)}" style="font-size:{s.get("max", 92)}px">{mark(s["headline"])}</div></div>')
        return frame(s, inner, swipe='Swipe to read')

    def nbars(s, base):
        t, y = title(s, 140)
        items = s['bars']; mx = max(abs(i['v']) for i in items)
        h = s.get('h', 560)
        bars = ''
        for it in items:
            col = it.get('color') or (RED if it.get('neg') else (GREEN if it.get('hi') else '#C9D2C6'))
            lg = f'<div class="n2-lg" style="background-image:url({uri(it["logo"], base)})"></div>' if it.get('logo') else ''
            bh = max(14, int((h - 230) * abs(it['v']) / mx))
            bars += (f'<div class="n2-bar"><div class="n2-bv" style="color:{RED if it.get("neg") else INK}">{H.escape(it["txt"])}</div>'
                     f'<div class="n2-bb" style="height:{bh}px;background:{col}"></div>{lg}<div class="n2-bl">{H.escape(it["l"])}</div></div>')
        inner = f'{t}<div class="n2-card" style="top:{y}px;height:{h}px;padding:40px 0 30px"><div class="n2-bars">{bars}</div></div>{lines(s, y + h + 44)}{src(s)}'
        return frame(s, inner)

    def nbig(s, base):
        t, y = title(s, 140)
        h = s.get('h', 560); neg = ' n2-neg' if s.get('neg') else ''
        spark = ''
        if s.get('spark'):
            v = s['spark']; lo, hi = min(v), max(v); n = len(v)
            pts = ' '.join(f'{i * 992 / (n - 1):.1f},{190 - (x - lo) / ((hi - lo) or 1) * 150:.1f}' for i, x in enumerate(v))
            sc = 'rgba(255,255,255,.9)'
            spark = f'<svg width="992" height="200" viewBox="0 0 992 200"><polyline points="{pts}" fill="none" stroke="{sc}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></svg>'
        dp = f'<div class="n2-dp">{H.escape(s["delta"])}</div>' if s.get('delta') else ''
        size = s.get('size', 230)
        inner = (f'{t}<div class="n2-bigc{neg}" style="top:{y}px;height:{h}px"><div class="n2-k">{H.escape(s.get("kicker", ""))}</div>{dp}'
                 f'<div class="n2-n fitn" style="font-size:{size}px">{H.escape(s["big"])}</div>'
                 f'<div class="n2-lb" style="top:{120 + int(size * .98) + 10}px">{mark(s.get("label", ""))}</div>{spark}</div>'
                 f'{lines(s, y + h + 44)}{src(s)}')
        return frame(s, inner)

    def nrows(s, base):
        t, y = title(s, 140)
        rows = ''
        for r in s['rows']:
            ic = (f'<div class="n2-ic" style="background-image:url({uri(r["logo"], base)})"></div>' if r.get('logo')
                  else f'<div class="n2-ic">{r.get("emoji", "")}</div>')
            sub = f'<small>{H.escape(r["sub"])}</small>' if r.get('sub') else ''
            col = RED if r.get('neg') else (GREEN_D if r.get('pos') else INK)
            rows += f'<div class="n2-row">{ic}<div class="n2-rl">{H.escape(r["l"])}{sub}</div><div class="n2-rv" style="color:{col}">{H.escape(r["v"])}</div></div>'
        inner = f'{t}<div class="n2-card rowsc" style="top:{y}px"><div class="n2-rows">{rows}</div></div><div class="after-rows">{lines(s, 0)}</div>{src(s)}'
        return frame(s, inner)

    def nphoto(s, base):
        t, y = title(s, 140)
        h = s.get('h', 600)
        inner = (f'{t}<div class="n2-pf" style="top:{y}px;height:{h}px;background-image:url({uri(s["photo"], base)});background-position:{s.get("photo_pos", "center")}">'
                 f'<div class="n2-ov">{mark(s.get("overlay", ""))}</div></div>{lines(s, y + h + 44)}{src(s)}')
        return frame(s, inner)

    return {'ncover': ncover, 'nbars': nbars, 'nbig': nbig, 'nrows': nrows, 'nphoto': nphoto}


# Academy / weekly slides keep their layouts but get the v2 fonts when post.json has "style": "v2".
ACADEMY_CSS = """
.slide{font-family:'Manrope',sans-serif}
.thl,.tnum,.ttl,.tch,.wtitle,.wday{font-family:'Archivo' !important;font-stretch:112%;letter-spacing:-.03em !important}
.thl{line-height:1.0 !important}
.tnum{font-size:76px !important;top:132px !important;line-height:1 !important}
.ttl{top:138px !important;left:190px !important;font-size:56px !important}
.vis{bottom:auto !important}
.tsrc{display:none !important}
"""

# Graphic on top for Academy chapter slides: title row, then the chart/visual, then the text under it.
ACADEMY_JS = """
() => {
  const v = document.querySelector('.vis'), t = document.querySelector('.ttl'), b = document.querySelector('.tbody');
  if (!v || !t || !b) return;
  const sl = t.closest('.slide').getBoundingClientRect();
  const top = Math.max(t.getBoundingClientRect().bottom, document.querySelector('.tnum').getBoundingClientRect().bottom) - sl.top + 34;
  v.style.top = top + 'px';
  b.style.top = (v.getBoundingClientRect().bottom - sl.top + 40) + 'px';
  // grow the graphic into the free space (owner: graphics first, not small charts)
  const free = 1190 - (b.getBoundingClientRect().bottom - sl.top);
  const vh = v.getBoundingClientRect().height, z = Math.min(1.7, Math.max(1, (vh + free - 20) / vh));
  if (z > 1.02 && !v.querySelector('svg, .sg')) {  // HTML visuals (stats, tables) scale up; SVG charts are sized in render.py
    v.style.right = 'auto'; v.style.width = (956 / z) + 'px'; v.style.transformOrigin = 'top left'; v.style.transform = `scale(${z})`;
    b.style.top = (top + v.getBoundingClientRect().height + 40) + 'px';
  }
}
"""

KINDS_V2 = {"ncover", "nbars", "nbig", "nrows", "nphoto"}

FIT_JS = """
() => {
  const T = document.querySelector('.fitttl');
  if (T) { let fs = +T.dataset.max; const box = T.parentElement;
    while ((T.scrollHeight > box.clientHeight || T.scrollWidth > box.clientWidth) && fs > 40) { fs -= 2; T.style.fontSize = fs + 'px'; } }
  for (const n of document.querySelectorAll('.fitn')) { let fs = parseFloat(n.style.fontSize);
    while (n.scrollWidth > n.clientWidth && fs > 80) { fs -= 4; n.style.fontSize = fs + 'px'; } }
  const rc = document.querySelector('.rowsc'), ar = document.querySelector('.after-rows .n2-lines');
  if (rc && ar) ar.style.top = (rc.getBoundingClientRect().bottom + 44) + 'px';
  let over = false;
  for (const b of document.querySelectorAll('.fitv2')) { const lim = +b.dataset.bottom; let fs = parseFloat(getComputedStyle(b).fontSize);
    while (b.getBoundingClientRect().bottom > lim && fs > 26) { fs -= 1; b.style.fontSize = fs + 'px'; }
    if (b.getBoundingClientRect().bottom > lim) over = true; }
  return over;
}
"""


# Collision check (owner, Oct 29: "check for collisions"): every v2 slide is scanned after layout; overlapping
# text/graphic boxes, cut-off text and elements off the edge are printed as WARNING lines. Fix them all before publishing.
CHECK_JS = """
() => {
  const sel = ['.n2-brand','.n2-chip','.n2-tagc','.n2-ttl','.n2-lines','.n2-sc','.n2-ins','.n2-k','.n2-dp','.n2-n','.n2-lb',
    '.n2-card','.n2-bigc','.n2-pf','.n2-ov','.n2-ft','.n2-bv','.n2-bl','.n2-rl','.n2-rv',
    '.tch','.thl','.tsub','.thero','.tnum','.ttl','.tbody','.vis','.foot'].join(',');
  const ok = [['n2-sc','n2-cph'],['n2-ins','n2-cph'],['n2-sc','n2-ins']];  // meant to sit on top of each other
  const els = [...document.querySelectorAll(sel)].filter(e => { const r = e.getBoundingClientRect(), c = getComputedStyle(e);
    return r.width > 2 && r.height > 2 && c.visibility !== 'hidden' && c.display !== 'none'; });
  const name = e => (e.className.baseVal ?? e.className).split(' ')[0];
  const out = [];
  for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
    const a = els[i], b = els[j];
    if (a.contains(b) || b.contains(a)) continue;
    if (ok.some(([x, y]) => [name(a), name(b)].includes(x) && [name(a), name(b)].includes(y))) continue;
    const r = a.getBoundingClientRect(), q = b.getBoundingClientRect();
    const w = Math.min(r.right, q.right) - Math.max(r.left, q.left), h = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top);
    if (w > 4 && h > 4) out.push(`${name(a)} overlaps ${name(b)} (${Math.round(w)}x${Math.round(h)}px)`);
  }
  for (const e of document.querySelectorAll('.n2-k,.n2-n,.n2-bv,.n2-rv,.n2-v,.n2-dp,.n2-chip,.n2-tagc'))
    if (e.scrollWidth > e.clientWidth + 2) out.push(`${name(e)} text is cut off ("${e.textContent.trim().slice(0, 30)}")`);
  for (const e of els.filter(e => !['thero', 'n2-ins'].includes(name(e)))) {
    const r = e.getBoundingClientRect(); if (r.right > 1082 || r.left < -2) out.push(`${name(e)} runs off the slide edge`); }
  return out;
}
"""
