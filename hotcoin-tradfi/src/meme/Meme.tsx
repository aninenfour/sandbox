// Memecoin history, 30 s at 148 BPM ("Head Bang", Mixkit). A white timeline the camera travels along:
// one green line runs era to era, each coin's CoinGecko logo pops onto it as the line passes,
// and the line ends as the green dot in the Hotcoin logo.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {IN, INOUT, OUT, clamp, ease, sp} from '../alt/kit';

export const BEAT = 3600 / 148;
const at = (k: number) => Math.round(k * BEAT);
const E = (k: number) => at(k) - 2; // visual events lead the beat by two frames
export const MEME_DURATION = at(74);
const MUSIC_START_S = 0.017 + 12 * 4 * (60 / 148); // track bar 12, so its drop lands on film beat 16
const INK = '#0B0E11', PAPER = '#FFFFFF', GREEN = '#7EC25A', DOT_GREEN = '#AAFF73', GREY = '#8B8E93';
const ARCH = '"Archivo Black", sans-serif', MONO = '"IBM Plex Mono", monospace', SERIF = '"Instrument Serif", serif';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['400 80px "Archivo Black"', '500 30px "IBM Plex Mono"', '400 30px "IBM Plex Mono"', 'italic 400 80px "Instrument Serif"'].map((s) => document.fonts.load(s))).then(() => continueRender(h));
  }, [h]);
};

// ---------- story ----------
type Coin = {t: string; k: number; ext: string};
type Era = {k0: number; k1: number; year: string; title: string; rate: number; band?: string; fg?: string; line?: string; coins: Coin[]; headDy?: number};
const c = (t: string, k: number, ext = 'png'): Coin => ({t, k, ext});
const ERAS: Era[] = [
  {k0: 0, k1: 6, year: '2013', title: 'The first|memecoin', rate: 180, coins: [c('DOGE', 2)]},
  {k0: 6, k1: 12, year: '2020–21', title: 'The dog|wars', rate: 180, coins: [c('SHIB', 7.5), c('FLOKI', 9.5)]},
  {k0: 12, k1: 20, year: '2021', title: 'To the|moon', rate: 150, coins: [], headDy: 40},
  {k0: 20, k1: 26, year: '2023', title: 'The|frog', rate: 180, coins: [c('PEPE', 21.5, 'jpeg')], headDy: -40},
  {k0: 26, k1: 34, year: '2023–24', title: 'Solana|season', rate: 180, coins: [c('BONK', 27, 'jpg'), c('WIF', 28.5, 'jpg'), c('POPCAT', 30, 'jpg')]},
  {k0: 34, k1: 40, year: '2024–25', title: 'Cult|coins', rate: 180, coins: [c('NEIRO', 35, 'jpg'), c('MEW', 36.25), c('USELESS', 37.5)]},
  {k0: 40, k1: 50, year: '2024–25', title: 'Launchpad|mania', rate: 262, coins: [c('PUMP', 41, 'jpg'), c('FARTCOIN', 42, 'jpg'), c('PNUT', 43), c('MOODENG', 44, 'jpg'), c('GOAT', 45, 'jpg'), c('CHILLGUY', 46)]},
  {k0: 50, k1: 53, year: '2024', title: 'Base|season', rate: 300, band: '#0052FF', fg: PAPER, coins: [c('BRETT', 50.4), c('TOSHI', 51.2), c('DEGEN', 52)]},
  {k0: 53, k1: 56, year: '2025', title: 'BNB|season', rate: 300, band: '#F0B90B', fg: INK, coins: [c('BROCCOLI', 53.4, 'jpg'), c('MUBARAK', 54.2, 'jpg'), c('TUT', 55)]},
  {k0: 56, k1: 58, year: '20??', title: 'Next|chain?', rate: 300, band: '#97E763', fg: INK, line: INK, coins: []},
  {k0: 58, k1: 74, year: '', title: '', rate: 40, coins: []},
];
const ALL_COINS = ERAS.flatMap((e) => e.coins);
const eraAt = (b: number) => ERAS.find((e) => b >= e.k0 && b < e.k1) ?? ERAS[ERAS.length - 1];

