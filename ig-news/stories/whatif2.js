// WHAT IF v2 (owner, Nov 5): the cover and intro never show the result; the stock is a coin with its real ticker;
// a proper versus screen; two modes: "lump" (one-time money) and "dca" (little by little: subscriptions,
// a new phone every 2 years...); a moving camera: the coin stays near the centre while the years scroll past and the
// scale re-fits, so the coin climbs and falls in place. Light theme. Key content stays inside y 300-1500
// (IG 4:5 grid and the X 4:5 cut).
// SPEC (whatif.json, "template": "v2"):
//   mode: "lump" | "dca"; year; cover: [lines]; hook: "line\nline"; question
//   buy: {label, sub, icon, counter}     icon: popcorn | console | phone | cash
//   invest: {label, sub, ticker, color, counter}
//   series: [[date, worth, spent]]   spent = money paid so far (lump: constant)
//   events: [{d, txt, c}], reveal: {spent, worth, mult, note}, lesson: [{t, c}]
const S = window.SPEC, PTS = S.series, N = PTS.length;
Object.assign(P, {bg1: '#FFFFFF', bg2: '#EEF3EA', white: '#0E1A12', dim: '#6B756E', green: '#3E9B27', ink: '#FFFFFF'});
if (window.HOTCOIN_LOGO_DARK) LOGO.src = window.HOTCOIN_LOGO_DARK;
const money = v => '$' + Math.round(v).toLocaleString('en-US');
const COIN = S.invest.color || '#3E9B27';

// ---- timeline (seconds)
const T = {cover: 1.0, hook: 1.0, vs: 3.6, pick: 7.2, c0: 8.2, c1: 25.2, rev: 26.0, out: 31.0};
const LESSON = S.lesson, L0 = T.out + .5, LT = lessonTimes(L0, LESSON, 19);
const LEND = LT[LT.length - 1] + LESSON[LESSON.length - 1].t.length / 19;
const ENDT = LEND + 2.8;                       // the lesson holds ~3 s (owner, Nov 3)
window.DURATION = ENDT + 3.4;
window.COVER_T = 0.02;                         // frame 0 is the cover = default thumbnail everywhere
const idxAt = t => clamp((t - T.c0) / (T.c1 - T.c0)) * (N - 1);
const evTime = i => T.c0 + i / (N - 1) * (T.c1 - T.c0);
const EV = S.events.map(e => ({...e, i: Math.max(0, PTS.findIndex(p => p[0] >= e.d))}));

// smoothed y-scale: max of worth/spent over the visible window, eased so the camera breathes instead of jumping
const WIN = Math.round(N * .28);
const SC = (() => { const raw = PTS.map((p, j) => { let m = 0; for (let k = Math.max(0, j - WIN); k <= j; k++) m = Math.max(m, PTS[k][1], PTS[k][2]); return m; });
  const out = []; let s = raw[0]; raw.forEach((v, j) => { s = v > s ? s + (v - s) * .12 : s + (v - s) * .03; out.push(Math.max(s, raw[j])); }); return out; })();

window.CUES = (() => {
  const c = [{t: T.hook, s: 'thud'}, {t: T.vs, s: 'whoosh'}, {t: T.vs + .5, s: 'whoosh'}, {t: T.vs + 1.0, s: 'stamp'},
    {t: T.pick, s: 'hop'}, {t: T.pick + .5, s: 'whoosh'}, {t: T.c0, s: 'hop'}];
  let y0 = +PTS[0][0].slice(0, 4);
  PTS.forEach((p, i) => { const y = +p[0].slice(0, 4); if (y !== y0) { c.push({t: evTime(i), s: 'key', pitch: 1}); y0 = y; } });
  EV.forEach(e => c.push({t: evTime(e.i), s: e.c === 'red' ? 'crash' : 'chime'}));
  c.push({t: T.rev - .05, s: 'cut'}, {t: T.rev + .6, s: 'cash'}, {t: T.rev + 2.0, s: 'stamp'}, {t: T.rev + 2.1, s: 'cheer'});
  let k = L0; LESSON.forEach(l => { for (let i = 0; i < l.t.length; i++) if (l.t[i] !== ' ') c.push({t: k + i / 19, s: 'key'}); k += l.t.length / 19 + .35; });
  c.push({t: T.out - .4, s: 'pad'}, {t: ENDT + .6, s: 'chime'});
  return c;
})();

