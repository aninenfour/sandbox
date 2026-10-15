// Shot 4 "Charts": a glowing lime BTC line draws itself across a tilted dark glass panel. The camera rides the
// tip of the line low and close, then pulls back to reveal the full 120-day move. BTC daily closes: Coinbase.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import data from './data.json';
import {Grain, LIME, MONO, SANS, Sparkle, UP, WHITE, Word, fmt, io, lerp, out, useFonts} from './kit';

const PW = 2400, PH = 1100; // panel size (px, panel space)
const PAD = {l: 120, r: 260, t: 150, b: 150};
const btc = data.btc as [string, number][];
const N = btc.length;
const lo = Math.min(...btc.map((b) => b[1])) * 0.97, hi = Math.max(...btc.map((b) => b[1])) * 1.02;
const px = (i: number) => PAD.l + (i / (N - 1)) * (PW - PAD.l - PAD.r);
const py = (v: number) => PH - PAD.b - ((v - lo) / (hi - lo)) * (PH - PAD.t - PAD.b);
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (d: string) => `${+d.slice(8)} ${MON[+d.slice(5, 7) - 1]}`;

// point on the line at fractional index
const at = (t: number) => {
  const i = Math.min(N - 2, Math.floor(t)), u = t - i;
  return {x: lerp(px(i), px(i + 1), u), y: lerp(py(btc[i][1]), py(btc[i + 1][1]), u), v: lerp(btc[i][1], btc[i + 1][1], u), i: Math.round(t)};
};

