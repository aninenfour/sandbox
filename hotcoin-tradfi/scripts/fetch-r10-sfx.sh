#!/usr/bin/env bash
# SFX for src/r10/R10Ambassador.tsx (Mixkit free sound effects licence: commercial use, no attribution needed).
# Each was checked with CLAP zero-shot tagging (laion/clap-htsat-unfused) before use; see FOOTAGE_CREDITS.md.
set -e
mkdir -p public/sfx/r10
get() { curl -sfL -o "public/sfx/r10/$2" "https://assets.mixkit.co/active_storage/sfx/$1/$1-preview.mp3"; }
get 1808 clunk.mp3; get 2112 kick.mp3; get 3022 crowd.mp3; get 1492 whoosh-fast.mp3
get 1489 whoosh-soft.mp3; get 2350 sparkle.mp3; get 1143 impact.mp3
# floodlight clunk is quiet in the source: normalise it
/usr/bin/ffmpeg -v error -y -i public/sfx/r10/clunk.mp3 -af loudnorm=I=-16:TP=-1 -ar 48000 public/sfx/r10/clunk.wav && rm public/sfx/r10/clunk.mp3
python3 scripts/make-foley.py   # foley/hit.wav
mkdir -p public/music && curl -sfL -o public/music/r10-spanish-heart.mp3 https://assets.mixkit.co/music/974/974.mp3
