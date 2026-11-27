// Canvas page for onepct-v3.mjs. window.IMG is injected by the runner. Scenes are timed in seconds.
const W = 1080, H = 1350, c = document.getElementById('c'), x = c.getContext('2d');
const BG = '#0E5A31', BG2 = '#09401F', DEEP = '#073019', INK = '#0B0E11', LIME = '#B8F26A', CREAM = '#EEF3EA',
  RED = '#F6465D', MID = '#8FC29A', MUTED = 'rgba(238,243,234,.62)';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = t => { t = clamp(t); return 1 - Math.pow(1 - t, 3); };
const back = t => { t = clamp(t); const s = 1.7; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
const fmt = n => Math.round(n).toLocaleString('en-US');
const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// ---------- assets ----------
let MAN, WALK, LOGO, GRAIN;
function duo(img, h) { // readable duotone: deep green shadows to cream highlights, alpha kept, light grain
  const w = Math.round(h * img.width / img.height), o = document.createElement('canvas'); o.width = w; o.height = h;
  const ox = o.getContext('2d'); ox.drawImage(img, 0, 0, w, h); const im = ox.getImageData(0, 0, w, h), d = im.data;
  const A = [7, 46, 25], B = [236, 244, 224];
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue; let l = (0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) / 255;
    l = clamp((l - 0.06) / 0.86); l = Math.pow(l, 0.85) + (rnd() - 0.5) * 0.07; l = clamp(l);
    for (let k = 0; k < 3; k++) d[i + k] = A[k] + (B[k] - A[k]) * l;
  }
  ox.putImageData(im, 0, 0); return o;
}
async function build() {
  MAN = duo(await load(IMG.man), 1000); WALK = duo(await load(IMG.walk), 600); LOGO = await load(IMG.logo);
  GRAIN = document.createElement('canvas'); GRAIN.width = 540; GRAIN.height = 675; const g = GRAIN.getContext('2d'), gd = g.createImageData(540, 675);
  for (let i = 0; i < gd.data.length; i += 4) { const v = rnd() * 255; gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = v; gd.data[i + 3] = 255; }
  g.putImageData(gd, 0, 0);
}
window.build = build;

// ---------- helpers ----------
function txt(s, X, Y, font, col, a = 1, align = 'left') { if (a <= 0) return; x.save(); x.globalAlpha = a; x.font = font; x.fillStyle = col; x.textAlign = align; x.textBaseline = 'middle'; x.fillText(s, X, Y); x.restore(); }
function rr(X, Y, w, h, r) { x.beginPath(); x.roundRect(X, Y, w, h, r); }
// headline: lines of [text, color] segments; slides up line by line, fades out at a1
function head(lines, t, a0, a1, size = 64, y0 = 170, X = 64) {
  lines.forEach((ln, i) => {
    const ai = clamp((t - a0 - i * 0.08) / 0.32), ao = clamp((a1 - t) / 0.22), a = Math.min(ai, ao); if (a <= 0) return;
    const dy = (1 - ease(ai)) * 34; let cx = X; x.save(); x.globalAlpha = a; x.font = `800 ${ln.size || size}px "Inter Tight"`; x.textBaseline = 'middle';
    const yy = y0 + (ln.dy !== undefined ? ln.dy : i * size * 1.16) + dy;
    for (const [s, col] of ln.s) { x.fillStyle = col; x.fillText(s, cx, yy); cx += x.measureText(s).width; }
    x.restore();
  });
}
const L = (...segs) => ({ s: segs });
function check(X, Y, s, col, p) { x.save(); x.strokeStyle = col; x.lineWidth = s * 0.16; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
  const pts = [[X - s * .45, Y], [X - s * .12, Y + s * .32], [X + s * .5, Y - s * .38]]; x.moveTo(...pts[0]);
  const q = clamp(p) * 2; if (q < 1) x.lineTo(pts[0][0] + (pts[1][0] - pts[0][0]) * q, pts[0][1] + (pts[1][1] - pts[0][1]) * q);
  else { x.lineTo(...pts[1]); x.lineTo(pts[1][0] + (pts[2][0] - pts[1][0]) * (q - 1), pts[1][1] + (pts[2][1] - pts[1][1]) * (q - 1)); }
  x.stroke(); x.restore(); }

