# Makes colour variants of the official Hotcoin logo for green backgrounds, where the green dot disappears.
# Same shapes as the official files, only the dot colour changes: all-white (mono) and lime-dot versions.
import numpy as np
from PIL import Image
B = '/home/user/sandbox/hotcoin-tradfi/public/brand/'
for src, name in [('logo-official-white.png', 'logo'), ('symbol-official-white.png', 'symbol')]:
    a = np.array(Image.open(B + src).convert('RGBA')).astype(int)
    dot = (a[..., 1] - a[..., 0] > 30) & (a[..., 3] > 0)
    for tag, rgb in [('mono-white', (255, 255, 255)), ('lime-dot', (184, 242, 106))]:
        b = a.copy(); b[dot, :3] = rgb
        Image.fromarray(b.astype(np.uint8)).save(f'{B}{name}-{tag}.png')
print('ok')
