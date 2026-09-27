import React from 'react';
import {Composition} from 'remotion';
import {Film, DURATION} from './Film';

export const Root: React.FC = () => (
  <>
    <Composition id="TradFi-9x16" component={Film} durationInFrames={DURATION} fps={60} width={1080} height={1920} defaultProps={{square: false}} />
    <Composition id="TradFi-1x1" component={Film} durationInFrames={DURATION} fps={60} width={1080} height={1080} defaultProps={{square: true}} />
  </>
);
