#!/usr/bin/env bash
# SFX for src/r10/R10Ambassador.tsx (Mixkit free sound effects licence: commercial use, no attribution needed).
# Each was checked with CLAP zero-shot tagging (laion/clap-htsat-unfused) before use; see FOOTAGE_CREDITS.md.
set -e
mkdir -p public/sfx/r10
get() { curl -sfL -o "public/sfx/r10/$2" "https://assets.mixkit.co/active_storage/sfx/$1/$1-preview.mp3"; }
get 616 whistle.mp3; get 2112 kick.mp3; get 3022 crowd.mp3; get 1492 whoosh-fast.mp3
get 1489 whoosh-soft.mp3; get 2350 sparkle.mp3; get 1143 impact.mp3
