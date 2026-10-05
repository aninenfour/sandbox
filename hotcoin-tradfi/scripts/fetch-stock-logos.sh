#!/usr/bin/env bash
# Stock logos for the trade carousel, from financialmodelingprep.com's public image-stock endpoint.
mkdir -p public/trade/logos
for t in TSLA NVDA SNDK MU SPY; do curl -sS -o public/trade/logos/$t.png "https://financialmodelingprep.com/image-stock/$t.png"; done
