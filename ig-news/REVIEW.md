# Daily review: social media lead for @hotcoinex

Runs once a day (06:50 UTC+8), before the 07:40 news run. Goal: make the desk a bit better each day, or
change nothing when nothing needs changing. Skipping is a valid outcome.

## 0. Setup
```bash
cd /home/user/sandbox && git checkout claude/ig-news-automation && git pull --ff-only origin claude/ig-news-automation
python3 -c "import playwright" 2>/dev/null || pip install -q playwright==1.49.1
```
Read `ig-news/PLAYBOOK.md`, `ig-news/STYLE_NOTES.md`, `ig-news/state/log.json`, `ig-news/state/review_log.json` (if present).

## 1. Look at the numbers (Publer)
- `analyze_recent_performance` / `get_post_insights` for **Hotcoin Exchange (Instagram)** and **Hotcoin (Facebook)**, last 7 days.
- For each desk post (ids in log.json) note reach, likes, comments, saves, shares; compare news vs tutorial vs weekly, and against Hotcoin's other IG posts.
- Posts younger than 24 h: too early to judge, look but don't conclude.
- Mondays only: `get_best_times_to_post` (IG, 30 days). Move a slot only if the data clearly says so.

## 2. Look at yesterday's work
- Open every slide and Story the desk rendered in the last 24 h (`ig-news/media/<id>/`). Check: clipped or overlapping text, a face covered by an inset, low-res or off-topic photos, awkward line breaks, repeated words, stale numbers on the CTA card.
- Re-read every hook (cover + caption line 1) against STYLE_NOTES. Write a better version for each one that could be simpler or catchier.

## 3. Decide
Ask: is there **one or two** changes that would clearly make tomorrow's posts better? Examples:
- a recurring visual bug → fix it in `render.py` / `extra_templates.py` / `cta.py`, re-render one recent post to prove it, look at it
- weak hooks → add a rule + before/after example to STYLE_NOTES
- a format clearly beating others → shift the mix or slide structure in PLAYBOOK
If nothing clears that bar, change nothing.
Limits: at most 2 changes a day (so their effect can be seen); never touch facts already verified; don't edit or delete posts that are already published; a not-yet-published post may only be fixed for a real error (wrong fact, broken render), using the draft-and-reschedule procedure in PLAYBOOK §8.

## 4. Record
- Append to `ig-news/state/review_log.json`: `{"date", "metrics_summary", "findings":[...], "changes":[...], "skipped": bool}`.
- If rules changed: add a dated line to STYLE_NOTES "Changelog".
- Commit and push to `claude/ig-news-automation`.
- End with at most 3 lines: what you looked at, what you changed (or "no change needed"), and any idea that needs the owner's decision (e.g. new format, budget, new channel). Don't make those decisions yourself.
