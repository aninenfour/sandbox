# Platform announcements for social media

One folder per announcement: `YYYY-MM-DD-<slug>/` with `ann.json` (image text), `en.md` (post text) and the rendered images.

Render all four images (lime and black, each plain and with the 9th-anniversary Ronaldinho footer):

    PW_PATH=$(npm root -g)/playwright node social/announcements/template/ann.mjs $PWD/social/announcements/<folder> <scratch-dir>

Reusable assets in `template/`: `bg-lime-1600x900.png` and `bg-dark-1600x900.png` (halftone backgrounds, rebuild with `make_bg.py lime|dark`),
`ronaldinho-cutout.png` (cutout from the official 9th-anniversary creative, head rises above the footer band), `symbol-black.png`.
Always copy contract addresses from the source announcement and check them character by character.
