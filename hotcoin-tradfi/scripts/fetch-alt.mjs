// Downloads the Pexels macro photos for the motion-graphics alternative into public/alt.
// PEXELS_API_KEY comes from the environment only.
import {mkdir, writeFile} from 'node:fs/promises';

const key = process.env.PEXELS_API_KEY;
if (!key) throw new Error('Set PEXELS_API_KEY');
const PHOTOS = {hood: 12279541, dollar: 7109882, gold: 6757642, roof: 35772536, coins: 4480232};

await mkdir('public/alt', {recursive: true});
for (const [name, id] of Object.entries(PHOTOS)) {
  const p = await (await fetch(`https://api.pexels.com/v1/photos/${id}`, {headers: {Authorization: key}})).json();
  const buf = Buffer.from(await (await fetch(`${p.src.original}?auto=compress&cs=tinysrgb&w=1800`)).arrayBuffer());
  await writeFile(`public/alt/${name}.jpg`, buf);
  console.log(name, id, p.photographer);
}
