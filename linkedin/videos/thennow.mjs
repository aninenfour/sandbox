// "Hiring, then and now": public-domain workplace films (Prelinger Archives, archive.org, CC public domain mark)
// cut into a short with burned subtitles, a live "red flags" scorecard, and an end card with our advice + open roles.
// Run: node linkedin/videos/thennow.mjs linkedin/videos/episodes/ep1.json   (TEST=1,10 renders stills only)
// Needs: the source film in linkedin/videos/src/pd/ and its faster-whisper json (news-clip/transcribe.py).
import fs from 'fs'; import path from 'path'; import {execFileSync} from 'child_process'; import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PW_PATH || 'playwright');
const FF = '/usr/bin/ffmpeg', DIR = path.dirname(new URL(import.meta.url).pathname), ROOT = path.resolve(DIR, '../..');
const EP = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const NAME = EP.name, WORK = `${DIR}/out/${NAME}`, FR = `${WORK}/src`, OUTF = `${WORK}/frames`;
fs.mkdirSync(FR, {recursive: true}); fs.mkdirSync(OUTF, {recursive: true});
const FPS = 30, SRC = `${DIR}/src/pd/${EP.src}`;
const TEST = (process.env.TEST || '').split(',').filter(Boolean).map(Number);

// 1. cut the segments (hard cuts), upscale 640x480 -> 960x720, keep the audio
const segs = EP.segments, clipLen = segs.reduce((s, [a, b]) => s + (b - a), 0);
const vf = segs.map(([a, b], i) => `[0:v]trim=${a}:${b},setpts=PTS-STARTPTS,fps=${FPS},scale=960:720:flags=lanczos,unsharp=5:5:0.6[v${i}];[0:a]atrim=${a}:${b},asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st=${(b - a - 0.06).toFixed(3)}:d=0.06[a${i}]`).join(';');
const cat = segs.map((_, i) => `[v${i}][a${i}]`).join('') + `concat=n=${segs.length}:v=1:a=1[v][a]`;
if (!fs.existsSync(`${WORK}/clip.mkv`) || process.env.RECUT) {
  execFileSync(FF, ['-loglevel', 'error', '-y', '-i', SRC, '-filter_complex', `${vf};${cat}`, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '14', '-c:a', 'pcm_s16le', `${WORK}/clip.mkv`]);
  for (const f of fs.readdirSync(FR)) fs.unlinkSync(`${FR}/${f}`);
  execFileSync(FF, ['-loglevel', 'error', '-y', '-i', `${WORK}/clip.mkv`, '-q:v', '3', `${FR}/%05d.jpg`]);
}
const nSrc = fs.readdirSync(FR).length;

// 2. subtitles from word timings, mapped onto the output timeline; source-time events mapped too
const toOut = (s) => { let off = 0; for (const [a, b] of segs) { if (s >= a && s <= b) return off + s - a; off += b - a; } return null; };
const tr = JSON.parse(fs.readFileSync(`${DIR}/src/pd/${EP.transcript}`, 'utf8'));
// one subtitle per spoken sentence (wrapped to 2 lines on the page); very long sentences split in two halves
const fix = EP.sub_fix || {}; const subs = [];
for (const seg of tr) { const ws = []; for (const [a, b, w] of seg.words) { const oa = toOut(a); if (oa === null) continue; ws.push([oa, toOut(b) ?? oa + 0.3, fix[w.trim()] ?? w.trim()]); }
  if (!ws.length) continue; const text = ws.map(w => w[2]).join(' ');
  const parts = text.length > 76 ? [ws.slice(0, Math.ceil(ws.length / 2)), ws.slice(Math.ceil(ws.length / 2))] : [ws];
  for (const pw of parts) subs.push([pw[0][0], pw[pw.length - 1][1], pw.map(w => w[2]).join(' ')]); }
subs.sort((a, b) => a[0] - b[0]);
for (let i = 0; i < subs.length; i++) { subs[i][1] = Math.min(subs[i][1] + 0.4, subs[i + 1] ? subs[i + 1][0] - 0.02 : clipLen); }
const flags = EP.flags.map(([s, txt]) => [toOut(s), txt]);
const DUR = clipLen + EP.endDur;
const CFG = {...EP.card, flags, subs, clipEnd: clipLen, dur: DUR,
  logo: 'data:image/png;base64,' + fs.readFileSync(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-black.png`).toString('base64'),
  logoW: 'data:image/png;base64,' + fs.readFileSync(`${ROOT}/hotcoin-tradfi/public/brand/logo-official-white.png`).toString('base64')};
fs.writeFileSync(`${WORK}/subs.json`, JSON.stringify(subs, null, 1));

// 3. render frames
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=block');
html,body{margin:0}canvas{display:block}</style></head><body><canvas id="c" width="1080" height="1350"></canvas>
<script>window.CFG=${JSON.stringify(CFG)};</script><script>${fs.readFileSync(`${DIR}/thennow.page.js`, 'utf8')}</script></body></html>`;
const br = await chromium.launch(); const p = await br.newPage({viewport: {width: 1080, height: 1350}});
await p.setContent(html, {waitUntil: 'networkidle'});
await p.evaluate(async () => { for (const f of ['600 40px "Inter Tight"', '700 40px "Inter Tight"', '800 40px "Inter Tight"', '700 20px "JetBrains Mono"', '800 20px "JetBrains Mono"']) await document.fonts.load(f); await window.build(); });
if (!(await p.evaluate(() => document.fonts.check('800 40px "Inter Tight"') && document.fonts.check('700 20px "JetBrains Mono"')))) throw new Error('fonts');
const N = Math.round(DUR * FPS), list = TEST.length ? TEST.map(t => Math.round(t * FPS)) : [...Array(N).keys()];
if (!TEST.length) for (const f of fs.readdirSync(OUTF)) fs.unlinkSync(`${OUTF}/${f}`);
for (const i of list) {
  const fi = Math.min(nSrc, i + 1), img = 'data:image/jpeg;base64,' + fs.readFileSync(`${FR}/${String(fi).padStart(5, '0')}.jpg`).toString('base64');
  const b = await p.evaluate(async ([t, src]) => { const im = await new Promise(r => { const k = new Image(); k.onload = () => r(k); k.src = src; }); window.draw(t, im); return document.getElementById('c').toDataURL('image/jpeg', 0.93).split(',')[1]; }, [i / FPS, img]);
  fs.writeFileSync(`${OUTF}/${TEST.length ? 'test-' : ''}${String(i).padStart(5, '0')}.jpg`, Buffer.from(b, 'base64'));
}
await br.close();
if (TEST.length) { console.log('stills', list.length); process.exit(0); }

// 4. audio: film dialogue, then a soft original bed under the end card; mux
const bed = `${DIR}/out/onepct-beat.wav`;
const out = `${DIR}/out/${NAME}.mp4`;
execFileSync(FF, ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', `${OUTF}/%05d.jpg`, '-i', `${WORK}/clip.mkv`, '-i', bed,
  '-filter_complex', `[1:a]highpass=f=90,lowpass=f=9000,loudnorm=I=-16:TP=-1.5,apad=whole_dur=${DUR}[d];[2:a]atrim=0:${DUR},asetpts=PTS-STARTPTS,volume='if(lt(t,${clipLen}),0.10,0.55)':eval=frame,afade=t=in:st=0:d=1,afade=t=out:st=${DUR - 1.5}:d=1.5[m];[d][m]amix=inputs=2:normalize=0,atrim=0:${DUR}[a]`,
  '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-crf', '19', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', String(DUR), out]);
console.log('wrote', out, DUR.toFixed(1) + 's');
