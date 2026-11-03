// WHAT IF price-dot Reel (owner, Oct 28): "instead of buying X, you put the money in Y".
// Real price history draws itself, the dot is the object riding the line, a live $ counter, a big reveal.
// Data comes from window.SPEC (the post's whatif.json): amount, year, buy {label, price, icon}, invest {label},
// series [[date, value of the money]], events [{d, txt, c}], reveal {value, sub}, lesson [{t, c}].
// Real images (owner OK'd, Oct 28): put files in the post folder and name them in buy.card_img (cover/box art on the
// choice card) and buy.dot_img (cut-out object that rides the line, e.g. the real disc; buy.spin: true rotates it).
const S = window.SPEC, PTS = S.series, N = PTS.length;
// Owner, Nov 3: white background, light motion design, big readable choice cards, hold the ending longer.
// Light is the default; set "theme": "dark" in whatif.json for the old night look.
const LIGHT = S.theme !== 'dark';
if (LIGHT) { Object.assign(P, {bg1: '#FFFFFF', bg2: '#EEF3EA', white: '#0E1A12', dim: '#6B756E', green: '#3E9B27', ink: '#FFFFFF'});
  if (window.HOTCOIN_LOGO_DARK) LOGO.src = window.HOTCOIN_LOGO_DARK; }
const CARD = LIGHT ? {fill: '#FFFFFF', line: '#DDE5D8', shadow: 'rgba(30,60,20,.14)'} : {fill: '#121C29', line: '#3B4B5E', shadow: 'rgba(0,0,0,0)'};
const money = v => '$' + Math.round(v).toLocaleString('en-US');
// Owner, Oct 28: slower pacing and a smoother, slower reveal (longer video is fine).
const T = {year: .25, cash: 1.4, choice: 2.9, fly: 5.6, c0: 6.6, c1: 22.6, rev: 23.6, out: 28.2};
const LESSON = S.lesson, L0 = T.out + .6, LT = lessonTimes(L0, LESSON, 19);
const LEND = LT[LT.length - 1] + LESSON[LESSON.length - 1].t.length / 19;
const ENDT = LEND + 2.8;                 // lesson holds ~3 s before the end card (owner, Nov 3)
window.DURATION = ENDT + 3.4;
window.COVER_T = T.rev + 3.1;            // cover = the reveal
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
  c.push({t: T.rev - .05, s: 'cut'}, {t: T.rev + .9, s: 'stamp'}, {t: T.rev + 1.0, s: 'cash'}, {t: T.rev + 1.4, s: 'cheer'});
  let k = L0; LESSON.forEach(l => { for (let i = 0; i < l.t.length; i++) if (l.t[i] !== ' ') c.push({t: k + i / 19, s: 'key'}); k += l.t.length / 19 + .35; });
  c.push({t: T.out - .4, s: 'pad'}, {t: LEND + .6, s: 'chime'});
  return c;
})();

