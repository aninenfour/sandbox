// Breaking explainer (owner, Oct 30: "Johnny Harris style"): paper desk, pinned evidence, red marker routes,
// stamps and a slow documentary camera. Facts as of Oct 30 ~09:00 UTC+8 (CoinDesk, Cointelegraph, Decrypt, The Block).
const IM = {}; for (const [k, src] of Object.entries(window.IMGS || {})) { IM[k] = new Image(); IM[k].src = src; }
const PAPER = '#ECE4D3', INKP = '#1B1A17', MARK = '#D7261E', BLUE = '#2F6FB5';
const T = {s1: 0, s2: 5.2, s3: 12.4, s4: 18.6, s5: 24.4, s6: 30.4, end: 35.6};
const LESSON = [{t: 'ONLY KEEP ON', c: INKP}, {t: 'AN EXCHANGE', c: INKP}, {t: 'WHAT YOU TRADE.', c: MARK}];
const L0 = T.s6 + .5, LT = lessonTimes(L0, LESSON, 20);
window.DURATION = T.end + 2.6;
window.COVER_T = 3.2;
const GRAIN = (() => { const r = rng(42), g = []; for (let i = 0; i < 2600; i++) g.push([r() * W, r() * H, r() * 1.6 + .3, r()]); return g; })();
window.CUES = (() => {
  const c = [{t: .15, s: 'thud'}];
  const tw = (t0, n, cps = 22) => { for (let i = 0; i < n; i++) c.push({t: t0 + i / cps, s: 'key'}); };
  tw(.3, 24); c.push({t: 2.0, s: 'stamp'}, {t: 2.05, s: 'cash'}, {t: 3.4, s: 'stamp'});
  c.push({t: T.s2 - .2, s: 'whoosh'}, {t: T.s2 + .5, s: 'thunk'});
  [T.s2 + 2.0, T.s2 + 2.7, T.s2 + 3.4].forEach(t => c.push({t, s: 'creak'}));
  c.push({t: T.s2 + 5.0, s: 'stamp'});
  c.push({t: T.s3 - .2, s: 'whoosh'}, {t: T.s3 + 1.2, s: 'thunk', pitch: .8}, {t: T.s3 + 2.6, s: 'crash'}, {t: T.s3 + 4.2, s: 'stamp'});
  c.push({t: T.s4 - .2, s: 'whoosh'}, {t: T.s4 + 1.4, s: 'chime'}, {t: T.s4 + 2.8, s: 'stamp'});
  c.push({t: T.s5 - .2, s: 'whoosh'}, {t: T.s5 + 1.0, s: 'stamp'}); tw(T.s5 + 2.2, 34, 26);
  c.push({t: T.s6 - .4, s: 'cut'}, {t: T.s6 - .2, s: 'pad'});
  let k = L0; LESSON.forEach(l => { tw(k, l.t.replace(/ /g, '').length, 20 * l.t.replace(/ /g, '').length / l.t.length); k += l.t.length / 20 + .35; });
  c.push({t: T.end + .4, s: 'chime'});
  return c;
})();

