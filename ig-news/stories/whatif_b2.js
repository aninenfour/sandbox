// WHAT IF "B2 Photo depth" (owner pick, Nov 28): dark premium motion template, 1080x1920, 30 fps.
// Rendered by ig-news/whatif_b2.py (or story.py with "look": "b2"); DOM + CSS, driven by draw(t, variant).
// Scenes: 1 hook (person cut-out with green rim light on a graded story photo, full-sentence hook + real logo badge)
//         2 the choice (owner, Nov 28): "What if he just bought {Bitcoin} instead?" + big VS: object's real logo in a circle
//           (left) vs the asset's real logo (right), labels "<object label> / $amount" and "<asset> / $amount" under them;
//           circles slide in from the sides, VS pops, the asset side glows
//         3 glass card (count-up starts as the card lands, multiple chip right after the number, price line drawn left to
//           right with a glowing head, dates, source)
//         4 end card (real Hotcoin symbol, "Trade X on Hotcoin", Download button, link in bio). variant "nocta" (TikTok, X):
//           no CTA text, no button: symbol + @hotcoinex only, shorter.
// Safe zones: key content inside y 220..1480 and x <= 920 below y=700. Frame 0 = the finished hook (thumbnail).
// window.SPEC is prepared by whatif_b2.py (texts resolved, images as data URIs, series as [[date, value in $]]).
const S = window.SPEC, W = 1080, H = 1920, G = '126,194,90';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eo = k => 1 - Math.pow(1 - k, 3), eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const back = k => { const c = 1.55; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const accent = s => esc(s).replace(/\{([^}]+)\}/g, '<span style="color:#7EC25A">$1</span>');   // {word} = brand green

// ---- timeline (s)
const T = {hookOut: 2.5, ch: 2.7, chOut: 5.55, card: 5.75};
T.count0 = T.line0 = T.card + .55; T.count1 = T.line1 = T.count0 + 3.6; T.endIn = T.count1 + 2.3;   // the number counts while the line draws
T.end = T.endIn + 5.0; T.endNo = T.endIn + 2.4;
window.DURATION = T.end; window.DURATION_NOCTA = T.endNo; window.END_T = T.endIn;
window.CUES = [{t: T.hookOut + .05, s: 'whoosh'}, {t: T.ch + .35, s: 'whoosh', pitch: 1.3}, {t: T.ch + .95, s: 'thud'}, {t: T.chOut + .05, s: 'whoosh'}, {t: T.card + .1, s: 'hop'}, {t: T.count1, s: 'chime'}, {t: T.endIn - .1, s: 'whoosh'}, {t: T.endIn + .45, s: 'thud'}];
window.COVER_T = 0;

// ---- money format (values in $)
function money(v) {
  const a = Math.abs(v), f = (x, u) => '$' + (x >= 100 ? Math.round(x) : x >= 10 ? x.toFixed(1).replace(/\.0$/, '') : x.toFixed(2).replace(/0$/, '').replace(/\.0$/, '')) + u;
  if (a >= 1e12) return f(v / 1e12, 'T'); if (a >= 1e9) return f(v / 1e9, 'B'); if (a >= 1e6) return f(v / 1e6, 'M');
  if (a >= 1e4) return '$' + Math.round(v).toLocaleString('en-US');
  return '$' + (a < 100 ? v.toFixed(2) : Math.round(v).toLocaleString('en-US'));
}

