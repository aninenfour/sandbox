// WHAT IF price-dot Reel (owner, Oct 28): "instead of buying X, you put the money in Y".
// Real price history draws itself, the dot is the object riding the line, a live $ counter, a big reveal.
// Data comes from window.SPEC (the post's whatif.json): amount, year, buy {label, price, icon}, invest {label},
// series [[date, value of the money]], events [{d, txt, c}], reveal {value, sub}, lesson [{t, c}].
const S = window.SPEC, PTS = S.series, N = PTS.length;
const T = {year: .25, cash: 1.3, choice: 2.6, fly: 4.6, c0: 5.4, c1: 17.4, rev: 17.9};
const LESSON = S.lesson, L0 = T.rev + 2.9, LT = lessonTimes(L0, LESSON, 19);
const LEND = LT[LT.length - 1] + LESSON[LESSON.length - 1].t.length / 19;
window.DURATION = LEND + 3.2;
window.COVER_T = T.rev + .9;            // cover = the reveal
const CX0 = 110, CX1 = 970, CY0 = 720, CY1 = 1460;           // chart box
const fmt = v => '$' + Math.round(v).toLocaleString('en-US');
const idxAt = t => clamp((t - T.c0) / (T.c1 - T.c0)) * (N - 1);
const EV = S.events.map(e => ({...e, i: PTS.findIndex(p => p[0] >= e.d)}));
const evTime = i => T.c0 + i / (N - 1) * (T.c1 - T.c0);

window.CUES = (() => {
  const c = [{t: T.year, s: 'thud'}, {t: T.cash, s: 'cash'}, {t: T.choice, s: 'whoosh'}, {t: T.choice + .9, s: 'hop'},
    {t: T.fly - .1, s: 'whoosh'}, {t: T.c0, s: 'hop'}];
  let y0 = +PTS[0][0].slice(0, 4);
  PTS.forEach((p, i) => { const y = +p[0].slice(0, 4); if (y !== y0) { c.push({t: evTime(i), s: 'key', pitch: 1}); y0 = y; } });
  EV.forEach(e => c.push({t: evTime(e.i), s: e.c === 'red' ? 'crash' : 'chime'}));
  c.push({t: T.rev - .05, s: 'cut'}, {t: T.rev, s: 'stamp'}, {t: T.rev + .1, s: 'cash'}, {t: T.rev + .5, s: 'cheer'});
  let k = L0; LESSON.forEach(l => { for (let i = 0; i < l.t.length; i++) if (l.t[i] !== ' ') c.push({t: k + i / 19, s: 'key'}); k += l.t.length / 19 + .35; });
  c.push({t: T.rev + 2.6, s: 'pad'}, {t: LEND + .6, s: 'chime'});
  return c;
})();

