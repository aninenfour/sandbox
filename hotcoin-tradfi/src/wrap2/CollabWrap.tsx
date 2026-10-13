// "That's a wrap": TOKEN2049 Singapore collab recap. 16:9, ~22 s at 124 BPM ("Deep Urban", Mixkit).
// Booth photos flash on the beat, the last one pulls back into a photo mosaic of the Hotcoin logo (same build as
// src/ascii/Snap.tsx), then the brands Hotcoin met appear on a soft moving gradient.
// Brand logos: each brand's own site icon (public/wrap2/logos, see FOOTAGE_CREDITS.md). Brands without a clean
// official icon are shown as names only.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {INOUT, OUT, clamp} from '../alt/kit';

export const WRAP2_FPS = 60;
const BEAT = 60 / 124;
const bt = (b: number) => b * BEAT;
// beats: photos flash 0-8, pull back 8-14, logo holds to the drop at 16, title, brands 22-38, end card 38-46
const B = {pull: 8, logo: 14, drop: 16, grid: 22, end: 38, out: 46};
export const WRAP2_DURATION = Math.round(bt(B.out) * WRAP2_FPS);
const DROP_IN_TRACK = 0.28 + 32 * BEAT; // bar 8 of "Deep Urban"

const INK = '#06080A', LIME = '#B8F26A', WHITE = '#F4F6F2', MUTED = 'rgba(244,246,242,0.62)';
const SANS = '"Inter Tight", sans-serif', MONO = '"JetBrains Mono", monospace';
const sm = (a: number, b: number, x: number) => {const k = Math.max(0, Math.min(1, (x - a) / (b - a))); return k * k * (3 - 2 * k);};
const rnd = (n: number) => {const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x);};
const kick = (t: number) => Math.exp(-((t / BEAT) % 1) * 7);

type Brand = {name: string; logo?: string; bg?: string; pad?: number; wordmark?: string};
const GROUPS: {label: string; brands: Brand[]}[] = [
  {label: 'MEDIA & CREATORS', brands: [{name: 'Cointelegraph', logo: 'cointelegraph'}, {name: 'BeInCrypto', logo: 'beincrypto'}, {name: 'MediaMetriqa', wordmark: 'mediametriqa-wordmark'}, {name: 'Global Blockchain Show', logo: 'globalblockchainshow', bg: '#fff', pad: 9}]},
  {label: 'GROWTH & ADS', brands: [{name: 'Magnetto', logo: 'magnetto'}, {name: 'Cointraffic', logo: 'cointraffic'}, {name: 'TaskOn', logo: 'taskon'}, {name: 'Similarweb', logo: 'similarweb', bg: '#fff'}]},
  {label: 'SPORTS, EVENTS & CREATIVE', brands: [{name: 'LALIGA', logo: 'laliga', bg: '#fff', pad: 7}, {name: 'Blockchain Life', logo: 'blockchainlife', bg: '#0d1b2a'}, {name: 'BROIDR', logo: 'broidr'}, {name: '937 Studio', logo: '937studio'}]},
  {label: 'PAYMENTS & INFRA', brands: [{name: 'Nium', logo: 'nium'}, {name: 'Hypermid', logo: 'hypermid', bg: '#fff', pad: 6}, {name: 'CardsPro', logo: 'cardspro'}, {name: 'Melbicom', logo: 'melbicom', bg: '#fff', pad: 9}]},
  {label: 'TRADING & COMPLIANCE', brands: [{name: 'Scorechain', logo: 'scorechain', bg: '#fff', pad: 4}, {name: 'Eightcap', logo: 'eightcap', bg: '#fff', pad: 9}, {name: 'SBI VC Trade', logo: 'sbivc', bg: '#fff'}, {name: 'TOKEN2049', logo: 'token2049', bg: '#fff'}]},
];
const FLASH = ['live/p4.jpg', 'live/p6.jpg', 'live/p11.jpg', 'live/p17.jpg', 'live/p14.jpg', 'live/p24.jpg', 'live/p26.jpg', 'ascii/hero2.jpg'];

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 80px "Inter Tight"', '500 30px "Inter Tight"', '400 30px "Inter Tight"', '500 16px "JetBrains Mono"', '700 16px "JetBrains Mono"'].map((f) => document.fonts.load(f)))
      .then(() => setTimeout(() => continueRender(h), 150));
  }, [h]);
};

