// Referral carousel: four 1080 x 1350 slides cut from one 4320 x 1350 canvas.
// One green line runs through all four and leaves slide 4 at the height it enters slide 1, so the swipe loops.
// Facts are from hotcoin.com/en_US/user/ic (referral page and its rules), checked 2 Oct 2026.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

export const CAROUSEL_W = 4320, CAROUSEL_H = 1350;
const INK = '#0B0E11', LIME = '#AAFF73', GREEN = '#7EC25A', PAPER = '#F1EFE8', MUTED = '#A3A8B0';
const ARCH = '"Archivo Black", sans-serif', MONO = '"IBM Plex Mono", monospace', SERIF = '"Instrument Serif", serif', UI = 'Roboto, sans-serif';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['400 80px "Archivo Black"', '500 30px "IBM Plex Mono"', 'italic 400 80px "Instrument Serif"', '400 30px Roboto', '500 30px Roboto'].map((s) => document.fonts.load(s)))
      .then(() => continueRender(h));
  }, [h]);
};

// ---------- the line ----------
type P = [number, number];
const pts: P[] = [];
const add = (p: P) => pts.push(p);
const bez = (a: P, b: P, c: P, d: P, n = 60) => {
  for (let i = 1; i <= n; i++) {
    const t = i / n, u = 1 - t;
    add([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]);
  }
};
const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 30) => {
  for (let i = 1; i <= n; i++) {const a = a0 + ((a1 - a0) * i) / n; add([cx + r * Math.cos(a), cy + r * Math.sin(a)]);}
};
// Orthogonal route with rounded corners.
const route = (corners: P[], r: number) => {
  for (let i = 1; i < corners.length; i++) {
    const [x0, y0] = corners[i - 1], [x1, y1] = corners[i];
    const next = corners[i + 1];
    if (!next) {add([x1, y1]); break;}
    const dx = Math.sign(x1 - x0), dy = Math.sign(y1 - y0), nx = Math.sign(next[0] - x1), ny = Math.sign(next[1] - y1);
    const a: P = [x1 - dx * r, y1 - dy * r], b: P = [x1 + nx * r, y1 + ny * r];
    add(a);
    for (let k = 1; k <= 16; k++) {const t = k / 16, u = 1 - t; add([u * u * a[0] + 2 * u * t * x1 + t * t * b[0], u * u * a[1] + 2 * u * t * y1 + t * t * b[1]]);}
  }
};
const LOOP_Y = 1300; // entry height on slide 1 = exit height on slide 4
const INF = {cx: 640, cy: 1062, a: 300};
const RAIL2 = 1200, STEP_Y = [500, 780, 1060];
const LOGO_W = 360, LOGO_S = LOGO_W / 485, DOT: P = [3330, 1180];
// slide 1: rise into the centre of the infinity sign, loop it once, leave along the same tangent
add([-40, LOOP_Y]);
bez([-40, LOOP_Y], [200, LOOP_Y], [INF.cx - 140, INF.cy + 140], [INF.cx, INF.cy]);
for (let i = 1; i <= 220; i++) {
  const t = Math.PI / 2 - (i / 220) * 2 * Math.PI, s = Math.sin(t);
  add([INF.cx + (INF.a * Math.cos(t)) / (1 + s * s), INF.cy - (INF.a * s * Math.cos(t)) / (1 + s * s)]);
}
bez([INF.cx, INF.cy], [INF.cx + 150, INF.cy - 150], [990, 940], [990, 800]);
add([990, 420]);
arc(1080, 420, 90, Math.PI, 1.5 * Math.PI);
// slide 2: drop down the step rail, then out along the floor
arc(RAIL2 - 90, 420, 90, 1.5 * Math.PI, 2 * Math.PI);
add([RAIL2, 1150]);
arc(RAIL2 + 90, 1150, 90, Math.PI, 0.5 * Math.PI);
// slide 3: a staircase of friend milestones; slide 4: down the rail, through the logo's dot, back to the loop height
const TREADS = [1060, 880, 700, 520], RISERS = [2300, 2520, 2740, 2960];
route([[RAIL2 + 90, 1240], [RISERS[0], 1240], [RISERS[0], TREADS[0]], [RISERS[1], TREADS[0]], [RISERS[1], TREADS[1]], [RISERS[2], TREADS[1]], [RISERS[2], TREADS[2]],
  [RISERS[3], TREADS[2]], [RISERS[3], TREADS[3]], [DOT[0], TREADS[3]], [DOT[0], LOOP_Y], [CAROUSEL_W + 40, LOOP_Y]], 46);
