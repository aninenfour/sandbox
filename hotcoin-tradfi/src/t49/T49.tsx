// "Hotcoin at TOKEN2049 Singapore" teaser. About 21 s at 124 BPM ("Deep Urban", Mixkit), 9:16 and 4:5.
// Event facts (token2049.com and its August 2026 press release): 7-8 Oct 2026, Marina Bay Sands (all five floors),
// 25,000+ attendees, 300+ speakers, 1,000+ side events, TOKEN2049 Week 5-11 Oct, AFTER 2049 closing party on 9 Oct.
// TOKEN2049 appears as text only (no event logo), and no speakers are shown: this is Hotcoin's own teaser.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {IN, INOUT, OUT, clamp, ease, sp} from '../alt/kit';
import {Booth} from './Booth';

export const BOOTH_LABEL = 'Level 5 · PB5-5 + PB5-6'; // from Hotcoin's "Singapore Incoming" key visual
const FPS = 60, BEAT = (60 / 124) * FPS, BAR = BEAT * 4;
const k = (beats: number) => Math.round(beats * BEAT);
const MUSIC_START_S = 0.28 + 4 * 4 * (60 / 124); // track bar 4, so the drop (bar 8) lands on film beat 16
export const T49_DURATION = k(44);
const LIME = '#B8F26A', WHITE = '#F4F5F2', GREY = '#9DA3A0', INK = '#050706';
const SANS = '"Inter Tight", sans-serif', MONO = '"IBM Plex Mono", monospace', DISPLAY = '"Archivo Black", sans-serif';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['600 96px "Inter Tight"', '500 30px "Inter Tight"', '500 24px "IBM Plex Mono"', '400 96px "Archivo Black"'].map((s) => document.fonts.load(s))).then(() => continueRender(h));
  }, [h]);
};

const Clip: React.FC<{name: string; from: number; dur: number; trim?: number; dim?: number; zoom?: number}> = ({name, from, dur, trim = 0, dim = 0.45, zoom = 1.08}) => {
  const f = useCurrentFrame();
  const s = zoom - (zoom - 1) * Math.min(1, Math.max(0, (f - from) / dur));
  return (
    <Sequence from={from} durationInFrames={dur} layout="none">
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <OffthreadVideo src={staticFile(`t49/${name}.mp4`)} trimBefore={trim} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.05) contrast(1.1)'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(5,7,6,${dim})`}} />
    </Sequence>
  );
};

// A word that rises out of a mask on its beat.
const Rise: React.FC<{at: number; children: React.ReactNode; size: number; color?: string; font?: string; h?: number}> = ({at, children, size, color = WHITE, font = SANS, h}) => {
  const f = useCurrentFrame();
  const p = f < at ? 0 : Math.min(1.03, sp(f - at, 15, 230));
  const H = h ?? size * 1.08;
  return (
    <div style={{height: H, overflow: 'hidden'}}>
      <div style={{transform: `translateY(${(1 - p) * H}px)`, fontFamily: font, fontWeight: 600, fontSize: size, lineHeight: `${H}px`, letterSpacing: -size * 0.035, color, whiteSpace: 'nowrap'}}>{children}</div>
    </div>
  );
};