// ---- drawing helpers
function txt(s, x, y, size, color, weight = 900, align = 'center', alpha = 1, maxW = W - 120) {
  ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.font = `${weight} ${size}px "Inter Display", Inter, sans-serif`;
  const w = ctx.measureText(s).width; if (w > maxW) ctx.font = `${weight} ${size * maxW / w}px "Inter Display", Inter, sans-serif`;  // never cut off
  ctx.fillText(s, x, y); ctx.globalAlpha = 1;
}
function rrect(x, y, w, h, r, fill, stroke, shadow) {
  ctx.save(); if (shadow) { ctx.shadowColor = shadow; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18; }
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.restore();
  if (stroke) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.strokeStyle = stroke; ctx.lineWidth = 3; ctx.stroke(); }
}
function coin(x, y, r, t = 0, flip = 0) {           // the stock = a coin with its real ticker
  ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(.06, Math.abs(Math.cos(flip))), 1);   // spin without mirrored text
  ctx.shadowColor = 'rgba(20,40,10,.3)'; ctx.shadowBlur = r * .5; ctx.shadowOffsetY = r * .12;
  ctx.fillStyle = COIN; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = r * .08; ctx.beginPath(); ctx.arc(0, 0, r * .84, 0, 7); ctx.stroke();
  const g = ctx.createLinearGradient(-r, -r, r, r); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(.5, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
  const tk = S.invest.ticker; ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `900 ${r * (tk.length > 4 ? .42 : .5)}px "Inter Display", Inter, sans-serif`; ctx.fillText(tk, 0, r * .04);
  ctx.restore();
}
function obj(kind, x, y, r) {                      // the thing you buy (generic drawings, no logos)
  ctx.save(); ctx.translate(x, y);
  if (kind === 'popcorn') {
    const w = r * 1.3, h = r * 1.35;
    ctx.shadowColor = 'rgba(20,40,10,.22)'; ctx.shadowBlur = 18; ctx.fillStyle = '#FFF4D6';
    for (const [px, py, pr] of [[-.45, -.75, .36], [0, -.92, .4], [.45, -.75, .36], [-.22, -.55, .34], [.25, -.55, .34]]) { ctx.beginPath(); ctx.arc(px * r, py * r, pr * r, 0, 7); ctx.fill(); }
    ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(232,180,60,.5)'; for (const [px, py] of [[-.3, -.85], [.15, -.98], [.4, -.7]]) { ctx.beginPath(); ctx.arc(px * r, py * r, r * .08, 0, 7); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-w / 2, -h * .35); ctx.lineTo(w / 2, -h * .35); ctx.lineTo(w * .38, h * .65); ctx.lineTo(-w * .38, h * .65); ctx.closePath(); ctx.save(); ctx.clip();
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-w, -h, w * 2, h * 2); ctx.fillStyle = '#E5322D';
    for (let k = -3; k <= 3; k += 2) ctx.fillRect(k * w / 8 - w / 16, -h, w / 8, h * 2);
    ctx.restore(); ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 3; ctx.stroke();
  } else if (kind === 'console') {
    const w = r * 2.3, h = r * 1.2, jw = r * .42;
    ctx.fillStyle = '#00A9E0'; ctx.beginPath(); ctx.roundRect(-w / 2 - jw, -h / 2, jw * 1.6, h, [h * .45, 0, 0, h * .45]); ctx.fill();
    ctx.fillStyle = '#FF4B3A'; ctx.beginPath(); ctx.roundRect(w / 2 - jw * .6, -h / 2, jw * 1.6, h, [0, h * .45, h * .45, 0]); ctx.fill();
    ctx.fillStyle = '#2B2F33'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 10); ctx.fill();
    ctx.fillStyle = '#11161B'; ctx.beginPath(); ctx.roundRect(-w / 2 + r * .1, -h / 2 + r * .1, w - r * .2, h - r * .2, 6); ctx.fill();
  } else if (kind === 'car') {        // generic electric sedan, side view (no logos)
    ctx.shadowColor = 'rgba(20,40,10,.22)'; ctx.shadowBlur = 16;
    ctx.fillStyle = '#E8E9EB'; ctx.beginPath(); ctx.moveTo(-r * 1.25, r * .25); ctx.quadraticCurveTo(-r * 1.3, -r * .15, -r * .8, -r * .22);
    ctx.quadraticCurveTo(-r * .35, -r * .72, r * .25, -r * .66); ctx.quadraticCurveTo(r * .75, -r * .55, r * 1.05, -r * .18);
    ctx.quadraticCurveTo(r * 1.3, -r * .1, r * 1.28, r * .25); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#2B3540'; ctx.beginPath(); ctx.moveTo(-r * .62, -r * .26); ctx.quadraticCurveTo(-r * .25, -r * .6, r * .22, -r * .56);
    ctx.quadraticCurveTo(r * .62, -r * .46, r * .82, -r * .22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#C8102E'; ctx.fillRect(-r * 1.2, r * .02, r * 2.45, r * .06);
    for (const wx of [-r * .72, r * .78]) { ctx.fillStyle = '#1C1F23'; ctx.beginPath(); ctx.arc(wx, r * .28, r * .3, 0, 7); ctx.fill();
      ctx.fillStyle = '#B9BEC5'; ctx.beginPath(); ctx.arc(wx, r * .28, r * .14, 0, 7); ctx.fill(); }
  } else if (kind === 'coffee') {     // generic takeaway cup (no logos)
    ctx.shadowColor = 'rgba(20,40,10,.22)'; ctx.shadowBlur = 16;
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(-r * .55, -r * .62); ctx.lineTo(r * .55, -r * .62); ctx.lineTo(r * .42, r * .95); ctx.lineTo(-r * .42, r * .95); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#8B5A3C'; ctx.beginPath(); ctx.moveTo(-r * .5, -r * .05); ctx.lineTo(r * .5, -r * .05); ctx.lineTo(r * .46, r * .45); ctx.lineTo(-r * .46, r * .45); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2B2F33'; ctx.beginPath(); ctx.roundRect(-r * .66, -r * .86, r * 1.32, r * .28, r * .08); ctx.fill();
    ctx.fillStyle = '#3B4046'; ctx.beginPath(); ctx.roundRect(-r * .48, -r * 1.02, r * .96, r * .2, r * .06); ctx.fill();
    ctx.strokeStyle = 'rgba(140,90,60,.5)'; ctx.lineWidth = r * .06; ctx.lineCap = 'round';
    for (const dx of [-.18, .12]) { ctx.beginPath(); ctx.moveTo(dx * r, -r * 1.12); ctx.bezierCurveTo(dx * r - r * .12, -r * 1.3, dx * r + r * .12, -r * 1.42, dx * r, -r * 1.6); ctx.stroke(); }
  } else if (kind === 'block') {      // generic voxel grass block, isometric (no logos)
    const k = r * .8;
    ctx.shadowColor = 'rgba(20,40,10,.22)'; ctx.shadowBlur = 16;
    ctx.fillStyle = '#7CC242'; ctx.beginPath(); ctx.moveTo(0, -k); ctx.lineTo(k * .95, -k * .5); ctx.lineTo(0, 0); ctx.lineTo(-k * .95, -k * .5); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#8B5E3C'; ctx.beginPath(); ctx.moveTo(-k * .95, -k * .5); ctx.lineTo(0, 0); ctx.lineTo(0, k * 1.05); ctx.lineTo(-k * .95, k * .55); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#6E4A2F'; ctx.beginPath(); ctx.moveTo(k * .95, -k * .5); ctx.lineTo(0, 0); ctx.lineTo(0, k * 1.05); ctx.lineTo(k * .95, k * .55); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5FA52E'; for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sg * k * .95, -k * .5); ctx.lineTo(0, 0); ctx.lineTo(0, k * .25); ctx.lineTo(sg * k * .95, -k * .25); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = 'rgba(0,0,0,.12)'; for (const [px, py] of [[-.55, .25], [-.3, .55], [.4, .3], [.62, .05], [.25, .7]]) ctx.fillRect(px * k - k * .07, py * k, k * .14, k * .14);
  } else if (kind === 'headphones') { // generic over-ear headphones (no logos)
    ctx.shadowColor = 'rgba(20,40,10,.22)'; ctx.shadowBlur = 16;
    ctx.strokeStyle = '#2B2F33'; ctx.lineWidth = r * .16; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, r * .1, r * .78, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke(); ctx.shadowBlur = 0;
    for (const sg of [-1, 1]) {
      ctx.fillStyle = '#2B2F33'; ctx.beginPath(); ctx.roundRect(sg * r * .78 - r * .22, -r * .05, r * .44, r * .72, r * .18); ctx.fill();
      ctx.fillStyle = '#1DB954'; ctx.beginPath(); ctx.roundRect(sg * r * .78 - (sg > 0 ? r * .22 : -r * .06), r * .05, r * .16, r * .52, r * .07); ctx.fill(); }
  } else if (kind === 'cart') {       // generic shopping cart (no logos)
    ctx.shadowColor = 'rgba(20,40,10,.22)'; ctx.shadowBlur = 16;
    ctx.fillStyle = '#FF6A00'; ctx.beginPath(); ctx.moveTo(-r * .8, -r * .55); ctx.lineTo(r * .9, -r * .55); ctx.lineTo(r * .7, r * .3); ctx.lineTo(-r * .62, r * .3); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = r * .05;
    for (const k of [-.35, .05, .45]) { ctx.beginPath(); ctx.moveTo(k * r, -r * .5); ctx.lineTo(k * r * .92, r * .26); ctx.stroke(); }
    ctx.strokeStyle = '#2B2F33'; ctx.lineWidth = r * .1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-r * 1.15, -r * .85); ctx.lineTo(-r * .92, -r * .85); ctx.lineTo(-r * .62, r * .48); ctx.lineTo(r * .72, r * .48); ctx.stroke();
    ctx.fillStyle = '#2B2F33'; for (const wx of [-r * .45, r * .55]) { ctx.beginPath(); ctx.arc(wx, r * .72, r * .14, 0, 7); ctx.fill(); }
  } else if (kind === 'phone') {
    ctx.fillStyle = '#1C1F23'; ctx.beginPath(); ctx.roundRect(-r * .55, -r, r * 1.1, r * 2, r * .2); ctx.fill();
    const g = ctx.createLinearGradient(0, -r, 0, r); g.addColorStop(0, '#8EC5FF'); g.addColorStop(1, '#C69CFF');
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-r * .47, -r * .9, r * .94, r * 1.8, r * .15); ctx.fill();
    ctx.fillStyle = '#1C1F23'; ctx.beginPath(); ctx.roundRect(-r * .16, -r * .84, r * .32, r * .1, r * .05); ctx.fill();
  } else {  // cash
    for (const [dx, dy, c] of [[14, 14, '#BFE3A8'], [0, 0, '#5DB23A']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(-r * 1.1 + dx, -r * .62 + dy, r * 2.2, r * 1.24, 18); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.beginPath(); ctx.arc(0, 0, r * .36, 0, 7); ctx.fill();
    txt('$', 0, 3, r * .5, '#3E9B27');
  }
  ctx.restore();
}
function pill(s, y, color, alpha) {
  ctx.globalAlpha = alpha; ctx.font = '800 42px Inter, sans-serif';
  const w = ctx.measureText(s).width + 48; const x = W / 2 - w / 2;
  ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y - 35, w, 70, 35); ctx.fill();
  ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, W / 2, y + 2); ctx.globalAlpha = 1;
}