// ---- DOM
const css = `
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${W}px;height:${H}px;overflow:hidden;background:#030504}
body{color:#fff;font-family:'Inter Display','Inter',sans-serif}
.l{position:absolute;inset:0}.a{position:absolute}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.glow{position:absolute;border-radius:50%;filter:blur(90px)}
.grain{position:absolute;inset:-60px;background-size:540px 540px;mix-blend-mode:overlay;opacity:.55}
.vig{position:absolute;inset:0;background:radial-gradient(120% 85% at 50% 45%,transparent 45%,rgba(0,0,0,.72) 100%)}
.pill{position:absolute;display:inline-flex;align-items:center;gap:14px;padding:16px 28px;border-radius:999px;background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.14);font:600 26px 'Inter';letter-spacing:.2em;text-transform:uppercase;color:#d9e2d6}
.pill i{width:12px;height:12px;border-radius:50%;background:#7EC25A;box-shadow:0 0 16px #7EC25A}
.glass{position:absolute;border-radius:48px;background:linear-gradient(160deg,rgba(255,255,255,.10),rgba(255,255,255,.025));
  border:1px solid rgba(255,255,255,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 40px 120px rgba(0,0,0,.6);backdrop-filter:blur(30px)}
.grad{background:linear-gradient(180deg,#fff 30%,#b9c4b5);-webkit-background-clip:text;background-clip:text;color:transparent}
.mute{color:#8b958a}.line{display:block;white-space:nowrap}`;
const I = S.img;
const shade = {
  1: 'linear-gradient(180deg,rgba(3,5,4,.35) 0%,rgba(3,5,4,.10) 28%,rgba(3,5,4,.7) 47%,rgba(3,5,4,.85) 58%,rgba(3,5,4,.92) 80%,#030504 100%)',
  2: 'linear-gradient(180deg,rgba(3,5,4,.45) 0%,rgba(3,5,4,.35) 50%,rgba(3,5,4,.85) 85%)',
  c: 'radial-gradient(60% 30% at 50% 50%,rgba(3,5,4,.55),rgba(3,5,4,.2)),linear-gradient(180deg,rgba(3,5,4,.55) 0%,rgba(3,5,4,.35) 45%,rgba(3,5,4,.8) 80%,#030504 100%)',
  3: 'radial-gradient(70% 22% at 45% 62%,rgba(3,5,4,.85),rgba(3,5,4,0)),linear-gradient(180deg,rgba(3,5,4,.35) 0%,rgba(3,5,4,.25) 40%,rgba(3,5,4,.7) 75%,rgba(3,5,4,.92) 100%)'};
const bgOp = {1: .55, c: .6, 2: .55, 3: .85};
const cut = S.cutout || {};
const badge = I.object_logo ? `<img src="${I.object_logo}" style="display:inline-block;width:92px;height:92px;border-radius:50%;vertical-align:-6px;margin-left:22px;object-fit:cover;background:#fff;box-shadow:0 0 0 4px rgba(255,255,255,.9),0 10px 30px rgba(0,0,0,.55)">` : '';
const hook = S.hook.map((l, i) => `<span class="line hk" style="font:700 ${S.hook_px}px/1.04 'Inter Display';letter-spacing:-.035em"><span class="grad">${esc(l)}</span>${i === S.hook.length - 1 ? badge : ''}</span>`).join('');
const ques = S.question.map(l => `<span class="line qq" style="font:700 ${S.question_px}px/1.06 'Inter Display';letter-spacing:-.03em;color:#f3f6f1">${accent(l)}</span>`).join('');
const VD = 300;   // VS circle diameter
const circ = (id, img, fallback, ring) => `<div id="${id}" class="a" style="top:0;left:0;width:${VD}px;height:${VD}px;border-radius:50%;overflow:hidden;display:grid;place-items:center;
  background:#0b0f0c;box-shadow:${ring}">${img ? `<img src="${img}" style="width:100%;height:100%;object-fit:cover">` : `<span style="font:800 96px 'Inter Display'">${esc(fallback)}</span>`}</div>`;
const vlabel = (id, x, name, amt) => `<div id="${id}" class="a" style="left:${x - 210}px;width:420px;top:${S.vs_top + VD + 40}px;text-align:center">
  <span class="line" style="font:700 36px/1.2 'Inter Display';letter-spacing:-.01em;color:#eef2ec">${esc(name)}</span>
  <span class="line mute" style="font:600 32px/1.3 'Inter';margin-top:4px">${esc(amt)}</span></div>`;
