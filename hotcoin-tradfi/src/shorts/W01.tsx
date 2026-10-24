// Worst Money Decisions 01 · Ronald Wayne, the third Apple founder (YouTube Short, 1080x1920).
// Script and sources: youtube/shorts/worst-01-wayne.md. Voice and word timings: scripts/make-short-vo.py -> public/shorts/w01.
// Every scene starts on its sentence; props land on the exact word.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Bills, C, Captions, Choice, Enter, FONT, Figure, Fruit, Meter, Paper, Room, Tag, W, buildChunks, ease, f, lin, pop, type MeterState, type Word} from './kit';
import VO from '../../public/shorts/w01/words.json';

const S = VO.sentences;
const WORDS = VO.words as Word[];
const st = (i: number) => S[i].start;
const end = (i: number) => (i + 1 < S.length ? S[i + 1].start : VO.dur + 1.3);
// start time of the n-th word containing `w` (case-insensitive)
const wt = (w: string, n = 0) => WORDS.filter((x) => x.w.toLowerCase().includes(w.toLowerCase()))[n].start;
export const W01_DURATION = f(VO.dur + 1.3);

const CHUNKS = buildChunks(WORDS, [
  ['ten percent', '10%'], ['eight hundred dollars', '$800'], ['fifteen thousand dollars', '$15,000'], ['fifteen hundred', '$1,500'],
  ['five hundred bucks', '$500'], ['one point six million', '$1.6 MILLION'], ['five hundred billion dollars', '$500 BILLION'],
  ['forty-one', '41'], ['twenty-one', '21'], ['twenty-five', '25'], ['two weeks', '2 WEEKS'],
], /^(\$.*|\d.*|10%|apple's?|wayne|ronald|jobs|wozniak|sold|regrets|stayed\?|logo|contract|hook)$/i);

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const METER: MeterState[] = [
  {from: 0, label: '1976 · WAYNE OWNS', value: '10% OF APPLE'},
  {from: f(st(1)), label: 'DAYS LATER', value: (fr) => `DAY ${Math.max(1, Math.min(12, Math.round(lin(fr, f(st(1)), f(st(1)) + 50, 1, 12))))}`},
  {from: f(st(2)), label: 'HE SOLD IT FOR', value: '$800', color: C.hi},
  {from: f(wt('fifteen', 1)), label: 'TOTAL HE EVER GOT', value: (fr) => money(lin(fr, f(wt('fifteen', 1)), f(wt('fifteen', 1)) + 24, 800, 2300)), color: C.hi},
  {from: f(st(12)), label: 'HIS COPY OF THE CONTRACT', value: '$500'},
  {from: f(wt('auction')), label: 'SOTHEBY\'S, DEC 2011', value: '$1,590,000', color: C.hi},
  {from: f(st(14)), label: '10% OF APPLE TODAY', value: (fr) => money(2300 + (500e9 - 2300) * Math.pow(ease(lin(fr, f(wt('billion')) - 10, f(wt('billion')) + 40)), 3)), color: C.hi},
  {from: f(st(16)), label: 'YOUR CALL', value: 'STAY OR SELL?'},
];

// ---------- scenes ----------
const Hook: React.FC<{lift?: boolean; choice?: boolean; first?: boolean}> = ({lift = true, choice, first}) => {
  const fr = useCurrentFrame();
  const sl = lift ? ease(lin(fr, f(wt('ten') - st(0)), f(wt('ten') - st(0)) + 14)) : 1;
  return (
    <Enter still={first}>
      <Room light={{x: 600, y: 700, r: 640}} />
      <Fruit x={620} y={700} r={240} slice={sl} glow={sl} />
      <Figure who="wayne" x={choice ? 150 : 220} y={1150} s={choice ? 0.8 : 1} pose={{armR: choice ? -40 : -10 - 50 * sl, look: 1, mood: choice ? 'happy' : 'neutral'}} />
      {choice && <Choice a="STAY" b="SELL" at={4} y={1000} />}
    </Enter>
  );
};

const Days: React.FC = () => {
  const fr = useCurrentFrame();
  const day = Math.max(1, Math.min(12, Math.round(lin(fr, 0, 50, 1, 12))));
  const flip = (fr % 4) / 4;
  const sold = f(wt('sold') - st(1));
  return (
    <Enter from="up">
      <Room light={{x: 540, y: 700, r: 600}} />
      <div style={{position: 'absolute', left: 540 - 260, top: 360, width: 520, height: 600, background: C.paper, borderRadius: 14, boxShadow: '0 30px 0 rgba(0,0,0,.35)', overflow: 'hidden', transform: 'rotate(-2deg)'}}>
        <div style={{height: 140, background: C.red, color: '#fff', font: `900 70px/140px ${FONT.cap}`, textAlign: 'center'}}>APRIL 1976</div>
        <div style={{font: `900 330px/440px ${FONT.display}`, color: C.line, textAlign: 'center', transform: day < 12 ? `rotateX(${flip * 40}deg)` : 'none'}}>{day}</div>
      </div>
      {fr >= sold && <div style={{position: 'absolute', left: 540, top: 660, transform: `translate(-50%,-50%) rotate(-14deg) scale(${2.2 - 1.2 * pop(fr, sold, 9, 260)})`, border: `12px solid ${C.red}`, color: C.red, font: `900 150px ${FONT.cap}`, padding: '0 40px', background: 'rgba(242,238,230,.85)'}}>OUT</div>}
    </Enter>
  );
};

const EightHundred: React.FC = () => {
  const fr = useCurrentFrame();
  const away = ease(lin(fr, 6, 40));
  return (
    <Enter>
      <Room light={{x: 540, y: 820, r: 600}} />
      <Fruit x={540 + away * 700} y={520} r={170} slice={1} sliceDx={0} glow={0} />
      <Bills x={540} y={820} n={3} s={1.5} at={f(wt('eight') - st(2))} />
    </Enter>
  );
};

const Name: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <Enter>
      <Room light={{x: 540, y: 760, r: 560}} window />
      <Figure who="wayne" x={540} y={1150} s={1.3} pose={{armL: 8, armR: -8, look: 0}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', font: `700 34px ${FONT.mono}`, letterSpacing: 6, color: 'rgba(255,255,255,.75)', opacity: lin(fr, 8, 16)}}>APPLE CO-FOUNDER NO. 3</div>
    </Enter>
  );
};

const AgeTag: React.FC<{x: number; at: number; age: string}> = ({x, at, age}) => {
  const fr = useCurrentFrame();
  const p = pop(fr, at, 10, 240);
  return <div style={{position: 'absolute', left: x, top: 560, transform: `translateX(-50%) scale(${p})`, background: C.paper, color: C.line, font: `900 80px ${FONT.cap}`, padding: '6px 26px', borderRadius: 14}}>{age}</div>;
};
const Ages: React.FC = () => {
  const b = st(4);
  return (
    <Enter>
      <Room light={{x: 540, y: 800, r: 700}} />
      <Figure who="wayne" x={180} y={1150} s={0.9} pose={{armL: 6, armR: -6}} />
      <Figure who="jobs" x={480} y={1150} s={0.9} pose={{armL: 10, armR: -14, mood: 'smug'}} />
      <Figure who="woz" x={780} y={1150} s={0.9} pose={{armL: 12, armR: -12, mood: 'happy'}} />
      <AgeTag x={180} at={f(wt('forty-one') - b)} age="41" />
      <AgeTag x={480} at={f(wt('twenty-one') - b)} age="21" />
      <AgeTag x={780} at={f(wt('twenty-five') - b)} age="25" />
    </Enter>
  );
};

const GrownUp: React.FC = () => {
  const fr = useCurrentFrame();
  const j = Math.abs(Math.sin(fr / 5)) * -50, w = Math.abs(Math.sin(fr / 5 + 1.4)) * -46;
  return (
    <Enter>
      <Room light={{x: 540, y: 800, r: 520}} window />
      <Figure who="jobs" x={190} y={1150} s={0.82} pose={{armL: 150, armR: -150, mood: 'happy', bob: j}} />
      <Figure who="woz" x={810} y={1150} s={0.82} pose={{armL: 140, armR: -160, mood: 'happy', bob: w}} />
      <Figure who="wayne" x={540} y={1150} s={1.05} pose={{armL: 30, armR: -30, mood: 'neutral'}} />
      <div style={{position: 'absolute', left: 540 - 90, top: 820, width: 180, height: 120, background: C.paper, borderRadius: 6, transform: 'rotate(-4deg)', boxShadow: '0 10px 0 rgba(0,0,0,.3)'}} />
    </Enter>
  );
};

// the first logo as a pen sketch drawing itself: a tree, a figure reading under it, a frame (an illustration, not the original artwork)
const Sketch: React.FC<{at: number}> = ({at}) => {
  const fr = useCurrentFrame();
  const p = (a: number, len = 20) => 1 - ease(lin(fr, at + a * 0.45, at + a * 0.45 + len * 0.6));
  const ink = {fill: 'none', stroke: '#2a261e', strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: '1 1'};
  const show = pop(fr, at, 14, 160);
  return (
    <div style={{position: 'absolute', left: 540 - 330, top: 330, width: 660, height: 760, background: C.paper, borderRadius: 8, boxShadow: '0 30px 0 rgba(0,0,0,.3)', transform: `rotate(2deg) scale(${show})`}}>
      <svg viewBox="0 0 660 760" width={660} height={760}>
        <rect x={60} y={60} width={540} height={640} {...ink} strokeDashoffset={p(0, 18)} />
        <path d="M330 600 L330 380" {...ink} strokeWidth={14} strokeDashoffset={p(10)} />
        <path d="M330 400 C200 420 150 300 220 240 C230 150 360 120 410 190 C500 190 520 320 430 380 C400 420 360 410 330 400" {...ink} strokeDashoffset={p(18, 26)} />
        <circle cx={420} cy={300} r={18} {...ink} strokeDashoffset={p(34, 10)} />
        <path d="M200 600 L460 600" {...ink} strokeDashoffset={p(40, 12)} />
        <circle cx={250} cy={520} r={22} {...ink} strokeDashoffset={p(46, 10)} />
        <path d="M250 542 L250 585 M250 560 L285 548 M250 585 L280 600" {...ink} strokeDashoffset={p(50, 12)} />
      </svg>
    </div>
  );
};
const Contract: React.FC = () => {
  const fr = useCurrentFrame();
  const logoAt = f(wt('logo') - st(6)) - 14;
  const up = ease(lin(fr, logoAt - 6, logoAt + 8));
  return (
    <Enter>
      <Room light={{x: 540, y: 800, r: 700}} />
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${-up * 1400}px)`}}>
        <Paper x={540} y={380} title="PARTNERSHIP AGREEMENT" lines={['APPLE COMPUTER CO.', 'APRIL 1, 1976', 'JOBS 45% · WOZNIAK 45%', 'WAYNE 10%']} at={2} typeSpeed={2.4} />
      </div>
      {fr >= logoAt - 6 && <Sketch at={logoAt} />}
    </Enter>
  );
};

const Why: React.FC = () => {
  const fr = useCurrentFrame();
  const walk = fr / 4;
  return (
    <Enter>
      <Room light={{x: 880, y: 800, r: 600}} />
      <div style={{position: 'absolute', left: 760, top: 420, width: 240, height: 730, background: C.light, boxShadow: `0 0 120px ${C.light}`}} />
      <div style={{position: 'absolute', left: 720, top: 390, width: 30, height: 760, background: '#3A2E22'}} />
      <Figure who="wayne" x={260 + lin(fr, 0, 48) * 320} y={1150} s={1} pose={{walk, look: 1}} />
      <div style={{position: 'absolute', left: 230, top: 300, font: `900 300px ${FONT.cap}`, color: C.hi, transform: `rotate(-8deg) scale(${pop(fr, 6, 9, 220)})`}}>?</div>
    </Enter>
  );
};

const Loan: React.FC = () => {
  const b = st(8);
  return (
    <Enter from="right">
      <Room light={{x: 540, y: 800, r: 700}} />
      <Figure who="jobs" x={180} y={1150} s={0.9} pose={{armL: 60, armR: -20, mood: 'happy'}} />
      <Paper x={600} y={340} w={720} title="LINE OF CREDIT" lines={['BORROWER: APPLE COMPUTER CO.', 'AMOUNT: $15,000', 'PARTNERS LIABLE: ALL THREE']} at={2} typeSpeed={2.6} stamp={{text: 'DEBT', at: f(wt('thousand') - b) + 4}} />
    </Enter>
  );
};

const Hook2: React.FC = () => {
  const fr = useCurrentFrame();
  const b = st(9);
  const hookAt = f(wt('hook') - b) - 10, loseAt = f(wt('lose') - b) - 6;
  const drop = ease(lin(fr, hookAt, hookAt + 16));
  const lift = ease(lin(fr, loseAt, loseAt + 14));
  const hx = 540 + (230 - 540) * ease(lin(fr, hookAt + 10, loseAt));
  const hy = -200 + drop * 920 - lift * 140;
  return (
    <Enter>
      <Room light={{x: 540, y: 900, r: 700}} />
      <Figure who="jobs" x={500} y={1150} s={0.88} pose={{pockets: true, mood: 'happy'}} />
      <Figure who="woz" x={790} y={1150} s={0.88} pose={{pockets: true, mood: 'happy'}} />
      <Figure who="wayne" x={200} y={1150} s={0.88} pose={{armL: 20, armR: -60, mood: fr > loseAt ? 'worried' : 'neutral'}} />
      {['$0', '$0'].map((t, i) => <div key={i} style={{position: 'absolute', left: [500, 790][i], top: 520, transform: `translateX(-50%) scale(${pop(fr, 20 + i * 6)})`, font: `900 70px ${FONT.cap}`, color: C.grey}}>{t}</div>)}
      {/* Wayne's savings */}
      <div style={{position: 'absolute', left: 300 - 100, top: 760 - lift * 140, width: 200, height: 210, transform: `scale(${pop(fr, 14)})`}}>
        <div style={{position: 'absolute', inset: 0, background: '#C9A86A', borderRadius: '45% 45% 40% 40%'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', font: `900 120px ${FONT.cap}`, color: '#5A4420'}}>$</div>
      </div>
      <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={hx + 70} y1={0} x2={hx + 70} y2={hy} stroke={C.grey} strokeWidth={6} />
        <path d={`M${hx + 70} ${hy} l0 100 a56 56 0 1 1 -112 0 l0 -30`} fill="none" stroke="#B9C0CC" strokeWidth={22} strokeLinecap="round" />
      </svg>
    </Enter>
  );
};

const TookIt: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <Enter>
      <Room light={{x: 540, y: 950, r: 600}} />
      <Figure who="wayne" x={240 + lin(fr, 0, 66) * 560} y={1150} s={1} pose={{walk: fr / 4, armR: -70, look: 1}} />
      <div style={{position: 'absolute', left: 240 + lin(fr, 0, 66) * 560 + 100, top: 700, width: 130, height: 64, background: C.money, border: '5px solid #4E8F55', borderRadius: 6, transform: 'rotate(-10deg)'}} />
    </Enter>
  );
};

const Release: React.FC = () => {
  const b = st(11);
  return (
    <Enter from="up">
      <Room light={{x: 540, y: 800, r: 700}} />
      <Paper x={540} y={360} title="RELEASE OF ALL CLAIMS" lines={['I, RONALD WAYNE,', 'GIVE UP ANY CLAIM', 'TO APPLE. FOR GOOD.']} at={2} typeSpeed={2.4} stamp={{text: '$1,500', at: f(wt('fifteen', 1) - b), color: '#2E7D32'}} />
    </Enter>
  );
};

const CopySold: React.FC = () => {
  const b = st(12);
  return (
    <Enter>
      <Room light={{x: 540, y: 800, r: 700}} />
      <Paper x={540} y={360} w={640} title="PARTNERSHIP AGREEMENT" lines={['APPLE COMPUTER CO.', 'APRIL 1, 1976']} at={0} typeSpeed={40} tilt={3} />
      <Tag x={540} y={840} text="$500" at={f(wt('bucks') - b) - 12} />
    </Enter>
  );
};

const Auction: React.FC = () => {
  const fr = useCurrentFrame();
  const b = st(13);
  const hit = f(wt('auction') - b);
  const g = fr < hit - 8 ? -40 : fr < hit ? -40 + 40 * ease(lin(fr, hit - 8, hit)) : 0;
  const shake = fr >= hit && fr < hit + 8 ? Math.sin(fr * 3) * 10 : 0;
  return (
    <Enter>
      <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
        <Room light={{x: 540, y: 800, r: 700}} />
        <Paper x={540} y={360} w={640} title="PARTNERSHIP AGREEMENT" lines={['APPLE COMPUTER CO.', 'APRIL 1, 1976']} at={0} typeSpeed={40} tilt={3} />
        <Tag x={540} y={840} text="$500" flipAt={hit + 2} flipText="$1.59M" at={0} />
        {/* gavel */}
        <svg width={W} height={1920} style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(850 900) rotate(${g})`}>
            <rect x={-20} y={-10} width={40} height={300} rx={14} fill="#7A4E2C" transform="rotate(-60)" />
            <rect x={-110} y={-60} width={220} height={110} rx={20} fill="#9A6537" transform="rotate(-60) translate(0 -40)" />
          </g>
        </svg>
        {/* proof: the headline, recreated */}
        <div style={{position: 'absolute', left: 90, top: 330, width: 900, background: C.paper, padding: '18px 26px', transform: `rotate(-1.5deg) translateY(${(1 - pop(fr, hit + 10, 14, 160)) * 300}px)`, boxShadow: '0 12px 0 rgba(0,0,0,.3)'}}>
          <div style={{font: `700 22px ${FONT.mono}`, color: '#6b665a', letterSpacing: 3}}>DECEMBER 2011 · NEW YORK · ILLUSTRATION</div>
          <div style={{font: `900 46px/1.1 ${FONT.cap}`, color: C.line, marginTop: 6}}>Apple's founding contract sells for $1.59 million at Sotheby's</div>
        </div>
      </AbsoluteFill>
    </Enter>
  );
};

