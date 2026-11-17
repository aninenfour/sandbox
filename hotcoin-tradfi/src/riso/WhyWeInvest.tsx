import React from 'react';
import {Print, RisoFilm, duration} from './film';
import {HomeKey, InvestIntro, InvestOutro, SleepWell, SlowMornings, Snowball} from './invest';

// "Why we invest": the follow-up to "Why we trade", same pace and print rhythm.
const PRINTS: Print[] = [
  {C: InvestIntro, len: 105},
  {C: Snowball, len: 120},
  {C: HomeKey, len: 115},
  {C: SlowMornings, len: 115},
  {C: SleepWell, len: 120},
  {C: InvestOutro, len: 150},
];
export const WWI_DURATION = duration(PRINTS);

export const WhyWeInvest: React.FC<{music?: string; musicFrom?: number; square?: boolean}> = ({music = 'music/walking-in-the-park.mp3', musicFrom = 0, square = false}) => (
  <RisoFilm prints={PRINTS} music={music} musicFrom={musicFrom} square={square} />
);
