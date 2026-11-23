#!/usr/bin/env python3
"""News-clip reel: real footage on top, Hotcoin headline panel below, burned subtitles.

Usage: python3 news-clip/make.py news-clip/clips/<slug>/clip.json  -> news-clip/out/<slug>.mp4

clip.json:
{
  "src": "news-clip/src/senate_first25.mp4",       # local video file
  "segments": [[542.0, 558.6], ...],                 # source in/out seconds, joined with hard cuts
  "transcript": "news-clip/src/senate.txt.json",     # faster-whisper json with word timings (for subtitles)
  "crop": "ih*1.0:ih:(iw-ow)/2:0",                    # optional ffmpeg crop before scaling into the footage box
  "kicker": "OCT 8, 2014 · SENATE OF CANADA",
  "headline": "12 years ago he told Canada's Senate why Bitcoin doesn't wait on central bankers",
  "hi": ["Bitcoin", "central bankers"],               # words shown in lime
  "sub_fix": {"unforgable": "unforgeable"}            # optional word fixes for subtitles
}
"""
import json, os, subprocess, sys, tempfile, re, html

FF = "/usr/bin/ffmpeg"
W, H = 1080, 1920
BOX_H = 1180          # footage box height (top of frame)
ROOT = os.path.dirname(os.path.abspath(__file__))
LOGO = os.path.join(ROOT, "..", "hotcoin-tradfi", "public", "brand", "logo-official-white.png")


def run(cmd):
    subprocess.run(cmd, check=True)


def esc(s):
    return html.escape(s)


def headline_html(text, hi):
    out = esc(text)
    for h in sorted(hi, key=len, reverse=True):
        out = re.sub(re.escape(esc(h)), lambda m: f'<span class="hi">{m.group(0)}</span>', out, flags=re.I)
    return out


def subs_from_transcript(tr, segments, fixes):
    """Group words into 2 to 4 word chunks on the output timeline."""
    words = []
    for s in tr:
        for w0, w1, w in s["words"]:
            words.append((w0, w1, w.strip()))
    chunks, offset = [], 0.0
    for a, b in segments:
        seg = [(w0 - a + offset, w1 - a + offset, w) for w0, w1, w in words if w0 >= a - 0.05 and w1 <= b + 0.15]
        cur = []
        for item in seg:
            cur.append(item)
            txt = " ".join(x[2] for x in cur)
            if len(cur) >= 4 or len(txt) > 22 or re.search(r"[.,?!;]$", item[2]):
                chunks.append([cur[0][0], cur[-1][1], txt]); cur = []
        if cur:
            chunks.append([cur[0][0], cur[-1][1], " ".join(x[2] for x in cur)])
        offset += b - a
    # hold each chunk until the next one starts (no flicker)
    for i in range(len(chunks) - 1):
        chunks[i][1] = max(chunks[i][1], min(chunks[i + 1][0], chunks[i][1] + 0.6))
    for c in chunks:
        for k, v in fixes.items():
            c[2] = c[2].replace(k, v)
    return chunks


PAGE = """<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@700;800;900&family=JetBrains+Mono:wght@600;700&display=block" rel="stylesheet">
<style>
html,body{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden}
#panel{position:absolute;left:0;top:BOXHpx;width:1080px;height:calc(1920px - BOXHpx);background:#07090A}
#fade{position:absolute;left:0;top:calc(BOXHpx - 160px);width:1080px;height:160px;background:linear-gradient(to bottom,rgba(7,9,10,0),#07090A)}
#div{position:absolute;left:56px;right:56px;top:calc(BOXHpx + 10px);display:flex;align-items:center;gap:22px}
#div .ln{flex:1;height:3px;background:#fff;opacity:.9}
#div img{height:40px}
#kick{position:absolute;left:0;right:0;top:calc(BOXHpx + 78px);text-align:center;font:700 34px 'JetBrains Mono';letter-spacing:.1em;color:#B8F26A}
#hl{position:absolute;left:48px;right:48px;top:calc(BOXHpx + 142px);text-align:center;font:900 HLSIZEpx/1.04 'Inter Tight';text-transform:uppercase;color:#fff;letter-spacing:-.01em}
.hi{color:#B8F26A}
#sub{position:absolute;left:60px;right:60px;top:calc(BOXHpx - 210px);text-align:center;font:800 58px/1.1 'Inter Tight';color:#fff;
 -webkit-text-stroke:10px #000;paint-order:stroke fill;text-shadow:0 4px 18px rgba(0,0,0,.6)}
</style></head><body>
<div id="fade"></div><div id="panel"></div>
<div id="div"><div class="ln"></div><img src="LOGO"><div class="ln"></div></div>
<div id="kick">KICKER</div>
<div id="hl">HEADLINE</div>
<div id="sub"></div>
</body></html>"""

