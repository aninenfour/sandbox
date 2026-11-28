# Platform announcements for social media

One folder per announcement: `YYYY-MM-DD-<slug>/` with `ann.json` (image text), `en.md` (post text) and the rendered images.

Render all four images (lime and black, each plain and with the 9th-anniversary Ronaldinho footer):

    PW_PATH=$(npm root -g)/playwright node social/announcements/template/ann.mjs $PWD/social/announcements/<folder> <scratch-dir>

Reusable assets in `template/`: `bg-lime-1600x900.png` and `bg-dark-1600x900.png` (halftone backgrounds, rebuild with `make_bg.py lime|dark`),
`ronaldinho-cutout.png` (cutout from the official 9th-anniversary creative, head rises above the footer band), `symbol-black.png`.
Always copy contract addresses from the source announcement and check them character by character.

## Publishing to X: long posts

- X cuts anything over 280 characters unless the post is sent as a long post. For every X post longer
  than 280 (count links as 23), pass `network_options: {"details": {"type": "long_post"}}` in
  `submit_publer_posts`. It needs X Premium on the account; Hotcoin 🟩 has it.
- After publishing, read the post back (`list_publer_posts`, state published) and compare the caption
  with what was sent. If X shows a "Show more" cut where it shouldn't, fix it right away.
- 2026-11-28: the Dec 3 delisting post went out cut on X because this option was missing (fixed by hand).