// World x of the head after b beats: each era runs at its own pace (the moon climb slows the camera, today almost stops it).
const X = (b: number) => ERAS.reduce((s, e) => s + e.rate * Math.max(0, Math.min(b, e.k1) - e.k0), 0);
// World y: smooth keyframes like a price chart, with a little texture on top.
const YK: [number, number][] = [[0, 0], [6, -20], [12, -80], [14, -260], [15, -480], [16, -980], [17, -840], [20, -560], [22, -660], [24, -600], [26, -620],
  [28, -720], [30, -690], [32, -800], [34, -780], [40, -800], [44, -860], [46, -950], [48, -1180], [50, -1560], [58, -1560], [74, -1560]];
const Y = (b: number) => {
  let i = 1; while (i < YK.length - 1 && YK[i][0] < b) i++;
  const [b0, y0] = YK[i - 1], [b1, y1] = YK[i];
  const t = Math.min(1, Math.max(0, (b - b0) / (b1 - b0)));
  const tex = b < 50 ? 9 * Math.sin(b * 5.3) + 5 * Math.sin(b * 12.1) : 0;
  return y0 + (y1 - y0) * (0.5 - 0.5 * Math.cos(Math.PI * t)) + tex;
};
const camY = (b: number) => {let s = 0; for (let i = 0; i <= 8; i++) s += Y(b - 1.2 + (1.5 * i) / 8); return s / 9;};
const HEAD_X = 790, LINE_Y = 820; // the head rides right of centre so each coin crosses the whole frame

// End card geometry: the logo is 485 x 93 with its green dot centred at (70, 71), radius 14.5.
const LOGO_W = 620, LOGO_S = LOGO_W / 485, LOGO_X = 540 - LOGO_W / 2, LOGO_Y = 610;
const DOT = {x: LOGO_X + 70 * LOGO_S, y: LOGO_Y + 71 * LOGO_S, r: 14.5 * LOGO_S};