// slow mesh-like gradient: big soft colour fields drifting over ink
const Mesh: React.FC<{t: number}> = ({t}) => {
  const blobs: [string, number, number, number, number][] = [
    // colour, x, y, radius (% of width), phase
    ['rgba(184,242,106,0.55)', 22, 78, 46, 0],
    ['rgba(32,178,140,0.55)', 78, 85, 52, 1.7],
    ['rgba(40,72,220,0.45)', 85, 18, 50, 3.1],
    ['rgba(126,194,90,0.35)', 12, 12, 40, 4.4],
    ['rgba(120,60,200,0.22)', 55, 40, 38, 5.6],
  ];
  return (
    <AbsoluteFill style={{background: INK}}>
      {blobs.map(([c, x, y, r, ph], i) => {
        const dx = 7 * Math.sin(t * 0.33 + ph), dy = 6 * Math.cos(t * 0.27 + ph * 1.3);
        return <AbsoluteFill key={i} style={{background: `radial-gradient(circle ${r * 19.2}px at ${x + dx}% ${y + dy}%, ${c}, rgba(0,0,0,0) 70%)`}} />;
      })}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,8,10,0.35) 0%, rgba(6,8,10,0) 40%, rgba(6,8,10,0.1) 100%)'}} />
    </AbsoluteFill>
  );
};

