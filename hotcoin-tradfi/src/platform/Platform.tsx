import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, interpolateColors, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, DISPLAY, MONO, useFontsReady} from '../alt/shared';
import {AnimatedGrain, Cursor, INOUT, IN, Key, MOVE, OUT, Slot, bump, clamp, ease, mix, pathAt} from '../alt/kit';
import {soundFor} from '../soundmap';
import {DesktopHome, DesktopTrade, PhoneMarkets, PhonePredict, TOAST, UI} from './ui';

// Hotcoin platform film. 4:5, 60 fps, 120 BPM: one beat is 30 frames, one bar is 120. 20 bars, 40 s.
// Music: "Your Breath" by Eugenio Mininni (Mixkit, free licence), measured 119.98 BPM; bars 28 to 48 of the track.
export const PLATFORM_DURATION = 2400;
const MUSIC_START_S = 56.488;

type Rect = {x: number; y: number; w: number; h: number; r: number};
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t), r: mix(a.r, b.r, t)});
const centered = (cx: number, cy: number, w: number, h: number, r: number): Rect => ({x: cx - w / 2, y: cy - h / 2, w, h, r});
const sp = (f: number, d = 16, s = 170) => spring({frame: f, fps: 60, config: {damping: d, stiffness: s}});
const keys = (f: number, fr: number[], v: number[]) => interpolate(f, fr, v, {...clamp, easing: INOUT});

// ---------------------------------------------------------------- devices on the stage (1080 x 1350 stage units)
const LAP_W = 900, LAP_H = 562.5, LAP_K = LAP_W / 1440;
const PH_W = 300, PH_H = 620, PH_K = PH_W / 390;
const PILL = centered(540, 701, 250, 70, 12);

const lapPose = (f: number) => ({
  cx: keys(f, [960, 1060, 1920, 2000], [540, 380, 380, 440]),
  cy: keys(f, [960, 1060, 1920, 2000], [701, 700, 700, 690]),
  s: keys(f, [960, 1060, 1920, 2000], [1, 0.8, 0.8, 0.86]),
});
const lapScreen = (f: number): Rect => {const p = lapPose(f); return centered(p.cx, p.cy, LAP_W * p.s, LAP_H * p.s, 14 * p.s);};
const phScreen = (f: number): Rect => {
  const cx = keys(f, [1060, 1920, 2000], [800, 800, 790]), cy = keys(f, [1060, 1920, 2000], [770, 770, 790]);
  return centered(cx, cy, PH_W, PH_H, 44);
};

// Screen space of a point inside the laptop UI (1440 x 900) or the phone UI (390 x 806).
const inLap = (f: number, x: number, y: number) => {const r = lapScreen(f); const k = r.w / 1440; return {x: r.x + x * k, y: r.y + y * k};};
const inPh = (f: number, x: number, y: number) => {const r = phScreen(f); const k = r.w / 390; return {x: r.x + x * k, y: r.y + y * k};};

// ---------------------------------------------------------------- timeline (frames)
const T = {
  pillClick: 30, hovers: [240, 300, 360, 420], etfClick: 480, trade: 600, futures: 720, spot: 810, buy: 870, toast: 905,
  toPhone: 960, tradfi: 1140, row: 1260, pill10: 1290, predict: 1440, up: 1500, flip: 1680, down: 1740,
  finale: 1920, chips: [2040, 2070, 2100, 2130], fold: 2190, endClick: 2290, end: 2300,
};
const scrollAt = (f: number) => (f < T.finale ? keys(f, [232, 262], [0, 470]) : 0);
const tradeMode = (f: number) => sp(f - T.futures - 2, 18, 240) - sp(f - T.spot - 2, 18, 240);

// ---------------------------------------------------------------- camera
const CAM: [number, number, number, number][] = [
  [0, 540, 700, 1], [232, 540, 700, 1], [262, 540, 735, 1.32], [470, 540, 735, 1.32], [520, 540, 705, 1.1],
  [640, 520, 705, 1.14], [700, 520, 705, 1.14], [740, 860, 650, 1.55], [930, 860, 650, 1.55], [990, 600, 720, 1],
  [1070, 600, 720, 1], [1110, 800, 770, 1.42], [1890, 800, 770, 1.42], [1950, 560, 740, 1], [2400, 560, 740, 1],
];
const camAt = (f: number) => {const fr = CAM.map((c) => c[0]); return {cx: keys(f, fr, CAM.map((c) => c[1])), cy: keys(f, fr, CAM.map((c) => c[2])), s: Math.exp(keys(f, fr, CAM.map((c) => Math.log(c[3]))))};};

