// Downloads the Pexels media used in the film into public/photos and public/plates.
// The API key comes from the environment only: PEXELS_API_KEY=... npm run fetch-plates
import {mkdir, writeFile} from 'node:fs/promises';

const key = process.env.PEXELS_API_KEY;
if (!key) throw new Error('Set PEXELS_API_KEY');
const api = async (path) => (await fetch(`https://api.pexels.com/${path}`, {headers: {Authorization: key}})).json();

const PHOTOS = {
  aapl: 6266516,    // stacks of $100 bills
  nvda: 2182863,    // circuit board, low light
  tsla: 17245109,   // headlights in fog
  gold: 33539242,   // gold bars
  etf: 36790143,    // stock board
  desk: 39076662,   // trading desk at night, app scenes
  coins: 5805712,   // coins, the 10 USDT scene
};
const VIDEOS = {
  road: 13643100,   // car in night rain, opening stage
};

await mkdir('public/photos', {recursive: true});
await mkdir('public/plates', {recursive: true});
const credits = {};
for (const [name, id] of Object.entries(PHOTOS)) {
  const p = await api(`v1/photos/${id}`);
  const buf = Buffer.from(await (await fetch(`${p.src.original}?auto=compress&cs=tinysrgb&w=1600`)).arrayBuffer());
  await writeFile(`public/photos/${name}.jpg`, buf);
  credits[name] = {id, by: p.photographer, url: p.url};
  console.log('photo', name, id, p.photographer);
}
for (const [name, id] of Object.entries(VIDEOS)) {
  const v = await api(`videos/videos/${id}`);
  const file = v.video_files.filter((f) => f.file_type === 'video/mp4' && f.width >= 2400).sort((a, b) => a.width - b.width)[0];
  const buf = Buffer.from(await (await fetch(file.link)).arrayBuffer());
  await writeFile(`public/plates/${name}.mp4`, buf);
  credits[name] = {id, by: v.user?.name, url: v.url};
  console.log('video', name, id, `${file.width}x${file.height}`, v.user?.name);
}
await writeFile('public/photos/credits.json', JSON.stringify(credits, null, 2));
