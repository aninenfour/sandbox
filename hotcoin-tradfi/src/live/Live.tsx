// "Live from TOKEN2049" photo treatment for the Hotcoin booth shots. 2000 x 1333 (same as the photos).
// Notched lime frame, crop marks, LIVE tag, logo, a cut-corner headline panel, and a rotating-text 9 YEARS sticker.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

const LIME = '#B8F26A', INK = '#050706', WHITE = '#F2F3EE', RED = '#FF3B3B';
const DISPLAY = 'Unbounded, sans-serif', MONO = '"JetBrains Mono", monospace';
export const LIVE_W = 2000, LIVE_H = 1333;

type Shot = {photo: string; kicker: string; l1: string; l2: string; sticker: [number, number]; panel: 'left' | 'right'; w?: number; h?: number};
export const SHOTS: Shot[] = [
  {photo: 'p3', kicker: 'DAY 1 · BOOTH LIVE', l1: 'Turning 9', l2: 'at TOKEN2049.', sticker: [1080, 1060], panel: 'left'},
  {photo: 'p4', kicker: 'MEET THE SQUAD', l1: 'The green team', l2: 'is in.', sticker: [1180, 240], panel: 'left'},
  {photo: 'p5', kicker: 'FOOTBALL CHALLENGE', l1: 'Play. Score.', l2: 'Win.', sticker: [930, 1150], panel: 'left'},
  {photo: 'p6', kicker: 'LEVEL 5 · PB5-5 + PB5-6', l1: 'Find the', l2: 'green booth.', sticker: [1080, 1080], panel: 'left'},
  // set 2: the booth crew as a football team
  {photo: 'p7', kicker: 'MEET THE TEAM', l1: 'Our starting', l2: 'lineup.', sticker: [1250, 215], panel: 'left'},
  {photo: 'p8', kicker: 'ON-SITE SUPPORT', l1: 'Assist of', l2: 'the day.', sticker: [1060, 360], panel: 'left', w: 1333, h: 2000},
  {photo: 'p9', kicker: 'FOOTBALL CHALLENGE', l1: 'Prize', l2: 'secured.', sticker: [1060, 330], panel: 'left', w: 1333, h: 2000},
  {photo: 'p10', kicker: 'SCAN · CHECK IN · WIN', l1: 'Perfect', l2: 'pass.', sticker: [1250, 1110], panel: 'left'},
  // set 3: conversations, check-ins, the challenge, the milestones wall
  {photo: 'p11', kicker: 'REAL CONVERSATIONS', l1: 'Built for', l2: 'traders.', sticker: [800, 1150], panel: 'left'},
  {photo: 'p12', kicker: 'CHECK IN · CLAIM REWARDS', l1: 'Good vibes', l2: 'only.', sticker: [1250, 1120], panel: 'left'},
  {photo: 'p13', kicker: 'FOOTBALL CHALLENGE', l1: 'Play your', l2: 'way.', sticker: [1700, 260], panel: 'left'},
  {photo: 'p14', kicker: '2017 → TOKEN2049', l1: '9 years', l2: 'in the making.', sticker: [1730, 330], panel: 'left'},
  // set 4: Day 2 photographer shots (attendee name badges pre-blurred in the jpgs)
  {photo: 'p15', kicker: 'DAY 2 · BOOTH LIVE', l1: 'All in', l2: 'Hotcoin.', sticker: [1760, 960], panel: 'left'},
  {photo: 'p16', kicker: 'GOOD TALKS ONLY', l1: 'Crypto. TradFi.', l2: 'One market.', sticker: [1780, 930], panel: 'left'},
  {photo: 'p17', kicker: '9 YEARS OF FOCUS', l1: 'Built for', l2: 'traders.', sticker: [1830, 960], panel: 'left'},
  {photo: 'p18', kicker: 'FOOTBALL CHALLENGE', l1: 'Play your way.', l2: 'Make it magic.', sticker: [1180, 330], panel: 'right'},
  {photo: 'p19', kicker: 'DAY 2 · LEVEL 5', l1: 'Wave the', l2: 'green flag.', sticker: [1730, 1000], panel: 'left'},
  // set 5: Day 2, the challenge, check-ins and sign-ups (badges pre-blurred)
  {photo: 'p20', kicker: 'FOOTBALL CHALLENGE', l1: 'Every age.', l2: 'Every shot.', sticker: [1180, 470], panel: 'right'},
  {photo: 'p21', kicker: 'HOTCOIN TURNS 9', l1: 'Scan. Play.', l2: 'Win.', sticker: [1720, 250], panel: 'left'},
  {photo: 'p22', kicker: 'DAY 2 · SIGN-UPS LIVE', l1: 'The booth', l2: 'is buzzing.', sticker: [1270, 230], panel: 'left'},
  {photo: 'p23', kicker: 'NEW USERS', l1: 'Sign up.', l2: 'Trade on.', sticker: [300, 260], panel: 'right'},
  {photo: 'p24', kicker: 'DAY 2 · BOOTH LIVE', l1: 'HODL mode:', l2: 'on.', sticker: [1870, 520], panel: 'left'},
  // set 6: Day 2, the challenge wall and the squad (badge pre-blurred)
  {photo: 'p25', kicker: 'FOOTBALL CHALLENGE', l1: 'Football', l2: 'connects.', sticker: [1800, 380], panel: 'left'},
  {photo: 'p26', kicker: 'THE GREEN SQUAD', l1: 'Good vibes,', l2: 'full squad.', sticker: [330, 265], panel: 'left'},
  {photo: 'p27', kicker: 'FOOTBALL CHALLENGE', l1: 'Heads up.', l2: 'Magic on.', sticker: [300, 300], panel: 'left'},
  {photo: 'p28', kicker: 'DAY 2 · BOOTH LIVE', l1: 'Yes, you.', l2: 'Come by.', sticker: [1040, 330], panel: 'left', w: 1333, h: 2000},
];

