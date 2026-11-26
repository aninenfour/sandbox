# Option B, richer backgrounds (B1, B2)

Owner feedback on B: "second is fine, but bg is too simple". Content and layout are unchanged from B;
only background layers are added under the content (plus a soft green rim light on the Bezos cut-out).
Build: `python3 build_B.py [dir with p1.jpg p2.jpg p3.jpg]` (the dir is only needed to re-grade the photos).

- B1 "Market texture": deep black radial base, fine 60 px grid and large BTC candlesticks + price line
  (26 log-scale candles from whatif.json series) at very low opacity, 3 green light blooms per frame,
  faint floor reflection under the glass card (frame 2), film grain (grain.png) and vignette.
- B2 "Photo depth": real Unsplash photos, blurred and duotone graded to brand black/green (bgphoto_{1,2,3}.jpg),
  extra shade where the copy sits, same grain, vignette and card reflection.

Grain sits under the content so faces and type stay clean.

## Photo credits (Unsplash License, free to use)
- Frame 1, printing press: Aleksandr Galichkin, https://unsplash.com/photos/QRykXu51r_0
- Frame 2, trading screens: Jakub Zerdzicki, https://unsplash.com/photos/vKNRKjSNbTo
- Frame 3, green bokeh: Amit Sen, https://unsplash.com/photos/wktVEK7k-pI

## v2 copy: full sentences (owner feedback "don't cut phrases")
Applied to both B1 and B2; backgrounds, cut-out, safe zones and the CTA frame (3) are unchanged.
Overview: `options_B_v2.jpg` (rows B1, B2).
- Frame 1: "Bezos spent $250M / on a newspaper" + small round Washington Post badge, then
  "What if he just bought / Bitcoin instead?" (Bitcoin in brand green). Headline 96 px, question 66 px, starts y=1040.
- Frame 2: pill "What if"; card reads "Bitcoin bought in Oct 2013", "The same $250M in Bitcoin is worth" + $115B,
  "461x more than he paid".

## Washington Post logo
`wapo_wp.png` is the paper's own "wp" app/site icon (256x256 PNG), unmodified, shown clipped to a circle.
Source: the icon washingtonpost.com publishes, fetched via Google's favicon service
(https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=https://www.washingtonpost.com&size=256),
cross-checked against https://www.washingtonpost.com/favicon.ico (same mark, 48 px). washingtonpost.com itself
blocks scripted page fetches, and the Commons API was rate-limited (429); the Commons files for the paper
(File:The_Washington_Post_logo.svg) are the long wordmark, too wide for a small badge.
Trademark of The Washington Post, used here only to identify the paper in an editorial reference.
