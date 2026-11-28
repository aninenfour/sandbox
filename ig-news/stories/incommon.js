// IN COMMON (owner, Nov 28): "What do X and Y have in common?" parallel-story paper collage, 1080x1920, 30 fps.
// Rendered by ig-news/incommon.py (DOM + CSS, driven by draw(t, variant)); window.SPEC is prepared there:
// scenes with t0/t1 (s) and their spoken words [{w, t, e}] (t relative to the scene), images as data URIs, chart data.
// Scene types: hook (two cut-outs + the question, frame 0 = cover), beat (cut-out / print + caption + date sticker,
// rubber stamp, giant number, typed document, hand + pen), twist (huge words), chart (real closes, dip then rise
// with % chips), end (Hotcoin symbol + CTA + Download pill; variant "nocta": symbol + @hotcoinex only).
// Safe zones: key content inside y 220..1480 and x <= 920 below y = 700.
const S = window.SPEC, W = 1080, H = 1920;
const C = {green: '#7EC25A', green2: '#5FA83C', ink: '#0E1110', cream: '#EEE5D2', paper: '#FBF7EC', red: '#E5322D', white: '#FFFFFF'};
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eo = k => 1 - Math.pow(1 - k, 3), eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const back = k => { const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const norm = w => String(w).toLowerCase().replace(/[^a-z0-9]/g, '');
const I = S.img;
window.CUES = [];
window.DURATION = S.dur; window.DURATION_NOCTA = S.dur_nc; window.END_T = S.end_t;

const css = `
@font-face{font-family:'Archivo';src:url(${S.fonts.arch}) format('truetype');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:'Manrope';src:url(${S.fonts.man}) format('truetype');font-weight:200 800}
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${W}px;height:${H}px;overflow:hidden;background:${C.ink}}
body{font-family:'Manrope',sans-serif;color:${C.ink}}
.sc{position:absolute;inset:0;overflow:hidden;display:none;will-change:transform}
.bgp{position:absolute;inset:-40px;background-size:cover;background-position:center}
.a{position:absolute;transform-origin:50% 50%}
.cap{position:absolute;left:60px;width:860px;top:252px;text-align:center;font-family:'Archivo';font-weight:800;font-stretch:104%;
  font-size:60px;line-height:1.12;letter-spacing:-.012em;text-wrap:balance}
.cap span{display:inline-block;margin:0 .13em;white-space:nowrap}
.cap .hl{padding:0 .14em;border-radius:6px}
.cut{position:absolute;transform-origin:50% 100%}
.cut img{display:block;height:100%;width:auto}
.out img{filter:drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 26px 30px rgba(20,16,10,.38))}
.dk img{filter:drop-shadow(0 30px 50px rgba(0,0,0,.6))}
.print{position:absolute;background:${C.paper};padding:16px 16px 16px;box-shadow:0 22px 40px rgba(25,18,8,.38),0 2px 0 rgba(0,0,0,.08)}
.print .ph{width:100%;height:100%;background-size:cover;background-position:center}
.tape{position:absolute;width:150px;height:46px;background:rgba(236,228,205,.78);box-shadow:0 1px 2px rgba(0,0,0,.12);mix-blend-mode:normal}
.tag{position:absolute;font-family:'Archivo';font-weight:900;font-stretch:112%;font-size:66px;line-height:1;letter-spacing:.01em;
  padding:14px 26px 12px;border-radius:12px;color:#fff;box-shadow:0 8px 0 rgba(0,0,0,.16),0 18px 30px rgba(0,0,0,.22);white-space:nowrap}
.stamp{position:absolute;font-family:'Archivo';font-weight:900;font-stretch:118%;font-size:86px;line-height:1;letter-spacing:.04em;
  padding:16px 30px 12px;border:9px solid;border-radius:16px;white-space:nowrap;background:rgba(251,247,236,.0);
  -webkit-mask-image:url(${I.speckle || ''});-webkit-mask-size:520px 520px}
.big{position:absolute;font-family:'Archivo';font-weight:900;font-stretch:125%;line-height:.82;letter-spacing:-.05em;text-align:center;white-space:nowrap}
.big .lb{display:block;font-size:.24em;letter-spacing:.02em;line-height:1;margin-top:.12em}
.doc{position:absolute;background:${C.paper};padding:44px 46px 40px;box-shadow:0 26px 46px rgba(25,18,8,.36);font-family:'Courier 10 Pitch','Liberation Mono',monospace;color:#1d1b17}
.doc .t{font-weight:700;font-size:34px;letter-spacing:.06em;border-bottom:3px solid #1d1b17;padding-bottom:16px;margin-bottom:18px;text-transform:uppercase}
.doc .r{display:flex;justify-content:space-between;font-size:38px;line-height:1.5}
.doc .r b{font-weight:700}
.lab{position:absolute;font-family:'Courier 10 Pitch','Liberation Mono',monospace;font-weight:700;font-size:30px;letter-spacing:.08em;
  background:${C.ink};color:#fff;padding:10px 18px 8px;text-transform:uppercase;white-space:nowrap}
.grainall{position:absolute;inset:-120px;background-size:540px 540px;mix-blend-mode:overlay;opacity:.22;pointer-events:none}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
const root = document.body;
const mk = (cls, parent, html = '') => { const e = document.createElement('div'); e.className = cls; e.innerHTML = html; parent.appendChild(e); return e; };
const place = (e, o) => { for (const k in o) e.style[k] = typeof o[k] === 'number' ? o[k] + 'px' : o[k]; };
const at = (sc, w, dflt = 0) => {
  if (w === undefined || w === null) return dflt;
  if (typeof w === 'number') return w;
  const hit = sc.words.find(x => norm(x.w) === norm(w));
  return hit ? hit.t - .04 : dflt;
};
const cue = (t, s, v = .35, pitch = 1) => window.CUES.push({t, s, v, pitch});

// ---------------------------------------------------------------- captions
function caption(sc, el, theme, opts = {}) {
  const cap = mk('cap', el);
  const txt = (sc.cap || sc.say || '').split(/\s+/).filter(Boolean);
  const col = theme === 'ink' ? '#F4F1E8' : C.ink;
  cap.style.color = col;
  if (opts.top) cap.style.top = opts.top + 'px';
  if (opts.size) cap.style.fontSize = opts.size + 'px';
  const spans = txt.map((w, i) => {
    const acc = /^\{.*\}[.,?!]*$/.test(w);
    const s = document.createElement('span');
    s.textContent = w.replace(/[{}]/g, '');
    if (acc) { s.className = 'hl'; s.style.background = theme === 'green' ? C.ink : C.green; s.style.color = theme === 'green' ? C.green : C.ink; }
    cap.appendChild(s);
    return {s, t: sc.words[i] ? sc.words[i].t : i * .3};
  });
  // capmode "sentence": only the sentence being spoken is on screen (long chart lines)
  const sent = []; let n = 0; txt.forEach((w, i) => { sent.push(n); if (/[.?!]$/.test(w.replace(/[{}]/g, ''))) n++; });
  return lt => spans.forEach(({s, t}, i) => {
    if (sc.capmode === 'sentence') {
      const curS = sent[Math.max(0, spans.reduce((m, x, j) => (lt >= x.t - .06 ? j : m), 0))];
      s.style.display = sent[i] === curS ? 'inline-block' : 'none';
    }
    const k = opts.static ? 1 : eo(prog(lt, t - .06, t + .1));
    s.style.opacity = opts.static ? 1 : k;
    s.style.transform = `translateY(${(1 - k) * 22}px)`;
    if (opts.pulse) { const p = prog(lt, t - .02, t + .26); s.style.transform = `scale(${1 + .07 * Math.sin(Math.PI * p)})`; }
  });
}

// ---------------------------------------------------------------- elements
function cutEl(o, el, theme) {
  const e = mk('cut ' + (theme === 'ink' ? 'dk' : 'out'), el, `<img src="${I[o.img]}">`);
  const h = o.h || 1150, x = o.x ?? 470, y = o.y ?? 1560;
  place(e, {height: h, left: 0, top: y - h});
  const img = e.firstChild;
  let w = 0;
  const upd = (lt, t0 = 0) => {
    if (!w) { w = img.naturalWidth * h / img.naturalHeight; e.style.left = (x - w / 2) + 'px'; e.style.width = w + 'px'; }
    const k = eo(prog(lt, t0, t0 + .32));
    const dx = (o.from === 'left' ? -1 : o.from === 'right' ? 1 : 0) * (1 - k) * 240;
    const dy = (o.from ? 0 : (1 - k) * 160);
    e.style.opacity = prog(lt, t0, t0 + .12);
    e.style.transform = `translate(${dx}px,${dy}px) scale(${(o.flip ? -1 : 1) * (1 + lt * .012)},${1 + lt * .012})`;
  };
  return upd;
}
function printEl(o, el) {
  const w = o.w || 720, h = o.h || 540, x = o.x ?? 470, y = o.y ?? 960, rot = o.rot ?? -3;
  const e = mk('print', el, `<div class="ph" style="background-image:url(${I[o.img]})"></div>`);
  place(e, {left: x - w / 2, top: y - h / 2, width: w, height: h});
  if (o.tape !== false) {
    const t1 = mk('tape', e); place(t1, {left: -40, top: -18, transform: 'rotate(-32deg)'});
    const t2 = mk('tape', e); place(t2, {right: -40, top: -18, transform: 'rotate(30deg)'});
  }
  return (lt, t0 = 0) => {
    const k = eo(prog(lt, t0, t0 + .3));
    e.style.opacity = prog(lt, t0, t0 + .1);
    e.style.transform = `translateY(${(1 - k) * 90}px) rotate(${rot + (1 - k) * 6}deg) scale(${1.12 - .12 * k + lt * .01})`;
  };
}
function tagEl(o, el, sc, cueT) {
  const e = mk('tag', el, esc(o.text));
  const bg = o.color === 'green' ? C.green : o.color === 'ink' ? C.ink : C.red;
  e.style.background = bg; e.style.color = o.color === 'green' ? C.ink : '#fff';
  if (o.size) e.style.fontSize = o.size + 'px';
  place(e, {left: o.x ?? 120, top: o.y ?? 560});
  const t = at(sc, o.at, .15), rot = o.rot ?? -6;
  cue(cueT + t, 'hop', .22, 1.1);
  return lt => {
    const k = prog(lt, t, t + .26);
    e.style.opacity = k > 0 ? 1 : 0;
    e.style.transform = `rotate(${rot}deg) scale(${k > 0 ? back(k) : 0})`;
  };
}
function stampEl(o, el, sc, cueT) {
  const e = mk('stamp', el, esc(o.text));
  const col = o.color === 'green' ? C.green2 : o.color === 'ink' ? C.ink : C.red;
  e.style.color = col; e.style.borderColor = col;
  if (o.size) e.style.fontSize = o.size + 'px';
  place(e, {left: o.x ?? 300, top: o.y ?? 1180});
  const t = at(sc, o.at, .4), rot = o.rot ?? -9;
  cue(cueT + t + .1, 'stamp', .45);
  return lt => {
    const k = prog(lt, t, t + .13);
    e.style.opacity = k > 0 ? .92 : 0;
    e.style.transform = `rotate(${rot}deg) scale(${1.9 - .9 * eo(k)})`;
  };
}
function bigEl(o, el, sc, theme, cueT) {
  const e = mk('big', el);
  const size = o.size || 560;
  e.style.fontSize = size + 'px';
  e.style.color = o.color || (theme === 'ink' ? C.green : C.ink);
  const x = o.x ?? 470, y = o.y ?? 640;
  place(e, {left: x - 500, width: 1000, top: y});
  const land = at(sc, o.at, .6) + .1, t = Math.min(o.start ?? .15, land - .45), val = +o.value;
  cue(cueT + land, 'thud', .5);
  return lt => {
    const k = prog(lt, t, land);
    const n = Math.round(val * eo(k));
    e.innerHTML = `<span class="n">${k > 0 ? n : '&nbsp;'}</span><span class="lb">${k > .97 ? esc(o.label || '') : '&nbsp;'}</span>`;
    const pop = prog(lt, land, land + .25);
    e.style.transform = `scale(${k > 0 ? .9 + .1 * eo(k) + .06 * Math.sin(Math.PI * pop) : 1})`;
  };
}
function docEl(o, el, sc) {
  const e = mk('doc', el, `<div class="t">${esc(o.title || '')}</div>` + (o.rows || []).map((r, i) => `<div class="r" data-i="${i}"><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join(''));
  const w = o.w || 700, x = o.x ?? 470, y = o.y ?? 640, rot = o.rot ?? -2;
  place(e, {left: x - w / 2, top: y, width: w});
  const t = at(sc, o.at, 0);
  return lt => {
    const k = eo(prog(lt, t, t + .3));
    e.style.opacity = prog(lt, t, t + .08);
    e.style.transform = `translateY(${(1 - k) * 120}px) rotate(${rot + (1 - k) * -5}deg)`;
  };
}
function labelEl(o, el, sc) {
  const e = mk('lab', el, esc(o.text));
  place(e, {left: o.x ?? 120, top: o.y ?? 1360});
  const t = at(sc, o.at, .3), rot = o.rot ?? 2;
  return lt => { const k = eo(prog(lt, t, t + .2)); e.style.opacity = k; e.style.transform = `rotate(${rot}deg) translateX(${(1 - k) * -40}px)`; };
}
// hand + pen: circles or underlines a target box; the pen tip follows the stroke head
function penEl(o, el, sc, box) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', W); svg.setAttribute('height', H); svg.style.position = 'absolute'; svg.style.left = 0; svg.style.top = 0;
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const [bx, by, bw, bh] = box;
  let d;
  if (o.shape === 'underline') {
    d = `M ${bx - 10} ${by + bh + 18} C ${bx + bw * .3} ${by + bh + 4}, ${bx + bw * .7} ${by + bh + 30}, ${bx + bw + 20} ${by + bh + 10}`;
  } else {
    const cx = bx + bw / 2, cy = by + bh / 2, rx = bw / 2 + 34, ry = bh / 2 + 26;
    const pts = [];
    for (let i = 0; i <= 64; i++) { const a = -2.2 + i / 64 * 2 * Math.PI * 1.08; const wob = 1 + .04 * Math.sin(i * .9); pts.push([cx + Math.cos(a) * rx * wob, cy + Math.sin(a) * ry * wob]); }
    d = 'M ' + pts.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L ');
  }
  p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', o.color || C.red); p.setAttribute('stroke-width', o.width || 9);
  p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round'); p.style.mixBlendMode = 'multiply';
  svg.appendChild(p); el.appendChild(svg);
  const len = p.getTotalLength();
  p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
  let hand = null;
  if (I.hand) { hand = mk('a', el, `<img src="${I.hand}" style="width:${S.hand_w || 620}px;display:block">`); }
  const t = at(sc, o.at, .5), dur = o.dur || .7;
  const tip = S.hand_tip || [0.08, 0.06];
  return lt => {
    const k = eio(prog(lt, t, t + dur));
    p.style.strokeDashoffset = len * (1 - k);
    if (!hand) return;
    const img = hand.firstChild; const hw = S.hand_w || 620, hh = img.naturalHeight * hw / (img.naturalWidth || 1);
    const pt = p.getPointAtLength(len * k);
    const inK = eo(prog(lt, t - .35, t)), outK = eio(prog(lt, t + dur + .1, t + dur + .5));
    const ox = (1 - inK) * 380 + outK * 520, oy = (1 - inK) * 520 + outK * 640;
    hand.style.opacity = lt > t - .35 && outK < 1 ? 1 : 0;
    hand.style.left = (pt.x - tip[0] * hw + ox) + 'px'; hand.style.top = (pt.y - tip[1] * hh + oy) + 'px';
  };
}

