#!/usr/bin/env bash
# Masters a Remotion render for social: loudness-normalised to -16 LUFS / -1.5 dBTP, then a <30 MB share copy.
# Usage: scripts/master.sh out/name.mp4   -> out/name-master.mp4 and out/name-share.mp4
set -euo pipefail
B=node_modules/@remotion/compositor-linux-x64-gnu
export LD_LIBRARY_PATH=$PWD/$B
in=$1; base=${in%.mp4}
$B/ffmpeg -v error -y -i "$in" -c:v copy -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 256k "$base-master.mp4"
$B/ffmpeg -v error -y -i "$base-master.mp4" -c:v libx264 -crf 21 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a copy "$base-share.mp4"