// ---------- paper-desk helpers
function paper(t) {
  ctx.fillStyle = PAPER; ctx.fillRect(-200, -300, W + 400, H + 600);
  for (const [x, y, r, a] of GRAIN) { ctx.globalAlpha = .05 + a * .07; ctx.fillStyle = a > .5 ? '#7a6d55' : '#ffffff'; ctx.fillRect(x, y, r, r); }
  ctx.globalAlpha = 1;
  const v = ctx.createRadialGradient(W / 2, H / 2, 400, W / 2, H / 2, 1300); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(60,40,10,.35)');
  ctx.fillStyle = v; ctx.fillRect(-200, -300, W + 400, H + 600);
}
function font(w, s, fam = '"Inter Display", Inter, sans-serif') { ctx.font = `${w} ${s}px ${fam}`; }
function text(s, x, y, size, color = INKP, w = 900, align = 'center', fam) { font(w, size, fam); ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function typed(s, t, t0, cps = 22) { return s.slice(0, Math.max(0, Math.floor((t - t0) * cps))); }
const MONO = '"DejaVu Sans Mono", "Courier New", monospace';
function tape(x, y, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = 'rgba(240,230,190,.85)'; ctx.fillRect(-70, -22, 140, 44); ctx.restore(); }
function polaroid(img, x, y, w, h, rot, k, cap) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y + (1 - easeOut(k)) * 220); ctx.rotate(rot); ctx.globalAlpha = clamp(k * 1.5);
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; ctx.fillStyle = '#fbfaf6'; ctx.fillRect(-w / 2 - 22, -h / 2 - 22, w + 44, h + 110);
  ctx.shadowColor = 'transparent';
  if (IM[img] && IM[img].naturalWidth) { const im = IM[img], s = Math.max(w / im.naturalWidth, h / im.naturalHeight);
    ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip(); ctx.drawImage(im, -im.naturalWidth * s / 2, -im.naturalHeight * s / 2, im.naturalWidth * s, im.naturalHeight * s); ctx.restore(); }
  if (cap) text(cap, 0, h / 2 + 50, 38, INKP, 700, 'center', MONO);
  ctx.restore(); tape(x, y - h / 2 - 20 + (1 - easeOut(k)) * 220, rot * 2);
}
function note(x, y, w, h, rot, color, lines, k) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(lerp(.6, 1, easeOut(k)), lerp(.6, 1, easeOut(k))); ctx.globalAlpha = clamp(k * 2);
  ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8; ctx.fillStyle = color; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent';
  lines.forEach((l, i) => text(l.t, 0, -h / 2 + 62 + i * (l.s || 50) * 1.15, l.s || 50, l.c || INKP, l.w || 900));
  ctx.restore();
}
function marker(pts, k, color = MARK, wdt = 10, dash = null) {  // progressively drawn marker line
  if (k <= 0) return; let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  let left = L * clamp(k); ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wdt; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(...pts[0]); let end = pts[0];
  for (let i = 1; i < pts.length && left > 0; i++) { const f = Math.min(1, left / seg[i - 1]); end = [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; ctx.lineTo(...end); left -= seg[i - 1]; }
  ctx.stroke(); ctx.restore(); return end;
}
function arrowHead(p, q, color = MARK) { const a = Math.atan2(q[1] - p[1], q[0] - p[0]); ctx.save(); ctx.translate(...q); ctx.rotate(a); ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-22, -18); ctx.lineTo(-22, 18); ctx.fill(); ctx.restore(); }
function circleMark(x, y, rx, ry, k, color = MARK) { if (k <= 0) return; ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, -.06, -Math.PI * .6, -Math.PI * .6 + Math.PI * 2.15 * clamp(k)); ctx.stroke(); ctx.restore(); }
function pstamp(t, t0, s, x, y, color, rot = -.1, size = 120) {
  if (t < t0) return; const k = prog(t, t0, t0 + .18), sc = lerp(1.8, 1, easeOut(k)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 1.4) * .92;
  font(900, size); const w = ctx.measureText(s).width + 70; ctx.strokeStyle = color; ctx.lineWidth = 12; ctx.strokeRect(-w / 2, -size * .72, w, size * 1.44);
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 6); ctx.restore();
}
function cam(t, t0, t1, z0, z1, dx0 = 0, dx1 = 0, dy0 = 0, dy1 = 0) {  // slow documentary push-in + a whip at the start
  const k = easeInOut(prog(t, t0, t1)), whip = t0 > 0 ? (1 - easeOut(prog(t, t0, t0 + .45))) * 900 : 0;
  const z = lerp(z0, z1, k); ctx.translate(W / 2 + lerp(dx0, dx1, k) + whip, H / 2 + lerp(dy0, dy1, k)); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
}
function headerBar(t) {  // persistent top label: what this is, readable from frame 1
  ctx.save(); ctx.fillStyle = INKP; ctx.fillRect(0, 0, W, 210); text('THE BIGGEST CRYPTO HACK IN HISTORY', W / 2, 130, 50, '#fff', 900);
  text('BREAKING · OCT 29-30, 2026', W / 2, 62, 28, MARK, 800, 'center', MONO); ctx.restore();
}