// ---------------------------------------------------------------- pieces
const blurIn = (f: number, at: number) => ({filter: `blur(${interpolate(f - at, [0, 12], [8, 0], clamp)}px)`, opacity: interpolate(f - at, [0, 10], [0, 1], clamp)});

const Laptop: React.FC<{f: number; screen: Rect; bezel: number; base: number; children?: React.ReactNode; fill?: string}> = ({screen: r, bezel, base, children, fill = UI.bg}) => (
  <>
    {base > 0.01 && (
      <>
        <div style={{position: 'absolute', left: r.x + r.w / 2 - r.w * 0.62, top: r.y + r.h + bezel + 10, width: r.w * 1.24, height: 40 * base, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.28), rgba(0,0,0,0) 70%)'}} />
        <div style={{position: 'absolute', left: r.x + r.w / 2 - (r.w * 1.14) / 2, top: r.y + r.h + bezel - 1 + (1 - base) * 30, width: r.w * 1.14, height: (r.w / 900) * 20,
          clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)', background: 'linear-gradient(180deg, #E6E6E8 0%, #B9BABD 60%, #8E8F93 100%)'}}>
          <div style={{position: 'absolute', left: '44%', width: '12%', top: 0, height: '38%', borderRadius: '0 0 8px 8px', background: '#A5A6AA'}} />
        </div>
      </>
    )}
    <div style={{position: 'absolute', left: r.x - bezel, top: r.y - bezel, width: r.w + bezel * 2, height: r.h + bezel * 2, borderRadius: r.r + bezel,
      background: '#16171A', boxShadow: bezel > 1 ? '0 50px 90px rgba(20,18,12,0.28), inset 0 0 0 1.5px rgba(255,255,255,0.08)' : 'none'}} />
    <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: r.r, overflow: 'hidden', background: fill}}>{children}</div>
  </>
);

const Phone: React.FC<{screen: Rect; bezel: number; children?: React.ReactNode; fill?: string}> = ({screen: r, bezel, children, fill = UI.bg}) => (
  <>
    <div style={{position: 'absolute', left: r.x - bezel, top: r.y - bezel, width: r.w + bezel * 2, height: r.h + bezel * 2, borderRadius: r.r + bezel,
      background: 'linear-gradient(135deg, #2A2B2F 0%, #111214 40%, #1E1F22 100%)', boxShadow: bezel > 1 ? '0 60px 100px rgba(20,18,12,0.32), inset 0 0 0 1.5px rgba(255,255,255,0.1)' : 'none'}} />
    <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: r.r, overflow: 'hidden', background: fill}}>{children}</div>
  </>
);

const Scaled: React.FC<{w: number; k: number; h: number; children: React.ReactNode; style?: React.CSSProperties}> = ({w, h, k, children, style}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transform: `scale(${k})`, transformOrigin: '0 0', ...style}}>{children}</div>
);