const Today: React.FC = () => {
  const fr = useCurrentFrame();
  const b = st(14);
  const big = f(wt('billion') - b);
  return (
    <Enter>
      <Room light={{x: 540, y: 720, r: 800}} />
      <Fruit x={540} y={740} r={280} slice={1} glow={1 + 0.3 * Math.sin(fr / 6)} />
      {fr >= big && Array.from({length: 14}, (_, i) => {
        const t = fr - big - i * 3;
        if (t < 0) return null;
        const x = 120 + ((i * 137) % 840), y = 330 + t * 30;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 150, height: 70, background: C.money, border: '5px solid #4E8F55', borderRadius: 6, transform: `rotate(${(i * 47) % 60 - 30 + t * 4}deg)`}} />;
      })}
    </Enter>
  );
};

const NoRegrets: React.FC = () => {
  const fr = useCurrentFrame();
  const shrug = ease(lin(fr, 10, 22)) * (1 - ease(lin(fr, 40, 52)));
  return (
    <Enter>
      <Room light={{x: 540, y: 760, r: 560}} window />
      <Figure who="wayne" x={540} y={1150} s={1.3} pose={{armL: 30 + shrug * 110, armR: -30 - shrug * 110, mood: 'happy'}} />
    </Enter>
  );
};

// ---------- the Short ----------
const SCENES: [number, React.FC][] = [
  [0, () => <Hook first />], [1, Days], [2, EightHundred], [3, Name], [4, Ages], [5, GrownUp], [6, Contract], [7, Why], [8, Loan], [9, Hook2],
  [10, TookIt], [11, Release], [12, CopySold], [13, Auction], [14, Today], [15, NoRegrets], [16, () => <Hook lift={false} choice />],
];