const LX = 250, RX = 742;   // circle centres (right edge 892 < 920: safe zone)
const rings = [[300, 450, 380, .32], [210, 360, 560, .26], [110, 260, 760, .2], [0, 150, 980, .14]]
  .map(([x, y, d, o]) => `<div class="a ring" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;border:1px solid rgba(${G},${o})"></div>`).join('');
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
document.body.innerHTML = `
<div id="bgs" class="l">
  ${[1, 'c', 2, 3].map(n => `<div id="bg${n}" class="l"><div class="bg" id="bgi${n}" style="background-image:url(${I['bg' + n]});opacity:${bgOp[n]};${n === 'c' && S.bgc_blur ? `filter:blur(${S.bgc_blur}px);` : ''}"></div><div class="l" style="background:${shade[n]}"></div></div>`).join('')}
  <div id="refl" class="l"><div class="a" style="left:110px;top:1430px;height:170px;width:760px;background:radial-gradient(50% 50% at 50% 0%,rgba(${G},.22),rgba(${G},0));filter:blur(18px)"></div>
    <div class="a" style="left:90px;top:1424px;width:800px;height:2px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)"></div></div>
  <div id="grain" class="grain" style="background-image:url(${I.grain})"></div><div class="vig"></div>
</div>
<div id="s1" class="l">
  <div id="glow1" class="glow" style="left:220px;top:300px;width:700px;height:700px;background:rgba(${G},.28)"></div>
  <img id="cut" class="a" src="${I.cutout}" style="left:${cut.x ?? -30}px;top:${cut.y ?? 330}px;width:${cut.w ?? 1110}px;transform-origin:50% 30%;
    -webkit-mask-image:linear-gradient(180deg,#000 62%,transparent 98%)">
  <div class="a" style="left:72px;top:${S.hook_top}px;width:880px">${hook}</div>
</div>
<div id="sc" class="l">
  <div id="glowc" class="glow" style="left:${RX - 260}px;top:${S.vs_top - 110}px;width:520px;height:520px;background:rgba(${G},.5)"></div>
  <div class="a" style="left:60px;top:${S.vs_top + VD - 20}px;width:870px;height:160px;background:radial-gradient(50% 50% at 50% 30%,rgba(${G},.16),rgba(${G},0));filter:blur(14px)"></div>
  <div class="a" style="left:72px;width:848px;top:${S.q_top}px;text-align:center">${ques}</div>
  <div id="vl" class="a" style="left:${LX - VD / 2}px;top:${S.vs_top}px;width:${VD}px;height:${VD}px">${circ('cl', I.object_logo, S.vs.left_initials, '0 0 0 5px rgba(255,255,255,.88),0 30px 80px rgba(0,0,0,.6)')}</div>
  <div id="vr" class="a" style="left:${RX - VD / 2}px;top:${S.vs_top}px;width:${VD}px;height:${VD}px">${circ('cr', I.asset_logo, S.asset.name, '0 0 0 5px rgba(126,194,90,.95),0 30px 80px rgba(0,0,0,.6)')}</div>
  <div id="vs" class="a" style="left:${(LX + RX) / 2 - 70}px;top:${S.vs_top + VD / 2 - 70}px;width:140px;height:140px;border-radius:50%;display:grid;place-items:center;
    background:linear-gradient(160deg,rgba(255,255,255,.16),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.25);backdrop-filter:blur(20px);
    box-shadow:0 20px 60px rgba(0,0,0,.6);font:800 60px 'Inter Display';letter-spacing:-.03em;font-style:italic">VS</div>
  ${vlabel('ll', LX, S.vs.left_label, S.vs.left_amount)}${vlabel('lr', RX, S.vs.right_label, S.vs.right_amount)}
</div>
<div id="s2" class="l">
  <div class="l" style="background:radial-gradient(ellipse at 50% 120%,rgba(${G},.10),transparent 60%)"></div>
  <div id="glow2" class="glow" style="left:140px;top:520px;width:800px;height:700px;background:rgba(${G},.22)"></div>
  <div id="card" class="a" style="left:0;top:0;width:${W}px;height:${H}px">
    <div class="glass" style="left:60px;top:360px;width:860px;height:1060px"></div>
    <div class="a c2" style="left:110px;top:412px;display:flex;align-items:center;gap:20px;font:600 34px 'Inter';color:#e8ede6">
      <img src="${I.asset_logo}" style="width:64px;height:64px;object-fit:contain;${S.asset.logo_round ? 'border-radius:50%;background:#fff;' : ''}">${esc(S.asset.name)}<span class="mute" style="font-weight:500">&nbsp;${esc(S.since_label)}</span></div>
    <div class="a c2" style="left:110px;top:526px;font:600 40px 'Inter';letter-spacing:-.01em;color:#d9e2d6;white-space:nowrap">${esc(S.worth_label)}</div>
    <div id="num" class="a grad" style="left:102px;top:600px;font:800 ${S.num_px}px/1 'Inter Display';letter-spacing:-.05em;white-space:nowrap">${esc(S.result.value)}</div>
    <div id="chip" class="a" style="left:110px;top:880px;display:flex;gap:18px;align-items:center;transform-origin:0 50%">
      <span style="padding:14px 26px;border-radius:999px;background:${S.result.neg ? '#E5322D' : '#7EC25A'};color:#06140a;font:800 40px 'Inter Display'">${S.result.neg ? '&#9660;' : '&#9650;'} ${esc(S.result.mult)}</span>
      <span class="mute" style="font:500 32px 'Inter'">${esc(S.result.chip_text)}</span></div>
    <svg id="chart" class="a" style="left:110px;top:1000px;overflow:visible" width="760" height="380" viewBox="0 0 760 380">
      <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC25A" stop-opacity=".40"/><stop offset="1" stop-color="#7EC25A" stop-opacity="0"/></linearGradient>
        <filter id="gl" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="hg" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="10"/></filter></defs>
      ${[100, 200, 300].map(y => `<line x1="0" x2="760" y1="${y}" y2="${y}" stroke="rgba(255,255,255,.07)" stroke-width="2"/>`).join('')}
      <path id="area" fill="url(#ar)"/><path id="lglow" fill="none" stroke="#7EC25A" stroke-width="9" stroke-linejoin="round" stroke-linecap="round" opacity=".55" filter="url(#gl)"/>
      <path id="lpath" fill="none" stroke="#c9f2b0" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
      <circle id="h0" r="34" fill="#7EC25A" opacity=".5" filter="url(#hg)"/><circle id="h1" r="20" fill="#7EC25A" opacity=".3"/><circle id="h2" r="10" fill="#fff"/>
    </svg>
    <div id="d0" class="a mute" style="left:110px;top:1376px;font:600 24px 'Inter';letter-spacing:.12em">${esc(S.date0)}</div>
    <div id="d1" class="a mute" style="right:${W - 870}px;top:1376px;font:600 24px 'Inter';letter-spacing:.12em;text-align:right">${esc(S.date1)}</div>
    <div id="src" class="a" style="left:72px;top:1452px;width:850px;font:500 20px 'Inter';color:#6a7469;white-space:nowrap;overflow:hidden">${esc(S.source)}</div>
  </div>
</div>
<div id="s3" class="l">
  <div id="glow3" class="glow" style="left:190px;top:340px;width:600px;height:600px;background:rgba(${G},.30)"></div>
  <div id="rings" class="l" style="transform-origin:490px 640px">${rings}</div>
  <div id="tile" class="glass" style="left:370px;top:520px;width:240px;height:240px;border-radius:64px;display:grid;place-items:center"><img src="${I.symbol}" style="width:128px"></div>
  <div id="cta1" class="a" style="left:72px;width:848px;top:980px;text-align:center;font:700 ${S.cta_px}px/1.02 'Inter Display';letter-spacing:-.035em">
    <span class="grad line">${esc(S.cta[0])}</span><span class="line" style="color:#7EC25A">${esc(S.cta[1])}</span></div>
  <div id="btn" class="a" style="left:150px;width:680px;top:1236px;height:124px;border-radius:999px;background:linear-gradient(180deg,#9ad677,#6fb24c);
    box-shadow:0 0 0 1px rgba(255,255,255,.25) inset,0 20px 60px rgba(${G},.45);display:flex;align-items:center;justify-content:center;gap:22px;
    font:700 44px 'Inter Display';color:#06140a">Download Hotcoin <span style="font-size:40px">&#8594;</span></div>
  <div id="link" class="a mute" style="left:72px;width:848px;top:1394px;text-align:center;font:500 30px 'Inter'">Link in bio &nbsp;&middot;&nbsp; @hotcoinex</div>
  <div id="handle" class="a" style="left:72px;width:848px;top:880px;text-align:center;font:600 44px 'Inter';color:#d9e2d6">@hotcoinex</div>
  <img id="word" class="a" src="${I.wordmark}" style="left:72px;top:240px;height:46px">
</div>
<div id="pill" class="pill" style="left:72px;top:240px"><i></i>What if</div>`;