// ---------- scenes
function s1(t) {  // the number
  ctx.save(); cam(t, 0, T.s2, 1.06, 1.0); paper(t);
  text(typed('OCT 29, 20:24 UTC. BINANCE.', t, .3), W / 2, 520, 44, INKP, 700, 'center', MONO);
  const k = easeOut(prog(t, .9, 2.0)), n = 5.7 * k;
  text(`$${n.toFixed(1)}`, W / 2, 820, 300, MARK, 900); text('BILLION', W / 2, 1020, 120, INKP, 900);
  pstamp(t, 2.0, 'GONE', W / 2 + 230, 1180, MARK, -.14, 110);
  if (t > 3.0) text(typed('in one evening.', t, 3.0, 18), W / 2, 1390, 54, INKP, 700, 'center', MONO);
  ctx.restore();
}
function s2(t) {  // the trail
  const tt = t - T.s2; ctx.save(); cam(t, T.s2, T.s3, 1.0, 1.08, 0, 0, 0, -40); paper(t);
  polaroid('laptop_b.jpg', 320, 620, 420, 300, -.05, prog(t, T.s2 + .2, T.s2 + .8), 'BINANCE HOT WALLET');
  const src = [500, 760];
  const dst = [[260, 1250, 'ETHEREUM'], [560, 1420, 'BITCOIN'], [860, 1180, 'TRON']];
  dst.forEach(([x, y, l], i) => {
    const k = prog(t, T.s2 + 1.6 + i * .7, T.s2 + 2.4 + i * .7);
    const mid = [lerp(src[0], x, .5) + (i - 1) * 90, lerp(src[1], y, .5) - 60];
    const end = marker([src, mid, [x, y - 70]], k, MARK, 9, [26, 18]);
    if (k >= 1) arrowHead(mid, [x, y - 70]);
    note(x, y + 20, 270, 120, (i - 1) * .05, ['#FFE36E', '#FFD0C8', '#CFE8FF'][i], [{t: l, s: 46}], prog(t, T.s2 + 2.3 + i * .7, T.s2 + 2.7 + i * .7));
  });
  circleMark(320, 620, 290, 230, prog(t, T.s2 + 4.0, T.s2 + 4.8));
  pstamp(t, T.s2 + 5.0, 'DRAINED', 800, 560, MARK, .12, 92);
  if (tt > 5.4) text(typed('Funds split across 3 blockchains.', t, T.s2 + 5.4, 26), W / 2, 1640, 44, INKP, 700, 'center', MONO);
  ctx.restore();
}
function s3(t) {  // the record
  ctx.save(); cam(t, T.s3, T.s4, 1.0, 1.05, 0, 0, 0, 30); paper(t);
  text('BIGGEST CRYPTO HACKS', W / 2, 400, 58, INKP, 900); text('stolen, in US dollars', W / 2, 470, 34, '#6b604b', 600, 'center', MONO);
  const base = 1450, maxH = 820;
  const bars = [[330, 'BYBIT', 'Feb 2025', 1.5, '#8f8672'], [750, 'BINANCE', 'Oct 2026', 5.7, MARK]];
  bars.forEach(([x, l, d, v, col], i) => {
    const k = easeOut(prog(t, T.s3 + .6 + i * .9, T.s3 + 1.6 + i * 1.1)), h = maxH * v / 5.7 * k;
    ctx.save(); ctx.translate(x, base); ctx.rotate(i ? .01 : -.012); ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 14; ctx.fillStyle = col; ctx.fillRect(-120, -h, 240, h); ctx.restore();
    if (k > .05) text(`$${(v * k).toFixed(1)}B`, x, base - h - 60, 76, col === MARK ? MARK : INKP, 900);
    text(l, x, base + 60, 52, INKP, 900); text(d, x, base + 115, 34, '#6b604b', 600, 'center', MONO);
  });
  circleMark(750, base - maxH - 60, 190, 80, prog(t, T.s3 + 3.4, T.s3 + 4.1));
  pstamp(t, T.s3 + 4.2, '~4x THE RECORD', W / 2, 1720, MARK, -.06, 74);
  ctx.restore();
}
function s4(t) {  // the freeze
  ctx.save(); cam(t, T.s4, T.s5, 1.04, 1.0); paper(t);
  text('THE FREEZE', W / 2, 400, 64, INKP, 900);
  const k = easeOut(prog(t, T.s4 + .4, T.s4 + 1.4));
  ctx.save(); ctx.globalAlpha = k; const g = ctx.createLinearGradient(140, 560, 940, 1180); g.addColorStop(0, '#d9ecfb'); g.addColorStop(1, '#a9cdee');
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(140, 560, 800, 600, 40); ctx.fill(); ctx.strokeStyle = BLUE; ctx.lineWidth = 6; ctx.stroke();
  for (let i = 0; i < 14; i++) { ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3; ctx.beginPath(); const x = 180 + i * 55; ctx.moveTo(x, 580); ctx.lineTo(x + 40, 640); ctx.stroke(); }
  ctx.restore();
  if (k > .3) { text(`$${(2.54 * easeOut(prog(t, T.s4 + .8, T.s4 + 2.0))).toFixed(2)}B`, W / 2, 800, 190, BLUE, 900); text('FROZEN SO FAR', W / 2, 960, 60, INKP, 900);
    text('Tether · Circle · Ripple and others', W / 2, 1060, 36, '#3c4a5a', 700, 'center', MONO); }
  pstamp(t, T.s4 + 2.8, '~$3.2B NOT FROZEN', W / 2, 1380, MARK, -.05, 66);
  text(typed('Source: Binance, Oct 29', t, T.s4 + 3.6, 26), W / 2, 1560, 32, '#6b604b', 600, 'center', MONO);
  ctx.restore();
}
function s5(t) {  // Binance's answer
  ctx.save(); cam(t, T.s5, T.s6, 1.0, 1.06, 0, 0, 0, -30); paper(t);
  note(W / 2, 640, 760, 260, -.02, '#fff', [{t: 'WITHDRAWALS', s: 70}, {t: 'PAUSED', s: 110, c: MARK}], prog(t, T.s5 + .2, T.s5 + .7));
  pstamp(t, T.s5 + 1.0, 'DEPOSITS TOO', 760, 860, MARK, .1, 56);
  const k = prog(t, T.s5 + 1.8, T.s5 + 2.2);
  if (k > 0) { ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = '#fbfaf6'; ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 20; ctx.fillRect(120, 1060, 840, 380); ctx.restore();
    text('"We will cover', W / 2, 1160, 66, INKP, 900); text(typed('all hacking losses."', t, T.s5 + 2.2, 18), W / 2, 1250, 66, INKP, 900);
    text('Yi He, Binance co-CEO', W / 2, 1370, 38, '#6b604b', 700, 'center', MONO); }
  if (t > T.s5 + 4.4) text('How it happened: still unconfirmed.', W / 2, 1600, 40, INKP, 700, 'center', MONO);
  ctx.restore();
}
function s6(t) { ctx.save(); paper(t); lesson(t, L0, LESSON, 820, 20); ctx.restore(); }

function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  if (t < T.s2) s1(t); else if (t < T.s3) s2(t); else if (t < T.s4) s3(t); else if (t < T.s5) s4(t); else if (t < T.s6) s5(t); else s6(t);
  if (t < T.s6) headerBar(t);
  if (t >= T.end) { ctx.save(); ctx.globalAlpha = .92 * prog(t, T.end, T.end + .4); ctx.fillStyle = P.bg1; ctx.fillRect(0, 0, W, H); ctx.restore(); endcard(t, T.end + .2); }
}
