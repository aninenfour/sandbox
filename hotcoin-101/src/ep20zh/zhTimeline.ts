// Timeline for a Chinese take. Tokens are single characters (latin runs kept
// together), so cues are found by phrase. Each English cue key used by the
// FILE 020 scenes maps to the Chinese phrase it should land on.
type W = {word: string; at: number; until: number};
type Words = {words: W[]};
type Map = Record<string, string>;

const finder = (list: W[], map: Map, label: string) => {
  let joined = '';
  const owner: number[] = [];
  list.forEach((t, i) => {
    for (let k = 0; k < t.word.length; k++) owner.push(i);
    joined += t.word;
  });
  return (key: string, n = 1) => {
    const phrase = map[`${key}#${n}`] ?? (n === 1 ? map[key] : undefined);
    if (!phrase) throw new Error(`no ${label} cue for ${key} #${n}`);
    const idx = joined.indexOf(phrase);
    if (idx < 0) throw new Error(`${label} phrase not found: ${phrase}`);
    return list[owner[idx]].at;
  };
};

export const makeTimelineZh = (
  open: Words,
  body: Words,
  close: Words,
  maps: {open: Map; body: Map; close: Map},
  opts: {titleLen?: number; endHold?: number; closeGap?: number; tail?: number} = {},
) => {
  const OPEN_AT = 12;
  const openEnd = open.words[open.words.length - 1].until;
  const TITLE_AT = Math.round(OPEN_AT + openEnd + 8);
  const BODY_AT = TITLE_AT + (opts.titleLen ?? 100);
  const bodyEnd = BODY_AT + body.words[body.words.length - 1].until;
  const CLOSE_AT = Math.round(bodyEnd + (opts.closeGap ?? 30));
  const voiceEnd = CLOSE_AT + close.words[close.words.length - 1].until;
  const END_AT = Math.round(voiceEnd + (opts.tail ?? 16));
  const TOTAL = END_AT + (opts.endHold ?? 130);
  const fo = finder(open.words, maps.open, 'open');
  const fb = finder(body.words, maps.body, 'body');
  const fc = finder(close.words, maps.close, 'close');
  return {
    OPEN_AT, TITLE_AT, BODY_AT, CLOSE_AT, END_AT, TOTAL,
    w: (key: string, n = 1) => BODY_AT + fb(key, n),
    ow: (key: string, n = 1) => OPEN_AT + fo(key, n),
    cw: (key: string, n = 1) => CLOSE_AT + fc(key, n),
  };
};
