// Episode 1 "The Tower": leverage. Night skyline, crates that get taller and thinner, a feather, a collapse.
const G = 1640;                                   // ground line
const BLOCKS = [                                  // label, width, time it slides in, side
  {l: '1x', w: 380, t: -1, side: 0}, {l: '5x', w: 300, t: 1.3, side: -1}, {l: '20x', w: 230, t: 2.6, side: 1},
  {l: '50x', w: 165, t: 3.9, side: -1}, {l: '100x', w: 112, t: 5.2, side: 1}];
const BH = 175, TC = 9.7;                         // block height, collapse time
const SKY = (() => { const r = rng(3), b = []; let x = -20; while (x < W + 40) { const w = 50 + r() * 90, h = 90 + r() * 260; b.push([x, w, h, r()]); x += w + 6; } return b; })();
const LINE = (() => { const r = rng(11), p = []; let y = 1050; for (let i = 0; i <= 40; i++) { y -= 6 + r() * 14 - 4; p.push([60 + i * 24, y]); } return p; })();
const LESSON = [{t: 'AT 100x LEVERAGE,'}, {t: 'A 1% DIP', c: P.red}, {t: 'WIPES YOU OUT.'}, {t: 'TRADE SMALL.', c: P.green}];
const L0 = 12.9, LT = lessonTimes(L0, LESSON);
window.DURATION = 18.6;
window.CUES = (() => {                             // sound cues read by story.py
  const c = [];
  BLOCKS.slice(1).forEach((b, i) => c.push({t: b.t + .02, s: 'thunk', pitch: 1 + i * .16}));
  BLOCKS.slice(1).forEach(b => c.push({t: b.t - .3, s: 'hop'}));
  c.push({t: 6.6, s: 'cheer'}, {t: 8.3, s: 'whoosh'}, {t: 9.35, s: 'creak'}, {t: TC, s: 'cut'}, {t: TC + .05, s: 'crash'});
  [10.25, 10.4, 10.55, 10.7, 10.85, 11.0].forEach(t => c.push({t, s: 'thud'}));
  c.push({t: 10.35, s: 'stamp'});
  let k = L0; LESSON.forEach(l => { for (let i = 0; i < l.t.length; i++) if (l.t[i] !== ' ') c.push({t: k + i / 17, s: 'key'}); k += l.t.length / 17 + .35; });
  c.push({t: 12.2, s: 'pad'}, {t: 17.0, s: 'chime'});
  return c;
})();

