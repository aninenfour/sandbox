// Downloads the footage for the Hunt brothers trailer into public/hunt/raw (git-ignored).
// Internet Archive films are public domain (Prelinger); Mixkit clips use the Mixkit free licence.
import {mkdir, writeFile, access} from 'node:fs/promises';
await mkdir('public/hunt/raw', {recursive: true});
const IA = {bigboard: 'big_board/big_board.mp4', southwest: 'Southwestern_2/Southwestern_2.mp4'};
const MIXKIT = {coins: 31128, coinsMacro: 30690, coinStack: 30714, molten: 20906, molten2: 21023, molten3: 20977, pump: 48884, jet: 7138, cash: 18296, paper: 41192, austin: 40691, dallas: 22777};
const get = async (url, out) => {
  try { await access(out); console.log('have', out); return; } catch {}
  const r = await fetch(url);
  if (!r.ok) return false;
  await writeFile(out, Buffer.from(await r.arrayBuffer()));
  console.log(out, r.status);
  return true;
};
for (const [name, path] of Object.entries(IA)) await get(`https://archive.org/download/${path}`, `public/hunt/raw/${name}.mp4`);
for (const [name, id] of Object.entries(MIXKIT)) {
  for (const q of [1080, 720]) if (await get(`https://assets.mixkit.co/videos/${id}/${id}-${q}.mp4`, `public/hunt/raw/${name}.mp4`) !== false) break;
}
