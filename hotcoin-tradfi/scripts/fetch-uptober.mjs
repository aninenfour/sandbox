// Downloads the Uptober film's archival-style photos (Pexels) into public/uptober/photos. PEXELS_API_KEY comes from the environment.
import {writeFile} from 'node:fs/promises';
const PK = process.env.PEXELS_API_KEY;
if (!PK) throw new Error('Set PEXELS_API_KEY');
const PHOTOS = {y2013: 37732199, y2017: 7156480, y2019: 25020077, y2020: 4199524, y2021: 28962712, y2023: 15914821, y2025: 33587048};
for (const [name, id] of Object.entries(PHOTOS)) {
  const p = await (await fetch(`https://api.pexels.com/v1/photos/${id}`, {headers: {Authorization: PK}})).json();
  await writeFile(`public/uptober/photos/${name}.jpg`, Buffer.from(await (await fetch(p.src.large2x)).arrayBuffer()));
  console.log(`${name}: Pexels photo ${id} by ${p.photographer}`);
}