function stackCount(t) { return BLOCKS.filter(b => b.t <= t).length; }
function stackTop(n) { return G - n * BH; }
function crate(x, yBottom, w, label, glow) {   // x center
  const y = yBottom - BH;
  ctx.fillStyle = '#16202D'; ctx.strokeStyle = glow ? P.green : '#3B4B5E'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y, w, BH - 4, 14); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#2A3747'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - w / 2 + 12, y + 14); ctx.lineTo(x + w / 2 - 12, y + BH - 18); ctx.stroke();
  ctx.fillStyle = glow ? P.green : P.white; ctx.font = `800 ${w < 130 ? 42 : 54}px "Inter Display", Inter, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, x, y + BH / 2);
}
function backdrop(t) {
  sky('#05080F', '#0F1D30'); stars(t);
  ctx.fillStyle = '#E9E4D0'; ctx.globalAlpha = .9; ctx.beginPath(); ctx.arc(860, 300, 54, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
  // price line in the sky: grows while the tower grows, ticks down when the feather lands
  const grow = clamp(t / 8.2), n = Math.max(2, Math.floor(grow * (LINE.length - 1)) + 1), dip = easeOut(prog(t, 9.2, 9.55));
  const red = t > 9.2;
  ctx.strokeStyle = red ? P.red : P.green; ctx.globalAlpha = .55; ctx.lineWidth = 7; ctx.beginPath();
  LINE.slice(0, n).forEach(([x, y], i) => { const yy = (i === n - 1 && red) ? y + 90 * dip : y; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); });
  ctx.stroke(); ctx.globalAlpha = 1;
  if (red && t < TC + 1.6) { const [x, y] = LINE[n - 1]; ctx.fillStyle = P.red; ctx.font = '800 54px Inter, sans-serif'; ctx.textAlign = 'left'; ctx.fillText('−1%', Math.min(x + 18, W - 160), y + 90 * dip); }
  for (const [x, w, h, r] of SKY) {   // skyline
    ctx.fillStyle = '#0A121E'; ctx.fillRect(x, G - h, w, h);
    ctx.fillStyle = '#E8C55A';
    for (let yy = G - h + 18; yy < G - 20; yy += 34) for (let xx = x + 10; xx < x + w - 12; xx += 22) if (((xx * 7 + yy * 3) | 0) % 5 === 0) { ctx.globalAlpha = .35 + .2 * r; ctx.fillRect(xx, yy, 8, 12); }
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = '#121B27'; ctx.fillRect(-80, G, W + 160, H - G + 500);
  ctx.fillStyle = '#1C2836'; ctx.fillRect(-80, G, W + 160, 8);
}

// collapse physics (deterministic): each block and the figure get a start pose + velocity at TC
function fallen(i, t, x0, y0, w) {
  if (i === 0) return [x0, y0, 0];             // the base crate stays put
  const dt = Math.max(0, t - TC - (4 - i) * .07), dir = i % 2 ? 1 : -1, g = 3200;
  let x = x0 + dir * (120 + i * 70) * dt, y = y0 + .5 * g * dt * dt, a = dir * (1.2 + i * .5) * dt;
  const floor = G - 6;                          // block bottom can't pass the ground
  if (y > floor) { const over = y - floor; y = floor; a = dir * (Math.PI / 2) * clamp(over / 200) + (i % 3) * .1; x = x0 + dir * (120 + i * 70) * Math.sqrt(2 * (floor - y0) / g); }
  return [x, y, a];
}

function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const [sx, sy] = shake(t, TC + .45, .7, 30); ctx.translate(sx, sy);
  if (t < 12.6) {
    const ck = easeInOut(prog(t, .4, 6.6)), cs = lerp(1.65, 1, ck), py = lerp(G - 230, H / 2, ck);
    ctx.translate(W / 2, H / 2); ctx.scale(cs, cs); ctx.translate(-W / 2, -py);
    backdrop(t);
    const n = stackCount(t), sway = [0, 0, 0, .006, .014, .028][n] * Math.sin(t * 3.4);
    if (t < TC) {
      ctx.save(); ctx.translate(W / 2, G); ctx.rotate(sway); ctx.translate(-W / 2, -G);
      BLOCKS.forEach((b, i) => {
        if (b.t > t) return;
        let x = W / 2; const k = prog(t, b.t - .35, b.t);
        if (b.t > 0) x = lerp(W / 2 + b.side * 820, W / 2, easeOut(k));
        crate(x, G - i * BH, b.w, b.l, b.l === '100x');
      });
      // the figure hops onto each new crate
      const last = BLOCKS.filter(b => b.t > 0 && b.t - .45 <= t).pop();
      let fy = stackTop(Math.max(1, n)), pose = {};
      if (last && t < last.t + .25) { const k = prog(t, last.t - .45, last.t + .25); fy = lerp(stackTop(BLOCKS.indexOf(last)), stackTop(BLOCKS.indexOf(last) + 1), easeInOut(k)) - Math.sin(k * Math.PI) * 170; pose = {armL: 2.4, armR: -2.4, legL: .5, legR: -.5}; }
      if (t > 6.5 && t < 9.3) pose = {armL: 2.7, armR: -2.7, eyes: 'happy', bob: Math.abs(Math.sin(t * 7)) * 10};
      if (t >= 9.3) pose = {armL: 1.2, armR: -1.9, legL: .3, legR: -.1, rot: -.08, eyes: 'open'};
      stick(W / 2, fy, 1.0, pose);
      ctx.restore();
    } else {
      BLOCKS.forEach((b, i) => {
        const [x, y, a] = fallen(i, t, W / 2, G - i * BH, b.w);
        ctx.save(); ctx.translate(x, y - BH / 2); ctx.rotate(a); crate(0, BH / 2, b.w, b.l, b.l === '100x'); ctx.restore();
      });
      // the figure: falls from the top, lands lying down
      const dt = t - TC, fy0 = stackTop(5), land = Math.sqrt(2 * (G - fy0) / 3200);
      const fx = W / 2 + 260 * Math.min(dt, land), fy = Math.min(G, fy0 + 1600 * dt * dt), rot = Math.min(1.57, dt * 3.4);
      stick(fx, fy, 1.0, {armL: 2.2 + Math.sin(t * 20) * .6, armR: -2.2 - Math.sin(t * 22) * .6, legL: .7, legR: -.7, rot, eyes: dt > land ? 'x' : 'open'});
      stamp(t, TC + .65, 'LIQUIDATED');
    }
    // the feather
    if (t > 8.2 && t < TC + .3) {
      const k = prog(t, 8.2, 9.5), fx = lerp(-40, W / 2 + 40, easeOut(k)), fy = lerp(560, stackTop(5) + 40, k) + Math.sin(t * 6) * 26;
      ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.sin(t * 4) * .5); ctx.fillStyle = '#DDE3E8';
      ctx.beginPath(); ctx.ellipse(0, 0, 34, 11, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#9AA5B1'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(34, 0); ctx.stroke(); ctx.restore();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0); corner();
    if (t > 12.0) { ctx.fillStyle = '#05080F'; ctx.globalAlpha = prog(t, 12.0, 12.6); ctx.fillRect(-50, -50, W + 100, H + 100); ctx.globalAlpha = 1; }
  } else {
    ctx.fillStyle = '#05080F'; ctx.fillRect(-50, -50, W + 100, H + 100);
    lesson(t, L0, LESSON, 760);
    endcard(t, 17.0);
  }
}
