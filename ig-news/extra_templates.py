"""Tutorial ("Hotcoin Academy" deep dive) and weekly-preview slide kinds for render.py.

Tutorial kinds: tcover, tslide  — light paper style, numbered chapters, data visuals.
Weekly kinds:   wcover, wday    — full-bleed photo / gradient, big date titles, event lists.
Visual blocks for tslide "visual": line, bars, donut, table, timeline, stats, image.
"""
import html as H, math

GREEN, RED, INK, PAPER = '#7EC25A', '#E5322D', '#0E1012', '#F3F2EC'
DGREEN = '#3E8E1E'

CSS = """
.paper{background:#F3F2EC;color:#0E1012}
.paper .foot{color:#4a4f54}
.paper .pill,.paper .pill:after,.paper .pill:before{border-color:#0E1012}
.paper .pill:after{background:#0E1012}
.acad{position:absolute;left:62px;top:70px;display:flex;gap:14px;align-items:center;font-size:24px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.acad .dot{width:14px;height:14px;border-radius:50%;background:#7EC25A}
.acad .chip{border:2px solid #0E1012;border-radius:40px;padding:6px 18px;font-size:21px}
.tch{position:absolute;right:62px;top:62px;font-family:'Inter Display';font-weight:800;font-size:30px;color:#9aa0a5}
.thl{position:absolute;left:62px;right:62px;top:150px;font-family:'Inter Display';font-weight:800;letter-spacing:-.045em;line-height:.95;font-size:118px}
.thl .g{color:#3E8E1E}.thl .hl2{background:#7EC25A;color:#0E1012;padding:0 14px;border-radius:12px}
.tsub{position:absolute;left:62px;right:300px;font-size:34px;line-height:1.4;color:#3b4045}
.thero{position:absolute;right:-60px;bottom:120px;width:640px;height:640px;border-radius:50%;background-size:cover;background-position:center;border:10px solid #fff;box-shadow:0 30px 80px rgba(0,0,0,.18)}
.tlist{position:absolute;left:62px;bottom:150px;font-size:27px;line-height:1.75;color:#2a2e32;z-index:2}
.tlist b{color:#3E8E1E;font-family:'Inter Display';margin-right:12px}
.tnum{position:absolute;left:62px;top:140px;font-family:'Inter Display';font-weight:800;font-size:150px;line-height:.8;color:#7EC25A;letter-spacing:-.05em}
.ttl{position:absolute;left:62px;right:62px;top:280px;font-family:'Inter Display';font-weight:800;font-size:62px;letter-spacing:-.035em;line-height:1.02}
.tbody{position:absolute;left:62px;right:62px;font-size:34px;line-height:1.42;color:#24282c}
.tbody p{margin-bottom:22px}
.tbody .g{color:#3E8E1E;font-weight:600}.tbody .r{color:#D0302B;font-weight:600}
.vis{position:absolute;left:62px;right:62px;bottom:150px;background:#fff;border-radius:30px;padding:34px 36px;box-shadow:0 12px 40px rgba(0,0,0,.07)}
.vis h4{font-size:24px;font-weight:600;color:#6b7176;text-transform:uppercase;letter-spacing:.06em;margin-bottom:18px}
.vis table{width:100%;border-collapse:collapse;font-size:27px}
.vis td,.vis th{padding:14px 10px;border-bottom:1px solid #e7e7e2;text-align:left}
.vis th{font-size:21px;color:#7b8186;text-transform:uppercase;letter-spacing:.05em;font-weight:600}
.vis td.n{text-align:right;font-variant-numeric:tabular-nums;font-weight:600}
.tsrc{position:absolute;left:62px;bottom:112px;font-size:18px;color:#8c9196}
.tl{display:flex;flex-direction:column;gap:0}
.tl .it{display:grid;grid-template-columns:150px 30px 1fr;align-items:start;min-height:84px}
.tl .y{font-family:'Inter Display';font-weight:800;font-size:34px;color:#3E8E1E}
.tl .ln{position:relative;height:100%}.tl .ln:before{content:'';position:absolute;left:8px;top:0;bottom:0;width:3px;background:#dcdcd5}
.tl .ln:after{content:'';position:absolute;left:1px;top:12px;width:17px;height:17px;border-radius:50%;background:#7EC25A}
.tl .tx{font-size:27px;line-height:1.35;padding-bottom:18px;color:#24282c}
.sg{display:grid;gap:18px}
.sg .c{background:#F3F2EC;border-radius:22px;padding:24px}
.sg .v{font-family:'Inter Display';font-weight:800;font-size:56px;letter-spacing:-.03em;line-height:1}
.sg .l{font-size:22px;color:#5d6368;margin-top:10px;line-height:1.3}
/* weekly */
.wk{background:#111}
.wph{position:absolute;inset:0;background-size:cover;background-position:center}
.wph.bw{filter:grayscale(1) contrast(1.1)}
.wgrad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05) 35%,rgba(0,0,0,.78) 100%)}
.wlogo{position:absolute;left:50%;top:60px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;font-size:20px;letter-spacing:.2em;font-weight:600}
.wlogo img{width:64px;height:64px}
.wtitle{position:absolute;left:66px;bottom:250px;font-family:'Inter Display';font-weight:900;font-size:150px;line-height:.9;letter-spacing:-.02em;text-transform:uppercase;color:#fff;transform:scaleX(1.12);transform-origin:left}
.wrange{position:absolute;left:70px;bottom:170px;font-size:34px;font-weight:500;color:#e8e8e8}
.wday{position:absolute;left:62px;top:56px;font-family:'Inter Display';font-weight:700;font-size:80px;line-height:1;letter-spacing:.01em;color:#fff;transform:scaleX(1.12);transform-origin:left}
.wcard{position:absolute;left:150px;right:150px;top:300px;height:600px;border-radius:40px;background-size:cover;background-position:center;box-shadow:0 30px 80px rgba(0,0,0,.3)}
.wev{position:absolute;left:62px;right:62px;bottom:150px;display:flex;flex-direction:column;gap:20px}
.wev .e{display:flex;align-items:center;gap:18px;font-size:42px;text-shadow:0 2px 12px rgba(0,0,0,.35);font-weight:500;color:#fff;flex-wrap:wrap}
.wev .t{font-size:26px;color:#ffffffcc}
.wev .b{font-size:18px;font-weight:700;letter-spacing:.06em;border:2px solid #fff;border-radius:6px;padding:5px 12px;background:#0006}
.wev .b.hi{background:#E5322D;border-color:#E5322D}.wev .b.gr{background:#7EC25A;border-color:#7EC25A;color:#111}
.wk .foot{text-shadow:0 1px 8px rgba(0,0,0,.4);color:#fff}
.grain:after{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.06) 1px,transparent 1px);background-size:4px 4px;mix-blend-mode:overlay;pointer-events:none}
"""


