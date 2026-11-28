# LinkedIn: daily runbook

Read linkedin/STRATEGY.md (owner decisions at the top win), linkedin/LOG.md and the tracker before you make anything.
Tracker (Claude Sheets, edit via the Claude Docs connector): https://claude.ai/artifact/R7pmTZfEGjH8Kp1DyLf4x5
Publer: workspace "hotcoin", LinkedIn account "Hotcoin (LinkedIn)". All times Beijing (UTC+8).

## Daily run (every day, morning Beijing time)
1. Check Publer: what is scheduled today on LinkedIn (and other channels, so nothing collides within 15 min), and
   what LinkedIn published yesterday (get_post_insights / analyze_recent_performance for impressions, reactions,
   comments, reposts). Update the tracker: Status (Published / Failed), Link, metrics, notes.
2. Plan today from the weekly calendar in STRATEGY.md section 4 and the "Next up" list in LOG.md: 2 posts on weekdays
   (13:00 Asia, 22:30 Europe/US), an event post at 18:00 on Mon/Wed/Fri, 1 light post Saturday, rest Sunday, videos
   Mon/Wed/Fri alternating how-to and archive, plus a "Hiring, then and now" episode every 3 days (owner, Nov 28).
   Never repeat a layout or theme used in the last 7 days.
3. Events: pull live campaigns from our own recent Publer posts (exact reward names, end dates, links). Chinese links
   use hotcoinv5.com, English hotcoin.com.
4. Make it:
   - Covers: linkedin/covers/render.mjs (grain or photo style; official logo files only).
   - Carousels: linkedin/carousels/slides.mjs (add a deck), 1080x1350, export JPG pages.
   - Videos: how-to in the mixed style (linkedin/videos/onepct-v3.mjs as template), archive via news-clip (layout
     "li45"). Check contact sheets of every scene and the last frame before scheduling.
   - "Hiring, then and now" episode every 3 days (next dates in LOG.md "Next up"): pick a scene from a public-domain
     film in linkedin/videos/src/pd (Prelinger, CC public domain mark; download + transcribe with
     news-clip/transcribe.py if missing), write linkedin/videos/episodes/epN.json (segments, 3 red flags, 3 tips,
     roles from the latest Moledao scan), run node linkedin/videos/thennow.mjs <ep.json>, check stills, credit the
     film in FOOTAGE_CREDITS.md. Caption: hook, the 3 flags, 3 tips, roles + Moledao link + "DM us", question,
     film credit, 10 to 12 hashtags. Slot: 21:00 by default; if the day already has a post within 3 h, use 18:00
     or 13:00 and drop that day's static post (max 3 LinkedIn posts a day, at least 3 h apart).
   - Verify every number with a source and date; note sources in the render script.
5. Host media publicly so Publer can fetch it: fal upload_file with prepare_upload, then curl PUT the bytes, then use
   the file_url. Publer does not import PDFs from a link: send carousels as media_urls (JPG pages), post_type
   "document" (Publer stores it as a multi-image post, which LinkedIn shows as a swipeable gallery).
6. Schedule with submit_publer_posts (when "schedule", account id of Hotcoin LinkedIn, ISO time with +08:00).
   Check the queue afterwards. Add a tracker row per post (Status "Scheduled").
7. Commit render scripts and copy (not media) and push. Log anything new in LOG.md.

## Weekly review (Monday)
- Pull last 7 days from Publer, fill the tracker, add the week to LOG.md: top 3 and bottom 3 posts, followers gained.
- Change at least two things for the new week (theme, format, hook type, cover style, time slot) and write them into
  STRATEGY.md "Owner decisions" or the calendar, with the reason from the numbers.
- Rescan Moledao (moledao.io/companies/hotcoin/jobs/): new or closed roles. If anything changed, make a new hiring
  carousel (never reuse last week's cover).
- Plan the week in LOG.md "Next up".

## Quality bar (every post)
No em dashes. Hook in the first two lines. One hero per cover. Faces and real photos welcome. True numbers with a date.
Risk line on futures, Earn and price posts. Reply to comments within the day.
