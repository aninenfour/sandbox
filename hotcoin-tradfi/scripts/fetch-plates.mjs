// Downloads the Pexels photos used in the film into public/photos.
// The API key comes from the environment only: PEXELS_API_KEY=... npm run fetch-plates
import {mkdir, writeFile} from 'node:fs/promises';

const key = process.env.PEXELS_API_KEY;
if (!key) throw new Error('Set PEXELS_API_KEY');

export const PHOTOS = {
  wallst: 20989172, // Wall Street at night, opening stage
  aapl: 6266516,    // stacks of $100 bills
  nvda: 2182863,    // circuit board, low light
  tsla: 17245109,   // headlights in fog
  gold: 33539242,   // gold bars
  etf: 36790143,    // stock board
  desk: 39076662,   // trading desk at night, app scenes
  coins: 5805712,   // coins, the 10 USDT scene
};

await mkdir('public/photos', {recursive: true});
const credits = {};
for (const [name, id] of Object.entries(PHOTOS)) {
  const p = await (await fetch(`https://api.pexels.com/v1/photos/${id}`, {headers: {Authorization: key}})).json();
  const buf = Buffer.from(await (await fetch(`${p.src.original}?auto=compress&cs=tinysrgb&w=1600`)).arrayBuffer());
  await writeFile(`public/photos/${name}.jpg`, buf);
  credits[name] = {id, photographer: p.photographer, url: p.url};
  console.log(name, id, `${(buf.length / 1e6).toFixed(2)}MB`, p.photographer);
}
await writeFile('public/photos/credits.json', JSON.stringify(credits, null, 2));
