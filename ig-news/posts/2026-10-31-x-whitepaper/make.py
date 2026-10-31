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
body{{width:1080px;height:1350px;background:#EEF0EA;position:relative;overflow:hidden;font-family:'Liberation Serif','Times New Roman',serif}}
.wm{{position:absolute;left:50%;top:56%;width:820px;height:820px;transform:translate(-50%,-50%);opacity:.09;background:url({logo}) center/contain no-repeat;z-index:5;pointer-events:none;mix-blend-mode:multiply}}
.top{{position:absolute;left:70px;right:70px;top:64px;font-family:'Archivo';font-weight:900;font-stretch:108%;font-size:60px;line-height:1.02;letter-spacing:-.02em;color:#0E1A12}}
.top .g{{color:#3F8A27}}
.kick{{position:absolute;left:70px;top:30px;font-family:'Archivo';font-weight:700;font-size:22px;letter-spacing:.14em;color:#5b665e}}
.page{{position:absolute;left:90px;right:90px;top:250px;bottom:110px;background:#fff;box-shadow:0 30px 80px rgba(14,26,18,.18),0 2px 0 rgba(0,0,0,.04);padding:70px 76px;color:#111;font-size:36px;line-height:1.45;text-align:justify}}
.page h1{{font-size:46px;text-align:center;font-weight:700;margin:10px 0 26px;line-height:1.2}}
.page .auth{{text-align:center;font-size:30px;line-height:1.5;margin-bottom:40px}}
.page h2{{font-size:40px;font-weight:700;margin:0 0 16px}}
.page p{{margin-bottom:18px}}
.page .ab{{font-size:33px;margin:0 20px}}
.hl{{background:linear-gradient(transparent 12%,rgba(126,194,90,.62) 12%,rgba(126,194,90,.62) 92%,transparent 92%);padding:0 4px;border-radius:3px}}
.fade{{color:#9aa0a5}}
.pn{{position:absolute;left:0;right:0;bottom:30px;text-align:center;font-size:24px;color:#555}}
.foot{{position:absolute;left:70px;right:70px;bottom:40px;display:flex;justify-content:space-between;font-family:'Archivo';font-weight:700;font-size:22px;color:#5b665e}}
.note{{position:absolute;right:60px;bottom:150px;width:390px;background:#7EC25A;color:#0E1A12;font-family:'Archivo';font-weight:800;font-size:34px;line-height:1.15;padding:26px 28px;transform:rotate(-3deg);box-shadow:0 18px 40px rgba(0,0,0,.18)}}
"""
SLIDES = [
 ("BITCOIN WHITEPAPER · OCT 31, 2008", "Be honest: <span class='g'>have you read it?</span>",
  """<h1>Bitcoin: A Peer-to-Peer Electronic Cash System</h1>
  <div class='auth'>Satoshi Nakamoto<br>satoshin@gmx.com<br>www.bitcoin.org</div>
  <p class='ab'><b>Abstract.</b> A purely <span class='hl'>peer-to-peer version of electronic cash</span> would allow online payments to be sent directly from one party to another <span class='hl'>without going through a financial institution.</span> Digital signatures provide part of the solution, but the main benefits are lost if a trusted third party is still required to prevent double-spending. <span class='fade'>We propose a solution to the double-spending problem using a peer-to-peer network...</span></p>""", "1", None),
 ("PAGE 1 · INTRODUCTION", "The whole idea <span class='g'>in one line</span>",
  """<h2>1. Introduction</h2>
  <p class='fade'>Commerce on the Internet has come to rely almost exclusively on financial institutions serving as trusted third parties to process electronic payments...</p>
  <p>What is needed is an electronic payment system based on <span class='hl'>cryptographic proof instead of trust,</span> allowing any two willing parties to <span class='hl'>transact directly with each other</span> without the need for a trusted third party.</p>
  <p class='fade'>Transactions that are computationally impractical to reverse would protect sellers from fraud...</p>""", "1", None),
 ("PAGE 4 · INCENTIVE", "Mining, explained <span class='g'>in 2008</span>",
  """<h2>6. Incentive</h2>
  <p>By convention, the first transaction in a block is a special transaction that <span class='hl'>starts a new coin owned by the creator of the block.</span> This adds an incentive for nodes to support the network, and provides a way to initially distribute coins into circulation, since <span class='hl'>there is no central authority to issue them.</span></p>
  <p>The steady addition of a constant of amount of new coins is <span class='hl'>analogous to gold miners</span> expending resources to add gold to circulation. In our case, it is CPU time and electricity that is expended.</p>""", "4", None),
 ("PAGE 8 · CONCLUSION", "9 pages. <span class='g'>18 years later.</span>",
  """<h2>12. Conclusion</h2>
  <p>We have proposed a system for <span class='hl'>electronic transactions without relying on trust.</span></p>
  <p class='fade'>We started with the usual framework of coins made from digital signatures, which provides strong control of ownership, but is incomplete without a way to prevent double-spending. To solve this, we proposed a peer-to-peer network using proof-of-work to record a public history of transactions...</p>""", "8",
  "Oct 31, 2026:<br>$1.55 trillion<br>~20.1M of 21M coins mined"),
]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium'); pg = b.new_page(viewport={'width': 1080, 'height': 1350}, device_scale_factor=2)
    for i, (kick, top, body, pn, note) in enumerate(SLIDES, 1):
        n = f"<div class='note'>{note}</div>" if note else ''
        html = (f"<html><head><style>{CSS}</style></head><body><div class='wm'></div><div class='kick'>{kick}</div><div class='top'>{top}</div>"
                f"<div class='page'>{body}<div class='pn'>{pn}</div></div>{n}<div class='foot'><span>@hotcoinex</span><span>{i}/4</span></div></body></html>")
        pg.set_content(html); pg.wait_for_load_state('networkidle'); pg.evaluate('document.fonts.ready')
        pg.screenshot(path=str(OUT / f'{i:02d}.jpg'), type='jpeg', quality=93)
    b.close()
print('ok')