// ---------- bottom panel: the trade plan fills as the rule unfolds ----------
const PY = 1092, PH = 176;
function panelBox(a, dy) { x.save(); x.globalAlpha = a; x.translate(0, dy); x.fillStyle = 'rgba(7,48,25,.78)'; rr(64, PY, W - 128, PH, 26); x.fill();
  x.strokeStyle = 'rgba(184,242,106,.22)'; x.lineWidth = 2; x.stroke(); x.restore(); }
function ticket(t) {
  const a = Math.min(clamp((t - 5.25) / 0.35), clamp((21.35 - t) / 0.25)); if (a <= 0) return; const dy = (1 - ease(a)) * 60;
  panelBox(a, dy);
  const cells = [['ACCOUNT', '10,000', 'USDT', 7.0], ['RISK 1%', '100', 'USDT', 8.4], ['STOP', '5%', 'below entry', 12.4], ['SIZE', '2,000', 'USDT', 19.0]];
  const cw = (W - 128) / 4;
  cells.forEach(([lab, val, unit, tf], i) => {
    const cx = 64 + cw * i + 34, f = clamp((t - tf) / 0.3), fl = clamp(1 - (t - tf) / 0.7);
    x.save(); x.globalAlpha = a; x.translate(0, dy);
    if (i) { x.fillStyle = 'rgba(238,243,234,.12)'; x.fillRect(64 + cw * i, PY + 30, 2, PH - 60); }
    if (f > 0 && fl > 0) { x.fillStyle = `rgba(184,242,106,${0.22 * fl})`; rr(64 + cw * i + 8, PY + 8, cw - 16, PH - 16, 20); x.fill(); }
    txt(lab, cx, PY + 46, '700 21px "JetBrains Mono"', i === 1 ? LIME : MUTED);
    if (f <= 0) txt('?', cx, PY + 104, '800 50px "Inter Tight"', 'rgba(238,243,234,.22)');
    else { x.save(); x.translate(cx, PY + 104); const s = back(f); x.scale(s, s); txt(val, 0, 0, '800 50px "Inter Tight"', i === 3 ? LIME : CREAM); x.restore(); }
    txt(unit, cx, PY + 146, '500 19px "JetBrains Mono"', MUTED, f);
    x.restore();
  });
}
function strip(t, t0, t1, draw) { const a = Math.min(clamp((t - t0) / 0.35), clamp((t1 - t) / 0.25)); if (a <= 0) return; const dy = (1 - ease(a)) * 60; panelBox(a, dy); x.save(); x.globalAlpha = a; x.translate(0, dy); draw(); x.restore(); }

// ---------- scenes ----------
const CUTS = [5, 10.5, 16, 21.5, 30, 35.5], END = 40.5;

