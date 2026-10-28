import React from 'react';
import {Composition, Still} from 'remotion';
import {Reel} from './Reel';
import {Thumb} from './Thumb';
import tl from './timeline.json';
export const Root: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} durationInFrames={tl.voFrames + tl.endFrames} fps={tl.fps} width={1080} height={1920} />
    <Still id="Thumb" component={Thumb} width={1080} height={1920}
      defaultProps={{text: 'Two pizzas for 10,000 bitcoin', hi: ['10,000', 'bitcoin'], kicker: 'True story'}} />
  </>
);