const Photos: React.FC<{t: number}> = ({t}) => {
  const k = Math.min(FLASH.length - 1, Math.floor(t / BEAT)), into = t - k * BEAT;
  return (
    <AbsoluteFill>
      <Img src={staticFile(FLASH[k])} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.1 - 0.08 * OUT(Math.min(1, into / BEAT))})`}} />
      <AbsoluteFill style={{background: '#fff', opacity: Math.max(0, 0.4 - into * 2.6)}} />
    </AbsoluteFill>
  );
};

// photos tile into the Hotcoin logo, the camera pulls back from one tile
const MC = 64;
const Mosaic: React.FC<{t: number}> = ({t}) => {
  const [grid, setGrid] = useState<{cells: {c: number; r: number; k: number}[]; rows: number} | null>(null);
  const [h] = useState(() => delayRender('logo grid'));
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const rows = Math.round(((MC * img.height) / img.width) * (4 / 3)) + 2;
      const cv = document.createElement('canvas'); cv.width = MC; cv.height = rows;
      const ctx = cv.getContext('2d')!; ctx.drawImage(img, 0, 1, MC, rows - 2);
      const d = ctx.getImageData(0, 0, MC, rows).data, cells: {c: number; r: number; k: number}[] = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < MC; c++) if (d[(r * MC + c) * 4 + 3] > 90) cells.push({c, r, k: cells.length});
      setGrid({cells, rows}); continueRender(h);
    };
    img.src = staticFile('brand/logo-official-white.png');
  }, [h]);
  if (!grid) return null;
  const TW = 1800 / MC, TH = TW * 0.75, ox = 60, oy = (1080 - grid.rows * TH) / 2;
  const focus = grid.cells.reduce((b, x) => (Math.abs(x.c - MC * 0.55) + Math.abs(x.r - grid.rows / 2) < Math.abs(b.c - MC * 0.55) + Math.abs(b.r - grid.rows / 2) ? x : b));
  const fx = ox + focus.c * TW + TW / 2, fy = oy + focus.r * TH + TH / 2;
  const local = t - bt(B.pull);
  const p = INOUT(Math.min(1, Math.max(0, local / bt(B.logo - B.pull))));
  const z = Math.exp(Math.log(1920 / TW) * (1 - p));
  const cx = fx + (960 - fx) * p, cy = fy + (540 - fy) * p;
  const hold = t - bt(B.logo);
  const scan = hold > 0 ? hold / bt(B.drop - B.logo) : -1; // one lime light across the logo before the drop
  const gone = t - bt(B.drop); // on the drop the tiles fall away into the gradient
  return (
    <AbsoluteFill style={{transform: `translate(${960 - cx}px, ${540 - cy}px) scale(${z})`, transformOrigin: `${cx}px ${cy}px`}}>
      {grid.cells.map(({c, r, k}) => {
        const isFocus = k === focus.k;
        const d = Math.hypot(c - focus.c, (r - focus.r) * 1.5) / MC;
        const st = bt(B.pull) + 0.1 + d * 1.4 + rnd(k) * 0.25;
        const vis = isFocus ? 1 : Math.max(0, Math.min(1, (t - st) / 0.15));
        const lit = scan >= 0 && scan <= 1.2 ? Math.max(0, 1 - Math.abs(c / MC - scan) * 9) : 0;
        const out = gone > 0 ? OUT(Math.min(1, Math.max(0, (gone - (c / MC) * 0.35 - rnd(k * 3) * 0.12) / 0.4))) : 0;
        return (
          <div key={k} style={{position: 'absolute', left: ox + c * TW + 0.5, top: oy + r * TH + 0.5, width: TW - 1, height: TH - 1, opacity: vis * (1 - out),
            transform: out > 0 ? `translateY(${out * 40}px) scale(${1 - out * 0.6})` : undefined, borderRadius: out * 6, overflow: 'hidden'}}>
            <Img src={staticFile(isFocus ? 'ascii/hero3.jpg' : `ascii/tiles/${String((k * 7) % 40).padStart(2, '0')}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            {lit > 0 ? <div style={{position: 'absolute', inset: 0, background: LIME, opacity: lit * 0.75, mixBlendMode: 'screen'}} /> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// text that rises in word by word with a soft blur
const Rise: React.FC<{t: number; at: number; text: string; style: React.CSSProperties; step?: number}> = ({t, at, text, style, step = 0.06}) => (
  <div style={style}>
    {text.split(' ').map((w, i) => {
      const p = OUT(Math.max(0, Math.min(1, (t - at - i * step) / 0.5)));
      return <span key={i} style={{display: 'inline-block', marginRight: '0.24em', opacity: p, transform: `translateY(${(1 - p) * 0.45}em)`, filter: `blur(${(1 - p) * 10}px)`}}>{w}</span>;
    })}
  </div>
);

const Chip: React.FC<{b: Brand; size: number}> = ({b, size}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.26, overflow: 'hidden', background: b.bg ?? 'transparent', flexShrink: 0,
    boxShadow: '0 6px 18px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <Img src={staticFile(`wrap2/logos/${b.logo}.png`)} style={{width: size - 2 * (b.pad ?? 0), height: size - 2 * (b.pad ?? 0), objectFit: 'contain'}} />
  </div>
);

const Title: React.FC<{t: number}> = ({t}) => {
  const local = t - bt(B.drop);
  const move = INOUT(sm(bt(B.grid - B.drop) - 0.55, bt(B.grid - B.drop), local)); // title docks to the top-left for the grid
  const fade = sm(bt(B.end) - 0.5, bt(B.end), t);
  const s = 1 - move * 0.6;
  return (
    <AbsoluteFill style={{opacity: 1 - fade}}>
      <div style={{position: 'absolute', left: 96, top: 380 - move * 300, transformOrigin: '0 0', transform: `scale(${s})`}}>
        <Rise t={t} at={bt(B.drop) - 0.05} text="TOKEN2049 SINGAPORE · 7 TO 8 OCT 2026" step={0.03}
          style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: LIME, opacity: 1 - move}} />
        <Rise t={t} at={bt(B.drop)} text="That's a wrap." step={0.09}
          style={{fontFamily: SANS, fontWeight: 600, fontSize: 210, letterSpacing: -9, lineHeight: 1, marginTop: 18 - move * 40, color: WHITE}} />
        <Rise t={t} at={bt(B.drop + 2)} text="Two days at the booth. Tons of meetings." step={0.05}
          style={{fontFamily: SANS, fontWeight: 400, fontSize: 44, color: MUTED, marginTop: 26, opacity: 1 - move}} />
      </div>
      <Rise t={t} at={bt(B.grid) - 0.1} text="Brands Hotcoin caught up with" step={0.05}
        style={{position: 'absolute', right: 96, top: 108, fontFamily: SANS, fontWeight: 500, fontSize: 30, color: MUTED}} />
    </AbsoluteFill>
  );
};

