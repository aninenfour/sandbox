#!/usr/bin/env python3
"""Builds the compact bilingual LinkedIn week page (EN / 中文 toggle). Expects en.json and zh.json (copies: linkedin/copy-en-2026-11-25.json, copy-zh-2026-11-25.json) next to it."""
import json, html, os
D = os.path.dirname(os.path.abspath(__file__))
EN = json.load(open(f'{D}/en.json')); ZH = json.load(open(f'{D}/zh.json'))
E = lambda t: html.escape(t, quote=False)

def bi(en, zh, tag='span'):
    return f'<{tag} class="en">{E(en)}</{tag}><{tag} class="zh" lang="zh-Hans">{E(zh)}</{tag}>'

STATUS = {
    'ready': ('ready', 'Ready', '已就绪'), 'copy': ('ready', 'Copy ready', '文案就绪'),
    'make': ('make', 'To produce', '待制作'), 'cut': ('make', 'To cut', '待剪辑'),
    'data': ('input', 'Data on Dec 1', '12月1日出数据'), 'confirm': ('input', 'Confirm snapshot', '待确认快照'),
}
TYPE = {
    'archive': ('Archive video', '档案视频'), 'bots': ('Bots and tools', '机器人与工具'), 'careers': ('Careers', '行业与职业'),
    'milestone': ('Milestones', '里程碑'), 'event': ('Event', '活动'), 'howto': ('How-to video', '教学视频'),
    '101': ('Hotcoin 101', 'Hotcoin 101'), 'data': ('Data Desk', '数据台'), 'why': ('Why Hotcoin', '为什么选 Hotcoin'),
}
FMT = {
    'video': ('Video 4:5', '视频 4:5'), 'pdf': ('PDF carousel', 'PDF 轮播'), 'multi': ('Multi-image', '多图'),
    'link': ('Image + link', '图片+链接'), 'poll': ('Poll', '投票'), 'image': ('Image', '图片'),
}
DAYS = [
    ('wed', 'Wednesday, Nov 25', '11月25日 周三'), ('thu', 'Thursday, Nov 26', '11月26日 周四'),
    ('fri', 'Friday, Nov 27', '11月27日 周五'), ('sat', 'Saturday, Nov 28', '11月28日 周六'),
    ('sun', 'Sunday, Nov 29', '11月29日 周日'), ('mon', 'Monday, Nov 30', '11月30日 周一'), ('tue', 'Tuesday, Dec 1', '12月1日 周二'),
]
# id, day, time, type, fmt, status, media, short label (en, zh), title (en, zh), note (en, zh)
POSTS = [
    ('p1', 'wed', '22:30', 'archive', 'video', 'ready', 'video', ('Archive: Bitcoin payroll, 2013', '档案：2013年比特币工资'),
     ('In 2013, the Internet Archive offered to pay its staff in Bitcoin', '2013年，互联网档案馆用比特币发工资'),
     ('Re-cut to end on the payoff. Scheduling needs the Publer API key.', '已重剪，结尾完整。排期需在环境中配置 Publer API key。')),
    ('p2', 'thu', '13:00', 'bots', 'pdf', 'copy', 'thu-bots.jpg', ('Bots: two thirds of trades', '机器人：三分之二的交易'),
     ('How much of crypto is traded by machines?', '加密交易有多少是机器完成的？'),
     ('Source: Birdeye estimate (BeInCrypto, Nov 2026), labeled as an estimate.', '来源：Birdeye 估算（BeInCrypto，2026年11月），文中注明为估算。')),
    ('p3', 'thu', '22:30', 'careers', 'pdf', 'copy', 'thu-careers.jpg', ('8 teams behind an exchange', '交易所背后的8个团队'),
     ('The teams you never see', '你看不到的8个团队'),
     ('Cover: licensed crowd photo from behind. Inner slides: icons only.', '封面：授权的观众背影照片。内页只用图标。')),
    ('p4', 'fri', '13:00', 'milestone', 'multi', 'copy', 'fri-autumn.jpg', ('Year 9: our autumn', '第9年：我们的秋天'),
     ('What a 9-year-old exchange shipped this autumn', '9年交易所，这个秋天做了什么'),
     ('Then TOKEN2049 booth photos (originals needed) and public Marina Bay Sands shots.', '后续图片：TOKEN2049 展台原图（待提供）与公开的滨海湾金沙照片。')),
    ('p5', 'fri', '18:00', 'event', 'link', 'copy', 'fri-earn.jpg', ('Event: Earn Exclusive, last call', '活动：定期理财，最后机会'),
     ('Why we pay Earn rewards as Futures Trial Funds', '为什么理财奖励发合约体验金'),
     ('Terms copied from the live campaign post.', '规则摘自已发布的活动文案。')),
    ('p6', 'fri', '22:30', 'howto', 'video', 'make', 'fri-1pct.jpg', ('How-to video: the 1% rule', '教学视频：1%法则'),
     ('The 1% rule in 80 seconds', '80秒讲清1%法则'),
     ('Our best LinkedIn topic so far. Math: 10,000 × 0.99¹⁰ = 9,044.', '目前 LinkedIn 表现最好的主题。计算：10,000 × 0.99¹⁰ = 9,044。')),
    ('p7', 'sat', '13:00', '101', 'poll', 'ready', 'poll', ('Poll: what protects an account', '投票：什么最能保护账户'),
     ('One question, four answers', '一个问题，四个答案'),
     ('Native LinkedIn poll, no image. Results feed next week’s carousel.', 'LinkedIn 原生投票，无配图。结果用于下周轮播。')),
    ('p8', 'mon', '13:00', '101', 'pdf', 'copy', 'mon-funding.jpg', ('101: funding rate', '101：资金费率'),
     ('The small number that decides who pays whom', '决定谁付钱给谁的小数字'),
     ('Worked example uses a live Hotcoin funding rate, with its date.', '案例使用当天 Hotcoin 实时资金费率并注明日期。')),
    ('p9', 'mon', '18:00', 'event', 'link', 'copy', 'mon-tradfi.jpg', ('Event: TradFi 0 Fee Carnival', '活动：TradFi 零手续费嘉年华'),
     ('Why we’re refunding TradFi fees', '为什么返还 TradFi 手续费'),
     ('Terms copied from the live campaign post.', '规则摘自已发布的活动文案。')),
    ('p10', 'mon', '22:30', 'archive', 'video', 'cut', 'poster', ('Archive: living on Bitcoin, 2013', '档案：2013年只用比特币生活'),
     ('A Forbes reporter lived on Bitcoin for a week. Watch where she ate.', '2013年，《福布斯》记者只用比特币生活一周'),
     ('Footage downloaded and transcribed; ends on a finished line.', '素材已下载并转写，结尾完整。')),
    ('p11', 'tue', '13:00', 'data', 'pdf', 'data', 'tue-datadesk.jpg', ('Data Desk: November in numbers', '数据台：11月数据回顾'),
     ('November 2026 in numbers', '2026年11月数据回顾'),
     ('Preview to Nov 25: BTC −23.7%, ETH −26.4%, stablecoins −$14.0B. Use “Notify employees”.', '截至11月25日：BTC −23.7%，ETH −26.4%，稳定币 −140亿美元。使用“通知员工”。')),
    ('p12', 'tue', '22:30', 'why', 'image', 'confirm', 'tue-reserves.jpg', ('Why Hotcoin: proof of reserves', '为什么选 Hotcoin：储备金证明'),
     ('Proof of reserves, explained in one line', '一句话讲清储备金证明'),
     ('Swap the numbers if a snapshot newer than Oct 29 exists.', '如有晚于10月29日的快照，替换数字。')),
]

