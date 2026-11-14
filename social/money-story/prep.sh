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
echo prepared
