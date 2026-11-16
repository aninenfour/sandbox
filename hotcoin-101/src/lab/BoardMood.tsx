import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Companion, type Beat} from '../companion/Companion';
import {type Mood} from '../companion/moods';
import {theme} from '../notebook/tokens';

// One portrait of the narrator for the character board: a mood, on paper or ink.
export type BoardMoodProps = {mood: Mood; ground: 'paper' | 'ink'; closed?: boolean; plain?: boolean; lx?: number; ly?: number};

export const BoardMood: React.FC<BoardMoodProps> = ({mood, ground, closed, plain, lx, ly}) => {
  const look: Beat['look'] = lx !== undefined && ly !== undefined ? {x: lx, y: ly} : 'camera';
  return (
    <AbsoluteFill style={{background: theme(ground).bg}}>
      <Companion id="board" trail={false} seed={3} ground={ground} floor={420} beats={[{at: -60, x: 280, y: 270, r: 150, mood, look, closed, plain}]} />
    </AbsoluteFill>
  );
};
