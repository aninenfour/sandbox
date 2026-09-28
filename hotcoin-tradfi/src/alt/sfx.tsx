import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {soundFor} from '../soundmap';

// uisfx `studio` pack (CC0), copied into public/sfx by `npm run sfx`.
export const SfxTrack: React.FC<{cues: [number, string, number][]}> = ({cues}) => (
  <>
    {cues.map(([f, cue, vol], i) => (
      <Sequence key={i} from={f} durationInFrames={120} layout="none">
        {(() => {const s = soundFor(cue, vol); return <Audio src={staticFile(s.src)} volume={s.volume} />;})()}
      </Sequence>
    ))}
  </>
);
