// Downloads the Pexels plates used in the film. The API key comes from the environment only.
import {writeFile} from 'node:fs/promises';

const key = process.env.PEXELS_API_KEY;
if (!key) throw new Error('Set PEXELS_API_KEY');

const PLATES = {skyline: 29025308, phone: 6279147};

for (const [name, id] of Object.entries(PLATES)) {
  const res = await fetch(`https://api.pexels.com/videos/videos/${id}`, {headers: {Authorization: key}});
  const v = await res.json();
  const file = v.video_files
    .filter((f) => f.file_type === 'video/mp4' && f.width >= 1080)
    .sort((a, b) => a.width - b.width)[0];
  const buf = Buffer.from(await (await fetch(file.link)).arrayBuffer());
  await writeFile(`public/plates/${name}.mp4`, buf);
  console.log(name, id, `${file.width}x${file.height}`, `${(buf.length / 1e6).toFixed(1)}MB`, v.user?.name);
}
