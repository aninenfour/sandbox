import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import tl from './timeline.json';
export const Root: React.FC = () => (
  <Composition id="Reel" component={Reel} durationInFrames={tl.voFrames + tl.endFrames} fps={tl.fps} width={1080} height={1920} />
);