// ---- the versus pair (used by the cover and the versus scene)
function versus(k, a, sz = 1, yTop = 560, dimL = 0) {
  const pw = 430 * sz, ph = 620 * sz, gap = 40 * sz;
  const lx = lerp(-pw, W / 2 - gap / 2 - pw, easeOut(k)), rx = lerp(W, W / 2 + gap / 2, easeOut(k));
  ctx.globalAlpha = a * (1 - dimL * .7);
  rrect(lx, yTop, pw, ph, 46 * sz, '#FFF3F1', 'rgba(229,50,45,.18)', 'rgba(60,20,10,.10)');
  obj(S.buy.icon, lx + pw / 2, yTop + ph * .36, 115 * sz);
  ctx.globalAlpha = a * (1 - dimL * .7);
  txt(S.buy.label.toUpperCase(), lx + pw / 2, yTop + ph * .70, 48 * sz, P.white, 900, 'center', a * (1 - dimL * .7), pw - 40);
  txt(S.buy.sub, lx + pw / 2, yTop + ph * .83, 34 * sz, P.dim, 700, 'center', a * (1 - dimL * .7), pw - 40);
  ctx.globalAlpha = a;
  rrect(rx, yTop, pw, ph, 46 * sz, '#EEF8E8', 'rgba(62,155,39,.25)', 'rgba(20,60,10,.12)');
  if (!window.__coinFlying) coin(rx + pw / 2, yTop + ph * .36, 125 * sz);
  txt(S.invest.label.toUpperCase(), rx + pw / 2, yTop + ph * .70, 48 * sz, P.white, 900, 'center', a, pw - 40);
  txt(S.invest.sub, rx + pw / 2, yTop + ph * .83, 34 * sz, P.dim, 700, 'center', a, pw - 40);
  return {lx, rx, pw, ph};
}
function vsBadge(x, y, s, a) {
  if (s <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 24; ctx.fillStyle = '#0E1A12'; ctx.beginPath(); ctx.arc(0, 0, 78, 0, 7); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, 78, 0, 7); ctx.stroke();
  txt('VS', 0, 4, 64, '#FFFFFF'); ctx.restore(); ctx.globalAlpha = 1;
}