const Touch: React.FC<{x: number; y: number; at: number; f: number}> = ({x, y, at, f}) => {
  const t = f - at;
  if (t < -14 || t > 22) return null;
  const s = interpolate(t, [-14, -4, 0, 4, 22], [0.4, 1, 0.82, 1, 0.6], clamp);
  const ring = interpolate(t, [0, 18], [0, 1], clamp);
  return (
    <>
      {t >= 0 && <div style={{position: 'absolute', left: x - 22 - ring * 16, top: y - 22 - ring * 16, width: 44 + ring * 32, height: 44 + ring * 32, borderRadius: '50%', border: `2px solid rgba(255,255,255,${0.6 * (1 - ring)})`}} />}
      <div style={{position: 'absolute', left: x - 20, top: y - 20, width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.78)', transform: `scale(${s})`, boxShadow: '0 4px 12px rgba(0,0,0,0.25)'}} />
    </>
  );
};

// ---------------------------------------------------------------- film
export const Platform: React.FC = () => {
  useFontsReady();
  const f = useCurrentFrame();
  const cam = camAt(f);

  // A: the Trade Now pill stretches into the laptop screen.
  const lap = lapScreen(f);
  const aW = ease(f, 40, 76, INOUT), aH = ease(f, 60, 100, INOUT);
  const pillToLap: Rect = {x: mix(PILL.x, lap.x, aW), y: mix(PILL.y, lap.y, aH), w: mix(PILL.w, lap.w, aW), h: mix(PILL.h, lap.h, aH), r: mix(PILL.r, lap.r, aH)};
  // G: at the end both screens fold back into the pill.
  const fold = ease(f, T.fold, T.fold + 70, INOUT);
  const lapRect = f < 100 ? pillToLap : f >= T.fold ? lerpRect(lap, PILL, fold) : lap;
  const lapFill = f < 100 ? interpolateColors(aH, [0, 1], [UI.cta, UI.bg]) : f >= T.fold ? interpolateColors(fold, [0.5, 1], [UI.bg, UI.cta]) : UI.bg;
  const lapBezel = f < T.fold ? 14 * ease(f, 88, 112) * lapPose(f).s : 14 * lapPose(f).s * (1 - ease(f, T.fold, T.fold + 40, IN));
  const lapBase = f < T.fold ? ease(f, 96, 128) : 1 - ease(f, T.fold, T.fold + 36, IN);

  // C: the toast leaves the laptop and becomes the phone.
  const toastR: Rect = (() => {const a = inLap(T.toPhone, TOAST.x, TOAST.y), k = lapScreen(T.toPhone).w / 1440; return {x: a.x, y: a.y, w: TOAST.w * k, h: TOAST.h * k, r: 14 * k};})();
  const cT = ease(f, T.toPhone, T.toPhone + 90, INOUT);
  const ph = phScreen(f);
  const phRect = f < T.fold ? lerpRect(toastR, ph, cT) : lerpRect(ph, PILL, fold);
  const phShown = f >= T.toPhone;
  const phBezel = f < T.fold ? 10 * ease(f, T.toPhone + 60, T.toPhone + 90) : 10 * (1 - ease(f, T.fold, T.fold + 40, IN));
  const phFill = f >= T.fold ? interpolateColors(fold, [0.5, 1], [UI.bg, UI.cta]) : UI.bg;

  // B: the ETF card becomes a USDT pill, which opens into the trade screen.
  const etf = (() => {const a = inLap(f, 84 + 3 * 324, 740 - 470), k = lapScreen(f).w / 1440; return {x: a.x, y: a.y, w: 300 * k, h: 150 * k, r: 20 * k};})();
  const usdtPill = centered(lap.x + lap.w / 2, lap.y + lap.h / 2, 250, 72, 36);
  const b1 = ease(f, T.etfClick + 4, T.etfClick + 40, INOUT), b2 = ease(f, 566, T.trade + 6, INOUT);
  const bRect = f < 566 ? lerpRect(etf, usdtPill, b1) : lerpRect(usdtPill, {...lap, r: lap.r}, b2);
  const showB = f >= T.etfClick + 4 && f < T.trade + 8;

  // D: the tapped NVDA row becomes a "From 10 USDT" pill, then the prediction card.
  const row = (() => {const a = inPh(f, 0, 150 + 64 + 30), k = PH_W / 390; return {x: a.x, y: a.y, w: 390 * k, h: 66 * k, r: 0};})();
  const tenPill = centered(ph.x + ph.w / 2, ph.y + ph.h / 2, 250, 76, 38);
  const card = (() => {const a = inPh(f, 16, 216), k = PH_W / 390; return {x: a.x, y: a.y, w: 358 * k, h: 330 * k, r: 20 * k};})();
  const d1 = ease(f, T.pill10, T.pill10 + 36, INOUT), d2 = ease(f, T.predict - 20, T.predict + 10, INOUT);
  const dRect = f < T.predict - 20 ? lerpRect(row, tenPill, d1) : lerpRect(tenPill, card, d2);
  const showD = f >= T.pill10 && f < T.predict + 12;

  // Laptop content.
  const tradeState = {
    draw: ease(f, T.trade + 8, T.trade + 100, OUT),
    cross: f >= 640 && f < 706 ? (() => {const c = cursorAt(f); const r = lapScreen(f); return {x: (c.x - r.x) / (r.w / 1440), y: (c.y - r.y) / (r.w / 1440)};})() : undefined,
    mode: tradeMode(f), press: bump(f, T.buy), loading: f < T.buy + 4 ? 0 : f < T.toast - 6 ? 0.5 : 1, toast: ease(f, T.toast, T.toast + 16),
  };
  const lapContent = f < 100 ? null : f < T.trade + 4 ? (
    <div style={{position: 'absolute', inset: 0, ...blurIn(f, 104)}}>
      <Scaled w={1440} h={900} k={lapRect.w / 1440}><DesktopHome f={f} scroll={scrollAt(f)} hover={hoverIndex(f)} hoverAt={T.hovers} /></Scaled>
    </div>
  ) : f < T.finale ? (
    <div style={{position: 'absolute', inset: 0, ...blurIn(f, T.trade + 4)}}>
      <Scaled w={1440} h={900} k={lapRect.w / 1440}><DesktopTrade f={f} s={{...tradeState, toast: f >= T.toPhone ? 0 : tradeState.toast}} /></Scaled>
    </div>
  ) : f < T.fold + 30 ? (
    <div style={{position: 'absolute', inset: 0, ...blurIn(f, T.finale), filter: f >= T.fold ? `blur(${ease(f, T.fold, T.fold + 24) * 10}px)` : blurIn(f, T.finale).filter, opacity: f >= T.fold ? 1 - ease(f, T.fold, T.fold + 24) : blurIn(f, T.finale).opacity}}>
      <Scaled w={1440} h={900} k={lapRect.w / 1440}><DesktopHome f={f} scroll={0} hover={-1} hoverAt={[]} /></Scaled>
    </div>
  ) : null;

  // Phone content.
  const btcShare = mix(50, 62, ease(f, T.up + 2, T.up + 40));
  const xrpShare = mix(55, 41, ease(f, T.down + 2, T.down + 40));
  const flipDeg = f < T.flip ? 0 : f < T.flip + 18 ? mix(0, 90, ease(f, T.flip, T.flip + 18, IN)) : mix(-90, 0, ease(f, T.flip + 18, T.flip + 38, OUT));
  const phContent = !phShown || f < T.toPhone + 70 ? null : f < T.predict ? (
    <div style={{position: 'absolute', inset: 0, ...blurIn(f, T.toPhone + 70)}}>
      <Scaled w={390} h={806} k={phRect.w / 390}><PhoneMarkets f={f} switchAt={T.tradfi} tapRow={0} tapAt={T.row} /></Scaled>
    </div>
  ) : f < T.fold + 30 ? (
    <div style={{position: 'absolute', inset: 0, ...blurIn(f, T.predict), opacity: f >= T.fold ? 1 - ease(f, T.fold, T.fold + 24) : 1}}>
      <Scaled w={390} h={806} k={phRect.w / 390}>
        <PhonePredict f={f} market={f < T.flip + 18 ? 'BTC' : 'XRP'} pick={f < T.flip + 18 ? (f >= T.up ? 1 : 0) : (f >= T.down ? -1 : 0)} share={f < T.flip + 18 ? btcShare : xrpShare} flip={flipDeg} />
      </Scaled>
    </div>
  ) : null;

  const cur = cursorAt(f);
  const cursorOn = f < T.toPhone + 20 || f >= T.endClick - 40;
  const press = Math.max(bump(f, T.pillClick), bump(f, T.etfClick), bump(f, T.futures), bump(f, T.spot), bump(f, T.buy), bump(f, T.endClick));
  const pillLabel = f < 44 ? 1 - ease(f, 34, 44) : f >= T.fold + 60 && f < T.end ? ease(f, T.fold + 60, T.fold + 76) : 0;
  const endT = f >= T.end;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(95% 70% at 50% 42%, #F7F5F0 0%, #ECE9E2 55%, #DCD8CE 100%)', overflow: 'hidden'}}>
      {!endT && (
        <div style={{position: 'absolute', inset: 0, transform: `translate(540px, 675px) scale(${cam.s}) translate(${-cam.cx}px, ${-cam.cy}px)`, transformOrigin: '0 0'}}>
          <Laptop f={f} screen={lapRect} bezel={lapBezel} base={lapBase} fill={lapFill}>{lapContent}</Laptop>
          {showB && (
            <div style={{position: 'absolute', left: bRect.x, top: bRect.y, width: bRect.w, height: bRect.h, borderRadius: bRect.r, overflow: 'hidden',
              background: f < 566 ? interpolateColors(b1, [0, 1], [UI.card, UI.cta]) : interpolateColors(b2, [0, 1], [UI.cta, UI.bg]),
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 34, color: C.ink}}>
              {f >= T.etfClick + 30 && f < 572 && 'USDT'}
            </div>
          )}
          {phShown && (
            <Phone screen={phRect} bezel={phBezel} fill={f < T.toPhone + 60 ? '#1E1F23' : phFill}>
              {f < T.toPhone + 60 && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: UI.text, fontFamily: UI.font, fontSize: 17 * (phRect.w / (TOAST.w * LAP_K * 0.8)), opacity: 1 - ease(f, T.toPhone + 10, T.toPhone + 30)}}>Order placed successfully</div>}
              {phContent}
            </Phone>
          )}
          {showD && (
            <div style={{position: 'absolute', left: dRect.x, top: dRect.y, width: dRect.w, height: dRect.h, borderRadius: dRect.r, overflow: 'hidden',
              background: f < T.predict - 20 ? interpolateColors(d1, [0, 1], [UI.card2, UI.cta]) : interpolateColors(d2, [0, 1], [UI.cta, UI.card]),
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UI.font, fontWeight: 700, fontSize: 26, color: '#000'}}>
              {f >= T.pill10 + 26 && f < T.predict - 20 && 'From 10 USDT'}
            </div>
          )}
          {(pillLabel > 0.01) && (
            <div style={{position: 'absolute', left: PILL.x, top: PILL.y, width: PILL.w, height: PILL.h, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: UI.font, fontWeight: 600, fontSize: 26, color: '#000', opacity: pillLabel, ...(f < 44 ? {background: UI.cta, borderRadius: PILL.r} : {}),
              transform: `scale(${1 - bump(f, T.pillClick) * 0.05 - bump(f, T.endClick) * 0.05})`}}>Trade Now</div>
          )}
          {f < 30 && <div style={{position: 'absolute', left: PILL.x, top: PILL.y, width: PILL.w, height: PILL.h}} />}
          <Touch f={f} at={T.tradfi} {...inPh(f, 278, 122)} />
          <Touch f={f} at={T.row} {...inPh(f, 120, 150 + 64 + 30 + 33)} />
          <Touch f={f} at={T.up} {...inPh(f, 106, 216 + 330 - 51)} />
          <Touch f={f} at={T.down} {...inPh(f, 284, 216 + 330 - 51)} />
          {cursorOn && <Cursor x={cur.x} y={cur.y} press={press} />}
        </div>
      )}
      <Overlay f={f} />
      {endT && <EndCard f={f} />}
      <AnimatedGrain f={f} opacity={0.12} />
      <Sound />
    </AbsoluteFill>
  );
};

