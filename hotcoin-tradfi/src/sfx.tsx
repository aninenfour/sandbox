import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

// One uisfx pack (CC0) for every event. Files are copied from node_modules/uisfx/sounds into public/sfx (npm run sfx).
export const PACK = 'studio';

// [frame, cue, volume]
export const CUES: [number, string, number][] = [
  [30, 'press', 0.9],        // click on paper, dot pops
  [40, 'expand', 0.7],       // dot becomes the plate card
  [60, 'select', 0.6],       // Trade
  [90, 'select', 0.6],       // ticker slot
  [105, 'toggle-on', 0.7],   // USDT pill pops
  [140, 'drag-start', 0.7],
  [150, 'seek', 0.6], [180, 'seek', 0.6], [210, 'seek', 0.6], [240, 'seek', 0.7],
  [250, 'drop', 0.7],
  [270, 'press', 0.9],       // click USDT
  [276, 'swipe', 0.8],       // ink flood
  [300, 'collapse', 0.7],    // flood contracts into the app window
  [330, 'select', 0.5], [420, 'select', 0.5], [510, 'select', 0.5], [606, 'select', 0.5],
  [585, 'swipe', 0.6],       // zoom through
  [690, 'press', 0.9],       // Open Long
  [694, 'expand', 0.8],      // button floods green
  [720, 'collapse', 0.7],    // green contracts into the 0
  [752, 'reward', 0.7],      // coin spins in
  [780, 'select', 0.6],      // USDT
  [930, 'collapse', 0.6],    // 0 becomes a dot
  [960, 'press', 0.9],       // click the dot
  [962, 'expand', 0.8],      // ink flood
  [990, 'success', 0.8],     // end card
];

export const SFX: React.FC = () => (
  <>
    {CUES.map(([f, cue, vol], i) => (
      <Sequence key={i} from={f} durationInFrames={120} layout="none">
        <Audio src={staticFile(`sfx/${PACK}/${cue}.mp3`)} volume={vol} />
      </Sequence>
    ))}
  </>
);
