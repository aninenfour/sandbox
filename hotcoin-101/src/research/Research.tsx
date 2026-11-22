// Hotcoin Research (YouTube, Chinese, simplified): channel trailer (16:9) and
// a Mt. Gox case short (9:16), both in the noir 3D look with the Green Dot.
//
// Sources (checked 2026-11-18):
// - Mt. Gox halted withdrawals Feb 2014, filed for bankruptcy in Tokyo saying about
//   850,000 BTC were missing (about 750,000 customers', 100,000 its own); in March 2014
//   it reported finding about 200,000 BTC in an old-format wallet, leaving about
//   650,000 unaccounted for: Computerworld/IDG "Mt. Gox finds $116M worth of bitcoins",
//   CBC "Bitcoin exchange Mt. Gox finds 200K of its missing bitcoins".
// - Repayments to creditors began July 2024 (trustee, first payouts July 5, 2024):
//   Bloomberg 2024-07-24 "Mt. Gox creditors get crypto repayments after decade of waiting",
//   NBC News.
// - Cause: the exchange blamed hackers (transaction malleability); an inside job was
//   also suspected; no single explanation was confirmed at the time (sources above).
// - Tulip "one bulb for a house" is told as legend ("传说"), Satoshi line is general.
// Timings are estimates until the voice takes are generated; swap `at/end` then.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Bars, C, clamp01, ease, easeOut, Fade, FontGate, Grain, lerp, MONO, range, sec, Subtitle, ZH} from './kit';
import {BoardScene, LetterScene, ScaleScene, TrainExterior, TrainInterior, VaultSet} from './sets';

type Line = {text: string; at: number; end: number};
const L = (text: string, at: number, end: number): Line => ({text, at: sec(at), end: sec(end)});

// ---------- 3D layer helper ----------
const Stage: React.FC<{from: number; to: number; W: number; H: number; fin?: number; fout?: number; children: (f: number, dur: number) => React.ReactNode}> = ({from, to, W, H, fin = 10, fout = 10, children}) => {
  const frame = useCurrentFrame();
  return (
    <Fade from={from} to={to} fin={fin} fout={fout}>
      <ThreeCanvas width={W} height={H} shadows gl={{antialias: true, toneMapping: 4 /* ACES */, toneMappingExposure: 1.05}} camera={{fov: 34, near: 0.05, far: 400, position: [0, 2, 8]}}>
        {children(frame - from, to - from)}
      </ThreeCanvas>
    </Fade>
  );
};

// ---------- 2D overlays ----------
const BigNumber: React.FC<{at: number; to?: number; value: number; prefix?: string; suffix?: string; label?: string; y: number; size: number; count?: number; color?: string; plain?: boolean}> = ({at, to = 1e9, value, prefix = '', suffix = '', label, y, size, count = 18, color = C.lime, plain}) => {
  const f = useCurrentFrame();
  if (f < at || f > to + 8) return null;
  const o = Math.min(ease((f - at) / 6), 1 - ease((f - to) / 8));
  const v = Math.round(value * easeOut((f - at) / count));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: o}}>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: size, color, letterSpacing: -2, lineHeight: 1, textShadow: '0 0 40px rgba(184,242,106,0.35)'}}>
        {prefix}
        {plain ? String(v) : v.toLocaleString('en-US')}
        <span style={{fontSize: size * 0.42, marginLeft: size * 0.12, color: C.paper}}>{suffix}</span>
      </div>
      {label && <div style={{fontFamily: ZH, fontWeight: 900, fontSize: size * 0.36, color: C.paper, marginTop: size * 0.18, letterSpacing: 6}}>{label}</div>}
    </div>
  );
};

const Stamp: React.FC<{at: number; to: number; text: string; y: number; size: number}> = ({at, to, text, y, size}) => {
  const f = useCurrentFrame();
  if (f < at || f > to + 8) return null;
  const k = easeOut((f - at) / 7);
  const o = Math.min(k, 1 - ease((f - to) / 8));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{fontFamily: ZH, fontWeight: 900, fontSize: size, color: C.lime, border: `${size * 0.06}px solid ${C.lime}`, padding: `${size * 0.04}px ${size * 0.22}px`, transform: `rotate(-6deg) scale(${lerp(1.6, 1, k)})`, letterSpacing: size * 0.1}}>{text}</div>
    </div>
  );
};

