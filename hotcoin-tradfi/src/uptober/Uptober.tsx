// "Uptober", a paper-collage explainer in the Vox style. 4:5, 30 fps, about 95 s.
// Narration: Kokoro TTS (af_heart), scripts/make-vo.py. Music: "Curiosity" (Mixkit, free licence), 80 BPM.
// Data: Coin Metrics community API, BTC daily reference rate; monthly return = month-end close vs previous month-end close.
// News: CME Group press release (31 Oct 2017), Reuters/Al Jazeera (PayPal, 21 Oct 2020), ProShares BITO debut (19 Oct 2021),
// CJEU VAT ruling (22 Oct 2015), Silk Road seizure (2 Oct 2013), Xi blockchain remarks (25 Oct 2019), Oct 10 2025 liquidations.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {IN, INOUT, OUT, clamp, ease, sp} from '../alt/kit';

const FPS = 30;
const PAPER = '#EDE7DA', INK = '#1B1A17', RED = '#D9442B', GREEN = '#2F8A4C', HIGHLIGHT = '#FFE14D', MUTED = '#6E675C';
const HEAD = 'Anton, sans-serif', SERIF = '"Instrument Serif", serif', MONO = '"IBM Plex Mono", monospace', SANS = '"Inter Tight", sans-serif';

// ---------- timing: each narration line starts on the music's beat grid (80 BPM, first beat 0.04 s) ----------
const VO: [string, number, string][] = [
  ['hook', 2.859, 'Every October, crypto Twitter says the same word.'],
  ['word', 1.088, 'Uptober.'],
  ['real', 5.227, 'But is it real? Or just a meme? We pulled every Bitcoin October since 2013.'],
  ['stat', 4.693, 'Ten out of thirteen closed green. The average gain: almost 20%.'],
  ['spark', 1.6, 'And most of them had a spark.'],
  ['y2013', 10.667, '2013. The FBI shut down Silk Road, and Bitcoin fell 20% in hours. Then demand from China took over. October closed up 61%.'],
  ['y2017', 6.912, '2017. On Halloween, CME announced Bitcoin futures. Wall Street was coming. Up 48%.'],
  ['y2019', 6.357, "2019. China's leadership embraced blockchain, and Bitcoin jumped more than 40% in a day."],
  ['y2020', 4.203, '2020. PayPal let its users buy Bitcoin. Up 28%.'],
  ['y2021', 7.445, '2021. The first US Bitcoin ETF started trading, and Bitcoin hit a new all-time high. Up 40%.'],
  ['y2023', 6.379, "2023. Wall Street's biggest asset managers lined up for spot ETFs. Up 28%."],
  ['y2025', 9.067, '2025 broke the streak. A tariff shock wiped out $19 billion of leveraged bets in a single day. October closed red.'],
  ['which', 1.92, 'So which month is actually the best?'],
  ['nov', 3.947, 'November has the biggest average, mostly thanks to one wild year.'],
  ['oct', 4.309, 'But the most reliable? October. The highest typical gain of any month.'],
  ['end', 5.269, "History rhymes. It doesn't promise. Whatever this October brings, be ready on Hotcoin."],
];
const BEAT = 0.75, BEAT0 = 0.04;
const snap = (t: number) => BEAT0 + Math.ceil((t - BEAT0) / BEAT - 1e-6) * BEAT;
const T: Record<string, {s: number; e: number; text: string}> = {};
{
  let t = 0.6;
  VO.forEach(([id, dur, text], i) => {
    const s = i === 0 ? t : snap(t);
    T[id] = {s, e: s + dur, text};
    t = s + dur + (id.startsWith('y') ? 0.45 : 0.25);
  });
}
const f = (sec: number) => Math.round(sec * FPS);
const S = (id: string) => f(T[id].s), Ee = (id: string) => f(T[id].e);
export const UPTOBER_DURATION = f(T.end.e + 4.2);