const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const p = io((f - 6) / 168) * 0.25 + out((f - 6) / 168) * 0.75; // draw progress
  const tIdx = p * (N - 1);
  const tip = at(tIdx);
  const pts = btc.slice(0, Math.floor(tIdx) + 1).map((b, i) => [px(i), py(b[1])]);
  pts.push([tip.x, tip.y]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${d} L${tip.x.toFixed(1)},${PH - PAD.b} L${PAD.l},${PH - PAD.b} Z`;
  // camera: ride the tip, then pull back to the whole panel
  const back = io((f - 150) / 80);
  const ox = lerp(tip.x, PW / 2 + 40, back), oy = lerp(tip.y, PH / 2, back);
  const sx = lerp(1180, 960, back), sy = lerp(600, 585, back);
  const scale = lerp(1.9, 0.6, back) + 0.03 * (f / 300);
  const rx = lerp(58, 30, back), rz = lerp(-14, -7, back), ry = lerp(-10, 0, back);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 55% 75%, #12210B 0%, #07100A 45%, #040605 100%)', overflow: 'hidden', fontFamily: SANS, color: WHITE}}>
      <div style={{position: 'absolute', inset: 0, perspective: 1800, perspectiveOrigin: '50% 35%'}}>
        <div style={{position: 'absolute', left: sx - ox, top: sy - oy, width: PW, height: PH, transformOrigin: `${ox}px ${oy}px`,
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`, borderRadius: 48,
          background: 'linear-gradient(160deg, rgba(30,40,30,0.75) 0%, rgba(10,14,11,0.9) 60%)', border: '1.5px solid rgba(184,242,106,0.16)', boxShadow: '0 0 0 1px rgba(0,0,0,0.6), 0 80px 160px rgba(0,0,0,0.6)'}}>
          <svg width={PW} height={PH} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <defs>
              <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={LIME} stopOpacity="0.32" /><stop offset="1" stopColor={LIME} stopOpacity="0" /></linearGradient>
              <filter id="glow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="16" /></filter>
              <filter id="glow2" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
              <radialGradient id="dot"><stop offset="0" stopColor={WHITE} /><stop offset="0.35" stopColor={LIME} /><stop offset="1" stopColor={LIME} stopOpacity="0" /></radialGradient>
            </defs>
            {/* grid */}
            {Array.from({length: 7}, (_, k) => {
              const y = PAD.t + (k / 6) * (PH - PAD.t - PAD.b), v = hi - (k / 6) * (hi - lo);
              return (
                <g key={k}>
                  <line x1={PAD.l} x2={PW - PAD.r + 40} y1={y} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth={2} strokeDasharray="4 10" />
                  <text x={PW - PAD.r + 64} y={y + 9} fill="rgba(255,255,255,0.38)" fontFamily={MONO} fontSize={26}>{Math.round(v / 1000)}K</text>
                </g>
              );
            })}
            {btc.map(([dt], i) => (dt.endsWith('-01') || dt.endsWith('-15')) ? (
              <g key={dt} opacity={i <= tIdx + 2 ? 1 : 0.25}>
                <line x1={px(i)} x2={px(i)} y1={PAD.t} y2={PH - PAD.b} stroke="rgba(255,255,255,0.05)" strokeWidth={2} />
                <text x={px(i)} y={PH - PAD.b + 58} fill="rgba(255,255,255,0.45)" fontFamily={MONO} fontSize={26} textAnchor="middle">{fmtDate(dt)}</text>
              </g>
            ) : null)}
            {/* line + glow */}
            <path d={area} fill="url(#fill)" />
            <path d={d} stroke={LIME} strokeWidth={22} fill="none" opacity={0.55} filter="url(#glow)" strokeLinejoin="round" />
            <path d={d} stroke={LIME} strokeWidth={9} fill="none" opacity={0.9} filter="url(#glow2)" strokeLinejoin="round" />
            <path d={d} stroke="#EFFFD8" strokeWidth={4.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {/* tip */}
            <line x1={tip.x} x2={tip.x} y1={tip.y} y2={PH - PAD.b} stroke={LIME} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="6 8" />
            <circle cx={tip.x} cy={tip.y} r={70} fill="url(#dot)" opacity={0.65} />
            {[0, 1].map((k) => {
              const ph = ((f + k * 30) % 60) / 60;
              return <circle key={k} cx={tip.x} cy={tip.y} r={14 + ph * 70} fill="none" stroke={LIME} strokeWidth={3} opacity={(1 - ph) * 0.7} />;
            })}
            <circle cx={tip.x} cy={tip.y} r={12} fill={WHITE} />
          </svg>
          {/* price tag riding the tip */}
          <div style={{position: 'absolute', left: tip.x + 40, top: tip.y - 120, padding: '16px 24px', borderRadius: 22, background: 'rgba(8,12,9,0.88)', border: '1.5px solid rgba(184,242,106,0.4)',
            fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', opacity: 1 - out(back * 1.6)}}>
            <div style={{fontFamily: MONO, fontSize: 24, color: 'rgba(255,255,255,0.55)'}}>{fmtDate(btc[Math.min(N - 1, tip.i)][0])}</div>
            <div style={{fontSize: 52, fontWeight: 600, letterSpacing: -1.5}}>${fmt(tip.v, 0)}</div>
          </div>
        </div>
      </div>
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};

// HUD and type sit outside the motion blur so the counters stay crisp.
const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const p = io((f - 6) / 168) * 0.25 + out((f - 6) / 168) * 0.75;
  const tip = at(p * (N - 1));
  const chg = (tip.v / btc[0][1] - 1) * 100;
  const hud = out((f - 8) / 20);
  const reveal = out((f - 200) / 30);
  return (
    <AbsoluteFill style={{fontFamily: SANS, color: WHITE}}>
      <div style={{position: 'absolute', left: 96, top: 84, opacity: hud, transform: `translateY(${(1 - hud) * 20}px)`, fontVariantNumeric: 'tabular-nums'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Img src={staticFile('promo4/coins/bitcoin.png')} style={{width: 52, height: 52, borderRadius: 26}} />
          <div style={{fontSize: 34, fontWeight: 600, letterSpacing: -0.6}}>BTC<span style={{color: 'rgba(255,255,255,0.45)'}}>/USDT</span></div>
          <div style={{marginLeft: 8, padding: '6px 14px', borderRadius: 100, border: '1.5px solid rgba(255,255,255,0.18)', fontFamily: MONO, fontSize: 18, color: 'rgba(255,255,255,0.7)'}}>1D · 120D</div>
        </div>
        <div style={{fontSize: 108, fontWeight: 600, letterSpacing: -4.5, marginTop: 10, lineHeight: 1}}>${fmt(tip.v, 2)}</div>
        <div style={{fontSize: 36, fontWeight: 600, color: chg >= 0 ? UP : '#F6465D', marginTop: 12}}>{chg >= 0 ? '+' : ''}{chg.toFixed(2)}% <span style={{color: 'rgba(255,255,255,0.45)', fontWeight: 500}}>since {fmtDate(btc[0][0])}</span></div>
      </div>
      <Img src={staticFile('brand/logo-official-white.png')} style={{position: 'absolute', right: 96, top: 98, width: 220, height: (220 * 328) / 2005, opacity: hud * 0.95}} />
      <Word f={f} at={214} until={300} text="see every move." color={WHITE} size={112} x={960} y={985} />
      <Sparkle x={1500} y={300} s={56} f={f} at={176} color={LIME} />
      <Sparkle x={1556} y={350} s={22} f={f} at={182} />
      <div style={{position: 'absolute', right: 96, bottom: 40, fontFamily: MONO, fontSize: 15, color: 'rgba(255,255,255,0.35)', opacity: reveal}}>BTC daily closes, Coinbase, 17 Jun to 14 Oct 2026</div>
    </AbsoluteFill>
  );
};

export const ChartShot: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill>
      <CameraMotionBlur samples={7} shutterAngle={200}><Scene /></CameraMotionBlur>
      <Hud />
    </AbsoluteFill>
  );
};