// Mt. Gox: 750k customers vs 100k company
const SplitBar: React.FC<{at: number; to: number; y: number; W: number}> = ({at, to, y, W}) => {
  const f = useCurrentFrame();
  if (f < at || f > to + 8) return null;
  const o = Math.min(ease((f - at) / 6), 1 - ease((f - to) / 8));
  const grow = easeOut((f - at - 3) / 16);
  const w = W - 160;
  const a = (750 / 850) * w * grow;
  return (
    <div style={{position: 'absolute', left: 80, top: y, width: w, opacity: o}}>
      <div style={{display: 'flex', height: 64, gap: 4}}>
        <div style={{width: a, background: C.lime}} />
        <div style={{width: (100 / 850) * w * grow, background: '#5E6A66'}} />
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 18, fontFamily: ZH, fontWeight: 900, fontSize: 44, color: C.paper}}>
        <span>
          用户 <span style={{fontFamily: MONO, color: C.lime}}>750,000</span>
        </span>
        <span style={{color: '#9AA6A2'}}>
          交易所 <span style={{fontFamily: MONO}}>100,000</span>
        </span>
      </div>
    </div>
  );
};

const YearCount: React.FC<{at: number; to: number; y: number; size: number}> = ({at, to, y, size}) => {
  const f = useCurrentFrame();
  if (f < at || f > to + 8) return null;
  const o = Math.min(ease((f - at) / 6), 1 - ease((f - to) / 8));
  const yr = Math.round(lerp(2014, 2024, ease((f - at - 4) / ((to - at) * 0.7))));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: o}}>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: size, color: yr === 2024 ? C.lime : C.paper, letterSpacing: -2, lineHeight: 1}}>{yr}</div>
      <div style={{fontFamily: ZH, fontWeight: 900, fontSize: size * 0.3, color: C.paper, marginTop: size * 0.16, letterSpacing: 8}}>整整十年</div>
    </div>
  );
};

const NameSwap: React.FC<{at: number; to: number; y: number}> = ({at, to, y}) => {
  const f = useCurrentFrame();
  if (f < at || f > to + 8) return null;
  const o = Math.min(ease((f - at) / 6), 1 - ease((f - to) / 8));
  const k = ease((f - at - 26) / 10);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: o}}>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 74, color: C.paper, opacity: lerp(1, 0.5, k), letterSpacing: 2}}>Mt. Gox</div>
      <div style={{fontFamily: ZH, fontWeight: 900, fontSize: 230, color: C.lime, lineHeight: 1.1, opacity: k, transform: `translateY(${(1 - k) * 30}px)`, textShadow: '0 0 60px rgba(184,242,106,0.35)'}}>门头沟</div>
    </div>
  );
};

