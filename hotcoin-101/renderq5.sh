#!/bin/bash
cd /home/claude/hotcoin-101
BE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
npx remotion render bundle stock-exchange-vertical out/hotcoin101-ep05-exchange-9x16.mp4 --browser-executable=$BE --concurrency=2 --log=error
npx remotion render bundle stock-exchange-horizontal out/hotcoin101-ep05-exchange-16x9.mp4 --browser-executable=$BE --concurrency=2 --log=error
echo ALLDONE