const hoverIndex = (f: number) => {let i = -1; T.hovers.forEach((h, k) => {if (f >= h - 6) i = k;}); return f < T.hovers[0] - 6 || f > T.etfClick + 4 ? -1 : i;};

// The cursor lives on the stage so it rides the camera.
function cursorAt(f: number) {
  const card = (i: number) => inLap(300, 84 + i * 324 + 170, 740 - 470 + 96);
  const k: Key[] = [
    [0, 920, 1180], [26, 560, 716], [70, 700, 900], [T.hovers[0] - 6, card(0).x, card(0).y], [T.hovers[1] - 6, card(1).x, card(1).y],
    [T.hovers[2] - 6, card(2).x, card(2).y], [T.hovers[3] - 6, card(3).x, card(3).y], [T.etfClick - 2, card(3).x, card(3).y],
    [T.trade + 30, inLap(640, 300, 520).x, inLap(640, 300, 520).y], [704, inLap(700, 900, 420).x, inLap(700, 900, 420).y],
    [T.futures - 3, inLap(720, 1336, 184).x, inLap(720, 1336, 184).y], [T.spot - 3, inLap(810, 1164, 184).x, inLap(810, 1164, 184).y],
    [T.buy - 3, inLap(870, 1235, 806).x, inLap(870, 1235, 806).y], [T.toPhone + 20, 1150, 1300],
    [T.endClick - 40, 1000, 1150], [T.endClick - 3, 560, 716], [2400, 620, 800],
  ];
  return pathAt(f, k);
}

