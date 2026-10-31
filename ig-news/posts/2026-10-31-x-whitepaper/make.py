"""X-only 4-image set (owner, Oct 31): Bitcoin whitepaper pages, minimal paper style, green highlights,
huge faded Hotcoin logo behind, no promo slide. Text quoted exactly from bitcoin.org/bitcoin.pdf."""
import base64, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'media' / '2026-10-31-x-whitepaper'; OUT.mkdir(parents=True, exist_ok=True)
logo = 'data:image/svg+xml;base64,' + base64.b64encode((ROOT / 'assets' / 'symbol-dark.svg').read_bytes()).decode()
arch = base64.b64encode((ROOT / 'assets' / 'fonts' / 'Archivo.ttf').read_bytes()).decode()
CSS = f"""
@font-face{{font-family:'Archivo';src:url(data:font/ttf;base64,{arch});font-weight:100 900;font-stretch:62% 125%}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:'Liberation Serif','Times New Roman',serif;
 background:radial-gradient(120% 90% at 50% 35%,#F4F6F0 0%,#E3E7DE 60%,#CDD3C8 100%)}}
body:after{{content:'';position:absolute;inset:0;z-index:1;opacity:.35;pointer-events:none;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .12 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}}
.wm{{position:absolute;left:50%;top:57%;width:860px;height:860px;transform:translate(-50%,-50%);opacity:.05;background:url({logo}) center/contain no-repeat;z-index:6;pointer-events:none;mix-blend-mode:multiply}}
.hd{{position:absolute;left:80px;right:80px;top:62px;z-index:7}}
.top{{font-family:'Archivo';font-weight:900;font-stretch:110%;font-size:74px;line-height:1;letter-spacing:-.025em;color:#0E1A12}}
.sub{{margin-top:14px;display:inline-flex;align-items:center;gap:14px;font-family:'Archivo';font-weight:800;font-size:30px;letter-spacing:.06em;text-transform:uppercase;color:#2F6E1C}}
.sub:before{{content:'';width:14px;height:14px;border-radius:50%;background:#58B030;box-shadow:0 0 0 6px rgba(88,176,48,.18)}}
.stack{{position:absolute;left:100px;right:100px;top:255px;bottom:90px;z-index:2}}
.sheet{{position:absolute;inset:0;background:#FBFBF8;box-shadow:0 2px 3px rgba(0,0,0,.08),0 20px 40px rgba(20,30,20,.10)}}
.s3{{transform:rotate(2.6deg) translate(16px,10px);background:#F2F2EC}}
.s2{{transform:rotate(-1.6deg) translate(-10px,6px);background:#F7F7F2}}
.page{{position:absolute;inset:0;transform:rotate(.5deg);background:linear-gradient(180deg,#FFFFFE 0%,#FCFCF8 70%,#F6F6EF 100%);
 box-shadow:0 1px 1px rgba(0,0,0,.06),0 10px 20px rgba(20,30,20,.10),0 40px 90px rgba(20,30,20,.22);padding:74px 78px;color:#151515;font-size:36px;line-height:1.46;text-align:justify}}
.page:after{{content:'';position:absolute;right:0;bottom:0;width:70px;height:70px;background:linear-gradient(135deg,#EDEDE5 0%,#DADAD0 50%,transparent 50%);box-shadow:-4px -4px 10px rgba(0,0,0,.05)}}
.clip{{position:absolute;top:-34px;left:120px;width:46px;height:120px;border:7px solid #9AA39C;border-radius:24px;z-index:9;transform:rotate(-6deg);box-shadow:2px 3px 4px rgba(0,0,0,.18)}}
.page h1{{font-size:46px;text-align:center;font-weight:700;margin:10px 0 26px;line-height:1.2}}
.page .auth{{text-align:center;font-size:30px;line-height:1.5;margin-bottom:40px}}
.page h2{{font-size:40px;font-weight:700;margin:0 0 16px}}
.page p{{margin-bottom:18px}}
.page .ab{{font-size:33px;margin:0 20px}}
.hl{{position:relative;padding:0 4px;background:linear-gradient(100deg,rgba(120,200,80,0) 0%,rgba(120,200,80,.55) 2%,rgba(120,200,80,.68) 50%,rgba(120,200,80,.5) 97%,rgba(120,200,80,0) 100%) 0 62%/100% 78% no-repeat;border-radius:6px 2px 8px 3px;-webkit-box-decoration-break:clone;box-decoration-break:clone}}
.fade{{color:#A3A8A6}}
.pn{{position:absolute;left:0;right:0;bottom:30px;text-align:center;font-size:24px;color:#666}}
.note{{position:absolute;right:58px;bottom:130px;width:380px;z-index:8;transform:rotate(-4deg);padding:44px 32px 34px;
 background:linear-gradient(170deg,#D9F2B8 0%,#C4E99A 60%,#B2DD84 100%);color:#1D3A12;font-family:'Archivo';font-weight:800;font-size:32px;line-height:1.18;
 box-shadow:0 2px 2px rgba(0,0,0,.08),0 18px 30px rgba(20,40,10,.22),0 40px 60px -20px rgba(20,40,10,.25)}}
.note b{{display:block;font-size:22px;letter-spacing:.12em;color:#3F7A22;margin-bottom:10px}}
.note:before{{content:'';position:absolute;top:-16px;left:50%;width:150px;height:38px;transform:translateX(-50%) rotate(2deg);background:rgba(255,255,255,.55);box-shadow:0 1px 3px rgba(0,0,0,.1)}}
.note:after{{content:'';position:absolute;right:0;bottom:0;width:60px;height:60px;background:linear-gradient(315deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.10) 50%,#A6D277 52%)}}
"""
SLIDES = [
 ("Released Oct 31, 2008", "Bitcoin Whitepaper",
  """<h1>Bitcoin: A Peer-to-Peer Electronic Cash System</h1>
  <div class='auth'>Satoshi Nakamoto<br>satoshin@gmx.com<br>www.bitcoin.org</div>
  <p class='ab'><b>Abstract.</b> A purely <span class='hl'>peer-to-peer version of electronic cash</span> would allow online payments to be sent directly from one party to another <span class='hl'>without going through a financial institution.</span> Digital signatures provide part of the solution, but the main benefits are lost if a trusted third party is still required to prevent double-spending. <span class='fade'>We propose a solution to the double-spending problem using a peer-to-peer network...</span></p>""", "1", None),
 ("Introduction", "Page 1",
  """<h2>1. Introduction</h2>
  <p class='fade'>Commerce on the Internet has come to rely almost exclusively on financial institutions serving as trusted third parties to process electronic payments...</p>
  <p>What is needed is an electronic payment system based on <span class='hl'>cryptographic proof instead of trust,</span> allowing any two willing parties to <span class='hl'>transact directly with each other</span> without the need for a trusted third party.</p>
  <p class='fade'>Transactions that are computationally impractical to reverse would protect sellers from fraud...</p>""", "1", None),
 ("Mining", "Page 4",
  """<h2>6. Incentive</h2>
  <p>By convention, the first transaction in a block is a special transaction that <span class='hl'>starts a new coin owned by the creator of the block.</span> This adds an incentive for nodes to support the network, and provides a way to initially distribute coins into circulation, since <span class='hl'>there is no central authority to issue them.</span></p>
  <p>The steady addition of a constant of amount of new coins is <span class='hl'>analogous to gold miners</span> expending resources to add gold to circulation. In our case, it is CPU time and electricity that is expended.</p>""", "4", None),
 ("Conclusion", "Page 8",
  """<h2>12. Conclusion</h2>
  <p>We have proposed a system for <span class='hl'>electronic transactions without relying on trust.</span></p>
  <p class='fade'>We started with the usual framework of coins made from digital signatures, which provides strong control of ownership, but is incomplete without a way to prevent double-spending. To solve this, we proposed a peer-to-peer network using proof-of-work to record a public history of transactions...</p>""", "8",
  "<b>OCT 31, 2008</b>Sent by Satoshi to the cryptography mailing list"),
]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium'); pg = b.new_page(viewport={'width': 1080, 'height': 1350}, device_scale_factor=2)
    for i, (kick, top, body, pn, note) in enumerate(SLIDES, 1):
        n = f"<div class='note'>{note}</div>" if note else ''
        html = (f"<html><head><style>{CSS}</style></head><body><div class='wm'></div><div class='hd'><div class='top'>{top}</div><div class='sub'>{kick}</div></div>"
                f"<div class='stack'><div class='sheet s3'></div><div class='sheet s2'></div><div class='page'>{body}<div class='pn'>{pn}</div></div></div>{n}</body></html>")
        pg.set_content(html); pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready')
        pg.screenshot(path=str(OUT / f'{i:02d}.jpg'), type='jpeg', quality=93)
    b.close()
print('ok')