export const W01: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.night}}>
      {SCENES.map(([i, Scene]) => (
        <Sequence key={i} from={i ? f(st(i)) - 2 : 0} durationInFrames={f(end(i)) - (i ? f(st(i)) - 2 : 0)}><Scene /></Sequence>
      ))}
      <Meter states={METER} />
      <Captions chunks={CHUNKS} />
      <div style={{position: 'absolute', left: 64, top: 96, font: `700 26px ${FONT.mono}`, color: 'rgba(255,255,255,.45)', letterSpacing: 3}}>WORST MONEY DECISIONS · 01</div>
      <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.12, mixBlendMode: 'overlay', background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 2px, transparent 2px 4px)'}} />

      {/* sound */}
      <Audio src={staticFile('shorts/w01/vo.wav')} />
      <Audio src={staticFile('bf01/music/silent-descent.mp3')} trimBefore={30 * 30} volume={(x) => 0.16 * lin(x, 0, 15) * (1 - lin(x, W01_DURATION - 20, W01_DURATION))} />
      {SCENES.slice(1).map(([i]) => <Sequence key={i} from={f(st(i)) - 3} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.12} /></Sequence>)}
      <Sequence from={f(wt('dollars.'))} layout="none"><Audio src={staticFile('sfx/mechanical/purchase.mp3')} volume={0.5} /></Sequence>
      <Sequence from={f(wt('sold'))} layout="none"><Audio src={staticFile('sfx/mechanical/press.mp3')} volume={0.6} /></Sequence>
      <Sequence from={f(st(6)) + 2} layout="none"><Audio src={staticFile('sfx/mechanical/typing.mp3')} volume={0.35} /></Sequence>
      <Sequence from={f(wt('thousand')) + 4} layout="none"><Audio src={staticFile('sfx/mechanical/press.mp3')} volume={0.6} /></Sequence>
      <Sequence from={f(wt('fifteen', 1))} layout="none"><Audio src={staticFile('sfx/mechanical/press.mp3')} volume={0.6} /></Sequence>
      <Sequence from={f(wt('bucks')) - 12} layout="none"><Audio src={staticFile('sfx/mechanical/snap.mp3')} volume={0.5} /></Sequence>
      <Sequence from={f(wt('auction'))} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.9} /></Sequence>
      <Sequence from={f(wt('billion')) - 10} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.5} /></Sequence>
      <Sequence from={f(wt('billion')) + 40} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.6} /></Sequence>
      <Sequence from={f(st(16)) + 4} layout="none"><Audio src={staticFile('sfx/mechanical/notification.mp3')} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

// Cover for Reels / TikTok / Shorts: the opening picture plus the title, all inside Instagram's 3:4 grid crop (y 240 to 1680).
export const W01Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.night}}>
    <Hook />
    <div style={{position: 'absolute', left: 60, right: 60, top: 1210, textAlign: 'center', font: `900 112px/1.08 ${FONT.cap}`, textTransform: 'uppercase', color: '#fff', WebkitTextStroke: '16px #0B0F18', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,.45)'}}>
      He sold <span style={{color: C.hi}}>10%</span> of Apple<br />for <span style={{color: C.hi}}>$800</span>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', font: `700 34px ${FONT.mono}`, letterSpacing: 4, color: 'rgba(255,255,255,.6)'}}>WORST MONEY DECISIONS · 01</div>
  </AbsoluteFill>
);
