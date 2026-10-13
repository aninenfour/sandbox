# Generates the Hunt brothers trailer voiceover line by line with Kokoro (open-source TTS, Apache 2.0).
# This is a scratch voice for timing; the host re-records the same lines for the final cut.
# Model files: github.com/thewh1teagle/kokoro-onnx releases (model-files-v1.0). Pass their folder as argv[1].
# Writes public/hunt/vo/<id>.wav and public/hunt/vo/lines.json with each line's duration.
#
# Sources: Wikipedia "Silver Thursday" and "Nelson Bunker Hunt"; Britannica "Silver Thursday".
#   ~195M oz held with partners by 1 Jan 1980 (about half as futures); silver under $10 before Aug 1979, ~$6 in early 1979,
#   above $50 in Jan 1980; Tiffany & Co. "Unconscionable" ad, NYT, 26 Mar 1980; COMEX limits Jan 1980;
#   27 Mar 1980 close $10.80; Chapter 11 in Sep 1988.
import json, sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro(f'{sys.argv[1]}/kokoro-v1.0.onnx', f'{sys.argv[1]}/voices-v1.0.bin')
VOICE = sys.argv[2] if len(sys.argv) > 2 else 'am_michael'
LINES = [
  ('jan', "January, nineteen eighty."),
  ('fifty', "Silver just hit fifty dollars an ounce."),
  ('six', "A year ago, it was six."),
  ('behind', "Behind it? Two brothers from Texas."),
  ('heirs', "Sons of an oil billionaire."),
  ('bet', "And they've bet everything on silver."),
  ('ounces', "Nearly two hundred million ounces of it."),
  ('tiffany', "Tiffany's takes out an ad in the New York Times. One word."),
  ('uncon', "Unconscionable."),
  ('rules', "Then the exchange changes the rules."),
  ('march', "And on March twenty-seventh,"),
  ('ten', "silver crashes to ten dollars."),
  ('thursday', "They call it Silver Thursday."),
  ('how', "How two brothers tried to corner the world's silver,"),
  ('lost', "and lost almost everything."),
]
out = []
for id_, text in LINES:
    a, sr = k.create(text, voice=VOICE, speed=1.05, lang='en-us')
    sf.write(f'public/hunt/vo/{id_}.wav', a, sr)
    out.append({'id': id_, 'text': text, 'dur': round(len(a) / sr, 3)})
    print(id_, out[-1]['dur'])
json.dump(out, open('public/hunt/vo/lines.json', 'w'), indent=1)
print('total', round(sum(o['dur'] for o in out), 1))