function sceneHook(t) { // 0 to 5: the blow-up
  const z = 1 + t * 0.012, mw = MAN.width * z, mh = MAN.height * z; x.drawImage(MAN, 470 - (mw - MAN.width) / 2, 400 - (mh - MAN.height) * 0.3, mw, mh);
  head([L(['Most traders don\'t blow up', CREAM]), L(['on being wrong.', CREAM])], t, -1, 5.2);
  // liquidation card
  const ca = back(clamp((t - 0.35) / 0.45)); if (ca > 0) {
    const shake = t > 2.2 && t < 2.6 ? Math.sin(t * 90) * 9 * (2.6 - t) / 0.4 : 0;
    x.save(); x.translate(64 + 195 + shake, 470 + 220); x.scale(ca, ca); x.translate(-195, -220);
    x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 40; x.shadowOffsetY = 14; x.fillStyle = INK; rr(0, 0, 390, 440, 28); x.fill(); x.shadowColor = 'transparent';
    txt('BTC-USDT PERP', 30, 44, '700 20px "JetBrains Mono"', MUTED); txt('50x LONG', 360, 44, '700 20px "JetBrains Mono"', LIME, 1, 'right');
    // mini price line: drifts up, then a sharp drop
    const pts = []; for (let i = 0; i <= 40; i++) { const k = i / 40; let v = 0.55 + 0.25 * k + 0.05 * Math.sin(i * 1.7); if (k > 0.78) v -= (k - 0.78) / 0.22 * 0.95; pts.push([30 + k * 330, 230 - v * 120]); }
    const pr = clamp((t - 0.5) / 1.6), nP = Math.max(2, Math.floor(pr * pts.length));
    x.lineWidth = 5; x.lineJoin = 'round'; x.lineCap = 'round';
    x.strokeStyle = MID; x.beginPath(); pts.slice(0, Math.min(nP, 33)).forEach((p, i) => i ? x.lineTo(...p) : x.moveTo(...p)); x.stroke();
    if (nP > 32) { x.strokeStyle = RED; x.beginPath(); pts.slice(31, nP).forEach((p, i) => i ? x.lineTo(...p) : x.moveTo(...p)); x.stroke(); }
    // liquidation line
    x.setLineDash([8, 8]); x.strokeStyle = 'rgba(246,70,93,.55)'; x.lineWidth = 2; x.beginPath(); x.moveTo(30, 228); x.lineTo(360, 228); x.stroke(); x.setLineDash([]);
    txt('BALANCE', 30, 296, '700 20px "JetBrains Mono"', MUTED);
    const bal = 10000 * (1 - ease(clamp((t - 1.65) / 0.55)));
    txt(fmt(bal) + ' USDT', 30, 344, '800 46px "Inter Tight"', bal < 1 ? RED : CREAM);
    if (t > 2.2) { const la = clamp((t - 2.2) / 0.2); x.save(); x.globalAlpha = la; x.fillStyle = 'rgba(246,70,93,.16)'; rr(30, 378, 330, 44, 10); x.fill(); x.restore(); txt('LIQUIDATED', 195, 401, '800 28px "Inter Tight"', RED, la, 'center'); }
    x.restore();
  }
  // punch line, bottom left
  head([L(['They blow up', CREAM]), { s: [['on size.', LIME]], size: 118, dy: 98 }], t, 2.35, 5.2, 62, 990);
}

function sceneGrid(t) { const u = t - 5; // 5 to 10.5: 1% of the account
  head([L(['The 1% rule: ', LIME], ['risk at most', CREAM]), L(['1% of your account', CREAM]), L(['on any one trade.', CREAM])], t, 5.05, 10.7);
  const S = 50, G = 8, X0 = 254, Y0 = 470;
  txt('YOUR ACCOUNT = 100 SQUARES', X0, Y0 - 34, '700 21px "JetBrains Mono"', MUTED, clamp((u - 0.3) / 0.3));
  for (let r = 0; r < 10; r++) for (let cI = 0; cI < 10; cI++) {
    const k = clamp((u - 0.15 - (r + cI) * 0.035) / 0.3); if (k <= 0) continue; const one = r === 0 && cI === 9;
    const pick = one ? clamp((u - 2.4) / 0.35) : 0, dim = one ? 0 : clamp((u - 3.6) / 0.4);
    let s = S * back(k), X = X0 + cI * (S + G) + (S - s) / 2, Y = Y0 + r * (S + G) + (S - s) / 2;
    if (one && pick > 0) { const g = 1 + 0.35 * back(pick); X -= (s * g - s) / 2 + 10 * pick; Y -= (s * g - s) / 2 + 10 * pick; s *= g; }
    x.fillStyle = one && pick > 0 ? LIME : `rgba(143,194,154,${0.9 - 0.45 * dim})`; rr(X, Y, s, s, 6); x.fill();
  }
  const la = clamp((u - 2.7) / 0.35);
  txt('1% =', 846, 488, '800 34px "Inter Tight"', LIME, la); txt('100 USDT', 846, 528, '800 34px "Inter Tight"', LIME, la);
  txt('the most', 846, 584, '600 26px "Inter Tight"', CREAM, la); txt('you can lose', 846, 616, '600 26px "Inter Tight"', CREAM, la); txt('on one trade', 846, 648, '600 26px "Inter Tight"', CREAM, la);
  const da = clamp((u - 3.7) / 0.35); txt('99 stay', 846, 950, '800 30px "Inter Tight"', MID, da); txt('safe', 846, 986, '800 30px "Inter Tight"', MID, da);
}