const CW = (1920 - 2 * 96 - 4 * 22) / 5;
const Grid: React.FC<{t: number}> = ({t}) => {
  const fade = sm(bt(B.end) - 0.5, bt(B.end), t);
  return (
    <div style={{position: 'absolute', left: 96, right: 96, top: 250, display: 'flex', gap: 22, opacity: 1 - fade, transform: `translateY(${-fade * 30}px)`}}>
      {GROUPS.map((g, gi) => {
        const at = bt(B.grid + 0.5 + gi * 1.5);
        const lp = OUT(Math.max(0, Math.min(1, (t - at) / 0.4)));
        return (
          <div key={g.label} style={{width: CW, display: 'flex', flexDirection: 'column', gap: 14}}>
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 16, letterSpacing: 2.5, color: LIME, height: 40, display: 'flex', alignItems: 'flex-end', paddingBottom: 6,
              borderBottom: `1px solid rgba(184,242,106,${0.5 * lp})`, opacity: lp, transform: `translateY(${(1 - lp) * 14}px)`}}>{g.label}</div>
            {g.brands.map((b, bi) => {
              const p = OUT(Math.max(0, Math.min(1, (t - at - 0.12 - bi * BEAT * 0.25) / 0.55)));
              return (
                <div key={b.name} style={{height: 142, borderRadius: 28, padding: '0 22px 0 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
                  background: 'linear-gradient(160deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))', border: '1px solid rgba(255,255,255,0.16)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.18)',
                  opacity: p, transform: `translateY(${(1 - p) * 36}px) scale(${0.94 + 0.06 * p})`, filter: `blur(${(1 - p) * 8}px)`}}>
                  {b.wordmark ? (
                    // brand's own wordmark (their site logo is a wordmark only), shown on white
                    <div style={{background: '#fff', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center'}}>
                      <Img src={staticFile(`wrap2/logos/${b.wordmark}.png`)} style={{height: 34, width: (34 * 606) / 99}} />
                    </div>
                  ) : (
                    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: b.name.length > 16 ? 28 : 31, letterSpacing: -0.7, whiteSpace: b.name.length > 16 ? 'normal' : 'nowrap', color: WHITE, lineHeight: 1.1}}>{b.name}</div>
                  )}
                  {b.logo ? <Chip b={b} size={72} /> : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const End: React.FC<{t: number}> = ({t}) => {
  const at = bt(B.end);
  const lp = OUT(Math.max(0, Math.min(1, (t - at - bt(2)) / 0.6)));
  const out = sm(bt(B.out) - 0.45, bt(B.out), t);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - out}}>
      <Rise t={t} at={at + 0.1} text="Solid announcements are coming." step={0.06}
        style={{fontFamily: SANS, fontWeight: 400, fontSize: 40, color: MUTED, textAlign: 'center'}} />
      <Rise t={t} at={at + 0.4} text="Which collab" step={0.08}
        style={{fontFamily: SANS, fontWeight: 600, fontSize: 124, letterSpacing: -5, lineHeight: 1.04, color: WHITE, textAlign: 'center', marginTop: 18}} />
      <Rise t={t} at={at + 0.6} text="should come first?" step={0.08}
        style={{fontFamily: SANS, fontWeight: 600, fontSize: 124, letterSpacing: -5, lineHeight: 1.04, color: LIME, textAlign: 'center'}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 70, opacity: lp, transform: `translateY(${(1 - lp) * 20}px)`}}>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 280, height: (280 * 328) / 2005}} />
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: 3, color: INK, background: LIME, padding: '9px 18px', borderRadius: 100}}>9 YEARS</div>
      </div>
    </AbsoluteFill>
  );
};

export const CollabWrap: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const t = f / WRAP2_FPS;
  const {durationInFrames} = useVideoConfig();
  const drop = t - bt(B.drop);
  const punch = drop > 0 && drop < bt(2) ? 1 + 0.02 * kick(drop) : 1;
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${punch})`}}><Mesh t={t} /></AbsoluteFill>
      {t < bt(B.pull) ? <Photos t={t} /> : null}
      {t >= bt(B.pull) && t < bt(B.drop) + 1.2 ? <Mosaic t={t} /> : null}
      {t >= bt(B.drop) - 0.1 && t < bt(B.end) ? <Title t={t} /> : null}
      {t >= bt(B.grid) && t < bt(B.end) ? <Grid t={t} /> : null}
      {t >= bt(B.end) ? <End t={t} /> : null}
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.1}} />
      <Audio src={staticFile('t49/deep-urban.mp3')} trimBefore={Math.round((DROP_IN_TRACK - bt(B.drop)) * WRAP2_FPS)}
        volume={(fr) => interpolate(fr, [0, 8, durationInFrames - 40, durationInFrames - 1], [0, 1, 1, 0], clamp)} />
      {FLASH.map((_, i) => <Sequence key={i} from={Math.round(bt(i) * WRAP2_FPS)} durationInFrames={20} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.2} /></Sequence>)}
    </AbsoluteFill>
  );
};