// ---- chart geometry (series already downsampled by whatif_b2.py)
const PTS = S.series, N = PTS.length, CW = 760, CH = 380;
const vals = PTS.map(p => p[1]), lo = S.log ? Math.log(Math.min(...vals)) : Math.min(...vals), hi = S.log ? Math.log(Math.max(...vals)) : Math.max(...vals);
const XY = PTS.map((p, i) => [i / (N - 1) * CW, CH - 34 - ((S.log ? Math.log(p[1]) : p[1]) - lo) / (hi - lo || 1) * (CH - 54)]);
function partial(k) {  // points up to fraction k of the x-axis, with an interpolated head
  const f = k * (N - 1), i = Math.floor(f), r = f - i, pts = XY.slice(0, i + 1);
  if (i < N - 1) pts.push([XY[i][0] + (XY[i + 1][0] - XY[i][0]) * r, XY[i][1] + (XY[i + 1][1] - XY[i][1]) * r]);
  return pts;
}
const $ = id => document.getElementById(id);
const E = {};
['bg1', 'bgc', 'bg2', 'bg3', 'bgi1', 'bgic', 'bgi2', 'bgi3', 'sc', 'glowc', 'vl', 'vr', 'cr', 'vs', 'll', 'lr', 'refl', 'grain', 's1', 's2', 's3', 'glow1', 'cut', 'card', 'glow2', 'num', 'chip', 'lpath', 'lglow', 'area', 'h0', 'h1', 'h2', 'd0', 'd1', 'src',
  'glow3', 'rings', 'tile', 'cta1', 'btn', 'link', 'handle', 'word', 'pill'].forEach(id => E[id] = $(id));