const PRE = [96.2, 96.8, 96.4, 97.3, 97.9, 97.5, 98.4, 98.9, 98.6, 99.4, 99.8, 100.0], POST = [100.6, 100.2, 99.4, 99.8, 98.9, 98.1, 98.6, 97.6, 96.9, 97.3, 96.2, 95.6];
const CAND = (() => { const cl = [...PRE, ...POST], out = []; let op = 95.8; cl.forEach((v, i) => { const hi = Math.max(op, v) + 0.25 + (i * 37 % 5) * 0.07, lo = Math.min(op, v) - 0.25 - (i * 53 % 4) * 0.07; out.push({ o: op, c: v, h: hi, l: i === cl.length - 1 ? 95.0 : lo }); op = v; }); return out; })();
function sceneStop(t) { const u = t - 10.5; // 10.5 to 16: stop before entry
  head([L(['Set the stop before you enter.', CREAM]), L(['Here: ', CREAM], ['5% below entry.', LIME])], t, 10.55, 16.2);
  const X0 = 200, X1 = 900, Y0 = 470, Y1 = 1010, pmin = 93.6, pmax = 101.6, py = p => Y1 - (p - pmin) / (pmax - pmin) * (Y1 - Y0);
  const n = CAND.length, cw = (X1 - X0) / n, shown = clamp((u - 0.2) / 3.4) * n;
  // grid
  x.strokeStyle = 'rgba(238,243,234,.08)'; x.lineWidth = 2; for (const p of [94, 96, 98, 100]) { x.beginPath(); x.moveTo(64, py(p)); x.lineTo(1016, py(p)); x.stroke(); }
  for (let i = 0; i < n; i++) { const k = clamp(shown - i); if (k <= 0) break; const d = CAND[i], up = d.c >= d.o, col = up ? '#2DBD85' : RED, cx = X0 + i * cw + cw / 2;
    x.globalAlpha = k; x.strokeStyle = col; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, py(d.h)); x.lineTo(cx, py(d.l)); x.stroke();
    const yT = py(Math.max(d.o, d.c)), yB = py(Math.min(d.o, d.c)); x.fillStyle = col; x.fillRect(cx - cw * 0.32, yT, cw * 0.64, Math.max(4, (yB - yT) * ease(k))); x.globalAlpha = 1; }
  const ea = clamp((shown - 12) / 0.6);
  if (ea > 0) { x.save(); x.globalAlpha = ea; x.setLineDash([12, 10]); x.lineWidth = 3;
    x.strokeStyle = LIME; x.beginPath(); x.moveTo(X0, py(100)); x.lineTo(X0 + (X1 - X0) * ease(ea), py(100)); x.stroke();
    x.strokeStyle = RED; x.beginPath(); x.moveTo(X0, py(95)); x.lineTo(X0 + (X1 - X0) * ease(ea), py(95)); x.stroke(); x.setLineDash([]); x.restore();
    const tag = (s, y, bg, fg) => { x.save(); x.globalAlpha = ea; x.fillStyle = bg; rr(906, y - 24, 150, 48, 10); x.fill(); x.restore(); txt(s, 981, y, '800 22px "JetBrains Mono"', fg, ea, 'center'); };
    tag('ENTRY', py(100), LIME, INK); tag('STOP', py(95), RED, CREAM);
    // 5% bracket
    const ba = clamp((u - 1.9) / 0.4); x.save(); x.globalAlpha = ba; x.strokeStyle = CREAM; x.lineWidth = 3; x.beginPath(); x.moveTo(176, py(100) + 6); x.lineTo(176, py(95) - 6); x.stroke(); x.restore();
    txt('5%', 160, (py(100) + py(95)) / 2, '800 54px "Inter Tight"', CREAM, ba, 'right');
  }
  if (u > 3.65) { const k = clamp((u - 3.65) / 0.4), cx = X0 + (n - 0.5) * cw; x.save(); x.globalAlpha = 1 - k * 0.6; x.strokeStyle = RED; x.lineWidth = 4; x.beginPath(); x.arc(cx, py(95), 14 + 40 * k, 0, 7); x.stroke(); x.restore();
    txt('Price hits the stop: you are out, loss capped.', 540, 1050, '700 30px "Inter Tight"', CREAM, clamp((u - 3.8) / 0.3), 'center'); }
}

