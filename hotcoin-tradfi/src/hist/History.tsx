// "2017 → Tomorrow": the Hotcoin story, one day before TOKEN2049 Singapore. ~37 s at 124 BPM ("Deep Urban", Mixkit).
// Facts: hotcoin.com (since 2017, 8.1M+ users, 120+ countries; Spot, Futures, P2P, Copy Trading, Earn, TradFi),
// Hotcoin EMEA office in Dubai (Apr 2022; offices in Singapore and North America), user base +200% between 2021 and 2022,
// TOKEN2049 Dubai booth M2 (Apr 30 - May 1, 2025), prediction markets (routed to Polymarket), TradFi launch (Sep 7, 2026),
// AUSTRAC DCE registration, TOKEN2049 Singapore 7-8 Oct 2026, Level 5, PB5-5 + PB5-6.
import React, {createContext, useContext, useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IN, INOUT, OUT, clamp, ease, sp} from '../alt/kit';

const FPS = 60, BEAT = (60 / 124) * FPS;
const b = (x: number) => Math.round(x * BEAT);
const MUSIC_START_S = 0.28; // bar 0 of the track: its drop (bar 8) lands on film beat 32
export const HIST_DURATION = b(76);
const LIME = '#B8F26A', INK = '#050706', WHITE = '#F2F3EE', GREY = '#8C938E', RED = '#F6465D';
const DISPLAY = 'Unbounded, sans-serif', SERIF = '"Instrument Serif", serif', MONO = '"JetBrains Mono", monospace';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['900 120px Unbounded', '800 120px Unbounded', 'italic 400 96px "Instrument Serif"', '500 24px "JetBrains Mono"', '700 24px "JetBrains Mono"'].map((s) => document.fonts.load(s))).then(() => continueRender(h));
  }, [h]);
};

// Scenes render on the absolute timeline; only their footage is offset to start with the scene.
const SceneStart = createContext(0);
const Clip: React.FC<{children: React.ReactNode}> = ({children}) => {
  const from = useContext(SceneStart);
  return <Sequence from={from} layout="none">{children}</Sequence>;
};

// ---------- motion primitives ----------
const slam = (f: number, at: number) => {
  const t = f - at;
  if (t < 0) return {o: 0, s: 1.3, blur: 14};
  const p = sp(t, 14, 260);
  return {o: Math.min(1, t / 4), s: 1.3 - 0.3 * p, blur: Math.max(0, 14 * (1 - t / 9))};
};
const Slam: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const f = useCurrentFrame(); const s = slam(f, at);
  return <div style={{opacity: s.o, transform: `scale(${s.s})`, filter: s.blur > 0.2 ? `blur(${s.blur}px)` : undefined, ...style}}>{children}</div>;
};
const Rise: React.FC<{at: number; h: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, h, children, style}) => {
  const f = useCurrentFrame();
  const p = f < at ? 0 : Math.min(1.02, sp(f - at, 16, 220));
  return <div style={{height: h, overflow: 'hidden'}}><div style={{transform: `translateY(${(1 - p) * h * 1.05}px)`, lineHeight: `${h}px`, whiteSpace: 'nowrap', ...style}}>{children}</div></div>;
};
// Footage that plays only inside the letters.
const VideoType: React.FC<{clip: string; trim?: number; text: string; size: number; tracking?: number; outline?: boolean}> = ({clip, trim = 0, text, size, tracking = -0.04, outline}) => (
  <AbsoluteFill style={{isolation: 'isolate'}}>
    <Clip><OffthreadVideo src={staticFile(`hist/${clip}.mp4`)} trimBefore={trim} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.25) contrast(1.25) brightness(1.25)'}} /></Clip>
    <AbsoluteFill style={{background: '#000', mixBlendMode: 'multiply', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: size, lineHeight: 0.86, letterSpacing: size * tracking, color: '#fff', textAlign: 'center'}}>{text}</div>
    </AbsoluteFill>
    {outline ? (
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: size, lineHeight: 0.86, letterSpacing: size * tracking, color: 'transparent', WebkitTextStroke: `2px ${LIME}`, textAlign: 'center'}}>{text}</div>
      </AbsoluteFill>
    ) : null}
  </AbsoluteFill>
);
const Bg: React.FC<{clip: string; trim?: number; dim?: number; tint?: string}> = ({clip, trim = 0, dim = 0.55, tint}) => (
  <AbsoluteFill>
    <Clip><OffthreadVideo src={staticFile(`hist/${clip}.mp4`)} trimBefore={trim} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.15) saturate(0.9)'}} /></Clip>
    <AbsoluteFill style={{background: `rgba(5,7,6,${dim})`}} />
    {tint ? <AbsoluteFill style={{background: tint, mixBlendMode: 'color'}} /> : null}
  </AbsoluteFill>
);
const Label: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = LIME}) => (
  <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 5, color, textTransform: 'uppercase'}}>{children}</div>
);
const Pill: React.FC<{children: React.ReactNode; solid?: boolean}> = ({children, solid}) => (
  <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 2, padding: '14px 24px', borderRadius: 60, whiteSpace: 'nowrap',
    color: solid ? INK : WHITE, background: solid ? LIME : 'rgba(5,7,6,0.55)', border: `2px solid ${LIME}`}}>{children}</div>
);
const fit = (text: string, W: number, max: number) => Math.min(max, (W * 0.9) / (text.length * 0.86));

