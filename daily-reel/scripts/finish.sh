#!/usr/bin/env bash
# Render the reel, lay a quiet music bed under it, normalise loudness for social.
# Usage: scripts/finish.sh <slug> [music-name]
# Music defaults to a daily rotation through public/music/*.mp3.
set -euo pipefail
SLUG=$1
cd "$(dirname "$0")/.."
mkdir -p out
TRACKS=(public/music/*.mp3)
if [ "${2:-}" ]; then MUSIC=public/music/$2.mp3; else MUSIC=${TRACKS[$(( $(date +%j | sed 's/^0*//') % ${#TRACKS[@]} ))]}; fi
echo "music: $MUSIC"

[ "${SKIP_RENDER:-}" ] || npx remotion render src/index.ts Reel out/raw.mp4 --codec=h264 --crf=18 --concurrency="$(nproc)" --log=error

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/raw.mp4)
FADE=$(python3 -c "print(max(0, $DUR - 2.0))")
# music: level it to about -30 LUFS so it sits well under the voice, fade in/out, then
# master the whole mix to -14 LUFS / -1.5 dBTP (Instagram / TikTok norm)
ffmpeg -v error -y -i out/raw.mp4 -stream_loop -1 -i "$MUSIC" -filter_complex \
  "[1:a]atrim=0:$DUR,loudnorm=I=-30:TP=-9:LRA=11,afade=t=in:d=0.6,afade=t=out:st=$FADE:d=2[m];\
   [0:a][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
  -map 0:v -map "[a]" -c:v libx264 -preset veryfast -crf 21 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart "out/$SLUG.mp4"
rm -f out/raw.mp4
ls -la "out/$SLUG.mp4"
