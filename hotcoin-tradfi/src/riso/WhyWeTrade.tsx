import React from 'react';
import {Print, RisoFilm, duration} from './film';
import {ForThem, Intro, LongRun, Outro, Saving, Trip} from './scenes';

// "Why we trade": six risograph prints, each one sliding up over the last like a fresh sheet off the drum.
const PRINTS: Print[] = [
  {C: Intro, len: 105},
  {C: Saving, len: 120},
  {C: Trip, len: 115},
  {C: ForThem, len: 115},
  {C: LongRun, len: 120},
  {C: Outro, len: 150},
];
export const WWT_DURATION = duration(PRINTS);

export const WhyWeTrade: React.FC<{music?: string; musicFrom?: number; square?: boolean}> = ({music = 'music/walking-in-the-park.mp3', musicFrom = 0, square = false}) => (
  <RisoFilm prints={PRINTS} music={music} musicFrom={musicFrom} square={square} />
);