JS = r"""
const { chromium } = require('playwright');
(async () => {
  const [,, htmlPath, outDir, subsJson] = process.argv;
  const subs = JSON.parse(require('fs').readFileSync(subsJson, 'utf8'));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + htmlPath);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  // shrink the headline until it fits above the Reels caption zone (bottom ~330px)
  await p.evaluate(() => { const h = document.getElementById('hl'); let s = parseFloat(getComputedStyle(h).fontSize);
    while (h.getBoundingClientRect().bottom > 1920 - 330 && s > 40) { s -= 2; h.style.fontSize = s + 'px'; } });
  await p.screenshot({ path: outDir + '/panel.png', omitBackground: true });
  // subtitles: one transparent PNG per chunk (panel hidden)
  await p.evaluate(() => { for (const id of ['panel','fade','div','kick','hl']) document.getElementById(id).style.visibility = 'hidden'; });
  for (let i = 0; i < subs.length; i++) {
    await p.evaluate(t => { document.getElementById('sub').textContent = t; }, subs[i][2]);
    await p.screenshot({ path: `${outDir}/sub${String(i).padStart(3,'0')}.png`, omitBackground: true });
  }
  const info = await p.evaluate(() => ({ hl: getComputedStyle(document.getElementById('hl')).fontSize,
    bottom: document.getElementById('hl').getBoundingClientRect().bottom }));
  console.log(JSON.stringify(info));
  await b.close();
})();
"""


def main(path):
    c = json.load(open(path))
    slug = os.path.basename(os.path.dirname(os.path.abspath(path)))
    out_dir = os.path.join(ROOT, "out"); os.makedirs(out_dir, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix=f"nc-{slug}-")
    segs = c["segments"]
    tr = json.load(open(c["transcript"])) if c.get("transcript") else []
    subs = subs_from_transcript(tr, segs, c.get("sub_fix", {})) if tr else []
    if c.get("subs"):
        subs = c["subs"]
    json.dump(subs, open(f"{tmp}/subs.json", "w"))
    json.dump(subs, open(os.path.join(os.path.dirname(path), "subs.json"), "w"), indent=0)

    page = (PAGE.replace("BOXH", str(BOX_H)).replace("LOGO", "file://" + os.path.abspath(LOGO))
            .replace("KICKER", esc(c["kicker"])).replace("HEADLINE", headline_html(c["headline"], c.get("hi", [])))
            .replace("HLSIZE", str(c.get("hl_size", 76))))
    open(f"{tmp}/page.html", "w").write(page)
    open(f"{tmp}/r.js", "w").write(JS)
    env = dict(os.environ, NODE_PATH=subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip())
    subprocess.run(["node", f"{tmp}/r.js", f"{tmp}/page.html", tmp, f"{tmp}/subs.json"], check=True, env=env)

    # 1) cut + join segments, footage scaled to fill the box
    crop = c.get("crop")
    vf_box = (f"crop={crop}," if crop else "") + f"scale={W}:{BOX_H}:force_original_aspect_ratio=increase,crop={W}:{BOX_H},setsar=1"
    parts = []
    for i, (a, b) in enumerate(segs):
        pth = f"{tmp}/seg{i}.mp4"
        run([FF, "-loglevel", "error", "-y", "-ss", str(a), "-to", str(b), "-i", c["src"],
             "-vf", vf_box + ",fps=30,setpts=PTS-STARTPTS", "-af", "aresample=48000,asetpts=PTS-STARTPTS", "-c:v", "libx264", "-crf", "14", "-preset", "fast",
             "-c:a", "aac", "-b:a", "192k", pth])
        parts.append(pth)
    with open(f"{tmp}/list.txt", "w") as f:
        f.writelines(f"file '{p}'\n" for p in parts)
    run([FF, "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{tmp}/list.txt", "-c", "copy", f"{tmp}/joined.mp4"])
    dur = sum(b - a for a, b in segs)

    # 2) compose: black 1080x1920, footage at top, panel over it, subtitles on top
    inputs = [FF, "-loglevel", "error", "-y", "-f", "lavfi", "-i", f"color=c=0x07090A:s={W}x{H}:r=30:d={dur:.3f}",
              "-i", f"{tmp}/joined.mp4", "-i", f"{tmp}/panel.png"]
    fc = "[1:v]setpts=PTS-STARTPTS[fv];[0][fv]overlay=0:0:eof_action=repeat[v0];[v0][2]overlay=0:0[v1]"
    last = "v1"
    for i, (a, b, _) in enumerate(subs):
        inputs += ["-i", f"{tmp}/sub{i:03d}.png"]
        fc += f";[{last}][{i + 3}]overlay=0:0:enable='between(t,{a:.2f},{b:.2f})'[s{i}]"
        last = f"s{i}"
    # gentle loudness normalise of the original speech
    fc += ";[1:a]loudnorm=I=-14:TP=-1.5:LRA=11[a]"
    out = os.path.join(out_dir, f"{slug}.mp4")
    run(inputs + ["-filter_complex", fc, "-map", f"[{last}]", "-map", "[a]", "-c:v", "libx264", "-crf", "17",
                  "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out])
    print(out, f"{dur:.1f}s", f"{len(subs)} subtitle chunks")


if __name__ == "__main__":
    main(sys.argv[1])
