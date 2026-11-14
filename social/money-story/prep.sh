#!/usr/bin/env bash
# Downloads the public-domain source films (Prelinger Archives, archive.org) and cuts the clips used in the money story video.
# "Nation's Market Place" (1932, NYSE) and "Doubtful Dollars" (1945, public domain mark) . Output: assets/clips/<name>/%04d.jpg (gray, 640x480, 30fps).
set -e
cd "$(dirname "$0")"; mkdir -p assets/src assets/clips
N=assets/src/nations_market_place.mp4; D=assets/src/doubtful_dollars.mp4
[ -s $N ] || curl -sSL -o $N https://archive.org/download/0474_Nations_Market_Place_01_11_58_00/0474_Nations_Market_Place_01_11_58_00_3mb.mp4
[ -s $D ] || curl -sSL -o $D https://archive.org/download/doubtful_dollars/doubtful_dollars.mp4
cut() { mkdir -p assets/clips/$1; rm -f assets/clips/$1/*; /usr/bin/ffmpeg -y -loglevel error -ss $3 -t $4 -i $2 -vf "fps=30,scale=640:480,format=gray" -q:v 2 assets/clips/$1/%04d.jpg; }
cut street $N 70 5;  cut floor $N 126 7;  cut brokers $N 188 8;  cut clock $N 233.8 1.35
cut floor2 $N 898.5 4.5;  cut crowd $N 790 10;  cut press $N 1078 10
cut money $D 489 10;  cut hands $D 304 6
/usr/bin/ffmpeg -y -loglevel error -ss 840 -i $D -frames:v 1 -vf format=gray assets/clips/bill.png
curl -sS -o assets/btc1d.json "https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=75&endTime=1795132800000"
# Sound effects: Kenney "RPG Audio" and "Impact Sounds" (CC0, kenney.nl). Only the files the score uses are kept, as 48 kHz mono wav.
if [ ! -s assets/sfx/bookPlace1.wav ]; then
  mkdir -p assets/sfx assets/kenney; J=assets/kenney/cj.txt
  for p in rpg-audio impact-sounds; do
    id=$(curl -sS -A "Mozilla/5.0" -c $J -b $J "https://kenney.nl/assets/$p" | grep -oE "data-download-id='[^']+'" | head -1 | cut -d"'" -f2)
    u=$(curl -sS -A "Mozilla/5.0" -c $J -b $J -H "Referer: https://kenney.nl/assets/$p" "https://kenney.nl/download-link/$id" | python3 -c "import json,sys;print(json.load(sys.stdin)['url'])")
    curl -sSL -A "Mozilla/5.0" -c $J -b $J -H "Referer: https://kenney.nl/assets/$p" -o assets/kenney/$p.zip "$u"
    python3 -I -c "import zipfile,sys;zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])" assets/kenney/$p.zip assets/kenney/$p
  done
  for f in rpg-audio/Audio/{bookFlip1,bookFlip2,bookFlip3,bookPlace1,bookPlace2,bookPlace3,cloth1,cloth2,cloth3,cloth4,handleCoins,handleCoins2}.ogg \
           impact-sounds/Audio/{impactSoft_heavy_000,impactSoft_heavy_002,impactSoft_medium_001,impactWood_light_000,impactWood_light_002}.ogg; do
    /usr/bin/ffmpeg -y -loglevel error -i assets/kenney/$f -ar 48000 -ac 1 assets/sfx/$(basename $f .ogg).wav; done
fi
echo prepared
