# Platform announcements for social media

One folder per announcement: `YYYY-MM-DD-<slug>/` with `ann.json` (image text), `en.md` (post text) and the rendered images.

Render both images (plain and with the 9th-anniversary Ronaldinho footer):

    PW_PATH=$(npm root -g)/playwright node social/announcements/template/ann.mjs $PWD/social/announcements/<folder> <scratch-dir>

Reusable assets in `template/`: `bg-lime-1600x900.png` (halftone background, rebuild with `make_bg.py`),
`ronaldinho-footer.png` (soft-edged crop from the official 9th-anniversary creative), `symbol-black.png`.
Always copy contract addresses from the source announcement and check them character by character.
