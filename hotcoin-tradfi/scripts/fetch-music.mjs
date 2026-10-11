// Downloads the music bed into public/music. "Your Breath" by Eugenio Mininni, Mixkit free licence (mixkit.co).
import {mkdir, writeFile} from 'node:fs/promises';
await mkdir('public/music', {recursive: true});
const r = await fetch('https://assets.mixkit.co/music/634/634.mp3');
await writeFile('public/music/your-breath.mp3', Buffer.from(await r.arrayBuffer()));
console.log('public/music/your-breath.mp3', r.status);
// "Walking in the Park", Mixkit free licence: the bed for the Why We Trade riso film.
const r2 = await fetch('https://assets.mixkit.co/music/11/11.mp3');
await writeFile('public/music/walking-in-the-park.mp3', Buffer.from(await r2.arrayBuffer()));
console.log('public/music/walking-in-the-park.mp3', r2.status);
