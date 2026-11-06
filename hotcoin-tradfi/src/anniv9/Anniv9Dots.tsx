// Hotcoin 9th Anniversary Relay · Round 1, "dots" edition (Dan Koe-like particle style): black canvas, one living field of dots
// that flows from dust into 9 → 18 → 99 → 19,999 → Hotcoin logo, over a breathing halftone grid. Minimal serif/sans/mono type.
// Facts: event brief (Nov 6-16, 2026 UTC+8; up to 18 USDT; 9 × 99 USDT lucky draw; 19,999 USDT pool). Hotcoin since 2017.
// Music: scripts/make-anniv9-dots-beat.py -> public/anniv9/dots.wav (DT mirrored there).
import React, {useEffect, useRef, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

type Lang = 'en' | 'zh';
const LIME = '#B8F26A', WHITE = '#F2F3EF';
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ip = (f: number, a: number[], b: number[]) => interpolate(f, a, b, cl);
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
// morph windows [start, end] into shape k (k=1..5); holds in between
export const DT = {m: [[36, 96], [168, 214], [276, 320], [380, 424], [486, 532]], end: 640};
export const ANNIV9D_DURATION = DT.end;
const N = 4200;
const hash = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

const C = {
  en: [
    {k: 'HOTCOIN · SINCE 2017', h: 'Nine years.', s: 'And the relay starts with you.'},
    {k: 'ROUND 01 · NEWCOMER KICKOFF', h: 'Up to 18 USDT.', s: 'Register 5 · KYC 9 · first trade ≥ 99 USDT +9'},
    {k: 'LUCKY BONUS', h: '99 USDT, nine times.', s: '9 random winners. Just register via the link.'},
    {k: 'TOTAL PRIZE POOL', h: '19,999 USDT.', s: 'Nov 6 – Nov 16 · 23:59 UTC+8'},
    {k: 'JOIN THE RELAY', h: 'hotcoin.com/r/Hccommunity', s: 'Futures trading is high risk · Not financial advice'},
  ],
  zh: [
    {k: 'HOTCOIN · SINCE 2017', h: '九年。', s: '接力赛，从你开始。'},
    {k: '第一棒 · 新人起跑礼', h: '最高 18 USDT', s: '注册 5 · KYC 9 · 首笔合约 ≥ 99 USDT 再得 9'},
    {k: '9周年幸运加码', h: '99 USDT × 9 位', s: '随机抽取，指定链接注册即可参与'},
    {k: '总奖池', h: '19,999 USDT', s: '11/6 — 11/16 23:59 UTC+8'},
    {k: '加入接力赛', h: 'hotcoinv5.com/r/Hccommunity', s: '合约交易风险较高 · 不构成投资建议'},
  ],
};

type Pt = [number, number];
function sampleCanvas(draw: (g: CanvasRenderingContext2D) => void, W: number, H: number, step: number): Pt[] {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d')!; g.fillStyle = '#fff'; draw(g);
  const d = g.getImageData(0, 0, W, H).data; const pts: Pt[] = [];
  for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (d[(y * W + x) * 4 + 3] > 140) pts.push([x, y]);
  return pts;
}
// spread N particles over a point set; sort both so the flow is coherent (sweeps rather than chaos)
function fit(pts: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const p = pts[Math.floor(hash(i, 7) * pts.length) % pts.length];
    out.push([p[0] + (hash(i, 8) - 0.5) * 3, p[1] + (hash(i, 9) - 0.5) * 3]);
  }
  return out.sort((a, b) => a[0] * 0.6 + a[1] - (b[0] * 0.6 + b[1]));
}

