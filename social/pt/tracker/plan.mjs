// Milestone planner for the PT channel. Usage: node social/pt/tracker/plan.mjs [ISO-datetime]
// For each tracked event it prints the status at that moment (Lisbon time) and which update post is due:
// LAUNCH (first 24h), MIDTERM (crossed 50% in the last 24h), 48H, LAST DAY (<24h left), ENDED (ended in the last 24h), RESULTS (7 business days after end).
import fs from 'fs';
const {events} = JSON.parse(fs.readFileSync(new URL('./events.json', import.meta.url)));
const now = new Date(process.argv[2] || Date.now());
const H = 3600e3;
const lis = (d) => d.toLocaleString('pt-PT', {timeZone: 'Europe/Lisbon', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'});
for (const e of events) {
  const s = new Date(e.start), end = e.end ? new Date(e.end) : null;
  let status, due = [];
  if (now < s) status = 'EM BREVE';
  else if (!end) { status = 'EM CURSO'; if (now - s < 24 * H) due.push('LAUNCH'); }
  else if (now > end) { status = 'TERMINOU'; if (now - end < 24 * H) due.push('ENDED'); }
  else {
    const p = (now - s) / (end - s), left = end - now;
    status = `${Math.round(p * 100)}% · faltam ${Math.floor(left / 864e5)}d ${Math.floor(left % 864e5 / H)}h`;
    if (now - s < 24 * H) due.push('LAUNCH');
    if (p >= .5 && (now - 24 * H - s) / (end - s) < .5) due.push('MIDTERM');
    if (left < 48 * H && left >= 24 * H) due.push('48H');
    if (left < 24 * H) due.push('LAST DAY');
  }
  console.log(`${e.pt.padEnd(46)} fim ${end ? lis(end) : 'até esgotar'.padEnd(17)}  ${status.padEnd(26)} ${due.join(', ')}`);
}
