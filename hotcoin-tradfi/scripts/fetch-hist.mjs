// Downloads the Hotcoin history film's stock clips (Pexels) into public/hist. PEXELS_API_KEY comes from the environment.
import {writeFile} from 'node:fs/promises';
const PK = process.env.PEXELS_API_KEY;
if (!PK) throw new Error('Set PEXELS_API_KEY');
const V = {server: 1085656, rack: 7140928, red: 38736274, screens: 39212846, dubai: 34529274, dubaiNight: 11284796, globe: 3129785, arc: 3125427, sgdrive: 4865550, sgv: 34364038, mbs: 17715709};
for (const [name, id] of Object.entries(V)) {
  const v = await (await fetch(`https://api.pexels.com/videos/videos/${id}`, {headers: {Authorization: PK}})).json();
  const mp4 = v.video_files.filter((x) => x.file_type === 'video/mp4');
  const f = mp4.filter((x) => Math.min(x.width, x.height) >= 1080).sort((a, b) => a.width - b.width)[0] ?? mp4.sort((a, b) => b.width - a.width)[0];
  await writeFile(`public/hist/${name}.mp4`, Buffer.from(await (await fetch(f.link)).arrayBuffer()));
  console.log(`${name}: Pexels video ${id} by ${v.user?.name} (${f.width}x${f.height}, ${v.duration}s)`);
}
