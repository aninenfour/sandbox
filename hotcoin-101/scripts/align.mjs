// Character timings for an existing voice take via ElevenLabs forced alignment.
//   node scripts/align.mjs public/vo/ep20zh-open.mp3 "<exact text>" ep20zh-open
// Writes public/vo/<out>.words.json in the same shape as voice.mjs. For CJK text
// every character is its own token (latin runs stay together), so cues can be
// found by phrase with the zh timeline helper.
import fs from 'node:fs';
import path from 'node:path';
if (fs.existsSync('.env')) process.loadEnvFile('.env');
const [audio, text, out] = process.argv.slice(2);
const key = process.env.ELEVENLABS_API_KEY;
const form = new FormData();
form.append('file', new Blob([fs.readFileSync(audio)], {type: 'audio/mpeg'}), path.basename(audio));
form.append('text', text);
const res = await fetch('https://api.elevenlabs.io/v1/forced-alignment', {method: 'POST', headers: {'xi-api-key': key}, body: form});
if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
const data = await res.json();
const chars = data.characters;
const tokens = [];
let cur = null;
const isLatin = (c) => /[A-Za-z0-9]/.test(c);
for (const c of chars) {
  if (/\s/.test(c.text)) { if (cur) tokens.push(cur); cur = null; continue; }
  if (isLatin(c.text) && cur && isLatin(cur.word.slice(-1))) { cur.word += c.text; cur.end = c.end; continue; }
  if (cur) tokens.push(cur);
  cur = {word: c.text, start: c.start, end: c.end};
}
if (cur) tokens.push(cur);
const words = tokens.map((w) => ({...w, at: Math.round(w.start * 300) / 10, until: Math.round(w.end * 300) / 10}));
const duration = words.length ? words[words.length - 1].end : 0;
fs.writeFileSync(path.join('public', 'vo', `${out}.words.json`), JSON.stringify({text, duration, words}, null, 1));
console.log(out, words.length, 'tokens', duration.toFixed(2) + 's');