def _esc(s):
    return H.escape(str(s))


def svg_line(v):
    """v: {series:[numbers], labels:[first,last] or [...], title, unit, color}"""
    ys = v['series']; n = len(ys); w, h = 880, v.get('h', 300)
    lo, hi = min(ys), max(ys); pad = (hi - lo) * 0.08 or 1; lo -= pad; hi += pad
    X = lambda i: 10 + i * (w - 190) / (n - 1)
    Y = lambda y: 20 + (hi - y) / (hi - lo) * (h - 60)
    pts = ' '.join(f'{X(i):.1f},{Y(y):.1f}' for i, y in enumerate(ys))
    col = v.get('color', GREEN if ys[-1] >= ys[0] else RED)
    area = f'M{X(0):.1f},{h-40} L' + ' L'.join(f'{X(i):.1f},{Y(y):.1f}' for i, y in enumerate(ys)) + f' L{X(n-1):.1f},{h-40} Z'
    grid = ''.join(f'<line x1="10" x2="{w-180}" y1="{20+k*(h-60)/3:.0f}" y2="{20+k*(h-60)/3:.0f}" stroke="#ecece6" stroke-width="2"/>' for k in range(4))
    fmt = v.get('fmt', '{:,.0f}')
    lab = ''.join(f'<text x="{X(int(i*(n-1)/(len(v.get("labels",[]))-1 or 1))):.0f}" y="{h-6}" font-size="21" fill="#8a9095" text-anchor="{'start' if i==0 else ('end' if i==len(v.get('labels',[]))-1 else 'middle')}">{_esc(l)}</text>' for i, l in enumerate(v.get('labels', [])))
    marks = ''
    for m in v.get('marks', []):  # {i, text}
        marks += f'<circle cx="{X(m["i"]):.0f}" cy="{Y(ys[m["i"]]):.0f}" r="9" fill="#0E1012"/><text x="{X(m["i"]):.0f}" y="{Y(ys[m["i"]])-20:.0f}" font-size="22" font-weight="700" text-anchor="middle" fill="#0E1012">{_esc(m["text"])}</text>'
    return f'''<svg width="100%" viewBox="0 0 {w} {h}"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{col}" stop-opacity=".35"/><stop offset="1" stop-color="{col}" stop-opacity="0"/></linearGradient></defs>
{grid}<path d="{area}" fill="url(#ga)"/><polyline points="{pts}" fill="none" stroke="{col}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="{X(n-1):.1f}" cy="{Y(ys[-1]):.1f}" r="10" fill="{col}"/><text x="{X(n-1)+18:.0f}" y="{Y(ys[-1])+9:.0f}" font-size="28" font-weight="800" fill="#0E1012">{_esc(v.get("last_label", fmt.format(ys[-1])))}</text>
{'' if abs(Y(ys[-1]) - Y(hi-pad)) < 44 else f'<text x="{w-100}" y="{Y(hi-pad)+8:.0f}" font-size="20" fill="#8a9095">{_esc(fmt.format(hi-pad))}</text>'}<text x="{w-100}" y="{Y(lo+pad)+8:.0f}" font-size="20" fill="#8a9095">{_esc(fmt.format(lo+pad))}</text>{marks}{lab}</svg>'''