export const T49: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const tall = H / W > 1.5;
  const pad = 80;
  const flash = (at: number) => interpolate(f, [at - 2, at, at + 8], [0, 0.5, 0], clamp);

  // Section boundaries in beats
  const S1 = 0, S2 = k(8), DROP = k(16), S4 = k(28), END = k(36);
  const stats = [
    {n: '25,000+', l: 'attendees', clip: 'stage', trim: 120},
    {n: '300+', l: 'speakers', clip: 'lights', trim: 600},
    {n: '1,000+', l: 'side events', clip: 'audience', trim: 60},
    {n: '5 floors', l: 'of Marina Bay Sands', clip: 'screens', trim: 200},
  ];
  const week = [
    {d: '5–6 OCT', t: 'Side events across the city', clip: 'expo', trim: 60},
    {d: '7–8 OCT', t: 'TOKEN2049 main stage', clip: 'face', trim: 30},
    {d: '9 OCT', t: 'AFTER 2049 closing party', clip: 'party', trim: 30},
    {d: '9–11 OCT', t: 'F1 weekend in Singapore', clip: 'city', trim: 120},
  ];
  const boothP = ease(f, DROP, DROP + 18, OUT);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      {/* 1. Singapore at night */}
      <Clip name={tall ? 'mbsv' : 'mbs'} from={S1} dur={k(4)} dim={0.35} zoom={1.12} />
      <Clip name="bay" from={k(4)} dur={k(4)} dim={0.4} trim={60} />
      {f < S2 ? (
        <AbsoluteFill style={{padding: pad, justifyContent: 'flex-end', paddingBottom: tall ? 300 : 160}}>
          <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: 4, color: LIME, opacity: ease(f, 6, 20)}}>SINGAPORE · MARINA BAY SANDS</div>
          <div style={{height: 18}} />
          <Rise at={k(1)} size={tall ? 92 : 84}>7–8 October</Rise>
          <div style={{height: 10}} />
          <Rise at={k(4)} size={tall ? 188 : 168} font={DISPLAY} h={tall ? 190 : 172}>TOKEN</Rise>
          <Rise at={k(5)} size={tall ? 188 : 168} font={DISPLAY} color={LIME} h={tall ? 190 : 172}>2049</Rise>
        </AbsoluteFill>
      ) : null}

      {/* 2. The scale, one stat per two beats */}
      {stats.map((s, i) => <Clip key={s.n} name={s.clip} from={S2 + k(i * 2)} dur={k(2)} trim={s.trim} dim={0.55} />)}
      {f >= S2 && f < DROP ? (() => {
        const i = Math.min(3, Math.floor((f - S2) / k(2))), s = stats[i], at = S2 + k(i * 2);
        return (
          <AbsoluteFill style={{padding: pad, justifyContent: 'center'}}>
            <Rise at={at} size={tall ? 200 : 170} font={DISPLAY} color={LIME} h={tall ? 205 : 175}>{s.n}</Rise>
            <Rise at={at + 6} size={tall ? 64 : 58}>{s.l}</Rise>
            <div style={{position: 'absolute', left: pad, bottom: tall ? 260 : 120, fontFamily: MONO, fontSize: 26, color: GREY}}>0{i + 1} / 04 · TOKEN2049 SINGAPORE</div>
          </AbsoluteFill>
        );
      })() : null}

      {/* 3. The drop: Hotcoin's green booth */}
      {f >= DROP - 2 && f < S4 + 4 ? (
        <AbsoluteFill style={{opacity: boothP}}>
          <ThreeCanvas width={W} height={H} camera={{fov: 42, position: [-7.5, 5.5, 9], near: 0.1, far: 80}} gl={{antialias: true, preserveDrawingBuffer: true}}>
            <Booth start={DROP} dur={S4 - DROP} />
          </ThreeCanvas>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.7) 100%)'}} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(5,7,6,0.85) 100%)'}} />
          <AbsoluteFill style={{padding: pad, justifyContent: 'flex-end', paddingBottom: tall ? 360 : 150}}>
            <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: 4, color: LIME, opacity: ease(f, DROP + 10, DROP + 24)}}>HOTCOIN AT TOKEN2049</div>
            <div style={{height: 16}} />
            <Rise at={DROP + k(2)} size={tall ? 104 : 92}>Find the</Rise>
            <Rise at={DROP + k(3)} size={tall ? 104 : 92} color={LIME}>green booth.</Rise>
          </AbsoluteFill>
          <div style={{position: 'absolute', left: pad, bottom: tall ? 250 : 60, opacity: ease(f, DROP + k(6), DROP + k(6) + 14), display: 'flex', gap: 14}}>
            {['Level 5', 'PB5-5 + PB5-6'].map((c) => (
              <div key={c} style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, color: WHITE, padding: '12px 24px', borderRadius: 40, border: `1.5px solid ${LIME}`, background: 'rgba(5,7,6,0.6)'}}>{c}</div>
            ))}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* 4. TOKEN2049 Week, one day per two beats */}
      {week.map((w, i) => <Clip key={w.d} name={w.clip} from={S4 + k(i * 2)} dur={k(2)} trim={w.trim} dim={0.5} />)}
      {f >= S4 && f < END ? (() => {
        const i = Math.min(3, Math.floor((f - S4) / k(2))), w = week[i], at = S4 + k(i * 2);
        return (
          <AbsoluteFill style={{padding: pad, justifyContent: 'center'}}>
            <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: 4, color: GREY}}>TOKEN2049 WEEK</div>
            <div style={{height: 18}} />
            <Rise at={at} size={tall ? 150 : 128} font={DISPLAY} color={LIME} h={tall ? 156 : 134}>{w.d}</Rise>
            <Rise at={at + 6} size={tall ? 58 : 52}>{w.t}</Rise>
          </AbsoluteFill>
        );
      })() : null}

      {/* 5. End card */}
      {f >= END ? (
        <AbsoluteFill style={{background: INK, alignItems: 'center', justifyContent: 'center'}}>
          <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, rgba(126,194,90,0.22), rgba(0,0,0,0) 55%)', opacity: ease(f, END, END + 30)}} />
          <div style={{textAlign: 'center'}}>
            <Rise at={END + 2} size={tall ? 120 : 104} font={DISPLAY} h={tall ? 126 : 110}>SINGAPORE</Rise>
            <Rise at={END + k(1)} size={tall ? 120 : 104} font={DISPLAY} h={tall ? 126 : 110}>INCOMING<span style={{color: LIME}}>.</span></Rise>
            <div style={{height: 70}} />
            <Img src={staticFile('brand/logo-official-white.png')} style={{width: 440, height: (440 * 328) / 2005, opacity: ease(f, END + k(2), END + k(2) + 16), transform: `scale(${0.94 + 0.06 * ease(f, END + k(2), END + k(2) + 20)})`}} />
            <div style={{height: 34}} />
            <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 28, lineHeight: 1.7, letterSpacing: 2, color: GREY, opacity: ease(f, END + k(3), END + k(3) + 14)}}>
              HOTCOIN × TOKEN2049 · 7–8 OCT<br />MARINA BAY SANDS · {BOOTH_LABEL.toUpperCase()}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* beat flashes on section changes */}
      <AbsoluteFill style={{background: '#fff', opacity: Math.max(flash(S2), flash(DROP) * 1.4, flash(S4), flash(END)), pointerEvents: 'none'}} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '384px 384px', mixBlendMode: 'overlay', opacity: 0.16}} />

      <Audio src={staticFile('t49/deep-urban.mp3')} trimBefore={Math.round(MUSIC_START_S * FPS)}
        volume={(fr) => interpolate(fr, [0, 6, T49_DURATION - 70, T49_DURATION], [0, 1, 1, 0], clamp)} />
      <Sequence from={DROP - 40} durationInFrames={80} layout="none"><Audio src={staticFile('sfx/foley/swell.wav')} volume={0.45} /></Sequence>
      <Sequence from={DROP - 1} layout="none"><Audio src={staticFile('sfx/foley/thump.wav')} volume={0.8} /></Sequence>
      <Sequence from={END - 1} layout="none"><Audio src={staticFile('sfx/foley/hit.wav')} volume={0.6} /></Sequence>
    </AbsoluteFill>
  );
};
