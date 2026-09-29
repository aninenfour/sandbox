#!/bin/bash
cd /home/claude/hotcoin-101
BE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
npx remotion render bundle candlestick-vertical out/hotcoin101-ep03-candlestick-9x16.mp4 --browser-executable=$BE --concurrency=2 --log=error
npx remotion render bundle candlestick-horizontal out/hotcoin101-ep03-candlestick-16x9.mp4 --browser-executable=$BE --concurrency=2 --log=error
npx remotion render bundle wagmi-ngmi-vertical out/hotcoin101-ep02-jargon-9x16.mp4 --browser-executable=$BE --concurrency=2 --log=error
npx remotion render bundle wagmi-ngmi-horizontal out/hotcoin101-ep02-jargon-16x9.mp4 --browser-executable=$BE --concurrency=2 --log=error
npx remotion render bundle history-of-investment-vertical out/hotcoin101-ep01-history-9x16.mp4 --browser-executable=$BE --concurrency=2 --log=error
npx remotion render bundle history-of-investment-horizontal out/hotcoin101-ep01-history-16x9.mp4 --browser-executable=$BE --concurrency=2 --log=error
echo ALLDONE
