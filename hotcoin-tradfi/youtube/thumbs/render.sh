#!/usr/bin/env bash
# Renders each thumbnail design in thumb.html to out/<name>.png (1280x720).
# Headless Chromium's viewport is shorter than --window-size, so render taller and crop to 1280x720.
set -e
cd "$(dirname "$0")"
CH=${CHROME:-$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1)}
mkdir -p out
for t in ${@:-silver coffee gold}; do
  "$CH" --headless --no-sandbox --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --virtual-time-budget=6000 --window-size=1280,900 --screenshot="out/$t.png" "file://$PWD/thumb.html?t=$t" 2>/dev/null
  python3 -c "import sys; from PIL import Image; p=sys.argv[1]; Image.open(p).convert('RGB').crop((0,0,1280,720)).save(p)" "out/$t.png"
  echo "out/$t.png"
done
