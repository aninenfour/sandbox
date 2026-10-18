# Weekly learning loop: study what's working, then upgrade the desk

Runs every **Monday 06:20 UTC+8** (before the daily review). Goal: get measurably better every week by studying
breakout short-form finance content and our own numbers, then shipping 1–3 concrete upgrades.
Idea source: analyse ~20 top videos at once (topic, format, hook, script technique) and look for non-obvious patterns.

## 1. Scan (5 min)
```bash
cd /home/user/sandbox && git checkout claude/ig-news-automation && git pull --ff-only origin claude/ig-news-automation
python3 ig-news/tools/trend_scan.py 30 20      # -> ig-news/research/<YYYY-Www>/NN-<id>.jpg + scan.json
```
- `trend_scan.py` lists the latest Shorts of every creator in `research/channels.txt`, scores each against its own
  channel's median views (an "outlier score", so a 40x hit on a small channel counts as much as on a big one), keeps the top 20,
  and saves cover + 3 frames per video. YouTube blocks video/caption downloads from this server: work from title, frames, numbers.
- Channels printed as `skip` returned nothing: fix the handle or replace it (keep ~10 working finance/crypto creators).
- Add our own side: Publer `get_post_insights` for Hotcoin Exchange (Instagram) and Hotcoin (Facebook), last 7 days, sorted by reach
  and by saves. Note which desk formats won and lost.

## 2. Analyse (look at every sheet)
For each of the 20 videos write one line: **topic · format · hook (title + cover text) · technique** (e.g. tier list that fills up,
object reveal, big-number contrarian claim, reaction/split-screen, persistent title pill, word-by-word captions, data screenshot).
Then answer:
1. Which 2–3 patterns repeat across *different* channels? (A pattern on one channel only is that creator's style, not a trend.)
2. Which of them can our photo-slideshow Reels and carousels copy cheaply, with real data and no hype?
3. What did our own best and worst post of the week have in common?

## 3. Ship 1–3 upgrades (same day)
- A new or changed format → implement it in `reel.py` / `render.py` / `extra_templates.py`, build a real example, look at the frames.
- A hook/visual rule → add it to `STYLE_NOTES.md` with a before → after example.
- A rotation change → edit `PLAYBOOK.md` §7b or the slot plan.
- Pick **one experiment** for the coming week (e.g. "2 of 7 Reels use the tier-list format") and write how we'll judge it
  (reach, saves, comments vs the previous 7 days).
Facts stay verified as always; never copy another creator's content, only the format idea.

## 4. Record
- `ig-news/research/<YYYY-Www>/notes.md`: the 20 one-liners, the patterns, what we shipped, the experiment.
- Append to `ig-news/state/learn_log.json`: `{"week","patterns":[...],"shipped":[...],"experiment","last_experiment_result"}`.
- Judge last week's experiment first: keep, change or drop it.
- Commit and push. End with ≤3 lines: patterns found, what shipped, the experiment for this week.