const useShapes = (W: number, H: number) => {
  const [shapes, setShapes] = useState<Pt[][] | null>(null);
  const [h] = useState(() => delayRender('dots-shapes'));
  useEffect(() => {
    const fonts = ['800 400px "Inter Tight"', 'italic 400 80px "Instrument Serif"', '500 20px "JetBrains Mono"', '600 30px "Inter Tight"', '700 40px NotoSC'];
    const logo = new Image(); logo.src = staticFile('brand/logo-official-white.png');
    Promise.all([...fonts.map((x) => document.fonts.load(x, '9 18 99 19,999 九年')), new Promise((r) => { logo.onload = r; logo.onerror = r; })]).then(() => {
      const cy = H * 0.4, step = 7;
      const num = (txt: string, size: number) => sampleCanvas((g) => { g.font = `800 ${size}px "Inter Tight"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, W / 2, cy); }, W, H, step);
      const dust: Pt[] = Array.from({length: N}, (_, i) => [hash(i, 1) * W, hash(i, 2) * H]);
      const lw = W * 0.7, lh = lw * (logo.naturalHeight / Math.max(1, logo.naturalWidth));
      const logoPts = sampleCanvas((g) => { if (logo.naturalWidth) g.drawImage(logo, (W - lw) / 2, cy - lh / 2, lw, lh); }, W, H, 5);
      setShapes([dust, fit(num('9', H * 0.62)), fit(num('18', H * 0.5)), fit(num('99', H * 0.5)), fit(num('19,999', W * 0.285)), fit(logoPts.length ? logoPts : num('H', 400))]);
      continueRender(h);
    });
  }, [h, W, H]);
  return shapes;
};

const FontFaces: React.FC = () => (
  <style>{`@font-face{font-family:NotoSC;font-weight:700;src:url(${staticFile('fonts/NotoSansSC-700.ttf')}) format('truetype');font-display:block}`}</style>
);

export const Anniv9Dots: React.FC<{lang: Lang}> = ({lang}) => {
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const shapes = useShapes(W, H);
  const ref = useRef<HTMLCanvasElement>(null);

  // which shape pair + progress
  let from = 0, to = 0, t = 1;
  for (let k = 0; k < DT.m.length; k++) {
    const [a, b] = DT.m[k];
    if (f >= a) { from = k; to = k + 1; t = ip(f, [a, b], [0, 1]); }
  }
  if (f < DT.m[0][0]) { from = 0; to = 0; t = 0; }

  useEffect(() => {
    const cv = ref.current; if (!cv || !shapes) return;
    const g = cv.getContext('2d')!; g.clearRect(0, 0, W, H);
    // breathing halftone grid
    const gs = 22, wave = f / 30;
    for (let y = gs / 2; y < H; y += gs) for (let x = gs / 2; x < W; x += gs) {
      const dx = x - W / 2, dy = y - H * 0.42, r = Math.sqrt(dx * dx + dy * dy);
      const a = 0.05 + 0.06 * Math.max(0, Math.sin(r / 60 - wave * 2.2)) * Math.max(0, 1 - r / (W * 0.9));
      const intro = ip(f, [0, 30], [0, 1]);
      g.fillStyle = `rgba(242,243,239,${a * intro})`; g.beginPath(); g.arc(x, y, 1.1, 0, 6.283); g.fill();
    }
    const A = shapes[from], B = shapes[to];
    for (let i = 0; i < N; i++) {
      // per-particle stagger along the sweep, curling path
      const delay = (i / N) * 0.35 + hash(i, 3) * 0.15;
      const lt = ease(Math.min(1, Math.max(0, (t - delay) / 0.5)));
      const ax = A[i][0], ay = A[i][1], bx = B[i][0], by = B[i][1];
      const mx = (ax + bx) / 2, my = (ay + by) / 2, dx = bx - ax, dy = by - ay;
      const curl = Math.sin(lt * Math.PI) * (0.25 + hash(i, 4) * 0.35) * (hash(i, 5) > 0.5 ? 1 : -1);
      const px = (1 - lt) * (1 - lt) * ax + 2 * (1 - lt) * lt * (mx - dy * curl) + lt * lt * bx;
      const py = (1 - lt) * (1 - lt) * ay + 2 * (1 - lt) * lt * (my + dx * curl) + lt * lt * by;
      // idle life: dust drifts more, shapes just breathe
      const drift = to === 0 ? 14 : 1.6;
      const nx = Math.sin(f / 37 + i * 0.7) * drift + Math.sin(f / 23 + i * 1.3) * drift * 0.4;
      const ny = Math.cos(f / 41 + i * 0.9) * drift + Math.cos(f / 19 + i * 1.1) * drift * 0.4;
      const lime = i % 9 === 0;
      const tw = 0.55 + 0.45 * Math.sin(f / 9 + i * 2.1);
      const size = (lime ? 2.2 : 1.8) * (to === 0 ? 0.8 : 1) * (1 + Math.sin(lt * Math.PI) * 0.6);
      const alpha = (to === 0 ? 0.35 + 0.35 * tw : 0.75 + 0.25 * tw) * ip(f, [0, 24], [0, 1]);
      g.fillStyle = lime ? `rgba(184,242,106,${alpha})` : `rgba(242,243,239,${alpha})`;
      g.beginPath(); g.arc(px + nx, py + ny, size, 0, 6.283); g.fill();
    }
  }, [f, shapes, from, to, t, W, H]);

  // copy: scene k (0..4) shows after morph k completes, until the next morph starts
  const scene = to - 1;
  const startIn = scene >= 0 ? DT.m[scene][1] - 14 : 9999;
  const endOut = scene + 1 < DT.m.length ? DT.m[scene + 1][0] + 6 : 99999;
  const tin = ip(f, [startIn, startIn + 22], [0, 1]) * ip(f, [endOut - 12, endOut], [1, 0]);
  const copy = scene >= 0 ? C[lang][scene] : null;
  const zh = lang === 'zh';
  const isUrl = scene === 4;
  const typed = isUrl && copy ? copy.h.slice(0, Math.max(0, Math.floor((f - startIn - 10) / 1.4))) : copy?.h;

  return (
    <AbsoluteFill style={{background: '#030404'}}>
      <FontFaces />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(184,242,106,.06), rgba(0,0,0,0) 70%)'}} />
      <canvas ref={ref} width={W} height={H} style={{position: 'absolute', inset: 0}} />
      {copy && (
        <div style={{position: 'absolute', left: 80, right: 80, top: H * 0.72, textAlign: 'center', opacity: tin}}>
          <div style={{fontFamily: '"JetBrains Mono", NotoSC, monospace', fontSize: 21, letterSpacing: 5, color: LIME, transform: `translateY(${(1 - tin) * 14}px)`}}>{copy.k}</div>
          <div style={{fontFamily: isUrl ? '"JetBrains Mono", monospace' : zh ? 'NotoSC, sans-serif' : '"Instrument Serif", serif', fontStyle: isUrl || zh ? 'normal' : 'italic',
            fontWeight: zh && !isUrl ? 700 : 400, fontSize: isUrl ? 44 : zh ? 76 : 96, letterSpacing: isUrl ? 0 : zh ? 4 : -1.5, color: WHITE, marginTop: 18, lineHeight: 1.05,
            filter: `blur(${(1 - tin) * 6}px)`, transform: `translateY(${(1 - tin) * 22}px)`, ...(isUrl ? {border: '1.5px solid rgba(242,243,239,.35)', borderRadius: 999, padding: '22px 34px', display: 'inline-block'} : {})}}>
            {typed}{isUrl && <span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: LIME}}>▍</span>}
          </div>
          <div style={{fontFamily: zh ? 'NotoSC, sans-serif' : '"Inter Tight", sans-serif', fontWeight: 500, fontSize: isUrl ? 20 : 29, color: 'rgba(242,243,239,.6)', marginTop: isUrl ? 26 : 20, letterSpacing: isUrl ? 1 : 0,
            transform: `translateY(${(1 - tin) * 26}px)`}}>{copy.s}</div>
        </div>
      )}
      <Audio src={staticFile('anniv9/dots.wav')} />
    </AbsoluteFill>
  );
};