// ---- cover (thumbnail): the question, never the answer
function cover(a) {
  sky(); ctx.globalAlpha = a;
  ctx.fillStyle = P.green; ctx.beginPath(); ctx.roundRect(W / 2 - 130, 300, 260, 76, 38); ctx.fill(); txt('WHAT IF?', W / 2, 340, 42, '#FFFFFF', 900, 'center', a);
  S.cover.forEach((l, k) => txt(l, W / 2, 450 + k * 104, 92, k === S.cover.length - 1 ? P.green : P.white, 900, 'center', a));
  const y = 450 + S.cover.length * 104 - 10;
  versus(1, a, .78, y);
  vsBadge(W / 2, y + 620 * .78 * .38, 1, a);
  txt('WHICH ONE WINS?', W / 2, y + 620 * .78 + 80, 60, P.white, 900, 'center', a);
  ctx.globalAlpha = 1; corner(.8 * a);
}

// ---- chart with a moving camera
const HX = 600, CY0 = 700, CY1 = 1420, PXP = 760 / (N * .3);   // head x, chart band, px per point (~30% of history visible)
function chart(t, a) {
  const fi = idxAt(t), i = Math.floor(fi), f = fi - i;
  const at = (j, c) => PTS[Math.min(j, N - 1)][c];
  const cur = i >= N - 1 ? at(N - 1, 1) : lerp(at(i, 1), at(i + 1, 1), f);
  const spent = i >= N - 1 ? at(N - 1, 2) : lerp(at(i, 2), at(i + 1, 2), f);
  const mx = (i >= N - 1 ? SC[N - 1] : lerp(SC[i], SC[Math.min(i + 1, N - 1)], f)) * 1.3;
  const X = j => HX - (fi - j) * PXP, Y = v => CY1 - v / mx * (CY1 - CY0);
  ctx.save(); ctx.globalAlpha = a;
  // big faint year
  txt(PTS[Math.min(i, N - 1)][0].slice(0, 4), W / 2, 1060, 330, P.white, 900, 'center', a * .05);
  // grid lines with $ labels (the scale re-fits, so they glide)
  const step = (() => { const raw = mx / 4, p = Math.pow(10, Math.floor(Math.log10(raw))); return [1, 2, 2.5, 5, 10].map(m => m * p).find(s => s >= raw); })();
  for (let v = step; v < mx; v += step) { const y = Y(v); ctx.globalAlpha = a * .5; ctx.strokeStyle = 'rgba(14,26,18,.10)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W - 40, y); ctx.stroke(); txt(money(v), W - 46, y - 22, 28, P.dim, 700, 'right', a * .8); }
  // year ticks scroll under the chart
  let py = '';
  PTS.forEach((p, j) => { if (j > fi) return; const y = p[0].slice(0, 4); if (y !== py) { py = y; const x = X(j);
    if (x > 30 && x < W - 30) { ctx.globalAlpha = a * .7; ctx.fillStyle = 'rgba(14,26,18,.25)'; ctx.fillRect(x - 1, CY1 + 10, 2, 18); txt(y, x, CY1 + 52, 30, P.dim, 700, 'center', a * .9); } } });
  const j0 = Math.max(0, Math.floor(fi - (HX + 60) / PXP));
  // money spent (grey) and the stock (green, red while under what you spent)
  ctx.globalAlpha = a; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const path = (c, v) => { ctx.beginPath(); ctx.moveTo(X(j0), Y(at(j0, c))); for (let j = j0 + 1; j <= i; j++) ctx.lineTo(X(j), Y(at(j, c))); ctx.lineTo(X(fi), Y(v)); };
  const g = ctx.createLinearGradient(0, CY0, 0, CY1); g.addColorStop(0, 'rgba(62,155,39,.30)'); g.addColorStop(1, 'rgba(62,155,39,0)');
  path(1, cur); ctx.lineTo(X(fi), CY1); ctx.lineTo(X(j0), CY1); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
  ctx.setLineDash(S.mode === 'dca' ? [] : [16, 14]); path(2, spent); ctx.strokeStyle = 'rgba(14,26,18,.35)'; ctx.lineWidth = 7; ctx.stroke(); ctx.setLineDash([]);
  path(1, cur); ctx.strokeStyle = cur >= spent ? P.green : P.red; ctx.lineWidth = 10; ctx.stroke();
  EV.forEach(e => { if (e.i > fi) return; const x = X(e.i); if (x < 20) return; ctx.globalAlpha = a; ctx.fillStyle = e.c === 'red' ? P.red : P.green;
    ctx.beginPath(); ctx.arc(x, Y(at(e.i, 1)), 12, 0, 7); ctx.fill(); });
  // the purchase rides the spent line, the ticker coin rides the stock
  ctx.globalAlpha = a; obj(S.buy.icon, X(fi), Y(spent) - 4, 34);
  const bob = Math.sin(t * 3) * 4; coin(X(fi), Y(cur) + bob, 66, t, Math.sin(t * 1.3) * .35);
  // counters
  rrect(70, 330, 455, 190, 36, '#FFFFFF', 'rgba(14,26,18,.08)', 'rgba(20,40,10,.08)');
  rrect(555, 330, 455, 190, 36, '#FFFFFF', 'rgba(62,155,39,.25)', 'rgba(20,40,10,.08)');
  txt(S.buy.counter.toUpperCase(), 297, 380, 28, P.dim, 800, 'center', a); txt(money(spent), 297, 455, 78, P.white, 900, 'center', a);
  txt(S.invest.counter.toUpperCase(), 782, 380, 28, P.dim, 800, 'center', a); txt(money(cur), 782, 455, 78, cur >= spent ? P.green : P.red, 900, 'center', a);
  const live = EV.filter(e => e.i <= fi && t - evTime(e.i) < 2.4).pop();
  if (live) { const age = t - evTime(live.i); pill(live.txt, 600, live.c === 'red' ? P.red : P.green, a * clamp(age * 5) * clamp((2.4 - age) * 3)); }
  ctx.restore(); ctx.globalAlpha = 1;
}

function draw(t) {
  if (t < T.cover) { cover(1); return; }
  const [sx, sy] = shake(t, EV.filter(e => e.c === 'red').map(e => evTime(e.i)).find(x => t >= x && t < x + .6) ?? -9, .6, 20);
  ctx.save(); ctx.translate(sx, sy); sky();
  // 1. hook (the question, typed big)
  const ha = prog(t, T.hook, T.hook + .25) * (1 - prog(t, T.vs - .3, T.vs));
  if (ha > 0) { const ls = S.hook.split('\n'); ls.forEach((l, k) => { const s = lerp(.9, 1, easeOut(prog(t, T.hook + k * .35, T.hook + k * .35 + .3)));
      ctx.save(); ctx.translate(W / 2, 760 + k * 120); ctx.scale(s, s); txt(l, 0, 0, k === ls.length - 1 ? 104 : 84, k === ls.length - 1 ? P.green : P.white, 900, 'center', ha * prog(t, T.hook + k * .35, T.hook + k * .35 + .2)); ctx.restore(); }); }
  // 2. versus
  const vk = prog(t, T.vs, T.vs + .6), vo = prog(t, T.c0 - .4, T.c0);
  if (vk > 0 && vo < 1) {
    const dimL = easeInOut(prog(t, T.pick, T.pick + .4));
    txt(S.question, W / 2, 440, 76, P.white, 900, 'center', prog(t, T.vs + .5, T.vs + .8) * (1 - vo));
    window.__coinFlying = t > T.pick + .5;
    const g = versus(vk, 1 - vo, 1, 560, dimL); window.__coinFlying = false;
    const bs = t < T.vs + .9 ? 0 : (t < T.vs + 1.15 ? lerp(1.6, .9, prog(t, T.vs + .9, T.vs + 1.15)) : lerp(.9, 1, prog(t, T.vs + 1.15, T.vs + 1.3)));
    vsBadge(W / 2, 560 + 620 * .38, bs * (1 - dimL), 1 - vo);
    if (t > T.pick && t < T.pick + .6) { const k = prog(t, T.pick, T.pick + .6);  // check mark on the stock
      ctx.globalAlpha = (1 - vo); ctx.strokeStyle = P.green; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.arc(g.rx + g.pw / 2, 560 + 620 * .36, 160 + 20 * k, 0, 7 * k); ctx.stroke(); ctx.globalAlpha = 1; }
    if (t > T.pick + .5) { const k = easeInOut(prog(t, T.pick + .5, T.c0 + .05)); coin(lerp(g.rx + g.pw / 2, HX, k), lerp(560 + 620 * .36, CY1 - 40, k), lerp(125, 66, k), t, k * 6.28); }
  }
  // 3. chart
  const cha = prog(t, T.c0 - .1, T.c0 + .3) * (1 - .8 * easeInOut(prog(t, T.rev, T.rev + .8))) * (1 - prog(t, T.out - .5, T.out));
  if (cha > 0) chart(t, cha);
  // 4. reveal: what you paid vs what the stock is worth
  if (t >= T.rev) { const a = 1 - prog(t, T.out - .5, T.out);
    if (a > 0) { ctx.globalAlpha = .92 * a * prog(t, T.rev, T.rev + .6); ctx.fillStyle = P.bg1; ctx.fillRect(-80, -80, W + 160, H + 160); ctx.globalAlpha = 1;
      const k1 = easeOut(prog(t, T.rev + .3, T.rev + 1.3)), k2 = easeOut(prog(t, T.rev + .8, T.rev + 2.0));
      rrect(110, 470, 860, 300, 44, '#FFFFFF', 'rgba(14,26,18,.10)', 'rgba(20,40,10,.10)');
      obj(S.buy.icon, 230, 620, 70); txt(S.reveal.spent_label.toUpperCase(), 610, 560, 36, P.dim, 800, 'center', a * k1);
      txt(money(PTS[N - 1][2] * k1), 610, 660, 120, P.white, 900, 'center', a * k1);
      rrect(110, 820, 860, 340, 44, '#EEF8E8', 'rgba(62,155,39,.35)', 'rgba(20,60,10,.14)');
      coin(230, 990, 74); txt(S.reveal.worth_label.toUpperCase(), 610, 900, 36, P.dim, 800, 'center', a * k2);
      txt(money(PTS[N - 1][1] * k2), 610, 1010, 150, P.green, 900, 'center', a * k2);
      if (t > T.rev + 2.0) { const s = lerp(1.8, 1, easeOut(prog(t, T.rev + 2.0, T.rev + 2.2)));
        ctx.save(); ctx.translate(W / 2, 1290); ctx.rotate(-.05); ctx.scale(s, s); ctx.globalAlpha = a;
        ctx.fillStyle = P.green; ctx.beginPath(); ctx.roundRect(-230, -60, 460, 120, 60); ctx.fill(); txt(S.reveal.mult, 0, 4, 64, '#FFFFFF', 900, 'center', a); ctx.restore(); }
      txt(S.reveal.note, W / 2, 1420, 32, P.dim, 600, 'center', a * prog(t, T.rev + 2.6, T.rev + 3.0)); } }
  // 5. lesson + end card
  if (t >= L0 - .4) lesson(t, L0, LESSON, 800, 19);
  endcard(t, ENDT);
  corner(.7 * (1 - prog(t, L0 - .5, L0)));
  ctx.restore();
  const f = 1 - prog(t, T.cover, T.cover + .35); if (f > 0) cover(f);   // cover dissolves into the hook
}
