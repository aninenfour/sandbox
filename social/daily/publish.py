#!/usr/bin/env python3
"""Post one image to X, Facebook and LinkedIn through Publer, right now.

  PUBLER_API_KEY=... python3 social/daily/publish.py <image.png> <caption.txt> [--draft] [--only x,facebook,linkedin]

<caption.txt> is the X caption (with @handles). Facebook and LinkedIn get the same text with the @handles
removed, unless facebook.txt / linkedin.txt sit next to it (watch.py writes those). --draft saves drafts
instead of publishing (for tests). Writes published.json next to the caption with each network's link.
The API key comes from the environment only. Never commit it.
"""
import argparse, json, os, re, subprocess, sys, time

KEY = os.environ['PUBLER_API_KEY']
WS = '6a6d512f7524b69b86f9c4dc'  # Publer workspace "hotcoin"
ACCOUNTS = {
    'twitter': '6a72f2aa4bc9fe4b339c4e09',   # Hotcoin 🟩 (X)
    'facebook': '6a72f281aed075b6f35a33c0',  # Hotcoin page
    'linkedin': '6a980801cb0f88ac5ed64d81',  # Hotcoin company page
}
API = 'https://app.publer.com/api/v1'
H = ['-H', f'Authorization: Bearer-API {KEY}', '-H', f'Publer-Workspace-Id: {WS}']


def curl(*args):
    r = subprocess.run(['curl', '-s', '-m', '300', *H, *args], capture_output=True, text=True)
    return json.loads(r.stdout) if r.stdout.strip() else {}


def wait_job(job):
    r = {}
    for _ in range(60):
        r = curl(f'{API}/job_status/{job}')
        if r.get('status') not in ('working', 'queued', None):
            return r
        time.sleep(5)
    return r


def strip_handles(t):
    return re.sub(r'[ \t]*(?<![\w$])@\w+', '', t)


def find_post(account, start, state):
    for _ in range(30):
        r = curl(f'{API}/posts?account_ids[]={account}&state={state}&limit=8')
        for p in (r.get('posts', r) if isinstance(r, dict) else r) or []:
            if (p.get('text') or '').startswith(start) and (state == 'draft' or p.get('state') in ('published', 'failed', 'error')):
                return p
        time.sleep(10)
    return {}


ap = argparse.ArgumentParser()
ap.add_argument('image')
ap.add_argument('caption')
ap.add_argument('--draft', action='store_true')
ap.add_argument('--only', default='twitter,facebook,linkedin')
a = ap.parse_args()

d = os.path.dirname(os.path.abspath(a.caption))
x_text = open(a.caption).read().strip()
texts = {'twitter': x_text}
for net, f in (('facebook', 'facebook.txt'), ('linkedin', 'linkedin.txt')):
    p = os.path.join(d, f)
    texts[net] = open(p).read().strip() if os.path.exists(p) else strip_handles(x_text)

up = curl('-X', 'POST', f'{API}/media', '-F', f'file=@{a.image};type=image/png', '-F', 'in_library=false')
if 'id' not in up:
    sys.exit(f'image upload failed: {up}')
media = [{'id': up['id'], 'type': 'image', 'path': up.get('path')}]

nets = [{'x': 'twitter'}.get(n.strip(), n.strip()) for n in a.only.split(',')]
state = 'draft' if a.draft else 'scheduled'
endpoint = f'{API}/posts/schedule' if a.draft else f'{API}/posts/schedule/publish'
results = {}
for net in nets:
    body = json.dumps({'bulk': {'state': state, 'posts': [
        {'networks': {net: {'type': 'photo', 'text': texts[net], 'media': media}}, 'accounts': [{'id': ACCOUNTS[net]}]}]}})
    err = None
    for attempt in range(4):
        job = curl('-X', 'POST', endpoint, '-H', 'Content-Type: application/json', '-d', body).get('job_id')
        st = wait_job(job) if job else {'error': 'no job id'}
        pl = st.get('payload') or {}
        if isinstance(pl, dict):  # {"failures": {...}} for photo posts
            fails = [json.dumps(v, ensure_ascii=False)[:300] for v in (pl.get('failures') or {}).values()]
        else:
            fails = [p.get('failure', {}).get('message', '') for p in pl if isinstance(p, dict) and p.get('status') == 'failed']
        err = fails or st.get('error')
        if not err:
            break
        if 'duplicat' in json.dumps(err).lower():
            break  # the same post already went out (or is queued): never retry into a double post
        print(f'{net}: attempt {attempt + 1} failed: {err}', file=sys.stderr)
        time.sleep(75)  # Publer wants a one-minute gap between posts on the same account
    post = find_post(ACCOUNTS[net], texts[net][:30], 'draft' if a.draft else 'published') if not err else {}
    results[net] = {'state': post.get('state'), 'link': post.get('post_link'), 'id': post.get('id'),
                    'error': err or post.get('error')}
    print(net, json.dumps(results[net], ensure_ascii=False))

if not a.draft:
    json.dump(results, open(os.path.join(d, 'published.json'), 'w'), indent=1)
sys.exit(1 if any(r['error'] for r in results.values()) else 0)