const D = 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L');

const Line: React.FC = () => (
  <svg width={CAROUSEL_W} height={CAROUSEL_H} style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="lg" x1="0" x2={CAROUSEL_W} y1="0" y2="0" gradientUnits="userSpaceOnUse">
        {[LIME, GREEN, LIME, GREEN, LIME].map((c, i) => <stop key={i} offset={i / 4} stopColor={c} />)}
      </linearGradient>
      <filter id="glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="18" /></filter>
    </defs>
    <path d={D} fill="none" stroke={LIME} strokeOpacity={0.45} strokeWidth={26} filter="url(#glow)" strokeLinecap="round" strokeLinejoin="round" />
    <path d={D} fill="none" stroke="url(#lg)" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
    <path d={D} fill="none" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={2.5} transform="translate(-1.5,-3)" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------- pieces ----------
const sphere = `radial-gradient(circle at 32% 28%, #F4FFE9 0%, ${LIME} 26%, ${GREEN} 62%, #3F7A24 100%)`;
const Node: React.FC<{x: number; y: number; r?: number; label?: string}> = ({x, y, r = 34, label}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: sphere,
    boxShadow: `0 0 0 8px rgba(170,255,115,0.12), 0 0 40px rgba(170,255,115,0.55), inset 0 -6px 12px rgba(0,0,0,0.25)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ARCH, fontSize: r * 0.72, color: INK}}>{label}</div>
);
const Coin: React.FC<{x: number; y: number; d: number; text: string; rx?: number; ry?: number; rz?: number; blur?: number}> = ({x, y, d, text, rx = 0, ry = 0, rz = 0, blur = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, width: d, height: d, perspective: 900, filter: blur ? `blur(${blur}px)` : undefined}}>
    <div style={{width: d, height: d, borderRadius: '50%', transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
      background: `radial-gradient(circle at 34% 26%, #F6FFEE 0%, ${LIME} 22%, ${GREEN} 58%, #376B1F 100%)`,
      boxShadow: `inset 0 0 0 ${d * 0.06}px rgba(255,255,255,0.35), inset 0 0 0 ${d * 0.1}px rgba(55,107,31,0.55), inset 0 -${d * 0.06}px ${d * 0.12}px rgba(0,0,0,0.35), 0 ${d * 0.18}px ${d * 0.3}px rgba(0,0,0,0.55), 0 0 ${d * 0.5}px rgba(170,255,115,0.35)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <span style={{fontFamily: ARCH, fontSize: d * (text.length > 3 ? 0.2 : 0.3), color: '#25471A', textShadow: '0 2px 0 rgba(255,255,255,0.45)', letterSpacing: -1}}>{text}</span>
    </div>
  </div>
);
const Kicker: React.FC<{x: number; y: number; n: string; children: React.ReactNode}> = ({x, y, n, children}) => (
  <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 18, fontFamily: MONO, fontWeight: 500, fontSize: 26, letterSpacing: 2, color: LIME}}>
    <span style={{padding: '6px 16px', border: `1.5px solid ${LIME}`, borderRadius: 30}}>{children}</span>
  </div>
);
const Page: React.FC<{i: number}> = ({i}) => (
  <div style={{position: 'absolute', left: i * 1080 + 1080 - 80 - 140, top: 96, width: 140, textAlign: 'right', fontFamily: MONO, fontSize: 24, color: MUTED}}>
    <span style={{color: PAPER}}>0{i + 1}</span> / 04
  </div>
);
const Glass: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))', border: '1px solid rgba(255,255,255,0.12)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 50px rgba(0,0,0,0.35)', borderRadius: 24, backdropFilter: 'blur(14px)',
};
const H: React.FC<{x: number; y: number; size?: number; children: React.ReactNode; color?: string}> = ({x, y, size = 104, children, color = PAPER}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: ARCH, fontSize: size, lineHeight: 1, letterSpacing: -size * 0.035, color, whiteSpace: 'nowrap'}}>{children}</div>
);
const It: React.FC<{x: number; y: number; size?: number; children: React.ReactNode; color?: string}> = ({x, y, size = 116, children, color = PAPER}) => (
  <div style={{position: 'absolute', left: x, top: y, fontFamily: SERIF, fontStyle: 'italic', fontSize: size, lineHeight: 1, letterSpacing: -1, color, whiteSpace: 'nowrap'}}>{children}</div>
);

// ---------- the carousel ----------
export const Carousel: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      {/* atmosphere that runs across the seams */}
      <AbsoluteFill style={{background: [
        'radial-gradient(ellipse 520px 380px at 640px 1060px, rgba(126,194,90,0.20), transparent 70%)',
        'radial-gradient(ellipse 500px 600px at 1240px 760px, rgba(126,194,90,0.12), transparent 70%)',
        'radial-gradient(ellipse 700px 520px at 2700px 820px, rgba(126,194,90,0.14), transparent 70%)',
        'radial-gradient(ellipse 600px 420px at 3330px 1180px, rgba(126,194,90,0.16), transparent 70%)',
        'radial-gradient(ellipse 900px 500px at 4320px 1300px, rgba(126,194,90,0.10), transparent 70%)',
        'radial-gradient(ellipse 900px 500px at 0px 1300px, rgba(126,194,90,0.10), transparent 70%)',
      ].join(',')}} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1.2px, transparent 1.6px)', backgroundSize: '36px 36px',
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 40%, #000 100%)'}} />

      {/* 01: the hook */}
      <Kicker x={80} y={88} n="01">REFERRAL PROGRAM</Kicker>
      <Page i={0} />
      <H x={80} y={190} size={96}>Invite friends.</H>
      <It x={84} y={300} size={118} color={MUTED}>earn up to</It>
      <div style={{position: 'absolute', left: 64, top: 390, fontFamily: ARCH, fontSize: 330, lineHeight: 1, letterSpacing: -16,
        background: `linear-gradient(180deg, #E9FFD9 0%, ${LIME} 45%, ${GREEN} 100%)`, WebkitBackgroundClip: 'text', color: 'transparent',
        filter: 'drop-shadow(0 0 40px rgba(170,255,115,0.35))'}}>20%</div>
      <div style={{position: 'absolute', left: 82, top: 760, fontFamily: UI, fontSize: 36, lineHeight: 1.35, color: PAPER, width: 720}}>
        of your friends' net trading fees.<br /><span style={{color: LIME, fontWeight: 500}}>No cap on rewards.</span>
      </div>
      <Coin x={800} y={150} d={150} text="%" rx={18} ry={-28} rz={-10} />
      <Coin x={900} y={300} d={84} text="%" rx={-20} ry={30} rz={14} blur={1.5} />
      <Node x={INF.cx - INF.a} y={INF.cy} r={20} />
      <Node x={INF.cx + INF.a} y={INF.cy} r={20} />
      <div style={{position: 'absolute', left: INF.cx - INF.a - 150, top: INF.cy - 18, fontFamily: MONO, fontWeight: 500, fontSize: 26, color: PAPER, letterSpacing: 2}}>YOU</div>
      <div style={{position: 'absolute', left: INF.cx + INF.a + 34, top: INF.cy - 18, fontFamily: MONO, fontWeight: 500, fontSize: 26, color: PAPER, letterSpacing: 2}}>FRIEND</div>
      <div style={{position: 'absolute', left: 80, top: 1180, fontFamily: MONO, fontSize: 22, color: MUTED}}>Follow the line →</div>

      {/* 02: how it works */}
      <Kicker x={1080 + 80} y={88} n="02">HOW IT WORKS</Kicker>
      <Page i={1} />
      <H x={1080 + 210} y={190} size={96}>Three steps.</H>
      <It x={1080 + 214} y={296} size={104} color={MUTED}>Then it runs itself.</It>
      {[
        {t: 'Share your link', b: <>Find your link and code in <b style={{color: PAPER, fontWeight: 500}}>Rewards → Referral Program</b>.</>},
        {t: 'Friend signs up and trades', b: <>They register with your link or code. Only direct invites count.</>},
        {t: 'You earn, next day', b: <>Up to 20% of their net fees, paid T+1 by 02:00 (UTC+8).</>},
      ].map((s, i) => (
        <React.Fragment key={s.t}>
          <Node x={RAIL2} y={STEP_Y[i]} r={38} label={`0${i + 1}`} />
          <div style={{position: 'absolute', left: RAIL2 + 80, top: STEP_Y[i] - 62, width: 760, ...Glass, padding: '26px 32px'}}>
            <div style={{fontFamily: ARCH, fontSize: 44, letterSpacing: -1, color: PAPER}}>{s.t}</div>
            <div style={{fontFamily: UI, fontSize: 29, lineHeight: 1.35, color: MUTED, marginTop: 10}}>{s.b}</div>
          </div>
        </React.Fragment>
      ))}

      {/* 03: the friend's side */}
      <Kicker x={2160 + 80} y={88} n="03">YOUR FRIEND WINS TOO</Kicker>
      <Page i={2} />
      <H x={2160 + 80} y={190} size={96}>They get a</H>
      <It x={2160 + 84} y={290} size={124} color={LIME}>head start.</It>
      {[
        {t: 'Sign up', x: RISERS[0], y: TREADS[0]},
        {t: 'Verify (KYC)', x: RISERS[1], y: TREADS[1]},
        {t: 'First deposit', x: RISERS[2], y: TREADS[2]},
        {t: 'First futures\ntrade', x: RISERS[3], y: TREADS[3]},
      ].map((m) => (
        <div key={m.t} style={{position: 'absolute', left: m.x + 14, top: m.y - 158, width: 204, height: 136, ...Glass, borderRadius: 20, padding: '16px 18px', boxSizing: 'border-box'}}>
          <div style={{fontFamily: ARCH, fontSize: 23, lineHeight: 1.12, color: PAPER, whiteSpace: 'pre-line'}}>{m.t}</div>
          <div style={{position: 'absolute', left: 18, bottom: 14, fontFamily: MONO, fontWeight: 500, fontSize: 22, color: LIME}}>+10 USDT</div>
        </div>
      ))}
      <Coin x={3090} y={250} d={116} text="10" rx={22} ry={-30} rz={-8} />
      <div style={{position: 'absolute', left: 2600, top: 1010, width: 560, textAlign: 'right'}}>
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: 2, color: MUTED}}>UP TO</div>
        <div style={{fontFamily: ARCH, fontSize: 150, lineHeight: 1, letterSpacing: -6, color: PAPER}}>16,360</div>
        <div style={{fontFamily: UI, fontSize: 30, color: MUTED, marginTop: 6}}>USDT in bonuses to unlock</div>
      </div>
      <div style={{position: 'absolute', left: 2240, top: 1290, fontFamily: UI, fontSize: 22, color: MUTED, opacity: 0.8}}>Each milestone unlocks a 10 USDT futures trading rebate voucher.</div>

      {/* 04: why it compounds */}
      <Kicker x={3240 + 170} y={88} n="04">MAKE IT COMPOUND</Kicker>
      <Page i={3} />
      <H x={3240 + 170} y={190} size={104}>No cap.</H>
      <It x={3240 + 174} y={300} size={104} color={MUTED}>Every trade, 360 days.</It>
      <div style={{position: 'absolute', left: 3410, top: 440, display: 'flex', gap: 14}}>
        {['No cap on rewards', '360 days per friend', 'Paid daily, T+1'].map((t) => (
          <div key={t} style={{fontFamily: UI, fontWeight: 500, fontSize: 25, color: PAPER, padding: '12px 20px', borderRadius: 40, ...{border: `1.5px solid rgba(170,255,115,0.55)`, background: 'rgba(170,255,115,0.07)'}}}>{t}</div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 3410, top: 556, width: 830, height: 470, ...Glass, padding: '34px 40px', boxSizing: 'border-box'}}>
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: 2, color: MUTED}}>ILLUSTRATIVE EXAMPLE</div>
        <div style={{display: 'flex', gap: 12, marginTop: 26}}>
          {Array.from({length: 10}, (_, i) => <div key={i} style={{width: 46, height: 46, borderRadius: '50%', background: sphere, boxShadow: '0 0 18px rgba(170,255,115,0.4)'}} />)}
        </div>
        <div style={{fontFamily: UI, fontSize: 32, lineHeight: 1.4, color: PAPER, marginTop: 24}}>10 friends each pay <b style={{fontWeight: 500}}>50 USDT</b> in net trading fees.</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 20}}>
          <span style={{fontFamily: ARCH, fontSize: 120, lineHeight: 1, letterSpacing: -5, color: LIME}}>100</span>
          <span style={{fontFamily: ARCH, fontSize: 40, color: LIME}}>USDT</span>
          <span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 46, color: PAPER}}>to you, at 20%.</span>
        </div>
        <div style={{fontFamily: UI, fontSize: 24, color: MUTED, marginTop: 14}}>And it keeps coming while they keep trading.</div>
      </div>
      <div style={{position: 'absolute', left: 3410, top: 1050, fontFamily: UI, fontWeight: 500, fontSize: 30, color: INK, background: `linear-gradient(180deg, #C6FF9F, ${LIME})`, padding: '16px 30px', borderRadius: 14,
        boxShadow: '0 12px 30px rgba(170,255,115,0.3), inset 0 1px 0 rgba(255,255,255,0.6)'}}>Rewards → Referral Program</div>
      <Img src={staticFile('brand/logo.png')} style={{position: 'absolute', left: DOT[0] - 70 * LOGO_S, top: DOT[1] - 71 * LOGO_S, width: LOGO_W, height: 93 * LOGO_S}} />
      <div style={{position: 'absolute', left: 3740, top: 1150, width: 500, fontFamily: UI, fontSize: 17, lineHeight: 1.45, color: MUTED}}>
        <span style={{fontFamily: MONO, fontWeight: 500, fontSize: 22, color: PAPER}}>hotcoin.com</span><br />
        Rewards are based on friends' net trading fees. Direct invites only; self-referral is prohibited. Rules and rates may change. Trading involves risk.
      </div>

      <Line />
      {/* the infinity's centre bead and the step beads sit on top of the line */}
      <Node x={INF.cx - INF.a} y={INF.cy} r={20} />
      <Node x={INF.cx + INF.a} y={INF.cy} r={20} />
      {STEP_Y.map((y, i) => <Node key={y} x={RAIL2} y={y} r={38} label={`0${i + 1}`} />)}
      {TREADS.map((y, i) => <Node key={y} x={RISERS[i] + 116} y={y} r={14} />)}
      <Img src={staticFile('brand/logo.png')} style={{position: 'absolute', left: DOT[0] - 70 * LOGO_S, top: DOT[1] - 71 * LOGO_S, width: LOGO_W, height: 93 * LOGO_S}} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.18}} />
    </AbsoluteFill>
  );
};
