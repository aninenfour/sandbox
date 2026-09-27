import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

// uisfx `studio` pack (CC0), copied into public/sfx by `npm run sfx`.
export const SfxTrack: React.FC<{cues: [number, string, number][]}> = ({cues}) => (
  <>
    {cues.map(([f, cue, vol], i) => (
      <Sequence key={i} from={f} durationInFrames={120} layout="none">
        <Audio src={staticFile(`sfx/studio/${cue}.mp3`)} volume={vol} />
      </Sequence>
    ))}
  </>
);
