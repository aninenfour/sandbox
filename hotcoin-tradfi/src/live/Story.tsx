// IG story collage: three booth selfies per 1080 x 1920 story, in the "Live from TOKEN2049" frame language.
// Staggered, slightly rotated cards with notched lime frames; header kept below the IG top bar.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Sticker, useFonts} from './Live';

const LIME = '#B8F26A', INK = '#050706', WHITE = '#F2F3EE', RED = '#FF3B3B';
const DISPLAY = 'Unbounded, sans-serif', MONO = '"JetBrains Mono", monospace';
export const STORY_W = 1080, STORY_H = 1920;

type Pic = {photo: string; pos: string; tag: string};
type Story = {l1: string; l2: string; pics: [Pic, Pic, Pic]};
export const STORIES: Story[] = [
  {l1: 'Day 2 at the', l2: 'green booth.', pics: [
    {photo: 's1', pos: '50% 42%', tag: 'GOOD TALKS'},
    {photo: 's2', pos: '50% 40%', tag: 'NEW FRIENDS'},
    {photo: 's4', pos: '50% 52%', tag: 'THE GREEN TEAM'},
  ]},
  {l1: 'Thumbs up', l2: 'all day.', pics: [
    {photo: 's3', pos: '50% 38%', tag: 'LEVEL 5'},
    {photo: 's9', pos: '50% 34%', tag: 'FOOTBALL CHALLENGE'},
    {photo: 's8', pos: '50% 52%', tag: 'MARINA BAY SANDS'},
  ]},
  {l1: 'Good people.', l2: 'Good energy.', pics: [
    {photo: 's5', pos: '50% 38%', tag: 'TOKEN2049'},
    {photo: 's6', pos: '50% 38%', tag: 'BUILT FOR TRADERS'},
    {photo: 's7', pos: '50% 36%', tag: 'SEE YOU AT THE BOOTH'},
  ]},
];

const CW = 930, CH = 540, NOTCH = 40;
const notch = (n: number) => `polygon(${n}px 0, 100% 0, 100% calc(100% - ${n}px), calc(100% - ${n}px) 100%, 0 100%, 0 ${n}px)`;
const CARDS = [
  {x: 44, y: 520, r: -2.2},
  {x: 106, y: 935, r: 1.8},
  {x: 50, y: 1350, r: -1.4},
];

const Card: React.FC<{pic: Pic; k: number}> = ({pic, k}) => {
  const c = CARDS[k], right = k % 2 === 1;
  return (
    <div style={{position: 'absolute', left: c.x, top: c.y, width: CW, height: CH, transform: `rotate(${c.r}deg)`, filter: 'drop-shadow(0 22px 30px rgba(0,0,0,0.6))'}}>
      <div style={{position: 'absolute', inset: 0, background: LIME, clipPath: notch(NOTCH)}} />
      <div style={{position: 'absolute', inset: 7, clipPath: notch(NOTCH - 4), overflow: 'hidden', background: INK}}>
        <Img src={staticFile(`live/${pic.photo}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pic.pos, filter: 'contrast(1.05) saturate(1.06)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,7,6,0) 62%, rgba(5,7,6,0.55) 100%)'}} />
      </div>
      {/* index + tag */}
      <div style={{position: 'absolute', top: 26, [right ? 'right' : 'left']: right ? 26 : 52, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: LIME, background: INK, padding: '8px 14px', border: `2px solid ${LIME}`}}>
        0{k + 1} / 03
      </div>
      <div style={{position: 'absolute', top: 26, [right ? 'left' : 'right']: right ? 52 : 26, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: INK, background: LIME, padding: '11px 30px 11px 18px', clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)'}}>
        {pic.tag}
      </div>
    </div>
  );
};

export const StoryCollage: React.FC<{i: number}> = ({i}) => {
  useFonts();
  const s = STORIES[i];
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      {/* lime glow + faint grid */}
      <AbsoluteFill style={{background: 'radial-gradient(70% 45% at 85% 30%, rgba(184,242,106,0.16), rgba(184,242,106,0) 70%), radial-gradient(60% 40% at 10% 85%, rgba(126,194,90,0.12), rgba(126,194,90,0) 70%)'}} />
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(242,243,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(242,243,238,0.04) 1px, transparent 1px)', backgroundSize: '72px 72px'}} />
      {/* giant outlined DAY 2 behind the cards */}
      <div style={{position: 'absolute', right: -40, top: 1080, transform: 'rotate(-90deg)', transformOrigin: 'right top', fontFamily: DISPLAY, fontWeight: 900, fontSize: 300, letterSpacing: -10, color: 'transparent', WebkitTextStroke: '2px rgba(184,242,106,0.22)', whiteSpace: 'nowrap'}}>DAY 2</div>
      {/* header, below the IG top bar */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, border: `2px solid ${LIME}`, borderRadius: 40, padding: '8px 18px 8px 14px'}}>
            <span style={{width: 14, height: 14, borderRadius: '50%', background: RED, boxShadow: `0 0 12px ${RED}`}} />
            <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: WHITE}}>LIVE</span>
          </div>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: INK, background: LIME, padding: '11px 30px 11px 16px', clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)'}}>TOKEN2049 · DAY 2</div>
        </div>
        <Img src={staticFile('brand/logo-official-white.png')} style={{width: 210, height: (210 * 328) / 2005}} />
      </div>
      <div style={{position: 'absolute', left: 60, top: 290}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 84, lineHeight: 1, letterSpacing: -3, color: WHITE, whiteSpace: 'nowrap'}}>{s.l1}</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 900, fontSize: 84, lineHeight: 1.04, letterSpacing: -3, color: LIME, whiteSpace: 'nowrap'}}>{s.l2}</div>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 21, letterSpacing: 4, color: WHITE, opacity: 0.75, marginTop: 16}}>📍 LEVEL 5 · PB5-5 + PB5-6</div>
      </div>
      {s.pics.map((p, k) => <Card key={k} pic={p} k={k} />)}
      {/* sticker in the free header space, right of the headline */}
      <div style={{position: 'absolute', inset: 0, transform: 'scale(0.8)', transformOrigin: '936px 372px'}}>
        <Sticker x={936} y={372} />
      </div>
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.14}} />
    </AbsoluteFill>
  );
};
