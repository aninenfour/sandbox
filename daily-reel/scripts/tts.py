"""Free voiceover with word timings (Microsoft Edge TTS).

Usage: python3 scripts/tts.py episodes/<slug>
Reads <episode>/script.txt, writes public/vo.mp3 and <episode>/words.json.
"""
import asyncio, json, os, ssl, sys
import edge_tts
import edge_tts.communicate as ec

CA = '/root/.ccr/ca-bundle.crt'
if os.path.exists(CA):  # sandbox egress proxy uses its own CA
    ec._SSL_CTX = ssl.create_default_context(cafile=CA)

VOICE = os.environ.get('VOICE', 'en-US-AndrewMultilingualNeural')
RATE = os.environ.get('RATE', '+8%')


async def main(ep):
    text = open(os.path.join(ep, 'script.txt')).read().replace('\n', ' ').strip()
    c = edge_tts.Communicate(text, VOICE, rate=RATE, boundary='WordBoundary',
                             proxy=os.environ.get('HTTPS_PROXY'))
    words = []
    with open('public/vo.mp3', 'wb') as f:
        async for ch in c.stream():
            if ch['type'] == 'audio':
                f.write(ch['data'])
            elif ch['type'] == 'WordBoundary':
                words.append({'w': ch['text'], 's': ch['offset'] / 1e7,
                              'e': (ch['offset'] + ch['duration']) / 1e7})
    json.dump(words, open(os.path.join(ep, 'words.json'), 'w'), indent=0)
    print(f'{len(words)} words, {words[-1]["e"]:.1f}s')


asyncio.run(main(sys.argv[1]))