function sceneSize(t) { const u = t - 16; // 16 to 21.5: size from risk and stop
  head([L(['Now size the position', CREAM]), L(['so the stop costs ', CREAM], ['exactly 1%.', LIME])], t, 16.05, 21.7);
  const tok = (s, X, Y, size, col, t0, lab) => { const k = back(clamp((u - t0) / 0.4)); if (k <= 0) return; x.save(); x.translate(X, Y + (1 - k) * 80); x.globalAlpha = clamp((u - t0) / 0.2);
    txt(s, 0, 0, `900 ${size}px "Inter Tight"`, col, 1, 'center'); if (lab) txt(lab, 0, size * 0.62, '700 21px "JetBrains Mono"', MUTED, 1, 'center'); x.restore(); };
  tok('100', 300, 540, 150, CREAM, 0.3, 'RISK (USDT)'); tok('÷', 540, 540, 120, MID, 0.6); tok('5%', 770, 540, 150, CREAM, 0.85, 'STOP');
  // bar under, then result
  const ba = ease(clamp((u - 1.3) / 0.4)); x.fillStyle = 'rgba(238,243,234,.35)'; x.fillRect(540 - 380 * ba, 668, 760 * ba, 3);
  tok('2,000', 540, 790, 190, LIME, 1.6, 'POSITION SIZE (USDT)');
  // check card
  const cA = clamp((u - 3.0) / 0.35); if (cA > 0) { x.save(); x.globalAlpha = cA; x.fillStyle = INK; rr(150, 930 + (1 - ease(cA)) * 20, 780, 110, 22); x.fill(); x.restore();
    check(212, 985, 46, LIME, (u - 3.1) / 0.5); txt('Stop hit: 2,000 × 5% = 100 USDT lost.', 262, 970, '700 29px "Inter Tight"', CREAM, cA); txt('That is your 1%. Nothing more.', 262, 1008, '600 26px "Inter Tight"', MID, cA); }
}

