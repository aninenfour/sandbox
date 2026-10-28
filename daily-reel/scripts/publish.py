"""Upload a finished reel to Publer and publish it now to Instagram (Reel, also on grid),
TikTok and Facebook (Reel). Retries when Publer reports a clash with another post
(it needs a one-minute gap). Prints the live links.

Usage: PUBLER_API_KEY=... python3 scripts/publish.py out/<slug>.mp4 episodes/<slug>/caption.md [out/<slug>-thumb.jpg]
The optional third argument is a cover image (see scripts/thumb.sh). It is uploaded to Publer and set as the
default thumbnail on all three networks (Instagram cover, Facebook Reel cover, TikTok cover).
The API key comes from the environment only. Never commit it.
"""
import json, os, subprocess, sys, time

KEY = os.environ['PUBLER_API_KEY']
WS = '6a6d512f7524b69b86f9c4dc'  # Publer workspace "hotcoin"
ACCOUNTS = {
    'instagram': '6a72f29a4bc9fe4b339c4dec',  # Hotcoin Exchange
    'tiktok': '6adffa89cedef2e3f1877ef6',     # Hotcoin Exchange (@hotcoin.com)
    'facebook': '6a72f281aed075b6f35a33c0',   # Hotcoin page
}
API = 'https://app.publer.com/api/v1'
H = ['-H', f'Authorization: Bearer-API {KEY}', '-H', f'Publer-Workspace-Id: {WS}']


def curl(*args):
    r = subprocess.run(['curl', '-s', '-m', '600', *H, *args], capture_output=True, text=True)
    return json.loads(r.stdout) if r.stdout.strip() else {}


def wait_job(job):
    for _ in range(90):
        r = curl(f'{API}/job_status/{job}')
        if r.get('status') not in ('working', 'queued', None):
            return r
        time.sleep(10)
    return r


def find_post(account, text_start):
    for _ in range(40):
        r = curl(f'{API}/posts?account_ids[]={account}&limit=6')
        posts = r.get('posts', r) if isinstance(r, dict) else r
        for p in posts or []:
            if (p.get('text') or '').startswith(text_start):
                if p.get('state') in ('published', 'failed', 'error'):
                    return p
        time.sleep(15)
    return {}


video, caption_file = sys.argv[1], sys.argv[2]
caption = open(caption_file).read().strip()
up = curl('-X', 'POST', f'{API}/media', '-F', f'file=@{video};type=video/mp4', '-F', 'in_library=true')
if 'id' not in up:
    sys.exit(f'upload failed: {up}')
media = up['id']
th = up['thumbnails'][0]

# media entry per network; with a cover image, append it to the video's thumbnails and select it
def vid(tiktok=False):
    m = {'id': media, 'type': 'video'}
    if tiktok:
        m['thumbnails'] = [{'real': th['real'], 'small': th['small']}]
    if cover:
        thumbs = [{'real': th['real'], 'small': th['small']}] if tiktok else list(up['thumbnails'])
        m['thumbnails'] = thumbs + [{'real': cover['path'], 'small': cover.get('thumbnail') or cover['path']}]
        m['default_thumbnail'] = len(thumbs)
    return m

cover = None
if len(sys.argv) > 3:
    cover = curl('-X', 'POST', f'{API}/media', '-F', f'file=@{sys.argv[3]};type=image/jpeg', '-F', 'in_library=false')
    if 'path' not in cover:
        print(f'cover upload failed, posting with the default frame: {cover}')
        cover = None

networks = {
    'instagram': {'type': 'video', 'text': caption, 'media': [vid()],
                  'details': {'type': 'reel', 'feed': True}},
    'tiktok': {'type': 'video', 'text': caption.replace('•', '#'), 'media': [vid(tiktok=True)],
               'details': {'privacy': 'PUBLIC_TO_EVERYONE', 'comment': True, 'duet': True, 'stitch': True}},
    'facebook': {'type': 'video', 'text': caption, 'media': [vid()],
                 'details': {'type': 'reel'}},
}

results = {}
for net, payload in networks.items():
    body = json.dumps({'bulk': {'state': 'scheduled', 'posts': [
        {'networks': {net: payload}, 'accounts': [{'id': ACCOUNTS[net]}]}]}})
    for attempt in range(5):
        job = curl('-X', 'POST', f'{API}/posts/schedule/publish', '-H', 'Content-Type: application/json',
                   '-d', body).get('job_id')
        st = wait_job(job) if job else {}
        fails = [p.get('failure', {}).get('message', '') for p in st.get('payload', []) if p.get('status') == 'failed']
        if not fails:
            break
        print(f'{net}: attempt {attempt + 1} failed: {fails}')
        time.sleep(75)
    post = find_post(ACCOUNTS[net], caption.replace('•', '#')[:30] if net == 'tiktok' else caption[:30])
    results[net] = {'state': post.get('state'), 'link': post.get('post_link'), 'error': post.get('error')}
    print(net, results[net])
    time.sleep(70)  # keep a gap before the next network

json.dump(results, open(os.path.join(os.path.dirname(caption_file), 'published.json'), 'w'), indent=1)