// ---------- the rail: 2017 to tomorrow ----------
const YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
const HEAD: [number, number][] = [[0, 0], [b(7), 0], [b(9), 1], [b(15), 3], [b(17), 4], [b(24), 4.6], [b(26), 5], [b(31), 5.3], [b(33), 8], [b(47), 8.4], [b(49), 9], [b(63), 9.4], [b(65), 9.85], [b(76), 9.85]];
const headAt = (f: number) => {
  let i = 1; while (i < HEAD.length - 1 && HEAD[i][0] < f) i++;
  const [f0, v0] = HEAD[i - 1], [f1, v1] = HEAD[i];
  return v0 + (v1 - v0) * INOUT(Math.min(1, Math.max(0, (f - f0) / Math.max(1, f1 - f0))));
};
const Rail: React.FC<{f: number; W: number; H: number}> = ({f, W, H}) => {
  const x0 = 70, x1 = W - 70, y = H - 120, v = headAt(f), px = x0 + ((x1 - x0) * v) / 9.85;
  const yearNow = YEARS[Math.min(9, Math.round(v))];
  const out = interpolate(f, [b(72), b(73)], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: out * ease(f, 4, 30)}}>
      <div style={{position: 'absolute', left: x0, top: y, width: x1 - x0, height: 2, background: 'rgba(242,243,238,0.22)'}} />
      <div style={{position: 'absolute', left: x0, top: y - 1, width: px - x0, height: 4, background: LIME, boxShadow: `0 0 18px ${LIME}`}} />
      {YEARS.map((yr, i) => {
        const x = x0 + ((x1 - x0) * i) / 9.85, on = v >= i - 0.05;
        return (
          <React.Fragment key={yr}>
            <div style={{position: 'absolute', left: x - 1, top: y - 10, width: 2, height: 22, background: on ? LIME : 'rgba(242,243,238,0.35)'}} />
            <div style={{position: 'absolute', left: x - 40, width: 80, top: y + 22, textAlign: 'center', fontFamily: MONO, fontWeight: 500, fontSize: 19, color: yr === yearNow ? WHITE : on ? GREY : 'rgba(140,147,142,0.5)'}}>’{String(yr).slice(2)}</div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: x1 - 6, top: y - 8, width: 16, height: 16, borderRadius: '50%', border: `2px solid ${LIME}`}} />
      <div style={{position: 'absolute', left: x1 - 120, width: 140, top: y - 52, textAlign: 'right', fontFamily: MONO, fontWeight: 700, fontSize: 19, color: LIME, letterSpacing: 2}}>T–1</div>
      <div style={{position: 'absolute', left: px - 11, top: y - 10, width: 22, height: 22, borderRadius: '50%', background: LIME, boxShadow: `0 0 24px ${LIME}`}} />
    </div>
  );
};
const Hud: React.FC<{f: number; W: number}> = ({f, W}) => {
  const on = ease(f, 6, 30) * interpolate(f, [b(72), b(73)], [1, 0], clamp), blink = Math.floor(f / 30) % 2;
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: on}}>
      <Img src={staticFile('brand/logo-official-white.png')} style={{width: 170, height: (170 * 328) / 2005}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: WHITE}}>
        <span style={{width: 12, height: 12, borderRadius: '50%', background: LIME, opacity: blink ? 1 : 0.25}} />THE STORY · 2017 → TOKEN2049
      </div>
    </div>
  );
};

