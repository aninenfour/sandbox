import React from 'react';
import {Composition} from 'remotion';
import {Film, DURATION} from './Film';
import {AltA} from './alt/AltA';
import {AltB} from './alt/AltB';
import {AltC} from './alt/AltC';
import {Orbit, ORBIT_DURATION} from './alt/Orbit';
import {Horizon, HORIZON_DURATION} from './alt/Horizon';
import {Platform, PLATFORM_DURATION} from './platform/Platform';
import {Launch, LAUNCH_DURATION} from './v2/Launch';
import {Meme, MEME_DURATION} from './meme/Meme';
import {Carousel, CAROUSEL_W, CAROUSEL_H} from './referral/Carousel';
import {Uptober, UPTOBER_DURATION} from './uptober/Uptober';
import {Rowing, ROWING_DURATION} from './rowing/Rowing';
import {Guess} from './guess/Guess';
import {GoldRush, GOLDRUSH_DURATION} from './goldrush/GoldRush';
import {T49, T49_DURATION} from './t49/T49';
import {TradeCarousel, TRADE_W, TRADE_H} from './trade/TradeCarousel';
import {History, HIST_DURATION} from './hist/History';
import {Raccoon} from './raccoon/Raccoon';
import {Live, LIVE_W, LIVE_H, SHOTS} from './live/Live';
import {ReplyPoster} from './promo/ReplyPoster';

export const Root: React.FC = () => (
  <>
    <Composition id="TradFi-4x5" component={Film} durationInFrames={DURATION} fps={60} width={1080} height={1350} defaultProps={{square: false}} />
    <Composition id="TradFi-9x16" component={Film} durationInFrames={DURATION} fps={60} width={1080} height={1920} defaultProps={{square: false}} />
    <Composition id="TradFi-1x1" component={Film} durationInFrames={DURATION} fps={60} width={1080} height={1080} defaultProps={{square: true}} />
    <Composition id="Alt-A-Orbit" component={AltA} durationInFrames={120} fps={60} width={1080} height={1350} />
    <Composition id="Alt-B-Halftone" component={AltB} durationInFrames={120} fps={60} width={1080} height={1350} />
    <Composition id="Alt-C-Horizon" component={AltC} durationInFrames={120} fps={60} width={1080} height={1350} />
    <Composition id="Orbit-4x5" component={Orbit} durationInFrames={ORBIT_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="Horizon-4x5" component={Horizon} durationInFrames={HORIZON_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="Platform-4x5" component={Platform} durationInFrames={PLATFORM_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="Launch-4x5" component={Launch} durationInFrames={LAUNCH_DURATION} fps={60} width={1080} height={1350} />
    {SHOTS.map((sh, i) => <Composition key={i} id={`Live-${i + 1}`} component={Live} defaultProps={{i}} durationInFrames={1} fps={30} width={sh.w ?? LIVE_W} height={sh.h ?? LIVE_H} />)}
    <Composition id="ReplyPoster" component={ReplyPoster} durationInFrames={1} fps={30} width={1080} height={1350} />
    <Composition id="Raccoon" component={Raccoon} durationInFrames={1} fps={30} width={1440} height={1882} />
    <Composition id="History-9x16" component={History} durationInFrames={HIST_DURATION} fps={60} width={1080} height={1920} />
    <Composition id="History-4x5" component={History} durationInFrames={HIST_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="Trade-Carousel" component={TradeCarousel} durationInFrames={1} fps={30} width={TRADE_W} height={TRADE_H} />
    <Composition id="T49-9x16" component={T49} durationInFrames={T49_DURATION} fps={60} width={1080} height={1920} />
    <Composition id="T49-4x5" component={T49} durationInFrames={T49_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="GoldRush-4x5" component={GoldRush} durationInFrames={GOLDRUSH_DURATION} fps={60} width={1080} height={1350} />
    <Composition id="GoldRush-9x16" component={GoldRush} durationInFrames={GOLDRUSH_DURATION} fps={60} width={1080} height={1920} />
    <Composition id="Guess-1x1" component={Guess} durationInFrames={1} fps={30} width={1080} height={1080} />
    <Composition id="Rowing-9x16" component={Rowing} durationInFrames={ROWING_DURATION} fps={30} width={720} height={1280} />
    <Composition id="Uptober-4x5" component={Uptober} durationInFrames={UPTOBER_DURATION} fps={30} width={1080} height={1350} />
    <Composition id="Referral-Carousel" component={Carousel} durationInFrames={1} fps={60} width={CAROUSEL_W} height={CAROUSEL_H} />
    <Composition id="Meme-4x5" component={Meme} durationInFrames={MEME_DURATION} fps={60} width={1080} height={1350} />
  </>
);
