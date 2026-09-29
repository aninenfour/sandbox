import openWords from '../../public/vo/ep13-open.words.json';
import bodyWords from '../../public/vo/ep13-body-105.words.json';

// Everything in FILE 013 is placed on the voiceover's own word timings
// (30fps clock units). Regenerate the voice and the edit follows.

type W = {word: string; at: number; until: number};
const strip = (s: string) => s.replace(/[.,!?…;:]+$/g, '').replace(/\.\.\.$/, '');

const find = (list: W[], word: string, n: number) => {
  let k = 0;
  for (const w of list) {
    if (strip(w.word) === word && ++k === n) return w;
  }
  throw new Error(`word not found: ${word} #${n}`);
};

export const OPEN_AT = 12;
const openList = openWords.words as W[];
const bodyList = bodyWords.words as W[];
const openEnd = openList[openList.length - 1].until;

export const TITLE_AT = Math.round(OPEN_AT + openEnd + 8);
export const BODY_AT = TITLE_AT + 100;

/** global clock time of the nth occurrence of a body word (case-sensitive) */
export const w = (word: string, n = 1) => BODY_AT + find(bodyList, word, n).at;
/** global clock time of a cold-open word */
export const ow = (word: string, n = 1) => OPEN_AT + find(openList, word, n).at;

const bodyEnd = BODY_AT + bodyList[bodyList.length - 1].until;
export const END_AT = Math.round(bodyEnd + 16);
export const TOTAL = END_AT + 130;

// Scene starts. Pictures lead the voice slightly.
export const S = {
  open: 0,
  title: TITLE_AT,
  iron: BODY_AT - 4,
  receipts: w('So', 1) - 6,
  seal: w('In') - 8,
  print: w('Which') - 6,
  silver: w('The') - 6,
  sweden: w('Then') - 8,
  bank: w('So', 2) - 6,
  same: w('Two') - 8,
  trust: w('Paper') - 8,
  end: END_AT,
};

export const KEYS = Object.values(S);