def svg_bars(v):
    """v: {items:[{l, v, txt?}]} horizontal bars; negatives drawn red."""
    it = v['items']; w = 880; rh = v.get('row', 64); h = rh * len(it)
    m = max(abs(i['v']) for i in it) or 1; neg = any(i['v'] < 0 for i in it)
    x0 = 300 + (230 if neg else 0); span = (w - x0 - 140) if not neg else 230
    out = []
    for k, i in enumerate(it):
        y = k * rh; bw = abs(i['v']) / m * span; col = GREEN if i['v'] >= 0 else RED
        x = x0 if i['v'] >= 0 else x0 - bw
        out.append(f'<text x="0" y="{y+rh/2+9:.0f}" font-size="27" font-weight="600" fill="#0E1012">{_esc(i["l"])}</text>'
                   f'<rect x="{x:.0f}" y="{y+12}" width="{max(bw,4):.0f}" height="{rh-24}" rx="8" fill="{col}"/>'
                   f'<text x="{(x0+bw+14) if i["v"]>=0 else (x0+14):.0f}" y="{y+rh/2+9:.0f}" font-size="25" font-weight="700" fill="{"#0E1012" if i["v"]>=0 else RED}">{_esc(i.get("txt", i["v"]))}</text>')
    axis = f'<line x1="{x0}" x2="{x0}" y1="0" y2="{h}" stroke="#cfcfc8" stroke-width="2"/>' if neg else ''
    return f'<svg width="100%" viewBox="0 0 {w} {h}">{axis}{"".join(out)}</svg>'


def svg_donut(v):
    it = v['items']; tot = sum(i['v'] for i in it); cols = v.get('colors', [GREEN, '#0E1012', '#F5C542', '#4C7DF0', '#E5322D', '#9AA0A5'])
    R, r, cx, cy = 150, 92, 170, 170; a = -math.pi / 2; segs = []
    for k, i in enumerate(it):
        b = a + 2 * math.pi * i['v'] / tot; large = 1 if b - a > math.pi else 0
        p = lambda ang, rad: (cx + rad * math.cos(ang), cy + rad * math.sin(ang))
        (x1, y1), (x2, y2), (x3, y3), (x4, y4) = p(a, R), p(b, R), p(b, r), p(a, r)
        segs.append(f'<path d="M{x1:.1f},{y1:.1f} A{R},{R} 0 {large} 1 {x2:.1f},{y2:.1f} L{x3:.1f},{y3:.1f} A{r},{r} 0 {large} 0 {x4:.1f},{y4:.1f} Z" fill="{cols[k%len(cols)]}" stroke="#fff" stroke-width="4"/>')
        a = b
    leg = ''.join(f'<rect x="400" y="{40+k*58}" width="26" height="26" rx="6" fill="{cols[k%len(cols)]}"/><text x="440" y="{62+k*58}" font-size="27" fill="#0E1012">{_esc(i["l"])} <tspan font-weight="800">{_esc(i.get("txt", i["v"]))}</tspan></text>' for k, i in enumerate(it))
    center = f'<text x="{cx}" y="{cy+12}" font-size="34" font-weight="800" text-anchor="middle">{_esc(v.get("center",""))}</text>'
    return f'<svg width="100%" viewBox="0 0 880 {max(340, 60+58*len(it))}">{"".join(segs)}{center}{leg}</svg>'


