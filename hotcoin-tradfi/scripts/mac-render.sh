#!/usr/bin/env bash
# Render a three.js shot on your Mac's GPU, then the Remotion video.
# usage: bash scripts/mac-render.sh <page> <lastFrame> <Composition> [query]
#   e.g. bash scripts/mac-render.sh glass 599 P4Glass sub=8
set -e
cd "$(dirname "$0")/.."
PAGE=$1; LAST=$2; COMP=$3; QUERY=${4:-sub=8}
[ -z "$COMP" ] && { echo "usage: bash scripts/mac-render.sh <page> <lastFrame> <Composition> [query]"; exit 1; }
command -v node >/dev/null || { echo "Node.js is missing. Install the LTS version from https://nodejs.org and run this again."; exit 1; }
[ -d node_modules ] || npm install
[ -d node_modules/playwright ] || npm install --no-save playwright
npx playwright install chromium

# local web server for the three.js page
python3 -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1 &
SRV=$!; trap 'kill $SRV 2>/dev/null' EXIT; sleep 1

# frames, in two parallel halves (the GPU is shared, more workers do not help much)
OUT=public/promo4/${PAGE}frames; mkdir -p "$OUT"
HALF=$((LAST / 2))
node promo4/frames.js "$PAGE" "$OUT" 0 "$HALF" "$QUERY" & A=$!
node promo4/frames.js "$PAGE" "$OUT" $((HALF + 1)) "$LAST" "$QUERY" & B=$!
wait $A; wait $B

# final video
mkdir -p out/promo4
npx remotion render src/index.ts "$COMP" "out/promo4/$COMP.mp4" --codec=h264 --crf=16
echo; echo "Done: $(pwd)/out/promo4/$COMP.mp4"
open out/promo4 2>/dev/null || true
