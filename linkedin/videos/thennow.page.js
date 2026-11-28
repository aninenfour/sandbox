// Canvas page for thennow.mjs ("Hiring, then and now"). window.CFG is injected by the runner:
// { logo, ep, kicker, head1, head2, year, flags:[[t,text]], subs:[[a,b,text]], clipEnd, end:{...} }
const W = 1080, H = 1350, c = document.getElementById('c'), x = c.getContext('2d');
const PAPER = '#F3F0E8', INK = '#0B0E11', MUTE = 'rgba(11,14,17,.55)', RED = '#E5484D', LIME = '#B8F26A', GREEN = '#17A86B';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), ease = t => 1 - Math.pow(1 - clamp(t), 3);
const back = t => { t = clamp(t); const s = 1.7; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
let LOGO, LOGOW; const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
window.build = async () => { LOGO = await load(CFG.logo); LOGOW = await load(CFG.logoW); };
function txt(s, X, Y, font, col, a = 1, align = 'left') { if (a <= 0) return; x.save(); x.globalAlpha = a; x.font = font; x.fillStyle = col; x.textAlign = align; x.textBaseline = 'middle'; x.fillText(s, X, Y); x.restore(); }
function rr(X, Y, w, h, r) { x.beginPath(); x.roundRect(X, Y, w, h, r); }
function wrap(s, font, maxW) { x.font = font; if (x.measureText(s).width <= maxW) return [s]; const w = s.split(' '); let best = null; // balanced two-line split
  for (let i = 1; i < w.length; i++) { const A = w.slice(0, i).join(' '), B = w.slice(i).join(' '), m = Math.max(x.measureText(A).width, x.measureText(B).width); if (m <= maxW && (!best || m < best[0])) best = [m, A, B]; }
  return best ? [best[1], best[2]] : [s]; }
function cross(X, Y, s, col, p) { x.save(); x.strokeStyle = col; x.lineWidth = s * 0.2; x.lineCap = 'round'; const q = clamp(p) * 2;
  x.beginPath(); x.moveTo(X - s / 2, Y - s / 2); const a = Math.min(1, q); x.lineTo(X - s / 2 + s * a, Y - s / 2 + s * a); x.stroke();
  if (q > 1) { x.beginPath(); x.moveTo(X + s / 2, Y - s / 2); x.lineTo(X + s / 2 - s * (q - 1), Y - s / 2 + s * (q - 1)); x.stroke(); } x.restore(); }
function tick(X, Y, s, col, p) { x.save(); x.strokeStyle = col; x.lineWidth = s * 0.2; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
  const P = [[X - s * .45, Y], [X - s * .1, Y + s * .35], [X + s * .5, Y - s * .4]]; x.moveTo(...P[0]); const q = clamp(p) * 2;
  if (q < 1) x.lineTo(P[0][0] + (P[1][0] - P[0][0]) * q, P[0][1] + (P[1][1] - P[0][1]) * q); else { x.lineTo(...P[1]); x.lineTo(P[1][0] + (P[2][0] - P[1][0]) * (q - 1), P[1][1] + (P[2][1] - P[1][1]) * (q - 1)); }
  x.stroke(); x.restore(); }

const FX = 60, FY = 300, FW = 960, FH = 720;
window.draw = (t, frame) => {
  x.fillStyle = PAPER; x.fillRect(0, 0, W, H);
  const E = CFG.clipEnd;
  if (t < E + 0.5) {
    // header
    x.drawImage(LOGO, 64, 58, 38 * LOGO.width / LOGO.height, 38);
    txt(CFG.kicker, W - 64, 78, '700 20px "JetBrains Mono"', MUTE, 1, 'right');
    txt(CFG.head1, 64, 166, '800 62px "Inter Tight"', INK);
    txt(CFG.head2, 64, 240, '800 62px "Inter Tight"', RED);
    // footage with a slow push-in, film frame
    if (frame) { x.save(); rr(FX, FY, FW, FH, 22); x.clip(); const z = 1.02 + 0.03 * (t / E);
      x.filter = 'contrast(1.08) saturate(1.05)'; x.drawImage(frame, FX - (FW * z - FW) / 2, FY - (FH * z - FH) / 2, FW * z, FH * z); x.filter = 'none';
      const g = x.createLinearGradient(0, FY + FH - 200, 0, FY + FH); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); x.fillStyle = g; x.fillRect(FX, FY + FH - 200, FW, 200);
      x.restore(); }
    // year chip
    x.fillStyle = INK; rr(FX + 24, FY + 24, 118, 50, 12); x.fill(); txt(CFG.year, FX + 83, FY + 50, '800 30px "JetBrains Mono"', LIME, 1, 'center');
    // subtitles
    for (const [a, b, s] of CFG.subs) { if (t < a || t > b) continue; const al = Math.min(clamp((t - a) / 0.08), clamp((b - t) / 0.08));
      const lines = wrap(s, '800 44px "Inter Tight"', FW - 120); lines.forEach((ln, i) => { const y = FY + FH - 60 - (lines.length - 1 - i) * 56;
        x.save(); x.globalAlpha = al; x.font = '800 44px "Inter Tight"'; const w = x.measureText(ln).width; x.fillStyle = 'rgba(11,14,17,.82)'; rr(540 - w / 2 - 16, y - 28, w + 32, 56, 10); x.fill(); x.restore();
        txt(ln, 540, y + 1, '800 44px "Inter Tight"', '#FFFFFF', al, 'center'); }); }
    // scorecard
    const CY = 1052; x.fillStyle = INK; rr(60, CY, 960, 248, 22); x.fill();
    const on = CFG.flags.filter(f => t >= f[0]).length;
    txt('INTERVIEW SCORECARD', 96, CY + 40, '700 21px "JetBrains Mono"', 'rgba(243,240,232,.6)');
    const ca = clamp((t - (CFG.flags[on - 1] || [0])[0]) / 0.25), pulse = on ? 1 + 0.25 * Math.sin(Math.PI * clamp((t - CFG.flags[on - 1][0]) / 0.35)) : 1;
    x.save(); x.translate(984, CY + 40); x.scale(pulse, pulse); txt(`RED FLAGS ${on}/${CFG.flags.length}`, 0, 0, '800 24px "JetBrains Mono"', on ? RED : 'rgba(243,240,232,.6)', 1, 'right'); x.restore();
    CFG.flags.forEach(([ft, s], i) => { const y = CY + 98 + i * 58, k = clamp((t - ft) / 0.3);
      x.strokeStyle = k > 0 ? RED : 'rgba(243,240,232,.35)'; x.lineWidth = 3; rr(96, y - 19, 38, 38, 8); x.stroke();
      if (k > 0) { x.save(); x.globalAlpha = 0.18 * (1 - clamp((t - ft - 0.4) / 0.8)); x.fillStyle = RED; rr(84, y - 27, 912, 54, 12); x.fill(); x.restore(); cross(115, y, 18, RED, (t - ft) / 0.35); }
      const sh = k > 0 && k < 1 ? Math.sin(t * 80) * 4 * (1 - k) : 0;
      txt(s, 156 + sh, y + 1, '700 33px "Inter Tight"', k > 0 ? '#FFFFFF' : 'rgba(243,240,232,.38)'); });
  }
  // end card
  if (t > E) { const u = t - E, a = ease(u / 0.5); const en = CFG.end;
    x.save(); x.globalAlpha = a; x.fillStyle = PAPER; x.fillRect(0, 0, W, H); x.restore();
    if (a > 0) {
      x.globalAlpha = a; x.drawImage(LOGO, 64, 58, 38 * LOGO.width / LOGO.height, 38); txt(CFG.kicker, W - 64, 78, '700 20px "JetBrains Mono"', MUTE, 1, 'right'); x.globalAlpha = 1;
      const hl = (s, y, col, d) => { const k = ease((u - d) / 0.4); txt(s, 64, y + (1 - k) * 24, '800 64px "Inter Tight"', col, k); };
      hl(en.h1, 180, INK, 0.15); hl(en.h2, 256, GREEN, 0.3);
      txt(en.sub, 64, 340, '700 22px "JetBrains Mono"', MUTE, ease((u - 0.6) / 0.3));
      en.tips.forEach((s, i) => { const d = 0.8 + i * 0.35, k = ease((u - d) / 0.35), y = 450 + i * 104;
        x.save(); x.globalAlpha = k; x.fillStyle = '#FFFFFF'; rr(60 + (1 - k) * 30, y - 44, 960, 88, 18); x.fill(); x.restore();
        if (k > 0) tick(118, y, 34, GREEN, (u - d - 0.1) / 0.4); txt(s, 160 + (1 - k) * 30, y + 1, '700 36px "Inter Tight"', INK, k); });
      // hiring panel
      const hk = ease((u - 2.3) / 0.45), py = 820 + (1 - hk) * 40;
      x.save(); x.globalAlpha = hk; x.fillStyle = INK; rr(60, py, 960, 432, 26); x.fill(); x.restore();
      if (hk > 0) {
        txt('WE\'RE HIRING', 104, py + 62, '700 24px "JetBrains Mono"', LIME, hk);
        en.roles.forEach((s, i) => txt(s, 104, py + 128 + i * 58, '700 38px "Inter Tight"', '#FFFFFF', ease((u - 2.6 - i * 0.15) / 0.3)));
        txt(en.cta1, 104, py + 330, '800 44px "Inter Tight"', LIME, ease((u - 3.4) / 0.35));
        txt(en.cta2, 104, py + 390, '600 30px "Inter Tight"', 'rgba(243,240,232,.75)', ease((u - 3.6) / 0.35));
        x.globalAlpha = ease((u - 3.6) / 0.35); x.drawImage(LOGOW, 1020 - 44 - 34 * LOGOW.width / LOGOW.height, py + 45, 34 * LOGOW.width / LOGOW.height, 34); x.globalAlpha = 1;
      }
    }
  }
  // progress
  x.fillStyle = 'rgba(11,14,17,.1)'; x.fillRect(0, H - 6, W, 6); x.fillStyle = GREEN; x.fillRect(0, H - 6, W * clamp(t / CFG.dur), 6);
};
