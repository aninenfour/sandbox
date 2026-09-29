#!/bin/bash
cd /home/claude/hotcoin-101
BE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
npx remotion render bundle leverage-is-a-clock-vertical out/raw-12-9x16.mp4 --browser-executable=$BE --concurrency=2 --log=error
npx remotion render bundle leverage-is-a-clock-horizontal out/raw-12-16x9.mp4 --browser-executable=$BE --concurrency=2 --log=error
echo RENDER_DONE
