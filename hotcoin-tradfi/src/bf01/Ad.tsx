// Bubble Files 01 · the 15 second Hotcoin read at about 5:00.
// Its own look on purpose: the 101 notebook (paper ground, handwriting, the green dot narrator), so viewers can
// tell the ad from the story. A green bar fills along the bottom and completes the moment the ad ends, then
// "Okay. Back to 1980." flips a calendar back into the archive look. Same Fable voice as the rest of the video.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Print, f, lin, sp, ease, useFonts} from './Part1';
import {Calendar} from './gfx';
import {Companion, type Beat} from './companion/Companion';
import {Ground, Headline, Note, Underline, Wipe} from './notebook/Notebook';
import {FONT, GREEN, GREEN_DEEP, INK} from './notebook/tokens';
import TL from '../../public/bf01/vo/timeline.json';

const AD = TL[4];
const VO_AT = 0.5;
const s = (i: number) => VO_AT + AD.sentences[i].start;
const e = (i: number) => VO_AT + AD.sentences[i].end;
// rough word times inside sentence 3 ("...with USDT, next to gold, US stocks and five hundred plus cryptos.")
const w3 = (frac: number) => s(3) + (e(3) - s(3)) * frac;
const AD_END = e(4) + 0.45; // the bar completes here
const BACK_AT = AD_END + 0.25;
export const AD_DURATION = Math.round((VO_AT + AD.dur + 0.3) * FPS);

const F = (sec: number) => f(sec);

export const BF01Ad: React.FC = () => {
  useFonts();
  const fr = useCurrentFrame();
  const enter = ease(lin(fr, 0, 16)); // paper slides up over the black
  const leave = ease(lin(fr, F(AD_END), F(AD_END) + 16)); // and drops away to the calendar
  const sceneA = 1 - lin(fr, F(s(2)) - 6, F(s(2)) + 4);
  const sceneB = lin(fr, F(s(2)) - 4, F(s(2)) + 6);

  const beats: Beat[] = [
    {at: 0, x: 1560, y: -120, r: 66, mood: 'curious', look: {x: 560, y: 520}},
    {at: 10, x: 1560, y: 780, r: 66, path: 'drop', mood: 'curious', look: {x: 560, y: 520}},
    {at: F(s(1)), x: 1560, y: 780, r: 66, mood: 'skeptical', look: 'camera', blink: true},
    {at: F(s(2)) + 4, x: 1600, y: 800, r: 66, path: 'hop', hop: 90, mood: 'happy', look: {x: 560, y: 500}},
    {at: F(s(3)) - 16, x: 1730, y: 230, r: 58, path: 'glide', mood: 'excited', look: {x: 1560, y: 560}},
    {at: F(s(4)) - 4, x: 1730, y: 230, r: 58, mood: 'happy', look: {x: 1500, y: 1080}},
    {at: F(AD_END) - 8, x: 1730, y: 230, r: 58, mood: 'delight', look: 'camera', closed: true},
    {at: F(AD_END) + 2, x: 1730, y: 230, r: 58, mood: 'delight', look: 'camera'},
  ];

  return (
    <AbsoluteFill style={{background: INK}}>
      {/* back to 1980: the calendar sits underneath and is revealed when the paper drops away */}
      <Sequence from={F(AD_END)} layout="none">
        <Calendar head="BACK TO" from="2026" to="1980" flipAt={F(s(6) - AD_END) - 4} />
      </Sequence>

      <AbsoluteFill style={{transform: `translateY(${(1 - enter) * 1080 + leave * 1100}px)`, boxShadow: '0 -30px 80px rgba(0,0,0,.6)'}}>
        <Ground ground="paper" />

        {/* A · would they get away with it today? nobody knows */}
        <AbsoluteFill style={{opacity: sceneA}}>
          <Print img="bf01/photos/aba-silver.jpg" x={560} y={520} w={760} h={504} tilt={-2.4} at={8} from="left" objectPosition="50% 45%" zoom={0.05} />
          <Headline at={16} text="Would they" size={118} x={1040} y={250} color={INK} />
          <Headline at={22} text="get away" size={118} x={1040} y={360} color={INK} />
          <Headline at={28} text="with it today?" size={118} x={1040} y={470} color={GREEN_DEEP} />
          <Note at={F(s(1))} x={1040} y={650} text="nobody knows." ground="paper" tone="red" size={64} rotate={-4} />
        </AbsoluteFill>

        {/* B · no private jet needed */}
        {sceneB > 0 && <AbsoluteFill style={{opacity: sceneB}}>
          <Sequence from={F(s(2)) - 4} layout="none">
            <Print video="bf01/clips/jet.mp4" x={560} y={500} w={780} h={460} tilt={1.8} at={0} from="left" grade="grayscale(1) contrast(1.1)" zoom={0.06} />
          </Sequence>
          <Note at={F(s(2)) + 22} x={260} y={770} text="private jet" ground="paper" tone="red" size={70} rotate={-5} strike />
          <Headline at={F(s(2)) + 30} text="Trade silver." size={140} x={1040} y={300} color={INK} />
          <Headline at={F(s(2)) + 46} text="No jet needed." size={140} x={1040} y={430} color={GREEN_DEEP} />
          <Underline at={F(s(2)) + 70} x={1044} y={570} w={600} />
        </AbsoluteFill>}

        {/* C · it's on Hotcoin, next to gold, US stocks and 500+ crypto (iris from the dot) */}
        <Wipe at={F(s(3)) + 2} x={1730} y={240} dur={18}>
          <Ground ground="paper" />
          <Devices at={F(s(3)) + 6} />
          <div style={{position: 'absolute', left: 1440, top: 360, display: 'flex', flexDirection: 'column', gap: 26}}>
            <Chip at={F(w3(0.34))} text="Silver" sub="XAG / USDT" hot />
            <Chip at={F(w3(0.54))} text="Gold" />
            <Chip at={F(w3(0.62))} text="US stocks" />
            <Chip at={F(w3(0.8))} text="500+ crypto" />
          </div>
          <div style={{position: 'absolute', left: 80, bottom: 46, fontFamily: FONT.mono, fontSize: 22, color: 'rgba(21,23,26,.55)', letterSpacing: 1, opacity: lin(fr, F(s(3)) + 20, F(s(3)) + 30)}}>
            Futures trading involves risk.
          </div>
          <Note at={F(s(4))} x={1450} y={730} text="link below" ground="paper" size={60} rotate={-3} from="bottom" arrow={{x: 1560, y: 1040, bend: 0.2}} />
        </Wipe>

        {/* sponsor tag, top left */}
        <div style={{position: 'absolute', left: 80, top: 56, display: 'flex', alignItems: 'center', gap: 18, opacity: lin(fr, 10, 20)}}>
          <Img src={staticFile('brand/hotcoin-lockup-light.png')} style={{height: 30}} />
          <span style={{fontFamily: FONT.mono, fontSize: 19, color: 'rgba(21,23,26,.45)', letterSpacing: 2}}>· A QUICK WORD FROM US</span>
        </div>

        <Companion beats={beats} ground="paper" floor={800 + 66} seed={11} />
      </AbsoluteFill>

      {/* the green bar, fills for exactly as long as the ad runs */}
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 12, width: `${lin(fr, 0, F(AD_END)) * 100}%`, background: GREEN, opacity: 1 - lin(fr, F(AD_END) + 6, F(AD_END) + 16)}} />

      {/* SOUND */}
      <Sequence from={F(VO_AT)} layout="none"><Audio src={staticFile('bf01/vo/04-ad.wav')} /></Sequence>
      <Audio src={staticFile('bf01/music/serene-view-bed.mp3')} volume={(x) => 0.2 * lin(x, 0, 20) * (1 - lin(x, F(AD_END) - 10, F(AD_END) + 14))} />
      <Sequence from={0} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.22} /></Sequence>
      <Sequence from={F(s(3))} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.16} /></Sequence>
      <Sequence from={F(AD_END)} layout="none"><Audio src={staticFile('sfx/foley/whoosh.wav')} volume={0.22} /></Sequence>
      <Sequence from={F(s(6)) - 2} layout="none"><Audio src={staticFile('sfx/mechanical/press.mp3')} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

