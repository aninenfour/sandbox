// Downloads the TOKEN2049 promo's stock clips (Pexels) into public/t49. PEXELS_API_KEY comes from the environment.
import {writeFile} from 'node:fs/promises';
const PK = process.env.PEXELS_API_KEY;
if (!PK) throw new Error('Set PEXELS_API_KEY');
const V = {mbsv: 34186550, mbs: 35061518, bay: 33279610, city: 32047106, stage: 36408715, screens: 19197406, lights: 35451425, face: 20320583, audience: 11060088, expo: 34804768, party: 34059053, concert: 13641378};
for (const [name, id] of Object.entries(V)) {
  const v = await (await fetch(`https://api.pexels.com/videos/videos/${id}`, {headers: {Authorization: PK}})).json();
  const mp4 = v.video_files.filter((x) => x.file_type === 'video/mp4');
  const f = mp4.filter((x) => Math.min(x.width, x.height) >= 1080).sort((a, b) => a.width - b.width)[0] ?? mp4.sort((a, b) => b.width - a.width)[0];
  await writeFile(`public/t49/${name}.mp4`, Buffer.from(await (await fetch(f.link)).arrayBuffer()));
  console.log(`${name}: Pexels video ${id} by ${v.user?.name} (${f.width}x${f.height}, ${v.duration}s)`);
}
