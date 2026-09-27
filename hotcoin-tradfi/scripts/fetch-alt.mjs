// Downloads the Pexels photos for the motion-graphics cuts into public/alt.
// PEXELS_API_KEY comes from the environment only.
import {mkdir, writeFile} from 'node:fs/promises';

const key = process.env.PEXELS_API_KEY;
if (!key) throw new Error('Set PEXELS_API_KEY');
const get = async (id) => (await fetch(`https://api.pexels.com/v1/photos/${id}`, {headers: {Authorization: key}})).json();

// Full-frame textures.
const PHOTOS = {hood: 12279541, dollar: 7109882, gold: 6757642, roof: 35772536, coins: 4480232, silver: 6595970};
// Mosaic tiles: macro money, metal and cars at night (no car badges).
export const TILES = [
  10905352, 7109882, 6757642, 4480232, 12279541, 7076319, 12777409, 28103487, 18372338, 14754450,
  35772536, 6595970, 32688417, 5214390, 6276048, 1055081, 20006817, 37950555, 4611562, 7214230,
];

await mkdir('public/alt/tiles', {recursive: true});
for (const [name, id] of Object.entries(PHOTOS)) {
  const p = await get(id);
  await writeFile(`public/alt/${name}.jpg`, Buffer.from(await (await fetch(`${p.src.original}?auto=compress&cs=tinysrgb&w=1800`)).arrayBuffer()));
  console.log(name, id, p.photographer);
}
for (const id of TILES) {
  const p = await get(id);
  await writeFile(`public/alt/tiles/${id}.jpg`, Buffer.from(await (await fetch(`${p.src.original}?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop`)).arrayBuffer()));
}
console.log('tiles', TILES.length);