// ---- objects (generic drawings, no logos)
function icon(kind, x, y, r, t) {
  ctx.save(); ctx.translate(x, y);
  if (kind === 'disc') {
    ctx.rotate(t * 5);
    const g = ctx.createConicGradient(0, 0, 0);
    ['#C9D1D9', '#8EE3F5', '#F5E08E', '#F59ED7', '#9EF5B4', '#C9D1D9'].forEach((c, i) => g.addColorStop(i / 5, c));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, -.5, -.1); ctx.fill();
    ctx.fillStyle = '#E6EAEE'; ctx.beginPath(); ctx.arc(0, 0, r * .3, 0, 7); ctx.fill();
    ctx.fillStyle = P.bg1; ctx.beginPath(); ctx.arc(0, 0, r * .12, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke();
  } else if (kind === 'chart') {
    ctx.fillStyle = '#16202D'; ctx.strokeStyle = P.green; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.roundRect(-r, -r * .8, r * 2, r * 1.6, 18); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.beginPath();
    [[-.75, .45], [-.35, .15], [-.05, .3], [.3, -.2], [.72, -.55]].forEach(([a, b], i) => ctx[i ? 'lineTo' : 'moveTo'](a * r, b * r)); ctx.stroke();
  } else if (kind === 'cash') {
    ctx.rotate(-.08); ctx.fillStyle = '#2E6B1F'; ctx.beginPath(); ctx.roundRect(-r * 1.5, -r * .7, r * 3, r * 1.4, 14); ctx.fill();
    ctx.strokeStyle = P.green; ctx.lineWidth = 5; ctx.strokeRect(-r * 1.35, -r * .55, r * 2.7, r * 1.1);
    ctx.fillStyle = P.white; ctx.font = `900 ${r * .9}px "Inter Display", Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('$' + S.amount, 0, 4);
  }
  ctx.restore();
}

function title(txt, y, size, color = P.white, alpha = 1, weight = 900) {
  ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `${weight} ${size}px "Inter Display", Inter, sans-serif`; ctx.fillText(txt, W / 2, y); ctx.globalAlpha = 1;
}
function pill(txt, x, y, color, alpha) {
  ctx.globalAlpha = alpha; ctx.font = '800 42px Inter, sans-serif';
  const w = ctx.measureText(txt).width + 44; x = clamp(x - w / 2, 40, W - 40 - w);
  ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y - 34, w, 68, 34); ctx.fill();
  ctx.fillStyle = color === P.red ? P.white : P.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, x + 22, y + 2);
  ctx.globalAlpha = 1;
}

// ---- chart
function chart(t, alpha) {
  const fi = idxAt(t), i = Math.floor(fi), f = fi - i;
  const val = j => PTS[Math.min(j, N - 1)][1];
  const cur = i >= N - 1 ? val(N - 1) : lerp(val(i), val(i + 1), f);
  let mx = S.amount * 3; for (let j = 0; j <= i; j++) mx = Math.max(mx, val(j)); mx = Math.max(mx, cur) * 1.25;
  const X = j => CX0 + j / (N - 1) * (CX1 - CX0), Y = v => CY1 - v / mx * (CY1 - CY0);
  ctx.globalAlpha = alpha;
  // big background year
  title(PTS[Math.min(i, N - 1)][0].slice(0, 4), 1090, 330, '#FFFFFF', alpha * .06);
  ctx.globalAlpha = alpha;
  // baseline = what you started with
  ctx.setLineDash([14, 14]); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(CX0, Y(S.amount)); ctx.lineTo(CX1, Y(S.amount)); ctx.stroke(); ctx.setLineDash([]);
  // area + line
  const path = () => { ctx.beginPath(); ctx.moveTo(X(0), Y(val(0))); for (let j = 1; j <= i; j++) ctx.lineTo(X(j), Y(val(j))); ctx.lineTo(X(fi), Y(cur)); };
  const g = ctx.createLinearGradient(0, CY0, 0, CY1); g.addColorStop(0, 'rgba(126,194,90,.45)'); g.addColorStop(1, 'rgba(126,194,90,0)');
  path(); ctx.lineTo(X(fi), CY1); ctx.lineTo(X(0), CY1); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
  path(); ctx.strokeStyle = P.green; ctx.lineWidth = 8; ctx.lineJoin = 'round'; ctx.stroke();
  // events
  EV.forEach(e => {
    if (e.i > fi) return; const age = t - evTime(e.i); const a = clamp(age * 4) * clamp((2.2 - age) * 2);
    if (a <= 0) return; const c = e.c === 'red' ? P.red : P.green;
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X(e.i), Y(val(e.i)), 14, 0, 7); ctx.fill();
    pill(e.txt, X(e.i), Math.max(CY0 - 40, Y(val(e.i)) - 110), c, a * alpha);
  });
  ctx.globalAlpha = alpha;
  // the dot = the object
  icon(S.buy.icon, X(fi), Y(cur), 62, t);
  // counter
  ctx.globalAlpha = alpha; title(`$${S.amount} in ${S.invest.label}`, 400, 52, P.dim, alpha, 700);
  title(fmt(cur), 520, 150, cur >= S.amount ? P.green : P.red, alpha);
  ctx.globalAlpha = 1;
  return cur;
}

function draw(t) {
  const [sx, sy] = shake(t, EV.filter(e => e.c === 'red').map(e => evTime(e.i)).find(x => t >= x && t < x + .6) ?? -9, .6, 22);
  ctx.save(); ctx.translate(sx, sy);
  sky(); stars(t, .5);
  // 1. the year
  const ya = clamp(prog(t, T.year, T.year + .15)) * (1 - prog(t, T.choice + .2, T.choice + .5));
  if (ya > 0) title(S.year, 520 - 30 * prog(t, T.year, T.fly), lerp(260, 220, prog(t, T.year, T.year + .25)), P.white, ya);
  // 2. you have $X
  const ca = easeOut(prog(t, T.cash, T.cash + .3)) * (1 - prog(t, T.choice, T.choice + .3));
  if (ca > 0) { icon('cash', W / 2, 900 + 40 * (1 - ca), 110, t); title(`You have $${S.amount}.`, 1150, 80, P.white, ca); }
  // 3. the choice
  const ch = easeOut(prog(t, T.choice, T.choice + .35)), out = prog(t, T.fly - .2, T.fly + .3);
  if (ch > 0 && out < 1) {
    const a = ch * (1 - out);
    const LX = lerp(W / 2, 290, ch), RX = lerp(W / 2, 790, ch);
    // left card: the purchase. Its object flies to the chart start.
    const fk = easeInOut(prog(t, T.fly - .4, T.c0));
    const ox = lerp(LX, CX0, fk), oy = lerp(880, CY1 - 60, fk);
    ctx.globalAlpha = a; ctx.fillStyle = '#121C29'; ctx.strokeStyle = '#3B4B5E'; ctx.lineWidth = 5;
    for (const x of [LX, RX]) { ctx.beginPath(); ctx.roundRect(x - 220, 700, 440, 560, 34); ctx.fill(); ctx.stroke(); }
    icon('chart', RX, 880, 120, t);
    ctx.globalAlpha = a; ctx.font = '800 46px Inter, sans-serif'; ctx.fillStyle = P.white; ctx.textAlign = 'center';
    S.buy.label.split('\n').forEach((l, k) => ctx.fillText(l, LX, 1090 + k * 56));
    S.invest.card.split('\n').forEach((l, k) => ctx.fillText(l, RX, 1090 + k * 56));
    ctx.fillStyle = P.dim; ctx.font = '700 40px Inter, sans-serif'; ctx.fillText(S.buy.price, LX, 1210); ctx.fillText(`$${S.amount} of stock`, RX, 1210);
    title('OR', 980, 64, P.green, a);
    title(S.question, 470, 84, P.white, a * prog(t, T.choice + .5, T.choice + .8));
    ctx.globalAlpha = 1;
  }
  if (t < T.c0 + .05 && t > T.fly - .4) icon(S.buy.icon, ...(() => { const fk = easeInOut(prog(t, T.fly - .4, T.c0)); return [lerp(290, CX0, fk), lerp(880, CY1 - 60, fk)]; })(), 110 - 48 * prog(t, T.fly - .4, T.c0), t);
  else if (t <= T.fly - .4 && ch > 0) icon(S.buy.icon, lerp(W / 2, 290, ch), 880, 110, t);
  // 4. the chart
  const cha = prog(t, T.c0 - .3, T.c0 + .2) * (1 - prog(t, T.rev + 2.2, T.rev + 2.8));
  if (cha > 0) chart(t, cha);
  // 5. the reveal
  if (t >= T.rev) {
    const k = easeOut(prog(t, T.rev, T.rev + .25)), a = 1 - prog(t, T.rev + 2.2, T.rev + 2.8);
    ctx.globalAlpha = .9 * a; ctx.fillStyle = P.bg1; ctx.fillRect(-80, -80, W + 160, H + 160); ctx.globalAlpha = 1;
    if (a > 0) {
      ctx.save(); ctx.translate(W / 2, 960); ctx.scale(lerp(1.6, 1, k), lerp(1.6, 1, k)); ctx.translate(-W / 2, -960);
      title(S.reveal.value, 960, 200, P.green, a * k); ctx.restore();
      title(S.reveal.sub, 1110, 50, P.white, a * prog(t, T.rev + .5, T.rev + .8), 700);
      title(S.reveal.game, 1190, 44, P.dim, a * prog(t, T.rev + 1.0, T.rev + 1.3), 600);
    }
  }
  // 6. lesson + end card
  if (t >= L0 - .4) lesson(t, L0, LESSON, 780, 19);
  endcard(t, LEND + .5);
  corner(.7 * (1 - prog(t, L0 - .5, L0)));
  ctx.restore();
}