export const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {Promise.all(['900 96px Unbounded', '700 24px "JetBrains Mono"', '500 24px "JetBrains Mono"'].map((s) => document.fonts.load(s))).then(() => continueRender(h));}, [h]);
};

const M = 44, N = 46; // frame margin, corner notch
const frame = (w: number, h: number, m: number, n: number) =>
  `M ${m + n} ${m} L ${w - m} ${m} L ${w - m} ${h - m - n} L ${w - m - n} ${h - m} L ${m} ${h - m} L ${m} ${m + n} Z`;

export const Sticker: React.FC<{x: number; y: number}> = ({x, y}) => {
  const R = 118, text = 'HOTCOIN · 9 YEARS · BUILT FOR TRADERS · ';
  return (
    <div style={{position: 'absolute', left: x - R, top: y - R, width: R * 2, height: R * 2, transform: 'rotate(-14deg)', filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.45))'}}>
      <svg width={R * 2} height={R * 2} style={{position: 'absolute', inset: 0}}>
        <circle cx={R} cy={R} r={R - 2} fill={LIME} />
        <circle cx={R} cy={R} r={R - 46} fill={INK} />
        <defs><path id="ring" d={`M ${R},${R} m -${R - 23},0 a ${R - 23},${R - 23} 0 1,1 ${2 * (R - 23)},0 a ${R - 23},${R - 23} 0 1,1 -${2 * (R - 23)},0`} /></defs>
        <text fontFamily={MONO} fontWeight={700} fontSize={19} letterSpacing={3.2} fill={INK}><textPath href="#ring">{text}</textPath></text>
      </svg>
      <div style={{position: 'absolute', inset: 46, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, lineHeight: 1, color: LIME}}>9</div>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: 3, color: WHITE, marginTop: 4}}>YEARS</div>
      </div>
    </div>
  );
};

