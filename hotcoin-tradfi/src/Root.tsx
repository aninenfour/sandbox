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
    <Composition id="Referral-Carousel" component={Carousel} durationInFrames={1} fps={60} width={CAROUSEL_W} height={CAROUSEL_H} />
    <Composition id="Meme-4x5" component={Meme} durationInFrames={MEME_DURATION} fps={60} width={1080} height={1350} />
  </>
);