// ---------- data (Coin Metrics, computed 2 Oct 2026) ----------
const OCT: [number, number][] = [[2013, 61.2], [2014, -13.4], [2015, 32.7], [2016, 14.8], [2017, 48.3], [2018, -4.5], [2019, 10.5], [2020, 28.2], [2021, 40.3], [2022, 5.4], [2023, 28.4], [2024, 11.2], [2025, -3.9]];
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const AVG = [3.4, 11.2, 12.2, 12.2, 9.0, -2.1, 7.9, 2.7, -2.5, 19.9, 41.4, 4.0];
const MEDIAN = [0.4, 11.7, -0.1, 10.0, 3.1, -0.7, 8.0, -7.5, -2.4, 14.8, 8.9, -3.4];

// ---------- fonts ----------
const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['400 80px Anton', 'italic 400 80px "Instrument Serif"', '400 80px "Instrument Serif"', '500 24px "IBM Plex Mono"', '400 24px "IBM Plex Mono"', '500 30px "Inter Tight"', '600 30px "Inter Tight"']
      .map((s) => document.fonts.load(s))).then(() => continueRender(h));
  }, [h]);
};

// ---------- hand-made motion: positions step every 3 frames like stop-motion paper ----------
const jit = (fr: number, seed: number, amp = 1.6) => {
  const n = Math.floor(fr / 3) + seed * 13;
  const r = (k: number) => {const x = Math.sin(n * 12.9898 + k * 78.233 + seed) * 43758.5453; return x - Math.floor(x) - 0.5;};
  return {x: r(1) * amp, y: r(2) * amp, r: r(3) * amp * 0.25};
};
const torn = (seed: number, n = 18, depth = 1.6) => {
  const r = (k: number) => {const x = Math.sin(k * 91.7 + seed * 17.3) * 43758.5; return x - Math.floor(x);};
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${r(i) * depth}%`);
  for (let i = 0; i <= n; i++) pts.push(`${100 - r(i + 40) * depth}% ${(i / n) * 100}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${100 - r(i + 80) * depth}%`);
  for (let i = n; i >= 0; i--) pts.push(`${r(i + 120) * depth}% ${(i / n) * 100}%`);
  return `polygon(${pts.join(',')})`;
};
const enter = (fr: number, at: number, d = 12, st = 170) => (fr < at ? 0 : sp(fr - at, d, st));

// ---------- primitives ----------
const Tape: React.FC<{x: number; y: number; r: number; w?: number}> = ({x, y, r, w = 150}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: 44, transform: `rotate(${r}deg)`, background: 'rgba(250,245,225,0.62)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.12)', clipPath: 'polygon(2% 0,98% 6%,100% 94%,0 100%)'}} />
);
const Highlight: React.FC<{p: number; children: React.ReactNode; color?: string}> = ({p, children, color = HIGHLIGHT}) => (
  <span style={{backgroundImage: `linear-gradient(100deg, ${color} 0%, ${color} 100%)`, backgroundRepeat: 'no-repeat', backgroundSize: `${p * 100}% 78%`, backgroundPosition: '0 70%', padding: '0 4px'}}>{children}</span>
);
// A red-pen loop drawn around a box (SVG path with stroke draw-on).
const PenCircle: React.FC<{x: number; y: number; w: number; h: number; p: number; color?: string; sw?: number}> = ({x, y, w, h, p, color = RED, sw = 6}) => {
  const cx = w / 2, cy = h / 2, pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = -Math.PI * 0.6 + (i / 64) * Math.PI * 2.15, wob = 1 + 0.04 * Math.sin(i * 1.7);
    pts.push(`${(cx + Math.cos(a) * cx * wob).toFixed(1)},${(cy + Math.sin(a) * cy * wob * 1.02).toFixed(1)}`);
  }
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.92} />
    </svg>
  );
};
const Clipping: React.FC<{x: number; y: number; w: number; r: number; seed: number; kicker: string; head: React.ReactNode; src: string; p: number; fr: number}> = ({x, y, w, r, seed, kicker, head, src, p, fr}) => {
  const j = jit(fr, seed, 1.2);
  return p <= 0 ? null : (
    <div style={{position: 'absolute', left: x + j.x, top: y + j.y - (1 - Math.min(1, p)) * 60, width: w, transform: `rotate(${r + j.r + (1 - Math.min(1, p)) * 6}deg) scale(${0.92 + 0.08 * Math.min(1, p)})`, opacity: Math.min(1, p * 3),
      filter: 'drop-shadow(0 10px 14px rgba(40,30,10,0.28))'}}>
      <div style={{background: '#F8F4EA', clipPath: torn(seed), padding: '34px 36px 30px'}}>
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 19, letterSpacing: 2, color: MUTED, borderBottom: `2px solid ${INK}`, paddingBottom: 10, marginBottom: 16}}>{kicker}</div>
        <div style={{fontFamily: SERIF, fontSize: 50, lineHeight: 1.04, color: INK}}>{head}</div>
        <div style={{fontFamily: MONO, fontSize: 18, color: MUTED, marginTop: 16}}>{src}</div>
      </div>
      <Tape x={w / 2 - 75} y={-20} r={-4 + seed % 5} />
    </div>
  );
};
const Photo: React.FC<{name: string; x: number; y: number; w: number; h: number; r: number; seed: number; p: number; fr: number; pos?: string}> = ({name, x, y, w, h, r, seed, p, fr, pos = 'center'}) => {
  const j = jit(fr, seed + 3, 1);
  return p <= 0 ? null : (
    <div style={{position: 'absolute', left: x + j.x + (1 - Math.min(1, p)) * -80, top: y + j.y, width: w, height: h, transform: `rotate(${r + j.r}deg)`, opacity: Math.min(1, p * 2.5),
      filter: 'drop-shadow(0 12px 16px rgba(40,30,10,0.25))'}}>
      <div style={{width: '100%', height: '100%', clipPath: torn(seed + 9, 14, 2.2), background: '#E6DFCF', overflow: 'hidden'}}>
        <Img src={staticFile(`uptober/photos/${name}-ht.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, mixBlendMode: 'multiply'}} />
      </div>
    </div>
  );
};
const Stamp: React.FC<{x: number; y: number; text: string; color: string; p: number; r?: number; size?: number}> = ({x, y, text, color, p, r = -8, size = 120}) =>
  p <= 0 ? null : (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${r}deg) scale(${1.6 - 0.6 * Math.min(1, p)})`, opacity: Math.min(1, p * 2), transformOrigin: 'center'}}>
      <div style={{fontFamily: HEAD, fontSize: size, lineHeight: 1, color, border: `6px solid ${color}`, borderRadius: 14, padding: '6px 22px 2px', mixBlendMode: 'multiply',
        WebkitMaskImage: 'radial-gradient(circle at 30% 40%, #000 55%, rgba(0,0,0,0.75) 70%, #000 85%)'}}>{text}</div>
    </div>
  );

// ---------- scenes ----------
const Calendar: React.FC<{fr: number}> = ({fr}) => {
  const p = enter(fr, S('hook') - 4, 13, 160), j = jit(fr, 2, 1.4);
  const bubbles = ['uptober is here', 'UPTOBER.', 'its uptober szn', 'see you at ATH, uptober'];
  const stamp = enter(fr, S('word'), 9, 260);
  return (
    <>
      <div style={{position: 'absolute', left: 250 + j.x, top: 300 + j.y - (1 - p) * 700, width: 580, transform: `rotate(${-3 + j.r}deg)`, filter: 'drop-shadow(0 18px 22px rgba(40,30,10,0.3))'}}>
        <div style={{background: RED, height: 120, borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 84, color: PAPER, letterSpacing: 6}}>OCTOBER</div>
        <div style={{background: '#F8F4EA', height: 470, borderRadius: '0 0 10px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 340, color: INK}}>1</div>
        {[150, 400].map((x) => <div key={x} style={{position: 'absolute', left: x, top: -26, width: 26, height: 64, borderRadius: 13, background: '#3A372F'}} />)}
      </div>
      {bubbles.map((b, i) => {
        const bp = enter(fr, S('hook') + 12 + i * 10, 10, 220);
        const pos = [[70, 210], [700, 330], [90, 860], [610, 900]][i];
        return bp > 0 ? (
          <div key={b} style={{position: 'absolute', left: pos[0], top: pos[1], transform: `scale(${bp}) rotate(${[-4, 5, 3, -5][i]}deg)`, fontFamily: SANS, fontWeight: 500, fontSize: 30, color: INK,
            background: '#FFFFFF', padding: '14px 22px', borderRadius: 26, boxShadow: '0 6px 14px rgba(40,30,10,0.18)'}}>{b}</div>
        ) : null;
      })}
      <Stamp x={150} y={560} text="UPTOBER" color={RED} p={stamp} r={-9} size={190} />
    </>
  );
};

const ChartOct: React.FC<{fr: number; mini: number}> = ({fr, mini}) => {
  // Graph-paper bar chart of every October. `mini` (0 to 1) shrinks it into the year strip used through the history section.
  const x0 = 110, y0 = 860, colW = 66, scale = 6.2;
  const titleP = enter(fr, S('real') + f(2.6), 12, 180);
  const big = 1 - mini;
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateY(${-mini * 700}px) scale(${1 - mini * 0.35})`, transformOrigin: '540px 0px', opacity: 1 - mini * 0.0}}>
      <div style={{position: 'absolute', left: 70, top: 300, width: 940, height: 720, opacity: titleP * big, background: '#F5F1E6',
        backgroundImage: 'linear-gradient(rgba(60,90,120,0.13) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(60,90,120,0.13) 1.5px, transparent 1.5px)', backgroundSize: '40px 40px',
        boxShadow: '0 14px 26px rgba(40,30,10,0.18)', transform: `rotate(${-0.8 + jit(fr, 5, 1).r}deg)`}} />
      <div style={{position: 'absolute', left: 110, top: 330, opacity: titleP * big, fontFamily: MONO, fontWeight: 500, fontSize: 24, color: MUTED, letterSpacing: 1}}>BITCOIN IN OCTOBER · MONTHLY RETURN</div>
      <div style={{position: 'absolute', left: 110, top: 368, opacity: titleP * big, fontFamily: SERIF, fontSize: 64, color: INK}}>Every October since 2013</div>
      <div style={{position: 'absolute', left: x0 - 20, top: y0, width: 13 * colW + 30, height: 3, background: INK, opacity: titleP}} />
      {OCT.map(([yr, v], i) => {
        const bp = ease(fr, S('stat') + i * 3, S('stat') + i * 3 + 14, OUT);
        const h = Math.abs(v) * scale * bp;
        const col = v >= 0 ? GREEN : RED;
        return (
          <React.Fragment key={yr}>
            <div style={{position: 'absolute', left: x0 + i * colW + 8, top: v >= 0 ? y0 - h : y0 + 3, width: colW - 16, height: h, background: col, opacity: 0.9,
              borderRadius: v >= 0 ? '4px 4px 0 0' : '0 0 4px 4px'}} />
            <div style={{position: 'absolute', left: x0 + i * colW - 6, width: colW + 12, textAlign: 'center', top: v >= 0 ? y0 - h - 34 : y0 + h + 8, opacity: bp * big,
              fontFamily: MONO, fontWeight: 500, fontSize: 17, color: col}}>{v > 0 ? '+' : ''}{Math.round(v)}%</div>
            <div style={{position: 'absolute', left: x0 + i * colW - 6, width: colW + 12, textAlign: 'center', top: y0 + 120, opacity: titleP,
              fontFamily: MONO, fontSize: 19, color: INK}}>'{String(yr).slice(2)}</div>
          </React.Fragment>
        );
      })}
      {big > 0.02 ? (
        <>
          <div style={{position: 'absolute', left: 120, top: 1050, opacity: enter(fr, S('stat') + f(0.2)) * big, fontFamily: SERIF, fontSize: 64, color: INK}}>
            <Highlight p={ease(fr, S('stat') + f(0.4), S('stat') + f(1.2))}>10 of 13 green</Highlight>
          </div>
          <div style={{position: 'absolute', left: 120, top: 1130, opacity: enter(fr, S('stat') + f(2.4)) * big, fontFamily: SERIF, fontSize: 64, color: INK}}>
            average <Highlight p={ease(fr, S('stat') + f(2.6), S('stat') + f(3.4))}>+19.9%</Highlight>
          </div>
          {[1, 5, 12].map((i, k) => (
            <PenCircle key={i} x={x0 + i * colW - 4} y={y0 - 26} w={colW + 8} h={140} p={ease(fr, S('stat') + f(1.2) + k * 6, S('stat') + f(1.2) + k * 6 + 14)} />
          ))}
        </>
      ) : null}
    </div>
  );
};