// ---------------------------------------------------------------- headlines, in screen space above the devices
const H: React.CSSProperties = {fontFamily: DISPLAY, fontSize: 64, color: C.ink, letterSpacing: -0.5};
const Sub: React.CSSProperties = {fontFamily: MONO, fontWeight: 500, fontSize: 24, color: '#6A6D73', letterSpacing: 1};
const Overlay: React.FC<{f: number}> = ({f}) => (
  <>
    {f >= T.hovers[0] - 4 && f < T.etfClick + 12 && (
      <div style={{position: 'absolute', left: 0, top: 96, width: 1080, display: 'flex', justifyContent: 'center', gap: 22}}>
        {['Crypto.', 'Stocks.', 'Metals.', 'ETFs.'].map((w, i) => {
          const at = T.hovers[i] - 4;
          const ty = f < at ? 110 : (1 - ease(f, at, at + 18)) * 110 - ease(f, T.etfClick - 2 + i * 2, T.etfClick + 10 + i * 2, IN) * 110;
          return <div key={w} style={{height: 80, overflow: 'hidden'}}><div style={{...H, fontSize: 58, lineHeight: '80px', transform: `translateY(${ty}%)`}}>{w}</div></div>;
        })}
      </div>
    )}
    <Slot f={f} at={T.etfClick + 4} out={T.trade - 10} y={96} h={80} style={H}>All with stablecoins.</Slot>
    <Slot f={f} at={T.trade} out={T.futures - 12} y={96} h={80} style={H}>Spot and Futures.</Slot>
    <Slot f={f} at={T.futures} out={T.buy - 40} y={96} h={80} style={H}>One account.</Slot>
    <Slot f={f} at={T.buy - 26} out={T.toPhone + 30} y={96} h={80} style={H}>0 fees on Spot crypto.</Slot>
    <Slot f={f} at={T.buy - 20} out={T.toPhone + 34} y={180} h={36} style={Sub}>T&amp;C apply</Slot>
    <Slot f={f} at={T.tradfi - 50} out={T.pill10 - 14} y={96} h={80} style={H}>US stocks, in the app.</Slot>
    <Slot f={f} at={T.pill10 + 6} out={T.predict - 14} y={96} h={80} style={H}>From 10 USDT.</Slot>
    <Slot f={f} at={T.pill10 + 12} out={T.predict - 10} y={180} h={36} style={Sub}>on selected TradFi products</Slot>
    <Slot f={f} at={T.predict + 6} out={T.flip - 14} y={96} h={80} style={H}>Predict the market.</Slot>
    <Slot f={f} at={T.flip + 6} out={T.finale - 20} y={96} h={80} style={H}>Up or down. 15 minutes.</Slot>
    {[['8.1M+', 'users'], ['120+', 'countries'], ['2017', 'since']].map(([v, k], i) => (
      <React.Fragment key={k}>
        <Slot f={f} at={T.finale + i * 10} out={T.chips[0] - 16} x={60 + i * 330} w={300} y={88} h={80} style={{...H, fontSize: 60}}>{v}</Slot>
        <Slot f={f} at={T.finale + 6 + i * 10} out={T.chips[0] - 12} x={60 + i * 330} w={300} y={168} h={36} style={Sub}>{k}</Slot>
      </React.Fragment>
    ))}
    <Slot f={f} at={T.chips[0]} out={T.fold + 40} y={96} h={80} style={H}>Trade anywhere.</Slot>
    {['iOS', 'Android', 'Mac', 'Windows'].map((p, i) => {
      const at = T.chips[i], s = sp(f - at, 13, 230) * (1 - ease(f, T.fold, T.fold + 20, IN));
      if (f < at || s < 0.02) return null;
      return (
        <div key={p} style={{position: 'absolute', left: 165 + i * 190, top: 1190, width: 170, height: 58, borderRadius: 29, background: '#FFFFFF', boxShadow: '0 12px 30px rgba(20,18,12,0.12), inset 0 0 0 1px rgba(11,14,17,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UI.font, fontWeight: 600, fontSize: 22, color: C.ink, transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + 0.1 * s})`}}>{p}</div>
      );
    })}
  </>
);

// ---------------------------------------------------------------- end card
const EndCard: React.FC<{f: number}> = ({f}) => {
  const t = f - T.end;
  const pillW = interpolate(t, [0, 26], [250, 190], {...clamp, easing: INOUT});
  const pillY = interpolate(t, [0, 26], [701, 760], {...clamp, easing: INOUT});
  const pillH = interpolate(t, [0, 26], [70, 14], {...clamp, easing: INOUT});
  const logo = ease(f, T.end + 8, T.end + 32, INOUT);
  const lw = 560, lh = lw * (93 / 485);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(110% 70% at 50% 30%, #1A2027 0%, #0B0E11 65%)'}}>
      <div style={{position: 'absolute', left: 540 - pillW / 2, top: pillY - pillH / 2, width: pillW, height: pillH, borderRadius: pillH / 2, background: UI.cta}} />
      <div style={{position: 'absolute', left: 540 - lw / 2, top: 600 - lh, width: lw, height: lh, clipPath: `inset(0 ${(1 - logo) * 100}% 0 0)`}}>
        <Img src={staticFile('brand/logo.png')} style={{width: lw, height: lh}} />
      </div>
      <Slot f={f} at={T.end + 16} y={630} h={80} style={{...H, color: C.paper, fontSize: 56}}>Built for Traders.</Slot>
      <Slot f={f} at={T.end + 30} y={800} h={50} style={{fontFamily: MONO, fontWeight: 500, fontSize: 36, color: C.paper}}>hotcoin.com</Slot>
      <Slot f={f} at={T.end + 40} y={1230} h={34} style={{...Sub, fontSize: 20, color: '#8B8E93'}}>Trading involves risk. T&amp;C apply.</Slot>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- sound
const CUES: [number, string, number][] = [
  [T.pillClick, 'press', 1], [40, 'expand', 0.8], [100, 'collapse', 0.5],
  [236, 'swipe', 0.6], ...T.hovers.map((h) => [h, 'snap', 0.6] as [number, string, number]),
  [T.etfClick, 'press', 1], [T.etfClick + 6, 'collapse', 0.6], [566, 'expand', 0.8], [T.trade, 'select', 0.8],
  [706, 'swipe', 0.6], [T.futures, 'press', 0.9], [T.spot, 'press', 0.9], [T.buy, 'press', 1], [T.toast, 'snap', 0.7],
  [T.toPhone, 'expand', 0.9], [1070, 'swipe', 0.6], [T.tradfi, 'press', 0.6], [T.row, 'press', 0.6], [T.pill10, 'collapse', 0.7],
  [T.predict - 20, 'expand', 0.7], [T.up, 'press', 0.6], [T.flip, 'swipe', 0.7], [T.down, 'press', 0.6],
  [T.finale - 70, 'expand', 1.2], [T.finale, 'collapse', 0.9], ...T.chips.map((c) => [c, 'snap', 0.6] as [number, string, number]),
  [T.fold, 'expand', 0.9], [T.fold + 70, 'collapse', 0.8], [T.endClick, 'press', 1], [T.end, 'success', 1],
  [480 + 4, 'select', 0.5], [T.futures + 2, 'select', 0.4], [T.pill10 + 6, 'select', 0.5], [T.predict + 6, 'select', 0.5],
];
const CLICKS = CUES.filter(([, c]) => c === 'press').map(([f]) => f);
const Sound: React.FC = () => (
  <>
    <Audio src={staticFile('music/your-breath.mp3')} trimBefore={Math.round(MUSIC_START_S * 60)} volume={(f) => {
      const duck = 1 - 0.3 * Math.max(0, ...CLICKS.map((c) => bump(f, c, 9)));
      const out = interpolate(f, [PLATFORM_DURATION - 90, PLATFORM_DURATION - 2], [1, 0], clamp);
      return 0.62 * duck * out;
    }} />
    {CUES.map(([f, cue, vol], i) => {
      const s = soundFor(cue, vol);
      return <Sequence key={i} from={f} durationInFrames={120} layout="none"><Audio src={staticFile(s.src)} volume={Math.min(1, s.volume * 1.4)} /></Sequence>;
    })}
  </>
);