def media(m):
    if m == 'video':
        return '<video src="kahle-li45.mp4" poster="kahle-poster.jpg" controls preload="none" playsinline></video>'
    if m == 'poster':
        return '<div class="vid"><img src="kahle-poster.jpg" alt=""><i class="play"></i></div>'
    if m == 'poll':
        opts = [('Position size', '仓位大小'), ('Stop-loss', '止损'), ('Hedging', '对冲'), ('No leverage', '不加杠杆')]
        return '<div class="poll">' + ''.join(f'<div>{bi(a, b)}</div>' for a, b in opts) + '</div>'
    return f'<img src="{m}" alt="" loading="lazy">'

def card(p):
    pid, day, t, ty, fm, st, m, short, title, note = p
    sk, sen, szh = STATUS[st]
    return f'''<article class="card" id="{pid}">
  <div class="media">{media(m)}</div>
  <div class="body">
    <div class="meta"><b class="time">{t}</b><span class="tag">{bi(*TYPE[ty])}</span><span class="tag">{bi(*FMT[fm])}</span><span class="st {sk}">{bi(sen, szh)}</span></div>
    <h3>{bi(*title)}</h3>
    <div class="cap-wrap clamp">
      <pre class="copy en">{E(EN[pid])}</pre><pre class="copy zh" lang="zh-Hans">{E(ZH[pid])}</pre>
    </div>
    <div class="actions"><button type="button" class="more">{bi('Show all', '展开全文')}</button><button type="button" class="cp">{bi('Copy', '复制')}</button></div>
    <p class="note">{bi(*note)}</p>
  </div>
</article>'''

