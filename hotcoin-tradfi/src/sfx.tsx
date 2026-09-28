import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {soundFor} from './soundmap';

// One uisfx pack (CC0) for every event. Files are copied from node_modules/uisfx/sounds into public/sfx (npm run sfx).
export const PACK = 'studio';

// Scenes 3 to 7 run on a clock shifted by this many frames (see OFF in Film.tsx).
const OFF = 100;

// [frame, cue, volume]
const EARLY: [number, string, number][] = [
  [30, 'press', 0.9],        // click on the stage, dot pops
  [40, 'expand', 0.7],       // dot opens into the first card
  [60, 'select', 0.6],       // Trade
  [105, 'toggle-on', 0.7],   // USDT pill pops
  [120, 'drag-start', 0.7],
  [130, 'seek', 0.6], [160, 'seek', 0.6], [190, 'seek', 0.6], [220, 'seek', 0.7],
  [230, 'drop', 0.7],
  [250, 'press', 0.9],       // click USDT
  [256, 'swipe', 0.8],       // ink flood
  [280, 'collapse', 0.7],    // ink contracts into the website window
  [326, 'press', 0.8],       // Metal tab
  [358, 'press', 0.8],       // ETF tab
  [384, 'swipe', 0.6],       // zoom through into the app
];
const LATER: [number, string, number][] = [
  [330, 'select', 0.5], [420, 'select', 0.5], [510, 'select', 0.5], [606, 'select', 0.5],
  [585, 'swipe', 0.6],       // zoom through to the order panel
  [690, 'press', 0.9],       // Open Long
  [694, 'expand', 0.8],      // button floods green
  [720, 'collapse', 0.7],    // green contracts into the coin
  [752, 'reward', 0.7],      // coin spins in
  [780, 'select', 0.6],      // USDT
  [930, 'collapse', 0.6],    // coin turns edge-on
  [960, 'press', 0.9],       // click the edge
  [962, 'expand', 0.8],      // ink flood
  [990, 'success', 0.8],     // end card
];
export const CUES = [...EARLY, ...LATER.map(([f, c, v]) => [f + OFF, c, v] as [number, string, number])];

export const SFX: React.FC = () => (
  <>
    {CUES.map(([f, cue, vol], i) => (
      <Sequence key={i} from={f} durationInFrames={120} layout="none">
        {(() => {const s = soundFor(cue, vol); return <Audio src={staticFile(s.src)} volume={s.volume} />;})()}
      </Sequence>
    ))}
  </>
);
