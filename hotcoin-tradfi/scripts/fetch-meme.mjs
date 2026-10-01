// Downloads the stock photos and clips for the memecoin film into public/meme.
// PEXELS_API_KEY comes from the environment only.
import {writeFile} from 'node:fs/promises';
const PK = process.env.PEXELS_API_KEY;
if (!PK) throw new Error('Set PEXELS_API_KEY');
const api = async (p) => (await fetch(`https://api.pexels.com/${p}`, {headers: {Authorization: PK}})).json();
const PHOTOS = {
  doge: 35526496, shib: 39402606, shades: 4588005, floki: 11938539, frog: 6780339, frog2: 31545926,
  wif: 4588052, popcat: 39877645, pnut: 36387021, moodeng: 37121730, goat: 28607441,
  malinois: 30211148, toshi: 29020872,
};
const VIDEOS = {fireworks: 10228856, laser: 35323935, laserblue: 33540449, candles: 38182555, candles2: 27048801, slots: 9807887, roulette: 9954987};
const credits = [];
for (const [name, id] of Object.entries(PHOTOS)) {
  const p = await api(`v1/photos/${id}`);
  await writeFile(`public/meme/${name}.jpg`, Buffer.from(await (await fetch(p.src.large2x)).arrayBuffer()));
  credits.push(`${name}: Pexels photo ${id} by ${p.photographer}`);
}
for (const [name, id] of Object.entries(VIDEOS)) {
  const v = await api(`videos/videos/${id}`);
  const mp4 = v.video_files.filter((x) => x.file_type === 'video/mp4');
  const f = mp4.filter((x) => Math.min(x.width, x.height) >= 1080).sort((a, b) => a.width - b.width)[0] ?? mp4.sort((a, b) => b.width - a.width)[0];
  await writeFile(`public/meme/${name}.mp4`, Buffer.from(await (await fetch(f.link)).arrayBuffer()));
  credits.push(`${name}: Pexels video ${id} by ${v.user?.name} (${f.width}x${f.height})`);
}
console.log(credits.join('\n'));