// ---- objects (generic drawings, no logos)
const IM = {}; for (const [k, src] of Object.entries(window.IMGS || {})) { IM[k] = new Image(); IM[k].src = src; }
function photo(name, x, y, w, h, round = 0) {  // real photo/cutout, fit inside w x h
  const im = IM[name]; if (!im || !im.naturalWidth) return false;
  const sc = Math.min(w / im.naturalWidth, h / im.naturalHeight), dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
  ctx.save(); if (round) { ctx.beginPath(); ctx.roundRect(x - dw / 2, y - dh / 2, dw, dh, round); ctx.clip(); }
  ctx.drawImage(im, x - dw / 2, y - dh / 2, dw, dh); ctx.restore(); return true;
}
function icon(kind, x, y, r, t) {
  if (kind === S.buy.icon && S.buy.dot_img && IM[S.buy.dot_img]) {  // real object photo as the dot
    ctx.save(); ctx.translate(x, y); if (S.buy.spin) ctx.rotate(t * 5);
    ctx.shadowColor = LIGHT ? 'rgba(20,40,10,.28)' : 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24;
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, 0, r * 1.16, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    photo(S.buy.dot_img, 0, 0, r * 2.1, r * 2.1); ctx.restore(); return;
  }
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
    ctx.fillStyle = LIGHT ? '#EFF7EA' : '#16202D'; ctx.beginPath(); ctx.roundRect(-r, -r * .8, r * 2, r * 1.6, 26); ctx.fill();
    const mx = Math.max(...PTS.map(p => p[1])), step = Math.max(1, Math.floor(N / 80));
    const sx = j => -r * .82 + j / (N - 1) * r * 1.64, sy = v => r * .6 - v / mx * r * 1.2;
    ctx.beginPath(); for (let j = 0; j < N; j += step) ctx[j ? 'lineTo' : 'moveTo'](sx(j), sy(PTS[j][1])); ctx.lineTo(sx(N - 1), sy(PTS[N - 1][1]));
    ctx.strokeStyle = P.green; ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
    ctx.fillStyle = P.green; ctx.beginPath(); ctx.arc(sx(N - 1), sy(PTS[N - 1][1]), 13, 0, 7); ctx.fill();
  } else if (kind === 'vote') {
    ctx.shadowColor = 'rgba(20,40,10,.25)'; ctx.shadowBlur = 22; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    ctx.lineWidth = r * .13; ctx.strokeStyle = '#1F4FA3'; ctx.beginPath(); ctx.arc(0, 0, r * .86, 0, 7); ctx.stroke();
    ctx.lineWidth = r * .07; ctx.strokeStyle = '#D62E2E'; ctx.beginPath(); ctx.arc(0, 0, r * .68, 0, 7); ctx.stroke();
    ctx.fillStyle = '#D62E2E'; ctx.beginPath();
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * .12 : r * .28; ctx[k ? 'lineTo' : 'moveTo'](Math.cos(a) * rr, -r * .2 + Math.sin(a) * rr); } ctx.fill();
    ctx.fillStyle = '#1F4FA3'; ctx.font = `900 ${r * .34}px "Inter Display", Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('VOTED', 0, r * .3);
  } else if (kind === 'cash') {
    ctx.rotate(-.06);
    for (const [dx, dy, c] of [[14, 14, '#BFE3A8'], [0, 0, '#5DB23A']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(-r * 1.1 + dx, -r * .62 + dy, r * 2.2, r * 1.24, 18); ctx.fill(); }
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-r * .98, -r * .5, r * 1.96, r * 1.0, 12); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.beginPath(); ctx.arc(0, 0, r * .36, 0, 7); ctx.fill();
    ctx.fillStyle = '#3E9B27'; ctx.font = `900 ${r * .5}px "Inter Display", Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', 0, 3);
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
  title(PTS[Math.min(i, N - 1)][0].slice(0, 4), 1090, 330, P.white, alpha * (LIGHT ? .05 : .06));
  ctx.globalAlpha = alpha;
  // baseline = what you started with
  ctx.setLineDash([14, 14]); ctx.strokeStyle = LIGHT ? 'rgba(14,26,18,.22)' : 'rgba(255,255,255,.25)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(CX0, Y(S.amount)); ctx.lineTo(CX1, Y(S.amount)); ctx.stroke(); ctx.setLineDash([]);
  // area + line
  const path = () => { ctx.beginPath(); ctx.moveTo(X(0), Y(val(0))); for (let j = 1; j <= i; j++) ctx.lineTo(X(j), Y(val(j))); ctx.lineTo(X(fi), Y(cur)); };
  const g = ctx.createLinearGradient(0, CY0, 0, CY1); g.addColorStop(0, 'rgba(126,194,90,.45)'); g.addColorStop(1, 'rgba(126,194,90,0)');
  path(); ctx.lineTo(X(fi), CY1); ctx.lineTo(X(0), CY1); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
  path(); ctx.strokeStyle = P.green; ctx.lineWidth = 8; ctx.lineJoin = 'round'; ctx.stroke();
  // events
  // events: a marker stays on the line; the label sits in one fixed slot under the counter (never under the dot,
  // never on top of another label: a newer event replaces the older one) (owner, Oct 29: no collisions)
  const live = EV.filter(e => e.i <= fi && t - evTime(e.i) < 2.4).pop();
  EV.forEach(e => { if (e.i > fi) return; const c = e.c === 'red' ? P.red : P.green;
    ctx.globalAlpha = alpha * .9; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X(e.i), Y(val(e.i)), 12, 0, 7); ctx.fill(); });
  if (live) { const age = t - evTime(live.i), a = clamp(age * 5) * clamp((2.4 - age) * 3);
    pill(live.txt, W / 2, 640, live.c === 'red' ? P.red : P.green, a * alpha); }
  ctx.globalAlpha = alpha;
  // the dot = the object
  icon(S.buy.icon, X(fi), Y(cur), 70, t);
  // counter
  ctx.globalAlpha = alpha; title(`${money(S.amount)} in ${S.invest.label}`, 400, 52, P.dim, alpha, 700);
  title(fmt(cur), 520, 150, cur >= S.amount ? P.green : P.red, alpha);
  ctx.globalAlpha = 1;
  return cur;
}

