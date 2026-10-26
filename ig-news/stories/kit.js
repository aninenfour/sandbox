// Hotcoin story kit: the shared look for animated story Reels (owner, Oct 26).
// Every episode draws its own scene; these helpers keep the style identical:
// palette, the stick-figure character, the typed lesson and the end card.
const W = 1080, H = 1920;
const P = {bg1: '#060A12', bg2: '#0E1A2B', green: '#7EC25A', red: '#E5322D', white: '#F2F4F5', dim: '#8C97A3', ink: '#0B0D0F'};
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeInOut = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

function sky(top = P.bg1, bottom = P.bg2) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(-80, -400, W + 160, H + 800);
}
const STARS = (() => { const r = rng(7), s = []; for (let i = 0; i < 90; i++) s.push([r() * W, r() * H * .6, r() * 2 + .6, r() * 6]); return s; })();
function stars(t, alpha = 1) {
  for (const [x, y, r, ph] of STARS) {
    ctx.globalAlpha = alpha * (.45 + .35 * Math.sin(t * 2 + ph)); ctx.fillStyle = P.white;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// The character: x,y = point between the feet. pose angles in radians (0 = straight down for limbs).
function stick(x, y, s = 1, p = {}) {
  const q = Object.assign({armL: .35, armR: -.35, legL: .18, legR: -.18, rot: 0, eyes: 'open', bob: 0}, p);
  ctx.save(); ctx.translate(x, y - q.bob); ctx.rotate(q.rot); ctx.scale(s, s);
  ctx.strokeStyle = P.white; ctx.fillStyle = P.white; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const hip = [0, -95], neck = [0, -190], head = [0, -228];
  const limb = (o, a, len) => { ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(o[0] + Math.sin(a) * len, o[1] + Math.cos(a) * len); ctx.stroke(); };
  limb(hip, q.legL, 95); limb(hip, q.legR, 95);
  ctx.beginPath(); ctx.moveTo(hip[0], hip[1]); ctx.lineTo(neck[0], neck[1]); ctx.stroke();
  limb([0, -175], q.armL, 80); limb([0, -175], q.armR, 80);
  ctx.beginPath(); ctx.arc(head[0], head[1], 34, 0, 7); ctx.fill();
  ctx.fillStyle = P.ink; ctx.strokeStyle = P.ink; ctx.lineWidth = 4;
  if (q.eyes === 'x') { for (const ex of [-11, 11]) { ctx.beginPath(); ctx.moveTo(ex - 6, -234); ctx.lineTo(ex + 6, -222); ctx.moveTo(ex + 6, -234); ctx.lineTo(ex - 6, -222); ctx.stroke(); } }
  else if (q.eyes === 'happy') { for (const ex of [-11, 11]) { ctx.beginPath(); ctx.arc(ex, -226, 6, Math.PI, 0); ctx.stroke(); } }
  else { for (const ex of [-11, 11]) { ctx.beginPath(); ctx.arc(ex, -229, 4.5, 0, 7); ctx.fill(); } }
  ctx.restore();
}

// Typed lesson: lines = [{t:'TEXT', c:color}], starts at t0, cps chars/second, pause between lines.
function lesson(t, t0, lines, y = 820, cps = 17, pause = .35) {
  ctx.font = '800 84px "Inter Display", Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let clock = t0, cursor = null;
  lines.forEach((l, i) => {
    const n = Math.floor(clamp((t - clock) * cps, 0, l.t.length)), ly = y + i * 120;
    if (t >= clock) {
      ctx.fillStyle = l.c || P.white; ctx.fillText(l.t.slice(0, n), W / 2, ly);
      if (n < l.t.length || i === lines.length - 1) cursor = [W / 2 + ctx.measureText(l.t.slice(0, n)).width / 2 + 10, ly];
    }
    clock += l.t.length / cps + pause;
  });
  if (cursor && Math.floor(t * 2.5) % 2 === 0) { ctx.fillStyle = P.green; ctx.fillRect(cursor[0], cursor[1] - 44, 10, 88); }
  return clock;  // time the last line finished
}
function lessonTimes(t0, lines, cps = 17, pause = .35) { let c = t0; const out = []; lines.forEach(l => { out.push(c); c += l.t.length / cps + pause; }); return out; }

const LOGO = new Image(); LOGO.src = window.HOTCOIN_LOGO || '';
function endcard(t, t0) {
  const k = easeOut(prog(t, t0, t0 + .6)); if (k <= 0) return;
  ctx.globalAlpha = k;
  if (LOGO.complete && LOGO.naturalWidth) ctx.drawImage(LOGO, W / 2 - 60, 1500 - 20 * (1 - k), 120, 120);
  ctx.font = '700 40px Inter, sans-serif'; ctx.fillStyle = P.white; ctx.textAlign = 'center'; ctx.fillText('@hotcoinex', W / 2, 1680);
  ctx.globalAlpha = 1;
}
function corner(alpha = .85) {  // small brand mark during the story
  if (!(LOGO.complete && LOGO.naturalWidth)) return;
  ctx.globalAlpha = alpha; ctx.drawImage(LOGO, W - 120, 70, 64, 64); ctx.globalAlpha = 1;
}
function stamp(t, t0, text, color = P.red, y = 760) {
  const k = prog(t, t0, t0 + .18); if (t < t0) return;
  const s = lerp(1.7, 1, easeOut(k));
  ctx.save(); ctx.translate(W / 2, y); ctx.rotate(-.12); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 1.5);
  ctx.font = '900 96px "Inter Display", Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + 70;
  ctx.strokeStyle = color; ctx.lineWidth = 12; ctx.strokeRect(-w / 2, -75, w, 150);
  ctx.fillStyle = color; ctx.fillText(text, 0, 4);
  ctx.restore(); ctx.globalAlpha = 1;
}
function shake(t, t0, dur = .6, amp = 26) {
  const k = prog(t, t0, t0 + dur); if (t < t0 || k >= 1) return [0, 0];
  const a = amp * (1 - k); return [Math.sin(t * 91) * a, Math.cos(t * 77) * a];
}