const Logo: React.FC<{coin: Coin; size: number}> = ({coin, size}) => (
  <div style={{width: size, height: size, borderRadius: '50%', overflow: 'hidden', background: PAPER, boxShadow: `0 0 0 ${size * 0.045}px ${PAPER}, 0 ${size * 0.08}px ${size * 0.2}px rgba(11,14,17,0.18)`}}>
    <Img src={staticFile(`meme/logos/${coin.t}.${coin.ext}`)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
  </div>
);

// ---------- the travelling timeline ----------
const World: React.FC<{fr: number; b: number; bs: number}> = ({fr, b, bs}) => {
  const camX = X(b) - HEAD_X;
  const lower = interpolate(b, [58, 59.2], [0, 400], {...clamp, easing: INOUT});
  const dy = -camY(b) + LINE_Y + lower;
  const fadeWorld = interpolate(b, [58.2, 59], [1, 0], clamp);
  const punch = 1 + 0.05 * Math.exp(-Math.max(0, fr - E(16)) / 7) * (fr >= E(16) ? 1 : 0);
  const sx = (x: number) => x - camX, sy = (y: number) => y + dy;
  // the line, drawn era by era so each can carry its own colour
  const segs = ERAS.filter((e) => e.k0 < bs).map((e) => {
    const pts: string[] = [];
    for (let t = e.k0; t <= Math.min(e.k1, bs) + 1e-6; t += 0.04) pts.push(`${sx(X(t)).toFixed(1)},${sy(Y(t)).toFixed(1)}`);
    pts.push(`${sx(X(Math.min(e.k1, bs))).toFixed(1)},${sy(Y(Math.min(e.k1, bs))).toFixed(1)}`);
    return {pts: pts.join(' '), color: e.line ?? GREEN, k: e.k0};
  });
  const hx = sx(X(bs)), hy = sy(Y(bs));
  const headColor = eraAt(bs).line ?? GREEN;
  return (
    <AbsoluteFill style={{transform: `scale(${punch})`, transformOrigin: `${hx}px ${hy}px`}}>
      <svg width={1080} height={1350} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {segs.map((s) => <polyline key={s.k} points={s.pts} fill="none" stroke={s.color} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />)}
      </svg>
      <AbsoluteFill style={{opacity: fadeWorld}}>
        {/* the 2021 peak */}
        {[{t: 'DOGE ATH $0.73', k: 16, dy: -90}, {t: 'SHIB ATH $0.000086', k: 17, dy: 0}].map((a) => {
          const p = fr < E(a.k) ? 0 : sp(fr - E(a.k), 11, 260);
          return p > 0 ? (
            <div key={a.t} style={{position: 'absolute', left: sx(X(16)) - 60, top: sy(Y(16)) + a.dy - 40, transform: `translateX(-100%) scale(${p})`, transformOrigin: 'right center',
              fontFamily: MONO, fontWeight: 500, fontSize: 32, color: PAPER, background: INK, borderRadius: 40, padding: '8px 20px', whiteSpace: 'nowrap'}}>{a.t}</div>
          ) : null;
        })}
        {ALL_COINS.map((coin, i) => {
          const p = fr < E(coin.k) ? 0 : sp(fr - E(coin.k), 13, 190);
          if (p <= 0) return null;
          const x = sx(X(coin.k)), y = sy(Y(coin.k));
          if (x < -300 || x > 1400) return null;
          const fg = eraAt(b).fg ?? INK; // labels follow the colour on screen, not the era they were born in
          const below = i % 2 === 0;
          return (
            <React.Fragment key={coin.t}>
              <div style={{position: 'absolute', left: x - 92, top: y - 92, transform: `scale(${p})`}}><Logo coin={coin} size={184} /></div>
              <div style={{position: 'absolute', left: x - 300, width: 600, textAlign: 'center', top: below ? y + 112 : y - 172, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - Math.min(1, p)) * (below ? -20 : 20)}px)`,
                fontFamily: ARCH, fontSize: 48, letterSpacing: -1, color: fg}}>${coin.t}</div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <svg width={1080} height={1350} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <circle cx={hx} cy={hy} r={30 + 10 * Math.exp(-(((fr + 2) / BEAT) % 1) * 5)} fill={headColor} opacity={0.22} />
        <circle cx={hx} cy={hy} r={15} fill={headColor} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- screen-pinned era titles and colour seasons ----------
const TITLED = ERAS.filter((e) => e.title);
const STRIP = '0123456789?';
const digitIdx = (ch: string) => Math.max(0, STRIP.indexOf(ch));
// The year rolls like an odometer from one era to the next; each digit lands a frame after the one before it.
const Odometer: React.FC<{fr: number; i: number; color: string}> = ({fr, i, color}) => {
  const cur = TITLED[i].year.slice(0, 4), prev = i ? TITLED[i - 1].year.slice(0, 4) : '2000';
  const H = 150;
  return (
    <div style={{display: 'flex', height: H, overflow: 'hidden'}}>
      {cur.split('').map((ch, d) => {
        const p = fr < E(TITLED[i].k0) + d * 2 ? 0 : sp(fr - E(TITLED[i].k0) - d * 2, 15, 170);
        const pos = digitIdx(prev[d]) + (digitIdx(ch) - digitIdx(prev[d])) * p;
        return (
          <div key={d} style={{width: H * 0.68, transform: `translateY(${-pos * H}px)`}}>
            {STRIP.split('').map((n) => (
              <div key={n} style={{height: H, lineHeight: `${H}px`, fontFamily: ARCH, fontSize: H * 0.95, textAlign: 'center', color: 'transparent', WebkitTextStroke: `3px ${color}`}}>{n}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
// One masked line of the title: rises in on the era's first beat, rises out just before the era ends.
const MaskLine: React.FC<{fr: number; k0: number; k1: number; delay: number; h: number; children: React.ReactNode}> = ({fr, k0, k1, delay, h, children}) => {
  const inP = fr < E(k0) + delay ? 0 : Math.min(1.04, sp(fr - E(k0) - delay, 16, 220));
  const outP = ease(fr, E(k1) - 11 + delay / 2, E(k1) - 2, IN);
  return (
    <div style={{height: h, overflow: 'hidden'}}>
      <div style={{transform: `translateY(${(1 - inP) * h * 1.05 - outP * h * 1.05}px)`}}>{children}</div>
    </div>
  );
};
const Titles: React.FC<{fr: number}> = ({fr}) => {
  let i = 0; TITLED.forEach((e, j) => {if (fr >= E(e.k0)) i = j;});
  const e = TITLED[i], fg = e.fg ?? INK;
  const [l1, l2] = e.title.split('|');
  const suffix = e.year.slice(4);
  return (
    <AbsoluteFill style={{opacity: interpolate(fr, [E(58) - 6, E(58) + 2], [1, 0], clamp)}}>
      <div style={{position: 'absolute', left: 60, top: 54, display: 'flex', alignItems: 'center', gap: 22, fontFamily: MONO, fontWeight: 500, fontSize: 26, color: fg}}>
        <span>{String(i + 1).padStart(2, '0')}<span style={{opacity: 0.45}}> / {TITLED.length}</span></span>
        <div style={{display: 'flex', gap: 6}}>
          {TITLED.map((_, j) => (
            <div key={j} style={{width: 34, height: 6, borderRadius: 3, background: fg, opacity: j < i ? 0.9 : j === i ? 1 : 0.18,
              transform: j === i ? `scaleX(${ease(fr, E(e.k0), E(e.k0) + 12, OUT)})` : undefined, transformOrigin: 'left center'}} />
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 52, top: 100, display: 'flex', alignItems: 'flex-end', gap: 14}}>
        <Odometer fr={fr} i={i} color={fg} />
        {suffix ? <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 34, color: fg, marginBottom: 24, opacity: ease(fr, E(e.k0) + 6, E(e.k0) + 16)}}>{suffix}</div> : null}
      </div>
      <div style={{position: 'absolute', left: 60, top: 262}}>
        <MaskLine fr={fr} k0={e.k0} k1={e.k1} delay={0} h={104}>
          <div style={{fontFamily: ARCH, fontSize: 96, lineHeight: '104px', letterSpacing: -3, color: fg, whiteSpace: 'nowrap'}}>{l1}</div>
        </MaskLine>
        {l2 ? (
          <MaskLine fr={fr} k0={e.k0} k1={e.k1} delay={4} h={124}>
            <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 128, lineHeight: '120px', letterSpacing: -2, color: fg, whiteSpace: 'nowrap'}}>{l2}</div>
          </MaskLine>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
const Seasons: React.FC<{fr: number}> = ({fr}) => (
  <>
    {ERAS.map((e, i) => {
      const prev = i ? ERAS[i - 1].band ?? PAPER : PAPER, cur = e.band ?? PAPER;
      if (prev === cur || fr < E(e.k0) - 8 || fr >= E(e.k1) + 8) return null;
      const w = ease(fr, E(e.k0) - 8, E(e.k0) + 6, INOUT);
      return <AbsoluteFill key={e.k0} style={{background: cur, clipPath: `inset(0 0 0 ${(1 - w) * 100}%)`}} />;
    })}
  </>
);
const bandAt = (b: number) => eraAt(b).band ?? PAPER;

// ---------- today ----------
const Today: React.FC<{fr: number}> = ({fr}) => {
  const head = (k: number) => ease(fr, E(k), E(k) + 12, OUT);
  return (
    <AbsoluteFill>
      {[{t: 'EVERY ERA.', k: 58.5, y: 110}, {t: 'ONE APP.', k: 59.5, y: 222}].map((w, i) => (
        <div key={w.t} style={{position: 'absolute', left: 60, top: w.y, opacity: head(w.k), transform: `translateY(${(1 - head(w.k)) * 50}px)`}}>
          <span style={{fontFamily: ARCH, fontSize: 112, lineHeight: 1, letterSpacing: -4, color: INK, backgroundImage: i ? `linear-gradient(transparent 62%, ${DOT_GREEN} 62%, ${DOT_GREEN} 92%, transparent 92%)` : undefined}}>{w.t}</span>
        </div>
      ))}
      <div style={{position: 'absolute', left: 62, top: 352, opacity: head(61), fontFamily: MONO, fontWeight: 500, fontSize: 28, color: GREY}}>Every coin in this film trades on Hotcoin</div>
      {ALL_COINS.map((coin, i) => {
        const k = 59 + i * 0.12, p = fr < E(k) ? 0 : sp(fr - E(k), 11, 280);
        if (p <= 0) return null;
        const col = i % 6, row = Math.floor(i / 6);
        const x = 60 + col * 160 + (row === 3 ? 160 : 0), y = 430 + row * 178;
        return (
          <div key={coin.t} style={{position: 'absolute', left: x, top: y, width: 160, textAlign: 'center', transform: `scale(${p})`}}>
            <div style={{display: 'inline-block'}}><Logo coin={coin} size={112} /></div>
            <div style={{fontFamily: ARCH, fontSize: 26, color: INK, marginTop: 10}}>{coin.t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- end: ink takes over from the head, the line runs into the logo's dot ----------
const End: React.FC<{fr: number; from: {x: number; y: number}}> = ({fr, from}) => {
  const wipe = ease(fr, E(66), E(66) + 26, IN);
  const move = ease(fr, E(66.5), E(68), INOUT);
  const hx = from.x + (DOT.x - from.x) * move, hy = from.y + (DOT.y - from.y) * move;
  const tail = -40 + (hx + 40) * ease(fr, E(68), E(68) + 26, IN);
  const r = interpolate(fr, [E(68), E(68) + 30], [15, DOT.r], {...clamp, easing: OUT});
  const logo = ease(fr, E(69), E(69) + 30, OUT);
  const dotOut = interpolate(fr, [E(70), E(70) + 14], [1, 0], clamp);
  const url = ease(fr, E(70), E(70) + 14), risk = ease(fr, E(70.5), E(70.5) + 14);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: INK, clipPath: `circle(${wipe * 1800}px at ${from.x}px ${from.y}px)`}} />
      {fr >= E(66) ? (
        <svg width={1080} height={1350} style={{position: 'absolute', inset: 0, opacity: dotOut}}>
          {hx - tail > 1 ? <line x1={tail} y1={hy} x2={hx} y2={hy} stroke={DOT_GREEN} strokeWidth={12} strokeLinecap="round" /> : null}
          <circle cx={hx} cy={hy} r={r} fill={DOT_GREEN} />
        </svg>
      ) : null}
      <Img src={staticFile('brand/logo.png')} style={{position: 'absolute', left: LOGO_X, top: LOGO_Y, width: LOGO_W, height: (LOGO_W * 93) / 485, clipPath: `inset(0 ${(1 - logo) * 100}% 0 0)`}} />
      <div style={{position: 'absolute', top: 800, width: 1080, textAlign: 'center', opacity: url, transform: `translateY(${(1 - url) * 16}px)`, fontFamily: MONO, fontWeight: 500, fontSize: 38, color: '#F1EFE8'}}>hotcoin.com</div>
      <div style={{position: 'absolute', top: 1222, width: 1080, textAlign: 'center', opacity: risk * 0.8, fontFamily: MONO, fontSize: 22, color: GREY}}>Trading involves risk. Memecoins are highly volatile.</div>
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{k: number; file: string; vol: number}> = ({k, file, vol}) => (
  <Sequence from={Math.max(0, E(k) - 1)} durationInFrames={120} layout="none"><Audio src={staticFile(file)} volume={vol} /></Sequence>
);

const beatOf = (fr: number) => Math.max(0, (fr + 2) / BEAT);
const surge = (b: number) => Math.floor(b) + OUT(Math.min(1, (b - Math.floor(b)) / 0.5));
const headScreen = (fr: number) => {
  const b = beatOf(fr), bs = surge(b);
  return {x: X(bs) - X(b) + HEAD_X, y: Y(bs) - camY(b) + LINE_Y + interpolate(b, [58, 59.2], [0, 400], {...clamp, easing: INOUT})};
};

export const Meme: React.FC = () => {
  useFonts();
  const fr = useCurrentFrame();
  const b = beatOf(fr);
  const bs = Math.min(surge(b), 66);
  return (
    <AbsoluteFill style={{background: bandAt(Math.max(0, beatOf(fr) - 0.6))}}>
      <Seasons fr={fr} />
      {fr < E(68) ? <World fr={fr} b={Math.min(b, 66)} bs={bs} /> : null}
      {fr < E(58) + 10 ? <Titles fr={fr} /> : null}
      {b >= 58 && fr < E(67) ? <Today fr={fr} /> : null}
      {fr >= E(66) - 1 ? <End fr={fr} from={headScreen(E(66))} /> : null}
      <Audio src={staticFile('music/head-bang.mp3')} trimBefore={Math.round(MUSIC_START_S * 60)}
        volume={(f) => interpolate(f, [0, 3, at(71), MEME_DURATION], [0, 0.9, 0.9, 0], clamp)} />
      {ALL_COINS.map((coin) => <Sfx key={coin.t} k={coin.k} file="sfx/mechanical/snap.mp3" vol={0.22} />)}
      <Sfx k={15} file="sfx/foley/swell.wav" vol={0.35} />
      <Sfx k={16} file="sfx/foley/thump.wav" vol={0.7} />
      {[50, 53, 56].map((k) => <Sfx key={k} k={k - 0.6} file="sfx/foley/whoosh.wav" vol={0.35} />)}
      <Sfx k={66} file="sfx/foley/whoosh.wav" vol={0.4} />
      <Sfx k={68} file="sfx/foley/hit.wav" vol={0.6} />
    </AbsoluteFill>
  );
};