// number size: the widest count-up string must fit the card (760 px)
(() => { const n = $('num'); let w = 0; for (let k = 0; k <= 80; k++) { n.textContent = money(S.amount * Math.pow(S.result.raw / S.amount, k / 80)); w = Math.max(w, n.offsetWidth); }
  n.textContent = S.result.value; w = Math.max(w, n.offsetWidth); if (w > 760) n.style.fontSize = Math.floor(S.num_px * 760 / w) + 'px'; })();
const HK = [...document.querySelectorAll('.hk')], QQ = [...document.querySelectorAll('.qq')], C2 = [...document.querySelectorAll('.c2')];
function st(el, o = 1, y = 0, s = 1, x = 0) {
  el.style.opacity = o; el.style.transform = (x || y || s !== 1) ? `translate(${x}px,${y}px) scale(${s})` : 'none';
  el.style.visibility = o <= .001 ? 'hidden' : 'visible';
}

window.draw = function (t, variant = 'cta') {
  const nocta = variant === 'nocta';
  // grain: re-seeded every 2 frames (film grain, not a dirty screen)
  const g = Math.floor(t * 15); E.grain.style.transform = `translate(${(g * 137) % 60 - 30}px,${(g * 61) % 60 - 30}px)`;
  // ---- backgrounds: cross-fades + slow push-in
  const x1c = eio(prog(t, T.hookOut + .05, T.hookOut + .8)), x12 = eio(prog(t, T.chOut, T.chOut + .8)), x23 = eio(prog(t, T.endIn, T.endIn + .8));
  st(E.bg1, 1 - x1c); E.bgi1.style.transform = `scale(${1 + .06 * eio(prog(t, 0, T.hookOut + .8))})`;
  st(E.bgc, x1c * (1 - x12)); E.bgic.style.transform = `scale(${1.12 - .06 * eo(prog(t, T.hookOut, T.chOut + .8))})`;
  st(E.bg2, x12 * (1 - x23)); E.bgi2.style.transform = `scale(${1.08 - .06 * eo(prog(t, T.chOut, T.endIn + .8))})`;
  st(E.bg3, x23); E.bgi3.style.transform = `scale(${1.06 - .06 * eo(prog(t, T.endIn, T.end))})`;
  st(E.refl, x12 * (1 - x23));
  // ---- scene 1: hook (frame 0 = finished cover; lines settle up, photo pushes in, rim light pulses)
  const out1 = prog(t, T.hookOut, T.hookOut + .55);
  st(E.s1, t < T.hookOut + .7 ? 1 : 0);
  const pulse = .5 + .5 * Math.sin(t * 2 * Math.PI / 1.6 - Math.PI / 2);
  E.cut.style.filter = `contrast(1.05) saturate(.9) drop-shadow(0 0 ${1.5 + pulse}px rgba(200,245,170,${.5 + .25 * pulse})) drop-shadow(-4px -3px ${12 + 8 * pulse}px rgba(${G},${.3 + .22 * pulse}))`;
  st(E.cut, 1 - eio(prog(t, T.hookOut, T.hookOut + .55)), -30 * eio(out1), 1 + .035 * eio(prog(t, 0, 3.4)));
  st(E.glow1, (1 - out1) * (.85 + .15 * pulse));
  HK.forEach((el, i) => {
    const k = eo(prog(t, .05 + i * .1, .95 + i * .1)), q = eio(prog(t, T.hookOut + i * .05, T.hookOut + .45 + i * .05));
    st(el, 1 - q, 26 * (1 - k) - 70 * q);
  });
  // ---- scene 2: the choice (VS)
  const c0 = T.ch, cO = eio(prog(t, T.chOut, T.chOut + .45));
  st(E.sc, t > c0 - .05 && cO < 1 ? 1 : 0);
  QQ.forEach((el, i) => { const k = eo(prog(t, c0 + i * .1, c0 + .55 + i * .1)); st(el, k * (1 - cO), 30 * (1 - k) - 60 * cO); });
  const kl0 = eo(prog(t, c0 + .3, c0 + .9)), kr0 = eo(prog(t, c0 + .4, c0 + 1.0));
  st(E.vl, kl0 * (1 - cO), 40 * cO, 1 - .06 * cO, -460 * (1 - kl0) - 120 * cO);
  st(E.vr, kr0 * (1 - cO), 40 * cO, 1 - .06 * cO, 460 * (1 - kr0) + 120 * cO);
  const kv = prog(t, c0 + .9, c0 + 1.35); st(E.vs, kv > 0 ? eo(kv) * (1 - cO) : 0, 40 * cO, kv > 0 ? .4 + .6 * back(kv) : 1);
  [E.ll, E.lr].forEach((el, i) => { const k = eo(prog(t, c0 + 1.05 + i * .12, c0 + 1.55 + i * .12)); st(el, k * (1 - cO), 18 * (1 - k) + 40 * cO); });
  const gp = .5 + .5 * Math.sin((t - c0 - 1.2) * 2 * Math.PI / 1.1);          // glow pulse on the asset side
  const gOn = eo(prog(t, c0 + 1.0, c0 + 1.5)) * (1 - cO);
  st(E.glowc, gOn * (.6 + .4 * gp), 0, .92 + .16 * gp);
  E.cr.style.boxShadow = `0 0 0 5px rgba(126,194,90,.95),0 0 ${30 + 50 * gp * gOn}px ${6 + 10 * gp * gOn}px rgba(${G},${.25 + .45 * gp * gOn}),0 30px 80px rgba(0,0,0,.6)`;
  // ---- scene 3: glass card
  const cin = eo(prog(t, T.card, T.card + .8)), cout = eio(prog(t, T.endIn, T.endIn + .45));
  st(E.s2, t > T.card - .05 && cout < 1 ? 1 : 0);
  st(E.card, cin * (1 - cout), 160 * (1 - cin) - 80 * cout, 1 - .04 * cout);
  st(E.glow2, cin * (1 - cout) * (.8 + .2 * Math.sin(t * 2.2)));
  C2.forEach((el, i) => { const k = eo(prog(t, T.card + .1 + i * .1, T.card + .6 + i * .1)); st(el, k, 18 * (1 - k)); });
  const kc = prog(t, T.count0, T.count1);
  const v = S.amount * Math.pow(S.result.raw / S.amount, eio(kc));          // geometric count: every digit place gets screen time
  E.num.textContent = kc >= 1 ? S.result.value : money(v);
  st(E.num, eo(prog(t, T.card + .3, T.card + .8)), 14 * (1 - eo(prog(t, T.card + .3, T.card + .8))));
  const kp = prog(t, T.count1, T.count1 + .45); st(E.chip, kp > 0 ? 1 : 0, 0, kp > 0 ? .82 + .18 * back(kp) : 1);
  const kl = eio(prog(t, T.line0, T.line1)), pts = partial(Math.max(.0005, kl));
  const d = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
  E.lpath.setAttribute('d', d); E.lglow.setAttribute('d', d);
  const hd = pts[pts.length - 1];
  E.area.setAttribute('d', d + ` L${hd[0].toFixed(1)},${CH} L0,${CH} Z`);
  const lineOn = t >= T.line0 - .2 ? eo(prog(t, T.line0 - .2, T.line0 + .3)) : 0;
  [E.lpath, E.lglow, E.area].forEach(e => e.style.opacity = lineOn * (e === E.lglow ? .55 : 1));
  const hp = .5 + .5 * Math.sin(t * 7);
  [[E.h0, .45 + .2 * hp], [E.h1, .3], [E.h2, 1]].forEach(([e, o]) => { e.setAttribute('cx', hd[0]); e.setAttribute('cy', hd[1]); e.style.opacity = o * lineOn; });
  E.h1.setAttribute('r', 18 + 6 * hp);
  st(E.d0, eo(prog(t, T.line0, T.line0 + .5)));
  st(E.d1, eo(prog(t, T.line1 - .3, T.line1 + .2)));
  st(E.src, eo(prog(t, T.line1, T.line1 + .6)));
  // pill: over scenes 1-2
  st(E.pill, 1 - eio(prog(t, T.endIn, T.endIn + .5)));
  // ---- scene 4: end card
  const e0 = T.endIn + .4;
  st(E.s3, t >= T.endIn ? 1 : 0);
  st(E.glow3, x23 * (.85 + .15 * Math.sin(t * 2)));
  const kr = eo(prog(t, e0, e0 + 1.4)); st(E.rings, kr, 0, .7 + .3 * kr);
  const kt = prog(t, e0 + .1, e0 + .7); st(E.tile, kt > 0 ? eo(kt) : 0, 0, kt > 0 ? .7 + .3 * back(kt) : 1);
  const k1 = eo(prog(t, e0 + .45, e0 + 1.05)), kb = prog(t, e0 + .8, e0 + 1.3), kk = eo(prog(t, e0 + 1.1, e0 + 1.6));
  st(E.cta1, nocta ? 0 : k1, 30 * (1 - k1));
  st(E.btn, nocta || kb <= 0 ? 0 : eo(kb), 40 * (1 - eo(kb)), kb > 0 ? .9 + .1 * back(kb) : 1);
  if (!nocta && kb >= 1) E.btn.style.boxShadow = `0 0 0 1px rgba(255,255,255,.25) inset,0 20px ${60 + 25 * (.5 + .5 * Math.sin((t - e0) * 3))}px rgba(${G},${.4 + .15 * Math.sin((t - e0) * 3)})`;
  st(E.link, nocta ? 0 : kk, 16 * (1 - kk));
  st(E.handle, nocta ? k1 : 0, 24 * (1 - k1));
  st(E.word, eo(prog(t, e0 + .3, e0 + .9)) * .9);
};
window.draw(0);
