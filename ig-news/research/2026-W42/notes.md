# Week 2026-W42: first learning loop (Oct 18)

Scanned 205 Shorts from 7 working finance/crypto channels (5 handles returned nothing: BitBoy, Max Maher, MMM, Nate O'Brien, Kevin Paffrath; replace next week).

## Top breakouts (outlier score = views / channel median)
| score | views | channel | title | format · technique |
|---|---|---|---|---|
| 41.1x | 1.5M | Graham Stephan | Ranking The BEST Credit Cards 💳 | tier list S–F filling up item by item; title pill on every frame |
| 12.7x | 1.2M | Humphrey Yang | Selling my Diet Coke Silver Bar 👀 | odd object + "what's it worth?" reveal |
| 10.2x | 373K | Graham Stephan | Ranking The BEST Money Books 📚 | tier list again |
| 9.5x | 348K | Graham Stephan | Buying A House In Cash?! | reacting to a clip; big-number premise |
| 9.4x | 25M | Mark Tilbury | Hater challenges millionaire (to sell a pen) | street challenge, conflict |
| 6.5x | 238K | Graham Stephan | Ranking Money Habits 💰 | tier list again |
| 6.0x | 378K | Andrei Jikh | The Global Debt Spiral Has Started | bold macro claim, word-by-word captions |
| 5.9x | 372K | Andrei Jikh | $140K Is The New Poor | big number + contrarian claim |
| 5.5x | 348K | Andrei Jikh | China's Plan to Destroy the Dollar | villain/stakes framing |
| 5.4x | 33K | Coin Bureau | Trump's crypto U-turn | famous name + reversal |
| 3.9x | 21K | Crypto Banter | Bitcoin Won't 100x Anymore | contrarian claim about BTC |

## Patterns (repeat across channels)
1. **Ranking / tier lists** (3 of the top 6): the S–F board fills one item at a time, so viewers stay to see where the next one lands.
2. **Bold claim with a number** ("$140K is the new poor", "Bitcoin won't 100x anymore"): a contrarian statement, not a question.
3. **Persistent title pill**: the topic stays on screen the whole video, so people who land mid-loop know what they're watching.

## Shipped
- `reel.py`: tier-list Reel format (`"tier"` spec + `{"kind":"tier_all"}`, one reveal per item, legend, newest item ringed) and an optional persistent title pill (`"title"`).
- First tier-list Reel built from real data: "Ranking 10 assets by 1-year return" (Yahoo Finance, crypto cross-checked on CoinGecko), scheduled Sun 21:30.
- STYLE_NOTES: "bold claim with a number" hook pattern.

## Experiment for W43
2 of the 7 Reels use the tier-list format (always ranked by real data). Judge on reach + saves vs the list/photo Reels.