function draw(t) {
  const [sx, sy] = shake(t, EV.filter(e => e.c === 'red').map(e => evTime(e.i)).find(x => t >= x && t < x + .6) ?? -9, .6, 22);
  ctx.save(); ctx.translate(sx, sy);
  sky(); if (!LIGHT) stars(t, .5);
  // 0. payoff hook from frame 1 (review Oct 30: our open was slow; the team's top Reels state the payoff at once)
  if (S.hook) { const ha = 1 - prog(t, T.choice, T.choice + .4);
    if (ha > 0) { ctx.save(); ctx.globalAlpha = ha; ctx.fillStyle = P.green; ctx.font = '900 66px "Inter Display", Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; S.hook.split('\n').forEach((l, k) => ctx.fillText(l, W / 2, 230 + k * 78)); ctx.restore(); } }
  // 1. the year
  const ya = clamp(prog(t, T.year, T.year + .15)) * (1 - prog(t, T.choice + .2, T.choice + .5));
  if (ya > 0) title(S.year, 520 - 30 * prog(t, T.year, T.fly), lerp(260, 220, prog(t, T.year, T.year + .25)), P.white, ya);
  // 2. you have $X
  const ca = easeOut(prog(t, T.cash, T.cash + .3)) * (1 - prog(t, T.choice, T.choice + .3));
  if (ca > 0) { icon('cash', W / 2, 900 + 40 * (1 - ca), 110, t); title(`You have ${money(S.amount)}.`, 1150, 80, P.white, ca); }
  // 3. the choice
  const ch = easeOut(prog(t, T.choice + .3, T.choice + .65)), out = prog(t, T.fly - .2, T.fly + .3);  // cards start after 'You have $X' has faded
  if (ch > 0 && out < 1) {
    const a = ch * (1 - out);
    const LX = lerp(W / 2, 290, ch), RX = lerp(W / 2, 790, ch);
    // left card: the purchase. Its object flies to the chart start.
    const fk = easeInOut(prog(t, T.fly - .4, T.c0));
    const ox = lerp(LX, CX0, fk), oy = lerp(880, CY1 - 60, fk);
    ctx.globalAlpha = a;
    for (const x of [LX, RX]) { ctx.save(); ctx.shadowColor = CARD.shadow; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18;
      ctx.fillStyle = CARD.fill; ctx.beginPath(); ctx.roundRect(x - 235, 640, 470, 660, 44); ctx.fill(); ctx.restore();
      ctx.globalAlpha = a; ctx.strokeStyle = CARD.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - 235, 640, 470, 660, 44); ctx.stroke(); }
    icon('chart', RX, 860, 150, t);
    if (S.buy.card_img) photo(S.buy.card_img, LX, 860, 320, 320, 24); else icon(S.buy.card_icon || 'cash', LX, 860, 140, t);
    ctx.globalAlpha = a; ctx.font = '900 58px "Inter Display", Inter, sans-serif'; ctx.fillStyle = P.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    S.buy.label.split('\n').forEach((l, k) => ctx.fillText(l, LX, 1080 + k * 64));
    S.invest.card.split('\n').forEach((l, k) => ctx.fillText(l, RX, 1080 + k * 64));
    ctx.fillStyle = P.dim; ctx.font = '700 38px Inter, sans-serif'; ctx.fillText(S.buy.price, LX, 1235); ctx.fillText(S.invest.sub || `${money(S.amount)} of stock`, RX, 1235);
    title('OR', 970, 60, P.green, a);
    title(S.question, 470, 84, P.white, a * prog(t, T.choice + .5, T.choice + .8));
    ctx.globalAlpha = 1;
  }
  if (t < T.c0 + .05 && t > T.fly - .4) icon(S.buy.icon, ...(() => { const fk = easeInOut(prog(t, T.fly - .4, T.c0)); return [lerp(290, CX0, fk), lerp(880, CY1 - 60, fk)]; })(), 110 - 48 * prog(t, T.fly - .4, T.c0), t);
  else if (t <= T.fly - .4 && ch > 0 && !S.buy.card_img && !S.buy.card_icon) icon(S.buy.icon, lerp(W / 2, 290, ch), 880, 110, t);
  // 4. the chart
  const cha = prog(t, T.c0 - .3, T.c0 + .2) * (1 - .75 * easeInOut(prog(t, T.rev, T.rev + 1.0))) * (1 - prog(t, T.out - .6, T.out));
  if (cha > 0) chart(t, cha);
  // 5. the reveal
  if (t >= T.rev) {
    const k = easeInOut(prog(t, T.rev + .3, T.rev + 1.1)), a = 1 - prog(t, T.out - .6, T.out);
    ctx.globalAlpha = .9 * a * easeInOut(prog(t, T.rev, T.rev + 1.0)); ctx.fillStyle = P.bg1; ctx.fillRect(-80, -80, W + 160, H + 160); ctx.globalAlpha = 1;
    if (a > 0) {
      ctx.save(); ctx.translate(W / 2, 960); ctx.scale(lerp(.7, 1, k), lerp(.7, 1, k)); ctx.translate(-W / 2, -960);
      title(S.reveal.value, 960, 200, P.green, a * k); ctx.restore();
      title(S.reveal.sub, 1110, 50, P.white, a * prog(t, T.rev + 1.5, T.rev + 2.0), 700);
      title(S.reveal.game, 1190, 44, P.dim, a * prog(t, T.rev + 2.3, T.rev + 2.8), 600);
    }
  }
  // 6. lesson + end card
  if (t >= L0 - .4) lesson(t, L0, LESSON, 780, 19);
  endcard(t, ENDT);
  corner(.7 * (1 - prog(t, L0 - .5, L0)));
  ctx.restore();
}