rows = []
for d, den, dzh in DAYS:
    ps = [p for p in POSTS if p[1] == d]
    cells = []
    for slot in ('13:00', '18:00', '22:30'):
        hit = [p for p in ps if p[2] == slot]
        if hit:
            p = hit[0]; sk = STATUS[p[5]][0]
            cells.append(f'<td><a href="#{p[0]}"><i class="dot {sk}"></i>{bi(*p[7])}</a></td>')
        else:
            cells.append('<td class="empty">·</td>')
    if not ps:
        cells = [f'<td class="empty" colspan="3">{bi("Rest day, reply to comments", "休息日，只回复评论")}</td>']
    rows.append(f'<tr><th>{bi(den.split(",")[0][:3] + den[den.index(","):], dzh)}</th>{"".join(cells)}</tr>')

sections = []
for d, den, dzh in DAYS:
    ps = [p for p in POSTS if p[1] == d]
    if not ps: continue
    sections.append(f'<section class="day"><h2>{bi(den, dzh)}</h2><div class="grid">{"".join(card(p) for p in ps)}</div></section>')

page = f'''<title>Hotcoin LinkedIn Week Plan</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap">
<style>
/* Layout: compact planning board. Language toggle top right, week grid, then two-column post cards (cover left, copy right). */
:root{{
  --bg:#F6F7F4; --surface:#FFFFFF; --fg:#0B0E11; --muted:#5B6168; --line:#E2E5E0; --lime:#B8F26A; --green:#4E8F2E;
  --up:#17A86B; --down:#E5484D; --ok-bg:#E3F6EA; --make-bg:#F1F7E4; --in-bg:#FDECEC;
  --sans:'Inter Tight','Noto Sans SC',system-ui,sans-serif; --mono:'JetBrains Mono',ui-monospace,monospace;
}}
@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{--bg:#07090A;--surface:#111518;--fg:#EEF1EC;--muted:#9AA19B;--line:#232A2E;--green:#9BD873;--up:#2DBD85;--down:#F6465D;--ok-bg:#12301F;--make-bg:#1F2A12;--in-bg:#3A1518;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#07090A;--surface:#111518;--fg:#EEF1EC;--muted:#9AA19B;--line:#232A2E;--green:#9BD873;--up:#2DBD85;--down:#F6465D;--ok-bg:#12301F;--make-bg:#1F2A12;--in-bg:#3A1518;color-scheme:dark}}
*{{box-sizing:border-box}}
body{{background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:14px;line-height:1.5}}
#app[data-lang="en"] .zh,#app[data-lang="zh"] .en{{display:none!important}}
.wrap{{max-width:1180px;margin:0 auto;padding-block:28px 56px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:grid;grid-template-columns:minmax(0,1fr);gap:32px}}
header{{display:flex;flex-wrap:wrap;gap:12px 24px;align-items:flex-end;justify-content:space-between}}
.kicker{{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}}
h1{{font-size:clamp(28px,4vw,40px);line-height:1.05;letter-spacing:-.02em;margin:6px 0 6px;font-weight:800;text-wrap:balance}}
.lede{{margin:0;color:var(--muted);font-size:15px}}
.toggle{{display:inline-flex;border:1px solid var(--line);border-radius:99px;padding:3px;background:var(--surface)}}
.toggle button{{font:600 13px var(--sans);border:0;background:transparent;color:var(--muted);padding:7px 16px;border-radius:99px;cursor:pointer}}
.toggle button[aria-pressed="true"]{{background:var(--fg);color:var(--bg)}}
button:focus-visible,a:focus-visible{{outline:2px solid var(--green);outline-offset:2px}}
.scroll{{overflow-x:auto;border:1px solid var(--line);border-radius:10px;background:var(--surface)}}
table.week{{border-collapse:collapse;width:100%;min-width:640px;font-size:13px}}
.week th,.week td{{padding:8px 12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:middle}}
.week thead th{{font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--muted);font-weight:500}}
.week tbody th{{white-space:nowrap;font-weight:700}}
.week tr:last-child>*{{border-bottom:0}}
.week a{{color:var(--fg);text-decoration:none;font-weight:600;display:inline-flex;gap:8px;align-items:center}}
.week a:hover{{text-decoration:underline}}
.empty{{color:var(--muted)}}
.dot{{width:8px;height:8px;border-radius:50%;flex:none}}
.dot.ready{{background:var(--up)}}.dot.make{{background:transparent;box-shadow:inset 0 0 0 2px var(--green)}}.dot.input{{background:var(--down)}}
.legend{{display:flex;gap:16px;flex-wrap:wrap;margin-top:8px;color:var(--muted);font-size:12px}}
.legend span{{display:inline-flex;gap:6px;align-items:center}}
.day h2{{font-size:18px;margin:0 0 10px;padding-bottom:6px;border-bottom:2px solid var(--fg);font-weight:800}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,520px),1fr));gap:12px}}
.card{{display:grid;grid-template-columns:150px minmax(0,1fr);gap:16px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px;scroll-margin-top:12px}}
@media (max-width:480px){{.card{{grid-template-columns:110px minmax(0,1fr);gap:12px}}}}
.media img,.media video,.vid{{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:8px;display:block;background:#0B0E11}}
.vid{{position:relative;overflow:hidden}}.vid img{{border-radius:0}}
.play{{position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(11,14,17,.72)}}
.play::after{{content:"";position:absolute;left:17px;top:13px;border-left:14px solid #B8F26A;border-top:9px solid transparent;border-bottom:9px solid transparent}}
.poll{{aspect-ratio:4/5;border:1px solid var(--line);border-radius:8px;display:grid;align-content:center;gap:8px;padding:10px;background:var(--bg)}}
.poll div{{border:1.5px solid #0A66C2;color:#0A66C2;border-radius:99px;text-align:center;font-weight:700;font-size:11px;padding:5px}}
.meta{{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:6px}}
.time{{font-family:var(--mono);font-size:12px}}
.tag{{font-family:var(--mono);font-size:10px;letter-spacing:.04em;padding:2px 7px;border:1px solid var(--line);border-radius:99px;color:var(--muted)}}
.st{{font-family:var(--mono);font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px}}
.st.ready{{background:var(--ok-bg);color:var(--up)}}.st.make{{background:var(--make-bg);color:var(--green)}}.st.input{{background:var(--in-bg);color:var(--down)}}
.card h3{{margin:0 0 8px;font-size:15px;line-height:1.3;text-wrap:balance}}
.copy{{white-space:pre-wrap;margin:0;font:13px/1.55 var(--sans);overflow-wrap:anywhere}}
.cap-wrap{{background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:10px 12px}}
.cap-wrap.clamp{{max-height:8.4em;overflow:hidden;-webkit-mask-image:linear-gradient(#000 60%,transparent);mask-image:linear-gradient(#000 60%,transparent)}}
.actions{{display:flex;gap:8px;margin-top:8px}}
.actions button{{font:600 12px var(--sans);border:1px solid var(--line);background:var(--surface);color:var(--fg);border-radius:6px;padding:4px 10px;cursor:pointer}}
.note{{margin:8px 0 0;color:var(--muted);font-size:12px}}
footer{{color:var(--muted);font-size:12px}}
</style>
<div id="app" data-lang="en">
<div class="wrap">
<header>
  <div>
    <div class="kicker">{bi('Hotcoin · LinkedIn · Nov 25 to Dec 1, 2026', 'Hotcoin · LinkedIn · 2026年11月25日至12月1日')}</div>
    <h1>{bi('Next 7 days on LinkedIn', 'LinkedIn 未来7天')}</h1>
    <p class="lede">{bi('12 posts, 3 videos. Beijing time: 13:00 for Asia, 22:30 for Europe and the US.', '12条帖子，3个视频。北京时间：13:00 面向亚洲，22:30 面向欧美。')}</p>
  </div>
  <div class="toggle" role="group" aria-label="Language"><button type="button" data-l="en" aria-pressed="true">EN</button><button type="button" data-l="zh" aria-pressed="false">中文</button></div>
</header>
<section>
  <div class="scroll"><table class="week">
    <thead><tr><th>{bi('Day', '日期')}</th><th>13:00 · {bi('Asia', '亚洲')}</th><th>18:00 · {bi('Event', '活动')}</th><th>22:30 · {bi('Europe / US', '欧美')}</th></tr></thead>
    <tbody>{"".join(rows)}</tbody>
  </table></div>
  <div class="legend"><span><i class="dot ready"></i>{bi('Ready', '已就绪')}</span><span><i class="dot make"></i>{bi('To produce', '待制作')}</span><span><i class="dot input"></i>{bi('Needs data or input', '待数据或确认')}</span></div>
</section>
{"".join(sections)}
<footer>{bi('Covers use official logo files, Inter Tight and JetBrains Mono, no italics. Photos are licensed (Unsplash) and credited. Chinese event links use hotcoinv5.com.', '封面使用官方 Logo 文件、Inter Tight 与 JetBrains Mono 字体，不用斜体。图片均为授权素材（Unsplash）并已署名。中文活动链接使用 hotcoinv5.com。')}</footer>
</div>
<script>
(function(){{
  var KEY='li-week-lang',APP=document.getElementById('app');
  function setLang(l){{APP.dataset.lang=l;document.documentElement.lang=l==='zh'?'zh-Hans':'en';
    document.querySelectorAll('.toggle button').forEach(function(b){{b.setAttribute('aria-pressed',String(b.dataset.l===l))}});
    try{{localStorage.setItem(KEY,l)}}catch(e){{}}}}
  var saved=null;try{{saved=localStorage.getItem(KEY)}}catch(e){{}}
  if(saved==='zh'||saved==='en')setLang(saved);
  document.querySelectorAll('.toggle button').forEach(function(b){{b.addEventListener('click',function(){{setLang(b.dataset.l)}})}});
  document.querySelectorAll('.card').forEach(function(c){{
    var wrap=c.querySelector('.cap-wrap'),more=c.querySelector('.more'),cp=c.querySelector('.cp');
    more.addEventListener('click',function(){{var open=wrap.classList.toggle('clamp');
      more.innerHTML=open?'<span class="en">Show all</span><span class="zh" lang="zh-Hans">展开全文</span>':'<span class="en">Show less</span><span class="zh" lang="zh-Hans">收起</span>'}});
    cp.addEventListener('click',function(){{var pre=wrap.querySelector('pre.copy.'+APP.dataset.lang);
      function done(ok){{cp.dataset.t=cp.innerHTML;cp.textContent=ok?(APP.dataset.lang==='zh'?'已复制':'Copied'):(APP.dataset.lang==='zh'?'已选中':'Selected');setTimeout(function(){{cp.innerHTML=cp.dataset.t}},1400)}}
      function sel(){{wrap.classList.remove('clamp');var r=document.createRange();r.selectNodeContents(pre);var s=getSelection();s.removeAllRanges();s.addRange(r);done(false)}}
      try{{navigator.clipboard.writeText(pre.textContent).then(function(){{done(true)}},sel)}}catch(e){{sel()}}}});
  }});
}})();
</script>
</div>
'''
open(f'{D}/linkedin-week.html', 'w').write(page)
print('ok', len(page))
