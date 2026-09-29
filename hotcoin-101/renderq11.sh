#!/bin/bash
cd /home/claude/hotcoin-101
BE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
npx remotion render bundle what-an-index-measures-vertical out/hotcoin-101-ep11-index-9x16.mp4 --browser-executable=$BE --concurrency=2 --log=error
npx remotion render bundle what-an-index-measures-horizontal out/hotcoin-101-ep11-index-16x9.mp4 --browser-executable=$BE --concurrency=2 --log=error
echo RENDER_DONE