const Lesson: React.FC<{at: number; to: number; vertical?: boolean; lines: string[]}> = ({at, to, vertical, lines}) => {
  const f = useCurrentFrame();
  if (f < at || f > to + 8) return null;
  const o = Math.min(ease((f - at) / 10), 1 - ease((f - to) / 8));
  return (
    <AbsoluteFill style={{justifyContent: vertical ? 'flex-start' : 'center', paddingTop: vertical ? 360 : 0, alignItems: 'center', background: `rgba(3,5,5,${0.72 * o})`}}>
      <div style={{opacity: o, textAlign: 'center', fontFamily: ZH, fontWeight: 900, fontSize: vertical ? 92 : 84, lineHeight: 1.3, color: C.paper}}>
        {lines.map((l, i) => (
          <div key={i} style={{color: i === 0 ? C.lime : C.paper}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// End card: the lockup assembles, the glowing dot lands on the logo's dot
const LOCK = {cx: 260.5 / 1980, cy: 263.5 / 336, r: 58 / 336, aspect: 1980 / 336};
const EndCard: React.FC<{at: number; W: number; H: number; vertical?: boolean; tagline: string}> = ({at, W, H, vertical, tagline}) => {
  const f = useCurrentFrame() - at;
  if (f < 0) return null;
  const lw = vertical ? 760 : 900;
  const lh = lw / LOCK.aspect;
  const left = (W - lw) / 2;
  const top = H * (vertical ? 0.42 : 0.4) - lh / 2;
  const dx = left + LOCK.cx * lw;
  const dy = top + LOCK.cy * lh;
  const dr = LOCK.r * lh;
  const fly = easeOut(f / 22);
  const sx = lerp(W * 0.5, dx, fly);
  const sy = lerp(H * 0.75, dy, fly) - Math.sin(fly * Math.PI) * H * 0.12;
  const sr = lerp(dr * 2.2, dr, fly);
  const word = ease((f - 14) / 12);
  const sub = ease((f - 24) / 12);
  const bg = ease(f / 8);
  return (
    <AbsoluteFill style={{background: `rgba(7,9,10,${bg})`}}>
      <div style={{position: 'absolute', left: dx - dr * 3, top: dy - dr * 3, width: dr * 6, height: dr * 6, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,242,106,0.35), rgba(184,242,106,0) 70%)', opacity: fly}} />
      <Img src={staticFile('brand/hotcoin-lockup-dark-nodot.png')} style={{position: 'absolute', left, top, width: lw, height: lh, opacity: word}} />
      <div style={{position: 'absolute', left: sx - sr, top: sy - sr, width: sr * 2, height: sr * 2, borderRadius: '50%', background: C.green, boxShadow: `0 0 ${sr * 1.4}px rgba(184,242,106,0.7)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: top + lh + (vertical ? 46 : 38), textAlign: 'center', opacity: sub}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: vertical ? 44 : 38, letterSpacing: vertical ? 22 : 26, color: C.lime, paddingLeft: 26}}>RESEARCH</div>
        <div style={{fontFamily: ZH, fontWeight: 500, fontSize: vertical ? 44 : 34, color: C.paper, marginTop: vertical ? 34 : 26, letterSpacing: 6, opacity: 0.85}}>{tagline}</div>
      </div>
    </AbsoluteFill>
  );
};

const GLYPHS_EXTRA = '档案郁金香狂热门头沟中本聪泡沫用户交易所整整十年失踪钱的故事每周一份';

// Voice: one take per line, placed at the line's start. Music ducks under the voice.
const Voice: React.FC<{lines: Line[]; prefix: string}> = ({lines, prefix}) => (
  <>
    {lines.map((l, i) => (
      <Sequence key={i} from={l.at} durationInFrames={l.end - l.at + 6}>
        <Audio src={staticFile(`research/vo/${prefix}${i}.mp3`)} volume={1} />
      </Sequence>
    ))}
  </>
);
const duck = (f: number, lines: Line[], endAt: number) => {
  const UNDER = 0.16;
  const OPEN = 0.34;
  const END = 0.5;
  let near = 99;
  for (const l of lines) {
    if (f >= l.at - 8 && f <= l.end + 8) near = 0;
    else near = Math.min(near, f < l.at ? l.at - 8 - f : f - l.end - 8);
  }
  const v = lerp(UNDER, OPEN, clamp01(near / 12));
  return f >= endAt ? lerp(v, END, clamp01((f - endAt) / 15)) : v;
};

// =================== TRAILER 16:9 ===================
const TR_LINES: Line[] = [
  L('每一个暴富的传说背后，都藏着一份[没有结案的档案]。', 0.8, 0.8 + 5.64),
  L('传说，[一朵郁金香]，能换[一栋房子]。', 8.6, 8.6 + 5.14),
  L('[85万枚比特币]，怎么会凭空消失？', 14.6, 14.6 + 4.27),
  L('一封邮件，一个名字，然后，这个人[再也没有出现]。', 19.6, 19.6 + 6.91),
  L('我们是 [Hotcoin Research]。', 27.2, 27.2 + 2.21),
  L('每一集，打开一份档案，把[钱背后的故事]讲清楚。', 29.8, 29.8 + 6.89),
];
export const TRAILER_TOTAL = sec(42.6);

export const ResearchTrailer: React.FC<{subs?: boolean; music?: boolean}> = ({subs = true, music = true}) => {
  const W = 1920;
  const H = 1080;
  const s = sec;
  return (
    <FontGate text={TR_LINES.map((l) => l.text).join('') + GLYPHS_EXTRA + '金融档案每周一集'}>
      <AbsoluteFill style={{background: C.ink}}>
        <Stage from={0} to={s(4.6)} W={W} H={H} fin={0}>
          {(f, d) => <TrainExterior f={f} dur={d} />}
        </Stage>
        <Stage from={s(4.3)} to={s(8.3)} W={W} H={H}>
          {(f, d) => <TrainInterior f={f} dur={d} folder={{title: '泡沫档案'}} />}
        </Stage>
        <Stage from={s(8.0)} to={s(14.3)} W={W} H={H}>
          {(f, d) => <ScaleScene f={f} dur={d} />}
        </Stage>
        <Stage from={s(14.0)} to={s(19.4)} W={W} H={H}>
          {(f, d) => (
            <VaultSet
              f={f}
              dur={d}
              open={0.75}
              sign="MT.GOX"
              cam={{from: [2.2, 2.6, 9.5], to: [0.6, 2.3, 4.6], look: [0, 2.4, -1]}}
              dot={{position: [lerp(1.8, 0.2, ease(f / d)), lerp(1.4, 2.0, ease(f / d)), lerp(2.2, -0.6, ease(f / d))], r: 0.3, mood: 'curious', mood2: 'worried', mix: range(f, d * 0.4, d * 0.7), look: [-0.4, 0.2], glow: 1.2}}
            />
          )}
        </Stage>
        <Stage from={s(19.1)} to={s(27.0)} W={W} H={H}>
          {(f, d) => <LetterScene f={f} dur={d} />}
        </Stage>
        <Stage from={s(26.7)} to={s(37.6)} W={W} H={H} fout={8}>
          {(f, d) => (
            <TrainInterior
              f={f}
              dur={d}
              folder={{title: '泡沫档案'}}
              camFrom={[0.35, 1.5, 1.7]}
              camTo={[0.5, 1.38, 1.05]}
              lookAt={[0.62, 1.12, -1.42]}
              dot={{mood: 'curious', mood2: 'happy', mix: range(f, sec(0.6), sec(1.4)), look: [0, 0.05], yaw: lerp(-0.7, 0, ease(f / sec(1.2)))}}
            />
          )}
        </Stage>
        <BigNumber at={s(15.0)} to={s(19.0)} value={850000} suffix="BTC" label="失踪" y={150} size={120} />
        <EndCard at={s(37.4)} W={W} H={H} tagline="金融档案 · 每周一集" />
        <Grain />
        <Bars h={64} />
        {subs && TR_LINES.map((l, i) => <Subtitle key={i} text={l.text} from={l.at} to={l.end} />)}
        <Voice lines={TR_LINES} prefix="tr" />
        {music && <Audio src={staticFile('research/music-tapis.mp3')} volume={(f) => duck(f, TR_LINES, s(37.4))} />}
      </AbsoluteFill>
    </FontGate>
  );
};

// =================== SHORT 9:16 (Mt. Gox) ===================
const SH_LINES: Line[] = [
  L('2014年2月，曾经[全世界最大]的比特币交易所，突然[停止了提币]。', 0.5, 0.5 + 5.76),
  L('它叫 Mt. Gox，中文圈都叫它，[门头沟]。', 6.7, 6.7 + 3.62),
  L('几周后，它申请破产，说出了一个数字：[85万枚比特币]，不见了。', 10.75, 10.75 + 5.98),
  L('其中[75万枚]，是用户的。', 17.1, 17.1 + 2.52),
  L('没过多久，他们在一个[旧钱包]里，又翻出了[20万枚]。', 20.0, 20.0 + 4.58),
  L('可剩下的大约[65万枚]，去哪儿了？', 25.0, 25.0 + 3.43),
  L('交易所说是[黑客]，也有人怀疑是[内鬼]，到今天，也没有一个完整的答案。', 28.85, 28.85 + 5.98),
  L('用户们等了[整整十年]，直到2024年，才开始拿回赔付。', 35.3, 35.3 + 5.54),
  L('所以说，[币放在哪儿]，跟买什么币，一样重要。', 41.3, 41.3 + 4.8),
];
export const SHORT_TOTAL = sec(54.0);

export const ResearchShort: React.FC<{subs?: boolean; music?: boolean}> = ({subs = true, music = true}) => {
  const W = 1080;
  const H = 1920;
  const s = sec;
  const v = true;
  return (
    <FontGate text={SH_LINES.map((l) => l.text).join('') + GLYPHS_EXTRA + '黑客内鬼答案剩下币放在哪儿和买什么一样重要钱的故事每周一份'}>
      <AbsoluteFill style={{background: C.ink}}>
        {/* 1. the door shuts (the dot gets bounced off it) */}
        <Stage from={0} to={s(11.0)} W={W} H={H} fin={0}>
          {(f) => {
            const shut = ease(range(f, s(3.2), s(5.0)));
            const bump = range(f, s(4.6), s(5.6));
            const dz = f < s(4.6) ? lerp(4.2, 0.9, ease(range(f, s(1.0), s(4.6)))) : lerp(0.9, 2.6, easeOut(bump));
            const dy = 2.1 + (f >= s(4.6) && f < s(5.6) ? Math.sin(bump * Math.PI) * 0.5 : 0);
            const later = range(f, s(6.8), s(8.0));
            return (
              <VaultSet
                f={f}
                dur={s(11)}
                vertical
                open={1 - shut}
                cam={{from: [0.8, 2.4, 11.5], to: [0.2, 2.2, 8.8], look: [0, 2.0, 0], lookTo: [0, 2.1, 0]}}
                dot={{position: [0.3, dy, dz], r: 0.42, mood: f < s(4.6) ? 'curious' : 'surprised', mood2: 'skeptical', mix: later, squash: f >= s(4.6) && f < s(4.9) ? 0.8 : 1, look: [0, f < s(6.8) ? 0.2 : 0.9]}}
              />
            );
          }}
        </Stage>
        {/* 2. inside, the shelves are empty */}
        <Stage from={s(10.7)} to={s(25.4)} W={W} H={H}>
          {(f, d) => {
            const chest = ease(range(f, s(10.2), s(11.6)));
            return (
              <VaultSet
                f={f}
                dur={d}
                vertical
                open={1}
                chest={chest}
                cam={{from: [0.0, 2.1, 3.6], to: [0.2, 1.7, 0.6], look: [0, 1.6, -4], lookTo: [0.6, 0.9, -5.2]}}
                dot={{position: [lerp(-0.4, 0.3, ease(f / d)), 1.35, lerp(-0.9, -2.8, ease(f / d))], r: 0.3, mood: 'worried', mood2: 'excited', mix: chest, look: [lerp(-0.3, 0.6, chest), lerp(0.2, -0.5, chest)], glow: 1.3, yaw: lerp(0, -0.6, chest)}}
              />
            );
          }}
        </Stage>
        {/* 3. the evidence board */}
        <Stage from={s(25.1)} to={s(35.8)} W={W} H={H}>
          {(f, d) => (
            <BoardScene
              f={f}
              dur={d}
              vertical
              cards={[
                {text: '650,000', sub: 'BTC 下落不明', x: 0, y: 3.7, at: s(0.6), hot: true},
                {text: '黑客？', x: -0.82, y: 2.65, at: s(4.6)},
                {text: '内鬼？', x: 0.82, y: 2.65, at: s(6.2)},
                {text: '答案？', x: 0, y: 1.6, at: s(8.2)},
              ]}
            />
          )}
        </Stage>
        {/* 4. ten years: the dot dozes in front of the shut door */}
        <Stage from={s(35.5)} to={s(41.4)} W={W} H={H}>
          {(f, d) => (
            <VaultSet
              f={f}
              dur={d}
              vertical
              open={0}
              cam={{from: [1.2, 0.8, 6.5], to: [0.7, 0.75, 5.4], look: [0, 0.05, 0]}}
              dot={{position: [0.2, 0.36, 1.5], r: 0.36, mood: 'sleepy', closed: f < d * 0.72, mood2: 'surprised', mix: range(f, d * 0.72, d * 0.82), squash: 0.92, glow: lerp(0.6, 1.2, range(f, d * 0.72, d * 0.82)), look: [0, 0.4]}}
            />
          )}
        </Stage>
        {/* 5. back at the desk: the lesson */}
        <Stage from={s(41.1)} to={s(49.1)} W={W} H={H} fout={8}>
          {(f, d) => <TrainInterior f={f} dur={d} vertical folder={{title: '门头沟'}} dot={{mood: 'focused', mood2: 'happy', mix: range(f, s(3.5), s(4.5)), look: [-0.5, -0.4]}} />}
        </Stage>

        <BigNumber at={s(1.0)} to={s(6.4)} value={2014} label="二月" y={380} size={180} count={1} color={C.paper} plain />
        <NameSwap at={s(6.7)} to={s(10.6)} y={420} />
        <BigNumber at={s(13.4)} to={s(17.1)} value={850000} suffix="BTC" label="失踪" y={420} size={150} />
        <SplitBar at={s(17.3)} to={s(20.2)} y={480} W={W} />
        <BigNumber at={s(22.0)} to={s(25.3)} value={200000} prefix="+" suffix="BTC" label="旧钱包里找回" y={420} size={150} />
        <YearCount at={s(35.9)} to={s(41.2)} y={330} size={220} />
        <Lesson at={s(46.4)} to={s(48.9)} vertical lines={['币放在哪儿', '和买什么币', '一样重要']} />
        <EndCard at={s(48.9)} W={W} H={H} vertical tagline="金融档案 · 每周一集" />
        <Grain />
        {subs && SH_LINES.map((l, i) => <Subtitle key={i} text={l.text} from={l.at} to={l.end} vertical />)}
        <Voice lines={SH_LINES} prefix="sh" />
        {music && <Audio src={staticFile('research/music-vertigo.mp3')} volume={(f) => duck(f, SH_LINES, s(48.9))} />}
      </AbsoluteFill>
    </FontGate>
  );
};

export const clampF = clamp01;
