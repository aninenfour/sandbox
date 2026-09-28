// Downloads the full-resolution stock clips for the v2 film into public/v2/raw.
// PEXELS_API_KEY and PIXABAY_API_KEY come from the environment only.
import {writeFile} from 'node:fs/promises';
const PK = process.env.PEXELS_API_KEY, BK = process.env.PIXABAY_API_KEY;
if (!PK || !BK) throw new Error('Set PEXELS_API_KEY and PIXABAY_API_KEY');
const PEXELS = {coin: 30882814, goldfire: 33938968, city: 10433645, crucible: 30342459, wildfire: 7533265, flames: 5485149};
const PIXABAY = {lightning: 28067, cash: 59138};
for (const [name, id] of Object.entries(PEXELS)) {
  const v = await (await fetch(`https://api.pexels.com/videos/videos/${id}`, {headers: {Authorization: PK}})).json();
  const f = v.video_files.filter((x) => x.file_type === 'video/mp4' && x.width >= 1900).sort((a, b) => a.width - b.width)[0] ?? v.video_files.sort((a, b) => b.width - a.width)[0];
  await writeFile(`public/v2/raw/${name}.mp4`, Buffer.from(await (await fetch(f.link)).arrayBuffer()));
  console.log(name, id, f.width, v.user?.name);
}
for (const [name, id] of Object.entries(PIXABAY)) {
  const j = await (await fetch(`https://pixabay.com/api/videos/?key=${BK}&id=${id}`)).json();
  const h = j.hits[0]; const f = h.videos.large?.url ? h.videos.large : h.videos.medium;
  await writeFile(`public/v2/raw/${name}.mp4`, Buffer.from(await (await fetch(f.url)).arrayBuffer()));
  console.log(name, id, f.width, h.user);
}
