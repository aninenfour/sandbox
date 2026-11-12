# Colour variants of the official Hotcoin logo. Same shapes as the official files; only the colours change.
# PNG: from logo/symbol-official-white.png. SVG: from logo-v3.svg (vector, sharp at any zoom).
#   mono-white  = all white (for brand-green backgrounds, where the green dot disappears)
#   lime-dot    = white with a lime dot (for dark-green surfaces)
#   black       = ink wordmark with the brand-green dot (for white surfaces)
import re, numpy as np
from PIL import Image
B = '/home/user/sandbox/hotcoin-tradfi/public/brand/'
for src, name in [('logo-official-white.png', 'logo'), ('symbol-official-white.png', 'symbol')]:
    a = np.array(Image.open(B + src).convert('RGBA')).astype(int)
    dot = (a[..., 1] - a[..., 0] > 30) & (a[..., 3] > 0)
    for tag, rgb in [('mono-white', (255, 255, 255)), ('lime-dot', (184, 242, 106))]:
        b = a.copy(); b[dot, :3] = rgb
        Image.fromarray(b.astype(np.uint8)).save(f'{B}{name}-{tag}.png')
svg = open(B + 'logo-v3.svg').read()
def var(body, white, dot): return body.replace('fill="white"', f'fill="{white}"').replace('fill="#7EC25A"', f'fill="{dot}"')
sym = re.sub(r'viewBox="[^"]+"', 'viewBox="1.2 1.2 23.8 23.8"', re.sub(r'width="\d+" height="\d+"', 'width="224" height="224"', svg, 1), 1)
for tag, w, d in [('mono-white', '#FFFFFF', '#FFFFFF'), ('lime-dot', '#FFFFFF', '#B8F26A'), ('black', '#0B0E11', '#7EC25A')]:
    open(f'{B}logo-{tag}.svg', 'w').write(var(svg, w, d)); open(f'{B}symbol-{tag}.svg', 'w').write(var(sym, w, d))
print('ok')