// ---------- scenes ----------
const Scene: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const f = useCurrentFrame();
  return f >= from && f < to ? <SceneStart.Provider value={from}><AbsoluteFill>{children}</AbsoluteFill></SceneStart.Provider> : null;
};
const Center: React.FC<{children: React.ReactNode; gap?: number; top?: number}> = ({children, gap = 26, top}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: top === undefined ? 'center' : 'flex-start', paddingTop: top, flexDirection: 'column', gap}}>{children}</AbsoluteFill>
);

export const History: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const tall = H / W > 1.5;
  const big = W * 0.3;
  const BURST = ['SPOT', 'FUTURES', 'P2P', 'COPY TRADING', 'EARN', 'PREDICTIONS', 'TRADFI', 'ONE APP'];
  const users = Math.round(8_100_000 * OUT(Math.min(1, Math.max(0, (f - b(56)) / b(3)))));
  const flashAt = [b(8), b(16), b(24), b(32), b(48), b(56), b(64)];
  const flash = Math.max(0, ...flashAt.map((a) => interpolate(f, [a - 2, a, a + 9], [0, a === b(32) ? 0.85 : 0.4, 0], clamp)));
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      {/* 1. 2017: the origin, footage inside the numerals */}
      <Scene from={0} to={b(8)}>
        <AbsoluteFill style={{opacity: ease(f, 0, 24), transform: `scale(${1.06 - 0.06 * ease(f, 0, b(8), OUT)})`}}>
          <VideoType clip="server" trim={60} text="2017" size={big} outline />
        </AbsoluteFill>
        <Center top={H * (tall ? 0.62 : 0.68)} gap={8}>
          <Rise at={b(2)} h={64} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 60, color: WHITE}}>It started with</Rise>
          <Rise at={b(3)} h={64} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 60, color: LIME}}>one exchange.</Rise>
        </Center>
      </Scene>

      {/* 2. 2018 to 2020: the bear years */}
      <Scene from={b(8)} to={b(16)}>
        <Bg clip="red" trim={120} dim={0.62} />
        <Center gap={18}>
          <Slam at={b(8)}><Label color={RED}>2018 — 2020</Label></Slam>
          <Slam at={b(9)}><div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: W * 0.19, lineHeight: 0.9, letterSpacing: -6, color: 'transparent', WebkitTextStroke: `3px ${RED}`}}>BEAR</div></Slam>
          <Rise at={b(10)} h={76} style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 58, letterSpacing: -2, color: WHITE}}>MARKET FELL.</Rise>
          <Rise at={b(11)} h={76} style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 58, letterSpacing: -2, color: LIME}}>WE KEPT BUILDING.</Rise>
          <div style={{display: 'flex', gap: 14, marginTop: 24}}>
            {['SPOT', 'FUTURES', 'P2P'].map((t, i) => <Slam key={t} at={b(12 + i)}><Pill>{t}</Pill></Slam>)}
          </div>
        </Center>
      </Scene>

      {/* 3. 2021: growth */}
      <Scene from={b(16)} to={b(24)}>
        <Bg clip="screens" trim={240} dim={0.6} />
        <Center gap={10}>
          <Slam at={b(16)}><Label>2021 — 2022 · USER BASE</Label></Slam>
          <Slam at={b(17)}><div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: W * 0.19, lineHeight: 1, letterSpacing: -6, color: LIME, textShadow: `0 0 60px rgba(184,242,106,0.45)`, fontVariantNumeric: 'tabular-nums'}}>
            +{Math.round(200 * OUT(Math.min(1, Math.max(0, (f - b(17)) / b(2)))))}%
          </div></Slam>
          <Rise at={b(19)} h={70} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, color: WHITE}}>the bull run found us.</Rise>
        </Center>
      </Scene>

      {/* 4. 2022: going global */}
      <Scene from={b(24)} to={b(32)}>
        <Bg clip="globe" trim={120} dim={0.35} />
        <Center gap={16} top={H * (tall ? 0.16 : 0.13)}>
          <Slam at={b(24)}><Label>APRIL 2022</Label></Slam>
          <Slam at={b(25)}><div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: W * 0.13, lineHeight: 0.95, letterSpacing: -4, color: WHITE, textAlign: 'center'}}>GOING<br />GLOBAL</div></Slam>
        </Center>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: tall ? 300 : 210, flexDirection: 'column', gap: 14}}>
          {['DUBAI · EMEA HQ', 'SINGAPORE', 'NORTH AMERICA'].map((t, i) => <Slam key={t} at={b(27 + i * 1.5)}><Pill solid={i === 0}>📍 {t}</Pill></Slam>)}
        </AbsoluteFill>
      </Scene>

      {/* 5. DROP — 2025: TOKEN2049 Dubai */}
      <Scene from={b(32)} to={b(40)}>
        <AbsoluteFill style={{transform: `scale(${1.12 - 0.12 * ease(f, b(32), b(40), OUT)})`}}>
          <VideoType clip="dubai" trim={60} text="DUBAI" size={W * 0.2} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(5,7,6,0) 55%, rgba(5,7,6,0.9) 100%)`}} />
        <Center gap={14} top={H * (tall ? 0.2 : 0.14)}>
          <Slam at={b(32)}><Label>2025 · FIRST BIG STAGE</Label></Slam>
        </Center>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: tall ? 320 : 220, flexDirection: 'column', gap: 16}}>
          <Rise at={b(34)} h={80} style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, letterSpacing: -2, color: WHITE}}>TOKEN2049 DUBAI</Rise>
          <Slam at={b(36)}><Pill solid>BOOTH M2 · APR 30 – MAY 1</Pill></Slam>
        </AbsoluteFill>
      </Scene>

      {/* 6. Burst: everything we built, one per beat */}
      <Scene from={b(40)} to={b(48)}>
        {(() => {
          const i = Math.max(0, Math.min(7, Math.floor((f - b(40)) / BEAT))), word = BURST[i], inv = i % 2 === 0;
          const s = slam(f, b(40 + i));
          return (
            <AbsoluteFill style={{background: inv ? LIME : INK, alignItems: 'center', justifyContent: 'center'}}>
              <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: fit(word, W, W * 0.24), letterSpacing: -4, lineHeight: 1, color: inv ? INK : LIME,
                transform: `scale(${0.9 + 0.1 * s.s})`, textAlign: 'center'}}>{word}</div>
              <div style={{position: 'absolute', bottom: tall ? 330 : 230, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: inv ? INK : GREY}}>0{i + 1} / 08 · BUILT SINCE 2017</div>
            </AbsoluteFill>
          );
        })()}
      </Scene>

      {/* 7. Sep 2026: TradFi */}
      <Scene from={b(48)} to={b(56)}>
        <Bg clip="screens" trim={900} dim={0.7} />
        <Center gap={18}>
          <Slam at={b(48)}><Label>SEPTEMBER 7, 2026</Label></Slam>
          <Slam at={b(49)}><div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: W * 0.12, lineHeight: 0.95, letterSpacing: -4, color: WHITE, textAlign: 'center'}}>US STOCKS.<br /><span style={{color: LIME}}>WITH USDT.</span></div></Slam>
          <div style={{display: 'flex', gap: 22, marginTop: 30}}>
            {['TSLA', 'NVDA', 'SNDK', 'MU', 'SPY'].map((t, i) => {
              const p = f < b(51) + i * 6 ? 0 : sp(f - b(51) - i * 6, 11, 260);
              return (
                <div key={t} style={{width: 110, height: 110, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
                  <Img src={staticFile(`trade/logos/${t}.png`)} style={{width: 70, height: 70, objectFit: 'contain'}} />
                </div>
              );
            })}
          </div>
          <Rise at={b(53)} h={60} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 54, color: GREY}}>24/7. From 10 USDT.</Rise>
        </Center>
      </Scene>

      {/* 8. Today: the scale */}
      <Scene from={b(56)} to={b(64)}>
        <Bg clip="arc" trim={60} dim={0.5} />
        <Center gap={14}>
          <Slam at={b(56)}><Label>TODAY</Label></Slam>
          <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: W * 0.128, lineHeight: 1, letterSpacing: -4, color: WHITE, fontVariantNumeric: 'tabular-nums'}}>{users.toLocaleString('en-US')}<span style={{color: LIME}}>+</span></div>
          <Rise at={b(57)} h={66} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 60, color: LIME}}>traders</Rise>
          <div style={{display: 'flex', gap: 14, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: W - 120}}>
            {['120+ COUNTRIES', '9 YEARS', 'AUSTRAC REGISTERED'].map((t, i) => <Slam key={t} at={b(59 + i)}><Pill solid={i === 0}>{t}</Pill></Slam>)}
          </div>
        </Center>
      </Scene>

      {/* 9. Tomorrow: Singapore */}
      <Scene from={b(64)} to={b(76)}>
        <Bg clip={tall ? 'sgv' : 'mbs'} trim={30} dim={interpolate(f, [b(64), b(70)], [0.35, 0.75], clamp)} />
        <Center gap={8} top={H * (tall ? 0.24 : 0.17)}>
          <Slam at={b(64)}><Label>2026 · 10 · 07</Label></Slam>
          <Slam at={b(65)}><div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: W * 0.17, lineHeight: 1, letterSpacing: -6, color: WHITE}}>TOMOR</div></Slam>
          <Slam at={b(65.5)}><div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: W * 0.17, lineHeight: 1, letterSpacing: -6, color: LIME}}>ROW.</div></Slam>
        </Center>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: tall ? 330 : 225, flexDirection: 'column', gap: 14}}>
          <Rise at={b(67)} h={74} style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 56, letterSpacing: -2, color: WHITE}}>TOKEN2049 SINGAPORE</Rise>
          <div style={{display: 'flex', gap: 12}}>
            {['7–8 OCT', 'LEVEL 5', 'PB5-5 + PB5-6'].map((t, i) => <Slam key={t} at={b(68 + i * 0.5)}><Pill solid={i === 2}>{t}</Pill></Slam>)}
          </div>
        </AbsoluteFill>
        {/* end lock-up */}
        <AbsoluteFill style={{background: INK, opacity: ease(f, b(71.5), b(72.5)), alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40}}>
          <Slam at={b(72)}><Img src={staticFile('brand/logo-official-white.png')} style={{width: W * 0.62, height: (W * 0.62 * 328) / 2005}} /></Slam>
          <Rise at={b(73)} h={70} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, color: WHITE}}>Singapore incoming<span style={{color: LIME}}>.</span></Rise>
        </AbsoluteFill>
      </Scene>

      <Rail f={f} W={W} H={H} />
      <Hud f={f} W={W} />
      <AbsoluteFill style={{background: '#fff', opacity: flash, pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', backgroundPosition: `${(f * 37) % 384}px ${(f * 91) % 384}px`, mixBlendMode: 'overlay', opacity: 0.2}} />

      <Audio src={staticFile('t49/deep-urban.mp3')} trimBefore={Math.round(MUSIC_START_S * FPS)}
        volume={(fr) => interpolate(fr, [0, 4, HIST_DURATION - 80, HIST_DURATION], [0, 1, 1, 0], clamp)} />
      <Sequence from={b(32) - 48} durationInFrames={90} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.5} /></Sequence>
      <Sequence from={b(32) - 1} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.85} /></Sequence>
      {[8, 16, 24, 48, 56, 64].map((k) => <Sequence key={k} from={b(k) - 6} durationInFrames={60} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.3} /></Sequence>)}
      {[40, 41, 42, 43, 44, 45, 46, 47].map((k) => <Sequence key={k} from={b(k) - 1} durationInFrames={30} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.35} /></Sequence>)}
      <Sequence from={b(72) - 1} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.7} /></Sequence>
    </AbsoluteFill>
  );
};
