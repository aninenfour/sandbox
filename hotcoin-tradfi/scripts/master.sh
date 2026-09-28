#!/usr/bin/env bash
# Masters a Remotion render: +12 dB on the SFX bus (renders come out near -36 LUFS), then a <30 MB share copy.
# Usage: scripts/master.sh out/name.mp4   -> out/name-master.mp4 and out/name-share.mp4
set -euo pipefail
B=node_modules/@remotion/compositor-linux-x64-gnu
export LD_LIBRARY_PATH=$PWD/$B
in=$1; base=${in%.mp4}
$B/ffmpeg -v error -y -i "$in" -c:v copy -af volume=12dB -c:a aac -b:a 192k "$base-master.mp4"
$B/ffmpeg -v error -y -i "$base-master.mp4" -c:v libx264 -crf 22 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a copy "$base-share.mp4"
