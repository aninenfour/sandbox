import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Rig, walk, run, idle, slumpWalk, carry, bend, shrug, wave, cheer, sit, ride, lookDown} from './rig';
export const RigTest: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / 30;
  const poses = [walk(0.6), walk(2.2), run(1.0), idle(t), slumpWalk(1.2), carry(walk(0.6)), bend(), shrug(t), wave(t), cheer(0.2), sit(t), ride(t), lookDown()];
  return (
    <AbsoluteFill style={{background: '#1A2030'}}>
      {poses.map((p, i) => <Rig key={i} x={120 + (i % 4) * 260} y={500 + Math.floor(i / 4) * 470} s={0.85} p={p} />)}
    </AbsoluteFill>
  );
};
