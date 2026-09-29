// Voiceover via ElevenLabs, with word timings for syncing beats.
//
//   npm run vo -- episodes/013/hotcoin-101-ep13-voiceover.md --out ep13
//   npm run vo -- --text "Quick test line" --out test
//
// Writes public/vo/<out>.mp3 and public/vo/<out>.words.json.
// words.json holds each word's start/end in seconds and in 30fps clock units,
// so beats can be placed on the words instead of guessed.
//
// Needs ELEVENLABS_API_KEY in .env (gitignored). Voice from --voice or
// ELEVENLABS_VOICE_ID; the key is restricted and cannot list voices, so pass
// the id from the ElevenLabs dashboard.
import fs from 'node:fs';
import path from 'node:path';

if (fs.existsSync('.env')) process.loadEnvFile('.env');

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const positional = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));

const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error('ELEVENLABS_API_KEY missing (put it in .env)');
const voice = opt('voice', process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb');
const model = opt('model', process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2');
const out = opt('out', 'vo');

let text = opt('text');
if (!text) {
  if (!positional[0]) throw new Error('pass a voiceover .md/.txt file or --text');
  text = fs.readFileSync(positional[0], 'utf8');
  // voiceover.md is only the copy-paste block; drop fences and headings if present
  text = text
    .replace(/```[a-z]*\n?/g, '')
    .split('\n')
    .filter((l) => !l.trim().startsWith('#'))
    .join('\n')
    .trim();
}
if (/\u2014/.test(text)) console.warn('warning: em dash in voiceover text (series rule: never)');

const settings = {
  stability: Number(opt('stability', 0.45)),
  similarity_boost: Number(opt('similarity', 0.8)),
  style: Number(opt('style', 0.15)),
  use_speaker_boost: true,
};

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`, {
  method: 'POST',
  headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
  body: JSON.stringify({text, model_id: model, voice_settings: settings}),
});
if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
const data = await res.json();

const dir = path.join('public', 'vo');
fs.mkdirSync(dir, {recursive: true});
fs.writeFileSync(path.join(dir, `${out}.mp3`), Buffer.from(data.audio_base64, 'base64'));

// characters -> words
const a = data.alignment;
const words = [];
let cur = null;
a.characters.forEach((ch, i) => {
  if (/\s/.test(ch)) {
    if (cur) words.push(cur);
    cur = null;
    return;
  }
  if (!cur) cur = {word: '', start: a.character_start_times_seconds[i], end: 0};
  cur.word += ch;
  cur.end = a.character_end_times_seconds[i];
});
if (cur) words.push(cur);
const CLOCK = 30;
const timed = words.map((w) => ({...w, at: Math.round(w.start * CLOCK * 10) / 10, until: Math.round(w.end * CLOCK * 10) / 10}));
const duration = a.character_end_times_seconds.at(-1) ?? 0;
fs.writeFileSync(path.join(dir, `${out}.words.json`), JSON.stringify({voice, model, duration, words: timed}, null, 1));

const wps = words.length / (duration || 1);
console.log(`${out}: ${words.length} words, ${duration.toFixed(2)}s, ${wps.toFixed(2)} words/s (target about 2.5)`);
console.log(`-> ${path.join(dir, out)}.mp3 and .words.json`);
