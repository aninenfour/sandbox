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
import {LevelUp, LEVELUP_DURATION} from './levelup/LevelUp';

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
    <Composition id="LevelUp2-CN" component={LevelUp} durationInFrames={LEVELUP_DURATION} fps={60} width={1080} height={1080} defaultProps={{lang: 'cn' as const}} />
    <Composition id="LevelUp2-EN" component={LevelUp} durationInFrames={LEVELUP_DURATION} fps={60} width={1080} height={1080} defaultProps={{lang: 'en' as const}} />
  </>
);