def vis_html(v, g, base):
    t = v['type']; title = f'<h4>{_esc(v["title"])}</h4>' if v.get('title') else ''
    if t == 'line':
        inner = svg_line(v)
    elif t == 'bars':
        inner = svg_bars(v)
    elif t == 'donut':
        inner = svg_donut(v)
    elif t == 'table':
        head = ''.join(f'<th>{_esc(c)}</th>' for c in v['cols'])
        rows = ''.join('<tr>' + ''.join(f'<td class="{"n" if j else ""}">{g["inline"](str(c))}</td>' for j, c in enumerate(r)) + '</tr>' for r in v['rows'])
        inner = f'<table><tr>{head}</tr>{rows}</table>'
    elif t == 'timeline':
        inner = '<div class="tl">' + ''.join(f'<div class="it"><div class="y">{_esc(i["y"])}</div><div class="ln"></div><div class="tx">{g["inline"](i["t"])}</div></div>' for i in v['items']) + '</div>'
    elif t == 'stats':
        inner = f'<div class="sg" style="grid-template-columns:repeat({v.get("cols", len(v["items"]))},1fr)">' + ''.join(
            f'<div class="c"><div class="v" style="color:{i.get("color", INK)}">{_esc(i["v"])}</div><div class="l">{_esc(i["l"])}</div></div>' for i in v['items']) + '</div>'
    elif t == 'image':
        return f'<div class="vis" style="padding:0;height:{v.get("h",420)}px;background:url({g["uri"](v["src"], base)}) {v.get("pos","center")}/cover"></div>'
    return f'<div class="vis">{title}{inner}</div>'


def kinds(g):
    uri, foot, inline = g['uri'], g['foot'], g['inline']
    sym_dark = uri('symbol-dark.svg', g['ROOT'] / 'assets')

    def pfoot(sw='Swipe'):
        return foot(sw).replace(g['SYM'], sym_dark)

    def tcover(s, base):
        hero = f'<div class="thero" style="background-image:url({uri(s["hero"], base)});background-position:{s.get("hero_pos","center")};{("background-color:"+s["hero_bg"]+";background-size:"+s.get("hero_fit","70%")+";background-repeat:no-repeat") if s.get("hero_bg") else ""}"></div>' if s.get('hero') else ''
        lst = '<div class="tlist">' + ''.join(f'<div><b>{k+1:02d}</b>{_esc(t)}</div>' for k, t in enumerate(s.get('chapters', []))) + '</div>' if s.get('chapters') else ''
        return f'''<div class="slide paper">{hero}<div class="acad"><span class="dot"></span>Hotcoin Academy<span class="chip">{_esc(s.get("chip","Deep Dive"))}</span></div>
<div class="thl" data-maxh="{s.get('title_h',390)}">{inline(s["title"])}</div><div class="tsub" {f'style="top:{s["sub_top"]}px"' if s.get("sub_top") else 'data-auto="1"'}>{inline(s.get("sub",""))}</div>{lst}{pfoot("Swipe to learn")}</div>'''

    def tslide(s, base):
        vis = vis_html(s['visual'], g, base) if s.get('visual') else ''
        src = f'<div class="tsrc">Source: {_esc(s["source"])}</div>' if s.get('source') else ''
        top = s.get('body_top', 400)
        return f'''<div class="slide paper"><div class="acad"><span class="dot"></span>Hotcoin Academy</div><div class="tch">{_esc(s.get("of",""))}</div>
<div class="tnum">{_esc(s.get("num",""))}</div><div class="ttl">{inline(s["title"])}</div>
<div class="tbody fitbody" data-bottom="{s.get("body_bottom",1180)}" style="top:{top}px;font-size:{s.get("size",34)}px">{"".join(f"<p>{inline(p)}</p>" for p in s.get("paras", []))}</div>{vis}{src}{pfoot()}</div>'''

    def wcover(s, base):
        return f'''<div class="slide wk"><div class="wph {"bw" if s.get("bw",True) else ""}" style="background-image:url({uri(s["photo"], base)});background-position:{s.get("photo_pos","center")}"></div><div class="wgrad"></div>
<div class="wlogo"><img src="{g["SYM"]}">HOTCOIN</div><div class="wtitle">{"<br>".join(_esc(x) for x in s.get("title", ["What's on", "this week"]))}</div>
<div class="wrange">{_esc(s.get("range",""))}</div>{foot("Swipe")}</div>'''

    def wday(s, base):
        bg = s.get('bg', 'linear-gradient(160deg,#ff7a3d,#f2a65a 45%,#c9b8a8)')
        card = f'<div class="wcard" style="background-image:url({uri(s["photo"], base)});background-position:{s.get("photo_pos","center")}"></div>' if s.get('photo') else ''
        evs = ''.join(
            f'<div class="e">{inline(e["t"])} <span class="t">({_esc(e["time"])})</span>' + ''.join(f'<span class="b {b.get("c","")}">{_esc(b["t"])}</span>' for b in e.get('badges', [])) + '</div>'
            for e in s['events'])
        return f'''<div class="slide wk grain" style="background:{bg}"><div class="wday">{"<br>".join(_esc(x) for x in s["day"])}</div>{card}<div class="wev">{evs}</div>{foot("Swipe")}</div>'''

    return {'tcover': tcover, 'tslide': tslide, 'wcover': wcover, 'wday': wday}