type Year = {id: string; yr: number; ret: number; photo: string; pos?: string; kicker: string; head: React.ReactNode; src: string; note?: string};
const YEARS: Year[] = [
  {id: 'y2013', yr: 2013, ret: 61.2, photo: 'y2013', kicker: 'OCT 2, 2013', head: <>FBI shuts down Silk Road. Bitcoin drops <b>20%</b> in hours.</>, src: 'Widely reported, Oct 2, 2013', note: 'then: demand from China'},
  {id: 'y2017', yr: 2017, ret: 48.3, photo: 'y2017', kicker: 'OCT 31, 2017', head: <>CME Group announces <b>bitcoin futures</b>.</>, src: 'CME Group press release, Oct 31, 2017', note: 'Wall Street is coming'},
  {id: 'y2019', yr: 2019, ret: 10.5, photo: 'y2019', kicker: 'OCT 25, 2019', head: <>China's leadership calls for faster <b>blockchain</b> adoption.</>, src: 'Widely reported, Oct 25 to 26, 2019', note: 'BTC +42% intraday, Oct 26'},
  {id: 'y2020', yr: 2020, ret: 28.2, photo: 'y2020', pos: '50% 60%', kicker: 'OCT 21, 2020', head: <>PayPal opens <b>crypto buying</b> to its users.</>, src: 'Reuters, Oct 21, 2020'},
  {id: 'y2021', yr: 2021, ret: 40.3, photo: 'y2021', kicker: 'OCT 19, 2021', head: <>First US <b>bitcoin ETF</b> starts trading.</>, src: 'ProShares BITO, NYSE, Oct 19, 2021', note: 'new all-time high, Oct 20'},
  {id: 'y2023', yr: 2023, ret: 28.4, photo: 'y2023', kicker: 'OCTOBER 2023', head: <>Spot bitcoin <b>ETF hopes</b> lift crypto.</>, src: 'BlackRock fund appears on DTCC list, Oct 2023'},
  {id: 'y2025', yr: 2025, ret: -3.9, photo: 'y2025', kicker: 'OCT 10, 2025', head: <>Tariff shock. About <b>$19B</b> in crypto liquidations in a day.</>, src: 'Widely reported, Oct 10 to 11, 2025', note: 'first red October since 2018'},
];
const YearScene: React.FC<{fr: number; y: Year; i: number}> = ({fr, y, i}) => {
  const s = S(y.id), e = Ee(y.id);
  const yrP = enter(fr, s, 12, 220), photoP = enter(fr, s + 6, 13, 170), clipP = enter(fr, s + f(1.1), 12, 170);
  const hl = ease(fr, s + f(1.8), s + f(2.6));
  const stampP = enter(fr, e - f(1.5), 9, 260);
  const noteP = y.note ? enter(fr, s + f(y.id === 'y2013' ? 5.2 : 3.4), 11, 220) : 0;
  const neg = y.ret < 0, flip = i % 2 === 1;
  const j = jit(fr, i + 20, 1.5);
  return (
    <>
      <div style={{position: 'absolute', left: (flip ? 1010 - 560 : 70) + j.x, top: 190 + j.y - (1 - Math.min(1, yrP)) * 80, width: 560, textAlign: flip ? 'right' : 'left', opacity: Math.min(1, yrP * 2),
        fontFamily: HEAD, fontSize: 230, lineHeight: 1, color: INK, letterSpacing: -2}}>{y.yr}</div>
      <Stamp x={flip ? 90 : 640} y={250} text={`OCT ${neg ? '' : '+'}${y.ret.toFixed(1)}%`.replace('-', '\u2212')} color={neg ? RED : GREEN} p={stampP} r={flip ? -6 : 6} size={78} />
      <Photo name={y.photo} x={flip ? 70 : 130} y={470} w={880} h={420} r={flip ? -2 : 2} seed={i * 7 + 1} p={photoP} fr={fr} pos={y.pos} />
      <Clipping x={flip ? 90 : 370} y={800} w={620} r={flip ? 2 : -2} seed={i * 5 + 2} fr={fr} p={clipP} kicker={y.kicker} src={y.src}
        head={<span style={{backgroundImage: `linear-gradient(${HIGHLIGHT}, ${HIGHLIGHT})`, backgroundRepeat: 'no-repeat', backgroundSize: `${hl * 100}% 40%`, backgroundPosition: '0 85%'}}>{y.head}</span>} />
      {noteP > 0 ? (
        <div style={{position: 'absolute', left: flip ? 700 : 60, top: 840, transform: `rotate(${flip ? 5 : -5}deg) scale(${Math.min(1.05, noteP)})`, width: 300, background: '#FFE97A', padding: '20px 22px',
          boxShadow: '0 10px 16px rgba(40,30,10,0.22)', fontFamily: SERIF, fontStyle: 'italic', fontSize: 38, lineHeight: 1.05, color: INK}}>{y.note}</div>
      ) : null}
    </>
  );
};

const YearStrip: React.FC<{fr: number; on: number}> = ({fr, on}) => {
  // The 13 Octobers as a strip of year chips across the top; the current year gets a red pen loop.
  const active = YEARS.findIndex((y) => fr >= S(y.id) - 4 && fr < Ee(y.id) + f(0.5));
  return (
    <div style={{position: 'absolute', left: 60, top: 96, width: 960, height: 70, display: 'flex', justifyContent: 'space-between', opacity: on}}>
      {OCT.map(([yr, v]) => {
        const cur = active >= 0 && YEARS[active].yr === yr;
        return (
          <div key={yr} style={{width: 66, textAlign: 'center', position: 'relative'}}>
            <div style={{height: 10, borderRadius: 3, background: v >= 0 ? GREEN : RED, opacity: cur ? 1 : 0.45}} />
            <div style={{fontFamily: MONO, fontWeight: cur ? 500 : 400, fontSize: 19, color: cur ? INK : MUTED, marginTop: 8}}>'{String(yr).slice(2)}</div>
            {cur ? <PenCircle x={-6} y={-12} w={78} h={70} p={ease(fr, S(YEARS[active].id), S(YEARS[active].id) + 12)} sw={4} /> : null}
          </div>
        );
      })}
    </div>
  );
};

const Months: React.FC<{fr: number}> = ({fr}) => {
  // Average vs median by calendar month: November wins on average (2013 alone was +450.6%), October wins on the median.
  const p = enter(fr, S('which'), 13, 170);
  const m = ease(fr, S('oct'), S('oct') + 26, INOUT);
  const vals = AVG.map((a, i) => a + (MEDIAN[i] - a) * m);
  const x0 = 120, y0 = 940, cw = 72, k = 9.5;
  const label = m < 0.5 ? 'AVERAGE MONTHLY RETURN, 2013 TO 2026' : 'MEDIAN (TYPICAL) MONTHLY RETURN, 2013 TO 2026';
  return (
    <div style={{position: 'absolute', inset: 0, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 60}px)`}}>
      <div style={{position: 'absolute', left: 80, top: 250, fontFamily: SERIF, fontSize: 92, lineHeight: 1, color: INK}}>The best month?</div>
      <div style={{position: 'absolute', left: 84, top: 360, fontFamily: MONO, fontWeight: 500, fontSize: 22, color: MUTED, letterSpacing: 1}}>{label}</div>
      <div style={{position: 'absolute', left: x0 - 20, top: y0, width: 12 * cw + 30, height: 3, background: INK}} />
      {vals.map((v, i) => {
        const bp = ease(fr, S('which') + 8 + i * 2, S('which') + 22 + i * 2);
        const h = Math.min(Math.abs(v), 46) * k * bp;
        const hot = (i === 10 && m < 0.5) || (i === 9 && m >= 0.5);
        const col = v >= 0 ? (hot ? GREEN : '#7FA88A') : RED;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: x0 + i * cw + 9, top: v >= 0 ? y0 - h : y0 + 3, width: cw - 18, height: h, background: col, borderRadius: v >= 0 ? '4px 4px 0 0' : '0 0 4px 4px'}} />
            <div style={{position: 'absolute', left: x0 + i * cw - 4, width: cw + 8, textAlign: 'center', top: y0 + (v < 0 ? h + 10 : 12), fontFamily: MONO, fontWeight: hot ? 500 : 400, fontSize: 20, color: hot ? INK : MUTED}}>{MONTHS[i]}</div>
            {hot || Math.abs(v) > 11 ? (
              <div style={{position: 'absolute', left: x0 + i * cw - 14, width: cw + 28, textAlign: 'center', top: v >= 0 ? y0 - h - 34 : y0 + h + 38, opacity: bp, fontFamily: MONO, fontWeight: 500, fontSize: 18, color: col}}>
                {v > 0 ? '+' : ''}{v.toFixed(1)}%</div>
            ) : null}
          </React.Fragment>
        );
      })}
      {/* November's asterisk */}
      {(() => {
        const np = enter(fr, S('nov') + f(1.6), 11, 200) * (1 - m);
        return np > 0 ? (
          <div style={{position: 'absolute', left: 520, top: 470, transform: `rotate(-4deg) scale(${Math.min(1, np)})`, width: 420, background: '#FFE97A', padding: '20px 24px', boxShadow: '0 10px 16px rgba(40,30,10,0.22)',
            fontFamily: SERIF, fontStyle: 'italic', fontSize: 40, lineHeight: 1.08, color: INK}}>
            Nov 2013 alone: <b style={{fontStyle: 'normal', fontFamily: HEAD, fontWeight: 400}}>+450.6%</b><br />Without it: +7.3%
          </div>
        ) : null;
      })()}
      <PenCircle x={x0 + 9 * cw - 10} y={y0 - 14.8 * k * m - 70} w={cw + 20} h={14.8 * k + 110} p={ease(fr, S('oct') + f(1.4), S('oct') + f(2.2)) * m} />
      {m > 0.5 ? (
        <div style={{position: 'absolute', left: 80, top: 1060, opacity: enter(fr, S('oct') + f(1.8)), fontFamily: SERIF, fontSize: 70, color: INK}}>
          October: the <Highlight p={ease(fr, S('oct') + f(2.2), S('oct') + f(3))}>most reliable</Highlight> month.
        </div>
      ) : null}
    </div>
  );
};

const End: React.FC<{fr: number}> = ({fr}) => {
  const a = enter(fr, S('end'), 12, 180), b = enter(fr, S('end') + f(1.4), 12, 180), c = enter(fr, S('end') + f(3.0), 13, 170);
  return (
    <>
      <div style={{position: 'absolute', left: 80, top: 300, opacity: Math.min(1, a * 2), fontFamily: SERIF, fontSize: 110, lineHeight: 1, color: INK}}>History rhymes.</div>
      <div style={{position: 'absolute', left: 80, top: 420, opacity: Math.min(1, b * 2), fontFamily: SERIF, fontStyle: 'italic', fontSize: 110, lineHeight: 1, color: RED}}>It doesn't promise.</div>
      <div style={{position: 'absolute', left: 80, top: 640, opacity: Math.min(1, c * 2), transform: `translateY(${(1 - Math.min(1, c)) * 30}px)`}}>
        <Img src={staticFile('brand/logo-official-black.png')} style={{width: 420, height: (420 * 328) / 2003}} />
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 30, color: INK, marginTop: 24}}>Be ready this October · hotcoin.com</div>
      </div>
      <div style={{position: 'absolute', left: 80, top: 1010, width: 920, opacity: Math.min(1, c * 2) * 0.85, fontFamily: MONO, fontSize: 18, lineHeight: 1.5, color: MUTED}}>
        Past performance does not guarantee future results. Trading involves risk. Data: Coin Metrics BTC reference rate, month-end closes, Jan 2013 to Sep 2026.
        Headlines paraphrased from contemporary reports.
      </div>
    </>
  );
};

const Caption: React.FC<{fr: number}> = ({fr}) => {
  const line = VO.find(([id]) => fr >= S(id) && fr < Ee(id) + 6);
  if (!line || line[0] === 'word') return null;
  return (
    <div style={{position: 'absolute', left: 70, right: 70, bottom: 54, textAlign: 'center'}}>
      <span style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, lineHeight: 1.45, color: PAPER, background: 'rgba(27,26,23,0.86)', padding: '6px 14px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>{line[2]}</span>
    </div>
  );
};

const Sfx: React.FC<{at: number; file: string; vol: number}> = ({at, file, vol}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={90} layout="none"><Audio src={staticFile(file)} volume={vol} /></Sequence>
);

export const Uptober: React.FC = () => {
  useFonts();
  const fr = useCurrentFrame();
  const histStart = S('spark'), histEnd = Ee('y2025') + f(0.4);
  const mini = ease(fr, histStart + f(0.3), histStart + f(1.3), INOUT);
  const chartOn = fr >= S('real') && fr < histStart + f(1.5);
  const stripOn = interpolate(fr, [histStart + f(1.0), histStart + f(1.5), histEnd - 6, histEnd], [0, 1, 1, 0], clamp);
  const voiceAt = (frame: number) => VO.some(([id]) => frame >= S(id) - 4 && frame < Ee(id) + 4);
  const drift = 1 + fr * 0.00004;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <AbsoluteFill style={{transform: `scale(${drift})`}}>
        <Img src={staticFile('uptober/paper.jpg')} style={{position: 'absolute', inset: 0, width: 1080, height: 1350}} />
        {fr < S('real') + f(0.6) ? <AbsoluteFill style={{opacity: interpolate(fr, [S('real'), S('real') + f(0.6)], [1, 0], clamp)}}><Calendar fr={fr} /></AbsoluteFill> : null}
        {fr >= S('real') && fr < S('real') + f(2.6) ? (
          <div style={{position: 'absolute', left: 80, top: 520, opacity: enter(fr, S('real'), 12, 180) * interpolate(fr, [S('real') + f(2.2), S('real') + f(2.6)], [1, 0], clamp), fontFamily: SERIF, fontSize: 120, lineHeight: 1.0, color: INK}}>
            Real?<br /><span style={{fontStyle: 'italic', color: RED}}>Or a meme?</span>
          </div>
        ) : null}
        {chartOn ? <AbsoluteFill style={{opacity: interpolate(fr, [histStart, histStart + f(0.5)], [1, 0], clamp)}}><ChartOct fr={fr} mini={mini} /></AbsoluteFill> : null}
        {fr >= S('spark') && fr < S('y2013') + 4 ? (
          <div style={{position: 'absolute', left: 80, top: 560, opacity: enter(fr, S('spark') + 8, 12, 180) * interpolate(fr, [S('y2013') - 6, S('y2013')], [1, 0], clamp), fontFamily: SERIF, fontSize: 110, lineHeight: 1, color: INK}}>
            What lit<br />the <span style={{fontStyle: 'italic', color: RED}}>fuse?</span>
          </div>
        ) : null}
        <YearStrip fr={fr} on={stripOn} />
        {YEARS.map((y, i) => (fr >= S(y.id) - 2 && fr < Ee(y.id) + f(0.45) ? (
          <AbsoluteFill key={y.id} style={{opacity: interpolate(fr, [Ee(y.id) + f(0.2), Ee(y.id) + f(0.45)], [1, 0], clamp)}}><YearScene fr={fr} y={y} i={i} /></AbsoluteFill>
        ) : null))}
        {fr >= S('which') - 2 && fr < S('end') ? <AbsoluteFill style={{opacity: interpolate(fr, [S('end') - 8, S('end')], [1, 0], clamp)}}><Months fr={fr} /></AbsoluteFill> : null}
        {fr >= S('end') - 2 ? <End fr={fr} /> : null}
      </AbsoluteFill>
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'multiply', opacity: 0.16}} />
      <Caption fr={fr} />

      {VO.map(([id]) => (
        <Sequence key={id} from={S(id)} layout="none"><Audio src={staticFile(`uptober/vo/${id}.wav`)} volume={1} /></Sequence>
      ))}
      <Audio src={staticFile('uptober/curiosity.mp3')}
        volume={(fr2) => {
          const base = voiceAt(fr2) ? 0.2 : 0.42;
          return base * interpolate(fr2, [0, 6, UPTOBER_DURATION - f(2.5), UPTOBER_DURATION], [0, 1, 1, 0], clamp);
        }} />
      <Sfx at={S('hook') - 4} file="sfx/foley/whoosh.wav" vol={0.35} />
      <Sfx at={S('word')} file="sfx/foley/thump.wav" vol={0.7} />
      {YEARS.map((y) => <Sfx key={y.id} at={S(y.id) + f(1.0)} file="sfx/foley/whoosh.wav" vol={0.28} />)}
      {YEARS.map((y) => <Sfx key={y.id + 's'} at={Ee(y.id) - f(1.3)} file="sfx/foley/thump.wav" vol={0.45} />)}
    </AbsoluteFill>
  );
};
