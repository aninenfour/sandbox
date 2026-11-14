// Human-looking posting times for the PT (Brazil) channel. Usage: node social/pt/tracker/schedule.mjs 2026-11-16 7
// Rules: base slots per weekday, each shifted by a random 6 to 38 minutes either way, never on :00/:15/:30/:45,
// optional slots skipped ~30% of days, an extra post added ~25% of days, checks drift too. Seeded by date so a day's plan is reproducible.
const [start = '2026-11-16', n = '7'] = process.argv.slice(2);
const base = {check: ['07:40', '12:05', '16:10'],
  posts: [['08:45', 'GM', 1], ['10:15', 'Evento (key visual / Partidas / Anúncio)', 1], ['12:35', 'Agenda / Brasil Explicado / Talão', .7], ['14:20', 'Meme do dia', .8], ['17:15', 'Evento (lembrete)', .9], ['19:35', 'Texto / enquete', .7], ['21:50', 'Meme ou texto da noite', .5]]};
const extra = ['Texto curto', 'Repost comentado', 'Enquete relâmpago'];
const day = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
function rng(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return () => ((h = (h * 1103515245 + 12345) >>> 0) / 2 ** 32); }
const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const toM = (t) => +t.slice(0, 2) * 60 + +t.slice(3);
function jitter(t, r, lo = 6, hi = 38) { let m; do { m = toM(t) + Math.round((r() < .5 ? -1 : 1) * (lo + r() * (hi - lo))); } while (m % 15 === 0); return m; }
for (let i = 0; i < +n; i++) {
  const d = new Date(start + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + i); const key = d.toISOString().slice(0, 10), r = rng(key);
  const rows = base.check.map((t) => [jitter(t, r, 3, 25), 'verificação do site']);
  for (const [t, what, p] of base.posts) if (r() < p) rows.push([jitter(t, r), what]);
  if (r() < .25) rows.push([toM('11:00') + Math.floor(r() * 540), extra[Math.floor(r() * extra.length)] + ' (extra)']);
  rows.sort((a, b) => a[0] - b[0]);
  console.log(`${day[d.getUTCDay()]} ${key}: ` + rows.map(([m, w]) => `${fmt(m)} ${w}`).join(' | '));
}
