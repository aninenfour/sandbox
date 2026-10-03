# Rowing meme: how the head tracks were made
Source clip: `public/rowing/source.mp4` (the user's upload, gitignored). Run these in order from a scratch folder:

1. **`ptrack.py`:** YOLOv8m-pose with BoT-SORT on every frame, giving `ptrack.json`.
2. **`track2.py`:** OpenCV CSRT trackers for the SOL, DOGE and PEPE rowers, giving `others.json`.
3. **`keys.json`:** hand-placed head positions of the working rower (BTC), every 15 frames.
4. **`fill.py`:** CSRT between keyframes, drift-corrected to each key, giving `btc.json`.
5. **`eth.py`:** the ETH rower is the upright face behind. It follows the nearest pose face and never takes one near the worker, writing into `others.json`.
6. **`fuse.py`:** the worker is the pose face nearest the keyframe path, skipping the ETH rower's face. It falls back to `btc.json`, giving `btc2.json`.

`src/rowing/track.json` combines `btc2.json` and `others.json`.
