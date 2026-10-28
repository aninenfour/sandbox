#!/usr/bin/env bash
# Render the text-only cover (no logo) from episode.json "thumb" → out/<slug>-thumb.jpg
# Usage: scripts/thumb.sh episodes/<dir>
set -euo pipefail
EP=$1
cd "$(dirname "$0")/.."
SLUG=$(python3 -c "import json,sys;print(json.load(open('$EP/episode.json'))['slug'])")
mkdir -p out
python3 -c "import json;json.dump(json.load(open('$EP/episode.json'))['thumb'],open('out/thumb-props.json','w'))"
npx remotion still src/index.ts Thumb out/thumb.png --props=out/thumb-props.json --log=error
ffmpeg -v error -y -i out/thumb.png -q:v 2 "out/$SLUG-thumb.jpg"
rm -f out/thumb.png out/thumb-props.json
ls -la "out/$SLUG-thumb.jpg"
