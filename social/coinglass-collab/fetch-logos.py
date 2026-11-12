# Fetches CoinGlass's official logo from coinglass.com: the vector logo (cow + wordmark) inlined in their homepage HTML,
# saved as white SVGs (full logo, and the cow mark alone via a cropped viewBox). Output goes to assets/ (gitignored).
import os, re, urllib.request
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets'); os.makedirs(D, exist_ok=True)
html = urllib.request.urlopen(urllib.request.Request('https://www.coinglass.com/', headers={'User-Agent': 'Mozilla/5.0'})).read().decode()
i = html.index('viewBox="0 0 1500 388"'); s = html.rindex('<svg', 0, i); e = html.index('</svg>', i) + 6
body = re.sub(r'^<svg[^>]*>', '', html[s:e])
def save(name, vb, w, h):
    open(f'{D}/{name}', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{w}" height="{h}" fill="#fff">{body}')
save('coinglass-logo.svg', '0 0 1500 388', 1500, 388)
save('coinglass-mark.svg', '0 0 350 388', 350, 388)
print('ok')
