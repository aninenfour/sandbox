#!/usr/bin/env bash
# Bake a poster into the start of a video so every platform preview shows it (0.5 s hold + 0.2 s dissolve, audio shifted).
# Usage: scripts/bake-r10-poster.sh poster.png in.mp4 out.mp4   (posters: compositions R10AuraPoster / R10CampaignPoster, --scale=2)
set -e
/usr/bin/ffmpeg -v error -y -loop 1 -t 0.7 -framerate 30 -i "$1" -i "$2" -filter_complex \
  "[0:v]scale=1920:1080:flags=lanczos,format=yuv420p,fps=30,setsar=1[p];[1:v]fps=30,format=yuv420p,setsar=1[v1];[p][v1]xfade=transition=fade:duration=0.2:offset=0.5[v];[1:a]adelay=500|500[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 17 -preset slow -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart -shortest "$3"