const V1 = [...Array(11)].map((_, k) => 10000 * Math.pow(0.99, k)), V10 = [...Array(11)].map((_, k) => 10000 * Math.pow(0.9, k));
function sceneLoss(t) { const u = t - 21.5; // 21.5 to 30: ten losses in a row
  head([L(['Now lose 10 trades in a row.', CREAM])], t, 21.55, 25.6);
  head([L(['Same trades.', CREAM]), L(['Different size.', LIME])], t, 25.7, 30.2);
  const X0 = 190, X1 = 900, Y0 = 470, Y1 = 990, vmin = 2000, vmax = 10500, px = k => X0 + k / 10 * (X1 - X0), py = v => Y1 - (v - vmin) / (vmax - vmin) * (Y1 - Y0);
  const ga = clamp((u - 0.1) / 0.4);
  x.save(); x.globalAlpha = ga; x.lineWidth = 2;
  for (const v of [2000, 4000, 6000, 8000, 10000]) { x.strokeStyle = v === 2000 ? 'rgba(238,243,234,.35)' : 'rgba(238,243,234,.09)'; x.beginPath(); x.moveTo(X0, py(v)); x.lineTo(X1, py(v)); x.stroke();
    txt(v / 1000 + 'k', X0 - 22, py(v), '500 22px "JetBrains Mono"', MUTED, 1, 'right'); }
  for (let k = 0; k <= 10; k += 1) txt(String(k), px(k), Y1 + 30, '500 20px "JetBrains Mono"', MUTED, 1, 'center');
  txt('LOSSES IN A ROW', (X0 + X1) / 2, Y1 + 66, '700 20px "JetBrains Mono"', MUTED, 1, 'center'); x.restore();
  const p = clamp((u - 0.6) / 4.6) * 10;
  const line = (V, col, w) => { x.strokeStyle = col; x.lineWidth = w; x.lineJoin = 'round'; x.lineCap = 'round'; x.beginPath(); x.moveTo(px(0), py(V[0]));
    const kk = Math.floor(p); for (let k = 1; k <= kk; k++) x.lineTo(px(k), py(V[k])); let hx = px(kk), hy = py(V[kk]);
    if (kk < 10) { const f = p - kk; hx = px(kk + f); hy = py(V[kk] + (V[kk + 1] - V[kk]) * f); x.lineTo(hx, hy); } x.stroke();
    for (let k = 1; k <= kk; k++) { x.fillStyle = col; x.beginPath(); x.arc(px(k), py(V[k]), 6, 0, 7); x.fill(); }
    x.save(); x.shadowColor = col; x.shadowBlur = 24; x.fillStyle = col; x.beginPath(); x.arc(hx, hy, 10, 0, 7); x.fill(); x.restore();
    const kk2 = Math.min(10, p), val = V[Math.floor(kk2)] + (kk2 < 10 ? (V[Math.floor(kk2) + 1] - V[Math.floor(kk2)]) * (kk2 - Math.floor(kk2)) : 0); return [hx, hy, val]; };
  if (ga > 0.5) {
    const [ax, ay, av] = line(V1, LIME, 7), [bx, by, bv] = line(V10, RED, 7);
    const va = clamp((p - 0.8) / 0.5);
    txt(fmt(av), ax + 18, ay - 40, '800 46px "Inter Tight"', LIME, va, ax > 760 ? 'right' : 'left');
    txt(fmt(bv), bx + 18, by + 44, '800 46px "Inter Tight"', RED, va, bx > 760 ? 'right' : 'left');
  }
  // legend + counter
  const la = clamp((u - 0.3) / 0.3); x.save(); x.globalAlpha = la; x.fillStyle = LIME; rr(X0, 405, 26, 10, 5); x.fill(); x.fillStyle = RED; rr(X0 + 240, 405, 26, 10, 5); x.fill(); x.restore();
  txt('1% risk', X0 + 38, 410, '700 24px "JetBrains Mono"', LIME, la); txt('10% risk', X0 + 278, 410, '700 24px "JetBrains Mono"', RED, la);
  txt('LOSS ' + Math.min(10, Math.floor(p)) + '/10', X1, 410, '700 24px "JetBrains Mono"', CREAM, la, 'right');
  const pk = Math.min(10, Math.floor(p)), dn = v => v < 1 ? '0' : '−' + (v / 100).toFixed(1);
  strip(t, 21.75, 30.15, () => { txt(pk < 10 ? 'ACCOUNT DOWN AFTER ' + pk + ' LOSSES' : 'ACCOUNT DOWN AFTER 10 LOSSES', 540, PY + 42, '700 21px "JetBrains Mono"', MUTED, 1, 'center');
    txt('1% risk: ' + dn(10000 - V1[pk]) + '%', 300, PY + 108, '800 46px "Inter Tight"', LIME, 1, 'center'); txt('10% risk: ' + dn(10000 - V10[pk]) + '%', 780, PY + 108, '800 46px "Inter Tight"', RED, 1, 'center');
    x.fillStyle = 'rgba(238,243,234,.12)'; x.fillRect(539, PY + 76, 2, 64); });
}

function sceneBack(t) { const u = t - 30; // 30 to 35.5: the way back
  head([L(['To get back to 10,000,', CREAM]), L(['you now need:', CREAM])], t, 30.05, 35.7);
  const B = 1000, sc = 470 / 187, bar = (cx, v, col, t0, lab) => { const k = ease(clamp((u - t0) / 1.2)), h = Math.max(10, v * sc * k);
    x.fillStyle = col; rr(cx - 130, B - h, 260, h, 14); x.fill();
    txt('+' + (v * k).toFixed(v < 50 ? 1 : 0) + '%', cx, B - h - 56, '900 84px "Inter Tight"', col, clamp((u - t0) / 0.25), 'center');
    txt(lab, cx, B + 40, '700 22px "JetBrains Mono"', MUTED, clamp((u - t0) / 0.3), 'center'); };
  x.fillStyle = 'rgba(238,243,234,.35)'; x.fillRect(120, B, 840 * ease(clamp(u / 0.4)), 3);
  bar(330, 10.57, LIME, 0.3, 'AFTER 1% LOSSES'); bar(750, 186.8, RED, 0.5, 'AFTER 10% LOSSES');
  strip(t, 30.6, 35.65, () => { txt('Small losses are easy to win back.', 540, PY + 64, '800 40px "Inter Tight"', CREAM, 1, 'center');
    txt('Big ones may never come back.', 540, PY + 116, '800 40px "Inter Tight"', LIME, 1, 'center'); });
}

