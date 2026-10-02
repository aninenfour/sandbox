# Generates the Uptober voiceover line by line with Kokoro (open-source TTS, Apache 2.0), voice af_heart.
# Model files: github.com/thewh1teagle/kokoro-onnx releases (model-files-v1.0). Pass their folder as argv[1].
# Writes public/uptober/vo/<id>.wav and public/uptober/vo/lines.json with each line's duration.
import json, sys, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro(f'{sys.argv[1]}/kokoro-v1.0.onnx', f'{sys.argv[1]}/voices-v1.0.bin')
# "Up... tober" is a phonetic spelling: written "Uptober", the voice says "October"; checked with Whisper.
LINES = [
  ('hook', "Every October, crypto Twitter says the same word."),
  ('word', "Up... tober."),
  ('real', "But is it real? Or just a meme? We pulled every Bitcoin October since twenty thirteen."),
  ('stat', "Ten out of thirteen closed green. The average gain: almost twenty percent."),
  ('spark', "And most of them had a spark."),
  ('y2013', "Twenty thirteen. The FBI shut down Silk Road, and Bitcoin fell twenty percent in hours. Then demand from China took over. October closed up sixty-one percent."),
  ('y2017', "Twenty seventeen. On Halloween, CME announced Bitcoin futures. Wall Street was coming. Up forty-eight."),
  ('y2019', "Twenty nineteen. China's leadership embraced blockchain, and Bitcoin jumped more than forty percent in a day."),
  ('y2020', "Twenty twenty. PayPal let its users buy Bitcoin. Up twenty-eight."),
  ('y2021', "Twenty twenty-one. The first US Bitcoin ETF started trading, and Bitcoin hit a new all-time high. Up forty."),
  ('y2023', "Twenty twenty-three. Wall Street's biggest asset managers lined up for spot ETFs. Up twenty-eight."),
  ('y2025', "But twenty twenty-five broke the streak. A tariff shock wiped out nineteen billion dollars of leveraged bets in a single day. October closed red."),
  ('which', "So which month is actually the best?"),
  ('nov', "November has the biggest average, mostly thanks to one wild year."),
  ('oct', "But the most reliable? October. The highest typical gain of any month."),
  ('end', "History rhymes. It doesn't promise. Whatever this October brings, be ready on Hotcoin."),
]
out = []
for id_, text in LINES:
    a, sr = k.create(text, voice='af_heart', speed=1.0, lang='en-us')
    sf.write(f'public/uptober/vo/{id_}.wav', a, sr)
    out.append({'id': id_, 'text': text, 'dur': round(len(a) / sr, 3)})
    print(id_, out[-1]['dur'])
json.dump(out, open('public/uptober/vo/lines.json', 'w'), indent=1)
print('total', round(sum(o['dur'] for o in out), 1))
