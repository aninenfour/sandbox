# Fetches CoinGlass's official logo files from their own CDN (favicon + og image on coinglass.com)
# and turns the white-on-black art into transparent PNGs. Output goes to assets/ (gitignored).
import io, os, urllib.request
from PIL import Image, ImageOps
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets'); os.makedirs(D, exist_ok=True)
def get(u): return Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})).read())).convert('RGB')
def alpha(im):
    a = ImageOps.grayscale(im); out = Image.new('RGBA', im.size, (255, 255, 255, 0)); out.putalpha(a); return out.crop(a.point(lambda v: 255 if v > 40 else 0).getbbox())
alpha(get('https://cdn.coinglasscdn.com/static/icon_200.png')).save(f'{D}/coinglass-mark.png')
og = get('https://cdn.coinglasscdn.com/static/icon_600_315.png')
alpha(og.crop((440, 360, 820, 460))).save(f'{D}/coinglass-word.png')   # wordmark only, side rules cropped out
print('ok')