// A laptop and a phone, both showing the real XAG/USDT listing on Hotcoin.
const Devices: React.FC<{at: number}> = ({at}) => {
  const fr = useCurrentFrame();
  const lp = fr < at ? 0 : sp(fr - at, 20, 110);
  const pp = fr < at + 8 ? 0 : sp(fr - at - 8, 18, 120);
  return (
    <>
      <div style={{position: 'absolute', left: 150, top: 230, width: 1060, opacity: Math.min(1, lp * 1.6), transform: `translateY(${(1 - lp) * 80}px)`}}>
        <div style={{background: '#0c0d0f', borderRadius: '26px 26px 6px 6px', padding: 22, boxShadow: '0 40px 80px rgba(0,0,0,.35)'}}>
          <div style={{height: 560, overflow: 'hidden', borderRadius: 6, background: '#000'}}>
            <Img src={staticFile('bf01/photos/hotcoin-xag.png')} style={{position: 'relative', left: -798, top: 0, width: 1814, height: 'auto'}} />
          </div>
        </div>
        <div style={{height: 26, margin: '0 -70px', background: 'linear-gradient(#cfd1d4, #9a9da1)', borderRadius: '0 0 30px 30px'}} />
      </div>
      <div style={{position: 'absolute', left: 1050, top: 330, width: 320, height: 650, opacity: Math.min(1, pp * 1.6), transform: `translateY(${(1 - pp) * 120}px) rotate(${3 * pp}deg)`,
        background: '#0c0d0f', borderRadius: 52, padding: 14, boxSizing: 'border-box', boxShadow: '0 40px 80px rgba(0,0,0,.4)'}}>
        <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 40, background: '#111214'}}>
          {/* the search panel of the screenshot, scaled to the phone's width */}
          <Img src={staticFile('bf01/photos/hotcoin-xag.png')} style={{position: 'absolute', top: 52, left: -361, width: 744, height: 'auto'}} />
          <Img src={staticFile('brand/hotcoin-lockup-dark.png')} style={{position: 'absolute', left: 66, top: 470, width: 160, opacity: 0.9}} />
          <div style={{position: 'absolute', left: '50%', top: 10, width: 90, height: 24, marginLeft: -45, borderRadius: 12, background: '#000'}} />
        </div>
      </div>
    </>
  );
};

const Chip: React.FC<{at: number; text: string; sub?: string; hot?: boolean}> = ({at, text, sub, hot}) => {
  const fr = useCurrentFrame();
  const p = fr < at ? 0 : sp(fr - at, 14, 160);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * 60}px) scale(${0.9 + 0.1 * p})`, transformOrigin: 'left center'}}>
      <div style={{width: 18, height: 18, borderRadius: 9, background: hot ? GREEN : INK}} />
      <div style={{fontFamily: FONT.display, fontSize: 64, lineHeight: 1, color: INK, textTransform: 'uppercase'}}>{text}</div>
      {sub && <div style={{fontFamily: FONT.mono, fontSize: 22, color: GREEN_DEEP, letterSpacing: 1}}>{sub}</div>}
    </div>
  );
};