// ---------------------------------------------------------------- scenes
const SCN = [];
function panel(el, theme) {
  const b = mk('bgp', el); b.style.backgroundImage = `url(${I[theme] || I.cream})`;
  return b;
}
function buildHook(sc) {
  const el = mk('sc', root); panel(el, 'ink');
  const glow = mk('a', el); place(glow, {left: -100, top: 650, width: 1280, height: 1000, background: `radial-gradient(50% 50% at 50% 50%,rgba(126,194,90,.32),rgba(126,194,90,0) 70%)`});
  const [A, B] = S.people;
  const ups = [];
  // a torn-paper card behind each person: green (left), cream (right)
  const cards = [[20, 700, 500, 720, -4, 'green'], [520, 650, 470, 740, 3.5, 'cream']].map(([l, t, w, h, r, tex]) => {
    const c = mk('a', el); place(c, {left: l, top: t, width: w, height: h, backgroundImage: `url(${I[tex]})`, backgroundSize: '1080px 1920px',
      boxShadow: '0 30px 60px rgba(0,0,0,.45)', transform: `rotate(${r}deg)`}); return c; });
  const tags = [];
  const mkP = (p, x, from, i) => {
    x = p.x ?? x;
    const e = mk('cut dk', el, `<img src="${I[p.img]}">`); const h = p.h || 860;
    place(e, {height: h, top: 1640 - h});
    const img = e.firstChild;
    const tg = document.createElement('div'); tg.className = 'tag'; tg.textContent = p.name; tags.push(tg);
    tg.style.fontSize = '40px'; tg.style.padding = '12px 20px 10px';
    tg.style.background = i ? C.green : C.ink; tg.style.color = i ? C.ink : '#fff';
    ups.push(lt => {
      const w = img.naturalWidth * h / img.naturalHeight; e.style.left = (x - w / 2) + 'px';
      const k = prog(lt, at(sc, i ? 'churchill' : 'jobs', 1), at(sc, i ? 'churchill' : 'jobs', 1) + .3);
      e.style.transform = `scale(${1 + .018 * Math.sin(Math.PI * k) + lt * .008})`;
      const tw = tg.offsetWidth; tg.style.left = (i ? 920 - tw : 50) + 'px'; tg.style.top = (i ? 1420 : 1340) + 'px';
      tg.style.transform = `rotate(${i ? 3 : -3}deg)`;
    });
  };
  mkP(B, 715, 'right', 1); mkP(A, 285, 'left', 0);
  tags.forEach(t => el.appendChild(t));
  const q = mk('cap', el); q.style.top = '250px'; q.style.fontSize = '86px'; q.style.lineHeight = '1.04'; q.style.color = '#F4F1E8'; q.style.fontWeight = 900;
  const names = S.people.map(p => p.name.toLowerCase().split(/\s+/)).flat();
  const words = S.question.split(/\s+/);
  const spans = words.map((w, i) => {
    const s = document.createElement('span'); s.textContent = w;
    if (names.includes(norm(w))) s.style.color = C.green;
    q.appendChild(s); return {s, t: sc.words[i] ? sc.words[i].t : 0};
  });
  return {el, sc, upd: lt => { ups.forEach(u => u(lt)); spans.forEach(({s, t}) => { const p = prog(lt, t - .02, t + .3); s.style.transform = `translateY(${-10 * Math.sin(Math.PI * p)}px)`; }); }};
}
function buildBeat(sc, idx) {
  const theme = sc.bg || 'cream';
  const el = mk('sc', root); panel(el, theme);
  if (theme === 'ink') { const g = mk('a', el); place(g, {left: -200, top: 400, width: 1480, height: 1300, background: 'radial-gradient(45% 45% at 50% 50%,rgba(126,194,90,.22),rgba(126,194,90,0) 70%)'}); }
  const T0 = sc.t0, ups = [];
  const add = (o, sub) => {
    const t0 = sub ? at(sc, o.at, 0) : 0;
    if (o.print) { const f = printEl(o.print, el); ups.push(lt => f(lt, t0)); }
    if (o.cut) { const f = cutEl(o.cut, el, theme); ups.push(lt => f(lt, t0 + (o.cut.delay || 0))); }
    if (o.doc) ups.push(docEl(Object.assign({at: sub ? o.at : undefined}, o.doc), el, sc));
    if (o.big) ups.push(bigEl(o.big, el, sc, theme, T0));
    if (o.label) ups.push(labelEl(Object.assign({at: o.label.at ?? (sub ? o.at : undefined)}, o.label), el, sc));
    if (o.tag) ups.push(tagEl(o.tag, el, sc, T0));
    if (o.stamp) ups.push(stampEl(o.stamp, el, sc, T0));
  };
  add(sc, false);
  if (sc.second) add(sc.second, true);
  if (sc.pen) {
    // the stroke box is measured when the pen starts (the target has landed by then)
    const tp = at(sc, sc.pen.at, .5);
    let f = null;
    ups.push(lt => {
      if (!f) {
        if (lt < tp - .45) return;
        let box = sc.pen.box;
        if (!box) {
          const tgt = sc.pen.target === 'big' ? el.querySelector('.big .lb') : (el.querySelector(`.doc .r[data-i="${(sc.doc || {}).mark ?? 0}"] b`) || el.querySelector('.doc'));
          const rg = document.createRange(); rg.selectNodeContents(tgt); const r = rg.getBoundingClientRect();
          box = [r.left, r.top, r.width, r.height];
        }
        f = penEl(sc.pen, el, sc, box);
      }
      f(lt);
    });
  }
  const cap = caption(sc, el, theme, sc.capopts || {});
  cue(T0, 'whoosh', .12, 1.4);
  return {el, sc, upd: lt => { ups.forEach(u => u && u(lt)); cap(lt); }};
}
function buildTwist(sc) {
  const el = mk('sc', root); const bg = panel(el, 'ink');
  const flash = mk('a', el); place(flash, {left: 0, top: 0, width: W, height: H, background: C.green});
  const [A, B] = S.people;
  const pa = mk('cut dk', el, `<img src="${I[A.img]}">`), pb = mk('cut dk', el, `<img src="${I[B.img]}">`);
  [pa, pb].forEach(p => place(p, {height: 900, top: 1920 - 900}));
  const cap = caption(Object.assign({}, sc, {say: sc.lead || ''}), el, 'ink', {top: 300});
  const ws = (sc.big_words || ['CALLED', 'BACK']).map((w, i) => {
    const e = mk('big', el, esc(w)); e.style.fontSize = (sc.size || 236) + 'px'; e.style.left = '0px'; e.style.width = '980px'; e.style.top = (560 + i * 220) + 'px';
    e.style.letterSpacing = '-.045em'; e.style.color = i ? C.green : '#F4F1E8';
    return {e, t: at(sc, (sc.at || ['called', 'back'])[i], .5 + i * .3)};
  });
  let fitted = false;
  const fit = () => { if (fitted) return; fitted = true; ws.forEach(({e}) => {
    e.style.width = 'auto'; e.style.display = 'inline-block'; let fs = sc.size || 236;
    while (e.scrollWidth > 900 && fs > 90) { fs -= 4; e.style.fontSize = fs + 'px'; }
    e.style.left = (470 - e.scrollWidth / 2) + 'px'; }); };
  ws.forEach(w => cue(sc.t0 + w.t + .05, 'thud', .6));
  return {el, sc, upd: lt => {
    fit();
    const tb = ws[ws.length - 1].t;
    const fk = prog(lt, tb, tb + .35);
    flash.style.opacity = fk > 0 && fk < 1 ? (1 - fk) * .85 : 0;
    ws.forEach(({e, t}) => { const k = prog(lt, t, t + .16); e.style.opacity = k > 0 ? 1 : 0; e.style.transform = `scale(${k > 0 ? 1.6 - .6 * eo(k) : 1})`; });
    const gk = prog(lt, tb, tb + .4);
    [[pa, 220, -1], [pb, 800, 1]].forEach(([p, x, s]) => {
      const img = p.firstChild, w = img.naturalWidth * 900 / img.naturalHeight;
      p.style.left = (x - w / 2) + 'px';
      p.firstChild.style.filter = `grayscale(${1 - gk}) drop-shadow(0 30px 50px rgba(0,0,0,.6))`;
      p.style.opacity = .95; p.style.transform = `translateX(${s * (1 - eo(prog(lt, 0, .5))) * 120}px) scale(${1 + lt * .01})`;
    });
    cap(lt);
  }};
}
function buildChart(sc) {
  const ch = S.chart, theme = sc.bg || 'ink';
  const el = mk('sc', root); panel(el, theme);
  const cardW = 900, cardH = 860, cx = 470, cy = 1010;
  const card = mk('print', el); place(card, {left: cx - cardW / 2, top: cy - cardH / 2, width: cardW, height: cardH, padding: '0px', background: C.paper});
  const tp1 = mk('tape', card); place(tp1, {left: -38, top: -16, transform: 'rotate(-30deg)'});
  const head = mk('a', card, `${ch.logo ? `<img src="${ch.logo}" style="width:64px;height:64px;border-radius:14px;margin-right:18px;vertical-align:middle">` : ''}<span style="vertical-align:middle">${esc(ch.label)}</span>`);
  place(head, {left: 44, top: 40, fontFamily: 'Archivo', fontWeight: 800, fontStretch: '108%', fontSize: '44px', color: C.ink});
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('width', cardW); svg.setAttribute('height', cardH);
  svg.style.position = 'absolute'; svg.style.left = 0; svg.style.top = 0; card.appendChild(svg);
  const px0 = 60, px1 = cardW - 70, py0 = 190, py1 = cardH - 100;
  const ser = ch.series, d0 = Date.parse(ser[0][0]), d1 = Date.parse(ser[ser.length - 1][0]);
  const f = v => ch.log ? Math.log(v) : v;
  const vs = ser.map(r => f(r[1])), vmin = Math.min(...vs), vmax = Math.max(...vs);
  const X = d => px0 + (Date.parse(d) - d0) / (d1 - d0) * (px1 - px0), Y = v => py1 - (f(v) - vmin) / (vmax - vmin) * (py1 - py0);
  for (let g = 0; g < 5; g++) { const l = document.createElementNS(svgNS, 'line'); const y = py0 + g * (py1 - py0) / 4; l.setAttribute('x1', px0); l.setAttribute('x2', px1); l.setAttribute('y1', y); l.setAttribute('y2', y); l.setAttribute('stroke', 'rgba(20,18,14,.10)'); l.setAttribute('stroke-width', 2); svg.appendChild(l); }
  const lowI = ser.findIndex(r => r[0] === ch.low[0]);
  const mkLine = (pts, col, w) => { const p = document.createElementNS(svgNS, 'path'); p.setAttribute('d', 'M ' + pts.map(r => X(r[0]).toFixed(1) + ' ' + Y(r[1]).toFixed(1)).join(' L ')); p.setAttribute('fill', 'none'); p.setAttribute('stroke', col); p.setAttribute('stroke-width', w); p.setAttribute('stroke-linejoin', 'round'); p.setAttribute('stroke-linecap', 'round'); svg.appendChild(p); const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; return [p, L]; };
  const [l1, L1] = mkLine(ser.slice(0, lowI + 1), '#C9302B', 7), [l2, L2] = mkLine(ser.slice(lowI), C.green2, 8);
  const dot = document.createElementNS(svgNS, 'circle'); dot.setAttribute('r', 13); dot.setAttribute('fill', C.ink); svg.appendChild(dot);
  const yl = (d, txt) => { const e = mk('a', card, esc(txt)); place(e, {left: X(d) - 60, width: 120, textAlign: 'center', top: py1 + 26, fontFamily: "'Courier 10 Pitch',monospace", fontWeight: 700, fontSize: '28px', color: '#3a362e'}); return e; };
  const y0 = ser[0][0].slice(0, 4), yL = ch.low[0].slice(0, 4), y1 = ser[ser.length - 1][0].slice(0, 4);
  yl(ser[0][0], y0); yl(ch.low[0], yL); yl(ser[ser.length - 1][0], y1);
  const src = mk('a', el, esc(ch.source)); place(src, {left: 60, width: 860, top: cy + cardH / 2 + 26, fontSize: '22px', lineHeight: '1.35', color: 'rgba(244,241,232,.62)', fontFamily: 'Manrope', fontWeight: 600, textAlign: 'center'});
  const chipD = mk('tag', el, `▼ ${esc(ch.dip)}`); chipD.style.background = C.red; chipD.style.fontSize = '60px';
  const chipR = mk('tag', el, `▲ ${esc(ch.rise)}`); chipR.style.background = C.green; chipR.style.color = C.ink; chipR.style.fontSize = '72px';
  const cardL = cx - cardW / 2, cardT = cy - cardH / 2;
  place(chipD, {left: cardL + X(ch.low[0]) + 34, top: cardT + Y(ch.low[1]) - 70});
  place(chipR, {left: cardL + X(ch.last[0]) - 420, top: cardT + Y(ch.last[1]) + 60});
  const tD = at(sc, sc.dip_at, .8), tR = at(sc, sc.rise_at, 2.6), tC = at(sc, sc.chip_at, tR + 1.2);
  cue(sc.t0 + tD + .05, 'hop', .25, .8); cue(sc.t0 + tC + .05, 'chime', .3);
  const cap = caption(sc, el, theme, {top: 252, size: 56});
  return {el, sc, upd: lt => {
    const ck = eo(prog(lt, 0, .3)); card.style.transform = `translateY(${(1 - ck) * 120}px) rotate(${-1.2 + (1 - ck) * 4}deg)`; card.style.opacity = prog(lt, 0, .1);
    const k1 = eio(prog(lt, .2, Math.min(tD + .1, 1.1))), k2 = eio(prog(lt, tR - .1, tR + 1.6));
    l1.style.strokeDashoffset = L1 * (1 - k1); l2.style.strokeDashoffset = L2 * (1 - k2);
    const pt = k2 > 0 ? l2.getPointAtLength(L2 * k2) : l1.getPointAtLength(L1 * k1);
    dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
    const a = prog(lt, tD, tD + .25), b = prog(lt, tC, tC + .25);
    chipD.style.opacity = a > 0 ? 1 : 0; chipD.style.transform = `rotate(-4deg) scale(${a > 0 ? back(a) : 0})`;
    chipR.style.opacity = b > 0 ? 1 : 0; chipR.style.transform = `rotate(3deg) scale(${b > 0 ? back(b) : 0})`;
    cap(lt);
  }};
}
function buildEnd(sc) {
  const el = mk('sc', root); panel(el, 'green');
  const badge = mk('a', el, `<img src="${I.symbol}" style="width:150px;height:150px;display:block">`);
  place(badge, {left: 470 - 130, top: 600, width: 260, height: 260, borderRadius: '60px', background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 60px rgba(0,0,0,.25)'});
  const line = mk('cap', el, esc(S.cta)); line.style.top = '930px'; line.style.fontSize = '84px'; line.style.lineHeight = '1.04'; line.style.fontWeight = 900;
  const pill = mk('a', el, 'Download Hotcoin'); place(pill, {left: 470 - 250, top: 1180, width: 500, height: 112, borderRadius: '60px', background: C.ink, color: '#fff', fontFamily: 'Archivo', fontWeight: 800, fontSize: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center'});
  const handle = mk('a', el, '@hotcoinex'); place(handle, {left: 0, width: 940, textAlign: 'center', top: 1340, fontFamily: 'Archivo', fontWeight: 700, fontSize: '40px', color: C.ink, opacity: .8});
  cue(sc.t0, 'whoosh', .15); cue(sc.t0 + .25, 'thud', .4);
  return {el, sc, upd: (lt, variant) => {
    const nc = variant === 'nocta';
    const k = back(prog(lt, .05, .45)); badge.style.transform = `scale(${k}) rotate(${(1 - prog(lt, .05, .45)) * -12}deg)`;
    line.style.display = pill.style.display = nc ? 'none' : 'block'; pill.style.display = nc ? 'none' : 'flex';
    const k2 = eo(prog(lt, .25, .6)); line.style.opacity = k2; line.style.transform = `translateY(${(1 - k2) * 40}px)`;
    const k3 = prog(lt, .5, .8); pill.style.transform = `scale(${k3 > 0 ? back(k3) : 0})`;
    handle.style.top = nc ? '940px' : '1340px'; handle.style.fontSize = nc ? '56px' : '40px';
    handle.style.opacity = .85 * eo(prog(lt, nc ? .3 : .7, nc ? .6 : 1));
  }};
}

S.scenes.forEach((sc, i) => {
  const b = {hook: buildHook, beat: buildBeat, twist: buildTwist, chart: buildChart, end: buildEnd}[sc.type];
  SCN.push(b(sc, i));
});
const grain = mk('grainall', root); grain.style.backgroundImage = `url(${I.grain})`;

// ---------------------------------------------------------------- draw
let cur = -1;
window.draw = (t, variant = 'cta') => {
  let i = SCN.findIndex(s => t >= s.sc.t0 && t < s.sc.t1);
  if (i < 0) i = SCN.length - 1;
  const s = SCN[i], lt = t - s.sc.t0;
  // quick paper slide-in over the previous scene (first 0.2 s), alternating direction
  const k = i > 0 ? eo(prog(lt, 0, .2)) : 1;
  SCN.forEach((o, j) => { o.el.style.display = (j === i || (j === i - 1 && k < 1)) ? 'block' : 'none'; o.el.style.zIndex = j === i ? 2 : 1; });
  if (k < 1) { SCN[i - 1].upd(t - SCN[i - 1].sc.t0, variant); }
  const dir = [[0, 1], [1, 0], [0, 1], [-1, 0]][i % 4];
  const push = s.sc.type === 'end' ? 1 : 1 + .022 * lt;
  s.el.style.transformOrigin = '50% 45%';
  s.el.style.transform = (k < 1 ? `translate(${dir[0] * (1 - k) * W}px,${dir[1] * (1 - k) * H * .6}px) rotate(${(1 - k) * 3 * (i % 2 ? 1 : -1)}deg) ` : '') + `scale(${push})`;
  s.upd(lt, variant);
  grain.style.transform = `translate(${(Math.floor(t * 12) * 37) % 120 - 60}px,${(Math.floor(t * 12) * 53) % 120 - 60}px)`;
};
draw(0);