function sceneEnd(t) { const u = t - 35.5; // 35.5 to 40.5: outro
  head([{ s: [['Size first.', CREAM]], size: 92 }, { s: [['Everything else second.', LIME]], size: 76, dy: 104 }], t, 35.55, 99, 92, 190);
  // stairs: the walker steps up one stair at a time, feet on the treads
  const sw = 190, sh = 60, top = i => H - 6 - (i + 1) * sh;
  for (let i = 0; i < 5; i++) { const k = ease(clamp((u - 0.1 - i * 0.08) / 0.4)); const h = (i + 1) * sh * k; x.fillStyle = i % 2 ? '#A6E05C' : LIME; x.fillRect(80 + i * sw, H - 6 - h, sw + 1, h); }
  const hop = clamp((u - 1.7) / 0.55) + clamp((u - 3.3) / 0.55), k0 = 1 + Math.floor(hop), f = ease(hop - Math.floor(hop));
  const fx = i => 80 + (i + 1) * sw - 62, bx = fx(k0) + (fx(k0 + 1) - fx(k0)) * f, by = top(k0) + (top(k0 + 1) - top(k0)) * f - Math.sin(Math.PI * f) * 22;
  const wfx = 40 / 315 * WALK.width;
  x.globalAlpha = clamp((u - 0.25) / 0.3); x.drawImage(WALK, bx - wfx, by - WALK.height + 5); x.globalAlpha = 1;
  const la = clamp((u - 0.8) / 0.4); if (la > 0) { const lh = 56, lw = lh * LOGO.width / LOGO.height; x.globalAlpha = la; x.drawImage(LOGO, 64, 400, lw, lh); x.globalAlpha = 1; }
  txt('Follow Hotcoin for', 64, 506, '700 36px "Inter Tight"', CREAM, la); txt('a new 101 every week.', 64, 552, '700 36px "Inter Tight"', CREAM, la);
}

// ---------- frame ----------
function wipe(t) { // block wipe in brand squares at each cut, full cover exactly on the cut
  for (const B of CUTS) { if (t < B - 0.3 || t > B + 0.3) continue; const S = 90, cols = 12, rows = 15;
    for (let r = 0; r < rows; r++) for (let cI = 0; cI < cols; cI++) { const d = (cI + r) / (cols + rows - 2) * 0.2, loc = (t - (B - 0.3) - d) / 0.4;
      const cov = clamp(1.6 * Math.sin(Math.PI * clamp(loc))); if (cov <= 0) continue; const h = ((r * 31 + cI * 17 + B * 7) % 23) / 23;
      x.fillStyle = h < 0.12 ? LIME : h < 0.4 ? '#0A4A28' : DEEP; const s = (S + 1) * cov; x.fillRect(cI * S + (S - s) / 2, r * S + (S - s) / 2, s, s); } }
}
window.draw = (t) => {
  const g = x.createRadialGradient(540, 420, 80, 540, 700, 1000); g.addColorStop(0, BG); g.addColorStop(1, BG2); x.fillStyle = g; x.fillRect(0, 0, W, H);
  if (t < 5) sceneHook(t); else if (t < 10.5) sceneGrid(t); else if (t < 16) sceneStop(t); else if (t < 21.5) sceneSize(t);
  else if (t < 30) sceneLoss(t); else if (t < 35.5) sceneBack(t); else sceneEnd(t);
  ticket(t);
  wipe(t);
  x.save(); x.globalAlpha = 0.055; x.globalCompositeOperation = 'overlay'; const ox = (Math.floor(t * 24) * 97) % 300, oy = (Math.floor(t * 24) * 61) % 300;
  x.drawImage(GRAIN, -ox, -oy, 1620, 2025); x.restore();
  if (t < 35.5) { const lh = 38; x.drawImage(LOGO, 64, 60, lh * LOGO.width / LOGO.height, lh); txt('HOTCOIN 101 · THE 1% RULE', W - 64, 80, '700 20px "JetBrains Mono"', MUTED, 1, 'right'); }
  // progress bar: shows how far into the 40 s you are
  x.fillStyle = 'rgba(238,243,234,.14)'; x.fillRect(0, H - 6, W, 6); x.fillStyle = LIME; x.fillRect(0, H - 6, W * clamp(t / END), 6);
};
