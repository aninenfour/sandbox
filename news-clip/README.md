# News-clip reels (test, Nov 23, 2026)

Owner brief (Nov 23): one video every 3 days (changed from 2 the same day), clean text over real footage of real people (news or archive, e.g. early
conversations about crypto), human-centric, clipped like news accounts do. Reference: evolving.ai style (footage on top,
black panel, divider with logo, big uppercase headline).

Format (make.py): 1080x1920, 30 fps, footage fills the top 1180 px, black panel with white divider + Hotcoin logo,
lime JetBrains Mono kicker (date · place), Inter Tight 900 uppercase headline (key words lime), word-timed subtitles
(white, black outline) from faster-whisper, original audio loudness-normalised to -14 LUFS. Frame 1 shows the full design.

Build: `cd news-clip && python3 make.py clips/<slug>/clip.json` -> out/<slug>.mp4 (see make.py docstring for clip.json).
Transcribe: `python3 transcribe.py src/x.wav src/x.txt base.en` (faster-whisper, word timestamps, VAD).

Footage access from the cloud sandbox (Nov 23):
- YouTube: blocked (bot check / 429), yt-dlp can't fetch.
- archive.org: works. Many YouTube mirrors (`youtube-<id>` items) and conference/talk uploads download fine.
- TV News Archive (CNBC/Bloomberg recordings): access-restricted, do not use.
- Fed video API: not used (blocked by the session's permission check).
So same-week news footage of the people in the story is the gap; archive footage tied to this week's news is what works today.
