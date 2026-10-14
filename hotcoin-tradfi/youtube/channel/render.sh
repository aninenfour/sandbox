#!/usr/bin/env bash
# Renders the channel art in brand.html to out/*.png at YouTube's sizes.
# Headless Chromium's viewport is shorter than --window-size, so render taller and crop.
set -e
cd "$(dirname "$0")"
CH=${CHROME:-$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1)}
mkdir -p out
shot() { # design width height out [transparent]
  "$CH" --headless --no-sandbox --disable-gpu --hide-scrollbars --allow-file-access-from-files --force-device-scale-factor=1 \
    ${5:+--default-background-color=00000000} --virtual-time-budget=4000 --window-size=$2,$(( $3 + 300 )) --screenshot="out/$4" "file://$PWD/brand.html?d=$1" 2>/dev/null
  python3 -c "import sys; from PIL import Image; p,w,h=sys.argv[1],int(sys.argv[2]),int(sys.argv[3]); Image.open(p).crop((0,0,w,h)).save(p)" "out/$4" $2 $3
  echo "out/$4"
}
shot pfp 800 800 profile-800.png
shot watermark 150 150 watermark-150.png t
shot wordmark 1400 300 wordmark-white.png t
shot wordmarkDark 1400 300 wordmark-ink.png t
shot banner 2560 1440 banner-2560x1440.png
shot bannerSafe 1546 423 banner-phone-preview.png
# YouTube's banner limit is 6 MB; the PNG is just over, so ship a high-quality JPG
python3 -c "from PIL import Image; Image.open('out/banner-2560x1440.png').convert('RGB').save('out/banner-2560x1440.jpg', quality=92)" && rm out/banner-2560x1440.png
for w in out/wordmark-*.png; do python3 -c "import sys; from PIL import Image; im=Image.open(sys.argv[1]); im.crop(im.getbbox()).save(sys.argv[1])" $w; done
shot pfpSmall 1100 220 profile-sizes-preview.png
