#!/usr/bin/env bash
# Put a poster over the first frames of a video so every platform preview shows it, without making the video longer:
# poster fully visible for 0.4 s, then fades out over 0.2 s into the film's opening. Audio untouched.
# Usage: scripts/bake-r10-poster.sh poster.png in.mp4 out.mp4   (posters: compositions R10AuraPoster / R10CampaignPoster, --scale=2)
set -e
/usr/bin/ffmpeg -v error -y -i "$2" -loop 1 -t 0.6 -framerate 30 -i "$1" -filter_complex \
  "[1:v]scale=1920:1080:flags=lanczos,format=rgba,fade=t=out:st=0.4:d=0.2:alpha=1,setpts=PTS-STARTPTS[p];[0:v][p]overlay=0:0:eof_action=pass,format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:v libx264 -crf 17 -preset slow -c:a copy -movflags +faststart "$3"