export const Live: React.FC<{i: number}> = ({i}) => {
  useFonts();
  const s = SHOTS[i], W = s.w ?? LIVE_W, H = s.h ?? LIVE_H, tall = H > W, right = s.panel === 'right';
  return (
    <AbsoluteFill style={{background: INK}}>
      <Img src={staticFile(`live/${s.photo}.jpg`)} style={{position: 'absolute', inset: 0, width: W, height: H, filter: 'contrast(1.06) saturate(1.06)'}} />
      {/* grade: darken edges so the graphics read */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,7,6,0.55) 0%, rgba(5,7,6,0) 22%, rgba(5,7,6,0) 62%, rgba(5,7,6,0.7) 100%)'}} />
      {/* notched frame + offset hairline + crop marks */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <path d={frame(W, H, M, N)} fill="none" stroke={LIME} strokeWidth={6} />
        <path d={frame(W, H, M + 18, N - 8)} fill="none" stroke="rgba(242,243,238,0.45)" strokeWidth={1.5} strokeDasharray="10 8" />
        {[[M - 26, H / 2], [W - M + 26, H / 2]].map(([x, y], k) => (
          <g key={k} stroke={LIME} strokeWidth={3}><line x1={x - 14} y1={y} x2={x + 14} y2={y} /><line x1={x} y1={y - 14} x2={x} y2={y + 14} /></g>
        ))}
        {/* lime cut in the top-right notch */}
        <polygon points={`${W - M - 160},${M} ${W - M},${M} ${W - M},${M + 160}`} fill={LIME} opacity={0} />
      </svg>
      {/* top bar */}
      <div style={{position: 'absolute', left: M + 40, top: M + 34, display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, background: INK, border: `2px solid ${LIME}`, borderRadius: 40, padding: '10px 22px 10px 18px'}}>
          <span style={{width: 16, height: 16, borderRadius: '50%', background: RED, boxShadow: `0 0 14px ${RED}`}} />
          <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: WHITE}}>LIVE</span>
        </div>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: INK, background: LIME, padding: '12px 20px', clipPath: 'polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)', paddingRight: 34}}>TOKEN2049 SINGAPORE</div>
      </div>
      <div style={{position: 'absolute', right: M + 40, top: M + 36, display: 'flex', alignItems: 'center', gap: 20}}>
        {tall ? null : <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: 3, color: WHITE, opacity: 0.85}}>07—08.10.2026</div>}
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 230, height: (230 * 328) / 2005}} />
      </div>
      {/* vertical side label */}
      <div style={{position: 'absolute', left: M + 14, top: H / 2 + 220, transform: 'rotate(-90deg)', transformOrigin: 'left top', fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: 6, color: LIME}}>
        HOTCOIN × TOKEN2049 · MARINA BAY SANDS
      </div>
      {/* headline panel with a cut corner */}
      <div style={{position: 'absolute', [right ? 'right' : 'left']: M, bottom: M, padding: right ? '36px 60px 40px 90px' : '36px 90px 40px 60px', background: INK,
        clipPath: right ? 'polygon(70px 0, 100% 0, 100% 100%, 0 100%, 0 70px)' : 'polygon(0 0, calc(100% - 70px) 0, 100% 70px, 100% 100%, 0 100%)'}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: LIME, marginBottom: 18}}>// {s.kicker}</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 86, lineHeight: 0.98, letterSpacing: -3, color: WHITE, whiteSpace: 'nowrap'}}>{s.l1}</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 86, lineHeight: 0.98, letterSpacing: -3, color: LIME, whiteSpace: 'nowrap'}}>{s.l2}</div>
      </div>
      <div style={{position: 'absolute', [right ? 'right' : 'left']: M, bottom: M - 3, width: 360, height: 6, background: LIME}} />
      {/* booth chip, bottom right */}
      <div style={{position: 'absolute', [right ? 'left' : 'right']: M + 40, bottom: M + 36, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: WHITE, background: 'rgba(5,7,6,0.75)', border: `2px solid ${LIME}`, padding: '12px 22px', borderRadius: 6}}>
        📍 LEVEL 5 · PB5-5 + PB5-6
      </div>
      <Sticker x={s.sticker[0]} y={s.sticker[1]} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.14}} />
    </AbsoluteFill>
  );
};
