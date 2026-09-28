// Downloads the music bed into public/music. "Your Breath" by Eugenio Mininni, Mixkit free licence (mixkit.co).
import {mkdir, writeFile} from 'node:fs/promises';
await mkdir('public/music', {recursive: true});
const r = await fetch('https://assets.mixkit.co/music/634/634.mp3');
await writeFile('public/music/your-breath.mp3', Buffer.from(await r.arrayBuffer()));
console.log('public/music/your-breath.mp3', r.status);
